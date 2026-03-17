import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import type { DatabaseScanResult } from "../scanner/database-scanner.js";
import type { CloudScanResult, CloudDetection } from "../scanner/cloud-scanner.js";
import { generateEncryptionPolicy } from "./encryption-policy.js";

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

function makeDbScan(types: Array<import("../scanner/database-scanner.js").DatabaseType> = []): DatabaseScanResult {
  return {
    databases: types.map((t) => ({
      type: t,
      evidence: [{ source: "dependency" as const, file: "package.json", detail: `${t} detected` }],
    })),
  };
}

function makeCloudScan(providers: CloudDetection[] = []): CloudScanResult {
  return {
    providers,
    crossBorderTransferLikely: false,
    transferNotes: [],
  };
}

function makeCloudDetection(provider: import("../scanner/cloud-scanner.js").CloudProvider, displayName: string): CloudDetection {
  return {
    provider,
    displayName,
    evidence: [{ type: "dependency" as const, detail: `${provider} sdk`, file: "package.json" }],
    regions: [],
    dataResidencyNotes: "",
  };
}

describe("generateEncryptionPolicy", () => {
  // ── Null behavior ──────────────────────────────────────────────────

  it("returns null when no databases, storage, or dbScan", () => {
    const scan = makeScan({ services: [] });
    const result = generateEncryptionPolicy(scan);
    assert.strictEqual(result, null);
  });

  it("returns null when services exist but none are database/storage", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai"), makeService("stripe", "payment")],
    });
    const result = generateEncryptionPolicy(scan);
    assert.strictEqual(result, null);
  });

  it("returns null when dbScan is provided but has empty databases array", () => {
    const scan = makeScan({ services: [] });
    const result = generateEncryptionPolicy(scan, undefined, makeDbScan([]));
    assert.strictEqual(result, null);
  });

  // ── Basic generation ───────────────────────────────────────────────

  it("generates policy when database service is detected", () => {
    const scan = makeScan({
      services: [makeService("PostgreSQL", "database")],
    });
    const result = generateEncryptionPolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Encryption Policy"));
  });

  it("generates policy when storage service is detected", () => {
    const scan = makeScan({
      services: [makeService("S3", "storage")],
    });
    const result = generateEncryptionPolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Encryption Policy"));
    assert.ok(result.includes("S3 (Storage)"));
  });

  it("generates policy when dbScan has databases", () => {
    const scan = makeScan({ services: [] });
    const result = generateEncryptionPolicy(scan, undefined, makeDbScan(["postgresql"]));
    assert.ok(result !== null);
    assert.ok(result.includes("Postgresql"));
  });

  // ── Header and metadata ────────────────────────────────────────────

  it("includes last updated date", () => {
    const scan = makeScan({ services: [makeService("Redis", "database")] });
    const result = generateEncryptionPolicy(scan)!;
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(`**Last updated:** ${today}`));
  });

  it("includes project name and organization", () => {
    const scan = makeScan({
      projectName: "my-saas",
      services: [makeService("PostgreSQL", "database")],
    });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(result.includes("**Project:** my-saas"));
    assert.ok(result.includes("**Organization:** [Your Company Name]"));
  });

  it("includes compliance references in intro", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(result.includes("GDPR Article 32"));
    assert.ok(result.includes("SOC 2 CC6.1"));
    assert.ok(result.includes("ISO 27001 Annex A.10"));
    assert.ok(result.includes("PCI DSS Requirement 3 & 4"));
  });

  // ── Context values ─────────────────────────────────────────────────

  it("uses default placeholders when no context provided", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses context values when provided", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateEncryptionPolicy(scan, {
      companyName: "Acme Corp",
      contactEmail: "info@acme.com",
      securityEmail: "security@acme.com",
    })!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("security@acme.com"));
  });

  it("falls back to contactEmail when securityEmail not provided", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateEncryptionPolicy(scan, {
      companyName: "Acme Corp",
      contactEmail: "contact@acme.com",
    })!;
    assert.ok(result.includes("contact@acme.com"));
  });

  // ── Section 1: Encryption at Rest ──────────────────────────────────

  it("includes at-rest encryption table", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(result.includes("## 1. Encryption at Rest"));
    assert.ok(result.includes("| Data Store | Encryption Method"));
  });

  it("shows dbScan-detected database in at-rest table", () => {
    const scan = makeScan({ services: [] });
    const result = generateEncryptionPolicy(scan, undefined, makeDbScan(["mysql"]))!;
    assert.ok(result.includes("Mysql"));
    assert.ok(result.includes("InnoDB tablespace encryption"));
  });

  it("shows service-detected database in at-rest table when no dbScan overlap", () => {
    const scan = makeScan({ services: [makeService("mongodb", "database")] });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(result.includes("mongodb"));
    assert.ok(result.includes("WiredTiger"));
  });

  it("avoids duplicate entries when dbScan and service both detect same database", () => {
    const scan = makeScan({ services: [makeService("postgresql", "database")] });
    const dbScan = makeDbScan(["postgresql"]);
    const result = generateEncryptionPolicy(scan, undefined, dbScan)!;
    // Count occurrences of Postgresql in table rows
    const tableRows = result.split("\n").filter((l) => l.startsWith("| Postgresql") || l.startsWith("| postgresql"));
    assert.strictEqual(tableRows.length, 1);
  });

  it("shows storage encryption for storage services", () => {
    const scan = makeScan({ services: [makeService("S3", "storage")] });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(result.includes("S3 (Storage)"));
    assert.ok(result.includes("AES-256 server-side encryption"));
  });

  // ── Section 1.1: Data type requirements ────────────────────────────

  it("includes data type requirements table", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(result.includes("### 1.1 Encryption Requirements by Data Type"));
    assert.ok(result.includes("User credentials"));
    assert.ok(result.includes("Personal Identifiable Information"));
    assert.ok(result.includes("Audit logs"));
    assert.ok(result.includes("Backups"));
  });

  it("includes payment data rows when payment service detected", () => {
    const scan = makeScan({
      services: [makeService("PostgreSQL", "database"), makeService("stripe", "payment")],
    });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(result.includes("Payment card data"));
    assert.ok(result.includes("Financial transaction data"));
    assert.ok(result.includes("PCI DSS Req. 3"));
  });

  it("excludes payment data rows when no payment service", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(!result.includes("Payment card data"));
    assert.ok(!result.includes("Financial transaction data"));
  });

  it("includes auth data rows when auth service detected", () => {
    const scan = makeScan({
      services: [makeService("PostgreSQL", "database"), makeService("next-auth", "auth")],
    });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(result.includes("Session data"));
    assert.ok(result.includes("OAuth tokens"));
  });

  it("excludes auth data rows when no auth service", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(!result.includes("Session data"));
    assert.ok(!result.includes("OAuth tokens"));
  });

  it("includes AI data rows when AI service detected", () => {
    const scan = makeScan({
      services: [makeService("PostgreSQL", "database"), makeService("openai", "ai")],
    });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(result.includes("AI training data"));
  });

  it("excludes AI data rows when no AI service", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(!result.includes("AI training data"));
  });

  // ── Section 2: In-Transit Encryption ───────────────────────────────

  it("includes in-transit encryption section", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(result.includes("## 2. Encryption in Transit"));
    assert.ok(result.includes("TLS 1.2"));
    assert.ok(result.includes("TLS 1.3"));
  });

  it("includes TLS configuration requirements table", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(result.includes("### 2.1 TLS Configuration Requirements"));
    assert.ok(result.includes("HSTS"));
    assert.ok(result.includes("Certificate pinning"));
  });

  it("includes connection type requirements table", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(result.includes("### 2.2 In-Transit Requirements by Connection Type"));
    assert.ok(result.includes("Browser to application"));
    assert.ok(result.includes("Application to database"));
  });

  it("includes payment processor row in transit table when payment detected", () => {
    const scan = makeScan({
      services: [makeService("PostgreSQL", "database"), makeService("stripe", "payment")],
    });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(result.includes("Payment processor communication"));
    assert.ok(result.includes("PCI DSS Req. 4"));
  });

  it("excludes payment processor row when no payment service", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(!result.includes("Payment processor communication"));
  });

  it("includes AI service API row when AI detected", () => {
    const scan = makeScan({
      services: [makeService("PostgreSQL", "database"), makeService("openai", "ai")],
    });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(result.includes("AI service API calls"));
  });

  it("excludes AI service API row when no AI service", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(!result.includes("AI service API calls"));
  });

  // ── Section 3: Key Management ──────────────────────────────────────

  it("includes key management section", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(result.includes("## 3. Key Management Procedures"));
    assert.ok(result.includes("### 3.1 Key Lifecycle"));
    assert.ok(result.includes("### 3.2 Key Rotation Schedule"));
    assert.ok(result.includes("### 3.3 Key Storage Requirements"));
  });

  it("includes payment key rotation row when payment detected", () => {
    const scan = makeScan({
      services: [makeService("PostgreSQL", "database"), makeService("stripe", "payment")],
    });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(result.includes("Payment encryption keys"));
    assert.ok(result.includes("PCI DSS Req. 3.6"));
  });

  it("excludes payment key rotation row when no payment", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(!result.includes("Payment encryption keys"));
  });

  it("lists prohibited key storage locations", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(result.includes("Source code repositories"));
    assert.ok(result.includes("Unencrypted configuration files"));
    assert.ok(result.includes("Application logs"));
  });

  // ── Section 4: Cloud Provider Encryption ───────────────────────────

  it("includes cloud provider section when cloudScan has providers", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const cloud = makeCloudScan([makeCloudDetection("aws", "Amazon Web Services")]);
    const result = generateEncryptionPolicy(scan, undefined, undefined, cloud)!;
    assert.ok(result.includes("## 4. Cloud Provider Encryption"));
    assert.ok(result.includes("Amazon Web Services"));
    assert.ok(result.includes("AWS KMS"));
  });

  it("excludes cloud provider section when no cloudScan", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(!result.includes("Cloud Provider Encryption"));
  });

  it("excludes cloud provider section when cloudScan has empty providers", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const cloud = makeCloudScan([]);
    const result = generateEncryptionPolicy(scan, undefined, undefined, cloud)!;
    assert.ok(!result.includes("Cloud Provider Encryption"));
  });

  it("shows multiple cloud providers", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const cloud = makeCloudScan([
      makeCloudDetection("aws", "Amazon Web Services"),
      makeCloudDetection("gcp", "Google Cloud Platform"),
    ]);
    const result = generateEncryptionPolicy(scan, undefined, undefined, cloud)!;
    assert.ok(result.includes("Amazon Web Services"));
    assert.ok(result.includes("Google Cloud Platform"));
    assert.ok(result.includes("GCP KMS"));
  });

  it("handles unknown cloud provider gracefully", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const cloud = makeCloudScan([makeCloudDetection("fly-io", "Fly.io")]);
    const result = generateEncryptionPolicy(scan, undefined, undefined, cloud)!;
    assert.ok(result.includes("Fly.io"));
  });

  // ── Compliance Mapping section number adjusts ──────────────────────

  it("numbers compliance section as 5 when cloud providers present", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const cloud = makeCloudScan([makeCloudDetection("aws", "AWS")]);
    const result = generateEncryptionPolicy(scan, undefined, undefined, cloud)!;
    assert.ok(result.includes("## 5. Compliance Mapping"));
  });

  it("numbers compliance section as 4 when no cloud providers", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(result.includes("## 4. Compliance Mapping"));
  });

  // ── Compliance Mapping content ─────────────────────────────────────

  it("includes standard compliance entries", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(result.includes("GDPR Article 32"));
    assert.ok(result.includes("SOC 2 CC6.1"));
    assert.ok(result.includes("ISO 27001 A.10"));
    assert.ok(result.includes("NIST SP 800-111"));
    assert.ok(result.includes("NIST SP 800-52"));
  });

  it("includes PCI DSS compliance rows when payment detected", () => {
    const scan = makeScan({
      services: [makeService("PostgreSQL", "database"), makeService("stripe", "payment")],
    });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(result.includes("PCI DSS Req. 3"));
    assert.ok(result.includes("PCI DSS Req. 4"));
  });

  it("excludes PCI DSS compliance rows when no payment", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateEncryptionPolicy(scan)!;
    // The intro mentions PCI DSS but the compliance mapping table should not have the PCI rows
    const lines = result.split("\n");
    const complianceLines = lines.filter((l) => l.includes("PCI DSS Req. 3 |") || l.includes("PCI DSS Req. 4 |"));
    assert.strictEqual(complianceLines.length, 0);
  });

  // ── Policy Review section ──────────────────────────────────────────

  it("includes policy review section", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(result.includes("Policy Review"));
    assert.ok(result.includes("annually"));
    assert.ok(result.includes("security incident"));
  });

  // ── Disclaimer ─────────────────────────────────────────────────────

  it("includes Codepliant disclaimer with project name", () => {
    const scan = makeScan({
      projectName: "my-app",
      services: [makeService("PostgreSQL", "database")],
    });
    const result = generateEncryptionPolicy(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("my-app"));
    assert.ok(result.includes("reviewed by your security"));
  });

  // ── Multiple database types ────────────────────────────────────────

  it("handles multiple database types from dbScan", () => {
    const scan = makeScan({ services: [] });
    const result = generateEncryptionPolicy(scan, undefined, makeDbScan(["postgresql", "redis", "dynamodb"]))!;
    assert.ok(result.includes("Postgresql"));
    assert.ok(result.includes("Redis"));
    assert.ok(result.includes("Dynamodb"));
  });

  // ── All conditional sections together ──────────────────────────────

  it("includes all conditional sections when all service types present", () => {
    const scan = makeScan({
      services: [
        makeService("PostgreSQL", "database"),
        makeService("stripe", "payment"),
        makeService("next-auth", "auth"),
        makeService("openai", "ai"),
        makeService("S3", "storage"),
      ],
    });
    const cloud = makeCloudScan([makeCloudDetection("aws", "AWS")]);
    const result = generateEncryptionPolicy(scan, undefined, undefined, cloud)!;
    assert.ok(result.includes("Payment card data"));
    assert.ok(result.includes("Session data"));
    assert.ok(result.includes("AI training data"));
    assert.ok(result.includes("Payment processor communication"));
    assert.ok(result.includes("AI service API calls"));
    assert.ok(result.includes("Payment encryption keys"));
    assert.ok(result.includes("Cloud Provider Encryption"));
  });
});
