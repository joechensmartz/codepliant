import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generate a COMPLIANCE_TESTING_PLAN.md — test plan for verifying compliance controls.
 * Covers: consent flow, data deletion, access controls, breach notification.
 * Test cases mapped to each detected service.
 */
export function generateComplianceTestingPlan(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];

  const hasAuth = scan.services.some((s) => s.category === "auth");
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasAnalytics = scan.services.some((s) => s.category === "analytics");
  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasStorage = scan.services.some((s) => s.category === "storage");
  const hasEmail = scan.services.some((s) => s.category === "email");
  const hasMonitoring = scan.services.some((s) => s.category === "monitoring");
  const hasDatabase = scan.services.some((s) => s.category === "database");
  const hasAdvertising = scan.services.some((s) => s.category === "advertising");

  const sections: string[] = [];

  // --- Header ---
  sections.push(`# Compliance Testing Plan`);
  sections.push("");
  sections.push(`**Organization:** ${company}`);
  sections.push(`**Last updated:** ${date}`);
  sections.push(`**Services in scope:** ${scan.services.length}`);
  sections.push(`**Test categories:** Consent Flow, Data Deletion, Access Controls, Breach Notification`);
  sections.push("");
  sections.push(
    `This testing plan verifies that compliance controls are implemented correctly across ` +
    `the ${company} technology stack. Each test case is mapped to detected services and ` +
    `references applicable regulations (GDPR, CCPA, PCI DSS).`
  );
  sections.push("");
  sections.push("---");

  // --- 1. Test Plan Overview ---
  sections.push("");
  sections.push("## 1. Test Plan Overview");
  sections.push("");
  sections.push("| Category | Test Cases | Priority | Frequency |");
  sections.push("| --- | --- | --- | --- |");
  sections.push("| Consent Flow | Consent collection, withdrawal, preference persistence | Critical | Every release |");
  sections.push("| Data Deletion | DSAR deletion, cascade deletion, verification | Critical | Monthly |");
  sections.push("| Access Controls | RBAC enforcement, privilege escalation, API auth | High | Every release |");
  sections.push("| Breach Notification | Detection, containment, notification timing | High | Quarterly drill |");
  sections.push("| Data Minimization | Collection scope, retention enforcement | Medium | Quarterly |");
  sections.push("| Encryption | At-rest verification, in-transit enforcement | High | Monthly |");

  // --- 2. Consent Flow Tests ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 2. Consent Flow Test Cases");
  sections.push("");
  sections.push("### 2.1 Consent Collection");
  sections.push("");
  sections.push("| ID | Test Case | Expected Result | Regulation |");
  sections.push("| --- | --- | --- | --- |");
  sections.push("| CF-001 | User visits site for the first time | Consent banner displayed before any tracking | GDPR Art. 7, ePrivacy |");
  sections.push("| CF-002 | User declines all optional cookies | No analytics/advertising scripts loaded | GDPR Art. 7 |");
  sections.push("| CF-003 | User accepts only necessary cookies | Only essential cookies set; analytics blocked | ePrivacy Directive |");
  sections.push("| CF-004 | User accepts all cookies | All consented services activated | GDPR Art. 7 |");
  sections.push("| CF-005 | Consent preference stored correctly | Consent record includes: timestamp, scope, version | GDPR Art. 7(1) |");

  if (hasAnalytics) {
    sections.push("");
    sections.push("#### Analytics-Specific Consent Tests");
    sections.push("");
    for (const svc of scan.services.filter((s) => s.category === "analytics")) {
      sections.push(`| CF-A-${svc.name.slice(0, 3).toUpperCase()} | **${svc.name}**: Verify no tracking before consent | No network requests to ${svc.name} endpoints until consent given | GDPR Art. 7 |`);
      sections.push(`| CF-A-${svc.name.slice(0, 3).toUpperCase()}2 | **${svc.name}**: Verify tracking stops on withdrawal | ${svc.name} tracking ceases within 1 page load of withdrawal | GDPR Art. 7(3) |`);
    }
  }

  if (hasAdvertising) {
    sections.push("");
    sections.push("#### Advertising-Specific Consent Tests");
    sections.push("");
    for (const svc of scan.services.filter((s) => s.category === "advertising")) {
      sections.push(`| CF-AD-${svc.name.slice(0, 3).toUpperCase()} | **${svc.name}**: Pixel not loaded without consent | No requests to ad network before user consent | GDPR Art. 7 |`);
    }
  }

  sections.push("");
  sections.push("### 2.2 Consent Withdrawal");
  sections.push("");
  sections.push("| ID | Test Case | Expected Result | Regulation |");
  sections.push("| --- | --- | --- | --- |");
  sections.push("| CW-001 | User withdraws consent via preference center | All non-essential processing stops | GDPR Art. 7(3) |");
  sections.push("| CW-002 | Withdrawal is as easy as giving consent | Preference center accessible in <=2 clicks from any page | GDPR Art. 7(3) |");
  sections.push("| CW-003 | Withdrawal does not affect service core functionality | User can still access essential features | GDPR Art. 7(4) |");
  sections.push("| CW-004 | Withdrawal propagated to all services | All third-party services stop processing within 24h | GDPR Art. 7(3) |");

  // --- 3. Data Deletion Tests ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 3. Data Deletion Test Cases");
  sections.push("");
  sections.push("### 3.1 DSAR Deletion (Right to Erasure)");
  sections.push("");
  sections.push("| ID | Test Case | Expected Result | Regulation |");
  sections.push("| --- | --- | --- | --- |");
  sections.push("| DD-001 | Submit deletion request via DSAR portal | Request acknowledged within 24 hours | GDPR Art. 17 |");
  sections.push("| DD-002 | Deletion completed within 30-day window | All personal data removed from all systems | GDPR Art. 12(3) |");
  sections.push("| DD-003 | Deletion confirmation sent to user | User receives written confirmation of deletion | GDPR Art. 12(1) |");
  sections.push("| DD-004 | Backup deletion within 90 days | Personal data purged from backups at next rotation | GDPR Art. 17(1) |");

  sections.push("");
  sections.push("### 3.2 Per-Service Deletion Verification");
  sections.push("");
  sections.push("| ID | Service | Test Case | Verification Method |");
  sections.push("| --- | --- | --- | --- |");

  let ddIdx = 1;
  for (const svc of scan.services) {
    const verification = getDeletionVerification(svc.category);
    sections.push(`| DD-S-${String(ddIdx).padStart(3, "0")} | **${svc.name}** | Data fully removed after deletion request | ${verification} |`);
    ddIdx++;
  }

  sections.push("");
  sections.push("### 3.3 Cascade Deletion");
  sections.push("");
  sections.push("| ID | Test Case | Expected Result | Regulation |");
  sections.push("| --- | --- | --- | --- |");
  sections.push(`| DD-C-001 | Delete user account | Data removed from all ${scan.services.length} detected services | GDPR Art. 17 |`);
  sections.push("| DD-C-002 | Verify no orphaned records | Foreign key references cleaned up; no dangling data | GDPR Art. 5(1)(e) |");
  sections.push("| DD-C-003 | Verify deletion audit log | Deletion event logged with timestamp, scope, operator | GDPR Art. 5(2) |");

  // --- 4. Access Control Tests ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 4. Access Control Test Cases");
  sections.push("");
  sections.push("### 4.1 Authentication");
  sections.push("");
  sections.push("| ID | Test Case | Expected Result | Regulation |");
  sections.push("| --- | --- | --- | --- |");
  sections.push("| AC-001 | Attempt access without authentication | 401 Unauthorized returned | GDPR Art. 32 |");
  sections.push("| AC-002 | Attempt access with expired token | 401 Unauthorized; must re-authenticate | GDPR Art. 32 |");
  sections.push("| AC-003 | Brute-force login (>5 attempts) | Account locked after 5 failed attempts | GDPR Art. 32 |");
  sections.push("| AC-004 | Session timeout after inactivity | Session expires after configured timeout | GDPR Art. 32 |");

  if (hasAuth) {
    sections.push("");
    sections.push("#### Auth Service-Specific Tests");
    sections.push("");
    for (const svc of scan.services.filter((s) => s.category === "auth")) {
      sections.push(`- **${svc.name}**: Verify MFA enforcement for admin accounts`);
      sections.push(`- **${svc.name}**: Verify OAuth scope restrictions match configured minimums`);
      sections.push(`- **${svc.name}**: Verify session token rotation on privilege escalation`);
    }
  }

  sections.push("");
  sections.push("### 4.2 Authorization (RBAC)");
  sections.push("");
  sections.push("| ID | Test Case | Expected Result | Regulation |");
  sections.push("| --- | --- | --- | --- |");
  sections.push("| AC-R-001 | Viewer role attempts write operation | 403 Forbidden | GDPR Art. 32 |");
  sections.push("| AC-R-002 | Editor role attempts admin operation | 403 Forbidden | GDPR Art. 32 |");
  sections.push("| AC-R-003 | Service account accesses only scoped resources | No access to out-of-scope resources | GDPR Art. 25 |");
  sections.push("| AC-R-004 | Role change propagated immediately | Updated permissions effective on next request | GDPR Art. 32 |");

  sections.push("");
  sections.push("### 4.3 API Security");
  sections.push("");
  sections.push("| ID | Test Case | Expected Result | Regulation |");
  sections.push("| --- | --- | --- | --- |");
  sections.push("| AC-API-001 | API request without API key | 401 Unauthorized | GDPR Art. 32 |");
  sections.push("| AC-API-002 | API request with revoked key | 401 Unauthorized | GDPR Art. 32 |");
  sections.push("| AC-API-003 | Rate limit exceeded | 429 Too Many Requests | GDPR Art. 32 |");
  sections.push("| AC-API-004 | CORS policy blocks unauthorized origins | Preflight fails for non-whitelisted origins | GDPR Art. 32 |");

  // --- 5. Breach Notification Tests ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 5. Breach Notification Test Cases");
  sections.push("");
  sections.push("### 5.1 Detection & Containment");
  sections.push("");
  sections.push("| ID | Test Case | Expected Result | Regulation |");
  sections.push("| --- | --- | --- | --- |");
  sections.push("| BN-001 | Simulate unauthorized data access | Alert triggered within 15 minutes | GDPR Art. 33 |");
  sections.push("| BN-002 | Simulate data exfiltration attempt | Anomaly detection flags unusual data transfer | GDPR Art. 33 |");
  sections.push("| BN-003 | Containment procedure executed | Affected systems isolated within 1 hour | GDPR Art. 33 |");
  sections.push("| BN-004 | Incident logged in breach register | Breach record includes: nature, scope, impact, actions | GDPR Art. 33(5) |");

  if (hasMonitoring) {
    sections.push("");
    sections.push("#### Monitoring Service Tests");
    sections.push("");
    for (const svc of scan.services.filter((s) => s.category === "monitoring")) {
      sections.push(`- **${svc.name}**: Verify breach alert rules are configured and active`);
      sections.push(`- **${svc.name}**: Verify alert reaches on-call within 15 minutes of trigger`);
    }
  }

  sections.push("");
  sections.push("### 5.2 Notification Timing");
  sections.push("");
  sections.push("| ID | Test Case | Expected Result | Regulation |");
  sections.push("| --- | --- | --- | --- |");
  sections.push("| BN-T-001 | DPA notification within 72 hours | Supervisory authority notified within 72h of awareness | GDPR Art. 33(1) |");
  sections.push("| BN-T-002 | User notification without undue delay | Affected users notified if high risk to rights | GDPR Art. 34(1) |");
  sections.push("| BN-T-003 | Notification content completeness | Includes: nature, DPO contact, consequences, measures taken | GDPR Art. 33(3) |");
  sections.push("| BN-T-004 | Cross-border notification | All relevant DPAs notified for multi-jurisdiction breach | GDPR Art. 33(1) |");

  sections.push("");
  sections.push("### 5.3 Post-Breach Verification");
  sections.push("");
  sections.push("| ID | Test Case | Expected Result | Regulation |");
  sections.push("| --- | --- | --- | --- |");
  sections.push("| BN-P-001 | Root cause analysis completed | RCA document available within 14 days | GDPR Art. 33(5) |");
  sections.push("| BN-P-002 | Remediation measures implemented | Vulnerability patched; controls strengthened | GDPR Art. 32 |");
  sections.push("| BN-P-003 | Breach register updated | Register includes full timeline and lessons learned | GDPR Art. 33(5) |");

  // --- 6. Service-Specific Test Matrix ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 6. Service-Specific Test Matrix");
  sections.push("");
  sections.push("| Service | Consent | Deletion | Access Control | Breach Detection |");
  sections.push("| --- | --- | --- | --- | --- |");

  for (const svc of scan.services) {
    const consent = needsConsentTest(svc.category) ? "Required" : "N/A";
    const deletion = "Required";
    const access = "Required";
    const breach = needsBreachTest(svc.category) ? "Required" : "Recommended";
    sections.push(`| **${svc.name}** | ${consent} | ${deletion} | ${access} | ${breach} |`);
  }

  // --- 7. Test Execution Schedule ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 7. Test Execution Schedule");
  sections.push("");
  sections.push("| Cadence | Tests | Owner |");
  sections.push("| --- | --- | --- |");
  sections.push("| Every release | Consent flow, Access control, API security | Engineering |");
  sections.push("| Monthly | Data deletion, Encryption verification | Security + Engineering |");
  sections.push("| Quarterly | Breach notification drill, Data minimization audit | Security + Legal |");
  sections.push("| Annually | Full compliance test suite, Penetration test | Security + External auditor |");

  // --- 8. Automation ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 8. Test Automation");
  sections.push("");
  sections.push("Integrate compliance tests into CI/CD:");
  sections.push("");
  sections.push("```yaml");
  sections.push("# .github/workflows/compliance-tests.yml");
  sections.push("name: Compliance Tests");
  sections.push("on: [pull_request]");
  sections.push("jobs:");
  sections.push("  compliance:");
  sections.push("    runs-on: ubuntu-latest");
  sections.push("    steps:");
  sections.push("      - uses: actions/checkout@v4");
  sections.push("      - run: npm test -- --grep 'compliance'");
  sections.push("      - run: npx codepliant check --ci");
  sections.push("```");

  // --- Footer ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("*This Compliance Testing Plan was auto-generated by Codepliant based on detected services. " +
    "Test cases should be adapted to your specific implementation. " +
    "This document does not constitute legal advice.*");

  return sections.join("\n");
}

function getDeletionVerification(category: string): string {
  const methods: Record<string, string> = {
    auth: "Query user profile API; expect 404",
    payment: "Query payment records by user ID; expect empty result",
    analytics: "Export user data report; expect no matching records",
    ai: "Query AI logs by user ID; expect no matching entries",
    email: "Search mailing lists by email; expect not found",
    database: "Direct DB query by user ID; expect 0 rows",
    storage: "List objects by user prefix; expect empty",
    monitoring: "Search logs by user ID; expect scrubbed entries",
    advertising: "Request ad profile; expect no data",
    social: "Query social integrations; expect disconnected",
    other: "Service-specific API query; expect no user data",
  };
  return methods[category] || methods.other;
}

function needsConsentTest(category: string): boolean {
  return ["analytics", "advertising", "email", "social", "ai"].includes(category);
}

function needsBreachTest(category: string): boolean {
  return ["auth", "payment", "database", "storage"].includes(category);
}
