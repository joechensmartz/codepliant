# Privacy Impact Register

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


---

> **Organization:** [Your Company Name]  
> **Register Owner:** [Data Protection Officer Name] ([your-email@example.com])  
> **Last Updated:** 2026-03-16  
> **Next Full Review:** 2027-03-16

> **Important:** This Privacy Impact Register is auto-generated based on automated code analysis. It identifies processing activities that may require a Data Protection Impact Assessment (DPIA) under GDPR Art. 35(1). Each entry should be reviewed, completed, and signed off by the DPO. This register must be maintained as a living document and updated whenever new processing activities are introduced or existing ones change materially.

## 1. Purpose

This register tracks all Privacy Impact Assessments (PIAs) and Data Protection Impact Assessments (DPIAs) conducted by [Your Company Name]. Under GDPR Art. 35(1), a DPIA is required when processing is "likely to result in a high risk to the rights and freedoms of natural persons."

This register serves to:

- Maintain a complete inventory of all PIAs/DPIAs conducted
- Track the status, outcome, and follow-up actions for each assessment
- Demonstrate accountability to supervisory authorities (GDPR Art. 5(2))
- Schedule timely reviews and reassessments
- Identify processing activities that require new or updated assessments

## 2. When a DPIA Is Required

Under GDPR Art. 35(3), a DPIA is mandatory when processing involves:

- [ ] Systematic and extensive evaluation of personal aspects (profiling)
- [ ] Processing of special categories of data on a large scale
- [ ] Systematic monitoring of a publicly accessible area on a large scale
- [ ] Automated decision-making with legal or significant effects
- [ ] Large-scale processing of personal data
- [ ] Matching or combining datasets from different sources
- [ ] Processing data of vulnerable individuals (children, employees)
- [ ] Innovative use of new technologies
- [ ] Cross-border data transfers outside EEA
- [ ] Processing that prevents data subjects from exercising a right or using a service

## 3. Register of Assessments

### 3.1 Assessment Summary

| # | Assessment Title | Type | Date Conducted | Status | Risk Level | Reviewer | Next Review |
|---|-----------------|------|----------------|--------|------------|----------|-------------|
| 1 | Payment Data Processing Assessment | DPIA | 2026-03-16 | Pending Review | High | [Data Protection Officer Name] | 2027-03-16 |
| 2 | Analytics & Tracking Assessment | DPIA | 2026-03-16 | Pending Review | Medium | [Data Protection Officer Name] | 2027-03-16 |
| 3 | User Authentication & Identity Assessment | PIA | 2026-03-16 | Pending Review | Medium | [Data Protection Officer Name] | 2027-03-16 |
| 4 | Application Monitoring Assessment | PIA | 2026-03-16 | Pending Review | Low | [Data Protection Officer Name] | 2027-03-16 |
| 5 | General Personal Data Processing Assessment | PIA | 2026-03-16 | Pending Review | Medium | [Data Protection Officer Name] | 2027-03-16 |
| 6 | Cross-Border Data Transfer Assessment | DPIA | 2026-03-16 | Pending Review | High | [Data Protection Officer Name] | 2027-03-16 |

### 3.2 Detailed Assessment Records

#### Assessment 1: Payment Data Processing

| Field | Details |
|-------|---------|
| **Assessment ID** | DPIA-20260316-PAY |
| **Date Conducted** | 2026-03-16 |
| **Type** | Full DPIA (GDPR Art. 35) |
| **Scope** | Payment services: stripe |
| **Processing Description** | Collection and processing of payment and financial data |
| **Data Subjects** | Customers, purchasers |
| **Data Categories** | payment information, billing address, email, transaction history |
| **Legal Basis** | Contract performance (Art. 6(1)(b)) |
| **Risk Level** | High |
| **DPIA Trigger** | Financial data, large-scale processing |
| **Status** | Pending Review |
| **Reviewer** | [Data Protection Officer Name] |
| **Outcome** | [To be completed after review] |
| **Mitigations Required** | PCI DSS compliance, encryption, tokenization, minimal data retention |
| **Next Review** | 2027-03-16 |

#### Assessment 2: Analytics & Tracking

| Field | Details |
|-------|---------|
| **Assessment ID** | DPIA-20260316-ANALYTICS |
| **Date Conducted** | 2026-03-16 |
| **Type** | DPIA (GDPR Art. 35) |
| **Scope** | Analytics services: posthog |
| **Processing Description** | Collection of user behavior data, page views, interactions, and device information for product analytics |
| **Data Subjects** | Website visitors, app users |
| **Data Categories** | user behavior, session recordings, feature flag usage, device information |
| **Legal Basis** | Consent (Art. 6(1)(a)) or Legitimate interest (Art. 6(1)(f)) |
| **Risk Level** | Medium |
| **DPIA Trigger** | Systematic monitoring of user behavior |
| **Status** | Pending Review |
| **Reviewer** | [Data Protection Officer Name] |
| **Outcome** | [To be completed after review] |
| **Mitigations Required** | Cookie consent mechanism, data anonymization, retention limits, opt-out capability |
| **Next Review** | 2027-03-16 |

#### Assessment 3: General Personal Data Processing

| Field | Details |
|-------|---------|
| **Assessment ID** | PIA-20260316-GENERAL |
| **Date Conducted** | 2026-03-16 |
| **Type** | Privacy Impact Assessment |
| **Scope** | All 10 detected services and general data processing |
| **Processing Description** | General collection, storage, and processing of personal data through the application |
| **Data Subjects** | End users, customers, website visitors |
| **Data Categories** | Personal Identity Data, Financial Data, Usage & Behavioral Data, Communication Data, Technical & Diagnostic Data, User-Uploaded Content, Stored User Data, Technical Data, Contact Information |
| **Legal Basis** | Various (per processing activity) |
| **Risk Level** | Medium |
| **Status** | Pending Review |
| **Reviewer** | [Data Protection Officer Name] |
| **Outcome** | [To be completed after review] |
| **Mitigations Required** | Privacy by design, data minimization, access controls, encryption |
| **Next Review** | 2027-03-16 |

## 4. Risk Assessment Matrix

| Processing Activity | Likelihood | Severity | Risk Level | Acceptable? | Mitigation Status |
|-------------------|-----------|----------|-----------|------------|-------------------|
| Payment processing | Medium | High | **High** | Requires mitigation | Pending |
| User analytics/tracking | Medium | Medium | **Medium** | Requires review | Pending |
| User authentication | Low | High | **Medium** | Requires review | Pending |
| Application monitoring | Low | Low | **Low** | Acceptable | N/A |
| General data processing | Medium | Medium | **Medium** | Requires review | Pending |

## 5. Third-Party Services Inventory

The following services were detected and should be included in relevant PIAs/DPIAs:

| Service | Category | Data Collected | DPIA Required? | Assessment Status |
|---------|----------|---------------|---------------|-------------------|
| @aws-sdk/client-s3 | storage | uploaded files, file metadata | Review needed | Pending |
| @sentry/nextjs | monitoring | error data, stack traces, user context | Review needed | Pending |
| googleapis | other | user data via Google APIs, calendar data, email data | Review needed | Pending |
| ioredis | database | cached data, session data | Review needed | Pending |
| next-auth | auth | email, name, profile picture | Review needed | Pending |
| nodemailer | email | email addresses, email content | Review needed | Pending |
| posthog | analytics | user behavior, session recordings, feature flag usage | Review needed | Pending |
| prisma | database | user data as defined in schema | Review needed | Pending |
| redis | database | cached data, session data | Review needed | Pending |
| stripe | payment | payment information, billing address, email | Yes | Pending |

## 6. Outcome Tracking

### Status Definitions

| Status | Definition |
|--------|-----------|
| **Pending** | Assessment identified but not yet started |
| **In Progress** | Assessment underway, not yet completed |
| **Pending Review** | Assessment completed, awaiting DPO/management review |
| **Approved** | Assessment reviewed and approved; processing may proceed |
| **Approved with Conditions** | Processing may proceed subject to implementing specific mitigations |
| **Rejected** | Processing must not proceed until risks are adequately mitigated |
| **Needs Reassessment** | Material changes require a new assessment |

## 7. Review History

| Date | Action | Performed By | Notes |
|------|--------|-------------|-------|
| 2026-03-16 | Register created | Codepliant (automated) | Initial register generated from code scan |
| | | | |

*Add entries here as assessments are completed, reviewed, or updated.*

## 8. Supervisory Authority Consultation

Under GDPR Art. 36, the controller must consult the supervisory authority **prior to processing** if a DPIA indicates that the processing would result in a high risk in the absence of measures taken by the controller to mitigate the risk.

### When to Consult

- [ ] The DPIA reveals residual high risks that cannot be sufficiently mitigated
- [ ] The supervisory authority's published list requires consultation for this type of processing
- [ ] The processing involves cross-border transfers with no adequacy decision or appropriate safeguards

## 9. Contact

For questions about this register or to request an assessment:

- **DPO:** [Data Protection Officer Name] ([your-email@example.com])
- **Privacy Team:** [your-email@example.com]

---

*This Privacy Impact Register was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. It identifies processing activities that may require assessment but does not constitute a completed DPIA. Organizations must conduct thorough assessments for each identified activity and engage legal counsel and the DPO to complete this register.*
