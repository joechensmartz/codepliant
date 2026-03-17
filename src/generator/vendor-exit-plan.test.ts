import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateVendorExitPlan } from "./vendor-exit-plan.js";
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

describe("generateVendorExitPlan", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateVendorExitPlan(scan), null);
  });

  it("returns null when fewer than 2 third-party services detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    assert.strictEqual(generateVendorExitPlan(scan), null);
  });

  it("returns null when only self-hosted services detected", () => {
    const scan = makeScan({
      services: [
        makeService("prisma", "database", ["user records"]),
        makeService("drizzle", "database", ["user records"]),
        makeService("mongoose", "database", ["user records"]),
      ],
    });
    assert.strictEqual(generateVendorExitPlan(scan), null);
  });

  it("returns null with one third-party and several self-hosted services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("prisma", "database", ["user records"]),
        makeService("ioredis", "database", ["cached data"]),
        makeService("nodemailer", "email", ["email content"]),
      ],
    });
    assert.strictEqual(generateVendorExitPlan(scan), null);
  });

  // ── Generation with services ──────────────────────────────────────

  it("generates plan when exactly 2 third-party services detected", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateVendorExitPlan(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Vendor Exit Plan"));
  });

  it("generates plan with many third-party services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("openai", "ai", ["user prompts"]),
        makeService("@sendgrid/mail", "email", ["email address"]),
        makeService("posthog", "analytics", ["page views"]),
        makeService("@sentry/node", "monitoring", ["error traces"]),
      ],
    });
    const result = generateVendorExitPlan(scan);
    assert.ok(result !== null);
  });

  it("ignores self-hosted services when counting threshold", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("openai", "ai", ["user prompts"]),
        makeService("prisma", "database", ["user records"]),
        makeService("passport", "auth", ["credentials"]),
      ],
    });
    const result = generateVendorExitPlan(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Stripe"));
    assert.ok(result.includes("OpenAI"));
  });

  // ── Context values ────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "legal@acme.com" };
    const result = generateVendorExitPlan(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "legal@acme.com" };
    const result = generateVendorExitPlan(scan, ctx)!;
    assert.ok(result.includes("legal@acme.com"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateVendorExitPlan(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses placeholder email when no context", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateVendorExitPlan(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  // ── Key content sections ──────────────────────────────────────────

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateVendorExitPlan(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes project name", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateVendorExitPlan(scan)!;
    assert.ok(result.includes("test-project"));
  });

  it("includes purpose section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateVendorExitPlan(scan)!;
    assert.ok(result.includes("## Purpose"));
    assert.ok(result.includes("vendor independence"));
  });

  // ── Executive summary table ───────────────────────────────────────

  it("includes executive summary table", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateVendorExitPlan(scan)!;
    assert.ok(result.includes("## Executive Summary"));
    assert.ok(result.includes("Vendor"));
    assert.ok(result.includes("Category"));
    assert.ok(result.includes("Migration Complexity"));
    assert.ok(result.includes("Estimated Timeline"));
    assert.ok(result.includes("Alternatives"));
  });

  it("maps Stripe to known provider name in summary table", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("openai", "ai", ["user prompts"]),
      ],
    });
    const result = generateVendorExitPlan(scan)!;
    assert.ok(result.includes("| Stripe |"));
    assert.ok(result.includes("| OpenAI |"));
  });

  // ── Detailed exit plans ───────────────────────────────────────────

  it("includes detailed exit plans section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateVendorExitPlan(scan)!;
    assert.ok(result.includes("## Detailed Exit Plans"));
  });

  it("includes exit plan details for known vendor (Stripe)", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("openai", "ai", ["user prompts"]),
      ],
    });
    const result = generateVendorExitPlan(scan)!;
    assert.ok(result.includes("### Stripe"));
    assert.ok(result.includes("#### Data Export Procedures"));
    assert.ok(result.includes("#### Data Portability"));
    assert.ok(result.includes("#### Alternative Services"));
    assert.ok(result.includes("#### Contract Termination"));
    assert.ok(result.includes("#### Key Migration Risks"));
    assert.ok(result.includes("#### Migration Checklist"));
  });

  it("includes Stripe-specific alternatives", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("openai", "ai", ["user prompts"]),
      ],
    });
    const result = generateVendorExitPlan(scan)!;
    assert.ok(result.includes("PayPal/Braintree"));
    assert.ok(result.includes("Adyen"));
  });

  it("includes Stripe-specific key risks", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("openai", "ai", ["user prompts"]),
      ],
    });
    const result = generateVendorExitPlan(scan)!;
    assert.ok(result.includes("Active subscription migration complexity"));
    assert.ok(result.includes("PCI compliance re-certification"));
  });

  it("includes migration checklist for each vendor", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateVendorExitPlan(scan)!;
    assert.ok(result.includes("Export all data from Stripe"));
    assert.ok(result.includes("Export all data from PostHog"));
  });

  it("uses default exit info for unknown vendors", () => {
    const scan = makeScan({
      services: [
        makeService("unknown-vendor", "ai", ["data"]),
        makeService("another-unknown", "analytics", ["metrics"]),
      ],
    });
    const result = generateVendorExitPlan(scan)!;
    assert.ok(result.includes("[Research alternatives based on your requirements]"));
    assert.ok(result.includes("[Contact vendor for data export procedures]"));
  });

  // ── Provider name mapping ─────────────────────────────────────────

  it("maps @sentry/node to Sentry provider name", () => {
    const scan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring", ["error traces"]),
        makeService("stripe", "payment", ["payment info"]),
      ],
    });
    const result = generateVendorExitPlan(scan)!;
    assert.ok(result.includes("### Sentry"));
    assert.ok(result.includes("Bugsnag"));
  });

  it("maps @clerk/nextjs to Clerk provider name", () => {
    const scan = makeScan({
      services: [
        makeService("@clerk/nextjs", "auth", ["user credentials"]),
        makeService("stripe", "payment", ["payment info"]),
      ],
    });
    const result = generateVendorExitPlan(scan)!;
    assert.ok(result.includes("### Clerk"));
    assert.ok(result.includes("Auth0"));
  });

  it("maps @sendgrid/mail to SendGrid provider name", () => {
    const scan = makeScan({
      services: [
        makeService("@sendgrid/mail", "email", ["email address"]),
        makeService("stripe", "payment", ["payment info"]),
      ],
    });
    const result = generateVendorExitPlan(scan)!;
    assert.ok(result.includes("### SendGrid"));
    assert.ok(result.includes("Resend"));
  });

  // ── Deduplication ─────────────────────────────────────────────────

  it("deduplicates providers that map to the same name", () => {
    const scan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring", ["error traces"]),
        makeService("@sentry/nextjs", "monitoring", ["error traces"]),
        makeService("@sentry/react", "monitoring", ["error traces"]),
        makeService("stripe", "payment", ["payment info"]),
      ],
    });
    const result = generateVendorExitPlan(scan)!;
    // Sentry should appear only once in the detailed plans
    const sentryHeaders = result.match(/### Sentry/g);
    assert.ok(sentryHeaders !== null);
    assert.strictEqual(sentryHeaders.length, 1);
  });

  // ── Migration complexity labels ───────────────────────────────────

  it("shows High complexity for Stripe", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("resend", "email", ["email address"]),
      ],
    });
    const result = generateVendorExitPlan(scan)!;
    assert.ok(result.includes("High"));
  });

  it("shows Low complexity for Resend", () => {
    const scan = makeScan({
      services: [
        makeService("resend", "email", ["email address"]),
        makeService("stripe", "payment", ["payment info"]),
      ],
    });
    const result = generateVendorExitPlan(scan)!;
    assert.ok(result.includes("Low"));
  });

  // ── General migration framework ───────────────────────────────────

  it("includes general migration framework", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateVendorExitPlan(scan)!;
    assert.ok(result.includes("## General Migration Framework"));
    assert.ok(result.includes("Phase 1: Planning"));
    assert.ok(result.includes("Phase 2: Preparation"));
    assert.ok(result.includes("Phase 3: Migration"));
    assert.ok(result.includes("Phase 4: Cutover"));
    assert.ok(result.includes("Phase 5: Post-Migration"));
  });

  // ── Data deletion verification ────────────────────────────────────

  it("includes data deletion verification section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateVendorExitPlan(scan)!;
    assert.ok(result.includes("## Data Deletion Verification"));
    assert.ok(result.includes("GDPR Art. 17"));
    assert.ok(result.includes("API keys"));
  });

  // ── Review schedule ───────────────────────────────────────────────

  it("includes review schedule", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateVendorExitPlan(scan)!;
    assert.ok(result.includes("## Review Schedule"));
    assert.ok(result.includes("Annually"));
  });

  // ── Disclaimer ────────────────────────────────────────────────────

  it("includes Codepliant attribution and legal disclaimer", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateVendorExitPlan(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("does not constitute legal advice"));
  });

  // ── Category in exit plan details ─────────────────────────────────

  it("includes service category in detailed exit plan", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("openai", "ai", ["user prompts"]),
      ],
    });
    const result = generateVendorExitPlan(scan)!;
    assert.ok(result.includes("**Category:** payment"));
    assert.ok(result.includes("**Category:** ai"));
  });
});
