# Cross-Border Data Transfer Map

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Organisation:** [Your Company Name]
**Data Exporter Location:** [Your Location]
**Project:** saleor
**Generated:** 2026-03-16

---

> This document maps all international data transfers identified through code analysis. It identifies the destination country, service provider, data types transferred, and applicable legal safeguards for each transfer. Required under GDPR Chapter V (Articles 44-49) for EU data exporters.

## Transfer Flow Diagram

```mermaid
graph LR
  A["[Your Company Name]<br/>[Your Location]"]
  C0["Unknown<br/>boto3<br/>Django Channels<br/>django-admin<br/>django-sessions<br/>redis"]
  A -->|"SCCs"| C0
  C1["United States<br/>stripe"]
  A -->|"DPF/Adequacy"| C1
```

## Transfer Summary by Country

| Country | Services | Data Types | Safeguard | Adequacy Decision |
|---------|----------|-----------|-----------|-------------------|
| Unknown (??) | boto3, Django Channels, django-admin, django-sessions, redis | uploaded files, file metadata, real-time user data, connection metadata | [Verify with provider] | No |
| United States (US) | stripe | payment information, billing address, email, transaction history | EU-US DPF / SCCs | Yes |

## Detailed Transfer Register

| # | Service | Category | Country | Data Types | Safeguard | DPF Certified | DPA in Place |
|---|---------|----------|---------|-----------|-----------|---------------|-------------|
| 1 | boto3 | storage | Unknown | uploaded files, file metadata | [Verify with provider] | N/A | [ ] |
| 2 | Django Channels | other | Unknown | real-time user data, connection metadata, channel group data | [Verify with provider] | N/A | [ ] |
| 3 | django-admin | auth | Unknown | admin panel access, staff user accounts | [Verify with provider] | N/A | [ ] |
| 4 | django-sessions | auth | Unknown | session cookies, CSRF tokens | [Verify with provider] | N/A | [ ] |
| 5 | redis | database | Unknown | cached data, session data | [Verify with provider] | N/A | [ ] |
| 6 | stripe | payment | United States | payment information, billing address, email | EU-US DPF / SCCs | [Verify](https://www.dataprivacyframework.gov/list) | [ ] |

## Services Requiring Additional Safeguards

The following services transfer data to countries without an EU adequacy decision. Additional safeguards (SCCs + supplementary measures) are required per the Schrems II ruling.

### boto3

- **Destination:** Unknown
- **Safeguard:** [Verify with provider]
- **Data:** uploaded files, file metadata
- **Required actions:**
  - [ ] Execute Standard Contractual Clauses (Module 2: Controller to Processor)
  - [ ] Complete Annex I (List of parties)
  - [ ] Complete Annex II (Technical and organisational measures)
  - [ ] Verify provider's DPF certification status
  - [ ] Implement supplementary encryption measures if needed

### Django Channels

- **Destination:** Unknown
- **Safeguard:** [Verify with provider]
- **Data:** real-time user data, connection metadata, channel group data, WebSocket messages
- **Required actions:**
  - [ ] Execute Standard Contractual Clauses (Module 2: Controller to Processor)
  - [ ] Complete Annex I (List of parties)
  - [ ] Complete Annex II (Technical and organisational measures)
  - [ ] Verify provider's DPF certification status
  - [ ] Implement supplementary encryption measures if needed

### django-admin

- **Destination:** Unknown
- **Safeguard:** [Verify with provider]
- **Data:** admin panel access, staff user accounts
- **Required actions:**
  - [ ] Execute Standard Contractual Clauses (Module 2: Controller to Processor)
  - [ ] Complete Annex I (List of parties)
  - [ ] Complete Annex II (Technical and organisational measures)
  - [ ] Verify provider's DPF certification status
  - [ ] Implement supplementary encryption measures if needed

### django-sessions

- **Destination:** Unknown
- **Safeguard:** [Verify with provider]
- **Data:** session cookies, CSRF tokens
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

| Data Type | boto3 | Django Channels | django-admin | django-sessions | redis | stripe |
| --- | --- | --- | --- | --- | --- | --- |
| uploaded files | ● | — | — | — | — | — |
| file metadata | ● | — | — | — | — | — |
| real-time user data | — | ● | — | — | — | — |
| connection metadata | — | ● | — | — | — | — |
| channel group data | — | ● | — | — | — | — |
| WebSocket messages | — | ● | — | — | — | — |
| admin panel access | — | — | ● | — | — | — |
| staff user accounts | — | — | ● | — | — | — |
| session cookies | — | — | — | ● | — | — |
| CSRF tokens | — | — | — | ● | — | — |
| cached data | — | — | — | — | ● | — |
| session data | — | — | — | — | ● | — |
| payment information | — | — | — | — | — | ● |
| billing address | — | — | — | — | — | ● |
| email | — | — | — | — | — | ● |
| transaction history | — | — | — | — | — | ● |

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
