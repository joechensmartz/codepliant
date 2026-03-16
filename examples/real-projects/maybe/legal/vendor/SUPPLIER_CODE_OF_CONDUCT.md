# Supplier Code of Conduct

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16
**Organization:** [Your Company Name]

This Supplier Code of Conduct ("Code") outlines the data protection, security, and compliance requirements that all suppliers, vendors, and third-party service providers ("Suppliers") must adhere to when processing data on behalf of [Your Company Name].

## 1. Scope

This Code applies to all Suppliers that process, store, transmit, or have access to data managed by [Your Company Name]. Compliance with this Code is a contractual requirement for all Suppliers.

## 2. Data Protection Requirements

### 2.1 Lawful Processing

Suppliers must:

- Process personal data only as instructed by [Your Company Name]
- Maintain a lawful basis for any data processing (GDPR Article 6)
- Not process personal data for any purpose beyond the scope of the agreement
- Implement appropriate data minimization practices
- Maintain accurate records of processing activities (GDPR Article 30)

### 2.2 Data Subject Rights

Suppliers must:

- Assist [Your Company Name] in responding to Data Subject Access Requests (DSARs)
- Support the right to rectification, erasure, and data portability
- Notify [Your Company Name] within 24 hours of receiving any data subject request directly
- Not respond to data subject requests without prior authorization from [Your Company Name]

### 2.3 International Data Transfers

Suppliers must:

- Not transfer personal data outside the EEA without appropriate safeguards
- Use Standard Contractual Clauses (SCCs) for transfers outside the EEA
- Conduct Transfer Impact Assessments where required
- Notify [Your Company Name] of any change in data processing location

## 3. Security Expectations

### 3.1 Technical Measures

Suppliers must implement and maintain:

- Encryption at rest (AES-256 or equivalent) for all personal data
- Encryption in transit (TLS 1.2+ minimum)
- Access controls based on the principle of least privilege
- Multi-factor authentication for administrative access
- Regular vulnerability scanning and penetration testing
- Intrusion detection/prevention systems
- Secure software development lifecycle (SSDLC) practices

### 3.2 Payment Data Security

Suppliers handling payment data must additionally:

- Maintain PCI DSS compliance (Level 1 or 2 as applicable)
- Provide a current Attestation of Compliance (AoC)
- Never store primary account numbers (PANs) in plaintext
- Implement tokenization for card data where possible

### 3.3 Authentication & Identity Data

Suppliers processing authentication or identity data must:

- Store passwords using industry-standard hashing (bcrypt, Argon2, scrypt)
- Support secure session management and token rotation
- Implement account lockout and brute-force protection
- Notify [Your Company Name] of any credential compromise within 4 hours

### AI & Machine Learning Data

Suppliers providing AI or machine learning services must:

- Not use [Your Company Name]'s data to train models without explicit written consent
- Provide transparency regarding AI model training data sources
- Implement bias monitoring and fairness assessments
- Comply with the EU AI Act classification requirements
- Provide clear documentation of automated decision-making processes

### Organizational Measures

Suppliers must:

- Conduct annual security awareness training for all staff with data access
- Maintain a documented information security policy (ISO 27001 aligned)
- Perform background checks on personnel with access to personal data
- Maintain a documented incident response plan
- Carry adequate cyber insurance coverage

## 4. Incident Response & Breach Notification

Suppliers must:

- Notify [Your Company Name] of any security incident within **72 hours** of discovery
- Notify [Your Company Name] of any confirmed personal data breach within **24 hours**
- Provide a detailed incident report including:
  - Nature and scope of the incident
  - Categories and approximate number of affected data subjects
  - Categories and approximate number of affected records
  - Measures taken or proposed to mitigate the incident
  - Root cause analysis and remediation timeline
- Cooperate fully with [Your Company Name]'s incident investigation
- Preserve all relevant logs and evidence for at least 12 months

Incident notifications should be sent to: **[your-email@example.com]**

## 5. Audit Rights

[Your Company Name] reserves the right to:

- Conduct audits of Supplier's data processing activities with 30 days' written notice
- Request and review Supplier's security certifications (SOC 2, ISO 27001, etc.)
- Require Supplier to complete annual security questionnaires
- Engage independent third-party auditors at [Your Company Name]'s expense
- Access relevant logs and records pertaining to data processing activities
- Conduct unannounced audits in the event of a suspected breach or non-compliance

Suppliers must:

- Cooperate fully with any audit requests
- Maintain comprehensive audit logs for a minimum of 12 months
- Provide copies of relevant certifications upon request
- Remediate any audit findings within the agreed timeline
- Notify [Your Company Name] if any certification lapses or is revoked

## 6. Sub-Processor Requirements

Suppliers must not engage sub-processors without prior written authorization from [Your Company Name]. The following requirements apply to all sub-processor engagements:

- Obtain prior written approval before engaging any new sub-processor
- Notify [Your Company Name] at least 30 days before adding or replacing a sub-processor
- Impose contractual obligations on sub-processors that are no less protective than this Code
- Remain fully liable for the acts and omissions of sub-processors
- Maintain a current register of all sub-processors

### 6.1 Currently Detected Sub-Processors

The following third-party services have been identified in the codebase and may function as sub-processors:

| Sub-Processor | Category | Data Processed |
| --- | --- | --- |
| ActionCable | other | real-time user data, connection metadata, channel subscriptions, WebSocket messages |
| ActionController::Cookies | other | session cookies, session data, CSRF tokens |
| ActionMailer | email | email addresses, email content |
| Active Storage | storage | uploaded files, file metadata, storage service credentials, potential PII in uploaded content |
| ActiveRecord | database | user data as defined in schema, timestamps, associations |
| ActiveStorage | storage | uploaded files, file metadata, storage references |
| aws-sdk-s3 | storage | uploaded files, file metadata |
| intercom-ruby | other | user profiles, email, name, conversations, user behavior |
| pg | database | user data as defined in schema |
| plaid | payment | bank account data, transaction history, account balances, financial institution data |
| rack-attack | other | IP addresses, request metadata |
| rails-actionmailer | email | email addresses, email content |
| rails-activerecord | database | user data as defined in schema |
| rails-sessions | auth | session cookies, CSRF tokens |
| ruby-openai | ai | user prompts, conversation history, generated content |
| sentry-ruby | monitoring | error data, stack traces, user context, device information |
| sidekiq | other | job data, user data processed in background jobs |
| stripe | payment | payment information, billing address, email, transaction history |

Each sub-processor listed above must have a valid Data Processing Agreement (DPA) in place before processing begins.

## 7. Business Continuity & Data Return

Suppliers must:

- Maintain documented business continuity and disaster recovery plans
- Test disaster recovery procedures at least annually
- Upon termination of the agreement, return or securely delete all [Your Company Name] data within 30 days
- Provide written certification of data deletion upon request
- Support data migration to alternative providers if requested

## 8. Compliance Monitoring & Enforcement

[Your Company Name] will monitor Supplier compliance through:

- Annual security questionnaires
- Periodic audit exercises
- Review of certifications and attestations
- Continuous monitoring of incident reports

Non-compliance with this Code may result in:

- Requirement for immediate remediation
- Suspension of data processing activities
- Termination of the supplier agreement
- Reporting to relevant supervisory authorities where required by law

## 9. Contact

For questions regarding this Code, contact:

- **Data Protection:** [your-email@example.com]
- **General Inquiries:** [your-email@example.com]

## Related Documents

- Data Processing Agreement (`DATA_PROCESSING_AGREEMENT.md`)
- Vendor Security Questionnaire (`VENDOR_SECURITY_QUESTIONNAIRE.md`)

---

*This document was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on detected third-party services. It should be reviewed by legal counsel before use. This document does not constitute legal advice.*