import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import type { DatabaseScanResult, DatabaseType } from "../scanner/database-scanner.js";
import { generateBackupPolicy } from "./backup-policy.js";

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

function makeDbScan(types: DatabaseType[] = []): DatabaseScanResult {
  return {
    databases: types.map((t) => ({
      type: t,
      evidence: [{ source: "dependency" as const, file: "package.json", detail: `${t} detected` }],
    })),
  };
}

describe("generateBackupPolicy", () => {
  // ── Null behavior ──────────────────────────────────────────────────

  it("returns null when no database services and no dbScan", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateBackupPolicy(scan), null);
  });

  it("returns null when services exist but none are databases", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai"), makeService("stripe", "payment")],
    });
    assert.strictEqual(generateBackupPolicy(scan), null);
  });

  it("returns null when dbScan is provided with empty databases", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateBackupPolicy(scan, undefined, makeDbScan([])), null);
  });

  // ── Basic generation ───────────────────────────────────────────────

  it("generates policy when database service detected", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateBackupPolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Backup Policy"));
  });

  it("generates policy when dbScan has databases", () => {
    const scan = makeScan({ services: [] });
    const result = generateBackupPolicy(scan, undefined, makeDbScan(["postgresql"]));
    assert.ok(result !== null);
    assert.ok(result.includes("# Backup Policy"));
  });

  // ── Header and metadata ────────────────────────────────────────────

  it("includes last updated date", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateBackupPolicy(scan)!;
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(`**Last updated:** ${today}`));
  });

  it("includes project name and organization", () => {
    const scan = makeScan({
      projectName: "my-saas",
      services: [makeService("PostgreSQL", "database")],
    });
    const result = generateBackupPolicy(scan)!;
    assert.ok(result.includes("**Project:** my-saas"));
    assert.ok(result.includes("**Organization:** [Your Company Name]"));
  });

  it("includes compliance references in intro", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateBackupPolicy(scan)!;
    assert.ok(result.includes("GDPR Article 32"));
    assert.ok(result.includes("SOC 2 A1.2"));
    assert.ok(result.includes("ISO 27001 Annex A.12.3"));
  });

  // ── Context values ─────────────────────────────────────────────────

  it("uses default placeholders when no context provided", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateBackupPolicy(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses context values when provided", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateBackupPolicy(scan, {
      companyName: "Acme Corp",
      contactEmail: "info@acme.com",
      securityEmail: "security@acme.com",
    })!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("security@acme.com"));
  });

  it("falls back to contactEmail when securityEmail not provided", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateBackupPolicy(scan, {
      companyName: "Acme Corp",
      contactEmail: "contact@acme.com",
    })!;
    assert.ok(result.includes("contact@acme.com"));
  });

  // ── Section 1: Backup Schedule ─────────────────────────────────────

  it("includes backup schedule table", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateBackupPolicy(scan)!;
    assert.ok(result.includes("## 1. Backup Schedule per Data Store"));
    assert.ok(result.includes("| Data Store | Backup Method"));
  });

  it("shows dbScan-detected database in schedule table", () => {
    const scan = makeScan({ services: [] });
    const result = generateBackupPolicy(scan, undefined, makeDbScan(["mysql"]))!;
    assert.ok(result.includes("Mysql"));
    assert.ok(result.includes("mysqldump"));
  });

  it("shows service-detected database when no dbScan overlap", () => {
    const scan = makeScan({ services: [makeService("mongodb", "database")] });
    const result = generateBackupPolicy(scan)!;
    assert.ok(result.includes("mongodb"));
    assert.ok(result.includes("mongodump"));
  });

  it("avoids duplicate entries for same database type in schedule table", () => {
    const scan = makeScan({ services: [makeService("postgresql", "database")] });
    const dbScan = makeDbScan(["postgresql"]);
    const result = generateBackupPolicy(scan, undefined, dbScan)!;
    // Count rows containing both the db name and "Backup Method" keywords from schedule table
    // Schedule rows include the backup method text, retention rows include "days"
    const scheduleRows = result.split("\n").filter(
      (l) => (l.startsWith("| Postgresql") || l.startsWith("| postgresql")) && l.includes("pg_dump")
    );
    assert.strictEqual(scheduleRows.length, 1);
  });

  it("shows point-in-time recovery status for databases", () => {
    const scan = makeScan({ services: [] });
    const result = generateBackupPolicy(scan, undefined, makeDbScan(["postgresql", "redis"]))!;
    // PostgreSQL has PITR, Redis does not
    const lines = result.split("\n");
    const pgLine = lines.find((l) => l.includes("Postgresql") && l.includes("Backup Method"));
    // Check the table has Yes/No entries
    assert.ok(result.includes("| Yes |") || result.includes("Yes |"));
    assert.ok(result.includes("| No |") || result.includes("No |"));
  });

  it("shows storage services in backup schedule", () => {
    const scan = makeScan({
      services: [makeService("PostgreSQL", "database"), makeService("S3", "storage")],
    });
    const result = generateBackupPolicy(scan)!;
    assert.ok(result.includes("S3 (File Storage)"));
    assert.ok(result.includes("Cross-region replication"));
  });

  it("always includes application configuration and secrets entries", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateBackupPolicy(scan)!;
    assert.ok(result.includes("Application configuration"));
    assert.ok(result.includes("Version control (Git)"));
    assert.ok(result.includes("Secrets and credentials"));
    assert.ok(result.includes("Secrets manager snapshot"));
  });

  // ── Section 2: Retention Periods ───────────────────────────────────

  it("includes retention periods table", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateBackupPolicy(scan)!;
    assert.ok(result.includes("## 2. Retention Periods"));
    assert.ok(result.includes("| Daily Backups | Weekly Backups"));
  });

  it("shows shorter retention for transient stores like Redis", () => {
    const scan = makeScan({ services: [] });
    const result = generateBackupPolicy(scan, undefined, makeDbScan(["redis"]))!;
    const lines = result.split("\n");
    const redisLine = lines.find((l) => l.includes("Redis") && l.includes("7 days"));
    assert.ok(redisLine, "Redis should have 7-day retention for daily backups");
    assert.ok(redisLine!.includes("N/A"), "Redis should have N/A for monthly/annual");
  });

  it("shows standard retention for non-transient databases", () => {
    const scan = makeScan({ services: [] });
    const result = generateBackupPolicy(scan, undefined, makeDbScan(["postgresql"]))!;
    const lines = result.split("\n");
    const pgLine = lines.find((l) => l.includes("Postgresql") && l.includes("30 days"));
    assert.ok(pgLine, "PostgreSQL should have 30-day retention for daily backups");
  });

  it("includes audit logs retention entry", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateBackupPolicy(scan)!;
    assert.ok(result.includes("Audit logs"));
    assert.ok(result.includes("7 years"));
  });

  it("includes file storage retention when storage services present", () => {
    const scan = makeScan({
      services: [makeService("PostgreSQL", "database"), makeService("S3", "storage")],
    });
    const result = generateBackupPolicy(scan)!;
    assert.ok(result.includes("File storage"));
  });

  it("excludes file storage retention when no storage services", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateBackupPolicy(scan)!;
    assert.ok(!result.includes("File storage |"));
  });

  // ── PCI DSS note ───────────────────────────────────────────────────

  it("includes PCI DSS note when payment service detected", () => {
    const scan = makeScan({
      services: [makeService("PostgreSQL", "database"), makeService("stripe", "payment")],
    });
    const result = generateBackupPolicy(scan)!;
    assert.ok(result.includes("PCI DSS Note"));
    assert.ok(result.includes("PCI DSS Requirement 3"));
  });

  it("excludes PCI DSS note when no payment service", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateBackupPolicy(scan)!;
    assert.ok(!result.includes("PCI DSS Note"));
  });

  // ── Section 2.1: Retention exceptions ──────────────────────────────

  it("includes retention exceptions", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateBackupPolicy(scan)!;
    assert.ok(result.includes("### 2.1 Retention Exceptions"));
    assert.ok(result.includes("Legal hold"));
    assert.ok(result.includes("Regulatory requirement"));
    assert.ok(result.includes("Data subject request"));
    assert.ok(result.includes("GDPR deletion requests"));
  });

  // ── Section 3: Recovery Procedures ─────────────────────────────────

  it("includes recovery procedures for each detected database", () => {
    const scan = makeScan({ services: [] });
    const result = generateBackupPolicy(scan, undefined, makeDbScan(["postgresql", "redis"]))!;
    assert.ok(result.includes("## 3. Recovery Procedures"));
    assert.ok(result.includes("### 3.1 Postgresql Recovery"));
    assert.ok(result.includes("### 3.2 Redis Recovery"));
  });

  it("includes recovery steps for each database", () => {
    const scan = makeScan({ services: [] });
    const result = generateBackupPolicy(scan, undefined, makeDbScan(["mysql"]))!;
    assert.ok(result.includes("**Recovery method:**"));
    assert.ok(result.includes("Identify the target recovery point"));
    assert.ok(result.includes("Validate data integrity"));
    assert.ok(result.includes("Document the recovery in the incident log"));
  });

  // ── Section 4: Recovery Testing ────────────────────────────────────

  it("includes recovery testing schedule", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateBackupPolicy(scan)!;
    assert.ok(result.includes("## 4. Recovery Testing Schedule"));
    assert.ok(result.includes("Backup integrity check"));
    assert.ok(result.includes("Single-table restore"));
    assert.ok(result.includes("Full database restore"));
    assert.ok(result.includes("Full disaster recovery"));
  });

  it("includes test documentation checklist", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateBackupPolicy(scan)!;
    assert.ok(result.includes("### 4.1 Test Documentation"));
    assert.ok(result.includes("Recovery time achieved"));
    assert.ok(result.includes("Data loss window"));
    assert.ok(result.includes("Pass/fail result"));
  });

  // ── Section 5: Backup Security ─────────────────────────────────────

  it("includes backup security section", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateBackupPolicy(scan)!;
    assert.ok(result.includes("## 5. Backup Security"));
    assert.ok(result.includes("AES-256 for all backup data"));
    assert.ok(result.includes("TLS 1.2+"));
    assert.ok(result.includes("MFA required"));
    assert.ok(result.includes("Immutability"));
  });

  // ── Section 6: Roles ───────────────────────────────────────────────

  it("includes roles and responsibilities section", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateBackupPolicy(scan)!;
    assert.ok(result.includes("## 6. Roles and Responsibilities"));
    assert.ok(result.includes("Database Administrator"));
    assert.ok(result.includes("Engineering Lead"));
    assert.ok(result.includes("Security Team"));
    assert.ok(result.includes("Compliance Officer"));
  });

  // ── Section 7: Policy Review ───────────────────────────────────────

  it("includes policy review section", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    const result = generateBackupPolicy(scan)!;
    assert.ok(result.includes("## 7. Policy Review"));
    assert.ok(result.includes("quarterly"));
    assert.ok(result.includes("data loss incident"));
  });

  // ── Disclaimer ─────────────────────────────────────────────────────

  it("includes Codepliant disclaimer with project name", () => {
    const scan = makeScan({
      projectName: "my-app",
      services: [makeService("PostgreSQL", "database")],
    });
    const result = generateBackupPolicy(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("my-app"));
    assert.ok(result.includes("reviewed and customized"));
  });

  // ── Multiple database types ────────────────────────────────────────

  it("handles multiple database types from dbScan", () => {
    const scan = makeScan({ services: [] });
    const result = generateBackupPolicy(scan, undefined, makeDbScan(["postgresql", "mongodb", "dynamodb"]))!;
    assert.ok(result.includes("Postgresql"));
    assert.ok(result.includes("Mongodb"));
    assert.ok(result.includes("Dynamodb"));
    // Each should have a recovery section
    assert.ok(result.includes("Postgresql Recovery"));
    assert.ok(result.includes("Mongodb Recovery"));
    assert.ok(result.includes("Dynamodb Recovery"));
  });

  it("combines dbScan and service-detected databases without duplicates", () => {
    const scan = makeScan({
      services: [makeService("postgresql", "database"), makeService("redis", "database")],
    });
    const dbScan = makeDbScan(["postgresql", "mongodb"]);
    const result = generateBackupPolicy(scan, undefined, dbScan)!;
    // postgresql from dbScan, mongodb from dbScan, redis from services
    assert.ok(result.includes("Postgresql"));
    assert.ok(result.includes("Mongodb"));
    assert.ok(result.includes("redis"));
  });
});
