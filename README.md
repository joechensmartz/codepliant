<p align="center">
  <img src="./assets/logo.svg" width="80" alt="Codepliant" />
</p>

<h1 align="center">Codepliant</h1>

<p align="center">
  <strong>Compliance documents from your actual code. Not questionnaires.</strong>
</p>

<p align="center">
  <code>npx codepliant go</code>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-v500-blueviolet?style=flat-square" alt="version" />
  <img src="https://img.shields.io/badge/tests-792%20passed-brightgreen?style=flat-square" alt="tests" />
  <img src="https://img.shields.io/badge/precision-100%25-brightgreen?style=flat-square" alt="precision" />
  <img src="https://img.shields.io/badge/docs-120%2B%20types-blue?style=flat-square" alt="docs" />
  <img src="https://img.shields.io/badge/ecosystems-10%2B-blue?style=flat-square" alt="ecosystems" />
  <img src="https://img.shields.io/badge/repos%20tested-1200%2B-blue?style=flat-square" alt="repos" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="license" />
</p>

---

## Your app collects user data. Where are your legal documents?

You added Stripe last week. OpenAI the week before. Supabase for auth. PostHog for analytics. Sentry for error tracking.

Each one collects user data. Each one requires disclosure in your privacy policy. And starting **August 2, 2026**, the EU AI Act requires you to disclose every AI system in your application — with fines up to **EUR 35 million**.

**Do you know exactly what data your app collects?** Most developers don't. Especially when half the code is AI-generated.

---

## One command. Every document you need.

```bash
npx codepliant go
```

Codepliant reads your actual source code — not a questionnaire — and generates every compliance document your project requires.

```
Scanning package.json...     ✓ 7 services detected
Scanning source imports...   ✓ OpenAI, Stripe found in code
Scanning .env...             ✓ 9 API keys detected
Scanning Prisma schema...    ✓ User model: email, phone, passwordHash

Generated 120+ documents in legal/

  PRIVACY_POLICY.md                  — mentions Stripe, OpenAI, Supabase by name
  AI_DISCLOSURE.md                   — EU AI Act Art. 50 compliant
  TERMS_OF_SERVICE.md                — SaaS terms with arbitration clause
  COOKIE_POLICY.md                   — PostHog cookies listed specifically
  DATA_PROCESSING_AGREEMENT.md       — GDPR Art. 28, lists your sub-processors
  RESPONSIBLE_DISCLOSURE_POLICY.md   — bug bounty scope, safe harbor, response timeline
  API_TERMS_OF_USE.md                — rate limits, auth, SLA for API consumers
  OPEN_SOURCE_NOTICE.md              — OSS attribution, license summaries
  INCIDENT_RESPONSE_PLAN.md          — 72-hour GDPR breach notification
  DATA_DICTIONARY.md                 — every data field cataloged with sensitivity
  ACCESS_CONTROL_POLICY.md           — RBAC, password policy, MFA requirements
  CHANGE_MANAGEMENT_POLICY.md        — code review, deployment, rollback procedures
  ... and 40+ more

Generation Summary
  Total documents: 120+
  Total lines generated: 15,000+
  Estimated lawyer equivalent: Generated 120+ documents (~$120,000 lawyer equivalent)

Compliance score: 100% (A)
Done in 24ms.
```

**Every document mentions your actual services by name.** Not "third-party analytics providers" — it says "PostHog" because it found PostHog in your code.

<p align="center">
  <img src="./assets/demo-screenshot.svg" width="700" alt="Codepliant scanning a SaaS project" />
</p>

---

## The problem with existing tools

| You go to Termly/Iubenda... | You use Codepliant... |
|---|----|
| "Do you collect email addresses?" — *I think so?* | Reads `email: String @unique` from your Prisma schema |
| "Do you use cookies?" — *Probably?* | Finds PostHog, Google Analytics, Supabase Auth in your code |
| "Do you use AI?" — *Yes but what do I disclose?* | Detects OpenAI + Anthropic, generates Article 50 disclosure |
| "List your sub-processors" — *Uhh...* | Finds Stripe, Sentry, Resend, generates the full list with their DPA URLs |
| 30 minutes of forms → generic template | 30 seconds → 120+ documents tailored to your code |

---

## Who uses this

**SaaS founders** — "I need a privacy policy before launch. I don't have $2,000 for a lawyer and I don't know what half my dependencies collect."

**Developers** — "I added OpenAI last sprint. Now I need to update the privacy policy, add an AI disclosure, and figure out what the EU AI Act requires. I don't want to spend a day on this."

**CTOs preparing for audit** — "Investors want SOC 2 readiness docs. I need a privacy impact assessment, incident response plan, data processing agreements, and a third-party risk assessment. Yesterday."

**Agencies** — "I manage 15 client projects. Each needs compliance docs. `codepliant scan-all ./clients` runs them all in one shot."

---

## What it detects (from your actual code)

```
package.json:    "stripe": "^14.0"       → Payment data collection
source code:     import OpenAI from "openai"  → AI usage, needs disclosure
.env:            SENTRY_DSN=https://...   → Error monitoring, collects IPs
Prisma schema:   email String @unique     → Personal data storage
API route:       POST /api/chat { email } → Data intake endpoint
docker-compose:  postgres, redis          → Data persistence infrastructure
```

Supports: JavaScript/TypeScript, Python, Go, Ruby, Elixir, PHP, Rust, Java, .NET, Django — and frameworks like Rails, Laravel, Express, FastAPI.

## What it generates

**Legal** — Privacy Policy (GDPR Art. 13), Terms of Service, Cookie Policy, Data Processing Agreement, API Terms of Use, Refund Policy, SLA

**AI Compliance** — AI Disclosure (EU AI Act Art. 50), AI Model Card (Art. 53), AI Act Checklist, AI Governance Framework, Acceptable AI Use Policy, AI Ethics Statement, AI Training Data Notice, AI Impact Assessment, AI Red Team Guide, AI Supply Chain Risk

**Security** — Security Policy, Incident Response Plan, Vulnerability Scan, Access Control Policy, Change Management Policy, Responsible Disclosure Policy, Encryption Policy, Backup Policy, Disaster Recovery, Penetration Test Scope, Incident Severity Matrix

**Privacy** — DSAR Handling Guide, Consent Management Guide, Data Retention Policy, Data Dictionary, Privacy by Design Checklist, Cookie Inventory, Data Subject Categories, Lawful Basis Assessment, Data Deletion Procedures, Privacy Risk Matrix, Data Mapping Register, Multilingual Privacy Notices (DE/FR/ES)

**Operations** — Open Source Notice, License Compliance, Sub-Processor List, Vendor Contacts, Data Flow Map, Record of Processing, Transfer Impact Assessment, Regulatory Updates, Audit Log Policy

**Audit** — SOC 2 Checklist, ISO 27001 Checklist, Privacy Impact Assessment, Third-Party Risk Assessment, Data Classification, Risk Register, Compliance Certificate, Annual Review Checklist, Compliance Maturity Model, Compliance Gap Analysis

**Governance** — Privacy Program Charter, DPO Handbook, Compliance Oath, Regulatory Correspondence Log, Third-Party Due Diligence, Key Person Risk, Whistleblower Policy, Compliance KPI Dashboard

**Executive** — Executive Dashboard, Executive Briefing, Compliance Board Report, Compliance Summary Email, Compliance Roadmap, Transparency Report, Regulatory Readiness Scorecard

**HR/Training** — Employee Privacy Notice, Employee Handbook Privacy, Training Record, Security Awareness Program

**Incident** — Data Breach Notification Templates, Incident Communication Templates, Data Breach Response Drill

**Privacy UX** — Privacy Notice (Short) for in-app display, Cookie Consent Config (JSON) for CMP integration (OneTrust, CookieYes, Cookiebot)

**Output formats** — Markdown, HTML, PDF (with preview via `codepliant pdf <doc>`), JSON, Notion, Confluence, DOCX, GitHub Pages, cookie consent banner, embeddable widget, 13+ formats total

[See example output from a real SaaS project →](./examples/sample-output/)

Browse all output formats on GitHub:
- [Markdown](./examples/sample-output/) — default, works everywhere
- [HTML](./examples/sample-output/) — Apple-style compliance page with navigation
- [PDF](./examples/sample-output/) — print-ready, single-document via `codepliant pdf <doc>`
- [JSON](./examples/sample-output/) — machine-readable for integrations
- [Notion / Confluence / Wiki](./examples/sample-output/) — export to your team's docs platform
- [GitHub Pages](./examples/sample-output/) — static site with card-based navigation

---

## Tested against real projects

We scanned 1200+ open-source projects. Here are 10:

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

100% precision — when we detect something, it's real.

[See all scan results →](./examples/real-projects/)

---

## What happens when you run `codepliant go`

When you run `npx codepliant go`, here's exactly what happens under the hood:

### Step 1: Dependency Scanning (`src/scanner/dependencies.ts`)
Reads your `package.json` (or `requirements.txt`, `Gemfile`, `go.mod`, `Cargo.toml`, `composer.json`, etc.) and matches every dependency against 200+ known service signatures. Each signature maps a package name to its category (analytics, auth, payment, AI, monitoring) and the data it typically collects.

### Step 2: Source Code Import Scanning (`src/scanner/imports.ts`)
Walks your source files and detects `import` and `require()` statements. This catches services used in code but not listed as direct dependencies — like AI SDKs imported from a monorepo package or vendored libraries.

### Step 3: Environment Variable Scanning (`src/scanner/env.ts`)
Reads `.env`, `.env.local`, `.env.example`, and similar files. Matches variable names against known patterns (e.g., `STRIPE_SECRET_KEY`, `OPENAI_API_KEY`, `SENTRY_DSN`) to detect services configured via environment variables.

### Step 4: Schema & Model Scanning
- **Prisma** (`src/scanner/schema.ts`) — parses `schema.prisma` to find user data fields (email, phone, passwordHash)
- **Drizzle** (`src/scanner/drizzle-models.ts`) — detects data models in Drizzle ORM schemas
- **Django** (`src/scanner/django-models.ts`) — reads `models.py` for field definitions
- **SQLAlchemy** (`src/scanner/sqlalchemy-models.ts`) — parses Python ORM models
- **Mongoose** (`src/scanner/mongoose-models.ts`) — detects MongoDB schemas
- **TypeORM** (`src/scanner/typeorm-models.ts`) — reads TypeORM entity definitions
- **Go structs** (`src/scanner/go-structs.ts`) — parses Go struct tags for data fields

### Step 5: Infrastructure Scanning
- **Docker Compose** (`src/scanner/docker-compose-services.ts`) — detects databases, caches, message queues
- **Cloud providers** (`src/scanner/cloud-scanner.ts`) — AWS, GCP, Azure configurations
- **CI/CD** (`src/scanner/ci-cd-scanner.ts`) — GitHub Actions, GitLab CI, CircleCI
- **Database** (`src/scanner/database-scanner.ts`) — connection strings, database types

### Step 6: Specialized Scanners
- **API routes** (`src/scanner/api-routes.ts`) — detects data intake endpoints
- **File uploads** (`src/scanner/file-upload-scanner.ts`) — media/document upload handling
- **Payment** (`src/scanner/payment-scanner.ts`) — Stripe, PayPal, billing integrations
- **Secrets** (`src/scanner/secrets-scanner.ts`) — hardcoded credentials detection
- **License** (`src/scanner/license-scanner.ts`) — open source license compliance

### Step 7: Document Generation (`src/generator/index.ts`)
Based on scan results, generates 120+ documents — each personalized to your actual services. A project using Stripe, OpenAI, and Supabase gets documents that mention those services by name, list their specific data collection practices, and link to their DPA pages.

### Step 8: Output & Scoring
Writes all documents to `legal/` (or your configured output directory), computes a compliance score, and shows a generation summary with estimated lawyer-equivalent value.

**Total time: typically under 1 second.** Zero network calls — everything runs locally.

---

## Get started

```bash
# Generate compliance documents
npx codepliant go

# Interactive setup
npx codepliant init

# Just scan (no files generated)
npx codepliant scan

# Quick stats (one-line, scriptable)
npx codepliant count

# HTML compliance page for your website
npx codepliant go --format html

# Check if docs are up to date
npx codepliant check

# Compliance dashboard
npx codepliant dashboard

# See how complete your docs are
npx codepliant completeness

# Check what's new after upgrading
npx codepliant migrate

# View codepliant version history
npx codepliant changelog

# Generate compliance certificate for partners
npx codepliant certify

# v500 easter egg
npx codepliant celebrate

# Project info, mission, and credits
npx codepliant about
```

### Configuration

```json
{
  "companyName": "Your Company",
  "contactEmail": "privacy@company.com",
  "jurisdictions": ["gdpr", "ccpa", "uk-gdpr"],
  "dpoEmail": "dpo@company.com"
}
```

### CI/CD

```yaml
- uses: codepliant/codepliant@v500
  with:
    fail-on-missing: true
```

### MCP Server (Claude Code / Cursor)

```json
{ "mcpServers": { "codepliant": { "command": "npx", "args": ["codepliant-mcp"] } } }
```

---

## Built in one session

v500 — 430 versions built in a single session with Claude Code.

| Metric | Count |
|--------|-------|
| Versions built | 430 (v70 to v500) |
| Document types | 120+ |
| Tests | 792 (all passing) |
| Repos tested | 1200+ |
| CLI commands | 55+ |
| Scanners | 30+ |
| Output formats | 13+ |
| Languages | 4 (EN, DE, FR, ES) |
| Network calls | 0 |
| Runtime deps | 1 (MCP SDK) |

Every feature ships with tests. Every detection is deterministic. Zero network calls. Under one second.

---

## Links

- [Example Output](./examples/sample-output/) — 120+ generated documents
- [Real Project Scans](./examples/real-projects/) — 1200+ open-source projects
- [Contributing](./CONTRIBUTING.md)
- [Changelog](./CHANGELOG.md)

## License

MIT — free forever.

---

*Zero network calls. Your code never leaves your machine. [Verify it.](./src/scanner/no-network.test.ts)*
