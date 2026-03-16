# Data Mapping Register

> **Document Version:** 1.0
> **Document Owner:** [Your Company Name]
> **Generated:** 2026-03-16 by [Codepliant](https://github.com/joechensmartz/codepliant)
> **Next Review Date:** 2027-03-16

This register provides a complete inventory of personal data processing activities
in compliance with GDPR Article 30 (Records of Processing Activities).

## 1. Data Controller Information

| Field | Details |
|-------|---------|
| **Data Controller** | [Your Company Name] |
| **Contact Email** | [your-email@example.com] |
| **Data Protection Officer** | [Data Protection Officer Name] |
| **DPO Email** | [your-email@example.com] |
| **Register Last Updated** | 2026-03-16 |

## 2. Data Inventory

| # | Data Element | Sensitivity | Source | Storage Location | Shared With | Lawful Basis | Retention |
|---|-------------|-------------|--------|------------------|-------------|--------------|-----------|
| 1 | uploaded files | General | Application-collected | boto3 (third-party) | boto3 | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 2 | file metadata | General | Application-collected | boto3 (third-party) | boto3 | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 3 | real-time user data | General | Application-collected | Django Channels (third-party) | Django Channels | To be determined | To be determined |
| 4 | connection metadata | General | Application-collected | Django Channels (third-party) | Django Channels | To be determined | To be determined |
| 5 | channel group data | General | Application-collected | Django Channels (third-party) | Django Channels | To be determined | To be determined |
| 6 | WebSocket messages | General | Application-collected | Django Channels (third-party) | Django Channels | To be determined | To be determined |
| 7 | admin panel access | General | Application-collected | django-admin (third-party) | django-admin | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 8 | staff user accounts | General | Application-collected | django-admin (third-party) | django-admin | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 9 | session cookies | Indirectly Identifiable | Automatic collection (cookies/SDK) | django-sessions (third-party) | django-sessions | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 10 | CSRF tokens | Security Credential | Application-collected | django-sessions (third-party) | django-sessions | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 11 | cached data | General | Application-collected | redis (third-party) | redis | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 12 | session data | General | Automatic collection (cookies/SDK) | redis (third-party) | redis | Contract performance (Art. 6(1)(b)) | Duration of account + 30 days |
| 13 | payment information | Financial | User-provided (checkout) | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 14 | billing address | Directly Identifiable | User-provided (registration/form) | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 15 | email | Directly Identifiable | User-provided (registration/form) | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 16 | transaction history | General | Application-collected | stripe (third-party) | stripe | Contract performance (Art. 6(1)(b)) | 7 years (tax/legal obligation) |
| 17 | Personal Identity Data | General | django-sessions | Application database | Internal only | To be determined | To be determined |
| 18 | Financial Data | Financial | stripe | Application database | Internal only | To be determined | To be determined |
| 19 | Technical & Diagnostic Data | General | Codecov | Application database | Internal only | To be determined | To be determined |
| 20 | User-Uploaded Content | General | boto3 | Application database | Internal only | To be determined | To be determined |
| 21 | Stored User Data | General | redis | Application database | Internal only | To be determined | To be determined |
| 22 | Contact Information | General | StaffNotificationRecipient.staff_email | Application database | Internal only | To be determined | To be determined |
| 23 | Location Data | General | Query.city | Application database | Internal only | To be determined | To be determined |
| 24 | Authentication Data | General | Mutation.password | Application database | Internal only | To be determined | To be determined |

## 3. Data Flow Summary

### General

| Data Element | Source | Destination |
|-------------|--------|-------------|
| uploaded files | Application-collected | boto3 |
| file metadata | Application-collected | boto3 |
| real-time user data | Application-collected | Django Channels |
| connection metadata | Application-collected | Django Channels |
| channel group data | Application-collected | Django Channels |
| WebSocket messages | Application-collected | Django Channels |
| admin panel access | Application-collected | django-admin |
| staff user accounts | Application-collected | django-admin |
| cached data | Application-collected | redis |
| session data | Automatic collection (cookies/SDK) | redis |
| transaction history | Application-collected | stripe |
| Personal Identity Data | django-sessions | Application database |
| Technical & Diagnostic Data | Codecov | Application database |
| User-Uploaded Content | boto3 | Application database |
| Stored User Data | redis | Application database |
| Contact Information | StaffNotificationRecipient.staff_email | Application database |
| Location Data | Query.city | Application database |
| Authentication Data | Mutation.password | Application database |

### Indirectly Identifiable

| Data Element | Source | Destination |
|-------------|--------|-------------|
| session cookies | Automatic collection (cookies/SDK) | django-sessions |

### Security Credential

| Data Element | Source | Destination |
|-------------|--------|-------------|
| CSRF tokens | Application-collected | django-sessions |

### Financial

| Data Element | Source | Destination |
|-------------|--------|-------------|
| payment information | User-provided (checkout) | stripe |
| Financial Data | stripe | Application database |

### Directly Identifiable

| Data Element | Source | Destination |
|-------------|--------|-------------|
| billing address | User-provided (registration/form) | stripe |
| email | User-provided (registration/form) | stripe |

## 4. Third-Party Processors

| Processor | Data Shared | Purpose | DPA Status |
|-----------|------------|---------|------------|
| boto3 | uploaded files, file metadata | storage | ⬜ To be verified |
| Django Channels | real-time user data, connection metadata, channel group data, WebSocket messages | other | ⬜ To be verified |
| django-admin | admin panel access, staff user accounts | auth | ⬜ To be verified |
| django-sessions | session cookies, CSRF tokens | auth | ⬜ To be verified |
| redis | cached data, session data | database | ⬜ To be verified |
| stripe | payment information, billing address, email, transaction history | payment | ⬜ To be verified |

## 5. International Data Transfers

| Processor | Transfer Destination | Safeguard Mechanism | Status |
|-----------|---------------------|---------------------|--------|
| boto3 | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| Django Channels | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| django-admin | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| django-sessions | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| redis | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |
| stripe | To be verified | SCCs / Adequacy Decision | ⬜ To be assessed |

## 6. Retention Schedule

| Data Category | Retention Period | Deletion Method | Legal Basis for Retention |
|---------------|-----------------|-----------------|--------------------------|
| General | Duration of account + 30 days | Automated purge + manual verification | Contract performance (Art. 6(1)(b)) |
| Indirectly Identifiable | Duration of account + 30 days | Automated purge + manual verification | Contract performance (Art. 6(1)(b)) |
| Security Credential | Duration of account + 30 days | Automated purge + manual verification | Contract performance (Art. 6(1)(b)) |
| Financial | 7 years (tax/legal obligation) | Automated purge + manual verification | Contract performance (Art. 6(1)(b)) |
| Directly Identifiable | 7 years (tax/legal obligation) | Automated purge + manual verification | Contract performance (Art. 6(1)(b)) |

---

*This data mapping register is generated from automated code analysis and should be reviewed by your Data Protection Officer and legal team. It may not capture all data processing activities, particularly those conducted outside the scanned codebase. This does not constitute legal advice.*
