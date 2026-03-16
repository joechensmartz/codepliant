import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Known third-party cookie providers with cookie names, purposes, and opt-out URLs.
 */
interface ThirdPartyCookieProvider {
  provider: string;
  cookies: { name: string; purpose: string; duration: string }[];
  optOutUrl: string;
  privacyPolicyUrl: string;
}

const PROVIDER_COOKIE_DATABASE: Record<string, ThirdPartyCookieProvider> = {
  "Google Analytics": {
    provider: "Google LLC",
    cookies: [
      { name: "_ga", purpose: "Distinguishes unique users by assigning a randomly generated number", duration: "2 years" },
      { name: "_ga_*", purpose: "Persists session state across page requests", duration: "2 years" },
      { name: "_gid", purpose: "Distinguishes users for analytics aggregation", duration: "24 hours" },
      { name: "_gat", purpose: "Throttles request rate to Google Analytics", duration: "1 minute" },
    ],
    optOutUrl: "https://tools.google.com/dlpage/gaoptout",
    privacyPolicyUrl: "https://policies.google.com/privacy",
  },
  "@google-analytics/data": {
    provider: "Google LLC",
    cookies: [
      { name: "_ga", purpose: "Distinguishes unique users", duration: "2 years" },
      { name: "_ga_*", purpose: "Persists session state", duration: "2 years" },
      { name: "_gid", purpose: "Distinguishes users for aggregation", duration: "24 hours" },
    ],
    optOutUrl: "https://tools.google.com/dlpage/gaoptout",
    privacyPolicyUrl: "https://policies.google.com/privacy",
  },
  posthog: {
    provider: "PostHog Inc",
    cookies: [
      { name: "ph_*", purpose: "Identifies unique users for product analytics and session recording", duration: "1 year" },
      { name: "distinct_id", purpose: "Identifies users across sessions for analytics continuity", duration: "1 year" },
    ],
    optOutUrl: "https://posthog.com/docs/libraries/js#opt-users-out",
    privacyPolicyUrl: "https://posthog.com/privacy",
  },
  mixpanel: {
    provider: "Mixpanel Inc",
    cookies: [
      { name: "mp_*", purpose: "Tracks user behavior and events for product analytics", duration: "1 year" },
      { name: "mp_optout", purpose: "Records user opt-out preference for Mixpanel tracking", duration: "1 year" },
    ],
    optOutUrl: "https://mixpanel.com/legal/app-user-rights/",
    privacyPolicyUrl: "https://mixpanel.com/legal/privacy-policy/",
  },
  "@amplitude/analytics-browser": {
    provider: "Amplitude Inc",
    cookies: [
      { name: "amp_*", purpose: "Identifies users and tracks events for product analytics", duration: "10 years" },
      { name: "AMP_*", purpose: "Stores device and session identifiers for analytics", duration: "10 years" },
    ],
    optOutUrl: "https://amplitude.com/privacy#your-choices",
    privacyPolicyUrl: "https://amplitude.com/privacy",
  },
  "@vercel/analytics": {
    provider: "Vercel Inc",
    cookies: [
      { name: "va_*", purpose: "Collects anonymous page view and web vitals data", duration: "Session" },
    ],
    optOutUrl: "https://vercel.com/legal/privacy-policy#your-choices",
    privacyPolicyUrl: "https://vercel.com/legal/privacy-policy",
  },
  hotjar: {
    provider: "Hotjar Ltd",
    cookies: [
      { name: "_hj*", purpose: "Session recording, heatmap tracking, and user feedback", duration: "1 year" },
      { name: "_hjSessionUser_*", purpose: "Ensures survey data is sent only once", duration: "1 year" },
      { name: "_hjSession_*", purpose: "Holds current session data", duration: "30 minutes" },
    ],
    optOutUrl: "https://www.hotjar.com/legal/compliance/opt-out",
    privacyPolicyUrl: "https://www.hotjar.com/privacy/",
  },
  Hotjar: {
    provider: "Hotjar Ltd",
    cookies: [
      { name: "_hj*", purpose: "Session recording, heatmap tracking, and user feedback", duration: "1 year" },
      { name: "_hjSessionUser_*", purpose: "Ensures survey data is sent only once", duration: "1 year" },
    ],
    optOutUrl: "https://www.hotjar.com/legal/compliance/opt-out",
    privacyPolicyUrl: "https://www.hotjar.com/privacy/",
  },
  "Microsoft Clarity": {
    provider: "Microsoft Corporation",
    cookies: [
      { name: "_clck", purpose: "Persists the Clarity user ID and preferences", duration: "1 year" },
      { name: "_clsk", purpose: "Connects multiple page views into a single session recording", duration: "1 day" },
      { name: "CLID", purpose: "Identifies unique users for session replay and heatmaps", duration: "1 year" },
    ],
    optOutUrl: "https://clarity.microsoft.com/optout",
    privacyPolicyUrl: "https://privacy.microsoft.com/privacystatement",
  },
  "Meta Pixel": {
    provider: "Meta Platforms Inc",
    cookies: [
      { name: "_fbp", purpose: "Identifies browsers for advertising and site analytics", duration: "3 months" },
      { name: "_fbc", purpose: "Stores last visit information for Facebook ad attribution", duration: "3 months" },
      { name: "fr", purpose: "Delivers and measures advertising relevance", duration: "3 months" },
    ],
    optOutUrl: "https://www.facebook.com/help/568137493302217",
    privacyPolicyUrl: "https://www.facebook.com/privacy/policy/",
  },
  "TikTok Pixel": {
    provider: "ByteDance Ltd",
    cookies: [
      { name: "_ttp", purpose: "Tracks conversion events and ad performance", duration: "13 months" },
      { name: "tt_*", purpose: "Measures ad impressions and click-through events", duration: "13 months" },
    ],
    optOutUrl: "https://www.tiktok.com/legal/page/global/privacy-policy",
    privacyPolicyUrl: "https://www.tiktok.com/legal/page/global/privacy-policy",
  },
  "LinkedIn Insight Tag": {
    provider: "LinkedIn Corporation",
    cookies: [
      { name: "li_*", purpose: "Tracks conversions, retargeting, and web analytics", duration: "6 months" },
      { name: "bcookie", purpose: "Browser ID cookie for security and analytics", duration: "1 year" },
    ],
    optOutUrl: "https://www.linkedin.com/psettings/guest-controls/retargeting-opt-out",
    privacyPolicyUrl: "https://www.linkedin.com/legal/privacy-policy",
  },
  "Twitter/X Pixel": {
    provider: "X Corp",
    cookies: [
      { name: "personalization_id", purpose: "Enables personalized advertising across Twitter", duration: "2 years" },
      { name: "muc_ads", purpose: "Advertising cookie for conversion tracking", duration: "2 years" },
    ],
    optOutUrl: "https://twitter.com/settings/privacy_and_safety",
    privacyPolicyUrl: "https://twitter.com/en/privacy",
  },
  firebase: {
    provider: "Google LLC",
    cookies: [
      { name: "_ga_firebase", purpose: "Google Analytics for Firebase user tracking", duration: "2 years" },
    ],
    optOutUrl: "https://tools.google.com/dlpage/gaoptout",
    privacyPolicyUrl: "https://firebase.google.com/support/privacy",
  },
  "@segment/analytics-next": {
    provider: "Twilio Segment",
    cookies: [
      { name: "ajs_anonymous_id", purpose: "Anonymous user identification for analytics routing", duration: "1 year" },
      { name: "ajs_user_id", purpose: "Identified user tracking across Segment-connected services", duration: "1 year" },
    ],
    optOutUrl: "https://segment.com/legal/privacy/#your-choices",
    privacyPolicyUrl: "https://segment.com/legal/privacy/",
  },
  "@clerk/nextjs": {
    provider: "Clerk Inc",
    cookies: [
      { name: "__session", purpose: "Stores Clerk session token for authentication", duration: "Session" },
      { name: "__client_uat", purpose: "Client-side authentication state timestamp", duration: "Session" },
    ],
    optOutUrl: "https://clerk.com/legal/privacy",
    privacyPolicyUrl: "https://clerk.com/legal/privacy",
  },
  "@supabase/supabase-js": {
    provider: "Supabase Inc",
    cookies: [
      { name: "sb-*-auth-token", purpose: "Stores Supabase authentication session token", duration: "1 hour (refreshed)" },
    ],
    optOutUrl: "https://supabase.com/privacy",
    privacyPolicyUrl: "https://supabase.com/privacy",
  },
  "@auth/core": {
    provider: "First-party (Auth.js)",
    cookies: [
      { name: "authjs.session-token", purpose: "Stores encrypted session data for Auth.js", duration: "30 days" },
      { name: "authjs.csrf-token", purpose: "CSRF protection token", duration: "Session" },
    ],
    optOutUrl: "N/A (first-party authentication)",
    privacyPolicyUrl: "https://authjs.dev/",
  },
  "next-auth": {
    provider: "First-party (NextAuth.js)",
    cookies: [
      { name: "next-auth.session-token", purpose: "Stores encrypted session data", duration: "30 days" },
      { name: "next-auth.csrf-token", purpose: "CSRF protection for sign-in/sign-out", duration: "Session" },
      { name: "next-auth.callback-url", purpose: "Stores the callback URL for OAuth redirect", duration: "Session" },
    ],
    optOutUrl: "N/A (first-party authentication)",
    privacyPolicyUrl: "https://next-auth.js.org/",
  },
};

/**
 * Generates THIRD_PARTY_COOKIE_NOTICE.md — a per-provider cookie notice
 * documenting each detected third-party cookie provider, their cookies,
 * purposes, and opt-out URLs.
 *
 * Only generated when analytics, advertising, or auth services are detected.
 */
export function generateThirdPartyCookieNotice(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const date = new Date().toISOString().split("T")[0];

  // Match detected services to known providers
  const matchedProviders: { service: string; provider: ThirdPartyCookieProvider }[] = [];
  const seenProviders = new Set<string>();

  for (const service of scan.services) {
    const providerData = PROVIDER_COOKIE_DATABASE[service.name];
    if (providerData && !seenProviders.has(providerData.provider)) {
      seenProviders.add(providerData.provider);
      matchedProviders.push({ service: service.name, provider: providerData });
    }
  }

  if (matchedProviders.length === 0) {
    return null;
  }

  const sections: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────
  sections.push("# Third-Party Cookie Notice");
  sections.push("");
  sections.push(`**Last updated:** ${date}`);
  sections.push("");
  sections.push(`**Project:** ${scan.projectName}`);
  sections.push(`**Organization:** ${company}`);
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("This notice describes the third-party cookies and similar tracking technologies used by this application. Each provider is listed with the specific cookies they set, their purposes, retention periods, and instructions for opting out.");
  sections.push("");
  sections.push("Under the ePrivacy Directive (Art. 5(3)) and GDPR (Art. 6(1)(a)), non-essential cookies require explicit, informed consent before being placed on your device.");
  sections.push("");

  // ── Summary Table ───────────────────────────────────────────────────
  sections.push("## Provider Summary");
  sections.push("");
  sections.push("| Provider | Cookies | Category | Opt-Out Available |");
  sections.push("|----------|---------|----------|-------------------|");

  for (const { provider } of matchedProviders) {
    const category = categorizeCookieProvider(provider.cookies);
    const cookieCount = provider.cookies.length;
    sections.push(`| ${provider.provider} | ${cookieCount} | ${category} | [Yes](${provider.optOutUrl}) |`);
  }
  sections.push("");

  // ── Per-Provider Sections ───────────────────────────────────────────
  for (const { service, provider } of matchedProviders) {
    sections.push(`## ${provider.provider}`);
    sections.push("");
    sections.push(`**Service:** ${service}`);
    sections.push(`**Privacy Policy:** [${provider.privacyPolicyUrl}](${provider.privacyPolicyUrl})`);
    sections.push(`**Opt-Out URL:** [${provider.optOutUrl}](${provider.optOutUrl})`);
    sections.push("");

    sections.push("### Cookies Set");
    sections.push("");
    sections.push("| Cookie Name | Purpose | Duration |");
    sections.push("|-------------|---------|----------|");
    for (const cookie of provider.cookies) {
      sections.push(`| \`${cookie.name}\` | ${cookie.purpose} | ${cookie.duration} |`);
    }
    sections.push("");

    sections.push("### How to Opt Out");
    sections.push("");
    if (provider.optOutUrl.startsWith("N/A")) {
      sections.push(`This is a first-party authentication service. These cookies are strictly necessary for the application to function and cannot be opted out of without losing access to authenticated features.`);
    } else {
      sections.push(`To opt out of ${provider.provider} cookies:`);
      sections.push("");
      sections.push(`1. Visit the opt-out page: [${provider.optOutUrl}](${provider.optOutUrl})`);
      sections.push(`2. Use your browser's cookie management settings to block cookies from ${provider.provider}`);
      sections.push(`3. Use the cookie consent banner on our application to decline non-essential cookies`);
      sections.push(`4. Enable Global Privacy Control (GPC) in your browser to signal opt-out automatically`);
    }
    sections.push("");
  }

  // ── Your Rights ─────────────────────────────────────────────────────
  sections.push("## Your Rights");
  sections.push("");
  sections.push("Under applicable data protection laws, you have the right to:");
  sections.push("");
  sections.push("- **Withdraw consent** at any time for non-essential cookies");
  sections.push("- **Access** information about what data third-party cookies collect about you");
  sections.push("- **Request deletion** of data collected via cookies");
  sections.push("- **Object** to processing based on legitimate interest");
  sections.push("- **Port** your data collected via cookies to another controller (GDPR Art. 20)");
  sections.push("");
  sections.push("### Browser-Level Controls");
  sections.push("");
  sections.push("You can manage cookies through your browser settings:");
  sections.push("");
  sections.push("- **Chrome:** Settings > Privacy and Security > Cookies and other site data");
  sections.push("- **Firefox:** Settings > Privacy & Security > Cookies and Site Data");
  sections.push("- **Safari:** Settings > Privacy > Manage Website Data");
  sections.push("- **Edge:** Settings > Privacy, search, and services > Cookies and site permissions");
  sections.push("");
  sections.push("### Global Privacy Control (GPC)");
  sections.push("");
  sections.push("This application honors Global Privacy Control signals. When GPC is enabled in your browser, we treat it as a valid opt-out of non-essential cookies and tracking.");
  sections.push("");

  // ── Contact ─────────────────────────────────────────────────────────
  sections.push("## Contact");
  sections.push("");
  sections.push(`If you have questions about third-party cookies used by this application, contact us at **${email}**.`);
  sections.push("");

  // ── Disclaimer ──────────────────────────────────────────────────────
  sections.push("---");
  sections.push("");
  sections.push(
    `*This third-party cookie notice was generated by [Codepliant](https://github.com/joechensmartz/codepliant) ` +
    `based on an automated scan of the **${scan.projectName}** codebase. ` +
    `It should be reviewed by your legal team to ensure completeness and accuracy. ` +
    `Additional cookies may be set by third-party scripts loaded at runtime that are not detectable through static code analysis.*`
  );

  return sections.join("\n");
}

function categorizeCookieProvider(cookies: { name: string; purpose: string }[]): string {
  const text = cookies.map(c => c.purpose.toLowerCase()).join(" ");
  if (text.includes("advertising") || text.includes("retarget") || text.includes("conversion")) {
    return "Advertising";
  }
  if (text.includes("analytics") || text.includes("heatmap") || text.includes("session recording")) {
    return "Analytics";
  }
  if (text.includes("session") || text.includes("auth") || text.includes("csrf")) {
    return "Authentication";
  }
  return "Functional";
}
