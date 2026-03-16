# Data Classification Report

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Project:** calcom-monorepo
**Company:** [Your Company Name]
**Generated:** 2026-03-16
**Classification Standard:** GDPR (General Data Protection Regulation)

## Related Documents

- Data Dictionary (`DATA_DICTIONARY.md`)
- Data Retention Policy (`DATA_RETENTION_POLICY.md`)
- Privacy Policy (`PRIVACY_POLICY.md`)

---

## Summary

| Sensitivity Level | Count | Description |
|-------------------|-------|-------------|
| Special Category (Art. 9) | 2 | Health, biometric, genetic, racial, political, religious, sexual orientation, trade union |
| High | 16 | Financial (PCI), government ID (SSN), authentication credentials |
| Medium | 21 | Contact info (email, phone), identity (name, DOB), location |
| Low | 75 | Behavioral (analytics), technical (IP, device info), preferences |

**Total classified fields:** 114

---

## Detailed Classification

| Field | Source | Sensitivity | GDPR Category | Retention |
|-------|--------|-------------|---------------|----------|
| stack traces | @sentry/nextjs | Special Category (Art. 9) | Racial/ethnic origin (Art. 9) | Delete when no longer necessary; max 1 year |
| Error reports, stack traces, performance data, and user context collected through monitoring tools. | @sentry/nextjs | Special Category (Art. 9) | Racial/ethnic origin (Art. 9) | Delete when no longer necessary; max 1 year |
| OAuth tokens | google-auth-library | High | Authentication credential | Until account deletion; rotate regularly |
| OAuth tokens | next-auth | High | Authentication credential | Until account deletion; rotate regularly |
| OAuth tokens | passport | High | Authentication credential | Until account deletion; rotate regularly |
| payment information | stripe | High | Financial — payment data | 7 years (tax/legal compliance) |
| billing address | stripe | High | Financial — payment data | 7 years (tax/legal compliance) |
| transaction history | stripe | High | Financial — payment data | 7 years (tax/legal compliance) |
| Email addresses, names, profile pictures, and account credentials collected through authentication. | next-auth | High | Authentication credential | Until account deletion; rotate regularly |
| Email addresses, names, profile pictures, and account credentials collected through authentication. | google-auth-library | High | Authentication credential | Until account deletion; rotate regularly |
| Email addresses, names, profile pictures, and account credentials collected through authentication. | passport | High | Authentication credential | Until account deletion; rotate regularly |
| Payment card information, billing addresses, and transaction history processed through payment providers. | stripe | High | Financial — payment data | 7 years (tax/legal compliance) |
| 20 API endpoint(s) accepting user data via MUTATION, QUERY requests. Data fields collected: autoOptIn, color, eventTypeIds, feature, featureId, includeSystemRolesOnly, isAll, name, permissions, roleId, routingFormId, slug, surveyId, teamId, userId. | packages/trpc/server/routers/features/_router.ts | High | Government identifier — tax | 7 years (tax compliance) |
| 20 API endpoint(s) accepting user data via MUTATION, QUERY requests. Data fields collected: autoOptIn, color, eventTypeIds, feature, featureId, includeSystemRolesOnly, isAll, name, permissions, roleId, routingFormId, slug, surveyId, teamId, userId. | packages/trpc/server/routers/viewer/eventTypes/_router.ts | High | Government identifier — tax | 7 years (tax compliance) |
| 20 API endpoint(s) accepting user data via MUTATION, QUERY requests. Data fields collected: autoOptIn, color, eventTypeIds, feature, featureId, includeSystemRolesOnly, isAll, name, permissions, roleId, routingFormId, slug, surveyId, teamId, userId. | packages/trpc/server/routers/viewer/featureOptIn/_router.ts | High | Government identifier — tax | 7 years (tax compliance) |
| 20 API endpoint(s) accepting user data via MUTATION, QUERY requests. Data fields collected: autoOptIn, color, eventTypeIds, feature, featureId, includeSystemRolesOnly, isAll, name, permissions, roleId, routingFormId, slug, surveyId, teamId, userId. | packages/trpc/server/routers/viewer/feedback/_router.ts | High | Government identifier — tax | 7 years (tax compliance) |
| 20 API endpoint(s) accepting user data via MUTATION, QUERY requests. Data fields collected: autoOptIn, color, eventTypeIds, feature, featureId, includeSystemRolesOnly, isAll, name, permissions, roleId, routingFormId, slug, surveyId, teamId, userId. | packages/trpc/server/routers/viewer/insights/_router.ts | High | Government identifier — tax | 7 years (tax compliance) |
| 20 API endpoint(s) accepting user data via MUTATION, QUERY requests. Data fields collected: autoOptIn, color, eventTypeIds, feature, featureId, includeSystemRolesOnly, isAll, name, permissions, roleId, routingFormId, slug, surveyId, teamId, userId. | packages/trpc/server/routers/viewer/pbac/_router.tsx | High | Government identifier — tax | 7 years (tax compliance) |
| email addresses | @hubspot/api-client | Medium | Contact — email | Until account deletion or consent withdrawal |
| phone numbers | @hubspot/api-client | Medium | Contact — phone | Until account deletion or consent withdrawal |
| email addresses | @sendgrid/mail | Medium | Contact — email | Until account deletion or consent withdrawal |
| email content | @sendgrid/mail | Medium | Contact — email | Until account deletion or consent withdrawal |
| location data | Google Analytics | Medium | Location data | 26 months max |
| email | google-auth-library | Medium | Contact — email | Until account deletion or consent withdrawal |
| email data | googleapis | Medium | Contact — email | Until account deletion or consent withdrawal |
| email | intercom | Medium | Contact — email | Until account deletion or consent withdrawal |
| name | intercom | Medium | Personal identity — name | Until account deletion |
| email | next-auth | Medium | Contact — email | Until account deletion or consent withdrawal |
| name | next-auth | Medium | Personal identity — name | Until account deletion |
| profile picture | next-auth | Medium | Personal identity — image | Until account deletion |
| email addresses | nodemailer | Medium | Contact — email | Until account deletion or consent withdrawal |
| email content | nodemailer | Medium | Contact — email | Until account deletion or consent withdrawal |
| email | passport | Medium | Contact — email | Until account deletion or consent withdrawal |
| name | passport | Medium | Personal identity — name | Until account deletion |
| email | stripe | Medium | Contact — email | Until account deletion or consent withdrawal |
| phone numbers | twilio | Medium | Contact — phone | Until account deletion or consent withdrawal |
| SMS message content | twilio | Medium | Contact — phone | Until account deletion or consent withdrawal |
| Email addresses and email content processed through email service providers. | nodemailer | Medium | Contact — email | Until account deletion or consent withdrawal |
| Email addresses and email content processed through email service providers. | @sendgrid/mail | Medium | Contact — email | Until account deletion or consent withdrawal |
| contact information | @hubspot/api-client | Low | Unclassified data | Review and define retention policy |
| names | @hubspot/api-client | Low | Unclassified data | Review and define retention policy |
| company data | @hubspot/api-client | Low | Unclassified data | Review and define retention policy |
| deal information | @hubspot/api-client | Low | Unclassified data | Review and define retention policy |
| engagement history | @hubspot/api-client | Low | Unclassified data | Review and define retention policy |
| error data | @sentry/nextjs | Low | Technical — diagnostics | 90 days |
| user context | @sentry/nextjs | Low | Unclassified data | Review and define retention policy |
| device information | @sentry/nextjs | Low | Technical — device/network | 90 days |
| IP address | @sentry/nextjs | Low | Technical — device/network | 90 days |
| performance profiles | @sentry/nextjs | Low | Technical — diagnostics | 90 days |
| cached data | @upstash/redis | Low | Unclassified data | Review and define retention policy |
| session data | @upstash/redis | Low | Behavioral — analytics | 26 months |
| page views | Google Analytics | Low | Behavioral — analytics | 26 months |
| user behavior | Google Analytics | Low | Behavioral — analytics | 26 months |
| device information | Google Analytics | Low | Technical — device/network | 90 days |
| IP address | Google Analytics | Low | Technical — device/network | 90 days |
| page views | Google Tag Manager | Low | Behavioral — analytics | 26 months |
| user behavior | Google Tag Manager | Low | Behavioral — analytics | 26 months |
| custom events | Google Tag Manager | Low | Unclassified data | Review and define retention policy |
| device information | Google Tag Manager | Low | Technical — device/network | 90 days |
| third-party tag data | Google Tag Manager | Low | Unclassified data | Review and define retention policy |
| Google profile data | google-auth-library | Low | Unclassified data | Review and define retention policy |
| user data via Google APIs | googleapis | Low | Unclassified data | Review and define retention policy |
| calendar data | googleapis | Low | Unclassified data | Review and define retention policy |
| profile information | googleapis | Low | Unclassified data | Review and define retention policy |
| user profiles | intercom | Low | Unclassified data | Review and define retention policy |
| conversations | intercom | Low | Unclassified data | Review and define retention policy |
| user behavior | intercom | Low | Behavioral — analytics | 26 months |
| company data | intercom | Low | Unclassified data | Review and define retention policy |
| cached data | ioredis | Low | Unclassified data | Review and define retention policy |
| session data | ioredis | Low | Behavioral — analytics | 26 months |
| session data | next-auth | Low | Behavioral — analytics | 26 months |
| session data | passport | Low | Behavioral — analytics | 26 months |
| page views | Plausible Analytics | Low | Behavioral — analytics | 26 months |
| referrer data | Plausible Analytics | Low | Behavioral — marketing | 26 months |
| device information | Plausible Analytics | Low | Technical — device/network | 90 days |
| application data | PostgreSQL | Low | Unclassified data | Review and define retention policy |
| user records | PostgreSQL | Low | Unclassified data | Review and define retention policy |
| application data | PostgreSQL (env) | Low | Unclassified data | Review and define retention policy |
| user records | PostgreSQL (env) | Low | Unclassified data | Review and define retention policy |
| user behavior | posthog | Low | Behavioral — analytics | 26 months |
| session recordings | posthog | Low | Behavioral — analytics | 26 months |
| feature flag usage | posthog | Low | Unclassified data | Review and define retention policy |
| device information | posthog | Low | Technical — device/network | 90 days |
| user data as defined in schema | prisma | Low | Unclassified data | Review and define retention policy |
| session data | Redis | Low | Behavioral — analytics | 26 months |
| cache data | Redis | Low | Unclassified data | Review and define retention policy |
| session data | Redis (env) | Low | Behavioral — analytics | 26 months |
| cache data | Redis (env) | Low | Unclassified data | Review and define retention policy |
| voice call metadata | twilio | Low | Unclassified data | Review and define retention policy |
| call recordings | twilio | Low | Unclassified data | Review and define retention policy |
| push subscription endpoints | web-push | Low | Unclassified data | Review and define retention policy |
| device tokens | web-push | Low | Unclassified data | Review and define retention policy |
| notification content | web-push | Low | Unclassified data | Review and define retention policy |
| Usage & Behavioral Data | posthog | Low | Behavioral — analytics | 26 months |
| Usage & Behavioral Data | Google Analytics | Low | Behavioral — analytics | 26 months |
| Usage & Behavioral Data | Google Tag Manager | Low | Behavioral — analytics | 26 months |
| Usage & Behavioral Data | Plausible Analytics | Low | Behavioral — analytics | 26 months |
| Stored User Data | ioredis | Low | Unclassified data | Review and define retention policy |
| Stored User Data | @upstash/redis | Low | Unclassified data | Review and define retention policy |
| Stored User Data | prisma | Low | Unclassified data | Review and define retention policy |
| Stored User Data | PostgreSQL (env) | Low | Unclassified data | Review and define retention policy |
| Stored User Data | Redis (env) | Low | Unclassified data | Review and define retention policy |
| Stored User Data | PostgreSQL | Low | Unclassified data | Review and define retention policy |
| Stored User Data | Redis | Low | Unclassified data | Review and define retention policy |
| Stored User Data | Redis (Cache) | Low | Unclassified data | Review and define retention policy |
| Stored User Data | lru-cache | Low | Unclassified data | Review and define retention policy |
| Stored User Data | @prisma/extension-accelerate | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | category:Personal Identity Data | Low | Unclassified data | Review and define retention policy |
| Financial Data | category:Financial Data | Low | Unclassified data | Review and define retention policy |
| Usage & Behavioral Data | category:Usage & Behavioral Data | Low | Behavioral — analytics | 26 months |
| Communication Data | category:Communication Data | Low | Unclassified data | Review and define retention policy |
| Technical & Diagnostic Data | category:Technical & Diagnostic Data | Low | Unclassified data | Review and define retention policy |
| Stored User Data | category:Stored User Data | Low | Unclassified data | Review and define retention policy |
| API Data Collection | category:API Data Collection | Low | Unclassified data | Review and define retention policy |


---

## Recommendations

### Special Category Data (Art. 9) — 2 field(s)

- **Explicit consent required** (Art. 9(2)(a)): Standard consent is not sufficient; obtain explicit, informed consent for each specific purpose
- **Data Protection Impact Assessment (DPIA)** required under Art. 35 before processing
- **Appoint a Data Protection Officer (DPO)** if processing special categories at scale
- **Encryption at rest and in transit** is mandatory; consider additional access controls
- **Minimize collection**: Only collect what is strictly necessary for the stated purpose
- **Audit logging**: Maintain detailed access logs for all special category data

### High Sensitivity Data — 16 field(s)

- **Encrypt at rest and in transit** using industry-standard algorithms (AES-256, TLS 1.2+)
- **Tokenize payment data** — never store raw card numbers (PCI DSS requirement)
- **Hash credentials** with bcrypt, scrypt, or Argon2; never store plaintext passwords
- **Limit access** to personnel with a business need; implement role-based access control
- **Retain per regulatory requirements** (e.g., 7 years for financial records)
- **Regular security audits** and penetration testing recommended

### Medium Sensitivity Data — 21 field(s)

- **Encrypt in transit** (TLS 1.2+); encrypt at rest where feasible
- **Obtain clear consent** before collection; provide opt-out mechanisms
- **Allow user access and deletion** per GDPR Art. 15-17 (right of access, rectification, erasure)
- **Pseudonymize** where possible to reduce risk
- **Define clear retention periods** and automate data deletion

### Low Sensitivity Data — 75 field(s)

- **Encrypt in transit** (TLS 1.2+)
- **Anonymize or aggregate** analytics data where possible
- **Honor Do Not Track / Global Privacy Control** signals
- **Set appropriate retention periods** (typically 90 days for logs, 26 months for analytics)
- **Disclose in privacy policy** even for low-sensitivity data

---

*This classification is auto-generated based on code analysis. It should be reviewed by your legal and security teams. Data classification may change as your application evolves — re-run this scan regularly.*
