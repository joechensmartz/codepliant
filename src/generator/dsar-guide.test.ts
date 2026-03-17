import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateDSARGuide } from "./dsar-guide.js";
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

describe("generateDSARGuide", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when no services are detected", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateDSARGuide(scan), null);
  });

  // ── Basic generation ──────────────────────────────────────────────

  it("generates a guide when at least one service is detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateDSARGuide(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("DSAR Handling Guide"));
  });

  it("includes the project name in the output", () => {
    const scan = makeScan({
      projectName: "my-app",
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("my-app"));
  });

  it("includes a last-updated date", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("**Last updated:**"));
  });

  // ── Context / Company Info ─────────────────────────────────────────

  it("uses default company name when no context provided", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses provided company name from context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "hi@acme.com" };
    const result = generateDSARGuide(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses provided contact email from context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "privacy@acme.com" };
    const result = generateDSARGuide(scan, ctx)!;
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("uses default email placeholder when no context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses provided DPO name from context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", dpoName: "Jane Smith" };
    const result = generateDSARGuide(scan, ctx)!;
    assert.ok(result.includes("Jane Smith"));
  });

  it("uses provided DPO email from context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", dpoEmail: "dpo@acme.com" };
    const result = generateDSARGuide(scan, ctx)!;
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("falls back to contact email when DPO email not provided", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "privacy@acme.com" };
    const result = generateDSARGuide(scan, ctx)!;
    // DPO email should fall back to contact email
    assert.ok(result.includes("privacy@acme.com"));
  });

  // ── Section Content ──────────────────────────────────────────────

  it("includes the What is a DSAR section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("What is a DSAR?"));
  });

  it("includes GDPR article references", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("Art. 15"));
    assert.ok(result.includes("Art. 16"));
    assert.ok(result.includes("Art. 17"));
  });

  it("includes CCPA section references", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("1798.100"));
    assert.ok(result.includes("1798.105"));
  });

  it("includes Types of DSAR Requests section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("Types of DSAR Requests"));
    assert.ok(result.includes("Access Request"));
    assert.ok(result.includes("Rectification Request"));
    assert.ok(result.includes("Erasure Request"));
    assert.ok(result.includes("Data Portability Request"));
  });

  it("includes Response Timeline section with GDPR and CCPA timelines", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("Response Timeline"));
    assert.ok(result.includes("30 calendar days"));
    assert.ok(result.includes("45 calendar days"));
  });

  it("includes Identity Verification Requirements section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("Identity Verification Requirements"));
    assert.ok(result.includes("Authorized Agents"));
  });

  it("includes Service-Specific Data Location Map section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("Service-Specific Data Location Map"));
  });

  it("includes Template Responses section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("Template Responses"));
    assert.ok(result.includes("Acknowledgment of Receipt"));
    assert.ok(result.includes("Access Request Response"));
    assert.ok(result.includes("Erasure Confirmation"));
    assert.ok(result.includes("Portability Response"));
  });

  it("includes Record-Keeping Requirements section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("Record-Keeping Requirements"));
    assert.ok(result.includes("DSAR Log Fields"));
  });

  it("includes the Codepliant disclaimer at the end", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("does not constitute legal advice"));
  });

  // ── Provider Name Resolution ──────────────────────────────────────

  it("resolves known service name to provider name (OpenAI)", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("### OpenAI"));
  });

  it("resolves Stripe provider name", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("### Stripe"));
  });

  it("resolves Sentry provider name for @sentry/node", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring", ["error logs"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("### Sentry"));
  });

  it("uses raw service name when no known provider mapping exists", () => {
    const scan = makeScan({
      services: [makeService("unknown-service", "other", ["misc data"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("### unknown-service"));
  });

  // ── Category Formatting ──────────────────────────────────────────

  it("formats AI category correctly", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("AI / Machine Learning"));
  });

  it("formats payment category correctly", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("Payment Processing"));
  });

  it("formats analytics category correctly", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("Analytics / Tracking"));
  });

  it("formats auth category correctly", () => {
    const scan = makeScan({
      services: [makeService("@clerk/nextjs", "auth", ["user profiles"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("Authentication / Identity"));
  });

  it("formats monitoring category correctly", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring", ["error logs"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("Monitoring / Error Tracking"));
  });

  // ── Data Location Map Details ─────────────────────────────────────

  it("includes data collected for each service", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts", "conversation history"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("user prompts, conversation history"));
  });

  it("includes storage location description for AI category", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("Third-party AI provider servers"));
  });

  it("includes storage location description for payment category", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("PCI-compliant environment"));
  });

  it("includes export instructions for each service", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("How to export:"));
  });

  it("includes deletion instructions for each service", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("How to delete:"));
  });

  // ── Third-Party vs Self-Hosted ─────────────────────────────────────

  it("marks third-party services as requiring notification", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("Third-party notification required:** Yes"));
  });

  it("marks self-hosted services as not requiring notification", () => {
    const scan = makeScan({
      services: [makeService("prisma", "database", ["user records"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("Third-party notification required:** No (self-hosted)"));
  });

  it("marks nodemailer as self-hosted", () => {
    const scan = makeScan({
      services: [makeService("nodemailer", "email", ["email addresses"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("No (self-hosted)"));
  });

  it("marks passport as self-hosted", () => {
    const scan = makeScan({
      services: [makeService("passport", "auth", ["user credentials"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("No (self-hosted)"));
  });

  // ── Third-Party Sub-Processor Notification ────────────────────────

  it("includes third-party sub-processor notification section when third parties exist", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("Third-Party Sub-Processor Notification"));
  });

  it("does not include sub-processor notification section when only self-hosted", () => {
    const scan = makeScan({
      services: [makeService("prisma", "database", ["user records"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(!result.includes("Third-Party Sub-Processor Notification"));
  });

  it("lists third-party providers in notification table", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
      ],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("| OpenAI |"));
    assert.ok(result.includes("| Stripe |"));
  });

  // ── Deduplication ──────────────────────────────────────────────────

  it("deduplicates services with the same provider name", () => {
    const scan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring", ["error logs"]),
        makeService("@sentry/nextjs", "monitoring", ["error logs"]),
      ],
    });
    const result = generateDSARGuide(scan)!;
    // Should only have one Sentry section header
    const sentryMatches = result.match(/### Sentry/g);
    assert.ok(sentryMatches !== null);
    assert.strictEqual(sentryMatches.length, 1);
  });

  // ── Multiple Services ──────────────────────────────────────────────

  it("includes all distinct services in data location map", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("### OpenAI"));
    assert.ok(result.includes("### Stripe"));
    assert.ok(result.includes("### PostHog"));
  });

  it("handles a mix of self-hosted and third-party services", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("prisma", "database", ["user records"]),
        makeService("stripe", "payment", ["payment data"]),
      ],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("### OpenAI"));
    assert.ok(result.includes("### Prisma"));
    assert.ok(result.includes("### Stripe"));
  });

  // ── Template section numbering ─────────────────────────────────────

  it("numbers template section as 7 when third-party notification section present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("## 7. Template Responses"));
  });

  it("numbers template section as 6 when no third-party notification section", () => {
    const scan = makeScan({
      services: [makeService("prisma", "database", ["user records"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("## 6. Template Responses"));
  });

  // ── Edge Cases ────────────────────────────────────────────────────

  it("handles service with empty dataCollected array", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", [])],
    });
    const result = generateDSARGuide(scan);
    assert.ok(result !== null);
  });

  it("handles single self-hosted service", () => {
    const scan = makeScan({
      services: [makeService("ioredis", "database", ["cache data"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("DSAR Handling Guide"));
    assert.ok(result.includes("No (self-hosted)"));
  });

  it("handles many services without error", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
        makeService("@clerk/nextjs", "auth", ["user profiles"]),
        makeService("@sendgrid/mail", "email", ["email addresses"]),
        makeService("prisma", "database", ["user records"]),
        makeService("@sentry/node", "monitoring", ["error logs"]),
        makeService("@aws-sdk/client-s3", "storage", ["files"]),
      ],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("DSAR Handling Guide"));
    assert.ok(result.includes("### OpenAI"));
    assert.ok(result.includes("### Stripe"));
    assert.ok(result.includes("### PostHog"));
  });

  it("includes Restriction of Processing request type", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("Restriction of Processing"));
  });

  it("includes Right to Object request type", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("Right to Object"));
  });

  it("includes DSAR reference number format in templates", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("DSAR-XXXX"));
  });

  it("includes 24-month CCPA record retention requirement", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(result.includes("24 months"));
  });

  it("returns a string (not empty) for valid input", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateDSARGuide(scan)!;
    assert.ok(typeof result === "string");
    assert.ok(result.length > 100);
  });
});
