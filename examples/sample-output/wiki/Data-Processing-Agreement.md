> **Document Version:** 1.0  
> **Document Owner:** Acme Inc  
> **Next Review Date:** 2027-03-18


**Last updated:** 2026-03-18

**Data Controller:** Acme Inc

**Contact:** legal@acme.com

## Review Notes

### What a lawyer should check

- Review all clauses against GDPR Article 28 requirements
- Confirm sub-processor list is complete
- Verify data transfer mechanisms (SCCs) are current
- Check audit rights provisions
- Validate data deletion/return obligations

### Auto-generated vs. needs human input

| Section | Status | Confidence |
|---------|--------|------------|
| Contract clauses | Standard GDPR template | Medium |
| Sub-processor list | Auto-detected from code | High |
| Technical measures | Template defaults | Low |
## Related Documents

- Privacy Policy (`PRIVACY_POLICY.md`)
- Sub-Processor List (`SUBPROCESSOR_LIST.md`)
- Transfer Impact Assessment (`TRANSFER_IMPACT_ASSESSMENT.md`)
- Supplier Code of Conduct (`SUPPLIER_CODE_OF_CONDUCT.md`)

---

> This Data Processing Agreement ("DPA") is entered into pursuant to Article 28 of the General Data Protection Regulation (EU) 2016/679 ("GDPR"). It governs the processing of personal data by third-party processors on behalf of the Controller in connection with the **nextjs-saas-example** application.

## 1. Subject Matter and Duration of Processing

This DPA governs the processing of personal data by the sub-processors listed herein for the duration of the service agreement between the Controller and each respective processor. Processing begins when the service is activated and continues until the service agreement is terminated and all personal data is returned or deleted.

## 2. Nature and Purpose of Processing

Personal data is processed for the following purposes:

- Providing and maintaining the application's core functionality
- Processing user requests through third-party service integrations
- Analytics and performance monitoring
- Communication with users
- Payment processing and billing

> **Important:** Customize this section to describe your specific processing purposes.

## 3. Types of Personal Data Processed

Based on automated code analysis, the following categories of personal data are processed:

- **Personal Identity Data:** Email addresses, names, profile pictures, and account credentials collected through authentication. names detected in Prisma schema fields: User.name.
- **Financial Data:** Payment card information, billing addresses, and transaction history processed through payment providers.
- **Usage & Behavioral Data:** Page views, click patterns, session recordings, device information, and IP addresses collected through analytics tools.
- **AI Interaction Data:** User prompts, conversation history, and AI-generated content processed through third-party AI services.
- **Communication Data:** Email addresses and email content processed through email service providers.
- **Technical & Diagnostic Data:** Error reports, stack traces, performance data, and user context collected through monitoring tools.
- **Stored User Data:** Persistent user data stored in databases as defined by the application schema.
- **Contact Information:** email addresses, phone numbers detected in Prisma schema fields: User.email, User.phone.
- **Authentication Data:** password hashes detected in Prisma schema fields: User.passwordHash.

## 4. Categories of Data Subjects

The following categories of data subjects may be affected by the processing:

- End users of the application
- Registered account holders
- Website visitors
- Customers and prospective customers
- Business contacts

> **Important:** Customize this list to reflect the actual categories of data subjects for your application.

## 5. Obligations of the Processor

Each processor shall:

1. Process personal data only on documented instructions from the Controller, unless required by EU or Member State law
2. Ensure that persons authorized to process the personal data have committed to confidentiality
3. Take all measures required pursuant to Article 32 of the GDPR (security of processing)
4. Respect the conditions for engaging sub-processors as outlined in this DPA
5. Assist the Controller in responding to data subject requests (access, rectification, erasure, portability, restriction, and objection)
6. Assist the Controller in ensuring compliance with Articles 32 to 36 of the GDPR (security, breach notification, impact assessments, and prior consultation)
7. At the Controller's choice, delete or return all personal data upon termination of services
8. Make available all information necessary to demonstrate compliance and allow for audits

## 6. Sub-Processors

The following sub-processors are authorized to process personal data on behalf of the Controller:

| Sub-Processor | Category | Data Processed |
|--------------|----------|---------------|
| @sentry/node | monitoring | error data, stack traces, user context, device information, IP address |
| openai | ai | user prompts, conversation history, generated content |
| posthog | analytics | user behavior, session recordings, feature flag usage, device information |
| resend | email | email addresses, email content |
| stripe | payment | payment information, billing address, email, transaction history |
| stripe-ios | payment | payment information, billing address, email, transaction history |

### 6.1 Sub-Processor Engagement

- The Controller provides general written authorization for the engagement of the sub-processors listed above
- The Processor shall inform the Controller of any intended changes concerning the addition or replacement of sub-processors, giving the Controller the opportunity to object
- The Processor shall impose the same data protection obligations as set out in this DPA on any sub-processor by way of a contract

## 7. International Data Transfers

Where personal data is transferred outside the European Economic Area (EEA):

- Transfers to countries with an EU adequacy decision are permitted without additional safeguards
- Transfers to the United States may be conducted under the **EU-US Data Privacy Framework** (DPF), where the recipient is certified under the DPF
- For all other transfers, Standard Contractual Clauses (SCCs) as adopted by the European Commission shall apply
- A Transfer Impact Assessment (TIA) shall be conducted where required

> **Important:** Verify the data transfer mechanisms used by each sub-processor and ensure appropriate safeguards are in place.

## 8. Security Measures

The Processor shall implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including as appropriate:

1. **Encryption:** Encryption of personal data in transit (TLS 1.2+) and at rest
2. **Access Controls:** Role-based access controls, multi-factor authentication, and principle of least privilege
3. **Availability:** Regular backups, disaster recovery procedures, and redundant systems
4. **Testing:** Regular testing, assessing, and evaluating the effectiveness of security measures
5. **Incident Response:** Documented incident response procedures and trained personnel
6. **Logging:** Audit logging of access to personal data
7. **Personnel:** Confidentiality agreements and data protection training for authorized personnel

## 9. Data Breach Notification

1. The Processor shall notify the Controller **without undue delay** after becoming aware of a personal data breach
2. Such notification shall include at minimum:
   - The nature of the breach, including categories and approximate number of data subjects and records concerned
   - The name and contact details of the data protection officer or other contact point
   - The likely consequences of the breach
   - The measures taken or proposed to address the breach, including mitigation measures
3. The Controller shall notify the supervisory authority within **72 hours** of becoming aware of a breach that is likely to result in a risk to the rights and freedoms of data subjects (Article 33 GDPR)
4. Where the breach is likely to result in a **high risk** to the rights and freedoms of data subjects, the Controller shall also notify the affected data subjects without undue delay (Article 34 GDPR)

## 10. Return and Deletion of Data

1. Upon termination of the processing services, the Processor shall, at the Controller's choice:
   - Return all personal data to the Controller in a commonly used, machine-readable format, **or**
   - Delete all personal data and certify such deletion in writing
2. The Processor may retain personal data only where required by EU or Member State law, and only for the period and purposes required by that law
3. Any retained data shall continue to be subject to the confidentiality obligations in this DPA

## 11. Controller's Rights

The Controller retains the right to:

- Monitor the Processor's compliance with this DPA
- Request information regarding the processing of personal data
- Conduct audits and inspections, either directly or through a mandated auditor
- Issue binding instructions regarding the processing of personal data

## 12. Governing Law

This DPA shall be governed by and construed in accordance with the laws of the European Union and the Member State in which the Controller is established.

## 13. Contact

For questions regarding this Data Processing Agreement:

- **Email:** legal@acme.com

---

*This Data Processing Agreement was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. This document is a template and must be reviewed by a legal professional to ensure compliance with GDPR Article 28 and other applicable data protection regulations. It does not constitute legal advice.*