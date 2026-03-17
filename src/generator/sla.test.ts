import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateSLA } from "./sla.js";
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

describe("generateSLA", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when no monitoring services detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    assert.strictEqual(generateSLA(scan), null);
  });

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateSLA(scan), null);
  });

  it("returns null with only non-monitoring services", () => {
    const scan = makeScan({
      services: [
        makeService("prisma", "database"),
        makeService("openai", "ai"),
        makeService("stripe", "payment"),
      ],
    });
    assert.strictEqual(generateSLA(scan), null);
  });

  // ── Generation with monitoring services ────────────────────────────

  it("generates SLA when monitoring service detected", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring", ["error traces"])],
    });
    const result = generateSLA(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Service Level Agreement"));
  });

  it("includes project name", () => {
    const scan = makeScan({
      projectName: "my-app",
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateSLA(scan)!;
    assert.ok(result.includes("my-app"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateSLA(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  // ── Context values ────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "sla@acme.com" };
    const result = generateSLA(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "sla@acme.com" };
    const result = generateSLA(scan, ctx)!;
    assert.ok(result.includes("sla@acme.com"));
  });

  it("uses context security email for support channel", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "sla@acme.com",
      securityEmail: "security@acme.com",
    };
    const result = generateSLA(scan, ctx)!;
    assert.ok(result.includes("security@acme.com"));
  });

  it("falls back securityEmail to contactEmail when securityEmail not provided", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "support@acme.com" };
    const result = generateSLA(scan, ctx)!;
    // Support channel row should use contactEmail
    assert.ok(result.includes("support@acme.com"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateSLA(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses placeholder email when no context", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateSLA(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses placeholder support email when no context", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateSLA(scan)!;
    assert.ok(result.includes("[support@example.com]"));
  });

  // ── Monitoring service names ───────────────────────────────────────

  it("lists monitoring service names in overview", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateSLA(scan)!;
    assert.ok(result.includes("@sentry/node"));
  });

  it("lists multiple monitoring services joined with comma", () => {
    const scan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring"),
        makeService("dd-trace", "monitoring"),
      ],
    });
    const result = generateSLA(scan)!;
    assert.ok(result.includes("@sentry/node, dd-trace"));
  });

  // ── Key content sections ──────────────────────────────────────────

  it("includes Overview section", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateSLA(scan)!;
    assert.ok(result.includes("## 1. Overview"));
  });

  it("includes Definitions section", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateSLA(scan)!;
    assert.ok(result.includes("Definitions"));
    assert.ok(result.includes("Downtime"));
    assert.ok(result.includes("Scheduled Maintenance"));
    assert.ok(result.includes("Monthly Uptime Percentage"));
    assert.ok(result.includes("Service Credit"));
  });

  it("includes Service Level Objectives with uptime tiers", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateSLA(scan)!;
    assert.ok(result.includes("Service Level Objectives"));
    assert.ok(result.includes("Standard"));
    assert.ok(result.includes("99.5%"));
    assert.ok(result.includes("Professional"));
    assert.ok(result.includes("99.9%"));
    assert.ok(result.includes("Enterprise"));
    assert.ok(result.includes("99.95%"));
  });

  it("includes performance metrics table", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateSLA(scan)!;
    assert.ok(result.includes("Performance"));
    assert.ok(result.includes("API Response Time"));
    assert.ok(result.includes("Page Load Time"));
    assert.ok(result.includes("Error Rate"));
  });

  it("includes Incident Classification with severity levels", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateSLA(scan)!;
    assert.ok(result.includes("Incident Classification"));
    assert.ok(result.includes("P1"));
    assert.ok(result.includes("P2"));
    assert.ok(result.includes("P3"));
    assert.ok(result.includes("P4"));
    assert.ok(result.includes("Critical"));
  });

  it("includes response times table", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateSLA(scan)!;
    assert.ok(result.includes("Response Times"));
    assert.ok(result.includes("15 minutes"));
    assert.ok(result.includes("4 hours"));
  });

  it("includes Communication section", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateSLA(scan)!;
    assert.ok(result.includes("Communication"));
    assert.ok(result.includes("Status Page"));
    assert.ok(result.includes("Incident Communication"));
    assert.ok(result.includes("Scheduled Maintenance"));
  });

  it("includes Service Credits section", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateSLA(scan)!;
    assert.ok(result.includes("Service Credits"));
    assert.ok(result.includes("Credit Schedule"));
    assert.ok(result.includes("Credit Request Process"));
    assert.ok(result.includes("Credit Limitations"));
  });

  it("includes Exclusions section", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateSLA(scan)!;
    assert.ok(result.includes("Exclusions"));
    assert.ok(result.includes("Force Majeure"));
    assert.ok(result.includes("Free tier"));
  });

  it("includes Support section with channels table", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateSLA(scan)!;
    assert.ok(result.includes("Support"));
    assert.ok(result.includes("Support Channels"));
    assert.ok(result.includes("Email"));
    assert.ok(result.includes("In-app Chat"));
    assert.ok(result.includes("Phone (Enterprise)"));
  });

  it("includes Reporting and Transparency section", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateSLA(scan)!;
    assert.ok(result.includes("Reporting and Transparency"));
    assert.ok(result.includes("Monthly uptime reports"));
  });

  it("includes SLA Modifications section", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateSLA(scan)!;
    assert.ok(result.includes("SLA Modifications"));
    assert.ok(result.includes("30 days"));
  });

  it("includes Contact section", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const ctx: GeneratorContext = { companyName: "TestCo", contactEmail: "sla@testco.com" };
    const result = generateSLA(scan, ctx)!;
    assert.ok(result.includes("Contact"));
    assert.ok(result.includes("sla@testco.com"));
  });

  // ── Conditional sections ──────────────────────────────────────────

  it("includes database performance row when database service present", () => {
    const scan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring"),
        makeService("prisma", "database"),
      ],
    });
    const result = generateSLA(scan)!;
    assert.ok(result.includes("Database Query Time"));
    assert.ok(result.includes("Data Durability"));
    assert.ok(result.includes("99.999999999%"));
  });

  it("excludes database performance row when no database service", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateSLA(scan)!;
    assert.ok(!result.includes("Database Query Time"));
    assert.ok(!result.includes("Data Durability"));
  });

  it("includes auth example in P2 severity when auth service present", () => {
    const scan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring"),
        makeService("next-auth", "auth"),
      ],
    });
    const result = generateSLA(scan)!;
    assert.ok(result.includes("Authentication failing"));
  });

  it("excludes auth example in P2 when no auth service", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateSLA(scan)!;
    assert.ok(!result.includes("Authentication failing"));
  });

  it("includes payment example in P2 severity when payment service present", () => {
    const scan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateSLA(scan)!;
    assert.ok(result.includes("Payment processing errors"));
  });

  it("excludes payment example in P2 when no payment service", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateSLA(scan)!;
    assert.ok(!result.includes("Payment processing errors"));
  });

  // ── All conditional sections together ──────────────────────────────

  it("includes all conditional content with database, auth, and payment", () => {
    const scan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring"),
        makeService("prisma", "database"),
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateSLA(scan)!;
    assert.ok(result.includes("Database Query Time"));
    assert.ok(result.includes("Authentication failing"));
    assert.ok(result.includes("Payment processing errors"));
  });

  // ── Sequential section numbering ──────────────────────────────────

  it("numbers sections sequentially", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateSLA(scan)!;
    assert.ok(result.includes("## 1. Overview"));
    assert.ok(result.includes("## 2. Definitions"));
    assert.ok(result.includes("## 3. Service Level Objectives"));
    assert.ok(result.includes("## 4. Incident Classification"));
    assert.ok(result.includes("## 5. Communication"));
    assert.ok(result.includes("## 6. Service Credits"));
    assert.ok(result.includes("## 7. Exclusions"));
    assert.ok(result.includes("## 8. Support"));
    assert.ok(result.includes("## 9. Reporting and Transparency"));
    assert.ok(result.includes("## 10. SLA Modifications"));
    assert.ok(result.includes("## 11. Contact"));
  });

  // ── Disclaimer ────────────────────────────────────────────────────

  it("includes Codepliant disclaimer with project name", () => {
    const scan = makeScan({
      projectName: "cool-app",
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateSLA(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("cool-app"));
    assert.ok(result.includes("reviewed by legal counsel"));
  });
});
