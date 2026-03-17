import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import type { CloudScanResult } from "../scanner/cloud-scanner.js";
import { generateBusinessContinuityPlan } from "./business-continuity.js";

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

function makeCloudScan(overrides: Partial<CloudScanResult> = {}): CloudScanResult {
  return {
    providers: [],
    crossBorderTransferLikely: false,
    transferNotes: [],
    ...overrides,
  };
}

describe("generateBusinessContinuityPlan", () => {
  // ── Null returns ────────────────────────────────────────────────────

  it("returns null when no services detected", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateBusinessContinuityPlan(scan), null);
  });

  it("returns null when fewer than 3 services", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
      ],
    });
    assert.strictEqual(generateBusinessContinuityPlan(scan), null);
  });

  it("returns null with exactly 2 services", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("@sentry/node", "monitoring"),
      ],
    });
    assert.strictEqual(generateBusinessContinuityPlan(scan), null);
  });

  // ── Basic generation ────────────────────────────────────────────────

  it("generates BCP with 3 or more services", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
        makeService("@sentry/node", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Business Continuity Plan"));
  });

  // ── Header and metadata ─────────────────────────────────────────────

  it("includes last updated date", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
        makeService("@sentry/node", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("**Last updated:**"));
    assert.match(result, /\d{4}-\d{2}-\d{2}/);
  });

  it("includes project name", () => {
    const scan = makeScan({
      projectName: "my-app",
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("my-app"));
  });

  it("uses default placeholder values", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses context company name and contact email", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan, {
      companyName: "TestCo",
      contactEmail: "ops@testco.com",
    })!;
    assert.ok(result.includes("TestCo"));
    assert.ok(result.includes("ops@testco.com"));
  });

  it("uses securityEmail when provided", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan, {
      companyName: "TestCo",
      contactEmail: "contact@testco.com",
      securityEmail: "security@testco.com",
    })!;
    assert.ok(result.includes("security@testco.com"));
  });

  it("falls back to contactEmail when securityEmail not provided", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan, {
      companyName: "TestCo",
      contactEmail: "contact@testco.com",
    })!;
    assert.ok(result.includes("contact@testco.com"));
  });

  // ── Section 1: Recovery Objectives ──────────────────────────────────

  it("includes recovery objectives section", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("## 1. Recovery Objectives by Service"));
    assert.ok(result.includes("Recovery Time Objective (RTO)"));
    assert.ok(result.includes("Recovery Point Objective (RPO)"));
  });

  it("lists auth services as critical (RTO 1 hour)", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("### 1.1 Critical Services"));
    assert.ok(result.includes("next-auth"));
    assert.ok(result.includes("Authentication"));
    assert.ok(result.includes("1 hour"));
  });

  it("lists payment services as critical", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("stripe", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("Payment Processing"));
  });

  it("lists database services as critical", () => {
    const scan = makeScan({
      services: [
        makeService("prisma", "database"),
        makeService("b", "auth"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("prisma"));
    assert.ok(result.includes("Database"));
    assert.ok(result.includes("5 minutes"));
  });

  it("shows no critical services placeholder when none detected", () => {
    const scan = makeScan({
      services: [
        makeService("a", "monitoring"),
        makeService("b", "analytics"),
        makeService("c", "email"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("(No critical services detected)"));
  });

  it("lists email services as high priority (RTO 4 hours)", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("@sendgrid/mail", "email"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("### 1.2 High Priority Services"));
    assert.ok(result.includes("@sendgrid/mail"));
    assert.ok(result.includes("4 hours"));
  });

  it("lists storage services as high priority", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("@aws-sdk/client-s3", "storage"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("@aws-sdk/client-s3"));
    assert.ok(result.includes("Storage"));
  });

  it("lists AI services as high priority", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("openai"));
    assert.ok(result.includes("AI Service"));
  });

  it("shows no high priority placeholder when none detected", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("(No high priority services detected)"));
  });

  it("lists monitoring services as standard (RTO 24 hours)", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("@sentry/node", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("### 1.3 Standard Services"));
    assert.ok(result.includes("@sentry/node"));
    assert.ok(result.includes("24 hours"));
  });

  it("lists analytics services as standard", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("posthog"));
    assert.ok(result.includes("Analytics"));
  });

  it("shows no standard services placeholder when none detected", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "email"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("(No standard services detected)"));
  });

  // ── Section 2: Infrastructure ───────────────────────────────────────

  it("includes infrastructure overview section", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("## 2. Infrastructure Overview"));
  });

  it("shows cloud provider details when cloudScan provided", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const cloudScan = makeCloudScan({
      providers: [
        {
          provider: "aws" as any,
          displayName: "Amazon Web Services",
          evidence: [],
          regions: ["us-east-1", "eu-west-1"],
          dataResidencyNotes: "Data stored in selected regions. AWS complies with EU-US DPF.",
        },
      ],
    });
    const result = generateBusinessContinuityPlan(scan, undefined, cloudScan)!;
    assert.ok(result.includes("### 2.1 Cloud Providers"));
    assert.ok(result.includes("Amazon Web Services"));
    assert.ok(result.includes("us-east-1, eu-west-1"));
  });

  it("shows placeholder when no cloudScan provided", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("Cloud provider details should be documented here"));
  });

  it("includes architecture diagram placeholder", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("### 2.2 Architecture Diagram"));
    assert.ok(result.includes("[TODO: Insert or link to architecture diagram"));
  });

  // ── Section 3: Failover Procedures ──────────────────────────────────

  it("includes database failover section", () => {
    const scan = makeScan({
      services: [
        makeService("prisma", "database"),
        makeService("b", "auth"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("## 3. Failover Procedures"));
    assert.ok(result.includes("### 3.1 Database Failover"));
    assert.ok(result.includes("prisma"));
    assert.ok(result.includes("Promote read replica"));
  });

  it("includes application failover section", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("### 3.2 Application Failover"));
    assert.ok(result.includes("Health check"));
    assert.ok(result.includes("Load balancer"));
  });

  it("includes auth failover when auth services present", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("### 3.3 Authentication Service Failover"));
    assert.ok(result.includes("next-auth"));
    assert.ok(result.includes("cached session validation"));
    assert.ok(result.includes("Extend existing session tokens"));
  });

  it("excludes auth failover when no auth services", () => {
    const scan = makeScan({
      services: [
        makeService("a", "email"),
        makeService("b", "monitoring"),
        makeService("c", "analytics"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(!result.includes("Authentication Service Failover"));
  });

  it("includes payment failover when payment services present", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("stripe", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("### 3.4 Payment Service Failover"));
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("idempotency keys"));
    assert.ok(result.includes("reconcile"));
  });

  it("excludes payment failover when no payment services", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "monitoring"),
        makeService("c", "analytics"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(!result.includes("Payment Service Failover"));
  });

  it("includes AI failover when AI services present", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("### 3.5 AI Service Failover"));
    assert.ok(result.includes("openai"));
    assert.ok(result.includes("graceful degradation"));
  });

  it("excludes AI failover when no AI services", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(!result.includes("AI Service Failover"));
  });

  // ── Section 4: Backup Strategy ──────────────────────────────────────

  it("includes backup strategy section", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("## 4. Backup Strategy"));
    assert.ok(result.includes("### 4.1 Backup Schedule"));
    assert.ok(result.includes("Production database"));
    assert.ok(result.includes("AES-256"));
  });

  it("includes backup verification checklist", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("### 4.2 Backup Verification"));
    assert.ok(result.includes("Monthly restore drill"));
    assert.ok(result.includes("Quarterly full disaster recovery"));
  });

  // ── Section 5: Communication Plan ───────────────────────────────────

  it("includes communication plan section", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("## 5. Communication Plan"));
    assert.ok(result.includes("### 5.1 Internal Communication"));
    assert.ok(result.includes("Critical (P1)"));
    assert.ok(result.includes("### 5.2 External Communication"));
  });

  it("includes escalation path", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("### 5.3 Escalation Path"));
    assert.ok(result.includes("On-call Engineer"));
    assert.ok(result.includes("CTO / CEO"));
  });

  it("includes status update templates with company name", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan, {
      companyName: "TestCo",
      contactEmail: "ops@testco.com",
    })!;
    assert.ok(result.includes("### 5.4 Status Update Templates"));
    assert.ok(result.includes("[TestCo] Service Disruption"));
    assert.ok(result.includes("[TestCo] Resolved"));
  });

  // ── Section 6: Roles and Responsibilities ───────────────────────────

  it("includes roles and responsibilities section", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("## 6. Roles and Responsibilities"));
    assert.ok(result.includes("Incident Commander"));
    assert.ok(result.includes("Technical Lead"));
    assert.ok(result.includes("Data Protection Officer"));
  });

  // ── Section 7: Dependency Map ───────────────────────────────────────

  it("includes third-party dependency map", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
        makeService("@sentry/node", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("## 7. Third-Party Dependency Map"));
    assert.ok(result.includes("next-auth"));
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("@sentry/node"));
    assert.ok(result.includes("Impact if Unavailable"));
    assert.ok(result.includes("Alternative / Workaround"));
  });

  it("shows correct impact descriptions per category", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
        makeService("@sentry/node", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("Users cannot sign in"));
    assert.ok(result.includes("Payment processing halted"));
    assert.ok(result.includes("Blind to errors"));
  });

  // ── Section 8: Testing and Drills ───────────────────────────────────

  it("includes testing and drills section", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("## 8. Testing and Drills"));
    assert.ok(result.includes("Tabletop exercise"));
    assert.ok(result.includes("Backup restore drill"));
    assert.ok(result.includes("Full DR simulation"));
  });

  // ── Section 9: Plan Maintenance ─────────────────────────────────────

  it("includes plan maintenance section", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("## 9. Plan Maintenance"));
    assert.ok(result.includes("infrastructure change"));
    assert.ok(result.includes("quarterly"));
  });

  // ── Disclaimer ──────────────────────────────────────────────────────

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("reviewed and customized"));
  });

  // ── Combined scenarios ──────────────────────────────────────────────

  it("handles all service categories together", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
        makeService("prisma", "database"),
        makeService("@sendgrid/mail", "email"),
        makeService("@aws-sdk/client-s3", "storage"),
        makeService("openai", "ai"),
        makeService("@sentry/node", "monitoring"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    // Critical section
    assert.ok(result.includes("next-auth"));
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("prisma"));
    // High priority section
    assert.ok(result.includes("@sendgrid/mail"));
    assert.ok(result.includes("@aws-sdk/client-s3"));
    assert.ok(result.includes("openai"));
    // Standard section
    assert.ok(result.includes("@sentry/node"));
    assert.ok(result.includes("posthog"));
    // Conditional failover sections
    assert.ok(result.includes("Authentication Service Failover"));
    assert.ok(result.includes("Payment Service Failover"));
    assert.ok(result.includes("AI Service Failover"));
  });

  it("excludes services with isDataProcessor false from dependency map", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
        {
          ...makeService("eslint", "other"),
          isDataProcessor: false,
        },
        makeService("c", "monitoring"),
      ],
    });
    const result = generateBusinessContinuityPlan(scan)!;
    // isDataProcessor: false should be filtered out by the dependency map
    assert.ok(!result.includes("| eslint |"));
  });

  it("shows Not specified for cloud provider with no regions", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const cloudScan = makeCloudScan({
      providers: [
        {
          provider: "vercel" as any,
          displayName: "Vercel",
          evidence: [],
          regions: [],
          dataResidencyNotes: "Vercel uses AWS infrastructure globally.",
        },
      ],
    });
    const result = generateBusinessContinuityPlan(scan, undefined, cloudScan)!;
    assert.ok(result.includes("Vercel"));
    assert.ok(result.includes("Not specified"));
  });
});
