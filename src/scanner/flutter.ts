import * as fs from "fs";
import * as path from "path";
import type { DetectedService, Evidence } from "./types.js";

/**
 * Flutter/Dart package name → service mapping.
 * Keys are pub.dev package names as they appear in pubspec.yaml.
 */
const FLUTTER_SIGNATURES: Record<
  string,
  {
    name: string;
    category: DetectedService["category"];
    dataCollected: string[];
    isDataProcessor?: boolean;
  }
> = {
  // Firebase
  firebase_core: {
    name: "firebase_core",
    category: "analytics",
    dataCollected: [
      "user behavior",
      "device information",
      "crash data",
      "app performance metrics",
    ],
  },
  firebase_auth: {
    name: "firebase_auth",
    category: "auth",
    dataCollected: [
      "email",
      "name",
      "phone number",
      "OAuth tokens",
      "session data",
    ],
  },
  firebase_analytics: {
    name: "firebase_analytics",
    category: "analytics",
    dataCollected: [
      "user behavior",
      "device information",
      "app events",
      "screen views",
    ],
  },
  cloud_firestore: {
    name: "cloud_firestore",
    category: "database",
    dataCollected: ["user data as defined in schema", "document content"],
  },

  // Payment
  stripe_sdk: {
    name: "stripe_sdk",
    category: "payment",
    dataCollected: [
      "payment information",
      "billing address",
      "email",
      "transaction history",
    ],
  },
  flutter_stripe: {
    name: "flutter_stripe",
    category: "payment",
    dataCollected: [
      "payment information",
      "billing address",
      "email",
      "transaction history",
    ],
  },

  // Monitoring
  sentry_flutter: {
    name: "sentry_flutter",
    category: "monitoring",
    dataCollected: [
      "error data",
      "stack traces",
      "user context",
      "device information",
    ],
  },

  // Database / Auth
  supabase_flutter: {
    name: "supabase_flutter",
    category: "auth",
    dataCollected: [
      "email",
      "password hash",
      "session data",
      "user metadata",
      "database content",
    ],
  },

  // Analytics
  amplitude_flutter: {
    name: "amplitude_flutter",
    category: "analytics",
    dataCollected: ["user behavior", "device information", "session data"],
  },
  mixpanel_flutter: {
    name: "mixpanel_flutter",
    category: "analytics",
    dataCollected: [
      "user behavior",
      "user profiles",
      "device information",
      "location data",
    ],
  },

  // Notifications
  onesignal_flutter: {
    name: "onesignal_flutter",
    category: "other",
    dataCollected: [
      "device tokens",
      "user segments",
      "notification engagement",
      "device information",
    ],
  },

  // Auth
  google_sign_in: {
    name: "google_sign_in",
    category: "auth",
    dataCollected: ["email", "name", "Google profile data", "OAuth tokens"],
  },
  flutter_facebook_auth: {
    name: "flutter_facebook_auth",
    category: "auth",
    dataCollected: [
      "email",
      "name",
      "Facebook profile data",
      "OAuth tokens",
      "social connections",
    ],
  },
};

/**
 * Scan a Flutter/Dart project's pubspec.yaml for known service dependencies.
 */
export function scanFlutterDependencies(projectPath: string): DetectedService[] {
  const detected = new Map<string, DetectedService>();

  const pubspecPath = path.join(projectPath, "pubspec.yaml");
  if (fs.existsSync(pubspecPath)) {
    scanPubspecYaml(pubspecPath, detected);
  }

  return Array.from(detected.values());
}

/**
 * Parse pubspec.yaml and match dependencies against known Flutter/Dart signatures.
 *
 * Handles two common formats:
 *   dependencies:
 *     package_name: ^1.0.0
 *
 *   dependencies:
 *     package_name:
 *       version: ^1.0.0
 */
function scanPubspecYaml(
  filePath: string,
  detected: Map<string, DetectedService>,
): void {
  let content: string;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch {
    return;
  }

  const lines = content.split("\n");
  let inDependencies = false;

  for (const line of lines) {
    const trimmed = line.trimEnd();

    // Detect dependency sections (dependencies: or dev_dependencies:)
    if (/^dependencies\s*:/.test(trimmed) || /^dev_dependencies\s*:/.test(trimmed)) {
      inDependencies = true;
      continue;
    }

    // A new top-level key (no leading whitespace) ends the dependency section
    if (inDependencies && trimmed.length > 0 && !trimmed.startsWith(" ") && !trimmed.startsWith("\t")) {
      inDependencies = false;
      continue;
    }

    if (!inDependencies) continue;

    // Match "  package_name: ^version" or "  package_name:" (multi-line format)
    const pkgMatch = trimmed.match(/^\s{2,}([a-zA-Z0-9_]+)\s*:/);
    if (pkgMatch) {
      const pkgName = pkgMatch[1];
      matchFlutterPackage(pkgName, trimmed.trim(), "pubspec.yaml", detected);
    }
  }
}

function matchFlutterPackage(
  pkgName: string,
  rawLine: string,
  filename: string,
  detected: Map<string, DetectedService>,
): void {
  const sig = FLUTTER_SIGNATURES[pkgName];
  if (!sig) return;

  const evidence: Evidence = {
    type: "dependency",
    file: filename,
    detail: rawLine.substring(0, 100),
  };

  if (detected.has(sig.name)) {
    detected.get(sig.name)!.evidence.push(evidence);
  } else {
    detected.set(sig.name, {
      name: sig.name,
      category: sig.category,
      evidence: [evidence],
      dataCollected: [...sig.dataCollected],
      isDataProcessor: sig.isDataProcessor,
    });
  }
}
