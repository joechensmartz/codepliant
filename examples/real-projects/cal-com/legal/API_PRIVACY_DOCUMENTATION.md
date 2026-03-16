# API Privacy Documentation

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Organization:** [Your Company Name]

**Project:** calcom-monorepo

This document maps API endpoints to the types of personal data they process, providing transparency for privacy compliance. Each endpoint is linked to the relevant section of the Privacy Policy.

For questions about API data handling, contact [your-email@example.com].

## Overview

20 API endpoint(s) accepting user data via MUTATION, QUERY requests. Data fields collected: autoOptIn, color, eventTypeIds, feature, featureId, includeSystemRolesOnly, isAll, name, permissions, roleId, routingFormId, slug, surveyId, teamId, userId.

Total API endpoints detected: **37**

| Metric | Count |
|--------|-------|
| Endpoints accepting user data | 20 |
| Write endpoints (POST/PUT/PATCH/DELETE) | 33 |
| Read-only endpoints (GET/QUERY) | 4 |

## Endpoint Summary

| Endpoint | Method | Data Fields | Privacy Category |
|----------|--------|-------------|-----------------|
| `/api/api-keys/_post` | POST | — | — |
| `/api/attendees/_post` | POST | bookingId, email, name, timeZone | Other, Contact, Identity |
| `/api/availabilities/_post` | POST | — | — |
| `/api/booking-references/_post` | POST | bookingId | Other |
| `/api/bookings/_post` | POST | userId, eventTypeId | Other |
| `/api/credential-sync/_patch` | POST | — | — |
| `/api/credential-sync/_post` | POST | — | — |
| `/api/custom-inputs/_post` | POST | options | Other |
| `/api/custom-inputs/[id]/_patch` | POST | — | — |
| `/api/destination-calendars/_post` | POST | userId, eventTypeId | Other |
| `/api/event-types/_post` | POST | userId, teamId | Other |
| `/api/invites/_post` | POST | teamId | Other |
| `/api/memberships/_post` | POST | teamId | Other |
| `/api/memberships/[id]/_patch` | POST | role | Other |
| `/api/schedules/_post` | POST | userId | Other |
| `/api/schedules/[id]/_patch` | POST | userId | Other |
| `/api/selected-calendars/_post` | POST | — | — |
| `/api/selected-calendars/[id]/_patch` | POST | — | — |
| `/api/teams/_post` | POST | ownerId | Other |
| `/api/users/_post` | POST | — | — |
| `/api/users/[userId]/_patch` | POST | role, hideBranding, defaultScheduleId, avatarUrl, email | Other, Contact |
| `/api/webhooks/_post` | POST | — | — |
| `/api/webhooks/[id]/_patch` | POST | — | — |
| `/api/compliance/download` | GET | — | — |
| `/api/csrf` | GET | — | — |
| `/api/ip` | GET | — | — |
| `/api/support/conversation` | POST | — | — |
| `/api/video/recording` | GET | — | — |
| `/api/get-inbound-dynamic-variables` | POST | llm_id, from_number, to_number | Other |
| `/api/book/event` | POST | eventTypeId | Other |
| `/api/book/instant-event` | POST | creationSource | Other |
| `/api/book/recurring-event` | POST | — | — |
| `/api/router` | POST | — | — |
| `/api/twilio/webhook` | POST | MessageStatus, To, SmsSid | Other |
| `/api/getToken` | POST | calcomUserId, appSlug | Other |
| `/api/managed-user` | POST | data | Other |
| `/api/oauth2-user` | POST | email, authorizationCode | Contact, Other |

## Privacy Policy Mapping

The following table maps data categories collected through the API to the corresponding sections in your Privacy Policy.

| Data Category | Privacy Policy Section | Legal Basis (GDPR) | Retention |
|--------------|----------------------|-------------------|-----------|
| Other | [Map to relevant section] | [Determine legal basis] | [Define retention period] |
| Contact | Personal Information We Collect | Contractual necessity (Art. 6(1)(b)) | Duration of account + [X] days |
| Identity | Personal Information We Collect | Contractual necessity (Art. 6(1)(b)) | Duration of account + [X] days |
| Personal Identity Data | Personal Information We Collect | Contractual necessity (Art. 6(1)(b)) | Duration of account + [X] days |
| Financial Data | [Map to relevant section] | [Determine legal basis] | [Define retention period] |
| Usage & Behavioral Data | Automatically Collected Information | Legitimate interest (Art. 6(1)(f)) | [X] days |
| Communication Data | Communications | Contractual necessity (Art. 6(1)(b)) | [X] days |
| Technical & Diagnostic Data | Automatically Collected Information | Legitimate interest (Art. 6(1)(f)) | [X] days |
| Stored User Data | [Map to relevant section] | [Determine legal basis] | [Define retention period] |
| API Data Collection | Information You Provide via API | Contractual necessity (Art. 6(1)(b)) | Duration of account |

## Detailed Endpoint Documentation

### `POST /api/api-keys/_post`

| Property | Value |
|----------|-------|
| **File** | `apps/api/v1/pages/api/api-keys/_post.ts` |
| **Method** | POST |
| **Route** | `/api/api-keys/_post` |
| **Data fields** | None detected |

### `POST /api/attendees/_post`

| Property | Value |
|----------|-------|
| **File** | `apps/api/v1/pages/api/attendees/_post.ts` |
| **Method** | POST |
| **Route** | `/api/attendees/_post` |
| **Data fields** | bookingId, email, name, timeZone |
| **Privacy categories** | Other, Contact, Identity |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `bookingId` | Other | [YES/NO] | [Describe purpose] |
| `email` | Contact | [YES/NO] | [Describe purpose] |
| `name` | Identity | [YES/NO] | [Describe purpose] |
| `timeZone` | Other | [YES/NO] | [Describe purpose] |

### `POST /api/availabilities/_post`

| Property | Value |
|----------|-------|
| **File** | `apps/api/v1/pages/api/availabilities/_post.ts` |
| **Method** | POST |
| **Route** | `/api/availabilities/_post` |
| **Data fields** | None detected |

### `POST /api/booking-references/_post`

| Property | Value |
|----------|-------|
| **File** | `apps/api/v1/pages/api/booking-references/_post.ts` |
| **Method** | POST |
| **Route** | `/api/booking-references/_post` |
| **Data fields** | bookingId |
| **Privacy categories** | Other |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `bookingId` | Other | [YES/NO] | [Describe purpose] |

### `POST /api/bookings/_post`

| Property | Value |
|----------|-------|
| **File** | `apps/api/v1/pages/api/bookings/_post.ts` |
| **Method** | POST |
| **Route** | `/api/bookings/_post` |
| **Data fields** | userId, eventTypeId |
| **Privacy categories** | Other |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `userId` | Other | [YES/NO] | [Describe purpose] |
| `eventTypeId` | Other | [YES/NO] | [Describe purpose] |

### `POST /api/credential-sync/_patch`

| Property | Value |
|----------|-------|
| **File** | `apps/api/v1/pages/api/credential-sync/_patch.ts` |
| **Method** | POST |
| **Route** | `/api/credential-sync/_patch` |
| **Data fields** | None detected |

### `POST /api/credential-sync/_post`

| Property | Value |
|----------|-------|
| **File** | `apps/api/v1/pages/api/credential-sync/_post.ts` |
| **Method** | POST |
| **Route** | `/api/credential-sync/_post` |
| **Data fields** | None detected |

### `POST /api/custom-inputs/_post`

| Property | Value |
|----------|-------|
| **File** | `apps/api/v1/pages/api/custom-inputs/_post.ts` |
| **Method** | POST |
| **Route** | `/api/custom-inputs/_post` |
| **Data fields** | options |
| **Privacy categories** | Other |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `options` | Other | [YES/NO] | [Describe purpose] |

### `POST /api/custom-inputs/[id]/_patch`

| Property | Value |
|----------|-------|
| **File** | `apps/api/v1/pages/api/custom-inputs/[id]/_patch.ts` |
| **Method** | POST |
| **Route** | `/api/custom-inputs/[id]/_patch` |
| **Data fields** | None detected |

### `POST /api/destination-calendars/_post`

| Property | Value |
|----------|-------|
| **File** | `apps/api/v1/pages/api/destination-calendars/_post.ts` |
| **Method** | POST |
| **Route** | `/api/destination-calendars/_post` |
| **Data fields** | userId, eventTypeId |
| **Privacy categories** | Other |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `userId` | Other | [YES/NO] | [Describe purpose] |
| `eventTypeId` | Other | [YES/NO] | [Describe purpose] |

### `POST /api/event-types/_post`

| Property | Value |
|----------|-------|
| **File** | `apps/api/v1/pages/api/event-types/_post.ts` |
| **Method** | POST |
| **Route** | `/api/event-types/_post` |
| **Data fields** | userId, teamId |
| **Privacy categories** | Other |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `userId` | Other | [YES/NO] | [Describe purpose] |
| `teamId` | Other | [YES/NO] | [Describe purpose] |

### `POST /api/invites/_post`

| Property | Value |
|----------|-------|
| **File** | `apps/api/v1/pages/api/invites/_post.ts` |
| **Method** | POST |
| **Route** | `/api/invites/_post` |
| **Data fields** | teamId |
| **Privacy categories** | Other |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `teamId` | Other | [YES/NO] | [Describe purpose] |

### `POST /api/memberships/_post`

| Property | Value |
|----------|-------|
| **File** | `apps/api/v1/pages/api/memberships/_post.ts` |
| **Method** | POST |
| **Route** | `/api/memberships/_post` |
| **Data fields** | teamId |
| **Privacy categories** | Other |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `teamId` | Other | [YES/NO] | [Describe purpose] |

### `POST /api/memberships/[id]/_patch`

| Property | Value |
|----------|-------|
| **File** | `apps/api/v1/pages/api/memberships/[id]/_patch.ts` |
| **Method** | POST |
| **Route** | `/api/memberships/[id]/_patch` |
| **Data fields** | role |
| **Privacy categories** | Other |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `role` | Other | [YES/NO] | [Describe purpose] |

### `POST /api/schedules/_post`

| Property | Value |
|----------|-------|
| **File** | `apps/api/v1/pages/api/schedules/_post.ts` |
| **Method** | POST |
| **Route** | `/api/schedules/_post` |
| **Data fields** | userId |
| **Privacy categories** | Other |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `userId` | Other | [YES/NO] | [Describe purpose] |

### `POST /api/schedules/[id]/_patch`

| Property | Value |
|----------|-------|
| **File** | `apps/api/v1/pages/api/schedules/[id]/_patch.ts` |
| **Method** | POST |
| **Route** | `/api/schedules/[id]/_patch` |
| **Data fields** | userId |
| **Privacy categories** | Other |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `userId` | Other | [YES/NO] | [Describe purpose] |

### `POST /api/selected-calendars/_post`

| Property | Value |
|----------|-------|
| **File** | `apps/api/v1/pages/api/selected-calendars/_post.ts` |
| **Method** | POST |
| **Route** | `/api/selected-calendars/_post` |
| **Data fields** | None detected |

### `POST /api/selected-calendars/[id]/_patch`

| Property | Value |
|----------|-------|
| **File** | `apps/api/v1/pages/api/selected-calendars/[id]/_patch.ts` |
| **Method** | POST |
| **Route** | `/api/selected-calendars/[id]/_patch` |
| **Data fields** | None detected |

### `POST /api/teams/_post`

| Property | Value |
|----------|-------|
| **File** | `apps/api/v1/pages/api/teams/_post.ts` |
| **Method** | POST |
| **Route** | `/api/teams/_post` |
| **Data fields** | ownerId |
| **Privacy categories** | Other |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `ownerId` | Other | [YES/NO] | [Describe purpose] |

### `POST /api/users/_post`

| Property | Value |
|----------|-------|
| **File** | `apps/api/v1/pages/api/users/_post.ts` |
| **Method** | POST |
| **Route** | `/api/users/_post` |
| **Data fields** | None detected |

### `POST /api/users/[userId]/_patch`

| Property | Value |
|----------|-------|
| **File** | `apps/api/v1/pages/api/users/[userId]/_patch.ts` |
| **Method** | POST |
| **Route** | `/api/users/[userId]/_patch` |
| **Data fields** | role, hideBranding, defaultScheduleId, avatarUrl, email |
| **Privacy categories** | Other, Contact |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `role` | Other | [YES/NO] | [Describe purpose] |
| `hideBranding` | Other | [YES/NO] | [Describe purpose] |
| `defaultScheduleId` | Other | [YES/NO] | [Describe purpose] |
| `avatarUrl` | Other | [YES/NO] | [Describe purpose] |
| `email` | Contact | [YES/NO] | [Describe purpose] |

### `POST /api/webhooks/_post`

| Property | Value |
|----------|-------|
| **File** | `apps/api/v1/pages/api/webhooks/_post.ts` |
| **Method** | POST |
| **Route** | `/api/webhooks/_post` |
| **Data fields** | None detected |

### `POST /api/webhooks/[id]/_patch`

| Property | Value |
|----------|-------|
| **File** | `apps/api/v1/pages/api/webhooks/[id]/_patch.ts` |
| **Method** | POST |
| **Route** | `/api/webhooks/[id]/_patch` |
| **Data fields** | None detected |

### `GET /api/compliance/download`

| Property | Value |
|----------|-------|
| **File** | `apps/web/app/api/compliance/download/route.ts` |
| **Method** | GET |
| **Route** | `/api/compliance/download` |
| **Data fields** | None detected |

### `GET /api/csrf`

| Property | Value |
|----------|-------|
| **File** | `apps/web/app/api/csrf/route.ts` |
| **Method** | GET |
| **Route** | `/api/csrf` |
| **Data fields** | None detected |

### `GET /api/ip`

| Property | Value |
|----------|-------|
| **File** | `apps/web/app/api/ip/route.ts` |
| **Method** | GET |
| **Route** | `/api/ip` |
| **Data fields** | None detected |

### `POST /api/support/conversation`

| Property | Value |
|----------|-------|
| **File** | `apps/web/app/api/support/conversation/route.ts` |
| **Method** | POST |
| **Route** | `/api/support/conversation` |
| **Data fields** | None detected |

### `GET /api/video/recording`

| Property | Value |
|----------|-------|
| **File** | `apps/web/app/api/video/recording/route.ts` |
| **Method** | GET |
| **Route** | `/api/video/recording` |
| **Data fields** | None detected |

### `POST /api/get-inbound-dynamic-variables`

| Property | Value |
|----------|-------|
| **File** | `apps/web/pages/api/get-inbound-dynamic-variables.ts` |
| **Method** | POST |
| **Route** | `/api/get-inbound-dynamic-variables` |
| **Data fields** | llm_id, from_number, to_number |
| **Privacy categories** | Other |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `llm_id` | Other | [YES/NO] | [Describe purpose] |
| `from_number` | Other | [YES/NO] | [Describe purpose] |
| `to_number` | Other | [YES/NO] | [Describe purpose] |

### `POST /api/book/event`

| Property | Value |
|----------|-------|
| **File** | `apps/web/pages/api/book/event.ts` |
| **Method** | POST |
| **Route** | `/api/book/event` |
| **Data fields** | eventTypeId |
| **Privacy categories** | Other |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `eventTypeId` | Other | [YES/NO] | [Describe purpose] |

### `POST /api/book/instant-event`

| Property | Value |
|----------|-------|
| **File** | `apps/web/pages/api/book/instant-event.ts` |
| **Method** | POST |
| **Route** | `/api/book/instant-event` |
| **Data fields** | creationSource |
| **Privacy categories** | Other |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `creationSource` | Other | [YES/NO] | [Describe purpose] |

### `POST /api/book/recurring-event`

| Property | Value |
|----------|-------|
| **File** | `apps/web/pages/api/book/recurring-event.ts` |
| **Method** | POST |
| **Route** | `/api/book/recurring-event` |
| **Data fields** | None detected |

### `POST /api/router`

| Property | Value |
|----------|-------|
| **File** | `apps/web/pages/api/router/index.ts` |
| **Method** | POST |
| **Route** | `/api/router` |
| **Data fields** | None detected |

### `POST /api/twilio/webhook`

| Property | Value |
|----------|-------|
| **File** | `apps/web/pages/api/twilio/webhook.ts` |
| **Method** | POST |
| **Route** | `/api/twilio/webhook` |
| **Data fields** | MessageStatus, To, SmsSid |
| **Privacy categories** | Other |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `MessageStatus` | Other | [YES/NO] | [Describe purpose] |
| `To` | Other | [YES/NO] | [Describe purpose] |
| `SmsSid` | Other | [YES/NO] | [Describe purpose] |

### `POST /api/getToken`

| Property | Value |
|----------|-------|
| **File** | `example-apps/credential-sync/pages/api/getToken.ts` |
| **Method** | POST |
| **Route** | `/api/getToken` |
| **Data fields** | calcomUserId, appSlug |
| **Privacy categories** | Other |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `calcomUserId` | Other | [YES/NO] | [Describe purpose] |
| `appSlug` | Other | [YES/NO] | [Describe purpose] |

### `POST /api/managed-user`

| Property | Value |
|----------|-------|
| **File** | `packages/platform/examples/base/src/pages/api/managed-user.ts` |
| **Method** | POST |
| **Route** | `/api/managed-user` |
| **Data fields** | data |
| **Privacy categories** | Other |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `data` | Other | [YES/NO] | [Describe purpose] |

### `POST /api/oauth2-user`

| Property | Value |
|----------|-------|
| **File** | `packages/platform/examples/base/src/pages/api/oauth2-user.ts` |
| **Method** | POST |
| **Route** | `/api/oauth2-user` |
| **Data fields** | email, authorizationCode |
| **Privacy categories** | Contact, Other |

**Data fields detail:**

| Field | Category | Required | Purpose |
|-------|----------|----------|---------|
| `email` | Contact | [YES/NO] | [Describe purpose] |
| `authorizationCode` | Other | [YES/NO] | [Describe purpose] |

## API Data Flow to Third-Party Services

The following third-party services may receive data submitted through the API.

| Service | Category | Data Shared | Purpose |
|---------|----------|-------------|---------|
| @hubspot/api-client | other | contact information, email addresses, names, phone numbers, company data, deal information, engagement history | [Describe purpose] |
| @sendgrid/mail | email | email addresses, email content | [Describe purpose] |
| @sentry/nextjs | monitoring | error data, stack traces, user context, device information, IP address, performance profiles | [Describe purpose] |
| @upstash/redis | database | cached data, session data | [Describe purpose] |
| Google Analytics | analytics | page views, user behavior, device information, IP address, location data | [Describe purpose] |
| Google Tag Manager | analytics | page views, user behavior, custom events, device information, third-party tag data | [Describe purpose] |
| google-auth-library | auth | OAuth tokens, Google profile data, email | [Describe purpose] |
| googleapis | other | user data via Google APIs, calendar data, email data, profile information | [Describe purpose] |
| intercom | other | user profiles, email, name, conversations, user behavior, company data | [Describe purpose] |
| ioredis | database | cached data, session data | [Describe purpose] |
| next-auth | auth | email, name, profile picture, OAuth tokens, session data | [Describe purpose] |
| nodemailer | email | email addresses, email content | [Describe purpose] |
| passport | auth | email, name, OAuth tokens, session data | [Describe purpose] |
| Plausible Analytics | analytics | page views, referrer data, device information | [Describe purpose] |
| PostgreSQL | database | application data, user records | [Describe purpose] |
| PostgreSQL (env) | database | application data, user records | [Describe purpose] |
| posthog | analytics | user behavior, session recordings, feature flag usage, device information | [Describe purpose] |
| prisma | database | user data as defined in schema | [Describe purpose] |
| Redis | database | session data, cache data | [Describe purpose] |
| Redis (env) | database | session data, cache data | [Describe purpose] |
| stripe | payment | payment information, billing address, email, transaction history | [Describe purpose] |
| twilio | other | phone numbers, SMS message content, voice call metadata, call recordings | [Describe purpose] |
| web-push | other | push subscription endpoints, device tokens, notification content | [Describe purpose] |

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

*This API privacy documentation was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **calcom-monorepo** codebase. It should be reviewed by your engineering and legal teams to ensure accuracy and completeness. Fields marked with brackets require manual input.*
