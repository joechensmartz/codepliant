# API Privacy Documentation

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Organization:** [Your Company Name]

**Project:** @mastodon/mastodon

This document maps API endpoints to the types of personal data they process, providing transparency for privacy compliance. Each endpoint is linked to the relevant section of the Privacy Policy.

For questions about API data handling, contact [your-email@example.com].

## Overview

Total API endpoints detected: **7**

| Metric | Count |
|--------|-------|
| Endpoints accepting user data | 0 |
| Write endpoints (POST/PUT/PATCH/DELETE) | 0 |
| Read-only endpoints (GET/QUERY) | 7 |

## Endpoint Summary

| Endpoint | Method | Data Fields | Privacy Category |
|----------|--------|-------------|-----------------|
| `isLoading` | GET | — | — |
| `description` | GET | — | — |
| `isLoading` | GET | — | — |
| `domain` | GET | — | — |
| `/favicon.ico` | GET | — | — |
| `/api/v1/streaming/health` | GET | — | — |
| `/metrics` | GET | — | — |

## Privacy Policy Mapping

The following table maps data categories collected through the API to the corresponding sections in your Privacy Policy.

| Data Category | Privacy Policy Section | Legal Basis (GDPR) | Retention |
|--------------|----------------------|-------------------|-----------|
| Personal Identity Data | Personal Information We Collect | Contractual necessity (Art. 6(1)(b)) | Duration of account + [X] days |
| Communication Data | Communications | Contractual necessity (Art. 6(1)(b)) | [X] days |
| Technical & Diagnostic Data | Automatically Collected Information | Legitimate interest (Art. 6(1)(f)) | [X] days |
| User-Uploaded Content | User Content | Contractual necessity (Art. 6(1)(b)) | Until deletion requested |
| Stored User Data | [Map to relevant section] | [Determine legal basis] | [Define retention period] |

## Detailed Endpoint Documentation

### `GET isLoading`

| Property | Value |
|----------|-------|
| **File** | `app/javascript/mastodon/components/server_banner.jsx` |
| **Method** | GET |
| **Route** | `isLoading` |
| **Data fields** | None detected |

### `GET description`

| Property | Value |
|----------|-------|
| **File** | `app/javascript/mastodon/components/server_banner.jsx` |
| **Method** | GET |
| **Route** | `description` |
| **Data fields** | None detected |

### `GET isLoading`

| Property | Value |
|----------|-------|
| **File** | `app/javascript/mastodon/features/about/index.jsx` |
| **Method** | GET |
| **Route** | `isLoading` |
| **Data fields** | None detected |

### `GET domain`

| Property | Value |
|----------|-------|
| **File** | `app/javascript/mastodon/features/about/index.jsx` |
| **Method** | GET |
| **Route** | `domain` |
| **Data fields** | None detected |

### `GET /favicon.ico`

| Property | Value |
|----------|-------|
| **File** | `streaming/index.js` |
| **Method** | GET |
| **Route** | `/favicon.ico` |
| **Data fields** | None detected |

### `GET /api/v1/streaming/health`

| Property | Value |
|----------|-------|
| **File** | `streaming/index.js` |
| **Method** | GET |
| **Route** | `/api/v1/streaming/health` |
| **Data fields** | None detected |

### `GET /metrics`

| Property | Value |
|----------|-------|
| **File** | `streaming/index.js` |
| **Method** | GET |
| **Route** | `/metrics` |
| **Data fields** | None detected |

## API Data Flow to Third-Party Services

The following third-party services may receive data submitted through the API.

| Service | Category | Data Shared | Purpose |
|---------|----------|-------------|---------|
| ActionCable | other | real-time user data, connection metadata, channel subscriptions, WebSocket messages | [Describe purpose] |
| ActionController::Cookies | other | session cookies, session data, CSRF tokens | [Describe purpose] |
| ActionMailer | email | email addresses, email content | [Describe purpose] |
| Active Storage | storage | uploaded files, file metadata, storage service credentials, potential PII in uploaded content | [Describe purpose] |
| ActiveRecord | database | user data as defined in schema, timestamps, associations | [Describe purpose] |
| ActiveStorage | storage | uploaded files, file metadata, storage references | [Describe purpose] |
| aws-sdk-s3 | storage | uploaded files, file metadata | [Describe purpose] |
| devise | auth | email, password hash, session data, authentication tokens | [Describe purpose] |
| ioredis | database | cached data, session data | [Describe purpose] |
| omniauth | auth | email, name, OAuth tokens, profile data | [Describe purpose] |
| pg | database | user data as defined in schema | [Describe purpose] |
| PostgreSQL | database | application data, user records | [Describe purpose] |
| PostgreSQL (env) | database | application data, user records | [Describe purpose] |
| pundit | auth | user roles, authorization policies, access control data | [Describe purpose] |
| rack-attack | other | IP addresses, request metadata | [Describe purpose] |
| rails-actionmailer | email | email addresses, email content | [Describe purpose] |
| rails-activerecord | database | user data as defined in schema | [Describe purpose] |
| rails-sessions | auth | session cookies, CSRF tokens | [Describe purpose] |
| redis | database | cached data, session data | [Describe purpose] |
| Redis | database | session data, cache data | [Describe purpose] |
| sidekiq | other | job data, user data processed in background jobs | [Describe purpose] |
| ws (WebSocket) | other | real-time user data, connection metadata, IP address, WebSocket messages | [Describe purpose] |

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

*This API privacy documentation was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **@mastodon/mastodon** codebase. It should be reviewed by your engineering and legal teams to ensure accuracy and completeness. Fields marked with brackets require manual input.*
