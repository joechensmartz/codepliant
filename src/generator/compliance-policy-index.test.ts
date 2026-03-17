import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateCompliancePolicyIndex } from "./compliance-policy-index.js";
import type { GeneratorContext, GeneratedDocument } from "./index.js";

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

function makeDoc(name: string, filename: string): GeneratedDocument {
  return { name, filename, content: "# Test" };
}

describe("generateCompliancePolicyIndex", () => {
  // ── Null guards ──────────────────────────────────────────────────────

  it("returns null when no docs provided", () => {
    const result = generateCompliancePolicyIndex(makeScan());
    assert.strictEqual(result, null);
  });

  it("returns null when docs is undefined", () => {
    const result = generateCompliancePolicyIndex(makeScan(), undefined, undefined);
    assert.strictEqual(result, null);
  });

  it("returns null when docs is an empty array", () => {
    const result = generateCompliancePolicyIndex(makeScan(), undefined, []);
    assert.strictEqual(result, null);
  });

  // ── Basic generation ──────────────────────────────────────────────────

  it("generates output when docs are provided", () => {
    const docs = [makeDoc("Privacy Policy", "PRIVACY_POLICY.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(typeof result === "string");
    assert.ok(result.includes("# Compliance Policy Index"));
  });

  it("includes date in ISO format", () => {
    const docs = [makeDoc("Privacy Policy", "PRIVACY_POLICY.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result!));
  });

  it("includes project name from scan", () => {
    const docs = [makeDoc("Privacy Policy", "PRIVACY_POLICY.md")];
    const result = generateCompliancePolicyIndex(
      makeScan({ projectName: "my-saas-app" }),
      undefined,
      docs,
    );
    assert.ok(result!.includes("my-saas-app"));
  });

  // ── Context values ────────────────────────────────────────────────────

  it("uses company name from context", () => {
    const docs = [makeDoc("Privacy Policy", "PRIVACY_POLICY.md")];
    const ctx = makeCtx({ companyName: "TestCo Inc" });
    const result = generateCompliancePolicyIndex(makeScan(), ctx, docs);
    assert.ok(result!.includes("TestCo Inc"));
  });

  it("uses default placeholder when no context provided", () => {
    const docs = [makeDoc("Privacy Policy", "PRIVACY_POLICY.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("[Your Company Name]"));
  });

  // ── Total document and category counts ────────────────────────────────

  it("includes total document count", () => {
    const docs = [
      makeDoc("Privacy Policy", "PRIVACY_POLICY.md"),
      makeDoc("Cookie Policy", "COOKIE_POLICY.md"),
      makeDoc("AI Disclosure", "AI_DISCLOSURE.md"),
    ];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("**3 documents**"));
  });

  it("includes category count", () => {
    const docs = [
      makeDoc("Privacy Policy", "PRIVACY_POLICY.md"),
      makeDoc("Cookie Policy", "COOKIE_POLICY.md"),
      makeDoc("AI Disclosure", "AI_DISCLOSURE.md"),
    ];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("**3 categories**"));
  });

  // ── Category grouping ────────────────────────────────────────────────

  it("groups privacy docs into Privacy & Data Protection", () => {
    const docs = [makeDoc("Privacy Policy", "PRIVACY_POLICY.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("## Privacy & Data Protection"));
  });

  it("groups AI docs into AI & Machine Learning", () => {
    const docs = [makeDoc("AI Disclosure", "AI_DISCLOSURE.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("## AI & Machine Learning"));
  });

  it("groups security docs into Security", () => {
    const docs = [makeDoc("Security Policy", "SECURITY_POLICY.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("## Security"));
  });

  it("groups incident docs into Incident Management", () => {
    const docs = [makeDoc("Incident Response Plan", "INCIDENT_RESPONSE_PLAN.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("## Incident Management"));
  });

  it("groups vendor docs into Vendor & Third-Party Management", () => {
    const docs = [makeDoc("Subprocessor List", "SUBPROCESSOR_LIST.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("## Vendor & Third-Party Management"));
  });

  it("groups cookie docs into Cookies & Consent", () => {
    const docs = [makeDoc("Cookie Policy", "COOKIE_POLICY.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("## Cookies & Consent"));
  });

  it("groups SOC2 docs into Compliance Frameworks", () => {
    const docs = [makeDoc("SOC2 Readiness Checklist", "SOC2_READINESS_CHECKLIST.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("## Compliance Frameworks"));
  });

  it("groups terms docs into Legal & Terms", () => {
    const docs = [makeDoc("Terms of Service", "TERMS_OF_SERVICE.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("## Legal & Terms"));
  });

  it("groups employee docs into Organizational", () => {
    const docs = [makeDoc("Training Record", "TRAINING_RECORD.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("## Organizational"));
  });

  it("groups executive docs into Reporting & Communication", () => {
    const docs = [makeDoc("Executive Dashboard", "EXECUTIVE_DASHBOARD.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("## Reporting & Communication"));
  });

  it("groups risk docs into Risk Management", () => {
    const docs = [makeDoc("Risk Register", "RISK_REGISTER.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("## Risk Management"));
  });

  it("groups quick start docs into Guides & References", () => {
    const docs = [makeDoc("Quick Start Guide", "QUICK_START_COMPLIANCE_GUIDE.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("## Guides & References"));
  });

  it("puts uncategorized docs into Other", () => {
    const docs = [makeDoc("Custom Doc", "TOTALLY_CUSTOM_DOC.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("## Other"));
  });

  // ── Summary table ────────────────────────────────────────────────────

  it("includes Summary section with table header", () => {
    const docs = [makeDoc("Privacy Policy", "PRIVACY_POLICY.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("## Summary"));
    assert.ok(result!.includes("| Category | Documents |"));
  });

  it("summary table shows correct per-category count", () => {
    const docs = [
      makeDoc("Privacy Policy", "PRIVACY_POLICY.md"),
      makeDoc("Data Retention", "DATA_RETENTION_POLICY.md"),
    ];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("| Privacy & Data Protection | 2 |"));
  });

  it("summary table shows total", () => {
    const docs = [
      makeDoc("Privacy Policy", "PRIVACY_POLICY.md"),
      makeDoc("Cookie Policy", "COOKIE_POLICY.md"),
    ];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("| **Total** | **2** |"));
  });

  // ── Category descriptions ────────────────────────────────────────────

  it("includes category description for Privacy & Data Protection", () => {
    const docs = [makeDoc("Privacy Policy", "PRIVACY_POLICY.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("Core privacy policies"));
  });

  it("includes category description for AI & Machine Learning", () => {
    const docs = [makeDoc("AI Disclosure", "AI_DISCLOSURE.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("AI governance"));
  });

  it("uses fallback description for Other category", () => {
    const docs = [makeDoc("Custom Doc", "TOTALLY_CUSTOM_DOC.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("Additional compliance documents"));
  });

  // ── Document tables ──────────────────────────────────────────────────

  it("includes document name in category table", () => {
    const docs = [makeDoc("Privacy Policy", "PRIVACY_POLICY.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("| Privacy Policy |"));
  });

  it("includes filename in backticks in category table", () => {
    const docs = [makeDoc("Privacy Policy", "PRIVACY_POLICY.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("| `PRIVACY_POLICY.md` |"));
  });

  it("sorts documents alphabetically by name within category", () => {
    const docs = [
      makeDoc("Data Retention", "DATA_RETENTION_POLICY.md"),
      makeDoc("Aaa First Doc", "PRIVACY_POLICY.md"),
    ];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs)!;
    const aaaIdx = result.indexOf("Aaa First Doc");
    const retIdx = result.indexOf("Data Retention");
    assert.ok(aaaIdx < retIdx);
  });

  // ── Category ordering ────────────────────────────────────────────────

  it("sorts categories in defined order (Privacy before AI before Security)", () => {
    const docs = [
      makeDoc("Security Policy", "SECURITY_POLICY.md"),
      makeDoc("AI Disclosure", "AI_DISCLOSURE.md"),
      makeDoc("Privacy Policy", "PRIVACY_POLICY.md"),
    ];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs)!;
    const privIdx = result.indexOf("## Privacy & Data Protection");
    const aiIdx = result.indexOf("## AI & Machine Learning");
    const secIdx = result.indexOf("## Security");
    assert.ok(privIdx < aiIdx);
    assert.ok(aiIdx < secIdx);
  });

  it("puts Other category last", () => {
    const docs = [
      makeDoc("Custom Doc", "TOTALLY_CUSTOM_DOC.md"),
      makeDoc("Privacy Policy", "PRIVACY_POLICY.md"),
    ];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs)!;
    const privIdx = result.indexOf("## Privacy & Data Protection");
    const otherIdx = result.indexOf("## Other");
    assert.ok(privIdx < otherIdx);
  });

  // ── How to Use section ────────────────────────────────────────────────

  it("includes How to Use section", () => {
    const docs = [makeDoc("Privacy Policy", "PRIVACY_POLICY.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("## How to Use This Index"));
  });

  it("includes compliance quick start link", () => {
    const docs = [makeDoc("Privacy Policy", "PRIVACY_POLICY.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("QUICK_START_COMPLIANCE_GUIDE.md"));
  });

  it("includes audit preparation references", () => {
    const docs = [makeDoc("Privacy Policy", "PRIVACY_POLICY.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("SOC2_READINESS_CHECKLIST.md"));
    assert.ok(result!.includes("ISO_27001_CHECKLIST.md"));
  });

  it("includes DSAR reference", () => {
    const docs = [makeDoc("Privacy Policy", "PRIVACY_POLICY.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("DSAR_HANDLING_GUIDE.md"));
  });

  it("includes vendor evaluation reference", () => {
    const docs = [makeDoc("Privacy Policy", "PRIVACY_POLICY.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("VENDOR_SECURITY_QUESTIONNAIRE.md"));
  });

  // ── Codepliant attribution ────────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const docs = [makeDoc("Privacy Policy", "PRIVACY_POLICY.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("Codepliant"));
  });

  it("includes legal review disclaimer", () => {
    const docs = [makeDoc("Privacy Policy", "PRIVACY_POLICY.md")];
    const result = generateCompliancePolicyIndex(makeScan(), undefined, docs);
    assert.ok(result!.includes("reviewed by qualified legal counsel"));
  });

  // ── Comprehensive scenario ────────────────────────────────────────────

  it("handles comprehensive document set across all categories", () => {
    const docs = [
      makeDoc("Privacy Policy", "PRIVACY_POLICY.md"),
      makeDoc("Data Retention Policy", "DATA_RETENTION_POLICY.md"),
      makeDoc("AI Disclosure", "AI_DISCLOSURE.md"),
      makeDoc("Security Policy", "SECURITY_POLICY.md"),
      makeDoc("Incident Response Plan", "INCIDENT_RESPONSE_PLAN.md"),
      makeDoc("Subprocessor List", "SUBPROCESSOR_LIST.md"),
      makeDoc("Cookie Policy", "COOKIE_POLICY.md"),
      makeDoc("SOC2 Readiness Checklist", "SOC2_READINESS_CHECKLIST.md"),
      makeDoc("Terms of Service", "TERMS_OF_SERVICE.md"),
      makeDoc("Training Record", "TRAINING_RECORD.md"),
      makeDoc("Executive Dashboard", "EXECUTIVE_DASHBOARD.md"),
      makeDoc("Risk Register", "RISK_REGISTER.md"),
      makeDoc("Quick Start Guide", "QUICK_START_COMPLIANCE_GUIDE.md"),
    ];
    const ctx = makeCtx({ companyName: "Enterprise Inc" });
    const result = generateCompliancePolicyIndex(
      makeScan({ projectName: "enterprise-app" }),
      ctx,
      docs,
    )!;
    assert.ok(result.includes("Enterprise Inc"));
    assert.ok(result.includes("enterprise-app"));
    assert.ok(result.includes("**13 documents**"));
    // All 12 known categories + no Other since all are mapped
    assert.ok(result.includes("## Privacy & Data Protection"));
    assert.ok(result.includes("## AI & Machine Learning"));
    assert.ok(result.includes("## Security"));
    assert.ok(result.includes("## Incident Management"));
    assert.ok(result.includes("## Vendor & Third-Party Management"));
    assert.ok(result.includes("## Cookies & Consent"));
    assert.ok(result.includes("## Compliance Frameworks"));
    assert.ok(result.includes("## Legal & Terms"));
    assert.ok(result.includes("## Organizational"));
    assert.ok(result.includes("## Reporting & Communication"));
    assert.ok(result.includes("## Risk Management"));
    assert.ok(result.includes("## Guides & References"));
    assert.ok(result.includes("| **Total** | **13** |"));
  });
});
