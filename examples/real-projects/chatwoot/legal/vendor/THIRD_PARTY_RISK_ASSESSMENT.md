# Third-Party Risk Assessment

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** @chatwoot/chatwoot

**Assessor:** [Your Company Name]

## Related Documents

- Sub-Processor List (`SUBPROCESSOR_LIST.md`)
- Vendor Contacts Directory (`VENDOR_CONTACTS.md`)
- Vendor Security Questionnaire (`VENDOR_SECURITY_QUESTIONNAIRE.md`)
- Risk Register (`RISK_REGISTER.md`)

---

## Overview

This document provides a risk assessment of all third-party services integrated into the **@chatwoot/chatwoot** application. Each vendor has been evaluated for data sensitivity, geographic risk, compliance certifications, data processing scope, and risk mitigation measures.

Total third-party vendors assessed: **29**

For questions about this assessment, contact [your-email@example.com].

---

## Risk Matrix

| Vendor | Category | Data Sensitivity | Geographic Risk | Certifications | Overall Risk |
|--------|----------|-----------------|----------------|---------------|-------------|
| Amplitude | analytics | medium | US | SOC 2 Type II, GDPR | High |
| Amazon S3 (AWS) | storage | medium | US | SOC 2 Type II, ISO 27001, GDPR, HIPAA | Medium |
| Twilio | other | low | US | SOC 2 Type II, ISO 27001, GDPR | Low |
| ActionCable | other | low | Other | None verified | High |
| ActionController::Cookies | other | low | Other | None verified | High |
| ActionMailer | email | medium | Other | None verified | Critical |
| Active Storage | storage | medium | Other | None verified | Critical |
| ActiveRecord | database | medium | Other | None verified | Critical |
| ActiveStorage | storage | medium | Other | None verified | Critical |
| aws-sdk-s3 | storage | medium | Other | None verified | Critical |
| devise | auth | high | Other | None verified | Critical |
| google-cloud-storage | storage | medium | Other | None verified | Critical |
| MailHog | email | medium | Other | None verified | Critical |
| Meta Pixel | advertising | medium | Other | None verified | Critical |
| omniauth | auth | high | Other | None verified | Critical |
| pg | database | medium | Other | None verified | Critical |
| PostgreSQL (env) | database | medium | Other | None verified | Critical |
| pundit | auth | high | Other | None verified | Critical |
| rack-attack | other | low | Other | None verified | High |
| rails-actionmailer | email | medium | Other | None verified | Critical |
| rails-activerecord | database | medium | Other | None verified | Critical |
| rails-sessions | auth | high | Other | None verified | Critical |
| Redis | database | medium | Other | None verified | Critical |
| Redis (env) | database | medium | Other | None verified | Critical |
| ruby-openai | ai | high | Other | None verified | Critical |
| sentry-ruby | monitoring | low | Other | None verified | High |
| sidekiq | other | low | Other | None verified | High |
| Stripe | payment | high | US | PCI DSS Level 1, SOC 2 Type II, ISO 27001, GDPR | High |
| twilio-ruby | other | low | Other | None verified | High |

---

## Detailed Vendor Assessments

### Amplitude

| Attribute | Detail |
|-----------|--------|
| **Category** | analytics |
| **Data Processed** | user behavior, device information, session data |
| **Data Sensitivity** | medium |
| **Geographic Location** | US |
| **Geographic Risk** | Medium — EU-US Data Privacy Framework applicable |
| **Certifications** | SOC 2 Type II, GDPR |
| **Processing Scope** | User behavior tracking, session data, event logging |
| **Overall Risk Level** | High |

**Risk Mitigation Measures:**

- IP anonymization enabled where supported
- Cookie consent required before tracking
- Data retention limits configured

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)
- [ ] Standard Contractual Clauses (SCCs) — for cross-border transfers

### Amazon S3 (AWS)

| Attribute | Detail |
|-----------|--------|
| **Category** | storage |
| **Data Processed** | uploaded files, file metadata |
| **Data Sensitivity** | medium |
| **Geographic Location** | US |
| **Geographic Risk** | Medium — EU-US Data Privacy Framework applicable |
| **Certifications** | SOC 2 Type II, ISO 27001, GDPR, HIPAA |
| **Processing Scope** | File uploads, media assets, user-generated content |
| **Overall Risk Level** | Medium |

**Risk Mitigation Measures:**

- Encryption at rest for all stored files
- Access controls on uploaded content
- Regular audit of stored data

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)
- [ ] Standard Contractual Clauses (SCCs) — for cross-border transfers

### Twilio

| Attribute | Detail |
|-----------|--------|
| **Category** | other |
| **Data Processed** | phone numbers, voice call metadata, call recordings, device information |
| **Data Sensitivity** | low |
| **Geographic Location** | US |
| **Geographic Risk** | Medium — EU-US Data Privacy Framework applicable |
| **Certifications** | SOC 2 Type II, ISO 27001, GDPR |
| **Processing Scope** | Service-specific data processing |
| **Overall Risk Level** | Low |

**Risk Mitigation Measures:**

- Vendor security documentation reviewed
- Data processing agreement in place

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)
- [ ] Standard Contractual Clauses (SCCs) — for cross-border transfers

### ActionCable

| Attribute | Detail |
|-----------|--------|
| **Category** | other |
| **Data Processed** | real-time user data, connection metadata, channel subscriptions, WebSocket messages |
| **Data Sensitivity** | low |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | Service-specific data processing |
| **Overall Risk Level** | High |

**Risk Mitigation Measures:**

- Vendor security documentation reviewed
- Data processing agreement in place

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)

### ActionController::Cookies

| Attribute | Detail |
|-----------|--------|
| **Category** | other |
| **Data Processed** | session cookies, session data, CSRF tokens |
| **Data Sensitivity** | low |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | Service-specific data processing |
| **Overall Risk Level** | High |

**Risk Mitigation Measures:**

- Vendor security documentation reviewed
- Data processing agreement in place

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)

### ActionMailer

| Attribute | Detail |
|-----------|--------|
| **Category** | email |
| **Data Processed** | email addresses, email content |
| **Data Sensitivity** | medium |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | Email addresses, message content, delivery metadata |
| **Overall Risk Level** | Critical |

**Risk Mitigation Measures:**

- TLS encryption for email transmission
- Unsubscribe mechanism in all marketing emails
- Email content not stored beyond delivery

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)

### Active Storage

| Attribute | Detail |
|-----------|--------|
| **Category** | storage |
| **Data Processed** | uploaded files, file metadata, storage service credentials, potential PII in uploaded content |
| **Data Sensitivity** | medium |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | File uploads, media assets, user-generated content |
| **Overall Risk Level** | Critical |

**Risk Mitigation Measures:**

- Encryption at rest for all stored files
- Access controls on uploaded content
- Regular audit of stored data

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)

### ActiveRecord

| Attribute | Detail |
|-----------|--------|
| **Category** | database |
| **Data Processed** | user data as defined in schema, timestamps, associations |
| **Data Sensitivity** | medium |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | Structured data storage and retrieval |
| **Overall Risk Level** | Critical |

**Risk Mitigation Measures:**

- Vendor security documentation reviewed
- Data processing agreement in place

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)

### ActiveStorage

| Attribute | Detail |
|-----------|--------|
| **Category** | storage |
| **Data Processed** | uploaded files, file metadata, storage references |
| **Data Sensitivity** | medium |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | File uploads, media assets, user-generated content |
| **Overall Risk Level** | Critical |

**Risk Mitigation Measures:**

- Encryption at rest for all stored files
- Access controls on uploaded content
- Regular audit of stored data

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)

### aws-sdk-s3

| Attribute | Detail |
|-----------|--------|
| **Category** | storage |
| **Data Processed** | uploaded files, file metadata |
| **Data Sensitivity** | medium |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | File uploads, media assets, user-generated content |
| **Overall Risk Level** | Critical |

**Risk Mitigation Measures:**

- Encryption at rest for all stored files
- Access controls on uploaded content
- Regular audit of stored data

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)

### devise

| Attribute | Detail |
|-----------|--------|
| **Category** | auth |
| **Data Processed** | email, password hash, session data, authentication tokens |
| **Data Sensitivity** | high |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | Identity verification, session management, credential storage |
| **Overall Risk Level** | Critical |

**Risk Mitigation Measures:**

- Industry-standard authentication protocols (OAuth 2.0, OIDC)
- Passwords never stored in plaintext
- Session tokens rotated regularly

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)

### google-cloud-storage

| Attribute | Detail |
|-----------|--------|
| **Category** | storage |
| **Data Processed** | uploaded files, file metadata |
| **Data Sensitivity** | medium |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | File uploads, media assets, user-generated content |
| **Overall Risk Level** | Critical |

**Risk Mitigation Measures:**

- Encryption at rest for all stored files
- Access controls on uploaded content
- Regular audit of stored data

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)

### MailHog

| Attribute | Detail |
|-----------|--------|
| **Category** | email |
| **Data Processed** | email content |
| **Data Sensitivity** | medium |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | Email addresses, message content, delivery metadata |
| **Overall Risk Level** | Critical |

**Risk Mitigation Measures:**

- TLS encryption for email transmission
- Unsubscribe mechanism in all marketing emails
- Email content not stored beyond delivery

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)

### Meta Pixel

| Attribute | Detail |
|-----------|--------|
| **Category** | advertising |
| **Data Processed** | page views, conversion events, user behavior, device information |
| **Data Sensitivity** | medium |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | User profiles, ad targeting data, conversion tracking |
| **Overall Risk Level** | Critical |

**Risk Mitigation Measures:**

- Cookie consent required before ad tracking
- User opt-out mechanisms provided
- Data sharing limited to aggregated metrics where possible

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)

### omniauth

| Attribute | Detail |
|-----------|--------|
| **Category** | auth |
| **Data Processed** | email, name, OAuth tokens, profile data |
| **Data Sensitivity** | high |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | Identity verification, session management, credential storage |
| **Overall Risk Level** | Critical |

**Risk Mitigation Measures:**

- Industry-standard authentication protocols (OAuth 2.0, OIDC)
- Passwords never stored in plaintext
- Session tokens rotated regularly

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)

### pg

| Attribute | Detail |
|-----------|--------|
| **Category** | database |
| **Data Processed** | user data as defined in schema |
| **Data Sensitivity** | medium |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | Structured data storage and retrieval |
| **Overall Risk Level** | Critical |

**Risk Mitigation Measures:**

- Vendor security documentation reviewed
- Data processing agreement in place

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)

### PostgreSQL (env)

| Attribute | Detail |
|-----------|--------|
| **Category** | database |
| **Data Processed** | application data, user records |
| **Data Sensitivity** | medium |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | Structured data storage and retrieval |
| **Overall Risk Level** | Critical |

**Risk Mitigation Measures:**

- Vendor security documentation reviewed
- Data processing agreement in place

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)

### pundit

| Attribute | Detail |
|-----------|--------|
| **Category** | auth |
| **Data Processed** | user roles, authorization policies, access control data |
| **Data Sensitivity** | high |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | Identity verification, session management, credential storage |
| **Overall Risk Level** | Critical |

**Risk Mitigation Measures:**

- Industry-standard authentication protocols (OAuth 2.0, OIDC)
- Passwords never stored in plaintext
- Session tokens rotated regularly

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)

### rack-attack

| Attribute | Detail |
|-----------|--------|
| **Category** | other |
| **Data Processed** | IP addresses, request metadata |
| **Data Sensitivity** | low |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | Service-specific data processing |
| **Overall Risk Level** | High |

**Risk Mitigation Measures:**

- Vendor security documentation reviewed
- Data processing agreement in place

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)

### rails-actionmailer

| Attribute | Detail |
|-----------|--------|
| **Category** | email |
| **Data Processed** | email addresses, email content |
| **Data Sensitivity** | medium |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | Email addresses, message content, delivery metadata |
| **Overall Risk Level** | Critical |

**Risk Mitigation Measures:**

- TLS encryption for email transmission
- Unsubscribe mechanism in all marketing emails
- Email content not stored beyond delivery

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)

### rails-activerecord

| Attribute | Detail |
|-----------|--------|
| **Category** | database |
| **Data Processed** | user data as defined in schema |
| **Data Sensitivity** | medium |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | Structured data storage and retrieval |
| **Overall Risk Level** | Critical |

**Risk Mitigation Measures:**

- Vendor security documentation reviewed
- Data processing agreement in place

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)

### rails-sessions

| Attribute | Detail |
|-----------|--------|
| **Category** | auth |
| **Data Processed** | session cookies, CSRF tokens |
| **Data Sensitivity** | high |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | Identity verification, session management, credential storage |
| **Overall Risk Level** | Critical |

**Risk Mitigation Measures:**

- Industry-standard authentication protocols (OAuth 2.0, OIDC)
- Passwords never stored in plaintext
- Session tokens rotated regularly

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)

### Redis

| Attribute | Detail |
|-----------|--------|
| **Category** | database |
| **Data Processed** | session data, cache data |
| **Data Sensitivity** | medium |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | Structured data storage and retrieval |
| **Overall Risk Level** | Critical |

**Risk Mitigation Measures:**

- Vendor security documentation reviewed
- Data processing agreement in place

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)

### Redis (env)

| Attribute | Detail |
|-----------|--------|
| **Category** | database |
| **Data Processed** | session data, cache data |
| **Data Sensitivity** | medium |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | Structured data storage and retrieval |
| **Overall Risk Level** | Critical |

**Risk Mitigation Measures:**

- Vendor security documentation reviewed
- Data processing agreement in place

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)

### ruby-openai

| Attribute | Detail |
|-----------|--------|
| **Category** | ai |
| **Data Processed** | user prompts, conversation history, generated content |
| **Data Sensitivity** | high |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | User input processing, content generation, model training (per vendor policy) |
| **Overall Risk Level** | Critical |

**Risk Mitigation Measures:**

- Data minimization — only necessary context sent to AI provider
- Opt-out mechanism for AI processing where applicable
- Review vendor data retention and training policies

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)
- [ ] AI-specific data usage addendum

### sentry-ruby

| Attribute | Detail |
|-----------|--------|
| **Category** | monitoring |
| **Data Processed** | error data, stack traces, user context, device information |
| **Data Sensitivity** | low |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | Error logs, stack traces, performance metrics |
| **Overall Risk Level** | High |

**Risk Mitigation Measures:**

- PII scrubbing in error reports
- Short retention periods for logs
- Access restricted to engineering team

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)

### sidekiq

| Attribute | Detail |
|-----------|--------|
| **Category** | other |
| **Data Processed** | job data, user data processed in background jobs |
| **Data Sensitivity** | low |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | Service-specific data processing |
| **Overall Risk Level** | High |

**Risk Mitigation Measures:**

- Vendor security documentation reviewed
- Data processing agreement in place

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)

### Stripe

| Attribute | Detail |
|-----------|--------|
| **Category** | payment |
| **Data Processed** | payment information, billing address, email, transaction history |
| **Data Sensitivity** | high |
| **Geographic Location** | US |
| **Geographic Risk** | Medium — EU-US Data Privacy Framework applicable |
| **Certifications** | PCI DSS Level 1, SOC 2 Type II, ISO 27001, GDPR |
| **Processing Scope** | Payment card processing, billing records, transaction history |
| **Overall Risk Level** | High |

**Risk Mitigation Measures:**

- PCI DSS compliant processor handles all card data
- No raw payment data stored in application
- Tokenization used for recurring payments

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)
- [ ] PCI DSS Attestation of Compliance
- [ ] BAA (Business Associate Agreement) — if handling PHI
- [ ] Standard Contractual Clauses (SCCs) — for cross-border transfers

### twilio-ruby

| Attribute | Detail |
|-----------|--------|
| **Category** | other |
| **Data Processed** | phone numbers, SMS message content, voice call metadata |
| **Data Sensitivity** | low |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | Service-specific data processing |
| **Overall Risk Level** | High |

**Risk Mitigation Measures:**

- Vendor security documentation reviewed
- Data processing agreement in place

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)

---

## Vendor Due Diligence Checklist

Before onboarding any new third-party vendor, complete the following checklist:

- [ ] **Security Assessment:** Review vendor's SOC 2 report or equivalent security certification
- [ ] **Privacy Policy Review:** Verify vendor's privacy policy aligns with your data protection requirements
- [ ] **Data Processing Agreement:** Execute a DPA that meets GDPR Article 28 requirements
- [ ] **Sub-processor Disclosure:** Obtain list of vendor's sub-processors and their locations
- [ ] **Data Residency:** Confirm where data will be stored and processed
- [ ] **Breach Notification:** Verify vendor commits to timely breach notification (72 hours or less)
- [ ] **Data Deletion:** Confirm vendor can delete data upon request and at contract termination
- [ ] **Access Controls:** Review vendor's access control and authentication mechanisms
- [ ] **Encryption:** Verify encryption in transit (TLS 1.2+) and at rest
- [ ] **Audit Rights:** Ensure contract includes right to audit or request audit reports
- [ ] **Insurance:** Verify vendor carries adequate cyber liability insurance
- [ ] **Incident History:** Research vendor's history of security incidents or data breaches
- [ ] **Business Continuity:** Review vendor's disaster recovery and business continuity plans
- [ ] **Regulatory Compliance:** Verify compliance with applicable regulations (GDPR, CCPA, HIPAA, etc.)

---

## Contract Review Requirements

The following contractual documents should be in place for the third-party vendors used in this project:

### Required Agreements

- [ ] DPA (Data Processing Agreement)
- [ ] Standard Contractual Clauses (SCCs) — for cross-border transfers
- [ ] AI-specific data usage addendum
- [ ] PCI DSS Attestation of Compliance
- [ ] BAA (Business Associate Agreement) — if handling PHI

### DPA Minimum Requirements

Every Data Processing Agreement must include:

1. **Subject matter and duration** of data processing
2. **Nature and purpose** of the processing
3. **Types of personal data** processed
4. **Categories of data subjects** affected
5. **Obligations and rights** of the data controller
6. **Technical and organizational security measures**
7. **Sub-processor engagement** conditions and notification obligations
8. **Data breach notification** procedures and timelines
9. **Data return and deletion** upon contract termination
10. **Audit rights** for the data controller

### Additional Agreements by Scenario

| Scenario | Required Agreement |
|----------|--------------------|
| Processing health data (PHI) | BAA (Business Associate Agreement) |
| Cross-border data transfers (EU to non-EU) | Standard Contractual Clauses (SCCs) |
| Payment card processing | PCI DSS Attestation of Compliance |
| Processing children's data | COPPA-compliant agreement |
| AI/ML data processing | AI data usage and training opt-out addendum |

---

## Review Schedule

This risk assessment should be reviewed:

- **Annually** as part of the regular compliance review cycle
- **When adding** a new third-party vendor
- **When a vendor** changes its data processing practices or certifications
- **After a security incident** involving any listed vendor

---

*This Third-Party Risk Assessment was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Review and verify all entries for accuracy. This document does not constitute legal advice.*