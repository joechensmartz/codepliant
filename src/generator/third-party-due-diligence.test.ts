import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateThirdPartyDueDiligence } from "./third-party-due-diligence.js";
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

describe("generateThirdPartyDueDiligence", () => {
  // ── Null guard ──────────────────────────────────────────────────────

  it("returns null when no services are present", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateThirdPartyDueDiligence(scan), null);
  });

  // ── Basic generation ────────────────────────────────────────────────

  it("returns a non-null string when services are present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan);
    assert.ok(result !== null);
    assert.ok(result.length > 0);
  });

  it("includes title", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("# Third-Party Due Diligence Template"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  // ── Context values ──────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "info@acme.com" };
    const result = generateThirdPartyDueDiligence(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "vendor@acme.com" };
    const result = generateThirdPartyDueDiligence(scan, ctx)!;
    assert.ok(result.includes("vendor@acme.com"));
  });

  it("uses placeholder email when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses context DPO email", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@b.com", dpoEmail: "dpo@acme.com" };
    const result = generateThirdPartyDueDiligence(scan, ctx)!;
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("falls back to contactEmail for DPO email", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "fallback@acme.com" };
    const result = generateThirdPartyDueDiligence(scan, ctx)!;
    assert.ok(result.includes("fallback@acme.com"));
  });

  // ── Section 1: Purpose ──────────────────────────────────────────────

  it("includes Purpose section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("## 1. Purpose"));
  });

  it("describes when to use the template", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("Evaluating a new SaaS vendor"));
    assert.ok(result.includes("Renewing an existing vendor relationship"));
    assert.ok(result.includes("material change"));
  });

  // ── Section 2: Vendor Information ───────────────────────────────────

  it("includes Vendor Information section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("## 2. Vendor Information"));
    assert.ok(result.includes("**Vendor name**"));
    assert.ok(result.includes("**Primary contact email**"));
    assert.ok(result.includes("**Assessment date**"));
  });

  // ── Section 3: Data Classification ──────────────────────────────────

  it("includes Data Classification section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("## 3. Data Classification"));
    assert.ok(result.includes("Personal identifiers"));
    assert.ok(result.includes("Financial data"));
    assert.ok(result.includes("Health data"));
    assert.ok(result.includes("Location data"));
  });

  it("includes AI data categories when AI detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("AI training data"));
    assert.ok(result.includes("AI model outputs"));
  });

  it("omits AI data categories when no AI detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(!result.includes("AI training data"));
  });

  // ── Section 4: Security Assessment ──────────────────────────────────

  it("includes Security Assessment section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("## 4. Security Assessment"));
  });

  it("includes Infrastructure & Architecture subsection", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("### 4.1 Infrastructure & Architecture"));
    assert.ok(result.includes("encrypt data at rest"));
    assert.ok(result.includes("encrypt data in transit"));
  });

  it("includes Access Control subsection", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("### 4.2 Access Control"));
    assert.ok(result.includes("multi-factor authentication"));
    assert.ok(result.includes("role-based access control"));
  });

  it("includes Incident Response subsection", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("### 4.3 Incident Response"));
    assert.ok(result.includes("breach notification timeline"));
  });

  it("includes Vulnerability Management subsection", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("### 4.4 Vulnerability Management"));
    assert.ok(result.includes("penetration testing"));
  });

  // ── Section 5: Privacy Assessment ───────────────────────────────────

  it("includes Privacy Assessment section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("## 5. Privacy Assessment"));
    assert.ok(result.includes("published privacy policy"));
    assert.ok(result.includes("data subject access requests"));
    assert.ok(result.includes("data deletion requests"));
    assert.ok(result.includes("Data Protection Officer"));
  });

  it("includes AI privacy questions when AI detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("AI model training"));
    assert.ok(result.includes("automated decision-making"));
  });

  it("omits AI privacy questions when no AI detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(!result.includes("AI model training"));
  });

  // ── Section 6: Compliance Assessment ────────────────────────────────

  it("includes Compliance Assessment section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("## 6. Compliance Assessment"));
  });

  it("includes SOC 2 and ISO 27001 certification questions", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("SOC 2 Type II"));
    assert.ok(result.includes("ISO 27001"));
  });

  it("includes GDPR compliance question when EU jurisdiction set", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@b.com", jurisdiction: "EU" };
    const result = generateThirdPartyDueDiligence(scan, ctx)!;
    assert.ok(result.includes("GDPR compliant"));
  });

  it("omits GDPR question when no EU jurisdiction", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@b.com", jurisdiction: "US" };
    const result = generateThirdPartyDueDiligence(scan, ctx)!;
    assert.ok(!result.includes("GDPR compliant"));
  });

  it("includes CCPA question when US jurisdiction set", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@b.com", jurisdiction: "US" };
    const result = generateThirdPartyDueDiligence(scan, ctx)!;
    assert.ok(result.includes("CCPA/CPRA compliant"));
  });

  it("includes CCPA question via jurisdictions array", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@b.com", jurisdictions: ["CCPA"] };
    const result = generateThirdPartyDueDiligence(scan, ctx)!;
    assert.ok(result.includes("CCPA/CPRA compliant"));
  });

  it("includes PCI DSS question when payment services detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("PCI DSS"));
  });

  it("omits PCI DSS question when no payment services", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(!result.includes("PCI DSS"));
  });

  it("includes contractual subsection", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("### 6.2 Contractual"));
    assert.ok(result.includes("Data Processing Agreement"));
    assert.ok(result.includes("Standard Contractual Clauses"));
  });

  // ── Section 7: Scoring Rubric ───────────────────────────────────────

  it("includes Scoring Rubric section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("## 7. Scoring Rubric"));
  });

  it("includes score definitions (0-3)", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("Not implemented"));
    assert.ok(result.includes("Partial"));
    assert.ok(result.includes("Implemented"));
    assert.ok(result.includes("Mature"));
  });

  it("includes risk classification thresholds", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("### 7.3 Risk Classification"));
    assert.ok(result.includes("Low Risk"));
    assert.ok(result.includes("Medium Risk"));
    assert.ok(result.includes("High Risk"));
    assert.ok(result.includes("Critical Risk"));
    assert.ok(result.includes("85%"));
  });

  it("includes mandatory hard fail requirements", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("### 7.4 Mandatory Requirements"));
    assert.ok(result.includes("encrypted at rest"));
    assert.ok(result.includes("encrypted in transit"));
    assert.ok(result.includes("incident response plan"));
    assert.ok(result.includes("72 hours"));
    assert.ok(result.includes("Must sign a DPA"));
  });

  it("calculates total questions correctly for base case", () => {
    // No AI, no EU, no US, no payment => S(21) + P(11) + C(13) = 45
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("| **Total** | **45** |"));
  });

  it("adjusts question count for AI services", () => {
    // AI adds P12, P13 (2 privacy) + 2 compliance AI = 45 + 4 = 49
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("| **Total** | **49** |"));
  });

  it("adjusts question count for payment services", () => {
    // Payment adds PCI DSS (C5) => 45 + 1 = 46
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("| **Total** | **46** |"));
  });

  // ── Section 8: Assessment Workflow ──────────────────────────────────

  it("includes Assessment Workflow section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("## 8. Assessment Workflow"));
    assert.ok(result.includes("Business owner submits vendor request"));
    assert.ok(result.includes("DPO scores responses"));
    assert.ok(result.includes("Annual reassessment"));
  });

  // ── Section 9: Assessment Summary ───────────────────────────────────

  it("includes Assessment Summary section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("## 9. Assessment Summary"));
    assert.ok(result.includes("Approved / Conditional / Escalated / Rejected"));
    assert.ok(result.includes("Next review date"));
  });

  // ── Section 10: Contact ─────────────────────────────────────────────

  it("includes Contact section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("## 10. Contact"));
    assert.ok(result.includes("DPO"));
    assert.ok(result.includes("General Contact"));
  });

  // ── Footer ──────────────────────────────────────────────────────────

  it("includes Codepliant footer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("Codepliant"));
  });

  it("includes disclaimer about legal review", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateThirdPartyDueDiligence(scan)!;
    assert.ok(result.includes("Review with your DPO and legal counsel"));
  });

  // ── Jurisdiction handling via both fields ───────────────────────────

  it("combines jurisdiction and jurisdictions fields", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@b.com",
      jurisdiction: "EU",
      jurisdictions: ["CCPA"],
    };
    const result = generateThirdPartyDueDiligence(scan, ctx)!;
    // Both EU (GDPR) and CCPA questions should be present
    assert.ok(result.includes("GDPR compliant"));
    assert.ok(result.includes("CCPA/CPRA compliant"));
  });

  it("handles UK jurisdiction for GDPR-related questions", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@b.com", jurisdiction: "UK" };
    const result = generateThirdPartyDueDiligence(scan, ctx)!;
    assert.ok(result.includes("GDPR compliant"));
  });
});
