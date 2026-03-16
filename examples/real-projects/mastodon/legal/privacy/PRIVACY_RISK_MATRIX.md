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
| 🟠 High | 1 | Address within 30 days |
| 🟡 Medium | 2 | Address within 90 days |
| **Total** | **5** | |

## Visual Risk Matrix

Each cell shows the risk IDs that fall at that likelihood/impact intersection.

| Likelihood \ Impact | 1 - Negligible | 2 - Minor | 3 - Moderate | 4 - Major | 5 - Severe |
|---------------------|----------------|-----------|--------------|-----------|------------|
| **5** - Almost Certain | — | — | — | — | — |
| **4** - Likely | — | — | — | 🔴PR-005 | — |
| **3** - Possible | — | — | 🟡PR-003, 🟡PR-004 | 🟠PR-002 | 🔴PR-001 |
| **2** - Unlikely | — | — | — | — | — |
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
| PR-005 | International data transfers to third-party processors | 4 (Likely) | 4 (Major) | 16 | 🔴 Critical | ActionCable, ActionController::Cookies, ActionMailer, Active Storage, ActiveRecord, ActiveStorage, aws-sdk-s3, devise, ioredis, omniauth, pg, PostgreSQL, PostgreSQL (env), pundit, rack-attack, rails-actionmailer, rails-activerecord, rails-sessions, redis, Redis, sidekiq, ws (WebSocket) |
| PR-001 | User authentication and identity management | 3 (Possible) | 5 (Severe) | 15 | 🔴 Critical | devise, omniauth, pundit, rails-sessions |
| PR-002 | Persistent data storage and retrieval | 3 (Possible) | 4 (Major) | 12 | 🟠 High | ActiveRecord, ioredis, pg, PostgreSQL, PostgreSQL (env), rails-activerecord, redis, Redis |
| PR-003 | File and object storage | 3 (Possible) | 3 (Moderate) | 9 | 🟡 Medium | Active Storage, ActiveStorage, aws-sdk-s3 |
| PR-004 | Email communications and marketing | 3 (Possible) | 3 (Moderate) | 9 | 🟡 Medium | ActionMailer, rails-actionmailer |

## Risk Details and Mitigations

### PR-005: International data transfers to third-party processors 🔴

**Risk Level:** Critical (16/25)  
**Likelihood:** 4/5 (Likely)  
**Impact:** 4/5 (Major)  
**Affected Services:** ActionCable, ActionController::Cookies, ActionMailer, Active Storage, ActiveRecord, ActiveStorage, aws-sdk-s3, devise, ioredis, omniauth, pg, PostgreSQL, PostgreSQL (env), pundit, rack-attack, rails-actionmailer, rails-activerecord, rails-sessions, redis, Redis, sidekiq, ws (WebSocket)

**Data Types at Risk:**

- all personal data shared with external services

**Required Mitigations:**

- [ ] Execute Data Processing Agreements (DPAs) with all processors
- [ ] Verify Standard Contractual Clauses (SCCs) are in place
- [ ] Conduct Transfer Impact Assessments for non-EU transfers
- [ ] Monitor processor compliance with agreed safeguards
- [ ] Maintain an up-to-date sub-processor register

### PR-001: User authentication and identity management 🔴

**Risk Level:** Critical (15/25)  
**Likelihood:** 3/5 (Possible)  
**Impact:** 5/5 (Severe)  
**Affected Services:** devise, omniauth, pundit, rails-sessions

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

### PR-002: Persistent data storage and retrieval 🟠

**Risk Level:** High (12/25)  
**Likelihood:** 3/5 (Possible)  
**Impact:** 4/5 (Major)  
**Affected Services:** ActiveRecord, ioredis, pg, PostgreSQL, PostgreSQL (env), rails-activerecord, redis, Redis

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

### PR-003: File and object storage 🟡

**Risk Level:** Medium (9/25)  
**Likelihood:** 3/5 (Possible)  
**Impact:** 3/5 (Moderate)  
**Affected Services:** Active Storage, ActiveStorage, aws-sdk-s3

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

### PR-004: Email communications and marketing 🟡

**Risk Level:** Medium (9/25)  
**Likelihood:** 3/5 (Possible)  
**Impact:** 3/5 (Moderate)  
**Affected Services:** ActionMailer, rails-actionmailer

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
