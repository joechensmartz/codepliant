# Data Retention Policy

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** calcom-monorepo

**Data Controller:** [Your Company Name]

## Related Documents

- Privacy Policy (`PRIVACY_POLICY.md`)
- Record of Processing Activities (`RECORD_OF_PROCESSING_ACTIVITIES.md`)
- Data Dictionary (`DATA_DICTIONARY.md`)
- DSAR Handling Guide (`DSAR_HANDLING_GUIDE.md`)

---

## 1. Introduction

This Data Retention Policy describes how [Your Company Name] retains, manages, and deletes personal data collected through our services. It supplements our Privacy Policy and applies to all personal data we process.

We retain personal data only for as long as necessary to fulfill the purposes for which it was collected, comply with legal obligations, resolve disputes, and enforce our agreements.

**Contact:** [your-email@example.com]


---

## 2. Retention Schedule

The following table summarizes our data retention periods by category:

| Data Category | Data Types | Retention Period | Legal Basis |
|--------------|-----------|-----------------|-------------|
| Other | Service-specific operational data | 1 year | Legitimate interest (Art. 6(1)(f) GDPR) |
| Email Service | Email addresses, message metadata, delivery logs | 3 years | Legitimate interest (Art. 6(1)(f) GDPR) |
| Error Monitoring | Error reports, stack traces, performance metrics, IP addresses | 90 days | Legitimate interest (Art. 6(1)(f) GDPR) |
| Database | User-created content, preferences, application data | Until account deletion | Contractual necessity (Art. 6(1)(b) GDPR) |
| Analytics | Page views, click events, session recordings, device information | 2 years | Consent (Art. 6(1)(a) GDPR) |
| Authentication | Account credentials, profile information, session tokens | Until account deletion | Contractual necessity (Art. 6(1)(b) GDPR) |
| Payment Processing | Transaction history, billing addresses, payment method metadata | 7 years | Legal obligation (Art. 6(1)(c) GDPR) |


---

## 3. Retention Details by Service Category

### Other

- **What data is retained:** Service-specific operational data
- **Retention period:** Data retained as long as necessary for the service
- **Legal basis:** Legitimate interest (Art. 6(1)(f) GDPR) — Retained as necessary to support service operations.
- **Deletion procedure:** Data is deleted upon request or after the retention period, whichever comes first.

### Email Service

- **What data is retained:** Email addresses, message metadata, delivery logs
- **Retention period:** Email communication records retained for up to 3 years
- **Legal basis:** Legitimate interest (Art. 6(1)(f) GDPR) — Retained to maintain communication records and resolve disputes.
- **Deletion procedure:** Email communication records are deleted upon request or after the retention period, whichever comes first.

### Error Monitoring

- **What data is retained:** Error reports, stack traces, performance metrics, IP addresses
- **Retention period:** Error and performance data retained for up to 90 days
- **Legal basis:** Legitimate interest (Art. 6(1)(f) GDPR) — Retained to detect, diagnose, and resolve errors and security incidents.
- **Deletion procedure:** Error logs and performance data are automatically rotated and purged after the retention period.

### Database

- **What data is retained:** User-created content, preferences, application data
- **Retention period:** User data retained until you delete your account
- **Legal basis:** Contractual necessity (Art. 6(1)(b) GDPR) — Core user data required to operate the service. Deleted upon account closure.
- **Deletion procedure:** User records are permanently erased from primary databases within 30 days of a deletion request. Backup copies are purged within 90 days.

### Analytics

- **What data is retained:** Page views, click events, session recordings, device information
- **Retention period:** Analytics data retained for up to 26 months
- **Legal basis:** Consent (Art. 6(1)(a) GDPR) — Retained with your opt-in consent to improve our service. You may withdraw consent at any time.
- **Deletion procedure:** Analytics data is anonymized or deleted upon consent withdrawal. Aggregated, non-identifiable statistics may be retained indefinitely.

### Authentication

- **What data is retained:** Account credentials, profile information, session tokens
- **Retention period:** Account data retained until you delete your account
- **Legal basis:** Contractual necessity (Art. 6(1)(b) GDPR) — Required to maintain your account and provide the service you signed up for.
- **Deletion procedure:** Account data is permanently erased from all primary systems within 30 days of account deletion. Backups are purged within 90 days.

### Payment Processing

- **What data is retained:** Transaction history, billing addresses, payment method metadata
- **Retention period:** Transaction records retained for 7 years (tax and legal compliance)
- **Legal basis:** Legal obligation (Art. 6(1)(c) GDPR) — Tax laws and financial regulations require retention of transaction records for a minimum of 7 years.
- **Deletion procedure:** Transaction records cannot be deleted before the legally mandated retention period expires. After expiry, records are automatically purged.


---

## 4. Data Deletion Request Process

You have the right to request deletion of your personal data at any time. To submit a deletion request:

### How to Request

1. **Email:** Send a deletion request to [your-email@example.com] with the subject line "Data Deletion Request."
2. **Account settings:** If available, use the self-service account deletion option in your account settings.

### What Happens Next

1. **Acknowledgment:** We will acknowledge your request within 3 business days.
2. **Verification:** We will verify your identity to prevent unauthorized deletion.
3. **Processing:** Eligible data will be deleted from primary systems within 30 days of verification.
4. **Confirmation:** You will receive a confirmation email once deletion is complete.

### Exceptions

Certain data may not be eligible for immediate deletion:

- **Legal holds:** Data subject to active litigation, regulatory investigation, or legal preservation requirements.
- **Tax and financial records:** Transaction records that must be retained for the legally mandated period (typically 7 years).
- **Aggregated/anonymized data:** Fully anonymized data that can no longer be linked to you is not considered personal data and may be retained indefinitely.
- **Security logs:** Minimal security event logs may be retained to protect against fraud and abuse.

### Partial Deletion

If you request deletion of specific categories of data rather than full account deletion, we will process the request for those categories while preserving the rest of your account.


---

## 5. Backup Retention Policy

### Backup Schedule

[Your Company Name] maintains regular backups to protect against data loss and ensure business continuity:

- **Daily backups:** Retained for 30 days
- **Weekly backups:** Retained for 90 days
- **Monthly backups:** Retained for 1 year

### Data Deletion in Backups

When personal data is deleted from primary systems:

1. The data will not be actively restored from backups.
2. Backup copies containing the deleted data will be purged as they naturally expire according to the backup rotation schedule above.
3. Maximum time for complete purge from all backup systems: **90 days** from deletion in primary systems.

### Backup Security

- All backups are encrypted at rest using industry-standard encryption (AES-256 or equivalent).
- Access to backup systems is restricted to authorized personnel only.
- Backup restoration is logged and audited.

### Disaster Recovery

In the event of a disaster recovery scenario where backups must be restored:

- Any previously processed deletion requests will be re-applied to the restored data.
- Affected individuals will be notified if their data is temporarily restored during recovery.


---

## 6. Retention Review Process

[Your Company Name] conducts periodic reviews of its data retention practices:

- **Quarterly reviews:** Verify that automated purge processes are functioning correctly.
- **Annual reviews:** Assess whether retention periods remain appropriate and aligned with legal requirements.
- **Ad-hoc reviews:** Triggered by changes in applicable law, business operations, or service offerings.

All retention period changes are documented and communicated through an updated version of this policy.


---

## 7. Contact

For questions about this Data Retention Policy or to exercise your data rights, contact us at:

- **Email:** [your-email@example.com]

---

*This Data Retention Policy was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. It should be reviewed by a qualified legal professional before use.*