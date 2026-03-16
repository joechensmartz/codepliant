# Vendor Compliance Tracker

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** calcom-monorepo

**Organization:** [Your Company Name]

**Compliance contact:** [your-email@example.com]

**DPO:** [DPO Name] ([dpo@example.com])

---

## Overview

This document tracks the compliance status of all **17 third-party vendors** detected in the **calcom-monorepo** codebase. It provides a centralized view of DPA status, review schedules, risk tiers, and vendor contacts for ongoing vendor compliance management.

### Vendor Distribution by Risk Tier

| Risk Tier | Count | Review Frequency |
|-----------|-------|-----------------|
| Critical | 1 | Quarterly (every 3 months) |
| High | 1 | Semi-annually (every 6 months) |
| Medium | 6 | Annually (every 12 months) |
| Low | 9 | Biannually (every 24 months) |

---
## Vendor Compliance Status

| Vendor | DPA Signed | Last Review | Next Review | Risk Tier | Contact |
|--------|-----------|-------------|-------------|-----------|---------|
| **Stripe** | [ ] Pending | [Not yet reviewed] | 2026-06-16 | Critical | privacy@stripe.com |
| **Google Auth** | [ ] Pending | [Not yet reviewed] | 2026-09-16 | High | [Contact vendor] |
| **SendGrid** | [ ] Pending | [Not yet reviewed] | 2027-03-16 | Medium | privacy@twilio.com |
| **Upstash Redis** | [ ] Pending | [Not yet reviewed] | 2027-03-16 | Medium | [Contact vendor] |
| **PostgreSQL** | [ ] Pending | [Not yet reviewed] | 2027-03-16 | Medium | [Contact vendor] |
| **PostgreSQL (env)** | [ ] Pending | [Not yet reviewed] | 2027-03-16 | Medium | [Contact vendor] |
| **Redis** | [ ] Pending | [Not yet reviewed] | 2027-03-16 | Medium | [Contact vendor] |
| **Redis (env)** | [ ] Pending | [Not yet reviewed] | 2027-03-16 | Medium | [Contact vendor] |
| **HubSpot** | [ ] Pending | [Not yet reviewed] | 2028-03-16 | Low | privacy@hubspot.com |
| **Sentry** | [ ] Pending | [Not yet reviewed] | 2028-03-16 | Low | dpa@sentry.io |
| **Google Analytics** | [ ] Pending | [Not yet reviewed] | 2028-03-16 | Low | data-protection-office@google.com |
| **Google Tag Manager** | [ ] Pending | [Not yet reviewed] | 2028-03-16 | Low | [Contact vendor] |
| **Google APIs** | [ ] Pending | [Not yet reviewed] | 2028-03-16 | Low | [Contact vendor] |
| **Intercom** | [ ] Pending | [Not yet reviewed] | 2028-03-16 | Low | privacy@intercom.com |
| **Plausible Analytics** | [ ] Pending | [Not yet reviewed] | 2028-03-16 | Low | [Contact vendor] |
| **PostHog** | [ ] Pending | [Not yet reviewed] | 2028-03-16 | Low | privacy@posthog.com |
| **Twilio** | [ ] Pending | [Not yet reviewed] | 2028-03-16 | Low | privacy@twilio.com |

---

## DPA Status Details

### Critical Risk Vendors

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

#### Google Auth

| Field | Status |
|-------|--------|
| **Category** | auth |
| **Risk Tier** | High |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [DPA Link](https://cloud.google.com/terms/data-processing-addendum) |
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

#### SendGrid

| Field | Status |
|-------|--------|
| **Category** | email |
| **Risk Tier** | Medium |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [DPA Link](https://www.twilio.com/legal/data-protection-addendum) |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2027-03-16 |
| **Privacy Contact** | privacy@twilio.com |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor

#### Upstash Redis

| Field | Status |
|-------|--------|
| **Category** | database |
| **Risk Tier** | Medium |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [DPA Link](https://upstash.com/trust/dpa) |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2027-03-16 |
| **Privacy Contact** | [Contact vendor] |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor

#### PostgreSQL

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

#### PostgreSQL (env)

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

#### Redis

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

#### Redis (env)

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

#### HubSpot

| Field | Status |
|-------|--------|
| **Category** | other |
| **Risk Tier** | Low |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [DPA Link](https://legal.hubspot.com/dpa) |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2028-03-16 |
| **Privacy Contact** | privacy@hubspot.com |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor

#### Sentry

| Field | Status |
|-------|--------|
| **Category** | monitoring |
| **Risk Tier** | Low |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [DPA Link](https://sentry.io/legal/dpa/) |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2028-03-16 |
| **Privacy Contact** | dpa@sentry.io |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor

#### Google Analytics

| Field | Status |
|-------|--------|
| **Category** | analytics |
| **Risk Tier** | Low |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [DPA Link](https://privacy.google.com/businesses/processorterms/) |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2028-03-16 |
| **Privacy Contact** | data-protection-office@google.com |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor

#### Google Tag Manager

| Field | Status |
|-------|--------|
| **Category** | analytics |
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

#### Google APIs

| Field | Status |
|-------|--------|
| **Category** | other |
| **Risk Tier** | Low |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [DPA Link](https://cloud.google.com/terms/data-processing-addendum) |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2028-03-16 |
| **Privacy Contact** | [Contact vendor] |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor

#### Intercom

| Field | Status |
|-------|--------|
| **Category** | other |
| **Risk Tier** | Low |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [DPA Link](https://www.intercom.com/legal/terms-and-policies#dpa) |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2028-03-16 |
| **Privacy Contact** | privacy@intercom.com |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor

#### Plausible Analytics

| Field | Status |
|-------|--------|
| **Category** | analytics |
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

#### PostHog

| Field | Status |
|-------|--------|
| **Category** | analytics |
| **Risk Tier** | Low |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [DPA Link](https://posthog.com/docs/privacy/dpa) |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2028-03-16 |
| **Privacy Contact** | privacy@posthog.com |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor

#### Twilio

| Field | Status |
|-------|--------|
| **Category** | other |
| **Risk Tier** | Low |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [DPA Link](https://www.twilio.com/legal/data-protection-addendum) |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2028-03-16 |
| **Privacy Contact** | privacy@twilio.com |

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
| 2026-06 | Stripe |
| 2026-09 | Google Auth |
| 2027-03 | SendGrid, Upstash Redis, PostgreSQL, PostgreSQL (env), Redis, Redis (env) |
| 2028-03 | HubSpot, Sentry, Google Analytics, Google Tag Manager, Google APIs, Intercom, Plausible Analytics, PostHog, Twilio |


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