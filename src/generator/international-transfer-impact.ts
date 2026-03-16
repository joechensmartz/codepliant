import type { ScanResult, DetectedService } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

// ── US-based service registry ──────────────────────────────────────────────

const US_BASED_SERVICES = new Set([
  // AI
  "openai", "@anthropic-ai/sdk", "@google/generative-ai", "replicate", "together-ai",
  "cohere", "@pinecone-database/pinecone", "@vercel/ai", "@ai-sdk/openai",
  "@ai-sdk/anthropic", "@ai-sdk/google", "@ai-sdk/google-vertex",
  // Payment
  "stripe", "@paypal/checkout-server-sdk", "plaid",
  // Analytics
  "@google-analytics/data", "posthog", "mixpanel", "@amplitude/analytics-browser",
  "@vercel/analytics", "hotjar", "@segment/analytics-next",
  "launchdarkly-js-client-sdk", "@launchdarkly/node-server-sdk",
  // Auth
  "next-auth", "@clerk/nextjs", "@auth/core", "@supabase/supabase-js",
  // Email
  "@sendgrid/mail", "resend", "postmark", "@mailchimp/mailchimp_marketing",
  "@mailchimp/mailchimp_transactional",
  // Storage
  "@aws-sdk/client-s3", "@uploadthing/react", "cloudinary",
  "@google-cloud/storage",
  // Monitoring
  "@sentry/node", "@sentry/nextjs", "@sentry/react", "dd-trace",
  // Database
  "firebase", "firebase-admin", "@upstash/redis",
  // Other
  "twilio", "@twilio/voice-sdk", "intercom", "@intercom/messenger-js-sdk",
  "@hubspot/api-client", "algoliasearch", "googleapis",
  "@onesignal/node-onesignal", "@cloudflare/workers-types",
]);

const EU_JURISDICTIONS = [
  "eu", "gdpr", "germany", "france", "spain", "italy", "netherlands",
  "belgium", "austria", "ireland", "portugal", "sweden", "denmark",
  "finland", "poland", "czech", "romania", "hungary", "greece",
  "croatia", "bulgaria", "slovakia", "slovenia", "latvia",
  "lithuania", "estonia", "luxembourg", "malta", "cyprus",
  "eea", "european union", "europe",
];

// ── Generator ──────────────────────────────────────────────────────────────

function isEuJurisdiction(ctx?: GeneratorContext): boolean {
  if (!ctx) return false;

  const jurisdiction = ctx.jurisdiction?.toLowerCase() || "";
  if (EU_JURISDICTIONS.some((eu) => jurisdiction.includes(eu))) return true;

  if (ctx.jurisdictions) {
    return ctx.jurisdictions.some((j) =>
      EU_JURISDICTIONS.some((eu) => j.toLowerCase().includes(eu))
    );
  }

  return false;
}

function getUsServices(scan: ScanResult): DetectedService[] {
  return scan.services.filter(
    (s) => s.isDataProcessor !== false && US_BASED_SERVICES.has(s.name)
  );
}

/**
 * Generates TRANSFER_IMPACT_ASSESSMENT.md — Schrems II compliant assessment
 * for EU-to-US data transfers. Only generated when:
 * 1. EU jurisdiction is configured
 * 2. US-based services are detected
 */
export function generateTransferImpactAssessment(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  if (!isEuJurisdiction(ctx)) return null;

  const usServices = getUsServices(scan);
  if (usServices.length === 0) return null;

  const companyName = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const dpoName = ctx?.dpoName || "[Data Protection Officer Name]";
  const date = new Date().toISOString().split("T")[0];

  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────────
  lines.push("# Transfer Impact Assessment");
  lines.push("");
  lines.push(`> **${companyName}** — International Data Transfer Impact Assessment`);
  lines.push(`>`);
  lines.push(`> Prepared in accordance with GDPR Chapter V and the *Schrems II* ruling (CJEU C-311/18)`);
  lines.push(`>`);
  lines.push(`> Assessment date: ${date}`);
  lines.push("");

  // ── 1. Overview ─────────────────────────────────────────────────────────
  lines.push("## 1. Assessment Overview");
  lines.push("");
  lines.push(
    `This Transfer Impact Assessment (TIA) evaluates the risks associated with transferring personal data from the European Economic Area (EEA) to the United States through third-party services used by **${companyName}**. ` +
      `This assessment is required following the Court of Justice of the European Union (CJEU) ruling in *Data Protection Commissioner v. Facebook Ireland Ltd and Maximillian Schrems* (Case C-311/18, "Schrems II").`
  );
  lines.push("");

  lines.push("| Field | Details |");
  lines.push("|-------|---------|");
  lines.push(`| **Data Exporter** | ${companyName} |`);
  lines.push(`| **Exporter Contact** | ${contactEmail} |`);
  lines.push(`| **DPO** | ${dpoName} |`);
  lines.push(`| **Importing Country** | United States |`);
  lines.push(`| **Transfer Mechanism** | Standard Contractual Clauses (SCCs) / EU-US Data Privacy Framework |`);
  lines.push(`| **Number of US-based Services** | ${usServices.length} |`);
  lines.push(`| **Assessment Date** | ${date} |`);
  lines.push("");

  // ── 2. US-Based Services Identified ─────────────────────────────────────
  lines.push("## 2. US-Based Services Identified");
  lines.push("");
  lines.push("The following US-based third-party services have been detected in the codebase:");
  lines.push("");

  lines.push("| Service | Category | Data Transferred | Transfer Mechanism | DPF Certified |");
  lines.push("|---------|----------|------------------|--------------------|---------------|");

  for (const svc of usServices) {
    const dataTransferred = svc.dataCollected.slice(0, 3).join(", ");
    lines.push(
      `| ${svc.name} | ${svc.category} | ${dataTransferred} | SCCs / DPF | [Verify] |`
    );
  }
  lines.push("");

  // ── 3. Legal Framework Assessment ───────────────────────────────────────
  lines.push("## 3. Legal Framework Assessment");
  lines.push("");
  lines.push("### 3.1 EU-US Data Privacy Framework (DPF)");
  lines.push("");
  lines.push(
    "The EU-US Data Privacy Framework was adopted by the European Commission on July 10, 2023 (Adequacy Decision C(2023) 4745). " +
      "US companies certified under the DPF provide an adequate level of data protection for transfers from the EEA."
  );
  lines.push("");
  lines.push("**Action Required:** Verify each service provider's DPF certification status at [dataprivacyframework.gov](https://www.dataprivacyframework.gov/list).");
  lines.push("");

  lines.push("### 3.2 Standard Contractual Clauses (SCCs)");
  lines.push("");
  lines.push(
    "Where a service provider is not DPF-certified, Standard Contractual Clauses (Commission Implementing Decision (EU) 2021/914) must be in place. " +
      "SCCs alone may not be sufficient without supplementary measures, per the Schrems II ruling."
  );
  lines.push("");

  lines.push("### 3.3 Supplementary Measures");
  lines.push("");
  lines.push("The following supplementary measures should be implemented where SCCs are relied upon:");
  lines.push("");
  lines.push("- [ ] **Encryption in transit** — TLS 1.2+ for all data transfers");
  lines.push("- [ ] **Encryption at rest** — Data encrypted at rest with keys controlled by the data exporter where possible");
  lines.push("- [ ] **Pseudonymization** — Personal identifiers replaced with pseudonyms before transfer where feasible");
  lines.push("- [ ] **Data minimization** — Only necessary data transferred to each service");
  lines.push("- [ ] **Access controls** — Strict access controls limiting who can access transferred data");
  lines.push("- [ ] **Audit rights** — Contractual right to audit the data importer's compliance");
  lines.push("- [ ] **Breach notification** — Contractual obligation for prompt breach notification");
  lines.push("");

  // ── 4. US Surveillance Law Assessment ───────────────────────────────────
  lines.push("## 4. US Surveillance Law Assessment");
  lines.push("");
  lines.push("### 4.1 FISA Section 702");
  lines.push("");
  lines.push(
    "Section 702 of the Foreign Intelligence Surveillance Act allows US intelligence agencies to collect communications of non-US persons located outside the US. " +
      "The DPF includes safeguards through Executive Order 14086 (October 7, 2022), which establishes:"
  );
  lines.push("");
  lines.push("- Necessity and proportionality requirements for US signals intelligence");
  lines.push("- A redress mechanism through the Data Protection Review Court (DPRC)");
  lines.push("- Limitations on bulk collection of personal data");
  lines.push("");

  lines.push("### 4.2 Risk Assessment by Service Category");
  lines.push("");

  const categories = [...new Set(usServices.map((s) => s.category))];
  for (const category of categories) {
    const catServices = usServices.filter((s) => s.category === category);
    const riskLevel = assessCategoryRisk(category);
    lines.push(`**${category.charAt(0).toUpperCase() + category.slice(1)} Services** (${catServices.map((s) => s.name).join(", ")})`);
    lines.push(`- Risk Level: **${riskLevel.level}**`);
    lines.push(`- Rationale: ${riskLevel.rationale}`);
    lines.push("");
  }

  // ── 5. Per-Service Assessment ───────────────────────────────────────────
  lines.push("## 5. Per-Service Transfer Assessment");
  lines.push("");

  for (const svc of usServices) {
    lines.push(`### ${svc.name}`);
    lines.push("");
    lines.push("| Criterion | Assessment |");
    lines.push("|-----------|-----------|");
    lines.push(`| **Data Categories** | ${svc.dataCollected.join(", ")} |`);
    lines.push(`| **Transfer Mechanism** | SCCs / DPF — [Verify with provider] |`);
    lines.push(`| **DPF Certification** | [Check dataprivacyframework.gov] |`);
    lines.push(`| **Encryption in Transit** | [Verify — typically yes] |`);
    lines.push(`| **Encryption at Rest** | [Verify with provider] |`);
    lines.push(`| **Sub-processors** | [Review provider's sub-processor list] |`);
    lines.push(`| **Data Minimization** | [Assess what data is strictly necessary] |`);
    lines.push(`| **Risk Level** | ${assessServiceRisk(svc)} |`);
    lines.push("");
  }

  // ── 6. SCC Requirements Checklist ───────────────────────────────────────
  lines.push("## 6. Standard Contractual Clauses Checklist");
  lines.push("");
  lines.push("For each US-based service provider, ensure the following:");
  lines.push("");
  lines.push("- [ ] SCCs (Module 2: Controller to Processor) executed with provider");
  lines.push("- [ ] Annex I (List of parties) completed");
  lines.push("- [ ] Annex II (Technical and organizational measures) documented");
  lines.push("- [ ] Annex III (Sub-processors) provided by data importer");
  lines.push("- [ ] Provider's DPF certification status verified");
  lines.push("- [ ] Data Processing Agreement (DPA) in place with provider");
  lines.push("- [ ] Supplementary measures implemented where necessary");
  lines.push("- [ ] Provider's security certifications reviewed (SOC 2, ISO 27001)");
  lines.push("");

  // ── 7. Recommendations ─────────────────────────────────────────────────
  lines.push("## 7. Recommendations");
  lines.push("");

  lines.push("1. **Verify DPF certification** for all US-based service providers listed above");
  lines.push("2. **Execute SCCs** with any provider not certified under the DPF");
  lines.push("3. **Implement supplementary measures** as identified in Section 3.3");
  lines.push("4. **Conduct regular reviews** — reassess this TIA at least annually or when:");
  lines.push("   - New US-based services are added");
  lines.push("   - EU or US data protection laws change");
  lines.push("   - A relevant CJEU or supervisory authority decision is issued");
  lines.push("5. **Document all DPAs** — maintain copies of signed Data Processing Agreements");
  lines.push("6. **Monitor the DPF** — track any legal challenges to the EU-US Data Privacy Framework");
  lines.push("");

  // ── 8. Review Schedule ─────────────────────────────────────────────────
  lines.push("## 8. Review Schedule");
  lines.push("");
  lines.push("| Review Type | Frequency | Next Due |");
  lines.push("|-------------|-----------|----------|");
  lines.push(`| Full TIA Review | Annual | ${nextYear(date)} |`);
  lines.push("| DPF Certification Check | Semi-annual | [Set date] |");
  lines.push("| SCC Compliance Audit | Annual | [Set date] |");
  lines.push("| Supplementary Measures Review | Annual | [Set date] |");
  lines.push("");

  // ── Footer ──────────────────────────────────────────────────────────────
  lines.push("---");
  lines.push("");
  lines.push(
    "*This Transfer Impact Assessment was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on code analysis. " +
      "It must be reviewed by your Data Protection Officer and legal counsel. The assessment of each service provider should be verified with their current documentation. " +
      "This document does not constitute legal advice.*"
  );
  lines.push("");

  return lines.join("\n");
}

// ── Helpers ────────────────────────────────────────────────────────────────

function assessCategoryRisk(category: string): { level: string; rationale: string } {
  switch (category) {
    case "payment":
      return {
        level: "High",
        rationale: "Financial data is sensitive and subject to both GDPR and PCI DSS requirements. Payment processors typically have robust security measures and DPF certification.",
      };
    case "ai":
      return {
        level: "High",
        rationale: "AI services process user-generated content which may contain sensitive personal data. Data may be used for model training unless explicitly opted out.",
      };
    case "analytics":
      return {
        level: "Medium",
        rationale: "Analytics services collect behavioral data, IP addresses, and device information. Consent is typically required under GDPR/ePrivacy Directive.",
      };
    case "auth":
      return {
        level: "Medium",
        rationale: "Authentication services process identity data (email, name, profile). These services typically have strong security controls.",
      };
    case "email":
      return {
        level: "Medium",
        rationale: "Email services process contact information and communication content. Transactional emails are generally lower risk than marketing communications.",
      };
    case "monitoring":
      return {
        level: "Low",
        rationale: "Monitoring services primarily collect technical data (error reports, stack traces). Some user context data may be included incidentally.",
      };
    case "storage":
      return {
        level: "Medium-High",
        rationale: "Storage services may contain user-uploaded content of any sensitivity level. Encryption and access controls are critical.",
      };
    default:
      return {
        level: "Medium",
        rationale: "Assess the specific data categories transferred to determine the appropriate risk level.",
      };
  }
}

function assessServiceRisk(svc: DetectedService): string {
  const sensitiveData = svc.dataCollected.some((d) =>
    /payment|financial|health|biometric|password|credential/i.test(d)
  );
  if (sensitiveData) return "High";
  if (svc.category === "ai" || svc.category === "payment") return "High";
  if (svc.category === "analytics" || svc.category === "auth") return "Medium";
  return "Low-Medium";
}

function nextYear(dateStr: string): string {
  const d = new Date(dateStr);
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0];
}
