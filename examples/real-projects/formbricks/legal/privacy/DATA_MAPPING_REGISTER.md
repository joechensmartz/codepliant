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
| 1 | uploaded files | General | Application-collected | @aws-sdk/client-s3 (third-party) | @aws-sdk/client-s3 | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 2 | file metadata | General | Application-collected | @aws-sdk/client-s3 (third-party) | @aws-sdk/client-s3 | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 3 | error data | General | Application-collected | @sentry/nextjs (third-party) | @sentry/nextjs, posthog | Legitimate interest (Art. 6(1)(f)) | 90 days |
| 4 | stack traces | General | Application-collected | @sentry/nextjs (third-party) | @sentry/nextjs, posthog | Legitimate interest (Art. 6(1)(f)) | 90 days |
| 5 | user context | General | Application-collected | @sentry/nextjs (third-party) | @sentry/nextjs, posthog | Legitimate interest (Art. 6(1)(f)) | 90 days |
| 6 | device information | Indirectly Identifiable | Automatic collection (HTTP request) | @sentry/nextjs (third-party) | @sentry/nextjs, posthog | Legitimate interest (Art. 6(1)(f)) | 90 days |
| 7 | IP address | Directly Identifiable | Automatic collection (HTTP request) | @sentry/nextjs (third-party) | @sentry/nextjs, posthog | Legitimate interest (Art. 6(1)(f)) | 90 days |
| 8 | user data via Google APIs | General | Application-collected | googleapis (third-party) | googleapis | To be determined | To be determined |
| 9 | calendar data | General | Application-collected | googleapis (third-party) | googleapis | To be determined | To be determined |
| 10 | email data | Directly Identifiable | User-provided (registration/form) | googleapis (third-party) | googleapis | To be determined | To be determined |
| 11 | profile information | General | Application-collected | googleapis (third-party) | googleapis | To be determined | To be determined |
| 12 | cached data | General | Application-collected | ioredis (third-party) | ioredis, next-auth, redis | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 13 | session data | General | Automatic collection (cookies/SDK) | ioredis (third-party) | ioredis, next-auth, redis | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 14 | email | Directly Identifiable | User-provided (registration/form) | next-auth (third-party) | next-auth, stripe | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 15 | name | Directly Identifiable | User-provided (registration/form) | next-auth (third-party) | next-auth, stripe | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 16 | profile picture | General | Application-collected | next-auth (third-party) | next-auth, stripe | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 17 | OAuth tokens | Security Credential | Application-collected | next-auth (third-party) | next-auth, stripe | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 18 | email addresses | Directly Identifiable | User-provided (registration/form) | nodemailer (third-party) | nodemailer | Contract performance / Consent | Duration of account + 30 days |
| 19 | email content | Directly Identifiable | User-provided (registration/form) | nodemailer (third-party) | nodemailer | Contract performance / Consent | Duration of account + 30 days |
| 20 | user behavior | General | Automatic collection (analytics SDK) | posthog (third-party) | posthog | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 21 | session recordings | General | Automatic collection (cookies/SDK) | posthog (third-party) | posthog | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 22 | feature flag usage | General | Automatic collection (analytics SDK) | posthog (third-party) | posthog | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 23 | user data as defined in schema | General | Application-collected | prisma (third-party) | prisma | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 24 | payment information | Financial | User-provided (checkout) | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 25 | billing address | Directly Identifiable | User-provided (registration/form) | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 26 | transaction history | General | Application-collected | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 27 | Personal Identity Data | General | next-auth | Application database | Internal only | To be determined | To be determined |
| 28 | Financial Data | Financial | stripe | Application database | Internal only | To be determined | To be determined |
| 29 | Usage & Behavioral Data | General | posthog | Application database | Internal only | To be determined | To be determined |
| 30 | Communication Data | General | nodemailer | Application database | Internal only | To be determined | To be determined |
| 31 | Technical & Diagnostic Data | General | @sentry/nextjs | Application database | Internal only | To be determined | To be determined |
| 32 | User-Uploaded Content | General | @aws-sdk/client-s3 | Application database | Internal only | To be determined | To be determined |
| 33 | Stored User Data | General | prisma | Application database | Internal only | To be determined | To be determined |
| 34 | Technical Data | General | schema.userAgent | Application database | Internal only | To be determined | To be determined |
| 35 | Contact Information | General | schema.email | Application database | Internal only | To be determined | To be determined |

## 3. Data Flow Summary

### General

| Data Element | Source | Destination |
|-------------|--------|-------------|
| uploaded files | Application-collected | @aws-sdk/client-s3 |
| file metadata | Application-collected | @aws-sdk/client-s3 |
| error data | Application-collected | @sentry/nextjs, posthog |
| stack traces | Application-collected | @sentry/nextjs, posthog |
| user context | Application-collected | @sentry/nextjs, posthog |
| user data via Google APIs | Application-collected | googleapis |
| calendar data | Application-collected | googleapis |
| profile information | Application-collected | googleapis |
| cached data | Application-collected | ioredis, next-auth, redis |
| session data | Automatic collection (cookies/SDK) | ioredis, next-auth, redis |
| profile picture | Application-collected | next-auth, stripe |
| user behavior | Automatic collection (analytics SDK) | posthog |
| session recordings | Automatic collection (cookies/SDK) | posthog |
| feature flag usage | Automatic collection (analytics SDK) | posthog |
| user data as defined in schema | Application-collected | prisma |
| transaction history | Application-collected | stripe |
| Personal Identity Data | next-auth | Application database |
| Usage & Behavioral Data | posthog | Application database |
| Communication Data | nodemailer | Application database |
| Technical & Diagnostic Data | @sentry/nextjs | Application database |
| User-Uploaded Content | @aws-sdk/client-s3 | Application database |
| Stored User Data | prisma | Application database |
| Technical Data | schema.userAgent | Application database |
| Contact Information | schema.email | Application database |

### Indirectly Identifiable

| Data Element | Source | Destination |
|-------------|--------|-------------|
| device information | Automatic collection (HTTP request) | @sentry/nextjs, posthog |

### Directly Identifiable

| Data Element | Source | Destination |
|-------------|--------|-------------|
| IP address | Automatic collection (HTTP request) | @sentry/nextjs, posthog |
| email data | User-provided (registration/form) | googleapis |
| email | User-provided (registration/form) | next-auth, stripe |
| name | User-provided (registration/form) | next-auth, stripe |
| email addresses | User-provided (registration/form) | nodemailer |
| email content | User-provided (registration/form) | nodemailer |
| billing address | User-provided (registration/form) | stripe |

### Security Credential

| Data Element | Source | Destination |
|-------------|--------|-------------|
| OAuth tokens | Application-collected | next-auth, stripe |

### Financial

| Data Element | Source | Destination |
|-------------|--------|-------------|
| payment information | User-provided (checkout) | stripe |
| Financial Data | stripe | Application database |

## 4. Third-Party Processors

| Processor | Data Shared | Purpose | DPA Status |
|-----------|------------|---------|------------|
| @aws-sdk/client-s3 | uploaded files, file metadata | storage | ⬜ To be verified |
| @sentry/nextjs | error data, stack traces, user context, device information, IP address | monitoring | ⬜ To be verified |
| posthog | error data, stack traces, user context, device information, IP address, user behavior, session recordings, feature flag usage | analytics | ⬜ To be verified |
| googleapis | user data via Google APIs, calendar data, email data, profile information | other | ⬜ To be verified |
| ioredis | cached data, session data | database | ⬜ To be verified |
| next-auth | cached data, session data, email, name, profile picture, OAuth tokens | auth | ⬜ To be verified |
| redis | cached data, session data | database | ⬜ To be verified |
| stripe | email, name, profile picture, OAuth tokens, payment information, billing address, transaction history | payment | ⬜ To be verified |
| nodemailer | email addresses, email content | email | ⬜ To be verified |
| prisma | user data as defined in schema | database | ⬜ To be verified |

## 5. International Data Transfers

| Processor | Transfer Destination | Safeguard Mechanism | Status |
|-----------|---------------------|---------------------|--------|
| @aws-sdk/client-s3 | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| @sentry/nextjs | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| posthog | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| googleapis | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| ioredis | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| next-auth | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| redis | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| stripe | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| nodemailer | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| prisma | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |

## 6. Retention Schedule

| Data Category | Retention Period | Deletion Method | Legal Basis for Retention |
|---------------|-----------------|-----------------|--------------------------|
| General | Duration of account + 30 days | Automated purge + manual verification | Contract performance (Art. 6(1)(b)) |
| Indirectly Identifiable | 90 days | Automated purge + manual verification | Legitimate interest (Art. 6(1)(f)) |
| Directly Identifiable | 90 days | Automated purge + manual verification | Legitimate interest (Art. 6(1)(f)) |
| Security Credential | Duration of account + 30 days | Automated purge + manual verification | Contract performance (Art. 6(1)(b)) |
| Financial | 7 years (tax/legal obligation) | Automated purge + manual verification | Contract performance (Art. 6(1)(b)) |

---

*This data mapping register is generated from automated code analysis and should be reviewed by your Data Protection Officer and legal team. It may not capture all data processing activities, particularly those conducted outside the scanned codebase. This does not constitute legal advice.*
