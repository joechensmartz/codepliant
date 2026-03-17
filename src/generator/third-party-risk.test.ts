import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateThirdPartyRiskAssessment } from "./third-party-risk.js";
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

describe("generateThirdPartyRiskAssessment", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when no services are detected", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateThirdPartyRiskAssessment(scan), null);
  });

  it("returns null when fewer than 3 third-party services detected", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
      ],
    });
    assert.strictEqual(generateThirdPartyRiskAssessment(scan), null);
  });

  it("returns null when only self-hosted services detected", () => {
    const scan = makeScan({
      services: [
        makeService("prisma", "database", ["user records"]),
        makeService("nodemailer", "email", ["email addresses"]),
        makeService("passport", "auth", ["user credentials"]),
        makeService("ioredis", "database", ["cache data"]),
      ],
    });
    assert.strictEqual(generateThirdPartyRiskAssessment(scan), null);
  });

  it("returns null with 2 third-party and many self-hosted services", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("prisma", "database", ["user records"]),
        makeService("nodemailer", "email", ["emails"]),
        makeService("ioredis", "database", ["cache"]),
      ],
    });
    assert.strictEqual(generateThirdPartyRiskAssessment(scan), null);
  });

  it("returns null with exactly 1 third-party service", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    assert.strictEqual(generateThirdPartyRiskAssessment(scan), null);
  });

  // ── Basic generation ──────────────────────────────────────────────

  it("generates assessment when at least 3 third-party services detected", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Third-Party Risk Assessment"));
  });

  it("includes the project name", () => {
    const scan = makeScan({
      projectName: "my-saas-app",
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("my-saas-app"));
  });

  it("includes a last-updated date", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("**Last updated:**"));
  });

  // ── Context / Company Info ─────────────────────────────────────────

  it("uses default company name when no context provided", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses provided company name from context", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "hi@acme.com" };
    const result = generateThirdPartyRiskAssessment(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses provided contact email from context", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "risk@acme.com" };
    const result = generateThirdPartyRiskAssessment(scan, ctx)!;
    assert.ok(result.includes("risk@acme.com"));
  });

  // ── Provider Name Resolution ──────────────────────────────────────

  it("resolves OpenAI provider name", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("OpenAI"));
  });

  it("resolves Stripe provider name", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("Stripe"));
  });

  it("resolves PostHog provider name", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("PostHog"));
  });

  it("uses raw service name when no known provider mapping exists", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("unknown-vendor", "other", ["misc data"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("unknown-vendor"));
  });

  // ── Deduplication ──────────────────────────────────────────────────

  it("deduplicates services with the same provider name", () => {
    const scan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring", ["error logs"]),
        makeService("@sentry/nextjs", "monitoring", ["error logs"]),
        makeService("@sentry/react", "monitoring", ["error logs"]),
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    const sentryMatches = result.match(/### Sentry/g);
    assert.ok(sentryMatches !== null);
    assert.strictEqual(sentryMatches.length, 1);
  });

  // ── Risk Matrix ───────────────────────────────────────────────────

  it("includes Risk Matrix section", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("Risk Matrix"));
  });

  it("includes data sensitivity column in risk matrix", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("Data Sensitivity"));
  });

  it("classifies payment services as high sensitivity", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    // Stripe row should contain "high"
    assert.ok(result.includes("| Stripe | payment | high |"));
  });

  it("classifies AI services as high sensitivity", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("| OpenAI | ai | high |"));
  });

  it("classifies analytics services as medium sensitivity", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("| PostHog | analytics | medium |"));
  });

  // ── Geographic Risk ───────────────────────────────────────────────

  it("identifies US-based services", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("US"));
  });

  it("identifies EU-based services", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("@lemonsqueezy/lemonsqueezy.js", "payment", ["payment data"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("EU"));
    assert.ok(result.includes("Low — within EEA"));
  });

  it("shows Medium geographic risk for US-based services", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("Medium — EU-US Data Privacy Framework applicable"));
  });

  it("shows High geographic risk for unknown-location services", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("some-unknown-svc", "other", ["misc"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("High — verify adequacy decision or implement SCCs"));
  });

  // ── Certifications ────────────────────────────────────────────────

  it("includes known certifications for OpenAI", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("SOC 2 Type II"));
  });

  it("includes PCI DSS certification for Stripe", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("PCI DSS Level 1"));
  });

  it("shows 'None verified' for unknown services", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("some-unknown-svc", "other", ["misc"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("None verified"));
  });

  // ── Detailed Vendor Assessments ───────────────────────────────────

  it("includes Detailed Vendor Assessments section", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("Detailed Vendor Assessments"));
  });

  it("includes processing scope for each vendor", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("Processing Scope"));
  });

  it("includes risk mitigation measures for each vendor", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("Risk Mitigation Measures"));
    assert.ok(result.includes("Data minimization"));
  });

  it("includes required contracts for each vendor", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("Required Contracts"));
    assert.ok(result.includes("DPA (Data Processing Agreement)"));
  });

  // ── Vendor Due Diligence Checklist ─────────────────────────────────

  it("includes Vendor Due Diligence Checklist", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("Vendor Due Diligence Checklist"));
    assert.ok(result.includes("Security Assessment"));
    assert.ok(result.includes("Breach Notification"));
    assert.ok(result.includes("Encryption"));
  });

  // ── Contract Review Requirements ──────────────────────────────────

  it("includes Contract Review Requirements section", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("Contract Review Requirements"));
  });

  it("includes DPA minimum requirements list", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("DPA Minimum Requirements"));
    assert.ok(result.includes("Subject matter and duration"));
    assert.ok(result.includes("Audit rights"));
  });

  it("includes SCCs requirement for US-based high-sensitivity services", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("Standard Contractual Clauses"));
  });

  it("includes AI data usage addendum for AI services", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("AI-specific data usage addendum"));
  });

  // ── Review Schedule ───────────────────────────────────────────────

  it("includes Review Schedule section", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("Review Schedule"));
    assert.ok(result.includes("Annually"));
  });

  // ── Disclaimer ────────────────────────────────────────────────────

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("does not constitute legal advice"));
  });

  // ── Vendor count ──────────────────────────────────────────────────

  it("shows correct vendor count in overview", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("Total third-party vendors assessed: **3**"));
  });

  it("shows correct vendor count after deduplication", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
        makeService("@sentry/node", "monitoring", ["error logs"]),
        makeService("@sentry/nextjs", "monitoring", ["error logs"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    // 4 unique providers (Sentry deduplicated)
    assert.ok(result.includes("Total third-party vendors assessed: **4**"));
  });

  // ── Edge Cases ────────────────────────────────────────────────────

  it("handles exactly 3 third-party services (minimum)", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan);
    assert.ok(result !== null);
  });

  it("handles many third-party services", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
        makeService("@clerk/nextjs", "auth", ["user profiles"]),
        makeService("@sendgrid/mail", "email", ["email addresses"]),
        makeService("@sentry/node", "monitoring", ["error logs"]),
        makeService("@aws-sdk/client-s3", "storage", ["files"]),
        makeService("twilio", "other", ["phone numbers"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("Third-Party Risk Assessment"));
    assert.ok(result.includes("OpenAI"));
    assert.ok(result.includes("Twilio"));
  });

  it("returns a non-empty string for valid input", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(typeof result === "string");
    assert.ok(result.length > 500);
  });

  it("excludes self-hosted services from assessment", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
        makeService("prisma", "database", ["user records"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    // Prisma is self-hosted and should not appear in assessment
    assert.ok(!result.includes("### Prisma"));
  });

  it("includes PCI DSS attestation for payment vendors", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("PCI DSS Attestation of Compliance"));
  });

  it("includes additional agreements table", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateThirdPartyRiskAssessment(scan)!;
    assert.ok(result.includes("Additional Agreements by Scenario"));
    assert.ok(result.includes("BAA (Business Associate Agreement)"));
    assert.ok(result.includes("COPPA-compliant agreement"));
  });
});
