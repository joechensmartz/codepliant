# Environment Variable Audit

> Generated on 2026-03-16 — 95 variable(s) detected.
> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16

## Security Recommendations

- **[CRITICAL]** Public env vars with secret-looking names (exposed to client): NEXT_PUBLIC_POSTHOG_KEY

## Environment Variables

### API Key / Secret

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `E2E_TEST_AUTHENTICATE_USER_PASSWORD` | .env.example | Yes |
| `GOOGLE_VERTEX_API_KEY` | .env.example | Yes |
| `NEXT_PRIVATE_DOCUMENSO_LICENSE_KEY` | .env.example, packages/lib/server-only/telemetry/telemetry-client.ts | No |
| `NEXT_PRIVATE_ENCRYPTION_KEY` | .env.example | Yes |
| `NEXT_PRIVATE_ENCRYPTION_SECONDARY_KEY` | .env.example | Yes |
| `NEXT_PRIVATE_GOOGLE_CLIENT_SECRET` | .env.example | Yes |
| `NEXT_PRIVATE_INNGEST_EVENT_KEY` | .env.example | No |
| `NEXT_PRIVATE_MAILCHANNELS_API_KEY` | .env.example | No |
| `NEXT_PRIVATE_MAILCHANNELS_DKIM_PRIVATE_KEY` | .env.example | No |
| `NEXT_PRIVATE_MICROSOFT_CLIENT_SECRET` | .env.example | Yes |
| `NEXT_PRIVATE_OIDC_CLIENT_SECRET` | .env.example | Yes |
| `NEXT_PRIVATE_PLAIN_API_KEY` | .env.example | No |
| `NEXT_PRIVATE_RESEND_API_KEY` | .env.example | No |
| `NEXT_PRIVATE_SES_ACCESS_KEY_ID` | .env.example | No |
| `NEXT_PRIVATE_SES_SECRET_ACCESS_KEY` | .env.example | No |
| `NEXT_PRIVATE_SIGNING_GCLOUD_APPLICATION_CREDENTIALS_CONTENTS` | .env.example | No |
| `NEXT_PRIVATE_SIGNING_GCLOUD_HSM_KEY_PATH` | .env.example | No |
| `NEXT_PRIVATE_SIGNING_GCLOUD_HSM_SECRET_MANAGER_CERT_PATH` | .env.example | No |
| `NEXT_PRIVATE_SMTP_APIKEY` | .env.example | No |
| `NEXT_PRIVATE_SMTP_APIKEY_USER` | .env.example | No |
| `NEXT_PRIVATE_SMTP_PASSWORD` | .env.example | Yes |
| `NEXT_PRIVATE_STRIPE_API_KEY` | .env.example | No |
| `NEXT_PRIVATE_STRIPE_WEBHOOK_SECRET` | .env.example | No |
| `NEXT_PRIVATE_TELEMETRY_KEY` | packages/lib/server-only/telemetry/telemetry-client.ts | No |
| `NEXT_PRIVATE_UPLOAD_ACCESS_KEY_ID` | .env.example | Yes |
| `NEXT_PRIVATE_UPLOAD_SECRET_ACCESS_KEY` | .env.example | Yes |
| `NEXTAUTH_SECRET` | .env.example | Yes |

### Database

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `DATABASE_URL` | packages/prisma/helper.ts | No |
| `DATABASE_URL_UNPOOLED` | packages/prisma/helper.ts | No |
| `NEXT_PRIVATE_DATABASE_REPLICA_URLS` | packages/prisma/index.ts | No |
| `NEXT_PRIVATE_DATABASE_URL` | .env.example, packages/prisma/helper.ts | Yes |
| `NEXT_PRIVATE_DIRECT_DATABASE_URL` | .env.example, packages/prisma/helper.ts | Yes |
| `POSTGRES_PRISMA_URL` | packages/prisma/helper.ts | No |
| `POSTGRES_URL` | packages/prisma/helper.ts | No |
| `POSTGRES_URL_NON_POOLING` | packages/prisma/helper.ts | No |

### Service Config

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `NEXT_PRIVATE_ALLOWED_SIGNUP_DOMAINS` | .env.example | No |
| `NEXT_PRIVATE_INTERNAL_WEBAPP_URL` | .env.example | Yes |
| `NEXT_PRIVATE_MAILCHANNELS_DKIM_DOMAIN` | .env.example | No |
| `NEXT_PRIVATE_MAILCHANNELS_ENDPOINT` | .env.example | No |
| `NEXT_PRIVATE_SIGNING_TRANSPORT` | .env.example | Yes |
| `NEXT_PRIVATE_SMTP_HOST` | .env.example | Yes |
| `NEXT_PRIVATE_SMTP_PORT` | .env.example | Yes |
| `NEXT_PRIVATE_SMTP_TRANSPORT` | .env.example | Yes |
| `NEXT_PRIVATE_TELEMETRY_HOST` | packages/lib/server-only/telemetry/telemetry-client.ts | No |
| `NEXT_PRIVATE_UPLOAD_ENDPOINT` | .env.example | Yes |
| `PORT` | .env.example, apps/remix/vite.config.ts, apps/remix/server/main.js | Yes |

### Public / Client-side

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `NEXT_PUBLIC_DISABLE_SIGNUP` | .env.example | No |
| `NEXT_PUBLIC_DOCUMENT_SIZE_UPLOAD_LIMIT` | .env.example | Yes |
| `NEXT_PUBLIC_FEATURE_BILLING_ENABLED` | .env.example, packages/app-tests/e2e/teams/manage-team.spec.ts, packages/app-tests/e2e/templates-flow/template-signers-step.spec.ts | No |
| `NEXT_PUBLIC_POSTHOG_KEY` | .env.example | Yes |
| `NEXT_PUBLIC_SIGNING_CONTACT_INFO` | .env.example | No |
| `NEXT_PUBLIC_STRIPE_ENTERPRISE_PLAN_MONTHLY_PRICE_ID` | packages/app-tests/e2e/templates-flow/template-signers-step.spec.ts | No |
| `NEXT_PUBLIC_UPLOAD_TRANSPORT` | .env.example, packages/api/v1/implementation.ts, packages/app-tests/e2e/templates/create-document-from-template.spec.ts, packages/trpc/server/document-router/download-document-beta.ts | Yes |
| `NEXT_PUBLIC_USE_INTERNAL_URL_BROWSERLESS` | .env.example | Yes |
| `NEXT_PUBLIC_WEBAPP_URL` | .env.example, packages/lib/server-only/user/service-accounts/deleted-account.ts, packages/lib/server-only/user/service-accounts/legacy-service-account.ts | Yes |

### Other

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `CI` | packages/app-tests/playwright.config.ts | No |
| `DANGEROUS_BYPASS_RATE_LIMITS` | .env.example, packages/lib/server-only/rate-limit/rate-limit.ts | No |
| `DEBUG_PDF_INSERT` | packages/lib/server-only/pdf/insert-field-in-pdf-v1.ts, packages/lib/server-only/pdf/legacy-insert-field-in-pdf.ts | No |
| `DOCUMENSO_DISABLE_TELEMETRY` | .env.example, packages/lib/server-only/telemetry/telemetry-client.ts | No |
| `E2E_TEST_AUTHENTICATE_USER_EMAIL` | .env.example | Yes |
| `E2E_TEST_AUTHENTICATE_USERNAME` | .env.example | Yes |
| `GOOGLE_VERTEX_LOCATION` | .env.example | Yes |
| `GOOGLE_VERTEX_PROJECT_ID` | .env.example | Yes |
| `NEXT_PRIVATE_DELETED_SERVICE_ACCOUNT_EMAIL` | packages/lib/server-only/user/service-accounts/deleted-account.ts | No |
| `NEXT_PRIVATE_GOOGLE_CLIENT_ID` | .env.example | Yes |
| `NEXT_PRIVATE_JOBS_PROVIDER` | .env.example | Yes |
| `NEXT_PRIVATE_LEGACY_SERVICE_ACCOUNT_EMAIL` | packages/lib/server-only/user/service-accounts/legacy-service-account.ts | No |
| `NEXT_PRIVATE_LOGGER_FILE_PATH` | .env.example | No |
| `NEXT_PRIVATE_MAILCHANNELS_DKIM_SELECTOR` | .env.example | No |
| `NEXT_PRIVATE_MICROSOFT_CLIENT_ID` | .env.example | Yes |
| `NEXT_PRIVATE_OIDC_CLIENT_ID` | .env.example | Yes |
| `NEXT_PRIVATE_OIDC_PROMPT` | .env.example, packages/auth/server/lib/utils/handle-oauth-authorize-url.ts | Yes |
| `NEXT_PRIVATE_OIDC_PROVIDER_LABEL` | .env.example | Yes |
| `NEXT_PRIVATE_OIDC_SKIP_VERIFY` | .env.example | Yes |
| `NEXT_PRIVATE_OIDC_WELL_KNOWN` | .env.example | Yes |
| `NEXT_PRIVATE_SES_REGION` | .env.example | No |
| `NEXT_PRIVATE_SIGNING_GCLOUD_HSM_CERT_CHAIN_CONTENTS` | .env.example | No |
| `NEXT_PRIVATE_SIGNING_GCLOUD_HSM_CERT_CHAIN_FILE_PATH` | .env.example | No |
| `NEXT_PRIVATE_SIGNING_GCLOUD_HSM_PUBLIC_CRT_FILE_CONTENTS` | .env.example | No |
| `NEXT_PRIVATE_SIGNING_GCLOUD_HSM_PUBLIC_CRT_FILE_PATH` | .env.example | No |
| `NEXT_PRIVATE_SIGNING_LOCAL_FILE_CONTENTS` | .env.example | No |
| `NEXT_PRIVATE_SIGNING_LOCAL_FILE_PATH` | .env.example | No |
| `NEXT_PRIVATE_SIGNING_PASSPHRASE` | .env.example | No |
| `NEXT_PRIVATE_SIGNING_TIMESTAMP_AUTHORITY` | .env.example | No |
| `NEXT_PRIVATE_SMTP_FROM_ADDRESS` | .env.example | Yes |
| `NEXT_PRIVATE_SMTP_FROM_NAME` | .env.example | Yes |
| `NEXT_PRIVATE_SMTP_SECURE` | .env.example | No |
| `NEXT_PRIVATE_SMTP_SERVICE` | .env.example | No |
| `NEXT_PRIVATE_SMTP_UNSAFE_IGNORE_TLS` | .env.example | No |
| `NEXT_PRIVATE_SMTP_USERNAME` | .env.example | Yes |
| `NEXT_PRIVATE_UPLOAD_BUCKET` | .env.example | Yes |
| `NEXT_PRIVATE_UPLOAD_FORCE_PATH_STYLE` | .env.example | Yes |
| `NEXT_PRIVATE_UPLOAD_REGION` | .env.example | Yes |
| `NEXT_PRIVATE_USE_LEGACY_SIGNING_SUBFILTER` | .env.example | No |
| `NODE_ENV` | apps/remix/app/routes/embed+/playground.tsx, packages/app-tests/playwright.config.ts | No |

## Missing Documentation

The following variables are used but not listed in `.env.example`:

- `CI`
- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`
- `DEBUG_PDF_INSERT`
- `NEXT_PRIVATE_DATABASE_REPLICA_URLS`
- `NEXT_PRIVATE_DELETED_SERVICE_ACCOUNT_EMAIL`
- `NEXT_PRIVATE_LEGACY_SERVICE_ACCOUNT_EMAIL`
- `NEXT_PRIVATE_TELEMETRY_HOST`
- `NEXT_PRIVATE_TELEMETRY_KEY`
- `NEXT_PUBLIC_STRIPE_ENTERPRISE_PLAN_MONTHLY_PRICE_ID`
- `NODE_ENV`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL`
- `POSTGRES_URL_NON_POOLING`

## Hardcoded Secrets Detected

> **2 potential secret(s)** found in source code. These should be moved to environment variables.

- **[CRITICAL]** 2 hardcoded secret(s) detected in source code: Hardcoded Password. Move these to environment variables immediately.
- **[CRITICAL]** Hardcoded secrets can be extracted from version control history even after removal. Rotate any exposed credentials immediately.

| Severity | Type | File | Line | Snippet |
|----------|------|------|------|---------|
| HIGH | Hardcoded Password | `packages/app-tests/e2e/fixtures/authentication.ts` | 19 | `password = 'password',` |
| HIGH | Hardcoded Password | `packages/prisma/seed/users.ts` | 29 | `password = 'password',` |

### Remediation Steps

1. Move all secrets to environment variables (`.env.local` or your secrets manager)
2. Rotate any credentials that have been committed to version control
3. Add `.env` and `.env.local` to `.gitignore`
4. Consider using a secrets manager (AWS Secrets Manager, HashiCorp Vault, Doppler)
5. Run `git log --all --full-history -S '<secret>'` to check if secrets exist in git history

---

*This audit was generated by [Codepliant](https://github.com/joechensmartz/codepliant). It is not a substitute for a professional security review.*
