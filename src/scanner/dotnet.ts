import * as fs from "fs";
import * as path from "path";
import type { DetectedService, Evidence } from "./types.js";

// NuGet package name → service mapping (case-insensitive matching)
const DOTNET_SIGNATURES: Record<
  string,
  {
    name: string;
    category: DetectedService["category"];
    dataCollected: string[];
  }
> = {
  // Payment
  "stripe.net": {
    name: "stripe",
    category: "payment",
    dataCollected: ["payment information", "billing address", "email", "transaction history"],
  },

  // Monitoring
  sentry: {
    name: "sentry",
    category: "monitoring",
    dataCollected: ["error data", "stack traces", "user context", "device information"],
  },
  "sentry.aspnetcore": {
    name: "sentry",
    category: "monitoring",
    dataCollected: ["error data", "stack traces", "user context", "device information"],
  },

  // Storage
  "awssdk.s3": {
    name: "aws-s3",
    category: "storage",
    dataCollected: ["uploaded files", "file metadata"],
  },
  "google.cloud.storage.v1": {
    name: "google-cloud-storage",
    category: "storage",
    dataCollected: ["uploaded files", "file metadata"],
  },

  // Auth
  "microsoft.aspnetcore.identity": {
    name: "aspnetcore-identity",
    category: "auth",
    dataCollected: ["email", "password hash", "session data", "authentication tokens"],
  },
  "microsoft.aspnetcore.identity.entityframeworkcore": {
    name: "aspnetcore-identity",
    category: "auth",
    dataCollected: ["email", "password hash", "session data", "authentication tokens"],
  },

  // Email
  sendgrid: {
    name: "sendgrid",
    category: "email",
    dataCollected: ["email addresses", "email content"],
  },

  // Communication
  twilio: {
    name: "twilio",
    category: "other",
    dataCollected: ["phone numbers", "SMS message content", "voice call metadata"],
  },

  // Auth (Firebase)
  "firebase.auth": {
    name: "firebase-auth",
    category: "auth",
    dataCollected: ["email", "name", "OAuth tokens", "session data"],
  },
  "firebaseadmin": {
    name: "firebase-auth",
    category: "auth",
    dataCollected: ["email", "name", "OAuth tokens", "session data"],
  },
};

export function scanDotnetDependencies(projectPath: string): DetectedService[] {
  const detected = new Map<string, DetectedService>();

  // Find *.csproj files in root and immediate subdirectories
  const csprojFiles = collectCsprojFiles(projectPath);

  for (const csprojPath of csprojFiles) {
    const relPath = path.relative(projectPath, csprojPath) || path.basename(csprojPath);
    scanCsproj(csprojPath, relPath, detected);
  }

  // Scan appsettings.json for service configurations
  scanAppSettings(projectPath, detected);

  return Array.from(detected.values());
}

function scanAppSettings(projectPath: string, detected: Map<string, DetectedService>) {
  const settingsFiles = [
    "appsettings.json",
    "appsettings.Development.json",
    "appsettings.Production.json",
  ];

  for (const filename of settingsFiles) {
    // Check root and one level deep
    const candidates = [path.join(projectPath, filename)];
    try {
      const entries = fs.readdirSync(projectPath, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith(".") && !["bin", "obj", "node_modules"].includes(entry.name)) {
          candidates.push(path.join(projectPath, entry.name, filename));
        }
      }
    } catch {
      // ignore
    }

    for (const filePath of candidates) {
      if (!fs.existsSync(filePath)) continue;

      let content: string;
      try {
        content = fs.readFileSync(filePath, "utf-8");
      } catch {
        continue;
      }

      const relPath = path.relative(projectPath, filePath) || filename;

      const settingsPatterns: { pattern: RegExp; name: string; category: DetectedService["category"]; dataCollected: string[] }[] = [
        { pattern: /ConnectionStrings/i, name: "dotnet-database", category: "database", dataCollected: ["user data as defined in schema", "database records"] },
        { pattern: /SendGrid|SENDGRID/i, name: "sendgrid", category: "email", dataCollected: ["email addresses", "email content"] },
        { pattern: /Stripe|STRIPE/i, name: "stripe", category: "payment", dataCollected: ["payment information", "billing address", "email", "transaction history"] },
        { pattern: /Redis|REDIS/i, name: "dotnet-redis", category: "database", dataCollected: ["cached data", "session data"] },
        { pattern: /ApplicationInsights|InstrumentationKey/i, name: "azure-app-insights", category: "monitoring", dataCollected: ["telemetry data", "error data", "user behavior", "performance metrics"] },
        { pattern: /AzureAd|AzureAdB2C|Microsoft\.Identity/i, name: "azure-ad", category: "auth", dataCollected: ["email", "name", "OAuth tokens", "session data"] },
        { pattern: /BlobStorage|AzureBlobStorage|StorageAccount/i, name: "azure-blob-storage", category: "storage", dataCollected: ["uploaded files", "file metadata"] },
        { pattern: /Twilio|TWILIO/i, name: "twilio", category: "other", dataCollected: ["phone numbers", "SMS message content", "voice call metadata"] },
        { pattern: /Auth0|AUTH0/i, name: "auth0", category: "auth", dataCollected: ["email", "name", "OAuth tokens", "session data"] },
      ];

      for (const sp of settingsPatterns) {
        if (sp.pattern.test(content) && !detected.has(sp.name)) {
          detected.set(sp.name, {
            name: sp.name,
            category: sp.category,
            evidence: [{ type: "code_pattern", file: relPath, detail: `Found ${sp.name} config in ${relPath}` }],
            dataCollected: sp.dataCollected,
          });
        }
      }

      // Deep-parse ConnectionStrings section for database provider details
      parseConnectionStrings(content, relPath, detected);
    }
  }
}

function parseConnectionStrings(content: string, relPath: string, detected: Map<string, DetectedService>) {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(content);
  } catch {
    return;
  }

  const connStrings = parsed["ConnectionStrings"] as Record<string, string> | undefined;
  if (!connStrings || typeof connStrings !== "object") return;

  for (const [connName, connValue] of Object.entries(connStrings)) {
    if (typeof connValue !== "string") continue;

    const lowerConn = connValue.toLowerCase();
    let dbType = "database";
    if (lowerConn.includes("server=") || lowerConn.includes("sqlserver") || lowerConn.includes("mssql")) {
      dbType = "sql-server";
    } else if (lowerConn.includes("host=") && lowerConn.includes("port=5432")) {
      dbType = "postgresql";
    } else if (lowerConn.includes("mysql") || lowerConn.includes("port=3306")) {
      dbType = "mysql";
    } else if (lowerConn.includes(".db") || lowerConn.includes("sqlite")) {
      dbType = "sqlite";
    }

    const serviceName = `dotnet-connstring-${connName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    if (!detected.has(serviceName)) {
      detected.set(serviceName, {
        name: serviceName,
        category: "database",
        evidence: [{ type: "code_pattern", file: relPath, detail: `ConnectionString "${connName}" (${dbType}) in ${relPath}` }],
        dataCollected: ["database records", "user data as defined in schema"],
      });
    }
  }
}

function collectCsprojFiles(projectPath: string): string[] {
  const files: string[] = [];

  // Check root directory
  try {
    const entries = fs.readdirSync(projectPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith(".csproj")) {
        files.push(path.join(projectPath, entry.name));
      } else if (
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        !["node_modules", "bin", "obj", "packages", "artifacts"].includes(entry.name)
      ) {
        // Check one level deep for .csproj files
        try {
          const subEntries = fs.readdirSync(path.join(projectPath, entry.name), { withFileTypes: true });
          for (const subEntry of subEntries) {
            if (subEntry.isFile() && subEntry.name.endsWith(".csproj")) {
              files.push(path.join(projectPath, entry.name, subEntry.name));
            }
          }
        } catch {
          // ignore subdirectory read errors
        }
      }
    }
  } catch {
    // ignore directory read errors
  }

  return files;
}

function scanCsproj(
  filePath: string,
  relativeFile: string,
  detected: Map<string, DetectedService>
) {
  let content: string;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch {
    return;
  }

  // Match <PackageReference Include="PackageName" ... />
  const pkgRefRegex = /<PackageReference\s+Include=["']([^"']+)["']/gi;
  let match;
  while ((match = pkgRefRegex.exec(content)) !== null) {
    const packageName = match[1].trim();
    matchDotnetPackage(packageName, relativeFile, detected);
  }
}

function matchDotnetPackage(
  packageName: string,
  filename: string,
  detected: Map<string, DetectedService>
) {
  const lowerName = packageName.toLowerCase();

  const sig = DOTNET_SIGNATURES[lowerName];
  if (!sig) return;

  const evidence: Evidence = {
    type: "dependency",
    file: filename,
    detail: packageName.substring(0, 100),
  };

  if (detected.has(sig.name)) {
    detected.get(sig.name)!.evidence.push(evidence);
  } else {
    detected.set(sig.name, {
      name: sig.name,
      category: sig.category,
      evidence: [evidence],
      dataCollected: [...sig.dataCollected],
    });
  }
}
