import * as fs from "fs";
import * as path from "path";
import { scan, type ScanResult } from "./scanner/index.js";
import { generateDocuments, type GeneratedDocument } from "./generator/index.js";
import { loadConfig } from "./config.js";

export interface LintIssue {
  document: string;
  severity: "error" | "warning";
  message: string;
  rule: string;
}

export interface LintResult {
  issues: LintIssue[];
  passed: boolean;
  documentsChecked: number;
  documentsExpected: number;
}

/**
 * Extract markdown sections (## headings) from a document.
 */
function extractSections(content: string): Set<string> {
  const sections = new Set<string>();
  const lines = content.split("\n");
  for (const line of lines) {
    const match = line.match(/^##\s+(.+)/);
    if (match) {
      sections.add(match[1].trim());
    }
  }
  return sections;
}

/**
 * Check if a document contains placeholder values that should have been customized.
 */
function findPlaceholders(content: string): string[] {
  const patterns = [
    /\[Your Company Name\]/g,
    /\[your-email@example\.com\]/g,
    /\[https:\/\/yoursite\.com\]/g,
    /\[security@example\.com\]/g,
    /\[Compliance Officer Name\]/g,
    /\[Your DPO Name\]/g,
    /\[Your Company Address\]/g,
    /\[your-domain\.com\]/g,
    /\[privacy@example\.com\]/g,
    /\[dpo@example\.com\]/g,
    /\[INSERT[^\]]*\]/gi,
    /\[TODO[^\]]*\]/gi,
    /\[CHANGEME[^\]]*\]/gi,
    /\[PLACEHOLDER[^\]]*\]/gi,
    /\[YOUR[^\]]*\]/gi,
  ];

  const found: string[] = [];
  for (const pattern of patterns) {
    const matches = content.match(pattern);
    if (matches) {
      for (const m of matches) {
        if (!found.includes(m)) {
          found.push(m);
        }
      }
    }
  }
  return found;
}

/**
 * Find markdown links to other local files and check if they exist.
 */
function findBrokenLinks(
  content: string,
  docFilePath: string,
  outputDir: string
): string[] {
  // Match markdown links: [text](path) — skip http(s) and mailto links
  const linkPattern = /\[([^\]]*)\]\(([^)]+)\)/g;
  const broken: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(content)) !== null) {
    const target = match[2];
    // Skip external URLs and anchors
    if (target.startsWith("http://") || target.startsWith("https://") || target.startsWith("mailto:") || target.startsWith("#")) {
      continue;
    }
    // Strip anchor fragments from local paths
    const targetPath = target.split("#")[0];
    if (!targetPath) continue;

    // Resolve relative to the document's directory
    const docDir = path.dirname(docFilePath);
    const resolvedPath = path.resolve(docDir, targetPath);

    // Also check relative to the output directory root
    const resolvedFromRoot = path.resolve(outputDir, targetPath);

    if (!fs.existsSync(resolvedPath) && !fs.existsSync(resolvedFromRoot)) {
      if (!broken.includes(target)) {
        broken.push(target);
      }
    }
  }
  return broken;
}

/**
 * Extract what looks like a company/organization name from document titles.
 * Looks for patterns like "# Company Name Privacy Policy" or "**Company:** Foo Inc"
 */
function extractCompanyName(content: string): string | null {
  // Pattern: "**Company:** Name" or "**Organization:** Name"
  const companyFieldMatch = content.match(/\*\*(?:Company|Organization|Provider|Operator):\*\*\s*(.+)/i);
  if (companyFieldMatch) {
    const name = companyFieldMatch[1].trim();
    // Skip if it's still a placeholder
    if (name.startsWith("[") || name.toLowerCase().includes("your company")) return null;
    return name;
  }

  // Pattern: first H1 heading often contains "CompanyName Privacy Policy" etc
  const h1Match = content.match(/^#\s+(.+?)(?:\s+(?:Privacy Policy|Terms of Service|Cookie Policy|Security Policy|Data Processing|Acceptable Use))/im);
  if (h1Match) {
    const name = h1Match[1].trim();
    if (name.startsWith("[") || name.toLowerCase().includes("your company")) return null;
    if (name.length > 0 && name.length < 80) return name;
  }

  return null;
}

/**
 * Check if a document references services that were not detected in the scan.
 * Only flags well-known service names to avoid false positives.
 */
function findUndetectedServiceReferences(
  content: string,
  detectedServiceNames: Set<string>
): string[] {
  // Well-known third-party services that would be notable if referenced but not detected
  const knownServices = [
    "Stripe", "PayPal", "Braintree", "Square",
    "Google Analytics", "Mixpanel", "Amplitude", "Segment", "Heap",
    "Sentry", "Datadog", "New Relic", "LogRocket",
    "SendGrid", "Mailgun", "Mailchimp", "Postmark",
    "Twilio", "Plivo",
    "AWS", "Google Cloud", "Azure",
    "Firebase", "Supabase",
    "Algolia", "Elasticsearch",
    "Cloudflare", "Fastly",
    "Intercom", "Zendesk", "Crisp",
    "Auth0", "Okta",
    "OpenAI", "Anthropic", "Cohere",
    "Slack", "Discord",
    "Redis", "MongoDB", "PostgreSQL",
    "Vercel", "Netlify", "Heroku",
  ];

  const lowerDetected = new Set(
    Array.from(detectedServiceNames).map((s) => s.toLowerCase())
  );
  const undetected: string[] = [];

  for (const service of knownServices) {
    // Skip if detected
    if (lowerDetected.has(service.toLowerCase())) continue;

    // Check if the service name appears in the document content (case-insensitive, word boundary)
    const escaped = service.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(content)) {
      // Avoid false positives: skip if it's inside a generic/template sentence
      // like "services such as Stripe, PayPal" which generators sometimes include as examples
      if (!undetected.includes(service)) {
        undetected.push(service);
      }
    }
  }
  return undetected;
}

/**
 * Lint existing compliance documents against what codepliant would generate.
 *
 * Checks:
 * 1. Missing documents that should exist based on the scan
 * 2. Missing sections within existing documents
 * 3. Placeholder values that haven't been customized
 * 4. Outdated documents (older than configured threshold)
 * 5. Documents referencing services not detected in the scan
 * 6. Broken internal document links
 * 7. Inconsistent company name across documents
 */
export function lintDocuments(
  projectPath: string,
  outputDir: string
): LintResult {
  const absProjectPath = path.resolve(projectPath);
  const absOutputDir = path.resolve(absProjectPath, outputDir);
  const issues: LintIssue[] = [];

  // Scan the project
  const scanResult = scan(absProjectPath);
  const config = loadConfig(absProjectPath);

  // Generate what codepliant would produce
  const expectedDocs = generateDocuments(scanResult, config);

  // Build set of detected service names for cross-reference checking
  const detectedServiceNames = new Set(
    scanResult.services.map((s) => s.name)
  );

  let documentsChecked = 0;

  // Track company names across all documents for consistency check
  const companyNames = new Map<string, string[]>(); // name -> list of filenames

  for (const expected of expectedDocs) {
    const filePath = path.join(absOutputDir, expected.filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      issues.push({
        document: expected.name,
        severity: "error",
        rule: "missing-document",
        message: `Missing document: ${expected.filename}. Run 'codepliant go' to generate it.`,
      });
      continue;
    }

    documentsChecked++;

    // Read existing content
    let existingContent: string;
    try {
      existingContent = fs.readFileSync(filePath, "utf-8");
    } catch {
      issues.push({
        document: expected.name,
        severity: "error",
        rule: "unreadable",
        message: `Could not read ${expected.filename}.`,
      });
      continue;
    }

    // Check for empty files
    if (existingContent.trim().length === 0) {
      issues.push({
        document: expected.name,
        severity: "error",
        rule: "empty-document",
        message: `${expected.filename} is empty.`,
      });
      continue;
    }

    // Check for missing sections
    const expectedSections = extractSections(expected.content);
    const existingSections = extractSections(existingContent);

    for (const section of expectedSections) {
      if (!existingSections.has(section)) {
        issues.push({
          document: expected.name,
          severity: "warning",
          rule: "missing-section",
          message: `Missing section "${section}" in ${expected.filename}.`,
        });
      }
    }

    // Check for placeholders
    const placeholders = findPlaceholders(existingContent);
    if (placeholders.length > 0) {
      issues.push({
        document: expected.name,
        severity: "warning",
        rule: "placeholder",
        message: `${expected.filename} contains placeholder(s): ${placeholders.join(", ")}. Replace them with actual values.`,
      });
    }

    // Check if the document has a "Last updated" date
    const dateMatch = existingContent.match(/\*\*Last updated:\*\*\s*(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      const docDate = new Date(dateMatch[1]);
      const now = new Date();
      const daysSinceUpdate = Math.floor((now.getTime() - docDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceUpdate > 180) {
        issues.push({
          document: expected.name,
          severity: "warning",
          rule: "outdated",
          message: `${expected.filename} was last updated ${daysSinceUpdate} days ago. Consider regenerating.`,
        });
      }
    }

    // Check for references to services not detected in the scan
    const undetectedRefs = findUndetectedServiceReferences(existingContent, detectedServiceNames);
    if (undetectedRefs.length > 0) {
      issues.push({
        document: expected.name,
        severity: "warning",
        rule: "undetected-service",
        message: `${expected.filename} references service(s) not found in scan: ${undetectedRefs.join(", ")}. Remove or verify these references.`,
      });
    }

    // Check for broken internal document links
    const brokenLinks = findBrokenLinks(existingContent, filePath, absOutputDir);
    if (brokenLinks.length > 0) {
      issues.push({
        document: expected.name,
        severity: "warning",
        rule: "broken-link",
        message: `${expected.filename} contains broken internal link(s): ${brokenLinks.join(", ")}`,
      });
    }

    // Collect company name for cross-document consistency check
    const companyName = extractCompanyName(existingContent);
    if (companyName) {
      const existing = companyNames.get(companyName) || [];
      existing.push(expected.filename);
      companyNames.set(companyName, existing);
    }
  }

  // Cross-document check: inconsistent company names
  if (companyNames.size > 1) {
    const names = Array.from(companyNames.keys());
    const nameList = names.map((n) => {
      const files = companyNames.get(n)!;
      return `"${n}" (in ${files.join(", ")})`;
    }).join("; ");
    issues.push({
      document: "(all)",
      severity: "warning",
      rule: "inconsistent-company-name",
      message: `Inconsistent company names across documents: ${nameList}. Use the same name everywhere.`,
    });
  }

  const hasErrors = issues.some((i) => i.severity === "error");

  return {
    issues,
    passed: !hasErrors,
    documentsChecked,
    documentsExpected: expectedDocs.length,
  };
}
