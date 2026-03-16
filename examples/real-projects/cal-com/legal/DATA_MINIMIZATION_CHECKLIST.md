# Data Minimization Checklist

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Company:** [Your Company Name]
**Last updated:** 2026-03-16
**Project:** calcom-monorepo

---

## 1. Purpose

This checklist implements the **data minimization principle** under GDPR Article 5(1)(c):

> *"Personal data shall be adequate, relevant and limited to what is necessary in relation to the purposes for which they are processed."*

For each detected service, this document identifies what data is collected, whether it is actually needed, and provides actionable recommendations for reducing unnecessary data collection.

> **Disclaimer:** This is not legal advice. Consult qualified legal counsel and your Data Protection Officer to confirm data processing activities are lawful and necessary.

## 2. Per-Service Data Analysis


### @hubspot/api-client (Other)

**Declared data collection:** contact information, email addresses, names, phone numbers, company data, deal information, engagement history

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| contact information | Review needed | Detected via scan | Assess whether this data is necessary for @hubspot/api-client functionality |
| email addresses | Review needed | Detected via scan | Assess whether this data is necessary for @hubspot/api-client functionality |
| names | Review needed | Detected via scan | Assess whether this data is necessary for @hubspot/api-client functionality |
| phone numbers | Review needed | Detected via scan | Assess whether this data is necessary for @hubspot/api-client functionality |
| company data | Review needed | Detected via scan | Assess whether this data is necessary for @hubspot/api-client functionality |
| deal information | Review needed | Detected via scan | Assess whether this data is necessary for @hubspot/api-client functionality |
| engagement history | Review needed | Detected via scan | Assess whether this data is necessary for @hubspot/api-client functionality |



### @sendgrid/mail (Email)

**Declared data collection:** email addresses, email content

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| email_address | Yes | Email delivery | Remove from lists on unsubscribe; honor deletion requests |
| email_content | **No** | Delivery logs | Do not retain email body after delivery confirmation; delete logs after 90 days |
| open_tracking | **No** | Marketing metrics | Consider removing tracking pixels; they are not essential and raise privacy concerns |
| email addresses | Review needed | Detected via scan | Assess whether this data is necessary for @sendgrid/mail functionality |
| email content | Review needed | Detected via scan | Assess whether this data is necessary for @sendgrid/mail functionality |



### @sentry/nextjs (Monitoring)

**Declared data collection:** error data, stack traces, user context, device information, IP address, performance profiles

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| error_data | Yes | Error tracking and debugging | Strip PII from error reports before sending to monitoring service |
| stack_traces | Yes | Debugging | Ensure no sensitive data (passwords, tokens) appears in stack traces |
| user_context | **No** | Error context for debugging | Use anonymized user IDs; do not send full user profiles |
| ip_address | **No** | Error context | Truncate or hash IP addresses in error reports |
| error data | Review needed | Detected via scan | Assess whether this data is necessary for @sentry/nextjs functionality |
| stack traces | Review needed | Detected via scan | Assess whether this data is necessary for @sentry/nextjs functionality |
| user context | Review needed | Detected via scan | Assess whether this data is necessary for @sentry/nextjs functionality |
| device information | Review needed | Detected via scan | Assess whether this data is necessary for @sentry/nextjs functionality |
| IP address | Review needed | Detected via scan | Assess whether this data is necessary for @sentry/nextjs functionality |
| performance profiles | Review needed | Detected via scan | Assess whether this data is necessary for @sentry/nextjs functionality |



### @upstash/redis (Database)

**Declared data collection:** cached data, session data

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| user_data | Yes | Core application functionality | Audit each field — only store what the application actually uses |
| cached data | Review needed | Detected via scan | Assess whether this data is necessary for @upstash/redis functionality |
| session data | Review needed | Detected via scan | Assess whether this data is necessary for @upstash/redis functionality |



### Google Analytics (Analytics)

**Declared data collection:** page views, user behavior, device information, IP address, location data

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| page_views | **No** | Product analytics — useful but not essential for service delivery | Use privacy-preserving analytics (e.g., aggregate counts); limit retention to 26 months |
| user_behavior | **No** | UX optimization — not essential for core service | Anonymize user identifiers; consider server-side analytics |
| device_info | **No** | Compatibility analytics | Collect browser/OS only; do not fingerprint devices |
| ip_address | **No** | Geolocation and fraud prevention | Truncate IP addresses (last octet); delete raw IPs after 90 days |
| page views | Review needed | Detected via scan | Assess whether this data is necessary for Google Analytics functionality |
| user behavior | Review needed | Detected via scan | Assess whether this data is necessary for Google Analytics functionality |
| device information | Review needed | Detected via scan | Assess whether this data is necessary for Google Analytics functionality |
| IP address | Review needed | Detected via scan | Assess whether this data is necessary for Google Analytics functionality |
| location data | Review needed | Detected via scan | Assess whether this data is necessary for Google Analytics functionality |



### Google Tag Manager (Analytics)

**Declared data collection:** page views, user behavior, custom events, device information, third-party tag data

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| page_views | **No** | Product analytics — useful but not essential for service delivery | Use privacy-preserving analytics (e.g., aggregate counts); limit retention to 26 months |
| user_behavior | **No** | UX optimization — not essential for core service | Anonymize user identifiers; consider server-side analytics |
| device_info | **No** | Compatibility analytics | Collect browser/OS only; do not fingerprint devices |
| ip_address | **No** | Geolocation and fraud prevention | Truncate IP addresses (last octet); delete raw IPs after 90 days |
| page views | Review needed | Detected via scan | Assess whether this data is necessary for Google Tag Manager functionality |
| user behavior | Review needed | Detected via scan | Assess whether this data is necessary for Google Tag Manager functionality |
| custom events | Review needed | Detected via scan | Assess whether this data is necessary for Google Tag Manager functionality |
| device information | Review needed | Detected via scan | Assess whether this data is necessary for Google Tag Manager functionality |
| third-party tag data | Review needed | Detected via scan | Assess whether this data is necessary for Google Tag Manager functionality |



### google-auth-library (Auth)

**Declared data collection:** OAuth tokens, Google profile data, email

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| email | Yes | Account identification and communication | Essential — ensure proper encryption at rest |
| password_hash | Yes | User authentication | Use strong hashing (bcrypt/argon2); never store plaintext |
| session_token | Yes | Session management | Short-lived tokens; auto-expire and rotate |
| login_history | **No** | Security auditing | Retain for 90 days max; anonymize after |
| oauth_token | Yes | Third-party authentication | Store securely; revoke on account deletion |
| OAuth tokens | Review needed | Detected via scan | Assess whether this data is necessary for google-auth-library functionality |
| Google profile data | Review needed | Detected via scan | Assess whether this data is necessary for google-auth-library functionality |



### googleapis (Other)

**Declared data collection:** user data via Google APIs, calendar data, email data, profile information

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| user data via Google APIs | Review needed | Detected via scan | Assess whether this data is necessary for googleapis functionality |
| calendar data | Review needed | Detected via scan | Assess whether this data is necessary for googleapis functionality |
| email data | Review needed | Detected via scan | Assess whether this data is necessary for googleapis functionality |
| profile information | Review needed | Detected via scan | Assess whether this data is necessary for googleapis functionality |



### intercom (Other)

**Declared data collection:** user profiles, email, name, conversations, user behavior, company data

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| user profiles | Review needed | Detected via scan | Assess whether this data is necessary for intercom functionality |
| email | Review needed | Detected via scan | Assess whether this data is necessary for intercom functionality |
| name | Review needed | Detected via scan | Assess whether this data is necessary for intercom functionality |
| conversations | Review needed | Detected via scan | Assess whether this data is necessary for intercom functionality |
| user behavior | Review needed | Detected via scan | Assess whether this data is necessary for intercom functionality |
| company data | Review needed | Detected via scan | Assess whether this data is necessary for intercom functionality |



### ioredis (Database)

**Declared data collection:** cached data, session data

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| user_data | Yes | Core application functionality | Audit each field — only store what the application actually uses |
| cached data | Review needed | Detected via scan | Assess whether this data is necessary for ioredis functionality |
| session data | Review needed | Detected via scan | Assess whether this data is necessary for ioredis functionality |



### next-auth (Auth)

**Declared data collection:** email, name, profile picture, OAuth tokens, session data

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| email | Yes | Account identification and communication | Essential — ensure proper encryption at rest |
| password_hash | Yes | User authentication | Use strong hashing (bcrypt/argon2); never store plaintext |
| session_token | Yes | Session management | Short-lived tokens; auto-expire and rotate |
| login_history | **No** | Security auditing | Retain for 90 days max; anonymize after |
| oauth_token | Yes | Third-party authentication | Store securely; revoke on account deletion |
| name | Review needed | Detected via scan | Assess whether this data is necessary for next-auth functionality |
| profile picture | Review needed | Detected via scan | Assess whether this data is necessary for next-auth functionality |
| OAuth tokens | Review needed | Detected via scan | Assess whether this data is necessary for next-auth functionality |
| session data | Review needed | Detected via scan | Assess whether this data is necessary for next-auth functionality |



### nodemailer (Email)

**Declared data collection:** email addresses, email content

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| email_address | Yes | Email delivery | Remove from lists on unsubscribe; honor deletion requests |
| email_content | **No** | Delivery logs | Do not retain email body after delivery confirmation; delete logs after 90 days |
| open_tracking | **No** | Marketing metrics | Consider removing tracking pixels; they are not essential and raise privacy concerns |
| email addresses | Review needed | Detected via scan | Assess whether this data is necessary for nodemailer functionality |
| email content | Review needed | Detected via scan | Assess whether this data is necessary for nodemailer functionality |



### passport (Auth)

**Declared data collection:** email, name, OAuth tokens, session data

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| email | Yes | Account identification and communication | Essential — ensure proper encryption at rest |
| password_hash | Yes | User authentication | Use strong hashing (bcrypt/argon2); never store plaintext |
| session_token | Yes | Session management | Short-lived tokens; auto-expire and rotate |
| login_history | **No** | Security auditing | Retain for 90 days max; anonymize after |
| oauth_token | Yes | Third-party authentication | Store securely; revoke on account deletion |
| name | Review needed | Detected via scan | Assess whether this data is necessary for passport functionality |
| OAuth tokens | Review needed | Detected via scan | Assess whether this data is necessary for passport functionality |
| session data | Review needed | Detected via scan | Assess whether this data is necessary for passport functionality |



### Plausible Analytics (Analytics)

**Declared data collection:** page views, referrer data, device information

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| page_views | **No** | Product analytics — useful but not essential for service delivery | Use privacy-preserving analytics (e.g., aggregate counts); limit retention to 26 months |
| user_behavior | **No** | UX optimization — not essential for core service | Anonymize user identifiers; consider server-side analytics |
| device_info | **No** | Compatibility analytics | Collect browser/OS only; do not fingerprint devices |
| ip_address | **No** | Geolocation and fraud prevention | Truncate IP addresses (last octet); delete raw IPs after 90 days |
| page views | Review needed | Detected via scan | Assess whether this data is necessary for Plausible Analytics functionality |
| referrer data | Review needed | Detected via scan | Assess whether this data is necessary for Plausible Analytics functionality |
| device information | Review needed | Detected via scan | Assess whether this data is necessary for Plausible Analytics functionality |



### PostgreSQL (Database)

**Declared data collection:** application data, user records

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| user_data | Yes | Core application functionality | Audit each field — only store what the application actually uses |
| application data | Review needed | Detected via scan | Assess whether this data is necessary for PostgreSQL functionality |
| user records | Review needed | Detected via scan | Assess whether this data is necessary for PostgreSQL functionality |



### PostgreSQL (env) (Database)

**Declared data collection:** application data, user records

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| user_data | Yes | Core application functionality | Audit each field — only store what the application actually uses |
| application data | Review needed | Detected via scan | Assess whether this data is necessary for PostgreSQL (env) functionality |
| user records | Review needed | Detected via scan | Assess whether this data is necessary for PostgreSQL (env) functionality |



### posthog (Analytics)

**Declared data collection:** user behavior, session recordings, feature flag usage, device information

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| page_views | **No** | Product analytics — useful but not essential for service delivery | Use privacy-preserving analytics (e.g., aggregate counts); limit retention to 26 months |
| user_behavior | **No** | UX optimization — not essential for core service | Anonymize user identifiers; consider server-side analytics |
| device_info | **No** | Compatibility analytics | Collect browser/OS only; do not fingerprint devices |
| ip_address | **No** | Geolocation and fraud prevention | Truncate IP addresses (last octet); delete raw IPs after 90 days |
| user behavior | Review needed | Detected via scan | Assess whether this data is necessary for posthog functionality |
| session recordings | Review needed | Detected via scan | Assess whether this data is necessary for posthog functionality |
| feature flag usage | Review needed | Detected via scan | Assess whether this data is necessary for posthog functionality |
| device information | Review needed | Detected via scan | Assess whether this data is necessary for posthog functionality |



### prisma (Database)

**Declared data collection:** user data as defined in schema

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| user_data | Yes | Core application functionality | Audit each field — only store what the application actually uses |
| user data as defined in schema | Review needed | Detected via scan | Assess whether this data is necessary for prisma functionality |



### Redis (Database)

**Declared data collection:** session data, cache data

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| user_data | Yes | Core application functionality | Audit each field — only store what the application actually uses |
| session data | Review needed | Detected via scan | Assess whether this data is necessary for Redis functionality |
| cache data | Review needed | Detected via scan | Assess whether this data is necessary for Redis functionality |



### Redis (env) (Database)

**Declared data collection:** session data, cache data

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| user_data | Yes | Core application functionality | Audit each field — only store what the application actually uses |
| session data | Review needed | Detected via scan | Assess whether this data is necessary for Redis (env) functionality |
| cache data | Review needed | Detected via scan | Assess whether this data is necessary for Redis (env) functionality |



### stripe (Payment)

**Declared data collection:** payment information, billing address, email, transaction history

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| payment_info | Yes | Required for payment processing | Tokenize via payment processor; never store raw card data |
| billing_address | Yes | Required for tax/invoicing | Collect only what is required by tax jurisdiction |
| transaction_history | Yes | Legal/tax retention requirement | Enforce 7-year retention limit; auto-delete after |
| customer_email | Yes | Transaction receipts | Use for transactional email only; do not repurpose for marketing without consent |
| payment information | Review needed | Detected via scan | Assess whether this data is necessary for stripe functionality |
| billing address | Review needed | Detected via scan | Assess whether this data is necessary for stripe functionality |
| email | Review needed | Detected via scan | Assess whether this data is necessary for stripe functionality |
| transaction history | Review needed | Detected via scan | Assess whether this data is necessary for stripe functionality |



### twilio (Other)

**Declared data collection:** phone numbers, SMS message content, voice call metadata, call recordings

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| phone numbers | Review needed | Detected via scan | Assess whether this data is necessary for twilio functionality |
| SMS message content | Review needed | Detected via scan | Assess whether this data is necessary for twilio functionality |
| voice call metadata | Review needed | Detected via scan | Assess whether this data is necessary for twilio functionality |
| call recordings | Review needed | Detected via scan | Assess whether this data is necessary for twilio functionality |



### web-push (Other)

**Declared data collection:** push subscription endpoints, device tokens, notification content

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| push subscription endpoints | Review needed | Detected via scan | Assess whether this data is necessary for web-push functionality |
| device tokens | Review needed | Detected via scan | Assess whether this data is necessary for web-push functionality |
| notification content | Review needed | Detected via scan | Assess whether this data is necessary for web-push functionality |



## 3. Data Reduction Opportunities

The following 25 data field(s) are collected but **may not be necessary** for core service delivery:

| # | Data Field | Service | Recommendation |
|---|-----------|---------|----------------|
| 1 | email_content | @sendgrid/mail | Do not retain email body after delivery confirmation; delete logs after 90 days |
| 2 | open_tracking | @sendgrid/mail | Consider removing tracking pixels; they are not essential and raise privacy concerns |
| 3 | user_context | @sentry/nextjs | Use anonymized user IDs; do not send full user profiles |
| 4 | ip_address | @sentry/nextjs | Truncate or hash IP addresses in error reports |
| 5 | page_views | Google Analytics | Use privacy-preserving analytics (e.g., aggregate counts); limit retention to 26 months |
| 6 | user_behavior | Google Analytics | Anonymize user identifiers; consider server-side analytics |
| 7 | device_info | Google Analytics | Collect browser/OS only; do not fingerprint devices |
| 8 | ip_address | Google Analytics | Truncate IP addresses (last octet); delete raw IPs after 90 days |
| 9 | page_views | Google Tag Manager | Use privacy-preserving analytics (e.g., aggregate counts); limit retention to 26 months |
| 10 | user_behavior | Google Tag Manager | Anonymize user identifiers; consider server-side analytics |
| 11 | device_info | Google Tag Manager | Collect browser/OS only; do not fingerprint devices |
| 12 | ip_address | Google Tag Manager | Truncate IP addresses (last octet); delete raw IPs after 90 days |
| 13 | login_history | google-auth-library | Retain for 90 days max; anonymize after |
| 14 | login_history | next-auth | Retain for 90 days max; anonymize after |
| 15 | email_content | nodemailer | Do not retain email body after delivery confirmation; delete logs after 90 days |
| 16 | open_tracking | nodemailer | Consider removing tracking pixels; they are not essential and raise privacy concerns |
| 17 | login_history | passport | Retain for 90 days max; anonymize after |
| 18 | page_views | Plausible Analytics | Use privacy-preserving analytics (e.g., aggregate counts); limit retention to 26 months |
| 19 | user_behavior | Plausible Analytics | Anonymize user identifiers; consider server-side analytics |
| 20 | device_info | Plausible Analytics | Collect browser/OS only; do not fingerprint devices |
| 21 | ip_address | Plausible Analytics | Truncate IP addresses (last octet); delete raw IPs after 90 days |
| 22 | page_views | posthog | Use privacy-preserving analytics (e.g., aggregate counts); limit retention to 26 months |
| 23 | user_behavior | posthog | Anonymize user identifiers; consider server-side analytics |
| 24 | device_info | posthog | Collect browser/OS only; do not fingerprint devices |
| 25 | ip_address | posthog | Truncate IP addresses (last octet); delete raw IPs after 90 days |

> **Action required:** For each item above, determine whether (a) the data can be eliminated entirely, (b) the data can be anonymized or aggregated, or (c) there is a legitimate business justification that should be documented.


## 4. Summary

| Metric | Value |
|--------|-------|
| Services analyzed | 23 |
| Total data fields assessed | 129 |
| Fields likely needed | 104 |
| Fields potentially unnecessary | 25 |
| Potential data reduction | 19% |


## 5. GDPR Article 5(1)(c) Compliance Checklist

Use this checklist to verify your data minimization posture:

- [ ] All collected data has a documented, specific purpose
- [ ] No data is collected "just in case" or for future undefined use
- [ ] Data fields are limited to what is strictly necessary for each purpose
- [ ] Pseudonymization or anonymization is used where possible
- [ ] Data retention periods are defined and enforced for all fields
- [ ] Regular reviews are conducted to identify and remove unnecessary data
- [ ] Third-party services are configured to collect only required data
- [ ] Default settings favor minimal data collection (privacy by default)
- [ ] Data collection forms only request essential information
- [ ] Analytics and tracking are proportionate to business needs


## 6. Practical Steps for Data Reduction

1. **Audit each field** — For every data field in the tables above, ask: "Would the service break without this data?"
2. **Eliminate unnecessary collection** — Remove fields that are not essential for the stated purpose
3. **Anonymize where possible** — Replace identifiable data with pseudonyms or aggregates
4. **Shorten retention** — Reduce how long data is kept; implement automatic deletion
5. **Minimize third-party sharing** — Configure services to send only required fields
6. **Review regularly** — Re-run this checklist quarterly and after adding new services


## 7. Related Documents

- **DATA_DICTIONARY.md** — Complete catalog of all data fields
- **DATA_RETENTION_POLICY.md** — Retention schedules and deletion procedures
- **PRIVACY_POLICY.md** — Public disclosure of data collection practices
- **LAWFUL_BASIS_ASSESSMENT.md** — Legal basis for each processing activity
- **RECORD_OF_PROCESSING.md** — GDPR Art. 30 processing activities register
- **CONSENT_MANAGEMENT_GUIDE.md** — Consent collection and management procedures

For questions about this checklist, contact [your-email@example.com].

---

*This data minimization checklist was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. It is for informational purposes only and does not constitute legal advice.*