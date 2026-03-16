# Quick Start Compliance Guide

> **You just ran codepliant.** Here's what to do next.
> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16

*Generated for [Your Company Name] on 2026-03-16*

---

## Your scan detected 11 service(s)

**Services found:** @aws-sdk/client-s3, @segment/analytics-next, @sendgrid/mail, algoliasearch, cookie-parser, express-session, ioredis, Multer, openai, posthog, stripe

Codepliant has generated your compliance documents in the `legal/` directory. Follow the steps below to go from "generated" to "deployed."

---

## Step 1: Review Your Privacy Policy

Your `PRIVACY_POLICY.md` has been tailored to your actual code. It mentions every service detected by name — not generic placeholders.

**What to do:**

1. Open `legal/PRIVACY_POLICY.md`
2. Search for `[Your Company Name]` and replace with your actual company name
3. Search for `[your-email@example.com]` and replace with your privacy contact email
4. Review each section — especially "Third-Party Services" and "Data Collection"
5. Have a lawyer review before publishing (the document includes a disclaimer)

> **AI Notice:** Your project uses AI services. Review `AI_DISCLOSURE.md` carefully — the EU AI Act (effective August 2, 2026) requires specific disclosures.

**Estimated time:** 15-30 minutes

[View Privacy Policy →](./PRIVACY_POLICY.md)

---

## Step 2: Add Documents to Your Website

Your compliance documents need to be publicly accessible. Here's how to add them for your stack:

### Next.js

```bash
# Copy to your public directory
cp legal/PRIVACY_POLICY.md public/

# Or create a dedicated legal page
mkdir -p app/legal/privacy
```

```tsx
// app/legal/privacy/page.tsx
import fs from 'fs';
import path from 'path';

export default function PrivacyPolicy() {
  const content = fs.readFileSync(
    path.join(process.cwd(), 'legal/PRIVACY_POLICY.md'),
    'utf-8'
  );
  return <div className="prose max-w-3xl mx-auto py-12">{/* render markdown */}</div>;
}
```

Add to your footer:
```tsx
<Link href="/legal/privacy">Privacy Policy</Link>
<Link href="/legal/terms">Terms of Service</Link>
<Link href="/legal/ai-disclosure">AI Disclosure</Link>
```

> **Pro tip:** Run `npx codepliant go --format html` to generate ready-to-serve HTML versions of all documents.

---

## Step 3: Set Up Cookie Consent

Your project uses analytics services that set cookies. You need a cookie consent banner to comply with GDPR and ePrivacy Directive.

**Your `COOKIE_CONSENT_CONFIG.json` is ready.** It contains machine-readable cookie definitions for popular consent management platforms.

### Option A: Use a CMP (recommended)

Import your cookie config into one of these platforms:

| Platform | Free Tier | Setup |
|----------|-----------|-------|
| [CookieYes](https://www.cookieyes.com) | Up to 100 pages | Copy `COOKIE_CONSENT_CONFIG.json` |
| [Cookiebot](https://www.cookiebot.com) | Up to 100 pages | Import cookie declarations |
| [OneTrust](https://www.onetrust.com) | Enterprise | Use cookie inventory |

### Option B: Build your own

Use the `COOKIE_INVENTORY.md` as a reference to build a custom consent banner. Your inventory lists every cookie by name, purpose, duration, and category.

---

## Step 4: Configure CI/CD

Keep your compliance documents in sync with your code. When you add a new service, your docs should update automatically.

### GitHub Actions (recommended)

```yaml
# .github/workflows/compliance.yml
name: Compliance Check
on: [push, pull_request]

jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: joechensmartz/codepliant@v220
        with:
          fail-on-missing: true
```

This will:
- Scan your code on every push and PR
- Fail the build if compliance docs are missing or outdated
- Comment on PRs with compliance impact

### GitLab CI

```yaml
compliance:
  image: node:20
  script:
    - npx codepliant check
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
```

### Pre-commit Hook

```bash
# Install a git hook that checks compliance before every commit
npx codepliant hook install
```

---

## Step 5: Ongoing Maintenance

Compliance is not "set and forget." Here's your maintenance schedule:

| Frequency | Action | Command |
|-----------|--------|---------|
| Every commit | Auto-check via CI/CD | `codepliant check` |
| Weekly | Review compliance dashboard | `codepliant dashboard` |
| Monthly | Re-scan and update docs | `codepliant update` |
| Quarterly | Full compliance review | `codepliant report` |
| Annually | Annual review checklist | See `ANNUAL_REVIEW_CHECKLIST.md` |

---

## Quick Reference

| Document | Purpose | Location |
|----------|---------|----------|
| Privacy Policy | What data you collect and why | `legal/PRIVACY_POLICY.md` |
| Terms of Service | Rules for using your product | `legal/TERMS_OF_SERVICE.md` |
| AI Disclosure | EU AI Act Article 50 compliance | `legal/AI_DISCLOSURE.md` |
| Cookie Policy | Cookie usage and consent | `legal/COOKIE_POLICY.md` |
| Refund Policy | Refund and cancellation terms | `legal/REFUND_POLICY.md` |
| Security Policy | How you protect user data | `legal/SECURITY.md` |
| Incident Response | What happens during a breach | `legal/INCIDENT_RESPONSE_PLAN.md` |

---

## Need Help?

- **Re-scan after changes:** `npx codepliant go`
- **Check compliance status:** `npx codepliant dashboard`
- **Validate documents:** `npx codepliant validate`
- **Get a compliance report:** `npx codepliant report`

---

*Generated by Codepliant v220.0.0 on 2026-03-16.*
*This guide is personalized to your detected stack. Re-run `npx codepliant go` after adding new services to keep it updated.*
*Compliance documents should be reviewed by a qualified legal professional before publication.*
