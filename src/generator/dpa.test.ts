import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateDPA } from "./dpa.js";
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

describe("generateDPA", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when no processor-category services detected", () => {
    const scan = makeScan({
      services: [makeService("prisma", "database", ["user records"])],
    });
    assert.strictEqual(generateDPA(scan), null);
  });

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateDPA(scan), null);
  });

  it("returns null with only database and storage services", () => {
    const scan = makeScan({
      services: [
        makeService("prisma", "database", ["user records"]),
        makeService("aws-sdk", "storage", ["files"]),
      ],
    });
    assert.strictEqual(generateDPA(scan), null);
  });

  // ── Generation with processor-category services ────────────────────

  it("generates DPA when AI services detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateDPA(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Data Processing Agreement"));
  });

  it("generates DPA when analytics services detected", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generateDPA(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Data Processing Agreement"));
  });

  it("generates DPA when email services detected", () => {
    const scan = makeScan({
      services: [makeService("@sendgrid/mail", "email", ["email address"])],
    });
    const result = generateDPA(scan);
    assert.ok(result !== null);
  });

  it("generates DPA when payment services detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info", "email"])],
    });
    const result = generateDPA(scan);
    assert.ok(result !== null);
  });

  it("generates DPA when monitoring services detected", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring", ["error traces", "user context"])],
    });
    const result = generateDPA(scan);
    assert.ok(result !== null);
  });

  // ── Context values ────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "legal@acme.com" };
    const result = generateDPA(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "legal@acme.com" };
    const result = generateDPA(scan, ctx)!;
    assert.ok(result.includes("legal@acme.com"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateDPA(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses placeholder email when no context", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateDPA(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  // ── Key content sections ──────────────────────────────────────────

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateDPA(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes project name", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateDPA(scan)!;
    assert.ok(result.includes("test-project"));
  });

  it("references GDPR Article 28", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateDPA(scan)!;
    assert.ok(result.includes("Article 28"));
  });

  it("includes subject matter and duration section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateDPA(scan)!;
    assert.ok(result.includes("Subject Matter and Duration"));
  });

  it("includes nature and purpose of processing section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateDPA(scan)!;
    assert.ok(result.includes("Nature and Purpose of Processing"));
  });

  it("includes types of personal data section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateDPA(scan)!;
    assert.ok(result.includes("Types of Personal Data"));
  });

  it("includes data categories from scan when present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
      dataCategories: [
        { category: "Financial", description: "Payment card data", sources: ["stripe"] },
        { category: "Identity", description: "Names and email addresses", sources: ["stripe"] },
      ],
    });
    const result = generateDPA(scan)!;
    assert.ok(result.includes("Financial"));
    assert.ok(result.includes("Payment card data"));
    assert.ok(result.includes("Identity"));
  });

  it("uses fallback text when no data categories present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
      dataCategories: [],
    });
    const result = generateDPA(scan)!;
    assert.ok(result.includes("Personal data as determined by the application"));
  });

  it("includes categories of data subjects section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateDPA(scan)!;
    assert.ok(result.includes("Categories of Data Subjects"));
    assert.ok(result.includes("End users"));
  });

  it("includes obligations of the processor section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateDPA(scan)!;
    assert.ok(result.includes("Obligations of the Processor"));
    assert.ok(result.includes("Article 32"));
  });

  // ── Sub-Processors table ──────────────────────────────────────────

  it("includes sub-processors table with service details", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info", "email"])],
    });
    const result = generateDPA(scan)!;
    assert.ok(result.includes("Sub-Processor"));
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("payment"));
    assert.ok(result.includes("payment info, email"));
  });

  it("lists multiple sub-processors in the table", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
        makeService("@sendgrid/mail", "email", ["email address"]),
      ],
    });
    const result = generateDPA(scan)!;
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("posthog"));
    assert.ok(result.includes("@sendgrid/mail"));
  });

  it("includes sub-processor engagement rules", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateDPA(scan)!;
    assert.ok(result.includes("Sub-Processor Engagement"));
    assert.ok(result.includes("general written authorization"));
  });

  // ── International transfers ───────────────────────────────────────

  it("includes international data transfers section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateDPA(scan)!;
    assert.ok(result.includes("International Data Transfers"));
    assert.ok(result.includes("Standard Contractual Clauses") || result.includes("SCC"));
  });

  // ── Security measures ─────────────────────────────────────────────

  it("includes security measures section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateDPA(scan)!;
    assert.ok(result.includes("Security Measures"));
    assert.ok(result.includes("Encryption"));
    assert.ok(result.includes("Access Controls"));
  });

  // ── Breach notification ───────────────────────────────────────────

  it("includes data breach notification section (72 hours)", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateDPA(scan)!;
    assert.ok(result.includes("Data Breach Notification"));
    assert.ok(result.includes("72 hours"));
    assert.ok(result.includes("Article 33") || result.includes("Article 34"));
  });

  // ── Return and deletion ───────────────────────────────────────────

  it("includes return and deletion of data section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateDPA(scan)!;
    assert.ok(result.includes("Return and Deletion"));
  });

  // ── Controller rights ─────────────────────────────────────────────

  it("includes controller rights section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateDPA(scan)!;
    assert.ok(result.includes("Controller's Rights") || result.includes("Controller"));
    assert.ok(result.includes("audit") || result.includes("Audit"));
  });

  // ── Governing law ─────────────────────────────────────────────────

  it("includes governing law section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateDPA(scan)!;
    assert.ok(result.includes("Governing Law"));
  });

  // ── Contact and disclaimer ────────────────────────────────────────

  it("includes contact section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateDPA(scan)!;
    assert.ok(result.includes("Contact") || result.includes("contact"));
  });

  it("includes legal disclaimer", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateDPA(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("legal professional") || result.includes("reviewed"));
  });

  // ── Mixed services: only processor categories included ────────────

  it("excludes non-processor services from sub-processor table", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("prisma", "database", ["user records"]),
      ],
    });
    const result = generateDPA(scan)!;
    assert.ok(result.includes("stripe"));
    // database is not a processor category, so prisma should not appear in the table
    // (it's not in the sub-processor table rows, though it may appear in other text)
    const tableSection = result.split("Sub-Processor")[1]?.split("##")[0] || "";
    assert.ok(!tableSection.includes("prisma"));
  });
});
