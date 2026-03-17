import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generatePrivacyMetricsDashboard } from "./privacy-metrics-dashboard.js";
import type { GeneratorContext } from "./index.js";

function makeService(
  name: string,
  category: DetectedService["category"],
  dataCollected: string[] = ["test data"],
  isDataProcessor?: boolean,
): DetectedService {
  return {
    name,
    category,
    evidence: [{ type: "dependency", file: "package.json", detail: `${name} detected` }],
    dataCollected,
    ...(isDataProcessor !== undefined ? { isDataProcessor } : {}),
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

describe("generatePrivacyMetricsDashboard", () => {
  // ── Null guard ──────────────────────────────────────────────────────

  it("returns null when no services are present", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generatePrivacyMetricsDashboard(scan), null);
  });

  // ── Basic generation ────────────────────────────────────────────────

  it("returns a non-null string when services are present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan);
    assert.ok(result !== null);
    assert.ok(result.length > 0);
  });

  it("includes title", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("# Privacy Metrics Dashboard"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes project name", () => {
    const scan = makeScan({
      projectName: "my-app",
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("my-app"));
  });

  // ── Context values ──────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "info@acme.com" };
    const result = generatePrivacyMetricsDashboard(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "privacy@acme.com" };
    const result = generatePrivacyMetricsDashboard(scan, ctx)!;
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("uses placeholder email when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses context DPO name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@b.com", dpoName: "Jane Doe" };
    const result = generatePrivacyMetricsDashboard(scan, ctx)!;
    assert.ok(result.includes("Jane Doe"));
  });

  it("uses placeholder DPO name when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("[DPO Name]"));
  });

  it("uses context DPO email", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@b.com", dpoEmail: "dpo@acme.com" };
    const result = generatePrivacyMetricsDashboard(scan, ctx)!;
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("uses placeholder DPO email when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("[dpo@example.com]"));
  });

  // ── Executive Summary ───────────────────────────────────────────────

  it("includes Executive Summary section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("## Executive Summary"));
  });

  it("shows vendor count in detected stack", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("2 third-party services"));
  });

  it("shows category count in detected stack", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("2 categories"));
  });

  // ── KPI Targets ─────────────────────────────────────────────────────

  it("includes KPI Targets section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("## KPI Targets"));
  });

  it("includes DSAR response time target", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("DSAR Response Time"));
    assert.ok(result.includes("< 15 business days"));
  });

  it("includes GDPR basis when GDPR jurisdiction set", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@b.com", jurisdictions: ["GDPR"] };
    const result = generatePrivacyMetricsDashboard(scan, ctx)!;
    assert.ok(result.includes("GDPR Art. 12(3)"));
  });

  it("includes CCPA basis when CCPA jurisdiction set", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@b.com", jurisdictions: ["CCPA"] };
    const result = generatePrivacyMetricsDashboard(scan, ctx)!;
    assert.ok(result.includes("CCPA: 45 days"));
  });

  it("includes AI opt-out metric when AI services detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("AI Processing Opt-out Rate"));
  });

  it("omits AI opt-out metric when no AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(!result.includes("AI Processing Opt-out Rate"));
  });

  // ── DSAR Metrics ────────────────────────────────────────────────────

  it("includes DSAR Metrics section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("DSAR (Data Subject Access Request) Metrics"));
  });

  it("includes monthly DSAR tracking table with all months", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    for (const month of ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]) {
      assert.ok(result.includes(`| ${month} |`), `Missing month ${month}`);
    }
  });

  it("includes DSAR by Request Type table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("DSAR by Request Type"));
    assert.ok(result.includes("Access Request"));
    assert.ok(result.includes("Deletion Request"));
    assert.ok(result.includes("Portability Request"));
  });

  it("includes CCPA-specific DSAR types when CCPA set", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@b.com", jurisdictions: ["CCPA"] };
    const result = generatePrivacyMetricsDashboard(scan, ctx)!;
    assert.ok(result.includes("Do Not Sell/Share"));
  });

  // ── Consent Metrics ─────────────────────────────────────────────────

  it("includes Consent Management section when analytics detected", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("Consent Management Metrics"));
  });

  it("includes Consent Management section when GDPR set", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@b.com", jurisdictions: ["GDPR"] };
    const result = generatePrivacyMetricsDashboard(scan, ctx)!;
    assert.ok(result.includes("Consent Management Metrics"));
  });

  it("includes AI consent purpose when AI detected with analytics", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("AI / ML Processing"));
  });

  it("omits Consent Management section when no analytics and no GDPR", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(!result.includes("Consent Management Metrics"));
  });

  // ── Data Subject Complaints ─────────────────────────────────────────

  it("includes Data Subject Complaints section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("Data Subject Complaints"));
  });

  it("includes complaint categories", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("Unwanted communications"));
    assert.ok(result.includes("Data accuracy"));
    assert.ok(result.includes("Unauthorized data sharing"));
  });

  // ── Breach & Incident Metrics ───────────────────────────────────────

  it("includes Breach & Incident Metrics section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("Breach & Incident Metrics"));
  });

  it("includes incident response SLA targets", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("Time to detect"));
    assert.ok(result.includes("< 72 hours"));
  });

  // ── Vendor Compliance Metrics ───────────────────────────────────────

  it("includes Vendor Compliance Metrics section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("Vendor Compliance Metrics"));
  });

  it("shows vendor count in DPA status table", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("| Total vendors detected | 2 |"));
  });

  it("excludes non-data-processor services from vendor count", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("eslint", "other", [], false),
      ],
    });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("| Total vendors detected | 1 |"));
  });

  // ── Privacy Training Metrics ────────────────────────────────────────

  it("includes Privacy Training Metrics section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("Privacy Training Metrics"));
  });

  it("includes quarterly training tracking table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("| Q1 |"));
    assert.ok(result.includes("| Q2 |"));
    assert.ok(result.includes("| Q3 |"));
    assert.ok(result.includes("| Q4 |"));
  });

  it("includes AI training topic when AI detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("Responsible AI Use"));
  });

  it("omits AI training topic when no AI detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(!result.includes("Responsible AI Use"));
  });

  // ── Monthly Scorecard ───────────────────────────────────────────────

  it("includes Monthly Privacy Scorecard Template", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("Monthly Privacy Scorecard Template"));
  });

  it("includes RAG key explanation", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("RAG Key"));
    assert.ok(result.includes("GREEN"));
    assert.ok(result.includes("AMBER"));
    assert.ok(result.includes("RED"));
  });

  // ── Trend Analysis ──────────────────────────────────────────────────

  it("includes Trend Analysis section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("## Trend Analysis"));
    assert.ok(result.includes("Quarterly Comparison"));
  });

  // ── Maintaining section ─────────────────────────────────────────────

  it("includes maintenance instructions", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("Maintaining This Dashboard"));
    assert.ok(result.includes("Monthly"));
  });

  // ── Footer ──────────────────────────────────────────────────────────

  it("includes Codepliant footer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("Codepliant"));
  });

  it("includes disclaimer about legal review", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    assert.ok(result.includes("does not constitute legal advice"));
  });

  // ── Current year display ────────────────────────────────────────────

  it("includes current year in reporting period", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyMetricsDashboard(scan)!;
    const year = new Date().getFullYear().toString();
    assert.ok(result.includes(year));
  });
});
