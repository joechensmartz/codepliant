# Vendor Risk Tier Assessment

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** saleor

**Organization:** [Your Company Name]

**Assessment contact:** [your-email@example.com]

---

## Executive Summary

This assessment classifies **5 third-party vendors** detected in the **saleor** codebase into risk tiers based on three factors:

1. **Data Sensitivity** — The type and sensitivity of personal data the vendor processes
2. **Data Volume** — The scale of data processing (transaction volume, user base coverage)
3. **Replaceability** — How difficult it would be to migrate away from the vendor

### Tier Distribution

| Tier | Count | Review Frequency |
|------|-------|-----------------|
| Critical | 1 | Quarterly (every 3 months) |
| High | 0 | Semi-annually (every 6 months) |
| Medium | 2 | Annually (every 12 months) |
| Low | 2 | Biannually (every 24 months) |

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
| **django-admin** | auth | Medium ! | 4/5 | Medium | Moderate | Annually (every 12 months) |
| **django-sessions** | auth | Medium ! | 4/5 | Medium | Moderate | Annually (every 12 months) |
| **boto3** | storage | Low - | 3/5 | Medium | Easy | Biannually (every 24 months) |
| **Django Channels** | other | Low - | 1/5 | Low | Easy | Biannually (every 24 months) |


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


#### django-admin

| Factor | Assessment |
|--------|-----------|
| **Category** | auth |
| **Risk Tier** | Medium |
| **Data Sensitivity** | 4/5 |
| **Data Volume** | Medium |
| **Replaceability** | Moderate |
| **Review Frequency** | Annually (every 12 months) |

**Data collected:** admin panel access, staff user accounts

**Risk factors:**
- Processes highly sensitive personal data
- Identity/credential data — high-value target for attackers

**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Verify encryption at rest and in transit
- [ ] Conduct annual security questionnaire
- [ ] Verify MFA support and credential storage practices
- [ ] Monitor vendor status page and security advisories


#### django-sessions

| Factor | Assessment |
|--------|-----------|
| **Category** | auth |
| **Risk Tier** | Medium |
| **Data Sensitivity** | 4/5 |
| **Data Volume** | Medium |
| **Replaceability** | Moderate |
| **Review Frequency** | Annually (every 12 months) |

**Data collected:** session cookies, CSRF tokens

**Risk factors:**
- Processes highly sensitive personal data
- Identity/credential data — high-value target for attackers

**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Verify encryption at rest and in transit
- [ ] Conduct annual security questionnaire
- [ ] Verify MFA support and credential storage practices
- [ ] Monitor vendor status page and security advisories



### Low Risk Vendors


#### boto3

| Factor | Assessment |
|--------|-----------|
| **Category** | storage |
| **Risk Tier** | Low |
| **Data Sensitivity** | 3/5 |
| **Data Volume** | Medium |
| **Replaceability** | Easy |
| **Review Frequency** | Biannually (every 24 months) |

**Data collected:** uploaded files, file metadata

**Risk factors:**
- Processes personal data

**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Verify encryption at rest and in transit
- [ ] Monitor vendor status page and security advisories


#### Django Channels

| Factor | Assessment |
|--------|-----------|
| **Category** | other |
| **Risk Tier** | Low |
| **Data Sensitivity** | 1/5 |
| **Data Volume** | Low |
| **Replaceability** | Easy |
| **Review Frequency** | Biannually (every 24 months) |

**Data collected:** real-time user data, connection metadata, channel group data, WebSocket messages

**Risk factors:**


**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Monitor vendor status page and security advisories


---

## Review Schedule

| Review Type | Next Due | Vendors |
|------------|----------|---------|
| Quarterly Review | 2026-06-16 | Stripe |
| Semi-Annual Review | 2026-09-16 | None |
| Annual Review | 2027-03-16 | django-admin, django-sessions |
| Biannual Review | 2028-03-15 | boto3, Django Channels |

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