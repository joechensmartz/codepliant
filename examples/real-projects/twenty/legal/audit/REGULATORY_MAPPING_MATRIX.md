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
| @ai-sdk/anthropic | ai | YES | — | YES | — | — | YES |
| @ai-sdk/google | ai | YES | — | YES | — | — | YES |
| @ai-sdk/openai | ai | YES | — | YES | — | — | YES |
| @aws-sdk/client-s3 | storage | YES | — | — | — | ? | YES |
| @sentry/node | monitoring | YES | YES | — | — | — | YES |
| @vercel/ai | ai | YES | — | YES | — | — | YES |
| drizzle | database | YES | — | — | — | ? | YES |
| googleapis | other | YES | YES | — | — | — | — |
| ioredis | database | YES | — | — | — | ? | YES |
| nodemailer | email | YES | YES | — | — | — | YES |
| openai | ai | YES | — | YES | — | — | YES |
| passport | auth | YES | YES | — | — | — | YES |
| passport-google-oauth20 | auth | YES | YES | — | — | — | YES |
| passport-microsoft | auth | YES | YES | — | — | — | YES |
| redis | database | YES | — | — | — | ? | YES |
| stripe | payment | YES | YES | — | YES | — | YES |

## Regulation Coverage Summary

| Regulation | Services Affected | Coverage % | Priority |
|-----------|------------------|-----------|----------|
| GDPR | 16/16 | 100% | High |
| CCPA | 7/16 | 44% | Medium |
| EU AI Act | 5/16 | 31% | Medium |
| PCI DSS | 1/16 | 6% | Medium |
| HIPAA | 0/16 (+4 pending) | 0% | Low |
| SOC 2 | 15/16 | 94% | High |

## Detailed Assessment by Regulation

### GDPR

**Applicable services:**

| Service | Reason |
|---------|--------|
| @ai-sdk/anthropic | Processes personal data |
| @ai-sdk/google | Processes personal data |
| @ai-sdk/openai | Processes personal data |
| @aws-sdk/client-s3 | May store personal data |
| @sentry/node | Processes personal data |
| @vercel/ai | Processes personal data |
| drizzle | Processes personal data |
| googleapis | Processes personal data |
| ioredis | May store personal data |
| nodemailer | Processes personal data |
| openai | Processes personal data |
| passport | Processes personal data |
| passport-google-oauth20 | Processes personal data |
| passport-microsoft | Processes personal data |
| redis | May store personal data |
| stripe | Processes personal data |

### CCPA

**Applicable services:**

| Service | Reason |
|---------|--------|
| @sentry/node | Processes California consumer personal information |
| googleapis | Processes California consumer personal information |
| nodemailer | Processes consumer contact information |
| passport | Collects consumer identity information |
| passport-google-oauth20 | Collects consumer identity information |
| passport-microsoft | Collects consumer identity information |
| stripe | Processes California consumer personal information |

### EU AI Act

**Applicable services:**

| Service | Reason |
|---------|--------|
| @ai-sdk/anthropic | AI/ML service — subject to EU AI Act requirements |
| @ai-sdk/google | AI/ML service — subject to EU AI Act requirements |
| @ai-sdk/openai | AI/ML service — subject to EU AI Act requirements |
| @vercel/ai | AI/ML service — subject to EU AI Act requirements |
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
| drizzle | May apply if storing PHI — requires manual assessment |
| ioredis | May apply if storing PHI — requires manual assessment |
| redis | May apply if storing PHI — requires manual assessment |

### SOC 2

**Applicable services:**

| Service | Reason |
|---------|--------|
| @ai-sdk/anthropic | AI service — relevant to SOC 2 processing integrity criteria |
| @ai-sdk/google | AI service — relevant to SOC 2 processing integrity criteria |
| @ai-sdk/openai | AI service — relevant to SOC 2 processing integrity criteria |
| @aws-sdk/client-s3 | storage service relevant to SOC 2 Trust Service Criteria |
| @sentry/node | monitoring service relevant to SOC 2 Trust Service Criteria |
| @vercel/ai | AI service — relevant to SOC 2 processing integrity criteria |
| drizzle | database service relevant to SOC 2 Trust Service Criteria |
| ioredis | database service relevant to SOC 2 Trust Service Criteria |
| nodemailer | email service relevant to SOC 2 Trust Service Criteria |
| openai | AI service — relevant to SOC 2 processing integrity criteria |
| passport | auth service relevant to SOC 2 Trust Service Criteria |
| passport-google-oauth20 | auth service relevant to SOC 2 Trust Service Criteria |
| passport-microsoft | auth service relevant to SOC 2 Trust Service Criteria |
| redis | database service relevant to SOC 2 Trust Service Criteria |
| stripe | Payment service — relevant to SOC 2 confidentiality criteria |

## Category Heatmap

Regulatory exposure by service category:

| Category | # Services | GDPR | CCPA | AI Act | PCI | HIPAA | SOC 2 | Regulatory Exposure |
|----------|-----------|------|------|--------|-----|-------|-------|-------------------|
| ai | 5 | 5 | 0 | 5 | 0 | 0 | 5 | 50% (Medium) |
| storage | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 33% (Low) |
| monitoring | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 50% (Medium) |
| database | 3 | 3 | 0 | 0 | 0 | 0 | 3 | 33% (Low) |
| other | 1 | 1 | 1 | 0 | 0 | 0 | 0 | 33% (Low) |
| email | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 50% (Medium) |
| auth | 3 | 3 | 3 | 0 | 0 | 0 | 3 | 50% (Medium) |
| payment | 1 | 1 | 1 | 0 | 1 | 0 | 1 | 67% (Medium) |

## Recommendations

1. **GDPR:** 16 service(s) process personal data. Ensure DPAs are in place, lawful basis is documented, and DSAR handling procedures are established.
2. **CCPA:** 7 service(s) process consumer information. Ensure "Do Not Sell" mechanisms are implemented and privacy notice is updated.
3. **EU AI Act:** 5 AI service(s) detected. Classify risk level, implement transparency requirements, and document human oversight measures.
4. **PCI DSS:** 1 payment service(s) detected. Verify PCI compliance of payment processors and minimize cardholder data exposure.
5. **SOC 2:** Review Trust Service Criteria (Security, Availability, Processing Integrity, Confidentiality, Privacy) against all applicable services.

---

*This regulatory mapping matrix was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **twenty** codebase. Applicability assessments are based on service categories and detected data types. Consult legal counsel to confirm regulatory obligations for your specific jurisdiction and use case.*
