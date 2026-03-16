# Vendor Compliance Tracker

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** maybe

**Organization:** [Your Company Name]

**Compliance contact:** [your-email@example.com]

**DPO:** [DPO Name] ([dpo@example.com])

---

## Overview

This document tracks the compliance status of all **18 third-party vendors** detected in the **maybe** codebase. It provides a centralized view of DPA status, review schedules, risk tiers, and vendor contacts for ongoing vendor compliance management.

### Vendor Distribution by Risk Tier

| Risk Tier | Count | Review Frequency |
|-----------|-------|-----------------|
| Critical | 2 | Quarterly (every 3 months) |
| High | 2 | Semi-annually (every 6 months) |
| Medium | 8 | Annually (every 12 months) |
| Low | 6 | Biannually (every 24 months) |

---
## Vendor Compliance Status

| Vendor | DPA Signed | Last Review | Next Review | Risk Tier | Contact |
|--------|-----------|-------------|-------------|-----------|---------|
| **Plaid** | [ ] Pending | [Not yet reviewed] | 2026-06-16 | Critical | [Contact vendor] |
| **Stripe** | [ ] Pending | [Not yet reviewed] | 2026-06-16 | Critical | privacy@stripe.com |
| **rails-sessions** | [ ] Pending | [Not yet reviewed] | 2026-09-16 | High | [Contact vendor] |
| **ruby-openai** | [ ] Pending | [Not yet reviewed] | 2026-09-16 | High | [Contact vendor] |
| **ActionMailer** | [ ] Pending | [Not yet reviewed] | 2027-03-16 | Medium | [Contact vendor] |
| **Active Storage** | [ ] Pending | [Not yet reviewed] | 2027-03-16 | Medium | [Contact vendor] |
| **ActiveRecord** | [ ] Pending | [Not yet reviewed] | 2027-03-16 | Medium | [Contact vendor] |
| **ActiveStorage** | [ ] Pending | [Not yet reviewed] | 2027-03-16 | Medium | [Contact vendor] |
| **aws-sdk-s3** | [ ] Pending | [Not yet reviewed] | 2027-03-16 | Medium | [Contact vendor] |
| **pg** | [ ] Pending | [Not yet reviewed] | 2027-03-16 | Medium | [Contact vendor] |
| **rails-actionmailer** | [ ] Pending | [Not yet reviewed] | 2027-03-16 | Medium | [Contact vendor] |
| **rails-activerecord** | [ ] Pending | [Not yet reviewed] | 2027-03-16 | Medium | [Contact vendor] |
| **ActionCable** | [ ] Pending | [Not yet reviewed] | 2028-03-16 | Low | [Contact vendor] |
| **ActionController::Cookies** | [ ] Pending | [Not yet reviewed] | 2028-03-16 | Low | [Contact vendor] |
| **intercom-ruby** | [ ] Pending | [Not yet reviewed] | 2028-03-16 | Low | [Contact vendor] |
| **rack-attack** | [ ] Pending | [Not yet reviewed] | 2028-03-16 | Low | [Contact vendor] |
| **sentry-ruby** | [ ] Pending | [Not yet reviewed] | 2028-03-16 | Low | [Contact vendor] |
| **sidekiq** | [ ] Pending | [Not yet reviewed] | 2028-03-16 | Low | [Contact vendor] |

---

## DPA Status Details

### Critical Risk Vendors

#### Plaid

| Field | Status |
|-------|--------|
| **Category** | payment |
| **Risk Tier** | Critical |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [DPA Link](https://plaid.com/legal/#data-processing-addendum) |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2026-06-16 |
| **Privacy Contact** | [Contact vendor] |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor

#### Stripe

| Field | Status |
|-------|--------|
| **Category** | payment |
| **Risk Tier** | Critical |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [DPA Link](https://stripe.com/legal/dpa) |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2026-06-16 |
| **Privacy Contact** | privacy@stripe.com |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor


### High Risk Vendors

#### rails-sessions

| Field | Status |
|-------|--------|
| **Category** | auth |
| **Risk Tier** | High |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [Request from vendor] |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2026-09-16 |
| **Privacy Contact** | [Contact vendor] |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor

#### ruby-openai

| Field | Status |
|-------|--------|
| **Category** | ai |
| **Risk Tier** | High |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [Request from vendor] |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2026-09-16 |
| **Privacy Contact** | [Contact vendor] |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor


### Medium Risk Vendors

#### ActionMailer

| Field | Status |
|-------|--------|
| **Category** | email |
| **Risk Tier** | Medium |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [Request from vendor] |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2027-03-16 |
| **Privacy Contact** | [Contact vendor] |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor

#### Active Storage

| Field | Status |
|-------|--------|
| **Category** | storage |
| **Risk Tier** | Medium |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [Request from vendor] |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2027-03-16 |
| **Privacy Contact** | [Contact vendor] |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor

#### ActiveRecord

| Field | Status |
|-------|--------|
| **Category** | database |
| **Risk Tier** | Medium |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [Request from vendor] |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2027-03-16 |
| **Privacy Contact** | [Contact vendor] |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor

#### ActiveStorage

| Field | Status |
|-------|--------|
| **Category** | storage |
| **Risk Tier** | Medium |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [Request from vendor] |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2027-03-16 |
| **Privacy Contact** | [Contact vendor] |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor

#### aws-sdk-s3

| Field | Status |
|-------|--------|
| **Category** | storage |
| **Risk Tier** | Medium |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [Request from vendor] |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2027-03-16 |
| **Privacy Contact** | [Contact vendor] |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor

#### pg

| Field | Status |
|-------|--------|
| **Category** | database |
| **Risk Tier** | Medium |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [Request from vendor] |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2027-03-16 |
| **Privacy Contact** | [Contact vendor] |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor

#### rails-actionmailer

| Field | Status |
|-------|--------|
| **Category** | email |
| **Risk Tier** | Medium |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [Request from vendor] |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2027-03-16 |
| **Privacy Contact** | [Contact vendor] |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor

#### rails-activerecord

| Field | Status |
|-------|--------|
| **Category** | database |
| **Risk Tier** | Medium |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [Request from vendor] |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2027-03-16 |
| **Privacy Contact** | [Contact vendor] |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor


### Low Risk Vendors

#### ActionCable

| Field | Status |
|-------|--------|
| **Category** | other |
| **Risk Tier** | Low |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [Request from vendor] |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2028-03-16 |
| **Privacy Contact** | [Contact vendor] |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor

#### ActionController::Cookies

| Field | Status |
|-------|--------|
| **Category** | other |
| **Risk Tier** | Low |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [Request from vendor] |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2028-03-16 |
| **Privacy Contact** | [Contact vendor] |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor

#### intercom-ruby

| Field | Status |
|-------|--------|
| **Category** | other |
| **Risk Tier** | Low |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [Request from vendor] |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2028-03-16 |
| **Privacy Contact** | [Contact vendor] |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor

#### rack-attack

| Field | Status |
|-------|--------|
| **Category** | other |
| **Risk Tier** | Low |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [Request from vendor] |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2028-03-16 |
| **Privacy Contact** | [Contact vendor] |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor

#### sentry-ruby

| Field | Status |
|-------|--------|
| **Category** | monitoring |
| **Risk Tier** | Low |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [Request from vendor] |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2028-03-16 |
| **Privacy Contact** | [Contact vendor] |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor

#### sidekiq

| Field | Status |
|-------|--------|
| **Category** | other |
| **Risk Tier** | Low |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [Request from vendor] |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2028-03-16 |
| **Privacy Contact** | [Contact vendor] |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor

---

## Upcoming Review Calendar

| Month | Vendors Due for Review |
|-------|----------------------|
| 2026-06 | Plaid, Stripe |
| 2026-09 | rails-sessions, ruby-openai |
| 2027-03 | ActionMailer, Active Storage, ActiveRecord, ActiveStorage, aws-sdk-s3, pg, rails-actionmailer, rails-activerecord |
| 2028-03 | ActionCable, ActionController::Cookies, intercom-ruby, rack-attack, sentry-ruby, sidekiq |


---

## Vendor Compliance Review Checklist

Use this checklist during each scheduled vendor review:

### Pre-Review
- [ ] Retrieve current DPA and verify it is signed and dated
- [ ] Check vendor's latest security certifications (SOC 2, ISO 27001)
- [ ] Review vendor's recent security incident disclosures
- [ ] Pull vendor's current sub-processor list

### During Review
- [ ] Verify data processing activities match agreed purposes
- [ ] Confirm data retention periods are within policy limits
- [ ] Test DSAR fulfillment process (access, deletion, portability)
- [ ] Review vendor's privacy policy for material changes
- [ ] Assess vendor's incident notification procedures
- [ ] Verify encryption at rest and in transit

### Post-Review
- [ ] Update this tracker with review date and findings
- [ ] Document any compliance gaps or concerns
- [ ] Set follow-up actions with deadlines
- [ ] Schedule next review based on risk tier
- [ ] Notify stakeholders of any material changes

---

## Escalation Procedures

| Situation | Action | Timeline |
|-----------|--------|----------|
| DPA not signed within 30 days | Escalate to legal team | Immediate |
| Vendor breach notification | Activate incident response plan | Within 24 hours |
| Failed compliance review | Document gaps and remediation plan | Within 5 business days |
| Vendor sub-processor change | Review new sub-processor and update records | Within 14 days |
| DPA renewal due | Initiate renewal process | 60 days before expiry |

---

## Maintaining This Document

- **Review frequency:** Monthly review of overall tracker; per-vendor reviews per risk tier schedule
- **Ownership:** Data Protection Officer / Privacy Team
- **Update process:** Re-run Codepliant to detect new vendors, then manually update DPA status and review dates
- **Integration:** This tracker should be maintained alongside the Vendor Contacts Directory and Vendor Risk Tier Assessment

---

*This vendor compliance tracker was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. DPA status and review dates should be manually updated as compliance activities are completed. This document does not constitute legal advice.*