# Cross-Border Data Transfer Map

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Organisation:** [Your Company Name]
**Data Exporter Location:** [Your Location]
**Project:** twenty
**Generated:** 2026-03-16

---

> This document maps all international data transfers identified through code analysis. It identifies the destination country, service provider, data types transferred, and applicable legal safeguards for each transfer. Required under GDPR Chapter V (Articles 44-49) for EU data exporters.

## Transfer Flow Diagram

```mermaid
graph LR
  A["[Your Company Name]<br/>[Your Location]"]
  C0["United States<br/>@ai-sdk/anthropic<br/>@ai-sdk/google<br/>@ai-sdk/openai<br/>@aws-sdk/client-s3<br/>@sentry/node<br/>@vercel/ai<br/>googleapis<br/>openai<br/>stripe"]
  A -->|"SCCs"| C0
  C1["Unknown<br/>drizzle<br/>ioredis<br/>nodemailer<br/>passport<br/>passport-google-oauth20<br/>passport-microsoft<br/>redis"]
  A -->|"SCCs"| C1
```

## Transfer Summary by Country

| Country | Services | Data Types | Safeguard | Adequacy Decision |
|---------|----------|-----------|-----------|-------------------|
| United States (US) | @ai-sdk/anthropic, @ai-sdk/google, @ai-sdk/openai, @aws-sdk/client-s3, @sentry/node, @vercel/ai, googleapis, openai, stripe | user prompts, conversation history, generated content, uploaded files | SCCs | No |
| Unknown (??) | drizzle, ioredis, nodemailer, passport, passport-google-oauth20, passport-microsoft, redis | user data as defined in schema, cached data, session data, email addresses | [Verify with provider] | No |

## Detailed Transfer Register

| # | Service | Category | Country | Data Types | Safeguard | DPF Certified | DPA in Place |
|---|---------|----------|---------|-----------|-----------|---------------|-------------|
| 1 | @ai-sdk/anthropic | ai | United States | user prompts, conversation history, generated content | SCCs | N/A | [ ] |
| 2 | @ai-sdk/google | ai | United States | user prompts, conversation history, generated content | EU-US DPF / SCCs | [Verify](https://www.dataprivacyframework.gov/list) | [ ] |
| 3 | @ai-sdk/openai | ai | United States | user prompts, conversation history, generated content | EU-US DPF / SCCs | [Verify](https://www.dataprivacyframework.gov/list) | [ ] |
| 4 | @aws-sdk/client-s3 | storage | United States | uploaded files, file metadata | EU-US DPF / SCCs | [Verify](https://www.dataprivacyframework.gov/list) | [ ] |
| 5 | @sentry/node | monitoring | United States | error data, stack traces, user context | SCCs | N/A | [ ] |
| 6 | @vercel/ai | ai | United States | user prompts, conversation history, generated content | SCCs | N/A | [ ] |
| 7 | drizzle | database | Unknown | user data as defined in schema | [Verify with provider] | N/A | [ ] |
| 8 | googleapis | other | United States | user data via Google APIs, calendar data, email data | EU-US DPF / SCCs | [Verify](https://www.dataprivacyframework.gov/list) | [ ] |
| 9 | ioredis | database | Unknown | cached data, session data | [Verify with provider] | N/A | [ ] |
| 10 | nodemailer | email | Unknown | email addresses, email content | [Verify with provider] | N/A | [ ] |
| 11 | openai | ai | United States | user prompts, conversation history, generated content | EU-US DPF / SCCs | [Verify](https://www.dataprivacyframework.gov/list) | [ ] |
| 12 | passport | auth | Unknown | email, name, OAuth tokens | [Verify with provider] | N/A | [ ] |
| 13 | passport-google-oauth20 | auth | Unknown | email, name, Google profile data | [Verify with provider] | N/A | [ ] |
| 14 | passport-microsoft | auth | Unknown | email, name, Microsoft profile data | [Verify with provider] | N/A | [ ] |
| 15 | redis | database | Unknown | cached data, session data | [Verify with provider] | N/A | [ ] |
| 16 | stripe | payment | United States | payment information, billing address, email | EU-US DPF / SCCs | [Verify](https://www.dataprivacyframework.gov/list) | [ ] |

## Services Requiring Additional Safeguards

The following services transfer data to countries without an EU adequacy decision. Additional safeguards (SCCs + supplementary measures) are required per the Schrems II ruling.

### @ai-sdk/anthropic

- **Destination:** United States
- **Safeguard:** SCCs
- **Data:** user prompts, conversation history, generated content
- **Required actions:**
  - [ ] Execute Standard Contractual Clauses (Module 2: Controller to Processor)
  - [ ] Complete Annex I (List of parties)
  - [ ] Complete Annex II (Technical and organisational measures)
  - [ ] Verify provider's DPF certification status
  - [ ] Implement supplementary encryption measures if needed

### @sentry/node

- **Destination:** United States
- **Safeguard:** SCCs
- **Data:** error data, stack traces, user context, device information, IP address, performance profiles
- **Required actions:**
  - [ ] Execute Standard Contractual Clauses (Module 2: Controller to Processor)
  - [ ] Complete Annex I (List of parties)
  - [ ] Complete Annex II (Technical and organisational measures)
  - [ ] Verify provider's DPF certification status
  - [ ] Implement supplementary encryption measures if needed

### @vercel/ai

- **Destination:** United States
- **Safeguard:** SCCs
- **Data:** user prompts, conversation history, generated content
- **Required actions:**
  - [ ] Execute Standard Contractual Clauses (Module 2: Controller to Processor)
  - [ ] Complete Annex I (List of parties)
  - [ ] Complete Annex II (Technical and organisational measures)
  - [ ] Verify provider's DPF certification status
  - [ ] Implement supplementary encryption measures if needed

### drizzle

- **Destination:** Unknown
- **Safeguard:** [Verify with provider]
- **Data:** user data as defined in schema
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

### passport

- **Destination:** Unknown
- **Safeguard:** [Verify with provider]
- **Data:** email, name, OAuth tokens, session data
- **Required actions:**
  - [ ] Execute Standard Contractual Clauses (Module 2: Controller to Processor)
  - [ ] Complete Annex I (List of parties)
  - [ ] Complete Annex II (Technical and organisational measures)
  - [ ] Verify provider's DPF certification status
  - [ ] Implement supplementary encryption measures if needed

### passport-google-oauth20

- **Destination:** Unknown
- **Safeguard:** [Verify with provider]
- **Data:** email, name, Google profile data, OAuth tokens
- **Required actions:**
  - [ ] Execute Standard Contractual Clauses (Module 2: Controller to Processor)
  - [ ] Complete Annex I (List of parties)
  - [ ] Complete Annex II (Technical and organisational measures)
  - [ ] Verify provider's DPF certification status
  - [ ] Implement supplementary encryption measures if needed

### passport-microsoft

- **Destination:** Unknown
- **Safeguard:** [Verify with provider]
- **Data:** email, name, Microsoft profile data, OAuth tokens
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

| Data Type | @ai-sdk/anthropic | @ai-sdk/google | @ai-sdk/openai | @aws-sdk/client-s3 | @sentry/node | @vercel/ai | drizzle | googleapis | ioredis | nodemailer | openai | passport | passport-google-oauth20 | passport-microsoft | redis | stripe |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| user prompts | ● | ● | ● | — | — | ● | — | — | — | — | ● | — | — | — | — | — |
| conversation history | ● | ● | ● | — | — | ● | — | — | — | — | ● | — | — | — | — | — |
| generated content | ● | ● | ● | — | — | ● | — | — | — | — | ● | — | — | — | — | — |
| uploaded files | — | — | — | ● | — | — | — | — | — | — | — | — | — | — | — | — |
| file metadata | — | — | — | ● | — | — | — | — | — | — | — | — | — | — | — | — |
| error data | — | — | — | — | ● | — | — | — | — | — | — | — | — | — | — | — |
| stack traces | — | — | — | — | ● | — | — | — | — | — | — | — | — | — | — | — |
| user context | — | — | — | — | ● | — | — | — | — | — | — | — | — | — | — | — |
| device information | — | — | — | — | ● | — | — | — | — | — | — | — | — | — | — | — |
| IP address | — | — | — | — | ● | — | — | — | — | — | — | — | — | — | — | — |
| performance profiles | — | — | — | — | ● | — | — | — | — | — | — | — | — | — | — | — |
| user data as defined in schema | — | — | — | — | — | — | ● | — | — | — | — | — | — | — | — | — |
| user data via Google APIs | — | — | — | — | — | — | — | ● | — | — | — | — | — | — | — | — |
| calendar data | — | — | — | — | — | — | — | ● | — | — | — | — | — | — | — | — |
| email data | — | — | — | — | — | — | — | ● | — | — | — | — | — | — | — | — |
| profile information | — | — | — | — | — | — | — | ● | — | — | — | — | — | — | — | — |
| cached data | — | — | — | — | — | — | — | — | ● | — | — | — | — | — | ● | — |
| session data | — | — | — | — | — | — | — | — | ● | — | — | ● | — | — | ● | — |
| email addresses | — | — | — | — | — | — | — | — | — | ● | — | — | — | — | — | — |
| email content | — | — | — | — | — | — | — | — | — | ● | — | — | — | — | — | — |
| email | — | — | — | — | — | — | — | — | — | — | — | ● | ● | ● | — | ● |
| name | — | — | — | — | — | — | — | — | — | — | — | ● | ● | ● | — | — |
| OAuth tokens | — | — | — | — | — | — | — | — | — | — | — | ● | ● | ● | — | — |
| Google profile data | — | — | — | — | — | — | — | — | — | — | — | — | ● | — | — | — |
| Microsoft profile data | — | — | — | — | — | — | — | — | — | — | — | — | — | ● | — | — |
| payment information | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | ● |
| billing address | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | ● |
| transaction history | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | ● |

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
