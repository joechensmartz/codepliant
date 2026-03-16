import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext, GeneratedDocument } from "./index.js";

/**
 * Generates COMPLIANCE_OATH.md — a management commitment statement
 * signed by CEO/CTO acknowledging compliance responsibilities.
 * Required by some frameworks (ISO 27001 management commitment,
 * GDPR accountability principle Art. 5(2)).
 *
 * Returns null when no services are detected.
 */
export function generateComplianceOath(
  scan: ScanResult,
  ctx: GeneratorContext | undefined,
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const dpoName = ctx?.dpoName || "[Data Protection Officer Name]";
  const dpoEmail = ctx?.dpoEmail || contactEmail;
  const website = ctx?.website || "[https://yoursite.com]";
  const date = new Date().toISOString().split("T")[0];
  const jurisdictions = ctx?.jurisdictions || [];

  // Categorize detected services
  const categories = new Set<string>();
  for (const svc of scan.services) {
    categories.add(svc.category);
  }

  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasAnalytics = scan.services.some((s) => s.category === "analytics");
  const hasAuth = scan.services.some((s) => s.category === "auth");

  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────────
  lines.push("# Compliance Oath");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("<div align=\"center\">");
  lines.push("");
  lines.push("## Management Commitment Statement");
  lines.push("");
  lines.push(`### ${company}`);
  lines.push("");
  lines.push(`**Document ID:** OATH-${date.replace(/-/g, "")}-${scan.projectName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 12)}`);
  lines.push("");
  lines.push(`**Effective Date:** ${date}`);
  lines.push("");
  lines.push(`**Project:** ${scan.projectName}`);
  lines.push("");
  lines.push("</div>");
  lines.push("");
  lines.push("---");
  lines.push("");

  // ── Disclaimer ──────────────────────────────────────────────────────────
  lines.push("> **Important:** This document is a statement of management commitment to information security and data protection compliance. It should be reviewed by legal counsel, signed by authorized executives, and maintained as a controlled document. This template is auto-generated and must be customized to reflect your organization's specific commitments.");
  lines.push("");

  // ── 1. Purpose ──────────────────────────────────────────────────────────
  lines.push("## 1. Purpose");
  lines.push("");
  lines.push(`This Compliance Oath establishes the commitment of ${company}'s senior management to:`);
  lines.push("");
  lines.push("- Maintaining an effective information security management system (ISMS)");
  lines.push("- Protecting the personal data of our users, customers, employees, and partners");
  lines.push("- Complying with all applicable data protection and privacy regulations");
  lines.push("- Fostering a culture of security and privacy awareness throughout the organization");
  lines.push("- Allocating adequate resources for compliance activities");
  lines.push("");

  // ── 2. Scope ────────────────────────────────────────────────────────────
  lines.push("## 2. Scope");
  lines.push("");
  lines.push("This commitment applies to:");
  lines.push("");
  lines.push(`- **Project:** ${scan.projectName}`);
  lines.push(`- **Services covered:** ${scan.services.length} third-party services across ${categories.size} categories`);
  lines.push(`- **Service categories:** ${Array.from(categories).join(", ")}`);

  if (jurisdictions.length > 0) {
    lines.push(`- **Jurisdictions:** ${jurisdictions.join(", ")}`);
  }

  lines.push("- **All employees, contractors, and third parties** with access to systems or data");
  lines.push("");

  // ── 3. Management Commitment ────────────────────────────────────────────
  lines.push("## 3. Management Commitment");
  lines.push("");
  lines.push(`The senior leadership of ${company} hereby commits to the following:`);
  lines.push("");

  lines.push("### 3.1 Information Security (ISO 27001 Clause 5.1)");
  lines.push("");
  lines.push("- **Leadership and Direction:** Ensuring the information security policy and objectives are established and compatible with the strategic direction of the organization");
  lines.push("- **Integration:** Ensuring information security requirements are integrated into the organization's processes");
  lines.push("- **Resources:** Ensuring adequate resources are available for the ISMS");
  lines.push("- **Communication:** Communicating the importance of effective information security management");
  lines.push("- **Outcomes:** Ensuring the ISMS achieves its intended outcomes");
  lines.push("- **Continual Improvement:** Directing and supporting persons to contribute to the effectiveness of the ISMS");
  lines.push("");

  lines.push("### 3.2 Data Protection (GDPR Art. 5(2) Accountability)");
  lines.push("");
  lines.push("- **Lawful Processing:** Ensuring all personal data processing has a valid legal basis");
  lines.push("- **Transparency:** Maintaining clear and accessible privacy notices for all data subjects");
  lines.push("- **Data Minimization:** Collecting only the data necessary for specified purposes");
  lines.push("- **Accuracy:** Taking reasonable steps to ensure personal data is accurate and up to date");
  lines.push("- **Storage Limitation:** Retaining personal data only for as long as necessary");
  lines.push("- **Integrity and Confidentiality:** Implementing appropriate technical and organizational measures to protect personal data");
  lines.push("- **Accountability:** Being able to demonstrate compliance with all data protection principles");
  lines.push("");

  // ── 4. Specific Commitments ─────────────────────────────────────────────
  lines.push("## 4. Specific Commitments");
  lines.push("");

  lines.push("### 4.1 Governance");
  lines.push("");
  lines.push("| Commitment | Frequency | Responsible |");
  lines.push("|-----------|-----------|-------------|");
  lines.push("| Review and approve information security policy | Annually | CEO |");
  lines.push("| Review compliance posture and risk register | Quarterly | CTO |");
  lines.push("| Conduct management review of ISMS | Annually | CEO + CTO |");
  lines.push("| Review and approve data processing activities | Annually | DPO |");
  lines.push("| Audit third-party sub-processors | Annually | CTO |");
  lines.push("| Review incident response readiness | Semi-annually | CTO |");
  lines.push("| Approve compliance budget and resources | Annually | CEO |");
  lines.push("");

  lines.push("### 4.2 Resource Allocation");
  lines.push("");
  lines.push("Management commits to providing:");
  lines.push("");
  lines.push("- **Personnel:** Dedicated compliance/security resources appropriate to organization size");
  lines.push("- **Training:** Annual security awareness training for all staff");
  lines.push("- **Tools:** Industry-standard security and compliance tools");
  lines.push("- **External Support:** Budget for legal counsel, auditors, and consultants as needed");
  lines.push("- **Incident Response:** Resources for 24/7 incident response capability");
  lines.push("");

  // Service-specific commitments
  lines.push("### 4.3 Service-Specific Commitments");
  lines.push("");

  if (hasAI) {
    lines.push("#### AI Systems");
    lines.push("");
    lines.push("- Maintain an AI governance framework aligned with the EU AI Act");
    lines.push("- Conduct AI impact assessments for all AI-powered features");
    lines.push("- Ensure transparency in AI decision-making processes");
    lines.push("- Provide human oversight mechanisms for automated decisions");
    lines.push("- Review AI model cards and training data practices quarterly");
    lines.push("");
  }

  if (hasPayment) {
    lines.push("#### Payment Processing");
    lines.push("");
    lines.push("- Maintain PCI DSS compliance for all payment operations");
    lines.push("- Never store raw credit card data on our systems");
    lines.push("- Conduct quarterly vulnerability scans on payment-related systems");
    lines.push("- Review payment processor agreements and DPAs annually");
    lines.push("");
  }

  if (hasAnalytics) {
    lines.push("#### Analytics and Tracking");
    lines.push("");
    lines.push("- Implement proper consent mechanisms before collecting analytics data");
    lines.push("- Minimize data collection to what is strictly necessary");
    lines.push("- Review analytics data retention policies quarterly");
    lines.push("- Ensure analytics configurations respect user privacy preferences (DNT, GPC)");
    lines.push("");
  }

  if (hasAuth) {
    lines.push("#### Authentication and Identity");
    lines.push("");
    lines.push("- Implement industry-standard authentication practices (MFA, secure password hashing)");
    lines.push("- Review access control policies quarterly");
    lines.push("- Conduct access reviews for privileged accounts monthly");
    lines.push("- Maintain audit logs for all authentication events");
    lines.push("");
  }

  // ── 5. Regulatory Compliance ────────────────────────────────────────────
  lines.push("## 5. Regulatory Compliance");
  lines.push("");
  lines.push("Management commits to compliance with the following regulations and frameworks:");
  lines.push("");

  lines.push("| Regulation / Framework | Applicability | Commitment |");
  lines.push("|----------------------|--------------|------------|");
  lines.push("| **GDPR** (EU) | Personal data of EU residents | Full compliance with all articles |");
  lines.push("| **CCPA/CPRA** (California) | Personal information of CA consumers | Full compliance with consumer rights |");

  if (hasAI) {
    lines.push("| **EU AI Act** | AI systems used in the application | Risk assessment, disclosure, human oversight |");
  }

  if (hasPayment) {
    lines.push("| **PCI DSS** | Payment card data processing | Maintain appropriate SAQ level |");
  }

  lines.push("| **ISO 27001** | Information security management | Alignment with Annex A controls |");
  lines.push("| **SOC 2** | Service organization controls | Maintain Trust Service Criteria |");

  if (jurisdictions.includes("uk-gdpr")) {
    lines.push("| **UK GDPR** | Personal data of UK residents | Full compliance |");
  }

  lines.push("");

  // ── 6. Breach Response Commitment ───────────────────────────────────────
  lines.push("## 6. Breach Response Commitment");
  lines.push("");
  lines.push("In the event of a personal data breach, management commits to:");
  lines.push("");
  lines.push("1. **72-hour notification** to the relevant supervisory authority (GDPR Art. 33)");
  lines.push("2. **Undue delay notification** to affected data subjects when the breach poses a high risk (GDPR Art. 34)");
  lines.push("3. **Full cooperation** with supervisory authorities during investigations");
  lines.push("4. **Post-incident review** within 14 days of any security incident");
  lines.push("5. **Remediation** of root causes and implementation of preventive measures");
  lines.push("6. **Transparent communication** with affected parties throughout the incident lifecycle");
  lines.push("");

  // ── 7. Continuous Improvement ───────────────────────────────────────────
  lines.push("## 7. Continuous Improvement");
  lines.push("");
  lines.push("Management commits to:");
  lines.push("");
  lines.push("- **Annual compliance audits** (internal or external)");
  lines.push("- **Quarterly compliance reviews** of policies and procedures");
  lines.push("- **Prompt remediation** of identified compliance gaps");
  lines.push("- **Tracking regulatory changes** and updating practices accordingly");
  lines.push("- **Benchmarking** against industry best practices");
  lines.push("- **Incorporating lessons learned** from incidents, audits, and industry events");
  lines.push("");

  // ── 8. Accountability ──────────────────────────────────────────────────
  lines.push("## 8. Accountability");
  lines.push("");
  lines.push("| Role | Responsibilities |");
  lines.push("|------|-----------------|");
  lines.push("| **CEO** | Overall accountability for compliance; approves policies, budget, and risk appetite |");
  lines.push("| **CTO** | Technical implementation of security controls; infrastructure and application security |");
  lines.push("| **DPO** | Monitoring compliance with data protection laws; advising on obligations; point of contact for supervisory authorities |");
  lines.push("| **Engineering Leads** | Implementing security-by-design and privacy-by-design in development processes |");
  lines.push("| **All Employees** | Following security policies; reporting incidents; completing training |");
  lines.push("");

  // ── 9. Signatures ──────────────────────────────────────────────────────
  lines.push("## 9. Signatures");
  lines.push("");
  lines.push("By signing below, the undersigned executives acknowledge their understanding of and commitment to the obligations described in this document.");
  lines.push("");
  lines.push("### Chief Executive Officer");
  lines.push("");
  lines.push("| Field | Details |");
  lines.push("|-------|---------|");
  lines.push("| **Name** | _________________________ |");
  lines.push("| **Title** | Chief Executive Officer |");
  lines.push(`| **Date** | ${date} |`);
  lines.push("| **Signature** | _________________________ |");
  lines.push("");

  lines.push("### Chief Technology Officer");
  lines.push("");
  lines.push("| Field | Details |");
  lines.push("|-------|---------|");
  lines.push("| **Name** | _________________________ |");
  lines.push("| **Title** | Chief Technology Officer |");
  lines.push(`| **Date** | ${date} |`);
  lines.push("| **Signature** | _________________________ |");
  lines.push("");

  lines.push("### Data Protection Officer");
  lines.push("");
  lines.push("| Field | Details |");
  lines.push("|-------|---------|");
  lines.push(`| **Name** | ${dpoName} |`);
  lines.push("| **Title** | Data Protection Officer |");
  lines.push(`| **Email** | ${dpoEmail} |`);
  lines.push(`| **Date** | ${date} |`);
  lines.push("| **Signature** | _________________________ |");
  lines.push("");

  // ── 10. Review Schedule ─────────────────────────────────────────────────
  lines.push("## 10. Review Schedule");
  lines.push("");
  lines.push("| Field | Details |");
  lines.push("|-------|---------|");
  lines.push(`| **Effective Date** | ${date} |`);
  lines.push(`| **Next Review Date** | ${getAnnualReviewDate(date)} |`);
  lines.push("| **Review Frequency** | Annually, or upon material changes to services or regulatory requirements |");
  lines.push(`| **Document Owner** | ${company} |`);
  lines.push("");

  // ── Contact ─────────────────────────────────────────────────────────────
  lines.push("## 11. Contact");
  lines.push("");
  lines.push("For questions about this commitment or our compliance program:");
  lines.push("");
  lines.push(`- **Email:** ${contactEmail}`);
  lines.push(`- **DPO:** ${dpoEmail}`);
  lines.push(`- **Website:** ${website}`);
  lines.push("");

  // ── Footer ──────────────────────────────────────────────────────────────
  lines.push("---");
  lines.push("");
  lines.push(
    "*This Compliance Oath was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. " +
      "It is a template document and must be reviewed, customized, and signed by authorized executives before it constitutes a binding commitment. " +
      "Organizations should engage legal counsel to ensure this document meets their specific regulatory obligations.*",
  );
  lines.push("");

  return lines.join("\n");
}

/** Calculate annual review date — one year from effective date. */
function getAnnualReviewDate(isoDate: string): string {
  const d = new Date(isoDate);
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0];
}
