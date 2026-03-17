import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generatePrivacyProgramCharter } from "./privacy-program-charter.js";

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

describe("generatePrivacyProgramCharter", () => {
  // ── Null return ───────────────────────────────────────────────────────

  it("returns null when no services detected", () => {
    assert.equal(generatePrivacyProgramCharter(makeScan()), null);
  });

  // ── Basic generation ──────────────────────────────────────────────────

  it("generates when at least one service detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Privacy Program Charter"));
  });

  // ── Header ────────────────────────────────────────────────────────────

  it("includes effective date and organization", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(`**Effective Date:** ${today}`));
    assert.ok(result.includes("Codepliant"));
  });

  it("uses default placeholders when no context provided", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
    assert.ok(result.includes("[Data Protection Officer Name]"));
    assert.ok(result.includes("[dpo@example.com]"));
    assert.ok(result.includes("[https://yoursite.com]"));
  });

  it("uses context values when provided", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan, {
      companyName: "Acme Corp",
      contactEmail: "legal@acme.com",
      dpoName: "Jane Doe",
      dpoEmail: "dpo@acme.com",
      website: "https://acme.com",
    })!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("legal@acme.com"));
    assert.ok(result.includes("Jane Doe"));
    assert.ok(result.includes("dpo@acme.com"));
    assert.ok(result.includes("https://acme.com"));
  });

  // ── Mission Statement ─────────────────────────────────────────────────

  it("includes Mission Statement section with core principles", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(result.includes("## 1. Mission Statement"));
    assert.ok(result.includes("### 1.1 Core Principles"));
    assert.ok(result.includes("Privacy by Design"));
    assert.ok(result.includes("Data Minimisation"));
    assert.ok(result.includes("Transparency"));
    assert.ok(result.includes("Accountability"));
    assert.ok(result.includes("Security"));
  });

  // ── Scope ─────────────────────────────────────────────────────────────

  it("includes Scope section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(result.includes("## 2. Scope"));
    assert.ok(result.includes("employees, contractors, and temporary staff"));
    assert.ok(result.includes("third-party vendors and sub-processors"));
  });

  it("includes Data Processing Landscape with service count", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("sentry", "monitoring"),
      ],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(result.includes("### 2.1 Data Processing Landscape"));
    assert.ok(result.includes("**3 detected service(s)**"));
  });

  it("lists services grouped by category", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("anthropic", "ai"),
      ],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(result.includes("**Payment:** stripe"));
    assert.ok(result.includes("**Ai:** openai, anthropic"));
  });

  it("includes data categories when present in scan", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
      dataCategories: ["personal data" as any, "financial data" as any, "usage data" as any],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(result.includes("### 2.2 Data Categories in Scope"));
    assert.ok(result.includes("- personal data"));
    assert.ok(result.includes("- financial data"));
    assert.ok(result.includes("- usage data"));
  });

  it("omits data categories section when none present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
      dataCategories: [],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(!result.includes("### 2.2 Data Categories in Scope"));
  });

  // ── Regulatory Framework ──────────────────────────────────────────────

  it("includes Regulatory Framework section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(result.includes("## 3. Regulatory Framework"));
    assert.ok(result.includes("Industry standards"));
  });

  it("includes GDPR rows when EU jurisdiction is specified", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan, {
      companyName: "Test",
      contactEmail: "t@t.com",
      jurisdiction: "EU",
    })!;
    assert.ok(result.includes("GDPR"));
    assert.ok(result.includes("ePrivacy Directive"));
  });

  it("includes UK GDPR row when UK jurisdiction is specified", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan, {
      companyName: "Test",
      contactEmail: "t@t.com",
      jurisdiction: "UK",
    })!;
    assert.ok(result.includes("UK GDPR + DPA 2018"));
    // UK also triggers GDPR/ePrivacy via hasEU
    assert.ok(result.includes("GDPR"));
  });

  it("includes CCPA row when US jurisdiction is specified", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan, {
      companyName: "Test",
      contactEmail: "t@t.com",
      jurisdiction: "US",
    })!;
    assert.ok(result.includes("CCPA/CPRA"));
  });

  it("includes CCPA row when CCPA is in jurisdictions array", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan, {
      companyName: "Test",
      contactEmail: "t@t.com",
      jurisdictions: ["CCPA"],
    })!;
    assert.ok(result.includes("CCPA/CPRA"));
  });

  it("includes EU AI Act row when AI services detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(result.includes("EU AI Act"));
    assert.ok(result.includes("AI risk classification"));
  });

  it("excludes EU AI Act when no AI services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(!result.includes("EU AI Act"));
  });

  it("excludes GDPR/CCPA rows when no jurisdiction specified", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(!result.includes("| GDPR |"));
    assert.ok(!result.includes("| CCPA/CPRA |"));
  });

  // ── Governance Structure ──────────────────────────────────────────────

  it("includes Governance Structure section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(result.includes("## 4. Governance Structure"));
    assert.ok(result.includes("### 4.1 Privacy Governance Hierarchy"));
    assert.ok(result.includes("Board of Directors"));
    assert.ok(result.includes("Data Protection Officer (DPO)"));
    assert.ok(result.includes("### 4.2 Privacy Steering Committee"));
  });

  // ── Key Roles ─────────────────────────────────────────────────────────

  it("includes Key Roles section with DPO details", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan, {
      companyName: "Acme",
      contactEmail: "a@acme.com",
      dpoName: "Jane Smith",
      dpoEmail: "dpo@acme.com",
    })!;
    assert.ok(result.includes("## 5. Key Roles & Responsibilities"));
    assert.ok(result.includes("### 5.1 Data Protection Officer (DPO)"));
    assert.ok(result.includes("**Name:** Jane Smith"));
    assert.ok(result.includes("**Email:** dpo@acme.com"));
  });

  it("includes Engineering, Legal, and All Staff role sections", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(result.includes("### 5.2 Engineering & Product"));
    assert.ok(result.includes("### 5.3 Legal & Compliance"));
    assert.ok(result.includes("### 5.4 All Staff"));
    assert.ok(result.includes("annual privacy awareness training"));
  });

  it("includes AI compliance responsibility for engineering when AI detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(result.includes("AI systems comply with transparency and explainability"));
  });

  it("excludes AI engineering responsibility when no AI detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(!result.includes("AI systems comply with transparency"));
  });

  // ── Annual Objectives & Metrics ───────────────────────────────────────

  it("includes Annual Objectives section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(result.includes("## 6. Annual Objectives & Metrics"));
    assert.ok(result.includes("### 6.1 Objectives"));
    assert.ok(result.includes("100% staff privacy training"));
    assert.ok(result.includes("DSAR response time"));
  });

  it("includes AI risk assessment objective when AI detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(result.includes("AI risk assessments"));
  });

  it("excludes AI risk assessment objective when no AI", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(!result.includes("AI risk assessments"));
  });

  it("includes KPIs section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(result.includes("### 6.2 Key Performance Indicators (KPIs)"));
    assert.ok(result.includes("Training completion rate"));
    assert.ok(result.includes("DSAR response time"));
    assert.ok(result.includes("Breach notification time"));
    assert.ok(result.includes("Vendor compliance rate"));
  });

  it("includes cookie consent rate KPI when analytics detected", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(result.includes("Cookie consent rate"));
  });

  it("excludes cookie consent rate KPI when no analytics", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(!result.includes("Cookie consent rate"));
  });

  // ── Program Activities ────────────────────────────────────────────────

  it("includes Program Activities section with annual calendar", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(result.includes("## 7. Program Activities"));
    assert.ok(result.includes("### 7.1 Annual Calendar"));
    assert.ok(result.includes("Q1"));
    assert.ok(result.includes("Q2"));
    assert.ok(result.includes("Q3"));
    assert.ok(result.includes("Q4"));
  });

  it("includes Continuous Activities section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(result.includes("### 7.2 Continuous Activities"));
    assert.ok(result.includes("Code scanning"));
    assert.ok(result.includes("Vendor monitoring"));
  });

  it("includes PCI compliance activity when payment detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(result.includes("PCI compliance"));
  });

  it("excludes PCI compliance when no payment", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(!result.includes("PCI compliance"));
  });

  // ── Budget & Resources ────────────────────────────────────────────────

  it("includes Budget & Resources section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(result.includes("## 8. Budget & Resources"));
    assert.ok(result.includes("Personnel"));
    assert.ok(result.includes("Tools"));
    assert.ok(result.includes("Training"));
  });

  // ── Incident Response ─────────────────────────────────────────────────

  it("includes Incident Response Integration section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(result.includes("## 9. Incident Response Integration"));
    assert.ok(result.includes("72 hours"));
    assert.ok(result.includes("GDPR Art. 33"));
    assert.ok(result.includes("GDPR Art. 34"));
  });

  // ── Charter Review ────────────────────────────────────────────────────

  it("includes Charter Review section with next review date", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(result.includes("## 10. Charter Review & Approval"));
    assert.ok(result.includes("Annually"));
    assert.ok(result.includes("Next review due"));
  });

  // ── Contact ───────────────────────────────────────────────────────────

  it("includes Contact section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan, {
      companyName: "TestCo",
      contactEmail: "info@testco.com",
      dpoName: "Bob Jones",
      dpoEmail: "dpo@testco.com",
      website: "https://testco.com",
    })!;
    assert.ok(result.includes("## 11. Contact"));
    assert.ok(result.includes("Bob Jones"));
    assert.ok(result.includes("dpo@testco.com"));
    assert.ok(result.includes("info@testco.com"));
    assert.ok(result.includes("https://testco.com"));
  });

  // ── Footer ────────────────────────────────────────────────────────────

  it("includes Codepliant disclaimer footer", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("Review with your DPO and executive leadership"));
  });

  // ── Company name usage ────────────────────────────────────────────────

  it("uses company name throughout the document", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan, {
      companyName: "PrivacyFirst Ltd",
      contactEmail: "info@privacyfirst.com",
    })!;
    const occurrences = result.split("PrivacyFirst Ltd").length - 1;
    assert.ok(occurrences >= 4, `Expected at least 4 occurrences of company name, got ${occurrences}`);
  });

  // ── Multiple jurisdictions ────────────────────────────────────────────

  it("combines jurisdiction and jurisdictions array", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyProgramCharter(scan, {
      companyName: "Global Inc",
      contactEmail: "g@g.com",
      jurisdiction: "EU",
      jurisdictions: ["US"],
    })!;
    assert.ok(result.includes("GDPR"));
    assert.ok(result.includes("CCPA/CPRA"));
  });
});
