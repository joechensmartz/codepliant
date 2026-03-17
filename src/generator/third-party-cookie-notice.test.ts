import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateThirdPartyCookieNotice } from "./third-party-cookie-notice.js";
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

function makeCtx(overrides: Partial<GeneratorContext> = {}): GeneratorContext {
  return {
    companyName: "Acme Corp",
    contactEmail: "legal@acme.com",
    ...overrides,
  };
}

describe("generateThirdPartyCookieNotice", () => {
  // ── Null guards ──────────────────────────────────────────────────

  it("returns null when no services detected", () => {
    const result = generateThirdPartyCookieNotice(makeScan());
    assert.strictEqual(result, null);
  });

  it("returns null when services have no known cookie providers", () => {
    const scan = makeScan({ services: [makeService("some-unknown-lib", "other")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.strictEqual(result, null);
  });

  it("returns null for database-only services", () => {
    const scan = makeScan({ services: [makeService("prisma", "database")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.strictEqual(result, null);
  });

  // ── Basic generation ─────────────────────────────────────────────

  it("generates document when known analytics provider detected", () => {
    const scan = makeScan({ services: [makeService("Google Analytics", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(typeof result === "string");
    assert.ok(result.includes("# Third-Party Cookie Notice"));
  });

  it("generates document for posthog", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result !== null);
    assert.ok(result!.includes("PostHog"));
  });

  it("generates document for auth providers", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result !== null);
    assert.ok(result!.includes("NextAuth.js"));
  });

  it("includes date in ISO format", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result!));
  });

  it("includes project name", () => {
    const scan = makeScan({ projectName: "my-saas", services: [makeService("posthog", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("my-saas"));
  });

  // ── Context values ───────────────────────────────────────────────

  it("uses company name from context", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan, makeCtx({ companyName: "TestCo" }));
    assert.ok(result!.includes("TestCo"));
  });

  it("uses default company placeholder when no context", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("[Your Company Name]"));
  });

  it("uses contact email from context", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan, makeCtx({ contactEmail: "privacy@testco.com" }));
    assert.ok(result!.includes("privacy@testco.com"));
  });

  it("uses default email placeholder when no context", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("[your-email@example.com]"));
  });

  // ── Provider Summary table ───────────────────────────────────────

  it("includes Provider Summary section", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("## Provider Summary"));
  });

  it("includes summary table headers", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("| Provider | Cookies | Category | Opt-Out Available |"));
  });

  // ── ePrivacy and GDPR references ────────────────────────────────

  it("references ePrivacy Directive", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("ePrivacy Directive"));
  });

  it("references GDPR Article 6(1)(a)", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("GDPR"));
    assert.ok(result!.includes("Art. 6(1)(a)"));
  });

  // ── Per-provider details: Google Analytics ───────────────────────

  it("shows Google Analytics cookies", () => {
    const scan = makeScan({ services: [makeService("Google Analytics", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("Google LLC"));
    assert.ok(result!.includes("`_ga`"));
    assert.ok(result!.includes("`_gid`"));
    assert.ok(result!.includes("`_gat`"));
  });

  it("shows Google Analytics opt-out URL", () => {
    const scan = makeScan({ services: [makeService("Google Analytics", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("tools.google.com/dlpage/gaoptout"));
  });

  // ── Per-provider details: PostHog ────────────────────────────────

  it("shows PostHog cookies", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("PostHog Inc"));
    assert.ok(result!.includes("`ph_*`"));
    assert.ok(result!.includes("`distinct_id`"));
  });

  // ── Per-provider details: Mixpanel ───────────────────────────────

  it("shows Mixpanel cookies", () => {
    const scan = makeScan({ services: [makeService("mixpanel", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("Mixpanel Inc"));
    assert.ok(result!.includes("`mp_*`"));
  });

  // ── Per-provider details: Hotjar ─────────────────────────────────

  it("shows Hotjar cookies", () => {
    const scan = makeScan({ services: [makeService("hotjar", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("Hotjar Ltd"));
    assert.ok(result!.includes("`_hj*`"));
  });

  // ── Per-provider details: Meta Pixel ─────────────────────────────

  it("shows Meta Pixel cookies", () => {
    const scan = makeScan({ services: [makeService("Meta Pixel", "advertising")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("Meta Platforms Inc"));
    assert.ok(result!.includes("`_fbp`"));
    assert.ok(result!.includes("`fr`"));
  });

  // ── Per-provider details: Clerk ──────────────────────────────────

  it("shows Clerk cookies", () => {
    const scan = makeScan({ services: [makeService("@clerk/nextjs", "auth")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("Clerk Inc"));
    assert.ok(result!.includes("`__session`"));
  });

  // ── Per-provider details: Supabase ───────────────────────────────

  it("shows Supabase cookies", () => {
    const scan = makeScan({ services: [makeService("@supabase/supabase-js", "auth")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("Supabase Inc"));
    assert.ok(result!.includes("`sb-*-auth-token`"));
  });

  // ── Provider deduplication ───────────────────────────────────────

  it("deduplicates providers with same provider name", () => {
    const scan = makeScan({
      services: [
        makeService("Google Analytics", "analytics"),
        makeService("@google-analytics/data", "analytics"),
      ],
    });
    const result = generateThirdPartyCookieNotice(scan);
    // Should only show "Google LLC" section once
    const googleMatches = result!.match(/## Google LLC/g);
    assert.ok(googleMatches !== null);
    assert.strictEqual(googleMatches!.length, 1);
  });

  // ── Category classification ──────────────────────────────────────

  it("categorizes advertising providers correctly", () => {
    const scan = makeScan({ services: [makeService("Meta Pixel", "advertising")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("Advertising"));
  });

  it("categorizes analytics providers correctly", () => {
    const scan = makeScan({ services: [makeService("hotjar", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("Analytics"));
  });

  it("categorizes auth providers correctly", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("Authentication"));
  });

  // ── Cookies Set section ──────────────────────────────────────────

  it("includes Cookies Set subsection per provider", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("### Cookies Set"));
    assert.ok(result!.includes("| Cookie Name | Purpose | Duration |"));
  });

  // ── How to Opt Out section ───────────────────────────────────────

  it("includes opt-out instructions for third-party providers", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("### How to Opt Out"));
    assert.ok(result!.includes("Visit the opt-out page"));
    assert.ok(result!.includes("Global Privacy Control"));
  });

  it("shows first-party auth message for auth services", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("first-party authentication service"));
    assert.ok(result!.includes("strictly necessary"));
  });

  // ── Your Rights section ──────────────────────────────────────────

  it("includes Your Rights section", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("## Your Rights"));
    assert.ok(result!.includes("Withdraw consent"));
    assert.ok(result!.includes("Request deletion"));
    assert.ok(result!.includes("Port"));
  });

  it("includes GDPR Art. 20 reference", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("GDPR Art. 20"));
  });

  // ── Browser-Level Controls ───────────────────────────────────────

  it("includes browser-level cookie controls", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("### Browser-Level Controls"));
    assert.ok(result!.includes("Chrome"));
    assert.ok(result!.includes("Firefox"));
    assert.ok(result!.includes("Safari"));
    assert.ok(result!.includes("Edge"));
  });

  // ── Global Privacy Control ───────────────────────────────────────

  it("includes GPC section", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("### Global Privacy Control (GPC)"));
    assert.ok(result!.includes("honors Global Privacy Control signals"));
  });

  // ── Contact section ──────────────────────────────────────────────

  it("includes Contact section", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("## Contact"));
  });

  // ── Disclaimer ───────────────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("Codepliant"));
  });

  it("includes project name in disclaimer", () => {
    const scan = makeScan({ projectName: "my-saas", services: [makeService("posthog", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("my-saas"));
  });

  it("includes legal review disclaimer", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("reviewed by your legal team"));
  });

  it("mentions static code analysis limitation", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("static code analysis"));
  });

  // ── Multiple providers ───────────────────────────────────────────

  it("handles multiple providers from different categories", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics"),
        makeService("Meta Pixel", "advertising"),
        makeService("@clerk/nextjs", "auth"),
      ],
    });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("PostHog Inc"));
    assert.ok(result!.includes("Meta Platforms Inc"));
    assert.ok(result!.includes("Clerk Inc"));
  });

  // ── Segment provider ─────────────────────────────────────────────

  it("shows Segment cookies", () => {
    const scan = makeScan({ services: [makeService("@segment/analytics-next", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("Twilio Segment"));
    assert.ok(result!.includes("`ajs_anonymous_id`"));
  });

  // ── Amplitude provider ───────────────────────────────────────────

  it("shows Amplitude cookies", () => {
    const scan = makeScan({ services: [makeService("@amplitude/analytics-browser", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("Amplitude Inc"));
    assert.ok(result!.includes("`amp_*`"));
  });

  // ── Microsoft Clarity ────────────────────────────────────────────

  it("shows Microsoft Clarity cookies", () => {
    const scan = makeScan({ services: [makeService("Microsoft Clarity", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("Microsoft Corporation"));
    assert.ok(result!.includes("`_clck`"));
    assert.ok(result!.includes("`_clsk`"));
  });

  // ── Vercel Analytics ─────────────────────────────────────────────

  it("shows Vercel Analytics cookies", () => {
    const scan = makeScan({ services: [makeService("@vercel/analytics", "analytics")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("Vercel Inc"));
    assert.ok(result!.includes("`va_*`"));
  });

  // ── Firebase ─────────────────────────────────────────────────────

  it("shows Firebase cookies", () => {
    const scan = makeScan({ services: [makeService("firebase", "database")] });
    const result = generateThirdPartyCookieNotice(scan);
    assert.ok(result!.includes("Google LLC"));
    assert.ok(result!.includes("`_ga_firebase`"));
  });
});
