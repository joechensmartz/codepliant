# Data Processing Inventory

> **[Your Company Name]** — Complete Inventory of Data Processing Activities
>
> GDPR Article 30 — Record of Processing Activities Format
>
> Generated on 2026-03-16 by [Codepliant](https://github.com/joechensmartz/codepliant)
> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16

## 1. Data Controller Information

| Field | Value |
|-------|-------|
| **Organization** | [Your Company Name] |
| **Contact Email** | [your-email@example.com] |
| **Data Protection Officer** | [Data Protection Officer] ([your-email@example.com]) |
| **Inventory Date** | 2026-03-16 |
| **Next Review** | 2027-03-16 |
| **Total Processing Activities** | 7 |

## 2. Processing Activities Summary

| Metric | Count |
|--------|-------|
| Total processing activities | 7 |
| High risk activities | 2 |
| Medium risk activities | 3 |
| Low risk activities | 2 |
| Activities with international transfers | 6 |
| Activities with automated decision-making | 1 |

> **DPIA Required:** 2 high-risk processing activities have been identified. Under GDPR Article 35, a Data Protection Impact Assessment is likely required for these activities.

## 3. Detailed Processing Activities

### PA-001: User Authentication & Account Management

| Field | Details |
|-------|---------|
| **Activity ID** | PA-001 |
| **Processing Activity** | User Authentication & Account Management |
| **Purpose of Processing** | Create and manage user accounts, authenticate sessions, handle password resets and SSO flows |
| **Lawful Basis (Art. 6)** | Contract performance (Art. 6(1)(b)) |
| **Categories of Data Subjects** | Registered Users |
| **Categories of Personal Data** | Email address, Name, Password hash, OAuth tokens, Session identifiers, Login timestamps, IP address |
| **Recipients / Processors** | rails-sessions |
| **Retention Period** | Duration of account + 30 days after deletion request |
| **International Transfers** | Yes — outside EEA |
| **Transfer Safeguards** | Standard Contractual Clauses (SCCs) |
| **Automated Decision-Making** | No |
| **Risk Level** | **Medium** |

### PA-002: Payment Processing & Billing

| Field | Details |
|-------|---------|
| **Activity ID** | PA-002 |
| **Processing Activity** | Payment Processing & Billing |
| **Purpose of Processing** | Process purchases, manage subscriptions, handle refunds, generate invoices, comply with tax obligations |
| **Lawful Basis (Art. 6)** | Contract performance (Art. 6(1)(b)) / Legal obligation (Art. 6(1)(c)) |
| **Categories of Data Subjects** | Customers |
| **Categories of Personal Data** | Payment card tokens, Billing address, Email, Transaction amounts, Invoice history, Tax ID |
| **Recipients / Processors** | plaid, stripe |
| **Retention Period** | Duration of subscription + 7 years (tax/accounting requirements) |
| **International Transfers** | Yes — outside EEA |
| **Transfer Safeguards** | PCI DSS compliance, Standard Contractual Clauses |
| **Automated Decision-Making** | No |
| **Risk Level** | **High** |

### PA-003: Email Communications

| Field | Details |
|-------|---------|
| **Activity ID** | PA-003 |
| **Processing Activity** | Email Communications |
| **Purpose of Processing** | Send transactional emails (order confirmations, password resets), marketing communications, system notifications |
| **Lawful Basis (Art. 6)** | Contract performance (Art. 6(1)(b)) / Consent for marketing (Art. 6(1)(a)) |
| **Categories of Data Subjects** | Registered Users, Customers, Newsletter Subscribers |
| **Categories of Personal Data** | Email address, Name, Email content, Delivery status, Open/click tracking, Unsubscribe preferences |
| **Recipients / Processors** | ActionMailer, nodemailer, rails-actionmailer |
| **Retention Period** | Until unsubscribe (marketing), 90 days delivery logs (transactional) |
| **International Transfers** | Yes — outside EEA |
| **Transfer Safeguards** | Standard Contractual Clauses (SCCs) |
| **Automated Decision-Making** | No |
| **Risk Level** | **Low** |

### PA-004: AI-Powered Features & Processing

| Field | Details |
|-------|---------|
| **Activity ID** | PA-004 |
| **Processing Activity** | AI-Powered Features & Processing |
| **Purpose of Processing** | Provide AI-powered features including content generation, analysis, recommendations, and automated assistance |
| **Lawful Basis (Art. 6)** | Consent (Art. 6(1)(a)) or Contract performance (Art. 6(1)(b)) |
| **Categories of Data Subjects** | Registered Users |
| **Categories of Personal Data** | User prompts, Conversation history, Generated content, Feature interaction data, Feedback signals |
| **Recipients / Processors** | ruby-openai |
| **Retention Period** | 30 days for prompts/responses, configurable per service |
| **International Transfers** | Yes — outside EEA |
| **Transfer Safeguards** | Standard Contractual Clauses, Data Processing Addendum with AI provider |
| **Automated Decision-Making** | Yes — see DPIA |
| **Risk Level** | **High** |

### PA-005: Error Monitoring & Application Performance

| Field | Details |
|-------|---------|
| **Activity ID** | PA-005 |
| **Processing Activity** | Error Monitoring & Application Performance |
| **Purpose of Processing** | Track application errors, monitor performance, debug issues, maintain system reliability |
| **Lawful Basis (Art. 6)** | Legitimate interest (Art. 6(1)(f)) |
| **Categories of Data Subjects** | Registered Users, Website Visitors |
| **Categories of Personal Data** | Error stack traces, Request metadata, User agent, IP address, User context (ID, email), Device information |
| **Recipients / Processors** | sentry-ruby |
| **Retention Period** | 90 days (error data), 30 days (performance metrics) |
| **International Transfers** | Yes — outside EEA |
| **Transfer Safeguards** | Standard Contractual Clauses (SCCs) |
| **Automated Decision-Making** | No |
| **Risk Level** | **Low** |

### PA-006: File Storage & Media Management

| Field | Details |
|-------|---------|
| **Activity ID** | PA-006 |
| **Processing Activity** | File Storage & Media Management |
| **Purpose of Processing** | Store user-uploaded files, images, documents, and media assets |
| **Lawful Basis (Art. 6)** | Contract performance (Art. 6(1)(b)) |
| **Categories of Data Subjects** | Registered Users |
| **Categories of Personal Data** | Uploaded files, File metadata, EXIF data (images), File size, Upload timestamps |
| **Recipients / Processors** | Active Storage, ActiveStorage, aws-sdk-s3 |
| **Retention Period** | Duration of account + 30 days after deletion |
| **International Transfers** | Yes — outside EEA |
| **Transfer Safeguards** | Encryption at rest, Standard Contractual Clauses |
| **Automated Decision-Making** | No |
| **Risk Level** | **Medium** |

### PA-007: Primary Data Storage

| Field | Details |
|-------|---------|
| **Activity ID** | PA-007 |
| **Processing Activity** | Primary Data Storage |
| **Purpose of Processing** | Persistent storage of application data including user profiles, content, settings, and transactional records |
| **Lawful Basis (Art. 6)** | Contract performance (Art. 6(1)(b)) |
| **Categories of Data Subjects** | Registered Users, Customers |
| **Categories of Personal Data** | All user-submitted data as defined by database schema, Timestamps, Relational references |
| **Recipients / Processors** | ActiveRecord (managed/self-hosted), pg (managed/self-hosted), rails-activerecord (managed/self-hosted), redis (managed/self-hosted) |
| **Retention Period** | As defined per data category — see Data Retention Policy |
| **International Transfers** | No |
| **Transfer Safeguards** | Encryption at rest, access controls, regular backups |
| **Automated Decision-Making** | No |
| **Risk Level** | **Medium** |

## 4. Processing Activities Overview Table

| ID | Activity | Legal Basis | Data Types | Risk |
|----|----------|-------------|------------|------|
| PA-001 | User Authentication & Account Management | Contract performance | Email address, Name, Password hash ... | Medium |
| PA-002 | Payment Processing & Billing | Contract performance | Payment card tokens, Billing address, Email ... | High |
| PA-003 | Email Communications | Contract performance | Email address, Name, Email content ... | Low |
| PA-004 | AI-Powered Features & Processing | Consent | User prompts, Conversation history, Generated content ... | High |
| PA-005 | Error Monitoring & Application Performance | Legitimate interest | Error stack traces, Request metadata, User agent ... | Low |
| PA-006 | File Storage & Media Management | Contract performance | Uploaded files, File metadata, EXIF data (images) ... | Medium |
| PA-007 | Primary Data Storage | Contract performance | All user-submitted data as defined by database schema, Timestamps, Relational references | Medium |

## 5. Legal Basis Summary

| Legal Basis | Activities Using It |
|-------------|-------------------|
| Contract performance (Art. 6(1)(b)) | PA-001, PA-002, PA-003, PA-006, PA-007 |
| Consent (Art. 6(1)(a)) or Contract performance (Art. 6(1)(b)) | PA-004 |
| Legitimate interest (Art. 6(1)(f)) | PA-005 |

## 6. International Data Transfers

The following processing activities involve transfers of personal data outside the European Economic Area:

| Activity | Recipients | Safeguard |
|----------|-----------|-----------|
| PA-001: User Authentication & Account Management | rails-sessions | Standard Contractual Clauses (SCCs) |
| PA-002: Payment Processing & Billing | plaid, stripe | PCI DSS compliance, Standard Contractual Clauses |
| PA-003: Email Communications | ActionMailer, nodemailer, rails-actionmailer | Standard Contractual Clauses (SCCs) |
| PA-004: AI-Powered Features & Processing | ruby-openai | Standard Contractual Clauses, Data Processing Addendum with AI provider |
| PA-005: Error Monitoring & Application Performance | sentry-ruby | Standard Contractual Clauses (SCCs) |
| PA-006: File Storage & Media Management | Active Storage, ActiveStorage, aws-sdk-s3 | Encryption at rest, Standard Contractual Clauses |

> All international transfers are conducted in accordance with GDPR Chapter V requirements. Transfer Impact Assessments have been or will be conducted for each transfer mechanism.

## 7. Review & Maintenance

This inventory must be maintained as a living document:

- **Annual review:** Full review of all processing activities by 2027-03-16
- **On new processing:** Update when new services or data processing activities are added
- **On change:** Update when existing processing purposes, legal bases, or retention periods change
- **On incident:** Review after any data breach or regulatory inquiry
- **On request:** Make available to supervisory authorities upon request (GDPR Art. 30(4))

---

*This Data Processing Inventory was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. It follows the GDPR Article 30 Record of Processing Activities format. This document must be reviewed and completed by your Data Protection Officer and legal counsel to ensure accuracy.*
