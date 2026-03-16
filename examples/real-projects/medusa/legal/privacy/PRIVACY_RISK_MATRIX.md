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
| 🟡 Medium | 2 | Address within 90 days |
| **Total** | **7** | |

## Visual Risk Matrix

Each cell shows the risk IDs that fall at that likelihood/impact intersection.

| Likelihood \ Impact | 1 - Negligible | 2 - Minor | 3 - Moderate | 4 - Major | 5 - Severe |
|---------------------|----------------|-----------|--------------|-----------|------------|
| **5** - Almost Certain | — | — | — | — | — |
| **4** - Likely | — | — | 🟠PR-001 | 🔴PR-003, 🔴PR-007 | — |
| **3** - Possible | — | — | 🟡PR-005, 🟡PR-006 | 🟠PR-004 | — |
| **2** - Unlikely | — | — | — | — | 🟠PR-002 |
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
| PR-003 | AI/ML data processing and model inference | 4 (Likely) | 4 (Major) | 16 | 🔴 Critical | openai |
| PR-007 | International data transfers to third-party processors | 4 (Likely) | 4 (Major) | 16 | 🔴 Critical | @aws-sdk/client-s3, @segment/analytics-next, @sendgrid/mail, algoliasearch, cookie-parser, express-session, ioredis, Multer, openai, posthog, stripe |
| PR-001 | User behavior tracking and analytics | 4 (Likely) | 3 (Moderate) | 12 | 🟠 High | @segment/analytics-next, posthog |
| PR-004 | Persistent data storage and retrieval | 3 (Possible) | 4 (Major) | 12 | 🟠 High | ioredis |
| PR-002 | Payment processing and financial data handling | 2 (Unlikely) | 5 (Severe) | 10 | 🟠 High | stripe |
| PR-005 | File and object storage | 3 (Possible) | 3 (Moderate) | 9 | 🟡 Medium | @aws-sdk/client-s3, Multer |
| PR-006 | Email communications and marketing | 3 (Possible) | 3 (Moderate) | 9 | 🟡 Medium | @sendgrid/mail |

## Risk Details and Mitigations

### PR-003: AI/ML data processing and model inference 🔴

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
**Affected Services:** @aws-sdk/client-s3, @segment/analytics-next, @sendgrid/mail, algoliasearch, cookie-parser, express-session, ioredis, Multer, openai, posthog, stripe

**Data Types at Risk:**

- all personal data shared with external services

**Required Mitigations:**

- [ ] Execute Data Processing Agreements (DPAs) with all processors
- [ ] Verify Standard Contractual Clauses (SCCs) are in place
- [ ] Conduct Transfer Impact Assessments for non-EU transfers
- [ ] Monitor processor compliance with agreed safeguards
- [ ] Maintain an up-to-date sub-processor register

### PR-001: User behavior tracking and analytics 🟠

**Risk Level:** High (12/25)  
**Likelihood:** 4/5 (Likely)  
**Impact:** 3/5 (Moderate)  
**Affected Services:** @segment/analytics-next, posthog

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
**Affected Services:** ioredis

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

### PR-002: Payment processing and financial data handling 🟠

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

### PR-005: File and object storage 🟡

**Risk Level:** Medium (9/25)  
**Likelihood:** 3/5 (Possible)  
**Impact:** 3/5 (Moderate)  
**Affected Services:** @aws-sdk/client-s3, Multer

**Data Types at Risk:**

- uploaded files
- documents
- media files
- backups

**Required Mitigations:**

- [ ] Enable server-side encryption for all storage buckets
- [ ] Implement access control lists (ACLs) with least privilege
- [ ] Enable versioning and audit logging
- [ ] Scan uploaded files for malware
- [ ] Set lifecycle policies for automatic data deletion

### PR-006: Email communications and marketing 🟡

**Risk Level:** Medium (9/25)  
**Likelihood:** 3/5 (Possible)  
**Impact:** 3/5 (Moderate)  
**Affected Services:** @sendgrid/mail

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
