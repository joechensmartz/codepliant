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
| 1 | user prompts | General | User-provided / Application-generated | @ai-sdk/anthropic (third-party) | @ai-sdk/anthropic, @ai-sdk/google, @ai-sdk/openai, @vercel/ai, openai | Consent / Legitimate interest | Per AI provider policy / 30 days |
| 2 | conversation history | General | User-provided / Application-generated | @ai-sdk/anthropic (third-party) | @ai-sdk/anthropic, @ai-sdk/google, @ai-sdk/openai, @vercel/ai, openai | Consent / Legitimate interest | Per AI provider policy / 30 days |
| 3 | generated content | General | User-provided / Application-generated | @ai-sdk/anthropic (third-party) | @ai-sdk/anthropic, @ai-sdk/google, @ai-sdk/openai, @vercel/ai, openai | Consent / Legitimate interest | Per AI provider policy / 30 days |
| 4 | uploaded files | General | Application-collected | @aws-sdk/client-s3 (third-party) | @aws-sdk/client-s3 | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 5 | file metadata | General | Application-collected | @aws-sdk/client-s3 (third-party) | @aws-sdk/client-s3 | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 6 | error data | General | Application-collected | @sentry/node (third-party) | @sentry/node | Legitimate interest (Art. 6(1)(f)) | 90 days |
| 7 | stack traces | General | Application-collected | @sentry/node (third-party) | @sentry/node | Legitimate interest (Art. 6(1)(f)) | 90 days |
| 8 | user context | General | Application-collected | @sentry/node (third-party) | @sentry/node | Legitimate interest (Art. 6(1)(f)) | 90 days |
| 9 | device information | Indirectly Identifiable | Automatic collection (HTTP request) | @sentry/node (third-party) | @sentry/node | Legitimate interest (Art. 6(1)(f)) | 90 days |
| 10 | IP address | Directly Identifiable | Automatic collection (HTTP request) | @sentry/node (third-party) | @sentry/node | Legitimate interest (Art. 6(1)(f)) | 90 days |
| 11 | performance profiles | General | Application-collected | @sentry/node (third-party) | @sentry/node | Legitimate interest (Art. 6(1)(f)) | 90 days |
| 12 | user data as defined in schema | General | Application-collected | drizzle (third-party) | drizzle | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 13 | user data via Google APIs | General | Application-collected | googleapis (third-party) | googleapis | To be determined | To be determined |
| 14 | calendar data | General | Application-collected | googleapis (third-party) | googleapis | To be determined | To be determined |
| 15 | email data | Directly Identifiable | User-provided (registration/form) | googleapis (third-party) | googleapis | To be determined | To be determined |
| 16 | profile information | General | Application-collected | googleapis (third-party) | googleapis | To be determined | To be determined |
| 17 | cached data | General | Application-collected | ioredis (third-party) | ioredis, passport, redis | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 18 | session data | General | Automatic collection (cookies/SDK) | ioredis (third-party) | ioredis, passport, redis | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 19 | email addresses | Directly Identifiable | User-provided (registration/form) | nodemailer (third-party) | nodemailer | Contract performance / Consent | Duration of account + 30 days |
| 20 | email content | Directly Identifiable | User-provided (registration/form) | nodemailer (third-party) | nodemailer | Contract performance / Consent | Duration of account + 30 days |
| 21 | email | Directly Identifiable | User-provided (registration/form) | passport (third-party) | passport, passport-google-oauth20, passport-microsoft, stripe | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 22 | name | Directly Identifiable | User-provided (registration/form) | passport (third-party) | passport, passport-google-oauth20, passport-microsoft, stripe | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 23 | OAuth tokens | Security Credential | Application-collected | passport (third-party) | passport, passport-google-oauth20, passport-microsoft, stripe | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 24 | Google profile data | General | Application-collected | passport-google-oauth20 (third-party) | passport-google-oauth20 | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 25 | Microsoft profile data | General | Application-collected | passport-microsoft (third-party) | passport-microsoft | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 26 | payment information | Financial | User-provided (checkout) | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 27 | billing address | Directly Identifiable | User-provided (registration/form) | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 28 | transaction history | General | Application-collected | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 29 | Personal Identity Data | General | passport-google-oauth20 | Application database | Internal only | To be determined | To be determined |
| 30 | Financial Data | Financial | stripe | Application database | Internal only | To be determined | To be determined |
| 31 | AI Interaction Data | General | openai | Application database | Internal only | To be determined | To be determined |
| 32 | Communication Data | General | nodemailer | Application database | Internal only | To be determined | To be determined |
| 33 | Technical & Diagnostic Data | General | @sentry/node | Application database | Internal only | To be determined | To be determined |
| 34 | User-Uploaded Content | General | @aws-sdk/client-s3 | Application database | Internal only | To be determined | To be determined |
| 35 | Stored User Data | General | ioredis | Application database | Internal only | To be determined | To be determined |
| 36 | Contact Information | General | AppTokenEntity.email | Application database | Internal only | To be determined | To be determined |
| 37 | Authentication Data | General | PostgresCredentialsEntity.passwordHash | Application database | Internal only | To be determined | To be determined |
| 38 | Location Data | General | WorkspaceMember.timeZone | Application database | Internal only | To be determined | To be determined |

## 3. Data Flow Summary

### General

| Data Element | Source | Destination |
|-------------|--------|-------------|
| user prompts | User-provided / Application-generated | @ai-sdk/anthropic, @ai-sdk/google, @ai-sdk/openai, @vercel/ai, openai |
| conversation history | User-provided / Application-generated | @ai-sdk/anthropic, @ai-sdk/google, @ai-sdk/openai, @vercel/ai, openai |
| generated content | User-provided / Application-generated | @ai-sdk/anthropic, @ai-sdk/google, @ai-sdk/openai, @vercel/ai, openai |
| uploaded files | Application-collected | @aws-sdk/client-s3 |
| file metadata | Application-collected | @aws-sdk/client-s3 |
| error data | Application-collected | @sentry/node |
| stack traces | Application-collected | @sentry/node |
| user context | Application-collected | @sentry/node |
| performance profiles | Application-collected | @sentry/node |
| user data as defined in schema | Application-collected | drizzle |
| user data via Google APIs | Application-collected | googleapis |
| calendar data | Application-collected | googleapis |
| profile information | Application-collected | googleapis |
| cached data | Application-collected | ioredis, passport, redis |
| session data | Automatic collection (cookies/SDK) | ioredis, passport, redis |
| Google profile data | Application-collected | passport-google-oauth20 |
| Microsoft profile data | Application-collected | passport-microsoft |
| transaction history | Application-collected | stripe |
| Personal Identity Data | passport-google-oauth20 | Application database |
| AI Interaction Data | openai | Application database |
| Communication Data | nodemailer | Application database |
| Technical & Diagnostic Data | @sentry/node | Application database |
| User-Uploaded Content | @aws-sdk/client-s3 | Application database |
| Stored User Data | ioredis | Application database |
| Contact Information | AppTokenEntity.email | Application database |
| Authentication Data | PostgresCredentialsEntity.passwordHash | Application database |
| Location Data | WorkspaceMember.timeZone | Application database |

### Indirectly Identifiable

| Data Element | Source | Destination |
|-------------|--------|-------------|
| device information | Automatic collection (HTTP request) | @sentry/node |

### Directly Identifiable

| Data Element | Source | Destination |
|-------------|--------|-------------|
| IP address | Automatic collection (HTTP request) | @sentry/node |
| email data | User-provided (registration/form) | googleapis |
| email addresses | User-provided (registration/form) | nodemailer |
| email content | User-provided (registration/form) | nodemailer |
| email | User-provided (registration/form) | passport, passport-google-oauth20, passport-microsoft, stripe |
| name | User-provided (registration/form) | passport, passport-google-oauth20, passport-microsoft, stripe |
| billing address | User-provided (registration/form) | stripe |

### Security Credential

| Data Element | Source | Destination |
|-------------|--------|-------------|
| OAuth tokens | Application-collected | passport, passport-google-oauth20, passport-microsoft, stripe |

### Financial

| Data Element | Source | Destination |
|-------------|--------|-------------|
| payment information | User-provided (checkout) | stripe |
| Financial Data | stripe | Application database |

## 4. Third-Party Processors

| Processor | Data Shared | Purpose | DPA Status |
|-----------|------------|---------|------------|
| @ai-sdk/anthropic | user prompts, conversation history, generated content | ai | ⬜ To be verified |
| @ai-sdk/google | user prompts, conversation history, generated content | ai | ⬜ To be verified |
| @ai-sdk/openai | user prompts, conversation history, generated content | ai | ⬜ To be verified |
| @vercel/ai | user prompts, conversation history, generated content | ai | ⬜ To be verified |
| openai | user prompts, conversation history, generated content | ai | ⬜ To be verified |
| @aws-sdk/client-s3 | uploaded files, file metadata | storage | ⬜ To be verified |
| @sentry/node | error data, stack traces, user context, device information, IP address, performance profiles | monitoring | ⬜ To be verified |
| drizzle | user data as defined in schema | database | ⬜ To be verified |
| googleapis | user data via Google APIs, calendar data, email data, profile information | other | ⬜ To be verified |
| ioredis | cached data, session data | database | ⬜ To be verified |
| passport | cached data, session data, email, name, OAuth tokens | auth | ⬜ To be verified |
| redis | cached data, session data | database | ⬜ To be verified |
| nodemailer | email addresses, email content | email | ⬜ To be verified |
| passport-google-oauth20 | email, name, OAuth tokens, Google profile data | auth | ⬜ To be verified |
| passport-microsoft | email, name, OAuth tokens, Microsoft profile data | auth | ⬜ To be verified |
| stripe | email, name, OAuth tokens, payment information, billing address, transaction history | payment | ⬜ To be verified |

## 5. International Data Transfers

| Processor | Transfer Destination | Safeguard Mechanism | Status |
|-----------|---------------------|---------------------|--------|
| @ai-sdk/anthropic | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| @ai-sdk/google | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| @ai-sdk/openai | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| @vercel/ai | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| openai | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| @aws-sdk/client-s3 | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| @sentry/node | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| drizzle | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| googleapis | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| ioredis | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| passport | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| redis | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| nodemailer | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| passport-google-oauth20 | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| passport-microsoft | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| stripe | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |

## 6. Retention Schedule

| Data Category | Retention Period | Deletion Method | Legal Basis for Retention |
|---------------|-----------------|-----------------|--------------------------|
| General | Per AI provider policy / 30 days | Automated purge + manual verification | Consent / Legitimate interest |
| Indirectly Identifiable | 90 days | Automated purge + manual verification | Legitimate interest (Art. 6(1)(f)) |
| Directly Identifiable | 90 days | Automated purge + manual verification | Legitimate interest (Art. 6(1)(f)) |
| Security Credential | Duration of account + 30 days | Automated purge + manual verification | Contract performance (Art. 6(1)(b)) |
| Financial | 7 years (tax/legal obligation) | Automated purge + manual verification | Contract performance (Art. 6(1)(b)) |

---

*This data mapping register is generated from automated code analysis and should be reviewed by your Data Protection Officer and legal team. It may not capture all data processing activities, particularly those conducted outside the scanned codebase. This does not constitute legal advice.*
