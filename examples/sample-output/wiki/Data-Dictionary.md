> **Document Version:** 1.0  
> **Document Owner:** Acme Inc  
> **Next Review Date:** 2027-03-18


**Last updated:** 2026-03-18

**Project:** nextjs-saas-example

**Company:** Acme Inc

## Related Documents

- Data Flow Map (`DATA_FLOW_MAP.md`)
- Data Retention Policy (`DATA_RETENTION_POLICY.md`)
- Data Classification Report (`DATA_CLASSIFICATION.md`)

---

## 1. Purpose

This document catalogs every data field detected across the **nextjs-saas-example** application. It serves as the authoritative reference for data mapping required by GDPR Article 30 (Records of Processing Activities), SOC 2 (CC6.1), and internal data governance policies.

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
| api_credential | env: OPENAI_API_KEY=*** | Infrastructure | Critical | Rotate regularly | Service authentication |
| api_credential | env: RESEND_API_KEY=*** | Infrastructure | Critical | Rotate regularly | Service authentication |
| api_credential | env: STRIPE_SECRET_KEY=*** | Infrastructure | Critical | Rotate regularly | Service authentication |
| password hash | @supabase/supabase-js | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| password_hash | @supabase/supabase-js | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| payment_info | stripe | Financial — PCI | Critical | Do not store post-authorization; tokenize | Payment processing |
| payment_info | stripe-ios | Financial — PCI | Critical | Do not store post-authorization; tokenize | Payment processing |
| billing address | stripe | Location | High | Until account deletion | Billing, shipping, localization |
| billing address | stripe-ios | Location | High | Until account deletion | Billing, shipping, localization |
| billing_address | stripe | Location | High | 7 years (tax/legal) | Billing |
| billing_address | stripe-ios | Location | High | 7 years (tax/legal) | Billing |
| customer_email | stripe | Contact | High | Until account deletion + 30 days | Transaction receipts |
| customer_email | stripe-ios | Contact | High | Until account deletion + 30 days | Transaction receipts |
| email | @supabase/supabase-js | Contact | High | Until account deletion + 30 days | Account identification |
| email | stripe | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email | stripe-ios | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email addresses | resend | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email content | resend | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email_address | resend | Contact | High | Until unsubscribe or account deletion | Email delivery |
| IP address | @sentry/node | Location | High | Until account deletion | Billing, shipping, localization |
| transaction_history | stripe | Financial | High | 7 years (tax/legal) | Order records, refunds |
| transaction_history | stripe-ios | Financial | High | 7 years (tax/legal) | Order records, refunds |
| conversation history | openai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| conversation_history | openai | AI Interaction | Medium | 30 days (logs); per vendor policy | Context continuity |
| email_content | resend | Communication | Medium | 90 days (delivery logs) | Email delivery |
| error_tracking_config | env: SENTRY_DSN=*** | Infrastructure | Medium | Until service change | Error monitoring |
| ip_address | @sentry/node | Technical | Medium | 30 days | Error context |
| ip_address | posthog | Technical | Medium | 90 days | Geolocation, fraud prevention |
| oauth_token | @supabase/supabase-js | Authentication | Medium | Until session expiry or revocation | Third-party authentication |
| page_views | posthog | Behavioral | Medium | 26 months | Product analytics |
| session data | @supabase/supabase-js | Session | Medium | Until session expiry | Session management |
| session recordings | posthog | Session | Medium | Until session expiry | Session management |
| session_token | @supabase/supabase-js | Session | Medium | Until session expiry | Session management |
| user prompts | openai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| user_behavior | posthog | Behavioral | Medium | 26 months | UX optimization |
| user_context | @sentry/node | Technical | Medium | 30 days | Error context |
| user_data | prisma | Application Data | Medium | Per data retention policy | Application functionality |
| user_prompts | openai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| AI Interaction Data | openai | Application Data | Low | Per data retention policy | Application functionality |
| Authentication Data | User.passwordHash | Application Data | Low | Per data retention policy | Application functionality |
| Communication Data | resend | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | User.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | User.phone | Application Data | Low | Per data retention policy | Application functionality |
| device information | @sentry/node | Application Data | Low | Per data retention policy | Application functionality |
| device information | posthog | Application Data | Low | Per data retention policy | Application functionality |
| device_info | posthog | Technical | Low | 26 months | Compatibility analytics |
| error data | @sentry/node | Application Data | Low | Per data retention policy | Application functionality |
| error_data | @sentry/node | Technical | Low | 30 days | Error tracking |
| feature flag usage | posthog | Application Data | Low | Per data retention policy | Application functionality |
| Financial Data | stripe | Application Data | Low | Per data retention policy | Application functionality |
| Financial Data | stripe-ios | Application Data | Low | Per data retention policy | Application functionality |
| generated content | openai | Application Data | Low | Per data retention policy | Application functionality |
| generated_content | openai | AI Output | Low | Per user deletion request | AI feature delivery |
| payment information | stripe | Application Data | Low | Per data retention policy | Application functionality |
| payment information | stripe-ios | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | @supabase/supabase-js | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | User.name | Application Data | Low | Per data retention policy | Application functionality |
| stack traces | @sentry/node | Application Data | Low | Per data retention policy | Application functionality |
| stack_traces | @sentry/node | Technical | Low | 30 days | Debugging |
| Stored User Data | prisma | Application Data | Low | Per data retention policy | Application functionality |
| Technical & Diagnostic Data | @sentry/node | Application Data | Low | Per data retention policy | Application functionality |
| transaction history | stripe | Application Data | Low | Per data retention policy | Application functionality |
| transaction history | stripe-ios | Application Data | Low | Per data retention policy | Application functionality |
| Usage & Behavioral Data | posthog | Application Data | Low | Per data retention policy | Application functionality |
| user behavior | posthog | Application Data | Low | Per data retention policy | Application functionality |
| user context | @sentry/node | Application Data | Low | Per data retention policy | Application functionality |
| user data as defined in schema | prisma | Application Data | Low | Per data retention policy | Application functionality |
| user metadata | @supabase/supabase-js | Application Data | Low | Per data retention policy | Application functionality |

---

## 4. Sensitivity Summary

| Level | Count | Description |
|-------|-------|-------------|
| Critical | 7 | Credentials, government IDs, raw payment data — requires encryption at rest and strict access control |
| High | 15 | PII (names, emails, addresses) — requires encryption and consent |
| Medium | 16 | Behavioral data, session data, IP addresses — requires privacy notice |
| Low | 30 | Preferences, metadata, operational data — standard handling |

**Total fields cataloged:** 68

---

## 5. Cross-References

- **Database schema** — Fields detected from Prisma/ORM model definitions
- **Environment variables** — Service credentials and connection strings
- **Monitoring services** — @sentry/node
- **Auth services** — @supabase/supabase-js
- **Ai services** — openai
- **Analytics services** — posthog
- **Database services** — prisma
- **Email services** — resend
- **Payment services** — stripe, stripe-ios

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

For questions about this data dictionary, contact legal@acme.com.

---

*This Data Dictionary was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Review and verify all entries for accuracy. This document does not constitute legal advice.*