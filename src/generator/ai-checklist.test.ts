import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateAIChecklist } from "./ai-checklist.js";
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

describe("generateAIChecklist", () => {
  it("returns null when no services detected", () => {
    const result = generateAIChecklist(makeScan());
    assert.strictEqual(result, null);
  });

  it("returns null when no AI services detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateAIChecklist(scan);
    assert.strictEqual(result, null);
  });

  it("returns null when only non-AI services are present", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("google-analytics", "analytics"),
        makeService("aws", "other" as any),
      ],
    });
    const result = generateAIChecklist(scan);
    assert.strictEqual(result, null);
  });

  // ── Basic generation ───────────────────────────────────────────────

  it("generates document when AI services are present", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIChecklist(scan);
    assert.ok(typeof result === "string");
    assert.ok(result.includes("# EU AI Act Compliance Checklist"));
  });

  it("returns a non-empty string for a single AI service", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIChecklist(scan);
    assert.ok(result!.length > 100);
  });

  // ── Title & metadata ──────────────────────────────────────────────

  it("includes project name in output", () => {
    const scan = makeScan({
      projectName: "my-ai-app",
      services: [makeService("openai", "ai")],
    });
    const result = generateAIChecklist(scan);
    assert.ok(result!.includes("my-ai-app"));
  });

  it("includes date in ISO format", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIChecklist(scan);
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result!));
  });

  it("uses default company placeholder when no context provided", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIChecklist(scan);
    assert.ok(result!.includes("[Your Company Name]"));
  });

  it("uses company name from context", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIChecklist(scan, makeCtx({ companyName: "TechCo" }));
    assert.ok(result!.includes("TechCo"));
    assert.ok(!result!.includes("[Your Company Name]"));
  });

  // ── Risk classification display ───────────────────────────────────

  it("displays risk classification label", () => {
    const scan = makeScan({ services: [makeService("openai", "ai", ["user prompts"])] });
    const result = generateAIChecklist(scan);
    // Should contain a capitalized risk label (Minimal, Limited, or High)
    assert.ok(/Risk Classification:\*\* (Minimal|Limited|High)/.test(result!));
  });

  it("shows Limited risk for user-facing AI", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts", "generated content"])],
    });
    const result = generateAIChecklist(scan);
    assert.ok(result!.includes("Limited"));
  });

  it("shows High risk for biometric AI", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["biometric data"])],
    });
    const result = generateAIChecklist(scan);
    assert.ok(result!.includes("High"));
  });

  it("respects aiRiskLevel override from context", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIChecklist(scan, makeCtx({ aiRiskLevel: "high" }));
    assert.ok(result!.includes("High"));
  });

  // ── AI services listing ───────────────────────────────────────────

  it("lists detected AI services", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("@anthropic-ai/sdk", "ai"),
      ],
    });
    const result = generateAIChecklist(scan);
    assert.ok(result!.includes("openai"));
    assert.ok(result!.includes("@anthropic-ai/sdk"));
  });

  it("excludes non-AI services from listing", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateAIChecklist(scan);
    assert.ok(result!.includes("openai"));
    assert.ok(!result!.includes("**AI Services Detected:** stripe") && !result!.includes("stripe,"));
  });

  // ── Standard sections ─────────────────────────────────────────────

  it("includes Transparency section", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIChecklist(scan);
    assert.ok(result!.includes("## Transparency"));
    assert.ok(result!.includes("Art. 50"));
  });

  it("includes Documentation section", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIChecklist(scan);
    assert.ok(result!.includes("## Documentation"));
  });

  it("includes Human Oversight section", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIChecklist(scan);
    assert.ok(result!.includes("## Human Oversight"));
  });

  it("includes Incident Reporting section", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIChecklist(scan);
    assert.ok(result!.includes("## Incident Reporting"));
  });

  it("includes Content Marking section with Art. 50(2)", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIChecklist(scan);
    assert.ok(result!.includes("## Content Marking (Art. 50(2))"));
    assert.ok(result!.includes("C2PA"));
  });

  it("includes Data Protection section", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIChecklist(scan);
    assert.ok(result!.includes("## Data Protection"));
    assert.ok(result!.includes("DPIA"));
  });

  // ── High-risk extras ──────────────────────────────────────────────

  it("includes High-Risk System Requirements for high risk", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["biometric data"])],
    });
    const result = generateAIChecklist(scan);
    assert.ok(result!.includes("## High-Risk System Requirements (Title III)"));
    assert.ok(result!.includes("Conformity assessment"));
    assert.ok(result!.includes("Art. 9"));
  });

  it("omits High-Risk section when risk is not high", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIChecklist(scan);
    assert.ok(!result!.includes("## High-Risk System Requirements"));
  });

  it("includes High-Risk section when context forces high risk", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIChecklist(scan, makeCtx({ aiRiskLevel: "high" }));
    assert.ok(result!.includes("## High-Risk System Requirements (Title III)"));
  });

  // ── Checklist items ───────────────────────────────────────────────

  it("contains unchecked checklist items", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIChecklist(scan);
    const checkboxCount = (result!.match(/- \[ \]/g) || []).length;
    assert.ok(checkboxCount >= 20, `Expected >= 20 checklist items, got ${checkboxCount}`);
  });

  it("contains more checklist items for high-risk than limited", () => {
    const limited = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const high = makeScan({
      services: [makeService("openai", "ai", ["biometric data"])],
    });
    const limitedResult = generateAIChecklist(limited);
    const highResult = generateAIChecklist(high);
    const limitedCount = (limitedResult!.match(/- \[ \]/g) || []).length;
    const highCount = (highResult!.match(/- \[ \]/g) || []).length;
    assert.ok(highCount > limitedCount, `High (${highCount}) should have more items than Limited (${limitedCount})`);
  });

  // ── Footer ────────────────────────────────────────────────────────

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIChecklist(scan);
    assert.ok(result!.includes("Codepliant"));
    assert.ok(result!.includes("legal professional"));
  });

  it("references EU AI Act regulation number", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIChecklist(scan);
    assert.ok(result!.includes("2024/1689"));
  });

  it("mentions 2 August 2026 deadline", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIChecklist(scan);
    assert.ok(result!.includes("2 August 2026"));
  });

  // ── Multiple AI services ──────────────────────────────────────────

  it("handles multiple AI services", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("@anthropic-ai/sdk", "ai", ["conversation history"]),
        makeService("replicate", "ai", ["images"]),
      ],
    });
    const result = generateAIChecklist(scan);
    assert.ok(result!.includes("openai"));
    assert.ok(result!.includes("@anthropic-ai/sdk"));
    assert.ok(result!.includes("replicate"));
  });
});
