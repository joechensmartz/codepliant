import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateDataProcessingInventory } from "./data-processing-inventory.js";
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

describe("generateDataProcessingInventory", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateDataProcessingInventory(scan), null);
  });

  it("returns null when no recognized categories produce activities", () => {
    // The "social" category is not mapped by deriveActivities
    const scan = makeScan({ services: [makeService("facebook-sdk", "social")] });
    assert.strictEqual(generateDataProcessingInventory(scan), null);
  });

  // ── Generation with services ───────────────────────────────────────

  it("generates inventory with a single auth service", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result !== null);
    assert.ok(result.includes("# Data Processing Inventory"));
  });

  it("generates inventory with multiple services", () => {
    const scan = makeScan({
      services: [
        makeService("clerk", "auth"),
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("# Data Processing Inventory"));
    assert.ok(result.includes("| Total processing activities | 3 |"));
  });

  // ── Context values ─────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generateDataProcessingInventory(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "privacy@acme.com" };
    const result = generateDataProcessingInventory(scan, ctx)!;
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("uses context DPO name and email", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      dpoName: "Jane DPO",
      dpoEmail: "dpo@acme.com",
    };
    const result = generateDataProcessingInventory(scan, ctx)!;
    assert.ok(result.includes("Jane DPO"));
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("uses placeholder DPO name when no context", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("[Data Protection Officer]"));
  });

  it("includes EU Representative when provided", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      euRepresentative: "EU Rep GmbH",
    };
    const result = generateDataProcessingInventory(scan, ctx)!;
    assert.ok(result.includes("EU Representative"));
    assert.ok(result.includes("EU Rep GmbH"));
  });

  it("does not include EU Representative when not provided", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(!result.includes("EU Representative"));
  });

  it("includes website when provided", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      website: "https://acme.com",
    };
    const result = generateDataProcessingInventory(scan, ctx)!;
    assert.ok(result.includes("https://acme.com"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes next review date one year out", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("Next Review"));
  });

  // ── GDPR Article 30 header ─────────────────────────────────────────

  it("references GDPR Article 30", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("GDPR Article 30"));
  });

  // ── Processing Activity: Auth ──────────────────────────────────────

  it("generates auth processing activity", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("User Authentication & Account Management"));
    assert.ok(result.includes("Contract performance (Art. 6(1)(b))"));
    assert.ok(result.includes("clerk"));
    assert.ok(result.includes("Email address"));
    assert.ok(result.includes("**Medium**"));
  });

  // ── Processing Activity: Analytics ─────────────────────────────────

  it("generates analytics processing activity", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("Website & Product Analytics"));
    assert.ok(result.includes("Consent (Art. 6(1)(a))"));
    assert.ok(result.includes("posthog"));
    assert.ok(result.includes("Page views"));
  });

  // ── Processing Activity: Payment ───────────────────────────────────

  it("generates payment processing activity", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("Payment Processing & Billing"));
    assert.ok(result.includes("PCI DSS"));
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("**High**"));
  });

  // ── Processing Activity: Email ─────────────────────────────────────

  it("generates email processing activity", () => {
    const scan = makeScan({ services: [makeService("resend", "email")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("Email Communications"));
    assert.ok(result.includes("resend"));
    assert.ok(result.includes("**Low**"));
  });

  // ── Processing Activity: AI ────────────────────────────────────────

  it("generates AI processing activity", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("AI-Powered Features & Processing"));
    assert.ok(result.includes("openai"));
    assert.ok(result.includes("User prompts"));
    assert.ok(result.includes("**High**"));
    assert.ok(result.includes("Yes — see DPIA"));
  });

  // ── Processing Activity: Monitoring ────────────────────────────────

  it("generates monitoring processing activity", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("Error Monitoring & Application Performance"));
    assert.ok(result.includes("Legitimate interest"));
    assert.ok(result.includes("sentry"));
    assert.ok(result.includes("**Low**"));
  });

  // ── Processing Activity: Storage ───────────────────────────────────

  it("generates storage processing activity", () => {
    const scan = makeScan({ services: [makeService("s3", "storage")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("File Storage & Media Management"));
    assert.ok(result.includes("s3"));
    assert.ok(result.includes("Uploaded files"));
  });

  // ── Processing Activity: Advertising ───────────────────────────────

  it("generates advertising processing activity", () => {
    const scan = makeScan({ services: [makeService("google-ads", "advertising")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("Advertising & Conversion Tracking"));
    assert.ok(result.includes("google-ads"));
    assert.ok(result.includes("**High**"));
    assert.ok(result.includes("Yes — see DPIA"));
  });

  // ── Processing Activity: Database ──────────────────────────────────

  it("generates database processing activity", () => {
    const scan = makeScan({ services: [makeService("prisma", "database")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("Primary Data Storage"));
    assert.ok(result.includes("prisma (managed/self-hosted)"));
    assert.ok(result.includes("**Medium**"));
    // Database entries have transfersOutsideEEA = false
    assert.ok(result.includes("| **International Transfers** | No |"));
  });

  // ── Sequential IDs ─────────────────────────────────────────────────

  it("assigns sequential PA IDs", () => {
    const scan = makeScan({
      services: [
        makeService("clerk", "auth"),
        makeService("posthog", "analytics"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("PA-001"));
    assert.ok(result.includes("PA-002"));
    assert.ok(result.includes("PA-003"));
  });

  // ── Summary Dashboard ──────────────────────────────────────────────

  it("includes Processing Activities Summary section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("## 2. Processing Activities Summary"));
  });

  it("counts risk levels correctly", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),  // High
        makeService("clerk", "auth"),      // Medium
        makeService("resend", "email"),    // Low
      ],
    });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("| High risk activities | 1 |"));
    assert.ok(result.includes("| Medium risk activities | 1 |"));
    assert.ok(result.includes("| Low risk activities | 1 |"));
  });

  it("shows DPIA warning when high-risk activities exist", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("DPIA Required"));
    assert.ok(result.includes("GDPR Article 35"));
  });

  it("does not show DPIA warning when no high-risk activities", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(!result.includes("DPIA Required"));
  });

  it("uses singular form for 1 high-risk activity", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("1 high-risk processing activity has been identified"));
  });

  it("uses plural form for multiple high-risk activities", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("2 high-risk processing activities have been identified"));
  });

  it("counts international transfers correctly", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),   // transfers = true
        makeService("prisma", "database"),   // transfers = false
      ],
    });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("| Activities with international transfers | 1 |"));
  });

  it("counts automated decision-making correctly", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),             // automated = true
        makeService("google-ads", "advertising"), // automated = true
        makeService("clerk", "auth"),             // automated = false
      ],
    });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("| Activities with automated decision-making | 2 |"));
  });

  // ── Overview Table section ─────────────────────────────────────────

  it("includes Overview Table section", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("## 4. Processing Activities Overview Table"));
    assert.ok(result.includes("| ID | Activity | Legal Basis | Data Types | Risk |"));
  });

  it("truncates data types to 3 in overview table", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateDataProcessingInventory(scan)!;
    // Auth has 7 data types, should show first 3 + "..."
    assert.ok(result.includes("..."));
  });

  // ── Legal Basis Summary section ────────────────────────────────────

  it("includes Legal Basis Summary section", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("## 5. Legal Basis Summary"));
  });

  it("groups activities by legal basis", () => {
    const scan = makeScan({
      services: [
        makeService("clerk", "auth"),    // Contract performance
        makeService("stripe", "payment"), // Contract performance / Legal obligation
      ],
    });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("Contract performance"));
  });

  // ── International Data Transfers section ───────────────────────────

  it("includes International Data Transfers section", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("## 6. International Data Transfers"));
  });

  it("lists transfer activities with recipients and safeguards", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("transfers of personal data outside"));
    assert.ok(result.includes("clerk"));
    assert.ok(result.includes("Standard Contractual Clauses"));
  });

  it("shows no transfers message when only database (no EEA transfers)", () => {
    const scan = makeScan({ services: [makeService("prisma", "database")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("No processing activities involve international data transfers"));
  });

  // ── Review & Maintenance section ───────────────────────────────────

  it("includes Review & Maintenance section", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("## 7. Review & Maintenance"));
    assert.ok(result.includes("Annual review"));
    assert.ok(result.includes("GDPR Art. 30(4)"));
  });

  // ── Footer ─────────────────────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("Codepliant"));
  });

  it("includes review disclaimer", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateDataProcessingInventory(scan)!;
    assert.ok(result.includes("reviewed and completed by your Data Protection Officer"));
  });

  // ── Comprehensive test ─────────────────────────────────────────────

  it("generates comprehensive inventory with all service categories", () => {
    const scan = makeScan({
      services: [
        makeService("clerk", "auth"),
        makeService("posthog", "analytics"),
        makeService("stripe", "payment"),
        makeService("resend", "email"),
        makeService("openai", "ai"),
        makeService("sentry", "monitoring"),
        makeService("s3", "storage"),
        makeService("google-ads", "advertising"),
        makeService("prisma", "database"),
      ],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      dpoName: "Jane DPO",
      dpoEmail: "dpo@acme.com",
      euRepresentative: "EU Rep GmbH",
      website: "https://acme.com",
    };
    const result = generateDataProcessingInventory(scan, ctx)!;
    // Context
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("privacy@acme.com"));
    assert.ok(result.includes("Jane DPO"));
    assert.ok(result.includes("EU Rep GmbH"));
    assert.ok(result.includes("https://acme.com"));
    // All 9 activities
    assert.ok(result.includes("| Total processing activities | 9 |"));
    assert.ok(result.includes("PA-001"));
    assert.ok(result.includes("PA-009"));
    // All activity types
    assert.ok(result.includes("User Authentication & Account Management"));
    assert.ok(result.includes("Website & Product Analytics"));
    assert.ok(result.includes("Payment Processing & Billing"));
    assert.ok(result.includes("Email Communications"));
    assert.ok(result.includes("AI-Powered Features & Processing"));
    assert.ok(result.includes("Error Monitoring & Application Performance"));
    assert.ok(result.includes("File Storage & Media Management"));
    assert.ok(result.includes("Advertising & Conversion Tracking"));
    assert.ok(result.includes("Primary Data Storage"));
    // Risk levels present
    assert.ok(result.includes("**High**"));
    assert.ok(result.includes("**Medium**"));
    assert.ok(result.includes("**Low**"));
    // DPIA warning (3 high risk: payment, ai, advertising)
    assert.ok(result.includes("3 high-risk processing activities have been identified"));
    // International transfers section has entries
    assert.ok(result.includes("transfers of personal data outside"));
  });
});
