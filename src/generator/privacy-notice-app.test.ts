import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generatePrivacyNoticeApp } from "./privacy-notice-app.js";
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

describe("generatePrivacyNoticeApp", () => {
  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    const result = generatePrivacyNoticeApp(scan);
    assert.strictEqual(result, null);
  });

  it("generates a document when at least one service exists", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeApp(scan);
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
    const result = generatePrivacyNoticeApp(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("privacy@acme.com"));
    assert.ok(result.includes("acme.com"));
  });

  it("uses placeholder values when no context provided", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
    assert.ok(result.includes("[your-website.com]"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes auth collection bullet for auth services", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("email and account info"));
  });

  it("includes payment collection bullet for payment services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("Billing details"));
  });

  it("includes analytics collection bullet for analytics services", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("How you use the app"));
  });

  it("includes monitoring collection bullet for monitoring services", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("Technical info"));
  });

  it("includes AI collection bullet for AI services", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("Content you provide to AI-powered features"));
  });

  it("includes email collection bullet for email services", () => {
    const scan = makeScan({
      services: [makeService("sendgrid", "email")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("email address for account notifications"));
  });

  it("falls back to dataCategories when no category-specific services match", () => {
    const scan = makeScan({
      services: [makeService("redis", "database")],
      dataCategories: [
        { category: "Email", description: "User email", sources: ["schema.prisma"] },
        { category: "Name", description: "User name", sources: ["schema.prisma"] },
      ],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("Personal data including"));
    assert.ok(result.includes("email"));
  });

  it("falls back to generic bullet when no categories and no data fields", () => {
    const scan = makeScan({
      services: [makeService("redis", "database")],
      dataCategories: [],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("Basic account and usage information"));
  });

  it("includes purpose bullet for payment services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("Process your payments"));
  });

  it("includes purpose bullet for analytics services", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("Understand usage patterns"));
  });

  it("includes purpose bullet for monitoring services", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("Find and fix technical issues"));
  });

  it("includes purpose bullet for AI services", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("Power AI features"));
  });

  it("includes purpose bullet for email services", () => {
    const scan = makeScan({
      services: [makeService("sendgrid", "email")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("Send you important account updates"));
  });

  it("always includes legal obligations purpose", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("Meet our legal obligations"));
  });

  it("includes service providers in sharing section", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics"),
        makeService("sentry", "monitoring"),
      ],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("Service providers who help us run the app"));
    assert.ok(result.includes("posthog"));
    assert.ok(result.includes("sentry"));
  });

  it("includes advertising partners in sharing section", () => {
    const scan = makeScan({
      services: [makeService("google-ads", "advertising")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("Advertising partners"));
    assert.ok(result.includes("google-ads"));
  });

  it("always includes law enforcement sharing bullet", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("Law enforcement only when legally required"));
  });

  it("states we never sell personal data", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("never sell"));
  });

  it("includes AI Features section when AI services present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("AI Features"));
    assert.ok(result.includes("openai"));
    assert.ok(result.includes("AI Disclosure"));
  });

  it("does not include AI Features section when no AI services", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(!result.includes("AI Features"));
  });

  it("includes Cookies & Tracking section when analytics present", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("Cookies & Tracking"));
    assert.ok(result.includes("Analytics cookies"));
  });

  it("includes Cookies & Tracking section when advertising present", () => {
    const scan = makeScan({
      services: [makeService("google-ads", "advertising")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("Cookies & Tracking"));
    assert.ok(result.includes("Advertising cookies"));
  });

  it("does not include Cookies & Tracking section when neither analytics nor advertising", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(!result.includes("Cookies & Tracking"));
  });

  it("includes Your Rights section", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("Your Rights"));
    assert.ok(result.includes("See"));
    assert.ok(result.includes("Download"));
    assert.ok(result.includes("Delete"));
    assert.ok(result.includes("Opt out"));
  });

  it("includes Data Security section", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("Data Security"));
    assert.ok(result.includes("encrypted"));
  });

  it("includes links to full documents", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("PRIVACY_POLICY.md"));
    assert.ok(result.includes("TERMS_OF_SERVICE.md"));
    assert.ok(result.includes("SECURITY.md"));
  });

  it("includes AI Disclosure link when AI services present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("AI_DISCLOSURE.md"));
  });

  it("includes Cookie Policy link when analytics present", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("COOKIE_POLICY.md"));
  });

  it("does not include Cookie Policy link when no analytics or advertising", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(!result.includes("COOKIE_POLICY.md"));
  });

  it("includes disclaimer about auto-generation", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("legal professional"));
  });

  it("truncates service names to 6 and shows count of more", () => {
    const services: DetectedService[] = [];
    for (let i = 0; i < 10; i++) {
      services.push(makeService(`svc-${i}`, "analytics"));
    }
    const scan = makeScan({ services });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("+ 4 more"));
  });

  it("does not show 'more' when 6 or fewer services", () => {
    const services: DetectedService[] = [];
    for (let i = 0; i < 6; i++) {
      services.push(makeService(`svc-${i}`, "analytics"));
    }
    const scan = makeScan({ services });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(!result.includes("more"));
  });

  it("handles all service categories together", () => {
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
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("email and account info"));
    assert.ok(result.includes("Billing details"));
    assert.ok(result.includes("How you use the app"));
    assert.ok(result.includes("Technical info"));
    assert.ok(result.includes("Content you provide to AI-powered features"));
    assert.ok(result.includes("email address for account notifications"));
    assert.ok(result.includes("AI Features"));
    assert.ok(result.includes("Cookies & Tracking"));
  });

  it("references simplified in-app notice in intro", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeApp(scan)!;
    assert.ok(result.includes("simplified in-app privacy notice"));
  });
});
