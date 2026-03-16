# Data Classification Report

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Project:** pocketbase
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
| Special Category (Art. 9) | 0 | Health, biometric, genetic, racial, political, religious, sexual orientation, trade union |
| High | 15 | Financial (PCI), government ID (SSN), authentication credentials |
| Medium | 2 | Contact info (email, phone), identity (name, DOB), location |
| Low | 42 | Behavioral (analytics), technical (IP, device info), preferences |

**Total classified fields:** 59

---

## Detailed Classification

| Field | Source | Sensitivity | GDPR Category | Retention |
|-------|--------|-------------|---------------|----------|
| passwords detected in Go struct fields: EmailChangeConfirmForm.Password, authMethodsResponse.Password, recordConfirmPasswordResetForm.Password, authWithOTPForm.Password, authWithPasswordForm.Password, RecordCreateOTPRequestEvent.Password, RecordAuthWithPasswordRequestEvent.Password, SMTPConfig.Password, RecordUpsert.password, SMTPClient.Password. | EmailChangeConfirmForm.Password | High | Authentication credential | Until account deletion; rotate regularly |
| passwords detected in Go struct fields: EmailChangeConfirmForm.Password, authMethodsResponse.Password, recordConfirmPasswordResetForm.Password, authWithOTPForm.Password, authWithPasswordForm.Password, RecordCreateOTPRequestEvent.Password, RecordAuthWithPasswordRequestEvent.Password, SMTPConfig.Password, RecordUpsert.password, SMTPClient.Password. | authMethodsResponse.Password | High | Authentication credential | Until account deletion; rotate regularly |
| passwords detected in Go struct fields: EmailChangeConfirmForm.Password, authMethodsResponse.Password, recordConfirmPasswordResetForm.Password, authWithOTPForm.Password, authWithPasswordForm.Password, RecordCreateOTPRequestEvent.Password, RecordAuthWithPasswordRequestEvent.Password, SMTPConfig.Password, RecordUpsert.password, SMTPClient.Password. | recordConfirmPasswordResetForm.Password | High | Authentication credential | Until account deletion; rotate regularly |
| passwords detected in Go struct fields: EmailChangeConfirmForm.Password, authMethodsResponse.Password, recordConfirmPasswordResetForm.Password, authWithOTPForm.Password, authWithPasswordForm.Password, RecordCreateOTPRequestEvent.Password, RecordAuthWithPasswordRequestEvent.Password, SMTPConfig.Password, RecordUpsert.password, SMTPClient.Password. | authWithOTPForm.Password | High | Authentication credential | Until account deletion; rotate regularly |
| passwords detected in Go struct fields: EmailChangeConfirmForm.Password, authMethodsResponse.Password, recordConfirmPasswordResetForm.Password, authWithOTPForm.Password, authWithPasswordForm.Password, RecordCreateOTPRequestEvent.Password, RecordAuthWithPasswordRequestEvent.Password, SMTPConfig.Password, RecordUpsert.password, SMTPClient.Password. | authWithPasswordForm.Password | High | Authentication credential | Until account deletion; rotate regularly |
| passwords detected in Go struct fields: EmailChangeConfirmForm.Password, authMethodsResponse.Password, recordConfirmPasswordResetForm.Password, authWithOTPForm.Password, authWithPasswordForm.Password, RecordCreateOTPRequestEvent.Password, RecordAuthWithPasswordRequestEvent.Password, SMTPConfig.Password, RecordUpsert.password, SMTPClient.Password. | RecordCreateOTPRequestEvent.Password | High | Authentication credential | Until account deletion; rotate regularly |
| passwords detected in Go struct fields: EmailChangeConfirmForm.Password, authMethodsResponse.Password, recordConfirmPasswordResetForm.Password, authWithOTPForm.Password, authWithPasswordForm.Password, RecordCreateOTPRequestEvent.Password, RecordAuthWithPasswordRequestEvent.Password, SMTPConfig.Password, RecordUpsert.password, SMTPClient.Password. | RecordAuthWithPasswordRequestEvent.Password | High | Authentication credential | Until account deletion; rotate regularly |
| passwords detected in Go struct fields: EmailChangeConfirmForm.Password, authMethodsResponse.Password, recordConfirmPasswordResetForm.Password, authWithOTPForm.Password, authWithPasswordForm.Password, RecordCreateOTPRequestEvent.Password, RecordAuthWithPasswordRequestEvent.Password, SMTPConfig.Password, RecordUpsert.password, SMTPClient.Password. | SMTPConfig.Password | High | Authentication credential | Until account deletion; rotate regularly |
| passwords detected in Go struct fields: EmailChangeConfirmForm.Password, authMethodsResponse.Password, recordConfirmPasswordResetForm.Password, authWithOTPForm.Password, authWithPasswordForm.Password, RecordCreateOTPRequestEvent.Password, RecordAuthWithPasswordRequestEvent.Password, SMTPConfig.Password, RecordUpsert.password, SMTPClient.Password. | RecordUpsert.password | High | Authentication credential | Until account deletion; rotate regularly |
| passwords detected in Go struct fields: EmailChangeConfirmForm.Password, authMethodsResponse.Password, recordConfirmPasswordResetForm.Password, authWithOTPForm.Password, authWithPasswordForm.Password, RecordCreateOTPRequestEvent.Password, RecordAuthWithPasswordRequestEvent.Password, SMTPConfig.Password, RecordUpsert.password, SMTPClient.Password. | SMTPClient.Password | High | Authentication credential | Until account deletion; rotate regularly |
| email addresses detected in Go struct fields: createOTPForm.Email, recordRequestPasswordResetForm.Email, recordRequestVerificationForm.Email, TestEmailSend.Email, AuthUser.Email. | createOTPForm.Email | High | Authentication — MFA | Until account deletion |
| email addresses detected in Go struct fields: createOTPForm.Email, recordRequestPasswordResetForm.Email, recordRequestVerificationForm.Email, TestEmailSend.Email, AuthUser.Email. | recordRequestPasswordResetForm.Email | High | Authentication — MFA | Until account deletion |
| email addresses detected in Go struct fields: createOTPForm.Email, recordRequestPasswordResetForm.Email, recordRequestVerificationForm.Email, TestEmailSend.Email, AuthUser.Email. | recordRequestVerificationForm.Email | High | Authentication — MFA | Until account deletion |
| email addresses detected in Go struct fields: createOTPForm.Email, recordRequestPasswordResetForm.Email, recordRequestVerificationForm.Email, TestEmailSend.Email, AuthUser.Email. | TestEmailSend.Email | High | Authentication — MFA | Until account deletion |
| email addresses detected in Go struct fields: createOTPForm.Email, recordRequestPasswordResetForm.Email, recordRequestVerificationForm.Email, TestEmailSend.Email, AuthUser.Email. | AuthUser.Email | High | Authentication — MFA | Until account deletion |
| Location Data | Cron.timezone | Medium | Location data | 26 months max |
| Location Data | category:Location Data | Medium | Location data | 26 months max |
| Personal Identity Data | backupCreateForm.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | providerInfo.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | providerInfo.DisplayName | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | baseCollection.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | OAuth2KnownFields.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | OAuth2KnownFields.Username | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | OAuth2ProviderConfig.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | OAuth2ProviderConfig.DisplayName | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | TableInfoRow.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | BackupEvent.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | AutodateField.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | BoolField.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | DateField.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | EditorField.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | EmailField.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | FileField.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | GeoPointField.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | JSONField.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | NumberField.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | PasswordField.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | RelationField.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | SelectField.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | TextField.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | URLField.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | SMTPConfig.Username | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | OldCollectionModel.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | releaseAsset.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | release.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | ApiScenario.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | AuthUser.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | AuthUser.Username | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | BaseProvider.displayName | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | IndexColumn.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | File.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | ListObjectsResponse.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | ListObjectContent.DisplayName | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | SMTPClient.Username | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | SortField.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | Message.Name | Low | Unclassified data | Review and define retention policy |
| Personal Identity Data | category:Personal Identity Data | Low | Unclassified data | Review and define retention policy |
| Authentication Data | category:Authentication Data | Low | Unclassified data | Review and define retention policy |
| Contact Information | category:Contact Information | Low | Unclassified data | Review and define retention policy |


---

## Recommendations

### High Sensitivity Data — 15 field(s)

- **Encrypt at rest and in transit** using industry-standard algorithms (AES-256, TLS 1.2+)
- **Tokenize payment data** — never store raw card numbers (PCI DSS requirement)
- **Hash credentials** with bcrypt, scrypt, or Argon2; never store plaintext passwords
- **Limit access** to personnel with a business need; implement role-based access control
- **Retain per regulatory requirements** (e.g., 7 years for financial records)
- **Regular security audits** and penetration testing recommended

### Medium Sensitivity Data — 2 field(s)

- **Encrypt in transit** (TLS 1.2+); encrypt at rest where feasible
- **Obtain clear consent** before collection; provide opt-out mechanisms
- **Allow user access and deletion** per GDPR Art. 15-17 (right of access, rectification, erasure)
- **Pseudonymize** where possible to reduce risk
- **Define clear retention periods** and automate data deletion

### Low Sensitivity Data — 42 field(s)

- **Encrypt in transit** (TLS 1.2+)
- **Anonymize or aggregate** analytics data where possible
- **Honor Do Not Track / Global Privacy Control** signals
- **Set appropriate retention periods** (typically 90 days for logs, 26 months for analytics)
- **Disclose in privacy policy** even for low-sensitivity data

---

*This classification is auto-generated based on code analysis. It should be reviewed by your legal and security teams. Data classification may change as your application evolves — re-run this scan regularly.*
