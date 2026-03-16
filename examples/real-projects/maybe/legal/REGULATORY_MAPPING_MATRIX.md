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
| ActionCable | other | YES | YES | — | — | — | — |
| ActionController::Cookies | other | YES | — | — | — | — | — |
| ActionMailer | email | YES | YES | — | — | — | YES |
| Active Storage | storage | YES | — | — | — | ? | YES |
| ActiveRecord | database | YES | — | — | — | ? | YES |
| ActiveStorage | storage | YES | — | — | — | ? | YES |
| aws-sdk-s3 | storage | YES | — | — | — | ? | YES |
| intercom-ruby | other | YES | YES | — | — | — | — |
| nodemailer | email | YES | YES | — | — | — | YES |
| pg | database | YES | — | — | — | ? | YES |
| plaid | payment | YES | YES | — | YES | — | YES |
| rack-attack | other | YES | YES | — | — | — | — |
| rails-actionmailer | email | YES | YES | — | — | — | YES |
| rails-activerecord | database | YES | — | — | — | ? | YES |
| rails-sessions | auth | YES | YES | — | — | — | YES |
| redis | database | YES | — | — | — | ? | YES |
| ruby-openai | ai | YES | — | YES | — | — | YES |
| sentry-ruby | monitoring | YES | YES | — | — | — | YES |
| sidekiq | other | YES | — | — | — | — | — |
| stripe | payment | YES | YES | — | YES | — | YES |

## Regulation Coverage Summary

| Regulation | Services Affected | Coverage % | Priority |
|-----------|------------------|-----------|----------|
| GDPR | 20/20 | 100% | High |
| CCPA | 10/20 | 50% | Medium |
| EU AI Act | 1/20 | 5% | Medium |
| PCI DSS | 2/20 | 10% | Medium |
| HIPAA | 0/20 (+7 pending) | 0% | Low |
| SOC 2 | 15/20 | 75% | High |

## Detailed Assessment by Regulation

### GDPR

**Applicable services:**

| Service | Reason |
|---------|--------|
| ActionCable | Processes personal data |
| ActionController::Cookies | Processes personal data |
| ActionMailer | Processes personal data |
| Active Storage | Processes personal data |
| ActiveRecord | Processes personal data |
| ActiveStorage | Processes personal data |
| aws-sdk-s3 | May store personal data |
| intercom-ruby | Processes personal data |
| nodemailer | Processes personal data |
| pg | Processes personal data |
| plaid | Processes personal data |
| rack-attack | Processes personal data |
| rails-actionmailer | Processes personal data |
| rails-activerecord | Processes personal data |
| rails-sessions | Processes personal data |
| redis | May store personal data |
| ruby-openai | Processes personal data |
| sentry-ruby | Processes personal data |
| sidekiq | Processes personal data |
| stripe | Processes personal data |

### CCPA

**Applicable services:**

| Service | Reason |
|---------|--------|
| ActionCable | Processes California consumer personal information |
| ActionMailer | Processes consumer contact information |
| intercom-ruby | Processes California consumer personal information |
| nodemailer | Processes consumer contact information |
| plaid | Processes California consumer personal information |
| rack-attack | Processes California consumer personal information |
| rails-actionmailer | Processes consumer contact information |
| rails-sessions | Collects consumer identity information |
| sentry-ruby | Processes California consumer personal information |
| stripe | Processes California consumer personal information |

### EU AI Act

**Applicable services:**

| Service | Reason |
|---------|--------|
| ruby-openai | AI/ML service — subject to EU AI Act requirements |

### PCI DSS

**Applicable services:**

| Service | Reason |
|---------|--------|
| plaid | Payment processing — PCI DSS applies |
| stripe | Payment processing — PCI DSS applies |

### HIPAA

**Requires manual assessment:**

| Service | Reason |
|---------|--------|
| Active Storage | May apply if storing PHI — requires manual assessment |
| ActiveRecord | May apply if storing PHI — requires manual assessment |
| ActiveStorage | May apply if storing PHI — requires manual assessment |
| aws-sdk-s3 | May apply if storing PHI — requires manual assessment |
| pg | May apply if storing PHI — requires manual assessment |
| rails-activerecord | May apply if storing PHI — requires manual assessment |
| redis | May apply if storing PHI — requires manual assessment |

### SOC 2

**Applicable services:**

| Service | Reason |
|---------|--------|
| ActionMailer | email service relevant to SOC 2 Trust Service Criteria |
| Active Storage | storage service relevant to SOC 2 Trust Service Criteria |
| ActiveRecord | database service relevant to SOC 2 Trust Service Criteria |
| ActiveStorage | storage service relevant to SOC 2 Trust Service Criteria |
| aws-sdk-s3 | storage service relevant to SOC 2 Trust Service Criteria |
| nodemailer | email service relevant to SOC 2 Trust Service Criteria |
| pg | database service relevant to SOC 2 Trust Service Criteria |
| plaid | Payment service — relevant to SOC 2 confidentiality criteria |
| rails-actionmailer | email service relevant to SOC 2 Trust Service Criteria |
| rails-activerecord | database service relevant to SOC 2 Trust Service Criteria |
| rails-sessions | auth service relevant to SOC 2 Trust Service Criteria |
| redis | database service relevant to SOC 2 Trust Service Criteria |
| ruby-openai | AI service — relevant to SOC 2 processing integrity criteria |
| sentry-ruby | monitoring service relevant to SOC 2 Trust Service Criteria |
| stripe | Payment service — relevant to SOC 2 confidentiality criteria |

## Category Heatmap

Regulatory exposure by service category:

| Category | # Services | GDPR | CCPA | AI Act | PCI | HIPAA | SOC 2 | Regulatory Exposure |
|----------|-----------|------|------|--------|-----|-------|-------|-------------------|
| other | 5 | 5 | 3 | 0 | 0 | 0 | 0 | 27% (Low) |
| email | 3 | 3 | 3 | 0 | 0 | 0 | 3 | 50% (Medium) |
| storage | 3 | 3 | 0 | 0 | 0 | 0 | 3 | 33% (Low) |
| database | 4 | 4 | 0 | 0 | 0 | 0 | 4 | 33% (Low) |
| payment | 2 | 2 | 2 | 0 | 2 | 0 | 2 | 67% (Medium) |
| auth | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 50% (Medium) |
| ai | 1 | 1 | 0 | 1 | 0 | 0 | 1 | 50% (Medium) |
| monitoring | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 50% (Medium) |

## Recommendations

1. **GDPR:** 20 service(s) process personal data. Ensure DPAs are in place, lawful basis is documented, and DSAR handling procedures are established.
2. **CCPA:** 10 service(s) process consumer information. Ensure "Do Not Sell" mechanisms are implemented and privacy notice is updated.
3. **EU AI Act:** 1 AI service(s) detected. Classify risk level, implement transparency requirements, and document human oversight measures.
4. **PCI DSS:** 2 payment service(s) detected. Verify PCI compliance of payment processors and minimize cardholder data exposure.
5. **SOC 2:** Review Trust Service Criteria (Security, Availability, Processing Integrity, Confidentiality, Privacy) against all applicable services.

---

*This regulatory mapping matrix was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **maybe** codebase. Applicability assessments are based on service categories and detected data types. Consult legal counsel to confirm regulatory obligations for your specific jurisdiction and use case.*
