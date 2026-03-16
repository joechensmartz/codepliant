# Privacy Policy

**Effective Date:** 2026-03-16
**Last Updated:** 2026-03-16
**Previous Version:** [View previous version]([previous-version-url])

**Project:** saleor

---

## 1. Introduction

This Privacy Policy ("Policy") describes how [Your Company Name] ("we", "us", or "our") collects, uses, discloses, and otherwise processes your personal data when you access or use our services. This Policy applies to all personal data processed in connection with our websites, applications, and related services (collectively, the "Service").

We are committed to protecting your personal data in accordance with the General Data Protection Regulation (EU) 2016/679 ("GDPR"), the California Consumer Privacy Act as amended by the California Privacy Rights Act ("CCPA/CPRA"), and other applicable data protection legislation.

**Data Controller:** [Your Company Name]
**Contact Email:** [your-email@example.com]

## 2. Data Protection Officer

Our primary data protection contact is: **[your-email@example.com]**

> **Note:** If your organisation is required to appoint a Data Protection Officer under GDPR Article 37, update this section with the DPO's contact details.


## 3. Information We Collect

In accordance with GDPR Art. 13(1)(e) and Art. 14(1)(d), we collect the following categories of personal data:

### Personal Identity Data

Email addresses, names, profile pictures, and account credentials collected through authentication. names, user descriptions detected in Django model fields: Group.name, AppToken.name, CheckoutDelivery.name, CheckoutDelivery.description, PromotionRule.name, BaseDiscount.name, GiftCardTag.name, Permission.name, PluginConfiguration.name, PluginConfiguration.description, EmailTemplate.name, Book.name, Webhook.name. names, first names, last names detected in GraphQL schema fields: Query.name, AssignedAttributeValueInput.name, AddressInput.firstName, AddressInput.lastName, Shop.name, Plugin.name, ConfigurationItem.name, SiteDomainInput.name, ShippingPriceTranslationInput.name, TranslationInput.name, NameTranslationInput.name, CardPaymentMethodDetailsInput.name, OtherPaymentMethodDetailsInput.name, GiftCardPaymentMethodDetailsInput.name, MenuCreateInput.name, MenuItemInput.name, MenuInput.name, MenuItemCreateInput.name, ConfigurationItemInput.name, PromotionUpdateInput.name, PromotionRuleCreateInput.name, PromotionRuleUpdateInput.name, PromotionTranslationInput.name, PromotionRuleTranslationInput.name, AttributeValueTranslationInput.name, CardPaymentMethodDetails.name, GiftCardPaymentMethodDetails.name, OtherPaymentMethodDetails.name.

**Collected through:** django-sessions, django-admin, Group.name, AppToken.name, CheckoutDelivery.name, CheckoutDelivery.description, PromotionRule.name, BaseDiscount.name, GiftCardTag.name, Permission.name, PluginConfiguration.name, PluginConfiguration.description, EmailTemplate.name, Book.name, Webhook.name, Query.name, AssignedAttributeValueInput.name, AddressInput.firstName, AddressInput.lastName, Shop.name, Plugin.name, ConfigurationItem.name, SiteDomainInput.name, ShippingPriceTranslationInput.name, TranslationInput.name, NameTranslationInput.name, CardPaymentMethodDetailsInput.name, OtherPaymentMethodDetailsInput.name, GiftCardPaymentMethodDetailsInput.name, MenuCreateInput.name, MenuItemInput.name, MenuInput.name, MenuItemCreateInput.name, ConfigurationItemInput.name, PromotionUpdateInput.name, PromotionRuleCreateInput.name, PromotionRuleUpdateInput.name, PromotionTranslationInput.name, PromotionRuleTranslationInput.name, AttributeValueTranslationInput.name, CardPaymentMethodDetails.name, GiftCardPaymentMethodDetails.name, OtherPaymentMethodDetails.name

### Financial Data

Payment card information, billing addresses, and transaction history processed through payment providers.

**Collected through:** stripe

### Technical & Diagnostic Data

Error reports, stack traces, performance data, and user context collected through monitoring tools.

**Collected through:** Codecov

### User-Uploaded Content

Files, images, and documents uploaded by users and stored through cloud storage providers.

**Collected through:** boto3, AWS

### Stored User Data

Persistent user data stored in databases as defined by the application schema.

**Collected through:** redis

### Contact Information

email addresses detected in Django model fields: StaffNotificationRecipient.staff_email, AppProblem.dismissed_by_user_email, Checkout.email, VoucherCustomer.customer_email. email addresses, phone numbers, addresses detected in GraphQL schema fields: Query.email, AddressInput.phone, Shop.address, StaffNotificationRecipient.email, Mutation.email, StaffNotificationRecipientInput.email.

**Collected through:** StaffNotificationRecipient.staff_email, AppProblem.dismissed_by_user_email, Checkout.email, VoucherCustomer.customer_email, Query.email, AddressInput.phone, Shop.address, StaffNotificationRecipient.email, Mutation.email, StaffNotificationRecipientInput.email

### Location Data

city information, country information, postal codes detected in GraphQL schema fields: Query.city, CountryDisplay.country, AddressInput.city, AddressInput.postalCode, AddressInput.country.

**Collected through:** Query.city, CountryDisplay.country, AddressInput.city, AddressInput.postalCode, AddressInput.country

### Authentication Data

passwords detected in GraphQL schema fields: Mutation.password.

**Collected through:** Mutation.password

### How Your Data Flows Through Our Service

The following summarizes how personal data moves through our application:

**Data Collection:**

- User registration/login → admin panel access, staff user accounts (via django-admin)
- User registration/login → session cookies, CSRF tokens (via django-sessions)
- Payment checkout → payment information, billing address, email, transaction history (via stripe)

**Data Storage:**

- boto3 (File Storage): uploaded files, file metadata
- redis (Database): cached data, session data
- Database schema (Personal Identity Data): django-sessions, django-admin, Group.name, AppToken.name, CheckoutDelivery.name, CheckoutDelivery.description, PromotionRule.name, BaseDiscount.name, GiftCardTag.name, Permission.name, PluginConfiguration.name, PluginConfiguration.description, EmailTemplate.name, Book.name, Webhook.name, Query.name, AssignedAttributeValueInput.name, AddressInput.firstName, AddressInput.lastName, Shop.name, Plugin.name, ConfigurationItem.name, SiteDomainInput.name, ShippingPriceTranslationInput.name, TranslationInput.name, NameTranslationInput.name, CardPaymentMethodDetailsInput.name, OtherPaymentMethodDetailsInput.name, GiftCardPaymentMethodDetailsInput.name, MenuCreateInput.name, MenuItemInput.name, MenuInput.name, MenuItemCreateInput.name, ConfigurationItemInput.name, PromotionUpdateInput.name, PromotionRuleCreateInput.name, PromotionRuleUpdateInput.name, PromotionTranslationInput.name, PromotionRuleTranslationInput.name, AttributeValueTranslationInput.name, CardPaymentMethodDetails.name, GiftCardPaymentMethodDetails.name, OtherPaymentMethodDetails.name
- Database schema (Contact Information): StaffNotificationRecipient.staff_email, AppProblem.dismissed_by_user_email, Checkout.email, VoucherCustomer.customer_email, Query.email, AddressInput.phone, Shop.address, StaffNotificationRecipient.email, Mutation.email, StaffNotificationRecipientInput.email
- Database schema (Location Data): Query.city, CountryDisplay.country, AddressInput.city, AddressInput.postalCode, AddressInput.country
- Database schema (Authentication Data): Mutation.password

**Third-Party Data Sharing:**

- Django Channels: real-time user data, connection metadata, channel group data, WebSocket messages
- stripe: payment information, billing address, email, transaction history


### Data Sensitivity Classification

We classify the personal data we collect according to GDPR sensitivity levels to ensure appropriate protection:

| Sensitivity Level | Fields Detected | Protection Standard |
|-------------------|-----------------|--------------------|
| Special Category (Art. 9) | 1 | Explicit consent, DPIA, encryption, DPO oversight |
| High | 48 | Encryption, tokenization, access control, audit logging |
| Medium | 17 | Encryption in transit, consent, user access rights |
| Low | 22 | Encryption in transit, anonymization where possible |

For a detailed breakdown of each data field and its classification, see our Data Classification Report.


## 4. Third-Party Services and Data Recipients

Pursuant to GDPR Art. 13(1)(e), we disclose your personal data to the following categories of recipients and third-party data processors:

- **boto3** (File Storage): Processes uploaded files, file metadata
- **Django Channels** (Other): Processes real-time user data, connection metadata, channel group data, WebSocket messages
- **django-admin** (Authentication): Processes admin panel access, staff user accounts
- **django-sessions** (Authentication): Processes session cookies, CSRF tokens
- **stripe** (Payment Processing): Processes payment information, billing address, email, transaction history

Each third-party service provider processes your data under its own privacy policy and data processing agreement. We require all processors to implement appropriate technical and organisational measures in accordance with GDPR Art. 28.


## 5. Legal Basis for Processing (GDPR Art. 6)

Under the General Data Protection Regulation, we process your personal data based on the following legal grounds:

| Purpose | Legal Basis | GDPR Article | Details |
|---------|------------|--------------|--------|
| File Storage | Contract | Art. 6(1)(b) | Necessary to provide file storage as part of the service |
| Other | Legitimate Interest | Art. 6(1)(f) | Supporting our service operations |
| Authentication | Contract | Art. 6(1)(b) | Necessary to fulfill our agreement with you |
| Database | Contract | Art. 6(1)(b) | Necessary to store and manage your data as part of the service |
| Payment Processing | Contract | Art. 6(1)(b) | Necessary to fulfill our agreement with you |

### Legitimate Interests Pursued

Where we rely on legitimate interest as a legal basis, we have conducted a balancing test to ensure our interests do not override your fundamental rights and freedoms. Our legitimate interests include:

- **Other:** Supporting our service operations


## 6. International Data Transfers

Pursuant to GDPR Art. 13(1)(f), we inform you that your personal data may be transferred to and processed in countries outside the European Economic Area (EEA) that may not provide an equivalent level of data protection. The following services involve such transfers:

- **stripe** (Payment Processing)

In accordance with GDPR Chapter V (Arts. 44-49), we ensure that appropriate safeguards are in place for all international transfers, including:

- Transfers to countries with an EU adequacy decision
- Standard Contractual Clauses (SCCs) approved by the European Commission
- EU-US Data Privacy Framework certification (where applicable)

You may request a copy of the applicable safeguards by contacting us at [your-email@example.com].


## 7. Data Retention

In accordance with the data minimisation principle (GDPR Art. 5(1)(e)), we retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, unless a longer retention period is required or permitted by applicable law.

| Data Type | Retention Period |
|-----------|------------------|
| File Storage | Uploaded files retained until you delete them or your account |
| Other | Data retained as long as necessary for the service |
| Authentication | Account data retained until you delete your account |
| Database | User data retained until you delete your account |
| Payment Processing | Transaction records retained for 7 years (tax and legal compliance) |


## 8. Your Rights

Under applicable data protection legislation, you may exercise the following rights with respect to your personal data:

- **Right of Access (Art. 15):** You have the right to obtain confirmation as to whether your personal data is being processed and, where that is the case, to request a copy of the personal data undergoing processing.
- **Right to Rectification (Art. 16):** You have the right to obtain the rectification of inaccurate personal data and, taking into account the purposes of the processing, to have incomplete personal data completed.
- **Right to Erasure (Art. 17):** You have the right to obtain the erasure of your personal data where one of the grounds set out in Art. 17(1) GDPR applies, subject to the exceptions in Art. 17(3).
- **Right to Data Portability (Art. 20):** You have the right to receive your personal data in a structured, commonly used, and machine-readable format, and to transmit that data to another controller without hindrance.
- **Right to Object (Art. 21):** You have the right to object, on grounds relating to your particular situation, to the processing of your personal data based on Art. 6(1)(e) or (f). We shall cease processing unless we demonstrate compelling legitimate grounds.
- **Right to Restriction of Processing (Art. 18):** You have the right to obtain restriction of processing where one of the conditions set out in Art. 18(1) GDPR applies.

### For EU/EEA Residents (GDPR)

Pursuant to GDPR Art. 77, you have the right to lodge a complaint with a supervisory authority, in particular in the Member State of your habitual residence, place of work, or place of the alleged infringement.

## 9. Right to Withdraw Consent

Pursuant to GDPR Art. 7(3), where we process your personal data based on your consent, you have the right to withdraw that consent at any time by contacting us at [your-email@example.com]. The withdrawal of consent shall not affect the lawfulness of processing based on consent before its withdrawal.


## 10. Automated Decision-Making (Art. 22)

Pursuant to GDPR Art. 13(2)(f), we inform you that we do not currently engage in automated decision-making, including profiling, that produces legal effects concerning you or similarly significantly affects you within the meaning of Art. 22(1).


## 11. Necessity of Data Provision (Art. 13(2)(e))

Pursuant to GDPR Art. 13(2)(e), we inform you whether the provision of personal data is a statutory or contractual requirement, or a requirement necessary to enter into a contract, and the possible consequences of failure to provide such data.

- **Required data (contractual necessity):** Data necessary for account creation, authentication, and core service functionality. The provision of this data is a requirement necessary to enter into and perform our contract with you. Failure to provide this data will result in our inability to provide you with the Service.
- **Optional data (consent-based):** Data collected for analytics, personalisation, and service improvement. The provision of this data is voluntary and not a contractual requirement. You may decline to provide this data without any impact on your ability to use the core Service.

## 12. How We Protect Your Data

We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.

### Encryption

- All data transmitted between your browser and our servers is encrypted using TLS 1.2 or higher
- Sensitive data (such as payment information and credentials) is encrypted at rest using industry-standard encryption algorithms
- Encryption keys are managed through secure key management practices with regular rotation

### Access Controls

- Access to personal data is restricted to authorized personnel on a need-to-know basis
- We implement role-based access control (RBAC) to limit data access by job function
- Multi-factor authentication is required for administrative access to systems containing personal data
- Access permissions are reviewed regularly and revoked promptly when no longer needed

### Backups and Recovery

- Regular automated backups of all databases containing personal data
- Backups are encrypted and stored in secure, geographically separate locations
- Recovery procedures are tested periodically to ensure data can be restored in the event of an incident

### Security Assessments

- Regular security reviews and vulnerability assessments are conducted
- Third-party services are evaluated for security before integration
- We maintain an incident response plan for handling data breaches (see `INCIDENT_RESPONSE_PLAN.md`)


## 13. Changes to This Policy

We may revise this Policy from time to time to reflect changes in our data processing practices, applicable law, or regulatory guidance. Where we make material changes, we will notify you by reasonable means, such as a prominent notice on the Service or by email to the address associated with your account, at least thirty (30) days prior to the changes taking effect.

We will not reduce your rights under this Policy without your explicit consent. Each version of this Policy will be identified by its effective date, and we will maintain an archive of prior versions available upon request.

Your continued use of the Service after the effective date of any revised Policy constitutes your acceptance of the revised terms. If you do not agree with the revised Policy, you must discontinue use of the Service.

## 14. Contact

If you have questions about this Policy or wish to exercise your data protection rights, please contact us at:

- **Email:** [your-email@example.com]
