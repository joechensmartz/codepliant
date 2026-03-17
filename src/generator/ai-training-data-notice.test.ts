import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateAITrainingDataNotice } from "./ai-training-data-notice.js";
import type { GeneratorContext } from "./index.js";

function makeService(
  name: string,
  category: DetectedService["category"],
  dataCollected: string[] = ["test data"],
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

// ── Null guard ──────────────────────────────────────────────────────────

describe("generateAITrainingDataNotice", () => {
  it("returns null when no services detected", () => {
    const result = generateAITrainingDataNotice(makeScan());
    assert.strictEqual(result, null);
  });

  it("returns null when no AI services detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateAITrainingDataNotice(scan);
    assert.strictEqual(result, null);
  });

  it("returns null when only non-AI services present", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("google-analytics", "analytics"),
      ],
    });
    const result = generateAITrainingDataNotice(scan);
    assert.strictEqual(result, null);
  });

  // ── Basic generation ───────────────────────────────────────────────

  it("generates document when AI services are present", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(typeof result === "string");
    assert.ok(result.includes("# AI Training Data Notice"));
  });

  it("returns non-empty string for a single AI service", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.length > 200);
  });

  // ── Header & metadata ─────────────────────────────────────────────

  it("includes project name", () => {
    const scan = makeScan({
      projectName: "my-saas",
      services: [makeService("openai", "ai")],
    });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("my-saas"));
  });

  it("includes date in ISO format", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result!));
  });

  it("uses default company placeholder when no context", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("[Your Company Name]"));
  });

  it("uses company name from context", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAITrainingDataNotice(scan, makeCtx({ companyName: "TechCo" }));
    assert.ok(result!.includes("TechCo"));
    assert.ok(!result!.includes("[Your Company Name]"));
  });

  it("uses default email placeholder when no context", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("[your-email@example.com]"));
  });

  it("uses contact email from context", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAITrainingDataNotice(scan, makeCtx({ contactEmail: "privacy@techco.com" }));
    assert.ok(result!.includes("privacy@techco.com"));
  });

  it("includes DPO email when provided", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAITrainingDataNotice(scan, makeCtx({ dpoEmail: "dpo@acme.com" }));
    assert.ok(result!.includes("dpo@acme.com"));
  });

  it("omits DPO email when not provided", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAITrainingDataNotice(scan, makeCtx());
    assert.ok(!result!.includes("Data Protection Officer"));
  });

  // ── Regulatory references ─────────────────────────────────────────

  it("references EU AI Act", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("EU AI Act"));
    assert.ok(result!.includes("2024/1689"));
  });

  it("references GDPR", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("GDPR"));
  });

  it("references CCPA/CPRA", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("CCPA"));
  });

  // ── Known provider: OpenAI ────────────────────────────────────────

  it("shows OpenAI training policy details", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("OpenAI"));
    assert.ok(result!.includes("NOT used for model training"));
  });

  it("shows OpenAI as not using data for training in summary table", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("| OpenAI | No | N/A (not used) |"));
  });

  // ── Known provider: Anthropic ─────────────────────────────────────

  it("shows Anthropic training policy details", () => {
    const scan = makeScan({ services: [makeService("@anthropic-ai/sdk", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("Anthropic"));
    assert.ok(result!.includes("does NOT use API inputs"));
  });

  // ── Known provider: Google Gemini (uses data conditionally) ───────

  it("shows Google Gemini as conditional training user", () => {
    const scan = makeScan({ services: [makeService("@google/generative-ai", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("Google (Gemini)"));
    assert.ok(result!.includes("Conditional (see details)"));
    assert.ok(result!.includes("Yes"));
  });

  it("shows Google Gemini opt-out instructions", () => {
    const scan = makeScan({ services: [makeService("@google/generative-ai", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("paid API tier") || result!.includes("paid tier"));
  });

  // ── Known provider: Replicate ─────────────────────────────────────

  it("shows Replicate as not using data for training", () => {
    const scan = makeScan({ services: [makeService("replicate", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("Replicate"));
    assert.ok(result!.includes("| Replicate | No | N/A (not used) |"));
  });

  // ── Known provider: Together AI ───────────────────────────────────

  it("shows Together AI policy", () => {
    const scan = makeScan({ services: [makeService("together-ai", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("Together AI"));
  });

  // ── Known provider: Cohere ────────────────────────────────────────

  it("shows Cohere policy", () => {
    const scan = makeScan({ services: [makeService("cohere", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("Cohere"));
  });

  // ── Known provider: Pinecone ──────────────────────────────────────

  it("shows Pinecone as storage-only service", () => {
    const scan = makeScan({ services: [makeService("@pinecone-database/pinecone", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("Pinecone"));
    assert.ok(result!.includes("vector database"));
  });

  // ── Known provider: LangChain ─────────────────────────────────────

  it("shows LangChain as orchestration framework", () => {
    const scan = makeScan({ services: [makeService("langchain", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("LangChain"));
    assert.ok(result!.includes("orchestration framework"));
  });

  // ── Unknown AI service ────────────────────────────────────────────

  it("lists unknown AI services in Other AI Services section", () => {
    const scan = makeScan({
      services: [makeService("some-custom-ai", "ai")],
    });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("some-custom-ai"));
    assert.ok(result!.includes("Unknown"));
    assert.ok(result!.includes("Other AI Services"));
  });

  it("shows action required for unknown services", () => {
    const scan = makeScan({
      services: [makeService("some-custom-ai", "ai")],
    });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("Action required"));
  });

  it("shows file evidence for unknown services", () => {
    const scan = makeScan({
      services: [makeService("some-custom-ai", "ai")],
    });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("package.json"));
  });

  // ── Summary section ───────────────────────────────────────────────

  it("states none use data for training when all opted out", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("@anthropic-ai/sdk", "ai"),
      ],
    });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("None of the"));
    assert.ok(result!.includes("do not use your data for model training") || result!.includes("verified"));
  });

  it("warns when some providers may use data for training", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("@google/generative-ai", "ai"),
      ],
    });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("may use data for model training"));
  });

  // ── Summary table ─────────────────────────────────────────────────

  it("includes summary table with headers", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("| AI Provider |"));
    assert.ok(result!.includes("Uses Data for Training"));
    assert.ok(result!.includes("Opt-Out Available"));
  });

  // ── Our Commitment section ────────────────────────────────────────

  it("includes commitment section", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("## Our Commitment"));
    assert.ok(result!.includes("committed to protecting"));
  });

  // ── Per-provider details ──────────────────────────────────────────

  it("includes per-provider section", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("## Per-Provider Training Data Policies"));
    assert.ok(result!.includes("### OpenAI"));
  });

  it("includes privacy policy URL for known providers", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("openai.com/policies/privacy-policy"));
  });

  it("includes retention information", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("Data Retention"));
    assert.ok(result!.includes("30 days"));
  });

  // ── Deduplication ─────────────────────────────────────────────────

  it("deduplicates providers when same provider detected twice", () => {
    // If two services map to the same provider, only show once
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("openai", "ai", ["different data"]),
      ],
    });
    const result = generateAITrainingDataNotice(scan);
    const matches = result!.match(/### OpenAI/g) || [];
    assert.strictEqual(matches.length, 1);
  });

  // ── Your Rights section ───────────────────────────────────────────

  it("includes user rights section", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("## Your Rights"));
    assert.ok(result!.includes("GDPR Art. 21"));
    assert.ok(result!.includes("GDPR Art. 17"));
  });

  // ── Implementation checklist ──────────────────────────────────────

  it("includes implementation checklist", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("## Implementation Checklist"));
    const checkboxes = (result!.match(/- \[ \]/g) || []).length;
    assert.ok(checkboxes >= 5, `Expected >= 5 checklist items, got ${checkboxes}`);
  });

  // ── Contact section ───────────────────────────────────────────────

  it("includes contact section", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("## Contact"));
  });

  // ── Footer disclaimer ─────────────────────────────────────────────

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("Codepliant"));
    assert.ok(result!.includes("subject to change"));
  });

  // ── Multiple providers ────────────────────────────────────────────

  it("handles multiple known providers", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("@anthropic-ai/sdk", "ai"),
        makeService("@google/generative-ai", "ai"),
      ],
    });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("### OpenAI"));
    assert.ok(result!.includes("### Anthropic"));
    assert.ok(result!.includes("### Google (Gemini)"));
  });

  it("handles mix of known and unknown providers", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("custom-ml-lib", "ai"),
      ],
    });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("### OpenAI"));
    assert.ok(result!.includes("### Other AI Services"));
    assert.ok(result!.includes("custom-ml-lib"));
  });

  // ── Google Gemini API-level opt-out ───────────────────────────────

  it("shows API-level opt-out for Google Gemini", () => {
    const scan = makeScan({ services: [makeService("@google/generative-ai", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(result!.includes("API-level opt-out"));
  });

  it("does not show API-level opt-out for providers with N/A", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAITrainingDataNotice(scan);
    assert.ok(!result!.includes("API-level opt-out"));
  });
});
