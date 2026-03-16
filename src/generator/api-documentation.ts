import * as fs from "fs";
import * as path from "path";
import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";
import { type WalkedFile, walkDirectory } from "../scanner/file-walker.js";

/**
 * Generates API_PRIVACY_DOCUMENTATION.md — for each detected API endpoint,
 * documents what data it accepts and maps to privacy policy sections.
 *
 * Useful for API-first companies that need to document data flows through
 * their API surface area.
 *
 * Returns null when no API routes are detected.
 */
export function generateApiPrivacyDocumentation(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const date = new Date().toISOString().split("T")[0];

  // Check if API Data Collection category exists
  const apiCategory = scan.dataCategories.find((c) => c.category === "API Data Collection");

  // Also scan for route files directly
  const endpoints = detectApiEndpoints(scan.projectPath);

  if (!apiCategory && endpoints.length === 0) return null;

  const sections: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────
  sections.push("# API Privacy Documentation");
  sections.push("");
  sections.push(`**Last updated:** ${date}`);
  sections.push("");
  sections.push(`**Organization:** ${company}`);
  sections.push("");
  sections.push(`**Project:** ${scan.projectName}`);
  sections.push("");
  sections.push(
    "This document maps API endpoints to the types of personal data they process, " +
    "providing transparency for privacy compliance. Each endpoint is linked to the " +
    "relevant section of the Privacy Policy."
  );
  sections.push("");
  sections.push(`For questions about API data handling, contact ${contactEmail}.`);

  // ── Overview ────────────────────────────────────────────────────────
  sections.push("");
  sections.push("## Overview");
  sections.push("");
  if (apiCategory) {
    sections.push(apiCategory.description);
    sections.push("");
  }
  sections.push(`Total API endpoints detected: **${endpoints.length}**`);
  sections.push("");

  const dataAcceptingEndpoints = endpoints.filter((e) => e.fields.length > 0);
  const readOnlyEndpoints = endpoints.filter((e) => e.fields.length === 0 && e.method === "GET");
  const writeEndpoints = endpoints.filter((e) => ["POST", "PUT", "PATCH", "DELETE", "MUTATION"].includes(e.method));

  sections.push("| Metric | Count |");
  sections.push("|--------|-------|");
  sections.push(`| Endpoints accepting user data | ${dataAcceptingEndpoints.length} |`);
  sections.push(`| Write endpoints (POST/PUT/PATCH/DELETE) | ${writeEndpoints.length} |`);
  sections.push(`| Read-only endpoints (GET/QUERY) | ${readOnlyEndpoints.length} |`);

  // ── Endpoint Summary Table ──────────────────────────────────────────
  if (endpoints.length > 0) {
    sections.push("");
    sections.push("## Endpoint Summary");
    sections.push("");
    sections.push("| Endpoint | Method | Data Fields | Privacy Category |");
    sections.push("|----------|--------|-------------|-----------------|");

    for (const ep of endpoints) {
      const fieldList = ep.fields.length > 0 ? ep.fields.join(", ") : "—";
      const categories = ep.fields.length > 0
        ? [...new Set(ep.fields.map(mapFieldToPrivacyCategory))].join(", ")
        : "—";
      sections.push(`| \`${ep.route}\` | ${ep.method} | ${fieldList} | ${categories} |`);
    }
  }

  // ── Privacy Category Mapping ────────────────────────────────────────
  sections.push("");
  sections.push("## Privacy Policy Mapping");
  sections.push("");
  sections.push(
    "The following table maps data categories collected through the API to " +
    "the corresponding sections in your Privacy Policy."
  );
  sections.push("");
  sections.push("| Data Category | Privacy Policy Section | Legal Basis (GDPR) | Retention |");
  sections.push("|--------------|----------------------|-------------------|-----------|");

  // Collect all unique field categories
  const allFieldCategories = new Set<string>();
  for (const ep of endpoints) {
    for (const field of ep.fields) {
      allFieldCategories.add(mapFieldToPrivacyCategory(field));
    }
  }

  // Also add from scan data categories
  for (const cat of scan.dataCategories) {
    allFieldCategories.add(cat.category);
  }

  const categoryPolicySections: Record<string, { section: string; legalBasis: string; retention: string }> = {
    "Identity": {
      section: "Personal Information We Collect",
      legalBasis: "Contractual necessity (Art. 6(1)(b))",
      retention: "Duration of account + [X] days",
    },
    "Contact": {
      section: "Personal Information We Collect",
      legalBasis: "Contractual necessity (Art. 6(1)(b))",
      retention: "Duration of account + [X] days",
    },
    "Authentication": {
      section: "How We Protect Your Information",
      legalBasis: "Contractual necessity (Art. 6(1)(b))",
      retention: "Duration of account",
    },
    "Financial": {
      section: "Payment Information",
      legalBasis: "Contractual necessity (Art. 6(1)(b))",
      retention: "As required by tax/accounting laws",
    },
    "Sensitive": {
      section: "Special Categories of Data",
      legalBasis: "Explicit consent (Art. 9(2)(a))",
      retention: "[Define based on purpose]",
    },
    "Location": {
      section: "Automatically Collected Information",
      legalBasis: "Legitimate interest (Art. 6(1)(f))",
      retention: "[X] days",
    },
    "Usage & Behavioral Data": {
      section: "Automatically Collected Information",
      legalBasis: "Legitimate interest (Art. 6(1)(f))",
      retention: "[X] days",
    },
    "AI Interaction Data": {
      section: "AI and Automated Processing",
      legalBasis: "Contractual necessity / Consent",
      retention: "[X] days",
    },
    "Personal Identity Data": {
      section: "Personal Information We Collect",
      legalBasis: "Contractual necessity (Art. 6(1)(b))",
      retention: "Duration of account + [X] days",
    },
    "Communication Data": {
      section: "Communications",
      legalBasis: "Contractual necessity (Art. 6(1)(b))",
      retention: "[X] days",
    },
    "Technical & Diagnostic Data": {
      section: "Automatically Collected Information",
      legalBasis: "Legitimate interest (Art. 6(1)(f))",
      retention: "[X] days",
    },
    "User-Uploaded Content": {
      section: "User Content",
      legalBasis: "Contractual necessity (Art. 6(1)(b))",
      retention: "Until deletion requested",
    },
    "Business": {
      section: "Business Information",
      legalBasis: "Contractual necessity (Art. 6(1)(b))",
      retention: "Duration of business relationship",
    },
    "API Data Collection": {
      section: "Information You Provide via API",
      legalBasis: "Contractual necessity (Art. 6(1)(b))",
      retention: "Duration of account",
    },
  };

  for (const cat of allFieldCategories) {
    const mapping = categoryPolicySections[cat] || {
      section: "[Map to relevant section]",
      legalBasis: "[Determine legal basis]",
      retention: "[Define retention period]",
    };
    sections.push(`| ${cat} | ${mapping.section} | ${mapping.legalBasis} | ${mapping.retention} |`);
  }

  // ── Detailed Endpoint Documentation ─────────────────────────────────
  if (endpoints.length > 0) {
    sections.push("");
    sections.push("## Detailed Endpoint Documentation");
    sections.push("");

    for (const ep of endpoints) {
      sections.push(`### \`${ep.method} ${ep.route}\``);
      sections.push("");
      sections.push("| Property | Value |");
      sections.push("|----------|-------|");
      sections.push(`| **File** | \`${ep.file}\` |`);
      sections.push(`| **Method** | ${ep.method} |`);
      sections.push(`| **Route** | \`${ep.route}\` |`);

      if (ep.fields.length > 0) {
        sections.push(`| **Data fields** | ${ep.fields.join(", ")} |`);
        const cats = [...new Set(ep.fields.map(mapFieldToPrivacyCategory))];
        sections.push(`| **Privacy categories** | ${cats.join(", ")} |`);

        sections.push("");
        sections.push("**Data fields detail:**");
        sections.push("");
        sections.push("| Field | Category | Required | Purpose |");
        sections.push("|-------|----------|----------|---------|");
        for (const field of ep.fields) {
          const category = mapFieldToPrivacyCategory(field);
          sections.push(`| \`${field}\` | ${category} | [YES/NO] | [Describe purpose] |`);
        }
      } else {
        sections.push("| **Data fields** | None detected |");
      }
      sections.push("");
    }
  }

  // ── Data Flow per Service ───────────────────────────────────────────
  if (scan.services.length > 0) {
    sections.push("## API Data Flow to Third-Party Services");
    sections.push("");
    sections.push(
      "The following third-party services may receive data submitted through the API."
    );
    sections.push("");
    sections.push("| Service | Category | Data Shared | Purpose |");
    sections.push("|---------|----------|-------------|---------|");

    for (const service of scan.services) {
      if (service.isDataProcessor === false) continue;
      sections.push(
        `| ${service.name} | ${service.category} | ${service.dataCollected.join(", ")} | [Describe purpose] |`
      );
    }
  }

  // ── Recommendations ─────────────────────────────────────────────────
  sections.push("");
  sections.push("## Recommendations");
  sections.push("");
  sections.push("- [ ] Document the purpose and legal basis for each data field collected");
  sections.push("- [ ] Implement input validation on all endpoints accepting user data");
  sections.push("- [ ] Add rate limiting to prevent abuse of data-accepting endpoints");
  sections.push("- [ ] Ensure authentication is required for all endpoints accessing personal data");
  sections.push("- [ ] Implement field-level encryption for sensitive data (SSN, financial data)");
  sections.push("- [ ] Add API versioning to manage privacy-impacting changes");
  sections.push("- [ ] Log all data access for audit trail purposes");
  sections.push("- [ ] Document data retention periods for each endpoint's data");

  // ── Disclaimer ─────────────────────────────────────────────────────
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push(
    `*This API privacy documentation was generated by [Codepliant](https://github.com/joechensmartz/codepliant) ` +
    `based on an automated scan of the **${scan.projectName}** codebase. ` +
    `It should be reviewed by your engineering and legal teams to ensure accuracy and completeness. ` +
    `Fields marked with brackets require manual input.*`
  );
  sections.push("");

  return sections.join("\n");
}

// ── Helpers ───────────────────────────────────────────────────────────────

interface EndpointInfo {
  route: string;
  method: string;
  file: string;
  fields: string[];
}

/**
 * Map a field name to a privacy-relevant category.
 */
function mapFieldToPrivacyCategory(fieldName: string): string {
  const lower = fieldName.toLowerCase();

  if (["email", "phone", "phonenumber", "address", "city", "state", "country", "zip", "zipcode", "postalcode"].includes(lower)) {
    return "Contact";
  }
  if (["name", "firstname", "lastname", "username", "displayname", "avatar", "profileimage", "bio"].includes(lower)) {
    return "Identity";
  }
  if (["password", "passwordhash", "token", "refreshtoken", "apikey", "secret"].includes(lower)) {
    return "Authentication";
  }
  if (["creditcard", "cardnumber", "bankaccount", "routingnumber", "amount", "price"].includes(lower)) {
    return "Financial";
  }
  if (["dob", "dateofbirth", "birthdate", "ssn", "socialsecurity", "healthdata"].includes(lower)) {
    return "Sensitive";
  }
  if (["location", "latitude", "longitude", "lat", "lng", "geolocation"].includes(lower)) {
    return "Location";
  }
  if (["company", "organization", "website", "url", "industry"].includes(lower)) {
    return "Business";
  }

  return "Other";
}

/**
 * Detect API endpoints from project source files.
 * Lightweight detection that covers common frameworks.
 */
function detectApiEndpoints(projectPath: string): EndpointInfo[] {
  const absPath = path.resolve(projectPath);

  if (!fs.existsSync(absPath)) return [];

  const sourceExts = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
  let allFiles: WalkedFile[];
  try {
    allFiles = walkDirectory(absPath, { extensions: sourceExts, skipTests: true });
  } catch {
    return [];
  }

  const endpoints: EndpointInfo[] = [];

  for (const file of allFiles) {
    let content: string;
    try {
      content = fs.readFileSync(file.fullPath, "utf-8");
    } catch {
      continue;
    }

    // Next.js App Router: app/**/route.ts
    const isAppRoute = /app[/\\]/.test(file.relativePath) &&
      /^route\.[jt]sx?$/.test(path.basename(file.fullPath));

    if (isAppRoute) {
      const methodRegex = /export\s+(?:async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE)\b/g;
      let match: RegExpExecArray | null;
      while ((match = methodRegex.exec(content)) !== null) {
        const route = "/" + file.relativePath
          .replace(/^.*?app[/\\]/, "")
          .replace(/[/\\]route\.[jt]sx?$/, "")
          .replace(/\\/g, "/");
        endpoints.push({
          route: route || "/",
          method: match[1],
          file: file.relativePath,
          fields: extractDataFields(content),
        });
      }
      continue;
    }

    // Next.js Pages API: pages/api/**/*.ts
    const isPagesApi = /pages[/\\]api[/\\]/.test(file.relativePath);
    if (isPagesApi && /req(?:uest)?\.body/.test(content)) {
      const route = "/" + file.relativePath
        .replace(/^.*?pages[/\\]/, "")
        .replace(/\.[jt]sx?$/, "")
        .replace(/\\/g, "/")
        .replace(/\/index$/, "");
      endpoints.push({
        route,
        method: "POST",
        file: file.relativePath,
        fields: extractDataFields(content),
      });
      continue;
    }

    // Express/Fastify: app.post('/route', ...)
    const routeRegex = /(?:app|router|server|fastify)\.(get|post|put|patch|delete)\s*\(\s*["'`]([^"'`]+)["'`]/gi;
    let routeMatch: RegExpExecArray | null;
    while ((routeMatch = routeRegex.exec(content)) !== null) {
      endpoints.push({
        route: routeMatch[2],
        method: routeMatch[1].toUpperCase(),
        file: file.relativePath,
        fields: extractDataFields(content),
      });
    }
  }

  return endpoints;
}

/**
 * Extract data field names from request body access patterns.
 */
function extractDataFields(content: string): string[] {
  const fields = new Set<string>();

  // Direct property access: body.email, req.body.name
  const bodyAccessRegex = /(?:req\.body|body|request\.body)\.(\w+)/g;
  let match: RegExpExecArray | null;
  while ((match = bodyAccessRegex.exec(content)) !== null) {
    const field = match[1];
    if (!["json", "parse", "then", "catch", "toString", "length"].includes(field)) {
      fields.add(field);
    }
  }

  // Destructured: const { email, name } = req.body
  const destructRegex = /(?:const|let|var)\s*\{([^}]+)\}\s*=\s*(?:req\.body|request\.body|body)/g;
  while ((match = destructRegex.exec(content)) !== null) {
    const vars = match[1].split(",").map((v) => v.trim().split(":")[0].split("=")[0].trim());
    for (const v of vars) {
      if (v && v.length > 0 && !v.startsWith("...")) {
        fields.add(v);
      }
    }
  }

  // Zod fields: z.object({ email: z.string(), ... })
  const zodRegex = /z\.object\(\s*\{([^}]+)\}\s*\)/g;
  while ((match = zodRegex.exec(content)) !== null) {
    const fieldRegex = /(\w+)\s*:\s*z\./g;
    let fieldMatch: RegExpExecArray | null;
    while ((fieldMatch = fieldRegex.exec(match[1])) !== null) {
      fields.add(fieldMatch[1]);
    }
  }

  return Array.from(fields);
}
