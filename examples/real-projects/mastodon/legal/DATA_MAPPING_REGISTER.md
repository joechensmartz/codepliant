# Data Mapping Register

> **Document Version:** 1.0
> **Document Owner:** [Your Company Name]
> **Generated:** 2026-03-16 by [Codepliant](https://github.com/joechensmartz/codepliant)
> **Next Review Date:** 2027-03-16

This register provides a complete inventory of personal data processing activities
in compliance with GDPR Article 30 (Records of Processing Activities).

## 1. Data Controller Information

| Field | Details |
|-------|---------|
| **Data Controller** | [Your Company Name] |
| **Contact Email** | [your-email@example.com] |
| **Data Protection Officer** | [Data Protection Officer Name] |
| **DPO Email** | [your-email@example.com] |
| **Register Last Updated** | 2026-03-16 |

## 2. Data Inventory

| # | Data Element | Sensitivity | Source | Storage Location | Shared With | Lawful Basis | Retention |
|---|-------------|-------------|--------|------------------|-------------|--------------|-----------|
| 1 | real-time user data | General | Application-collected | ActionCable (third-party) | ActionCable, ws (WebSocket) | To be determined | To be determined |
| 2 | connection metadata | General | Application-collected | ActionCable (third-party) | ActionCable, ws (WebSocket) | To be determined | To be determined |
| 3 | channel subscriptions | Indirectly Identifiable | Automatic collection (HTTP request) | ActionCable (third-party) | ActionCable, ws (WebSocket) | To be determined | To be determined |
| 4 | WebSocket messages | General | Application-collected | ActionCable (third-party) | ActionCable, ws (WebSocket) | To be determined | To be determined |
| 5 | session cookies | Indirectly Identifiable | Automatic collection (cookies/SDK) | ActionController::Cookies (third-party) | ActionController::Cookies, devise, ioredis, rails-sessions, redis, Redis | To be determined | To be determined |
| 6 | session data | General | Automatic collection (cookies/SDK) | ActionController::Cookies (third-party) | ActionController::Cookies, devise, ioredis, rails-sessions, redis, Redis | To be determined | To be determined |
| 7 | CSRF tokens | Security Credential | Application-collected | ActionController::Cookies (third-party) | ActionController::Cookies, devise, ioredis, rails-sessions, redis, Redis | To be determined | To be determined |
| 8 | email addresses | Directly Identifiable | User-provided (registration/form) | ActionMailer (third-party) | ActionMailer, rails-actionmailer | Contract performance / Consent | Duration of account + 30 days |
| 9 | email content | Directly Identifiable | User-provided (registration/form) | ActionMailer (third-party) | ActionMailer, rails-actionmailer | Contract performance / Consent | Duration of account + 30 days |
| 10 | uploaded files | General | Application-collected | Active Storage (third-party) | Active Storage, ActiveStorage, aws-sdk-s3 | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 11 | file metadata | General | Application-collected | Active Storage (third-party) | Active Storage, ActiveStorage, aws-sdk-s3 | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 12 | storage service credentials | Security Credential | Application-collected | Active Storage (third-party) | Active Storage, ActiveStorage, aws-sdk-s3 | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 13 | potential PII in uploaded content | General | Application-collected | Active Storage (third-party) | Active Storage, ActiveStorage, aws-sdk-s3 | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 14 | user data as defined in schema | General | Application-collected | ActiveRecord (third-party) | ActiveRecord, pg, rails-activerecord | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 15 | timestamps | General | Application-collected | ActiveRecord (third-party) | ActiveRecord, pg, rails-activerecord | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 16 | associations | General | Application-collected | ActiveRecord (third-party) | ActiveRecord, pg, rails-activerecord | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 17 | storage references | General | Application-collected | ActiveStorage (third-party) | ActiveStorage | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 18 | email | Directly Identifiable | User-provided (registration/form) | devise (third-party) | devise, omniauth | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 19 | password hash | Security Credential | Application-collected | devise (third-party) | devise, omniauth | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 20 | authentication tokens | Security Credential | Application-collected | devise (third-party) | devise, omniauth | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 21 | cached data | General | Application-collected | ioredis (third-party) | ioredis, redis | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 22 | name | Directly Identifiable | User-provided (registration/form) | omniauth (third-party) | omniauth | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 23 | OAuth tokens | Security Credential | Application-collected | omniauth (third-party) | omniauth | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 24 | profile data | General | Application-collected | omniauth (third-party) | omniauth | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 25 | application data | General | Application-collected | PostgreSQL (third-party) | PostgreSQL, PostgreSQL (env) | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 26 | user records | General | Application-collected | PostgreSQL (third-party) | PostgreSQL, PostgreSQL (env) | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 27 | user roles | General | Application-collected | pundit (third-party) | pundit | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 28 | authorization policies | General | Application-collected | pundit (third-party) | pundit | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 29 | access control data | General | Application-collected | pundit (third-party) | pundit | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 30 | IP addresses | Directly Identifiable | Automatic collection (HTTP request) | rack-attack (third-party) | rack-attack | To be determined | To be determined |
| 31 | request metadata | General | Application-collected | rack-attack (third-party) | rack-attack | To be determined | To be determined |
| 32 | cache data | General | Application-collected | Redis (third-party) | Redis | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 33 | job data | General | Application-collected | sidekiq (third-party) | sidekiq | To be determined | To be determined |
| 34 | user data processed in background jobs | General | Application-collected | sidekiq (third-party) | sidekiq | To be determined | To be determined |
| 35 | IP address | Directly Identifiable | Automatic collection (HTTP request) | ws (WebSocket) (third-party) | ws (WebSocket) | To be determined | To be determined |
| 36 | Personal Identity Data | General | devise | Application database | Internal only | To be determined | To be determined |
| 37 | Communication Data | General | rails-actionmailer | Application database | Internal only | To be determined | To be determined |
| 38 | Technical & Diagnostic Data | General | Codecov | Application database | Internal only | To be determined | To be determined |
| 39 | User-Uploaded Content | General | aws-sdk-s3 | Application database | Internal only | To be determined | To be determined |
| 40 | Stored User Data | General | pg | Application database | Internal only | To be determined | To be determined |

## 3. Data Flow Summary

### General

| Data Element | Source | Destination |
|-------------|--------|-------------|
| real-time user data | Application-collected | ActionCable, ws (WebSocket) |
| connection metadata | Application-collected | ActionCable, ws (WebSocket) |
| WebSocket messages | Application-collected | ActionCable, ws (WebSocket) |
| session data | Automatic collection (cookies/SDK) | ActionController::Cookies, devise, ioredis, rails-sessions, redis, Redis |
| uploaded files | Application-collected | Active Storage, ActiveStorage, aws-sdk-s3 |
| file metadata | Application-collected | Active Storage, ActiveStorage, aws-sdk-s3 |
| potential PII in uploaded content | Application-collected | Active Storage, ActiveStorage, aws-sdk-s3 |
| user data as defined in schema | Application-collected | ActiveRecord, pg, rails-activerecord |
| timestamps | Application-collected | ActiveRecord, pg, rails-activerecord |
| associations | Application-collected | ActiveRecord, pg, rails-activerecord |
| storage references | Application-collected | ActiveStorage |
| cached data | Application-collected | ioredis, redis |
| profile data | Application-collected | omniauth |
| application data | Application-collected | PostgreSQL, PostgreSQL (env) |
| user records | Application-collected | PostgreSQL, PostgreSQL (env) |
| user roles | Application-collected | pundit |
| authorization policies | Application-collected | pundit |
| access control data | Application-collected | pundit |
| request metadata | Application-collected | rack-attack |
| cache data | Application-collected | Redis |
| job data | Application-collected | sidekiq |
| user data processed in background jobs | Application-collected | sidekiq |
| Personal Identity Data | devise | Application database |
| Communication Data | rails-actionmailer | Application database |
| Technical & Diagnostic Data | Codecov | Application database |
| User-Uploaded Content | aws-sdk-s3 | Application database |
| Stored User Data | pg | Application database |

### Indirectly Identifiable

| Data Element | Source | Destination |
|-------------|--------|-------------|
| channel subscriptions | Automatic collection (HTTP request) | ActionCable, ws (WebSocket) |
| session cookies | Automatic collection (cookies/SDK) | ActionController::Cookies, devise, ioredis, rails-sessions, redis, Redis |

### Security Credential

| Data Element | Source | Destination |
|-------------|--------|-------------|
| CSRF tokens | Application-collected | ActionController::Cookies, devise, ioredis, rails-sessions, redis, Redis |
| storage service credentials | Application-collected | Active Storage, ActiveStorage, aws-sdk-s3 |
| password hash | Application-collected | devise, omniauth |
| authentication tokens | Application-collected | devise, omniauth |
| OAuth tokens | Application-collected | omniauth |

### Directly Identifiable

| Data Element | Source | Destination |
|-------------|--------|-------------|
| email addresses | User-provided (registration/form) | ActionMailer, rails-actionmailer |
| email content | User-provided (registration/form) | ActionMailer, rails-actionmailer |
| email | User-provided (registration/form) | devise, omniauth |
| name | User-provided (registration/form) | omniauth |
| IP addresses | Automatic collection (HTTP request) | rack-attack |
| IP address | Automatic collection (HTTP request) | ws (WebSocket) |

## 4. Third-Party Processors

| Processor | Data Shared | Purpose | DPA Status |
|-----------|------------|---------|------------|
| ActionCable | real-time user data, connection metadata, channel subscriptions, WebSocket messages | other | ⬜ To be verified |
| ws (WebSocket) | real-time user data, connection metadata, channel subscriptions, WebSocket messages, IP address | other | ⬜ To be verified |
| ActionController::Cookies | session cookies, session data, CSRF tokens | other | ⬜ To be verified |
| devise | session cookies, session data, CSRF tokens, email, password hash, authentication tokens | auth | ⬜ To be verified |
| ioredis | session cookies, session data, CSRF tokens, cached data | database | ⬜ To be verified |
| rails-sessions | session cookies, session data, CSRF tokens | auth | ⬜ To be verified |
| redis | session cookies, session data, CSRF tokens, cached data | database | ⬜ To be verified |
| Redis | session cookies, session data, CSRF tokens, cache data | database | ⬜ To be verified |
| ActionMailer | email addresses, email content | email | ⬜ To be verified |
| rails-actionmailer | email addresses, email content | email | ⬜ To be verified |
| Active Storage | uploaded files, file metadata, storage service credentials, potential PII in uploaded content | storage | ⬜ To be verified |
| ActiveStorage | uploaded files, file metadata, storage service credentials, potential PII in uploaded content, storage references | storage | ⬜ To be verified |
| aws-sdk-s3 | uploaded files, file metadata, storage service credentials, potential PII in uploaded content | storage | ⬜ To be verified |
| ActiveRecord | user data as defined in schema, timestamps, associations | database | ⬜ To be verified |
| pg | user data as defined in schema, timestamps, associations | database | ⬜ To be verified |
| rails-activerecord | user data as defined in schema, timestamps, associations | database | ⬜ To be verified |
| omniauth | email, password hash, authentication tokens, name, OAuth tokens, profile data | auth | ⬜ To be verified |
| PostgreSQL | application data, user records | database | ⬜ To be verified |
| PostgreSQL (env) | application data, user records | database | ⬜ To be verified |
| pundit | user roles, authorization policies, access control data | auth | ⬜ To be verified |
| rack-attack | IP addresses, request metadata | other | ⬜ To be verified |
| sidekiq | job data, user data processed in background jobs | other | ⬜ To be verified |

## 5. International Data Transfers

| Processor | Transfer Destination | Safeguard Mechanism | Status |
|-----------|---------------------|---------------------|--------|
| ActionCable | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| ws (WebSocket) | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| ActionController::Cookies | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| devise | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| ioredis | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| rails-sessions | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| redis | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| Redis | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| ActionMailer | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| rails-actionmailer | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| Active Storage | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| ActiveStorage | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| aws-sdk-s3 | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| ActiveRecord | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| pg | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| rails-activerecord | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| omniauth | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| PostgreSQL | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| PostgreSQL (env) | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| pundit | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| rack-attack | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| sidekiq | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |

## 6. Retention Schedule

| Data Category | Retention Period | Deletion Method | Legal Basis for Retention |
|---------------|-----------------|-----------------|--------------------------|
| General | To be determined | Automated purge + manual verification | To be determined |
| Indirectly Identifiable | To be determined | Automated purge + manual verification | To be determined |
| Security Credential | To be determined | Automated purge + manual verification | To be determined |
| Directly Identifiable | Duration of account + 30 days | Automated purge + manual verification | Contract performance / Consent |

---

*This data mapping register is generated from automated code analysis and should be reviewed by your Data Protection Officer and legal team. It may not capture all data processing activities, particularly those conducted outside the scanned codebase. This does not constitute legal advice.*
