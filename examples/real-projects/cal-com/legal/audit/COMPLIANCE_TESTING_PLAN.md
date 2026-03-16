# Compliance Testing Plan

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Organization:** [Your Company Name]
**Last updated:** 2026-03-16
**Services in scope:** 23
**Test categories:** Consent Flow, Data Deletion, Access Controls, Breach Notification

This testing plan verifies that compliance controls are implemented correctly across the [Your Company Name] technology stack. Each test case is mapped to detected services and references applicable regulations (GDPR, CCPA, PCI DSS).

---

## 1. Test Plan Overview

| Category | Test Cases | Priority | Frequency |
| --- | --- | --- | --- |
| Consent Flow | Consent collection, withdrawal, preference persistence | Critical | Every release |
| Data Deletion | DSAR deletion, cascade deletion, verification | Critical | Monthly |
| Access Controls | RBAC enforcement, privilege escalation, API auth | High | Every release |
| Breach Notification | Detection, containment, notification timing | High | Quarterly drill |
| Data Minimization | Collection scope, retention enforcement | Medium | Quarterly |
| Encryption | At-rest verification, in-transit enforcement | High | Monthly |

---

## 2. Consent Flow Test Cases

### 2.1 Consent Collection

| ID | Test Case | Expected Result | Regulation |
| --- | --- | --- | --- |
| CF-001 | User visits site for the first time | Consent banner displayed before any tracking | GDPR Art. 7, ePrivacy |
| CF-002 | User declines all optional cookies | No analytics/advertising scripts loaded | GDPR Art. 7 |
| CF-003 | User accepts only necessary cookies | Only essential cookies set; analytics blocked | ePrivacy Directive |
| CF-004 | User accepts all cookies | All consented services activated | GDPR Art. 7 |
| CF-005 | Consent preference stored correctly | Consent record includes: timestamp, scope, version | GDPR Art. 7(1) |

#### Analytics-Specific Consent Tests

| CF-A-GOO | **Google Analytics**: Verify no tracking before consent | No network requests to Google Analytics endpoints until consent given | GDPR Art. 7 |
| CF-A-GOO2 | **Google Analytics**: Verify tracking stops on withdrawal | Google Analytics tracking ceases within 1 page load of withdrawal | GDPR Art. 7(3) |
| CF-A-GOO | **Google Tag Manager**: Verify no tracking before consent | No network requests to Google Tag Manager endpoints until consent given | GDPR Art. 7 |
| CF-A-GOO2 | **Google Tag Manager**: Verify tracking stops on withdrawal | Google Tag Manager tracking ceases within 1 page load of withdrawal | GDPR Art. 7(3) |
| CF-A-PLA | **Plausible Analytics**: Verify no tracking before consent | No network requests to Plausible Analytics endpoints until consent given | GDPR Art. 7 |
| CF-A-PLA2 | **Plausible Analytics**: Verify tracking stops on withdrawal | Plausible Analytics tracking ceases within 1 page load of withdrawal | GDPR Art. 7(3) |
| CF-A-POS | **posthog**: Verify no tracking before consent | No network requests to posthog endpoints until consent given | GDPR Art. 7 |
| CF-A-POS2 | **posthog**: Verify tracking stops on withdrawal | posthog tracking ceases within 1 page load of withdrawal | GDPR Art. 7(3) |

### 2.2 Consent Withdrawal

| ID | Test Case | Expected Result | Regulation |
| --- | --- | --- | --- |
| CW-001 | User withdraws consent via preference center | All non-essential processing stops | GDPR Art. 7(3) |
| CW-002 | Withdrawal is as easy as giving consent | Preference center accessible in <=2 clicks from any page | GDPR Art. 7(3) |
| CW-003 | Withdrawal does not affect service core functionality | User can still access essential features | GDPR Art. 7(4) |
| CW-004 | Withdrawal propagated to all services | All third-party services stop processing within 24h | GDPR Art. 7(3) |

---

## 3. Data Deletion Test Cases

### 3.1 DSAR Deletion (Right to Erasure)

| ID | Test Case | Expected Result | Regulation |
| --- | --- | --- | --- |
| DD-001 | Submit deletion request via DSAR portal | Request acknowledged within 24 hours | GDPR Art. 17 |
| DD-002 | Deletion completed within 30-day window | All personal data removed from all systems | GDPR Art. 12(3) |
| DD-003 | Deletion confirmation sent to user | User receives written confirmation of deletion | GDPR Art. 12(1) |
| DD-004 | Backup deletion within 90 days | Personal data purged from backups at next rotation | GDPR Art. 17(1) |

### 3.2 Per-Service Deletion Verification

| ID | Service | Test Case | Verification Method |
| --- | --- | --- | --- |
| DD-S-001 | **@hubspot/api-client** | Data fully removed after deletion request | Service-specific API query; expect no user data |
| DD-S-002 | **@sendgrid/mail** | Data fully removed after deletion request | Search mailing lists by email; expect not found |
| DD-S-003 | **@sentry/nextjs** | Data fully removed after deletion request | Search logs by user ID; expect scrubbed entries |
| DD-S-004 | **@upstash/redis** | Data fully removed after deletion request | Direct DB query by user ID; expect 0 rows |
| DD-S-005 | **Google Analytics** | Data fully removed after deletion request | Export user data report; expect no matching records |
| DD-S-006 | **Google Tag Manager** | Data fully removed after deletion request | Export user data report; expect no matching records |
| DD-S-007 | **google-auth-library** | Data fully removed after deletion request | Query user profile API; expect 404 |
| DD-S-008 | **googleapis** | Data fully removed after deletion request | Service-specific API query; expect no user data |
| DD-S-009 | **intercom** | Data fully removed after deletion request | Service-specific API query; expect no user data |
| DD-S-010 | **ioredis** | Data fully removed after deletion request | Direct DB query by user ID; expect 0 rows |
| DD-S-011 | **next-auth** | Data fully removed after deletion request | Query user profile API; expect 404 |
| DD-S-012 | **nodemailer** | Data fully removed after deletion request | Search mailing lists by email; expect not found |
| DD-S-013 | **passport** | Data fully removed after deletion request | Query user profile API; expect 404 |
| DD-S-014 | **Plausible Analytics** | Data fully removed after deletion request | Export user data report; expect no matching records |
| DD-S-015 | **PostgreSQL** | Data fully removed after deletion request | Direct DB query by user ID; expect 0 rows |
| DD-S-016 | **PostgreSQL (env)** | Data fully removed after deletion request | Direct DB query by user ID; expect 0 rows |
| DD-S-017 | **posthog** | Data fully removed after deletion request | Export user data report; expect no matching records |
| DD-S-018 | **prisma** | Data fully removed after deletion request | Direct DB query by user ID; expect 0 rows |
| DD-S-019 | **Redis** | Data fully removed after deletion request | Direct DB query by user ID; expect 0 rows |
| DD-S-020 | **Redis (env)** | Data fully removed after deletion request | Direct DB query by user ID; expect 0 rows |
| DD-S-021 | **stripe** | Data fully removed after deletion request | Query payment records by user ID; expect empty result |
| DD-S-022 | **twilio** | Data fully removed after deletion request | Service-specific API query; expect no user data |
| DD-S-023 | **web-push** | Data fully removed after deletion request | Service-specific API query; expect no user data |

### 3.3 Cascade Deletion

| ID | Test Case | Expected Result | Regulation |
| --- | --- | --- | --- |
| DD-C-001 | Delete user account | Data removed from all 23 detected services | GDPR Art. 17 |
| DD-C-002 | Verify no orphaned records | Foreign key references cleaned up; no dangling data | GDPR Art. 5(1)(e) |
| DD-C-003 | Verify deletion audit log | Deletion event logged with timestamp, scope, operator | GDPR Art. 5(2) |

---

## 4. Access Control Test Cases

### 4.1 Authentication

| ID | Test Case | Expected Result | Regulation |
| --- | --- | --- | --- |
| AC-001 | Attempt access without authentication | 401 Unauthorized returned | GDPR Art. 32 |
| AC-002 | Attempt access with expired token | 401 Unauthorized; must re-authenticate | GDPR Art. 32 |
| AC-003 | Brute-force login (>5 attempts) | Account locked after 5 failed attempts | GDPR Art. 32 |
| AC-004 | Session timeout after inactivity | Session expires after configured timeout | GDPR Art. 32 |

#### Auth Service-Specific Tests

- **google-auth-library**: Verify MFA enforcement for admin accounts
- **google-auth-library**: Verify OAuth scope restrictions match configured minimums
- **google-auth-library**: Verify session token rotation on privilege escalation
- **next-auth**: Verify MFA enforcement for admin accounts
- **next-auth**: Verify OAuth scope restrictions match configured minimums
- **next-auth**: Verify session token rotation on privilege escalation
- **passport**: Verify MFA enforcement for admin accounts
- **passport**: Verify OAuth scope restrictions match configured minimums
- **passport**: Verify session token rotation on privilege escalation

### 4.2 Authorization (RBAC)

| ID | Test Case | Expected Result | Regulation |
| --- | --- | --- | --- |
| AC-R-001 | Viewer role attempts write operation | 403 Forbidden | GDPR Art. 32 |
| AC-R-002 | Editor role attempts admin operation | 403 Forbidden | GDPR Art. 32 |
| AC-R-003 | Service account accesses only scoped resources | No access to out-of-scope resources | GDPR Art. 25 |
| AC-R-004 | Role change propagated immediately | Updated permissions effective on next request | GDPR Art. 32 |

### 4.3 API Security

| ID | Test Case | Expected Result | Regulation |
| --- | --- | --- | --- |
| AC-API-001 | API request without API key | 401 Unauthorized | GDPR Art. 32 |
| AC-API-002 | API request with revoked key | 401 Unauthorized | GDPR Art. 32 |
| AC-API-003 | Rate limit exceeded | 429 Too Many Requests | GDPR Art. 32 |
| AC-API-004 | CORS policy blocks unauthorized origins | Preflight fails for non-whitelisted origins | GDPR Art. 32 |

---

## 5. Breach Notification Test Cases

### 5.1 Detection & Containment

| ID | Test Case | Expected Result | Regulation |
| --- | --- | --- | --- |
| BN-001 | Simulate unauthorized data access | Alert triggered within 15 minutes | GDPR Art. 33 |
| BN-002 | Simulate data exfiltration attempt | Anomaly detection flags unusual data transfer | GDPR Art. 33 |
| BN-003 | Containment procedure executed | Affected systems isolated within 1 hour | GDPR Art. 33 |
| BN-004 | Incident logged in breach register | Breach record includes: nature, scope, impact, actions | GDPR Art. 33(5) |

#### Monitoring Service Tests

- **@sentry/nextjs**: Verify breach alert rules are configured and active
- **@sentry/nextjs**: Verify alert reaches on-call within 15 minutes of trigger

### 5.2 Notification Timing

| ID | Test Case | Expected Result | Regulation |
| --- | --- | --- | --- |
| BN-T-001 | DPA notification within 72 hours | Supervisory authority notified within 72h of awareness | GDPR Art. 33(1) |
| BN-T-002 | User notification without undue delay | Affected users notified if high risk to rights | GDPR Art. 34(1) |
| BN-T-003 | Notification content completeness | Includes: nature, DPO contact, consequences, measures taken | GDPR Art. 33(3) |
| BN-T-004 | Cross-border notification | All relevant DPAs notified for multi-jurisdiction breach | GDPR Art. 33(1) |

### 5.3 Post-Breach Verification

| ID | Test Case | Expected Result | Regulation |
| --- | --- | --- | --- |
| BN-P-001 | Root cause analysis completed | RCA document available within 14 days | GDPR Art. 33(5) |
| BN-P-002 | Remediation measures implemented | Vulnerability patched; controls strengthened | GDPR Art. 32 |
| BN-P-003 | Breach register updated | Register includes full timeline and lessons learned | GDPR Art. 33(5) |

---

## 6. Service-Specific Test Matrix

| Service | Consent | Deletion | Access Control | Breach Detection |
| --- | --- | --- | --- | --- |
| **@hubspot/api-client** | N/A | Required | Required | Recommended |
| **@sendgrid/mail** | Required | Required | Required | Recommended |
| **@sentry/nextjs** | N/A | Required | Required | Recommended |
| **@upstash/redis** | N/A | Required | Required | Required |
| **Google Analytics** | Required | Required | Required | Recommended |
| **Google Tag Manager** | Required | Required | Required | Recommended |
| **google-auth-library** | N/A | Required | Required | Required |
| **googleapis** | N/A | Required | Required | Recommended |
| **intercom** | N/A | Required | Required | Recommended |
| **ioredis** | N/A | Required | Required | Required |
| **next-auth** | N/A | Required | Required | Required |
| **nodemailer** | Required | Required | Required | Recommended |
| **passport** | N/A | Required | Required | Required |
| **Plausible Analytics** | Required | Required | Required | Recommended |
| **PostgreSQL** | N/A | Required | Required | Required |
| **PostgreSQL (env)** | N/A | Required | Required | Required |
| **posthog** | Required | Required | Required | Recommended |
| **prisma** | N/A | Required | Required | Required |
| **Redis** | N/A | Required | Required | Required |
| **Redis (env)** | N/A | Required | Required | Required |
| **stripe** | N/A | Required | Required | Required |
| **twilio** | N/A | Required | Required | Recommended |
| **web-push** | N/A | Required | Required | Recommended |

---

## 7. Test Execution Schedule

| Cadence | Tests | Owner |
| --- | --- | --- |
| Every release | Consent flow, Access control, API security | Engineering |
| Monthly | Data deletion, Encryption verification | Security + Engineering |
| Quarterly | Breach notification drill, Data minimization audit | Security + Legal |
| Annually | Full compliance test suite, Penetration test | Security + External auditor |

---

## 8. Test Automation

Integrate compliance tests into CI/CD:

```yaml
# .github/workflows/compliance-tests.yml
name: Compliance Tests
on: [pull_request]
jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test -- --grep 'compliance'
      - run: npx codepliant check --ci
```

---

*This Compliance Testing Plan was auto-generated by Codepliant based on detected services. Test cases should be adapted to your specific implementation. This document does not constitute legal advice.*