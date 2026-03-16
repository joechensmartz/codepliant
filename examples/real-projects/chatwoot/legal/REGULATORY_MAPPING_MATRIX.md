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
| @amplitude/analytics-browser | analytics | YES | YES | — | — | — | YES |
| @aws-sdk/client-s3 | storage | YES | — | — | — | ? | YES |
| @twilio/voice-sdk | other | YES | YES | — | — | — | — |
| ActionCable | other | YES | YES | — | — | — | — |
| ActionController::Cookies | other | YES | — | — | — | — | — |
| ActionMailer | email | YES | YES | — | — | — | YES |
| Active Storage | storage | YES | — | — | — | ? | YES |
| ActiveRecord | database | YES | — | — | — | ? | YES |
| ActiveStorage | storage | YES | — | — | — | ? | YES |
| aws-sdk-s3 | storage | YES | — | — | — | ? | YES |
| devise | auth | YES | YES | — | — | — | YES |
| google-cloud-storage | storage | YES | — | — | — | ? | YES |
| ioredis | database | YES | — | — | — | ? | YES |
| MailHog | email | YES | YES | — | — | — | YES |
| Meta Pixel | advertising | YES | YES | — | — | — | YES |
| nodemailer | email | YES | YES | — | — | — | YES |
| omniauth | auth | YES | YES | — | — | — | YES |
| pg | database | YES | — | — | — | ? | YES |
| PostgreSQL (env) | database | YES | — | — | — | ? | YES |
| pundit | auth | YES | YES | — | — | — | YES |
| rack-attack | other | YES | YES | — | — | — | — |
| rails-actionmailer | email | YES | YES | — | — | — | YES |
| rails-activerecord | database | YES | — | — | — | ? | YES |
| rails-sessions | auth | YES | YES | — | — | — | YES |
| redis | database | YES | — | — | — | ? | YES |
| Redis | database | YES | — | — | — | ? | YES |
| Redis (env) | database | YES | — | — | — | ? | YES |
| ruby-openai | ai | YES | — | YES | — | — | YES |
| sentry-ruby | monitoring | YES | YES | — | — | — | YES |
| sidekiq | other | YES | — | — | — | — | — |
| stripe | payment | YES | YES | — | YES | — | YES |
| twilio-ruby | other | YES | YES | — | — | — | — |

## Regulation Coverage Summary

| Regulation | Services Affected | Coverage % | Priority |
|-----------|------------------|-----------|----------|
| GDPR | 32/32 | 100% | High |
| CCPA | 16/32 | 50% | Medium |
| EU AI Act | 1/32 | 3% | Medium |
| PCI DSS | 1/32 | 3% | Medium |
| HIPAA | 0/32 (+13 pending) | 0% | Low |
| SOC 2 | 26/32 | 81% | High |

## Detailed Assessment by Regulation

### GDPR

**Applicable services:**

| Service | Reason |
|---------|--------|
| @amplitude/analytics-browser | Processes personal data |
| @aws-sdk/client-s3 | May store personal data |
| @twilio/voice-sdk | Processes personal data |
| ActionCable | Processes personal data |
| ActionController::Cookies | Processes personal data |
| ActionMailer | Processes personal data |
| Active Storage | Processes personal data |
| ActiveRecord | Processes personal data |
| ActiveStorage | Processes personal data |
| aws-sdk-s3 | May store personal data |
| devise | Processes personal data |
| google-cloud-storage | May store personal data |
| ioredis | May store personal data |
| MailHog | Processes personal data |
| Meta Pixel | Processes personal data |
| nodemailer | Processes personal data |
| omniauth | Processes personal data |
| pg | Processes personal data |
| PostgreSQL (env) | Processes personal data |
| pundit | Processes personal data |
| rack-attack | Processes personal data |
| rails-actionmailer | Processes personal data |
| rails-activerecord | Processes personal data |
| rails-sessions | Processes personal data |
| redis | May store personal data |
| Redis | May store personal data |
| Redis (env) | May store personal data |
| ruby-openai | Processes personal data |
| sentry-ruby | Processes personal data |
| sidekiq | Processes personal data |
| stripe | Processes personal data |
| twilio-ruby | Processes personal data |

### CCPA

**Applicable services:**

| Service | Reason |
|---------|--------|
| @amplitude/analytics-browser | Collects/shares consumer information for commercial purposes |
| @twilio/voice-sdk | Processes California consumer personal information |
| ActionCable | Processes California consumer personal information |
| ActionMailer | Processes consumer contact information |
| devise | Collects consumer identity information |
| MailHog | Processes consumer contact information |
| Meta Pixel | Collects/shares consumer information for commercial purposes |
| nodemailer | Processes consumer contact information |
| omniauth | Collects consumer identity information |
| pundit | Collects consumer identity information |
| rack-attack | Processes California consumer personal information |
| rails-actionmailer | Processes consumer contact information |
| rails-sessions | Collects consumer identity information |
| sentry-ruby | Processes California consumer personal information |
| stripe | Processes California consumer personal information |
| twilio-ruby | Processes California consumer personal information |

### EU AI Act

**Applicable services:**

| Service | Reason |
|---------|--------|
| ruby-openai | AI/ML service — subject to EU AI Act requirements |

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
| Active Storage | May apply if storing PHI — requires manual assessment |
| ActiveRecord | May apply if storing PHI — requires manual assessment |
| ActiveStorage | May apply if storing PHI — requires manual assessment |
| aws-sdk-s3 | May apply if storing PHI — requires manual assessment |
| google-cloud-storage | May apply if storing PHI — requires manual assessment |
| ioredis | May apply if storing PHI — requires manual assessment |
| pg | May apply if storing PHI — requires manual assessment |
| PostgreSQL (env) | May apply if storing PHI — requires manual assessment |
| rails-activerecord | May apply if storing PHI — requires manual assessment |
| redis | May apply if storing PHI — requires manual assessment |
| Redis | May apply if storing PHI — requires manual assessment |
| Redis (env) | May apply if storing PHI — requires manual assessment |

### SOC 2

**Applicable services:**

| Service | Reason |
|---------|--------|
| @amplitude/analytics-browser | Processes customer data — relevant to SOC 2 privacy criteria |
| @aws-sdk/client-s3 | storage service relevant to SOC 2 Trust Service Criteria |
| ActionMailer | email service relevant to SOC 2 Trust Service Criteria |
| Active Storage | storage service relevant to SOC 2 Trust Service Criteria |
| ActiveRecord | database service relevant to SOC 2 Trust Service Criteria |
| ActiveStorage | storage service relevant to SOC 2 Trust Service Criteria |
| aws-sdk-s3 | storage service relevant to SOC 2 Trust Service Criteria |
| devise | auth service relevant to SOC 2 Trust Service Criteria |
| google-cloud-storage | storage service relevant to SOC 2 Trust Service Criteria |
| ioredis | database service relevant to SOC 2 Trust Service Criteria |
| MailHog | email service relevant to SOC 2 Trust Service Criteria |
| Meta Pixel | Processes customer data — relevant to SOC 2 privacy criteria |
| nodemailer | email service relevant to SOC 2 Trust Service Criteria |
| omniauth | auth service relevant to SOC 2 Trust Service Criteria |
| pg | database service relevant to SOC 2 Trust Service Criteria |
| PostgreSQL (env) | database service relevant to SOC 2 Trust Service Criteria |
| pundit | auth service relevant to SOC 2 Trust Service Criteria |
| rails-actionmailer | email service relevant to SOC 2 Trust Service Criteria |
| rails-activerecord | database service relevant to SOC 2 Trust Service Criteria |
| rails-sessions | auth service relevant to SOC 2 Trust Service Criteria |
| redis | database service relevant to SOC 2 Trust Service Criteria |
| Redis | database service relevant to SOC 2 Trust Service Criteria |
| Redis (env) | database service relevant to SOC 2 Trust Service Criteria |
| ruby-openai | AI service — relevant to SOC 2 processing integrity criteria |
| sentry-ruby | monitoring service relevant to SOC 2 Trust Service Criteria |
| stripe | Payment service — relevant to SOC 2 confidentiality criteria |

## Category Heatmap

Regulatory exposure by service category:

| Category | # Services | GDPR | CCPA | AI Act | PCI | HIPAA | SOC 2 | Regulatory Exposure |
|----------|-----------|------|------|--------|-----|-------|-------|-------------------|
| analytics | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 50% (Medium) |
| storage | 5 | 5 | 0 | 0 | 0 | 0 | 5 | 33% (Low) |
| other | 6 | 6 | 4 | 0 | 0 | 0 | 0 | 28% (Low) |
| email | 4 | 4 | 4 | 0 | 0 | 0 | 4 | 50% (Medium) |
| database | 8 | 8 | 0 | 0 | 0 | 0 | 8 | 33% (Low) |
| auth | 4 | 4 | 4 | 0 | 0 | 0 | 4 | 50% (Medium) |
| advertising | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 50% (Medium) |
| ai | 1 | 1 | 0 | 1 | 0 | 0 | 1 | 50% (Medium) |
| monitoring | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 50% (Medium) |
| payment | 1 | 1 | 1 | 0 | 1 | 0 | 1 | 67% (Medium) |

## Recommendations

1. **GDPR:** 32 service(s) process personal data. Ensure DPAs are in place, lawful basis is documented, and DSAR handling procedures are established.
2. **CCPA:** 16 service(s) process consumer information. Ensure "Do Not Sell" mechanisms are implemented and privacy notice is updated.
3. **EU AI Act:** 1 AI service(s) detected. Classify risk level, implement transparency requirements, and document human oversight measures.
4. **PCI DSS:** 1 payment service(s) detected. Verify PCI compliance of payment processors and minimize cardholder data exposure.
5. **SOC 2:** Review Trust Service Criteria (Security, Availability, Processing Integrity, Confidentiality, Privacy) against all applicable services.

---

*This regulatory mapping matrix was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **@chatwoot/chatwoot** codebase. Applicability assessments are based on service categories and detected data types. Consult legal counsel to confirm regulatory obligations for your specific jurisdiction and use case.*
