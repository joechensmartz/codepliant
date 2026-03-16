# Privacy Risk Matrix

> **Document Version:** 1.0
> **Document Owner:** [Your Company Name]
> **Generated:** 2026-03-16 by [Codepliant](https://github.com/joechensmartz/codepliant)
> **Next Review Date:** 2027-03-16

This document provides a visual risk assessment of all detected data processing activities,
scored by likelihood and impact, with specific mitigation actions for each risk.

## Executive Summary

| Level | Count | Action Required |
|-------|-------|-----------------|
| 🔴 Critical | 2 | Immediate remediation — escalate to leadership |
| 🟠 High | 3 | Address within 30 days |
| 🟡 Medium | 1 | Address within 90 days |
| **Total** | **6** | |

## Visual Risk Matrix

Each cell shows the risk IDs that fall at that likelihood/impact intersection.

| Likelihood \ Impact | 1 - Negligible | 2 - Minor | 3 - Moderate | 4 - Major | 5 - Severe |
|---------------------|----------------|-----------|--------------|-----------|------------|
| **5** - Almost Certain | — | — | — | — | — |
| **4** - Likely | — | — | 🟠PR-001 | 🔴PR-006 | — |
| **3** - Possible | — | — | 🟡PR-005 | 🟠PR-004 | 🔴PR-002 |
| **2** - Unlikely | — | — | — | — | 🟠PR-003 |
| **1** - Rare | — | — | — | — | — |

### Scoring Legend

| Score Range | Level | Color |
|-------------|-------|-------|
| 15–25 | Critical | 🔴 |
| 10–14 | High | 🟠 |
| 5–9 | Medium | 🟡 |
| 1–4 | Low | 🟢 |

## Risk Register

| ID | Processing Activity | Likelihood | Impact | Score | Level | Services |
|----|---------------------|------------|--------|-------|-------|----------|
| PR-006 | International data transfers to third-party processors | 4 (Likely) | 4 (Major) | 16 | 🔴 Critical | @hubspot/api-client, @sendgrid/mail, @sentry/nextjs, @upstash/redis, Google Analytics, Google Tag Manager, google-auth-library, googleapis, intercom, ioredis, next-auth, nodemailer, passport, Plausible Analytics, PostgreSQL, PostgreSQL (env), posthog, prisma, Redis, Redis (env), stripe, twilio, web-push |
| PR-002 | User authentication and identity management | 3 (Possible) | 5 (Severe) | 15 | 🔴 Critical | google-auth-library, next-auth, passport |
| PR-001 | User behavior tracking and analytics | 4 (Likely) | 3 (Moderate) | 12 | 🟠 High | Google Analytics, Google Tag Manager, Plausible Analytics, posthog |
| PR-004 | Persistent data storage and retrieval | 3 (Possible) | 4 (Major) | 12 | 🟠 High | @upstash/redis, ioredis, PostgreSQL, PostgreSQL (env), prisma, Redis, Redis (env) |
| PR-003 | Payment processing and financial data handling | 2 (Unlikely) | 5 (Severe) | 10 | 🟠 High | stripe |
| PR-005 | Email communications and marketing | 3 (Possible) | 3 (Moderate) | 9 | 🟡 Medium | @sendgrid/mail, nodemailer |

## Risk Details and Mitigations

### PR-006: International data transfers to third-party processors 🔴

**Risk Level:** Critical (16/25)  
**Likelihood:** 4/5 (Likely)  
**Impact:** 4/5 (Major)  
**Affected Services:** @hubspot/api-client, @sendgrid/mail, @sentry/nextjs, @upstash/redis, Google Analytics, Google Tag Manager, google-auth-library, googleapis, intercom, ioredis, next-auth, nodemailer, passport, Plausible Analytics, PostgreSQL, PostgreSQL (env), posthog, prisma, Redis, Redis (env), stripe, twilio, web-push

**Data Types at Risk:**

- all personal data shared with external services

**Required Mitigations:**

- [ ] Execute Data Processing Agreements (DPAs) with all processors
- [ ] Verify Standard Contractual Clauses (SCCs) are in place
- [ ] Conduct Transfer Impact Assessments for non-EU transfers
- [ ] Monitor processor compliance with agreed safeguards
- [ ] Maintain an up-to-date sub-processor register

### PR-002: User authentication and identity management 🔴

**Risk Level:** Critical (15/25)  
**Likelihood:** 3/5 (Possible)  
**Impact:** 5/5 (Severe)  
**Affected Services:** google-auth-library, next-auth, passport

**Data Types at Risk:**

- email addresses
- passwords/hashes
- OAuth tokens
- session data

**Required Mitigations:**

- [ ] Enforce bcrypt/argon2 password hashing with sufficient rounds
- [ ] Implement MFA for all user accounts
- [ ] Set session timeout and token rotation policies
- [ ] Monitor for credential stuffing attacks
- [ ] Implement account lockout after failed attempts

### PR-001: User behavior tracking and analytics 🟠

**Risk Level:** High (12/25)  
**Likelihood:** 4/5 (Likely)  
**Impact:** 3/5 (Moderate)  
**Affected Services:** Google Analytics, Google Tag Manager, Plausible Analytics, posthog

**Data Types at Risk:**

- IP addresses
- device fingerprints
- browsing history
- click patterns

**Required Mitigations:**

- [ ] Implement cookie consent management platform (CMP)
- [ ] Anonymize IP addresses before storage
- [ ] Set data retention limits (max 26 months for GA4)
- [ ] Provide opt-out mechanism in privacy settings
- [ ] Conduct regular audit of tracked events

### PR-004: Persistent data storage and retrieval 🟠

**Risk Level:** High (12/25)  
**Likelihood:** 3/5 (Possible)  
**Impact:** 4/5 (Major)  
**Affected Services:** @upstash/redis, ioredis, PostgreSQL, PostgreSQL (env), prisma, Redis, Redis (env)

**Data Types at Risk:**

- user profiles
- application data
- metadata
- logs

**Required Mitigations:**

- [ ] Enable encryption at rest for all database instances
- [ ] Implement field-level encryption for sensitive columns
- [ ] Enforce least-privilege access controls
- [ ] Enable audit logging for data access
- [ ] Implement automated backup with tested recovery
- [ ] Set data retention schedules with automated deletion

### PR-003: Payment processing and financial data handling 🟠

**Risk Level:** High (10/25)  
**Likelihood:** 2/5 (Unlikely)  
**Impact:** 5/5 (Severe)  
**Affected Services:** stripe

**Data Types at Risk:**

- credit card tokens
- billing addresses
- transaction history
- financial identifiers

**Required Mitigations:**

- [ ] Use PCI DSS compliant payment processor with tokenization
- [ ] Never store raw card numbers — use hosted payment forms
- [ ] Implement fraud detection and monitoring
- [ ] Conduct annual PCI compliance self-assessment
- [ ] Encrypt all financial data at rest and in transit

### PR-005: Email communications and marketing 🟡

**Risk Level:** Medium (9/25)  
**Likelihood:** 3/5 (Possible)  
**Impact:** 3/5 (Moderate)  
**Affected Services:** @sendgrid/mail, nodemailer

**Data Types at Risk:**

- email addresses
- communication content
- engagement metrics

**Required Mitigations:**

- [ ] Implement double opt-in for marketing emails
- [ ] Provide one-click unsubscribe in all communications
- [ ] Maintain suppression lists across all email services
- [ ] Encrypt email content containing personal data
- [ ] Audit email service provider DPAs annually

---

*This privacy risk matrix is generated from automated code analysis and should be reviewed by qualified privacy and legal professionals. Risk scores are indicative and should be validated against your organization's specific risk appetite and context. This does not constitute legal advice.*
