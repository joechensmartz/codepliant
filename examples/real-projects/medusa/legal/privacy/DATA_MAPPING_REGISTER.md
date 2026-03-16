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
| 1 | uploaded files | General | Application-collected | @aws-sdk/client-s3 (third-party) | @aws-sdk/client-s3, Multer | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 2 | file metadata | General | Application-collected | @aws-sdk/client-s3 (third-party) | @aws-sdk/client-s3, Multer | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 3 | user identity | General | Automatic collection (analytics SDK) | @segment/analytics-next (third-party) | @segment/analytics-next, posthog | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 4 | user behavior | General | Automatic collection (analytics SDK) | @segment/analytics-next (third-party) | @segment/analytics-next, posthog | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 5 | page views | General | Automatic collection (analytics SDK) | @segment/analytics-next (third-party) | @segment/analytics-next, posthog | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 6 | custom events | General | Automatic collection (analytics SDK) | @segment/analytics-next (third-party) | @segment/analytics-next, posthog | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 7 | device information | Indirectly Identifiable | Automatic collection (HTTP request) | @segment/analytics-next (third-party) | @segment/analytics-next, posthog | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 8 | IP address | Directly Identifiable | Automatic collection (HTTP request) | @segment/analytics-next (third-party) | @segment/analytics-next, posthog | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 9 | email addresses | Directly Identifiable | User-provided (registration/form) | @sendgrid/mail (third-party) | @sendgrid/mail | Contract performance / Consent | Duration of account + 30 days |
| 10 | email content | Directly Identifiable | User-provided (registration/form) | @sendgrid/mail (third-party) | @sendgrid/mail | Contract performance / Consent | Duration of account + 30 days |
| 11 | search queries | General | Application-collected | algoliasearch (third-party) | algoliasearch | To be determined | To be determined |
| 12 | search result clicks | General | Application-collected | algoliasearch (third-party) | algoliasearch | To be determined | To be determined |
| 13 | user search behavior | General | Application-collected | algoliasearch (third-party) | algoliasearch | To be determined | To be determined |
| 14 | cookies | Indirectly Identifiable | Automatic collection (cookies/SDK) | cookie-parser (third-party) | cookie-parser | To be determined | To be determined |
| 15 | cookie data | Indirectly Identifiable | Automatic collection (cookies/SDK) | cookie-parser (third-party) | cookie-parser | To be determined | To be determined |
| 16 | session cookies | Indirectly Identifiable | Automatic collection (cookies/SDK) | express-session (third-party) | express-session, ioredis | To be determined | To be determined |
| 17 | session data | General | Automatic collection (cookies/SDK) | express-session (third-party) | express-session, ioredis | To be determined | To be determined |
| 18 | cached data | General | Application-collected | ioredis (third-party) | ioredis | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 19 | potential PII in uploaded content | General | Application-collected | Multer (third-party) | Multer | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 20 | user prompts | General | User-provided / Application-generated | openai (third-party) | openai | Consent / Legitimate interest | Per AI provider policy / 30 days |
| 21 | conversation history | General | User-provided / Application-generated | openai (third-party) | openai | Consent / Legitimate interest | Per AI provider policy / 30 days |
| 22 | generated content | General | User-provided / Application-generated | openai (third-party) | openai | Consent / Legitimate interest | Per AI provider policy / 30 days |
| 23 | session recordings | General | Automatic collection (cookies/SDK) | posthog (third-party) | posthog | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 24 | feature flag usage | General | Automatic collection (analytics SDK) | posthog (third-party) | posthog | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 25 | payment information | Financial | User-provided (checkout) | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 26 | billing address | Directly Identifiable | User-provided (registration/form) | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 27 | email | Directly Identifiable | User-provided (registration/form) | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 28 | transaction history | General | Application-collected | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 29 | Financial Data | Financial | stripe | Application database | Internal only | To be determined | To be determined |
| 30 | Usage & Behavioral Data | General | posthog | Application database | Internal only | To be determined | To be determined |
| 31 | AI Interaction Data | General | openai | Application database | Internal only | To be determined | To be determined |
| 32 | Communication Data | General | @sendgrid/mail | Application database | Internal only | To be determined | To be determined |
| 33 | User-Uploaded Content | General | Multer | Application database | Internal only | To be determined | To be determined |
| 34 | Stored User Data | General | ioredis | Application database | Internal only | To be determined | To be determined |
| 35 | Personal Identity Data | General | Product.name | Application database | Internal only | To be determined | To be determined |

## 3. Data Flow Summary

### General

| Data Element | Source | Destination |
|-------------|--------|-------------|
| uploaded files | Application-collected | @aws-sdk/client-s3, Multer |
| file metadata | Application-collected | @aws-sdk/client-s3, Multer |
| user identity | Automatic collection (analytics SDK) | @segment/analytics-next, posthog |
| user behavior | Automatic collection (analytics SDK) | @segment/analytics-next, posthog |
| page views | Automatic collection (analytics SDK) | @segment/analytics-next, posthog |
| custom events | Automatic collection (analytics SDK) | @segment/analytics-next, posthog |
| search queries | Application-collected | algoliasearch |
| search result clicks | Application-collected | algoliasearch |
| user search behavior | Application-collected | algoliasearch |
| session data | Automatic collection (cookies/SDK) | express-session, ioredis |
| cached data | Application-collected | ioredis |
| potential PII in uploaded content | Application-collected | Multer |
| user prompts | User-provided / Application-generated | openai |
| conversation history | User-provided / Application-generated | openai |
| generated content | User-provided / Application-generated | openai |
| session recordings | Automatic collection (cookies/SDK) | posthog |
| feature flag usage | Automatic collection (analytics SDK) | posthog |
| transaction history | Application-collected | stripe |
| Usage & Behavioral Data | posthog | Application database |
| AI Interaction Data | openai | Application database |
| Communication Data | @sendgrid/mail | Application database |
| User-Uploaded Content | Multer | Application database |
| Stored User Data | ioredis | Application database |
| Personal Identity Data | Product.name | Application database |

### Indirectly Identifiable

| Data Element | Source | Destination |
|-------------|--------|-------------|
| device information | Automatic collection (HTTP request) | @segment/analytics-next, posthog |
| cookies | Automatic collection (cookies/SDK) | cookie-parser |
| cookie data | Automatic collection (cookies/SDK) | cookie-parser |
| session cookies | Automatic collection (cookies/SDK) | express-session, ioredis |

### Directly Identifiable

| Data Element | Source | Destination |
|-------------|--------|-------------|
| IP address | Automatic collection (HTTP request) | @segment/analytics-next, posthog |
| email addresses | User-provided (registration/form) | @sendgrid/mail |
| email content | User-provided (registration/form) | @sendgrid/mail |
| billing address | User-provided (registration/form) | stripe |
| email | User-provided (registration/form) | stripe |

### Financial

| Data Element | Source | Destination |
|-------------|--------|-------------|
| payment information | User-provided (checkout) | stripe |
| Financial Data | stripe | Application database |

## 4. Third-Party Processors

| Processor | Data Shared | Purpose | DPA Status |
|-----------|------------|---------|------------|
| @aws-sdk/client-s3 | uploaded files, file metadata | storage | ⬜ To be verified |
| Multer | uploaded files, file metadata, potential PII in uploaded content | storage | ⬜ To be verified |
| @segment/analytics-next | user identity, user behavior, page views, custom events, device information, IP address | analytics | ⬜ To be verified |
| posthog | user identity, user behavior, page views, custom events, device information, IP address, session recordings, feature flag usage | analytics | ⬜ To be verified |
| @sendgrid/mail | email addresses, email content | email | ⬜ To be verified |
| algoliasearch | search queries, search result clicks, user search behavior | other | ⬜ To be verified |
| cookie-parser | cookies, cookie data | other | ⬜ To be verified |
| express-session | session cookies, session data | other | ⬜ To be verified |
| ioredis | session cookies, session data, cached data | database | ⬜ To be verified |
| openai | user prompts, conversation history, generated content | ai | ⬜ To be verified |
| stripe | payment information, billing address, email, transaction history | payment | ⬜ To be verified |

## 5. International Data Transfers

| Processor | Transfer Destination | Safeguard Mechanism | Status |
|-----------|---------------------|---------------------|--------|
| @aws-sdk/client-s3 | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| Multer | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| @segment/analytics-next | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| posthog | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| @sendgrid/mail | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| algoliasearch | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| cookie-parser | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| express-session | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| ioredis | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| openai | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| stripe | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |

## 6. Retention Schedule

| Data Category | Retention Period | Deletion Method | Legal Basis for Retention |
|---------------|-----------------|-----------------|--------------------------|
| General | Duration of account + 30 days | Automated purge + manual verification | Contract performance (Art. 6(1)(b)) |
| Indirectly Identifiable | 26 months (max) | Automated purge + manual verification | Legitimate interest (Art. 6(1)(f)) |
| Directly Identifiable | 26 months (max) | Automated purge + manual verification | Legitimate interest (Art. 6(1)(f)) |
| Financial | 7 years (tax/legal obligation) | Automated purge + manual verification | Contract performance (Art. 6(1)(b)) |

---

*This data mapping register is generated from automated code analysis and should be reviewed by your Data Protection Officer and legal team. It may not capture all data processing activities, particularly those conducted outside the scanned codebase. This does not constitute legal advice.*
