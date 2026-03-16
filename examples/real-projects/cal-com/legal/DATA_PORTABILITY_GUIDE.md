# Data Portability Guide

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** calcom-monorepo
**Organization:** [Your Company Name]

---

This guide documents how to exercise the **right to data portability** under GDPR Article 20. Data portability allows data subjects to receive their personal data in a structured, commonly used, and machine-readable format, and to transmit that data to another controller without hindrance.

## Legal Basis

**GDPR Article 20 — Right to Data Portability:**

> 1. The data subject shall have the right to receive the personal data concerning him or her, which he or she has provided to a controller, in a structured, commonly used and machine-readable format and have the right to transmit those data to another controller without hindrance from the controller to which the personal data have been provided.
>
> 2. In exercising his or her right to data portability, the data subject shall have the right to have the personal data transmitted directly from one controller to another, where technically feasible.

### When Data Portability Applies

The right to data portability applies when:

- Processing is based on **consent** (Art. 6(1)(a)) or **contract** (Art. 6(1)(b))
- Processing is carried out by **automated means**
- The data was **provided by the data subject** (directly or through observation)

It does **not** apply to:

- Data processed under legitimate interest or legal obligation
- Inferred or derived data (e.g., analytics scores, risk assessments)
- Data that would adversely affect the rights of others

## How to Request Your Data

To request a copy of your personal data in a portable format:

1. **Email:** Send a request to [your-email@example.com]
2. **Subject line:** "Data Portability Request"
3. **Include:** Your name, account identifier (email or user ID), and the specific data you want exported
4. **Response time:** We will respond within **30 days** of receiving your request (GDPR Art. 12(3))
5. **Format:** Data will be provided in JSON or CSV format unless you request otherwise

If you prefer, you may request that we transmit your data directly to another controller. We will do so where technically feasible.

## Per-Service Export Instructions

The following services process personal data in this application. Each section provides specific export instructions and API endpoints for retrieving your data.

### Twilio SendGrid

**Service:** @sendgrid/mail
**Export Formats:** JSON, CSV
**Export URL:** https://app.sendgrid.com/settings/data_export
**API Endpoint:** `https://api.sendgrid.com/v3/messages`
**Estimated Time:** API responses immediate; bulk export within 24 hours

**Steps:**

1. Log in to SendGrid Dashboard
2. Navigate to Settings > Data Export
3. Use the SendGrid API to retrieve email activity data

### Google LLC

**Service:** Google Analytics
**Export Formats:** CSV, JSON, Google Sheets
**Export URL:** https://analytics.google.com/ > Admin > Data Export
**API Endpoint:** `https://analyticsdata.googleapis.com/v1beta/{property}:runReport`
**Estimated Time:** Available immediately via API; bulk exports within 24 hours

**Steps:**

1. Navigate to Google Analytics Admin panel
2. Select the property for your application
3. Go to Admin > Data Export to download reports
4. Use the Google Analytics Data API for programmatic export

### First-party (NextAuth.js)

**Service:** next-auth
**Export Formats:** JSON, CSV, database-native
**Export URL:** N/A (data stored in your database)
**API Endpoint:** `N/A (query your database directly)`
**Estimated Time:** Depends on your implementation

**Steps:**

1. NextAuth.js stores session data in your own database
2. Query the accounts, sessions, and users tables directly
3. Build a DSAR export endpoint in your application to serve user data

### PostHog Inc

**Service:** posthog
**Export Formats:** JSON, CSV
**Export URL:** https://app.posthog.com/project/settings > Data Management
**API Endpoint:** `https://app.posthog.com/api/projects/{project_id}/events`
**Estimated Time:** API responses immediate; bulk exports within 1 hour

**Steps:**

1. Log in to PostHog dashboard
2. Navigate to Data Management > Exports
3. Create a data export for the desired date range
4. Use the PostHog API /api/projects/{id}/events for programmatic access

### Stripe Inc

**Service:** stripe
**Export Formats:** JSON, CSV
**Export URL:** https://dashboard.stripe.com/settings/data
**API Endpoint:** `https://api.stripe.com/v1/customers/{id}`
**Estimated Time:** API responses immediate; full export within 48 hours

**Steps:**

1. Log in to Stripe Dashboard
2. Navigate to Settings > Data & Privacy
3. Use the Stripe API to export customer and payment data

## Supported Export Formats

Per GDPR Article 20, data must be provided in a **structured, commonly used, and machine-readable format**. We support:

| Format | Description | Machine-Readable | Interoperable |
|--------|-------------|------------------|---------------|
| JSON | JavaScript Object Notation | Yes | Yes |
| CSV | Comma-Separated Values | Yes | Yes |
| XML | Extensible Markup Language | Yes | Yes |

All exports include metadata headers (export date, data subject ID, scope) to facilitate import into other systems.

## Implementation Checklist

The following checklist ensures your data portability implementation meets GDPR requirements:

- [ ] Data export API endpoint is implemented and accessible
- [ ] Export includes all personal data provided by the data subject
- [ ] Export format is structured, commonly used, and machine-readable
- [ ] Direct transmission to another controller is supported where feasible
- [ ] Portability requests are tracked and responded to within 30 days
- [ ] Authentication verifies the identity of the requesting data subject
- [ ] Export excludes third-party personal data (to protect others' rights)
- [ ] Sub-processor data is included or referenced with retrieval instructions

## Contact

For data portability requests or questions about your right to data portability, contact:

- **Email:** [your-email@example.com]

You also have the right to lodge a complaint with your local data protection supervisory authority if you believe your data portability rights have not been respected.

---

*This data portability guide was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **calcom-monorepo** codebase. It should be reviewed by your legal and engineering teams to ensure completeness and accuracy. Export instructions may change as third-party services update their APIs and dashboards.*