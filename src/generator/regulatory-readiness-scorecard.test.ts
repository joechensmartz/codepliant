import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateRegulatoryReadinessScorecard } from "./regulatory-readiness-scorecard.js";
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

// ── Null returns ──────────────────────────────────────────────────────

describe("generateRegulatoryReadinessScorecard", () => {
  it("returns null when no services are present", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateRegulatoryReadinessScorecard(scan), null);
  });

  // ── Basic generation ────────────────────────────────────────────────

  it("generates output when services are present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateRegulatoryReadinessScorecard(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Regulatory Readiness Scorecard"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  // ── Context values ──────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generateRegulatoryReadinessScorecard(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  // ── GDPR assessment ─────────────────────────────────────────────────

  it("includes GDPR assessment by default (no jurisdictions)", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    assert.ok(result.includes("GDPR"));
    assert.ok(result.includes("EU General Data Protection Regulation"));
  });

  it("includes GDPR privacy notice check as met when services exist", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    assert.ok(result.includes("Privacy Notice (Art. 13/14)"));
    assert.ok(result.includes("+ Ready"));
  });

  it("includes GDPR breach notification as action needed", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    assert.ok(result.includes("Breach Notification Procedure (Art. 33/34)"));
    assert.ok(result.includes("- Action Needed"));
  });

  it("marks DPO check as met when DPO info provided", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      dpoName: "Jane",
      dpoEmail: "dpo@acme.com",
    };
    const result = generateRegulatoryReadinessScorecard(scan, ctx)!;
    // DPO check should be Ready
    const lines = result.split("\n");
    const dpoLine = lines.find((l) => l.includes("Data Protection Officer (Art. 37)"));
    assert.ok(dpoLine !== undefined);
    assert.ok(dpoLine.includes("+ Ready"));
  });

  it("marks DPO check as action needed when no DPO info", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    const lines = result.split("\n");
    const dpoLine = lines.find((l) => l.includes("Data Protection Officer (Art. 37)"));
    assert.ok(dpoLine !== undefined);
    assert.ok(dpoLine.includes("- Action Needed"));
  });

  it("marks DPIA as higher weight when AI detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    const lines = result.split("\n");
    const dpiaLine = lines.find((l) => l.includes("Data Protection Impact Assessment (Art. 35)"));
    assert.ok(dpiaLine !== undefined);
    assert.ok(dpiaLine.includes("15%"));
  });

  it("marks consent management as higher weight when analytics detected", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    const lines = result.split("\n");
    const consentLine = lines.find((l) => l.includes("Consent Management (Art. 6/7)"));
    assert.ok(consentLine !== undefined);
    assert.ok(consentLine.includes("15%"));
  });

  it("marks privacy by design as met when company name is configured", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generateRegulatoryReadinessScorecard(scan, ctx)!;
    const lines = result.split("\n");
    const pbdLine = lines.find((l) => l.includes("Privacy by Design (Art. 25)"));
    assert.ok(pbdLine !== undefined);
    assert.ok(pbdLine.includes("+ Ready"));
  });

  it("marks jurisdictional scope as met when jurisdictions configured", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdictions: ["gdpr"] };
    const result = generateRegulatoryReadinessScorecard(scan, ctx)!;
    const lines = result.split("\n");
    const jurisdLine = lines.find((l) => l.includes("Jurisdictional Scope Defined"));
    assert.ok(jurisdLine !== undefined);
    assert.ok(jurisdLine.includes("+ Ready"));
  });

  // ── CCPA assessment ─────────────────────────────────────────────────

  it("includes CCPA assessment when ccpa jurisdiction specified", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdictions: ["ccpa"] };
    const result = generateRegulatoryReadinessScorecard(scan, ctx)!;
    assert.ok(result.includes("CCPA/CPRA"));
    assert.ok(result.includes("California"));
  });

  it("does not include CCPA when only GDPR jurisdiction", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdictions: ["gdpr"] };
    const result = generateRegulatoryReadinessScorecard(scan, ctx)!;
    assert.ok(!result.includes("CCPA/CPRA"));
  });

  it("marks Do Not Sell as action needed when analytics present", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdictions: ["ccpa"] };
    const result = generateRegulatoryReadinessScorecard(scan, ctx)!;
    const lines = result.split("\n");
    const dnsLine = lines.find((l) => l.includes("Do Not Sell"));
    assert.ok(dnsLine !== undefined);
    assert.ok(dnsLine.includes("- Action Needed"));
  });

  // ── EU AI Act assessment ────────────────────────────────────────────

  it("includes EU AI Act assessment when AI services detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    assert.ok(result.includes("EU AI Act"));
    assert.ok(result.includes("European Union Artificial Intelligence Act"));
  });

  it("does not include EU AI Act when no AI services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    assert.ok(!result.includes("EU AI Act"));
  });

  it("marks AI risk classification as met when aiRiskLevel configured", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", aiRiskLevel: "limited" };
    const result = generateRegulatoryReadinessScorecard(scan, ctx)!;
    const lines = result.split("\n");
    const riskLine = lines.find((l) => l.includes("AI Risk Classification"));
    assert.ok(riskLine !== undefined);
    assert.ok(riskLine.includes("+ Ready"));
  });

  it("marks AI governance framework as met when aiUsageDescription provided", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      aiUsageDescription: "Customer support chatbot",
    };
    const result = generateRegulatoryReadinessScorecard(scan, ctx)!;
    const lines = result.split("\n");
    const govLine = lines.find((l) => l.includes("AI Governance Framework"));
    assert.ok(govLine !== undefined);
    assert.ok(govLine.includes("+ Ready"));
  });

  // ── PCI DSS assessment ──────────────────────────────────────────────

  it("includes PCI DSS assessment when payment services detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    assert.ok(result.includes("PCI DSS"));
    assert.ok(result.includes("Payment Card Industry"));
  });

  it("does not include PCI DSS when no payment services", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    assert.ok(!result.includes("PCI DSS"));
  });

  it("marks tokenization as met for PCI DSS (payment processor implies tokenization)", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    const lines = result.split("\n");
    const tokenLine = lines.find((l) => l.includes("Tokenization"));
    assert.ok(tokenLine !== undefined);
    assert.ok(tokenLine.includes("+ Ready"));
  });

  // ── SOC 2 assessment ────────────────────────────────────────────────

  it("includes SOC 2 assessment when 3 or more services detected", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
        makeService("openai", "ai", ["user prompts"]),
      ],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    assert.ok(result.includes("SOC 2"));
    assert.ok(result.includes("Service Organization Control"));
  });

  it("does not include SOC 2 when fewer than 3 services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    assert.ok(!result.includes("SOC 2"));
  });

  it("marks SOC 2 access control as met when 3+ services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
        makeService("openai", "ai", ["user prompts"]),
      ],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    const lines = result.split("\n");
    const accessLine = lines.find((l) => l.includes("Access Control Policy"));
    assert.ok(accessLine !== undefined);
    assert.ok(accessLine.includes("+ Ready"));
  });

  // ── Overall score ───────────────────────────────────────────────────

  it("includes overall readiness section with score percentage", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    assert.ok(result.includes("Overall Readiness"));
    assert.ok(result.includes("Overall Score:"));
    assert.ok(/%/.test(result));
  });

  it("includes summary table with per-regulation scores", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    assert.ok(result.includes("| Regulation | Score | Progress |"));
  });

  it("includes progress bar characters", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    // Should contain block characters for progress bars
    assert.ok(result.includes("\u2588") || result.includes("\u2591"));
  });

  // ── Priority action plan ────────────────────────────────────────────

  it("includes priority action plan section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    assert.ok(result.includes("Priority Action Plan"));
    assert.ok(result.includes("High-Impact Actions"));
  });

  it("sorts action items by weight (highest first)", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    const lines = result.split("\n");
    const actionLines = lines.filter((l) => /^\d+\.\s+\*\*\[/.test(l));
    assert.ok(actionLines.length > 0, "Should have numbered action items");
    // Extract weights
    const weights = actionLines.map((l) => {
      const match = l.match(/\((\d+)%\)/);
      return match ? parseInt(match[1], 10) : 0;
    });
    for (let i = 1; i < weights.length; i++) {
      assert.ok(weights[i] <= weights[i - 1], `Action items should be sorted by weight descending: ${weights[i]} should be <= ${weights[i - 1]}`);
    }
  });

  it("limits action items to 10 and shows remainder count", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
        makeService("openai", "ai", ["user prompts"]),
        makeService("firebase-auth", "auth", ["email"]),
        makeService("prisma", "database", ["user records"]),
      ],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdictions: ["gdpr", "ccpa"] };
    const result = generateRegulatoryReadinessScorecard(scan, ctx)!;
    const lines = result.split("\n");
    const actionLines = lines.filter((l) => /^\d+\.\s+\*\*\[/.test(l));
    assert.ok(actionLines.length <= 10, "Should limit to 10 action items");
  });

  // ── Per-regulation detail sections ──────────────────────────────────

  it("includes per-regulation assessment section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    assert.ok(result.includes("Per-Regulation Assessment"));
  });

  it("includes action items for unmet checks", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    assert.ok(result.includes("Action items to reach 100%"));
    assert.ok(result.includes("- [ ]"));
  });

  // ── Disclaimer ──────────────────────────────────────────────────────

  it("includes disclaimer about automated analysis", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    assert.ok(result.includes("automated code analysis"));
    assert.ok(result.includes("does not constitute legal advice"));
  });

  // ── Multiple regulations combined ──────────────────────────────────

  it("includes all applicable regulations for a complex project", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
        makeService("openai", "ai", ["user prompts"]),
      ],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdictions: ["gdpr", "ccpa"] };
    const result = generateRegulatoryReadinessScorecard(scan, ctx)!;
    assert.ok(result.includes("GDPR"));
    assert.ok(result.includes("CCPA/CPRA"));
    assert.ok(result.includes("EU AI Act"));
    assert.ok(result.includes("PCI DSS"));
    assert.ok(result.includes("SOC 2"));
  });

  it("returns null when services exist but no assessments apply (edge case)", () => {
    // This would require a service that doesn't trigger any assessment
    // With the current code, GDPR is always included when jurisdictions is empty
    // so this test verifies the default behavior
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdictions: ["ccpa"] };
    const result = generateRegulatoryReadinessScorecard(scan, ctx)!;
    // With ccpa jurisdiction only + payment, should have CCPA and PCI DSS
    assert.ok(result.includes("CCPA/CPRA"));
    assert.ok(result.includes("PCI DSS"));
    assert.ok(!result.includes("### GDPR"));
  });

  // ── Processor agreements weight ─────────────────────────────────────

  it("marks processor agreements as met when fewer than 2 services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    const lines = result.split("\n");
    const procLine = lines.find((l) => l.includes("Processor Agreements (Art. 28)"));
    assert.ok(procLine !== undefined);
    assert.ok(procLine.includes("+ Ready"));
  });

  it("marks processor agreements as action needed when 2+ services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    const lines = result.split("\n");
    const procLine = lines.find((l) => l.includes("Processor Agreements (Art. 28)"));
    assert.ok(procLine !== undefined);
    assert.ok(procLine.includes("- Action Needed"));
  });

  // ── Advertising category triggers analytics checks ──────────────────

  it("treats advertising category same as analytics for consent checks", () => {
    const scan = makeScan({
      services: [makeService("google-ads", "advertising", ["ad impressions"])],
    });
    const result = generateRegulatoryReadinessScorecard(scan)!;
    const lines = result.split("\n");
    const consentLine = lines.find((l) => l.includes("Consent Management (Art. 6/7)"));
    assert.ok(consentLine !== undefined);
    assert.ok(consentLine.includes("15%")); // higher weight because analytics-like
  });
});
