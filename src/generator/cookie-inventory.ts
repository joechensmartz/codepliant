import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Known cookie details for common services.
 * Each entry maps a service name to its known cookies.
 */
interface CookieEntry {
  name: string;
  purpose: string;
  duration: string;
  provider: string;
  category: "strictly-necessary" | "functional" | "analytics" | "advertising" | "performance";
}

const TRACKING_COOKIES: Record<string, CookieEntry[]> = {
  "Google Analytics": [
    { name: "_ga", purpose: "Distinguishes unique users by assigning a randomly generated number as a client identifier", duration: "2 years", provider: "Google LLC", category: "analytics" },
    { name: "_ga_*", purpose: "Used to persist session state across page requests", duration: "2 years", provider: "Google LLC", category: "analytics" },
    { name: "_gid", purpose: "Distinguishes users for analytics aggregation", duration: "24 hours", provider: "Google LLC", category: "analytics" },
    { name: "_gat", purpose: "Throttles request rate to Google Analytics", duration: "1 minute", provider: "Google LLC", category: "analytics" },
  ],
  "@google-analytics/data": [
    { name: "_ga", purpose: "Distinguishes unique users by assigning a randomly generated number as a client identifier", duration: "2 years", provider: "Google LLC", category: "analytics" },
    { name: "_ga_*", purpose: "Used to persist session state across page requests", duration: "2 years", provider: "Google LLC", category: "analytics" },
    { name: "_gid", purpose: "Distinguishes users for analytics aggregation", duration: "24 hours", provider: "Google LLC", category: "analytics" },
  ],
  posthog: [
    { name: "ph_*", purpose: "Identifies unique users for product analytics and session recording", duration: "1 year", provider: "PostHog Inc", category: "analytics" },
    { name: "distinct_id", purpose: "Identifies users across sessions for analytics continuity", duration: "1 year", provider: "PostHog Inc", category: "analytics" },
  ],
  mixpanel: [
    { name: "mp_*", purpose: "Tracks user behavior and events for product analytics", duration: "1 year", provider: "Mixpanel Inc", category: "analytics" },
    { name: "mp_optout", purpose: "Records user opt-out preference for Mixpanel tracking", duration: "1 year", provider: "Mixpanel Inc", category: "analytics" },
  ],
  "@amplitude/analytics-browser": [
    { name: "amp_*", purpose: "Identifies users and tracks events for product analytics", duration: "10 years", provider: "Amplitude Inc", category: "analytics" },
    { name: "AMP_*", purpose: "Stores device and session identifiers for analytics", duration: "10 years", provider: "Amplitude Inc", category: "analytics" },
  ],
  "@vercel/analytics": [
    { name: "va_*", purpose: "Collects anonymous page view and web vitals data", duration: "Session", provider: "Vercel Inc", category: "analytics" },
  ],
  hotjar: [
    { name: "_hj*", purpose: "Session recording, heatmap tracking, and user feedback collection", duration: "1 year", provider: "Hotjar Ltd", category: "analytics" },
    { name: "_hjSessionUser_*", purpose: "Ensures survey data is sent only once for returning visitors", duration: "1 year", provider: "Hotjar Ltd", category: "analytics" },
    { name: "_hjSession_*", purpose: "Holds current session data for heatmap and recording matching", duration: "30 minutes", provider: "Hotjar Ltd", category: "analytics" },
  ],
  "Hotjar": [
    { name: "_hj*", purpose: "Session recording, heatmap tracking, and user feedback collection", duration: "1 year", provider: "Hotjar Ltd", category: "analytics" },
    { name: "_hjSessionUser_*", purpose: "Ensures survey data is sent only once for returning visitors", duration: "1 year", provider: "Hotjar Ltd", category: "analytics" },
  ],
  "Microsoft Clarity": [
    { name: "_clck", purpose: "Persists the Clarity user ID and preferences", duration: "1 year", provider: "Microsoft Corporation", category: "analytics" },
    { name: "_clsk", purpose: "Connects multiple page views by a user into a single session recording", duration: "1 day", provider: "Microsoft Corporation", category: "analytics" },
    { name: "CLID", purpose: "Identifies unique users for session replay and heatmaps", duration: "1 year", provider: "Microsoft Corporation", category: "analytics" },
  ],
  "Meta Pixel": [
    { name: "_fbp", purpose: "Identifies browsers for advertising and site analytics", duration: "3 months", provider: "Meta Platforms Inc", category: "advertising" },
    { name: "_fbc", purpose: "Stores last visit information for Facebook ad attribution", duration: "3 months", provider: "Meta Platforms Inc", category: "advertising" },
    { name: "fr", purpose: "Delivers and measures advertising relevance", duration: "3 months", provider: "Meta Platforms Inc", category: "advertising" },
  ],
  "TikTok Pixel": [
    { name: "_ttp", purpose: "Tracks conversion events and ad performance on TikTok", duration: "13 months", provider: "ByteDance Ltd", category: "advertising" },
    { name: "tt_*", purpose: "Measures ad impressions and click-through events", duration: "13 months", provider: "ByteDance Ltd", category: "advertising" },
  ],
  "LinkedIn Insight Tag": [
    { name: "li_*", purpose: "Tracks conversions, retargeting, and web analytics for LinkedIn advertising", duration: "6 months", provider: "LinkedIn Corporation", category: "advertising" },
    { name: "bcookie", purpose: "Browser ID cookie for LinkedIn security and analytics", duration: "1 year", provider: "LinkedIn Corporation", category: "advertising" },
  ],
  "Twitter/X Pixel": [
    { name: "personalization_id", purpose: "Enables personalized advertising across Twitter", duration: "2 years", provider: "X Corp", category: "advertising" },
    { name: "muc_ads", purpose: "Advertising cookie for conversion tracking", duration: "2 years", provider: "X Corp", category: "advertising" },
  ],
  "Plausible Analytics": [
    { name: "(none)", purpose: "Plausible is cookie-free — uses no cookies or persistent identifiers", duration: "N/A", provider: "Plausible Insights OÜ", category: "analytics" },
  ],
  "Fathom Analytics": [
    { name: "(none)", purpose: "Fathom is cookie-free — uses no cookies or persistent identifiers", duration: "N/A", provider: "Conva Ventures Inc", category: "analytics" },
  ],
  firebase: [
    { name: "_ga_firebase", purpose: "Google Analytics for Firebase user tracking", duration: "2 years", provider: "Google LLC", category: "analytics" },
  ],
  "@segment/analytics-next": [
    { name: "ajs_anonymous_id", purpose: "Anonymous user identification for analytics routing", duration: "1 year", provider: "Twilio Segment", category: "analytics" },
    { name: "ajs_user_id", purpose: "Identified user tracking across Segment-connected services", duration: "1 year", provider: "Twilio Segment", category: "analytics" },
  ],
};

const AUTH_COOKIES: CookieEntry[] = [
  { name: "session_id / connect.sid", purpose: "Maintains authenticated user session on the server", duration: "Session or configured expiry", provider: "First-party", category: "strictly-necessary" },
  { name: "auth_token / jwt", purpose: "Stores authentication token for API authorization", duration: "Varies (typically 1 hour to 30 days)", provider: "First-party", category: "strictly-necessary" },
  { name: "csrf_token / XSRF-TOKEN", purpose: "Prevents cross-site request forgery attacks", duration: "Session", provider: "First-party", category: "strictly-necessary" },
  { name: "refresh_token", purpose: "Enables silent re-authentication when access token expires", duration: "30-90 days (varies)", provider: "First-party", category: "strictly-necessary" },
];

const AUTH_PROVIDER_COOKIES: Record<string, CookieEntry[]> = {
  "next-auth": [
    { name: "next-auth.session-token", purpose: "Stores encrypted session data for NextAuth.js authentication", duration: "30 days (default)", provider: "First-party (NextAuth.js)", category: "strictly-necessary" },
    { name: "next-auth.csrf-token", purpose: "CSRF protection for NextAuth.js sign-in and sign-out", duration: "Session", provider: "First-party (NextAuth.js)", category: "strictly-necessary" },
    { name: "next-auth.callback-url", purpose: "Stores the callback URL for OAuth redirect", duration: "Session", provider: "First-party (NextAuth.js)", category: "strictly-necessary" },
  ],
  "@clerk/nextjs": [
    { name: "__session", purpose: "Stores Clerk session token for authentication", duration: "Session", provider: "Clerk Inc", category: "strictly-necessary" },
    { name: "__client_uat", purpose: "Client-side authentication state timestamp", duration: "Session", provider: "Clerk Inc", category: "strictly-necessary" },
  ],
  "@supabase/supabase-js": [
    { name: "sb-*-auth-token", purpose: "Stores Supabase authentication session token", duration: "1 hour (refreshed)", provider: "Supabase Inc", category: "strictly-necessary" },
  ],
  "@auth/core": [
    { name: "authjs.session-token", purpose: "Stores encrypted session data for Auth.js", duration: "30 days (default)", provider: "First-party (Auth.js)", category: "strictly-necessary" },
    { name: "authjs.csrf-token", purpose: "CSRF protection token", duration: "Session", provider: "First-party (Auth.js)", category: "strictly-necessary" },
  ],
  "better-auth": [
    { name: "better-auth.session_token", purpose: "Stores session token for Better Auth authentication", duration: "30 days (default)", provider: "First-party (Better Auth)", category: "strictly-necessary" },
  ],
};

/**
 * Generates COOKIE_INVENTORY.md — a detailed inventory of all cookies
 * detected in the project. Required by the ePrivacy Directive.
 *
 * Auto-populated from tracking scanner + auth scanner results.
 */
export function generateCookieInventory(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const date = new Date().toISOString().split("T")[0];

  const analyticsServices = scan.services.filter(
    (s) => s.category === "analytics" || s.category === "advertising"
  );
  const authServices = scan.services.filter((s) => s.category === "auth");

  // Only generate if there are cookies to inventory
  if (analyticsServices.length === 0 && authServices.length === 0) {
    return null;
  }

  // Collect all cookie entries
  const allCookies: CookieEntry[] = [];
  const cookieSources = new Map<string, string>(); // cookie name -> service name

  // Auth cookies (always present if auth detected)
  if (authServices.length > 0) {
    for (const cookie of AUTH_COOKIES) {
      allCookies.push(cookie);
      cookieSources.set(cookie.name, "Authentication system");
    }

    // Auth provider-specific cookies
    for (const service of authServices) {
      const providerCookies = AUTH_PROVIDER_COOKIES[service.name];
      if (providerCookies) {
        for (const cookie of providerCookies) {
          allCookies.push(cookie);
          cookieSources.set(cookie.name, service.name);
        }
      }
    }
  }

  // Tracking/analytics cookies
  for (const service of analyticsServices) {
    const cookies = TRACKING_COOKIES[service.name];
    if (cookies) {
      for (const cookie of cookies) {
        allCookies.push(cookie);
        cookieSources.set(cookie.name, service.name);
      }
    }
  }

  // Group by category
  const strictlyNecessary = allCookies.filter((c) => c.category === "strictly-necessary");
  const functional = allCookies.filter((c) => c.category === "functional");
  const analytics = allCookies.filter((c) => c.category === "analytics");
  const advertising = allCookies.filter((c) => c.category === "advertising");
  const performance = allCookies.filter((c) => c.category === "performance");

  const sections: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────
  sections.push("# Cookie Inventory");
  sections.push("");
  sections.push(`**Last updated:** ${date}`);
  sections.push("");
  sections.push(`**Project:** ${scan.projectName}`);
  sections.push(`**Organization:** ${company}`);
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("This document provides a complete inventory of all cookies and similar tracking technologies used by this application. This inventory is required by the ePrivacy Directive (Directive 2002/58/EC, as amended by Directive 2009/136/EC) and supports GDPR transparency requirements.");
  sections.push("");

  // ── Summary ─────────────────────────────────────────────────────────
  sections.push("## Summary");
  sections.push("");
  sections.push(`| Category | Count | Consent Required |`);
  sections.push(`|----------|-------|-----------------|`);
  sections.push(`| Strictly Necessary | ${strictlyNecessary.length} | No (exempt under ePrivacy Directive Art. 5(3)) |`);
  if (functional.length > 0) {
    sections.push(`| Functional | ${functional.length} | Yes |`);
  }
  sections.push(`| Analytics | ${analytics.length} | Yes |`);
  if (advertising.length > 0) {
    sections.push(`| Advertising | ${advertising.length} | Yes |`);
  }
  if (performance.length > 0) {
    sections.push(`| Performance | ${performance.length} | Yes |`);
  }
  sections.push(`| **Total** | **${allCookies.length}** | |`);
  sections.push("");

  // ── Strictly Necessary ──────────────────────────────────────────────
  if (strictlyNecessary.length > 0) {
    sections.push("## Strictly Necessary Cookies");
    sections.push("");
    sections.push("These cookies are essential for the application to function and cannot be disabled. They do not require user consent under Article 5(3) of the ePrivacy Directive.");
    sections.push("");
    sections.push("| Cookie Name | Purpose | Duration | Provider |");
    sections.push("|-------------|---------|----------|----------|");
    for (const cookie of strictlyNecessary) {
      sections.push(`| \`${cookie.name}\` | ${cookie.purpose} | ${cookie.duration} | ${cookie.provider} |`);
    }
    sections.push("");
  }

  // ── Functional ──────────────────────────────────────────────────────
  if (functional.length > 0) {
    sections.push("## Functional Cookies");
    sections.push("");
    sections.push("These cookies enable enhanced functionality and personalization. They require user consent.");
    sections.push("");
    sections.push("| Cookie Name | Purpose | Duration | Provider |");
    sections.push("|-------------|---------|----------|----------|");
    for (const cookie of functional) {
      sections.push(`| \`${cookie.name}\` | ${cookie.purpose} | ${cookie.duration} | ${cookie.provider} |`);
    }
    sections.push("");
  }

  // ── Analytics ───────────────────────────────────────────────────────
  if (analytics.length > 0) {
    sections.push("## Analytics Cookies");
    sections.push("");
    sections.push("These cookies collect information about how visitors use the application. They require explicit user consent before being set.");
    sections.push("");
    sections.push("| Cookie Name | Purpose | Duration | Provider | Service |");
    sections.push("|-------------|---------|----------|----------|---------|");
    for (const cookie of analytics) {
      const source = cookieSources.get(cookie.name) || "Unknown";
      sections.push(`| \`${cookie.name}\` | ${cookie.purpose} | ${cookie.duration} | ${cookie.provider} | ${source} |`);
    }
    sections.push("");
  }

  // ── Advertising ─────────────────────────────────────────────────────
  if (advertising.length > 0) {
    sections.push("## Advertising Cookies");
    sections.push("");
    sections.push("These cookies are used for advertising, retargeting, and conversion tracking. They require explicit user consent and must be blocked until consent is obtained.");
    sections.push("");
    sections.push("| Cookie Name | Purpose | Duration | Provider | Service |");
    sections.push("|-------------|---------|----------|----------|---------|");
    for (const cookie of advertising) {
      const source = cookieSources.get(cookie.name) || "Unknown";
      sections.push(`| \`${cookie.name}\` | ${cookie.purpose} | ${cookie.duration} | ${cookie.provider} | ${source} |`);
    }
    sections.push("");
  }

  // ── Performance ─────────────────────────────────────────────────────
  if (performance.length > 0) {
    sections.push("## Performance Cookies");
    sections.push("");
    sections.push("These cookies collect information about application performance and user experience.");
    sections.push("");
    sections.push("| Cookie Name | Purpose | Duration | Provider |");
    sections.push("|-------------|---------|----------|----------|");
    for (const cookie of performance) {
      sections.push(`| \`${cookie.name}\` | ${cookie.purpose} | ${cookie.duration} | ${cookie.provider} |`);
    }
    sections.push("");
  }

  // ── Data Sources ────────────────────────────────────────────────────
  sections.push("## Detected Services");
  sections.push("");
  sections.push("The following services were detected in the codebase that set or use cookies:");
  sections.push("");

  if (authServices.length > 0) {
    sections.push("### Authentication Services");
    sections.push("");
    for (const service of authServices) {
      const evidence = service.evidence.map((e) => `\`${e.file}\``).join(", ");
      sections.push(`- **${service.name}** — detected in ${evidence}`);
    }
    sections.push("");
  }

  if (analyticsServices.length > 0) {
    sections.push("### Analytics & Advertising Services");
    sections.push("");
    for (const service of analyticsServices) {
      const evidence = service.evidence.map((e) => `\`${e.file}\``).join(", ");
      sections.push(`- **${service.name}** — detected in ${evidence}`);
    }
    sections.push("");
  }

  // ── Legal Requirements ──────────────────────────────────────────────
  sections.push("## Legal Requirements");
  sections.push("");
  sections.push("### ePrivacy Directive (EU)");
  sections.push("");
  sections.push("Under Article 5(3) of the ePrivacy Directive:");
  sections.push("");
  sections.push("- **Strictly necessary cookies** may be set without consent (e.g., session cookies, CSRF tokens)");
  sections.push("- **All other cookies** require informed, specific, and freely given consent before being set");
  sections.push("- Users must be able to **withdraw consent** as easily as they gave it");
  sections.push("- Consent must be obtained **before** cookies are placed (no implied consent)");
  sections.push("");
  sections.push("### GDPR (EU)");
  sections.push("");
  sections.push("- Cookie consent constitutes processing of personal data under GDPR Article 6(1)(a)");
  sections.push("- Users have the right to know what cookies are used (this inventory)");
  sections.push("- Data collected via cookies is subject to all GDPR rights (access, erasure, portability)");
  sections.push("");
  sections.push("### CCPA/CPRA (California)");
  sections.push("");
  sections.push("- Users must be informed about categories of personal information collected via cookies");
  sections.push("- \"Do Not Sell or Share My Personal Information\" link must be provided if advertising cookies are used");
  sections.push("- Global Privacy Control (GPC) signals must be honored");
  sections.push("");

  // ── Maintenance ─────────────────────────────────────────────────────
  sections.push("## Inventory Maintenance");
  sections.push("");
  sections.push("This cookie inventory should be reviewed and updated:");
  sections.push("");
  sections.push("- [ ] When adding or removing third-party services");
  sections.push("- [ ] When changing authentication providers");
  sections.push("- [ ] When adding new tracking or analytics tools");
  sections.push("- [ ] At minimum quarterly, or after any significant application change");
  sections.push("- [ ] After any audit finding related to cookies or tracking");
  sections.push("");
  sections.push(`For questions about this cookie inventory, contact **${email}**.`);
  sections.push("");

  // ── Disclaimer ──────────────────────────────────────────────────────
  sections.push("---");
  sections.push("");
  sections.push(
    `*This cookie inventory was generated by [Codepliant](https://github.com/joechensmartz/codepliant) ` +
      `based on an automated scan of the **${scan.projectName}** codebase. ` +
      `It should be reviewed by your legal team to ensure completeness and accuracy. ` +
      `Additional cookies may be set by third-party scripts loaded at runtime that are not detectable through static code analysis.*`
  );

  return sections.join("\n");
}
