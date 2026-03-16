import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates VENDOR_SECURITY_QUESTIONNAIRE.md — a pre-answered security
 * questionnaire in SIG Lite format, based on detected security controls.
 *
 * Useful for enterprise sales: customers often require vendors to complete
 * a security questionnaire before procurement.
 *
 * Returns null when no services are detected.
 */
export function generateVendorSecurityQuestionnaire(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const securityEmail = ctx?.securityEmail || contactEmail;
  const dpoName = ctx?.dpoName || "[Data Protection Officer Name]";
  const dpoEmail = ctx?.dpoEmail || "[dpo@example.com]";
  const website = ctx?.website || "[https://yoursite.com]";
  const date = new Date().toISOString().split("T")[0];

  // Detect capabilities from scan results
  const hasAuth = scan.services.some((s) => s.category === "auth");
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasMonitoring = scan.services.some((s) => s.category === "monitoring");
  const hasDatabase = scan.services.some((s) => s.category === "database");
  const hasStorage = scan.services.some((s) => s.category === "storage");
  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasAnalytics = scan.services.some((s) => s.category === "analytics");
  const hasEncryption = scan.services.some((s) =>
    s.name.includes("kms") || s.name.includes("crypto")
  );

  const thirdPartyCount = scan.services.filter((s) => s.isDataProcessor !== false).length;

  const sections: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────
  sections.push("# Vendor Security Questionnaire");
  sections.push("");
  sections.push(`**Vendor:** ${company}`);
  sections.push("");
  sections.push(`**Completed by:** [NAME / TITLE]`);
  sections.push("");
  sections.push(`**Date:** ${date}`);
  sections.push("");
  sections.push(`**Contact:** ${securityEmail}`);
  sections.push("");
  sections.push(
    "This questionnaire follows the SIG Lite (Standardized Information Gathering) format " +
    "and has been pre-populated based on automated analysis of the codebase. " +
    "Review and update all answers before submitting to customers."
  );
  sections.push("");
  sections.push("> **Legend:** Answers prefixed with `[AUTO]` were derived from code analysis. " +
    "Answers prefixed with `[MANUAL]` require human input.");

  // ── 1. Company Information ──────────────────────────────────────────
  sections.push("");
  sections.push("## 1. Company Information");
  sections.push("");
  sections.push("| Question | Answer |");
  sections.push("|----------|--------|");
  sections.push(`| Company legal name | ${company} |`);
  sections.push(`| Company website | ${website} |`);
  sections.push(`| Primary security contact | ${securityEmail} |`);
  sections.push(`| Data Protection Officer | ${dpoName} (${dpoEmail}) |`);
  sections.push("| Company headquarters location | [MANUAL] [LOCATION] |");
  sections.push("| Number of employees | [MANUAL] |");
  sections.push("| Year founded | [MANUAL] |");
  sections.push("| Do you carry cyber liability insurance? | [MANUAL] Yes / No |");

  // ── 2. Security Governance ──────────────────────────────────────────
  sections.push("");
  sections.push("## 2. Security Governance");
  sections.push("");
  sections.push("| Question | Answer |");
  sections.push("|----------|--------|");
  sections.push("| Do you have a dedicated security team? | [MANUAL] Yes / No |");
  sections.push("| Do you have a written information security policy? | [MANUAL] Yes / No |");
  sections.push("| Do you conduct regular security awareness training? | [MANUAL] Yes / No |");
  sections.push("| Do you have an incident response plan? | [AUTO] Yes — generated as part of compliance documentation |");
  sections.push("| Do you conduct regular risk assessments? | [MANUAL] Yes / No |");
  sections.push("| Do you have a business continuity / disaster recovery plan? | [MANUAL] Yes / No |");

  // ── 3. Certifications & Compliance ──────────────────────────────────
  sections.push("");
  sections.push("## 3. Certifications & Compliance");
  sections.push("");
  sections.push("| Question | Answer |");
  sections.push("|----------|--------|");
  sections.push("| SOC 2 Type I or II certification? | [MANUAL] Yes / No — Type: __ |");
  sections.push("| ISO 27001 certified? | [MANUAL] Yes / No |");
  sections.push("| GDPR compliant? | [AUTO] Compliance documentation generated — [MANUAL] confirm operational compliance |");
  if (hasPayment) {
    sections.push("| PCI DSS compliant? | [AUTO] Payment processing detected (via Stripe/PayPal) — payments are handled by PCI-compliant third party |");
  } else {
    sections.push("| PCI DSS compliant? | [AUTO] No payment processing detected — N/A |");
  }
  sections.push("| HIPAA compliant? | [MANUAL] Yes / No / N/A |");
  sections.push("| Do you undergo regular third-party penetration testing? | [MANUAL] Yes / No — Frequency: __ |");
  sections.push("| Do you have a bug bounty or vulnerability disclosure program? | [MANUAL] Yes / No |");

  // ── 4. Access Control ───────────────────────────────────────────────
  sections.push("");
  sections.push("## 4. Access Control");
  sections.push("");
  sections.push("| Question | Answer |");
  sections.push("|----------|--------|");
  if (hasAuth) {
    const authServices = scan.services.filter((s) => s.category === "auth").map((s) => s.name);
    sections.push(`| Do you require authentication for access? | [AUTO] Yes — authentication implemented via ${authServices.join(", ")} |`);
  } else {
    sections.push("| Do you require authentication for access? | [MANUAL] Yes / No |");
  }
  sections.push("| Do you support multi-factor authentication (MFA)? | [MANUAL] Yes / No |");
  sections.push("| Do you enforce role-based access control (RBAC)? | [MANUAL] Yes / No |");
  sections.push("| Do you enforce least-privilege access? | [MANUAL] Yes / No |");
  sections.push("| How are user sessions managed? | [MANUAL] [DESCRIBE SESSION MANAGEMENT] |");
  sections.push("| Do you support Single Sign-On (SSO)? | [MANUAL] Yes / No — Protocol: SAML / OIDC |");
  sections.push("| Do you log all access events? | [MANUAL] Yes / No |");

  // ── 5. Data Protection ──────────────────────────────────────────────
  sections.push("");
  sections.push("## 5. Data Protection");
  sections.push("");
  sections.push("| Question | Answer |");
  sections.push("|----------|--------|");
  sections.push("| Is data encrypted at rest? | [MANUAL] Yes / No — Algorithm: __ |");
  sections.push("| Is data encrypted in transit? | [AUTO] Yes — HTTPS/TLS required for all communications |");
  if (hasDatabase) {
    const dbServices = scan.services.filter((s) => s.category === "database").map((s) => s.name);
    sections.push(`| Where is data stored? | [AUTO] Database services detected: ${dbServices.join(", ")} — [MANUAL] specify hosting region |`);
  } else {
    sections.push("| Where is data stored? | [MANUAL] [DESCRIBE DATA STORAGE] |");
  }
  if (hasStorage) {
    const storageServices = scan.services.filter((s) => s.category === "storage").map((s) => s.name);
    sections.push(`| Do you use cloud storage? | [AUTO] Yes — ${storageServices.join(", ")} detected |`);
  }
  if (hasEncryption) {
    sections.push("| Do you use a key management service? | [AUTO] Yes — KMS service detected |");
  } else {
    sections.push("| Do you use a key management service? | [MANUAL] Yes / No |");
  }
  sections.push("| Do you have a data retention policy? | [AUTO] Yes — generated as part of compliance documentation |");
  sections.push("| Do you have a data classification scheme? | [AUTO] Yes — data classification report generated |");
  sections.push("| Can you delete customer data on request? | [MANUAL] Yes / No — Process: __ |");
  sections.push("| Do you have a data backup strategy? | [MANUAL] Yes / No — Frequency: __ |");

  // ── 6. Application Security ─────────────────────────────────────────
  sections.push("");
  sections.push("## 6. Application Security");
  sections.push("");
  sections.push("| Question | Answer |");
  sections.push("|----------|--------|");
  sections.push("| Do you follow a secure software development lifecycle (SDLC)? | [MANUAL] Yes / No |");
  sections.push("| Do you conduct code reviews? | [MANUAL] Yes / No |");
  sections.push("| Do you perform static application security testing (SAST)? | [MANUAL] Yes / No |");
  sections.push("| Do you perform dynamic application security testing (DAST)? | [MANUAL] Yes / No |");
  sections.push("| Do you scan dependencies for known vulnerabilities? | [AUTO] Yes — dependency vulnerability scanning is part of the compliance process |");
  if (hasMonitoring) {
    const monitoringServices = scan.services.filter((s) => s.category === "monitoring").map((s) => s.name);
    sections.push(`| Do you use error monitoring / observability? | [AUTO] Yes — ${monitoringServices.join(", ")} |`);
  } else {
    sections.push("| Do you use error monitoring / observability? | [MANUAL] Yes / No |");
  }
  sections.push("| Do you have a WAF (Web Application Firewall)? | [MANUAL] Yes / No |");
  sections.push("| Do you protect against OWASP Top 10 vulnerabilities? | [MANUAL] Yes / No |");

  // ── 7. Infrastructure Security ──────────────────────────────────────
  sections.push("");
  sections.push("## 7. Infrastructure Security");
  sections.push("");
  sections.push("| Question | Answer |");
  sections.push("|----------|--------|");
  sections.push("| Where is your application hosted? | [MANUAL] [CLOUD PROVIDER / REGION] |");
  sections.push("| Do you use a CDN? | [MANUAL] Yes / No |");
  sections.push("| Do you use container orchestration? | [MANUAL] Yes / No |");
  sections.push("| Do you have network segmentation? | [MANUAL] Yes / No |");
  sections.push("| Do you use intrusion detection / prevention systems? | [MANUAL] Yes / No |");
  sections.push("| Do you perform regular vulnerability scanning of infrastructure? | [MANUAL] Yes / No — Frequency: __ |");

  // ── 8. Third-Party Risk Management ──────────────────────────────────
  sections.push("");
  sections.push("## 8. Third-Party Risk Management");
  sections.push("");
  sections.push("| Question | Answer |");
  sections.push("|----------|--------|");
  sections.push(`| How many third-party sub-processors do you use? | [AUTO] ${thirdPartyCount} sub-processor(s) detected |`);
  sections.push("| Do you maintain a sub-processor list? | [AUTO] Yes — generated as part of compliance documentation |");
  sections.push("| Do you have DPAs with all sub-processors? | [MANUAL] Yes / No |");
  sections.push("| Do you assess the security posture of sub-processors? | [MANUAL] Yes / No |");
  sections.push("| Do you notify customers of sub-processor changes? | [MANUAL] Yes / No |");

  // ── 9. Incident Response ────────────────────────────────────────────
  sections.push("");
  sections.push("## 9. Incident Response");
  sections.push("");
  sections.push("| Question | Answer |");
  sections.push("|----------|--------|");
  sections.push("| Do you have a documented incident response plan? | [AUTO] Yes — incident response plan generated |");
  sections.push("| What is your breach notification timeline? | [AUTO] Within 72 hours (GDPR), within 30-60 days (US state laws) |");
  sections.push("| Do you conduct post-incident reviews? | [MANUAL] Yes / No |");
  sections.push("| Do you have a dedicated incident response team? | [MANUAL] Yes / No |");
  sections.push(`| Security incident reporting email | ${securityEmail} |`);

  // ── 10. AI & Machine Learning ───────────────────────────────────────
  if (hasAI) {
    sections.push("");
    sections.push("## 10. AI & Machine Learning");
    sections.push("");
    const aiServices = scan.services.filter((s) => s.category === "ai").map((s) => s.name);
    sections.push("| Question | Answer |");
    sections.push("|----------|--------|");
    sections.push(`| Does the application use AI/ML services? | [AUTO] Yes — ${aiServices.join(", ")} |`);
    sections.push("| What data is sent to AI services? | [AUTO] " +
      scan.services.filter((s) => s.category === "ai")
        .flatMap((s) => s.dataCollected)
        .filter((v, i, a) => a.indexOf(v) === i)
        .join(", ") + " |"
    );
    sections.push("| Is AI-generated content identified to users? | [MANUAL] Yes / No |");
    sections.push("| Do you have safeguards against AI bias? | [MANUAL] Yes / No |");
    sections.push("| Can customers opt out of AI processing? | [MANUAL] Yes / No |");
    sections.push("| Do AI providers use customer data for training? | [MANUAL] Yes / No — [VERIFY WITH EACH PROVIDER] |");
  }

  // ── 11. Privacy & Data Subject Rights ───────────────────────────────
  const privacySectionNum = hasAI ? 11 : 10;
  sections.push("");
  sections.push(`## ${privacySectionNum}. Privacy & Data Subject Rights`);
  sections.push("");
  sections.push("| Question | Answer |");
  sections.push("|----------|--------|");
  sections.push("| Do you have a published privacy policy? | [AUTO] Yes — generated as part of compliance documentation |");
  sections.push("| Do you support data subject access requests (DSAR)? | [AUTO] DSAR handling guide generated |");
  sections.push("| Do you support the right to erasure? | [MANUAL] Yes / No — Process: __ |");
  sections.push("| Do you support data portability? | [MANUAL] Yes / No — Format: __ |");
  if (hasAnalytics) {
    sections.push("| Do you obtain consent for analytics/tracking? | [MANUAL] Yes / No — [AUTO] consent management guide generated |");
  }
  sections.push("| Do you process data of minors (under 16)? | [MANUAL] Yes / No |");

  // ── Disclaimer ─────────────────────────────────────────────────────
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push(
    `*This vendor security questionnaire was generated by [Codepliant](https://github.com/joechensmartz/codepliant) ` +
    `based on an automated scan of the **${scan.projectName}** codebase. ` +
    `Answers marked [AUTO] are derived from code analysis and should be verified. ` +
    `Answers marked [MANUAL] require input from your security and compliance teams. ` +
    `This document is not a substitute for a formal security assessment.*`
  );
  sections.push("");

  return sections.join("\n");
}
