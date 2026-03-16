import type { ScanResult, DetectedService } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates AI_SUPPLY_CHAIN_RISK.md — assesses business continuity risks
 * from AI provider dependencies. What if OpenAI goes down? What if Anthropic
 * changes pricing? What if a provider discontinues an API?
 *
 * Only generated when AI services are detected.
 *
 * Based on:
 * - NIST AI RMF (Govern 1.6 — Third-Party AI Risk)
 * - EU AI Act Art. 16(f) — Supply Chain Due Diligence
 * - ISO/IEC 42001 — AI Supply Chain Management
 */

interface ProviderProfile {
  name: string;
  matchPatterns: string[];
  tier: "Major" | "Mid-Tier" | "Niche";
  headquarters: string;
  alternatives: string[];
  pricingModel: string;
  lockInRisk: "Low" | "Medium" | "High";
  apiStabilityRisk: "Low" | "Medium" | "High";
  dataResidencyRegions: string[];
  knownIncidents: string[];
  migrationComplexity: "Low" | "Medium" | "High";
}

const PROVIDER_PROFILES: ProviderProfile[] = [
  {
    name: "OpenAI",
    matchPatterns: ["openai", "gpt", "chatgpt", "dall-e", "whisper"],
    tier: "Major",
    headquarters: "United States (San Francisco, CA)",
    alternatives: ["Anthropic (Claude)", "Google (Gemini)", "Mistral AI", "Cohere", "Meta (Llama, self-hosted)"],
    pricingModel: "Per-token usage-based, tiered rate limits",
    lockInRisk: "High",
    apiStabilityRisk: "Medium",
    dataResidencyRegions: ["US", "EU (Azure OpenAI)"],
    knownIncidents: [
      "Model deprecation cycles (GPT-3.5 → GPT-4 migration required)",
      "Rate limit changes without advance notice",
      "Pricing increases on flagship models",
    ],
    migrationComplexity: "Medium",
  },
  {
    name: "Anthropic",
    matchPatterns: ["anthropic", "claude"],
    tier: "Major",
    headquarters: "United States (San Francisco, CA)",
    alternatives: ["OpenAI (GPT)", "Google (Gemini)", "Mistral AI", "Cohere"],
    pricingModel: "Per-token usage-based",
    lockInRisk: "Medium",
    apiStabilityRisk: "Low",
    dataResidencyRegions: ["US", "EU (via AWS Bedrock)"],
    knownIncidents: [
      "Capacity constraints during high-demand periods",
      "API versioning changes requiring client updates",
    ],
    migrationComplexity: "Medium",
  },
  {
    name: "Google AI",
    matchPatterns: ["google-ai", "gemini", "vertex", "palm", "bard"],
    tier: "Major",
    headquarters: "United States (Mountain View, CA)",
    alternatives: ["OpenAI (GPT)", "Anthropic (Claude)", "Mistral AI", "AWS Bedrock"],
    pricingModel: "Per-token + Vertex AI platform fees",
    lockInRisk: "High",
    apiStabilityRisk: "Medium",
    dataResidencyRegions: ["US", "EU", "Asia-Pacific"],
    knownIncidents: [
      "Rapid model name/version changes (PaLM → Gemini rebrand)",
      "Product discontinuation history (Google track record)",
    ],
    migrationComplexity: "High",
  },
  {
    name: "AWS Bedrock",
    matchPatterns: ["bedrock", "aws-ai", "sagemaker"],
    tier: "Major",
    headquarters: "United States (Seattle, WA)",
    alternatives: ["Azure OpenAI", "Google Vertex AI", "Direct provider APIs"],
    pricingModel: "Per-token + infrastructure costs",
    lockInRisk: "High",
    apiStabilityRisk: "Low",
    dataResidencyRegions: ["US", "EU", "Asia-Pacific", "Global"],
    knownIncidents: [
      "Regional outages affecting AI endpoints",
      "Pricing complexity across model providers",
    ],
    migrationComplexity: "High",
  },
  {
    name: "Azure OpenAI",
    matchPatterns: ["azure-openai", "azure-ai"],
    tier: "Major",
    headquarters: "United States (Redmond, WA)",
    alternatives: ["OpenAI Direct API", "AWS Bedrock", "Google Vertex AI"],
    pricingModel: "Per-token + Azure infrastructure fees",
    lockInRisk: "High",
    apiStabilityRisk: "Low",
    dataResidencyRegions: ["US", "EU", "Asia-Pacific", "Global"],
    knownIncidents: [
      "Model availability delays vs. OpenAI direct",
      "Azure region-specific quota limitations",
    ],
    migrationComplexity: "Medium",
  },
  {
    name: "Cohere",
    matchPatterns: ["cohere"],
    tier: "Mid-Tier",
    headquarters: "Canada (Toronto, ON)",
    alternatives: ["OpenAI", "Anthropic", "Mistral AI"],
    pricingModel: "Per-token usage-based",
    lockInRisk: "Low",
    apiStabilityRisk: "Medium",
    dataResidencyRegions: ["US", "Canada"],
    knownIncidents: [
      "API versioning changes",
    ],
    migrationComplexity: "Low",
  },
  {
    name: "Mistral AI",
    matchPatterns: ["mistral"],
    tier: "Mid-Tier",
    headquarters: "France (Paris)",
    alternatives: ["OpenAI", "Anthropic", "Google AI"],
    pricingModel: "Per-token usage-based",
    lockInRisk: "Low",
    apiStabilityRisk: "Medium",
    dataResidencyRegions: ["EU", "US"],
    knownIncidents: [
      "Newer provider — limited track record",
    ],
    migrationComplexity: "Low",
  },
  {
    name: "Hugging Face",
    matchPatterns: ["huggingface", "hugging-face", "transformers"],
    tier: "Mid-Tier",
    headquarters: "United States (New York, NY)",
    alternatives: ["Self-hosted models", "AWS SageMaker", "Google Vertex AI"],
    pricingModel: "Free tier + Inference Endpoints (per-hour)",
    lockInRisk: "Low",
    apiStabilityRisk: "Low",
    dataResidencyRegions: ["US", "EU"],
    knownIncidents: [
      "Inference Endpoint cold start latency",
    ],
    migrationComplexity: "Low",
  },
  {
    name: "Replicate",
    matchPatterns: ["replicate"],
    tier: "Niche",
    headquarters: "United States (San Francisco, CA)",
    alternatives: ["Hugging Face", "AWS SageMaker", "Self-hosted"],
    pricingModel: "Per-second GPU billing",
    lockInRisk: "Low",
    apiStabilityRisk: "Medium",
    dataResidencyRegions: ["US"],
    knownIncidents: [
      "GPU availability constraints during peak demand",
    ],
    migrationComplexity: "Low",
  },
  {
    name: "Stability AI",
    matchPatterns: ["stability", "stable-diffusion", "stablediffusion"],
    tier: "Niche",
    headquarters: "United Kingdom (London)",
    alternatives: ["OpenAI (DALL-E)", "Midjourney", "Self-hosted Stable Diffusion"],
    pricingModel: "Per-image generation",
    lockInRisk: "Low",
    apiStabilityRisk: "High",
    dataResidencyRegions: ["US", "EU"],
    knownIncidents: [
      "Corporate restructuring and leadership changes",
      "Financial stability concerns",
    ],
    migrationComplexity: "Low",
  },
];

function matchProvider(service: DetectedService): ProviderProfile | null {
  const lower = service.name.toLowerCase();
  for (const profile of PROVIDER_PROFILES) {
    for (const pattern of profile.matchPatterns) {
      if (lower.includes(pattern)) return profile;
    }
  }
  return null;
}

function computeOverallRisk(profiles: ProviderProfile[]): string {
  if (profiles.length === 0) return "Low";
  const highCount = profiles.filter(
    (p) => p.lockInRisk === "High" || p.apiStabilityRisk === "High",
  ).length;
  if (highCount >= 2) return "Critical";
  if (highCount >= 1) return "High";
  const medCount = profiles.filter(
    (p) => p.lockInRisk === "Medium" || p.apiStabilityRisk === "Medium",
  ).length;
  if (medCount >= 2) return "High";
  if (medCount >= 1) return "Medium";
  return "Low";
}

function estimateMonthlySpend(services: DetectedService[]): string {
  // Rough estimate based on service count
  if (services.length >= 3) return "$5,000–$50,000+";
  if (services.length >= 2) return "$1,000–$10,000";
  return "$100–$5,000";
}

export function generateAISupplyChainRisk(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  const aiServices = scan.services.filter((s) => s.category === "ai");
  if (aiServices.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const date = new Date().toISOString().split("T")[0];

  const matchedProfiles: { service: DetectedService; profile: ProviderProfile }[] = [];
  const unmatchedServices: DetectedService[] = [];

  for (const svc of aiServices) {
    const profile = matchProvider(svc);
    if (profile) {
      matchedProfiles.push({ service: svc, profile });
    } else {
      unmatchedServices.push(svc);
    }
  }

  const profiles = matchedProfiles.map((m) => m.profile);
  const uniqueProfiles = [...new Map(profiles.map((p) => [p.name, p])).values()];
  const overallRisk = computeOverallRisk(uniqueProfiles);
  const singleProvider = uniqueProfiles.length === 1;

  const lines: string[] = [];

  // Header
  lines.push("# AI Supply Chain Risk Assessment");
  lines.push("");
  lines.push(`**Organization:** ${company}`);
  lines.push(`**Last updated:** ${date}`);
  lines.push(`**Project:** ${scan.projectName}`);
  lines.push(`**Overall Supply Chain Risk:** ${overallRisk}`);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(
    `This document assesses the business continuity risks arising from **${company}'s** dependencies on third-party AI service providers. It identifies single points of failure, pricing risks, migration paths, and contingency plans aligned with **NIST AI RMF** (Govern 1.6), **EU AI Act** (Art. 16(f)), and **ISO/IEC 42001** supply chain management requirements.`,
  );
  lines.push("");

  // Executive Summary
  lines.push("## 1. Executive Summary");
  lines.push("");
  lines.push(`${company} currently depends on **${aiServices.length} AI service(s)** from **${uniqueProfiles.length} provider(s)** for core product functionality. This creates supply chain dependencies that must be actively managed.`);
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|--------|-------|");
  lines.push(`| AI Services Detected | ${aiServices.length} |`);
  lines.push(`| Unique Providers | ${uniqueProfiles.length} |`);
  lines.push(`| Overall Risk Level | **${overallRisk}** |`);
  lines.push(`| Single-Provider Dependency | ${singleProvider ? "Yes (CRITICAL)" : "No"} |`);
  lines.push(`| Estimated Monthly AI Spend | ${estimateMonthlySpend(aiServices)} |`);
  lines.push(`| Migration Plans Documented | ${uniqueProfiles.length > 0 ? "See Section 4" : "N/A"} |`);
  lines.push("");

  if (singleProvider) {
    lines.push(
      `> **WARNING:** All AI functionality depends on a single provider (${uniqueProfiles[0]?.name || "unknown"}). A provider outage, pricing change, or API deprecation would affect 100% of AI features. Diversification is strongly recommended.`,
    );
    lines.push("");
  }

  // Provider Analysis
  lines.push("## 2. Provider Risk Profiles");
  lines.push("");

  for (const { service, profile } of matchedProfiles) {
    lines.push(`### ${profile.name}`);
    lines.push("");
    lines.push(`**Detected as:** ${service.name}`);
    lines.push(`**Data sent:** ${service.dataCollected.join(", ")}`);
    lines.push("");
    lines.push("| Risk Factor | Assessment |");
    lines.push("|-------------|------------|");
    lines.push(`| Provider Tier | ${profile.tier} |`);
    lines.push(`| Headquarters | ${profile.headquarters} |`);
    lines.push(`| Lock-In Risk | ${profile.lockInRisk} |`);
    lines.push(`| API Stability Risk | ${profile.apiStabilityRisk} |`);
    lines.push(`| Pricing Model | ${profile.pricingModel} |`);
    lines.push(`| Migration Complexity | ${profile.migrationComplexity} |`);
    lines.push(`| Data Residency | ${profile.dataResidencyRegions.join(", ")} |`);
    lines.push("");

    if (profile.knownIncidents.length > 0) {
      lines.push("**Known Risk Factors:**");
      lines.push("");
      for (const incident of profile.knownIncidents) {
        lines.push(`- ${incident}`);
      }
      lines.push("");
    }

    lines.push("**Alternatives:**");
    lines.push("");
    for (const alt of profile.alternatives) {
      lines.push(`- ${alt}`);
    }
    lines.push("");
  }

  for (const svc of unmatchedServices) {
    lines.push(`### ${svc.name} (Unrecognized Provider)`);
    lines.push("");
    lines.push("| Risk Factor | Assessment |");
    lines.push("|-------------|------------|");
    lines.push("| Provider Tier | Unknown |");
    lines.push("| Lock-In Risk | Unknown — requires manual assessment |");
    lines.push("| API Stability Risk | Unknown — requires manual assessment |");
    lines.push(`| Data Sent | ${svc.dataCollected.join(", ")} |`);
    lines.push("");
    lines.push(
      "> **Action Required:** This AI provider was not recognized. Conduct manual due diligence to assess supply chain risk, including financial stability, SLA guarantees, and data processing practices.",
    );
    lines.push("");
  }

  // Scenario Analysis
  lines.push("## 3. Risk Scenarios");
  lines.push("");
  lines.push("### Scenario A: Provider Outage (Hours to Days)");
  lines.push("");
  lines.push("| Impact Area | Details |");
  lines.push("|-------------|---------|");
  lines.push(`| Affected Features | All AI-powered functionality |`);
  lines.push(`| User Impact | ${aiServices.length > 1 ? "Partial degradation — some AI features may remain available" : "Complete loss of AI functionality"} |`);
  lines.push("| Revenue Impact | Depends on AI feature criticality to user retention |");
  lines.push("| Estimated Recovery | Automatic when provider restores service |");
  lines.push("");
  lines.push("**Mitigation:**");
  lines.push("- Implement circuit breakers with graceful degradation");
  lines.push("- Cache recent AI responses for read-heavy features");
  lines.push("- Display user-friendly fallback states");
  lines.push("- Monitor provider status pages and set up alerts");
  lines.push("");

  lines.push("### Scenario B: Pricing Increase (30–90 Days Notice)");
  lines.push("");
  lines.push("| Impact Area | Details |");
  lines.push("|-------------|---------|");
  lines.push(`| Estimated Current Spend | ${estimateMonthlySpend(aiServices)} /month |`);
  lines.push("| Impact of 2x Price Increase | May require feature repricing or margin reduction |");
  lines.push("| Impact of 5x Price Increase | Likely requires provider migration or feature removal |");
  lines.push("");
  lines.push("**Mitigation:**");
  lines.push("- Negotiate enterprise contracts with price caps");
  lines.push("- Maintain abstraction layer to enable provider switching");
  lines.push("- Budget 20% contingency for AI costs");
  lines.push("- Evaluate self-hosted alternatives for high-volume use cases");
  lines.push("");

  lines.push("### Scenario C: API Deprecation (3–12 Months Notice)");
  lines.push("");
  lines.push("| Impact Area | Details |");
  lines.push("|-------------|---------|");
  lines.push("| Engineering Effort | 2–8 weeks depending on abstraction quality |");
  lines.push("| Testing Required | Full regression + output quality validation |");
  lines.push("| Data Migration | Prompt templates, fine-tuning data, evaluation sets |");
  lines.push("");
  lines.push("**Mitigation:**");
  lines.push("- Use provider-agnostic abstraction layer (e.g., LiteLLM, LangChain)");
  lines.push("- Maintain model evaluation benchmarks for quality comparison");
  lines.push("- Document all prompt engineering and fine-tuning assets");
  lines.push("");

  lines.push("### Scenario D: Provider Shutdown or Acquisition");
  lines.push("");
  lines.push("| Impact Area | Details |");
  lines.push("|-------------|---------|");
  lines.push("| Notice Period | May be as short as 30 days |");
  lines.push("| Data Retrieval | Must ensure all training data and fine-tuned models are exported |");
  lines.push("| Migration Timeline | 4–12 weeks for full migration |");
  lines.push("");
  lines.push("**Mitigation:**");
  lines.push("- Never store unique training data exclusively with a provider");
  lines.push("- Maintain local copies of all fine-tuning datasets");
  lines.push("- Pre-qualify at least one alternative provider per AI capability");
  lines.push("");

  // Migration Playbook
  lines.push("## 4. Migration Playbook");
  lines.push("");
  lines.push("For each AI provider, the following migration strategy should be maintained:");
  lines.push("");

  for (const profile of uniqueProfiles) {
    lines.push(`### Migrating Away from ${profile.name}`);
    lines.push("");
    lines.push(`**Complexity:** ${profile.migrationComplexity}`);
    lines.push("");
    lines.push("**Steps:**");
    lines.push("");
    lines.push("1. **Evaluate alternatives:** " + profile.alternatives.slice(0, 3).join(", "));
    lines.push("2. **Abstract the integration:** Ensure all AI calls go through an abstraction layer");
    lines.push("3. **Benchmark quality:** Run evaluation suite against alternative providers");
    lines.push("4. **Migrate prompts:** Adapt prompt templates for new provider's strengths");
    lines.push("5. **Parallel testing:** Run both providers in shadow mode for 1–2 weeks");
    lines.push("6. **Gradual rollout:** Shift 10% → 50% → 100% of traffic");
    lines.push("7. **Monitor quality:** Track output quality metrics post-migration");
    lines.push("");
    lines.push("**Estimated Timeline:** " + (profile.migrationComplexity === "High" ? "6–12 weeks" : profile.migrationComplexity === "Medium" ? "3–6 weeks" : "1–3 weeks"));
    lines.push("");
  }

  // Recommendations
  lines.push("## 5. Recommendations");
  lines.push("");

  const recommendations: string[] = [];
  recommendations.push("Implement a provider-agnostic AI abstraction layer to reduce switching costs");

  if (singleProvider) {
    recommendations.push(
      `**CRITICAL:** Diversify beyond ${uniqueProfiles[0]?.name || "current provider"} — evaluate at least one alternative for each AI capability`,
    );
  }

  recommendations.push("Establish AI cost budgets with alerts at 80% and 100% thresholds");
  recommendations.push("Maintain a model evaluation benchmark suite for rapid provider comparison");
  recommendations.push("Negotiate enterprise agreements with SLA guarantees and price caps");
  recommendations.push("Store all training data, fine-tuning datasets, and prompt libraries locally");
  recommendations.push("Add circuit breakers and graceful degradation for all AI features");
  recommendations.push("Monitor provider changelogs and deprecation notices weekly");
  recommendations.push("Conduct annual AI supply chain risk review");

  for (let i = 0; i < recommendations.length; i++) {
    lines.push(`${i + 1}. ${recommendations[i]}`);
  }
  lines.push("");

  // Monitoring Checklist
  lines.push("## 6. Ongoing Monitoring Checklist");
  lines.push("");
  lines.push("| Check | Frequency | Owner |");
  lines.push("|-------|-----------|-------|");
  lines.push("| Review provider status page and uptime | Weekly | Engineering |");
  lines.push("| Check for API deprecation notices | Weekly | Engineering |");
  lines.push("| Review AI cost trends | Monthly | Finance / Engineering |");
  lines.push("| Test failover to alternative provider | Quarterly | Engineering |");
  lines.push("| Update migration playbooks | Quarterly | Engineering |");
  lines.push("| Full supply chain risk reassessment | Annually | CTO / CISO |");
  lines.push("| Benchmark output quality across providers | Semi-annually | ML / Product |");
  lines.push("");

  // Footer
  lines.push("---");
  lines.push("");
  lines.push(
    `*Generated by [Codepliant](https://github.com/joechensmartz/codepliant) on ${date}. This is an automated risk assessment based on code analysis. Provider profiles are based on publicly available information and should be verified against current provider terms and conditions. This document should be reviewed by qualified risk management and legal counsel.*`,
  );

  return lines.join("\n");
}
