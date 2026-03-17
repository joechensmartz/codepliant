import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateVendorContacts } from "./vendor-contacts.js";
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

describe("generateVendorContacts", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateVendorContacts(scan), null);
  });

  it("returns null when all services are self-hosted", () => {
    const scan = makeScan({
      services: [
        makeService("prisma", "database"),
        makeService("nodemailer", "email"),
        makeService("passport", "auth"),
      ],
    });
    assert.strictEqual(generateVendorContacts(scan), null);
  });

  it("returns null with only self-hosted auth libraries", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("better-auth", "auth"),
        makeService("@auth/core", "auth"),
      ],
    });
    assert.strictEqual(generateVendorContacts(scan), null);
  });

  // ── Generation with third-party services ──────────────────────────

  it("generates contacts with a single third-party service", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorContacts(scan)!;
    assert.ok(result !== null);
    assert.ok(result.includes("Vendor Contacts Directory"));
  });

  it("generates contacts with multiple third-party services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateVendorContacts(scan)!;
    assert.ok(result.includes("Stripe"));
    assert.ok(result.includes("PostHog"));
    assert.ok(result.includes("OpenAI"));
  });

  it("generates contacts with mixed third-party and self-hosted services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("prisma", "database"),
        makeService("posthog", "analytics"),
        makeService("nodemailer", "email"),
      ],
    });
    const result = generateVendorContacts(scan)!;
    assert.ok(result.includes("Stripe"));
    assert.ok(result.includes("PostHog"));
    // Self-hosted should be excluded
    assert.ok(!result.includes("Prisma (database ORM)"));
    assert.ok(!result.includes("Nodemailer"));
  });

  // ── Context values ────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generateVendorContacts(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorContacts(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "privacy@acme.com" };
    const result = generateVendorContacts(scan, ctx)!;
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("uses placeholder email when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorContacts(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorContacts(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes project name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorContacts(scan)!;
    assert.ok(result.includes("test-project"));
  });

  // ── Key sections ──────────────────────────────────────────────────

  it("includes Overview section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorContacts(scan)!;
    assert.ok(result.includes("## Overview"));
    assert.ok(result.includes("Data Subject Access Request"));
  });

  it("includes Vendor Contact Table section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorContacts(scan)!;
    assert.ok(result.includes("## Vendor Contact Table"));
    assert.ok(result.includes("Privacy Email"));
    assert.ok(result.includes("DPA Contact"));
    assert.ok(result.includes("Data Deletion"));
    assert.ok(result.includes("Status Page"));
    assert.ok(result.includes("Incident Reporting"));
  });

  it("includes Detailed Vendor Contacts section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorContacts(scan)!;
    assert.ok(result.includes("## Detailed Vendor Contacts"));
    assert.ok(result.includes("### Stripe"));
  });

  it("includes DSAR Quick-Reference Checklist", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorContacts(scan)!;
    assert.ok(result.includes("## DSAR Quick-Reference Checklist"));
    assert.ok(result.includes("Identify which vendors"));
    assert.ok(result.includes("14-day follow-up"));
  });

  it("includes response deadlines for GDPR and CCPA", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorContacts(scan)!;
    assert.ok(result.includes("**GDPR:** 30 calendar days"));
    assert.ok(result.includes("**CCPA:** 45 calendar days"));
  });

  it("includes Maintaining This Document section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorContacts(scan)!;
    assert.ok(result.includes("## Maintaining This Document"));
    assert.ok(result.includes("Quarterly"));
  });

  // ── Known vendor contact details ──────────────────────────────────

  it("includes Stripe privacy email", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorContacts(scan)!;
    assert.ok(result.includes("privacy@stripe.com"));
  });

  it("includes Stripe DPA URL", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorContacts(scan)!;
    assert.ok(result.includes("stripe.com/legal/dpa"));
  });

  it("includes Stripe status page", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorContacts(scan)!;
    assert.ok(result.includes("status.stripe.com"));
  });

  it("includes OpenAI contact details", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateVendorContacts(scan)!;
    assert.ok(result.includes("privacy@openai.com"));
    assert.ok(result.includes("status.openai.com"));
  });

  it("includes PostHog contact details", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateVendorContacts(scan)!;
    assert.ok(result.includes("privacy@posthog.com"));
    assert.ok(result.includes("posthog.com/docs/privacy/dpa"));
  });

  it("includes SendGrid contact details", () => {
    const scan = makeScan({ services: [makeService("@sendgrid/mail", "email")] });
    const result = generateVendorContacts(scan)!;
    assert.ok(result.includes("SendGrid"));
    assert.ok(result.includes("privacy@twilio.com"));
  });

  it("includes Sentry contact details", () => {
    const scan = makeScan({ services: [makeService("@sentry/node", "monitoring")] });
    const result = generateVendorContacts(scan)!;
    assert.ok(result.includes("Sentry"));
    assert.ok(result.includes("dpa@sentry.io"));
  });

  it("includes Clerk contact details", () => {
    const scan = makeScan({ services: [makeService("@clerk/nextjs", "auth")] });
    const result = generateVendorContacts(scan)!;
    assert.ok(result.includes("Clerk"));
    assert.ok(result.includes("privacy@clerk.com"));
  });

  // ── Unknown vendor fallback ───────────────────────────────────────

  it("uses placeholder for unknown vendor contacts", () => {
    const scan = makeScan({ services: [makeService("unknown-vendor", "other")] });
    const result = generateVendorContacts(scan)!;
    assert.ok(result.includes("[Request from vendor]"));
    assert.ok(result.includes("[Contact vendor directly]"));
  });

  // ── Provider name mapping ─────────────────────────────────────────

  it("maps package name to human-readable provider name", () => {
    const scan = makeScan({ services: [makeService("@anthropic-ai/sdk", "ai")] });
    const result = generateVendorContacts(scan)!;
    assert.ok(result.includes("Anthropic"));
    assert.ok(result.includes("privacy@anthropic.com"));
  });

  it("deduplicates same-provider services", () => {
    const scan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring"),
        makeService("@sentry/nextjs", "monitoring"),
        makeService("@sentry/react", "monitoring"),
      ],
    });
    const result = generateVendorContacts(scan)!;
    // "### Sentry" should appear exactly once in detailed section
    const matches = result.match(/### Sentry/g);
    assert.ok(matches !== null);
    assert.strictEqual(matches.length, 1);
  });

  // ── Codepliant attribution ────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorContacts(scan)!;
    assert.ok(result.includes("Codepliant"));
  });

  it("includes disclaimer about verifying contact details", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorContacts(scan)!;
    assert.ok(result.includes("Verify all URLs and email addresses before use"));
  });
});
