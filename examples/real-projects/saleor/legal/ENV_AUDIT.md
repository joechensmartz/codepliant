# Environment Variable Audit

> Generated on 2026-03-16 — 120 variable(s) detected.
> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16

## Environment Variables

### API Key / Secret

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `AVALARA_PASSWORD` | saleor/plugins/avatax/tests/conftest.py, saleor/plugins/avatax/tests/test_tasks.py | No |
| `AWS_ACCESS_KEY_ID` | saleor/settings.py | No |
| `AWS_SECRET_ACCESS_KEY` | saleor/settings.py | No |
| `AZURE_ACCOUNT_KEY` | saleor/settings.py | No |
| `GS_CREDENTIALS` | saleor/settings.py | No |
| `RESET_PASSWORD_LOCK_TIME` | saleor/settings.py | No |
| `RSA_PRIVATE_KEY` | saleor/settings.py | No |
| `RSA_PRIVATE_PASSWORD` | saleor/settings.py | No |
| `SECRET_KEY` | .env.example, saleor/settings.py | Yes |
| `SENDGRID_PASSWORD` | saleor/settings.py | No |
| `TOKEN_UPDATE_LAST_LOGIN_THRESHOLD` | saleor/settings.py | No |

### Database

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `REDIS_URL` | saleor/settings.py | No |

### Service Config

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `ALLOWED_CLIENT_HOSTS` | saleor/settings.py | No |
| `ALLOWED_GRAPHQL_ORIGINS` | saleor/settings.py | No |
| `ALLOWED_HOSTS` | saleor/settings.py | No |
| `AWS_MEDIA_CUSTOM_DOMAIN` | saleor/settings.py | No |
| `AWS_S3_ENDPOINT_URL` | saleor/settings.py | No |
| `AWS_S3_URL_PROTOCOL` | saleor/settings.py | No |
| `AWS_STATIC_CUSTOM_DOMAIN` | saleor/settings.py | No |
| `CACHE_URL` | .env.example, saleor/settings.py | Yes |
| `CELERY_BROKER_URL` | .env.example, saleor/settings.py | Yes |
| `CLOUDAMQP_URL` | saleor/settings.py | No |
| `DASHBOARD_URL` | .env.example, saleor/core/views.py | Yes |
| `EMAIL_URL` | .env.example, saleor/settings.py | Yes |
| `EXPORT_FILES_TIMEDELTA` | saleor/settings.py | No |
| `GS_CUSTOM_ENDPOINT` | saleor/settings.py | No |
| `GS_MEDIA_CUSTOM_ENDPOINT` | saleor/settings.py | No |
| `MEDIA_URL` | saleor/settings.py | No |
| `OBSERVABILITY_BROKER_URL` | saleor/settings.py | No |
| `OBSERVABILITY_REPORT_PERIOD` | saleor/settings.py | No |
| `PYTEST_DB_URL` | conftest.py | No |
| `STATIC_URL` | saleor/settings.py | No |
| `STOREFRONT_URL` | saleor/core/views.py | No |
| `USER_EMAIL_URL` | saleor/settings.py, saleor/plugins/migrations/0007_add_user_emails_configuration.py | No |

### Other

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `ANONYMOUS_CHECKOUTS_TIMEDELTA` | saleor/settings.py | No |
| `AUTOMATIC_CHECKOUT_COMPLETION_DELAY` | saleor/settings.py | No |
| `AUTOMATIC_CHECKOUT_COMPLETION_OLDEST_MODIFIED` | saleor/settings.py | No |
| `AUTOMATIC_CHECKOUT_COMPLETION_QUEUE_NAME` | saleor/settings.py | No |
| `AVALARA_USERNAME` | saleor/plugins/avatax/tests/conftest.py, saleor/plugins/avatax/tests/test_tasks.py | No |
| `AWS_DEFAULT_ACL` | saleor/settings.py | No |
| `AWS_LOCATION` | saleor/settings.py | No |
| `AWS_MEDIA_BUCKET_NAME` | saleor/settings.py | No |
| `AWS_MEDIA_PRIVATE_BUCKET_NAME` | saleor/settings.py | No |
| `AWS_S3_REGION_NAME` | saleor/settings.py | No |
| `AWS_STORAGE_BUCKET_NAME` | saleor/settings.py | No |
| `AZURE_ACCOUNT_NAME` | saleor/settings.py | No |
| `AZURE_CONTAINER` | saleor/settings.py | No |
| `AZURE_CONTAINER_PRIVATE` | saleor/settings.py | No |
| `AZURE_SSL` | saleor/settings.py | No |
| `BEAT_EXPIRE_ORDERS_AFTER_TIMEDELTA` | saleor/settings.py | No |
| `BEAT_PRICE_RECALCULATION_SCHEDULE` | saleor/settings.py | No |
| `BEAT_UPDATE_SEARCH_FREQUENCY` | saleor/settings.py | No |
| `BREAKER_BOARD_DRY_RUN_SYNC_EVENTS` | saleor/settings.py | No |
| `BREAKER_BOARD_SYNC_EVENTS` | saleor/settings.py | No |
| `CACHE_TIMEOUT` | saleor/settings.py | No |
| `CELERY_RESULT_BACKEND` | saleor/settings.py | No |
| `CELERY_WORKER_PREFETCH_MULTIPLIER` | saleor/settings.py | No |
| `CHECKOUT_COMPLETION_LOCK_TIME` | saleor/settings.py | No |
| `CHECKOUT_DELIVERY_OPTIONS_TTL` | saleor/settings.py | No |
| `CHECKOUT_PRICES_TTL` | saleor/settings.py | No |
| `CHECKOUT_SEARCH_UPDATE_PARALLEL_TASKS` | saleor/settings.py | No |
| `CHECKOUT_TTL_BEFORE_RELEASING_FUNDS` | saleor/settings.py | No |
| `CHECKOUT_WEBHOOK_EVENTS_CELERY_QUEUE_NAME` | saleor/settings.py | No |
| `COLLECTION_PRODUCT_UPDATED_QUEUE_NAME` | saleor/settings.py | No |
| `CONFIRMATION_EMAIL_LOCK_TIME` | saleor/settings.py | No |
| `DATA_MIGRATIONS_TASKS_QUEUE_NAME` | saleor/settings.py | No |
| `DB_CONN_MAX_AGE` | saleor/settings.py | No |
| `DEFAULT_CHANNEL_SLUG` | saleor/settings.py | No |
| `DEFAULT_COUNTRY` | saleor/settings.py, saleor/channel/migrations/0001_initial.py | No |
| `DEFAULT_CURRENCY` | saleor/checkout/migrations/0021_django_price_2.py, saleor/core/utils/random_data.py, saleor/discount/migrations/0002_voucher.py, saleor/discount/migrations/0003_auto_20160207_0534.py, saleor/discount/migrations/0004_auto_20170206_0407.py, saleor/discount/migrations/0007_auto_20180108_0814.py, saleor/discount/migrations/0017_django_price_2.py, saleor/discount/migrations/0022_sale_channel_listing.py, saleor/giftcard/models.py, saleor/giftcard/migrations/0002_auto_20190814_0413.py, saleor/order/migrations/0072_django_price_2.py, saleor/payment/migrations/0002_transfer_payment_to_payment_method.py, saleor/product/migrations/0106_django_prices_2.py, saleor/product/migrations/0135_collection_channel_listing.py, saleor/shipping/migrations/0017_django_price_2.py | No |
| `DEFAULT_FROM_EMAIL` | .env.example, saleor/settings.py | Yes |
| `DELETE_APP_TTL` | saleor/settings.py | No |
| `DJANGO_SUPERUSER_` | saleor/account/management/commands/createsuperuser.py | No |
| `EDITOR_JS_LISTS_MAX_DEPTH` | saleor/settings.py | No |
| `EMPTY_CHECKOUTS_TIMEDELTA` | saleor/settings.py | No |
| `ENABLE_SSL` | saleor/settings.py | No |
| `EVENT_DELIVERY_ATTEMPT_RESPONSE_SIZE_LIMIT` | saleor/settings.py | No |
| `EVENT_PAYLOAD_DELETE_PERIOD` | saleor/settings.py | No |
| `EVENT_PAYLOAD_DELETE_TASK_TIME_LIMIT` | saleor/settings.py | No |
| `FEDERATED_QUERY_MAX_ENTITIES` | saleor/settings.py | No |
| `GIFTS_LIMIT_PER_RULE` | saleor/settings.py | No |
| `GRAPHQL_CACHE_SUFFIX` | saleor/settings.py | No |
| `GRAPHQL_QUERY_MAX_COMPLEXITY` | saleor/settings.py | No |
| `GS_BUCKET_NAME` | saleor/settings.py | No |
| `GS_DEFAULT_ACL` | saleor/settings.py | No |
| `GS_EXPIRATION` | saleor/settings.py | No |
| `GS_LOCATION` | saleor/settings.py | No |
| `GS_MEDIA_BUCKET_NAME` | saleor/settings.py | No |
| `GS_MEDIA_PRIVATE_BUCKET_NAME` | saleor/settings.py | No |
| `GS_PROJECT_ID` | saleor/settings.py | No |
| `HARD_MEMORY_LIMIT_IN_MB` | saleor/settings.py | No |
| `HTTP_IP_FILTER_ALLOW_LOOPBACK_IPS` | .env.example | Yes |
| `INTERNAL_IPS` | saleor/settings.py | No |
| `JWT_MANAGER_PATH` | saleor/settings.py | No |
| `JWT_TTL_ACCESS` | saleor/settings.py | No |
| `JWT_TTL_APP_ACCESS` | saleor/settings.py | No |
| `JWT_TTL_REFRESH` | saleor/settings.py | No |
| `JWT_TTL_REQUEST_EMAIL_CHANGE` | saleor/settings.py | No |
| `MAX_USER_ADDRESSES` | saleor/settings.py | No |
| `OAUTH_UPDATE_LAST_LOGIN_THRESHOLD` | saleor/settings.py | No |
| `OBSERVABILITY_BUFFER_BATCH_SIZE` | saleor/settings.py | No |
| `OBSERVABILITY_BUFFER_SIZE_LIMIT` | saleor/settings.py | No |
| `OBSERVABILITY_BUFFER_TIMEOUT` | saleor/settings.py | No |
| `OBSERVABILITY_MAX_PAYLOAD_SIZE` | saleor/settings.py | No |
| `ORDER_RULES_LIMIT` | saleor/settings.py | No |
| `ORDER_WEBHOOK_EVENTS_CELERY_QUEUE_NAME` | saleor/settings.py | No |
| `REAL_IP_ENVIRON` | saleor/settings.py | No |
| `SEND_USAGE_TELEMETRY_AFTER_TIMEDELTA` | saleor/settings.py | No |
| `SENDGRID_USERNAME` | saleor/settings.py | No |
| `SENTRY_DSN` | saleor/settings.py | No |
| `SOFT_MEMORY_LIMIT_IN_MB` | saleor/settings.py | No |
| `TELEMETRY_SLOW_GRAPHQL_OPERATION_THRESHOLD` | saleor/settings.py | No |
| `TRANSACTION_BATCH_FOR_RELEASING_FUNDS` | saleor/settings.py | No |
| `UPDATE_SEARCH_VECTOR_INDEX_QUEUE_NAME` | saleor/settings.py | No |
| `UPLOAD_ADDITIONAL_ALLOWED_MIME_TYPES` | saleor/settings.py | No |
| `USER_CHECKOUTS_TIMEDELTA` | saleor/settings.py | No |
| `WEBHOOK_CELERY_QUEUE_NAME` | saleor/settings.py | No |
| `WEBHOOK_DEFERRED_PAYLOAD_QUEUE_NAME` | saleor/settings.py | No |
| `WEBHOOK_PUBSUB_CELERY_QUEUE_NAME` | saleor/settings.py | No |
| `WEBHOOK_SQS_CELERY_QUEUE_NAME` | saleor/settings.py | No |

## Missing Documentation

The following variables are used but not listed in `.env.example`:

- `ALLOWED_CLIENT_HOSTS`
- `ALLOWED_GRAPHQL_ORIGINS`
- `ALLOWED_HOSTS`
- `ANONYMOUS_CHECKOUTS_TIMEDELTA`
- `AUTOMATIC_CHECKOUT_COMPLETION_DELAY`
- `AUTOMATIC_CHECKOUT_COMPLETION_OLDEST_MODIFIED`
- `AUTOMATIC_CHECKOUT_COMPLETION_QUEUE_NAME`
- `AVALARA_PASSWORD`
- `AVALARA_USERNAME`
- `AWS_ACCESS_KEY_ID`
- `AWS_DEFAULT_ACL`
- `AWS_LOCATION`
- `AWS_MEDIA_BUCKET_NAME`
- `AWS_MEDIA_CUSTOM_DOMAIN`
- `AWS_MEDIA_PRIVATE_BUCKET_NAME`
- `AWS_S3_ENDPOINT_URL`
- `AWS_S3_REGION_NAME`
- `AWS_S3_URL_PROTOCOL`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_STATIC_CUSTOM_DOMAIN`
- `AWS_STORAGE_BUCKET_NAME`
- `AZURE_ACCOUNT_KEY`
- `AZURE_ACCOUNT_NAME`
- `AZURE_CONTAINER`
- `AZURE_CONTAINER_PRIVATE`
- `AZURE_SSL`
- `BEAT_EXPIRE_ORDERS_AFTER_TIMEDELTA`
- `BEAT_PRICE_RECALCULATION_SCHEDULE`
- `BEAT_UPDATE_SEARCH_FREQUENCY`
- `BREAKER_BOARD_DRY_RUN_SYNC_EVENTS`
- `BREAKER_BOARD_SYNC_EVENTS`
- `CACHE_TIMEOUT`
- `CELERY_RESULT_BACKEND`
- `CELERY_WORKER_PREFETCH_MULTIPLIER`
- `CHECKOUT_COMPLETION_LOCK_TIME`
- `CHECKOUT_DELIVERY_OPTIONS_TTL`
- `CHECKOUT_PRICES_TTL`
- `CHECKOUT_SEARCH_UPDATE_PARALLEL_TASKS`
- `CHECKOUT_TTL_BEFORE_RELEASING_FUNDS`
- `CHECKOUT_WEBHOOK_EVENTS_CELERY_QUEUE_NAME`
- `CLOUDAMQP_URL`
- `COLLECTION_PRODUCT_UPDATED_QUEUE_NAME`
- `CONFIRMATION_EMAIL_LOCK_TIME`
- `DATA_MIGRATIONS_TASKS_QUEUE_NAME`
- `DB_CONN_MAX_AGE`
- `DEFAULT_CHANNEL_SLUG`
- `DEFAULT_COUNTRY`
- `DEFAULT_CURRENCY`
- `DELETE_APP_TTL`
- `DJANGO_SUPERUSER_`
- `EDITOR_JS_LISTS_MAX_DEPTH`
- `EMPTY_CHECKOUTS_TIMEDELTA`
- `ENABLE_SSL`
- `EVENT_DELIVERY_ATTEMPT_RESPONSE_SIZE_LIMIT`
- `EVENT_PAYLOAD_DELETE_PERIOD`
- `EVENT_PAYLOAD_DELETE_TASK_TIME_LIMIT`
- `EXPORT_FILES_TIMEDELTA`
- `FEDERATED_QUERY_MAX_ENTITIES`
- `GIFTS_LIMIT_PER_RULE`
- `GRAPHQL_CACHE_SUFFIX`
- `GRAPHQL_QUERY_MAX_COMPLEXITY`
- `GS_BUCKET_NAME`
- `GS_CREDENTIALS`
- `GS_CUSTOM_ENDPOINT`
- `GS_DEFAULT_ACL`
- `GS_EXPIRATION`
- `GS_LOCATION`
- `GS_MEDIA_BUCKET_NAME`
- `GS_MEDIA_CUSTOM_ENDPOINT`
- `GS_MEDIA_PRIVATE_BUCKET_NAME`
- `GS_PROJECT_ID`
- `HARD_MEMORY_LIMIT_IN_MB`
- `INTERNAL_IPS`
- `JWT_MANAGER_PATH`
- `JWT_TTL_ACCESS`
- `JWT_TTL_APP_ACCESS`
- `JWT_TTL_REFRESH`
- `JWT_TTL_REQUEST_EMAIL_CHANGE`
- `MAX_USER_ADDRESSES`
- `MEDIA_URL`
- `OAUTH_UPDATE_LAST_LOGIN_THRESHOLD`
- `OBSERVABILITY_BROKER_URL`
- `OBSERVABILITY_BUFFER_BATCH_SIZE`
- `OBSERVABILITY_BUFFER_SIZE_LIMIT`
- `OBSERVABILITY_BUFFER_TIMEOUT`
- `OBSERVABILITY_MAX_PAYLOAD_SIZE`
- `OBSERVABILITY_REPORT_PERIOD`
- `ORDER_RULES_LIMIT`
- `ORDER_WEBHOOK_EVENTS_CELERY_QUEUE_NAME`
- `PYTEST_DB_URL`
- `REAL_IP_ENVIRON`
- `REDIS_URL`
- `RESET_PASSWORD_LOCK_TIME`
- `RSA_PRIVATE_KEY`
- `RSA_PRIVATE_PASSWORD`
- `SEND_USAGE_TELEMETRY_AFTER_TIMEDELTA`
- `SENDGRID_PASSWORD`
- `SENDGRID_USERNAME`
- `SENTRY_DSN`
- `SOFT_MEMORY_LIMIT_IN_MB`
- `STATIC_URL`
- `STOREFRONT_URL`
- `TELEMETRY_SLOW_GRAPHQL_OPERATION_THRESHOLD`
- `TOKEN_UPDATE_LAST_LOGIN_THRESHOLD`
- `TRANSACTION_BATCH_FOR_RELEASING_FUNDS`
- `UPDATE_SEARCH_VECTOR_INDEX_QUEUE_NAME`
- `UPLOAD_ADDITIONAL_ALLOWED_MIME_TYPES`
- `USER_CHECKOUTS_TIMEDELTA`
- `USER_EMAIL_URL`
- `WEBHOOK_CELERY_QUEUE_NAME`
- `WEBHOOK_DEFERRED_PAYLOAD_QUEUE_NAME`
- `WEBHOOK_PUBSUB_CELERY_QUEUE_NAME`
- `WEBHOOK_SQS_CELERY_QUEUE_NAME`

## Hardcoded Secrets Detected

> **78 potential secret(s)** found in source code. These should be moved to environment variables.

- **[CRITICAL]** 78 hardcoded secret(s) detected in source code: Hardcoded Password, Hardcoded Secret, Private Key (PEM). Move these to environment variables immediately.
- **[CRITICAL]** Hardcoded secrets can be extracted from version control history even after removal. Rotate any exposed credentials immediately.

| Severity | Type | File | Line | Snippet |
|----------|------|------|------|---------|
| HIGH | Hardcoded Password | `saleor/account/error_codes.py` | 17 | `INVALID_PASSWORD = "[REDACTED]"` |
| HIGH | Hardcoded Password | `saleor/account/tests/test_throttling.py` | 22 | `CORRECT_PASSWORD = "password"` |
| HIGH | Hardcoded Password | `saleor/account/tests/test_throttling.py` | 23 | `INCORRECT_PASSWORD = "[REDACTED]"` |
| HIGH | Hardcoded Password | `saleor/account/tests/fixtures/user.py` | 74 | `user._password = "password"` |
| HIGH | Hardcoded Password | `saleor/account/tests/fixtures/user.py` | 91 | `user._password = "password"` |
| HIGH | Hardcoded Password | `saleor/account/tests/fixtures/user.py` | 107 | `customer_user3._password = "password"` |
| HIGH | Hardcoded Password | `saleor/account/tests/fixtures/user.py` | 129 | `password="password",` |
| HIGH | Hardcoded Password | `saleor/account/tests/fixtures/user.py` | 142 | `password="password",` |
| HIGH | Hardcoded Password | `saleor/account/tests/fixtures/user.py` | 148 | `password="password",` |
| HIGH | Hardcoded Password | `saleor/core/notify.py` | 28 | `ACCOUNT_SET_CUSTOMER_PASSWORD = "[REDACTED]"` |
| HIGH | Hardcoded Password | `saleor/core/notify.py` | 59 | `ACCOUNT_SET_STAFF_PASSWORD = "[REDACTED]"` |
| HIGH | Hardcoded Password | `saleor/core/notify.py` | 60 | `ACCOUNT_STAFF_RESET_PASSWORD = "[REDACTED]"` |
| HIGH | Hardcoded Password | `saleor/core/utils/random_data.py` | 120 | `DUMMY_STAFF_PASSWORD = "password"` |
| HIGH | Hardcoded Password | `saleor/graphql/account/tests/test_account_utils.py` | 401 | `password="password",` |
| HIGH | Hardcoded Password | `saleor/graphql/account/tests/test_account_utils.py` | 453 | `password="password",` |
| HIGH | Hardcoded Password | `saleor/graphql/account/tests/bulk_mutations/test_staff_bulk_delete.py` | 280 | `password="password",` |
| HIGH | Hardcoded Password | `saleor/graphql/account/tests/bulk_mutations/test_staff_bulk_delete.py` | 338 | `password="password",` |
| HIGH | Hardcoded Password | `saleor/graphql/account/tests/mutations/authentication/test_password_change.py` | 21 | `new_password = "[REDACTED]"` |
| HIGH | Hardcoded Password | `saleor/graphql/account/tests/mutations/authentication/test_password_change.py` | 83 | `new_password = "[REDACTED]"` |
| HIGH | Hardcoded Password | `saleor/graphql/account/tests/mutations/authentication/test_password_change.py` | 103 | `new_password = "[REDACTED]"` |
| HIGH | Hardcoded Password | `saleor/graphql/account/tests/mutations/authentication/test_password_change.py` | 125 | `new_password = "[REDACTED]"` |
| HIGH | Hardcoded Password | `saleor/graphql/account/tests/mutations/authentication/test_set_password.py` | 42 | `email="testSetPassword1@example.com", password="[REDACTED]"` |
| HIGH | Hardcoded Password | `saleor/graphql/account/tests/mutations/authentication/test_set_password.py` | 45 | `password = "[REDACTED]"` |
| HIGH | Hardcoded Password | `saleor/graphql/account/tests/mutations/authentication/test_set_password.py` | 79 | `password="[REDACTED]",` |
| HIGH | Hardcoded Password | `saleor/graphql/account/tests/mutations/authentication/test_set_password.py` | 84 | `password = "[REDACTED]"` |
| HIGH | Hardcoded Password | `saleor/graphql/account/tests/mutations/permission_group/test_permission_group_update.py` | 1181 | `password="password",` |
| HIGH | Hardcoded Password | `saleor/graphql/core/tests/test_graphql.py` | 46 | `tokenCreate(email: "admin@example.com", password: "password") {` |
| HIGH | Hardcoded Password | `saleor/graphql/csv/tests/queries/test_export_files.py` | 155 | `password="password",` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_plugin.py` | 134 | `webhook_object.secret = "[REDACTED]"` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_plugin.py` | 167 | `client_secret = "[REDACTED]"` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_plugin.py` | 225 | `client_secret = "[REDACTED]"` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_plugin.py` | 284 | `client_secret = "[REDACTED]"` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_plugin.py` | 348 | `client_secret = "[REDACTED]"` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_plugin.py` | 398 | `api_key="secret_key",` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_plugin.py` | 424 | `client_secret = "[REDACTED]"` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_plugin.py` | 496 | `api_key="secret_key",` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_plugin.py` | 517 | `client_secret = "[REDACTED]"` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_plugin.py` | 573 | `api_key="secret_key",` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_plugin.py` | 594 | `client_secret = "[REDACTED]"` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_plugin.py` | 670 | `api_key="secret_key",` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_plugin.py` | 691 | `client_secret = "[REDACTED]"` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_plugin.py` | 767 | `api_key="secret_key",` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_plugin.py` | 788 | `client_secret = "[REDACTED]"` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_plugin.py` | 865 | `api_key="secret_key",` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_plugin.py` | 890 | `client_secret = "[REDACTED]"` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_plugin.py` | 968 | `api_key="secret_key",` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_plugin.py` | 995 | `client_secret = "[REDACTED]"` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_plugin.py` | 1046 | `api_key="secret_key",` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_plugin.py` | 1063 | `client_secret = "[REDACTED]"` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_plugin.py` | 1114 | `client_secret = "[REDACTED]"` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_plugin_deprecated.py` | 24 | `client_secret = "[REDACTED]"` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_plugin_deprecated.py` | 78 | `api_key="secret_key",` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_stripe_api.py` | 36 | `api_key = "incorrect"` |
| HIGH | Hardcoded Secret | `saleor/payment/gateways/stripe/tests/test_stripe_api.py` | 45 | `api_key = "correct_key"` |
| HIGH | Hardcoded Password | `saleor/plugins/base_plugin.py` | 79 | `PASSWORD = "Password"` |
| HIGH | Hardcoded Secret | `saleor/plugins/openid_connect/tests/conftest.py` | 53 | `client_secret="[REDACTED]",` |
| HIGH | Private Key (PEM) | `saleor/plugins/openid_connect/tests/conftest.py` | 149 | `private_key = """-----BEGIN RSA PRIVATE KEY-----` |
| HIGH | Hardcoded Secret | `saleor/plugins/openid_connect/tests/test_plugin.py` | 1132 | `client_secret="c_secret",` |
| HIGH | Hardcoded Secret | `saleor/plugins/openid_connect/tests/test_utils.py` | 643 | `access_token="fake-token",` |
| HIGH | Hardcoded Secret | `saleor/plugins/openid_connect/tests/test_utils.py` | 691 | `access_token="fake-token",` |
| HIGH | Hardcoded Secret | `saleor/plugins/openid_connect/tests/test_utils.py` | 736 | `access_token="fake-token",` |
| HIGH | Hardcoded Secret | `saleor/plugins/openid_connect/tests/test_utils.py` | 780 | `access_token="fake-token",` |
| HIGH | Hardcoded Secret | `saleor/plugins/openid_connect/tests/test_utils.py` | 833 | `access_token="fake-token",` |
| HIGH | Hardcoded Secret | `saleor/plugins/openid_connect/tests/test_utils.py` | 885 | `access_token="fake-token",` |
| HIGH | Hardcoded Password | `saleor/plugins/user_email/tests/test_plugin.py` | 369 | `USER_EMAIL_HOST_PASSWORD="[REDACTED]",` |
| HIGH | Private Key (PEM) | `saleor/tests/settings.py` | 55 | `RSA_PRIVATE_KEY = """-----BEGIN RSA PRIVATE KEY-----` |
| HIGH | Hardcoded Password | `saleor/tests/e2e/conftest.py` | 52 | `password="password",` |
| HIGH | Hardcoded Password | `saleor/tests/e2e/conftest.py` | 64 | `password="password",` |
| HIGH | Hardcoded Password | `saleor/tests/e2e/conftest.py` | 92 | `password="password",` |
| HIGH | Hardcoded Password | `saleor/tests/e2e/account/account/test_login_throttling.py` | 66 | `user_password = "Test1234!"` |
| HIGH | Hardcoded Password | `saleor/tests/e2e/account/account/test_login_throttling.py` | 84 | `invalid_password = "password"` |
| HIGH | Hardcoded Password | `saleor/tests/e2e/account/account/test_should_create_account_without_email_confirmation.py` | 45 | `test_password = "password!"` |
| HIGH | Hardcoded Password | `saleor/tests/e2e/account/account/test_should_login_before_email_confirmation.py` | 46 | `test_password = "Password!"` |
| HIGH | Hardcoded Password | `saleor/tests/e2e/account/account/test_should_not_be_able_to_create_account_with_existing_email.py` | 43 | `user_password = "Test1234!"` |
| HIGH | Hardcoded Password | `saleor/tests/e2e/account/account/test_should_not_be_able_to_create_account_with_existing_email.py` | 55 | `new_password = "Password1!"` |
| HIGH | Hardcoded Password | `saleor/tests/e2e/account/account/test_should_not_be_able_to_login_with_invalid_credentials.py` | 54 | `user_password = "Test1234!"` |
| HIGH | Hardcoded Password | `saleor/tests/e2e/account/account/test_should_not_be_able_to_login_with_invalid_credentials.py` | 71 | `invalid_password = "password"` |
| HIGH | Hardcoded Password | `saleor/tests/e2e/checkout/test_guest_checkout_should_be_assigned_to_user_after_creating_the_account.py` | 129 | `password = "Test1234!"` |

### Remediation Steps

1. Move all secrets to environment variables (`.env.local` or your secrets manager)
2. Rotate any credentials that have been committed to version control
3. Add `.env` and `.env.local` to `.gitignore`
4. Consider using a secrets manager (AWS Secrets Manager, HashiCorp Vault, Doppler)
5. Run `git log --all --full-history -S '<secret>'` to check if secrets exist in git history

---

*This audit was generated by [Codepliant](https://github.com/joechensmartz/codepliant). It is not a substitute for a professional security review.*
