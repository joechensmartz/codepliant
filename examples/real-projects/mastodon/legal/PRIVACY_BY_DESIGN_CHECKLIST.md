# Privacy by Design Checklist

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Organization:** [Your Company Name]
**Last updated:** 2026-03-16
**Legal basis:** GDPR Article 25 — Data Protection by Design and by Default

This checklist implements the requirements of GDPR Article 25, which mandates that data protection is integrated into processing activities and business practices from the design stage through the lifecycle. Each item has been tailored to the services detected in the [Your Company Name] codebase.

## 1. Data Minimization (Article 5(1)(c))

Ensure that only data which is necessary for each specific purpose is collected and processed.

- [ ] Review each data collection point to verify necessity
- [ ] Document the purpose for each category of personal data collected
- [ ] Remove any data fields that are not strictly necessary
- [ ] Implement default settings that collect the minimum data required
- [ ] Only collect profile data essential for authentication (avoid optional fields by default)
- [ ] Limit OAuth scopes to the minimum required
- [ ] Only store email addresses necessary for transactional communications
- [ ] Implement unsubscribe mechanisms for all marketing communications

## 2. Purpose Limitation (Article 5(1)(b))

Data must be collected for specified, explicit, and legitimate purposes.

- [ ] Document the lawful basis for each processing activity
- [ ] Ensure data is not repurposed without additional consent
- [ ] Maintain a Record of Processing Activities (ROPA)

## 3. Storage Limitation (Article 5(1)(e))

Personal data should be kept only as long as necessary for its purpose.

- [ ] Define retention periods for each category of personal data
- [ ] Implement automated data deletion/anonymization after retention period
- [ ] Document retention justification for any data kept beyond 3 years
- [ ] Implement soft-delete with scheduled hard-delete for database records
- [ ] Set up automated database cleanup jobs for expired data
- [ ] Configure object lifecycle policies for cloud storage buckets
- [ ] Implement automated expiration for user-uploaded content

## 4. Integrity & Confidentiality (Article 5(1)(f))

Personal data must be processed with appropriate security measures.

- [ ] Encrypt personal data at rest (AES-256 or equivalent)
- [ ] Encrypt personal data in transit (TLS 1.2+)
- [ ] Implement role-based access controls (RBAC)
- [ ] Maintain audit logs for personal data access
- [ ] Conduct regular security assessments and penetration tests
- [ ] Use strong password hashing (bcrypt, Argon2, or scrypt)
- [ ] Implement session timeout and automatic logout
- [ ] Enable multi-factor authentication where available

## 5. Transparency (Articles 12-14)

Data subjects must be informed about data processing in a clear and accessible manner.

- [ ] Publish a clear and accessible Privacy Policy
- [ ] Provide layered privacy notices (short + detailed)
- [ ] Inform users about their rights at the point of data collection
- [ ] Maintain an up-to-date list of sub-processors

## 6. Data Subject Rights (Articles 15-22)

Systems must be designed to facilitate the exercise of data subject rights.

- [ ] Implement mechanisms for data access requests (Article 15)
- [ ] Support data rectification (Article 16)
- [ ] Support data erasure / right to be forgotten (Article 17)
- [ ] Support data portability in machine-readable format (Article 20)
- [ ] Implement right to restriction of processing (Article 18)
- [ ] Enable right to object to processing (Article 21)
- [ ] Respond to all DSARs within 30 days

## 7. Privacy-Enhancing Technologies (PETs) Recommendations

Based on the detected services and data processing activities, the following privacy-enhancing technologies are recommended:

### General

- [ ] **Pseudonymization**: Replace direct identifiers with pseudonyms in processing pipelines
- [ ] **Data masking**: Mask PII in non-production environments
- [ ] **Access logging**: Implement comprehensive audit trails for data access

### Authentication & Identity

- [ ] **Zero-knowledge proofs**: Consider ZKP for age/credential verification without revealing details
- [ ] **Secure enclaves**: Process sensitive auth data in trusted execution environments
- [ ] **Token-based sessions**: Use short-lived, rotating tokens instead of persistent sessions

### Data Storage

- [ ] **Encryption at rest**: Use envelope encryption with key rotation
- [ ] **Field-level encryption**: Encrypt individual PII fields in the database
- [ ] **Secure deletion**: Use cryptographic erasure for data deletion guarantees

## 8. Detected Services — Privacy Assessment

The following services were detected in the codebase. Each requires a privacy impact evaluation:

| Service | Category | Data Processed | Privacy Action Required |
| --- | --- | --- | --- |
| ActionCable | other | real-time user data, connection metadata, channel subscriptions, WebSocket messages | Review data processing scope; assess DPA requirements |
| ActionController::Cookies | other | session cookies, session data, CSRF tokens | Review data processing scope; assess DPA requirements |
| ActionMailer | email | email addresses, email content | Consent/opt-out mechanism; DPA with provider; retention policy |
| Active Storage | storage | uploaded files, file metadata, storage service credentials, potential PII in uploaded content | Encryption review; lifecycle policies; access controls |
| ActiveRecord | database | user data as defined in schema, timestamps, associations | Encryption at rest; access controls; backup encryption |
| ActiveStorage | storage | uploaded files, file metadata, storage references | Encryption review; lifecycle policies; access controls |
| aws-sdk-s3 | storage | uploaded files, file metadata | Encryption review; lifecycle policies; access controls |
| devise | auth | email, password hash, session data, authentication tokens | Minimize data collected; secure credential storage; session management |
| ioredis | database | cached data, session data | Encryption at rest; access controls; backup encryption |
| omniauth | auth | email, name, OAuth tokens, profile data | Minimize data collected; secure credential storage; session management |
| pg | database | user data as defined in schema | Encryption at rest; access controls; backup encryption |
| PostgreSQL | database | application data, user records | Encryption at rest; access controls; backup encryption |
| PostgreSQL (env) | database | application data, user records | Encryption at rest; access controls; backup encryption |
| pundit | auth | user roles, authorization policies, access control data | Minimize data collected; secure credential storage; session management |
| rack-attack | other | IP addresses, request metadata | Review data processing scope; assess DPA requirements |
| rails-actionmailer | email | email addresses, email content | Consent/opt-out mechanism; DPA with provider; retention policy |
| rails-activerecord | database | user data as defined in schema | Encryption at rest; access controls; backup encryption |
| rails-sessions | auth | session cookies, CSRF tokens | Minimize data collected; secure credential storage; session management |
| redis | database | cached data, session data | Encryption at rest; access controls; backup encryption |
| Redis | database | session data, cache data | Encryption at rest; access controls; backup encryption |
| sidekiq | other | job data, user data processed in background jobs | Review data processing scope; assess DPA requirements |
| ws (WebSocket) | other | real-time user data, connection metadata, IP address, WebSocket messages | Review data processing scope; assess DPA requirements |

## 9. Review Schedule

| Activity | Frequency | Responsible |
| --- | --- | --- |
| Privacy by Design checklist review | Quarterly | DPO / Privacy Team |
| Data minimization audit | Semi-annually | Engineering Lead |
| PET effectiveness assessment | Annually | Security Team |
| DPIA update for new processing | Before launch | DPO / Privacy Team |
| Sub-processor review | Annually | Legal / Procurement |

## Related Documents

- Privacy Impact Assessment (`PRIVACY_IMPACT_ASSESSMENT.md`)
- Privacy Policy (`PRIVACY_POLICY.md`)

---

*This checklist was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on detected services and data processing activities. It should be reviewed and adapted by your Data Protection Officer or legal counsel. This document does not constitute legal advice.*