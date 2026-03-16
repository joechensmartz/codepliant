# Environment Variable Audit

> Generated on 2026-03-16 — 160 variable(s) detected.
> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16

## Security Recommendations

- **[WARNING]** No .env.example file found. Create one to document required environment variables for new contributors.

## Environment Variables

### API Key / Secret

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `ACTIVE_RECORD_ENCRYPTION_DETERMINISTIC_KEY` | .env.development, .env.test | Yes |
| `ACTIVE_RECORD_ENCRYPTION_KEY_DERIVATION_SALT` | .env.development, .env.test | Yes |
| `ACTIVE_RECORD_ENCRYPTION_PRIMARY_KEY` | .env.development, .env.test | Yes |
| `AWS_ACCESS_KEY_ID` | config/initializers/paperclip.rb | No |
| `AWS_SECRET_ACCESS_KEY` | config/initializers/paperclip.rb | No |
| `AZURE_STORAGE_ACCESS_KEY` | config/initializers/paperclip.rb | No |
| `CAS_EMAIL_KEY` | config/initializers/3_omniauth.rb | No |
| `CAS_FIRST_NAME_KEY` | config/initializers/3_omniauth.rb | No |
| `CAS_IMAGE_KEY` | config/initializers/3_omniauth.rb | No |
| `CAS_LAST_NAME_KEY` | config/initializers/3_omniauth.rb | No |
| `CAS_LOCATION_KEY` | config/initializers/3_omniauth.rb | No |
| `CAS_NAME_KEY` | config/initializers/3_omniauth.rb | No |
| `CAS_NICKNAME_KEY` | config/initializers/3_omniauth.rb | No |
| `CAS_PHONE_KEY` | config/initializers/3_omniauth.rb | No |
| `CAS_UID_KEY` | config/initializers/3_omniauth.rb | No |
| `MIGRATION_IGNORE_INVALID_OTP_SECRET` | db/post_migrate/20240307180905_migrate_devise_two_factor_secrets.rb | No |
| `OIDC_CLIENT_SECRET` | config/initializers/3_omniauth.rb | No |
| `OIDC_SEND_SCOPE_TO_TOKEN_ENDPOINT` | config/initializers/3_omniauth.rb | No |
| `OIDC_TOKEN_ENDPOINT` | config/initializers/3_omniauth.rb | No |
| `SAML_PRIVATE_KEY` | config/initializers/3_omniauth.rb | No |
| `SECRET_KEY_BASE_DUMMY` | config/initializers/active_record_encryption.rb, db/post_migrate/20240307180905_migrate_devise_two_factor_secrets.rb | No |
| `SWIFT_PASSWORD` | config/initializers/paperclip.rb | No |
| `SWIFT_TEMP_URL_KEY` | config/initializers/paperclip.rb | No |

### Database

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `REDIS_DRIVER` | lib/mastodon/redis_configuration.rb | No |
| `REDIS_NAMESPACE` | config/initializers/deprecations.rb | No |

### Service Config

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `AZURE_ALIAS_HOST` | config/initializers/paperclip.rb | No |
| `CAS_CALLBACK_URL` | config/initializers/3_omniauth.rb | No |
| `CAS_HOST` | config/initializers/3_omniauth.rb | No |
| `CAS_LOGIN_URL` | config/initializers/3_omniauth.rb | No |
| `CAS_LOGOUT_URL` | config/initializers/3_omniauth.rb | No |
| `CAS_PORT` | config/initializers/3_omniauth.rb | No |
| `CAS_URL` | config/initializers/3_omniauth.rb | No |
| `CAS_VALIDATE_URL` | config/initializers/3_omniauth.rb | No |
| `CDN_HOST` | config/environments/development.rb, config/environments/production.rb | No |
| `EMAIL_DOMAIN_LISTS_APPLY_AFTER_CONFIRMATION` | app/models/user.rb | No |
| `LOCAL_DOMAIN` | .env.test, app/helpers/self_destruct_helper.rb, db/seeds/04_admin.rb | Yes |
| `MASTODON_PROMETHEUS_EXPORTER_ENABLED` | config/puma.rb, config/initializers/prometheus_exporter.rb, config/initializers/sidekiq.rb | No |
| `MASTODON_PROMETHEUS_EXPORTER_LOCAL` | config/puma.rb, config/initializers/prometheus_exporter.rb, config/initializers/sidekiq.rb | No |
| `MASTODON_PROMETHEUS_EXPORTER_SIDEKIQ_DETAILED_METRICS` | config/initializers/sidekiq.rb | No |
| `MASTODON_PROMETHEUS_EXPORTER_WEB_DETAILED_METRICS` | config/initializers/prometheus_exporter.rb | No |
| `OIDC_AUTH_ENDPOINT` | config/initializers/3_omniauth.rb | No |
| `OIDC_END_SESSION_ENDPOINT` | config/initializers/3_omniauth.rb | No |
| `OIDC_HOST` | config/initializers/3_omniauth.rb | No |
| `OIDC_PORT` | config/initializers/3_omniauth.rb | No |
| `OIDC_USER_INFO_ENDPOINT` | config/initializers/3_omniauth.rb | No |
| `PORT` | streaming/index.js | No |
| `REPLICA_DB_HOST` | app/helpers/database_helper.rb | No |
| `S3_ALIAS_HOST` | config/initializers/paperclip.rb | No |
| `S3_CLOUDFRONT_HOST` | config/initializers/paperclip.rb | No |
| `S3_ENDPOINT` | config/initializers/paperclip.rb | No |
| `SAML_ACS_URL` | config/initializers/3_omniauth.rb | No |
| `SAML_IDP_SSO_TARGET_URL` | config/initializers/3_omniauth.rb | No |
| `STREAMING_API_BASE_URL` | spec/rails_helper.rb | No |
| `SWIFT_AUTH_URL` | config/initializers/paperclip.rb | No |
| `SWIFT_OBJECT_URL` | config/initializers/paperclip.rb | No |

### Other

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `ALLOW_ACCESS_TO_HIDDEN_SERVICE` | config/initializers/http_client_proxy.rb | No |
| `ALLOW_UNSAFE_AUTH_PROVIDER_REATTACH` | app/models/concerns/user/omniauthable.rb | No |
| `ALLOWED_PRIVATE_ADDRESSES` | config/initializers/allowed_private_addresses.rb | No |
| `ANALYZE_BUNDLE_SIZE` | vite.config.mts | No |
| `AZURE_CONTAINER_NAME` | config/initializers/paperclip.rb | No |
| `AZURE_ENABLED` | config/initializers/paperclip.rb | No |
| `AZURE_STORAGE_ACCOUNT` | config/initializers/paperclip.rb | No |
| `BACKTRACE` | config/initializers/backtrace_silencers.rb, lib/mastodon/sidekiq_middleware.rb | No |
| `BIND` | streaming/index.js | No |
| `BUNDLE_GEMFILE` | config/boot.rb | No |
| `CAS_CA_PATH` | config/initializers/3_omniauth.rb | No |
| `CAS_DISABLE_SSL_VERIFICATION` | config/initializers/3_omniauth.rb | No |
| `CAS_SECURITY_ASSUME_EMAIL_IS_VERIFIED` | config/initializers/3_omniauth.rb | No |
| `CAS_SSL` | config/initializers/3_omniauth.rb | No |
| `CAS_UID_FIELD` | config/initializers/3_omniauth.rb | No |
| `CI` | vite.config.mts, config/environments/test.rb, spec/rails_helper.rb, spec/support/capybara.rb | No |
| `DEBUG_STREAMING_SERVER` | spec/support/streaming_server_manager.rb | No |
| `DEFAULT_LOCALE` | config/initializers/i18n.rb | No |
| `DEV` | app/javascript/mastodon/utils/environment.ts | No |
| `DISABLE_AUTOMATIC_SWITCHING_TO_APPROVED_REGISTRATIONS` | app/workers/scheduler/auto_close_registrations_scheduler.rb | No |
| `DISABLE_FOLLOWERS_SYNCHRONIZATION` | app/controllers/activitypub/inboxes_controller.rb, app/workers/activitypub/delivery_worker.rb | No |
| `DISABLE_FORGERY_REQUEST_PROTECTION` | config/environments/development.rb | No |
| `DISALLOW_UNAUTHENTICATED_API_ACCESS` | app/controllers/api/base_controller.rb, app/serializers/webfinger_serializer.rb | No |
| `ENABLE_SIDEKIQ_UNIQUE_JOBS_UI` | config/routes.rb | No |
| `ES_ENABLED` | config/initializers/chewy.rb, config/initializers/deprecations.rb | No |
| `ES_PREFIX` | config/initializers/deprecations.rb | No |
| `ES_PRESET` | config/initializers/chewy.rb, lib/chewy/index_extensions.rb | No |
| `FORCE_DEFAULT_LOCALE` | app/controllers/concerns/localized.rb | No |
| `GITHUB_ACTIONS` | spec/spec_helper.rb | No |
| `GITHUB_RSPEC` | spec/spec_helper.rb | No |
| `HEROKU` | config/environments/development.rb | No |
| `LDAP_ENABLED` | config/initializers/devise.rb | No |
| `LDAP_TLS_NO_VERIFY` | config/initializers/devise.rb | No |
| `LDAP_UID_CONVERSION_ENABLED` | config/initializers/devise.rb | No |
| `LOCAL_HTTPS` | .env.test, config/initializers/1_hosts.rb | Yes |
| `MAX_SESSION_ACTIVATIONS` | config/initializers/session_activations.rb | No |
| `MAX_THREADS` | app/lib/redis_connection.rb, lib/mastodon/redis_configuration.rb | No |
| `NODE_ENV` | .env.test, app/javascript/mastodon/utils/environment.ts, streaming/index.js | Yes |
| `OIDC_CLIENT_AUTH_METHOD` | config/initializers/3_omniauth.rb | No |
| `OIDC_CLIENT_ID` | config/initializers/3_omniauth.rb | No |
| `OIDC_DISCOVERY` | config/initializers/3_omniauth.rb | No |
| `OIDC_DISPLAY` | config/initializers/3_omniauth.rb | No |
| `OIDC_HTTP_SCHEME` | config/initializers/3_omniauth.rb | No |
| `OIDC_IDP_LOGOUT_REDIRECT_URI` | config/initializers/3_omniauth.rb | No |
| `OIDC_ISSUER` | config/initializers/3_omniauth.rb | No |
| `OIDC_JWKS_URI` | config/initializers/3_omniauth.rb | No |
| `OIDC_PROMPT` | config/initializers/3_omniauth.rb | No |
| `OIDC_REDIRECT_URI` | config/initializers/3_omniauth.rb | No |
| `OIDC_RESPONSE_MODE` | config/initializers/3_omniauth.rb | No |
| `OIDC_RESPONSE_TYPE` | config/initializers/3_omniauth.rb | No |
| `OIDC_SCOPE` | config/initializers/3_omniauth.rb, spec/requests/omniauth_callbacks_spec.rb | No |
| `OIDC_SECURITY_ASSUME_EMAIL_IS_VERIFIED` | config/initializers/3_omniauth.rb | No |
| `OIDC_SEND_NONCE` | config/initializers/3_omniauth.rb | No |
| `OIDC_UID_FIELD` | config/initializers/3_omniauth.rb | No |
| `OIDC_USE_PKCE` | config/initializers/3_omniauth.rb | No |
| `OMNIAUTH_ONLY` | app/controllers/application_controller.rb, app/controllers/concerns/web_app_controller_concern.rb, app/helpers/application_helper.rb, app/helpers/registration_helper.rb, app/lib/content_security_policy.rb, app/serializers/initial_state_serializer.rb | No |
| `ONE_CLICK_SSO_LOGIN` | app/controllers/concerns/web_app_controller_concern.rb, app/lib/content_security_policy.rb, app/serializers/initial_state_serializer.rb | No |
| `PAM_ENABLED` | app/models/concerns/user/pam_authenticable.rb, config/application.rb, config/environments/test.rb, config/initializers/devise.rb, spec/controllers/auth/sessions_controller_spec.rb | No |
| `PROD` | app/javascript/mastodon/utils/environment.ts | No |
| `PROXY_PROTO_V1` | config/puma.rb | No |
| `RAILS_ENV` | spec/rails_helper.rb | No |
| `RAILS_SERVE_STATIC_FILES` | config/application.rb | No |
| `REMOTE_DEV` | config/environments/development.rb | No |
| `REPLICA_DB_NAME` | app/helpers/database_helper.rb | No |
| `S3_BUCKET` | config/initializers/paperclip.rb | No |
| `S3_ENABLE_CHECKSUM_MODE` | config/initializers/paperclip.rb | No |
| `S3_ENABLED` | config/initializers/1_hosts.rb, config/initializers/paperclip.rb | No |
| `S3_FORCE_SINGLE_REQUEST` | config/initializers/paperclip.rb | No |
| `S3_OVERRIDE_PATH_STYLE` | config/initializers/paperclip.rb | No |
| `S3_PERMISSION` | app/models/backup.rb, app/services/update_media_attachments_permissions_service.rb, config/initializers/paperclip.rb | No |
| `S3_STORAGE_CLASS` | config/initializers/paperclip.rb | No |
| `SAML_ALLOWED_CLOCK_DRIFT` | config/initializers/3_omniauth.rb | No |
| `SAML_ATTRIBUTES_STATEMENTS_EMAIL` | config/initializers/3_omniauth.rb | No |
| `SAML_ATTRIBUTES_STATEMENTS_FIRST_NAME` | config/initializers/3_omniauth.rb | No |
| `SAML_ATTRIBUTES_STATEMENTS_FULL_NAME` | config/initializers/3_omniauth.rb | No |
| `SAML_ATTRIBUTES_STATEMENTS_LAST_NAME` | config/initializers/3_omniauth.rb | No |
| `SAML_ATTRIBUTES_STATEMENTS_UID` | config/initializers/3_omniauth.rb | No |
| `SAML_ATTRIBUTES_STATEMENTS_VERIFIED` | config/initializers/3_omniauth.rb | No |
| `SAML_ATTRIBUTES_STATEMENTS_VERIFIED_EMAIL` | config/initializers/3_omniauth.rb | No |
| `SAML_CERT` | config/initializers/3_omniauth.rb | No |
| `SAML_IDP_CERT` | config/initializers/3_omniauth.rb | No |
| `SAML_IDP_CERT_FINGERPRINT` | config/initializers/3_omniauth.rb | No |
| `SAML_IDP_CERT_FINGERPRINT_VALIDATOR` | config/initializers/3_omniauth.rb | No |
| `SAML_IDP_SSO_TARGET_PARAMS` | config/initializers/3_omniauth.rb | No |
| `SAML_ISSUER` | config/initializers/3_omniauth.rb | No |
| `SAML_NAME_IDENTIFIER_FORMAT` | config/initializers/3_omniauth.rb | No |
| `SAML_SECURITY_ASSUME_EMAIL_IS_VERIFIED` | config/initializers/3_omniauth.rb | No |
| `SAML_SECURITY_WANT_ASSERTION_ENCRYPTED` | config/initializers/3_omniauth.rb | No |
| `SAML_SECURITY_WANT_ASSERTION_SIGNED` | config/initializers/3_omniauth.rb | No |
| `SAML_UID_ATTRIBUTE` | config/initializers/3_omniauth.rb | No |
| `SENDFILE_HEADER` | config/environments/production.rb | No |
| `SINGLE_USER_MODE` | config/initializers/single_user_mode.rb | No |
| `SKIP_POST_DEPLOYMENT_MIGRATIONS` | lib/mastodon/database.rb | No |
| `SMTP_FROM_ADDRESS` | config/initializers/devise.rb | No |
| `SOCKET` | config/puma.rb, streaming/index.js | No |
| `SWIFT_CONTAINER` | config/initializers/paperclip.rb | No |
| `SWIFT_ENABLED` | config/initializers/1_hosts.rb, config/initializers/fog_connection_cache.rb, config/initializers/paperclip.rb | No |
| `SWIFT_PROJECT_ID` | config/initializers/paperclip.rb | No |
| `SWIFT_REGION` | config/initializers/paperclip.rb | No |
| `SWIFT_TENANT` | config/initializers/paperclip.rb | No |
| `SWIFT_USERNAME` | config/initializers/paperclip.rb | No |
| `TRUSTED_PROXY_IP` | config/environments/production.rb, streaming/index.js | No |
| `USER` | lib/mastodon/migration_helpers.rb | No |
| `VAGRANT` | config/environments/development.rb | No |
| `VIPS_BLOCK_UNTRUSTED` | config/initializers/vips.rb | No |

## Missing Documentation

The following variables are used but not listed in `.env.example`:

- `ACTIVE_RECORD_ENCRYPTION_DETERMINISTIC_KEY`
- `ACTIVE_RECORD_ENCRYPTION_KEY_DERIVATION_SALT`
- `ACTIVE_RECORD_ENCRYPTION_PRIMARY_KEY`
- `ALLOW_ACCESS_TO_HIDDEN_SERVICE`
- `ALLOW_UNSAFE_AUTH_PROVIDER_REATTACH`
- `ALLOWED_PRIVATE_ADDRESSES`
- `ANALYZE_BUNDLE_SIZE`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AZURE_ALIAS_HOST`
- `AZURE_CONTAINER_NAME`
- `AZURE_ENABLED`
- `AZURE_STORAGE_ACCESS_KEY`
- `AZURE_STORAGE_ACCOUNT`
- `BACKTRACE`
- `BIND`
- `BUNDLE_GEMFILE`
- `CAS_CA_PATH`
- `CAS_CALLBACK_URL`
- `CAS_DISABLE_SSL_VERIFICATION`
- `CAS_EMAIL_KEY`
- `CAS_FIRST_NAME_KEY`
- `CAS_HOST`
- `CAS_IMAGE_KEY`
- `CAS_LAST_NAME_KEY`
- `CAS_LOCATION_KEY`
- `CAS_LOGIN_URL`
- `CAS_LOGOUT_URL`
- `CAS_NAME_KEY`
- `CAS_NICKNAME_KEY`
- `CAS_PHONE_KEY`
- `CAS_PORT`
- `CAS_SECURITY_ASSUME_EMAIL_IS_VERIFIED`
- `CAS_SSL`
- `CAS_UID_FIELD`
- `CAS_UID_KEY`
- `CAS_URL`
- `CAS_VALIDATE_URL`
- `CDN_HOST`
- `CI`
- `DEBUG_STREAMING_SERVER`
- `DEFAULT_LOCALE`
- `DEV`
- `DISABLE_AUTOMATIC_SWITCHING_TO_APPROVED_REGISTRATIONS`
- `DISABLE_FOLLOWERS_SYNCHRONIZATION`
- `DISABLE_FORGERY_REQUEST_PROTECTION`
- `DISALLOW_UNAUTHENTICATED_API_ACCESS`
- `EMAIL_DOMAIN_LISTS_APPLY_AFTER_CONFIRMATION`
- `ENABLE_SIDEKIQ_UNIQUE_JOBS_UI`
- `ES_ENABLED`
- `ES_PREFIX`
- `ES_PRESET`
- `FORCE_DEFAULT_LOCALE`
- `GITHUB_ACTIONS`
- `GITHUB_RSPEC`
- `HEROKU`
- `LDAP_ENABLED`
- `LDAP_TLS_NO_VERIFY`
- `LDAP_UID_CONVERSION_ENABLED`
- `LOCAL_DOMAIN`
- `LOCAL_HTTPS`
- `MASTODON_PROMETHEUS_EXPORTER_ENABLED`
- `MASTODON_PROMETHEUS_EXPORTER_LOCAL`
- `MASTODON_PROMETHEUS_EXPORTER_SIDEKIQ_DETAILED_METRICS`
- `MASTODON_PROMETHEUS_EXPORTER_WEB_DETAILED_METRICS`
- `MAX_SESSION_ACTIVATIONS`
- `MAX_THREADS`
- `MIGRATION_IGNORE_INVALID_OTP_SECRET`
- `NODE_ENV`
- `OIDC_AUTH_ENDPOINT`
- `OIDC_CLIENT_AUTH_METHOD`
- `OIDC_CLIENT_ID`
- `OIDC_CLIENT_SECRET`
- `OIDC_DISCOVERY`
- `OIDC_DISPLAY`
- `OIDC_END_SESSION_ENDPOINT`
- `OIDC_HOST`
- `OIDC_HTTP_SCHEME`
- `OIDC_IDP_LOGOUT_REDIRECT_URI`
- `OIDC_ISSUER`
- `OIDC_JWKS_URI`
- `OIDC_PORT`
- `OIDC_PROMPT`
- `OIDC_REDIRECT_URI`
- `OIDC_RESPONSE_MODE`
- `OIDC_RESPONSE_TYPE`
- `OIDC_SCOPE`
- `OIDC_SECURITY_ASSUME_EMAIL_IS_VERIFIED`
- `OIDC_SEND_NONCE`
- `OIDC_SEND_SCOPE_TO_TOKEN_ENDPOINT`
- `OIDC_TOKEN_ENDPOINT`
- `OIDC_UID_FIELD`
- `OIDC_USE_PKCE`
- `OIDC_USER_INFO_ENDPOINT`
- `OMNIAUTH_ONLY`
- `ONE_CLICK_SSO_LOGIN`
- `PAM_ENABLED`
- `PORT`
- `PROD`
- `PROXY_PROTO_V1`
- `RAILS_ENV`
- `RAILS_SERVE_STATIC_FILES`
- `REDIS_DRIVER`
- `REDIS_NAMESPACE`
- `REMOTE_DEV`
- `REPLICA_DB_HOST`
- `REPLICA_DB_NAME`
- `S3_ALIAS_HOST`
- `S3_BUCKET`
- `S3_CLOUDFRONT_HOST`
- `S3_ENABLE_CHECKSUM_MODE`
- `S3_ENABLED`
- `S3_ENDPOINT`
- `S3_FORCE_SINGLE_REQUEST`
- `S3_OVERRIDE_PATH_STYLE`
- `S3_PERMISSION`
- `S3_STORAGE_CLASS`
- `SAML_ACS_URL`
- `SAML_ALLOWED_CLOCK_DRIFT`
- `SAML_ATTRIBUTES_STATEMENTS_EMAIL`
- `SAML_ATTRIBUTES_STATEMENTS_FIRST_NAME`
- `SAML_ATTRIBUTES_STATEMENTS_FULL_NAME`
- `SAML_ATTRIBUTES_STATEMENTS_LAST_NAME`
- `SAML_ATTRIBUTES_STATEMENTS_UID`
- `SAML_ATTRIBUTES_STATEMENTS_VERIFIED`
- `SAML_ATTRIBUTES_STATEMENTS_VERIFIED_EMAIL`
- `SAML_CERT`
- `SAML_IDP_CERT`
- `SAML_IDP_CERT_FINGERPRINT`
- `SAML_IDP_CERT_FINGERPRINT_VALIDATOR`
- `SAML_IDP_SSO_TARGET_PARAMS`
- `SAML_IDP_SSO_TARGET_URL`
- `SAML_ISSUER`
- `SAML_NAME_IDENTIFIER_FORMAT`
- `SAML_PRIVATE_KEY`
- `SAML_SECURITY_ASSUME_EMAIL_IS_VERIFIED`
- `SAML_SECURITY_WANT_ASSERTION_ENCRYPTED`
- `SAML_SECURITY_WANT_ASSERTION_SIGNED`
- `SAML_UID_ATTRIBUTE`
- `SECRET_KEY_BASE_DUMMY`
- `SENDFILE_HEADER`
- `SINGLE_USER_MODE`
- `SKIP_POST_DEPLOYMENT_MIGRATIONS`
- `SMTP_FROM_ADDRESS`
- `SOCKET`
- `STREAMING_API_BASE_URL`
- `SWIFT_AUTH_URL`
- `SWIFT_CONTAINER`
- `SWIFT_ENABLED`
- `SWIFT_OBJECT_URL`
- `SWIFT_PASSWORD`
- `SWIFT_PROJECT_ID`
- `SWIFT_REGION`
- `SWIFT_TEMP_URL_KEY`
- `SWIFT_TENANT`
- `SWIFT_USERNAME`
- `TRUSTED_PROXY_IP`
- `USER`
- `VAGRANT`
- `VIPS_BLOCK_UNTRUSTED`

## Hardcoded Secrets Detected

> **34 potential secret(s)** found in source code. These should be moved to environment variables.

- **[CRITICAL]** 34 hardcoded secret(s) detected in source code: Hardcoded Password, Private Key (PEM), Hardcoded Secret. Move these to environment variables immediately.
- **[CRITICAL]** Hardcoded secrets can be extracted from version control history even after removal. Rotate any exposed credentials immediately.

| Severity | Type | File | Line | Snippet |
|----------|------|------|------|---------|
| HIGH | Hardcoded Password | `app/models/login_activity.rb` | 21 | `enum :authentication_method, { password: 'password', otp: 'otp', webauthn: 'webauthn', sign_in_token: "[REDACTED]", o...` |
| HIGH | Hardcoded Password | `db/seeds/04_admin.rb` | 12 | `password: "[REDACTED]",` |
| HIGH | Hardcoded Password | `spec/controllers/auth/registrations_controller_spec.rb` | 90 | `current_password: 'something',` |
| HIGH | Hardcoded Password | `spec/controllers/auth/registrations_controller_spec.rb` | 101 | `password: 'new password',` |
| HIGH | Hardcoded Password | `spec/controllers/auth/registrations_controller_spec.rb` | 114 | `password: 'new password',` |
| HIGH | Hardcoded Password | `spec/controllers/auth/registrations_controller_spec.rb` | 127 | `password: 'new password',` |
| HIGH | Hardcoded Password | `spec/controllers/auth/registrations_controller_spec.rb` | 129 | `current_password: 'something',` |
| HIGH | Hardcoded Password | `spec/controllers/auth/registrations_controller_spec.rb` | 181 | `post :create, params: { user: { account_attributes: { username: 'test' }, email: 'test@example.com', password: '12345678...` |
| HIGH | Hardcoded Password | `spec/controllers/auth/registrations_controller_spec.rb` | 199 | `post :create, params: { user: { account_attributes: { username: 'test' }, email: 'test@example.com', password: '12345678...` |
| HIGH | Hardcoded Password | `spec/controllers/auth/registrations_controller_spec.rb` | 212 | `post :create, params: { user: { account_attributes: { username: 'test' }, email: 'test@example.com', password: '12345678...` |
| HIGH | Hardcoded Password | `spec/controllers/auth/registrations_controller_spec.rb` | 234 | `post :create, params: { user: { account_attributes: { username: 'test' }, email: 'test@example.com', password: '12345678...` |
| HIGH | Hardcoded Password | `spec/controllers/auth/registrations_controller_spec.rb` | 259 | `post :create, params: { user: { account_attributes: { username: 'test' }, email: 'test@example.com', password: '12345678...` |
| HIGH | Hardcoded Password | `spec/controllers/auth/registrations_controller_spec.rb` | 282 | `post :create, params: { user: { account_attributes: { username: 'test' }, email: 'test@example.com', password: '12345678...` |
| HIGH | Hardcoded Password | `spec/controllers/auth/registrations_controller_spec.rb` | 306 | `post :create, params: { user: { account_attributes: { username: 'test' }, email: 'test@example.com', password: '12345678...` |
| HIGH | Hardcoded Password | `spec/controllers/auth/registrations_controller_spec.rb` | 326 | `post :create, params: { user: { account_attributes: { username: 'test' }, email: 'test@example.com', password: '12345678...` |
| HIGH | Hardcoded Password | `spec/controllers/auth/sessions_controller_spec.rb` | 100 | `let(:user) { Fabricate(:user, email: 'foo@bar.com', password: 'abcdefgh') }` |
| HIGH | Hardcoded Password | `spec/controllers/auth/sessions_controller_spec.rb` | 214 | `Fabricate(:user, email: 'x@y.com', password: 'abcdefgh', otp_required_for_login: true, otp_secret: User.generate_otp_sec...` |
| HIGH | Hardcoded Password | `spec/controllers/auth/sessions_controller_spec.rb` | 236 | `Fabricate(:user, email: 'z@y.com', password: 'abcdefgh', otp_required_for_login: true, otp_secret: User.generate_otp_sec...` |
| HIGH | Hardcoded Password | `spec/controllers/auth/sessions_controller_spec.rb` | 354 | `Fabricate(:user, email: 'x@y.com', password: 'abcdefgh', otp_required_for_login: true, otp_secret: User.generate_otp_sec...` |
| HIGH | Hardcoded Password | `spec/controllers/concerns/challengable_concern_spec.rb` | 113 | `post :bar, params: { form_challenge: { current_password: "[REDACTED]" } }` |
| HIGH | Private Key (PEM) | `spec/fabricators/fasp/provider_fabricator.rb` | 9 | `server_private_key_pem  "-----BEGIN PRIVATE KEY-----\nMC4CAQAwBQYDK2VwBCIEICDjlajhVb8XfzyTchQWKraMKwtQW+r4opoAg7V3kw1Q\n...` |
| HIGH | Hardcoded Password | `spec/lib/mastodon/email_configuration_helper_spec.rb` | 15 | `password: 'mastodon',` |
| HIGH | Hardcoded Password | `spec/lib/mastodon/redis_configuration_spec.rb` | 178 | `ClimateControl.modify REDIS_PASSWORD: 'testpass', REDIS_HOST: "[REDACTED]", REDIS_PORT: '3333', REDIS_DB: '3' do` |
| HIGH | Hardcoded Secret | `spec/models/user_spec.rb` | 18 | `user = Fabricate(:user, otp_secret: '123123123')` |
| HIGH | Hardcoded Secret | `spec/models/user_spec.rb` | 259 | `user = Fabricate.build(:user, otp_secret: 'oldotpcode')` |
| HIGH | Private Key (PEM) | `spec/requests/signature_verification_spec.rb` | 18 | `-----BEGIN RSA PRIVATE KEY-----` |
| HIGH | Hardcoded Password | `spec/requests/api/v1/accounts_spec.rb` | 74 | `post "[REDACTED]", headers: headers, params: { username: 'test', password: '12345678', email: 'hello@world.tld', a...` |
| HIGH | Hardcoded Password | `spec/requests/api/v1/accounts_spec.rb` | 101 | `post "[REDACTED]", headers: headers, params: { password: '12345678', email: 'hello@world.tld', agreement: 'true' }` |
| HIGH | Hardcoded Secret | `spec/requests/api/v1/streaming_spec.rb` | 33 | `get "[REDACTED]", headers: headers, params: { access_token: 'deadbeef', stream: 'public' }` |
| HIGH | Hardcoded Password | `spec/requests/auth/challenges_spec.rb` | 27 | `post "[REDACTED]", params: { form_challenge: { return_to: return_to, current_password: 'hhfggjjd562' } }` |
| HIGH | Hardcoded Password | `spec/requests/auth/sessions/security_key_options_spec.rb` | 9 | `Fabricate(:user, email: 'x@y.com', password: 'abcdefgh', otp_required_for_login: true, otp_secret: User.generate_otp_sec...` |
| HIGH | Hardcoded Password | `spec/services/app_sign_up_service_spec.rb` | 9 | `let(:good_params) { { username: 'alice', password: '12345678', email: 'good@email.com', agreement: true } }` |
| HIGH | Hardcoded Password | `spec/system/settings/migration/redirects_spec.rb` | 6 | `let!(:user) { Fabricate(:user, password: 'testtest') }` |
| HIGH | Hardcoded Secret | `spec/workers/web/push_notification_worker_spec.rb` | 25 | `shared_secret: "\t\xA7&\x85\t\xC5m\b\xA8\xA7\xF8B{1\xADk\xE1y'm\xEDE\xEC\xDD\xEDj\xB3$s\xA9\xDA\xF0",` |

### Remediation Steps

1. Move all secrets to environment variables (`.env.local` or your secrets manager)
2. Rotate any credentials that have been committed to version control
3. Add `.env` and `.env.local` to `.gitignore`
4. Consider using a secrets manager (AWS Secrets Manager, HashiCorp Vault, Doppler)
5. Run `git log --all --full-history -S '<secret>'` to check if secrets exist in git history

---

*This audit was generated by [Codepliant](https://github.com/joechensmartz/codepliant). It is not a substitute for a professional security review.*
