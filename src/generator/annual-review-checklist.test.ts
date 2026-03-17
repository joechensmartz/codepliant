import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateAnnualReviewChecklist } from "./annual-review-checklist.js";

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

describe("generateAnnualReviewChecklist", () => {
  // ── Null returns ────────────────────────────────────────────────────────
  it("returns null when no services detected", () => {
    const result = generateAnnualReviewChecklist(makeScan());
    assert.strictEqual(result, null);
  });

  it("returns null for empty services array", () => {
    const result = generateAnnualReviewChecklist(makeScan({ services: [] }));
    assert.strictEqual(result, null);
  });

  // ── Basic generation ────────────────────────────────────────────────────
  it("generates document with services", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Annual Compliance Review Checklist"));
  });

  it("includes current date", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateAnnualReviewChecklist(scan)!;
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(`Generated on ${today}`));
    assert.ok(result.includes(`| **Checklist Generated** | ${today} |`));
  });

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("auto-generated"));
  });

  // ── Context values ──────────────────────────────────────────────────────
  it("uses default placeholders when no context", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[Data Protection Officer Name]"));
  });

  it("uses context values", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan, {
      companyName: "Acme Corp",
      contactEmail: "contact@acme.com",
      dpoName: "Jane Smith",
      dpoEmail: "dpo@acme.com",
    })!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("Jane Smith"));
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("falls back dpoEmail to contactEmail", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan, {
      companyName: "Acme",
      contactEmail: "hello@acme.com",
    })!;
    assert.ok(result.includes("| **Contact** | hello@acme.com |"));
  });

  // ── Review Metadata section ─────────────────────────────────────────────
  it("includes Review Metadata table", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan, {
      companyName: "TestCo",
      contactEmail: "test@test.com",
    })!;
    assert.ok(result.includes("## 1. Review Metadata"));
    assert.ok(result.includes("| **Organization** | TestCo |"));
  });

  // ── Document Review Checklist — always-generated docs ───────────────────
  it("always includes Privacy Policy in document review", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("## 2. Document Review Checklist"));
    assert.ok(result.includes("Privacy Policy"));
    assert.ok(result.includes("`PRIVACY_POLICY.md`"));
  });

  it("always includes Terms of Service in document review", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("Terms of Service"));
    assert.ok(result.includes("`TERMS_OF_SERVICE.md`"));
  });

  it("always includes Security Policy in document review", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("Security Policy"));
    assert.ok(result.includes("`SECURITY.md`"));
  });

  it("always includes Record of Processing Activities", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("Record of Processing Activities"));
    assert.ok(result.includes("`RECORD_OF_PROCESSING_ACTIVITIES.md`"));
  });

  // ── Conditional: Sub-Processor List (>= 3 services) ────────────────────
  it("includes Sub-Processor List when 3+ services", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("Sub-Processor List"));
    assert.ok(result.includes("`SUBPROCESSOR_LIST.md`"));
  });

  it("omits Sub-Processor List from document review with fewer than 3 services", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateAnnualReviewChecklist(scan)!;
    // The doc review table should not include SUBPROCESSOR_LIST.md row
    // (though Related Documents at the end always mentions it)
    assert.ok(!result.includes("| Sub-Processor List | `SUBPROCESSOR_LIST.md`"));
  });

  // ── Conditional: Refund Policy (payment) ────────────────────────────────
  it("includes Refund Policy review when payment detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("Refund Policy"));
    assert.ok(result.includes("`REFUND_POLICY.md`"));
  });

  it("omits Refund Policy when no payment", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(!result.includes("Refund Policy"));
  });

  // ── Conditional: AI Disclosure (ai) ─────────────────────────────────────
  it("includes AI Disclosure and Governance when AI detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("AI Disclosure"));
    assert.ok(result.includes("`AI_DISCLOSURE.md`"));
    assert.ok(result.includes("AI Governance Framework"));
    assert.ok(result.includes("`AI_GOVERNANCE_FRAMEWORK.md`"));
    assert.ok(result.includes("EU AI Act"));
  });

  it("omits AI Disclosure when no AI", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(!result.includes("AI Disclosure"));
    assert.ok(!result.includes("AI Governance Framework"));
  });

  // ── Conditional: Cookie Policy (analytics or advertising) ───────────────
  it("includes Cookie Policy when analytics detected", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("Cookie Policy"));
    assert.ok(result.includes("`COOKIE_POLICY.md`"));
  });

  it("includes Cookie Policy when advertising detected", () => {
    const scan = makeScan({ services: [makeService("meta-pixel", "advertising")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("Cookie Policy"));
  });

  it("omits Cookie Policy without analytics or advertising", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(!result.includes("Cookie Policy"));
  });

  // ── Detailed Review Items ───────────────────────────────────────────────
  it("includes detailed review items with checkbox format", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("### Detailed Review Items per Document"));
    assert.ok(result.includes("- [ ] All third-party services listed match current integrations"));
  });

  // ── Regulatory Calendar ─────────────────────────────────────────────────
  it("includes Regulatory Calendar section", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("## 3. Regulatory Calendar"));
    assert.ok(result.includes("January"));
    assert.ok(result.includes("Review and update ROPA"));
    assert.ok(result.includes("GDPR Art. 30"));
  });

  it("includes PCI DSS in calendar when payment detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("PCI DSS self-assessment"));
  });

  it("omits PCI DSS from calendar without payment", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(!result.includes("PCI DSS self-assessment"));
  });

  it("includes cookie consent audit when analytics detected", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("Cookie consent mechanism audit"));
    assert.ok(result.includes("ePrivacy Directive"));
  });

  it("includes AI system audit when AI detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("AI system audit and bias review"));
    assert.ok(result.includes("EU AI Act"));
  });

  it("omits AI audit from calendar without AI", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(!result.includes("AI system audit and bias review"));
  });

  // ── Standard calendar entries always present ────────────────────────────
  it("includes standard monthly calendar entries", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("April"));
    assert.ok(result.includes("Data breach drill"));
    assert.ok(result.includes("June"));
    assert.ok(result.includes("Mid-year sub-processor audit"));
    assert.ok(result.includes("July"));
    assert.ok(result.includes("Employee privacy training"));
    assert.ok(result.includes("September"));
    assert.ok(result.includes("Third-party vendor risk"));
    assert.ok(result.includes("October"));
    assert.ok(result.includes("DSAR process review"));
    assert.ok(result.includes("November"));
    assert.ok(result.includes("Security policy and access control"));
    assert.ok(result.includes("December"));
    assert.ok(result.includes("Year-end compliance summary"));
  });

  // ── Operational Compliance Checks ───────────────────────────────────────
  it("includes Data Subject Rights section", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("## 4. Operational Compliance Checks"));
    assert.ok(result.includes("### Data Subject Rights"));
    assert.ok(result.includes("DSAR process tested"));
    assert.ok(result.includes("30-day requirement"));
    assert.ok(result.includes("Right to erasure"));
    assert.ok(result.includes("Data portability"));
  });

  it("includes Data Breach Preparedness section", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("### Data Breach Preparedness"));
    assert.ok(result.includes("72-hour notification"));
    assert.ok(result.includes("Breach register"));
  });

  it("includes Technical Measures section", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("### Technical Measures"));
    assert.ok(result.includes("Encryption in transit"));
    assert.ok(result.includes("Encryption at rest"));
    assert.ok(result.includes("Multi-factor authentication"));
    assert.ok(result.includes("Penetration test"));
  });

  it("includes Training and Awareness section", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("### Training and Awareness"));
    assert.ok(result.includes("data protection awareness training"));
    assert.ok(result.includes("privacy by design"));
    assert.ok(result.includes("DSAR handling"));
  });

  // ── Third-Party Service Assessment ──────────────────────────────────────
  it("includes third-party service assessment table with services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("## 5. Third-Party Service Assessment"));
    assert.ok(result.includes("| stripe | payment |"));
    assert.ok(result.includes("| posthog | analytics |"));
    assert.ok(result.includes("DPA in Place"));
  });

  // ── Sign-Off section ────────────────────────────────────────────────────
  it("includes Review Sign-Off section with roles", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("Review Sign-Off"));
    assert.ok(result.includes("Data Protection Officer"));
    assert.ok(result.includes("Chief Information Security Officer"));
    assert.ok(result.includes("Legal Counsel"));
    assert.ok(result.includes("Chief Technology Officer"));
  });

  it("numbers Sign-Off as section 6 when services present", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("## 6. Review Sign-Off"));
  });

  // ── Review Notes ────────────────────────────────────────────────────────
  it("includes Review Notes section", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("## Review Notes"));
    assert.ok(result.includes("What a lawyer should check"));
    assert.ok(result.includes("Auto-generated vs. needs human input"));
  });

  // ── Related Documents ───────────────────────────────────────────────────
  it("includes Related Documents section", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("## Related Documents"));
    assert.ok(result.includes("PRIVACY_POLICY.md"));
    assert.ok(result.includes("COMPLIANCE_TIMELINE.md"));
    assert.ok(result.includes("INCIDENT_RESPONSE_PLAN.md"));
    assert.ok(result.includes("DSAR_HANDLING_GUIDE.md"));
  });

  // ── Legal disclaimer ────────────────────────────────────────────────────
  it("includes legal disclaimer about customization", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("customized to reflect"));
    assert.ok(result.includes("reviewed by legal counsel"));
  });

  // ── Comprehensive test with all conditional sections ────────────────────
  it("handles comprehensive service stack with all conditionals", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
        makeService("sendgrid", "email"),
        makeService("@sentry/node", "monitoring"),
        makeService("meta-pixel", "advertising"),
      ],
    });
    const result = generateAnnualReviewChecklist(scan)!;

    // All conditional documents should be present
    assert.ok(result.includes("Sub-Processor List"));
    assert.ok(result.includes("Refund Policy"));
    assert.ok(result.includes("AI Disclosure"));
    assert.ok(result.includes("AI Governance Framework"));
    assert.ok(result.includes("Cookie Policy"));

    // All conditional calendar entries
    assert.ok(result.includes("PCI DSS self-assessment"));
    assert.ok(result.includes("Cookie consent mechanism audit"));
    assert.ok(result.includes("AI system audit and bias review"));

    // All services in assessment table
    assert.ok(result.includes("| next-auth | auth |"));
    assert.ok(result.includes("| stripe | payment |"));
    assert.ok(result.includes("| posthog | analytics |"));
    assert.ok(result.includes("| openai | ai |"));
  });

  // ── Document review frequency ───────────────────────────────────────────
  it("includes review frequency for each document", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("Annual + on change"));
    assert.ok(result.includes("Annual + after incidents"));
    assert.ok(result.includes("Annual + on analytics changes"));
  });

  // ── Document review table checkbox format ───────────────────────────────
  it("uses checkbox format in document review table", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateAnnualReviewChecklist(scan)!;
    assert.ok(result.includes("- [ ] Reviewed"));
  });
});
