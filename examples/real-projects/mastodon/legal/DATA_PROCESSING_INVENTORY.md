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
| **Total Processing Activities** | 4 |

## 2. Processing Activities Summary

| Metric | Count |
|--------|-------|
| Total processing activities | 4 |
| High risk activities | 0 |
| Medium risk activities | 3 |
| Low risk activities | 1 |
| Activities with international transfers | 3 |
| Activities with automated decision-making | 0 |

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
| **Recipients / Processors** | devise, omniauth, pundit, rails-sessions |
| **Retention Period** | Duration of account + 30 days after deletion request |
| **International Transfers** | Yes — outside EEA |
| **Transfer Safeguards** | Standard Contractual Clauses (SCCs) |
| **Automated Decision-Making** | No |
| **Risk Level** | **Medium** |

### PA-002: Email Communications

| Field | Details |
|-------|---------|
| **Activity ID** | PA-002 |
| **Processing Activity** | Email Communications |
| **Purpose of Processing** | Send transactional emails (order confirmations, password resets), marketing communications, system notifications |
| **Lawful Basis (Art. 6)** | Contract performance (Art. 6(1)(b)) / Consent for marketing (Art. 6(1)(a)) |
| **Categories of Data Subjects** | Registered Users, Customers, Newsletter Subscribers |
| **Categories of Personal Data** | Email address, Name, Email content, Delivery status, Open/click tracking, Unsubscribe preferences |
| **Recipients / Processors** | ActionMailer, rails-actionmailer |
| **Retention Period** | Until unsubscribe (marketing), 90 days delivery logs (transactional) |
| **International Transfers** | Yes — outside EEA |
| **Transfer Safeguards** | Standard Contractual Clauses (SCCs) |
| **Automated Decision-Making** | No |
| **Risk Level** | **Low** |

### PA-003: File Storage & Media Management

| Field | Details |
|-------|---------|
| **Activity ID** | PA-003 |
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

### PA-004: Primary Data Storage

| Field | Details |
|-------|---------|
| **Activity ID** | PA-004 |
| **Processing Activity** | Primary Data Storage |
| **Purpose of Processing** | Persistent storage of application data including user profiles, content, settings, and transactional records |
| **Lawful Basis (Art. 6)** | Contract performance (Art. 6(1)(b)) |
| **Categories of Data Subjects** | Registered Users, Customers |
| **Categories of Personal Data** | All user-submitted data as defined by database schema, Timestamps, Relational references |
| **Recipients / Processors** | ActiveRecord (managed/self-hosted), ioredis (managed/self-hosted), pg (managed/self-hosted), PostgreSQL (managed/self-hosted), PostgreSQL (env) (managed/self-hosted), rails-activerecord (managed/self-hosted), redis (managed/self-hosted), Redis (managed/self-hosted) |
| **Retention Period** | As defined per data category — see Data Retention Policy |
| **International Transfers** | No |
| **Transfer Safeguards** | Encryption at rest, access controls, regular backups |
| **Automated Decision-Making** | No |
| **Risk Level** | **Medium** |

## 4. Processing Activities Overview Table

| ID | Activity | Legal Basis | Data Types | Risk |
|----|----------|-------------|------------|------|
| PA-001 | User Authentication & Account Management | Contract performance | Email address, Name, Password hash ... | Medium |
| PA-002 | Email Communications | Contract performance | Email address, Name, Email content ... | Low |
| PA-003 | File Storage & Media Management | Contract performance | Uploaded files, File metadata, EXIF data (images) ... | Medium |
| PA-004 | Primary Data Storage | Contract performance | All user-submitted data as defined by database schema, Timestamps, Relational references | Medium |

## 5. Legal Basis Summary

| Legal Basis | Activities Using It |
|-------------|-------------------|
| Contract performance (Art. 6(1)(b)) | PA-001, PA-002, PA-003, PA-004 |

## 6. International Data Transfers

The following processing activities involve transfers of personal data outside the European Economic Area:

| Activity | Recipients | Safeguard |
|----------|-----------|-----------|
| PA-001: User Authentication & Account Management | devise, omniauth, pundit, rails-sessions | Standard Contractual Clauses (SCCs) |
| PA-002: Email Communications | ActionMailer, rails-actionmailer | Standard Contractual Clauses (SCCs) |
| PA-003: File Storage & Media Management | Active Storage, ActiveStorage, aws-sdk-s3 | Encryption at rest, Standard Contractual Clauses |

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
