import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext, GeneratedDocument } from "./index.js";

/**
 * Generates EXECUTIVE_BRIEFING.md — a one-page C-suite briefing.
 * 3 bullet points: compliance status, top risk, recommended action.
 * Includes a visual compliance gauge.
 *
 * Returns null when no services are detected.
 */
export function generateExecutiveBriefing(
  scan: ScanResult,
  ctx: GeneratorContext | undefined,
  docs: GeneratedDocument[],
  score?: { total: number; grade: string },
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];
  const complianceScore = score?.total ?? 0;
  const complianceGrade = score?.grade ?? "N/A";

  // Determine score-based status
  const statusLabel =
    complianceScore >= 80
      ? "Strong"
      : complianceScore >= 60
        ? "Moderate"
        : complianceScore >= 40
          ? "Needs Attention"
          : "Critical";

  const statusColor =
    complianceScore >= 80
      ? "brightgreen"
      : complianceScore >= 60
        ? "yellow"
        : complianceScore >= 40
          ? "orange"
          : "red";

  // Build visual gauge
  const gauge = buildGauge(complianceScore);

  // Detect top risk
  const topRisk = determineTopRisk(scan, docs, ctx);

  // Determine recommended action
  const recommendedAction = determineRecommendedAction(scan, docs, complianceScore, ctx);

  // Count categories
  const categories = new Set<string>();
  for (const svc of scan.services) {
    categories.add(svc.category);
  }

  // Deduplicate services
  const seenServices = new Set<string>();
  const uniqueServices: Array<{ name: string; category: string }> = [];
  for (const svc of scan.services) {
    if (!seenServices.has(svc.name)) {
      seenServices.add(svc.name);
      uniqueServices.push({ name: svc.name, category: svc.category });
    }
  }

  // AI services
  const aiServices = scan.services.filter(
    (s) => s.category === "ai",
  );
  const hasAI = aiServices.length > 0;

  // Payment services
  const paymentServices = scan.services.filter(
    (s) => s.category === "payment",
  );

  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────────
  lines.push("# Executive Briefing");
  lines.push("");
  lines.push("<div align=\"center\">");
  lines.push("");
  lines.push(`## ${company} — Compliance Status`);
  lines.push("");
  lines.push(`**Date:** ${date}`);
  lines.push("");
  lines.push(`**Project:** ${scan.projectName}`);
  lines.push("");
  lines.push("</div>");
  lines.push("");
  lines.push("---");
  lines.push("");

  // ── Compliance Gauge ────────────────────────────────────────────────────
  lines.push("## Compliance Gauge");
  lines.push("");
  lines.push("```");
  lines.push(gauge);
  lines.push("```");
  lines.push("");
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|-------|`);
  lines.push(`| **Score** | ${complianceScore}/100 |`);
  lines.push(`| **Grade** | ${complianceGrade} |`);
  lines.push(`| **Status** | ${statusLabel} |`);
  lines.push(`| **Documents** | ${docs.length} |`);
  lines.push(`| **Services** | ${uniqueServices.length} |`);
  lines.push("");

  // ── 3 Key Bullet Points ────────────────────────────────────────────────
  lines.push("## Key Findings");
  lines.push("");

  // Bullet 1: Compliance status
  lines.push(`### 1. Compliance Status: ${statusLabel}`);
  lines.push("");
  if (complianceScore >= 80) {
    lines.push(
      `${company} has a **strong compliance posture** with a score of ${complianceScore}/100 (Grade: ${complianceGrade}). ` +
        `${docs.length} compliance documents have been generated covering ${uniqueServices.length} third-party services ` +
        `across ${categories.size} categories. The organization has documented policies for all major regulatory areas.`,
    );
  } else if (complianceScore >= 60) {
    lines.push(
      `${company} has a **moderate compliance posture** with a score of ${complianceScore}/100 (Grade: ${complianceGrade}). ` +
        `${docs.length} compliance documents are in place covering ${uniqueServices.length} services. ` +
        `Some gaps remain that should be addressed before the next audit cycle.`,
    );
  } else {
    lines.push(
      `${company} has **compliance gaps requiring attention** with a score of ${complianceScore}/100 (Grade: ${complianceGrade}). ` +
        `While ${docs.length} documents have been generated for ${uniqueServices.length} services, ` +
        `significant work is needed to reach an acceptable compliance level.`,
    );
  }
  lines.push("");

  // Bullet 2: Top risk
  lines.push(`### 2. Top Risk: ${topRisk.title}`);
  lines.push("");
  lines.push(topRisk.description);
  lines.push("");
  if (topRisk.dollarImpact) {
    lines.push(`**Potential exposure:** ${topRisk.dollarImpact}`);
    lines.push("");
  }

  // Bullet 3: Recommended action
  lines.push(`### 3. Recommended Action: ${recommendedAction.title}`);
  lines.push("");
  lines.push(recommendedAction.description);
  lines.push("");
  if (recommendedAction.timeline) {
    lines.push(`**Timeline:** ${recommendedAction.timeline}`);
    lines.push("");
  }

  // ── Quick Stats ─────────────────────────────────────────────────────────
  lines.push("---");
  lines.push("");
  lines.push("## At a Glance");
  lines.push("");
  lines.push("| Area | Status |");
  lines.push("|------|--------|");

  // Privacy
  const privacyDocs = docs.filter((d) =>
    ["PRIVACY_POLICY.md", "COOKIE_POLICY.md", "DATA_PROCESSING_AGREEMENT.md"].includes(d.filename),
  );
  lines.push(`| Privacy & Data Protection | ${privacyDocs.length >= 2 ? "Covered" : "Gaps"} (${privacyDocs.length} docs) |`);

  // Security
  const securityDocs = docs.filter((d) =>
    ["SECURITY.md", "INCIDENT_RESPONSE_PLAN.md", "ACCESS_CONTROL_POLICY.md"].includes(d.filename),
  );
  lines.push(`| Information Security | ${securityDocs.length >= 2 ? "Covered" : "Gaps"} (${securityDocs.length} docs) |`);

  // AI
  if (hasAI) {
    const aiDocs = docs.filter((d) =>
      ["AI_DISCLOSURE.md", "AI_ACT_CHECKLIST.md", "AI_GOVERNANCE_FRAMEWORK.md"].includes(d.filename),
    );
    lines.push(`| AI Governance | ${aiDocs.length >= 2 ? "Covered" : "Gaps"} (${aiDocs.length} docs) |`);
  }

  // Vendor management
  const vendorDocs = docs.filter((d) =>
    ["SUBPROCESSOR_LIST.md", "THIRD_PARTY_RISK_ASSESSMENT.md"].includes(d.filename),
  );
  lines.push(`| Vendor Management | ${vendorDocs.length >= 1 ? "Covered" : "Gaps"} (${vendorDocs.length} docs) |`);

  lines.push("");

  // ── Services Summary ────────────────────────────────────────────────────
  lines.push("## Services Overview");
  lines.push("");
  lines.push(`**${uniqueServices.length} third-party services** detected across **${categories.size} categories**:`);
  lines.push("");

  // Group by category
  const byCategory = new Map<string, string[]>();
  for (const svc of uniqueServices) {
    const existing = byCategory.get(svc.category) || [];
    existing.push(svc.name);
    byCategory.set(svc.category, existing);
  }

  for (const [cat, names] of byCategory) {
    lines.push(`- **${cat}:** ${names.join(", ")}`);
  }
  lines.push("");

  // ── Footer ──────────────────────────────────────────────────────────────
  lines.push("---");
  lines.push("");
  lines.push(
    "*This Executive Briefing was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. " +
      "It is intended as a summary for executive review and does not constitute legal advice. Consult legal counsel for compliance decisions.*",
  );
  lines.push("");

  return lines.join("\n");
}

/**
 * Build an ASCII compliance gauge visualization.
 */
function buildGauge(score: number): string {
  const width = 40;
  const filled = Math.round((score / 100) * width);
  const empty = width - filled;

  const bar = "\u2588".repeat(filled) + "\u2591".repeat(empty);

  const label =
    score >= 80
      ? "STRONG"
      : score >= 60
        ? "MODERATE"
        : score >= 40
          ? "NEEDS ATTENTION"
          : "CRITICAL";

  const lines: string[] = [];
  lines.push("  COMPLIANCE GAUGE");
  lines.push(`  [${bar}] ${score}/100`);
  lines.push(`   0    20    40    60    80   100`);
  lines.push(`  Status: ${label}`);
  return lines.join("\n");
}

interface RiskFinding {
  title: string;
  description: string;
  dollarImpact?: string;
}

/**
 * Determine the top risk based on scan results.
 */
function determineTopRisk(
  scan: ScanResult,
  docs: GeneratedDocument[],
  ctx: GeneratorContext | undefined,
): RiskFinding {
  const aiServices = scan.services.filter(
    (s) => s.category === "ai",
  );

  // AI without proper disclosure is the highest risk post EU AI Act
  if (aiServices.length > 0) {
    const hasAIDisclosure = docs.some((d) => d.filename === "AI_DISCLOSURE.md");
    if (!hasAIDisclosure) {
      return {
        title: "AI Usage Without Disclosure",
        description:
          `${aiServices.length} AI service(s) detected (${aiServices.map((s) => s.name).join(", ")}) ` +
          `but no AI Disclosure document has been generated. The EU AI Act (effective August 2, 2026) ` +
          `requires transparency obligations for AI system deployers under Article 50.`,
        dollarImpact: "Up to EUR 35 million or 7% of global annual turnover under EU AI Act",
      };
    }
    return {
      title: "AI Regulatory Compliance",
      description:
        `${aiServices.length} AI service(s) in use (${aiServices.map((s) => s.name).join(", ")}). ` +
        `AI Disclosure is generated, but ongoing monitoring is needed as the EU AI Act enforcement begins August 2, 2026. ` +
        `Ensure AI risk classifications are reviewed quarterly.`,
      dollarImpact: "Up to EUR 35 million for non-compliance with AI Act obligations",
    };
  }

  // No privacy policy for a data-collecting app
  const hasPrivacyPolicy = docs.some((d) => d.filename === "PRIVACY_POLICY.md");
  if (!hasPrivacyPolicy && scan.services.length > 0) {
    return {
      title: "Missing Privacy Policy",
      description:
        `${scan.services.length} data-collecting services detected but no Privacy Policy is in place. ` +
        `GDPR (Article 13/14) and CCPA require clear disclosure of data practices.`,
      dollarImpact: "Up to EUR 20 million or 4% of global annual turnover under GDPR",
    };
  }

  // Payment services without proper documentation
  const paymentServices = scan.services.filter(
    (s) => s.category === "payment",
  );
  if (paymentServices.length > 0) {
    return {
      title: "Payment Data Handling",
      description:
        `${paymentServices.length} payment service(s) detected (${paymentServices.map((s) => s.name).join(", ")}). ` +
        `Payment data is classified as sensitive and requires PCI DSS compliance. ` +
        `Ensure all payment processing documentation is reviewed and approved by legal.`,
      dollarImpact: "PCI DSS fines range from $5,000 to $100,000 per month for non-compliance",
    };
  }

  // Default: data protection
  return {
    title: "Third-Party Data Sharing",
    description:
      `${scan.services.length} third-party services share or process user data. ` +
      `Each requires documented Data Processing Agreements (GDPR Art. 28) and ` +
      `inclusion in the sub-processor list. Ensure all agreements are current.`,
    dollarImpact: "Up to EUR 20 million under GDPR for inadequate processor agreements",
  };
}

interface ActionItem {
  title: string;
  description: string;
  timeline?: string;
}

/**
 * Determine the recommended next action.
 */
function determineRecommendedAction(
  scan: ScanResult,
  docs: GeneratedDocument[],
  score: number,
  ctx: GeneratorContext | undefined,
): ActionItem {
  if (score < 40) {
    return {
      title: "Initiate Compliance Remediation Program",
      description:
        "The current compliance score indicates significant gaps. Recommend engaging legal counsel " +
        "to review all generated documents, prioritizing Privacy Policy and Data Processing Agreements. " +
        "Schedule a cross-functional compliance review within 30 days.",
      timeline: "Immediate — initiate within 1 week",
    };
  }

  if (score < 60) {
    return {
      title: "Close High-Priority Gaps",
      description:
        "Review and approve the generated compliance documents with legal counsel. " +
        "Focus on areas marked as 'Gaps' in the At a Glance section above. " +
        "Assign ownership for each compliance area and set quarterly review cadence.",
      timeline: "30 days for initial review, 90 days for full implementation",
    };
  }

  if (score < 80) {
    return {
      title: "Strengthen Compliance Posture",
      description:
        `${docs.length} documents are generated and the foundation is solid. ` +
        "Next steps: have legal counsel review all documents for jurisdiction-specific requirements, " +
        "publish approved documents to your website, and establish an annual review cycle.",
      timeline: "60 days for legal review and publication",
    };
  }

  return {
    title: "Maintain and Monitor",
    description:
      "Compliance posture is strong. Recommended actions: (1) Schedule annual compliance review, " +
      "(2) Set up `codepliant check` in CI/CD to detect drift, " +
      "(3) Review documents when adding new services or entering new jurisdictions.",
    timeline: "Ongoing — next full review in 12 months",
  };
}
