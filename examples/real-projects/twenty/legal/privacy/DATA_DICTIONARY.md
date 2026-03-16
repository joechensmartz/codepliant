# Data Dictionary

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** twenty

**Company:** [Your Company Name]

## Related Documents

- Data Flow Map (`DATA_FLOW_MAP.md`)
- Data Retention Policy (`DATA_RETENTION_POLICY.md`)
- Data Classification Report (`DATA_CLASSIFICATION.md`)

---

## 1. Purpose

This document catalogs every data field detected across the **twenty** application. It serves as the authoritative reference for data mapping required by GDPR Article 30 (Records of Processing Activities), SOC 2 (CC6.1), and internal data governance policies.

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
| password_hash | passport | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| password_hash | passport-google-oauth20 | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| password_hash | passport-microsoft | Authentication | Critical | Until account deletion; hashed at rest | User authentication |
| payment_info | stripe | Financial — PCI | Critical | Do not store post-authorization; tokenize | Payment processing |
| billing address | stripe | Location | High | Until account deletion | Billing, shipping, localization |
| billing_address | stripe | Location | High | 7 years (tax/legal) | Billing |
| customer_email | stripe | Contact | High | Until account deletion + 30 days | Transaction receipts |
| email | passport | Contact | High | Until account deletion + 30 days | Account identification |
| email | passport-google-oauth20 | Contact | High | Until account deletion + 30 days | Account identification |
| email | passport-microsoft | Contact | High | Until account deletion + 30 days | Account identification |
| email | stripe | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email addresses | nodemailer | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email content | nodemailer | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email data | googleapis | Contact | High | Until account deletion + 30 days | Account identification, communication |
| email_address | nodemailer | Contact | High | Until unsubscribe or account deletion | Email delivery |
| IP address | @sentry/node | Location | High | Until account deletion | Billing, shipping, localization |
| name | passport | Personal Identity | High | Until account deletion + 30 days | User identification |
| name | passport-google-oauth20 | Personal Identity | High | Until account deletion + 30 days | User identification |
| name | passport-microsoft | Personal Identity | High | Until account deletion + 30 days | User identification |
| transaction_history | stripe | Financial | High | 7 years (tax/legal) | Order records, refunds |
| conversation history | @ai-sdk/anthropic | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| conversation history | @ai-sdk/google | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| conversation history | @ai-sdk/openai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| conversation history | @vercel/ai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| conversation history | openai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| conversation_history | @ai-sdk/anthropic | AI Interaction | Medium | 30 days (logs); per vendor policy | Context continuity |
| conversation_history | @ai-sdk/google | AI Interaction | Medium | 30 days (logs); per vendor policy | Context continuity |
| conversation_history | @ai-sdk/openai | AI Interaction | Medium | 30 days (logs); per vendor policy | Context continuity |
| conversation_history | @vercel/ai | AI Interaction | Medium | 30 days (logs); per vendor policy | Context continuity |
| conversation_history | openai | AI Interaction | Medium | 30 days (logs); per vendor policy | Context continuity |
| email_content | nodemailer | Communication | Medium | 90 days (delivery logs) | Email delivery |
| ip_address | @sentry/node | Technical | Medium | 30 days | Error context |
| Location Data | WorkspaceMember.timeZone | Location | Medium | 90 days | Localization, analytics |
| Location Data | AggregateChartConfiguration.timezone | Location | Medium | 90 days | Localization, analytics |
| Location Data | PieChartConfiguration.timezone | Location | Medium | 90 days | Localization, analytics |
| Location Data | LineChartConfiguration.timezone | Location | Medium | 90 days | Localization, analytics |
| Location Data | GaugeChartConfiguration.timezone | Location | Medium | 90 days | Localization, analytics |
| Location Data | BarChartConfiguration.timezone | Location | Medium | 90 days | Localization, analytics |
| Location Data | PlaceDetailsResult.city | Location | Medium | 90 days | Localization, analytics |
| Location Data | PlaceDetailsResult.country | Location | Medium | 90 days | Localization, analytics |
| Location Data | PlaceDetailsResult.location | Location | Medium | 90 days | Localization, analytics |
| OAuth tokens | passport | Session | Medium | Until session expiry | Session management |
| OAuth tokens | passport-google-oauth20 | Session | Medium | Until session expiry | Session management |
| OAuth tokens | passport-microsoft | Session | Medium | Until session expiry | Session management |
| oauth_token | passport | Authentication | Medium | Until session expiry or revocation | Third-party authentication |
| oauth_token | passport-google-oauth20 | Authentication | Medium | Until session expiry or revocation | Third-party authentication |
| oauth_token | passport-microsoft | Authentication | Medium | Until session expiry or revocation | Third-party authentication |
| session data | ioredis | Session | Medium | Until session expiry | Session management |
| session data | passport | Session | Medium | Until session expiry | Session management |
| session data | redis | Session | Medium | Until session expiry | Session management |
| session_token | passport | Session | Medium | Until session expiry | Session management |
| session_token | passport-google-oauth20 | Session | Medium | Until session expiry | Session management |
| session_token | passport-microsoft | Session | Medium | Until session expiry | Session management |
| uploaded_files | @aws-sdk/client-s3 | User Content | Medium | Until user-initiated deletion | File storage |
| user prompts | @ai-sdk/anthropic | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| user prompts | @ai-sdk/google | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| user prompts | @ai-sdk/openai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| user prompts | @vercel/ai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| user prompts | openai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| user_context | @sentry/node | Technical | Medium | 30 days | Error context |
| user_data | drizzle | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | ioredis | Application Data | Medium | Per data retention policy | Application functionality |
| user_data | redis | Application Data | Medium | Per data retention policy | Application functionality |
| user_prompts | @ai-sdk/anthropic | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| user_prompts | @ai-sdk/google | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| user_prompts | @ai-sdk/openai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| user_prompts | @vercel/ai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| user_prompts | openai | AI Interaction | Medium | 30 days (logs); per vendor policy | AI feature delivery |
| AI Interaction Data | openai | Application Data | Low | Per data retention policy | Application functionality |
| AI Interaction Data | @vercel/ai | Application Data | Low | Per data retention policy | Application functionality |
| AI Interaction Data | @ai-sdk/openai | Application Data | Low | Per data retention policy | Application functionality |
| AI Interaction Data | @ai-sdk/anthropic | Application Data | Low | Per data retention policy | Application functionality |
| AI Interaction Data | @ai-sdk/google | Application Data | Low | Per data retention policy | Application functionality |
| Authentication Data | PostgresCredentialsEntity.passwordHash | Application Data | Low | Per data retention policy | Application functionality |
| Authentication Data | AuthProviders.password | Application Data | Low | Per data retention policy | Application functionality |
| Authentication Data | AuthBypassProviders.password | Application Data | Low | Per data retention policy | Application functionality |
| Authentication Data | ConnectionParametersOutput.password | Application Data | Low | Per data retention policy | Application functionality |
| Authentication Data | PostgresCredentials.password | Application Data | Low | Per data retention policy | Application functionality |
| Authentication Data | ConnectionParameters.password | Application Data | Low | Per data retention policy | Application functionality |
| cached data | ioredis | Application Data | Low | Per data retention policy | Application functionality |
| cached data | redis | Application Data | Low | Per data retention policy | Application functionality |
| calendar data | googleapis | Application Data | Low | Per data retention policy | Application functionality |
| Communication Data | nodemailer | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | AppTokenEntity.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | User.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | WorkspaceInvitation.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | ValidatePasswordResetToken.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | UserInfo.email | Application Data | Low | Per data retention policy | Application functionality |
| Contact Information | CreateApprovedAccessDomainInput.email | Application Data | Low | Per data retention policy | Application functionality |
| device information | @sentry/node | Application Data | Low | Per data retention policy | Application functionality |
| error data | @sentry/node | Application Data | Low | Per data retention policy | Application functionality |
| error_data | @sentry/node | Technical | Low | 30 days | Error tracking |
| file metadata | @aws-sdk/client-s3 | Application Data | Low | Per data retention policy | Application functionality |
| file_metadata | @aws-sdk/client-s3 | Metadata | Low | Until file deletion | File management |
| Financial Data | stripe | Application Data | Low | Per data retention policy | Application functionality |
| generated content | @ai-sdk/anthropic | Application Data | Low | Per data retention policy | Application functionality |
| generated content | @ai-sdk/google | Application Data | Low | Per data retention policy | Application functionality |
| generated content | @ai-sdk/openai | Application Data | Low | Per data retention policy | Application functionality |
| generated content | @vercel/ai | Application Data | Low | Per data retention policy | Application functionality |
| generated content | openai | Application Data | Low | Per data retention policy | Application functionality |
| generated_content | @ai-sdk/anthropic | AI Output | Low | Per user deletion request | AI feature delivery |
| generated_content | @ai-sdk/google | AI Output | Low | Per user deletion request | AI feature delivery |
| generated_content | @ai-sdk/openai | AI Output | Low | Per user deletion request | AI feature delivery |
| generated_content | @vercel/ai | AI Output | Low | Per user deletion request | AI feature delivery |
| generated_content | openai | AI Output | Low | Per user deletion request | AI feature delivery |
| Google profile data | passport-google-oauth20 | Application Data | Low | Per data retention policy | Application functionality |
| Microsoft profile data | passport-microsoft | Application Data | Low | Per data retention policy | Application functionality |
| payment information | stripe | Application Data | Low | Per data retention policy | Application functionality |
| performance profiles | @sentry/node | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | passport-google-oauth20 | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | passport-microsoft | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | passport | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | ApiKeyEntity.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | BillingMeterEntity.displayName | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | BillingProductEntity.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | WorkspaceSSOIdentityProviderEntity.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | WorkspaceEntity.displayName | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | labels.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | ApiKey.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | ApplicationRegistration.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | UserWorkspace.locale | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | FullName.firstName | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | FullName.lastName | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | WorkspaceMember.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | WorkspaceMember.locale | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | Agent.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | ApiKeyForRole.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | LogicFunction.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | Field.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | Index.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | Application.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | ViewFieldGroup.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | View.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | Workspace.displayName | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | User.firstName | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | User.lastName | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | User.locale | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | PageLayout.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | BillingProduct.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | BillingLicensedProduct.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | BillingMeteredProduct.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | SSOConnection.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | AvailableWorkspace.displayName | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | DeletedWorkspaceMember.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | SSOIdentityProvider.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | PublicWorkspaceData.displayName | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | PublicApplicationRegistration.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | EditSso.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | WorkspaceNameAndId.displayName | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | FindAvailableSSOIDP.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | SetupSso.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | NavigationMenuItem.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | ToolIndexEntry.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | Skill.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | FrontComponent.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | ConfigVariable.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | ConfigVariablesGroupData.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | QueueJob.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | UserInfo.firstName | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | UserInfo.lastName | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | WorkspaceInfo.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | MarketplaceAppField.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | MarketplaceAppLogicFunction.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | MarketplaceAppFrontComponent.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | MarketplaceApp.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | ConnectionParametersOutput.username | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | CreatePageLayoutInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | UpdatePageLayoutInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | UpdatePageLayoutWithTabsInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | CreateLogicFunctionFromSourceInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | UpdateLogicFunctionFromSourceInputUpdates.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | CreateViewInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | UpdateViewInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | UpdateViewFieldGroupInputUpdates.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | CreateViewFieldGroupInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | UpsertFieldsWidgetGroupInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | CreateFrontComponentInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | UpdateFrontComponentInputUpdates.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | CreateAgentInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | UpdateAgentInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | CreateNavigationMenuItemInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | UpdateNavigationMenuItemInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | CreateApiKeyInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | UpdateApiKeyInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | CreateFieldInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | UpdateFieldInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | ActivateWorkspaceInput.displayName | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | UpdateWorkspaceInput.displayName | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | CreateApplicationRegistrationInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | UpdateApplicationRegistrationPayload.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | SetupOIDCSsoInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | SetupSAMLSsoInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | CreateSkillInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | UpdateSkillInput.name | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | ConnectionParameters.username | Application Data | Low | Per data retention policy | Application functionality |
| Personal Identity Data | LogicFunctionLogsInput.name | Application Data | Low | Per data retention policy | Application functionality |
| profile information | googleapis | Application Data | Low | Per data retention policy | Application functionality |
| stack traces | @sentry/node | Application Data | Low | Per data retention policy | Application functionality |
| stack_traces | @sentry/node | Technical | Low | 30 days | Debugging |
| Stored User Data | ioredis | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | redis | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | drizzle | Application Data | Low | Per data retention policy | Application functionality |
| Stored User Data | Redis (Cache) | Application Data | Low | Per data retention policy | Application functionality |
| Technical & Diagnostic Data | @sentry/node | Application Data | Low | Per data retention policy | Application functionality |
| transaction history | stripe | Application Data | Low | Per data retention policy | Application functionality |
| uploaded files | @aws-sdk/client-s3 | Application Data | Low | Per data retention policy | Application functionality |
| user context | @sentry/node | Application Data | Low | Per data retention policy | Application functionality |
| user data as defined in schema | drizzle | Application Data | Low | Per data retention policy | Application functionality |
| user data via Google APIs | googleapis | Application Data | Low | Per data retention policy | Application functionality |
| User-Uploaded Content | @aws-sdk/client-s3 | Application Data | Low | Per data retention policy | Application functionality |

---

## 4. Sensitivity Summary

| Level | Count | Description |
|-------|-------|-------------|
| Critical | 4 | Credentials, government IDs, raw payment data — requires encryption at rest and strict access control |
| High | 16 | PII (names, emails, addresses) — requires encryption and consent |
| Medium | 48 | Behavioral data, session data, IP addresses — requires privacy notice |
| Low | 142 | Preferences, metadata, operational data — standard handling |

**Total fields cataloged:** 210

---

## 5. Cross-References

- **Database schema** — Fields detected from Prisma/ORM model definitions
- **Ai services** — @ai-sdk/anthropic, @ai-sdk/google, @ai-sdk/openai, @vercel/ai, openai
- **Storage services** — @aws-sdk/client-s3
- **Monitoring services** — @sentry/node
- **Database services** — drizzle, ioredis, redis
- **Other services** — googleapis
- **Email services** — nodemailer
- **Auth services** — passport, passport-google-oauth20, passport-microsoft
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