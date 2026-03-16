# Compliance Summary — [Your Company Name]

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Date:** 2026-03-16
**Prepared by:** [Data Protection Officer Name] ([dpo@example.com])
**Contact:** [your-email@example.com]
**Report type:** Periodic Compliance Status Update

---

> **This document is formatted as an email-ready compliance summary for distribution to stakeholders, board members, and executive leadership.**

---

## Executive Summary

[Your Company Name] currently operates **13 third-party service(s)** that process user data. A total of **82 compliance document(s)** have been generated covering all applicable regulatory requirements.

| Metric | Value |
|--------|-------|
| Overall Compliance Grade | **A** (Green) |
| Critical Document Coverage | 100% |
| Services Detected | 13 |
| Documents Generated | 82 |
| Applicable Jurisdictions | GDPR, CCPA (default) |

---

## Service Inventory

| Category | Count | Services |
|----------|-------|----------|
| Ai | 2 | @ai-sdk/google-vertex, @vercel/ai |
| Analytics | 1 | posthog |
| Auth | 3 | @simplewebauthn/server, next-auth, passport-microsoft |
| Database | 1 | prisma |
| Email | 3 | @aws-sdk/client-ses, nodemailer, resend |
| Other | 2 | @google-cloud/kms, googleapis |
| Payment | 1 | stripe |

---

## Key Risks

1. **AI/ML Services Detected** (@ai-sdk/google-vertex, @vercel/ai): EU AI Act Art. 50 transparency obligations apply. AI Disclosure document required.
2. **Payment Processing** (stripe): PCI DSS compliance required. Data Processing Agreement must list payment sub-processors.
3. **High Service Count** (13 services): Large attack surface increases data breach risk. Sub-processor management is critical.
4. **Analytics/Monitoring** (posthog): Cookie consent and tracking disclosure required under GDPR/ePrivacy.

---

## Action Items

- [ ] Review all generated compliance documents for accuracy
- [ ] Have legal counsel approve Privacy Policy and Terms of Service
- [ ] Review AI Disclosure document for EU AI Act Art. 50 compliance before August 2, 2026 deadline
- [ ] Verify PCI DSS compliance and DPA coverage for payment processors
- [ ] Schedule quarterly compliance review cadence
- [ ] Distribute this summary to all stakeholders and board members

---

## Regulatory Coverage

| Regulation | Status | Key Documents |
|-----------|--------|---------------|
| GDPR (EU) | Covered | Privacy Policy, DPA, DSAR Guide, Record of Processing |
| CCPA (California) | Covered | Privacy Policy (CCPA section), Data Deletion Procedures |
| EU AI Act | Covered | AI Disclosure, AI Model Card, AI Governance Framework |
| ePrivacy (Cookies) | Covered | Cookie Policy, Cookie Inventory, Consent Guide |
| PCI DSS | Partial | Security Policy, Encryption Policy, Access Control |

---

## Document Inventory

The following compliance documents have been generated:

- Privacy Policy (`PRIVACY_POLICY.md`)
- Terms of Service (`TERMS_OF_SERVICE.md`)
- Security Policy (`SECURITY.md`)
- Incident Response Plan (`INCIDENT_RESPONSE_PLAN.md`)
- AI Disclosure (`AI_DISCLOSURE.md`)
- AI Act Compliance Checklist (`AI_ACT_CHECKLIST.md`)
- AI Model Card (`AI_MODEL_CARD.md`)
- Cookie Policy (`COOKIE_POLICY.md`)
- Consent Management Guide (`CONSENT_MANAGEMENT_GUIDE.md`)
- Data Processing Agreement (`DATA_PROCESSING_AGREEMENT.md`)
- Sub-Processor List (`SUBPROCESSOR_LIST.md`)
- Data Retention Policy (`DATA_RETENTION_POLICY.md`)
- DSAR Handling Guide (`DSAR_HANDLING_GUIDE.md`)
- Vendor Contacts Directory (`VENDOR_CONTACTS.md`)
- Data Flow Map (`DATA_FLOW_MAP.md`)
- Compliance Notes (`COMPLIANCE_NOTES.md`)
- Compliance Timeline (`COMPLIANCE_TIMELINE.md`)
- SOC 2 Readiness Checklist (`SOC2_READINESS_CHECKLIST.md`)
- ISO 27001 Compliance Checklist (`ISO_27001_CHECKLIST.md`)
- Third-Party Risk Assessment (`THIRD_PARTY_RISK_ASSESSMENT.md`)
- Privacy Impact Assessment (`PRIVACY_IMPACT_ASSESSMENT.md`)
- Environment Variable Audit (`ENV_AUDIT.md`)
- Data Classification Report (`DATA_CLASSIFICATION.md`)
- Dependency Vulnerability Scan (`VULNERABILITY_SCAN.md`)
- Regulatory Updates (`REGULATORY_UPDATES.md`)
- Transparency Report (`TRANSPARENCY_REPORT.md`)
- Acceptable Use Policy (`ACCEPTABLE_USE_POLICY.md`)
- Refund Policy (`REFUND_POLICY.md`)
- Data Flow Diagram (`DATA_FLOW_DIAGRAM.md`)
- Audit Log Policy (`AUDIT_LOG_POLICY.md`)
- Acceptable AI Use Policy (`ACCEPTABLE_AI_USE_POLICY.md`)
- Risk Register (`RISK_REGISTER.md`)
- Record of Processing Activities (`RECORD_OF_PROCESSING_ACTIVITIES.md`)
- Data Dictionary (`DATA_DICTIONARY.md`)
- Access Control Policy (`ACCESS_CONTROL_POLICY.md`)
- Change Management Policy (`CHANGE_MANAGEMENT_POLICY.md`)
- Data Breach Notification Templates (`DATA_BREACH_NOTIFICATION_TEMPLATE.md`)
- Vendor Security Questionnaire (`VENDOR_SECURITY_QUESTIONNAIRE.md`)
- API Privacy Documentation (`API_PRIVACY_DOCUMENTATION.md`)
- Supplier Code of Conduct (`SUPPLIER_CODE_OF_CONDUCT.md`)
- Privacy by Design Checklist (`PRIVACY_BY_DESIGN_CHECKLIST.md`)
- Penetration Test Scope (`PENTEST_SCOPE.md`)
- Cookie Inventory (`COOKIE_INVENTORY.md`)
- AI Governance Framework (`AI_GOVERNANCE_FRAMEWORK.md`)
- Business Continuity Plan (`BUSINESS_CONTINUITY_PLAN.md`)
- Encryption Policy (`ENCRYPTION_POLICY.md`)
- Backup Policy (`BACKUP_POLICY.md`)
- Disaster Recovery Plan (`DISASTER_RECOVERY_PLAN.md`)
- Information Security Policy (`INFORMATION_SECURITY_POLICY.md`)
- Data Subject Categories (`DATA_SUBJECT_CATEGORIES.md`)
- Lawful Basis Assessment (`LAWFUL_BASIS_ASSESSMENT.md`)
- Annual Review Checklist (`ANNUAL_REVIEW_CHECKLIST.md`)
- Sub-Processor Change Notification (`SUBPROCESSOR_CHANGE_NOTIFICATION.md`)
- Data Protection Policy (`DATA_PROTECTION_POLICY.md`)
- Responsible Disclosure Policy (`RESPONSIBLE_DISCLOSURE_POLICY.md`)
- API Terms of Use (`API_TERMS_OF_USE.md`)
- Third-Party Cookie Notice (`THIRD_PARTY_COOKIE_NOTICE.md`)
- Data Portability Guide (`DATA_PORTABILITY_GUIDE.md`)
- AI Training Data Notice (`AI_TRAINING_DATA_NOTICE.md`)
- Employee Handbook Privacy Section (`EMPLOYEE_HANDBOOK_PRIVACY_SECTION.md`)
- Vendor Onboarding Checklist (`VENDOR_ONBOARDING_CHECKLIST.md`)
- Executive Dashboard (`EXECUTIVE_DASHBOARD.md`)
- Privacy Notice (Short) (`PRIVACY_NOTICE_SHORT.md`)
- Cookie Consent Configuration (`COOKIE_CONSENT_CONFIG.json`)
- Quick Start Compliance Guide (`QUICK_START_COMPLIANCE_GUIDE.md`)
- Compliance Roadmap (`COMPLIANCE_ROADMAP.md`)
- Privacy Dashboard Configuration (`PRIVACY_DASHBOARD_CONFIG.json`)
- DPO Handbook (`DPO_HANDBOOK.md`)
- Incident Communication Templates (`INCIDENT_COMMUNICATION_TEMPLATES.md`)
- Training Record (`TRAINING_RECORD.md`)
- Consent Record Template (`CONSENT_RECORD_TEMPLATE.md`)
- Data Deletion Procedures (`DATA_DELETION_PROCEDURES.md`)
- Security Awareness Program (`SECURITY_AWARENESS_PROGRAM.md`)
- Privacy Risk Matrix (`PRIVACY_RISK_MATRIX.md`)
- Data Mapping Register (`DATA_MAPPING_REGISTER.md`)
- AI Ethics Statement (`AI_ETHICS_STATEMENT.md`)
- Data Breach Response Drill Template (`DATA_BREACH_DRILL_TEMPLATE.md`)
- Regulatory Correspondence Log (`REGULATORY_CORRESPONDENCE_LOG.md`)
- Privacy Policy Changelog (`PRIVACY_POLICY_CHANGELOG.md`)
- Privacy Program Charter (`PRIVACY_PROGRAM_CHARTER.md`)
- Third-Party Due Diligence Template (`THIRD_PARTY_DUE_DILIGENCE_TEMPLATE.md`)
- Compliance Maturity Model (`COMPLIANCE_MATURITY_MODEL.md`)

---

## Next Steps

1. **Immediate (this week):** Review and approve critical documents (Privacy Policy, Terms of Service, Security Policy)
2. **Short-term (30 days):** Complete legal review of all generated documents
3. **Medium-term (90 days):** Implement consent management, DSAR handling procedures, and incident response testing
4. **Ongoing:** Schedule quarterly compliance reviews and document updates

---

## Distribution List

This summary should be distributed to:

- [ ] CEO / Founder
- [ ] CTO / VP Engineering
- [ ] General Counsel / Legal
- [ ] Data Protection Officer
- [ ] Board of Directors
- [ ] CISO / Security Lead
- [ ] VP Product

---

*Generated by [Codepliant](https://github.com/joechensmartz/codepliant) on 2026-03-16. This is an automated compliance summary based on code analysis. It should be reviewed by qualified legal counsel before distribution.*

*Report generated from analysis of 13 service(s) across 7 categories.*