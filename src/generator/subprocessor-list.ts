import type { ScanResult, DetectedService } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/** Minimum number of third-party services required to generate the sub-processor list. */
const MIN_SERVICES = 3;

/** US-based providers (mirrors privacy-policy.ts). */
const US_BASED_PROVIDERS = new Set([
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
]);

/** EU-based providers. */
const EU_BASED_PROVIDERS = new Set([
  "@lemonsqueezy/lemonsqueezy.js",
  "@meilisearch/instant-meilisearch",
  "crisp-sdk-web",
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
  "next-auth": "NextAuth.js",
  "@clerk/nextjs": "Clerk",
  "@supabase/supabase-js": "Supabase",
  "@auth/core": "Auth.js",
  "better-auth": "Better Auth",
  passport: "Passport.js",
  "@sendgrid/mail": "SendGrid (Twilio)",
  resend: "Resend",
  nodemailer: "Nodemailer",
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
  "web-push": "Web Push (self-hosted)",
  bullmq: "BullMQ (self-hosted)",
  prisma: "Prisma (self-hosted)",
  drizzle: "Drizzle (self-hosted)",
  mongoose: "Mongoose (self-hosted)",
  ioredis: "Redis (self-hosted)",
  redis: "Redis (self-hosted)",
  "@upstash/redis": "Upstash Redis",
  "passport-google-oauth20": "Google OAuth",
  "passport-microsoft": "Microsoft OAuth",
  "@simplewebauthn/server": "SimpleWebAuthn (self-hosted)",
};

/** Map package names to privacy policy URLs (from ai-disclosure.ts + extended). */
const PRIVACY_POLICY_URLS: Record<string, string> = {
  openai: "https://openai.com/policies/privacy-policy",
  "@anthropic-ai/sdk": "https://www.anthropic.com/privacy",
  "@google/generative-ai": "https://ai.google/responsibility/privacy/",
  replicate: "https://replicate.com/privacy",
  "together-ai": "https://www.together.ai/privacy",
  cohere: "https://cohere.com/privacy",
  "@pinecone-database/pinecone": "https://www.pinecone.io/privacy/",
  langchain: "https://www.langchain.com/privacy-policy",
  stripe: "https://stripe.com/privacy",
  "@paypal/checkout-server-sdk": "https://www.paypal.com/webapps/mpp/ua/privacy-full",
  "@lemonsqueezy/lemonsqueezy.js": "https://www.lemonsqueezy.com/privacy",
  "@google-analytics/data": "https://policies.google.com/privacy",
  posthog: "https://posthog.com/privacy",
  mixpanel: "https://mixpanel.com/legal/privacy-policy",
  "@amplitude/analytics-browser": "https://amplitude.com/privacy",
  "@vercel/analytics": "https://vercel.com/legal/privacy-policy",
  hotjar: "https://www.hotjar.com/privacy/",
  "@clerk/nextjs": "https://clerk.com/legal/privacy",
  "@supabase/supabase-js": "https://supabase.com/privacy",
  "@sendgrid/mail": "https://www.twilio.com/legal/privacy",
  resend: "https://resend.com/legal/privacy-policy",
  postmark: "https://postmarkapp.com/privacy-policy",
  "@sentry/node": "https://sentry.io/privacy/",
  "@sentry/nextjs": "https://sentry.io/privacy/",
  "@sentry/react": "https://sentry.io/privacy/",
  "@sentry/nestjs": "https://sentry.io/privacy/",
  "@sentry/profiling-node": "https://sentry.io/privacy/",
  "@aws-sdk/client-s3": "https://aws.amazon.com/privacy/",
  "@aws-sdk/client-ses": "https://aws.amazon.com/privacy/",
  "@aws-sdk/client-sns": "https://aws.amazon.com/privacy/",
  "@uploadthing/react": "https://uploadthing.com/privacy",
  cloudinary: "https://cloudinary.com/privacy",
  twilio: "https://www.twilio.com/legal/privacy",
  "@twilio/voice-sdk": "https://www.twilio.com/legal/privacy",
  intercom: "https://www.intercom.com/legal/privacy",
  "@intercom/messenger-js-sdk": "https://www.intercom.com/legal/privacy",
  "@hubspot/api-client": "https://legal.hubspot.com/privacy-policy",
  "launchdarkly-js-client-sdk": "https://launchdarkly.com/policies/privacy/",
  "@launchdarkly/node-server-sdk": "https://launchdarkly.com/policies/privacy/",
  "@segment/analytics-next": "https://www.twilio.com/legal/privacy",
  algoliasearch: "https://www.algolia.com/policies/privacy/",
  "@onesignal/node-onesignal": "https://onesignal.com/privacy_policy",
  firebase: "https://firebase.google.com/support/privacy",
  "firebase-admin": "https://firebase.google.com/support/privacy",
  "dd-trace": "https://www.datadoghq.com/legal/privacy/",
  "@cloudflare/workers-types": "https://www.cloudflare.com/privacypolicy/",
  "@vercel/ai": "https://vercel.com/legal/privacy-policy",
  "@ai-sdk/openai": "https://vercel.com/legal/privacy-policy",
  "@ai-sdk/anthropic": "https://vercel.com/legal/privacy-policy",
  "@ai-sdk/google": "https://vercel.com/legal/privacy-policy",
  "@ai-sdk/google-vertex": "https://vercel.com/legal/privacy-policy",
  googleapis: "https://policies.google.com/privacy",
  "google-auth-library": "https://policies.google.com/privacy",
  "@google-cloud/storage": "https://cloud.google.com/terms/cloud-privacy-notice",
  "@google-cloud/kms": "https://cloud.google.com/terms/cloud-privacy-notice",
  plaid: "https://plaid.com/legal/#end-user-privacy-policy",
  "@mailchimp/mailchimp_marketing": "https://www.intuit.com/privacy/statement/",
  "@mailchimp/mailchimp_transactional": "https://www.intuit.com/privacy/statement/",
  "crisp-sdk-web": "https://crisp.chat/en/privacy/",
  "@meilisearch/instant-meilisearch": "https://www.meilisearch.com/privacy-policy",
  "@upstash/redis": "https://upstash.com/trust/privacy-policy",
};

/** Map service categories to human-readable purpose descriptions. */
const CATEGORY_PURPOSES: Record<string, string> = {
  ai: "AI processing and content generation",
  payment: "Payment processing and billing",
  analytics: "Product analytics and usage tracking",
  auth: "User authentication and identity management",
  email: "Transactional and marketing email delivery",
  database: "Data storage and management",
  storage: "File storage and media hosting",
  monitoring: "Error tracking and performance monitoring",
  advertising: "Advertising and ad measurement",
  social: "Social media integration",
  other: "Third-party service integration",
};

/**
 * Generate a SUBPROCESSOR_LIST.md listing all detected third-party services.
 * Returns null when fewer than MIN_SERVICES third-party services are detected.
 */
export function generateSubprocessorList(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  // Filter to third-party services only (exclude self-hosted / database ORMs)
  const thirdPartyServices = scan.services.filter(
    (s) => !isSelfHosted(s.name),
  );

  if (thirdPartyServices.length < MIN_SERVICES) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const date = new Date().toISOString().split("T")[0];

  // Deduplicate by provider name (e.g. multiple Sentry packages → one row)
  const seen = new Set<string>();
  const rows: SubprocessorRow[] = [];

  for (const service of thirdPartyServices) {
    const providerName = PROVIDER_NAMES[service.name] || service.name;
    if (seen.has(providerName)) continue;
    seen.add(providerName);

    rows.push({
      provider: providerName,
      purpose: CATEGORY_PURPOSES[service.category] || CATEGORY_PURPOSES["other"],
      dataProcessed: service.dataCollected.join(", "),
      location: getLocation(service.name),
      privacyPolicyUrl: PRIVACY_POLICY_URLS[service.name] || "#",
    });
  }

  const sections: string[] = [];

  // ── Title ──────────────────────────────────────────────────────────

  sections.push(`# Sub-Processor List

**Last updated:** ${date}

**Project:** ${scan.projectName}

**Data Controller:** ${company}

---

## Overview

This document lists the third-party sub-processors that process personal data on behalf of ${company} in connection with the operation of this application. Each sub-processor has been assessed for compliance with applicable data protection requirements.

For questions about our sub-processors, contact us at ${email}.

---

## Sub-Processors`);

  // ── Table ──────────────────────────────────────────────────────────

  let table = `
| Sub-Processor | Purpose | Data Processed | Location | Privacy Policy |
|--------------|---------|---------------|----------|---------------|`;

  for (const row of rows) {
    table += `\n| ${row.provider} | ${row.purpose} | ${row.dataProcessed} | ${row.location} | [Link](${row.privacyPolicyUrl}) |`;
  }

  sections.push(table);

  // ── Notes ──────────────────────────────────────────────────────────

  sections.push(`
---

## Changes to This List

We may update this sub-processor list from time to time to reflect changes in the third-party services we use. Material changes will be communicated in accordance with our Data Processing Agreement.

## How to Object

If you have concerns about a sub-processor, please contact us at ${email}. Under our Data Processing Agreement, you may object to the appointment of a new sub-processor.

---

*This sub-processor list was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Review and verify all entries for accuracy.*`);

  return sections.join("\n");
}

interface SubprocessorRow {
  provider: string;
  purpose: string;
  dataProcessed: string;
  location: string;
  privacyPolicyUrl: string;
}

/** Determine the location of a service provider. */
function getLocation(serviceName: string): string {
  if (US_BASED_PROVIDERS.has(serviceName)) return "US";
  if (EU_BASED_PROVIDERS.has(serviceName)) return "EU";
  return "US";
}

/** Check if a service is self-hosted (not a third-party sub-processor). */
function isSelfHosted(serviceName: string): boolean {
  const selfHosted = new Set([
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
  return selfHosted.has(serviceName);
}
