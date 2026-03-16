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
- [ ] Configure analytics to anonymize IP addresses
- [ ] Disable user-level tracking where aggregate data suffices
- [ ] Set analytics data retention to the shortest period needed
- [ ] Only store email addresses necessary for transactional communications
- [ ] Implement unsubscribe mechanisms for all marketing communications
- [ ] Strip PII from error reports before sending to monitoring services
- [ ] Configure user context in error tracking to use anonymized identifiers

## 2. Purpose Limitation (Article 5(1)(b))

Data must be collected for specified, explicit, and legitimate purposes.

- [ ] Document the lawful basis for each processing activity
- [ ] Ensure data is not repurposed without additional consent
- [ ] Maintain a Record of Processing Activities (ROPA)
- [ ] Limit payment data usage to transaction processing and fraud prevention
- [ ] Do not use payment data for marketing or profiling

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
- [ ] Maintain PCI DSS compliance for payment data handling
- [ ] Use tokenization for stored payment methods

## 5. Transparency (Articles 12-14)

Data subjects must be informed about data processing in a clear and accessible manner.

- [ ] Publish a clear and accessible Privacy Policy
- [ ] Provide layered privacy notices (short + detailed)
- [ ] Inform users about their rights at the point of data collection
- [ ] Maintain an up-to-date list of sub-processors
- [ ] Implement a cookie consent banner with granular controls
- [ ] Provide a clear Cookie Policy listing all tracking technologies

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

### Analytics & Tracking

- [ ] **Differential privacy**: Add noise to analytics datasets to prevent re-identification
- [ ] **K-anonymity**: Ensure analytics cohorts contain at least k individuals
- [ ] **Server-side analytics**: Process analytics events server-side to reduce client data exposure
- [ ] **IP anonymization**: Truncate IP addresses before storage

### Authentication & Identity

- [ ] **Zero-knowledge proofs**: Consider ZKP for age/credential verification without revealing details
- [ ] **Secure enclaves**: Process sensitive auth data in trusted execution environments
- [ ] **Token-based sessions**: Use short-lived, rotating tokens instead of persistent sessions

### Payment Processing

- [ ] **Tokenization**: Replace card data with non-reversible tokens
- [ ] **Point-to-point encryption (P2PE)**: Encrypt card data from capture to processing

### Data Storage

- [ ] **Encryption at rest**: Use envelope encryption with key rotation
- [ ] **Field-level encryption**: Encrypt individual PII fields in the database
- [ ] **Secure deletion**: Use cryptographic erasure for data deletion guarantees

## 8. Detected Services — Privacy Assessment

The following services were detected in the codebase. Each requires a privacy impact evaluation:

| Service | Category | Data Processed | Privacy Action Required |
| --- | --- | --- | --- |
| @aws-sdk/client-s3 | storage | uploaded files, file metadata | Encryption review; lifecycle policies; access controls |
| @sentry/nextjs | monitoring | error data, stack traces, user context, device information, IP address | PII scrubbing in error reports; retention limits; access controls |
| googleapis | other | user data via Google APIs, calendar data, email data, profile information | Review data processing scope; assess DPA requirements |
| ioredis | database | cached data, session data | Encryption at rest; access controls; backup encryption |
| next-auth | auth | email, name, profile picture, OAuth tokens, session data | Minimize data collected; secure credential storage; session management |
| nodemailer | email | email addresses, email content | Consent/opt-out mechanism; DPA with provider; retention policy |
| posthog | analytics | user behavior, session recordings, feature flag usage, device information | Consent mechanism; IP anonymization; retention review |
| prisma | database | user data as defined in schema | Encryption at rest; access controls; backup encryption |
| redis | database | cached data, session data | Encryption at rest; access controls; backup encryption |
| stripe | payment | payment information, billing address, email, transaction history | PCI DSS compliance; DPA with processor; tokenization review |

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