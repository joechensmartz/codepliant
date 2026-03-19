> **Document Version:** 1.0  
> **Document Owner:** Acme Inc  
> **Next Review Date:** 2027-03-18


**Last updated:** 2026-03-18

**Project:** nextjs-saas-example

**Data Controller:** Acme Inc

**Contact:** legal@acme.com

**DPO:** Jane Mueller (dpo@acme-saas.com)

## Related Documents

- Privacy Policy (`PRIVACY_POLICY.md`)
- Record of Processing Activities (`RECORD_OF_PROCESSING_ACTIVITIES.md`)
- Risk Register (`RISK_REGISTER.md`)
- Lawful Basis Assessment (`LAWFUL_BASIS_ASSESSMENT.md`)

---

> This Data Protection Impact Assessment is prepared pursuant to **Article 35 of the General Data Protection Regulation (EU) 2016/679 (GDPR)**. A DPIA is required when data processing is likely to result in a high risk to the rights and freedoms of natural persons, particularly when using new technologies.

## 1. Description of Processing

### 1.1 Overview

This assessment covers the data processing activities of the **nextjs-saas-example** application operated by Acme Inc. The following describes the nature, scope, context, and purposes of processing.

### 1.2 Services and Data Processing Activities

The application integrates the following services that process personal data:

| Service | Category | Data Processed | Legal Basis |
|---------|----------|---------------|-------------|
| @sentry/node | monitoring | error data, stack traces, user context, device information, IP address | Legitimate interest |
| @supabase/supabase-js | auth | email, password hash, session data, user metadata | Contractual necessity |
| openai | ai | user prompts, conversation history, generated content | Consent / Legitimate interest |
| posthog | analytics | user behavior, session recordings, feature flag usage, device information | Consent |
| prisma | database | user data as defined in schema | Contractual necessity |
| resend | email | email addresses, email content | Contractual necessity / Consent |
| stripe | payment | payment information, billing address, email, transaction history | Contractual necessity |
| stripe-ios | payment | payment information, billing address, email, transaction history | Contractual necessity |

### 1.3 Categories of Personal Data

- **Personal Identity Data:** Email addresses, names, profile pictures, and account credentials collected through authentication. names detected in Prisma schema fields: User.name. (sources: @supabase/supabase-js, User.name)
- **Financial Data:** Payment card information, billing addresses, and transaction history processed through payment providers. (sources: stripe, stripe-ios)
- **Usage & Behavioral Data:** Page views, click patterns, session recordings, device information, and IP addresses collected through analytics tools. (sources: posthog)
- **AI Interaction Data:** User prompts, conversation history, and AI-generated content processed through third-party AI services. (sources: openai)
- **Communication Data:** Email addresses and email content processed through email service providers. (sources: resend)
- **Technical & Diagnostic Data:** Error reports, stack traces, performance data, and user context collected through monitoring tools. (sources: @sentry/node)
- **Stored User Data:** Persistent user data stored in databases as defined by the application schema. (sources: prisma)
- **Contact Information:** email addresses, phone numbers detected in Prisma schema fields: User.email, User.phone. (sources: User.email, User.phone)
- **Authentication Data:** password hashes detected in Prisma schema fields: User.passwordHash. (sources: User.passwordHash)

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
| Error/performance monitoring via @sentry/node | Legitimate interest | Legitimate interest in maintaining service reliability and security |
| Authentication via @supabase/supabase-js | Contractual necessity | Necessary to authenticate and maintain user sessions |
| AI processing via openai | Consent / Legitimate interest | Required for AI-powered features; user consent obtained before processing |
| Behavioral analytics via posthog | Consent | Used to understand usage patterns and improve the service; requires prior consent |
| Data persistence via prisma | Contractual necessity | Necessary to persist user data for service delivery |
| Email communications via resend | Contractual necessity / Consent | Necessary for service communications; marketing requires separate consent |
| Payment processing via stripe | Contractual necessity | Necessary to process transactions requested by the user |
| Payment processing via stripe-ios | Contractual necessity | Necessary to process transactions requested by the user |

### 2.2 Data Minimization

The following data minimization measures should be verified:

**AI Services:**
- [ ] Only data strictly necessary for the AI feature is transmitted to the provider
- [ ] User prompts are not stored beyond the session unless the user explicitly opts in
- [ ] No special category data is included in AI requests without explicit consent

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
| 1 | Error/performance monitoring via @sentry/node | error data, stack traces, user context, device information, IP address | 2 (Possible) | 2 (Limited) | **4** | **Low** |
| 2 | Authentication via @supabase/supabase-js | email, password hash, session data, user metadata | 2 (Possible) | 3 (Significant) | **6** | **Medium** |
| 3 | AI processing via openai | user prompts, conversation history, generated content | 3 (Likely) | 2 (Limited) | **6** | **Medium** |
| 4 | Behavioral analytics via posthog | user behavior, session recordings, feature flag usage, device information | 3 (Likely) | 3 (Significant) | **9** | **High** |
| 5 | Data persistence via prisma | user data as defined in schema | 2 (Possible) | 1 (Negligible) | **2** | **Low** |
| 6 | Email communications via resend | email addresses, email content | 2 (Possible) | 2 (Limited) | **4** | **Low** |
| 7 | Payment processing via stripe | payment information, billing address, email, transaction history | 2 (Possible) | 4 (Maximum) | **8** | **Medium** |
| 8 | Payment processing via stripe-ios | payment information, billing address, email, transaction history | 2 (Possible) | 4 (Maximum) | **8** | **Medium** |

### 3.3 Risk Summary

| Rating | Count |
|--------|-------|
| Critical | 0 |
| High | 1 |
| Medium | 4 |
| Low | 3 |
| **Total** | **8** |

## 4. High-Risk Processing Triggers

Article 35(3) GDPR and the EDPB Guidelines on DPIAs identify specific types of processing that are likely to result in high risk. The following assessment is based on detected services:

| Trigger | Status | Description |
|---------|--------|-------------|
| Large-Scale Profiling | **TRIGGERED** | Systematic evaluation of personal aspects based on automated processing, including profiling (Art. 35(3)(a)) |
| Systematic Monitoring | **TRIGGERED** | Systematic monitoring of a publicly accessible area on a large scale (Art. 35(3)(c)) |
| Sensitive / Special Category Data | **Not detected** | Processing of special categories of data on a large scale (Art. 35(3)(b)) |
| AI-Powered Decision Making | **TRIGGERED** | Automated decision-making with legal or similarly significant effects, including AI inference and content generation (Art. 22 GDPR) |

> **3 high-risk trigger(s) detected.** This DPIA is mandatory under Article 35 GDPR. Multiple triggers increase the overall risk profile.

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

### 6.1 Monitoring (@sentry/node)

**Current risk rating:** Low

**Recommended measures:**

- [ ] Configure PII scrubbing in error reports and stack traces
- [ ] Limit user context attached to monitoring events
- [ ] Set appropriate data retention periods for monitoring data
- [ ] Restrict access to monitoring dashboards to authorized personnel

### 6.2 Auth (@supabase/supabase-js)

**Current risk rating:** Medium

**Recommended measures:**

- [ ] Enforce strong password policies or passwordless authentication
- [ ] Implement multi-factor authentication (MFA)
- [ ] Minimize profile data collected during registration
- [ ] Regularly rotate and securely store OAuth tokens and secrets

### 6.3 Ai (openai)

**Current risk rating:** Medium

**Recommended measures:**

- [ ] Implement input/output filtering to prevent transmission of unnecessary personal data
- [ ] Enable opt-out mechanisms for AI-powered features
- [ ] Conduct regular audits of AI provider data handling practices
- [ ] Minimize data sent to AI providers (data minimization principle)
- [ ] Ensure AI provider DPA is in place with SCCs for international transfers
- [ ] Implement human oversight for AI-assisted decisions affecting individuals

### 6.4 Analytics (posthog)

**Current risk rating:** High

**Recommended measures:**

- [ ] Enable IP anonymization / pseudonymization where available
- [ ] Implement cookie consent management with granular opt-in/opt-out
- [ ] Configure data retention limits within the analytics platform
- [ ] Limit collection to strictly necessary data points
- [ ] Disable session recordings for authenticated areas with sensitive data
- [ ] Conduct regular data minimization reviews

### 6.5 Database (prisma)

**Current risk rating:** Low

**Recommended measures:**

- [ ] Encrypt sensitive fields at the application level
- [ ] Implement role-based access controls for database access
- [ ] Enable audit logging for data access and modifications
- [ ] Establish and enforce data retention schedules

### 6.6 Email (resend)

**Current risk rating:** Low

**Recommended measures:**

- [ ] Use transactional email only for necessary communications
- [ ] Implement unsubscribe mechanisms for marketing emails
- [ ] Avoid embedding tracking pixels where not strictly necessary
- [ ] Ensure email provider DPA is in place

### 6.7 Payment (stripe, stripe-ios)

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
| 1.0 | 2026-03-18 | Auto-generated | Initial DPIA based on code analysis |

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