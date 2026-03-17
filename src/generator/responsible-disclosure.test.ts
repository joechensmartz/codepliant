import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateResponsibleDisclosurePolicy } from "./responsible-disclosure.js";

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

describe("generateResponsibleDisclosurePolicy", () => {
  it("returns null when no security-relevant services and fewer than 2 services", () => {
    const scan = makeScan({
      services: [makeService("some-analytics", "analytics")],
    });
    const result = generateResponsibleDisclosurePolicy(scan);
    assert.strictEqual(result, null);
  });

  it("returns null when no services at all", () => {
    const scan = makeScan();
    const result = generateResponsibleDisclosurePolicy(scan);
    assert.strictEqual(result, null);
  });

  it("generates when auth service is detected", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateResponsibleDisclosurePolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Responsible Disclosure Policy"));
  });

  it("generates when payment service is detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateResponsibleDisclosurePolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Responsible Disclosure Policy"));
  });

  it("generates when database service is detected", () => {
    const scan = makeScan({
      services: [makeService("prisma", "database")],
    });
    const result = generateResponsibleDisclosurePolicy(scan);
    assert.ok(result !== null);
  });

  it("generates when monitoring service is detected", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generateResponsibleDisclosurePolicy(scan);
    assert.ok(result !== null);
  });

  it("generates when storage service is detected", () => {
    const scan = makeScan({
      services: [makeService("aws-s3", "storage")],
    });
    const result = generateResponsibleDisclosurePolicy(scan);
    assert.ok(result !== null);
  });

  it("generates when 2+ non-security-relevant services are present", () => {
    const scan = makeScan({
      services: [
        makeService("analytics-1", "analytics"),
        makeService("analytics-2", "analytics"),
      ],
    });
    const result = generateResponsibleDisclosurePolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Responsible Disclosure Policy"));
  });

  it("includes header with dates, organization, and project", () => {
    const scan = makeScan({
      projectName: "my-app",
      services: [makeService("next-auth", "auth")],
    });
    const result = generateResponsibleDisclosurePolicy(scan, {
      companyName: "Acme Corp",
      contactEmail: "info@acme.com",
    });
    assert.ok(result !== null);
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(`**Effective Date:** ${today}`));
    assert.ok(result.includes(`**Last Updated:** ${today}`));
    assert.ok(result.includes("**Organization:** Acme Corp"));
    assert.ok(result.includes("**Project:** my-app"));
  });

  it("uses default placeholders when no context provided", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateResponsibleDisclosurePolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
    assert.ok(result.includes("[https://yoursite.com]"));
  });

  it("uses context values when provided", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateResponsibleDisclosurePolicy(scan, {
      companyName: "TestCo",
      contactEmail: "hello@testco.com",
      website: "https://testco.com",
    });
    assert.ok(result !== null);
    assert.ok(result.includes("TestCo"));
    assert.ok(result.includes("hello@testco.com"));
    assert.ok(result.includes("https://testco.com"));
  });

  it("uses securityEmail when provided", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateResponsibleDisclosurePolicy(scan, {
      companyName: "TestCo",
      contactEmail: "hello@testco.com",
      securityEmail: "sec@testco.com",
    });
    assert.ok(result !== null);
    assert.ok(result.includes("sec@testco.com"));
  });

  it("derives securityEmail from contactEmail domain when not provided", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateResponsibleDisclosurePolicy(scan, {
      companyName: "TestCo",
      contactEmail: "hello@testco.com",
    });
    assert.ok(result !== null);
    assert.ok(result.includes("security@testco.com"));
  });

  it("includes Introduction section", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateResponsibleDisclosurePolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("## 1. Introduction"));
    assert.ok(result.includes("security of our systems"));
    assert.ok(result.includes("responsible disclosure"));
  });

  it("includes Scope section with in-scope and out-of-scope", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateResponsibleDisclosurePolicy(scan, {
      companyName: "TestCo",
      contactEmail: "info@testco.com",
      website: "https://testco.com",
    });
    assert.ok(result !== null);
    assert.ok(result.includes("## 2. Scope"));
    assert.ok(result.includes("In Scope"));
    assert.ok(result.includes("Out of Scope"));
    assert.ok(result.includes("https://testco.com"));
    assert.ok(result.includes("Social engineering"));
    assert.ok(result.includes("Denial of service"));
  });

  it("includes auth services in scope table when detected", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateResponsibleDisclosurePolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Authentication system"));
    assert.ok(result.includes("next-auth"));
    assert.ok(result.includes("Auth Infrastructure"));
  });

  it("includes payment services in scope table when detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateResponsibleDisclosurePolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Payment processing"));
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("Payment Infrastructure"));
  });

  it("includes storage/database services in scope table when detected", () => {
    const scan = makeScan({
      services: [makeService("prisma", "database")],
    });
    const result = generateResponsibleDisclosurePolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Data storage"));
    assert.ok(result.includes("prisma"));
    assert.ok(result.includes("Data Infrastructure"));
  });

  it("excludes service-specific scope rows when those categories are absent", () => {
    const scan = makeScan({
      services: [
        makeService("analytics-1", "analytics"),
        makeService("analytics-2", "analytics"),
      ],
    });
    const result = generateResponsibleDisclosurePolicy(scan);
    assert.ok(result !== null);
    assert.ok(!result.includes("Authentication system"));
    assert.ok(!result.includes("Payment processing"));
    assert.ok(!result.includes("Data storage"));
  });

  it("includes How to Report section", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateResponsibleDisclosurePolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("## 3. How to Report"));
    assert.ok(result.includes("Reporting Channel"));
    assert.ok(result.includes("Required Information"));
    assert.ok(result.includes("Encryption"));
    assert.ok(result.includes("PGP"));
  });

  it("includes bugBountyUrl in reporting section when provided", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateResponsibleDisclosurePolicy(scan, {
      companyName: "TestCo",
      contactEmail: "info@testco.com",
      bugBountyUrl: "https://hackerone.com/testco",
    });
    assert.ok(result !== null);
    assert.ok(result.includes("https://hackerone.com/testco"));
    assert.ok(result.includes("bug bounty program"));
  });

  it("excludes bugBountyUrl mention when not provided", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateResponsibleDisclosurePolicy(scan, {
      companyName: "TestCo",
      contactEmail: "info@testco.com",
    });
    assert.ok(result !== null);
    assert.ok(!result.includes("Bug Bounty Program"));
  });

  it("includes Vulnerability Categories section with CVSS table", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateResponsibleDisclosurePolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("## 4. Vulnerability Categories"));
    assert.ok(result.includes("CVSS"));
    assert.ok(result.includes("Critical"));
    assert.ok(result.includes("High"));
    assert.ok(result.includes("Medium"));
    assert.ok(result.includes("Low"));
  });

  it("includes Priority Areas when security-relevant services detected", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
        makeService("prisma", "database"),
      ],
    });
    const result = generateResponsibleDisclosurePolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Priority Areas"));
    assert.ok(result.includes("Authentication & Authorization"));
    assert.ok(result.includes("Payment Security"));
    assert.ok(result.includes("Data Storage"));
  });

  it("excludes Priority Areas when no auth/payment/storage services", () => {
    const scan = makeScan({
      services: [
        makeService("analytics-1", "analytics"),
        makeService("analytics-2", "analytics"),
      ],
    });
    const result = generateResponsibleDisclosurePolicy(scan);
    assert.ok(result !== null);
    assert.ok(!result.includes("Priority Areas"));
  });

  it("includes Safe Harbor section", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateResponsibleDisclosurePolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("## 5. Safe Harbor"));
    assert.ok(result.includes("Not pursue legal action"));
    assert.ok(result.includes("Researcher Obligations"));
    assert.ok(result.includes("good faith"));
  });

  it("includes Response Timeline section", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateResponsibleDisclosurePolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("## 6. Response Timeline"));
    assert.ok(result.includes("Acknowledgment"));
    assert.ok(result.includes("24 hours"));
    assert.ok(result.includes("Initial Assessment"));
    assert.ok(result.includes("3 business days"));
    assert.ok(result.includes("Resolution Target"));
  });

  it("includes Bug Bounty section with reward table when bugBountyUrl provided", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateResponsibleDisclosurePolicy(scan, {
      companyName: "TestCo",
      contactEmail: "info@testco.com",
      bugBountyUrl: "https://hackerone.com/testco",
    });
    assert.ok(result !== null);
    assert.ok(result.includes("Bug Bounty Program"));
    assert.ok(result.includes("$500 - $5,000"));
    assert.ok(result.includes("$200 - $1,000"));
    assert.ok(result.includes("$50 - $200"));
    assert.ok(result.includes("Recognition"));
  });

  it("includes Recognition section", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateResponsibleDisclosurePolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Recognition & Hall of Fame"));
    assert.ok(result.includes("publicly acknowledge"));
  });

  it("includes Contact section", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateResponsibleDisclosurePolicy(scan, {
      companyName: "TestCo",
      contactEmail: "hello@testco.com",
      securityEmail: "sec@testco.com",
    });
    assert.ok(result !== null);
    assert.ok(result.includes("sec@testco.com"));
    assert.ok(result.includes("hello@testco.com"));
  });

  it("includes bugBountyUrl in contact section when provided", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateResponsibleDisclosurePolicy(scan, {
      companyName: "TestCo",
      contactEmail: "info@testco.com",
      bugBountyUrl: "https://hackerone.com/testco",
    });
    assert.ok(result !== null);
    // Contact section should reference bug bounty
    const contactIdx = result.lastIndexOf("## ");
    const contactSection = result.slice(contactIdx);
    assert.ok(contactSection.includes("https://hackerone.com/testco"));
  });

  it("includes disclose.io disclaimer", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateResponsibleDisclosurePolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("disclose.io"));
    assert.ok(result.includes("Generated by Codepliant"));
  });

  it("numbers sections sequentially without bug bounty", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateResponsibleDisclosurePolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("## 1. Introduction"));
    assert.ok(result.includes("## 2. Scope"));
    assert.ok(result.includes("## 3. How to Report"));
    assert.ok(result.includes("## 4. Vulnerability Categories"));
    assert.ok(result.includes("## 5. Safe Harbor"));
    assert.ok(result.includes("## 6. Response Timeline"));
    assert.ok(result.includes("## 7. Recognition"));
    assert.ok(result.includes("## 8. Contact"));
  });

  it("numbers sections sequentially with bug bounty", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateResponsibleDisclosurePolicy(scan, {
      companyName: "TestCo",
      contactEmail: "info@testco.com",
      bugBountyUrl: "https://hackerone.com/testco",
    });
    assert.ok(result !== null);
    assert.ok(result.includes("## 7. Bug Bounty Program"));
    assert.ok(result.includes("## 8. Recognition"));
    assert.ok(result.includes("## 9. Contact"));
  });

  it("combines multiple service types in scope", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
        makeService("prisma", "database"),
        makeService("sentry", "monitoring"),
      ],
    });
    const result = generateResponsibleDisclosurePolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Authentication system"));
    assert.ok(result.includes("Payment processing"));
    assert.ok(result.includes("Data storage"));
  });
});
