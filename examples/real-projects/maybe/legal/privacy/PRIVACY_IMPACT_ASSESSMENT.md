# Privacy Impact Assessment (DPIA)

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** maybe

**Data Controller:** [Your Company Name]

**Contact:** [your-email@example.com]

**DPO:** [DPO Name] ([dpo@example.com])

## Related Documents

- Privacy Policy (`PRIVACY_POLICY.md`)
- Record of Processing Activities (`RECORD_OF_PROCESSING_ACTIVITIES.md`)
- Risk Register (`RISK_REGISTER.md`)
- Lawful Basis Assessment (`LAWFUL_BASIS_ASSESSMENT.md`)

---

> This Data Protection Impact Assessment is prepared pursuant to **Article 35 of the General Data Protection Regulation (EU) 2016/679 (GDPR)**. A DPIA is required when data processing is likely to result in a high risk to the rights and freedoms of natural persons, particularly when using new technologies.

## 1. Description of Processing

### 1.1 Overview

This assessment covers the data processing activities of the **maybe** application operated by [Your Company Name]. The following describes the nature, scope, context, and purposes of processing.

### 1.2 Services and Data Processing Activities

The application integrates the following services that process personal data:

| Service | Category | Data Processed | Legal Basis |
|---------|----------|---------------|-------------|
| ActionCable | other | real-time user data, connection metadata, channel subscriptions, WebSocket messages | Legitimate interest |
| ActionController::Cookies | other | session cookies, session data, CSRF tokens | Legitimate interest |
| ActionMailer | email | email addresses, email content | Contractual necessity / Consent |
| Active Storage | storage | uploaded files, file metadata, storage service credentials, potential PII in uploaded content | Contractual necessity |
| ActiveRecord | database | user data as defined in schema, timestamps, associations | Contractual necessity |
| ActiveStorage | storage | uploaded files, file metadata, storage references | Contractual necessity |
| aws-sdk-s3 | storage | uploaded files, file metadata | Contractual necessity |
| intercom-ruby | other | user profiles, email, name, conversations, user behavior | Legitimate interest |
| nodemailer | email | email addresses, email content | Contractual necessity / Consent |
| pg | database | user data as defined in schema | Contractual necessity |
| plaid | payment | bank account data, transaction history, account balances, financial institution data | Contractual necessity |
| rack-attack | other | IP addresses, request metadata | Legitimate interest |
| rails-actionmailer | email | email addresses, email content | Contractual necessity / Consent |
| rails-activerecord | database | user data as defined in schema | Contractual necessity |
| rails-sessions | auth | session cookies, CSRF tokens | Contractual necessity |
| redis | database | cached data, session data | Contractual necessity |
| ruby-openai | ai | user prompts, conversation history, generated content | Consent / Legitimate interest |
| sentry-ruby | monitoring | error data, stack traces, user context, device information | Legitimate interest |
| sidekiq | other | job data, user data processed in background jobs | Legitimate interest |
| stripe | payment | payment information, billing address, email, transaction history | Contractual necessity |

### 1.3 Categories of Personal Data

- **Personal Identity Data:** Email addresses, names, profile pictures, and account credentials collected through authentication. (sources: rails-sessions)
- **Financial Data:** Payment card information, billing addresses, and transaction history processed through payment providers. (sources: stripe, plaid)
- **AI Interaction Data:** User prompts, conversation history, and AI-generated content processed through third-party AI services. (sources: ruby-openai)
- **Communication Data:** Email addresses and email content processed through email service providers. (sources: rails-actionmailer, nodemailer, ActionMailer)
- **Technical & Diagnostic Data:** Error reports, stack traces, performance data, and user context collected through monitoring tools. (sources: sentry-ruby)
- **User-Uploaded Content:** Files, images, and documents uploaded by users and stored through cloud storage providers. (sources: aws-sdk-s3, ActiveStorage, Active Storage)
- **Stored User Data:** Persistent user data stored in databases as defined by the application schema. (sources: pg, redis, rails-activerecord, ActiveRecord, Redis (Cache))

### 1.4 Categories of Data Subjects

- End users of the application
- Registered account holders
- Website visitors
- Customers and prospective customers

> **Action required:** Review and update the categories of data subjects to reflect your actual processing activities.

## 2. Necessity and Proportionality Assessment

### 2.1 Lawfulness of Processing

Each data processing activity must have a valid legal basis under Article 6 GDPR:

| Processing Activity | Legal Basis | Justification |
|---------------------|-------------|---------------|
| Data processing via ActionCable | Legitimate interest | To be documented based on specific use case |
| Data processing via ActionController::Cookies | Legitimate interest | To be documented based on specific use case |
| Email communications via ActionMailer | Contractual necessity / Consent | Necessary for service communications; marketing requires separate consent |
| File storage via Active Storage | Contractual necessity | Necessary to provide file storage features requested by the user |
| Data persistence via ActiveRecord | Contractual necessity | Necessary to persist user data for service delivery |
| File storage via ActiveStorage | Contractual necessity | Necessary to provide file storage features requested by the user |
| File storage via aws-sdk-s3 | Contractual necessity | Necessary to provide file storage features requested by the user |
| Data processing via intercom-ruby | Legitimate interest | To be documented based on specific use case |
| Email communications via nodemailer | Contractual necessity / Consent | Necessary for service communications; marketing requires separate consent |
| Data persistence via pg | Contractual necessity | Necessary to persist user data for service delivery |
| Payment processing via plaid | Contractual necessity | Necessary to process transactions requested by the user |
| Data processing via rack-attack | Legitimate interest | To be documented based on specific use case |
| Email communications via rails-actionmailer | Contractual necessity / Consent | Necessary for service communications; marketing requires separate consent |
| Data persistence via rails-activerecord | Contractual necessity | Necessary to persist user data for service delivery |
| Authentication via rails-sessions | Contractual necessity | Necessary to authenticate and maintain user sessions |
| Data persistence via redis | Contractual necessity | Necessary to persist user data for service delivery |
| AI processing via ruby-openai | Consent / Legitimate interest | Required for AI-powered features; user consent obtained before processing |
| Error/performance monitoring via sentry-ruby | Legitimate interest | Legitimate interest in maintaining service reliability and security |
| Data processing via sidekiq | Legitimate interest | To be documented based on specific use case |
| Payment processing via stripe | Contractual necessity | Necessary to process transactions requested by the user |

### 2.2 Data Minimization

The following data minimization measures should be verified:

**AI Services:**
- [ ] Only data strictly necessary for the AI feature is transmitted to the provider
- [ ] User prompts are not stored beyond the session unless the user explicitly opts in
- [ ] No special category data is included in AI requests without explicit consent

### 2.3 Proportionality

- [ ] The processing is necessary to achieve the stated purpose and cannot be achieved by less intrusive means
- [ ] The volume of data collected is proportionate to the processing purpose
- [ ] Data retention periods are limited to what is strictly necessary
- [ ] Data subjects are clearly informed about the processing

> **Action required:** Document how each processing activity satisfies the necessity and proportionality requirements. Verify that less privacy-intrusive alternatives have been considered.

## 3. Risk Assessment

### 3.1 Methodology

Risk is assessed using a **likelihood x impact** matrix. Each data processing activity is scored on two dimensions:

**Likelihood** (probability of harm occurring):

| Score | Level | Description |
|-------|-------|-------------|
| 1 | Unlikely | Remote chance of occurrence |
| 2 | Possible | Could occur in some circumstances |
| 3 | Likely | Will probably occur |
| 4 | Almost Certain | Expected to occur in most circumstances |

**Impact** (severity of harm to data subjects):

| Score | Level | Description |
|-------|-------|-------------|
| 1 | Negligible | Minor inconvenience, easily recoverable |
| 2 | Limited | Some damage, recoverable with effort |
| 3 | Significant | Serious harm, difficult to recover |
| 4 | Maximum | Irreversible or very serious harm |

**Risk Rating:** Likelihood x Impact

| Rating | Score Range | Action Required |
|--------|-------------|-----------------|
| Low | 1-4 | Accept with standard controls |
| Medium | 5-8 | Mitigate with additional controls |
| High | 9-12 | Significant mitigation required before processing |
| Critical | 13-16 | Must not proceed without DPA consultation and substantial mitigation |

### 3.2 Risk Assessment Results

| # | Processing Activity | Data Processed | Likelihood | Impact | Score | Rating |
|---|---------------------|---------------|------------|--------|-------|--------|
| 1 | Data processing via ActionCable | real-time user data, connection metadata, channel subscriptions, WebSocket messages | 1 (Unlikely) | 1 (Negligible) | **1** | **Low** |
| 2 | Data processing via ActionController::Cookies | session cookies, session data, CSRF tokens | 1 (Unlikely) | 3 (Significant) | **3** | **Low** |
| 3 | Email communications via ActionMailer | email addresses, email content | 2 (Possible) | 2 (Limited) | **4** | **Low** |
| 4 | File storage via Active Storage | uploaded files, file metadata, storage service credentials, potential PII in uploaded content | 1 (Unlikely) | 1 (Negligible) | **1** | **Low** |
| 5 | Data persistence via ActiveRecord | user data as defined in schema, timestamps, associations | 2 (Possible) | 1 (Negligible) | **2** | **Low** |
| 6 | File storage via ActiveStorage | uploaded files, file metadata, storage references | 1 (Unlikely) | 1 (Negligible) | **1** | **Low** |
| 7 | File storage via aws-sdk-s3 | uploaded files, file metadata | 1 (Unlikely) | 1 (Negligible) | **1** | **Low** |
| 8 | Data processing via intercom-ruby | user profiles, email, name, conversations, user behavior | 1 (Unlikely) | 2 (Limited) | **2** | **Low** |
| 9 | Email communications via nodemailer | email addresses, email content | 2 (Possible) | 2 (Limited) | **4** | **Low** |
| 10 | Data persistence via pg | user data as defined in schema | 2 (Possible) | 1 (Negligible) | **2** | **Low** |
| 11 | Payment processing via plaid | bank account data, transaction history, account balances, financial institution data | 2 (Possible) | 4 (Maximum) | **8** | **Medium** |
| 12 | Data processing via rack-attack | IP addresses, request metadata | 1 (Unlikely) | 2 (Limited) | **2** | **Low** |
| 13 | Email communications via rails-actionmailer | email addresses, email content | 2 (Possible) | 2 (Limited) | **4** | **Low** |
| 14 | Data persistence via rails-activerecord | user data as defined in schema | 2 (Possible) | 1 (Negligible) | **2** | **Low** |
| 15 | Authentication via rails-sessions | session cookies, CSRF tokens | 2 (Possible) | 3 (Significant) | **6** | **Medium** |
| 16 | Data persistence via redis | cached data, session data | 2 (Possible) | 3 (Significant) | **6** | **Medium** |
| 17 | AI processing via ruby-openai | user prompts, conversation history, generated content | 3 (Likely) | 2 (Limited) | **6** | **Medium** |
| 18 | Error/performance monitoring via sentry-ruby | error data, stack traces, user context, device information | 2 (Possible) | 1 (Negligible) | **2** | **Low** |
| 19 | Data processing via sidekiq | job data, user data processed in background jobs | 1 (Unlikely) | 1 (Negligible) | **1** | **Low** |
| 20 | Payment processing via stripe | payment information, billing address, email, transaction history | 2 (Possible) | 4 (Maximum) | **8** | **Medium** |

### 3.3 Risk Summary

| Rating | Count |
|--------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 5 |
| Low | 15 |
| **Total** | **20** |

## 4. High-Risk Processing Triggers

Article 35(3) GDPR and the EDPB Guidelines on DPIAs identify specific types of processing that are likely to result in high risk. The following assessment is based on detected services:

| Trigger | Status | Description |
|---------|--------|-------------|
| Large-Scale Profiling | **Not detected** | Systematic evaluation of personal aspects based on automated processing, including profiling (Art. 35(3)(a)) |
| Systematic Monitoring | **Not detected** | Systematic monitoring of a publicly accessible area on a large scale (Art. 35(3)(c)) |
| Sensitive / Special Category Data | **Not detected** | Processing of special categories of data on a large scale (Art. 35(3)(b)) |
| AI-Powered Decision Making | **TRIGGERED** | Automated decision-making with legal or similarly significant effects, including AI inference and content generation (Art. 22 GDPR) |

> **1 high-risk trigger(s) detected.** This DPIA is mandatory under Article 35 GDPR. 

## 5. Data Flow Diagram

A detailed data flow map showing how personal data is collected, stored, processed, and shared across all integrated services is available in the companion document:

> **See [DATA_FLOW_MAP.md](./DATA_FLOW_MAP.md)** for the complete data flow diagram.

The data flow map covers:

- **Collection points:** How and where personal data enters the system
- **Storage locations:** Where personal data is persisted
- **Sharing / third-party transfers:** Which services receive personal data and for what purpose
- **Cross-border transfers:** Data flows outside the EEA

## 6. Risk Mitigation Measures

The following mitigation measures are recommended for each category of data processing activity detected in the application:

### 6.1 Other (ActionCable, ActionController::Cookies, intercom-ruby, rack-attack, sidekiq)

**Current risk rating:** Low

**Recommended measures:**

- [ ] Review data processing activities and apply data minimization
- [ ] Ensure appropriate DPAs are in place with the service provider
- [ ] Conduct periodic reviews of necessity and proportionality

### 6.2 Email (ActionMailer, nodemailer, rails-actionmailer)

**Current risk rating:** Low

**Recommended measures:**

- [ ] Use transactional email only for necessary communications
- [ ] Implement unsubscribe mechanisms for marketing emails
- [ ] Avoid embedding tracking pixels where not strictly necessary
- [ ] Ensure email provider DPA is in place

### 6.3 Storage (Active Storage, ActiveStorage, aws-sdk-s3)

**Current risk rating:** Low

**Recommended measures:**

- [ ] Encrypt files at rest and in transit
- [ ] Implement access controls on stored files
- [ ] Establish data retention and deletion policies for uploaded files
- [ ] Scan uploaded files for malware before storage

### 6.4 Database (ActiveRecord, pg, rails-activerecord, redis)

**Current risk rating:** Medium

**Recommended measures:**

- [ ] Encrypt sensitive fields at the application level
- [ ] Implement role-based access controls for database access
- [ ] Enable audit logging for data access and modifications
- [ ] Establish and enforce data retention schedules

### 6.5 Payment (plaid, stripe)

**Current risk rating:** Medium

**Recommended measures:**

- [ ] Use tokenization to avoid direct handling of payment card data
- [ ] Ensure PCI DSS compliance through the payment processor
- [ ] Limit stored payment data to transaction references only
- [ ] Implement strong authentication for payment-related actions

### 6.6 Auth (rails-sessions)

**Current risk rating:** Medium

**Recommended measures:**

- [ ] Enforce strong password policies or passwordless authentication
- [ ] Implement multi-factor authentication (MFA)
- [ ] Minimize profile data collected during registration
- [ ] Regularly rotate and securely store OAuth tokens and secrets

### 6.7 Ai (ruby-openai)

**Current risk rating:** Medium

**Recommended measures:**

- [ ] Implement input/output filtering to prevent transmission of unnecessary personal data
- [ ] Enable opt-out mechanisms for AI-powered features
- [ ] Conduct regular audits of AI provider data handling practices
- [ ] Minimize data sent to AI providers (data minimization principle)
- [ ] Ensure AI provider DPA is in place with SCCs for international transfers
- [ ] Implement human oversight for AI-assisted decisions affecting individuals

### 6.8 Monitoring (sentry-ruby)

**Current risk rating:** Low

**Recommended measures:**

- [ ] Configure PII scrubbing in error reports and stack traces
- [ ] Limit user context attached to monitoring events
- [ ] Set appropriate data retention periods for monitoring data
- [ ] Restrict access to monitoring dashboards to authorized personnel


## 7. Consultation Requirements

### 7.1 Data Protection Authority Consultation (Art. 36 GDPR)

Under Article 36 GDPR, the controller must consult the supervisory authority prior to processing where a DPIA indicates that the processing would result in a high risk in the absence of measures taken by the controller to mitigate the risk.

**Consultation required:** **Not at this time** — Based on the current risk assessment, the identified risks can be mitigated through the measures outlined in this DPIA. However, this should be re-evaluated if processing activities change.

### 7.2 Internal Consultation

Regardless of DPA consultation requirements, the following internal stakeholders should review this DPIA:

- [ ] Data Protection Officer
- [ ] Legal / Compliance team
- [ ] Engineering / Development team
- [ ] Information Security team
- [ ] Product Management

## 8. Review and Monitoring

### 8.1 Review Schedule

This DPIA must be reviewed:

- **At least annually**, or
- When there is a **significant change** in processing operations, including:
  - New services or data processors added
  - Changes in the type or volume of data processed
  - New purposes for processing
  - Changes in the technical or organizational measures
  - Security incidents involving personal data

### 8.2 Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-16 | Auto-generated | Initial DPIA based on code analysis |

> **Action required:** Maintain this version history as the DPIA is reviewed and updated.

## 9. Approval and Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Data Controller | _________________ | _________________ | __________ |
| Data Protection Officer | _________________ | _________________ | __________ |
| IT / Security Lead | _________________ | _________________ | __________ |
| Legal / Compliance | _________________ | _________________ | __________ |

---

*This Privacy Impact Assessment was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. This document is a starting point and must be reviewed, completed, and approved by qualified personnel including your Data Protection Officer and legal counsel to ensure compliance with GDPR Article 35 and other applicable regulations. It does not constitute legal advice.*