import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateComplianceMaturityAssessment } from "./compliance-maturity-assessment.js";
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

describe("generateComplianceMaturityAssessment", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateComplianceMaturityAssessment(scan), null);
  });

  // ── Basic generation ───────────────────────────────────────────────

  it("generates assessment with a single service", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result !== null);
    assert.ok(result.includes("# Compliance Maturity Assessment"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes project name in disclaimer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("test-project"));
  });

  // ── Context values ─────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generateComplianceMaturityAssessment(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  // ── Scoring Guide section ──────────────────────────────────────────

  it("includes Scoring Guide section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("## Scoring Guide"));
    assert.ok(result.includes("Initial"));
    assert.ok(result.includes("Developing"));
    assert.ok(result.includes("Defined"));
    assert.ok(result.includes("Managed"));
    assert.ok(result.includes("Optimized"));
  });

  // ── Maturity Summary section ───────────────────────────────────────

  it("includes Maturity Summary section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("## Maturity Summary"));
  });

  it("includes all six domain names in summary", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("Governance & Leadership"));
    assert.ok(result.includes("Privacy & Data Protection"));
    assert.ok(result.includes("Information Security"));
    assert.ok(result.includes("Vendor & Third-Party Risk"));
    assert.ok(result.includes("AI Governance & Ethics"));
    assert.ok(result.includes("Incident Response & Business Continuity"));
  });

  it("shows overall maturity score", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("**Overall Maturity Score:**"));
    assert.ok(/\d\.\d\/5\.0/.test(result));
  });

  it("shows questions auto-assessed count", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("**Questions Auto-Assessed:**"));
  });

  it("shows questions requiring manual assessment", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("**Questions Requiring Manual Assessment:**"));
  });

  it("shows maximum possible score", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("**Maximum Possible Score:**"));
    // 50 questions * 5 = 250
    assert.ok(result.includes("250"));
  });

  // ── Auto-scoring: Governance ───────────────────────────────────────

  it("auto-scores GOV-01 when services exist", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("[AUTO]"));
    assert.ok(result.includes("GOV-01"));
  });

  it("auto-scores GOV-02 always", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("GOV-02"));
    assert.ok(result.includes("Automated compliance scanning provides baseline policy framework"));
  });

  it("auto-scores GOV-04 higher for >5 services", () => {
    const services = Array.from({ length: 6 }, (_, i) =>
      makeService(`svc-${i}`, "other")
    );
    const scan = makeScan({ services });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("6 services detected"));
    assert.ok(result.includes("compliance scope is well-defined"));
  });

  it("auto-scores GOV-04 lower for 1-5 services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("1 service(s) detected"));
    assert.ok(result.includes("limited compliance scope"));
  });

  // ── Auto-scoring: Privacy ──────────────────────────────────────────

  it("auto-scores PRI-01 when services exist", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("Privacy policy auto-generated"));
  });

  it("auto-scores PRI-04 with analytics", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("Consent management guide generated for detected analytics services"));
  });

  it("auto-scores PRI-04 without analytics", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("consent management may still be needed"));
  });

  // ── Auto-scoring: Security ─────────────────────────────────────────

  it("auto-scores SEC-01 higher with auth service", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("Authentication service detected"));
    assert.ok(result.includes("clerk"));
  });

  it("auto-scores SEC-01 lower without auth service", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("No authentication service detected"));
  });

  it("auto-scores SEC-02 with monitoring service", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("Monitoring detected"));
    assert.ok(result.includes("sentry"));
  });

  it("auto-scores SEC-02 without monitoring service", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("No monitoring service detected"));
  });

  it("auto-scores SEC-06 with database service", () => {
    const scan = makeScan({ services: [makeService("prisma", "database")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("encryption at rest needs manual verification"));
    assert.ok(result.includes("prisma"));
  });

  // ── Auto-scoring: Vendor ───────────────────────────────────────────

  it("auto-scores VEN-01 higher for >3 services", () => {
    const services = Array.from({ length: 4 }, (_, i) =>
      makeService(`svc-${i}`, "other")
    );
    const scan = makeScan({ services });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("4 third-party services detected and inventoried"));
  });

  it("auto-scores VEN-01 lower for 1-3 services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("1 third-party service(s) detected"));
  });

  it("auto-scores VEN-04 for >3 services", () => {
    const services = Array.from({ length: 4 }, (_, i) =>
      makeService(`svc-${i}`, "other")
    );
    const scan = makeScan({ services });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("Third-party risk assessment generated"));
  });

  // ── Auto-scoring: AI ───────────────────────────────────────────────

  it("auto-scores AI-01 with AI services", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("AI services detected"));
    assert.ok(result.includes("openai"));
  });

  it("auto-scores AI-01 as N/A without AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("No AI services detected"));
  });

  it("auto-scores AI-02 with AI services", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("AI disclosure document generated"));
  });

  it("auto-scores AI-05 with AI services", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("AI governance framework generated"));
  });

  // ── Auto-scoring: Incident ─────────────────────────────────────────

  it("auto-scores INC-01 always", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("Incident response plan auto-generated"));
  });

  it("auto-scores INC-02 always", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("Data breach notification templates generated per jurisdiction"));
  });

  it("auto-scores INC-04 always", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("Incident severity matrix generated (P0-P4)"));
  });

  // ── Question sections ──────────────────────────────────────────────

  it("includes question tables with headers", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("| # | Question | Score (1-5) | Justification |"));
  });

  it("marks manual questions with [ ] ___", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("[ ] ___"));
    assert.ok(result.includes("[MANUAL]"));
  });

  it("marks auto questions with [AUTO]", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("[AUTO]"));
  });

  // ── Improvement Action Plan ────────────────────────────────────────

  it("includes Improvement Action Plan section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("## Improvement Action Plan"));
  });

  it("lists domains below maturity level 4 as priorities", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("[DESCRIBE ACTIONS]"));
    assert.ok(result.includes("[OWNER]"));
    assert.ok(result.includes("[DATE]"));
  });

  // ── Assessment Sign-Off ────────────────────────────────────────────

  it("includes Assessment Sign-Off section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("## Assessment Sign-Off"));
    assert.ok(result.includes("Assessor"));
    assert.ok(result.includes("Compliance Officer"));
    assert.ok(result.includes("Executive Sponsor"));
  });

  // ── Next Assessment ────────────────────────────────────────────────

  it("includes Next Assessment section with quarterly cadence", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("## Next Assessment"));
    assert.ok(result.includes("quarterly cadence"));
  });

  // ── Disclaimer ─────────────────────────────────────────────────────

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("does not constitute legal advice"));
  });

  // ── Score bar rendering ────────────────────────────────────────────

  it("includes visual score bars in summary", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceMaturityAssessment(scan)!;
    // Score bars use block characters
    assert.ok(result.includes("["));
    assert.ok(result.includes("]"));
  });

  // ── Comprehensive test ─────────────────────────────────────────────

  it("generates comprehensive assessment with all service categories", () => {
    const scan = makeScan({
      services: [
        makeService("clerk", "auth"),
        makeService("prisma", "database"),
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
        makeService("resend", "email"),
        makeService("sentry", "monitoring"),
        makeService("s3", "storage"),
      ],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "privacy@acme.com" };
    const result = generateComplianceMaturityAssessment(scan, ctx)!;

    // Header
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("# Compliance Maturity Assessment"));

    // All six sections present
    assert.ok(result.includes("## Governance & Leadership"));
    assert.ok(result.includes("## Privacy & Data Protection"));
    assert.ok(result.includes("## Information Security"));
    assert.ok(result.includes("## Vendor & Third-Party Risk"));
    assert.ok(result.includes("## AI Governance & Ethics"));
    assert.ok(result.includes("## Incident Response & Business Continuity"));

    // Auto-scored items from various categories
    assert.ok(result.includes("Authentication service detected"));
    assert.ok(result.includes("Monitoring detected"));
    assert.ok(result.includes("AI services detected"));
    assert.ok(result.includes("Consent management guide generated for detected analytics services"));
    assert.ok(result.includes("encryption at rest needs manual verification"));
    assert.ok(result.includes("8 services detected"));
  });
});
