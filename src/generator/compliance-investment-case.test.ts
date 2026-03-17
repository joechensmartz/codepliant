import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateComplianceInvestmentCase } from "./compliance-investment-case.js";
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

describe("generateComplianceInvestmentCase", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateComplianceInvestmentCase(scan), null);
  });

  // ── Generation with services ──────────────────────────────────────

  it("generates document with a single service", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result !== null);
    assert.ok(result.includes("Compliance Investment Case"));
  });

  it("generates document with multiple services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("Compliance Investment Case"));
    assert.ok(result.includes("3 detected service(s)"));
  });

  // ── Context values ────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generateComplianceInvestmentCase(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes project name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("test-project"));
  });

  it("includes service count", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment"), makeService("openai", "ai")],
    });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("2"));
  });

  // ── Executive Summary section ─────────────────────────────────────

  it("includes Executive Summary section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("Executive Summary"));
    assert.ok(result.includes("regulatory framework(s)"));
  });

  it("counts applicable regulatory frameworks", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "a@a.com", jurisdictions: ["gdpr", "ccpa"] };
    const result = generateComplianceInvestmentCase(scan, ctx)!;
    // Should include GDPR, CCPA, AI, Payment = 4 frameworks
    assert.ok(result.includes("4 regulatory framework(s)"));
  });

  // ── Cost of Non-Compliance section ────────────────────────────────

  it("includes Cost of Non-Compliance section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("Cost of Non-Compliance"));
    assert.ok(result.includes("Regulatory Fines"));
    assert.ok(result.includes("Data Breach Costs"));
  });

  it("includes GDPR fines by default (no jurisdictions)", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("GDPR"));
    assert.ok(result.includes("4% of annual global turnover"));
  });

  it("includes CCPA fines with ccpa jurisdiction", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "a@a.com", jurisdictions: ["ccpa"] };
    const result = generateComplianceInvestmentCase(scan, ctx)!;
    assert.ok(result.includes("CCPA/CPRA"));
    assert.ok(result.includes("$2,500 per violation"));
  });

  it("includes CCPA fines when companyLocation is US", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "a@a.com", companyLocation: "US" };
    const result = generateComplianceInvestmentCase(scan, ctx)!;
    assert.ok(result.includes("CCPA/CPRA"));
  });

  it("includes CCPA fines when analytics services present", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("CCPA/CPRA"));
  });

  it("includes EU AI Act fines with AI services", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("EU AI Act"));
    assert.ok(result.includes("EUR 35M"));
  });

  it("includes PCI DSS fines with payment services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("PCI DSS"));
    assert.ok(result.includes("$5,000 - $100,000/month"));
  });

  it("includes COPPA fines when COPPA compliance need exists", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
      complianceNeeds: [
        { document: "COPPA Compliance", reason: "Children data", priority: "required" },
      ],
    });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("COPPA"));
    assert.ok(result.includes("$50,120 per violation"));
  });

  it("includes HIPAA fines when HIPAA compliance need exists", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
      complianceNeeds: [
        { document: "HIPAA Compliance", reason: "Health data", priority: "required" },
      ],
    });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("HIPAA"));
    assert.ok(result.includes("$1.5M/year per category"));
  });

  it("excludes COPPA fines when no COPPA compliance need", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(!result.includes("COPPA"));
  });

  // ── Litigation Exposure section ───────────────────────────────────

  it("includes Litigation Exposure section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("Litigation Exposure"));
    assert.ok(result.includes("Class action settlements"));
  });

  it("includes AI liability note when AI services present", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("AI liability"));
    assert.ok(result.includes("strict liability"));
  });

  it("excludes AI liability note when no AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(!result.includes("AI liability"));
  });

  // ── Reputational Damage section ───────────────────────────────────

  it("includes Reputational Damage section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("Reputational Damage"));
    assert.ok(result.includes("Stock price decline"));
    assert.ok(result.includes("Customer churn"));
  });

  // ── Regulatory Exposure Assessment section ────────────────────────

  it("includes Regulatory Exposure Assessment section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("Regulatory Exposure Assessment"));
  });

  it("includes analytics exposure when analytics services present", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("Analytics & Advertising"));
    assert.ok(result.includes("posthog"));
    assert.ok(result.includes("Cookie consent violations"));
  });

  it("includes advertising exposure when advertising services present", () => {
    const scan = makeScan({ services: [makeService("google-ads", "advertising")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("Analytics & Advertising"));
    assert.ok(result.includes("google-ads"));
  });

  it("includes auth exposure when auth services present", () => {
    const scan = makeScan({ services: [makeService("@clerk/nextjs", "auth")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("Authentication & User Data"));
    assert.ok(result.includes("@clerk/nextjs"));
  });

  it("includes payment exposure when payment services present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("Payment Processing"));
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("PCI DSS non-compliance"));
  });

  it("includes AI exposure when AI services present", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("AI Services"));
    assert.ok(result.includes("openai"));
    assert.ok(result.includes("Colorado AI Act"));
  });

  it("includes email exposure when email services present", () => {
    const scan = makeScan({ services: [makeService("resend", "email")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("Email Services"));
    assert.ok(result.includes("resend"));
    assert.ok(result.includes("CAN-SPAM"));
  });

  it("includes storage exposure when storage services present", () => {
    const scan = makeScan({ services: [makeService("s3", "storage")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("Storage & Database"));
    assert.ok(result.includes("s3"));
    assert.ok(result.includes("Data residency violations"));
  });

  it("includes database exposure when database services present", () => {
    const scan = makeScan({ services: [makeService("prisma", "database")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("Storage & Database"));
    assert.ok(result.includes("prisma"));
  });

  it("excludes analytics exposure when no analytics/advertising services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(!result.includes("Analytics & Advertising"));
  });

  // ── ROI of Compliance Program section ─────────────────────────────

  it("includes ROI section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("Return on Investment (ROI)"));
    assert.ok(result.includes("Compliance Program Cost Estimate"));
  });

  it("uses small tier for 5 or fewer services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment"), makeService("openai", "ai")],
    });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("small complexity"));
    assert.ok(result.includes("$5,000 - $25,000"));
    assert.ok(result.includes("233% ROI"));
  });

  it("uses medium tier for 6-15 services", () => {
    const services: DetectedService[] = [];
    for (let i = 0; i < 8; i++) {
      services.push(makeService(`svc-${i}`, "storage"));
    }
    const scan = makeScan({ services });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("medium complexity"));
    assert.ok(result.includes("$25,000 - $100,000"));
    assert.ok(result.includes("733% ROI"));
  });

  it("uses large tier for 16+ services", () => {
    const services: DetectedService[] = [];
    for (let i = 0; i < 20; i++) {
      services.push(makeService(`svc-${i}`, "storage"));
    }
    const scan = makeScan({ services });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("large complexity"));
    assert.ok(result.includes("$100,000 - $500,000"));
    assert.ok(result.includes("1,567% ROI"));
  });

  // ── Implementation Roadmap section ────────────────────────────────

  it("includes Implementation Roadmap section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("Implementation Roadmap"));
    assert.ok(result.includes("Phase 1: Foundation"));
    assert.ok(result.includes("Phase 2: Quick Wins"));
    assert.ok(result.includes("Phase 3: Operational"));
    assert.ok(result.includes("Phase 4: Maturity"));
  });

  it("includes AI disclosure task when AI services present", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("AI Disclosure document"));
  });

  it("includes PCI DSS task when payment services present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("PCI DSS Self-Assessment"));
  });

  it("excludes AI disclosure task when no AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(!result.includes("AI Disclosure document"));
  });

  // ── Stakeholder Talking Points section ────────────────────────────

  it("includes Stakeholder Talking Points section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("Stakeholder Talking Points"));
    assert.ok(result.includes("For the Board / C-Suite"));
    assert.ok(result.includes("For Engineering"));
    assert.ok(result.includes("For Legal"));
  });

  it("shows GDPR turnover risk in board talking points when GDPR applies", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("4% of global annual turnover (GDPR)"));
  });

  it("shows AI Act turnover risk when only AI (no GDPR) applies", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "a@a.com", jurisdictions: ["ccpa"] };
    const result = generateComplianceInvestmentCase(scan, ctx)!;
    // showGDPR = false since jurisdictions doesn't include gdpr and is non-empty
    // So should fall to AI branch
    assert.ok(result.includes("7% of global annual turnover (EU AI Act)"));
  });

  it("uses B2B label for 10 or fewer services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("B2B"));
  });

  it("uses Enterprise label for more than 10 services", () => {
    const services: DetectedService[] = [];
    for (let i = 0; i < 12; i++) {
      services.push(makeService(`svc-${i}`, "storage"));
    }
    const scan = makeScan({ services });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("Enterprise"));
  });

  it("lists applicable regulations in legal talking points", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment"), makeService("openai", "ai")],
    });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "a@a.com", jurisdictions: ["gdpr", "ccpa"] };
    const result = generateComplianceInvestmentCase(scan, ctx)!;
    assert.ok(result.includes("GDPR"));
    assert.ok(result.includes("CCPA/CPRA"));
    assert.ok(result.includes("EU AI Act"));
    assert.ok(result.includes("PCI DSS"));
  });

  // ── Industry Benchmarks section ───────────────────────────────────

  it("includes Industry Benchmarks section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("Industry Benchmarks"));
    assert.ok(result.includes("$4.88M"));
    assert.ok(result.includes("2.71x more expensive"));
    assert.ok(result.includes("EUR 1.2B"));
  });

  // ── Disclaimer and Footer ─────────────────────────────────────────

  it("includes disclaimer about not being legal advice", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("not legal or financial advice"));
  });

  it("includes Codepliant attribution in footer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("qualified legal and financial counsel"));
  });

  // ── Section numbering ─────────────────────────────────────────────

  it("uses sequential section numbers", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceInvestmentCase(scan)!;
    assert.ok(result.includes("## 1."));
    assert.ok(result.includes("## 2."));
    assert.ok(result.includes("## 3."));
    assert.ok(result.includes("## 4."));
    assert.ok(result.includes("## 5."));
    assert.ok(result.includes("## 6."));
    assert.ok(result.includes("## 7."));
  });

  // ── Comprehensive test ────────────────────────────────────────────

  it("generates comprehensive document with all service categories", () => {
    const scan = makeScan({
      services: [
        makeService("@clerk/nextjs", "auth"),
        makeService("prisma", "database"),
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
        makeService("resend", "email"),
        makeService("s3", "storage"),
      ],
      complianceNeeds: [
        { document: "COPPA Compliance", reason: "Children data", priority: "required" },
        { document: "HIPAA Compliance", reason: "Health data", priority: "required" },
      ],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      jurisdictions: ["gdpr", "ccpa"],
    };
    const result = generateComplianceInvestmentCase(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("Executive Summary"));
    assert.ok(result.includes("Cost of Non-Compliance"));
    assert.ok(result.includes("Regulatory Exposure Assessment"));
    assert.ok(result.includes("Return on Investment"));
    assert.ok(result.includes("Implementation Roadmap"));
    assert.ok(result.includes("Stakeholder Talking Points"));
    assert.ok(result.includes("Industry Benchmarks"));
    assert.ok(result.includes("GDPR"));
    assert.ok(result.includes("CCPA/CPRA"));
    assert.ok(result.includes("EU AI Act"));
    assert.ok(result.includes("PCI DSS"));
    assert.ok(result.includes("COPPA"));
    assert.ok(result.includes("HIPAA"));
    assert.ok(result.includes("Analytics & Advertising"));
    assert.ok(result.includes("Authentication & User Data"));
    assert.ok(result.includes("Payment Processing"));
    assert.ok(result.includes("AI Services"));
    assert.ok(result.includes("Email Services"));
    assert.ok(result.includes("Storage & Database"));
  });
});
