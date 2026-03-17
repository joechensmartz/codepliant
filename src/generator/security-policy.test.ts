import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateSecurityPolicy } from "./security-policy.js";

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

describe("generateSecurityPolicy", () => {
  it("generates a basic security policy with no services", () => {
    const scan = makeScan();
    const result = generateSecurityPolicy(scan);
    assert.ok(result.includes("# Security Policy"));
    assert.ok(result.includes("Supported Versions"));
    assert.ok(result.includes("Reporting a Vulnerability"));
    assert.ok(result.includes("Response Timeline"));
    assert.ok(result.includes("Disclosure Policy"));
  });

  it("includes last updated date", () => {
    const scan = makeScan();
    const result = generateSecurityPolicy(scan);
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(`**Last updated:** ${today}`));
  });

  it("uses default placeholders when no context provided", () => {
    const scan = makeScan();
    const result = generateSecurityPolicy(scan);
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[security@example.com]"));
    assert.ok(result.includes("[https://yoursite.com]"));
  });

  it("uses context values when provided", () => {
    const scan = makeScan();
    const result = generateSecurityPolicy(scan, {
      companyName: "Acme Corp",
      contactEmail: "info@acme.com",
      securityEmail: "sec@acme.com",
      website: "https://acme.com",
    });
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("sec@acme.com"));
    assert.ok(result.includes("https://acme.com"));
    // securityEmail takes precedence over contactEmail
    assert.ok(!result.includes("info@acme.com"));
  });

  it("falls back to contactEmail when securityEmail not provided", () => {
    const scan = makeScan();
    const result = generateSecurityPolicy(scan, {
      companyName: "Acme Corp",
      contactEmail: "contact@acme.com",
    });
    assert.ok(result.includes("contact@acme.com"));
  });

  it("includes Scope section with company name and website", () => {
    const scan = makeScan();
    const result = generateSecurityPolicy(scan, {
      companyName: "TestCo",
      contactEmail: "test@test.com",
      website: "https://testco.io",
    });
    assert.ok(result.includes("## Scope"));
    assert.ok(result.includes("### In Scope"));
    assert.ok(result.includes("### Out of Scope"));
    assert.ok(result.includes("TestCo application code and APIs"));
    assert.ok(result.includes("https://testco.io"));
  });

  it("includes Authentication Security section when auth service detected", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email", "session data"])],
    });
    const result = generateSecurityPolicy(scan);
    assert.ok(result.includes("## Authentication Security"));
    assert.ok(result.includes("Session management and token handling"));
    assert.ok(result.includes("Authentication bypass vulnerabilities"));
    assert.ok(result.includes("Credential storage and transmission"));
    assert.ok(result.includes("OAuth flow and callback security"));
  });

  it("excludes Authentication Security section when no auth service", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateSecurityPolicy(scan);
    assert.ok(!result.includes("## Authentication Security"));
  });

  it("includes PCI section when payment service detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment information"])],
    });
    const result = generateSecurityPolicy(scan);
    assert.ok(result.includes("## Payment & PCI Considerations"));
    assert.ok(result.includes("PCI DSS"));
    assert.ok(result.includes("[PCI]"));
    assert.ok(result.includes("PCI-compliant payment processor"));
  });

  it("excludes PCI section when no payment service", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateSecurityPolicy(scan);
    assert.ok(!result.includes("## Payment & PCI Considerations"));
  });

  it("includes AI Safety section when AI service detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateSecurityPolicy(scan);
    assert.ok(result.includes("## AI Safety & Security"));
    assert.ok(result.includes("Prompt injection vulnerabilities"));
    assert.ok(result.includes("Data leakage through AI model interactions"));
    assert.ok(result.includes("Model manipulation or adversarial inputs"));
  });

  it("excludes AI Safety section when no AI service", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateSecurityPolicy(scan);
    assert.ok(!result.includes("## AI Safety & Security"));
  });

  it("includes all conditional sections when all service types present", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSecurityPolicy(scan);
    assert.ok(result.includes("## Authentication Security"));
    assert.ok(result.includes("## Payment & PCI Considerations"));
    assert.ok(result.includes("## AI Safety & Security"));
  });

  it("includes Bug Bounty section when bugBountyUrl provided", () => {
    const scan = makeScan();
    const result = generateSecurityPolicy(scan, {
      companyName: "TestCo",
      contactEmail: "test@test.com",
      bugBountyUrl: "https://bugcrowd.com/testco",
    });
    assert.ok(result.includes("## Bug Bounty Program"));
    assert.ok(result.includes("https://bugcrowd.com/testco"));
    assert.ok(result.includes("responsible disclosure"));
  });

  it("excludes Bug Bounty section when bugBountyUrl not provided", () => {
    const scan = makeScan();
    const result = generateSecurityPolicy(scan, {
      companyName: "TestCo",
      contactEmail: "test@test.com",
    });
    assert.ok(!result.includes("## Bug Bounty Program"));
  });

  it("includes Response Timeline table", () => {
    const scan = makeScan();
    const result = generateSecurityPolicy(scan);
    assert.ok(result.includes("## Response Timeline"));
    assert.ok(result.includes("Within 48 hours"));
    assert.ok(result.includes("Within 30 days"));
    assert.ok(result.includes("Within 90 days"));
  });

  it("includes supported versions table", () => {
    const scan = makeScan();
    const result = generateSecurityPolicy(scan);
    assert.ok(result.includes("| Version | Supported"));
    assert.ok(result.includes("| latest"));
  });

  it("includes reporting instructions", () => {
    const scan = makeScan();
    const result = generateSecurityPolicy(scan);
    assert.ok(result.includes("do NOT report security vulnerabilities through public GitHub issues"));
    assert.ok(result.includes("Steps to reproduce"));
    assert.ok(result.includes("Potential impact"));
  });

  it("includes Disclosure Policy section", () => {
    const scan = makeScan();
    const result = generateSecurityPolicy(scan);
    assert.ok(result.includes("## Disclosure Policy"));
    assert.ok(result.includes("coordinated disclosure"));
    assert.ok(result.includes("good faith effort"));
  });

  it("includes Contact section with email", () => {
    const scan = makeScan();
    const result = generateSecurityPolicy(scan, {
      companyName: "TestCo",
      contactEmail: "hello@testco.com",
      securityEmail: "sec@testco.com",
    });
    assert.ok(result.includes("## Contact"));
    assert.ok(result.includes("sec@testco.com"));
  });

  it("includes Codepliant disclaimer with project name", () => {
    const scan = makeScan({ projectName: "my-app" });
    const result = generateSecurityPolicy(scan);
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("my-app"));
    assert.ok(result.includes("reviewed and customized"));
  });

  it("returns a string (never null)", () => {
    const scan = makeScan();
    const result = generateSecurityPolicy(scan);
    assert.strictEqual(typeof result, "string");
    assert.ok(result.length > 0);
  });
});
