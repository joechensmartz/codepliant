# Data Dictionary

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** @chatwoot/chatwoot

**Company:** [Your Company Name]

## Related Documents

- Data Flow Map (`DATA_FLOW_MAP.md`)
- Data Retention Policy (`DATA_RETENTION_POLICY.md`)
- Data Classification Report (`DATA_CLASSIFICATION.md`)

---

## 1. Purpose

This document catalogs every data field detected across the **@chatwoot/chatwoot** application. It serves as the authoritative reference for data mapping required by GDPR Article 30 (Records of Processing Activities), SOC 2 (CC6.1), and internal data governance policies.

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
| api_credential | env: STRIPE_SECRET_KEY=*** | Infrastructure | Critical | Rotate regularly | Service authentication |
| password hash | devise | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| password_hash | devise | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| password_hash | omniauth | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| password_hash | pundit | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| password_hash | rails-sessions | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| payment_info | stripe | Financial — PCI | Critical | Do not store post-authorization; tokenize | Payment processing |
| storage service credentials | Active Storage | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| billing address | stripe | Location | High | Until account deletion | Billing, shipping, localization |
| billing_address | stripe | Location | High | 7 years (tax/legal) | Billing |
| cache_connection | env: REDIS_URL=*** | Infrastructure | High | Rotate regularly | Caching / session storage |
| customer_email | stripe | Contact | High | Until account deletion + 30 days | Transaction receipts |
| email | devise | Contact | High | Until account deletion + 30 days | Account identification |
| email | omniauth | Contact | High | Until account deletion + 30 days | Account identification |
| email | pundit | Contact | High | Until account deletion + 30 days | Account identification |
| email | rails-sessions | Contact | High | Until account deletion + 30 days | Account identification |
| email | stripe | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email addresses | ActionMailer | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email addresses | nodemailer | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email addresses | rails-actionmailer | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email content | ActionMailer | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email content | MailHog | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email content | nodemailer | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email content | rails-actionmailer | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email_address | ActionMailer | Contact | High | Until unsubscribe or account deletion | Email delivery |
| email_address | MailHog | Contact | High | Until unsubscribe or account deletion | Email delivery |
| email_address | nodemailer | Contact | High | Until unsubscribe or account deletion | Email delivery |
| email_address | rails-actionmailer | Contact | High | Until unsubscribe or account deletion | Email delivery |
| email_config | env: SMTP_USERNAME=*** | Infrastructure | High | Until service change | Email delivery configuration |
| name | omniauth | Personal Identity | High | Until account deletion + 30 days | User identification |
| phone numbers | @twilio/voice-sdk | Contact | High | Until account deletion + 30 days | Account verification, communication |
| phone numbers | twilio-ruby | Contact | High | Until account deletion + 30 days | Account verification, communication |
| transaction_history | stripe | Financial | High | 7 years (tax/legal) | Order records, refunds |
| authentication tokens | devise | Session | Medium | Until session expiry | Session management |
| conversation history | ruby-openai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| conversation_history | ruby-openai | AI Interaction | Medium | 30 days (logs); per vendor policy | Context continuity |
| conversion_events | Meta Pixel | Behavioral | Medium | 90 days | Ad campaign measurement |
| CSRF tokens | ActionController::Cookies | Session | Medium | Until session expiry | Session management |
| CSRF tokens | rails-sessions | Session | Medium | Until session expiry | Session management |
| email_content | ActionMailer | Communication | Medium | 90 days (delivery logs) | Email delivery |
| email_content | MailHog | Communication | Medium | 90 days (delivery logs) | Email delivery |
| email_content | nodemailer | Communication | Medium | 90 days (delivery logs) | Email delivery |
| email_content | rails-actionmailer | Communication | Medium | 90 days (delivery logs) | Email delivery |
| IP addresses | rack-attack | Technical | Medium | 90 days | Security, rate limiting |
| ip_address | @amplitude/analytics-browser | Technical | Medium | 90 days | Geolocation, fraud prevention |
| ip_address | sentry-ruby | Technical | Medium | 30 days | Error context |
| Location Data | inbox.timezone | Location | Medium | 90 days | Localization, analytics |
| Location Data | custom_attributes.timezone | Location | Medium | 90 days | Localization, analytics |
| Location Data | public_inbox.timezone | Location | Medium | 90 days | Localization, analytics |
| Location Data | account_update_payload.timezone | Location | Medium | 90 days | Localization, analytics |
| Location Data | inbox_create_payload.timezone | Location | Medium | 90 days | Localization, analytics |
| Location Data | inbox_update_payload.timezone | Location | Medium | 90 days | Localization, analytics |
| Location Data | additional_attributes.city | Location | Medium | 90 days | Localization, analytics |
| Location Data | additional_attributes.country | Location | Medium | 90 days | Localization, analytics |
| OAuth tokens | omniauth | Session | Medium | Until session expiry | Session management |
| oauth_token | devise | Authentication | Medium | Until session expiry or revocation | Third-party authentication |
| oauth_token | omniauth | Authentication | Medium | Until session expiry or revocation | Third-party authentication |
| oauth_token | pundit | Authentication | Medium | Until session expiry or revocation | Third-party authentication |
| oauth_token | rails-sessions | Authentication | Medium | Until session expiry or revocation | Third-party authentication |
| page_views | @amplitude/analytics-browser | Behavioral | Medium | 26 months | Product analytics |
| session cookies | ActionController::Cookies | Session | Medium | Until session expiry | Session management |
| session cookies | rails-sessions | Session | Medium | Until session expiry | Session management |
| session data | @amplitude/analytics-browser | Session | Medium | Until session expiry | Session management |
| session data | ActionController::Cookies | Session | Medium | Until session expiry | Session management |
| session data | devise | Session | Medium | Until session expiry | Session management |
| session data | ioredis | Session | Medium | Until session expiry | Session management |
| session data | redis | Session | Medium | Until session expiry | Session management |
| session data | Redis | Session | Medium | Until session expiry | Session management |
| session data | Redis (env) | Session | Medium | Until session expiry | Session management |
| session_token | devise | Session | Medium | Until session expiry | Session management |
| session_token | omniauth | Session | Medium | Until session expiry | Session management |
| session_token | pundit | Session | Medium | Until session expiry | Session management |
| session_token | rails-sessions | Session | Medium | Until session expiry | Session management |
| uploaded_files | @aws-sdk/client-s3 | User Content | Medium | Until user-initiated deletion | File storage |
| uploaded_files | Active Storage | User Content | Medium | Until user-initiated deletion | File storage |
| uploaded_files | ActiveStorage | User Content | Medium | Until user-initiated deletion | File storage |
| uploaded_files | aws-sdk-s3 | User Content | Medium | Until user-initiated deletion | File storage |
| uploaded_files | google-cloud-storage | User Content | Medium | Until user-initiated deletion | File storage |
| user prompts | ruby-openai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| user_behavior | @amplitude/analytics-browser | Behavioral | Medium | 26 months | UX optimization |
| user_context | sentry-ruby | Technical | Medium | 30 days | Error context |
| user_data | ActiveRecord | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | ioredis | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | pg | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | PostgreSQL (env) | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | rails-activerecord | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | redis | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | Redis | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | Redis (env) | Application Data | Medium | Per data retention policy | Application functionality |
| user_prompts | ruby-openai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| access control data | pundit | Application Data | Low | Per data retention policy | Application functionality |
| Advertising & Conversion Data | Meta Pixel | Application Data | Low | Per data retention policy | Application functionality |
| AI Interaction Data | ruby-openai | Application Data | Low | Per data retention policy | Application functionality |
| application data | PostgreSQL (env) | Application Data | Low | Per data retention policy | Application functionality |
| associations | ActiveRecord | Application Data | Low | Per data retention policy | Application functionality |
| Authentication Data | profile.password | Application Data | Low | Per data retention policy | Application functionality |
| Authentication Data | user_create_update_payload.password | Application Data | Low | Per data retention policy | Application functionality |
| Authentication Data | RequestBody.password (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}) | Application Data | Low | Per data retention policy | Application functionality |
| Authentication Data | RequestBody.password (PUT /api/v1/profile) | Application Data | Low | Per data retention policy | Application functionality |
| authorization policies | pundit | Application Data | Low | Per data retention policy | Application functionality |
| cache data | Redis | Application Data | Low | Per data retention policy | Application functionality |
| cache data | Redis (env) | Application Data | Low | Per data retention policy | Application functionality |
| cached data | ioredis | Application Data | Low | Per data retention policy | Application functionality |
| cached data | redis | Application Data | Low | Per data retention policy | Application functionality |
| call recordings | @twilio/voice-sdk | Application Data | Low | Per data retention policy | Application functionality |
| channel subscriptions | ActionCable | Application Data | Low | Per data retention policy | Application functionality |
| Communication Data | rails-actionmailer | Application Data | Low | Per data retention policy | Application functionality |
| Communication Data | nodemailer | Application Data | Low | Per data retention policy | Application functionality |
| Communication Data | ActionMailer | Application Data | Low | Per data retention policy | Application functionality |
| Communication Data | MailHog | Application Data | Low | Per data retention policy | Application functionality |
| connection metadata | ActionCable | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | items.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | items.phone_number | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | profile.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | profile.phone_number | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | user.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | agent.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | inbox.phone_number | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | public_contact.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | user_create_update_payload.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | agent_create_payload.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | contact_create_payload.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | contact_create_payload.phone_number | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | contact_update_payload.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | contact_update_payload.phone_number | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | public_contact_create_update_payload.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | public_contact_create_update_payload.phone_number | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | sender.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | sender.phone_number | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | agent_conversation_metrics.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | contact_detail.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | contact_detail.phone_number | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | contact_list_item.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | contact_list_item.phone_number | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | RequestBody.email (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}) | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | RequestBody.phone_number (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}) | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | RequestBody.email (PUT /api/v1/profile) | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | RequestBody.phone_number (PUT /api/v1/profile) | Application Data | Low | Per data retention policy | Application functionality |
| conversion events | Meta Pixel | Application Data | Low | Per data retention policy | Application functionality |
| device information | @amplitude/analytics-browser | Application Data | Low | Per data retention policy | Application functionality |
| device information | @twilio/voice-sdk | Application Data | Low | Per data retention policy | Application functionality |
| device information | Meta Pixel | Application Data | Low | Per data retention policy | Application functionality |
| device information | sentry-ruby | Application Data | Low | Per data retention policy | Application functionality |
| device_info | @amplitude/analytics-browser | Technical | Low | 26 months | Compatibility analytics |
| device_info | Meta Pixel | Technical | Low | 90 days | Ad targeting |
| error data | sentry-ruby | Application Data | Low | Per data retention policy | Application functionality |
| error_data | sentry-ruby | Technical | Low | 30 days | Error tracking |
| file metadata | @aws-sdk/client-s3 | Application Data | Low | Per data retention policy | Application functionality |
| file metadata | Active Storage | Application Data | Low | Per data retention policy | Application functionality |
| file metadata | ActiveStorage | Application Data | Low | Per data retention policy | Application functionality |
| file metadata | aws-sdk-s3 | Application Data | Low | Per data retention policy | Application functionality |
| file metadata | google-cloud-storage | Application Data | Low | Per data retention policy | Application functionality |
| file_metadata | @aws-sdk/client-s3 | Metadata | Low | Until file deletion | File management |
| file_metadata | Active Storage | Metadata | Low | Until file deletion | File management |
| file_metadata | ActiveStorage | Metadata | Low | Until file deletion | File management |
| file_metadata | aws-sdk-s3 | Metadata | Low | Until file deletion | File management |
| file_metadata | google-cloud-storage | Metadata | Low | Until file deletion | File management |
| Financial Data | stripe | Application Data | Low | Per data retention policy | Application functionality |
| generated content | ruby-openai | Application Data | Low | Per data retention policy | Application functionality |
| generated_content | ruby-openai | AI Output | Low | Per user deletion request | AI feature delivery |
| job data | sidekiq | Application Data | Low | Per data retention policy | Application functionality |
| page views | Meta Pixel | Application Data | Low | Per data retention policy | Application functionality |
| payment information | stripe | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | devise | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | pundit | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | omniauth | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | rails-sessions | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | items.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | profile.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | profile.display_name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | profile.avatar | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | automation_rule_item.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | portal_item.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | category.locale | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | category.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | user.display_name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | user.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | agent.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | inbox.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | inbox_contact.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | agent_bot.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | custom_filter.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | webhook.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | account.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | account_detail.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | account_detail.locale | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | platform_account.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | team.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | integrations_app.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | audit_log.username | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | public_contact.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | public_inbox.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | account_create_update_payload.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | account_create_update_payload.locale | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | account_update_payload.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | account_update_payload.locale | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | platform_agent_bot_create_update_payload.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | platform_agent_bot_create_update_payload.avatar | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | agent_bot_create_update_payload.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | agent_bot_create_update_payload.avatar | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | user_create_update_payload.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | user_create_update_payload.display_name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | agent_create_payload.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | contact_create_payload.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | contact_create_payload.avatar | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | contact_update_payload.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | contact_update_payload.avatar | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | template_params.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | inbox_create_payload.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | inbox_create_payload.avatar | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | inbox_update_payload.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | inbox_update_payload.avatar | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | team_create_update_payload.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | custom_filter_create_update_payload.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | webhook_create_update_payload.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | automation_rule_create_update_payload.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | portal_create_update_payload.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | category_create_update_payload.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | category_create_update_payload.locale | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | article_create_update_payload.locale | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | public_contact_create_update_payload.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | public_contact_create_update_payload.avatar | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | submitted_values.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | sender.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | agent_conversation_metrics.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | contact_detail.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | contact_list_item.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | reporting_event.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | RequestBody.name (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}) | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | RequestBody.display_name (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}) | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | RequestBody.name (PUT /api/v1/profile) | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | RequestBody.display_name (PUT /api/v1/profile) | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | RequestBody.avatar (PUT /api/v1/profile) | Application Data | Low | Per data retention policy | Application functionality |
| potential PII in uploaded content | Active Storage | Application Data | Low | Per data retention policy | Application functionality |
| profile data | omniauth | Application Data | Low | Per data retention policy | Application functionality |
| real-time user data | ActionCable | Application Data | Low | Per data retention policy | Application functionality |
| request metadata | rack-attack | Application Data | Low | Per data retention policy | Application functionality |
| SMS message content | twilio-ruby | Application Data | Low | Per data retention policy | Application functionality |
| stack traces | sentry-ruby | Application Data | Low | Per data retention policy | Application functionality |
| stack_traces | sentry-ruby | Technical | Low | 30 days | Debugging |
| storage references | ActiveStorage | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | pg | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | redis | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | rails-activerecord | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | ioredis | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | ActiveRecord | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | PostgreSQL (env) | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | Redis (env) | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | Redis | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | Redis (Cache) | Application Data | Low | Per data retention policy | Application functionality |
| Technical & Diagnostic Data | sentry-ruby | Application Data | Low | Per data retention policy | Application functionality |
| timestamps | ActiveRecord | Metadata | Low | Same as parent record | Auditing |
| transaction history | stripe | Application Data | Low | Per data retention policy | Application functionality |
| uploaded files | @aws-sdk/client-s3 | Application Data | Low | Per data retention policy | Application functionality |
| uploaded files | Active Storage | Application Data | Low | Per data retention policy | Application functionality |
| uploaded files | ActiveStorage | Application Data | Low | Per data retention policy | Application functionality |
| uploaded files | aws-sdk-s3 | Application Data | Low | Per data retention policy | Application functionality |
| uploaded files | google-cloud-storage | Application Data | Low | Per data retention policy | Application functionality |
| Usage & Behavioral Data | @amplitude/analytics-browser | Application Data | Low | Per data retention policy | Application functionality |
| user behavior | @amplitude/analytics-browser | Application Data | Low | Per data retention policy | Application functionality |
| user behavior | Meta Pixel | Application Data | Low | Per data retention policy | Application functionality |
| user context | sentry-ruby | Application Data | Low | Per data retention policy | Application functionality |
| user data as defined in schema | ActiveRecord | Application Data | Low | Per data retention policy | Application functionality |
| user data as defined in schema | pg | Application Data | Low | Per data retention policy | Application functionality |
| user data as defined in schema | rails-activerecord | Application Data | Low | Per data retention policy | Application functionality |
| user data processed in background jobs | sidekiq | Application Data | Low | Per data retention policy | Application functionality |
| user records | PostgreSQL (env) | Application Data | Low | Per data retention policy | Application functionality |
| user roles | pundit | Authorization | Low | Until account deletion | Access control |
| User-Uploaded Content | aws-sdk-s3 | Application Data | Low | Per data retention policy | Application functionality |
| User-Uploaded Content | google-cloud-storage | Application Data | Low | Per data retention policy | Application functionality |
| User-Uploaded Content | @aws-sdk/client-s3 | Application Data | Low | Per data retention policy | Application functionality |
| User-Uploaded Content | ActiveStorage | Application Data | Low | Per data retention policy | Application functionality |
| User-Uploaded Content | Active Storage | Application Data | Low | Per data retention policy | Application functionality |
| voice call metadata | @twilio/voice-sdk | Application Data | Low | Per data retention policy | Application functionality |
| voice call metadata | twilio-ruby | Application Data | Low | Per data retention policy | Application functionality |
| WebSocket messages | ActionCable | Application Data | Low | Per data retention policy | Application functionality |

---

## 4. Sensitivity Summary

| Level | Count | Description |
|-------|-------|-------------|
| Critical | 8 | Credentials, government IDs, raw payment data — requires encryption at rest and strict access control |
| High | 25 | PII (names, emails, addresses) — requires encryption and consent |
| Medium | 57 | Behavioral data, session data, IP addresses — requires privacy notice |
| Low | 186 | Preferences, metadata, operational data — standard handling |

**Total fields cataloged:** 276

---

## 5. Cross-References

- **Database schema** — Fields detected from Prisma/ORM model definitions
- **API routes** — Data fields accepted via request handlers
- **Environment variables** — Service credentials and connection strings
- **Analytics services** — @amplitude/analytics-browser
- **Storage services** — @aws-sdk/client-s3, Active Storage, ActiveStorage, aws-sdk-s3, google-cloud-storage
- **Other services** — @twilio/voice-sdk, ActionCable, ActionController::Cookies, rack-attack, sidekiq, twilio-ruby
- **Email services** — ActionMailer, MailHog, nodemailer, rails-actionmailer
- **Database services** — ActiveRecord, ioredis, pg, PostgreSQL (env), rails-activerecord, redis, Redis, Redis (env)
- **Auth services** — devise, omniauth, pundit, rails-sessions
- **Advertising services** — Meta Pixel
- **Ai services** — ruby-openai
- **Monitoring services** — sentry-ruby
- **Payment services** — stripe

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