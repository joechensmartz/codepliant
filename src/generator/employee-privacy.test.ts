import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateEmployeePrivacyNotice } from "./employee-privacy.js";
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

describe("generateEmployeePrivacyNotice", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when no services are detected", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateEmployeePrivacyNotice(scan), null);
  });

  // ── Basic generation ──────────────────────────────────────────────

  it("generates a notice when services are detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Employee Privacy Notice"));
  });

  it("includes effective date and last updated", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("**Effective Date:**"));
    assert.ok(result.includes("**Last Updated:**"));
  });

  it("includes internal document disclaimer", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("Internal document"));
  });

  // ── Context / Company Info ─────────────────────────────────────────

  it("uses default company name when no context provided", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses provided company name from context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "privacy@acme.com" };
    const result = generateEmployeePrivacyNotice(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses default contact email when no context provided", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses provided contact email from context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "hr@acme.com" };
    const result = generateEmployeePrivacyNotice(scan, ctx)!;
    assert.ok(result.includes("hr@acme.com"));
  });

  it("includes DPO name and email when provided", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "hr@acme.com",
      dpoName: "Jane Smith",
      dpoEmail: "dpo@acme.com",
    };
    const result = generateEmployeePrivacyNotice(scan, ctx)!;
    assert.ok(result.includes("Jane Smith"));
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("omits DPO section when not provided", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(!result.includes("Data Protection Officer:"));
  });

  // ── Section 1: Introduction & Scope ───────────────────────────────

  it("includes introduction and scope section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("Introduction & Scope"));
    assert.ok(result.includes("Articles 13 and 14"));
    assert.ok(result.includes("GDPR"));
  });

  it("includes data controller identification", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "hr@acme.com" };
    const result = generateEmployeePrivacyNotice(scan, ctx)!;
    assert.ok(result.includes("**Data Controller:** Acme Corp"));
  });

  // ── Section 2: Categories of Employee Data ────────────────────────

  it("includes employee data categories section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("Categories of Employee Data We Process"));
  });

  it("lists Identity & Contact Data category", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("Identity & Contact Data"));
    assert.ok(result.includes("Full name"));
  });

  it("lists Employment Data category", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("Employment Data"));
    assert.ok(result.includes("Job title"));
  });

  it("lists IT & Access Data category", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("IT & Access Data"));
    assert.ok(result.includes("IP address"));
  });

  it("lists Performance Data category", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("Performance Data"));
    assert.ok(result.includes("Performance reviews"));
  });

  it("lists Financial Data category", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("Financial Data"));
    assert.ok(result.includes("Bank account"));
  });

  it("includes GDPR legal basis for each data category", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("Art. 6(1)(b)"));
    assert.ok(result.includes("Art. 6(1)(c)"));
    assert.ok(result.includes("Art. 6(1)(f)"));
  });

  it("includes special category data notice (Art. 9)", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("Special category data"));
    assert.ok(result.includes("Art. 9(2)"));
  });

  // ── Section 3: Workplace Monitoring Tools ─────────────────────────

  it("includes monitoring tools section", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring", ["error logs"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("Workplace Monitoring Tools"));
  });

  it("lists known monitoring services with friendly names", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring", ["error logs"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("Sentry (error monitoring)"));
  });

  it("lists analytics services as monitoring tools", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["user events"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("PostHog (product analytics)"));
  });

  it("includes legitimate interest legal basis for monitoring", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring", ["error logs"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("Legitimate interest"));
    assert.ok(result.includes("Art. 6(1)(f)"));
  });

  it("notes that monitoring is not used for performance evaluation", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring", ["error logs"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("not for individual performance evaluation"));
  });

  it("shows no monitoring notice when no monitoring or analytics services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("No dedicated monitoring or analytics tools were detected"));
  });

  it("deduplicates monitoring services by label", () => {
    const scan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring", ["error logs"]),
        makeService("@sentry/nextjs", "monitoring", ["error logs"]),
      ],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    // "Sentry (error monitoring)" should appear only once
    const matches = result.match(/Sentry \(error monitoring\)/g);
    assert.strictEqual(matches?.length, 1);
  });

  // ── Section 4: AI Tools in the Workplace ──────────────────────────

  it("includes AI tools section when AI services detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts", "responses"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("AI Tools in the Workplace"));
  });

  it("lists known AI services with friendly names", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("OpenAI (GPT models)"));
  });

  it("lists Anthropic AI service with friendly name", () => {
    const scan = makeScan({
      services: [makeService("@anthropic-ai/sdk", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("Anthropic (Claude)"));
  });

  it("shows data processed for AI services", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts", "user data", "responses"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("prompts"));
    assert.ok(result.includes("user data"));
    assert.ok(result.includes("responses"));
  });

  it("includes AI accuracy review notice", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("reviewed for accuracy"));
  });

  it("mentions not inputting sensitive personal data into AI tools", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("Do not input sensitive personal data"));
  });

  it("includes Art. 22 GDPR reference for AI automated decisions", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("Art. 22 GDPR"));
  });

  it("shows no AI notice when no AI services detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("No AI services were detected"));
  });

  // ── Section 5: Data Sharing with Third Parties ────────────────────

  it("includes data sharing section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("Data Sharing with Third Parties"));
  });

  it("lists third-party services (excludes database)", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["prompts"]),
        makeService("prisma", "database", ["user records"]),
      ],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("| openai |"));
    // prisma (database) is excluded from third-party sharing
    assert.ok(!result.includes("| prisma |"));
  });

  it("includes DPA and SCCs safeguards", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("Data Processing Agreements"));
    assert.ok(result.includes("Art. 28 GDPR"));
    assert.ok(result.includes("Standard Contractual Clauses"));
  });

  it("shows category labels in third-party table", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["prompts"]),
        makeService("stripe", "payment", ["card data"]),
      ],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("AI Service"));
    assert.ok(result.includes("Payment Processing"));
  });

  // ── Section 6: Data Retention ─────────────────────────────────────

  it("includes data retention section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("Data Retention"));
  });

  it("includes specific retention periods", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("Employment records"));
    assert.ok(result.includes("6 years"));
    assert.ok(result.includes("Payroll and tax records"));
    assert.ok(result.includes("7 years"));
    assert.ok(result.includes("IT access logs"));
    assert.ok(result.includes("12 months"));
    assert.ok(result.includes("Performance records"));
    assert.ok(result.includes("3 years"));
    assert.ok(result.includes("Health and safety records"));
    assert.ok(result.includes("40 years"));
  });

  it("includes operational data retention from context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "hr@acme.com", dataRetentionDays: 90 };
    const result = generateEmployeePrivacyNotice(scan, ctx)!;
    assert.ok(result.includes("90 days"));
  });

  it("omits operational retention period when not in context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(!result.includes("Default operational data retention"));
  });

  it("mentions secure deletion upon termination", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("securely delete or anonymize"));
  });

  // ── Section 7: Employee Rights ────────────────────────────────────

  it("includes employee rights section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("Your Rights Under GDPR"));
  });

  it("lists all GDPR data subject rights", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("Access"));
    assert.ok(result.includes("Art. 15"));
    assert.ok(result.includes("Rectification"));
    assert.ok(result.includes("Art. 16"));
    assert.ok(result.includes("Erasure"));
    assert.ok(result.includes("Art. 17"));
    assert.ok(result.includes("Restriction"));
    assert.ok(result.includes("Art. 18"));
    assert.ok(result.includes("Data Portability"));
    assert.ok(result.includes("Art. 20"));
    assert.ok(result.includes("Objection"));
    assert.ok(result.includes("Art. 21"));
    assert.ok(result.includes("Withdraw Consent"));
    assert.ok(result.includes("Art. 7(3)"));
    assert.ok(result.includes("Automated Decisions"));
    assert.ok(result.includes("Art. 22"));
  });

  it("includes one month response time (Art. 12(3))", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("one month"));
    assert.ok(result.includes("Art. 12(3)"));
  });

  it("includes right to lodge a complaint (Art. 77)", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("lodge a complaint"));
    assert.ok(result.includes("Art. 77"));
  });

  it("includes DPO email in rights contact when provided", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "hr@acme.com",
      dpoEmail: "dpo@acme.com",
    };
    const result = generateEmployeePrivacyNotice(scan, ctx)!;
    assert.ok(result.includes("**DPO:** dpo@acme.com"));
  });

  // ── Section 8: Changes to This Notice ─────────────────────────────

  it("includes changes to notice section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("Changes to This Notice"));
  });

  it("states material changes will be communicated", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("Material changes will be communicated"));
  });

  // ── Footer ────────────────────────────────────────────────────────

  it("includes Codepliant attribution in footer", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("Codepliant"));
  });

  it("includes review recommendation for legal and HR", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateEmployeePrivacyNotice(scan)!;
    assert.ok(result.includes("legal and HR teams"));
  });

  // ── Comprehensive test ────────────────────────────────────────────

  it("generates all sections with diverse services and full context", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["prompts", "responses"]),
        makeService("@sentry/node", "monitoring", ["error logs", "stack traces"]),
        makeService("posthog", "analytics", ["page views", "clicks"]),
        makeService("stripe", "payment", ["card data"]),
        makeService("prisma", "database", ["user records"]),
      ],
    });
    const ctx: GeneratorContext = {
      companyName: "Full Test Corp",
      contactEmail: "hr@fulltest.com",
      dpoName: "Jane Doe",
      dpoEmail: "dpo@fulltest.com",
      dataRetentionDays: 365,
    };
    const result = generateEmployeePrivacyNotice(scan, ctx)!;
    assert.ok(result.includes("Full Test Corp"));
    assert.ok(result.includes("hr@fulltest.com"));
    assert.ok(result.includes("Jane Doe"));
    assert.ok(result.includes("dpo@fulltest.com"));
    assert.ok(result.includes("Introduction & Scope"));
    assert.ok(result.includes("Categories of Employee Data"));
    assert.ok(result.includes("Workplace Monitoring Tools"));
    assert.ok(result.includes("Sentry (error monitoring)"));
    assert.ok(result.includes("PostHog (product analytics)"));
    assert.ok(result.includes("AI Tools in the Workplace"));
    assert.ok(result.includes("OpenAI (GPT models)"));
    assert.ok(result.includes("Data Sharing with Third Parties"));
    assert.ok(result.includes("Data Retention"));
    assert.ok(result.includes("365 days"));
    assert.ok(result.includes("Your Rights Under GDPR"));
    assert.ok(result.includes("Changes to This Notice"));
  });
});
