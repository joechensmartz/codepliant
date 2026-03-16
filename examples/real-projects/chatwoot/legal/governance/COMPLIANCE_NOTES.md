# Compliance Notes

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Company:** [Your Company Name]
**Last updated:** 2026-03-16
**Project:** @chatwoot/chatwoot

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
| @amplitude/analytics-browser | Analytics | user behavior, device information, session data |
| @aws-sdk/client-s3 | File Storage | uploaded files, file metadata |
| @twilio/voice-sdk | Other | phone numbers, voice call metadata, call recordings |
| ActionCable | Other | real-time user data, connection metadata, channel subscriptions |
| ActionController::Cookies | Other | session cookies, session data, CSRF tokens |
| ActionMailer | Email Service | email addresses, email content |
| Active Storage | File Storage | uploaded files, file metadata, storage service credentials |
| ActiveRecord | Database | user data as defined in schema, timestamps, associations |
| ActiveStorage | File Storage | uploaded files, file metadata, storage references |
| aws-sdk-s3 | File Storage | uploaded files, file metadata |
| devise | Authentication | email, password hash, session data |
| google-cloud-storage | File Storage | uploaded files, file metadata |
| ioredis | Database | cached data, session data |
| MailHog | Email Service | email content |
| Meta Pixel | Advertising | page views, conversion events, user behavior |
| nodemailer | Email Service | email addresses, email content |
| omniauth | Authentication | email, name, OAuth tokens |
| pg | Database | user data as defined in schema |
| PostgreSQL (env) | Database | application data, user records |
| pundit | Authentication | user roles, authorization policies, access control data |
| rack-attack | Other | IP addresses, request metadata |
| rails-actionmailer | Email Service | email addresses, email content |
| rails-activerecord | Database | user data as defined in schema |
| rails-sessions | Authentication | session cookies, CSRF tokens |
| redis | Database | cached data, session data |
| Redis | Database | session data, cache data |
| Redis (env) | Database | session data, cache data |
| ruby-openai | AI Service | user prompts, conversation history, generated content |
| sentry-ruby | Error Monitoring | error data, stack traces, user context |
| sidekiq | Other | job data, user data processed in background jobs |
| stripe | Payment Processing | payment information, billing address, email |
| twilio-ruby | Other | phone numbers, SMS message content, voice call metadata |


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
- [ ] Implement transfer safeguards (SCCs/DPF) for 4 US-based service(s)
- [ ] Address automated decision-making requirements (Art. 22)
- [ ] Comply with EU AI Act transparency obligations (Art. 50) — enforcement August 2, 2026
- [ ] Implement cookie consent mechanism (ePrivacy Directive)
- [ ] Appoint a Data Protection Officer if required (Art. 37)
- [ ] Establish data breach notification procedures (72-hour requirement, Art. 33)


## 3. California Consumer Privacy Act (CCPA/CPRA)

**Applies to:** Businesses that collect personal information of California residents
**Enforcement date:** January 1, 2020 (CCPA); January 1, 2023 (CPRA amendments)
**Maximum fine:** $7,500 per intentional violation

### Key Requirements

- [ ] Provide a "Do Not Sell or Share My Personal Information" link
- [ ] Disclose categories of personal information collected and purposes
- [ ] Honor opt-out requests within 15 business days
- [ ] Respond to consumer requests within 45 days
- [ ] Provide at least two methods for consumers to submit requests
- [ ] Include CCPA-specific disclosures in your privacy policy
- [ ] Honor Global Privacy Control (GPC) signals
- [ ] Review analytics service data sharing — may constitute "sale" or "sharing" under CCPA
- [ ] Ensure payment processors have appropriate data processing agreements


## 4. ePrivacy Directive (2002/58/EC)

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
- [ ] Classify detected analytics cookies and ensure each requires consent

> See the generated **Cookie Policy** document for details on detected cookies and tracking technologies.


## 5. EU AI Act (Regulation 2024/1689)

**Applies to:** Providers and deployers of AI systems in the EU
**Transparency obligations enforcement:** August 2, 2026
**Maximum fine:** EUR 35 million or 7% of annual global turnover

### Key Requirements for Deployers

- [ ] Classify AI systems by risk level (minimal, limited, high, unacceptable)
- [ ] Provide transparency disclosures per Article 50
- [ ] Implement human oversight measures
- [ ] Mark AI-generated content in machine-readable format (Art. 50(2))
- [ ] Maintain documentation of AI system usage

> See the generated **AI Disclosure** and **AI Act Compliance Checklist** documents for detailed requirements.


## 6. Payment Card Industry Data Security Standard (PCI DSS)

**Applies to:** Any entity that stores, processes, or transmits cardholder data
**Current version:** PCI DSS v4.0.1 (mandatory March 31, 2025)
**Enforcement:** Payment card brands (Visa, Mastercard, etc.) via acquiring banks

### Key Requirements

- [ ] Complete the appropriate Self-Assessment Questionnaire (SAQ) — likely SAQ A or SAQ A-EP
- [ ] Install and maintain network security controls (Req. 1)
- [ ] Apply secure configurations to all system components (Req. 2)
- [ ] Protect stored account data with strong cryptography (Req. 3)
- [ ] Encrypt cardholder data over open, public networks (Req. 4)
- [ ] Protect systems and networks from malicious software (Req. 5)
- [ ] Develop and maintain secure systems and software (Req. 6)
- [ ] Restrict access to cardholder data by business need-to-know (Req. 7)
- [ ] Log and monitor all access to cardholder data (Req. 10)
- [ ] Regularly test security systems and processes (Req. 11)
- [ ] Maintain an information security policy (Req. 12)


## 7. Infrastructure Considerations

Codepliant detected infrastructure configuration files (Dockerfiles, docker-compose, Kubernetes manifests) that have compliance implications.

### Key Requirements

- [ ] Document data stored in persistent volumes and define retention periods
- [ ] Implement backup and disaster recovery procedures for persistent data
- [ ] Ensure persistent data is encrypted at rest where required by regulation
- [ ] Maintain an inventory of all infrastructure services and their data flows


## 8. Recommended Next Steps

1. Review all generated compliance documents with qualified legal counsel
2. Complete the checklist items marked above for each applicable regulation
3. Implement technical measures (consent management, data subject request handling)
4. Train relevant staff on data protection obligations
5. Set up regular compliance reviews (recommended: quarterly)
6. Re-run Codepliant after adding or removing services to keep documents current


---

*This compliance notes document was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. It is for informational purposes only and does not constitute legal advice.*