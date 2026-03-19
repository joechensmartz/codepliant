> **Document Version:** 1.0
> **Document Owner:** Acme Inc
> **Generated:** 2026-03-18 by [Codepliant](https://github.com/joechensmartz/codepliant)
> **Next Review Date:** 2027-03-18

This register provides a complete inventory of personal data processing activities
in compliance with GDPR Article 30 (Records of Processing Activities).

## 1. Data Controller Information

| Field | Details |
|-------|---------|
| **Data Controller** | Acme Inc |
| **Contact Email** | legal@acme.com |
| **Data Protection Officer** | Jane Mueller |
| **DPO Email** | dpo@acme-saas.com |
| **EU Representative** | Acme EU Compliance GmbH, Friedrichstr. 123, 10117 Berlin |
| **Website** | https://acme-saas.com |
| **Register Last Updated** | 2026-03-18 |

## 2. Data Inventory

| # | Data Element | Sensitivity | Source | Storage Location | Shared With | Lawful Basis | Retention |
|---|-------------|-------------|--------|------------------|-------------|--------------|-----------|
| 1 | error data | General | Application-collected | @sentry/node (third-party) | @sentry/node, posthog | Legitimate interest (Art. 6(1)(f)) | 365 days |
| 2 | stack traces | General | Application-collected | @sentry/node (third-party) | @sentry/node, posthog | Legitimate interest (Art. 6(1)(f)) | 365 days |
| 3 | user context | General | Application-collected | @sentry/node (third-party) | @sentry/node, posthog | Legitimate interest (Art. 6(1)(f)) | 365 days |
| 4 | device information | Indirectly Identifiable | Automatic collection (HTTP request) | @sentry/node (third-party) | @sentry/node, posthog | Legitimate interest (Art. 6(1)(f)) | 365 days |
| 5 | IP address | Directly Identifiable | Automatic collection (HTTP request) | @sentry/node (third-party) | @sentry/node, posthog | Legitimate interest (Art. 6(1)(f)) | 365 days |
| 6 | email | Directly Identifiable | User-provided (registration/form) | @supabase/supabase-js (third-party) | @supabase/supabase-js, stripe, stripe-ios | Contract performance (Art. 6(1)(b)) | 365 days |
| 7 | password hash | Security Credential | Application-collected | @supabase/supabase-js (third-party) | @supabase/supabase-js, stripe, stripe-ios | Contract performance (Art. 6(1)(b)) | 365 days |
| 8 | session data | General | Automatic collection (cookies/SDK) | @supabase/supabase-js (third-party) | @supabase/supabase-js, stripe, stripe-ios | Contract performance (Art. 6(1)(b)) | 365 days |
| 9 | user metadata | General | Application-collected | @supabase/supabase-js (third-party) | @supabase/supabase-js, stripe, stripe-ios | Contract performance (Art. 6(1)(b)) | 365 days |
| 10 | user prompts | General | User-provided / Application-generated | openai (third-party) | openai | Consent / Legitimate interest | 365 days |
| 11 | conversation history | General | User-provided / Application-generated | openai (third-party) | openai | Consent / Legitimate interest | 365 days |
| 12 | generated content | General | User-provided / Application-generated | openai (third-party) | openai | Consent / Legitimate interest | 365 days |
| 13 | user behavior | General | Automatic collection (analytics SDK) | posthog (third-party) | posthog | Legitimate interest (Art. 6(1)(f)) | 365 days |
| 14 | session recordings | General | Automatic collection (cookies/SDK) | posthog (third-party) | posthog | Legitimate interest (Art. 6(1)(f)) | 365 days |
| 15 | feature flag usage | General | Automatic collection (analytics SDK) | posthog (third-party) | posthog | Legitimate interest (Art. 6(1)(f)) | 365 days |
| 16 | user data as defined in schema | General | Application-collected | prisma (third-party) | prisma | Contract performance (Art. 6(1)(b)) | 365 days |
| 17 | email addresses | Directly Identifiable | User-provided (registration/form) | resend (third-party) | resend | Contract performance / Consent | 365 days |
| 18 | email content | Directly Identifiable | User-provided (registration/form) | resend (third-party) | resend | Contract performance / Consent | 365 days |
| 19 | payment information | Financial | User-provided (checkout) | stripe (third-party) | stripe, stripe-ios | Contract performance (Art. 6(1)(b)) | 365 days |
| 20 | billing address | Directly Identifiable | User-provided (registration/form) | stripe (third-party) | stripe, stripe-ios | Contract performance (Art. 6(1)(b)) | 365 days |
| 21 | transaction history | General | Application-collected | stripe (third-party) | stripe, stripe-ios | Contract performance (Art. 6(1)(b)) | 365 days |
| 22 | Personal Identity Data | General | @supabase/supabase-js | Application database | Internal only | To be determined | 365 days |
| 23 | Financial Data | Financial | stripe | Application database | Internal only | To be determined | 365 days |
| 24 | Usage & Behavioral Data | General | posthog | Application database | Internal only | To be determined | 365 days |
| 25 | AI Interaction Data | General | openai | Application database | Internal only | To be determined | 365 days |
| 26 | Communication Data | General | resend | Application database | Internal only | To be determined | 365 days |
| 27 | Technical & Diagnostic Data | General | @sentry/node | Application database | Internal only | To be determined | 365 days |
| 28 | Stored User Data | General | prisma | Application database | Internal only | To be determined | 365 days |
| 29 | Contact Information | General | User.email | Application database | Internal only | To be determined | 365 days |
| 30 | Authentication Data | General | User.passwordHash | Application database | Internal only | To be determined | 365 days |

## 3. Data Flow Summary

### General

| Data Element | Source | Destination |
|-------------|--------|-------------|
| error data | Application-collected | @sentry/node, posthog |
| stack traces | Application-collected | @sentry/node, posthog |
| user context | Application-collected | @sentry/node, posthog |
| session data | Automatic collection (cookies/SDK) | @supabase/supabase-js, stripe, stripe-ios |
| user metadata | Application-collected | @supabase/supabase-js, stripe, stripe-ios |
| user prompts | User-provided / Application-generated | openai |
| conversation history | User-provided / Application-generated | openai |
| generated content | User-provided / Application-generated | openai |
| user behavior | Automatic collection (analytics SDK) | posthog |
| session recordings | Automatic collection (cookies/SDK) | posthog |
| feature flag usage | Automatic collection (analytics SDK) | posthog |
| user data as defined in schema | Application-collected | prisma |
| transaction history | Application-collected | stripe, stripe-ios |
| Personal Identity Data | @supabase/supabase-js | Application database |
| Usage & Behavioral Data | posthog | Application database |
| AI Interaction Data | openai | Application database |
| Communication Data | resend | Application database |
| Technical & Diagnostic Data | @sentry/node | Application database |
| Stored User Data | prisma | Application database |
| Contact Information | User.email | Application database |
| Authentication Data | User.passwordHash | Application database |

### Indirectly Identifiable

| Data Element | Source | Destination |
|-------------|--------|-------------|
| device information | Automatic collection (HTTP request) | @sentry/node, posthog |

### Directly Identifiable

| Data Element | Source | Destination |
|-------------|--------|-------------|
| IP address | Automatic collection (HTTP request) | @sentry/node, posthog |
| email | User-provided (registration/form) | @supabase/supabase-js, stripe, stripe-ios |
| email addresses | User-provided (registration/form) | resend |
| email content | User-provided (registration/form) | resend |
| billing address | User-provided (registration/form) | stripe, stripe-ios |

### Security Credential

| Data Element | Source | Destination |
|-------------|--------|-------------|
| password hash | Application-collected | @supabase/supabase-js, stripe, stripe-ios |

### Financial

| Data Element | Source | Destination |
|-------------|--------|-------------|
| payment information | User-provided (checkout) | stripe, stripe-ios |
| Financial Data | stripe | Application database |

## 4. Third-Party Processors

| Processor | Data Shared | Purpose | DPA Status |
|-----------|------------|---------|------------|
| @sentry/node | error data, stack traces, user context, device information, IP address | monitoring | ⬜ To be verified |
| posthog | error data, stack traces, user context, device information, IP address, user behavior, session recordings, feature flag usage | analytics | ⬜ To be verified |
| @supabase/supabase-js | email, password hash, session data, user metadata | auth | ⬜ To be verified |
| stripe | email, password hash, session data, user metadata, payment information, billing address, transaction history | payment | ⬜ To be verified |
| stripe-ios | email, password hash, session data, user metadata, payment information, billing address, transaction history | payment | ⬜ To be verified |
| openai | user prompts, conversation history, generated content | ai | ⬜ To be verified |
| prisma | user data as defined in schema | database | ⬜ To be verified |
| resend | email addresses, email content | email | ⬜ To be verified |

## 5. International Data Transfers

| Processor | Transfer Destination | Safeguard Mechanism | Status |
|-----------|---------------------|---------------------|--------|
| @sentry/node | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| posthog | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| @supabase/supabase-js | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| stripe | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| stripe-ios | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| openai | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| prisma | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| resend | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |

## 6. Retention Schedule

| Data Category | Retention Period | Deletion Method | Legal Basis for Retention |
|---------------|-----------------|-----------------|--------------------------|
| General | 365 days | Automated purge + manual verification | Legitimate interest (Art. 6(1)(f)) |
| Indirectly Identifiable | 365 days | Automated purge + manual verification | Legitimate interest (Art. 6(1)(f)) |
| Directly Identifiable | 365 days | Automated purge + manual verification | Legitimate interest (Art. 6(1)(f)) |
| Security Credential | 365 days | Automated purge + manual verification | Contract performance (Art. 6(1)(b)) |
| Financial | 365 days | Automated purge + manual verification | Contract performance (Art. 6(1)(b)) |

---

*This data mapping register is generated from automated code analysis and should be reviewed by your Data Protection Officer and legal team. It may not capture all data processing activities, particularly those conducted outside the scanned codebase. This does not constitute legal advice.*
