# Environment Variable Audit

> Generated on 2026-03-16 — 48 variable(s) detected.
> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16

## Environment Variables

### API Key / Secret

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `ACTIVE_RECORD_ENCRYPTION_DETERMINISTIC_KEY` | config/initializers/active_record_encryption.rb | No |
| `ACTIVE_RECORD_ENCRYPTION_KEY_DERIVATION_SALT` | config/initializers/active_record_encryption.rb | No |
| `ACTIVE_RECORD_ENCRYPTION_PRIMARY_KEY` | config/initializers/active_record_encryption.rb | No |
| `INTERCOM_IDENTITY_VERIFICATION_KEY` | config/initializers/intercom.rb | No |
| `LOGTAIL_API_KEY` | config/environments/production.rb | No |
| `OPENAI_ACCESS_TOKEN` | app/models/setting.rb, app/models/user.rb, test/test_helper.rb | No |
| `PLAID_EU_SECRET` | config/initializers/plaid.rb | No |
| `PLAID_SECRET` | config/initializers/plaid.rb, test/test_helper.rb | No |
| `POSTGRES_PASSWORD` | .env.example | Yes |
| `RAILS_MASTER_KEY` | config/environments/production.rb | No |
| `SECRET_KEY_BASE` | .env.example | Yes |
| `SMTP_PASSWORD` | .env.example, config/environments/production.rb | No |
| `STRIPE_SECRET_KEY` | app/models/provider/registry.rb, test/test_helper.rb, test/models/provider/stripe_test.rb | No |
| `STRIPE_WEBHOOK_SECRET` | app/models/provider/registry.rb, test/test_helper.rb, test/models/provider/stripe_test.rb | No |
| `SYNTH_API_KEY` | .env.example, app/models/setting.rb, test/test_helper.rb, test/models/provider/synth_test.rb | No |

### Database

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `CACHE_REDIS_URL` | config/environments/production.rb | No |
| `POSTGRES_USER` | .env.example | Yes |

### Service Config

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `APP_DOMAIN` | .env.example, config/environments/production.rb | No |
| `DB_HOST` | .env.example | Yes |
| `DB_PORT` | .env.example | Yes |
| `LOGTAIL_INGESTING_HOST` | config/environments/production.rb | No |
| `PORT` | .env.example | Yes |
| `SELF_HOSTED` | .env.example, config/application.rb | Yes |
| `SELF_HOSTING_ENABLED` | config/application.rb | No |
| `SMTP_PORT` | .env.example, config/environments/production.rb | Yes |
| `SYNTH_URL` | app/models/provider/synth.rb | No |

### Other

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `AI_DEBUG_MODE` | app/models/chat/debuggable.rb | No |
| `BUILD_COMMIT_SHA` | config/initializers/version.rb | No |
| `BUNDLE_GEMFILE` | config/boot.rb | No |
| `CI` | config/environments/test.rb, test/application_system_test_case.rb | No |
| `COVERAGE` | test/test_helper.rb | No |
| `DISABLE_PARALLELIZATION` | test/test_helper.rb | No |
| `EMAIL_SENDER` | .env.example, config/environments/test.rb | No |
| `INTERCOM_APP_ID` | config/initializers/intercom.rb | No |
| `OPENAI_ORGANIZATION_ID` | test/test_helper.rb | No |
| `PGGSSENCMODE` | test/test_helper.rb | No |
| `PIDFILE` | config/puma.rb | No |
| `PLAID_CLIENT_ID` | config/initializers/plaid.rb, test/test_helper.rb | No |
| `PLAID_ENV` | config/initializers/plaid.rb, test/test_helper.rb | No |
| `PLAID_EU_CLIENT_ID` | config/initializers/plaid.rb | No |
| `RAILS_ENV` | config/initializers/sentry.rb, test/test_helper.rb | No |
| `REQUIRE_INVITE_CODE` | app/controllers/concerns/invitable.rb | No |
| `SENTRY_DSN` | app/controllers/concerns/authentication.rb, config/initializers/sentry.rb | No |
| `SMTP_ADDRESS` | .env.example, config/environments/production.rb | No |
| `SMTP_TLS_ENABLED` | .env.example, config/environments/production.rb | Yes |
| `SMTP_USERNAME` | .env.example, config/environments/production.rb | No |
| `STRIPE_ANNUAL_PRICE_ID` | app/models/provider/stripe.rb | No |
| `STRIPE_MONTHLY_PRICE_ID` | app/models/provider/stripe.rb | No |

## Missing Documentation

The following variables are used but not listed in `.env.example`:

- `ACTIVE_RECORD_ENCRYPTION_DETERMINISTIC_KEY`
- `ACTIVE_RECORD_ENCRYPTION_KEY_DERIVATION_SALT`
- `ACTIVE_RECORD_ENCRYPTION_PRIMARY_KEY`
- `AI_DEBUG_MODE`
- `BUILD_COMMIT_SHA`
- `BUNDLE_GEMFILE`
- `CACHE_REDIS_URL`
- `CI`
- `COVERAGE`
- `DISABLE_PARALLELIZATION`
- `INTERCOM_APP_ID`
- `INTERCOM_IDENTITY_VERIFICATION_KEY`
- `LOGTAIL_API_KEY`
- `LOGTAIL_INGESTING_HOST`
- `OPENAI_ACCESS_TOKEN`
- `OPENAI_ORGANIZATION_ID`
- `PGGSSENCMODE`
- `PIDFILE`
- `PLAID_CLIENT_ID`
- `PLAID_ENV`
- `PLAID_EU_CLIENT_ID`
- `PLAID_EU_SECRET`
- `PLAID_SECRET`
- `RAILS_ENV`
- `RAILS_MASTER_KEY`
- `REQUIRE_INVITE_CODE`
- `SELF_HOSTING_ENABLED`
- `SENTRY_DSN`
- `STRIPE_ANNUAL_PRICE_ID`
- `STRIPE_MONTHLY_PRICE_ID`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SYNTH_URL`

## Hardcoded Secrets Detected

> **18 potential secret(s)** found in source code. These should be moved to environment variables.

- **[CRITICAL]** 18 hardcoded secret(s) detected in source code: Hardcoded Password, Hardcoded Secret. Move these to environment variables immediately.
- **[CRITICAL]** Hardcoded secrets can be extracted from version control history even after removal. Rotate any exposed credentials immediately.

| Severity | Type | File | Line | Snippet |
|----------|------|------|------|---------|
| HIGH | Hardcoded Password | `app/models/demo/generator.rb` | 139 | `password: "password",` |
| HIGH | Hardcoded Password | `app/models/demo/generator.rb` | 149 | `password: "password",` |
| HIGH | Hardcoded Password | `test/controllers/password_resets_controller_test.rb` | 27 | `params: { user: { password: "password", password_confirmation: "password" } }` |
| HIGH | Hardcoded Secret | `test/controllers/plaid_items_controller_test.rb` | 16 | `OpenStruct.new(access_token: "[REDACTED]", item_id: "[REDACTED]")` |
| HIGH | Hardcoded Password | `test/controllers/registrations_controller_test.rb` | 12 | `password: "Password1!" } }` |
| HIGH | Hardcoded Password | `test/controllers/registrations_controller_test.rb` | 22 | `password: "Password1!" } }` |
| HIGH | Hardcoded Password | `test/controllers/registrations_controller_test.rb` | 27 | `password: "Password1!",` |
| HIGH | Hardcoded Password | `test/controllers/registrations_controller_test.rb` | 35 | `password: "Password1!",` |
| HIGH | Hardcoded Password | `test/controllers/api/v1/auth_controller_test.rb` | 24 | `password: "SecurePass123!",` |
| HIGH | Hardcoded Password | `test/controllers/api/v1/auth_controller_test.rb` | 63 | `password: "SecurePass123!",` |
| HIGH | Hardcoded Password | `test/controllers/api/v1/auth_controller_test.rb` | 100 | `password: "SecurePass123!",` |
| HIGH | Hardcoded Password | `test/controllers/api/v1/auth_controller_test.rb` | 115 | `password: "SecurePass123!",` |
| HIGH | Hardcoded Password | `test/controllers/api/v1/auth_controller_test.rb` | 138 | `password: "SecurePass123!",` |
| HIGH | Hardcoded Password | `test/controllers/api/v1/auth_controller_test.rb` | 163 | `password: "SecurePass123!",` |
| HIGH | Hardcoded Password | `test/controllers/api/v1/auth_controller_test.rb` | 184 | `password: "SecurePass123!",` |
| HIGH | Hardcoded Password | `test/controllers/api/v1/auth_controller_test.rb` | 311 | `password: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `test/controllers/api/v1/base_controller_test.rb` | 18 | `@plain_api_key = "base_test_#{SecureRandom.hex(8)}"` |
| HIGH | Hardcoded Secret | `test/controllers/settings/hostings_controller_test.rb` | 43 | `patch settings_hosting_url, params: { setting: { synth_api_key: "1234567890" } }` |

### Remediation Steps

1. Move all secrets to environment variables (`.env.local` or your secrets manager)
2. Rotate any credentials that have been committed to version control
3. Add `.env` and `.env.local` to `.gitignore`
4. Consider using a secrets manager (AWS Secrets Manager, HashiCorp Vault, Doppler)
5. Run `git log --all --full-history -S '<secret>'` to check if secrets exist in git history

---

*This audit was generated by [Codepliant](https://github.com/joechensmartz/codepliant). It is not a substitute for a professional security review.*
