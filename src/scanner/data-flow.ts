import type { ScanResult, DetectedService, DataCategory, ServiceCategory } from "./types.js";

/**
 * A single entry in the data flow map describing how data moves
 * through a particular stage (collection, storage, or sharing).
 */
export interface DataFlowEntry {
  source: string;
  dataItems: string[];
  via: string;
}

/**
 * Complete data flow map synthesized from scan results.
 */
export interface DataFlowMap {
  collection: DataFlowEntry[];
  storage: DataFlowEntry[];
  sharing: DataFlowEntry[];
}

/** Categories whose services typically *collect* user data directly. */
const COLLECTION_CATEGORIES: Set<ServiceCategory> = new Set([
  "auth",
  "payment",
  "ai",
  "email",
  "social",
]);

/** Categories whose services primarily *store* data. */
const STORAGE_CATEGORIES: Set<ServiceCategory> = new Set([
  "database",
  "storage",
]);

/** Categories whose services receive data as third-party processors. */
const SHARING_CATEGORIES: Set<ServiceCategory> = new Set([
  "ai",
  "payment",
  "analytics",
  "monitoring",
  "advertising",
  "email",
  "social",
  "other",
]);

/** Human-readable labels for service categories used in flow descriptions. */
const CATEGORY_LABELS: Record<string, string> = {
  ai: "AI Service",
  payment: "Payment Processing",
  analytics: "Analytics",
  auth: "Authentication",
  email: "Email Service",
  database: "Database",
  storage: "File Storage",
  monitoring: "Error Monitoring",
  advertising: "Advertising",
  social: "Social Integration",
  other: "Third-Party Service",
};

/** Human-readable collection source labels for service categories. */
const COLLECTION_SOURCE_LABELS: Record<string, string> = {
  auth: "User registration/login",
  payment: "Payment checkout",
  ai: "AI-powered feature usage",
  email: "Email subscription/contact forms",
  social: "Social login/sharing",
};

/**
 * Synthesize all scan results into a structured data flow map.
 *
 * Takes the detected services, data categories, and schema fields from
 * a scan and produces a map showing how data flows through the application:
 * - COLLECTION: where user data enters the system
 * - STORAGE: where user data is persisted
 * - SHARING: which third parties receive user data
 */
export function buildDataFlowMap(scan: ScanResult): DataFlowMap {
  const collection: DataFlowEntry[] = [];
  const storage: DataFlowEntry[] = [];
  const sharing: DataFlowEntry[] = [];

  // --- Collection ---
  // Services that directly collect data from users
  for (const service of scan.services) {
    if (COLLECTION_CATEGORIES.has(service.category)) {
      const sourceLabel =
        COLLECTION_SOURCE_LABELS[service.category] || service.name;
      collection.push({
        source: sourceLabel,
        dataItems: [...service.dataCollected],
        via: `via ${service.name}`,
      });
    }
  }

  // API route data categories contribute to collection
  for (const cat of scan.dataCategories) {
    if (cat.category === "API Data Collection") {
      // Extract field names from description if available
      const fieldMatch = cat.description.match(/Data fields collected:\s*(.+)\.$/);
      const fields = fieldMatch
        ? fieldMatch[1].split(",").map((f) => f.trim())
        : ["user-submitted data"];
      for (const src of cat.sources) {
        collection.push({
          source: `API endpoint ${src}`,
          dataItems: fields,
          via: "via API",
        });
      }
    }
  }

  // --- Storage ---
  // Database and storage services
  for (const service of scan.services) {
    if (STORAGE_CATEGORIES.has(service.category)) {
      storage.push({
        source: service.name,
        dataItems: [...service.dataCollected],
        via: categoryLabel(service.category),
      });
    }
  }

  // Schema-derived data categories (Prisma fields, Django models)
  for (const cat of scan.dataCategories) {
    if (
      cat.category !== "API Data Collection" &&
      cat.sources.some((s) => s.includes("."))
    ) {
      // Sources like "User.email" indicate schema fields
      storage.push({
        source: "Database schema",
        dataItems: cat.sources,
        via: cat.category,
      });
    }
  }

  // --- Sharing (Third Parties) ---
  for (const service of scan.services) {
    if (
      SHARING_CATEGORIES.has(service.category) &&
      service.category !== "database"
    ) {
      sharing.push({
        source: service.name,
        dataItems: [...service.dataCollected],
        via: categoryLabel(service.category),
      });
    }
  }

  return { collection, storage, sharing };
}

/**
 * Render the data flow map as a human-readable text block
 * suitable for embedding in markdown documents.
 */
export function renderDataFlowText(flow: DataFlowMap): string {
  const lines: string[] = [];

  lines.push("Data Flow Summary:");
  lines.push("");

  // Collection
  lines.push("COLLECTION:");
  if (flow.collection.length === 0) {
    lines.push("- No direct data collection points detected");
  } else {
    for (const entry of flow.collection) {
      lines.push(
        `- ${entry.source} → ${entry.dataItems.join(", ")} (${entry.via})`
      );
    }
  }

  lines.push("");

  // Storage
  lines.push("STORAGE:");
  if (flow.storage.length === 0) {
    lines.push("- No data storage services detected");
  } else {
    for (const entry of flow.storage) {
      lines.push(
        `- ${entry.source} (${entry.via}) → ${entry.dataItems.join(", ")}`
      );
    }
  }

  lines.push("");

  // Sharing
  lines.push("SHARING (Third Parties):");
  if (flow.sharing.length === 0) {
    lines.push("- No third-party data sharing detected");
  } else {
    for (const entry of flow.sharing) {
      lines.push(
        `- ${entry.source} → ${entry.dataItems.join(", ")}`
      );
    }
  }

  return lines.join("\n");
}

/**
 * Generate a standalone DATA_FLOW_MAP.md document from scan results.
 */
export function generateDataFlowMapDocument(
  scan: ScanResult,
  companyName?: string
): string {
  const company = companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];
  const flow = buildDataFlowMap(scan);

  const sections: string[] = [];

  sections.push(`# Data Flow Map

**Last updated:** ${date}

**Project:** ${scan.projectName}

**Company:** ${company}

---

> This document maps how personal data flows through the application — where it is collected, where it is stored, and which third parties it is shared with. Generated by automated code analysis.
`);

  // Collection
  sections.push(`## Data Collection Points

The following entry points collect personal data from users:
`);

  if (flow.collection.length === 0) {
    sections.push("No direct data collection points were detected.\n");
  } else {
    sections.push("| Source | Data Collected | Mechanism |");
    sections.push("|--------|---------------|-----------|");
    for (const entry of flow.collection) {
      sections.push(
        `| ${entry.source} | ${entry.dataItems.join(", ")} | ${entry.via} |`
      );
    }
    sections.push("");
  }

  // Storage
  sections.push(`## Data Storage

The following services and systems store personal data:
`);

  if (flow.storage.length === 0) {
    sections.push("No data storage services were detected.\n");
  } else {
    sections.push("| Storage System | Category | Data Stored |");
    sections.push("|---------------|----------|-------------|");
    for (const entry of flow.storage) {
      sections.push(
        `| ${entry.source} | ${entry.via} | ${entry.dataItems.join(", ")} |`
      );
    }
    sections.push("");
  }

  // Sharing
  sections.push(`## Third-Party Data Sharing

The following third-party services receive personal data:
`);

  if (flow.sharing.length === 0) {
    sections.push("No third-party data sharing was detected.\n");
  } else {
    sections.push("| Third Party | Category | Data Shared |");
    sections.push("|------------|----------|-------------|");
    for (const entry of flow.sharing) {
      sections.push(
        `| ${entry.source} | ${entry.via} | ${entry.dataItems.join(", ")} |`
      );
    }
    sections.push("");
  }

  // Summary
  sections.push(`## Summary

${renderDataFlowText(flow)}

---

*This data flow map was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Review and verify against your actual data processing activities.*`);

  return sections.join("\n");
}

/**
 * Generate a markdown section for the data flow map,
 * suitable for embedding in the Privacy Policy.
 */
export function generateDataFlowSection(scan: ScanResult): string | null {
  const flow = buildDataFlowMap(scan);

  // Only generate if there is something to show
  if (
    flow.collection.length === 0 &&
    flow.storage.length === 0 &&
    flow.sharing.length === 0
  ) {
    return null;
  }

  const lines: string[] = [];

  lines.push("### How Your Data Flows Through Our Service\n");
  lines.push(
    "The following summarizes how personal data moves through our application:\n"
  );

  if (flow.collection.length > 0) {
    lines.push("**Data Collection:**\n");
    for (const entry of flow.collection) {
      lines.push(
        `- ${entry.source} → ${entry.dataItems.join(", ")} (${entry.via})`
      );
    }
    lines.push("");
  }

  if (flow.storage.length > 0) {
    lines.push("**Data Storage:**\n");
    for (const entry of flow.storage) {
      lines.push(
        `- ${entry.source} (${entry.via}): ${entry.dataItems.join(", ")}`
      );
    }
    lines.push("");
  }

  if (flow.sharing.length > 0) {
    lines.push("**Third-Party Data Sharing:**\n");
    for (const entry of flow.sharing) {
      lines.push(`- ${entry.source}: ${entry.dataItems.join(", ")}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || category;
}
