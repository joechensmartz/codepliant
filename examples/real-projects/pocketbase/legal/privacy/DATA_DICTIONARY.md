# Data Dictionary

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** pocketbase

**Company:** [Your Company Name]

## Related Documents

- Data Flow Map (`DATA_FLOW_MAP.md`)
- Data Retention Policy (`DATA_RETENTION_POLICY.md`)
- Data Classification Report (`DATA_CLASSIFICATION.md`)

---

## 1. Purpose

This document catalogs every data field detected across the **pocketbase** application. It serves as the authoritative reference for data mapping required by GDPR Article 30 (Records of Processing Activities), SOC 2 (CC6.1), and internal data governance policies.

## 2. Scope

This dictionary covers data fields from:
- Database schemas (Prisma, Drizzle, Mongoose, TypeORM, SQLAlchemy, Django)
- API routes and request handlers
- Third-party service integrations
- Environment variable configurations

---

## 3. Data Field Catalog

| Field | Source | Type | Sensitivity | Retention | Purpose |
|-------|--------|------|-------------|-----------|---------|
| Location Data | Cron.timezone | Location | Medium | 90 days | Localization, analytics |
| Authentication Data | EmailChangeConfirmForm.Password | Application Data | Low | Per data retention policy | Application functionality |
| Authentication Data | authMethodsResponse.Password | Application Data | Low | Per data retention policy | Application functionality |
| Authentication Data | recordConfirmPasswordResetForm.Password | Application Data | Low | Per data retention policy | Application functionality |
| Authentication Data | authWithOTPForm.Password | Application Data | Low | Per data retention policy | Application functionality |
| Authentication Data | authWithPasswordForm.Password | Application Data | Low | Per data retention policy | Application functionality |
| Authentication Data | RecordCreateOTPRequestEvent.Password | Application Data | Low | Per data retention policy | Application functionality |
| Authentication Data | RecordAuthWithPasswordRequestEvent.Password | Application Data | Low | Per data retention policy | Application functionality |
| Authentication Data | SMTPConfig.Password | Application Data | Low | Per data retention policy | Application functionality |
| Authentication Data | RecordUpsert.password | Application Data | Low | Per data retention policy | Application functionality |
| Authentication Data | SMTPClient.Password | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | createOTPForm.Email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | recordRequestPasswordResetForm.Email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | recordRequestVerificationForm.Email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | TestEmailSend.Email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | AuthUser.Email | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | backupCreateForm.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | providerInfo.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | providerInfo.DisplayName | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | baseCollection.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | OAuth2KnownFields.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | OAuth2KnownFields.Username | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | OAuth2ProviderConfig.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | OAuth2ProviderConfig.DisplayName | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | TableInfoRow.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | BackupEvent.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | AutodateField.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | BoolField.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | DateField.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | EditorField.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | EmailField.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | FileField.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | GeoPointField.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | JSONField.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | NumberField.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | PasswordField.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | RelationField.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | SelectField.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | TextField.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | URLField.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | SMTPConfig.Username | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | OldCollectionModel.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | releaseAsset.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | release.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | ApiScenario.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | AuthUser.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | AuthUser.Username | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | BaseProvider.displayName | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | IndexColumn.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | File.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | ListObjectsResponse.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | ListObjectContent.DisplayName | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | SMTPClient.Username | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | SortField.Name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | Message.Name | Application Data | Low | Per data retention policy | Application functionality |

---

## 4. Sensitivity Summary

| Level | Count | Description |
|-------|-------|-------------|
| Critical | 0 | Credentials, government IDs, raw payment data — requires encryption at rest and strict access control |
| High | 0 | PII (names, emails, addresses) — requires encryption and consent |
| Medium | 1 | Behavioral data, session data, IP addresses — requires privacy notice |
| Low | 54 | Preferences, metadata, operational data — standard handling |

**Total fields cataloged:** 55

---

## 5. Cross-References

- **Database schema** — Fields detected from Prisma/ORM model definitions

---

## 6. Related Documents

- **PRIVACY_POLICY.md** — Public disclosure of data collection practices
- **DATA_RETENTION_POLICY.md** — Detailed retention schedules and deletion procedures
- **DATA_CLASSIFICATION.md** — GDPR sensitivity classification details
- **DATA_FLOW_MAP.md** — Visual representation of data flows between services
- **DSAR_HANDLING_GUIDE.md** — Data subject access request procedures

---

## 7. Maintenance

This data dictionary should be updated:

- When new database models or fields are added
- When new third-party services are integrated
- When data retention policies change
- At minimum **quarterly** as part of compliance review

For questions about this data dictionary, contact [your-email@example.com].

---

*This Data Dictionary was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Review and verify all entries for accuracy. This document does not constitute legal advice.*