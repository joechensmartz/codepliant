import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateDPOHandbook } from "./dpo-handbook.js";

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

describe("generateDPOHandbook", () => {
  it("returns null when no services detected", () => {
    const scan = makeScan();
    const result = generateDPOHandbook(scan);
    assert.strictEqual(result, null);
  });

  it("generates document when services are present", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateDPOHandbook(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Data Protection Officer Handbook"));
  });

  it("uses default placeholders when no context provided", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[Data Protection Officer Name]"));
    assert.ok(result.includes("[dpo@example.com]"));
  });

  it("uses context values when provided", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateDPOHandbook(scan, {
      companyName: "DataCorp",
      contactEmail: "info@datacorp.com",
      dpoName: "Alice Smith",
      dpoEmail: "alice@datacorp.com",
    })!;
    assert.ok(result.includes("DataCorp"));
    assert.ok(result.includes("Alice Smith"));
    assert.ok(result.includes("alice@datacorp.com"));
  });

  it("includes GDPR Articles 37-39 reference", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("GDPR Articles 37-39"));
  });

  it("includes current date", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateDPOHandbook(scan)!;
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(today));
  });

  it("includes role and appointment section", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("## 1. Role and Appointment (GDPR Art. 37)"));
    assert.ok(result.includes("When a DPO Is Required"));
    assert.ok(result.includes("public authority"));
    assert.ok(result.includes("systematic monitoring"));
  });

  it("flags DPO as mandatory when 5+ services detected", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("resend", "email"),
        makeService("@sentry/node", "monitoring"),
      ],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("likely **mandatory**"));
    assert.ok(result.includes("5 third-party data processors"));
  });

  it("flags DPO as mandatory when AI detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("likely **mandatory**"));
    assert.ok(result.includes("AI services detected"));
  });

  it("flags DPO as mandatory when health data detected", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
      complianceNeeds: [
        { document: "HIPAA Compliance", reason: "Health data detected", priority: "required" },
      ],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("likely **mandatory**"));
    assert.ok(result.includes("Health data processing"));
  });

  it("recommends DPO when not mandatory", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("strongly recommended"));
  });

  it("includes appointment requirements", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("### 1.2 Appointment Requirements"));
    assert.ok(result.includes("professional qualities"));
    assert.ok(result.includes("Not be dismissed or penalized"));
  });

  it("includes position and independence section", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("## 2. Position and Independence (GDPR Art. 38)"));
    assert.ok(result.includes("Reporting Structure"));
    assert.ok(result.includes("Board / CEO"));
  });

  it("includes conflict of interest table", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("Conflict of Interest"));
    assert.ok(result.includes("CEO / Managing Director"));
    assert.ok(result.includes("Head of Marketing"));
    assert.ok(result.includes("Head of HR"));
    assert.ok(result.includes("Head of IT"));
  });

  it("includes tasks and responsibilities section", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("## 3. Tasks and Responsibilities (GDPR Art. 39)"));
    assert.ok(result.includes("Core Tasks"));
    assert.ok(result.includes("Inform and advise"));
    assert.ok(result.includes("Monitor compliance"));
    assert.ok(result.includes("DPIA oversight"));
    assert.ok(result.includes("Breach management"));
  });

  it("includes operational checklist with daily/weekly/monthly/quarterly/annual tasks", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("Operational Checklist"));
    assert.ok(result.includes("#### Daily"));
    assert.ok(result.includes("#### Weekly"));
    assert.ok(result.includes("#### Monthly"));
    assert.ok(result.includes("#### Quarterly"));
    assert.ok(result.includes("#### Annually"));
  });

  it("includes escalation procedures", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("## 4. Escalation Procedures"));
    assert.ok(result.includes("Escalation Matrix"));
    assert.ok(result.includes("72 hours"));
    assert.ok(result.includes("Confirmed data breach"));
  });

  it("includes data breach escalation flowchart", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("Data Breach Escalation"));
    assert.ok(result.includes("Personal data"));
    assert.ok(result.includes("Notify authority"));
    assert.ok(result.includes("Notify affected"));
  });

  it("includes DSAR handling process", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("## 5. DSAR Handling Process"));
    assert.ok(result.includes("Response Timeline"));
    assert.ok(result.includes("Identity verification"));
    assert.ok(result.includes("Day 25-30"));
  });

  it("lists systems to query based on scan results", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth", ["email", "name"]),
        makeService("stripe", "payment", ["card data", "billing"]),
      ],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("Systems to Query (2 detected)"));
    assert.ok(result.includes("next-auth"));
    assert.ok(result.includes("stripe"));
  });

  it("includes AI-specific DPO responsibilities when AI detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("AI-Specific DPO Responsibilities"));
    assert.ok(result.includes("Automated decision-making (Art. 22)"));
    assert.ok(result.includes("DPIA for AI"));
    assert.ok(result.includes("AI transparency"));
    assert.ok(result.includes("Training data governance"));
    assert.ok(result.includes("Bias monitoring"));
  });

  it("excludes AI section when no AI services", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(!result.includes("AI-Specific DPO Responsibilities"));
  });

  it("includes payment data responsibilities when payment detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("Payment Data Responsibilities"));
    assert.ok(result.includes("PCI DSS"));
    assert.ok(result.includes("Financial data retention"));
    assert.ok(result.includes("Cardholder data scope"));
  });

  it("excludes payment section when no payment services", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(!result.includes("Payment Data Responsibilities"));
  });

  it("adjusts section numbering for AI-only conditional sections", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("## 6. AI-Specific DPO Responsibilities"));
    assert.ok(result.includes("## 7. Key Contacts and Resources"));
  });

  it("adjusts section numbering for payment-only conditional sections", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("## 6. Payment Data Responsibilities"));
    assert.ok(result.includes("## 7. Key Contacts and Resources"));
  });

  it("adjusts section numbering when both AI and payment detected", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("## 6. AI-Specific DPO Responsibilities"));
    assert.ok(result.includes("## 7. Payment Data Responsibilities"));
    assert.ok(result.includes("## 8. Key Contacts and Resources"));
  });

  it("includes key contacts and resources section", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateDPOHandbook(scan, {
      companyName: "TestCo",
      contactEmail: "info@testco.com",
      dpoName: "Jane Doe",
      dpoEmail: "dpo@testco.com",
    })!;
    assert.ok(result.includes("Key Contacts and Resources"));
    assert.ok(result.includes("Internal Contacts"));
    assert.ok(result.includes("Jane Doe"));
    assert.ok(result.includes("dpo@testco.com"));
    assert.ok(result.includes("Legal Counsel"));
  });

  it("includes supervisory authorities table", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("Supervisory Authorities"));
    assert.ok(result.includes("ICO"));
    assert.ok(result.includes("CNIL"));
    assert.ok(result.includes("BfDI"));
    assert.ok(result.includes("DPC"));
  });

  it("includes core GDPR and ePrivacy key regulations", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("Key Regulations"));
    assert.ok(result.includes("GDPR"));
    assert.ok(result.includes("ePrivacy Directive"));
  });

  it("includes EU AI Act in regulations when AI detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("EU AI Act"));
  });

  it("includes PCI DSS in regulations when payment detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("PCI DSS"));
  });

  it("includes HIPAA in regulations when health data detected", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
      complianceNeeds: [
        { document: "HIPAA Compliance", reason: "Health data", priority: "required" },
      ],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("HIPAA"));
  });

  it("includes CCPA when jurisdiction configured", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateDPOHandbook(scan, {
      companyName: "TestCo",
      contactEmail: "info@testco.com",
      jurisdictions: ["CCPA"],
    })!;
    assert.ok(result.includes("CCPA/CPRA"));
  });

  it("includes UK GDPR when jurisdiction configured", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateDPOHandbook(scan, {
      companyName: "TestCo",
      contactEmail: "info@testco.com",
      jurisdictions: ["UK GDPR"],
    })!;
    assert.ok(result.includes("UK GDPR"));
    assert.ok(result.includes("Data Protection Act 2018"));
  });

  it("includes Codepliant disclaimer with project name", () => {
    const scan = makeScan({
      projectName: "my-saas-app",
      services: [makeService("next-auth", "auth")],
    });
    const result = generateDPOHandbook(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("my-saas-app"));
    assert.ok(result.includes("reviewed and customized by your legal team"));
  });

  it("lists service data collected in systems to query", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics", ["page views", "user events", "device info", "extra"]),
      ],
    });
    const result = generateDPOHandbook(scan)!;
    // Only first 3 items should be listed
    assert.ok(result.includes("page views"));
    assert.ok(result.includes("user events"));
    assert.ok(result.includes("device info"));
  });

  it("includes DPO name in reporting structure diagram", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateDPOHandbook(scan, {
      companyName: "TestCo",
      contactEmail: "info@testco.com",
      dpoName: "Bob Jones",
    })!;
    // DPO name is truncated to 17 chars in the diagram
    assert.ok(result.includes("Bob Jones"));
  });
});
