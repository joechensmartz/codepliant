# Privacy Risk Matrix

> **Document Version:** 1.0
> **Document Owner:** Acme Inc
> **Generated:** 2026-03-18 by [Codepliant](https://github.com/joechensmartz/codepliant)
> **Next Review Date:** 2027-03-18

This document provides a visual risk assessment of all detected data processing activities,
scored by likelihood and impact, with specific mitigation actions for each risk.

## Executive Summary

| Level | Count | Action Required |
|-------|-------|-----------------|
| 🔴 Critical | 3 | Immediate remediation — escalate to leadership |
| 🟠 High | 3 | Address within 30 days |
| 🟡 Medium | 1 | Address within 90 days |
| **Total** | **7** | |

## Visual Risk Matrix

Each cell shows the risk IDs that fall at that likelihood/impact intersection.

| Likelihood \ Impact | 1 - Negligible | 2 - Minor | 3 - Moderate | 4 - Major | 5 - Severe |
|---------------------|----------------|-----------|--------------|-----------|------------|
| **5** - Almost Certain | — | — | — | — | — |
| **4** - Likely | — | — | 🟠PR-001 | 🔴PR-004, 🔴PR-007 | — |
| **3** - Possible | — | — | 🟡PR-006 | 🟠PR-005 | 🔴PR-002 |
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
| PR-004 | AI/ML data processing and model inference | 4 (Likely) | 4 (Major) | 16 | 🔴 Critical | openai |
| PR-007 | International data transfers to third-party processors | 4 (Likely) | 4 (Major) | 16 | 🔴 Critical | @sentry/node, @supabase/supabase-js, openai, posthog, prisma, resend, stripe, stripe-ios |
| PR-002 | User authentication and identity management | 3 (Possible) | 5 (Severe) | 15 | 🔴 Critical | @supabase/supabase-js |
| PR-001 | User behavior tracking and analytics | 4 (Likely) | 3 (Moderate) | 12 | 🟠 High | posthog |
| PR-005 | Persistent data storage and retrieval | 3 (Possible) | 4 (Major) | 12 | 🟠 High | prisma |
| PR-003 | Payment processing and financial data handling | 2 (Unlikely) | 5 (Severe) | 10 | 🟠 High | stripe, stripe-ios |
| PR-006 | Email communications and marketing | 3 (Possible) | 3 (Moderate) | 9 | 🟡 Medium | resend |

## Risk Details and Mitigations

### PR-004: AI/ML data processing and model inference 🔴

**Risk Level:** Critical (16/25)  
**Likelihood:** 4/5 (Likely)  
**Impact:** 4/5 (Major)  
**Affected Services:** openai

**Data Types at Risk:**

- user prompts
- generated outputs
- training data
- usage patterns

**Required Mitigations:**

- [ ] Implement data minimization — send only necessary data to AI services
- [ ] Review AI provider data retention and training policies
- [ ] Add opt-out for AI features that process personal data
- [ ] Conduct AI-specific DPIA under GDPR Art. 35
- [ ] Implement human oversight for high-risk AI decisions
- [ ] Log all AI processing for audit trail

### PR-007: International data transfers to third-party processors 🔴

**Risk Level:** Critical (16/25)  
**Likelihood:** 4/5 (Likely)  
**Impact:** 4/5 (Major)  
**Affected Services:** @sentry/node, @supabase/supabase-js, openai, posthog, prisma, resend, stripe, stripe-ios

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
**Affected Services:** @supabase/supabase-js

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
**Affected Services:** posthog

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

### PR-005: Persistent data storage and retrieval 🟠

**Risk Level:** High (12/25)  
**Likelihood:** 3/5 (Possible)  
**Impact:** 4/5 (Major)  
**Affected Services:** prisma

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
**Affected Services:** stripe, stripe-ios

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

### PR-006: Email communications and marketing 🟡

**Risk Level:** Medium (9/25)  
**Likelihood:** 3/5 (Possible)  
**Impact:** 3/5 (Moderate)  
**Affected Services:** resend

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
