# Data Flow Diagram

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** calcom-monorepo

**Company:** [Your Company Name]

## Related Documents

- Data Flow Map (`DATA_FLOW_MAP.md`)
- Privacy Policy (`PRIVACY_POLICY.md`)

---

> This document provides a visual representation of how personal data flows through the application. The diagram below is rendered using [Mermaid](https://mermaid.js.org/) and can be viewed directly on GitHub, GitLab, or any Mermaid-compatible renderer.

## Visual Data Flow

```mermaid
graph LR
  User[User] -->|contact information, email addresses, names| HubSpot[HubSpot]
  User[User] -->|email addresses, email content| SendGrid[SendGrid]
  User[User] -->|error data, stack traces, user context| Sentry[Sentry]
  User[User] -->|cached data, session data| Upstash[Upstash]
  User[User] -->|page views, user behavior, device information| Google_Analytics[Google Analytics]
  User[User] -->|page views, user behavior, custom events| Google_Tag_Manager[Google Tag Manager]
  User[User] -->|OAuth tokens, Google profile data, email| google_auth_library[google-auth-library]
  User[User] -->|user data via Google APIs, calendar data, email data| googleapis[googleapis]
  User[User] -->|user profiles, email, name| Intercom[Intercom]
  User[User] -->|cached data, session data| ioredis[ioredis]
  User[User] -->|email, name, profile picture| NextAuth[NextAuth]
  User[User] -->|email addresses, email content| nodemailer[nodemailer]
  User[User] -->|email, name, OAuth tokens| passport[passport]
  User[User] -->|page views, referrer data, device information| Plausible_Analytics[Plausible Analytics]
  User[User] -->|application data, user records| PostgreSQL[PostgreSQL]
  User[User] -->|application data, user records| PostgreSQL__env_[PostgreSQL (env)]
  User[User] -->|user behavior, session recordings, feature flag usage| PostHog[PostHog]
  User[User] -->|user data as defined in schema| Prisma[Prisma]
  User[User] -->|session data, cache data| Redis[Redis]
  User[User] -->|session data, cache data| Redis__env_[Redis (env)]
  User[User] -->|payment information, billing address, email| Stripe[Stripe]
  User[User] -->|phone numbers, SMS message content, voice call metadata| Twilio[Twilio]
  User[User] -->|push subscription endpoints, device tokens, notification content| web_push[web-push]
```

## Legend

| Symbol | Meaning |
|--------|---------|
| **User** | End user of the application |
| **Arrow labels** | Types of personal data transmitted |
| **Service nodes** | Third-party or internal services processing data |

## Data Flow Details

### Collection Points

| Source | Data Collected | Mechanism |
|--------|---------------|-----------|
| Email subscription/contact forms | email addresses, email content | via @sendgrid/mail |
| User registration/login | OAuth tokens, Google profile data, email | via google-auth-library |
| User registration/login | email, name, profile picture, OAuth tokens, session data | via next-auth |
| Email subscription/contact forms | email addresses, email content | via nodemailer |
| User registration/login | email, name, OAuth tokens, session data | via passport |
| Payment checkout | payment information, billing address, email, transaction history | via stripe |
| API endpoint packages/trpc/server/routers/features/_router.ts | autoOptIn, color, eventTypeIds, feature, featureId, includeSystemRolesOnly, isAll, name, permissions, roleId, routingFormId, slug, surveyId, teamId, userId | via API |
| API endpoint packages/trpc/server/routers/viewer/eventTypes/_router.ts | autoOptIn, color, eventTypeIds, feature, featureId, includeSystemRolesOnly, isAll, name, permissions, roleId, routingFormId, slug, surveyId, teamId, userId | via API |
| API endpoint packages/trpc/server/routers/viewer/featureOptIn/_router.ts | autoOptIn, color, eventTypeIds, feature, featureId, includeSystemRolesOnly, isAll, name, permissions, roleId, routingFormId, slug, surveyId, teamId, userId | via API |
| API endpoint packages/trpc/server/routers/viewer/feedback/_router.ts | autoOptIn, color, eventTypeIds, feature, featureId, includeSystemRolesOnly, isAll, name, permissions, roleId, routingFormId, slug, surveyId, teamId, userId | via API |
| API endpoint packages/trpc/server/routers/viewer/insights/_router.ts | autoOptIn, color, eventTypeIds, feature, featureId, includeSystemRolesOnly, isAll, name, permissions, roleId, routingFormId, slug, surveyId, teamId, userId | via API |
| API endpoint packages/trpc/server/routers/viewer/pbac/_router.tsx | autoOptIn, color, eventTypeIds, feature, featureId, includeSystemRolesOnly, isAll, name, permissions, roleId, routingFormId, slug, surveyId, teamId, userId | via API |

### Third-Party Data Sharing

| Recipient | Category | Data Shared |
|-----------|----------|-------------|
| @hubspot/api-client | Third-Party Service | contact information, email addresses, names, phone numbers, company data, deal information, engagement history |
| @sendgrid/mail | Email Service | email addresses, email content |
| @sentry/nextjs | Error Monitoring | error data, stack traces, user context, device information, IP address, performance profiles |
| Google Analytics | Analytics | page views, user behavior, device information, IP address, location data |
| Google Tag Manager | Analytics | page views, user behavior, custom events, device information, third-party tag data |
| googleapis | Third-Party Service | user data via Google APIs, calendar data, email data, profile information |
| intercom | Third-Party Service | user profiles, email, name, conversations, user behavior, company data |
| nodemailer | Email Service | email addresses, email content |
| Plausible Analytics | Analytics | page views, referrer data, device information |
| posthog | Analytics | user behavior, session recordings, feature flag usage, device information |
| stripe | Payment Processing | payment information, billing address, email, transaction history |
| twilio | Third-Party Service | phone numbers, SMS message content, voice call metadata, call recordings |
| web-push | Third-Party Service | push subscription endpoints, device tokens, notification content |

## Service Inventory

| Service | Category | Data Processed |
|---------|----------|---------------|
| HubSpot | other | contact information, email addresses, names, phone numbers, company data, deal information, engagement history |
| googleapis | other | user data via Google APIs, calendar data, email data, profile information |
| Intercom | other | user profiles, email, name, conversations, user behavior, company data |
| Twilio | other | phone numbers, SMS message content, voice call metadata, call recordings |
| web-push | other | push subscription endpoints, device tokens, notification content |
| SendGrid | email | email addresses, email content |
| nodemailer | email | email addresses, email content |
| Sentry | monitoring | error data, stack traces, user context, device information, IP address, performance profiles |
| Upstash | database | cached data, session data |
| ioredis | database | cached data, session data |
| PostgreSQL | database | application data, user records |
| PostgreSQL (env) | database | application data, user records |
| Prisma | database | user data as defined in schema |
| Redis | database | session data, cache data |
| Redis (env) | database | session data, cache data |
| Google Analytics | analytics | page views, user behavior, device information, IP address, location data |
| Google Tag Manager | analytics | page views, user behavior, custom events, device information, third-party tag data |
| Plausible Analytics | analytics | page views, referrer data, device information |
| PostHog | analytics | user behavior, session recordings, feature flag usage, device information |
| google-auth-library | auth | OAuth tokens, Google profile data, email |
| NextAuth | auth | email, name, profile picture, OAuth tokens, session data |
| passport | auth | email, name, OAuth tokens, session data |
| Stripe | payment | payment information, billing address, email, transaction history |

---

## How to Use This Diagram

1. **GitHub/GitLab:** The Mermaid diagram renders automatically in markdown preview
2. **VS Code:** Install the "Markdown Preview Mermaid Support" extension
3. **Export:** Use [Mermaid Live Editor](https://mermaid.live/) to export as SVG or PNG
4. **CI/CD:** Use `@mermaid-js/mermaid-cli` to generate images in your pipeline

For questions about this data flow diagram, contact [your-email@example.com].

---

*This data flow diagram was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Review and verify all data flows for accuracy. This document does not constitute legal advice.*