import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateComplianceNotes } from "./compliance-notes.js";
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

describe("generateComplianceNotes", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when no services are detected", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateComplianceNotes(scan), null);
  });

  // ── Basic generation ──────────────────────────────────────────────

  it("generates a document when services are detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateComplianceNotes(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Compliance Notes"));
  });

  it("includes the project name", () => {
    const scan = makeScan({
      projectName: "my-app",
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("my-app"));
  });

  it("includes a last-updated date", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("**Last updated:**"));
  });

  it("includes the disclaimer about legal advice", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("not legal advice"));
  });

  // ── Context / Company Info ─────────────────────────────────────────

  it("uses default company name when no context provided", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses provided company name from context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "privacy@acme.com" };
    const result = generateComplianceNotes(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  // ── Section 1: Detected Services Summary ──────────────────────────

  it("includes the Detected Services Summary section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("Detected Services Summary"));
  });

  it("shows a table with service names and categories", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data", "billing address"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("| stripe |"));
    assert.ok(result.includes("Payment Processing"));
  });

  it("shows data collected in the table (up to 3)", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts", "user data", "responses", "metadata"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("prompts"));
    assert.ok(result.includes("user data"));
    assert.ok(result.includes("responses"));
    // 4th item should not appear in the service table
  });

  it("formats categories correctly", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("@clerk/nextjs", "auth"),
        makeService("@sendgrid/mail", "email"),
      ],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("AI Service"));
    assert.ok(result.includes("Payment Processing"));
    assert.ok(result.includes("Analytics"));
    assert.ok(result.includes("Authentication"));
    assert.ok(result.includes("Email Service"));
  });

  // ── GDPR Section ──────────────────────────────────────────────────

  it("includes GDPR section by default (no jurisdictions set)", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("General Data Protection Regulation (GDPR)"));
  });

  it("includes GDPR section when gdpr jurisdiction is set", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "t@t.com", jurisdictions: ["gdpr"] };
    const result = generateComplianceNotes(scan, ctx)!;
    assert.ok(result.includes("General Data Protection Regulation (GDPR)"));
  });

  it("includes GDPR key requirements checklist", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("Identify a lawful basis"));
    assert.ok(result.includes("Art. 6"));
    assert.ok(result.includes("Record of Processing Activities"));
    assert.ok(result.includes("Art. 30"));
  });

  it("adds transfer safeguards for US-based services", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("transfer safeguards"));
    assert.ok(result.includes("SCCs/DPF"));
    assert.ok(result.includes("1 US-based service"));
  });

  it("counts multiple US-based services correctly", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["prompts"]),
        makeService("stripe", "payment", ["card data"]),
        makeService("@sendgrid/mail", "email", ["emails"]),
      ],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("3 US-based service"));
  });

  it("includes automated decision-making requirements for AI services", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("Art. 22"));
    assert.ok(result.includes("automated decision-making"));
  });

  it("includes EU AI Act reference for AI services", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("EU AI Act"));
    assert.ok(result.includes("Art. 50"));
  });

  it("includes cookie consent for analytics services", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["events"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("cookie consent mechanism"));
    assert.ok(result.includes("ePrivacy Directive"));
  });

  it("includes DPO and breach notification requirements", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("Data Protection Officer"));
    assert.ok(result.includes("Art. 37"));
    assert.ok(result.includes("breach notification"));
    assert.ok(result.includes("72-hour"));
  });

  // ── CCPA Section ──────────────────────────────────────────────────

  it("includes CCPA section when ccpa jurisdiction is set", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "t@t.com", jurisdictions: ["ccpa"] };
    const result = generateComplianceNotes(scan, ctx)!;
    assert.ok(result.includes("California Consumer Privacy Act"));
  });

  it("includes CCPA section when company location is US", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "t@t.com", companyLocation: "US" };
    const result = generateComplianceNotes(scan, ctx)!;
    assert.ok(result.includes("California Consumer Privacy Act"));
  });

  it("includes CCPA when analytics services are present", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["events"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("California Consumer Privacy Act"));
  });

  it("includes CCPA key requirements", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["events"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("Do Not Sell or Share"));
    assert.ok(result.includes("Global Privacy Control"));
    assert.ok(result.includes("15 business days"));
    assert.ok(result.includes("45 days"));
  });

  it("adds analytics-specific CCPA note when analytics detected", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["events"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("\"sale\" or \"sharing\" under CCPA"));
  });

  it("adds payment DPA note when payment detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "t@t.com", jurisdictions: ["ccpa"] };
    const result = generateComplianceNotes(scan, ctx)!;
    assert.ok(result.includes("payment processors"));
    assert.ok(result.includes("data processing agreements"));
  });

  // ── UK GDPR Section ───────────────────────────────────────────────

  it("includes UK GDPR section when uk-gdpr jurisdiction is set", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "t@t.com", jurisdictions: ["uk-gdpr"] };
    const result = generateComplianceNotes(scan, ctx)!;
    assert.ok(result.includes("UK General Data Protection Regulation"));
  });

  it("includes ICO registration requirement", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "t@t.com", jurisdictions: ["uk-gdpr"] };
    const result = generateComplianceNotes(scan, ctx)!;
    assert.ok(result.includes("ICO"));
    assert.ok(result.includes("Data Protection Fee"));
  });

  it("includes UK International Data Transfer Agreement", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "t@t.com", jurisdictions: ["uk-gdpr"] };
    const result = generateComplianceNotes(scan, ctx)!;
    assert.ok(result.includes("IDTA"));
  });

  it("includes ICO AI guidance for AI services under UK GDPR", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "t@t.com", jurisdictions: ["uk-gdpr"] };
    const result = generateComplianceNotes(scan, ctx)!;
    assert.ok(result.includes("ICO AI and data protection guidance"));
  });

  it("does not include UK GDPR section when uk-gdpr is not in jurisdictions", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "t@t.com", jurisdictions: ["gdpr"] };
    const result = generateComplianceNotes(scan, ctx)!;
    assert.ok(!result.includes("UK General Data Protection Regulation"));
  });

  // ── ePrivacy Directive Section ────────────────────────────────────

  it("includes ePrivacy section when analytics services are present", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["events"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("ePrivacy Directive"));
    assert.ok(result.includes("2002/58/EC"));
  });

  it("includes ePrivacy section when auth services are present", () => {
    const scan = makeScan({
      services: [makeService("@clerk/nextjs", "auth", ["user data"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("ePrivacy Directive"));
  });

  it("does not include ePrivacy section when no analytics or auth", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "t@t.com", jurisdictions: ["gdpr"] };
    const result = generateComplianceNotes(scan, ctx)!;
    assert.ok(!result.includes("ePrivacy Directive"));
  });

  it("includes cookie consent requirements in ePrivacy section", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["events"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("opt-in consent"));
    assert.ok(result.includes("granular cookie consent"));
    assert.ok(result.includes("consent records"));
  });

  it("mentions analytics cookies in ePrivacy when analytics detected", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["events"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("Classify detected analytics cookies"));
  });

  // ── EU AI Act Section ─────────────────────────────────────────────

  it("includes EU AI Act section when AI services are present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("EU AI Act (Regulation 2024/1689)"));
  });

  it("includes AI Act key requirements", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("Classify AI systems by risk level"));
    assert.ok(result.includes("transparency disclosures"));
    assert.ok(result.includes("human oversight"));
    assert.ok(result.includes("machine-readable format"));
  });

  it("does not include EU AI Act section when no AI services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "t@t.com", jurisdictions: ["gdpr"] };
    const result = generateComplianceNotes(scan, ctx)!;
    assert.ok(!result.includes("EU AI Act"));
  });

  // ── HIPAA Section ─────────────────────────────────────────────────

  it("includes HIPAA section when HIPAA compliance need is present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["health data"])],
      complianceNeeds: [{ document: "HIPAA Compliance", reason: "health data detected", priority: "required" as const }],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("Health Insurance Portability and Accountability Act"));
    assert.ok(result.includes("HIPAA"));
  });

  it("includes HIPAA key requirements", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["health data"])],
      complianceNeeds: [{ document: "HIPAA Compliance", reason: "health data detected", priority: "required" as const }],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("risk analysis"));
    assert.ok(result.includes("access controls"));
    assert.ok(result.includes("Business Associate Agreements"));
    assert.ok(result.includes("breach notification"));
    assert.ok(result.includes("60 days"));
  });

  it("does not include HIPAA section when no HIPAA compliance need", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(!result.includes("HIPAA"));
  });

  // ── COPPA Section ─────────────────────────────────────────────────

  it("includes COPPA section when COPPA compliance need is present", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["user events"])],
      complianceNeeds: [{ document: "COPPA Compliance", reason: "child-directed content", priority: "required" as const }],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("Children's Online Privacy Protection Act"));
    assert.ok(result.includes("COPPA"));
  });

  it("includes COPPA key requirements", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["user events"])],
      complianceNeeds: [{ document: "COPPA Compliance", reason: "child-directed content", priority: "required" as const }],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("verifiable parental consent"));
    assert.ok(result.includes("under 13"));
    assert.ok(result.includes("age-screening mechanism"));
  });

  it("does not include COPPA section when no COPPA compliance need", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(!result.includes("COPPA"));
  });

  // ── PCI DSS Section ───────────────────────────────────────────────

  it("includes PCI DSS section when PCI compliance need is present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
      complianceNeeds: [{ document: "PCI DSS Compliance", reason: "payment processing", priority: "recommended" as const }],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("Payment Card Industry Data Security Standard"));
    assert.ok(result.includes("PCI DSS"));
  });

  it("shows SAQ D warning when raw card handling is detected (required priority)", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
      complianceNeeds: [{ document: "PCI DSS Compliance", reason: "raw card data", priority: "required" as const }],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("raw card data directly"));
    assert.ok(result.includes("SAQ D"));
  });

  it("shows SAQ A for non-raw-card payment (recommended priority)", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
      complianceNeeds: [{ document: "PCI DSS Compliance", reason: "payment processing", priority: "recommended" as const }],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("SAQ A"));
    assert.ok(!result.includes("raw card data directly"));
  });

  it("includes PCI DSS key requirements", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
      complianceNeeds: [{ document: "PCI DSS Compliance", reason: "payment processing", priority: "recommended" as const }],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("Encrypt cardholder data"));
    assert.ok(result.includes("Log and monitor"));
    assert.ok(result.includes("information security policy"));
  });

  // ── Infrastructure Section ────────────────────────────────────────

  it("includes infrastructure section when security policy with infrastructure is present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
      complianceNeeds: [{ document: "Security Policy", reason: "infrastructure configuration detected", priority: "recommended" as const }],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("Infrastructure Considerations"));
  });

  it("includes data retention infrastructure when persistent data detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
      complianceNeeds: [{ document: "Data Retention Policy", reason: "persistent data volumes", priority: "recommended" as const }],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("Infrastructure Considerations"));
    assert.ok(result.includes("persistent volumes"));
  });

  it("does not include infrastructure section when no infrastructure compliance needs", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(!result.includes("Infrastructure Considerations"));
  });

  // ── Recommended Next Steps ────────────────────────────────────────

  it("includes recommended next steps", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("Recommended Next Steps"));
    assert.ok(result.includes("qualified legal counsel"));
    assert.ok(result.includes("Re-run Codepliant"));
  });

  // ── Footer ────────────────────────────────────────────────────────

  it("includes Codepliant attribution in footer", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("informational purposes only"));
  });

  // ── Section numbering ─────────────────────────────────────────────

  it("numbers sections sequentially", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["prompts"]),
        makeService("posthog", "analytics", ["events"]),
      ],
    });
    const result = generateComplianceNotes(scan)!;
    assert.ok(result.includes("## 1."));
    assert.ok(result.includes("## 2."));
    assert.ok(result.includes("## 3."));
  });

  // ── Comprehensive test with all sections ──────────────────────────

  it("generates all regulation sections when all conditions are met", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["prompts"]),
        makeService("stripe", "payment", ["card data"]),
        makeService("posthog", "analytics", ["events"]),
        makeService("@clerk/nextjs", "auth", ["user data"]),
      ],
      complianceNeeds: [
        { document: "HIPAA Compliance", reason: "health data", priority: "required" as const },
        { document: "COPPA Compliance", reason: "children", priority: "required" as const },
        { document: "PCI DSS Compliance", reason: "payments", priority: "recommended" as const },
        { document: "Security Policy", reason: "infrastructure configuration", priority: "recommended" as const },
        { document: "Data Retention Policy", reason: "persistent data", priority: "recommended" as const },
      ],
    });
    const ctx: GeneratorContext = {
      companyName: "Full Test Corp",
      contactEmail: "legal@test.com",
      jurisdictions: ["gdpr", "ccpa", "uk-gdpr"],
    };
    const result = generateComplianceNotes(scan, ctx)!;
    assert.ok(result.includes("Full Test Corp"));
    assert.ok(result.includes("GDPR"));
    assert.ok(result.includes("CCPA"));
    assert.ok(result.includes("UK General Data Protection Regulation"));
    assert.ok(result.includes("ePrivacy Directive"));
    assert.ok(result.includes("EU AI Act"));
    assert.ok(result.includes("HIPAA"));
    assert.ok(result.includes("COPPA"));
    assert.ok(result.includes("PCI DSS"));
    assert.ok(result.includes("Infrastructure Considerations"));
    assert.ok(result.includes("Recommended Next Steps"));
  });
});
