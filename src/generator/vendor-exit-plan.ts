import type { ScanResult, DetectedService } from "../scanner/types.js";
import type { GeneratorContext } from "./index.js";

/** Minimum number of third-party services required to generate the exit plan. */
const MIN_SERVICES = 2;

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

// ── Alternative services by category ────────────────────────────────────

interface VendorExitInfo {
  alternatives: string[];
  dataExportMethod: string;
  migrationComplexity: "low" | "medium" | "high";
  estimatedTimeline: string;
  dataPortability: string;
  contractTermination: string;
  keyRisks: string[];
}

const EXIT_INFO: Record<string, VendorExitInfo> = {
  // AI
  OpenAI: {
    alternatives: ["Anthropic", "Google Gemini", "Mistral AI", "Llama (self-hosted)", "Cohere"],
    dataExportMethod: "API: retrieve fine-tuning data; Dashboard: export usage logs",
    migrationComplexity: "medium",
    estimatedTimeline: "2-4 weeks",
    dataPortability: "Fine-tuning datasets exportable; conversation logs available via API",
    contractTermination: "Cancel subscription via dashboard; API keys remain active until end of billing cycle",
    keyRisks: ["Model behavior differences between providers", "Prompt engineering rework required", "Rate limit and pricing model changes"],
  },
  Anthropic: {
    alternatives: ["OpenAI", "Google Gemini", "Mistral AI", "Llama (self-hosted)", "Cohere"],
    dataExportMethod: "API: export conversation data; Contact support for bulk data export",
    migrationComplexity: "medium",
    estimatedTimeline: "2-4 weeks",
    dataPortability: "Conversation logs available via API; no proprietary data format lock-in",
    contractTermination: "Cancel via account settings; usage-based billing stops immediately",
    keyRisks: ["Model behavior differences between providers", "Prompt engineering rework required", "Constitutional AI approach differences"],
  },
  "Google (Gemini)": {
    alternatives: ["OpenAI", "Anthropic", "Mistral AI", "Llama (self-hosted)"],
    dataExportMethod: "Google Takeout for consumer data; Cloud Console for enterprise data",
    migrationComplexity: "medium",
    estimatedTimeline: "2-4 weeks",
    dataPortability: "Standard API formats; Google Takeout for data export",
    contractTermination: "Cancel via Google Cloud Console; 30-day data retention post-cancellation",
    keyRisks: ["Multi-modal capability differences", "Google ecosystem integration dependencies"],
  },
  Replicate: {
    alternatives: ["Together AI", "Modal", "RunPod", "Self-hosted inference"],
    dataExportMethod: "Download models and training data via API",
    migrationComplexity: "low",
    estimatedTimeline: "1-2 weeks",
    dataPortability: "Models and data fully exportable; standard formats used",
    contractTermination: "Cancel via dashboard; pay-per-use billing stops immediately",
    keyRisks: ["Model hosting infrastructure differences", "Cold start latency changes"],
  },

  // Payment
  Stripe: {
    alternatives: ["PayPal/Braintree", "Adyen", "Square", "Paddle", "Lemon Squeezy"],
    dataExportMethod: "Dashboard: export transactions, customers, invoices as CSV; API: bulk data retrieval",
    migrationComplexity: "high",
    estimatedTimeline: "4-8 weeks",
    dataPortability: "Full transaction history, customer data, and subscription data exportable via API and dashboard",
    contractTermination: "Cancel via dashboard; must migrate active subscriptions before closure; 90-day data access post-closure",
    keyRisks: ["Active subscription migration complexity", "PCI compliance re-certification with new provider", "Webhook endpoint reconfiguration", "Payment method re-collection from customers"],
  },
  PayPal: {
    alternatives: ["Stripe", "Adyen", "Square", "Paddle"],
    dataExportMethod: "Dashboard: download transaction history; API: retrieve transaction data",
    migrationComplexity: "high",
    estimatedTimeline: "4-8 weeks",
    dataPortability: "Transaction history exportable; recurring payment profiles accessible via API",
    contractTermination: "Close account via settings; outstanding transactions must be resolved first",
    keyRisks: ["Recurring billing migration", "Customer re-authorization required", "Dispute resolution transfer"],
  },
  "Lemon Squeezy": {
    alternatives: ["Stripe", "Paddle", "Gumroad", "FastSpring"],
    dataExportMethod: "Dashboard: export orders, customers, subscriptions as CSV",
    migrationComplexity: "medium",
    estimatedTimeline: "2-4 weeks",
    dataPortability: "Order and customer data exportable via dashboard",
    contractTermination: "Cancel via dashboard; active subscriptions must be migrated",
    keyRisks: ["Subscription migration", "Tax handling differences with new provider"],
  },
  Plaid: {
    alternatives: ["Yodlee", "MX", "Finicity", "Tink (EU)"],
    dataExportMethod: "API: retrieve linked account data; Contact support for bulk export",
    migrationComplexity: "high",
    estimatedTimeline: "4-8 weeks",
    dataPortability: "Account connection data accessible via API; users must re-link with new provider",
    contractTermination: "Contact account team; enterprise agreements may have termination clauses",
    keyRisks: ["Users must re-authenticate bank connections", "Coverage differences between providers", "Regulatory compliance variations"],
  },

  // Analytics
  "Google Analytics": {
    alternatives: ["PostHog", "Plausible", "Fathom", "Matomo (self-hosted)", "Mixpanel"],
    dataExportMethod: "BigQuery Export, Google Analytics API, or manual CSV export from dashboard",
    migrationComplexity: "medium",
    estimatedTimeline: "2-4 weeks",
    dataPortability: "Historical data exportable via BigQuery or API; raw event data available",
    contractTermination: "Delete property from GA dashboard; data retained for 26 months by default",
    keyRisks: ["Historical data format conversion", "Custom event taxonomy mapping", "Attribution model differences"],
  },
  PostHog: {
    alternatives: ["Mixpanel", "Amplitude", "Google Analytics", "Plausible", "Matomo (self-hosted)"],
    dataExportMethod: "Dashboard: export events; API: bulk event retrieval; self-hosted: direct database access",
    migrationComplexity: "medium",
    estimatedTimeline: "2-3 weeks",
    dataPortability: "Full event data exportable; open-source version allows direct database access",
    contractTermination: "Cancel subscription via dashboard; self-hosted instances can continue indefinitely",
    keyRisks: ["Feature flag migration if using PostHog flags", "Session recording data non-transferable"],
  },
  Mixpanel: {
    alternatives: ["Amplitude", "PostHog", "Google Analytics", "Heap"],
    dataExportMethod: "Data Export API: raw event data; Dashboard: CSV reports",
    migrationComplexity: "medium",
    estimatedTimeline: "2-3 weeks",
    dataPortability: "Raw event data exportable via API; user profiles accessible",
    contractTermination: "Cancel via dashboard or contact support; data deleted after retention period",
    keyRisks: ["Event taxonomy mapping", "Funnel and retention analysis reconfiguration"],
  },
  Amplitude: {
    alternatives: ["Mixpanel", "PostHog", "Google Analytics", "Heap"],
    dataExportMethod: "Export API: raw event data; Amazon S3 export for enterprise plans",
    migrationComplexity: "medium",
    estimatedTimeline: "2-3 weeks",
    dataPortability: "Event data exportable via API or S3 integration",
    contractTermination: "Cancel via settings; enterprise contracts may require notice period",
    keyRisks: ["Behavioral cohort migration", "Chart and dashboard recreation"],
  },

  // Auth
  Clerk: {
    alternatives: ["Auth0", "Supabase Auth", "NextAuth.js (self-hosted)", "Firebase Auth", "Keycloak (self-hosted)"],
    dataExportMethod: "API: export user data; Dashboard: bulk user export",
    migrationComplexity: "high",
    estimatedTimeline: "3-6 weeks",
    dataPortability: "User profiles, metadata, and organization data exportable via API",
    contractTermination: "Cancel via dashboard; user data retained for 30 days post-cancellation",
    keyRisks: ["User session invalidation during migration", "OAuth provider reconnection", "Password hash format compatibility"],
  },
  Supabase: {
    alternatives: ["Firebase", "PlanetScale + Auth0", "Neon + Clerk", "Self-hosted PostgreSQL"],
    dataExportMethod: "pg_dump for database; Dashboard: export auth users; Storage: download via API",
    migrationComplexity: "medium",
    estimatedTimeline: "2-4 weeks",
    dataPortability: "Full PostgreSQL dump available; auth users exportable; storage files downloadable",
    contractTermination: "Delete project from dashboard; data deleted within 30 days",
    keyRisks: ["RLS policy migration", "Auth provider reconfiguration", "Realtime subscription refactoring"],
  },

  // Email
  SendGrid: {
    alternatives: ["Resend", "Postmark", "Amazon SES", "Mailgun", "SparkPost"],
    dataExportMethod: "API: export contact lists, templates, and activity; Dashboard: CSV export",
    migrationComplexity: "medium",
    estimatedTimeline: "2-3 weeks",
    dataPortability: "Contact lists, templates, and suppression lists exportable",
    contractTermination: "Cancel via dashboard; account data retained for 30 days",
    keyRisks: ["IP reputation does not transfer", "Template format conversion", "Suppression list migration"],
  },
  Resend: {
    alternatives: ["SendGrid", "Postmark", "Amazon SES", "Mailgun"],
    dataExportMethod: "API: retrieve email logs and domain configuration",
    migrationComplexity: "low",
    estimatedTimeline: "1-2 weeks",
    dataPortability: "Email logs accessible via API; domain DNS changes straightforward",
    contractTermination: "Cancel via dashboard; usage-based billing stops immediately",
    keyRisks: ["DNS record updates for domain verification", "Webhook endpoint reconfiguration"],
  },
  Postmark: {
    alternatives: ["Resend", "SendGrid", "Amazon SES", "Mailgun"],
    dataExportMethod: "API: export message streams, templates, and bounce data",
    migrationComplexity: "low",
    estimatedTimeline: "1-2 weeks",
    dataPortability: "Templates and suppression lists exportable via API",
    contractTermination: "Cancel via dashboard; data retained for limited period post-cancellation",
    keyRisks: ["Template syntax differences", "Delivery reputation rebuilding"],
  },

  // Monitoring
  Sentry: {
    alternatives: ["Datadog", "Bugsnag", "Rollbar", "LogRocket", "GlitchTip (self-hosted)"],
    dataExportMethod: "API: export issues, events, and project data; Discover: CSV export",
    migrationComplexity: "low",
    estimatedTimeline: "1-2 weeks",
    dataPortability: "Issue and event data exportable via API; source maps stored locally",
    contractTermination: "Cancel via organization settings; data deleted after retention period",
    keyRisks: ["Alert rule migration", "Release tracking reconfiguration", "Source map upload pipeline changes"],
  },
  Datadog: {
    alternatives: ["Sentry", "New Relic", "Grafana Cloud", "Elastic Observability", "Self-hosted Prometheus + Grafana"],
    dataExportMethod: "API: export dashboards, monitors, and log data; Historical metrics via API",
    migrationComplexity: "high",
    estimatedTimeline: "4-6 weeks",
    dataPortability: "Dashboard definitions exportable as JSON; historical metrics accessible via API",
    contractTermination: "Contact account team; enterprise contracts may have termination clauses",
    keyRisks: ["Custom metric naming convention changes", "Dashboard recreation", "APM instrumentation swap"],
  },

  // Storage
  "Amazon S3 (AWS)": {
    alternatives: ["Google Cloud Storage", "Azure Blob Storage", "Backblaze B2", "Cloudflare R2", "MinIO (self-hosted)"],
    dataExportMethod: "AWS CLI: aws s3 sync; SDK: programmatic download; S3 Batch Operations for large-scale",
    migrationComplexity: "medium",
    estimatedTimeline: "2-4 weeks (depends on data volume)",
    dataPortability: "All objects downloadable; metadata preserved; no proprietary format lock-in",
    contractTermination: "Delete S3 buckets; close AWS account; data transfer charges apply",
    keyRisks: ["Data transfer costs (egress fees)", "IAM policy migration", "Presigned URL expiration", "Cross-region latency changes"],
  },
  UploadThing: {
    alternatives: ["Cloudinary", "Amazon S3", "Vercel Blob", "Cloudflare R2"],
    dataExportMethod: "API: retrieve file URLs and metadata; bulk download via generated URLs",
    migrationComplexity: "low",
    estimatedTimeline: "1-2 weeks",
    dataPortability: "Files accessible via URLs; metadata available through API",
    contractTermination: "Cancel via dashboard; files retained for limited period",
    keyRisks: ["URL format changes", "Upload component replacement"],
  },
  Cloudinary: {
    alternatives: ["Imgix", "Amazon S3 + CloudFront", "Cloudflare Images", "Uploadcare"],
    dataExportMethod: "Admin API: bulk download assets; Dashboard: manual export",
    migrationComplexity: "medium",
    estimatedTimeline: "2-4 weeks",
    dataPortability: "All assets downloadable via API; transformation URLs are Cloudinary-specific",
    contractTermination: "Cancel via dashboard; assets retained for 30 days post-cancellation",
    keyRisks: ["Image transformation URL rewriting", "CDN cache invalidation", "On-the-fly transformation recreation"],
  },

  // CRM / Communication
  Intercom: {
    alternatives: ["Zendesk", "Crisp", "HelpScout", "Freshdesk", "Chatwoot (self-hosted)"],
    dataExportMethod: "Data export via Settings > Data Management; API: export conversations and contacts",
    migrationComplexity: "high",
    estimatedTimeline: "4-6 weeks",
    dataPortability: "Conversation history, contact data, and articles exportable",
    contractTermination: "Cancel via billing settings; annual contracts may have early termination fees",
    keyRisks: ["Conversation history migration", "Custom bot and workflow recreation", "Product tour migration"],
  },
  HubSpot: {
    alternatives: ["Salesforce", "Pipedrive", "Zoho CRM", "Close CRM"],
    dataExportMethod: "Settings: bulk data export; API: CRM object retrieval; GDPR: data portability request",
    migrationComplexity: "high",
    estimatedTimeline: "4-8 weeks",
    dataPortability: "Full CRM data exportable via Settings or API; includes contacts, deals, and activities",
    contractTermination: "Cancel via account settings; annual contracts have specific termination windows",
    keyRisks: ["Workflow and automation migration", "Custom property mapping", "Integration reconnection", "Email template migration"],
  },

  // Feature Flags
  LaunchDarkly: {
    alternatives: ["Unleash (self-hosted)", "Flagsmith", "ConfigCat", "Split.io", "PostHog Feature Flags"],
    dataExportMethod: "API: export flag configurations, segments, and environments",
    migrationComplexity: "medium",
    estimatedTimeline: "2-4 weeks",
    dataPortability: "Flag definitions and targeting rules exportable via API",
    contractTermination: "Contact account team; enterprise contracts may have notice periods",
    keyRisks: ["Feature flag evaluation logic differences", "Targeting rule syntax changes", "SDK integration swap"],
  },

  // Search
  Algolia: {
    alternatives: ["Meilisearch", "Typesense", "Elasticsearch (self-hosted)", "Solr (self-hosted)"],
    dataExportMethod: "API: export index data; Dashboard: download records",
    migrationComplexity: "medium",
    estimatedTimeline: "2-3 weeks",
    dataPortability: "Index data fully exportable via API in JSON format",
    contractTermination: "Cancel via dashboard; data deleted after account closure",
    keyRisks: ["Search relevance tuning recreation", "Query syntax differences", "InstantSearch UI component swap"],
  },

  // Firebase
  "Firebase (Google)": {
    alternatives: ["Supabase", "AWS Amplify", "Appwrite (self-hosted)", "PocketBase (self-hosted)"],
    dataExportMethod: "Firebase Console: export Firestore/RTDB; Authentication: export users via Admin SDK; Storage: download via gsutil",
    migrationComplexity: "high",
    estimatedTimeline: "4-8 weeks",
    dataPortability: "Firestore data exportable to BigQuery or JSON; Auth users exportable; Storage files downloadable",
    contractTermination: "Delete project from Firebase Console; data deleted within 180 days per Google policy",
    keyRisks: ["Security rules migration", "Cloud Functions refactoring", "Push notification provider change", "Offline sync capability differences"],
  },

  // Cloudflare
  Cloudflare: {
    alternatives: ["AWS CloudFront", "Fastly", "Akamai", "Vercel Edge Network"],
    dataExportMethod: "API: export DNS records, page rules, and worker scripts; Dashboard: manual export",
    migrationComplexity: "medium",
    estimatedTimeline: "2-4 weeks",
    dataPortability: "DNS records, worker scripts, and configuration exportable",
    contractTermination: "Cancel via dashboard; DNS changes required to point to new provider",
    keyRisks: ["DNS propagation during migration", "Workers/Edge function rewrite", "DDoS protection gap during transition"],
  },

  // Segment
  Segment: {
    alternatives: ["RudderStack (self-hosted)", "Jitsu", "Snowplow", "mParticle"],
    dataExportMethod: "Warehouses: data already synced; API: export source configurations and tracking plans",
    migrationComplexity: "medium",
    estimatedTimeline: "3-4 weeks",
    dataPortability: "Event data in connected warehouses; tracking plans exportable",
    contractTermination: "Contact account team; connected destinations continue to receive data until disconnected",
    keyRisks: ["Tracking plan migration", "Destination reconnection", "Identity resolution differences"],
  },

  // Upstash
  "Upstash Redis": {
    alternatives: ["Redis Cloud", "Amazon ElastiCache", "Self-hosted Redis", "Dragonfly"],
    dataExportMethod: "Redis CLI: DUMP/RESTORE commands; or use RDB snapshot",
    migrationComplexity: "low",
    estimatedTimeline: "1-2 weeks",
    dataPortability: "Standard Redis protocol; data fully portable via RDB or RESP",
    contractTermination: "Cancel via dashboard; data deleted after account closure",
    keyRisks: ["Connection string updates", "REST API to standard Redis protocol change if using HTTP mode"],
  },
};

/** Fallback exit info for unknown vendors. */
const DEFAULT_EXIT_INFO: VendorExitInfo = {
  alternatives: ["[Research alternatives based on your requirements]"],
  dataExportMethod: "[Contact vendor for data export procedures]",
  migrationComplexity: "medium",
  estimatedTimeline: "[Estimate based on integration depth and data volume]",
  dataPortability: "[Review vendor documentation for data portability options]",
  contractTermination: "[Review contract terms for termination procedures and notice periods]",
  keyRisks: ["Data migration complexity", "Service continuity during transition", "Contract termination fees"],
};

function complexityEmoji(c: "low" | "medium" | "high"): string {
  switch (c) {
    case "low": return "Low";
    case "medium": return "Medium";
    case "high": return "High";
  }
}

/**
 * Generate a VENDOR_EXIT_PLAN.md with migration strategies for each
 * detected third-party service.
 *
 * Required by some enterprise DPAs to demonstrate vendor independence.
 * Returns null when fewer than MIN_SERVICES third-party services are detected.
 */
export function generateVendorExitPlan(
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
  interface VendorPlan {
    provider: string;
    category: string;
    exitInfo: VendorExitInfo;
  }
  const plans: VendorPlan[] = [];

  for (const service of thirdPartyServices) {
    const providerName = PROVIDER_NAMES[service.name] || service.name;
    if (seen.has(providerName)) continue;
    seen.add(providerName);

    const exitInfo = EXIT_INFO[providerName] || DEFAULT_EXIT_INFO;
    plans.push({ provider: providerName, category: service.category, exitInfo });
  }

  const sections: string[] = [];

  // ── Title ──────────────────────────────────────────────────────────

  sections.push(`# Vendor Exit Plan

**Last updated:** ${date}

**Project:** ${scan.projectName}

**Organization:** ${company}

---

## Purpose

This document outlines the migration strategy for each third-party service provider integrated into **${scan.projectName}**. It ensures the organization can transition away from any vendor without unacceptable disruption to service delivery or data loss.

This plan is required by enterprise Data Processing Agreements (DPAs) and demonstrates vendor independence in accordance with business continuity best practices.

For questions about vendor exit strategies, contact ${email}.

---

## Executive Summary

| Vendor | Category | Migration Complexity | Estimated Timeline | Alternatives |
|--------|----------|---------------------|-------------------|-------------|`);

  for (const p of plans) {
    const alts = p.exitInfo.alternatives.slice(0, 3).join(", ");
    sections.push(
      `| ${p.provider} | ${p.category} | ${complexityEmoji(p.exitInfo.migrationComplexity)} | ${p.exitInfo.estimatedTimeline} | ${alts} |`,
    );
  }

  // ── Detailed Exit Plans ────────────────────────────────────────────

  sections.push(`
---

## Detailed Exit Plans`);

  for (const p of plans) {
    const info = p.exitInfo;
    const altList = info.alternatives.map((a) => `- ${a}`).join("\n");
    const riskList = info.keyRisks.map((r) => `- ${r}`).join("\n");

    sections.push(`
### ${p.provider}

**Category:** ${p.category}
**Migration Complexity:** ${complexityEmoji(info.migrationComplexity)}
**Estimated Timeline:** ${info.estimatedTimeline}

#### Data Export Procedures

${info.dataExportMethod}

#### Data Portability

${info.dataPortability}

#### Alternative Services

${altList}

#### Contract Termination

${info.contractTermination}

#### Key Migration Risks

${riskList}

#### Migration Checklist

- [ ] Identify all integration points in codebase
- [ ] Export all data from ${p.provider}
- [ ] Select and evaluate replacement service
- [ ] Implement replacement integration in staging
- [ ] Verify data migration completeness
- [ ] Update environment variables and configuration
- [ ] Test all affected functionality
- [ ] Deploy to production with rollback plan
- [ ] Confirm contract termination with ${p.provider}
- [ ] Verify data deletion from ${p.provider} per DPA requirements
- [ ] Update compliance documentation (privacy policy, sub-processor list)`);
  }

  // ── General Migration Framework ────────────────────────────────────

  sections.push(`
---

## General Migration Framework

### Phase 1: Planning (Week 1)

1. **Impact Assessment** — Identify all systems, features, and data flows dependent on the vendor
2. **Alternative Evaluation** — Score alternatives on feature parity, pricing, compliance, and data residency
3. **Stakeholder Communication** — Notify affected teams and set expectations for timeline
4. **Budget Approval** — Secure budget for migration effort and potential parallel running costs

### Phase 2: Preparation (Week 2-3)

1. **Data Export** — Execute full data export from current vendor
2. **Data Validation** — Verify export completeness and integrity
3. **Environment Setup** — Provision accounts and configure new vendor
4. **Code Changes** — Implement abstraction layer or direct replacement in codebase

### Phase 3: Migration (Week 3-4)

1. **Staging Deployment** — Deploy to staging with new vendor integration
2. **Regression Testing** — Run full test suite against new integration
3. **Performance Testing** — Verify latency, throughput, and reliability meet requirements
4. **Data Migration** — Import historical data into new vendor (if applicable)

### Phase 4: Cutover (Week 4+)

1. **Blue-Green Deployment** — Run both vendors in parallel during cutover window
2. **Production Switch** — Point production traffic to new vendor
3. **Monitoring** — Watch for errors, performance degradation, and data inconsistencies
4. **Old Vendor Cleanup** — Terminate contract, request data deletion, revoke API keys

### Phase 5: Post-Migration (Week 5+)

1. **Documentation Update** — Update privacy policy, sub-processor list, vendor contacts
2. **Compliance Review** — Verify new vendor meets all DPA and regulatory requirements
3. **Lessons Learned** — Document migration experience for future reference
4. **Audit Trail** — File migration records for compliance auditing

---

## Data Deletion Verification

After completing any vendor migration, verify the following:

- [ ] All personal data has been deleted from the old vendor per GDPR Art. 17
- [ ] Vendor has provided written confirmation of data deletion
- [ ] Backup copies at the vendor have been destroyed (confirm retention schedules)
- [ ] API keys and access tokens for the old vendor have been revoked
- [ ] DNS records, webhooks, and integrations pointing to old vendor have been removed

---

## Review Schedule

This vendor exit plan should be reviewed:

- **Annually** as part of the regular vendor management review
- **When adding** a new third-party vendor
- **When a vendor** changes pricing, terms, or has a significant incident
- **Before contract renewal** to evaluate whether migration is advantageous

---

*This vendor exit plan was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Review and customize for your specific requirements. This document does not constitute legal advice.*`);

  return sections.join("\n");
}
