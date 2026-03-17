import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { generateComplianceScorecardVisual } from "./compliance-scorecard-visual.js";
import type { ScanResult } from "../scanner/types.js";
import type { GeneratorContext } from "./index.js";

function makeService(
  name: string,
  category: "ai" | "payment" | "analytics" | "auth" | "email" | "monitoring" | "database" | "other",
  dataCollected: string[] = ["test data"],
) {
  return {
    name,
    category,
    evidence: [{ type: "dependency" as const, file: "package.json", detail: `${name} detected` }],
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

describe("generateComplianceScorecardVisual", () => {
  it("returns null when no services detected", () => {
    const result = generateComplianceScorecardVisual(makeScan());
    assert.strictEqual(result, null);
  });

  it("generates markdown with title and project name", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceScorecardVisual(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Compliance Scorecard"));
    assert.ok(result.includes("test-project"));
  });

  it("uses company name from context", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "hi@acme.com" };
    const result = generateComplianceScorecardVisual(scan, ctx);
    assert.ok(result !== null);
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder when no company name provided", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceScorecardVisual(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("includes overall grade box", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceScorecardVisual(scan)!;
    assert.ok(result.includes("## Overall Compliance Grade"));
    assert.ok(result.includes("OVERALL GRADE"));
  });

  it("includes area scores with ASCII bars", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceScorecardVisual(scan)!;
    assert.ok(result.includes("## Area Scores"));
    // Should contain bar characters
    assert.ok(result.includes("\u2588") || result.includes("█"));
  });

  it("includes Privacy area assessment", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceScorecardVisual(scan)!;
    assert.ok(result.includes("Privacy"));
  });

  it("includes Security area assessment", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceScorecardVisual(scan)!;
    assert.ok(result.includes("Security"));
  });

  it("includes Vendor Management assessment", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceScorecardVisual(scan)!;
    assert.ok(result.includes("Vendor Management"));
  });

  it("includes Documentation assessment", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceScorecardVisual(scan)!;
    assert.ok(result.includes("Documentation"));
  });

  it("includes AI Governance area when AI services present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateComplianceScorecardVisual(scan)!;
    assert.ok(result.includes("AI Governance"));
  });

  it("excludes AI Governance when no AI services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceScorecardVisual(scan)!;
    // AI Governance should not appear as an area header in the detailed assessment
    assert.ok(!result.includes("### AI Governance"));
  });

  it("includes Score Summary table", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceScorecardVisual(scan)!;
    assert.ok(result.includes("## Score Summary"));
    assert.ok(result.includes("| Area | Grade | Score | Trend |"));
    assert.ok(result.includes("**Overall**"));
  });

  it("includes trend indicators legend", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceScorecardVisual(scan)!;
    assert.ok(result.includes("### Trend Indicators"));
    assert.ok(result.includes("Improving"));
    assert.ok(result.includes("Stable"));
    assert.ok(result.includes("Needs Attention"));
  });

  it("includes grade scale reference", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceScorecardVisual(scan)!;
    assert.ok(result.includes("### Grade Scale"));
    assert.ok(result.includes("90-100%"));
    assert.ok(result.includes("Excellent"));
  });

  it("includes detailed assessment with per-area factors", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceScorecardVisual(scan)!;
    assert.ok(result.includes("## Detailed Assessment"));
    assert.ok(result.includes("| Factor | Detail |"));
  });

  it("includes priority actions section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    // Without context, there will be many "not set" factors
    const result = generateComplianceScorecardVisual(scan)!;
    assert.ok(result.includes("## Priority Actions to Improve Score"));
  });

  it("improves privacy score with context settings", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const ctxFull: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      dpoEmail: "dpo@acme.com",
      jurisdictions: ["gdpr"],
      dataRetentionDays: 365,
      tollFreeNumber: "1-800-PRIVACY",
    };
    const result = generateComplianceScorecardVisual(scan, ctxFull)!;
    assert.ok(result.includes("Company name configured"));
    assert.ok(result.includes("Contact email configured"));
    assert.ok(result.includes("DPO email configured"));
  });

  it("improves security score with security config", () => {
    const scan = makeScan({
      services: [makeService("auth0", "auth")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "hi@acme.com",
      securityEmail: "security@acme.com",
      bugBountyUrl: "https://acme.com/bounty",
    };
    const result = generateComplianceScorecardVisual(scan, ctx)!;
    assert.ok(result.includes("Security contact configured"));
    assert.ok(result.includes("Bug bounty URL configured"));
    assert.ok(result.includes("Authentication service detected"));
  });

  it("improves AI governance score with AI config", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "hi@acme.com",
      aiRiskLevel: "limited",
      aiUsageDescription: "We use AI for content generation",
    };
    const result = generateComplianceScorecardVisual(scan, ctx)!;
    assert.ok(result.includes("AI risk level classified"));
    assert.ok(result.includes("AI usage description provided"));
  });

  it("shows services scanned count", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment"), makeService("openai", "ai")],
    });
    const result = generateComplianceScorecardVisual(scan)!;
    assert.ok(result.includes("**Services Scanned:** 2"));
  });

  it("includes historical tracking template", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceScorecardVisual(scan)!;
    assert.ok(result.includes("## Historical Tracking"));
  });

  it("includes AI column in historical tracking when AI services present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateComplianceScorecardVisual(scan)!;
    assert.ok(result.includes("AI |"));
  });

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceScorecardVisual(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("not full legal compliance"));
  });

  it("penalises large service footprint (>10 services)", () => {
    const services = Array.from({ length: 11 }, (_, i) =>
      makeService(`svc-${i}`, "other"),
    );
    const scan = makeScan({ services });
    const result = generateComplianceScorecardVisual(scan)!;
    assert.ok(result.includes("Large service footprint"));
  });

  it("rewards small service footprint", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceScorecardVisual(scan)!;
    assert.ok(result.includes("Small service footprint"));
  });

  it("shows documentation score with language config", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "hi@acme.com",
      language: "en",
    };
    const result = generateComplianceScorecardVisual(scan, ctx)!;
    assert.ok(result.includes("Language configured: en"));
  });
});
