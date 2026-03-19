# Vendor Contacts Directory

> **Document Version:** 1.0  
> **Document Owner:** Acme Inc  
> **Next Review Date:** 2027-03-18


**Last updated:** 2026-03-18

**Project:** nextjs-saas-example

**Data Controller:** Acme Inc

## Related Documents

- Sub-Processor List (`SUBPROCESSOR_LIST.md`)
- DSAR Handling Guide (`DSAR_HANDLING_GUIDE.md`)
- Third-Party Risk Assessment (`THIRD_PARTY_RISK_ASSESSMENT.md`)

---

## Overview

This document provides contact information for all detected third-party service providers (vendors) used by the **nextjs-saas-example** application. It is intended as a quick-reference for Data Subject Access Request (DSAR) handling, Data Processing Agreement (DPA) management, incident response coordination, and ongoing vendor oversight.

For questions about vendor relationships, contact legal@acme.com.

---

## Vendor Contact Table

| Vendor | Privacy Email | DPA Contact | Data Deletion | Status Page | Incident Reporting |
|--------|--------------|-------------|---------------|-------------|-------------------|
| Sentry | dpa@sentry.io | [Link](https://sentry.io/legal/dpa/) | [Link](https://docs.sentry.io/account/soc2/#data-deletion) | [Link](https://status.sentry.io) | security@sentry.io |
| Supabase | privacy@supabase.io | [Link](https://supabase.com/legal/dpa) | [Link](https://supabase.com/privacy) | [Link](https://status.supabase.com) | security@supabase.io |
| OpenAI | privacy@openai.com | [Link](https://openai.com/policies) | [Link](https://help.openai.com/en/articles/7039943-data-deletion-request) | [Link](https://status.openai.com) | [Link](https://openai.com/security/disclosure) |
| PostHog | privacy@posthog.com | [Link](https://posthog.com/docs/privacy/dpa) | [Link](https://posthog.com/docs/privacy/data-deletion) | [Link](https://status.posthog.com) | security@posthog.com |
| Resend | privacy@resend.com | [Link](https://resend.com/legal/dpa) | [Link](https://resend.com/legal/privacy-policy) | [Link](https://status.resend.com) | security@resend.com |
| Stripe | privacy@stripe.com | [Link](https://stripe.com/legal/dpa) | [Link](https://support.stripe.com/questions/privacy-and-data-protection) | [Link](https://status.stripe.com) | [Link](https://stripe.com/docs/security/reporting) |
| stripe-ios | [Contact vendor directly] | [Request from vendor] | [Check vendor documentation] | [Check vendor documentation] | [Check vendor documentation] |

---

## Detailed Vendor Contacts

### Sentry

| Contact Type | Details |
|-------------|---------|
| **Privacy Email** | dpa@sentry.io |
| **DPA Request** | https://sentry.io/legal/dpa/ |
| **Data Deletion** | https://docs.sentry.io/account/soc2/#data-deletion |
| **Status Page** | https://status.sentry.io |
| **Security Incidents** | security@sentry.io |

### Supabase

| Contact Type | Details |
|-------------|---------|
| **Privacy Email** | privacy@supabase.io |
| **DPA Request** | https://supabase.com/legal/dpa |
| **Data Deletion** | https://supabase.com/privacy |
| **Status Page** | https://status.supabase.com |
| **Security Incidents** | security@supabase.io |

### OpenAI

| Contact Type | Details |
|-------------|---------|
| **Privacy Email** | privacy@openai.com |
| **DPA Request** | https://openai.com/policies |
| **Data Deletion** | https://help.openai.com/en/articles/7039943-data-deletion-request |
| **Status Page** | https://status.openai.com |
| **Security Incidents** | https://openai.com/security/disclosure |

### PostHog

| Contact Type | Details |
|-------------|---------|
| **Privacy Email** | privacy@posthog.com |
| **DPA Request** | https://posthog.com/docs/privacy/dpa |
| **Data Deletion** | https://posthog.com/docs/privacy/data-deletion |
| **Status Page** | https://status.posthog.com |
| **Security Incidents** | security@posthog.com |

### Resend

| Contact Type | Details |
|-------------|---------|
| **Privacy Email** | privacy@resend.com |
| **DPA Request** | https://resend.com/legal/dpa |
| **Data Deletion** | https://resend.com/legal/privacy-policy |
| **Status Page** | https://status.resend.com |
| **Security Incidents** | security@resend.com |

### Stripe

| Contact Type | Details |
|-------------|---------|
| **Privacy Email** | privacy@stripe.com |
| **DPA Request** | https://stripe.com/legal/dpa |
| **Data Deletion** | https://support.stripe.com/questions/privacy-and-data-protection |
| **Status Page** | https://status.stripe.com |
| **Security Incidents** | https://stripe.com/docs/security/reporting |

### stripe-ios

| Contact Type | Details |
|-------------|---------|
| **Privacy Email** | [Contact vendor directly] |
| **DPA Request** | [Request from vendor] |
| **Data Deletion** | [Check vendor documentation] |
| **Status Page** | [Check vendor documentation] |
| **Security Incidents** | [Check vendor documentation] |

---

## DSAR Quick-Reference Checklist

When handling a Data Subject Access Request, use this checklist to ensure all vendors are notified:

| Step | Action |
|------|--------|
| 1 | Identify which vendors hold data for the requesting data subject |
| 2 | Email each vendor's privacy team (see table above) with the DSAR details |
| 3 | Request data export and/or deletion within the legal timeframe |
| 4 | Track vendor responses — set a 14-day follow-up reminder per vendor |
| 5 | Confirm all vendors have completed the request before responding to the data subject |
| 6 | Document vendor responses in the DSAR log |

### Response Deadlines

- **GDPR:** 30 calendar days (extendable to 90 for complex requests)
- **CCPA:** 45 calendar days (extendable to 90)

---

## Maintaining This Document

- **Review frequency:** Quarterly, or whenever a new third-party service is added
- **Ownership:** Data Protection Officer / Privacy Team
- **Update process:** Re-run Codepliant to regenerate from current codebase, then verify contact details

---

*This vendor contacts directory was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Contact details are based on publicly available information at the time of generation. Verify all URLs and email addresses before use, as vendors may update their contact information.*