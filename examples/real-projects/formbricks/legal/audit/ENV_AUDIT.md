# Environment Variable Audit

> Generated on 2026-03-16 — 101 variable(s) detected.
> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16

## Environment Variables

### API Key / Secret

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `AZUREAD_CLIENT_SECRET` | .env.example, apps/web/lib/env.ts | No |
| `BREVO_API_KEY` | apps/web/lib/env.ts | No |
| `CHATWOOT_WEBSITE_TOKEN` | apps/web/lib/env.ts | No |
| `CRON_SECRET` | .env.example, apps/web/lib/env.ts | No |
| `ENCRYPTION_KEY` | .env.example, apps/web/lib/env.ts, apps/web/lib/utils/logger-helpers.test.ts | No |
| `ENTERPRISE_LICENSE_KEY` | .env.example, apps/web/lib/env.ts | No |
| `GITHUB_SECRET` | .env.example, apps/web/lib/env.ts | No |
| `GOOGLE_CLIENT_SECRET` | .env.example, apps/web/lib/env.ts | No |
| `GOOGLE_SHEETS_CLIENT_SECRET` | .env.example, apps/web/lib/env.ts | No |
| `LINGODOTDEV_API_KEY` | .env.example | Yes |
| `NEXTAUTH_SECRET` | .env.example, apps/web/lib/env.ts | No |
| `NOTION_OAUTH_CLIENT_SECRET` | .env.example, apps/web/lib/env.ts | No |
| `OIDC_CLIENT_SECRET` | apps/web/lib/env.ts | No |
| `PASSWORD_RESET_DISABLED` | .env.example, apps/web/lib/env.ts | Yes |
| `POSTHOG_KEY` | apps/web/next.config.mjs, apps/web/lib/env.ts | No |
| `RECAPTCHA_SECRET_KEY` | .env.example, apps/web/lib/env.ts | No |
| `RECAPTCHA_SITE_KEY` | .env.example, apps/web/lib/env.ts | No |
| `S3_ACCESS_KEY` | .env.example, apps/web/lib/env.ts, packages/storage/src/constants.test.ts, packages/storage/src/constants.ts | No |
| `S3_SECRET_KEY` | .env.example, apps/web/lib/env.ts, packages/storage/src/constants.test.ts, packages/storage/src/constants.ts | No |
| `SENTRY_AUTH_TOKEN` | apps/web/next.config.mjs | No |
| `SLACK_CLIENT_SECRET` | .env.example, apps/web/lib/env.ts | No |
| `SMTP_PASSWORD` | .env.example, apps/web/lib/env.ts | Yes |
| `STRIPE_PUBLISHABLE_KEY` | .env.example, apps/web/lib/env.ts | No |
| `STRIPE_SECRET_KEY` | .env.example, apps/web/lib/env.ts | No |
| `STRIPE_WEBHOOK_SECRET` | .env.example, apps/web/lib/env.ts | No |
| `TURNSTILE_SECRET_KEY` | apps/web/lib/env.ts | No |
| `TURNSTILE_SITE_KEY` | apps/web/lib/env.ts | No |
| `UNSPLASH_ACCESS_KEY` | .env.example, apps/web/lib/env.ts | No |

### Database

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `DATABASE_URL` | .env.example, apps/web/lib/env.ts, packages/database/src/client.ts | Yes |
| `REDIS_URL` | .env.example, apps/web/lib/env.ts, packages/cache/src/client.test.ts, packages/cache/src/client.ts | Yes |
| `SAML_DATABASE_URL` | apps/web/lib/env.ts, packages/database/src/scripts/create-saml-database.ts | No |

### Service Config

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `ASSET_PREFIX_URL` | apps/web/next.config.mjs | No |
| `CHATWOOT_BASE_URL` | apps/web/lib/env.ts | No |
| `GOOGLE_SHEETS_REDIRECT_URL` | .env.example, apps/web/lib/env.ts | No |
| `IMPRINT_URL` | .env.example, apps/web/lib/env.ts | No |
| `NEXTAUTH_URL` | .env.example, apps/web/next.config.mjs, apps/web/lib/env.ts | Yes |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | apps/web/instrumentation-node.ts, apps/web/instrumentation.ts, packages/logger/src/logger.ts | No |
| `PRIVACY_URL` | .env.example, apps/web/lib/env.ts | No |
| `PROMETHEUS_EXPORTER_PORT` | apps/web/instrumentation-node.ts, apps/web/lib/env.ts | No |
| `PUBLIC_URL` | apps/web/app/middleware/domain-utils.test.ts, apps/web/lib/env.ts | No |
| `S3_ENDPOINT_URL` | .env.example, apps/web/lib/env.ts, packages/storage/src/constants.test.ts, packages/storage/src/constants.ts | No |
| `SMTP_HOST` | .env.example, apps/web/lib/env.ts | Yes |
| `SMTP_PORT` | .env.example, apps/web/lib/env.ts | Yes |
| `TERMS_URL` | .env.example, apps/web/lib/env.ts | No |
| `VERCEL_URL` | apps/web/lib/env.ts | No |
| `WEBAPP_URL` | .env.example, apps/web/next.config.mjs, apps/web/lib/env.ts | Yes |

### Other

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `AIRTABLE_CLIENT_ID` | .env.example, apps/web/lib/env.ts | No |
| `ALLOW_SEED` | packages/database/src/seed.ts | No |
| `ANALYZE` | packages/surveys/vite.config.mts | No |
| `AUDIT_LOG_ENABLED` | apps/web/lib/env.ts | No |
| `AUDIT_LOG_GET_USER_IP` | apps/web/lib/env.ts | No |
| `AUTH_SKIP_INVITE_FOR_SSO` | apps/web/lib/env.ts | No |
| `AUTH_SSO_DEFAULT_TEAM_ID` | apps/web/lib/env.ts | No |
| `AZUREAD_CLIENT_ID` | .env.example, apps/web/lib/env.ts | No |
| `AZUREAD_TENANT_ID` | .env.example, apps/web/lib/env.ts | No |
| `BASE_PATH` | apps/web/next.config.mjs | No |
| `BREVO_LIST_ID` | apps/web/lib/env.ts | No |
| `BUILD_UMD` | packages/surveys/vite.config.mts | No |
| `CI` | playwright.config.ts | No |
| `DEBUG` | apps/web/lib/env.ts, packages/database/src/client.ts | No |
| `E2E_TESTING` | apps/web/lib/env.ts | No |
| `EMAIL_AUTH_DISABLED` | apps/web/lib/env.ts | No |
| `EMAIL_VERIFICATION_DISABLED` | .env.example, apps/web/lib/env.ts | Yes |
| `ENVIRONMENT` | apps/web/instrumentation-node.ts, apps/web/lib/env.ts, packages/logger/src/logger.ts | No |
| `GITHUB_ID` | .env.example, apps/web/lib/env.ts | No |
| `GOOGLE_CLIENT_ID` | .env.example, apps/web/lib/env.ts | No |
| `GOOGLE_SHEETS_CLIENT_ID` | .env.example, apps/web/lib/env.ts | No |
| `HTTP_PROXY` | apps/web/lib/env.ts | No |
| `HTTPS_PROXY` | apps/web/lib/env.ts | No |
| `IMPRINT_ADDRESS` | .env.example, apps/web/lib/env.ts | No |
| `INVITE_DISABLED` | apps/web/lib/env.ts | No |
| `IS_FORMBRICKS_CLOUD` | apps/web/lib/env.ts | No |
| `LOG_LEVEL` | .env.example, apps/web/lib/env.ts, packages/logger/src/logger.test.ts, packages/logger/src/logger.ts | Yes |
| `MAIL_FROM` | .env.example, apps/web/lib/env.ts | Yes |
| `MAIL_FROM_NAME` | .env.example, apps/web/lib/env.ts | Yes |
| `NEXT_PHASE` | apps/web/modules/ee/license-check/lib/license.test.ts, apps/web/modules/ee/license-check/lib/license.ts, packages/logger/src/logger.ts | No |
| `NEXT_RUNTIME` | apps/web/instrumentation.ts, packages/logger/src/logger.test.ts, packages/logger/src/logger.ts | No |
| `NODE_ENV` | apps/web/instrumentation-node.ts, apps/web/next.config.mjs, apps/web/sentry.server.config.ts, apps/web/app/error.tsx, apps/web/app/global-error.tsx, apps/web/app/posthog/PostHogIdentify.tsx, apps/web/lib/constants.ts, apps/web/lib/env.ts, apps/web/modules/ee/license-check/lib/license.ts, apps/web/modules/survey/components/template-list/index.tsx, apps/web/modules/ui/components/survey/index.tsx, packages/database/src/client.ts, packages/database/src/seed.ts, packages/logger/src/logger.test.ts, packages/logger/src/logger.ts, packages/surveys/vite.config.mts | No |
| `NOTION_OAUTH_CLIENT_ID` | .env.example, apps/web/lib/env.ts | No |
| `OIDC_CLIENT_ID` | apps/web/lib/env.ts | No |
| `OIDC_DISPLAY_NAME` | apps/web/lib/env.ts | No |
| `OIDC_ISSUER` | apps/web/lib/env.ts | No |
| `OIDC_SIGNING_ALGORITHM` | apps/web/lib/env.ts | No |
| `OTEL_SERVICE_NAME` | apps/web/instrumentation-node.ts, packages/logger/src/logger.ts | No |
| `OTEL_TRACES_SAMPLER` | apps/web/instrumentation-node.ts | No |
| `OTEL_TRACES_SAMPLER_ARG` | apps/web/instrumentation-node.ts | No |
| `PROMETHEUS_ENABLED` | apps/web/instrumentation-node.ts, apps/web/lib/env.ts | No |
| `RATE_LIMITING_DISABLED` | apps/web/lib/env.ts | No |
| `S3_BUCKET_NAME` | .env.example, apps/web/lib/env.ts, packages/storage/src/constants.test.ts, packages/storage/src/constants.ts | No |
| `S3_FORCE_PATH_STYLE` | .env.example, apps/web/lib/env.ts, packages/storage/src/constants.test.ts, packages/storage/src/constants.ts | Yes |
| `S3_REGION` | .env.example, apps/web/lib/env.ts, packages/storage/src/constants.test.ts, packages/storage/src/constants.ts | No |
| `SENTRY_DSN` | apps/web/lib/env.ts | No |
| `SENTRY_ENVIRONMENT` | apps/web/lib/env.ts | No |
| `SESSION_MAX_AGE` | apps/web/lib/env.ts | No |
| `SLACK_CLIENT_ID` | .env.example, apps/web/lib/env.ts | No |
| `SMTP_AUTHENTICATED` | apps/web/lib/env.ts | No |
| `SMTP_REJECT_UNAUTHORIZED_TLS` | apps/web/lib/env.ts | No |
| `SMTP_SECURE_ENABLED` | .env.example, apps/web/lib/env.ts | Yes |
| `SMTP_USER` | .env.example, apps/web/lib/env.ts | Yes |
| `USER_MANAGEMENT_MINIMUM_ROLE` | apps/web/lib/env.ts | No |
| `VERSION` | packages/js-core/vite.config.ts | No |

## Missing Documentation

The following variables are used but not listed in `.env.example`:

- `ALLOW_SEED`
- `ANALYZE`
- `ASSET_PREFIX_URL`
- `AUDIT_LOG_ENABLED`
- `AUDIT_LOG_GET_USER_IP`
- `AUTH_SKIP_INVITE_FOR_SSO`
- `AUTH_SSO_DEFAULT_TEAM_ID`
- `BASE_PATH`
- `BREVO_API_KEY`
- `BREVO_LIST_ID`
- `BUILD_UMD`
- `CHATWOOT_BASE_URL`
- `CHATWOOT_WEBSITE_TOKEN`
- `CI`
- `DEBUG`
- `E2E_TESTING`
- `EMAIL_AUTH_DISABLED`
- `ENVIRONMENT`
- `HTTP_PROXY`
- `HTTPS_PROXY`
- `INVITE_DISABLED`
- `IS_FORMBRICKS_CLOUD`
- `NEXT_PHASE`
- `NEXT_RUNTIME`
- `NODE_ENV`
- `OIDC_CLIENT_ID`
- `OIDC_CLIENT_SECRET`
- `OIDC_DISPLAY_NAME`
- `OIDC_ISSUER`
- `OIDC_SIGNING_ALGORITHM`
- `OTEL_EXPORTER_OTLP_ENDPOINT`
- `OTEL_SERVICE_NAME`
- `OTEL_TRACES_SAMPLER`
- `OTEL_TRACES_SAMPLER_ARG`
- `POSTHOG_KEY`
- `PROMETHEUS_ENABLED`
- `PROMETHEUS_EXPORTER_PORT`
- `PUBLIC_URL`
- `RATE_LIMITING_DISABLED`
- `SAML_DATABASE_URL`
- `SENTRY_AUTH_TOKEN`
- `SENTRY_DSN`
- `SENTRY_ENVIRONMENT`
- `SESSION_MAX_AGE`
- `SMTP_AUTHENTICATED`
- `SMTP_REJECT_UNAUTHORIZED_TLS`
- `TURNSTILE_SECRET_KEY`
- `TURNSTILE_SITE_KEY`
- `USER_MANAGEMENT_MINIMUM_ROLE`
- `VERCEL_URL`
- `VERSION`

## Hardcoded Secrets Detected

> **11 potential secret(s)** found in source code. These should be moved to environment variables.

- **[CRITICAL]** 11 hardcoded secret(s) detected in source code: Hardcoded Secret, Hardcoded Password. Move these to environment variables immediately.
- **[CRITICAL]** Hardcoded secrets can be extracted from version control history even after removal. Rotate any exposed credentials immediately.

| Severity | Type | File | Line | Snippet |
|----------|------|------|------|---------|
| HIGH | Hardcoded Secret | `apps/web/vitestSetup.ts` | 192 | `GITHUB_SECRET: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `apps/web/vitestSetup.ts` | 194 | `GOOGLE_CLIENT_SECRET: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `apps/web/vitestSetup.ts` | 196 | `AZUREAD_CLIENT_SECRET: "test-azure",` |
| HIGH | Hardcoded Secret | `apps/web/vitestSetup.ts` | 201 | `OIDC_CLIENT_SECRET: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `apps/web/vitestSetup.ts` | 229 | `BREVO_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Password | `apps/web/vitestSetup.ts` | 237 | `SMTP_PASSWORD: "[REDACTED]", //NOSONAR ignore rule for test setup` |
| HIGH | Hardcoded Secret | `apps/web/modules/api/v2/management/lib/tests/__mocks__/api-key.mock.ts` | 1 | `export const apiKey = "[REDACTED]";` |
| HIGH | Hardcoded Password | `apps/web/playwright/utils/mock.ts` | 1 | `const MOCK_PASSWORD = "[REDACTED]";` |
| HIGH | Hardcoded Password | `packages/database/src/seed/constants.ts` | 16 | `ADMIN: { email: "admin@formbricks.com", password: "Password#123" },` |
| HIGH | Hardcoded Password | `packages/database/src/seed/constants.ts` | 17 | `MANAGER: { email: "manager@formbricks.com", password: "Password#123" },` |
| HIGH | Hardcoded Password | `packages/database/src/seed/constants.ts` | 18 | `MEMBER: { email: "member@formbricks.com", password: "Password#123" },` |

### Remediation Steps

1. Move all secrets to environment variables (`.env.local` or your secrets manager)
2. Rotate any credentials that have been committed to version control
3. Add `.env` and `.env.local` to `.gitignore`
4. Consider using a secrets manager (AWS Secrets Manager, HashiCorp Vault, Doppler)
5. Run `git log --all --full-history -S '<secret>'` to check if secrets exist in git history

---

*This audit was generated by [Codepliant](https://github.com/joechensmartz/codepliant). It is not a substitute for a professional security review.*
