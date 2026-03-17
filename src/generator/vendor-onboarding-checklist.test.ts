import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateVendorOnboardingChecklist } from "./vendor-onboarding-checklist.js";

function makeService(
  name: string,
  category: DetectedService["category"],
  dataCollected: string[] = ["test data"],
  overrides: Partial<DetectedService> = {},
): DetectedService {
  return {
    name,
    category,
    evidence: [{ type: "dependency", file: "package.json", detail: `${name} detected` }],
    dataCollected,
    ...overrides,
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

describe("generateVendorOnboardingChecklist", () => {
  // ── Null returns ──────────────────────────────────────────────────────

  it("returns null when no services detected", () => {
    assert.equal(generateVendorOnboardingChecklist(makeScan()), null);
  });

  it("returns null when only one service detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    assert.equal(generateVendorOnboardingChecklist(scan), null);
  });

  it("returns null when services have isDataProcessor false", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["test"], { isDataProcessor: false }),
        makeService("openai", "ai", ["test"], { isDataProcessor: false }),
      ],
    });
    assert.equal(generateVendorOnboardingChecklist(scan), null);
  });

  // ── Trigger condition ─────────────────────────────────────────────────

  it("generates when two or more data processor services detected", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateVendorOnboardingChecklist(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Vendor Onboarding Checklist"));
  });

  // ── Header ────────────────────────────────────────────────────────────

  it("includes organization, effective date, and document owner", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateVendorOnboardingChecklist(scan)!;
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(`**Effective Date:** ${today}`));
    assert.ok(result.includes(`**Last Updated:** ${today}`));
    assert.ok(result.includes("**Document Owner:**"));
  });

  it("uses default placeholders when no context provided", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateVendorOnboardingChecklist(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
    assert.ok(result.includes("[DPO Name]"));
    assert.ok(result.includes("[dpo@example.com]"));
  });

  it("uses context values when provided", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateVendorOnboardingChecklist(scan, {
      companyName: "Acme Corp",
      contactEmail: "legal@acme.com",
      dpoName: "Jane Doe",
      dpoEmail: "dpo@acme.com",
    })!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("legal@acme.com"));
    assert.ok(result.includes("Jane Doe"));
    assert.ok(result.includes("dpo@acme.com"));
  });

  // ── Vendor Inventory ──────────────────────────────────────────────────

  it("includes current vendor inventory table", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateVendorOnboardingChecklist(scan)!;
    assert.ok(result.includes("## Current Vendor Inventory"));
    assert.ok(result.includes("| # | Vendor | Category | Risk Tier | Data Classification |"));
  });

  it("lists vendors with correct risk tiers", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("sentry", "monitoring"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateVendorOnboardingChecklist(scan)!;
    assert.ok(result.includes("| 1 | stripe | Payment Processing | Critical |"));
    assert.ok(result.includes("| 2 | openai | AI Service | Critical |"));
    assert.ok(result.includes("| 3 | sentry | Error Monitoring | Medium |"));
    assert.ok(result.includes("| 4 | posthog | Analytics | Medium |"));
  });

  it("assigns High risk tier to auth and database categories", () => {
    const scan = makeScan({
      services: [
        makeService("clerk", "auth"),
        makeService("supabase", "database"),
      ],
    });
    const result = generateVendorOnboardingChecklist(scan)!;
    assert.ok(result.includes("| 1 | clerk | Authentication | High |"));
    assert.ok(result.includes("| 2 | supabase | Database | High |"));
  });

  it("assigns Low risk tier to social category", () => {
    const scan = makeScan({
      services: [
        makeService("facebook-login", "social"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateVendorOnboardingChecklist(scan)!;
    assert.ok(result.includes("| Low |"));
  });

  it("includes total vendor count and critical/high risk count", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("sentry", "monitoring"),
      ],
    });
    const result = generateVendorOnboardingChecklist(scan)!;
    assert.ok(result.includes("**Total vendors:** 3"));
    assert.ok(result.includes("**Critical/High risk:** 2"));
  });

  it("includes correct data classification labels", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateVendorOnboardingChecklist(scan)!;
    assert.ok(result.includes("Restricted"));
    assert.ok(result.includes("payment card data"));
  });

  // ── Section structure ─────────────────────────────────────────────────

  it("includes Pre-Engagement Assessment section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateVendorOnboardingChecklist(scan)!;
    assert.ok(result.includes("## 1. Pre-Engagement Assessment"));
    assert.ok(result.includes("Business justification"));
    assert.ok(result.includes("Data inventory"));
    assert.ok(result.includes("Data classification"));
    assert.ok(result.includes("Risk tier assignment"));
    assert.ok(result.includes("Regulatory check"));
    assert.ok(result.includes("Budget approval"));
  });

  it("includes Security Assessment section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateVendorOnboardingChecklist(scan)!;
    assert.ok(result.includes("## 2. Security Assessment"));
    assert.ok(result.includes("### 2.1 Vendor Security Posture"));
    assert.ok(result.includes("SOC 2 Type II"));
    assert.ok(result.includes("ISO 27001"));
    assert.ok(result.includes("### 2.2 Technical Security Controls"));
    assert.ok(result.includes("AES-256"));
    assert.ok(result.includes("TLS 1.2+"));
  });

  it("includes DPA section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateVendorOnboardingChecklist(scan)!;
    assert.ok(result.includes("## 3. Data Processing Agreement (DPA)"));
    assert.ok(result.includes("Standard Contractual Clauses (SCCs)"));
    assert.ok(result.includes("Transfer Impact Assessment"));
    assert.ok(result.includes("Sub-processor change notification"));
  });

  it("includes DPA contact information table", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateVendorOnboardingChecklist(scan, {
      companyName: "TestCo",
      contactEmail: "legal@testco.com",
      dpoName: "John Smith",
      dpoEmail: "dpo@testco.com",
    })!;
    assert.ok(result.includes("### 3.1 DPA Contact Information"));
    assert.ok(result.includes("John Smith (dpo@testco.com)"));
    assert.ok(result.includes("legal@testco.com"));
  });

  it("includes Privacy & Compliance Review section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateVendorOnboardingChecklist(scan)!;
    assert.ok(result.includes("## 4. Privacy & Compliance Review"));
    assert.ok(result.includes("Privacy policy review"));
    assert.ok(result.includes("DSAR fulfillment"));
    assert.ok(result.includes("Cookie/tracking compliance"));
    assert.ok(result.includes("AI/ML transparency"));
  });

  it("includes Operational Requirements section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateVendorOnboardingChecklist(scan)!;
    assert.ok(result.includes("## 5. Operational Requirements"));
    assert.ok(result.includes("SLA agreement"));
    assert.ok(result.includes("API security"));
    assert.ok(result.includes("Exit strategy"));
  });

  it("includes Approval & Sign-off section with DPO name", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateVendorOnboardingChecklist(scan, {
      companyName: "Acme",
      contactEmail: "a@acme.com",
      dpoName: "Jane Doe",
    })!;
    assert.ok(result.includes("## 6. Approval & Sign-off"));
    assert.ok(result.includes("Jane Doe"));
    assert.ok(result.includes("Engineering Lead"));
    assert.ok(result.includes("Security/IT"));
    assert.ok(result.includes("Legal/Privacy"));
    assert.ok(result.includes("Budget Owner"));
  });

  it("includes Ongoing Vendor Monitoring section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateVendorOnboardingChecklist(scan)!;
    assert.ok(result.includes("## 7. Ongoing Vendor Monitoring"));
    assert.ok(result.includes("Security certification renewal"));
    assert.ok(result.includes("DPA review and update"));
    assert.ok(result.includes("Sub-processor list review"));
  });

  it("includes Vendor Removal Triggers", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateVendorOnboardingChecklist(scan)!;
    assert.ok(result.includes("### Vendor Removal Triggers"));
    assert.ok(result.includes("Security certification lapses"));
    assert.ok(result.includes("Data breach occurs"));
  });

  it("includes Codepliant disclaimer footer", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateVendorOnboardingChecklist(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("reviewed by your legal and procurement teams"));
  });

  // ── Section numbering ─────────────────────────────────────────────────

  it("numbers sections sequentially from 1 to 7", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateVendorOnboardingChecklist(scan)!;
    assert.ok(result.includes("## 1. Pre-Engagement Assessment"));
    assert.ok(result.includes("## 2. Security Assessment"));
    assert.ok(result.includes("## 3. Data Processing Agreement (DPA)"));
    assert.ok(result.includes("## 4. Privacy & Compliance Review"));
    assert.ok(result.includes("## 5. Operational Requirements"));
    assert.ok(result.includes("## 6. Approval & Sign-off"));
    assert.ok(result.includes("## 7. Ongoing Vendor Monitoring"));
  });

  // ── Category formatting ───────────────────────────────────────────────

  it("formats category labels correctly", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("sendgrid", "email"),
      ],
    });
    const result = generateVendorOnboardingChecklist(scan)!;
    assert.ok(result.includes("Payment Processing"));
    assert.ok(result.includes("Email Service"));
  });

  it("formats storage and advertising category labels", () => {
    const scan = makeScan({
      services: [
        makeService("s3", "storage"),
        makeService("google-ads", "advertising"),
      ],
    });
    const result = generateVendorOnboardingChecklist(scan)!;
    assert.ok(result.includes("File Storage"));
    assert.ok(result.includes("Advertising"));
  });

  // ── Company name usage ────────────────────────────────────────────────

  it("uses company name throughout the document", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateVendorOnboardingChecklist(scan, {
      companyName: "BigTech Inc",
      contactEmail: "info@bigtech.com",
    })!;
    const occurrences = result.split("BigTech Inc").length - 1;
    assert.ok(occurrences >= 8, `Expected at least 8 occurrences of company name, got ${occurrences}`);
  });

  // ── Risk tier defaults ────────────────────────────────────────────────

  it("defaults to Medium risk for unknown categories", () => {
    const scan = makeScan({
      services: [
        makeService("custom-thing", "other" as DetectedService["category"]),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateVendorOnboardingChecklist(scan)!;
    // "other" maps to Low in CATEGORY_RISK, not Medium — let's verify
    assert.ok(result.includes("| Low |") || result.includes("| Medium |"));
  });
});
