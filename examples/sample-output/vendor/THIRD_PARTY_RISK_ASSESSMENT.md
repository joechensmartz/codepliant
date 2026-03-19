# Third-Party Risk Assessment

> **Document Version:** 1.0  
> **Document Owner:** Acme Inc  
> **Next Review Date:** 2027-03-18


**Last updated:** 2026-03-18

**Project:** nextjs-saas-example

**Assessor:** Acme Inc

## Related Documents

- Sub-Processor List (`SUBPROCESSOR_LIST.md`)
- Vendor Contacts Directory (`VENDOR_CONTACTS.md`)
- Vendor Security Questionnaire (`VENDOR_SECURITY_QUESTIONNAIRE.md`)
- Risk Register (`RISK_REGISTER.md`)

---

## Overview

This document provides a risk assessment of all third-party services integrated into the **nextjs-saas-example** application. Each vendor has been evaluated for data sensitivity, geographic risk, compliance certifications, data processing scope, and risk mitigation measures.

Total third-party vendors assessed: **7**

For questions about this assessment, contact legal@acme.com.

---

## Risk Matrix

| Vendor | Category | Data Sensitivity | Geographic Risk | Certifications | Overall Risk |
|--------|----------|-----------------|----------------|---------------|-------------|
| Sentry | monitoring | low | US | SOC 2 Type II, ISO 27001, GDPR | Low |
| Supabase | auth | high | Other | SOC 2 Type II, ISO 27001, GDPR | Critical |
| OpenAI | ai | high | US | SOC 2 Type II, GDPR | Critical |
| PostHog | analytics | medium | US | SOC 2 Type II, GDPR | High |
| Resend | email | medium | US | SOC 2 Type II, GDPR | High |
| Stripe | payment | high | US | PCI DSS Level 1, SOC 2 Type II, ISO 27001, GDPR | High |
| stripe-ios | payment | high | Other | None verified | Critical |

---

## Detailed Vendor Assessments

### Sentry

| Attribute | Detail |
|-----------|--------|
| **Category** | monitoring |
| **Data Processed** | error data, stack traces, user context, device information, IP address |
| **Data Sensitivity** | low |
| **Geographic Location** | US |
| **Geographic Risk** | Medium — EU-US Data Privacy Framework applicable |
| **Certifications** | SOC 2 Type II, ISO 27001, GDPR |
| **Processing Scope** | Error logs, stack traces, performance metrics |
| **Overall Risk Level** | Low |

**Risk Mitigation Measures:**

- PII scrubbing in error reports
- Short retention periods for logs
- Access restricted to engineering team

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)
- [ ] Standard Contractual Clauses (SCCs) — for cross-border transfers

### Supabase

| Attribute | Detail |
|-----------|--------|
| **Category** | auth |
| **Data Processed** | email, password hash, session data, user metadata |
| **Data Sensitivity** | high |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | SOC 2 Type II, ISO 27001, GDPR |
| **Processing Scope** | Identity verification, session management, credential storage |
| **Overall Risk Level** | Critical |

**Risk Mitigation Measures:**

- Industry-standard authentication protocols (OAuth 2.0, OIDC)
- Passwords never stored in plaintext
- Session tokens rotated regularly

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)

### OpenAI

| Attribute | Detail |
|-----------|--------|
| **Category** | ai |
| **Data Processed** | user prompts, conversation history, generated content |
| **Data Sensitivity** | high |
| **Geographic Location** | US |
| **Geographic Risk** | Medium — EU-US Data Privacy Framework applicable |
| **Certifications** | SOC 2 Type II, GDPR |
| **Processing Scope** | User input processing, content generation, model training (per vendor policy) |
| **Overall Risk Level** | Critical |

**Risk Mitigation Measures:**

- Data minimization — only necessary context sent to AI provider
- Opt-out mechanism for AI processing where applicable
- Review vendor data retention and training policies

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)
- [ ] AI-specific data usage addendum
- [ ] BAA (Business Associate Agreement) — if handling PHI
- [ ] Standard Contractual Clauses (SCCs) — for cross-border transfers

### PostHog

| Attribute | Detail |
|-----------|--------|
| **Category** | analytics |
| **Data Processed** | user behavior, session recordings, feature flag usage, device information |
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

### Resend

| Attribute | Detail |
|-----------|--------|
| **Category** | email |
| **Data Processed** | email addresses, email content |
| **Data Sensitivity** | medium |
| **Geographic Location** | US |
| **Geographic Risk** | Medium — EU-US Data Privacy Framework applicable |
| **Certifications** | SOC 2 Type II, GDPR |
| **Processing Scope** | Email addresses, message content, delivery metadata |
| **Overall Risk Level** | High |

**Risk Mitigation Measures:**

- TLS encryption for email transmission
- Unsubscribe mechanism in all marketing emails
- Email content not stored beyond delivery

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)
- [ ] Standard Contractual Clauses (SCCs) — for cross-border transfers

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

### stripe-ios

| Attribute | Detail |
|-----------|--------|
| **Category** | payment |
| **Data Processed** | payment information, billing address, email, transaction history |
| **Data Sensitivity** | high |
| **Geographic Location** | Other |
| **Geographic Risk** | High — verify adequacy decision or implement SCCs |
| **Certifications** | None verified |
| **Processing Scope** | Payment card processing, billing records, transaction history |
| **Overall Risk Level** | Critical |

**Risk Mitigation Measures:**

- PCI DSS compliant processor handles all card data
- No raw payment data stored in application
- Tokenization used for recurring payments

**Required Contracts:**

- [ ] DPA (Data Processing Agreement)
- [ ] PCI DSS Attestation of Compliance

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
- [ ] BAA (Business Associate Agreement) — if handling PHI
- [ ] PCI DSS Attestation of Compliance

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