import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates COMPLIANCE_BOARD_REPORT.md — a quarterly board-level compliance report
 * designed for board of directors presentation.
 *
 * Includes executive summary, risk heatmap, regulatory updates,
 * budget vs actual, and strategic recommendations.
 */
export function generateComplianceBoardReport(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string {
  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];
  const quarter = `Q${Math.ceil((new Date().getMonth() + 1) / 3)}`;
  const year = new Date().getFullYear();

  const serviceCount = scan.services.length;
  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasAuth = scan.services.some((s) => s.category === "auth");
  const hasAnalytics = scan.services.some((s) => s.category === "analytics");
  const hasMonitoring = scan.services.some((s) => s.category === "monitoring");

  const jurisdictions = ctx?.jurisdictions || [];
  const hasGDPR = jurisdictions.some((j) => j === "gdpr" || j === "uk-gdpr") || true;
  const hasCCPA = jurisdictions.some((j) => j === "ccpa");

  // Determine risk level
  let overallRisk: "Low" | "Medium" | "High" | "Critical" = "Low";
  if (serviceCount >= 15 || (hasAI && hasPayment)) overallRisk = "Critical";
  else if (serviceCount >= 10 || hasAI) overallRisk = "High";
  else if (serviceCount >= 5) overallRisk = "Medium";

  const riskColor: Record<string, string> = {
    Low: "🟢",
    Medium: "🟡",
    High: "🟠",
    Critical: "🔴",
  };

  // Count categories
  const categories = new Map<string, number>();
  for (const svc of scan.services) {
    categories.set(svc.category, (categories.get(svc.category) || 0) + 1);
  }

  const sections: string[] = [];

  // Header
  sections.push(`# Compliance Board Report — ${quarter} ${year}`);
  sections.push("");
  sections.push(`> **Prepared for:** Board of Directors, ${company}`);
  sections.push(`> **Report Period:** ${quarter} ${year}`);
  sections.push(`> **Classification:** Confidential — Board Use Only`);
  sections.push(`> **Prepared on:** ${date}`);
  sections.push("");
  sections.push("---");
  sections.push("");

  // Executive Summary
  sections.push("## 1. Executive Summary");
  sections.push("");
  sections.push(
    `${company} operates a technology stack comprising **${serviceCount} third-party services** ` +
    `across ${categories.size} categories. This report provides an overview of our compliance ` +
    `posture, key risks, regulatory developments, and budget status for ${quarter} ${year}.`
  );
  sections.push("");
  sections.push("### Key Metrics at a Glance");
  sections.push("");
  sections.push("| Metric | Status |");
  sections.push("|--------|--------|");
  sections.push(`| **Overall Risk Level** | ${riskColor[overallRisk]} ${overallRisk} |`);
  sections.push(`| **Third-Party Services** | ${serviceCount} |`);
  sections.push(`| **Data Processing Categories** | ${categories.size} |`);
  sections.push(`| **Data Categories Detected** | ${scan.dataCategories.length} |`);
  sections.push(`| **Compliance Documents Generated** | Auto-generated via Codepliant |`);
  sections.push(`| **AI Services Active** | ${hasAI ? "Yes" : "No"} |`);
  sections.push(`| **Payment Processing** | ${hasPayment ? "Yes" : "No"} |`);
  sections.push(`| **Open Incidents** | [To be filled by compliance team] |`);
  sections.push(`| **DSARs This Quarter** | [To be filled by compliance team] |`);
  sections.push("");

  // Board Action Items
  sections.push("### Board Action Items");
  sections.push("");
  const actions: string[] = [];
  actions.push("- [ ] Review and approve updated compliance budget");
  actions.push("- [ ] Acknowledge risk register updates");
  if (hasAI) {
    actions.push("- [ ] Approve AI governance framework and risk classification");
    actions.push("- [ ] Review EU AI Act readiness status");
  }
  if (hasPayment) {
    actions.push("- [ ] Confirm PCI DSS compliance status");
  }
  actions.push("- [ ] Approve vendor risk acceptance for Critical/High-tier vendors");
  actions.push("- [ ] Schedule next quarterly compliance review");
  sections.push(actions.join("\n"));
  sections.push("");

  // Risk Heatmap
  sections.push("---");
  sections.push("");
  sections.push("## 2. Risk Heatmap");
  sections.push("");
  sections.push("### Likelihood vs Impact Matrix");
  sections.push("");
  sections.push("```");
  sections.push("Impact →    Low         Medium      High        Critical");
  sections.push("Likelihood");
  sections.push("  ↓");
  sections.push(`  High     │ ${hasAnalytics ? "Analytics  " : "           "}│ ${hasAuth ? "Auth breach " : "            "}│ ${hasAI ? "AI misuse   " : "            "}│ ${hasPayment ? "Payment fraud" : "             "} │`);
  sections.push(`  Medium   │ Cookie     │ DSAR delay  │ Data breach │ Regulatory   │`);
  sections.push(`  Low      │ Config     │ Vendor risk │ Compliance  │ Class action │`);
  sections.push("```");
  sections.push("");

  // Risk by category
  sections.push("### Risk by Service Category");
  sections.push("");
  sections.push("| Category | Services | Risk Level | Key Concern |");
  sections.push("|----------|----------|------------|-------------|");

  const categoryRisks: Array<{ cat: string; count: number; risk: string; concern: string }> = [];
  if (hasAI) categoryRisks.push({ cat: "AI / Machine Learning", count: categories.get("ai") || 0, risk: "High", concern: "EU AI Act compliance, bias, hallucination risk" });
  if (hasPayment) categoryRisks.push({ cat: "Payment Processing", count: categories.get("payment") || 0, risk: "High", concern: "PCI DSS compliance, fraud liability" });
  if (hasAuth) categoryRisks.push({ cat: "Authentication", count: categories.get("auth") || 0, risk: "Medium", concern: "Credential breach, account takeover" });
  if (hasAnalytics) categoryRisks.push({ cat: "Analytics", count: categories.get("analytics") || 0, risk: "Medium", concern: "Cookie consent, cross-border transfers" });
  if (hasMonitoring) categoryRisks.push({ cat: "Monitoring", count: categories.get("monitoring") || 0, risk: "Low", concern: "Data minimization, retention" });

  // Add remaining categories
  for (const [cat, count] of categories) {
    if (!["ai", "payment", "auth", "analytics", "monitoring"].includes(cat)) {
      categoryRisks.push({ cat: cat.charAt(0).toUpperCase() + cat.slice(1), count, risk: "Medium", concern: "Vendor dependency, data processing" });
    }
  }

  if (categoryRisks.length === 0) {
    categoryRisks.push({ cat: "General", count: serviceCount, risk: "Low", concern: "Baseline compliance requirements" });
  }

  for (const cr of categoryRisks) {
    sections.push(`| ${cr.cat} | ${cr.count} | ${cr.risk} | ${cr.concern} |`);
  }
  sections.push("");

  // Regulatory Landscape
  sections.push("---");
  sections.push("");
  sections.push("## 3. Regulatory Updates");
  sections.push("");
  sections.push(`Key regulatory developments relevant to ${company} this quarter:`);
  sections.push("");

  sections.push("### Active Regulations");
  sections.push("");
  sections.push("| Regulation | Status | Impact on ${company} | Action Required |");
  sections.push("|------------|--------|---------------------|-----------------|");

  if (hasGDPR) {
    sections.push("| GDPR (EU) | **Active** | Direct — EU data subjects | Ongoing compliance monitoring |");
    sections.push("| UK GDPR | **Active** | Direct — UK data subjects | Separate adequacy assessment |");
  }
  if (hasCCPA) {
    sections.push("| CCPA/CPRA (California) | **Active** | Direct — CA consumers | Consumer rights implementation |");
  }
  if (hasAI) {
    sections.push("| EU AI Act | **Phasing in** | Direct — AI service providers | Risk classification + conformity assessment |");
    sections.push("| Colorado AI Act | **Effective 2026** | Monitor — US AI regulation | Impact assessment for high-risk AI |");
  }
  if (hasPayment) {
    sections.push("| PCI DSS v4.0 | **Active** | Direct — payment processing | Annual compliance assessment |");
  }
  sections.push("| NIS2 Directive | **Active (EU)** | Monitor — network security | Security measures review |");
  sections.push("| DORA (EU) | **Active** | Monitor — digital operational resilience | ICT risk management |");
  sections.push("");

  sections.push("### Upcoming Changes");
  sections.push("");
  sections.push("- **EU AI Act enforcement timeline:** Prohibited AI practices (Feb 2025), GPAI obligations (Aug 2025), Full enforcement (Aug 2026)");
  sections.push("- **ePrivacy Regulation:** Still in legislative process; expected to replace ePrivacy Directive");
  sections.push("- **US Federal Privacy:** American Privacy Rights Act (APRA) — monitoring for progress");
  sections.push("- **State-level privacy laws:** New state laws coming into effect annually; monitor for applicability");
  sections.push("");

  // Budget vs Actual
  sections.push("---");
  sections.push("");
  sections.push("## 4. Budget vs Actual");
  sections.push("");

  // Estimate budget based on service count
  let tier: "Startup" | "Growth" | "Enterprise" = "Startup";
  if (serviceCount >= 15 || (hasAI && hasPayment)) tier = "Enterprise";
  else if (serviceCount >= 5) tier = "Growth";

  const budgetItems = [
    { category: "Legal & Advisory", budgeted: tier === "Startup" ? 15000 : tier === "Growth" ? 40000 : 100000 },
    { category: "Tools & Software", budgeted: tier === "Startup" ? 10000 : tier === "Growth" ? 25000 : 60000 },
    { category: "Training & Awareness", budgeted: tier === "Startup" ? 5000 : tier === "Growth" ? 15000 : 30000 },
    { category: "Audit & Certification", budgeted: tier === "Startup" ? 15000 : tier === "Growth" ? 50000 : 150000 },
    { category: "Insurance", budgeted: tier === "Startup" ? 5000 : tier === "Growth" ? 15000 : 50000 },
  ];

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.budgeted, 0);

  sections.push(`> **Tier:** ${tier} | **Total Annual Budget:** $${totalBudget.toLocaleString()}`);
  sections.push("");
  sections.push("| Category | Annual Budget | YTD Actual | YTD Budget | Variance |");
  sections.push("|----------|-------------|-----------|-----------|----------|");

  const quarterFraction = Math.ceil((new Date().getMonth() + 1) / 3) / 4;
  for (const item of budgetItems) {
    const ytdBudget = Math.round(item.budgeted * quarterFraction);
    sections.push(
      `| ${item.category} | $${item.budgeted.toLocaleString()} | [Actual] | $${ytdBudget.toLocaleString()} | [Variance] |`
    );
  }
  sections.push(
    `| **Total** | **$${totalBudget.toLocaleString()}** | **[Actual]** | **$${Math.round(totalBudget * quarterFraction).toLocaleString()}** | **[Variance]** |`
  );
  sections.push("");
  sections.push("> **Note:** Fill in actual spend figures from your finance team. Codepliant generates the budget framework; actual tracking requires manual input.");
  sections.push("");

  // Compliance Program Status
  sections.push("---");
  sections.push("");
  sections.push("## 5. Compliance Program Status");
  sections.push("");

  sections.push("### Document Coverage");
  sections.push("");
  sections.push("| Area | Documents Generated | Status |");
  sections.push("|------|-------------------|--------|");
  sections.push("| Privacy & Data Protection | Privacy Policy, DPA, DSAR Guide, Cookie Policy | Generated |");
  sections.push("| Security | Security Policy, Incident Response, Access Control | Generated |");
  sections.push("| Legal | Terms of Service, Acceptable Use, Refund Policy | Generated |");
  if (hasAI) {
    sections.push("| AI Compliance | AI Disclosure, AI Model Card, AI Governance | Generated |");
  }
  sections.push("| Vendor Management | Vendor Contacts, Sub-Processor List, Vendor Onboarding | Generated |");
  sections.push("| Audit & Certification | SOC 2 Checklist, ISO 27001, Risk Register | Generated |");
  sections.push("");

  sections.push("### Key Achievements This Quarter");
  sections.push("");
  sections.push("- [ ] [Fill in completed compliance initiatives]");
  sections.push("- [ ] [Fill in resolved audit findings]");
  sections.push("- [ ] [Fill in completed training programs]");
  sections.push("- [ ] [Fill in vendor assessments completed]");
  sections.push("");

  sections.push("### Planned for Next Quarter");
  sections.push("");
  sections.push("- [ ] [Fill in planned compliance initiatives]");
  sections.push("- [ ] [Fill in upcoming audits or assessments]");
  sections.push("- [ ] [Fill in planned policy updates]");
  sections.push("- [ ] [Fill in training schedule]");
  sections.push("");

  // Incident Summary
  sections.push("---");
  sections.push("");
  sections.push("## 6. Incident & DSAR Summary");
  sections.push("");
  sections.push("### Security Incidents");
  sections.push("");
  sections.push("| # | Date | Severity | Description | Status | Resolution Time |");
  sections.push("|---|------|----------|-------------|--------|-----------------|");
  sections.push("| 1 | [Date] | [P0-P4] | [Description] | [Open/Closed] | [Duration] |");
  sections.push("");
  sections.push("> Fill in actual incident data. If no incidents occurred this quarter, note \"No reportable incidents in this period.\"");
  sections.push("");

  sections.push("### Data Subject Access Requests (DSARs)");
  sections.push("");
  sections.push("| Metric | Count |");
  sections.push("|--------|-------|");
  sections.push("| DSARs Received | [Count] |");
  sections.push("| DSARs Completed | [Count] |");
  sections.push("| Average Response Time | [Days] |");
  sections.push("| DSARs Pending | [Count] |");
  sections.push("| Requests Exceeding 30-Day SLA | [Count] |");
  sections.push("");

  // Strategic Recommendations
  sections.push("---");
  sections.push("");
  sections.push("## 7. Strategic Recommendations");
  sections.push("");

  const recommendations: string[] = [];
  recommendations.push(
    `1. **Maintain automated compliance scanning** — Continue using Codepliant for ongoing ` +
    `document generation to ensure compliance artifacts stay current with code changes.`
  );

  if (hasAI) {
    recommendations.push(
      `2. **Prioritize EU AI Act readiness** — With ${categories.get("ai") || 0} AI service(s) detected, ` +
      `complete risk classification and establish conformity assessment procedures before enforcement deadlines.`
    );
  }

  if (serviceCount >= 10) {
    recommendations.push(
      `${hasAI ? "3" : "2"}. **Vendor consolidation review** — With ${serviceCount} third-party services, ` +
      `evaluate opportunities to reduce vendor footprint and associated compliance overhead.`
    );
  }

  recommendations.push(
    `${recommendations.length + 1}. **Legal review cycle** — Schedule annual legal review of all auto-generated ` +
    `compliance documents to ensure they reflect current business practices and regulatory requirements.`
  );

  recommendations.push(
    `${recommendations.length + 1}. **Board compliance training** — Consider annual board-level compliance ` +
    `awareness briefing to maintain governance effectiveness.`
  );

  sections.push(recommendations.join("\n\n"));
  sections.push("");

  // Appendix
  sections.push("---");
  sections.push("");
  sections.push("## Appendix A: Detected Services");
  sections.push("");
  sections.push("| # | Service | Category | Data Processor | Data Collected |");
  sections.push("|---|---------|----------|----------------|----------------|");

  for (let i = 0; i < Math.min(scan.services.length, 25); i++) {
    const svc = scan.services[i];
    const data = svc.dataCollected.slice(0, 3).join(", ");
    const more = svc.dataCollected.length > 3 ? ` +${svc.dataCollected.length - 3} more` : "";
    sections.push(
      `| ${i + 1} | ${svc.name} | ${svc.category} | ${svc.isDataProcessor !== false ? "Yes" : "No"} | ${data}${more} |`
    );
  }
  if (scan.services.length > 25) {
    sections.push(`| | *... and ${scan.services.length - 25} more services* | | | |`);
  }
  sections.push("");

  // Footer
  sections.push("---");
  sections.push("");
  sections.push(
    `*This board report was generated by [Codepliant](https://github.com/joechensmartz/codepliant) ` +
    `based on automated source code analysis of the **${scan.projectName}** codebase ` +
    `(${serviceCount} services detected). Sections marked with [brackets] require manual input ` +
    `from the compliance team. This report should be reviewed and supplemented with operational ` +
    `data before board presentation. Generated on ${date}.*`
  );
  sections.push("");

  return sections.join("\n");
}
