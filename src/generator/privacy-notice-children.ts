import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates a PRIVACY_NOTICE_CHILDREN.md — child-friendly privacy notice.
 * Only generated when COPPA compliance is detected.
 * Uses simple language, short sentences, and icon/emoji descriptions
 * to explain data collection to young users.
 */
export function generatePrivacyNoticeChildren(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  const hasCOPPA = scan.complianceNeeds.some(
    (n) => n.document === "COPPA Compliance"
  );

  if (!hasCOPPA) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const website = ctx?.website || "[your-website.com]";
  const date = new Date().toISOString().split("T")[0];

  const hasAuth = scan.services.some((s) => s.category === "auth");
  const hasAnalytics = scan.services.some(
    (s) => s.category === "analytics" || s.category === "advertising"
  );
  const hasStorage = scan.services.some(
    (s) => s.category === "storage" || s.category === "database"
  );
  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasEmail = scan.services.some((s) => s.category === "email");

  const sections: string[] = [];
  let sectionNum = 0;

  function nextSection(): number {
    return ++sectionNum;
  }

  // ── Title ─────────────────────────────────────────────────────────

  sections.push(`# Privacy Notice for Young Users

**From:** ${company}
**Date:** ${date}

---

Hi there! This page explains how we use your information when you use our app or website. We wrote this in a way that is easy to understand.

Your parent or guardian should read this with you. If you have questions, ask a grown-up to help!

> **For parents and guardians:** This notice is designed to comply with the Children's Online Privacy Protection Act (COPPA). For our full privacy policy, please visit ${website}. If you have questions, contact us at ${email}.`);

  // ── What Information Do We Collect? ─────────────────────────────────

  {
    let collectSection = `
## ${nextSection()}. What Information Do We Collect?

Here is what we might ask you for or learn about you:

`;

    if (hasAuth) {
      collectSection += `### [Lock icon] Your Account Info
- Your **username** (you can pick a fun name — it does not have to be your real name!)
- Your **password** (we keep this secret and safe)
- Your **email address** (we ask your parent or guardian for this)

`;
    }

    if (hasAnalytics) {
      collectSection += `### [Bar chart icon] How You Use Our App
- Which pages you visit
- Which buttons you click
- How long you spend on each page

We use this to make the app better and more fun for you!

`;
    }

    if (hasStorage) {
      collectSection += `### [Folder icon] Things You Create
- Pictures, drawings, or files you upload
- Messages or comments you write
- Projects or creations you save

These belong to you! We just keep them safe so you can find them later.

`;
    }

    if (hasAI) {
      collectSection += `### [Robot icon] When You Talk to Our Smart Helper
- Questions you ask
- Things you type or say

Our smart helper uses this to give you answers, but it does not remember you after your conversation is done.

`;
    }

    collectSection += `### [Computer icon] Your Device Info
- What kind of device you use (like a phone, tablet, or computer)
- What language your device is set to

We use this so the app works right on your device.`;

    sections.push(collectSection);
  }

  // ── Why Do We Collect It? ───────────────────────────────────────────

  sections.push(`
## ${nextSection()}. Why Do We Collect This?

We only collect what we need. Here is why:

| Why | What it means |
|-----|--------------|
| [Gear icon] **To make the app work** | So you can log in, save your stuff, and use all the features |
| [Shield icon] **To keep you safe** | So we can stop bad things from happening and keep bullies away |
| [Sparkle icon] **To make things better** | So we can fix bugs and add cool new features |
| [Envelope icon] **To talk to your parents** | So we can send important updates to your parent or guardian |`);

  // ── Who Can See Your Information? ──────────────────────────────────

  {
    let sharingSection = `
## ${nextSection()}. Who Can See Your Information?

We are very careful about who can see your information:

- [Checkmark icon] **You** — You can always see your own information
- [Checkmark icon] **Your parents or guardians** — They can see everything too
- [Checkmark icon] **Our team** — Only the people who need it to help you`;

    if (scan.services.length > 0) {
      sharingSection += `
- [Checkmark icon] **Helpers we trust** — Some companies help us run the app (like keeping your files safe). They follow strict rules about your information`;
    }

    sharingSection += `

### We NEVER:
- [X icon] Sell your information to anyone
- [X icon] Show your information to advertisers
- [X icon] Share your real name or contact info with other kids
- [X icon] Let strangers see your stuff`;

    sections.push(sharingSection);
  }

  // ── Your Parent's Superpowers ──────────────────────────────────────

  sections.push(`
## ${nextSection()}. Your Parent's Superpowers

Your parent or guardian has special powers! They can:

- [Eye icon] **See everything** — Look at all the information we have about you
- [Trash icon] **Delete everything** — Ask us to erase all your information
- [Stop icon] **Say no** — Tell us to stop collecting your information
- [Download icon] **Get a copy** — Ask for a copy of all your information

To use these superpowers, your parent can email us at **${email}**.

We will answer within **30 days** (that is about one month).`);

  // ── How Do We Keep Your Information Safe? ───────────────────────────

  sections.push(`
## ${nextSection()}. How We Keep Your Information Safe

We work really hard to keep your information safe:

- [Lock icon] **Locked up tight** — We use special codes (called encryption) to scramble your information so only we can read it
- [Shield icon] **Guards on duty** — Our computers have strong protections, like a digital fortress
- [Key icon] **Limited access** — Only a few trusted people on our team can see your information
- [Clock icon] **We don't keep it forever** — When we don't need your information anymore, we delete it`);

  // ── Cookies (the computer kind!) ───────────────────────────────────

  if (hasAnalytics) {
    sections.push(`
## ${nextSection()}. Cookies (The Computer Kind!)

No, not chocolate chip cookies! [Cookie icon]

**Computer cookies** are tiny files that help our app remember you. Here is what ours do:

| Cookie Type | What It Does | Can You Say No? |
|-------------|-------------|----------------|
| [Checkmark icon] **Must-have cookies** | Keep you logged in and the app working | These are needed for the app to work |
| [Bar chart icon] **Helper cookies** | Tell us which parts of the app are popular | Your parent can turn these off |

We do NOT use cookies to:
- [X icon] Show you ads
- [X icon] Track you on other websites
- [X icon] Share information with advertisers`);
  }

  // ── How to Contact Us ──────────────────────────────────────────────

  sections.push(`
## ${nextSection()}. How to Reach Us

If you or your parent has questions, here is how to reach us:

- [Envelope icon] **Email:** ${email}
- [Globe icon] **Website:** ${website}

When you email us, please have your parent or guardian help you. We want to make sure we are talking to the right person!`);

  // ── Changes to This Notice ─────────────────────────────────────────

  sections.push(`
## ${nextSection()}. If We Change This Notice

Sometimes we need to update this notice. If we do:

1. We will put the new notice on our website
2. We will email your parent or guardian about the changes
3. If we want to collect new types of information, we will ask your parent for permission first

We will NEVER start collecting more information without telling your parent first.`);

  // ── Quick Summary ──────────────────────────────────────────────────

  sections.push(`
## Quick Summary

| Question | Answer |
|----------|--------|
| Do you sell my information? | **No, never!** |
| Can my parent see my information? | **Yes, always!** |
| Can my parent delete my information? | **Yes!** Email ${email} |
| Do you show me ads based on my information? | **No!** |
| Is my information safe? | **Yes!** We use strong protections |
| Do I have to share my information? | **No!** You only need to share what is needed for the app to work |`);

  // ── Footer ────────────────────────────────────────────────────────

  sections.push(
    `\n---\n\n*This child-friendly privacy notice was generated by [Codepliant](https://github.com/codepliant/codepliant) to help comply with the Children's Online Privacy Protection Act (COPPA). This notice should be reviewed by qualified legal counsel before publication.*`
  );

  return sections.join("\n");
}
