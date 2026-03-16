# Data Dictionary

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** @mastodon/mastodon

**Company:** [Your Company Name]

## Related Documents

- Data Flow Map (`DATA_FLOW_MAP.md`)
- Data Retention Policy (`DATA_RETENTION_POLICY.md`)
- Data Classification Report (`DATA_CLASSIFICATION.md`)

---

## 1. Purpose

This document catalogs every data field detected across the **@mastodon/mastodon** application. It serves as the authoritative reference for data mapping required by GDPR Article 30 (Records of Processing Activities), SOC 2 (CC6.1), and internal data governance policies.

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
| password hash | devise | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| password_hash | devise | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| password_hash | omniauth | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| password_hash | pundit | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| password_hash | rails-sessions | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| storage service credentials | Active Storage | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| email | devise | Contact | High | Until account deletion + 30 days | Account identification |
| email | omniauth | Contact | High | Until account deletion + 30 days | Account identification |
| email | pundit | Contact | High | Until account deletion + 30 days | Account identification |
| email | rails-sessions | Contact | High | Until account deletion + 30 days | Account identification |
| email addresses | ActionMailer | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email addresses | rails-actionmailer | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email content | ActionMailer | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email content | rails-actionmailer | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email_address | ActionMailer | Contact | High | Until unsubscribe or account deletion | Email delivery |
| email_address | rails-actionmailer | Contact | High | Until unsubscribe or account deletion | Email delivery |
| IP address | ws (WebSocket) | Location | High | Until account deletion | Billing, shipping, localization |
| name | omniauth | Personal Identity | High | Until account deletion + 30 days | User identification |
| authentication tokens | devise | Session | Medium | Until session expiry | Session management |
| CSRF tokens | ActionController::Cookies | Session | Medium | Until session expiry | Session management |
| CSRF tokens | rails-sessions | Session | Medium | Until session expiry | Session management |
| email_content | ActionMailer | Communication | Medium | 90 days (delivery logs) | Email delivery |
| email_content | rails-actionmailer | Communication | Medium | 90 days (delivery logs) | Email delivery |
| IP addresses | rack-attack | Technical | Medium | 90 days | Security, rate limiting |
| OAuth tokens | omniauth | Session | Medium | Until session expiry | Session management |
| oauth_token | devise | Authentication | Medium | Until session expiry or revocation | Third-party authentication |
| oauth_token | omniauth | Authentication | Medium | Until session expiry or revocation | Third-party authentication |
| oauth_token | pundit | Authentication | Medium | Until session expiry or revocation | Third-party authentication |
| oauth_token | rails-sessions | Authentication | Medium | Until session expiry or revocation | Third-party authentication |
| session cookies | ActionController::Cookies | Session | Medium | Until session expiry | Session management |
| session cookies | rails-sessions | Session | Medium | Until session expiry | Session management |
| session data | ActionController::Cookies | Session | Medium | Until session expiry | Session management |
| session data | devise | Session | Medium | Until session expiry | Session management |
| session data | ioredis | Session | Medium | Until session expiry | Session management |
| session data | redis | Session | Medium | Until session expiry | Session management |
| session data | Redis | Session | Medium | Until session expiry | Session management |
| session_token | devise | Session | Medium | Until session expiry | Session management |
| session_token | omniauth | Session | Medium | Until session expiry | Session management |
| session_token | pundit | Session | Medium | Until session expiry | Session management |
| session_token | rails-sessions | Session | Medium | Until session expiry | Session management |
| uploaded_files | Active Storage | User Content | Medium | Until user-initiated deletion | File storage |
| uploaded_files | ActiveStorage | User Content | Medium | Until user-initiated deletion | File storage |
| uploaded_files | aws-sdk-s3 | User Content | Medium | Until user-initiated deletion | File storage |
| user_data | ActiveRecord | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | ioredis | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | pg | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | PostgreSQL | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | PostgreSQL (env) | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | rails-activerecord | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | redis | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | Redis | Application Data | Medium | Per data retention policy | Application functionality |
| access control data | pundit | Application Data | Low | Per data retention policy | Application functionality |
| application data | PostgreSQL | Application Data | Low | Per data retention policy | Application functionality |
| application data | PostgreSQL (env) | Application Data | Low | Per data retention policy | Application functionality |
| associations | ActiveRecord | Application Data | Low | Per data retention policy | Application functionality |
| authorization policies | pundit | Application Data | Low | Per data retention policy | Application functionality |
| cache data | Redis | Application Data | Low | Per data retention policy | Application functionality |
| cached data | ioredis | Application Data | Low | Per data retention policy | Application functionality |
| cached data | redis | Application Data | Low | Per data retention policy | Application functionality |
| channel subscriptions | ActionCable | Application Data | Low | Per data retention policy | Application functionality |
| Communication Data | rails-actionmailer | Application Data | Low | Per data retention policy | Application functionality |
| Communication Data | ActionMailer | Application Data | Low | Per data retention policy | Application functionality |
| connection metadata | ActionCable | Application Data | Low | Per data retention policy | Application functionality |
| connection metadata | ws (WebSocket) | Application Data | Low | Per data retention policy | Application functionality |
| file metadata | Active Storage | Application Data | Low | Per data retention policy | Application functionality |
| file metadata | ActiveStorage | Application Data | Low | Per data retention policy | Application functionality |
| file metadata | aws-sdk-s3 | Application Data | Low | Per data retention policy | Application functionality |
| file_metadata | Active Storage | Metadata | Low | Until file deletion | File management |
| file_metadata | ActiveStorage | Metadata | Low | Until file deletion | File management |
| file_metadata | aws-sdk-s3 | Metadata | Low | Until file deletion | File management |
| job data | sidekiq | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | devise | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | omniauth | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | pundit | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | rails-sessions | Application Data | Low | Per data retention policy | Application functionality |
| potential PII in uploaded content | Active Storage | Application Data | Low | Per data retention policy | Application functionality |
| profile data | omniauth | Application Data | Low | Per data retention policy | Application functionality |
| real-time user data | ActionCable | Application Data | Low | Per data retention policy | Application functionality |
| real-time user data | ws (WebSocket) | Application Data | Low | Per data retention policy | Application functionality |
| request metadata | rack-attack | Application Data | Low | Per data retention policy | Application functionality |
| storage references | ActiveStorage | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | pg | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | redis | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | ioredis | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | rails-activerecord | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | ActiveRecord | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | PostgreSQL (env) | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | PostgreSQL | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | Redis | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | Redis (Cache) | Application Data | Low | Per data retention policy | Application functionality |
| Technical & Diagnostic Data | Codecov | Application Data | Low | Per data retention policy | Application functionality |
| timestamps | ActiveRecord | Metadata | Low | Same as parent record | Auditing |
| uploaded files | Active Storage | Application Data | Low | Per data retention policy | Application functionality |
| uploaded files | ActiveStorage | Application Data | Low | Per data retention policy | Application functionality |
| uploaded files | aws-sdk-s3 | Application Data | Low | Per data retention policy | Application functionality |
| user data as defined in schema | ActiveRecord | Application Data | Low | Per data retention policy | Application functionality |
| user data as defined in schema | pg | Application Data | Low | Per data retention policy | Application functionality |
| user data as defined in schema | rails-activerecord | Application Data | Low | Per data retention policy | Application functionality |
| user data processed in background jobs | sidekiq | Application Data | Low | Per data retention policy | Application functionality |
| user records | PostgreSQL | Application Data | Low | Per data retention policy | Application functionality |
| user records | PostgreSQL (env) | Application Data | Low | Per data retention policy | Application functionality |
| user roles | pundit | Authorization | Low | Until account deletion | Access control |
| User-Uploaded Content | aws-sdk-s3 | Application Data | Low | Per data retention policy | Application functionality |
| User-Uploaded Content | ActiveStorage | Application Data | Low | Per data retention policy | Application functionality |
| User-Uploaded Content | Active Storage | Application Data | Low | Per data retention policy | Application functionality |
| WebSocket messages | ActionCable | Application Data | Low | Per data retention policy | Application functionality |
| WebSocket messages | ws (WebSocket) | Application Data | Low | Per data retention policy | Application functionality |

---

## 4. Sensitivity Summary

| Level | Count | Description |
|-------|-------|-------------|
| Critical | 6 | Credentials, government IDs, raw payment data — requires encryption at rest and strict access control |
| High | 12 | PII (names, emails, addresses) — requires encryption and consent |
| Medium | 33 | Behavioral data, session data, IP addresses — requires privacy notice |
| Low | 56 | Preferences, metadata, operational data — standard handling |

**Total fields cataloged:** 107

---

## 5. Cross-References

- **Other services** — ActionCable, ActionController::Cookies, rack-attack, sidekiq, ws (WebSocket)
- **Email services** — ActionMailer, rails-actionmailer
- **Storage services** — Active Storage, ActiveStorage, aws-sdk-s3
- **Database services** — ActiveRecord, ioredis, pg, PostgreSQL, PostgreSQL (env), rails-activerecord, redis, Redis
- **Auth services** — devise, omniauth, pundit, rails-sessions

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