> **Document Version:** 1.0  
> **Document Owner:** Acme Inc  
> **Next Review Date:** 2027-03-18


**Last updated:** 2026-03-18

**Acme Inc** — Frequently Asked Questions about Data Privacy & Compliance

> This FAQ is auto-generated from our actual codebase analysis. Every answer below is based on the services and data flows detected in our application.

*8 services detected across 7 categories.*

---

## Data Collection

### Q1: What personal data do you collect?

Based on our code analysis, we collect the following types of data:

- error data
- stack traces
- user context
- device information
- IP address
- email
- password hash
- session data
- user metadata
- user prompts
- conversation history
- generated content
- user behavior
- session recordings
- feature flag usage
- user data as defined in schema
- email addresses
- email content
- payment information
- billing address
- transaction history

This data is collected through 8 integrated service(s): @sentry/node, @supabase/supabase-js, openai, posthog, prisma, resend, stripe, stripe-ios.

### Q2: Why do you collect this data?

We collect data only when necessary to:

- **Provide our service** — core functionality requires certain data to operate
- **Ensure security** — protecting your account and our infrastructure
- **Improve our product** — understanding usage patterns helps us build better features
- **Process payments** — completing transactions you initiate
- **Power AI features** — delivering AI-assisted functionality you request
- **Comply with law** — meeting legal obligations (tax records, fraud prevention)

### Q3: Do you collect data from children?

No. Our service is not directed at children under 16 (or 13 in the US). We do not knowingly collect personal data from children. If we learn that we have collected data from a child, we will delete it promptly. Contact legal@acme.com if you believe a child has provided us data.

## Service-Specific Questions

### Q4: What data does openai receive?

**What openai receives:** Text prompts, conversation context, and any content you submit for AI processing. OpenAI may also receive metadata such as request timestamps and API version.

**What openai does NOT receive:** OpenAI does not receive your account password, payment details, or data from other parts of the application unrelated to AI features.

**Data collected via openai:** user prompts, conversation history, generated content

### Q5: What data does stripe receive?

**What stripe receives:** Payment card details (via their SDK), billing address, email, transaction amounts, and currency. Stripe also receives device fingerprint data for fraud prevention.

**What stripe does NOT receive:** Stripe does not receive your password, usage analytics, or content you create in the application.

**Data collected via stripe:** payment information, billing address, email, transaction history

## Data Sharing & Third Parties

### Q6: Do you sell my data?

**No. We do not sell your personal data.** We do not share your data with third parties for their own marketing purposes. Data is only shared with our service providers (sub-processors) who process data on our behalf under strict contractual obligations.

### Q7: Who do you share my data with?

We share data only with the service providers necessary to operate our product:

| @sentry/node | Error Monitoring | error data, stack traces, user context |
| @supabase/supabase-js | Authentication | email, password hash, session data |
| openai | AI Services | user prompts, conversation history, generated content |
| posthog | Analytics | user behavior, session recordings, feature flag usage |
| prisma | Database | user data as defined in schema |
| resend | Email Services | email addresses, email content |
| stripe | Payment Processing | payment information, billing address, email |
| stripe-ios | Payment Processing | payment information, billing address, email |

Each provider operates under a Data Processing Agreement (DPA) that limits how they can use your data. See our full Sub-Processor List for details.

### Q8: Do third parties have access to my raw data?

Third-party services receive only the minimum data necessary for their function. They are contractually prohibited from using your data for purposes other than providing their service to us.

## Data Retention

### Q9: How long do you keep my data?

Retention periods vary by data category:

| Category | Retention Period |
|----------|-----------------|
| Error Monitoring | Error logs and performance data are retained for up to 90 days. |
| Authentication | Account data is retained until you delete your account. Session data expires automatically. |
| AI Services | AI interaction data (prompts and responses) is retained for up to 90 days, then automatically purged. |
| Analytics | Analytics data is retained for up to 26 months, then automatically deleted or anonymized. |
| Database | User data is retained until you delete your account or request erasure. |
| Email Services | Email communication records are retained for up to 3 years. |
| Payment Processing | Transaction records are retained for 7 years as required by tax and financial regulations. |

**Default retention period:** 365 days for data not covered by a specific category.

### Q10: Can I request my data be deleted sooner?

Yes. You can request deletion of your personal data at any time by emailing legal@acme.com with the subject "Data Deletion Request." We will process your request within 30 days. Note: transaction records required by tax law (typically 7 years) cannot be deleted early.

## Data Security

### Q11: How do you protect my data?

We implement industry-standard security measures including:

- **Encryption in transit:** All data is transmitted over HTTPS/TLS 1.2+
- **Encryption at rest:** Stored data is encrypted using AES-256 or equivalent
- **Authentication security:** Passwords are hashed using bcrypt/argon2; MFA is supported
- **Monitoring:** Real-time error and security event monitoring
- **Access control:** Role-based access with principle of least privilege
- **Regular audits:** Periodic security reviews and vulnerability assessments

### Q12: What happens if there is a data breach?

We maintain a documented Incident Response Plan. In the event of a data breach:

1. We will investigate and contain the breach within 24 hours
2. We will notify affected users without undue delay (within 72 hours as required by GDPR)
3. We will notify the relevant supervisory authority where required
4. We will provide details on what data was affected and remediation steps

### Q13: Do you use encryption?

Yes. All data is encrypted both in transit (TLS 1.2+) and at rest (AES-256). API keys and credentials are stored in environment variables, never in source code.

## Your Rights

### Q14: What rights do I have over my data?

You have the following rights:

**Under GDPR (EU/EEA/UK):**
- **Access** — Request a copy of all data we hold about you
- **Rectification** — Request correction of inaccurate data
- **Erasure** — Request deletion of your data ("right to be forgotten")
- **Portability** — Receive your data in a machine-readable format
- **Restriction** — Request we limit processing of your data
- **Object** — Object to processing based on legitimate interest
- **Withdraw consent** — Withdraw consent at any time where processing is consent-based

### Q15: How do I exercise my data rights?

Contact us at legal@acme.com with your request. Please include:

1. Your name and email associated with your account
2. The specific right you wish to exercise
3. Any details to help us locate your data

We will respond within 30 days.

## AI & Automated Processing

### Q16: Do you use AI/machine learning?

Yes. We use the following AI services: **openai**.

AI-powered chat assistant that helps users draft content using OpenAI GPT-4o. User messages are sent to OpenAI for processing. No automated decision-making is performed.

### Q17: Is my data used to train AI models?

By default, **no**. We configure our AI providers to not use your data for model training. Your prompts and interactions are processed to deliver the AI feature you requested, then retained according to our data retention schedule (typically 90 days).

### Q18: Can I opt out of AI features?

Where AI features are optional, you can choose not to use them. For AI features that are core to the service, you can contact legal@acme.com to discuss alternatives. We are transparent about which features use AI — see our AI Disclosure document for full details.

### Q19: What decisions are made by AI?

AI features are used to assist and augment your experience, not to make autonomous decisions that significantly affect you. A human is always in the loop for consequential decisions.

## Cookies & Tracking

### Q20: Do you use cookies?

Yes. We use cookies for:

- **Essential cookies** — Required for authentication and security
- **Functional cookies** — Remembering your preferences
- **Analytics cookies** — Understanding how our product is used (aggregated, anonymized)

See our Cookie Policy for the complete cookie inventory.

### Q21: How do I control cookies?

- **Cookie banner:** Accept or reject non-essential cookies when you first visit
- **Browser settings:** Block or delete cookies through your browser preferences
- **Account settings:** Manage tracking preferences in your account (where available)

### Q22: Do you use fingerprinting or tracking pixels?

We do not use browser fingerprinting. We may use standard analytics tools that set cookies with your consent.

## International Data Transfers

### Q23: Where is my data stored?

Data may be processed in the following regions based on our service providers:

- **@sentry/node** — Processes data as described in their privacy policy
- **@supabase/supabase-js** — Processes data as described in their privacy policy
- **openai** — Processes data as described in their privacy policy
- **posthog** — Processes data as described in their privacy policy
- **prisma** — Processes data as described in their privacy policy
- **resend** — Processes data as described in their privacy policy
- **stripe** — Processes data as described in their privacy policy
- **stripe-ios** — Processes data as described in their privacy policy

Many of our providers operate infrastructure in the US and EU. We ensure appropriate safeguards are in place for any international transfers.

### Q24: How do you protect international data transfers?

We rely on the following mechanisms to protect data transferred outside the EU/EEA:

- **Standard Contractual Clauses (SCCs)** — Approved by the European Commission
- **Data Processing Agreements** — Binding contractual obligations on each provider
- **Adequacy decisions** — Where available (e.g., EU-US Data Privacy Framework)
- **Supplementary measures** — Additional technical and organizational safeguards where needed

## Payments & Billing

### Q25: Do you store my credit card number?

**No.** Payment processing is handled entirely by our payment processor. We never see, transmit, or store your full credit card number. We only retain a tokenized reference and basic transaction metadata (amount, date, status).

### Q26: Is my payment information secure?

Yes. Our payment processor is PCI DSS Level 1 certified — the highest level of payment security certification. All payment data is encrypted end-to-end.

### Q27: What happens to my payment data if I cancel?

Transaction records are retained for 7 years as required by tax and financial regulations. Your payment method details are removed from our systems when you cancel or request deletion.

## General

### Q28: How will I know if this policy changes?

We will notify you of material changes through:

- Email notification to the address associated with your account
- A prominent notice on our website at https://acme-saas.com
- Updated "Last updated" date on our Privacy Policy

### Q29: Who is responsible for data protection?

Our Data Protection Officer is **Jane Mueller** (dpo@acme-saas.com).

### Q30: How can I file a complaint?

If you believe your data protection rights have been violated:

1. **Contact us first** at legal@acme.com — we take every complaint seriously
2. **Supervisory authority** — You have the right to lodge a complaint with your local data protection authority (e.g., your national DPA in the EU/EEA)

### Q31: Do you comply with GDPR/CCPA?

Yes. We comply with the GDPR (EU General Data Protection Regulation) and apply its standards to all users regardless of location.

### Q32: Where can I find your full Privacy Policy?

Our complete Privacy Policy is available at https://acme-saas.com/privacy. It provides detailed information about all data processing activities, legal bases, and your rights.

## Technical Questions

### Q33: Can I export all my data?

Yes. You can request a full export of your personal data in a machine-readable format (JSON/CSV) by contacting legal@acme.com. This is your right to data portability under GDPR Article 20.

### Q34: What happens to my data when I delete my account?

When you delete your account:

1. Your profile and account data is permanently deleted within 30 days
2. Content you created is removed from primary systems within 30 days
3. Backup copies are purged within 90 days
4. Anonymized/aggregated data that cannot identify you may be retained
5. Transaction records required by law are retained for the mandated period


---

## Contact

For any privacy-related questions not covered in this FAQ, contact us at:

- **Email:** legal@acme.com
- **Data Protection Officer:** dpo@acme-saas.com
- **Website:** https://acme-saas.com

---

*This FAQ was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis of 8 detected services. It should be reviewed by a qualified legal professional before publication.*