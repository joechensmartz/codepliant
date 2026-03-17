import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateSOC2Checklist } from "./soc2-checklist.js";
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

/** Helper: build a scan with enough services to trigger generation (MIN_SERVICES = 5). */
function makeFullScan(extra: DetectedService[] = []): ScanResult {
  return makeScan({
    services: [
      makeService("@clerk/nextjs", "auth", ["user credentials"]),
      makeService("@sentry/node", "monitoring", ["error traces"]),
      makeService("prisma", "database", ["user records"]),
      makeService("stripe", "payment", ["payment info"]),
      makeService("posthog", "analytics", ["page views"]),
      ...extra,
    ],
  });
}

describe("generateSOC2Checklist", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateSOC2Checklist(scan), null);
  });

  it("returns null when fewer than 5 services detected", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("prisma", "database", ["user records"]),
        makeService("posthog", "analytics", ["page views"]),
        makeService("@sentry/node", "monitoring", ["error traces"]),
      ],
    });
    assert.strictEqual(generateSOC2Checklist(scan), null);
  });

  it("returns null with exactly 4 services", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "database"),
        makeService("c", "monitoring"),
        makeService("d", "payment"),
      ],
    });
    assert.strictEqual(generateSOC2Checklist(scan), null);
  });

  // ── Generation with relevant services ──────────────────────────────

  it("generates checklist when exactly 5 services detected", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("SOC 2 Type II Readiness Checklist"));
  });

  it("generates checklist with more than 5 services", () => {
    const scan = makeFullScan([
      makeService("openai", "ai", ["user prompts"]),
      makeService("@sendgrid/mail", "email", ["email address"]),
    ]);
    const result = generateSOC2Checklist(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("SOC 2 Type II Readiness Checklist"));
  });

  // ── Context values ────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeFullScan();
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "legal@acme.com" };
    const result = generateSOC2Checklist(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses context contact email", () => {
    const scan = makeFullScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "legal@acme.com" };
    const result = generateSOC2Checklist(scan, ctx)!;
    assert.ok(result.includes("legal@acme.com"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses placeholder email when no context", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  // ── Key content: title and overview ────────────────────────────────

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes project name", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("test-project"));
  });

  it("includes overview section with service count", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("## 1. Overview"));
    assert.ok(result.includes("Detected services:"));
  });

  it("includes disclaimer about not being substitute for audit", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("Disclaimer"));
    assert.ok(result.includes("not a substitute"));
  });

  // ── Service-to-Control Mapping ────────────────────────────────────

  it("includes service-to-control mapping table", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("## 2. Service-to-Control Mapping"));
    assert.ok(result.includes("Detected Service"));
    assert.ok(result.includes("Category"));
    assert.ok(result.includes("Mapped SOC 2 Controls"));
  });

  it("maps auth services to CC6 (Security)", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("Authentication"));
    assert.ok(result.includes("Security (CC6)"));
  });

  it("maps payment services to C1, CC6, and PI1", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("Payment Processing"));
    assert.ok(result.includes("Confidentiality (C1)"));
  });

  it("maps analytics services to PI1 and P1-P8", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("Analytics"));
    assert.ok(result.includes("Processing Integrity (PI1)"));
    assert.ok(result.includes("Privacy (P1-P8)"));
  });

  // ── Security Section (CC6) — always present ───────────────────────

  it("includes Security (CC6) section", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("### Security (CC6)"));
    assert.ok(result.includes("CC6.1"));
    assert.ok(result.includes("CC6.6"));
    assert.ok(result.includes("CC6.8"));
  });

  it("includes access control checklist items for auth services", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("Review access control configuration for:"));
    assert.ok(result.includes("multi-factor authentication"));
  });

  it("includes encryption checklist items for database services", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("Enable encryption at rest for:"));
    assert.ok(result.includes("TLS 1.2+"));
  });

  it("includes vulnerability management section", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("Vulnerability Management"));
    assert.ok(result.includes("penetration testing"));
  });

  // ── Availability Section (A1) — always present ────────────────────

  it("includes Availability (A1) section", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("### Availability (A1)"));
    assert.ok(result.includes("A1.1"));
    assert.ok(result.includes("A1.2"));
    assert.ok(result.includes("A1.3"));
  });

  it("includes monitoring-specific items when monitoring services detected", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("Configure alerting in:"));
  });

  it("includes disaster recovery section", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("Disaster Recovery"));
    assert.ok(result.includes("RTO and RPO"));
  });

  it("includes capacity planning section", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("Capacity Planning"));
    assert.ok(result.includes("resource utilization") || result.includes("Resource utilization"));
  });

  // ── Processing Integrity (PI1) — conditional ──────────────────────

  it("includes Processing Integrity (PI1) when payment services present", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("### Processing Integrity (PI1)"));
    assert.ok(result.includes("idempotency controls"));
  });

  it("includes AI validation items when AI services present", () => {
    const scan = makeFullScan([makeService("openai", "ai", ["user prompts"])]);
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("Validate AI model inputs and outputs"));
    assert.ok(result.includes("guardrails"));
  });

  it("includes change management section", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("Change Management"));
    assert.ok(result.includes("code review"));
  });

  // ── Confidentiality (C1) — conditional ────────────────────────────

  it("includes Confidentiality (C1) when database or payment services present", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("### Confidentiality (C1)"));
    assert.ok(result.includes("Data Classification"));
  });

  it("includes PCI DSS alignment when payment services present", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("PCI DSS Alignment"));
    assert.ok(result.includes("tokenization"));
  });

  it("includes encryption at rest for databases", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("transparent data encryption"));
  });

  // ── Privacy (P1-P8) — conditional ─────────────────────────────────

  it("includes Privacy (P1-P8) when analytics services present", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("### Privacy (P1-P8)"));
    assert.ok(result.includes("P1 — Notice"));
    assert.ok(result.includes("P2 — Choice and Consent"));
    assert.ok(result.includes("P3 — Collection"));
    assert.ok(result.includes("P4 — Use, Retention, and Disposal"));
    assert.ok(result.includes("P5 — Access"));
    assert.ok(result.includes("P6 — Disclosure"));
    assert.ok(result.includes("P7 — Data Quality"));
    assert.ok(result.includes("P8 — Monitoring and Enforcement"));
  });

  it("includes cookie consent item when analytics present", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("cookie consent"));
  });

  it("includes DPO appointment item", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("Data Protection Officer"));
  });

  // ── Audit Timeline ────────────────────────────────────────────────

  it("includes recommended audit timeline", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("## 4. Recommended Audit Timeline"));
    assert.ok(result.includes("Gap Assessment"));
    assert.ok(result.includes("Remediation"));
    assert.ok(result.includes("Evidence Collection"));
    assert.ok(result.includes("Type II Audit"));
  });

  // ── Evidence Collection Guide ─────────────────────────────────────

  it("includes evidence collection guide", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("## 5. Evidence Collection Guide"));
    assert.ok(result.includes("Evidence Artifact"));
  });

  it("includes evidence artifacts for each control area", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("Access control matrix"));
    assert.ok(result.includes("Uptime reports"));
    assert.ok(result.includes("CI/CD pipeline configs"));
    assert.ok(result.includes("Data classification inventory"));
    assert.ok(result.includes("Privacy Policy"));
  });

  // ── Next Steps ────────────────────────────────────────────────────

  it("includes next steps section", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("## 6. Next Steps"));
    assert.ok(result.includes("Assign an owner"));
    assert.ok(result.includes("gap assessment"));
  });

  // ── Footer and disclaimer ─────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeFullScan();
    const result = generateSOC2Checklist(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("qualified professional"));
  });
});
