import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateAIEthicsStatement } from "./ai-ethics-statement.js";
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

describe("generateAIEthicsStatement", () => {
  // ── Null guards ─────────────────────────────────────────────────────

  it("returns null when no services are present", () => {
    const scan = makeScan({ services: [] });
    const result = generateAIEthicsStatement(scan);
    assert.strictEqual(result, null);
  });

  it("returns null when only non-AI services are present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateAIEthicsStatement(scan);
    assert.strictEqual(result, null);
  });

  it("returns null with mixed non-AI services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("sentry", "monitoring"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateAIEthicsStatement(scan);
    assert.strictEqual(result, null);
  });

  // ── Basic generation ────────────────────────────────────────────────

  it("returns a non-null string when AI services are present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan);
    assert.ok(result !== null);
    assert.ok(result.length > 0);
  });

  it("includes title", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("# AI Ethics Statement"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes project name", () => {
    const scan = makeScan({
      projectName: "my-ai-app",
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("my-ai-app"));
  });

  // ── Context values ──────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "info@acme.com" };
    const result = generateAIEthicsStatement(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "ethics@acme.com" };
    const result = generateAIEthicsStatement(scan, ctx)!;
    assert.ok(result.includes("ethics@acme.com"));
  });

  it("uses placeholder email when no context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses context DPO name", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "info@acme.com", dpoName: "Jane Doe" };
    const result = generateAIEthicsStatement(scan, ctx)!;
    assert.ok(result.includes("Jane Doe"));
  });

  it("uses placeholder DPO name when no context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("[Data Protection Officer Name]"));
  });

  it("uses context DPO email", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "info@acme.com", dpoEmail: "dpo@acme.com" };
    const result = generateAIEthicsStatement(scan, ctx)!;
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("uses placeholder DPO email when no context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("[dpo@example.com]"));
  });

  // ── Section 1: AI Systems in Use ────────────────────────────────────

  it("includes AI Systems in Use section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("## 1. AI Systems in Use"));
  });

  it("lists AI service names", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts", "chat history"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("**openai**"));
    assert.ok(result.includes("user prompts, chat history"));
  });

  it("lists multiple AI services", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("@anthropic-ai/sdk", "ai", ["messages"]),
      ],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("**openai**"));
    assert.ok(result.includes("**@anthropic-ai/sdk**"));
  });

  it("excludes non-AI services from AI listing", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
      ],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("**openai**"));
    assert.ok(!result.includes("**stripe**"));
  });

  // ── Section 2: Core Ethical Principles ──────────────────────────────

  it("includes core ethical principles section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("## 2. Core Ethical Principles"));
  });

  it("includes proportionality principle", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("### 2.1 Proportionality and Do No Harm"));
  });

  it("includes fairness principle", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("### 2.2 Fairness and Non-Discrimination"));
    assert.ok(result.includes("protected characteristics"));
  });

  it("includes transparency principle with EU AI Act reference", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("### 2.3 Transparency and Explainability"));
    assert.ok(result.includes("EU AI Act Article 50"));
  });

  it("includes accountability principle", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("### 2.4 Accountability and Responsibility"));
    assert.ok(result.includes("audit trails"));
  });

  it("includes privacy principle with GDPR and CCPA references", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("### 2.5 Privacy and Data Protection"));
    assert.ok(result.includes("GDPR"));
    assert.ok(result.includes("CCPA"));
  });

  it("includes human oversight principle", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("### 2.6 Human Oversight and Control"));
    assert.ok(result.includes("override"));
  });

  it("includes safety principle", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("### 2.7 Safety and Security"));
    assert.ok(result.includes("prompt injection"));
    assert.ok(result.includes("kill switches"));
  });

  it("includes sustainability principle", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("### 2.8 Sustainability"));
    assert.ok(result.includes("environmental impact"));
  });

  // ── Section 3: Human Oversight Commitments ──────────────────────────

  it("includes human oversight commitments table", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("## 3. Human Oversight Commitments"));
    assert.ok(result.includes("Bias audit"));
    assert.ok(result.includes("Output review"));
    assert.ok(result.includes("Model evaluation"));
    assert.ok(result.includes("Ethics review"));
    assert.ok(result.includes("Quarterly"));
  });

  // ── Section 4: UNESCO Alignment ─────────────────────────────────────

  it("includes UNESCO alignment section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("## 4. UNESCO Recommendation Alignment"));
    assert.ok(result.includes("UNESCO Recommendation on the Ethics of Artificial Intelligence"));
    assert.ok(result.includes("2021"));
  });

  it("includes UNESCO principle mapping table", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("Proportionality and Do No Harm"));
    assert.ok(result.includes("Safety and Security"));
    assert.ok(result.includes("Multi-stakeholder Governance"));
  });

  // ── Section 5: Governance Structure ─────────────────────────────────

  it("includes governance structure section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("## 5. AI Ethics Governance Structure"));
  });

  it("includes AI Governance Officer role", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("### 5.1 AI Governance Officer"));
  });

  it("includes ethics review process", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("### 5.2 Ethics Review Process"));
    assert.ok(result.includes("Impact Assessment"));
    assert.ok(result.includes("Proportionality Check"));
    assert.ok(result.includes("Bias Testing"));
    assert.ok(result.includes("Transparency Review"));
    assert.ok(result.includes("Oversight Verification"));
    assert.ok(result.includes("Approval"));
  });

  // ── Section 6: Reporting & Redress ──────────────────────────────────

  it("includes reporting and redress section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("## 6. Reporting Concerns and Redress"));
    assert.ok(result.includes("5 business days"));
    assert.ok(result.includes("30 days"));
  });

  it("includes regulatory complaint option", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("Regulatory complaint"));
    assert.ok(result.includes("AI supervisory authority"));
  });

  // ── Section 7: Contact ──────────────────────────────────────────────

  it("includes contact section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("## 7. Contact"));
    assert.ok(result.includes("AI Governance Officer"));
    assert.ok(result.includes("Data Protection Officer"));
    assert.ok(result.includes("General inquiries"));
  });

  // ── Disclaimer / Footer ─────────────────────────────────────────────

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("reviewed and customized"));
  });

  it("includes project name in disclaimer", () => {
    const scan = makeScan({
      projectName: "my-ai-project",
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("my-ai-project"));
  });

  // ── Regulatory framework references ─────────────────────────────────

  it("references OECD AI Principles", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("OECD AI Principles"));
  });

  it("references EU AI Act", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIEthicsStatement(scan)!;
    assert.ok(result.includes("EU AI Act"));
  });
});
