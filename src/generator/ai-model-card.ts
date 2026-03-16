import type { ScanResult, DetectedService } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";
import { classifyAIRisk } from "./ai-disclosure.js";

/**
 * Provider metadata for AI model card generation.
 * Maps service signature names to detailed model card information
 * per EU AI Act Article 53 (GPAI model transparency requirements).
 */
interface ModelCardInfo {
  modelName: string;
  provider: string;
  defaultPurpose: string;
  knownLimitations: string[];
  biasConsiderations: string[];
  trainingDataUrl: string;
  performanceMetricsNote: string;
}

const MODEL_CARD_INFO: Record<string, ModelCardInfo> = {
  openai: {
    modelName: "OpenAI GPT-4 / GPT-4o",
    provider: "OpenAI",
    defaultPurpose: "Natural language processing, content generation, conversational AI",
    knownLimitations: [
      "May generate plausible-sounding but factually incorrect information (hallucination)",
      "Knowledge cutoff limits awareness of recent events",
      "Limited ability to perform mathematical reasoning reliably",
      "Cannot access real-time information or browse the internet unless explicitly configured",
    ],
    biasConsiderations: [
      "Training data reflects biases present in internet text corpora",
      "May exhibit cultural, gender, or demographic biases in generated outputs",
      "Performance may vary across languages, with strongest performance in English",
      "Stereotypical associations may appear in open-ended generation tasks",
    ],
    trainingDataUrl: "https://openai.com/research",
    performanceMetricsNote: "See OpenAI system card and technical reports for benchmark results",
  },
  "@anthropic-ai/sdk": {
    modelName: "Anthropic Claude",
    provider: "Anthropic",
    defaultPurpose: "Natural language processing, content generation, conversational AI",
    knownLimitations: [
      "May generate plausible-sounding but factually incorrect information",
      "Knowledge cutoff limits awareness of recent events",
      "May refuse tasks it misclassifies as potentially harmful",
      "Limited multimodal capabilities compared to text-only performance",
    ],
    biasConsiderations: [
      "Training data reflects biases present in internet text corpora",
      "Constitutional AI training aims to reduce harmful biases but may not eliminate all",
      "Performance may vary across languages and cultural contexts",
      "May exhibit sycophantic behaviour, agreeing with users rather than providing accurate information",
    ],
    trainingDataUrl: "https://www.anthropic.com/research",
    performanceMetricsNote: "See Anthropic model cards and technical reports for benchmark results",
  },
  "@google/generative-ai": {
    modelName: "Google Gemini",
    provider: "Google",
    defaultPurpose: "Natural language processing, content generation, multimodal AI",
    knownLimitations: [
      "May generate factually incorrect or misleading content",
      "Knowledge cutoff limits awareness of recent events",
      "Multimodal outputs may misinterpret visual or audio inputs",
      "May produce inconsistent responses to similar prompts",
    ],
    biasConsiderations: [
      "Training data reflects biases present in web-scale text and media corpora",
      "May exhibit cultural, gender, or demographic biases",
      "Image generation and interpretation may reflect stereotypical representations",
      "Performance varies across languages, with strongest coverage in widely-spoken languages",
    ],
    trainingDataUrl: "https://ai.google/responsibility/",
    performanceMetricsNote: "See Google Gemini technical reports for benchmark results",
  },
  "@ai-sdk/openai": {
    modelName: "OpenAI GPT-4 / GPT-4o (via Vercel AI SDK)",
    provider: "OpenAI (via Vercel AI SDK)",
    defaultPurpose: "Natural language processing, content generation, conversational AI",
    knownLimitations: [
      "May generate plausible-sounding but factually incorrect information",
      "Knowledge cutoff limits awareness of recent events",
      "Limited ability to perform mathematical reasoning reliably",
      "SDK abstraction layer may limit access to provider-specific safety features",
    ],
    biasConsiderations: [
      "Training data reflects biases present in internet text corpora",
      "May exhibit cultural, gender, or demographic biases in generated outputs",
      "Performance may vary across languages",
      "Stereotypical associations may appear in open-ended generation tasks",
    ],
    trainingDataUrl: "https://openai.com/research",
    performanceMetricsNote: "See OpenAI system card for benchmark results",
  },
  "@ai-sdk/anthropic": {
    modelName: "Anthropic Claude (via Vercel AI SDK)",
    provider: "Anthropic (via Vercel AI SDK)",
    defaultPurpose: "Natural language processing, content generation, conversational AI",
    knownLimitations: [
      "May generate plausible-sounding but factually incorrect information",
      "Knowledge cutoff limits awareness of recent events",
      "May refuse tasks it misclassifies as potentially harmful",
      "SDK abstraction layer may limit access to provider-specific safety features",
    ],
    biasConsiderations: [
      "Training data reflects biases present in internet text corpora",
      "Constitutional AI training aims to reduce harmful biases but may not eliminate all",
      "Performance may vary across languages and cultural contexts",
      "May exhibit sycophantic behaviour",
    ],
    trainingDataUrl: "https://www.anthropic.com/research",
    performanceMetricsNote: "See Anthropic model cards for benchmark results",
  },
  "@ai-sdk/google": {
    modelName: "Google Gemini (via Vercel AI SDK)",
    provider: "Google (via Vercel AI SDK)",
    defaultPurpose: "Natural language processing, content generation, multimodal AI",
    knownLimitations: [
      "May generate factually incorrect or misleading content",
      "Knowledge cutoff limits awareness of recent events",
      "SDK abstraction layer may limit access to provider-specific safety features",
      "May produce inconsistent responses to similar prompts",
    ],
    biasConsiderations: [
      "Training data reflects biases present in web-scale corpora",
      "May exhibit cultural, gender, or demographic biases",
      "Performance varies across languages",
      "Image-related tasks may reflect stereotypical representations",
    ],
    trainingDataUrl: "https://ai.google/responsibility/",
    performanceMetricsNote: "See Google Gemini technical reports for benchmark results",
  },
  "@ai-sdk/google-vertex": {
    modelName: "Google Vertex AI",
    provider: "Google Cloud",
    defaultPurpose: "Enterprise AI model hosting, natural language processing, content generation",
    knownLimitations: [
      "May generate factually incorrect or misleading content",
      "Model behaviour depends on the specific model deployed on Vertex AI",
      "Enterprise features may introduce additional latency",
      "SDK abstraction layer may limit access to provider-specific safety features",
    ],
    biasConsiderations: [
      "Bias profile depends on the underlying model deployed",
      "Enterprise deployments should conduct domain-specific bias testing",
      "Training data reflects biases present in web-scale corpora",
      "Performance varies across languages and domains",
    ],
    trainingDataUrl: "https://cloud.google.com/vertex-ai/docs",
    performanceMetricsNote: "See Google Cloud Vertex AI documentation for model-specific benchmarks",
  },
  "@vercel/ai": {
    modelName: "Vercel AI SDK (multi-provider)",
    provider: "Vercel (orchestration layer)",
    defaultPurpose: "AI orchestration, streaming responses, multi-provider integration",
    knownLimitations: [
      "Limitations depend on the underlying AI provider and model selected",
      "Orchestration layer adds a dependency but does not process data itself",
      "Streaming responses may be interrupted by network conditions",
      "Provider-specific safety features may not be fully exposed through the SDK",
    ],
    biasConsiderations: [
      "Bias profile depends entirely on the underlying model and provider",
      "The SDK itself does not introduce additional bias but also does not mitigate it",
      "Applications should evaluate bias at the provider/model level",
    ],
    trainingDataUrl: "https://sdk.vercel.ai/docs",
    performanceMetricsNote: "Performance depends on the underlying provider; see provider-specific documentation",
  },
  replicate: {
    modelName: "Replicate (multi-model platform)",
    provider: "Replicate",
    defaultPurpose: "AI model inference, image generation, content generation",
    knownLimitations: [
      "Limitations vary by the specific model being used",
      "Cold start latency for infrequently-used models",
      "Model availability depends on community contributions",
      "Output quality varies significantly between models",
    ],
    biasConsiderations: [
      "Bias profile depends on the specific model selected",
      "Community-contributed models may not have undergone bias evaluation",
      "Image generation models may reflect stereotypical representations",
      "Applications should evaluate bias for each model used",
    ],
    trainingDataUrl: "https://replicate.com/docs",
    performanceMetricsNote: "See individual model pages on Replicate for performance information",
  },
  "together-ai": {
    modelName: "Together AI (multi-model platform)",
    provider: "Together AI",
    defaultPurpose: "AI model inference, content generation",
    knownLimitations: [
      "Limitations vary by the specific model being used",
      "Open-source models may have less safety tuning than proprietary alternatives",
      "Model availability and performance may change as models are updated",
      "May generate factually incorrect or misleading content",
    ],
    biasConsiderations: [
      "Bias profile depends on the specific model selected",
      "Open-source models may have less bias mitigation than proprietary models",
      "Training data for hosted models reflects biases in their original training corpora",
      "Applications should evaluate bias for each model used",
    ],
    trainingDataUrl: "https://www.together.ai/models",
    performanceMetricsNote: "See Together AI model catalogue for performance benchmarks",
  },
  cohere: {
    modelName: "Cohere Command / Embed",
    provider: "Cohere",
    defaultPurpose: "Natural language processing, embeddings, content generation, search",
    knownLimitations: [
      "May generate factually incorrect or misleading content",
      "Embedding models may not capture domain-specific semantic nuances",
      "Knowledge cutoff limits awareness of recent events",
      "Multilingual performance varies by language",
    ],
    biasConsiderations: [
      "Training data reflects biases present in web-scale text corpora",
      "Embedding spaces may encode societal biases in vector representations",
      "Performance and bias profile differ between English and non-English languages",
      "Applications using embeddings for ranking or filtering should test for bias",
    ],
    trainingDataUrl: "https://docs.cohere.com",
    performanceMetricsNote: "See Cohere documentation and model cards for benchmark results",
  },
  "@pinecone-database/pinecone": {
    modelName: "Pinecone Vector Database",
    provider: "Pinecone",
    defaultPurpose: "Vector storage and similarity search for AI applications",
    knownLimitations: [
      "Does not perform inference; stores and retrieves vector embeddings",
      "Search quality depends on the quality of input embeddings",
      "Approximate nearest neighbour search may miss relevant results",
      "Index size and query latency trade-offs apply",
    ],
    biasConsiderations: [
      "Biases in stored embeddings will be reflected in search results",
      "Similarity search may amplify biases present in the embedding model",
      "Applications should evaluate whether retrieval results exhibit demographic or topical bias",
    ],
    trainingDataUrl: "https://docs.pinecone.io",
    performanceMetricsNote: "See Pinecone documentation for indexing and query performance benchmarks",
  },
  langchain: {
    modelName: "LangChain (AI orchestration framework)",
    provider: "LangChain",
    defaultPurpose: "AI orchestration, multi-model workflows, retrieval-augmented generation",
    knownLimitations: [
      "Limitations depend on the underlying AI models and tools configured",
      "Chain-of-thought workflows may compound errors across steps",
      "Retrieval-augmented generation quality depends on document corpus quality",
      "Complex chains may be difficult to debug and audit",
    ],
    biasConsiderations: [
      "Bias profile depends on the underlying models and data sources",
      "RAG pipelines may surface biased or unrepresentative documents",
      "Multi-step workflows may amplify biases present in individual components",
      "Applications should evaluate bias at each stage of the pipeline",
    ],
    trainingDataUrl: "https://docs.langchain.com",
    performanceMetricsNote: "Performance depends on the underlying models and tools; see provider-specific documentation",
  },
};

/**
 * Generates an AI Model Card document (AI_MODEL_CARD.md) aligned with
 * EU AI Act Article 53 transparency requirements for GPAI models.
 *
 * Only generates when AI services are detected in the scan.
 */
export function generateAIModelCard(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  const aiServices = scan.services.filter((s) => s.category === "ai");

  if (aiServices.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const date = new Date().toISOString().split("T")[0];
  const riskLevel = classifyAIRisk(scan.services, ctx);
  const riskLabel = riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);

  const sections: string[] = [];

  // ── Title ──────────────────────────────────────────────────────────

  sections.push(`# AI Model Card

**Organisation:** ${company}
**Project:** ${scan.projectName}
**Risk Classification:** ${riskLabel}
**Generated:** ${date}

---

> This document provides model-level transparency information for each AI service integrated into this application, in accordance with Article 53 of the EU AI Act (Regulation (EU) 2024/1689) regarding transparency obligations for providers of general-purpose AI (GPAI) models. Full obligations take effect on **2 August 2026**.`);

  // ── Model Cards ────────────────────────────────────────────────────

  for (const ai of aiServices) {
    const info = getModelCardInfo(ai);
    const dataInputs = ai.dataCollected.length > 0
      ? ai.dataCollected.join(", ")
      : "Not specified";

    let card = `
---

## ${info.modelName}

### Overview

| Field | Detail |
|-------|--------|
| **Model / Service** | ${info.modelName} |
| **Provider** | ${info.provider} |
| **Service Identifier** | \`${ai.name}\` |
| **Use Case in This Application** | ${info.defaultPurpose} |
| **Risk Classification** | ${riskLabel} |

### Data Inputs

The following data types are sent to this AI service based on code analysis:

${ai.dataCollected.map((d) => `- ${d}`).join("\n")}

### Known Limitations

${info.knownLimitations.map((l) => `- ${l}`).join("\n")}

### Bias Considerations

${info.biasConsiderations.map((b) => `- ${b}`).join("\n")}

### Performance Metrics

> **Placeholder:** ${info.performanceMetricsNote}
>
> Operators deploying this AI system should document application-specific performance metrics including accuracy, false positive/negative rates, and fairness metrics relevant to their use case.

| Metric | Value | Notes |
|--------|-------|-------|
| Accuracy | _To be measured_ | Measure against application-specific test set |
| Latency (p50) | _To be measured_ | Median response time in production |
| Latency (p99) | _To be measured_ | 99th percentile response time |
| Error rate | _To be measured_ | Rate of failed or invalid responses |
| Fairness | _To be measured_ | Evaluate across demographic groups relevant to use case |

### Training Data Transparency

- **Provider documentation:** [${info.provider} Research & Documentation](${info.trainingDataUrl})
- **Training data disclosure:** Refer to the provider's published model card and technical reports for details on training data composition, filtering, and governance
- **Data governance:** Review the provider's data processing agreement for information on how training data is sourced, curated, and maintained`;

    sections.push(card);
  }

  // ── Article 53 Compliance Summary ──────────────────────────────────

  sections.push(`
---

## Article 53 Compliance Summary

The EU AI Act Article 53 requires providers of general-purpose AI models to:

### 53(1) — Technical Documentation
- [ ] Maintain up-to-date technical documentation for each GPAI model used
- [ ] Documentation covers model training, testing, and evaluation results
- [ ] Information is sufficient for downstream providers to comply with their obligations

### 53(1)(a) — Model Identification
- [ ] Each AI model is clearly identified with name, version, and provider
- [ ] Model capabilities and limitations are documented
- [ ] Intended and foreseeable use cases are described

### 53(1)(b) — Training & Testing
- [ ] Training data sources and governance are documented (or referenced from provider)
- [ ] Evaluation results and benchmark performance are recorded
- [ ] Testing methodology is described or referenced

### 53(1)(c) — Integration Information
- [ ] Information for downstream integrators is provided
- [ ] API usage, data flow, and processing scope are documented
- [ ] Known risks and mitigation measures are communicated

### 53(1)(d) — Copyright Compliance
- [ ] Provider's copyright policy for training data is reviewed
- [ ] EU Copyright Directive (Directive (EU) 2019/790) compliance is verified with provider
- [ ] Text and data mining opt-out mechanisms are documented where applicable

### 53(2) — Systemic Risk (if applicable)
- [ ] Assess whether any GPAI model used has systemic risk (>10^25 FLOPs or EC designation)
- [ ] If systemic risk applies, additional obligations under Article 55 must be met
- [ ] Model evaluation and adversarial testing documentation is maintained

> **Note:** As a deployer (not provider) of GPAI models, your primary obligation is to ensure that the AI providers you use comply with Article 53. This checklist helps you verify and document that compliance.`);

  // ── Data Flow Summary ──────────────────────────────────────────────

  {
    const dataToProviders = new Map<string, string[]>();
    for (const ai of aiServices) {
      const info = getModelCardInfo(ai);
      for (const data of ai.dataCollected) {
        const existing = dataToProviders.get(data) || [];
        existing.push(info.provider);
        dataToProviders.set(data, existing);
      }
    }

    let dataFlowSection = `
## Data Flow Summary

| Data Type | AI Providers Receiving Data |
|-----------|-----------------------------|`;

    for (const [data, providers] of dataToProviders) {
      const uniqueProviders = [...new Set(providers)];
      dataFlowSection += `\n| ${data} | ${uniqueProviders.join(", ")} |`;
    }

    sections.push(dataFlowSection);
  }

  // ── Footer ─────────────────────────────────────────────────────────

  sections.push(`
## Contact

For questions about the AI models used in this application:

- **Email:** ${email}${ctx?.dpoEmail ? `\n- **Data Protection Officer:** ${ctx.dpoEmail}` : ""}

---

*This AI Model Card was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Model information is derived from publicly available provider documentation as of the generation date. This document should be reviewed by a qualified professional to ensure compliance with the EU AI Act (Regulation (EU) 2024/1689) Article 53 and other applicable regulations. Performance metrics marked as placeholders must be completed based on application-specific evaluation.*`);

  return sections.join("\n");
}

/**
 * Look up model card info for a detected AI service.
 * Falls back to a generic entry for unknown services.
 */
function getModelCardInfo(service: DetectedService): ModelCardInfo {
  if (MODEL_CARD_INFO[service.name]) {
    return MODEL_CARD_INFO[service.name];
  }

  // Generic fallback for unknown AI services
  return {
    modelName: service.name,
    provider: service.name,
    defaultPurpose: "AI processing",
    knownLimitations: [
      "Specific limitations not available — consult provider documentation",
      "May generate inaccurate or misleading outputs",
      "Performance characteristics should be evaluated for the specific use case",
    ],
    biasConsiderations: [
      "Bias profile not available — consult provider documentation",
      "Applications should conduct bias evaluation for the specific use case",
      "Monitor outputs for demographic or topical bias",
    ],
    trainingDataUrl: "#",
    performanceMetricsNote: "Consult provider documentation for performance information",
  };
}
