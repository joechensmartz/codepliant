import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import type { CloudScanResult, CloudDetection } from "../scanner/cloud-scanner.js";
import type { CiCdScanResult, CiCdPlatform } from "../scanner/ci-cd-scanner.js";
import { generateDisasterRecoveryPlan } from "./disaster-recovery.js";

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

function makeCiCdScan(overrides: Partial<CiCdScanResult> = {}): CiCdScanResult {
  return {
    platforms: [],
    hasVersionControl: true,
    vcsProvider: "github",
    hasAutomatedTests: true,
    hasDeploymentPipeline: false,
    hasSecurityScanning: false,
    hasDependencyUpdates: false,
    ...overrides,
  };
}

function makePlatform(name: string, features: string[] = []): CiCdPlatform {
  return { name, configFile: `${name.toLowerCase()}.yml`, features };
}

// Helper: 3 services minimum for non-null output
function threeServices(): DetectedService[] {
  return [
    makeService("PostgreSQL", "database"),
    makeService("next-auth", "auth"),
    makeService("stripe", "payment"),
  ];
}

describe("generateDisasterRecoveryPlan", () => {
  // ── Null behavior ──────────────────────────────────────────────────

  it("returns null when fewer than 3 services", () => {
    const scan = makeScan({ services: [makeService("PostgreSQL", "database")] });
    assert.strictEqual(generateDisasterRecoveryPlan(scan), null);
  });

  it("returns null with exactly 2 services", () => {
    const scan = makeScan({
      services: [makeService("PostgreSQL", "database"), makeService("next-auth", "auth")],
    });
    assert.strictEqual(generateDisasterRecoveryPlan(scan), null);
  });

  it("returns null with 0 services", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateDisasterRecoveryPlan(scan), null);
  });

  // ── Basic generation ───────────────────────────────────────────────

  it("generates plan when 3 or more services present", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Disaster Recovery Plan"));
  });

  it("generates plan with exactly 3 services", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(result.includes("Disaster Recovery Plan"));
  });

  // ── Header and metadata ────────────────────────────────────────────

  it("includes last updated date", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan)!;
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(`**Last updated:** ${today}`));
  });

  it("includes project name and organization", () => {
    const scan = makeScan({ projectName: "my-saas", services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(result.includes("**Project:** my-saas"));
    assert.ok(result.includes("**Organization:** [Your Company Name]"));
  });

  it("includes intro mentioning BCP and incident response", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(result.includes("Business Continuity Plan"));
    assert.ok(result.includes("Incident Response Plan"));
  });

  // ── Context values ─────────────────────────────────────────────────

  it("uses default placeholders when no context provided", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses context values when provided", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan, {
      companyName: "Acme Corp",
      contactEmail: "info@acme.com",
      securityEmail: "security@acme.com",
    })!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("security@acme.com"));
  });

  it("falls back to contactEmail when securityEmail not provided", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan, {
      companyName: "Acme Corp",
      contactEmail: "contact@acme.com",
    })!;
    assert.ok(result.includes("contact@acme.com"));
  });

  it("uses contactEmail in recovery complete notification", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan, {
      companyName: "Acme Corp",
      contactEmail: "contact@acme.com",
      securityEmail: "sec@acme.com",
    })!;
    // contactEmail is used in the recovery complete template
    assert.ok(result.includes("contact@acme.com"));
  });

  // ── Section 1: Disaster Scenarios ──────────────────────────────────

  it("includes disaster scenarios table", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(result.includes("## 1. Disaster Scenarios and Classification"));
    assert.ok(result.includes("Complete data center"));
    assert.ok(result.includes("Database corruption"));
    assert.ok(result.includes("Ransomware"));
    assert.ok(result.includes("RTO Target"));
    assert.ok(result.includes("RPO Target"));
  });

  // ── Section 2: Recovery Procedures ─────────────────────────────────

  it("includes database recovery when database services present", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(result.includes("Database Services"));
    assert.ok(result.includes("PostgreSQL"));
    assert.ok(result.includes("WAL/binlog/oplog"));
    assert.ok(result.includes("Verify row counts"));
  });

  it("includes auth recovery when auth services present", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(result.includes("Authentication Services"));
    assert.ok(result.includes("next-auth"));
    assert.ok(result.includes("Rotate all signing keys"));
    assert.ok(result.includes("OAuth callback URLs"));
  });

  it("includes payment recovery when payment services present", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(result.includes("Payment Services"));
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("in-flight transactions"));
    assert.ok(result.includes("idempotency keys"));
  });

  it("includes storage recovery when storage services present", () => {
    const scan = makeScan({
      services: [...threeServices(), makeService("S3", "storage")],
    });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(result.includes("File Storage Services"));
    assert.ok(result.includes("S3"));
    assert.ok(result.includes("cross-region replica"));
  });

  it("includes AI recovery when AI services present", () => {
    const scan = makeScan({
      services: [...threeServices(), makeService("openai", "ai")],
    });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(result.includes("AI Services"));
    assert.ok(result.includes("openai"));
    assert.ok(result.includes("AI output quality"));
  });

  it("includes email recovery when email services present", () => {
    const scan = makeScan({
      services: [...threeServices(), makeService("sendgrid", "email")],
    });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(result.includes("Email Services"));
    assert.ok(result.includes("sendgrid"));
    assert.ok(result.includes("SPF, DKIM, DMARC"));
  });

  it("excludes database recovery section when no database services", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(!result.includes("Database Services"));
  });

  it("excludes auth recovery section when no auth services", () => {
    const scan = makeScan({
      services: [
        makeService("PostgreSQL", "database"),
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(!result.includes("Authentication Services"));
  });

  it("excludes payment recovery section when no payment services", () => {
    const scan = makeScan({
      services: [
        makeService("PostgreSQL", "database"),
        makeService("next-auth", "auth"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(!result.includes("Payment Services"));
  });

  // ── Application Infrastructure section ─────────────────────────────

  it("always includes application infrastructure recovery", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(result.includes("Application Infrastructure"));
    assert.ok(result.includes("Provision compute resources"));
    assert.ok(result.includes("Restore environment variables"));
    assert.ok(result.includes("DNS cutover"));
  });

  it("includes Terraform step when Terraform detected in cicdScan", () => {
    const scan = makeScan({ services: threeServices() });
    const cicd = makeCiCdScan({
      platforms: [makePlatform("Terraform")],
    });
    const result = generateDisasterRecoveryPlan(scan, undefined, undefined, cicd)!;
    assert.ok(result.includes("terraform apply"));
  });

  it("excludes Terraform step when not detected", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(!result.includes("terraform apply"));
  });

  it("includes Kubernetes steps when Kubernetes detected", () => {
    const scan = makeScan({ services: threeServices() });
    const cicd = makeCiCdScan({
      platforms: [makePlatform("Kubernetes")],
    });
    const result = generateDisasterRecoveryPlan(scan, undefined, undefined, cicd)!;
    assert.ok(result.includes("Kubernetes manifests"));
    assert.ok(result.includes("pod health"));
  });

  it("excludes Kubernetes steps when not detected", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(!result.includes("Kubernetes manifests"));
  });

  it("includes deployment pipeline step when hasDeploymentPipeline is true", () => {
    const scan = makeScan({ services: threeServices() });
    const cicd = makeCiCdScan({ hasDeploymentPipeline: true });
    const result = generateDisasterRecoveryPlan(scan, undefined, undefined, cicd)!;
    assert.ok(result.includes("Trigger deployment pipeline"));
  });

  it("includes manual deployment step when hasDeploymentPipeline is false", () => {
    const scan = makeScan({ services: threeServices() });
    const cicd = makeCiCdScan({ hasDeploymentPipeline: false });
    const result = generateDisasterRecoveryPlan(scan, undefined, undefined, cicd)!;
    assert.ok(result.includes("Deploy application manually"));
  });

  it("uses manual deployment when no cicdScan provided", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(result.includes("Deploy application manually"));
  });

  // ── Section 3: Communication Templates ─────────────────────────────

  it("includes internal disaster declaration template", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan, {
      companyName: "Acme Corp",
      contactEmail: "info@acme.com",
    })!;
    assert.ok(result.includes("### 3.1 Internal"));
    assert.ok(result.includes("DISASTER RECOVERY ACTIVATION"));
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("SITUATION:"));
    assert.ok(result.includes("IMPACT:"));
  });

  it("includes customer notification template", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan, {
      companyName: "Acme Corp",
      contactEmail: "info@acme.com",
    })!;
    assert.ok(result.includes("### 3.2 External"));
    assert.ok(result.includes("Service Disruption"));
    assert.ok(result.includes("test-project"));
  });

  it("includes recovery complete notification template", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(result.includes("### 3.3 External"));
    assert.ok(result.includes("Services Restored"));
  });

  it("includes regulatory notification guidance", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(result.includes("### 3.4 Regulatory Notification"));
    assert.ok(result.includes("GDPR 72-hour"));
  });

  // ── Section 4: DR Testing Schedule ─────────────────────────────────

  it("includes DR testing schedule table", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(result.includes("## 4. Disaster Recovery Testing Schedule"));
    assert.ok(result.includes("Tabletop exercise"));
    assert.ok(result.includes("Backup restore drill"));
    assert.ok(result.includes("Full DR simulation"));
    assert.ok(result.includes("Communication drill"));
  });

  it("includes test success criteria", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(result.includes("### 4.1 Test Success Criteria"));
    assert.ok(result.includes("Recovery Time"));
    assert.ok(result.includes("Recovery Point"));
    assert.ok(result.includes("Data integrity"));
  });

  // ── Section 5: DR Team ─────────────────────────────────────────────

  it("includes DR team table", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(result.includes("## 5. Disaster Recovery Team"));
    assert.ok(result.includes("DR Commander"));
    assert.ok(result.includes("Technical Lead"));
    assert.ok(result.includes("Database Lead"));
    assert.ok(result.includes("Communications Lead"));
    assert.ok(result.includes("Security Lead"));
    assert.ok(result.includes("Executive Sponsor"));
  });

  // ── Section 6: Related Documents ───────────────────────────────────

  it("includes related documents section", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(result.includes("## 6. Related Documents"));
    assert.ok(result.includes("Business Continuity Plan"));
    assert.ok(result.includes("Incident Response Plan"));
    assert.ok(result.includes("Backup Policy"));
    assert.ok(result.includes("Encryption Policy"));
    assert.ok(result.includes("Change Management Policy"));
  });

  // ── Section 7: Plan Maintenance ────────────────────────────────────

  it("includes plan maintenance section", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(result.includes("## 7. Plan Maintenance"));
    assert.ok(result.includes("semi-annually"));
    assert.ok(result.includes("lessons learned"));
  });

  // ── Disclaimer ─────────────────────────────────────────────────────

  it("includes Codepliant disclaimer with project name", () => {
    const scan = makeScan({ projectName: "my-app", services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("my-app"));
    assert.ok(result.includes("reviewed and customized"));
  });

  // ── Procedure numbering ────────────────────────────────────────────

  it("numbers recovery procedures sequentially", () => {
    const scan = makeScan({
      services: [
        makeService("PostgreSQL", "database"),
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
        makeService("S3", "storage"),
        makeService("openai", "ai"),
        makeService("sendgrid", "email"),
      ],
    });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(result.includes("### 2.1 Database Services"));
    assert.ok(result.includes("### 2.2 Authentication Services"));
    assert.ok(result.includes("### 2.3 Payment Services"));
    assert.ok(result.includes("### 2.4 File Storage Services"));
    assert.ok(result.includes("### 2.5 AI Services"));
    assert.ok(result.includes("### 2.6 Email Services"));
  });

  it("skips numbering for absent service categories", () => {
    const scan = makeScan({
      services: [
        makeService("PostgreSQL", "database"),
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(result.includes("### 2.1 Database Services"));
    assert.ok(result.includes("### 2.2 Payment Services"));
    assert.ok(result.includes("### 2.3 AI Services"));
    assert.ok(!result.includes("Authentication Services"));
  });

  // ── All conditional sections together ──────────────────────────────

  it("includes all service recovery sections when all categories present", () => {
    const scan = makeScan({
      services: [
        makeService("PostgreSQL", "database"),
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
        makeService("S3", "storage"),
        makeService("openai", "ai"),
        makeService("sendgrid", "email"),
        makeService("datadog", "monitoring"),
      ],
    });
    const cicd = makeCiCdScan({
      platforms: [makePlatform("Terraform"), makePlatform("Kubernetes")],
      hasDeploymentPipeline: true,
    });
    const result = generateDisasterRecoveryPlan(scan, undefined, undefined, cicd)!;
    assert.ok(result.includes("Database Services"));
    assert.ok(result.includes("Authentication Services"));
    assert.ok(result.includes("Payment Services"));
    assert.ok(result.includes("File Storage Services"));
    assert.ok(result.includes("AI Services"));
    assert.ok(result.includes("Email Services"));
    assert.ok(result.includes("terraform apply"));
    assert.ok(result.includes("Kubernetes manifests"));
    assert.ok(result.includes("Trigger deployment pipeline"));
  });

  // ── Communication templates use company name ───────────────────────

  it("communication templates use company name from context", () => {
    const scan = makeScan({ services: threeServices() });
    const result = generateDisasterRecoveryPlan(scan, {
      companyName: "WidgetCo",
      contactEmail: "help@widget.co",
    })!;
    // Internal template
    assert.ok(result.includes("DISASTER RECOVERY ACTIVATION — WidgetCo"));
    // Customer notification
    assert.ok(result.includes("WidgetCo Service Disruption"));
    // Recovery complete
    assert.ok(result.includes("WidgetCo — Services Restored"));
    // Signoff
    const lines = result.split("\n");
    const signoffs = lines.filter((l) => l.trim() === "WidgetCo");
    assert.ok(signoffs.length >= 2, "Company name should appear as signoff in customer templates");
  });

  it("lists multiple services in affected services line", () => {
    const scan = makeScan({
      services: [
        makeService("PostgreSQL", "database"),
        makeService("Redis", "database"),
        makeService("next-auth", "auth"),
      ],
    });
    const result = generateDisasterRecoveryPlan(scan)!;
    assert.ok(result.includes("PostgreSQL, Redis"));
  });
});
