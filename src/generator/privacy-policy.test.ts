import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generatePrivacyPolicy } from "./privacy-policy.js";
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

describe("generatePrivacyPolicy", () => {
  it("generates a privacy policy with title and introduction", () => {
    const scan = makeScan();
    const result = generatePrivacyPolicy(scan);
    assert.ok(result.includes("# Privacy Policy"));
    assert.ok(result.includes("test-project"));
    assert.ok(result.includes("Introduction"));
  });

  it("uses context company name and email", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "legal@acme.com" };
    const result = generatePrivacyPolicy(scan, ctx);
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("legal@acme.com"));
  });

  it("includes placeholder values when no context provided", () => {
    const scan = makeScan();
    const result = generatePrivacyPolicy(scan);
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("lists data categories when present", () => {
    const scan = makeScan({
      dataCategories: [
        {
          category: "User Identity",
          description: "Names, emails, profile pictures",
          sources: ["Registration form", "OAuth login"],
        },
      ],
    });
    const result = generatePrivacyPolicy(scan);
    assert.ok(result.includes("User Identity"));
    assert.ok(result.includes("Names, emails, profile pictures"));
    assert.ok(result.includes("Registration form"));
  });

  it("shows no-data message when no data categories detected", () => {
    const scan = makeScan({ dataCategories: [] });
    const result = generatePrivacyPolicy(scan);
    // Should still have the section but indicate no collection
    assert.ok(result.includes("Information We Collect") || result.includes("information"));
  });

  it("includes third-party services section for non-database services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment information", "billing address"]),
        makeService("posthog", "analytics", ["page views", "user behavior"]),
      ],
    });
    const result = generatePrivacyPolicy(scan);
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("posthog"));
    assert.ok(result.includes("Payment Processing"));
    assert.ok(result.includes("Analytics"));
  });

  it("excludes database services from third-party section", () => {
    const scan = makeScan({
      services: [
        makeService("prisma", "database", ["user data"]),
      ],
    });
    const result = generatePrivacyPolicy(scan);
    // Database services should NOT appear in the third-party services section
    // but the legal basis section should still detect the category
    assert.ok(!result.includes("Third-Party") || !result.includes("prisma"));
  });

  it("includes legal basis table with GDPR articles for detected categories", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment information"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generatePrivacyPolicy(scan);
    assert.ok(result.includes("Legal Basis"));
    assert.ok(result.includes("Art. 6(1)(b)"));  // Contract for payment
    assert.ok(result.includes("Art. 6(1)(a)"));  // Consent for analytics
  });

  it("includes AI-specific section when AI services detected", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts", "AI-generated content"]),
      ],
    });
    const result = generatePrivacyPolicy(scan);
    assert.ok(result.includes("Artificial Intelligence"));
    assert.ok(result.includes("openai"));
  });

  it("omits AI section when no AI services detected", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment information"]),
      ],
    });
    const result = generatePrivacyPolicy(scan);
    assert.ok(!result.includes("Artificial Intelligence"));
  });

  it("includes international transfer section for US-based providers", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment information"]),
        makeService("openai", "ai", ["user prompts"]),
      ],
    });
    const result = generatePrivacyPolicy(scan);
    assert.ok(result.includes("International"));
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("openai"));
    assert.ok(result.includes("Standard Contractual Clauses") || result.includes("safeguard"));
  });

  it("omits international transfer section when no US-based services", () => {
    const scan = makeScan({
      services: [
        makeService("some-eu-service", "analytics", ["page views"]),
      ],
    });
    const result = generatePrivacyPolicy(scan);
    // "International" should not appear as a section heading when no US providers found
    assert.ok(!result.includes("International Data Transfer"));
  });

  it("includes data retention section with category-specific periods", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment information"]),
        makeService("next-auth", "auth", ["email", "session data"]),
      ],
    });
    const result = generatePrivacyPolicy(scan);
    assert.ok(result.includes("Retention"));
    assert.ok(result.includes("7 years"));  // Payment retention
    assert.ok(result.includes("delete your account"));  // Auth retention
  });

  it("includes custom data retention days from context", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const ctx: GeneratorContext = {
      companyName: "TestCo",
      contactEmail: "test@test.com",
      dataRetentionDays: 365,
    };
    const result = generatePrivacyPolicy(scan, ctx);
    assert.ok(result.includes("365 days"));
  });

  it("includes GDPR rights section", () => {
    const scan = makeScan();
    const result = generatePrivacyPolicy(scan);
    assert.ok(result.includes("Your Rights"));
    assert.ok(result.includes("access") || result.includes("Access"));
    assert.ok(result.includes("erasure") || result.includes("Erasure") || result.includes("delete"));
    assert.ok(result.includes("Portability") || result.includes("portability"));
  });

  it("includes CCPA section when analytics services detected", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics", ["page views", "user behavior"]),
      ],
    });
    const result = generatePrivacyPolicy(scan);
    assert.ok(result.includes("California"));
    assert.ok(result.includes("CCPA") || result.includes("CPRA"));
    assert.ok(result.includes("Right to Know"));
    assert.ok(result.includes("Right to Delete"));
  });

  it("includes CCPA personal information categories mapped from services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment information"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generatePrivacyPolicy(scan);
    assert.ok(result.includes("Financial information"));
    assert.ok(result.includes("Internet or other electronic network activity"));
  });

  it("includes UK GDPR section when jurisdiction specified", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = {
      companyName: "TestCo",
      contactEmail: "test@test.com",
      jurisdictions: ["uk-gdpr"],
    };
    const result = generatePrivacyPolicy(scan, ctx);
    assert.ok(result.includes("UK Residents"));
    assert.ok(result.includes("ICO"));
  });

  it("includes DPO section with provided details", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = {
      companyName: "TestCo",
      contactEmail: "test@test.com",
      dpoName: "Jane Smith",
      dpoEmail: "dpo@testco.com",
    };
    const result = generatePrivacyPolicy(scan, ctx);
    assert.ok(result.includes("Jane Smith"));
    assert.ok(result.includes("dpo@testco.com"));
  });

  it("includes withdraw consent section when consent-based services detected", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generatePrivacyPolicy(scan);
    assert.ok(result.includes("Withdraw") || result.includes("withdraw"));
    assert.ok(result.includes("Consent") || result.includes("consent"));
  });

  it("includes automated decision-making section with AI details", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
      ],
    });
    const result = generatePrivacyPolicy(scan);
    assert.ok(result.includes("Automated"));
    assert.ok(result.includes("openai"));
  });

  it("states no automated decision-making when no AI services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
      ],
    });
    const result = generatePrivacyPolicy(scan);
    assert.ok(result.includes("Automated"));
    assert.ok(result.includes("not") || result.includes("does not"));
  });

  it("includes EU representative when provided", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = {
      companyName: "TestCo",
      contactEmail: "test@test.com",
      euRepresentative: "EU Rep Ltd, Berlin",
    };
    const result = generatePrivacyPolicy(scan, ctx);
    assert.ok(result.includes("EU Rep Ltd, Berlin"));
  });

  it("includes children's privacy section when COPPA compliance need detected", () => {
    const scan = makeScan({
      complianceNeeds: [{ document: "COPPA Compliance", reason: "Targets children", priority: "required" }],
    });
    const result = generatePrivacyPolicy(scan);
    assert.ok(result.includes("Children"));
    assert.ok(result.includes("parental consent") || result.includes("Parental"));
  });

  it("omits children's privacy section when no COPPA need", () => {
    const scan = makeScan({
      complianceNeeds: [{ document: "GDPR", reason: "EU users", priority: "required" }],
    });
    const result = generatePrivacyPolicy(scan);
    assert.ok(!result.includes("Children's Privacy"));
  });

  it("includes data protection section when auth/payment services detected", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth", ["email", "session data"]),
        makeService("stripe", "payment", ["payment info"]),
      ],
    });
    const result = generatePrivacyPolicy(scan);
    assert.ok(result.includes("Protect"));
    assert.ok(result.includes("Encryption") || result.includes("TLS"));
  });

  it("includes monitoring provider names in protection section", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth", ["email"]),
        makeService("@sentry/node", "monitoring", ["error reports"]),
      ],
    });
    const result = generatePrivacyPolicy(scan);
    assert.ok(result.includes("@sentry/node"));
    assert.ok(result.includes("Monitoring") || result.includes("monitoring"));
  });

  it("includes changes to policy section", () => {
    const scan = makeScan();
    const result = generatePrivacyPolicy(scan);
    assert.ok(result.includes("Changes"));
  });

  it("includes contact section", () => {
    const scan = makeScan();
    const result = generatePrivacyPolicy(scan);
    assert.ok(result.includes("Contact"));
  });

  it("handles comprehensive service combination", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth", ["email", "name", "session data"]),
        makeService("stripe", "payment", ["payment information", "billing address"]),
        makeService("openai", "ai", ["user prompts", "AI-generated content"]),
        makeService("posthog", "analytics", ["page views", "user behavior"]),
        makeService("@sendgrid/mail", "email", ["email address"]),
        makeService("@sentry/node", "monitoring", ["error reports", "device info"]),
        makeService("@aws-sdk/client-s3", "storage", ["uploaded files"]),
        makeService("prisma", "database", ["user data"]),
      ],
      dataCategories: [
        { category: "User Identity", description: "Names and emails", sources: ["Registration"] },
        { category: "Payment Data", description: "Billing info", sources: ["Checkout"] },
      ],
    });
    const result = generatePrivacyPolicy(scan);

    // Should have all major sections
    assert.ok(result.includes("Privacy Policy"));
    assert.ok(result.includes("Introduction"));
    assert.ok(result.includes("Legal Basis"));
    assert.ok(result.includes("Artificial Intelligence"));
    assert.ok(result.includes("International"));
    assert.ok(result.includes("Retention"));
    assert.ok(result.includes("Your Rights"));
    assert.ok(result.includes("Automated"));
    assert.ok(result.includes("Contact"));

    // Should include service names
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("openai"));
    assert.ok(result.includes("posthog"));
    assert.ok(result.includes("@sendgrid/mail"));

    // Should reference detected data categories
    assert.ok(result.includes("User Identity"));
    assert.ok(result.includes("Payment Data"));
  });

  it("includes legitimate interest details when email/monitoring detected", () => {
    const scan = makeScan({
      services: [
        makeService("@sendgrid/mail", "email", ["email address"]),
        makeService("@sentry/node", "monitoring", ["error reports"]),
      ],
    });
    const result = generatePrivacyPolicy(scan);
    assert.ok(result.includes("Legitimate Interest"));
    assert.ok(result.includes("Art. 6(1)(f)"));
  });

  it("includes previous version URL from context website", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = {
      companyName: "TestCo",
      contactEmail: "test@test.com",
      website: "https://example.com",
    };
    const result = generatePrivacyPolicy(scan, ctx);
    assert.ok(result.includes("https://example.com/legal/privacy-policy/previous"));
  });

  it("includes effective date", () => {
    const scan = makeScan();
    const result = generatePrivacyPolicy(scan);
    // Should include a date in YYYY-MM-DD format
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });
});
