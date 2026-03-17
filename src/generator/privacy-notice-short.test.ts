import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generatePrivacyNoticeShort } from "./privacy-notice-short.js";
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

describe("generatePrivacyNoticeShort", () => {
  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    const result = generatePrivacyNoticeShort(scan);
    assert.strictEqual(result, null);
  });

  it("generates a document when at least one service exists", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeShort(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Privacy Notice"));
  });

  it("uses context company name, email, and website", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      website: "acme.com",
    };
    const result = generatePrivacyNoticeShort(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("privacy@acme.com"));
    assert.ok(result.includes("acme.com"));
  });

  it("uses placeholder values when no context provided", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeShort(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
    assert.ok(result.includes("[your-website.com]"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeShort(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes auth service in account information bullet", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email", "session"])],
    });
    const result = generatePrivacyNoticeShort(scan)!;
    assert.ok(result.includes("Account information"));
    assert.ok(result.includes("next-auth"));
  });

  it("includes payment service in payment details bullet", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card info"])],
    });
    const result = generatePrivacyNoticeShort(scan)!;
    assert.ok(result.includes("Payment details"));
    assert.ok(result.includes("stripe"));
  });

  it("includes analytics service in usage data bullet", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generatePrivacyNoticeShort(scan)!;
    assert.ok(result.includes("Usage data"));
    assert.ok(result.includes("posthog"));
  });

  it("includes monitoring service in technical data bullet", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring", ["error reports"])],
    });
    const result = generatePrivacyNoticeShort(scan)!;
    assert.ok(result.includes("Technical data"));
    assert.ok(result.includes("sentry"));
  });

  it("includes AI service in content bullet", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generatePrivacyNoticeShort(scan)!;
    assert.ok(result.includes("Content you provide"));
    assert.ok(result.includes("openai"));
  });

  it("falls back to dataCategories when no category-specific services match", () => {
    const scan = makeScan({
      services: [makeService("redis", "database", ["cache data"])],
      dataCategories: [
        { category: "Email", description: "User email", sources: ["schema.prisma"] },
        { category: "Name", description: "User name", sources: ["schema.prisma"] },
      ],
    });
    const result = generatePrivacyNoticeShort(scan)!;
    assert.ok(result.includes("Personal data"));
    assert.ok(result.includes("email"));
    assert.ok(result.includes("name"));
  });

  it("includes 'why' items for analytics services", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeShort(scan)!;
    assert.ok(result.includes("understand how our service is used"));
  });

  it("includes 'why' items for monitoring services", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generatePrivacyNoticeShort(scan)!;
    assert.ok(result.includes("detect and fix bugs"));
  });

  it("includes 'why' items for AI services", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generatePrivacyNoticeShort(scan)!;
    assert.ok(result.includes("power AI features"));
  });

  it("includes 'why' items for email services", () => {
    const scan = makeScan({
      services: [makeService("sendgrid", "email")],
    });
    const result = generatePrivacyNoticeShort(scan)!;
    assert.ok(result.includes("send you important updates"));
  });

  it("always includes legal obligations in why section", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeShort(scan)!;
    assert.ok(result.includes("comply with legal obligations"));
  });

  it("includes service providers in sharing section", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics"),
        makeService("sentry", "monitoring"),
      ],
    });
    const result = generatePrivacyNoticeShort(scan)!;
    assert.ok(result.includes("Service providers"));
    assert.ok(result.includes("posthog"));
    assert.ok(result.includes("sentry"));
  });

  it("includes payment processors in sharing section when payment present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyNoticeShort(scan)!;
    assert.ok(result.includes("Payment processors"));
  });

  it("includes advertising partners in sharing section", () => {
    const scan = makeScan({
      services: [makeService("google-ads", "advertising")],
    });
    const result = generatePrivacyNoticeShort(scan)!;
    assert.ok(result.includes("Advertising partners"));
    assert.ok(result.includes("google-ads"));
  });

  it("always includes legal authorities in sharing section", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeShort(scan)!;
    assert.ok(result.includes("Legal authorities"));
  });

  it("states we never sell personal data", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeShort(scan)!;
    assert.ok(result.includes("never sell"));
  });

  it("includes Your Rights section", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeShort(scan)!;
    assert.ok(result.includes("Your Rights"));
    assert.ok(result.includes("Access"));
    assert.ok(result.includes("Delete"));
    assert.ok(result.includes("Export"));
    assert.ok(result.includes("Opt out"));
  });

  it("includes How We Protect Your Data section", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeShort(scan)!;
    assert.ok(result.includes("How We Protect Your Data"));
    assert.ok(result.includes("encrypted"));
  });

  it("includes disclaimer about auto-generation", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeShort(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("legal professional"));
  });

  it("handles multiple services across all categories", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("sentry", "monitoring"),
        makeService("openai", "ai"),
        makeService("sendgrid", "email"),
        makeService("google-ads", "advertising"),
        makeService("s3", "storage"),
      ],
    });
    const result = generatePrivacyNoticeShort(scan)!;
    assert.ok(result.includes("Account information"));
    assert.ok(result.includes("Payment details"));
    assert.ok(result.includes("Usage data"));
    assert.ok(result.includes("Technical data"));
    assert.ok(result.includes("Content you provide"));
  });

  it("truncates service provider names to 8 and shows count of others", () => {
    const services: DetectedService[] = [];
    for (let i = 0; i < 12; i++) {
      services.push(makeService(`service-${i}`, "analytics"));
    }
    const scan = makeScan({ services });
    const result = generatePrivacyNoticeShort(scan)!;
    assert.ok(result.includes("and 4 others"));
  });

  it("does not show 'others' when 8 or fewer services", () => {
    const services: DetectedService[] = [];
    for (let i = 0; i < 8; i++) {
      services.push(makeService(`service-${i}`, "analytics"));
    }
    const scan = makeScan({ services });
    const result = generatePrivacyNoticeShort(scan)!;
    assert.ok(!result.includes("others"));
  });

  it("links to full privacy policy", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeShort(scan)!;
    assert.ok(result.includes("PRIVACY_POLICY.md"));
  });
});
