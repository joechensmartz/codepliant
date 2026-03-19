> **Document Version:** 1.0  
> **Document Owner:** Acme Inc  
> **Next Review Date:** 2027-03-18


**Organization:** Acme Inc

**Generated:** 2026-03-18

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
| @sentry/node | monitoring | YES | YES | — | — | — | YES |
| @supabase/supabase-js | auth | YES | YES | — | — | — | YES |
| openai | ai | YES | — | YES | — | — | YES |
| posthog | analytics | YES | YES | — | — | — | YES |
| prisma | database | YES | — | — | — | ? | YES |
| resend | email | YES | YES | — | — | — | YES |
| stripe | payment | YES | YES | — | YES | — | YES |
| stripe-ios | payment | YES | YES | — | YES | — | YES |

## Regulation Coverage Summary

| Regulation | Services Affected | Coverage % | Priority |
|-----------|------------------|-----------|----------|
| GDPR | 8/8 | 100% | High |
| CCPA | 6/8 | 75% | High |
| EU AI Act | 1/8 | 13% | Medium |
| PCI DSS | 2/8 | 25% | Medium |
| HIPAA | 0/8 (+1 pending) | 0% | Low |
| SOC 2 | 8/8 | 100% | High |

## Detailed Assessment by Regulation

### GDPR

**Applicable services:**

| Service | Reason |
|---------|--------|
| @sentry/node | Processes personal data |
| @supabase/supabase-js | Processes personal data |
| openai | Processes personal data |
| posthog | Processes personal data |
| prisma | Processes personal data |
| resend | Processes personal data |
| stripe | Processes personal data |
| stripe-ios | Processes personal data |

### CCPA

**Applicable services:**

| Service | Reason |
|---------|--------|
| @sentry/node | Processes California consumer personal information |
| @supabase/supabase-js | Collects consumer identity information |
| posthog | Collects/shares consumer information for commercial purposes |
| resend | Processes consumer contact information |
| stripe | Processes California consumer personal information |
| stripe-ios | Processes California consumer personal information |

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
| stripe-ios | Payment processing — PCI DSS applies |

### HIPAA

**Requires manual assessment:**

| Service | Reason |
|---------|--------|
| prisma | May apply if storing PHI — requires manual assessment |

### SOC 2

**Applicable services:**

| Service | Reason |
|---------|--------|
| @sentry/node | monitoring service relevant to SOC 2 Trust Service Criteria |
| @supabase/supabase-js | auth service relevant to SOC 2 Trust Service Criteria |
| openai | AI service — relevant to SOC 2 processing integrity criteria |
| posthog | Processes customer data — relevant to SOC 2 privacy criteria |
| prisma | database service relevant to SOC 2 Trust Service Criteria |
| resend | email service relevant to SOC 2 Trust Service Criteria |
| stripe | Payment service — relevant to SOC 2 confidentiality criteria |
| stripe-ios | Payment service — relevant to SOC 2 confidentiality criteria |

## Category Heatmap

Regulatory exposure by service category:

| Category | # Services | GDPR | CCPA | AI Act | PCI | HIPAA | SOC 2 | Regulatory Exposure |
|----------|-----------|------|------|--------|-----|-------|-------|-------------------|
| monitoring | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 50% (Medium) |
| auth | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 50% (Medium) |
| ai | 1 | 1 | 0 | 1 | 0 | 0 | 1 | 50% (Medium) |
| analytics | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 50% (Medium) |
| database | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 33% (Low) |
| email | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 50% (Medium) |
| payment | 2 | 2 | 2 | 0 | 2 | 0 | 2 | 67% (Medium) |

## Recommendations

1. **GDPR:** 8 service(s) process personal data. Ensure DPAs are in place, lawful basis is documented, and DSAR handling procedures are established.
2. **CCPA:** 6 service(s) process consumer information. Ensure "Do Not Sell" mechanisms are implemented and privacy notice is updated.
3. **EU AI Act:** 1 AI service(s) detected. Classify risk level, implement transparency requirements, and document human oversight measures.
4. **PCI DSS:** 2 payment service(s) detected. Verify PCI compliance of payment processors and minimize cardholder data exposure.
5. **SOC 2:** Review Trust Service Criteria (Security, Availability, Processing Integrity, Confidentiality, Privacy) against all applicable services.

---

*This regulatory mapping matrix was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **nextjs-saas-example** codebase. Applicability assessments are based on service categories and detected data types. Consult legal counsel to confirm regulatory obligations for your specific jurisdiction and use case.*
