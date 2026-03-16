# Data Classification Report

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Project:** @documenso/root
**Company:** [Your Company Name]
**Generated:** 2026-03-16
**Classification Standard:** GDPR (General Data Protection Regulation)

## Related Documents

- Data Dictionary (`DATA_DICTIONARY.md`)
- Data Retention Policy (`DATA_RETENTION_POLICY.md`)
- Privacy Policy (`PRIVACY_POLICY.md`)

---

## Summary

| Sensitivity Level | Count | Description |
|-------------------|-------|-------------|
| Special Category (Art. 9) | 1 | Health, biometric, genetic, racial, political, religious, sexual orientation, trade union |
| High | 10 | Financial (PCI), government ID (SSN), authentication credentials |
| Medium | 16 | Contact info (email, phone), identity (name, DOB), location |
| Low | 31 | Behavioral (analytics), technical (IP, device info), preferences |

**Total classified fields:** 58

---

## Detailed Classification

| Field | Source | Sensitivity | GDPR Category | Retention |
|-------|--------|-------------|---------------|----------|
| biometric authentication data | @simplewebauthn/server | Special Category (Art. 9) | Biometric data (Art. 9) | Delete when no longer necessary; max 1 year |
| credential IDs | @simplewebauthn/server | High | Authentication credential | Until account deletion; rotate regularly |
| OAuth tokens | next-auth | High | Authentication credential | Until account deletion; rotate regularly |
| OAuth tokens | passport-microsoft | High | Authentication credential | Until account deletion; rotate regularly |
| payment information | stripe | High | Financial — payment data | 7 years (tax/legal compliance) |
| billing address | stripe | High | Financial — payment data | 7 years (tax/legal compliance) |
| transaction history | stripe | High | Financial — payment data | 7 years (tax/legal compliance) |
| Email addresses, names, profile pictures, and account credentials collected through authentication. | @simplewebauthn/server | High | Authentication credential | Until account deletion; rotate regularly |
| Email addresses, names, profile pictures, and account credentials collected through authentication. | next-auth | High | Authentication credential | Until account deletion; rotate regularly |
| Email addresses, names, profile pictures, and account credentials collected through authentication. | passport-microsoft | High | Authentication credential | Until account deletion; rotate regularly |
| Payment card information, billing addresses, and transaction history processed through payment providers. | stripe | High | Financial — payment data | 7 years (tax/legal compliance) |
| email addresses | @aws-sdk/client-ses | Medium | Contact — email | Until account deletion or consent withdrawal |
| email content | @aws-sdk/client-ses | Medium | Contact — email | Until account deletion or consent withdrawal |
| email data | googleapis | Medium | Contact — email | Until account deletion or consent withdrawal |
| email | next-auth | Medium | Contact — email | Until account deletion or consent withdrawal |
| name | next-auth | Medium | Personal identity — name | Until account deletion |
| profile picture | next-auth | Medium | Personal identity — image | Until account deletion |
| email addresses | nodemailer | Medium | Contact — email | Until account deletion or consent withdrawal |
| email content | nodemailer | Medium | Contact — email | Until account deletion or consent withdrawal |
| email | passport-microsoft | Medium | Contact — email | Until account deletion or consent withdrawal |
| name | passport-microsoft | Medium | Personal identity — name | Until account deletion |
| email addresses | resend | Medium | Contact — email | Until account deletion or consent withdrawal |
| email content | resend | Medium | Contact — email | Until account deletion or consent withdrawal |
| email | stripe | Medium | Contact — email | Until account deletion or consent withdrawal |
| Email addresses and email content processed through email service providers. | nodemailer | Medium | Contact — email | Until account deletion or consent withdrawal |
| Email addresses and email content processed through email service providers. | @aws-sdk/client-ses | Medium | Contact — email | Until account deletion or consent withdrawal |
| Email addresses and email content processed through email service providers. | resend | Medium | Contact — email | Until account deletion or consent withdrawal |
| user prompts | @ai-sdk/google-vertex | Low | Unclassified data | Review and define retention policy |
| conversation history | @ai-sdk/google-vertex | Low | Unclassified data | Review and define retention policy |
| generated content | @ai-sdk/google-vertex | Low | Unclassified data | Review and define retention policy |
| uploaded files | @aws-sdk/client-ses | Low | Unclassified data | Review and define retention policy |
| file metadata | @aws-sdk/client-ses | Low | Unclassified data | Review and define retention policy |
| encryption keys | @google-cloud/kms | Low | Unclassified data | Review and define retention policy |
| key metadata | @google-cloud/kms | Low | Unclassified data | Review and define retention policy |
| device attestation | @simplewebauthn/server | Low | Unclassified data | Review and define retention policy |
| user prompts | @vercel/ai | Low | Unclassified data | Review and define retention policy |
| conversation history | @vercel/ai | Low | Unclassified data | Review and define retention policy |
| generated content | @vercel/ai | Low | Unclassified data | Review and define retention policy |
| user data via Google APIs | googleapis | Low | Unclassified data | Review and define retention policy |
| calendar data | googleapis | Low | Unclassified data | Review and define retention policy |
| profile information | googleapis | Low | Unclassified data | Review and define retention policy |
| session data | next-auth | Low | Behavioral — analytics | 26 months |
| Microsoft profile data | passport-microsoft | Low | Unclassified data | Review and define retention policy |
| user behavior | posthog | Low | Behavioral — analytics | 26 months |
| session recordings | posthog | Low | Behavioral — analytics | 26 months |
| feature flag usage | posthog | Low | Unclassified data | Review and define retention policy |
| device information | posthog | Low | Technical — device/network | 90 days |
| user data as defined in schema | prisma | Low | Unclassified data | Review and define retention policy |
| Usage & Behavioral Data | posthog | Low | Behavioral — analytics | 26 months |
| AI Interaction Data | @ai-sdk/google-vertex | Low | Unclassified data | Review and define retention policy |
| AI Interaction Data | @vercel/ai | Low | Unclassified data | Review and define retention policy |
| Stored User Data | prisma | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | category:Personal Identity Data | Low | Unclassified data | Review and define retention policy |
| Financial Data | category:Financial Data | Low | Unclassified data | Review and define retention policy |
| Usage & Behavioral Data | category:Usage & Behavioral Data | Low | Behavioral — analytics | 26 months |
| AI Interaction Data | category:AI Interaction Data | Low | Unclassified data | Review and define retention policy |
| Communication Data | category:Communication Data | Low | Unclassified data | Review and define retention policy |
| Stored User Data | category:Stored User Data | Low | Unclassified data | Review and define retention policy |


---

## Recommendations

### Special Category Data (Art. 9) — 1 field(s)

- **Explicit consent required** (Art. 9(2)(a)): Standard consent is not sufficient; obtain explicit, informed consent for each specific purpose
- **Data Protection Impact Assessment (DPIA)** required under Art. 35 before processing
- **Appoint a Data Protection Officer (DPO)** if processing special categories at scale
- **Encryption at rest and in transit** is mandatory; consider additional access controls
- **Minimize collection**: Only collect what is strictly necessary for the stated purpose
- **Audit logging**: Maintain detailed access logs for all special category data

### High Sensitivity Data — 10 field(s)

- **Encrypt at rest and in transit** using industry-standard algorithms (AES-256, TLS 1.2+)
- **Tokenize payment data** — never store raw card numbers (PCI DSS requirement)
- **Hash credentials** with bcrypt, scrypt, or Argon2; never store plaintext passwords
- **Limit access** to personnel with a business need; implement role-based access control
- **Retain per regulatory requirements** (e.g., 7 years for financial records)
- **Regular security audits** and penetration testing recommended

### Medium Sensitivity Data — 16 field(s)

- **Encrypt in transit** (TLS 1.2+); encrypt at rest where feasible
- **Obtain clear consent** before collection; provide opt-out mechanisms
- **Allow user access and deletion** per GDPR Art. 15-17 (right of access, rectification, erasure)
- **Pseudonymize** where possible to reduce risk
- **Define clear retention periods** and automate data deletion

### Low Sensitivity Data — 31 field(s)

- **Encrypt in transit** (TLS 1.2+)
- **Anonymize or aggregate** analytics data where possible
- **Honor Do Not Track / Global Privacy Control** signals
- **Set appropriate retention periods** (typically 90 days for logs, 26 months for analytics)
- **Disclose in privacy policy** even for low-sensitivity data

---

*This classification is auto-generated based on code analysis. It should be reviewed by your legal and security teams. Data classification may change as your application evolves — re-run this scan regularly.*
