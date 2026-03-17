import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateSubprocessorChangeNotification } from "./subprocessor-notification.js";
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

describe("generateSubprocessorChangeNotification", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when fewer than 3 third-party services detected", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    assert.strictEqual(generateSubprocessorChangeNotification(scan), null);
  });

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateSubprocessorChangeNotification(scan), null);
  });

  it("returns null when all services are self-hosted", () => {
    const scan = makeScan({
      services: [
        makeService("prisma", "database"),
        makeService("ioredis", "database"),
        makeService("nodemailer", "email"),
        makeService("passport", "auth"),
      ],
    });
    assert.strictEqual(generateSubprocessorChangeNotification(scan), null);
  });

  it("returns null with exactly 2 third-party services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("prisma", "database"), // self-hosted, not counted
      ],
    });
    assert.strictEqual(generateSubprocessorChangeNotification(scan), null);
  });

  // ── Generation with sufficient services ─────────────────────────────

  it("generates notification when 3+ third-party services detected", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("openai", "ai", ["user prompts"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateSubprocessorChangeNotification(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Sub-Processor Change Notification"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateSubprocessorChangeNotification(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  // ── Context values ────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
      ],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "legal@acme.com" };
    const result = generateSubprocessorChangeNotification(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
      ],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "legal@acme.com" };
    const result = generateSubprocessorChangeNotification(scan, ctx)!;
    assert.ok(result.includes("legal@acme.com"));
  });

  it("uses context DPO email", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
      ],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "legal@acme.com",
      dpoEmail: "dpo@acme.com",
    };
    const result = generateSubprocessorChangeNotification(scan, ctx)!;
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("falls back dpoEmail to contactEmail when not provided", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
      ],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "contact@acme.com" };
    const result = generateSubprocessorChangeNotification(scan, ctx)!;
    // dpoEmail defaults to contactEmail; check it appears in the DPO contact line
    assert.ok(result.includes("contact@acme.com"));
  });

  it("uses context website", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
      ],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "legal@acme.com",
      website: "https://acme.com",
    };
    const result = generateSubprocessorChangeNotification(scan, ctx)!;
    assert.ok(result.includes("https://acme.com"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateSubprocessorChangeNotification(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses placeholder email when no context", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateSubprocessorChangeNotification(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses placeholder website when no context", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateSubprocessorChangeNotification(scan)!;
    assert.ok(result.includes("[https://yoursite.com]"));
  });

  // ── Key content sections ──────────────────────────────────────────

  it("includes Purpose of This Notice section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateSubprocessorChangeNotification(scan)!;
    assert.ok(result.includes("## 1. Purpose of This Notice"));
    assert.ok(result.includes("GDPR Article 28"));
  });

  it("includes Sub-Processor Change Details section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateSubprocessorChangeNotification(scan)!;
    assert.ok(result.includes("## 2. Sub-Processor Change Details"));
    assert.ok(result.includes("New Sub-Processor(s)"));
    assert.ok(result.includes("Removed Sub-Processor(s)"));
    assert.ok(result.includes("Replaced Sub-Processor(s)"));
  });

  it("includes Current Sub-Processor List section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateSubprocessorChangeNotification(scan)!;
    assert.ok(result.includes("## 3. Current Sub-Processor List"));
  });

  it("includes Due Diligence section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateSubprocessorChangeNotification(scan)!;
    assert.ok(result.includes("## 4. Due Diligence Undertaken"));
    assert.ok(result.includes("Security Assessment"));
    assert.ok(result.includes("Privacy Assessment"));
  });

  it("includes Right to Object section with 30-day period", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateSubprocessorChangeNotification(scan)!;
    assert.ok(result.includes("## 5. Your Right to Object"));
    assert.ok(result.includes("30 days"));
  });

  it("includes Impact on Data Protection section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateSubprocessorChangeNotification(scan)!;
    assert.ok(result.includes("## 6. Impact on Data Protection"));
  });

  it("includes Contact Information section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateSubprocessorChangeNotification(scan)!;
    assert.ok(result.includes("## 7. Contact Information"));
  });

  // ── Provider name mapping ─────────────────────────────────────────

  it("maps known package names to human-readable provider names", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("openai", "ai", ["user prompts"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateSubprocessorChangeNotification(scan)!;
    assert.ok(result.includes("Stripe"));
    assert.ok(result.includes("OpenAI"));
    assert.ok(result.includes("PostHog"));
  });

  it("uses raw package name for unknown services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("custom-analytics", "analytics", ["events"]),
      ],
    });
    const result = generateSubprocessorChangeNotification(scan)!;
    assert.ok(result.includes("custom-analytics"));
  });

  it("deduplicates providers by display name", () => {
    const scan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring", ["errors"]),
        makeService("@sentry/nextjs", "monitoring", ["errors"]),
        makeService("stripe", "payment", ["payment info"]),
        makeService("openai", "ai", ["prompts"]),
      ],
    });
    const result = generateSubprocessorChangeNotification(scan)!;
    // Both @sentry/node and @sentry/nextjs map to "Sentry" — should appear only once
    const sentryCount = (result.match(/\| Sentry \|/g) || []).length;
    assert.strictEqual(sentryCount, 1);
  });

  // ── Category purpose descriptions ─────────────────────────────────

  it("includes category-based purpose descriptions for services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("openai", "ai", ["user prompts"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateSubprocessorChangeNotification(scan)!;
    assert.ok(result.includes("Payment processing and billing"));
    assert.ok(result.includes("AI processing and content generation"));
    assert.ok(result.includes("Product analytics and usage tracking"));
  });

  it("uses 'other' purpose for unknown category", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("some-tool", "other" as DetectedService["category"], ["misc data"]),
      ],
    });
    const result = generateSubprocessorChangeNotification(scan)!;
    assert.ok(result.includes("Third-party service integration"));
  });

  // ── Data collected in table ───────────────────────────────────────

  it("lists data collected for each provider in the table", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info", "email"]),
        makeService("openai", "ai", ["user prompts"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateSubprocessorChangeNotification(scan)!;
    assert.ok(result.includes("payment info, email"));
    assert.ok(result.includes("user prompts"));
    assert.ok(result.includes("page views"));
  });

  // ── Self-hosted exclusion ─────────────────────────────────────────

  it("excludes self-hosted services from third-party count", () => {
    const scan = makeScan({
      services: [
        makeService("prisma", "database"),
        makeService("ioredis", "database"),
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        // Only 2 third-party — prisma and ioredis are self-hosted
      ],
    });
    assert.strictEqual(generateSubprocessorChangeNotification(scan), null);
  });

  it("generates when self-hosted + 3 third-party services present", () => {
    const scan = makeScan({
      services: [
        makeService("prisma", "database"),
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateSubprocessorChangeNotification(scan);
    assert.ok(result !== null);
  });

  // ── Disclaimer ────────────────────────────────────────────────────

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateSubprocessorChangeNotification(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("auto-generated"));
  });
});
