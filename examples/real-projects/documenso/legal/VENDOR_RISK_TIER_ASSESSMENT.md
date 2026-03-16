# Vendor Risk Tier Assessment

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** @documenso/root

**Organization:** [Your Company Name]

**Assessment contact:** [your-email@example.com]

---

## Executive Summary

This assessment classifies **8 third-party vendors** detected in the **@documenso/root** codebase into risk tiers based on three factors:

1. **Data Sensitivity** — The type and sensitivity of personal data the vendor processes
2. **Data Volume** — The scale of data processing (transaction volume, user base coverage)
3. **Replaceability** — How difficult it would be to migrate away from the vendor

### Tier Distribution

| Tier | Count | Review Frequency |
|------|-------|-----------------|
| Critical | 1 | Quarterly (every 3 months) |
| High | 0 | Semi-annually (every 6 months) |
| Medium | 3 | Annually (every 12 months) |
| Low | 4 | Biannually (every 24 months) |

---

## Risk Tier Definitions

### Critical Risk

Vendors processing highly sensitive data (financial, health, biometric) at scale with limited replaceability. A failure or breach at this vendor would have immediate, severe impact on business operations and regulatory compliance.

**Review frequency:** Quarterly (every 3 months)

### High Risk

Vendors processing personal data with significant volume or sensitivity. Vendor disruption would materially impact service delivery or compliance posture.

**Review frequency:** Semi-annually (every 6 months)

### Medium Risk

Vendors processing limited personal data or operational data. Alternatives exist and migration would be manageable within a reasonable timeframe.

**Review frequency:** Annually (every 12 months)

### Low Risk

Vendors processing minimal or no personal data, or providing easily replaceable commodity services. Limited compliance exposure.

**Review frequency:** Biannually (every 24 months)

---

## Vendor Risk Summary

| Vendor | Category | Tier | Sensitivity | Volume | Replaceability | Review Frequency |
|--------|----------|------|-------------|--------|---------------|-----------------|
| **Stripe** | payment | Critical !!! | 5/5 | High | Difficult | Quarterly (every 3 months) |
| **Vercel AI SDK (Google Vertex)** | ai | Medium ! | 4/5 | Medium | Moderate | Annually (every 12 months) |
| **Vercel AI SDK** | ai | Medium ! | 4/5 | Medium | Moderate | Annually (every 12 months) |
| **PostHog** | analytics | Medium ! | 2/5 | High | Easy | Annually (every 12 months) |
| **Amazon SES (AWS)** | email | Low - | 3/5 | Medium | Easy | Biannually (every 24 months) |
| **Google Cloud KMS** | other | Low - | 1/5 | Low | Easy | Biannually (every 24 months) |
| **Google APIs** | other | Low - | 1/5 | Low | Easy | Biannually (every 24 months) |
| **Resend** | email | Low - | 3/5 | Medium | Easy | Biannually (every 24 months) |


---

## Detailed Vendor Risk Profiles


### Critical Risk Vendors


#### Stripe

| Factor | Assessment |
|--------|-----------|
| **Category** | payment |
| **Risk Tier** | Critical |
| **Data Sensitivity** | 5/5 |
| **Data Volume** | High |
| **Replaceability** | Difficult |
| **Review Frequency** | Quarterly (every 3 months) |

**Data collected:** payment information, billing address, email, transaction history

**Risk factors:**
- Processes highly sensitive personal data
- High data volume — large-scale processing
- Difficult to replace — deep integration dependency
- Subject to PCI DSS requirements

**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Verify encryption at rest and in transit
- [ ] Conduct annual security questionnaire
- [ ] Implement data minimization controls
- [ ] Document vendor exit plan and data migration procedure
- [ ] Verify PCI DSS Level 1 compliance certificate
- [ ] Monitor vendor status page and security advisories



### Medium Risk Vendors


#### Vercel AI SDK (Google Vertex)

| Factor | Assessment |
|--------|-----------|
| **Category** | ai |
| **Risk Tier** | Medium |
| **Data Sensitivity** | 4/5 |
| **Data Volume** | Medium |
| **Replaceability** | Moderate |
| **Review Frequency** | Annually (every 12 months) |

**Data collected:** user prompts, conversation history, generated content

**Risk factors:**
- Processes highly sensitive personal data
- AI processing — potential for unintended data exposure

**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Verify encryption at rest and in transit
- [ ] Conduct annual security questionnaire
- [ ] Confirm opt-out of model training; review data retention policy
- [ ] Monitor vendor status page and security advisories


#### Vercel AI SDK

| Factor | Assessment |
|--------|-----------|
| **Category** | ai |
| **Risk Tier** | Medium |
| **Data Sensitivity** | 4/5 |
| **Data Volume** | Medium |
| **Replaceability** | Moderate |
| **Review Frequency** | Annually (every 12 months) |

**Data collected:** user prompts, conversation history, generated content

**Risk factors:**
- Processes highly sensitive personal data
- AI processing — potential for unintended data exposure

**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Verify encryption at rest and in transit
- [ ] Conduct annual security questionnaire
- [ ] Confirm opt-out of model training; review data retention policy
- [ ] Monitor vendor status page and security advisories


#### PostHog

| Factor | Assessment |
|--------|-----------|
| **Category** | analytics |
| **Risk Tier** | Medium |
| **Data Sensitivity** | 2/5 |
| **Data Volume** | High |
| **Replaceability** | Easy |
| **Review Frequency** | Annually (every 12 months) |

**Data collected:** user behavior, session recordings, feature flag usage, device information

**Risk factors:**
- High data volume — large-scale processing

**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Implement data minimization controls
- [ ] Monitor vendor status page and security advisories



### Low Risk Vendors


#### Amazon SES (AWS)

| Factor | Assessment |
|--------|-----------|
| **Category** | email |
| **Risk Tier** | Low |
| **Data Sensitivity** | 3/5 |
| **Data Volume** | Medium |
| **Replaceability** | Easy |
| **Review Frequency** | Biannually (every 24 months) |

**Data collected:** email addresses, email content, uploaded files, file metadata

**Risk factors:**
- Processes personal data

**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Verify encryption at rest and in transit
- [ ] Monitor vendor status page and security advisories


#### Google Cloud KMS

| Factor | Assessment |
|--------|-----------|
| **Category** | other |
| **Risk Tier** | Low |
| **Data Sensitivity** | 1/5 |
| **Data Volume** | Low |
| **Replaceability** | Easy |
| **Review Frequency** | Biannually (every 24 months) |

**Data collected:** encryption keys, key metadata

**Risk factors:**


**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Monitor vendor status page and security advisories


#### Google APIs

| Factor | Assessment |
|--------|-----------|
| **Category** | other |
| **Risk Tier** | Low |
| **Data Sensitivity** | 1/5 |
| **Data Volume** | Low |
| **Replaceability** | Easy |
| **Review Frequency** | Biannually (every 24 months) |

**Data collected:** user data via Google APIs, calendar data, email data, profile information

**Risk factors:**


**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Monitor vendor status page and security advisories


#### Resend

| Factor | Assessment |
|--------|-----------|
| **Category** | email |
| **Risk Tier** | Low |
| **Data Sensitivity** | 3/5 |
| **Data Volume** | Medium |
| **Replaceability** | Easy |
| **Review Frequency** | Biannually (every 24 months) |

**Data collected:** email addresses, email content

**Risk factors:**
- Processes personal data

**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Verify encryption at rest and in transit
- [ ] Monitor vendor status page and security advisories


---

## Review Schedule

| Review Type | Next Due | Vendors |
|------------|----------|---------|
| Quarterly Review | 2026-06-16 | Stripe |
| Semi-Annual Review | 2026-09-16 | None |
| Annual Review | 2027-03-16 | Vercel AI SDK (Google Vertex), Vercel AI SDK, PostHog |
| Biannual Review | 2028-03-15 | Amazon SES (AWS), Google Cloud KMS, Google APIs, Resend |

### Review Checklist

For each scheduled review, complete the following:

- [ ] Verify DPA is current and signed
- [ ] Review vendor's latest SOC 2 / ISO 27001 report (if applicable)
- [ ] Check for security incidents or breaches reported by the vendor
- [ ] Verify data processing activities match documented purposes
- [ ] Confirm sub-processor list has not changed unexpectedly
- [ ] Review vendor's privacy policy for material changes
- [ ] Test data deletion / DSAR fulfillment process
- [ ] Update this assessment with any changes to risk factors

---

## Methodology

### Scoring Criteria

**Data Sensitivity (1-5):**
| Score | Description | Examples |
|-------|-------------|----------|
| 5 | Financial / health data | Payment processors, health APIs |
| 4 | Identity / credential data | Auth providers, AI services (may process PII) |
| 3 | Personal / contact data | Email services, databases, file storage |
| 2 | Behavioral / technical data | Analytics, monitoring, advertising |
| 1 | Minimal / no personal data | Utility services, CDNs |

**Data Volume:**
- **High** — Processes data for all or most users at scale
- **Medium** — Processes moderate amounts of personal data
- **Low** — Processes minimal data volume

**Replaceability:**
- **Easy** — Commodity service; multiple alternatives; migration within days
- **Moderate** — Some integration depth; migration within weeks
- **Difficult** — Deep integration; data lock-in; migration requires months of planning

### Tier Calculation

Risk tier is determined by a composite score combining all three factors. Vendors processing sensitive data at high volume with difficult replaceability receive the highest risk classification.

---

## Maintaining This Assessment

- **Review frequency:** This assessment should be regenerated whenever vendors are added or removed
- **Ownership:** Data Protection Officer / Security Team
- **Update process:** Re-run Codepliant to regenerate from current codebase, then review and validate tier assignments
- **Override:** If a vendor's auto-assigned tier does not reflect your specific context, document the override and rationale

---

*This vendor risk tier assessment was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Risk tiers are based on general heuristics and should be validated against your organization's specific risk appetite and vendor relationships.*