# Vendor Risk Tier Assessment

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** @mastodon/mastodon

**Organization:** [Your Company Name]

**Assessment contact:** [your-email@example.com]

---

## Executive Summary

This assessment classifies **20 third-party vendors** detected in the **@mastodon/mastodon** codebase into risk tiers based on three factors:

1. **Data Sensitivity** — The type and sensitivity of personal data the vendor processes
2. **Data Volume** — The scale of data processing (transaction volume, user base coverage)
3. **Replaceability** — How difficult it would be to migrate away from the vendor

### Tier Distribution

| Tier | Count | Review Frequency |
|------|-------|-----------------|
| Critical | 0 | Quarterly (every 3 months) |
| High | 0 | Semi-annually (every 6 months) |
| Medium | 4 | Annually (every 12 months) |
| Low | 16 | Biannually (every 24 months) |

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
| **devise** | auth | Medium ! | 4/5 | Medium | Moderate | Annually (every 12 months) |
| **omniauth** | auth | Medium ! | 4/5 | Medium | Moderate | Annually (every 12 months) |
| **pundit** | auth | Medium ! | 4/5 | Medium | Moderate | Annually (every 12 months) |
| **rails-sessions** | auth | Medium ! | 4/5 | Medium | Moderate | Annually (every 12 months) |
| **ActionCable** | other | Low - | 1/5 | Low | Easy | Biannually (every 24 months) |
| **ActionController::Cookies** | other | Low - | 1/5 | Low | Easy | Biannually (every 24 months) |
| **ActionMailer** | email | Low - | 3/5 | Medium | Easy | Biannually (every 24 months) |
| **Active Storage** | storage | Low - | 3/5 | Medium | Easy | Biannually (every 24 months) |
| **ActiveRecord** | database | Low - | 3/5 | Medium | Easy | Biannually (every 24 months) |
| **ActiveStorage** | storage | Low - | 3/5 | Medium | Easy | Biannually (every 24 months) |
| **aws-sdk-s3** | storage | Low - | 3/5 | Medium | Easy | Biannually (every 24 months) |
| **pg** | database | Low - | 3/5 | Medium | Easy | Biannually (every 24 months) |
| **PostgreSQL** | database | Low - | 3/5 | Medium | Easy | Biannually (every 24 months) |
| **PostgreSQL (env)** | database | Low - | 3/5 | Medium | Easy | Biannually (every 24 months) |
| **rack-attack** | other | Low - | 1/5 | Low | Easy | Biannually (every 24 months) |
| **rails-actionmailer** | email | Low - | 3/5 | Medium | Easy | Biannually (every 24 months) |
| **rails-activerecord** | database | Low - | 3/5 | Medium | Easy | Biannually (every 24 months) |
| **Redis** | database | Low - | 3/5 | Medium | Easy | Biannually (every 24 months) |
| **sidekiq** | other | Low - | 1/5 | Low | Easy | Biannually (every 24 months) |
| **ws (WebSocket)** | other | Low - | 1/5 | Low | Easy | Biannually (every 24 months) |


---

## Detailed Vendor Risk Profiles


### Medium Risk Vendors


#### devise

| Factor | Assessment |
|--------|-----------|
| **Category** | auth |
| **Risk Tier** | Medium |
| **Data Sensitivity** | 4/5 |
| **Data Volume** | Medium |
| **Replaceability** | Moderate |
| **Review Frequency** | Annually (every 12 months) |

**Data collected:** email, password hash, session data, authentication tokens

**Risk factors:**
- Processes highly sensitive personal data
- Identity/credential data — high-value target for attackers

**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Verify encryption at rest and in transit
- [ ] Conduct annual security questionnaire
- [ ] Verify MFA support and credential storage practices
- [ ] Monitor vendor status page and security advisories


#### omniauth

| Factor | Assessment |
|--------|-----------|
| **Category** | auth |
| **Risk Tier** | Medium |
| **Data Sensitivity** | 4/5 |
| **Data Volume** | Medium |
| **Replaceability** | Moderate |
| **Review Frequency** | Annually (every 12 months) |

**Data collected:** email, name, OAuth tokens, profile data

**Risk factors:**
- Processes highly sensitive personal data
- Identity/credential data — high-value target for attackers

**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Verify encryption at rest and in transit
- [ ] Conduct annual security questionnaire
- [ ] Verify MFA support and credential storage practices
- [ ] Monitor vendor status page and security advisories


#### pundit

| Factor | Assessment |
|--------|-----------|
| **Category** | auth |
| **Risk Tier** | Medium |
| **Data Sensitivity** | 4/5 |
| **Data Volume** | Medium |
| **Replaceability** | Moderate |
| **Review Frequency** | Annually (every 12 months) |

**Data collected:** user roles, authorization policies, access control data

**Risk factors:**
- Processes highly sensitive personal data
- Identity/credential data — high-value target for attackers

**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Verify encryption at rest and in transit
- [ ] Conduct annual security questionnaire
- [ ] Verify MFA support and credential storage practices
- [ ] Monitor vendor status page and security advisories


#### rails-sessions

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


#### ActionCable

| Factor | Assessment |
|--------|-----------|
| **Category** | other |
| **Risk Tier** | Low |
| **Data Sensitivity** | 1/5 |
| **Data Volume** | Low |
| **Replaceability** | Easy |
| **Review Frequency** | Biannually (every 24 months) |

**Data collected:** real-time user data, connection metadata, channel subscriptions, WebSocket messages

**Risk factors:**


**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Monitor vendor status page and security advisories


#### ActionController::Cookies

| Factor | Assessment |
|--------|-----------|
| **Category** | other |
| **Risk Tier** | Low |
| **Data Sensitivity** | 1/5 |
| **Data Volume** | Low |
| **Replaceability** | Easy |
| **Review Frequency** | Biannually (every 24 months) |

**Data collected:** session cookies, session data, CSRF tokens

**Risk factors:**


**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Monitor vendor status page and security advisories


#### ActionMailer

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


#### Active Storage

| Factor | Assessment |
|--------|-----------|
| **Category** | storage |
| **Risk Tier** | Low |
| **Data Sensitivity** | 3/5 |
| **Data Volume** | Medium |
| **Replaceability** | Easy |
| **Review Frequency** | Biannually (every 24 months) |

**Data collected:** uploaded files, file metadata, storage service credentials, potential PII in uploaded content

**Risk factors:**
- Processes personal data

**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Verify encryption at rest and in transit
- [ ] Monitor vendor status page and security advisories


#### ActiveRecord

| Factor | Assessment |
|--------|-----------|
| **Category** | database |
| **Risk Tier** | Low |
| **Data Sensitivity** | 3/5 |
| **Data Volume** | Medium |
| **Replaceability** | Easy |
| **Review Frequency** | Biannually (every 24 months) |

**Data collected:** user data as defined in schema, timestamps, associations

**Risk factors:**
- Processes personal data

**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Verify encryption at rest and in transit
- [ ] Monitor vendor status page and security advisories


#### ActiveStorage

| Factor | Assessment |
|--------|-----------|
| **Category** | storage |
| **Risk Tier** | Low |
| **Data Sensitivity** | 3/5 |
| **Data Volume** | Medium |
| **Replaceability** | Easy |
| **Review Frequency** | Biannually (every 24 months) |

**Data collected:** uploaded files, file metadata, storage references

**Risk factors:**
- Processes personal data

**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Verify encryption at rest and in transit
- [ ] Monitor vendor status page and security advisories


#### aws-sdk-s3

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


#### pg

| Factor | Assessment |
|--------|-----------|
| **Category** | database |
| **Risk Tier** | Low |
| **Data Sensitivity** | 3/5 |
| **Data Volume** | Medium |
| **Replaceability** | Easy |
| **Review Frequency** | Biannually (every 24 months) |

**Data collected:** user data as defined in schema

**Risk factors:**
- Processes personal data

**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Verify encryption at rest and in transit
- [ ] Monitor vendor status page and security advisories


#### PostgreSQL

| Factor | Assessment |
|--------|-----------|
| **Category** | database |
| **Risk Tier** | Low |
| **Data Sensitivity** | 3/5 |
| **Data Volume** | Medium |
| **Replaceability** | Easy |
| **Review Frequency** | Biannually (every 24 months) |

**Data collected:** application data, user records

**Risk factors:**
- Processes personal data

**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Verify encryption at rest and in transit
- [ ] Monitor vendor status page and security advisories


#### PostgreSQL (env)

| Factor | Assessment |
|--------|-----------|
| **Category** | database |
| **Risk Tier** | Low |
| **Data Sensitivity** | 3/5 |
| **Data Volume** | Medium |
| **Replaceability** | Easy |
| **Review Frequency** | Biannually (every 24 months) |

**Data collected:** application data, user records

**Risk factors:**
- Processes personal data

**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Verify encryption at rest and in transit
- [ ] Monitor vendor status page and security advisories


#### rack-attack

| Factor | Assessment |
|--------|-----------|
| **Category** | other |
| **Risk Tier** | Low |
| **Data Sensitivity** | 1/5 |
| **Data Volume** | Low |
| **Replaceability** | Easy |
| **Review Frequency** | Biannually (every 24 months) |

**Data collected:** IP addresses, request metadata

**Risk factors:**


**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Monitor vendor status page and security advisories


#### rails-actionmailer

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


#### rails-activerecord

| Factor | Assessment |
|--------|-----------|
| **Category** | database |
| **Risk Tier** | Low |
| **Data Sensitivity** | 3/5 |
| **Data Volume** | Medium |
| **Replaceability** | Easy |
| **Review Frequency** | Biannually (every 24 months) |

**Data collected:** user data as defined in schema

**Risk factors:**
- Processes personal data

**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Verify encryption at rest and in transit
- [ ] Monitor vendor status page and security advisories


#### Redis

| Factor | Assessment |
|--------|-----------|
| **Category** | database |
| **Risk Tier** | Low |
| **Data Sensitivity** | 3/5 |
| **Data Volume** | Medium |
| **Replaceability** | Easy |
| **Review Frequency** | Biannually (every 24 months) |

**Data collected:** session data, cache data

**Risk factors:**
- Processes personal data

**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Verify encryption at rest and in transit
- [ ] Monitor vendor status page and security advisories


#### sidekiq

| Factor | Assessment |
|--------|-----------|
| **Category** | other |
| **Risk Tier** | Low |
| **Data Sensitivity** | 1/5 |
| **Data Volume** | Low |
| **Replaceability** | Easy |
| **Review Frequency** | Biannually (every 24 months) |

**Data collected:** job data, user data processed in background jobs

**Risk factors:**


**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Monitor vendor status page and security advisories


#### ws (WebSocket)

| Factor | Assessment |
|--------|-----------|
| **Category** | other |
| **Risk Tier** | Low |
| **Data Sensitivity** | 1/5 |
| **Data Volume** | Low |
| **Replaceability** | Easy |
| **Review Frequency** | Biannually (every 24 months) |

**Data collected:** real-time user data, connection metadata, IP address, WebSocket messages

**Risk factors:**


**Recommended mitigations:**
- [ ] Ensure DPA is signed and current
- [ ] Monitor vendor status page and security advisories


---

## Review Schedule

| Review Type | Next Due | Vendors |
|------------|----------|---------|
| Quarterly Review | 2026-06-16 | None |
| Semi-Annual Review | 2026-09-16 | None |
| Annual Review | 2027-03-16 | devise, omniauth, pundit, rails-sessions |
| Biannual Review | 2028-03-15 | ActionCable, ActionController::Cookies, ActionMailer, Active Storage, ActiveRecord, ActiveStorage, aws-sdk-s3, pg, PostgreSQL, PostgreSQL (env), rack-attack, rails-actionmailer, rails-activerecord, Redis, sidekiq, ws (WebSocket) |

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