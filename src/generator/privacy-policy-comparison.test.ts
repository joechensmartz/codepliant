import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { generatePrivacyPolicyComparison } from "./privacy-policy-comparison.js";
import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

function makeScan(overrides?: Partial<ScanResult>): ScanResult {
  return {
    projectName: "test-project",
    projectPath: "/tmp/test",
    scannedAt: "2026-01-01T00:00:00.000Z",
    services: [],
    dataCategories: [],
    complianceNeeds: [],
    ...overrides,
  };
}

function makeService(name: string, category: string, isDataProcessor = true) {
  return {
    name,
    category: category as any,
    evidence: [],
    dataCollected: [],
    isDataProcessor,
  };
}

describe("generatePrivacyPolicyComparison", () => {
  it("returns null when no services are detected", () => {
    const scan = makeScan();
    const result = generatePrivacyPolicyComparison(scan);
    assert.strictEqual(result, null);
  });

  it("returns a string when services are present", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generatePrivacyPolicyComparison(scan);
    assert.ok(typeof result === "string");
    assert.ok(result!.length > 0);
  });

  it("includes title and purpose", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generatePrivacyPolicyComparison(scan)!;
    assert.ok(result.includes("# Privacy Policy Comparison"));
    assert.ok(result.includes("## Purpose"));
  });

  it("includes company name from context", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
    };
    const result = generatePrivacyPolicyComparison(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses default placeholders without context", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generatePrivacyPolicyComparison(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("includes coverage score section", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generatePrivacyPolicyComparison(scan)!;
    assert.ok(result.includes("## Coverage Score"));
    assert.ok(result.includes("items covered"));
  });

  it("includes checklist comparison table", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generatePrivacyPolicyComparison(scan)!;
    assert.ok(result.includes("## Checklist Comparison"));
    assert.ok(result.includes("Section"));
    assert.ok(result.includes("Covered"));
    assert.ok(result.includes("Regulation"));
  });

  it("marks data-controller-identity as covered when company configured", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
    };
    const result = generatePrivacyPolicyComparison(scan, ctx)!;
    // The "Data Controller Identity" row should show "Yes"
    const lines = result.split("\n");
    const row = lines.find((l) => l.includes("Data Controller Identity"));
    assert.ok(row);
    assert.ok(row!.includes("Yes"));
  });

  it("marks data-controller-identity as not covered with placeholder name", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generatePrivacyPolicyComparison(scan)!;
    const lines = result.split("\n");
    const row = lines.find((l) => l.includes("Data Controller Identity"));
    assert.ok(row);
    assert.ok(row!.includes("**No**"));
  });

  it("marks DPO contact as covered when dpoEmail provided", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      dpoEmail: "dpo@acme.com",
    };
    const result = generatePrivacyPolicyComparison(scan, ctx)!;
    const lines = result.split("\n");
    const row = lines.find((l) => l.includes("DPO Contact Information"));
    assert.ok(row);
    assert.ok(row!.includes("Yes"));
  });

  it("marks data retention as covered when dataRetentionDays set", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      dataRetentionDays: 365,
    };
    const result = generatePrivacyPolicyComparison(scan, ctx)!;
    const lines = result.split("\n");
    const row = lines.find((l) => l.includes("Data Retention Periods"));
    assert.ok(row);
    assert.ok(row!.includes("Yes"));
  });

  it("detects AI disclosure checklist item when AI services present", () => {
    const scan = makeScan({
      services: [makeService("OpenAI", "ai")],
    });
    const result = generatePrivacyPolicyComparison(scan)!;
    const lines = result.split("\n");
    const row = lines.find((l) => l.includes("AI / Automated Decision-Making"));
    assert.ok(row);
    assert.ok(row!.includes("Yes"));
  });

  it("marks AI disclosure as not covered when no AI services", () => {
    const scan = makeScan({
      services: [makeService("Auth0", "auth")],
    });
    const result = generatePrivacyPolicyComparison(scan)!;
    const lines = result.split("\n");
    const row = lines.find((l) => l.includes("AI / Automated Decision-Making"));
    assert.ok(row);
    assert.ok(row!.includes("**No**"));
  });

  it("detects cookie policy need with analytics services", () => {
    const scan = makeScan({
      services: [makeService("Google Analytics", "analytics")],
    });
    const result = generatePrivacyPolicyComparison(scan)!;
    const lines = result.split("\n");
    const row = lines.find((l) => l.includes("Cookie Policy"));
    assert.ok(row);
    assert.ok(row!.includes("Yes"));
  });

  it("includes gap analysis section when gaps exist", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    // Without context, several items will be gaps
    const result = generatePrivacyPolicyComparison(scan)!;
    assert.ok(result.includes("## Gap Analysis"));
  });

  it("includes specific recommendation for DPO gap", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generatePrivacyPolicyComparison(scan)!;
    assert.ok(result.includes("dpoName"));
    assert.ok(result.includes("dpoEmail"));
  });

  it("includes industry benchmarks section", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generatePrivacyPolicyComparison(scan)!;
    assert.ok(result.includes("## Industry Benchmarks"));
    assert.ok(result.includes("Stripe"));
    assert.ok(result.includes("Vercel"));
    assert.ok(result.includes("Linear"));
    assert.ok(result.includes("Notion"));
    assert.ok(result.includes("GitHub"));
  });

  it("includes industry example URLs", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generatePrivacyPolicyComparison(scan)!;
    assert.ok(result.includes("https://stripe.com/privacy"));
    assert.ok(result.includes("https://vercel.com/legal/privacy-policy"));
  });

  it("includes recommendations with priority levels", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generatePrivacyPolicyComparison(scan)!;
    assert.ok(result.includes("## Recommendations"));
    assert.ok(result.includes("Priority Actions"));
  });

  it("includes high priority recommendations for regulatory gaps", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    // Without context, data-controller-identity (GDPR Art. 13) will be a gap
    const result = generatePrivacyPolicyComparison(scan)!;
    assert.ok(result.includes("High Priority (regulatory requirement)"));
  });

  it("includes improving your score configuration section", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generatePrivacyPolicyComparison(scan)!;
    assert.ok(result.includes("## Improving Your Score"));
    assert.ok(result.includes(".codepliantrc.json"));
  });

  it("includes review schedule", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generatePrivacyPolicyComparison(scan)!;
    assert.ok(result.includes("## Review Schedule"));
    assert.ok(result.includes("Quarterly"));
  });

  it("includes disclaimer", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generatePrivacyPolicyComparison(scan)!;
    assert.ok(result.includes("does not constitute legal advice"));
    assert.ok(result.includes("Codepliant"));
  });

  it("higher coverage with full context configuration", () => {
    const scan = makeScan({
      services: [
        makeService("Stripe", "payment"),
        makeService("Google Analytics", "analytics"),
        makeService("OpenAI", "ai"),
        makeService("Auth0", "auth"),
      ],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      dpoName: "Jane Doe",
      dpoEmail: "dpo@acme.com",
      euRepresentative: "EU Rep GmbH",
      dataRetentionDays: 365,
      jurisdictions: ["GDPR", "CCPA"],
    };
    const result = generatePrivacyPolicyComparison(scan, ctx)!;
    // With full config, coverage should be high
    const match = result.match(/(\d+) \/ (\d+) items covered \((\d+)%\)/);
    assert.ok(match);
    const percentage = parseInt(match![3], 10);
    assert.ok(percentage >= 80, `Expected >= 80% coverage, got ${percentage}%`);
  });

  it("shows sub-processor list as covered with 3+ processors", () => {
    const scan = makeScan({
      services: [
        makeService("Stripe", "payment"),
        makeService("Sentry", "monitoring"),
        makeService("Auth0", "auth"),
      ],
    });
    const result = generatePrivacyPolicyComparison(scan)!;
    const lines = result.split("\n");
    const row = lines.find((l) => l.includes("Sub-Processor List"));
    assert.ok(row);
    assert.ok(row!.includes("Yes"));
  });

  it("shows sub-processor list as not covered with fewer than 3 processors", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generatePrivacyPolicyComparison(scan)!;
    const lines = result.split("\n");
    const row = lines.find((l) => l.includes("Sub-Processor List"));
    assert.ok(row);
    assert.ok(row!.includes("**No**"));
  });

  it("includes project name", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generatePrivacyPolicyComparison(scan)!;
    assert.ok(result.includes("test-project"));
  });

  it("includes contact email from context", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
    };
    const result = generatePrivacyPolicyComparison(scan, ctx)!;
    assert.ok(result.includes("privacy@acme.com"));
  });
});
