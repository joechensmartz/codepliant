import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateAcceptableAIUsePolicy } from "./acceptable-ai-use.js";
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

describe("generateAcceptableAIUsePolicy", () => {
  // ── Null guards ─────────────────────────────────────────────────────

  it("returns null when no services are present", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateAcceptableAIUsePolicy(scan), null);
  });

  it("returns null when only non-AI services are present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    assert.strictEqual(generateAcceptableAIUsePolicy(scan), null);
  });

  it("returns null with mixed non-AI services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("sentry", "monitoring"),
        makeService("posthog", "analytics"),
      ],
    });
    assert.strictEqual(generateAcceptableAIUsePolicy(scan), null);
  });

  // ── Basic generation ────────────────────────────────────────────────

  it("returns a non-null string when AI services are present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan);
    assert.ok(result !== null);
    assert.ok(result!.length > 0);
  });

  it("includes title", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("# Acceptable AI Use Policy"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes project name", () => {
    const scan = makeScan({
      projectName: "my-ai-app",
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("my-ai-app"));
  });

  // ── Context values ──────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "info@acme.com" };
    const result = generateAcceptableAIUsePolicy(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "policy@acme.com" };
    const result = generateAcceptableAIUsePolicy(scan, ctx)!;
    assert.ok(result.includes("policy@acme.com"));
  });

  it("uses placeholder email when no context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  // ── Section 3: AI Services in Use ──────────────────────────────────

  it("includes AI Services in Use section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("## 3. AI Services in Use"));
  });

  it("lists AI service names in table", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts", "chat history"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("| openai |"));
    assert.ok(result.includes("user prompts, chat history"));
  });

  it("maps known provider names", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("OpenAI (GPT)"));
  });

  it("maps Anthropic provider name", () => {
    const scan = makeScan({
      services: [makeService("@anthropic-ai/sdk", "ai", ["messages"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("Anthropic (Claude)"));
  });

  it("lists multiple AI services", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("@anthropic-ai/sdk", "ai", ["messages"]),
      ],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("openai"));
    assert.ok(result.includes("@anthropic-ai/sdk"));
  });

  it("excludes non-AI services from AI listing", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
      ],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("openai"));
    assert.ok(!result.includes("| stripe |"));
  });

  // ── Section 4: Acceptable Uses ────────────────────────────────────

  it("includes acceptable uses section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("## 4. Acceptable Uses of AI"));
  });

  it("includes permitted uses", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("### 4.1 Permitted Uses"));
    assert.ok(result.includes("Content assistance"));
    assert.ok(result.includes("Code assistance"));
  });

  it("includes conditional uses requiring approval", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("### 4.2 Conditional Uses"));
    assert.ok(result.includes("Require Approval"));
  });

  // ── Section 5: Prohibited Uses ────────────────────────────────────

  it("includes prohibited uses section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("## 5. Prohibited Uses of AI"));
  });

  it("lists deceptive practices as prohibited", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("Deceptive practices"));
  });

  it("lists discriminatory decision-making as prohibited", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("Discriminatory decision-making"));
    assert.ok(result.includes("protected characteristics"));
  });

  it("lists social scoring as prohibited", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("Social scoring"));
  });

  // ── Section 6: Content Review Requirements ────────────────────────

  it("includes content review requirements section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("## 6. Content Review Requirements"));
  });

  it("includes review process table", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("### 6.1 Review Process"));
    assert.ok(result.includes("Customer-facing text"));
    assert.ok(result.includes("Code suggestions"));
  });

  it("includes review checklist", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("### 6.2 Review Checklist"));
    assert.ok(result.includes("Accuracy"));
    assert.ok(result.includes("Bias"));
    assert.ok(result.includes("Privacy"));
  });

  // ── Risk classification ───────────────────────────────────────────

  it("classifies minimal risk for basic AI services", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["code completions"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("minimal"));
  });

  it("classifies limited risk for user-facing AI", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts", "conversation"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("limited"));
  });

  it("classifies high risk for biometric data", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["biometric data"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("high"));
  });

  it("classifies high risk for healthcare data", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["healthcare records"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("high"));
  });

  it("uses context aiRiskLevel override", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["code completions"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", aiRiskLevel: "high" };
    const result = generateAcceptableAIUsePolicy(scan, ctx)!;
    assert.ok(result.includes("high"));
  });

  it("shows high risk content review requirement", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["biometric data"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("qualified human before publication"));
  });

  it("shows limited risk content review requirement", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("spot-checks"));
  });

  it("shows minimal risk content review requirement", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["code completions"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("clearly labeled"));
  });

  // ── Section 7: Bias and Fairness ──────────────────────────────────

  it("includes bias and fairness section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("## 7. Bias and Fairness Commitments"));
  });

  it("includes bias commitments list", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("bias awareness training"));
    assert.ok(result.includes("30 days"));
  });

  it("includes bias assessment table", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("### 7.2 Bias Assessment"));
    assert.ok(result.includes("Training data diversity reviewed"));
    assert.ok(result.includes("Output bias testing conducted"));
  });

  // ── Section 8: Data Handling ──────────────────────────────────────

  it("includes data handling section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("## 8. Data Handling for AI Services"));
  });

  it("includes data minimization principles", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("### 8.1 Data Minimization"));
    assert.ok(result.includes("minimum data necessary"));
  });

  it("includes user consent section referencing GDPR Article 7", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("### 8.3 User Consent"));
    assert.ok(result.includes("GDPR Article 7"));
  });

  // ── Section 9: AI Incident Response ───────────────────────────────

  it("includes AI incident response section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("## 9. AI Incident Response"));
  });

  it("includes incident types table", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("harmful or illegal content"));
    assert.ok(result.includes("AI hallucination"));
  });

  // ── Section 10: Governance ────────────────────────────────────────

  it("includes governance section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("## 10. Governance and Accountability"));
  });

  it("includes roles table", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("AI Governance Lead"));
    assert.ok(result.includes("Engineering Team"));
    assert.ok(result.includes("Legal/Compliance"));
  });

  it("includes policy violation consequences", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("### 10.2 Policy Violations"));
    assert.ok(result.includes("Revocation of AI service access"));
  });

  // ── Section 11: Policy Review ─────────────────────────────────────

  it("includes policy review section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("## 11. Policy Review"));
    assert.ok(result.includes("Quarterly"));
  });

  // ── Disclaimer ────────────────────────────────────────────────────

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("does not constitute legal advice"));
  });

  // ── EU AI Act reference ───────────────────────────────────────────

  it("references EU AI Act", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("EU AI Act"));
  });

  it("references NIST AI Risk Management Framework", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableAIUsePolicy(scan)!;
    assert.ok(result.includes("NIST AI Risk Management Framework"));
  });
});
