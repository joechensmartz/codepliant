import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateRefundPolicy } from "./refund-policy.js";

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

describe("generateRefundPolicy", () => {
  it("returns null when no payment services detected", () => {
    const scan = makeScan();
    const result = generateRefundPolicy(scan);
    assert.strictEqual(result, null);
  });

  it("returns null when only non-payment services present", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateRefundPolicy(scan);
    assert.strictEqual(result, null);
  });

  it("generates policy when payment service detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment information"])],
    });
    const result = generateRefundPolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Refund Policy"));
  });

  it("includes effective date and project name", () => {
    const scan = makeScan({
      projectName: "my-store",
      services: [makeService("stripe", "payment")],
    });
    const result = generateRefundPolicy(scan)!;
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(`**Effective Date:** ${today}`));
    assert.ok(result.includes(`**Last Updated:** ${today}`));
    assert.ok(result.includes("**Project:** my-store"));
  });

  it("uses default placeholders when no context provided", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateRefundPolicy(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
    assert.ok(result.includes("[https://yoursite.com]"));
    assert.ok(result.includes("[Your Jurisdiction]"));
  });

  it("uses context values when provided", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateRefundPolicy(scan, {
      companyName: "ShopCo",
      contactEmail: "billing@shopco.com",
      website: "https://shopco.com",
      jurisdiction: "State of California",
    })!;
    assert.ok(result.includes("ShopCo"));
    assert.ok(result.includes("billing@shopco.com"));
    assert.ok(result.includes("https://shopco.com"));
    assert.ok(result.includes("State of California"));
  });

  it("includes payment provider names in overview", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("paypal", "payment"),
      ],
    });
    const result = generateRefundPolicy(scan)!;
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("paypal"));
  });

  it("includes subscription refund terms", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateRefundPolicy(scan)!;
    assert.ok(result.includes("Monthly subscriptions"));
    assert.ok(result.includes("Annual subscriptions"));
    assert.ok(result.includes("Free trial conversions"));
    assert.ok(result.includes("14 days"));
    assert.ok(result.includes("30 days"));
    assert.ok(result.includes("pro-rata"));
  });

  it("includes one-time purchase terms", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateRefundPolicy(scan)!;
    assert.ok(result.includes("One-Time Purchases"));
    assert.ok(result.includes("Digital goods"));
  });

  it("includes non-refundable items section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateRefundPolicy(scan)!;
    assert.ok(result.includes("Non-Refundable Items"));
    assert.ok(result.includes("Setup fees"));
    assert.ok(result.includes("Custom development"));
    assert.ok(result.includes("Domain registrations"));
    assert.ok(result.includes("Terms of Service"));
  });

  it("includes refund process with how to request", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateRefundPolicy(scan, {
      companyName: "TestCo",
      contactEmail: "support@testco.com",
    })!;
    assert.ok(result.includes("How to Request a Refund"));
    assert.ok(result.includes("support@testco.com"));
    assert.ok(result.includes("Refund Request"));
  });

  it("includes required information for refund requests", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateRefundPolicy(scan)!;
    assert.ok(result.includes("Required Information"));
    assert.ok(result.includes("Order or transaction ID"));
    assert.ok(result.includes("Date of purchase"));
  });

  it("includes review process timeline table", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateRefundPolicy(scan)!;
    assert.ok(result.includes("Review Process"));
    assert.ok(result.includes("Acknowledgment"));
    assert.ok(result.includes("1 business day"));
    assert.ok(result.includes("3-5 business days"));
  });

  it("includes refund timeline by payment method", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateRefundPolicy(scan)!;
    assert.ok(result.includes("Refund Timeline"));
    assert.ok(result.includes("Credit/Debit Card"));
    assert.ok(result.includes("Bank Transfer"));
    assert.ok(result.includes("PayPal / Digital Wallet"));
    assert.ok(result.includes("Cryptocurrency"));
  });

  it("includes partial refunds section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateRefundPolicy(scan)!;
    assert.ok(result.includes("Partial Refunds"));
    assert.ok(result.includes("unused portion"));
  });

  it("includes chargebacks and disputes section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateRefundPolicy(scan)!;
    assert.ok(result.includes("Chargebacks and Disputes"));
    assert.ok(result.includes("suspended pending resolution"));
  });

  it("includes cancellation vs refund distinction", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateRefundPolicy(scan)!;
    assert.ok(result.includes("Cancellation vs. Refund"));
    assert.ok(result.includes("stops future billing"));
    assert.ok(result.includes("returns money"));
  });

  it("includes consumer protection rights with jurisdiction", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateRefundPolicy(scan, {
      companyName: "EUShop",
      contactEmail: "info@eushop.com",
      jurisdiction: "European Union",
    })!;
    assert.ok(result.includes("Consumer Protection Rights"));
    assert.ok(result.includes("European Union"));
    assert.ok(result.includes("Consumer Rights Directive"));
  });

  it("includes exceptions section with company name", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateRefundPolicy(scan, {
      companyName: "MyCo",
      contactEmail: "test@myco.com",
    })!;
    assert.ok(result.includes("Exceptions and Special Circumstances"));
    assert.ok(result.includes("MyCo"));
    assert.ok(result.includes("Billing errors"));
  });

  it("includes changes to policy section with website", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateRefundPolicy(scan, {
      companyName: "TestCo",
      contactEmail: "test@testco.com",
      website: "https://testco.com",
    })!;
    assert.ok(result.includes("Changes to This Policy"));
    assert.ok(result.includes("https://testco.com"));
  });

  it("numbers sections sequentially", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateRefundPolicy(scan)!;
    assert.ok(result.includes("## 1. Overview"));
    assert.ok(result.includes("## 2. Eligibility for Refunds"));
    assert.ok(result.includes("## 3. Refund Process"));
    assert.ok(result.includes("## 4. Refund Timeline"));
  });

  it("includes Codepliant disclaimer with project name", () => {
    const scan = makeScan({
      projectName: "web-store",
      services: [makeService("stripe", "payment")],
    });
    const result = generateRefundPolicy(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("web-store"));
    assert.ok(result.includes("reviewed by legal counsel"));
  });

  it("includes contact section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateRefundPolicy(scan, {
      companyName: "TestCo",
      contactEmail: "refunds@testco.com",
    })!;
    assert.ok(result.includes("Contact"));
    assert.ok(result.includes("refunds@testco.com"));
  });
});
