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
| @ai-sdk/google-vertex | ai | YES | — | YES | — | — | YES |
| @aws-sdk/client-ses | email | YES | YES | — | — | — | YES |
| @google-cloud/kms | other | — | — | — | — | — | — |
| @simplewebauthn/server | auth | YES | YES | — | — | — | YES |
| @vercel/ai | ai | YES | — | YES | — | — | YES |
| googleapis | other | YES | YES | — | — | — | — |
| next-auth | auth | YES | YES | — | — | — | YES |
| nodemailer | email | YES | YES | — | — | — | YES |
| passport-microsoft | auth | YES | YES | — | — | — | YES |
| posthog | analytics | YES | YES | — | — | — | YES |
| prisma | database | YES | — | — | — | ? | YES |
| resend | email | YES | YES | — | — | — | YES |
| stripe | payment | YES | YES | — | YES | — | YES |

## Regulation Coverage Summary

| Regulation | Services Affected | Coverage % | Priority |
|-----------|------------------|-----------|----------|
| GDPR | 12/13 | 92% | High |
| CCPA | 9/13 | 69% | High |
| EU AI Act | 2/13 | 15% | Medium |
| PCI DSS | 1/13 | 8% | Medium |
| HIPAA | 0/13 (+1 pending) | 0% | Low |
| SOC 2 | 11/13 | 85% | High |

## Detailed Assessment by Regulation

### GDPR

**Applicable services:**

| Service | Reason |
|---------|--------|
| @ai-sdk/google-vertex | Processes personal data |
| @aws-sdk/client-ses | Processes personal data |
| @simplewebauthn/server | Processes personal data |
| @vercel/ai | Processes personal data |
| googleapis | Processes personal data |
| next-auth | Processes personal data |
| nodemailer | Processes personal data |
| passport-microsoft | Processes personal data |
| posthog | Processes personal data |
| prisma | Processes personal data |
| resend | Processes personal data |
| stripe | Processes personal data |

### CCPA

**Applicable services:**

| Service | Reason |
|---------|--------|
| @aws-sdk/client-ses | Processes consumer contact information |
| @simplewebauthn/server | Collects consumer identity information |
| googleapis | Processes California consumer personal information |
| next-auth | Collects consumer identity information |
| nodemailer | Processes consumer contact information |
| passport-microsoft | Collects consumer identity information |
| posthog | Collects/shares consumer information for commercial purposes |
| resend | Processes consumer contact information |
| stripe | Processes California consumer personal information |

### EU AI Act

**Applicable services:**

| Service | Reason |
|---------|--------|
| @ai-sdk/google-vertex | AI/ML service — subject to EU AI Act requirements |
| @vercel/ai | AI/ML service — subject to EU AI Act requirements |

### PCI DSS

**Applicable services:**

| Service | Reason |
|---------|--------|
| stripe | Payment processing — PCI DSS applies |

### HIPAA

**Requires manual assessment:**

| Service | Reason |
|---------|--------|
| prisma | May apply if storing PHI — requires manual assessment |

### SOC 2

**Applicable services:**

| Service | Reason |
|---------|--------|
| @ai-sdk/google-vertex | AI service — relevant to SOC 2 processing integrity criteria |
| @aws-sdk/client-ses | email service relevant to SOC 2 Trust Service Criteria |
| @simplewebauthn/server | auth service relevant to SOC 2 Trust Service Criteria |
| @vercel/ai | AI service — relevant to SOC 2 processing integrity criteria |
| next-auth | auth service relevant to SOC 2 Trust Service Criteria |
| nodemailer | email service relevant to SOC 2 Trust Service Criteria |
| passport-microsoft | auth service relevant to SOC 2 Trust Service Criteria |
| posthog | Processes customer data — relevant to SOC 2 privacy criteria |
| prisma | database service relevant to SOC 2 Trust Service Criteria |
| resend | email service relevant to SOC 2 Trust Service Criteria |
| stripe | Payment service — relevant to SOC 2 confidentiality criteria |

## Category Heatmap

Regulatory exposure by service category:

| Category | # Services | GDPR | CCPA | AI Act | PCI | HIPAA | SOC 2 | Regulatory Exposure |
|----------|-----------|------|------|--------|-----|-------|-------|-------------------|
| ai | 2 | 2 | 0 | 2 | 0 | 0 | 2 | 50% (Medium) |
| email | 3 | 3 | 3 | 0 | 0 | 0 | 3 | 50% (Medium) |
| other | 2 | 1 | 1 | 0 | 0 | 0 | 0 | 17% (Low) |
| auth | 3 | 3 | 3 | 0 | 0 | 0 | 3 | 50% (Medium) |
| analytics | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 50% (Medium) |
| database | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 33% (Low) |
| payment | 1 | 1 | 1 | 0 | 1 | 0 | 1 | 67% (Medium) |

## Recommendations

1. **GDPR:** 12 service(s) process personal data. Ensure DPAs are in place, lawful basis is documented, and DSAR handling procedures are established.
2. **CCPA:** 9 service(s) process consumer information. Ensure "Do Not Sell" mechanisms are implemented and privacy notice is updated.
3. **EU AI Act:** 2 AI service(s) detected. Classify risk level, implement transparency requirements, and document human oversight measures.
4. **PCI DSS:** 1 payment service(s) detected. Verify PCI compliance of payment processors and minimize cardholder data exposure.
5. **SOC 2:** Review Trust Service Criteria (Security, Availability, Processing Integrity, Confidentiality, Privacy) against all applicable services.

---

*This regulatory mapping matrix was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **@documenso/root** codebase. Applicability assessments are based on service categories and detected data types. Consult legal counsel to confirm regulatory obligations for your specific jurisdiction and use case.*
