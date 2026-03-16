# Data Dictionary

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** formbricks

**Company:** [Your Company Name]

## Related Documents

- Data Flow Map (`DATA_FLOW_MAP.md`)
- Data Retention Policy (`DATA_RETENTION_POLICY.md`)
- Data Classification Report (`DATA_CLASSIFICATION.md`)

---

## 1. Purpose

This document catalogs every data field detected across the **formbricks** application. It serves as the authoritative reference for data mapping required by GDPR Article 30 (Records of Processing Activities), SOC 2 (CC6.1), and internal data governance policies.

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
| password_hash | next-auth | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| payment_info | stripe | Financial — PCI | Critical | Do not store post-authorization; tokenize | Payment processing |
| billing address | stripe | Location | High | Until account deletion | Billing, shipping, localization |
| billing_address | stripe | Location | High | 7 years (tax/legal) | Billing |
| cache_connection | env: REDIS_URL=*** | Infrastructure | High | Rotate regularly | Caching / session storage |
| customer_email | stripe | Contact | High | Until account deletion + 30 days | Transaction receipts |
| email | next-auth | Contact | High | Until account deletion + 30 days | Account identification |
| email | stripe | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email addresses | nodemailer | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email content | nodemailer | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email data | googleapis | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email_address | nodemailer | Contact | High | Until unsubscribe or account deletion | Email delivery |
| email_config | env: SMTP_HOST=*** | Infrastructure | High | Until service change | Email delivery configuration |
| IP address | @sentry/nextjs | Location | High | Until account deletion | Billing, shipping, localization |
| name | next-auth | Personal Identity | High | Until account deletion + 30 days | User identification |
| transaction_history | stripe | Financial | High | 7 years (tax/legal) | Order records, refunds |
| email_content | nodemailer | Communication | Medium | 90 days (delivery logs) | Email delivery |
| ip_address | @sentry/nextjs | Technical | Medium | 30 days | Error context |
| ip_address | posthog | Technical | Medium | 90 days | Geolocation, fraud prevention |
| OAuth tokens | next-auth | Session | Medium | Until session expiry | Session management |
| oauth_token | next-auth | Authentication | Medium | Until session expiry or revocation | Third-party authentication |
| page_views | posthog | Behavioral | Medium | 26 months | Product analytics |
| session data | ioredis | Session | Medium | Until session expiry | Session management |
| session data | next-auth | Session | Medium | Until session expiry | Session management |
| session data | redis | Session | Medium | Until session expiry | Session management |
| session recordings | posthog | Session | Medium | Until session expiry | Session management |
| session_token | next-auth | Session | Medium | Until session expiry | Session management |
| uploaded_files | @aws-sdk/client-s3 | User Content | Medium | Until user-initiated deletion | File storage |
| user_behavior | posthog | Behavioral | Medium | 26 months | UX optimization |
| user_context | @sentry/nextjs | Technical | Medium | 30 days | Error context |
| user_data | ioredis | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | prisma | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | redis | Application Data | Medium | Per data retention policy | Application functionality |
| cached data | ioredis | Application Data | Low | Per data retention policy | Application functionality |
| cached data | redis | Application Data | Low | Per data retention policy | Application functionality |
| calendar data | googleapis | Application Data | Low | Per data retention policy | Application functionality |
| Communication Data | nodemailer | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | schema.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | user.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | RequestBody.email (POST /organizations/{organizationId}/users) | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | RequestBody.email (PATCH /organizations/{organizationId}/users) | Application Data | Low | Per data retention policy | Application functionality |
| device information | @sentry/nextjs | Application Data | Low | Per data retention policy | Application functionality |
| device information | posthog | Application Data | Low | Per data retention policy | Application functionality |
| device_info | posthog | Technical | Low | 26 months | Compatibility analytics |
| error data | @sentry/nextjs | Application Data | Low | Per data retention policy | Application functionality |
| error_data | @sentry/nextjs | Technical | Low | 30 days | Error tracking |
| feature flag usage | posthog | Application Data | Low | Per data retention policy | Application functionality |
| file metadata | @aws-sdk/client-s3 | Application Data | Low | Per data retention policy | Application functionality |
| file_metadata | @aws-sdk/client-s3 | Metadata | Low | Until file deletion | File management |
| Financial Data | stripe | Application Data | Low | Per data retention policy | Application functionality |
| payment information | stripe | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | next-auth | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | schema.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | data.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | items.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | RequestBody.name (POST /api/v1/webhooks) | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | contactAttributeKey.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | survey.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | blocks.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | variables.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | webhook.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | team.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | user.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | contactAttributeKeyInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | contactAttributeKeyUpdate.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | RequestBody.name (PUT /management/contacts/bulk) | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | RequestBody.name (POST /management/contact-attribute-keys) | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | RequestBody.name (PUT /management/contact-attribute-keys/{id}) | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | RequestBody.name (POST /management/webhooks) | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | RequestBody.name (PUT /management/webhooks/{id}) | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | RequestBody.name (POST /organizations/{organizationId}/teams) | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | RequestBody.name (PUT /organizations/{organizationId}/teams/{id}) | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | RequestBody.name (POST /organizations/{organizationId}/users) | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | RequestBody.name (PATCH /organizations/{organizationId}/users) | Application Data | Low | Per data retention policy | Application functionality |
| profile information | googleapis | Application Data | Low | Per data retention policy | Application functionality |
| profile picture | next-auth | Application Data | Low | Per data retention policy | Application functionality |
| stack traces | @sentry/nextjs | Application Data | Low | Per data retention policy | Application functionality |
| stack_traces | @sentry/nextjs | Technical | Low | 30 days | Debugging |
| Stored User Data | prisma | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | redis | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | ioredis | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | Redis (Cache) | Application Data | Low | Per data retention policy | Application functionality |
| Technical & Diagnostic Data | @sentry/nextjs | Application Data | Low | Per data retention policy | Application functionality |
| Technical Data | schema.userAgent | Application Data | Low | Per data retention policy | Application functionality |
| Technical Data | response.userAgent | Application Data | Low | Per data retention policy | Application functionality |
| Technical Data | RequestBody.userAgent (POST /responses) | Application Data | Low | Per data retention policy | Application functionality |
| Technical Data | RequestBody.userAgent (PUT /responses/{id}) | Application Data | Low | Per data retention policy | Application functionality |
| Technical Data | RequestBody.userAgent (POST /management/responses) | Application Data | Low | Per data retention policy | Application functionality |
| Technical Data | RequestBody.userAgent (PUT /management/responses/{id}) | Application Data | Low | Per data retention policy | Application functionality |
| transaction history | stripe | Application Data | Low | Per data retention policy | Application functionality |
| uploaded files | @aws-sdk/client-s3 | Application Data | Low | Per data retention policy | Application functionality |
| Usage & Behavioral Data | posthog | Application Data | Low | Per data retention policy | Application functionality |
| user behavior | posthog | Application Data | Low | Per data retention policy | Application functionality |
| user context | @sentry/nextjs | Application Data | Low | Per data retention policy | Application functionality |
| user data as defined in schema | prisma | Application Data | Low | Per data retention policy | Application functionality |
| user data via Google APIs | googleapis | Application Data | Low | Per data retention policy | Application functionality |
| User-Uploaded Content | @aws-sdk/client-s3 | Application Data | Low | Per data retention policy | Application functionality |
| User-Uploaded Content | AWS | Application Data | Low | Per data retention policy | Application functionality |

---

## 4. Sensitivity Summary

| Level | Count | Description |
|-------|-------|-------------|
| Critical | 3 | Credentials, government IDs, raw payment data — requires encryption at rest and strict access control |
| High | 14 | PII (names, emails, addresses) — requires encryption and consent |
| Medium | 17 | Behavioral data, session data, IP addresses — requires privacy notice |
| Low | 65 | Preferences, metadata, operational data — standard handling |

**Total fields cataloged:** 99

---

## 5. Cross-References

- **Database schema** — Fields detected from Prisma/ORM model definitions
- **API routes** — Data fields accepted via request handlers
- **Environment variables** — Service credentials and connection strings
- **Storage services** — @aws-sdk/client-s3
- **Monitoring services** — @sentry/nextjs
- **Other services** — googleapis
- **Database services** — ioredis, prisma, redis
- **Auth services** — next-auth
- **Email services** — nodemailer
- **Analytics services** — posthog
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