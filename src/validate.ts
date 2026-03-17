import * as fs from "fs";
import * as path from "path";
import type { ScanResult, ComplianceNeed } from "./scanner/types.js";

// ────────────────────────────────────────────────────────────────────────────
// Legacy types & function (used by other parts of the CLI — do not remove)
// ────────────────────────────────────────────────────────────────────────────

export interface DocumentValidation {
  name: string;
  filename: string;
  totalSections: number;
  completeSections: number;
  emptySections: string[];
}

export interface ValidateResult {
  documents: DocumentValidation[];
  allComplete: boolean;
}

/**
 * Extract H2 (## ) sections from a markdown document and check whether
 * each section has meaningful content beneath it (not just whitespace or
 * another heading).
 */
function validateMarkdownSections(content: string): {
  totalSections: number;
  completeSections: number;
  emptySections: string[];
} {
  const lines = content.split("\n");
  const sections: { heading: string; startLine: number }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^##\s+(.+)/);
    if (match) {
      sections.push({ heading: match[1].trim(), startLine: i });
    }
  }

  if (sections.length === 0) {
    return { totalSections: 0, completeSections: 0, emptySections: [] };
  }

  const emptySections: string[] = [];
  let completeSections = 0;

  for (let i = 0; i < sections.length; i++) {
    const start = sections[i].startLine + 1;
    const end = i + 1 < sections.length ? sections[i + 1].startLine : lines.length;

    // Collect all lines between this heading and the next
    const sectionLines = lines.slice(start, end);

    // Check if there's meaningful content (not just whitespace, not just ---,
    // not just another heading)
    const hasContent = sectionLines.some((line) => {
      const trimmed = line.trim();
      return (
        trimmed.length > 0 &&
        trimmed !== "---" &&
        !trimmed.startsWith("#") &&
        trimmed !== ">"
      );
    });

    if (hasContent) {
      completeSections++;
    } else {
      emptySections.push(sections[i].heading);
    }
  }

  return {
    totalSections: sections.length,
    completeSections,
    emptySections,
  };
}

/**
 * Derive a human-readable document name from a filename.
 * e.g., "PRIVACY_POLICY.md" -> "Privacy Policy"
 */
function filenameToName(filename: string): string {
  return filename
    .replace(/\.md$/i, "")
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Validate ALL generated documents in the output directory for completeness.
 * Checks each section has content (not just headers).
 *
 * Reports per-document: "Privacy Policy: 13/13 sections complete"
 */
export function validateDocuments(outputDir: string): ValidateResult {
  const absDir = path.resolve(outputDir);

  if (!fs.existsSync(absDir)) {
    return { documents: [], allComplete: true };
  }

  const files = fs.readdirSync(absDir).filter((f) => f.endsWith(".md"));
  const documents: DocumentValidation[] = [];

  for (const file of files) {
    const filePath = path.join(absDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const { totalSections, completeSections, emptySections } =
      validateMarkdownSections(content);

    // Skip files with no sections (e.g., changelog)
    if (totalSections === 0) continue;

    documents.push({
      name: filenameToName(file),
      filename: file,
      totalSections,
      completeSections,
      emptySections,
    });
  }

  // Sort by name for deterministic output
  documents.sort((a, b) => a.name.localeCompare(b.name));

  const allComplete = documents.every(
    (d) => d.completeSections === d.totalSections,
  );

  return { documents, allComplete };
}

// ────────────────────────────────────────────────────────────────────────────
// New: Deep document-quality validation (`codepliant validate`)
// ────────────────────────────────────────────────────────────────────────────

/** Map from ComplianceNeed.document name → expected filename(s). */
const NEED_TO_FILENAME: Record<string, string[]> = {
  "Privacy Policy": ["PRIVACY_POLICY.md"],
  "Terms of Service": ["TERMS_OF_SERVICE.md"],
  "Security Policy": ["SECURITY.md"],
  "AI Disclosure": ["AI_DISCLOSURE.md"],
  "Cookie Policy": ["COOKIE_POLICY.md"],
  "Data Processing Agreement": ["DATA_PROCESSING_AGREEMENT.md"],
  "Incident Response Plan": ["INCIDENT_RESPONSE_PLAN.md"],
};

/** Placeholder patterns that indicate the user hasn't customised the document. */
const PLACEHOLDER_PATTERNS = [
  "[Your Company Name]",
  "[Your Company]",
  "[your-email@example.com]",
  "[Company Name]",
  "[Contact Email]",
  "[INSERT",
  "[TODO",
  "[PLACEHOLDER",
  "[YOUR ",
];

/** Staleness threshold in milliseconds (30 days). */
const STALE_THRESHOLD_MS = 30 * 24 * 60 * 60 * 1000;

// ── Individual check types ──────────────────────────────────────────────────

export type CheckStatus = "pass" | "fail" | "warn";

export interface ValidationCheck {
  check: string;
  status: CheckStatus;
  message: string;
  details?: string[];
}

export interface DocumentQualityEntry {
  filename: string;
  name: string;
  checks: ValidationCheck[];
  pass: boolean;
}

export interface DeepValidateResult {
  /** Overall pass / fail */
  pass: boolean;
  /** Per-document quality entries */
  documents: DocumentQualityEntry[];
  /** Top-level checks (e.g. "required documents exist") */
  checks: ValidationCheck[];
  /** Summary counts */
  summary: {
    totalChecks: number;
    passed: number;
    failed: number;
    warned: number;
  };
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Recursively collect all .md files under a directory, returning paths
 * relative to the root outputDir.
 */
function collectMarkdownFiles(dir: string, root?: string): { relPath: string; absPath: string }[] {
  const base = root ?? dir;
  const results: { relPath: string; absPath: string }[] = [];

  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectMarkdownFiles(fullPath, base));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      results.push({ relPath: path.relative(base, fullPath), absPath: fullPath });
    }
  }

  return results;
}

/**
 * Check whether a document mentions at least one of the detected service names.
 */
function documentMentionsServices(content: string, serviceNames: string[]): string[] {
  const lower = content.toLowerCase();
  return serviceNames.filter((name) => lower.includes(name.toLowerCase()));
}

// ── Main validation function ────────────────────────────────────────────────

/**
 * Deep-validate generated compliance documents.
 *
 * 1. Required documents exist (based on scan complianceNeeds)
 * 2. No stale documents (older than 30 days)
 * 3. No placeholder-only content (service names must appear)
 * 4. Section completeness (reuses existing logic)
 */
export function deepValidateDocuments(
  outputDir: string,
  scanResult?: ScanResult,
): DeepValidateResult {
  const absDir = path.resolve(outputDir);
  const topChecks: ValidationCheck[] = [];
  const docEntries: DocumentQualityEntry[] = [];

  const mdFiles = collectMarkdownFiles(absDir);
  const filenameSet = new Set(mdFiles.map((f) => path.basename(f.absPath)));

  // Detected service names (for placeholder check)
  const serviceNames = scanResult ? scanResult.services.map((s) => s.name) : [];

  // ── Check 1: Required documents exist ─────────────────────────────────
  if (scanResult) {
    const missingDocs: string[] = [];

    for (const need of scanResult.complianceNeeds) {
      const expectedFiles = NEED_TO_FILENAME[need.document];
      if (!expectedFiles) continue; // no filename mapping for this need

      const found = expectedFiles.some((fn) => filenameSet.has(fn));
      if (!found) {
        missingDocs.push(`${need.document} (${expectedFiles.join(" or ")})`);
      }
    }

    topChecks.push({
      check: "required-documents-exist",
      status: missingDocs.length === 0 ? "pass" : "fail",
      message:
        missingDocs.length === 0
          ? "All required documents exist"
          : `${missingDocs.length} required document(s) missing`,
      details: missingDocs.length > 0 ? missingDocs : undefined,
    });
  }

  // ── Per-document checks ───────────────────────────────────────────────
  const now = Date.now();

  for (const { relPath, absPath: filePath } of mdFiles) {
    const filename = path.basename(filePath);
    const name = filenameToName(filename);
    const checks: ValidationCheck[] = [];

    const content = fs.readFileSync(filePath, "utf-8");
    const stat = fs.statSync(filePath);

    // Check 2: Staleness
    const ageMs = now - stat.mtimeMs;
    const ageDays = Math.floor(ageMs / (24 * 60 * 60 * 1000));
    const stale = ageMs > STALE_THRESHOLD_MS;
    checks.push({
      check: "not-stale",
      status: stale ? "fail" : "pass",
      message: stale
        ? `Document is ${ageDays} days old (exceeds 30-day threshold)`
        : `Document is ${ageDays} day(s) old`,
    });

    // Check 3: Placeholder detection
    const foundPlaceholders = PLACEHOLDER_PATTERNS.filter((p) =>
      content.includes(p),
    );
    checks.push({
      check: "no-placeholders",
      status: foundPlaceholders.length === 0 ? "pass" : "fail",
      message:
        foundPlaceholders.length === 0
          ? "No placeholder text detected"
          : `${foundPlaceholders.length} placeholder pattern(s) found`,
      details: foundPlaceholders.length > 0 ? foundPlaceholders : undefined,
    });

    // Check 3b: Document mentions actual service names (only for docs that should)
    if (serviceNames.length > 0) {
      const mentioned = documentMentionsServices(content, serviceNames);
      // Only flag as a problem for core compliance docs (privacy policy, DPA, cookie policy, etc.)
      const coreDocFilenames = new Set([
        "PRIVACY_POLICY.md",
        "COOKIE_POLICY.md",
        "DATA_PROCESSING_AGREEMENT.md",
        "SUBPROCESSOR_LIST.md",
        "AI_DISCLOSURE.md",
        "THIRD_PARTY_RISK_ASSESSMENT.md",
      ]);

      if (coreDocFilenames.has(filename)) {
        checks.push({
          check: "contains-service-names",
          status: mentioned.length > 0 ? "pass" : "warn",
          message:
            mentioned.length > 0
              ? `References ${mentioned.length} of ${serviceNames.length} detected service(s)`
              : `Does not reference any of the ${serviceNames.length} detected service(s)`,
          details: mentioned.length > 0 ? mentioned : serviceNames,
        });
      }
    }

    // Check 4: Section completeness
    const sections = validateMarkdownSections(content);
    if (sections.totalSections > 0) {
      const allComplete = sections.completeSections === sections.totalSections;
      checks.push({
        check: "sections-complete",
        status: allComplete ? "pass" : "warn",
        message: `${sections.completeSections}/${sections.totalSections} sections have content`,
        details: sections.emptySections.length > 0 ? sections.emptySections : undefined,
      });
    }

    const docPass = checks.every((c) => c.status !== "fail");

    docEntries.push({
      filename: relPath,
      name,
      checks,
      pass: docPass,
    });
  }

  // Sort for deterministic output
  docEntries.sort((a, b) => a.filename.localeCompare(b.filename));

  // ── Summary ───────────────────────────────────────────────────────────
  const allChecks = [...topChecks, ...docEntries.flatMap((d) => d.checks)];
  const passed = allChecks.filter((c) => c.status === "pass").length;
  const failed = allChecks.filter((c) => c.status === "fail").length;
  const warned = allChecks.filter((c) => c.status === "warn").length;

  const overallPass = failed === 0;

  return {
    pass: overallPass,
    documents: docEntries,
    checks: topChecks,
    summary: {
      totalChecks: allChecks.length,
      passed,
      failed,
      warned,
    },
  };
}
