import * as fs from "fs";
import * as path from "path";
import type { GeneratedDocument } from "../generator/index.js";
import type { OutputFormat } from "./index.js";

/**
 * Represents a single change detected between document versions.
 */
export interface DocumentChange {
  type: "added" | "updated" | "removed";
  document: string;
  filename: string;
  details: string[];
}

/**
 * Result of comparing old vs new documents.
 */
export interface DiffResult {
  changes: DocumentChange[];
  hasChanges: boolean;
  timestamp: string;
}

/**
 * Read existing documents from the output directory.
 * Returns a map of filename -> content.
 */
export function readExistingDocuments(outputDir: string, format?: OutputFormat): Map<string, string> {
  const existing = new Map<string, string>();

  if (!fs.existsSync(outputDir)) {
    return existing;
  }

  // When format is markdown-only, only read .md files to avoid
  // flagging HTML/JSON files as "removed" when they were generated with --format all
  let extensions: string[];
  if (format === "markdown") {
    extensions = [".md"];
  } else if (format === "html") {
    extensions = [".md", ".html"];
  } else {
    // "all", "json", "pdf", or unspecified: read both .md and .html
    extensions = [".md", ".html"];
  }

  // Scan both flat files and categorized subdirectories
  let entries: string[];
  try {
    entries = fs.readdirSync(outputDir);
  } catch {
    return existing;
  }

  const readDir = (dir: string) => {
    let items: string[];
    try {
      items = fs.readdirSync(dir);
    } catch {
      return;
    }
    for (const entry of items) {
      const fullPath = path.join(dir, entry);
      if (extensions.some(ext => entry.endsWith(ext))) {
        if (entry === "DOCUMENT_CHANGELOG.md") continue;
        try {
          const content = fs.readFileSync(fullPath, "utf-8");
          existing.set(entry, content);
        } catch {
          // skip unreadable files
        }
      }
    }
  };

  // Read flat files
  readDir(outputDir);

  // Read categorized subdirectories
  for (const entry of entries) {
    const subDir = path.join(outputDir, entry);
    try {
      if (fs.statSync(subDir).isDirectory() && entry !== "node_modules") {
        readDir(subDir);
      }
    } catch {
      // skip
    }
  }

  return existing;
}

/**
 * Compare old content with new content line by line.
 * Returns human-readable detail strings describing what changed.
 */
export function compareContent(oldContent: string, newContent: string): string[] {
  const oldLines = oldContent.split("\n");
  const newLines = newContent.split("\n");

  const details: string[] = [];

  // Find added/removed sections (markdown headings)
  const oldSections = extractSections(oldLines);
  const newSections = extractSections(newLines);

  for (const section of newSections) {
    if (!oldSections.includes(section)) {
      details.push(`Added section: ${section}`);
    }
  }

  for (const section of oldSections) {
    if (!newSections.includes(section)) {
      details.push(`Removed section: ${section}`);
    }
  }

  // Detect service list changes by looking for list items mentioning known patterns
  const oldServices = extractServiceMentions(oldLines);
  const newServices = extractServiceMentions(newLines);

  const addedServices = newServices.filter(s => !oldServices.includes(s));
  const removedServices = oldServices.filter(s => !newServices.includes(s));

  if (addedServices.length > 0) {
    details.push(`Updated: ${addedServices.length} new service(s) detected (${addedServices.join(", ")})`);
  }
  if (removedServices.length > 0) {
    for (const svc of removedServices) {
      details.push(`Removed: reference to ${svc} (no longer in codebase)`);
    }
  }

  // If no specific changes detected but content differs, report line count diff
  if (details.length === 0) {
    const added = newLines.length - oldLines.length;
    if (added > 0) {
      details.push(`Content expanded by ${added} line(s)`);
    } else if (added < 0) {
      details.push(`Content reduced by ${Math.abs(added)} line(s)`);
    } else {
      details.push("Content modified (same line count)");
    }
  }

  return details;
}

/**
 * Extract markdown section headings from lines.
 */
function extractSections(lines: string[]): string[] {
  const sections: string[] = [];
  for (const line of lines) {
    const match = line.match(/^#{1,3}\s+(.+)/);
    if (match) {
      sections.push(match[1].trim());
    }
  }
  return sections;
}

/**
 * Extract service names mentioned in bold list items.
 * Matches patterns like "**Stripe**", "**OpenAI**", "- Stripe", "- openai"
 */
function extractServiceMentions(lines: string[]): string[] {
  const services: string[] = [];
  for (const line of lines) {
    // Match **ServiceName** in list items
    const boldMatches = line.matchAll(/\*\*([A-Za-z][A-Za-z0-9._-]+)\*\*/g);
    for (const m of boldMatches) {
      const name = m[1].toLowerCase();
      if (!services.includes(name)) {
        services.push(name);
      }
    }
  }
  return services;
}

/**
 * Compare newly generated documents against existing ones on disk.
 */
export function diffDocuments(
  newDocs: GeneratedDocument[],
  outputDir: string,
  format?: OutputFormat
): DiffResult {
  const timestamp = new Date().toISOString().replace("T", " ").replace(/\.\d+Z$/, " UTC");
  const existingDocs = readExistingDocuments(outputDir, format);
  const changes: DocumentChange[] = [];

  const newFilenames = new Set(newDocs.map(d => d.filename));

  // Check each new document against existing
  for (const doc of newDocs) {
    const existing = existingDocs.get(doc.filename);

    if (existing === undefined) {
      // Brand new document
      const sections = extractSections(doc.content.split("\n"));
      const details = sections.length > 0
        ? [`New document with ${sections.length} section(s)`]
        : ["New document"];
      changes.push({
        type: "added",
        document: doc.name,
        filename: doc.filename,
        details,
      });
    } else if (existing !== doc.content) {
      // Document changed
      const details = compareContent(existing, doc.content);
      changes.push({
        type: "updated",
        document: doc.name,
        filename: doc.filename,
        details,
      });
    }
    // If content identical, no change entry
  }

  // Check for documents that exist on disk but are no longer generated
  for (const [filename] of existingDocs) {
    if (!newFilenames.has(filename)) {
      changes.push({
        type: "removed",
        document: filename.replace(/\.(md|html)$/, "").replace(/_/g, " "),
        filename,
        details: ["No longer generated (service removed from codebase)"],
      });
    }
  }

  return {
    changes,
    hasChanges: changes.length > 0,
    timestamp,
  };
}

/**
 * Format a DiffResult into a CHANGELOG entry string.
 */
export function formatChangelogEntry(diff: DiffResult): string {
  if (!diff.hasChanges) return "";

  const lines: string[] = [];
  lines.push(`## ${diff.timestamp}`);
  lines.push("");

  for (const change of diff.changes) {
    const icon = change.type === "added" ? "+" : change.type === "removed" ? "-" : "~";
    lines.push(`### [${icon}] ${change.document} (\`${change.filename}\`)`);
    for (const detail of change.details) {
      lines.push(`- ${detail}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Append a changelog entry to DOCUMENT_CHANGELOG.md in the output directory.
 * Creates the file if it doesn't exist.
 */
export function appendChangelog(outputDir: string, diff: DiffResult): string | null {
  if (!diff.hasChanges) return null;

  const entry = formatChangelogEntry(diff);
  if (!entry) return null;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write to guides/ subdirectory if it exists, otherwise fall back to flat layout
  const guidesDir = path.join(outputDir, "guides");
  const changelogPath = fs.existsSync(guidesDir)
    ? path.join(guidesDir, "DOCUMENT_CHANGELOG.md")
    : path.join(outputDir, "DOCUMENT_CHANGELOG.md");
  let existing = "";

  if (fs.existsSync(changelogPath)) {
    existing = fs.readFileSync(changelogPath, "utf-8");
  }

  // Build the new file: header + new entry + previous entries
  const header = "# Document Changelog\n\nTrack of changes between document generations.\n\n";

  let body: string;
  if (existing) {
    // Strip existing header (everything before the first ## entry)
    const firstEntry = existing.indexOf("## ");
    const previousEntries = firstEntry >= 0 ? existing.slice(firstEntry) : "";
    body = header + entry + previousEntries;
  } else {
    body = header + entry;
  }

  fs.writeFileSync(changelogPath, body, "utf-8");
  return changelogPath;
}
