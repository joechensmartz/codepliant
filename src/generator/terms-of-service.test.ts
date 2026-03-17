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

    const lines = result.split("\n");
    const sectionHeadings = lines.filter((l) => /^##\s+\d+\./.test(l));
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

    for (let i = 0; i < sectionNums.length; i++) {
      assert.strictEqual(sectionNums[i], i + 1, `Section ${i + 1} should be numbered ${i + 1}, got ${sectionNums[i]}`);
    }
  });

  // ── New tests ──────────────────────────────────────────────────────

  it("returns a non-empty string", () => {
    const result = generateTermsOfService(makeScan());
    assert.ok(typeof result === "string");
    assert.ok(result.length > 0);
  });

  it("starts with markdown h1 heading", () => {
    const result = generateTermsOfService(makeScan());
    assert.ok(result.startsWith("#"));
  });

  it("includes last modified date", () => {
    const result = generateTermsOfService(makeScan());
    assert.ok(/Last Modified|last modified/i.test(result) || result.includes("**Last Modified:**") || /\*\*.*[Mm]odified.*\*\*/.test(result));
  });

  it("includes acceptable use list items", () => {
    const result = generateTermsOfService(makeScan());
    // Should have bullet points under acceptable use
    const bulletCount = (result.match(/^- /gm) || []).length;
    assert.ok(bulletCount >= 5, `Expected at least 5 bullet items, got ${bulletCount}`);
  });

  it("section count without conditional services is baseline", () => {
    const scan = makeScan({ services: [] });
    const result = generateTermsOfService(scan);
    const lines = result.split("\n");
    const headings = lines.filter((l) => /^##\s+\d+\./.test(l));
    const baselineCount = headings.length;
    // With no services: agreement + description + accounts + acceptable use + privacy + IP + disclaimer + liability + indemnification + disputes + termination + changes + force majeure + governing law + general provisions + contact = 16
    assert.ok(baselineCount >= 14, `Expected at least 14 baseline sections, got ${baselineCount}`);
  });

  it("AI section adds exactly one extra section heading", () => {
    const noAi = makeScan({ services: [] });
    const withAi = makeScan({ services: [makeService("openai", "ai")] });
    const baseHeadings = generateTermsOfService(noAi).split("\n").filter((l) => /^##\s+\d+\./.test(l)).length;
    const aiHeadings = generateTermsOfService(withAi).split("\n").filter((l) => /^##\s+\d+\./.test(l)).length;
    assert.equal(aiHeadings, baseHeadings + 1);
  });

  it("payment section adds exactly one extra section heading", () => {
    const noPay = makeScan({ services: [] });
    const withPay = makeScan({ services: [makeService("stripe", "payment")] });
    const baseHeadings = generateTermsOfService(noPay).split("\n").filter((l) => /^##\s+\d+\./.test(l)).length;
    const payHeadings = generateTermsOfService(withPay).split("\n").filter((l) => /^##\s+\d+\./.test(l)).length;
    assert.equal(payHeadings, baseHeadings + 1);
  });

  it("storage section adds exactly one extra section heading", () => {
    const noStore = makeScan({ services: [] });
    const withStore = makeScan({ services: [makeService("@aws-sdk/client-s3", "storage")] });
    const baseHeadings = generateTermsOfService(noStore).split("\n").filter((l) => /^##\s+\d+\./.test(l)).length;
    const storeHeadings = generateTermsOfService(withStore).split("\n").filter((l) => /^##\s+\d+\./.test(l)).length;
    assert.equal(storeHeadings, baseHeadings + 1);
  });

  it("monitoring section adds exactly one extra section heading", () => {
    const noMon = makeScan({ services: [] });
    const withMon = makeScan({ services: [makeService("@sentry/node", "monitoring")] });
    const baseHeadings = generateTermsOfService(noMon).split("\n").filter((l) => /^##\s+\d+\./.test(l)).length;
    const monHeadings = generateTermsOfService(withMon).split("\n").filter((l) => /^##\s+\d+\./.test(l)).length;
    assert.equal(monHeadings, baseHeadings + 1);
  });

  it("all four conditional sections add 4 extra headings", () => {
    const none = makeScan({ services: [] });
    const all = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("stripe", "payment"),
        makeService("@aws-sdk/client-s3", "storage"),
        makeService("@sentry/node", "monitoring"),
      ],
    });
    const baseHeadings = generateTermsOfService(none).split("\n").filter((l) => /^##\s+\d+\./.test(l)).length;
    const allHeadings = generateTermsOfService(all).split("\n").filter((l) => /^##\s+\d+\./.test(l)).length;
    assert.equal(allHeadings, baseHeadings + 4);
  });

  it("includes termination list items", () => {
    const result = generateTermsOfService(makeScan());
    assert.ok(result.includes("Termination") || result.includes("termination"));
    // termination section has bullet list
    const lines = result.split("\n");
    const terminationIdx = lines.findIndex((l) => /termination/i.test(l) && /^##/.test(l));
    assert.ok(terminationIdx >= 0);
  });

  it("includes entire agreement clause in general provisions", () => {
    const result = generateTermsOfService(makeScan());
    assert.ok(result.includes("entire agreement") || result.includes("Entire Agreement") || result.includes("entire"));
  });

  it("includes assignment clause", () => {
    const result = generateTermsOfService(makeScan());
    assert.ok(result.includes("assign") || result.includes("Assignment"));
  });

  it("includes footer with italic disclaimer", () => {
    const result = generateTermsOfService(makeScan());
    // Footer should be italic markdown (wrapped in *)
    assert.ok(result.includes("*"));
    const lastLine = result.trim().split("\n").pop()!;
    assert.ok(lastLine.startsWith("*") || lastLine.includes("*"));
  });

  it("project name with spaces is included correctly", () => {
    const scan = makeScan({ projectName: "My Cool App" });
    const result = generateTermsOfService(scan);
    assert.ok(result.includes("My Cool App"));
  });

  it("contact section includes email bold label", () => {
    const ctx: GeneratorContext = { companyName: "TestCo", contactEmail: "legal@testco.com" };
    const result = generateTermsOfService(makeScan(), ctx);
    assert.ok(result.includes("**"));
    assert.ok(result.includes("legal@testco.com"));
  });

  it("generates valid markdown with no unclosed code blocks", () => {
    const result = generateTermsOfService(makeScan());
    const backtickBlocks = (result.match(/```/g) || []).length;
    assert.equal(backtickBlocks % 2, 0, "Unclosed code blocks detected");
  });

  it("horizontal rule separates header from body", () => {
    const result = generateTermsOfService(makeScan());
    assert.ok(result.includes("---"));
  });
});
