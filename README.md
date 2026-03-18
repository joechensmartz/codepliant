<p align="center">
  <img src="./assets/logo.svg" width="80" alt="Codepliant" />
</p>

<h1 align="center">Codepliant</h1>

<p align="center">
  <strong>Compliance documents from your actual code. Not questionnaires.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/codepliant"><img src="https://img.shields.io/npm/v/codepliant?style=flat-square&color=blueviolet" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/codepliant"><img src="https://img.shields.io/npm/dm/codepliant?style=flat-square&color=orange" alt="npm downloads" /></a>
  <img src="https://img.shields.io/badge/tests-3177%20passed-brightgreen?style=flat-square" alt="tests" />
  <img src="https://img.shields.io/badge/ecosystems-13-blue?style=flat-square" alt="ecosystems" />
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/joechensmartz/codepliant?style=flat-square" alt="license" /></a>
</p>

---

## Quick Start

```bash
# 1. Go to your project directory
cd your-project

# 2. Run one command
npx codepliant go

# 3. Check the generated legal/ directory
ls legal/
# → legal/    ai/    security/    privacy/    vendor/    audit/    governance/
```

**That's it.** No signup. No API key. No config file. Runs locally in under 1 second. Your code never leaves your machine.

Want to customize? See [Configuration](#configuration). Want HTML/PDF? Run `codepliant go --format html`.

---

## Why does this exist?

You added Stripe last week. OpenAI the week before. Supabase for auth. PostHog for analytics. Sentry for error tracking.

Each one collects user data. Each one requires disclosure in your privacy policy. And starting **August 2, 2026**, the EU AI Act requires you to disclose every AI system in your application — with fines up to **EUR 35 million**.

**Do you know exactly what data your app collects?** Most developers don't. Codepliant reads your actual code and tells you.

---

## How it works

```
package.json:    "stripe": "^14.0"       → Payment data collection
source code:     import OpenAI from "openai"  → AI usage, needs disclosure
.env:            SENTRY_DSN=https://...   → Error monitoring, collects IPs
Prisma schema:   email String @unique     → Personal data storage
API route:       POST /api/chat { email } → Data intake endpoint
docker-compose:  postgres, redis          → Data persistence infrastructure
```

Codepliant scans your dependencies, imports, env vars, database schemas, API routes, and infrastructure configs — then generates documents that mention your actual services by name.

Not "third-party analytics providers" — it says **"PostHog"** because it found PostHog in your code.

Supports: JavaScript/TypeScript, Python, Go, Ruby, Elixir, PHP, Rust, Java, .NET — and frameworks like Rails, Laravel, Express, FastAPI, Django.

---

## What you get

```
legal/
├── legal/       Privacy Policy, Terms of Service, Cookie Policy, AI Disclosure, Refund Policy, DPA
├── ai/          AI Model Card, AI Governance Framework, AI Impact Assessment, AI Ethics Statement
├── security/    Security Policy, Incident Response Plan, Encryption Policy, Disaster Recovery
├── privacy/     Data Dictionary, Data Flow Map, DSAR Guide, Retention Policy, Consent Records
├── vendor/      Sub-Processor List, Vendor Risk Assessment, Security Questionnaire, Exit Plan
├── audit/       SOC 2 Checklist, ISO 27001 Checklist, Risk Register, Compliance Gap Analysis
├── governance/  Executive Dashboard, Compliance Roadmap, KPI Dashboard, Board Report
├── hr/          Employee Privacy Notice, Training Record, Onboarding Guide
├── config/      Cookie Consent Config (JSON), Privacy Dashboard Config (JSON)
└── guides/      Quick Start Guide, Automation Guide
```

**123+ documents total.** Each one is personalized to your detected services, data fields, and infrastructure.

[Browse example output from cal.com (23 services detected) →](./examples/real-projects/cal-com/legal/)

<details>
<summary><strong>Why you need these documents (click to expand)</strong></summary>

### Documents your users will see

| Document | Why you need it | Where to put it |
|----------|----------------|-----------------|
| **Privacy Policy** | **Legally required** if you collect any user data (GDPR Art. 13, CCPA). Can't list on app stores or run ads without one. | `/privacy` on your website |
| **Terms of Service** | Limits your liability. Without it, users can sue you in any jurisdiction for any reason. | `/terms` on your website |
| **Cookie Policy** | **Required by ePrivacy Directive** if you use analytics, tracking, or auth cookies. | `/cookies` on your website |
| **AI Disclosure** | **Required by EU AI Act Art. 50** (effective Aug 2, 2026). Fines up to EUR 35M. | `/ai-disclosure` on your website |

### Documents for enterprise sales

| Document | Why you need it |
|----------|----------------|
| **Data Processing Agreement** | **Required by GDPR Art. 28**. Every B2B customer in Europe will ask for this. |
| **Sub-Processor List** | Part of DPA — list every third-party that touches customer data. |
| **Security Policy** | Required for SOC 2 and vendor security reviews. |

### Documents for audits

| Document | Which audit |
|----------|-------------|
| **SOC 2 Checklist** | SOC 2 Type I / Type II |
| **ISO 27001 Checklist** | ISO 27001 certification |
| **Privacy Impact Assessment** | GDPR Art. 35, new feature launches |
| **Incident Response Plan** | SOC 2, ISO 27001, GDPR (72-hour breach window) |

### AI-specific (EU AI Act)

| Document | Regulatory basis |
|----------|-----------------|
| **AI Model Card** | EU AI Act Art. 53 |
| **AI Governance Framework** | EU AI Act + NIST AI RMF |
| **AI Impact Assessment** | EU AI Act + Colorado AI Act |

[Full document type reference →](./docs/document-types.md)

</details>

---

## vs. existing tools

| Termly / Iubenda | Codepliant |
|---|---|
| "Do you collect email addresses?" — *I think so?* | Reads `email: String @unique` from your Prisma schema |
| "Do you use AI?" — *Yes but what do I disclose?* | Detects OpenAI + Anthropic, generates Art. 50 disclosure |
| "List your sub-processors" — *Uhh...* | Finds Stripe, Sentry, Resend — generates the full list |
| 30 minutes of forms → generic template | 30 seconds → 123+ documents tailored to your code |

---

## Tested against 1200+ real projects

| Project | Stack | Services Found |
|---------|-------|---------------|
| [cal.com](./examples/real-projects/cal-com/) | Next.js + Prisma | 23 services |
| [chatwoot](./examples/real-projects/chatwoot/) | Ruby/Rails | 24 services |
| [twenty](./examples/real-projects/twenty/) | NestJS | 19 services |
| [documenso](./examples/real-projects/documenso/) | Next.js + Prisma | 16 services |
| [maybe](./examples/real-projects/maybe/) | Ruby/Rails | 16 services |
| [medusa](./examples/real-projects/medusa/) | Express | 14 services |
| [mastodon](./examples/real-projects/mastodon/) | Ruby/Rails | 14 services |
| [formbricks](./examples/real-projects/formbricks/) | Next.js | 13 services |
| [saleor](./examples/real-projects/saleor/) | Django | 5 services |

Each project includes the full generated `legal/` directory — [browse them on GitHub →](./examples/real-projects/)

---

## All commands

```bash
npx codepliant go                  # Generate all compliance documents
npx codepliant go --format html    # HTML compliance page for your website
npx codepliant go --format pdf     # PDF output
npx codepliant scan                # Just scan, no files generated
npx codepliant init                # Interactive setup (.codepliantrc.json)
npx codepliant check               # Check if docs are up to date
npx codepliant dashboard           # Compliance dashboard
npx codepliant certify             # Generate compliance certificate
npx codepliant count               # Quick stats (one-line, scriptable)
```

### Configuration

Create `.codepliantrc.json` in your project root:

```json
{
  "companyName": "Your Company",
  "contactEmail": "privacy@company.com",
  "jurisdictions": ["gdpr", "ccpa", "uk-gdpr"],
  "dpoEmail": "dpo@company.com"
}
```

### CI/CD (GitHub Action)

```yaml
- uses: joechensmartz/codepliant@v1
  with:
    fail-on-missing: true    # Fail if required docs are missing
    comment-on-pr: true      # Post compliance summary on PRs
    format: markdown          # markdown, html, pdf, json
```

Outputs `services-count`, `documents-count`, and `compliance-score` for use in subsequent steps.

### MCP Server (Claude Code / Cursor)

```json
{ "mcpServers": { "codepliant": { "command": "npx", "args": ["codepliant-mcp"] } } }
```

### Output formats

Markdown (default), HTML, PDF, JSON, DOCX, Notion, Confluence, GitHub Pages, cookie consent banner, embeddable widget — [see all formats →](./examples/sample-output/)

---

## Generating the Demo GIF

The demo GIF in this README is generated with [VHS](https://github.com/charmbracelet/vhs) from `demo.tape`.

```bash
# Install VHS
brew install charmbracelet/tap/vhs

# Generate the GIF
vhs demo.tape
```

The output is written to `assets/demo.gif`.

## Links

- [Example Output](./examples/sample-output/) — all output formats
- [Real Project Scans](./examples/real-projects/) — 10 open-source projects with full generated docs
- [Document Type Reference](./docs/document-types.md) — why each of the 123+ documents exists
- [Contributing](./CONTRIBUTING.md)
- [Changelog](./CHANGELOG.md)

## License

MIT — free forever.

---

*Zero network calls. Your code never leaves your machine. [Verify it.](./src/scanner/no-network.test.ts)*
