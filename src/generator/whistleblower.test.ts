import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateWhistleblowerPolicy, requiresWhistleblowerPolicy } from "./whistleblower.js";
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

describe("requiresWhistleblowerPolicy", () => {
  it("returns true for GDPR jurisdiction", () => {
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdiction: "GDPR" };
    assert.strictEqual(requiresWhistleblowerPolicy(ctx), true);
  });

  it("returns true for UK GDPR jurisdiction", () => {
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdiction: "UK GDPR" };
    assert.strictEqual(requiresWhistleblowerPolicy(ctx), true);
  });

  it("returns false for non-EU jurisdiction", () => {
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdiction: "CCPA" };
    assert.strictEqual(requiresWhistleblowerPolicy(ctx), false);
  });

  it("returns true when jurisdictions array includes GDPR", () => {
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      jurisdictions: ["CCPA", "GDPR"],
    };
    assert.strictEqual(requiresWhistleblowerPolicy(ctx), true);
  });

  it("returns true when jurisdictions array includes UK GDPR", () => {
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      jurisdictions: ["CCPA", "UK GDPR"],
    };
    assert.strictEqual(requiresWhistleblowerPolicy(ctx), true);
  });

  it("returns false when jurisdictions array has no EU entries", () => {
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      jurisdictions: ["CCPA", "LGPD"],
    };
    assert.strictEqual(requiresWhistleblowerPolicy(ctx), false);
  });

  it("returns false when no jurisdiction set", () => {
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com" };
    assert.strictEqual(requiresWhistleblowerPolicy(ctx), false);
  });
});

describe("generateWhistleblowerPolicy", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when jurisdiction is not EU-related", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdiction: "CCPA" };
    assert.strictEqual(generateWhistleblowerPolicy(scan, ctx), null);
  });

  it("returns null when no jurisdiction is set", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com" };
    assert.strictEqual(generateWhistleblowerPolicy(scan, ctx), null);
  });

  it("returns null with non-EU jurisdictions array", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      jurisdictions: ["CCPA", "LGPD"],
    };
    assert.strictEqual(generateWhistleblowerPolicy(scan, ctx), null);
  });

  // ── Generation with GDPR jurisdiction ──────────────────────────────

  it("generates policy when jurisdiction is GDPR", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdiction: "GDPR" };
    const result = generateWhistleblowerPolicy(scan, ctx);
    assert.ok(result !== null);
    assert.ok(result.includes("Whistleblower Policy"));
  });

  it("generates policy when jurisdiction is UK GDPR", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdiction: "UK GDPR" };
    const result = generateWhistleblowerPolicy(scan, ctx);
    assert.ok(result !== null);
    assert.ok(result.includes("Whistleblower Policy"));
  });

  it("generates policy when jurisdictions array includes GDPR", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      jurisdictions: ["CCPA", "GDPR"],
    };
    const result = generateWhistleblowerPolicy(scan, ctx);
    assert.ok(result !== null);
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdiction: "GDPR" };
    const result = generateWhistleblowerPolicy(scan, ctx)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  // ── Context values ────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com", jurisdiction: "GDPR" };
    const result = generateWhistleblowerPolicy(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses context contact email", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "compliance@acme.com", jurisdiction: "GDPR" };
    const result = generateWhistleblowerPolicy(scan, ctx)!;
    assert.ok(result.includes("compliance@acme.com"));
  });

  it("uses context DPO name as designated officer", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      jurisdiction: "GDPR",
      dpoName: "Jane Doe",
    };
    const result = generateWhistleblowerPolicy(scan, ctx)!;
    assert.ok(result.includes("Jane Doe"));
  });

  it("uses context DPO email for reporting channel", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      jurisdiction: "GDPR",
      dpoEmail: "whistleblower@acme.com",
    };
    const result = generateWhistleblowerPolicy(scan, ctx)!;
    assert.ok(result.includes("whistleblower@acme.com"));
  });

  it("falls back dpoEmail to contactEmail when not provided", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "contact@acme.com", jurisdiction: "GDPR" };
    const result = generateWhistleblowerPolicy(scan, ctx)!;
    // dpoEmail falls back to contactEmail
    assert.ok(result.includes("contact@acme.com"));
  });

  it("uses placeholder company name when not in context", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "", contactEmail: "", jurisdiction: "GDPR" };
    const result = generateWhistleblowerPolicy(scan, ctx)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses placeholder contact email when not in context", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "", contactEmail: "", jurisdiction: "GDPR" };
    const result = generateWhistleblowerPolicy(scan, ctx)!;
    assert.ok(result.includes("[compliance@example.com]"));
  });

  it("uses placeholder DPO name when not in context", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdiction: "GDPR" };
    const result = generateWhistleblowerPolicy(scan, ctx)!;
    assert.ok(result.includes("[Compliance Officer Name]"));
  });

  // ── Key content sections ──────────────────────────────────────────

  it("includes Purpose section referencing Directive 2019/1937", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdiction: "GDPR" };
    const result = generateWhistleblowerPolicy(scan, ctx)!;
    assert.ok(result.includes("## 1. Purpose"));
    assert.ok(result.includes("Directive 2019/1937") || result.includes("2019/1937"));
  });

  it("includes Scope section", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdiction: "GDPR" };
    const result = generateWhistleblowerPolicy(scan, ctx)!;
    assert.ok(result.includes("## 2. Scope"));
    assert.ok(result.includes("employees"));
    assert.ok(result.includes("Contractors"));
  });

  it("includes Reportable Breaches section", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdiction: "GDPR" };
    const result = generateWhistleblowerPolicy(scan, ctx)!;
    assert.ok(result.includes("## 3. Reportable Breaches"));
    assert.ok(result.includes("Data protection and privacy"));
    assert.ok(result.includes("Financial services"));
  });

  it("includes Internal Reporting Channels section", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdiction: "GDPR" };
    const result = generateWhistleblowerPolicy(scan, ctx)!;
    assert.ok(result.includes("## 4. Internal Reporting Channels"));
    assert.ok(result.includes("### 4.1 Email"));
    assert.ok(result.includes("### 4.2 Written Report"));
    assert.ok(result.includes("### 4.3 In-Person Meeting"));
    assert.ok(result.includes("### 4.4 Anonymous Reports"));
  });

  it("includes Reporting Procedure section with timelines", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdiction: "GDPR" };
    const result = generateWhistleblowerPolicy(scan, ctx)!;
    assert.ok(result.includes("## 5. Reporting Procedure"));
    assert.ok(result.includes("7 calendar days"));
    assert.ok(result.includes("3 months"));
  });

  it("includes Protection Against Retaliation section", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdiction: "GDPR" };
    const result = generateWhistleblowerPolicy(scan, ctx)!;
    assert.ok(result.includes("## 6. Protection Against Retaliation"));
    assert.ok(result.includes("Suspension, dismissal"));
    assert.ok(result.includes("Intimidation"));
  });

  it("includes Confidentiality section", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdiction: "GDPR" };
    const result = generateWhistleblowerPolicy(scan, ctx)!;
    assert.ok(result.includes("## 7. Confidentiality"));
    assert.ok(result.includes("strictly confidential"));
  });

  it("includes Data Protection section referencing GDPR", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdiction: "GDPR" };
    const result = generateWhistleblowerPolicy(scan, ctx)!;
    assert.ok(result.includes("## 8. Data Protection"));
    assert.ok(result.includes("General Data Protection Regulation"));
  });

  it("includes External Reporting section", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdiction: "GDPR" };
    const result = generateWhistleblowerPolicy(scan, ctx)!;
    assert.ok(result.includes("## 9. External Reporting"));
  });

  it("includes Record Keeping section", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdiction: "GDPR" };
    const result = generateWhistleblowerPolicy(scan, ctx)!;
    assert.ok(result.includes("## 10. Record Keeping"));
  });

  it("includes Contact section", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdiction: "GDPR" };
    const result = generateWhistleblowerPolicy(scan, ctx)!;
    assert.ok(result.includes("## 11. Contact"));
    assert.ok(result.includes("Designated Officer"));
  });

  // ── Disclaimer ────────────────────────────────────────────────────

  it("includes auto-generated disclaimer", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdiction: "GDPR" };
    const result = generateWhistleblowerPolicy(scan, ctx)!;
    assert.ok(result.includes("auto-generated") || result.includes("Disclaimer"));
  });

  // ── Company name appears in multiple sections ──────────────────────

  it("uses company name throughout the document", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "TestCorp", contactEmail: "a@a.com", jurisdiction: "GDPR" };
    const result = generateWhistleblowerPolicy(scan, ctx)!;
    // Company name should appear in purpose, channels, retaliation sections
    const occurrences = (result.match(/TestCorp/g) || []).length;
    assert.ok(occurrences >= 3, `Expected at least 3 occurrences of company name, got ${occurrences}`);
  });
});
