import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateComplianceAutomationGuide } from "./compliance-automation-guide.js";
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

describe("generateComplianceAutomationGuide", () => {
  // ── Basic generation ────────────────────────────────────────────────

  it("returns a non-empty string", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(typeof result === "string");
    assert.ok(result.length > 0);
  });

  it("includes title", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("# Compliance Automation Guide"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes service count", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("2 services detected"));
  });

  it("returns a string even with no services", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(typeof result === "string");
    assert.ok(result.includes("0 services detected"));
  });

  // ── Context values ──────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "info@acme.com" };
    const result = generateComplianceAutomationGuide(scan, ctx);
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("[Your Company Name]"));
  });

  // ── Section 1: Overview ─────────────────────────────────────────────

  it("includes overview section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("## 1. Overview"));
  });

  it("includes four automation steps in overview", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("Integrate Codepliant into CI/CD"));
    assert.ok(result.includes("Schedule periodic scans"));
    assert.ok(result.includes("Set up webhook alerts"));
    assert.ok(result.includes("Keep docs evergreen"));
  });

  it("includes ROI and setup time estimates", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("~30 minutes"));
    assert.ok(result.includes("4-8 hours per week"));
  });

  // ── Section 2: CI/CD Integration ────────────────────────────────────

  it("includes CI/CD integration section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("## 2. CI/CD Integration"));
  });

  it("includes GitHub Actions workflow", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("### 2.1 GitHub Actions"));
    assert.ok(result.includes("actions/checkout@v4"));
    assert.ok(result.includes("compliance.yml"));
  });

  it("includes GitLab CI configuration", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("### 2.2 GitLab CI"));
    assert.ok(result.includes(".gitlab-ci.yml"));
  });

  it("includes CircleCI configuration", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("### 2.3 CircleCI"));
    assert.ok(result.includes(".circleci/config.yml"));
  });

  it("includes pre-commit hook setup", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("### 2.4 Pre-commit Hook"));
    assert.ok(result.includes("codepliant hook install"));
  });

  // ── Section 3: Scheduled Scanning ───────────────────────────────────

  it("includes scheduled scanning section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("## 3. Scheduled Scanning (Cron)"));
  });

  it("includes built-in scheduler commands", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("codepliant schedule install --frequency weekly"));
    assert.ok(result.includes("codepliant schedule install --frequency daily"));
  });

  it("includes crontab example", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("crontab -e"));
  });

  it("includes scheduled GitHub Actions workflow", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("Scheduled Compliance Scan"));
    assert.ok(result.includes("workflow_dispatch"));
  });

  // ── Section 4: Webhook Alerts ───────────────────────────────────────

  it("includes webhook alerts section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("## 4. Webhook Alerts"));
  });

  it("includes Slack notification setup", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("### 4.1 Slack Notifications"));
    assert.ok(result.includes("SLACK_WEBHOOK_URL"));
  });

  it("includes email alert setup", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("### 4.2 Email Alerts"));
  });

  it("includes custom webhook integration", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("### 4.3 Custom Webhook Integration"));
  });

  it("includes PagerDuty for payment services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("### 4.4 PagerDuty"));
    assert.ok(result.includes("payment-processing"));
  });

  it("uses 'regulated' label when no payment services", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("regulated"));
  });

  // ── Section 5: Best Practices ───────────────────────────────────────

  it("includes best practices section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("## 5. Automation Best Practices"));
  });

  it("includes version control recommendation", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("### 5.2 Version Control Your Compliance Docs"));
    assert.ok(result.includes("git add legal/"));
  });

  it("includes auto-regeneration instructions", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("### 5.3 Automate Document Regeneration"));
    assert.ok(result.includes("codepliant update"));
  });

  it("includes monorepo setup", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("### 5.6 Multi-Project (Monorepo) Setup"));
    assert.ok(result.includes("codepliant scan-all"));
  });

  // ── Section 6: Recommended Pipeline ─────────────────────────────────

  it("includes recommended pipeline diagram", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("## 6. Recommended Automation Pipeline"));
    assert.ok(result.includes("Pre-commit"));
    assert.ok(result.includes("CI/CD"));
    assert.ok(result.includes("Weekly scan"));
  });

  // ── Section 7: Maturity Model ───────────────────────────────────────

  it("includes compliance maturity model", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("## 7. Compliance as Code Maturity Model"));
    assert.ok(result.includes("Level 0"));
    assert.ok(result.includes("Level 5"));
  });

  it("recommends Level 2 for small number of services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("Start with Level 2"));
  });

  it("recommends Level 3-4 for moderate number of services", () => {
    const scan = makeScan({
      services: [
        makeService("s1", "payment"),
        makeService("s2", "analytics"),
        makeService("s3", "ai"),
        makeService("s4", "monitoring"),
      ],
    });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("Target Level 3-4"));
  });

  it("recommends Level 4+ for large number of services", () => {
    const services: DetectedService[] = [];
    for (let i = 0; i < 11; i++) {
      services.push(makeService(`svc${i}`, "analytics"));
    }
    const scan = makeScan({ services });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("Level 4+ automation"));
  });

  // ── Section 8: Troubleshooting ──────────────────────────────────────

  it("includes troubleshooting section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("## 8. Troubleshooting"));
  });

  // ── Section 9: Environment Variables ────────────────────────────────

  it("includes environment variables table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("## 9. Environment Variables for CI/CD"));
    assert.ok(result.includes("CODEPLIANT_OUTPUT"));
    assert.ok(result.includes("CODEPLIANT_FORMAT"));
    assert.ok(result.includes("CODEPLIANT_QUIET"));
    assert.ok(result.includes("NO_COLOR"));
    assert.ok(result.includes("CODEPLIANT_LICENSE"));
  });

  // ── Disclaimer ──────────────────────────────────────────────────────

  it("includes disclaimer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("Disclaimer"));
    assert.ok(result.includes("Codepliant"));
  });

  it("includes service count in footer", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("sentry", "monitoring"),
      ],
    });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("3 services"));
  });

  // ── Webhook payload includes dynamic values ─────────────────────────

  it("includes project name in webhook payload example", () => {
    const scan = makeScan({
      projectName: "my-cool-app",
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceAutomationGuide(scan);
    assert.ok(result.includes("my-cool-app"));
  });
});
