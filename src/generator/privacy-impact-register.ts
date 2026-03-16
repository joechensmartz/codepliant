import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext, GeneratedDocument } from "./index.js";

/**
 * Generates PRIVACY_IMPACT_REGISTER.md — a registry of all PIAs/DPIAs conducted.
 * Tracks date, scope, outcome, reviewer, and next review date.
 * Required under GDPR Art. 35(1) for high-risk processing activities.
 *
 * Returns null when no services are detected.
 */
export function generatePrivacyImpactRegister(
  scan: ScanResult,
  ctx: GeneratorContext | undefined,
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const dpoName = ctx?.dpoName || "[Data Protection Officer Name]";
  const dpoEmail = ctx?.dpoEmail || contactEmail;
  const date = new Date().toISOString().split("T")[0];
  const jurisdictions = ctx?.jurisdictions || [];
  const nextReviewDate = getNextReviewDate(date);

  // Categorize detected services
  const categories = new Set<string>();
  for (const svc of scan.services) {
    categories.add(svc.category);
  }

  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasAnalytics = scan.services.some((s) => s.category === "analytics");
  const hasAuth = scan.services.some((s) => s.category === "auth");
  const hasMonitoring = scan.services.some((s) => s.category === "monitoring");

  // Deduplicate services
  const seenServices = new Set<string>();
  const uniqueServices: Array<{ name: string; category: string; dataCollected: string[] }> = [];
  for (const svc of scan.services) {
    if (!seenServices.has(svc.name)) {
      seenServices.add(svc.name);
      uniqueServices.push({ name: svc.name, category: svc.category, dataCollected: svc.dataCollected || [] });
    }
  }

  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────────
  lines.push("# Privacy Impact Register");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(`> **Organization:** ${company}  `);
  lines.push(`> **Register Owner:** ${dpoName} (${dpoEmail})  `);
  lines.push(`> **Last Updated:** ${date}  `);
  lines.push(`> **Next Full Review:** ${nextReviewDate}`);
  lines.push("");

  // ── Disclaimer ──────────────────────────────────────────────────────────
  lines.push("> **Important:** This Privacy Impact Register is auto-generated based on automated code analysis. It identifies processing activities that may require a Data Protection Impact Assessment (DPIA) under GDPR Art. 35(1). Each entry should be reviewed, completed, and signed off by the DPO. This register must be maintained as a living document and updated whenever new processing activities are introduced or existing ones change materially.");
  lines.push("");

  // ── 1. Purpose ──────────────────────────────────────────────────────────
  lines.push("## 1. Purpose");
  lines.push("");
  lines.push("This register tracks all Privacy Impact Assessments (PIAs) and Data Protection Impact Assessments (DPIAs) conducted by " + company + ". Under GDPR Art. 35(1), a DPIA is required when processing is \"likely to result in a high risk to the rights and freedoms of natural persons.\"");
  lines.push("");
  lines.push("This register serves to:");
  lines.push("");
  lines.push("- Maintain a complete inventory of all PIAs/DPIAs conducted");
  lines.push("- Track the status, outcome, and follow-up actions for each assessment");
  lines.push("- Demonstrate accountability to supervisory authorities (GDPR Art. 5(2))");
  lines.push("- Schedule timely reviews and reassessments");
  lines.push("- Identify processing activities that require new or updated assessments");
  lines.push("");

  // ── 2. DPIA Triggers ───────────────────────────────────────────────────
  lines.push("## 2. When a DPIA Is Required");
  lines.push("");
  lines.push("Under GDPR Art. 35(3), a DPIA is mandatory when processing involves:");
  lines.push("");
  lines.push("- [ ] Systematic and extensive evaluation of personal aspects (profiling)");
  lines.push("- [ ] Processing of special categories of data on a large scale");
  lines.push("- [ ] Systematic monitoring of a publicly accessible area on a large scale");
  lines.push("- [ ] Automated decision-making with legal or significant effects");
  lines.push("- [ ] Large-scale processing of personal data");
  lines.push("- [ ] Matching or combining datasets from different sources");
  lines.push("- [ ] Processing data of vulnerable individuals (children, employees)");
  lines.push("- [ ] Innovative use of new technologies");
  lines.push("- [ ] Cross-border data transfers outside EEA");
  lines.push("- [ ] Processing that prevents data subjects from exercising a right or using a service");
  lines.push("");

  // ── 3. Register of Assessments ─────────────────────────────────────────
  lines.push("## 3. Register of Assessments");
  lines.push("");
  lines.push("### 3.1 Assessment Summary");
  lines.push("");
  lines.push("| # | Assessment Title | Type | Date Conducted | Status | Risk Level | Reviewer | Next Review |");
  lines.push("|---|-----------------|------|----------------|--------|------------|----------|-------------|");

  let assessmentNum = 1;

  // Generate entries based on detected services
  if (hasAI) {
    lines.push(`| ${assessmentNum++} | AI Systems Processing Assessment | DPIA | ${date} | Pending Review | High | ${dpoName} | ${nextReviewDate} |`);
  }

  if (hasPayment) {
    lines.push(`| ${assessmentNum++} | Payment Data Processing Assessment | DPIA | ${date} | Pending Review | High | ${dpoName} | ${nextReviewDate} |`);
  }

  if (hasAnalytics) {
    lines.push(`| ${assessmentNum++} | Analytics & Tracking Assessment | DPIA | ${date} | Pending Review | Medium | ${dpoName} | ${nextReviewDate} |`);
  }

  if (hasAuth) {
    lines.push(`| ${assessmentNum++} | User Authentication & Identity Assessment | PIA | ${date} | Pending Review | Medium | ${dpoName} | ${nextReviewDate} |`);
  }

  if (hasMonitoring) {
    lines.push(`| ${assessmentNum++} | Application Monitoring Assessment | PIA | ${date} | Pending Review | Low | ${dpoName} | ${nextReviewDate} |`);
  }

  // General processing assessment
  lines.push(`| ${assessmentNum++} | General Personal Data Processing Assessment | PIA | ${date} | Pending Review | Medium | ${dpoName} | ${nextReviewDate} |`);

  // Cross-border transfers if applicable
  if (jurisdictions.length > 1 || scan.services.length >= 3) {
    lines.push(`| ${assessmentNum++} | Cross-Border Data Transfer Assessment | DPIA | ${date} | Pending Review | High | ${dpoName} | ${nextReviewDate} |`);
  }

  lines.push("");

  // ── 3.2 Detailed Assessment Records ────────────────────────────────────
  lines.push("### 3.2 Detailed Assessment Records");
  lines.push("");

  let detailNum = 1;

  if (hasAI) {
    const aiServices = uniqueServices.filter((s) => s.category === "ai");
    lines.push(`#### Assessment ${detailNum++}: AI Systems Processing`);
    lines.push("");
    lines.push("| Field | Details |");
    lines.push("|-------|---------|");
    lines.push(`| **Assessment ID** | DPIA-${date.replace(/-/g, "")}-AI |`);
    lines.push(`| **Date Conducted** | ${date} |`);
    lines.push("| **Type** | Full DPIA (GDPR Art. 35) |");
    lines.push(`| **Scope** | AI/ML services: ${aiServices.map((s) => s.name).join(", ")} |`);
    lines.push("| **Processing Description** | Use of artificial intelligence and machine learning services for application features |");
    lines.push("| **Data Subjects** | End users, customers |");
    lines.push(`| **Data Categories** | ${aiServices.flatMap((s) => s.dataCollected).filter((v, i, a) => a.indexOf(v) === i).join(", ") || "User inputs, prompts, generated outputs"} |`);
    lines.push("| **Legal Basis** | Legitimate interest (Art. 6(1)(f)) or Consent (Art. 6(1)(a)) |");
    lines.push("| **Risk Level** | High |");
    lines.push("| **DPIA Trigger** | Automated decision-making, innovative technology |");
    lines.push("| **Status** | Pending Review |");
    lines.push(`| **Reviewer** | ${dpoName} |`);
    lines.push("| **Outcome** | [To be completed after review] |");
    lines.push("| **Mitigations Required** | Human oversight mechanism, opt-out capability, transparency notice |");
    lines.push(`| **Next Review** | ${nextReviewDate} |`);
    lines.push("");
  }

  if (hasPayment) {
    const paymentServices = uniqueServices.filter((s) => s.category === "payment");
    lines.push(`#### Assessment ${detailNum++}: Payment Data Processing`);
    lines.push("");
    lines.push("| Field | Details |");
    lines.push("|-------|---------|");
    lines.push(`| **Assessment ID** | DPIA-${date.replace(/-/g, "")}-PAY |`);
    lines.push(`| **Date Conducted** | ${date} |`);
    lines.push("| **Type** | Full DPIA (GDPR Art. 35) |");
    lines.push(`| **Scope** | Payment services: ${paymentServices.map((s) => s.name).join(", ")} |`);
    lines.push("| **Processing Description** | Collection and processing of payment and financial data |");
    lines.push("| **Data Subjects** | Customers, purchasers |");
    lines.push(`| **Data Categories** | ${paymentServices.flatMap((s) => s.dataCollected).filter((v, i, a) => a.indexOf(v) === i).join(", ") || "Payment card data, billing address, transaction history"} |`);
    lines.push("| **Legal Basis** | Contract performance (Art. 6(1)(b)) |");
    lines.push("| **Risk Level** | High |");
    lines.push("| **DPIA Trigger** | Financial data, large-scale processing |");
    lines.push("| **Status** | Pending Review |");
    lines.push(`| **Reviewer** | ${dpoName} |`);
    lines.push("| **Outcome** | [To be completed after review] |");
    lines.push("| **Mitigations Required** | PCI DSS compliance, encryption, tokenization, minimal data retention |");
    lines.push(`| **Next Review** | ${nextReviewDate} |`);
    lines.push("");
  }

  if (hasAnalytics) {
    const analyticsServices = uniqueServices.filter((s) => s.category === "analytics");
    lines.push(`#### Assessment ${detailNum++}: Analytics & Tracking`);
    lines.push("");
    lines.push("| Field | Details |");
    lines.push("|-------|---------|");
    lines.push(`| **Assessment ID** | DPIA-${date.replace(/-/g, "")}-ANALYTICS |`);
    lines.push(`| **Date Conducted** | ${date} |`);
    lines.push("| **Type** | DPIA (GDPR Art. 35) |");
    lines.push(`| **Scope** | Analytics services: ${analyticsServices.map((s) => s.name).join(", ")} |`);
    lines.push("| **Processing Description** | Collection of user behavior data, page views, interactions, and device information for product analytics |");
    lines.push("| **Data Subjects** | Website visitors, app users |");
    lines.push(`| **Data Categories** | ${analyticsServices.flatMap((s) => s.dataCollected).filter((v, i, a) => a.indexOf(v) === i).join(", ") || "IP address, device info, browsing behavior, cookies"} |`);
    lines.push("| **Legal Basis** | Consent (Art. 6(1)(a)) or Legitimate interest (Art. 6(1)(f)) |");
    lines.push("| **Risk Level** | Medium |");
    lines.push("| **DPIA Trigger** | Systematic monitoring of user behavior |");
    lines.push("| **Status** | Pending Review |");
    lines.push(`| **Reviewer** | ${dpoName} |`);
    lines.push("| **Outcome** | [To be completed after review] |");
    lines.push("| **Mitigations Required** | Cookie consent mechanism, data anonymization, retention limits, opt-out capability |");
    lines.push(`| **Next Review** | ${nextReviewDate} |`);
    lines.push("");
  }

  // General processing assessment
  lines.push(`#### Assessment ${detailNum++}: General Personal Data Processing`);
  lines.push("");
  lines.push("| Field | Details |");
  lines.push("|-------|---------|");
  lines.push(`| **Assessment ID** | PIA-${date.replace(/-/g, "")}-GENERAL |`);
  lines.push(`| **Date Conducted** | ${date} |`);
  lines.push("| **Type** | Privacy Impact Assessment |");
  lines.push(`| **Scope** | All ${uniqueServices.length} detected services and general data processing |`);
  lines.push("| **Processing Description** | General collection, storage, and processing of personal data through the application |");
  lines.push("| **Data Subjects** | End users, customers, website visitors |");
  lines.push(`| **Data Categories** | ${scan.dataCategories.map((c) => c.category).join(", ") || "Contact information, usage data, account data"} |`);
  lines.push("| **Legal Basis** | Various (per processing activity) |");
  lines.push("| **Risk Level** | Medium |");
  lines.push("| **Status** | Pending Review |");
  lines.push(`| **Reviewer** | ${dpoName} |`);
  lines.push("| **Outcome** | [To be completed after review] |");
  lines.push("| **Mitigations Required** | Privacy by design, data minimization, access controls, encryption |");
  lines.push(`| **Next Review** | ${nextReviewDate} |`);
  lines.push("");

  // ── 4. Risk Assessment Matrix ──────────────────────────────────────────
  lines.push("## 4. Risk Assessment Matrix");
  lines.push("");
  lines.push("| Processing Activity | Likelihood | Severity | Risk Level | Acceptable? | Mitigation Status |");
  lines.push("|-------------------|-----------|----------|-----------|------------|-------------------|");

  if (hasAI) {
    lines.push("| AI-powered features | High | High | **Critical** | Requires mitigation | Pending |");
  }
  if (hasPayment) {
    lines.push("| Payment processing | Medium | High | **High** | Requires mitigation | Pending |");
  }
  if (hasAnalytics) {
    lines.push("| User analytics/tracking | Medium | Medium | **Medium** | Requires review | Pending |");
  }
  if (hasAuth) {
    lines.push("| User authentication | Low | High | **Medium** | Requires review | Pending |");
  }
  if (hasMonitoring) {
    lines.push("| Application monitoring | Low | Low | **Low** | Acceptable | N/A |");
  }
  lines.push("| General data processing | Medium | Medium | **Medium** | Requires review | Pending |");
  lines.push("");

  // ── 5. Services Requiring Assessment ───────────────────────────────────
  lines.push("## 5. Third-Party Services Inventory");
  lines.push("");
  lines.push("The following services were detected and should be included in relevant PIAs/DPIAs:");
  lines.push("");
  lines.push("| Service | Category | Data Collected | DPIA Required? | Assessment Status |");
  lines.push("|---------|----------|---------------|---------------|-------------------|");

  for (const svc of uniqueServices) {
    const dpiaRequired = svc.category === "ai" || svc.category === "payment" ? "Yes" : "Review needed";
    const dataCollected = svc.dataCollected.length > 0 ? svc.dataCollected.slice(0, 3).join(", ") : "See vendor DPA";
    lines.push(`| ${svc.name} | ${svc.category} | ${dataCollected} | ${dpiaRequired} | Pending |`);
  }
  lines.push("");

  // ── 6. Outcome Tracking ────────────────────────────────────────────────
  lines.push("## 6. Outcome Tracking");
  lines.push("");
  lines.push("### Status Definitions");
  lines.push("");
  lines.push("| Status | Definition |");
  lines.push("|--------|-----------|");
  lines.push("| **Pending** | Assessment identified but not yet started |");
  lines.push("| **In Progress** | Assessment underway, not yet completed |");
  lines.push("| **Pending Review** | Assessment completed, awaiting DPO/management review |");
  lines.push("| **Approved** | Assessment reviewed and approved; processing may proceed |");
  lines.push("| **Approved with Conditions** | Processing may proceed subject to implementing specific mitigations |");
  lines.push("| **Rejected** | Processing must not proceed until risks are adequately mitigated |");
  lines.push("| **Needs Reassessment** | Material changes require a new assessment |");
  lines.push("");

  // ── 7. Review History ──────────────────────────────────────────────────
  lines.push("## 7. Review History");
  lines.push("");
  lines.push("| Date | Action | Performed By | Notes |");
  lines.push("|------|--------|-------------|-------|");
  lines.push(`| ${date} | Register created | Codepliant (automated) | Initial register generated from code scan |`);
  lines.push("| | | | |");
  lines.push("");
  lines.push("*Add entries here as assessments are completed, reviewed, or updated.*");
  lines.push("");

  // ── 8. Consultation Requirements ───────────────────────────────────────
  lines.push("## 8. Supervisory Authority Consultation");
  lines.push("");
  lines.push("Under GDPR Art. 36, the controller must consult the supervisory authority **prior to processing** if a DPIA indicates that the processing would result in a high risk in the absence of measures taken by the controller to mitigate the risk.");
  lines.push("");
  lines.push("### When to Consult");
  lines.push("");
  lines.push("- [ ] The DPIA reveals residual high risks that cannot be sufficiently mitigated");
  lines.push("- [ ] The supervisory authority's published list requires consultation for this type of processing");
  lines.push("- [ ] The processing involves cross-border transfers with no adequacy decision or appropriate safeguards");
  lines.push("");

  // ── 9. Contact ─────────────────────────────────────────────────────────
  lines.push("## 9. Contact");
  lines.push("");
  lines.push("For questions about this register or to request an assessment:");
  lines.push("");
  lines.push(`- **DPO:** ${dpoName} (${dpoEmail})`);
  lines.push(`- **Privacy Team:** ${contactEmail}`);
  lines.push("");

  // ── Footer ──────────────────────────────────────────────────────────────
  lines.push("---");
  lines.push("");
  lines.push(
    "*This Privacy Impact Register was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. " +
      "It identifies processing activities that may require assessment but does not constitute a completed DPIA. " +
      "Organizations must conduct thorough assessments for each identified activity and engage legal counsel and the DPO to complete this register.*",
  );
  lines.push("");

  return lines.join("\n");
}

/** Calculate next review date — one year from now. */
function getNextReviewDate(isoDate: string): string {
  const d = new Date(isoDate);
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0];
}
