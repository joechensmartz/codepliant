# DSAR Handling Guide

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** @mastodon/mastodon

**Data Controller:** [Your Company Name]

**Data Protection Officer:** [DPO Name] ([your-email@example.com])

## Related Documents

- Privacy Policy (`PRIVACY_POLICY.md`)
- Vendor Contacts Directory (`VENDOR_CONTACTS.md`)
- Data Dictionary (`DATA_DICTIONARY.md`)
- Data Subject Categories (`DATA_SUBJECT_CATEGORIES.md`)

---

> This guide provides step-by-step procedures for handling Data Subject Access Requests (DSARs) under the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA). It is tailored to the **@mastodon/mastodon** application based on automated code analysis.

---

## 1. What is a DSAR?

A **Data Subject Access Request (DSAR)** is a request made by an individual (the "data subject") to exercise their rights over their personal data. These rights are established under:

- **GDPR Articles 15-22** (European Union)
- **CCPA/CPRA Sections 1798.100-1798.199** (California, USA)

Data subjects have the right to know what personal data is collected about them, how it is used, and to request changes or deletion of that data. Organizations must respond to these requests within legally mandated timeframes.

### Legal Basis

| Right | GDPR Article | CCPA Section |
|-------|-------------|-------------|
| Right of Access | Art. 15 | §1798.100, §1798.110 |
| Right to Rectification | Art. 16 | §1798.106 |
| Right to Erasure ("Right to be Forgotten") | Art. 17 | §1798.105 |
| Right to Data Portability | Art. 20 | §1798.100 |
| Right to Restriction of Processing | Art. 18 | N/A |
| Right to Object | Art. 21 | §1798.120 (opt-out of sale/sharing) |

---

## 2. Types of DSAR Requests

### 2.1 Access Request (GDPR Art. 15 / CCPA §1798.110)

The data subject requests a copy of all personal data you hold about them, including:
- Categories of data processed
- Purposes of processing
- Recipients or categories of recipients
- Retention periods
- Source of the data (if not collected directly)

### 2.2 Rectification Request (GDPR Art. 16)

The data subject requests correction of inaccurate personal data or completion of incomplete data.

### 2.3 Erasure Request (GDPR Art. 17 / CCPA §1798.105)

The data subject requests deletion of their personal data. This right applies when:
- Data is no longer necessary for the original purpose
- Consent is withdrawn
- The data subject objects and there are no overriding legitimate grounds
- Data was unlawfully processed

**Exceptions:** You may retain data required for legal compliance, exercise of legal claims, or public interest.

### 2.4 Data Portability Request (GDPR Art. 20 / CCPA §1798.100)

The data subject requests their data in a structured, commonly used, machine-readable format (e.g., JSON, CSV) for transfer to another controller.

### 2.5 Restriction of Processing (GDPR Art. 18)

The data subject requests that processing be limited (data is stored but not actively processed) while:
- Accuracy is contested
- Processing is unlawful but the subject opposes erasure
- The controller no longer needs the data but the subject needs it for legal claims

### 2.6 Right to Object (GDPR Art. 21 / CCPA §1798.120)

The data subject objects to processing based on legitimate interests, direct marketing, or profiling. For CCPA, this includes the right to opt out of the sale or sharing of personal information.

---

## 3. Response Timeline

### GDPR Timeline

| Step | Deadline |
|------|----------|
| Acknowledge receipt | Within 3 business days |
| Verify identity | Within 5 business days |
| Respond to request | **30 calendar days** from receipt |
| Extension (complex requests) | Up to **60 additional days** (90 days total) with notification to the data subject |

### CCPA/CPRA Timeline

| Step | Deadline |
|------|----------|
| Acknowledge receipt | Within **10 business days** |
| Verify identity | Within 10 business days |
| Respond to request | **45 calendar days** from receipt |
| Extension (if necessary) | Up to **45 additional days** (90 days total) with notification to the consumer |

### Key Differences

- **GDPR:** 30-day default, extendable to 90 days for complex requests
- **CCPA:** 45-day default, extendable to 90 days
- **Both:** Extensions require notifying the data subject with reasons for the delay
- **GDPR:** First copy is free; subsequent copies may incur a reasonable fee
- **CCPA:** Requests must be fulfilled free of charge (up to 2 requests per 12-month period)

---

## 4. Identity Verification Requirements

Before processing any DSAR, you **must** verify the identity of the requester to prevent unauthorized disclosure of personal data.

### Verification Methods

1. **Existing Account Holders:**
   - Require the request to be submitted from the registered email address
   - Send a verification email with a one-time confirmation link
   - Require re-authentication through the application's login flow

2. **Non-Account Holders / Unverifiable Requests:**
   - Request two or more pieces of identifying information that match your records
   - Examples: full name, email, account number, recent transaction details
   - If identity cannot be verified, notify the requester within the response deadline and explain what additional information is needed

3. **Authorized Agents (CCPA):**
   - Verify the agent's authorization (signed permission or power of attorney)
   - Verify the identity of the consumer on whose behalf the request is made
   - Exception: no consumer verification needed if the agent has a valid power of attorney

### Documentation

- Record the verification method used for each request
- Document any failed verification attempts
- Retain verification records for the duration required by applicable law

---

## 5. Service-Specific Data Location Map

The following map was auto-generated from code analysis of **@mastodon/mastodon**. It shows where personal data is stored, how to export it, how to delete it, and which third parties must be notified.

### ActionCable

- **Category:** Third-Party Service
- **Data collected:** real-time user data, connection metadata, channel subscriptions, WebSocket messages
- **Storage location:** Third-party service infrastructure
- **How to export:** Consult the service provider's documentation for data export procedures. Contact their DPO if no self-service export is available.
- **How to delete:** Contact the service provider to request deletion of all personal data. Document the request and any response received.
- **Third-party notification required:** Yes — contact ActionCable to forward the DSAR or use their GDPR/privacy API

### ActionController::Cookies

- **Category:** Third-Party Service
- **Data collected:** session cookies, session data, CSRF tokens
- **Storage location:** Third-party service infrastructure
- **How to export:** Consult the service provider's documentation for data export procedures. Contact their DPO if no self-service export is available.
- **How to delete:** Contact the service provider to request deletion of all personal data. Document the request and any response received.
- **Third-party notification required:** Yes — contact ActionController::Cookies to forward the DSAR or use their GDPR/privacy API

### ActionMailer

- **Category:** Email / Communication
- **Data collected:** email addresses, email content
- **Storage location:** Email service provider infrastructure
- **How to export:** Export recipient data and email engagement history from the email provider's dashboard or API. Include suppression lists and preferences.
- **How to delete:** Remove the user from all mailing lists, delete their contact record, and add them to the suppression list to prevent future emails.
- **Third-party notification required:** Yes — contact ActionMailer to forward the DSAR or use their GDPR/privacy API

### Active Storage

- **Category:** File Storage
- **Data collected:** uploaded files, file metadata, storage service credentials, potential PII in uploaded content
- **Storage location:** Cloud object storage / CDN
- **How to export:** List and export all files associated with the user's account. Include file metadata (upload date, size, type).
- **How to delete:** Delete all user-uploaded files and associated metadata. Purge from CDN caches if applicable.
- **Third-party notification required:** Yes — contact Active Storage to forward the DSAR or use their GDPR/privacy API

### ActiveRecord

- **Category:** Database / Data Store
- **Data collected:** user data as defined in schema, timestamps, associations
- **Storage location:** Application database (self-hosted or managed)
- **How to export:** Run a database query filtered by the user's unique identifier to extract all records containing their personal data across all relevant tables.
- **How to delete:** Delete all database records containing the user's personal data. Run cascading deletes across related tables. Verify deletion in backups per retention policy.
- **Third-party notification required:** Yes — contact ActiveRecord to forward the DSAR or use their GDPR/privacy API

### ActiveStorage

- **Category:** File Storage
- **Data collected:** uploaded files, file metadata, storage references
- **Storage location:** Cloud object storage / CDN
- **How to export:** List and export all files associated with the user's account. Include file metadata (upload date, size, type).
- **How to delete:** Delete all user-uploaded files and associated metadata. Purge from CDN caches if applicable.
- **Third-party notification required:** Yes — contact ActiveStorage to forward the DSAR or use their GDPR/privacy API

### aws-sdk-s3

- **Category:** File Storage
- **Data collected:** uploaded files, file metadata
- **Storage location:** Cloud object storage / CDN
- **How to export:** List and export all files associated with the user's account. Include file metadata (upload date, size, type).
- **How to delete:** Delete all user-uploaded files and associated metadata. Purge from CDN caches if applicable.
- **Third-party notification required:** Yes — contact aws-sdk-s3 to forward the DSAR or use their GDPR/privacy API

### devise

- **Category:** Authentication / Identity
- **Data collected:** email, password hash, session data, authentication tokens
- **Storage location:** Authentication store (database or third-party auth provider)
- **How to export:** Export user profile data from the authentication provider's admin panel or API. Include account metadata, login history, and linked social accounts.
- **How to delete:** Delete the user account and all associated sessions, tokens, and profile data through the auth provider's API or admin panel.
- **Third-party notification required:** Yes — contact devise to forward the DSAR or use their GDPR/privacy API

### Redis

- **Category:** Database / Data Store
- **Data collected:** cached data, session data
- **Storage location:** Application database (self-hosted or managed)
- **How to export:** Run a database query filtered by the user's unique identifier to extract all records containing their personal data across all relevant tables.
- **How to delete:** Delete all database records containing the user's personal data. Run cascading deletes across related tables. Verify deletion in backups per retention policy.
- **Third-party notification required:** No (self-hosted)

### omniauth

- **Category:** Authentication / Identity
- **Data collected:** email, name, OAuth tokens, profile data
- **Storage location:** Authentication store (database or third-party auth provider)
- **How to export:** Export user profile data from the authentication provider's admin panel or API. Include account metadata, login history, and linked social accounts.
- **How to delete:** Delete the user account and all associated sessions, tokens, and profile data through the auth provider's API or admin panel.
- **Third-party notification required:** Yes — contact omniauth to forward the DSAR or use their GDPR/privacy API

### pg

- **Category:** Database / Data Store
- **Data collected:** user data as defined in schema
- **Storage location:** Application database (self-hosted or managed)
- **How to export:** Run a database query filtered by the user's unique identifier to extract all records containing their personal data across all relevant tables.
- **How to delete:** Delete all database records containing the user's personal data. Run cascading deletes across related tables. Verify deletion in backups per retention policy.
- **Third-party notification required:** Yes — contact pg to forward the DSAR or use their GDPR/privacy API

### PostgreSQL

- **Category:** Database / Data Store
- **Data collected:** application data, user records
- **Storage location:** Application database (self-hosted or managed)
- **How to export:** Run a database query filtered by the user's unique identifier to extract all records containing their personal data across all relevant tables.
- **How to delete:** Delete all database records containing the user's personal data. Run cascading deletes across related tables. Verify deletion in backups per retention policy.
- **Third-party notification required:** Yes — contact PostgreSQL to forward the DSAR or use their GDPR/privacy API

### PostgreSQL (env)

- **Category:** Database / Data Store
- **Data collected:** application data, user records
- **Storage location:** Application database (self-hosted or managed)
- **How to export:** Run a database query filtered by the user's unique identifier to extract all records containing their personal data across all relevant tables.
- **How to delete:** Delete all database records containing the user's personal data. Run cascading deletes across related tables. Verify deletion in backups per retention policy.
- **Third-party notification required:** Yes — contact PostgreSQL (env) to forward the DSAR or use their GDPR/privacy API

### pundit

- **Category:** Authentication / Identity
- **Data collected:** user roles, authorization policies, access control data
- **Storage location:** Authentication store (database or third-party auth provider)
- **How to export:** Export user profile data from the authentication provider's admin panel or API. Include account metadata, login history, and linked social accounts.
- **How to delete:** Delete the user account and all associated sessions, tokens, and profile data through the auth provider's API or admin panel.
- **Third-party notification required:** Yes — contact pundit to forward the DSAR or use their GDPR/privacy API

### rack-attack

- **Category:** Third-Party Service
- **Data collected:** IP addresses, request metadata
- **Storage location:** Third-party service infrastructure
- **How to export:** Consult the service provider's documentation for data export procedures. Contact their DPO if no self-service export is available.
- **How to delete:** Contact the service provider to request deletion of all personal data. Document the request and any response received.
- **Third-party notification required:** Yes — contact rack-attack to forward the DSAR or use their GDPR/privacy API

### rails-actionmailer

- **Category:** Email / Communication
- **Data collected:** email addresses, email content
- **Storage location:** Email service provider infrastructure
- **How to export:** Export recipient data and email engagement history from the email provider's dashboard or API. Include suppression lists and preferences.
- **How to delete:** Remove the user from all mailing lists, delete their contact record, and add them to the suppression list to prevent future emails.
- **Third-party notification required:** Yes — contact rails-actionmailer to forward the DSAR or use their GDPR/privacy API

### rails-activerecord

- **Category:** Database / Data Store
- **Data collected:** user data as defined in schema
- **Storage location:** Application database (self-hosted or managed)
- **How to export:** Run a database query filtered by the user's unique identifier to extract all records containing their personal data across all relevant tables.
- **How to delete:** Delete all database records containing the user's personal data. Run cascading deletes across related tables. Verify deletion in backups per retention policy.
- **Third-party notification required:** Yes — contact rails-activerecord to forward the DSAR or use their GDPR/privacy API

### rails-sessions

- **Category:** Authentication / Identity
- **Data collected:** session cookies, CSRF tokens
- **Storage location:** Authentication store (database or third-party auth provider)
- **How to export:** Export user profile data from the authentication provider's admin panel or API. Include account metadata, login history, and linked social accounts.
- **How to delete:** Delete the user account and all associated sessions, tokens, and profile data through the auth provider's API or admin panel.
- **Third-party notification required:** Yes — contact rails-sessions to forward the DSAR or use their GDPR/privacy API

### sidekiq

- **Category:** Third-Party Service
- **Data collected:** job data, user data processed in background jobs
- **Storage location:** Third-party service infrastructure
- **How to export:** Consult the service provider's documentation for data export procedures. Contact their DPO if no self-service export is available.
- **How to delete:** Contact the service provider to request deletion of all personal data. Document the request and any response received.
- **Third-party notification required:** Yes — contact sidekiq to forward the DSAR or use their GDPR/privacy API

### ws (WebSocket)

- **Category:** Third-Party Service
- **Data collected:** real-time user data, connection metadata, IP address, WebSocket messages
- **Storage location:** Third-party service infrastructure
- **How to export:** Consult the service provider's documentation for data export procedures. Contact their DPO if no self-service export is available.
- **How to delete:** Contact the service provider to request deletion of all personal data. Document the request and any response received.
- **Third-party notification required:** Yes — contact ws (WebSocket) to forward the DSAR or use their GDPR/privacy API

---

## 6. Third-Party Sub-Processor Notification

When fulfilling erasure or access requests, you must notify the following third-party sub-processors (GDPR Art. 19):

| Sub-Processor | Category | Action Required |
|--------------|----------|----------------|
| ActionCable | Third-Party Service | Forward DSAR; confirm deletion/export |
| ActionController::Cookies | Third-Party Service | Forward DSAR; confirm deletion/export |
| ActionMailer | Email / Communication | Forward DSAR; confirm deletion/export |
| Active Storage | File Storage | Forward DSAR; confirm deletion/export |
| ActiveRecord | Database / Data Store | Forward DSAR; confirm deletion/export |
| ActiveStorage | File Storage | Forward DSAR; confirm deletion/export |
| aws-sdk-s3 | File Storage | Forward DSAR; confirm deletion/export |
| devise | Authentication / Identity | Forward DSAR; confirm deletion/export |
| omniauth | Authentication / Identity | Forward DSAR; confirm deletion/export |
| pg | Database / Data Store | Forward DSAR; confirm deletion/export |
| PostgreSQL | Database / Data Store | Forward DSAR; confirm deletion/export |
| PostgreSQL (env) | Database / Data Store | Forward DSAR; confirm deletion/export |
| pundit | Authentication / Identity | Forward DSAR; confirm deletion/export |
| rack-attack | Third-Party Service | Forward DSAR; confirm deletion/export |
| rails-actionmailer | Email / Communication | Forward DSAR; confirm deletion/export |
| rails-activerecord | Database / Data Store | Forward DSAR; confirm deletion/export |
| rails-sessions | Authentication / Identity | Forward DSAR; confirm deletion/export |
| sidekiq | Third-Party Service | Forward DSAR; confirm deletion/export |
| ws (WebSocket) | Third-Party Service | Forward DSAR; confirm deletion/export |

**Procedure:**
1. Forward the DSAR to each relevant sub-processor listed above
2. Set a follow-up reminder for 14 days to confirm completion
3. Document each sub-processor's response
4. Inform the data subject of any sub-processors that could not comply, and the reasons

---

## 7. Template Responses

### 7.1 Acknowledgment of Receipt

> Dear [Data Subject Name],
>
> Thank you for your data subject access request received on [Date]. We have assigned reference number **[DSAR-XXXX]** to your request.
>
> We will verify your identity and respond within the applicable legal timeframe (30 days under GDPR / 45 days under CCPA).
>
> If we need additional information to verify your identity, we will contact you within 5 business days.
>
> Regards,
> [Your Company Name]
> [your-email@example.com]

### 7.2 Access Request Response

> Dear [Data Subject Name],
>
> Re: DSAR Reference **[DSAR-XXXX]**
>
> Following your access request dated [Date], please find attached a copy of all personal data we hold about you. This includes:
>
> - [List categories of data provided]
>
> The data is provided in [JSON/CSV] format. The purposes of processing, categories of recipients, and retention periods are described in our Privacy Policy at [URL].
>
> If you have any questions or believe this response is incomplete, please contact us at [your-email@example.com].
>
> Regards,
> [Your Company Name]

### 7.3 Rectification Confirmation

> Dear [Data Subject Name],
>
> Re: DSAR Reference **[DSAR-XXXX]**
>
> We have updated the following personal data as requested on [Date]:
>
> - [Field]: [Old Value] → [New Value]
>
> These changes have been applied across all our systems and any relevant third-party processors have been notified.
>
> Regards,
> [Your Company Name]

### 7.4 Erasure Confirmation

> Dear [Data Subject Name],
>
> Re: DSAR Reference **[DSAR-XXXX]**
>
> We confirm that your personal data has been deleted from our systems as of [Date]. This includes data held by the following services:
>
> - [List services where data was deleted]
>
> Please note the following exceptions, where data is retained for legal compliance:
>
> - [List any retained data and the legal basis for retention]
>
> Third-party sub-processors have been notified and have confirmed deletion.
>
> Regards,
> [Your Company Name]

### 7.5 Portability Response

> Dear [Data Subject Name],
>
> Re: DSAR Reference **[DSAR-XXXX]**
>
> Please find attached your personal data in a structured, machine-readable format (JSON/CSV) as requested under your right to data portability.
>
> The attached file contains all personal data you provided to us directly. If you would like this data transmitted directly to another controller, please provide their contact details and we will facilitate the transfer where technically feasible.
>
> Regards,
> [Your Company Name]

### 7.6 Restriction Confirmation

> Dear [Data Subject Name],
>
> Re: DSAR Reference **[DSAR-XXXX]**
>
> We have restricted the processing of your personal data as requested on [Date]. Your data will be stored but not actively processed until:
>
> - [State the condition for lifting the restriction]
>
> We will inform you before the restriction is lifted.
>
> Regards,
> [Your Company Name]

### 7.7 Objection Acknowledgment

> Dear [Data Subject Name],
>
> Re: DSAR Reference **[DSAR-XXXX]**
>
> We acknowledge your objection to the processing of your personal data for [purpose], received on [Date].
>
> [We have ceased processing your data for this purpose. / We have reviewed your objection and believe there are compelling legitimate grounds for continued processing. The grounds are: (explain).]
>
> Regards,
> [Your Company Name]

---

## 8. Record-Keeping Requirements

You must maintain a log of all DSARs received and how they were handled. This is required under GDPR Article 30 (Records of Processing Activities) and demonstrates compliance.

### Required DSAR Log Fields

| Field | Description |
|-------|------------|
| Reference Number | Unique identifier (e.g., DSAR-2026-001) |
| Date Received | When the request was received |
| Requester Identity | Name, email, or other identifier (after verification) |
| Request Type | Access, Rectification, Erasure, Portability, Restriction, or Objection |
| Verification Method | How the requester's identity was verified |
| Verification Date | When identity was confirmed |
| Response Deadline | Calculated deadline (30 days GDPR / 45 days CCPA) |
| Extension Applied | Whether an extension was needed and the reason |
| Services Queried | Which services/databases were searched |
| Third Parties Notified | Which sub-processors were contacted |
| Response Date | When the response was sent to the data subject |
| Outcome | Completed, Partially Completed, Denied (with reason) |
| Retained by | Staff member responsible |
| Notes | Any additional context |

### Retention of DSAR Records

- **Minimum retention:** 3 years from the date of the response (recommended)
- **GDPR:** No specific retention period mandated, but records must demonstrate compliance
- **CCPA:** Businesses must maintain records of CCPA requests for at least **24 months**
- Store DSAR records securely with access limited to authorized personnel

### Regular Review

- Review DSAR handling procedures at least **annually**
- Update this guide whenever new services or data stores are added to the application
- Conduct DSAR response drills to ensure staff readiness

---

*This DSAR Handling Guide was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis of the **@mastodon/mastodon** project. The service-specific data location map is derived from detected dependencies and may not capture all data stores. This document is a template and must be reviewed by a legal professional and your Data Protection Officer. It does not constitute legal advice.*