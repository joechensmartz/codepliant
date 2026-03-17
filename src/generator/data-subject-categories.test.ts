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
    assert.ok(result.includes("**End Users / Customers**"));
    assert.ok(result.includes("**Paying Customers**"));
    assert.ok(result.includes("**Website Visitors**"));
    assert.ok(result.includes("**Employees**"));
    assert.ok(result.includes("**Support Contacts**"));
  });

  it("generates minimal document with only analytics service", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("**Website Visitors**"));
    assert.ok(result.includes("**Support Contacts**"));
    assert.ok(!result.includes("**End Users / Customers**"));
    assert.ok(!result.includes("**Paying Customers**"));
    assert.ok(!result.includes("**Employees**"));
  });

  // ── New tests ──────────────────────────────────────────────────────

  it("returns a string (not null) for any non-empty services", () => {
    const scan = makeScan({ services: [makeService("some-lib", "other")] });
    const result = generateDataSubjectCategories(scan);
    assert.equal(typeof result, "string");
  });

  it("includes Last Updated label", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("**Last Updated:**"));
  });

  it("includes Organization label", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("**Organization:**"));
  });

  it("includes Project label", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("**Project:**"));
  });

  it("includes horizontal rule separator", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("---"));
  });

  it("table has proper markdown separator row", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("|----------|-----------|-------------|-----------|"));
  });

  it("End Users row includes account retention of 30 days", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("Duration of account + 30 days"));
  });

  it("End Users row includes usage data in data types", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("Name, email, account credentials, usage data"));
  });

  it("Paying Customers row includes billing address", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("billing address"));
  });

  it("Website Visitors row cites legitimate interest Art. 6(1)(f)", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("Art. 6(1)(f)"));
  });

  it("Website Visitors row also cites consent Art. 6(1)(a)", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("Art. 6(1)(a)") || result.includes("(a)"));
  });

  it("Employees row includes name, email, role, access logs", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectCategories(scan, undefined, true)!;
    assert.ok(result.includes("Name, email, role, access logs"));
  });

  it("Employees row cites contract performance Art. 6(1)(b)", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectCategories(scan, undefined, true)!;
    assert.ok(result.includes("Contract performance (Art. 6(1)(b))"));
  });

  it("Support Contacts row includes support ticket content", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("Name, email, support ticket content"));
  });

  it("Support Contacts row cites legitimate interest Art. 6(1)(f)", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("Legitimate interest (Art. 6(1)(f))"));
  });

  it("next review date is approximately one year after last reviewed", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    const lastReviewedMatch = result.match(/Last reviewed:\s*(\d{4})-(\d{2})-(\d{2})/);
    const nextReviewMatch = result.match(/Next review:\s*(\d{4})-(\d{2})-(\d{2})/);
    assert.ok(lastReviewedMatch);
    assert.ok(nextReviewMatch);
    const lastYear = parseInt(lastReviewedMatch![1], 10);
    const nextYear = parseInt(nextReviewMatch![1], 10);
    assert.ok(nextYear === lastYear || nextYear === lastYear + 1);
  });

  it("related documents are markdown links", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("[Privacy Policy](./PRIVACY_POLICY.md)"));
    assert.ok(result.includes("[Record of Processing Activities](./RECORD_OF_PROCESSING_ACTIVITIES.md)"));
    assert.ok(result.includes("[Lawful Basis Assessment](./LAWFUL_BASIS_ASSESSMENT.md)"));
  });

  it("footer is italic markdown", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("*Generated by Codepliant"));
  });

  it("auth-only scan has End Users but not Paying Customers", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("**End Users / Customers**"));
    assert.ok(!result.includes("**Paying Customers**"));
  });

  it("payment triggers both End Users and Paying Customers", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("**End Users / Customers**"));
    assert.ok(result.includes("**Paying Customers**"));
  });

  it("other category service produces minimal rows (only Support Contacts)", () => {
    const scan = makeScan({ services: [makeService("custom-lib", "other")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("**Support Contacts**"));
    assert.ok(!result.includes("**End Users / Customers**"));
    assert.ok(!result.includes("**Paying Customers**"));
    assert.ok(!result.includes("**Website Visitors**"));
    assert.ok(!result.includes("**Employees**"));
  });

  it("project name with special characters is included correctly", () => {
    const scan = makeScan({ projectName: "my-app_v2.0", services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("my-app_v2.0"));
  });

  it("context with undefined company name uses placeholder", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectCategories(scan, undefined)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("document mentions data subjects in overview", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("data subjects"));
  });

  it("document mentions personal data in overview", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    assert.ok(result.includes("personal data"));
  });

  it("table rows count matches expected categories for full scan", () => {
    const scan = makeScan({
      services: [
        makeService("clerk", "auth"),
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateDataSubjectCategories(scan, undefined, true)!;
    // End Users + Paying Customers + Website Visitors + Employees + Support Contacts = 5 data rows
    const dataRows = result.split("\n").filter((l) => l.startsWith("| **"));
    assert.equal(dataRows.length, 5);
  });

  it("table rows count for analytics-only is 2", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateDataSubjectCategories(scan)!;
    // Website Visitors + Support Contacts
    const dataRows = result.split("\n").filter((l) => l.startsWith("| **"));
    assert.equal(dataRows.length, 2);
  });

  it("table rows count for payment-only is 3", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectCategories(scan)!;
    // End Users + Paying Customers + Support Contacts
    const dataRows = result.split("\n").filter((l) => l.startsWith("| **"));
    assert.equal(dataRows.length, 3);
  });
});
