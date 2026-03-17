import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateComplianceRoadmap } from "./compliance-roadmap.js";

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

describe("generateComplianceRoadmap", () => {
  // ── Always generates (never null) ───────────────────────────────────

  it("always returns a string, even with no services", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan);
    assert.strictEqual(typeof result, "string");
    assert.ok(result.includes("# Compliance Roadmap"));
  });

  it("generates with empty services array", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.length > 0);
  });

  // ── Header and metadata ─────────────────────────────────────────────

  it("includes company name in header", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan, {
      companyName: "TestCo",
      contactEmail: "test@testco.com",
    });
    assert.ok(result.includes("TestCo"));
  });

  it("uses default company placeholder", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("includes generated date", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan);
    assert.match(result, /Generated on \d{4}-\d{2}-\d{2}/);
  });

  it("includes service count", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
      ],
    });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("2 services detected"));
  });

  // ── Overview table ──────────────────────────────────────────────────

  it("includes four-phase overview table", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("## Overview"));
    assert.ok(result.includes("Phase 1"));
    assert.ok(result.includes("Phase 2"));
    assert.ok(result.includes("Phase 3"));
    assert.ok(result.includes("Phase 4"));
    assert.ok(result.includes("**Critical**"));
    assert.ok(result.includes("**Continuous**"));
  });

  // ── Phase 1: Essential Documents ────────────────────────────────────

  it("includes Phase 1 privacy and terms", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("## Phase 1: Essential Documents"));
    assert.ok(result.includes("Privacy Policy"));
    assert.ok(result.includes("PRIVACY_POLICY.md"));
    assert.ok(result.includes("Terms of Service"));
    assert.ok(result.includes("TERMS_OF_SERVICE.md"));
  });

  it("includes GDPR Art. 13 reference by default", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("GDPR Art. 13"));
  });

  it("includes cookie compliance when analytics present", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("Cookie Compliance"));
    assert.ok(result.includes("COOKIE_POLICY.md"));
    assert.ok(result.includes("COOKIE_INVENTORY.md"));
    assert.ok(result.includes("cookie consent banner"));
    assert.ok(result.includes("COOKIE_CONSENT_CONFIG.json"));
  });

  it("excludes cookie section when no analytics", () => {
    const scan = makeScan({
      services: [makeService("a", "auth")],
    });
    const result = generateComplianceRoadmap(scan);
    assert.ok(!result.includes("Cookie Compliance"));
  });

  it("includes AI compliance when AI services present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("AI Compliance"));
    assert.ok(result.includes("AI_DISCLOSURE.md"));
    assert.ok(result.includes("EU AI Act Art. 50"));
    assert.ok(result.includes("August 2, 2026"));
    assert.ok(result.includes("AI_MODEL_CARD.md"));
  });

  it("excludes AI compliance section when no AI services", () => {
    const scan = makeScan({
      services: [makeService("a", "auth")],
    });
    const result = generateComplianceRoadmap(scan);
    assert.ok(!result.includes("AI Compliance"));
    assert.ok(!result.includes("AI_DISCLOSURE.md"));
  });

  it("includes payment compliance when payment services present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("Payment Compliance"));
    assert.ok(result.includes("REFUND_POLICY.md"));
    assert.ok(result.includes("14-day cooling-off"));
  });

  it("excludes payment compliance section when no payment services", () => {
    const scan = makeScan({
      services: [makeService("a", "auth")],
    });
    const result = generateComplianceRoadmap(scan);
    assert.ok(!result.includes("Payment Compliance"));
  });

  it("includes Week 1 checklist with conditional rows", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("### Week 1 Checklist"));
    assert.ok(result.includes("| Privacy Policy |"));
    assert.ok(result.includes("| Terms of Service |"));
    assert.ok(result.includes("| Cookie Policy |"));
    assert.ok(result.includes("| AI Disclosure |"));
  });

  it("omits cookie and AI rows from checklist when not applicable", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("| Privacy Policy |"));
    assert.ok(!result.includes("| Cookie Policy |"));
    assert.ok(!result.includes("| AI Disclosure |"));
  });

  // ── Phase 2: Security & Incident Response ───────────────────────────

  it("includes Phase 2 security and IR", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("## Phase 2: Security & Incident Response"));
    assert.ok(result.includes("SECURITY.md"));
    assert.ok(result.includes("INCIDENT_RESPONSE_PLAN.md"));
    assert.ok(result.includes("RESPONSIBLE_DISCLOSURE_POLICY.md"));
  });

  it("includes GDPR 72-hour breach notification reference", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("72-hour breach notification"));
  });

  it("includes Week 3 access and change control", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("ACCESS_CONTROL_POLICY.md"));
    assert.ok(result.includes("CHANGE_MANAGEMENT_POLICY.md"));
  });

  it("includes Week 4 data protection", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("DSAR_HANDLING_GUIDE.md"));
    assert.ok(result.includes("DATA_RETENTION_POLICY.md"));
  });

  it("uses website context for security email", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan, {
      companyName: "TestCo",
      contactEmail: "test@testco.com",
      website: "testco.com",
    });
    assert.ok(result.includes("security@testco.com"));
  });

  // ── Phase 3: Advanced Compliance ────────────────────────────────────

  it("includes Phase 3 advanced compliance", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("## Phase 3: Advanced Compliance & Audit Readiness"));
  });

  it("includes SOC 2 preparation when 5+ services", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
        makeService("d", "analytics"),
        makeService("e", "email"),
      ],
    });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("### SOC 2 Preparation"));
    assert.ok(result.includes("SOC2_READINESS_CHECKLIST.md"));
    assert.ok(result.includes("ISO_27001_CHECKLIST.md"));
  });

  it("excludes SOC 2 preparation when fewer than 5 services", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
      ],
    });
    const result = generateComplianceRoadmap(scan);
    assert.ok(!result.includes("### SOC 2 Preparation"));
  });

  it("includes data processing and transfers", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("DATA_PROCESSING_AGREEMENT.md"));
    assert.ok(result.includes("PRIVACY_IMPACT_ASSESSMENT.md"));
    assert.ok(result.includes("TRANSFER_IMPACT_ASSESSMENT.md"));
    assert.ok(result.includes("Standard Contractual Clauses"));
    assert.ok(result.includes("Schrems II"));
  });

  it("includes AI-specific PIA note when AI present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("GDPR Art. 35"));
  });

  it("includes vendor management section", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("THIRD_PARTY_RISK_ASSESSMENT.md"));
    assert.ok(result.includes("VENDOR_SECURITY_QUESTIONNAIRE.md"));
    assert.ok(result.includes("VENDOR_ONBOARDING_CHECKLIST.md"));
  });

  // ── Phase 4: Ongoing Monitoring ─────────────────────────────────────

  it("includes Phase 4 ongoing monitoring", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("## Phase 4: Ongoing Monitoring & Maintenance"));
    assert.ok(result.includes("CI/CD compliance checks"));
    assert.ok(result.includes("pre-commit hook"));
    assert.ok(result.includes("periodic scans"));
  });

  it("includes review cadence table", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("### Review Cadence"));
    assert.ok(result.includes("**Weekly**"));
    assert.ok(result.includes("**Monthly**"));
    assert.ok(result.includes("**Quarterly**"));
    assert.ok(result.includes("**Annual**"));
  });

  it("includes trigger-based updates list", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("### Trigger-Based Updates"));
    assert.ok(result.includes("new third-party service"));
    assert.ok(result.includes("authentication providers"));
    assert.ok(result.includes("AI/ML capabilities"));
    assert.ok(result.includes("new markets/jurisdictions"));
  });

  // ── Progress Tracker ────────────────────────────────────────────────

  it("includes progress tracker table", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("## Progress Tracker"));
    assert.ok(result.includes("Phase 1: Essential Documents"));
    assert.ok(result.includes("Phase 4: Ongoing Monitoring"));
    assert.ok(result.includes("Not started"));
  });

  // ── Regulatory Deadlines ────────────────────────────────────────────

  it("includes regulatory deadlines section", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("## Regulatory Deadlines"));
    assert.ok(result.includes("ePrivacy Directive"));
  });

  it("includes GDPR deadline by default", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("GDPR"));
    assert.ok(result.includes("4% global revenue"));
  });

  it("includes CCPA when jurisdiction specified", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan, {
      companyName: "TestCo",
      contactEmail: "test@testco.com",
      jurisdictions: ["ccpa"],
    });
    assert.ok(result.includes("CCPA/CPRA"));
    assert.ok(result.includes("$7,500"));
  });

  it("excludes CCPA when not in jurisdictions", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan, {
      companyName: "TestCo",
      contactEmail: "test@testco.com",
      jurisdictions: ["gdpr"],
    });
    assert.ok(!result.includes("CCPA/CPRA"));
  });

  it("includes EU AI Act deadline when AI services present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("EU AI Act"));
    assert.ok(result.includes("August 2, 2026"));
    assert.ok(result.includes("7% global revenue"));
  });

  it("excludes EU AI Act from deadlines when no AI services", () => {
    const scan = makeScan({
      services: [makeService("a", "auth")],
    });
    const result = generateComplianceRoadmap(scan);
    // It should not have the AI Act row in the regulatory deadlines table
    assert.ok(!result.includes("EUR 35M"));
  });

  // ── Footer ──────────────────────────────────────────────────────────

  it("includes Codepliant version in footer", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("Generated by Codepliant"));
  });

  it("includes disclaimer about legal review", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("reviewed by a qualified compliance professional"));
  });

  it("mentions service count in footer", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("3 services"));
  });

  // ── Combined scenarios ──────────────────────────────────────────────

  it("handles all conditional sections together", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
        makeService("stripe", "payment"),
        makeService("next-auth", "auth"),
        makeService("@sentry/node", "monitoring"),
      ],
    });
    const result = generateComplianceRoadmap(scan, {
      companyName: "TestCo",
      contactEmail: "test@testco.com",
      jurisdictions: ["gdpr", "ccpa"],
    });
    // Phase 1 conditional sections
    assert.ok(result.includes("Cookie Compliance"));
    assert.ok(result.includes("AI Compliance"));
    assert.ok(result.includes("Payment Compliance"));
    // Phase 3 SOC 2 (5 services)
    assert.ok(result.includes("### SOC 2 Preparation"));
    // Regulatory deadlines
    assert.ok(result.includes("GDPR"));
    assert.ok(result.includes("CCPA/CPRA"));
    assert.ok(result.includes("EU AI Act"));
    assert.ok(result.includes("ePrivacy Directive"));
  });

  it("references sub-processor count from service count", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
        makeService("d", "analytics"),
      ],
    });
    const result = generateComplianceRoadmap(scan);
    assert.ok(result.includes("4 detected sub-processors"));
  });
});
