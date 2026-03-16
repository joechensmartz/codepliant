# Data Classification Report

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Project:** maybe
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
| Special Category (Art. 9) | 2 | Health, biometric, genetic, racial, political, religious, sexual orientation, trade union |
| High | 9 | Financial (PCI), government ID (SSN), authentication credentials |
| Medium | 12 | Contact info (email, phone), identity (name, DOB), location |
| Low | 55 | Behavioral (analytics), technical (IP, device info), preferences |

**Total classified fields:** 78

---

## Detailed Classification

| Field | Source | Sensitivity | GDPR Category | Retention |
|-------|--------|-------------|---------------|----------|
| stack traces | sentry-ruby | Special Category (Art. 9) | Racial/ethnic origin (Art. 9) | Delete when no longer necessary; max 1 year |
| Error reports, stack traces, performance data, and user context collected through monitoring tools. | sentry-ruby | Special Category (Art. 9) | Racial/ethnic origin (Art. 9) | Delete when no longer necessary; max 1 year |
| storage service credentials | Active Storage | High | Authentication credential | Until account deletion; rotate regularly |
| bank account data | plaid | High | Financial — bank data | 7 years (tax/legal compliance) |
| transaction history | plaid | High | Financial — payment data | 7 years (tax/legal compliance) |
| payment information | stripe | High | Financial — payment data | 7 years (tax/legal compliance) |
| billing address | stripe | High | Financial — payment data | 7 years (tax/legal compliance) |
| transaction history | stripe | High | Financial — payment data | 7 years (tax/legal compliance) |
| Email addresses, names, profile pictures, and account credentials collected through authentication. | rails-sessions | High | Authentication credential | Until account deletion; rotate regularly |
| Payment card information, billing addresses, and transaction history processed through payment providers. | stripe | High | Financial — payment data | 7 years (tax/legal compliance) |
| Payment card information, billing addresses, and transaction history processed through payment providers. | plaid | High | Financial — payment data | 7 years (tax/legal compliance) |
| email addresses | ActionMailer | Medium | Contact — email | Until account deletion or consent withdrawal |
| email content | ActionMailer | Medium | Contact — email | Until account deletion or consent withdrawal |
| email | intercom-ruby | Medium | Contact — email | Until account deletion or consent withdrawal |
| name | intercom-ruby | Medium | Personal identity — name | Until account deletion |
| email addresses | nodemailer | Medium | Contact — email | Until account deletion or consent withdrawal |
| email content | nodemailer | Medium | Contact — email | Until account deletion or consent withdrawal |
| email addresses | rails-actionmailer | Medium | Contact — email | Until account deletion or consent withdrawal |
| email content | rails-actionmailer | Medium | Contact — email | Until account deletion or consent withdrawal |
| email | stripe | Medium | Contact — email | Until account deletion or consent withdrawal |
| Email addresses and email content processed through email service providers. | rails-actionmailer | Medium | Contact — email | Until account deletion or consent withdrawal |
| Email addresses and email content processed through email service providers. | nodemailer | Medium | Contact — email | Until account deletion or consent withdrawal |
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
| user profiles | intercom-ruby | Low | Unclassified data | Review and define retention policy |
| conversations | intercom-ruby | Low | Unclassified data | Review and define retention policy |
| user behavior | intercom-ruby | Low | Behavioral — analytics | 26 months |
| user data as defined in schema | pg | Low | Unclassified data | Review and define retention policy |
| account balances | plaid | Low | Unclassified data | Review and define retention policy |
| financial institution data | plaid | Low | Unclassified data | Review and define retention policy |
| IP addresses | rack-attack | Low | Technical — device/network | 90 days |
| request metadata | rack-attack | Low | Unclassified data | Review and define retention policy |
| user data as defined in schema | rails-activerecord | Low | Unclassified data | Review and define retention policy |
| session cookies | rails-sessions | Low | Technical — tracking | Per cookie policy; max 13 months |
| CSRF tokens | rails-sessions | Low | Unclassified data | Review and define retention policy |
| cached data | redis | Low | Unclassified data | Review and define retention policy |
| session data | redis | Low | Behavioral — analytics | 26 months |
| user prompts | ruby-openai | Low | Unclassified data | Review and define retention policy |
| conversation history | ruby-openai | Low | Unclassified data | Review and define retention policy |
| generated content | ruby-openai | Low | Unclassified data | Review and define retention policy |
| error data | sentry-ruby | Low | Technical — diagnostics | 90 days |
| user context | sentry-ruby | Low | Unclassified data | Review and define retention policy |
| device information | sentry-ruby | Low | Technical — device/network | 90 days |
| job data | sidekiq | Low | Unclassified data | Review and define retention policy |
| user data processed in background jobs | sidekiq | Low | Unclassified data | Review and define retention policy |
| AI Interaction Data | ruby-openai | Low | Unclassified data | Review and define retention policy |
| User-Uploaded Content | aws-sdk-s3 | Low | Unclassified data | Review and define retention policy |
| User-Uploaded Content | ActiveStorage | Low | Unclassified data | Review and define retention policy |
| User-Uploaded Content | Active Storage | Low | Unclassified data | Review and define retention policy |
| Stored User Data | pg | Low | Unclassified data | Review and define retention policy |
| Stored User Data | redis | Low | Unclassified data | Review and define retention policy |
| Stored User Data | rails-activerecord | Low | Unclassified data | Review and define retention policy |
| Stored User Data | ActiveRecord | Low | Unclassified data | Review and define retention policy |
| Stored User Data | Redis (Cache) | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | category:Personal Identity Data | Low | Unclassified data | Review and define retention policy |
| Financial Data | category:Financial Data | Low | Unclassified data | Review and define retention policy |
| AI Interaction Data | category:AI Interaction Data | Low | Unclassified data | Review and define retention policy |
| Communication Data | category:Communication Data | Low | Unclassified data | Review and define retention policy |
| Technical & Diagnostic Data | category:Technical & Diagnostic Data | Low | Unclassified data | Review and define retention policy |
| User-Uploaded Content | category:User-Uploaded Content | Low | Unclassified data | Review and define retention policy |
| Stored User Data | category:Stored User Data | Low | Unclassified data | Review and define retention policy |


---

## Recommendations

### Special Category Data (Art. 9) — 2 field(s)

- **Explicit consent required** (Art. 9(2)(a)): Standard consent is not sufficient; obtain explicit, informed consent for each specific purpose
- **Data Protection Impact Assessment (DPIA)** required under Art. 35 before processing
- **Appoint a Data Protection Officer (DPO)** if processing special categories at scale
- **Encryption at rest and in transit** is mandatory; consider additional access controls
- **Minimize collection**: Only collect what is strictly necessary for the stated purpose
- **Audit logging**: Maintain detailed access logs for all special category data

### High Sensitivity Data — 9 field(s)

- **Encrypt at rest and in transit** using industry-standard algorithms (AES-256, TLS 1.2+)
- **Tokenize payment data** — never store raw card numbers (PCI DSS requirement)
- **Hash credentials** with bcrypt, scrypt, or Argon2; never store plaintext passwords
- **Limit access** to personnel with a business need; implement role-based access control
- **Retain per regulatory requirements** (e.g., 7 years for financial records)
- **Regular security audits** and penetration testing recommended

### Medium Sensitivity Data — 12 field(s)

- **Encrypt in transit** (TLS 1.2+); encrypt at rest where feasible
- **Obtain clear consent** before collection; provide opt-out mechanisms
- **Allow user access and deletion** per GDPR Art. 15-17 (right of access, rectification, erasure)
- **Pseudonymize** where possible to reduce risk
- **Define clear retention periods** and automate data deletion

### Low Sensitivity Data — 55 field(s)

- **Encrypt in transit** (TLS 1.2+)
- **Anonymize or aggregate** analytics data where possible
- **Honor Do Not Track / Global Privacy Control** signals
- **Set appropriate retention periods** (typically 90 days for logs, 26 months for analytics)
- **Disclose in privacy policy** even for low-sensitivity data

---

*This classification is auto-generated based on code analysis. It should be reviewed by your legal and security teams. Data classification may change as your application evolves — re-run this scan regularly.*
