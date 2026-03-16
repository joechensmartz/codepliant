# Data Minimization Checklist

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Company:** [Your Company Name]
**Last updated:** 2026-03-16
**Project:** maybe

---

## 1. Purpose

This checklist implements the **data minimization principle** under GDPR Article 5(1)(c):

> *"Personal data shall be adequate, relevant and limited to what is necessary in relation to the purposes for which they are processed."*

For each detected service, this document identifies what data is collected, whether it is actually needed, and provides actionable recommendations for reducing unnecessary data collection.

> **Disclaimer:** This is not legal advice. Consult qualified legal counsel and your Data Protection Officer to confirm data processing activities are lawful and necessary.

## 2. Per-Service Data Analysis


### ActionCable (Other)

**Declared data collection:** real-time user data, connection metadata, channel subscriptions, WebSocket messages

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| real-time user data | Review needed | Detected via scan | Assess whether this data is necessary for ActionCable functionality |
| connection metadata | Review needed | Detected via scan | Assess whether this data is necessary for ActionCable functionality |
| channel subscriptions | Review needed | Detected via scan | Assess whether this data is necessary for ActionCable functionality |
| WebSocket messages | Review needed | Detected via scan | Assess whether this data is necessary for ActionCable functionality |



### ActionController::Cookies (Other)

**Declared data collection:** session cookies, session data, CSRF tokens

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| session cookies | Review needed | Detected via scan | Assess whether this data is necessary for ActionController::Cookies functionality |
| session data | Review needed | Detected via scan | Assess whether this data is necessary for ActionController::Cookies functionality |
| CSRF tokens | Review needed | Detected via scan | Assess whether this data is necessary for ActionController::Cookies functionality |



### ActionMailer (Email)

**Declared data collection:** email addresses, email content

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| email_address | Yes | Email delivery | Remove from lists on unsubscribe; honor deletion requests |
| email_content | **No** | Delivery logs | Do not retain email body after delivery confirmation; delete logs after 90 days |
| open_tracking | **No** | Marketing metrics | Consider removing tracking pixels; they are not essential and raise privacy concerns |
| email addresses | Review needed | Detected via scan | Assess whether this data is necessary for ActionMailer functionality |
| email content | Review needed | Detected via scan | Assess whether this data is necessary for ActionMailer functionality |



### Active Storage (Storage)

**Declared data collection:** uploaded files, file metadata, storage service credentials, potential PII in uploaded content

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| uploaded_files | Yes | User content storage | Implement file expiration for unused content; enforce size limits |
| file_metadata | Yes | File management | Delete metadata when files are deleted; do not retain orphaned metadata |
| uploaded files | Review needed | Detected via scan | Assess whether this data is necessary for Active Storage functionality |
| file metadata | Review needed | Detected via scan | Assess whether this data is necessary for Active Storage functionality |
| storage service credentials | Review needed | Detected via scan | Assess whether this data is necessary for Active Storage functionality |
| potential PII in uploaded content | Review needed | Detected via scan | Assess whether this data is necessary for Active Storage functionality |



### ActiveRecord (Database)

**Declared data collection:** user data as defined in schema, timestamps, associations

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| user_data | Yes | Core application functionality | Audit each field — only store what the application actually uses |
| user data as defined in schema | Review needed | Detected via scan | Assess whether this data is necessary for ActiveRecord functionality |
| timestamps | Review needed | Detected via scan | Assess whether this data is necessary for ActiveRecord functionality |
| associations | Review needed | Detected via scan | Assess whether this data is necessary for ActiveRecord functionality |



### ActiveStorage (Storage)

**Declared data collection:** uploaded files, file metadata, storage references

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| uploaded_files | Yes | User content storage | Implement file expiration for unused content; enforce size limits |
| file_metadata | Yes | File management | Delete metadata when files are deleted; do not retain orphaned metadata |
| uploaded files | Review needed | Detected via scan | Assess whether this data is necessary for ActiveStorage functionality |
| file metadata | Review needed | Detected via scan | Assess whether this data is necessary for ActiveStorage functionality |
| storage references | Review needed | Detected via scan | Assess whether this data is necessary for ActiveStorage functionality |



### aws-sdk-s3 (Storage)

**Declared data collection:** uploaded files, file metadata

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| uploaded_files | Yes | User content storage | Implement file expiration for unused content; enforce size limits |
| file_metadata | Yes | File management | Delete metadata when files are deleted; do not retain orphaned metadata |
| uploaded files | Review needed | Detected via scan | Assess whether this data is necessary for aws-sdk-s3 functionality |
| file metadata | Review needed | Detected via scan | Assess whether this data is necessary for aws-sdk-s3 functionality |



### intercom-ruby (Other)

**Declared data collection:** user profiles, email, name, conversations, user behavior

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| user profiles | Review needed | Detected via scan | Assess whether this data is necessary for intercom-ruby functionality |
| email | Review needed | Detected via scan | Assess whether this data is necessary for intercom-ruby functionality |
| name | Review needed | Detected via scan | Assess whether this data is necessary for intercom-ruby functionality |
| conversations | Review needed | Detected via scan | Assess whether this data is necessary for intercom-ruby functionality |
| user behavior | Review needed | Detected via scan | Assess whether this data is necessary for intercom-ruby functionality |



### nodemailer (Email)

**Declared data collection:** email addresses, email content

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| email_address | Yes | Email delivery | Remove from lists on unsubscribe; honor deletion requests |
| email_content | **No** | Delivery logs | Do not retain email body after delivery confirmation; delete logs after 90 days |
| open_tracking | **No** | Marketing metrics | Consider removing tracking pixels; they are not essential and raise privacy concerns |
| email addresses | Review needed | Detected via scan | Assess whether this data is necessary for nodemailer functionality |
| email content | Review needed | Detected via scan | Assess whether this data is necessary for nodemailer functionality |



### pg (Database)

**Declared data collection:** user data as defined in schema

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| user_data | Yes | Core application functionality | Audit each field — only store what the application actually uses |
| user data as defined in schema | Review needed | Detected via scan | Assess whether this data is necessary for pg functionality |



### plaid (Payment)

**Declared data collection:** bank account data, transaction history, account balances, financial institution data

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| payment_info | Yes | Required for payment processing | Tokenize via payment processor; never store raw card data |
| billing_address | Yes | Required for tax/invoicing | Collect only what is required by tax jurisdiction |
| transaction_history | Yes | Legal/tax retention requirement | Enforce 7-year retention limit; auto-delete after |
| customer_email | Yes | Transaction receipts | Use for transactional email only; do not repurpose for marketing without consent |
| bank account data | Review needed | Detected via scan | Assess whether this data is necessary for plaid functionality |
| transaction history | Review needed | Detected via scan | Assess whether this data is necessary for plaid functionality |
| account balances | Review needed | Detected via scan | Assess whether this data is necessary for plaid functionality |
| financial institution data | Review needed | Detected via scan | Assess whether this data is necessary for plaid functionality |



### rack-attack (Other)

**Declared data collection:** IP addresses, request metadata

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| IP addresses | Review needed | Detected via scan | Assess whether this data is necessary for rack-attack functionality |
| request metadata | Review needed | Detected via scan | Assess whether this data is necessary for rack-attack functionality |



### rails-actionmailer (Email)

**Declared data collection:** email addresses, email content

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| email_address | Yes | Email delivery | Remove from lists on unsubscribe; honor deletion requests |
| email_content | **No** | Delivery logs | Do not retain email body after delivery confirmation; delete logs after 90 days |
| open_tracking | **No** | Marketing metrics | Consider removing tracking pixels; they are not essential and raise privacy concerns |
| email addresses | Review needed | Detected via scan | Assess whether this data is necessary for rails-actionmailer functionality |
| email content | Review needed | Detected via scan | Assess whether this data is necessary for rails-actionmailer functionality |



### rails-activerecord (Database)

**Declared data collection:** user data as defined in schema

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| user_data | Yes | Core application functionality | Audit each field — only store what the application actually uses |
| user data as defined in schema | Review needed | Detected via scan | Assess whether this data is necessary for rails-activerecord functionality |



### rails-sessions (Auth)

**Declared data collection:** session cookies, CSRF tokens

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| email | Yes | Account identification and communication | Essential — ensure proper encryption at rest |
| password_hash | Yes | User authentication | Use strong hashing (bcrypt/argon2); never store plaintext |
| session_token | Yes | Session management | Short-lived tokens; auto-expire and rotate |
| login_history | **No** | Security auditing | Retain for 90 days max; anonymize after |
| oauth_token | Yes | Third-party authentication | Store securely; revoke on account deletion |
| session cookies | Review needed | Detected via scan | Assess whether this data is necessary for rails-sessions functionality |
| CSRF tokens | Review needed | Detected via scan | Assess whether this data is necessary for rails-sessions functionality |



### redis (Database)

**Declared data collection:** cached data, session data

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| user_data | Yes | Core application functionality | Audit each field — only store what the application actually uses |
| cached data | Review needed | Detected via scan | Assess whether this data is necessary for redis functionality |
| session data | Review needed | Detected via scan | Assess whether this data is necessary for redis functionality |



### ruby-openai (Ai)

**Declared data collection:** user prompts, conversation history, generated content

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| user_prompts | Yes | Required for AI feature delivery | Delete after processing; do not retain beyond 30 days for logs |
| conversation_history | **No** | Used for context continuity but may not be essential | Allow users to opt out; implement automatic expiration (30 days max) |
| generated_content | **No** | AI output retained for user convenience | Let users delete on demand; do not use for model training without consent |
| model_usage_metadata | **No** | Used for analytics and billing | Aggregate and anonymize; delete individual records after 90 days |
| user prompts | Review needed | Detected via scan | Assess whether this data is necessary for ruby-openai functionality |
| conversation history | Review needed | Detected via scan | Assess whether this data is necessary for ruby-openai functionality |
| generated content | Review needed | Detected via scan | Assess whether this data is necessary for ruby-openai functionality |



### sentry-ruby (Monitoring)

**Declared data collection:** error data, stack traces, user context, device information

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| error_data | Yes | Error tracking and debugging | Strip PII from error reports before sending to monitoring service |
| stack_traces | Yes | Debugging | Ensure no sensitive data (passwords, tokens) appears in stack traces |
| user_context | **No** | Error context for debugging | Use anonymized user IDs; do not send full user profiles |
| ip_address | **No** | Error context | Truncate or hash IP addresses in error reports |
| error data | Review needed | Detected via scan | Assess whether this data is necessary for sentry-ruby functionality |
| stack traces | Review needed | Detected via scan | Assess whether this data is necessary for sentry-ruby functionality |
| user context | Review needed | Detected via scan | Assess whether this data is necessary for sentry-ruby functionality |
| device information | Review needed | Detected via scan | Assess whether this data is necessary for sentry-ruby functionality |



### sidekiq (Other)

**Declared data collection:** job data, user data processed in background jobs

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| job data | Review needed | Detected via scan | Assess whether this data is necessary for sidekiq functionality |
| user data processed in background jobs | Review needed | Detected via scan | Assess whether this data is necessary for sidekiq functionality |



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



## 3. Data Reduction Opportunities

The following 12 data field(s) are collected but **may not be necessary** for core service delivery:

| # | Data Field | Service | Recommendation |
|---|-----------|---------|----------------|
| 1 | email_content | ActionMailer | Do not retain email body after delivery confirmation; delete logs after 90 days |
| 2 | open_tracking | ActionMailer | Consider removing tracking pixels; they are not essential and raise privacy concerns |
| 3 | email_content | nodemailer | Do not retain email body after delivery confirmation; delete logs after 90 days |
| 4 | open_tracking | nodemailer | Consider removing tracking pixels; they are not essential and raise privacy concerns |
| 5 | email_content | rails-actionmailer | Do not retain email body after delivery confirmation; delete logs after 90 days |
| 6 | open_tracking | rails-actionmailer | Consider removing tracking pixels; they are not essential and raise privacy concerns |
| 7 | login_history | rails-sessions | Retain for 90 days max; anonymize after |
| 8 | conversation_history | ruby-openai | Allow users to opt out; implement automatic expiration (30 days max) |
| 9 | generated_content | ruby-openai | Let users delete on demand; do not use for model training without consent |
| 10 | model_usage_metadata | ruby-openai | Aggregate and anonymize; delete individual records after 90 days |
| 11 | user_context | sentry-ruby | Use anonymized user IDs; do not send full user profiles |
| 12 | ip_address | sentry-ruby | Truncate or hash IP addresses in error reports |

> **Action required:** For each item above, determine whether (a) the data can be eliminated entirely, (b) the data can be anonymized or aggregated, or (c) there is a legitimate business justification that should be documented.


## 4. Summary

| Metric | Value |
|--------|-------|
| Services analyzed | 20 |
| Total data fields assessed | 95 |
| Fields likely needed | 83 |
| Fields potentially unnecessary | 12 |
| Potential data reduction | 13% |


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