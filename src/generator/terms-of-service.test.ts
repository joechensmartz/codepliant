import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateTermsOfService } from "./terms-of-service.js";
import type { GeneratorContext } from "./index.js";

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

describe("generateTermsOfService", () => {
  it("generates terms with title and project name", () => {
    const scan = makeScan();
    const result = generateTermsOfService(scan);
    assert.ok(result.includes("Terms of Service") || result.includes("Terms & Conditions"));
    assert.ok(result.includes("test-project"));
  });

  it("includes effective date in YYYY-MM-DD format", () => {
    const scan = makeScan();
    const result = generateTermsOfService(scan);
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("uses context company name and email", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "legal@acme.com" };
    const result = generateTermsOfService(scan, ctx);
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("legal@acme.com"));
  });

  it("uses placeholder values when no context provided", () => {
    const scan = makeScan();
    const result = generateTermsOfService(scan);
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
    assert.ok(result.includes("[Your Jurisdiction]"));
  });

  it("includes standard sections: agreement, description, accounts, acceptable use", () => {
    const scan = makeScan();
    const result = generateTermsOfService(scan);
    assert.ok(result.includes("Agreement") || result.includes("agreement"));
    assert.ok(result.includes("Description") || result.includes("description"));
    assert.ok(result.includes("Account") || result.includes("account"));
    assert.ok(result.includes("Acceptable Use") || result.includes("acceptable use"));
  });

  it("includes IP, disclaimer, liability, and indemnification sections", () => {
    const scan = makeScan();
    const result = generateTermsOfService(scan);
    assert.ok(result.includes("Intellectual Property") || result.includes("intellectual property"));
    assert.ok(result.includes("Disclaimer") || result.includes("WARRANTY") || result.includes("disclaimer"));
    assert.ok(result.includes("Liability") || result.includes("liability"));
    assert.ok(result.includes("Indemnification") || result.includes("indemnif"));
  });

  it("includes dispute resolution and governing law sections", () => {
    const scan = makeScan();
    const result = generateTermsOfService(scan);
    assert.ok(result.includes("Dispute") || result.includes("dispute"));
    assert.ok(result.includes("Governing Law") || result.includes("governing law"));
  });

  it("uses provided jurisdiction in governing law", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = {
      companyName: "TestCo",
      contactEmail: "test@test.com",
      jurisdiction: "State of Delaware, United States",
    };
    const result = generateTermsOfService(scan, ctx);
    assert.ok(result.includes("State of Delaware, United States"));
  });

  it("includes AI content section when AI services detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts", "AI-generated content"])],
    });
    const result = generateTermsOfService(scan);
    assert.ok(result.includes("AI") || result.includes("Artificial Intelligence") || result.includes("ai"));
  });

  it("omits AI content section when no AI services detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateTermsOfService(scan);
    // Should not contain an AI-specific heading section
    // (the word "AI" may appear incidentally in disclaimer language, so check for section heading)
    const lines = result.split("\n");
    const aiSectionHeadings = lines.filter(
      (l) => /^##\s+\d+\.\s+.*\bAI\b/i.test(l)
    );
    assert.strictEqual(aiSectionHeadings.length, 0);
  });

  it("includes payment section when payment services detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment information", "billing address"])],
    });
    const result = generateTermsOfService(scan);
    assert.ok(result.includes("Payment") || result.includes("payment") || result.includes("Billing"));
  });

  it("omits payment section when no payment services detected", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email"])],
    });
    const result = generateTermsOfService(scan);
    const lines = result.split("\n");
    const paymentSectionHeadings = lines.filter(
      (l) => /^##\s+\d+\.\s+.*\bPayment/i.test(l)
    );
    assert.strictEqual(paymentSectionHeadings.length, 0);
  });

  it("includes user content section when storage services detected", () => {
    const scan = makeScan({
      services: [makeService("@aws-sdk/client-s3", "storage", ["uploaded files"])],
    });
    const result = generateTermsOfService(scan);
    assert.ok(result.includes("Content") || result.includes("content") || result.includes("Upload"));
  });

  it("omits user content section when no storage services detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateTermsOfService(scan);
    const lines = result.split("\n");
    const contentSectionHeadings = lines.filter(
      (l) => /^##\s+\d+\.\s+.*\bUser Content/i.test(l)
    );
    assert.strictEqual(contentSectionHeadings.length, 0);
  });

  it("includes SLA section when monitoring services detected", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring", ["error reports", "device info"])],
    });
    const result = generateTermsOfService(scan);
    assert.ok(result.includes("SLA") || result.includes("Service Level") || result.includes("Availability"));
  });

  it("omits SLA section when no monitoring services detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateTermsOfService(scan);
    const lines = result.split("\n");
    const slaSectionHeadings = lines.filter(
      (l) => /^##\s+\d+\.\s+.*\bSLA\b|Service Level/i.test(l)
    );
    assert.strictEqual(slaSectionHeadings.length, 0);
  });

  it("includes privacy, termination, changes, and force majeure sections", () => {
    const scan = makeScan();
    const result = generateTermsOfService(scan);
    assert.ok(result.includes("Privacy") || result.includes("privacy"));
    assert.ok(result.includes("Termination") || result.includes("termination"));
    assert.ok(result.includes("Changes") || result.includes("changes") || result.includes("Modification"));
    assert.ok(result.includes("Force Majeure") || result.includes("force majeure"));
  });

  it("includes general provisions and contact section", () => {
    const scan = makeScan();
    const result = generateTermsOfService(scan);
    assert.ok(result.includes("General") || result.includes("Severability") || result.includes("severability"));
    assert.ok(result.includes("Contact") || result.includes("contact"));
  });

  it("includes class action waiver", () => {
    const scan = makeScan();
    const result = generateTermsOfService(scan);
    assert.ok(result.includes("CLASS ACTION") || result.includes("class action") || result.includes("Class Action"));
  });

  it("handles comprehensive service combination", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment info"]),
        makeService("@aws-sdk/client-s3", "storage", ["uploaded files"]),
        makeService("@sentry/node", "monitoring", ["error reports"]),
      ],
    });
    const result = generateTermsOfService(scan);

    // All conditional sections should be present
    const lines = result.split("\n");
    const sectionHeadings = lines.filter((l) => /^##\s+\d+\./.test(l));
    // With all services: agreement + description + accounts + acceptable use + AI + payment + user content + privacy + IP + disclaimer + liability + indemnification + disputes + termination + changes + SLA + force majeure + governing law + general provisions + contact = ~20 sections
    assert.ok(sectionHeadings.length >= 16, `Expected at least 16 sections, got ${sectionHeadings.length}`);
  });

  it("numbers sections sequentially", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment info"]),
      ],
    });
    const result = generateTermsOfService(scan);
    const lines = result.split("\n");
    const sectionNums = lines
      .filter((l) => /^##\s+\d+\./.test(l))
      .map((l) => {
        const match = l.match(/^##\s+(\d+)\./);
        return match ? parseInt(match[1], 10) : 0;
      });

    // Sections should be sequentially numbered
    for (let i = 0; i < sectionNums.length; i++) {
      assert.strictEqual(sectionNums[i], i + 1, `Section ${i + 1} should be numbered ${i + 1}, got ${sectionNums[i]}`);
    }
  });
});
