import type { ScanResult, DetectedService, DataCategory } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates DATA_MAPPING_REGISTER.md — a complete data inventory conforming to
 * GDPR Article 30 requirements. Auto-populated from ALL scanners: services,
 * schemas, API routes, and environment variables.
 *
 * Columns: What data, Where from, Where stored, Who shared with, Retention.
 */

interface DataEntry {
  dataElement: string;
  source: string;
  storageLocation: string;
  sharedWith: string[];
  retention: string;
  lawfulBasis: string;
  category: string;
}

function categoryToLawfulBasis(category: string): string {
  switch (category) {
    case "auth":
      return "Contract performance (Art. 6(1)(b))";
    case "payment":
      return "Contract performance (Art. 6(1)(b))";
    case "analytics":
      return "Legitimate interest (Art. 6(1)(f))";
    case "advertising":
      return "Consent (Art. 6(1)(a))";
    case "email":
      return "Contract performance / Consent";
    case "ai":
      return "Consent / Legitimate interest";
    case "monitoring":
      return "Legitimate interest (Art. 6(1)(f))";
    case "storage":
      return "Contract performance (Art. 6(1)(b))";
    case "database":
      return "Contract performance (Art. 6(1)(b))";
    case "social":
      return "Consent (Art. 6(1)(a))";
    default:
      return "To be determined";
  }
}

function categoryToRetention(category: string, retentionDays?: number): string {
  if (retentionDays) {
    return `${retentionDays} days`;
  }
  switch (category) {
    case "auth":
      return "Duration of account + 30 days";
    case "payment":
      return "7 years (tax/legal obligation)";
    case "analytics":
      return "26 months (max)";
    case "advertising":
      return "Until consent withdrawn";
    case "email":
      return "Duration of account + 30 days";
    case "ai":
      return "Per AI provider policy / 30 days";
    case "monitoring":
      return "90 days";
    case "storage":
      return "Duration of account + 30 days";
    case "database":
      return "Duration of account + 30 days";
    default:
      return "To be determined";
  }
}

function deriveDataEntries(scan: ScanResult, ctx?: GeneratorContext): DataEntry[] {
  const entries: DataEntry[] = [];
  const retentionDays = ctx?.dataRetentionDays;

  for (const service of scan.services) {
    const sharedWith = service.isDataProcessor !== false ? [service.name] : [];
    const retention = categoryToRetention(service.category, retentionDays);
    const lawfulBasis = categoryToLawfulBasis(service.category);

    for (const dataItem of service.dataCollected) {
      // Deduplicate: check if we already have this data element
      const existing = entries.find((e) => e.dataElement === dataItem);
      if (existing) {
        // Merge: add this service as a shared-with party
        if (sharedWith.length > 0 && !existing.sharedWith.includes(sharedWith[0])) {
          existing.sharedWith.push(...sharedWith);
        }
        continue;
      }

      entries.push({
        dataElement: dataItem,
        source: deriveSource(service, dataItem),
        storageLocation: deriveStorageLocation(service),
        sharedWith,
        retention,
        lawfulBasis,
        category: classifyDataSensitivity(dataItem),
      });
    }
  }

  // Add data categories from scan
  for (const dc of scan.dataCategories) {
    for (const src of dc.sources) {
      const existing = entries.find((e) => e.dataElement === dc.category);
      if (!existing) {
        entries.push({
          dataElement: dc.category,
          source: src,
          storageLocation: "Application database",
          sharedWith: [],
          retention: retentionDays ? `${retentionDays} days` : "To be determined",
          lawfulBasis: "To be determined",
          category: classifyDataSensitivity(dc.category),
        });
      }
    }
  }

  return entries;
}

function deriveSource(service: DetectedService, dataItem: string): string {
  const lower = dataItem.toLowerCase();
  if (lower.includes("ip") || lower.includes("device") || lower.includes("browser")) {
    return "Automatic collection (HTTP request)";
  }
  if (lower.includes("email") || lower.includes("name") || lower.includes("address") || lower.includes("phone")) {
    return "User-provided (registration/form)";
  }
  if (lower.includes("payment") || lower.includes("card") || lower.includes("billing")) {
    return "User-provided (checkout)";
  }
  if (lower.includes("cookie") || lower.includes("tracking") || lower.includes("session")) {
    return "Automatic collection (cookies/SDK)";
  }
  if (service.category === "analytics") {
    return "Automatic collection (analytics SDK)";
  }
  if (service.category === "ai") {
    return "User-provided / Application-generated";
  }
  return "Application-collected";
}

function deriveStorageLocation(service: DetectedService): string {
  if (service.isDataProcessor !== false) {
    return `${service.name} (third-party)`;
  }
  switch (service.category) {
    case "database":
      return `${service.name} (self-managed)`;
    case "storage":
      return `${service.name} (cloud storage)`;
    default:
      return "Application infrastructure";
  }
}

function classifyDataSensitivity(dataItem: string): string {
  const lower = dataItem.toLowerCase();
  if (lower.includes("health") || lower.includes("medical") || lower.includes("biometric")) {
    return "Special Category (Art. 9)";
  }
  if (lower.includes("payment") || lower.includes("card") || lower.includes("financial") || lower.includes("bank")) {
    return "Financial";
  }
  if (lower.includes("password") || lower.includes("credential") || lower.includes("token") || lower.includes("secret")) {
    return "Security Credential";
  }
  if (lower.includes("email") || lower.includes("name") || lower.includes("phone") || lower.includes("address")) {
    return "Directly Identifiable";
  }
  if (lower.includes("ip") || lower.includes("device") || lower.includes("cookie")) {
    return "Indirectly Identifiable";
  }
  return "General";
}

export function generateDataMappingRegister(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const dpoName = ctx?.dpoName || "[Data Protection Officer Name]";
  const dpoEmail = ctx?.dpoEmail || contactEmail;
  const date = new Date().toISOString().split("T")[0];
  const nextReview = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const entries = deriveDataEntries(scan, ctx);
  if (entries.length === 0) {
    return null;
  }

  const lines: string[] = [];

  // Header
  lines.push("# Data Mapping Register");
  lines.push("");
  lines.push(`> **Document Version:** 1.0`);
  lines.push(`> **Document Owner:** ${company}`);
  lines.push(`> **Generated:** ${date} by [Codepliant](https://github.com/joechensmartz/codepliant)`);
  lines.push(`> **Next Review Date:** ${nextReview}`);
  lines.push("");
  lines.push("This register provides a complete inventory of personal data processing activities");
  lines.push("in compliance with GDPR Article 30 (Records of Processing Activities).");
  lines.push("");

  // Controller information
  lines.push("## 1. Data Controller Information");
  lines.push("");
  lines.push("| Field | Details |");
  lines.push("|-------|---------|");
  lines.push(`| **Data Controller** | ${company} |`);
  lines.push(`| **Contact Email** | ${contactEmail} |`);
  lines.push(`| **Data Protection Officer** | ${dpoName} |`);
  lines.push(`| **DPO Email** | ${dpoEmail} |`);
  if (ctx?.euRepresentative) {
    lines.push(`| **EU Representative** | ${ctx.euRepresentative} |`);
  }
  if (ctx?.website) {
    lines.push(`| **Website** | ${ctx.website} |`);
  }
  lines.push(`| **Register Last Updated** | ${date} |`);
  lines.push("");

  // Data Inventory Table
  lines.push("## 2. Data Inventory");
  lines.push("");
  lines.push("| # | Data Element | Sensitivity | Source | Storage Location | Shared With | Lawful Basis | Retention |");
  lines.push("|---|-------------|-------------|--------|------------------|-------------|--------------|-----------|");

  entries.forEach((entry, i) => {
    const shared = entry.sharedWith.length > 0 ? entry.sharedWith.join(", ") : "Internal only";
    lines.push(
      `| ${i + 1} | ${entry.dataElement} | ${entry.category} | ${entry.source} | ${entry.storageLocation} | ${shared} | ${entry.lawfulBasis} | ${entry.retention} |`,
    );
  });
  lines.push("");

  // Data flow summary by category
  lines.push("## 3. Data Flow Summary");
  lines.push("");

  const categoryGroups = new Map<string, DataEntry[]>();
  for (const entry of entries) {
    const group = categoryGroups.get(entry.category) || [];
    group.push(entry);
    categoryGroups.set(entry.category, group);
  }

  for (const [category, groupEntries] of categoryGroups) {
    lines.push(`### ${category}`);
    lines.push("");
    lines.push("| Data Element | Source | Destination |");
    lines.push("|-------------|--------|-------------|");
    for (const entry of groupEntries) {
      const dest = entry.sharedWith.length > 0 ? entry.sharedWith.join(", ") : entry.storageLocation;
      lines.push(`| ${entry.dataElement} | ${entry.source} | ${dest} |`);
    }
    lines.push("");
  }

  // Third-party processors
  const processors = new Set<string>();
  for (const entry of entries) {
    for (const s of entry.sharedWith) {
      processors.add(s);
    }
  }

  if (processors.size > 0) {
    lines.push("## 4. Third-Party Processors");
    lines.push("");
    lines.push("| Processor | Data Shared | Purpose | DPA Status |");
    lines.push("|-----------|------------|---------|------------|");

    for (const processor of processors) {
      const relatedEntries = entries.filter((e) => e.sharedWith.includes(processor));
      const dataShared = relatedEntries.map((e) => e.dataElement).join(", ");
      const service = scan.services.find((s) => s.name === processor);
      const purpose = service ? service.category : "Data processing";
      lines.push(`| ${processor} | ${dataShared} | ${purpose} | ⬜ To be verified |`);
    }
    lines.push("");
  }

  // International transfers
  lines.push(`## ${processors.size > 0 ? "5" : "4"}. International Data Transfers`);
  lines.push("");
  lines.push("| Processor | Transfer Destination | Safeguard Mechanism | Status |");
  lines.push("|-----------|---------------------|---------------------|--------|");

  for (const processor of processors) {
    lines.push(`| ${processor} | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |`);
  }
  if (processors.size === 0) {
    lines.push("| *No third-party processors detected* | — | — | — |");
  }
  lines.push("");

  // Retention schedule
  const nextSection = processors.size > 0 ? "6" : "5";
  lines.push(`## ${nextSection}. Retention Schedule`);
  lines.push("");
  lines.push("| Data Category | Retention Period | Deletion Method | Legal Basis for Retention |");
  lines.push("|---------------|-----------------|-----------------|--------------------------|");

  const retentionGroups = new Map<string, { retention: string; basis: string }>();
  for (const entry of entries) {
    if (!retentionGroups.has(entry.category)) {
      retentionGroups.set(entry.category, { retention: entry.retention, basis: entry.lawfulBasis });
    }
  }
  for (const [category, info] of retentionGroups) {
    lines.push(`| ${category} | ${info.retention} | Automated purge + manual verification | ${info.basis} |`);
  }
  lines.push("");

  // Disclaimer
  lines.push("---");
  lines.push("");
  lines.push(
    "*This data mapping register is generated from automated code analysis and should be reviewed by your Data Protection Officer and legal team. It may not capture all data processing activities, particularly those conducted outside the scanned codebase. This does not constitute legal advice.*",
  );
  lines.push("");

  return lines.join("\n");
}
