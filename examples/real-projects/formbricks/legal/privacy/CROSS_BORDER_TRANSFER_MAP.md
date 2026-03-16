# Cross-Border Data Transfer Map

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Organisation:** [Your Company Name]
**Data Exporter Location:** [Your Location]
**Project:** formbricks
**Generated:** 2026-03-16

---

> This document maps all international data transfers identified through code analysis. It identifies the destination country, service provider, data types transferred, and applicable legal safeguards for each transfer. Required under GDPR Chapter V (Articles 44-49) for EU data exporters.

## Transfer Flow Diagram

```mermaid
graph LR
  A["[Your Company Name]<br/>[Your Location]"]
  C0["United States<br/>@aws-sdk/client-s3<br/>@sentry/nextjs<br/>googleapis<br/>posthog<br/>stripe"]
  A -->|"DPF/Adequacy"| C0
  C1["Unknown<br/>ioredis<br/>nodemailer<br/>prisma<br/>redis"]
  A -->|"SCCs"| C1
  C2["Self-hosted<br/>next-auth"]
  A -->|"DPF/Adequacy"| C2
```

## Transfer Summary by Country

| Country | Services | Data Types | Safeguard | Adequacy Decision |
|---------|----------|-----------|-----------|-------------------|
| United States (US) | @aws-sdk/client-s3, @sentry/nextjs, googleapis, posthog, stripe | uploaded files, file metadata, error data, stack traces | EU-US DPF / SCCs | Yes |
| Unknown (??) | ioredis, nodemailer, prisma, redis | cached data, session data, email addresses, email content | [Verify with provider] | No |
| Self-hosted (—) | next-auth | email, name, profile picture, OAuth tokens | No third-party transfer | Yes |

## Detailed Transfer Register

| # | Service | Category | Country | Data Types | Safeguard | DPF Certified | DPA in Place |
|---|---------|----------|---------|-----------|-----------|---------------|-------------|
| 1 | @aws-sdk/client-s3 | storage | United States | uploaded files, file metadata | EU-US DPF / SCCs | [Verify](https://www.dataprivacyframework.gov/list) | [ ] |
| 2 | @sentry/nextjs | monitoring | United States | error data, stack traces, user context | SCCs | N/A | [ ] |
| 3 | googleapis | other | United States | user data via Google APIs, calendar data, email data | EU-US DPF / SCCs | [Verify](https://www.dataprivacyframework.gov/list) | [ ] |
| 4 | ioredis | database | Unknown | cached data, session data | [Verify with provider] | N/A | [ ] |
| 5 | next-auth | auth | Self-hosted | email, name, profile picture | No third-party transfer | [Verify](https://www.dataprivacyframework.gov/list) | [ ] |
| 6 | nodemailer | email | Unknown | email addresses, email content | [Verify with provider] | N/A | [ ] |
| 7 | posthog | analytics | United States | user behavior, session recordings, feature flag usage | SCCs | N/A | [ ] |
| 8 | prisma | database | Unknown | user data as defined in schema | [Verify with provider] | N/A | [ ] |
| 9 | redis | database | Unknown | cached data, session data | [Verify with provider] | N/A | [ ] |
| 10 | stripe | payment | United States | payment information, billing address, email | EU-US DPF / SCCs | [Verify](https://www.dataprivacyframework.gov/list) | [ ] |

## Services Requiring Additional Safeguards

The following services transfer data to countries without an EU adequacy decision. Additional safeguards (SCCs + supplementary measures) are required per the Schrems II ruling.

### @sentry/nextjs

- **Destination:** United States
- **Safeguard:** SCCs
- **Data:** error data, stack traces, user context, device information, IP address
- **Required actions:**
  - [ ] Execute Standard Contractual Clauses (Module 2: Controller to Processor)
  - [ ] Complete Annex I (List of parties)
  - [ ] Complete Annex II (Technical and organisational measures)
  - [ ] Verify provider's DPF certification status
  - [ ] Implement supplementary encryption measures if needed

### ioredis

- **Destination:** Unknown
- **Safeguard:** [Verify with provider]
- **Data:** cached data, session data
- **Required actions:**
  - [ ] Execute Standard Contractual Clauses (Module 2: Controller to Processor)
  - [ ] Complete Annex I (List of parties)
  - [ ] Complete Annex II (Technical and organisational measures)
  - [ ] Verify provider's DPF certification status
  - [ ] Implement supplementary encryption measures if needed

### nodemailer

- **Destination:** Unknown
- **Safeguard:** [Verify with provider]
- **Data:** email addresses, email content
- **Required actions:**
  - [ ] Execute Standard Contractual Clauses (Module 2: Controller to Processor)
  - [ ] Complete Annex I (List of parties)
  - [ ] Complete Annex II (Technical and organisational measures)
  - [ ] Verify provider's DPF certification status
  - [ ] Implement supplementary encryption measures if needed

### posthog

- **Destination:** United States
- **Safeguard:** SCCs
- **Data:** user behavior, session recordings, feature flag usage, device information
- **Required actions:**
  - [ ] Execute Standard Contractual Clauses (Module 2: Controller to Processor)
  - [ ] Complete Annex I (List of parties)
  - [ ] Complete Annex II (Technical and organisational measures)
  - [ ] Verify provider's DPF certification status
  - [ ] Implement supplementary encryption measures if needed

### prisma

- **Destination:** Unknown
- **Safeguard:** [Verify with provider]
- **Data:** user data as defined in schema
- **Required actions:**
  - [ ] Execute Standard Contractual Clauses (Module 2: Controller to Processor)
  - [ ] Complete Annex I (List of parties)
  - [ ] Complete Annex II (Technical and organisational measures)
  - [ ] Verify provider's DPF certification status
  - [ ] Implement supplementary encryption measures if needed

### redis

- **Destination:** Unknown
- **Safeguard:** [Verify with provider]
- **Data:** cached data, session data
- **Required actions:**
  - [ ] Execute Standard Contractual Clauses (Module 2: Controller to Processor)
  - [ ] Complete Annex I (List of parties)
  - [ ] Complete Annex II (Technical and organisational measures)
  - [ ] Verify provider's DPF certification status
  - [ ] Implement supplementary encryption measures if needed

## Data Type × Service Matrix

| Data Type | @aws-sdk/client-s3 | @sentry/nextjs | googleapis | ioredis | next-auth | nodemailer | posthog | prisma | redis | stripe |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| uploaded files | ● | — | — | — | — | — | — | — | — | — |
| file metadata | ● | — | — | — | — | — | — | — | — | — |
| error data | — | ● | — | — | — | — | — | — | — | — |
| stack traces | — | ● | — | — | — | — | — | — | — | — |
| user context | — | ● | — | — | — | — | — | — | — | — |
| device information | — | ● | — | — | — | — | ● | — | — | — |
| IP address | — | ● | — | — | — | — | — | — | — | — |
| user data via Google APIs | — | — | ● | — | — | — | — | — | — | — |
| calendar data | — | — | ● | — | — | — | — | — | — | — |
| email data | — | — | ● | — | — | — | — | — | — | — |
| profile information | — | — | ● | — | — | — | — | — | — | — |
| cached data | — | — | — | ● | — | — | — | — | ● | — |
| session data | — | — | — | ● | ● | — | — | — | ● | — |
| email | — | — | — | — | ● | — | — | — | — | ● |
| name | — | — | — | — | ● | — | — | — | — | — |
| profile picture | — | — | — | — | ● | — | — | — | — | — |
| OAuth tokens | — | — | — | — | ● | — | — | — | — | — |
| email addresses | — | — | — | — | — | ● | — | — | — | — |
| email content | — | — | — | — | — | ● | — | — | — | — |
| user behavior | — | — | — | — | — | — | ● | — | — | — |
| session recordings | — | — | — | — | — | — | ● | — | — | — |
| feature flag usage | — | — | — | — | — | — | ● | — | — | — |
| user data as defined in schema | — | — | — | — | — | — | — | ● | — | — |
| payment information | — | — | — | — | — | — | — | — | — | ● |
| billing address | — | — | — | — | — | — | — | — | — | ● |
| transaction history | — | — | — | — | — | — | — | — | — | ● |

## Transfer Compliance Checklist

- [ ] All transfers have a valid legal basis under GDPR Chapter V
- [ ] SCCs (2021 version) executed with all non-DPF-certified providers
- [ ] DPF certification verified for applicable US providers
- [ ] Transfer Impact Assessment completed for each non-adequate country
- [ ] Supplementary measures implemented where SCCs are relied upon
- [ ] Data Processing Agreements in place with all processors
- [ ] Record of Processing Activities updated with transfer details
- [ ] Privacy Policy discloses international transfers and safeguards
- [ ] DPO informed of all cross-border transfers

## Review Schedule

| Review | Frequency | Next Due |
|--------|-----------|----------|
| Full transfer map review | Annual | 2027-03-16 |
| DPF certification verification | Semi-annual | [Set date] |
| New service onboarding review | Per event | Ongoing |
| Regulatory change assessment | Quarterly | [Set date] |

**Contact:** [your-email@example.com]

---

*This Cross-Border Transfer Map was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on code analysis. Service location and DPF certification status should be verified with each provider's current documentation. This document does not constitute legal advice.*
