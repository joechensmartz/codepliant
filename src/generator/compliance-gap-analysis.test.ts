import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateComplianceGapAnalysis } from "./compliance-gap-analysis.js";
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
  return { companyName: "Test Co", contactEmail: "test@test.com", ...overrides };
}

describe("generateComplianceGapAnalysis", () => {
  // ── Null guard ──────────────────────────────────────────────────────

  it("returns null when no services are present", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceGapAnalysis(scan);
    assert.strictEqual(result, null);
  });

  // ── Basic generation ────────────────────────────────────────────────

  it("returns a non-null string when services exist", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceGapAnalysis(scan);
    assert.ok(result !== null);
    assert.ok(result!.length > 0);
  });

  it("includes the title with company name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ companyName: "Acme Corp" });
    const result = generateComplianceGapAnalysis(scan, ctx)!;
    assert.ok(result.includes("# Compliance Gap Analysis — Acme Corp"));
  });

  it("uses placeholder when no company name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("Codepliant"));
  });

  // ── Executive Summary ─────────────────────────────────────────────

  it("includes Executive Summary section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("## Executive Summary"));
  });

  it("shows total gaps count", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("Total Gaps Identified"));
  });

  it("shows services analyzed count", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment"), makeService("openai", "ai")],
    });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("| Services Analyzed | 2 |"));
  });

  it("shows regulations covered", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("Regulations Covered"));
  });

  // ── Gap Analysis Table ────────────────────────────────────────────

  it("includes gap analysis table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("## Gap Analysis Table"));
    assert.ok(result.includes("| Requirement | Current State | Target State | Gap | Priority | Effort |"));
  });

  // ── GDPR gaps (default when no jurisdictions) ─────────────────────

  it("includes GDPR Privacy Notice gap by default", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("Privacy Notice (Art. 13/14)"));
    assert.ok(result.includes("GDPR"));
  });

  it("includes Record of Processing Activities gap", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("Record of Processing Activities (Art. 30)"));
  });

  it("includes Breach Notification gap", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("Breach Notification (Art. 33/34)"));
    assert.ok(result.includes("72-hour"));
  });

  it("includes DPIA gap when AI services present", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("Data Protection Impact Assessment (Art. 35)"));
    assert.ok(result.includes("AI services detected"));
  });

  it("includes DPIA gap when 5+ services present", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("sentry", "monitoring"),
        makeService("auth0", "auth"),
        makeService("google-analytics", "analytics"),
      ],
    });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("Data Protection Impact Assessment (Art. 35)"));
  });

  it("does not include DPIA gap for few non-AI services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment"), makeService("sentry", "monitoring")],
    });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(!result.includes("Data Protection Impact Assessment"));
  });

  it("includes DPO gap when no DPO configured", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("Data Protection Officer (Art. 37)"));
    assert.ok(result.includes("No DPO configured"));
  });

  it("skips DPO gap when DPO is configured", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ dpoName: "Jane Doe" });
    const result = generateComplianceGapAnalysis(scan, ctx)!;
    assert.ok(!result.includes("Data Protection Officer (Art. 37)"));
  });

  it("skips DPO gap when DPO email is configured", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ dpoEmail: "dpo@acme.com" });
    const result = generateComplianceGapAnalysis(scan, ctx)!;
    assert.ok(!result.includes("Data Protection Officer (Art. 37)"));
  });

  it("includes Right to Erasure when database present", () => {
    const scan = makeScan({ services: [makeService("supabase", "database")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("Right to Erasure (Art. 17)"));
  });

  it("includes Right to Erasure when auth present", () => {
    const scan = makeScan({ services: [makeService("auth0", "auth")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("Right to Erasure (Art. 17)"));
  });

  it("skips Right to Erasure when no database or auth", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(!result.includes("Right to Erasure"));
  });

  it("includes Processor Agreements when 2+ services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment"), makeService("openai", "ai")],
    });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("Processor Agreements (Art. 28)"));
    assert.ok(result.includes("2 third-party services"));
  });

  it("skips Processor Agreements when only 1 service", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(!result.includes("Processor Agreements"));
  });

  it("includes Consent Management when analytics present", () => {
    const scan = makeScan({ services: [makeService("google-analytics", "analytics")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("Consent Management (Art. 6/7)"));
  });

  it("includes Consent Management when advertising present", () => {
    const scan = makeScan({ services: [makeService("facebook-pixel", "advertising")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("Consent Management (Art. 6/7)"));
  });

  // ── CCPA gaps ─────────────────────────────────────────────────────

  it("includes CCPA gaps when ccpa jurisdiction set", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ jurisdictions: ["ccpa"] });
    const result = generateComplianceGapAnalysis(scan, ctx)!;
    assert.ok(result.includes("Do Not Sell My Personal Information"));
    assert.ok(result.includes("CCPA/CPRA"));
    assert.ok(result.includes("Consumer Data Request Handling"));
  });

  it("CCPA DNS is Critical when analytics present", () => {
    const scan = makeScan({ services: [makeService("google-analytics", "analytics")] });
    const ctx = makeCtx({ jurisdictions: ["ccpa"] });
    const result = generateComplianceGapAnalysis(scan, ctx)!;
    assert.ok(result.includes("Critical"));
  });

  it("skips CCPA gaps when ccpa not in jurisdictions", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ jurisdictions: ["gdpr"] });
    const result = generateComplianceGapAnalysis(scan, ctx)!;
    assert.ok(!result.includes("CCPA/CPRA"));
  });

  // ── EU AI Act gaps ────────────────────────────────────────────────

  it("includes EU AI Act gaps when AI present", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("AI System Transparency (Art. 50)"));
    assert.ok(result.includes("EU AI Act"));
    assert.ok(result.includes("AI Risk Classification"));
    assert.ok(result.includes("Human Oversight (Art. 14)"));
  });

  it("shows AI risk level from context in classification gap", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const ctx = makeCtx({ aiRiskLevel: "high" });
    const result = generateComplianceGapAnalysis(scan, ctx)!;
    assert.ok(result.includes("Risk level set to: high"));
  });

  it("shows 'not classified' when no AI risk level", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("AI risk level not classified"));
  });

  it("skips EU AI Act gaps when no AI", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(!result.includes("EU AI Act"));
  });

  // ── PCI DSS gaps ──────────────────────────────────────────────────

  it("includes PCI DSS gap when payment present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("PCI DSS Compliance"));
    assert.ok(result.includes("PCI DSS"));
  });

  it("skips PCI DSS when no payment", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(!result.includes("PCI DSS Compliance"));
  });

  // ── ePrivacy gaps ─────────────────────────────────────────────────

  it("includes ePrivacy cookie consent gap when analytics present", () => {
    const scan = makeScan({ services: [makeService("google-analytics", "analytics")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("Cookie Consent (ePrivacy Directive)"));
  });

  it("skips ePrivacy when no analytics", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(!result.includes("ePrivacy"));
  });

  // ── SOC 2 gaps ────────────────────────────────────────────────────

  it("includes SOC 2 gap when 3+ services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("sentry", "monitoring"),
      ],
    });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("SOC 2 Type II Audit Readiness"));
  });

  it("skips SOC 2 when fewer than 3 services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment"), makeService("openai", "ai")],
    });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(!result.includes("SOC 2 Type II"));
  });

  // ── Priority sorting ──────────────────────────────────────────────

  it("sorts gaps by priority (Critical first)", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("google-analytics", "analytics"),
      ],
    });
    const result = generateComplianceGapAnalysis(scan)!;
    const criticalIdx = result.indexOf("Critical");
    const mediumIdx = result.lastIndexOf("Medium");
    assert.ok(criticalIdx < mediumIdx);
  });

  // ── Per-Regulation Breakdown ──────────────────────────────────────

  it("includes per-regulation breakdown section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("## Per-Regulation Breakdown"));
  });

  it("shows GDPR subsection with gap count", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("### GDPR"));
    assert.ok(result.includes("gaps identified"));
  });

  // ── Remediation Roadmap ───────────────────────────────────────────

  it("includes remediation roadmap", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("## Remediation Roadmap"));
  });

  it("includes Immediate (Week 1) section for critical gaps", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("### Immediate (Week 1)"));
  });

  it("includes Short-term section for high priority gaps", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("### Short-term (Weeks 2-4)"));
  });

  it("includes Medium-term section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("### Medium-term (Months 2-3)"));
  });

  it("uses checkbox format in roadmap", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment"), makeService("openai", "ai")],
    });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("- [ ] **"));
  });

  // ── Disclaimer footer ─────────────────────────────────────────────

  it("includes legal disclaimer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceGapAnalysis(scan)!;
    assert.ok(result.includes("does not constitute legal advice"));
  });

  // ── Comprehensive test ────────────────────────────────────────────

  it("comprehensive test: AI + payment + analytics + auth + database with CCPA", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["card data"]),
        makeService("openai", "ai", ["prompts"]),
        makeService("google-analytics", "analytics", ["page views"]),
        makeService("auth0", "auth", ["credentials"]),
        makeService("supabase", "database", ["user data"]),
      ],
    });
    const ctx = makeCtx({
      companyName: "TestCo",
      jurisdictions: ["gdpr", "ccpa"],
      aiRiskLevel: "high",
    });
    const result = generateComplianceGapAnalysis(scan, ctx)!;
    // All regulation sections present
    assert.ok(result.includes("GDPR"));
    assert.ok(result.includes("CCPA/CPRA"));
    assert.ok(result.includes("EU AI Act"));
    assert.ok(result.includes("PCI DSS"));
    assert.ok(result.includes("ePrivacy"));
    assert.ok(result.includes("SOC 2"));
    // Specific gaps
    assert.ok(result.includes("Privacy Notice (Art. 13/14)"));
    assert.ok(result.includes("Data Protection Impact Assessment (Art. 35)"));
    assert.ok(result.includes("Right to Erasure (Art. 17)"));
    assert.ok(result.includes("Processor Agreements (Art. 28)"));
    assert.ok(result.includes("Consent Management (Art. 6/7)"));
    assert.ok(result.includes("Do Not Sell My Personal Information"));
    assert.ok(result.includes("AI System Transparency (Art. 50)"));
    assert.ok(result.includes("Human Oversight (Art. 14)"));
    assert.ok(result.includes("PCI DSS Compliance"));
    assert.ok(result.includes("Cookie Consent (ePrivacy Directive)"));
    assert.ok(result.includes("SOC 2 Type II Audit Readiness"));
    // Context values used
    assert.ok(result.includes("TestCo"));
    assert.ok(result.includes("Risk level set to: high"));
    assert.ok(result.includes("5 third-party services"));
  });
});
