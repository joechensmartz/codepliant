import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateAIModelCard } from "./ai-model-card.js";
import type { GeneratorContext } from "./index.js";

function makeService(
  name: string,
  category: DetectedService["category"],
  dataCollected: string[] = ["user prompts"],
): DetectedService {
  return {
    name,
    category,
    evidence: [{ type: "dependency", file: "package.json", detail: `${name} detected` }],
    dataCollected,
  };
}

function makeScan(overrides: Partial<ScanResult> = {}): ScanResult {
  return {
    projectName: "test-project",
    projectPath: "/tmp/test",
    scannedAt: "2026-01-01",
    services: [],
    dataCategories: [],
    complianceNeeds: [],
    ...overrides,
  };
}

function makeCtx(overrides: Partial<GeneratorContext> = {}): GeneratorContext {
  return {
    companyName: "Acme Corp",
    contactEmail: "legal@acme.com",
    ...overrides,
  };
}

// ── Null guards ──────────────────────────────────────────────────────

describe("generateAIModelCard — null guards", () => {
  it("returns null when no services detected", () => {
    assert.strictEqual(generateAIModelCard(makeScan()), null);
  });

  it("returns null when only non-AI services detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    assert.strictEqual(generateAIModelCard(scan), null);
  });

  it("returns null with mixed non-AI services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("@sendgrid/mail", "email"),
        makeService("@sentry/node", "monitoring"),
      ],
    });
    assert.strictEqual(generateAIModelCard(scan), null);
  });

  it("returns null with empty services array", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateAIModelCard(scan), null);
  });
});

// ── Basic generation ────────────────────────────────────────────────

describe("generateAIModelCard — basic generation", () => {
  it("generates document when AI service detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan);
    assert.ok(typeof result === "string");
    assert.ok(result.includes("# AI Model Card"));
  });

  it("includes project name in output", () => {
    const scan = makeScan({
      projectName: "my-ai-app",
      services: [makeService("openai", "ai")],
    });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("my-ai-app"));
  });

  it("includes date in ISO format", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes Article 53 reference", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("Article 53"));
  });

  it("includes EU AI Act reference", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("EU AI Act"));
  });

  it("includes Codepliant footer", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("Codepliant"));
  });
});

// ── Context values ──────────────────────────────────────────────────

describe("generateAIModelCard — context values", () => {
  it("uses company name from context", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan, makeCtx({ companyName: "TestCo" }))!;
    assert.ok(result.includes("TestCo"));
  });

  it("uses contact email from context", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan, makeCtx({ contactEmail: "ai@test.com" }))!;
    assert.ok(result.includes("ai@test.com"));
  });

  it("uses placeholder when no company name", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses placeholder when no contact email", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("includes DPO email when provided", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan, makeCtx({ dpoEmail: "dpo@acme.com" }))!;
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("omits DPO line when not provided", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan, makeCtx())!;
    assert.ok(!result.includes("Data Protection Officer:"));
  });
});

// ── Risk classification ─────────────────────────────────────────────

describe("generateAIModelCard — risk classification", () => {
  it("includes risk classification label", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("**Risk Classification:**"));
  });

  it("capitalises risk label", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    // Should be "Minimal", "Limited", or "High" — first letter uppercase
    assert.ok(/\*\*Risk Classification:\*\* [A-Z][a-z]+/.test(result));
  });

  it("uses aiRiskLevel override from context", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan, makeCtx({ aiRiskLevel: "high" }))!;
    assert.ok(result.includes("High"));
  });
});

// ── Known provider model cards ──────────────────────────────────────

describe("generateAIModelCard — known providers", () => {
  it("generates card for OpenAI", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("OpenAI GPT-4"));
    assert.ok(result.includes("OpenAI"));
    assert.ok(result.includes("openai.com/research"));
  });

  it("generates card for Anthropic SDK", () => {
    const scan = makeScan({ services: [makeService("@anthropic-ai/sdk", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("Anthropic Claude"));
    assert.ok(result.includes("anthropic.com/research"));
  });

  it("generates card for Google Generative AI", () => {
    const scan = makeScan({ services: [makeService("@google/generative-ai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("Google Gemini"));
    assert.ok(result.includes("ai.google/responsibility"));
  });

  it("generates card for Vercel AI SDK (OpenAI)", () => {
    const scan = makeScan({ services: [makeService("@ai-sdk/openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("via Vercel AI SDK"));
    assert.ok(result.includes("OpenAI"));
  });

  it("generates card for Vercel AI SDK (Anthropic)", () => {
    const scan = makeScan({ services: [makeService("@ai-sdk/anthropic", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("Anthropic Claude (via Vercel AI SDK)"));
  });

  it("generates card for Vercel AI SDK (Google)", () => {
    const scan = makeScan({ services: [makeService("@ai-sdk/google", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("Google Gemini (via Vercel AI SDK)"));
  });

  it("generates card for Google Vertex AI", () => {
    const scan = makeScan({ services: [makeService("@ai-sdk/google-vertex", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("Google Vertex AI"));
    assert.ok(result.includes("Google Cloud"));
  });

  it("generates card for Vercel AI orchestration", () => {
    const scan = makeScan({ services: [makeService("@vercel/ai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("Vercel AI SDK (multi-provider)"));
  });

  it("generates card for Replicate", () => {
    const scan = makeScan({ services: [makeService("replicate", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("Replicate"));
    assert.ok(result.includes("replicate.com"));
  });

  it("generates card for Together AI", () => {
    const scan = makeScan({ services: [makeService("together-ai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("Together AI"));
  });

  it("generates card for Cohere", () => {
    const scan = makeScan({ services: [makeService("cohere", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("Cohere Command"));
    assert.ok(result.includes("docs.cohere.com"));
  });

  it("generates card for Pinecone", () => {
    const scan = makeScan({ services: [makeService("@pinecone-database/pinecone", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("Pinecone Vector Database"));
    assert.ok(result.includes("docs.pinecone.io"));
  });

  it("generates card for LangChain", () => {
    const scan = makeScan({ services: [makeService("langchain", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("LangChain"));
    assert.ok(result.includes("docs.langchain.com"));
  });
});

// ── Unknown provider fallback ───────────────────────────────────────

describe("generateAIModelCard — unknown providers", () => {
  it("generates card for unknown AI service with generic info", () => {
    const scan = makeScan({ services: [makeService("custom-ai-service", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("custom-ai-service"));
    assert.ok(result.includes("AI processing"));
  });

  it("includes generic limitations for unknown provider", () => {
    const scan = makeScan({ services: [makeService("custom-ai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("consult provider documentation"));
  });

  it("includes generic bias note for unknown provider", () => {
    const scan = makeScan({ services: [makeService("custom-ai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("Bias profile not available"));
  });
});

// ── Card content sections ───────────────────────────────────────────

describe("generateAIModelCard — card sections", () => {
  it("includes Overview table", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("### Overview"));
    assert.ok(result.includes("| **Model / Service**"));
    assert.ok(result.includes("| **Provider**"));
  });

  it("includes Data Inputs section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts", "chat history"])],
    });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("### Data Inputs"));
    assert.ok(result.includes("- user prompts"));
    assert.ok(result.includes("- chat history"));
  });

  it("includes Known Limitations section", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("### Known Limitations"));
    assert.ok(result.includes("hallucination"));
  });

  it("includes Bias Considerations section", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("### Bias Considerations"));
  });

  it("includes Performance Metrics table with placeholders", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("### Performance Metrics"));
    assert.ok(result.includes("_To be measured_"));
    assert.ok(result.includes("Accuracy"));
    assert.ok(result.includes("Latency"));
    assert.ok(result.includes("Error rate"));
    assert.ok(result.includes("Fairness"));
  });

  it("includes Training Data Transparency section", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("### Training Data Transparency"));
    assert.ok(result.includes("training data"));
  });

  it("includes service identifier in backticks", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("`openai`"));
  });
});

// ── Multiple AI services ────────────────────────────────────────────

describe("generateAIModelCard — multiple AI services", () => {
  it("generates separate cards for each AI service", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("@anthropic-ai/sdk", "ai"),
      ],
    });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("OpenAI GPT-4"));
    assert.ok(result.includes("Anthropic Claude"));
  });

  it("generates cards for three services", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("@anthropic-ai/sdk", "ai"),
        makeService("@google/generative-ai", "ai"),
      ],
    });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("OpenAI"));
    assert.ok(result.includes("Anthropic"));
    assert.ok(result.includes("Google Gemini"));
  });

  it("ignores non-AI services in card generation", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("stripe", "payment"),
        makeService("@sentry/node", "monitoring"),
      ],
    });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("OpenAI"));
    assert.ok(!result.includes("## stripe"));
    assert.ok(!result.includes("## @sentry/node"));
  });
});

// ── Article 53 compliance summary ───────────────────────────────────

describe("generateAIModelCard — Article 53 compliance", () => {
  it("includes compliance summary section", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("## Article 53 Compliance Summary"));
  });

  it("includes 53(1) technical documentation checklist", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("### 53(1)"));
    assert.ok(result.includes("Technical Documentation"));
  });

  it("includes 53(1)(a) model identification checklist", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("### 53(1)(a)"));
  });

  it("includes 53(1)(b) training and testing checklist", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("### 53(1)(b)"));
  });

  it("includes 53(1)(c) integration information checklist", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("### 53(1)(c)"));
  });

  it("includes 53(1)(d) copyright compliance checklist", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("### 53(1)(d)"));
    assert.ok(result.includes("Copyright"));
  });

  it("includes 53(2) systemic risk checklist", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("### 53(2)"));
    assert.ok(result.includes("Systemic Risk"));
  });

  it("includes checkbox items in checklists", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("- [ ]"));
  });

  it("includes deployer note about Article 53 obligations", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("deployer"));
  });
});

// ── Data flow summary ───────────────────────────────────────────────

describe("generateAIModelCard — data flow summary", () => {
  it("includes data flow summary section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("## Data Flow Summary"));
  });

  it("maps data types to providers", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts", "chat history"])],
    });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("user prompts"));
    assert.ok(result.includes("OpenAI"));
  });

  it("shows multiple providers for same data type", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("@anthropic-ai/sdk", "ai", ["user prompts"]),
      ],
    });
    const result = generateAIModelCard(scan)!;
    // Both providers should appear in the data flow table for "user prompts"
    assert.ok(result.includes("Data Flow Summary"));
    assert.ok(result.includes("OpenAI"));
    assert.ok(result.includes("Anthropic"));
  });

  it("deduplicates providers for same data type", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("@ai-sdk/openai", "ai", ["user prompts"]),
      ],
    });
    const result = generateAIModelCard(scan)!;
    // Both resolve to OpenAI variants but should be listed
    assert.ok(result.includes("Data Flow Summary"));
  });

  it("includes data flow table headers", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("| Data Type | AI Providers Receiving Data |"));
  });
});

// ── Contact section ─────────────────────────────────────────────────

describe("generateAIModelCard — contact section", () => {
  it("includes contact section", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("## Contact"));
  });

  it("includes email in contact section", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan, makeCtx({ contactEmail: "ai@test.com" }))!;
    assert.ok(result.includes("ai@test.com"));
  });
});

// ── Provider-specific details ───────────────────────────────────────

describe("generateAIModelCard — provider details", () => {
  it("OpenAI card mentions hallucination", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("hallucination"));
  });

  it("Anthropic card mentions Constitutional AI", () => {
    const scan = makeScan({ services: [makeService("@anthropic-ai/sdk", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("Constitutional AI"));
  });

  it("Anthropic card mentions sycophantic behaviour", () => {
    const scan = makeScan({ services: [makeService("@anthropic-ai/sdk", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("sycophantic"));
  });

  it("Vercel AI SDK mentions orchestration", () => {
    const scan = makeScan({ services: [makeService("@vercel/ai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("orchestration"));
  });

  it("Pinecone card mentions vector", () => {
    const scan = makeScan({ services: [makeService("@pinecone-database/pinecone", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("Vector"));
  });

  it("LangChain card mentions RAG", () => {
    const scan = makeScan({ services: [makeService("langchain", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("retrieval-augmented generation") || result.includes("RAG"));
  });

  it("Cohere card mentions embeddings", () => {
    const scan = makeScan({ services: [makeService("cohere", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("embedding") || result.includes("Embed"));
  });

  it("Replicate card mentions community models", () => {
    const scan = makeScan({ services: [makeService("replicate", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("community"));
  });

  it("Together AI mentions open-source", () => {
    const scan = makeScan({ services: [makeService("together-ai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("open-source") || result.includes("Open-source"));
  });

  it("Google Vertex mentions enterprise", () => {
    const scan = makeScan({ services: [makeService("@ai-sdk/google-vertex", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("Enterprise") || result.includes("enterprise"));
  });
});

// ── Disclaimer and legal review ─────────────────────────────────────

describe("generateAIModelCard — disclaimer", () => {
  it("includes disclaimer about legal review", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("reviewed by a qualified professional"));
  });

  it("includes 2 August 2026 deadline", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIModelCard(scan)!;
    assert.ok(result.includes("2 August 2026"));
  });
});
