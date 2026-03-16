# Data Dictionary

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** calcom-monorepo

**Company:** [Your Company Name]

## Related Documents

- Data Flow Map (`DATA_FLOW_MAP.md`)
- Data Retention Policy (`DATA_RETENTION_POLICY.md`)
- Data Classification Report (`DATA_CLASSIFICATION.md`)

---

## 1. Purpose

This document catalogs every data field detected across the **calcom-monorepo** application. It serves as the authoritative reference for data mapping required by GDPR Article 30 (Records of Processing Activities), SOC 2 (CC6.1), and internal data governance policies.

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
| api_credential | env: SENDGRID_API_KEY=*** | Infrastructure | Critical | Rotate regularly | Service authentication |
| password_hash | google-auth-library | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| password_hash | next-auth | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| password_hash | passport | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| payment_info | stripe | Financial — PCI | Critical | Do not store post-authorization; tokenize | Payment processing |
| billing address | stripe | Location | High | Until account deletion | Billing, shipping, localization |
| billing_address | stripe | Location | High | 7 years (tax/legal) | Billing |
| cache_connection | env: REDIS_URL=*** | Infrastructure | High | Rotate regularly | Caching / session storage |
| customer_email | stripe | Contact | High | Until account deletion + 30 days | Transaction receipts |
| email | google-auth-library | Contact | High | Until account deletion + 30 days | Account identification |
| email | intercom | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email | next-auth | Contact | High | Until account deletion + 30 days | Account identification |
| email | passport | Contact | High | Until account deletion + 30 days | Account identification |
| email | stripe | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email addresses | @hubspot/api-client | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email addresses | @sendgrid/mail | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email addresses | nodemailer | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email content | @sendgrid/mail | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email content | nodemailer | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email data | googleapis | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email_address | @sendgrid/mail | Contact | High | Until unsubscribe or account deletion | Email delivery |
| email_address | nodemailer | Contact | High | Until unsubscribe or account deletion | Email delivery |
| email_config | env: EMAIL_SERVER_HOST=*** | Infrastructure | High | Until service change | Email delivery configuration |
| IP address | @sentry/nextjs | Location | High | Until account deletion | Billing, shipping, localization |
| IP address | Google Analytics | Location | High | Until account deletion | Billing, shipping, localization |
| name | intercom | Personal Identity | High | Until account deletion + 30 days | User identification |
| name | next-auth | Personal Identity | High | Until account deletion + 30 days | User identification |
| name | passport | Personal Identity | High | Until account deletion + 30 days | User identification |
| phone numbers | @hubspot/api-client | Contact | High | Until account deletion + 30 days | Account verification, communication |
| phone numbers | twilio | Contact | High | Until account deletion + 30 days | Account verification, communication |
| transaction_history | stripe | Financial | High | 7 years (tax/legal) | Order records, refunds |
| conversations | intercom | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| device tokens | web-push | Session | Medium | Until session expiry | Session management |
| email_content | @sendgrid/mail | Communication | Medium | 90 days (delivery logs) | Email delivery |
| email_content | nodemailer | Communication | Medium | 90 days (delivery logs) | Email delivery |
| error_tracking_config | env: NEXT_PUBLIC_SENTRY_DSN=*** | Infrastructure | Medium | Until service change | Error monitoring |
| error_tracking_config | env: SENTRY_DSN=*** | Infrastructure | Medium | Until service change | Error monitoring |
| ip_address | @sentry/nextjs | Technical | Medium | 30 days | Error context |
| ip_address | Google Analytics | Technical | Medium | 90 days | Geolocation, fraud prevention |
| ip_address | Google Tag Manager | Technical | Medium | 90 days | Geolocation, fraud prevention |
| ip_address | Plausible Analytics | Technical | Medium | 90 days | Geolocation, fraud prevention |
| ip_address | posthog | Technical | Medium | 90 days | Geolocation, fraud prevention |
| location data | Google Analytics | Location | Medium | 90 days | Localization, analytics |
| OAuth tokens | google-auth-library | Session | Medium | Until session expiry | Session management |
| OAuth tokens | next-auth | Session | Medium | Until session expiry | Session management |
| OAuth tokens | passport | Session | Medium | Until session expiry | Session management |
| oauth_token | google-auth-library | Authentication | Medium | Until session expiry or revocation | Third-party authentication |
| oauth_token | next-auth | Authentication | Medium | Until session expiry or revocation | Third-party authentication |
| oauth_token | passport | Authentication | Medium | Until session expiry or revocation | Third-party authentication |
| page_views | Google Analytics | Behavioral | Medium | 26 months | Product analytics |
| page_views | Google Tag Manager | Behavioral | Medium | 26 months | Product analytics |
| page_views | Plausible Analytics | Behavioral | Medium | 26 months | Product analytics |
| page_views | posthog | Behavioral | Medium | 26 months | Product analytics |
| session data | @upstash/redis | Session | Medium | Until session expiry | Session management |
| session data | ioredis | Session | Medium | Until session expiry | Session management |
| session data | next-auth | Session | Medium | Until session expiry | Session management |
| session data | passport | Session | Medium | Until session expiry | Session management |
| session data | Redis | Session | Medium | Until session expiry | Session management |
| session data | Redis (env) | Session | Medium | Until session expiry | Session management |
| session recordings | posthog | Session | Medium | Until session expiry | Session management |
| session_token | google-auth-library | Session | Medium | Until session expiry | Session management |
| session_token | next-auth | Session | Medium | Until session expiry | Session management |
| session_token | passport | Session | Medium | Until session expiry | Session management |
| user_behavior | Google Analytics | Behavioral | Medium | 26 months | UX optimization |
| user_behavior | Google Tag Manager | Behavioral | Medium | 26 months | UX optimization |
| user_behavior | Plausible Analytics | Behavioral | Medium | 26 months | UX optimization |
| user_behavior | posthog | Behavioral | Medium | 26 months | UX optimization |
| user_context | @sentry/nextjs | Technical | Medium | 30 days | Error context |
| user_data | @upstash/redis | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | ioredis | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | PostgreSQL | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | PostgreSQL (env) | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | prisma | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | Redis | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | Redis (env) | Application Data | Medium | Per data retention policy | Application functionality |
| API Data Collection | packages/trpc/server/routers/features/_router.ts | Application Data | Low | Per data retention policy | Application functionality |
| API Data Collection | packages/trpc/server/routers/viewer/eventTypes/_router.ts | Application Data | Low | Per data retention policy | Application functionality |
| API Data Collection | packages/trpc/server/routers/viewer/featureOptIn/_router.ts | Application Data | Low | Per data retention policy | Application functionality |
| API Data Collection | packages/trpc/server/routers/viewer/feedback/_router.ts | Application Data | Low | Per data retention policy | Application functionality |
| API Data Collection | packages/trpc/server/routers/viewer/insights/_router.ts | Application Data | Low | Per data retention policy | Application functionality |
| API Data Collection | packages/trpc/server/routers/viewer/pbac/_router.tsx | Application Data | Low | Per data retention policy | Application functionality |
| application data | PostgreSQL | Application Data | Low | Per data retention policy | Application functionality |
| application data | PostgreSQL (env) | Application Data | Low | Per data retention policy | Application functionality |
| cache data | Redis | Application Data | Low | Per data retention policy | Application functionality |
| cache data | Redis (env) | Application Data | Low | Per data retention policy | Application functionality |
| cached data | @upstash/redis | Application Data | Low | Per data retention policy | Application functionality |
| cached data | ioredis | Application Data | Low | Per data retention policy | Application functionality |
| calendar data | googleapis | Application Data | Low | Per data retention policy | Application functionality |
| call recordings | twilio | Application Data | Low | Per data retention policy | Application functionality |
| Communication Data | nodemailer | Application Data | Low | Per data retention policy | Application functionality |
| Communication Data | @sendgrid/mail | Application Data | Low | Per data retention policy | Application functionality |
| company data | @hubspot/api-client | Application Data | Low | Per data retention policy | Application functionality |
| company data | intercom | Application Data | Low | Per data retention policy | Application functionality |
| contact information | @hubspot/api-client | Application Data | Low | Per data retention policy | Application functionality |
| custom events | Google Tag Manager | Application Data | Low | Per data retention policy | Application functionality |
| deal information | @hubspot/api-client | Application Data | Low | Per data retention policy | Application functionality |
| device information | @sentry/nextjs | Application Data | Low | Per data retention policy | Application functionality |
| device information | Google Analytics | Application Data | Low | Per data retention policy | Application functionality |
| device information | Google Tag Manager | Application Data | Low | Per data retention policy | Application functionality |
| device information | Plausible Analytics | Application Data | Low | Per data retention policy | Application functionality |
| device information | posthog | Application Data | Low | Per data retention policy | Application functionality |
| device_info | Google Analytics | Technical | Low | 26 months | Compatibility analytics |
| device_info | Google Tag Manager | Technical | Low | 26 months | Compatibility analytics |
| device_info | Plausible Analytics | Technical | Low | 26 months | Compatibility analytics |
| device_info | posthog | Technical | Low | 26 months | Compatibility analytics |
| engagement history | @hubspot/api-client | Application Data | Low | Per data retention policy | Application functionality |
| error data | @sentry/nextjs | Application Data | Low | Per data retention policy | Application functionality |
| error_data | @sentry/nextjs | Technical | Low | 30 days | Error tracking |
| feature flag usage | posthog | Application Data | Low | Per data retention policy | Application functionality |
| Financial Data | stripe | Application Data | Low | Per data retention policy | Application functionality |
| Google profile data | google-auth-library | Application Data | Low | Per data retention policy | Application functionality |
| names | @hubspot/api-client | Application Data | Low | Per data retention policy | Application functionality |
| notification content | web-push | Application Data | Low | Per data retention policy | Application functionality |
| page views | Google Analytics | Application Data | Low | Per data retention policy | Application functionality |
| page views | Google Tag Manager | Application Data | Low | Per data retention policy | Application functionality |
| page views | Plausible Analytics | Application Data | Low | Per data retention policy | Application functionality |
| payment information | stripe | Application Data | Low | Per data retention policy | Application functionality |
| performance profiles | @sentry/nextjs | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | next-auth | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | google-auth-library | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | passport | Application Data | Low | Per data retention policy | Application functionality |
| profile information | googleapis | Application Data | Low | Per data retention policy | Application functionality |
| profile picture | next-auth | Application Data | Low | Per data retention policy | Application functionality |
| push subscription endpoints | web-push | Application Data | Low | Per data retention policy | Application functionality |
| referrer data | Plausible Analytics | Application Data | Low | Per data retention policy | Application functionality |
| SMS message content | twilio | Application Data | Low | Per data retention policy | Application functionality |
| stack traces | @sentry/nextjs | Application Data | Low | Per data retention policy | Application functionality |
| stack_traces | @sentry/nextjs | Technical | Low | 30 days | Debugging |
| Stored User Data | ioredis | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | @upstash/redis | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | prisma | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | PostgreSQL (env) | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | Redis (env) | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | PostgreSQL | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | Redis | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | Redis (Cache) | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | lru-cache | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | @prisma/extension-accelerate | Application Data | Low | Per data retention policy | Application functionality |
| Technical & Diagnostic Data | @sentry/nextjs | Application Data | Low | Per data retention policy | Application functionality |
| third-party tag data | Google Tag Manager | Application Data | Low | Per data retention policy | Application functionality |
| transaction history | stripe | Application Data | Low | Per data retention policy | Application functionality |
| Usage & Behavioral Data | posthog | Application Data | Low | Per data retention policy | Application functionality |
| Usage & Behavioral Data | Google Analytics | Application Data | Low | Per data retention policy | Application functionality |
| Usage & Behavioral Data | Google Tag Manager | Application Data | Low | Per data retention policy | Application functionality |
| Usage & Behavioral Data | Plausible Analytics | Application Data | Low | Per data retention policy | Application functionality |
| user behavior | Google Analytics | Application Data | Low | Per data retention policy | Application functionality |
| user behavior | Google Tag Manager | Application Data | Low | Per data retention policy | Application functionality |
| user behavior | intercom | Application Data | Low | Per data retention policy | Application functionality |
| user behavior | posthog | Application Data | Low | Per data retention policy | Application functionality |
| user context | @sentry/nextjs | Application Data | Low | Per data retention policy | Application functionality |
| user data as defined in schema | prisma | Application Data | Low | Per data retention policy | Application functionality |
| user data via Google APIs | googleapis | Application Data | Low | Per data retention policy | Application functionality |
| user profiles | intercom | Application Data | Low | Per data retention policy | Application functionality |
| user records | PostgreSQL | Application Data | Low | Per data retention policy | Application functionality |
| user records | PostgreSQL (env) | Application Data | Low | Per data retention policy | Application functionality |
| voice call metadata | twilio | Application Data | Low | Per data retention policy | Application functionality |

---

## 4. Sensitivity Summary

| Level | Count | Description |
|-------|-------|-------------|
| Critical | 5 | Credentials, government IDs, raw payment data — requires encryption at rest and strict access control |
| High | 26 | PII (names, emails, addresses) — requires encryption and consent |
| Medium | 44 | Behavioral data, session data, IP addresses — requires privacy notice |
| Low | 81 | Preferences, metadata, operational data — standard handling |

**Total fields cataloged:** 156

---

## 5. Cross-References

- **Database schema** — Fields detected from Prisma/ORM model definitions
- **API routes** — Data fields accepted via request handlers
- **Environment variables** — Service credentials and connection strings
- **Other services** — @hubspot/api-client, googleapis, intercom, twilio, web-push
- **Email services** — @sendgrid/mail, nodemailer
- **Monitoring services** — @sentry/nextjs
- **Database services** — @upstash/redis, ioredis, PostgreSQL, PostgreSQL (env), prisma, Redis, Redis (env)
- **Analytics services** — Google Analytics, Google Tag Manager, Plausible Analytics, posthog
- **Auth services** — google-auth-library, next-auth, passport
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