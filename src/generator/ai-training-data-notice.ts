import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Known AI service training data policies and opt-out mechanisms.
 */
interface AITrainingPolicy {
  provider: string;
  usesDataForTraining: boolean;
  trainingDetails: string;
  optOutUrl: string;
  optOutMethod: string;
  apiOptOut: string | null;
  retentionForTraining: string;
  privacyPolicyUrl: string;
}

const AI_TRAINING_POLICIES: Record<string, AITrainingPolicy> = {
  openai: {
    provider: "OpenAI",
    usesDataForTraining: false,
    trainingDetails: "API data is NOT used for model training by default. OpenAI's API Data Usage Policy (effective March 1, 2023) states that data sent via the API will not be used to train or improve models unless you explicitly opt in.",
    optOutUrl: "https://platform.openai.com/account/org-settings",
    optOutMethod: "API data is opted out by default. If using ChatGPT (consumer), disable 'Improve the model for everyone' in Settings > Data Controls.",
    apiOptOut: "N/A (opted out by default for API usage)",
    retentionForTraining: "API inputs/outputs retained for 30 days for abuse monitoring only (not training)",
    privacyPolicyUrl: "https://openai.com/policies/privacy-policy",
  },
  "@anthropic-ai/sdk": {
    provider: "Anthropic",
    usesDataForTraining: false,
    trainingDetails: "Anthropic does NOT use API inputs or outputs to train models. Commercial API usage is excluded from training data per Anthropic's Usage Policy.",
    optOutUrl: "https://www.anthropic.com/privacy",
    optOutMethod: "API data is opted out by default. No additional action required for API users.",
    apiOptOut: "N/A (opted out by default for API usage)",
    retentionForTraining: "API data retained up to 30 days for trust and safety purposes only",
    privacyPolicyUrl: "https://www.anthropic.com/privacy",
  },
  "@google/generative-ai": {
    provider: "Google (Gemini)",
    usesDataForTraining: true,
    trainingDetails: "By default, Google may use data sent to the Gemini API for model improvement. Paid API tier users can opt out. Free-tier usage may be used to improve Google products and services.",
    optOutUrl: "https://ai.google.dev/gemini-api/docs/data-handling",
    optOutMethod: "Use the paid API tier (data not used for training). For free tier, review and configure data handling settings in Google Cloud Console.",
    apiOptOut: "Upgrade to paid tier; or set `safety_settings` and configure data handling in Google Cloud project settings",
    retentionForTraining: "Free tier: data may be retained and used for improvement. Paid tier: data retained up to 30 days for abuse monitoring.",
    privacyPolicyUrl: "https://ai.google/responsibility/privacy/",
  },
  replicate: {
    provider: "Replicate",
    usesDataForTraining: false,
    trainingDetails: "Replicate does not use your inputs or outputs to train models. Your data is processed only to provide the service.",
    optOutUrl: "https://replicate.com/privacy",
    optOutMethod: "No opt-out necessary. Replicate does not train on customer data by default.",
    apiOptOut: "N/A (not used for training)",
    retentionForTraining: "Inputs/outputs deleted after processing; prediction data retained per your account settings",
    privacyPolicyUrl: "https://replicate.com/privacy",
  },
  "together-ai": {
    provider: "Together AI",
    usesDataForTraining: false,
    trainingDetails: "Together AI does not use customer data to train its hosted models. Data is processed solely to fulfill API requests.",
    optOutUrl: "https://www.together.ai/privacy",
    optOutMethod: "No opt-out necessary. Together AI does not use customer data for training.",
    apiOptOut: "N/A (not used for training)",
    retentionForTraining: "Data retained only for the duration needed to serve the request",
    privacyPolicyUrl: "https://www.together.ai/privacy",
  },
  cohere: {
    provider: "Cohere",
    usesDataForTraining: false,
    trainingDetails: "Cohere does not use data from commercial API customers to train or improve its models. Data is used solely to provide the service.",
    optOutUrl: "https://cohere.com/privacy",
    optOutMethod: "No opt-out necessary for commercial API usage. Cohere does not train on customer data.",
    apiOptOut: "N/A (not used for training)",
    retentionForTraining: "Inputs/outputs retained for 30 days for abuse monitoring and debugging",
    privacyPolicyUrl: "https://cohere.com/privacy",
  },
  "@pinecone-database/pinecone": {
    provider: "Pinecone",
    usesDataForTraining: false,
    trainingDetails: "Pinecone is a vector database service. It stores your embeddings but does not use them to train any models.",
    optOutUrl: "https://www.pinecone.io/privacy/",
    optOutMethod: "N/A. Pinecone is a storage service, not an AI training platform.",
    apiOptOut: "N/A",
    retentionForTraining: "Data retained as long as stored in your index; deleted upon request",
    privacyPolicyUrl: "https://www.pinecone.io/privacy/",
  },
  langchain: {
    provider: "LangChain",
    usesDataForTraining: false,
    trainingDetails: "LangChain is an orchestration framework. It does not collect or use your data for training. Data handling depends on the underlying AI providers you configure.",
    optOutUrl: "https://www.langchain.com/privacy-policy",
    optOutMethod: "N/A. LangChain is a local library. Check the training policies of the AI providers you use through LangChain.",
    apiOptOut: "N/A (local library)",
    retentionForTraining: "N/A (data flows to underlying providers)",
    privacyPolicyUrl: "https://www.langchain.com/privacy-policy",
  },
};

/**
 * Generates AI_TRAINING_DATA_NOTICE.md — a disclosure document about whether
 * user data is used for AI model training, with per-provider opt-out instructions.
 *
 * Only generated when AI services are detected.
 */
export function generateAITrainingDataNotice(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  const aiServices = scan.services.filter((s) => s.category === "ai");

  if (aiServices.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const dpoEmail = ctx?.dpoEmail;
  const date = new Date().toISOString().split("T")[0];

  // Match detected AI services to known training policies
  const matchedPolicies: { serviceName: string; policy: AITrainingPolicy }[] = [];
  const seenProviders = new Set<string>();

  for (const service of aiServices) {
    const policy = AI_TRAINING_POLICIES[service.name];
    if (policy && !seenProviders.has(policy.provider)) {
      seenProviders.add(policy.provider);
      matchedPolicies.push({ serviceName: service.name, policy });
    }
  }

  // Also list unmatched AI services
  const unmatchedAI = aiServices.filter(
    (s) => !AI_TRAINING_POLICIES[s.name]
  );

  const sections: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────
  sections.push("# AI Training Data Notice");
  sections.push("");
  sections.push(`**Last updated:** ${date}`);
  sections.push("");
  sections.push(`**Project:** ${scan.projectName}`);
  sections.push(`**Organization:** ${company}`);
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("This notice discloses whether user data processed by AI services in this application is used for AI model training, and provides instructions for opting out where applicable.");
  sections.push("");
  sections.push("Transparency about AI training data usage is required under:");
  sections.push("");
  sections.push("- **EU AI Act** (Regulation (EU) 2024/1689) — transparency obligations under Article 50");
  sections.push("- **GDPR** (Regulation (EU) 2016/679) — lawful basis and purpose limitation under Articles 5 and 6");
  sections.push("- **CCPA/CPRA** — right to know about the purposes of data collection");
  sections.push("");

  // ── Summary ─────────────────────────────────────────────────────────
  sections.push("## Summary");
  sections.push("");

  const trainersCount = matchedPolicies.filter((p) => p.policy.usesDataForTraining).length;
  const nonTrainersCount = matchedPolicies.filter((p) => !p.policy.usesDataForTraining).length;

  if (trainersCount === 0 && unmatchedAI.length === 0) {
    sections.push(`**None of the ${matchedPolicies.length} detected AI service(s) use your data for model training** when accessed via their commercial APIs. ${company} has verified the data handling policies of each provider.`);
  } else if (trainersCount > 0) {
    sections.push(`Of the ${matchedPolicies.length} detected AI service(s), **${trainersCount} may use data for model training** under certain conditions. See the per-provider details below for opt-out instructions.`);
  }
  sections.push("");

  sections.push("| AI Provider | Uses Data for Training | Opt-Out Available |");
  sections.push("|-------------|----------------------|-------------------|");
  for (const { policy } of matchedPolicies) {
    const training = policy.usesDataForTraining ? "Conditional (see details)" : "No";
    const optOut = policy.usesDataForTraining ? "Yes" : "N/A (not used)";
    sections.push(`| ${policy.provider} | ${training} | ${optOut} |`);
  }
  for (const service of unmatchedAI) {
    sections.push(`| ${service.name} | Unknown | Review provider policy |`);
  }
  sections.push("");

  // ── Our Commitment ──────────────────────────────────────────────────
  sections.push("## Our Commitment");
  sections.push("");
  sections.push(`${company} is committed to protecting your data when it is processed by AI services. We commit to:`);
  sections.push("");
  sections.push("1. **Not sharing user data for AI training** without explicit consent");
  sections.push("2. **Using commercial API tiers** that exclude data from model training where available");
  sections.push("3. **Reviewing AI provider training policies** at least quarterly");
  sections.push("4. **Notifying users** if any provider changes their training data policy");
  sections.push("5. **Minimizing data sent** to AI providers (data minimization principle)");
  sections.push("");

  // ── Per-Provider Details ────────────────────────────────────────────
  sections.push("## Per-Provider Training Data Policies");
  sections.push("");

  for (const { serviceName, policy } of matchedPolicies) {
    sections.push(`### ${policy.provider}`);
    sections.push("");
    sections.push(`**Service:** ${serviceName}`);
    sections.push(`**Uses Data for Training:** ${policy.usesDataForTraining ? "Yes (conditional)" : "No"}`);
    sections.push("");
    sections.push(`**Details:** ${policy.trainingDetails}`);
    sections.push("");
    sections.push(`**Data Retention:** ${policy.retentionForTraining}`);
    sections.push("");

    sections.push("**Opt-Out Instructions:**");
    sections.push("");
    sections.push(`- ${policy.optOutMethod}`);
    if (policy.apiOptOut && policy.apiOptOut !== "N/A" && !policy.apiOptOut.startsWith("N/A")) {
      sections.push(`- API-level opt-out: ${policy.apiOptOut}`);
    }
    sections.push(`- Full policy: [${policy.privacyPolicyUrl}](${policy.privacyPolicyUrl})`);
    sections.push("");
  }

  // ── Unmatched AI Services ───────────────────────────────────────────
  if (unmatchedAI.length > 0) {
    sections.push("### Other AI Services");
    sections.push("");
    sections.push("The following AI services were detected but their training data policies could not be automatically verified. Review their documentation directly:");
    sections.push("");
    for (const service of unmatchedAI) {
      const evidence = service.evidence.map((e) => `\`${e.file}\``).join(", ");
      sections.push(`- **${service.name}** — detected in ${evidence}`);
    }
    sections.push("");
    sections.push("> **Action required:** Review the training data policies of the services listed above and update this notice with their specific policies.");
    sections.push("");
  }

  // ── Your Rights ─────────────────────────────────────────────────────
  sections.push("## Your Rights");
  sections.push("");
  sections.push("You have the right to:");
  sections.push("");
  sections.push("- **Know** whether your data is used for AI training");
  sections.push("- **Object** to having your data used for AI training (GDPR Art. 21)");
  sections.push("- **Withdraw consent** for AI data processing at any time (GDPR Art. 7(3))");
  sections.push("- **Request deletion** of data that has been sent to AI providers (GDPR Art. 17)");
  sections.push("- **Opt out** of data sharing for AI training (CCPA/CPRA right to opt out)");
  sections.push("");
  sections.push(`To exercise these rights, contact us at **${email}**${dpoEmail ? ` or our DPO at **${dpoEmail}**` : ""}.`);
  sections.push("");

  // ── Implementation Checklist ────────────────────────────────────────
  sections.push("## Implementation Checklist");
  sections.push("");
  sections.push("- [ ] All AI provider training data policies have been reviewed");
  sections.push("- [ ] Commercial API tiers are used where available to prevent training data usage");
  sections.push("- [ ] Users are informed about AI data processing before first interaction");
  sections.push("- [ ] Opt-out mechanisms are implemented and accessible");
  sections.push("- [ ] Data minimization is applied to AI API calls");
  sections.push("- [ ] This notice is linked from the application's privacy policy");
  sections.push("- [ ] Quarterly review of AI provider training policies is scheduled");
  sections.push("");

  // ── Contact ─────────────────────────────────────────────────────────
  sections.push("## Contact");
  sections.push("");
  sections.push(`For questions about AI training data practices, contact:`);
  sections.push("");
  sections.push(`- **Email:** ${email}`);
  if (dpoEmail) {
    sections.push(`- **Data Protection Officer:** ${dpoEmail}`);
  }
  sections.push("");

  // ── Disclaimer ──────────────────────────────────────────────────────
  sections.push("---");
  sections.push("");
  sections.push(
    `*This AI training data notice was generated by [Codepliant](https://github.com/joechensmartz/codepliant) ` +
    `based on an automated scan of the **${scan.projectName}** codebase. ` +
    `AI provider training policies are subject to change. This document should be reviewed regularly ` +
    `and verified against each provider's current terms of service and privacy policy.*`
  );

  return sections.join("\n");
}
