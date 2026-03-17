import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateCookiePolicy } from "./cookie-policy.js";
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

describe("generateCookiePolicy", () => {
  it("returns null when no analytics or auth services detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateCookiePolicy(scan);
    assert.strictEqual(result, null);
  });

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    const result = generateCookiePolicy(scan);
    assert.strictEqual(result, null);
  });

  it("returns null with only database and email services", () => {
    const scan = makeScan({
      services: [
        makeService("prisma", "database", ["user data"]),
        makeService("@sendgrid/mail", "email", ["email address"]),
      ],
    });
    const result = generateCookiePolicy(scan);
    assert.strictEqual(result, null);
  });

  it("generates cookie policy when analytics services detected", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views", "user behavior"])],
    });
    const result = generateCookiePolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Cookie Policy") || result.includes("cookie"));
    assert.ok(result.includes("test-project"));
  });

  it("generates cookie policy when auth services detected", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email", "session data"])],
    });
    const result = generateCookiePolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Cookie") || result.includes("cookie"));
  });

  it("includes what-are-cookies explanation section", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generateCookiePolicy(scan)!;
    assert.ok(result.includes("What") || result.includes("cookie"));
  });

  it("includes legal basis section", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generateCookiePolicy(scan)!;
    assert.ok(result.includes("Legal Basis") || result.includes("legal basis") || result.includes("Strictly Necessary") || result.includes("strictly necessary"));
  });

  it("includes consent section", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generateCookiePolicy(scan)!;
    assert.ok(result.includes("Consent") || result.includes("consent"));
  });

  it("includes strictly necessary cookies with CSRF token", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generateCookiePolicy(scan)!;
    assert.ok(result.includes("CSRF") || result.includes("csrf"));
  });

  it("includes session and auth cookies when auth services present", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email", "session data"])],
    });
    const result = generateCookiePolicy(scan)!;
    assert.ok(result.includes("session") || result.includes("Session"));
    assert.ok(result.includes("auth") || result.includes("Auth"));
  });

  it("includes analytics cookies table for specific providers", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views", "user behavior"])],
    });
    const result = generateCookiePolicy(scan)!;
    assert.ok(result.includes("posthog"));
    assert.ok(result.includes("ph_") || result.includes("distinct_id"));
    assert.ok(result.includes("1 year") || result.includes("year"));
  });

  it("includes Google Analytics cookie details", () => {
    const scan = makeScan({
      services: [makeService("@google-analytics/data", "analytics", ["page views"])],
    });
    const result = generateCookiePolicy(scan)!;
    assert.ok(result.includes("@google-analytics/data"));
    assert.ok(result.includes("_ga"));
    assert.ok(result.includes("2 years") || result.includes("year"));
  });

  it("includes Mixpanel cookie details", () => {
    const scan = makeScan({
      services: [makeService("mixpanel", "analytics", ["user behavior"])],
    });
    const result = generateCookiePolicy(scan)!;
    assert.ok(result.includes("mixpanel"));
    assert.ok(result.includes("mp_"));
  });

  it("includes opt-out URLs for supported providers", () => {
    const scan = makeScan({
      services: [
        makeService("@google-analytics/data", "analytics", ["page views"]),
        makeService("mixpanel", "analytics", ["user behavior"]),
      ],
    });
    const result = generateCookiePolicy(scan)!;
    assert.ok(result.includes("tools.google.com/dlpage/gaoptout"));
    assert.ok(result.includes("mixpanel.com/optout"));
  });

  it("includes managing cookies section", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generateCookiePolicy(scan)!;
    assert.ok(result.includes("Manag") || result.includes("manag") || result.includes("browser"));
  });

  it("includes third-party cookies section listing services", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics", ["page views", "user behavior"]),
        makeService("next-auth", "auth", ["email", "session data"]),
      ],
    });
    const result = generateCookiePolicy(scan)!;
    assert.ok(result.includes("Third") || result.includes("third"));
    assert.ok(result.includes("posthog"));
    assert.ok(result.includes("next-auth"));
  });

  it("includes GPC (Global Privacy Control) section", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generateCookiePolicy(scan)!;
    assert.ok(result.includes("GPC") || result.includes("Global Privacy Control") || result.includes("Do Not Track"));
  });

  it("includes updates and contact sections", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generateCookiePolicy(scan)!;
    assert.ok(result.includes("Update") || result.includes("update") || result.includes("Changes"));
    assert.ok(result.includes("Contact") || result.includes("contact"));
  });

  it("uses context company name and email", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "privacy@acme.com" };
    const result = generateCookiePolicy(scan, ctx)!;
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("uses placeholder email when no context provided", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generateCookiePolicy(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generateCookiePolicy(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("handles multiple analytics services", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics", ["page views", "user behavior"]),
        makeService("@google-analytics/data", "analytics", ["page views"]),
        makeService("mixpanel", "analytics", ["events", "user profiles"]),
      ],
    });
    const result = generateCookiePolicy(scan)!;
    assert.ok(result.includes("posthog"));
    assert.ok(result.includes("@google-analytics/data"));
    assert.ok(result.includes("mixpanel"));
  });

  it("handles advertising services same as analytics", () => {
    const scan = makeScan({
      services: [makeService("google-ads", "advertising", ["ad clicks", "impressions"])],
    });
    const result = generateCookiePolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("google-ads"));
  });

  it("handles combined analytics and auth services", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics", ["page views"]),
        makeService("@clerk/nextjs", "auth", ["email", "session data"]),
        makeService("@google-analytics/data", "analytics", ["page views"]),
      ],
    });
    const result = generateCookiePolicy(scan)!;

    // Should have all services mentioned
    assert.ok(result.includes("posthog"));
    assert.ok(result.includes("@clerk/nextjs"));
    assert.ok(result.includes("@google-analytics/data"));

    // Should have session cookies (auth present)
    assert.ok(result.includes("session") || result.includes("Session"));

    // Should have analytics cookies table
    assert.ok(result.includes("ph_") || result.includes("distinct_id"));
    assert.ok(result.includes("_ga"));
  });

  it("numbers sections sequentially", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics", ["page views"]),
        makeService("next-auth", "auth", ["email"]),
      ],
    });
    const result = generateCookiePolicy(scan)!;
    const lines = result.split("\n");
    const sectionNums = lines
      .filter((l) => /^##\s+\d+\./.test(l))
      .map((l) => {
        const match = l.match(/^##\s+(\d+)\./);
        return match ? parseInt(match[1], 10) : 0;
      });

    for (let i = 0; i < sectionNums.length; i++) {
      assert.strictEqual(sectionNums[i], i + 1, `Section ${i + 1} should be numbered ${i + 1}, got ${sectionNums[i]}`);
    }
  });
});
