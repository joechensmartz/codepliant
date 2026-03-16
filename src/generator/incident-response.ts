import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates an INCIDENT_RESPONSE_PLAN.md — a Data Breach / Incident Response
 * Plan document.  Always generated because every project needs one.
 *
 * Conditional sections:
 *   - AI services detected  → AI incident handling (bias, hallucination, data leak)
 *   - Payment services      → PCI incident procedures
 *   - Health data (HIPAA)   → HIPAA breach notification (60-day window)
 */
export function generateIncidentResponsePlan(
  scan: ScanResult,
  ctx?: GeneratorContext
): string {
  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const securityEmail =
    ctx?.securityEmail || contactEmail;
  const dpoName = ctx?.dpoName || "[Data Protection Officer Name]";
  const dpoEmail = ctx?.dpoEmail || "[dpo@example.com]";
  const website = ctx?.website || "[https://yoursite.com]";
  const date = new Date().toISOString().split("T")[0];

  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasHealth = scan.complianceNeeds.some(
    (n) => n.document === "HIPAA Compliance"
  );

  const sections: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────
  sections.push("# Incident Response Plan");
  sections.push("");
  sections.push(`**Last updated:** ${date}`);
  sections.push("");
  sections.push(
    `This document outlines the incident response procedures for **${company}**. ` +
      `It covers detection, classification, notification, investigation, remediation, and post-incident review.`
  );

  // ── 1. Incident Classification ──────────────────────────────────────
  sections.push("");
  sections.push("## 1. Incident Classification");
  sections.push("");
  sections.push(
    "All security incidents and data breaches are classified by severity to determine the appropriate response timeline and escalation path."
  );
  sections.push("");
  sections.push("| Severity | Description | Response Time | Examples |");
  sections.push("| -------- | ----------- | ------------- | -------- |");
  sections.push(
    "| **Critical (P1)** | Active data breach with confirmed data exfiltration or system compromise | Immediate (within 1 hour) | Unauthorized access to production database, ransomware, leaked credentials actively exploited |"
  );
  sections.push(
    "| **High (P2)** | Confirmed security incident with potential data exposure | Within 4 hours | Vulnerability actively being exploited, unauthorized access detected, suspected data leak |"
  );
  sections.push(
    "| **Medium (P3)** | Security event requiring investigation | Within 24 hours | Unusual access patterns, failed intrusion attempts, misconfiguration discovered |"
  );
  sections.push(
    "| **Low (P4)** | Minor security event or policy violation | Within 72 hours | Phishing attempt blocked, minor policy violation, non-sensitive data exposure |"
  );

  // ── 2. Detection and Reporting ──────────────────────────────────────
  sections.push("");
  sections.push("## 2. Detection and Reporting Procedures");
  sections.push("");
  sections.push("### How to Report an Incident");
  sections.push("");
  sections.push("Any employee, contractor, or third party who discovers or suspects a security incident must report it immediately:");
  sections.push("");
  sections.push(`1. **Email:** [${securityEmail}](mailto:${securityEmail})`);
  sections.push(`2. **Escalation:** Contact the DPO at [${dpoEmail}](mailto:${dpoEmail})`);
  sections.push("3. **Do NOT** attempt to investigate or remediate the issue independently");
  sections.push("4. **Do NOT** communicate about the incident on public channels");
  sections.push("");
  sections.push("### Information to Include");
  sections.push("");
  sections.push("- Date and time the incident was discovered");
  sections.push("- Description of what occurred");
  sections.push("- Systems, services, or data affected");
  sections.push("- How the incident was detected");
  sections.push("- Any actions already taken");
  sections.push("- Contact information of the reporter");

  // ── 3. 72-Hour GDPR Notification ───────────────────────────────────
  sections.push("");
  sections.push("## 3. GDPR 72-Hour Notification Requirement");
  sections.push("");
  sections.push(
    "Under Article 33 of the GDPR, personal data breaches must be reported to the relevant supervisory authority **within 72 hours** of becoming aware of the breach, unless the breach is unlikely to result in a risk to the rights and freedoms of individuals."
  );
  sections.push("");
  sections.push("### Timeline");
  sections.push("");
  sections.push("| Milestone | Deadline |");
  sections.push("| --------- | -------- |");
  sections.push("| Breach discovered | T = 0 |");
  sections.push("| Internal assessment complete | T + 24 hours |");
  sections.push("| Decision on notification obligation | T + 36 hours |");
  sections.push("| Supervisory authority notified | T + 72 hours (maximum) |");
  sections.push("| Affected individuals notified (if high risk) | Without undue delay |");
  sections.push("");
  sections.push(
    "If notification cannot be made within 72 hours, the reasons for the delay must be documented and communicated to the authority."
  );

  // ── 4. Authority Notification Template ─────────────────────────────
  sections.push("");
  sections.push("## 4. Authority Notification Template");
  sections.push("");
  sections.push(
    "Use the following template when notifying the supervisory authority of a personal data breach:"
  );
  sections.push("");
  sections.push("```");
  sections.push("PERSONAL DATA BREACH NOTIFICATION");
  sections.push("=================================");
  sections.push("");
  sections.push(`Organization: ${company}`);
  sections.push(`DPO / Contact: ${dpoName} (${dpoEmail})`);
  sections.push(`Website: ${website}`);
  sections.push("");
  sections.push("Date and time breach was discovered: [DATE/TIME]");
  sections.push("Date and time breach occurred (if known): [DATE/TIME]");
  sections.push("");
  sections.push("Nature of the breach:");
  sections.push("  [ ] Confidentiality breach (unauthorized disclosure)");
  sections.push("  [ ] Integrity breach (unauthorized alteration)");
  sections.push("  [ ] Availability breach (unauthorized loss of access)");
  sections.push("");
  sections.push("Categories of personal data affected:");
  sections.push("  [ ] Names               [ ] Email addresses");
  sections.push("  [ ] Phone numbers       [ ] Physical addresses");
  sections.push("  [ ] Financial data      [ ] Health data");
  sections.push("  [ ] Authentication data [ ] Other: ___________");
  sections.push("");
  sections.push("Approximate number of data subjects affected: [NUMBER]");
  sections.push("Approximate number of records affected: [NUMBER]");
  sections.push("");
  sections.push("Description of likely consequences:");
  sections.push("[DESCRIBE POTENTIAL IMPACT ON DATA SUBJECTS]");
  sections.push("");
  sections.push("Measures taken or proposed to address the breach:");
  sections.push("[DESCRIBE CONTAINMENT AND REMEDIATION STEPS]");
  sections.push("");
  sections.push("Measures taken to mitigate adverse effects:");
  sections.push("[DESCRIBE MITIGATION ACTIONS]");
  sections.push("```");

  // ── 5. User Notification Template ──────────────────────────────────
  sections.push("");
  sections.push("## 5. User Notification Template");
  sections.push("");
  sections.push(
    "When a breach is likely to result in a high risk to the rights and freedoms of individuals (GDPR Article 34), affected users must be notified directly. Use the following template:"
  );
  sections.push("");
  sections.push("```");
  sections.push(`Subject: Important Security Notice from ${company}`);
  sections.push("");
  sections.push("Dear [User Name],");
  sections.push("");
  sections.push(`We are writing to inform you of a security incident at ${company} that may ` +
    "have affected your personal data.");
  sections.push("");
  sections.push("WHAT HAPPENED:");
  sections.push("[Brief, clear description of the incident]");
  sections.push("");
  sections.push("WHAT DATA WAS AFFECTED:");
  sections.push("[List the specific types of personal data involved]");
  sections.push("");
  sections.push("WHAT WE ARE DOING:");
  sections.push("[Describe the steps taken to contain and remediate the breach]");
  sections.push("");
  sections.push("WHAT YOU CAN DO:");
  sections.push("- Change your password immediately");
  sections.push("- Enable two-factor authentication if not already active");
  sections.push("- Monitor your accounts for suspicious activity");
  sections.push("- [Additional specific recommendations]");
  sections.push("");
  sections.push("CONTACT US:");
  sections.push(`If you have questions, please contact us at ${contactEmail}.`);
  sections.push("");
  sections.push("We sincerely apologize for this incident and are taking all necessary");
  sections.push("steps to prevent a recurrence.");
  sections.push("");
  sections.push("Sincerely,");
  sections.push(company);
  sections.push("```");

  // ── 6. Investigation Procedures ────────────────────────────────────
  sections.push("");
  sections.push("## 6. Investigation Procedures");
  sections.push("");
  sections.push("Upon confirmation of a security incident, the incident response team must:");
  sections.push("");
  sections.push("### 6.1 Containment");
  sections.push("");
  sections.push("- [ ] Isolate affected systems from the network");
  sections.push("- [ ] Revoke compromised credentials and API keys");
  sections.push("- [ ] Block malicious IP addresses or accounts");
  sections.push("- [ ] Preserve forensic evidence (logs, snapshots, memory dumps)");
  sections.push("- [ ] Activate backup communication channels if primary channels are compromised");
  sections.push("");
  sections.push("### 6.2 Investigation");
  sections.push("");
  sections.push("- [ ] Determine the root cause of the incident");
  sections.push("- [ ] Identify all affected systems, services, and data");
  sections.push("- [ ] Determine the scope of data exposure");
  sections.push("- [ ] Review access logs and audit trails");
  sections.push("- [ ] Interview relevant personnel");
  sections.push("- [ ] Document timeline of events");
  sections.push("- [ ] Engage external forensic specialists if needed");

  // ── 7. Remediation Steps ───────────────────────────────────────────
  sections.push("");
  sections.push("## 7. Remediation Steps");
  sections.push("");
  sections.push("- [ ] Patch or fix the vulnerability that led to the incident");
  sections.push("- [ ] Rotate all potentially compromised secrets, keys, and tokens");
  sections.push("- [ ] Force password resets for affected user accounts");
  sections.push("- [ ] Update firewall rules and access controls");
  sections.push("- [ ] Deploy additional monitoring on affected systems");
  sections.push("- [ ] Verify that the attack vector is fully closed");
  sections.push("- [ ] Conduct a follow-up scan to confirm no persistence mechanisms remain");
  sections.push("- [ ] Update security documentation and runbooks");

  // ── 8. Post-Incident Review ────────────────────────────────────────
  sections.push("");
  sections.push("## 8. Post-Incident Review");
  sections.push("");
  sections.push(
    "A post-incident review (blameless post-mortem) must be conducted within **5 business days** of incident resolution."
  );
  sections.push("");
  sections.push("### Review Agenda");
  sections.push("");
  sections.push("1. **Timeline reconstruction** — What happened, and when?");
  sections.push("2. **Root cause analysis** — Why did it happen?");
  sections.push("3. **Detection assessment** — How was the incident detected? Could it have been detected sooner?");
  sections.push("4. **Response evaluation** — Was the response effective? What worked well?");
  sections.push("5. **Gap identification** — What controls, processes, or tools were missing?");
  sections.push("6. **Action items** — Concrete tasks with owners and deadlines to prevent recurrence");
  sections.push("");
  sections.push("### Documentation");
  sections.push("");
  sections.push("The post-incident report must include:");
  sections.push("");
  sections.push("- Incident summary and severity classification");
  sections.push("- Complete timeline of events");
  sections.push("- Root cause and contributing factors");
  sections.push("- Data impact assessment");
  sections.push("- Remediation actions taken");
  sections.push("- Lessons learned");
  sections.push("- Preventive action items with owners and due dates");

  // ── 9. Contact List ────────────────────────────────────────────────
  sections.push("");
  sections.push("## 9. Contact List");
  sections.push("");
  sections.push("| Role | Name | Email | Responsibility |");
  sections.push("| ---- | ---- | ----- | -------------- |");
  sections.push(
    `| Incident Response Lead | [Name] | [${securityEmail}](mailto:${securityEmail}) | Overall incident coordination |`
  );
  sections.push(
    `| Data Protection Officer | ${dpoName} | [${dpoEmail}](mailto:${dpoEmail}) | GDPR compliance, authority notification |`
  );
  sections.push(
    `| Engineering Lead | [Name] | [email] | Technical investigation and remediation |`
  );
  sections.push(
    `| Legal Counsel | [Name] | [email] | Legal obligations, regulatory response |`
  );
  sections.push(
    `| Communications Lead | [Name] | [email] | User notification, public communications |`
  );
  sections.push(
    `| Executive Sponsor | [Name] | [email] | Final decision authority |`
  );

  // ── Conditional: AI Incident Handling ──────────────────────────────
  if (hasAI) {
    sections.push("");
    sections.push("## 10. AI Incident Handling");
    sections.push("");
    sections.push(
      "This project integrates with AI services. The following additional procedures apply to AI-related incidents."
    );
    sections.push("");
    sections.push("### AI-Specific Incident Types");
    sections.push("");
    sections.push("| Incident Type | Description | Severity |");
    sections.push("| ------------- | ----------- | -------- |");
    sections.push("| **Data leak via AI** | User data or sensitive information exposed through AI model inputs/outputs | Critical (P1) |");
    sections.push("| **Prompt injection** | Malicious prompts bypass safety controls to extract data or alter behavior | High (P2) |");
    sections.push("| **Bias incident** | AI produces discriminatory, harmful, or biased outputs at scale | High (P2) |");
    sections.push("| **Hallucination impact** | AI generates false information that causes user harm or legal liability | Medium–High |");
    sections.push("| **Model manipulation** | Adversarial inputs cause the AI to produce unauthorized outputs | High (P2) |");
    sections.push("");
    sections.push("### AI Incident Response Steps");
    sections.push("");
    sections.push("1. **Contain** — Disable or throttle the affected AI feature immediately");
    sections.push("2. **Assess data exposure** — Determine if user data was leaked to or through the AI service");
    sections.push("3. **Review AI provider logs** — Request audit logs from the AI service provider");
    sections.push("4. **Evaluate downstream impact** — Assess whether AI outputs were stored, shared, or acted upon");
    sections.push("5. **Notify AI provider** — Report the incident to the AI service provider per your agreement");
    sections.push("6. **Update safeguards** — Strengthen input validation, output filtering, and prompt guardrails");
    sections.push("7. **Document** — Record the incident with specific attention to data flow through AI services");
  }

  // ── Conditional: PCI Incident Procedures ───────────────────────────
  if (hasPayment) {
    const pciSectionNum = hasAI ? "11" : "10";
    sections.push("");
    sections.push(`## ${pciSectionNum}. PCI DSS Incident Procedures`);
    sections.push("");
    sections.push(
      "This project processes payment data. The following PCI DSS-specific procedures apply to incidents involving cardholder data."
    );
    sections.push("");
    sections.push("### PCI Incident Requirements");
    sections.push("");
    sections.push("- [ ] Immediately contain and limit the exposure of cardholder data");
    sections.push("- [ ] Notify your payment processor (e.g., Stripe, PayPal) within **24 hours** of discovering a breach");
    sections.push("- [ ] Notify the relevant card brands (Visa, Mastercard, etc.) per their specific timelines");
    sections.push("- [ ] Engage a PCI Forensic Investigator (PFI) if required by the card brands");
    sections.push("- [ ] Preserve all evidence for forensic investigation");
    sections.push("- [ ] Do NOT restart or alter compromised systems until forensic evidence is collected");
    sections.push("");
    sections.push("### Payment Data Breach Checklist");
    sections.push("");
    sections.push("- [ ] Confirm whether primary account numbers (PANs) were exposed");
    sections.push("- [ ] Determine if CVV/CVC or PIN data was compromised");
    sections.push("- [ ] Verify that cardholder data was being handled per PCI DSS requirements");
    sections.push("- [ ] Document all compromised merchant IDs and terminal IDs");
    sections.push("- [ ] Prepare for potential PCI DSS re-certification");
  }

  // ── Conditional: HIPAA Breach Notification ─────────────────────────
  if (hasHealth) {
    const hipaaSectionNum = hasAI && hasPayment ? "12" : hasAI || hasPayment ? "11" : "10";
    sections.push("");
    sections.push(`## ${hipaaSectionNum}. HIPAA Breach Notification`);
    sections.push("");
    sections.push(
      "This project handles Protected Health Information (PHI). The HIPAA Breach Notification Rule " +
        "(45 CFR §§ 164.400–414) imposes specific notification requirements."
    );
    sections.push("");
    sections.push("### HIPAA Notification Timelines");
    sections.push("");
    sections.push("| Recipient | Deadline | Requirement |");
    sections.push("| --------- | -------- | ----------- |");
    sections.push("| **Affected individuals** | Within 60 days of discovery | Written notice by first-class mail or email (if consented) |");
    sections.push("| **HHS Secretary** | Within 60 days (≥ 500 individuals) or annually (< 500) | Via HHS breach reporting portal |");
    sections.push("| **Prominent media outlets** | Within 60 days (≥ 500 individuals in a state/jurisdiction) | Press release or equivalent |");
    sections.push("");
    sections.push("### HIPAA Breach Assessment");
    sections.push("");
    sections.push("Determine whether an impermissible use or disclosure of PHI constitutes a breach by evaluating:");
    sections.push("");
    sections.push("1. **Nature and extent of PHI involved** — types of identifiers and likelihood of re-identification");
    sections.push("2. **Unauthorized person** — who impermissibly used or received the PHI");
    sections.push("3. **Acquisition or viewing** — whether PHI was actually acquired or viewed");
    sections.push("4. **Mitigation** — extent to which risk has been mitigated");
    sections.push("");
    sections.push(
      "Unless you demonstrate through a risk assessment that there is a **low probability** that PHI has been " +
        "compromised, a breach is presumed and notification is required."
    );
  }

  // ── Disclaimer ─────────────────────────────────────────────────────
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push(
    `*This incident response plan was generated by [Codepliant](https://github.com/joechensmartz/codepliant) ` +
      `based on an automated scan of the **${scan.projectName}** codebase. ` +
      `It should be reviewed and customized by your legal and security teams before adoption.*`
  );
  sections.push("");

  return sections.join("\n");
}
