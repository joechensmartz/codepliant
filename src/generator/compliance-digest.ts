import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext, GeneratedDocument } from "./index.js";

/**
 * Generates COMPLIANCE_DIGEST.md — a weekly/monthly compliance digest
 * designed for team Slack/email distribution.
 *
 * Includes: changes since last review, new risks, upcoming deadlines,
 * and a compact action-item list for the compliance team.
 *
 * Always generated when services are detected.
 */
export function generateComplianceDigest(
  scan: ScanResult,
  ctx?: GeneratorContext,
  docs?: GeneratedDocument[],
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const dpoName = ctx?.dpoName || "[Data Protection Officer Name]";
  const dpoEmail = ctx?.dpoEmail || "[dpo@example.com]";
  const date = new Date().toISOString().split("T")[0];

  const serviceCount = scan.services.length;
  const docCount = docs?.length || 0;

  // Categorize services
  const categories = new Map<string, string[]>();
  for (const svc of scan.services) {
    const cat = svc.category || "other";
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(svc.name);
  }

  // AI services
  const aiServices = scan.services.filter((s) => s.category === "ai");
  const hasAI = aiServices.length > 0;

  // Payment services
  const paymentServices = scan.services.filter((s) => s.category === "payment");
  const hasPayment = paymentServices.length > 0;

  // Analytics/monitoring
  const analyticsServices = scan.services.filter(
    (s) => s.category === "analytics" || s.category === "monitoring",
  );

  // Build new risks
  const risks: string[] = [];
  if (hasAI) {
    risks.push(
      `AI/ML services detected (${aiServices.map((s) => s.name).join(", ")}). EU AI Act Art. 50 transparency obligations apply.`,
    );
  }
  if (hasPayment) {
    risks.push(
      `Payment processing active (${paymentServices.map((s) => s.name).join(", ")}). PCI DSS compliance required.`,
    );
  }
  if (serviceCount > 10) {
    risks.push(
      `High service count (${serviceCount}). Review sub-processor agreements and data flows.`,
    );
  }
  if (analyticsServices.length > 0) {
    risks.push(
      `Analytics/monitoring active (${analyticsServices.map((s) => s.name).join(", ")}). Ensure cookie consent and tracking disclosures are current.`,
    );
  }

  // Upcoming deadlines
  const deadlines: string[] = [];
  deadlines.push("Quarterly compliance review (next scheduled review)");
  deadlines.push("Annual privacy policy update (check last update date)");
  if (hasAI) {
    deadlines.push("EU AI Act Art. 50 compliance — August 2, 2026 deadline");
  }
  deadlines.push("DSAR response SLA — 30 days from receipt (GDPR)");
  deadlines.push("Data breach notification — 72 hours from discovery (GDPR Art. 33)");

  // Action items
  const actions: string[] = [];
  actions.push("Review any new or changed services since last digest");
  actions.push("Verify all generated documents are up to date");
  if (hasAI) {
    actions.push("Review AI Disclosure and AI Model Card for accuracy");
  }
  if (hasPayment) {
    actions.push("Confirm PCI DSS self-assessment questionnaire is current");
  }
  actions.push("Check DSAR log for pending requests");
  actions.push("Update sub-processor list if vendors changed");

  // Service change summary
  const servicesByCategory = [...categories.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(
      ([cat, svcs]) =>
        `| ${cat.charAt(0).toUpperCase() + cat.slice(1)} | ${svcs.length} | ${svcs.join(", ")} |`,
    )
    .join("\n");

  // Document coverage
  const generatedFilenames = new Set(docs?.map((d) => d.filename) || []);
  const criticalDocs = [
    "PRIVACY_POLICY.md",
    "TERMS_OF_SERVICE.md",
    "SECURITY.md",
  ];
  const criticalCoverage = criticalDocs.filter((f) =>
    generatedFilenames.has(f),
  ).length;
  const coveragePct = Math.round(
    (criticalCoverage / criticalDocs.length) * 100,
  );

  const lines = [
    `# Compliance Digest — ${company}`,
    ``,
    `**Period:** Week/Month of ${date}`,
    `**Prepared by:** ${dpoName} (${dpoEmail})`,
    `**Contact:** ${contactEmail}`,
    `**Distribution:** Team Slack / Email`,
    ``,
    `---`,
    ``,
    `> **This digest summarizes your compliance posture for the current review period. Share it in Slack, email, or your team's preferred channel.**`,
    ``,
    `---`,
    ``,
    `## At a Glance`,
    ``,
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Services Detected | ${serviceCount} |`,
    `| Documents Generated | ${docCount} |`,
    `| Critical Doc Coverage | ${coveragePct}% |`,
    `| Categories | ${categories.size} |`,
    ``,
    `---`,
    ``,
    `## Changes Since Last Review`,
    ``,
    `> Review the items below and update this section with any changes since your last compliance digest.`,
    ``,
    `- [ ] New services added or removed`,
    `- [ ] Privacy policy updated`,
    `- [ ] Sub-processor list changed`,
    `- [ ] New data categories collected`,
    `- [ ] Incident response plan tested`,
    `- [ ] DSAR requests received or resolved`,
    ``,
    `---`,
    ``,
    `## Current Service Inventory`,
    ``,
    `| Category | Count | Services |`,
    `|----------|-------|----------|`,
    servicesByCategory,
    ``,
    `---`,
    ``,
    `## New Risks & Observations`,
    ``,
    ...(risks.length > 0
      ? risks.map((r, i) => `${i + 1}. ${r}`)
      : ["No new risks identified this period."]),
    ``,
    `---`,
    ``,
    `## Upcoming Deadlines`,
    ``,
    ...deadlines.map((d) => `- ${d}`),
    ``,
    `---`,
    ``,
    `## Action Items`,
    ``,
    ...actions.map((a) => `- [ ] ${a}`),
    ``,
    `---`,
    ``,
    `## Document Status`,
    ``,
    `| Document | Status |`,
    `|----------|--------|`,
    ...criticalDocs.map(
      (f) =>
        `| ${f} | ${generatedFilenames.has(f) ? "Current" : "**Missing**"} |`,
    ),
    ...(hasAI
      ? [
          `| AI_DISCLOSURE.md | ${generatedFilenames.has("AI_DISCLOSURE.md") ? "Current" : "**Missing**"} |`,
        ]
      : []),
    ...(generatedFilenames.has("COOKIE_POLICY.md")
      ? [`| COOKIE_POLICY.md | Current |`]
      : []),
    ``,
    `---`,
    ``,
    `## How to Use This Digest`,
    ``,
    `1. **Weekly:** Share in your team Slack channel or standup`,
    `2. **Monthly:** Include in your compliance status report to leadership`,
    `3. **Quarterly:** Use as input for your formal compliance review meeting`,
    `4. **On change:** Re-run \`codepliant go\` after adding new services or dependencies`,
    ``,
    `---`,
    ``,
    `## Quick Commands`,
    ``,
    "```bash",
    `# Re-scan and regenerate all documents`,
    `codepliant go`,
    ``,
    `# Check compliance status`,
    `codepliant check`,
    ``,
    `# View compliance dashboard`,
    `codepliant dashboard`,
    ``,
    `# Run in CI/CD pipeline`,
    `codepliant ci`,
    "```",
    ``,
    `---`,
    ``,
    `*Generated by [Codepliant](https://github.com/joechensmartz/codepliant) on ${date}. This digest is based on automated code analysis and should be reviewed by qualified personnel before distribution.*`,
  ];

  return lines.join("\n");
}
