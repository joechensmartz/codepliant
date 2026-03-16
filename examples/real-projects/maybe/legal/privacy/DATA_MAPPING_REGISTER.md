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
| 1 | real-time user data | General | Application-collected | ActionCable (third-party) | ActionCable | To be determined | To be determined |
| 2 | connection metadata | General | Application-collected | ActionCable (third-party) | ActionCable | To be determined | To be determined |
| 3 | channel subscriptions | Indirectly Identifiable | Automatic collection (HTTP request) | ActionCable (third-party) | ActionCable | To be determined | To be determined |
| 4 | WebSocket messages | General | Application-collected | ActionCable (third-party) | ActionCable | To be determined | To be determined |
| 5 | session cookies | Indirectly Identifiable | Automatic collection (cookies/SDK) | ActionController::Cookies (third-party) | ActionController::Cookies, rails-sessions, redis | To be determined | To be determined |
| 6 | session data | General | Automatic collection (cookies/SDK) | ActionController::Cookies (third-party) | ActionController::Cookies, rails-sessions, redis | To be determined | To be determined |
| 7 | CSRF tokens | Security Credential | Application-collected | ActionController::Cookies (third-party) | ActionController::Cookies, rails-sessions, redis | To be determined | To be determined |
| 8 | email addresses | Directly Identifiable | User-provided (registration/form) | ActionMailer (third-party) | ActionMailer, nodemailer, rails-actionmailer | Contract performance / Consent | Duration of account + 30 days |
| 9 | email content | Directly Identifiable | User-provided (registration/form) | ActionMailer (third-party) | ActionMailer, nodemailer, rails-actionmailer | Contract performance / Consent | Duration of account + 30 days |
| 10 | uploaded files | General | Application-collected | Active Storage (third-party) | Active Storage, ActiveStorage, aws-sdk-s3 | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 11 | file metadata | General | Application-collected | Active Storage (third-party) | Active Storage, ActiveStorage, aws-sdk-s3 | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 12 | storage service credentials | Security Credential | Application-collected | Active Storage (third-party) | Active Storage, ActiveStorage, aws-sdk-s3 | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 13 | potential PII in uploaded content | General | Application-collected | Active Storage (third-party) | Active Storage, ActiveStorage, aws-sdk-s3 | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 14 | user data as defined in schema | General | Application-collected | ActiveRecord (third-party) | ActiveRecord, pg, rails-activerecord | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 15 | timestamps | General | Application-collected | ActiveRecord (third-party) | ActiveRecord, pg, rails-activerecord | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 16 | associations | General | Application-collected | ActiveRecord (third-party) | ActiveRecord, pg, rails-activerecord | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 17 | storage references | General | Application-collected | ActiveStorage (third-party) | ActiveStorage | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 18 | user profiles | General | Application-collected | intercom-ruby (third-party) | intercom-ruby, stripe | To be determined | To be determined |
| 19 | email | Directly Identifiable | User-provided (registration/form) | intercom-ruby (third-party) | intercom-ruby, stripe | To be determined | To be determined |
| 20 | name | Directly Identifiable | User-provided (registration/form) | intercom-ruby (third-party) | intercom-ruby, stripe | To be determined | To be determined |
| 21 | conversations | General | Application-collected | intercom-ruby (third-party) | intercom-ruby, stripe | To be determined | To be determined |
| 22 | user behavior | General | Application-collected | intercom-ruby (third-party) | intercom-ruby, stripe | To be determined | To be determined |
| 23 | bank account data | Financial | Application-collected | plaid (third-party) | plaid, stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 24 | transaction history | General | Application-collected | plaid (third-party) | plaid, stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 25 | account balances | General | Application-collected | plaid (third-party) | plaid, stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 26 | financial institution data | Financial | Application-collected | plaid (third-party) | plaid, stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 27 | IP addresses | Directly Identifiable | Automatic collection (HTTP request) | rack-attack (third-party) | rack-attack | To be determined | To be determined |
| 28 | request metadata | General | Application-collected | rack-attack (third-party) | rack-attack | To be determined | To be determined |
| 29 | cached data | General | Application-collected | redis (third-party) | redis | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 30 | user prompts | General | User-provided / Application-generated | ruby-openai (third-party) | ruby-openai | Consent / Legitimate interest | Per AI provider policy / 30 days |
| 31 | conversation history | General | User-provided / Application-generated | ruby-openai (third-party) | ruby-openai | Consent / Legitimate interest | Per AI provider policy / 30 days |
| 32 | generated content | General | User-provided / Application-generated | ruby-openai (third-party) | ruby-openai | Consent / Legitimate interest | Per AI provider policy / 30 days |
| 33 | error data | General | Application-collected | sentry-ruby (third-party) | sentry-ruby | Legitimate interest (Art. 6(1)(f)) | 90 days |
| 34 | stack traces | General | Application-collected | sentry-ruby (third-party) | sentry-ruby | Legitimate interest (Art. 6(1)(f)) | 90 days |
| 35 | user context | General | Application-collected | sentry-ruby (third-party) | sentry-ruby | Legitimate interest (Art. 6(1)(f)) | 90 days |
| 36 | device information | Indirectly Identifiable | Automatic collection (HTTP request) | sentry-ruby (third-party) | sentry-ruby | Legitimate interest (Art. 6(1)(f)) | 90 days |
| 37 | job data | General | Application-collected | sidekiq (third-party) | sidekiq | To be determined | To be determined |
| 38 | user data processed in background jobs | General | Application-collected | sidekiq (third-party) | sidekiq | To be determined | To be determined |
| 39 | payment information | Financial | User-provided (checkout) | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 40 | billing address | Directly Identifiable | User-provided (registration/form) | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 41 | Personal Identity Data | General | rails-sessions | Application database | Internal only | To be determined | To be determined |
| 42 | Financial Data | Financial | stripe | Application database | Internal only | To be determined | To be determined |
| 43 | AI Interaction Data | General | ruby-openai | Application database | Internal only | To be determined | To be determined |
| 44 | Communication Data | General | rails-actionmailer | Application database | Internal only | To be determined | To be determined |
| 45 | Technical & Diagnostic Data | General | sentry-ruby | Application database | Internal only | To be determined | To be determined |
| 46 | User-Uploaded Content | General | aws-sdk-s3 | Application database | Internal only | To be determined | To be determined |
| 47 | Stored User Data | General | pg | Application database | Internal only | To be determined | To be determined |

## 3. Data Flow Summary

### General

| Data Element | Source | Destination |
|-------------|--------|-------------|
| real-time user data | Application-collected | ActionCable |
| connection metadata | Application-collected | ActionCable |
| WebSocket messages | Application-collected | ActionCable |
| session data | Automatic collection (cookies/SDK) | ActionController::Cookies, rails-sessions, redis |
| uploaded files | Application-collected | Active Storage, ActiveStorage, aws-sdk-s3 |
| file metadata | Application-collected | Active Storage, ActiveStorage, aws-sdk-s3 |
| potential PII in uploaded content | Application-collected | Active Storage, ActiveStorage, aws-sdk-s3 |
| user data as defined in schema | Application-collected | ActiveRecord, pg, rails-activerecord |
| timestamps | Application-collected | ActiveRecord, pg, rails-activerecord |
| associations | Application-collected | ActiveRecord, pg, rails-activerecord |
| storage references | Application-collected | ActiveStorage |
| user profiles | Application-collected | intercom-ruby, stripe |
| conversations | Application-collected | intercom-ruby, stripe |
| user behavior | Application-collected | intercom-ruby, stripe |
| transaction history | Application-collected | plaid, stripe |
| account balances | Application-collected | plaid, stripe |
| request metadata | Application-collected | rack-attack |
| cached data | Application-collected | redis |
| user prompts | User-provided / Application-generated | ruby-openai |
| conversation history | User-provided / Application-generated | ruby-openai |
| generated content | User-provided / Application-generated | ruby-openai |
| error data | Application-collected | sentry-ruby |
| stack traces | Application-collected | sentry-ruby |
| user context | Application-collected | sentry-ruby |
| job data | Application-collected | sidekiq |
| user data processed in background jobs | Application-collected | sidekiq |
| Personal Identity Data | rails-sessions | Application database |
| AI Interaction Data | ruby-openai | Application database |
| Communication Data | rails-actionmailer | Application database |
| Technical & Diagnostic Data | sentry-ruby | Application database |
| User-Uploaded Content | aws-sdk-s3 | Application database |
| Stored User Data | pg | Application database |

### Indirectly Identifiable

| Data Element | Source | Destination |
|-------------|--------|-------------|
| channel subscriptions | Automatic collection (HTTP request) | ActionCable |
| session cookies | Automatic collection (cookies/SDK) | ActionController::Cookies, rails-sessions, redis |
| device information | Automatic collection (HTTP request) | sentry-ruby |

### Security Credential

| Data Element | Source | Destination |
|-------------|--------|-------------|
| CSRF tokens | Application-collected | ActionController::Cookies, rails-sessions, redis |
| storage service credentials | Application-collected | Active Storage, ActiveStorage, aws-sdk-s3 |

### Directly Identifiable

| Data Element | Source | Destination |
|-------------|--------|-------------|
| email addresses | User-provided (registration/form) | ActionMailer, nodemailer, rails-actionmailer |
| email content | User-provided (registration/form) | ActionMailer, nodemailer, rails-actionmailer |
| email | User-provided (registration/form) | intercom-ruby, stripe |
| name | User-provided (registration/form) | intercom-ruby, stripe |
| IP addresses | Automatic collection (HTTP request) | rack-attack |
| billing address | User-provided (registration/form) | stripe |

### Financial

| Data Element | Source | Destination |
|-------------|--------|-------------|
| bank account data | Application-collected | plaid, stripe |
| financial institution data | Application-collected | plaid, stripe |
| payment information | User-provided (checkout) | stripe |
| Financial Data | stripe | Application database |

## 4. Third-Party Processors

| Processor | Data Shared | Purpose | DPA Status |
|-----------|------------|---------|------------|
| ActionCable | real-time user data, connection metadata, channel subscriptions, WebSocket messages | other | ⬜ To be verified |
| ActionController::Cookies | session cookies, session data, CSRF tokens | other | ⬜ To be verified |
| rails-sessions | session cookies, session data, CSRF tokens | auth | ⬜ To be verified |
| redis | session cookies, session data, CSRF tokens, cached data | database | ⬜ To be verified |
| ActionMailer | email addresses, email content | email | ⬜ To be verified |
| nodemailer | email addresses, email content | email | ⬜ To be verified |
| rails-actionmailer | email addresses, email content | email | ⬜ To be verified |
| Active Storage | uploaded files, file metadata, storage service credentials, potential PII in uploaded content | storage | ⬜ To be verified |
| ActiveStorage | uploaded files, file metadata, storage service credentials, potential PII in uploaded content, storage references | storage | ⬜ To be verified |
| aws-sdk-s3 | uploaded files, file metadata, storage service credentials, potential PII in uploaded content | storage | ⬜ To be verified |
| ActiveRecord | user data as defined in schema, timestamps, associations | database | ⬜ To be verified |
| pg | user data as defined in schema, timestamps, associations | database | ⬜ To be verified |
| rails-activerecord | user data as defined in schema, timestamps, associations | database | ⬜ To be verified |
| intercom-ruby | user profiles, email, name, conversations, user behavior | other | ⬜ To be verified |
| stripe | user profiles, email, name, conversations, user behavior, bank account data, transaction history, account balances, financial institution data, payment information, billing address | payment | ⬜ To be verified |
| plaid | bank account data, transaction history, account balances, financial institution data | payment | ⬜ To be verified |
| rack-attack | IP addresses, request metadata | other | ⬜ To be verified |
| ruby-openai | user prompts, conversation history, generated content | ai | ⬜ To be verified |
| sentry-ruby | error data, stack traces, user context, device information | monitoring | ⬜ To be verified |
| sidekiq | job data, user data processed in background jobs | other | ⬜ To be verified |

## 5. International Data Transfers

| Processor | Transfer Destination | Safeguard Mechanism | Status |
|-----------|---------------------|---------------------|--------|
| ActionCable | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| ActionController::Cookies | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| rails-sessions | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| redis | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| ActionMailer | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| nodemailer | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| rails-actionmailer | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| Active Storage | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| ActiveStorage | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| aws-sdk-s3 | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| ActiveRecord | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| pg | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| rails-activerecord | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| intercom-ruby | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| stripe | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| plaid | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| rack-attack | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| ruby-openai | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| sentry-ruby | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| sidekiq | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |

## 6. Retention Schedule

| Data Category | Retention Period | Deletion Method | Legal Basis for Retention |
|---------------|-----------------|-----------------|--------------------------|
| General | To be determined | Automated purge + manual verification | To be determined |
| Indirectly Identifiable | To be determined | Automated purge + manual verification | To be determined |
| Security Credential | To be determined | Automated purge + manual verification | To be determined |
| Directly Identifiable | Duration of account + 30 days | Automated purge + manual verification | Contract performance / Consent |
| Financial | 7 years (tax/legal obligation) | Automated purge + manual verification | Contract performance (Art. 6(1)(b)) |

---

*This data mapping register is generated from automated code analysis and should be reviewed by your Data Protection Officer and legal team. It may not capture all data processing activities, particularly those conducted outside the scanned codebase. This does not constitute legal advice.*
