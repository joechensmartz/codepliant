import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateComplianceTestingPlan } from "./compliance-testing-plan.js";
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

function makeCtx(overrides: Partial<GeneratorContext> = {}): GeneratorContext {
  return {
    companyName: "Acme Corp",
    contactEmail: "legal@acme.com",
    ...overrides,
  };
}

describe("generateComplianceTestingPlan", () => {
  // ── Null guard ──────────────────────────────────────────────────────

  it("returns null when no services detected", () => {
    const result = generateComplianceTestingPlan(makeScan());
    assert.strictEqual(result, null);
  });

  // ── Basic generation ────────────────────────────────────────────────

  it("generates document when services are present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(typeof result === "string");
    assert.ok(result.includes("# Compliance Testing Plan"));
  });

  it("includes date in ISO format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result!));
  });

  it("includes service count in header", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("**Services in scope:** 2"));
  });

  it("includes test categories in header", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("Consent Flow, Data Deletion, Access Controls, Breach Notification"));
  });

  it("includes regulation references in intro", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("GDPR"));
    assert.ok(result!.includes("CCPA"));
    assert.ok(result!.includes("PCI DSS"));
  });

  // ── Context values ────────────────────────────────────────────────────

  it("uses company name from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ companyName: "TestCo Inc" });
    const result = generateComplianceTestingPlan(scan, ctx);
    assert.ok(result!.includes("TestCo Inc"));
  });

  it("uses default placeholder when no context provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("[Your Company Name]"));
  });

  // ── Section 1: Test Plan Overview ─────────────────────────────────────

  it("includes test plan overview section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("## 1. Test Plan Overview"));
  });

  it("includes all test categories in overview table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("| Consent Flow |"));
    assert.ok(result!.includes("| Data Deletion |"));
    assert.ok(result!.includes("| Access Controls |"));
    assert.ok(result!.includes("| Breach Notification |"));
    assert.ok(result!.includes("| Data Minimization |"));
    assert.ok(result!.includes("| Encryption |"));
  });

  it("includes priority levels in overview", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("Critical"));
    assert.ok(result!.includes("High"));
    assert.ok(result!.includes("Medium"));
  });

  // ── Section 2: Consent Flow Tests ─────────────────────────────────────

  it("includes consent flow test cases", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("## 2. Consent Flow Test Cases"));
    assert.ok(result!.includes("### 2.1 Consent Collection"));
  });

  it("includes all consent collection test IDs", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("| CF-001 |"));
    assert.ok(result!.includes("| CF-002 |"));
    assert.ok(result!.includes("| CF-003 |"));
    assert.ok(result!.includes("| CF-004 |"));
    assert.ok(result!.includes("| CF-005 |"));
  });

  it("includes GDPR Art. 7 references in consent tests", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("GDPR Art. 7"));
  });

  it("includes analytics-specific consent tests when analytics detected", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("Analytics-Specific Consent Tests"));
    assert.ok(result!.includes("posthog"));
    assert.ok(result!.includes("GDPR Art. 7(3)"));
  });

  it("omits analytics-specific consent tests when no analytics", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(!result!.includes("Analytics-Specific Consent Tests"));
  });

  it("includes advertising-specific consent tests when advertising detected", () => {
    const scan = makeScan({ services: [makeService("ad-network", "advertising")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("Advertising-Specific Consent Tests"));
    assert.ok(result!.includes("ad-network"));
    assert.ok(result!.includes("Pixel not loaded without consent"));
  });

  it("omits advertising-specific consent tests when no advertising", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(!result!.includes("Advertising-Specific Consent Tests"));
  });

  it("includes consent withdrawal tests", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("### 2.2 Consent Withdrawal"));
    assert.ok(result!.includes("| CW-001 |"));
    assert.ok(result!.includes("| CW-002 |"));
    assert.ok(result!.includes("| CW-003 |"));
    assert.ok(result!.includes("| CW-004 |"));
  });

  // ── Section 3: Data Deletion Tests ────────────────────────────────────

  it("includes data deletion test cases", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("## 3. Data Deletion Test Cases"));
  });

  it("includes DSAR deletion tests", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("### 3.1 DSAR Deletion"));
    assert.ok(result!.includes("| DD-001 |"));
    assert.ok(result!.includes("| DD-002 |"));
    assert.ok(result!.includes("| DD-003 |"));
    assert.ok(result!.includes("| DD-004 |"));
    assert.ok(result!.includes("GDPR Art. 17"));
  });

  it("includes per-service deletion verification for each service", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("### 3.2 Per-Service Deletion Verification"));
    assert.ok(result!.includes("**stripe**"));
    assert.ok(result!.includes("**openai**"));
  });

  it("uses correct deletion verification for payment", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("Query payment records by user ID"));
  });

  it("uses correct deletion verification for auth", () => {
    const scan = makeScan({ services: [makeService("@clerk/nextjs", "auth")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("Query user profile API; expect 404"));
  });

  it("uses correct deletion verification for analytics", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("Export user data report"));
  });

  it("uses correct deletion verification for AI", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("Query AI logs by user ID"));
  });

  it("uses correct deletion verification for email", () => {
    const scan = makeScan({ services: [makeService("resend", "email")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("Search mailing lists by email"));
  });

  it("uses correct deletion verification for database", () => {
    const scan = makeScan({ services: [makeService("@supabase/supabase-js", "database")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("Direct DB query by user ID; expect 0 rows"));
  });

  it("uses correct deletion verification for storage", () => {
    const scan = makeScan({ services: [makeService("@aws-sdk/client-s3", "storage")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("List objects by user prefix"));
  });

  it("uses correct deletion verification for monitoring", () => {
    const scan = makeScan({ services: [makeService("@sentry/node", "monitoring")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("Search logs by user ID"));
  });

  it("uses correct deletion verification for advertising", () => {
    const scan = makeScan({ services: [makeService("ad-network", "advertising")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("Request ad profile"));
  });

  it("uses correct deletion verification for other/unknown", () => {
    const scan = makeScan({ services: [makeService("some-tool", "other")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("Service-specific API query"));
  });

  it("includes cascade deletion tests", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("### 3.3 Cascade Deletion"));
    assert.ok(result!.includes("2 detected services"));
    assert.ok(result!.includes("| DD-C-001 |"));
    assert.ok(result!.includes("| DD-C-002 |"));
    assert.ok(result!.includes("| DD-C-003 |"));
  });

  // ── Section 4: Access Control Tests ───────────────────────────────────

  it("includes access control test cases", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("## 4. Access Control Test Cases"));
  });

  it("includes authentication tests", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("### 4.1 Authentication"));
    assert.ok(result!.includes("| AC-001 |"));
    assert.ok(result!.includes("| AC-002 |"));
    assert.ok(result!.includes("| AC-003 |"));
    assert.ok(result!.includes("| AC-004 |"));
    assert.ok(result!.includes("401 Unauthorized"));
  });

  it("includes auth-specific tests when auth detected", () => {
    const scan = makeScan({ services: [makeService("@clerk/nextjs", "auth")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("Auth Service-Specific Tests"));
    assert.ok(result!.includes("@clerk/nextjs"));
    assert.ok(result!.includes("MFA enforcement"));
    assert.ok(result!.includes("OAuth scope restrictions"));
    assert.ok(result!.includes("session token rotation"));
  });

  it("omits auth-specific tests when no auth detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(!result!.includes("Auth Service-Specific Tests"));
  });

  it("includes authorization RBAC tests", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("### 4.2 Authorization (RBAC)"));
    assert.ok(result!.includes("| AC-R-001 |"));
    assert.ok(result!.includes("| AC-R-002 |"));
    assert.ok(result!.includes("| AC-R-003 |"));
    assert.ok(result!.includes("| AC-R-004 |"));
    assert.ok(result!.includes("403 Forbidden"));
  });

  it("includes API security tests", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("### 4.3 API Security"));
    assert.ok(result!.includes("| AC-API-001 |"));
    assert.ok(result!.includes("| AC-API-002 |"));
    assert.ok(result!.includes("| AC-API-003 |"));
    assert.ok(result!.includes("| AC-API-004 |"));
    assert.ok(result!.includes("429 Too Many Requests"));
    assert.ok(result!.includes("CORS"));
  });

  // ── Section 5: Breach Notification Tests ──────────────────────────────

  it("includes breach notification test cases", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("## 5. Breach Notification Test Cases"));
  });

  it("includes detection and containment tests", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("### 5.1 Detection & Containment"));
    assert.ok(result!.includes("| BN-001 |"));
    assert.ok(result!.includes("| BN-002 |"));
    assert.ok(result!.includes("| BN-003 |"));
    assert.ok(result!.includes("| BN-004 |"));
    assert.ok(result!.includes("GDPR Art. 33"));
  });

  it("includes monitoring service tests when monitoring detected", () => {
    const scan = makeScan({ services: [makeService("@sentry/node", "monitoring")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("Monitoring Service Tests"));
    assert.ok(result!.includes("@sentry/node"));
    assert.ok(result!.includes("breach alert rules"));
    assert.ok(result!.includes("15 minutes"));
  });

  it("omits monitoring service tests when no monitoring", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(!result!.includes("Monitoring Service Tests"));
  });

  it("includes notification timing tests", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("### 5.2 Notification Timing"));
    assert.ok(result!.includes("72 hours"));
    assert.ok(result!.includes("GDPR Art. 33(1)"));
    assert.ok(result!.includes("GDPR Art. 34(1)"));
  });

  it("includes post-breach verification tests", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("### 5.3 Post-Breach Verification"));
    assert.ok(result!.includes("| BN-P-001 |"));
    assert.ok(result!.includes("| BN-P-002 |"));
    assert.ok(result!.includes("| BN-P-003 |"));
    assert.ok(result!.includes("Root cause analysis"));
  });

  // ── Section 6: Service-Specific Test Matrix ───────────────────────────

  it("includes service-specific test matrix", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("## 6. Service-Specific Test Matrix"));
    assert.ok(result!.includes("**stripe**"));
  });

  it("marks consent as Required for analytics services", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateComplianceTestingPlan(scan);
    const lines = result!.split("\n");
    const matrixLine = lines.find((l) => l.includes("**posthog**") && l.split("|").length >= 7);
    assert.ok(matrixLine);
    assert.ok(matrixLine.includes("Required"));
  });

  it("marks consent as N/A for payment services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    const lines = result!.split("\n");
    const matrixLine = lines.find((l) => l.includes("**stripe**") && l.split("|").length >= 7);
    assert.ok(matrixLine);
    assert.ok(matrixLine.includes("N/A"));
  });

  it("marks breach detection as Required for auth services", () => {
    const scan = makeScan({ services: [makeService("@clerk/nextjs", "auth")] });
    const result = generateComplianceTestingPlan(scan);
    const lines = result!.split("\n");
    const matrixLine = lines.find((l) => l.includes("**@clerk/nextjs**") && l.split("|").length >= 7);
    assert.ok(matrixLine);
    const cells = matrixLine.split("|").map((c) => c.trim());
    assert.strictEqual(cells[5], "Required");
  });

  it("marks breach detection as Recommended for analytics services", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateComplianceTestingPlan(scan);
    const lines = result!.split("\n");
    const matrixLine = lines.find((l) => l.includes("**posthog**") && l.split("|").length >= 7);
    assert.ok(matrixLine);
    assert.ok(matrixLine.includes("Recommended"));
  });

  it("marks consent as Required for AI services", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceTestingPlan(scan);
    const lines = result!.split("\n");
    // Find the test matrix line (has 6+ pipes), not deletion line
    const matrixLine = lines.find((l) => l.includes("**openai**") && l.split("|").length >= 7);
    assert.ok(matrixLine);
    const cells = matrixLine.split("|").map((c) => c.trim());
    assert.strictEqual(cells[2], "Required");
  });

  it("marks consent as Required for email services", () => {
    const scan = makeScan({ services: [makeService("resend", "email")] });
    const result = generateComplianceTestingPlan(scan);
    const lines = result!.split("\n");
    const matrixLine = lines.find((l) => l.includes("**resend**") && l.split("|").length >= 7);
    assert.ok(matrixLine);
    const cells = matrixLine.split("|").map((c) => c.trim());
    assert.strictEqual(cells[2], "Required");
  });

  // ── Section 7: Test Execution Schedule ────────────────────────────────

  it("includes test execution schedule", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("## 7. Test Execution Schedule"));
    assert.ok(result!.includes("Every release"));
    assert.ok(result!.includes("Monthly"));
    assert.ok(result!.includes("Quarterly"));
    assert.ok(result!.includes("Annually"));
  });

  // ── Section 8: Test Automation ────────────────────────────────────────

  it("includes test automation section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("## 8. Test Automation"));
    assert.ok(result!.includes("CI/CD"));
    assert.ok(result!.includes("codepliant check --ci"));
  });

  it("includes GitHub Actions YAML example", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("compliance-tests.yml"));
    assert.ok(result!.includes("ubuntu-latest"));
  });

  // ── Disclaimer ────────────────────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("Codepliant"));
    assert.ok(result!.includes("does not constitute legal advice"));
  });

  // ── Combined scenario ─────────────────────────────────────────────────

  it("handles all categories together", () => {
    const scan = makeScan({
      projectName: "enterprise-app",
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
        makeService("@clerk/nextjs", "auth"),
        makeService("resend", "email"),
        makeService("@aws-sdk/client-s3", "storage"),
        makeService("@sentry/node", "monitoring"),
        makeService("@supabase/supabase-js", "database"),
        makeService("ad-network", "advertising"),
      ],
    });
    const ctx = makeCtx({ companyName: "Full Stack Corp" });
    const result = generateComplianceTestingPlan(scan, ctx)!;
    assert.ok(result.includes("Full Stack Corp"));
    assert.ok(result.includes("**Services in scope:** 9"));
    assert.ok(result.includes("Analytics-Specific Consent Tests"));
    assert.ok(result.includes("Advertising-Specific Consent Tests"));
    assert.ok(result.includes("Auth Service-Specific Tests"));
    assert.ok(result.includes("Monitoring Service Tests"));
    // Per-service deletion for all 9
    assert.ok(result.includes("| DD-S-001 |"));
    assert.ok(result.includes("| DD-S-009 |"));
    // Cascade deletion shows 9 services
    assert.ok(result.includes("9 detected services"));
  });

  it("handles single service scenario", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("**Services in scope:** 1"));
    assert.ok(result!.includes("1 detected services"));
    assert.ok(result!.includes("| DD-S-001 |"));
    assert.ok(!result!.includes("| DD-S-002 |"));
  });

  it("uses correct deletion verification for social", () => {
    const scan = makeScan({ services: [makeService("social-sdk", "social")] });
    const result = generateComplianceTestingPlan(scan);
    assert.ok(result!.includes("Query social integrations"));
  });

  it("marks consent as Required for social services", () => {
    const scan = makeScan({ services: [makeService("social-sdk", "social")] });
    const result = generateComplianceTestingPlan(scan);
    const lines = result!.split("\n");
    const matrixLine = lines.find((l) => l.includes("**social-sdk**") && l.split("|").length >= 7);
    assert.ok(matrixLine);
    const cells = matrixLine.split("|").map((c) => c.trim());
    assert.strictEqual(cells[2], "Required");
  });

  it("marks consent as N/A for database services", () => {
    const scan = makeScan({ services: [makeService("@supabase/supabase-js", "database")] });
    const result = generateComplianceTestingPlan(scan);
    const lines = result!.split("\n");
    const matrixLine = lines.find((l) => l.includes("**@supabase/supabase-js**") && l.split("|").length >= 7);
    assert.ok(matrixLine);
    const cells = matrixLine.split("|").map((c) => c.trim());
    assert.strictEqual(cells[2], "N/A");
  });

  it("marks breach as Required for storage services", () => {
    const scan = makeScan({ services: [makeService("@aws-sdk/client-s3", "storage")] });
    const result = generateComplianceTestingPlan(scan);
    // Find the line in the test matrix (has Consent column), not deletion verification
    const lines = result!.split("\n");
    const matrixLines = lines.filter((l) => l.includes("**@aws-sdk/client-s3**") && l.includes("N/A"));
    assert.ok(matrixLines.length > 0);
    const cells = matrixLines[0].split("|").map((c) => c.trim());
    assert.strictEqual(cells[5], "Required");
  });

  it("marks breach as Required for database services", () => {
    const scan = makeScan({ services: [makeService("@supabase/supabase-js", "database")] });
    const result = generateComplianceTestingPlan(scan);
    // Find the line in the test matrix (has Consent column), not deletion verification
    const lines = result!.split("\n");
    const matrixLines = lines.filter((l) => l.includes("**@supabase/supabase-js**") && (l.includes("N/A") || l.includes("Required")));
    // Pick the one from the service-specific test matrix (has 5+ pipe chars)
    const matrixLine = matrixLines.find((l) => l.split("|").length >= 7);
    assert.ok(matrixLine);
    const cells = matrixLine.split("|").map((c) => c.trim());
    assert.strictEqual(cells[5], "Required");
  });
});
