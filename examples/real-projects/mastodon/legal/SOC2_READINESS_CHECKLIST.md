# SOC 2 Type II Readiness Checklist

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** @mastodon/mastodon

**Organization:** [Your Company Name]

**Contact:** [your-email@example.com]

## Related Documents

- Security Policy (`SECURITY.md`)
- Access Control Policy (`ACCESS_CONTROL_POLICY.md`)
- Change Management Policy (`CHANGE_MANAGEMENT_POLICY.md`)
- Audit Log Policy (`AUDIT_LOG_POLICY.md`)

---

> **Disclaimer:** This checklist is generated based on automated code analysis and is intended as a starting point for SOC 2 Type II readiness. It is not a substitute for a formal SOC 2 audit or professional guidance. Engage a qualified CPA firm for your official SOC 2 examination.

## 1. Overview

This checklist helps [Your Company Name] prepare for a SOC 2 Type II audit by mapping detected services and infrastructure to the five Trust Services Criteria (TSC). Each section contains actionable items tailored to your project's technology stack.

**Detected services:** 22
**Relevant SOC 2 sections:** Confidentiality (C1), Privacy (P1-P8), Security (CC6), Availability (A1)

---

## 2. Service-to-Control Mapping

The following table maps each detected service to the applicable SOC 2 Trust Services Criteria:

| Detected Service | Category | Mapped SOC 2 Controls |
|-----------------|----------|----------------------|
| ActionCable | Other | General |
| ActionController::Cookies | Other | General |
| ActionMailer | Email Service | Confidentiality (C1), Privacy (P1-P8) |
| Active Storage | File Storage | Confidentiality (C1), Security (CC6) |
| ActiveRecord | Database | Confidentiality (C1), Security (CC6) |
| ActiveStorage | File Storage | Confidentiality (C1), Security (CC6) |
| aws-sdk-s3 | File Storage | Confidentiality (C1), Security (CC6) |
| devise | Authentication | Security (CC6) |
| ioredis | Database | Confidentiality (C1), Security (CC6) |
| omniauth | Authentication | Security (CC6) |
| pg | Database | Confidentiality (C1), Security (CC6) |
| PostgreSQL | Database | Confidentiality (C1), Security (CC6) |
| PostgreSQL (env) | Database | Confidentiality (C1), Security (CC6) |
| pundit | Authentication | Security (CC6) |
| rack-attack | Other | General |
| rails-actionmailer | Email Service | Confidentiality (C1), Privacy (P1-P8) |
| rails-activerecord | Database | Confidentiality (C1), Security (CC6) |
| rails-sessions | Authentication | Security (CC6) |
| redis | Database | Confidentiality (C1), Security (CC6) |
| Redis | Database | Confidentiality (C1), Security (CC6) |
| sidekiq | Other | General |
| ws (WebSocket) | Other | General |

---

## 3. Readiness Checklist
### Security (CC6) — Common Criteria for Security

**Objective:** Information and systems are protected against unauthorized access, unauthorized disclosure of information, and damage to systems.

#### CC6.1 — Logical and Physical Access Controls

- [ ] Implement role-based access control (RBAC) for all systems
- [ ] Review access control configuration for: devise, omniauth, pundit, rails-sessions
- [ ] Enforce multi-factor authentication (MFA) for all user accounts
- [ ] Implement session timeout and automatic logout policies
- [ ] Document authentication flows and access provisioning/deprovisioning procedures
- [ ] Maintain an access control matrix documenting who has access to what
- [ ] Review and recertify user access quarterly
- [ ] Log all access events and authentication attempts

#### CC6.6 — Encryption

- [ ] Enforce TLS 1.2+ for all data in transit
- [ ] Enable encryption at rest for: ActiveRecord, ioredis, pg, PostgreSQL, PostgreSQL (env), rails-activerecord, redis, Redis
- [ ] Enable encryption at rest for file storage: Active Storage, ActiveStorage, aws-sdk-s3
- [ ] Document encryption standards and key management procedures
- [ ] Rotate encryption keys on a defined schedule

#### CC6.8 — Vulnerability Management

- [ ] Run automated dependency vulnerability scanning (e.g., npm audit, Snyk, Dependabot)
- [ ] Conduct periodic penetration testing (at least annually)
- [ ] Maintain a vulnerability remediation SLA (critical: 24h, high: 7d, medium: 30d, low: 90d)
- [ ] Document and track all identified vulnerabilities to resolution

---

### Availability (A1) — Availability for Operations

**Objective:** The system is available for operation and use as committed or agreed.

#### A1.1 — Uptime Monitoring and SLA

- [ ] Implement application monitoring and alerting (e.g., Sentry, Datadog, PagerDuty)
- [ ] Define uptime SLA targets (e.g., 99.9% availability)
- [ ] Set up real-time health check endpoints

#### A1.2 — Disaster Recovery and Business Continuity

- [ ] Document a Disaster Recovery Plan (DRP) with defined RTO and RPO
- [ ] Test disaster recovery procedures at least annually
- [ ] Maintain automated backups with documented retention schedule
- [ ] Define and test failover procedures for critical systems
- [ ] Document business continuity procedures for extended outages
- [ ] Maintain an up-to-date system architecture diagram

#### A1.3 — Capacity Planning

- [ ] Monitor resource utilization (CPU, memory, storage, network)
- [ ] Set capacity threshold alerts (e.g., 80% utilization triggers review)
- [ ] Document scaling procedures (horizontal and vertical)
- [ ] Review capacity plans quarterly

---

### Confidentiality (C1) — Protection of Confidential Information

**Objective:** Information designated as confidential is protected as committed or agreed.

#### C1.1 — Data Classification

- [ ] Define a data classification policy (Public, Internal, Confidential, Restricted)
- [ ] Classify all data stores and label them according to policy
- [ ] Train employees on data handling procedures for each classification level
- [ ] Review data classifications annually or when new data types are introduced

#### C1.2 — Encryption at Rest

- [ ] Enable transparent data encryption (TDE) or equivalent for: ActiveRecord, ioredis, pg, PostgreSQL, PostgreSQL (env), rails-activerecord, redis, Redis
- [ ] Enable server-side encryption for: Active Storage, ActiveStorage, aws-sdk-s3
- [ ] Encrypt all backups at rest
- [ ] Document which encryption algorithms and key lengths are in use
- [ ] Store encryption keys in a dedicated key management service (KMS)

#### C1.3 — Encryption in Transit

- [ ] Enforce HTTPS/TLS for all external communications
- [ ] Use TLS for internal service-to-service communication where feasible
- [ ] Disable deprecated TLS versions (TLS 1.0, 1.1)
- [ ] Monitor certificate expiration and automate renewal

---

### Privacy (P1-P8) — Personal Information Protection

**Objective:** Personal information is collected, used, retained, disclosed, and disposed of in conformity with commitments and criteria.

#### P1 — Notice

- [ ] Publish a clear and accessible Privacy Policy
- [ ] Notify users of data collection purposes before or at the time of collection
- [ ] Describe the types of personal information collected and reasons for collection

#### P2 — Choice and Consent

- [ ] Obtain explicit consent before collecting personal information
- [ ] Provide opt-out mechanisms for non-essential data processing
- [ ] Maintain consent records with timestamps

#### P3 — Collection

- [ ] Collect only the minimum personal information necessary (data minimization)
- [ ] Document the legal basis for each category of personal data collected
- [ ] Maintain a Record of Processing Activities (ROPA)

#### P4 — Use, Retention, and Disposal

- [ ] Use personal information only for the purposes disclosed in the privacy notice
- [ ] Define and enforce data retention periods per data category
- [ ] Implement automated data purge processes for expired retention periods
- [ ] Document data disposal procedures (secure deletion, anonymization)

#### P5 — Access

- [ ] Provide individuals with the ability to access their personal information
- [ ] Implement a self-service data export feature (e.g., account data download)
- [ ] Respond to data subject access requests (DSARs) within regulatory timeframes

#### P6 — Disclosure and Sharing

- [ ] Document all third-party sub-processors and data sharing arrangements
- [ ] Execute Data Processing Agreements (DPAs) with all sub-processors
- [ ] Notify individuals of material changes to data sharing practices

#### P7 — Data Quality

- [ ] Provide mechanisms for individuals to update or correct their personal information
- [ ] Validate personal data accuracy at the point of collection
- [ ] Periodically review stored personal data for accuracy

#### P8 — Monitoring and Enforcement

- [ ] Conduct periodic privacy impact assessments (PIAs)
- [ ] Monitor for unauthorized access to personal information
- [ ] Maintain a privacy incident response procedure
- [ ] Train employees on privacy obligations and data handling procedures
- [ ] Appoint a privacy owner or Data Protection Officer (DPO)

---

## 4. Recommended Audit Timeline

| Phase | Duration | Activities |
|-------|----------|-----------|
| **Gap Assessment** | 2-4 weeks | Identify gaps between current state and SOC 2 requirements |
| **Remediation** | 4-12 weeks | Implement missing controls and document procedures |
| **Evidence Collection** | Ongoing (6-12 months) | Collect evidence of controls operating effectively over the audit period |
| **Readiness Assessment** | 2-4 weeks | Internal review to verify all controls are in place and operating |
| **Type II Audit** | 4-8 weeks | External auditor examines controls over a minimum 6-month observation period |
| **Report Issuance** | 2-4 weeks | CPA firm issues the SOC 2 Type II report |

---

## 5. Evidence Collection Guide

For each control area, collect and maintain the following evidence artifacts for your SOC 2 Type II audit:

### Security (CC6)
| Evidence Artifact | Description | Frequency |
|------------------|-------------|-----------|
| Access control matrix | Document of who has access to each system | Quarterly review |
| MFA enrollment report | Proof that MFA is enabled for all users | Monthly snapshot |
| Penetration test report | Results from external penetration testing | Annually |
| Vulnerability scan results | Automated scan output showing remediation | Monthly |
| Encryption configuration | Screenshots/configs showing encryption settings | On change |
| Access review records | Logs of quarterly access recertification | Quarterly |

### Availability (A1)
| Evidence Artifact | Description | Frequency |
|------------------|-------------|-----------|
| Uptime reports | SLA monitoring dashboard exports | Monthly |
| Incident post-mortems | Root cause analysis for each outage | Per incident |
| DR test results | Documentation of disaster recovery tests | Annually |
| Backup verification logs | Proof that backups complete and are restorable | Monthly |
| Capacity planning reviews | Resource utilization reports and forecasts | Quarterly |

### Processing Integrity (PI1)
| Evidence Artifact | Description | Frequency |
|------------------|-------------|-----------|
| CI/CD pipeline configs | Build and deployment pipeline definitions | On change |
| Code review records | Pull request approvals and review comments | Per change |
| Test coverage reports | Automated test results and coverage metrics | Per build |
| Change management log | Record of all production changes | Continuous |
| Error rate dashboards | Application error monitoring summaries | Monthly |

### Confidentiality (C1)
| Evidence Artifact | Description | Frequency |
|------------------|-------------|-----------|
| Data classification inventory | Catalog of data stores with classifications | Annually |
| Encryption audit | Verification of encryption at rest and in transit | Quarterly |
| Key management procedures | Documentation of key rotation and storage | On change |
| DPA agreements | Signed Data Processing Agreements with vendors | On onboarding |
| PCI SAQ (if applicable) | Completed PCI Self-Assessment Questionnaire | Annually |

### Privacy (P1-P8)
| Evidence Artifact | Description | Frequency |
|------------------|-------------|-----------|
| Privacy Policy | Published privacy notice | On change |
| Consent records | Logs of user consent with timestamps | Continuous |
| ROPA | Record of Processing Activities | Annually |
| DSAR response logs | Records of data subject access requests handled | Per request |
| Privacy impact assessments | PIA reports for new features or changes | Per project |
| Employee training records | Proof of privacy training completion | Annually |

---

## 6. Next Steps

1. **Assign an owner** for each control area listed above.
2. **Conduct a gap assessment** comparing your current controls to this checklist.
3. **Prioritize remediation** starting with Security (CC6) and Availability (A1).
4. **Begin evidence collection** immediately — SOC 2 Type II requires evidence over a 6-12 month observation period.
5. **Engage an auditor** early to align on scope and expectations.

---

*This SOC 2 Readiness Checklist was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. It should be reviewed by a qualified professional before use in audit preparation.*