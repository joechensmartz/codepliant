# Data Classification Report

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Project:** @mastodon/mastodon
**Company:** [Your Company Name]
**Generated:** 2026-03-16
**Classification Standard:** GDPR (General Data Protection Regulation)

## Related Documents

- Data Dictionary (`DATA_DICTIONARY.md`)
- Data Retention Policy (`DATA_RETENTION_POLICY.md`)
- Privacy Policy (`PRIVACY_POLICY.md`)

---

## Summary

| Sensitivity Level | Count | Description |
|-------------------|-------|-------------|
| Special Category (Art. 9) | 1 | Health, biometric, genetic, racial, political, religious, sexual orientation, trade union |
| High | 8 | Financial (PCI), government ID (SSN), authentication credentials |
| Medium | 9 | Contact info (email, phone), identity (name, DOB), location |
| Low | 62 | Behavioral (analytics), technical (IP, device info), preferences |

**Total classified fields:** 80

---

## Detailed Classification

| Field | Source | Sensitivity | GDPR Category | Retention |
|-------|--------|-------------|---------------|----------|
| Error reports, stack traces, performance data, and user context collected through monitoring tools. | Codecov | Special Category (Art. 9) | Racial/ethnic origin (Art. 9) | Delete when no longer necessary; max 1 year |
| storage service credentials | Active Storage | High | Authentication credential | Until account deletion; rotate regularly |
| password hash | devise | High | Authentication credential | Until account deletion; rotate regularly |
| authentication tokens | devise | High | Authentication credential | Until account deletion; rotate regularly |
| OAuth tokens | omniauth | High | Authentication credential | Until account deletion; rotate regularly |
| Email addresses, names, profile pictures, and account credentials collected through authentication. | devise | High | Authentication credential | Until account deletion; rotate regularly |
| Email addresses, names, profile pictures, and account credentials collected through authentication. | omniauth | High | Authentication credential | Until account deletion; rotate regularly |
| Email addresses, names, profile pictures, and account credentials collected through authentication. | pundit | High | Authentication credential | Until account deletion; rotate regularly |
| Email addresses, names, profile pictures, and account credentials collected through authentication. | rails-sessions | High | Authentication credential | Until account deletion; rotate regularly |
| email addresses | ActionMailer | Medium | Contact — email | Until account deletion or consent withdrawal |
| email content | ActionMailer | Medium | Contact — email | Until account deletion or consent withdrawal |
| email | devise | Medium | Contact — email | Until account deletion or consent withdrawal |
| email | omniauth | Medium | Contact — email | Until account deletion or consent withdrawal |
| name | omniauth | Medium | Personal identity — name | Until account deletion |
| email addresses | rails-actionmailer | Medium | Contact — email | Until account deletion or consent withdrawal |
| email content | rails-actionmailer | Medium | Contact — email | Until account deletion or consent withdrawal |
| Email addresses and email content processed through email service providers. | rails-actionmailer | Medium | Contact — email | Until account deletion or consent withdrawal |
| Email addresses and email content processed through email service providers. | ActionMailer | Medium | Contact — email | Until account deletion or consent withdrawal |
| real-time user data | ActionCable | Low | Unclassified data | Review and define retention policy |
| connection metadata | ActionCable | Low | Unclassified data | Review and define retention policy |
| channel subscriptions | ActionCable | Low | Unclassified data | Review and define retention policy |
| WebSocket messages | ActionCable | Low | Unclassified data | Review and define retention policy |
| session cookies | ActionController::Cookies | Low | Technical — tracking | Per cookie policy; max 13 months |
| session data | ActionController::Cookies | Low | Behavioral — analytics | 26 months |
| CSRF tokens | ActionController::Cookies | Low | Unclassified data | Review and define retention policy |
| uploaded files | Active Storage | Low | Unclassified data | Review and define retention policy |
| file metadata | Active Storage | Low | Unclassified data | Review and define retention policy |
| potential PII in uploaded content | Active Storage | Low | Unclassified data | Review and define retention policy |
| user data as defined in schema | ActiveRecord | Low | Unclassified data | Review and define retention policy |
| timestamps | ActiveRecord | Low | Unclassified data | Review and define retention policy |
| associations | ActiveRecord | Low | Unclassified data | Review and define retention policy |
| uploaded files | ActiveStorage | Low | Unclassified data | Review and define retention policy |
| file metadata | ActiveStorage | Low | Unclassified data | Review and define retention policy |
| storage references | ActiveStorage | Low | Unclassified data | Review and define retention policy |
| uploaded files | aws-sdk-s3 | Low | Unclassified data | Review and define retention policy |
| file metadata | aws-sdk-s3 | Low | Unclassified data | Review and define retention policy |
| session data | devise | Low | Behavioral — analytics | 26 months |
| cached data | ioredis | Low | Unclassified data | Review and define retention policy |
| session data | ioredis | Low | Behavioral — analytics | 26 months |
| profile data | omniauth | Low | Unclassified data | Review and define retention policy |
| user data as defined in schema | pg | Low | Unclassified data | Review and define retention policy |
| application data | PostgreSQL | Low | Unclassified data | Review and define retention policy |
| user records | PostgreSQL | Low | Unclassified data | Review and define retention policy |
| application data | PostgreSQL (env) | Low | Unclassified data | Review and define retention policy |
| user records | PostgreSQL (env) | Low | Unclassified data | Review and define retention policy |
| user roles | pundit | Low | Unclassified data | Review and define retention policy |
| authorization policies | pundit | Low | Unclassified data | Review and define retention policy |
| access control data | pundit | Low | Unclassified data | Review and define retention policy |
| IP addresses | rack-attack | Low | Technical — device/network | 90 days |
| request metadata | rack-attack | Low | Unclassified data | Review and define retention policy |
| user data as defined in schema | rails-activerecord | Low | Unclassified data | Review and define retention policy |
| session cookies | rails-sessions | Low | Technical — tracking | Per cookie policy; max 13 months |
| CSRF tokens | rails-sessions | Low | Unclassified data | Review and define retention policy |
| cached data | redis | Low | Unclassified data | Review and define retention policy |
| session data | redis | Low | Behavioral — analytics | 26 months |
| session data | Redis | Low | Behavioral — analytics | 26 months |
| cache data | Redis | Low | Unclassified data | Review and define retention policy |
| job data | sidekiq | Low | Unclassified data | Review and define retention policy |
| user data processed in background jobs | sidekiq | Low | Unclassified data | Review and define retention policy |
| real-time user data | ws (WebSocket) | Low | Unclassified data | Review and define retention policy |
| connection metadata | ws (WebSocket) | Low | Unclassified data | Review and define retention policy |
| IP address | ws (WebSocket) | Low | Technical — device/network | 90 days |
| WebSocket messages | ws (WebSocket) | Low | Unclassified data | Review and define retention policy |
| User-Uploaded Content | aws-sdk-s3 | Low | Unclassified data | Review and define retention policy |
| User-Uploaded Content | ActiveStorage | Low | Unclassified data | Review and define retention policy |
| User-Uploaded Content | Active Storage | Low | Unclassified data | Review and define retention policy |
| Stored User Data | pg | Low | Unclassified data | Review and define retention policy |
| Stored User Data | redis | Low | Unclassified data | Review and define retention policy |
| Stored User Data | ioredis | Low | Unclassified data | Review and define retention policy |
| Stored User Data | rails-activerecord | Low | Unclassified data | Review and define retention policy |
| Stored User Data | ActiveRecord | Low | Unclassified data | Review and define retention policy |
| Stored User Data | PostgreSQL (env) | Low | Unclassified data | Review and define retention policy |
| Stored User Data | PostgreSQL | Low | Unclassified data | Review and define retention policy |
| Stored User Data | Redis | Low | Unclassified data | Review and define retention policy |
| Stored User Data | Redis (Cache) | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | category:Personal Identity Data | Low | Unclassified data | Review and define retention policy |
| Communication Data | category:Communication Data | Low | Unclassified data | Review and define retention policy |
| Technical & Diagnostic Data | category:Technical & Diagnostic Data | Low | Unclassified data | Review and define retention policy |
| User-Uploaded Content | category:User-Uploaded Content | Low | Unclassified data | Review and define retention policy |
| Stored User Data | category:Stored User Data | Low | Unclassified data | Review and define retention policy |


---

## Recommendations

### Special Category Data (Art. 9) — 1 field(s)

- **Explicit consent required** (Art. 9(2)(a)): Standard consent is not sufficient; obtain explicit, informed consent for each specific purpose
- **Data Protection Impact Assessment (DPIA)** required under Art. 35 before processing
- **Appoint a Data Protection Officer (DPO)** if processing special categories at scale
- **Encryption at rest and in transit** is mandatory; consider additional access controls
- **Minimize collection**: Only collect what is strictly necessary for the stated purpose
- **Audit logging**: Maintain detailed access logs for all special category data

### High Sensitivity Data — 8 field(s)

- **Encrypt at rest and in transit** using industry-standard algorithms (AES-256, TLS 1.2+)
- **Tokenize payment data** — never store raw card numbers (PCI DSS requirement)
- **Hash credentials** with bcrypt, scrypt, or Argon2; never store plaintext passwords
- **Limit access** to personnel with a business need; implement role-based access control
- **Retain per regulatory requirements** (e.g., 7 years for financial records)
- **Regular security audits** and penetration testing recommended

### Medium Sensitivity Data — 9 field(s)

- **Encrypt in transit** (TLS 1.2+); encrypt at rest where feasible
- **Obtain clear consent** before collection; provide opt-out mechanisms
- **Allow user access and deletion** per GDPR Art. 15-17 (right of access, rectification, erasure)
- **Pseudonymize** where possible to reduce risk
- **Define clear retention periods** and automate data deletion

### Low Sensitivity Data — 62 field(s)

- **Encrypt in transit** (TLS 1.2+)
- **Anonymize or aggregate** analytics data where possible
- **Honor Do Not Track / Global Privacy Control** signals
- **Set appropriate retention periods** (typically 90 days for logs, 26 months for analytics)
- **Disclose in privacy policy** even for low-sensitivity data

---

*This classification is auto-generated based on code analysis. It should be reviewed by your legal and security teams. Data classification may change as your application evolves — re-run this scan regularly.*
