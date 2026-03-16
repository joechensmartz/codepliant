# Privacy Impact Assessment (DPIA)

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** formbricks

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

This assessment covers the data processing activities of the **formbricks** application operated by [Your Company Name]. The following describes the nature, scope, context, and purposes of processing.

### 1.2 Services and Data Processing Activities

The application integrates the following services that process personal data:

| Service | Category | Data Processed | Legal Basis |
|---------|----------|---------------|-------------|
| @aws-sdk/client-s3 | storage | uploaded files, file metadata | Contractual necessity |
| @sentry/nextjs | monitoring | error data, stack traces, user context, device information, IP address | Legitimate interest |
| googleapis | other | user data via Google APIs, calendar data, email data, profile information | Legitimate interest |
| ioredis | database | cached data, session data | Contractual necessity |
| next-auth | auth | email, name, profile picture, OAuth tokens, session data | Contractual necessity |
| nodemailer | email | email addresses, email content | Contractual necessity / Consent |
| posthog | analytics | user behavior, session recordings, feature flag usage, device information | Consent |
| prisma | database | user data as defined in schema | Contractual necessity |
| redis | database | cached data, session data | Contractual necessity |
| stripe | payment | payment information, billing address, email, transaction history | Contractual necessity |

### 1.3 Categories of Personal Data

- **Personal Identity Data:** Email addresses, names, profile pictures, and account credentials collected through authentication. names detected in OpenAPI/Swagger spec fields: schema.name, data.name, items.name, RequestBody.name (POST /api/v1/webhooks), contactAttributeKey.name, survey.name, blocks.name, variables.name, webhook.name, team.name, user.name, contactAttributeKeyInput.name, contactAttributeKeyUpdate.name, RequestBody.name (PUT /management/contacts/bulk), RequestBody.name (POST /management/contact-attribute-keys), RequestBody.name (PUT /management/contact-attribute-keys/{id}), RequestBody.name (POST /management/webhooks), RequestBody.name (PUT /management/webhooks/{id}), RequestBody.name (POST /organizations/{organizationId}/teams), RequestBody.name (PUT /organizations/{organizationId}/teams/{id}), RequestBody.name (POST /organizations/{organizationId}/users), RequestBody.name (PATCH /organizations/{organizationId}/users). (sources: next-auth, schema.name, data.name, items.name, RequestBody.name (POST /api/v1/webhooks), contactAttributeKey.name, survey.name, blocks.name, variables.name, webhook.name, team.name, user.name, contactAttributeKeyInput.name, contactAttributeKeyUpdate.name, RequestBody.name (PUT /management/contacts/bulk), RequestBody.name (POST /management/contact-attribute-keys), RequestBody.name (PUT /management/contact-attribute-keys/{id}), RequestBody.name (POST /management/webhooks), RequestBody.name (PUT /management/webhooks/{id}), RequestBody.name (POST /organizations/{organizationId}/teams), RequestBody.name (PUT /organizations/{organizationId}/teams/{id}), RequestBody.name (POST /organizations/{organizationId}/users), RequestBody.name (PATCH /organizations/{organizationId}/users))
- **Financial Data:** Payment card information, billing addresses, and transaction history processed through payment providers. (sources: stripe)
- **Usage & Behavioral Data:** Page views, click patterns, session recordings, device information, and IP addresses collected through analytics tools. (sources: posthog)
- **Communication Data:** Email addresses and email content processed through email service providers. (sources: nodemailer)
- **Technical & Diagnostic Data:** Error reports, stack traces, performance data, and user context collected through monitoring tools. (sources: @sentry/nextjs)
- **User-Uploaded Content:** Files, images, and documents uploaded by users and stored through cloud storage providers. (sources: @aws-sdk/client-s3, AWS)
- **Stored User Data:** Persistent user data stored in databases as defined by the application schema. (sources: prisma, redis, ioredis, Redis (Cache))
- **Technical Data:** user agent strings detected in OpenAPI/Swagger spec fields: schema.userAgent, response.userAgent, RequestBody.userAgent (POST /responses), RequestBody.userAgent (PUT /responses/{id}), RequestBody.userAgent (POST /management/responses), RequestBody.userAgent (PUT /management/responses/{id}). (sources: schema.userAgent, response.userAgent, RequestBody.userAgent (POST /responses), RequestBody.userAgent (PUT /responses/{id}), RequestBody.userAgent (POST /management/responses), RequestBody.userAgent (PUT /management/responses/{id}))
- **Contact Information:** email addresses detected in OpenAPI/Swagger spec fields: schema.email, user.email, RequestBody.email (POST /organizations/{organizationId}/users), RequestBody.email (PATCH /organizations/{organizationId}/users). (sources: schema.email, user.email, RequestBody.email (POST /organizations/{organizationId}/users), RequestBody.email (PATCH /organizations/{organizationId}/users))

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
| File storage via @aws-sdk/client-s3 | Contractual necessity | Necessary to provide file storage features requested by the user |
| Error/performance monitoring via @sentry/nextjs | Legitimate interest | Legitimate interest in maintaining service reliability and security |
| Data processing via googleapis | Legitimate interest | To be documented based on specific use case |
| Data persistence via ioredis | Contractual necessity | Necessary to persist user data for service delivery |
| Authentication via next-auth | Contractual necessity | Necessary to authenticate and maintain user sessions |
| Email communications via nodemailer | Contractual necessity / Consent | Necessary for service communications; marketing requires separate consent |
| Behavioral analytics via posthog | Consent | Used to understand usage patterns and improve the service; requires prior consent |
| Data persistence via prisma | Contractual necessity | Necessary to persist user data for service delivery |
| Data persistence via redis | Contractual necessity | Necessary to persist user data for service delivery |
| Payment processing via stripe | Contractual necessity | Necessary to process transactions requested by the user |

### 2.2 Data Minimization

The following data minimization measures should be verified:


**Analytics Services:**
- [ ] IP anonymization is enabled
- [ ] Only necessary tracking events are collected
- [ ] Session recording excludes sensitive form fields
- [ ] Data retention periods are configured to the minimum necessary

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
| 1 | File storage via @aws-sdk/client-s3 | uploaded files, file metadata | 1 (Unlikely) | 1 (Negligible) | **1** | **Low** |
| 2 | Error/performance monitoring via @sentry/nextjs | error data, stack traces, user context, device information, IP address | 2 (Possible) | 2 (Limited) | **4** | **Low** |
| 3 | Data processing via googleapis | user data via Google APIs, calendar data, email data, profile information | 1 (Unlikely) | 2 (Limited) | **2** | **Low** |
| 4 | Data persistence via ioredis | cached data, session data | 2 (Possible) | 3 (Significant) | **6** | **Medium** |
| 5 | Authentication via next-auth | email, name, profile picture, OAuth tokens, session data | 2 (Possible) | 3 (Significant) | **6** | **Medium** |
| 6 | Email communications via nodemailer | email addresses, email content | 2 (Possible) | 2 (Limited) | **4** | **Low** |
| 7 | Behavioral analytics via posthog | user behavior, session recordings, feature flag usage, device information | 3 (Likely) | 3 (Significant) | **9** | **High** |
| 8 | Data persistence via prisma | user data as defined in schema | 2 (Possible) | 1 (Negligible) | **2** | **Low** |
| 9 | Data persistence via redis | cached data, session data | 2 (Possible) | 3 (Significant) | **6** | **Medium** |
| 10 | Payment processing via stripe | payment information, billing address, email, transaction history | 2 (Possible) | 4 (Maximum) | **8** | **Medium** |

### 3.3 Risk Summary

| Rating | Count |
|--------|-------|
| Critical | 0 |
| High | 1 |
| Medium | 4 |
| Low | 5 |
| **Total** | **10** |

## 4. High-Risk Processing Triggers

Article 35(3) GDPR and the EDPB Guidelines on DPIAs identify specific types of processing that are likely to result in high risk. The following assessment is based on detected services:

| Trigger | Status | Description |
|---------|--------|-------------|
| Large-Scale Profiling | **TRIGGERED** | Systematic evaluation of personal aspects based on automated processing, including profiling (Art. 35(3)(a)) |
| Systematic Monitoring | **TRIGGERED** | Systematic monitoring of a publicly accessible area on a large scale (Art. 35(3)(c)) |
| Sensitive / Special Category Data | **Not detected** | Processing of special categories of data on a large scale (Art. 35(3)(b)) |
| AI-Powered Decision Making | **Not detected** | Automated decision-making with legal or similarly significant effects, including AI inference and content generation (Art. 22 GDPR) |

> **2 high-risk trigger(s) detected.** This DPIA is mandatory under Article 35 GDPR. Multiple triggers increase the overall risk profile.

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

### 6.1 Storage (@aws-sdk/client-s3)

**Current risk rating:** Low

**Recommended measures:**

- [ ] Encrypt files at rest and in transit
- [ ] Implement access controls on stored files
- [ ] Establish data retention and deletion policies for uploaded files
- [ ] Scan uploaded files for malware before storage

### 6.2 Monitoring (@sentry/nextjs)

**Current risk rating:** Low

**Recommended measures:**

- [ ] Configure PII scrubbing in error reports and stack traces
- [ ] Limit user context attached to monitoring events
- [ ] Set appropriate data retention periods for monitoring data
- [ ] Restrict access to monitoring dashboards to authorized personnel

### 6.3 Other (googleapis)

**Current risk rating:** Low

**Recommended measures:**

- [ ] Review data processing activities and apply data minimization
- [ ] Ensure appropriate DPAs are in place with the service provider
- [ ] Conduct periodic reviews of necessity and proportionality

### 6.4 Database (ioredis, prisma, redis)

**Current risk rating:** Medium

**Recommended measures:**

- [ ] Encrypt sensitive fields at the application level
- [ ] Implement role-based access controls for database access
- [ ] Enable audit logging for data access and modifications
- [ ] Establish and enforce data retention schedules

### 6.5 Auth (next-auth)

**Current risk rating:** Medium

**Recommended measures:**

- [ ] Enforce strong password policies or passwordless authentication
- [ ] Implement multi-factor authentication (MFA)
- [ ] Minimize profile data collected during registration
- [ ] Regularly rotate and securely store OAuth tokens and secrets

### 6.6 Email (nodemailer)

**Current risk rating:** Low

**Recommended measures:**

- [ ] Use transactional email only for necessary communications
- [ ] Implement unsubscribe mechanisms for marketing emails
- [ ] Avoid embedding tracking pixels where not strictly necessary
- [ ] Ensure email provider DPA is in place

### 6.7 Analytics (posthog)

**Current risk rating:** High

**Recommended measures:**

- [ ] Enable IP anonymization / pseudonymization where available
- [ ] Implement cookie consent management with granular opt-in/opt-out
- [ ] Configure data retention limits within the analytics platform
- [ ] Limit collection to strictly necessary data points
- [ ] Disable session recordings for authenticated areas with sensitive data
- [ ] Conduct regular data minimization reviews

### 6.8 Payment (stripe)

**Current risk rating:** Medium

**Recommended measures:**

- [ ] Use tokenization to avoid direct handling of payment card data
- [ ] Ensure PCI DSS compliance through the payment processor
- [ ] Limit stored payment data to transaction references only
- [ ] Implement strong authentication for payment-related actions


## 7. Consultation Requirements

### 7.1 Data Protection Authority Consultation (Art. 36 GDPR)

Under Article 36 GDPR, the controller must consult the supervisory authority prior to processing where a DPIA indicates that the processing would result in a high risk in the absence of measures taken by the controller to mitigate the risk.

**Consultation required:** **YES** — Based on the risk assessment, consultation with your Data Protection Authority is recommended before proceeding with processing.

### 7.2 When to Consult

You should consult your supervisory authority when:

1. The DPIA indicates that processing would result in a high risk that cannot be sufficiently mitigated
2. You are uncertain whether your mitigation measures adequately address the identified risks
3. National law requires consultation for this type of processing

### 7.3 Consultation Process

1. Compile this DPIA and all supporting documentation
2. Document the mitigation measures you have implemented or plan to implement
3. Submit to your lead supervisory authority (the DPA in the EU Member State where your main establishment is located)
4. The DPA has up to 8 weeks (extendable by 6 weeks) to provide written advice
5. Do not proceed with the processing until you receive the DPA's response

### 7.4 Internal Consultation

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