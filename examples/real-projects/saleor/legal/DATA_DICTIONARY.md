# Data Dictionary

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** saleor

**Company:** [Your Company Name]

## Related Documents

- Data Flow Map (`DATA_FLOW_MAP.md`)
- Data Retention Policy (`DATA_RETENTION_POLICY.md`)
- Data Classification Report (`DATA_CLASSIFICATION.md`)

---

## 1. Purpose

This document catalogs every data field detected across the **saleor** application. It serves as the authoritative reference for data mapping required by GDPR Article 30 (Records of Processing Activities), SOC 2 (CC6.1), and internal data governance policies.

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
| password_hash | django-admin | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| password_hash | django-sessions | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| payment_info | stripe | Financial — PCI | Critical | Do not store post-authorization; tokenize | Payment processing |
| billing address | stripe | Location | High | Until account deletion | Billing, shipping, localization |
| billing_address | stripe | Location | High | 7 years (tax/legal) | Billing |
| customer_email | stripe | Contact | High | Until account deletion + 30 days | Transaction receipts |
| email | django-admin | Contact | High | Until account deletion + 30 days | Account identification |
| email | django-sessions | Contact | High | Until account deletion + 30 days | Account identification |
| email | stripe | Contact | High | Until account deletion + 30 days | Account identification, communication |
| transaction_history | stripe | Financial | High | 7 years (tax/legal) | Order records, refunds |
| CSRF tokens | django-sessions | Session | Medium | Until session expiry | Session management |
| Location Data | Query.city | Location | Medium | 90 days | Localization, analytics |
| Location Data | CountryDisplay.country | Location | Medium | 90 days | Localization, analytics |
| Location Data | AddressInput.city | Location | Medium | 90 days | Localization, analytics |
| Location Data | AddressInput.postalCode | Location | Medium | 90 days | Localization, analytics |
| Location Data | AddressInput.country | Location | Medium | 90 days | Localization, analytics |
| oauth_token | django-admin | Authentication | Medium | Until session expiry or revocation | Third-party authentication |
| oauth_token | django-sessions | Authentication | Medium | Until session expiry or revocation | Third-party authentication |
| session cookies | django-sessions | Session | Medium | Until session expiry | Session management |
| session data | redis | Session | Medium | Until session expiry | Session management |
| session_token | django-admin | Session | Medium | Until session expiry | Session management |
| session_token | django-sessions | Session | Medium | Until session expiry | Session management |
| uploaded_files | boto3 | User Content | Medium | Until user-initiated deletion | File storage |
| user_data | redis | Application Data | Medium | Per data retention policy | Application functionality |
| admin panel access | django-admin | Application Data | Low | Per data retention policy | Application functionality |
| Authentication Data | Mutation.password | Application Data | Low | Per data retention policy | Application functionality |
| cached data | redis | Application Data | Low | Per data retention policy | Application functionality |
| channel group data | Django Channels | Application Data | Low | Per data retention policy | Application functionality |
| connection metadata | Django Channels | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | StaffNotificationRecipient.staff_email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | AppProblem.dismissed_by_user_email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | Checkout.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | VoucherCustomer.customer_email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | Query.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | AddressInput.phone | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | Shop.address | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | StaffNotificationRecipient.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | Mutation.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | StaffNotificationRecipientInput.email | Application Data | Low | Per data retention policy | Application functionality |
| file metadata | boto3 | Application Data | Low | Per data retention policy | Application functionality |
| file_metadata | boto3 | Metadata | Low | Until file deletion | File management |
| Financial Data | stripe | Application Data | Low | Per data retention policy | Application functionality |
| payment information | stripe | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | django-sessions | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | django-admin | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | Group.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | AppToken.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | CheckoutDelivery.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | CheckoutDelivery.description | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | PromotionRule.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | BaseDiscount.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | GiftCardTag.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | Permission.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | PluginConfiguration.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | PluginConfiguration.description | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | EmailTemplate.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | Book.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | Webhook.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | Query.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | AssignedAttributeValueInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | AddressInput.firstName | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | AddressInput.lastName | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | Shop.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | Plugin.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | ConfigurationItem.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | SiteDomainInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | ShippingPriceTranslationInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | TranslationInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | NameTranslationInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | CardPaymentMethodDetailsInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | OtherPaymentMethodDetailsInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | GiftCardPaymentMethodDetailsInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | MenuCreateInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | MenuItemInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | MenuInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | MenuItemCreateInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | ConfigurationItemInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | PromotionUpdateInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | PromotionRuleCreateInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | PromotionRuleUpdateInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | PromotionTranslationInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | PromotionRuleTranslationInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | AttributeValueTranslationInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | CardPaymentMethodDetails.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | GiftCardPaymentMethodDetails.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | OtherPaymentMethodDetails.name | Application Data | Low | Per data retention policy | Application functionality |
| real-time user data | Django Channels | Application Data | Low | Per data retention policy | Application functionality |
| staff user accounts | django-admin | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | redis | Application Data | Low | Per data retention policy | Application functionality |
| Technical & Diagnostic Data | Codecov | Application Data | Low | Per data retention policy | Application functionality |
| transaction history | stripe | Application Data | Low | Per data retention policy | Application functionality |
| uploaded files | boto3 | Application Data | Low | Per data retention policy | Application functionality |
| User-Uploaded Content | boto3 | Application Data | Low | Per data retention policy | Application functionality |
| User-Uploaded Content | AWS | Application Data | Low | Per data retention policy | Application functionality |
| WebSocket messages | Django Channels | Application Data | Low | Per data retention policy | Application functionality |

---

## 4. Sensitivity Summary

| Level | Count | Description |
|-------|-------|-------------|
| Critical | 3 | Credentials, government IDs, raw payment data — requires encryption at rest and strict access control |
| High | 7 | PII (names, emails, addresses) — requires encryption and consent |
| Medium | 14 | Behavioral data, session data, IP addresses — requires privacy notice |
| Low | 71 | Preferences, metadata, operational data — standard handling |

**Total fields cataloged:** 95

---

## 5. Cross-References

- **Database schema** — Fields detected from Prisma/ORM model definitions
- **Storage services** — boto3
- **Other services** — Django Channels
- **Auth services** — django-admin, django-sessions
- **Database services** — redis
- **Payment services** — stripe

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