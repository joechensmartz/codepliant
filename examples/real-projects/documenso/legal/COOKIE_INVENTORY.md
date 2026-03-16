# Cookie Inventory

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** @documenso/root
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

- **@simplewebauthn/server** — detected in `apps/remix/app/components/dialogs/passkey-create-dialog.tsx`, `apps/remix/app/components/forms/signin.tsx`, `apps/remix/app/components/general/document-signing/document-signing-auth-passkey.tsx`, `packages/auth/server/routes/passkey.ts`, `packages/lib/server-only/auth/create-passkey-authentication-options.ts`, `packages/lib/server-only/auth/create-passkey-registration-options.ts`, `packages/lib/server-only/auth/create-passkey-signin-options.ts`, `packages/lib/server-only/auth/create-passkey.ts`, `packages/lib/server-only/document/is-recipient-authorized.ts`, `packages/trpc/server/auth-router/create-passkey.ts`, `apps/remix/package.json`, `apps/remix/app/components/dialogs/passkey-create-dialog.tsx`, `apps/remix/app/components/forms/signin.tsx`, `apps/remix/app/components/general/document-signing/document-signing-auth-passkey.tsx`, `packages/auth/package.json`, `packages/auth/server/routes/passkey.ts`, `packages/lib/package.json`, `packages/lib/server-only/auth/create-passkey-authentication-options.ts`, `packages/lib/server-only/auth/create-passkey-registration-options.ts`, `packages/lib/server-only/auth/create-passkey-signin-options.ts`, `packages/lib/server-only/auth/create-passkey.ts`, `packages/lib/server-only/document/is-recipient-authorized.ts`, `packages/trpc/package.json`, `packages/trpc/server/auth-router/create-passkey.ts`
- **next-auth** — detected in `.env.example`
- **passport-microsoft** — detected in `.env.example`

### Analytics & Advertising Services

- **posthog** — detected in `apps/remix/app/entry.client.tsx`, `packages/lib/client-only/hooks/use-analytics.ts`, `packages/lib/server-only/telemetry/telemetry-client.ts`, `.env.example`, `apps/remix/app/entry.client.tsx`, `packages/lib/client-only/hooks/use-analytics.ts`, `packages/lib/server-only/telemetry/telemetry-client.ts`

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

*This cookie inventory was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **@documenso/root** codebase. It should be reviewed by your legal team to ensure completeness and accuracy. Additional cookies may be set by third-party scripts loaded at runtime that are not detectable through static code analysis.*