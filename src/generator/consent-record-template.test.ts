import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateConsentRecordTemplate } from "./consent-record-template.js";

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

describe("generateConsentRecordTemplate", () => {
  it("returns null when no services detected", () => {
    const scan = makeScan();
    const result = generateConsentRecordTemplate(scan);
    assert.strictEqual(result, null);
  });

  it("generates template when services are present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateConsentRecordTemplate(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Consent Record Template"));
  });

  it("uses context values for company info", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateConsentRecordTemplate(scan, {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      dpoEmail: "dpo@acme.com",
      website: "https://acme.com",
    })!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("privacy@acme.com"));
    assert.ok(result.includes("dpo@acme.com"));
    assert.ok(result.includes("https://acme.com"));
  });

  it("uses placeholder defaults when no context provided", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateConsentRecordTemplate(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
    assert.ok(result.includes("[https://yoursite.com]"));
  });

  it("dpoEmail defaults to contactEmail when only contactEmail provided", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateConsentRecordTemplate(scan, {
      companyName: "TestCo",
      contactEmail: "info@test.com",
    })!;
    // dpoEmail should fall back to contactEmail
    assert.ok(result.includes("info@test.com"));
  });

  it("includes GDPR Art. 7 reference in header", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateConsentRecordTemplate(scan)!;
    assert.ok(result.includes("GDPR Art. 7"));
  });

  it("includes purpose section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateConsentRecordTemplate(scan)!;
    assert.ok(result.includes("## 1. Purpose"));
    assert.ok(result.includes("Article 7(1)"));
  });

  it("includes consent record fields table", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateConsentRecordTemplate(scan)!;
    assert.ok(result.includes("## 2. Consent Record Fields"));
    assert.ok(result.includes("consent_id"));
    assert.ok(result.includes("user_id"));
    assert.ok(result.includes("timestamp"));
    assert.ok(result.includes("consent_type"));
    assert.ok(result.includes("consent_action"));
    assert.ok(result.includes("ip_address"));
    assert.ok(result.includes("policy_version"));
  });

  it("includes analytics consent type when analytics service detected", () => {
    const scan = makeScan({
      services: [makeService("google-analytics", "analytics", ["page views"])],
    });
    const result = generateConsentRecordTemplate(scan)!;
    assert.ok(result.includes("| `analytics`"));
  });

  it("does not include analytics consent type when no analytics service", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateConsentRecordTemplate(scan)!;
    assert.ok(!result.includes("| `analytics`"));
  });

  it("includes marketing and advertising consent types for analytics services", () => {
    const scan = makeScan({
      services: [makeService("google-analytics", "analytics", ["page views"])],
    });
    const result = generateConsentRecordTemplate(scan)!;
    assert.ok(result.includes("| `marketing`"));
    assert.ok(result.includes("| `advertising`"));
  });

  it("includes marketing and advertising consent types for advertising services", () => {
    const scan = makeScan({
      services: [makeService("google-ads", "advertising", ["ad clicks"])],
    });
    const result = generateConsentRecordTemplate(scan)!;
    assert.ok(result.includes("| `marketing`"));
    assert.ok(result.includes("| `advertising`"));
  });

  it("includes AI consent type when AI service detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateConsentRecordTemplate(scan)!;
    assert.ok(result.includes("| `ai_processing`"));
    assert.ok(result.includes("Explicit consent"));
  });

  it("does not include AI consent type when no AI service", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateConsentRecordTemplate(scan)!;
    assert.ok(!result.includes("| `ai_processing`"));
  });

  it("includes payment consent type when payment service detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment information"])],
    });
    const result = generateConsentRecordTemplate(scan)!;
    assert.ok(result.includes("| `payment`"));
  });

  it("does not include payment consent type when no payment service", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateConsentRecordTemplate(scan)!;
    assert.ok(!result.includes("| `payment`"));
  });

  it("always includes essential and third_party consent types", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateConsentRecordTemplate(scan)!;
    assert.ok(result.includes("| `essential`"));
    assert.ok(result.includes("| `third_party`"));
    assert.ok(result.includes("| `communication`"));
    assert.ok(result.includes("| `profiling`"));
  });

  it("includes collection methods table", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateConsentRecordTemplate(scan)!;
    assert.ok(result.includes("## 4. Collection Methods"));
    assert.ok(result.includes("web_form"));
    assert.ok(result.includes("cookie_banner"));
    assert.ok(result.includes("email_optin"));
    assert.ok(result.includes("api"));
  });

  it("includes example consent records", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateConsentRecordTemplate(scan)!;
    assert.ok(result.includes("## 5. Example Consent Records"));
    assert.ok(result.includes("Consent Granted"));
    assert.ok(result.includes("Consent Withdrawn"));
    assert.ok(result.includes('"consent_action": "granted"'));
    assert.ok(result.includes('"consent_action": "withdrawn"'));
  });

  it("includes GDPR compliance checklist", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateConsentRecordTemplate(scan)!;
    assert.ok(result.includes("## 6. GDPR Article 7 Compliance Checklist"));
    assert.ok(result.includes("Demonstrable"));
    assert.ok(result.includes("Freely given"));
    assert.ok(result.includes("Withdrawable"));
  });

  it("includes storage and retention section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateConsentRecordTemplate(scan)!;
    assert.ok(result.includes("## 7. Storage & Retention"));
    assert.ok(result.includes("AES-256"));
    assert.ok(result.includes("TLS 1.2"));
  });

  it("includes database schema example", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateConsentRecordTemplate(scan)!;
    assert.ok(result.includes("## 8. Implementation Guidance"));
    assert.ok(result.includes("CREATE TABLE consent_records"));
  });

  it("includes audit and review section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateConsentRecordTemplate(scan, {
      companyName: "TestCo",
      contactEmail: "info@test.com",
      dpoEmail: "dpo@test.com",
    })!;
    assert.ok(result.includes("## 9. Audit & Review"));
    assert.ok(result.includes("dpo@test.com"));
  });

  it("includes contact section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateConsentRecordTemplate(scan, {
      companyName: "TestCo",
      contactEmail: "info@test.com",
      dpoEmail: "dpo@test.com",
      website: "https://test.com",
    })!;
    assert.ok(result.includes("## 10. Contact"));
    assert.ok(result.includes("info@test.com"));
    assert.ok(result.includes("dpo@test.com"));
    assert.ok(result.includes("https://test.com"));
  });

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateConsentRecordTemplate(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("auto-generated"));
  });

  it("uses website context in example records", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateConsentRecordTemplate(scan, {
      companyName: "TestCo",
      contactEmail: "info@test.com",
      website: "https://example.org",
    })!;
    assert.ok(result.includes("https://example.org/signup"));
    assert.ok(result.includes("https://example.org/settings/privacy"));
  });

  it("includes all conditional consent types when all categories present", () => {
    const scan = makeScan({
      services: [
        makeService("google-analytics", "analytics", ["page views"]),
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment info"]),
      ],
    });
    const result = generateConsentRecordTemplate(scan)!;
    assert.ok(result.includes("| `analytics`"));
    assert.ok(result.includes("| `marketing`"));
    assert.ok(result.includes("| `advertising`"));
    assert.ok(result.includes("| `ai_processing`"));
    assert.ok(result.includes("| `payment`"));
  });
});
