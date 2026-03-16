# API Privacy Documentation

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Organization:** [Your Company Name]

**Project:** root

This document maps API endpoints to the types of personal data they process, providing transparency for privacy compliance. Each endpoint is linked to the relevant section of the Privacy Policy.

For questions about API data handling, contact [your-email@example.com].

## Overview

Total API endpoints detected: **16**

| Metric | Count |
|--------|-------|
| Endpoints accepting user data | 0 |
| Write endpoints (POST/PUT/PATCH/DELETE) | 0 |
| Read-only endpoints (GET/QUERY) | 16 |

## Endpoint Summary

| Endpoint | Method | Data Fields | Privacy Category |
|----------|--------|-------------|-----------------|
| `/` | GET | — | — |
| `/*` | GET | — | — |
| `/health` | GET | — | — |
| `/health` | GET | — | — |
| `/algolia` | GET | — | — |
| `/base-specs` | GET | — | — |
| `/download/[area]` | GET | — | — |
| `/schema` | GET | — | — |
| `/tag` | GET | — | — |
| `/md-content/[[...slug]]` | GET | — | — |
| `/md-content/[[...slug]]` | GET | — | — |
| `/md-content/[[...slug]]` | GET | — | — |
| `/api/references/[...slug]` | GET | — | — |
| `/md-content/[[...slug]]` | GET | — | — |
| `/md-content/[[...slug]]` | GET | — | — |
| `/md-content/[[...slug]]` | GET | — | — |

## Privacy Policy Mapping

The following table maps data categories collected through the API to the corresponding sections in your Privacy Policy.

| Data Category | Privacy Policy Section | Legal Basis (GDPR) | Retention |
|--------------|----------------------|-------------------|-----------|
| Financial Data | [Map to relevant section] | [Determine legal basis] | [Define retention period] |
| Usage & Behavioral Data | Automatically Collected Information | Legitimate interest (Art. 6(1)(f)) | [X] days |
| AI Interaction Data | AI and Automated Processing | Contractual necessity / Consent | [X] days |
| Communication Data | Communications | Contractual necessity (Art. 6(1)(b)) | [X] days |
| User-Uploaded Content | User Content | Contractual necessity (Art. 6(1)(b)) | Until deletion requested |
| Stored User Data | [Map to relevant section] | [Determine legal basis] | [Define retention period] |
| Personal Identity Data | Personal Information We Collect | Contractual necessity (Art. 6(1)(b)) | Duration of account + [X] days |

## Detailed Endpoint Documentation

### `GET /`

| Property | Value |
|----------|-------|
| **File** | `packages/admin/admin-bundler/src/commands/serve.ts` |
| **Method** | GET |
| **Route** | `/` |
| **Data fields** | None detected |

### `GET /*`

| Property | Value |
|----------|-------|
| **File** | `packages/admin/admin-bundler/src/commands/serve.ts` |
| **Method** | GET |
| **Route** | `/*` |
| **Data fields** | None detected |

### `GET /health`

| Property | Value |
|----------|-------|
| **File** | `packages/medusa/src/commands/start.ts` |
| **Method** | GET |
| **Route** | `/health` |
| **Data fields** | None detected |

### `GET /health`

| Property | Value |
|----------|-------|
| **File** | `packages/medusa-test-utils/src/medusa-test-runner-utils/bootstrap-app.ts` |
| **Method** | GET |
| **Route** | `/health` |
| **Data fields** | None detected |

### `GET /algolia`

| Property | Value |
|----------|-------|
| **File** | `www/apps/api-reference/app/algolia/route.ts` |
| **Method** | GET |
| **Route** | `/algolia` |
| **Data fields** | None detected |

### `GET /base-specs`

| Property | Value |
|----------|-------|
| **File** | `www/apps/api-reference/app/base-specs/route.ts` |
| **Method** | GET |
| **Route** | `/base-specs` |
| **Data fields** | None detected |

### `GET /download/[area]`

| Property | Value |
|----------|-------|
| **File** | `www/apps/api-reference/app/download/[area]/route.ts` |
| **Method** | GET |
| **Route** | `/download/[area]` |
| **Data fields** | None detected |

### `GET /schema`

| Property | Value |
|----------|-------|
| **File** | `www/apps/api-reference/app/schema/route.ts` |
| **Method** | GET |
| **Route** | `/schema` |
| **Data fields** | None detected |

### `GET /tag`

| Property | Value |
|----------|-------|
| **File** | `www/apps/api-reference/app/tag/route.ts` |
| **Method** | GET |
| **Route** | `/tag` |
| **Data fields** | None detected |

### `GET /md-content/[[...slug]]`

| Property | Value |
|----------|-------|
| **File** | `www/apps/bloom/app/md-content/[[...slug]]/route.ts` |
| **Method** | GET |
| **Route** | `/md-content/[[...slug]]` |
| **Data fields** | None detected |

### `GET /md-content/[[...slug]]`

| Property | Value |
|----------|-------|
| **File** | `www/apps/book/app/md-content/[[...slug]]/route.ts` |
| **Method** | GET |
| **Route** | `/md-content/[[...slug]]` |
| **Data fields** | None detected |

### `GET /md-content/[[...slug]]`

| Property | Value |
|----------|-------|
| **File** | `www/apps/cloud/app/md-content/[[...slug]]/route.ts` |
| **Method** | GET |
| **Route** | `/md-content/[[...slug]]` |
| **Data fields** | None detected |

### `GET /api/references/[...slug]`

| Property | Value |
|----------|-------|
| **File** | `www/apps/resources/app/api/references/[...slug]/route.ts` |
| **Method** | GET |
| **Route** | `/api/references/[...slug]` |
| **Data fields** | None detected |

### `GET /md-content/[[...slug]]`

| Property | Value |
|----------|-------|
| **File** | `www/apps/resources/app/md-content/[[...slug]]/route.ts` |
| **Method** | GET |
| **Route** | `/md-content/[[...slug]]` |
| **Data fields** | None detected |

### `GET /md-content/[[...slug]]`

| Property | Value |
|----------|-------|
| **File** | `www/apps/ui/app/md-content/[[...slug]]/route.ts` |
| **Method** | GET |
| **Route** | `/md-content/[[...slug]]` |
| **Data fields** | None detected |

### `GET /md-content/[[...slug]]`

| Property | Value |
|----------|-------|
| **File** | `www/apps/user-guide/app/md-content/[[...slug]]/route.ts` |
| **Method** | GET |
| **Route** | `/md-content/[[...slug]]` |
| **Data fields** | None detected |

## API Data Flow to Third-Party Services

The following third-party services may receive data submitted through the API.

| Service | Category | Data Shared | Purpose |
|---------|----------|-------------|---------|
| @aws-sdk/client-s3 | storage | uploaded files, file metadata | [Describe purpose] |
| @segment/analytics-next | analytics | user identity, user behavior, page views, custom events, device information, IP address | [Describe purpose] |
| @sendgrid/mail | email | email addresses, email content | [Describe purpose] |
| algoliasearch | other | search queries, search result clicks, user search behavior | [Describe purpose] |
| cookie-parser | other | cookies, cookie data | [Describe purpose] |
| express-session | other | session cookies, session data | [Describe purpose] |
| ioredis | database | cached data, session data | [Describe purpose] |
| Multer | storage | uploaded files, file metadata, potential PII in uploaded content | [Describe purpose] |
| openai | ai | user prompts, conversation history, generated content | [Describe purpose] |
| posthog | analytics | user behavior, session recordings, feature flag usage, device information | [Describe purpose] |
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

*This API privacy documentation was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **root** codebase. It should be reviewed by your engineering and legal teams to ensure accuracy and completeness. Fields marked with brackets require manual input.*
