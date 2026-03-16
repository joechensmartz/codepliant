# Privacy Policy

**Effective Date:** 2026-03-16
**Last Updated:** 2026-03-16
**Previous Version:** [View previous version]([previous-version-url])

**Project:** formbricks

---

## 1. Introduction

This Privacy Policy ("Policy") describes how [Your Company Name] ("we", "us", or "our") collects, uses, discloses, and otherwise processes your personal data when you access or use our services. This Policy applies to all personal data processed in connection with our websites, applications, and related services (collectively, the "Service").

We are committed to protecting your personal data in accordance with the General Data Protection Regulation (EU) 2016/679 ("GDPR"), the California Consumer Privacy Act as amended by the California Privacy Rights Act ("CCPA/CPRA"), and other applicable data protection legislation.

**Data Controller:** [Your Company Name]
**Contact Email:** [your-email@example.com]

## 2. Data Protection Officer

Our primary data protection contact is: **[your-email@example.com]**

> **Note:** If your organisation is required to appoint a Data Protection Officer under GDPR Article 37, update this section with the DPO's contact details.


## 3. Information We Collect

In accordance with GDPR Art. 13(1)(e) and Art. 14(1)(d), we collect the following categories of personal data:

### Personal Identity Data

Email addresses, names, profile pictures, and account credentials collected through authentication. names detected in OpenAPI/Swagger spec fields: schema.name, data.name, items.name, RequestBody.name (POST /api/v1/webhooks), contactAttributeKey.name, survey.name, blocks.name, variables.name, webhook.name, team.name, user.name, contactAttributeKeyInput.name, contactAttributeKeyUpdate.name, RequestBody.name (PUT /management/contacts/bulk), RequestBody.name (POST /management/contact-attribute-keys), RequestBody.name (PUT /management/contact-attribute-keys/{id}), RequestBody.name (POST /management/webhooks), RequestBody.name (PUT /management/webhooks/{id}), RequestBody.name (POST /organizations/{organizationId}/teams), RequestBody.name (PUT /organizations/{organizationId}/teams/{id}), RequestBody.name (POST /organizations/{organizationId}/users), RequestBody.name (PATCH /organizations/{organizationId}/users).

**Collected through:** next-auth, schema.name, data.name, items.name, RequestBody.name (POST /api/v1/webhooks), contactAttributeKey.name, survey.name, blocks.name, variables.name, webhook.name, team.name, user.name, contactAttributeKeyInput.name, contactAttributeKeyUpdate.name, RequestBody.name (PUT /management/contacts/bulk), RequestBody.name (POST /management/contact-attribute-keys), RequestBody.name (PUT /management/contact-attribute-keys/{id}), RequestBody.name (POST /management/webhooks), RequestBody.name (PUT /management/webhooks/{id}), RequestBody.name (POST /organizations/{organizationId}/teams), RequestBody.name (PUT /organizations/{organizationId}/teams/{id}), RequestBody.name (POST /organizations/{organizationId}/users), RequestBody.name (PATCH /organizations/{organizationId}/users)

### Financial Data

Payment card information, billing addresses, and transaction history processed through payment providers.

**Collected through:** stripe

### Usage & Behavioral Data

Page views, click patterns, session recordings, device information, and IP addresses collected through analytics tools.

**Collected through:** posthog

### Communication Data

Email addresses and email content processed through email service providers.

**Collected through:** nodemailer

### Technical & Diagnostic Data

Error reports, stack traces, performance data, and user context collected through monitoring tools.

**Collected through:** @sentry/nextjs

### User-Uploaded Content

Files, images, and documents uploaded by users and stored through cloud storage providers.

**Collected through:** @aws-sdk/client-s3, AWS

### Stored User Data

Persistent user data stored in databases as defined by the application schema.

**Collected through:** prisma, redis, ioredis, Redis (Cache)

### Technical Data

user agent strings detected in OpenAPI/Swagger spec fields: schema.userAgent, response.userAgent, RequestBody.userAgent (POST /responses), RequestBody.userAgent (PUT /responses/{id}), RequestBody.userAgent (POST /management/responses), RequestBody.userAgent (PUT /management/responses/{id}).

**Collected through:** schema.userAgent, response.userAgent, RequestBody.userAgent (POST /responses), RequestBody.userAgent (PUT /responses/{id}), RequestBody.userAgent (POST /management/responses), RequestBody.userAgent (PUT /management/responses/{id})

### Contact Information

email addresses detected in OpenAPI/Swagger spec fields: schema.email, user.email, RequestBody.email (POST /organizations/{organizationId}/users), RequestBody.email (PATCH /organizations/{organizationId}/users).

**Collected through:** schema.email, user.email, RequestBody.email (POST /organizations/{organizationId}/users), RequestBody.email (PATCH /organizations/{organizationId}/users)

### How Your Data Flows Through Our Service

The following summarizes how personal data moves through our application:

**Data Collection:**

- User registration/login → email, name, profile picture, OAuth tokens, session data (via next-auth)
- Email subscription/contact forms → email addresses, email content (via nodemailer)
- Payment checkout → payment information, billing address, email, transaction history (via stripe)

**Data Storage:**

- @aws-sdk/client-s3 (File Storage): uploaded files, file metadata
- ioredis (Database): cached data, session data
- prisma (Database): user data as defined in schema
- redis (Database): cached data, session data
- Database schema (Personal Identity Data): next-auth, schema.name, data.name, items.name, RequestBody.name (POST /api/v1/webhooks), contactAttributeKey.name, survey.name, blocks.name, variables.name, webhook.name, team.name, user.name, contactAttributeKeyInput.name, contactAttributeKeyUpdate.name, RequestBody.name (PUT /management/contacts/bulk), RequestBody.name (POST /management/contact-attribute-keys), RequestBody.name (PUT /management/contact-attribute-keys/{id}), RequestBody.name (POST /management/webhooks), RequestBody.name (PUT /management/webhooks/{id}), RequestBody.name (POST /organizations/{organizationId}/teams), RequestBody.name (PUT /organizations/{organizationId}/teams/{id}), RequestBody.name (POST /organizations/{organizationId}/users), RequestBody.name (PATCH /organizations/{organizationId}/users)
- Database schema (Technical Data): schema.userAgent, response.userAgent, RequestBody.userAgent (POST /responses), RequestBody.userAgent (PUT /responses/{id}), RequestBody.userAgent (POST /management/responses), RequestBody.userAgent (PUT /management/responses/{id})
- Database schema (Contact Information): schema.email, user.email, RequestBody.email (POST /organizations/{organizationId}/users), RequestBody.email (PATCH /organizations/{organizationId}/users)

**Third-Party Data Sharing:**

- @sentry/nextjs: error data, stack traces, user context, device information, IP address
- googleapis: user data via Google APIs, calendar data, email data, profile information
- nodemailer: email addresses, email content
- posthog: user behavior, session recordings, feature flag usage, device information
- stripe: payment information, billing address, email, transaction history


### Data Sensitivity Classification

We classify the personal data we collect according to GDPR sensitivity levels to ensure appropriate protection:

| Sensitivity Level | Fields Detected | Protection Standard |
|-------------------|-----------------|--------------------|
| Special Category (Art. 9) | 2 | Explicit consent, DPIA, encryption, DPO oversight |
| High | 28 | Encryption, tokenization, access control, audit logging |
| Medium | 12 | Encryption in transit, consent, user access rights |
| Low | 41 | Encryption in transit, anonymization where possible |

For a detailed breakdown of each data field and its classification, see our Data Classification Report.


## 4. Third-Party Services and Data Recipients

Pursuant to GDPR Art. 13(1)(e), we disclose your personal data to the following categories of recipients and third-party data processors:

- **@aws-sdk/client-s3** (File Storage): Processes uploaded files, file metadata
- **@sentry/nextjs** (Error Monitoring): Processes error data, stack traces, user context, device information, IP address
- **googleapis** (Other): Processes user data via Google APIs, calendar data, email data, profile information
- **next-auth** (Authentication): Processes email, name, profile picture, OAuth tokens, session data
- **nodemailer** (Email Service): Processes email addresses, email content
- **posthog** (Analytics): Processes user behavior, session recordings, feature flag usage, device information
- **stripe** (Payment Processing): Processes payment information, billing address, email, transaction history

Each third-party service provider processes your data under its own privacy policy and data processing agreement. We require all processors to implement appropriate technical and organisational measures in accordance with GDPR Art. 28.


## 5. Legal Basis for Processing (GDPR Art. 6)

Under the General Data Protection Regulation, we process your personal data based on the following legal grounds:

| Purpose | Legal Basis | GDPR Article | Details |
|---------|------------|--------------|--------|
| File Storage | Contract | Art. 6(1)(b) | Necessary to provide file storage as part of the service |
| Error Monitoring | Legitimate Interest | Art. 6(1)(f) | Protecting our service, detecting errors, and ensuring security |
| Other | Legitimate Interest | Art. 6(1)(f) | Supporting our service operations |
| Database | Contract | Art. 6(1)(b) | Necessary to store and manage your data as part of the service |
| Authentication | Contract | Art. 6(1)(b) | Necessary to fulfill our agreement with you |
| Email Service | Legitimate Interest | Art. 6(1)(f) | Communicating service-related information to you |
| Analytics | Consent | Art. 6(1)(a) | Only with your opt-in consent |
| Payment Processing | Contract | Art. 6(1)(b) | Necessary to fulfill our agreement with you |

### Legitimate Interests Pursued

Where we rely on legitimate interest as a legal basis, we have conducted a balancing test to ensure our interests do not override your fundamental rights and freedoms. Our legitimate interests include:

- **Error Monitoring:** Protecting our service, detecting errors, and ensuring security
- **Other:** Supporting our service operations
- **Email Service:** Communicating service-related information to you


## 6. International Data Transfers

Pursuant to GDPR Art. 13(1)(f), we inform you that your personal data may be transferred to and processed in countries outside the European Economic Area (EEA) that may not provide an equivalent level of data protection. The following services involve such transfers:

- **@aws-sdk/client-s3** (File Storage)
- **@sentry/nextjs** (Error Monitoring)
- **posthog** (Analytics)
- **stripe** (Payment Processing)

In accordance with GDPR Chapter V (Arts. 44-49), we ensure that appropriate safeguards are in place for all international transfers, including:

- Transfers to countries with an EU adequacy decision
- Standard Contractual Clauses (SCCs) approved by the European Commission
- EU-US Data Privacy Framework certification (where applicable)

You may request a copy of the applicable safeguards by contacting us at [your-email@example.com].


## 7. Data Retention

In accordance with the data minimisation principle (GDPR Art. 5(1)(e)), we retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, unless a longer retention period is required or permitted by applicable law.

| Data Type | Retention Period |
|-----------|------------------|
| File Storage | Uploaded files retained until you delete them or your account |
| Error Monitoring | Error and performance data retained for up to 90 days |
| Other | Data retained as long as necessary for the service |
| Database | User data retained until you delete your account |
| Authentication | Account data retained until you delete your account |
| Email Service | Email communication records retained for up to 3 years |
| Analytics | Analytics data retained for up to 26 months |
| Payment Processing | Transaction records retained for 7 years (tax and legal compliance) |


## 8. Your Rights

Under applicable data protection legislation, you may exercise the following rights with respect to your personal data:

- **Right of Access (Art. 15):** You have the right to obtain confirmation as to whether your personal data is being processed and, where that is the case, to request a copy of the personal data undergoing processing.
- **Right to Rectification (Art. 16):** You have the right to obtain the rectification of inaccurate personal data and, taking into account the purposes of the processing, to have incomplete personal data completed.
- **Right to Erasure (Art. 17):** You have the right to obtain the erasure of your personal data where one of the grounds set out in Art. 17(1) GDPR applies, subject to the exceptions in Art. 17(3).
- **Right to Data Portability (Art. 20):** You have the right to receive your personal data in a structured, commonly used, and machine-readable format, and to transmit that data to another controller without hindrance.
- **Right to Object (Art. 21):** You have the right to object, on grounds relating to your particular situation, to the processing of your personal data based on Art. 6(1)(e) or (f). We shall cease processing unless we demonstrate compelling legitimate grounds.
- **Right to Restriction of Processing (Art. 18):** You have the right to obtain restriction of processing where one of the conditions set out in Art. 18(1) GDPR applies.

### For EU/EEA Residents (GDPR)

Pursuant to GDPR Art. 77, you have the right to lodge a complaint with a supervisory authority, in particular in the Member State of your habitual residence, place of work, or place of the alleged infringement.

### For California Residents (CCPA/CPRA)

Under the California Consumer Privacy Act and California Privacy Rights Act:

#### Categories of Personal Information Collected
- Audio, electronic, visual, or similar information (uploaded files and media)
- Internet or other electronic network activity (device info, error reports, IP address)
- Identifiers and other personal information stored in databases
- Identifiers (name, email address, account credentials)
- Identifiers (email address, communication records)
- Internet or other electronic network activity (browsing history, interactions with website)
- Financial information (payment card details, billing address, transaction history)

#### Categories of Sources

We collect personal information from the following categories of sources:

- Directly from you (file uploads)
- Automatically (error reports, device information, IP address)
- Directly from you (account creation, form submissions)
- Directly from you (account registration, login forms)
- Directly from you (email address provided at signup or contact)
- Automatically (cookies, web beacons, analytics tools)
- Directly from you (checkout and billing forms)
- From third parties (payment processors)

#### Business or Commercial Purpose for Collection

We collect and use personal information for the following business or commercial purposes:

- **File Storage:** Performing services: Providing file storage and media hosting as part of the service
- **Error Monitoring:** Debugging: Identifying and repairing errors that impair intended functionality; Security: Detecting security incidents and protecting against malicious or illegal activity
- **Database:** Performing services: Storing and managing user data necessary for core service functionality
- **Authentication:** Performing services: Providing account creation, authentication, and access control
- **Email Service:** Performing services: Sending transactional and service-related communications
- **Analytics:** Auditing: Counting ad impressions, verifying positioning, and auditing compliance; Short-term transient use: Contextualizing and customizing content shown to you
- **Payment Processing:** Performing services: Processing transactions, billing, and fulfilling orders

#### Your CCPA Rights
- Right to Know
- Right to Correct (CPRA Section 1798.106)
- Right to Delete
- Right to Opt-Out of Sale/Sharing
- Right to Limit Use of Sensitive Personal Information
- Right to Non-Discrimination

#### Do Not Sell or Share My Personal Information
We do not sell your personal information. We share personal information with analytics providers for cross-context behavioral advertising. You may opt out by contacting us at [your-email@example.com] or using our opt-out mechanism.

#### How to Submit a Request

You may submit a request to exercise your CCPA rights through the following methods:

- **Email:** [your-email@example.com]
- **Toll-Free Telephone Number:** [1-800-XXX-XXXX] *(update with your toll-free number)*

We will respond to verifiable consumer requests within 45 days.

#### Authorized Agent
You may designate an authorized agent to make requests on your behalf.

## 9. Right to Withdraw Consent

Pursuant to GDPR Art. 7(3), where we process your personal data based on your consent (Art. 6(1)(a) or Art. 9(2)(a)), you have the right to withdraw that consent at any time. The withdrawal of consent shall not affect the lawfulness of processing based on consent before its withdrawal.

You can withdraw your consent by:

- Adjusting your preferences in your account settings
- Contacting us at [your-email@example.com]

Upon withdrawal, we will cease the relevant processing activities, though some data already collected may be retained where we have another lawful basis for doing so.


## 10. Automated Decision-Making (Art. 22)

Pursuant to GDPR Art. 13(2)(f), we inform you that we do not currently engage in automated decision-making, including profiling, that produces legal effects concerning you or similarly significantly affects you within the meaning of Art. 22(1).


## 11. Necessity of Data Provision (Art. 13(2)(e))

Pursuant to GDPR Art. 13(2)(e), we inform you whether the provision of personal data is a statutory or contractual requirement, or a requirement necessary to enter into a contract, and the possible consequences of failure to provide such data.

- **Required data (contractual necessity):** Data necessary for account creation, authentication, and core service functionality. The provision of this data is a requirement necessary to enter into and perform our contract with you. Failure to provide this data will result in our inability to provide you with the Service.
- **Optional data (consent-based):** Data collected for analytics, personalisation, and service improvement. The provision of this data is voluntary and not a contractual requirement. You may decline to provide this data without any impact on your ability to use the core Service.

## 12. How We Protect Your Data

We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.

### Encryption

- All data transmitted between your browser and our servers is encrypted using TLS 1.2 or higher
- Sensitive data (such as payment information and credentials) is encrypted at rest using industry-standard encryption algorithms
- Encryption keys are managed through secure key management practices with regular rotation

### Access Controls

- Access to personal data is restricted to authorized personnel on a need-to-know basis
- We implement role-based access control (RBAC) to limit data access by job function
- Multi-factor authentication is required for administrative access to systems containing personal data
- Access permissions are reviewed regularly and revoked promptly when no longer needed

### Monitoring and Incident Detection

- We use error tracking and performance monitoring (@sentry/nextjs) to detect anomalies and potential security incidents
- Automated alerts are configured for suspicious activity and system errors
- Security events are logged and reviewed to identify potential threats

### Backups and Recovery

- Regular automated backups of all databases containing personal data
- Backups are encrypted and stored in secure, geographically separate locations
- Recovery procedures are tested periodically to ensure data can be restored in the event of an incident

### Security Assessments

- Regular security reviews and vulnerability assessments are conducted
- Third-party services are evaluated for security before integration
- We maintain an incident response plan for handling data breaches (see `INCIDENT_RESPONSE_PLAN.md`)


## 13. Changes to This Policy

We may revise this Policy from time to time to reflect changes in our data processing practices, applicable law, or regulatory guidance. Where we make material changes, we will notify you by reasonable means, such as a prominent notice on the Service or by email to the address associated with your account, at least thirty (30) days prior to the changes taking effect.

We will not reduce your rights under this Policy without your explicit consent. Each version of this Policy will be identified by its effective date, and we will maintain an archive of prior versions available upon request.

Your continued use of the Service after the effective date of any revised Policy constitutes your acceptance of the revised terms. If you do not agree with the revised Policy, you must discontinue use of the Service.

## 14. Contact

If you have questions about this Policy or wish to exercise your data protection rights, please contact us at:

- **Email:** [your-email@example.com]
