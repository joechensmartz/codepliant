import type { ScanResult, DetectedService } from "../scanner/types.js";
import type { GeneratorContext } from "./index.js";

/** Risk tier levels for vendor classification. */
type RiskTier = "Critical" | "High" | "Medium" | "Low";

/** Review frequency per risk tier. */
const REVIEW_FREQUENCY: Record<RiskTier, string> = {
  Critical: "Quarterly (every 3 months)",
  High: "Semi-annually (every 6 months)",
  Medium: "Annually (every 12 months)",
  Low: "Biannually (every 24 months)",
};

/** Risk tier descriptions. */
const TIER_DESCRIPTIONS: Record<RiskTier, string> = {
  Critical: "Vendors processing highly sensitive data (financial, health, biometric) at scale with limited replaceability. A failure or breach at this vendor would have immediate, severe impact on business operations and regulatory compliance.",
  High: "Vendors processing personal data with significant volume or sensitivity. Vendor disruption would materially impact service delivery or compliance posture.",
  Medium: "Vendors processing limited personal data or operational data. Alternatives exist and migration would be manageable within a reasonable timeframe.",
  Low: "Vendors processing minimal or no personal data, or providing easily replaceable commodity services. Limited compliance exposure.",
};

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

/**
 * Data sensitivity scoring per service category.
 * Higher = more sensitive data.
 */
const DATA_SENSITIVITY: Record<string, number> = {
  payment: 5,   // Financial data — highest sensitivity
  ai: 4,        // User prompts, potentially PII/sensitive content
  auth: 4,      // Credentials, identity data
  database: 3,  // May store any category of data
  storage: 3,   // User-uploaded files, potentially sensitive
  email: 3,     // Email addresses, message content
  analytics: 2, // Behavioral data, usually pseudonymized
  monitoring: 2, // Error logs, stack traces, IPs
  advertising: 2, // Ad identifiers, interaction data
  social: 2,    // Social profile data
  other: 1,     // Minimal data exposure
};

/**
 * Data volume scoring — services that typically handle high data volumes.
 */
const HIGH_VOLUME_SERVICES = new Set([
  "stripe", "@paypal/checkout-server-sdk", "plaid",
  "@google-analytics/data", "posthog", "mixpanel", "@amplitude/analytics-browser",
  "@segment/analytics-next", "firebase", "firebase-admin",
  "@supabase/supabase-js", "@aws-sdk/client-s3",
  "@google-cloud/storage",
]);

/**
 * Replaceability scoring — services that are hard to replace.
 * Lower score = harder to replace.
 */
const HARD_TO_REPLACE = new Set([
  "stripe", "@paypal/checkout-server-sdk", "plaid",             // Payment — deep integration
  "@supabase/supabase-js", "firebase", "firebase-admin",        // BaaS — full stack dependency
  "@clerk/nextjs",                                                // Auth — deep integration
  "@aws-sdk/client-s3", "@google-cloud/storage",                 // Storage — data migration required
]);

interface VendorRiskProfile {
  provider: string;
  category: string;
  tier: RiskTier;
  dataSensitivity: number;
  dataVolume: "High" | "Medium" | "Low";
  replaceability: "Easy" | "Moderate" | "Difficult";
  reviewFrequency: string;
  dataCollected: string[];
  riskFactors: string[];
  mitigations: string[];
}

/**
 * Compute risk tier for a single vendor based on data sensitivity, volume,
 * and replaceability.
 */
function computeRiskTier(service: DetectedService): VendorRiskProfile {
  const provider = PROVIDER_NAMES[service.name] || service.name;
  const sensitivity = DATA_SENSITIVITY[service.category] || 1;
  const isHighVolume = HIGH_VOLUME_SERVICES.has(service.name);
  const isHardToReplace = HARD_TO_REPLACE.has(service.name);

  const dataVolume: "High" | "Medium" | "Low" = isHighVolume ? "High" : sensitivity >= 3 ? "Medium" : "Low";
  const replaceability: "Easy" | "Moderate" | "Difficult" = isHardToReplace ? "Difficult" : sensitivity >= 4 ? "Moderate" : "Easy";

  // Calculate composite risk score (1-10)
  let riskScore = sensitivity; // base: 1-5
  if (isHighVolume) riskScore += 2;
  if (isHardToReplace) riskScore += 2;
  if (sensitivity >= 4 && isHighVolume) riskScore += 1; // extra for sensitive + high volume

  let tier: RiskTier;
  if (riskScore >= 8) tier = "Critical";
  else if (riskScore >= 6) tier = "High";
  else if (riskScore >= 4) tier = "Medium";
  else tier = "Low";

  // Build risk factors
  const riskFactors: string[] = [];
  if (sensitivity >= 4) riskFactors.push("Processes highly sensitive personal data");
  if (sensitivity >= 3 && sensitivity < 4) riskFactors.push("Processes personal data");
  if (isHighVolume) riskFactors.push("High data volume — large-scale processing");
  if (isHardToReplace) riskFactors.push("Difficult to replace — deep integration dependency");
  if (service.category === "payment") riskFactors.push("Subject to PCI DSS requirements");
  if (service.category === "ai") riskFactors.push("AI processing — potential for unintended data exposure");
  if (service.category === "auth") riskFactors.push("Identity/credential data — high-value target for attackers");

  // Build mitigations
  const mitigations: string[] = [];
  mitigations.push("Ensure DPA is signed and current");
  if (sensitivity >= 3) mitigations.push("Verify encryption at rest and in transit");
  if (sensitivity >= 4) mitigations.push("Conduct annual security questionnaire");
  if (isHighVolume) mitigations.push("Implement data minimization controls");
  if (isHardToReplace) mitigations.push("Document vendor exit plan and data migration procedure");
  if (service.category === "payment") mitigations.push("Verify PCI DSS Level 1 compliance certificate");
  if (service.category === "ai") mitigations.push("Confirm opt-out of model training; review data retention policy");
  if (service.category === "auth") mitigations.push("Verify MFA support and credential storage practices");
  mitigations.push("Monitor vendor status page and security advisories");

  return {
    provider,
    category: service.category,
    tier,
    dataSensitivity: sensitivity,
    dataVolume,
    replaceability,
    reviewFrequency: REVIEW_FREQUENCY[tier],
    dataCollected: service.dataCollected,
    riskFactors,
    mitigations,
  };
}

/**
 * Generate VENDOR_RISK_TIER_ASSESSMENT.md — tier each detected vendor as
 * Critical/High/Medium/Low based on data sensitivity, data volume, and
 * replaceability, with review frequencies per tier.
 *
 * Returns null when no third-party services are detected.
 */
export function generateVendorRiskTierAssessment(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  // Filter out self-hosted services
  const thirdParty = scan.services.filter((s) => !SELF_HOSTED.has(s.name));
  if (thirdParty.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const date = new Date().toISOString().split("T")[0];

  // Compute risk profiles and deduplicate by provider name
  const seen = new Set<string>();
  const profiles: VendorRiskProfile[] = [];
  for (const service of thirdParty) {
    const profile = computeRiskTier(service);
    if (seen.has(profile.provider)) continue;
    seen.add(profile.provider);
    profiles.push(profile);
  }

  // Sort by tier severity: Critical > High > Medium > Low
  const tierOrder: Record<RiskTier, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  profiles.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);

  // Count per tier
  const tierCounts: Record<RiskTier, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  for (const p of profiles) tierCounts[p.tier]++;

  const sections: string[] = [];

  // ── Title ────────────────────────────────────────────────────────────

  sections.push(`# Vendor Risk Tier Assessment

**Last updated:** ${date}

**Project:** ${scan.projectName}

**Organization:** ${company}

**Assessment contact:** ${email}

---

## Executive Summary

This assessment classifies **${profiles.length} third-party vendors** detected in the **${scan.projectName}** codebase into risk tiers based on three factors:

1. **Data Sensitivity** — The type and sensitivity of personal data the vendor processes
2. **Data Volume** — The scale of data processing (transaction volume, user base coverage)
3. **Replaceability** — How difficult it would be to migrate away from the vendor

### Tier Distribution

| Tier | Count | Review Frequency |
|------|-------|-----------------|
| Critical | ${tierCounts.Critical} | ${REVIEW_FREQUENCY.Critical} |
| High | ${tierCounts.High} | ${REVIEW_FREQUENCY.High} |
| Medium | ${tierCounts.Medium} | ${REVIEW_FREQUENCY.Medium} |
| Low | ${tierCounts.Low} | ${REVIEW_FREQUENCY.Low} |

---

## Risk Tier Definitions

${(["Critical", "High", "Medium", "Low"] as RiskTier[]).map((tier) => `### ${tier} Risk

${TIER_DESCRIPTIONS[tier]}

**Review frequency:** ${REVIEW_FREQUENCY[tier]}`).join("\n\n")}

---`);

  // ── Summary Table ────────────────────────────────────────────────────

  let table = `## Vendor Risk Summary

| Vendor | Category | Tier | Sensitivity | Volume | Replaceability | Review Frequency |
|--------|----------|------|-------------|--------|---------------|-----------------|`;

  for (const p of profiles) {
    const tierEmoji = p.tier === "Critical" ? "!!!" : p.tier === "High" ? "!!" : p.tier === "Medium" ? "!" : "-";
    table += `\n| **${p.provider}** | ${p.category} | ${p.tier} ${tierEmoji} | ${p.dataSensitivity}/5 | ${p.dataVolume} | ${p.replaceability} | ${p.reviewFrequency} |`;
  }

  sections.push(table);

  // ── Detailed Vendor Profiles ─────────────────────────────────────────

  sections.push(`\n---\n\n## Detailed Vendor Risk Profiles`);

  for (const tier of ["Critical", "High", "Medium", "Low"] as RiskTier[]) {
    const tierProfiles = profiles.filter((p) => p.tier === tier);
    if (tierProfiles.length === 0) continue;

    sections.push(`\n### ${tier} Risk Vendors\n`);

    for (const p of tierProfiles) {
      let vendorSection = `#### ${p.provider}

| Factor | Assessment |
|--------|-----------|
| **Category** | ${p.category} |
| **Risk Tier** | ${p.tier} |
| **Data Sensitivity** | ${p.dataSensitivity}/5 |
| **Data Volume** | ${p.dataVolume} |
| **Replaceability** | ${p.replaceability} |
| **Review Frequency** | ${p.reviewFrequency} |

**Data collected:** ${p.dataCollected.join(", ") || "Not specified"}

**Risk factors:**
${p.riskFactors.map((r) => `- ${r}`).join("\n")}

**Recommended mitigations:**
${p.mitigations.map((m) => `- [ ] ${m}`).join("\n")}
`;
      sections.push(vendorSection);
    }
  }

  // ── Review Schedule ──────────────────────────────────────────────────

  const nextQuarter = new Date();
  nextQuarter.setMonth(nextQuarter.getMonth() + 3);
  const nextSemiAnnual = new Date();
  nextSemiAnnual.setMonth(nextSemiAnnual.getMonth() + 6);
  const nextAnnual = new Date();
  nextAnnual.setFullYear(nextAnnual.getFullYear() + 1);

  sections.push(`---

## Review Schedule

| Review Type | Next Due | Vendors |
|------------|----------|---------|
| Quarterly Review | ${nextQuarter.toISOString().split("T")[0]} | ${profiles.filter((p) => p.tier === "Critical").map((p) => p.provider).join(", ") || "None"} |
| Semi-Annual Review | ${nextSemiAnnual.toISOString().split("T")[0]} | ${profiles.filter((p) => p.tier === "High").map((p) => p.provider).join(", ") || "None"} |
| Annual Review | ${nextAnnual.toISOString().split("T")[0]} | ${profiles.filter((p) => p.tier === "Medium").map((p) => p.provider).join(", ") || "None"} |
| Biannual Review | ${new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} | ${profiles.filter((p) => p.tier === "Low").map((p) => p.provider).join(", ") || "None"} |

### Review Checklist

For each scheduled review, complete the following:

- [ ] Verify DPA is current and signed
- [ ] Review vendor's latest SOC 2 / ISO 27001 report (if applicable)
- [ ] Check for security incidents or breaches reported by the vendor
- [ ] Verify data processing activities match documented purposes
- [ ] Confirm sub-processor list has not changed unexpectedly
- [ ] Review vendor's privacy policy for material changes
- [ ] Test data deletion / DSAR fulfillment process
- [ ] Update this assessment with any changes to risk factors

---

## Methodology

### Scoring Criteria

**Data Sensitivity (1-5):**
| Score | Description | Examples |
|-------|-------------|----------|
| 5 | Financial / health data | Payment processors, health APIs |
| 4 | Identity / credential data | Auth providers, AI services (may process PII) |
| 3 | Personal / contact data | Email services, databases, file storage |
| 2 | Behavioral / technical data | Analytics, monitoring, advertising |
| 1 | Minimal / no personal data | Utility services, CDNs |

**Data Volume:**
- **High** — Processes data for all or most users at scale
- **Medium** — Processes moderate amounts of personal data
- **Low** — Processes minimal data volume

**Replaceability:**
- **Easy** — Commodity service; multiple alternatives; migration within days
- **Moderate** — Some integration depth; migration within weeks
- **Difficult** — Deep integration; data lock-in; migration requires months of planning

### Tier Calculation

Risk tier is determined by a composite score combining all three factors. Vendors processing sensitive data at high volume with difficult replaceability receive the highest risk classification.

---

## Maintaining This Assessment

- **Review frequency:** This assessment should be regenerated whenever vendors are added or removed
- **Ownership:** Data Protection Officer / Security Team
- **Update process:** Re-run Codepliant to regenerate from current codebase, then review and validate tier assignments
- **Override:** If a vendor's auto-assigned tier does not reflect your specific context, document the override and rationale

---

*This vendor risk tier assessment was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Risk tiers are based on general heuristics and should be validated against your organization's specific risk appetite and vendor relationships.*`);

  return sections.join("\n\n");
}
