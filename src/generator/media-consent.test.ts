import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateMediaConsentForm } from "./media-consent.js";

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

describe("generateMediaConsentForm", () => {
  it("returns null when no storage services detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateMediaConsentForm(scan);
    assert.strictEqual(result, null);
  });

  it("returns null when no services at all", () => {
    const scan = makeScan();
    const result = generateMediaConsentForm(scan);
    assert.strictEqual(result, null);
  });

  it("generates a form when a storage service is detected", () => {
    const scan = makeScan({
      services: [makeService("aws-s3", "storage")],
    });
    const result = generateMediaConsentForm(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Media Consent Form"));
  });

  it("includes company name in header", () => {
    const scan = makeScan({
      services: [makeService("aws-s3", "storage")],
    });
    const result = generateMediaConsentForm(scan, {
      companyName: "Acme Corp",
      contactEmail: "info@acme.com",
    });
    assert.ok(result !== null);
    assert.ok(result.includes("**Acme Corp** — Media Usage Consent"));
  });

  it("includes effective date", () => {
    const scan = makeScan({
      services: [makeService("aws-s3", "storage")],
    });
    const result = generateMediaConsentForm(scan);
    assert.ok(result !== null);
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(`**Effective Date:** ${today}`));
  });

  it("uses default placeholders when no context provided", () => {
    const scan = makeScan({
      services: [makeService("aws-s3", "storage")],
    });
    const result = generateMediaConsentForm(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
    assert.ok(result.includes("[https://yoursite.com]"));
  });

  it("uses context values when provided", () => {
    const scan = makeScan({
      services: [makeService("aws-s3", "storage")],
    });
    const result = generateMediaConsentForm(scan, {
      companyName: "TestCo",
      contactEmail: "contact@testco.com",
      website: "https://testco.com",
    });
    assert.ok(result !== null);
    assert.ok(result.includes("TestCo"));
    assert.ok(result.includes("contact@testco.com"));
    assert.ok(result.includes("https://testco.com"));
  });

  it("uses dpoEmail when provided", () => {
    const scan = makeScan({
      services: [makeService("aws-s3", "storage")],
    });
    const result = generateMediaConsentForm(scan, {
      companyName: "TestCo",
      contactEmail: "contact@testco.com",
      dpoEmail: "dpo@testco.com",
    });
    assert.ok(result !== null);
    assert.ok(result.includes("dpo@testco.com"));
  });

  it("falls back to contactEmail when dpoEmail not provided", () => {
    const scan = makeScan({
      services: [makeService("aws-s3", "storage")],
    });
    const result = generateMediaConsentForm(scan, {
      companyName: "TestCo",
      contactEmail: "contact@testco.com",
    });
    assert.ok(result !== null);
    // dpoEmail defaults to contactEmail
    assert.ok(result.includes("contact@testco.com"));
  });

  it("lists storage service names", () => {
    const scan = makeScan({
      services: [
        makeService("aws-s3", "storage"),
        makeService("cloudinary", "storage"),
      ],
    });
    const result = generateMediaConsentForm(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("**Storage Services Used:** aws-s3, cloudinary"));
  });

  it("includes Introduction section", () => {
    const scan = makeScan({
      services: [makeService("aws-s3", "storage")],
    });
    const result = generateMediaConsentForm(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("## 1. Introduction"));
    assert.ok(result.includes("photographs, videos, audio recordings"));
  });

  it("includes Types of Media Covered section", () => {
    const scan = makeScan({
      services: [makeService("aws-s3", "storage")],
    });
    const result = generateMediaConsentForm(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("## 2. Types of Media Covered"));
    assert.ok(result.includes("Photographs"));
    assert.ok(result.includes("Videos"));
    assert.ok(result.includes("Audio"));
    assert.ok(result.includes("Documents"));
  });

  it("includes Purpose of Collection section with checkboxes", () => {
    const scan = makeScan({
      services: [makeService("aws-s3", "storage")],
    });
    const result = generateMediaConsentForm(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("## 3. Purpose of Collection and Use"));
    assert.ok(result.includes("Service Delivery"));
    assert.ok(result.includes("Marketing and Promotion"));
    assert.ok(result.includes("Testimonials"));
  });

  it("includes Consent Declaration section", () => {
    const scan = makeScan({
      services: [makeService("aws-s3", "storage")],
    });
    const result = generateMediaConsentForm(scan, {
      companyName: "TestCo",
      contactEmail: "info@testco.com",
    });
    assert.ok(result !== null);
    assert.ok(result.includes("## 4. Consent Declaration"));
    assert.ok(result.includes("non-exclusive, royalty-free license"));
    assert.ok(result.includes("TestCo"));
  });

  it("includes Specific Permissions table", () => {
    const scan = makeScan({
      services: [makeService("aws-s3", "storage")],
    });
    const result = generateMediaConsentForm(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("## 5. Specific Permissions"));
    assert.ok(result.includes("Use within the application"));
    assert.ok(result.includes("Display on our website"));
    assert.ok(result.includes("Use in marketing/advertising"));
  });

  it("includes Duration of Consent section", () => {
    const scan = makeScan({
      services: [makeService("aws-s3", "storage")],
    });
    const result = generateMediaConsentForm(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("## 6. Duration of Consent"));
    assert.ok(result.includes("Indefinitely"));
  });

  it("includes Your Rights section", () => {
    const scan = makeScan({
      services: [makeService("aws-s3", "storage")],
    });
    const result = generateMediaConsentForm(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("## 7. Your Rights"));
    assert.ok(result.includes("Right to Withdraw Consent"));
    assert.ok(result.includes("Right to Access"));
    assert.ok(result.includes("Right to Deletion"));
    assert.ok(result.includes("Right to Restrict Processing"));
  });

  it("includes Minors section", () => {
    const scan = makeScan({
      services: [makeService("aws-s3", "storage")],
    });
    const result = generateMediaConsentForm(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("## 8. Minors"));
    assert.ok(result.includes("parent or legal guardian"));
  });

  it("includes Data Protection section with website link", () => {
    const scan = makeScan({
      services: [makeService("aws-s3", "storage")],
    });
    const result = generateMediaConsentForm(scan, {
      companyName: "TestCo",
      contactEmail: "info@testco.com",
      website: "https://testco.com",
    });
    assert.ok(result !== null);
    assert.ok(result.includes("## 9. Data Protection"));
    assert.ok(result.includes("Encryption in transit"));
    assert.ok(result.includes("https://testco.com/privacy"));
  });

  it("includes Signature section with tables", () => {
    const scan = makeScan({
      services: [makeService("aws-s3", "storage")],
    });
    const result = generateMediaConsentForm(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("## 10. Signature"));
    assert.ok(result.includes("Full Name"));
    assert.ok(result.includes("Parent/Guardian Name"));
  });

  it("includes Contact section", () => {
    const scan = makeScan({
      services: [makeService("aws-s3", "storage")],
    });
    const result = generateMediaConsentForm(scan, {
      companyName: "TestCo",
      contactEmail: "hello@testco.com",
      website: "https://testco.com",
    });
    assert.ok(result !== null);
    assert.ok(result.includes("## 11. Contact"));
    assert.ok(result.includes("hello@testco.com"));
    assert.ok(result.includes("https://testco.com"));
  });

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({
      services: [makeService("aws-s3", "storage")],
    });
    const result = generateMediaConsentForm(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("auto-generated"));
  });

  it("ignores non-storage services for the storage check", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateMediaConsentForm(scan);
    assert.strictEqual(result, null);
  });

  it("generates when storage is present alongside other services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("aws-s3", "storage"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateMediaConsentForm(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Media Consent Form"));
    // Only storage service names listed
    assert.ok(result.includes("aws-s3"));
  });
});
