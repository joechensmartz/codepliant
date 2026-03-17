import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateCrossBorderTransferMap } from "./cross-border-transfer-map.js";
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

function makeCtx(overrides: Partial<GeneratorContext> = {}): GeneratorContext {
  return {
    companyName: "Acme Corp",
    contactEmail: "legal@acme.com",
    ...overrides,
  };
}

describe("generateCrossBorderTransferMap", () => {
  // ── Null guard ──────────────────────────────────────────────────────

  it("returns null when no services detected", () => {
    const result = generateCrossBorderTransferMap(makeScan());
    assert.strictEqual(result, null);
  });

  it("returns null when all services are non-data-processors", () => {
    const svc = makeService("eslint", "other");
    (svc as any).isDataProcessor = false;
    const scan = makeScan({ services: [svc] });
    const result = generateCrossBorderTransferMap(scan);
    assert.strictEqual(result, null);
  });

  // ── Basic generation ───────────────────────────────────────────────

  it("generates document when data-processing services are present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateCrossBorderTransferMap(scan);
    assert.ok(typeof result === "string");
    assert.ok(result.includes("# Cross-Border Data Transfer Map"));
  });

  it("includes project name", () => {
    const scan = makeScan({
      projectName: "my-saas",
      services: [makeService("stripe", "payment")],
    });
    const result = generateCrossBorderTransferMap(scan);
    assert.ok(result!.includes("my-saas"));
  });

  it("includes date in document", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateCrossBorderTransferMap(scan);
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result!));
  });

  // ── Context values ─────────────────────────────────────────────────

  it("uses company name from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ companyName: "TestCo Inc" });
    const result = generateCrossBorderTransferMap(scan, ctx);
    assert.ok(result!.includes("TestCo Inc"));
  });

  it("uses contact email from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ contactEmail: "privacy@testco.com" });
    const result = generateCrossBorderTransferMap(scan, ctx);
    assert.ok(result!.includes("privacy@testco.com"));
  });

  it("uses company location from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ companyLocation: "Berlin, Germany" });
    const result = generateCrossBorderTransferMap(scan, ctx);
    assert.ok(result!.includes("Berlin, Germany"));
  });

  it("uses default placeholders when no context provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateCrossBorderTransferMap(scan);
    assert.ok(result!.includes("[Your Company Name]"));
    assert.ok(result!.includes("[your-email@example.com]"));
    assert.ok(result!.includes("[Your Location]"));
  });

  it("includes DPO email when provided in context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ dpoEmail: "dpo@testco.com" });
    const result = generateCrossBorderTransferMap(scan, ctx);
    assert.ok(result!.includes("dpo@testco.com"));
  });

  it("omits DPO line when dpoEmail not provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx();
    const result = generateCrossBorderTransferMap(scan, ctx);
    assert.ok(!result!.includes("Data Protection Officer"));
  });

  // ── GDPR Chapter V reference ───────────────────────────────────────

  it("references GDPR Chapter V", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateCrossBorderTransferMap(scan);
    assert.ok(result!.includes("GDPR Chapter V"));
    assert.ok(result!.includes("Articles 44-49"));
  });

  // ── Mermaid diagram ────────────────────────────────────────────────

  it("includes mermaid transfer flow diagram", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateCrossBorderTransferMap(scan);
    assert.ok(result!.includes("```mermaid"));
    assert.ok(result!.includes("graph LR"));
  });

  it("mermaid diagram groups services by country", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateCrossBorderTransferMap(scan);
    assert.ok(result!.includes("United States"));
  });

  // ── Transfer Summary by Country ────────────────────────────────────

  it("includes country summary table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateCrossBorderTransferMap(scan);
    assert.ok(result!.includes("## Transfer Summary by Country"));
    assert.ok(result!.includes("| Country | Services | Data Types | Safeguard | Adequacy Decision |"));
  });

  it("shows known service country (stripe → United States)", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment", ["payment info"])] });
    const result = generateCrossBorderTransferMap(scan);
    assert.ok(result!.includes("United States"));
    assert.ok(result!.includes("stripe"));
  });

  it("shows safeguard for known services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateCrossBorderTransferMap(scan);
    assert.ok(result!.includes("EU-US DPF / SCCs"));
  });

  it("shows Unknown country for unrecognized services", () => {
    const scan = makeScan({
      services: [makeService("custom-unknown-service", "other")],
    });
    const result = generateCrossBorderTransferMap(scan);
    assert.ok(result!.includes("Unknown"));
    assert.ok(result!.includes("[Verify with provider]"));
  });

  // ── Detailed Transfer Register ─────────────────────────────────────

  it("includes detailed transfer register table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateCrossBorderTransferMap(scan);
    assert.ok(result!.includes("## Detailed Transfer Register"));
    assert.ok(result!.includes("| # | Service | Category |"));
  });

  it("numbers services sequentially in register", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateCrossBorderTransferMap(scan);
    assert.ok(result!.includes("| 1 | stripe |"));
    assert.ok(result!.includes("| 2 | openai |"));
  });

  it("includes DPF verification link for adequate services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateCrossBorderTransferMap(scan);
    assert.ok(result!.includes("dataprivacyframework.gov"));
  });

  // ── Services Requiring Additional Safeguards ───────────────────────

  it("shows additional safeguards section for non-adequate services", () => {
    const scan = makeScan({
      services: [makeService("@anthropic-ai/sdk", "ai", ["user prompts"])],
    });
    const result = generateCrossBorderTransferMap(scan);
    assert.ok(result!.includes("## Services Requiring Additional Safeguards"));
    assert.ok(result!.includes("Schrems II"));
    assert.ok(result!.includes("Standard Contractual Clauses"));
  });

  it("lists required actions for non-adequate services", () => {
    const scan = makeScan({
      services: [makeService("@anthropic-ai/sdk", "ai", ["user prompts"])],
    });
    const result = generateCrossBorderTransferMap(scan);
    assert.ok(result!.includes("Execute Standard Contractual Clauses"));
    assert.ok(result!.includes("Annex I"));
    assert.ok(result!.includes("Annex II"));
  });

  it("omits additional safeguards section when all services are adequate", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateCrossBorderTransferMap(scan);
    assert.ok(!result!.includes("## Services Requiring Additional Safeguards"));
  });

  it("excludes self-hosted services from additional safeguards", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateCrossBorderTransferMap(scan);
    assert.ok(!result!.includes("## Services Requiring Additional Safeguards"));
  });

  // ── Data Type × Service Matrix ─────────────────────────────────────

  it("includes data type matrix", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info", "email"])],
    });
    const result = generateCrossBorderTransferMap(scan);
    assert.ok(result!.includes("## Data Type × Service Matrix"));
    assert.ok(result!.includes("payment info"));
    assert.ok(result!.includes("email"));
  });

  it("marks collected data types with dot symbol", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateCrossBorderTransferMap(scan);
    // The dot symbol indicates the service collects that data type
    assert.ok(result!.includes("●"));
  });

  it("marks non-collected data types with dash symbol", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("openai", "ai", ["user prompts"]),
      ],
    });
    const result = generateCrossBorderTransferMap(scan);
    // Dash indicates the service does NOT collect that data type
    assert.ok(result!.includes("—"));
  });

  // ── Compliance Checklist ───────────────────────────────────────────

  it("includes transfer compliance checklist", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateCrossBorderTransferMap(scan);
    assert.ok(result!.includes("## Transfer Compliance Checklist"));
    assert.ok(result!.includes("valid legal basis under GDPR Chapter V"));
    assert.ok(result!.includes("SCCs (2021 version)"));
    assert.ok(result!.includes("Transfer Impact Assessment"));
    assert.ok(result!.includes("Record of Processing Activities"));
    assert.ok(result!.includes("Privacy Policy discloses international transfers"));
  });

  // ── Review Schedule ────────────────────────────────────────────────

  it("includes review schedule table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateCrossBorderTransferMap(scan);
    assert.ok(result!.includes("## Review Schedule"));
    assert.ok(result!.includes("Full transfer map review"));
    assert.ok(result!.includes("Annual"));
    assert.ok(result!.includes("DPF certification verification"));
    assert.ok(result!.includes("Semi-annual"));
  });

  it("review schedule shows next year date", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateCrossBorderTransferMap(scan);
    const nextYear = new Date().getFullYear() + 1;
    assert.ok(result!.includes(String(nextYear)));
  });

  // ── Multiple services ──────────────────────────────────────────────

  it("handles multiple services from different countries", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("hotjar", "analytics", ["page views"]),
      ],
    });
    const result = generateCrossBorderTransferMap(scan);
    assert.ok(result!.includes("United States"));
    assert.ok(result!.includes("Malta"));
  });

  it("groups multiple services in the same country", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("openai", "ai", ["user prompts"]),
      ],
    });
    const result = generateCrossBorderTransferMap(scan);
    // Both should appear under United States in the summary
    const lines = result!.split("\n");
    const usLine = lines.find((l) => l.includes("United States") && l.includes("stripe") && l.includes("openai"));
    assert.ok(usLine !== undefined, "Expected US line with both stripe and openai");
  });

  // ── Disclaimer ─────────────────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateCrossBorderTransferMap(scan);
    assert.ok(result!.includes("Codepliant"));
  });

  it("includes legal disclaimer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateCrossBorderTransferMap(scan);
    assert.ok(result!.includes("does not constitute legal advice"));
  });

  it("advises verifying with providers", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateCrossBorderTransferMap(scan);
    assert.ok(result!.includes("verified with each provider"));
  });
});
