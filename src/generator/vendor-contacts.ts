import type { ScanResult, DetectedService, ServiceCategory } from "../scanner/types.js";
import type { GeneratorContext } from "./index.js";

/**
 * Vendor contact lookup table for DSAR handling.
 * Real URLs and emails for major third-party services.
 */
interface VendorContact {
  /** Human-readable provider name. */
  provider: string;
  /** DPA request contact or URL. */
  dpaContact: string;
  /** Privacy team email. */
  privacyEmail: string;
  /** Data deletion request URL or instructions. */
  dataDeletionUrl: string;
  /** Status page URL. */
  statusPageUrl: string;
  /** Security incident reporting URL or email. */
  securityIncidentUrl: string;
}

/** Map package names to human-readable provider names (mirrors subprocessor-list.ts). */
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
  "next-auth": "NextAuth.js",
  "@clerk/nextjs": "Clerk",
  "@supabase/supabase-js": "Supabase",
  "@auth/core": "Auth.js",
  "better-auth": "Better Auth",
  passport: "Passport.js",
  "@sendgrid/mail": "SendGrid",
  resend: "Resend",
  nodemailer: "Nodemailer (self-hosted)",
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
  "web-push": "Web Push (self-hosted)",
  bullmq: "BullMQ (self-hosted)",
  prisma: "Prisma (database ORM)",
  drizzle: "Drizzle (database ORM)",
  mongoose: "Mongoose (MongoDB ODM)",
  ioredis: "Redis",
  redis: "Redis",
  "@upstash/redis": "Upstash Redis",
  "passport-google-oauth20": "Google OAuth",
  "passport-microsoft": "Microsoft OAuth",
  "@simplewebauthn/server": "SimpleWebAuthn",
};

/**
 * Canonical vendor contact directory.
 * Keyed by the human-readable provider name (after dedup).
 */
const VENDOR_CONTACT_DIRECTORY: Record<string, Omit<VendorContact, "provider">> = {
  // AI
  OpenAI: {
    dpaContact: "https://openai.com/policies",
    privacyEmail: "privacy@openai.com",
    dataDeletionUrl: "https://help.openai.com/en/articles/7039943-data-deletion-request",
    statusPageUrl: "https://status.openai.com",
    securityIncidentUrl: "https://openai.com/security/disclosure",
  },
  Anthropic: {
    dpaContact: "https://www.anthropic.com/privacy",
    privacyEmail: "privacy@anthropic.com",
    dataDeletionUrl: "https://support.anthropic.com",
    statusPageUrl: "https://status.anthropic.com",
    securityIncidentUrl: "https://www.anthropic.com/responsible-disclosure",
  },
  "Google (Gemini)": {
    dpaContact: "https://cloud.google.com/terms/data-processing-addendum",
    privacyEmail: "data-protection-office@google.com",
    dataDeletionUrl: "https://privacy.google.com",
    statusPageUrl: "https://status.cloud.google.com",
    securityIncidentUrl: "https://about.google/appsecurity/",
  },
  Replicate: {
    dpaContact: "https://replicate.com/privacy",
    privacyEmail: "privacy@replicate.com",
    dataDeletionUrl: "https://replicate.com/privacy",
    statusPageUrl: "https://status.replicate.com",
    securityIncidentUrl: "security@replicate.com",
  },
  "Together AI": {
    dpaContact: "https://www.together.ai/privacy",
    privacyEmail: "privacy@together.ai",
    dataDeletionUrl: "https://www.together.ai/privacy",
    statusPageUrl: "https://status.together.ai",
    securityIncidentUrl: "security@together.ai",
  },
  Cohere: {
    dpaContact: "https://cohere.com/privacy",
    privacyEmail: "privacy@cohere.com",
    dataDeletionUrl: "https://cohere.com/privacy",
    statusPageUrl: "https://status.cohere.com",
    securityIncidentUrl: "security@cohere.com",
  },
  Pinecone: {
    dpaContact: "https://www.pinecone.io/privacy/",
    privacyEmail: "privacy@pinecone.io",
    dataDeletionUrl: "https://www.pinecone.io/privacy/",
    statusPageUrl: "https://status.pinecone.io",
    securityIncidentUrl: "security@pinecone.io",
  },

  // Payment
  Stripe: {
    dpaContact: "https://stripe.com/legal/dpa",
    privacyEmail: "privacy@stripe.com",
    dataDeletionUrl: "https://support.stripe.com/questions/privacy-and-data-protection",
    statusPageUrl: "https://status.stripe.com",
    securityIncidentUrl: "https://stripe.com/docs/security/reporting",
  },
  PayPal: {
    dpaContact: "https://www.paypal.com/webapps/mpp/ua/privacy-full",
    privacyEmail: "privacy@paypal.com",
    dataDeletionUrl: "https://www.paypal.com/myaccount/privacy/privacyhub",
    statusPageUrl: "https://www.paypal-status.com",
    securityIncidentUrl: "https://www.paypal.com/us/security/report-suspicious-messages",
  },
  "Lemon Squeezy": {
    dpaContact: "https://www.lemonsqueezy.com/privacy",
    privacyEmail: "privacy@lemonsqueezy.com",
    dataDeletionUrl: "https://www.lemonsqueezy.com/privacy",
    statusPageUrl: "https://status.lemonsqueezy.com",
    securityIncidentUrl: "security@lemonsqueezy.com",
  },
  Plaid: {
    dpaContact: "https://plaid.com/legal/#data-processing-addendum",
    privacyEmail: "privacy@plaid.com",
    dataDeletionUrl: "https://my.plaid.com",
    statusPageUrl: "https://status.plaid.com",
    securityIncidentUrl: "security@plaid.com",
  },

  // Analytics
  "Google Analytics": {
    dpaContact: "https://privacy.google.com/businesses/processorterms/",
    privacyEmail: "data-protection-office@google.com",
    dataDeletionUrl: "https://support.google.com/analytics/answer/9450800",
    statusPageUrl: "https://www.google.com/appsstatus",
    securityIncidentUrl: "https://about.google/appsecurity/",
  },
  PostHog: {
    dpaContact: "https://posthog.com/docs/privacy/dpa",
    privacyEmail: "privacy@posthog.com",
    dataDeletionUrl: "https://posthog.com/docs/privacy/data-deletion",
    statusPageUrl: "https://status.posthog.com",
    securityIncidentUrl: "security@posthog.com",
  },
  Mixpanel: {
    dpaContact: "https://mixpanel.com/legal/dpa",
    privacyEmail: "privacy@mixpanel.com",
    dataDeletionUrl: "https://developer.mixpanel.com/docs/privacy-security#user-data-deletion",
    statusPageUrl: "https://status.mixpanel.com",
    securityIncidentUrl: "security@mixpanel.com",
  },
  Amplitude: {
    dpaContact: "https://amplitude.com/privacy",
    privacyEmail: "privacy@amplitude.com",
    dataDeletionUrl: "https://amplitude.com/privacy",
    statusPageUrl: "https://status.amplitude.com",
    securityIncidentUrl: "security@amplitude.com",
  },
  "Vercel Analytics": {
    dpaContact: "https://vercel.com/legal/dpa",
    privacyEmail: "privacy@vercel.com",
    dataDeletionUrl: "https://vercel.com/legal/privacy-policy",
    statusPageUrl: "https://www.vercel-status.com",
    securityIncidentUrl: "security@vercel.com",
  },
  Hotjar: {
    dpaContact: "https://www.hotjar.com/legal/support/dpa/",
    privacyEmail: "privacy@hotjar.com",
    dataDeletionUrl: "https://www.hotjar.com/privacy/",
    statusPageUrl: "https://status.hotjar.com",
    securityIncidentUrl: "security@hotjar.com",
  },

  // Auth
  Clerk: {
    dpaContact: "https://clerk.com/legal/dpa",
    privacyEmail: "privacy@clerk.com",
    dataDeletionUrl: "https://clerk.com/legal/privacy",
    statusPageUrl: "https://status.clerk.com",
    securityIncidentUrl: "security@clerk.com",
  },
  Supabase: {
    dpaContact: "https://supabase.com/legal/dpa",
    privacyEmail: "privacy@supabase.io",
    dataDeletionUrl: "https://supabase.com/privacy",
    statusPageUrl: "https://status.supabase.com",
    securityIncidentUrl: "security@supabase.io",
  },

  // Email
  SendGrid: {
    dpaContact: "https://www.twilio.com/legal/data-protection-addendum",
    privacyEmail: "privacy@twilio.com",
    dataDeletionUrl: "https://www.twilio.com/legal/privacy",
    statusPageUrl: "https://status.sendgrid.com",
    securityIncidentUrl: "security@twilio.com",
  },
  Resend: {
    dpaContact: "https://resend.com/legal/dpa",
    privacyEmail: "privacy@resend.com",
    dataDeletionUrl: "https://resend.com/legal/privacy-policy",
    statusPageUrl: "https://status.resend.com",
    securityIncidentUrl: "security@resend.com",
  },
  Postmark: {
    dpaContact: "https://postmarkapp.com/eu-privacy#dpa",
    privacyEmail: "privacy@postmarkapp.com",
    dataDeletionUrl: "https://postmarkapp.com/privacy-policy",
    statusPageUrl: "https://status.postmarkapp.com",
    securityIncidentUrl: "security@postmarkapp.com",
  },
  Mailchimp: {
    dpaContact: "https://www.intuit.com/privacy/statement/",
    privacyEmail: "privacy@mailchimp.com",
    dataDeletionUrl: "https://mailchimp.com/help/delete-contacts/",
    statusPageUrl: "https://status.mailchimp.com",
    securityIncidentUrl: "security@mailchimp.com",
  },
  "Mailchimp Transactional": {
    dpaContact: "https://www.intuit.com/privacy/statement/",
    privacyEmail: "privacy@mailchimp.com",
    dataDeletionUrl: "https://mailchimp.com/help/delete-contacts/",
    statusPageUrl: "https://status.mailchimp.com",
    securityIncidentUrl: "security@mailchimp.com",
  },

  // Monitoring
  Sentry: {
    dpaContact: "https://sentry.io/legal/dpa/",
    privacyEmail: "dpa@sentry.io",
    dataDeletionUrl: "https://docs.sentry.io/account/soc2/#data-deletion",
    statusPageUrl: "https://status.sentry.io",
    securityIncidentUrl: "security@sentry.io",
  },
  Datadog: {
    dpaContact: "https://www.datadoghq.com/legal/data-processing-addendum/",
    privacyEmail: "privacy@datadoghq.com",
    dataDeletionUrl: "https://www.datadoghq.com/legal/privacy/",
    statusPageUrl: "https://status.datadoghq.com",
    securityIncidentUrl: "security@datadoghq.com",
  },

  // Storage / Cloud
  "Amazon S3 (AWS)": {
    dpaContact: "https://aws.amazon.com/compliance/data-processing-addendum/",
    privacyEmail: "aws-privacy@amazon.com",
    dataDeletionUrl: "https://aws.amazon.com/compliance/",
    statusPageUrl: "https://health.aws.amazon.com",
    securityIncidentUrl: "https://aws.amazon.com/security/vulnerability-reporting/",
  },
  "Amazon SES (AWS)": {
    dpaContact: "https://aws.amazon.com/compliance/data-processing-addendum/",
    privacyEmail: "aws-privacy@amazon.com",
    dataDeletionUrl: "https://aws.amazon.com/compliance/",
    statusPageUrl: "https://health.aws.amazon.com",
    securityIncidentUrl: "https://aws.amazon.com/security/vulnerability-reporting/",
  },
  "Amazon SNS (AWS)": {
    dpaContact: "https://aws.amazon.com/compliance/data-processing-addendum/",
    privacyEmail: "aws-privacy@amazon.com",
    dataDeletionUrl: "https://aws.amazon.com/compliance/",
    statusPageUrl: "https://health.aws.amazon.com",
    securityIncidentUrl: "https://aws.amazon.com/security/vulnerability-reporting/",
  },
  "Google Cloud Storage": {
    dpaContact: "https://cloud.google.com/terms/data-processing-addendum",
    privacyEmail: "data-protection-office@google.com",
    dataDeletionUrl: "https://privacy.google.com",
    statusPageUrl: "https://status.cloud.google.com",
    securityIncidentUrl: "https://about.google/appsecurity/",
  },
  "Google Cloud KMS": {
    dpaContact: "https://cloud.google.com/terms/data-processing-addendum",
    privacyEmail: "data-protection-office@google.com",
    dataDeletionUrl: "https://privacy.google.com",
    statusPageUrl: "https://status.cloud.google.com",
    securityIncidentUrl: "https://about.google/appsecurity/",
  },
  "Google APIs": {
    dpaContact: "https://cloud.google.com/terms/data-processing-addendum",
    privacyEmail: "data-protection-office@google.com",
    dataDeletionUrl: "https://privacy.google.com",
    statusPageUrl: "https://status.cloud.google.com",
    securityIncidentUrl: "https://about.google/appsecurity/",
  },
  "Google Auth": {
    dpaContact: "https://cloud.google.com/terms/data-processing-addendum",
    privacyEmail: "data-protection-office@google.com",
    dataDeletionUrl: "https://privacy.google.com",
    statusPageUrl: "https://status.cloud.google.com",
    securityIncidentUrl: "https://about.google/appsecurity/",
  },
  UploadThing: {
    dpaContact: "https://uploadthing.com/privacy",
    privacyEmail: "privacy@uploadthing.com",
    dataDeletionUrl: "https://uploadthing.com/privacy",
    statusPageUrl: "https://status.uploadthing.com",
    securityIncidentUrl: "security@uploadthing.com",
  },
  Cloudinary: {
    dpaContact: "https://cloudinary.com/privacy",
    privacyEmail: "privacy@cloudinary.com",
    dataDeletionUrl: "https://cloudinary.com/privacy",
    statusPageUrl: "https://status.cloudinary.com",
    securityIncidentUrl: "security@cloudinary.com",
  },

  // Communication / CRM
  Twilio: {
    dpaContact: "https://www.twilio.com/legal/data-protection-addendum",
    privacyEmail: "privacy@twilio.com",
    dataDeletionUrl: "https://www.twilio.com/legal/privacy",
    statusPageUrl: "https://status.twilio.com",
    securityIncidentUrl: "security@twilio.com",
  },
  Intercom: {
    dpaContact: "https://www.intercom.com/legal/terms-and-policies#dpa",
    privacyEmail: "privacy@intercom.com",
    dataDeletionUrl: "https://www.intercom.com/legal/privacy",
    statusPageUrl: "https://www.intercomstatus.com",
    securityIncidentUrl: "security@intercom.com",
  },
  HubSpot: {
    dpaContact: "https://legal.hubspot.com/dpa",
    privacyEmail: "privacy@hubspot.com",
    dataDeletionUrl: "https://legal.hubspot.com/privacy-policy",
    statusPageUrl: "https://status.hubspot.com",
    securityIncidentUrl: "security@hubspot.com",
  },
  Segment: {
    dpaContact: "https://www.twilio.com/legal/data-protection-addendum",
    privacyEmail: "privacy@twilio.com",
    dataDeletionUrl: "https://segment.com/docs/privacy/user-deletion-and-suppression/",
    statusPageUrl: "https://status.segment.com",
    securityIncidentUrl: "security@twilio.com",
  },
  Crisp: {
    dpaContact: "https://crisp.chat/en/privacy/",
    privacyEmail: "privacy@crisp.chat",
    dataDeletionUrl: "https://crisp.chat/en/privacy/",
    statusPageUrl: "https://status.crisp.chat",
    securityIncidentUrl: "security@crisp.chat",
  },

  // Feature Flags / Analytics
  LaunchDarkly: {
    dpaContact: "https://launchdarkly.com/policies/data-processing-addendum/",
    privacyEmail: "privacy@launchdarkly.com",
    dataDeletionUrl: "https://launchdarkly.com/policies/privacy/",
    statusPageUrl: "https://status.launchdarkly.com",
    securityIncidentUrl: "security@launchdarkly.com",
  },
  Algolia: {
    dpaContact: "https://www.algolia.com/policies/dpa/",
    privacyEmail: "privacy@algolia.com",
    dataDeletionUrl: "https://www.algolia.com/policies/privacy/",
    statusPageUrl: "https://status.algolia.com",
    securityIncidentUrl: "security@algolia.com",
  },
  OneSignal: {
    dpaContact: "https://onesignal.com/privacy_policy",
    privacyEmail: "privacy@onesignal.com",
    dataDeletionUrl: "https://onesignal.com/privacy_policy",
    statusPageUrl: "https://status.onesignal.com",
    securityIncidentUrl: "security@onesignal.com",
  },

  // Firebase
  "Firebase (Google)": {
    dpaContact: "https://firebase.google.com/terms/data-processing-terms",
    privacyEmail: "data-protection-office@google.com",
    dataDeletionUrl: "https://firebase.google.com/support/privacy",
    statusPageUrl: "https://status.firebase.google.com",
    securityIncidentUrl: "https://about.google/appsecurity/",
  },

  // Cloudflare
  Cloudflare: {
    dpaContact: "https://www.cloudflare.com/cloudflare-customer-dpa/",
    privacyEmail: "privacyquestions@cloudflare.com",
    dataDeletionUrl: "https://www.cloudflare.com/privacypolicy/",
    statusPageUrl: "https://www.cloudflarestatus.com",
    securityIncidentUrl: "https://hackerone.com/cloudflare",
  },

  // Vercel AI SDK
  "Vercel AI SDK": {
    dpaContact: "https://vercel.com/legal/dpa",
    privacyEmail: "privacy@vercel.com",
    dataDeletionUrl: "https://vercel.com/legal/privacy-policy",
    statusPageUrl: "https://www.vercel-status.com",
    securityIncidentUrl: "security@vercel.com",
  },
  "Vercel AI SDK (OpenAI)": {
    dpaContact: "https://vercel.com/legal/dpa",
    privacyEmail: "privacy@vercel.com",
    dataDeletionUrl: "https://vercel.com/legal/privacy-policy",
    statusPageUrl: "https://www.vercel-status.com",
    securityIncidentUrl: "security@vercel.com",
  },
  "Vercel AI SDK (Anthropic)": {
    dpaContact: "https://vercel.com/legal/dpa",
    privacyEmail: "privacy@vercel.com",
    dataDeletionUrl: "https://vercel.com/legal/privacy-policy",
    statusPageUrl: "https://www.vercel-status.com",
    securityIncidentUrl: "security@vercel.com",
  },
  "Vercel AI SDK (Google)": {
    dpaContact: "https://vercel.com/legal/dpa",
    privacyEmail: "privacy@vercel.com",
    dataDeletionUrl: "https://vercel.com/legal/privacy-policy",
    statusPageUrl: "https://www.vercel-status.com",
    securityIncidentUrl: "security@vercel.com",
  },
  "Vercel AI SDK (Google Vertex)": {
    dpaContact: "https://vercel.com/legal/dpa",
    privacyEmail: "privacy@vercel.com",
    dataDeletionUrl: "https://vercel.com/legal/privacy-policy",
    statusPageUrl: "https://www.vercel-status.com",
    securityIncidentUrl: "security@vercel.com",
  },

  // Upstash
  "Upstash Redis": {
    dpaContact: "https://upstash.com/trust/dpa",
    privacyEmail: "privacy@upstash.com",
    dataDeletionUrl: "https://upstash.com/trust/privacy-policy",
    statusPageUrl: "https://status.upstash.com",
    securityIncidentUrl: "security@upstash.com",
  },

  // Meilisearch
  Meilisearch: {
    dpaContact: "https://www.meilisearch.com/privacy-policy",
    privacyEmail: "privacy@meilisearch.com",
    dataDeletionUrl: "https://www.meilisearch.com/privacy-policy",
    statusPageUrl: "https://status.meilisearch.com",
    securityIncidentUrl: "security@meilisearch.com",
  },
};

/** Services that are self-hosted (not third-party vendors). */
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

/**
 * Build a deduplicated list of vendor contacts from scan results.
 */
function buildVendorContactList(scan: ScanResult): VendorContact[] {
  const seen = new Set<string>();
  const contacts: VendorContact[] = [];

  for (const service of scan.services) {
    // Skip self-hosted services
    if (SELF_HOSTED.has(service.name)) continue;

    const providerName = PROVIDER_NAMES[service.name] || service.name;
    if (seen.has(providerName)) continue;
    seen.add(providerName);

    const known = VENDOR_CONTACT_DIRECTORY[providerName];
    if (known) {
      contacts.push({ provider: providerName, ...known });
    } else {
      contacts.push({
        provider: providerName,
        dpaContact: "[Request from vendor]",
        privacyEmail: "[Contact vendor directly]",
        dataDeletionUrl: "[Check vendor documentation]",
        statusPageUrl: "[Check vendor documentation]",
        securityIncidentUrl: "[Check vendor documentation]",
      });
    }
  }

  return contacts;
}

/**
 * Generate a VENDOR_CONTACTS.md listing DPA contacts, privacy emails,
 * data deletion URLs, status pages, and security incident reporting
 * for each detected third-party service.
 *
 * Returns null when no third-party services are detected.
 */
export function generateVendorContacts(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  const contacts = buildVendorContactList(scan);

  if (contacts.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const date = new Date().toISOString().split("T")[0];

  const sections: string[] = [];

  // ── Title ──────────────────────────────────────────────────────────

  sections.push(`# Vendor Contacts Directory

**Last updated:** ${date}

**Project:** ${scan.projectName}

**Data Controller:** ${company}

---

## Overview

This document provides contact information for all detected third-party service providers (vendors) used by the **${scan.projectName}** application. It is intended as a quick-reference for Data Subject Access Request (DSAR) handling, Data Processing Agreement (DPA) management, incident response coordination, and ongoing vendor oversight.

For questions about vendor relationships, contact ${email}.

---

## Vendor Contact Table`);

  // ── Summary Table ──────────────────────────────────────────────────

  let table = `
| Vendor | Privacy Email | DPA Contact | Data Deletion | Status Page | Incident Reporting |
|--------|--------------|-------------|---------------|-------------|-------------------|`;

  for (const c of contacts) {
    const privacyCell = c.privacyEmail.includes("@")
      ? c.privacyEmail
      : c.privacyEmail;
    const dpaCell = c.dpaContact.startsWith("http")
      ? `[Link](${c.dpaContact})`
      : c.dpaContact;
    const deletionCell = c.dataDeletionUrl.startsWith("http")
      ? `[Link](${c.dataDeletionUrl})`
      : c.dataDeletionUrl;
    const statusCell = c.statusPageUrl.startsWith("http")
      ? `[Link](${c.statusPageUrl})`
      : c.statusPageUrl;
    const incidentCell = c.securityIncidentUrl.startsWith("http")
      ? `[Link](${c.securityIncidentUrl})`
      : c.securityIncidentUrl;

    table += `\n| ${c.provider} | ${privacyCell} | ${dpaCell} | ${deletionCell} | ${statusCell} | ${incidentCell} |`;
  }

  sections.push(table);

  // ── Detailed Vendor Cards ──────────────────────────────────────────

  sections.push(`
---

## Detailed Vendor Contacts`);

  for (const c of contacts) {
    sections.push(`
### ${c.provider}

| Contact Type | Details |
|-------------|---------|
| **Privacy Email** | ${c.privacyEmail} |
| **DPA Request** | ${c.dpaContact} |
| **Data Deletion** | ${c.dataDeletionUrl} |
| **Status Page** | ${c.statusPageUrl} |
| **Security Incidents** | ${c.securityIncidentUrl} |`);
  }

  // ── DSAR Quick-Reference ───────────────────────────────────────────

  sections.push(`
---

## DSAR Quick-Reference Checklist

When handling a Data Subject Access Request, use this checklist to ensure all vendors are notified:

| Step | Action |
|------|--------|
| 1 | Identify which vendors hold data for the requesting data subject |
| 2 | Email each vendor's privacy team (see table above) with the DSAR details |
| 3 | Request data export and/or deletion within the legal timeframe |
| 4 | Track vendor responses — set a 14-day follow-up reminder per vendor |
| 5 | Confirm all vendors have completed the request before responding to the data subject |
| 6 | Document vendor responses in the DSAR log |

### Response Deadlines

- **GDPR:** 30 calendar days (extendable to 90 for complex requests)
- **CCPA:** 45 calendar days (extendable to 90)

---

## Maintaining This Document

- **Review frequency:** Quarterly, or whenever a new third-party service is added
- **Ownership:** Data Protection Officer / Privacy Team
- **Update process:** Re-run Codepliant to regenerate from current codebase, then verify contact details

---

*This vendor contacts directory was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Contact details are based on publicly available information at the time of generation. Verify all URLs and email addresses before use, as vendors may update their contact information.*`);

  return sections.join("\n");
}
