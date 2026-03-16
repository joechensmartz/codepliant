# API Privacy Documentation

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Organization:** [Your Company Name]

**Project:** twenty

This document maps API endpoints to the types of personal data they process, providing transparency for privacy compliance. Each endpoint is linked to the relevant section of the Privacy Policy.

For questions about API data handling, contact [your-email@example.com].

## Overview

Total API endpoints detected: **15**

| Metric | Count |
|--------|-------|
| Endpoints accepting user data | 5 |
| Write endpoints (POST/PUT/PATCH/DELETE) | 6 |
| Read-only endpoints (GET/QUERY) | 9 |

## Endpoint Summary

| Endpoint | Method | Data Fields | Privacy Category |
|----------|--------|-------------|-----------------|
| `/start-recording` | GET | — | — |
| `/recording/:recordingId` | GET | — | — |
| `/(public)/releases/api` | GET | — | — |
| `/api/contributors/[slug]/og.png` | GET | — | — |
| `/api/contributors/contributorStats/[slug]` | GET | — | — |
| `/api/enterprise/activate` | GET | — | — |
| `/api/enterprise/checkout` | POST | billingInterval, successUrl, seatCount | Other |
| `/api/enterprise/portal` | POST | enterpriseKey, returnUrl | Other |
| `/api/enterprise/seats` | POST | enterpriseKey, seatCount | Other |
| `/api/enterprise/status` | POST | enterpriseKey | Other |
| `/api/enterprise/validate` | POST | enterpriseKey | Other |
| `/api/github-stars` | GET | — | — |
| `/api/keystatic/[...params]` | GET | — | — |
| `/api/keystatic/[...params]` | POST | — | — |
| `/api/releases` | GET | — | — |

## Privacy Policy Mapping

The following table maps data categories collected through the API to the corresponding sections in your Privacy Policy.

| Data Category | Privacy Policy Section | Legal Basis (GDPR) | Retention |
|--------------|----------------------|-------------------|-----------|
| Other | [Map to relevant section] | [Determine legal basis] | [Define retention period] |
| Personal Identity Data | Personal Information We Collect | Contractual necessity (Art. 6(1)(b)) | Duration of account + [X] days |
| Financial Data | [Map to relevant section] | [Determine legal basis] | [Define retention period] |
| AI Interaction Data | AI and Automated Processing | Contractual necessity / Consent | [X] days |
| Communication Data | Communications | Contractual necessity (Art. 6(1)(b)) | [X] days |
| Technical & Diagnostic Data | Automatically Collected Information | Legitimate interest (Art. 6(1)(f)) | [X] days |
| User-Uploaded Content | User Content | Contractual necessity (Art. 6(1)(b)) | Until deletion requested |
| Stored User Data | [Map to relevant section] | [Determine legal basis] | [Define retention period] |
| Contact Information | [Map to relevant section] | [Determine legal basis] | [Define retention period] |
| Authentication Data | [Map to relevant section] | [Determine legal basis] | [Define retention period] |
| Location Data | [Map to relevant section] | [Determine legal basis] | [Define retention period] |

## Detailed Endpoint Documentation

### `GET /start-recording`

| Property | Value |
|----------|-------|
| **File** | `packages/twenty-companion/src/server.js` |
| **Method** | GET |
| **Route** | `/start-recording` |
| **Data fields** | None detected |

### `GET /recording/:recordingId`

| Property | Value |
|----------|-------|
| **File** | `packages/twenty-companion/src/server.js` |
| **Method** | GET |
| **Route** | `/recording/:recordingId` |
| **Data fields** | None detected |

### `GET /(public)/releases/api`

| Property | Value |
|----------|-------|
| **File** | `packages/twenty-website/src/app/(public)/releases/api/route.tsx` |
| **Method** | GET |
| **Route** | `/(public)/releases/api` |
| **Data fields** | None detected |

### `GET /api/contributors/[slug]/og.png`

| Property | Value |
|----------|-------|
| **File** | `packages/twenty-website/src/app/api/contributors/[slug]/og.png/route.tsx` |
| **Method** | GET |
| **Route** | `/api/contributors/[slug]/og.png` |
| **Data fields** | None detected |

### `GET /api/contributors/contributorStats/[slug]`

| Property | Value |
|----------|-------|
| **File** | `packages/twenty-website/src/app/api/contributors/contributorStats/[slug]/route.tsx` |
| **Method** | GET |
| **Route** | `/api/contributors/contributorStats/[slug]` |
| **Data fields** | None detected |

### `GET /api/enterprise/activate`

| Property | Value |
|----------|-------|
| **File** | `packages/twenty-website/src/app/api/enterprise/activate/route.ts` |
| **Method** | GET |
| **Route** | `/api/enterprise/activate` |
| **Data fields** | None detected |

### `POST /api/enterprise/checkout`

| Property | Value |
|----------|-------|
| **File** | `packages/twenty-website/src/app/api/enterprise/checkout/route.ts` |
| **Method** | POST |
| **Route** | `/api/enterprise/checkout` |
| **Data fields** | billingInterval, successUrl, seatCount |
| **Privacy categories** | Other |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `billingInterval` | Other | [YES/NO] | [Describe purpose] |
| `successUrl` | Other | [YES/NO] | [Describe purpose] |
| `seatCount` | Other | [YES/NO] | [Describe purpose] |

### `POST /api/enterprise/portal`

| Property | Value |
|----------|-------|
| **File** | `packages/twenty-website/src/app/api/enterprise/portal/route.ts` |
| **Method** | POST |
| **Route** | `/api/enterprise/portal` |
| **Data fields** | enterpriseKey, returnUrl |
| **Privacy categories** | Other |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `enterpriseKey` | Other | [YES/NO] | [Describe purpose] |
| `returnUrl` | Other | [YES/NO] | [Describe purpose] |

### `POST /api/enterprise/seats`

| Property | Value |
|----------|-------|
| **File** | `packages/twenty-website/src/app/api/enterprise/seats/route.ts` |
| **Method** | POST |
| **Route** | `/api/enterprise/seats` |
| **Data fields** | enterpriseKey, seatCount |
| **Privacy categories** | Other |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `enterpriseKey` | Other | [YES/NO] | [Describe purpose] |
| `seatCount` | Other | [YES/NO] | [Describe purpose] |

### `POST /api/enterprise/status`

| Property | Value |
|----------|-------|
| **File** | `packages/twenty-website/src/app/api/enterprise/status/route.ts` |
| **Method** | POST |
| **Route** | `/api/enterprise/status` |
| **Data fields** | enterpriseKey |
| **Privacy categories** | Other |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `enterpriseKey` | Other | [YES/NO] | [Describe purpose] |

### `POST /api/enterprise/validate`

| Property | Value |
|----------|-------|
| **File** | `packages/twenty-website/src/app/api/enterprise/validate/route.ts` |
| **Method** | POST |
| **Route** | `/api/enterprise/validate` |
| **Data fields** | enterpriseKey |
| **Privacy categories** | Other |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `enterpriseKey` | Other | [YES/NO] | [Describe purpose] |

### `GET /api/github-stars`

| Property | Value |
|----------|-------|
| **File** | `packages/twenty-website/src/app/api/github-stars/route.tsx` |
| **Method** | GET |
| **Route** | `/api/github-stars` |
| **Data fields** | None detected |

### `GET /api/keystatic/[...params]`

| Property | Value |
|----------|-------|
| **File** | `packages/twenty-website/src/app/api/keystatic/[...params]/route.ts` |
| **Method** | GET |
| **Route** | `/api/keystatic/[...params]` |
| **Data fields** | None detected |

### `POST /api/keystatic/[...params]`

| Property | Value |
|----------|-------|
| **File** | `packages/twenty-website/src/app/api/keystatic/[...params]/route.ts` |
| **Method** | POST |
| **Route** | `/api/keystatic/[...params]` |
| **Data fields** | None detected |

### `GET /api/releases`

| Property | Value |
|----------|-------|
| **File** | `packages/twenty-website/src/app/api/releases/route.tsx` |
| **Method** | GET |
| **Route** | `/api/releases` |
| **Data fields** | None detected |

## API Data Flow to Third-Party Services

The following third-party services may receive data submitted through the API.

| Service | Category | Data Shared | Purpose |
|---------|----------|-------------|---------|
| @ai-sdk/anthropic | ai | user prompts, conversation history, generated content | [Describe purpose] |
| @ai-sdk/google | ai | user prompts, conversation history, generated content | [Describe purpose] |
| @ai-sdk/openai | ai | user prompts, conversation history, generated content | [Describe purpose] |
| @aws-sdk/client-s3 | storage | uploaded files, file metadata | [Describe purpose] |
| @sentry/node | monitoring | error data, stack traces, user context, device information, IP address, performance profiles | [Describe purpose] |
| @vercel/ai | ai | user prompts, conversation history, generated content | [Describe purpose] |
| drizzle | database | user data as defined in schema | [Describe purpose] |
| googleapis | other | user data via Google APIs, calendar data, email data, profile information | [Describe purpose] |
| ioredis | database | cached data, session data | [Describe purpose] |
| nodemailer | email | email addresses, email content | [Describe purpose] |
| openai | ai | user prompts, conversation history, generated content | [Describe purpose] |
| passport | auth | email, name, OAuth tokens, session data | [Describe purpose] |
| passport-google-oauth20 | auth | email, name, Google profile data, OAuth tokens | [Describe purpose] |
| passport-microsoft | auth | email, name, Microsoft profile data, OAuth tokens | [Describe purpose] |
| redis | database | cached data, session data | [Describe purpose] |
| stripe | payment | payment information, billing address, email, transaction history | [Describe purpose] |

## Recommendations

- [ ] Document the purpose and legal basis for each data field collected
- [ ] Implement input validation on all endpoints accepting user data
- [ ] Add rate limiting to prevent abuse of data-accepting endpoints
- [ ] Ensure authentication is required for all endpoints accessing personal data
- [ ] Implement field-level encryption for sensitive data (SSN, financial data)
- [ ] Add API versioning to manage privacy-impacting changes
- [ ] Log all data access for audit trail purposes
- [ ] Document data retention periods for each endpoint's data

## Related Documents

- Privacy Policy (`PRIVACY_POLICY.md`)
- Data Dictionary (`DATA_DICTIONARY.md`)

---

*This API privacy documentation was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **twenty** codebase. It should be reviewed by your engineering and legal teams to ensure accuracy and completeness. Fields marked with brackets require manual input.*
