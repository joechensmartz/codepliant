import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates INCIDENT_COMMUNICATION_TEMPLATES.md — pre-written templates
 * for incident communication at every stage: initial notification, status
 * update, resolution, and post-mortem.
 *
 * Always generated when services are detected (every organization needs
 * incident communication readiness).
 */
export function generateIncidentCommunicationTemplates(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  if (scan.services.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const securityEmail = ctx?.securityEmail || contactEmail;
  const dpoName = ctx?.dpoName || "[Data Protection Officer]";
  const dpoEmail = ctx?.dpoEmail || "[dpo@example.com]";
  const website = ctx?.website || "[https://yoursite.com]";
  const date = new Date().toISOString().split("T")[0];

  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasPayment = scan.services.some((s) => s.category === "payment");

  const sections: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────
  sections.push("# Incident Communication Templates");
  sections.push("");
  sections.push(`**Organization:** ${company}`);
  sections.push(`**Last updated:** ${date}`);
  sections.push("");
  sections.push(
    `Pre-written communication templates for security and data incidents at **${company}**. ` +
      `These templates cover every stage of incident response communication: initial notification, ` +
      `status updates, resolution notice, and post-mortem report.`
  );
  sections.push("");
  sections.push("> **Instructions:** Replace all `[BRACKETED]` placeholders with actual values. " +
    "Review and customize each template for the specific incident before sending.");

  // ── Template 1: Initial Notification ────────────────────────────────
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## Template 1: Initial Notification");
  sections.push("");
  sections.push("*Use within the first 2 hours of incident detection. Send to affected users and stakeholders.*");
  sections.push("");
  sections.push("### Email Version");
  sections.push("");
  sections.push("```");
  sections.push(`Subject: Security Notice — ${company} is investigating an incident`);
  sections.push("");
  sections.push("Dear [Customer/User Name],");
  sections.push("");
  sections.push(`We are writing to inform you that ${company} has identified a security incident `);
  sections.push("that may affect your account or data.");
  sections.push("");
  sections.push("WHAT WE KNOW:");
  sections.push("- Date discovered: [DATE AND TIME]");
  sections.push("- Nature of incident: [BRIEF DESCRIPTION — e.g., unauthorized access,");
  sections.push("  data exposure, service disruption]");
  sections.push("- Systems affected: [AFFECTED SERVICES/FEATURES]");
  sections.push("");
  sections.push("WHAT WE ARE DOING:");
  sections.push("- Our security team is actively investigating the scope and impact");
  sections.push("- We have taken [IMMEDIATE ACTIONS — e.g., isolated affected systems,");
  sections.push("  revoked compromised credentials]");
  sections.push("- We are working with [external security experts / law enforcement] as needed");
  sections.push("");
  sections.push("WHAT YOU SHOULD DO:");
  sections.push("- Change your password at [URL]");
  sections.push("- Enable two-factor authentication if not already active");
  sections.push("- Review your account for any unauthorized activity");
  sections.push("- Be cautious of phishing emails claiming to be from us");
  sections.push("");
  sections.push("We will provide updates as our investigation progresses. Our next update");
  sections.push("will be within [24 hours / specific time].");
  sections.push("");
  sections.push(`If you have questions, please contact us at ${contactEmail}.`);
  sections.push("");
  sections.push("Sincerely,");
  sections.push(`${company} Security Team`);
  sections.push("```");
  sections.push("");
  sections.push("### Status Page / Public Notice Version");
  sections.push("");
  sections.push("```");
  sections.push("INVESTIGATING — Security Incident");
  sections.push(`Posted: [DATE TIME] | ${company}`);
  sections.push("");
  sections.push("We are investigating a security incident affecting [DESCRIPTION].");
  sections.push("Our team has been mobilized and we are actively working to resolve");
  sections.push("the issue. We will provide updates as more information becomes available.");
  sections.push("");
  sections.push("Impact: [DESCRIPTION OF USER IMPACT]");
  sections.push("Status: Investigating");
  sections.push("Next update: [TIME]");
  sections.push("```");

  // ── Template 2: Status Update ───────────────────────────────────────
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## Template 2: Status Update");
  sections.push("");
  sections.push("*Send at regular intervals (every 4-12 hours) during active incidents.*");
  sections.push("");
  sections.push("### Email Version");
  sections.push("");
  sections.push("```");
  sections.push(`Subject: Update [#N] — ${company} Security Incident`);
  sections.push("");
  sections.push("Dear [Customer/User Name],");
  sections.push("");
  sections.push(`This is update #[N] regarding the security incident we reported on [ORIGINAL DATE].`);
  sections.push("");
  sections.push("CURRENT STATUS:");
  sections.push("- Investigation phase: [Containment / Eradication / Recovery]");
  sections.push("- We have determined that [UPDATED SCOPE — more/less data than initially");
  sections.push("  estimated, specific data types affected]");
  sections.push("");
  sections.push("WHAT HAS CHANGED SINCE LAST UPDATE:");
  sections.push("- [ACTION TAKEN 1 — e.g., identified root cause]");
  sections.push("- [ACTION TAKEN 2 — e.g., patched vulnerability]");
  sections.push("- [ACTION TAKEN 3 — e.g., completed forensic analysis]");
  sections.push("");
  sections.push("DATA IMPACT UPDATE:");
  sections.push("- Types of data affected: [SPECIFIC DATA TYPES]");
  sections.push("- Number of accounts potentially affected: [NUMBER or RANGE]");
  sections.push("- Time period of exposure: [DATE RANGE]");
  sections.push("");
  sections.push("ADDITIONAL RECOMMENDED ACTIONS:");
  sections.push("- [Any new steps users should take]");
  sections.push("");
  sections.push("Our next update will be provided by [DATE/TIME].");
  sections.push("");
  sections.push(`Questions? Contact us at ${contactEmail}.`);
  sections.push("");
  sections.push("Sincerely,");
  sections.push(`${company} Security Team`);
  sections.push("```");
  sections.push("");
  sections.push("### Status Page Version");
  sections.push("");
  sections.push("```");
  sections.push("UPDATE — Security Incident");
  sections.push(`Posted: [DATE TIME] | ${company}`);
  sections.push("");
  sections.push("Update #[N]: Our investigation has [PROGRESS SUMMARY]. We have [ACTIONS TAKEN].");
  sections.push("[CURRENT USER IMPACT]. We continue to work toward full resolution.");
  sections.push("");
  sections.push("Impact: [UPDATED IMPACT]");
  sections.push("Status: [Identified / Monitoring / Resolving]");
  sections.push("Next update: [TIME]");
  sections.push("```");

  // ── Template 3: Resolution Notice ───────────────────────────────────
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## Template 3: Resolution Notice");
  sections.push("");
  sections.push("*Send when the incident has been fully resolved and systems are restored.*");
  sections.push("");
  sections.push("### Email Version");
  sections.push("");
  sections.push("```");
  sections.push(`Subject: Resolved — ${company} Security Incident Update`);
  sections.push("");
  sections.push("Dear [Customer/User Name],");
  sections.push("");
  sections.push(`We are writing to confirm that the security incident we reported on [ORIGINAL DATE] `);
  sections.push("has been fully resolved.");
  sections.push("");
  sections.push("INCIDENT SUMMARY:");
  sections.push("- Date discovered: [DATE]");
  sections.push("- Date resolved: [DATE]");
  sections.push("- Total duration: [DURATION]");
  sections.push("- Root cause: [HIGH-LEVEL DESCRIPTION]");
  sections.push("");
  sections.push("WHAT HAPPENED:");
  sections.push("[2-3 sentence plain-language explanation of what occurred, avoiding");
  sections.push("unnecessary technical jargon]");
  sections.push("");
  sections.push("DATA IMPACT:");
  sections.push("- [X] accounts were affected");
  sections.push("- Data types involved: [LIST]");
  sections.push("- No [financial data / passwords / etc.] were compromised");
  sections.push("");
  sections.push("WHAT WE DID:");
  sections.push("- [REMEDIATION ACTION 1]");
  sections.push("- [REMEDIATION ACTION 2]");
  sections.push("- [REMEDIATION ACTION 3]");
  sections.push("");
  sections.push("WHAT WE ARE DOING TO PREVENT RECURRENCE:");
  sections.push("- [PREVENTIVE MEASURE 1]");
  sections.push("- [PREVENTIVE MEASURE 2]");
  sections.push("- [PREVENTIVE MEASURE 3]");
  sections.push("");
  sections.push("COMPENSATION / SUPPORT:");
  sections.push("- [Credit monitoring service / account credit / extended features — if applicable]");
  sections.push(`- For questions or concerns, contact ${contactEmail}`);
  sections.push(`- Our DPO, ${dpoName}, can be reached at ${dpoEmail}`);
  sections.push("");
  sections.push("We sincerely apologize for this incident and the inconvenience it has caused.");
  sections.push("The trust you place in us is something we take very seriously, and we are");
  sections.push("committed to earning and maintaining that trust.");
  sections.push("");
  sections.push("Sincerely,");
  sections.push("[CEO/CTO Name]");
  sections.push(`${company}`);
  sections.push("```");
  sections.push("");
  sections.push("### Status Page Version");
  sections.push("");
  sections.push("```");
  sections.push("RESOLVED — Security Incident");
  sections.push(`Posted: [DATE TIME] | ${company}`);
  sections.push("");
  sections.push("The security incident reported on [DATE] has been fully resolved.");
  sections.push("[SUMMARY OF RESOLUTION]. All systems are operating normally.");
  sections.push("We have implemented additional safeguards to prevent recurrence.");
  sections.push("");
  sections.push("Impact: Resolved");
  sections.push("Status: Resolved");
  sections.push("Duration: [START] to [END]");
  sections.push("```");

  // ── Template 4: Post-Mortem Report ──────────────────────────────────
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## Template 4: Post-Mortem Report");
  sections.push("");
  sections.push("*Publish within 5 business days of resolution. Share internally and optionally with affected parties.*");
  sections.push("");
  sections.push("```markdown");
  sections.push(`# Post-Mortem Report: [Incident Title]`);
  sections.push("");
  sections.push(`**Organization:** ${company}`);
  sections.push("**Incident ID:** [INC-YYYY-NNN]");
  sections.push("**Severity:** [Critical / High / Medium / Low]");
  sections.push("**Date of incident:** [DATE]");
  sections.push("**Date resolved:** [DATE]");
  sections.push("**Report author:** [NAME]");
  sections.push("**Report date:** [DATE]");
  sections.push("");
  sections.push("## Executive Summary");
  sections.push("");
  sections.push("[2-3 sentence summary: what happened, impact, resolution]");
  sections.push("");
  sections.push("## Timeline");
  sections.push("");
  sections.push("| Time (UTC) | Event |");
  sections.push("| ---------- | ----- |");
  sections.push("| [HH:MM] | [First indication of issue] |");
  sections.push("| [HH:MM] | [Incident confirmed / escalated] |");
  sections.push("| [HH:MM] | [Containment actions taken] |");
  sections.push("| [HH:MM] | [Root cause identified] |");
  sections.push("| [HH:MM] | [Fix deployed] |");
  sections.push("| [HH:MM] | [Monitoring confirmed resolution] |");
  sections.push("| [HH:MM] | [All-clear declared] |");
  sections.push("");
  sections.push("## Root Cause");
  sections.push("");
  sections.push("[Detailed technical explanation of the root cause]");
  sections.push("");
  sections.push("## Impact");
  sections.push("");
  sections.push("- **Users affected:** [NUMBER]");
  sections.push("- **Data exposed:** [TYPES AND VOLUME]");
  sections.push("- **Service downtime:** [DURATION]");
  sections.push("- **Financial impact:** [ESTIMATE]");
  sections.push("- **Regulatory notifications:** [AUTHORITIES NOTIFIED]");
  sections.push("");
  sections.push("## Detection");
  sections.push("");
  sections.push("How was the incident detected?");
  sections.push("- [ ] Automated monitoring / alerting");
  sections.push("- [ ] Employee report");
  sections.push("- [ ] Customer report");
  sections.push("- [ ] Third-party notification");
  sections.push("- [ ] Security audit");
  sections.push("");
  sections.push("Detection gap: [TIME FROM INCIDENT START TO DETECTION]");
  sections.push("");
  sections.push("## Response Assessment");
  sections.push("");
  sections.push("### What went well");
  sections.push("");
  sections.push("- [POSITIVE 1]");
  sections.push("- [POSITIVE 2]");
  sections.push("");
  sections.push("### What could be improved");
  sections.push("");
  sections.push("- [IMPROVEMENT 1]");
  sections.push("- [IMPROVEMENT 2]");
  sections.push("");
  sections.push("## Action Items");
  sections.push("");
  sections.push("| # | Action | Owner | Priority | Due Date | Status |");
  sections.push("| - | ------ | ----- | -------- | -------- | ------ |");
  sections.push("| 1 | [ACTION] | [OWNER] | [P1/P2/P3] | [DATE] | [ ] Open |");
  sections.push("| 2 | [ACTION] | [OWNER] | [P1/P2/P3] | [DATE] | [ ] Open |");
  sections.push("| 3 | [ACTION] | [OWNER] | [P1/P2/P3] | [DATE] | [ ] Open |");
  sections.push("");
  sections.push("## Regulatory Compliance");
  sections.push("");
  sections.push("- [ ] Supervisory authority notified within 72 hours (GDPR Art. 33)");
  sections.push("- [ ] Affected individuals notified (GDPR Art. 34, if high risk)");

  if (hasPayment) {
    sections.push("- [ ] Payment processor notified within 24 hours (PCI DSS)");
    sections.push("- [ ] Card brands notified per their requirements");
  }

  if (hasAI) {
    sections.push("- [ ] AI provider notified of data exposure through AI services");
    sections.push("- [ ] AI model inputs/outputs reviewed for data leakage");
  }

  sections.push("- [ ] Internal breach register updated");
  sections.push("- [ ] Insurance carrier notified (if applicable)");
  sections.push("```");

  // ── Template 5: Regulatory Authority Notification ───────────────────
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## Template 5: Supervisory Authority Notification");
  sections.push("");
  sections.push("*Submit within 72 hours of becoming aware of a personal data breach (GDPR Art. 33).*");
  sections.push("");
  sections.push("```");
  sections.push("PERSONAL DATA BREACH NOTIFICATION");
  sections.push("═════════════════════════════════");
  sections.push("");
  sections.push(`Data Controller: ${company}`);
  sections.push(`DPO: ${dpoName}`);
  sections.push(`DPO Contact: ${dpoEmail}`);
  sections.push(`Website: ${website}`);
  sections.push("");
  sections.push("1. Date and time of breach discovery: [DATE TIME]");
  sections.push("2. Date and time breach occurred (if known): [DATE TIME]");
  sections.push("3. How the breach was discovered: [DESCRIPTION]");
  sections.push("");
  sections.push("4. Nature of the breach:");
  sections.push("   [X] Confidentiality (unauthorized disclosure/access)");
  sections.push("   [ ] Integrity (unauthorized alteration)");
  sections.push("   [ ] Availability (unauthorized loss of access)");
  sections.push("");
  sections.push("5. Categories of data subjects: [e.g., customers, employees]");
  sections.push("6. Approximate number of data subjects: [NUMBER]");
  sections.push("7. Categories of personal data: [e.g., names, emails, financial]");
  sections.push("8. Approximate number of records: [NUMBER]");
  sections.push("");
  sections.push("9. Likely consequences of the breach:");
  sections.push("   [DESCRIPTION OF POTENTIAL IMPACT]");
  sections.push("");
  sections.push("10. Measures taken to address the breach:");
  sections.push("    [CONTAINMENT AND REMEDIATION STEPS]");
  sections.push("");
  sections.push("11. Measures taken to mitigate adverse effects:");
  sections.push("    [MITIGATION ACTIONS FOR DATA SUBJECTS]");
  sections.push("");
  sections.push("12. Have data subjects been notified?");
  sections.push("    [ ] Yes — Date: [DATE], Method: [EMAIL/POST/PUBLIC NOTICE]");
  sections.push("    [ ] No — Reason: [NOT YET REQUIRED / LOW RISK / PENDING]");
  sections.push("");
  sections.push("13. Cross-border transfer:");
  sections.push("    Was data transferred to third countries? [YES/NO]");
  sections.push("    If yes, which countries? [LIST]");
  sections.push("```");

  // ── Usage Guide ─────────────────────────────────────────────────────
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## Usage Guide");
  sections.push("");
  sections.push("### When to Use Each Template");
  sections.push("");
  sections.push("| Template | When | Who Sends | Who Receives |");
  sections.push("| -------- | ---- | --------- | ------------ |");
  sections.push("| Initial Notification | Within 2 hours of detection | Security Team | Affected users, internal stakeholders |");
  sections.push("| Status Update | Every 4-12 hours during active incident | Security Team | Affected users, internal stakeholders |");
  sections.push("| Resolution Notice | When incident is fully resolved | CEO/CTO | All affected parties |");
  sections.push("| Post-Mortem | Within 5 business days of resolution | Incident Lead | Internal teams, optionally external |");
  sections.push("| Authority Notification | Within 72 hours (GDPR) | DPO | Supervisory authority |");
  sections.push("");
  sections.push("### Communication Channels");
  sections.push("");
  sections.push("| Channel | Use For | Priority |");
  sections.push("| ------- | ------- | -------- |");
  sections.push("| Direct email | Individual user notification | Critical/High |");
  sections.push("| Status page | Public incident updates | All severities |");
  sections.push("| In-app banner | Active users during incident | Critical/High |");
  sections.push("| Social media | Public awareness if widespread | Critical |");
  sections.push("| Blog post | Detailed post-mortem | Post-resolution |");
  sections.push(`| ${securityEmail} | Inbound questions | All severities |`);

  // ── Disclaimer ─────────────────────────────────────────────────────
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push(
    `*These incident communication templates were generated by [Codepliant](https://github.com/joechensmartz/codepliant) ` +
      `based on an automated scan of the **${scan.projectName}** codebase. ` +
      `They should be reviewed and customized by your legal, security, and communications teams before use.*`
  );
  sections.push("");

  return sections.join("\n");
}
