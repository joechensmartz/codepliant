import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/** Minimum number of third-party services required to generate the notification. */
const MIN_SERVICES = 3;

/** Self-hosted services that are not sub-processors. */
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

/** Map package names to human-readable provider names. */
const PROVIDER_NAMES: Record<string, string> = {
  openai: "OpenAI",
  "@anthropic-ai/sdk": "Anthropic",
  "@google/generative-ai": "Google (Gemini)",
  replicate: "Replicate",
  "together-ai": "Together AI",
  cohere: "Cohere",
  "@pinecone-database/pinecone": "Pinecone",
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
 * Generate SUBPROCESSOR_CHANGE_NOTIFICATION.md — a template for notifying
 * customers when sub-processors change. Required by many DPAs.
 * Pre-filled with detected services.
 *
 * Returns null when fewer than MIN_SERVICES third-party services are detected.
 */
export function generateSubprocessorChangeNotification(
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
  const dpoEmail = ctx?.dpoEmail || email;
  const website = ctx?.website || "[https://yoursite.com]";
  const date = new Date().toISOString().split("T")[0];

  // Deduplicate by provider name
  const seen = new Set<string>();
  const providers: Array<{ name: string; purpose: string; data: string }> = [];
  for (const service of thirdPartyServices) {
    const providerName = PROVIDER_NAMES[service.name] || service.name;
    if (seen.has(providerName)) continue;
    seen.add(providerName);
    providers.push({
      name: providerName,
      purpose: CATEGORY_PURPOSES[service.category] || CATEGORY_PURPOSES["other"],
      data: service.dataCollected.join(", "),
    });
  }

  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────────
  lines.push("# Sub-Processor Change Notification");
  lines.push("");
  lines.push(`**From:** ${company}`);
  lines.push(`**Date:** ${date}`);
  lines.push(`**Subject:** Notice of Sub-Processor Change`);
  lines.push("");
  lines.push("---");
  lines.push("");

  // ── Purpose ─────────────────────────────────────────────────────────────
  lines.push("## 1. Purpose of This Notice");
  lines.push("");
  lines.push(
    `In accordance with our Data Processing Agreement (DPA) and applicable data protection regulations (including GDPR Article 28), ${company} is providing this notice regarding changes to the sub-processors used in connection with our services.`,
  );
  lines.push("");
  lines.push(
    "This notification is sent to all customers and data controllers who have entered into a DPA with us, as required under our contractual obligations.",
  );
  lines.push("");

  // ── Change Details Template ─────────────────────────────────────────────
  lines.push("## 2. Sub-Processor Change Details");
  lines.push("");
  lines.push("### New Sub-Processor(s)");
  lines.push("");
  lines.push("| Field | Details |");
  lines.push("|-------|---------|");
  lines.push("| **Sub-Processor Name** | [New Sub-Processor Name] |");
  lines.push("| **Purpose of Processing** | [Description of processing activities] |");
  lines.push("| **Data Processed** | [Types of personal data processed] |");
  lines.push("| **Location** | [Country/Region] |");
  lines.push("| **Transfer Mechanism** | [SCCs / Adequacy Decision / BCRs] |");
  lines.push("| **DPA Status** | [Signed / Pending] |");
  lines.push("| **Effective Date** | [Date when processing will begin] |");
  lines.push("");

  lines.push("### Removed Sub-Processor(s)");
  lines.push("");
  lines.push("| Field | Details |");
  lines.push("|-------|---------|");
  lines.push("| **Sub-Processor Name** | [Removed Sub-Processor Name] |");
  lines.push("| **Reason for Removal** | [Contract expiry / Replacement / Service change] |");
  lines.push("| **Data Deletion Date** | [Date when data will be deleted/returned] |");
  lines.push("| **Effective Date** | [Date when processing ceased] |");
  lines.push("");

  lines.push("### Replaced Sub-Processor(s)");
  lines.push("");
  lines.push("| Field | Details |");
  lines.push("|-------|---------|");
  lines.push("| **Previous Sub-Processor** | [Name] |");
  lines.push("| **New Sub-Processor** | [Name] |");
  lines.push("| **Reason for Replacement** | [Better security / Cost / Feature requirements] |");
  lines.push("| **Data Migration Plan** | [How data will be transferred] |");
  lines.push("| **Effective Date** | [Date of switchover] |");
  lines.push("");

  // ── Current Sub-Processors ──────────────────────────────────────────────
  lines.push("## 3. Current Sub-Processor List");
  lines.push("");
  lines.push("For reference, the following sub-processors are currently engaged:");
  lines.push("");
  lines.push("| Sub-Processor | Purpose | Data Processed |");
  lines.push("|--------------|---------|---------------|");
  for (const p of providers) {
    lines.push(`| ${p.name} | ${p.purpose} | ${p.data} |`);
  }
  lines.push("");
  lines.push(
    `The complete and up-to-date sub-processor list is maintained at ${website}/legal/sub-processors (or in the \`SUBPROCESSOR_LIST.md\` document).`,
  );
  lines.push("");

  // ── Due Diligence ───────────────────────────────────────────────────────
  lines.push("## 4. Due Diligence Undertaken");
  lines.push("");
  lines.push(
    `Before engaging any new sub-processor, ${company} conducts the following assessments:`,
  );
  lines.push("");
  lines.push("- **Security Assessment** — Review of the sub-processor's security measures, certifications (SOC 2, ISO 27001), and incident response capabilities");
  lines.push("- **Privacy Assessment** — Review of data processing practices, privacy policy, and DPA terms");
  lines.push("- **Legal Assessment** — Evaluation of applicable law, transfer mechanisms, and regulatory compliance");
  lines.push("- **Contractual Safeguards** — Execution of a Data Processing Agreement with Standard Contractual Clauses where required");
  lines.push("");

  // ── Right to Object ─────────────────────────────────────────────────────
  lines.push("## 5. Your Right to Object");
  lines.push("");
  lines.push(
    "In accordance with our DPA, you have the right to object to the appointment of a new sub-processor. To exercise this right:",
  );
  lines.push("");
  lines.push("1. **Objection Period:** You have **30 days** from the date of this notification to raise an objection.");
  lines.push(`2. **How to Object:** Send your objection in writing to ${dpoEmail} with:`);
  lines.push("   - Your company name and DPA reference number");
  lines.push("   - The specific sub-processor you are objecting to");
  lines.push("   - The grounds for your objection");
  lines.push("3. **Resolution Process:**");
  lines.push(`   - ${company} will acknowledge your objection within 5 business days`);
  lines.push("   - We will work with you in good faith to find a reasonable resolution");
  lines.push("   - If no resolution can be reached, either party may terminate the affected services in accordance with the DPA");
  lines.push("");
  lines.push(
    "If no objection is received within the objection period, the sub-processor change will proceed as described above.",
  );
  lines.push("");

  // ── Impact Assessment ───────────────────────────────────────────────────
  lines.push("## 6. Impact on Data Protection");
  lines.push("");
  lines.push(
    `${company} confirms that this sub-processor change:`,
  );
  lines.push("");
  lines.push("- [ ] Does not reduce the overall level of data protection provided under the DPA");
  lines.push("- [ ] Maintains equivalent or stronger security measures");
  lines.push("- [ ] Does not change the categories of personal data processed");
  lines.push("- [ ] Does not extend data processing to new jurisdictions without appropriate safeguards");
  lines.push("- [ ] Includes appropriate contractual protections (DPA/SCCs)");
  lines.push("");

  // ── Contact ─────────────────────────────────────────────────────────────
  lines.push("## 7. Contact Information");
  lines.push("");
  lines.push("For questions about this sub-processor change notification:");
  lines.push("");
  lines.push(`- **Privacy/DPO Contact:** ${dpoEmail}`);
  lines.push(`- **General Contact:** ${email}`);
  lines.push(`- **Sub-Processor List:** ${website}/legal/sub-processors`);
  lines.push("");

  // ── Footer ──────────────────────────────────────────────────────────────
  lines.push("---");
  lines.push("");
  lines.push(
    "*This Sub-Processor Change Notification template was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on code analysis. " +
      "Complete the bracketed fields before sending to customers. Review with legal counsel to ensure compliance with your specific DPA obligations.*",
  );
  lines.push("");

  return lines.join("\n");
}
