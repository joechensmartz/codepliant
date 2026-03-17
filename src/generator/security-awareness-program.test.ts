import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateSecurityAwarenessProgram } from "./security-awareness-program.js";

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

describe("generateSecurityAwarenessProgram", () => {
  it("returns null when no services detected", () => {
    const scan = makeScan();
    const result = generateSecurityAwarenessProgram(scan);
    assert.strictEqual(result, null);
  });

  it("generates program when services are present", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateSecurityAwarenessProgram(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Security Awareness Program"));
  });

  it("uses context values for company info", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateSecurityAwarenessProgram(scan, {
      companyName: "Acme Corp",
      contactEmail: "security@acme.com",
      securityEmail: "sec-team@acme.com",
      dpoName: "Jane Doe",
      dpoEmail: "dpo@acme.com",
    })!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("sec-team@acme.com"));
    assert.ok(result.includes("Jane Doe"));
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("uses placeholder defaults when no context provided", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
    assert.ok(result.includes("[Data Protection Officer Name]"));
  });

  it("securityEmail defaults to contactEmail when only contactEmail provided", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateSecurityAwarenessProgram(scan, {
      companyName: "TestCo",
      contactEmail: "info@test.com",
    })!;
    // securityEmail falls back to contactEmail; appears in reporting procedure
    assert.ok(result.includes("info@test.com"));
  });

  it("includes program overview with objectives", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(result.includes("## 1. Program Overview"));
    assert.ok(result.includes("Program Objectives"));
    assert.ok(result.includes("SOC 2"));
    assert.ok(result.includes("ISO 27001"));
    assert.ok(result.includes("GDPR Art. 39"));
  });

  it("includes scope and audience table", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(result.includes("## 2. Scope & Audience"));
    assert.ok(result.includes("All employees"));
    assert.ok(result.includes("Engineering/DevOps"));
    assert.ok(result.includes("Executive team"));
  });

  it("includes AI/ML engineers audience when AI service detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(result.includes("AI/ML engineers"));
  });

  it("does not include AI/ML engineers audience when no AI service", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(!result.includes("AI/ML engineers"));
  });

  it("includes finance/billing audience when payment service detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(result.includes("Finance/billing"));
    assert.ok(result.includes("PCI DSS"));
  });

  it("does not include finance/billing audience when no payment service", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(!result.includes("Finance/billing"));
  });

  it("includes phishing awareness module", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(result.includes("### 3.1 Phishing Awareness"));
    assert.ok(result.includes("spear-phishing"));
    assert.ok(result.includes("Phishing Simulation Program"));
    assert.ok(result.includes("< 5%"));
  });

  it("includes password hygiene module", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(result.includes("### 3.2 Password Hygiene"));
    assert.ok(result.includes("16 characters"));
    assert.ok(result.includes("NIST 800-63B"));
    assert.ok(result.includes("password manager"));
  });

  it("includes incident reporting module with security email", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateSecurityAwarenessProgram(scan, {
      companyName: "TestCo",
      contactEmail: "info@test.com",
      securityEmail: "sec@test.com",
    })!;
    assert.ok(result.includes("### 3.3 Incident Reporting"));
    assert.ok(result.includes("sec@test.com"));
    assert.ok(result.includes("STOP"));
    assert.ok(result.includes("REPORT"));
    assert.ok(result.includes("PRESERVE"));
  });

  it("includes social engineering module", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(result.includes("### 3.4 Social Engineering Defence"));
    assert.ok(result.includes("pretexting"));
    assert.ok(result.includes("tailgating"));
  });

  it("includes device security module", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(result.includes("### 3.5 Device & Endpoint Security"));
    assert.ok(result.includes("full-disk encryption"));
    assert.ok(result.includes("VPN"));
  });

  it("includes data handling module", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(result.includes("### 3.6 Data Handling & Classification"));
    assert.ok(result.includes("Public, Internal, Confidential, Restricted"));
  });

  it("includes AI security module when AI service detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(result.includes("AI Security & Data Ethics"));
    assert.ok(result.includes("Do not paste confidential data into external AI tools"));
    assert.ok(result.includes("Acceptable AI Use Policy"));
  });

  it("does not include AI security module when no AI service", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(!result.includes("AI Security & Data Ethics"));
  });

  it("includes PCI DSS module when payment service detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(result.includes("Payment Card Security (PCI DSS)"));
    assert.ok(result.includes("Never store full card numbers"));
  });

  it("does not include PCI DSS module when no payment service", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(!result.includes("Payment Card Security (PCI DSS)"));
  });

  it("numbers PCI module as 3.8 when AI is also present", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment info"]),
      ],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(result.includes("### 3.7 AI Security"));
    assert.ok(result.includes("### 3.8 Payment Card Security"));
  });

  it("numbers PCI module as 3.7 when AI is not present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(result.includes("### 3.7 Payment Card Security"));
  });

  it("includes monthly activities calendar", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(result.includes("## 4. Monthly Activities"));
    assert.ok(result.includes("January"));
    assert.ok(result.includes("December"));
    assert.ok(result.includes("Cybersecurity Awareness Month"));
  });

  it("includes quarterly activities", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(result.includes("## 5. Quarterly Activities"));
    assert.ok(result.includes("Q1"));
    assert.ok(result.includes("Q4"));
  });

  it("includes metrics and KPIs section", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(result.includes("## 6. Metrics & KPIs"));
    assert.ok(result.includes("Training completion rate"));
    assert.ok(result.includes("Phishing click rate"));
    assert.ok(result.includes("MFA enrollment"));
  });

  it("includes training completion tracking with current year", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    const year = new Date().getFullYear().toString();
    assert.ok(result.includes("## 7. Training Completion Tracking"));
    assert.ok(result.includes(year));
    assert.ok(result.includes("Engineering"));
    assert.ok(result.includes("Executive Team"));
  });

  it("includes non-compliance section", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(result.includes("## 8. Non-Compliance"));
    assert.ok(result.includes("Failed phishing simulation"));
    assert.ok(result.includes("48 hours"));
  });

  it("includes program governance section", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateSecurityAwarenessProgram(scan, {
      companyName: "TestCo",
      contactEmail: "info@test.com",
      securityEmail: "sec@test.com",
      dpoName: "Jane DPO",
      dpoEmail: "dpo@test.com",
    })!;
    assert.ok(result.includes("## 9. Program Governance"));
    assert.ok(result.includes("sec@test.com"));
    assert.ok(result.includes("Jane DPO"));
    assert.ok(result.includes("dpo@test.com"));
  });

  it("includes tools and resources section", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(result.includes("## 10. Tools & Resources"));
    assert.ok(result.includes("LMS Platform"));
    assert.ok(result.includes("Phishing Simulator"));
    assert.ok(result.includes("Password Manager"));
  });

  it("includes related documents", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(result.includes("Related Documents"));
    assert.ok(result.includes("INCIDENT_RESPONSE_PLAN.md"));
    assert.ok(result.includes("ACCESS_CONTROL_POLICY.md"));
  });

  it("includes AI use policy in related documents when AI service detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(result.includes("ACCEPTABLE_AI_USE_POLICY.md"));
  });

  it("does not include AI use policy in related documents when no AI service", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(!result.includes("ACCEPTABLE_AI_USE_POLICY.md"));
  });

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("auto-generated"));
  });

  it("includes all conditional sections when all categories present", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment info"]),
        makeService("next-auth", "auth", ["email"]),
        makeService("sentry", "monitoring", ["error logs"]),
      ],
    });
    const result = generateSecurityAwarenessProgram(scan)!;
    assert.ok(result.includes("AI/ML engineers"));
    assert.ok(result.includes("Finance/billing"));
    assert.ok(result.includes("AI Security & Data Ethics"));
    assert.ok(result.includes("Payment Card Security (PCI DSS)"));
    assert.ok(result.includes("ACCEPTABLE_AI_USE_POLICY.md"));
  });
});
