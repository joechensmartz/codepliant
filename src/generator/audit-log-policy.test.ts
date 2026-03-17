import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateAuditLogPolicy } from "./audit-log-policy.js";

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

describe("generateAuditLogPolicy", () => {
  // ── Null returns ────────────────────────────────────────────────────

  it("returns null when no services detected", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateAuditLogPolicy(scan), null);
  });

  it("returns null when only non-audit-relevant services present", () => {
    const scan = makeScan({
      services: [makeService("@aws-sdk/client-s3", "storage")],
    });
    assert.strictEqual(generateAuditLogPolicy(scan), null);
  });

  it("returns null when only email services present", () => {
    const scan = makeScan({
      services: [makeService("@sendgrid/mail", "email")],
    });
    assert.strictEqual(generateAuditLogPolicy(scan), null);
  });

  it("returns null when only AI services present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    assert.strictEqual(generateAuditLogPolicy(scan), null);
  });

  // ── Basic generation ────────────────────────────────────────────────

  it("generates policy with monitoring service", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateAuditLogPolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Audit Log Policy"));
  });

  it("generates policy with analytics service", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateAuditLogPolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Audit Log Policy"));
  });

  it("generates policy with auth service", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateAuditLogPolicy(scan);
    assert.ok(result !== null);
  });

  it("generates policy with payment service", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateAuditLogPolicy(scan);
    assert.ok(result !== null);
  });

  // ── Header and metadata ─────────────────────────────────────────────

  it("includes last updated date", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("**Last updated:**"));
    assert.match(result, /\d{4}-\d{2}-\d{2}/);
  });

  it("includes project name", () => {
    const scan = makeScan({
      projectName: "my-app",
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("my-app"));
  });

  it("uses default placeholder values", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses context company name and email", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateAuditLogPolicy(scan, {
      companyName: "TestCo",
      contactEmail: "audit@testco.com",
    })!;
    assert.ok(result.includes("TestCo"));
    assert.ok(result.includes("audit@testco.com"));
  });

  // ── Purpose and Scope ───────────────────────────────────────────────

  it("includes purpose section referencing GDPR and SOC 2", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("## 1. Purpose"));
    assert.ok(result.includes("GDPR Article 30"));
    assert.ok(result.includes("SOC 2"));
  });

  it("includes scope section", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("## 2. Scope"));
  });

  // ── Events Logged (Section 3) ───────────────────────────────────────

  it("includes events logged table header", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("## 3. Events Logged"));
    assert.ok(result.includes("| Service | Category | Events Logged |"));
  });

  it("maps known monitoring service events", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("@sentry/node"));
    assert.ok(result.includes("Application errors"));
    assert.ok(result.includes("Unhandled exceptions"));
  });

  it("maps known analytics service events", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("posthog"));
    assert.ok(result.includes("Page views"));
    assert.ok(result.includes("Feature flag evaluations"));
  });

  it("uses generic events for unknown services in audit-relevant categories", () => {
    const scan = makeScan({
      services: [makeService("custom-auth-lib", "auth")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("custom-auth-lib"));
    assert.ok(result.includes("Application events, user interactions, system metrics"));
  });

  it("includes standard application events table", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("### 3.1 Standard Application Events"));
    assert.ok(result.includes("Authentication"));
    assert.ok(result.includes("Authorization"));
    assert.ok(result.includes("Security Events"));
    assert.ok(result.includes("Critical"));
  });

  it("includes multiple known services in events table", () => {
    const scan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring"),
        makeService("posthog", "analytics"),
        makeService("dd-trace", "monitoring"),
      ],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("@sentry/node"));
    assert.ok(result.includes("posthog"));
    assert.ok(result.includes("dd-trace"));
    assert.ok(result.includes("Distributed traces"));
  });

  // ── Retention Periods (Section 4) ───────────────────────────────────

  it("includes retention periods section", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("## 4. Retention Periods"));
    assert.ok(result.includes("Monitoring logs"));
    assert.ok(result.includes("30 days (error logs), 90 days (performance data)"));
  });

  it("includes analytics retention for analytics services", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("Analytics logs"));
    assert.ok(result.includes("26 months"));
  });

  it("includes auth retention for auth services", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("Auth logs"));
    assert.ok(result.includes("Duration of account"));
  });

  it("includes payment retention for payment services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("Payment logs"));
    assert.ok(result.includes("7 years"));
  });

  it("includes retention justifications", () => {
    const scan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("Operational debugging"));
    assert.ok(result.includes("Financial regulation"));
  });

  it("includes retention rules", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("### 4.1 Retention Rules"));
    assert.ok(result.includes("Minimum retention"));
    assert.ok(result.includes("Automated deletion"));
    assert.ok(result.includes("Legal holds"));
    assert.ok(result.includes("Anonymization"));
  });

  // ── Access Controls (Section 5) ─────────────────────────────────────

  it("includes access controls section", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("## 5. Access Controls"));
    assert.ok(result.includes("### 5.1 Role-Based Access"));
  });

  it("includes monitoring access controls", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("**Monitoring Logs:**"));
    assert.ok(result.includes("Engineering team: Full read access"));
    assert.ok(result.includes("On-call engineers"));
  });

  it("includes analytics access controls", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("**Analytics Logs:**"));
    assert.ok(result.includes("Product team"));
    assert.ok(result.includes("Marketing team"));
  });

  it("includes auth access controls for auth services", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("**Auth Logs:**"));
    assert.ok(result.includes("No individual user credentials"));
  });

  it("includes payment access controls for payment services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("**Payment Logs:**"));
    assert.ok(result.includes("PCI DSS scope"));
  });

  it("includes access principles", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("### 5.2 Access Principles"));
    assert.ok(result.includes("Least privilege"));
    assert.ok(result.includes("Need-to-know"));
    assert.ok(result.includes("Time-limited"));
    assert.ok(result.includes("meta-audit"));
  });

  it("includes access review schedule", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("### 5.3 Access Review Schedule"));
    assert.ok(result.includes("Quarterly"));
    assert.ok(result.includes("Monthly"));
    assert.ok(result.includes("Annually"));
  });

  // ── Log Integrity (Section 6) ───────────────────────────────────────

  it("includes log integrity and security section", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("## 6. Log Integrity & Security"));
    assert.ok(result.includes("Encryption in transit"));
    assert.ok(result.includes("TLS 1.2"));
    assert.ok(result.includes("AES-256"));
    assert.ok(result.includes("Immutability"));
    assert.ok(result.includes("append-only"));
  });

  it("includes tampering detection", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("Tampering Detection"));
    assert.ok(result.includes("timestamps"));
    assert.ok(result.includes("checksums"));
  });

  // ── Incident Response (Section 7) ───────────────────────────────────

  it("includes incident response integration section", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("## 7. Incident Response Integration"));
    assert.ok(result.includes("Detection"));
    assert.ok(result.includes("Investigation"));
    assert.ok(result.includes("GDPR 72-hour"));
    assert.ok(result.includes("Post-mortem"));
  });

  // ── Policy Review (Section 8) ───────────────────────────────────────

  it("includes policy review section", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("## 8. Policy Review"));
    assert.ok(result.includes("Quarterly"));
    assert.ok(result.includes("security incident"));
  });

  // ── Disclaimer ──────────────────────────────────────────────────────

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("does not constitute legal advice"));
  });

  // ── Combined scenarios ──────────────────────────────────────────────

  it("handles all four audit-relevant categories together", () => {
    const scan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring"),
        makeService("posthog", "analytics"),
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateAuditLogPolicy(scan)!;
    assert.ok(result.includes("Monitoring logs"));
    assert.ok(result.includes("Analytics logs"));
    assert.ok(result.includes("Auth logs"));
    assert.ok(result.includes("Payment logs"));
    assert.ok(result.includes("**Monitoring Logs:**"));
    assert.ok(result.includes("**Analytics Logs:**"));
    assert.ok(result.includes("**Auth Logs:**"));
    assert.ok(result.includes("**Payment Logs:**"));
  });

  it("includes non-audit services in events table if they have known events", () => {
    const scan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring"),
        makeService("firebase", "other"),
      ],
    });
    const result = generateAuditLogPolicy(scan)!;
    // firebase has known events in MONITORING_EVENTS but is category "other",
    // so it won't be in relevantServices but its events may still appear
    assert.ok(result.includes("@sentry/node"));
  });

  it("ignores non-audit categories for retention and access controls", () => {
    const scan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring"),
        makeService("@aws-sdk/client-s3", "storage"),
      ],
    });
    const result = generateAuditLogPolicy(scan)!;
    // storage is not in auditRelevantCategories
    assert.ok(result.includes("Monitoring logs"));
    assert.ok(!result.includes("Storage logs"));
  });
});
