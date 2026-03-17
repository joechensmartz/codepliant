import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { generateComplianceMaturityModel } from "./compliance-maturity-model.js";
import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext, GeneratedDocument } from "./index.js";

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

function makeDocs(count: number): GeneratedDocument[] {
  return Array.from({ length: count }, (_, i) => ({
    name: `Doc ${i}`,
    filename: `DOC_${i}.md`,
    content: "content",
  }));
}

describe("generateComplianceMaturityModel", () => {
  it("returns null when no services are detected", () => {
    const scan = makeScan();
    const result = generateComplianceMaturityModel(scan);
    assert.strictEqual(result, null);
  });

  it("returns a string when services are present", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generateComplianceMaturityModel(scan);
    assert.ok(typeof result === "string");
    assert.ok(result!.length > 0);
  });

  it("includes the document header and title", () => {
    const scan = makeScan({
      services: [makeService("Sentry", "monitoring")],
    });
    const result = generateComplianceMaturityModel(scan)!;
    assert.ok(result.includes("# Compliance Maturity Model"));
    assert.ok(result.includes("Document Version:"));
    assert.ok(result.includes("Next Review Date:"));
  });

  it("uses company name from context", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
    };
    const result = generateComplianceMaturityModel(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("defaults company name to placeholder without context", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generateComplianceMaturityModel(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("includes all five maturity levels in the scale", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generateComplianceMaturityModel(scan)!;
    assert.ok(result.includes("Level 1: Initial"));
    assert.ok(result.includes("Level 2: Repeatable"));
    assert.ok(result.includes("Level 3: Defined"));
    assert.ok(result.includes("Level 4: Managed"));
    assert.ok(result.includes("Level 5: Optimizing"));
  });

  it("includes YOU ARE HERE marker", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generateComplianceMaturityModel(scan)!;
    assert.ok(result.includes("YOU ARE HERE"));
  });

  it("includes dimension assessment table", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generateComplianceMaturityModel(scan)!;
    assert.ok(result.includes("## Dimension Assessment"));
    assert.ok(result.includes("Data Governance"));
    assert.ok(result.includes("Privacy Program"));
    assert.ok(result.includes("Security Controls"));
    assert.ok(result.includes("Vendor Management"));
    assert.ok(result.includes("Incident Response"));
  });

  it("does not include AI Governance dimension when no AI services", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generateComplianceMaturityModel(scan)!;
    assert.ok(!result.includes("AI Governance"));
  });

  it("includes AI Governance dimension when AI services present", () => {
    const scan = makeScan({
      services: [makeService("OpenAI", "ai")],
    });
    const result = generateComplianceMaturityModel(scan)!;
    assert.ok(result.includes("AI Governance"));
    assert.ok(result.includes("AI services detected in codebase"));
  });

  it("raises Data Governance level with more docs", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
      dataCategories: [{ category: "personal", description: "Personal data", sources: [] }],
    });

    // With few docs, level is lower
    const result1 = generateComplianceMaturityModel(scan, undefined, makeDocs(2))!;
    // With many docs, level should be higher
    const result2 = generateComplianceMaturityModel(scan, undefined, makeDocs(30))!;

    // The result with 30 docs should mention "Extensive documentation"
    assert.ok(result2.includes("Extensive documentation suite"));
  });

  it("recognizes DPO in Privacy Program dimension", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      dpoName: "Jane Doe",
      dpoEmail: "dpo@acme.com",
    };
    const result = generateComplianceMaturityModel(scan, ctx)!;
    assert.ok(result.includes("Data Protection Officer designated"));
  });

  it("recognizes auth services in Security Controls", () => {
    const scan = makeScan({
      services: [makeService("Auth0", "auth")],
    });
    const result = generateComplianceMaturityModel(scan)!;
    assert.ok(result.includes("Authentication service detected"));
  });

  it("recognizes bug bounty URL in Security Controls", () => {
    const scan = makeScan({
      services: [makeService("Auth0", "auth")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      bugBountyUrl: "https://acme.com/security",
    };
    const result = generateComplianceMaturityModel(scan, ctx)!;
    assert.ok(result.includes("Bug bounty / responsible disclosure program"));
  });

  it("includes roadmap section when not at level 5", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generateComplianceMaturityModel(scan)!;
    assert.ok(result.includes("## Roadmap to Next Level"));
    assert.ok(result.includes("Priority Actions"));
  });

  it("includes phased roadmap actions", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generateComplianceMaturityModel(scan)!;
    assert.ok(result.includes("Phase 1: Quick Wins"));
  });

  it("includes disclaimer at end", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generateComplianceMaturityModel(scan)!;
    assert.ok(result.includes("does not constitute legal advice"));
  });

  it("recognizes jurisdictions in Privacy Program", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      jurisdictions: ["GDPR", "CCPA"],
    };
    const result = generateComplianceMaturityModel(scan, ctx)!;
    assert.ok(result.includes("Jurisdictions defined: GDPR, CCPA"));
  });

  it("recognizes database services in Data Governance", () => {
    const scan = makeScan({
      services: [makeService("MongoDB", "database")],
    });
    const result = generateComplianceMaturityModel(scan)!;
    assert.ok(result.includes("persistent data storage present"));
  });

  it("detects AI risk level in AI Governance", () => {
    const scan = makeScan({
      services: [makeService("OpenAI", "ai")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      aiRiskLevel: "high",
    };
    const result = generateComplianceMaturityModel(scan, ctx)!;
    assert.ok(result.includes("AI risk level assessed: high"));
  });

  it("counts third-party vendors for Vendor Management", () => {
    const scan = makeScan({
      services: [
        makeService("Stripe", "payment"),
        makeService("Sentry", "monitoring"),
        makeService("Auth0", "auth"),
      ],
    });
    const result = generateComplianceMaturityModel(scan)!;
    assert.ok(result.includes("3 third-party services identified"));
  });

  it("excludes non-data-processor services from vendor count", () => {
    const scan = makeScan({
      services: [
        makeService("Stripe", "payment", true),
        makeService("ESLint", "devtool", false),
      ],
    });
    const result = generateComplianceMaturityModel(scan)!;
    assert.ok(result.includes("1 third-party services identified"));
  });

  it("includes security email evidence in Incident Response", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      securityEmail: "security@acme.com",
    };
    const result = generateComplianceMaturityModel(scan, ctx)!;
    assert.ok(result.includes("Security contact for incident reporting"));
  });

  it("includes Success Criteria section in roadmap", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generateComplianceMaturityModel(scan)!;
    assert.ok(result.includes("Success Criteria for Level"));
  });
});
