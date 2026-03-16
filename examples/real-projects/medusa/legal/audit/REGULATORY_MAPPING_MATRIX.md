# Regulatory Mapping Matrix

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Organization:** [Your Company Name]

**Generated:** 2026-03-16

This matrix maps each detected third-party service to applicable regulations. Use this to understand the regulatory landscape for your technology stack and prioritize compliance efforts accordingly.

## Legend

| Symbol | Meaning |
|--------|---------|
| **YES** | Regulation applies to this service |
| **?** | May apply — requires manual assessment |
| **—** | Not applicable based on current analysis |

## Service-to-Regulation Matrix

| Service | Category | GDPR | CCPA | EU AI Act | PCI DSS | HIPAA | SOC 2 |
|---------|----------|------|------|-----------|---------|-------|-------|
| @aws-sdk/client-s3 | storage | YES | — | — | — | ? | YES |
| @segment/analytics-next | analytics | YES | YES | — | — | — | YES |
| @sendgrid/mail | email | YES | YES | — | — | — | YES |
| algoliasearch | other | YES | — | — | — | — | — |
| cookie-parser | other | YES | — | — | — | — | — |
| express-session | other | YES | — | — | — | — | — |
| ioredis | database | YES | — | — | — | ? | YES |
| Multer | storage | YES | — | — | — | ? | YES |
| openai | ai | YES | — | YES | — | — | YES |
| posthog | analytics | YES | YES | — | — | — | YES |
| stripe | payment | YES | YES | — | YES | — | YES |

## Regulation Coverage Summary

| Regulation | Services Affected | Coverage % | Priority |
|-----------|------------------|-----------|----------|
| GDPR | 11/11 | 100% | High |
| CCPA | 4/11 | 36% | Medium |
| EU AI Act | 1/11 | 9% | Medium |
| PCI DSS | 1/11 | 9% | Medium |
| HIPAA | 0/11 (+3 pending) | 0% | Low |
| SOC 2 | 8/11 | 73% | High |

## Detailed Assessment by Regulation

### GDPR

**Applicable services:**

| Service | Reason |
|---------|--------|
| @aws-sdk/client-s3 | May store personal data |
| @segment/analytics-next | Processes personal data |
| @sendgrid/mail | Processes personal data |
| algoliasearch | Processes personal data |
| cookie-parser | Processes personal data |
| express-session | Processes personal data |
| ioredis | May store personal data |
| Multer | May store personal data |
| openai | Processes personal data |
| posthog | Processes personal data |
| stripe | Processes personal data |

### CCPA

**Applicable services:**

| Service | Reason |
|---------|--------|
| @segment/analytics-next | Collects/shares consumer information for commercial purposes |
| @sendgrid/mail | Processes consumer contact information |
| posthog | Collects/shares consumer information for commercial purposes |
| stripe | Processes California consumer personal information |

### EU AI Act

**Applicable services:**

| Service | Reason |
|---------|--------|
| openai | AI/ML service — subject to EU AI Act requirements |

### PCI DSS

**Applicable services:**

| Service | Reason |
|---------|--------|
| stripe | Payment processing — PCI DSS applies |

### HIPAA

**Requires manual assessment:**

| Service | Reason |
|---------|--------|
| @aws-sdk/client-s3 | May apply if storing PHI — requires manual assessment |
| ioredis | May apply if storing PHI — requires manual assessment |
| Multer | May apply if storing PHI — requires manual assessment |

### SOC 2

**Applicable services:**

| Service | Reason |
|---------|--------|
| @aws-sdk/client-s3 | storage service relevant to SOC 2 Trust Service Criteria |
| @segment/analytics-next | Processes customer data — relevant to SOC 2 privacy criteria |
| @sendgrid/mail | email service relevant to SOC 2 Trust Service Criteria |
| ioredis | database service relevant to SOC 2 Trust Service Criteria |
| Multer | storage service relevant to SOC 2 Trust Service Criteria |
| openai | AI service — relevant to SOC 2 processing integrity criteria |
| posthog | Processes customer data — relevant to SOC 2 privacy criteria |
| stripe | Payment service — relevant to SOC 2 confidentiality criteria |

## Category Heatmap

Regulatory exposure by service category:

| Category | # Services | GDPR | CCPA | AI Act | PCI | HIPAA | SOC 2 | Regulatory Exposure |
|----------|-----------|------|------|--------|-----|-------|-------|-------------------|
| storage | 2 | 2 | 0 | 0 | 0 | 0 | 2 | 33% (Low) |
| analytics | 2 | 2 | 2 | 0 | 0 | 0 | 2 | 50% (Medium) |
| email | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 50% (Medium) |
| other | 3 | 3 | 0 | 0 | 0 | 0 | 0 | 17% (Low) |
| database | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 33% (Low) |
| ai | 1 | 1 | 0 | 1 | 0 | 0 | 1 | 50% (Medium) |
| payment | 1 | 1 | 1 | 0 | 1 | 0 | 1 | 67% (Medium) |

## Recommendations

1. **GDPR:** 11 service(s) process personal data. Ensure DPAs are in place, lawful basis is documented, and DSAR handling procedures are established.
2. **CCPA:** 4 service(s) process consumer information. Ensure "Do Not Sell" mechanisms are implemented and privacy notice is updated.
3. **EU AI Act:** 1 AI service(s) detected. Classify risk level, implement transparency requirements, and document human oversight measures.
4. **PCI DSS:** 1 payment service(s) detected. Verify PCI compliance of payment processors and minimize cardholder data exposure.
5. **SOC 2:** Review Trust Service Criteria (Security, Availability, Processing Integrity, Confidentiality, Privacy) against all applicable services.

---

*This regulatory mapping matrix was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **root** codebase. Applicability assessments are based on service categories and detected data types. Consult legal counsel to confirm regulatory obligations for your specific jurisdiction and use case.*
