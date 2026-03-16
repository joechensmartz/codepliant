# Privacy Policy

**Effective Date:** 2026-03-16
**Last Updated:** 2026-03-16
**Previous Version:** [View previous version]([previous-version-url])

**Project:** twenty

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

Email addresses, names, profile pictures, and account credentials collected through authentication. names, display names detected in TypeORM/Sequelize model fields: ApiKeyEntity.name, BillingMeterEntity.displayName, BillingProductEntity.name, WorkspaceSSOIdentityProviderEntity.name, WorkspaceEntity.displayName. names detected in Drizzle ORM table fields: labels.name. names, locale/language preferences, first names, last names, display names, usernames detected in GraphQL schema fields: ApiKey.name, ApplicationRegistration.name, UserWorkspace.locale, FullName.firstName, FullName.lastName, WorkspaceMember.name, WorkspaceMember.locale, Agent.name, ApiKeyForRole.name, LogicFunction.name, Field.name, Index.name, Application.name, ViewFieldGroup.name, View.name, Workspace.displayName, User.firstName, User.lastName, User.locale, PageLayout.name, BillingProduct.name, BillingLicensedProduct.name, BillingMeteredProduct.name, SSOConnection.name, AvailableWorkspace.displayName, DeletedWorkspaceMember.name, SSOIdentityProvider.name, PublicWorkspaceData.displayName, PublicApplicationRegistration.name, EditSso.name, WorkspaceNameAndId.displayName, FindAvailableSSOIDP.name, SetupSso.name, NavigationMenuItem.name, ToolIndexEntry.name, Skill.name, FrontComponent.name, ConfigVariable.name, ConfigVariablesGroupData.name, QueueJob.name, UserInfo.firstName, UserInfo.lastName, WorkspaceInfo.name, MarketplaceAppField.name, MarketplaceAppLogicFunction.name, MarketplaceAppFrontComponent.name, MarketplaceApp.name, ConnectionParametersOutput.username, CreatePageLayoutInput.name, UpdatePageLayoutInput.name, UpdatePageLayoutWithTabsInput.name, CreateLogicFunctionFromSourceInput.name, UpdateLogicFunctionFromSourceInputUpdates.name, CreateViewInput.name, UpdateViewInput.name, UpdateViewFieldGroupInputUpdates.name, CreateViewFieldGroupInput.name, UpsertFieldsWidgetGroupInput.name, CreateFrontComponentInput.name, UpdateFrontComponentInputUpdates.name, CreateAgentInput.name, UpdateAgentInput.name, CreateNavigationMenuItemInput.name, UpdateNavigationMenuItemInput.name, CreateApiKeyInput.name, UpdateApiKeyInput.name, CreateFieldInput.name, UpdateFieldInput.name, ActivateWorkspaceInput.displayName, UpdateWorkspaceInput.displayName, CreateApplicationRegistrationInput.name, UpdateApplicationRegistrationPayload.name, SetupOIDCSsoInput.name, SetupSAMLSsoInput.name, CreateSkillInput.name, UpdateSkillInput.name, ConnectionParameters.username, LogicFunctionLogsInput.name.

**Collected through:** passport-google-oauth20, passport-microsoft, passport, ApiKeyEntity.name, BillingMeterEntity.displayName, BillingProductEntity.name, WorkspaceSSOIdentityProviderEntity.name, WorkspaceEntity.displayName, labels.name, ApiKey.name, ApplicationRegistration.name, UserWorkspace.locale, FullName.firstName, FullName.lastName, WorkspaceMember.name, WorkspaceMember.locale, Agent.name, ApiKeyForRole.name, LogicFunction.name, Field.name, Index.name, Application.name, ViewFieldGroup.name, View.name, Workspace.displayName, User.firstName, User.lastName, User.locale, PageLayout.name, BillingProduct.name, BillingLicensedProduct.name, BillingMeteredProduct.name, SSOConnection.name, AvailableWorkspace.displayName, DeletedWorkspaceMember.name, SSOIdentityProvider.name, PublicWorkspaceData.displayName, PublicApplicationRegistration.name, EditSso.name, WorkspaceNameAndId.displayName, FindAvailableSSOIDP.name, SetupSso.name, NavigationMenuItem.name, ToolIndexEntry.name, Skill.name, FrontComponent.name, ConfigVariable.name, ConfigVariablesGroupData.name, QueueJob.name, UserInfo.firstName, UserInfo.lastName, WorkspaceInfo.name, MarketplaceAppField.name, MarketplaceAppLogicFunction.name, MarketplaceAppFrontComponent.name, MarketplaceApp.name, ConnectionParametersOutput.username, CreatePageLayoutInput.name, UpdatePageLayoutInput.name, UpdatePageLayoutWithTabsInput.name, CreateLogicFunctionFromSourceInput.name, UpdateLogicFunctionFromSourceInputUpdates.name, CreateViewInput.name, UpdateViewInput.name, UpdateViewFieldGroupInputUpdates.name, CreateViewFieldGroupInput.name, UpsertFieldsWidgetGroupInput.name, CreateFrontComponentInput.name, UpdateFrontComponentInputUpdates.name, CreateAgentInput.name, UpdateAgentInput.name, CreateNavigationMenuItemInput.name, UpdateNavigationMenuItemInput.name, CreateApiKeyInput.name, UpdateApiKeyInput.name, CreateFieldInput.name, UpdateFieldInput.name, ActivateWorkspaceInput.displayName, UpdateWorkspaceInput.displayName, CreateApplicationRegistrationInput.name, UpdateApplicationRegistrationPayload.name, SetupOIDCSsoInput.name, SetupSAMLSsoInput.name, CreateSkillInput.name, UpdateSkillInput.name, ConnectionParameters.username, LogicFunctionLogsInput.name

### Financial Data

Payment card information, billing addresses, and transaction history processed through payment providers.

**Collected through:** stripe

### AI Interaction Data

User prompts, conversation history, and AI-generated content processed through third-party AI services.

**Collected through:** openai, @vercel/ai, @ai-sdk/openai, @ai-sdk/anthropic, @ai-sdk/google

### Communication Data

Email addresses and email content processed through email service providers.

**Collected through:** nodemailer

### Technical & Diagnostic Data

Error reports, stack traces, performance data, and user context collected through monitoring tools.

**Collected through:** @sentry/node

### User-Uploaded Content

Files, images, and documents uploaded by users and stored through cloud storage providers.

**Collected through:** @aws-sdk/client-s3

### Stored User Data

Persistent user data stored in databases as defined by the application schema.

**Collected through:** ioredis, redis, drizzle, Redis (Cache)

### Contact Information

email addresses detected in TypeORM/Sequelize model fields: AppTokenEntity.email. email addresses detected in GraphQL schema fields: User.email, WorkspaceInvitation.email, ValidatePasswordResetToken.email, UserInfo.email, CreateApprovedAccessDomainInput.email.

**Collected through:** AppTokenEntity.email, User.email, WorkspaceInvitation.email, ValidatePasswordResetToken.email, UserInfo.email, CreateApprovedAccessDomainInput.email

### Authentication Data

password hashes detected in TypeORM/Sequelize model fields: PostgresCredentialsEntity.passwordHash. passwords detected in GraphQL schema fields: AuthProviders.password, AuthBypassProviders.password, ConnectionParametersOutput.password, PostgresCredentials.password, ConnectionParameters.password.

**Collected through:** PostgresCredentialsEntity.passwordHash, AuthProviders.password, AuthBypassProviders.password, ConnectionParametersOutput.password, PostgresCredentials.password, ConnectionParameters.password

### Location Data

timezone information, city information, country information, location data detected in GraphQL schema fields: WorkspaceMember.timeZone, AggregateChartConfiguration.timezone, PieChartConfiguration.timezone, LineChartConfiguration.timezone, GaugeChartConfiguration.timezone, BarChartConfiguration.timezone, PlaceDetailsResult.city, PlaceDetailsResult.country, PlaceDetailsResult.location.

**Collected through:** WorkspaceMember.timeZone, AggregateChartConfiguration.timezone, PieChartConfiguration.timezone, LineChartConfiguration.timezone, GaugeChartConfiguration.timezone, BarChartConfiguration.timezone, PlaceDetailsResult.city, PlaceDetailsResult.country, PlaceDetailsResult.location

### How Your Data Flows Through Our Service

The following summarizes how personal data moves through our application:

**Data Collection:**

- AI-powered feature usage → user prompts, conversation history, generated content (via @ai-sdk/anthropic)
- AI-powered feature usage → user prompts, conversation history, generated content (via @ai-sdk/google)
- AI-powered feature usage → user prompts, conversation history, generated content (via @ai-sdk/openai)
- AI-powered feature usage → user prompts, conversation history, generated content (via @vercel/ai)
- Email subscription/contact forms → email addresses, email content (via nodemailer)
- AI-powered feature usage → user prompts, conversation history, generated content (via openai)
- User registration/login → email, name, OAuth tokens, session data (via passport)
- User registration/login → email, name, Google profile data, OAuth tokens (via passport-google-oauth20)
- User registration/login → email, name, Microsoft profile data, OAuth tokens (via passport-microsoft)
- Payment checkout → payment information, billing address, email, transaction history (via stripe)

**Data Storage:**

- @aws-sdk/client-s3 (File Storage): uploaded files, file metadata
- drizzle (Database): user data as defined in schema
- ioredis (Database): cached data, session data
- redis (Database): cached data, session data
- Database schema (Personal Identity Data): passport-google-oauth20, passport-microsoft, passport, ApiKeyEntity.name, BillingMeterEntity.displayName, BillingProductEntity.name, WorkspaceSSOIdentityProviderEntity.name, WorkspaceEntity.displayName, labels.name, ApiKey.name, ApplicationRegistration.name, UserWorkspace.locale, FullName.firstName, FullName.lastName, WorkspaceMember.name, WorkspaceMember.locale, Agent.name, ApiKeyForRole.name, LogicFunction.name, Field.name, Index.name, Application.name, ViewFieldGroup.name, View.name, Workspace.displayName, User.firstName, User.lastName, User.locale, PageLayout.name, BillingProduct.name, BillingLicensedProduct.name, BillingMeteredProduct.name, SSOConnection.name, AvailableWorkspace.displayName, DeletedWorkspaceMember.name, SSOIdentityProvider.name, PublicWorkspaceData.displayName, PublicApplicationRegistration.name, EditSso.name, WorkspaceNameAndId.displayName, FindAvailableSSOIDP.name, SetupSso.name, NavigationMenuItem.name, ToolIndexEntry.name, Skill.name, FrontComponent.name, ConfigVariable.name, ConfigVariablesGroupData.name, QueueJob.name, UserInfo.firstName, UserInfo.lastName, WorkspaceInfo.name, MarketplaceAppField.name, MarketplaceAppLogicFunction.name, MarketplaceAppFrontComponent.name, MarketplaceApp.name, ConnectionParametersOutput.username, CreatePageLayoutInput.name, UpdatePageLayoutInput.name, UpdatePageLayoutWithTabsInput.name, CreateLogicFunctionFromSourceInput.name, UpdateLogicFunctionFromSourceInputUpdates.name, CreateViewInput.name, UpdateViewInput.name, UpdateViewFieldGroupInputUpdates.name, CreateViewFieldGroupInput.name, UpsertFieldsWidgetGroupInput.name, CreateFrontComponentInput.name, UpdateFrontComponentInputUpdates.name, CreateAgentInput.name, UpdateAgentInput.name, CreateNavigationMenuItemInput.name, UpdateNavigationMenuItemInput.name, CreateApiKeyInput.name, UpdateApiKeyInput.name, CreateFieldInput.name, UpdateFieldInput.name, ActivateWorkspaceInput.displayName, UpdateWorkspaceInput.displayName, CreateApplicationRegistrationInput.name, UpdateApplicationRegistrationPayload.name, SetupOIDCSsoInput.name, SetupSAMLSsoInput.name, CreateSkillInput.name, UpdateSkillInput.name, ConnectionParameters.username, LogicFunctionLogsInput.name
- Database schema (Contact Information): AppTokenEntity.email, User.email, WorkspaceInvitation.email, ValidatePasswordResetToken.email, UserInfo.email, CreateApprovedAccessDomainInput.email
- Database schema (Authentication Data): PostgresCredentialsEntity.passwordHash, AuthProviders.password, AuthBypassProviders.password, ConnectionParametersOutput.password, PostgresCredentials.password, ConnectionParameters.password
- Database schema (Location Data): WorkspaceMember.timeZone, AggregateChartConfiguration.timezone, PieChartConfiguration.timezone, LineChartConfiguration.timezone, GaugeChartConfiguration.timezone, BarChartConfiguration.timezone, PlaceDetailsResult.city, PlaceDetailsResult.country, PlaceDetailsResult.location

**Third-Party Data Sharing:**

- @ai-sdk/anthropic: user prompts, conversation history, generated content
- @ai-sdk/google: user prompts, conversation history, generated content
- @ai-sdk/openai: user prompts, conversation history, generated content
- @sentry/node: error data, stack traces, user context, device information, IP address, performance profiles
- @vercel/ai: user prompts, conversation history, generated content
- googleapis: user data via Google APIs, calendar data, email data, profile information
- nodemailer: email addresses, email content
- openai: user prompts, conversation history, generated content
- stripe: payment information, billing address, email, transaction history


### Data Sensitivity Classification

We classify the personal data we collect according to GDPR sensitivity levels to ensure appropriate protection:

| Sensitivity Level | Fields Detected | Protection Standard |
|-------------------|-----------------|--------------------|
| Special Category (Art. 9) | 2 | Explicit consent, DPIA, encryption, DPO oversight |
| High | 100 | Encryption, tokenization, access control, audit logging |
| Medium | 27 | Encryption in transit, consent, user access rights |
| Low | 52 | Encryption in transit, anonymization where possible |

For a detailed breakdown of each data field and its classification, see our Data Classification Report.


## 4. Third-Party Services and Data Recipients

Pursuant to GDPR Art. 13(1)(e), we disclose your personal data to the following categories of recipients and third-party data processors:

- **@ai-sdk/anthropic** (AI Service): Processes user prompts, conversation history, generated content
- **@ai-sdk/google** (AI Service): Processes user prompts, conversation history, generated content
- **@ai-sdk/openai** (AI Service): Processes user prompts, conversation history, generated content
- **@aws-sdk/client-s3** (File Storage): Processes uploaded files, file metadata
- **@sentry/node** (Error Monitoring): Processes error data, stack traces, user context, device information, IP address, performance profiles
- **@vercel/ai** (AI Service): Processes user prompts, conversation history, generated content
- **googleapis** (Other): Processes user data via Google APIs, calendar data, email data, profile information
- **nodemailer** (Email Service): Processes email addresses, email content
- **openai** (AI Service): Processes user prompts, conversation history, generated content
- **passport** (Authentication): Processes email, name, OAuth tokens, session data
- **passport-google-oauth20** (Authentication): Processes email, name, Google profile data, OAuth tokens
- **passport-microsoft** (Authentication): Processes email, name, Microsoft profile data, OAuth tokens
- **stripe** (Payment Processing): Processes payment information, billing address, email, transaction history

Each third-party service provider processes your data under its own privacy policy and data processing agreement. We require all processors to implement appropriate technical and organisational measures in accordance with GDPR Art. 28.


## 5. Legal Basis for Processing (GDPR Art. 6)

Under the General Data Protection Regulation, we process your personal data based on the following legal grounds:

| Purpose | Legal Basis | GDPR Article | Details |
|---------|------------|--------------|--------|
| AI Service | Consent | Art. 6(1)(a) | Only with your opt-in consent; or Contract (Art. 6(1)(b)) if integral to the service |
| File Storage | Contract | Art. 6(1)(b) | Necessary to provide file storage as part of the service |
| Error Monitoring | Legitimate Interest | Art. 6(1)(f) | Protecting our service, detecting errors, and ensuring security |
| Database | Contract | Art. 6(1)(b) | Necessary to store and manage your data as part of the service |
| Other | Legitimate Interest | Art. 6(1)(f) | Supporting our service operations |
| Email Service | Legitimate Interest | Art. 6(1)(f) | Communicating service-related information to you |
| Authentication | Contract | Art. 6(1)(b) | Necessary to fulfill our agreement with you |
| Payment Processing | Contract | Art. 6(1)(b) | Necessary to fulfill our agreement with you |

### Legitimate Interests Pursued

Where we rely on legitimate interest as a legal basis, we have conducted a balancing test to ensure our interests do not override your fundamental rights and freedoms. Our legitimate interests include:

- **Error Monitoring:** Protecting our service, detecting errors, and ensuring security
- **Other:** Supporting our service operations
- **Email Service:** Communicating service-related information to you


## 6. Artificial Intelligence

This application uses AI-powered features provided by third-party services:

- **@ai-sdk/anthropic**: user prompts, conversation history, generated content
- **@ai-sdk/google**: user prompts, conversation history, generated content
- **@ai-sdk/openai**: user prompts, conversation history, generated content
- **@vercel/ai**: user prompts, conversation history, generated content
- **openai**: user prompts, conversation history, generated content

### How We Use AI

- User inputs may be sent to AI service providers for processing
- AI-generated outputs are returned to the user
- We do not use your data to train AI models
- AI service providers may retain data according to their own policies

> **Note:** Review the AI Disclosure document for detailed information about our AI usage as required by the EU AI Act.


## 7. International Data Transfers

Pursuant to GDPR Art. 13(1)(f), we inform you that your personal data may be transferred to and processed in countries outside the European Economic Area (EEA) that may not provide an equivalent level of data protection. The following services involve such transfers:

- **@aws-sdk/client-s3** (File Storage)
- **@sentry/node** (Error Monitoring)
- **openai** (AI Service)
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
| AI Service | AI interaction data retained for up to 90 days |
| File Storage | Uploaded files retained until you delete them or your account |
| Error Monitoring | Error and performance data retained for up to 90 days |
| Database | User data retained until you delete your account |
| Other | Data retained as long as necessary for the service |
| Email Service | Email communication records retained for up to 3 years |
| Authentication | Account data retained until you delete your account |
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

## 10. Right to Withdraw Consent

Pursuant to GDPR Art. 7(3), where we process your personal data based on your consent (Art. 6(1)(a) or Art. 9(2)(a)), you have the right to withdraw that consent at any time. The withdrawal of consent shall not affect the lawfulness of processing based on consent before its withdrawal.

You can withdraw your consent by:

- Adjusting your preferences in your account settings
- Contacting us at [your-email@example.com]

Upon withdrawal, we will cease the relevant processing activities, though some data already collected may be retained where we have another lawful basis for doing so.


## 11. Automated Decision-Making (Art. 22)

Pursuant to GDPR Art. 13(2)(f), this application uses automated processing, including AI-powered features, as described in the Artificial Intelligence section above.

### Meaningful Information About the Logic Involved

Our automated processing uses AI models provided by third-party services (@ai-sdk/anthropic, @ai-sdk/google, @ai-sdk/openai, @vercel/ai, openai). These models analyse the inputs you provide and generate outputs based on statistical patterns learned during training. The processing involves:

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

- We use error tracking and performance monitoring (@sentry/node) to detect anomalies and potential security incidents
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
