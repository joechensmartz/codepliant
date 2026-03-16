import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates REGULATORY_CORRESPONDENCE_LOG.md — a template for tracking
 * all communications with regulatory authorities.
 *
 * Includes:
 * - Date, authority, topic, outcome, follow-up columns
 * - Pre-populated authority contacts based on jurisdictions
 * - Sections for GDPR supervisory authorities, FTC, state AGs
 * - Escalation tracking and deadline management
 *
 * Returns null when no services are detected (no data processing = no regulatory exposure).
 */
export function generateRegulatoryCorrespondenceLog(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const dpoName = ctx?.dpoName || "[Data Protection Officer Name]";
  const dpoEmail = ctx?.dpoEmail || "[dpo@example.com]";
  const date = new Date().toISOString().split("T")[0];

  const jurisdiction = ctx?.jurisdiction || "";
  const jurisdictions = ctx?.jurisdictions || [];
  const allJurisdictions = new Set<string>();
  if (jurisdiction) allJurisdictions.add(jurisdiction);
  for (const j of jurisdictions) allJurisdictions.add(j);

  const hasEU = [...allJurisdictions].some(
    (j) => j === "eu" || j === "gdpr" || j === "uk" || j.startsWith("eu-"),
  );
  const hasUS = [...allJurisdictions].some(
    (j) => j === "us" || j === "ccpa" || j === "hipaa" || j.startsWith("us-"),
  );
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasAI = scan.services.some((s) => s.category === "ai");

  const sections: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────
  sections.push("# Regulatory Correspondence Log");
  sections.push("");
  sections.push(`**Organization:** ${company}`);
  sections.push(`**Project:** ${scan.projectName}`);
  sections.push(`**Last updated:** ${date}`);
  sections.push(`**Maintained by:** ${dpoName} (${dpoEmail})`);
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push(
    "This document tracks all communications with regulatory authorities, including " +
    "inquiries, complaints, audits, notifications, and follow-up actions. Maintaining " +
    "a complete correspondence log is a GDPR accountability requirement (Art. 5(2)) " +
    "and demonstrates good-faith compliance to supervisory authorities.",
  );
  sections.push("");
  sections.push("> **Retention:** Keep all correspondence records for a minimum of 6 years " +
    "from the date of last communication. Store securely with restricted access.");
  sections.push("");

  // ── 1. Correspondence Register ──────────────────────────────────────
  sections.push("## 1. Correspondence Register");
  sections.push("");
  sections.push("Record every inbound and outbound communication with any regulatory authority.");
  sections.push("");
  sections.push("| # | Date | Direction | Authority | Contact Person | Topic | Reference No. | Outcome | Follow-Up Required | Follow-Up Deadline | Status |");
  sections.push("|---|------|-----------|-----------|----------------|-------|---------------|---------|--------------------|--------------------|--------|");
  sections.push("| 1 | [DATE] | Inbound/Outbound | [AUTHORITY NAME] | [NAME/DEPT] | [BRIEF TOPIC] | [REF#] | [OUTCOME SUMMARY] | [YES/NO] | [DATE] | Open/Closed |");
  sections.push("| 2 | [DATE] | Inbound/Outbound | [AUTHORITY NAME] | [NAME/DEPT] | [BRIEF TOPIC] | [REF#] | [OUTCOME SUMMARY] | [YES/NO] | [DATE] | Open/Closed |");
  sections.push("| 3 | [DATE] | Inbound/Outbound | [AUTHORITY NAME] | [NAME/DEPT] | [BRIEF TOPIC] | [REF#] | [OUTCOME SUMMARY] | [YES/NO] | [DATE] | Open/Closed |");
  sections.push("");

  // ── 2. Communication Types ──────────────────────────────────────────
  sections.push("## 2. Communication Categories");
  sections.push("");
  sections.push("| Category | Description | Typical Deadline |");
  sections.push("|----------|-------------|------------------|");
  sections.push("| **Data Breach Notification** | Mandatory notification under GDPR Art. 33 / state breach laws | 72 hours (GDPR), varies by state |");
  sections.push("| **DSAR Escalation** | Regulator inquiry following unresolved data subject request | 30 days from regulator inquiry |");
  sections.push("| **Complaint Investigation** | Formal investigation following a data subject complaint | Per authority timeline |");
  sections.push("| **Audit / Inspection** | Planned or unplanned regulatory audit | Per audit schedule |");
  sections.push("| **Proactive Consultation** | DPIA consultation (GDPR Art. 36) or voluntary disclosure | 8 weeks (GDPR Art. 36(2)) |");
  sections.push("| **Annual Filing** | Required annual reports or registrations | Per jurisdiction |");
  sections.push("| **Cross-Border Transfer** | Transfer mechanism notifications or approvals | Per mechanism |");
  if (hasAI) {
    sections.push("| **AI Incident Report** | EU AI Act mandatory serious incident reports | 15 days (EU AI Act Art. 62) |");
  }
  sections.push("");

  // ── 3. Relevant Authorities ─────────────────────────────────────────
  sections.push("## 3. Relevant Regulatory Authorities");
  sections.push("");
  sections.push("Authorities relevant to this project based on detected jurisdictions and services:");
  sections.push("");
  sections.push("| Authority | Jurisdiction | Area | Contact | Notes |");
  sections.push("|-----------|-------------|------|---------|-------|");

  if (hasEU || allJurisdictions.size === 0) {
    sections.push("| **Lead Supervisory Authority** | [EU MEMBER STATE] | GDPR | [CONTACT URL] | Determined by main establishment |");
    sections.push("| **EDPB** | EU | Cross-border coordination | edpb.europa.eu | For cross-border processing disputes |");
    sections.push("| **ICO** | UK | UK GDPR / DPA 2018 | ico.org.uk | If processing UK resident data |");
  }
  if (hasUS || allJurisdictions.size === 0) {
    sections.push("| **FTC** | US (Federal) | Consumer protection | ftc.gov | Unfair/deceptive practices |");
    sections.push("| **CA AG / CPPA** | California | CCPA/CPRA | oag.ca.gov / cppa.ca.gov | If processing CA resident data |");
  }
  if (hasPayment) {
    sections.push("| **PCI SSC** | International | Payment card data | pcisecuritystandards.org | PCI DSS compliance |");
  }
  if (hasAI) {
    sections.push("| **AI Office** | EU | EU AI Act | [TBD] | AI system compliance, market surveillance |");
  }
  sections.push("| [ADD AUTHORITY] | [JURISDICTION] | [AREA] | [CONTACT] | [NOTES] |");
  sections.push("");

  // ── 4. Breach Notification Log ──────────────────────────────────────
  sections.push("## 4. Breach Notification Tracking");
  sections.push("");
  sections.push("Track all data breach notifications separately for quick reference and deadline compliance.");
  sections.push("");
  sections.push("| Incident ID | Discovery Date | Authority Notified | Notification Date | Within 72h? | Individuals Notified | Individuals Notification Date | Case Ref | Status |");
  sections.push("|-------------|---------------|--------------------|-------------------|-------------|----------------------|-------------------------------|----------|--------|");
  sections.push("| [INC-001] | [DATE] | [AUTHORITY] | [DATE] | [YES/NO] | [YES/NO/NA] | [DATE/NA] | [REF#] | [STATUS] |");
  sections.push("");

  // ── 5. Audit & Inspection Log ───────────────────────────────────────
  sections.push("## 5. Audit and Inspection Log");
  sections.push("");
  sections.push("| Audit Date | Authority | Type | Scope | Findings | Remediation Deadline | Remediation Status | Closed Date |");
  sections.push("|------------|-----------|------|-------|----------|----------------------|--------------------|-------------|");
  sections.push("| [DATE] | [AUTHORITY] | On-site/Remote/Document | [SCOPE] | [SUMMARY] | [DATE] | [STATUS] | [DATE] |");
  sections.push("");

  // ── 6. Follow-Up Actions ────────────────────────────────────────────
  sections.push("## 6. Open Follow-Up Actions");
  sections.push("");
  sections.push("| # | Related Correspondence | Action Required | Owner | Deadline | Priority | Status |");
  sections.push("|---|----------------------|-----------------|-------|----------|----------|--------|");
  sections.push("| 1 | [CORRESPONDENCE #] | [ACTION DESCRIPTION] | [NAME] | [DATE] | High/Medium/Low | Open/In Progress/Closed |");
  sections.push("| 2 | [CORRESPONDENCE #] | [ACTION DESCRIPTION] | [NAME] | [DATE] | High/Medium/Low | Open/In Progress/Closed |");
  sections.push("");

  // ── 7. Escalation Procedures ────────────────────────────────────────
  sections.push("## 7. Escalation Procedures");
  sections.push("");
  sections.push("### 7.1 Inbound Communication");
  sections.push("");
  sections.push("1. **Receipt:** All inbound regulatory communications must be forwarded to the DPO within 4 hours");
  sections.push("2. **Logging:** DPO logs the communication in Section 1 within 24 hours");
  sections.push("3. **Triage:** DPO assesses urgency and assigns priority");
  sections.push("4. **Escalation:** High-priority matters escalated to Legal Counsel and Executive Sponsor within 24 hours");
  sections.push("5. **Response:** Draft response within the regulatory deadline (default: 30 days unless otherwise specified)");
  sections.push("6. **Review:** Legal Counsel reviews all outbound responses before sending");
  sections.push("7. **Follow-up:** DPO tracks any required follow-up actions in Section 6");
  sections.push("");
  sections.push("### 7.2 Proactive Notifications");
  sections.push("");
  sections.push("1. **Assessment:** DPO determines notification obligation (breach, DPIA consultation, etc.)");
  sections.push("2. **Drafting:** DPO prepares notification using approved templates");
  sections.push("3. **Approval:** Legal Counsel and Executive Sponsor approve");
  sections.push("4. **Submission:** DPO submits via authority's official channel");
  sections.push("5. **Logging:** Record in Sections 1 and 4 (if breach-related)");
  sections.push("");

  // ── 8. Annual Summary ──────────────────────────────────────────────
  sections.push("## 8. Annual Summary");
  sections.push("");
  sections.push("Complete at year-end for the Annual Review Checklist and board reporting.");
  sections.push("");
  sections.push("| Metric | Count |");
  sections.push("|--------|-------|");
  sections.push("| Total regulatory communications | [N] |");
  sections.push("| Inbound inquiries/complaints | [N] |");
  sections.push("| Breach notifications filed | [N] |");
  sections.push("| Audits/inspections completed | [N] |");
  sections.push("| Open follow-up actions | [N] |");
  sections.push("| Average response time (days) | [N] |");
  sections.push("| Escalations to executive team | [N] |");
  sections.push("");

  // ── Contact ─────────────────────────────────────────────────────────
  sections.push("## 9. Contact");
  sections.push("");
  sections.push("| Role | Name | Email |");
  sections.push("|------|------|-------|");
  sections.push(`| Data Protection Officer | ${dpoName} | ${dpoEmail} |`);
  sections.push(`| General Inquiries | — | ${contactEmail} |`);
  sections.push("| Legal Counsel | [NAME] | [EMAIL] |");
  sections.push("| Executive Sponsor | [NAME] | [EMAIL] |");
  sections.push("");

  // ── Disclaimer ──────────────────────────────────────────────────────
  sections.push("---");
  sections.push("");
  sections.push(
    `*This Regulatory Correspondence Log was generated by [Codepliant](https://github.com/joechensmartz/codepliant) ` +
    `based on an automated scan of the **${scan.projectName}** codebase. ` +
    `This template should be reviewed and customized by your legal and compliance teams.*`,
  );

  return sections.join("\n");
}
