> **Document Version:** 1.0  
> **Document Owner:** Acme Inc  
> **Next Review Date:** 2027-03-18


**Last updated:** 2026-03-18

**Project:** nextjs-saas-example

**Organization:** Acme Inc

**Compliance contact:** legal@acme.com

**DPO:** Jane Mueller (dpo@acme-saas.com)

---

## Overview

This document tracks the compliance status of all **7 third-party vendors** detected in the **nextjs-saas-example** codebase. It provides a centralized view of DPA status, review schedules, risk tiers, and vendor contacts for ongoing vendor compliance management.

### Vendor Distribution by Risk Tier

| Risk Tier | Count | Review Frequency |
|-----------|-------|-----------------|
| Critical | 2 | Quarterly (every 3 months) |
| High | 2 | Semi-annually (every 6 months) |
| Medium | 1 | Annually (every 12 months) |
| Low | 2 | Biannually (every 24 months) |

---
## Vendor Compliance Status

| Vendor | DPA Signed | Last Review | Next Review | Risk Tier | Contact |
|--------|-----------|-------------|-------------|-----------|---------|
| **Stripe** | [ ] Pending | [Not yet reviewed] | 2026-06-18 | Critical | privacy@stripe.com |
| **stripe-ios** | [ ] Pending | [Not yet reviewed] | 2026-06-18 | Critical | [Contact vendor] |
| **Supabase** | [ ] Pending | [Not yet reviewed] | 2026-09-18 | High | privacy@supabase.io |
| **OpenAI** | [ ] Pending | [Not yet reviewed] | 2026-09-18 | High | privacy@openai.com |
| **Resend** | [ ] Pending | [Not yet reviewed] | 2027-03-18 | Medium | privacy@resend.com |
| **Sentry** | [ ] Pending | [Not yet reviewed] | 2028-03-18 | Low | dpa@sentry.io |
| **PostHog** | [ ] Pending | [Not yet reviewed] | 2028-03-18 | Low | privacy@posthog.com |

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
| **Next Review** | 2026-06-18 |
| **Privacy Contact** | privacy@stripe.com |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor

#### stripe-ios

| Field | Status |
|-------|--------|
| **Category** | payment |
| **Risk Tier** | Critical |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [Request from vendor] |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2026-06-18 |
| **Privacy Contact** | [Contact vendor] |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor


### High Risk Vendors

#### Supabase

| Field | Status |
|-------|--------|
| **Category** | auth |
| **Risk Tier** | High |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [DPA Link](https://supabase.com/legal/dpa) |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2026-09-18 |
| **Privacy Contact** | privacy@supabase.io |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor

#### OpenAI

| Field | Status |
|-------|--------|
| **Category** | ai |
| **Risk Tier** | High |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [DPA Link](https://openai.com/policies) |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2026-09-18 |
| **Privacy Contact** | privacy@openai.com |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor


### Medium Risk Vendors

#### Resend

| Field | Status |
|-------|--------|
| **Category** | email |
| **Risk Tier** | Medium |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [DPA Link](https://resend.com/legal/dpa) |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2027-03-18 |
| **Privacy Contact** | privacy@resend.com |

**Action items:**
- [ ] Obtain and sign DPA
- [ ] Conduct initial compliance review
- [ ] Verify data processing purposes align with DPA terms
- [ ] Confirm sub-processor notifications are enabled
- [ ] Document data flows to/from this vendor


### Low Risk Vendors

#### Sentry

| Field | Status |
|-------|--------|
| **Category** | monitoring |
| **Risk Tier** | Low |
| **DPA Signed** | [ ] Pending |
| **DPA Location** | [DPA Link](https://sentry.io/legal/dpa/) |
| **Last Review** | [Not yet reviewed] |
| **Next Review** | 2028-03-18 |
| **Privacy Contact** | dpa@sentry.io |

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
| **Next Review** | 2028-03-18 |
| **Privacy Contact** | privacy@posthog.com |

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
| 2026-06 | Stripe, stripe-ios |
| 2026-09 | Supabase, OpenAI |
| 2027-03 | Resend |
| 2028-03 | Sentry, PostHog |


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