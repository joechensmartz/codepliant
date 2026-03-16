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
| @hubspot/api-client | other | YES | YES | — | — | — | — |
| @sendgrid/mail | email | YES | YES | — | — | — | YES |
| @sentry/nextjs | monitoring | YES | YES | — | — | — | YES |
| @upstash/redis | database | YES | — | — | — | ? | YES |
| Google Analytics | analytics | YES | YES | — | — | — | YES |
| Google Tag Manager | analytics | YES | YES | — | — | — | YES |
| google-auth-library | auth | YES | YES | — | — | — | YES |
| googleapis | other | YES | YES | — | — | — | — |
| intercom | other | YES | YES | — | — | — | — |
| ioredis | database | YES | — | — | — | ? | YES |
| next-auth | auth | YES | YES | — | — | — | YES |
| nodemailer | email | YES | YES | — | — | — | YES |
| passport | auth | YES | YES | — | — | — | YES |
| Plausible Analytics | analytics | YES | YES | — | — | — | YES |
| PostgreSQL | database | YES | — | — | — | ? | YES |
| PostgreSQL (env) | database | YES | — | — | — | ? | YES |
| posthog | analytics | YES | YES | — | — | — | YES |
| prisma | database | YES | — | — | — | ? | YES |
| Redis | database | YES | — | — | — | ? | YES |
| Redis (env) | database | YES | — | — | — | ? | YES |
| stripe | payment | YES | YES | — | YES | — | YES |
| twilio | other | YES | YES | — | — | — | — |
| web-push | other | YES | YES | — | — | — | — |

## Regulation Coverage Summary

| Regulation | Services Affected | Coverage % | Priority |
|-----------|------------------|-----------|----------|
| GDPR | 23/23 | 100% | High |
| CCPA | 16/23 | 70% | High |
| EU AI Act | 0/23 | 0% | Low |
| PCI DSS | 1/23 | 4% | Medium |
| HIPAA | 0/23 (+7 pending) | 0% | Low |
| SOC 2 | 18/23 | 78% | High |

## Detailed Assessment by Regulation

### GDPR

**Applicable services:**

| Service | Reason |
|---------|--------|
| @hubspot/api-client | Processes personal data |
| @sendgrid/mail | Processes personal data |
| @sentry/nextjs | Processes personal data |
| @upstash/redis | May store personal data |
| Google Analytics | Processes personal data |
| Google Tag Manager | Processes personal data |
| google-auth-library | Processes personal data |
| googleapis | Processes personal data |
| intercom | Processes personal data |
| ioredis | May store personal data |
| next-auth | Processes personal data |
| nodemailer | Processes personal data |
| passport | Processes personal data |
| Plausible Analytics | Processes personal data |
| PostgreSQL | Processes personal data |
| PostgreSQL (env) | Processes personal data |
| posthog | Processes personal data |
| prisma | Processes personal data |
| Redis | May store personal data |
| Redis (env) | May store personal data |
| stripe | Processes personal data |
| twilio | Processes personal data |
| web-push | Processes personal data |

### CCPA

**Applicable services:**

| Service | Reason |
|---------|--------|
| @hubspot/api-client | Processes California consumer personal information |
| @sendgrid/mail | Processes consumer contact information |
| @sentry/nextjs | Processes California consumer personal information |
| Google Analytics | Collects/shares consumer information for commercial purposes |
| Google Tag Manager | Collects/shares consumer information for commercial purposes |
| google-auth-library | Collects consumer identity information |
| googleapis | Processes California consumer personal information |
| intercom | Processes California consumer personal information |
| next-auth | Collects consumer identity information |
| nodemailer | Processes consumer contact information |
| passport | Collects consumer identity information |
| Plausible Analytics | Collects/shares consumer information for commercial purposes |
| posthog | Collects/shares consumer information for commercial purposes |
| stripe | Processes California consumer personal information |
| twilio | Processes California consumer personal information |
| web-push | Processes California consumer personal information |

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
| @upstash/redis | May apply if storing PHI — requires manual assessment |
| ioredis | May apply if storing PHI — requires manual assessment |
| PostgreSQL | May apply if storing PHI — requires manual assessment |
| PostgreSQL (env) | May apply if storing PHI — requires manual assessment |
| prisma | May apply if storing PHI — requires manual assessment |
| Redis | May apply if storing PHI — requires manual assessment |
| Redis (env) | May apply if storing PHI — requires manual assessment |

### SOC 2

**Applicable services:**

| Service | Reason |
|---------|--------|
| @sendgrid/mail | email service relevant to SOC 2 Trust Service Criteria |
| @sentry/nextjs | monitoring service relevant to SOC 2 Trust Service Criteria |
| @upstash/redis | database service relevant to SOC 2 Trust Service Criteria |
| Google Analytics | Processes customer data — relevant to SOC 2 privacy criteria |
| Google Tag Manager | Processes customer data — relevant to SOC 2 privacy criteria |
| google-auth-library | auth service relevant to SOC 2 Trust Service Criteria |
| ioredis | database service relevant to SOC 2 Trust Service Criteria |
| next-auth | auth service relevant to SOC 2 Trust Service Criteria |
| nodemailer | email service relevant to SOC 2 Trust Service Criteria |
| passport | auth service relevant to SOC 2 Trust Service Criteria |
| Plausible Analytics | Processes customer data — relevant to SOC 2 privacy criteria |
| PostgreSQL | database service relevant to SOC 2 Trust Service Criteria |
| PostgreSQL (env) | database service relevant to SOC 2 Trust Service Criteria |
| posthog | Processes customer data — relevant to SOC 2 privacy criteria |
| prisma | database service relevant to SOC 2 Trust Service Criteria |
| Redis | database service relevant to SOC 2 Trust Service Criteria |
| Redis (env) | database service relevant to SOC 2 Trust Service Criteria |
| stripe | Payment service — relevant to SOC 2 confidentiality criteria |

## Category Heatmap

Regulatory exposure by service category:

| Category | # Services | GDPR | CCPA | AI Act | PCI | HIPAA | SOC 2 | Regulatory Exposure |
|----------|-----------|------|------|--------|-----|-------|-------|-------------------|
| other | 5 | 5 | 5 | 0 | 0 | 0 | 0 | 33% (Low) |
| email | 2 | 2 | 2 | 0 | 0 | 0 | 2 | 50% (Medium) |
| monitoring | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 50% (Medium) |
| database | 7 | 7 | 0 | 0 | 0 | 0 | 7 | 33% (Low) |
| analytics | 4 | 4 | 4 | 0 | 0 | 0 | 4 | 50% (Medium) |
| auth | 3 | 3 | 3 | 0 | 0 | 0 | 3 | 50% (Medium) |
| payment | 1 | 1 | 1 | 0 | 1 | 0 | 1 | 67% (Medium) |

## Recommendations

1. **GDPR:** 23 service(s) process personal data. Ensure DPAs are in place, lawful basis is documented, and DSAR handling procedures are established.
2. **CCPA:** 16 service(s) process consumer information. Ensure "Do Not Sell" mechanisms are implemented and privacy notice is updated.
3. **PCI DSS:** 1 payment service(s) detected. Verify PCI compliance of payment processors and minimize cardholder data exposure.
4. **SOC 2:** Review Trust Service Criteria (Security, Availability, Processing Integrity, Confidentiality, Privacy) against all applicable services.

---

*This regulatory mapping matrix was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **calcom-monorepo** codebase. Applicability assessments are based on service categories and detected data types. Consult legal counsel to confirm regulatory obligations for your specific jurisdiction and use case.*
