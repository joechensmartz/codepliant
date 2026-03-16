# Compliance Notes

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Company:** [Your Company Name]
**Last updated:** 2026-03-16
**Project:** formbricks

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
| @aws-sdk/client-s3 | File Storage | uploaded files, file metadata |
| @sentry/nextjs | Error Monitoring | error data, stack traces, user context |
| googleapis | Other | user data via Google APIs, calendar data, email data |
| ioredis | Database | cached data, session data |
| next-auth | Authentication | email, name, profile picture |
| nodemailer | Email Service | email addresses, email content |
| posthog | Analytics | user behavior, session recordings, feature flag usage |
| prisma | Database | user data as defined in schema |
| redis | Database | cached data, session data |
| stripe | Payment Processing | payment information, billing address, email |


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


## 5. Payment Card Industry Data Security Standard (PCI DSS)

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


## 6. Recommended Next Steps

1. Review all generated compliance documents with qualified legal counsel
2. Complete the checklist items marked above for each applicable regulation
3. Implement technical measures (consent management, data subject request handling)
4. Train relevant staff on data protection obligations
5. Set up regular compliance reviews (recommended: quarterly)
6. Re-run Codepliant after adding or removing services to keep documents current


---

*This compliance notes document was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. It is for informational purposes only and does not constitute legal advice.*