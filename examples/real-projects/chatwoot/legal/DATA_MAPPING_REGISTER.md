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
| 1 | user behavior | General | Automatic collection (analytics SDK) | @amplitude/analytics-browser (third-party) | @amplitude/analytics-browser, @twilio/voice-sdk, ActionController::Cookies, devise, ioredis, Meta Pixel, redis, Redis, Redis (env), sentry-ruby | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 2 | device information | Indirectly Identifiable | Automatic collection (HTTP request) | @amplitude/analytics-browser (third-party) | @amplitude/analytics-browser, @twilio/voice-sdk, ActionController::Cookies, devise, ioredis, Meta Pixel, redis, Redis, Redis (env), sentry-ruby | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 3 | session data | General | Automatic collection (cookies/SDK) | @amplitude/analytics-browser (third-party) | @amplitude/analytics-browser, @twilio/voice-sdk, ActionController::Cookies, devise, ioredis, Meta Pixel, redis, Redis, Redis (env), sentry-ruby | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 4 | uploaded files | General | Application-collected | @aws-sdk/client-s3 (third-party) | @aws-sdk/client-s3, Active Storage, ActiveStorage, aws-sdk-s3, google-cloud-storage | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 5 | file metadata | General | Application-collected | @aws-sdk/client-s3 (third-party) | @aws-sdk/client-s3, Active Storage, ActiveStorage, aws-sdk-s3, google-cloud-storage | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 6 | phone numbers | Directly Identifiable | User-provided (registration/form) | @twilio/voice-sdk (third-party) | @twilio/voice-sdk, twilio-ruby | To be determined | To be determined |
| 7 | voice call metadata | General | Application-collected | @twilio/voice-sdk (third-party) | @twilio/voice-sdk, twilio-ruby | To be determined | To be determined |
| 8 | call recordings | General | Application-collected | @twilio/voice-sdk (third-party) | @twilio/voice-sdk, twilio-ruby | To be determined | To be determined |
| 9 | real-time user data | General | Application-collected | ActionCable (third-party) | ActionCable | To be determined | To be determined |
| 10 | connection metadata | General | Application-collected | ActionCable (third-party) | ActionCable | To be determined | To be determined |
| 11 | channel subscriptions | Indirectly Identifiable | Automatic collection (HTTP request) | ActionCable (third-party) | ActionCable | To be determined | To be determined |
| 12 | WebSocket messages | General | Application-collected | ActionCable (third-party) | ActionCable | To be determined | To be determined |
| 13 | session cookies | Indirectly Identifiable | Automatic collection (cookies/SDK) | ActionController::Cookies (third-party) | ActionController::Cookies, rails-sessions | To be determined | To be determined |
| 14 | CSRF tokens | Security Credential | Application-collected | ActionController::Cookies (third-party) | ActionController::Cookies, rails-sessions | To be determined | To be determined |
| 15 | email addresses | Directly Identifiable | User-provided (registration/form) | ActionMailer (third-party) | ActionMailer, MailHog, nodemailer, rails-actionmailer | Contract performance / Consent | Duration of account + 30 days |
| 16 | email content | Directly Identifiable | User-provided (registration/form) | ActionMailer (third-party) | ActionMailer, MailHog, nodemailer, rails-actionmailer | Contract performance / Consent | Duration of account + 30 days |
| 17 | storage service credentials | Security Credential | Application-collected | Active Storage (third-party) | Active Storage | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 18 | potential PII in uploaded content | General | Application-collected | Active Storage (third-party) | Active Storage | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 19 | user data as defined in schema | General | Application-collected | ActiveRecord (third-party) | ActiveRecord, pg, rails-activerecord | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 20 | timestamps | General | Application-collected | ActiveRecord (third-party) | ActiveRecord, pg, rails-activerecord | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 21 | associations | General | Application-collected | ActiveRecord (third-party) | ActiveRecord, pg, rails-activerecord | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 22 | storage references | General | Application-collected | ActiveStorage (third-party) | ActiveStorage | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 23 | email | Directly Identifiable | User-provided (registration/form) | devise (third-party) | devise, omniauth, stripe | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 24 | password hash | Security Credential | Application-collected | devise (third-party) | devise, omniauth, stripe | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 25 | authentication tokens | Security Credential | Application-collected | devise (third-party) | devise, omniauth, stripe | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 26 | cached data | General | Application-collected | ioredis (third-party) | ioredis, redis | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 27 | page views | General | Application-collected | Meta Pixel (third-party) | Meta Pixel | Consent (Art. 6(1)(a)) | Until consent withdrawn |
| 28 | conversion events | General | Application-collected | Meta Pixel (third-party) | Meta Pixel | Consent (Art. 6(1)(a)) | Until consent withdrawn |
| 29 | name | Directly Identifiable | User-provided (registration/form) | omniauth (third-party) | omniauth | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 30 | OAuth tokens | Security Credential | Application-collected | omniauth (third-party) | omniauth | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 31 | profile data | General | Application-collected | omniauth (third-party) | omniauth | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 32 | application data | General | Application-collected | PostgreSQL (env) (third-party) | PostgreSQL (env) | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 33 | user records | General | Application-collected | PostgreSQL (env) (third-party) | PostgreSQL (env) | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 34 | user roles | General | Application-collected | pundit (third-party) | pundit | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 35 | authorization policies | General | Application-collected | pundit (third-party) | pundit | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 36 | access control data | General | Application-collected | pundit (third-party) | pundit | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 37 | IP addresses | Directly Identifiable | Automatic collection (HTTP request) | rack-attack (third-party) | rack-attack | To be determined | To be determined |
| 38 | request metadata | General | Application-collected | rack-attack (third-party) | rack-attack | To be determined | To be determined |
| 39 | cache data | General | Application-collected | Redis (third-party) | Redis, Redis (env) | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 40 | user prompts | General | User-provided / Application-generated | ruby-openai (third-party) | ruby-openai | Consent / Legitimate interest | Per AI provider policy / 30 days |
| 41 | conversation history | General | User-provided / Application-generated | ruby-openai (third-party) | ruby-openai | Consent / Legitimate interest | Per AI provider policy / 30 days |
| 42 | generated content | General | User-provided / Application-generated | ruby-openai (third-party) | ruby-openai | Consent / Legitimate interest | Per AI provider policy / 30 days |
| 43 | error data | General | Application-collected | sentry-ruby (third-party) | sentry-ruby | Legitimate interest (Art. 6(1)(f)) | 90 days |
| 44 | stack traces | General | Application-collected | sentry-ruby (third-party) | sentry-ruby | Legitimate interest (Art. 6(1)(f)) | 90 days |
| 45 | user context | General | Application-collected | sentry-ruby (third-party) | sentry-ruby | Legitimate interest (Art. 6(1)(f)) | 90 days |
| 46 | job data | General | Application-collected | sidekiq (third-party) | sidekiq | To be determined | To be determined |
| 47 | user data processed in background jobs | General | Application-collected | sidekiq (third-party) | sidekiq | To be determined | To be determined |
| 48 | payment information | Financial | User-provided (checkout) | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 49 | billing address | Directly Identifiable | User-provided (registration/form) | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 50 | transaction history | General | Application-collected | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 51 | SMS message content | General | Application-collected | twilio-ruby (third-party) | twilio-ruby | To be determined | To be determined |
| 52 | Personal Identity Data | General | devise | Application database | Internal only | To be determined | To be determined |
| 53 | Financial Data | Financial | stripe | Application database | Internal only | To be determined | To be determined |
| 54 | Usage & Behavioral Data | General | @amplitude/analytics-browser | Application database | Internal only | To be determined | To be determined |
| 55 | AI Interaction Data | General | ruby-openai | Application database | Internal only | To be determined | To be determined |
| 56 | Communication Data | General | rails-actionmailer | Application database | Internal only | To be determined | To be determined |
| 57 | Technical & Diagnostic Data | General | sentry-ruby | Application database | Internal only | To be determined | To be determined |
| 58 | User-Uploaded Content | General | aws-sdk-s3 | Application database | Internal only | To be determined | To be determined |
| 59 | Advertising & Conversion Data | General | Meta Pixel | Application database | Internal only | To be determined | To be determined |
| 60 | Stored User Data | General | pg | Application database | Internal only | To be determined | To be determined |
| 61 | Contact Information | General | items.email | Application database | Internal only | To be determined | To be determined |
| 62 | Authentication Data | General | profile.password | Application database | Internal only | To be determined | To be determined |
| 63 | Location Data | General | inbox.timezone | Application database | Internal only | To be determined | To be determined |

## 3. Data Flow Summary

### General

| Data Element | Source | Destination |
|-------------|--------|-------------|
| user behavior | Automatic collection (analytics SDK) | @amplitude/analytics-browser, @twilio/voice-sdk, ActionController::Cookies, devise, ioredis, Meta Pixel, redis, Redis, Redis (env), sentry-ruby |
| session data | Automatic collection (cookies/SDK) | @amplitude/analytics-browser, @twilio/voice-sdk, ActionController::Cookies, devise, ioredis, Meta Pixel, redis, Redis, Redis (env), sentry-ruby |
| uploaded files | Application-collected | @aws-sdk/client-s3, Active Storage, ActiveStorage, aws-sdk-s3, google-cloud-storage |
| file metadata | Application-collected | @aws-sdk/client-s3, Active Storage, ActiveStorage, aws-sdk-s3, google-cloud-storage |
| voice call metadata | Application-collected | @twilio/voice-sdk, twilio-ruby |
| call recordings | Application-collected | @twilio/voice-sdk, twilio-ruby |
| real-time user data | Application-collected | ActionCable |
| connection metadata | Application-collected | ActionCable |
| WebSocket messages | Application-collected | ActionCable |
| potential PII in uploaded content | Application-collected | Active Storage |
| user data as defined in schema | Application-collected | ActiveRecord, pg, rails-activerecord |
| timestamps | Application-collected | ActiveRecord, pg, rails-activerecord |
| associations | Application-collected | ActiveRecord, pg, rails-activerecord |
| storage references | Application-collected | ActiveStorage |
| cached data | Application-collected | ioredis, redis |
| page views | Application-collected | Meta Pixel |
| conversion events | Application-collected | Meta Pixel |
| profile data | Application-collected | omniauth |
| application data | Application-collected | PostgreSQL (env) |
| user records | Application-collected | PostgreSQL (env) |
| user roles | Application-collected | pundit |
| authorization policies | Application-collected | pundit |
| access control data | Application-collected | pundit |
| request metadata | Application-collected | rack-attack |
| cache data | Application-collected | Redis, Redis (env) |
| user prompts | User-provided / Application-generated | ruby-openai |
| conversation history | User-provided / Application-generated | ruby-openai |
| generated content | User-provided / Application-generated | ruby-openai |
| error data | Application-collected | sentry-ruby |
| stack traces | Application-collected | sentry-ruby |
| user context | Application-collected | sentry-ruby |
| job data | Application-collected | sidekiq |
| user data processed in background jobs | Application-collected | sidekiq |
| transaction history | Application-collected | stripe |
| SMS message content | Application-collected | twilio-ruby |
| Personal Identity Data | devise | Application database |
| Usage & Behavioral Data | @amplitude/analytics-browser | Application database |
| AI Interaction Data | ruby-openai | Application database |
| Communication Data | rails-actionmailer | Application database |
| Technical & Diagnostic Data | sentry-ruby | Application database |
| User-Uploaded Content | aws-sdk-s3 | Application database |
| Advertising & Conversion Data | Meta Pixel | Application database |
| Stored User Data | pg | Application database |
| Contact Information | items.email | Application database |
| Authentication Data | profile.password | Application database |
| Location Data | inbox.timezone | Application database |

### Indirectly Identifiable

| Data Element | Source | Destination |
|-------------|--------|-------------|
| device information | Automatic collection (HTTP request) | @amplitude/analytics-browser, @twilio/voice-sdk, ActionController::Cookies, devise, ioredis, Meta Pixel, redis, Redis, Redis (env), sentry-ruby |
| channel subscriptions | Automatic collection (HTTP request) | ActionCable |
| session cookies | Automatic collection (cookies/SDK) | ActionController::Cookies, rails-sessions |

### Directly Identifiable

| Data Element | Source | Destination |
|-------------|--------|-------------|
| phone numbers | User-provided (registration/form) | @twilio/voice-sdk, twilio-ruby |
| email addresses | User-provided (registration/form) | ActionMailer, MailHog, nodemailer, rails-actionmailer |
| email content | User-provided (registration/form) | ActionMailer, MailHog, nodemailer, rails-actionmailer |
| email | User-provided (registration/form) | devise, omniauth, stripe |
| name | User-provided (registration/form) | omniauth |
| IP addresses | Automatic collection (HTTP request) | rack-attack |
| billing address | User-provided (registration/form) | stripe |

### Security Credential

| Data Element | Source | Destination |
|-------------|--------|-------------|
| CSRF tokens | Application-collected | ActionController::Cookies, rails-sessions |
| storage service credentials | Application-collected | Active Storage |
| password hash | Application-collected | devise, omniauth, stripe |
| authentication tokens | Application-collected | devise, omniauth, stripe |
| OAuth tokens | Application-collected | omniauth |

### Financial

| Data Element | Source | Destination |
|-------------|--------|-------------|
| payment information | User-provided (checkout) | stripe |
| Financial Data | stripe | Application database |

## 4. Third-Party Processors

| Processor | Data Shared | Purpose | DPA Status |
|-----------|------------|---------|------------|
| @amplitude/analytics-browser | user behavior, device information, session data | analytics | ⬜ To be verified |
| @twilio/voice-sdk | user behavior, device information, session data, phone numbers, voice call metadata, call recordings | other | ⬜ To be verified |
| ActionController::Cookies | user behavior, device information, session data, session cookies, CSRF tokens | other | ⬜ To be verified |
| devise | user behavior, device information, session data, email, password hash, authentication tokens | auth | ⬜ To be verified |
| ioredis | user behavior, device information, session data, cached data | database | ⬜ To be verified |
| Meta Pixel | user behavior, device information, session data, page views, conversion events | advertising | ⬜ To be verified |
| redis | user behavior, device information, session data, cached data | database | ⬜ To be verified |
| Redis | user behavior, device information, session data, cache data | database | ⬜ To be verified |
| Redis (env) | user behavior, device information, session data, cache data | database | ⬜ To be verified |
| sentry-ruby | user behavior, device information, session data, error data, stack traces, user context | monitoring | ⬜ To be verified |
| @aws-sdk/client-s3 | uploaded files, file metadata | storage | ⬜ To be verified |
| Active Storage | uploaded files, file metadata, storage service credentials, potential PII in uploaded content | storage | ⬜ To be verified |
| ActiveStorage | uploaded files, file metadata, storage references | storage | ⬜ To be verified |
| aws-sdk-s3 | uploaded files, file metadata | storage | ⬜ To be verified |
| google-cloud-storage | uploaded files, file metadata | storage | ⬜ To be verified |
| twilio-ruby | phone numbers, voice call metadata, call recordings, SMS message content | other | ⬜ To be verified |
| ActionCable | real-time user data, connection metadata, channel subscriptions, WebSocket messages | other | ⬜ To be verified |
| rails-sessions | session cookies, CSRF tokens | auth | ⬜ To be verified |
| ActionMailer | email addresses, email content | email | ⬜ To be verified |
| MailHog | email addresses, email content | email | ⬜ To be verified |
| nodemailer | email addresses, email content | email | ⬜ To be verified |
| rails-actionmailer | email addresses, email content | email | ⬜ To be verified |
| ActiveRecord | user data as defined in schema, timestamps, associations | database | ⬜ To be verified |
| pg | user data as defined in schema, timestamps, associations | database | ⬜ To be verified |
| rails-activerecord | user data as defined in schema, timestamps, associations | database | ⬜ To be verified |
| omniauth | email, password hash, authentication tokens, name, OAuth tokens, profile data | auth | ⬜ To be verified |
| stripe | email, password hash, authentication tokens, payment information, billing address, transaction history | payment | ⬜ To be verified |
| PostgreSQL (env) | application data, user records | database | ⬜ To be verified |
| pundit | user roles, authorization policies, access control data | auth | ⬜ To be verified |
| rack-attack | IP addresses, request metadata | other | ⬜ To be verified |
| ruby-openai | user prompts, conversation history, generated content | ai | ⬜ To be verified |
| sidekiq | job data, user data processed in background jobs | other | ⬜ To be verified |

## 5. International Data Transfers

| Processor | Transfer Destination | Safeguard Mechanism | Status |
|-----------|---------------------|---------------------|--------|
| @amplitude/analytics-browser | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| @twilio/voice-sdk | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| ActionController::Cookies | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| devise | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| ioredis | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| Meta Pixel | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| redis | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| Redis | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| Redis (env) | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| sentry-ruby | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| @aws-sdk/client-s3 | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| Active Storage | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| ActiveStorage | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| aws-sdk-s3 | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| google-cloud-storage | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| twilio-ruby | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| ActionCable | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| rails-sessions | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| ActionMailer | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| MailHog | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| nodemailer | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| rails-actionmailer | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| ActiveRecord | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| pg | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| rails-activerecord | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| omniauth | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| stripe | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| PostgreSQL (env) | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| pundit | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| rack-attack | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| ruby-openai | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| sidekiq | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |

## 6. Retention Schedule

| Data Category | Retention Period | Deletion Method | Legal Basis for Retention |
|---------------|-----------------|-----------------|--------------------------|
| General | 26 months (max) | Automated purge + manual verification | Legitimate interest (Art. 6(1)(f)) |
| Indirectly Identifiable | 26 months (max) | Automated purge + manual verification | Legitimate interest (Art. 6(1)(f)) |
| Directly Identifiable | To be determined | Automated purge + manual verification | To be determined |
| Security Credential | To be determined | Automated purge + manual verification | To be determined |
| Financial | 7 years (tax/legal obligation) | Automated purge + manual verification | Contract performance (Art. 6(1)(b)) |

---

*This data mapping register is generated from automated code analysis and should be reviewed by your Data Protection Officer and legal team. It may not capture all data processing activities, particularly those conducted outside the scanned codebase. This does not constitute legal advice.*
