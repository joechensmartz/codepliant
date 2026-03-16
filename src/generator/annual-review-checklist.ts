import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates ANNUAL_REVIEW_CHECKLIST.md — yearly compliance review checklist.
 * Covers each generated document, regulatory calendar, and action items.
 */
export function generateAnnualReviewChecklist(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  if (scan.services.length === 0) return null;

  const companyName = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const dpoName = ctx?.dpoName || "[Data Protection Officer Name]";
  const dpoEmail = ctx?.dpoEmail || contactEmail;
  const date = new Date().toISOString().split("T")[0];
  const jurisdictions = ctx?.jurisdictions || [];

  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasAnalytics = scan.services.some((s) => s.category === "analytics");
  const hasAuth = scan.services.some((s) => s.category === "auth");
  const hasEmail = scan.services.some((s) => s.category === "email");
  const hasMonitoring = scan.services.some((s) => s.category === "monitoring");
  const hasAdvertising = scan.services.some((s) => s.category === "advertising");

  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────────
  lines.push("# Annual Compliance Review Checklist");
  lines.push("");
  lines.push(`> **${companyName}** — Annual Compliance Review`);
  lines.push(`>`);
  lines.push(`> Generated on ${date} by [Codepliant](https://github.com/joechensmartz/codepliant)`);
  lines.push("");

  // ── Metadata ───────────────────────────────────────────────────────────
  lines.push("## 1. Review Metadata");
  lines.push("");
  lines.push("| Field | Details |");
  lines.push("|-------|---------|");
  lines.push(`| **Organization** | ${companyName} |`);
  lines.push(`| **Review Lead** | ${dpoName} |`);
  lines.push(`| **Contact** | ${dpoEmail} |`);
  lines.push(`| **Review Period** | [Start Date] to [End Date] |`);
  lines.push(`| **Checklist Generated** | ${date} |`);
  lines.push(`| **Review Deadline** | [Set deadline — typically within 30 days of start] |`);
  lines.push("");

  // ── Document Review ────────────────────────────────────────────────────
  lines.push("## 2. Document Review Checklist");
  lines.push("");
  lines.push("Review each compliance document for accuracy and completeness. Update any document that no longer reflects current practices.");
  lines.push("");

  interface DocReview {
    filename: string;
    name: string;
    reviewItems: string[];
    frequency: string;
  }

  const docReviews: DocReview[] = [];

  // Always-generated docs
  docReviews.push({
    filename: "PRIVACY_POLICY.md",
    name: "Privacy Policy",
    reviewItems: [
      "All third-party services listed match current integrations",
      "Data collection descriptions are accurate",
      "Legal basis assignments are correct",
      "Contact information is current",
      "Data retention periods reflect actual practices",
    ],
    frequency: "Annual + on change",
  });

  docReviews.push({
    filename: "TERMS_OF_SERVICE.md",
    name: "Terms of Service",
    reviewItems: [
      "Service description matches current offering",
      "Limitation of liability clauses are appropriate",
      "Governing law and jurisdiction are correct",
      "Acceptable use provisions are current",
    ],
    frequency: "Annual + on change",
  });

  docReviews.push({
    filename: "SECURITY.md",
    name: "Security Policy",
    reviewItems: [
      "Security measures reflect current infrastructure",
      "Responsible disclosure process is functional",
      "Contact information is current",
      "Vulnerability response timelines are achievable",
    ],
    frequency: "Annual + after incidents",
  });

  if (scan.services.length > 0) {
    docReviews.push({
      filename: "RECORD_OF_PROCESSING_ACTIVITIES.md",
      name: "Record of Processing Activities",
      reviewItems: [
        "All processing activities are documented",
        "New services/integrations are reflected",
        "Lawful basis for each activity is reviewed",
        "Data transfer mechanisms are current",
        "Retention periods match actual practices",
      ],
      frequency: "Annual + on change",
    });
  }

  if (scan.services.length >= 3) {
    docReviews.push({
      filename: "SUBPROCESSOR_LIST.md",
      name: "Sub-Processor List",
      reviewItems: [
        "All sub-processors are listed",
        "DPA status is verified for each sub-processor",
        "New vendors have been assessed",
        "Discontinued vendors have been removed",
        "Data processing locations are accurate",
      ],
      frequency: "Quarterly recommended, Annual minimum",
    });
  }

  if (hasPayment) {
    docReviews.push({
      filename: "REFUND_POLICY.md",
      name: "Refund Policy",
      reviewItems: [
        "Refund terms match current business practices",
        "Payment processor information is current",
        "Consumer protection requirements are met",
      ],
      frequency: "Annual",
    });
  }

  if (hasAI) {
    docReviews.push({
      filename: "AI_DISCLOSURE.md",
      name: "AI Disclosure",
      reviewItems: [
        "AI services listed match current integrations",
        "Data handling descriptions are accurate",
        "Risk classification is current",
        "Transparency obligations under EU AI Act are met",
      ],
      frequency: "Annual + on AI service changes",
    });

    docReviews.push({
      filename: "AI_GOVERNANCE_FRAMEWORK.md",
      name: "AI Governance Framework",
      reviewItems: [
        "AI risk assessments are up to date",
        "Human oversight mechanisms are functioning",
        "AI model cards are current",
        "Bias monitoring is in place",
      ],
      frequency: "Annual + on model changes",
    });
  }

  if (hasAnalytics || hasAdvertising) {
    docReviews.push({
      filename: "COOKIE_POLICY.md",
      name: "Cookie Policy",
      reviewItems: [
        "Cookie inventory is complete and accurate",
        "Third-party cookies are documented",
        "Consent mechanism is functioning properly",
        "Cookie lifetimes match actual settings",
      ],
      frequency: "Annual + on analytics changes",
    });
  }

  // ── Document Review Table ──────────────────────────────────────────────
  lines.push("| # | Document | Filename | Review Frequency | Status |");
  lines.push("|---|----------|----------|-----------------|--------|");
  for (let i = 0; i < docReviews.length; i++) {
    const doc = docReviews[i];
    lines.push(
      `| ${i + 1} | ${doc.name} | \`${doc.filename}\` | ${doc.frequency} | - [ ] Reviewed |`
    );
  }
  lines.push("");

  // ── Detailed Review Items ──────────────────────────────────────────────
  lines.push("### Detailed Review Items per Document");
  lines.push("");

  for (const doc of docReviews) {
    lines.push(`#### ${doc.name} (\`${doc.filename}\`)`);
    lines.push("");
    for (const item of doc.reviewItems) {
      lines.push(`- [ ] ${item}`);
    }
    lines.push("");
  }

  // ── Regulatory Calendar ────────────────────────────────────────────────
  lines.push("## 3. Regulatory Calendar");
  lines.push("");
  lines.push("Key compliance dates and deadlines for the review period:");
  lines.push("");
  lines.push("| Month | Activity | Regulation | Owner |");
  lines.push("|-------|----------|-----------|-------|");
  lines.push("| January | Annual compliance review kickoff | All | DPO |");
  lines.push("| January | Review and update ROPA | GDPR Art. 30 | DPO |");

  if (hasPayment) {
    lines.push("| March | PCI DSS self-assessment questionnaire | PCI DSS | Security Lead |");
  }

  lines.push("| April | Data breach drill / tabletop exercise | GDPR Art. 33-34 | Incident Response Team |");
  lines.push("| June | Mid-year sub-processor audit | GDPR Art. 28 | DPO |");
  lines.push("| July | Employee privacy training refresh | GDPR Art. 39 | HR / DPO |");

  if (hasAnalytics || hasAdvertising) {
    lines.push("| August | Cookie consent mechanism audit | ePrivacy Directive | Marketing / DPO |");
  }

  lines.push("| September | Third-party vendor risk reassessment | GDPR Art. 28 | Procurement / DPO |");
  lines.push("| October | DSAR process review and testing | GDPR Art. 15-22 | DPO |");

  if (hasAI) {
    lines.push("| October | AI system audit and bias review | EU AI Act | AI Governance Lead |");
  }

  lines.push("| November | Security policy and access control review | ISO 27001 / SOC 2 | Security Lead |");
  lines.push("| December | Year-end compliance summary and planning | All | DPO |");
  lines.push("");

  // ── Operational Compliance ─────────────────────────────────────────────
  lines.push("## 4. Operational Compliance Checks");
  lines.push("");

  lines.push("### Data Subject Rights");
  lines.push("");
  lines.push("- [ ] DSAR process tested end-to-end within the past 12 months");
  lines.push("- [ ] Average DSAR response time is within 30-day requirement");
  lines.push("- [ ] All DSAR requests from the past year have been documented");
  lines.push("- [ ] Right to erasure process verified (data actually deleted)");
  lines.push("- [ ] Data portability export format tested");
  lines.push("");

  lines.push("### Data Breach Preparedness");
  lines.push("");
  lines.push("- [ ] Incident response plan reviewed and updated");
  lines.push("- [ ] Breach notification templates are current");
  lines.push("- [ ] 72-hour notification capability tested");
  lines.push("- [ ] Breach register is maintained");
  lines.push("- [ ] All team members know the breach reporting process");
  lines.push("");

  lines.push("### Technical Measures");
  lines.push("");
  lines.push("- [ ] Encryption in transit (TLS/SSL) verified");
  lines.push("- [ ] Encryption at rest verified for all personal data stores");
  lines.push("- [ ] Access control lists reviewed — principle of least privilege");
  lines.push("- [ ] Multi-factor authentication enabled for admin access");
  lines.push("- [ ] Backup and recovery procedures tested");
  lines.push("- [ ] Penetration test conducted within the past 12 months");
  lines.push("- [ ] Dependency vulnerability scan run and critical issues resolved");
  lines.push("");

  lines.push("### Training and Awareness");
  lines.push("");
  lines.push("- [ ] All staff completed data protection awareness training");
  lines.push("- [ ] Engineering team trained on privacy by design principles");
  lines.push("- [ ] Customer support trained on DSAR handling");
  lines.push("- [ ] Incident response team trained on breach procedures");
  lines.push("");

  // ── Third-Party Assessment ─────────────────────────────────────────────
  if (scan.services.length > 0) {
    lines.push("## 5. Third-Party Service Assessment");
    lines.push("");
    lines.push("Review each third-party service for continued compliance:");
    lines.push("");
    lines.push("| Service | Category | DPA in Place | Last Reviewed | Action Needed |");
    lines.push("|---------|----------|-------------|---------------|---------------|");
    for (const svc of scan.services) {
      lines.push(
        `| ${svc.name} | ${svc.category} | - [ ] Yes | [Date] | [None / Update DPA / Replace / Remove] |`
      );
    }
    lines.push("");
  }

  // ── Sign-Off ──────────────────────────────────────────────────────────
  const signOffNum = scan.services.length > 0 ? 6 : 5;
  lines.push(`## ${signOffNum}. Review Sign-Off`);
  lines.push("");
  lines.push("| Role | Name | Date | Signature |");
  lines.push("|------|------|------|-----------|");
  lines.push("| Data Protection Officer | | | |");
  lines.push("| Chief Information Security Officer | | | |");
  lines.push("| Legal Counsel | | | |");
  lines.push("| Chief Technology Officer | | | |");
  lines.push("");

  // ── Review Notes ───────────────────────────────────────────────────────
  lines.push("## Review Notes");
  lines.push("");
  lines.push("### What a lawyer should check");
  lines.push("");
  lines.push("- Ensure the regulatory calendar covers all applicable jurisdictions");
  lines.push("- Verify DSAR response timelines meet local law requirements");
  lines.push("- Confirm breach notification procedures align with all applicable regulations");
  lines.push("- Review third-party DPA status for completeness");
  lines.push("");
  lines.push("### Auto-generated vs. needs human input");
  lines.push("");
  lines.push("| Section | Status | Confidence |");
  lines.push("|---------|--------|------------|");
  lines.push("| Document review list | Auto-generated from detected documents | High |");
  lines.push("| Regulatory calendar | Template with common dates | Medium — customize for jurisdiction |");
  lines.push("| Operational checks | Standard checklist | High |");
  lines.push("| Third-party assessment | Auto-populated from scan | High — services accurate |");
  lines.push("| Sign-off section | Template — needs completion | N/A |");
  lines.push("");

  // ── Related Documents ──────────────────────────────────────────────────
  lines.push("## Related Documents");
  lines.push("");
  lines.push("- Privacy Policy (`PRIVACY_POLICY.md`)");
  lines.push("- Record of Processing Activities (`RECORD_OF_PROCESSING_ACTIVITIES.md`)");
  lines.push("- Compliance Timeline (`COMPLIANCE_TIMELINE.md`)");
  lines.push("- Compliance Notes (`COMPLIANCE_NOTES.md`)");
  lines.push("- Sub-Processor List (`SUBPROCESSOR_LIST.md`)");
  lines.push("- Incident Response Plan (`INCIDENT_RESPONSE_PLAN.md`)");
  lines.push("- DSAR Handling Guide (`DSAR_HANDLING_GUIDE.md`)");
  lines.push("");

  // ── Footer ──────────────────────────────────────────────────────────────
  lines.push("---");
  lines.push("");
  lines.push(
    "*This Annual Review Checklist was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on code analysis. " +
      "It should be customized to reflect your organization's specific compliance obligations and reviewed by legal counsel.*"
  );
  lines.push("");

  return lines.join("\n");
}
