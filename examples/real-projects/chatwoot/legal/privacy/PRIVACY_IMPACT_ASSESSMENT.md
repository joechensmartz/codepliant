# Privacy Impact Assessment (DPIA)

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** @chatwoot/chatwoot

**Data Controller:** [Your Company Name]

**Contact:** [your-email@example.com]

**DPO:** [DPO Name] ([dpo@example.com])

## Related Documents

- Privacy Policy (`PRIVACY_POLICY.md`)
- Record of Processing Activities (`RECORD_OF_PROCESSING_ACTIVITIES.md`)
- Risk Register (`RISK_REGISTER.md`)
- Lawful Basis Assessment (`LAWFUL_BASIS_ASSESSMENT.md`)

---

> This Data Protection Impact Assessment is prepared pursuant to **Article 35 of the General Data Protection Regulation (EU) 2016/679 (GDPR)**. A DPIA is required when data processing is likely to result in a high risk to the rights and freedoms of natural persons, particularly when using new technologies.

## 1. Description of Processing

### 1.1 Overview

This assessment covers the data processing activities of the **@chatwoot/chatwoot** application operated by [Your Company Name]. The following describes the nature, scope, context, and purposes of processing.

### 1.2 Services and Data Processing Activities

The application integrates the following services that process personal data:

| Service | Category | Data Processed | Legal Basis |
|---------|----------|---------------|-------------|
| @amplitude/analytics-browser | analytics | user behavior, device information, session data | Consent |
| @aws-sdk/client-s3 | storage | uploaded files, file metadata | Contractual necessity |
| @twilio/voice-sdk | other | phone numbers, voice call metadata, call recordings, device information | Legitimate interest |
| ActionCable | other | real-time user data, connection metadata, channel subscriptions, WebSocket messages | Legitimate interest |
| ActionController::Cookies | other | session cookies, session data, CSRF tokens | Legitimate interest |
| ActionMailer | email | email addresses, email content | Contractual necessity / Consent |
| Active Storage | storage | uploaded files, file metadata, storage service credentials, potential PII in uploaded content | Contractual necessity |
| ActiveRecord | database | user data as defined in schema, timestamps, associations | Contractual necessity |
| ActiveStorage | storage | uploaded files, file metadata, storage references | Contractual necessity |
| aws-sdk-s3 | storage | uploaded files, file metadata | Contractual necessity |
| devise | auth | email, password hash, session data, authentication tokens | Contractual necessity |
| google-cloud-storage | storage | uploaded files, file metadata | Contractual necessity |
| ioredis | database | cached data, session data | Contractual necessity |
| MailHog | email | email content | Contractual necessity / Consent |
| Meta Pixel | advertising | page views, conversion events, user behavior, device information | Consent |
| nodemailer | email | email addresses, email content | Contractual necessity / Consent |
| omniauth | auth | email, name, OAuth tokens, profile data | Contractual necessity |
| pg | database | user data as defined in schema | Contractual necessity |
| PostgreSQL (env) | database | application data, user records | Contractual necessity |
| pundit | auth | user roles, authorization policies, access control data | Contractual necessity |
| rack-attack | other | IP addresses, request metadata | Legitimate interest |
| rails-actionmailer | email | email addresses, email content | Contractual necessity / Consent |
| rails-activerecord | database | user data as defined in schema | Contractual necessity |
| rails-sessions | auth | session cookies, CSRF tokens | Contractual necessity |
| redis | database | cached data, session data | Contractual necessity |
| Redis | database | session data, cache data | Contractual necessity |
| Redis (env) | database | session data, cache data | Contractual necessity |
| ruby-openai | ai | user prompts, conversation history, generated content | Consent / Legitimate interest |
| sentry-ruby | monitoring | error data, stack traces, user context, device information | Legitimate interest |
| sidekiq | other | job data, user data processed in background jobs | Legitimate interest |
| stripe | payment | payment information, billing address, email, transaction history | Contractual necessity |
| twilio-ruby | other | phone numbers, SMS message content, voice call metadata | Legitimate interest |

### 1.3 Categories of Personal Data

- **Personal Identity Data:** Email addresses, names, profile pictures, and account credentials collected through authentication. names, display names, avatar images, locale/language preferences, usernames detected in OpenAPI/Swagger spec fields: items.name, profile.name, profile.display_name, profile.avatar, automation_rule_item.name, portal_item.name, category.locale, category.name, user.display_name, user.name, agent.name, inbox.name, inbox_contact.name, agent_bot.name, custom_filter.name, webhook.name, account.name, account_detail.name, account_detail.locale, platform_account.name, team.name, integrations_app.name, audit_log.username, public_contact.name, public_inbox.name, account_create_update_payload.name, account_create_update_payload.locale, account_update_payload.name, account_update_payload.locale, platform_agent_bot_create_update_payload.name, platform_agent_bot_create_update_payload.avatar, agent_bot_create_update_payload.name, agent_bot_create_update_payload.avatar, user_create_update_payload.name, user_create_update_payload.display_name, agent_create_payload.name, contact_create_payload.name, contact_create_payload.avatar, contact_update_payload.name, contact_update_payload.avatar, template_params.name, inbox_create_payload.name, inbox_create_payload.avatar, inbox_update_payload.name, inbox_update_payload.avatar, team_create_update_payload.name, custom_filter_create_update_payload.name, webhook_create_update_payload.name, automation_rule_create_update_payload.name, portal_create_update_payload.name, category_create_update_payload.name, category_create_update_payload.locale, article_create_update_payload.locale, public_contact_create_update_payload.name, public_contact_create_update_payload.avatar, submitted_values.name, sender.name, agent_conversation_metrics.name, contact_detail.name, contact_list_item.name, reporting_event.name, RequestBody.name (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}), RequestBody.display_name (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}), RequestBody.name (PUT /api/v1/profile), RequestBody.display_name (PUT /api/v1/profile), RequestBody.avatar (PUT /api/v1/profile). (sources: devise, pundit, omniauth, rails-sessions, items.name, profile.name, profile.display_name, profile.avatar, automation_rule_item.name, portal_item.name, category.locale, category.name, user.display_name, user.name, agent.name, inbox.name, inbox_contact.name, agent_bot.name, custom_filter.name, webhook.name, account.name, account_detail.name, account_detail.locale, platform_account.name, team.name, integrations_app.name, audit_log.username, public_contact.name, public_inbox.name, account_create_update_payload.name, account_create_update_payload.locale, account_update_payload.name, account_update_payload.locale, platform_agent_bot_create_update_payload.name, platform_agent_bot_create_update_payload.avatar, agent_bot_create_update_payload.name, agent_bot_create_update_payload.avatar, user_create_update_payload.name, user_create_update_payload.display_name, agent_create_payload.name, contact_create_payload.name, contact_create_payload.avatar, contact_update_payload.name, contact_update_payload.avatar, template_params.name, inbox_create_payload.name, inbox_create_payload.avatar, inbox_update_payload.name, inbox_update_payload.avatar, team_create_update_payload.name, custom_filter_create_update_payload.name, webhook_create_update_payload.name, automation_rule_create_update_payload.name, portal_create_update_payload.name, category_create_update_payload.name, category_create_update_payload.locale, article_create_update_payload.locale, public_contact_create_update_payload.name, public_contact_create_update_payload.avatar, submitted_values.name, sender.name, agent_conversation_metrics.name, contact_detail.name, contact_list_item.name, reporting_event.name, RequestBody.name (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}), RequestBody.display_name (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}), RequestBody.name (PUT /api/v1/profile), RequestBody.display_name (PUT /api/v1/profile), RequestBody.avatar (PUT /api/v1/profile))
- **Financial Data:** Payment card information, billing addresses, and transaction history processed through payment providers. (sources: stripe)
- **Usage & Behavioral Data:** Page views, click patterns, session recordings, device information, and IP addresses collected through analytics tools. (sources: @amplitude/analytics-browser)
- **AI Interaction Data:** User prompts, conversation history, and AI-generated content processed through third-party AI services. (sources: ruby-openai)
- **Communication Data:** Email addresses and email content processed through email service providers. (sources: rails-actionmailer, nodemailer, ActionMailer, MailHog)
- **Technical & Diagnostic Data:** Error reports, stack traces, performance data, and user context collected through monitoring tools. (sources: sentry-ruby)
- **User-Uploaded Content:** Files, images, and documents uploaded by users and stored through cloud storage providers. (sources: aws-sdk-s3, google-cloud-storage, @aws-sdk/client-s3, ActiveStorage, Active Storage)
- **Advertising & Conversion Data:** Conversion events, page views, user interactions, and device information collected through advertising pixels and tracking scripts. (sources: Meta Pixel)
- **Stored User Data:** Persistent user data stored in databases as defined by the application schema. (sources: pg, redis, rails-activerecord, ioredis, ActiveRecord, PostgreSQL (env), Redis (env), Redis, Redis (Cache))
- **Contact Information:** email addresses, phone numbers detected in OpenAPI/Swagger spec fields: items.email, items.phone_number, profile.email, profile.phone_number, user.email, agent.email, inbox.phone_number, public_contact.email, user_create_update_payload.email, agent_create_payload.email, contact_create_payload.email, contact_create_payload.phone_number, contact_update_payload.email, contact_update_payload.phone_number, public_contact_create_update_payload.email, public_contact_create_update_payload.phone_number, sender.email, sender.phone_number, agent_conversation_metrics.email, contact_detail.email, contact_detail.phone_number, contact_list_item.email, contact_list_item.phone_number, RequestBody.email (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}), RequestBody.phone_number (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}), RequestBody.email (PUT /api/v1/profile), RequestBody.phone_number (PUT /api/v1/profile). (sources: items.email, items.phone_number, profile.email, profile.phone_number, user.email, agent.email, inbox.phone_number, public_contact.email, user_create_update_payload.email, agent_create_payload.email, contact_create_payload.email, contact_create_payload.phone_number, contact_update_payload.email, contact_update_payload.phone_number, public_contact_create_update_payload.email, public_contact_create_update_payload.phone_number, sender.email, sender.phone_number, agent_conversation_metrics.email, contact_detail.email, contact_detail.phone_number, contact_list_item.email, contact_list_item.phone_number, RequestBody.email (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}), RequestBody.phone_number (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}), RequestBody.email (PUT /api/v1/profile), RequestBody.phone_number (PUT /api/v1/profile))
- **Authentication Data:** passwords detected in OpenAPI/Swagger spec fields: profile.password, user_create_update_payload.password, RequestBody.password (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}), RequestBody.password (PUT /api/v1/profile). (sources: profile.password, user_create_update_payload.password, RequestBody.password (PUT /api/v1/accounts/{account_id}/integrations/hooks/{hook_id}), RequestBody.password (PUT /api/v1/profile))
- **Location Data:** timezone information, city information, country information detected in OpenAPI/Swagger spec fields: inbox.timezone, custom_attributes.timezone, public_inbox.timezone, account_update_payload.timezone, inbox_create_payload.timezone, inbox_update_payload.timezone, additional_attributes.city, additional_attributes.country. (sources: inbox.timezone, custom_attributes.timezone, public_inbox.timezone, account_update_payload.timezone, inbox_create_payload.timezone, inbox_update_payload.timezone, additional_attributes.city, additional_attributes.country)

### 1.4 Categories of Data Subjects

- End users of the application
- Registered account holders
- Website visitors
- Customers and prospective customers

> **Action required:** Review and update the categories of data subjects to reflect your actual processing activities.

## 2. Necessity and Proportionality Assessment

### 2.1 Lawfulness of Processing

Each data processing activity must have a valid legal basis under Article 6 GDPR:

| Processing Activity | Legal Basis | Justification |
|---------------------|-------------|---------------|
| Behavioral analytics via @amplitude/analytics-browser | Consent | Used to understand usage patterns and improve the service; requires prior consent |
| File storage via @aws-sdk/client-s3 | Contractual necessity | Necessary to provide file storage features requested by the user |
| Data processing via @twilio/voice-sdk | Legitimate interest | To be documented based on specific use case |
| Data processing via ActionCable | Legitimate interest | To be documented based on specific use case |
| Data processing via ActionController::Cookies | Legitimate interest | To be documented based on specific use case |
| Email communications via ActionMailer | Contractual necessity / Consent | Necessary for service communications; marketing requires separate consent |
| File storage via Active Storage | Contractual necessity | Necessary to provide file storage features requested by the user |
| Data persistence via ActiveRecord | Contractual necessity | Necessary to persist user data for service delivery |
| File storage via ActiveStorage | Contractual necessity | Necessary to provide file storage features requested by the user |
| File storage via aws-sdk-s3 | Contractual necessity | Necessary to provide file storage features requested by the user |
| Authentication via devise | Contractual necessity | Necessary to authenticate and maintain user sessions |
| File storage via google-cloud-storage | Contractual necessity | Necessary to provide file storage features requested by the user |
| Data persistence via ioredis | Contractual necessity | Necessary to persist user data for service delivery |
| Email communications via MailHog | Contractual necessity / Consent | Necessary for service communications; marketing requires separate consent |
| Advertising tracking via Meta Pixel | Consent | Used for targeted advertising; requires explicit user consent |
| Email communications via nodemailer | Contractual necessity / Consent | Necessary for service communications; marketing requires separate consent |
| Authentication via omniauth | Contractual necessity | Necessary to authenticate and maintain user sessions |
| Data persistence via pg | Contractual necessity | Necessary to persist user data for service delivery |
| Data persistence via PostgreSQL (env) | Contractual necessity | Necessary to persist user data for service delivery |
| Authentication via pundit | Contractual necessity | Necessary to authenticate and maintain user sessions |
| Data processing via rack-attack | Legitimate interest | To be documented based on specific use case |
| Email communications via rails-actionmailer | Contractual necessity / Consent | Necessary for service communications; marketing requires separate consent |
| Data persistence via rails-activerecord | Contractual necessity | Necessary to persist user data for service delivery |
| Authentication via rails-sessions | Contractual necessity | Necessary to authenticate and maintain user sessions |
| Data persistence via redis | Contractual necessity | Necessary to persist user data for service delivery |
| Data persistence via Redis | Contractual necessity | Necessary to persist user data for service delivery |
| Data persistence via Redis (env) | Contractual necessity | Necessary to persist user data for service delivery |
| AI processing via ruby-openai | Consent / Legitimate interest | Required for AI-powered features; user consent obtained before processing |
| Error/performance monitoring via sentry-ruby | Legitimate interest | Legitimate interest in maintaining service reliability and security |
| Data processing via sidekiq | Legitimate interest | To be documented based on specific use case |
| Payment processing via stripe | Contractual necessity | Necessary to process transactions requested by the user |
| Data processing via twilio-ruby | Legitimate interest | To be documented based on specific use case |

### 2.2 Data Minimization

The following data minimization measures should be verified:

**AI Services:**
- [ ] Only data strictly necessary for the AI feature is transmitted to the provider
- [ ] User prompts are not stored beyond the session unless the user explicitly opts in
- [ ] No special category data is included in AI requests without explicit consent

**Analytics Services:**
- [ ] IP anonymization is enabled
- [ ] Only necessary tracking events are collected
- [ ] Session recording excludes sensitive form fields
- [ ] Data retention periods are configured to the minimum necessary

### 2.3 Proportionality

- [ ] The processing is necessary to achieve the stated purpose and cannot be achieved by less intrusive means
- [ ] The volume of data collected is proportionate to the processing purpose
- [ ] Data retention periods are limited to what is strictly necessary
- [ ] Data subjects are clearly informed about the processing

> **Action required:** Document how each processing activity satisfies the necessity and proportionality requirements. Verify that less privacy-intrusive alternatives have been considered.

## 3. Risk Assessment

### 3.1 Methodology

Risk is assessed using a **likelihood x impact** matrix. Each data processing activity is scored on two dimensions:

**Likelihood** (probability of harm occurring):

| Score | Level | Description |
|-------|-------|-------------|
| 1 | Unlikely | Remote chance of occurrence |
| 2 | Possible | Could occur in some circumstances |
| 3 | Likely | Will probably occur |
| 4 | Almost Certain | Expected to occur in most circumstances |

**Impact** (severity of harm to data subjects):

| Score | Level | Description |
|-------|-------|-------------|
| 1 | Negligible | Minor inconvenience, easily recoverable |
| 2 | Limited | Some damage, recoverable with effort |
| 3 | Significant | Serious harm, difficult to recover |
| 4 | Maximum | Irreversible or very serious harm |

**Risk Rating:** Likelihood x Impact

| Rating | Score Range | Action Required |
|--------|-------------|-----------------|
| Low | 1-4 | Accept with standard controls |
| Medium | 5-8 | Mitigate with additional controls |
| High | 9-12 | Significant mitigation required before processing |
| Critical | 13-16 | Must not proceed without DPA consultation and substantial mitigation |

### 3.2 Risk Assessment Results

| # | Processing Activity | Data Processed | Likelihood | Impact | Score | Rating |
|---|---------------------|---------------|------------|--------|-------|--------|
| 1 | Behavioral analytics via @amplitude/analytics-browser | user behavior, device information, session data | 3 (Likely) | 3 (Significant) | **9** | **High** |
| 2 | File storage via @aws-sdk/client-s3 | uploaded files, file metadata | 1 (Unlikely) | 1 (Negligible) | **1** | **Low** |
| 3 | Data processing via @twilio/voice-sdk | phone numbers, voice call metadata, call recordings, device information | 1 (Unlikely) | 3 (Significant) | **3** | **Low** |
| 4 | Data processing via ActionCable | real-time user data, connection metadata, channel subscriptions, WebSocket messages | 1 (Unlikely) | 1 (Negligible) | **1** | **Low** |
| 5 | Data processing via ActionController::Cookies | session cookies, session data, CSRF tokens | 1 (Unlikely) | 3 (Significant) | **3** | **Low** |
| 6 | Email communications via ActionMailer | email addresses, email content | 2 (Possible) | 2 (Limited) | **4** | **Low** |
| 7 | File storage via Active Storage | uploaded files, file metadata, storage service credentials, potential PII in uploaded content | 1 (Unlikely) | 1 (Negligible) | **1** | **Low** |
| 8 | Data persistence via ActiveRecord | user data as defined in schema, timestamps, associations | 2 (Possible) | 1 (Negligible) | **2** | **Low** |
| 9 | File storage via ActiveStorage | uploaded files, file metadata, storage references | 1 (Unlikely) | 1 (Negligible) | **1** | **Low** |
| 10 | File storage via aws-sdk-s3 | uploaded files, file metadata | 1 (Unlikely) | 1 (Negligible) | **1** | **Low** |
| 11 | Authentication via devise | email, password hash, session data, authentication tokens | 2 (Possible) | 3 (Significant) | **6** | **Medium** |
| 12 | File storage via google-cloud-storage | uploaded files, file metadata | 1 (Unlikely) | 1 (Negligible) | **1** | **Low** |
| 13 | Data persistence via ioredis | cached data, session data | 2 (Possible) | 3 (Significant) | **6** | **Medium** |
| 14 | Email communications via MailHog | email content | 2 (Possible) | 2 (Limited) | **4** | **Low** |
| 15 | Advertising tracking via Meta Pixel | page views, conversion events, user behavior, device information | 3 (Likely) | 2 (Limited) | **6** | **Medium** |
| 16 | Email communications via nodemailer | email addresses, email content | 2 (Possible) | 2 (Limited) | **4** | **Low** |
| 17 | Authentication via omniauth | email, name, OAuth tokens, profile data | 2 (Possible) | 3 (Significant) | **6** | **Medium** |
| 18 | Data persistence via pg | user data as defined in schema | 2 (Possible) | 1 (Negligible) | **2** | **Low** |
| 19 | Data persistence via PostgreSQL (env) | application data, user records | 2 (Possible) | 1 (Negligible) | **2** | **Low** |
| 20 | Authentication via pundit | user roles, authorization policies, access control data | 2 (Possible) | 1 (Negligible) | **2** | **Low** |
| 21 | Data processing via rack-attack | IP addresses, request metadata | 1 (Unlikely) | 2 (Limited) | **2** | **Low** |
| 22 | Email communications via rails-actionmailer | email addresses, email content | 2 (Possible) | 2 (Limited) | **4** | **Low** |
| 23 | Data persistence via rails-activerecord | user data as defined in schema | 2 (Possible) | 1 (Negligible) | **2** | **Low** |
| 24 | Authentication via rails-sessions | session cookies, CSRF tokens | 2 (Possible) | 3 (Significant) | **6** | **Medium** |
| 25 | Data persistence via redis | cached data, session data | 2 (Possible) | 3 (Significant) | **6** | **Medium** |
| 26 | Data persistence via Redis | session data, cache data | 2 (Possible) | 3 (Significant) | **6** | **Medium** |
| 27 | Data persistence via Redis (env) | session data, cache data | 2 (Possible) | 3 (Significant) | **6** | **Medium** |
| 28 | AI processing via ruby-openai | user prompts, conversation history, generated content | 3 (Likely) | 2 (Limited) | **6** | **Medium** |
| 29 | Error/performance monitoring via sentry-ruby | error data, stack traces, user context, device information | 2 (Possible) | 1 (Negligible) | **2** | **Low** |
| 30 | Data processing via sidekiq | job data, user data processed in background jobs | 1 (Unlikely) | 1 (Negligible) | **1** | **Low** |
| 31 | Payment processing via stripe | payment information, billing address, email, transaction history | 2 (Possible) | 4 (Maximum) | **8** | **Medium** |
| 32 | Data processing via twilio-ruby | phone numbers, SMS message content, voice call metadata | 1 (Unlikely) | 3 (Significant) | **3** | **Low** |

### 3.3 Risk Summary

| Rating | Count |
|--------|-------|
| Critical | 0 |
| High | 1 |
| Medium | 10 |
| Low | 21 |
| **Total** | **32** |

## 4. High-Risk Processing Triggers

Article 35(3) GDPR and the EDPB Guidelines on DPIAs identify specific types of processing that are likely to result in high risk. The following assessment is based on detected services:

| Trigger | Status | Description |
|---------|--------|-------------|
| Large-Scale Profiling | **TRIGGERED** | Systematic evaluation of personal aspects based on automated processing, including profiling (Art. 35(3)(a)) |
| Systematic Monitoring | **Not detected** | Systematic monitoring of a publicly accessible area on a large scale (Art. 35(3)(c)) |
| Sensitive / Special Category Data | **Not detected** | Processing of special categories of data on a large scale (Art. 35(3)(b)) |
| AI-Powered Decision Making | **TRIGGERED** | Automated decision-making with legal or similarly significant effects, including AI inference and content generation (Art. 22 GDPR) |

> **2 high-risk trigger(s) detected.** This DPIA is mandatory under Article 35 GDPR. Multiple triggers increase the overall risk profile.

## 5. Data Flow Diagram

A detailed data flow map showing how personal data is collected, stored, processed, and shared across all integrated services is available in the companion document:

> **See [DATA_FLOW_MAP.md](./DATA_FLOW_MAP.md)** for the complete data flow diagram.

The data flow map covers:

- **Collection points:** How and where personal data enters the system
- **Storage locations:** Where personal data is persisted
- **Sharing / third-party transfers:** Which services receive personal data and for what purpose
- **Cross-border transfers:** Data flows outside the EEA

## 6. Risk Mitigation Measures

The following mitigation measures are recommended for each category of data processing activity detected in the application:

### 6.1 Analytics (@amplitude/analytics-browser)

**Current risk rating:** High

**Recommended measures:**

- [ ] Enable IP anonymization / pseudonymization where available
- [ ] Implement cookie consent management with granular opt-in/opt-out
- [ ] Configure data retention limits within the analytics platform
- [ ] Limit collection to strictly necessary data points
- [ ] Disable session recordings for authenticated areas with sensitive data
- [ ] Conduct regular data minimization reviews

### 6.2 Storage (@aws-sdk/client-s3, Active Storage, ActiveStorage, aws-sdk-s3, google-cloud-storage)

**Current risk rating:** Low

**Recommended measures:**

- [ ] Encrypt files at rest and in transit
- [ ] Implement access controls on stored files
- [ ] Establish data retention and deletion policies for uploaded files
- [ ] Scan uploaded files for malware before storage

### 6.3 Other (@twilio/voice-sdk, ActionCable, ActionController::Cookies, rack-attack, sidekiq, twilio-ruby)

**Current risk rating:** Low

**Recommended measures:**

- [ ] Review data processing activities and apply data minimization
- [ ] Ensure appropriate DPAs are in place with the service provider
- [ ] Conduct periodic reviews of necessity and proportionality

### 6.4 Email (ActionMailer, MailHog, nodemailer, rails-actionmailer)

**Current risk rating:** Low

**Recommended measures:**

- [ ] Use transactional email only for necessary communications
- [ ] Implement unsubscribe mechanisms for marketing emails
- [ ] Avoid embedding tracking pixels where not strictly necessary
- [ ] Ensure email provider DPA is in place

### 6.5 Database (ActiveRecord, ioredis, pg, PostgreSQL (env), rails-activerecord, redis, Redis, Redis (env))

**Current risk rating:** Medium

**Recommended measures:**

- [ ] Encrypt sensitive fields at the application level
- [ ] Implement role-based access controls for database access
- [ ] Enable audit logging for data access and modifications
- [ ] Establish and enforce data retention schedules

### 6.6 Auth (devise, omniauth, pundit, rails-sessions)

**Current risk rating:** Medium

**Recommended measures:**

- [ ] Enforce strong password policies or passwordless authentication
- [ ] Implement multi-factor authentication (MFA)
- [ ] Minimize profile data collected during registration
- [ ] Regularly rotate and securely store OAuth tokens and secrets

### 6.7 Advertising (Meta Pixel)

**Current risk rating:** Medium

**Recommended measures:**

- [ ] Implement explicit consent before activating advertising trackers
- [ ] Provide transparent opt-out mechanisms
- [ ] Avoid sharing identifiable data with advertising platforms where possible
- [ ] Review and limit data shared via advertising pixels and SDKs

### 6.8 Ai (ruby-openai)

**Current risk rating:** Medium

**Recommended measures:**

- [ ] Implement input/output filtering to prevent transmission of unnecessary personal data
- [ ] Enable opt-out mechanisms for AI-powered features
- [ ] Conduct regular audits of AI provider data handling practices
- [ ] Minimize data sent to AI providers (data minimization principle)
- [ ] Ensure AI provider DPA is in place with SCCs for international transfers
- [ ] Implement human oversight for AI-assisted decisions affecting individuals

### 6.9 Monitoring (sentry-ruby)

**Current risk rating:** Low

**Recommended measures:**

- [ ] Configure PII scrubbing in error reports and stack traces
- [ ] Limit user context attached to monitoring events
- [ ] Set appropriate data retention periods for monitoring data
- [ ] Restrict access to monitoring dashboards to authorized personnel

### 6.10 Payment (stripe)

**Current risk rating:** Medium

**Recommended measures:**

- [ ] Use tokenization to avoid direct handling of payment card data
- [ ] Ensure PCI DSS compliance through the payment processor
- [ ] Limit stored payment data to transaction references only
- [ ] Implement strong authentication for payment-related actions


## 7. Consultation Requirements

### 7.1 Data Protection Authority Consultation (Art. 36 GDPR)

Under Article 36 GDPR, the controller must consult the supervisory authority prior to processing where a DPIA indicates that the processing would result in a high risk in the absence of measures taken by the controller to mitigate the risk.

**Consultation required:** **YES** — Based on the risk assessment, consultation with your Data Protection Authority is recommended before proceeding with processing.

### 7.2 When to Consult

You should consult your supervisory authority when:

1. The DPIA indicates that processing would result in a high risk that cannot be sufficiently mitigated
2. You are uncertain whether your mitigation measures adequately address the identified risks
3. National law requires consultation for this type of processing

### 7.3 Consultation Process

1. Compile this DPIA and all supporting documentation
2. Document the mitigation measures you have implemented or plan to implement
3. Submit to your lead supervisory authority (the DPA in the EU Member State where your main establishment is located)
4. The DPA has up to 8 weeks (extendable by 6 weeks) to provide written advice
5. Do not proceed with the processing until you receive the DPA's response

### 7.4 Internal Consultation

Regardless of DPA consultation requirements, the following internal stakeholders should review this DPIA:

- [ ] Data Protection Officer
- [ ] Legal / Compliance team
- [ ] Engineering / Development team
- [ ] Information Security team
- [ ] Product Management

## 8. Review and Monitoring

### 8.1 Review Schedule

This DPIA must be reviewed:

- **At least annually**, or
- When there is a **significant change** in processing operations, including:
  - New services or data processors added
  - Changes in the type or volume of data processed
  - New purposes for processing
  - Changes in the technical or organizational measures
  - Security incidents involving personal data

### 8.2 Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-16 | Auto-generated | Initial DPIA based on code analysis |

> **Action required:** Maintain this version history as the DPIA is reviewed and updated.

## 9. Approval and Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Data Controller | _________________ | _________________ | __________ |
| Data Protection Officer | _________________ | _________________ | __________ |
| IT / Security Lead | _________________ | _________________ | __________ |
| Legal / Compliance | _________________ | _________________ | __________ |

---

*This Privacy Impact Assessment was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. This document is a starting point and must be reviewed, completed, and approved by qualified personnel including your Data Protection Officer and legal counsel to ensure compliance with GDPR Article 35 and other applicable regulations. It does not constitute legal advice.*