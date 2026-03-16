import type { ScanResult, DetectedService } from "../scanner/types.js";
import type { GeneratorContext } from "./index.js";

/** Risk tier levels for vendor classification. */
type RiskTier = "Critical" | "High" | "Medium" | "Low";

/** Services that are self-hosted (not third-party vendors). */
const SELF_HOSTED = new Set([
  "prisma", "drizzle", "mongoose", "ioredis", "redis", "nodemailer",
  "passport", "next-auth", "@auth/core", "better-auth", "web-push",
  "bullmq", "@simplewebauthn/server", "passport-google-oauth20",
  "passport-microsoft",
]);

/** Map package names to human-readable provider names. */
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
  "@sendgrid/mail": "SendGrid",
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
  "@segment/analytics-next": "Segment",
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
  "@mailchimp/mailchimp_marketing": "Mailchimp",
  "@mailchimp/mailchimp_transactional": "Mailchimp Transactional",
  "crisp-sdk-web": "Crisp",
  "@meilisearch/instant-meilisearch": "Meilisearch",
  "@upstash/redis": "Upstash Redis",
};

/** DPA contact URLs for known vendors. */
const DPA_CONTACTS: Record<string, string> = {
  OpenAI: "https://openai.com/policies",
  Anthropic: "https://www.anthropic.com/privacy",
  "Google (Gemini)": "https://cloud.google.com/terms/data-processing-addendum",
  Replicate: "https://replicate.com/privacy",
  "Together AI": "https://www.together.ai/privacy",
  Cohere: "https://cohere.com/privacy",
  Pinecone: "https://www.pinecone.io/privacy/",
  Stripe: "https://stripe.com/legal/dpa",
  PayPal: "https://www.paypal.com/webapps/mpp/ua/privacy-full",
  "Lemon Squeezy": "https://www.lemonsqueezy.com/privacy",
  "Google Analytics": "https://privacy.google.com/businesses/processorterms/",
  PostHog: "https://posthog.com/docs/privacy/dpa",
  Mixpanel: "https://mixpanel.com/legal/dpa",
  Amplitude: "https://amplitude.com/privacy",
  "Vercel Analytics": "https://vercel.com/legal/dpa",
  Hotjar: "https://www.hotjar.com/legal/support/dpa/",
  Clerk: "https://clerk.com/legal/dpa",
  Supabase: "https://supabase.com/legal/dpa",
  SendGrid: "https://www.twilio.com/legal/data-protection-addendum",
  Resend: "https://resend.com/legal/dpa",
  Postmark: "https://postmarkapp.com/eu-privacy#dpa",
  Sentry: "https://sentry.io/legal/dpa/",
  Datadog: "https://www.datadoghq.com/legal/data-processing-addendum/",
  "Amazon S3 (AWS)": "https://aws.amazon.com/compliance/data-processing-addendum/",
  "Amazon SES (AWS)": "https://aws.amazon.com/compliance/data-processing-addendum/",
  "Amazon SNS (AWS)": "https://aws.amazon.com/compliance/data-processing-addendum/",
  "Google Cloud Storage": "https://cloud.google.com/terms/data-processing-addendum",
  "Google Cloud KMS": "https://cloud.google.com/terms/data-processing-addendum",
  "Google APIs": "https://cloud.google.com/terms/data-processing-addendum",
  "Google Auth": "https://cloud.google.com/terms/data-processing-addendum",
  Twilio: "https://www.twilio.com/legal/data-protection-addendum",
  Intercom: "https://www.intercom.com/legal/terms-and-policies#dpa",
  HubSpot: "https://legal.hubspot.com/dpa",
  Segment: "https://www.twilio.com/legal/data-protection-addendum",
  Algolia: "https://www.algolia.com/policies/dpa/",
  OneSignal: "https://onesignal.com/privacy_policy",
  "Firebase (Google)": "https://firebase.google.com/terms/data-processing-terms",
  Cloudflare: "https://www.cloudflare.com/cloudflare-customer-dpa/",
  Plaid: "https://plaid.com/legal/#data-processing-addendum",
  Mailchimp: "https://www.intuit.com/privacy/statement/",
  "Mailchimp Transactional": "https://www.intuit.com/privacy/statement/",
  UploadThing: "https://uploadthing.com/privacy",
  Cloudinary: "https://cloudinary.com/privacy",
  "Upstash Redis": "https://upstash.com/trust/dpa",
  Meilisearch: "https://www.meilisearch.com/privacy-policy",
  "Vercel AI SDK": "https://vercel.com/legal/dpa",
  "Vercel AI SDK (OpenAI)": "https://vercel.com/legal/dpa",
  "Vercel AI SDK (Anthropic)": "https://vercel.com/legal/dpa",
  "Vercel AI SDK (Google)": "https://vercel.com/legal/dpa",
  "Vercel AI SDK (Google Vertex)": "https://vercel.com/legal/dpa",
  LaunchDarkly: "https://launchdarkly.com/policies/data-processing-addendum/",
  Crisp: "https://crisp.chat/en/privacy/",
};

/** Privacy contact emails for known vendors. */
const PRIVACY_CONTACTS: Record<string, string> = {
  OpenAI: "privacy@openai.com",
  Anthropic: "privacy@anthropic.com",
  "Google (Gemini)": "data-protection-office@google.com",
  Stripe: "privacy@stripe.com",
  PayPal: "privacy@paypal.com",
  PostHog: "privacy@posthog.com",
  Mixpanel: "privacy@mixpanel.com",
  Sentry: "dpa@sentry.io",
  Clerk: "privacy@clerk.com",
  Supabase: "privacy@supabase.io",
  SendGrid: "privacy@twilio.com",
  Resend: "privacy@resend.com",
  Twilio: "privacy@twilio.com",
  Intercom: "privacy@intercom.com",
  HubSpot: "privacy@hubspot.com",
  Cloudflare: "privacyquestions@cloudflare.com",
  Datadog: "privacy@datadoghq.com",
  "Amazon S3 (AWS)": "aws-privacy@amazon.com",
  "Firebase (Google)": "data-protection-office@google.com",
  "Google Analytics": "data-protection-office@google.com",
};

/** Data sensitivity scoring per service category. */
const DATA_SENSITIVITY: Record<string, number> = {
  payment: 5,
  ai: 4,
  auth: 4,
  database: 3,
  storage: 3,
  email: 3,
  analytics: 2,
  monitoring: 2,
  advertising: 2,
  social: 2,
  other: 1,
};

/**
 * Determine risk tier based on service category and data sensitivity.
 */
function assignRiskTier(service: DetectedService): RiskTier {
  const sensitivity = DATA_SENSITIVITY[service.category] || 1;
  if (sensitivity >= 5) return "Critical";
  if (sensitivity >= 4) return "High";
  if (sensitivity >= 3) return "Medium";
  return "Low";
}

interface VendorComplianceEntry {
  vendor: string;
  category: string;
  dpaSigned: string;
  lastReview: string;
  nextReview: string;
  riskTier: RiskTier;
  contact: string;
  dpaUrl: string;
}

/**
 * Build vendor compliance entries from scan results.
 */
function buildVendorComplianceEntries(scan: ScanResult): VendorComplianceEntry[] {
  const seen = new Set<string>();
  const entries: VendorComplianceEntry[] = [];
  const today = new Date();

  for (const service of scan.services) {
    if (SELF_HOSTED.has(service.name)) continue;

    const vendor = PROVIDER_NAMES[service.name] || service.name;
    if (seen.has(vendor)) continue;
    seen.add(vendor);

    const tier = assignRiskTier(service);
    const contact = PRIVACY_CONTACTS[vendor] || "[Contact vendor]";
    const dpaUrl = DPA_CONTACTS[vendor] || "[Request from vendor]";

    // Calculate next review based on tier
    const nextReviewDate = new Date(today);
    if (tier === "Critical") nextReviewDate.setMonth(nextReviewDate.getMonth() + 3);
    else if (tier === "High") nextReviewDate.setMonth(nextReviewDate.getMonth() + 6);
    else if (tier === "Medium") nextReviewDate.setFullYear(nextReviewDate.getFullYear() + 1);
    else nextReviewDate.setFullYear(nextReviewDate.getFullYear() + 2);

    entries.push({
      vendor,
      category: service.category,
      dpaSigned: "[ ] Pending",
      lastReview: "[Not yet reviewed]",
      nextReview: nextReviewDate.toISOString().split("T")[0],
      riskTier: tier,
      contact,
      dpaUrl,
    });
  }

  // Sort by tier severity
  const tierOrder: Record<RiskTier, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  entries.sort((a, b) => tierOrder[a.riskTier] - tierOrder[b.riskTier]);

  return entries;
}

/**
 * Generate VENDOR_COMPLIANCE_TRACKER.md — track compliance status of each
 * third-party vendor with DPA status, review dates, risk tiers, and contacts.
 * Auto-populated from detected services.
 *
 * Returns null when no third-party services are detected.
 */
export function generateVendorComplianceTracker(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  const entries = buildVendorComplianceEntries(scan);
  if (entries.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const dpo = ctx?.dpoName || "[DPO Name]";
  const dpoEmail = ctx?.dpoEmail || "[dpo@example.com]";
  const date = new Date().toISOString().split("T")[0];

  // Count per tier
  const tierCounts: Record<RiskTier, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  for (const e of entries) tierCounts[e.riskTier]++;

  const sections: string[] = [];

  // ── Title ──────────────────────────────────────────────────────────

  sections.push(`# Vendor Compliance Tracker

**Last updated:** ${date}

**Project:** ${scan.projectName}

**Organization:** ${company}

**Compliance contact:** ${email}

**DPO:** ${dpo} (${dpoEmail})

---

## Overview

This document tracks the compliance status of all **${entries.length} third-party vendors** detected in the **${scan.projectName}** codebase. It provides a centralized view of DPA status, review schedules, risk tiers, and vendor contacts for ongoing vendor compliance management.

### Vendor Distribution by Risk Tier

| Risk Tier | Count | Review Frequency |
|-----------|-------|-----------------|
| Critical | ${tierCounts.Critical} | Quarterly (every 3 months) |
| High | ${tierCounts.High} | Semi-annually (every 6 months) |
| Medium | ${tierCounts.Medium} | Annually (every 12 months) |
| Low | ${tierCounts.Low} | Biannually (every 24 months) |

---`);

  // ── Compliance Status Table ────────────────────────────────────────

  let table = `## Vendor Compliance Status

| Vendor | DPA Signed | Last Review | Next Review | Risk Tier | Contact |
|--------|-----------|-------------|-------------|-----------|---------|`;

  for (const e of entries) {
    const contactCell = e.contact.includes("@") ? e.contact : e.contact;
    table += `\n| **${e.vendor}** | ${e.dpaSigned} | ${e.lastReview} | ${e.nextReview} | ${e.riskTier} | ${contactCell} |`;
  }

  sections.push(table);

  // ── DPA Status Details ─────────────────────────────────────────────

  sections.push(`\n---\n\n## DPA Status Details`);

  for (const tier of ["Critical", "High", "Medium", "Low"] as RiskTier[]) {
    const tierEntries = entries.filter((e) => e.riskTier === tier);
    if (tierEntries.length === 0) continue;

    sections.push(`\n### ${tier} Risk Vendors\n`);

    for (const e of tierEntries) {
      const dpaLink = e.dpaUrl.startsWith("http") ? `[DPA Link](${e.dpaUrl})` : e.dpaUrl;
      sections.push(`#### ${e.vendor}

| Field | Status |
|-------|--------|
| **Category** | ${e.category} |
| **Risk Tier** | ${e.riskTier} |
| **DPA Signed** | ${e.dpaSigned} |
| **DPA Location** | ${dpaLink} |
| **Last Review** | ${e.lastReview} |
| **Next Review** | ${e.nextReview} |
| **Privacy Contact** | ${e.contact} |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor
`);
    }
  }

  // ── Review Calendar ────────────────────────────────────────────────

  const reviewsByMonth: Record<string, string[]> = {};
  for (const e of entries) {
    const month = e.nextReview.substring(0, 7); // YYYY-MM
    if (!reviewsByMonth[month]) reviewsByMonth[month] = [];
    reviewsByMonth[month].push(e.vendor);
  }

  const sortedMonths = Object.keys(reviewsByMonth).sort();

  sections.push(`---

## Upcoming Review Calendar

| Month | Vendors Due for Review |
|-------|----------------------|`);

  for (const month of sortedMonths) {
    sections.push(`| ${month} | ${reviewsByMonth[month].join(", ")} |`);
  }

  // ── Compliance Checklist ───────────────────────────────────────────

  sections.push(`

---

## Vendor Compliance Review Checklist

Use this checklist during each scheduled vendor review:

### Pre-Review
- [ ] Retrieve current DPA and verify it is signed and dated
- [ ] Check vendor's latest security certifications (SOC 2, ISO 27001)
- [ ] Review vendor's recent security incident disclosures
- [ ] Pull vendor's current sub-processor list

### During Review
- [ ] Verify data processing activities match agreed purposes
- [ ] Confirm data retention periods are within policy limits
- [ ] Test DSAR fulfillment process (access, deletion, portability)
- [ ] Review vendor's privacy policy for material changes
- [ ] Assess vendor's incident notification procedures
- [ ] Verify encryption at rest and in transit

### Post-Review
- [ ] Update this tracker with review date and findings
- [ ] Document any compliance gaps or concerns
- [ ] Set follow-up actions with deadlines
- [ ] Schedule next review based on risk tier
- [ ] Notify stakeholders of any material changes

---

## Escalation Procedures

| Situation | Action | Timeline |
|-----------|--------|----------|
| DPA not signed within 30 days | Escalate to legal team | Immediate |
| Vendor breach notification | Activate incident response plan | Within 24 hours |
| Failed compliance review | Document gaps and remediation plan | Within 5 business days |
| Vendor sub-processor change | Review new sub-processor and update records | Within 14 days |
| DPA renewal due | Initiate renewal process | 60 days before expiry |

---

## Maintaining This Document

- **Review frequency:** Monthly review of overall tracker; per-vendor reviews per risk tier schedule
- **Ownership:** Data Protection Officer / Privacy Team
- **Update process:** Re-run Codepliant to detect new vendors, then manually update DPA status and review dates
- **Integration:** This tracker should be maintained alongside the Vendor Contacts Directory and Vendor Risk Tier Assessment

---

*This vendor compliance tracker was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. DPA status and review dates should be manually updated as compliance activities are completed. This document does not constitute legal advice.*`);

  return sections.join("\n");
}
