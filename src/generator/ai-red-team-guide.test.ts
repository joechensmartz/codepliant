import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateAIRedTeamGuide } from "./ai-red-team-guide.js";
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

describe("generateAIRedTeamGuide", () => {
  // ── Null guards ─────────────────────────────────────────────────────

  it("returns null when no services are present", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateAIRedTeamGuide(scan), null);
  });

  it("returns null when only non-AI services are present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    assert.strictEqual(generateAIRedTeamGuide(scan), null);
  });

  it("returns null with mixed non-AI services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("sentry", "monitoring"),
        makeService("posthog", "analytics"),
      ],
    });
    assert.strictEqual(generateAIRedTeamGuide(scan), null);
  });

  // ── Basic generation ────────────────────────────────────────────────

  it("returns a non-null string when AI services are present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan);
    assert.ok(result !== null);
    assert.ok(result!.length > 0);
  });

  it("includes title", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("# AI Red Team Guide"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes project name", () => {
    const scan = makeScan({
      projectName: "my-ai-app",
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("my-ai-app"));
  });

  // ── Context values ──────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "info@acme.com" };
    const result = generateAIRedTeamGuide(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "security@acme.com" };
    const result = generateAIRedTeamGuide(scan, ctx)!;
    assert.ok(result.includes("security@acme.com"));
  });

  it("uses placeholder email when no context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("includes DPO email when provided", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", dpoEmail: "dpo@acme.com" };
    const result = generateAIRedTeamGuide(scan, ctx)!;
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("includes security email when provided", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", securityEmail: "sec@acme.com" };
    const result = generateAIRedTeamGuide(scan, ctx)!;
    assert.ok(result.includes("sec@acme.com"));
  });

  // ── Detected AI Attack Surface ────────────────────────────────────

  it("includes attack surface section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("## Detected AI Attack Surface"));
  });

  it("lists AI services in attack surface table", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts", "chat history"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("`openai`"));
    assert.ok(result.includes("user prompts, chat history"));
  });

  it("shows service count in scope note", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("@anthropic-ai/sdk", "ai", ["messages"]),
      ],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("2 detected AI service(s)"));
  });

  it("assigns risk level based on data collected count", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["a", "b", "c", "d"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("High"));
  });

  // ── OWASP LLM Top 10 ─────────────────────────────────────────────

  it("includes OWASP LLM Top 10 section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("## OWASP LLM Top 10"));
  });

  it("includes LLM01 Prompt Injection", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("### LLM01: Prompt Injection"));
    assert.ok(result.includes("OWASP LLM01:2025"));
  });

  it("includes LLM02 Sensitive Information Disclosure", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("### LLM02: Sensitive Information Disclosure"));
  });

  it("includes LLM06 Excessive Agency", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("### LLM06: Excessive Agency"));
    assert.ok(result.includes("least-privilege"));
  });

  it("includes LLM07 System Prompt Leakage", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("### LLM07: System Prompt Leakage"));
  });

  it("includes LLM09 Misinformation", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("### LLM09: Misinformation"));
    assert.ok(result.includes("hallucination"));
  });

  it("includes LLM10 Unbounded Consumption", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("### LLM10: Unbounded Consumption"));
  });

  it("includes test cases for each OWASP scenario", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("#### Test Cases"));
    assert.ok(result.includes("#### Mitigations"));
    assert.ok(result.includes("#### Test Results"));
  });

  it("includes test results table with Not Tested status", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("Not Tested"));
  });

  // ── Provider-Specific Scenarios ───────────────────────────────────

  it("includes OpenAI-specific tests when openai is detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("## Provider-Specific Red Team Scenarios"));
    assert.ok(result.includes("OpenAI-Specific Tests"));
  });

  it("includes Anthropic-specific tests when Anthropic is detected", () => {
    const scan = makeScan({
      services: [makeService("@anthropic-ai/sdk", "ai", ["messages"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("Anthropic-Specific Tests"));
    assert.ok(result.includes("Constitutional AI"));
  });

  it("includes LangChain-specific tests when langchain is detected", () => {
    const scan = makeScan({
      services: [makeService("langchain", "ai", ["documents"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("LangChain-Specific Tests"));
    assert.ok(result.includes("agent tools"));
  });

  it("does not include provider section for unknown providers", () => {
    const scan = makeScan({
      services: [makeService("custom-ai-lib", "ai", ["data"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(!result.includes("## Provider-Specific Red Team Scenarios"));
  });

  it("includes multiple provider sections when multiple known providers detected", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("@anthropic-ai/sdk", "ai", ["messages"]),
      ],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("OpenAI-Specific Tests"));
    assert.ok(result.includes("Anthropic-Specific Tests"));
  });

  // ── Bias Probing ──────────────────────────────────────────────────

  it("includes bias probing section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("## Bias Probing Test Plan"));
  });

  it("includes demographic bias tests", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("### Demographic Bias Tests"));
    assert.ok(result.includes("Gender"));
    assert.ok(result.includes("Ethnicity"));
    assert.ok(result.includes("Disability"));
  });

  it("includes fairness metrics", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("### Fairness Metrics"));
    assert.ok(result.includes("Disparate Impact Ratio"));
    assert.ok(result.includes("Counterfactual Fairness"));
  });

  // ── Data Extraction ───────────────────────────────────────────────

  it("includes data extraction attack section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("## Data Extraction Attack Testing"));
  });

  it("includes training data extraction tests", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("### Training Data Extraction"));
    assert.ok(result.includes("Membership inference"));
  });

  it("includes cross-session leakage tests", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("### Cross-Session Leakage"));
    assert.ok(result.includes("Session isolation"));
  });

  // ── Red Team Exercise Template ────────────────────────────────────

  it("includes red team exercise template", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("## Red Team Exercise Template"));
  });

  it("includes pre-exercise checklist", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("### Pre-Exercise Checklist"));
    assert.ok(result.includes("written authorisation"));
  });

  it("includes four exercise phases", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("#### Phase 1: Reconnaissance"));
    assert.ok(result.includes("#### Phase 2: Vulnerability Testing"));
    assert.ok(result.includes("#### Phase 3: Exploitation"));
    assert.ok(result.includes("#### Phase 4: Reporting"));
  });

  it("includes severity classification table", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("### Severity Classification"));
    assert.ok(result.includes("24 hours"));
  });

  // ── Regulatory Compliance Mapping ─────────────────────────────────

  it("includes regulatory compliance mapping", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("## Regulatory Compliance Mapping"));
  });

  it("references EU AI Act Article 9", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("EU AI Act Art. 9"));
  });

  it("references GDPR", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("GDPR Art. 25"));
    assert.ok(result.includes("GDPR Art. 35"));
  });

  it("references NIST AI RMF", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("NIST AI RMF"));
  });

  // ── Tools & Resources ─────────────────────────────────────────────

  it("includes recommended tools section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("## Recommended Tools & Resources"));
  });

  it("lists Garak and PyRIT tools", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("Garak"));
    assert.ok(result.includes("PyRIT"));
    assert.ok(result.includes("Promptfoo"));
  });

  it("includes OWASP reference link", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("owasp.org"));
  });

  // ── Disclaimer ────────────────────────────────────────────────────

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("reviewed and customised"));
  });

  it("lists AI service names in header", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("langchain", "ai", ["documents"]),
      ],
    });
    const result = generateAIRedTeamGuide(scan)!;
    assert.ok(result.includes("openai, langchain"));
  });
});
