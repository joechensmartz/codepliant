import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateVendorComplianceTracker } from "./vendor-compliance-tracker.js";
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

describe("generateVendorComplianceTracker", () => {
  // ── Null guards ──────────────────────────────────────────────────────

  it("returns null when no services detected", () => {
    const result = generateVendorComplianceTracker(makeScan());
    assert.strictEqual(result, null);
  });

  it("returns null when only self-hosted services detected", () => {
    const scan = makeScan({ services: [makeService("prisma", "database")] });
    const result = generateVendorComplianceTracker(scan);
    assert.strictEqual(result, null);
  });

  it("returns null for all self-hosted services", () => {
    const scan = makeScan({
      services: [
        makeService("prisma", "database"),
        makeService("drizzle", "database"),
        makeService("mongoose", "database"),
        makeService("ioredis", "database"),
        makeService("nodemailer", "email"),
        makeService("passport", "auth"),
      ],
    });
    const result = generateVendorComplianceTracker(scan);
    assert.strictEqual(result, null);
  });

  // ── Basic generation ──────────────────────────────────────────────────

  it("generates document when third-party services are present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(typeof result === "string");
    assert.ok(result.includes("# Vendor Compliance Tracker"));
  });

  it("includes date in ISO format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result!));
  });

  it("includes project name", () => {
    const scan = makeScan({
      projectName: "my-saas-app",
      services: [makeService("stripe", "payment")],
    });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("my-saas-app"));
  });

  // ── Context values ────────────────────────────────────────────────────

  it("uses company name from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ companyName: "TestCo Inc" });
    const result = generateVendorComplianceTracker(scan, ctx);
    assert.ok(result!.includes("TestCo Inc"));
  });

  it("uses contact email from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ contactEmail: "compliance@testco.com" });
    const result = generateVendorComplianceTracker(scan, ctx);
    assert.ok(result!.includes("compliance@testco.com"));
  });

  it("uses DPO name from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ dpoName: "Jane Smith" });
    const result = generateVendorComplianceTracker(scan, ctx);
    assert.ok(result!.includes("Jane Smith"));
  });

  it("uses DPO email from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ dpoEmail: "dpo@testco.com" });
    const result = generateVendorComplianceTracker(scan, ctx);
    assert.ok(result!.includes("dpo@testco.com"));
  });

  it("uses default placeholders when no context provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("[Your Company Name]"));
    assert.ok(result!.includes("[your-email@example.com]"));
    assert.ok(result!.includes("[DPO Name]"));
    assert.ok(result!.includes("[dpo@example.com]"));
  });

  // ── Vendor name resolution ────────────────────────────────────────────

  it("maps stripe to Stripe provider name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("**Stripe**"));
  });

  it("maps openai to OpenAI provider name", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("**OpenAI**"));
  });

  it("maps @sentry/node to Sentry provider name", () => {
    const scan = makeScan({ services: [makeService("@sentry/node", "monitoring")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("**Sentry**"));
  });

  it("maps @clerk/nextjs to Clerk provider name", () => {
    const scan = makeScan({ services: [makeService("@clerk/nextjs", "auth")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("**Clerk**"));
  });

  it("uses raw package name for unmapped services", () => {
    const scan = makeScan({ services: [makeService("custom-vendor-lib", "other")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("**custom-vendor-lib**"));
  });

  // ── Risk tier assignment ──────────────────────────────────────────────

  it("assigns Critical risk tier to payment services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("| Critical |"));
  });

  it("assigns High risk tier to AI services", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("| High |"));
  });

  it("assigns High risk tier to auth services", () => {
    const scan = makeScan({ services: [makeService("@clerk/nextjs", "auth")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("| High |"));
  });

  it("assigns Medium risk tier to database services", () => {
    const scan = makeScan({ services: [makeService("@supabase/supabase-js", "database")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("| Medium |"));
  });

  it("assigns Medium risk tier to email services", () => {
    const scan = makeScan({ services: [makeService("resend", "email")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("| Medium |"));
  });

  it("assigns Medium risk tier to storage services", () => {
    const scan = makeScan({ services: [makeService("@aws-sdk/client-s3", "storage")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("| Medium |"));
  });

  it("assigns Low risk tier to analytics services", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("| Low |"));
  });

  it("assigns Low risk tier to monitoring services", () => {
    const scan = makeScan({ services: [makeService("@sentry/node", "monitoring")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("| Low |"));
  });

  it("assigns Low risk tier to unknown category services", () => {
    const scan = makeScan({ services: [makeService("some-tool", "other")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("| Low |"));
  });

  // ── Deduplication ─────────────────────────────────────────────────────

  it("deduplicates vendors with the same provider name", () => {
    const scan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring"),
        makeService("@sentry/nextjs", "monitoring"),
        makeService("@sentry/react", "monitoring"),
      ],
    });
    const result = generateVendorComplianceTracker(scan);
    // Should have only 1 vendor (Sentry), not 3
    assert.ok(result!.includes("**1 third-party vendors**"));
  });

  it("filters out self-hosted services from vendor list", () => {
    const scan = makeScan({
      services: [
        makeService("prisma", "database"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("**Stripe**"));
    assert.ok(!result!.includes("**prisma**"));
    assert.ok(!result!.includes("**Prisma**"));
  });

  // ── Tier sorting ──────────────────────────────────────────────────────

  it("sorts vendors by risk tier severity (Critical first)", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics"),    // Low
        makeService("stripe", "payment"),         // Critical
        makeService("openai", "ai"),              // High
        makeService("resend", "email"),           // Medium
      ],
    });
    const result = generateVendorComplianceTracker(scan)!;
    const stripeIdx = result.indexOf("**Stripe**");
    const openaiIdx = result.indexOf("**OpenAI**");
    const resendIdx = result.indexOf("**Resend**");
    const posthogIdx = result.indexOf("**PostHog**");
    assert.ok(stripeIdx < openaiIdx);
    assert.ok(openaiIdx < resendIdx);
    assert.ok(resendIdx < posthogIdx);
  });

  // ── DPA contacts and privacy contacts ─────────────────────────────────

  it("includes DPA URL for known vendors", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("https://stripe.com/legal/dpa"));
  });

  it("includes privacy contact email for known vendors", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("privacy@stripe.com"));
  });

  it("shows placeholder for unknown vendor DPA URL", () => {
    const scan = makeScan({ services: [makeService("unknown-vendor", "other")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("[Request from vendor]"));
  });

  it("shows placeholder for unknown vendor contact", () => {
    const scan = makeScan({ services: [makeService("unknown-vendor", "other")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("[Contact vendor]"));
  });

  it("includes OpenAI DPA URL", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("https://openai.com/policies"));
  });

  it("includes Sentry privacy contact", () => {
    const scan = makeScan({ services: [makeService("@sentry/node", "monitoring")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("dpa@sentry.io"));
  });

  // ── Vendor distribution by risk tier table ────────────────────────────

  it("includes vendor distribution by risk tier table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("Vendor Distribution by Risk Tier"));
    assert.ok(result!.includes("Quarterly (every 3 months)"));
    assert.ok(result!.includes("Semi-annually (every 6 months)"));
    assert.ok(result!.includes("Annually (every 12 months)"));
    assert.ok(result!.includes("Biannually (every 24 months)"));
  });

  it("counts vendors per tier correctly", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),          // Critical
        makeService("openai", "ai"),               // High
        makeService("@anthropic-ai/sdk", "ai"),    // High
        makeService("posthog", "analytics"),        // Low
      ],
    });
    const result = generateVendorComplianceTracker(scan)!;
    // Critical: 1, High: 2, Medium: 0, Low: 1
    assert.ok(result.includes("| Critical | 1 |"));
    assert.ok(result.includes("| High | 2 |"));
    assert.ok(result.includes("| Medium | 0 |"));
    assert.ok(result.includes("| Low | 1 |"));
  });

  // ── Compliance status table ───────────────────────────────────────────

  it("includes compliance status table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("## Vendor Compliance Status"));
    assert.ok(result!.includes("| Vendor | DPA Signed |"));
  });

  it("marks DPA as pending for all vendors", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("[ ] Pending"));
  });

  it("marks last review as not yet reviewed", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("[Not yet reviewed]"));
  });

  // ── DPA Status Details section ────────────────────────────────────────

  it("includes DPA Status Details section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("## DPA Status Details"));
  });

  it("groups vendors by risk tier in DPA details", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("### Critical Risk Vendors"));
    assert.ok(result!.includes("### High Risk Vendors"));
  });

  it("omits tier sections with zero vendors", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    // Only Critical should appear (payment → Critical)
    assert.ok(result!.includes("### Critical Risk Vendors"));
    assert.ok(!result!.includes("### Low Risk Vendors"));
  });

  it("includes action items for each vendor", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("Obtain and sign DPA"));
    assert.ok(result!.includes("Conduct initial compliance review"));
    assert.ok(result!.includes("Verify data processing purposes"));
    assert.ok(result!.includes("Confirm sub-processor notifications"));
    assert.ok(result!.includes("Document data flows"));
  });

  it("renders DPA link for known vendors", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("[DPA Link](https://stripe.com/legal/dpa)"));
  });

  it("shows placeholder DPA link for unknown vendors", () => {
    const scan = makeScan({ services: [makeService("unknown-lib", "other")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("[Request from vendor]"));
  });

  // ── Review calendar ───────────────────────────────────────────────────

  it("includes upcoming review calendar", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("## Upcoming Review Calendar"));
  });

  it("review calendar includes vendor names", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("Stripe"));
  });

  it("review calendar shows YYYY-MM month format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(/\| \d{4}-\d{2} \|/.test(result!));
  });

  // ── Review checklist ──────────────────────────────────────────────────

  it("includes vendor compliance review checklist", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("## Vendor Compliance Review Checklist"));
  });

  it("includes pre-review checklist items", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("### Pre-Review"));
    assert.ok(result!.includes("DPA and verify it is signed"));
    assert.ok(result!.includes("SOC 2, ISO 27001"));
  });

  it("includes during-review checklist items", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("### During Review"));
    assert.ok(result!.includes("DSAR fulfillment"));
    assert.ok(result!.includes("encryption at rest and in transit"));
  });

  it("includes post-review checklist items", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("### Post-Review"));
    assert.ok(result!.includes("Schedule next review"));
  });

  // ── Escalation procedures ─────────────────────────────────────────────

  it("includes escalation procedures table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("## Escalation Procedures"));
    assert.ok(result!.includes("DPA not signed within 30 days"));
    assert.ok(result!.includes("Vendor breach notification"));
    assert.ok(result!.includes("Within 24 hours"));
  });

  // ── Maintaining document ──────────────────────────────────────────────

  it("includes maintenance section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("## Maintaining This Document"));
    assert.ok(result!.includes("Codepliant"));
  });

  // ── Disclaimer ────────────────────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("Codepliant"));
    assert.ok(result!.includes("does not constitute legal advice"));
  });

  // ── Combined scenario ─────────────────────────────────────────────────

  it("handles large mixed vendor set with all tiers", () => {
    const scan = makeScan({
      projectName: "enterprise-app",
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("@clerk/nextjs", "auth"),
        makeService("resend", "email"),
        makeService("@aws-sdk/client-s3", "storage"),
        makeService("posthog", "analytics"),
        makeService("@sentry/node", "monitoring"),
        makeService("prisma", "database"),   // self-hosted, excluded
      ],
    });
    const ctx = makeCtx({
      companyName: "Enterprise Inc",
      contactEmail: "compliance@enterprise.com",
      dpoName: "Data Officer",
      dpoEmail: "dpo@enterprise.com",
    });
    const result = generateVendorComplianceTracker(scan, ctx)!;
    assert.ok(result.includes("Enterprise Inc"));
    assert.ok(result.includes("compliance@enterprise.com"));
    assert.ok(result.includes("Data Officer"));
    assert.ok(result.includes("enterprise-app"));
    // 8 services minus 1 self-hosted = 7 vendors
    assert.ok(result.includes("**7 third-party vendors**"));
    assert.ok(result.includes("### Critical Risk Vendors"));
    assert.ok(result.includes("### High Risk Vendors"));
    assert.ok(result.includes("### Medium Risk Vendors"));
    assert.ok(result.includes("### Low Risk Vendors"));
  });

  it("handles multiple self-hosted services mixed with third-party", () => {
    const scan = makeScan({
      services: [
        makeService("prisma", "database"),
        makeService("nodemailer", "email"),
        makeService("passport", "auth"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateVendorComplianceTracker(scan)!;
    assert.ok(result.includes("**Stripe**"));
    assert.ok(result.includes("**1 third-party vendors**"));
  });

  it("includes vendor category in DPA details", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("| **Category** | payment |"));
  });

  it("maps @anthropic-ai/sdk to Anthropic", () => {
    const scan = makeScan({ services: [makeService("@anthropic-ai/sdk", "ai")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("**Anthropic**"));
    assert.ok(result!.includes("https://www.anthropic.com/privacy"));
  });

  it("maps @sendgrid/mail to SendGrid with Twilio DPA", () => {
    const scan = makeScan({ services: [makeService("@sendgrid/mail", "email")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("**SendGrid**"));
    assert.ok(result!.includes("twilio.com/legal/data-protection-addendum"));
  });

  it("maps firebase to Firebase (Google)", () => {
    const scan = makeScan({ services: [makeService("firebase", "database")] });
    const result = generateVendorComplianceTracker(scan);
    assert.ok(result!.includes("**Firebase (Google)**"));
    assert.ok(result!.includes("firebase.google.com/terms/data-processing-terms"));
  });
});
