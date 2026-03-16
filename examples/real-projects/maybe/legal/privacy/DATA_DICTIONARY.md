# Data Dictionary

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** maybe

**Company:** [Your Company Name]

## Related Documents

- Data Flow Map (`DATA_FLOW_MAP.md`)
- Data Retention Policy (`DATA_RETENTION_POLICY.md`)
- Data Classification Report (`DATA_CLASSIFICATION.md`)

---

## 1. Purpose

This document catalogs every data field detected across the **maybe** application. It serves as the authoritative reference for data mapping required by GDPR Article 30 (Records of Processing Activities), SOC 2 (CC6.1), and internal data governance policies.

## 2. Scope

This dictionary covers data fields from:
- Database schemas (Prisma, Drizzle, Mongoose, TypeORM, SQLAlchemy, Django)
- API routes and request handlers
- Third-party service integrations
- Environment variable configurations

---

## 3. Data Field Catalog

| Field | Source | Type | Sensitivity | Retention | Purpose |
|-------|--------|------|-------------|-----------|---------|
| bank account data | plaid | Financial — Bank | Critical | 7 years (tax/legal) | Payment / payout processing |
| password_hash | rails-sessions | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| payment_info | plaid | Financial — PCI | Critical | Do not store post-authorization; tokenize | Payment processing |
| payment_info | stripe | Financial — PCI | Critical | Do not store post-authorization; tokenize | Payment processing |
| storage service credentials | Active Storage | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| billing address | stripe | Location | High | Until account deletion | Billing, shipping, localization |
| billing_address | plaid | Location | High | 7 years (tax/legal) | Billing |
| billing_address | stripe | Location | High | 7 years (tax/legal) | Billing |
| customer_email | plaid | Contact | High | Until account deletion + 30 days | Transaction receipts |
| customer_email | stripe | Contact | High | Until account deletion + 30 days | Transaction receipts |
| email | intercom-ruby | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email | rails-sessions | Contact | High | Until account deletion + 30 days | Account identification |
| email | stripe | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email addresses | ActionMailer | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email addresses | nodemailer | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email addresses | rails-actionmailer | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email content | ActionMailer | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email content | nodemailer | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email content | rails-actionmailer | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email_address | ActionMailer | Contact | High | Until unsubscribe or account deletion | Email delivery |
| email_address | nodemailer | Contact | High | Until unsubscribe or account deletion | Email delivery |
| email_address | rails-actionmailer | Contact | High | Until unsubscribe or account deletion | Email delivery |
| email_config | env: SMTP_USERNAME=*** | Infrastructure | High | Until service change | Email delivery configuration |
| name | intercom-ruby | Personal Identity | High | Until account deletion + 30 days | User identification |
| transaction_history | plaid | Financial | High | 7 years (tax/legal) | Order records, refunds |
| transaction_history | stripe | Financial | High | 7 years (tax/legal) | Order records, refunds |
| conversation history | ruby-openai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| conversation_history | ruby-openai | AI Interaction | Medium | 30 days (logs); per vendor policy | Context continuity |
| conversations | intercom-ruby | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| CSRF tokens | ActionController::Cookies | Session | Medium | Until session expiry | Session management |
| CSRF tokens | rails-sessions | Session | Medium | Until session expiry | Session management |
| email_content | ActionMailer | Communication | Medium | 90 days (delivery logs) | Email delivery |
| email_content | nodemailer | Communication | Medium | 90 days (delivery logs) | Email delivery |
| email_content | rails-actionmailer | Communication | Medium | 90 days (delivery logs) | Email delivery |
| IP addresses | rack-attack | Technical | Medium | 90 days | Security, rate limiting |
| ip_address | sentry-ruby | Technical | Medium | 30 days | Error context |
| oauth_token | rails-sessions | Authentication | Medium | Until session expiry or revocation | Third-party authentication |
| session cookies | ActionController::Cookies | Session | Medium | Until session expiry | Session management |
| session cookies | rails-sessions | Session | Medium | Until session expiry | Session management |
| session data | ActionController::Cookies | Session | Medium | Until session expiry | Session management |
| session data | redis | Session | Medium | Until session expiry | Session management |
| session_token | rails-sessions | Session | Medium | Until session expiry | Session management |
| uploaded_files | Active Storage | User Content | Medium | Until user-initiated deletion | File storage |
| uploaded_files | ActiveStorage | User Content | Medium | Until user-initiated deletion | File storage |
| uploaded_files | aws-sdk-s3 | User Content | Medium | Until user-initiated deletion | File storage |
| user prompts | ruby-openai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| user_context | sentry-ruby | Technical | Medium | 30 days | Error context |
| user_data | ActiveRecord | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | pg | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | rails-activerecord | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | redis | Application Data | Medium | Per data retention policy | Application functionality |
| user_prompts | ruby-openai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| account balances | plaid | Application Data | Low | Per data retention policy | Application functionality |
| AI Interaction Data | ruby-openai | Application Data | Low | Per data retention policy | Application functionality |
| associations | ActiveRecord | Application Data | Low | Per data retention policy | Application functionality |
| cached data | redis | Application Data | Low | Per data retention policy | Application functionality |
| channel subscriptions | ActionCable | Application Data | Low | Per data retention policy | Application functionality |
| Communication Data | rails-actionmailer | Application Data | Low | Per data retention policy | Application functionality |
| Communication Data | nodemailer | Application Data | Low | Per data retention policy | Application functionality |
| Communication Data | ActionMailer | Application Data | Low | Per data retention policy | Application functionality |
| connection metadata | ActionCable | Application Data | Low | Per data retention policy | Application functionality |
| device information | sentry-ruby | Application Data | Low | Per data retention policy | Application functionality |
| error data | sentry-ruby | Application Data | Low | Per data retention policy | Application functionality |
| error_data | sentry-ruby | Technical | Low | 30 days | Error tracking |
| file metadata | Active Storage | Application Data | Low | Per data retention policy | Application functionality |
| file metadata | ActiveStorage | Application Data | Low | Per data retention policy | Application functionality |
| file metadata | aws-sdk-s3 | Application Data | Low | Per data retention policy | Application functionality |
| file_metadata | Active Storage | Metadata | Low | Until file deletion | File management |
| file_metadata | ActiveStorage | Metadata | Low | Until file deletion | File management |
| file_metadata | aws-sdk-s3 | Metadata | Low | Until file deletion | File management |
| Financial Data | stripe | Application Data | Low | Per data retention policy | Application functionality |
| Financial Data | plaid | Application Data | Low | Per data retention policy | Application functionality |
| financial institution data | plaid | Application Data | Low | Per data retention policy | Application functionality |
| generated content | ruby-openai | Application Data | Low | Per data retention policy | Application functionality |
| generated_content | ruby-openai | AI Output | Low | Per user deletion request | AI feature delivery |
| job data | sidekiq | Application Data | Low | Per data retention policy | Application functionality |
| payment information | stripe | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | rails-sessions | Application Data | Low | Per data retention policy | Application functionality |
| potential PII in uploaded content | Active Storage | Application Data | Low | Per data retention policy | Application functionality |
| real-time user data | ActionCable | Application Data | Low | Per data retention policy | Application functionality |
| request metadata | rack-attack | Application Data | Low | Per data retention policy | Application functionality |
| stack traces | sentry-ruby | Application Data | Low | Per data retention policy | Application functionality |
| stack_traces | sentry-ruby | Technical | Low | 30 days | Debugging |
| storage references | ActiveStorage | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | pg | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | redis | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | rails-activerecord | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | ActiveRecord | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | Redis (Cache) | Application Data | Low | Per data retention policy | Application functionality |
| Technical & Diagnostic Data | sentry-ruby | Application Data | Low | Per data retention policy | Application functionality |
| timestamps | ActiveRecord | Metadata | Low | Same as parent record | Auditing |
| transaction history | plaid | Application Data | Low | Per data retention policy | Application functionality |
| transaction history | stripe | Application Data | Low | Per data retention policy | Application functionality |
| uploaded files | Active Storage | Application Data | Low | Per data retention policy | Application functionality |
| uploaded files | ActiveStorage | Application Data | Low | Per data retention policy | Application functionality |
| uploaded files | aws-sdk-s3 | Application Data | Low | Per data retention policy | Application functionality |
| user behavior | intercom-ruby | Application Data | Low | Per data retention policy | Application functionality |
| user context | sentry-ruby | Application Data | Low | Per data retention policy | Application functionality |
| user data as defined in schema | ActiveRecord | Application Data | Low | Per data retention policy | Application functionality |
| user data as defined in schema | pg | Application Data | Low | Per data retention policy | Application functionality |
| user data as defined in schema | rails-activerecord | Application Data | Low | Per data retention policy | Application functionality |
| user data processed in background jobs | sidekiq | Application Data | Low | Per data retention policy | Application functionality |
| user profiles | intercom-ruby | Application Data | Low | Per data retention policy | Application functionality |
| User-Uploaded Content | aws-sdk-s3 | Application Data | Low | Per data retention policy | Application functionality |
| User-Uploaded Content | ActiveStorage | Application Data | Low | Per data retention policy | Application functionality |
| User-Uploaded Content | Active Storage | Application Data | Low | Per data retention policy | Application functionality |
| WebSocket messages | ActionCable | Application Data | Low | Per data retention policy | Application functionality |

---

## 4. Sensitivity Summary

| Level | Count | Description |
|-------|-------|-------------|
| Critical | 5 | Credentials, government IDs, raw payment data — requires encryption at rest and strict access control |
| High | 21 | PII (names, emails, addresses) — requires encryption and consent |
| Medium | 26 | Behavioral data, session data, IP addresses — requires privacy notice |
| Low | 55 | Preferences, metadata, operational data — standard handling |

**Total fields cataloged:** 107

---

## 5. Cross-References

- **Environment variables** — Service credentials and connection strings
- **Other services** — ActionCable, ActionController::Cookies, intercom-ruby, rack-attack, sidekiq
- **Email services** — ActionMailer, nodemailer, rails-actionmailer
- **Storage services** — Active Storage, ActiveStorage, aws-sdk-s3
- **Database services** — ActiveRecord, pg, rails-activerecord, redis
- **Payment services** — plaid, stripe
- **Auth services** — rails-sessions
- **Ai services** — ruby-openai
- **Monitoring services** — sentry-ruby

---

## 6. Related Documents

- **PRIVACY_POLICY.md** — Public disclosure of data collection practices
- **DATA_RETENTION_POLICY.md** — Detailed retention schedules and deletion procedures
- **DATA_CLASSIFICATION.md** — GDPR sensitivity classification details
- **DATA_FLOW_MAP.md** — Visual representation of data flows between services
- **DSAR_HANDLING_GUIDE.md** — Data subject access request procedures

---

## 7. Maintenance

This data dictionary should be updated:

- When new database models or fields are added
- When new third-party services are integrated
- When data retention policies change
- At minimum **quarterly** as part of compliance review

For questions about this data dictionary, contact [your-email@example.com].

---

*This Data Dictionary was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Review and verify all entries for accuracy. This document does not constitute legal advice.*