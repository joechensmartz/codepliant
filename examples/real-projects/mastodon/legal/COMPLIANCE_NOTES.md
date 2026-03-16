# Compliance Notes

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Company:** [Your Company Name]
**Last updated:** 2026-03-16
**Project:** @mastodon/mastodon

## Related Documents

- Compliance Timeline (`COMPLIANCE_TIMELINE.md`)
- Annual Review Checklist (`ANNUAL_REVIEW_CHECKLIST.md`)
- Regulatory Updates (`REGULATORY_UPDATES.md`)

---

This document provides an overview of privacy and data protection regulations that may apply to your project based on the services detected in your codebase and your configured jurisdictions.

> **Disclaimer:** This is not legal advice. Consult qualified legal counsel to determine your specific compliance obligations.

## 1. Detected Services Summary

| Service | Category | Data Collected |
|---------|----------|----------------|
| ActionCable | Other | real-time user data, connection metadata, channel subscriptions |
| ActionController::Cookies | Other | session cookies, session data, CSRF tokens |
| ActionMailer | Email Service | email addresses, email content |
| Active Storage | File Storage | uploaded files, file metadata, storage service credentials |
| ActiveRecord | Database | user data as defined in schema, timestamps, associations |
| ActiveStorage | File Storage | uploaded files, file metadata, storage references |
| aws-sdk-s3 | File Storage | uploaded files, file metadata |
| devise | Authentication | email, password hash, session data |
| ioredis | Database | cached data, session data |
| omniauth | Authentication | email, name, OAuth tokens |
| pg | Database | user data as defined in schema |
| PostgreSQL | Database | application data, user records |
| PostgreSQL (env) | Database | application data, user records |
| pundit | Authentication | user roles, authorization policies, access control data |
| rack-attack | Other | IP addresses, request metadata |
| rails-actionmailer | Email Service | email addresses, email content |
| rails-activerecord | Database | user data as defined in schema |
| rails-sessions | Authentication | session cookies, CSRF tokens |
| redis | Database | cached data, session data |
| Redis | Database | session data, cache data |
| sidekiq | Other | job data, user data processed in background jobs |
| ws (WebSocket) | Other | real-time user data, connection metadata, IP address |


## 2. General Data Protection Regulation (GDPR)

**Applies to:** Processing of personal data of individuals in the EU/EEA
**Enforcement date:** May 25, 2018
**Maximum fine:** EUR 20 million or 4% of annual global turnover

### Key Requirements

- [ ] Identify a lawful basis for each processing activity (Art. 6)
- [ ] Provide a privacy notice covering all Art. 13 requirements
- [ ] Implement data subject rights procedures (access, rectification, erasure, portability, objection, restriction)
- [ ] Maintain a Record of Processing Activities (Art. 30)
- [ ] Conduct Data Protection Impact Assessments where required (Art. 35)
- [ ] Ensure appropriate technical and organisational security measures (Art. 32)
- [ ] Appoint a Data Protection Officer if required (Art. 37)
- [ ] Establish data breach notification procedures (72-hour requirement, Art. 33)


## 3. ePrivacy Directive (2002/58/EC)

**Applies to:** Any service that uses cookies or similar tracking technologies for users in the EU/EEA
**Key article:** Article 5(3) — prior opt-in consent for non-essential cookies
**Enforcement:** National data protection authorities (e.g., CNIL fined SHEIN EUR 150M in 2026)

### Key Requirements

- [ ] Obtain prior opt-in consent before setting non-essential cookies
- [ ] Provide granular cookie consent controls (accept analytics but reject marketing)
- [ ] Ensure equal access to service regardless of cookie consent decision
- [ ] Make consent withdrawal as easy as giving consent
- [ ] Document and store consent records
- [ ] Implement complete consent signaling from banner through CMP to all tracking tools

> See the generated **Cookie Policy** document for details on detected cookies and tracking technologies.


## 4. Children's Online Privacy Protection Act (COPPA)

**Applies to:** Websites and online services directed at children under 13, or that knowingly collect personal information from children under 13
**Enforcement:** U.S. Federal Trade Commission (FTC)
**Maximum civil penalty:** $50,120 per violation (2024 adjusted amount)

### Key Requirements

- [ ] Post a clear and comprehensive privacy policy describing data practices for children's information
- [ ] Obtain verifiable parental consent before collecting personal information from children under 13 (16 CFR § 312.5)
- [ ] Provide parents with direct notice of data collection practices (§ 312.4)
- [ ] Allow parents to review personal information collected from their child (§ 312.6)
- [ ] Allow parents to revoke consent and request deletion of their child's data (§ 312.6)
- [ ] Do not condition a child's participation on collecting more data than reasonably necessary (§ 312.7)
- [ ] Implement reasonable data security measures to protect children's information (§ 312.8)
- [ ] Retain children's personal information only as long as necessary to fulfill the purpose for which it was collected (§ 312.10)
- [ ] Ensure all third-party operators and service providers maintain COPPA compliance (§ 312.2)
- [ ] Implement an age-screening mechanism before data collection


## 5. Infrastructure Considerations

Codepliant detected infrastructure configuration files (Dockerfiles, docker-compose, Kubernetes manifests) that have compliance implications.

### Key Requirements

- [ ] Document data stored in persistent volumes and define retention periods
- [ ] Implement backup and disaster recovery procedures for persistent data
- [ ] Ensure persistent data is encrypted at rest where required by regulation
- [ ] Maintain an inventory of all infrastructure services and their data flows


## 6. Recommended Next Steps

1. Review all generated compliance documents with qualified legal counsel
2. Complete the checklist items marked above for each applicable regulation
3. Implement technical measures (consent management, data subject request handling)
4. Train relevant staff on data protection obligations
5. Set up regular compliance reviews (recommended: quarterly)
6. Re-run Codepliant after adding or removing services to keep documents current


---

*This compliance notes document was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. It is for informational purposes only and does not constitute legal advice.*