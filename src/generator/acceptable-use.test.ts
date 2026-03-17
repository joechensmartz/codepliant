import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateAcceptableUsePolicy } from "./acceptable-use.js";

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

describe("generateAcceptableUsePolicy", () => {
  it("generates a basic AUP with no services", () => {
    const scan = makeScan();
    const result = generateAcceptableUsePolicy(scan);
    assert.ok(result.includes("# Acceptable Use Policy"));
    assert.ok(result.includes("Prohibited Uses"));
    assert.ok(result.includes("Resource Usage"));
    assert.ok(result.includes("Account Responsibilities"));
    assert.ok(result.includes("Monitoring and Enforcement"));
  });

  it("includes effective date and project name", () => {
    const scan = makeScan({ projectName: "my-saas" });
    const result = generateAcceptableUsePolicy(scan);
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(`**Effective Date:** ${today}`));
    assert.ok(result.includes(`**Last Updated:** ${today}`));
    assert.ok(result.includes("**Project:** my-saas"));
  });

  it("uses default placeholders when no context provided", () => {
    const scan = makeScan();
    const result = generateAcceptableUsePolicy(scan);
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
    assert.ok(result.includes("[https://yoursite.com]"));
  });

  it("uses context values when provided", () => {
    const scan = makeScan();
    const result = generateAcceptableUsePolicy(scan, {
      companyName: "Acme Corp",
      contactEmail: "legal@acme.com",
      website: "https://acme.com",
    });
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("legal@acme.com"));
    assert.ok(result.includes("https://acme.com"));
  });

  it("includes standard prohibited use subsections", () => {
    const scan = makeScan();
    const result = generateAcceptableUsePolicy(scan);
    assert.ok(result.includes("Illegal or Harmful Activities"));
    assert.ok(result.includes("Abusive or Disruptive Behavior"));
    assert.ok(result.includes("Spam and Unsolicited Communications"));
    assert.ok(result.includes("Intellectual Property Violations"));
    assert.ok(result.includes("Content Restrictions"));
  });

  it("includes AI-specific restrictions when AI service detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAcceptableUsePolicy(scan);
    assert.ok(result.includes("AI-Specific Restrictions"));
    assert.ok(result.includes("Prompt injection") || result.includes("reverse-engineer"));
    assert.ok(result.includes("disinformation at scale"));
    assert.ok(result.includes("human oversight"));
  });

  it("excludes AI-specific restrictions when no AI service", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateAcceptableUsePolicy(scan);
    assert.ok(!result.includes("AI-Specific Restrictions"));
  });

  it("includes Storage restrictions when storage service detected", () => {
    const scan = makeScan({
      services: [makeService("aws-s3", "storage", ["files"])],
    });
    const result = generateAcceptableUsePolicy(scan);
    assert.ok(result.includes("Storage Restrictions"));
    assert.ok(result.includes("pirated content"));
    assert.ok(result.includes("malicious files"));
    assert.ok(result.includes("storage quotas"));
  });

  it("excludes Storage restrictions when no storage service", () => {
    const scan = makeScan();
    const result = generateAcceptableUsePolicy(scan);
    assert.ok(!result.includes("Storage Restrictions"));
  });

  it("includes Payment restrictions when payment service detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment information"])],
    });
    const result = generateAcceptableUsePolicy(scan);
    assert.ok(result.includes("Payment and Financial Restrictions"));
    assert.ok(result.includes("fraudulent transactions"));
    assert.ok(result.includes("friendly fraud"));
    assert.ok(result.includes("stolen financial credentials"));
  });

  it("excludes Payment restrictions when no payment service", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateAcceptableUsePolicy(scan);
    assert.ok(!result.includes("Payment and Financial Restrictions"));
  });

  it("includes all conditional sections when all service types present", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("aws-s3", "storage"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateAcceptableUsePolicy(scan);
    assert.ok(result.includes("AI-Specific Restrictions"));
    assert.ok(result.includes("Storage Restrictions"));
    assert.ok(result.includes("Payment and Financial Restrictions"));
  });

  it("numbers sections sequentially", () => {
    const scan = makeScan();
    const result = generateAcceptableUsePolicy(scan);
    assert.ok(result.includes("## 1. Introduction"));
    assert.ok(result.includes("## 2. Prohibited Uses"));
    assert.ok(result.includes("## 3. Resource Usage"));
    assert.ok(result.includes("## 4. Account Responsibilities"));
    assert.ok(result.includes("## 5. Monitoring and Enforcement"));
  });

  it("includes enforcement actions table", () => {
    const scan = makeScan();
    const result = generateAcceptableUsePolicy(scan);
    assert.ok(result.includes("Enforcement Actions"));
    assert.ok(result.includes("Minor"));
    assert.ok(result.includes("Moderate"));
    assert.ok(result.includes("Severe"));
    assert.ok(result.includes("Critical"));
  });

  it("includes appeals section with email", () => {
    const scan = makeScan();
    const result = generateAcceptableUsePolicy(scan, {
      companyName: "TestCo",
      contactEmail: "support@testco.com",
    });
    assert.ok(result.includes("Appeals"));
    assert.ok(result.includes("support@testco.com"));
    assert.ok(result.includes("5 business days"));
  });

  it("includes Reporting Abuse section", () => {
    const scan = makeScan();
    const result = generateAcceptableUsePolicy(scan);
    assert.ok(result.includes("Reporting Abuse"));
    assert.ok(result.includes("AUP Violation Report"));
  });

  it("includes Changes to This Policy section", () => {
    const scan = makeScan();
    const result = generateAcceptableUsePolicy(scan);
    assert.ok(result.includes("Changes to This Policy"));
  });

  it("includes Contact section", () => {
    const scan = makeScan();
    const result = generateAcceptableUsePolicy(scan, {
      companyName: "TestCo",
      contactEmail: "hello@testco.com",
    });
    assert.ok(result.includes("## 8. Contact") || result.includes("Contact"));
    assert.ok(result.includes("hello@testco.com"));
  });

  it("includes Codepliant disclaimer with project name", () => {
    const scan = makeScan({ projectName: "cool-app" });
    const result = generateAcceptableUsePolicy(scan);
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("cool-app"));
    assert.ok(result.includes("reviewed by legal counsel"));
  });

  it("returns a string (never null)", () => {
    const scan = makeScan();
    const result = generateAcceptableUsePolicy(scan);
    assert.strictEqual(typeof result, "string");
    assert.ok(result.length > 0);
  });

  it("adjusts subsection numbering when AI present but not storage", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateAcceptableUsePolicy(scan);
    // AI section is 2.6, payment should be 2.7 (no storage)
    assert.ok(result.includes("2.6 AI-Specific Restrictions"));
    assert.ok(result.includes("2.7 Payment and Financial Restrictions"));
  });

  it("adjusts subsection numbering when storage present but not AI", () => {
    const scan = makeScan({
      services: [
        makeService("aws-s3", "storage"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateAcceptableUsePolicy(scan);
    // No AI so storage is 2.6, payment is 2.7
    assert.ok(result.includes("2.6 Storage Restrictions"));
    assert.ok(result.includes("2.7 Payment and Financial Restrictions"));
  });

  it("adjusts subsection numbering when all three conditional sections present", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("aws-s3", "storage"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateAcceptableUsePolicy(scan);
    assert.ok(result.includes("2.6 AI-Specific Restrictions"));
    assert.ok(result.includes("2.7 Storage Restrictions"));
    assert.ok(result.includes("2.8 Payment and Financial Restrictions"));
  });
});
