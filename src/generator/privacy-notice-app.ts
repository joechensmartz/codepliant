import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates PRIVACY_NOTICE_APP.md — an in-app privacy notice designed
 * to be shown inside the application UI.
 *
 * Shorter than a full privacy policy, uses plain language and bullet points,
 * and links to the full legal documents for details.
 */
export function generatePrivacyNoticeApp(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const website = ctx?.website || "[your-website.com]";
  const date = new Date().toISOString().split("T")[0];

  // Categorize services
  const analytics = scan.services.filter((s) => s.category === "analytics");
  const auth = scan.services.filter((s) => s.category === "auth");
  const payment = scan.services.filter((s) => s.category === "payment");
  const ai = scan.services.filter((s) => s.category === "ai");
  const monitoring = scan.services.filter((s) => s.category === "monitoring");
  const advertising = scan.services.filter((s) => s.category === "advertising");
  const email_svc = scan.services.filter((s) => s.category === "email");
  const storage = scan.services.filter(
    (s) => s.category === "storage" || s.category === "database",
  );

  // Build data collection bullets (plain language)
  const collectBullets: string[] = [];
  if (auth.length > 0) {
    collectBullets.push("Your email and account info when you sign up or log in");
  }
  if (payment.length > 0) {
    collectBullets.push(
      "Billing details for purchases (processed securely — we never store your full card number)",
    );
  }
  if (analytics.length > 0) {
    collectBullets.push("How you use the app (pages visited, features used)");
  }
  if (monitoring.length > 0) {
    collectBullets.push(
      "Technical info like device type, browser, and error reports to fix bugs",
    );
  }
  if (ai.length > 0) {
    collectBullets.push(
      "Content you provide to AI-powered features (text, files, prompts)",
    );
  }
  if (email_svc.length > 0) {
    collectBullets.push("Your email address for account notifications");
  }

  // Fallback if no specific categories matched
  if (collectBullets.length === 0) {
    const dataFields = scan.dataCategories
      .map((dc) => dc.category.toLowerCase())
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 4);
    if (dataFields.length > 0) {
      collectBullets.push(`Personal data including: ${dataFields.join(", ")}`);
    } else {
      collectBullets.push("Basic account and usage information");
    }
  }

  // Build purpose bullets
  const purposeBullets: string[] = [
    "Provide and run the service you signed up for",
  ];
  if (payment.length > 0) {
    purposeBullets.push("Process your payments");
  }
  if (analytics.length > 0) {
    purposeBullets.push("Understand usage patterns to improve the product");
  }
  if (monitoring.length > 0) {
    purposeBullets.push("Find and fix technical issues");
  }
  if (ai.length > 0) {
    purposeBullets.push("Power AI features you choose to use");
  }
  if (email_svc.length > 0) {
    purposeBullets.push("Send you important account updates");
  }
  purposeBullets.push("Meet our legal obligations");

  // Build sharing bullets
  const sharingBullets: string[] = [];
  const thirdParties = scan.services.filter((s) => s.isDataProcessor !== false);
  if (thirdParties.length > 0) {
    const names = thirdParties
      .map((s) => s.name)
      .slice(0, 6)
      .join(", ");
    const more =
      thirdParties.length > 6
        ? ` + ${thirdParties.length - 6} more`
        : "";
    sharingBullets.push(
      `Service providers who help us run the app: ${names}${more}`,
    );
  }
  if (advertising.length > 0) {
    sharingBullets.push(
      `Advertising partners: ${advertising.map((s) => s.name).join(", ")}`,
    );
  }
  sharingBullets.push("Law enforcement only when legally required");

  // AI disclosure section
  let aiSection = "";
  if (ai.length > 0) {
    aiSection = `
## AI Features

This app uses AI (${ai.map((s) => s.name).join(", ")}):

- Your inputs are processed to generate responses
- We do not use your data to train AI models without consent
- You can opt out of AI features at any time
- See our [AI Disclosure](./AI_DISCLOSURE.md) for full details
`;
  }

  // Cookie/tracking section
  let trackingSection = "";
  if (analytics.length > 0 || advertising.length > 0) {
    trackingSection = `
## Cookies & Tracking

- We use cookies to keep you logged in and remember your preferences
${analytics.length > 0 ? "- Analytics cookies help us understand how the app is used\n" : ""}${advertising.length > 0 ? "- Advertising cookies may be used for relevant ads\n" : ""}- You can manage cookie preferences in your account settings
- See our [Cookie Policy](./COOKIE_POLICY.md) for details
`;
  }

  const doc = `# Privacy Notice — ${company}

**Last updated:** ${date}

> This is a simplified in-app privacy notice. For the complete legal privacy policy, see [Privacy Policy](./PRIVACY_POLICY.md).

---

## What We Collect

- ${collectBullets.join("\n- ")}

## Why We Collect It

- ${purposeBullets.join("\n- ")}

## Who We Share With

- ${sharingBullets.join("\n- ")}

We **never sell** your personal data.
${aiSection}${trackingSection}
## Your Rights

You can always:

- **See** what data we have about you
- **Download** a copy of your data
- **Delete** your account and data
- **Opt out** of non-essential tracking
- **Update** your info in account settings

To exercise any of these rights, email **${email}** or use the in-app settings.

## Data Security

- All data encrypted in transit (HTTPS)
- Access restricted to authorized personnel
- Regular security reviews and updates

## Contact

Questions? Reach us at **${email}**.

---

**Links to full documents:**

- [Privacy Policy](./PRIVACY_POLICY.md) — complete legal details
- [Terms of Service](./TERMS_OF_SERVICE.md) — usage terms
${ai.length > 0 ? "- [AI Disclosure](./AI_DISCLOSURE.md) — how AI features work\n" : ""}${analytics.length > 0 || advertising.length > 0 ? "- [Cookie Policy](./COOKIE_POLICY.md) — cookie details\n" : ""}- [Security Policy](./SECURITY.md) — how we protect your data

---

> **Disclaimer:** This notice was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on source code analysis. It should be reviewed by a qualified legal professional before use. This notice applies to ${website}.
`;

  return doc;
}
