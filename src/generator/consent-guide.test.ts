import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateConsentGuide } from "./consent-guide.js";
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

describe("generateConsentGuide", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when no analytics or advertising services detected", () => {
    const scan = makeScan({
      services: [makeService("prisma", "database")],
    });
    assert.strictEqual(generateConsentGuide(scan), null);
  });

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateConsentGuide(scan), null);
  });

  it("returns null with only non-analytics/advertising services", () => {
    const scan = makeScan({
      services: [
        makeService("prisma", "database"),
        makeService("next-auth", "auth"),
        makeService("@sentry/node", "monitoring"),
        makeService("stripe", "payment"),
      ],
    });
    assert.strictEqual(generateConsentGuide(scan), null);
  });

  // ── Generation with analytics/advertising services ────────────────

  it("generates guide when analytics service detected", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generateConsentGuide(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Consent Management Implementation Guide"));
  });

  it("generates guide when advertising service detected", () => {
    const scan = makeScan({
      services: [makeService("google-ads", "advertising", ["ad clicks"])],
    });
    const result = generateConsentGuide(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Consent Management Implementation Guide"));
  });

  it("includes project name", () => {
    const scan = makeScan({
      projectName: "my-app",
      services: [makeService("posthog", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("my-app"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  // ── Context values ────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "privacy@acme.com" };
    const result = generateConsentGuide(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "privacy@acme.com" };
    const result = generateConsentGuide(scan, ctx)!;
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses placeholder email when no context", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  // ── Legal Basis Classification ─────────────────────────────────────

  it("includes Legal Basis Classification section", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views", "clicks", "sessions"])],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("## 1. Legal Basis Classification"));
    assert.ok(result.includes("GDPR Article 6"));
  });

  it("lists analytics services under Consent Required", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views", "clicks", "sessions"])],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("Consent Required"));
    assert.ok(result.includes("posthog"));
    assert.ok(result.includes("Must not load until user consents"));
  });

  it("lists advertising services under Consent Required", () => {
    const scan = makeScan({
      services: [makeService("google-ads", "advertising", ["ad impressions", "clicks"])],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("google-ads"));
    assert.ok(result.includes("advertising"));
  });

  it("lists AI services under Consent Required", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics"),
        makeService("openai", "ai", ["prompts", "responses"]),
      ],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("openai"));
    assert.ok(result.includes("Must not load until user consents"));
  });

  it("lists social services under Consent Required", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics"),
        makeService("facebook-sdk", "social", ["user profile"]),
      ],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("facebook-sdk"));
  });

  it("lists monitoring services under Legitimate Interest", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics"),
        makeService("@sentry/node", "monitoring", ["error traces"]),
      ],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("Legitimate Interest"));
    assert.ok(result.includes("@sentry/node"));
    assert.ok(result.includes("Document in LIA"));
  });

  it("lists email services under Legitimate Interest", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics"),
        makeService("@sendgrid/mail", "email", ["email address"]),
      ],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("@sendgrid/mail"));
    assert.ok(result.includes("provide opt-out"));
  });

  it("shows no legitimate interest message when none detected", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("No services classified under legitimate interest were detected"));
  });

  it("lists auth/payment/database/storage under Contractual Necessity", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics"),
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
        makeService("prisma", "database"),
      ],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("Contractual Necessity"));
    assert.ok(result.includes("next-auth"));
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("prisma"));
    assert.ok(result.includes("Essential for service delivery"));
  });

  it("shows no contractual message when none detected", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("No contractual-basis services were detected"));
  });

  // ── Cookie Consent Banner Requirements ────────────────────────────

  it("includes Cookie Consent Banner Requirements section", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("## 2. Cookie Consent Banner Requirements"));
    assert.ok(result.includes("Block non-essential cookies"));
    assert.ok(result.includes("granular choices"));
    assert.ok(result.includes("reject-all option"));
    assert.ok(result.includes("dark patterns"));
    assert.ok(result.includes("proof of consent"));
  });

  it("includes Strictly Necessary category with contractual services", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics"),
        makeService("next-auth", "auth"),
      ],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("Strictly Necessary"));
    assert.ok(result.includes("Always active"));
    assert.ok(result.includes("next-auth"));
  });

  it("includes Analytics category row when analytics present", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("| Analytics |"));
    assert.ok(result.includes("Off until consented"));
  });

  it("includes Advertising category row when advertising present", () => {
    const scan = makeScan({
      services: [makeService("google-ads", "advertising")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("| Advertising |"));
  });

  it("includes AI Services category row when AI present", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("| AI Services |"));
    assert.ok(result.includes("openai"));
  });

  it("includes Social category row when social present", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics"),
        makeService("facebook-sdk", "social"),
      ],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("| Social |"));
    assert.ok(result.includes("facebook-sdk"));
  });

  it("excludes AI/Social/Advertising rows when not present", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(!result.includes("| AI Services |"));
    assert.ok(!result.includes("| Social |"));
    assert.ok(!result.includes("| Advertising |"));
  });

  it("includes cookie consent banner HTML example", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("cookie-consent"));
    assert.ok(result.includes("acceptAll"));
    assert.ok(result.includes("rejectAll"));
    assert.ok(result.includes("manageConsent"));
  });

  // ── GPC Signal ────────────────────────────────────────────────────

  it("includes Global Privacy Control section", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("## 3. Global Privacy Control"));
    assert.ok(result.includes("navigator.globalPrivacyControl"));
    assert.ok(result.includes("CCPA"));
  });

  // ── Service-Specific Consent Patterns ──────────────────────────────

  it("includes PostHog-specific consent pattern when PostHog detected", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("PostHog — Opt-In / Opt-Out"));
    assert.ok(result.includes("opt_out_capturing_by_default"));
    assert.ok(result.includes("opt_in_capturing"));
  });

  it("includes PostHog pattern for posthog-js name", () => {
    const scan = makeScan({
      services: [makeService("posthog-js", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("PostHog — Opt-In / Opt-Out"));
  });

  it("includes Google Analytics consent pattern when GA detected", () => {
    const scan = makeScan({
      services: [makeService("@google-analytics/data", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("Google Analytics — Consent Mode v2"));
    assert.ok(result.includes("analytics_storage"));
    assert.ok(result.includes("ad_storage"));
  });

  it("includes GA pattern for gtag name", () => {
    const scan = makeScan({
      services: [makeService("gtag", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("Google Analytics — Consent Mode v2"));
  });

  it("excludes PostHog pattern when PostHog not detected", () => {
    const scan = makeScan({
      services: [makeService("mixpanel", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(!result.includes("PostHog — Opt-In / Opt-Out"));
  });

  it("excludes GA pattern when GA not detected", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(!result.includes("Google Analytics — Consent Mode v2"));
  });

  it("includes generic pattern for other analytics services", () => {
    const scan = makeScan({
      services: [makeService("mixpanel", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("Other Analytics Services (mixpanel)"));
    assert.ok(result.includes("loadServiceAfterConsent"));
  });

  it("excludes generic pattern when only PostHog and GA present", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics"),
        makeService("@google-analytics/data", "analytics"),
      ],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(!result.includes("Other Analytics Services"));
  });

  // ── Consent Storage Recommendations ────────────────────────────────

  it("includes Consent Storage Recommendations section", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("Consent Storage Recommendations"));
    assert.ok(result.includes("localStorage"));
    assert.ok(result.includes("First-party cookie"));
    assert.ok(result.includes("Server-side database"));
  });

  it("includes Consent Record Schema", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("Consent Record Schema"));
    assert.ok(result.includes("userId"));
    assert.ok(result.includes("timestamp"));
    assert.ok(result.includes("gpcDetected"));
  });

  it("includes retention guidance (3 years)", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("3 years"));
    assert.ok(result.includes("GDPR Article 7(1)"));
  });

  // ── Consent Withdrawal Process ─────────────────────────────────────

  it("includes Consent Withdrawal Process section", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("Consent Withdrawal Process"));
    assert.ok(result.includes("GDPR Article 7(3)"));
    assert.ok(result.includes("withdrawConsent"));
  });

  it("includes PostHog cleanup in withdrawal when PostHog present", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("PostHog cleanup"));
    assert.ok(result.includes("opt_out_capturing"));
  });

  it("includes GA cleanup in withdrawal when GA present", () => {
    const scan = makeScan({
      services: [makeService("@google-analytics/data", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("Google Analytics cleanup"));
    assert.ok(result.includes("analytics_storage"));
  });

  it("excludes PostHog cleanup when PostHog not present", () => {
    const scan = makeScan({
      services: [makeService("mixpanel", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(!result.includes("PostHog cleanup"));
  });

  it("excludes GA cleanup when GA not present", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(!result.includes("Google Analytics cleanup"));
  });

  // ── Technical Implementation Checklist ─────────────────────────────

  it("includes Technical Implementation Checklist section", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("Technical Implementation Checklist"));
    assert.ok(result.includes("Cookie consent banner loads before any non-essential scripts"));
    assert.ok(result.includes("GPC signal"));
    assert.ok(result.includes("Reject All"));
  });

  it("includes per-service checklist for consent-required services", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("#### posthog (analytics)"));
    assert.ok(result.includes("Script/SDK does not load before consent"));
    assert.ok(result.includes("Consent category mapped: Analytics"));
  });

  it("includes per-service checklist for legitimate interest services", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics"),
        makeService("@sentry/node", "monitoring"),
      ],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("#### @sentry/node (monitoring) — Legitimate Interest"));
    assert.ok(result.includes("Legitimate Interest Assessment"));
    assert.ok(result.includes("User objection mechanism"));
  });

  it("maps AI service category correctly", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("#### openai (ai)"));
    assert.ok(result.includes("Consent category mapped: AI Services"));
  });

  it("maps advertising category correctly", () => {
    const scan = makeScan({
      services: [makeService("google-ads", "advertising", ["ad data"])],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("#### google-ads (advertising)"));
    assert.ok(result.includes("Consent category mapped: Advertising / Marketing"));
  });

  // ── Recommended CMPs ──────────────────────────────────────────────

  it("includes Recommended Consent Management Platforms section", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("Recommended Consent Management Platforms"));
    assert.ok(result.includes("Cookiebot"));
    assert.ok(result.includes("Klaro"));
    assert.ok(result.includes("CookieConsent"));
  });

  // ── Contact and Disclaimer ─────────────────────────────────────────

  it("includes Contact section with email", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const ctx: GeneratorContext = { companyName: "TestCo", contactEmail: "privacy@testco.com" };
    const result = generateConsentGuide(scan, ctx)!;
    assert.ok(result.includes("Contact"));
    assert.ok(result.includes("privacy@testco.com"));
  });

  it("includes Codepliant disclaimer with project name", () => {
    const scan = makeScan({
      projectName: "cool-app",
      services: [makeService("posthog", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("cool-app"));
    assert.ok(result.includes("does not constitute legal advice"));
  });

  // ── Sequential section numbering ──────────────────────────────────

  it("numbers sections sequentially", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateConsentGuide(scan)!;
    assert.ok(result.includes("## 1. Legal Basis Classification"));
    assert.ok(result.includes("## 2. Cookie Consent Banner Requirements"));
    assert.ok(result.includes("## 3. Global Privacy Control"));
    assert.ok(result.includes("## 4. Service-Specific Consent Patterns"));
    assert.ok(result.includes("## 5. Consent Storage Recommendations"));
    assert.ok(result.includes("## 6. Consent Withdrawal Process"));
    assert.ok(result.includes("## 7. Technical Implementation Checklist"));
    assert.ok(result.includes("## 8. Recommended Consent Management Platforms"));
    assert.ok(result.includes("## 9. Contact"));
  });

  // ── Comprehensive service combination ──────────────────────────────

  it("includes all conditional sections with full service set", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics", ["page views", "clicks", "sessions"]),
        makeService("@google-analytics/data", "analytics", ["page views"]),
        makeService("google-ads", "advertising", ["ad impressions"]),
        makeService("openai", "ai", ["prompts"]),
        makeService("facebook-sdk", "social", ["profile data"]),
        makeService("@sentry/node", "monitoring", ["errors"]),
        makeService("@sendgrid/mail", "email", ["email"]),
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
        makeService("prisma", "database"),
      ],
    });
    const result = generateConsentGuide(scan)!;
    // All legal basis categories populated
    assert.ok(!result.includes("No services requiring explicit consent were detected"));
    assert.ok(!result.includes("No services classified under legitimate interest were detected"));
    assert.ok(!result.includes("No contractual-basis services were detected"));
    // Banner categories
    assert.ok(result.includes("| Analytics |"));
    assert.ok(result.includes("| Advertising |"));
    assert.ok(result.includes("| AI Services |"));
    assert.ok(result.includes("| Social |"));
    // Service-specific patterns
    assert.ok(result.includes("PostHog — Opt-In / Opt-Out"));
    assert.ok(result.includes("Google Analytics — Consent Mode v2"));
    // Withdrawal cleanup
    assert.ok(result.includes("PostHog cleanup"));
    assert.ok(result.includes("Google Analytics cleanup"));
  });
});
