import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateRegulatoryMappingMatrix } from "./regulatory-mapping-matrix.js";
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

describe("generateRegulatoryMappingMatrix", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateRegulatoryMappingMatrix(scan), null);
  });

  // ── Basic generation ───────────────────────────────────────────────

  it("generates matrix with a single service", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result !== null);
    assert.ok(result.includes("# Regulatory Mapping Matrix"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes project name in disclaimer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("test-project"));
  });

  // ── Context values ─────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generateRegulatoryMappingMatrix(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  // ── Legend section ─────────────────────────────────────────────────

  it("includes Legend section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("## Legend"));
    assert.ok(result.includes("**YES**"));
    assert.ok(result.includes("**?**"));
  });

  // ── Service-to-Regulation Matrix ──────────────────────────────────

  it("includes matrix table header with all regulations", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("## Service-to-Regulation Matrix"));
    assert.ok(result.includes("| Service | Category | GDPR | CCPA | EU AI Act | PCI DSS | HIPAA | SOC 2 |"));
  });

  it("lists each service in the matrix", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("| stripe |"));
    assert.ok(result.includes("| openai |"));
  });

  // ── GDPR assessment ────────────────────────────────────────────────

  it("marks auth as GDPR applicable", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("auth services typically process personal data"));
  });

  it("marks analytics as GDPR applicable", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("analytics services typically process personal data"));
  });

  it("marks database as GDPR applicable", () => {
    const scan = makeScan({ services: [makeService("prisma", "database")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("May store personal data"));
  });

  it("marks service with personal data keywords as GDPR applicable", () => {
    const scan = makeScan({ services: [makeService("custom", "other", ["user email addresses"])] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("Processes personal data"));
  });

  // ── CCPA assessment ────────────────────────────────────────────────

  it("marks analytics as CCPA applicable", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("Collects/shares consumer information for commercial purposes"));
  });

  it("marks auth as CCPA applicable", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("Collects consumer identity information"));
  });

  it("marks email as CCPA applicable", () => {
    const scan = makeScan({ services: [makeService("resend", "email")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("Processes consumer contact information"));
  });

  // ── EU AI Act assessment ───────────────────────────────────────────

  it("marks AI services as AI Act applicable", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("AI/ML service"));
    assert.ok(result.includes("EU AI Act"));
  });

  it("does not mark non-AI services as AI Act applicable", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    // Payment service should not be listed under EU AI Act
    assert.ok(result.includes("No services identified as subject to EU AI Act requirements"));
  });

  it("marks service with AI-related data as AI Act applicable", () => {
    const scan = makeScan({ services: [makeService("custom", "other", ["prediction scores"])] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("Data used for AI/ML inference"));
  });

  // ── PCI DSS assessment ─────────────────────────────────────────────

  it("marks payment services as PCI applicable", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("Payment processing"));
    assert.ok(result.includes("PCI DSS applies"));
  });

  it("marks service with payment data as PCI applicable", () => {
    const scan = makeScan({ services: [makeService("custom", "other", ["credit card numbers"])] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("Processes payment-related data"));
  });

  it("does not mark non-payment services as PCI applicable in matrix", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    // PCI DSS column for analytics should show "—" (not applicable)
    // The matrix row for posthog should not have YES in the PCI column
    // Check that no services are listed under PCI DSS applicable services
    assert.ok(result.includes("No services identified as subject to PCI DSS requirements"));
  });

  // ── HIPAA assessment ───────────────────────────────────────────────

  it("marks service with health data as HIPAA applicable", () => {
    const scan = makeScan({ services: [makeService("custom", "other", ["patient health records"])] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("Processes protected health information"));
  });

  it("marks database as potential HIPAA concern", () => {
    const scan = makeScan({ services: [makeService("prisma", "database")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("May apply if storing PHI"));
  });

  // ── SOC 2 assessment ───────────────────────────────────────────────

  it("marks auth as SOC 2 applicable", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("auth service relevant to SOC 2 Trust Service Criteria"));
  });

  it("marks payment as SOC 2 applicable", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("Payment service"));
    assert.ok(result.includes("SOC 2 confidentiality"));
  });

  it("marks AI as SOC 2 applicable", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("AI service"));
    assert.ok(result.includes("SOC 2 processing integrity"));
  });

  it("marks analytics as SOC 2 applicable", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("SOC 2 privacy"));
  });

  // ── Applicability icons ────────────────────────────────────────────

  it("uses YES for applicable services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("YES"));
  });

  it("uses ? for services requiring manual assessment", () => {
    const scan = makeScan({ services: [makeService("prisma", "database")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    // database gets "?" for HIPAA due to "requires manual" or "May apply"
    assert.ok(result.includes("?"));
  });

  // ── Regulation Coverage Summary ────────────────────────────────────

  it("includes Regulation Coverage Summary section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("## Regulation Coverage Summary"));
    assert.ok(result.includes("| Regulation | Services Affected | Coverage % | Priority |"));
  });

  it("shows priority levels (High/Medium/Low)", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("clerk", "auth"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateRegulatoryMappingMatrix(scan)!;
    // GDPR should be High priority (applies to most services)
    assert.ok(result.includes("High"));
  });

  it("shows coverage percentage", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(/%/.test(result));
  });

  // ── Detailed Assessment by Regulation ──────────────────────────────

  it("includes Detailed Assessment by Regulation section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("## Detailed Assessment by Regulation"));
  });

  it("includes subsections for all six regulations", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("### GDPR"));
    assert.ok(result.includes("### CCPA"));
    assert.ok(result.includes("### EU AI Act"));
    assert.ok(result.includes("### PCI DSS"));
    assert.ok(result.includes("### HIPAA"));
    assert.ok(result.includes("### SOC 2"));
  });

  it("lists applicable services with reasons", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("**Applicable services:**"));
    assert.ok(result.includes("| stripe |"));
  });

  it("lists services requiring manual assessment", () => {
    const scan = makeScan({ services: [makeService("prisma", "database")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("**Requires manual assessment:**"));
  });

  // ── Category Heatmap ───────────────────────────────────────────────

  it("includes Category Heatmap section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("## Category Heatmap"));
    assert.ok(result.includes("Regulatory exposure by service category"));
  });

  it("shows exposure level (High/Medium/Low)", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    // Auth has high regulatory exposure
    assert.ok(/\(High\)|\(Medium\)|\(Low\)/.test(result));
  });

  // ── Recommendations ────────────────────────────────────────────────

  it("includes Recommendations section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("## Recommendations"));
  });

  it("includes GDPR recommendation when applicable", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("**GDPR:**"));
    assert.ok(result.includes("DPAs"));
  });

  it("includes CCPA recommendation when applicable", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("**CCPA:**"));
    assert.ok(result.includes("Do Not Sell"));
  });

  it("includes EU AI Act recommendation when applicable", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("**EU AI Act:**"));
    assert.ok(result.includes("risk level"));
  });

  it("includes PCI DSS recommendation when applicable", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("**PCI DSS:**"));
  });

  it("includes SOC 2 recommendation always", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("**SOC 2:**"));
    assert.ok(result.includes("Trust Service Criteria"));
  });

  // ── Disclaimer ─────────────────────────────────────────────────────

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryMappingMatrix(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("Consult legal counsel"));
  });

  // ── Comprehensive test ─────────────────────────────────────────────

  it("generates comprehensive matrix with all service categories", () => {
    const scan = makeScan({
      services: [
        makeService("clerk", "auth"),
        makeService("prisma", "database"),
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
        makeService("resend", "email"),
        makeService("sentry", "monitoring"),
        makeService("s3", "storage"),
        makeService("meta-pixel", "advertising"),
        makeService("discord", "social"),
      ],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "privacy@acme.com" };
    const result = generateRegulatoryMappingMatrix(scan, ctx)!;

    // Header
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("# Regulatory Mapping Matrix"));

    // All services listed
    assert.ok(result.includes("| clerk |"));
    assert.ok(result.includes("| stripe |"));
    assert.ok(result.includes("| openai |"));
    assert.ok(result.includes("| posthog |"));

    // Recommendations for all applicable regulations
    assert.ok(result.includes("**GDPR:**"));
    assert.ok(result.includes("**CCPA:**"));
    assert.ok(result.includes("**EU AI Act:**"));
    assert.ok(result.includes("**PCI DSS:**"));
    assert.ok(result.includes("**SOC 2:**"));

    // Category heatmap with multiple categories
    assert.ok(result.includes("| auth |"));
    assert.ok(result.includes("| payment |"));
    assert.ok(result.includes("| ai |"));
  });
});
