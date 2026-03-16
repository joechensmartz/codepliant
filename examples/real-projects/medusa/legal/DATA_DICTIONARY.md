# Data Dictionary

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** root

**Company:** [Your Company Name]

## Related Documents

- Data Flow Map (`DATA_FLOW_MAP.md`)
- Data Retention Policy (`DATA_RETENTION_POLICY.md`)
- Data Classification Report (`DATA_CLASSIFICATION.md`)

---

## 1. Purpose

This document catalogs every data field detected across the **root** application. It serves as the authoritative reference for data mapping required by GDPR Article 30 (Records of Processing Activities), SOC 2 (CC6.1), and internal data governance policies.

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
| payment_info | stripe | Financial — PCI | Critical | Do not store post-authorization; tokenize | Payment processing |
| billing address | stripe | Location | High | Until account deletion | Billing, shipping, localization |
| billing_address | stripe | Location | High | 7 years (tax/legal) | Billing |
| customer_email | stripe | Contact | High | Until account deletion + 30 days | Transaction receipts |
| email | stripe | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email addresses | @sendgrid/mail | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email content | @sendgrid/mail | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email_address | @sendgrid/mail | Contact | High | Until unsubscribe or account deletion | Email delivery |
| IP address | @segment/analytics-next | Location | High | Until account deletion | Billing, shipping, localization |
| transaction_history | stripe | Financial | High | 7 years (tax/legal) | Order records, refunds |
| conversation history | openai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| conversation_history | openai | AI Interaction | Medium | 30 days (logs); per vendor policy | Context continuity |
| email_content | @sendgrid/mail | Communication | Medium | 90 days (delivery logs) | Email delivery |
| ip_address | @segment/analytics-next | Technical | Medium | 90 days | Geolocation, fraud prevention |
| ip_address | posthog | Technical | Medium | 90 days | Geolocation, fraud prevention |
| page_views | @segment/analytics-next | Behavioral | Medium | 26 months | Product analytics |
| page_views | posthog | Behavioral | Medium | 26 months | Product analytics |
| session cookies | express-session | Session | Medium | Until session expiry | Session management |
| session data | express-session | Session | Medium | Until session expiry | Session management |
| session data | ioredis | Session | Medium | Until session expiry | Session management |
| session recordings | posthog | Session | Medium | Until session expiry | Session management |
| uploaded_files | @aws-sdk/client-s3 | User Content | Medium | Until user-initiated deletion | File storage |
| uploaded_files | Multer | User Content | Medium | Until user-initiated deletion | File storage |
| user prompts | openai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| user_behavior | @segment/analytics-next | Behavioral | Medium | 26 months | UX optimization |
| user_behavior | posthog | Behavioral | Medium | 26 months | UX optimization |
| user_data | ioredis | Application Data | Medium | Per data retention policy | Application functionality |
| user_prompts | openai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| AI Interaction Data | openai | Application Data | Low | Per data retention policy | Application functionality |
| cached data | ioredis | Application Data | Low | Per data retention policy | Application functionality |
| Communication Data | @sendgrid/mail | Application Data | Low | Per data retention policy | Application functionality |
| cookie data | cookie-parser | Application Data | Low | Per data retention policy | Application functionality |
| cookies | cookie-parser | Application Data | Low | Per data retention policy | Application functionality |
| custom events | @segment/analytics-next | Application Data | Low | Per data retention policy | Application functionality |
| device information | @segment/analytics-next | Application Data | Low | Per data retention policy | Application functionality |
| device information | posthog | Application Data | Low | Per data retention policy | Application functionality |
| device_info | @segment/analytics-next | Technical | Low | 26 months | Compatibility analytics |
| device_info | posthog | Technical | Low | 26 months | Compatibility analytics |
| feature flag usage | posthog | Application Data | Low | Per data retention policy | Application functionality |
| file metadata | @aws-sdk/client-s3 | Application Data | Low | Per data retention policy | Application functionality |
| file metadata | Multer | Application Data | Low | Per data retention policy | Application functionality |
| file_metadata | @aws-sdk/client-s3 | Metadata | Low | Until file deletion | File management |
| file_metadata | Multer | Metadata | Low | Until file deletion | File management |
| Financial Data | stripe | Application Data | Low | Per data retention policy | Application functionality |
| generated content | openai | Application Data | Low | Per data retention policy | Application functionality |
| generated_content | openai | AI Output | Low | Per user deletion request | AI feature delivery |
| page views | @segment/analytics-next | Application Data | Low | Per data retention policy | Application functionality |
| payment information | stripe | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | Product.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | ProductOption.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | ProductOptionValue.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | ProductVariant.name | Application Data | Low | Per data retention policy | Application functionality |
| potential PII in uploaded content | Multer | Application Data | Low | Per data retention policy | Application functionality |
| search queries | algoliasearch | Application Data | Low | Per data retention policy | Application functionality |
| search result clicks | algoliasearch | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | ioredis | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | Redis (Cache) | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | node-cache | Application Data | Low | Per data retention policy | Application functionality |
| transaction history | stripe | Application Data | Low | Per data retention policy | Application functionality |
| uploaded files | @aws-sdk/client-s3 | Application Data | Low | Per data retention policy | Application functionality |
| uploaded files | Multer | Application Data | Low | Per data retention policy | Application functionality |
| Usage & Behavioral Data | posthog | Application Data | Low | Per data retention policy | Application functionality |
| Usage & Behavioral Data | @segment/analytics-next | Application Data | Low | Per data retention policy | Application functionality |
| user behavior | @segment/analytics-next | Application Data | Low | Per data retention policy | Application functionality |
| user behavior | posthog | Application Data | Low | Per data retention policy | Application functionality |
| user identity | @segment/analytics-next | Application Data | Low | Per data retention policy | Application functionality |
| user search behavior | algoliasearch | Application Data | Low | Per data retention policy | Application functionality |
| User-Uploaded Content | Multer | Application Data | Low | Per data retention policy | Application functionality |
| User-Uploaded Content | @aws-sdk/client-s3 | Application Data | Low | Per data retention policy | Application functionality |

---

## 4. Sensitivity Summary

| Level | Count | Description |
|-------|-------|-------------|
| Critical | 1 | Credentials, government IDs, raw payment data — requires encryption at rest and strict access control |
| High | 9 | PII (names, emails, addresses) — requires encryption and consent |
| Medium | 18 | Behavioral data, session data, IP addresses — requires privacy notice |
| Low | 41 | Preferences, metadata, operational data — standard handling |

**Total fields cataloged:** 69

---

## 5. Cross-References

- **Database schema** — Fields detected from Prisma/ORM model definitions
- **Storage services** — @aws-sdk/client-s3, Multer
- **Analytics services** — @segment/analytics-next, posthog
- **Email services** — @sendgrid/mail
- **Other services** — algoliasearch, cookie-parser, express-session
- **Database services** — ioredis
- **Ai services** — openai
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