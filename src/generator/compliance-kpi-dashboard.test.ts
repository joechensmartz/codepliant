import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateComplianceKPIDashboard } from "./compliance-kpi-dashboard.js";

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

describe("generateComplianceKPIDashboard", () => {
  // ── Null guard ──────────────────────────────────────────────────────

  it("returns null when no services", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceKPIDashboard(scan);
    assert.strictEqual(result, null);
  });

  it("returns a string when at least one service exists", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan);
    assert.strictEqual(typeof result, "string");
    assert.ok(result!.length > 0);
  });

  // ── Header and metadata ─────────────────────────────────────────────

  it("includes title", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("# Compliance KPI Dashboard"));
  });

  it("includes company name from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan, {
      companyName: "TestCo",
      contactEmail: "test@testco.com",
    })!;
    assert.ok(result.includes("TestCo"));
  });

  it("uses default company placeholder when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("includes project name", () => {
    const scan = makeScan({
      projectName: "my-app",
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("my-app"));
  });

  it("includes service count in header", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("**Services Monitored:** 3"));
  });

  it("includes generated date in ISO format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.match(result, /\*\*Generated:\*\* \d{4}-\d{2}-\d{2}/);
  });

  it("includes introductory accountability statement", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("GDPR"));
    assert.ok(result.includes("SOC 2"));
    assert.ok(result.includes("ISO 27001"));
  });

  // ── KPI Overview Table ──────────────────────────────────────────────

  it("includes KPI Overview table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("## KPI Overview"));
    assert.ok(result.includes("| ID | KPI | Target | Frequency | Regulation |"));
  });

  it("includes all 12 core KPIs in overview", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("KPI-01"));
    assert.ok(result.includes("KPI-12"));
    assert.ok(result.includes("DSAR Response Time"));
    assert.ok(result.includes("Access Review Completion"));
  });

  // ── Core Compliance KPIs ────────────────────────────────────────────

  it("includes Core Compliance KPIs section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("## Core Compliance KPIs"));
  });

  it("includes detailed KPI definition with all fields", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("### KPI-01: DSAR Response Time"));
    assert.ok(result.includes("**Description:**"));
    assert.ok(result.includes("**Metric:**"));
    assert.ok(result.includes("**Target:**"));
    assert.ok(result.includes("**Measurement Frequency:**"));
    assert.ok(result.includes("**Regulatory Basis:**"));
    assert.ok(result.includes("**Formula:**"));
  });

  it("includes tracking template for each core KPI", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("#### Tracking Template"));
    assert.ok(result.includes("| Month 1 |"));
    assert.ok(result.includes("| Month 2 |"));
    assert.ok(result.includes("| Month 3 |"));
  });

  it("includes key core KPIs", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("DSAR Response Time"));
    assert.ok(result.includes("DSAR Completion Rate"));
    assert.ok(result.includes("Breach Notification Speed"));
    assert.ok(result.includes("Security Training Completion"));
    assert.ok(result.includes("Vendor Risk Assessment Completion"));
    assert.ok(result.includes("Vulnerability Remediation Time"));
    assert.ok(result.includes("Data Retention Compliance"));
  });

  // ── AI-Specific KPIs (conditional) ──────────────────────────────────

  it("excludes AI-Specific KPIs when no AI services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(!result.includes("## AI-Specific KPIs"));
    assert.ok(!result.includes("KPI-AI-01"));
  });

  it("includes AI-Specific KPIs when AI services present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("## AI-Specific KPIs"));
    assert.ok(result.includes("KPI-AI-01"));
    assert.ok(result.includes("AI Model Accuracy"));
    assert.ok(result.includes("KPI-AI-02"));
    assert.ok(result.includes("AI Bias Audit Frequency"));
    assert.ok(result.includes("KPI-AI-03"));
    assert.ok(result.includes("AI Incident Rate"));
    assert.ok(result.includes("KPI-AI-04"));
    assert.ok(result.includes("Prompt Injection Block Rate"));
  });

  it("lists detected AI service names", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("anthropic", "ai"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("openai"));
    assert.ok(result.includes("anthropic"));
  });

  it("includes AI KPIs in overview table when AI present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("| KPI-AI-01 |"));
    assert.ok(result.includes("EU AI Act"));
  });

  it("includes AI KPI tracking templates", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("### KPI-AI-01: AI Model Accuracy"));
    assert.ok(result.includes("EU AI Act Art. 15"));
  });

  // ── Monthly Reporting Template ──────────────────────────────────────

  it("includes Monthly Reporting Template", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("## Monthly Reporting Template"));
    assert.ok(result.includes("Month: __________"));
    assert.ok(result.includes("Monthly Summary"));
  });

  it("lists monthly KPIs in monthly template", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan)!;
    // DSAR Response Time is monthly
    assert.ok(result.includes("DSAR Response Time"));
    assert.ok(result.includes("Incident Response Time"));
  });

  // ── Quarterly Reporting Template ────────────────────────────────────

  it("includes Quarterly Reporting Template", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("## Quarterly Reporting Template"));
    assert.ok(result.includes("Quarter: Q__"));
    assert.ok(result.includes("Quarterly Executive Summary"));
  });

  it("includes quarterly KPIs in quarterly template", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan)!;
    // Breach Notification Speed is quarterly
    assert.ok(result.includes("Breach Notification Speed"));
    assert.ok(result.includes("Security Training Completion"));
  });

  it("includes monthly KPI trend in quarterly template", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("Monthly KPI Trend (Quarter)"));
    assert.ok(result.includes("| Month 1 | Month 2 | Month 3 |"));
  });

  // ── Annual Review Template ──────────────────────────────────────────

  it("includes Annual KPI Review section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("## Annual KPI Review"));
    assert.ok(result.includes("Year-over-Year Comparison"));
    assert.ok(result.includes("| Q1 | Q2 | Q3 | Q4 |"));
  });

  it("includes Annual Compliance Program Score", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("Annual Compliance Program Score"));
    assert.ok(result.includes("Data Subject Rights"));
    assert.ok(result.includes("Incident Response"));
    assert.ok(result.includes("Vendor Management"));
    assert.ok(result.includes("Technical Controls"));
  });

  it("excludes AI Governance from annual score when no AI", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(!result.includes("AI Governance"));
  });

  it("includes AI Governance in annual score when AI present", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("AI Governance"));
  });

  // ── Dashboard Implementation Guide ──────────────────────────────────

  it("includes Dashboard Implementation Guide", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("## Dashboard Implementation Guide"));
    assert.ok(result.includes("Recommended Dashboard Tools"));
    assert.ok(result.includes("Grafana"));
    assert.ok(result.includes("Power BI"));
  });

  it("includes data collection automation example", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("Data Collection Automation"));
    assert.ok(result.includes("codepliant scan"));
  });

  it("includes alert thresholds table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("Alert Thresholds"));
    assert.ok(result.includes("Warning Threshold"));
    assert.ok(result.includes("Critical Threshold"));
    assert.ok(result.includes("Escalate to DPO"));
  });

  // ── Contact / Footer ────────────────────────────────────────────────

  it("includes contact email", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan, {
      companyName: "TestCo",
      contactEmail: "compliance@testco.com",
    })!;
    assert.ok(result.includes("compliance@testco.com"));
  });

  it("uses default email placeholder when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("includes DPO email when provided in context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan, {
      companyName: "TestCo",
      contactEmail: "compliance@testco.com",
      dpoEmail: "dpo@testco.com",
    })!;
    assert.ok(result.includes("dpo@testco.com"));
    assert.ok(result.includes("Data Protection Officer"));
  });

  it("excludes DPO line when dpoEmail not provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan, {
      companyName: "TestCo",
      contactEmail: "compliance@testco.com",
    })!;
    assert.ok(!result.includes("Data Protection Officer"));
  });

  it("includes Codepliant footer with disclaimer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceKPIDashboard(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("reviewed by your compliance team"));
  });

  // ── Combined scenario ───────────────────────────────────────────────

  it("generates complete dashboard with AI and full context", () => {
    const scan = makeScan({
      projectName: "enterprise-app",
      services: [
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
        makeService("sentry", "monitoring"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateComplianceKPIDashboard(scan, {
      companyName: "EnterpriseCo",
      contactEmail: "compliance@enterprise.com",
      dpoEmail: "dpo@enterprise.com",
    })!;
    assert.ok(result.includes("# Compliance KPI Dashboard"));
    assert.ok(result.includes("EnterpriseCo"));
    assert.ok(result.includes("enterprise-app"));
    assert.ok(result.includes("**Services Monitored:** 5"));
    // Core KPIs present
    assert.ok(result.includes("## Core Compliance KPIs"));
    assert.ok(result.includes("KPI-01"));
    assert.ok(result.includes("KPI-12"));
    // AI KPIs present
    assert.ok(result.includes("## AI-Specific KPIs"));
    assert.ok(result.includes("KPI-AI-01"));
    assert.ok(result.includes("KPI-AI-04"));
    assert.ok(result.includes("openai"));
    // AI Governance in annual score
    assert.ok(result.includes("AI Governance"));
    // Templates
    assert.ok(result.includes("## Monthly Reporting Template"));
    assert.ok(result.includes("## Quarterly Reporting Template"));
    assert.ok(result.includes("## Annual KPI Review"));
    // Contact
    assert.ok(result.includes("compliance@enterprise.com"));
    assert.ok(result.includes("dpo@enterprise.com"));
  });
});
