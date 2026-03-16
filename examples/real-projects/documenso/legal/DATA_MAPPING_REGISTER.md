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
| 1 | user prompts | General | User-provided / Application-generated | @ai-sdk/google-vertex (third-party) | @ai-sdk/google-vertex, @vercel/ai | Consent / Legitimate interest | Per AI provider policy / 30 days |
| 2 | conversation history | General | User-provided / Application-generated | @ai-sdk/google-vertex (third-party) | @ai-sdk/google-vertex, @vercel/ai | Consent / Legitimate interest | Per AI provider policy / 30 days |
| 3 | generated content | General | User-provided / Application-generated | @ai-sdk/google-vertex (third-party) | @ai-sdk/google-vertex, @vercel/ai | Consent / Legitimate interest | Per AI provider policy / 30 days |
| 4 | email addresses | Directly Identifiable | User-provided (registration/form) | @aws-sdk/client-ses (third-party) | @aws-sdk/client-ses, nodemailer, resend | Contract performance / Consent | Duration of account + 30 days |
| 5 | email content | Directly Identifiable | User-provided (registration/form) | @aws-sdk/client-ses (third-party) | @aws-sdk/client-ses, nodemailer, resend | Contract performance / Consent | Duration of account + 30 days |
| 6 | uploaded files | General | Application-collected | @aws-sdk/client-ses (third-party) | @aws-sdk/client-ses, nodemailer, resend | Contract performance / Consent | Duration of account + 30 days |
| 7 | file metadata | General | Application-collected | @aws-sdk/client-ses (third-party) | @aws-sdk/client-ses, nodemailer, resend | Contract performance / Consent | Duration of account + 30 days |
| 8 | encryption keys | General | Application-collected | @google-cloud/kms (third-party) | @google-cloud/kms | To be determined | To be determined |
| 9 | key metadata | General | Application-collected | @google-cloud/kms (third-party) | @google-cloud/kms | To be determined | To be determined |
| 10 | biometric authentication data | Special Category (Art. 9) | Application-collected | @simplewebauthn/server (third-party) | @simplewebauthn/server | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 11 | device attestation | Indirectly Identifiable | Automatic collection (HTTP request) | @simplewebauthn/server (third-party) | @simplewebauthn/server | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 12 | credential IDs | Security Credential | Application-collected | @simplewebauthn/server (third-party) | @simplewebauthn/server | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 13 | user data via Google APIs | General | Application-collected | googleapis (third-party) | googleapis | To be determined | To be determined |
| 14 | calendar data | General | Application-collected | googleapis (third-party) | googleapis | To be determined | To be determined |
| 15 | email data | Directly Identifiable | User-provided (registration/form) | googleapis (third-party) | googleapis | To be determined | To be determined |
| 16 | profile information | General | Application-collected | googleapis (third-party) | googleapis | To be determined | To be determined |
| 17 | email | Directly Identifiable | User-provided (registration/form) | next-auth (third-party) | next-auth, passport-microsoft, stripe | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 18 | name | Directly Identifiable | User-provided (registration/form) | next-auth (third-party) | next-auth, passport-microsoft, stripe | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 19 | profile picture | General | Application-collected | next-auth (third-party) | next-auth, passport-microsoft, stripe | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 20 | OAuth tokens | Security Credential | Application-collected | next-auth (third-party) | next-auth, passport-microsoft, stripe | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 21 | session data | General | Automatic collection (cookies/SDK) | next-auth (third-party) | next-auth, passport-microsoft, stripe | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 22 | Microsoft profile data | General | Application-collected | passport-microsoft (third-party) | passport-microsoft | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 23 | user behavior | General | Automatic collection (analytics SDK) | posthog (third-party) | posthog | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 24 | session recordings | General | Automatic collection (cookies/SDK) | posthog (third-party) | posthog | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 25 | feature flag usage | General | Automatic collection (analytics SDK) | posthog (third-party) | posthog | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 26 | device information | Indirectly Identifiable | Automatic collection (HTTP request) | posthog (third-party) | posthog | Legitimate interest (Art. 6(1)(f)) | 26 months (max) |
| 27 | user data as defined in schema | General | Application-collected | prisma (third-party) | prisma | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 28 | payment information | Financial | User-provided (checkout) | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 29 | billing address | Directly Identifiable | User-provided (registration/form) | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 30 | transaction history | General | Application-collected | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 31 | Personal Identity Data | General | @simplewebauthn/server | Application database | Internal only | To be determined | To be determined |
| 32 | Financial Data | Financial | stripe | Application database | Internal only | To be determined | To be determined |
| 33 | Usage & Behavioral Data | General | posthog | Application database | Internal only | To be determined | To be determined |
| 34 | AI Interaction Data | General | @ai-sdk/google-vertex | Application database | Internal only | To be determined | To be determined |
| 35 | Communication Data | General | nodemailer | Application database | Internal only | To be determined | To be determined |
| 36 | Stored User Data | General | prisma | Application database | Internal only | To be determined | To be determined |

## 3. Data Flow Summary

### General

| Data Element | Source | Destination |
|-------------|--------|-------------|
| user prompts | User-provided / Application-generated | @ai-sdk/google-vertex, @vercel/ai |
| conversation history | User-provided / Application-generated | @ai-sdk/google-vertex, @vercel/ai |
| generated content | User-provided / Application-generated | @ai-sdk/google-vertex, @vercel/ai |
| uploaded files | Application-collected | @aws-sdk/client-ses, nodemailer, resend |
| file metadata | Application-collected | @aws-sdk/client-ses, nodemailer, resend |
| encryption keys | Application-collected | @google-cloud/kms |
| key metadata | Application-collected | @google-cloud/kms |
| user data via Google APIs | Application-collected | googleapis |
| calendar data | Application-collected | googleapis |
| profile information | Application-collected | googleapis |
| profile picture | Application-collected | next-auth, passport-microsoft, stripe |
| session data | Automatic collection (cookies/SDK) | next-auth, passport-microsoft, stripe |
| Microsoft profile data | Application-collected | passport-microsoft |
| user behavior | Automatic collection (analytics SDK) | posthog |
| session recordings | Automatic collection (cookies/SDK) | posthog |
| feature flag usage | Automatic collection (analytics SDK) | posthog |
| user data as defined in schema | Application-collected | prisma |
| transaction history | Application-collected | stripe |
| Personal Identity Data | @simplewebauthn/server | Application database |
| Usage & Behavioral Data | posthog | Application database |
| AI Interaction Data | @ai-sdk/google-vertex | Application database |
| Communication Data | nodemailer | Application database |
| Stored User Data | prisma | Application database |

### Directly Identifiable

| Data Element | Source | Destination |
|-------------|--------|-------------|
| email addresses | User-provided (registration/form) | @aws-sdk/client-ses, nodemailer, resend |
| email content | User-provided (registration/form) | @aws-sdk/client-ses, nodemailer, resend |
| email data | User-provided (registration/form) | googleapis |
| email | User-provided (registration/form) | next-auth, passport-microsoft, stripe |
| name | User-provided (registration/form) | next-auth, passport-microsoft, stripe |
| billing address | User-provided (registration/form) | stripe |

### Special Category (Art. 9)

| Data Element | Source | Destination |
|-------------|--------|-------------|
| biometric authentication data | Application-collected | @simplewebauthn/server |

### Indirectly Identifiable

| Data Element | Source | Destination |
|-------------|--------|-------------|
| device attestation | Automatic collection (HTTP request) | @simplewebauthn/server |
| device information | Automatic collection (HTTP request) | posthog |

### Security Credential

| Data Element | Source | Destination |
|-------------|--------|-------------|
| credential IDs | Application-collected | @simplewebauthn/server |
| OAuth tokens | Application-collected | next-auth, passport-microsoft, stripe |

### Financial

| Data Element | Source | Destination |
|-------------|--------|-------------|
| payment information | User-provided (checkout) | stripe |
| Financial Data | stripe | Application database |

## 4. Third-Party Processors

| Processor | Data Shared | Purpose | DPA Status |
|-----------|------------|---------|------------|
| @ai-sdk/google-vertex | user prompts, conversation history, generated content | ai | ⬜ To be verified |
| @vercel/ai | user prompts, conversation history, generated content | ai | ⬜ To be verified |
| @aws-sdk/client-ses | email addresses, email content, uploaded files, file metadata | email | ⬜ To be verified |
| nodemailer | email addresses, email content, uploaded files, file metadata | email | ⬜ To be verified |
| resend | email addresses, email content, uploaded files, file metadata | email | ⬜ To be verified |
| @google-cloud/kms | encryption keys, key metadata | other | ⬜ To be verified |
| @simplewebauthn/server | biometric authentication data, device attestation, credential IDs | auth | ⬜ To be verified |
| googleapis | user data via Google APIs, calendar data, email data, profile information | other | ⬜ To be verified |
| next-auth | email, name, profile picture, OAuth tokens, session data | auth | ⬜ To be verified |
| passport-microsoft | email, name, profile picture, OAuth tokens, session data, Microsoft profile data | auth | ⬜ To be verified |
| stripe | email, name, profile picture, OAuth tokens, session data, payment information, billing address, transaction history | payment | ⬜ To be verified |
| posthog | user behavior, session recordings, feature flag usage, device information | analytics | ⬜ To be verified |
| prisma | user data as defined in schema | database | ⬜ To be verified |

## 5. International Data Transfers

| Processor | Transfer Destination | Safeguard Mechanism | Status |
|-----------|---------------------|---------------------|--------|
| @ai-sdk/google-vertex | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| @vercel/ai | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| @aws-sdk/client-ses | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| nodemailer | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| resend | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| @google-cloud/kms | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| @simplewebauthn/server | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| googleapis | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| next-auth | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| passport-microsoft | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| stripe | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| posthog | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| prisma | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |

## 6. Retention Schedule

| Data Category | Retention Period | Deletion Method | Legal Basis for Retention |
|---------------|-----------------|-----------------|--------------------------|
| General | Per AI provider policy / 30 days | Automated purge + manual verification | Consent / Legitimate interest |
| Directly Identifiable | Duration of account + 30 days | Automated purge + manual verification | Contract performance / Consent |
| Special Category (Art. 9) | Duration of account + 30 days | Automated purge + manual verification | Contract performance (Art. 6(1)(b)) |
| Indirectly Identifiable | Duration of account + 30 days | Automated purge + manual verification | Contract performance (Art. 6(1)(b)) |
| Security Credential | Duration of account + 30 days | Automated purge + manual verification | Contract performance (Art. 6(1)(b)) |
| Financial | 7 years (tax/legal obligation) | Automated purge + manual verification | Contract performance (Art. 6(1)(b)) |

---

*This data mapping register is generated from automated code analysis and should be reviewed by your Data Protection Officer and legal team. It may not capture all data processing activities, particularly those conducted outside the scanned codebase. This does not constitute legal advice.*
