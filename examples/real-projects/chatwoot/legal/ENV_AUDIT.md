# Environment Variable Audit

> Generated on 2026-03-16 — 90 variable(s) detected.
> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16

## Environment Variables

### API Key / Secret

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `ACTIVE_RECORD_ENCRYPTION_DETERMINISTIC_KEY` | config/application.rb | No |
| `ACTIVE_RECORD_ENCRYPTION_KEY_DERIVATION_SALT` | config/application.rb | No |
| `ACTIVE_RECORD_ENCRYPTION_PRIMARY_KEY` | config/application.rb | No |
| `AWS_ACCESS_KEY_ID` | .env.example | No |
| `AWS_SECRET_ACCESS_KEY` | .env.example | No |
| `AZURE_APP_SECRET` | .env.example | No |
| `FB_APP_SECRET` | .env.example | No |
| `FB_VERIFY_TOKEN` | .env.example | No |
| `GOOGLE_OAUTH_CLIENT_SECRET` | .env.example | No |
| `IG_VERIFY_TOKEN` | .env.example | No |
| `IP_LOOKUP_API_KEY` | config/initializers/geocoder.rb | No |
| `MAILGUN_INGRESS_SIGNING_KEY` | .env.example | No |
| `MANDRILL_INGRESS_API_KEY` | .env.example | No |
| `POSTGRES_PASSWORD` | .env.example | No |
| `RAILS_INBOUND_EMAIL_PASSWORD` | .env.example | No |
| `RAILS_MASTER_KEY` | config/environments/production.rb | No |
| `REDIS_PASSWORD` | .env.example | No |
| `SECRET_KEY_BASE` | .env.example | Yes |
| `SLACK_CLIENT_SECRET` | .env.example | No |
| `SMTP_PASSWORD` | .env.example | No |
| `STRIPE_SECRET_KEY` | .env.example | No |
| `STRIPE_WEBHOOK_SECRET` | .env.example | No |
| `TWITTER_CONSUMER_KEY` | .env.example | No |
| `TWITTER_CONSUMER_SECRET` | .env.example | No |
| `VAPID_PRIVATE_KEY` | spec/lib/vapid_service_spec.rb | No |
| `VAPID_PUBLIC_KEY` | spec/lib/vapid_service_spec.rb | No |

### Database

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `DATABASE_URL` | docker/entrypoints/helpers/pg_database_url.rb | No |
| `POSTGRES_HOST` | .env.example | Yes |
| `POSTGRES_PORT` | docker/entrypoints/helpers/pg_database_url.rb | No |
| `POSTGRES_USERNAME` | .env.example | Yes |
| `REDIS_DISABLE_CLIENT_COMMAND` | config/initializers/actioncable.rb | No |
| `REDIS_OPENSSL_VERIFY_MODE` | config/application.rb | No |
| `REDIS_SENTINEL_MASTER_NAME` | .env.example | No |
| `REDIS_SENTINELS` | .env.example | No |
| `REDIS_URL` | .env.example | Yes |

### Service Config

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `ASSET_CDN_HOST` | .env.example, config/environments/production.rb | No |
| `DD_TRACE_AGENT_URL` | config/initializers/datadog.rb | No |
| `FRONTEND_URL` | .env.example, config/environments/development.rb, config/environments/production.rb, config/environments/staging.rb, config/initializers/mailer.rb | Yes |
| `GOOGLE_OAUTH_CALLBACK_URL` | .env.example | No |
| `HELPCENTER_URL` | spec/controllers/public/api/v1/portals/articles_controller_spec.rb | No |
| `MAILER_INBOUND_EMAIL_DOMAIN` | .env.example | No |
| `SMTP_DOMAIN` | .env.example, config/initializers/mailer.rb | Yes |
| `SMTP_PORT` | .env.example | Yes |

### Other

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `ACTION_MAILBOX_SES_SNS_TOPIC` | .env.example, config/initializers/mailer.rb | No |
| `ACTIVE_STORAGE_SERVICE` | .env.example | Yes |
| `ANDROID_BUNDLE_ID` | .env.example | Yes |
| `ANDROID_SHA256_CERT_FINGERPRINT` | .env.example | Yes |
| `AWS_REGION` | .env.example | No |
| `AZURE_APP_ID` | .env.example | No |
| `BUILD_MODE` | vite.config.ts | No |
| `BUNDLE_GEMFILE` | config/boot.rb | No |
| `CODESPACES` | config/environments/development.rb | No |
| `DEV` | app/javascript/dashboard/components/Modal.vue, app/javascript/dashboard/components/widgets/forms/Input.vue | No |
| `DIRECT_UPLOADS_ENABLED` | .env.example | No |
| `DISABLE_MINI_PROFILER` | config/initializers/rack_profiler.rb | No |
| `DISABLE_SENTRY_PII` | config/initializers/sentry.rb | No |
| `DISABLE_TELEMETRY` | lib/chatwoot_hub.rb | No |
| `ENABLE_ACCOUNT_SIGNUP` | .env.example | Yes |
| `ENABLE_INBOX_EVENTS` | app/models/inbox.rb | No |
| `ENABLE_PUSH_RELAY_SERVER` | .env.example | Yes |
| `ENABLE_SENTRY_TRANSACTIONS` | config/initializers/sentry.rb | No |
| `FB_APP_ID` | .env.example | No |
| `FORCE_SSL` | .env.example | Yes |
| `GOOGLE_OAUTH_CLIENT_ID` | .env.example | No |
| `IOS_APP_ID` | .env.example | Yes |
| `LETTER_OPENER` | config/initializers/mailer.rb | No |
| `LOG_LEVEL` | .env.example | Yes |
| `LOG_SIZE` | .env.example | Yes |
| `MAILER_SENDER_EMAIL` | .env.example | Yes |
| `RAILS_ENV` | .env.example, spec/rails_helper.rb, spec/test_helper.rb | Yes |
| `RAILS_INBOUND_EMAIL_SERVICE` | .env.example | No |
| `RAILS_LOG_TO_STDOUT` | .env.example | Yes |
| `RAILS_MAX_THREADS` | .env.example | Yes |
| `RAILS_SERVE_STATIC_FILES` | config/environments/staging.rb | No |
| `S3_BUCKET_NAME` | .env.example | No |
| `SENTRY_DSN` | config/initializers/sentry.rb, lib/chatwoot_exception_tracker.rb | No |
| `SLACK_CLIENT_ID` | .env.example | No |
| `SMTP_ADDRESS` | .env.example, config/initializers/mailer.rb | No |
| `SMTP_AUTHENTICATION` | .env.example, config/initializers/mailer.rb | No |
| `SMTP_ENABLE_STARTTLS_AUTO` | .env.example | Yes |
| `SMTP_OPEN_TIMEOUT` | config/initializers/mailer.rb | No |
| `SMTP_OPENSSL_VERIFY_MODE` | .env.example, config/initializers/mailer.rb | Yes |
| `SMTP_READ_TIMEOUT` | config/initializers/mailer.rb | No |
| `SMTP_SSL` | config/initializers/mailer.rb | No |
| `SMTP_TLS` | config/initializers/mailer.rb | No |
| `SMTP_USERNAME` | .env.example | No |
| `TEST` | vite.config.ts | No |
| `TWITTER_APP_ID` | .env.example | No |
| `TWITTER_ENVIRONMENT` | .env.example | No |
| `TZ` | app/javascript/shared/helpers/specs/timeHelper.spec.js | No |

## Missing Documentation

The following variables are used but not listed in `.env.example`:

- `ACTIVE_RECORD_ENCRYPTION_DETERMINISTIC_KEY`
- `ACTIVE_RECORD_ENCRYPTION_KEY_DERIVATION_SALT`
- `ACTIVE_RECORD_ENCRYPTION_PRIMARY_KEY`
- `BUILD_MODE`
- `BUNDLE_GEMFILE`
- `CODESPACES`
- `DATABASE_URL`
- `DD_TRACE_AGENT_URL`
- `DEV`
- `DISABLE_MINI_PROFILER`
- `DISABLE_SENTRY_PII`
- `DISABLE_TELEMETRY`
- `ENABLE_INBOX_EVENTS`
- `ENABLE_SENTRY_TRANSACTIONS`
- `HELPCENTER_URL`
- `IP_LOOKUP_API_KEY`
- `LETTER_OPENER`
- `POSTGRES_PORT`
- `RAILS_MASTER_KEY`
- `RAILS_SERVE_STATIC_FILES`
- `REDIS_DISABLE_CLIENT_COMMAND`
- `REDIS_OPENSSL_VERIFY_MODE`
- `SENTRY_DSN`
- `SMTP_OPEN_TIMEOUT`
- `SMTP_READ_TIMEOUT`
- `SMTP_SSL`
- `SMTP_TLS`
- `TEST`
- `TZ`
- `VAPID_PRIVATE_KEY`
- `VAPID_PUBLIC_KEY`

## Hardcoded Secrets Detected

> **79 potential secret(s)** found in source code. These should be moved to environment variables.

- **[CRITICAL]** 78 hardcoded secret(s) detected in source code: Hardcoded Password, Hardcoded Secret, Hardcoded Bearer Token. Move these to environment variables immediately.
- **[WARNING]** 1 potentially sensitive value(s) found in source code. Review and consider moving to environment variables.
- **[CRITICAL]** Hardcoded secrets can be extracted from version control history even after removal. Rotate any exposed credentials immediately.

| Severity | Type | File | Line | Snippet |
|----------|------|------|------|---------|
| HIGH | Hardcoded Password | `app/builders/agent_builder.rb` | 32 | `temp_password = "1!aA#{SecureRandom.alphanumeric(12)}"` |
| HIGH | Hardcoded Secret | `app/javascript/dashboard/store/modules/specs/agentBots/fixtures.js` | 11 | `access_token: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `app/javascript/dashboard/store/modules/specs/agentBots/fixtures.js` | 24 | `access_token: "[REDACTED]",` |
| HIGH | Hardcoded Password | `db/seeds.rb` | 28 | `user = User.new(name: 'John', email: 'john@acme.inc', password: 'Password1!', type: 'SuperAdmin')` |
| HIGH | Hardcoded Password | `lib/seeders/account_seeder.rb` | 74 | `user_record = User.create_with(name: user['name'], password: 'Password1!.').find_or_create_by!(email: user['email'].to_s...` |
| HIGH | Hardcoded Password | `lib/seeders/reports/report_data_seeder.rb` | 111 | `password: 'Password1!.',` |
| HIGH | Hardcoded Secret | `spec/builders/messages/instagram/message_builder_spec.rb` | 23 | `instagram_channel.update(access_token: "[REDACTED]")` |
| HIGH | Hardcoded Secret | `spec/builders/messages/instagram/message_builder_spec.rb` | 192 | `instagram_channel.update(access_token: "[REDACTED]")` |
| HIGH | Hardcoded Password | `spec/controllers/api/v1/accounts_controller_spec.rb` | 21 | `params = { account_name: 'test', email: email, user: nil, locale: nil, user_full_name: user_full_name, password: 'Passwo...` |
| HIGH | Hardcoded Password | `spec/controllers/api/v1/accounts_controller_spec.rb` | 41 | `params = { account_name: 'test', email: email, user: nil, locale: nil, user_full_name: user_full_name, password: 'Passwo...` |
| HIGH | Hardcoded Password | `spec/controllers/api/v1/accounts_controller_spec.rb` | 97 | `params = { account_name: 'test', email: email, user_full_name: user_full_name, password: 'Password1!' }` |
| HIGH | Hardcoded Password | `spec/controllers/api/v1/accounts_controller_spec.rb` | 109 | `params = { account_name: 'test', email: email, user_full_name: user_full_name, password: 'Password1!' }` |
| HIGH | Hardcoded Password | `spec/controllers/api/v1/profiles_controller_spec.rb` | 45 | `let(:agent) { create(:user, password: 'Test123!', account: account, role: :agent) }` |
| HIGH | Hardcoded Password | `spec/controllers/api/v1/profiles_controller_spec.rb` | 92 | `params: { profile: { current_password: 'Test123!', password: 'Test1234!', password_confirmation: 'Test1234!' } },` |
| HIGH | Hardcoded Password | `spec/controllers/api/v1/profiles_controller_spec.rb` | 105 | `params: { profile: { current_password: 'Test123!', password: 'Test1234!', password_confirmation: 'Test1234!' } },` |
| HIGH | Hardcoded Password | `spec/controllers/api/v1/profiles_controller_spec.rb` | 160 | `let(:agent) { create(:user, password: 'Test123!', account: account, role: :agent) }` |
| HIGH | Hardcoded Password | `spec/controllers/api/v1/profiles_controller_spec.rb` | 178 | `let(:agent) { create(:user, password: 'Test123!', account: account, role: :agent) }` |
| HIGH | Hardcoded Password | `spec/controllers/api/v1/profiles_controller_spec.rb` | 215 | `let(:agent) { create(:user, password: 'Test123!', account: account, role: :agent) }` |
| HIGH | Hardcoded Password | `spec/controllers/api/v1/profiles_controller_spec.rb` | 238 | `let(:agent) { create(:user, password: 'Test123!', account: account, role: :agent) }` |
| HIGH | Hardcoded Password | `spec/controllers/api/v1/profiles_controller_spec.rb` | 263 | `let(:agent) { create(:user, password: 'Test123!', account: account, role: :agent) }` |
| HIGH | Hardcoded Password | `spec/controllers/api/v1/profiles_controller_spec.rb` | 287 | `create(:user, password: 'Test123!', email: 'test-unconfirmed@email.com', account: account, role: :agent,` |
| HIGH | Hardcoded Secret | `spec/controllers/api/v1/accounts/integrations/apps_controller_spec.rb` | 57 | `with_modified_env SLACK_CLIENT_ID: 'client_id', SLACK_CLIENT_SECRET: "[REDACTED]" do` |
| HIGH | Hardcoded Secret | `spec/controllers/api/v1/accounts/tiktok/authorizations_controller_spec.rb` | 25 | `with_modified_env TIKTOK_APP_ID: "[REDACTED]", TIKTOK_APP_SECRET: "[REDACTED]" do` |
| HIGH | Hardcoded Secret | `spec/controllers/api/v1/accounts/tiktok/authorizations_controller_spec.rb` | 36 | `with_modified_env TIKTOK_APP_ID: "[REDACTED]", TIKTOK_APP_SECRET: "[REDACTED]" do` |
| HIGH | Hardcoded Password | `spec/controllers/api/v2/accounts_controller_spec.rb` | 20 | `params = { email: email, user: nil, locale: nil, password: 'Password1!' }` |
| HIGH | Hardcoded Password | `spec/controllers/api/v2/accounts_controller_spec.rb` | 37 | `params = { email: email, user: nil, locale: nil, password: 'Password1!' }` |
| HIGH | Hardcoded Password | `spec/controllers/api/v2/accounts_controller_spec.rb` | 54 | `params = { email: email, user: nil, password: 'Password1!', locale: nil, h_captcha_client_response: '123' }` |
| HIGH | Hardcoded Password | `spec/controllers/api/v2/accounts_controller_spec.rb` | 110 | `params = { email: email, password: 'Password1!' }` |
| HIGH | Hardcoded Password | `spec/controllers/api/v2/accounts_controller_spec.rb` | 129 | `params = { email: email, user: nil, password: 'Password1!', locale: nil }` |
| HIGH | Hardcoded Password | `spec/controllers/devise/session_controller_spec.rb` | 20 | `let!(:user) { create(:user, password: 'Password1!', account: account) }` |
| HIGH | Hardcoded Password | `spec/controllers/devise/session_controller_spec.rb` | 21 | `let!(:user_with_new_pwd) { create(:user, password: 'Password1!.><?', account: account) }` |
| HIGH | Hardcoded Password | `spec/controllers/devise/session_controller_spec.rb` | 24 | `params = { email: user.email, password: 'Password1!' }` |
| HIGH | Hardcoded Password | `spec/controllers/devise/session_controller_spec.rb` | 35 | `params = { email: user_with_new_pwd.email, password: 'Password1!.><?' }` |
| HIGH | Hardcoded Password | `spec/controllers/devise/session_controller_spec.rb` | 46 | `params = { email: user.email, password: 'Password1!' }` |
| HIGH | Hardcoded Password | `spec/controllers/devise/session_controller_spec.rb` | 58 | `let!(:user) { create(:user, password: 'Password1!', account: account) }` |
| HIGH | Hardcoded Password | `spec/controllers/devise/session_controller_spec.rb` | 72 | `let!(:user) { create(:user, password: 'Password1!', account: account) }` |
| HIGH | Hardcoded Password | `spec/controllers/devise_overrides/sessions_controller_spec.rb` | 11 | `let(:user) { create(:user, password: 'Test@123456') }` |
| HIGH | Hardcoded Password | `spec/controllers/devise_overrides/sessions_controller_spec.rb` | 15 | `post :create, params: { email: user.email, password: 'Test@123456' }` |
| HIGH | Hardcoded Password | `spec/controllers/devise_overrides/sessions_controller_spec.rb` | 35 | `post :create, params: { email: user.email, password: 'Test@123456' }` |
| HIGH | Hardcoded Password | `spec/controllers/devise_overrides/sessions_controller_spec.rb` | 44 | `post :create, params: { email: user.email, password: 'Test@123456' }` |
| HIGH | Hardcoded Secret | `spec/controllers/instagram/callbacks_controller_spec.rb` | 58 | `existing_channel = create(:channel_instagram, account: account, instagram_id: '12345', access_token: 'old_token')` |
| HIGH | Hardcoded Password | `spec/controllers/platform/api/v1/users_controller_spec.rb` | 159 | `email: 'test@test.com', password: 'Password1!',` |
| HIGH | Hardcoded Password | `spec/controllers/platform/api/v1/users_controller_spec.rb` | 185 | `post "[REDACTED]", params: { name: 'test', email: 'test@test.com', password: 'Password1!' },` |
| HIGH | Hardcoded Password | `spec/controllers/super_admin/users_controller_spec.rb` | 21 | `password: 'Password1!',` |
| HIGH | Hardcoded Password | `spec/controllers/super_admin/users_controller_spec.rb` | 31 | `password: 'Password1!',` |
| HIGH | Hardcoded Password | `spec/controllers/super_admin/users_controller_spec.rb` | 40 | `password: 'Password1!',` |
| HIGH | Hardcoded Secret | `spec/controllers/tiktok/callbacks_controller_spec.rb` | 81 | `access_token: "[REDACTED]",` |
| HIGH | Hardcoded Password | `spec/enterprise/controllers/enterprise/api/v2/accounts_controller_spec.rb` | 35 | `params = { email: email, user: nil, locale: nil, password: 'Password1!' }` |
| HIGH | Hardcoded Password | `spec/enterprise/controllers/enterprise/api/v2/accounts_controller_spec.rb` | 58 | `params = { email: email, user: nil, locale: nil, password: 'Password1!' }` |
| HIGH | Hardcoded Password | `spec/enterprise/controllers/enterprise/api/v2/accounts_controller_spec.rb` | 74 | `params = { email: email, user: nil, locale: nil, password: 'Password1!' }` |
| HIGH | Hardcoded Password | `spec/enterprise/controllers/enterprise/devise_overrides/session_controller_spec.rb` | 5 | `let!(:user) { create(:user, password: 'Password1!', account: account) }` |
| HIGH | Hardcoded Password | `spec/enterprise/controllers/enterprise/devise_overrides/session_controller_spec.rb` | 18 | `params = { email: saml_user.email, password: 'Password1!' }` |
| HIGH | Hardcoded Password | `spec/enterprise/controllers/enterprise/devise_overrides/session_controller_spec.rb` | 30 | `params = { email: saml_user.email, sso_auth_token: valid_token, password: 'Password1!' }` |
| HIGH | Hardcoded Password | `spec/enterprise/controllers/enterprise/devise_overrides/session_controller_spec.rb` | 43 | `params = { email: user.email, password: 'Password1!' }` |
| HIGH | Hardcoded Password | `spec/enterprise/controllers/enterprise/devise_overrides/session_controller_spec.rb` | 73 | `params = { email: '', password: 'Password1!' }` |
| HIGH | Hardcoded Bearer Token | `spec/enterprise/models/captain/custom_tool_spec.rb` | 259 | `expect(tool.build_auth_headers).to eq({ "[REDACTED]" => 'Bearer test_bearer_token_123' })` |
| HIGH | Hardcoded Secret | `spec/enterprise/models/channel/voice_spec.rb` | 59 | `api_key_secret: 'test_secret',` |
| MEDIUM | Twilio Account SID | `spec/enterprise/services/twilio/voice_webhook_setup_service_spec.rb` | 6 | `let(:account_sid) { "[REDACTED]" }` |
| HIGH | Hardcoded Password | `spec/factories/captain/custom_tool.rb` | 25 | `auth_config { { username: 'test_user', password: 'test_pass' } }` |
| HIGH | Hardcoded Secret | `spec/jobs/webhooks/instagram_events_job_spec.rb` | 228 | `instagram_channel.update(access_token: "[REDACTED]")` |
| HIGH | Hardcoded Password | `spec/lib/redis/config_spec.rb` | 31 | `{ host: 'sentinel_1', port: '1234', password: "[REDACTED]" },` |
| HIGH | Hardcoded Password | `spec/lib/redis/config_spec.rb` | 32 | `{ host: 'sentinel_2', port: '4321', password: "[REDACTED]" },` |
| HIGH | Hardcoded Password | `spec/lib/redis/config_spec.rb` | 33 | `{ host: 'sentinel_3', port: '26379', password: "[REDACTED]" }` |
| HIGH | Hardcoded Secret | `spec/lib/webhooks/trigger_spec.rb` | 281 | `trigger.execute(url, payload, webhook_type, secret: 'mysecret', delivery_id: 'abc-123')` |
| HIGH | Hardcoded Password | `spec/listeners/automation_rule_listener_old_spec.rb` | 741 | `smtp_password: 'password', smtp_domain: "[REDACTED]", account: new_account)` |
| HIGH | Hardcoded Password | `spec/mailers/conversation_reply_mailer_spec.rb` | 455 | `smtp_password: 'password', smtp_domain: "[REDACTED]", account: account)` |
| HIGH | Hardcoded Secret | `spec/mailers/conversation_reply_mailer_spec.rb` | 567 | `imap_enabled: true, account: account, provider: 'microsoft', provider_config: { access_token: "[REDACTED]" })` |
| HIGH | Hardcoded Secret | `spec/mailers/conversation_reply_mailer_spec.rb` | 583 | `imap_enabled: true, account: account, provider: 'google', provider_config: { access_token: "[REDACTED]" })` |
| HIGH | Hardcoded Password | `spec/models/application_record_external_credentials_encryption_spec.rb` | 85 | `legacy_record.update!(smtp_password: "[REDACTED]")` |
| HIGH | Hardcoded Password | `spec/models/user_spec.rb` | 119 | `let(:user) { create(:user, password: 'Test@123456') }` |
| HIGH | Hardcoded Secret | `spec/models/integrations/app_spec.rb` | 48 | `with_modified_env SLACK_CLIENT_SECRET: "[REDACTED]" do` |
| HIGH | Hardcoded Password | `spec/requests/api/v1/profile/mfa_controller_spec.rb` | 10 | `let(:user) { create(:user, account: account, password: 'Test@123456') }` |
| HIGH | Hardcoded Password | `spec/requests/api/v1/profile/mfa_controller_spec.rb` | 166 | `params: { password: 'Test@123456', otp_code: otp_code },` |
| HIGH | Hardcoded Password | `spec/requests/api/v1/profile/mfa_controller_spec.rb` | 186 | `params: { password: "[REDACTED]", otp_code: otp_code },` |
| HIGH | Hardcoded Password | `spec/requests/api/v1/profile/mfa_controller_spec.rb` | 199 | `params: { password: 'Test@123456', otp_code: '000000' },` |
| HIGH | Hardcoded Password | `spec/requests/api/v1/profile/mfa_controller_spec.rb` | 213 | `params: { password: 'Test@123456', otp_code: '123456' },` |
| HIGH | Hardcoded Secret | `spec/services/tiktok/token_service_spec.rb` | 7 | `access_token: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `spec/services/tiktok/token_service_spec.rb` | 31 | `access_token: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `spec/services/whatsapp/facebook_api_client_spec.rb` | 25 | `body: { access_token: 'new_token' }.to_json,` |

### Remediation Steps

1. Move all secrets to environment variables (`.env.local` or your secrets manager)
2. Rotate any credentials that have been committed to version control
3. Add `.env` and `.env.local` to `.gitignore`
4. Consider using a secrets manager (AWS Secrets Manager, HashiCorp Vault, Doppler)
5. Run `git log --all --full-history -S '<secret>'` to check if secrets exist in git history

---

*This audit was generated by [Codepliant](https://github.com/joechensmartz/codepliant). It is not a substitute for a professional security review.*
