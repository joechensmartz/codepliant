# Compliance FAQ

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**[Your Company Name]** — Frequently Asked Questions about Data Privacy & Compliance

> This FAQ is auto-generated from our actual codebase analysis. Every answer below is based on the services and data flows detected in our application.

*10 services detected across 8 categories.*

---

## Data Collection

### Q1: What personal data do you collect?

Based on our code analysis, we collect the following types of data:

- uploaded files
- file metadata
- error data
- stack traces
- user context
- device information
- IP address
- user data via Google APIs
- calendar data
- email data
- profile information
- cached data
- session data
- email
- name
- profile picture
- OAuth tokens
- email addresses
- email content
- user behavior
- session recordings
- feature flag usage
- user data as defined in schema
- payment information
- billing address
- transaction history

This data is collected through 10 integrated service(s): @aws-sdk/client-s3, @sentry/nextjs, googleapis, ioredis, next-auth, nodemailer, posthog, prisma, redis, stripe.

### Q2: Why do you collect this data?

We collect data only when necessary to:

- **Provide our service** — core functionality requires certain data to operate
- **Ensure security** — protecting your account and our infrastructure
- **Improve our product** — understanding usage patterns helps us build better features
- **Process payments** — completing transactions you initiate
- **Comply with law** — meeting legal obligations (tax records, fraud prevention)

### Q3: Do you collect data from children?

No. Our service is not directed at children under 16 (or 13 in the US). We do not knowingly collect personal data from children. If we learn that we have collected data from a child, we will delete it promptly. Contact [your-email@example.com] if you believe a child has provided us data.

## Service-Specific Questions

### Q4: What data does stripe receive?

**What stripe receives:** Payment card details (via their SDK), billing address, email, transaction amounts, and currency. Stripe also receives device fingerprint data for fraud prevention.

**What stripe does NOT receive:** Stripe does not receive your password, usage analytics, or content you create in the application.

**Data collected via stripe:** payment information, billing address, email, transaction history

## Data Sharing & Third Parties

### Q5: Do you sell my data?

**No. We do not sell your personal data.** We do not share your data with third parties for their own marketing purposes. Data is only shared with our service providers (sub-processors) who process data on our behalf under strict contractual obligations.

### Q6: Who do you share my data with?

We share data only with the service providers necessary to operate our product:

| @aws-sdk/client-s3 | File Storage | uploaded files, file metadata |
| @sentry/nextjs | Error Monitoring | error data, stack traces, user context |
| googleapis | Other Services | user data via Google APIs, calendar data, email data |
| ioredis | Database | cached data, session data |
| next-auth | Authentication | email, name, profile picture |
| nodemailer | Email Services | email addresses, email content |
| posthog | Analytics | user behavior, session recordings, feature flag usage |
| prisma | Database | user data as defined in schema |
| redis | Database | cached data, session data |
| stripe | Payment Processing | payment information, billing address, email |

Each provider operates under a Data Processing Agreement (DPA) that limits how they can use your data. See our full Sub-Processor List for details.

### Q7: Do third parties have access to my raw data?

Third-party services receive only the minimum data necessary for their function. They are contractually prohibited from using your data for purposes other than providing their service to us.

## Data Retention

### Q8: How long do you keep my data?

Retention periods vary by data category:

| Category | Retention Period |
|----------|-----------------|
| File Storage | Uploaded files are retained until you delete them or close your account. |
| Error Monitoring | Error logs and performance data are retained for up to 90 days. |
| Other Services | Data is retained as long as necessary for the service, typically no more than 1 year. |
| Database | User data is retained until you delete your account or request erasure. |
| Authentication | Account data is retained until you delete your account. Session data expires automatically. |
| Email Services | Email communication records are retained for up to 3 years. |
| Analytics | Analytics data is retained for up to 26 months, then automatically deleted or anonymized. |
| Payment Processing | Transaction records are retained for 7 years as required by tax and financial regulations. |

### Q9: Can I request my data be deleted sooner?

Yes. You can request deletion of your personal data at any time by emailing [your-email@example.com] with the subject "Data Deletion Request." We will process your request within 30 days. Note: transaction records required by tax law (typically 7 years) cannot be deleted early.

## Data Security

### Q10: How do you protect my data?

We implement industry-standard security measures including:

- **Encryption in transit:** All data is transmitted over HTTPS/TLS 1.2+
- **Encryption at rest:** Stored data is encrypted using AES-256 or equivalent
- **Authentication security:** Passwords are hashed using bcrypt/argon2; MFA is supported
- **Monitoring:** Real-time error and security event monitoring
- **Access control:** Role-based access with principle of least privilege
- **Regular audits:** Periodic security reviews and vulnerability assessments

### Q11: What happens if there is a data breach?

We maintain a documented Incident Response Plan. In the event of a data breach:

1. We will investigate and contain the breach within 24 hours
2. We will notify affected users without undue delay (within 72 hours as required by GDPR)
3. We will notify the relevant supervisory authority where required
4. We will provide details on what data was affected and remediation steps

### Q12: Do you use encryption?

Yes. All data is encrypted both in transit (TLS 1.2+) and at rest (AES-256). API keys and credentials are stored in environment variables, never in source code.

## Your Rights

### Q13: What rights do I have over my data?

You have the following rights:

**Under GDPR (EU/EEA/UK):**
- **Access** — Request a copy of all data we hold about you
- **Rectification** — Request correction of inaccurate data
- **Erasure** — Request deletion of your data ("right to be forgotten")
- **Portability** — Receive your data in a machine-readable format
- **Restriction** — Request we limit processing of your data
- **Object** — Object to processing based on legitimate interest
- **Withdraw consent** — Withdraw consent at any time where processing is consent-based

### Q14: How do I exercise my data rights?

Contact us at [your-email@example.com] with your request. Please include:

1. Your name and email associated with your account
2. The specific right you wish to exercise
3. Any details to help us locate your data

We will respond within 30 days.

## Cookies & Tracking

### Q15: Do you use cookies?

Yes. We use cookies for:

- **Essential cookies** — Required for authentication and security
- **Functional cookies** — Remembering your preferences
- **Analytics cookies** — Understanding how our product is used (aggregated, anonymized)

See our Cookie Policy for the complete cookie inventory.

### Q16: How do I control cookies?

- **Cookie banner:** Accept or reject non-essential cookies when you first visit
- **Browser settings:** Block or delete cookies through your browser preferences
- **Account settings:** Manage tracking preferences in your account (where available)

### Q17: Do you use fingerprinting or tracking pixels?

We do not use browser fingerprinting. We may use standard analytics tools that set cookies with your consent.

## International Data Transfers

### Q18: Where is my data stored?

Data may be processed in the following regions based on our service providers:

- **@aws-sdk/client-s3** — Processes data as described in their privacy policy
- **@sentry/nextjs** — Processes data as described in their privacy policy
- **googleapis** — Processes data as described in their privacy policy
- **ioredis** — Processes data as described in their privacy policy
- **next-auth** — Processes data as described in their privacy policy
- **nodemailer** — Processes data as described in their privacy policy
- **posthog** — Processes data as described in their privacy policy
- **prisma** — Processes data as described in their privacy policy
- **redis** — Processes data as described in their privacy policy
- **stripe** — Processes data as described in their privacy policy

Many of our providers operate infrastructure in the US and EU. We ensure appropriate safeguards are in place for any international transfers.

### Q19: How do you protect international data transfers?

We rely on the following mechanisms to protect data transferred outside the EU/EEA:

- **Standard Contractual Clauses (SCCs)** — Approved by the European Commission
- **Data Processing Agreements** — Binding contractual obligations on each provider
- **Adequacy decisions** — Where available (e.g., EU-US Data Privacy Framework)
- **Supplementary measures** — Additional technical and organizational safeguards where needed

## Payments & Billing

### Q20: Do you store my credit card number?

**No.** Payment processing is handled entirely by our payment processor. We never see, transmit, or store your full credit card number. We only retain a tokenized reference and basic transaction metadata (amount, date, status).

### Q21: Is my payment information secure?

Yes. Our payment processor is PCI DSS Level 1 certified — the highest level of payment security certification. All payment data is encrypted end-to-end.

### Q22: What happens to my payment data if I cancel?

Transaction records are retained for 7 years as required by tax and financial regulations. Your payment method details are removed from our systems when you cancel or request deletion.

## General

### Q23: How will I know if this policy changes?

We will notify you of material changes through:

- Email notification to the address associated with your account
- A prominent notice on our website at [your-website.com]
- Updated "Last updated" date on our Privacy Policy

### Q24: Who is responsible for data protection?

[Your Company Name] is the data controller. For data protection inquiries, contact [your-email@example.com].

### Q25: How can I file a complaint?

If you believe your data protection rights have been violated:

1. **Contact us first** at [your-email@example.com] — we take every complaint seriously
2. **Supervisory authority** — You have the right to lodge a complaint with your local data protection authority (e.g., your national DPA in the EU/EEA)

### Q26: Do you comply with GDPR/CCPA?

Yes. We comply with the GDPR (EU General Data Protection Regulation) and apply its standards to all users regardless of location.

### Q27: Where can I find your full Privacy Policy?

Our complete Privacy Policy is available at [your-website.com]/privacy. It provides detailed information about all data processing activities, legal bases, and your rights.

## Technical Questions

### Q28: Can I export all my data?

Yes. You can request a full export of your personal data in a machine-readable format (JSON/CSV) by contacting [your-email@example.com]. This is your right to data portability under GDPR Article 20.

### Q29: What happens to my data when I delete my account?

When you delete your account:

1. Your profile and account data is permanently deleted within 30 days
2. Content you created is removed from primary systems within 30 days
3. Backup copies are purged within 90 days
4. Anonymized/aggregated data that cannot identify you may be retained
5. Transaction records required by law are retained for the mandated period


---

## Contact

For any privacy-related questions not covered in this FAQ, contact us at:

- **Email:** [your-email@example.com]
- **Website:** [your-website.com]

---

*This FAQ was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis of 10 detected services. It should be reviewed by a qualified legal professional before publication.*