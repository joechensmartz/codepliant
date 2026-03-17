import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { generateComplianceGlossary } from "./compliance-glossary.js";
import type { ScanResult } from "../scanner/types.js";
import type { GeneratorContext } from "./index.js";

function makeService(
  name: string,
  category: "ai" | "payment" | "analytics" | "auth" | "email" | "monitoring" | "database" | "other",
  dataCollected: string[] = ["test data"],
) {
  return {
    name,
    category,
    evidence: [{ type: "dependency" as const, file: "package.json", detail: `${name} detected` }],
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

describe("generateComplianceGlossary", () => {
  it("returns null when no services detected", () => {
    const result = generateComplianceGlossary(makeScan());
    assert.strictEqual(result, null);
  });

  it("generates markdown with title and project name", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceGlossary(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Compliance Glossary"));
    assert.ok(result.includes("test-project"));
  });

  it("uses company name from context", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "hi@acme.com" };
    const result = generateComplianceGlossary(scan, ctx);
    assert.ok(result !== null);
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder when no company name provided", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceGlossary(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("includes core GDPR terms for any service", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateComplianceGlossary(scan)!;
    assert.ok(result.includes("Data Processing Agreement"));
    assert.ok(result.includes("Data Subject Access Request"));
    assert.ok(result.includes("Personal Data"));
    assert.ok(result.includes("Lawful Basis"));
    assert.ok(result.includes("Data Breach"));
    assert.ok(result.includes("Privacy by Design"));
  });

  it("includes CCPA terms for any service", () => {
    const scan = makeScan({
      services: [makeService("auth0", "auth")],
    });
    const result = generateComplianceGlossary(scan)!;
    assert.ok(result.includes("California Consumer Privacy Act"));
    assert.ok(result.includes("California Privacy Rights Act"));
    assert.ok(result.includes("Do Not Sell or Share"));
  });

  it("includes AI terms when AI services detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateComplianceGlossary(scan)!;
    assert.ok(result.includes("EU Artificial Intelligence Act"));
    assert.ok(result.includes("High-Risk AI System"));
    assert.ok(result.includes("AI Model Card"));
    assert.ok(result.includes("Algorithmic Transparency"));
    assert.ok(result.includes("Human-in-the-Loop"));
  });

  it("excludes AI terms when no AI services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceGlossary(scan)!;
    assert.ok(!result.includes("EU Artificial Intelligence Act"));
    assert.ok(!result.includes("High-Risk AI System"));
  });

  it("includes payment terms when payment services detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceGlossary(scan)!;
    assert.ok(result.includes("Payment Card Industry Data Security Standard"));
    assert.ok(result.includes("Cardholder Data Environment"));
    assert.ok(result.includes("Tokenisation"));
  });

  it("excludes payment terms when no payment services", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateComplianceGlossary(scan)!;
    assert.ok(!result.includes("Cardholder Data Environment"));
    assert.ok(!result.includes("Tokenisation"));
  });

  it("includes auth terms when auth services detected", () => {
    const scan = makeScan({
      services: [makeService("auth0", "auth")],
    });
    const result = generateComplianceGlossary(scan)!;
    assert.ok(result.includes("Multi-Factor Authentication"));
    assert.ok(result.includes("Zero Trust Architecture"));
  });

  it("includes monitoring terms when monitoring services detected", () => {
    const scan = makeScan({
      services: [makeService("datadog", "monitoring")],
    });
    const result = generateComplianceGlossary(scan)!;
    assert.ok(result.includes("Business Continuity Plan"));
    assert.ok(result.includes("Disaster Recovery Plan"));
  });

  it("includes analytics-specific terms", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateComplianceGlossary(scan)!;
    assert.ok(result.includes("Special Category Data"));
  });

  it("includes SOC 2 and ISO terms when 5+ services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
        makeService("auth0", "auth"),
        makeService("sentry", "monitoring"),
      ],
    });
    const result = generateComplianceGlossary(scan)!;
    assert.ok(result.includes("SOC 2 Type I"));
    assert.ok(result.includes("SOC 2 Type II"));
    assert.ok(result.includes("Trust Services Criteria"));
    assert.ok(result.includes("Information Security Management System"));
    assert.ok(result.includes("Statement of Applicability"));
    assert.ok(result.includes("Risk Treatment Plan"));
  });

  it("excludes SOC 2 and ISO terms when fewer than 5 services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceGlossary(scan)!;
    assert.ok(!result.includes("SOC 2 Type I"));
    assert.ok(!result.includes("Trust Services Criteria"));
  });

  it("includes HIPAA terms for any service", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceGlossary(scan)!;
    assert.ok(result.includes("Health Insurance Portability and Accountability Act"));
    assert.ok(result.includes("Protected Health Information"));
    assert.ok(result.includes("Business Associate Agreement"));
  });

  it("includes abbreviations quick reference table", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceGlossary(scan)!;
    assert.ok(result.includes("Abbreviations Quick Reference"));
    assert.ok(result.includes("| Abbreviation | Full Term | Source |"));
    assert.ok(result.includes("**DPA**"));
  });

  it("sorts terms alphabetically in Full Glossary", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceGlossary(scan)!;
    // Search within the Full Glossary section only
    const glossaryStart = result.indexOf("## Full Glossary");
    const glossarySection = result.slice(glossaryStart);
    // "Breach Notification" should come before "California Consumer Privacy Act"
    const breachIdx = glossarySection.indexOf("**Breach Notification");
    const ccpaIdx = glossarySection.indexOf("**California Consumer Privacy Act");
    assert.ok(breachIdx > 0, "Breach Notification should appear in glossary");
    assert.ok(ccpaIdx > 0, "CCPA should appear in glossary");
    assert.ok(breachIdx < ccpaIdx, "Terms should be sorted alphabetically");
  });

  it("groups terms by first letter with letter headers", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceGlossary(scan)!;
    assert.ok(result.includes("### B"));
    assert.ok(result.includes("### C"));
    assert.ok(result.includes("### D"));
    assert.ok(result.includes("### P"));
  });

  it("includes Full Glossary section with definitions", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceGlossary(scan)!;
    assert.ok(result.includes("## Full Glossary"));
    assert.ok(result.includes("*Source:"));
  });

  it("includes Applicable Regulatory Frameworks section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceGlossary(scan)!;
    assert.ok(result.includes("## Applicable Regulatory Frameworks"));
    assert.ok(result.includes("**GDPR**"));
    assert.ok(result.includes("**CCPA/CPRA**"));
  });

  it("includes AI Act framework when AI services detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateComplianceGlossary(scan)!;
    assert.ok(result.includes("**EU AI Act**"));
  });

  it("includes PCI DSS framework when payment services detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceGlossary(scan)!;
    assert.ok(result.includes("**PCI DSS**"));
  });

  it("includes How to Use This Glossary section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceGlossary(scan)!;
    assert.ok(result.includes("## How to Use This Glossary"));
    assert.ok(result.includes("During document review"));
    assert.ok(result.includes("Onboarding"));
    assert.ok(result.includes("Audit preparation"));
  });

  it("includes Maintaining This Glossary section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceGlossary(scan)!;
    assert.ok(result.includes("## Maintaining This Glossary"));
    assert.ok(result.includes("Review frequency"));
  });

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceGlossary(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("Consult qualified legal counsel"));
  });

  it("shows term count and service count in header", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceGlossary(scan)!;
    assert.ok(result.includes("terms defined based on 1 detected services"));
  });

  it("includes abbreviation in parentheses for terms that have one", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceGlossary(scan)!;
    assert.ok(result.includes("(DPA)"));
    assert.ok(result.includes("(DSAR)"));
  });
});
