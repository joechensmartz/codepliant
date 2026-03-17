import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateDataRetentionPolicy } from "./data-retention.js";
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

/** Helper: build a scan with enough services to trigger generation (MIN_SERVICES = 3). */
function makeFullScan(extra: DetectedService[] = []): ScanResult {
  return makeScan({
    services: [
      makeService("stripe", "payment", ["payment info"]),
      makeService("posthog", "analytics", ["page views"]),
      makeService("@clerk/nextjs", "auth", ["user credentials"]),
      ...extra,
    ],
  });
}

describe("generateDataRetentionPolicy", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateDataRetentionPolicy(scan), null);
  });

  it("returns null when fewer than 3 services detected", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("prisma", "database", ["user records"]),
      ],
    });
    assert.strictEqual(generateDataRetentionPolicy(scan), null);
  });

  it("returns null with exactly 2 services", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "database"),
      ],
    });
    assert.strictEqual(generateDataRetentionPolicy(scan), null);
  });

  // ── Generation with relevant services ──────────────────────────────

  it("generates policy when exactly 3 services detected", () => {
    const scan = makeFullScan();
    const result = generateDataRetentionPolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Data Retention Policy"));
  });

  it("generates policy with more than 3 services", () => {
    const scan = makeFullScan([
      makeService("openai", "ai", ["user prompts"]),
      makeService("@sentry/node", "monitoring", ["error traces"]),
    ]);
    const result = generateDataRetentionPolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Data Retention Policy"));
  });

  // ── Context values ────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeFullScan();
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "privacy@acme.com" };
    const result = generateDataRetentionPolicy(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses context contact email", () => {
    const scan = makeFullScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "privacy@acme.com" };
    const result = generateDataRetentionPolicy(scan, ctx)!;
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeFullScan();
    const result = generateDataRetentionPolicy(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses placeholder email when no context", () => {
    const scan = makeFullScan();
    const result = generateDataRetentionPolicy(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses context DPO email when provided", () => {
    const scan = makeFullScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", dpoEmail: "dpo@acme.com" };
    const result = generateDataRetentionPolicy(scan, ctx)!;
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("includes custom data retention days when provided", () => {
    const scan = makeFullScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", dataRetentionDays: 180 };
    const result = generateDataRetentionPolicy(scan, ctx)!;
    assert.ok(result.includes("180 days"));
  });

  // ── Key content: title and introduction ────────────────────────────

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeFullScan();
    const result = generateDataRetentionPolicy(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes project name", () => {
    const scan = makeFullScan();
    const result = generateDataRetentionPolicy(scan)!;
    assert.ok(result.includes("test-project"));
  });

  it("includes introduction section", () => {
    const scan = makeFullScan();
    const result = generateDataRetentionPolicy(scan)!;
    assert.ok(result.includes("## 1. Introduction"));
    assert.ok(result.includes("Data Retention Policy"));
  });

  // ── Retention Schedule Table ──────────────────────────────────────

  it("includes retention schedule table", () => {
    const scan = makeFullScan();
    const result = generateDataRetentionPolicy(scan)!;
    assert.ok(result.includes("## 2. Retention Schedule"));
    assert.ok(result.includes("Data Category"));
    assert.ok(result.includes("Data Types"));
    assert.ok(result.includes("Retention Period"));
    assert.ok(result.includes("Legal Basis"));
  });

  it("includes payment retention period of 7 years", () => {
    const scan = makeFullScan();
    const result = generateDataRetentionPolicy(scan)!;
    assert.ok(result.includes("7 years"));
  });

  it("includes analytics retention period", () => {
    const scan = makeFullScan();
    const result = generateDataRetentionPolicy(scan)!;
    assert.ok(result.includes("Analytics"));
    assert.ok(result.includes("2 years") || result.includes("26 months"));
  });

  it("includes auth retention as 'Until account deletion'", () => {
    const scan = makeFullScan();
    const result = generateDataRetentionPolicy(scan)!;
    assert.ok(result.includes("Until account deletion"));
  });

  it("includes GDPR legal basis references", () => {
    const scan = makeFullScan();
    const result = generateDataRetentionPolicy(scan)!;
    assert.ok(result.includes("Art. 6(1)"));
    assert.ok(result.includes("GDPR"));
  });

  it("includes AI retention period when AI services present", () => {
    const scan = makeFullScan([makeService("openai", "ai", ["user prompts"])]);
    const result = generateDataRetentionPolicy(scan)!;
    assert.ok(result.includes("90 days"));
    assert.ok(result.includes("AI Service"));
  });

  it("includes monitoring retention period when monitoring services present", () => {
    const scan = makeFullScan([makeService("@sentry/node", "monitoring", ["error traces"])]);
    const result = generateDataRetentionPolicy(scan)!;
    assert.ok(result.includes("Error Monitoring"));
    assert.ok(result.includes("90 days"));
  });

  // ── Retention Details by Category ─────────────────────────────────

  it("includes detailed retention information per category", () => {
    const scan = makeFullScan();
    const result = generateDataRetentionPolicy(scan)!;
    assert.ok(result.includes("## 3. Retention Details by Service Category"));
    assert.ok(result.includes("What data is retained"));
    assert.ok(result.includes("Retention period"));
    assert.ok(result.includes("Legal basis"));
    assert.ok(result.includes("Deletion procedure"));
  });

  it("includes payment-specific retention details", () => {
    const scan = makeFullScan();
    const result = generateDataRetentionPolicy(scan)!;
    assert.ok(result.includes("Payment Processing"));
    assert.ok(result.includes("Transaction history"));
    assert.ok(result.includes("tax and legal compliance") || result.includes("Tax laws"));
  });

  it("includes auth-specific deletion procedure", () => {
    const scan = makeFullScan();
    const result = generateDataRetentionPolicy(scan)!;
    assert.ok(result.includes("permanently erased"));
    assert.ok(result.includes("30 days"));
  });

  // ── Data Deletion Request Process ─────────────────────────────────

  it("includes data deletion request process", () => {
    const scan = makeFullScan();
    const result = generateDataRetentionPolicy(scan)!;
    assert.ok(result.includes("## 4. Data Deletion Request Process"));
    assert.ok(result.includes("How to Request"));
    assert.ok(result.includes("What Happens Next"));
  });

  it("includes deletion exceptions", () => {
    const scan = makeFullScan();
    const result = generateDataRetentionPolicy(scan)!;
    assert.ok(result.includes("Exceptions"));
    assert.ok(result.includes("Legal holds"));
    assert.ok(result.includes("Tax and financial records"));
  });

  it("includes partial deletion option", () => {
    const scan = makeFullScan();
    const result = generateDataRetentionPolicy(scan)!;
    assert.ok(result.includes("Partial Deletion"));
  });

  // ── Backup Retention Policy ───────────────────────────────────────

  it("includes backup retention policy", () => {
    const scan = makeFullScan();
    const result = generateDataRetentionPolicy(scan)!;
    assert.ok(result.includes("## 5. Backup Retention Policy"));
    assert.ok(result.includes("Daily backups"));
    assert.ok(result.includes("Weekly backups"));
    assert.ok(result.includes("Monthly backups"));
  });

  it("includes backup security details", () => {
    const scan = makeFullScan();
    const result = generateDataRetentionPolicy(scan)!;
    assert.ok(result.includes("AES-256"));
    assert.ok(result.includes("encrypted at rest"));
  });

  it("includes disaster recovery for backups", () => {
    const scan = makeFullScan();
    const result = generateDataRetentionPolicy(scan)!;
    assert.ok(result.includes("Disaster Recovery"));
    assert.ok(result.includes("re-applied"));
  });

  // ── Retention Review Process ──────────────────────────────────────

  it("includes retention review process", () => {
    const scan = makeFullScan();
    const result = generateDataRetentionPolicy(scan)!;
    assert.ok(result.includes("## 6. Retention Review Process"));
    assert.ok(result.includes("Quarterly reviews"));
    assert.ok(result.includes("Annual reviews"));
  });

  // ── Contact and Footer ────────────────────────────────────────────

  it("includes contact section", () => {
    const scan = makeFullScan();
    const result = generateDataRetentionPolicy(scan)!;
    assert.ok(result.includes("## 7. Contact"));
  });

  it("includes Codepliant attribution and legal disclaimer", () => {
    const scan = makeFullScan();
    const result = generateDataRetentionPolicy(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("legal professional"));
  });
});
