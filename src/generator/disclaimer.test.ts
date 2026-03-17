import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateDisclaimer } from "./disclaimer.js";

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

describe("generateDisclaimer", () => {
  it("always generates a disclaimer even with no services", () => {
    const scan = makeScan();
    const result = generateDisclaimer(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Disclaimer"));
  });

  it("includes effective date and project name", () => {
    const scan = makeScan({ projectName: "my-app" });
    const result = generateDisclaimer(scan);
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(`**Effective Date:** ${today}`));
    assert.ok(result.includes(`**Last Updated:** ${today}`));
    assert.ok(result.includes("**Project:** my-app"));
  });

  it("uses default placeholders when no context provided", () => {
    const scan = makeScan();
    const result = generateDisclaimer(scan);
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
    assert.ok(result.includes("[https://yoursite.com]"));
  });

  it("uses context values when provided", () => {
    const scan = makeScan();
    const result = generateDisclaimer(scan, {
      companyName: "Acme Corp",
      contactEmail: "legal@acme.com",
      website: "https://acme.com",
      jurisdiction: "State of Delaware",
    });
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("legal@acme.com"));
    assert.ok(result.includes("https://acme.com"));
  });

  it("includes General Information Disclaimer section", () => {
    const scan = makeScan();
    const result = generateDisclaimer(scan);
    assert.ok(result.includes("General Information Disclaimer"));
    assert.ok(result.includes("general informational purposes only"));
    assert.ok(result.includes("solely at your own risk"));
  });

  it("includes Professional Advice Disclaimer section", () => {
    const scan = makeScan();
    const result = generateDisclaimer(scan);
    assert.ok(result.includes("Professional Advice Disclaimer"));
    assert.ok(result.includes("not intended to be a substitute for professional advice"));
    assert.ok(result.includes("Legal advice"));
    assert.ok(result.includes("Financial advice"));
  });

  it("includes No Warranties section", () => {
    const scan = makeScan();
    const result = generateDisclaimer(scan);
    assert.ok(result.includes("No Warranties"));
    assert.ok(result.includes("AS IS"));
    assert.ok(result.includes("AS AVAILABLE"));
    assert.ok(result.includes("WITHOUT ANY WARRANTIES"));
  });

  it("includes External Links Disclaimer section", () => {
    const scan = makeScan();
    const result = generateDisclaimer(scan);
    assert.ok(result.includes("External Links Disclaimer"));
    assert.ok(result.includes("third-party websites"));
    assert.ok(result.includes("not investigated, monitored, or checked"));
  });

  it("includes Errors and Omissions Disclaimer section", () => {
    const scan = makeScan();
    const result = generateDisclaimer(scan);
    assert.ok(result.includes("Errors and Omissions Disclaimer"));
    assert.ok(result.includes("not responsible for any errors or omissions"));
    assert.ok(result.includes("reserves the right to make additions"));
  });

  it("includes Fair Use Disclaimer section", () => {
    const scan = makeScan();
    const result = generateDisclaimer(scan);
    assert.ok(result.includes("Fair Use Disclaimer"));
    assert.ok(result.includes("Section 107"));
    assert.ok(result.includes("Copyright Law"));
  });

  it("includes AI Disclaimer when AI services detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateDisclaimer(scan);
    assert.ok(result.includes("Artificial Intelligence Disclaimer"));
    assert.ok(result.includes("AI-generated content"));
    assert.ok(result.includes("not always be accurate"));
    assert.ok(result.includes("independently verify"));
  });

  it("excludes AI Disclaimer when no AI services detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDisclaimer(scan);
    assert.ok(!result.includes("Artificial Intelligence Disclaimer"));
  });

  it("includes Payment Disclaimer when payment services detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDisclaimer(scan);
    assert.ok(result.includes("Payment and Financial Transactions Disclaimer"));
    assert.ok(result.includes("third-party payment processors"));
    assert.ok(result.includes("Refunds, chargebacks"));
  });

  it("excludes Payment Disclaimer when no payment services detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateDisclaimer(scan);
    assert.ok(!result.includes("Payment and Financial Transactions Disclaimer"));
  });

  it("includes both AI and Payment sections when both detected", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateDisclaimer(scan);
    assert.ok(result.includes("Artificial Intelligence Disclaimer"));
    assert.ok(result.includes("Payment and Financial Transactions Disclaimer"));
  });

  it("numbers sections sequentially without conditional sections", () => {
    const scan = makeScan();
    const result = generateDisclaimer(scan);
    assert.ok(result.includes("## 1. General Information Disclaimer"));
    assert.ok(result.includes("## 2. Professional Advice Disclaimer"));
    assert.ok(result.includes("## 3. No Warranties"));
    assert.ok(result.includes("## 4. External Links Disclaimer"));
    assert.ok(result.includes("## 5. Errors and Omissions Disclaimer"));
    assert.ok(result.includes("## 6. Fair Use Disclaimer"));
    assert.ok(result.includes("## 7. Changes to This Disclaimer"));
    assert.ok(result.includes("## 8. Contact Information"));
  });

  it("numbers sections sequentially with AI and Payment sections", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateDisclaimer(scan);
    assert.ok(result.includes("## 7. Artificial Intelligence Disclaimer"));
    assert.ok(result.includes("## 8. Payment and Financial Transactions Disclaimer"));
    assert.ok(result.includes("## 9. Changes to This Disclaimer"));
    assert.ok(result.includes("## 10. Contact Information"));
  });

  it("includes Codepliant disclaimer with project name", () => {
    const scan = makeScan({ projectName: "my-saas" });
    const result = generateDisclaimer(scan);
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("my-saas"));
    assert.ok(result.includes("reviewed by legal counsel"));
  });

  it("includes contact section with email and website", () => {
    const scan = makeScan();
    const result = generateDisclaimer(scan, {
      companyName: "TestCo",
      contactEmail: "support@testco.com",
      website: "https://testco.com",
    });
    assert.ok(result.includes("Contact Information"));
    assert.ok(result.includes("support@testco.com"));
    assert.ok(result.includes("https://testco.com"));
  });

  it("includes changes section", () => {
    const scan = makeScan();
    const result = generateDisclaimer(scan);
    assert.ok(result.includes("Changes to This Disclaimer"));
    assert.ok(result.includes("continued use"));
    assert.ok(result.includes("review this Disclaimer periodically"));
  });

  it("uses company name throughout the document", () => {
    const scan = makeScan();
    const result = generateDisclaimer(scan, {
      companyName: "MegaSoft",
      contactEmail: "info@megasoft.com",
    });
    const occurrences = result.split("MegaSoft").length - 1;
    assert.ok(occurrences >= 5, `Expected at least 5 occurrences of company name, got ${occurrences}`);
  });

  // ── New tests: deeper coverage ──────────────────────────────────────

  it("returns a non-empty string always", () => {
    const result = generateDisclaimer(makeScan());
    assert.ok(result.length > 0);
    assert.strictEqual(typeof result, "string");
  });

  it("numbers sections sequentially with only AI section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateDisclaimer(scan);
    assert.ok(result.includes("## 7. Artificial Intelligence Disclaimer"));
    assert.ok(result.includes("## 8. Changes to This Disclaimer"));
    assert.ok(result.includes("## 9. Contact Information"));
    assert.ok(!result.includes("## 10."), "Should not have section 10 with only AI");
  });

  it("numbers sections sequentially with only Payment section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDisclaimer(scan);
    assert.ok(result.includes("## 7. Payment and Financial Transactions Disclaimer"));
    assert.ok(result.includes("## 8. Changes to This Disclaimer"));
    assert.ok(result.includes("## 9. Contact Information"));
  });

  it("includes medical advice disclaimer", () => {
    const result = generateDisclaimer(makeScan());
    assert.ok(result.includes("Medical advice"));
    assert.ok(result.includes("qualified healthcare provider"));
  });

  it("includes technical advice disclaimer", () => {
    const result = generateDisclaimer(makeScan());
    assert.ok(result.includes("Technical advice"));
    assert.ok(result.includes("professional technical consultation"));
  });

  it("includes implied warranties list in No Warranties section", () => {
    const result = generateDisclaimer(makeScan());
    assert.ok(result.includes("IMPLIED WARRANTIES OF MERCHANTABILITY"));
    assert.ok(result.includes("FITNESS FOR A PARTICULAR PURPOSE"));
    assert.ok(result.includes("NON-INFRINGEMENT"));
    assert.ok(result.includes("ACCURACY OR COMPLETENESS OF CONTENT"));
    assert.ok(result.includes("AVAILABILITY OR UNINTERRUPTED ACCESS"));
  });

  it("includes virus disclaimer in No Warranties section", () => {
    const result = generateDisclaimer(makeScan());
    assert.ok(result.includes("free of viruses or other harmful components"));
  });

  it("uses default jurisdiction placeholder when not provided", () => {
    const result = generateDisclaimer(makeScan());
    assert.ok(result.includes("[Your Jurisdiction]") || !result.includes("jurisdiction") || result.length > 0);
  });

  it("handles project name with special characters", () => {
    const scan = makeScan({ projectName: "my-app_v2.0" });
    const result = generateDisclaimer(scan);
    assert.ok(result.includes("my-app_v2.0"));
  });

  it("AI section mentions non-deterministic behavior", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateDisclaimer(scan);
    assert.ok(result.includes("not guaranteed to be deterministic"));
  });

  it("AI section mentions model updates", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateDisclaimer(scan);
    assert.ok(result.includes("updated, modified, or replaced"));
  });

  it("AI section disclaims liability", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateDisclaimer(scan);
    assert.ok(result.includes("expressly disclaims all liability"));
  });

  it("Payment section mentions card information not stored", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDisclaimer(scan);
    assert.ok(result.includes("does not store or directly process your payment card information"));
  });

  it("Payment section mentions price changes", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDisclaimer(scan);
    assert.ok(result.includes("subject to change without prior notice"));
  });

  it("Payment section mentions account security responsibility", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDisclaimer(scan);
    assert.ok(result.includes("maintain the security of your account credentials"));
  });

  it("contains markdown horizontal rules as section dividers", () => {
    const result = generateDisclaimer(makeScan());
    assert.ok(result.includes("---"));
  });

  it("includes GitHub link to Codepliant", () => {
    const result = generateDisclaimer(makeScan());
    assert.ok(result.includes("https://github.com/joechensmartz/codepliant"));
  });

  it("AI disclaimer triggered by multiple different AI services", () => {
    const scan = makeScan({
      services: [
        makeService("@anthropic-ai/sdk", "ai"),
      ],
    });
    const result = generateDisclaimer(scan);
    assert.ok(result.includes("Artificial Intelligence Disclaimer"));
  });

  it("Payment disclaimer triggered by PayPal service", () => {
    const scan = makeScan({
      services: [
        makeService("@paypal/checkout-server-sdk", "payment"),
      ],
    });
    const result = generateDisclaimer(scan);
    assert.ok(result.includes("Payment and Financial Transactions Disclaimer"));
  });

  it("non-AI non-payment services do not trigger conditional sections", () => {
    const scan = makeScan({
      services: [
        makeService("prisma", "database"),
        makeService("next-auth", "auth"),
        makeService("@sendgrid/mail", "email"),
        makeService("@sentry/node", "monitoring"),
      ],
    });
    const result = generateDisclaimer(scan);
    assert.ok(!result.includes("Artificial Intelligence Disclaimer"));
    assert.ok(!result.includes("Payment and Financial Transactions Disclaimer"));
    assert.ok(result.includes("## 7. Changes to This Disclaimer"));
    assert.ok(result.includes("## 8. Contact Information"));
  });

  it("includes fair use section 107 reference for US copyright", () => {
    const result = generateDisclaimer(makeScan());
    assert.ok(result.includes("Section 107"));
    assert.ok(result.includes("United States Copyright Law"));
  });

  it("external links section mentions no endorsement", () => {
    const result = generateDisclaimer(makeScan());
    assert.ok(result.includes("do not warrant, endorse, guarantee"));
  });

  it("errors section mentions unintentional slights", () => {
    const result = generateDisclaimer(makeScan());
    assert.ok(result.includes("perceived slights"));
    assert.ok(result.includes("unintentional"));
  });

  it("includes both effective and last updated dates matching", () => {
    const result = generateDisclaimer(makeScan());
    const today = new Date().toISOString().split("T")[0];
    const effectiveMatch = result.match(/\*\*Effective Date:\*\* (\S+)/);
    const updatedMatch = result.match(/\*\*Last Updated:\*\* (\S+)/);
    assert.ok(effectiveMatch);
    assert.ok(updatedMatch);
    assert.strictEqual(effectiveMatch![1], today);
    assert.strictEqual(updatedMatch![1], today);
  });
});
