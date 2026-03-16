import type { ScanResult, DetectedService } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates PRIVACY_RISK_MATRIX.md — a visual risk matrix (likelihood x impact)
 * for all detected data processing activities, color-coded by severity level
 * with specific mitigation actions per risk.
 */

interface PrivacyRisk {
  id: string;
  activity: string;
  dataTypes: string[];
  likelihood: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  mitigations: string[];
  services: string[];
}

const LIKELIHOOD_LABELS: Record<number, string> = {
  1: "Rare",
  2: "Unlikely",
  3: "Possible",
  4: "Likely",
  5: "Almost Certain",
};

const IMPACT_LABELS: Record<number, string> = {
  1: "Negligible",
  2: "Minor",
  3: "Moderate",
  4: "Major",
  5: "Severe",
};

function riskScore(r: PrivacyRisk): number {
  return r.likelihood * r.impact;
}

function riskLevel(score: number): string {
  if (score >= 15) return "Critical";
  if (score >= 10) return "High";
  if (score >= 5) return "Medium";
  return "Low";
}

function riskColor(score: number): string {
  if (score >= 15) return "🔴";
  if (score >= 10) return "🟠";
  if (score >= 5) return "🟡";
  return "🟢";
}

function derivePrivacyRisks(scan: ScanResult): PrivacyRisk[] {
  const risks: PrivacyRisk[] = [];
  let counter = 0;

  function nextId(): string {
    return `PR-${String(++counter).padStart(3, "0")}`;
  }

  const services = scan.services;
  const hasAnalytics = services.some((s) => s.category === "analytics" || s.category === "advertising");
  const hasAuth = services.some((s) => s.category === "auth");
  const hasPayment = services.some((s) => s.category === "payment");
  const hasAI = services.some((s) => s.category === "ai");
  const hasDatabase = services.some((s) => s.category === "database");
  const hasStorage = services.some((s) => s.category === "storage");
  const hasEmail = services.some((s) => s.category === "email");

  if (hasAnalytics) {
    risks.push({
      id: nextId(),
      activity: "User behavior tracking and analytics",
      dataTypes: ["IP addresses", "device fingerprints", "browsing history", "click patterns"],
      likelihood: 4,
      impact: 3,
      mitigations: [
        "Implement cookie consent management platform (CMP)",
        "Anonymize IP addresses before storage",
        "Set data retention limits (max 26 months for GA4)",
        "Provide opt-out mechanism in privacy settings",
        "Conduct regular audit of tracked events",
      ],
      services: services.filter((s) => s.category === "analytics" || s.category === "advertising").map((s) => s.name),
    });
  }

  if (hasAuth) {
    risks.push({
      id: nextId(),
      activity: "User authentication and identity management",
      dataTypes: ["email addresses", "passwords/hashes", "OAuth tokens", "session data"],
      likelihood: 3,
      impact: 5,
      mitigations: [
        "Enforce bcrypt/argon2 password hashing with sufficient rounds",
        "Implement MFA for all user accounts",
        "Set session timeout and token rotation policies",
        "Monitor for credential stuffing attacks",
        "Implement account lockout after failed attempts",
      ],
      services: services.filter((s) => s.category === "auth").map((s) => s.name),
    });
  }

  if (hasPayment) {
    risks.push({
      id: nextId(),
      activity: "Payment processing and financial data handling",
      dataTypes: ["credit card tokens", "billing addresses", "transaction history", "financial identifiers"],
      likelihood: 2,
      impact: 5,
      mitigations: [
        "Use PCI DSS compliant payment processor with tokenization",
        "Never store raw card numbers — use hosted payment forms",
        "Implement fraud detection and monitoring",
        "Conduct annual PCI compliance self-assessment",
        "Encrypt all financial data at rest and in transit",
      ],
      services: services.filter((s) => s.category === "payment").map((s) => s.name),
    });
  }

  if (hasAI) {
    risks.push({
      id: nextId(),
      activity: "AI/ML data processing and model inference",
      dataTypes: ["user prompts", "generated outputs", "training data", "usage patterns"],
      likelihood: 4,
      impact: 4,
      mitigations: [
        "Implement data minimization — send only necessary data to AI services",
        "Review AI provider data retention and training policies",
        "Add opt-out for AI features that process personal data",
        "Conduct AI-specific DPIA under GDPR Art. 35",
        "Implement human oversight for high-risk AI decisions",
        "Log all AI processing for audit trail",
      ],
      services: services.filter((s) => s.category === "ai").map((s) => s.name),
    });
  }

  if (hasDatabase) {
    risks.push({
      id: nextId(),
      activity: "Persistent data storage and retrieval",
      dataTypes: ["user profiles", "application data", "metadata", "logs"],
      likelihood: 3,
      impact: 4,
      mitigations: [
        "Enable encryption at rest for all database instances",
        "Implement field-level encryption for sensitive columns",
        "Enforce least-privilege access controls",
        "Enable audit logging for data access",
        "Implement automated backup with tested recovery",
        "Set data retention schedules with automated deletion",
      ],
      services: services.filter((s) => s.category === "database").map((s) => s.name),
    });
  }

  if (hasStorage) {
    risks.push({
      id: nextId(),
      activity: "File and object storage",
      dataTypes: ["uploaded files", "documents", "media files", "backups"],
      likelihood: 3,
      impact: 3,
      mitigations: [
        "Enable server-side encryption for all storage buckets",
        "Implement access control lists (ACLs) with least privilege",
        "Enable versioning and audit logging",
        "Scan uploaded files for malware",
        "Set lifecycle policies for automatic data deletion",
      ],
      services: services.filter((s) => s.category === "storage").map((s) => s.name),
    });
  }

  if (hasEmail) {
    risks.push({
      id: nextId(),
      activity: "Email communications and marketing",
      dataTypes: ["email addresses", "communication content", "engagement metrics"],
      likelihood: 3,
      impact: 3,
      mitigations: [
        "Implement double opt-in for marketing emails",
        "Provide one-click unsubscribe in all communications",
        "Maintain suppression lists across all email services",
        "Encrypt email content containing personal data",
        "Audit email service provider DPAs annually",
      ],
      services: services.filter((s) => s.category === "email").map((s) => s.name),
    });
  }

  // Cross-cutting: international transfer risk
  if (services.length >= 2) {
    risks.push({
      id: nextId(),
      activity: "International data transfers to third-party processors",
      dataTypes: ["all personal data shared with external services"],
      likelihood: 4,
      impact: 4,
      mitigations: [
        "Execute Data Processing Agreements (DPAs) with all processors",
        "Verify Standard Contractual Clauses (SCCs) are in place",
        "Conduct Transfer Impact Assessments for non-EU transfers",
        "Monitor processor compliance with agreed safeguards",
        "Maintain an up-to-date sub-processor register",
      ],
      services: services.map((s) => s.name),
    });
  }

  return risks;
}

export function generatePrivacyRiskMatrix(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];
  const nextReview = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const risks = derivePrivacyRisks(scan);
  if (risks.length === 0) {
    return null;
  }

  risks.sort((a, b) => riskScore(b) - riskScore(a));

  const lines: string[] = [];

  // Header with document metadata
  lines.push("# Privacy Risk Matrix");
  lines.push("");
  lines.push(`> **Document Version:** 1.0`);
  lines.push(`> **Document Owner:** ${company}`);
  lines.push(`> **Generated:** ${date} by [Codepliant](https://github.com/joechensmartz/codepliant)`);
  lines.push(`> **Next Review Date:** ${nextReview}`);
  lines.push("");
  lines.push("This document provides a visual risk assessment of all detected data processing activities,");
  lines.push("scored by likelihood and impact, with specific mitigation actions for each risk.");
  lines.push("");

  // Executive summary
  const critical = risks.filter((r) => riskScore(r) >= 15).length;
  const high = risks.filter((r) => riskScore(r) >= 10 && riskScore(r) < 15).length;
  const medium = risks.filter((r) => riskScore(r) >= 5 && riskScore(r) < 10).length;
  const low = risks.filter((r) => riskScore(r) < 5).length;

  lines.push("## Executive Summary");
  lines.push("");
  lines.push("| Level | Count | Action Required |");
  lines.push("|-------|-------|-----------------|");
  if (critical > 0) lines.push(`| 🔴 Critical | ${critical} | Immediate remediation — escalate to leadership |`);
  if (high > 0) lines.push(`| 🟠 High | ${high} | Address within 30 days |`);
  if (medium > 0) lines.push(`| 🟡 Medium | ${medium} | Address within 90 days |`);
  if (low > 0) lines.push(`| 🟢 Low | ${low} | Monitor quarterly |`);
  lines.push(`| **Total** | **${risks.length}** | |`);
  lines.push("");

  // Visual risk matrix (5x5 grid)
  lines.push("## Visual Risk Matrix");
  lines.push("");
  lines.push("Each cell shows the risk IDs that fall at that likelihood/impact intersection.");
  lines.push("");

  // Build 5x5 grid
  const grid: string[][] = Array.from({ length: 5 }, () => Array(5).fill(""));
  for (const risk of risks) {
    const row = 5 - risk.likelihood; // row 0 = likelihood 5 (top)
    const col = risk.impact - 1; // col 0 = impact 1 (left)
    const emoji = riskColor(riskScore(risk));
    grid[row][col] = grid[row][col] ? `${grid[row][col]}, ${emoji}${risk.id}` : `${emoji}${risk.id}`;
  }

  lines.push("| Likelihood \\ Impact | 1 - Negligible | 2 - Minor | 3 - Moderate | 4 - Major | 5 - Severe |");
  lines.push("|---------------------|----------------|-----------|--------------|-----------|------------|");
  for (let row = 0; row < 5; row++) {
    const likelihoodVal = 5 - row;
    const label = `**${likelihoodVal}** - ${LIKELIHOOD_LABELS[likelihoodVal]}`;
    const cells = grid[row].map((cell) => cell || "—");
    lines.push(`| ${label} | ${cells.join(" | ")} |`);
  }
  lines.push("");

  // Score legend
  lines.push("### Scoring Legend");
  lines.push("");
  lines.push("| Score Range | Level | Color |");
  lines.push("|-------------|-------|-------|");
  lines.push("| 15–25 | Critical | 🔴 |");
  lines.push("| 10–14 | High | 🟠 |");
  lines.push("| 5–9 | Medium | 🟡 |");
  lines.push("| 1–4 | Low | 🟢 |");
  lines.push("");

  // Detailed risk table
  lines.push("## Risk Register");
  lines.push("");
  lines.push("| ID | Processing Activity | Likelihood | Impact | Score | Level | Services |");
  lines.push("|----|---------------------|------------|--------|-------|-------|----------|");

  for (const risk of risks) {
    const score = riskScore(risk);
    const level = riskLevel(score);
    const color = riskColor(score);
    lines.push(
      `| ${risk.id} | ${risk.activity} | ${risk.likelihood} (${LIKELIHOOD_LABELS[risk.likelihood]}) | ${risk.impact} (${IMPACT_LABELS[risk.impact]}) | ${score} | ${color} ${level} | ${risk.services.join(", ")} |`,
    );
  }
  lines.push("");

  // Detailed risk entries with mitigations
  lines.push("## Risk Details and Mitigations");
  lines.push("");

  for (const risk of risks) {
    const score = riskScore(risk);
    const level = riskLevel(score);
    const color = riskColor(score);

    lines.push(`### ${risk.id}: ${risk.activity} ${color}`);
    lines.push("");
    lines.push(`**Risk Level:** ${level} (${score}/25)  `);
    lines.push(`**Likelihood:** ${risk.likelihood}/5 (${LIKELIHOOD_LABELS[risk.likelihood]})  `);
    lines.push(`**Impact:** ${risk.impact}/5 (${IMPACT_LABELS[risk.impact]})  `);
    lines.push(`**Affected Services:** ${risk.services.join(", ")}`);
    lines.push("");

    lines.push("**Data Types at Risk:**");
    lines.push("");
    for (const dt of risk.dataTypes) {
      lines.push(`- ${dt}`);
    }
    lines.push("");

    lines.push("**Required Mitigations:**");
    lines.push("");
    for (const m of risk.mitigations) {
      lines.push(`- [ ] ${m}`);
    }
    lines.push("");
  }

  // Disclaimer
  lines.push("---");
  lines.push("");
  lines.push(
    "*This privacy risk matrix is generated from automated code analysis and should be reviewed by qualified privacy and legal professionals. Risk scores are indicative and should be validated against your organization's specific risk appetite and context. This does not constitute legal advice.*",
  );
  lines.push("");

  return lines.join("\n");
}
