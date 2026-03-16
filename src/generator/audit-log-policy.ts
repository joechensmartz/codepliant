import type { ScanResult, DetectedService } from "../scanner/types.js";
import type { GeneratorContext } from "./index.js";

/** Monitoring / logging services and their typical event types. */
const MONITORING_EVENTS: Record<string, string[]> = {
  "@sentry/node": ["Application errors", "Unhandled exceptions", "Performance transactions", "User context (IP, browser)"],
  "@sentry/nextjs": ["Application errors", "Unhandled exceptions", "Performance transactions", "User context (IP, browser)"],
  "@sentry/react": ["Client-side errors", "Component render failures", "User session data"],
  "@sentry/nestjs": ["Server errors", "Request lifecycle events", "Performance traces"],
  "@sentry/profiling-node": ["CPU profiles", "Function call stacks", "Performance bottlenecks"],
  "dd-trace": ["Distributed traces", "Request latency", "Service dependencies", "Custom metrics"],
  posthog: ["Page views", "Feature flag evaluations", "User actions", "Session recordings"],
  mixpanel: ["User events", "Funnel conversions", "User properties", "A/B test assignments"],
  "@amplitude/analytics-browser": ["User events", "User properties", "Session data", "Revenue events"],
  "@vercel/analytics": ["Page views", "Web vitals", "Route changes"],
  "@google-analytics/data": ["Page views", "User demographics", "Conversion events", "Custom events"],
  hotjar: ["Heatmaps", "Session recordings", "User feedback", "Form analytics"],
  "@segment/analytics-next": ["Identify calls", "Track events", "Page views", "Group associations"],
  "launchdarkly-js-client-sdk": ["Feature flag evaluations", "User targeting data"],
  "@launchdarkly/node-server-sdk": ["Feature flag evaluations", "User targeting data"],
  firebase: ["Analytics events", "Crash reports", "Performance traces"],
  "firebase-admin": ["Authentication events", "Database operations", "Cloud function invocations"],
};

/** Default retention periods by service category. */
const RETENTION_DEFAULTS: Record<string, string> = {
  monitoring: "30 days (error logs), 90 days (performance data)",
  analytics: "26 months (industry default, configurable)",
  auth: "Duration of account + 30 days after deletion",
  payment: "7 years (financial regulation requirement)",
  email: "90 days (delivery logs), 1 year (engagement metrics)",
  ai: "30 days (request logs), per vendor data retention policy",
  database: "Per data retention policy — see DATA_RETENTION_POLICY.md",
  storage: "Until user-initiated deletion or account termination",
  advertising: "90 days (event logs), per ad platform policy",
  social: "90 days (interaction logs)",
  other: "90 days (default)",
};

/** Access control recommendations by category. */
const ACCESS_CONTROLS: Record<string, string[]> = {
  monitoring: [
    "Engineering team: Full read access to error and performance logs",
    "On-call engineers: Real-time alert access",
    "Security team: Audit log access for incident investigation",
    "Management: Aggregated dashboard access only",
  ],
  analytics: [
    "Product team: Full analytics dashboard access",
    "Marketing team: Campaign and conversion metrics",
    "Engineering team: Technical metrics and debugging data",
    "Executives: High-level KPI dashboards only",
  ],
  auth: [
    "Security team: Authentication event audit logs",
    "Engineering team: Debugging access (time-limited)",
    "Compliance team: Access review audit trail",
    "No individual user credentials accessible to any team",
  ],
  payment: [
    "Finance team: Transaction records and billing data",
    "Support team: Order lookup (masked payment details)",
    "Security team: Fraud detection logs",
    "PCI DSS scope: Only authorized personnel with need-to-know",
  ],
};

/**
 * Generate an AUDIT_LOG_POLICY.md based on detected monitoring and analytics services.
 *
 * Returns null when no monitoring or analytics services are detected.
 */
export function generateAuditLogPolicy(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  // Look for monitoring, analytics, and auth services — they all produce audit-relevant logs
  const auditRelevantCategories = new Set(["monitoring", "analytics", "auth", "payment"]);
  const relevantServices = scan.services.filter((s) => auditRelevantCategories.has(s.category));

  if (relevantServices.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const date = new Date().toISOString().split("T")[0];

  const sections: string[] = [];

  // ── Title ────────────────────────────────────────────────────────────
  sections.push(`# Audit Log Policy

**Last updated:** ${date}

**Project:** ${scan.projectName}

**Company:** ${company}

---

## 1. Purpose

This policy defines what events are logged across the **${scan.projectName}** application, how long logs are retained, and who has access to audit data. It supports compliance with GDPR Article 30 (records of processing activities), SOC 2 Trust Service Criteria (CC7.2 — monitoring), and internal security requirements.

## 2. Scope

This policy applies to all logging and monitoring systems integrated into the application, including error tracking, analytics, authentication logs, and transaction records.`);

  // ── Events Logged ────────────────────────────────────────────────────
  sections.push(`
---

## 3. Events Logged

The following table describes the categories of events logged by each detected service:

| Service | Category | Events Logged |
|---------|----------|--------------|`);

  const allCategories = new Set<string>();
  for (const service of scan.services) {
    const events = MONITORING_EVENTS[service.name];
    if (events) {
      const providerName = service.name.replace(/@/g, "").replace(/\//g, "-");
      sections.push(`| ${service.name} | ${service.category} | ${events.join("; ")} |`);
      allCategories.add(service.category);
    }
  }

  // Add generic entries for services without specific event mappings
  for (const service of relevantServices) {
    if (!MONITORING_EVENTS[service.name]) {
      sections.push(`| ${service.name} | ${service.category} | Application events, user interactions, system metrics |`);
      allCategories.add(service.category);
    }
  }

  // ── Standard Application Events ──────────────────────────────────────
  sections.push(`
### 3.1 Standard Application Events

In addition to service-specific events, the following application events should be logged:

| Event Category | Examples | Severity |
|---------------|----------|----------|
| Authentication | Login, logout, password reset, MFA enrollment | High |
| Authorization | Permission changes, role assignments, access denials | High |
| Data Access | Record views, exports, bulk downloads | Medium |
| Data Modification | Create, update, delete operations on personal data | High |
| System Administration | Config changes, deployment events, service restarts | High |
| Security Events | Failed login attempts, IP blocks, rate limit triggers | Critical |
| User Account | Registration, profile updates, account deletion | Medium |
| API Access | API key creation, OAuth token grants, webhook events | Medium |`);

  // ── Retention Periods ────────────────────────────────────────────────
  sections.push(`
---

## 4. Retention Periods

| Log Category | Retention Period | Justification |
|-------------|-----------------|---------------|`);

  for (const category of allCategories) {
    const retention = RETENTION_DEFAULTS[category] || RETENTION_DEFAULTS["other"];
    const justification = getRetentionJustification(category);
    sections.push(`| ${capitalize(category)} logs | ${retention} | ${justification} |`);
  }

  sections.push(`| Security/audit logs | 1 year minimum | Regulatory compliance and incident investigation |
| Access logs | 90 days | Operational debugging and security review |

### 4.1 Retention Rules

1. **Minimum retention:** Security-critical logs must be retained for at least 1 year
2. **Maximum retention:** Personal data in logs must not be retained beyond the stated period without legal basis
3. **Automated deletion:** Log rotation and TTL policies must be configured to enforce retention limits
4. **Legal holds:** Retention periods may be extended when required for legal proceedings or regulatory investigations
5. **Anonymization:** Where possible, logs should be anonymized after the active retention period`);

  // ── Access Controls ──────────────────────────────────────────────────
  sections.push(`
---

## 5. Access Controls

### 5.1 Role-Based Access
`);

  for (const category of allCategories) {
    const controls = ACCESS_CONTROLS[category] || ACCESS_CONTROLS["monitoring"];
    sections.push(`**${capitalize(category)} Logs:**\n`);
    for (const control of controls) {
      sections.push(`- ${control}`);
    }
    sections.push("");
  }

  sections.push(`### 5.2 Access Principles

1. **Least privilege:** Team members only access logs necessary for their role
2. **Need-to-know:** Access to sensitive logs (auth, payment) requires explicit approval
3. **Time-limited:** Debug access grants expire automatically after 24 hours
4. **Audited:** All access to audit logs is itself logged (meta-audit)
5. **No PII in dashboards:** Shared dashboards must not display personally identifiable information

### 5.3 Access Review Schedule

| Review Type | Frequency | Responsible Party |
|------------|-----------|-------------------|
| Access permissions audit | Quarterly | Security team |
| Log access review | Monthly | Engineering lead |
| Service account audit | Quarterly | DevOps team |
| Compliance review | Annually | Compliance officer |`);

  // ── Log Integrity ────────────────────────────────────────────────────
  sections.push(`
---

## 6. Log Integrity & Security

### 6.1 Protection Measures

- **Encryption in transit:** All log data transmitted over TLS 1.2+
- **Encryption at rest:** Log storage encrypted using AES-256 or equivalent
- **Immutability:** Audit logs must be append-only; modification or deletion requires elevated privileges and is itself logged
- **Centralization:** Logs should be forwarded to a centralized logging system separate from application servers
- **Backup:** Critical audit logs backed up to a separate storage system

### 6.2 Tampering Detection

- Log entries must include timestamps from a trusted time source
- Integrity checksums should be computed for log batches
- Anomalous gaps in log sequences must trigger alerts`);

  // ── Incident Response ────────────────────────────────────────────────
  sections.push(`
---

## 7. Incident Response Integration

Audit logs are a critical input to the incident response process:

1. **Detection:** Monitoring alerts trigger based on log patterns (error spikes, auth failures)
2. **Investigation:** Security team uses audit logs to reconstruct event timelines
3. **Containment:** Access logs help identify affected systems and users
4. **Notification:** Log data informs breach notification requirements (GDPR 72-hour window)
5. **Post-mortem:** Audit trail supports root cause analysis

For the full incident response plan, see **INCIDENT_RESPONSE_PLAN.md**.`);

  // ── Footer ───────────────────────────────────────────────────────────
  sections.push(`
---

## 8. Policy Review

This audit log policy should be reviewed:

- **Quarterly** as part of the security review cycle
- **When adding** new monitoring or analytics services
- **After a security incident** to identify logging gaps
- **When regulatory requirements** change

For questions about this policy, contact ${email}.

---

*This Audit Log Policy was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Review and verify all entries for accuracy. This document does not constitute legal advice.*`);

  return sections.join("\n");
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getRetentionJustification(category: string): string {
  switch (category) {
    case "monitoring":
      return "Operational debugging and performance optimization";
    case "analytics":
      return "Product insights and trend analysis";
    case "auth":
      return "Security compliance and access auditing";
    case "payment":
      return "Financial regulation (tax, accounting, anti-fraud)";
    case "email":
      return "Delivery verification and spam compliance";
    default:
      return "Operational requirements";
  }
}
