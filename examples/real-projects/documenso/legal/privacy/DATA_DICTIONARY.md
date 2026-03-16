# Data Dictionary

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** @documenso/root

**Company:** [Your Company Name]

## Related Documents

- Data Flow Map (`DATA_FLOW_MAP.md`)
- Data Retention Policy (`DATA_RETENTION_POLICY.md`)
- Data Classification Report (`DATA_CLASSIFICATION.md`)

---

## 1. Purpose

This document catalogs every data field detected across the **@documenso/root** application. It serves as the authoritative reference for data mapping required by GDPR Article 30 (Records of Processing Activities), SOC 2 (CC6.1), and internal data governance policies.

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
| api_credential | env: NEXT_PRIVATE_RESEND_API_KEY=*** | Infrastructure | Critical | Rotate regularly | Service authentication |
| credential IDs | @simplewebauthn/server | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| password_hash | @simplewebauthn/server | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| password_hash | next-auth | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| password_hash | passport-microsoft | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| payment_info | stripe | Financial — PCI | Critical | Do not store post-authorization; tokenize | Payment processing |
| billing address | stripe | Location | High | Until account deletion | Billing, shipping, localization |
| billing_address | stripe | Location | High | 7 years (tax/legal) | Billing |
| biometric authentication data | @simplewebauthn/server | Biometric | High | Delete when no longer necessary; max 1 year | Authentication |
| customer_email | stripe | Contact | High | Until account deletion + 30 days | Transaction receipts |
| email | @simplewebauthn/server | Contact | High | Until account deletion + 30 days | Account identification |
| email | next-auth | Contact | High | Until account deletion + 30 days | Account identification |
| email | passport-microsoft | Contact | High | Until account deletion + 30 days | Account identification |
| email | stripe | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email addresses | @aws-sdk/client-ses | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email addresses | nodemailer | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email addresses | resend | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email content | @aws-sdk/client-ses | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email content | nodemailer | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email content | resend | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email data | googleapis | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email_address | @aws-sdk/client-ses | Contact | High | Until unsubscribe or account deletion | Email delivery |
| email_address | nodemailer | Contact | High | Until unsubscribe or account deletion | Email delivery |
| email_address | resend | Contact | High | Until unsubscribe or account deletion | Email delivery |
| email_config | env: NEXT_PRIVATE_SMTP_HOST=*** | Infrastructure | High | Until service change | Email delivery configuration |
| name | next-auth | Personal Identity | High | Until account deletion + 30 days | User identification |
| name | passport-microsoft | Personal Identity | High | Until account deletion + 30 days | User identification |
| transaction_history | stripe | Financial | High | 7 years (tax/legal) | Order records, refunds |
| conversation history | @ai-sdk/google-vertex | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| conversation history | @vercel/ai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| conversation_history | @ai-sdk/google-vertex | AI Interaction | Medium | 30 days (logs); per vendor policy | Context continuity |
| conversation_history | @vercel/ai | AI Interaction | Medium | 30 days (logs); per vendor policy | Context continuity |
| email_content | @aws-sdk/client-ses | Communication | Medium | 90 days (delivery logs) | Email delivery |
| email_content | nodemailer | Communication | Medium | 90 days (delivery logs) | Email delivery |
| email_content | resend | Communication | Medium | 90 days (delivery logs) | Email delivery |
| ip_address | posthog | Technical | Medium | 90 days | Geolocation, fraud prevention |
| OAuth tokens | next-auth | Session | Medium | Until session expiry | Session management |
| OAuth tokens | passport-microsoft | Session | Medium | Until session expiry | Session management |
| oauth_token | @simplewebauthn/server | Authentication | Medium | Until session expiry or revocation | Third-party authentication |
| oauth_token | next-auth | Authentication | Medium | Until session expiry or revocation | Third-party authentication |
| oauth_token | passport-microsoft | Authentication | Medium | Until session expiry or revocation | Third-party authentication |
| page_views | posthog | Behavioral | Medium | 26 months | Product analytics |
| session data | next-auth | Session | Medium | Until session expiry | Session management |
| session recordings | posthog | Session | Medium | Until session expiry | Session management |
| session_token | @simplewebauthn/server | Session | Medium | Until session expiry | Session management |
| session_token | next-auth | Session | Medium | Until session expiry | Session management |
| session_token | passport-microsoft | Session | Medium | Until session expiry | Session management |
| user prompts | @ai-sdk/google-vertex | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| user prompts | @vercel/ai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| user_behavior | posthog | Behavioral | Medium | 26 months | UX optimization |
| user_data | prisma | Application Data | Medium | Per data retention policy | Application functionality |
| user_prompts | @ai-sdk/google-vertex | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| user_prompts | @vercel/ai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| AI Interaction Data | @ai-sdk/google-vertex | Application Data | Low | Per data retention policy | Application functionality |
| AI Interaction Data | @vercel/ai | Application Data | Low | Per data retention policy | Application functionality |
| calendar data | googleapis | Application Data | Low | Per data retention policy | Application functionality |
| Communication Data | nodemailer | Application Data | Low | Per data retention policy | Application functionality |
| Communication Data | @aws-sdk/client-ses | Application Data | Low | Per data retention policy | Application functionality |
| Communication Data | resend | Application Data | Low | Per data retention policy | Application functionality |
| device attestation | @simplewebauthn/server | Application Data | Low | Per data retention policy | Application functionality |
| device information | posthog | Application Data | Low | Per data retention policy | Application functionality |
| device_info | posthog | Technical | Low | 26 months | Compatibility analytics |
| encryption keys | @google-cloud/kms | Application Data | Low | Per data retention policy | Application functionality |
| feature flag usage | posthog | Application Data | Low | Per data retention policy | Application functionality |
| file metadata | @aws-sdk/client-ses | Application Data | Low | Per data retention policy | Application functionality |
| Financial Data | stripe | Application Data | Low | Per data retention policy | Application functionality |
| generated content | @ai-sdk/google-vertex | Application Data | Low | Per data retention policy | Application functionality |
| generated content | @vercel/ai | Application Data | Low | Per data retention policy | Application functionality |
| generated_content | @ai-sdk/google-vertex | AI Output | Low | Per user deletion request | AI feature delivery |
| generated_content | @vercel/ai | AI Output | Low | Per user deletion request | AI feature delivery |
| key metadata | @google-cloud/kms | Application Data | Low | Per data retention policy | Application functionality |
| Microsoft profile data | passport-microsoft | Application Data | Low | Per data retention policy | Application functionality |
| payment information | stripe | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | @simplewebauthn/server | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | next-auth | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | passport-microsoft | Application Data | Low | Per data retention policy | Application functionality |
| profile information | googleapis | Application Data | Low | Per data retention policy | Application functionality |
| profile picture | next-auth | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | prisma | Application Data | Low | Per data retention policy | Application functionality |
| transaction history | stripe | Application Data | Low | Per data retention policy | Application functionality |
| uploaded files | @aws-sdk/client-ses | Application Data | Low | Per data retention policy | Application functionality |
| Usage & Behavioral Data | posthog | Application Data | Low | Per data retention policy | Application functionality |
| user behavior | posthog | Application Data | Low | Per data retention policy | Application functionality |
| user data as defined in schema | prisma | Application Data | Low | Per data retention policy | Application functionality |
| user data via Google APIs | googleapis | Application Data | Low | Per data retention policy | Application functionality |

---

## 4. Sensitivity Summary

| Level | Count | Description |
|-------|-------|-------------|
| Critical | 6 | Credentials, government IDs, raw payment data — requires encryption at rest and strict access control |
| High | 22 | PII (names, emails, addresses) — requires encryption and consent |
| Medium | 25 | Behavioral data, session data, IP addresses — requires privacy notice |
| Low | 32 | Preferences, metadata, operational data — standard handling |

**Total fields cataloged:** 85

---

## 5. Cross-References

- **Environment variables** — Service credentials and connection strings
- **Ai services** — @ai-sdk/google-vertex, @vercel/ai
- **Email services** — @aws-sdk/client-ses, nodemailer, resend
- **Other services** — @google-cloud/kms, googleapis
- **Auth services** — @simplewebauthn/server, next-auth, passport-microsoft
- **Analytics services** — posthog
- **Database services** — prisma
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