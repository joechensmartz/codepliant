# Data Subject Access Request (DSAR) Log

> **Document Version:** 1.0  
> **Document Owner:** Acme Inc  
> **Next Review Date:** 2027-03-18


**Organisation:** Acme Inc
**DPO / Privacy Contact:** dpo@acme-saas.com
**Created:** 2026-03-18
**Applicable Regulations:** GDPR

---

> This template provides a structured log for recording and tracking all Data Subject Access Requests (DSARs). Maintaining this log is required under GDPR Article 12(5) to demonstrate compliance with data subject rights obligations. Each request must be documented from receipt through completion.

## Request Type Reference

| Code | Type | Deadline (days) | Description |
|------|------|-----------------|-------------|

## Status Values

| Status | Description |
|--------|-------------|
| Received | Request received, awaiting identity verification |
| Verifying | Identity verification in progress |
| In Progress | Verified; gathering data or executing request |
| Extended | Deadline extended (complex request, max +60 days GDPR / +45 days CCPA) |
| Completed | Request fulfilled, response sent to subject |
| Denied | Request denied with documented reason (e.g. manifestly unfounded) |
| Closed | Completed and archived |

## DSAR Log

> Copy and append a new row for each incoming request.

| ID | Date Received | Type | Data Subject | Channel | Status | Due Date | Completed | Handler | Notes |
|----|---------------|------|--------------|---------|--------|----------|-----------|---------|-------|
| DSAR-001 | __________ | ___ | ____________ | Email / Form / Phone | Received | __________ | | _______ | |
| DSAR-002 | __________ | ___ | ____________ | Email / Form / Phone | Received | __________ | | _______ | |
| DSAR-003 | __________ | ___ | ____________ | Email / Form / Phone | Received | __________ | | _______ | |
| DSAR-004 | __________ | ___ | ____________ | Email / Form / Phone | Received | __________ | | _______ | |
| DSAR-005 | __________ | ___ | ____________ | Email / Form / Phone | Received | __________ | | _______ | |

## Identity Verification Log

> Before processing any DSAR, verify the identity of the requester to prevent unauthorised disclosure.

| DSAR ID | Verification Method | Verified By | Verified Date | Outcome |
|---------|---------------------|-------------|---------------|---------|
| DSAR-001 | ID document / Account login / Knowledge-based | _______ | __________ | Confirmed / Denied |
| DSAR-002 | ID document / Account login / Knowledge-based | _______ | __________ | Confirmed / Denied |
| DSAR-003 | ID document / Account login / Knowledge-based | _______ | __________ | Confirmed / Denied |

## Data Locations by Service

> When fulfilling a DSAR, data must be gathered from all services that store personal data.

| Service | Category | Data Collected | Action Required |
|---------|----------|----------------|-----------------|
| @sentry/node | monitoring | error data, stack traces, user context, device information, IP address | Export / Delete / Rectify |
| @supabase/supabase-js | auth | email, password hash, session data, user metadata | Export / Delete / Rectify |
| openai | ai | user prompts, conversation history, generated content | Export / Delete / Rectify |
| posthog | analytics | user behavior, session recordings, feature flag usage, device information | Export / Delete / Rectify |
| prisma | database | user data as defined in schema | Export / Delete / Rectify |
| resend | email | email addresses, email content | Export / Delete / Rectify |
| stripe | payment | payment information, billing address, email, transaction history | Export / Delete / Rectify |
| stripe-ios | payment | payment information, billing address, email, transaction history | Export / Delete / Rectify |

## Response Tracking

| DSAR ID | Response Date | Response Method | Data Provided | Exemptions Applied | Sent By |
|---------|---------------|-----------------|---------------|--------------------|---------| 
| DSAR-001 | __________ | Email / Portal / Post | Yes / Partial | None / Art. 17(3) | _______ |
| DSAR-002 | __________ | Email / Portal / Post | Yes / Partial | None / Art. 17(3) | _______ |
| DSAR-003 | __________ | Email / Portal / Post | Yes / Partial | None / Art. 17(3) | _______ |

## Deadline Extensions

> GDPR allows a 60-day extension for complex requests (Art. 12(3)). CCPA allows a 45-day extension. Extensions must be communicated to the data subject within the original deadline.

| DSAR ID | Original Due Date | Extended Due Date | Reason | Subject Notified | Notified Date |
|---------|-------------------|-------------------|--------|------------------|---------------|
| _______ | __________ | __________ | Complex request / Multiple systems | Yes / No | __________ |

## Denial Log

> Requests may be denied if manifestly unfounded or excessive (GDPR Art. 12(5)). Document the reason and inform the data subject of their right to complain to a supervisory authority.

| DSAR ID | Denial Date | Reason | Legal Basis | Subject Informed | Supervisory Authority Info Provided |
|---------|-------------|--------|-------------|------------------|-------------------------------------|
| _______ | __________ | ____________ | Art. 12(5) / Art. 17(3) | Yes | Yes |

## Monthly DSAR Summary

> Complete this section at the end of each month to track DSAR volume and performance.

### Month: __________ Year: __________

| Metric | Count |
|--------|-------|
| Total requests received | ___ |
| Access requests (ACC) | ___ |
| Erasure requests (ERA) | ___ |
| Rectification requests (REC) | ___ |
| Portability requests (POR) | ___ |
| Restriction requests (RES) | ___ |
| Objection requests (OBJ) | ___ |
| Completed within deadline | ___ |
| Completed with extension | ___ |
| Denied | ___ |
| Still open | ___ |
| Average response time (days) | ___ |

**Reported by:** _______________
**Date:** _______________

## Quarterly DSAR Report

### Quarter: Q__ Year: __________

| Month | Received | Completed | On-Time % | Avg Response (days) | Denied |
|-------|----------|-----------|-----------|---------------------|--------|
| Month 1 | ___ | ___ | ___% | ___ | ___ |
| Month 2 | ___ | ___ | ___% | ___ | ___ |
| Month 3 | ___ | ___ | ___% | ___ | ___ |
| **Total** | **___** | **___** | **___**% | **___** | **___** |

**Trends and Observations:**
1. ___
2. ___
3. ___

**Reviewed by:** _______________
**Date:** _______________

## Response Deadlines Reference

| Regulation | Standard Deadline | Maximum Extension | Total Maximum |
|------------|-------------------|-------------------|---------------|

---

*This DSAR Log Template was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. It implements record-keeping requirements under GDPR Article 12(5) and CCPA operational tracking. Adapt this template to your specific organisational needs and have it reviewed by your data protection officer or legal counsel.*
