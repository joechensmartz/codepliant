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
| 1 | contact information | General | Application-collected | @hubspot/api-client (third-party) | @hubspot/api-client, @sendgrid/mail, intercom, nodemailer, twilio | To be determined | To be determined |
| 2 | email addresses | Directly Identifiable | User-provided (registration/form) | @hubspot/api-client (third-party) | @hubspot/api-client, @sendgrid/mail, intercom, nodemailer, twilio | To be determined | To be determined |
| 3 | names | Directly Identifiable | User-provided (registration/form) | @hubspot/api-client (third-party) | @hubspot/api-client, @sendgrid/mail, intercom, nodemailer, twilio | To be determined | To be determined |
| 4 | phone numbers | Directly Identifiable | User-provided (registration/form) | @hubspot/api-client (third-party) | @hubspot/api-client, @sendgrid/mail, intercom, nodemailer, twilio | To be determined | To be determined |
| 5 | company data | General | Application-collected | @hubspot/api-client (third-party) | @hubspot/api-client, @sendgrid/mail, intercom, nodemailer, twilio | To be determined | To be determined |
| 6 | deal information | General | Application-collected | @hubspot/api-client (third-party) | @hubspot/api-client, @sendgrid/mail, intercom, nodemailer, twilio | To be determined | To be determined |
| 7 | engagement history | General | Application-collected | @hubspot/api-client (third-party) | @hubspot/api-client, @sendgrid/mail, intercom, nodemailer, twilio | To be determined | To be determined |
| 8 | email content | Directly Identifiable | User-provided (registration/form) | @sendgrid/mail (third-party) | @sendgrid/mail, nodemailer | Contract performance / Consent | Duration of account + 30 days |
| 9 | error data | General | Application-collected | @sentry/nextjs (third-party) | @sentry/nextjs, Google Analytics, Google Tag Manager, Plausible Analytics, posthog | Legitimate interest (Art. 6(1)(f)) | 90 days |
| 10 | stack traces | General | Application-collected | @sentry/nextjs (third-party) | @sentry/nextjs, Google Analytics, Google Tag Manager, Plausible Analytics, posthog | Legitimate interest (Art. 6(1)(f)) | 90 days |
| 11 | user context | General | Application-collected | @sentry/nextjs (third-party) | @sentry/nextjs, Google Analytics, Google Tag Manager, Plausible Analytics, posthog | Legitimate interest (Art. 6(1)(f)) | 90 days |
| 12 | device information | Indirectly Identifiable | Automatic collection (HTTP request) | @sentry/nextjs (third-party) | @sentry/nextjs, Google Analytics, Google Tag Manager, Plausible Analytics, posthog | Legitimate interest (Art. 6(1)(f)) | 90 days |
| 13 | IP address | Directly Identifiable | Automatic collection (HTTP request) | @sentry/nextjs (third-party) | @sentry/nextjs, Google Analytics, Google Tag Manager, Plausible Analytics, posthog | Legitimate interest (Art. 6(1)(f)) | 90 days |
| 14 | performance profiles | General | Application-collected | @sentry/nextjs (third-party) | @sentry/nextjs, Google Analytics, Google Tag Manager, Plausible Analytics, posthog | Legitimate interest (Art. 6(1)(f)) | 90 days |
| 15 | cached data | General | Application-collected | @upstash/redis (third-party) | @upstash/redis, ioredis, next-auth, passport, Redis, Redis (env) | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 16 | session data | General | Automatic collection (cookies/SDK) | @upstash/redis (third-party) | @upstash/redis, ioredis, next-auth, passport, Redis, Redis (env) | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 17 | page views | General | Automatic collection (analytics SDK) | Google Analytics (third-party) | Google Analytics, Google Tag Manager, intercom, Plausible Analytics, posthog | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 18 | user behavior | General | Automatic collection (analytics SDK) | Google Analytics (third-party) | Google Analytics, Google Tag Manager, intercom, Plausible Analytics, posthog | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 19 | location data | General | Automatic collection (analytics SDK) | Google Analytics (third-party) | Google Analytics, Google Tag Manager, intercom, Plausible Analytics, posthog | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 20 | custom events | General | Automatic collection (analytics SDK) | Google Tag Manager (third-party) | Google Tag Manager | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 21 | third-party tag data | General | Automatic collection (analytics SDK) | Google Tag Manager (third-party) | Google Tag Manager | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 22 | OAuth tokens | Security Credential | Application-collected | google-auth-library (third-party) | google-auth-library, intercom, next-auth, passport, stripe | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 23 | Google profile data | General | Application-collected | google-auth-library (third-party) | google-auth-library, intercom, next-auth, passport, stripe | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 24 | email | Directly Identifiable | User-provided (registration/form) | google-auth-library (third-party) | google-auth-library, intercom, next-auth, passport, stripe | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 25 | user data via Google APIs | General | Application-collected | googleapis (third-party) | googleapis | To be determined | To be determined |
| 26 | calendar data | General | Application-collected | googleapis (third-party) | googleapis | To be determined | To be determined |
| 27 | email data | Directly Identifiable | User-provided (registration/form) | googleapis (third-party) | googleapis | To be determined | To be determined |
| 28 | profile information | General | Application-collected | googleapis (third-party) | googleapis | To be determined | To be determined |
| 29 | user profiles | General | Application-collected | intercom (third-party) | intercom, next-auth, passport | To be determined | To be determined |
| 30 | name | Directly Identifiable | User-provided (registration/form) | intercom (third-party) | intercom, next-auth, passport | To be determined | To be determined |
| 31 | conversations | General | Application-collected | intercom (third-party) | intercom, next-auth, passport | To be determined | To be determined |
| 32 | profile picture | General | Application-collected | next-auth (third-party) | next-auth | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 33 | referrer data | General | Automatic collection (analytics SDK) | Plausible Analytics (third-party) | Plausible Analytics | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 34 | application data | General | Application-collected | PostgreSQL (third-party) | PostgreSQL, PostgreSQL (env) | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 35 | user records | General | Application-collected | PostgreSQL (third-party) | PostgreSQL, PostgreSQL (env) | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 36 | session recordings | General | Automatic collection (cookies/SDK) | posthog (third-party) | posthog | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 37 | feature flag usage | General | Automatic collection (analytics SDK) | posthog (third-party) | posthog | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 38 | user data as defined in schema | General | Application-collected | prisma (third-party) | prisma | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 39 | cache data | General | Application-collected | Redis (third-party) | Redis, Redis (env) | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 40 | payment information | Financial | User-provided (checkout) | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 41 | billing address | Directly Identifiable | User-provided (registration/form) | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 42 | transaction history | General | Application-collected | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 43 | SMS message content | General | Application-collected | twilio (third-party) | twilio | To be determined | To be determined |
| 44 | voice call metadata | General | Application-collected | twilio (third-party) | twilio | To be determined | To be determined |
| 45 | call recordings | General | Application-collected | twilio (third-party) | twilio | To be determined | To be determined |
| 46 | push subscription endpoints | Indirectly Identifiable | Automatic collection (HTTP request) | web-push (third-party) | web-push | To be determined | To be determined |
| 47 | device tokens | Security Credential | Automatic collection (HTTP request) | web-push (third-party) | web-push | To be determined | To be determined |
| 48 | notification content | General | Application-collected | web-push (third-party) | web-push | To be determined | To be determined |
| 49 | Personal Identity Data | General | next-auth | Application database | Internal only | To be determined | To be determined |
| 50 | Financial Data | Financial | stripe | Application database | Internal only | To be determined | To be determined |
| 51 | Usage & Behavioral Data | General | posthog | Application database | Internal only | To be determined | To be determined |
| 52 | Communication Data | General | nodemailer | Application database | Internal only | To be determined | To be determined |
| 53 | Technical & Diagnostic Data | General | @sentry/nextjs | Application database | Internal only | To be determined | To be determined |
| 54 | Stored User Data | General | ioredis | Application database | Internal only | To be determined | To be determined |
| 55 | API Data Collection | General | packages/trpc/server/routers/features/_router.ts | Application database | Internal only | To be determined | To be determined |

## 3. Data Flow Summary

### General

| Data Element | Source | Destination |
|-------------|--------|-------------|
| contact information | Application-collected | @hubspot/api-client, @sendgrid/mail, intercom, nodemailer, twilio |
| company data | Application-collected | @hubspot/api-client, @sendgrid/mail, intercom, nodemailer, twilio |
| deal information | Application-collected | @hubspot/api-client, @sendgrid/mail, intercom, nodemailer, twilio |
| engagement history | Application-collected | @hubspot/api-client, @sendgrid/mail, intercom, nodemailer, twilio |
| error data | Application-collected | @sentry/nextjs, Google Analytics, Google Tag Manager, Plausible Analytics, posthog |
| stack traces | Application-collected | @sentry/nextjs, Google Analytics, Google Tag Manager, Plausible Analytics, posthog |
| user context | Application-collected | @sentry/nextjs, Google Analytics, Google Tag Manager, Plausible Analytics, posthog |
| performance profiles | Application-collected | @sentry/nextjs, Google Analytics, Google Tag Manager, Plausible Analytics, posthog |
| cached data | Application-collected | @upstash/redis, ioredis, next-auth, passport, Redis, Redis (env) |
| session data | Automatic collection (cookies/SDK) | @upstash/redis, ioredis, next-auth, passport, Redis, Redis (env) |
| page views | Automatic collection (analytics SDK) | Google Analytics, Google Tag Manager, intercom, Plausible Analytics, posthog |
| user behavior | Automatic collection (analytics SDK) | Google Analytics, Google Tag Manager, intercom, Plausible Analytics, posthog |
| location data | Automatic collection (analytics SDK) | Google Analytics, Google Tag Manager, intercom, Plausible Analytics, posthog |
| custom events | Automatic collection (analytics SDK) | Google Tag Manager |
| third-party tag data | Automatic collection (analytics SDK) | Google Tag Manager |
| Google profile data | Application-collected | google-auth-library, intercom, next-auth, passport, stripe |
| user data via Google APIs | Application-collected | googleapis |
| calendar data | Application-collected | googleapis |
| profile information | Application-collected | googleapis |
| user profiles | Application-collected | intercom, next-auth, passport |
| conversations | Application-collected | intercom, next-auth, passport |
| profile picture | Application-collected | next-auth |
| referrer data | Automatic collection (analytics SDK) | Plausible Analytics |
| application data | Application-collected | PostgreSQL, PostgreSQL (env) |
| user records | Application-collected | PostgreSQL, PostgreSQL (env) |
| session recordings | Automatic collection (cookies/SDK) | posthog |
| feature flag usage | Automatic collection (analytics SDK) | posthog |
| user data as defined in schema | Application-collected | prisma |
| cache data | Application-collected | Redis, Redis (env) |
| transaction history | Application-collected | stripe |
| SMS message content | Application-collected | twilio |
| voice call metadata | Application-collected | twilio |
| call recordings | Application-collected | twilio |
| notification content | Application-collected | web-push |
| Personal Identity Data | next-auth | Application database |
| Usage & Behavioral Data | posthog | Application database |
| Communication Data | nodemailer | Application database |
| Technical & Diagnostic Data | @sentry/nextjs | Application database |
| Stored User Data | ioredis | Application database |
| API Data Collection | packages/trpc/server/routers/features/_router.ts | Application database |

### Directly Identifiable

| Data Element | Source | Destination |
|-------------|--------|-------------|
| email addresses | User-provided (registration/form) | @hubspot/api-client, @sendgrid/mail, intercom, nodemailer, twilio |
| names | User-provided (registration/form) | @hubspot/api-client, @sendgrid/mail, intercom, nodemailer, twilio |
| phone numbers | User-provided (registration/form) | @hubspot/api-client, @sendgrid/mail, intercom, nodemailer, twilio |
| email content | User-provided (registration/form) | @sendgrid/mail, nodemailer |
| IP address | Automatic collection (HTTP request) | @sentry/nextjs, Google Analytics, Google Tag Manager, Plausible Analytics, posthog |
| email | User-provided (registration/form) | google-auth-library, intercom, next-auth, passport, stripe |
| email data | User-provided (registration/form) | googleapis |
| name | User-provided (registration/form) | intercom, next-auth, passport |
| billing address | User-provided (registration/form) | stripe |

### Indirectly Identifiable

| Data Element | Source | Destination |
|-------------|--------|-------------|
| device information | Automatic collection (HTTP request) | @sentry/nextjs, Google Analytics, Google Tag Manager, Plausible Analytics, posthog |
| push subscription endpoints | Automatic collection (HTTP request) | web-push |

### Security Credential

| Data Element | Source | Destination |
|-------------|--------|-------------|
| OAuth tokens | Application-collected | google-auth-library, intercom, next-auth, passport, stripe |
| device tokens | Automatic collection (HTTP request) | web-push |

### Financial

| Data Element | Source | Destination |
|-------------|--------|-------------|
| payment information | User-provided (checkout) | stripe |
| Financial Data | stripe | Application database |

## 4. Third-Party Processors

| Processor | Data Shared | Purpose | DPA Status |
|-----------|------------|---------|------------|
| @hubspot/api-client | contact information, email addresses, names, phone numbers, company data, deal information, engagement history | other | ⬜ To be verified |
| @sendgrid/mail | contact information, email addresses, names, phone numbers, company data, deal information, engagement history, email content | email | ⬜ To be verified |
| intercom | contact information, email addresses, names, phone numbers, company data, deal information, engagement history, page views, user behavior, location data, OAuth tokens, Google profile data, email, user profiles, name, conversations | other | ⬜ To be verified |
| nodemailer | contact information, email addresses, names, phone numbers, company data, deal information, engagement history, email content | email | ⬜ To be verified |
| twilio | contact information, email addresses, names, phone numbers, company data, deal information, engagement history, SMS message content, voice call metadata, call recordings | other | ⬜ To be verified |
| @sentry/nextjs | error data, stack traces, user context, device information, IP address, performance profiles | monitoring | ⬜ To be verified |
| Google Analytics | error data, stack traces, user context, device information, IP address, performance profiles, page views, user behavior, location data | analytics | ⬜ To be verified |
| Google Tag Manager | error data, stack traces, user context, device information, IP address, performance profiles, page views, user behavior, location data, custom events, third-party tag data | analytics | ⬜ To be verified |
| Plausible Analytics | error data, stack traces, user context, device information, IP address, performance profiles, page views, user behavior, location data, referrer data | analytics | ⬜ To be verified |
| posthog | error data, stack traces, user context, device information, IP address, performance profiles, page views, user behavior, location data, session recordings, feature flag usage | analytics | ⬜ To be verified |
| @upstash/redis | cached data, session data | database | ⬜ To be verified |
| ioredis | cached data, session data | database | ⬜ To be verified |
| next-auth | cached data, session data, OAuth tokens, Google profile data, email, user profiles, name, conversations, profile picture | auth | ⬜ To be verified |
| passport | cached data, session data, OAuth tokens, Google profile data, email, user profiles, name, conversations | auth | ⬜ To be verified |
| Redis | cached data, session data, cache data | database | ⬜ To be verified |
| Redis (env) | cached data, session data, cache data | database | ⬜ To be verified |
| google-auth-library | OAuth tokens, Google profile data, email | auth | ⬜ To be verified |
| stripe | OAuth tokens, Google profile data, email, payment information, billing address, transaction history | payment | ⬜ To be verified |
| googleapis | user data via Google APIs, calendar data, email data, profile information | other | ⬜ To be verified |
| PostgreSQL | application data, user records | database | ⬜ To be verified |
| PostgreSQL (env) | application data, user records | database | ⬜ To be verified |
| prisma | user data as defined in schema | database | ⬜ To be verified |
| web-push | push subscription endpoints, device tokens, notification content | other | ⬜ To be verified |

## 5. International Data Transfers

| Processor | Transfer Destination | Safeguard Mechanism | Status |
|-----------|---------------------|---------------------|--------|
| @hubspot/api-client | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| @sendgrid/mail | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| intercom | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| nodemailer | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| twilio | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| @sentry/nextjs | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| Google Analytics | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| Google Tag Manager | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| Plausible Analytics | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| posthog | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| @upstash/redis | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| ioredis | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| next-auth | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| passport | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| Redis | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| Redis (env) | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| google-auth-library | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| stripe | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| googleapis | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| PostgreSQL | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| PostgreSQL (env) | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| prisma | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| web-push | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |

## 6. Retention Schedule

| Data Category | Retention Period | Deletion Method | Legal Basis for Retention |
|---------------|-----------------|-----------------|--------------------------|
| General | To be determined | Automated purge + manual verification | To be determined |
| Directly Identifiable | To be determined | Automated purge + manual verification | To be determined |
| Indirectly Identifiable | 90 days | Automated purge + manual verification | Legitimate interest (Art. 6(1)(f)) |
| Security Credential | Duration of account + 30 days | Automated purge + manual verification | Contract performance (Art. 6(1)(b)) |
| Financial | 7 years (tax/legal obligation) | Automated purge + manual verification | Contract performance (Art. 6(1)(b)) |

---

*This data mapping register is generated from automated code analysis and should be reviewed by your Data Protection Officer and legal team. It may not capture all data processing activities, particularly those conducted outside the scanned codebase. This does not constitute legal advice.*
