import type { ScanResult, DetectedService } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/** Minimum number of third-party services required to generate the risk assessment. */
const MIN_SERVICES = 3;

// ── Self-hosted services (not third-party) ─────────────────────────────

const SELF_HOSTED = new Set([
  "prisma",
  "drizzle",
  "mongoose",
  "ioredis",
  "redis",
  "nodemailer",
  "passport",
  "next-auth",
  "@auth/core",
  "better-auth",
  "web-push",
  "bullmq",
  "@simplewebauthn/server",
  "passport-google-oauth20",
  "passport-microsoft",
]);

// ── Geographic location lookup ─────────────────────────────────────────

const US_BASED = new Set([
  "openai",
  "stripe",
  "@anthropic-ai/sdk",
  "replicate",
  "together-ai",
  "cohere",
  "@pinecone-database/pinecone",
  "@paypal/checkout-server-sdk",
  "@google-analytics/data",
  "posthog",
  "mixpanel",
  "@amplitude/analytics-browser",
  "@vercel/analytics",
  "hotjar",
  "@clerk/nextjs",
  "@sendgrid/mail",
  "resend",
  "@sentry/node",
  "@sentry/nextjs",
  "@sentry/react",
  "@aws-sdk/client-s3",
  "@uploadthing/react",
  "cloudinary",
  "twilio",
  "@twilio/voice-sdk",
  "intercom",
  "@intercom/messenger-js-sdk",
  "@hubspot/api-client",
  "launchdarkly-js-client-sdk",
  "@launchdarkly/node-server-sdk",
  "@segment/analytics-next",
  "algoliasearch",
  "@onesignal/node-onesignal",
  "firebase",
  "firebase-admin",
  "@google/generative-ai",
  "@aws-sdk/client-ses",
  "@aws-sdk/client-sns",
  "dd-trace",
  "@vercel/ai",
  "@ai-sdk/openai",
  "@ai-sdk/anthropic",
  "@ai-sdk/google",
  "@ai-sdk/google-vertex",
  "googleapis",
  "google-auth-library",
  "@google-cloud/storage",
  "@google-cloud/kms",
  "@cloudflare/workers-types",
  "plaid",
  "@upstash/redis",
  "@mailchimp/mailchimp_marketing",
  "@mailchimp/mailchimp_transactional",
  "postmark",
]);

const EU_BASED = new Set([
  "@lemonsqueezy/lemonsqueezy.js",
  "@meilisearch/instant-meilisearch",
  "crisp-sdk-web",
]);

// ── Provider display names ─────────────────────────────────────────────

const PROVIDER_NAMES: Record<string, string> = {
  openai: "OpenAI",
  "@anthropic-ai/sdk": "Anthropic",
  "@google/generative-ai": "Google (Gemini)",
  replicate: "Replicate",
  "together-ai": "Together AI",
  cohere: "Cohere",
  "@pinecone-database/pinecone": "Pinecone",
  langchain: "LangChain",
  stripe: "Stripe",
  "@paypal/checkout-server-sdk": "PayPal",
  "@lemonsqueezy/lemonsqueezy.js": "Lemon Squeezy",
  "@google-analytics/data": "Google Analytics",
  posthog: "PostHog",
  mixpanel: "Mixpanel",
  "@amplitude/analytics-browser": "Amplitude",
  "@vercel/analytics": "Vercel Analytics",
  hotjar: "Hotjar",
  "@clerk/nextjs": "Clerk",
  "@supabase/supabase-js": "Supabase",
  "@sendgrid/mail": "SendGrid (Twilio)",
  resend: "Resend",
  postmark: "Postmark",
  "@sentry/node": "Sentry",
  "@sentry/nextjs": "Sentry",
  "@sentry/react": "Sentry",
  "@sentry/nestjs": "Sentry",
  "@sentry/profiling-node": "Sentry",
  "@aws-sdk/client-s3": "Amazon S3 (AWS)",
  "@uploadthing/react": "UploadThing",
  cloudinary: "Cloudinary",
  twilio: "Twilio",
  "@twilio/voice-sdk": "Twilio",
  intercom: "Intercom",
  "@intercom/messenger-js-sdk": "Intercom",
  "@hubspot/api-client": "HubSpot",
  "launchdarkly-js-client-sdk": "LaunchDarkly",
  "@launchdarkly/node-server-sdk": "LaunchDarkly",
  "@segment/analytics-next": "Segment (Twilio)",
  algoliasearch: "Algolia",
  "@onesignal/node-onesignal": "OneSignal",
  firebase: "Firebase (Google)",
  "firebase-admin": "Firebase (Google)",
  "@aws-sdk/client-ses": "Amazon SES (AWS)",
  "@aws-sdk/client-sns": "Amazon SNS (AWS)",
  "dd-trace": "Datadog",
  "@cloudflare/workers-types": "Cloudflare",
  "@vercel/ai": "Vercel AI SDK",
  "@ai-sdk/openai": "Vercel AI SDK (OpenAI)",
  "@ai-sdk/anthropic": "Vercel AI SDK (Anthropic)",
  "@ai-sdk/google": "Vercel AI SDK (Google)",
  "@ai-sdk/google-vertex": "Vercel AI SDK (Google Vertex)",
  googleapis: "Google APIs",
  "google-auth-library": "Google Auth",
  "@google-cloud/storage": "Google Cloud Storage",
  "@google-cloud/kms": "Google Cloud KMS",
  plaid: "Plaid",
  "@mailchimp/mailchimp_marketing": "Mailchimp (Intuit)",
  "@mailchimp/mailchimp_transactional": "Mailchimp Transactional (Intuit)",
  "crisp-sdk-web": "Crisp",
  "@meilisearch/instant-meilisearch": "Meilisearch",
  "@upstash/redis": "Upstash Redis",
};

// ── Compliance certifications lookup ───────────────────────────────────

const CERTIFICATIONS: Record<string, string[]> = {
  openai: ["SOC 2 Type II", "GDPR"],
  "@anthropic-ai/sdk": ["SOC 2 Type II", "GDPR"],
  "@google/generative-ai": ["SOC 2 Type II", "ISO 27001", "GDPR"],
  replicate: ["SOC 2 Type II"],
  "together-ai": ["SOC 2 Type II"],
  cohere: ["SOC 2 Type II", "GDPR"],
  "@pinecone-database/pinecone": ["SOC 2 Type II", "GDPR"],
  stripe: ["PCI DSS Level 1", "SOC 2 Type II", "ISO 27001", "GDPR"],
  "@paypal/checkout-server-sdk": ["PCI DSS Level 1", "SOC 2 Type II", "ISO 27001", "GDPR"],
  "@lemonsqueezy/lemonsqueezy.js": ["PCI DSS", "GDPR"],
  "@google-analytics/data": ["SOC 2 Type II", "ISO 27001", "GDPR"],
  posthog: ["SOC 2 Type II", "GDPR"],
  mixpanel: ["SOC 2 Type II", "GDPR"],
  "@amplitude/analytics-browser": ["SOC 2 Type II", "GDPR"],
  "@vercel/analytics": ["SOC 2 Type II", "GDPR"],
  hotjar: ["ISO 27001", "GDPR"],
  "@clerk/nextjs": ["SOC 2 Type II", "GDPR"],
  "@supabase/supabase-js": ["SOC 2 Type II", "ISO 27001", "GDPR"],
  "@sendgrid/mail": ["SOC 2 Type II", "ISO 27001", "GDPR"],
  resend: ["SOC 2 Type II", "GDPR"],
  postmark: ["SOC 2 Type II", "GDPR"],
  "@sentry/node": ["SOC 2 Type II", "ISO 27001", "GDPR"],
  "@sentry/nextjs": ["SOC 2 Type II", "ISO 27001", "GDPR"],
  "@sentry/react": ["SOC 2 Type II", "ISO 27001", "GDPR"],
  "@aws-sdk/client-s3": ["SOC 2 Type II", "ISO 27001", "GDPR", "HIPAA"],
  "@aws-sdk/client-ses": ["SOC 2 Type II", "ISO 27001", "GDPR", "HIPAA"],
  "@aws-sdk/client-sns": ["SOC 2 Type II", "ISO 27001", "GDPR", "HIPAA"],
  "@uploadthing/react": ["SOC 2 Type II"],
  cloudinary: ["SOC 2 Type II", "ISO 27001", "GDPR"],
  twilio: ["SOC 2 Type II", "ISO 27001", "GDPR"],
  "@twilio/voice-sdk": ["SOC 2 Type II", "ISO 27001", "GDPR"],
  intercom: ["SOC 2 Type II", "ISO 27001", "GDPR"],
  "@intercom/messenger-js-sdk": ["SOC 2 Type II", "ISO 27001", "GDPR"],
  "@hubspot/api-client": ["SOC 2 Type II", "ISO 27001", "GDPR"],
  "launchdarkly-js-client-sdk": ["SOC 2 Type II", "ISO 27001", "GDPR"],
  "@launchdarkly/node-server-sdk": ["SOC 2 Type II", "ISO 27001", "GDPR"],
  "@segment/analytics-next": ["SOC 2 Type II", "ISO 27001", "GDPR"],
  algoliasearch: ["SOC 2 Type II", "ISO 27001", "GDPR"],
  "@onesignal/node-onesignal": ["SOC 2 Type II", "GDPR"],
  firebase: ["SOC 2 Type II", "ISO 27001", "GDPR"],
  "firebase-admin": ["SOC 2 Type II", "ISO 27001", "GDPR"],
  "dd-trace": ["SOC 2 Type II", "ISO 27001", "GDPR", "HIPAA"],
  "@cloudflare/workers-types": ["SOC 2 Type II", "ISO 27001", "GDPR"],
  "@vercel/ai": ["SOC 2 Type II", "GDPR"],
  "@ai-sdk/openai": ["SOC 2 Type II", "GDPR"],
  "@ai-sdk/anthropic": ["SOC 2 Type II", "GDPR"],
  "@ai-sdk/google": ["SOC 2 Type II", "GDPR"],
  "@ai-sdk/google-vertex": ["SOC 2 Type II", "GDPR"],
  googleapis: ["SOC 2 Type II", "ISO 27001", "GDPR"],
  "google-auth-library": ["SOC 2 Type II", "ISO 27001", "GDPR"],
  "@google-cloud/storage": ["SOC 2 Type II", "ISO 27001", "GDPR", "HIPAA"],
  "@google-cloud/kms": ["SOC 2 Type II", "ISO 27001", "GDPR", "HIPAA"],
  plaid: ["SOC 2 Type II", "ISO 27001", "GDPR"],
  "@mailchimp/mailchimp_marketing": ["SOC 2 Type II", "GDPR"],
  "@mailchimp/mailchimp_transactional": ["SOC 2 Type II", "GDPR"],
  "crisp-sdk-web": ["GDPR"],
  "@meilisearch/instant-meilisearch": ["GDPR"],
  "@upstash/redis": ["SOC 2 Type II", "GDPR"],
};

// ── Data sensitivity by category ───────────────────────────────────────

const SENSITIVITY_BY_CATEGORY: Record<string, "high" | "medium" | "low"> = {
  payment: "high",
  ai: "high",
  auth: "high",
  analytics: "medium",
  email: "medium",
  monitoring: "low",
  storage: "medium",
  database: "medium",
  advertising: "medium",
  social: "low",
  other: "low",
};

// ── Data processing scope by category ──────────────────────────────────

const PROCESSING_SCOPE: Record<string, string> = {
  ai: "User input processing, content generation, model training (per vendor policy)",
  payment: "Payment card processing, billing records, transaction history",
  analytics: "User behavior tracking, session data, event logging",
  auth: "Identity verification, session management, credential storage",
  email: "Email addresses, message content, delivery metadata",
  monitoring: "Error logs, stack traces, performance metrics",
  storage: "File uploads, media assets, user-generated content",
  database: "Structured data storage and retrieval",
  advertising: "User profiles, ad targeting data, conversion tracking",
  social: "Social profile data, sharing activity",
  other: "Service-specific data processing",
};

// ── Risk mitigation by category ────────────────────────────────────────

const RISK_MITIGATIONS: Record<string, string[]> = {
  payment: [
    "PCI DSS compliant processor handles all card data",
    "No raw payment data stored in application",
    "Tokenization used for recurring payments",
  ],
  ai: [
    "Data minimization — only necessary context sent to AI provider",
    "Opt-out mechanism for AI processing where applicable",
    "Review vendor data retention and training policies",
  ],
  auth: [
    "Industry-standard authentication protocols (OAuth 2.0, OIDC)",
    "Passwords never stored in plaintext",
    "Session tokens rotated regularly",
  ],
  analytics: [
    "IP anonymization enabled where supported",
    "Cookie consent required before tracking",
    "Data retention limits configured",
  ],
  email: [
    "TLS encryption for email transmission",
    "Unsubscribe mechanism in all marketing emails",
    "Email content not stored beyond delivery",
  ],
  monitoring: [
    "PII scrubbing in error reports",
    "Short retention periods for logs",
    "Access restricted to engineering team",
  ],
  storage: [
    "Encryption at rest for all stored files",
    "Access controls on uploaded content",
    "Regular audit of stored data",
  ],
  advertising: [
    "Cookie consent required before ad tracking",
    "User opt-out mechanisms provided",
    "Data sharing limited to aggregated metrics where possible",
  ],
  social: [
    "Minimal data shared with social platforms",
    "User consent obtained before social sharing",
  ],
  other: [
    "Vendor security documentation reviewed",
    "Data processing agreement in place",
  ],
};

// ── Contract requirements by category ──────────────────────────────────

const CONTRACT_REQUIREMENTS: Record<string, string[]> = {
  payment: ["DPA (Data Processing Agreement)", "PCI DSS Attestation of Compliance"],
  ai: ["DPA (Data Processing Agreement)", "AI-specific data usage addendum"],
  auth: ["DPA (Data Processing Agreement)"],
  analytics: ["DPA (Data Processing Agreement)"],
  email: ["DPA (Data Processing Agreement)"],
  monitoring: ["DPA (Data Processing Agreement)"],
  storage: ["DPA (Data Processing Agreement)"],
  advertising: ["DPA (Data Processing Agreement)"],
  social: ["DPA (Data Processing Agreement)"],
  other: ["DPA (Data Processing Agreement)"],
};

/** Additional contract docs for specific geographies or data types. */
function getAdditionalContracts(
  location: string,
  sensitivity: "high" | "medium" | "low",
): string[] {
  const extras: string[] = [];
  if (location === "US" && sensitivity === "high") {
    extras.push("BAA (Business Associate Agreement) — if handling PHI");
  }
  if (location === "EU" || location === "US") {
    extras.push("Standard Contractual Clauses (SCCs) — for cross-border transfers");
  }
  return extras;
}

// ── Assessed vendor row ────────────────────────────────────────────────

interface VendorAssessment {
  provider: string;
  category: string;
  sensitivity: "high" | "medium" | "low";
  location: string;
  geographicRisk: string;
  certifications: string[];
  processingScope: string;
  mitigations: string[];
  contractRequirements: string[];
  dataProcessed: string;
}

function assessVendor(service: DetectedService): VendorAssessment {
  const provider = PROVIDER_NAMES[service.name] || service.name;
  const location = getLocation(service.name);
  const sensitivity = SENSITIVITY_BY_CATEGORY[service.category] || "low";
  const geographicRisk = getGeographicRisk(location);
  const certs = CERTIFICATIONS[service.name] || [];
  const scope = PROCESSING_SCOPE[service.category] || PROCESSING_SCOPE["other"];
  const mitigations = RISK_MITIGATIONS[service.category] || RISK_MITIGATIONS["other"];
  const baseContracts = CONTRACT_REQUIREMENTS[service.category] || CONTRACT_REQUIREMENTS["other"];
  const extraContracts = getAdditionalContracts(location, sensitivity);

  return {
    provider,
    category: service.category,
    sensitivity,
    location,
    geographicRisk,
    certifications: certs,
    processingScope: scope,
    mitigations,
    contractRequirements: [...baseContracts, ...extraContracts],
    dataProcessed: service.dataCollected.join(", "),
  };
}

function getLocation(serviceName: string): string {
  if (US_BASED.has(serviceName)) return "US";
  if (EU_BASED.has(serviceName)) return "EU";
  return "Other";
}

function getGeographicRisk(location: string): string {
  switch (location) {
    case "US":
      return "Medium — EU-US Data Privacy Framework applicable";
    case "EU":
      return "Low — within EEA, GDPR applies directly";
    default:
      return "High — verify adequacy decision or implement SCCs";
  }
}

function overallRiskLevel(
  sensitivity: "high" | "medium" | "low",
  location: string,
  certCount: number,
): "Critical" | "High" | "Medium" | "Low" {
  const sensitivityScore = sensitivity === "high" ? 3 : sensitivity === "medium" ? 2 : 1;
  const locationScore = location === "Other" ? 3 : location === "US" ? 2 : 1;
  const certReduction = certCount >= 3 ? -1 : 0;
  const total = sensitivityScore + locationScore + certReduction;
  if (total >= 5) return "Critical";
  if (total >= 4) return "High";
  if (total >= 3) return "Medium";
  return "Low";
}

/**
 * Generate a THIRD_PARTY_RISK_ASSESSMENT.md for all detected third-party services.
 * Returns null when fewer than MIN_SERVICES third-party services are detected.
 */
export function generateThirdPartyRiskAssessment(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  const thirdPartyServices = scan.services.filter(
    (s) => !SELF_HOSTED.has(s.name),
  );

  if (thirdPartyServices.length < MIN_SERVICES) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const date = new Date().toISOString().split("T")[0];

  // Deduplicate by provider name
  const seen = new Set<string>();
  const assessments: VendorAssessment[] = [];

  for (const service of thirdPartyServices) {
    const providerName = PROVIDER_NAMES[service.name] || service.name;
    if (seen.has(providerName)) continue;
    seen.add(providerName);
    assessments.push(assessVendor(service));
  }

  const sections: string[] = [];

  // ── Title ──────────────────────────────────────────────────────────

  sections.push(`# Third-Party Risk Assessment

**Last updated:** ${date}

**Project:** ${scan.projectName}

**Assessor:** ${company}

---

## Overview

This document provides a risk assessment of all third-party services integrated into the **${scan.projectName}** application. Each vendor has been evaluated for data sensitivity, geographic risk, compliance certifications, data processing scope, and risk mitigation measures.

Total third-party vendors assessed: **${assessments.length}**

For questions about this assessment, contact ${email}.`);

  // ── Risk Matrix ────────────────────────────────────────────────────

  sections.push(`
---

## Risk Matrix

| Vendor | Category | Data Sensitivity | Geographic Risk | Certifications | Overall Risk |
|--------|----------|-----------------|----------------|---------------|-------------|`);

  for (const a of assessments) {
    const risk = overallRiskLevel(a.sensitivity, a.location, a.certifications.length);
    const certs = a.certifications.length > 0 ? a.certifications.join(", ") : "None verified";
    sections.push(
      `| ${a.provider} | ${a.category} | ${a.sensitivity} | ${a.location} | ${certs} | ${risk} |`,
    );
  }

  // ── Detailed Vendor Assessments ────────────────────────────────────

  sections.push(`
---

## Detailed Vendor Assessments`);

  for (const a of assessments) {
    const risk = overallRiskLevel(a.sensitivity, a.location, a.certifications.length);
    const certs = a.certifications.length > 0 ? a.certifications.join(", ") : "None verified";
    const mitigationList = a.mitigations.map((m) => `- ${m}`).join("\n");
    const contractList = [...new Set(a.contractRequirements)].map((c) => `- [ ] ${c}`).join("\n");

    sections.push(`
### ${a.provider}

| Attribute | Detail |
|-----------|--------|
| **Category** | ${a.category} |
| **Data Processed** | ${a.dataProcessed} |
| **Data Sensitivity** | ${a.sensitivity} |
| **Geographic Location** | ${a.location} |
| **Geographic Risk** | ${a.geographicRisk} |
| **Certifications** | ${certs} |
| **Processing Scope** | ${a.processingScope} |
| **Overall Risk Level** | ${risk} |

**Risk Mitigation Measures:**

${mitigationList}

**Required Contracts:**

${contractList}`);
  }

  // ── Vendor Due Diligence Checklist ─────────────────────────────────

  sections.push(`
---

## Vendor Due Diligence Checklist

Before onboarding any new third-party vendor, complete the following checklist:

- [ ] **Security Assessment:** Review vendor's SOC 2 report or equivalent security certification
- [ ] **Privacy Policy Review:** Verify vendor's privacy policy aligns with your data protection requirements
- [ ] **Data Processing Agreement:** Execute a DPA that meets GDPR Article 28 requirements
- [ ] **Sub-processor Disclosure:** Obtain list of vendor's sub-processors and their locations
- [ ] **Data Residency:** Confirm where data will be stored and processed
- [ ] **Breach Notification:** Verify vendor commits to timely breach notification (72 hours or less)
- [ ] **Data Deletion:** Confirm vendor can delete data upon request and at contract termination
- [ ] **Access Controls:** Review vendor's access control and authentication mechanisms
- [ ] **Encryption:** Verify encryption in transit (TLS 1.2+) and at rest
- [ ] **Audit Rights:** Ensure contract includes right to audit or request audit reports
- [ ] **Insurance:** Verify vendor carries adequate cyber liability insurance
- [ ] **Incident History:** Research vendor's history of security incidents or data breaches
- [ ] **Business Continuity:** Review vendor's disaster recovery and business continuity plans
- [ ] **Regulatory Compliance:** Verify compliance with applicable regulations (GDPR, CCPA, HIPAA, etc.)`);

  // ── Contract Review Requirements ───────────────────────────────────

  // Collect all unique contract types across vendors
  const allContracts = new Set<string>();
  for (const a of assessments) {
    for (const c of a.contractRequirements) {
      allContracts.add(c);
    }
  }

  sections.push(`
---

## Contract Review Requirements

The following contractual documents should be in place for the third-party vendors used in this project:

### Required Agreements

${[...allContracts].map((c) => `- [ ] ${c}`).join("\n")}

### DPA Minimum Requirements

Every Data Processing Agreement must include:

1. **Subject matter and duration** of data processing
2. **Nature and purpose** of the processing
3. **Types of personal data** processed
4. **Categories of data subjects** affected
5. **Obligations and rights** of the data controller
6. **Technical and organizational security measures**
7. **Sub-processor engagement** conditions and notification obligations
8. **Data breach notification** procedures and timelines
9. **Data return and deletion** upon contract termination
10. **Audit rights** for the data controller

### Additional Agreements by Scenario

| Scenario | Required Agreement |
|----------|--------------------|
| Processing health data (PHI) | BAA (Business Associate Agreement) |
| Cross-border data transfers (EU to non-EU) | Standard Contractual Clauses (SCCs) |
| Payment card processing | PCI DSS Attestation of Compliance |
| Processing children's data | COPPA-compliant agreement |
| AI/ML data processing | AI data usage and training opt-out addendum |`);

  // ── Footer ─────────────────────────────────────────────────────────

  sections.push(`
---

## Review Schedule

This risk assessment should be reviewed:

- **Annually** as part of the regular compliance review cycle
- **When adding** a new third-party vendor
- **When a vendor** changes its data processing practices or certifications
- **After a security incident** involving any listed vendor

---

*This Third-Party Risk Assessment was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Review and verify all entries for accuracy. This document does not constitute legal advice.*`);

  return sections.join("\n");
}
