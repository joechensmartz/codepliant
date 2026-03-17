import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateComplianceCertificate } from "./compliance-certificate.js";
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

function makeDoc(name: string, filename: string): GeneratedDocument {
  return { name, filename, content: "test content" };
}

function makeCtx(overrides: Partial<GeneratorContext> = {}): GeneratorContext {
  return { companyName: "Test Co", contactEmail: "test@test.com", ...overrides };
}

describe("generateComplianceCertificate", () => {
  // ── Null guard ──────────────────────────────────────────────────────

  it("returns null when no services are present", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceCertificate(scan, undefined, []);
    assert.strictEqual(result, null);
  });

  // ── Basic generation ────────────────────────────────────────────────

  it("returns a non-null string when services exist", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCertificate(scan, undefined, []);
    assert.ok(result !== null);
    assert.ok(result!.length > 0);
  });

  it("includes the title", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    assert.ok(result.includes("# Compliance Certificate"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    const dateRegex = /\d{4}-\d{2}-\d{2}/;
    assert.ok(dateRegex.test(result));
  });

  it("includes project name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")], projectName: "my-app" });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    assert.ok(result.includes("my-app"));
  });

  // ── Context values ──────────────────────────────────────────────────

  it("uses company name from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ companyName: "Acme Corp" });
    const result = generateComplianceCertificate(scan, ctx, [])!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder when no company name provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses contact email from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ contactEmail: "info@acme.com" });
    const result = generateComplianceCertificate(scan, ctx, [])!;
    assert.ok(result.includes("info@acme.com"));
  });

  it("uses DPO name from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ dpoName: "Jane Doe" });
    const result = generateComplianceCertificate(scan, ctx, [])!;
    assert.ok(result.includes("Jane Doe"));
  });

  it("uses DPO email from context, fallback to contactEmail", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ contactEmail: "contact@acme.com" });
    const result = generateComplianceCertificate(scan, ctx, [])!;
    assert.ok(result.includes("contact@acme.com"));
  });

  it("uses website from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ website: "https://acme.com" });
    const result = generateComplianceCertificate(scan, ctx, [])!;
    assert.ok(result.includes("https://acme.com"));
  });

  // ── Certificate ID ──────────────────────────────────────────────────

  it("includes a certificate ID with CODEPLIANT prefix", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    assert.ok(result.includes("CODEPLIANT-"));
  });

  it("includes project name in certificate ID (uppercased, sanitized)", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")], projectName: "my-app" });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    assert.ok(result.includes("MYAPP"));
  });

  // ── Disclaimer ──────────────────────────────────────────────────────

  it("includes important disclaimer about self-attestation", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    assert.ok(result.includes("self-attestation"));
  });

  // ── Section 1: Compliance Summary ─────────────────────────────────

  it("includes Compliance Summary section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    assert.ok(result.includes("## 1. Compliance Summary"));
  });

  it("includes compliance score from parameter", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCertificate(scan, undefined, [], { total: 85, grade: "A" })!;
    assert.ok(result.includes("85/100"));
    assert.ok(result.includes("| **Grade** | A |"));
  });

  it("shows 0/100 and N/A when no score provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    assert.ok(result.includes("0/100"));
    assert.ok(result.includes("N/A"));
  });

  it("shows documents generated count", () => {
    const docs = [makeDoc("Privacy Policy", "PRIVACY_POLICY.md"), makeDoc("ToS", "TERMS_OF_SERVICE.md")];
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCertificate(scan, undefined, docs)!;
    assert.ok(result.includes("| **Documents Generated** | 2 |"));
  });

  it("shows service count (deduplicated)", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment"), makeService("stripe", "payment"), makeService("openai", "ai")],
    });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    assert.ok(result.includes("| **Services Covered** | 2 |"));
  });

  it("shows data categories count", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
      dataCategories: [
        { category: "Payment", description: "Payment data", sources: ["stripe"] },
        { category: "PII", description: "Personal info", sources: ["auth"] },
      ],
    });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    assert.ok(result.includes("| **Data Categories Detected** | 2 |"));
  });

  it("shows service categories", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment"), makeService("openai", "ai")],
    });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    assert.ok(result.includes("payment"));
    assert.ok(result.includes("ai"));
  });

  it("shows jurisdictions when provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ jurisdictions: ["gdpr", "ccpa"] });
    const result = generateComplianceCertificate(scan, ctx, [])!;
    assert.ok(result.includes("gdpr, ccpa"));
  });

  it("does not show jurisdictions row when none provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    assert.ok(!result.includes("**Jurisdictions**"));
  });

  // ── Section 2: Compliance Status by Area ──────────────────────────

  it("shows Privacy & Data Protection area with matching docs", () => {
    const docs = [
      makeDoc("Privacy Policy", "PRIVACY_POLICY.md"),
      makeDoc("Cookie Policy", "COOKIE_POLICY.md"),
      makeDoc("Consent Guide", "CONSENT_MANAGEMENT_GUIDE.md"),
    ];
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCertificate(scan, undefined, docs)!;
    assert.ok(result.includes("Privacy & Data Protection"));
    assert.ok(result.includes("Comprehensive"));
  });

  it("shows Partial status for area with fewer than threshold docs", () => {
    const docs = [makeDoc("Privacy Policy", "PRIVACY_POLICY.md")];
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCertificate(scan, undefined, docs)!;
    assert.ok(result.includes("Privacy & Data Protection"));
    assert.ok(result.includes("Partial"));
  });

  it("shows Information Security area", () => {
    const docs = [
      makeDoc("Security", "SECURITY.md"),
      makeDoc("Incident Response", "INCIDENT_RESPONSE_PLAN.md"),
      makeDoc("Access Control", "ACCESS_CONTROL_POLICY.md"),
    ];
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCertificate(scan, undefined, docs)!;
    assert.ok(result.includes("Information Security"));
    assert.ok(result.includes("Comprehensive"));
  });

  it("shows Third-Party Management area", () => {
    const docs = [
      makeDoc("Subprocessors", "SUBPROCESSOR_LIST.md"),
      makeDoc("DPA", "DATA_PROCESSING_AGREEMENT.md"),
      makeDoc("Third Party Risk", "THIRD_PARTY_RISK_ASSESSMENT.md"),
    ];
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCertificate(scan, undefined, docs)!;
    assert.ok(result.includes("Third-Party Management"));
  });

  it("shows AI Governance area when AI docs present", () => {
    const docs = [
      makeDoc("AI Disclosure", "AI_DISCLOSURE.md"),
      makeDoc("AI Act Checklist", "AI_ACT_CHECKLIST.md"),
      makeDoc("AI Model Card", "AI_MODEL_CARD.md"),
    ];
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceCertificate(scan, undefined, docs)!;
    assert.ok(result.includes("AI Governance"));
    assert.ok(result.includes("Comprehensive"));
  });

  it("shows Business Continuity area", () => {
    const docs = [
      makeDoc("BCP", "BUSINESS_CONTINUITY_PLAN.md"),
      makeDoc("DRP", "DISASTER_RECOVERY_PLAN.md"),
    ];
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCertificate(scan, undefined, docs)!;
    assert.ok(result.includes("Business Continuity"));
    assert.ok(result.includes("Comprehensive"));
  });

  it("shows Compliance Framework area", () => {
    const docs = [
      makeDoc("SOC 2", "SOC2_READINESS_CHECKLIST.md"),
      makeDoc("ISO 27001", "ISO_27001_CHECKLIST.md"),
      makeDoc("Notes", "COMPLIANCE_NOTES.md"),
    ];
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCertificate(scan, undefined, docs)!;
    assert.ok(result.includes("Compliance Framework"));
  });

  // ── Section 3: Documents Generated ────────────────────────────────

  it("lists all documents in numbered table", () => {
    const docs = [
      makeDoc("Privacy Policy", "PRIVACY_POLICY.md"),
      makeDoc("Terms of Service", "TERMS_OF_SERVICE.md"),
    ];
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCertificate(scan, undefined, docs)!;
    assert.ok(result.includes("## 3. Documents Generated"));
    assert.ok(result.includes("| 1 | Privacy Policy | `PRIVACY_POLICY.md` |"));
    assert.ok(result.includes("| 2 | Terms of Service | `TERMS_OF_SERVICE.md` |"));
  });

  // ── Section 4: Services Covered ──────────────────────────────────

  it("lists all unique services with category", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment"), makeService("openai", "ai")],
    });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    assert.ok(result.includes("## 4. Services Covered"));
    assert.ok(result.includes("| stripe | payment | Yes |"));
    assert.ok(result.includes("| openai | ai | Yes |"));
  });

  it("deduplicates services by name", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment"), makeService("stripe", "payment")],
    });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    const matches = result.match(/\| stripe \| payment \| Yes \|/g);
    assert.strictEqual(matches!.length, 1);
  });

  // ── Section 5: Data Categories ────────────────────────────────────

  it("shows data categories when present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
      dataCategories: [{ category: "Payment", description: "Payment data", sources: ["stripe"] }],
    });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    assert.ok(result.includes("Data Categories Identified"));
    assert.ok(result.includes("| Payment | stripe |"));
  });

  it("skips data categories section when none present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")], dataCategories: [] });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    assert.ok(!result.includes("Data Categories Identified"));
  });

  // ── Attestation Statement ─────────────────────────────────────────

  it("includes self-attestation statement", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    assert.ok(result.includes("Self-Attestation Statement"));
    assert.ok(result.includes("hereby attests"));
  });

  it("includes all 5 attestation points", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    assert.ok(result.includes("1. The automated code analysis"));
    assert.ok(result.includes("2. The compliance documents"));
    assert.ok(result.includes("3. The organization commits"));
    assert.ok(result.includes("4. The organization will engage"));
    assert.ok(result.includes("5. The organization will maintain"));
  });

  // ── Validity section ──────────────────────────────────────────────

  it("includes validity section with issue date and expiry", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    assert.ok(result.includes("Validity"));
    assert.ok(result.includes("Issue Date"));
    assert.ok(result.includes("Valid Until"));
    assert.ok(result.includes("Review Frequency"));
  });

  it("expiry date is one year after issue date", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const expiryStr = nextYear.toISOString().split("T")[0];
    assert.ok(result.includes(expiryStr));
  });

  // ── Signatures section ────────────────────────────────────────────

  it("includes authorized signatures section with DPO, CEO, CTO", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    assert.ok(result.includes("Authorized Signatures"));
    assert.ok(result.includes("Data Protection Officer"));
    assert.ok(result.includes("Chief Executive Officer"));
    assert.ok(result.includes("Chief Technology Officer"));
  });

  // ── Contact section ───────────────────────────────────────────────

  it("includes contact section with email, DPO, website", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({
      contactEmail: "info@acme.com",
      dpoEmail: "dpo@acme.com",
      website: "https://acme.com",
    });
    const result = generateComplianceCertificate(scan, ctx, [])!;
    assert.ok(result.includes("info@acme.com"));
    assert.ok(result.includes("dpo@acme.com"));
    assert.ok(result.includes("https://acme.com"));
  });

  // ── Footer ────────────────────────────────────────────────────────

  it("includes Codepliant attribution in footer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    assert.ok(result.includes("Codepliant"));
  });

  it("includes legal review disclaimer in footer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    assert.ok(result.includes("does not constitute a legal certification"));
  });

  // ── Section numbering adjusts based on data categories ────────────

  it("attestation is section 6 when data categories present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
      dataCategories: [{ category: "Payment", description: "Payment data", sources: ["stripe"] }],
    });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    assert.ok(result.includes("## 6. Self-Attestation Statement"));
  });

  it("attestation is section 5 when no data categories", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")], dataCategories: [] });
    const result = generateComplianceCertificate(scan, undefined, [])!;
    assert.ok(result.includes("## 5. Self-Attestation Statement"));
  });
});
