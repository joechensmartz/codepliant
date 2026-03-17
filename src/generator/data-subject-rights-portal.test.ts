import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateDataSubjectRightsPortal } from "./data-subject-rights-portal.js";
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

describe("generateDataSubjectRightsPortal", () => {
  // ── Empty return cases ────────────────────────────────────────────

  it("returns empty string when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateDataSubjectRightsPortal(scan), "");
  });

  // ── Generation with services ──────────────────────────────────────

  it("generates document with a single service", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.length > 0);
    assert.ok(result.includes("Data Subject Rights Portal"));
  });

  it("generates document with multiple services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("3 services detected"));
  });

  // ── Context values ────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generateDataSubjectRightsPortal(scan, ctx);
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "privacy@test.com" };
    const result = generateDataSubjectRightsPortal(scan, ctx);
    assert.ok(result.includes("privacy@test.com"));
  });

  it("uses placeholder contact email when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses context website", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "a@a.com", website: "https://acme.com" };
    const result = generateDataSubjectRightsPortal(scan, ctx);
    assert.ok(result.includes("https://acme.com/api/v1/privacy"));
  });

  it("uses default website when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("https://yourcompany.com/api/v1/privacy"));
  });

  it("uses context dpoEmail", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "a@a.com", dpoEmail: "dpo@test.com" };
    const result = generateDataSubjectRightsPortal(scan, ctx);
    assert.ok(result.includes("dpo@test.com"));
  });

  it("falls back to contactEmail for dpoEmail", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "privacy@test.com" };
    const result = generateDataSubjectRightsPortal(scan, ctx);
    assert.ok(result.includes("privacy@test.com"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  // ── Overview section ──────────────────────────────────────────────

  it("includes Overview section with four main features", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("## 1. Overview"));
    assert.ok(result.includes("View their data"));
    assert.ok(result.includes("Download their data"));
    assert.ok(result.includes("Delete their account"));
    assert.ok(result.includes("Manage consent"));
  });

  it("includes GDPR reference in overview by default", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("**GDPR** Articles 12-23"));
  });

  it("includes CCPA reference when ccpa jurisdiction set", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "a@a.com", jurisdictions: ["ccpa"] };
    const result = generateDataSubjectRightsPortal(scan, ctx);
    assert.ok(result.includes("**CCPA**"));
  });

  // ── My Data Dashboard section ─────────────────────────────────────

  it("includes My Data Dashboard with service data table", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card number", "billing address"])],
    });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("My Data Dashboard"));
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("card number, billing address"));
  });

  // ── View Data section (conditional) ───────────────────────────────

  it("includes analytics data view when analytics services present", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("**Analytics data**"));
    assert.ok(result.includes("Browsing behavior"));
  });

  it("includes AI data view when AI services present", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("**AI interaction data**"));
    assert.ok(result.includes("Prompts, responses"));
  });

  it("includes payment data view when payment services present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("**Payment data**"));
    assert.ok(result.includes("Transaction history"));
  });

  it("excludes analytics data view when no analytics services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(!result.includes("**Analytics data**"));
  });

  it("excludes AI data view when no AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(!result.includes("**AI interaction data**"));
  });

  // ── Download Data section ─────────────────────────────────────────

  it("includes Download Data section with GDPR portability reference", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("Download Data (Data Portability)"));
    assert.ok(result.includes("GDPR Art. 20"));
    assert.ok(result.includes("JSON"));
    assert.ok(result.includes("CSV"));
    assert.ok(result.includes("PDF"));
  });

  // ── Delete Account section ────────────────────────────────────────

  it("includes Delete Account section with GDPR right to erasure", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("Delete Account (Right to Erasure)"));
    assert.ok(result.includes("GDPR Art. 17"));
    assert.ok(result.includes("14-day"));
    assert.ok(result.includes("grace period"));
  });

  it("includes CCPA deletion reference when ccpa jurisdiction", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "a@a.com", jurisdictions: ["ccpa"] };
    const result = generateDataSubjectRightsPortal(scan, ctx);
    assert.ok(result.includes("CCPA"));
    assert.ok(result.includes("1798.105"));
  });

  it("includes payment exception to deletion when payment services present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("Payment transaction records"));
  });

  it("excludes payment exception when no payment services", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(!result.includes("Payment transaction records"));
  });

  // ── Manage Consent section ────────────────────────────────────────

  it("includes Manage Consent section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("Manage Consent"));
    assert.ok(result.includes("Essential service operation"));
    assert.ok(result.includes("Email communications"));
    assert.ok(result.includes("Third-party data sharing"));
  });

  it("includes analytics consent toggles when analytics services present", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("Analytics & performance"));
    assert.ok(result.includes("Marketing & advertising"));
  });

  it("includes AI consent toggles when AI services present", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("AI model training"));
    assert.ok(result.includes("AI-powered features"));
  });

  it("excludes analytics consent toggles when no analytics services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(!result.includes("Analytics & performance"));
  });

  it("excludes AI consent toggles when no AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(!result.includes("AI model training"));
  });

  // ── API Endpoints section ─────────────────────────────────────────

  it("includes API Endpoints section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("API Endpoints Specification"));
    assert.ok(result.includes("GET /api/v1/privacy/my-data"));
    assert.ok(result.includes("POST /api/v1/privacy/export"));
    assert.ok(result.includes("POST /api/v1/privacy/delete-account"));
    assert.ok(result.includes("GET /api/v1/privacy/consent"));
    assert.ok(result.includes("PATCH /api/v1/privacy/consent"));
    assert.ok(result.includes("GET /api/v1/privacy/requests"));
  });

  it("includes third-party sharing data from detected services in API response", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card number", "billing"])],
    });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("card number"));
  });

  // ── UI Wireframe section ──────────────────────────────────────────

  it("includes UI Wireframe section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("UI Wireframe Description"));
    assert.ok(result.includes("Portal Layout"));
    assert.ok(result.includes("My Data Tab"));
    assert.ok(result.includes("Export Tab"));
    assert.ok(result.includes("Delete Account Tab"));
    assert.ok(result.includes("Consent Management Tab"));
  });

  it("includes AI consent toggles in wireframe when AI services present", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("AI-Powered Features"));
    assert.ok(result.includes("AI Model Training"));
  });

  it("lists services in My Data Tab wireframe", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["card data"]),
        makeService("posthog", "analytics", ["usage data"]),
      ],
    });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("stripe: card data"));
    assert.ok(result.includes("posthog: usage data"));
  });

  it("shows overflow count for more than 5 services in wireframe", () => {
    const services: DetectedService[] = [];
    for (let i = 0; i < 7; i++) {
      services.push(makeService(`svc-${i}`, "storage", ["data"]));
    }
    const scan = makeScan({ services });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("... and 2 more"));
  });

  it("does not show overflow for 5 or fewer services", () => {
    const services: DetectedService[] = [];
    for (let i = 0; i < 5; i++) {
      services.push(makeService(`svc-${i}`, "storage", ["data"]));
    }
    const scan = makeScan({ services });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(!result.includes("... and"));
  });

  // ── Implementation Checklist ──────────────────────────────────────

  it("includes Implementation Checklist section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("Implementation Checklist"));
    assert.ok(result.includes("Phase 1: Core Portal"));
    assert.ok(result.includes("Phase 2: Data Export"));
    assert.ok(result.includes("Phase 3: Account Deletion"));
    assert.ok(result.includes("Phase 4: Consent Management"));
    assert.ok(result.includes("Phase 5: Audit & Compliance"));
  });

  // ── Security Requirements ─────────────────────────────────────────

  it("includes Security Requirements section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("Security Requirements"));
    assert.ok(result.includes("TLS 1.3"));
    assert.ok(result.includes("AES-256"));
    assert.ok(result.includes("Multi-factor"));
  });

  // ── Compliance Mapping ────────────────────────────────────────────

  it("includes Compliance Mapping section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("Compliance Mapping"));
    assert.ok(result.includes("Right to Access"));
    assert.ok(result.includes("Right to Portability"));
    assert.ok(result.includes("Right to Erasure"));
    assert.ok(result.includes("Art. 15"));
    assert.ok(result.includes("Art. 20"));
    assert.ok(result.includes("Art. 17"));
  });

  // ── Response Time SLAs ────────────────────────────────────────────

  it("includes Response Time SLAs section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("Response Time SLAs"));
    assert.ok(result.includes("30 days"));
    assert.ok(result.includes("< 24 hours"));
    assert.ok(result.includes("< 48 hours"));
  });

  // ── Footer / Disclaimer ───────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("Codepliant"));
  });

  it("includes legal review disclaimer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataSubjectRightsPortal(scan);
    assert.ok(result.includes("legal review is always recommended"));
  });

  // ── Data categories ───────────────────────────────────────────────

  it("counts unique data categories across services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["card number", "email"]),
        makeService("posthog", "analytics", ["email", "ip address"]),
      ],
    });
    const result = generateDataSubjectRightsPortal(scan);
    // 3 unique data categories: card number, email, ip address
    assert.ok(result.includes("3 data categories"));
  });

  // ── Comprehensive test ────────────────────────────────────────────

  it("generates comprehensive document with all service categories", () => {
    const scan = makeScan({
      services: [
        makeService("@clerk/nextjs", "auth", ["user profiles", "session tokens"]),
        makeService("stripe", "payment", ["card data", "billing address"]),
        makeService("posthog", "analytics", ["page views", "clicks"]),
        makeService("openai", "ai", ["prompts", "responses"]),
      ],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      website: "https://acme.com",
      dpoEmail: "dpo@acme.com",
      jurisdictions: ["gdpr", "ccpa"],
    };
    const result = generateDataSubjectRightsPortal(scan, ctx);
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("privacy@acme.com"));
    assert.ok(result.includes("dpo@acme.com"));
    assert.ok(result.includes("https://acme.com"));
    assert.ok(result.includes("Data Subject Rights Portal"));
    assert.ok(result.includes("**Analytics data**"));
    assert.ok(result.includes("**AI interaction data**"));
    assert.ok(result.includes("**Payment data**"));
    assert.ok(result.includes("AI model training"));
    assert.ok(result.includes("Analytics & performance"));
    assert.ok(result.includes("Payment transaction records"));
  });
});
