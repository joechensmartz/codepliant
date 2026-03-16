# ISO 27001 Compliance Checklist

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** @chatwoot/chatwoot

**Organization:** [Your Company Name]

**Contact:** [your-email@example.com]

## Related Documents

- Information Security Policy (`INFORMATION_SECURITY_POLICY.md`)
- Risk Register (`RISK_REGISTER.md`)
- Access Control Policy (`ACCESS_CONTROL_POLICY.md`)

---

> **Disclaimer:** This checklist is generated based on automated code analysis and is intended as a starting point for ISO 27001 compliance. It is not a substitute for a formal ISO 27001 certification audit or professional guidance. Engage a qualified certification body for your official assessment.

## 1. Overview

This checklist helps [Your Company Name] prepare for ISO 27001 certification by mapping detected services and infrastructure to the Annex A controls defined in ISO/IEC 27001:2022. Each section contains actionable items tailored to your project's technology stack.

ISO 27001 requires an Information Security Management System (ISMS) that addresses risks through a combination of organizational, people, physical, and technological controls.

**Detected services:** 32
**Applicable Annex A domains:** Organizational Controls (A.5), Technological Controls (A.8), People Controls (A.6), Physical Controls (A.7)

---

## 2. Service-to-Control Mapping

The following table maps each detected service to the applicable ISO 27001 Annex A control domains:

| Detected Service | Category | Applicable Annex A Domains |
|-----------------|----------|---------------------------|
| @amplitude/analytics-browser | Analytics | Organizational Controls (A.5), Technological Controls (A.8) |
| @aws-sdk/client-s3 | File Storage | Technological Controls (A.8), Organizational Controls (A.5) |
| @twilio/voice-sdk | Other | General |
| ActionCable | Other | General |
| ActionController::Cookies | Other | General |
| ActionMailer | Email Service | Organizational Controls (A.5), Technological Controls (A.8) |
| Active Storage | File Storage | Technological Controls (A.8), Organizational Controls (A.5) |
| ActiveRecord | Database | Technological Controls (A.8), Organizational Controls (A.5) |
| ActiveStorage | File Storage | Technological Controls (A.8), Organizational Controls (A.5) |
| aws-sdk-s3 | File Storage | Technological Controls (A.8), Organizational Controls (A.5) |
| devise | Authentication | Organizational Controls (A.5), Technological Controls (A.8) |
| google-cloud-storage | File Storage | Technological Controls (A.8), Organizational Controls (A.5) |
| ioredis | Database | Technological Controls (A.8), Organizational Controls (A.5) |
| MailHog | Email Service | Organizational Controls (A.5), Technological Controls (A.8) |
| Meta Pixel | Advertising | Organizational Controls (A.5), Technological Controls (A.8) |
| nodemailer | Email Service | Organizational Controls (A.5), Technological Controls (A.8) |
| omniauth | Authentication | Organizational Controls (A.5), Technological Controls (A.8) |
| pg | Database | Technological Controls (A.8), Organizational Controls (A.5) |
| PostgreSQL (env) | Database | Technological Controls (A.8), Organizational Controls (A.5) |
| pundit | Authentication | Organizational Controls (A.5), Technological Controls (A.8) |
| rack-attack | Other | General |
| rails-actionmailer | Email Service | Organizational Controls (A.5), Technological Controls (A.8) |
| rails-activerecord | Database | Technological Controls (A.8), Organizational Controls (A.5) |
| rails-sessions | Authentication | Organizational Controls (A.5), Technological Controls (A.8) |
| redis | Database | Technological Controls (A.8), Organizational Controls (A.5) |
| Redis | Database | Technological Controls (A.8), Organizational Controls (A.5) |
| Redis (env) | Database | Technological Controls (A.8), Organizational Controls (A.5) |
| ruby-openai | AI Service | Organizational Controls (A.5), People Controls (A.6), Technological Controls (A.8) |
| sentry-ruby | Error Monitoring | Technological Controls (A.8), Organizational Controls (A.5) |
| sidekiq | Other | General |
| stripe | Payment Processing | Organizational Controls (A.5), Technological Controls (A.8) |
| twilio-ruby | Other | General |

---

## 3. Annex A Controls Checklist
### A.5 — Organizational Controls

**Objective:** Establish management direction and support for information security in accordance with business requirements and relevant laws and regulations.

#### A.5.1 — Policies for Information Security

- [ ] Establish an Information Security Management System (ISMS) policy
- [ ] Define and communicate the scope of the ISMS
- [ ] Obtain management commitment and sign-off
- [ ] Review information security policies at planned intervals (at least annually)

#### A.5.2 — Information Security Roles and Responsibilities

- [ ] Assign information security roles and responsibilities
- [ ] Appoint an Information Security Officer or equivalent
- [ ] Define segregation of duties for critical operations
- [ ] Document the organizational security structure

#### A.5.10 — Acceptable Use of Information and Assets

- [ ] Define acceptable use policies for information assets
- [ ] Communicate policies to all employees and contractors
- [ ] Include provisions for remote work and BYOD

#### A.5.12 — Classification of Information

- [ ] Define an information classification scheme (e.g., Public, Internal, Confidential, Restricted)
- [ ] Label all information assets according to the classification scheme
- [ ] Define handling procedures for each classification level

#### A.5.34 — Privacy and Protection of PII

*Data-collecting services detected: @amplitude/analytics-browser, ruby-openai*

- [ ] Conduct a Privacy Impact Assessment (PIA/DPIA) for personal data processing
- [ ] Maintain a Record of Processing Activities (ROPA)
- [ ] Define lawful bases for personal data processing
- [ ] Implement data subject rights procedures (access, rectification, erasure)

#### A.5.19 — Information Security in Supplier Relationships

*Payment services detected: stripe*

- [ ] Assess information security risks for all supplier relationships
- [ ] Include security requirements in supplier agreements
- [ ] Monitor and review supplier service delivery
- [ ] Maintain a supplier risk register

#### A.5.24 — Information Security Incident Management Planning

- [ ] Define an incident response plan with clear escalation procedures
- [ ] Assign incident response roles and responsibilities
- [ ] Conduct regular incident response drills
- [ ] Maintain an incident register with lessons learned

#### A.5.29 — Information Security During Disruption

- [ ] Develop a business continuity plan addressing information security
- [ ] Define Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO)
- [ ] Test business continuity plans at least annually

#### A.5.31 — Legal, Statutory, Regulatory, and Contractual Requirements

- [ ] Identify all applicable legal, regulatory, and contractual requirements
- [ ] Maintain a compliance register with obligation tracking
- [ ] Review compliance status at planned intervals

---

### A.6 — People Controls

**Objective:** Ensure that employees and contractors understand their responsibilities and are suitable for their roles.

#### A.6.1 — Screening

- [ ] Conduct background checks for all employees with access to sensitive systems
- [ ] Verify qualifications and references prior to employment
- [ ] Define screening requirements proportionate to classification of information accessed

#### A.6.2 — Terms and Conditions of Employment

- [ ] Include information security responsibilities in employment contracts
- [ ] Require non-disclosure agreements (NDAs) for employees and contractors
- [ ] Define acceptable use expectations in employment terms

#### A.6.3 — Information Security Awareness, Education, and Training

- [ ] Conduct security awareness training for all employees (at least annually)
- [ ] Provide role-specific security training for technical staff
- [ ] Track training completion and maintain records
- [ ] Include phishing awareness and social engineering exercises

#### A.6.4 — Disciplinary Process

- [ ] Define a disciplinary process for information security violations
- [ ] Communicate consequences of policy violations to all employees

#### A.6.5 — Responsibilities After Termination or Change of Employment

- [ ] Revoke access to all systems within 24 hours of termination
- [ ] Recover company assets (devices, badges, tokens) upon departure
- [ ] Remind departing employees of continuing confidentiality obligations

---

### A.7 — Physical Controls

**Objective:** Prevent unauthorized physical access, damage, and interference to the organization's information and information processing facilities.

#### A.7.1 — Physical Security Perimeters

- [ ] Define physical security perimeters for sensitive areas (server rooms, offices)
- [ ] Implement access control for secured areas (badge access, biometrics)
- [ ] Maintain visitor logs for all secured areas

#### A.7.2 — Physical Entry

- [ ] Restrict physical entry to authorized personnel only
- [ ] Monitor entry points with CCTV or equivalent
- [ ] Review physical access rights periodically

#### A.7.4 — Physical Security Monitoring

- [ ] Implement environmental monitoring (temperature, humidity, fire detection)
- [ ] Monitor for unauthorized physical access attempts
- [ ] Test physical security controls regularly

#### A.7.9 — Security of Assets Off-Premises

- [ ] Define policies for protecting equipment used outside the organization
- [ ] Encrypt all portable devices (laptops, USB drives)
- [ ] Implement remote wipe capability for mobile devices

#### A.7.10 — Storage Media

- [ ] Define procedures for secure disposal of storage media
- [ ] Maintain chain-of-custody records for media transfers
- [ ] Use secure erasure or physical destruction for decommissioned media

---

### A.8 — Technological Controls

**Objective:** Ensure that information security is implemented and operated within the technology environment.

#### A.8.1 — User Endpoint Devices

- [ ] Define policies for user endpoint devices (laptops, phones)
- [ ] Enforce disk encryption on all endpoints
- [ ] Implement endpoint detection and response (EDR) solutions
- [ ] Manage devices via MDM (Mobile Device Management)

#### A.8.2 — Privileged Access Rights

*Authentication services detected: devise, omniauth, pundit, rails-sessions*

- [ ] Restrict privileged access using the principle of least privilege
- [ ] Enforce multi-factor authentication (MFA) for all privileged accounts
- [ ] Review privileged access rights quarterly
- [ ] Log all privileged access activity
- [ ] Use just-in-time (JIT) access where possible

#### A.8.5 — Secure Authentication

- [ ] Enforce strong password policies (minimum 12 characters, complexity requirements)
- [ ] Implement account lockout after repeated failed attempts
- [ ] Use secure credential storage (hashing with bcrypt/argon2)
- [ ] Protect authentication tokens and session IDs

#### A.8.7 — Protection Against Malware

- [ ] Deploy anti-malware solutions on all endpoints and servers
- [ ] Implement application whitelisting where feasible
- [ ] Scan all file uploads for malware

#### A.8.8 — Management of Technical Vulnerabilities

- [ ] Run automated dependency vulnerability scanning (e.g., npm audit, Snyk, Dependabot)
- [ ] Conduct periodic penetration testing (at least annually)
- [ ] Maintain a vulnerability remediation SLA (critical: 24h, high: 7d, medium: 30d, low: 90d)
- [ ] Subscribe to vulnerability notification feeds for all technology in use

#### A.8.9 — Configuration Management

- [ ] Maintain hardened baseline configurations for all systems
- [ ] Automate configuration management (Infrastructure as Code)
- [ ] Monitor for configuration drift
- [ ] Review and update configurations at planned intervals

#### A.8.10 — Information Deletion

*Data storage services detected: ActiveRecord, ioredis, pg, PostgreSQL (env), rails-activerecord, redis, Redis, Redis (env), @aws-sdk/client-s3, Active Storage, ActiveStorage, aws-sdk-s3, google-cloud-storage*

- [ ] Define data retention and deletion policies per data category
- [ ] Implement automated data purge processes for expired retention periods
- [ ] Verify deletion is complete and irreversible (including backups)
- [ ] Maintain deletion logs for compliance evidence

#### A.8.15 — Logging

- [ ] Enable logging on all critical systems and applications
- [ ] Protect log files from tampering and unauthorized access
- [ ] Centralize log collection (SIEM)
- [ ] Configure alerting in: sentry-ruby
- [ ] Define log retention periods (minimum 12 months recommended)
- [ ] Review logs regularly for security events

#### A.8.20 — Networks Security

- [ ] Segment networks to isolate sensitive systems
- [ ] Implement firewall rules following the principle of least privilege
- [ ] Monitor network traffic for anomalies
- [ ] Use encrypted channels (TLS 1.2+) for all network communications

#### A.8.24 — Use of Cryptography

- [ ] Enforce TLS 1.2+ for all data in transit
- [ ] Enable encryption at rest for: ActiveRecord, ioredis, pg, PostgreSQL (env), rails-activerecord, redis, Redis, Redis (env)
- [ ] Enable encryption at rest for file storage: @aws-sdk/client-s3, Active Storage, ActiveStorage, aws-sdk-s3, google-cloud-storage
- [ ] Document encryption standards and key management procedures
- [ ] Store encryption keys in a dedicated key management service (KMS)
- [ ] Rotate encryption keys on a defined schedule

#### A.8.25 — Secure Development Life Cycle

- [ ] Define a secure software development lifecycle (SSDLC) policy
- [ ] Require code review for all production changes
- [ ] Implement automated security testing in CI/CD pipelines (SAST, DAST)
- [ ] Separate development, staging, and production environments
- [ ] Conduct security architecture reviews for significant changes

#### A.8.28 — Secure Coding (AI-Specific)

*AI services detected: ruby-openai*

- [ ] Validate AI model inputs and outputs for safety and correctness
- [ ] Implement guardrails for AI-generated content (safety filters, output validation)
- [ ] Log AI processing decisions for auditability
- [ ] Document AI model provenance and training data lineage
- [ ] Conduct bias and fairness assessments for AI models

---

## 4. Implementation Roadmap

| Phase | Duration | Activities |
|-------|----------|-----------|
| **Gap Analysis** | 2-4 weeks | Assess current controls against ISO 27001 requirements |
| **Risk Assessment** | 2-4 weeks | Identify, analyze, and evaluate information security risks |
| **ISMS Design** | 4-8 weeks | Define ISMS scope, policies, and control objectives |
| **Implementation** | 8-16 weeks | Implement controls, procedures, and documentation |
| **Internal Audit** | 2-4 weeks | Conduct internal audit to verify ISMS effectiveness |
| **Management Review** | 1-2 weeks | Review ISMS performance and approve for certification |
| **Stage 1 Audit** | 1-2 weeks | Certification body reviews documentation and readiness |
| **Stage 2 Audit** | 1-2 weeks | Certification body verifies implementation and effectiveness |

---

## 5. Statement of Applicability (SoA) Template

The Statement of Applicability documents which Annex A controls are applicable to your ISMS and the justification for inclusion or exclusion.

| Control Domain | Applicable | Justification |
|---------------|------------|---------------|
| Organizational Controls (A.5) | Yes | Relevant services and data processing detected |
| People Controls (A.6) | Yes | Relevant services and data processing detected |
| Physical Controls (A.7) | Yes | Relevant services and data processing detected |
| Technological Controls (A.8) | Yes | Relevant services and data processing detected |

> **Note:** All Annex A domains should be evaluated regardless of detected services. This template provides a starting point — your organization must assess applicability based on the full risk assessment.

---

## 6. Next Steps

1. **Appoint an ISMS owner** responsible for driving the certification process.
2. **Define the ISMS scope** — which business units, locations, and systems are included.
3. **Conduct a risk assessment** to identify threats and vulnerabilities to your information assets.
4. **Prioritize controls** starting with A.5 (Organizational) and A.8 (Technological) — these have the broadest impact.
5. **Begin documentation** — ISO 27001 requires documented policies, procedures, and evidence of control operation.
6. **Engage a certification body** early to align on scope and expectations.

---

*This ISO 27001 Compliance Checklist was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. It should be reviewed by a qualified professional before use in certification preparation.*