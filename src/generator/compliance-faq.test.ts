import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateComplianceFAQ } from "./compliance-faq.js";
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
  return { companyName: "Test Co", contactEmail: "test@test.com", ...overrides };
}

describe("generateComplianceFAQ", () => {
  // ── Null guard ──────────────────────────────────────────────────────

  it("returns null when no services are present", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceFAQ(scan);
    assert.strictEqual(result, null);
  });

  // ── Basic generation ────────────────────────────────────────────────

  it("returns a non-null string when services exist", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceFAQ(scan);
    assert.ok(result !== null);
    assert.ok(result!.length > 0);
  });

  it("includes the title", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("# Compliance FAQ"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes service count and category count", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment"), makeService("openai", "ai")],
    });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("2 services detected across 2 categories"));
  });

  // ── Context values ──────────────────────────────────────────────────

  it("uses company name from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ companyName: "Acme Corp" });
    const result = generateComplianceFAQ(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder when no company name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses contact email from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ contactEmail: "info@acme.com" });
    const result = generateComplianceFAQ(scan, ctx)!;
    assert.ok(result.includes("info@acme.com"));
  });

  it("uses website from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ website: "https://acme.com" });
    const result = generateComplianceFAQ(scan, ctx)!;
    assert.ok(result.includes("https://acme.com"));
  });

  // ── Q1: Data Collection ───────────────────────────────────────────

  it("lists all data collected in Q1", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card numbers", "billing address"])],
    });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("card numbers"));
    assert.ok(result.includes("billing address"));
  });

  it("lists service names in Q1", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment"), makeService("openai", "ai")],
    });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("stripe, openai"));
  });

  // ── Q2: Conditional bullets ───────────────────────────────────────

  it("includes analytics bullet when analytics present", () => {
    const scan = makeScan({ services: [makeService("google-analytics", "analytics")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("Improve our product"));
  });

  it("includes payment bullet when payment present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("Process payments"));
  });

  it("includes AI bullet when AI present", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("Power AI features"));
  });

  // ── Q3: Children ──────────────────────────────────────────────────

  it("includes children data collection notice", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("children under 16"));
  });

  // ── Service-Specific Questions ────────────────────────────────────

  it("includes service-specific Q&A for known services (stripe)", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment", ["payment data"])] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("Service-Specific Questions"));
    assert.ok(result.includes("What data does stripe receive?"));
    assert.ok(result.includes("Payment card details"));
  });

  it("includes service-specific Q&A for openai", () => {
    const scan = makeScan({ services: [makeService("openai", "ai", ["prompts"])] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("What data does openai receive?"));
    assert.ok(result.includes("Text prompts"));
  });

  it("skips service-specific section for unknown services", () => {
    const scan = makeScan({ services: [makeService("unknown-svc", "other")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(!result.includes("Service-Specific Questions"));
  });

  // ── Data Sharing ──────────────────────────────────────────────────

  it("says 'do not sell' when no advertising", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("We do not sell your personal data"));
  });

  it("mentions advertising data sharing when advertising present", () => {
    const scan = makeScan({ services: [makeService("facebook-pixel", "advertising")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("advertising partners"));
  });

  it("lists services in sharing table", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data", "email", "address"])],
    });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("| stripe | Payment Processing |"));
  });

  // ── Data Retention ────────────────────────────────────────────────

  it("includes retention periods per category", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment"), makeService("google-analytics", "analytics")],
    });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("How long do you keep my data?"));
    assert.ok(result.includes("Payment Processing"));
    assert.ok(result.includes("7 years"));
    assert.ok(result.includes("26 months"));
  });

  it("mentions dataRetentionDays when in context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ dataRetentionDays: 365 });
    const result = generateComplianceFAQ(scan, ctx)!;
    assert.ok(result.includes("365 days"));
  });

  it("includes payment caveat on early deletion", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("tax law"));
  });

  // ── Data Security ─────────────────────────────────────────────────

  it("includes encryption in transit and at rest", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("HTTPS/TLS 1.2+"));
    assert.ok(result.includes("AES-256"));
  });

  it("includes auth security when auth present", () => {
    const scan = makeScan({ services: [makeService("auth0", "auth")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("bcrypt/argon2"));
  });

  it("includes monitoring mention when monitoring present", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("Real-time error"));
  });

  it("mentions 72-hour breach notification (GDPR)", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("72 hours"));
  });

  // ── Your Rights (GDPR always on by default) ───────────────────────

  it("includes GDPR rights by default", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("Under GDPR"));
    assert.ok(result.includes("Access"));
    assert.ok(result.includes("Erasure"));
    assert.ok(result.includes("Portability"));
  });

  it("includes CCPA rights when ccpa jurisdiction set", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ jurisdictions: ["ccpa"] });
    const result = generateComplianceFAQ(scan, ctx)!;
    assert.ok(result.includes("Under CCPA/CPRA"));
    assert.ok(result.includes("Opt-out"));
  });

  // ── AI section ────────────────────────────────────────────────────

  it("includes AI section when AI services present", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("AI & Automated Processing"));
    assert.ok(result.includes("Do you use AI/machine learning?"));
    assert.ok(result.includes("openai"));
  });

  it("says data not used for model training", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("not use your data for model training"));
  });

  it("mentions human oversight for high risk AI", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const ctx = makeCtx({ aiRiskLevel: "high" });
    const result = generateComplianceFAQ(scan, ctx)!;
    assert.ok(result.includes("human oversight"));
  });

  it("mentions human in the loop for non-high risk AI", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("human is always in the loop"));
  });

  it("skips AI section when no AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(!result.includes("AI & Automated Processing"));
  });

  // ── Cookies & Tracking ────────────────────────────────────────────

  it("includes cookies section when analytics present", () => {
    const scan = makeScan({ services: [makeService("google-analytics", "analytics")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("Cookies & Tracking"));
    assert.ok(result.includes("Analytics cookies"));
  });

  it("includes advertising cookies when advertising present", () => {
    const scan = makeScan({ services: [makeService("facebook-pixel", "advertising")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("Advertising cookies"));
  });

  it("includes essential cookies when auth present", () => {
    const scan = makeScan({
      services: [makeService("auth0", "auth"), makeService("google-analytics", "analytics")],
    });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("Essential cookies"));
  });

  it("skips cookies section when no analytics or advertising", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(!result.includes("Cookies & Tracking"));
  });

  // ── International Transfers ───────────────────────────────────────

  it("includes international transfers section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("International Data Transfers"));
    assert.ok(result.includes("Standard Contractual Clauses"));
  });

  // ── Payments section ──────────────────────────────────────────────

  it("includes payments section when payment present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("Payments & Billing"));
    assert.ok(result.includes("never see, transmit, or store your full credit card number"));
    assert.ok(result.includes("PCI DSS Level 1"));
  });

  it("skips payments section when no payment", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(!result.includes("Payments & Billing"));
  });

  // ── Technical Questions ───────────────────────────────────────────

  it("includes technical questions when storage or auth present", () => {
    const scan = makeScan({ services: [makeService("auth0", "auth")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("Technical Questions"));
    assert.ok(result.includes("export all my data"));
  });

  it("includes GDPR Art 20 mention for data portability", () => {
    const scan = makeScan({ services: [makeService("auth0", "auth")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("Article 20"));
  });

  it("includes payment retention caveat on account deletion", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment"), makeService("auth0", "auth")],
    });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("Transaction records required by law"));
  });

  it("skips technical section when no storage or auth", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(!result.includes("Technical Questions"));
  });

  // ── General section ───────────────────────────────────────────────

  it("includes general section about policy changes", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("How will I know if this policy changes?"));
  });

  it("shows DPO name when provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ dpoName: "Jane Doe", dpoEmail: "dpo@acme.com" });
    const result = generateComplianceFAQ(scan, ctx)!;
    assert.ok(result.includes("Jane Doe"));
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("shows complaint procedure", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("file a complaint"));
    assert.ok(result.includes("supervisory authority"));
  });

  it("shows GDPR+CCPA compliance when both jurisdictions", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ jurisdictions: ["gdpr", "ccpa"] });
    const result = generateComplianceFAQ(scan, ctx)!;
    assert.ok(result.includes("GDPR"));
    assert.ok(result.includes("CCPA/CPRA"));
  });

  // ── Footer ────────────────────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("Codepliant"));
  });

  it("includes legal review disclaimer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("reviewed by a qualified legal professional"));
  });

  it("includes service count in footer", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment"), makeService("openai", "ai")],
    });
    const result = generateComplianceFAQ(scan)!;
    assert.ok(result.includes("2 detected services"));
  });

  // ── Contact footer ────────────────────────────────────────────────

  it("includes contact section with email and website", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ contactEmail: "info@acme.com", website: "https://acme.com" });
    const result = generateComplianceFAQ(scan, ctx)!;
    assert.ok(result.includes("info@acme.com"));
    assert.ok(result.includes("https://acme.com"));
  });

  it("includes DPO email in contact when provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ dpoEmail: "dpo@acme.com" });
    const result = generateComplianceFAQ(scan, ctx)!;
    assert.ok(result.includes("dpo@acme.com"));
  });
});
