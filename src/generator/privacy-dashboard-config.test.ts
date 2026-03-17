import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generatePrivacyDashboardConfig } from "./privacy-dashboard-config.js";
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

describe("generatePrivacyDashboardConfig", () => {
  // ── Null guards ──────────────────────────────────────────────────────

  it("returns null when no services detected", () => {
    const result = generatePrivacyDashboardConfig(makeScan());
    assert.strictEqual(result, null);
  });

  it("returns null when services array is empty", () => {
    const result = generatePrivacyDashboardConfig(makeScan({ services: [] }));
    assert.strictEqual(result, null);
  });

  // ── Basic generation ──────────────────────────────────────────────────

  it("generates valid JSON when services are present", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generatePrivacyDashboardConfig(scan);
    assert.ok(result !== null);
    const parsed = JSON.parse(result);
    assert.ok(typeof parsed === "object");
  });

  it("ends with a newline", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generatePrivacyDashboardConfig(scan)!;
    assert.ok(result.endsWith("\n"));
  });

  // ── Top-level fields ─────────────────────────────────────────────────

  it("includes version 1.0.0", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    assert.strictEqual(config.version, "1.0.0");
  });

  it("includes generated_at as ISO timestamp", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    assert.ok(typeof config.generated_at === "string");
    assert.ok(/\d{4}-\d{2}-\d{2}T/.test(config.generated_at as string));
  });

  it("includes project name from scan", () => {
    const scan = makeScan({
      projectName: "my-app",
      services: [makeService("posthog", "analytics")],
    });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    assert.strictEqual(config.project, "my-app");
  });

  // ── Context values ────────────────────────────────────────────────────

  it("uses company name from context", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan, makeCtx({ companyName: "TestCo" })));
    assert.strictEqual(config.company, "TestCo");
  });

  it("uses contact email from context", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan, makeCtx({ contactEmail: "privacy@test.com" })));
    assert.strictEqual(config.contact_email, "privacy@test.com");
  });

  it("uses DPO name and email from context", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const ctx = makeCtx({ dpoName: "Jane Smith", dpoEmail: "dpo@test.com" });
    const config = parseResult(generatePrivacyDashboardConfig(scan, ctx));
    const dpo = config.dpo as Record<string, string>;
    assert.strictEqual(dpo.name, "Jane Smith");
    assert.strictEqual(dpo.email, "dpo@test.com");
  });

  it("uses default placeholders when no context provided", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    assert.strictEqual(config.company, "[Your Company Name]");
    assert.strictEqual(config.contact_email, "[your-email@example.com]");
    const dpo = config.dpo as Record<string, string>;
    assert.strictEqual(dpo.name, "[Data Protection Officer]");
    assert.strictEqual(dpo.email, "[dpo@example.com]");
  });

  // ── Dashboard settings ────────────────────────────────────────────────

  it("includes dashboard title with company name", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan, makeCtx({ companyName: "TestCo" })));
    const settings = config.dashboard_settings as Record<string, unknown>;
    assert.strictEqual(settings.title, "TestCo — My Data");
  });

  it("includes dashboard description with company name", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan, makeCtx({ companyName: "TestCo" })));
    const settings = config.dashboard_settings as Record<string, unknown>;
    assert.ok((settings.description as string).includes("TestCo"));
  });

  it("enables consent management when multiple consent options exist", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
      ],
    });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const settings = config.dashboard_settings as Record<string, unknown>;
    assert.strictEqual(settings.show_consent_management, true);
  });

  it("sets show_data_export and show_data_deletion to true", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const settings = config.dashboard_settings as Record<string, unknown>;
    assert.strictEqual(settings.show_data_export, true);
    assert.strictEqual(settings.show_data_deletion, true);
    assert.strictEqual(settings.show_processing_history, true);
  });

  // ── Data categories ──────────────────────────────────────────────────

  it("maps analytics service to analytics data category", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const categories = config.data_categories as Record<string, unknown>[];
    assert.ok(categories.some((c) => c.id === "analytics"));
  });

  it("maps auth service to account data category", () => {
    const scan = makeScan({ services: [makeService("@clerk/nextjs", "auth")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const categories = config.data_categories as Record<string, unknown>[];
    assert.ok(categories.some((c) => c.id === "account"));
  });

  it("maps payment service to payment data category", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const categories = config.data_categories as Record<string, unknown>[];
    const payment = categories.find((c) => c.id === "payment");
    assert.ok(payment);
    assert.strictEqual(payment!.user_can_delete, false);
    assert.strictEqual(payment!.user_can_export, true);
  });

  it("maps email service to communications data category", () => {
    const scan = makeScan({ services: [makeService("resend", "email")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const categories = config.data_categories as Record<string, unknown>[];
    assert.ok(categories.some((c) => c.id === "communications"));
  });

  it("maps monitoring service to technical data category", () => {
    const scan = makeScan({ services: [makeService("@sentry/node", "monitoring")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const categories = config.data_categories as Record<string, unknown>[];
    const tech = categories.find((c) => c.id === "technical");
    assert.ok(tech);
    assert.strictEqual(tech!.user_can_delete, false);
    assert.strictEqual(tech!.user_can_export, false);
  });

  it("maps ai service to ai_interactions data category", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const categories = config.data_categories as Record<string, unknown>[];
    assert.ok(categories.some((c) => c.id === "ai_interactions"));
  });

  it("maps storage service to user_content data category", () => {
    const scan = makeScan({ services: [makeService("@aws-sdk/client-s3", "storage")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const categories = config.data_categories as Record<string, unknown>[];
    assert.ok(categories.some((c) => c.id === "user_content"));
  });

  it("maps database service to stored_data data category", () => {
    const scan = makeScan({ services: [makeService("prisma", "database")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const categories = config.data_categories as Record<string, unknown>[];
    assert.ok(categories.some((c) => c.id === "stored_data"));
  });

  it("maps advertising service to advertising data category", () => {
    const scan = makeScan({ services: [makeService("Meta Pixel", "advertising")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const categories = config.data_categories as Record<string, unknown>[];
    assert.ok(categories.some((c) => c.id === "advertising"));
  });

  it("deduplicates same-category services", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics"),
        makeService("mixpanel", "analytics"),
      ],
    });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const categories = config.data_categories as Record<string, unknown>[];
    const analyticsEntries = categories.filter((c) => c.id === "analytics");
    assert.strictEqual(analyticsEntries.length, 1);
  });

  it("lists all sources for a deduplicated category", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics"),
        makeService("mixpanel", "analytics"),
      ],
    });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const categories = config.data_categories as Record<string, unknown>[];
    const analytics = categories.find((c) => c.id === "analytics");
    const sources = analytics!.sources as string[];
    assert.ok(sources.includes("posthog"));
    assert.ok(sources.includes("mixpanel"));
  });

  // ── Consent options ──────────────────────────────────────────────────

  it("always includes essential consent first", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const options = config.consent_options as Record<string, unknown>[];
    assert.strictEqual(options[0].id, "essential_consent");
    assert.strictEqual(options[0].required, true);
    assert.strictEqual(options[0].default_state, "opted_in");
  });

  it("adds analytics consent when analytics detected", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const options = config.consent_options as Record<string, unknown>[];
    assert.ok(options.some((o) => o.id === "analytics_consent"));
  });

  it("adds advertising consent when advertising detected", () => {
    const scan = makeScan({ services: [makeService("Meta Pixel", "advertising")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const options = config.consent_options as Record<string, unknown>[];
    assert.ok(options.some((o) => o.id === "advertising_consent"));
  });

  it("adds AI training consent when AI detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const options = config.consent_options as Record<string, unknown>[];
    assert.ok(options.some((o) => o.id === "ai_training_consent"));
  });

  it("adds marketing consent when email detected", () => {
    const scan = makeScan({ services: [makeService("resend", "email")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const options = config.consent_options as Record<string, unknown>[];
    assert.ok(options.some((o) => o.id === "marketing_consent"));
  });

  it("does not add analytics consent when no analytics", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const options = config.consent_options as Record<string, unknown>[];
    assert.ok(!options.some((o) => o.id === "analytics_consent"));
  });

  it("all optional consents default to opted_out", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
        makeService("resend", "email"),
      ],
    });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const options = config.consent_options as Record<string, unknown>[];
    const optional = options.filter((o) => o.required === false);
    for (const opt of optional) {
      assert.strictEqual(opt.default_state, "opted_out");
    }
  });

  it("essential consent category_ids only includes detected categories", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const options = config.consent_options as Record<string, unknown>[];
    const essential = options.find((o) => o.id === "essential_consent");
    const ids = essential!.category_ids as string[];
    assert.ok(ids.includes("payment"));
    assert.ok(!ids.includes("account"));
  });

  // ── Data endpoints ───────────────────────────────────────────────────

  it("includes all 6 data endpoints", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const endpoints = config.data_endpoints as Record<string, unknown>[];
    assert.strictEqual(endpoints.length, 6);
    const actions = endpoints.map((e) => e.action);
    assert.ok(actions.includes("export"));
    assert.ok(actions.includes("delete"));
    assert.ok(actions.includes("consent"));
    assert.ok(actions.includes("access"));
    assert.ok(actions.includes("rectify"));
    assert.ok(actions.includes("restrict"));
  });

  it("all endpoints require auth", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const endpoints = config.data_endpoints as Record<string, unknown>[];
    for (const ep of endpoints) {
      assert.strictEqual(ep.requires_auth, true);
    }
  });

  // ── Rights ────────────────────────────────────────────────────────────

  it("includes all 6 user rights", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const rights = config.rights as Record<string, unknown>[];
    assert.strictEqual(rights.length, 6);
    const ids = rights.map((r) => r.id);
    assert.ok(ids.includes("right_access"));
    assert.ok(ids.includes("right_rectification"));
    assert.ok(ids.includes("right_erasure"));
    assert.ok(ids.includes("right_portability"));
    assert.ok(ids.includes("right_restriction"));
    assert.ok(ids.includes("right_object"));
  });

  it("rights reference GDPR articles", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const rights = config.rights as Record<string, unknown>[];
    const access = rights.find((r) => r.id === "right_access");
    assert.ok((access!.regulation as string).includes("GDPR Art. 15"));
  });

  it("rights reference CCPA where applicable", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const config = parseResult(generatePrivacyDashboardConfig(scan));
    const rights = config.rights as Record<string, unknown>[];
    const erasure = rights.find((r) => r.id === "right_erasure");
    assert.ok((erasure!.regulation as string).includes("CCPA"));
  });

  // ── Comprehensive scenario ────────────────────────────────────────────

  it("handles comprehensive service set with all category types", () => {
    const scan = makeScan({
      projectName: "enterprise-app",
      services: [
        makeService("posthog", "analytics"),
        makeService("Meta Pixel", "advertising"),
        makeService("@clerk/nextjs", "auth"),
        makeService("stripe", "payment"),
        makeService("resend", "email"),
        makeService("@sentry/node", "monitoring"),
        makeService("openai", "ai"),
        makeService("@aws-sdk/client-s3", "storage"),
        makeService("prisma", "database"),
      ],
    });
    const ctx = makeCtx({
      companyName: "Enterprise Inc",
      contactEmail: "privacy@enterprise.com",
      dpoName: "Data Officer",
      dpoEmail: "dpo@enterprise.com",
    });
    const config = parseResult(generatePrivacyDashboardConfig(scan, ctx));
    assert.strictEqual(config.company, "Enterprise Inc");
    assert.strictEqual(config.contact_email, "privacy@enterprise.com");
    assert.strictEqual(config.project, "enterprise-app");

    const categories = config.data_categories as Record<string, unknown>[];
    assert.strictEqual(categories.length, 9);

    const options = config.consent_options as Record<string, unknown>[];
    // essential + analytics + advertising + ai_training + marketing = 5
    assert.strictEqual(options.length, 5);

    const settings = config.dashboard_settings as Record<string, unknown>;
    assert.strictEqual(settings.show_consent_management, true);
  });
});
