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
| @sentry/nextjs | monitoring | YES | YES | — | — | — | YES |
| googleapis | other | YES | YES | — | — | — | — |
| ioredis | database | YES | — | — | — | ? | YES |
| next-auth | auth | YES | YES | — | — | — | YES |
| nodemailer | email | YES | YES | — | — | — | YES |
| posthog | analytics | YES | YES | — | — | — | YES |
| prisma | database | YES | — | — | — | ? | YES |
| redis | database | YES | — | — | — | ? | YES |
| stripe | payment | YES | YES | — | YES | — | YES |

## Regulation Coverage Summary

| Regulation | Services Affected | Coverage % | Priority |
|-----------|------------------|-----------|----------|
| GDPR | 10/10 | 100% | High |
| CCPA | 6/10 | 60% | High |
| EU AI Act | 0/10 | 0% | Low |
| PCI DSS | 1/10 | 10% | Medium |
| HIPAA | 0/10 (+4 pending) | 0% | Low |
| SOC 2 | 9/10 | 90% | High |

## Detailed Assessment by Regulation

### GDPR

**Applicable services:**

| Service | Reason |
|---------|--------|
| @aws-sdk/client-s3 | May store personal data |
| @sentry/nextjs | Processes personal data |
| googleapis | Processes personal data |
| ioredis | May store personal data |
| next-auth | Processes personal data |
| nodemailer | Processes personal data |
| posthog | Processes personal data |
| prisma | Processes personal data |
| redis | May store personal data |
| stripe | Processes personal data |

### CCPA

**Applicable services:**

| Service | Reason |
|---------|--------|
| @sentry/nextjs | Processes California consumer personal information |
| googleapis | Processes California consumer personal information |
| next-auth | Collects consumer identity information |
| nodemailer | Processes consumer contact information |
| posthog | Collects/shares consumer information for commercial purposes |
| stripe | Processes California consumer personal information |

### EU AI Act

No services identified as subject to EU AI Act requirements.

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
| prisma | May apply if storing PHI — requires manual assessment |
| redis | May apply if storing PHI — requires manual assessment |

### SOC 2

**Applicable services:**

| Service | Reason |
|---------|--------|
| @aws-sdk/client-s3 | storage service relevant to SOC 2 Trust Service Criteria |
| @sentry/nextjs | monitoring service relevant to SOC 2 Trust Service Criteria |
| ioredis | database service relevant to SOC 2 Trust Service Criteria |
| next-auth | auth service relevant to SOC 2 Trust Service Criteria |
| nodemailer | email service relevant to SOC 2 Trust Service Criteria |
| posthog | Processes customer data — relevant to SOC 2 privacy criteria |
| prisma | database service relevant to SOC 2 Trust Service Criteria |
| redis | database service relevant to SOC 2 Trust Service Criteria |
| stripe | Payment service — relevant to SOC 2 confidentiality criteria |

## Category Heatmap

Regulatory exposure by service category:

| Category | # Services | GDPR | CCPA | AI Act | PCI | HIPAA | SOC 2 | Regulatory Exposure |
|----------|-----------|------|------|--------|-----|-------|-------|-------------------|
| storage | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 33% (Low) |
| monitoring | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 50% (Medium) |
| other | 1 | 1 | 1 | 0 | 0 | 0 | 0 | 33% (Low) |
| database | 3 | 3 | 0 | 0 | 0 | 0 | 3 | 33% (Low) |
| auth | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 50% (Medium) |
| email | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 50% (Medium) |
| analytics | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 50% (Medium) |
| payment | 1 | 1 | 1 | 0 | 1 | 0 | 1 | 67% (Medium) |

## Recommendations

1. **GDPR:** 10 service(s) process personal data. Ensure DPAs are in place, lawful basis is documented, and DSAR handling procedures are established.
2. **CCPA:** 6 service(s) process consumer information. Ensure "Do Not Sell" mechanisms are implemented and privacy notice is updated.
3. **PCI DSS:** 1 payment service(s) detected. Verify PCI compliance of payment processors and minimize cardholder data exposure.
4. **SOC 2:** Review Trust Service Criteria (Security, Availability, Processing Integrity, Confidentiality, Privacy) against all applicable services.

---

*This regulatory mapping matrix was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **formbricks** codebase. Applicability assessments are based on service categories and detected data types. Consult legal counsel to confirm regulatory obligations for your specific jurisdiction and use case.*
