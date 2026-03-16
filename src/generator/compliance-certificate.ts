import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext, GeneratedDocument } from "./index.js";

/**
 * Generates COMPLIANCE_CERTIFICATE.md — a self-attestation certificate
 * showing compliance status. Includes score, date, documents generated,
 * and services covered. Suitable for sharing with partners/customers.
 *
 * Returns null when no services are detected (nothing to certify).
 */
export function generateComplianceCertificate(
  scan: ScanResult,
  ctx: GeneratorContext | undefined,
  docs: GeneratedDocument[],
  score?: { total: number; grade: string },
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const dpoName = ctx?.dpoName || "[Data Protection Officer Name]";
  const dpoEmail = ctx?.dpoEmail || contactEmail;
  const website = ctx?.website || "[https://yoursite.com]";
  const date = new Date().toISOString().split("T")[0];
  const jurisdictions = ctx?.jurisdictions || [];

  const complianceScore = score?.total ?? 0;
  const complianceGrade = score?.grade ?? "N/A";

  // Categorize services
  const categories = new Set<string>();
  for (const svc of scan.services) {
    categories.add(svc.category);
  }

  // Deduplicate services by name for the table
  const seenServices = new Set<string>();
  const uniqueServices: Array<{ name: string; category: string }> = [];
  for (const svc of scan.services) {
    if (!seenServices.has(svc.name)) {
      seenServices.add(svc.name);
      uniqueServices.push({ name: svc.name, category: svc.category });
    }
  }

  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────────
  lines.push("# Compliance Certificate");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("<div align=\"center\">");
  lines.push("");
  lines.push("## Certificate of Compliance Self-Attestation");
  lines.push("");
  lines.push(`### ${company}`);
  lines.push("");
  lines.push(`**Certificate ID:** CODEPLIANT-${date.replace(/-/g, "")}-${scan.projectName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 12)}`);
  lines.push("");
  lines.push(`**Date of Assessment:** ${date}`);
  lines.push("");
  lines.push(`**Project:** ${scan.projectName}`);
  lines.push("");
  lines.push("</div>");
  lines.push("");
  lines.push("---");
  lines.push("");

  // ── Disclaimer ──────────────────────────────────────────────────────────
  lines.push("> **Important:** This is a self-attestation certificate based on automated code analysis. It is not a legal certification and does not replace professional audits, certifications (SOC 2, ISO 27001), or legal advice. It demonstrates that the organization has taken steps toward compliance and has generated the documented policies and procedures listed herein.");
  lines.push("");

  // ── 1. Compliance Summary ───────────────────────────────────────────────
  lines.push("## 1. Compliance Summary");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|--------|-------|");
  lines.push(`| **Organization** | ${company} |`);
  lines.push(`| **Assessment Date** | ${date} |`);
  lines.push(`| **Compliance Score** | ${complianceScore}/100 |`);
  lines.push(`| **Grade** | ${complianceGrade} |`);
  lines.push(`| **Documents Generated** | ${docs.length} |`);
  lines.push(`| **Services Covered** | ${uniqueServices.length} |`);
  lines.push(`| **Data Categories Detected** | ${scan.dataCategories.length} |`);
  lines.push(`| **Service Categories** | ${Array.from(categories).join(", ")} |`);

  if (jurisdictions.length > 0) {
    lines.push(`| **Jurisdictions** | ${jurisdictions.join(", ")} |`);
  }
  lines.push("");

  // ── 2. Compliance Status ────────────────────────────────────────────────
  lines.push("## 2. Compliance Status by Area");
  lines.push("");

  interface ComplianceArea {
    area: string;
    status: string;
    documents: string[];
  }

  const areas: ComplianceArea[] = [];

  // Privacy
  const privacyDocs = docs.filter((d) =>
    ["PRIVACY_POLICY.md", "COOKIE_POLICY.md", "CONSENT_MANAGEMENT_GUIDE.md", "DATA_SUBJECT_CATEGORIES.md", "LAWFUL_BASIS_ASSESSMENT.md"].includes(d.filename),
  );
  if (privacyDocs.length > 0) {
    areas.push({
      area: "Privacy & Data Protection",
      status: privacyDocs.length >= 3 ? "Comprehensive" : "Partial",
      documents: privacyDocs.map((d) => d.name),
    });
  }

  // Security
  const securityDocs = docs.filter((d) =>
    ["SECURITY.md", "INCIDENT_RESPONSE_PLAN.md", "ACCESS_CONTROL_POLICY.md", "ENCRYPTION_POLICY.md", "INFORMATION_SECURITY_POLICY.md"].includes(d.filename),
  );
  if (securityDocs.length > 0) {
    areas.push({
      area: "Information Security",
      status: securityDocs.length >= 3 ? "Comprehensive" : "Partial",
      documents: securityDocs.map((d) => d.name),
    });
  }

  // Third-party management
  const vendorDocs = docs.filter((d) =>
    ["SUBPROCESSOR_LIST.md", "DATA_PROCESSING_AGREEMENT.md", "THIRD_PARTY_RISK_ASSESSMENT.md", "VENDOR_SECURITY_QUESTIONNAIRE.md", "SUPPLIER_CODE_OF_CONDUCT.md"].includes(d.filename),
  );
  if (vendorDocs.length > 0) {
    areas.push({
      area: "Third-Party Management",
      status: vendorDocs.length >= 3 ? "Comprehensive" : "Partial",
      documents: vendorDocs.map((d) => d.name),
    });
  }

  // AI governance
  const aiDocs = docs.filter((d) =>
    ["AI_DISCLOSURE.md", "AI_ACT_CHECKLIST.md", "AI_MODEL_CARD.md", "AI_GOVERNANCE_FRAMEWORK.md", "ACCEPTABLE_AI_USE_POLICY.md"].includes(d.filename),
  );
  if (aiDocs.length > 0) {
    areas.push({
      area: "AI Governance",
      status: aiDocs.length >= 3 ? "Comprehensive" : "Partial",
      documents: aiDocs.map((d) => d.name),
    });
  }

  // Business continuity
  const bcDocs = docs.filter((d) =>
    ["BUSINESS_CONTINUITY_PLAN.md", "DISASTER_RECOVERY_PLAN.md", "BACKUP_POLICY.md"].includes(d.filename),
  );
  if (bcDocs.length > 0) {
    areas.push({
      area: "Business Continuity",
      status: bcDocs.length >= 2 ? "Comprehensive" : "Partial",
      documents: bcDocs.map((d) => d.name),
    });
  }

  // Compliance framework
  const frameworkDocs = docs.filter((d) =>
    ["SOC2_READINESS_CHECKLIST.md", "ISO_27001_CHECKLIST.md", "COMPLIANCE_NOTES.md", "COMPLIANCE_TIMELINE.md", "ANNUAL_REVIEW_CHECKLIST.md"].includes(d.filename),
  );
  if (frameworkDocs.length > 0) {
    areas.push({
      area: "Compliance Framework",
      status: frameworkDocs.length >= 3 ? "Comprehensive" : "Partial",
      documents: frameworkDocs.map((d) => d.name),
    });
  }

  if (areas.length > 0) {
    lines.push("| Compliance Area | Status | Supporting Documents |");
    lines.push("|----------------|--------|---------------------|");
    for (const area of areas) {
      lines.push(`| ${area.area} | ${area.status} | ${area.documents.join(", ")} |`);
    }
    lines.push("");
  }

  // ── 3. Documents Generated ──────────────────────────────────────────────
  lines.push("## 3. Documents Generated");
  lines.push("");
  lines.push("The following compliance documents have been generated for this project:");
  lines.push("");
  lines.push("| # | Document | Filename |");
  lines.push("|---|----------|----------|");
  for (let i = 0; i < docs.length; i++) {
    lines.push(`| ${i + 1} | ${docs[i].name} | \`${docs[i].filename}\` |`);
  }
  lines.push("");

  // ── 4. Services Covered ─────────────────────────────────────────────────
  lines.push("## 4. Services Covered");
  lines.push("");
  lines.push("The following third-party services have been identified and documented:");
  lines.push("");
  lines.push("| Service | Category | Documented |");
  lines.push("|---------|----------|-----------|");
  for (const svc of uniqueServices) {
    lines.push(`| ${svc.name} | ${svc.category} | Yes |`);
  }
  lines.push("");

  // ── 5. Data Categories ──────────────────────────────────────────────────
  if (scan.dataCategories.length > 0) {
    lines.push("## 5. Data Categories Identified");
    lines.push("");
    lines.push("| Category | Sources |");
    lines.push("|----------|---------|");
    for (const cat of scan.dataCategories) {
      lines.push(`| ${cat.category} | ${cat.sources.join(", ")} |`);
    }
    lines.push("");
  }

  // ── 6. Attestation ─────────────────────────────────────────────────────
  const attestationNum = scan.dataCategories.length > 0 ? 6 : 5;
  lines.push(`## ${attestationNum}. Self-Attestation Statement`);
  lines.push("");
  lines.push(`${company} hereby attests that:`);
  lines.push("");
  lines.push("1. The automated code analysis has been conducted on the above-named project");
  lines.push("2. The compliance documents listed above have been generated based on detected services and data processing activities");
  lines.push("3. The organization commits to reviewing all generated documents for accuracy and completeness");
  lines.push("4. The organization will engage legal counsel to validate compliance documents before publication");
  lines.push("5. The organization will maintain and update these documents as services and data processing practices change");
  lines.push("");

  // ── 7. Validity ─────────────────────────────────────────────────────────
  lines.push(`## ${attestationNum + 1}. Validity`);
  lines.push("");
  lines.push("| Field | Details |");
  lines.push("|-------|---------|");
  lines.push(`| **Issue Date** | ${date} |`);
  lines.push(`| **Valid Until** | ${getExpiryDate(date)} |`);
  lines.push("| **Review Frequency** | Annually, or upon significant changes to services or data processing |");
  lines.push("");
  lines.push(
    "This certificate should be renewed by running a fresh compliance scan after the validity period or whenever significant changes are made to the application's data processing activities.",
  );
  lines.push("");

  // ── 8. Signatures ───────────────────────────────────────────────────────
  lines.push(`## ${attestationNum + 2}. Authorized Signatures`);
  lines.push("");
  lines.push("| Role | Name | Date | Signature |");
  lines.push("|------|------|------|-----------|");
  lines.push(`| Data Protection Officer | ${dpoName} | | |`);
  lines.push("| Chief Executive Officer | | | |");
  lines.push("| Chief Technology Officer | | | |");
  lines.push("");

  // ── Contact ─────────────────────────────────────────────────────────────
  lines.push(`## ${attestationNum + 3}. Contact`);
  lines.push("");
  lines.push("For verification of this certificate or questions about our compliance posture:");
  lines.push("");
  lines.push(`- **Email:** ${contactEmail}`);
  lines.push(`- **DPO:** ${dpoEmail}`);
  lines.push(`- **Website:** ${website}`);
  lines.push("");

  // ── Footer ──────────────────────────────────────────────────────────────
  lines.push("---");
  lines.push("");
  lines.push(
    "*This Compliance Certificate was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. " +
      "It is a self-attestation document and does not constitute a legal certification. Organizations should obtain professional audits and legal review for formal compliance certification.*",
  );
  lines.push("");

  return lines.join("\n");
}

/** Calculate expiry date — one year from issue date. */
function getExpiryDate(isoDate: string): string {
  const d = new Date(isoDate);
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0];
}
