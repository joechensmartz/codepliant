# Privacy Policy

**Effective Date:** 2026-03-16
**Last Updated:** 2026-03-16
**Previous Version:** [View previous version]([previous-version-url])

**Project:** @mastodon/mastodon

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

Email addresses, names, profile pictures, and account credentials collected through authentication.

**Collected through:** devise, omniauth, pundit, rails-sessions

### Communication Data

Email addresses and email content processed through email service providers.

**Collected through:** rails-actionmailer, ActionMailer

### Technical & Diagnostic Data

Error reports, stack traces, performance data, and user context collected through monitoring tools.

**Collected through:** Codecov

### User-Uploaded Content

Files, images, and documents uploaded by users and stored through cloud storage providers.

**Collected through:** aws-sdk-s3, ActiveStorage, Active Storage

### Stored User Data

Persistent user data stored in databases as defined by the application schema.

**Collected through:** pg, redis, ioredis, rails-activerecord, ActiveRecord, PostgreSQL (env), PostgreSQL, Redis, Redis (Cache)

### How Your Data Flows Through Our Service

The following summarizes how personal data moves through our application:

**Data Collection:**

- Email subscription/contact forms → email addresses, email content (via ActionMailer)
- User registration/login → email, password hash, session data, authentication tokens (via devise)
- User registration/login → email, name, OAuth tokens, profile data (via omniauth)
- User registration/login → user roles, authorization policies, access control data (via pundit)
- Email subscription/contact forms → email addresses, email content (via rails-actionmailer)
- User registration/login → session cookies, CSRF tokens (via rails-sessions)

**Data Storage:**

- Active Storage (File Storage): uploaded files, file metadata, storage service credentials, potential PII in uploaded content
- ActiveRecord (Database): user data as defined in schema, timestamps, associations
- ActiveStorage (File Storage): uploaded files, file metadata, storage references
- aws-sdk-s3 (File Storage): uploaded files, file metadata
- ioredis (Database): cached data, session data
- pg (Database): user data as defined in schema
- PostgreSQL (Database): application data, user records
- PostgreSQL (env) (Database): application data, user records
- rails-activerecord (Database): user data as defined in schema
- redis (Database): cached data, session data
- Redis (Database): session data, cache data

**Third-Party Data Sharing:**

- ActionCable: real-time user data, connection metadata, channel subscriptions, WebSocket messages
- ActionController::Cookies: session cookies, session data, CSRF tokens
- ActionMailer: email addresses, email content
- rack-attack: IP addresses, request metadata
- rails-actionmailer: email addresses, email content
- sidekiq: job data, user data processed in background jobs
- ws (WebSocket): real-time user data, connection metadata, IP address, WebSocket messages


### Data Sensitivity Classification

We classify the personal data we collect according to GDPR sensitivity levels to ensure appropriate protection:

| Sensitivity Level | Fields Detected | Protection Standard |
|-------------------|-----------------|--------------------|
| Special Category (Art. 9) | 1 | Explicit consent, DPIA, encryption, DPO oversight |
| High | 8 | Encryption, tokenization, access control, audit logging |
| Medium | 9 | Encryption in transit, consent, user access rights |
| Low | 62 | Encryption in transit, anonymization where possible |

For a detailed breakdown of each data field and its classification, see our Data Classification Report.


## 4. Third-Party Services and Data Recipients

Pursuant to GDPR Art. 13(1)(e), we disclose your personal data to the following categories of recipients and third-party data processors:

- **ActionCable** (Other): Processes real-time user data, connection metadata, channel subscriptions, WebSocket messages
- **ActionController::Cookies** (Other): Processes session cookies, session data, CSRF tokens
- **ActionMailer** (Email Service): Processes email addresses, email content
- **Active Storage** (File Storage): Processes uploaded files, file metadata, storage service credentials, potential PII in uploaded content
- **ActiveStorage** (File Storage): Processes uploaded files, file metadata, storage references
- **aws-sdk-s3** (File Storage): Processes uploaded files, file metadata
- **devise** (Authentication): Processes email, password hash, session data, authentication tokens
- **omniauth** (Authentication): Processes email, name, OAuth tokens, profile data
- **pundit** (Authentication): Processes user roles, authorization policies, access control data
- **rack-attack** (Other): Processes IP addresses, request metadata
- **rails-actionmailer** (Email Service): Processes email addresses, email content
- **rails-sessions** (Authentication): Processes session cookies, CSRF tokens
- **sidekiq** (Other): Processes job data, user data processed in background jobs
- **ws (WebSocket)** (Other): Processes real-time user data, connection metadata, IP address, WebSocket messages

Each third-party service provider processes your data under its own privacy policy and data processing agreement. We require all processors to implement appropriate technical and organisational measures in accordance with GDPR Art. 28.


## 5. Legal Basis for Processing (GDPR Art. 6)

Under the General Data Protection Regulation, we process your personal data based on the following legal grounds:

| Purpose | Legal Basis | GDPR Article | Details |
|---------|------------|--------------|--------|
| Other | Legitimate Interest | Art. 6(1)(f) | Supporting our service operations |
| Email Service | Legitimate Interest | Art. 6(1)(f) | Communicating service-related information to you |
| File Storage | Contract | Art. 6(1)(b) | Necessary to provide file storage as part of the service |
| Database | Contract | Art. 6(1)(b) | Necessary to store and manage your data as part of the service |
| Authentication | Contract | Art. 6(1)(b) | Necessary to fulfill our agreement with you |

### Legitimate Interests Pursued

Where we rely on legitimate interest as a legal basis, we have conducted a balancing test to ensure our interests do not override your fundamental rights and freedoms. Our legitimate interests include:

- **Other:** Supporting our service operations
- **Email Service:** Communicating service-related information to you


## 6. Data Retention

In accordance with the data minimisation principle (GDPR Art. 5(1)(e)), we retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, unless a longer retention period is required or permitted by applicable law.

| Data Type | Retention Period |
|-----------|------------------|
| Other | Data retained as long as necessary for the service |
| Email Service | Email communication records retained for up to 3 years |
| File Storage | Uploaded files retained until you delete them or your account |
| Database | User data retained until you delete your account |
| Authentication | Account data retained until you delete your account |


## 7. Your Rights

Under applicable data protection legislation, you may exercise the following rights with respect to your personal data:

- **Right of Access (Art. 15):** You have the right to obtain confirmation as to whether your personal data is being processed and, where that is the case, to request a copy of the personal data undergoing processing.
- **Right to Rectification (Art. 16):** You have the right to obtain the rectification of inaccurate personal data and, taking into account the purposes of the processing, to have incomplete personal data completed.
- **Right to Erasure (Art. 17):** You have the right to obtain the erasure of your personal data where one of the grounds set out in Art. 17(1) GDPR applies, subject to the exceptions in Art. 17(3).
- **Right to Data Portability (Art. 20):** You have the right to receive your personal data in a structured, commonly used, and machine-readable format, and to transmit that data to another controller without hindrance.
- **Right to Object (Art. 21):** You have the right to object, on grounds relating to your particular situation, to the processing of your personal data based on Art. 6(1)(e) or (f). We shall cease processing unless we demonstrate compelling legitimate grounds.
- **Right to Restriction of Processing (Art. 18):** You have the right to obtain restriction of processing where one of the conditions set out in Art. 18(1) GDPR applies.

### For EU/EEA Residents (GDPR)

Pursuant to GDPR Art. 77, you have the right to lodge a complaint with a supervisory authority, in particular in the Member State of your habitual residence, place of work, or place of the alleged infringement.

## 8. Right to Withdraw Consent

Pursuant to GDPR Art. 7(3), where we process your personal data based on your consent, you have the right to withdraw that consent at any time by contacting us at [your-email@example.com]. The withdrawal of consent shall not affect the lawfulness of processing based on consent before its withdrawal.


## 9. Automated Decision-Making (Art. 22)

Pursuant to GDPR Art. 13(2)(f), we inform you that we do not currently engage in automated decision-making, including profiling, that produces legal effects concerning you or similarly significantly affects you within the meaning of Art. 22(1).


## 10. Necessity of Data Provision (Art. 13(2)(e))

Pursuant to GDPR Art. 13(2)(e), we inform you whether the provision of personal data is a statutory or contractual requirement, or a requirement necessary to enter into a contract, and the possible consequences of failure to provide such data.

- **Required data (contractual necessity):** Data necessary for account creation, authentication, and core service functionality. The provision of this data is a requirement necessary to enter into and perform our contract with you. Failure to provide this data will result in our inability to provide you with the Service.
- **Optional data (consent-based):** Data collected for analytics, personalisation, and service improvement. The provision of this data is voluntary and not a contractual requirement. You may decline to provide this data without any impact on your ability to use the core Service.

## 11. Children's Privacy

We are committed to protecting the privacy of children. Our service may be used by or directed at children under the age of 13, and we comply with the Children's Online Privacy Protection Act (COPPA).

### Parental Consent

We do not knowingly collect personal information from children under 13 without verifiable parental consent. Before collecting, using, or disclosing personal information from a child under 13, we require verifiable consent from a parent or legal guardian.

### Information We Collect from Children

With parental consent, we may collect the minimum information necessary to provide our service. We do not condition a child's participation on providing more personal information than is reasonably necessary.

### Parental Rights

Parents and legal guardians have the right to:

- Review the personal information we have collected from their child
- Request deletion of their child's personal information
- Refuse to permit further collection or use of their child's information

### How to Request Deletion

To request the review or deletion of your child's personal information, please contact us at [your-email@example.com]. We will respond to your request within a reasonable timeframe and verify your identity as the child's parent or legal guardian before processing the request.


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
