# Environment Variable Audit

> Generated on 2026-03-16 — 339 variable(s) detected.
> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16

## Security Recommendations

- **[CRITICAL]** Public env vars with secret-looking names (exposed to client): NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_ZENDESK_KEY, NEXT_PUBLIC_HELPSCOUT_KEY, NEXT_PUBLIC_FRESHCHAT_TOKEN, NEXT_PUBLIC_CLOUDFLARE_SITEKEY, NEXT_PUBLIC_VAPID_PUBLIC_KEY

## Environment Variables

### API Key / Secret

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `API_KEY_PREFIX` | .env.example, apps/api/v1/lib/helpers/verifyApiKey.ts, apps/api/v1/pages/api/api-keys/_post.ts, packages/features/ee/api-keys/lib/findValidApiKey.ts, packages/features/ee/api-keys/repositories/PrismaApiKeyRepository.ts, packages/trpc/server/routers/viewer/apiKeys/create.handler.ts, scripts/seed.ts | Yes |
| `ATOMS_E2E_OAUTH_CLIENT_SECRET` | packages/platform/examples/base/playwright.config.ts | No |
| `AUTH_BEARER_TOKEN_CLOUDFLARE` | packages/lib/domainManager/deploymentServices/cloudflare.ts | No |
| `AUTH_BEARER_TOKEN_VERCEL` | .env.example, packages/lib/domainManager/deploymentServices/vercel.ts | No |
| `AVATARAPI_PASSWORD` | .env.example, apps/web/app/api/auth/signup/handlers/calcomSignupHandler.ts, apps/web/app/api/auth/signup/handlers/selfHostedHandler.ts, packages/features/auth/signup/utils/prefillAvatar.ts | No |
| `AXIOM_TOKEN` | apps/api/v2/src/lib/logger.ts | No |
| `B2_APPLICATION_KEY` | .env.example, apps/web/app/api/compliance/download/route.ts | No |
| `B2_APPLICATION_KEY_ID` | .env.example, apps/web/app/api/compliance/download/route.ts | No |
| `BASECAMP3_CLIENT_SECRET` | scripts/seed-app-store.ts | No |
| `CAL_SIGNATURE_TOKEN` | .env.example, packages/features/ee/common/server/LicenseKeyService.test.ts, packages/features/ee/deployment/lib/getDeploymentKey.ts, packages/trpc/server/routers/viewer/admin/createCoupon.handler.ts, packages/trpc/server/routers/viewer/admin/createSelfHostedLicenseKey.handler.ts | No |
| `CAL_VIDEO_RECORDING_TOKEN_SECRET` | .env.example, packages/lib/videoTokens.ts | No |
| `CALCOM_ADMIN_API_KEY` | example-apps/credential-sync/constants.ts | No |
| `CALCOM_APP_CREDENTIAL_ENCRYPTION_KEY` | .env.example, apps/api/v1/pages/api/credential-sync/_patch.ts, apps/api/v1/pages/api/credential-sync/_post.ts, apps/web/app/api/webhook/app-credential/route.ts, example-apps/credential-sync/constants.ts, packages/lib/constants.ts | Yes |
| `CALCOM_CREDENTIAL_SYNC_ENDPOINT` | .env.example, packages/app-store/_utils/oauth/parseRefreshTokenResponse.ts, packages/app-store/_utils/oauth/refreshOAuthTokens.ts, packages/lib/constants.ts | Yes |
| `CALCOM_CREDENTIAL_SYNC_HEADER_NAME` | .env.example, apps/api/v1/lib/helpers/verifyCredentialSyncEnabled.ts, example-apps/credential-sync/constants.ts, packages/lib/constants.ts | Yes |
| `CALCOM_CREDENTIAL_SYNC_SECRET` | .env.example, apps/api/v1/lib/helpers/verifyCredentialSyncEnabled.ts, example-apps/credential-sync/constants.ts, packages/lib/constants.ts | Yes |
| `CALCOM_LICENSE_KEY` | .env.example, apps/web/server/lib/setup/getServerSideProps.tsx, packages/features/ee/deployment/lib/getDeploymentKey.ts, packages/lib/telemetry.ts | No |
| `CALCOM_SERVICE_ACCOUNT_ENCRYPTION_KEY` | .env.example, vitest.config.mts, packages/lib/constants.ts | No |
| `CALENDSO_ENCRYPTION_KEY` | .env.example, apps/api/v2/src/ee/calendars/services/apple-calendar.service.ts, apps/api/v2/src/ee/calendars/services/ics-feed.service.ts, apps/web/next.config.ts, apps/web/app/api/auth/oauth/refreshToken/route.ts, apps/web/app/api/auth/oauth/token/route.ts, apps/web/app/api/auth/two-factor/totp/disable/route.ts, apps/web/app/api/auth/two-factor/totp/enable/route.ts, apps/web/app/api/auth/two-factor/totp/setup/route.ts, apps/web/app/api/link/route.ts, apps/web/app/api/sync/helpscout/route.ts, apps/web/playwright/login.2fa.e2e.ts, apps/web/playwright/lib/testUtils.ts, apps/web/playwright/oauth/oauth-refresh-tokens.e2e.ts, apps/web/server/lib/auth/login/getServerSideProps.tsx, packages/app-store/applecalendar/api/add.ts, packages/app-store/caldavcalendar/api/add.ts, packages/app-store/closecom/lib/CrmService.ts, packages/app-store/exchange2013calendar/api/add.ts, packages/app-store/exchange2013calendar/lib/CalendarService.ts, packages/app-store/exchange2016calendar/api/add.ts, packages/app-store/exchange2016calendar/lib/CalendarService.ts, packages/app-store/exchangecalendar/api/_postAdd.ts, packages/app-store/exchangecalendar/lib/CalendarService.ts, packages/app-store/ics-feedcalendar/api/add.ts, packages/app-store/ics-feedcalendar/lib/CalendarService.ts, packages/app-store/sendgrid/api/_postAdd.ts, packages/app-store/sendgrid/lib/CalendarService.ts, packages/emails/src/templates/OrganizerRequestEmail.tsx, packages/features/auth/lib/next-auth-options.test.ts, packages/features/auth/lib/next-auth-options.ts, packages/features/auth/lib/oAuthAuthorization.ts, packages/features/auth/lib/signJwt.ts, packages/features/auth/lib/verifyCodeUnAuthenticated.ts, packages/features/auth/lib/verifyEmail.ts, packages/features/bookings/lib/EventManager.test.ts, packages/features/bookings/lib/EventManager.ts, packages/features/calendars/lib/getCalendarsEvents.ts, packages/features/ee/deployment/lib/getDeploymentKey.ts, packages/features/ee/sso/lib/jackson.ts, packages/features/oauth/services/OAuthService.ts, packages/lib/CalendarService.ts, packages/lib/server/PiiHasher.ts, packages/testing/src/lib/bookingScenario/setupAndTeardown.ts, packages/trpc/server/routers/viewer/deploymentSetup/update.handler.ts, packages/trpc/server/routers/viewer/me/deleteMe.handler.ts, packages/trpc/server/routers/viewer/organizations/setPassword.handler.ts, packages/trpc/server/routers/viewer/organizations/verifyCode.handler.ts, packages/trpc/server/routers/viewer/workflows/verifyEmailCode.handler.ts | No |
| `CLOSECOM_CLIENT_SECRET` | .env.example, packages/lib/CloseCom.ts, scripts/seed-app-store.ts | No |
| `CLOUDFLARE_TURNSTILE_SECRET` | .env.example, packages/lib/server/checkCfTurnstileToken.ts | No |
| `CLOUDFLARE_URL_SCANNER_API_TOKEN` | packages/features/ee/workflows/lib/urlScanner.ts, packages/lib/constants.ts | No |
| `CRON_API_KEY` | .env.example, apps/web/cron-tester.ts, apps/web/app/api/cron/bookingReminder/route.ts, apps/web/app/api/cron/calendar-subscriptions/route.ts, apps/web/app/api/cron/calendar-subscriptions-cleanup/route.ts, apps/web/app/api/cron/changeTimeZone/route.ts, apps/web/app/api/cron/checkSmsPrices/route.ts, apps/web/app/api/cron/credentials/route.ts, apps/web/app/api/cron/downgradeUsers/route.ts, apps/web/app/api/cron/monthlyDigestEmail/route.ts, apps/web/app/api/cron/selected-calendars/route.ts, apps/web/app/api/cron/syncAppMeta/route.ts, apps/web/app/api/cron/webhookTriggers/route.ts, packages/app-store/routing-forms/cron/queuedFormResponseCleanup.ts, packages/features/ee/workflows/api/scheduleEmailReminders.ts, packages/features/ee/workflows/api/scheduleSMSReminders.test.ts, packages/features/ee/workflows/api/scheduleSMSReminders.ts, packages/features/ee/workflows/api/scheduleWhatsappReminders.test.ts, packages/features/ee/workflows/api/scheduleWhatsappReminders.ts | Yes |
| `CRON_SECRET` | apps/web/cron-tester.ts, apps/web/app/api/cron/calendar-subscriptions/route.ts, apps/web/app/api/cron/calendar-subscriptions-cleanup/route.ts, apps/web/app/api/cron/credentials/route.ts, apps/web/app/api/cron/selected-calendars/route.ts, packages/app-store/routing-forms/cron/queuedFormResponseCleanup.ts, packages/features/tasker/api/cleanup.ts, packages/features/tasker/api/cron.ts | No |
| `DAILY_API_KEY` | vitest.config.mts, apps/web/playwright/reschedule.e2e.ts, packages/app-store/dailyvideo/_metadata.ts, packages/app-store/dailyvideo/lib/VideoApiAdapter.ts, packages/app-store/dailyvideo/lib/scripts/deleteRecordings.ts, packages/testing/src/lib/bookingScenario/setupAndTeardown.ts, scripts/seed-app-store.ts | No |
| `DAILY_WEBHOOK_SECRET` | apps/web/app/api/recorded-daily-video/route.ts | No |
| `DEVIN_API_KEY` | scripts/devin/delete-all-devin-knowledge.ts, scripts/devin/export-devin-knowledge.ts, scripts/devin/sync-knowledge-to-devin.ts | No |
| `DUB_API_KEY` | .env.example, packages/features/auth/lib/dub.ts, packages/features/auth/lib/next-auth-options.ts, packages/features/ee/workflows/lib/reminders/utils.ts | No |
| `E2E_TEST_APPLE_CALENDAR_PASSWORD` | .env.example | Yes |
| `E2E_TEST_CALCOM_GCAL_KEYS` | .env.example, packages/app-store/googlecalendar/tests/google-calendar.e2e.ts | No |
| `E2E_TEST_CALCOM_QA_GCAL_CREDENTIALS` | .env.example, scripts/seed.ts | No |
| `E2E_TEST_CALCOM_QA_PASSWORD` | .env.example, packages/app-store/googlecalendar/tests/google-calendar.e2e.ts, scripts/seed.ts | Yes |
| `E2E_TEST_OIDC_CLIENT_SECRET` | .env.example | No |
| `E2E_TEST_OIDC_USER_PASSWORD` | .env.example | No |
| `E2E_TEST_SAML_ADMIN_PASSWORD` | .env.example | No |
| `EMAIL_SERVER_PASSWORD` | packages/lib/serverConfig.ts | No |
| `GIPHY_API_KEY` | scripts/seed-app-store.ts | No |
| `GOOGLE_API_CREDENTIALS` | .env.example, apps/web/next.config.ts, apps/web/server/lib/constants.ts, packages/app-store/googlecalendar/_metadata.ts, packages/app-store/googlevideo/_metadata.ts, packages/features/auth/lib/next-auth-options.ts, scripts/seed-app-store.ts | No |
| `GOOGLE_CALENDAR_API_KEY` | .env.example, packages/lib/holidays/GoogleCalendarClient.ts | No |
| `GOOGLE_CLIENT_SECRET` | example-apps/credential-sync/constants.ts | No |
| `GOOGLE_REFRESH_TOKEN` | example-apps/credential-sync/constants.ts | No |
| `GOOGLE_WEBHOOK_TOKEN` | .env.example, packages/features/calendar-subscription/adapters/GoogleCalendarSubscription.adapter.ts, packages/features/calendar-subscription/adapters/__tests__/GoogleCalendarSubscriptionAdapter.test.ts | No |
| `HUBSPOT_CLIENT_SECRET` | scripts/seed-app-store.ts | No |
| `HUDDLE01_API_TOKEN` | .env.example, packages/app-store/huddle01video/lib/VideoApiAdapter.ts, scripts/seed-app-store.ts | No |
| `IFFY_API_KEY` | .env.example, packages/features/tasker/tasks/scanWorkflowBody.test.ts, packages/features/tasker/tasks/scanWorkflowBody.ts, packages/features/tasker/tasks/test/scanWorkflowBody.test.ts, packages/lib/constants.ts | No |
| `INTERCOM_API_TOKEN` | .env.example, apps/web/app/api/support/conversation/route.ts, apps/web/modules/ee/support/lib/intercom/intercom.ts | No |
| `INTERCOM_SECRET` | .env.example, apps/web/app/api/support/hash/route.ts | No |
| `LARK_OPEN_APP_SECRET` | scripts/seed-app-store.ts | No |
| `LARK_OPEN_VERIFICATION_TOKEN` | scripts/seed-app-store.ts | No |
| `LINGO_DOT_DEV_API_KEY` | .env.example, packages/lib/constants.ts | No |
| `MICROSOFT_WEBHOOK_TOKEN` | .env.example, packages/features/calendar-subscription/adapters/Office365CalendarSubscription.adapter.ts | No |
| `MS_GRAPH_CLIENT_SECRET` | packages/features/auth/lib/outlook.test.ts, packages/features/auth/lib/outlook.ts, scripts/seed-app-store.ts | No |
| `NEXTAUTH_SECRET` | .env.example, apps/web/next.config.ts, packages/app-store/_utils/oauth/decodeOAuthState.ts, packages/app-store/_utils/oauth/encodeOAuthState.ts, packages/app-store/stripepayment/lib/VerificationTokenService.test.ts, packages/app-store/stripepayment/lib/VerificationTokenService.ts | No |
| `OAUTH2_CLIENT_SECRET_PLAIN` | packages/platform/examples/base/src/pages/api/oauth2-user.ts, packages/platform/examples/base/src/pages/api/refresh.ts | No |
| `RESEND_API_KEY` | packages/lib/serverConfig.ts | No |
| `RETELL_AI_KEY` | .env.example, apps/web/app/api/webhooks/retell-ai/route.ts, packages/features/calAIPhone/AIPhoneServiceRegistry.ts, packages/features/calAIPhone/providers/retellAI/RetellSDKClient.test.ts, packages/features/calAIPhone/providers/retellAI/RetellSDKClient.ts, packages/lib/retellAIFetcher.ts | No |
| `RETELL_AI_TEST_CAL_API_KEY` | .env.example, packages/features/calAIPhone/providers/retellAI/services/AgentService.ts | No |
| `SALESFORCE_CONSUMER_KEY` | scripts/seed-app-store.ts | No |
| `SALESFORCE_CONSUMER_SECRET` | scripts/seed-app-store.ts | No |
| `SAML_CLIENT_SECRET_VERIFIER` | .env.example, packages/features/ee/sso/lib/saml.ts | No |
| `SEED_OAUTH2_CLIENT_SECRET_HASHED` | .env.example, scripts/seed.ts | No |
| `SEED_PLATFORM_OAUTH_CLIENT_SECRET` | .env.example, scripts/seed.ts | No |
| `SENDGRID_API_KEY` | .env.example, packages/features/ee/workflows/api/scheduleEmailReminders.ts, packages/features/ee/workflows/lib/reminders/providers/sendgridProvider.ts | No |
| `SENDGRID_SYNC_API_KEY` | .env.example, packages/lib/Sendgrid.ts | No |
| `SENTRY_AUTH_TOKEN` | .env.example | No |
| `STRIPE_API_KEY` | apps/api/v2/src/modules/stripe/utils/newStripeInstance.ts | No |
| `STRIPE_PRIVATE_KEY` | .env.example, vitest.config.mts, apps/web/playwright/lib/testUtils.ts, packages/app-store/_utils/stripe.ts, packages/app-store/stripepayment/_metadata.ts, packages/app-store/stripepayment/lib/PaymentService.ts, packages/app-store/stripepayment/lib/server.ts, packages/features/ee/billing/active-user/seed-active-user-test.ts, packages/features/ee/billing/di/modules/StripeClient.ts, packages/features/ee/billing/service/dueInvoice/cleanup-proration-test.ts, packages/features/ee/billing/service/dueInvoice/seed-proration-test.ts, packages/features/ee/billing/service/highWaterMark/seed-hwm-test.ts, packages/features/ee/billing/service/highWaterMark/__tests__/HighWaterMarkStripe.integration-test.ts, packages/features/ee/payments/server/stripe.ts, packages/lib/constants.ts, scripts/seed-app-store.ts | No |
| `STRIPE_WEBHOOK_SECRET` | .env.example, apps/web/playwright/fixtures/users.ts, packages/features/ee/payments/api/webhook.ts, packages/testing/src/lib/bookingScenario/setupAndTeardown.ts, scripts/seed-app-store.ts | No |
| `STRIPE_WEBHOOK_SECRET_APPS` | .env.example, apps/web/pages/api/integrations/subscriptions/webhook.ts | No |
| `STRIPE_WEBHOOK_SECRET_BILLING` | .env.example, packages/features/ee/billing/api/webhook/__handler.ts | No |
| `TANDEM_CLIENT_SECRET` | scripts/seed-app-store.ts | No |
| `TRIGGER_DEV_VERCEL_ACCESS_TOKEN` | packages/features/trigger.config.ts | No |
| `TRIGGER_SECRET_KEY` | .env.example, apps/api/v2/src/vercel-webhook.controller.e2e-spec.ts, apps/api/v2/src/vercel-webhook.controller.ts, packages/lib/tasker/Tasker.test.ts, packages/lib/tasker/Tasker.ts | No |
| `TWILIO_TOKEN` | .env.example, packages/features/ee/workflows/lib/reminders/providers/twilioProvider.ts | No |
| `UNKEY_ROOT_KEY` | .env.example, packages/lib/checkRateLimitAndThrowError.test.ts, packages/testing/src/lib/bookingScenario/setupAndTeardown.ts | No |
| `UPSTASH_REDIS_REST_TOKEN` | packages/features/ee/api-keys/lib/autoLock.test.ts, packages/features/ee/api-keys/lib/autoLock.ts, packages/features/redis/RedisService.ts, packages/features/redis/di/redisModule.ts, packages/features/slots/handleNotificationWhenNoSlots.test.ts, packages/features/slots/handleNotificationWhenNoSlots.ts | No |
| `VAPID_PRIVATE_KEY` | .env.example, packages/features/notifications/sendNotification.ts | No |
| `VERCEL_PROMOTE_WEBHOOK_SECRET` | apps/api/v2/src/vercel-webhook.controller.e2e-spec.ts, apps/api/v2/src/vercel-webhook.guard.ts | No |
| `VITAL_API_KEY` | scripts/seed-app-store.ts | No |
| `VITAL_WEBHOOK_SECRET` | scripts/seed-app-store.ts | No |
| `X_CAL_SECRET_KEY` | packages/platform/examples/base/src/pages/api/managed-user.ts, packages/platform/examples/base/src/pages/api/refresh.ts | No |
| `ZOHOCRM_CLIENT_SECRET` | scripts/seed-app-store.ts | No |
| `ZOOM_CLIENT_SECRET` | example-apps/credential-sync/constants.ts, scripts/seed-app-store.ts | No |
| `ZOOM_REFRESH_TOKEN` | example-apps/credential-sync/constants.ts | No |

### Database

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `DATABASE_CHUNK_SIZE` | .env.example, packages/lib/constants.ts | No |
| `DATABASE_DIRECT_URL` | .env.example, packages/prisma/auto-migrations.ts | Yes |
| `DATABASE_URL` | .env.example, packages/kysely/index.ts, packages/prisma/auto-migrations.ts, packages/prisma/index.ts | Yes |
| `INSIGHTS_DATABASE_URL` | .env.example, packages/prisma/index.ts | No |
| `REDIS_URL` | apps/api/v2/src/app.module.ts | No |
| `SAML_DATABASE_URL` | .env.example, packages/features/ee/sso/lib/saml.ts | No |
| `UPSTASH_REDIS_REST_URL` | packages/features/ee/api-keys/lib/autoLock.test.ts, packages/features/ee/api-keys/lib/autoLock.ts, packages/features/redis/RedisService.ts, packages/features/redis/di/redisModule.ts, packages/features/slots/handleNotificationWhenNoSlots.test.ts, packages/features/slots/handleNotificationWhenNoSlots.ts | No |

### Service Config

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `__NEXT_I18N_SUPPORT` | packages/platform/atoms/vite.config.ts | No |
| `ALLOWED_HOSTNAMES` | .env.example, packages/lib/constants.ts | Yes |
| `API_PORT` | apps/api/v2/src/config/app.ts | No |
| `ATOMS_E2E_API_URL` | packages/platform/examples/base/playwright.config.ts | No |
| `DOCS_URL` | apps/api/v2/src/middleware/app.redirects.middleware.ts, apps/api/v2/src/swagger/generate-swagger.ts | No |
| `E2E_TEST_OIDC_PROVIDER_DOMAIN` | .env.example | No |
| `EMAIL_SERVER_HOST` | .env.example, packages/lib/serverConfig.ts | Yes |
| `EMAIL_SERVER_PORT` | .env.example, packages/lib/serverConfig.ts | Yes |
| `EMBED_PUBLIC_EMBED_LIB_URL` | packages/embeds/vite.config.js, packages/embeds/embed-core/src/preview.ts, packages/embeds/embed-snippet/src/index.ts | No |
| `EMBED_PUBLIC_VERCEL_URL` | packages/embeds/vite.config.js, packages/embeds/embed-core/src/embed.ts, packages/embeds/embed-snippet/src/index.ts | No |
| `EMBED_PUBLIC_WEBAPP_URL` | packages/embeds/vite.config.js, packages/embeds/embed-core/src/embed.test.ts, packages/embeds/embed-core/src/embed.ts, packages/embeds/embed-core/src/preview.ts, packages/embeds/embed-snippet/src/index.ts | No |
| `ENVIRONMENT_URL` | __checks__/calcom-dashboard.check.js, __checks__/csp-login.spec.ts, __checks__/location-link.check.js | No |
| `EXCHANGE_DEFAULT_EWS_URL` | apps/web/components/apps/exchange2013calendar/Setup.tsx, apps/web/components/apps/exchange2016calendar/Setup.tsx | No |
| `GOOGLE_WEBHOOK_URL` | .env.example, packages/features/calendar-subscription/adapters/GoogleCalendarSubscription.adapter.ts, packages/features/calendar-subscription/adapters/__tests__/GoogleCalendarSubscriptionAdapter.test.ts | No |
| `LOCAL_TESTING_DOMAIN_VERCEL` | packages/features/ee/organizations/lib/orgDomains.ts | No |
| `MICROSOFT_WEBHOOK_URL` | .env.example, packages/features/calendar-subscription/adapters/Office365CalendarSubscription.adapter.ts | No |
| `NEXTAUTH_COOKIE_DOMAIN` | .env.example, packages/lib/default-cookies.ts | No |
| `NEXTAUTH_URL` | .env.example, apps/web/next.config.ts, packages/features/auth/lib/next-auth-options.ts, packages/features/auth/lib/sendVerificationRequest.ts | Yes |
| `ORGANIZER_EMAIL_EXEMPT_DOMAINS` | packages/lib/constants.ts | No |
| `PLAYWRIGHT_TEST_BASE_URL` | apps/web/playwright/lib/next-server.ts | No |
| `RAILWAY_STATIC_URL` | packages/lib/constants.ts | No |
| `RENDER_EXTERNAL_URL` | packages/lib/constants.ts | No |
| `RESERVED_SUBDOMAINS` | .env.example, apps/web/next.config.ts, packages/lib/constants.ts | Yes |
| `TANDEM_BASE_URL` | scripts/seed-app-store.ts | No |
| `TRIGGER_API_URL` | .env.example, packages/lib/tasker/Tasker.test.ts, packages/lib/tasker/Tasker.ts | Yes |
| `USERNAME_BLACKLIST_URL` | packages/lib/server/username.ts | No |
| `VERCEL_URL` | apps/web/getNextjsOrgRewriteConfig.ts, apps/web/next.config.ts, apps/web/app/_trpc/trpc-client.ts, packages/embeds/vite.config.js, packages/lib/constants.ts, packages/lib/domainManager/organization.ts, packages/trpc/react/trpc.ts | No |

### Public / Client-side

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `NEXT_PUBLIC_API_HITPAY_PRODUCTION` | packages/app-store/hitpay/lib/constants.ts | No |
| `NEXT_PUBLIC_API_HITPAY_SANDBOX` | packages/app-store/hitpay/lib/constants.ts | No |
| `NEXT_PUBLIC_API_V2_ROOT_URL` | apps/api/v1/next.config.js | No |
| `NEXT_PUBLIC_API_V2_URL` | .env.example, apps/web/next.config.ts, apps/web/app/(booking-page-wrapper)/team/[slug]/[type]/queries.ts, apps/web/lib/team/[slug]/[type]/getServerSideProps.tsx | Yes |
| `NEXT_PUBLIC_APP_NAME` | .env.example, packages/lib/constants.ts | Yes |
| `NEXT_PUBLIC_AVAILABILITY_SCHEDULE_INTERVAL` | .env.example, packages/features/schedules/components/ScheduleComponent.tsx, packages/features/schedules/lib/slots.test.ts, packages/features/schedules/lib/slots.ts | No |
| `NEXT_PUBLIC_BODY_SCRIPTS` | .env.example, apps/web/app/(use-page-wrapper)/layout.tsx, apps/web/playwright/booking-pages.e2e.ts | No |
| `NEXT_PUBLIC_BOOKER_NUMBER_OF_DAYS_TO_LOAD` | .env.example, apps/web/modules/bookings/components/HavingTroubleFindingTime.tsx, packages/lib/constants.ts | Yes |
| `NEXT_PUBLIC_CAL_AI_PHONE_NUMBER_MONTHLY_PRICE` | .env.example, packages/lib/constants.ts | No |
| `NEXT_PUBLIC_CALCOM_API_URL` | packages/platform/examples/base/src/pages/_app.tsx, packages/platform/examples/base/src/pages/api/managed-user.ts, packages/platform/examples/base/src/pages/api/oauth2-user.ts, packages/platform/examples/base/src/pages/api/refresh.ts | No |
| `NEXT_PUBLIC_CALCOM_VERSION` | packages/lib/constants.ts, packages/platform/atoms/vite.config.ts, packages/ui/components/icon/IconSprites.tsx | No |
| `NEXT_PUBLIC_CLOUDFLARE_SITEKEY` | .env.example, packages/lib/constants.ts | No |
| `NEXT_PUBLIC_CLOUDFLARE_USE_TURNSTILE_IN_BOOKER` | .env.example, apps/web/pages/api/book/event.ts, apps/web/pages/api/book/recurring-event.ts, packages/lib/constants.ts | No |
| `NEXT_PUBLIC_COMPANY_NAME` | .env.example, packages/lib/constants.ts | Yes |
| `NEXT_PUBLIC_DISABLE_SIGNUP` | .env.example, apps/web/app/api/auth/signup/route.ts, apps/web/lib/signup/getServerSideProps.tsx, apps/web/modules/auth/login-view.tsx, apps/web/playwright/signup.e2e.ts | No |
| `NEXT_PUBLIC_DUB_PROGRAM_ID` | .env.example, apps/web/app/api/user/referrals-token/route.ts, packages/lib/constants.ts | No |
| `NEXT_PUBLIC_EMBED_FINGER_PRINT` | packages/embeds/vite.config.js | No |
| `NEXT_PUBLIC_EMBED_LIB_URL` | .env.example, apps/web/next.config.ts, packages/embeds/vite.config.js, packages/lib/constants.ts | Yes |
| `NEXT_PUBLIC_EMBED_VERSION` | packages/embeds/vite.config.js | No |
| `NEXT_PUBLIC_ENABLE_PROFILE_SWITCHER` | packages/lib/constants.ts | No |
| `NEXT_PUBLIC_FORMBRICKS_ENVIRONMENT_ID` | .env.example, apps/web/modules/formbricks/hooks/useFormbricks.ts, apps/web/modules/formbricks/lib/trackFormbricksAction.ts, packages/lib/formbricks.ts, packages/trpc/server/routers/viewer/feedback/_router.ts | No |
| `NEXT_PUBLIC_FORMBRICKS_HOST_URL` | .env.example, apps/web/modules/formbricks/hooks/useFormbricks.ts, apps/web/modules/formbricks/lib/trackFormbricksAction.ts, packages/lib/formbricks.ts, packages/trpc/server/routers/viewer/feedback/_router.ts | Yes |
| `NEXT_PUBLIC_FRESHCHAT_HOST` | .env.example, apps/web/modules/ee/support/lib/freshchat/FreshChatScript.tsx | No |
| `NEXT_PUBLIC_FRESHCHAT_TOKEN` | .env.example, apps/web/modules/ee/support/lib/freshchat/FreshChatScript.tsx | No |
| `NEXT_PUBLIC_GTM_ID` | apps/web/components/GTM.tsx, apps/web/modules/signup-view.tsx | No |
| `NEXT_PUBLIC_HEAD_SCRIPTS` | .env.example, apps/web/app/(use-page-wrapper)/layout.tsx | No |
| `NEXT_PUBLIC_HELPSCOUT_KEY` | .env.example, apps/web/modules/ee/support/lib/helpscout/HelpscoutMenuItem.tsx, apps/web/modules/ee/support/lib/helpscout/provider.tsx, apps/web/modules/ee/support/lib/helpscout/providerDynamic.tsx | No |
| `NEXT_PUBLIC_HOSTED_CAL_FEATURES` | .env.example, packages/lib/constants.ts | No |
| `NEXT_PUBLIC_INTERCOM_APP_ID` | .env.example, apps/web/modules/ee/support/lib/intercom/provider.tsx, apps/web/modules/ee/support/lib/intercom/providerDynamic.tsx, apps/web/modules/ee/support/lib/intercom/useIntercom.ts | No |
| `NEXT_PUBLIC_INVALIDATE_AVAILABLE_SLOTS_ON_BOOKING_FORM` | .env.example, packages/lib/constants.ts | Yes |
| `NEXT_PUBLIC_IS_E2E` | .env.example, apps/api/v2/src/modules/stripe/stripe.service.ts, apps/web/app/api/recorded-daily-video/route.ts, apps/web/app/e2e/session-warmup/page.tsx, apps/web/lib/app-providers.tsx, apps/web/modules/signup-view.tsx, apps/web/modules/auth/components/Turnstile.tsx, apps/web/modules/ee/organizations/lib/onboardingStore.ts, apps/web/modules/feature-flags/hooks/useFlags.ts, packages/app-store/analytics.services.generated.ts, packages/app-store/calendar.services.generated.ts, packages/app-store/video.adapters.generated.ts, packages/app-store/routing-forms/getEventTypeRedirectUrl.ts, packages/app-store/stripepayment/api/add.ts, packages/app-store/stripepayment/pages/setup/_getServerSideProps.ts, packages/app-store/stripepayment/pages/setup/__tests__/_getServerSideProps.test.ts, packages/app-store-cli/src/build.ts, packages/emails/templates/_base-email.ts, packages/embeds/vite.config.js, packages/embeds/embed-core/src/preview.ts, packages/features/auth/lib/next-auth-options.ts, packages/features/ee/common/server/LicenseKeyService.test.ts, packages/features/ee/common/server/LicenseKeyService.ts, packages/features/ee/organizations/lib/orgDomains.ts, packages/features/ee/organizations/lib/service/onboarding/OrganizationOnboardingFactory.ts, packages/features/ee/organizations/lib/service/onboarding/__tests__/OrganizationOnboardingFactory.test.ts, packages/features/ee/payments/api/webhook.ts, packages/features/ee/workflows/lib/reminders/providers/sendgridProvider.ts, packages/features/ee/workflows/lib/reminders/providers/twilioProvider.ts, packages/features/profile/lib/checkRegularUsername.ts, packages/lib/constants.ts, packages/lib/ssrfProtection.ts, packages/lib/telemetry.ts, packages/lib/server/checkCfTurnstileToken.ts, packages/trpc/server/routers/viewer/deploymentSetup/validateLicense.handler.ts, packages/trpc/server/routers/viewer/organizations/verifyCode.handler.ts | No |
| `NEXT_PUBLIC_IS_PREMIUM_NEW_PLAN` | .env.example | Yes |
| `NEXT_PUBLIC_LOGGER_LEVEL` | .env.example, apps/web/app/_trpc/trpc-client.ts, packages/lib/logger.ts, packages/prisma/index.ts, packages/trpc/react/trpc.ts | No |
| `NEXT_PUBLIC_MINUTES_TO_BOOK` | .env.example, packages/lib/constants.ts | Yes |
| `NEXT_PUBLIC_OAUTH2_CLIENT_ID` | packages/platform/examples/base/src/pages/_app.tsx, packages/platform/examples/base/src/pages/api/oauth2-user.ts, packages/platform/examples/base/src/pages/api/refresh.ts | No |
| `NEXT_PUBLIC_OAUTH2_MODE` | packages/platform/examples/base/src/pages/_app.tsx, packages/platform/examples/base/src/pages/api/refresh.ts | No |
| `NEXT_PUBLIC_ORG_SELF_SERVE_ENABLED` | apps/web/playwright/organization/organization-creation-flows.e2e.ts, packages/lib/constants.ts | No |
| `NEXT_PUBLIC_ORGANIZATIONS_MIN_SELF_SERVE_SEATS` | .env.example | Yes |
| `NEXT_PUBLIC_ORGANIZATIONS_SELF_SERVE_PRICE_NEW` | .env.example, packages/lib/constants.ts | Yes |
| `NEXT_PUBLIC_POSTHOG_HOST` | .env.example, apps/web/modules/ee/posthog/provider.tsx | No |
| `NEXT_PUBLIC_POSTHOG_KEY` | .env.example, apps/web/modules/ee/posthog/provider.tsx, apps/web/modules/ee/posthog/providerDynamic.tsx | No |
| `NEXT_PUBLIC_QUERY_AVAILABLE_SLOTS_INTERVAL_SECONDS` | .env.example, packages/lib/constants.ts | No |
| `NEXT_PUBLIC_QUERY_RESERVATION_INTERVAL_SECONDS` | .env.example, packages/lib/constants.ts | No |
| `NEXT_PUBLIC_QUERY_RESERVATION_STALE_TIME_SECONDS` | .env.example, packages/lib/constants.ts | No |
| `NEXT_PUBLIC_QUICK_AVAILABILITY_ROLLOUT` | .env.example, packages/lib/constants.ts | Yes |
| `NEXT_PUBLIC_SENDER_ID` | .env.example, packages/lib/constants.ts | No |
| `NEXT_PUBLIC_SENDGRID_SENDER_NAME` | .env.example, packages/lib/constants.ts | No |
| `NEXT_PUBLIC_SENTRY_DSN` | .env.example, apps/api/v1/instrumentation.ts, apps/api/v1/next.config.js, apps/web/instrumentation.ts, apps/web/sentry.edge.config.ts, apps/web/sentry.server.config.ts, packages/features/ee/api-keys/lib/autoLock.ts, packages/lib/sentryWrapper.ts | No |
| `NEXT_PUBLIC_SENTRY_DSN_CLIENT` | .env.example, apps/web/instrumentation-client.ts | No |
| `NEXT_PUBLIC_SINGLE_ORG_MODE_ENABLED` | apps/web/test/lib/next-config.test.ts | No |
| `NEXT_PUBLIC_SINGLE_ORG_SLUG` | .env.example, apps/web/getNextjsOrgRewriteConfig.ts, apps/web/next.config.ts, packages/features/ee/organizations/lib/service/onboarding/BillingEnabledOrgOnboardingService.ts, packages/features/ee/organizations/lib/service/onboarding/SelfHostedOnboardingService.ts, packages/lib/constants.ts | No |
| `NEXT_PUBLIC_STRIPE_CREDITS_PRICE_ID` | .env.example, packages/features/ee/billing/api/webhook/_checkout.session.completed.ts, packages/lib/constants.ts, packages/trpc/server/routers/viewer/credits/buyCredits.handler.ts | No |
| `NEXT_PUBLIC_STRIPE_PREMIUM_NEW_PLAN_PRICE` | .env.example | No |
| `NEXT_PUBLIC_STRIPE_PREMIUM_PLAN_PRICE` | .env.example | No |
| `NEXT_PUBLIC_STRIPE_PREMIUM_PLAN_PRICE_MONTHLY` | packages/app-store/stripepayment/lib/constants.ts, packages/lib/constants.ts | No |
| `NEXT_PUBLIC_STRIPE_PREMIUM_PLAN_PRODUCT_ID` | packages/app-store/stripepayment/lib/constants.ts | No |
| `NEXT_PUBLIC_STRIPE_PRO_PLAN_PRICE` | .env.example | No |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | apps/web/playwright/lib/testUtils.ts, packages/app-store/stripepayment/_metadata.ts, packages/app-store/stripepayment/lib/client/getStripe.ts, packages/lib/constants.ts, scripts/seed-app-store.ts | No |
| `NEXT_PUBLIC_STRIPE_TEAM_MONTHLY_PRICE_ID` | packages/app-store/stripepayment/lib/constants.ts | No |
| `NEXT_PUBLIC_SUPPORT_MAIL_ADDRESS` | .env.example, packages/lib/constants.ts | Yes |
| `NEXT_PUBLIC_TEAM_IMPERSONATION` | .env.example, apps/web/modules/ee/teams/components/MemberList.tsx, packages/features/ee/impersonation/lib/ImpersonationProvider.test.ts, packages/features/ee/impersonation/lib/ImpersonationProvider.ts | Yes |
| `NEXT_PUBLIC_UNIT_TESTS` | packages/emails/templates/_base-email.ts | No |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | .env.example, apps/web/modules/notifications/components/WebPushContext.tsx, packages/features/notifications/sendNotification.ts | No |
| `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA` | packages/platform/atoms/vite.config.ts, packages/ui/components/credits/Credits.tsx, packages/ui/components/icon/IconSprites.tsx | No |
| `NEXT_PUBLIC_VERCEL_URL` | packages/lib/constants.ts | No |
| `NEXT_PUBLIC_VERCEL_USE_BOTID_IN_BOOKER` | .env.example, apps/web/instrumentation-client.ts, apps/web/next.config.ts, packages/features/bot-detection/BotDetectionService.ts | No |
| `NEXT_PUBLIC_WEBAPP_URL` | .env.example, playwright.config.ts, vitest.config.mts, apps/api/v2/src/ee/event-types-private-links/services/private-links.service.ts, apps/web/getNextjsOrgRewriteConfig.ts, apps/web/next.config.ts, apps/web/app/_trpc/trpc-client.ts, apps/web/components/apps/alby/Setup.tsx, apps/web/components/apps/wipemycalother/confirmDialog.tsx, apps/web/modules/signup-view.tsx, apps/web/modules/bookings/components/event-meta/AvailableEventLocations.tsx, apps/web/modules/ee/common/components/PoweredBy.tsx, apps/web/modules/settings/my-account/profile-view.tsx, apps/web/playwright/lib/next-server.ts, apps/web/server/lib/auth/sso/[provider]/getServerSideProps.tsx, apps/web/test/lib/next-config.test.ts, packages/emails/templates/organizer-request-email.ts, packages/embeds/vite.config.js, packages/features/auth/lib/passwordResetRequest.ts, packages/features/calendar-subscription/adapters/GoogleCalendarSubscription.adapter.ts, packages/lib/constants.ts, packages/platform/atoms/vite.config.ts, packages/prisma/seed-pbac-only.ts, packages/trpc/react/trpc.ts, packages/trpc/server/routers/viewer/admin/sendPasswordReset.handler.ts, packages/trpc/server/routers/viewer/slots/reserveSlot.handler.test.ts, packages/trpc/server/routers/viewer/sso/get.handler.ts, packages/trpc/server/routers/viewer/sso/update.handler.ts, packages/trpc/server/routers/viewer/sso/updateOIDC.handler.ts, packages/ui/components/icon/IconSprites.tsx, scripts/seed-pbac-organization.ts, scripts/seed-utils.ts, scripts/seed.ts | Yes |
| `NEXT_PUBLIC_WEBSITE_PRIVACY_POLICY_URL` | .env.example, packages/lib/constants.ts | No |
| `NEXT_PUBLIC_WEBSITE_TERMS_URL` | .env.example, packages/lib/constants.ts | No |
| `NEXT_PUBLIC_WEBSITE_URL` | .env.example, apps/web/next.config.ts, apps/web/components/setup/AdminUser.tsx, apps/web/components/ui/UsernameAvailability/PremiumTextfield.tsx, apps/web/modules/signup-view.tsx, apps/web/modules/ee/organizations/components/OtherTeamListItem.tsx, apps/web/modules/event-types/components/CreateEventTypeDialog.tsx, apps/web/modules/event-types/components/DuplicateDialog.tsx, apps/web/modules/settings/admin/impersonation-view.tsx, apps/web/modules/settings/teams/[id]/event-types-view.tsx, apps/web/playwright/lib/next-server.ts, packages/emails/src/templates/MonthlyDigestEmail.tsx, packages/lib/constants.ts | Yes |
| `NEXT_PUBLIC_X_CAL_ID` | packages/platform/examples/base/src/pages/_app.tsx, packages/platform/examples/base/src/pages/api/managed-user.ts, packages/platform/examples/base/src/pages/api/refresh.ts | No |
| `NEXT_PUBLIC_ZENDESK_KEY` | .env.example, apps/web/modules/ee/support/lib/zendesk/ZendeskMenuItem.tsx | No |
| `VITE_BOOKER_EMBED_API_URL` | packages/platform/atoms/booker-embed/BookerEmbed.tsx, packages/platform/atoms/router/Router.tsx | No |
| `VITE_BOOKER_EMBED_OAUTH_CLIENT_ID` | packages/platform/atoms/booker-embed/BookerEmbed.tsx | No |

### Other

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `__NEXT_MANUAL_TRAILING_SLASH` | packages/platform/atoms/vite.config.ts | No |
| `__NEXT_ROUTER_BASEPATH` | packages/platform/atoms/vite.config.ts | No |
| `__NEXT_TRAILING_SLASH` | packages/platform/atoms/vite.config.ts | No |
| `_CAL_INTERNAL_PAST_BOOKING_RESCHEDULE_CHANGE_TEAM_IDS` | packages/lib/constants.ts | No |
| `ANALYZE` | apps/web/next.config.ts | No |
| `ATOMS_E2E_APPLE_CONNECT_APP_SPECIFIC_PASSCODE` | packages/platform/examples/base/tests/connect-atoms/apple-connect.e2e.ts | No |
| `ATOMS_E2E_APPLE_ID` | packages/platform/examples/base/tests/connect-atoms/apple-connect.e2e.ts | No |
| `ATOMS_E2E_OAUTH_CLIENT_ID` | packages/platform/examples/base/playwright.config.ts | No |
| `ATOMS_E2E_OAUTH_CLIENT_ID_BOOKER_EMBED` | packages/platform/examples/base/playwright.config.ts | No |
| `ATOMS_E2E_ORG_ID` | packages/platform/examples/base/playwright.config.ts | No |
| `AVATARAPI_USERNAME` | .env.example, apps/web/app/api/auth/signup/handlers/calcomSignupHandler.ts, apps/web/app/api/auth/signup/handlers/selfHostedHandler.ts, packages/features/auth/signup/utils/prefillAvatar.ts | No |
| `AWAITING_PAYMENT_EMAIL_DELAY_MINUTES` | .env.example, packages/app-store/stripepayment/lib/PaymentService.ts | No |
| `AXIOM_DATASET` | apps/api/v2/src/lib/logger.ts | No |
| `B2_BUCKET_ID` | .env.example, apps/web/app/api/compliance/download/route.ts | No |
| `B2_BUCKET_NAME` | .env.example, apps/web/app/api/compliance/download/route.ts | No |
| `BASECAMP3_CLIENT_ID` | scripts/seed-app-store.ts | No |
| `BASECAMP3_USER_AGENT` | scripts/seed-app-store.ts | No |
| `BLACKLISTED_GUEST_EMAILS` | .env.example, packages/features/bookings/lib/handleNewBooking/checkIfBookerEmailIsBlocked.ts, packages/features/bookings/lib/handleNewBooking/test/booking-validations.test.ts, packages/features/bookings/lib/service/RegularBookingService.ts, packages/trpc/server/routers/publicViewer/checkIfUserEmailVerificationRequired.handler.ts, packages/trpc/server/routers/viewer/bookings/addGuests.handler.ts | No |
| `BOOKING_LOGGING_EVENT_IDS` | packages/features/bookings/lib/isEventTypeLoggingEnabled.ts | No |
| `BOOKING_LOGGING_USER_OR_TEAM_NAME` | packages/features/bookings/lib/isEventTypeLoggingEnabled.ts | No |
| `BUILD_STANDALONE` | apps/web/next.config.ts | No |
| `CAL_AI_CALL_RATE_PER_MINUTE` | .env.example, apps/web/app/api/webhooks/retell-ai/route.ts | Yes |
| `CAL_VIDEO_ASSUME_ROLE_ARN` | .env.example, packages/app-store/dailyvideo/lib/VideoApiAdapter.ts | No |
| `CAL_VIDEO_BUCKET_NAME` | .env.example, packages/app-store/dailyvideo/lib/VideoApiAdapter.ts | No |
| `CAL_VIDEO_BUCKET_REGION` | .env.example, packages/app-store/dailyvideo/lib/VideoApiAdapter.ts | No |
| `CAL_VIDEO_MEETING_LINK_FOR_TESTING` | .env.example, packages/lib/constants.ts | No |
| `CALCOM_ENV` | apps/api/v1/next.config.js, apps/web/next.config.ts, packages/lib/constants.ts | No |
| `CALCOM_PRIVATE_API_ROUTE` | .env.example, packages/lib/constants.ts | Yes |
| `CALCOM_TELEMETRY_DISABLED` | .env.example, packages/lib/telemetry.ts | No |
| `CI` | playwright.config.ts, apps/api/v2/jest-e2e.ts, apps/api/v2/test/jest.setup-e2e.ts, apps/web/lib/daily-webhook/tests/recorded-daily-video.test.ts, apps/web/pages/api/book/recurring-event.test.ts, packages/app-store/googlecalendar/lib/__tests__/CalendarService.test.ts, packages/features/bookings/lib/handleNewBooking/global-booking-limits.test.ts, packages/features/bookings/lib/handleNewBooking/test/booking-limits.test.ts, packages/features/bookings/lib/handleNewBooking/test/complex-schedules.test.ts, packages/features/bookings/lib/handleNewBooking/test/date-overrides.test.ts, packages/features/bookings/lib/handleNewBooking/test/delegation-credential.test.ts, packages/features/bookings/lib/handleNewBooking/test/dynamic-group-booking.test.ts, packages/features/bookings/lib/handleNewBooking/test/email-verification-booking.test.ts, packages/features/bookings/lib/handleNewBooking/test/fresh-booking.test.ts, packages/features/bookings/lib/handleNewBooking/test/post-booking-handling.test.ts, packages/features/bookings/lib/handleNewBooking/test/reschedule.test.ts, packages/features/bookings/lib/handleNewBooking/test/round-robin-no-hosts.test.ts, packages/features/bookings/lib/handleNewBooking/test/spam-booking.integration-test.ts, packages/features/bookings/lib/handleNewBooking/test/webhook-producer-booking-requested.test.ts, packages/features/bookings/lib/handleNewBooking/test/workflow-notifications.test.ts, packages/features/bookings/lib/handleNewBooking/test/team-bookings/collective-reschedule-destination-calendar.test.ts, packages/features/bookings/lib/handleNewBooking/test/team-bookings/collective-scheduling.test.ts, packages/features/bookings/lib/service/RecurringBookingService.test.ts, packages/features/tasker/tasks/triggerNoShow/triggerGuestNoShow.test.ts, packages/features/tasker/tasks/triggerNoShow/triggerHostNoShow.test.ts, packages/platform/examples/base/playwright.config.ts | No |
| `CLOSECOM_CLIENT_ID` | .env.example, packages/lib/CloseCom.ts, scripts/seed-app-store.ts | No |
| `CLOUDFLARE_ACCOUNT_ID` | packages/features/ee/workflows/lib/urlScanner.ts, packages/lib/constants.ts | No |
| `CLOUDFLARE_DNS` | packages/lib/domainManager/organization.ts | No |
| `CLOUDFLARE_VERCEL_CNAME` | packages/lib/domainManager/deploymentServices/cloudflare.ts | No |
| `CLOUDFLARE_ZONE_ID` | packages/lib/domainManager/deploymentServices/cloudflare.ts | No |
| `CRON_ENABLE_APP_SYNC` | .env.example, apps/web/app/api/cron/syncAppMeta/route.ts | Yes |
| `CSP_POLICY` | .env.example, apps/web/next.config.ts, apps/web/proxy.ts, apps/web/lib/csp.ts | No |
| `DAILY_SCALE_PLAN` | scripts/seed-app-store.ts | No |
| `DAILY_VIDEO_REGION` | packages/app-store/dailyvideo/lib/VideoApiAdapter.ts | No |
| `DEBUG` | packages/app-store-cli/src/utils/execSync.ts | No |
| `DIRECTORY_IDS_TO_LOG` | .env.example, packages/lib/constants.ts | No |
| `E2E_DEV_SERVER` | apps/web/playwright/lib/next-server.ts | No |
| `E2E_TEST_APPLE_CALENDAR_EMAIL` | .env.example | Yes |
| `E2E_TEST_CALCOM_QA_EMAIL` | .env.example, packages/app-store/googlecalendar/tests/google-calendar.e2e.ts, scripts/seed.ts | Yes |
| `E2E_TEST_MAILHOG_ENABLED` | .env.example, packages/lib/constants.ts | No |
| `E2E_TEST_OIDC_CLIENT_ID` | .env.example | No |
| `E2E_TEST_OIDC_USER_EMAIL` | .env.example | No |
| `E2E_TEST_SAML_ADMIN_EMAIL` | .env.example | No |
| `EDGE_CONFIG` | .env.example | No |
| `EMAIL_FROM` | .env.example, apps/web/next.config.ts, apps/web/app/(use-page-wrapper)/auth/verify/page.tsx, packages/features/auth/lib/sendVerificationRequest.ts, packages/lib/serverConfig.ts | Yes |
| `EMAIL_FROM_NAME` | .env.example, packages/lib/constants.ts | Yes |
| `EMAIL_SERVER` | packages/lib/serverConfig.ts | No |
| `EMAIL_SERVER_USER` | packages/lib/serverConfig.ts | No |
| `EMBED_PUBLIC_EMBED_FINGER_PRINT` | packages/embeds/vite.config.js, packages/embeds/embed-core/src/embed.ts, packages/embeds/embed-core/src/preview.ts | No |
| `EMBED_PUBLIC_EMBED_VERSION` | packages/embeds/vite.config.js, packages/embeds/embed-core/src/embed.ts, packages/embeds/embed-core/src/preview.ts | No |
| `ENABLE_ASYNC_TASKER` | .env.example, packages/lib/constants.ts | Yes |
| `ENTERPRISE_SLUGS` | packages/features/ee/billing/constants.ts | No |
| `FORMBRICKS_FEEDBACK_SURVEY_ID` | .env.example, packages/lib/formbricks.ts | No |
| `GOOGLE_ADS_ENABLED` | .env.example, packages/lib/tracking/server.ts | Yes |
| `GOOGLE_CLIENT_ID` | example-apps/credential-sync/constants.ts | No |
| `GOOGLE_LOGIN_ENABLED` | .env.example, apps/web/server/lib/constants.ts, packages/features/auth/lib/next-auth-options.ts | Yes |
| `HEROKU_APP_NAME` | packages/lib/constants.ts | No |
| `HUBSPOT_CLIENT_ID` | packages/app-store/hubspot/_metadata.ts, scripts/seed-app-store.ts | No |
| `INTEGRATION_TEST_MODE` | vitest.config.mts, apps/web/app/api/recorded-daily-video/route.ts, packages/emails/templates/_base-email.ts, packages/embeds/embed-core/src/EmbedElement.ts, packages/embeds/embed-core/src/embed.ts, packages/embeds/embed-core/src/embed-iframe/lib/utils.ts, packages/features/bookings/lib/getBookingFields.ts, packages/features/ee/organizations/lib/orgDomains.ts, packages/features/ee/workflows/lib/reminders/providers/sendgridProvider.ts, packages/features/ee/workflows/lib/reminders/providers/twilioProvider.ts, packages/trpc/server/routers/viewer/slots/util.ts | No |
| `INTEGRATION_TESTS` | packages/testing/src/setupVitest.ts | No |
| `IP_BANLIST` | packages/lib/getIP.ts | No |
| `IS_E2E` | packages/lib/constants.ts | No |
| `LARK_OPEN_APP_ID` | scripts/seed-app-store.ts | No |
| `LINKEDIN_ADS_ENABLED` | .env.example, packages/lib/tracking/server.ts | Yes |
| `LOG_LEVEL` | apps/api/v2/src/lib/logger.ts | No |
| `LOGGER_BRIDGE_LOG_LEVEL` | apps/api/v2/src/lib/logger.bridge.ts | No |
| `MOCK_PAYMENT_APP_ENABLED` | apps/web/playwright/payment.e2e.ts | No |
| `MS_GRAPH_CLIENT_ID` | packages/features/auth/lib/outlook.test.ts, packages/features/auth/lib/outlook.ts, scripts/seed-app-store.ts | No |
| `NEXT_RUNTIME` | apps/api/v1/instrumentation.ts, apps/web/instrumentation.ts | No |
| `NODE_ENV` | apps/api/v1/next.config.js, apps/api/v1/pages/api/teams/_post.ts, apps/api/v2/src/app.module.ts, apps/api/v2/src/main.ts, apps/api/v2/src/lib/logger.ts, apps/web/instrumentation-client.ts, apps/web/instrumentation.ts, apps/web/next.config.ts, apps/web/app/layout.tsx, apps/web/app/api/defaultResponderForAppDir.ts, apps/web/app/e2e/session-warmup/page.tsx, apps/web/modules/ee/common/components/LicenseRequired.tsx, apps/web/modules/ee/posthog/provider.tsx, packages/features/calAIPhone/AIPhoneServiceRegistry.ts, packages/features/calAIPhone/initializeRegistry.ts, packages/features/ee/payments/server/stripe.ts, packages/features/ee/teams/lib/payments.ts, packages/features/tasker/index.ts, packages/i18n/next-i18next.config.js, packages/lib/constants.ts, packages/lib/env.ts, packages/lib/piiFreeData.ts, packages/lib/sentryWrapper.ts, packages/lib/server/defaultResponder.ts, packages/lib/server/perfObserver.ts, packages/platform/atoms/vite.config.ts, packages/platform/examples/base/src/lib/prismaClient.ts, packages/prisma/index.ts, packages/trpc/server/createNextApiHandler.ts | No |
| `OAUTH2_REDIRECT_URI` | packages/platform/examples/base/src/pages/api/oauth2-user.ts | No |
| `ORG_MONTHLY_CREDITS` | .env.example, packages/features/ee/billing/credit-service.ts | No |
| `ORGANIZATION_ID` | packages/platform/examples/base/src/pages/api/managed-user.ts | No |
| `ORGANIZATIONS_AUTOLINK` | .env.example, packages/features/auth/lib/next-auth-options.ts | No |
| `ORGANIZATIONS_ENABLED` | .env.example, apps/web/next.config.ts | No |
| `OUTLOOK_LOGIN_ENABLED` | .env.example, packages/features/auth/lib/outlook.test.ts, packages/features/auth/lib/outlook.ts | Yes |
| `PAYMENT_FEE_FIXED` | apps/web/playwright/lib/testUtils.ts, scripts/seed-app-store.ts | No |
| `PAYMENT_FEE_PERCENTAGE` | apps/web/playwright/lib/testUtils.ts, scripts/seed-app-store.ts | No |
| `PGSSLMODE` | .env.example | No |
| `PLATFORM_ENTERPRISE_SLUGS` | packages/features/ee/billing/constants.ts | No |
| `PLAYWRIGHT_HEADLESS` | playwright.config.ts, packages/platform/examples/base/playwright.config.ts | No |
| `PROJECT_ID_VERCEL` | .env.example, packages/lib/domainManager/deploymentServices/vercel.ts | No |
| `PWDEBUG` | playwright.config.ts | No |
| `RETELL_AI_TEST_EVENT_TYPE_MAP` | .env.example, packages/lib/constants.ts | No |
| `RETELL_AI_TEST_MODE` | .env.example, packages/lib/constants.ts | Yes |
| `SALESFORCE_GRAPHQL_DELAY_MS` | .env.example, packages/app-store/salesforce/lib/graphql/SalesforceGraphQLClient.ts | Yes |
| `SALESFORCE_GRAPHQL_MAX_DELAY_MS` | .env.example, packages/app-store/salesforce/lib/graphql/SalesforceGraphQLClient.ts | Yes |
| `SALESFORCE_GRAPHQL_MAX_RETRIES` | .env.example, packages/app-store/salesforce/lib/graphql/SalesforceGraphQLClient.ts | Yes |
| `SAML_ADMINS` | .env.example, packages/features/ee/sso/lib/saml.ts | No |
| `SEED_OAUTH2_CLIENT_ID` | .env.example, scripts/seed.ts | No |
| `SEED_PLATFORM_OAUTH_CLIENT_ID` | .env.example, scripts/seed.ts | No |
| `SEND_FEEDBACK_EMAIL` | .env.example, packages/emails/templates/feedback-email.ts | No |
| `SENDGRID_EMAIL` | .env.example, packages/features/ee/workflows/api/scheduleEmailReminders.ts, packages/features/ee/workflows/lib/reminders/providers/sendgridProvider.ts | No |
| `SENTRY_DEBUG` | .env.example, apps/web/instrumentation-client.ts, apps/web/sentry.edge.config.ts, apps/web/sentry.server.config.ts | No |
| `SENTRY_DSN` | apps/api/v2/src/instrument.ts | No |
| `SENTRY_MAX_SPANS` | .env.example | No |
| `SENTRY_ORG` | .env.example | No |
| `SENTRY_PROJECT` | .env.example | No |
| `SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE` | .env.example, apps/web/instrumentation-client.ts | No |
| `SENTRY_REPLAYS_SESSION_SAMPLE_RATE` | .env.example, apps/web/instrumentation-client.ts | No |
| `SENTRY_SAMPLE_RATE` | .env.example, apps/web/instrumentation-client.ts, apps/web/sentry.edge.config.ts, apps/web/sentry.server.config.ts | No |
| `SENTRY_TRACES_SAMPLE_RATE` | .env.example, apps/web/instrumentation-client.ts, apps/web/sentry.edge.config.ts, apps/web/sentry.server.config.ts, packages/lib/sentryWrapper.ts | No |
| `SKIP_DB_MIGRATIONS` | packages/prisma/auto-migrations.ts | No |
| `SLOTS_CACHE_TTL` | packages/trpc/server/routers/viewer/slots/util.ts | No |
| `STRIPE_CLIENT_ID` | .env.example, apps/web/playwright/lib/testUtils.ts, packages/app-store/stripepayment/_metadata.ts, packages/lib/constants.ts, scripts/seed-app-store.ts | No |
| `STRIPE_ORG_ANNUAL_PRICE_ID` | .env.example, packages/features/ee/teams/lib/payments.ts | No |
| `STRIPE_ORG_MONTHLY_PRICE_ID` | .env.example, packages/features/ee/billing/active-user/seed-active-user-test.ts, packages/features/ee/billing/service/highWaterMark/seed-hwm-test.ts, packages/features/ee/teams/lib/payments.ts, packages/trpc/server/routers/viewer/organizations/createWithPaymentIntent.handler.test.ts, packages/trpc/server/routers/viewer/organizations/intentToCreateOrg.handler.test.ts | No |
| `STRIPE_ORG_PRODUCT_ID` | .env.example, packages/features/ee/billing/api/webhook/_invoice.paid.ts, packages/features/ee/organizations/lib/OrganizationPaymentService.ts, packages/trpc/server/routers/viewer/organizations/createWithPaymentIntent.handler.test.ts, packages/trpc/server/routers/viewer/organizations/intentToCreateOrg.handler.test.ts | No |
| `STRIPE_ORG_TRIAL_DAYS` | .env.example, packages/lib/constants.ts | No |
| `STRIPE_PHONE_NUMBER_MONTHLY_PRICE_ID` | .env.example, packages/app-store/stripepayment/lib/constants.ts | No |
| `STRIPE_TEAM_ANNUAL_PRICE_ID` | .env.example, packages/features/ee/teams/lib/payments.ts | No |
| `STRIPE_TEAM_MONTHLY_PRICE_ID` | .env.example, apps/api/v1/pages/api/teams/_post.ts, packages/features/ee/billing/credit-service.ts, packages/features/ee/billing/service/highWaterMark/seed-hwm-test.ts, packages/features/ee/billing/service/highWaterMark/__tests__/HighWaterMarkStripe.integration-test.ts, packages/features/ee/teams/lib/payments.ts | No |
| `STRIPE_TEAM_PRODUCT_ID` | .env.example, packages/features/ee/billing/api/webhook/_customer.subscription.deleted.ts, packages/features/ee/billing/api/webhook/_invoice.paid.ts | No |
| `TANDEM_CLIENT_ID` | scripts/seed-app-store.ts | No |
| `TASKER_ENABLE_EMAILS` | .env.example | Yes |
| `TASKER_ENABLE_WEBHOOKS` | .env.example, packages/features/webhooks/lib/sendOrSchedulePayload.ts, packages/features/webhooks/lib/service/WebhookService.test.ts, packages/features/webhooks/lib/service/WebhookService.ts | Yes |
| `TEAM_ID_VERCEL` | .env.example, packages/lib/domainManager/deploymentServices/vercel.ts | No |
| `TELEMETRY_DEBUG` | packages/lib/telemetry.ts | No |
| `TRIGGER_DEV_PROJECT_REF` | .env.example, packages/features/trigger.config.ts | No |
| `TRIGGER_DEV_VERCEL_PROJECT_ID` | packages/features/trigger.config.ts | No |
| `TRIGGER_DEV_VERCEL_TEAM_ID` | packages/features/trigger.config.ts | No |
| `TRIGGER_VERSION` | apps/api/v2/src/main.ts, apps/api/v2/src/vercel-webhook.controller.e2e-spec.ts, apps/api/v2/src/vercel-webhook.controller.ts | No |
| `TWILIO_MESSAGING_SID` | .env.example, packages/features/ee/workflows/lib/reminders/providers/twilioProvider.ts | No |
| `TWILIO_OPT_OUT_ENABLED` | .env.example, packages/features/ee/workflows/lib/service/workflowOptOutService.ts | No |
| `TWILIO_PHONE_NUMBER` | .env.example, packages/features/ee/workflows/lib/reminders/providers/twilioProvider.ts | No |
| `TWILIO_SID` | .env.example, packages/features/ee/workflows/lib/reminders/providers/twilioProvider.ts | No |
| `TWILIO_VERIFY_SID` | .env.example, packages/features/ee/workflows/lib/reminders/providers/twilioProvider.ts | No |
| `TWILIO_WHATSAPP_CANCELLED_CONTENT_SID` | .env.example, packages/features/ee/workflows/lib/reminders/templates/whatsapp/ContentSidMapping.ts | No |
| `TWILIO_WHATSAPP_COMPLETED_CONTENT_SID` | .env.example, packages/features/ee/workflows/lib/reminders/templates/whatsapp/ContentSidMapping.ts | No |
| `TWILIO_WHATSAPP_PHONE_NUMBER` | .env.example, packages/features/ee/workflows/lib/reminders/providers/twilioProvider.ts | No |
| `TWILIO_WHATSAPP_REMINDER_CONTENT_SID` | .env.example, packages/features/ee/workflows/lib/reminders/templates/whatsapp/ContentSidMapping.ts | No |
| `TWILIO_WHATSAPP_RESCHEDULED_CONTENT_SID` | .env.example, packages/features/ee/workflows/lib/reminders/templates/whatsapp/ContentSidMapping.ts | No |
| `TZ` | .env.example, vitest.config.mts, vitest.workspace.ts, packages/lib/isOutOfBounds.timezone.test.ts | Yes |
| `USE_POOL` | packages/platform/libraries/vite.config.js, packages/prisma/index.ts | No |
| `VERCEL` | apps/api/v2/src/bootstrap.ts, apps/api/v2/src/main.ts | No |
| `VERCEL_ENV` | apps/web/pages/_document.tsx | No |
| `VITAL_DEVELOPMENT_MODE` | scripts/seed-app-store.ts | No |
| `VITAL_REGION` | scripts/seed-app-store.ts | No |
| `VITEST_MODE` | vitest.config.mts, vitest.workspace.ts | No |
| `ZAPIER_INVITE_LINK` | scripts/seed-app-store.ts | No |
| `ZOHOCRM_CLIENT_ID` | scripts/seed-app-store.ts | No |
| `ZOOM_CLIENT_ID` | example-apps/credential-sync/constants.ts, scripts/seed-app-store.ts | No |

## Missing Documentation

The following variables are used but not listed in `.env.example`:

- `__NEXT_I18N_SUPPORT`
- `__NEXT_MANUAL_TRAILING_SLASH`
- `__NEXT_ROUTER_BASEPATH`
- `__NEXT_TRAILING_SLASH`
- `_CAL_INTERNAL_PAST_BOOKING_RESCHEDULE_CHANGE_TEAM_IDS`
- `ANALYZE`
- `API_PORT`
- `ATOMS_E2E_API_URL`
- `ATOMS_E2E_APPLE_CONNECT_APP_SPECIFIC_PASSCODE`
- `ATOMS_E2E_APPLE_ID`
- `ATOMS_E2E_OAUTH_CLIENT_ID`
- `ATOMS_E2E_OAUTH_CLIENT_ID_BOOKER_EMBED`
- `ATOMS_E2E_OAUTH_CLIENT_SECRET`
- `ATOMS_E2E_ORG_ID`
- `AUTH_BEARER_TOKEN_CLOUDFLARE`
- `AXIOM_DATASET`
- `AXIOM_TOKEN`
- `BASECAMP3_CLIENT_ID`
- `BASECAMP3_CLIENT_SECRET`
- `BASECAMP3_USER_AGENT`
- `BOOKING_LOGGING_EVENT_IDS`
- `BOOKING_LOGGING_USER_OR_TEAM_NAME`
- `BUILD_STANDALONE`
- `CALCOM_ADMIN_API_KEY`
- `CALCOM_ENV`
- `CI`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_DNS`
- `CLOUDFLARE_URL_SCANNER_API_TOKEN`
- `CLOUDFLARE_VERCEL_CNAME`
- `CLOUDFLARE_ZONE_ID`
- `CRON_SECRET`
- `DAILY_API_KEY`
- `DAILY_SCALE_PLAN`
- `DAILY_VIDEO_REGION`
- `DAILY_WEBHOOK_SECRET`
- `DEBUG`
- `DEVIN_API_KEY`
- `DOCS_URL`
- `E2E_DEV_SERVER`
- `EMAIL_SERVER`
- `EMAIL_SERVER_PASSWORD`
- `EMAIL_SERVER_USER`
- `EMBED_PUBLIC_EMBED_FINGER_PRINT`
- `EMBED_PUBLIC_EMBED_LIB_URL`
- `EMBED_PUBLIC_EMBED_VERSION`
- `EMBED_PUBLIC_VERCEL_URL`
- `EMBED_PUBLIC_WEBAPP_URL`
- `ENTERPRISE_SLUGS`
- `ENVIRONMENT_URL`
- `EXCHANGE_DEFAULT_EWS_URL`
- `GIPHY_API_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `HEROKU_APP_NAME`
- `HUBSPOT_CLIENT_ID`
- `HUBSPOT_CLIENT_SECRET`
- `INTEGRATION_TEST_MODE`
- `INTEGRATION_TESTS`
- `IP_BANLIST`
- `IS_E2E`
- `LARK_OPEN_APP_ID`
- `LARK_OPEN_APP_SECRET`
- `LARK_OPEN_VERIFICATION_TOKEN`
- `LOCAL_TESTING_DOMAIN_VERCEL`
- `LOG_LEVEL`
- `LOGGER_BRIDGE_LOG_LEVEL`
- `MOCK_PAYMENT_APP_ENABLED`
- `MS_GRAPH_CLIENT_ID`
- `MS_GRAPH_CLIENT_SECRET`
- `NEXT_PUBLIC_API_HITPAY_PRODUCTION`
- `NEXT_PUBLIC_API_HITPAY_SANDBOX`
- `NEXT_PUBLIC_API_V2_ROOT_URL`
- `NEXT_PUBLIC_CALCOM_API_URL`
- `NEXT_PUBLIC_CALCOM_VERSION`
- `NEXT_PUBLIC_EMBED_FINGER_PRINT`
- `NEXT_PUBLIC_EMBED_VERSION`
- `NEXT_PUBLIC_ENABLE_PROFILE_SWITCHER`
- `NEXT_PUBLIC_GTM_ID`
- `NEXT_PUBLIC_OAUTH2_CLIENT_ID`
- `NEXT_PUBLIC_OAUTH2_MODE`
- `NEXT_PUBLIC_ORG_SELF_SERVE_ENABLED`
- `NEXT_PUBLIC_SINGLE_ORG_MODE_ENABLED`
- `NEXT_PUBLIC_STRIPE_PREMIUM_PLAN_PRICE_MONTHLY`
- `NEXT_PUBLIC_STRIPE_PREMIUM_PLAN_PRODUCT_ID`
- `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`
- `NEXT_PUBLIC_STRIPE_TEAM_MONTHLY_PRICE_ID`
- `NEXT_PUBLIC_UNIT_TESTS`
- `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA`
- `NEXT_PUBLIC_VERCEL_URL`
- `NEXT_PUBLIC_X_CAL_ID`
- `NEXT_RUNTIME`
- `NODE_ENV`
- `OAUTH2_CLIENT_SECRET_PLAIN`
- `OAUTH2_REDIRECT_URI`
- `ORGANIZATION_ID`
- `ORGANIZER_EMAIL_EXEMPT_DOMAINS`
- `PAYMENT_FEE_FIXED`
- `PAYMENT_FEE_PERCENTAGE`
- `PLATFORM_ENTERPRISE_SLUGS`
- `PLAYWRIGHT_HEADLESS`
- `PLAYWRIGHT_TEST_BASE_URL`
- `PWDEBUG`
- `RAILWAY_STATIC_URL`
- `REDIS_URL`
- `RENDER_EXTERNAL_URL`
- `RESEND_API_KEY`
- `SALESFORCE_CONSUMER_KEY`
- `SALESFORCE_CONSUMER_SECRET`
- `SENTRY_DSN`
- `SKIP_DB_MIGRATIONS`
- `SLOTS_CACHE_TTL`
- `STRIPE_API_KEY`
- `TANDEM_BASE_URL`
- `TANDEM_CLIENT_ID`
- `TANDEM_CLIENT_SECRET`
- `TELEMETRY_DEBUG`
- `TRIGGER_DEV_VERCEL_ACCESS_TOKEN`
- `TRIGGER_DEV_VERCEL_PROJECT_ID`
- `TRIGGER_DEV_VERCEL_TEAM_ID`
- `TRIGGER_VERSION`
- `UPSTASH_REDIS_REST_TOKEN`
- `UPSTASH_REDIS_REST_URL`
- `USE_POOL`
- `USERNAME_BLACKLIST_URL`
- `VERCEL`
- `VERCEL_ENV`
- `VERCEL_PROMOTE_WEBHOOK_SECRET`
- `VERCEL_URL`
- `VITAL_API_KEY`
- `VITAL_DEVELOPMENT_MODE`
- `VITAL_REGION`
- `VITAL_WEBHOOK_SECRET`
- `VITE_BOOKER_EMBED_API_URL`
- `VITE_BOOKER_EMBED_OAUTH_CLIENT_ID`
- `VITEST_MODE`
- `X_CAL_SECRET_KEY`
- `ZAPIER_INVITE_LINK`
- `ZOHOCRM_CLIENT_ID`
- `ZOHOCRM_CLIENT_SECRET`
- `ZOOM_CLIENT_ID`
- `ZOOM_CLIENT_SECRET`
- `ZOOM_REFRESH_TOKEN`

## Hardcoded Secrets Detected

> **109 potential secret(s)** found in source code. These should be moved to environment variables.

- **[CRITICAL]** 109 hardcoded secret(s) detected in source code: Hardcoded Password, Hardcoded Secret, Hardcoded Bearer Token. Move these to environment variables immediately.
- **[CRITICAL]** Hardcoded secrets can be extracted from version control history even after removal. Rotate any exposed credentials immediately.

| Severity | Type | File | Line | Snippet |
|----------|------|------|------|---------|
| HIGH | Hardcoded Password | `apps/api/v1/test/lib/booking-references.integration-test.ts` | 387 | `meetingPassword: "[REDACTED]",` |
| HIGH | Hardcoded Password | `apps/api/v1/test/lib/booking-references.integration-test.ts` | 416 | `meetingPassword: "[REDACTED]",` |
| HIGH | Hardcoded Password | `apps/api/v1/test/lib/booking-references.integration-test.ts` | 425 | `meetingPassword: "[REDACTED]",` |
| HIGH | Hardcoded Password | `apps/api/v1/test/lib/booking-references.integration-test.ts` | 454 | `meetingPassword: "[REDACTED]",` |
| HIGH | Hardcoded Password | `apps/api/v1/test/lib/booking-references.integration-test.ts` | 468 | `meetingPassword: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/vercel-webhook.controller.e2e-spec.ts` | 12 | `const WEBHOOK_SECRET = "[REDACTED]";` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/ee/bookings/2024-08-13/controllers/e2e/booking-access-auth.e2e-spec.ts` | 87 | `ownerApiKey = `cal_test_${ownerKeyString}`;` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/ee/bookings/2024-08-13/controllers/e2e/booking-access-auth.e2e-spec.ts` | 93 | `unauthorizedApiKey = `cal_test_${unauthorizedKeyString}`;` |
| HIGH | Hardcoded Password | `apps/api/v2/src/ee/bookings/2024-08-13/controllers/e2e/booking-access-auth.e2e-spec.ts` | 139 | `meetingPassword: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/ee/bookings/2024-08-13/controllers/e2e/reassign-bookings.e2e-spec.ts` | 128 | `teamUser1ApiKey = `cal_test_${keyString}`;` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/ee/bookings/2024-08-13/controllers/e2e/reassign-bookings.e2e-spec.ts` | 131 | `teamUser2ApiKey = `cal_test_${keyString2}`;` |
| HIGH | Hardcoded Password | `apps/api/v2/src/ee/bookings/2024-08-13/controllers/e2e/user-bookings.e2e-spec.ts` | 3152 | `meetingPassword: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/ee/bookings/2024-08-13/controllers/e2e/emails/team-emails.e2e-spec.ts` | 170 | `const member1ApiKey = `cal_test_${keyString}`;` |
| HIGH | Hardcoded Bearer Token | `apps/api/v2/src/ee/calendars/controllers/calendars.controller.e2e-spec.ts` | 127 | `.set("[REDACTED]", `Bearer invalid_access_token`)` |
| HIGH | Hardcoded Bearer Token | `apps/api/v2/src/ee/gcal/gcal.controller.e2e-spec.ts` | 94 | `.set("[REDACTED]", `Bearer invalid_access_token`)` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/modules/auth/oauth2/controllers/oauth2.controller.e2e-spec.ts` | 58 | `client_secret: "test-secret",` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/modules/auth/oauth2/controllers/oauth2.controller.e2e-spec.ts` | 89 | `const testClientSecret = "[REDACTED]";` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/modules/auth/oauth2/controllers/oauth2.controller.e2e-spec.ts` | 302 | `client_secret: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/modules/auth/oauth2/controllers/oauth2.controller.e2e-spec.ts` | 412 | `client_secret: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/modules/auth/oauth2/controllers/oauth2.controller.e2e-spec.ts` | 468 | `const testClientSecret = "[REDACTED]";` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/modules/oauth-clients/controllers/oauth-clients/responses/CreateOAuthClientResponse.dto.ts` | 16 | `clientSecret: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/modules/organizations/delegation-credentials/organizations-delegation-credential.controller.e2e-spec.ts` | 99 | `apiKey = `cal_test_${keyString}`;` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/modules/organizations/organizations/organizations-organizations.controller.e2e-spec.ts` | 184 | `const apiKey = `cal_test_${keyString}`;` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/modules/organizations/roles/organizations-roles.controller.e2e-spec.ts` | 169 | `legacyOrgAdminApiKey = `cal_test_${legacyOrgAdminKeyString}`;` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/modules/organizations/roles/organizations-roles.controller.e2e-spec.ts` | 175 | `legacyOrgMemberApiKey = `cal_test_${legacyOrgMemberKeyString}`;` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/modules/organizations/roles/organizations-roles.controller.e2e-spec.ts` | 181 | `pbacOrgUserWithRolePermissionApiKey = `cal_test_${pbacOrgUserWithRolePermissionKeyString}`;` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/modules/organizations/roles/organizations-roles.controller.e2e-spec.ts` | 185 | `pbacOrgUserWithoutRolePermissionApiKey = `cal_test_${pbacOrgUserWithoutRolePermissionKeyString}`;` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/modules/organizations/roles/organizations-roles.controller.e2e-spec.ts` | 191 | `nonOrgUserApiKey = `cal_test_${nonOrgUserKeyString}`;` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/modules/organizations/roles/organizations-roles.controller.e2e-spec.ts` | 313 | `const noRoleApiKey = `cal_test_${noRoleKeyString}`;` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/modules/organizations/roles/permissions/organizations-roles-permissions.controller.e2e-spec.ts` | 89 | `pbacOrgUserWithRolePermissionApiKey = `cal_test_${keyString}`;` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/modules/organizations/teams/memberships/e2e/organizations-teams-memberships-guard.controller.e2e-spec.ts` | 109 | `orgApiKey = `cal_test_${keyString}`;` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/modules/organizations/teams/roles/organizations-teams-roles.controller.e2e-spec.ts` | 183 | `legacyOrgAdminApiKey = `cal_test_${legacyOrgAdminKeyString}`;` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/modules/organizations/teams/roles/organizations-teams-roles.controller.e2e-spec.ts` | 189 | `legacyOrgMemberApiKey = `cal_test_${legacyOrgMemberKeyString}`;` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/modules/organizations/teams/roles/organizations-teams-roles.controller.e2e-spec.ts` | 195 | `pbacOrgUserWithRolePermissionApiKey = `cal_test_${pbacOrgUserWithRolePermissionKeyString}`;` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/modules/organizations/teams/roles/organizations-teams-roles.controller.e2e-spec.ts` | 199 | `pbacOrgUserWithoutRolePermissionApiKey = `cal_test_${pbacOrgUserWithoutRolePermissionKeyString}`;` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/modules/organizations/teams/roles/organizations-teams-roles.controller.e2e-spec.ts` | 205 | `nonOrgUserApiKey = `cal_test_${nonOrgUserKeyString}`;` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/modules/organizations/teams/roles/organizations-teams-roles.controller.e2e-spec.ts` | 278 | `const noRoleApiKey = `cal_test_${noRoleKeyString}`;` |
| HIGH | Hardcoded Secret | `apps/api/v2/src/modules/organizations/teams/roles/permissions/organizations-teams-roles-permissions.controller.e2e-spec.ts` | 98 | `pbacOrgUserWithRolePermissionApiKey = `cal_test_${keyString}`;` |
| HIGH | Hardcoded Secret | `apps/api/v2/test/setEnvVars.ts` | 11 | `NEXTAUTH_SECRET: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `apps/api/v2/test/setEnvVars.ts` | 12 | `JWT_SECRET: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `apps/api/v2/test/setEnvVars.ts` | 15 | `STRIPE_API_KEY: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `apps/api/v2/test/setEnvVars.ts` | 16 | `STRIPE_WEBHOOK_SECRET: "whsec_51J4",` |
| HIGH | Hardcoded Secret | `apps/web/app/api/cron/credentials/route.ts` | 80 | `access_token: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `apps/web/modules/webhooks/components/WebhookForm.tsx` | 576 | `value={changeSecret ? newSecret : "••••••••••••"}` |
| HIGH | Hardcoded Secret | `apps/web/playwright/booking-race-condition.e2e.ts` | 142 | `access_token: "[REDACTED]",` |
| HIGH | Hardcoded Password | `apps/web/playwright/impersonation.e2e.ts` | 15 | `password: "ADMINadmin2022!",` |
| HIGH | Hardcoded Secret | `apps/web/playwright/payment-apps.e2e.ts` | 60 | `webhook_endpoint_secret: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `apps/web/playwright/payment-apps.e2e.ts` | 106 | `access_token: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `apps/web/playwright/payment-apps.e2e.ts` | 303 | `access_token: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `apps/web/playwright/payment-apps.e2e.ts` | 350 | `access_token: "[REDACTED]",` |
| HIGH | Hardcoded Password | `apps/web/playwright/signup.e2e.ts` | 123 | `const originalPassword = "OriginalPass99!";` |
| HIGH | Hardcoded Password | `apps/web/playwright/signup.e2e.ts` | 124 | `const attackerPassword = "AttackerPass99!";` |
| HIGH | Hardcoded Password | `apps/web/playwright/signup.e2e.ts` | 203 | `password: "Password99!",` |
| HIGH | Hardcoded Password | `apps/web/playwright/signup.e2e.ts` | 317 | `password: "Password99!",` |
| HIGH | Hardcoded Password | `apps/web/playwright/team/team-invitation.e2e.ts` | 84 | `password: "P4ssw0rd!",` |
| HIGH | Hardcoded Secret | `packages/app-store/delegationCredential.ts` | 93 | `access_token: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `packages/app-store/_utils/oauth/getCurrentTokenObject.ts` | 14 | `access_token: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `packages/app-store/googlecalendar/lib/__mocks__/getGoogleAppKeys.ts` | 6 | `client_secret: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `packages/app-store/googlecalendar/lib/__mocks__/googleapis.ts` | 69 | `access_token: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `packages/app-store/googlecalendar/lib/__mocks__/googleapis.ts` | 77 | `access_token: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `packages/app-store/googlecalendar/lib/__tests__/utils.ts` | 28 | `access_token: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `packages/app-store/tests/__mocks__/OAuthManager.ts` | 36 | `access_token: "[REDACTED]",` |
| HIGH | Hardcoded Password | `packages/features/auth/lib/ErrorCode.ts` | 2 | `IncorrectEmailPassword = "[REDACTED]",` |
| HIGH | Hardcoded Password | `packages/features/auth/lib/ErrorCode.ts` | 4 | `IncorrectPassword = "[REDACTED]",` |
| HIGH | Hardcoded Password | `packages/features/auth/lib/ErrorCode.ts` | 5 | `UserMissingPassword = "[REDACTED]",` |
| HIGH | Hardcoded Password | `packages/features/auth/signup/handlers/__tests__/mocks/signup.factories.ts` | 55 | `password: "ValidPassword123!",` |
| HIGH | Hardcoded Secret | `packages/features/calAIPhone/index.ts` | 72 | `calApiKey: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `packages/features/calAIPhone/index.ts` | 94 | `apiKey: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `packages/features/calAIPhone/providers/retellAI/index.ts` | 108 | `calApiKey: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `packages/features/calAIPhone/providers/retellAI/index.ts` | 153 | `const provider = factory.create({ apiKey: "[REDACTED]" });` |
| HIGH | Hardcoded Secret | `packages/features/calAIPhone/providers/retellAI/index.ts` | 156 | `calApiKey: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `packages/features/calendar-subscription/lib/__mocks__/delegationCredential.ts` | 5 | `key: { access_token: "test-token" },` |
| HIGH | Hardcoded Secret | `packages/features/ee/billing/organizations/stub-organization-billing.ts` | 28 | `client_secret: "[REDACTED]",` |
| HIGH | Hardcoded Password | `packages/features/ee/billing/service/dueInvoice/seed-proration-test.ts` | 41 | `const TEST_PASSWORD = "password123";` |
| HIGH | Hardcoded Password | `packages/features/ee/billing/service/highWaterMark/seed-hwm-test.ts` | 49 | `const TEST_PASSWORD = "password123";` |
| HIGH | Hardcoded Secret | `packages/features/ee/billing/service/proration/__tests__/MonthlyProrationService.integration-test.ts` | 54 | `createPaymentIntent: vi.fn().mockResolvedValue({ id: "pi_test_123", client_secret: "secret_123" }),` |
| HIGH | Hardcoded Secret | `packages/features/webhooks/lib/service/__tests__/fixtures.ts` | 80 | `secret: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `packages/platform/constants/api.ts` | 20 | `export const INVALID_ACCESS_TOKEN = "Invalid Access Token.";` |
| HIGH | Hardcoded Secret | `packages/platform/constants/api.ts` | 29 | `export const INVALID_API_KEY = "[REDACTED]";` |
| HIGH | Hardcoded Secret | `packages/testing/src/lib/bookingScenario/bookingScenario.ts` | 1229 | `access_token: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `packages/testing/src/lib/bookingScenario/bookingScenario.ts` | 1488 | `client_secret: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `packages/testing/src/lib/bookingScenario/bookingScenario.ts` | 1497 | `client_secret: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `packages/testing/src/lib/bookingScenario/bookingScenario.ts` | 1505 | `client_secret: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `packages/testing/src/lib/bookingScenario/bookingScenario.ts` | 1516 | `client_secret: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `packages/testing/src/lib/bookingScenario/bookingScenario.ts` | 1527 | `client_secret: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `packages/testing/src/lib/bookingScenario/bookingScenario.ts` | 1538 | `client_secret: "[REDACTED]",` |
| HIGH | Hardcoded Password | `packages/testing/src/lib/bookingScenario/bookingScenario.ts` | 1880 | `password: "[REDACTED]",` |
| HIGH | Hardcoded Password | `packages/testing/src/lib/bookingScenario/bookingScenario.ts` | 1893 | `password: "[REDACTED]",` |
| HIGH | Hardcoded Password | `packages/testing/src/lib/bookingScenario/bookingScenario.ts` | 1911 | `password: "[REDACTED]",` |
| HIGH | Hardcoded Password | `packages/testing/src/lib/bookingScenario/bookingScenario.ts` | 1940 | `password: "[REDACTED]",` |
| HIGH | Hardcoded Password | `packages/testing/src/lib/bookingScenario/bookingScenario.ts` | 2049 | `password: "MOCK_PASS",` |
| HIGH | Hardcoded Secret | `packages/testing/src/lib/bookingScenario/bookingScenario.ts` | 2566 | `access_token: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `packages/testing/src/lib/bookingScenario/setupAndTeardown.ts` | 11 | `process.env.STRIPE_WEBHOOK_SECRET = "[REDACTED]";` |
| HIGH | Hardcoded Password | `scripts/seed-huge-event-types.ts` | 45 | `password: `enterprise-member-${i + 1}`,` |
| HIGH | Hardcoded Password | `scripts/seed-huge-event-types.ts` | 84 | `password: "enterprise",` |
| HIGH | Hardcoded Password | `scripts/seed-pbac-organization.ts` | 330 | `password: "pbac-owner-2024!",` |
| HIGH | Hardcoded Password | `scripts/seed-pbac-organization.ts` | 353 | `password: "events-2024!",` |
| HIGH | Hardcoded Password | `scripts/seed-pbac-organization.ts` | 376 | `password: "analytics-2024!",` |
| HIGH | Hardcoded Password | `scripts/seed-pbac-organization.ts` | 399 | `password: "coordinator-2024!",` |
| HIGH | Hardcoded Password | `scripts/seed-pbac-organization.ts` | 422 | `password: "support-2024!",` |
| HIGH | Hardcoded Password | `scripts/seed.ts` | 803 | `password: "delete-me",` |
| HIGH | Hardcoded Password | `scripts/seed.ts` | 812 | `password: "onboarding",` |
| HIGH | Hardcoded Password | `scripts/seed.ts` | 822 | `password: "[REDACTED]",` |
| HIGH | Hardcoded Password | `scripts/seed.ts` | 1127 | `password: "teamfree",` |
| HIGH | Hardcoded Password | `scripts/seed.ts` | 1146 | `password: "ADMINadmin2022!",` |
| HIGH | Hardcoded Password | `scripts/seed.ts` | 1197 | `password: "PLATFORMadmin2024!",` |
| HIGH | Hardcoded Password | `scripts/seed.ts` | 1207 | `password: "teampro2",` |
| HIGH | Hardcoded Password | `scripts/seed.ts` | 1216 | `password: "teampro3",` |
| HIGH | Hardcoded Password | `scripts/seed.ts` | 1225 | `password: "teampro4",` |

### Remediation Steps

1. Move all secrets to environment variables (`.env.local` or your secrets manager)
2. Rotate any credentials that have been committed to version control
3. Add `.env` and `.env.local` to `.gitignore`
4. Consider using a secrets manager (AWS Secrets Manager, HashiCorp Vault, Doppler)
5. Run `git log --all --full-history -S '<secret>'` to check if secrets exist in git history

---

*This audit was generated by [Codepliant](https://github.com/joechensmartz/codepliant). It is not a substitute for a professional security review.*
