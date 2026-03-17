import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateVendorRiskTierAssessment } from "./vendor-risk-tier.js";
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

describe("generateVendorRiskTierAssessment", () => {
  // ── Null guards ─────────────────────────────────────────────────────

  it("returns null when no services are present", () => {
    const scan = makeScan({ services: [] });
    const result = generateVendorRiskTierAssessment(scan);
    assert.strictEqual(result, null);
  });

  it("returns null when only self-hosted services are present", () => {
    const scan = makeScan({
      services: [
        makeService("prisma", "database"),
        makeService("nodemailer", "email"),
        makeService("ioredis", "database"),
      ],
    });
    const result = generateVendorRiskTierAssessment(scan);
    assert.strictEqual(result, null);
  });

  it("returns null for passport (self-hosted auth)", () => {
    const scan = makeScan({
      services: [makeService("passport", "auth")],
    });
    const result = generateVendorRiskTierAssessment(scan);
    assert.strictEqual(result, null);
  });

  // ── Basic generation ────────────────────────────────────────────────

  it("returns a non-null string for third-party services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan);
    assert.ok(result !== null);
    assert.ok(result!.length > 0);
  });

  it("includes title", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("# Vendor Risk Tier Assessment"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes project name", () => {
    const scan = makeScan({
      projectName: "my-saas-app",
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("my-saas-app"));
  });

  // ── Context values ──────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "info@acme.com" };
    const result = generateVendorRiskTierAssessment(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "security@acme.com" };
    const result = generateVendorRiskTierAssessment(scan, ctx)!;
    assert.ok(result.includes("security@acme.com"));
  });

  it("uses placeholder email when no context", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  // ── Executive Summary ───────────────────────────────────────────────

  it("includes executive summary", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("## Executive Summary"));
  });

  it("shows correct vendor count in summary", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment data"]),
        makeService("openai", "ai", ["user prompts"]),
      ],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("2 third-party vendors"));
  });

  it("includes three risk factors in summary", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("Data Sensitivity"));
    assert.ok(result.includes("Data Volume"));
    assert.ok(result.includes("Replaceability"));
  });

  // ── Tier Distribution ───────────────────────────────────────────────

  it("includes tier distribution table", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("### Tier Distribution"));
    assert.ok(result.includes("Critical"));
    assert.ok(result.includes("High"));
    assert.ok(result.includes("Medium"));
    assert.ok(result.includes("Low"));
  });

  // ── Risk Tier Definitions ───────────────────────────────────────────

  it("includes risk tier definitions section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("## Risk Tier Definitions"));
    assert.ok(result.includes("### Critical Risk"));
    assert.ok(result.includes("### High Risk"));
    assert.ok(result.includes("### Medium Risk"));
    assert.ok(result.includes("### Low Risk"));
  });

  it("includes review frequencies in tier definitions", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("Quarterly (every 3 months)"));
    assert.ok(result.includes("Semi-annually (every 6 months)"));
    assert.ok(result.includes("Annually (every 12 months)"));
    assert.ok(result.includes("Biannually (every 24 months)"));
  });

  // ── Vendor Risk Summary Table ───────────────────────────────────────

  it("includes vendor risk summary table", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("## Vendor Risk Summary"));
    assert.ok(result.includes("| Vendor |"));
    assert.ok(result.includes("Sensitivity"));
  });

  // ── Provider name mapping ───────────────────────────────────────────

  it("maps stripe to Stripe provider name", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("**Stripe**"));
  });

  it("maps openai to OpenAI provider name", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("**OpenAI**"));
  });

  it("maps @anthropic-ai/sdk to Anthropic provider name", () => {
    const scan = makeScan({
      services: [makeService("@anthropic-ai/sdk", "ai", ["messages"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("**Anthropic**"));
  });

  it("maps @sentry/node to Sentry provider name", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring", ["error reports"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("**Sentry**"));
  });

  it("uses raw package name for unknown providers", () => {
    const scan = makeScan({
      services: [makeService("unknown-service", "other", ["data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("**unknown-service**"));
  });

  // ── Risk tier classification ────────────────────────────────────────

  it("classifies stripe as Critical (high sensitivity + high volume + hard to replace)", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("Critical Risk Vendors"));
    assert.ok(result.includes("**Stripe**"));
  });

  it("classifies analytics service as Medium or Low tier", () => {
    const scan = makeScan({
      services: [makeService("mixpanel", "analytics", ["page views"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    // Analytics has sensitivity 2, not high volume or hard to replace => Low
    assert.ok(result.includes("Low Risk Vendors") || result.includes("Medium Risk Vendors"));
  });

  it("classifies high-volume analytics as Medium or High", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["user behavior"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("**PostHog**"));
    // posthog is high-volume (sensitivity 2 + 2 for volume = 4) => Medium
    assert.ok(result.includes("Medium"));
  });

  // ── Data sensitivity scoring ────────────────────────────────────────

  it("shows sensitivity 5/5 for payment services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("5/5"));
  });

  it("shows sensitivity 4/5 for AI services", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("4/5"));
  });

  it("shows sensitivity 2/5 for analytics services", () => {
    const scan = makeScan({
      services: [makeService("mixpanel", "analytics", ["page views"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("2/5"));
  });

  // ── Risk factors ────────────────────────────────────────────────────

  it("includes PCI DSS risk factor for payment services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("PCI DSS"));
  });

  it("includes AI exposure risk factor for AI services", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("unintended data exposure"));
  });

  it("includes high data volume risk factor for high-volume services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("High data volume"));
  });

  it("includes hard-to-replace risk factor for locked-in services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("Difficult to replace"));
  });

  it("includes auth-specific risk factor for auth services", () => {
    const scan = makeScan({
      services: [makeService("@clerk/nextjs", "auth", ["user identity"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("high-value target for attackers"));
  });

  // ── Mitigations ─────────────────────────────────────────────────────

  it("always includes DPA mitigation", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("Ensure DPA is signed and current"));
  });

  it("includes encryption mitigation for sensitive services", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("encryption at rest and in transit"));
  });

  it("includes vendor exit plan mitigation for hard-to-replace services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("vendor exit plan"));
  });

  it("includes PCI compliance mitigation for payment services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("PCI DSS Level 1 compliance"));
  });

  it("includes model training opt-out mitigation for AI services", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("opt-out of model training"));
  });

  it("includes MFA mitigation for auth services", () => {
    const scan = makeScan({
      services: [makeService("@clerk/nextjs", "auth", ["user identity"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("MFA support"));
  });

  it("always includes monitor vendor status mitigation", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("Monitor vendor status page"));
  });

  // ── Deduplication ───────────────────────────────────────────────────

  it("deduplicates providers with same name (e.g., multiple Sentry packages)", () => {
    const scan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring", ["errors"]),
        makeService("@sentry/nextjs", "monitoring", ["errors"]),
        makeService("@sentry/react", "monitoring", ["errors"]),
      ],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    // Should show only 1 vendor, not 3
    assert.ok(result.includes("1 third-party vendors"));
  });

  // ── Detailed Vendor Risk Profiles ───────────────────────────────────

  it("includes detailed vendor profiles section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("## Detailed Vendor Risk Profiles"));
  });

  it("includes per-vendor factor table", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("| **Category** |"));
    assert.ok(result.includes("| **Risk Tier** |"));
    assert.ok(result.includes("| **Data Sensitivity** |"));
    assert.ok(result.includes("| **Data Volume** |"));
    assert.ok(result.includes("| **Replaceability** |"));
    assert.ok(result.includes("| **Review Frequency** |"));
  });

  it("includes data collected in vendor profile", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card numbers", "billing address"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("card numbers, billing address"));
  });

  // ── Review Schedule ─────────────────────────────────────────────────

  it("includes review schedule section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("## Review Schedule"));
    assert.ok(result.includes("Quarterly Review"));
    assert.ok(result.includes("Semi-Annual Review"));
    assert.ok(result.includes("Annual Review"));
    assert.ok(result.includes("Biannual Review"));
  });

  it("includes review checklist", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("### Review Checklist"));
    assert.ok(result.includes("Verify DPA is current"));
    assert.ok(result.includes("SOC 2"));
    assert.ok(result.includes("sub-processor list"));
  });

  // ── Methodology ─────────────────────────────────────────────────────

  it("includes methodology section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("## Methodology"));
    assert.ok(result.includes("### Scoring Criteria"));
  });

  it("includes sensitivity scoring table", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("Financial / health data"));
    assert.ok(result.includes("Identity / credential data"));
    assert.ok(result.includes("Behavioral / technical data"));
  });

  it("includes replaceability definitions", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("**Easy**"));
    assert.ok(result.includes("**Moderate**"));
    assert.ok(result.includes("**Difficult**"));
  });

  // ── Maintaining section ─────────────────────────────────────────────

  it("includes maintaining assessment section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("## Maintaining This Assessment"));
  });

  // ── Disclaimer ──────────────────────────────────────────────────────

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("validated against your organization"));
  });

  // ── Multiple vendors across tiers ───────────────────────────────────

  it("handles multiple vendors across different tiers", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment data"]),
        makeService("openai", "ai", ["user prompts"]),
        makeService("posthog", "analytics", ["page views"]),
        makeService("resend", "email", ["email addresses"]),
      ],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    assert.ok(result.includes("4 third-party vendors"));
    assert.ok(result.includes("**Stripe**"));
    assert.ok(result.includes("**OpenAI**"));
    assert.ok(result.includes("**PostHog**"));
    assert.ok(result.includes("**Resend**"));
  });

  // ── Self-hosted are excluded even when mixed ────────────────────────

  it("excludes self-hosted services when mixed with third-party", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment data"]),
        makeService("prisma", "database", ["user data"]),
        makeService("nodemailer", "email", ["emails"]),
      ],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    // Only Stripe should count
    assert.ok(result.includes("1 third-party vendors"));
  });

  // ── Sorting by tier severity ────────────────────────────────────────

  it("sorts vendors by tier severity (Critical first)", () => {
    const scan = makeScan({
      services: [
        makeService("mixpanel", "analytics", ["page views"]),  // Low
        makeService("stripe", "payment", ["payment data"]),     // Critical
      ],
    });
    const result = generateVendorRiskTierAssessment(scan)!;
    const stripePos = result.indexOf("**Stripe**");
    const mixpanelPos = result.indexOf("**Mixpanel**");
    assert.ok(stripePos < mixpanelPos, "Stripe (Critical) should appear before Mixpanel (Low)");
  });
});
