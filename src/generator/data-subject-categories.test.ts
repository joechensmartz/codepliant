import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { DetectedService, ScanResult } from "../scanner/types.js";
import { generateDataSubjectCategories } from "./data-subject-categories.js";
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

describe("generateDataSubjectCategories", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when no services detected", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateDataSubjectCategories(scan), null);
  });

  // ── Basic generation ───────────────────────────────────────────────

  it("generates document when at least one service present", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataSubjectCategories(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Data Subject Categories"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes project name", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("test-project"));
  });

  // ── Context values ─────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generateDataSubjectCategories(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  // ── Overview section ───────────────────────────────────────────────

  it("includes overview section with GDPR Art. 30 reference", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("## Overview"));
    assert.ok(result.includes("GDPR Article 30"));
  });

  // ── Data Subject Categories table ──────────────────────────────────

  it("includes data subject categories table header", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("## Data Subject Categories"));
    assert.ok(result.includes("| Category | Data Types | Legal Basis | Retention |"));
  });

  it("always includes Support Contacts row", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("**Support Contacts**"));
    assert.ok(result.includes("2 years after last contact"));
  });

  // ── Conditional: auth/payment -> End Users / Customers ─────────────

  it("includes End Users / Customers when auth detected", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("**End Users / Customers**"));
    assert.ok(result.includes("Contract performance (Art. 6(1)(b))"));
  });

  it("includes End Users / Customers when payment detected", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("**End Users / Customers**"));
  });

  it("omits End Users / Customers when no auth or payment", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(!result.includes("**End Users / Customers**"));
  });

  // ── Conditional: payment -> Paying Customers ───────────────────────

  it("includes Paying Customers when payment detected", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("**Paying Customers**"));
    assert.ok(result.includes("Payment method, billing address, transaction history"));
    assert.ok(result.includes("tax law"));
  });

  it("omits Paying Customers when no payment services", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(!result.includes("**Paying Customers**"));
  });

  // ── Conditional: analytics -> Website Visitors ─────────────────────

  it("includes Website Visitors when analytics detected", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("**Website Visitors**"));
    assert.ok(result.includes("IP address, browser info, cookies, page views"));
    assert.ok(result.includes("26 months"));
  });

  it("omits Website Visitors when no analytics services", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(!result.includes("**Website Visitors**"));
  });

  // ── Conditional: includeEmployees flag ─────────────────────────────

  it("includes Employees row when includeEmployees is true", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataSubjectCategories(scan, undefined, true)!;
    assert.ok(result.includes("**Employees**"));
    assert.ok(result.includes("Duration of employment + statutory"));
  });

  it("omits Employees row when includeEmployees is false", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataSubjectCategories(scan, undefined, false)!;
    assert.ok(!result.includes("**Employees**"));
  });

  it("omits Employees row when includeEmployees is undefined", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(!result.includes("**Employees**"));
  });

  // ── Review Notes section ───────────────────────────────────────────

  it("includes review notes section", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("## Review Notes"));
    assert.ok(result.includes("Review frequency: Annually"));
    assert.ok(result.includes("Last reviewed:"));
    assert.ok(result.includes("Next review:"));
  });

  // ── Related Documents section ──────────────────────────────────────

  it("includes related documents section", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("## Related Documents"));
    assert.ok(result.includes("PRIVACY_POLICY.md"));
    assert.ok(result.includes("RECORD_OF_PROCESSING_ACTIVITIES.md"));
    assert.ok(result.includes("LAWFUL_BASIS_ASSESSMENT.md"));
  });

  // ── Footer ─────────────────────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("Codepliant"));
  });

  it("includes review disclaimer", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("Review with your DPO"));
  });

  // ── Comprehensive test ─────────────────────────────────────────────

  it("generates comprehensive document with all categories and employees", () => {
    const scan = makeScan({
      services: [
        makeService("clerk", "auth", ["credentials"]),
        makeService("Stripe", "payment", ["cards"]),
        makeService("posthog", "analytics", ["usage"]),
      ],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "privacy@acme.com" };
    const result = generateDataSubjectCategories(scan, ctx, true)!;
    assert.ok(result.includes("Acme Corp"));
    // All conditional rows present
    assert.ok(result.includes("**End Users / Customers**"));
    assert.ok(result.includes("**Paying Customers**"));
    assert.ok(result.includes("**Website Visitors**"));
    assert.ok(result.includes("**Employees**"));
    assert.ok(result.includes("**Support Contacts**"));
  });

  it("generates minimal document with only analytics service", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateDataSubjectCategories(scan)!;
    // Only Website Visitors and Support Contacts should be present
    assert.ok(result.includes("**Website Visitors**"));
    assert.ok(result.includes("**Support Contacts**"));
    assert.ok(!result.includes("**End Users / Customers**"));
    assert.ok(!result.includes("**Paying Customers**"));
    assert.ok(!result.includes("**Employees**"));
  });
});
