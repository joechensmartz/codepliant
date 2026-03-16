# API Privacy Documentation

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Organization:** [Your Company Name]

**Project:** @documenso/root

This document maps API endpoints to the types of personal data they process, providing transparency for privacy compliance. Each endpoint is linked to the relevant section of the Privacy Policy.

For questions about API data handling, contact [your-email@example.com].

## Overview

Total API endpoints detected: **25**

| Metric | Count |
|--------|-------|
| Endpoints accepting user data | 0 |
| Write endpoints (POST/PUT/PATCH/DELETE) | 0 |
| Read-only endpoints (GET/QUERY) | 25 |

## Endpoint Summary

| Endpoint | Method | Data Fields | Privacy Category |
|----------|--------|-------------|-----------------|
| `/llms-full.txt` | GET | — | — |
| `/llms.mdx/docs/[[...slug]]` | GET | — | — |
| `/llms.txt` | GET | — | — |
| `/og/docs/[...slug]` | GET | — | — |
| `/route.ts` | GET | — | — |
| `/community` | GET | — | — |
| `/community/total-forks` | GET | — | — |
| `/community/total-issues` | GET | — | — |
| `/community/total-prs` | GET | — | — |
| `/community/total-stars` | GET | — | — |
| `/github` | GET | — | — |
| `/github/forks` | GET | — | — |
| `/github/issues` | GET | — | — |
| `/github/prs` | GET | — | — |
| `/github/stars` | GET | — | — |
| `/growth` | GET | — | — |
| `/growth/completed-documents` | GET | — | — |
| `/growth/new-users` | GET | — | — |
| `/growth/signer-conversion` | GET | — | — |
| `/growth/total-completed-documents` | GET | — | — |
| `/growth/total-customers` | GET | — | — |
| `/growth/total-signer-conversion` | GET | — | — |
| `/growth/total-users` | GET | — | — |
| `/api/v2/openapi.json` | GET | — | — |
| `/api/v2-beta/openapi.json` | GET | — | — |

## Privacy Policy Mapping

The following table maps data categories collected through the API to the corresponding sections in your Privacy Policy.

| Data Category | Privacy Policy Section | Legal Basis (GDPR) | Retention |
|--------------|----------------------|-------------------|-----------|
| Personal Identity Data | Personal Information We Collect | Contractual necessity (Art. 6(1)(b)) | Duration of account + [X] days |
| Financial Data | [Map to relevant section] | [Determine legal basis] | [Define retention period] |
| Usage & Behavioral Data | Automatically Collected Information | Legitimate interest (Art. 6(1)(f)) | [X] days |
| AI Interaction Data | AI and Automated Processing | Contractual necessity / Consent | [X] days |
| Communication Data | Communications | Contractual necessity (Art. 6(1)(b)) | [X] days |
| Stored User Data | [Map to relevant section] | [Determine legal basis] | [Define retention period] |

## Detailed Endpoint Documentation

### `GET /llms-full.txt`

| Property | Value |
|----------|-------|
| **File** | `apps/docs/src/app/llms-full.txt/route.ts` |
| **Method** | GET |
| **Route** | `/llms-full.txt` |
| **Data fields** | None detected |

### `GET /llms.mdx/docs/[[...slug]]`

| Property | Value |
|----------|-------|
| **File** | `apps/docs/src/app/llms.mdx/docs/[[...slug]]/route.ts` |
| **Method** | GET |
| **Route** | `/llms.mdx/docs/[[...slug]]` |
| **Data fields** | None detected |

### `GET /llms.txt`

| Property | Value |
|----------|-------|
| **File** | `apps/docs/src/app/llms.txt/route.ts` |
| **Method** | GET |
| **Route** | `/llms.txt` |
| **Data fields** | None detected |

### `GET /og/docs/[...slug]`

| Property | Value |
|----------|-------|
| **File** | `apps/docs/src/app/og/docs/[...slug]/route.tsx` |
| **Method** | GET |
| **Route** | `/og/docs/[...slug]` |
| **Data fields** | None detected |

### `GET /route.ts`

| Property | Value |
|----------|-------|
| **File** | `apps/openpage-api/app/route.ts` |
| **Method** | GET |
| **Route** | `/route.ts` |
| **Data fields** | None detected |

### `GET /community`

| Property | Value |
|----------|-------|
| **File** | `apps/openpage-api/app/community/route.ts` |
| **Method** | GET |
| **Route** | `/community` |
| **Data fields** | None detected |

### `GET /community/total-forks`

| Property | Value |
|----------|-------|
| **File** | `apps/openpage-api/app/community/total-forks/route.ts` |
| **Method** | GET |
| **Route** | `/community/total-forks` |
| **Data fields** | None detected |

### `GET /community/total-issues`

| Property | Value |
|----------|-------|
| **File** | `apps/openpage-api/app/community/total-issues/route.ts` |
| **Method** | GET |
| **Route** | `/community/total-issues` |
| **Data fields** | None detected |

### `GET /community/total-prs`

| Property | Value |
|----------|-------|
| **File** | `apps/openpage-api/app/community/total-prs/route.ts` |
| **Method** | GET |
| **Route** | `/community/total-prs` |
| **Data fields** | None detected |

### `GET /community/total-stars`

| Property | Value |
|----------|-------|
| **File** | `apps/openpage-api/app/community/total-stars/route.ts` |
| **Method** | GET |
| **Route** | `/community/total-stars` |
| **Data fields** | None detected |

### `GET /github`

| Property | Value |
|----------|-------|
| **File** | `apps/openpage-api/app/github/route.ts` |
| **Method** | GET |
| **Route** | `/github` |
| **Data fields** | None detected |

### `GET /github/forks`

| Property | Value |
|----------|-------|
| **File** | `apps/openpage-api/app/github/forks/route.ts` |
| **Method** | GET |
| **Route** | `/github/forks` |
| **Data fields** | None detected |

### `GET /github/issues`

| Property | Value |
|----------|-------|
| **File** | `apps/openpage-api/app/github/issues/route.ts` |
| **Method** | GET |
| **Route** | `/github/issues` |
| **Data fields** | None detected |

### `GET /github/prs`

| Property | Value |
|----------|-------|
| **File** | `apps/openpage-api/app/github/prs/route.ts` |
| **Method** | GET |
| **Route** | `/github/prs` |
| **Data fields** | None detected |

### `GET /github/stars`

| Property | Value |
|----------|-------|
| **File** | `apps/openpage-api/app/github/stars/route.ts` |
| **Method** | GET |
| **Route** | `/github/stars` |
| **Data fields** | None detected |

### `GET /growth`

| Property | Value |
|----------|-------|
| **File** | `apps/openpage-api/app/growth/route.ts` |
| **Method** | GET |
| **Route** | `/growth` |
| **Data fields** | None detected |

### `GET /growth/completed-documents`

| Property | Value |
|----------|-------|
| **File** | `apps/openpage-api/app/growth/completed-documents/route.ts` |
| **Method** | GET |
| **Route** | `/growth/completed-documents` |
| **Data fields** | None detected |

### `GET /growth/new-users`

| Property | Value |
|----------|-------|
| **File** | `apps/openpage-api/app/growth/new-users/route.ts` |
| **Method** | GET |
| **Route** | `/growth/new-users` |
| **Data fields** | None detected |

### `GET /growth/signer-conversion`

| Property | Value |
|----------|-------|
| **File** | `apps/openpage-api/app/growth/signer-conversion/route.ts` |
| **Method** | GET |
| **Route** | `/growth/signer-conversion` |
| **Data fields** | None detected |

### `GET /growth/total-completed-documents`

| Property | Value |
|----------|-------|
| **File** | `apps/openpage-api/app/growth/total-completed-documents/route.ts` |
| **Method** | GET |
| **Route** | `/growth/total-completed-documents` |
| **Data fields** | None detected |

### `GET /growth/total-customers`

| Property | Value |
|----------|-------|
| **File** | `apps/openpage-api/app/growth/total-customers/route.ts` |
| **Method** | GET |
| **Route** | `/growth/total-customers` |
| **Data fields** | None detected |

### `GET /growth/total-signer-conversion`

| Property | Value |
|----------|-------|
| **File** | `apps/openpage-api/app/growth/total-signer-conversion/route.ts` |
| **Method** | GET |
| **Route** | `/growth/total-signer-conversion` |
| **Data fields** | None detected |

### `GET /growth/total-users`

| Property | Value |
|----------|-------|
| **File** | `apps/openpage-api/app/growth/total-users/route.ts` |
| **Method** | GET |
| **Route** | `/growth/total-users` |
| **Data fields** | None detected |

### `GET /api/v2/openapi.json`

| Property | Value |
|----------|-------|
| **File** | `apps/remix/server/router.ts` |
| **Method** | GET |
| **Route** | `/api/v2/openapi.json` |
| **Data fields** | None detected |

### `GET /api/v2-beta/openapi.json`

| Property | Value |
|----------|-------|
| **File** | `apps/remix/server/router.ts` |
| **Method** | GET |
| **Route** | `/api/v2-beta/openapi.json` |
| **Data fields** | None detected |

## API Data Flow to Third-Party Services

The following third-party services may receive data submitted through the API.

| Service | Category | Data Shared | Purpose |
|---------|----------|-------------|---------|
| @ai-sdk/google-vertex | ai | user prompts, conversation history, generated content | [Describe purpose] |
| @aws-sdk/client-ses | email | email addresses, email content, uploaded files, file metadata | [Describe purpose] |
| @google-cloud/kms | other | encryption keys, key metadata | [Describe purpose] |
| @simplewebauthn/server | auth | biometric authentication data, device attestation, credential IDs | [Describe purpose] |
| @vercel/ai | ai | user prompts, conversation history, generated content | [Describe purpose] |
| googleapis | other | user data via Google APIs, calendar data, email data, profile information | [Describe purpose] |
| next-auth | auth | email, name, profile picture, OAuth tokens, session data | [Describe purpose] |
| nodemailer | email | email addresses, email content | [Describe purpose] |
| passport-microsoft | auth | email, name, Microsoft profile data, OAuth tokens | [Describe purpose] |
| posthog | analytics | user behavior, session recordings, feature flag usage, device information | [Describe purpose] |
| prisma | database | user data as defined in schema | [Describe purpose] |
| resend | email | email addresses, email content | [Describe purpose] |
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

*This API privacy documentation was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **@documenso/root** codebase. It should be reviewed by your engineering and legal teams to ensure accuracy and completeness. Fields marked with brackets require manual input.*
