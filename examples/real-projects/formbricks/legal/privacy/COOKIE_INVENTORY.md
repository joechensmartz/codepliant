# Cookie Inventory

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** formbricks
**Organization:** [Your Company Name]

## Related Documents

- Cookie Policy (`COOKIE_POLICY.md`)
- Consent Management Guide (`CONSENT_MANAGEMENT_GUIDE.md`)

---

This document provides a complete inventory of all cookies and similar tracking technologies used by this application. This inventory is required by the ePrivacy Directive (Directive 2002/58/EC, as amended by Directive 2009/136/EC) and supports GDPR transparency requirements.

## Summary

| Category | Count | Consent Required |
|----------|-------|-----------------|
| Strictly Necessary | 7 | No (exempt under ePrivacy Directive Art. 5(3)) |
| Analytics | 2 | Yes |
| **Total** | **9** | |

## Strictly Necessary Cookies

These cookies are essential for the application to function and cannot be disabled. They do not require user consent under Article 5(3) of the ePrivacy Directive.

| Cookie Name | Purpose | Duration | Provider |
|-------------|---------|----------|----------|
| `session_id / connect.sid` | Maintains authenticated user session on the server | Session or configured expiry | First-party |
| `auth_token / jwt` | Stores authentication token for API authorization | Varies (typically 1 hour to 30 days) | First-party |
| `csrf_token / XSRF-TOKEN` | Prevents cross-site request forgery attacks | Session | First-party |
| `refresh_token` | Enables silent re-authentication when access token expires | 30-90 days (varies) | First-party |
| `next-auth.session-token` | Stores encrypted session data for NextAuth.js authentication | 30 days (default) | First-party (NextAuth.js) |
| `next-auth.csrf-token` | CSRF protection for NextAuth.js sign-in and sign-out | Session | First-party (NextAuth.js) |
| `next-auth.callback-url` | Stores the callback URL for OAuth redirect | Session | First-party (NextAuth.js) |

## Analytics Cookies

These cookies collect information about how visitors use the application. They require explicit user consent before being set.

| Cookie Name | Purpose | Duration | Provider | Service |
|-------------|---------|----------|----------|---------|
| `ph_*` | Identifies unique users for product analytics and session recording | 1 year | PostHog Inc | posthog |
| `distinct_id` | Identifies users across sessions for analytics continuity | 1 year | PostHog Inc | posthog |

## Detected Services

The following services were detected in the codebase that set or use cookies:

### Authentication Services

- **next-auth** — detected in `apps/web/proxy.ts`, `apps/web/app/page.tsx`, `apps/web/app/(app)/layout.tsx`, `apps/web/app/(app)/(onboarding)/environments/[environmentId]/layout.tsx`, `apps/web/app/(app)/(onboarding)/environments/[environmentId]/xm-templates/page.tsx`, `apps/web/app/(app)/(onboarding)/organizations/[organizationId]/layout.tsx`, `apps/web/app/(app)/(onboarding)/organizations/[organizationId]/landing/layout.tsx`, `apps/web/app/(app)/(onboarding)/organizations/[organizationId]/workspaces/new/layout.tsx`, `apps/web/app/(app)/environments/[environmentId]/layout.tsx`, `apps/web/app/(app)/environments/[environmentId]/settings/(account)/layout.tsx`, `apps/web/app/(app)/environments/[environmentId]/settings/(account)/notifications/page.tsx`, `apps/web/app/(app)/environments/[environmentId]/settings/(account)/profile/components/DeleteAccount.tsx`, `apps/web/app/(app)/environments/[environmentId]/settings/(organization)/layout.tsx`, `apps/web/app/(app)/environments/[environmentId]/surveys/[surveyId]/(analysis)/layout.tsx`, `apps/web/app/(redirects)/organizations/[organizationId]/route.ts`, `apps/web/app/(redirects)/workspaces/[projectId]/route.ts`, `apps/web/app/api/auth/[...nextauth]/route.ts`, `apps/web/app/api/google-sheet/route.ts`, `apps/web/app/api/google-sheet/callback/route.ts`, `apps/web/app/api/v1/management/me/lib/utils.ts`, `apps/web/app/lib/api/with-api-logging.ts`, `apps/web/app/storage/[environmentId]/[accessType]/[fileName]/route.ts`, `apps/web/app/storage/[environmentId]/[accessType]/[fileName]/lib/auth.ts`, `apps/web/lib/utils/action-client/index.ts`, `apps/web/lingodotdev/language.ts`, `apps/web/modules/auth/layout.tsx`, `apps/web/modules/auth/email-change-without-verification-success/page.tsx`, `apps/web/modules/auth/hooks/use-sign-out.ts`, `apps/web/modules/auth/invite/page.tsx`, `apps/web/modules/auth/lib/authOptions.ts`, `apps/web/modules/auth/login/components/login-form.tsx`, `apps/web/modules/auth/verify/components/sign-in.tsx`, `apps/web/modules/auth/verify-email-change/components/email-change-sign-in.tsx`, `apps/web/modules/ee/contacts/layout.tsx`, `apps/web/modules/ee/contacts/[contactId]/components/activity-section.tsx`, `apps/web/modules/ee/sso/components/azure-button.tsx`, `apps/web/modules/ee/sso/components/github-button.tsx`, `apps/web/modules/ee/sso/components/google-button.tsx`, `apps/web/modules/ee/sso/components/open-id-button.tsx`, `apps/web/modules/ee/sso/components/saml-button.tsx`, `apps/web/modules/ee/sso/lib/providers.ts`, `apps/web/modules/ee/sso/lib/sso-handlers.ts`, `apps/web/modules/ee/sso/lib/tests/__mock__/sso-handlers.mock.ts`, `apps/web/modules/environments/lib/utils.ts`, `apps/web/modules/environments/types/environment-auth.ts`, `apps/web/modules/organization/lib/utils.ts`, `apps/web/modules/projects/settings/general/components/delete-project.tsx`, `apps/web/modules/setup/(fresh-instance)/layout.tsx`, `apps/web/modules/setup/organization/[organizationId]/invite/page.tsx`, `apps/web/modules/setup/organization/create/page.tsx`, `packages/types/next-auth.d.ts`, `.env.example`, `apps/web/package.json`, `apps/web/proxy.ts`, `apps/web/app/page.tsx`, `apps/web/app/(app)/layout.tsx`, `apps/web/app/(app)/(onboarding)/environments/[environmentId]/layout.tsx`, `apps/web/app/(app)/(onboarding)/environments/[environmentId]/xm-templates/page.tsx`, `apps/web/app/(app)/(onboarding)/organizations/[organizationId]/layout.tsx`, `apps/web/app/(app)/(onboarding)/organizations/[organizationId]/landing/layout.tsx`, `apps/web/app/(app)/(onboarding)/organizations/[organizationId]/workspaces/new/layout.tsx`, `apps/web/app/(app)/environments/[environmentId]/layout.tsx`, `apps/web/app/(app)/environments/[environmentId]/settings/(account)/layout.tsx`, `apps/web/app/(app)/environments/[environmentId]/settings/(account)/notifications/page.tsx`, `apps/web/app/(app)/environments/[environmentId]/settings/(account)/profile/components/DeleteAccount.tsx`, `apps/web/app/(app)/environments/[environmentId]/settings/(organization)/layout.tsx`, `apps/web/app/(app)/environments/[environmentId]/surveys/[surveyId]/(analysis)/layout.tsx`, `apps/web/app/(redirects)/organizations/[organizationId]/route.ts`, `apps/web/app/(redirects)/workspaces/[projectId]/route.ts`, `apps/web/app/api/auth/[...nextauth]/route.ts`, `apps/web/app/api/google-sheet/route.ts`, `apps/web/app/api/google-sheet/callback/route.ts`, `apps/web/app/api/v1/management/me/lib/utils.ts`, `apps/web/app/lib/api/with-api-logging.ts`, `apps/web/app/storage/[environmentId]/[accessType]/[fileName]/route.ts`, `apps/web/app/storage/[environmentId]/[accessType]/[fileName]/lib/auth.ts`, `apps/web/lib/utils/action-client/index.ts`, `apps/web/lingodotdev/language.ts`, `apps/web/modules/auth/layout.tsx`, `apps/web/modules/auth/email-change-without-verification-success/page.tsx`, `apps/web/modules/auth/hooks/use-sign-out.ts`, `apps/web/modules/auth/invite/page.tsx`, `apps/web/modules/auth/lib/authOptions.ts`, `apps/web/modules/auth/login/components/login-form.tsx`, `apps/web/modules/auth/verify/components/sign-in.tsx`, `apps/web/modules/auth/verify-email-change/components/email-change-sign-in.tsx`, `apps/web/modules/ee/contacts/layout.tsx`, `apps/web/modules/ee/contacts/[contactId]/components/activity-section.tsx`, `apps/web/modules/ee/sso/components/azure-button.tsx`, `apps/web/modules/ee/sso/components/github-button.tsx`, `apps/web/modules/ee/sso/components/google-button.tsx`, `apps/web/modules/ee/sso/components/open-id-button.tsx`, `apps/web/modules/ee/sso/components/saml-button.tsx`, `apps/web/modules/ee/sso/lib/providers.ts`, `apps/web/modules/ee/sso/lib/sso-handlers.ts`, `apps/web/modules/ee/sso/lib/tests/__mock__/sso-handlers.mock.ts`, `apps/web/modules/environments/lib/utils.ts`, `apps/web/modules/environments/types/environment-auth.ts`, `apps/web/modules/organization/lib/utils.ts`, `apps/web/modules/projects/settings/general/components/delete-project.tsx`, `apps/web/modules/setup/(fresh-instance)/layout.tsx`, `apps/web/modules/setup/organization/[organizationId]/invite/page.tsx`, `apps/web/modules/setup/organization/create/page.tsx`, `packages/types/next-auth.d.ts`

### Analytics & Advertising Services

- **posthog** — detected in `apps/web/app/posthog/PostHogIdentify.tsx`, `apps/web/app/posthog/PostHogIdentify.tsx`

## Legal Requirements

### ePrivacy Directive (EU)

Under Article 5(3) of the ePrivacy Directive:

- **Strictly necessary cookies** may be set without consent (e.g., session cookies, CSRF tokens)
- **All other cookies** require informed, specific, and freely given consent before being set
- Users must be able to **withdraw consent** as easily as they gave it
- Consent must be obtained **before** cookies are placed (no implied consent)

### GDPR (EU)

- Cookie consent constitutes processing of personal data under GDPR Article 6(1)(a)
- Users have the right to know what cookies are used (this inventory)
- Data collected via cookies is subject to all GDPR rights (access, erasure, portability)

### CCPA/CPRA (California)

- Users must be informed about categories of personal information collected via cookies
- "Do Not Sell or Share My Personal Information" link must be provided if advertising cookies are used
- Global Privacy Control (GPC) signals must be honored

## Inventory Maintenance

This cookie inventory should be reviewed and updated:

- [ ] When adding or removing third-party services
- [ ] When changing authentication providers
- [ ] When adding new tracking or analytics tools
- [ ] At minimum quarterly, or after any significant application change
- [ ] After any audit finding related to cookies or tracking

For questions about this cookie inventory, contact **[your-email@example.com]**.

---

*This cookie inventory was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **formbricks** codebase. It should be reviewed by your legal team to ensure completeness and accuracy. Additional cookies may be set by third-party scripts loaded at runtime that are not detectable through static code analysis.*