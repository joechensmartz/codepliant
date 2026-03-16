# Environment Variable Audit

> Generated on 2026-03-16 — 110 variable(s) detected.
> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16

## Security Recommendations

- **[WARNING]** No .env.example file found. Create one to document required environment variables for new contributors.

## Environment Variables

### API Key / Secret

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `AI_PROVIDER_API_KEY` | packages/twenty-apps/community/meeting-transcript/serverlessFunctions/process-transcript/src/index.ts | No |
| `API_KEY` | packages/twenty-apps/community/rollup-engine/serverlessFunctions/calculaterollups/src/index.ts | No |
| `APOLLO_ACCESS_TOKEN` | packages/twenty-apps/community/apollo-enrich/src/logic-functions/get-oauth-application-variables.ts, packages/twenty-apps/community/apollo-enrich/src/logic-functions/on-company-updated.ts | No |
| `APOLLO_CLIENT_SECRET` | packages/twenty-apps/community/apollo-enrich/src/logic-functions/get-authentication-token-pairs.ts | No |
| `APOLLO_REFRESH_TOKEN` | packages/twenty-apps/community/apollo-enrich/src/logic-functions/get-oauth-application-variables.ts | No |
| `CLOUDFLARE_API_KEY` | packages/twenty-server/src/engine/core-modules/feature-flag/constants/public-feature-flag.const.ts | No |
| `CROWDIN_PERSONAL_TOKEN` | packages/twenty-utils/fix-crowdin-translations.ts, packages/twenty-utils/fix-docs-tags.ts, packages/twenty-utils/fix-qa-issues.ts, packages/twenty-utils/translation-qa-report.ts | No |
| `DEFAULT_PASSWORD` | packages/twenty-e2e-testing/tests/login.setup.ts, packages/twenty-e2e-testing/tests/authentication/return-to-path.spec.ts, packages/twenty-e2e-testing/tests/authentication/signup_invite_email.spec.ts | No |
| `ENTERPRISE_JWT_PRIVATE_KEY` | packages/twenty-website/src/shared/enterprise/enterprise-jwt.ts | No |
| `ENTERPRISE_JWT_PUBLIC_KEY` | packages/twenty-website/src/shared/enterprise/enterprise-jwt.ts | No |
| `ENTERPRISE_VALIDITY_TOKEN_DURATION_DAYS` | packages/twenty-website/src/shared/enterprise/enterprise-jwt.ts | No |
| `FB_GRAPH_TOKEN` | packages/twenty-apps/community/activity-summary/serverlessFunctions/summarise-and-send/src/index.ts, packages/twenty-apps/community/activity-summary/serverlessFunctions/summarise-and-send/src/senders.ts | No |
| `FIREFLIES_API_KEY` | packages/twenty-apps/community/fireflies/scripts/debug-meeting.ts, packages/twenty-apps/community/fireflies/scripts/fetch-all-meetings.ts, packages/twenty-apps/community/fireflies/scripts/ingest-meeting.ts, packages/twenty-apps/community/fireflies/scripts/test-webhook.ts, packages/twenty-apps/community/fireflies/src/webhook-handler.ts | No |
| `FIREFLIES_WEBHOOK_SECRET` | packages/twenty-apps/community/fireflies/scripts/ingest-meeting.ts, packages/twenty-apps/community/fireflies/scripts/test-webhook.ts, packages/twenty-apps/community/fireflies/src/webhook-handler.ts, packages/twenty-apps/community/fireflies/src/__tests__/fireflies-webhook.spec.ts, packages/twenty-apps/community/fireflies/src/__tests__/setup.ts | No |
| `GITHUB_TOKEN` | packages/twenty-website/src/github/execute-partial-sync.ts, packages/twenty-website/src/github/fetch-and-save-github-data.ts | No |
| `KEY` | packages/twenty-front/src/locales/generated/af-ZA.ts, packages/twenty-front/src/locales/generated/ar-SA.ts, packages/twenty-front/src/locales/generated/ca-ES.ts, packages/twenty-front/src/locales/generated/cs-CZ.ts, packages/twenty-front/src/locales/generated/da-DK.ts, packages/twenty-front/src/locales/generated/de-DE.ts, packages/twenty-front/src/locales/generated/el-GR.ts, packages/twenty-front/src/locales/generated/en.ts, packages/twenty-front/src/locales/generated/es-ES.ts, packages/twenty-front/src/locales/generated/fi-FI.ts, packages/twenty-front/src/locales/generated/fr-FR.ts, packages/twenty-front/src/locales/generated/he-IL.ts, packages/twenty-front/src/locales/generated/hu-HU.ts, packages/twenty-front/src/locales/generated/it-IT.ts, packages/twenty-front/src/locales/generated/ja-JP.ts, packages/twenty-front/src/locales/generated/ko-KR.ts, packages/twenty-front/src/locales/generated/nl-NL.ts, packages/twenty-front/src/locales/generated/no-NO.ts, packages/twenty-front/src/locales/generated/pl-PL.ts, packages/twenty-front/src/locales/generated/pt-BR.ts, packages/twenty-front/src/locales/generated/pt-PT.ts, packages/twenty-front/src/locales/generated/ro-RO.ts, packages/twenty-front/src/locales/generated/ru-RU.ts, packages/twenty-front/src/locales/generated/sr-Cyrl.ts, packages/twenty-front/src/locales/generated/sv-SE.ts, packages/twenty-front/src/locales/generated/tr-TR.ts, packages/twenty-front/src/locales/generated/uk-UA.ts, packages/twenty-front/src/locales/generated/vi-VN.ts, packages/twenty-front/src/locales/generated/zh-CN.ts, packages/twenty-front/src/locales/generated/zh-TW.ts, packages/twenty-front/src/modules/settings/logic-functions/components/SettingsLogicFunctionTabEnvironmentVariablesSection.tsx | No |
| `MAILCHIMP_API_KEY` | packages/twenty-apps/community/mailchimp-synchronizer/src/index.ts | No |
| `OPENAI_API_KEY` | packages/twenty-apps/community/ai-meeting-transcript/serverlessFunctions/ai-meeting-transcriptor/src/index.ts | No |
| `OPENROUTER_KEY` | packages/twenty-companion/src/main.js | No |
| `RECALLAI_API_KEY` | packages/twenty-companion/src/server.js | No |
| `SSL_KEY_PATH` | packages/twenty-server/src/main.ts | No |
| `STRIPE_API_KEY` | packages/twenty-apps/community/stripe-synchronizer/src/index.ts | No |
| `STRIPE_SECRET_KEY` | packages/twenty-website/src/shared/enterprise/stripe-client.ts | No |
| `TWENTY_API_KEY` | packages/create-twenty-app/src/utils/test-template.ts, packages/create-twenty-app/src/utils/__tests__/test-template.spec.ts, packages/twenty-apps/community/activity-summary/serverlessFunctions/summarise-and-send/src/utils.ts, packages/twenty-apps/community/ai-meeting-transcript/serverlessFunctions/ai-meeting-transcriptor/src/index.ts, packages/twenty-apps/community/fireflies/scripts/add-meeting-fields.ts, packages/twenty-apps/community/fireflies/scripts/delete-meeting.ts, packages/twenty-apps/community/fireflies/scripts/fetch-all-meetings.ts, packages/twenty-apps/community/fireflies/scripts/ingest-meeting.ts, packages/twenty-apps/community/fireflies/scripts/test-webhook.ts, packages/twenty-apps/community/fireflies/src/webhook-handler.ts, packages/twenty-apps/community/fireflies/src/__tests__/setup.ts, packages/twenty-apps/community/last-email-interaction/src/index.ts, packages/twenty-apps/community/linkedin-browser-extension/application/serverlessFunctions/create-company/src/index.ts, packages/twenty-apps/community/linkedin-browser-extension/application/serverlessFunctions/create-person/src/index.ts, packages/twenty-apps/community/meeting-transcript/serverlessFunctions/process-transcript/src/index.ts, packages/twenty-apps/community/rollup-engine/scripts/run-rollup-smoke.ts, packages/twenty-apps/community/rollup-engine/scripts/setup-company-rollup-fields.mjs, packages/twenty-apps/community/rollup-engine/serverlessFunctions/calculaterollups/src/index.ts, packages/twenty-apps/community/stripe-synchronizer/src/index.ts, packages/twenty-apps/community/webmetic/serverlessFunctions/sync-visitor-data/src/index.ts, packages/twenty-apps/hello-world/src/__tests__/setup-test.ts, packages/twenty-apps/internal/call-recording/src/front-components/summarize-person-recordings.tsx, packages/twenty-apps/internal/call-recording/src/utils/summarize-transcript.ts, packages/twenty-companion/src/twenty-client.js, packages/twenty-sdk/scripts/generate-metadata-client.ts, packages/twenty-sdk/src/cli/__tests__/constants/setupTest.ts, packages/twenty-sdk/src/cli/utilities/client/__tests__/clientServiceGeneratedClientAuth.test.ts | No |
| `TWENTY_API_TOKEN` | packages/twenty-apps/community/rollup-engine/serverlessFunctions/calculaterollups/src/index.ts, packages/twenty-server/src/engine/core-modules/tool/tools/code-interpreter-tool/twenty-mcp-helper.const.ts | No |
| `TWENTY_APP_ACCESS_TOKEN` | packages/twenty-apps/internal/call-recording/src/front-components/summarize-person-recordings.tsx, packages/twenty-apps/internal/call-recording/src/utils/summarize-transcript.ts, packages/twenty-sdk/src/cli/utilities/client/__tests__/clientServiceGeneratedClientAuth.test.ts | No |
| `WEBHOOK_SECRET_TOKEN` | packages/twenty-apps/community/meeting-transcript/serverlessFunctions/process-transcript/src/index.ts | No |
| `WEBMETIC_API_KEY` | packages/twenty-apps/community/webmetic/serverlessFunctions/sync-visitor-data/src/index.ts | No |
| `WXT_TWENTY_API_KEY` | packages/twenty-apps/community/linkedin-browser-extension/browser-extension/src/entrypoints/background/index.ts | No |

### Database

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `DATABASE_PG_URL` | packages/twenty-website/src/database/database.ts, packages/twenty-website/src/database/drizzle-posgres.config.ts | No |
| `PG_DATABASE_PRIMARY_TIMEOUT_MS` | packages/twenty-server/src/database/typeorm/core/core.datasource.ts | No |
| `PG_DATABASE_URL` | packages/twenty-server/src/database/typeorm/core/core.datasource.ts, packages/twenty-server/src/database/typeorm/raw/raw.datasource.ts | No |

### Service Config

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `AI_PROVIDER_API_BASE_URL` | packages/twenty-apps/community/meeting-transcript/serverlessFunctions/process-transcript/src/index.ts | No |
| `APOLLO_OAUTH_URL` | packages/twenty-apps/community/apollo-enrich/src/logic-functions/get-oauth-application-variables.ts | No |
| `APOLLO_REGISTERED_URL` | packages/twenty-apps/community/apollo-enrich/src/logic-functions/get-oauth-application-variables.ts | No |
| `BACKEND_BASE_URL` | packages/twenty-e2e-testing/lib/requests/backend.ts | No |
| `CLICKHOUSE_URL` | packages/twenty-server/jest-integration.config.ts, packages/twenty-server/src/database/clickHouse/migrations/run-migrations.ts, packages/twenty-server/src/database/clickHouse/seeds/run-seeds.ts, packages/twenty-server/test/integration/audit/suites/clickHouse-workspace-event-registration.integration-spec.ts, packages/twenty-server/test/integration/graphql/suites/event-logs/event-logs.integration-spec.ts | No |
| `DISCORD_WEBHOOK_URL` | packages/twenty-apps/community/activity-summary/serverlessFunctions/summarise-and-send/src/index.ts, packages/twenty-apps/community/activity-summary/serverlessFunctions/summarise-and-send/src/senders.ts | No |
| `FRONTEND_BASE_URL` | packages/twenty-e2e-testing/playwright.config.ts | No |
| `FRONTEND_URL` | packages/twenty-sdk/src/cli/commands/app/app-dev.ts | No |
| `OTLP_COLLECTOR_METRICS_ENDPOINT_URL` | packages/twenty-server/src/instrument.ts | No |
| `RECALLAI_API_URL` | packages/twenty-companion/src/main.js, packages/twenty-companion/src/server.js | No |
| `SERVER_BASE_URL` | packages/twenty-zapier/src/utils/requestDb.ts | No |
| `SERVER_URL` | packages/twenty-apps/community/fireflies/scripts/add-meeting-fields.ts, packages/twenty-apps/community/fireflies/scripts/delete-meeting.ts, packages/twenty-apps/community/fireflies/scripts/test-webhook.ts, packages/twenty-apps/community/fireflies/src/utils.ts, packages/twenty-apps/community/fireflies/src/__tests__/setup.ts, packages/twenty-server/src/engine/api/common/common-result-getters/handlers/field-handlers/__tests__/rich-text-field-query-result-getter.handler.spec.ts, packages/twenty-server/src/engine/api/graphql/workspace-query-runner/factories/query-result-getters/handlers/attachment-query-result-getter.handler.ts, packages/twenty-server/src/utils/generate-front-config.ts | No |
| `SLACK_HOOK_URL` | packages/twenty-apps/community/activity-summary/serverlessFunctions/summarise-and-send/src/index.ts, packages/twenty-apps/community/activity-summary/serverlessFunctions/summarise-and-send/src/senders.ts | No |
| `STORYBOOK_URL` | packages/twenty-front/vitest.config.ts | No |
| `TWENTY_API_BASE_URL` | packages/twenty-apps/community/rollup-engine/scripts/run-rollup-smoke.ts, packages/twenty-apps/community/rollup-engine/scripts/setup-company-rollup-fields.mjs, packages/twenty-apps/community/rollup-engine/serverlessFunctions/calculaterollups/src/index.ts | No |
| `TWENTY_API_URL` | packages/create-twenty-app/src/utils/test-template.ts, packages/create-twenty-app/src/utils/__tests__/test-template.spec.ts, packages/twenty-apps/community/ai-meeting-transcript/serverlessFunctions/ai-meeting-transcriptor/src/index.ts, packages/twenty-apps/community/apollo-enrich/src/front-components/apollo-oauth-cta.tsx, packages/twenty-apps/community/last-email-interaction/src/index.ts, packages/twenty-apps/community/linkedin-browser-extension/application/serverlessFunctions/create-company/src/index.ts, packages/twenty-apps/community/linkedin-browser-extension/application/serverlessFunctions/create-person/src/index.ts, packages/twenty-apps/community/meeting-transcript/serverlessFunctions/process-transcript/src/index.ts, packages/twenty-apps/community/rollup-engine/serverlessFunctions/calculaterollups/src/index.ts, packages/twenty-apps/community/stripe-synchronizer/src/index.ts, packages/twenty-apps/community/webmetic/serverlessFunctions/sync-visitor-data/src/index.ts, packages/twenty-apps/hello-world/src/__tests__/setup-test.ts, packages/twenty-apps/internal/call-recording/src/front-components/summarize-person-recordings.tsx, packages/twenty-apps/internal/call-recording/src/utils/summarize-transcript.ts, packages/twenty-companion/src/twenty-client.js, packages/twenty-sdk/scripts/generate-metadata-client.ts, packages/twenty-sdk/src/cli/__tests__/constants/setupTest.ts, packages/twenty-sdk/src/cli/utilities/client/__tests__/clientServiceGeneratedClientAuth.test.ts, packages/twenty-sdk/src/clients/generated/metadata/index.ts | No |
| `TWENTY_METADATA_BASE_URL` | packages/twenty-apps/community/rollup-engine/scripts/setup-company-rollup-fields.mjs | No |
| `TWENTY_REST_BASE_URL` | packages/twenty-apps/community/rollup-engine/serverlessFunctions/calculaterollups/src/index.ts | No |
| `TWENTY_SERVER_URL` | packages/twenty-server/src/engine/core-modules/tool/tools/code-interpreter-tool/twenty-mcp-helper.const.ts | No |
| `TWENTY_WORKSPACE_SUBDOMAIN` | packages/twenty-companion/src/twenty-client.js | No |
| `WEBMETIC_DOMAIN` | packages/twenty-apps/community/webmetic/serverlessFunctions/sync-visitor-data/src/index.ts | No |
| `WXT_TWENTY_API_URL` | packages/twenty-apps/community/linkedin-browser-extension/browser-extension/src/entrypoints/background/index.ts | No |

### Public / Client-side

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `NEXT_PUBLIC_WEBSITE_URL` | packages/twenty-website/src/app/api/enterprise/checkout/route.ts, packages/twenty-website/src/app/api/enterprise/portal/route.ts | No |
| `REACT_APP_SERVER_BASE_URL` | packages/twenty-front/codegen-metadata.cjs, packages/twenty-front/codegen.cjs, packages/twenty-front/scripts/mock-data/utils.ts, packages/twenty-front/src/config/index.ts, packages/twenty-front/src/testing/mockedApolloClient.ts, packages/twenty-front/src/testing/mockedApolloCoreClient.ts | No |

### Other

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `APOLLO_CLIENT_ID` | packages/twenty-apps/community/apollo-enrich/src/logic-functions/get-authentication-token-pairs.ts, packages/twenty-apps/community/apollo-enrich/src/logic-functions/get-oauth-application-variables.ts | No |
| `APP_VERSION` | packages/twenty-server/src/instrument.ts | No |
| `APPLICATION_ID` | packages/twenty-apps/community/apollo-enrich/src/logic-functions/get-authentication-token-pairs.ts, packages/twenty-apps/community/apollo-enrich/src/logic-functions/get-verify-page.ts | No |
| `AUTO_CREATE_CONTACTS` | packages/twenty-apps/community/fireflies/src/utils.ts, packages/twenty-apps/community/fireflies/src/__tests__/setup.ts | No |
| `CALCULATE_ROLLUPS_CONFIG` | packages/twenty-apps/community/rollup-engine/serverlessFunctions/calculaterollups/src/config.ts | No |
| `CAPTURE_LOGS` | packages/twenty-apps/community/fireflies/src/logger.ts, packages/twenty-apps/community/fireflies/src/webhook-handler.ts, packages/twenty-apps/community/fireflies/src/__tests__/setup.ts, packages/twenty-apps/community/fireflies/src/__tests__/webhook-handler-logging.spec.ts | No |
| `CI` | packages/twenty-e2e-testing/playwright.config.ts, packages/twenty-front/vite.config.ts, packages/twenty-shared/src/testing/EachTestingContextFilter.ts | No |
| `CLIENT_REFERENCE_ID` | packages/twenty-apps/community/fireflies/scripts/test-webhook.ts | No |
| `COMPANY_CONSTRAINT` | packages/twenty-apps/community/mailchimp-synchronizer/src/index.ts | No |
| `DAYS_AGO` | packages/twenty-apps/community/activity-summary/serverlessFunctions/summarise-and-send/src/index.ts, packages/twenty-apps/community/activity-summary/serverlessFunctions/summarise-and-send/src/senders.ts | No |
| `DEFAULT_LOGIN` | packages/twenty-e2e-testing/tests/login.setup.ts, packages/twenty-e2e-testing/tests/authentication/return-to-path.spec.ts | No |
| `EXCEPTION_HANDLER_DRIVER` | packages/twenty-server/src/instrument.ts | No |
| `FIREFLIES_MAX_POLLS` | packages/twenty-apps/community/fireflies/src/utils.ts | No |
| `FIREFLIES_PLAN` | packages/twenty-apps/community/fireflies/src/utils.ts | No |
| `FIREFLIES_POLL_INTERVAL` | packages/twenty-apps/community/fireflies/src/utils.ts | No |
| `FIREFLIES_RETRY_ATTEMPTS` | packages/twenty-apps/community/fireflies/src/utils.ts | No |
| `FIREFLIES_RETRY_DELAY` | packages/twenty-apps/community/fireflies/src/utils.ts | No |
| `FIREFLIES_SUMMARY_STRATEGY` | packages/twenty-apps/community/fireflies/src/utils.ts, packages/twenty-apps/community/fireflies/src/__tests__/fireflies-webhook.spec.ts | No |
| `INIT_CWD` | packages/create-twenty-app/src/create-app.command.ts, packages/twenty-sdk/src/cli/utilities/config/current-execution-directory.ts | No |
| `IS_ADDRESS_CONSTRAINT` | packages/twenty-apps/community/mailchimp-synchronizer/src/index.ts | No |
| `IS_BILLING_ENABLED` | packages/twenty-server/jest-integration.config.ts, packages/twenty-server/src/database/typeorm/core/core.datasource.ts | No |
| `IS_CONFIG_VARIABLES_IN_DB_ENABLED` | packages/twenty-server/src/engine/core-modules/twenty-config/twenty-config.module.ts | No |
| `IS_DEBUG_MODE` | packages/twenty-front/src/modules/ai/components/RoutingStatusDisplay.tsx, packages/twenty-front/src/modules/apollo/components/ApolloProvider.tsx, packages/twenty-front/src/modules/apollo/hooks/useApolloFactory.ts, packages/twenty-front/src/modules/debug/components/ApolloDevLogEffect.tsx | No |
| `IS_DEV_ENV` | packages/twenty-front/src/utils/getIsDevelopmentEnvironment.ts, packages/twenty-front/src/utils/__tests__/getIsDevelopmentEnvironment.test.ts | No |
| `IS_EMAIL_CONSTRAINT` | packages/twenty-apps/community/mailchimp-synchronizer/src/index.ts | No |
| `IS_FDW_ENABLED` | packages/twenty-server/scripts/setup-db.ts | No |
| `IS_MULTIWORKSPACE_ENABLED` | packages/twenty-server/test/integration/graphql/suites/auth.integration-spec.ts | No |
| `IS_PHONE_CONSTRAINT` | packages/twenty-apps/community/mailchimp-synchronizer/src/index.ts | No |
| `JEST_WORKER_ID` | packages/twenty-apps/community/fireflies/src/logger.ts, packages/twenty-apps/community/fireflies/src/twenty-crm-service.ts | No |
| `LC_ALL` | packages/twenty-front/jest.config.mjs | No |
| `LINK` | packages/twenty-e2e-testing/lib/fixtures/screenshot.ts, packages/twenty-e2e-testing/tests/login.setup.ts, packages/twenty-e2e-testing/tests/workflow-creation.spec.ts, packages/twenty-e2e-testing/tests/authentication/signup_invite_email.spec.ts | No |
| `LOG_LEVEL` | packages/twenty-apps/community/fireflies/src/logger.ts, packages/twenty-apps/community/fireflies/src/__tests__/setup.ts | No |
| `LOG_LEVELS` | packages/twenty-server/test/integration/metadata/utils/warn-if-error-but-not-expected-to-fail.util.ts | No |
| `LOGGER_IS_BUFFER_ENABLED` | packages/twenty-server/src/main.ts, packages/twenty-server/src/command/command.ts, packages/twenty-server/src/queue-worker/queue-worker.ts | No |
| `MAILCHIMP_AUDIENCE_ID` | packages/twenty-apps/community/mailchimp-synchronizer/src/index.ts | No |
| `MAILCHIMP_SERVER_PREFIX` | packages/twenty-apps/community/mailchimp-synchronizer/src/index.ts | No |
| `MEETING_ID` | packages/twenty-apps/community/fireflies/scripts/ingest-meeting.ts, packages/twenty-apps/community/fireflies/scripts/test-webhook.ts | No |
| `MESSAGE_QUEUE_TYPE` | packages/twenty-server/src/app.module.ts | No |
| `METER_DRIVER` | packages/twenty-server/src/instrument.ts | No |
| `NODE_ENV` | packages/twenty-apps/community/fireflies/src/logger.ts, packages/twenty-apps/community/fireflies/src/twenty-crm-service.ts, packages/twenty-companion/src/main.js, packages/twenty-front/src/modules/apollo/components/ApolloProvider.tsx, packages/twenty-front/src/modules/object-metadata/hooks/useApolloCoreClient.ts, packages/twenty-front/src/pages/settings/ai/SettingsAgentForm.tsx, packages/twenty-front/src/pages/settings/profile/appearance/components/LocalePicker.tsx, packages/twenty-sdk/src/cli/utilities/config/get-config-path.ts, packages/twenty-server/jest-integration.config.ts, packages/twenty-server/src/app.module.ts, packages/twenty-server/src/instrument.ts, packages/twenty-server/src/main.ts, packages/twenty-server/src/database/clickHouse/migrations/run-migrations.ts, packages/twenty-server/src/database/clickHouse/seeds/run-seeds.ts, packages/twenty-server/src/database/typeorm/core/core.datasource.ts, packages/twenty-server/src/database/typeorm/raw/raw.datasource.ts, packages/twenty-server/src/engine/core-modules/application/application-oauth/controllers/oauth-registration.controller.ts, packages/twenty-server/src/engine/core-modules/cache-storage/services/cache-storage.service.ts, packages/twenty-server/src/engine/core-modules/environment/environment.module.ts, packages/twenty-server/src/engine/core-modules/message-queue/drivers/sync.driver.ts, packages/twenty-server/src/engine/core-modules/twenty-config/config-variables.ts, packages/twenty-server/src/engine/utils/global-exception-handler.util.ts, packages/twenty-server/src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant.ts, packages/twenty-server/src/utils/generate-front-config.ts, packages/twenty-website/src/app/(public)/releases/utils/get-releases.tsx, packages/twenty-website/src/app/(public)/releases/utils/get-visible-releases.ts, packages/twenty-website/src/app/_server-utils/get-posts.tsx | No |
| `NODE_TLS_REJECT_UNAUTHORIZED` | packages/twenty-front/codegen-metadata.cjs, packages/twenty-front/codegen.cjs, packages/twenty-front/scripts/mock-data/utils.ts | No |
| `ORM_QUERY_LOGGING` | packages/twenty-server/src/database/typeorm/core/core.datasource.ts | No |
| `PG_SSL_ALLOW_SELF_SIGNED` | packages/twenty-server/src/database/typeorm/core/core.datasource.ts, packages/twenty-server/src/database/typeorm/raw/raw.datasource.ts | No |
| `ROLLUP_ENGINE_CONFIG` | packages/twenty-apps/community/rollup-engine/serverlessFunctions/calculaterollups/src/config.ts | No |
| `ROLLUPS_CONFIG` | packages/twenty-apps/community/rollup-engine/serverlessFunctions/calculaterollups/src/config.ts | No |
| `SENTRY_DSN` | packages/twenty-server/src/instrument.ts | No |
| `SENTRY_ENVIRONMENT` | packages/twenty-server/src/instrument.ts | No |
| `SKIP_SIGN` | packages/twenty-companion/forge.config.js | No |
| `SSL_CERT_PATH` | packages/twenty-server/src/main.ts | No |
| `STORYBOOK_SCOPE` | packages/twenty-front/nyc.config.cjs | No |
| `TWENTY_ENV_PATH` | packages/twenty-apps/community/rollup-engine/scripts/setup-company-rollup-fields.mjs | No |
| `TZ` | packages/twenty-front/jest.config.mjs | No |
| `UPDATE_PERSON` | packages/twenty-apps/community/mailchimp-synchronizer/src/index.ts | No |
| `WHATSAPP_RECIPIENT_PHONE_NUMBER` | packages/twenty-apps/community/activity-summary/serverlessFunctions/summarise-and-send/src/index.ts, packages/twenty-apps/community/activity-summary/serverlessFunctions/summarise-and-send/src/senders.ts | No |

## Missing Documentation

The following variables are used but not listed in `.env.example`:

- `AI_PROVIDER_API_BASE_URL`
- `AI_PROVIDER_API_KEY`
- `API_KEY`
- `APOLLO_ACCESS_TOKEN`
- `APOLLO_CLIENT_ID`
- `APOLLO_CLIENT_SECRET`
- `APOLLO_OAUTH_URL`
- `APOLLO_REFRESH_TOKEN`
- `APOLLO_REGISTERED_URL`
- `APP_VERSION`
- `APPLICATION_ID`
- `AUTO_CREATE_CONTACTS`
- `BACKEND_BASE_URL`
- `CALCULATE_ROLLUPS_CONFIG`
- `CAPTURE_LOGS`
- `CI`
- `CLICKHOUSE_URL`
- `CLIENT_REFERENCE_ID`
- `CLOUDFLARE_API_KEY`
- `COMPANY_CONSTRAINT`
- `CROWDIN_PERSONAL_TOKEN`
- `DATABASE_PG_URL`
- `DAYS_AGO`
- `DEFAULT_LOGIN`
- `DEFAULT_PASSWORD`
- `DISCORD_WEBHOOK_URL`
- `ENTERPRISE_JWT_PRIVATE_KEY`
- `ENTERPRISE_JWT_PUBLIC_KEY`
- `ENTERPRISE_VALIDITY_TOKEN_DURATION_DAYS`
- `EXCEPTION_HANDLER_DRIVER`
- `FB_GRAPH_TOKEN`
- `FIREFLIES_API_KEY`
- `FIREFLIES_MAX_POLLS`
- `FIREFLIES_PLAN`
- `FIREFLIES_POLL_INTERVAL`
- `FIREFLIES_RETRY_ATTEMPTS`
- `FIREFLIES_RETRY_DELAY`
- `FIREFLIES_SUMMARY_STRATEGY`
- `FIREFLIES_WEBHOOK_SECRET`
- `FRONTEND_BASE_URL`
- `FRONTEND_URL`
- `GITHUB_TOKEN`
- `INIT_CWD`
- `IS_ADDRESS_CONSTRAINT`
- `IS_BILLING_ENABLED`
- `IS_CONFIG_VARIABLES_IN_DB_ENABLED`
- `IS_DEBUG_MODE`
- `IS_DEV_ENV`
- `IS_EMAIL_CONSTRAINT`
- `IS_FDW_ENABLED`
- `IS_MULTIWORKSPACE_ENABLED`
- `IS_PHONE_CONSTRAINT`
- `JEST_WORKER_ID`
- `KEY`
- `LC_ALL`
- `LINK`
- `LOG_LEVEL`
- `LOG_LEVELS`
- `LOGGER_IS_BUFFER_ENABLED`
- `MAILCHIMP_API_KEY`
- `MAILCHIMP_AUDIENCE_ID`
- `MAILCHIMP_SERVER_PREFIX`
- `MEETING_ID`
- `MESSAGE_QUEUE_TYPE`
- `METER_DRIVER`
- `NEXT_PUBLIC_WEBSITE_URL`
- `NODE_ENV`
- `NODE_TLS_REJECT_UNAUTHORIZED`
- `OPENAI_API_KEY`
- `OPENROUTER_KEY`
- `ORM_QUERY_LOGGING`
- `OTLP_COLLECTOR_METRICS_ENDPOINT_URL`
- `PG_DATABASE_PRIMARY_TIMEOUT_MS`
- `PG_DATABASE_URL`
- `PG_SSL_ALLOW_SELF_SIGNED`
- `REACT_APP_SERVER_BASE_URL`
- `RECALLAI_API_KEY`
- `RECALLAI_API_URL`
- `ROLLUP_ENGINE_CONFIG`
- `ROLLUPS_CONFIG`
- `SENTRY_DSN`
- `SENTRY_ENVIRONMENT`
- `SERVER_BASE_URL`
- `SERVER_URL`
- `SKIP_SIGN`
- `SLACK_HOOK_URL`
- `SSL_CERT_PATH`
- `SSL_KEY_PATH`
- `STORYBOOK_SCOPE`
- `STORYBOOK_URL`
- `STRIPE_API_KEY`
- `STRIPE_SECRET_KEY`
- `TWENTY_API_BASE_URL`
- `TWENTY_API_KEY`
- `TWENTY_API_TOKEN`
- `TWENTY_API_URL`
- `TWENTY_APP_ACCESS_TOKEN`
- `TWENTY_ENV_PATH`
- `TWENTY_METADATA_BASE_URL`
- `TWENTY_REST_BASE_URL`
- `TWENTY_SERVER_URL`
- `TWENTY_WORKSPACE_SUBDOMAIN`
- `TZ`
- `UPDATE_PERSON`
- `WEBHOOK_SECRET_TOKEN`
- `WEBMETIC_API_KEY`
- `WEBMETIC_DOMAIN`
- `WHATSAPP_RECIPIENT_PHONE_NUMBER`
- `WXT_TWENTY_API_KEY`
- `WXT_TWENTY_API_URL`

## Hardcoded Secrets Detected

> **34 potential secret(s)** found in source code. These should be moved to environment variables.

- **[CRITICAL]** 34 hardcoded secret(s) detected in source code: Hardcoded Secret, Hardcoded Password, Hardcoded Bearer Token. Move these to environment variables immediately.
- **[CRITICAL]** Hardcoded secrets can be extracted from version control history even after removal. Rotate any exposed credentials immediately.

| Severity | Type | File | Line | Snippet |
|----------|------|------|------|---------|
| HIGH | Hardcoded Secret | `packages/twenty-apps/community/fireflies/src/__tests__/setup.ts` | 7 | `process.env.FIREFLIES_WEBHOOK_SECRET = 'testsecret';` |
| HIGH | Hardcoded Secret | `packages/twenty-apps/community/fireflies/src/__tests__/setup.ts` | 10 | `process.env.TWENTY_API_KEY = "[REDACTED]";` |
| HIGH | Hardcoded Secret | `packages/twenty-apps/community/rollup-engine/scripts/run-rollup-smoke.ts` | 107 | `process.env.TWENTY_API_KEY = "[REDACTED]";` |
| HIGH | Hardcoded Password | `packages/twenty-front/scripts/mock-data/utils.ts` | 11 | `const AUTH_PASSWORD = 'tim@apple.dev';` |
| HIGH | Hardcoded Password | `packages/twenty-front/src/modules/auth/states/signInUpStepState.ts` | 5 | `Password = 'password',` |
| HIGH | Hardcoded Password | `packages/twenty-front/src/modules/ui/input/components/TextInput.tsx` | 219 | `const INPUT_TYPE_PASSWORD = 'password';` |
| HIGH | Hardcoded Secret | `packages/twenty-front/src/testing/graphqlMocks.ts` | 630 | `secret: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `packages/twenty-front/src/testing/graphqlMocks.ts` | 647 | `secret: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `packages/twenty-sdk/src/cli/__tests__/integration/utils/setup-app-dev-mocks.ts` | 35 | `clientSecret: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `packages/twenty-server/src/engine/core-modules/open-api/utils/computeWebhooks.utils.ts` | 47 | `'const secret = "your-secret";\n' +` |
| HIGH | Hardcoded Password | `packages/twenty-server/src/engine/core-modules/twenty-config/enums/config-variables-masking-strategies.enum.ts` | 3 | `HIDE_PASSWORD = "[REDACTED]",` |
| HIGH | Hardcoded Password | `packages/twenty-server/src/engine/core-modules/twenty-config/utils/config-variable-mask-sensitive-data.util.ts` | 21 | `url.password = '********';` |
| HIGH | Hardcoded Password | `packages/twenty-server/src/engine/core-modules/workspace/types/workspace.type.ts` | 4 | `Password = 'password',` |
| HIGH | Hardcoded Secret | `packages/twenty-server/src/engine/workspace-manager/workspace-migration/constant/standard-object-icons.ts` | 4 | `apiKey: 'IconRobot',` |
| HIGH | Hardcoded Bearer Token | `packages/twenty-server/test/integration/graphql/codegen/index.ts` | 17 | `'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMDIwMjAyMC05ZTNiLTQ2ZDQtYTU1Ni04OGI5ZGRjMmIwMzQiLCJ3b3Jrc3BhY2V...` |
| HIGH | Hardcoded Password | `packages/twenty-server/test/integration/graphql/suites/auth.integration-spec.ts` | 16 | `password: 'tim@apple.dev',` |
| HIGH | Hardcoded Password | `packages/twenty-server/test/integration/graphql/suites/user.integration-spec.ts` | 92 | `password: 'Password123!',` |
| HIGH | Hardcoded Password | `packages/twenty-server/test/integration/graphql/suites/auth/sign-up/failing-sign-up.integration-spec.ts` | 9 | `password: 'Test123!@#',` |
| HIGH | Hardcoded Password | `packages/twenty-server/test/integration/graphql/suites/auth/sign-up/failing-sign-up.integration-spec.ts` | 25 | `password: 'Test123!@#',` |
| HIGH | Hardcoded Password | `packages/twenty-server/test/integration/graphql/suites/auth/sign-up/failing-sign-up.integration-spec.ts` | 37 | `password: 'AnotherPassword123!',` |
| HIGH | Hardcoded Password | `packages/twenty-server/test/integration/graphql/suites/auth/sign-up/successful-sign-up.integration-spec.ts` | 27 | `password: 'Test123!@#',` |
| HIGH | Hardcoded Password | `packages/twenty-server/test/integration/graphql/suites/workspace/successful-user-and-workspace-creation.integration-spec.ts` | 38 | `password: 'Test123!@#',` |
| HIGH | Hardcoded Password | `packages/twenty-server/test/integration/graphql/suites/workspace/successful-user-and-workspace-creation.integration-spec.ts` | 140 | `password: 'Test123!@#',` |
| HIGH | Hardcoded Secret | `packages/twenty-server/test/integration/metadata/suites/developers/webhooks.integration-spec.ts` | 94 | `secret: 'test-secret',` |
| HIGH | Hardcoded Secret | `packages/twenty-server/test/integration/metadata/suites/developers/webhooks.integration-spec.ts` | 120 | `secret: 'test-secret',` |
| HIGH | Hardcoded Secret | `packages/twenty-server/test/integration/metadata/suites/developers/webhooks.integration-spec.ts` | 137 | `secret: 'test-secret',` |
| HIGH | Hardcoded Secret | `packages/twenty-server/test/integration/metadata/suites/developers/webhooks.integration-spec.ts` | 150 | `secret: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `packages/twenty-server/test/integration/metadata/suites/developers/webhooks.integration-spec.ts` | 180 | `secret: 'test-secret',` |
| HIGH | Hardcoded Secret | `packages/twenty-server/test/integration/metadata/suites/developers/webhooks.integration-spec.ts` | 210 | `secret: 'test-secret',` |
| HIGH | Hardcoded Secret | `packages/twenty-server/test/integration/metadata/suites/developers/webhooks.integration-spec.ts` | 241 | `secret: 'test-secret',` |
| HIGH | Hardcoded Secret | `packages/twenty-server/test/integration/metadata/suites/developers/webhooks.integration-spec.ts` | 309 | `secret: 'test-secret',` |
| HIGH | Hardcoded Secret | `packages/twenty-server/test/integration/oauth/suites/oauth.integration-spec.ts` | 270 | `client_secret: "[REDACTED]",` |
| HIGH | Hardcoded Password | `packages/twenty-shared/src/types/AppPath.ts` | 7 | `ResetPassword = '/reset-password/:passwordResetToken',` |
| HIGH | Hardcoded Secret | `packages/twenty-shared/src/types/SettingsPath.ts` | 49 | `NewApiKey = "[REDACTED]",` |

### Remediation Steps

1. Move all secrets to environment variables (`.env.local` or your secrets manager)
2. Rotate any credentials that have been committed to version control
3. Add `.env` and `.env.local` to `.gitignore`
4. Consider using a secrets manager (AWS Secrets Manager, HashiCorp Vault, Doppler)
5. Run `git log --all --full-history -S '<secret>'` to check if secrets exist in git history

---

*This audit was generated by [Codepliant](https://github.com/joechensmartz/codepliant). It is not a substitute for a professional security review.*
