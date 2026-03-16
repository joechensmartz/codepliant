# Vendor Contacts Directory

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** @documenso/root

**Data Controller:** [Your Company Name]

## Related Documents

- Sub-Processor List (`SUBPROCESSOR_LIST.md`)
- DSAR Handling Guide (`DSAR_HANDLING_GUIDE.md`)
- Third-Party Risk Assessment (`THIRD_PARTY_RISK_ASSESSMENT.md`)

---

## Overview

This document provides contact information for all detected third-party service providers (vendors) used by the **@documenso/root** application. It is intended as a quick-reference for Data Subject Access Request (DSAR) handling, Data Processing Agreement (DPA) management, incident response coordination, and ongoing vendor oversight.

For questions about vendor relationships, contact [your-email@example.com].

---

## Vendor Contact Table

| Vendor | Privacy Email | DPA Contact | Data Deletion | Status Page | Incident Reporting |
|--------|--------------|-------------|---------------|-------------|-------------------|
| Vercel AI SDK (Google Vertex) | privacy@vercel.com | [Link](https://vercel.com/legal/dpa) | [Link](https://vercel.com/legal/privacy-policy) | [Link](https://www.vercel-status.com) | security@vercel.com |
| Amazon SES (AWS) | aws-privacy@amazon.com | [Link](https://aws.amazon.com/compliance/data-processing-addendum/) | [Link](https://aws.amazon.com/compliance/) | [Link](https://health.aws.amazon.com) | [Link](https://aws.amazon.com/security/vulnerability-reporting/) |
| Google Cloud KMS | data-protection-office@google.com | [Link](https://cloud.google.com/terms/data-processing-addendum) | [Link](https://privacy.google.com) | [Link](https://status.cloud.google.com) | [Link](https://about.google/appsecurity/) |
| Vercel AI SDK | privacy@vercel.com | [Link](https://vercel.com/legal/dpa) | [Link](https://vercel.com/legal/privacy-policy) | [Link](https://www.vercel-status.com) | security@vercel.com |
| Google APIs | data-protection-office@google.com | [Link](https://cloud.google.com/terms/data-processing-addendum) | [Link](https://privacy.google.com) | [Link](https://status.cloud.google.com) | [Link](https://about.google/appsecurity/) |
| PostHog | privacy@posthog.com | [Link](https://posthog.com/docs/privacy/dpa) | [Link](https://posthog.com/docs/privacy/data-deletion) | [Link](https://status.posthog.com) | security@posthog.com |
| Resend | privacy@resend.com | [Link](https://resend.com/legal/dpa) | [Link](https://resend.com/legal/privacy-policy) | [Link](https://status.resend.com) | security@resend.com |
| Stripe | privacy@stripe.com | [Link](https://stripe.com/legal/dpa) | [Link](https://support.stripe.com/questions/privacy-and-data-protection) | [Link](https://status.stripe.com) | [Link](https://stripe.com/docs/security/reporting) |

---

## Detailed Vendor Contacts

### Vercel AI SDK (Google Vertex)

| Contact Type | Details |
|-------------|---------|
| **Privacy Email** | privacy@vercel.com |
| **DPA Request** | https://vercel.com/legal/dpa |
| **Data Deletion** | https://vercel.com/legal/privacy-policy |
| **Status Page** | https://www.vercel-status.com |
| **Security Incidents** | security@vercel.com |

### Amazon SES (AWS)

| Contact Type | Details |
|-------------|---------|
| **Privacy Email** | aws-privacy@amazon.com |
| **DPA Request** | https://aws.amazon.com/compliance/data-processing-addendum/ |
| **Data Deletion** | https://aws.amazon.com/compliance/ |
| **Status Page** | https://health.aws.amazon.com |
| **Security Incidents** | https://aws.amazon.com/security/vulnerability-reporting/ |

### Google Cloud KMS

| Contact Type | Details |
|-------------|---------|
| **Privacy Email** | data-protection-office@google.com |
| **DPA Request** | https://cloud.google.com/terms/data-processing-addendum |
| **Data Deletion** | https://privacy.google.com |
| **Status Page** | https://status.cloud.google.com |
| **Security Incidents** | https://about.google/appsecurity/ |

### Vercel AI SDK

| Contact Type | Details |
|-------------|---------|
| **Privacy Email** | privacy@vercel.com |
| **DPA Request** | https://vercel.com/legal/dpa |
| **Data Deletion** | https://vercel.com/legal/privacy-policy |
| **Status Page** | https://www.vercel-status.com |
| **Security Incidents** | security@vercel.com |

### Google APIs

| Contact Type | Details |
|-------------|---------|
| **Privacy Email** | data-protection-office@google.com |
| **DPA Request** | https://cloud.google.com/terms/data-processing-addendum |
| **Data Deletion** | https://privacy.google.com |
| **Status Page** | https://status.cloud.google.com |
| **Security Incidents** | https://about.google/appsecurity/ |

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