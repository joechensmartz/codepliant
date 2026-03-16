import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import type { ScanResult, DetectedService, ComplianceNeed, DataCategory } from "../scanner/index.js";
import type { GeneratedDocument } from "../generator/index.js";
import type { CodepliantConfig } from "../config.js";
import { computeComplianceScore, formatScoreMarkdown } from "../scoring/index.js";

const TOOL_VERSION = "18.0.0";

export interface ComplianceReportOptions {
  scanResult: ScanResult;
  docs: GeneratedDocument[];
  config?: CodepliantConfig;
  outputDir: string;
  /** Override the scan timestamp (useful for testing) */
  timestamp?: string;
  /** Override the tool version (useful for testing) */
  version?: string;
}

export interface ReportMetadata {
  generatedAt: string;
  toolVersion: string;
  projectHash: string;
  projectName: string;
  projectPath: string;
}

/**
 * Compute a deterministic hash of the project path + scan timestamp
 * for audit trail purposes.
 */
function computeProjectHash(projectPath: string, scannedAt: string): string {
  return crypto
    .createHash("sha256")
    .update(`${projectPath}:${scannedAt}`)
    .digest("hex")
    .slice(0, 12);
}

/**
 * Compute a compliance score based on which required documents were generated.
 */
function computeScore(needs: ComplianceNeed[], docs: GeneratedDocument[]): number {
  if (needs.length === 0) return 100;

  const generatedNames = new Set(docs.map(d => d.name));
  let score = 0;
  let total = 0;

  for (const need of needs) {
    const weight = need.priority === "required" ? 15 : 5;
    total += weight;
    if (generatedNames.has(need.document)) {
      score += weight;
    }
  }

  if (total === 0) return 100;
  return Math.round((score / total) * 100);
}

function scoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 50) return "Needs Improvement";
  return "Critical";
}

/**
 * Build the executive summary section.
 */
function renderExecutiveSummary(
  meta: ReportMetadata,
  scanResult: ScanResult,
  docs: GeneratedDocument[],
  score: number,
): string {
  const serviceCount = scanResult.services.length;
  const dataProcessors = scanResult.services.filter(s => s.isDataProcessor !== false).length;
  const requiredNeeds = scanResult.complianceNeeds.filter(n => n.priority === "required").length;
  const recommendedNeeds = scanResult.complianceNeeds.filter(n => n.priority === "recommended").length;

  return `## Executive Summary

| Metric | Value |
|--------|-------|
| **Compliance Score** | ${score}% (${scoreLabel(score)}) |
| **Services Detected** | ${serviceCount} (${dataProcessors} data processors) |
| **Documents Generated** | ${docs.length} |
| **Required Actions** | ${requiredNeeds} |
| **Recommended Actions** | ${recommendedNeeds} |
| **Data Categories** | ${scanResult.dataCategories.length} |
| **Scan Date** | ${meta.generatedAt} |

${score < 50 ? "> **CRITICAL:** Your compliance posture requires immediate attention. See Recommendations below.\n" : ""}${score >= 50 && score < 75 ? "> **WARNING:** Several compliance gaps remain. Review the action plan below.\n" : ""}${score >= 75 ? "> Your project has a solid compliance foundation. Review recommended improvements below.\n" : ""}`;
}

/**
 * Build the scan findings section with all detected services and evidence.
 */
function renderScanFindings(scanResult: ScanResult): string {
  if (scanResult.services.length === 0) {
    return `## Scan Findings

No third-party services detected. This project may not collect user data, or services
may be configured outside the scanned codebase.
`;
  }

  const categoryGroups = new Map<string, DetectedService[]>();
  for (const svc of scanResult.services) {
    const group = categoryGroups.get(svc.category) || [];
    group.push(svc);
    categoryGroups.set(svc.category, group);
  }

  let md = `## Scan Findings

**${scanResult.services.length} service(s)** detected across **${categoryGroups.size} categor${categoryGroups.size === 1 ? "y" : "ies"}**:

`;

  const sortedCategories = Array.from(categoryGroups.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  for (const [category, services] of sortedCategories) {
    md += `### ${formatCategoryTitle(category)}\n\n`;
    md += `| Service | Data Collected | Evidence |\n`;
    md += `|---------|---------------|----------|\n`;

    for (const svc of services) {
      const data = svc.dataCollected.join(", ") || "N/A";
      const evidence = svc.evidence
        .map(e => `\`${e.file}\` (${e.type})`)
        .slice(0, 3)
        .join(", ");
      const suffix = svc.evidence.length > 3 ? ` +${svc.evidence.length - 3} more` : "";
      const processor = svc.isDataProcessor === false ? " (utility)" : "";
      md += `| ${svc.name}${processor} | ${data} | ${evidence}${suffix} |\n`;
    }
    md += "\n";
  }

  if (scanResult.warnings && scanResult.warnings.length > 0) {
    md += `### Scanner Warnings\n\n`;
    for (const w of scanResult.warnings) {
      md += `- ${w}\n`;
    }
    md += "\n";
  }

  return md;
}

function formatCategoryTitle(category: string): string {
  const titles: Record<string, string> = {
    ai: "AI / Machine Learning",
    analytics: "Analytics & Tracking",
    auth: "Authentication",
    advertising: "Advertising",
    database: "Database & Storage",
    email: "Email Services",
    monitoring: "Monitoring & Error Tracking",
    payment: "Payment Processing",
    social: "Social Media",
    storage: "Cloud Storage",
    other: "Other Services",
  };
  return titles[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

/**
 * Build the data flow summary section.
 */
function renderDataFlowSummary(scanResult: ScanResult): string {
  if (scanResult.dataCategories.length === 0) {
    return `## Data Flow Summary

No data categories detected.
`;
  }

  let md = `## Data Flow Summary

The following categories of data are collected, processed, or shared by this application:

| Data Category | Description | Sources |
|---------------|-------------|---------|
`;

  for (const cat of scanResult.dataCategories) {
    const sources = cat.sources.join(", ");
    md += `| ${cat.category} | ${cat.description.split(".")[0]}. | ${sources} |\n`;
  }

  md += "\n";
  return md;
}

/**
 * Build the regulatory coverage matrix section.
 */
function renderRegulatoryMatrix(scanResult: ScanResult, config?: CodepliantConfig): string {
  const hasAI = scanResult.services.some(s => s.category === "ai");
  const hasAnalytics = scanResult.services.some(s => s.category === "analytics" || s.category === "advertising");
  const hasPayment = scanResult.services.some(s => s.category === "payment");
  const hasAuth = scanResult.services.some(s => s.category === "auth");
  const hasServices = scanResult.services.length > 0;

  const regulations = [
    {
      name: "GDPR (EU)",
      applies: hasServices,
      relevance: hasServices ? "High" : "Low",
      requirements: "Privacy policy, DPA, DSAR process, consent management",
    },
    {
      name: "CCPA/CPRA (California)",
      applies: hasServices,
      relevance: hasServices ? "High" : "Low",
      requirements: "Privacy policy, opt-out mechanism, data deletion rights",
    },
    {
      name: "UK GDPR",
      applies: hasServices,
      relevance: hasServices ? "Medium" : "Low",
      requirements: "Similar to EU GDPR with UK-specific provisions",
    },
    {
      name: "EU AI Act",
      applies: hasAI,
      relevance: hasAI ? "High" : "N/A",
      requirements: "AI disclosure, risk assessment, transparency obligations",
    },
    {
      name: "ePrivacy Directive",
      applies: hasAnalytics || hasAuth,
      relevance: hasAnalytics ? "High" : hasAuth ? "Medium" : "N/A",
      requirements: "Cookie consent, tracking disclosure",
    },
    {
      name: "PCI DSS",
      applies: hasPayment,
      relevance: hasPayment ? "High" : "N/A",
      requirements: "Payment data security, access controls, audit logging",
    },
  ];

  let md = `## Regulatory Coverage Matrix

`;

  const jurisdictions = config?.jurisdictions || (config?.jurisdiction ? [config.jurisdiction] : []);
  if (jurisdictions.length > 0) {
    md += `**Configured jurisdictions:** ${jurisdictions.join(", ")}\n\n`;
  }

  md += `| Regulation | Applies | Relevance | Key Requirements |\n`;
  md += `|------------|---------|-----------|------------------|\n`;

  for (const reg of regulations) {
    const check = reg.applies ? "Yes" : "No";
    md += `| ${reg.name} | ${check} | ${reg.relevance} | ${reg.requirements} |\n`;
  }

  md += "\n";
  return md;
}

/**
 * Build the document inventory section.
 */
function renderDocumentInventory(docs: GeneratedDocument[], timestamp: string): string {
  let md = `## Document Inventory

**${docs.length} document(s)** generated at ${timestamp}:

| # | Document | Filename | Sections |
|---|----------|----------|----------|
`;

  docs.forEach((doc, i) => {
    const sections = countSections(doc.content);
    md += `| ${i + 1} | ${doc.name} | \`${doc.filename}\` | ${sections} |\n`;
  });

  md += "\n";
  return md;
}

function countSections(content: string): number {
  let count = 0;
  for (const line of content.split("\n")) {
    if (/^#{1,3}\s+/.test(line)) count++;
  }
  return count;
}

/**
 * Build the recommendations section, prioritized by risk.
 */
function renderRecommendations(scanResult: ScanResult, docs: GeneratedDocument[]): string {
  const recommendations: Array<{
    priority: "critical" | "high" | "medium" | "low";
    title: string;
    detail: string;
  }> = [];

  const generatedNames = new Set(docs.map(d => d.name));

  // Check for missing required documents
  for (const need of scanResult.complianceNeeds) {
    if (!generatedNames.has(need.document)) {
      recommendations.push({
        priority: need.priority === "required" ? "critical" : "medium",
        title: `Missing: ${need.document}`,
        detail: need.reason,
      });
    }
  }

  // AI-specific recommendations
  const hasAI = scanResult.services.some(s => s.category === "ai");
  if (hasAI) {
    recommendations.push({
      priority: "high",
      title: "EU AI Act compliance review",
      detail:
        "AI services detected. Ensure your AI risk classification is accurate and AI disclosure documents are reviewed by legal counsel before the August 2026 enforcement date.",
    });
  }

  // Payment-specific recommendations
  const hasPayment = scanResult.services.some(s => s.category === "payment");
  if (hasPayment) {
    recommendations.push({
      priority: "high",
      title: "PCI DSS compliance verification",
      detail:
        "Payment processing detected. Verify PCI DSS compliance level and ensure card data is handled exclusively by your payment processor (e.g., Stripe, Braintree).",
    });
  }

  // Analytics/advertising recommendations
  const hasAds = scanResult.services.some(s => s.category === "advertising");
  if (hasAds) {
    recommendations.push({
      priority: "high",
      title: "Cookie consent implementation",
      detail:
        "Advertising/tracking services detected. Implement a cookie consent banner that blocks tracking scripts until consent is obtained (required by GDPR/ePrivacy).",
    });
  }

  // General recommendations
  if (scanResult.services.length > 0) {
    recommendations.push({
      priority: "medium",
      title: "Legal review of generated documents",
      detail:
        "All generated documents should be reviewed and customized by qualified legal counsel before publication.",
    });

    recommendations.push({
      priority: "low",
      title: "Schedule periodic compliance re-scan",
      detail:
        "Run codepliant on every release or at minimum quarterly to catch new service integrations and maintain accurate compliance documentation.",
    });
  }

  // Sort by priority
  const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  if (recommendations.length === 0) {
    return `## Recommendations

No recommendations at this time. Your project has comprehensive compliance documentation.
`;
  }

  const priorityIcons: Record<string, string> = {
    critical: "CRITICAL",
    high: "HIGH",
    medium: "MEDIUM",
    low: "LOW",
  };

  let md = `## Recommendations

`;

  for (const rec of recommendations) {
    md += `### [${priorityIcons[rec.priority]}] ${rec.title}\n\n`;
    md += `${rec.detail}\n\n`;
  }

  return md;
}

/**
 * Build the action plan section with suggested deadlines.
 */
function renderActionPlan(scanResult: ScanResult, docs: GeneratedDocument[]): string {
  const actions: Array<{
    action: string;
    owner: string;
    deadline: string;
    priority: string;
  }> = [];

  const generatedNames = new Set(docs.map(d => d.name));
  const now = new Date();

  // Missing required documents = immediate
  for (const need of scanResult.complianceNeeds) {
    if (need.priority === "required" && !generatedNames.has(need.document)) {
      actions.push({
        action: `Generate and publish ${need.document}`,
        owner: "Legal / Engineering",
        deadline: formatDeadline(now, 7),
        priority: "Immediate",
      });
    }
  }

  // Legal review of existing docs
  if (docs.length > 0) {
    actions.push({
      action: "Legal review of all generated compliance documents",
      owner: "Legal Counsel",
      deadline: formatDeadline(now, 14),
      priority: "High",
    });
  }

  // Publish documents
  if (docs.length > 0) {
    actions.push({
      action: "Publish reviewed documents to production",
      owner: "Engineering",
      deadline: formatDeadline(now, 21),
      priority: "High",
    });
  }

  // AI Act specific
  const hasAI = scanResult.services.some(s => s.category === "ai");
  if (hasAI) {
    actions.push({
      action: "Complete AI risk classification assessment",
      owner: "CTO / Legal",
      deadline: formatDeadline(now, 30),
      priority: "High",
    });
  }

  // Cookie consent
  const hasTracking = scanResult.services.some(
    s => s.category === "analytics" || s.category === "advertising"
  );
  if (hasTracking) {
    actions.push({
      action: "Implement cookie consent banner",
      owner: "Engineering",
      deadline: formatDeadline(now, 30),
      priority: "Medium",
    });
  }

  // CI integration
  actions.push({
    action: "Add codepliant check to CI/CD pipeline",
    owner: "DevOps / Engineering",
    deadline: formatDeadline(now, 30),
    priority: "Medium",
  });

  // Recurring re-scan
  actions.push({
    action: "Schedule quarterly compliance re-scan",
    owner: "Engineering",
    deadline: formatDeadline(now, 90),
    priority: "Low",
  });

  // Missing recommended documents
  for (const need of scanResult.complianceNeeds) {
    if (need.priority === "recommended" && !generatedNames.has(need.document)) {
      actions.push({
        action: `Draft ${need.document}`,
        owner: "Legal / Engineering",
        deadline: formatDeadline(now, 60),
        priority: "Medium",
      });
    }
  }

  let md = `## Action Plan

| # | Action | Owner | Deadline | Priority |
|---|--------|-------|----------|----------|
`;

  actions.forEach((a, i) => {
    md += `| ${i + 1} | ${a.action} | ${a.owner} | ${a.deadline} | ${a.priority} |\n`;
  });

  md += "\n";
  return md;
}

function formatDeadline(from: Date, daysOut: number): string {
  const d = new Date(from);
  d.setDate(d.getDate() + daysOut);
  return d.toISOString().split("T")[0];
}

/**
 * Render the audit trail footer.
 */
function renderAuditFooter(meta: ReportMetadata): string {
  return `---

## Audit Information

| Field | Value |
|-------|-------|
| **Report Generated** | ${meta.generatedAt} |
| **Tool Version** | Codepliant v${meta.toolVersion} |
| **Project Hash** | \`${meta.projectHash}\` |
| **Project** | ${meta.projectName} |
| **Project Path** | \`${meta.projectPath}\` |

> This report was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant).
> It is not legal advice. All documents and findings should be reviewed by qualified legal counsel.
`;
}

/**
 * Render a one-page PDF-friendly executive summary.
 *
 * Designed to be printed on a single page for board meetings.
 * Key metrics, top risks, and recommended actions in a compact format.
 */
function renderExecutiveSummaryPage(
  meta: ReportMetadata,
  scanResult: ScanResult,
  docs: GeneratedDocument[],
  score: number,
  detailedScore: ReturnType<typeof computeComplianceScore>,
): string {
  const serviceCount = scanResult.services.length;
  const dataProcessors = scanResult.services.filter(s => s.isDataProcessor !== false).length;
  const requiredNeeds = scanResult.complianceNeeds.filter(n => n.priority === "required").length;
  const recommendedNeeds = scanResult.complianceNeeds.filter(n => n.priority === "recommended").length;

  const generatedNames = new Set(docs.map(d => d.name));
  const missingRequired = scanResult.complianceNeeds
    .filter(n => n.priority === "required" && !generatedNames.has(n.document))
    .map(n => n.document);
  const missingRecommended = scanResult.complianceNeeds
    .filter(n => n.priority === "recommended" && !generatedNames.has(n.document))
    .map(n => n.document);

  // Determine risk level
  let riskLevel: string;
  let riskDetail: string;
  if (score >= 90) {
    riskLevel = "LOW";
    riskDetail = "Compliance posture is strong. Continue regular monitoring.";
  } else if (score >= 75) {
    riskLevel = "MODERATE";
    riskDetail = "Minor gaps identified. Address recommended items within 30 days.";
  } else if (score >= 50) {
    riskLevel = "HIGH";
    riskDetail = "Significant compliance gaps. Immediate action required.";
  } else {
    riskLevel = "CRITICAL";
    riskDetail = "Major compliance deficiencies. Escalate to leadership immediately.";
  }

  // Top risks
  const topRisks: string[] = [];
  if (missingRequired.length > 0) {
    topRisks.push(`${missingRequired.length} required document(s) missing: ${missingRequired.slice(0, 3).join(", ")}${missingRequired.length > 3 ? ` +${missingRequired.length - 3} more` : ""}`);
  }
  const hasAI = scanResult.services.some(s => s.category === "ai");
  if (hasAI) topRisks.push("AI services in use — EU AI Act obligations apply");
  const hasPayment = scanResult.services.some(s => s.category === "payment");
  if (hasPayment) topRisks.push("Payment processing — PCI DSS scope implications");
  const hasAds = scanResult.services.some(s => s.category === "advertising");
  if (hasAds) topRisks.push("Advertising/tracking services — cookie consent required");
  if (topRisks.length === 0) topRisks.push("No critical risks identified");

  // Recommended actions (top 3)
  const actions: string[] = [];
  if (detailedScore.recommendations) {
    for (const rec of detailedScore.recommendations.slice(0, 3)) {
      actions.push(`[${rec.impact.toUpperCase()}] ${rec.title}`);
    }
  }
  if (actions.length === 0) actions.push("Continue periodic compliance reviews");

  // Regulation summary
  const regSummary: string[] = [];
  if (detailedScore.regulationScores) {
    for (const reg of detailedScore.regulationScores) {
      regSummary.push(`| ${reg.regulation} | ${reg.score}/100 | ${reg.grade} |`);
    }
  }

  let md = `# Executive Summary: ${meta.projectName}

> Compliance Report | ${meta.generatedAt.split("T")[0]} | Codepliant v${meta.toolVersion}

---

## Overall Compliance

| Metric | Value |
|--------|-------|
| **Compliance Score** | **${score}%** (${scoreLabel(score)}) |
| **Risk Level** | **${riskLevel}** |
| **Services Detected** | ${serviceCount} (${dataProcessors} data processors) |
| **Documents Generated** | ${docs.length} |
| **Required Actions** | ${requiredNeeds} |
| **Recommended Actions** | ${recommendedNeeds} |
| **Data Categories** | ${scanResult.dataCategories.length} |

> ${riskDetail}

## Top Risks

`;

  for (const risk of topRisks.slice(0, 5)) {
    md += `- ${risk}\n`;
  }

  md += `
## Recommended Actions

`;

  for (const action of actions) {
    md += `- ${action}\n`;
  }

  if (regSummary.length > 0) {
    md += `
## Regulatory Readiness

| Regulation | Score | Grade |
|------------|-------|-------|
`;
    md += regSummary.join("\n") + "\n";
  }

  md += `
---

*This executive summary was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant). Not legal advice.*
*Project Hash: \`${meta.projectHash}\`*

`;

  return md;
}

/**
 * Generate the full compliance report as a Markdown string.
 */
export function generateComplianceReport(options: ComplianceReportOptions): string {
  const { scanResult, docs, config, version } = options;
  const timestamp = options.timestamp || new Date().toISOString();
  const toolVersion = version || TOOL_VERSION;

  const meta: ReportMetadata = {
    generatedAt: timestamp,
    toolVersion,
    projectHash: computeProjectHash(scanResult.projectPath, scanResult.scannedAt),
    projectName: scanResult.projectName,
    projectPath: scanResult.projectPath,
  };

  const score = computeScore(scanResult.complianceNeeds, docs);

  // Compute detailed scoring breakdown
  const detailedScore = computeComplianceScore({
    scanResult,
    docs,
    config,
    outputDir: options.outputDir,
  });

  const sections = [
    `# Compliance Report: ${meta.projectName}\n`,
    `> Generated by Codepliant v${meta.toolVersion} on ${meta.generatedAt.split("T")[0]}\n`,
    renderExecutiveSummary(meta, scanResult, docs, score),
    formatScoreMarkdown(detailedScore),
    renderScanFindings(scanResult),
    renderDataFlowSummary(scanResult),
    renderRegulatoryMatrix(scanResult, config),
    renderDocumentInventory(docs, meta.generatedAt),
    renderRecommendations(scanResult, docs),
    renderActionPlan(scanResult, docs),
    renderAuditFooter(meta),
  ];

  return sections.join("\n");
}

/**
 * Generate a standalone executive summary page suitable for board meetings.
 * One-page PDF-friendly format with key metrics, top risks, and recommended actions.
 */
export function generateExecutiveSummary(options: ComplianceReportOptions): string {
  const { scanResult, docs, config, version } = options;
  const timestamp = options.timestamp || new Date().toISOString();
  const toolVersion = version || TOOL_VERSION;

  const meta: ReportMetadata = {
    generatedAt: timestamp,
    toolVersion,
    projectHash: computeProjectHash(scanResult.projectPath, scanResult.scannedAt),
    projectName: scanResult.projectName,
    projectPath: scanResult.projectPath,
  };

  const score = computeScore(scanResult.complianceNeeds, docs);

  const detailedScore = computeComplianceScore({
    scanResult,
    docs,
    config,
    outputDir: options.outputDir,
  });

  return renderExecutiveSummaryPage(meta, scanResult, docs, score, detailedScore);
}

/**
 * Write the executive summary to EXECUTIVE_SUMMARY.md.
 * Returns the written file path.
 */
export function writeExecutiveSummary(options: ComplianceReportOptions): string {
  const { outputDir } = options;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const content = generateExecutiveSummary(options);
  const filePath = path.join(outputDir, "EXECUTIVE_SUMMARY.md");
  fs.writeFileSync(filePath, content, "utf-8");
  return filePath;
}

/**
 * Write the compliance report to COMPLIANCE_REPORT.md.
 * Returns the written file path.
 */
export function writeComplianceReport(options: ComplianceReportOptions): string {
  const { outputDir } = options;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const content = generateComplianceReport(options);
  const filePath = path.join(outputDir, "COMPLIANCE_REPORT.md");
  fs.writeFileSync(filePath, content, "utf-8");
  return filePath;
}
