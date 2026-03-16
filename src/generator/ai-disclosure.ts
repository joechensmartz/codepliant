import type { ScanResult, DetectedService } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * High-risk AI use-case patterns.
 * If any detected AI service name or data-collected field matches these,
 * the application is classified as "high" risk under the EU AI Act.
 */
const HIGH_RISK_PATTERNS = [
  "biometric",
  "emotion recognition",
  "facial recognition",
  "credit scoring",
  "hiring",
  "recruitment",
  "law enforcement",
  "healthcare diagnosis",
  "education assessment",
  "migration",
  "social scoring",
];

/**
 * Patterns that indicate user-facing AI (triggers "limited" classification).
 * Most chatbot / generative AI services interact with end users.
 */
const USER_FACING_PATTERNS = [
  "user prompts",
  "conversation history",
  "generated content",
  "model predictions",
  "chatbot",
];

/**
 * Classify the AI risk level of the application under the EU AI Act.
 *
 * Priority:
 * 1. If the user overrides via config, use that.
 * 2. If high-risk patterns detected in service data → 'high'.
 * 3. If AI services process user-facing data → 'limited'.
 * 4. Otherwise (AI only used internally) → 'minimal'.
 */
export function classifyAIRisk(
  services: DetectedService[],
  ctx?: GeneratorContext
): "minimal" | "limited" | "high" {
  // Config override takes precedence
  if (ctx?.aiRiskLevel) {
    return ctx.aiRiskLevel;
  }

  const aiServices = services.filter((s) => s.category === "ai");
  if (aiServices.length === 0) return "minimal";

  // Check for high-risk patterns
  const allData = aiServices
    .flatMap((s) => [...s.dataCollected, s.name])
    .map((d) => d.toLowerCase());

  for (const pattern of HIGH_RISK_PATTERNS) {
    if (allData.some((d) => d.includes(pattern))) {
      return "high";
    }
  }

  // Check for user-facing patterns → limited risk
  for (const pattern of USER_FACING_PATTERNS) {
    if (allData.some((d) => d.includes(pattern))) {
      return "limited";
    }
  }

  return "minimal";
}

/** Map risk levels to their EU AI Act obligations. */
const RISK_OBLIGATIONS: Record<string, string[]> = {
  minimal: [
    "No specific obligations under the EU AI Act",
    "Voluntary adoption of codes of conduct is encouraged",
    "General transparency best practices recommended",
  ],
  limited: [
    "Users must be informed when interacting with an AI system (Art. 50(1))",
    "AI-generated content must be disclosed and machine-readably marked (Art. 50(2))",
    "Synthetic media (deepfakes) must be labelled (Art. 50(4))",
    "Disclosure must be accessible and provided at first interaction (Art. 50(5))",
    "Emotion recognition systems must inform exposed individuals (Art. 50(3))",
  ],
  high: [
    "All limited-risk obligations apply",
    "Conformity assessment required before deployment",
    "Risk management system must be established and maintained",
    "Data governance and quality requirements must be met",
    "Technical documentation must be maintained",
    "Record-keeping and logging obligations apply",
    "Transparency and information provision to users required",
    "Human oversight measures must be implemented",
    "Accuracy, robustness, and cybersecurity requirements apply",
    "Registration in EU database required",
    "Post-market monitoring system required",
    "Serious incident reporting to authorities required",
  ],
};

export function generateAIDisclosure(
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
  const riskLevel = classifyAIRisk(scan.services, ctx);
  const aiUsageDescription = ctx?.aiUsageDescription;

  const sections: string[] = [];
  let sectionNum = 0;

  function nextSection(): number {
    return ++sectionNum;
  }

  // ── Title ──────────────────────────────────────────────────────────

  sections.push(`# AI Disclosure Statement

**Last updated:** ${date}

**Project:** ${scan.projectName}

---`);

  // ── Section 1: Introduction ────────────────────────────────────────

  sections.push(`
## ${nextSection()}. Introduction

This AI Disclosure Statement is provided by ${company} in compliance with the European Union Artificial Intelligence Act (Regulation (EU) 2024/1689), which establishes harmonised rules on artificial intelligence. Full transparency obligations under the EU AI Act take effect on **2 August 2026**.

This document describes the AI systems used in this application, how they are classified under the EU AI Act risk framework, what data they process, and what rights you have in relation to AI-assisted features.`);

  // ── Section 2: AI Systems Inventory ────────────────────────────────

  {
    let inventorySection = `
## ${nextSection()}. AI Systems Inventory

This application integrates the following AI systems:

| AI Service | Provider | Data Processed | Purpose |
|-----------|----------|---------------|---------|`;

    for (const ai of aiServices) {
      const provider = getProviderName(ai.name);
      const data = ai.dataCollected.join(", ");
      const purpose = getServicePurpose(ai.name);
      inventorySection += `\n| ${ai.name} | ${provider} | ${data} | ${purpose} |`;
    }

    if (aiUsageDescription) {
      inventorySection += `\n\n**Additional context:** ${aiUsageDescription}`;
    }

    sections.push(inventorySection);
  }

  // ── Section 3: Risk Classification ─────────────────────────────────

  {
    const obligations = RISK_OBLIGATIONS[riskLevel];
    const riskLabel = riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);

    let riskSection = `
## ${nextSection()}. Risk Classification

Under the EU AI Act, AI systems are classified into risk categories that determine the applicable obligations. Based on analysis of the AI services used in this application:

**Classification: ${riskLabel} Risk**

`;

    if (riskLevel === "minimal") {
      riskSection += `This application's use of AI is classified as **minimal risk**. AI is used internally or for purposes that do not directly affect end users in significant ways.\n`;
    } else if (riskLevel === "limited") {
      riskSection += `This application's use of AI is classified as **limited risk** because AI services interact directly with users (e.g., processing user prompts, generating content, or providing AI-assisted responses). Limited-risk AI systems are subject to transparency obligations under Article 50 of the EU AI Act.\n`;
    } else {
      riskSection += `This application's use of AI is classified as **high risk** because it involves AI in sensitive domains or high-impact decision-making. High-risk AI systems are subject to extensive requirements under Title III of the EU AI Act.\n`;
    }

    riskSection += `\n### Applicable Obligations\n`;
    for (const obligation of obligations) {
      riskSection += `\n- ${obligation}`;
    }

    if (ctx?.aiRiskLevel) {
      riskSection += `\n\n> This risk classification has been manually set by the application operator.`;
    }

    sections.push(riskSection);
  }

  // ── Section 4: Transparency Obligations ────────────────────────────

  sections.push(`
## ${nextSection()}. Transparency Obligations

In accordance with Article 50 of the EU AI Act, we inform you of the following:

### ${sectionNum}.1 AI Interaction Disclosure

When you interact with AI-powered features of this application, you are communicating with an AI system, not a human. AI features are clearly identified within the application.

### ${sectionNum}.2 AI Limitations

- AI-generated outputs may not always be accurate, complete, or unbiased
- AI responses are based on the training data and capabilities of the underlying models
- AI features are designed to assist, not to replace professional judgment

### ${sectionNum}.3 First-Interaction Disclosure (Art. 50(5))

Under Article 50(5), users must be informed at the point of first interaction with the AI system, in a clear and distinguishable manner, meeting accessibility standards (Directive (EU) 2019/882).

**Recommended implementation for this application:**
- Display a notice before the user first interacts with AI features
- Include an AI indicator icon or badge on AI-generated content
- Link to this full disclosure from the in-app notification`);

  // ── Section 5: AI-Generated Content ────────────────────────────────

  sections.push(`
## ${nextSection()}. AI-Generated Content

### ${sectionNum}.1 Synthetic Content Disclosure

This application generates synthetic content (text, and potentially other media) using AI. All content produced by AI features is artificial and should not be treated as human-authored.

### ${sectionNum}.2 Machine-Readable Marking (Art. 50(2))

Article 50(2) of the EU AI Act requires that AI-generated content be marked in a machine-readable format so that it can be identified as artificially generated or manipulated.

**Technical implementation:**
- AI-generated outputs should be marked using machine-readable metadata (e.g., C2PA content credentials, watermarking, or embedded flags)
- Marking should be applied at the point of generation and be interoperable with detection tools
- The EU Code of Practice on marking and labelling AI-generated content provides guidance on compliant marking methods

> **Action required:** Implement a technical mechanism to mark AI-generated outputs in accordance with Article 50(2). Consult the EU Code of Practice on AI-generated content labelling (final version expected 2026) for guidance on compliant marking methods.`);

  // ── Section 6: Data Processing by AI ───────────────────────────────

  {
    let dataSection = `
## ${nextSection()}. Data Processing by AI

### ${sectionNum}.1 What Data Is Sent to AI Providers

The following data may be sent to third-party AI service providers for processing:

| Data Type | AI Providers Receiving Data |
|-----------|-----------------------------|`;

    // Collect data types across all AI services
    const dataToProviders = new Map<string, string[]>();
    for (const ai of aiServices) {
      const provider = getProviderName(ai.name);
      for (const data of ai.dataCollected) {
        const existing = dataToProviders.get(data) || [];
        existing.push(provider);
        dataToProviders.set(data, existing);
      }
    }

    for (const [data, providers] of dataToProviders) {
      dataSection += `\n| ${data} | ${providers.join(", ")} |`;
    }

    dataSection += `

### ${sectionNum}.2 Data Retention

- We do not use your data to train or fine-tune AI models
- Data may be temporarily retained by AI providers for abuse prevention and service improvement
- AI interaction data is typically retained for up to 90 days, subject to each provider's data processing policies

### ${sectionNum}.3 Cross-Border Transfers

Data sent to AI providers may be transferred to and processed in countries outside the European Economic Area (EEA), including the United States. Where such transfers occur, appropriate safeguards are in place, including Standard Contractual Clauses (SCCs) and, where applicable, EU-US Data Privacy Framework certification.`;

    sections.push(dataSection);
  }

  // ── Section 7: Human Oversight ─────────────────────────────────────

  sections.push(`
## ${nextSection()}. Human Oversight

In accordance with the EU AI Act's requirements for human oversight of AI systems:

- AI features are designed to assist users, not to make autonomous decisions
- Users maintain full control over whether to accept, modify, or reject AI-generated outputs
- Critical decisions should not be based solely on AI outputs without human review
- Users can request human review of any AI-assisted decision that affects them

### How to Request Human Review

If an AI-powered feature of this application produces a decision or output that affects you, you have the right to request that a human reviews the decision. To request human review:

- Contact us at ${email}
- Describe the AI-assisted decision or output in question
- We will have a qualified person review the matter and respond within a reasonable timeframe`);

  // ── Section 8: User Rights ─────────────────────────────────────────

  sections.push(`
## ${nextSection()}. User Rights Regarding AI

Under the EU AI Act and applicable data protection laws, you have the right to:

- **Know** when you are interacting with an AI system
- **Understand** how your data is used in AI processing
- **Opt out** of AI-powered features where technically feasible
- **Request information** about the logic involved in AI decisions that affect you
- **Request human review** of AI-assisted decisions that produce legal or similarly significant effects
- **Contest** AI-generated decisions and express your point of view
- **Lodge complaints** with your local data protection authority or the relevant national AI supervisory authority

To exercise any of these rights, contact us at ${email}.`);

  // ── Section 9: AI Provider Policies ────────────────────────────────

  {
    let providerSection = `
## ${nextSection()}. AI Provider Policies

The following AI providers process data on behalf of this application. We encourage you to review their privacy and data handling policies:

| Provider | Privacy Policy |
|----------|---------------|`;

    const seenProviders = new Set<string>();
    for (const ai of aiServices) {
      const provider = getProviderName(ai.name);
      if (seenProviders.has(provider)) continue;
      seenProviders.add(provider);
      const policyUrl = getProviderPolicyUrl(ai.name);
      providerSection += `\n| ${provider} | [Privacy & Data Policy](${policyUrl}) |`;
    }

    sections.push(providerSection);
  }

  // ── Section 10: Compliance Checklist ───────────────────────────────

  {
    let checklistSection = `
## ${nextSection()}. Compliance Checklist

The following checklist summarises key EU AI Act compliance actions for this application:

### Transparency
- [ ] Users are informed when interacting with AI features
- [ ] AI-generated content is clearly labelled
- [ ] This AI Disclosure document is accessible from the application
- [ ] Disclosure is provided at or before first AI interaction`;

    checklistSection += `

### Content Marking
- [ ] AI-generated outputs include machine-readable marking (Art. 50(2))
- [ ] Marking method is interoperable with standard detection tools
- [ ] Synthetic media is labelled as AI-generated (Art. 50(4))`;

    checklistSection += `

### Human Oversight
- [ ] Process exists for users to request human review of AI decisions
- [ ] Staff are trained to handle human review requests
- [ ] AI features do not make autonomous decisions with legal or significant effects`;

    if (riskLevel === "high") {
      checklistSection += `

### High-Risk System Requirements
- [ ] Conformity assessment completed
- [ ] Risk management system established
- [ ] Technical documentation maintained
- [ ] System registered in EU AI database
- [ ] Post-market monitoring system in place
- [ ] Serious incident reporting process established`;
    }

    checklistSection += `

### Documentation
- [ ] AI systems inventory is complete and up to date
- [ ] Data processing records include AI providers
- [ ] AI provider agreements are reviewed and signed
- [ ] This disclosure is reviewed and updated regularly`;

    sections.push(checklistSection);
  }

  // ── Section 11: Contact ────────────────────────────────────────────

  sections.push(`
## ${nextSection()}. Contact

For questions about our use of AI systems or to exercise your rights under the EU AI Act, please contact:

- **Email:** ${email}${dpoEmail ? `\n- **Data Protection Officer:** ${dpoEmail}` : ""}

For complaints regarding AI systems, you may also contact your national supervisory authority responsible for the enforcement of the EU AI Act.

---

*This AI disclosure was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. This document should be reviewed by a legal professional to ensure compliance with the EU AI Act (Regulation (EU) 2024/1689) and other applicable regulations.*`);

  return sections.join("\n");
}

function getProviderName(serviceName: string): string {
  const providers: Record<string, string> = {
    openai: "OpenAI",
    "@anthropic-ai/sdk": "Anthropic",
    "@google/generative-ai": "Google",
    replicate: "Replicate",
    "together-ai": "Together AI",
    cohere: "Cohere",
    "@pinecone-database/pinecone": "Pinecone",
    langchain: "LangChain",
  };
  return providers[serviceName] || serviceName;
}

function getProviderPolicyUrl(serviceName: string): string {
  const urls: Record<string, string> = {
    openai: "https://openai.com/policies/privacy-policy",
    "@anthropic-ai/sdk": "https://www.anthropic.com/privacy",
    "@google/generative-ai": "https://ai.google/responsibility/privacy/",
    replicate: "https://replicate.com/privacy",
    "together-ai": "https://www.together.ai/privacy",
    cohere: "https://cohere.com/privacy",
    "@pinecone-database/pinecone": "https://www.pinecone.io/privacy/",
    langchain: "https://www.langchain.com/privacy-policy",
  };
  return urls[serviceName] || "#";
}

function getServicePurpose(serviceName: string): string {
  const purposes: Record<string, string> = {
    openai: "Natural language processing, content generation",
    "@anthropic-ai/sdk": "Natural language processing, content generation",
    "@google/generative-ai": "Natural language processing, content generation",
    replicate: "AI model inference, content generation",
    "together-ai": "AI model inference, content generation",
    cohere: "Natural language processing, embeddings, content generation",
    "@pinecone-database/pinecone": "Vector storage and similarity search",
    langchain: "AI orchestration, multi-model workflows",
  };
  return purposes[serviceName] || "AI processing";
}
