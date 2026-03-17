import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateDataMappingRegister } from "./data-mapping-register.js";
import type { GeneratorContext } from "./index.js";

function makeService(
  name: string,
  category: DetectedService["category"],
  dataCollected: string[] = ["test data"],
  isDataProcessor?: boolean,
): DetectedService {
  return {
    name,
    category,
    evidence: [{ type: "dependency", file: "package.json", detail: `${name} detected` }],
    dataCollected,
    ...(isDataProcessor !== undefined ? { isDataProcessor } : {}),
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

describe("generateDataMappingRegister", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateDataMappingRegister(scan), null);
  });

  it("returns null when services have no dataCollected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", [])],
    });
    const result = generateDataMappingRegister(scan);
    assert.strictEqual(result, null);
  });

  // ── Generation with services ───────────────────────────────────────

  it("generates register with a single service", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["credit card numbers", "billing address"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result !== null);
    assert.ok(result.includes("# Data Mapping Register"));
  });

  it("generates register with multiple services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["credit card numbers"]),
        makeService("posthog", "analytics", ["IP addresses"]),
        makeService("openai", "ai", ["user prompts"]),
      ],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("# Data Mapping Register"));
    assert.ok(result.includes("credit card numbers"));
    assert.ok(result.includes("IP addresses"));
    assert.ok(result.includes("user prompts"));
  });

  // ── Context values ─────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generateDataMappingRegister(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "privacy@acme.com" };
    const result = generateDataMappingRegister(scan, ctx)!;
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("uses placeholder contact email when no context", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses context DPO name", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", dpoName: "Jane Smith" };
    const result = generateDataMappingRegister(scan, ctx)!;
    assert.ok(result.includes("Jane Smith"));
  });

  it("uses placeholder DPO name when no context", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("[Data Protection Officer Name]"));
  });

  it("uses context DPO email", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", dpoEmail: "dpo@acme.com" };
    const result = generateDataMappingRegister(scan, ctx)!;
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("falls back dpoEmail to contactEmail when not provided", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "contact@acme.com" };
    const result = generateDataMappingRegister(scan, ctx)!;
    // DPO Email row should show contactEmail
    const dpoEmailLine = result.split("\n").find((l) => l.includes("**DPO Email**"));
    assert.ok(dpoEmailLine);
    assert.ok(dpoEmailLine.includes("contact@acme.com"));
  });

  it("includes EU Representative when provided", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      euRepresentative: "EU Rep GmbH",
    };
    const result = generateDataMappingRegister(scan, ctx)!;
    assert.ok(result.includes("EU Rep GmbH"));
    assert.ok(result.includes("**EU Representative**"));
  });

  it("does not include EU Representative when not provided", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(!result.includes("**EU Representative**"));
  });

  it("includes website when provided", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      website: "https://acme.com",
    };
    const result = generateDataMappingRegister(scan, ctx)!;
    assert.ok(result.includes("https://acme.com"));
    assert.ok(result.includes("**Website**"));
  });

  it("does not include website when not provided", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(!result.includes("**Website**"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes next review date", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("Next Review Date"));
  });

  // ── Data Controller Information section ────────────────────────────

  it("includes Data Controller Information section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("## 1. Data Controller Information"));
    assert.ok(result.includes("**Data Controller**"));
    assert.ok(result.includes("**Contact Email**"));
    assert.ok(result.includes("**Data Protection Officer**"));
    assert.ok(result.includes("**DPO Email**"));
  });

  // ── Data Inventory section ─────────────────────────────────────────

  it("includes Data Inventory table", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("## 2. Data Inventory"));
    assert.ok(result.includes("| # | Data Element | Sensitivity | Source | Storage Location | Shared With | Lawful Basis | Retention |"));
  });

  it("lists data elements in inventory", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["credit card tokens", "billing address"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("credit card tokens"));
    assert.ok(result.includes("billing address"));
  });

  it("deduplicates data elements across services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["email addresses"]),
        makeService("resend", "email", ["email addresses"]),
      ],
    });
    const result = generateDataMappingRegister(scan)!;
    // Count occurrences in the data inventory table rows (lines starting with "| N |")
    const inventoryLines = result.split("\n").filter((l) => /^\| \d+ \|/.test(l));
    const emailRows = inventoryLines.filter((l) => l.includes("email addresses"));
    assert.strictEqual(emailRows.length, 1);
  });

  it("merges shared-with parties for deduplicated data", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["email addresses"]),
        makeService("resend", "email", ["email addresses"]),
      ],
    });
    const result = generateDataMappingRegister(scan)!;
    const inventoryLines = result.split("\n").filter((l) => /^\| \d+ \|/.test(l));
    const emailRow = inventoryLines.find((l) => l.includes("email addresses"))!;
    assert.ok(emailRow.includes("stripe"));
    assert.ok(emailRow.includes("resend"));
  });

  // ── Lawful basis mapping ───────────────────────────────────────────

  it("maps auth to contract performance lawful basis", () => {
    const scan = makeScan({
      services: [makeService("@clerk/nextjs", "auth", ["email"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("Contract performance (Art. 6(1)(b))"));
  });

  it("maps analytics to legitimate interest lawful basis", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["IP addresses"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("Legitimate interest (Art. 6(1)(f))"));
  });

  it("maps advertising to consent lawful basis", () => {
    const scan = makeScan({
      services: [makeService("google-ads", "advertising", ["tracking data"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("Consent (Art. 6(1)(a))"));
  });

  // ── Retention periods ──────────────────────────────────────────────

  it("shows payment retention as 7 years", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("7 years"));
  });

  it("shows analytics retention as 26 months", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("26 months"));
  });

  it("uses custom retention days when provided", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      dataRetentionDays: 365,
    };
    const result = generateDataMappingRegister(scan, ctx)!;
    assert.ok(result.includes("365 days"));
  });

  // ── Data sensitivity classification ────────────────────────────────

  it("classifies financial data correctly", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment card number"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("Financial"));
  });

  it("classifies directly identifiable data correctly", () => {
    const scan = makeScan({
      services: [makeService("@clerk/nextjs", "auth", ["email address"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("Directly Identifiable"));
  });

  it("classifies indirectly identifiable data correctly", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["device fingerprint"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("Indirectly Identifiable"));
  });

  it("classifies security credentials correctly", () => {
    const scan = makeScan({
      services: [makeService("@clerk/nextjs", "auth", ["password hashes"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("Security Credential"));
  });

  // ── Source derivation ──────────────────────────────────────────────

  it("derives automatic collection source for IP data", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["IP addresses"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("Automatic collection (HTTP request)"));
  });

  it("derives user-provided source for email data", () => {
    const scan = makeScan({
      services: [makeService("@clerk/nextjs", "auth", ["email address"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("User-provided (registration/form)"));
  });

  it("derives user-provided checkout source for payment data", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment card number"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("User-provided (checkout)"));
  });

  it("derives automatic collection source for cookie data", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["cookie identifiers"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("Automatic collection (cookies/SDK)"));
  });

  // ── Storage location derivation ────────────────────────────────────

  it("shows third-party storage for data processors", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("stripe (third-party)"));
  });

  it("shows self-managed for database with isDataProcessor false", () => {
    const scan = makeScan({
      services: [makeService("prisma", "database", ["user profiles"], false)],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("prisma (self-managed)"));
  });

  // ── Data Flow Summary section ──────────────────────────────────────

  it("includes Data Flow Summary section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("## 3. Data Flow Summary"));
  });

  it("groups data flows by sensitivity category", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment card number"]),
        makeService("@clerk/nextjs", "auth", ["email address"]),
      ],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("### Financial"));
    assert.ok(result.includes("### Directly Identifiable"));
  });

  // ── Third-Party Processors section ─────────────────────────────────

  it("includes Third-Party Processors section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("## 4. Third-Party Processors"));
    assert.ok(result.includes("| Processor | Data Shared | Purpose | DPA Status |"));
  });

  it("lists processors with their data and purpose", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("billing data"));
    assert.ok(result.includes("payment"));
    assert.ok(result.includes("To be verified"));
  });

  it("shows Internal only when isDataProcessor is false", () => {
    const scan = makeScan({
      services: [makeService("prisma", "database", ["user profiles"], false)],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("Internal only"));
  });

  // ── International Data Transfers section ───────────────────────────

  it("includes International Data Transfers section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("International Data Transfers"));
    assert.ok(result.includes("SCCs / Adequacy Decision"));
  });

  it("shows no processors message when none detected", () => {
    const scan = makeScan({
      services: [makeService("prisma", "database", ["user profiles"], false)],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("No third-party processors detected"));
  });

  // ── Retention Schedule section ─────────────────────────────────────

  it("includes Retention Schedule section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("Retention Schedule"));
    assert.ok(result.includes("| Data Category | Retention Period | Deletion Method | Legal Basis for Retention |"));
  });

  // ── Data categories from scan ──────────────────────────────────────

  it("includes data categories from scan result", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
      dataCategories: [
        { category: "health records", description: "Medical data", sources: ["forms"] },
      ],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("health records"));
  });

  // ── Section numbering with/without processors ──────────────────────

  it("uses correct section numbering when processors exist", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("## 4. Third-Party Processors"));
    assert.ok(result.includes("## 5. International Data Transfers"));
    assert.ok(result.includes("## 6. Retention Schedule"));
  });

  it("uses correct section numbering when no processors", () => {
    const scan = makeScan({
      services: [makeService("prisma", "database", ["user profiles"], false)],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("## 4. International Data Transfers"));
    assert.ok(result.includes("## 5. Retention Schedule"));
  });

  // ── Footer ─────────────────────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("Codepliant"));
  });

  it("includes GDPR Article 30 reference", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("GDPR Article 30"));
  });

  it("includes professional review disclaimer", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing data"])],
    });
    const result = generateDataMappingRegister(scan)!;
    assert.ok(result.includes("Data Protection Officer"));
    assert.ok(result.includes("does not constitute legal advice"));
  });

  // ── Comprehensive test ─────────────────────────────────────────────

  it("generates comprehensive register with all service categories", () => {
    const scan = makeScan({
      services: [
        makeService("@clerk/nextjs", "auth", ["email address", "password hashes"]),
        makeService("prisma", "database", ["user profiles"], false),
        makeService("stripe", "payment", ["payment card number", "billing address"]),
        makeService("posthog", "analytics", ["IP addresses", "cookie identifiers"]),
        makeService("openai", "ai", ["user prompts"]),
        makeService("resend", "email", ["email address"]),
      ],
      dataCategories: [
        { category: "Behavioral", description: "Usage patterns", sources: ["analytics"] },
      ],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      dpoName: "Jane Smith",
      dpoEmail: "dpo@acme.com",
      euRepresentative: "EU Rep GmbH",
      website: "https://acme.com",
    };
    const result = generateDataMappingRegister(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("Jane Smith"));
    assert.ok(result.includes("dpo@acme.com"));
    assert.ok(result.includes("EU Rep GmbH"));
    assert.ok(result.includes("https://acme.com"));
    assert.ok(result.includes("## 1. Data Controller Information"));
    assert.ok(result.includes("## 2. Data Inventory"));
    assert.ok(result.includes("## 3. Data Flow Summary"));
    assert.ok(result.includes("## 4. Third-Party Processors"));
    assert.ok(result.includes("International Data Transfers"));
    assert.ok(result.includes("Retention Schedule"));
  });
});
