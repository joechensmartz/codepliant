# Audit Log Policy

> **Document Version:** 1.0  
> **Document Owner:** Acme Inc  
> **Next Review Date:** 2027-03-18


**Last updated:** 2026-03-18

**Project:** nextjs-saas-example

**Company:** Acme Inc

## Related Documents

- Access Control Policy (`ACCESS_CONTROL_POLICY.md`)
- Incident Response Plan (`INCIDENT_RESPONSE_PLAN.md`)
- Information Security Policy (`INFORMATION_SECURITY_POLICY.md`)

---

## 1. Purpose

This policy defines what events are logged across the **nextjs-saas-example** application, how long logs are retained, and who has access to audit data. It supports compliance with GDPR Article 30 (records of processing activities), SOC 2 Trust Service Criteria (CC7.2 — monitoring), and internal security requirements.

## 2. Scope

This policy applies to all logging and monitoring systems integrated into the application, including error tracking, analytics, authentication logs, and transaction records.

---

## 3. Events Logged

The following table describes the categories of events logged by each detected service:

| Service | Category | Events Logged |
|---------|----------|--------------|
| @sentry/node | monitoring | Application errors; Unhandled exceptions; Performance transactions; User context (IP, browser) |
| posthog | analytics | Page views; Feature flag evaluations; User actions; Session recordings |
| @supabase/supabase-js | auth | Application events, user interactions, system metrics |
| stripe | payment | Application events, user interactions, system metrics |
| stripe-ios | payment | Application events, user interactions, system metrics |

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
| API Access | API key creation, OAuth token grants, webhook events | Medium |

---

## 4. Retention Periods

| Log Category | Retention Period | Justification |
|-------------|-----------------|---------------|
| Monitoring logs | 30 days (error logs), 90 days (performance data) | Operational debugging and performance optimization |
| Analytics logs | 26 months (industry default, configurable) | Product insights and trend analysis |
| Auth logs | Duration of account + 30 days after deletion | Security compliance and access auditing |
| Payment logs | 7 years (financial regulation requirement) | Financial regulation (tax, accounting, anti-fraud) |
| Security/audit logs | 1 year minimum | Regulatory compliance and incident investigation |
| Access logs | 90 days | Operational debugging and security review |

### 4.1 Retention Rules

1. **Minimum retention:** Security-critical logs must be retained for at least 1 year
2. **Maximum retention:** Personal data in logs must not be retained beyond the stated period without legal basis
3. **Automated deletion:** Log rotation and TTL policies must be configured to enforce retention limits
4. **Legal holds:** Retention periods may be extended when required for legal proceedings or regulatory investigations
5. **Anonymization:** Where possible, logs should be anonymized after the active retention period

---

## 5. Access Controls

### 5.1 Role-Based Access

**Monitoring Logs:**

- Engineering team: Full read access to error and performance logs
- On-call engineers: Real-time alert access
- Security team: Audit log access for incident investigation
- Management: Aggregated dashboard access only

**Analytics Logs:**

- Product team: Full analytics dashboard access
- Marketing team: Campaign and conversion metrics
- Engineering team: Technical metrics and debugging data
- Executives: High-level KPI dashboards only

**Auth Logs:**

- Security team: Authentication event audit logs
- Engineering team: Debugging access (time-limited)
- Compliance team: Access review audit trail
- No individual user credentials accessible to any team

**Payment Logs:**

- Finance team: Transaction records and billing data
- Support team: Order lookup (masked payment details)
- Security team: Fraud detection logs
- PCI DSS scope: Only authorized personnel with need-to-know

### 5.2 Access Principles

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
| Compliance review | Annually | Compliance officer |

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
- Anomalous gaps in log sequences must trigger alerts

---

## 7. Incident Response Integration

Audit logs are a critical input to the incident response process:

1. **Detection:** Monitoring alerts trigger based on log patterns (error spikes, auth failures)
2. **Investigation:** Security team uses audit logs to reconstruct event timelines
3. **Containment:** Access logs help identify affected systems and users
4. **Notification:** Log data informs breach notification requirements (GDPR 72-hour window)
5. **Post-mortem:** Audit trail supports root cause analysis

For the full incident response plan, see **INCIDENT_RESPONSE_PLAN.md**.

---

## 8. Policy Review

This audit log policy should be reviewed:

- **Quarterly** as part of the security review cycle
- **When adding** new monitoring or analytics services
- **After a security incident** to identify logging gaps
- **When regulatory requirements** change

For questions about this policy, contact legal@acme.com.

---

*This Audit Log Policy was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Review and verify all entries for accuracy. This document does not constitute legal advice.*