# Privacy Policy

**Effective Date:** 2026-03-16
**Last Updated:** 2026-03-16
**Previous Version:** [View previous version]([previous-version-url])

**Project:** @chatwoot/chatwoot

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

Email addresses, names, profile pictures, and account credentials collected through authentication. names, display names, avatar images, locale/language preferences, usernames detected in OpenAPI/Swagger spec fields: items.name, profile.name, profile.display_name, profile.avatar, automation_rule_item.name, portal_item.name, category.locale, category.name, user.display_name, user.name, agent.name, inbox.name, inbox_contact.name, agent_bot.name, custom_filter.name, webhook.name, account.name, account_detail.name, account_detail.locale, platform_account.name, team.name, integrations_app.name, audit_log.username, public_contact.name, public_inbox.name, account_create_update_payload.name, account_create_update_payload.locale, account_update_payload.name, account_update_payload.locale, platform_agent_bot_create_update_payload.name, platform_agent_bot_create_update_payload.avatar, agent_bot_create_update_payload.name, agent_bot_create_update_payload.avatar, user_create_update_payload.name, user_create_update_payload.display_name, agent_create_payload.name, contact_create_payload.name, contact_create_payload.avatar, contact_update_payload.name, contact_update_payload.avatar, template_params.name, inbox_create_payload.name, inbox_create_payload.avatar, inbox_update_payload.name, inbox_update_payload.avatar, team_create_update_payload.name, custom_filter_create_update_payload.name, webhook_create_update_payload.name, automation_rule_create_update_payload.name, portal_create_update_payload.name, category_create_update_payload.name, category_create_update_payload.locale, article_create_update_payload.locale, public_contact_create_update_payload.name, public_contact_create_update_payload.avatar, submitted_values.name, sender.name, agent_conversation_metrics.name, contact_detail.name, contact_list_item.name, reporting_event.name, RequestBody.name (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}), RequestBody.display_name (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}), RequestBody.name (PUT /api/v1/profile), RequestBody.display_name (PUT /api/v1/profile), RequestBody.avatar (PUT /api/v1/profile).

**Collected through:** devise, pundit, omniauth, rails-sessions, items.name, profile.name, profile.display_name, profile.avatar, automation_rule_item.name, portal_item.name, category.locale, category.name, user.display_name, user.name, agent.name, inbox.name, inbox_contact.name, agent_bot.name, custom_filter.name, webhook.name, account.name, account_detail.name, account_detail.locale, platform_account.name, team.name, integrations_app.name, audit_log.username, public_contact.name, public_inbox.name, account_create_update_payload.name, account_create_update_payload.locale, account_update_payload.name, account_update_payload.locale, platform_agent_bot_create_update_payload.name, platform_agent_bot_create_update_payload.avatar, agent_bot_create_update_payload.name, agent_bot_create_update_payload.avatar, user_create_update_payload.name, user_create_update_payload.display_name, agent_create_payload.name, contact_create_payload.name, contact_create_payload.avatar, contact_update_payload.name, contact_update_payload.avatar, template_params.name, inbox_create_payload.name, inbox_create_payload.avatar, inbox_update_payload.name, inbox_update_payload.avatar, team_create_update_payload.name, custom_filter_create_update_payload.name, webhook_create_update_payload.name, automation_rule_create_update_payload.name, portal_create_update_payload.name, category_create_update_payload.name, category_create_update_payload.locale, article_create_update_payload.locale, public_contact_create_update_payload.name, public_contact_create_update_payload.avatar, submitted_values.name, sender.name, agent_conversation_metrics.name, contact_detail.name, contact_list_item.name, reporting_event.name, RequestBody.name (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}), RequestBody.display_name (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}), RequestBody.name (PUT /api/v1/profile), RequestBody.display_name (PUT /api/v1/profile), RequestBody.avatar (PUT /api/v1/profile)

### Financial Data

Payment card information, billing addresses, and transaction history processed through payment providers.

**Collected through:** stripe

### Usage & Behavioral Data

Page views, click patterns, session recordings, device information, and IP addresses collected through analytics tools.

**Collected through:** @amplitude/analytics-browser

### AI Interaction Data

User prompts, conversation history, and AI-generated content processed through third-party AI services.

**Collected through:** ruby-openai

### Communication Data

Email addresses and email content processed through email service providers.

**Collected through:** rails-actionmailer, nodemailer, ActionMailer, MailHog

### Technical & Diagnostic Data

Error reports, stack traces, performance data, and user context collected through monitoring tools.

**Collected through:** sentry-ruby

### User-Uploaded Content

Files, images, and documents uploaded by users and stored through cloud storage providers.

**Collected through:** aws-sdk-s3, google-cloud-storage, @aws-sdk/client-s3, ActiveStorage, Active Storage

### Advertising & Conversion Data

Conversion events, page views, user interactions, and device information collected through advertising pixels and tracking scripts.

**Collected through:** Meta Pixel

### Stored User Data

Persistent user data stored in databases as defined by the application schema.

**Collected through:** pg, redis, rails-activerecord, ioredis, ActiveRecord, PostgreSQL (env), Redis (env), Redis, Redis (Cache)

### Contact Information

email addresses, phone numbers detected in OpenAPI/Swagger spec fields: items.email, items.phone_number, profile.email, profile.phone_number, user.email, agent.email, inbox.phone_number, public_contact.email, user_create_update_payload.email, agent_create_payload.email, contact_create_payload.email, contact_create_payload.phone_number, contact_update_payload.email, contact_update_payload.phone_number, public_contact_create_update_payload.email, public_contact_create_update_payload.phone_number, sender.email, sender.phone_number, agent_conversation_metrics.email, contact_detail.email, contact_detail.phone_number, contact_list_item.email, contact_list_item.phone_number, RequestBody.email (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}), RequestBody.phone_number (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}), RequestBody.email (PUT /api/v1/profile), RequestBody.phone_number (PUT /api/v1/profile).

**Collected through:** items.email, items.phone_number, profile.email, profile.phone_number, user.email, agent.email, inbox.phone_number, public_contact.email, user_create_update_payload.email, agent_create_payload.email, contact_create_payload.email, contact_create_payload.phone_number, contact_update_payload.email, contact_update_payload.phone_number, public_contact_create_update_payload.email, public_contact_create_update_payload.phone_number, sender.email, sender.phone_number, agent_conversation_metrics.email, contact_detail.email, contact_detail.phone_number, contact_list_item.email, contact_list_item.phone_number, RequestBody.email (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}), RequestBody.phone_number (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}), RequestBody.email (PUT /api/v1/profile), RequestBody.phone_number (PUT /api/v1/profile)

### Authentication Data

passwords detected in OpenAPI/Swagger spec fields: profile.password, user_create_update_payload.password, RequestBody.password (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}), RequestBody.password (PUT /api/v1/profile).

**Collected through:** profile.password, user_create_update_payload.password, RequestBody.password (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}), RequestBody.password (PUT /api/v1/profile)

### Location Data

timezone information, city information, country information detected in OpenAPI/Swagger spec fields: inbox.timezone, custom_attributes.timezone, public_inbox.timezone, account_update_payload.timezone, inbox_create_payload.timezone, inbox_update_payload.timezone, additional_attributes.city, additional_attributes.country.

**Collected through:** inbox.timezone, custom_attributes.timezone, public_inbox.timezone, account_update_payload.timezone, inbox_create_payload.timezone, inbox_update_payload.timezone, additional_attributes.city, additional_attributes.country

### How Your Data Flows Through Our Service

The following summarizes how personal data moves through our application:

**Data Collection:**

- Email subscription/contact forms → email addresses, email content (via ActionMailer)
- User registration/login → email, password hash, session data, authentication tokens (via devise)
- Email subscription/contact forms → email content (via MailHog)
- Email subscription/contact forms → email addresses, email content (via nodemailer)
- User registration/login → email, name, OAuth tokens, profile data (via omniauth)
- User registration/login → user roles, authorization policies, access control data (via pundit)
- Email subscription/contact forms → email addresses, email content (via rails-actionmailer)
- User registration/login → session cookies, CSRF tokens (via rails-sessions)
- AI-powered feature usage → user prompts, conversation history, generated content (via ruby-openai)
- Payment checkout → payment information, billing address, email, transaction history (via stripe)

**Data Storage:**

- @aws-sdk/client-s3 (File Storage): uploaded files, file metadata
- Active Storage (File Storage): uploaded files, file metadata, storage service credentials, potential PII in uploaded content
- ActiveRecord (Database): user data as defined in schema, timestamps, associations
- ActiveStorage (File Storage): uploaded files, file metadata, storage references
- aws-sdk-s3 (File Storage): uploaded files, file metadata
- google-cloud-storage (File Storage): uploaded files, file metadata
- ioredis (Database): cached data, session data
- pg (Database): user data as defined in schema
- PostgreSQL (env) (Database): application data, user records
- rails-activerecord (Database): user data as defined in schema
- redis (Database): cached data, session data
- Redis (Database): session data, cache data
- Redis (env) (Database): session data, cache data
- Database schema (Personal Identity Data): devise, pundit, omniauth, rails-sessions, items.name, profile.name, profile.display_name, profile.avatar, automation_rule_item.name, portal_item.name, category.locale, category.name, user.display_name, user.name, agent.name, inbox.name, inbox_contact.name, agent_bot.name, custom_filter.name, webhook.name, account.name, account_detail.name, account_detail.locale, platform_account.name, team.name, integrations_app.name, audit_log.username, public_contact.name, public_inbox.name, account_create_update_payload.name, account_create_update_payload.locale, account_update_payload.name, account_update_payload.locale, platform_agent_bot_create_update_payload.name, platform_agent_bot_create_update_payload.avatar, agent_bot_create_update_payload.name, agent_bot_create_update_payload.avatar, user_create_update_payload.name, user_create_update_payload.display_name, agent_create_payload.name, contact_create_payload.name, contact_create_payload.avatar, contact_update_payload.name, contact_update_payload.avatar, template_params.name, inbox_create_payload.name, inbox_create_payload.avatar, inbox_update_payload.name, inbox_update_payload.avatar, team_create_update_payload.name, custom_filter_create_update_payload.name, webhook_create_update_payload.name, automation_rule_create_update_payload.name, portal_create_update_payload.name, category_create_update_payload.name, category_create_update_payload.locale, article_create_update_payload.locale, public_contact_create_update_payload.name, public_contact_create_update_payload.avatar, submitted_values.name, sender.name, agent_conversation_metrics.name, contact_detail.name, contact_list_item.name, reporting_event.name, RequestBody.name (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}), RequestBody.display_name (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}), RequestBody.name (PUT /api/v1/profile), RequestBody.display_name (PUT /api/v1/profile), RequestBody.avatar (PUT /api/v1/profile)
- Database schema (Contact Information): items.email, items.phone_number, profile.email, profile.phone_number, user.email, agent.email, inbox.phone_number, public_contact.email, user_create_update_payload.email, agent_create_payload.email, contact_create_payload.email, contact_create_payload.phone_number, contact_update_payload.email, contact_update_payload.phone_number, public_contact_create_update_payload.email, public_contact_create_update_payload.phone_number, sender.email, sender.phone_number, agent_conversation_metrics.email, contact_detail.email, contact_detail.phone_number, contact_list_item.email, contact_list_item.phone_number, RequestBody.email (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}), RequestBody.phone_number (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}), RequestBody.email (PUT /api/v1/profile), RequestBody.phone_number (PUT /api/v1/profile)
- Database schema (Authentication Data): profile.password, user_create_update_payload.password, RequestBody.password (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}), RequestBody.password (PUT /api/v1/profile)
- Database schema (Location Data): inbox.timezone, custom_attributes.timezone, public_inbox.timezone, account_update_payload.timezone, inbox_create_payload.timezone, inbox_update_payload.timezone, additional_attributes.city, additional_attributes.country

**Third-Party Data Sharing:**

- @amplitude/analytics-browser: user behavior, device information, session data
- @twilio/voice-sdk: phone numbers, voice call metadata, call recordings, device information
- ActionCable: real-time user data, connection metadata, channel subscriptions, WebSocket messages
- ActionController::Cookies: session cookies, session data, CSRF tokens
- ActionMailer: email addresses, email content
- MailHog: email content
- Meta Pixel: page views, conversion events, user behavior, device information
- nodemailer: email addresses, email content
- rack-attack: IP addresses, request metadata
- rails-actionmailer: email addresses, email content
- ruby-openai: user prompts, conversation history, generated content
- sentry-ruby: error data, stack traces, user context, device information
- sidekiq: job data, user data processed in background jobs
- stripe: payment information, billing address, email, transaction history
- twilio-ruby: phone numbers, SMS message content, voice call metadata


### Data Sensitivity Classification

We classify the personal data we collect according to GDPR sensitivity levels to ensure appropriate protection:

| Sensitivity Level | Fields Detected | Protection Standard |
|-------------------|-----------------|--------------------|
| Special Category (Art. 9) | 2 | Explicit consent, DPIA, encryption, DPO oversight |
| High | 82 | Encryption, tokenization, access control, audit logging |
| Medium | 54 | Encryption in transit, consent, user access rights |
| Low | 90 | Encryption in transit, anonymization where possible |

For a detailed breakdown of each data field and its classification, see our Data Classification Report.


## 4. Third-Party Services and Data Recipients

Pursuant to GDPR Art. 13(1)(e), we disclose your personal data to the following categories of recipients and third-party data processors:

- **@amplitude/analytics-browser** (Analytics): Processes user behavior, device information, session data
- **@aws-sdk/client-s3** (File Storage): Processes uploaded files, file metadata
- **@twilio/voice-sdk** (Other): Processes phone numbers, voice call metadata, call recordings, device information
- **ActionCable** (Other): Processes real-time user data, connection metadata, channel subscriptions, WebSocket messages
- **ActionController::Cookies** (Other): Processes session cookies, session data, CSRF tokens
- **ActionMailer** (Email Service): Processes email addresses, email content
- **Active Storage** (File Storage): Processes uploaded files, file metadata, storage service credentials, potential PII in uploaded content
- **ActiveStorage** (File Storage): Processes uploaded files, file metadata, storage references
- **aws-sdk-s3** (File Storage): Processes uploaded files, file metadata
- **devise** (Authentication): Processes email, password hash, session data, authentication tokens
- **google-cloud-storage** (File Storage): Processes uploaded files, file metadata
- **MailHog** (Email Service): Processes email content
- **Meta Pixel** (Advertising): Processes page views, conversion events, user behavior, device information
- **nodemailer** (Email Service): Processes email addresses, email content
- **omniauth** (Authentication): Processes email, name, OAuth tokens, profile data
- **pundit** (Authentication): Processes user roles, authorization policies, access control data
- **rack-attack** (Other): Processes IP addresses, request metadata
- **rails-actionmailer** (Email Service): Processes email addresses, email content
- **rails-sessions** (Authentication): Processes session cookies, CSRF tokens
- **ruby-openai** (AI Service): Processes user prompts, conversation history, generated content
- **sentry-ruby** (Error Monitoring): Processes error data, stack traces, user context, device information
- **sidekiq** (Other): Processes job data, user data processed in background jobs
- **stripe** (Payment Processing): Processes payment information, billing address, email, transaction history
- **twilio-ruby** (Other): Processes phone numbers, SMS message content, voice call metadata

Each third-party service provider processes your data under its own privacy policy and data processing agreement. We require all processors to implement appropriate technical and organisational measures in accordance with GDPR Art. 28.


## 5. Legal Basis for Processing (GDPR Art. 6)

Under the General Data Protection Regulation, we process your personal data based on the following legal grounds:

| Purpose | Legal Basis | GDPR Article | Details |
|---------|------------|--------------|--------|
| Analytics | Consent | Art. 6(1)(a) | Only with your opt-in consent |
| File Storage | Contract | Art. 6(1)(b) | Necessary to provide file storage as part of the service |
| Other | Legitimate Interest | Art. 6(1)(f) | Supporting our service operations |
| Email Service | Legitimate Interest | Art. 6(1)(f) | Communicating service-related information to you |
| Database | Contract | Art. 6(1)(b) | Necessary to store and manage your data as part of the service |
| Authentication | Contract | Art. 6(1)(b) | Necessary to fulfill our agreement with you |
| Advertising | Consent | Art. 6(1)(a) | Only with your opt-in consent |
| AI Service | Consent | Art. 6(1)(a) | Only with your opt-in consent; or Contract (Art. 6(1)(b)) if integral to the service |
| Error Monitoring | Legitimate Interest | Art. 6(1)(f) | Protecting our service, detecting errors, and ensuring security |
| Payment Processing | Contract | Art. 6(1)(b) | Necessary to fulfill our agreement with you |

### Legitimate Interests Pursued

Where we rely on legitimate interest as a legal basis, we have conducted a balancing test to ensure our interests do not override your fundamental rights and freedoms. Our legitimate interests include:

- **Other:** Supporting our service operations
- **Email Service:** Communicating service-related information to you
- **Error Monitoring:** Protecting our service, detecting errors, and ensuring security


## 6. Artificial Intelligence

This application uses AI-powered features provided by third-party services:

- **ruby-openai**: user prompts, conversation history, generated content

### How We Use AI

- User inputs may be sent to AI service providers for processing
- AI-generated outputs are returned to the user
- We do not use your data to train AI models
- AI service providers may retain data according to their own policies

> **Note:** Review the AI Disclosure document for detailed information about our AI usage as required by the EU AI Act.


## 7. International Data Transfers

Pursuant to GDPR Art. 13(1)(f), we inform you that your personal data may be transferred to and processed in countries outside the European Economic Area (EEA) that may not provide an equivalent level of data protection. The following services involve such transfers:

- **@amplitude/analytics-browser** (Analytics)
- **@aws-sdk/client-s3** (File Storage)
- **@twilio/voice-sdk** (Other)
- **stripe** (Payment Processing)

In accordance with GDPR Chapter V (Arts. 44-49), we ensure that appropriate safeguards are in place for all international transfers, including:

- Transfers to countries with an EU adequacy decision
- Standard Contractual Clauses (SCCs) approved by the European Commission
- EU-US Data Privacy Framework certification (where applicable)

You may request a copy of the applicable safeguards by contacting us at [your-email@example.com].


## 8. Data Retention

In accordance with the data minimisation principle (GDPR Art. 5(1)(e)), we retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, unless a longer retention period is required or permitted by applicable law.

| Data Type | Retention Period |
|-----------|------------------|
| Analytics | Analytics data retained for up to 26 months |
| File Storage | Uploaded files retained until you delete them or your account |
| Other | Data retained as long as necessary for the service |
| Email Service | Email communication records retained for up to 3 years |
| Database | User data retained until you delete your account |
| Authentication | Account data retained until you delete your account |
| Advertising | Advertising data retained for up to 26 months |
| AI Service | AI interaction data retained for up to 90 days |
| Error Monitoring | Error and performance data retained for up to 90 days |
| Payment Processing | Transaction records retained for 7 years (tax and legal compliance) |


## 9. Your Rights

Under applicable data protection legislation, you may exercise the following rights with respect to your personal data:

- **Right of Access (Art. 15):** You have the right to obtain confirmation as to whether your personal data is being processed and, where that is the case, to request a copy of the personal data undergoing processing.
- **Right to Rectification (Art. 16):** You have the right to obtain the rectification of inaccurate personal data and, taking into account the purposes of the processing, to have incomplete personal data completed.
- **Right to Erasure (Art. 17):** You have the right to obtain the erasure of your personal data where one of the grounds set out in Art. 17(1) GDPR applies, subject to the exceptions in Art. 17(3).
- **Right to Data Portability (Art. 20):** You have the right to receive your personal data in a structured, commonly used, and machine-readable format, and to transmit that data to another controller without hindrance.
- **Right to Object (Art. 21):** You have the right to object, on grounds relating to your particular situation, to the processing of your personal data based on Art. 6(1)(e) or (f). We shall cease processing unless we demonstrate compelling legitimate grounds.
- **Right to Restriction of Processing (Art. 18):** You have the right to obtain restriction of processing where one of the conditions set out in Art. 18(1) GDPR applies.

### For EU/EEA Residents (GDPR)

Pursuant to GDPR Art. 77, you have the right to lodge a complaint with a supervisory authority, in particular in the Member State of your habitual residence, place of work, or place of the alleged infringement.

### For California Residents (CCPA/CPRA)

Under the California Consumer Privacy Act and California Privacy Rights Act:

#### Categories of Personal Information Collected
- Internet or other electronic network activity (browsing history, interactions with website)
- Audio, electronic, visual, or similar information (uploaded files and media)
- Identifiers (email address, communication records)
- Identifiers and other personal information stored in databases
- Identifiers (name, email address, account credentials)
- Internet or other electronic network activity (ad interactions, tracking data)
- Inferences drawn from personal information (AI-generated profiles and predictions)
- Internet or other electronic network activity (device info, error reports, IP address)
- Financial information (payment card details, billing address, transaction history)

#### Categories of Sources

We collect personal information from the following categories of sources:

- Automatically (cookies, web beacons, analytics tools)
- Directly from you (file uploads)
- Directly from you (email address provided at signup or contact)
- Directly from you (account creation, form submissions)
- Directly from you (account registration, login forms)
- Automatically (tracking pixels, ad interactions)
- From third parties (advertising networks)
- Directly from you (inputs to AI-powered features)
- From third parties (AI service providers)
- Automatically (error reports, device information, IP address)
- Directly from you (checkout and billing forms)
- From third parties (payment processors)

#### Business or Commercial Purpose for Collection

We collect and use personal information for the following business or commercial purposes:

- **Analytics:** Auditing: Counting ad impressions, verifying positioning, and auditing compliance; Short-term transient use: Contextualizing and customizing content shown to you
- **File Storage:** Performing services: Providing file storage and media hosting as part of the service
- **Email Service:** Performing services: Sending transactional and service-related communications
- **Database:** Performing services: Storing and managing user data necessary for core service functionality
- **Authentication:** Performing services: Providing account creation, authentication, and access control
- **Advertising:** Advertising: Displaying and measuring advertising; Short-term transient use: Contextualizing ads shown to you
- **AI Service:** Performing services: Providing AI-powered features and functionality integral to the service
- **Error Monitoring:** Debugging: Identifying and repairing errors that impair intended functionality; Security: Detecting security incidents and protecting against malicious or illegal activity
- **Payment Processing:** Performing services: Processing transactions, billing, and fulfilling orders

#### Your CCPA Rights
- Right to Know
- Right to Correct (CPRA Section 1798.106)
- Right to Delete
- Right to Opt-Out of Sale/Sharing
- Right to Limit Use of Sensitive Personal Information
- Right to Non-Discrimination

#### Do Not Sell or Share My Personal Information
We do not sell your personal information. We share personal information with analytics providers for cross-context behavioral advertising. You may opt out by contacting us at [your-email@example.com] or using our opt-out mechanism.

#### How to Submit a Request

You may submit a request to exercise your CCPA rights through the following methods:

- **Email:** [your-email@example.com]
- **Toll-Free Telephone Number:** [1-800-XXX-XXXX] *(update with your toll-free number)*

We will respond to verifiable consumer requests within 45 days.

#### Authorized Agent
You may designate an authorized agent to make requests on your behalf.

## 10. Right to Withdraw Consent

Pursuant to GDPR Art. 7(3), where we process your personal data based on your consent (Art. 6(1)(a) or Art. 9(2)(a)), you have the right to withdraw that consent at any time. The withdrawal of consent shall not affect the lawfulness of processing based on consent before its withdrawal.

You can withdraw your consent by:

- Adjusting your preferences in your account settings
- Contacting us at [your-email@example.com]

Upon withdrawal, we will cease the relevant processing activities, though some data already collected may be retained where we have another lawful basis for doing so.


## 11. Automated Decision-Making (Art. 22)

Pursuant to GDPR Art. 13(2)(f), this application uses automated processing, including AI-powered features, as described in the Artificial Intelligence section above.

### Meaningful Information About the Logic Involved

Our automated processing uses AI models provided by third-party services (ruby-openai). These models analyse the inputs you provide and generate outputs based on statistical patterns learned during training. The processing involves:

- Receiving your input data (text, queries, or other content you submit)
- Processing it through the AI model to generate a response or result
- Returning the AI-generated output to you

### Significance and Envisaged Consequences

The use of automated processing may affect you in the following ways:

- AI-generated outputs may influence decisions or actions you take based on them
- The quality and accuracy of outputs depend on the inputs provided and the limitations of the AI model
- Automated processing is not used to make decisions that produce legal effects or similarly significantly affect you without human oversight

### Your Rights Regarding Automated Decisions

You have the right not to be subject to decisions based solely on automated processing, including profiling, that produce legal or similarly significant effects concerning you. You may:

- Request human intervention in any automated decision
- Express your point of view regarding automated decisions
- Contest any automated decision that affects you

To exercise these rights, contact us at [your-email@example.com].


## 12. Necessity of Data Provision (Art. 13(2)(e))

Pursuant to GDPR Art. 13(2)(e), we inform you whether the provision of personal data is a statutory or contractual requirement, or a requirement necessary to enter into a contract, and the possible consequences of failure to provide such data.

- **Required data (contractual necessity):** Data necessary for account creation, authentication, and core service functionality. The provision of this data is a requirement necessary to enter into and perform our contract with you. Failure to provide this data will result in our inability to provide you with the Service.
- **Optional data (consent-based):** Data collected for analytics, personalisation, and service improvement. The provision of this data is voluntary and not a contractual requirement. You may decline to provide this data without any impact on your ability to use the core Service.

## 13. How We Protect Your Data

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

### Monitoring and Incident Detection

- We use error tracking and performance monitoring (sentry-ruby) to detect anomalies and potential security incidents
- Automated alerts are configured for suspicious activity and system errors
- Security events are logged and reviewed to identify potential threats

### Backups and Recovery

- Regular automated backups of all databases containing personal data
- Backups are encrypted and stored in secure, geographically separate locations
- Recovery procedures are tested periodically to ensure data can be restored in the event of an incident

### Security Assessments

- Regular security reviews and vulnerability assessments are conducted
- Third-party services are evaluated for security before integration
- We maintain an incident response plan for handling data breaches (see `INCIDENT_RESPONSE_PLAN.md`)


## 14. Changes to This Policy

We may revise this Policy from time to time to reflect changes in our data processing practices, applicable law, or regulatory guidance. Where we make material changes, we will notify you by reasonable means, such as a prominent notice on the Service or by email to the address associated with your account, at least thirty (30) days prior to the changes taking effect.

We will not reduce your rights under this Policy without your explicit consent. Each version of this Policy will be identified by its effective date, and we will maintain an archive of prior versions available upon request.

Your continued use of the Service after the effective date of any revised Policy constitutes your acceptance of the revised terms. If you do not agree with the revised Policy, you must discontinue use of the Service.

## 15. Contact

If you have questions about this Policy or wish to exercise your data protection rights, please contact us at:

- **Email:** [your-email@example.com]
