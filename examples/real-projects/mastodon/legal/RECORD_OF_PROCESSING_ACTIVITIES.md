# Record of Processing Activities

> **[Your Company Name]** — GDPR Article 30 Record of Processing Activities
>
> Generated on 2026-03-16 by [Codepliant](https://github.com/joechensmartz/codepliant)
> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16

## 1. Controller Information

| Field | Details |
|-------|---------|
| **Data Controller** | [Your Company Name] |
| **Contact Email** | [your-email@example.com] |
| **Data Protection Officer** | [Data Protection Officer Name] |
| **DPO Email** | [your-email@example.com] |
| **Record Last Updated** | 2026-03-16 |

## 2. Processing Activities

The following processing activities have been identified through automated code analysis:

| # | Processing Activity | Purpose | Categories of Data Subjects | Categories of Personal Data | Recipients | Lawful Basis | Retention Period |
|---|---------------------|---------|-----------------------------|-----------------------------|------------|-------------|-----------------|
| 1 | User Authentication | Account creation, login, and session management | Registered Users | Email, name, profile data, session tokens, OAuth tokens | devise, omniauth, pundit, rails-sessions | Contract performance (Art. 6(1)(b)) | [Define retention period] |
| 2 | Email Communications | Transactional emails, notifications, and marketing communications | Registered Users, Customers | Email addresses, email content, delivery status | ActionMailer, rails-actionmailer | Contract performance (Art. 6(1)(b)) / Consent for marketing (Art. 6(1)(a)) | [Define retention period] |
| 3 | File Storage | User file uploads, media storage, document management | Registered Users | Uploaded files, file metadata, images, documents | Active Storage, ActiveStorage, aws-sdk-s3 | Contract performance (Art. 6(1)(b)) | [Define retention period] |
| 4 | Data Storage | Persistent storage of user data as defined by application schema | Registered Users, Customers | User data as defined in database schema | ActiveRecord, ioredis, pg, PostgreSQL, PostgreSQL (env), rails-activerecord, redis, Redis (self-hosted or managed) | Contract performance (Art. 6(1)(b)) | [Define retention period] |

## 3. Categories of Data Subjects

The following categories of data subjects have been identified:

- **Registered Users** — Individuals who create an account on the platform
- **Data Subjects** — Any individual whose personal data is processed through the application

## 4. International Data Transfers

The following third-party services may involve international data transfers:

| Service | Category | Transfer Mechanism | Safeguards |
|---------|----------|-------------------|------------|
| ActionCable | other | Standard Contractual Clauses (SCCs) | [Verify with provider] |
| ActionController::Cookies | other | Standard Contractual Clauses (SCCs) | [Verify with provider] |
| ActionMailer | email | Standard Contractual Clauses (SCCs) | [Verify with provider] |
| Active Storage | storage | Standard Contractual Clauses (SCCs) | [Verify with provider] |
| ActiveRecord | database | Standard Contractual Clauses (SCCs) | [Verify with provider] |
| ActiveStorage | storage | Standard Contractual Clauses (SCCs) | [Verify with provider] |
| aws-sdk-s3 | storage | Standard Contractual Clauses (SCCs) | [Verify with provider] |
| devise | auth | Standard Contractual Clauses (SCCs) | [Verify with provider] |
| ioredis | database | Standard Contractual Clauses (SCCs) | [Verify with provider] |
| omniauth | auth | Standard Contractual Clauses (SCCs) | [Verify with provider] |
| pg | database | Standard Contractual Clauses (SCCs) | [Verify with provider] |
| PostgreSQL | database | Standard Contractual Clauses (SCCs) | [Verify with provider] |
| PostgreSQL (env) | database | Standard Contractual Clauses (SCCs) | [Verify with provider] |
| pundit | auth | Standard Contractual Clauses (SCCs) | [Verify with provider] |
| rack-attack | other | Standard Contractual Clauses (SCCs) | [Verify with provider] |
| rails-actionmailer | email | Standard Contractual Clauses (SCCs) | [Verify with provider] |
| rails-activerecord | database | Standard Contractual Clauses (SCCs) | [Verify with provider] |
| rails-sessions | auth | Standard Contractual Clauses (SCCs) | [Verify with provider] |
| redis | database | Standard Contractual Clauses (SCCs) | [Verify with provider] |
| Redis | database | Standard Contractual Clauses (SCCs) | [Verify with provider] |
| sidekiq | other | Standard Contractual Clauses (SCCs) | [Verify with provider] |
| ws (WebSocket) | other | Standard Contractual Clauses (SCCs) | [Verify with provider] |

## 5. Technical and Organizational Measures

Under GDPR Article 32, the following measures are implemented to ensure data security:

- [ ] Encryption of personal data in transit (TLS/SSL)
- [ ] Encryption of personal data at rest
- [ ] Access control and authentication mechanisms
- [ ] Regular security assessments and penetration testing
- [ ] Data backup and disaster recovery procedures
- [ ] Employee training on data protection
- [ ] Incident response procedures
- [ ] Data minimization practices
- [ ] Pseudonymization where appropriate
- [ ] Regular review of processing activities

## 6. Data Protection Impact Assessment (DPIA) Requirements

Based on current processing activities, a DPIA may not be strictly required.
However, it is recommended to conduct one as a best practice.

## 7. Review Schedule

This record must be reviewed and updated:

- **Annually** — At minimum, a full review of all processing activities
- **On change** — When new processing activities are introduced
- **On incident** — Following any data breach or security incident
- **On request** — When requested by a supervisory authority

## Review Notes

### What a lawyer should check

- Verify all processing activities are documented
- Confirm lawful basis for each activity
- Check data transfer mechanisms are accurate
- Validate retention periods
- Ensure all data subject categories are covered

### Auto-generated vs. needs human input

| Section | Status | Confidence |
|---------|--------|------------|
| Processing activities | Auto-detected from code | Medium |
| Lawful basis assignments | Auto-assigned defaults | Low |
| Transfer mechanisms | Template defaults (SCCs) | Low |
| Retention periods | Placeholder — needs input | N/A |
## Related Documents

- Privacy Policy (`PRIVACY_POLICY.md`)
- Data Subject Categories (`DATA_SUBJECT_CATEGORIES.md`)
- Lawful Basis Assessment (`LAWFUL_BASIS_ASSESSMENT.md`)
- Data Retention Policy (`DATA_RETENTION_POLICY.md`)
- Transfer Impact Assessment (`TRANSFER_IMPACT_ASSESSMENT.md`)

---

*This Record of Processing Activities was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on code analysis. It should be reviewed by your Data Protection Officer and legal counsel to ensure completeness and accuracy. This document is required under GDPR Article 30 for controllers processing personal data.*
