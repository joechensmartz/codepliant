import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { DetectedService, ScanResult } from "../scanner/types.js";
import { generateComplianceOath } from "./compliance-oath.js";
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

describe("generateComplianceOath", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when no services detected", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateComplianceOath(scan, undefined), null);
  });

  // ── Basic generation ───────────────────────────────────────────────

  it("generates document when at least one service present", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined);
    assert.ok(result !== null);
    assert.ok(result.includes("# Compliance Oath"));
  });

  it("includes Management Commitment Statement header", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("## Management Commitment Statement"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes project name", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("test-project"));
  });

  it("includes document ID with project name", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("OATH-"));
    assert.ok(result.includes("TESTPROJECT"));
  });

  // ── Context values ─────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generateComplianceOath(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "privacy@acme.com" };
    const result = generateComplianceOath(scan, ctx)!;
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("uses placeholder contact email when no context", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses context DPO name", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", dpoName: "Jane Doe" };
    const result = generateComplianceOath(scan, ctx)!;
    assert.ok(result.includes("Jane Doe"));
  });

  it("uses placeholder DPO name when no context", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("[Data Protection Officer Name]"));
  });

  it("uses context DPO email", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", dpoEmail: "dpo@acme.com" };
    const result = generateComplianceOath(scan, ctx)!;
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("falls back to contactEmail for DPO email when dpoEmail not provided", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "contact@acme.com" };
    const result = generateComplianceOath(scan, ctx)!;
    // dpoEmail falls back to contactEmail
    assert.ok(result.includes("contact@acme.com"));
  });

  it("uses context website", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", website: "https://acme.com" };
    const result = generateComplianceOath(scan, ctx)!;
    assert.ok(result.includes("https://acme.com"));
  });

  it("uses placeholder website when no context", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("[https://yoursite.com]"));
  });

  // ── Section 1: Purpose ─────────────────────────────────────────────

  it("includes purpose section", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("## 1. Purpose"));
    assert.ok(result.includes("information security management system"));
    assert.ok(result.includes("personal data"));
  });

  // ── Section 2: Scope ───────────────────────────────────────────────

  it("includes scope section with service counts", () => {
    const scan = makeScan({
      services: [
        makeService("Stripe", "payment"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("## 2. Scope"));
    assert.ok(result.includes("2 third-party services across 2 categories"));
  });

  it("includes service categories in scope", () => {
    const scan = makeScan({
      services: [
        makeService("Stripe", "payment"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("payment"));
    assert.ok(result.includes("analytics"));
  });

  it("includes jurisdictions in scope when provided", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdictions: ["gdpr", "ccpa"] };
    const result = generateComplianceOath(scan, ctx)!;
    assert.ok(result.includes("**Jurisdictions:** gdpr, ccpa"));
  });

  it("omits jurisdictions line when no jurisdictions provided", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(!result.includes("**Jurisdictions:**"));
  });

  // ── Section 3: Management Commitment ───────────────────────────────

  it("includes ISO 27001 management commitment", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("### 3.1 Information Security (ISO 27001 Clause 5.1)"));
    assert.ok(result.includes("Leadership and Direction"));
    assert.ok(result.includes("Continual Improvement"));
  });

  it("includes GDPR accountability commitment", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("### 3.2 Data Protection (GDPR Art. 5(2) Accountability)"));
    assert.ok(result.includes("Lawful Processing"));
    assert.ok(result.includes("Data Minimization"));
    assert.ok(result.includes("Accountability"));
  });

  // ── Section 4: Specific Commitments ────────────────────────────────

  it("includes governance table", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("### 4.1 Governance"));
    assert.ok(result.includes("Review and approve information security policy"));
    assert.ok(result.includes("Annually"));
  });

  it("includes resource allocation section", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("### 4.2 Resource Allocation"));
    assert.ok(result.includes("Personnel"));
    assert.ok(result.includes("Training"));
    assert.ok(result.includes("Incident Response"));
  });

  // ── Conditional service-specific commitments ───────────────────────

  it("includes AI Systems commitments when AI detected", () => {
    const scan = makeScan({ services: [makeService("OpenAI", "ai")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("#### AI Systems"));
    assert.ok(result.includes("AI governance framework"));
    assert.ok(result.includes("EU AI Act"));
  });

  it("omits AI Systems commitments when no AI services", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(!result.includes("#### AI Systems"));
  });

  it("includes Payment Processing commitments when payment detected", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("#### Payment Processing"));
    assert.ok(result.includes("PCI DSS compliance"));
    assert.ok(result.includes("Never store raw credit card data"));
  });

  it("omits Payment Processing commitments when no payment services", () => {
    const scan = makeScan({ services: [makeService("OpenAI", "ai")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(!result.includes("#### Payment Processing"));
  });

  it("includes Analytics and Tracking commitments when analytics detected", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("#### Analytics and Tracking"));
    assert.ok(result.includes("consent mechanisms"));
    assert.ok(result.includes("DNT, GPC"));
  });

  it("omits Analytics commitments when no analytics services", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(!result.includes("#### Analytics and Tracking"));
  });

  it("includes Authentication and Identity commitments when auth detected", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("#### Authentication and Identity"));
    assert.ok(result.includes("MFA"));
    assert.ok(result.includes("audit logs"));
  });

  it("omits Authentication commitments when no auth services", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(!result.includes("#### Authentication and Identity"));
  });

  // ── Section 5: Regulatory Compliance ───────────────────────────────

  it("includes GDPR and CCPA/CPRA in regulatory table always", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("## 5. Regulatory Compliance"));
    assert.ok(result.includes("**GDPR**"));
    assert.ok(result.includes("**CCPA/CPRA**"));
  });

  it("includes EU AI Act in regulatory table when AI detected", () => {
    const scan = makeScan({ services: [makeService("OpenAI", "ai")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("**EU AI Act**"));
  });

  it("omits EU AI Act when no AI services", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(!result.includes("**EU AI Act**"));
  });

  it("includes PCI DSS in regulatory table when payment detected", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("**PCI DSS**"));
  });

  it("omits PCI DSS when no payment services", () => {
    const scan = makeScan({ services: [makeService("OpenAI", "ai")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(!result.includes("**PCI DSS**"));
  });

  it("includes ISO 27001 and SOC 2 always", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("**ISO 27001**"));
    assert.ok(result.includes("**SOC 2**"));
  });

  it("includes UK GDPR when uk-gdpr in jurisdictions", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdictions: ["uk-gdpr"] };
    const result = generateComplianceOath(scan, ctx)!;
    assert.ok(result.includes("**UK GDPR**"));
  });

  it("omits UK GDPR when uk-gdpr not in jurisdictions", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdictions: ["gdpr"] };
    const result = generateComplianceOath(scan, ctx)!;
    assert.ok(!result.includes("**UK GDPR**"));
  });

  // ── Section 6: Breach Response Commitment ──────────────────────────

  it("includes breach response commitment", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("## 6. Breach Response Commitment"));
    assert.ok(result.includes("72-hour notification"));
    assert.ok(result.includes("GDPR Art. 33"));
    assert.ok(result.includes("GDPR Art. 34"));
  });

  // ── Section 7: Continuous Improvement ──────────────────────────────

  it("includes continuous improvement section", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("## 7. Continuous Improvement"));
    assert.ok(result.includes("Annual compliance audits"));
    assert.ok(result.includes("Quarterly compliance reviews"));
  });

  // ── Section 8: Accountability ──────────────────────────────────────

  it("includes accountability section with roles", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("## 8. Accountability"));
    assert.ok(result.includes("**CEO**"));
    assert.ok(result.includes("**CTO**"));
    assert.ok(result.includes("**DPO**"));
  });

  // ── Section 9: Signatures ─────────────────────────────────────────

  it("includes signature blocks", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("## 9. Signatures"));
    assert.ok(result.includes("### Chief Executive Officer"));
    assert.ok(result.includes("### Chief Technology Officer"));
    assert.ok(result.includes("### Data Protection Officer"));
  });

  it("includes DPO name and email in signature block", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", dpoName: "Jane Doe", dpoEmail: "dpo@acme.com" };
    const result = generateComplianceOath(scan, ctx)!;
    // DPO signature block includes name and email
    assert.ok(result.includes("| **Name** | Jane Doe |"));
    assert.ok(result.includes("| **Email** | dpo@acme.com |"));
  });

  // ── Section 10: Review Schedule ────────────────────────────────────

  it("includes review schedule with annual review date", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("## 10. Review Schedule"));
    assert.ok(result.includes("Next Review Date"));
    assert.ok(result.includes("Annually"));
  });

  // ── Section 11: Contact ────────────────────────────────────────────

  it("includes contact section", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "privacy@acme.com",
      dpoEmail: "dpo@acme.com",
      website: "https://acme.com",
    };
    const result = generateComplianceOath(scan, ctx)!;
    assert.ok(result.includes("## 11. Contact"));
    assert.ok(result.includes("privacy@acme.com"));
    assert.ok(result.includes("dpo@acme.com"));
    assert.ok(result.includes("https://acme.com"));
  });

  // ── Disclaimer and Footer ─────────────────────────────────────────

  it("includes important disclaimer", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("**Important:**"));
    assert.ok(result.includes("reviewed by legal counsel"));
  });

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateComplianceOath(scan, undefined)!;
    assert.ok(result.includes("Codepliant"));
  });

  // ── Comprehensive test ─────────────────────────────────────────────

  it("generates comprehensive oath with all service categories", () => {
    const scan = makeScan({
      services: [
        makeService("clerk", "auth", ["credentials"]),
        makeService("Stripe", "payment", ["cards"]),
        makeService("OpenAI", "ai", ["prompts"]),
        makeService("posthog", "analytics", ["usage"]),
      ],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      dpoName: "Jane Doe",
      dpoEmail: "dpo@acme.com",
      website: "https://acme.com",
      jurisdictions: ["gdpr", "uk-gdpr"],
    };
    const result = generateComplianceOath(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("4 third-party services across 4 categories"));
    // All service-specific commitments
    assert.ok(result.includes("#### AI Systems"));
    assert.ok(result.includes("#### Payment Processing"));
    assert.ok(result.includes("#### Analytics and Tracking"));
    assert.ok(result.includes("#### Authentication and Identity"));
    // All conditional regulatory entries
    assert.ok(result.includes("**EU AI Act**"));
    assert.ok(result.includes("**PCI DSS**"));
    assert.ok(result.includes("**UK GDPR**"));
    // Jurisdictions in scope
    assert.ok(result.includes("**Jurisdictions:** gdpr, uk-gdpr"));
  });
});
