import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateAISupplyChainRisk } from "./ai-supply-chain-risk.js";
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

describe("generateAISupplyChainRisk", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateAISupplyChainRisk(scan), null);
  });

  it("returns null when no AI services detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    assert.strictEqual(generateAISupplyChainRisk(scan), null);
  });

  it("returns null with only non-AI categories", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("sentry", "monitoring"),
      ],
    });
    assert.strictEqual(generateAISupplyChainRisk(scan), null);
  });

  // ── Basic generation ───────────────────────────────────────────────

  it("generates document with a single AI service", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result !== null);
    assert.ok(result.includes("# AI Supply Chain Risk Assessment"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes project name", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("test-project"));
  });

  // ── Context values ─────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generateAISupplyChainRisk(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  // ── Executive Summary ──────────────────────────────────────────────

  it("includes Executive Summary section", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("## 1. Executive Summary"));
  });

  it("shows correct AI service count", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("anthropic", "ai"),
      ],
    });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("**2 AI service(s)**"));
  });

  it("shows single-provider warning for one provider", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("Single-Provider Dependency | Yes (CRITICAL)"));
    assert.ok(result.includes("WARNING"));
  });

  it("does not show single-provider warning for multiple providers", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("anthropic", "ai"),
      ],
    });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("Single-Provider Dependency | No"));
    assert.ok(!result.includes("WARNING"));
  });

  it("shows estimated monthly spend", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("Estimated Monthly AI Spend"));
  });

  // ── Provider matching ──────────────────────────────────────────────

  it("matches OpenAI provider", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("### OpenAI"));
    assert.ok(result.includes("Major"));
    assert.ok(result.includes("San Francisco, CA"));
  });

  it("matches Anthropic provider", () => {
    const scan = makeScan({ services: [makeService("anthropic", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("### Anthropic"));
  });

  it("matches Google AI provider via gemini", () => {
    const scan = makeScan({ services: [makeService("gemini", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("### Google AI"));
  });

  it("matches AWS Bedrock provider", () => {
    const scan = makeScan({ services: [makeService("bedrock", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("### AWS Bedrock"));
  });

  it("matches Cohere provider", () => {
    const scan = makeScan({ services: [makeService("cohere", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("### Cohere"));
    assert.ok(result.includes("Mid-Tier"));
  });

  it("matches Mistral provider", () => {
    const scan = makeScan({ services: [makeService("mistral", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("### Mistral AI"));
  });

  it("matches Hugging Face provider", () => {
    const scan = makeScan({ services: [makeService("huggingface", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("### Hugging Face"));
  });

  it("matches Replicate provider", () => {
    const scan = makeScan({ services: [makeService("replicate", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("### Replicate"));
    assert.ok(result.includes("Niche"));
  });

  it("matches Stability AI provider", () => {
    const scan = makeScan({ services: [makeService("stability", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("### Stability AI"));
  });

  it("shows unrecognized provider for unknown AI service", () => {
    const scan = makeScan({ services: [makeService("custom-ai-service", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("Unrecognized Provider"));
    assert.ok(result.includes("Action Required"));
  });

  // ── Provider Risk Profiles ─────────────────────────────────────────

  it("includes lock-in risk assessment", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("Lock-In Risk"));
  });

  it("includes API stability risk", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("API Stability Risk"));
  });

  it("includes known risk factors", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("Known Risk Factors"));
  });

  it("includes alternatives list", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("Alternatives"));
    assert.ok(result.includes("Anthropic (Claude)"));
  });

  it("shows data sent for matched provider", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts", "API keys"])],
    });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("user prompts, API keys"));
  });

  // ── Overall Risk Computation ───────────────────────────────────────

  it("shows Critical overall risk for multiple high-risk providers", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("bedrock", "ai"),
      ],
    });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("**Critical**"));
  });

  it("shows High overall risk for single high-risk provider", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("Overall Supply Chain Risk:** High") || result.includes("**High**"));
  });

  // ── Risk Scenarios ─────────────────────────────────────────────────

  it("includes provider outage scenario", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("Scenario A: Provider Outage"));
  });

  it("includes pricing increase scenario", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("Scenario B: Pricing Increase"));
  });

  it("includes API deprecation scenario", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("Scenario C: API Deprecation"));
  });

  it("includes provider shutdown scenario", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("Scenario D: Provider Shutdown or Acquisition"));
  });

  it("shows complete loss for single-service outage scenario", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("Complete loss of AI functionality"));
  });

  it("shows partial degradation for multi-service outage scenario", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("anthropic", "ai"),
      ],
    });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("Partial degradation"));
  });

  // ── Migration Playbook ─────────────────────────────────────────────

  it("includes Migration Playbook section", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("## 4. Migration Playbook"));
  });

  it("includes migration steps for matched provider", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("Migrating Away from OpenAI"));
    assert.ok(result.includes("Evaluate alternatives"));
    assert.ok(result.includes("Parallel testing"));
    assert.ok(result.includes("Gradual rollout"));
  });

  it("shows estimated migration timeline", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("Estimated Timeline"));
  });

  // ── Recommendations ────────────────────────────────────────────────

  it("includes Recommendations section", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("## 5. Recommendations"));
  });

  it("includes provider-agnostic abstraction recommendation", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("provider-agnostic AI abstraction layer"));
  });

  it("includes CRITICAL diversification recommendation for single provider", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("**CRITICAL:** Diversify beyond OpenAI"));
  });

  it("does not include CRITICAL diversification for multiple providers", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("anthropic", "ai"),
      ],
    });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(!result.includes("**CRITICAL:** Diversify"));
  });

  it("includes cost budget recommendation", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("AI cost budgets"));
  });

  it("includes annual review recommendation", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("annual AI supply chain risk review"));
  });

  // ── Monitoring Checklist ───────────────────────────────────────────

  it("includes Ongoing Monitoring Checklist section", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("## 6. Ongoing Monitoring Checklist"));
  });

  it("includes weekly provider status check", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("Review provider status page and uptime"));
    assert.ok(result.includes("Weekly"));
  });

  it("includes quarterly failover test", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("Test failover to alternative provider"));
    assert.ok(result.includes("Quarterly"));
  });

  it("includes annual full reassessment", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("Full supply chain risk reassessment"));
    assert.ok(result.includes("Annually"));
  });

  // ── Estimated Monthly Spend ────────────────────────────────────────

  it("shows lower spend estimate for single service", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("$100–$5,000"));
  });

  it("shows medium spend estimate for two services", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("anthropic", "ai"),
      ],
    });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("$1,000–$10,000"));
  });

  it("shows higher spend estimate for three or more services", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("anthropic", "ai"),
        makeService("cohere", "ai"),
      ],
    });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("$5,000–$50,000+"));
  });

  // ── Footer ─────────────────────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("Codepliant"));
  });

  it("includes disclaimer about legal review", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAISupplyChainRisk(scan)!;
    assert.ok(result.includes("reviewed by qualified risk management and legal counsel"));
  });

  // ── Comprehensive test ─────────────────────────────────────────────

  it("generates comprehensive assessment with multiple providers", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts", "completions"]),
        makeService("anthropic", "ai", ["user messages"]),
        makeService("huggingface", "ai", ["model inputs"]),
        makeService("custom-llm", "ai", ["queries"]),
      ],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "security@acme.com",
    };
    const result = generateAISupplyChainRisk(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("**4 AI service(s)**"));
    assert.ok(result.includes("### OpenAI"));
    assert.ok(result.includes("### Anthropic"));
    assert.ok(result.includes("### Hugging Face"));
    assert.ok(result.includes("Unrecognized Provider"));
    assert.ok(result.includes("Migration Playbook"));
    assert.ok(result.includes("Recommendations"));
    assert.ok(result.includes("Ongoing Monitoring Checklist"));
  });
});
