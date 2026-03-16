# Example Output — All Formats

Generated from a Next.js SaaS app using OpenAI + Stripe + Supabase + PostHog + Sentry + Resend.

```bash
npx codepliant go --format all
```

**455 files generated in 8 formats.** Here are the key ones:

---

## 📄 Markdown (for your repo)

| Document | Preview |
|----------|---------|
| [Privacy Policy](./markdown/PRIVACY_POLICY.md) | GDPR Art. 13 compliant, mentions OpenAI/Stripe/Supabase by name |
| [Terms of Service](./markdown/TERMS_OF_SERVICE.md) | SaaS terms with arbitration, ALL CAPS disclaimers |
| [AI Disclosure](./markdown/AI_DISCLOSURE.md) | EU AI Act Art. 50, risk classification, provider policies |
| [Cookie Policy](./markdown/COOKIE_POLICY.md) | ePrivacy + GDPR, PostHog cookies listed |
| [Security Policy](./markdown/SECURITY.md) | Vulnerability disclosure, response timeline |
| [Data Flow Map](./markdown/DATA_FLOW_MAP.md) | Collection → Storage → Sharing paths |
| [Data Classification](./markdown/DATA_CLASSIFICATION.md) | GDPR sensitivity levels per field |

## 📝 Word / DOCX (for lawyers)

Download and open in Microsoft Word or Google Docs:

| Document | Download |
|----------|----------|
| [Privacy Policy](./docx/PRIVACY_POLICY.docx) | For legal review |
| [Terms of Service](./docx/TERMS_OF_SERVICE.docx) | For legal review |
| [AI Disclosure](./docx/AI_DISCLOSURE.docx) | For legal review |
| [Cookie Policy](./docx/COOKIE_POLICY.docx) | For legal review |
| [Security Policy](./docx/SECURITY.docx) | For legal review |

## 🌐 HTML (for your website)

| File | Description |
|------|-------------|
| [index.html](./html/index.html) | Apple-style compliance page (all docs, navigation, dark mode) |
| [compliance.html](./html/compliance.html) | Tabbed dashboard with search |
| [compliance.print.html](./html/compliance.print.html) | Print-optimized (save as PDF from browser) |

## 📊 JSON (for APIs)

| File | Description |
|------|-------------|
| [compliance.json](./json/compliance.json) | Structured scan results + documents for API consumption |
| [COOKIE_CONSENT_CONFIG.json](./json/COOKIE_CONSENT_CONFIG.json) | Machine-readable cookie config for CMP integration |

## 📋 Confluence (for wikis)

| File | Description |
|------|-------------|
| [PRIVACY_POLICY.xhtml](./confluence/PRIVACY_POLICY.xhtml) | Confluence Storage Format with `ac:structured-macro` |
| [AI_DISCLOSURE.xhtml](./confluence/AI_DISCLOSURE.xhtml) | Ready for Confluence import |

## 📦 Notion

| File | Description |
|------|-------------|
| [compliance-notion.zip](./compliance-notion.zip) | All docs with YAML frontmatter, ready for Notion import |

## 🏷️ Badges (for README)

| Badge | File |
|-------|------|
| ![Score](./badges/compliance-score.svg) | [compliance-score.svg](./badges/compliance-score.svg) |
| ![Status](./badges/compliance-status.svg) | [compliance-status.svg](./badges/compliance-status.svg) |

## 🔧 Widgets (for your website)

| File | Usage |
|------|-------|
| [widget.js](./widgets/widget.js) | `<script src="/legal/widget.js"></script>` — footer links |
| [cookie-banner.js](./widgets/cookie-banner.js) | `<script src="/legal/cookie-banner.js"></script>` — GDPR consent |

## 📊 Scan Result

[scan-result.json](./scan-result.json) — raw scan output showing all detected services with evidence.

---

## Reproduce This

```bash
npx codepliant go --format all
```

Total: **455 files** across Markdown, DOCX, HTML, JSON, Confluence XHTML, Notion ZIP, SVG badges, and JS widgets.
