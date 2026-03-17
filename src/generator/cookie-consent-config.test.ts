import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateCookieConsentConfig } from "./cookie-consent-config.js";
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

function parseResult(result: string | null): Record<string, unknown> {
  assert.ok(result !== null);
  return JSON.parse(result);
}

describe("generateCookieConsentConfig", () => {
  // ── Null guards ──────────────────────────────────────────────────────

  it("returns null when no services detected", () => {
    const result = generateCookieConsentConfig(makeScan());
    assert.strictEqual(result, null);
  });

  it("returns null when services have no analytics/advertising/auth", () => {
    const scan = makeScan({ services: [makeService("prisma", "database")] });
    const result = generateCookieConsentConfig(scan);
    assert.strictEqual(result, null);
  });

  it("returns null when only storage services present", () => {
    const scan = makeScan({ services: [makeService("@aws-sdk/client-s3", "storage")] });
    const result = generateCookieConsentConfig(scan);
    assert.strictEqual(result, null);
  });

  it("returns null when only email services present", () => {
    const scan = makeScan({ services: [makeService("resend", "email")] });
    const result = generateCookieConsentConfig(scan);
    assert.strictEqual(result, null);
  });

  it("returns null when only monitoring services present", () => {
    const scan = makeScan({ services: [makeService("@sentry/node", "monitoring")] });
    const result = generateCookieConsentConfig(scan);
    assert.strictEqual(result, null);
  });

  // ── Basic generation ──────────────────────────────────────────────────

  it("generates valid JSON for analytics services", () => {
    const scan = makeScan({ services: [makeService("Google Analytics", "analytics")] });
    const result = generateCookieConsentConfig(scan);
    assert.ok(result !== null);
    const parsed = JSON.parse(result);
    assert.ok(typeof parsed === "object");
  });

  it("generates valid JSON for auth services", () => {
    const scan = makeScan({ services: [makeService("@clerk/nextjs", "auth")] });
    const result = generateCookieConsentConfig(scan);
    assert.ok(result !== null);
  });

  it("ends with a newline", () => {
    const scan = makeScan({ services: [makeService("Google Analytics", "analytics")] });
    const result = generateCookieConsentConfig(scan)!;
    assert.ok(result.endsWith("\n"));
  });

  // ── Top-level fields ─────────────────────────────────────────────────

  it("includes version 1.0.0", () => {
    const scan = makeScan({ services: [makeService("Google Analytics", "analytics")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    assert.strictEqual(config.version, "1.0.0");
  });

  it("includes generated_at as ISO timestamp", () => {
    const scan = makeScan({ services: [makeService("Google Analytics", "analytics")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    assert.ok(typeof config.generated_at === "string");
    assert.ok(/\d{4}-\d{2}-\d{2}T/.test(config.generated_at as string));
  });

  it("includes project name from scan", () => {
    const scan = makeScan({
      projectName: "my-app",
      services: [makeService("Google Analytics", "analytics")],
    });
    const config = parseResult(generateCookieConsentConfig(scan));
    assert.strictEqual(config.project, "my-app");
  });

  // ── Context values ────────────────────────────────────────────────────

  it("uses company name from context", () => {
    const scan = makeScan({ services: [makeService("Google Analytics", "analytics")] });
    const config = parseResult(generateCookieConsentConfig(scan, makeCtx({ companyName: "TestCo" })));
    assert.strictEqual(config.company, "TestCo");
  });

  it("uses default placeholder when no context provided", () => {
    const scan = makeScan({ services: [makeService("Google Analytics", "analytics")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    assert.strictEqual(config.company, "[Your Company Name]");
  });

  // ── Consent settings ─────────────────────────────────────────────────

  it("requires explicit consent", () => {
    const scan = makeScan({ services: [makeService("Google Analytics", "analytics")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    const settings = config.consent_settings as Record<string, unknown>;
    assert.strictEqual(settings.require_explicit_consent, true);
  });

  it("shows on first visit", () => {
    const scan = makeScan({ services: [makeService("Google Analytics", "analytics")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    const settings = config.consent_settings as Record<string, unknown>;
    assert.strictEqual(settings.show_on_first_visit, true);
  });

  it("respects DNT header", () => {
    const scan = makeScan({ services: [makeService("Google Analytics", "analytics")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    const settings = config.consent_settings as Record<string, unknown>;
    assert.strictEqual(settings.respect_dnt, true);
  });

  it("uses cookie_consent as cookie name", () => {
    const scan = makeScan({ services: [makeService("Google Analytics", "analytics")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    const settings = config.consent_settings as Record<string, unknown>;
    assert.strictEqual(settings.cookie_name, "cookie_consent");
  });

  it("sets cookie duration to 365 days", () => {
    const scan = makeScan({ services: [makeService("Google Analytics", "analytics")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    const settings = config.consent_settings as Record<string, unknown>;
    assert.strictEqual(settings.cookie_duration_days, 365);
  });

  it("positions banner at bottom", () => {
    const scan = makeScan({ services: [makeService("Google Analytics", "analytics")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    const settings = config.consent_settings as Record<string, unknown>;
    assert.strictEqual(settings.position, "bottom");
  });

  // ── Cookie categories ────────────────────────────────────────────────

  it("always includes 4 categories", () => {
    const scan = makeScan({ services: [makeService("Google Analytics", "analytics")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    const categories = config.categories as Record<string, unknown>[];
    assert.strictEqual(categories.length, 4);
  });

  it("strictly_necessary category is required and enabled", () => {
    const scan = makeScan({ services: [makeService("Google Analytics", "analytics")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    const categories = config.categories as Record<string, unknown>[];
    const necessary = categories.find((c) => c.id === "strictly_necessary");
    assert.ok(necessary);
    assert.strictEqual(necessary!.required, true);
    assert.strictEqual(necessary!.default_state, "enabled");
  });

  it("functional category defaults to disabled", () => {
    const scan = makeScan({ services: [makeService("Google Analytics", "analytics")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    const categories = config.categories as Record<string, unknown>[];
    const functional = categories.find((c) => c.id === "functional");
    assert.ok(functional);
    assert.strictEqual(functional!.required, false);
    assert.strictEqual(functional!.default_state, "disabled");
  });

  it("analytics category defaults to disabled", () => {
    const scan = makeScan({ services: [makeService("Google Analytics", "analytics")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    const categories = config.categories as Record<string, unknown>[];
    const analytics = categories.find((c) => c.id === "analytics");
    assert.ok(analytics);
    assert.strictEqual(analytics!.required, false);
    assert.strictEqual(analytics!.default_state, "disabled");
  });

  it("advertising category defaults to disabled", () => {
    const scan = makeScan({ services: [makeService("Google Analytics", "analytics")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    const categories = config.categories as Record<string, unknown>[];
    const advertising = categories.find((c) => c.id === "advertising");
    assert.ok(advertising);
    assert.strictEqual(advertising!.required, false);
    assert.strictEqual(advertising!.default_state, "disabled");
  });

  // ── Provider mapping ─────────────────────────────────────────────────

  it("maps Google Analytics to analytics provider", () => {
    const scan = makeScan({ services: [makeService("Google Analytics", "analytics")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    const providers = config.providers as Record<string, unknown>[];
    const ga = providers.find((p) => p.name === "Google Analytics");
    assert.ok(ga);
    assert.strictEqual(ga!.provider, "Google LLC");
    assert.strictEqual(ga!.category_id, "analytics");
    const cookies = ga!.cookies as string[];
    assert.ok(cookies.includes("_ga"));
  });

  it("maps posthog to PostHog provider", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    const providers = config.providers as Record<string, unknown>[];
    const ph = providers.find((p) => p.name === "posthog");
    assert.ok(ph);
    assert.strictEqual(ph!.provider, "PostHog Inc");
  });

  it("maps mixpanel to Mixpanel provider", () => {
    const scan = makeScan({ services: [makeService("mixpanel", "analytics")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    const providers = config.providers as Record<string, unknown>[];
    const mp = providers.find((p) => p.name === "mixpanel");
    assert.ok(mp);
    assert.strictEqual(mp!.provider, "Mixpanel Inc");
  });

  it("maps Meta Pixel to advertising provider", () => {
    const scan = makeScan({ services: [makeService("Meta Pixel", "advertising")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    const providers = config.providers as Record<string, unknown>[];
    const fb = providers.find((p) => p.name === "Meta Pixel");
    assert.ok(fb);
    assert.strictEqual(fb!.category_id, "advertising");
    assert.strictEqual(fb!.provider, "Meta Platforms Inc");
  });

  it("maps Google Ads to advertising provider", () => {
    const scan = makeScan({ services: [makeService("Google Ads", "advertising")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    const providers = config.providers as Record<string, unknown>[];
    const gads = providers.find((p) => p.name === "Google Ads");
    assert.ok(gads);
    assert.strictEqual(gads!.category_id, "advertising");
  });

  it("maps @sentry/browser to functional provider", () => {
    const scan = makeScan({
      services: [
        makeService("@sentry/browser", "analytics"),
      ],
    });
    const config = parseResult(generateCookieConsentConfig(scan));
    const providers = config.providers as Record<string, unknown>[];
    const sentry = providers.find((p) => p.name === "@sentry/browser");
    assert.ok(sentry);
    assert.strictEqual(sentry!.category_id, "functional");
  });

  it("maps stripe to strictly_necessary provider", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "analytics"),
      ],
    });
    const config = parseResult(generateCookieConsentConfig(scan));
    const providers = config.providers as Record<string, unknown>[];
    const s = providers.find((p) => p.name === "stripe");
    assert.ok(s);
    assert.strictEqual(s!.category_id, "strictly_necessary");
  });

  it("maps hotjar to analytics provider", () => {
    const scan = makeScan({ services: [makeService("hotjar", "analytics")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    const providers = config.providers as Record<string, unknown>[];
    const hj = providers.find((p) => p.name === "hotjar");
    assert.ok(hj);
    assert.strictEqual(hj!.provider, "Hotjar Ltd");
  });

  it("includes privacy policy URLs for known providers", () => {
    const scan = makeScan({ services: [makeService("Google Analytics", "analytics")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    const providers = config.providers as Record<string, unknown>[];
    const ga = providers.find((p) => p.name === "Google Analytics");
    assert.strictEqual(ga!.privacy_policy_url, "https://policies.google.com/privacy");
  });

  // ── Auth services as strictly necessary ───────────────────────────────

  it("adds auth services as strictly necessary providers", () => {
    const scan = makeScan({ services: [makeService("@clerk/nextjs", "auth")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    const providers = config.providers as Record<string, unknown>[];
    const clerk = providers.find((p) => p.name === "@clerk/nextjs");
    assert.ok(clerk);
    assert.strictEqual(clerk!.category_id, "strictly_necessary");
    assert.strictEqual(clerk!.purpose, "Authentication and session management");
  });

  it("generates session cookie name for auth services", () => {
    const scan = makeScan({ services: [makeService("@clerk/nextjs", "auth")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    const providers = config.providers as Record<string, unknown>[];
    const clerk = providers.find((p) => p.name === "@clerk/nextjs");
    const cookies = clerk!.cookies as string[];
    assert.ok(cookies.length > 0);
    assert.ok(cookies[0].includes("session"));
  });

  it("does not duplicate provider if already mapped", () => {
    // stripe is in PROVIDER_MAP and could also match auth
    const scan = makeScan({
      services: [
        makeService("stripe", "analytics"),
        makeService("@clerk/nextjs", "auth"),
      ],
    });
    const config = parseResult(generateCookieConsentConfig(scan));
    const providers = config.providers as Record<string, unknown>[];
    const stripeEntries = providers.filter((p) => p.name === "stripe");
    assert.strictEqual(stripeEntries.length, 1);
  });

  // ── CMP integration ──────────────────────────────────────────────────

  it("includes OneTrust category mapping", () => {
    const scan = makeScan({ services: [makeService("Google Analytics", "analytics")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    const cmp = config.cmp_integration as Record<string, Record<string, Record<string, string>>>;
    assert.strictEqual(cmp.onetrust.category_mapping.strictly_necessary, "C0001");
    assert.strictEqual(cmp.onetrust.category_mapping.functional, "C0003");
    assert.strictEqual(cmp.onetrust.category_mapping.analytics, "C0002");
    assert.strictEqual(cmp.onetrust.category_mapping.advertising, "C0004");
  });

  it("includes CookieYes category mapping", () => {
    const scan = makeScan({ services: [makeService("Google Analytics", "analytics")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    const cmp = config.cmp_integration as Record<string, Record<string, Record<string, string>>>;
    assert.strictEqual(cmp.cookieyes.category_mapping.strictly_necessary, "necessary");
    assert.strictEqual(cmp.cookieyes.category_mapping.advertising, "advertisement");
  });

  it("includes Cookiebot category mapping", () => {
    const scan = makeScan({ services: [makeService("Google Analytics", "analytics")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    const cmp = config.cmp_integration as Record<string, Record<string, Record<string, string>>>;
    assert.strictEqual(cmp.cookiebot.category_mapping.strictly_necessary, "necessary");
    assert.strictEqual(cmp.cookiebot.category_mapping.functional, "preferences");
    assert.strictEqual(cmp.cookiebot.category_mapping.analytics, "statistics");
    assert.strictEqual(cmp.cookiebot.category_mapping.advertising, "marketing");
  });

  // ── Comprehensive scenario ────────────────────────────────────────────

  it("handles comprehensive service set with analytics, advertising, and auth", () => {
    const scan = makeScan({
      projectName: "enterprise-app",
      services: [
        makeService("Google Analytics", "analytics"),
        makeService("posthog", "analytics"),
        makeService("Meta Pixel", "advertising"),
        makeService("Google Ads", "advertising"),
        makeService("@sentry/browser", "analytics"),
        makeService("Intercom", "analytics"),
        makeService("@clerk/nextjs", "auth"),
        makeService("stripe", "analytics"),
      ],
    });
    const ctx = makeCtx({ companyName: "Enterprise Inc" });
    const config = parseResult(generateCookieConsentConfig(scan, ctx));

    assert.strictEqual(config.company, "Enterprise Inc");
    assert.strictEqual(config.project, "enterprise-app");

    const providers = config.providers as Record<string, unknown>[];
    // All 8 services should map: GA, posthog, Meta Pixel, Google Ads, sentry/browser, Intercom, clerk, stripe
    assert.strictEqual(providers.length, 8);

    const categories = config.categories as Record<string, unknown>[];
    assert.strictEqual(categories.length, 4);

    // Verify CMP integration is present
    const cmp = config.cmp_integration as Record<string, unknown>;
    assert.ok(cmp.onetrust);
    assert.ok(cmp.cookieyes);
    assert.ok(cmp.cookiebot);
  });

  it("generates for advertising-only service set", () => {
    const scan = makeScan({ services: [makeService("Meta Pixel", "advertising")] });
    const config = parseResult(generateCookieConsentConfig(scan));
    const providers = config.providers as Record<string, unknown>[];
    assert.strictEqual(providers.length, 1);
    assert.strictEqual(providers[0].name, "Meta Pixel");
  });
});
