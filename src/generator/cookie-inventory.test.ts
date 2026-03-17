import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateCookieInventory } from "./cookie-inventory.js";

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

describe("generateCookieInventory", () => {
  it("returns null when no analytics or auth services detected", () => {
    const scan = makeScan();
    const result = generateCookieInventory(scan);
    assert.strictEqual(result, null);
  });

  it("returns null when only non-cookie services detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment"), makeService("aws-s3", "storage")],
    });
    const result = generateCookieInventory(scan);
    assert.strictEqual(result, null);
  });

  it("generates inventory when auth service is detected", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateCookieInventory(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Cookie Inventory"));
  });

  it("generates inventory when analytics service is detected", () => {
    const scan = makeScan({
      services: [makeService("Google Analytics", "analytics")],
    });
    const result = generateCookieInventory(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Cookie Inventory"));
  });

  it("generates inventory when advertising service is detected", () => {
    const scan = makeScan({
      services: [makeService("Meta Pixel", "advertising")],
    });
    const result = generateCookieInventory(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Cookie Inventory"));
  });

  it("uses default placeholders when no context provided", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses context values when provided", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateCookieInventory(scan, {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
    })!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("privacy@acme.com"));
    assert.ok(!result.includes("[Your Company Name]"));
  });

  it("includes date and project name in header", () => {
    const scan = makeScan({
      projectName: "my-app",
      services: [makeService("next-auth", "auth")],
    });
    const result = generateCookieInventory(scan)!;
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(`**Last updated:** ${today}`));
    assert.ok(result.includes("**Project:** my-app"));
  });

  it("includes ePrivacy Directive reference in intro", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("ePrivacy Directive"));
    assert.ok(result.includes("2002/58/EC"));
  });

  it("includes summary table with category counts", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("Google Analytics", "analytics"),
      ],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("## Summary"));
    assert.ok(result.includes("| Strictly Necessary |"));
    assert.ok(result.includes("| Analytics |"));
    assert.ok(result.includes("| **Total** |"));
  });

  it("includes strictly necessary cookies for auth services", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("## Strictly Necessary Cookies"));
    assert.ok(result.includes("session_id / connect.sid"));
    assert.ok(result.includes("auth_token / jwt"));
    assert.ok(result.includes("csrf_token / XSRF-TOKEN"));
    assert.ok(result.includes("Article 5(3)"));
  });

  it("includes auth provider-specific cookies for next-auth", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("next-auth.session-token"));
    assert.ok(result.includes("next-auth.csrf-token"));
    assert.ok(result.includes("next-auth.callback-url"));
  });

  it("includes auth provider-specific cookies for clerk", () => {
    const scan = makeScan({
      services: [makeService("@clerk/nextjs", "auth")],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("__session"));
    assert.ok(result.includes("__client_uat"));
    assert.ok(result.includes("Clerk Inc"));
  });

  it("includes auth provider-specific cookies for supabase", () => {
    const scan = makeScan({
      services: [makeService("@supabase/supabase-js", "auth")],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("sb-*-auth-token"));
    assert.ok(result.includes("Supabase Inc"));
  });

  it("includes Google Analytics cookies", () => {
    const scan = makeScan({
      services: [makeService("Google Analytics", "analytics")],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("## Analytics Cookies"));
    assert.ok(result.includes("_ga"));
    assert.ok(result.includes("_gid"));
    assert.ok(result.includes("_gat"));
    assert.ok(result.includes("Google LLC"));
  });

  it("includes PostHog cookies", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("ph_*"));
    assert.ok(result.includes("distinct_id"));
    assert.ok(result.includes("PostHog Inc"));
  });

  it("includes Mixpanel cookies", () => {
    const scan = makeScan({
      services: [makeService("mixpanel", "analytics")],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("mp_*"));
    assert.ok(result.includes("mp_optout"));
    assert.ok(result.includes("Mixpanel Inc"));
  });

  it("includes Meta Pixel advertising cookies", () => {
    const scan = makeScan({
      services: [makeService("Meta Pixel", "advertising")],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("## Advertising Cookies"));
    assert.ok(result.includes("_fbp"));
    assert.ok(result.includes("_fbc"));
    assert.ok(result.includes("Meta Platforms Inc"));
  });

  it("includes TikTok Pixel advertising cookies", () => {
    const scan = makeScan({
      services: [makeService("TikTok Pixel", "advertising")],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("_ttp"));
    assert.ok(result.includes("ByteDance Ltd"));
  });

  it("includes LinkedIn Insight Tag cookies", () => {
    const scan = makeScan({
      services: [makeService("LinkedIn Insight Tag", "advertising")],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("li_*"));
    assert.ok(result.includes("bcookie"));
    assert.ok(result.includes("LinkedIn Corporation"));
  });

  it("does not include advertising section when no advertising services", () => {
    const scan = makeScan({
      services: [makeService("Google Analytics", "analytics")],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(!result.includes("## Advertising Cookies"));
  });

  it("includes detected services section", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("Google Analytics", "analytics"),
      ],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("## Detected Services"));
    assert.ok(result.includes("### Authentication Services"));
    assert.ok(result.includes("**next-auth**"));
    assert.ok(result.includes("### Analytics & Advertising Services"));
    assert.ok(result.includes("**Google Analytics**"));
  });

  it("includes evidence file references in detected services", () => {
    const scan = makeScan({
      services: [
        {
          name: "Google Analytics",
          category: "analytics" as const,
          evidence: [
            { type: "dependency" as const, file: "package.json", detail: "ga detected" },
            { type: "import" as const, file: "src/analytics.ts", detail: "import ga" },
          ],
          dataCollected: ["page views"],
        },
      ],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("`package.json`"));
    assert.ok(result.includes("`src/analytics.ts`"));
  });

  it("includes legal requirements section", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("## Legal Requirements"));
    assert.ok(result.includes("### ePrivacy Directive (EU)"));
    assert.ok(result.includes("### GDPR (EU)"));
    assert.ok(result.includes("### CCPA/CPRA (California)"));
    assert.ok(result.includes("Article 6(1)(a)"));
    assert.ok(result.includes("Global Privacy Control"));
  });

  it("includes inventory maintenance section", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("## Inventory Maintenance"));
    assert.ok(result.includes("quarterly"));
  });

  it("includes Codepliant disclaimer footer", () => {
    const scan = makeScan({
      projectName: "cool-app",
      services: [makeService("next-auth", "auth")],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("cool-app"));
    assert.ok(result.includes("reviewed by your legal team"));
  });

  it("combines auth and analytics cookies in one inventory", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("Google Analytics", "analytics"),
        makeService("Meta Pixel", "advertising"),
      ],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("## Strictly Necessary Cookies"));
    assert.ok(result.includes("## Analytics Cookies"));
    assert.ok(result.includes("## Advertising Cookies"));
    // Total count should include all cookies
    assert.ok(result.includes("**Total**"));
  });

  it("shows consent required status correctly in summary", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("Google Analytics", "analytics"),
      ],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("No (exempt under ePrivacy Directive Art. 5(3))"));
    assert.ok(result.includes("| Analytics |"));
    assert.ok(result.includes("| Yes |"));
  });

  it("includes advertising consent in summary when advertising services present", () => {
    const scan = makeScan({
      services: [makeService("Meta Pixel", "advertising")],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("| Advertising |"));
  });

  it("excludes functional section when no functional cookies", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(!result.includes("## Functional Cookies"));
  });

  it("excludes performance section when no performance cookies", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(!result.includes("## Performance Cookies"));
  });

  it("handles cookie-free analytics services", () => {
    const scan = makeScan({
      services: [makeService("Plausible Analytics", "analytics")],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("(none)"));
    assert.ok(result.includes("cookie-free"));
  });

  it("handles Segment analytics cookies", () => {
    const scan = makeScan({
      services: [makeService("@segment/analytics-next", "analytics")],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("ajs_anonymous_id"));
    assert.ok(result.includes("ajs_user_id"));
    assert.ok(result.includes("Twilio Segment"));
  });

  it("handles Hotjar analytics cookies", () => {
    const scan = makeScan({
      services: [makeService("hotjar", "analytics")],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("_hj*"));
    assert.ok(result.includes("Hotjar Ltd"));
  });

  it("handles Microsoft Clarity cookies", () => {
    const scan = makeScan({
      services: [makeService("Microsoft Clarity", "analytics")],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("_clck"));
    assert.ok(result.includes("_clsk"));
    assert.ok(result.includes("Microsoft Corporation"));
  });

  it("handles better-auth provider cookies", () => {
    const scan = makeScan({
      services: [makeService("better-auth", "auth")],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("better-auth.session_token"));
  });

  it("handles @auth/core provider cookies", () => {
    const scan = makeScan({
      services: [makeService("@auth/core", "auth")],
    });
    const result = generateCookieInventory(scan)!;
    assert.ok(result.includes("authjs.session-token"));
    assert.ok(result.includes("authjs.csrf-token"));
  });
});
