import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateComplianceEvidenceLog } from "./compliance-evidence-log.js";
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

describe("generateComplianceEvidenceLog", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateComplianceEvidenceLog(scan), null);
  });

  // ── Basic generation ───────────────────────────────────────────────

  it("generates document with a single service", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result !== null);
    assert.ok(result.includes("# Compliance Evidence Log"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  // ── Context values ─────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generateComplianceEvidenceLog(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context DPO name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", dpoName: "Jane Doe" };
    const result = generateComplianceEvidenceLog(scan, ctx)!;
    assert.ok(result.includes("Jane Doe"));
  });

  it("uses placeholder DPO name when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("[Compliance Officer Name]"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "privacy@acme.com" };
    const result = generateComplianceEvidenceLog(scan, ctx)!;
    assert.ok(result.includes("privacy@acme.com"));
  });

  // ── Header metadata ────────────────────────────────────────────────

  it("includes next review date", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("Next Review"));
  });

  it("includes services in scope count", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("**Services in Scope:** 2"));
  });

  it("includes disclaimer about auto-generation", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("auto-generated from code analysis"));
  });

  // ── Summary section ────────────────────────────────────────────────

  it("includes Summary section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("## Summary"));
  });

  it("shows total controls count", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("Total Controls"));
  });

  it("shows evidence collected count", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("Evidence Collected"));
  });

  it("shows evidence pending count", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("Evidence Pending"));
  });

  it("shows completion rate percentage", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("Completion Rate"));
    assert.ok(/%/.test(result));
  });

  // ── SOC 2 Evidence section ─────────────────────────────────────────

  it("includes SOC 2 Evidence section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("## SOC 2 Evidence"));
  });

  it("includes CC1.1 organizational commitment control", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("CC1.1"));
    assert.ok(result.includes("Organizational Commitment to Integrity"));
  });

  it("includes CC2.1 internal communication control", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("CC2.1"));
    assert.ok(result.includes("Internal Communication"));
  });

  it("includes CC3.1 risk assessment control", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("CC3.1"));
    assert.ok(result.includes("Risk Assessment Process"));
  });

  it("includes CC8.1 change management control", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("CC8.1"));
    assert.ok(result.includes("Change Management Process"));
  });

  it("includes CC9.1 incident response control", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("CC9.1"));
    assert.ok(result.includes("Incident Response"));
  });

  // ── Conditional SOC 2 controls ─────────────────────────────────────

  it("includes CC5.1 access controls when auth detected", () => {
    const scan = makeScan({ services: [makeService("@clerk/nextjs", "auth")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("CC5.1"));
    assert.ok(result.includes("Logical Access Controls"));
  });

  it("does not include CC5.1 without auth services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(!result.includes("CC5.1"));
  });

  it("includes CC5.2 data protection when database detected", () => {
    const scan = makeScan({ services: [makeService("prisma", "database")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("CC5.2"));
    assert.ok(result.includes("Data Protection Controls"));
  });

  it("does not include CC5.2 without database services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(!result.includes("CC5.2"));
  });

  it("includes CC6.2 infrastructure access when cloud storage detected", () => {
    const scan = makeScan({ services: [makeService("s3", "storage")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("CC6.2"));
    assert.ok(result.includes("Infrastructure Access"));
  });

  it("does not include CC6.2 without storage services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(!result.includes("CC6.2"));
  });

  it("includes CC7.2 system monitoring when monitoring detected", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("CC7.2"));
    assert.ok(result.includes("System Monitoring"));
  });

  it("does not include CC7.2 without monitoring services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(!result.includes("CC7.2"));
  });

  // ── ISO 27001 Evidence section ─────────────────────────────────────

  it("includes ISO 27001 Evidence section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("## ISO 27001 Evidence"));
  });

  it("includes A.5.1 information security policy control", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("A.5.1"));
    assert.ok(result.includes("Information Security Policy"));
  });

  it("includes A.8.1 asset inventory with service count", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("A.8.1"));
    assert.ok(result.includes("2 detected service(s)"));
  });

  it("includes A.10.1 cryptographic controls", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("A.10.1"));
    assert.ok(result.includes("Cryptographic Controls"));
  });

  it("includes A.14.1 secure development control", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("A.14.1"));
    assert.ok(result.includes("Secure Development"));
  });

  it("includes A.15.1 supplier security when 3+ services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("sentry", "monitoring"),
      ],
    });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("A.15.1"));
    assert.ok(result.includes("Supplier Security"));
  });

  it("does not include A.15.1 with fewer than 3 services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(!result.includes("A.15.1"));
  });

  it("includes A.16.1 incident management control", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("A.16.1"));
    assert.ok(result.includes("Incident Management Process"));
  });

  it("includes A.18.1 compliance control", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("A.18.1"));
    assert.ok(result.includes("Legal and Regulatory Compliance"));
  });

  // ── A.12.4 Logging status depends on monitoring ────────────────────

  it("shows A.12.4 as Collected when monitoring service detected", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("A.12.4"));
    // The ISO table row for A.12.4 should show Collected
    const lines = result.split("\n");
    const a124Line = lines.find((l) => l.includes("A.12.4"));
    assert.ok(a124Line);
    assert.ok(a124Line.includes("Collected"));
  });

  it("shows A.12.4 as Pending when no monitoring service", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    const lines = result.split("\n");
    const a124Line = lines.find((l) => l.includes("A.12.4"));
    assert.ok(a124Line);
    assert.ok(a124Line.includes("Pending"));
  });

  // ── Category-specific controls ─────────────────────────────────────

  it("includes AI governance control when AI detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("AI-1"));
    assert.ok(result.includes("AI Governance"));
  });

  it("does not include AI governance without AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(!result.includes("AI-1"));
  });

  it("includes PCI-1 payment control when payment detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("PCI-1"));
    assert.ok(result.includes("Payment Data Handling"));
  });

  it("does not include PCI-1 without payment services", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(!result.includes("PCI-1"));
  });

  it("includes PRIV-1 consent management when analytics detected", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("PRIV-1"));
    assert.ok(result.includes("Consent Management"));
  });

  it("does not include PRIV-1 without analytics/advertising", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(!result.includes("PRIV-1"));
  });

  // ── Evidence Collection Schedule ───────────────────────────────────

  it("includes Evidence Collection Schedule section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("## Evidence Collection Schedule"));
  });

  it("includes weekly access log review", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("Weekly"));
    assert.ok(result.includes("Review access logs"));
  });

  it("includes quarterly evidence review", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("Quarterly"));
    assert.ok(result.includes("Full evidence collection review"));
  });

  it("includes AI model governance review when AI detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("AI model governance review"));
  });

  it("does not include AI governance schedule without AI", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(!result.includes("AI model governance review"));
  });

  it("includes PCI DSS self-assessment when payment detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("PCI DSS self-assessment update"));
  });

  it("does not include PCI DSS schedule without payment", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(!result.includes("PCI DSS self-assessment update"));
  });

  // ── Evidence Quality Checklist ─────────────────────────────────────

  it("includes Evidence Quality Checklist section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("## Evidence Quality Checklist"));
  });

  it("includes dated and timestamped check", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("Evidence is dated and timestamped"));
  });

  it("includes production environment check", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("Evidence is from the production environment"));
  });

  // ── Services in Scope section ──────────────────────────────────────

  it("includes Services in Scope section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("## Services in Scope"));
  });

  it("lists detected services with category", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["cardholder data"]),
        makeService("openai", "ai", ["user prompts"]),
      ],
    });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("| stripe | payment |"));
    assert.ok(result.includes("| openai | ai |"));
  });

  it("deduplicates services in scope table", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateComplianceEvidenceLog(scan)!;
    const lines = result.split("\n").filter((l) => l.includes("| stripe |"));
    assert.strictEqual(lines.length, 1);
  });

  // ── Footer ─────────────────────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("Codepliant"));
  });

  it("includes review disclaimer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceEvidenceLog(scan)!;
    assert.ok(result.includes("reviewed and updated regularly"));
  });

  // ── Comprehensive test ─────────────────────────────────────────────

  it("generates comprehensive log with all service categories", () => {
    const scan = makeScan({
      services: [
        makeService("@clerk/nextjs", "auth"),
        makeService("prisma", "database"),
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
        makeService("sentry", "monitoring"),
        makeService("s3", "storage"),
      ],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      dpoName: "Jane Doe",
    };
    const result = generateComplianceEvidenceLog(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("Jane Doe"));
    assert.ok(result.includes("## SOC 2 Evidence"));
    assert.ok(result.includes("## ISO 27001 Evidence"));
    assert.ok(result.includes("CC5.1")); // auth
    assert.ok(result.includes("CC5.2")); // database
    assert.ok(result.includes("CC6.2")); // storage
    assert.ok(result.includes("CC7.2")); // monitoring
    assert.ok(result.includes("AI-1")); // ai
    assert.ok(result.includes("PCI-1")); // payment
    assert.ok(result.includes("PRIV-1")); // analytics
    assert.ok(result.includes("A.15.1")); // 3+ services
    assert.ok(result.includes("**Services in Scope:** 7"));
  });
});
