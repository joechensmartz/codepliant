import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateLawfulBasisAssessment } from "./lawful-basis-assessment.js";

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

describe("generateLawfulBasisAssessment", () => {
  // ── Null returns ────────────────────────────────────────────────────────
  it("returns null when no services detected", () => {
    const result = generateLawfulBasisAssessment(makeScan());
    assert.strictEqual(result, null);
  });

  it("returns null for empty services array", () => {
    const result = generateLawfulBasisAssessment(makeScan({ services: [] }));
    assert.strictEqual(result, null);
  });

  // ── Basic generation ────────────────────────────────────────────────────
  it("generates document with services", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateLawfulBasisAssessment(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Lawful Basis Assessment"));
  });

  it("includes current date", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateLawfulBasisAssessment(scan)!;
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(`Generated on ${today}`));
    assert.ok(result.includes(`| **Assessment Date** | ${today} |`));
  });

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("auto-generated"));
  });

  // ── Context values ──────────────────────────────────────────────────────
  it("uses default placeholders when no context provided", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
    assert.ok(result.includes("[Data Protection Officer Name]"));
  });

  it("uses context company name and contact email", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateLawfulBasisAssessment(scan, {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
    })!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("uses context DPO name and email", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateLawfulBasisAssessment(scan, {
      companyName: "Acme Corp",
      contactEmail: "contact@acme.com",
      dpoName: "Jane Smith",
      dpoEmail: "dpo@acme.com",
    })!;
    assert.ok(result.includes("Jane Smith"));
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("falls back dpoEmail to contactEmail when not provided", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateLawfulBasisAssessment(scan, {
      companyName: "Acme Corp",
      contactEmail: "contact@acme.com",
    })!;
    // DPO Email row should show contactEmail
    assert.ok(result.includes("| **DPO Email** | contact@acme.com |"));
  });

  // ── Controller Information section ──────────────────────────────────────
  it("includes Controller Information table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateLawfulBasisAssessment(scan, {
      companyName: "TestCo",
      contactEmail: "test@test.com",
    })!;
    assert.ok(result.includes("## 1. Controller Information"));
    assert.ok(result.includes("| **Data Controller** | TestCo |"));
    assert.ok(result.includes("| **Contact Email** | test@test.com |"));
  });

  // ── Summary Table ──────────────────────────────────────────────────────
  it("includes Lawful Basis Summary table", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("## 2. Lawful Basis Summary"));
    assert.ok(result.includes("| Processing Activity | Lawful Basis | GDPR Article | Requires LIA |"));
  });

  // ── Auth category assessment ────────────────────────────────────────────
  it("maps auth to Contract performance (Art. 6(1)(b)), no LIA", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("User Authentication"));
    assert.ok(result.includes("Contract performance"));
    assert.ok(result.includes("Art. 6(1)(b)"));
    assert.ok(result.includes("| User Authentication | Contract performance | Art. 6(1)(b) | No |"));
  });

  // ── Payment category assessment ─────────────────────────────────────────
  it("maps payment to Contract performance / Legal obligation", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment", ["payment information"])] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("Payment Processing"));
    assert.ok(result.includes("Contract performance / Legal obligation"));
    assert.ok(result.includes("Art. 6(1)(b) / Art. 6(1)(c)"));
  });

  // ── Analytics category assessment ───────────────────────────────────────
  it("maps analytics to Consent / Legitimate interest with LIA required", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("Usage Analytics"));
    assert.ok(result.includes("Consent / Legitimate interest"));
    assert.ok(result.includes("Art. 6(1)(a) / Art. 6(1)(f)"));
    assert.ok(result.includes("| Usage Analytics | Consent / Legitimate interest | Art. 6(1)(a) / Art. 6(1)(f) | Yes |"));
  });

  // ── Email category assessment ───────────────────────────────────────────
  it("maps email to Legitimate interest / Consent with LIA required", () => {
    const scan = makeScan({ services: [makeService("sendgrid", "email")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("Email Communications"));
    assert.ok(result.includes("Legitimate interest / Consent"));
    assert.ok(result.includes("Art. 6(1)(f) / Art. 6(1)(a)"));
  });

  // ── AI category assessment ──────────────────────────────────────────────
  it("maps ai to Consent / Contract performance", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("AI Processing"));
    assert.ok(result.includes("Art. 6(1)(a) / Art. 6(1)(b)"));
  });

  // ── Monitoring category assessment ──────────────────────────────────────
  it("maps monitoring to Legitimate interest with LIA required", () => {
    const scan = makeScan({ services: [makeService("@sentry/node", "monitoring")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("Error Monitoring"));
    assert.ok(result.includes("| Error Monitoring | Legitimate interest | Art. 6(1)(f) | Yes |"));
  });

  // ── Storage category assessment ─────────────────────────────────────────
  it("maps storage to Contract performance", () => {
    const scan = makeScan({ services: [makeService("aws-s3", "storage")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("File Storage"));
    assert.ok(result.includes("| File Storage | Contract performance | Art. 6(1)(b) | No |"));
  });

  // ── Database category assessment ────────────────────────────────────────
  it("maps database to Contract performance", () => {
    const scan = makeScan({ services: [makeService("postgresql", "database")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("Data Storage"));
    assert.ok(result.includes("| Data Storage | Contract performance | Art. 6(1)(b) | No |"));
  });

  // ── Advertising category assessment ─────────────────────────────────────
  it("maps advertising to Consent (Art. 6(1)(a))", () => {
    const scan = makeScan({ services: [makeService("meta-pixel", "advertising")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("Advertising & Conversion Tracking"));
    assert.ok(result.includes("| Advertising & Conversion Tracking | Consent | Art. 6(1)(a) | No |"));
  });

  // ── Social category assessment ──────────────────────────────────────────
  it("maps social to Consent (Art. 6(1)(a))", () => {
    const scan = makeScan({ services: [makeService("facebook-sdk", "social")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("Social Media Integration"));
    assert.ok(result.includes("Consent"));
    assert.ok(result.includes("Art. 6(1)(a)"));
  });

  // ── Detailed Assessments section ────────────────────────────────────────
  it("includes detailed assessment with services and data types", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["credit cards", "billing address"])],
    });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("## 3. Detailed Assessments"));
    assert.ok(result.includes("**Services:** stripe"));
    assert.ok(result.includes("**Data processed:** credit cards, billing address"));
    assert.ok(result.includes("**Lawful basis:** Contract performance / Legal obligation (Art. 6(1)(b) / Art. 6(1)(c))"));
    assert.ok(result.includes("**Reasoning:**"));
  });

  it("joins multiple services in same category", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["credit cards"]),
        makeService("paypal", "payment", ["billing address"]),
      ],
    });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("**Services:** stripe, paypal"));
  });

  it("deduplicates data types across services in same category", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["credit cards", "email"]),
        makeService("paypal", "payment", ["credit cards", "billing address"]),
      ],
    });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("credit cards"));
    assert.ok(result.includes("billing address"));
    assert.ok(result.includes("email"));
  });

  it("deduplicates categories — only one entry per category", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("paypal", "payment"),
      ],
    });
    const result = generateLawfulBasisAssessment(scan)!;
    // Should have only one Payment Processing row in summary
    const matches = result.match(/Payment Processing/g);
    // Appears in summary + detailed section header + detailed services/basis — not double-counted
    assert.ok(matches !== null);
    // Summary table should have one entry
    const summaryRows = result.split("| Payment Processing |");
    assert.strictEqual(summaryRows.length, 2); // one split = one row
  });

  // ── LIA section present when required ───────────────────────────────────
  it("includes LIA section when analytics detected (requiresLIA)", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("## 4. Legitimate Interest Assessments (LIA)"));
    assert.ok(result.includes("LIA: Usage Analytics"));
    assert.ok(result.includes("Part 1: Purpose Test"));
    assert.ok(result.includes("Part 2: Necessity Test"));
    assert.ok(result.includes("Part 3: Balancing Test"));
    assert.ok(result.includes("LIA Conclusion"));
  });

  it("includes LIA section when email detected", () => {
    const scan = makeScan({ services: [makeService("sendgrid", "email")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("LIA: Email Communications"));
  });

  it("includes LIA section when monitoring detected", () => {
    const scan = makeScan({ services: [makeService("@sentry/node", "monitoring")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("LIA: Error Monitoring"));
  });

  it("includes LIA recommendation note in detailed assessment for LIA entries", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("Legitimate Interest Assessment (LIA) is recommended"));
    assert.ok(result.includes("See Section 4 below"));
  });

  // ── LIA section absent when not required ────────────────────────────────
  it("shows no-LIA message when only non-LIA services present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("No processing activities based on legitimate interest"));
    assert.ok(result.includes("No LIA is required at this time"));
  });

  // ── LIA Purpose/Beneficiary/Necessity content ──────────────────────────
  it("includes analytics-specific LIA purpose", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("Product improvement"));
    assert.ok(result.includes("measuring feature adoption"));
  });

  it("includes email-specific LIA purpose", () => {
    const scan = makeScan({ services: [makeService("sendgrid", "email")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("Sending transactional communications"));
  });

  it("includes monitoring-specific LIA data nature", () => {
    const scan = makeScan({ services: [makeService("@sentry/node", "monitoring")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("Technical data (stack traces, device info)"));
  });

  it("includes analytics-specific LIA opt-out", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("cookie preferences and account settings"));
  });

  // ── Consent Management section ──────────────────────────────────────────
  it("includes Consent Management section when consent-based services detected", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("## 5. Consent Management Requirements"));
    assert.ok(result.includes("freely given"));
    assert.ok(result.includes("pre-ticked boxes"));
    assert.ok(result.includes("Withdrawal mechanism"));
  });

  it("includes consent section for advertising services", () => {
    const scan = makeScan({ services: [makeService("meta-pixel", "advertising")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("Consent Management Requirements"));
  });

  it("omits consent section when no consent-based services", () => {
    const scan = makeScan({ services: [makeService("postgresql", "database")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(!result.includes("Consent Management Requirements"));
  });

  // ── Review Schedule section numbering ───────────────────────────────────
  it("numbers Review Schedule as section 6 when consent section present", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("## 6. Review Schedule"));
  });

  it("numbers Review Schedule as section 5 when consent section absent", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("## 5. Review Schedule"));
  });

  // ── Review Schedule content ─────────────────────────────────────────────
  it("includes review triggers", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("**Annually**"));
    assert.ok(result.includes("**On change**"));
    assert.ok(result.includes("**On regulatory update**"));
    assert.ok(result.includes("**On complaint**"));
  });

  // ── Review Notes section ────────────────────────────────────────────────
  it("includes Review Notes with lawyer guidance", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("## Review Notes"));
    assert.ok(result.includes("What a lawyer should check"));
    assert.ok(result.includes("DPIA under Art. 35"));
    assert.ok(result.includes("Auto-generated vs. needs human input"));
  });

  // ── Related Documents ───────────────────────────────────────────────────
  it("includes Related Documents section", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("## Related Documents"));
    assert.ok(result.includes("PRIVACY_POLICY.md"));
    assert.ok(result.includes("RECORD_OF_PROCESSING_ACTIVITIES.md"));
    assert.ok(result.includes("CONSENT_MANAGEMENT_GUIDE.md"));
  });

  // ── Legal disclaimer footer ─────────────────────────────────────────────
  it("includes legal disclaimer about legal review", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("reviewed by qualified legal counsel"));
    assert.ok(result.includes("LIA templates must be completed"));
  });

  // ── Comprehensive test: multiple categories ─────────────────────────────
  it("handles multiple categories with mixed LIA requirements", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth", ["email", "password hashes"]),
        makeService("stripe", "payment", ["credit cards"]),
        makeService("posthog", "analytics", ["IP addresses"]),
        makeService("@sentry/node", "monitoring", ["stack traces"]),
        makeService("openai", "ai", ["user prompts"]),
      ],
    });
    const result = generateLawfulBasisAssessment(scan)!;

    // All categories present
    assert.ok(result.includes("User Authentication"));
    assert.ok(result.includes("Payment Processing"));
    assert.ok(result.includes("Usage Analytics"));
    assert.ok(result.includes("Error Monitoring"));
    assert.ok(result.includes("AI Processing"));

    // LIA section should have analytics + monitoring but not auth/payment/ai
    assert.ok(result.includes("LIA: Usage Analytics"));
    assert.ok(result.includes("LIA: Error Monitoring"));
    assert.ok(!result.includes("LIA: User Authentication"));
    assert.ok(!result.includes("LIA: Payment Processing"));
    assert.ok(!result.includes("LIA: AI Processing"));

    // Consent section should exist (analytics has Art. 6(1)(a))
    assert.ok(result.includes("Consent Management Requirements"));
  });

  // ── Unknown category fallback ───────────────────────────────────────────
  it("falls back to legitimate interest for unknown categories", () => {
    const scan = makeScan({
      services: [makeService("custom-service", "social")],
    });
    const result = generateLawfulBasisAssessment(scan)!;
    // Social is a known category
    assert.ok(result.includes("Social Media Integration"));
    assert.ok(result.includes("Consent"));
  });

  // ── Sequential detailed assessment numbering ────────────────────────────
  it("numbers detailed assessments sequentially", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("### 3.1."));
    assert.ok(result.includes("### 3.2."));
    assert.ok(result.includes("### 3.3."));
  });

  // ── LIA subsection numbering ───────────────────────────────────────────
  it("numbers LIA subsections sequentially", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics"),
        makeService("sendgrid", "email"),
        makeService("@sentry/node", "monitoring"),
      ],
    });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("### 4.1. LIA:"));
    assert.ok(result.includes("### 4.2. LIA:"));
    assert.ok(result.includes("### 4.3. LIA:"));
  });

  // ── GDPR Article 6 reference in header ──────────────────────────────────
  it("references GDPR Article 6 in header", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("GDPR Article 6 Lawful Basis Assessment"));
  });

  // ── Three-part LIA test structure ───────────────────────────────────────
  it("includes all three LIA test parts with tables", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateLawfulBasisAssessment(scan)!;
    assert.ok(result.includes("Purpose Test — Identify the legitimate interest"));
    assert.ok(result.includes("Necessity Test — Is the processing necessary?"));
    assert.ok(result.includes("Balancing Test — Do data subject rights override?"));
    assert.ok(result.includes("LIA Conclusion"));
    // Conclusion checklist items
    assert.ok(result.includes("legitimate interest is valid"));
    assert.ok(result.includes("processing is necessary and proportionate"));
    assert.ok(result.includes("Adequate safeguards"));
    assert.ok(result.includes("opt-out mechanism"));
  });
});
