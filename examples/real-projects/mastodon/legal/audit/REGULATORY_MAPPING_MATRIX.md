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
| devise | auth | YES | YES | — | — | — | YES |
| ioredis | database | YES | — | — | — | ? | YES |
| omniauth | auth | YES | YES | — | — | — | YES |
| pg | database | YES | — | — | — | ? | YES |
| PostgreSQL | database | YES | — | — | — | ? | YES |
| PostgreSQL (env) | database | YES | — | — | — | ? | YES |
| pundit | auth | YES | YES | — | — | — | YES |
| rack-attack | other | YES | YES | — | — | — | — |
| rails-actionmailer | email | YES | YES | — | — | — | YES |
| rails-activerecord | database | YES | — | — | — | ? | YES |
| rails-sessions | auth | YES | YES | — | — | — | YES |
| redis | database | YES | — | — | — | ? | YES |
| Redis | database | YES | — | — | — | ? | YES |
| sidekiq | other | YES | — | — | — | — | — |
| ws (WebSocket) | other | YES | YES | — | — | — | — |

## Regulation Coverage Summary

| Regulation | Services Affected | Coverage % | Priority |
|-----------|------------------|-----------|----------|
| GDPR | 22/22 | 100% | High |
| CCPA | 9/22 | 41% | Medium |
| EU AI Act | 0/22 | 0% | Low |
| PCI DSS | 0/22 | 0% | Low |
| HIPAA | 0/22 (+11 pending) | 0% | Low |
| SOC 2 | 17/22 | 77% | High |

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
| devise | Processes personal data |
| ioredis | May store personal data |
| omniauth | Processes personal data |
| pg | Processes personal data |
| PostgreSQL | Processes personal data |
| PostgreSQL (env) | Processes personal data |
| pundit | Processes personal data |
| rack-attack | Processes personal data |
| rails-actionmailer | Processes personal data |
| rails-activerecord | Processes personal data |
| rails-sessions | Processes personal data |
| redis | May store personal data |
| Redis | May store personal data |
| sidekiq | Processes personal data |
| ws (WebSocket) | Processes personal data |

### CCPA

**Applicable services:**

| Service | Reason |
|---------|--------|
| ActionCable | Processes California consumer personal information |
| ActionMailer | Processes consumer contact information |
| devise | Collects consumer identity information |
| omniauth | Collects consumer identity information |
| pundit | Collects consumer identity information |
| rack-attack | Processes California consumer personal information |
| rails-actionmailer | Processes consumer contact information |
| rails-sessions | Collects consumer identity information |
| ws (WebSocket) | Processes California consumer personal information |

### EU AI Act

No services identified as subject to EU AI Act requirements.

### PCI DSS

No services identified as subject to PCI DSS requirements.

### HIPAA

**Requires manual assessment:**

| Service | Reason |
|---------|--------|
| Active Storage | May apply if storing PHI — requires manual assessment |
| ActiveRecord | May apply if storing PHI — requires manual assessment |
| ActiveStorage | May apply if storing PHI — requires manual assessment |
| aws-sdk-s3 | May apply if storing PHI — requires manual assessment |
| ioredis | May apply if storing PHI — requires manual assessment |
| pg | May apply if storing PHI — requires manual assessment |
| PostgreSQL | May apply if storing PHI — requires manual assessment |
| PostgreSQL (env) | May apply if storing PHI — requires manual assessment |
| rails-activerecord | May apply if storing PHI — requires manual assessment |
| redis | May apply if storing PHI — requires manual assessment |
| Redis | May apply if storing PHI — requires manual assessment |

### SOC 2

**Applicable services:**

| Service | Reason |
|---------|--------|
| ActionMailer | email service relevant to SOC 2 Trust Service Criteria |
| Active Storage | storage service relevant to SOC 2 Trust Service Criteria |
| ActiveRecord | database service relevant to SOC 2 Trust Service Criteria |
| ActiveStorage | storage service relevant to SOC 2 Trust Service Criteria |
| aws-sdk-s3 | storage service relevant to SOC 2 Trust Service Criteria |
| devise | auth service relevant to SOC 2 Trust Service Criteria |
| ioredis | database service relevant to SOC 2 Trust Service Criteria |
| omniauth | auth service relevant to SOC 2 Trust Service Criteria |
| pg | database service relevant to SOC 2 Trust Service Criteria |
| PostgreSQL | database service relevant to SOC 2 Trust Service Criteria |
| PostgreSQL (env) | database service relevant to SOC 2 Trust Service Criteria |
| pundit | auth service relevant to SOC 2 Trust Service Criteria |
| rails-actionmailer | email service relevant to SOC 2 Trust Service Criteria |
| rails-activerecord | database service relevant to SOC 2 Trust Service Criteria |
| rails-sessions | auth service relevant to SOC 2 Trust Service Criteria |
| redis | database service relevant to SOC 2 Trust Service Criteria |
| Redis | database service relevant to SOC 2 Trust Service Criteria |

## Category Heatmap

Regulatory exposure by service category:

| Category | # Services | GDPR | CCPA | AI Act | PCI | HIPAA | SOC 2 | Regulatory Exposure |
|----------|-----------|------|------|--------|-----|-------|-------|-------------------|
| other | 5 | 5 | 3 | 0 | 0 | 0 | 0 | 27% (Low) |
| email | 2 | 2 | 2 | 0 | 0 | 0 | 2 | 50% (Medium) |
| storage | 3 | 3 | 0 | 0 | 0 | 0 | 3 | 33% (Low) |
| database | 8 | 8 | 0 | 0 | 0 | 0 | 8 | 33% (Low) |
| auth | 4 | 4 | 4 | 0 | 0 | 0 | 4 | 50% (Medium) |

## Recommendations

1. **GDPR:** 22 service(s) process personal data. Ensure DPAs are in place, lawful basis is documented, and DSAR handling procedures are established.
2. **CCPA:** 9 service(s) process consumer information. Ensure "Do Not Sell" mechanisms are implemented and privacy notice is updated.
3. **SOC 2:** Review Trust Service Criteria (Security, Availability, Processing Integrity, Confidentiality, Privacy) against all applicable services.

---

*This regulatory mapping matrix was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **@mastodon/mastodon** codebase. Applicability assessments are based on service categories and detected data types. Consult legal counsel to confirm regulatory obligations for your specific jurisdiction and use case.*
