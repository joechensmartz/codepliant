import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateDataMinimizationChecklist } from "./data-minimization-checklist.js";

function makeService(
  name: string,
  category: DetectedService["category"],
  dataCollected: string[] = [],
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

describe("generateDataMinimizationChecklist", () => {
  // ── Null guard ──────────────────────────────────────────────────────

  it("returns null when no services", () => {
    const scan = makeScan({ services: [] });
    const result = generateDataMinimizationChecklist(scan);
    assert.strictEqual(result, null);
  });

  it("returns a string when at least one service exists", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataMinimizationChecklist(scan);
    assert.strictEqual(typeof result, "string");
    assert.ok(result!.length > 0);
  });

  // ── Header and metadata ─────────────────────────────────────────────

  it("includes title", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("# Data Minimization Checklist"));
  });

  it("includes company name from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataMinimizationChecklist(scan, {
      companyName: "TestCo",
      contactEmail: "test@testco.com",
    })!;
    assert.ok(result.includes("TestCo"));
  });

  it("uses default company placeholder when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("includes project name", () => {
    const scan = makeScan({
      projectName: "my-app",
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("my-app"));
  });

  it("includes date in ISO format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.match(result, /\*\*Last updated:\*\* \d{4}-\d{2}-\d{2}/);
  });

  // ── Purpose section ─────────────────────────────────────────────────

  it("includes GDPR Article 5(1)(c) reference", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("GDPR Article 5(1)(c)"));
    assert.ok(result.includes("data minimization principle"));
  });

  it("includes disclaimer about legal advice", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("not legal advice"));
  });

  // ── Per-Service Analysis ────────────────────────────────────────────

  it("includes per-service data analysis section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("Per-Service Data Analysis"));
  });

  it("includes payment service fields for payment category", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("Payment"));
    assert.ok(result.includes("payment_info"));
    assert.ok(result.includes("billing_address"));
    assert.ok(result.includes("transaction_history"));
    assert.ok(result.includes("customer_email"));
  });

  it("includes AI service fields for AI category", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("openai"));
    assert.ok(result.includes("user_prompts"));
    assert.ok(result.includes("conversation_history"));
    assert.ok(result.includes("generated_content"));
    assert.ok(result.includes("model_usage_metadata"));
  });

  it("includes analytics service fields for analytics category", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("page_views"));
    assert.ok(result.includes("user_behavior"));
    assert.ok(result.includes("device_info"));
    assert.ok(result.includes("ip_address"));
  });

  it("includes auth service fields for auth category", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("email"));
    assert.ok(result.includes("password_hash"));
    assert.ok(result.includes("session_token"));
    assert.ok(result.includes("oauth_token"));
  });

  it("includes monitoring service fields", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("error_data"));
    assert.ok(result.includes("stack_traces"));
  });

  it("includes email service fields", () => {
    const scan = makeScan({ services: [makeService("sendgrid", "email")] });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("email_address"));
    assert.ok(result.includes("email_content"));
    assert.ok(result.includes("open_tracking"));
  });

  it("includes storage service fields", () => {
    const scan = makeScan({ services: [makeService("s3", "storage")] });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("uploaded_files"));
    assert.ok(result.includes("file_metadata"));
  });

  it("includes database service fields", () => {
    const scan = makeScan({ services: [makeService("postgres", "database")] });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("user_data"));
  });

  it("includes advertising service fields", () => {
    const scan = makeScan({ services: [makeService("google-ads", "advertising")] });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("conversion_events"));
    assert.ok(result.includes("device_fingerprint"));
    assert.ok(result.includes("cross_site_tracking"));
  });

  it("handles services with unknown categories gracefully", () => {
    const scan = makeScan({
      services: [makeService("custom", "other" as DetectedService["category"])],
    });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("custom"));
  });

  // ── Declared data collection ────────────────────────────────────────

  it("includes declared dataCollected from scan", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card_number", "cvv"])],
    });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("Declared data collection:"));
    assert.ok(result.includes("card_number"));
    assert.ok(result.includes("cvv"));
  });

  it("adds extra fields from dataCollected not in category template", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["custom_field_xyz"])],
    });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("custom_field_xyz"));
    assert.ok(result.includes("Review needed"));
  });

  it("does not duplicate fields already in category template", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment_info"])],
    });
    const result = generateDataMinimizationChecklist(scan)!;
    // payment_info appears in the category template; should not get a "Review needed" row
    const reviewNeededMatches = result.match(/payment_info.*Review needed/g);
    assert.strictEqual(reviewNeededMatches, null);
  });

  // ── Data Reduction Opportunities ────────────────────────────────────

  it("includes Data Reduction Opportunities for categories with unnecessary fields", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("Data Reduction Opportunities"));
    assert.ok(result.includes("may not be necessary"));
  });

  it("omits Data Reduction section when all fields are needed", () => {
    // database category only has user_data which is likelyNeeded=true
    const scan = makeScan({ services: [makeService("postgres", "database")] });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(!result.includes("Data Reduction Opportunities"));
  });

  it("counts unnecessary fields correctly", () => {
    // analytics has 4 fields, all with likelyNeeded=false
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("4 data field(s)"));
  });

  // ── Summary Statistics ──────────────────────────────────────────────

  it("includes Summary section with metrics", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("Summary"));
    assert.ok(result.includes("Services analyzed"));
    assert.ok(result.includes("Total data fields assessed"));
    assert.ok(result.includes("Fields likely needed"));
    assert.ok(result.includes("Fields potentially unnecessary"));
    assert.ok(result.includes("Potential data reduction"));
  });

  it("shows correct service count in summary", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("sentry", "monitoring"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("| Services analyzed | 3 |"));
  });

  // ── GDPR Compliance Checklist ───────────────────────────────────────

  it("includes GDPR Article 5(1)(c) compliance checklist", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("GDPR Article 5(1)(c) Compliance Checklist"));
    assert.ok(result.includes("documented, specific purpose"));
    assert.ok(result.includes("Pseudonymization"));
    assert.ok(result.includes("retention periods"));
    assert.ok(result.includes("privacy by default"));
  });

  // ── Practical Steps ─────────────────────────────────────────────────

  it("includes Practical Steps section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("Practical Steps for Data Reduction"));
    assert.ok(result.includes("Audit each field"));
    assert.ok(result.includes("Eliminate unnecessary collection"));
    assert.ok(result.includes("Anonymize where possible"));
    assert.ok(result.includes("Shorten retention"));
    assert.ok(result.includes("Review regularly"));
  });

  // ── Related Documents ───────────────────────────────────────────────

  it("includes Related Documents section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("Related Documents"));
    assert.ok(result.includes("DATA_DICTIONARY.md"));
    assert.ok(result.includes("DATA_RETENTION_POLICY.md"));
    assert.ok(result.includes("PRIVACY_POLICY.md"));
    assert.ok(result.includes("RECORD_OF_PROCESSING.md"));
  });

  it("includes contact email in related documents", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataMinimizationChecklist(scan, {
      companyName: "TestCo",
      contactEmail: "dpo@testco.com",
    })!;
    assert.ok(result.includes("dpo@testco.com"));
  });

  // ── Footer ──────────────────────────────────────────────────────────

  it("includes Codepliant footer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataMinimizationChecklist(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("does not constitute legal advice"));
  });

  // ── Combined scenarios ──────────────────────────────────────────────

  it("handles multiple services across categories", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
        makeService("next-auth", "auth"),
        makeService("sentry", "monitoring"),
      ],
    });
    const result = generateDataMinimizationChecklist(scan, {
      companyName: "BigCo",
      contactEmail: "privacy@bigco.com",
    })!;
    // All services present
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("openai"));
    assert.ok(result.includes("posthog"));
    assert.ok(result.includes("next-auth"));
    assert.ok(result.includes("sentry"));
    // Summary shows 5 services
    assert.ok(result.includes("| Services analyzed | 5 |"));
    // Has reduction opportunities (analytics, AI, monitoring have unnecessary fields)
    assert.ok(result.includes("Data Reduction Opportunities"));
    assert.ok(result.includes("BigCo"));
    assert.ok(result.includes("privacy@bigco.com"));
  });

  it("handles service with dataCollected that overlaps and extends category template", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user_prompts", "api_key", "organization_id"]),
      ],
    });
    const result = generateDataMinimizationChecklist(scan)!;
    // user_prompts is in template, should not get Review needed row
    // api_key and organization_id are NOT in the template, should get Review needed
    assert.ok(result.includes("api_key"));
    assert.ok(result.includes("organization_id"));
    assert.ok(result.includes("Declared data collection:"));
  });
});
