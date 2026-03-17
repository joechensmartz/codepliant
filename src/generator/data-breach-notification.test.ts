import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateDataBreachNotificationTemplates } from "./data-breach-notification.js";
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

describe("generateDataBreachNotificationTemplates", () => {
  // ── Null guard ──────────────────────────────────────────────────────

  it("returns null when no services detected", () => {
    const result = generateDataBreachNotificationTemplates(makeScan());
    assert.strictEqual(result, null);
  });

  // ── Basic generation with services ─────────────────────────────────

  it("generates document when services are present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataBreachNotificationTemplates(scan);
    assert.ok(typeof result === "string");
    assert.ok(result.includes("# Data Breach Notification Templates"));
  });

  it("includes project name in disclaimer", () => {
    const scan = makeScan({
      projectName: "my-saas",
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataBreachNotificationTemplates(scan);
    assert.ok(result!.includes("my-saas"));
  });

  it("includes date in document", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataBreachNotificationTemplates(scan);
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result!));
  });

  // ── Context values ─────────────────────────────────────────────────

  it("uses company name from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ companyName: "TestCo Inc" });
    const result = generateDataBreachNotificationTemplates(scan, ctx);
    assert.ok(result!.includes("TestCo Inc"));
  });

  it("uses contact email from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ contactEmail: "privacy@testco.com" });
    const result = generateDataBreachNotificationTemplates(scan, ctx);
    assert.ok(result!.includes("privacy@testco.com"));
  });

  it("uses DPO name from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ dpoName: "Jane Smith" });
    const result = generateDataBreachNotificationTemplates(scan, ctx);
    assert.ok(result!.includes("Jane Smith"));
  });

  it("uses DPO email from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ dpoEmail: "dpo@testco.com" });
    const result = generateDataBreachNotificationTemplates(scan, ctx);
    assert.ok(result!.includes("dpo@testco.com"));
  });

  it("uses website from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ website: "https://testco.com" });
    const result = generateDataBreachNotificationTemplates(scan, ctx);
    assert.ok(result!.includes("https://testco.com"));
  });

  it("uses toll-free number from context in US section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ tollFreeNumber: "1-800-555-0100" });
    const result = generateDataBreachNotificationTemplates(scan, ctx);
    assert.ok(result!.includes("1-800-555-0100"));
  });

  it("uses default placeholders when no context provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataBreachNotificationTemplates(scan);
    assert.ok(result!.includes("[Your Company Name]"));
    assert.ok(result!.includes("[your-email@example.com]"));
    assert.ok(result!.includes("[Data Protection Officer Name]"));
    assert.ok(result!.includes("[dpo@example.com]"));
  });

  // ── Jurisdiction-conditional sections ──────────────────────────────

  it("includes all templates when no jurisdictions specified", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataBreachNotificationTemplates(scan);
    assert.ok(result!.includes("EU/EEA — Supervisory Authority Notification (GDPR Art. 33)"));
    assert.ok(result!.includes("EU/EEA — Individual Notification (GDPR Art. 34)"));
    assert.ok(result!.includes("UK — ICO Breach Notification (UK GDPR)"));
    assert.ok(result!.includes("US — State Attorney General Notification"));
    assert.ok(result!.includes("US — Individual Notification (State Laws)"));
  });

  it("includes only EU templates when jurisdictions is ['EU']", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ jurisdictions: ["EU"] });
    const result = generateDataBreachNotificationTemplates(scan, ctx);
    assert.ok(result!.includes("EU/EEA — Supervisory Authority Notification"));
    assert.ok(result!.includes("EU/EEA — Individual Notification"));
    assert.ok(!result!.includes("UK — ICO Breach Notification"));
    assert.ok(!result!.includes("US — State Attorney General"));
  });

  it("includes only UK templates when jurisdictions is ['UK']", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ jurisdictions: ["UK"] });
    const result = generateDataBreachNotificationTemplates(scan, ctx);
    assert.ok(!result!.includes("EU/EEA — Supervisory Authority Notification"));
    assert.ok(result!.includes("UK — ICO Breach Notification"));
    assert.ok(!result!.includes("US — State Attorney General"));
  });

  it("includes only US templates when jurisdictions is ['US']", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ jurisdictions: ["US"] });
    const result = generateDataBreachNotificationTemplates(scan, ctx);
    assert.ok(!result!.includes("EU/EEA — Supervisory Authority Notification"));
    assert.ok(!result!.includes("UK — ICO Breach Notification"));
    assert.ok(result!.includes("US — State Attorney General"));
    assert.ok(result!.includes("US — Individual Notification"));
  });

  it("recognizes GB as UK jurisdiction", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ jurisdictions: ["GB"] });
    const result = generateDataBreachNotificationTemplates(scan, ctx);
    assert.ok(result!.includes("UK — ICO Breach Notification"));
  });

  it("recognizes GDPR as EU jurisdiction", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ jurisdictions: ["GDPR"] });
    const result = generateDataBreachNotificationTemplates(scan, ctx);
    assert.ok(result!.includes("EU/EEA — Supervisory Authority Notification"));
  });

  it("recognizes CCPA as US jurisdiction", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ jurisdictions: ["CCPA"] });
    const result = generateDataBreachNotificationTemplates(scan, ctx);
    assert.ok(result!.includes("US — State Attorney General"));
  });

  it("recognizes CA as US jurisdiction", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ jurisdictions: ["CA"] });
    const result = generateDataBreachNotificationTemplates(scan, ctx);
    assert.ok(result!.includes("US — State Attorney General"));
  });

  it("recognizes EU member state codes", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ jurisdictions: ["DE"] });
    const result = generateDataBreachNotificationTemplates(scan, ctx);
    assert.ok(result!.includes("EU/EEA — Supervisory Authority Notification"));
  });

  it("includes multiple jurisdictions when both EU and US specified", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ jurisdictions: ["EU", "US"] });
    const result = generateDataBreachNotificationTemplates(scan, ctx);
    assert.ok(result!.includes("EU/EEA — Supervisory Authority Notification"));
    assert.ok(result!.includes("US — State Attorney General"));
    assert.ok(!result!.includes("UK — ICO Breach Notification"));
  });

  // ── Data categories ────────────────────────────────────────────────

  it("pre-fills detected data categories in EU template", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
      dataCategories: [
        { category: "Payment Information", description: "Payment-related data", sources: ["stripe"] },
        { category: "Email Addresses", description: "User email addresses", sources: ["stripe"] },
      ],
    });
    const result = generateDataBreachNotificationTemplates(scan);
    assert.ok(result!.includes("[x] Payment Information"));
    assert.ok(result!.includes("[x] Email Addresses"));
  });

  it("shows unchecked data categories when none detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
      dataCategories: [],
    });
    const result = generateDataBreachNotificationTemplates(scan);
    assert.ok(result!.includes("[ ] Names and contact details"));
    assert.ok(result!.includes("[ ] Email addresses"));
  });

  // ── EU-specific content ────────────────────────────────────────────

  it("EU template references GDPR Art. 33 and 72-hour deadline", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataBreachNotificationTemplates(scan);
    assert.ok(result!.includes("Article 33"));
    assert.ok(result!.includes("72 hours"));
  });

  it("EU individual notification references Art. 34", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataBreachNotificationTemplates(scan);
    assert.ok(result!.includes("Article 34"));
    assert.ok(result!.includes("high risk"));
  });

  // ── UK-specific content ────────────────────────────────────────────

  it("UK template references ICO", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataBreachNotificationTemplates(scan);
    assert.ok(result!.includes("Information Commissioner's Office"));
    assert.ok(result!.includes("ico.org.uk"));
  });

  // ── US-specific content ────────────────────────────────────────────

  it("US template includes state deadline table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataBreachNotificationTemplates(scan);
    assert.ok(result!.includes("California"));
    assert.ok(result!.includes("Colorado"));
    assert.ok(result!.includes("New York"));
    assert.ok(result!.includes("Texas"));
  });

  it("US AG template includes breach type checkboxes", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataBreachNotificationTemplates(scan);
    assert.ok(result!.includes("Social Security numbers"));
    assert.ok(result!.includes("Credit/debit card numbers"));
    assert.ok(result!.includes("Biometric data"));
  });

  it("US individual notification includes FTC reference", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataBreachNotificationTemplates(scan);
    assert.ok(result!.includes("ftc.gov/idtheft"));
  });

  // ── Incident Log Template ──────────────────────────────────────────

  it("always includes incident log template", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataBreachNotificationTemplates(scan);
    assert.ok(result!.includes("Incident Log Template"));
    assert.ok(result!.includes("Incident ID"));
    assert.ok(result!.includes("Severity"));
    assert.ok(result!.includes("Root cause"));
  });

  // ── Table of Contents ──────────────────────────────────────────────

  it("table of contents matches included sections", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ jurisdictions: ["UK"] });
    const result = generateDataBreachNotificationTemplates(scan, ctx);
    // Only UK + Incident Log should be in TOC
    assert.ok(result!.includes("UK — ICO Breach Notification"));
    assert.ok(result!.includes("Incident Log Template"));
    assert.ok(!result!.includes("EU/EEA — Supervisory Authority"));
  });

  it("section numbers are sequential when only US jurisdiction", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ jurisdictions: ["US"] });
    const result = generateDataBreachNotificationTemplates(scan, ctx);
    assert.ok(result!.includes("## 1. US — State Attorney General Notification"));
    assert.ok(result!.includes("## 2. US — Individual Notification (State Laws)"));
    assert.ok(result!.includes("## 3. Incident Log Template"));
  });

  // ── Disclaimer ─────────────────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataBreachNotificationTemplates(scan);
    assert.ok(result!.includes("Codepliant"));
  });

  it("includes legal review disclaimer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataBreachNotificationTemplates(scan);
    assert.ok(result!.includes("reviewed and approved by your legal team"));
  });
});
