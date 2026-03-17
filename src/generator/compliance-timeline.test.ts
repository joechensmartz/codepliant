import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateComplianceTimeline } from "./compliance-timeline.js";
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

describe("generateComplianceTimeline", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when no services are detected", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateComplianceTimeline(scan), null);
  });

  // ── Basic generation ──────────────────────────────────────────────

  it("generates a document when services are detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateComplianceTimeline(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Compliance Timeline"));
  });

  it("includes the project name", () => {
    const scan = makeScan({
      projectName: "my-app",
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("my-app"));
  });

  it("includes a last-updated date", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("**Last updated:**"));
  });

  it("includes the disclaimer about legal advice", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("not legal advice"));
  });

  // ── Context / Company Info ─────────────────────────────────────────

  it("uses default company name when no context provided", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses provided company name from context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "privacy@acme.com" };
    const result = generateComplianceTimeline(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  // ── Key Regulatory Deadlines Table ────────────────────────────────

  it("includes key regulatory deadlines section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("Key Regulatory Deadlines"));
  });

  it("includes EU AI Act deadline when AI services detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("Aug 2, 2026"));
    assert.ok(result.includes("EU AI Act"));
    assert.ok(result.includes("Article 50"));
  });

  it("includes GDPR ongoing deadline by default", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("GDPR"));
    assert.ok(result.includes("Ongoing"));
  });

  it("includes CCPA annual deadline when ccpa jurisdiction is set", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "t@t.com", jurisdictions: ["ccpa"] };
    const result = generateComplianceTimeline(scan, ctx)!;
    assert.ok(result.includes("CCPA/CPRA"));
    assert.ok(result.includes("Annually"));
  });

  it("includes CCPA when company location is US", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "t@t.com", companyLocation: "US" };
    const result = generateComplianceTimeline(scan, ctx)!;
    assert.ok(result.includes("CCPA/CPRA"));
  });

  it("includes CCPA when analytics services are present", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["events"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("CCPA/CPRA"));
  });

  it("includes PCI DSS ongoing deadline when payment services detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("PCI DSS"));
    assert.ok(result.includes("annual self-assessment"));
  });

  // ── US State Privacy Laws ─────────────────────────────────────────

  it("includes US state privacy law deadlines when CCPA applies", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "t@t.com", jurisdictions: ["ccpa"] };
    const result = generateComplianceTimeline(scan, ctx)!;
    assert.ok(result.includes("Colorado Privacy Act"));
    assert.ok(result.includes("Virginia CDPA"));
    assert.ok(result.includes("Texas Data Privacy"));
  });

  it("includes US state privacy laws when company location is US", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "t@t.com", companyLocation: "US" };
    const result = generateComplianceTimeline(scan, ctx)!;
    assert.ok(result.includes("Colorado Privacy Act"));
  });

  it("does not include US state laws when no CCPA and non-US location", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "t@t.com", jurisdictions: ["gdpr"], companyLocation: "DE" };
    const result = generateComplianceTimeline(scan, ctx)!;
    assert.ok(!result.includes("Colorado Privacy Act"));
  });

  // ── Deadline sorting ──────────────────────────────────────────────

  it("sorts deadlines by date (dated before ongoing)", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["prompts"]),
        makeService("stripe", "payment", ["card data"]),
      ],
    });
    const result = generateComplianceTimeline(scan)!;
    const aiActIdx = result.indexOf("Aug 2, 2026");
    const ongoingIdx = result.indexOf("Ongoing");
    assert.ok(aiActIdx > -1);
    assert.ok(ongoingIdx > -1);
    assert.ok(aiActIdx < ongoingIdx, "Dated deadlines should appear before ongoing");
  });

  // ── Project-Specific Obligations ──────────────────────────────────

  it("includes project-specific obligations section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("Project-Specific Obligations"));
  });

  it("includes AI services obligations when AI detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("AI Services"));
    assert.ok(result.includes("openai"));
    assert.ok(result.includes("AI Disclosure"));
  });

  it("includes payment services obligations when payment detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("Payment Services"));
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("PCI DSS annual"));
  });

  it("includes analytics obligations when analytics detected", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["events"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("Analytics / Advertising"));
    assert.ok(result.includes("posthog"));
    assert.ok(result.includes("Cookie consent"));
  });

  it("includes auth obligations when auth detected", () => {
    const scan = makeScan({
      services: [makeService("@clerk/nextjs", "auth", ["user data"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("Authentication Services"));
    assert.ok(result.includes("@clerk/nextjs"));
    assert.ok(result.includes("DSAR"));
  });

  it("includes email services obligations when email detected", () => {
    const scan = makeScan({
      services: [makeService("@sendgrid/mail", "email", ["email addresses"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("Email Services"));
    assert.ok(result.includes("@sendgrid/mail"));
    assert.ok(result.includes("CAN-SPAM"));
  });

  it("includes storage/database obligations when storage detected", () => {
    const scan = makeScan({
      services: [makeService("prisma", "database", ["user records"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("Storage / Database"));
    assert.ok(result.includes("prisma"));
    assert.ok(result.includes("retention schedules"));
  });

  it("shows service count in project obligations", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["prompts"]),
        makeService("stripe", "payment", ["card data"]),
        makeService("posthog", "analytics", ["events"]),
      ],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("3 service(s)"));
  });

  // ── Action Items Section ──────────────────────────────────────────

  it("includes action items section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("Action Items"));
  });

  it("includes immediate actions for GDPR", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("Immediate"));
    assert.ok(result.includes("GDPR privacy notice"));
    assert.ok(result.includes("Record of Processing Activities"));
  });

  it("includes immediate CCPA actions when CCPA applies", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["events"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("CCPA disclosures"));
  });

  it("includes upcoming AI Act actions when AI detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("Upcoming Deadlines"));
    assert.ok(result.includes("By Aug 2, 2026"));
    assert.ok(result.includes("AI Disclosure"));
  });

  it("includes ongoing actions", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("Ongoing"));
    assert.ok(result.includes("Re-run Codepliant"));
  });

  it("includes payment-specific immediate action", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("PCI DSS Self-Assessment"));
  });

  it("includes analytics-specific immediate action", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["events"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("cookie consent mechanism"));
  });

  // ── Recommended Review Schedule ───────────────────────────────────

  it("includes recommended review schedule", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("Recommended Review Schedule"));
  });

  it("includes standard review frequencies", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("Monthly"));
    assert.ok(result.includes("Quarterly"));
    assert.ok(result.includes("Semi-annually"));
    assert.ok(result.includes("Annually"));
  });

  it("includes PCI DSS SAQ in review schedule when payment detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("PCI DSS Self-Assessment Questionnaire"));
  });

  it("includes AI review items when AI detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("AI system risk re-assessment"));
    assert.ok(result.includes("AI Disclosure document review"));
  });

  it("includes compliance drift warning tip", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("Compliance drift"));
  });

  // ── Footer ────────────────────────────────────────────────────────

  it("includes Codepliant attribution in footer", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card data"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("informational purposes only"));
  });

  // ── Section numbering ─────────────────────────────────────────────

  it("numbers sections sequentially", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateComplianceTimeline(scan)!;
    assert.ok(result.includes("## 1."));
    assert.ok(result.includes("## 2."));
    assert.ok(result.includes("## 3."));
    assert.ok(result.includes("## 4."));
  });

  // ── Comprehensive test ────────────────────────────────────────────

  it("generates all sections with diverse services and full context", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["prompts"]),
        makeService("stripe", "payment", ["card data"]),
        makeService("posthog", "analytics", ["events"]),
        makeService("@clerk/nextjs", "auth", ["user data"]),
        makeService("@sendgrid/mail", "email", ["email addresses"]),
        makeService("prisma", "database", ["user records"]),
      ],
    });
    const ctx: GeneratorContext = {
      companyName: "Full Test Corp",
      contactEmail: "legal@test.com",
      jurisdictions: ["gdpr", "ccpa"],
      companyLocation: "US",
    };
    const result = generateComplianceTimeline(scan, ctx)!;
    assert.ok(result.includes("Full Test Corp"));
    assert.ok(result.includes("Key Regulatory Deadlines"));
    assert.ok(result.includes("Project-Specific Obligations"));
    assert.ok(result.includes("Action Items"));
    assert.ok(result.includes("Recommended Review Schedule"));
    assert.ok(result.includes("AI Services"));
    assert.ok(result.includes("Payment Services"));
    assert.ok(result.includes("Analytics / Advertising"));
    assert.ok(result.includes("Authentication Services"));
    assert.ok(result.includes("Email Services"));
    assert.ok(result.includes("Storage / Database"));
    assert.ok(result.includes("6 service(s)"));
  });
});
