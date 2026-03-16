# Compliance Evidence Log

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


---

> **Organization:** [Your Company Name]  
> **Log Owner:** [Compliance Officer Name]  
> **Contact:** [your-email@example.com]  
> **Last Updated:** 2026-03-16  
> **Next Review:** 2026-06-16  
> **Services in Scope:** 22

> **Disclaimer:** This evidence log is auto-generated from code analysis and should be reviewed by your compliance team. It provides a starting framework for audit evidence tracking but must be customized to your specific audit scope and requirements.

## Summary

| Metric | Value |
| --- | --- |
| Total Controls | 20 |
| Evidence Collected | 12 |
| Evidence Pending | 8 |
| Not Applicable | 0 |
| Completion Rate | 60% |

## SOC 2 Evidence

| Control ID | Control | Evidence Type | Description | Location | Status | Reviewer |
| --- | --- | --- | --- | --- | --- | --- |
| CC1.1 | Organizational Commitment to Integrity | Document | Code of conduct, ethics policy, and employee acknowledgment records | legal/COMPLIANCE_OATH.md, HR records | Pending | [Compliance Officer Name] |
| CC1.2 | Board Oversight | Document | Board meeting minutes documenting compliance oversight | legal/COMPLIANCE_BOARD_REPORT.md | Pending | [Compliance Officer Name] |
| CC2.1 | Internal Communication | Document | Security awareness training records and communication plan | legal/SECURITY_AWARENESS_PROGRAM.md, legal/COMPLIANCE_COMMUNICATION_PLAN.md | Collected | [Compliance Officer Name] |
| CC3.1 | Risk Assessment Process | Document | Risk register covering 22 detected service(s) and third-party risk assessments | legal/RISK_REGISTER.md, legal/THIRD_PARTY_RISK_ASSESSMENT.md | Collected | [Compliance Officer Name] |
| CC5.1 | Logical Access Controls | Configuration | Access control policy and authentication service configuration (detected auth services) | legal/ACCESS_CONTROL_POLICY.md, auth service config | Collected | [Compliance Officer Name] |
| CC5.2 | Data Protection Controls | Configuration | Encryption-at-rest and in-transit configurations for detected database services | legal/ENCRYPTION_POLICY.md, database config | Pending | [Compliance Officer Name] |
| CC6.1 | Access Provisioning | Log | User access review logs and provisioning/de-provisioning records | IAM system logs, HR records | Pending | [Compliance Officer Name] |
| CC6.2 | Infrastructure Access | Configuration | Cloud infrastructure access controls and MFA configuration | Cloud provider console, legal/SECURITY.md | Pending | [Compliance Officer Name] |
| CC7.1 | Vulnerability Management | Log | Vulnerability scan results and remediation tracking | legal/PENETRATION_TEST_SCOPE.md, scanner reports | Pending | [Compliance Officer Name] |
| CC8.1 | Change Management Process | Document | Change management policy and recent change request records | legal/CHANGE_MANAGEMENT_POLICY.md, Git history | Collected | [Compliance Officer Name] |
| CC9.1 | Incident Response | Document | Incident response plan and post-incident review records | legal/INCIDENT_RESPONSE_PLAN.md, incident logs | Collected | [Compliance Officer Name] |

## ISO 27001 Evidence

| Control ID | Control | Evidence Type | Description | Location | Status | Reviewer |
| --- | --- | --- | --- | --- | --- | --- |
| CC3.1 | Risk Assessment Process | Document | Risk register covering 22 detected service(s) and third-party risk assessments | legal/RISK_REGISTER.md, legal/THIRD_PARTY_RISK_ASSESSMENT.md | Collected | [Compliance Officer Name] |
| CC5.1 | Logical Access Controls | Configuration | Access control policy and authentication service configuration (detected auth services) | legal/ACCESS_CONTROL_POLICY.md, auth service config | Collected | [Compliance Officer Name] |
| CC5.2 | Data Protection Controls | Configuration | Encryption-at-rest and in-transit configurations for detected database services | legal/ENCRYPTION_POLICY.md, database config | Pending | [Compliance Officer Name] |
| CC6.2 | Infrastructure Access | Configuration | Cloud infrastructure access controls and MFA configuration | Cloud provider console, legal/SECURITY.md | Pending | [Compliance Officer Name] |
| CC7.1 | Vulnerability Management | Log | Vulnerability scan results and remediation tracking | legal/PENETRATION_TEST_SCOPE.md, scanner reports | Pending | [Compliance Officer Name] |
| CC8.1 | Change Management Process | Document | Change management policy and recent change request records | legal/CHANGE_MANAGEMENT_POLICY.md, Git history | Collected | [Compliance Officer Name] |
| CC9.1 | Incident Response | Document | Incident response plan and post-incident review records | legal/INCIDENT_RESPONSE_PLAN.md, incident logs | Collected | [Compliance Officer Name] |
| A.5.1 | Information Security Policy | Document | Information security policy document and management approval | legal/INFORMATION_SECURITY_POLICY.md | Collected | [Compliance Officer Name] |
| A.6.1 | Security Roles and Responsibilities | Document | Defined security roles, RACI matrix, and contact information | legal/SECURITY.md, legal/KEY_PERSON_RISK_ASSESSMENT.md | Collected | [Compliance Officer Name] |
| A.8.1 | Asset Inventory | Document | Inventory of 22 detected service(s) including data classification | legal/DATA_DICTIONARY.md, legal/DATA_FLOW_MAP.md | Collected | [Compliance Officer Name] |
| A.10.1 | Cryptographic Controls | Configuration | Encryption policy and key management procedures | legal/ENCRYPTION_POLICY.md | Pending | [Compliance Officer Name] |
| A.12.4 | Logging and Monitoring | Log | Audit log policy and sample logs demonstrating retention | legal/AUDIT_LOG_POLICY.md, system logs | Pending | [Compliance Officer Name] |
| A.14.1 | Secure Development | Document | Secure development lifecycle documentation and code review evidence | legal/PRIVACY_BY_DESIGN_CHECKLIST.md, Git PR history | Collected | [Compliance Officer Name] |
| A.15.1 | Supplier Security | Document | Supplier risk assessments, DPAs, and vendor onboarding records | legal/VENDOR_ONBOARDING_CHECKLIST.md, legal/THIRD_PARTY_RISK_ASSESSMENT.md | Collected | [Compliance Officer Name] |
| A.16.1 | Incident Management Process | Document | Incident severity matrix, communication templates, and drill records | legal/INCIDENT_SEVERITY_MATRIX.md, legal/DATA_BREACH_RESPONSE_DRILL.md | Collected | [Compliance Officer Name] |
| A.18.1 | Legal and Regulatory Compliance | Document | Regulatory mapping and compliance gap analysis | legal/REGULATORY_MAPPING_MATRIX.md, legal/COMPLIANCE_GAP_ANALYSIS.md | Collected | [Compliance Officer Name] |

## Evidence Collection Schedule

| Frequency | Activity | Responsible | Due |
| --- | --- | --- | --- |
| Weekly | Review access logs and monitoring alerts | [Compliance Officer Name] | Every Monday |
| Monthly | Update vulnerability scan results | [Compliance Officer Name] | 1st of month |
| Monthly | Review change management records | [Compliance Officer Name] | 1st of month |
| Quarterly | Full evidence collection review | [Compliance Officer Name] | 2026-06-16 |
| Quarterly | Vendor/supplier compliance check | [Compliance Officer Name] | 2026-06-16 |
| Annually | Complete re-assessment of all controls | [Compliance Officer Name] | 2026-03-16 + 1yr |

## Evidence Quality Checklist

For each evidence item, verify:

- [ ] Evidence is dated and timestamped
- [ ] Evidence covers the full audit period
- [ ] Evidence is from the production environment
- [ ] Evidence is stored in a tamper-evident location
- [ ] Evidence has been reviewed by the assigned reviewer
- [ ] Evidence clearly maps to the stated control objective
- [ ] Supporting screenshots include system date/time
- [ ] Configuration evidence shows both policy and enforcement

## Services in Scope

The following services were detected during code scanning and are in scope for audit evidence:

| Service | Category | Data Collected |
| --- | --- | --- |
| ActionCable | other | real-time user data, connection metadata, channel subscriptions, WebSocket messages |
| ActionController::Cookies | other | session cookies, session data, CSRF tokens |
| ActionMailer | email | email addresses, email content |
| Active Storage | storage | uploaded files, file metadata, storage service credentials, potential PII in uploaded content |
| ActiveRecord | database | user data as defined in schema, timestamps, associations |
| ActiveStorage | storage | uploaded files, file metadata, storage references |
| aws-sdk-s3 | storage | uploaded files, file metadata |
| devise | auth | email, password hash, session data, authentication tokens |
| ioredis | database | cached data, session data |
| omniauth | auth | email, name, OAuth tokens, profile data |
| pg | database | user data as defined in schema |
| PostgreSQL | database | application data, user records |
| PostgreSQL (env) | database | application data, user records |
| pundit | auth | user roles, authorization policies, access control data |
| rack-attack | other | IP addresses, request metadata |
| rails-actionmailer | email | email addresses, email content |
| rails-activerecord | database | user data as defined in schema |
| rails-sessions | auth | session cookies, CSRF tokens |
| redis | database | cached data, session data |
| Redis | database | session data, cache data |
| sidekiq | other | job data, user data processed in background jobs |
| ws (WebSocket) | other | real-time user data, connection metadata, IP address, WebSocket messages |

---

*Generated by Codepliant on 2026-03-16. This evidence log should be reviewed and updated regularly by your compliance team. Consult with your auditor to confirm evidence requirements specific to your audit scope.*
