# Data Minimization Checklist

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Company:** [Your Company Name]
**Last updated:** 2026-03-16
**Project:** saleor

---

## 1. Purpose

This checklist implements the **data minimization principle** under GDPR Article 5(1)(c):

> *"Personal data shall be adequate, relevant and limited to what is necessary in relation to the purposes for which they are processed."*

For each detected service, this document identifies what data is collected, whether it is actually needed, and provides actionable recommendations for reducing unnecessary data collection.

> **Disclaimer:** This is not legal advice. Consult qualified legal counsel and your Data Protection Officer to confirm data processing activities are lawful and necessary.

## 2. Per-Service Data Analysis


### boto3 (Storage)

**Declared data collection:** uploaded files, file metadata

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| uploaded_files | Yes | User content storage | Implement file expiration for unused content; enforce size limits |
| file_metadata | Yes | File management | Delete metadata when files are deleted; do not retain orphaned metadata |
| uploaded files | Review needed | Detected via scan | Assess whether this data is necessary for boto3 functionality |
| file metadata | Review needed | Detected via scan | Assess whether this data is necessary for boto3 functionality |



### Django Channels (Other)

**Declared data collection:** real-time user data, connection metadata, channel group data, WebSocket messages

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| real-time user data | Review needed | Detected via scan | Assess whether this data is necessary for Django Channels functionality |
| connection metadata | Review needed | Detected via scan | Assess whether this data is necessary for Django Channels functionality |
| channel group data | Review needed | Detected via scan | Assess whether this data is necessary for Django Channels functionality |
| WebSocket messages | Review needed | Detected via scan | Assess whether this data is necessary for Django Channels functionality |



### django-admin (Auth)

**Declared data collection:** admin panel access, staff user accounts

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| email | Yes | Account identification and communication | Essential — ensure proper encryption at rest |
| password_hash | Yes | User authentication | Use strong hashing (bcrypt/argon2); never store plaintext |
| session_token | Yes | Session management | Short-lived tokens; auto-expire and rotate |
| login_history | **No** | Security auditing | Retain for 90 days max; anonymize after |
| oauth_token | Yes | Third-party authentication | Store securely; revoke on account deletion |
| admin panel access | Review needed | Detected via scan | Assess whether this data is necessary for django-admin functionality |
| staff user accounts | Review needed | Detected via scan | Assess whether this data is necessary for django-admin functionality |



### django-sessions (Auth)

**Declared data collection:** session cookies, CSRF tokens

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| email | Yes | Account identification and communication | Essential — ensure proper encryption at rest |
| password_hash | Yes | User authentication | Use strong hashing (bcrypt/argon2); never store plaintext |
| session_token | Yes | Session management | Short-lived tokens; auto-expire and rotate |
| login_history | **No** | Security auditing | Retain for 90 days max; anonymize after |
| oauth_token | Yes | Third-party authentication | Store securely; revoke on account deletion |
| session cookies | Review needed | Detected via scan | Assess whether this data is necessary for django-sessions functionality |
| CSRF tokens | Review needed | Detected via scan | Assess whether this data is necessary for django-sessions functionality |



### redis (Database)

**Declared data collection:** cached data, session data

| Data Field | Likely Needed? | Justification | Recommendation |
|-----------|---------------|---------------|----------------|
| user_data | Yes | Core application functionality | Audit each field — only store what the application actually uses |
| cached data | Review needed | Detected via scan | Assess whether this data is necessary for redis functionality |
| session data | Review needed | Detected via scan | Assess whether this data is necessary for redis functionality |



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

The following 2 data field(s) are collected but **may not be necessary** for core service delivery:

| # | Data Field | Service | Recommendation |
|---|-----------|---------|----------------|
| 1 | login_history | django-admin | Retain for 90 days max; anonymize after |
| 2 | login_history | django-sessions | Retain for 90 days max; anonymize after |

> **Action required:** For each item above, determine whether (a) the data can be eliminated entirely, (b) the data can be anonymized or aggregated, or (c) there is a legitimate business justification that should be documented.


## 4. Summary

| Metric | Value |
|--------|-------|
| Services analyzed | 6 |
| Total data fields assessed | 33 |
| Fields likely needed | 31 |
| Fields potentially unnecessary | 2 |
| Potential data reduction | 6% |


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