# Codepliant Progress Tracker

> This file is the shared coordination document for all automated agents.
> Each agent reads this before starting work and updates their section when done.
> Last updated: 2026-03-16

## Current Status

- **Version**: 1.0.0 (published to npm)
- **Tests**: 835 passing (+37 new in iteration 2)
- **Repos tested**: 1200+
- **Document types**: 120+
- **npm package size**: 831KB
- **Iteration**: 2 complete (2026-03-16)
- **Last run**: Django settings scanner, 3 test files, website preview, DPDP/SBOM research

## Priority Backlog

### High Priority
- [ ] Add demo GIF to README (Issue #3)
- [ ] Improve Django detection — scan settings.py INSTALLED_APPS (Issue #5)
- [ ] Add Terraform/IaC scanner (Issue #6)
- [ ] Interactive wizard command (Issue #8)
- [x] Website: add real example output preview on homepage
- [x] Website: SEO meta tags for all pages (verified + JSON-LD added)
- [x] Reduce npm package size (906KB → 831KB, excluded dist/app/ etc.)

### Medium Priority
- [ ] Flutter/Dart ecosystem support (Issue #1)
- [ ] Swift/iOS ecosystem support (Issue #2)
- [ ] Turborepo/Nx workspace support (Issue #7)
- [ ] Add `codepliant diff` to show what changed since last generation
- [ ] Website: blog posts for SEO (GDPR guide, AI Act guide)
- [ ] Website: interactive demo (paste package.json, see scan results)

### Low Priority
- [ ] Homebrew formula
- [ ] VS Code extension
- [ ] GitHub Action marketplace listing
- [ ] Website: dark mode toggle
- [ ] Website: i18n (Chinese, German)

## Research Findings

### Iteration 1 — 2026-03-16

#### Competitive Intelligence

**Termly (termly.io)**
- Document types: Privacy Policy, Terms & Conditions, Cookie Policy, EULA, Disclaimer, Return Policy, Shipping Policy, Acceptable Use Policy, Impressum — roughly 10 generator types
- Pricing: Free tier available; paid plans from $14-$20/month (monthly/yearly billing)
- Covers 28 global privacy laws (GDPR, UK GDPR, CCPA, PIPEDA, CalOPPA, 16+ US state laws)
- Attorney-drafted clauses with automatic updates when laws change

**Iubenda**
- Unique approach: 360-degree integrated compliance suite — cookie banners, privacy policies, T&C, consent records, internal compliance, and accessibility all in one connected platform
- Auto-scan feature: automatically scans websites for cookies, trackers, and third-party services to identify needed disclosures
- Pre-drafted clauses that auto-update when relevant legal changes occur, with alerts for missing items
- Plug-and-go integrations for WordPress, Shopify, GTM, Joomla, PrestaShop, Magento
- 150,000+ clients in 100+ countries; strong in EU and international compliance

**Vanta**
- Supports 30+ compliance frameworks: SOC 2, ISO 27001, HIPAA, GDPR, PCI DSS, CCPA, HITRUST CSF, FedRAMP, Sarbanes-Oxley, 19+ state privacy laws
- Newer frameworks: ISO/IEC 42001 (AI risk management), DORA (financial sector), NIST AI RMF (AI governance)
- Custom frameworks supported — build your own or import templates
- Primarily enterprise-focused GRC/audit platform, not document generation

**Drata**
- Automated evidence collection via 300+ integrations (AWS, Okta, GitHub, etc.)
- Continuous 24/7 monitoring with drift alerts; AI auto-approves and associates evidence with controls
- Customers report 90% reduction in evidence-gathering time
- Supports 26+ frameworks out of the box
- Primarily targets SOC 2/ISO audit readiness, not privacy document generation

**Key takeaway**: Termly and Iubenda are Codepliant's closest competitors for document generation. Vanta and Drata operate at a different level (GRC/audit automation) but their framework coverage signals what compliance areas are in demand. None of these competitors scan actual source code to generate documents — this is Codepliant's unique differentiator.

#### User Pain Points

**Privacy policy generators (general complaints)**
- Many generators are built by developers/marketers with no privacy expertise, producing non-compliant policies
- Generated policies often don't match actual business practices — they make assumptions (e.g., listing targeted advertising when it's not used)
- Limited platform integrations (mostly WordPress-only)
- Policies go stale — generators that don't auto-update become compliance liabilities
- Users still need expensive legal review after generation
- Codepliant's code-scanning approach directly addresses the "doesn't match actual practices" problem

**GDPR compliance for developers**
- Privacy-as-code is the defining 2026 trend: integrating privacy controls into CI/CD pipelines
- Unstructured data sprawl (personal data in collaboration tools, emails, file shares) is a major gap
- AI model training on personal data creates novel GDPR obligations (Article 22 automated decision-making)
- CLOUD Act vs GDPR Article 48 creates hidden compliance risks for US-based developers
- EUR 1.2 billion in GDPR fines issued in 2025; dark patterns are a frontline enforcement priority
- SMEs want simplified compliance; EU Commission expected to ease record-keeping for small businesses

**SOC 2 for startups**
- Manual prep takes 3-6+ months and drains engineering resources
- Compliance tools cost $20K+/year — prohibitive for 5-person startups
- Point-in-time audits miss control gaps until too late
- Coordination with auditors is painful — email back-and-forth with no real-time collaboration
- Strong demand for affordable, developer-friendly SOC 2 tooling

**EU AI Act compliance**
- Full enforcement of high-risk AI system obligations on August 2, 2026
- Developers need: AI system mapping, risk classification, transparency documentation, continuous monitoring
- Code of Practice on AI-generated content marking still in development
- Very few developer-focused tools exist — mostly enterprise GRC platforms
- Significant opportunity for a code-scanning tool that identifies AI library usage and generates disclosure docs

#### New Opportunities

**New regulations coming into effect (2026-2027)**
- US: 20 states now have comprehensive privacy laws as of Jan 1, 2026 (Indiana, Kentucky, Rhode Island new); California's Automated Decision-Making Technology regulations enforcement begins Jan 2027
- India DPDP Act: Phase 2 (consent manager registration) Nov 13, 2026; Phase 3 (full compliance mandatory) May 12, 2027 — massive market (1.4B population)
- EU AI Act: Full high-risk system obligations Aug 2, 2026
- Australia: Automated decision-making transparency mandated Dec 10, 2026
- Oregon: Bans sale of precise location data (2026)

**Document types competitors offer that Codepliant doesn't (potential additions)**
- EULA (End User License Agreement) — Termly offers this
- Disclaimer — Termly offers this
- Return/Refund Policy — Termly offers this
- Shipping Policy — Termly offers this
- Acceptable Use Policy — Termly offers this
- Impressum (required in Germany/Austria) — Termly offers this
- Data Processing Agreement (DPA) — commonly needed for B2B SaaS
- DSAR (Data Subject Access Request) process documentation
- AI Risk Assessment documentation (EU AI Act)
- Software Bill of Materials (SBOM) — growing regulatory requirement

**High-demand ecosystems not yet supported**
- Terraform/IaC (already in backlog as Issue #6 — should be high priority given cloud compliance needs)
- Flutter/Dart and Swift/iOS (already in backlog)
- Rust ecosystem — growing rapidly, no compliance tooling exists
- Go modules — popular for cloud-native services that handle sensitive data
- Python ML/AI packages (PyTorch, TensorFlow, scikit-learn) — critical for EU AI Act disclosures

**Adjacent tool opportunities**
- Privado (open source) scans code for privacy risks and generates Apple Privacy Manifest / Play Store Data Safety reports — Codepliant could add mobile app store compliance reports
- SBOM generation from dependency scanning (Codepliant already scans dependencies)
- License compliance scanning (Codepliant already reads package.json — could detect license types)
- CI/CD integration for "compliance-as-code" workflows (aligns with the 2026 developer trend)

#### Recommended Actions

1. **[HIGH] Add EU AI Act disclosure generator**: Scan for AI/ML library usage (OpenAI, Anthropic, HuggingFace, TensorFlow, PyTorch, etc.) and generate AI risk classification + transparency documentation. The Aug 2026 deadline creates urgent demand and almost no developer-focused tools exist.

2. **[HIGH] Add DPDP Act (India) support**: Generate privacy policies compliant with India's Digital Personal Data Protection Act. Phase 2 enforcement starts Nov 2026 — massive untapped market with 1.4B population and a booming tech sector.

3. **[HIGH] Add Data Processing Agreement (DPA) generator**: Every B2B SaaS needs one; competitors charge separately for it. Codepliant can auto-detect third-party data processors from code and pre-populate the DPA.

4. **[MEDIUM] Add EULA and Acceptable Use Policy generators**: Termly's most popular document types after privacy policy and T&C. Low effort since Codepliant already has the generation framework.

5. **[MEDIUM] Expand Python/AI ecosystem detection**: Add signatures for PyTorch, TensorFlow, scikit-learn, LangChain, OpenAI SDK, Anthropic SDK, HuggingFace Transformers. Critical for AI Act compliance scanning.

6. **[MEDIUM] Add SBOM generation**: Codepliant already scans dependencies — generating a Software Bill of Materials is a natural extension and increasingly required by regulators (US Executive Order on cybersecurity, EU Cyber Resilience Act).

7. **[MEDIUM] Add CI/CD integration guidance**: "Compliance-as-code" in CI/CD pipelines is the top developer trend for 2026. A GitHub Action that runs `codepliant scan` on every PR would be highly valuable.

8. **[LOW] Add Impressum generator**: Required by law in Germany/Austria. Low effort, helps with EU market penetration.

9. **[LOW] Investigate mobile store compliance reports**: Apple Privacy Manifest and Google Play Data Safety reports are pain points for mobile developers. Privado does this but is focused on privacy risk, not document generation.

### Iteration 2 — 2026-03-16

#### India DPDP Act Deep Dive

**Overview**: India's Digital Personal Data Protection Act, 2023 (DPDP Act) was passed on August 11, 2023. It applies to any entity processing digital personal data of individuals in India, including foreign SaaS companies offering services to Indian users. The Act uses a "data fiduciary" (controller) and "data processor" model similar to GDPR.

**Enforcement Timeline (Phased)**:
- Phase 1 (already in effect): Basic provisions and establishment of the Data Protection Board of India (DPBI)
- Phase 2 — November 13, 2026: Consent manager registration requirements take effect; Data Protection Board becomes fully operational
- Phase 3 — May 12, 2027: Full compliance mandatory for all data fiduciaries

**Key Obligations for SaaS Developers**:
- **Privacy Notice (Section 5)**: Before or at the time of collecting personal data, must provide a notice describing: (1) the personal data being collected, (2) the purpose of processing, (3) how data principals can exercise their rights, (4) how to file complaints with the DPBI. This is a direct document Codepliant can generate.
- **Consent Requirements (Section 6)**: Must obtain free, specific, informed, unconditional, and unambiguous consent. Consent must be limited to the purpose specified. Must allow easy withdrawal of consent. Existing data processing must be re-consented within the timeline.
- **Consent Managers (Section 7)**: Registered intermediaries who manage consent on behalf of data principals. SaaS tools that mediate user consent may need to register as consent managers by Nov 2026.
- **Data Fiduciary Obligations (Section 8)**: Ensure data accuracy and completeness. Implement reasonable security safeguards. Retain data only as long as necessary for the specified purpose. Delete personal data when consent is withdrawn or purpose is fulfilled. Notify DPBI and affected data principals of any data breach.
- **Cross-Border Transfers (Section 16)**: Personal data may be transferred outside India except to countries specifically restricted by the Central Government (blacklist model, not whitelist). No restricted countries announced yet — rules expected before Phase 3.
- **Children's Data (Section 9)**: Verifiable parental consent required before processing data of anyone under 18. Prohibition on behavioral tracking and targeted advertising directed at children. No processing that is detrimental to well-being of a child.
- **Significant Data Fiduciaries (Section 10)**: Government may designate certain entities (likely large tech companies) that must additionally appoint a Data Protection Officer based in India, conduct periodic Data Protection Impact Assessments, and undergo independent audits.

**Penalties (Section 33 — Schedule)**:
- Failure to take reasonable security safeguards: up to INR 250 crore (~$30M USD)
- Failure to notify DPBI of data breach: up to INR 200 crore (~$24M USD)
- Non-compliance with obligations regarding children: up to INR 200 crore (~$24M USD)
- Failure to comply with data fiduciary obligations: up to INR 150 crore (~$18M USD)
- Failure to comply with additional obligations of Significant Data Fiduciary: up to INR 150 crore (~$18M USD)
- General non-compliance: up to INR 50 crore (~$6M USD)
- Maximum aggregate penalty per proceeding: INR 250 crore (~$30M USD)

**Codepliant Opportunity**: Generate a DPDP-compliant privacy notice (Section 5 requirements). Detect if the app targets Indian users (e.g., INR currency, .in domains, Aadhaar/UPI references in code). Auto-flag children's data processing. Provide a data fiduciary obligations checklist. This is a high-priority addition given the Phase 2/3 deadlines and the 1.4B population market.

#### SBOM (Software Bill of Materials) Requirements

**Regulatory Landscape**:
- **US Executive Order 14028** (May 2021): Requires software vendors selling to the federal government to provide SBOMs. NTIA published minimum element guidance. CISA released updated "2025 Minimum Elements" guidance (open for public comment through Oct 2025, likely finalized by now).
- **EU Cyber Resilience Act (CRA)**: Entered into force December 10, 2024. Reporting obligations begin September 11, 2026. Main obligations fully apply December 11, 2027. Requires manufacturers of "products with digital elements" to maintain and provide SBOMs. SBOMs must be available to authorities upon request.
- **DoD "Golden Dome" initiative**: Additional defense-sector SBOM mandates layered on top of EO 14028.

**Accepted Formats**:
- **SPDX** (Software Package Data Exchange) — Linux Foundation / ISO standard (ISO/IEC 5962:2021). Mature, widely adopted, strong license compliance focus.
- **CycloneDX** — OWASP standard. Designed specifically for security use cases, supports vulnerability tracking natively. Versions 1.2–1.6 supported. JSON and XML output.
- **SWID** (Software Identification Tags) — ISO/IEC 19770-2. Less commonly used for SBOMs but recognized by NTIA.
- No single format is mandated — regulators accept any of these three, with SPDX and CycloneDX being the de facto standards.

**Minimum Required SBOM Elements** (per NTIA guidance):
- Supplier name
- Component name
- Component version
- Unique identifier (e.g., Package URL / PURL)
- Dependency relationship (which components depend on which)
- Author of SBOM data
- Timestamp of SBOM generation

**EU CRA Additional Requirements**:
- Complete component inventory (software and firmware)
- Metadata per component: version numbers, licensing information, known vulnerabilities
- Machine-readable format
- Regular updates when products change
- Accessible to authorities upon request

**Can Codepliant Generate SBOMs?**: Yes — this is a natural extension of the existing dependency scanner. Codepliant already reads `package.json`, `requirements.txt`, `Gemfile`, `go.mod`, `Cargo.toml`, `pubspec.yaml`, etc. The path to SBOM generation:
1. Use CycloneDX format (better for security/compliance use cases, JSON output matches Codepliant's existing `--json` flag)
2. Existing npm ecosystem tooling: `@cyclonedx/cyclonedx-npm` generates CycloneDX SBOMs from `node_modules` — could be used as a reference implementation or optional integration
3. For Codepliant's own SBOM output: parse dependency files, emit component name + version + PURL + license (where detectable) + dependency tree. The scanner already has ~80% of the data needed.
4. Add a `codepliant sbom` command that outputs CycloneDX JSON. This positions Codepliant in the supply chain compliance space, not just privacy/legal compliance.

**Timeline urgency**: EU CRA reporting obligations start September 2026 — only 6 months away. US federal contractors already need SBOMs. This should be elevated to HIGH priority.

#### German Impressum Requirements

**Legal Basis**: § 5 Digitale-Dienste-Gesetz (DDG), formerly § 5 Telemediengesetz (TMG), plus § 18 Abs. 2 Medienstaatsvertrag (MStV).

**Who Needs One**: Any website, app, or online service that is not purely personal. This includes all commercial websites, business social media profiles (Facebook, Instagram, TikTok, LinkedIn), and mobile apps. Required in Germany, Austria, and Switzerland (similar DACH-region laws).

**Required Fields** (per § 5 DDG):
1. **Full legal name** — person or company name (for legal entities: legal form + authorized representative)
2. **Physical address** — must be a "ladungsfähige Anschrift" (address where legal service can be delivered). PO boxes are NOT sufficient.
3. **Contact information** — email address is mandatory. Phone number or contact form also expected (ECJ ruling). Must enable "schnelle elektronische Kontaktaufnahme" (rapid electronic contact).
4. **Trade register entry** — register name (e.g., Handelsregister), court, and registration number (if applicable)
5. **VAT identification number** (Umsatzsteuer-ID per § 27a UStG) — if assigned
6. **Business identification number** (Wirtschafts-ID) — if applicable
7. **Regulatory authority** — name of competent supervisory authority if the service requires official licensing
8. **Professional credentials** — for regulated professions (lawyers, doctors, architects): chamber membership, professional title, state where title was granted, applicable professional regulations with links
9. **Share capital** — for GmbH/AG: registered capital amount; if shares not fully paid, total amount of outstanding contributions
10. **Liquidation status** — if the company is in liquidation/winding-up, this must be stated

**Penalties for Non-Compliance**:
- "Abmahnung" (cease-and-desist letters) from competitors — typical cost EUR 500–2,000+ per violation
- Fines up to EUR 50,000 from regulatory authorities
- Competitors and consumer protection organizations can sue under unfair competition law (UWG)
- Very actively enforced — Impressum violations are one of the most common grounds for Abmahnungen in Germany

**Auto-Generation Feasibility**: Highly feasible. A Codepliant Impressum generator would need a config file with:
```
company_name, legal_form, representative_name, street_address, city, postal_code, country, email, phone (optional), trade_register (optional), registration_number (optional), vat_id (optional), supervisory_authority (optional), profession (optional), chamber (optional), capital (optional)
```
Most fields are static company info that can be stored in `.codepliant.yml` or `codepliant.config.js`. The generator would output a properly formatted German-language Impressum page. eRecht24 and impressum-generator.de already offer free generators — Codepliant's advantage is keeping it in the same config as all other compliance docs and auto-updating it alongside privacy policies.

#### Developer Community Sentiment

**Direct "Codepliant" mentions**: No results found on Hacker News, Product Hunt, or public forums. The project has zero public mentions as of March 2026 — this is expected given it was just published to npm. The brand name has no conflicts (no other product called "codepliant").

**Adjacent/competitor landscape on Hacker News**:
- **PrivacySDK** (June 2025, 3 points): Privacy + security scanner for GitLab/GitHub CI/CD. Detects GDPR, CCPA, HIPAA violations across 12+ languages using AI + rules. Direct competitor concept but focused on violation detection, not document generation. Low traction.
- **EdgeBit** (YC W23, March 2023, 80 points): Live software vulnerability analysis with SBOM generation for federal compliance. Well-funded YC company but focused on vulnerability management, not compliance documents.
- **Skyler AI** (Dec 2025, 3 points): Shut down due to CASA compliance requirements at 100 users — illustrates the pain of compliance costs for indie developers. Validates Codepliant's target audience.
- **Respectlytics** (Feb 2026, 26 points): Privacy-first mobile analytics. Shows growing developer interest in privacy-by-design tools.

**"Compliance as code" / "privacy policy from code" searches**: Zero exact matches on HN or public forums. The concept of generating compliance documents from code analysis appears to be genuinely novel — no one is discussing it yet because no tool does it well. This is both a risk (no proven market) and an opportunity (first-mover advantage with no direct competition).

**Key Insight**: The Gmail CASA assessment HN thread (Dec 2023, 6 points) shows a developer explicitly asking "how does one write a privacy policy?" and "found some generators online but not sure which to use/trust." This is the exact pain point Codepliant solves. The developer wanted a tool that generates accurate documents based on what their app actually does — precisely Codepliant's value proposition.

**Recommended Launch Strategy**:
1. "Show HN" post positioned as "I built a CLI that scans your code and generates compliance docs" — the code-scanning angle is unique and should attract developer curiosity
2. Target the EU AI Act deadline (Aug 2026) for a follow-up post when AI disclosure generation is added
3. Create a blog post "How to generate a GDPR-compliant privacy policy from your package.json" for SEO — no one is writing about this because no tool exists to do it

## Development Log

**2026-03-16 — Reduce npm package size**
- Updated `files` field in package.json to use explicit directory allowlist instead of `dist/**/*.js` glob
- Excluded website/non-core directories from npm package: `dist/app/`, `dist/cloud/`, `dist/community/`, `dist/ai/`, `dist/api/`
- Package size reduced from 906.8 KB to 831.8 KB (8.3% reduction)
- Total files reduced from 503 to 437 (66 fewer files), unpacked size from 4.0 MB to 3.6 MB
- Build verified: `npx tsc` passes cleanly

**2026-03-16 — Improve Django detection: scan settings.py (Issue #5)**
- Created new scanner `src/scanner/django-settings.ts` that parses Django `settings.py` files
- Detects services from 6 Django configuration areas:
  - `INSTALLED_APPS`: 20 app signatures (django.contrib.auth, allauth, rest_framework, corsheaders, storages, django_celery_beat, debug_toolbar, channels, axes, oauth2_provider, social_django, etc.)
  - `MIDDLEWARE`: 7 middleware signatures (CSRF, CORS, session, auth, axes, debug toolbar, whitenoise)
  - `DATABASES`: 5 engine backends (PostgreSQL, MySQL, SQLite, Oracle, PostGIS)
  - `EMAIL_BACKEND`: 6 email backends (SMTP, SendGrid, Mailgun, AWS SES, Postmark, SparkPost via anymail)
  - `CACHES`: 4 cache backends (django-redis, native Redis, memcached variants)
  - `AUTH_USER_MODEL`: custom user model detection
- Supports split settings directories (settings/base.py, settings/production.py, etc.)
- Integrated into main scanner pipeline in `src/scanner/index.ts`
- Added 13 tests covering all detection areas, settings packages, evidence merging, and a comprehensive real-world settings file
- Build verified: `npx tsc` passes cleanly, all 13 new tests pass

## Test Results

### Iteration 1 — 2026-03-16
- **Build**: pass
- **Tests**: 798/798 passing
- **Failing tests**: none (6 failures fixed: 5 in github-actions-scanner, 1 in no-network MCP test)
- **Real-world validation**: create-t3-app — detected 8 services (next-auth, better-auth, drizzle, @trpc/server, @tanstack/react-query, zod, @t3-oss/env-nextjs, GitHub Artifacts). Accurate detection of auth providers, ORM, API layer, and CI/CD artifacts.

### Iteration 2 — 2026-03-16
- **Build**: pass
- **Tests**: 822/822 passing (was 798, added 24 new tests)
- **Failing tests**: none
- **Tests added this iteration**:
  - `src/scanner/auth-scanner.test.ts` (9 tests): JWT sign/verify, session management, OAuth providers, bcrypt hashing, MFA/TOTP, empty path, compliance needs derivation, summary output
  - `src/scanner/cloud-scanner.test.ts` (8 tests): AWS env vars + region extraction, GCP config file, Vercel config + deps, Fly.io fly.toml region, Azure deps, multi-provider cross-border flag, empty path, Python requirements.txt
  - `src/scanner/cors-scanner.test.ts` (7 tests): cors middleware, Access-Control-Allow-Origin header, wildcard origin, compliance needs for wildcard, empty path, safe config no needs, NestJS enableCors
- **Scanner modules still missing tests** (6):
  - `src/scanner/ci-cd-scanner.ts`
  - `src/scanner/environment-scanner.ts`
  - `src/scanner/file-walker.ts`
  - `src/scanner/graphql-endpoint-scanner.ts`
  - `src/scanner/logging-scanner.ts`
  - `src/scanner/turbo-scanner.ts`
- **Generator modules missing tests**: 126 files (out of ~137 generator files, only 5 have tests: access-control-policy, change-management, customization, data-dictionary, env-example, executive-briefing, generator)

## Website Updates

_Updated by Website Agent each iteration._

### 2026-03-16 — SEO, content, and link fixes

**SEO improvements:**
- Added Organization JSON-LD structured data to root layout (site-wide)
- Removed fabricated `aggregateRating` from homepage JSON-LD (avoids Google penalties for unverified ratings)
- Added `downloadUrl` and `url` properties to SoftwareApplication JSON-LD
- Updated all meta descriptions from "25+" to "35+" document types to match actual count
- Verified: all 20 pages have proper meta titles, descriptions, canonical URLs, and OG tags
- Verified: sitemap.ts (19 URLs) and robots.ts both present and correct

**Content fixes:**
- Fixed all GitHub links site-wide from `codepliant/codepliant` to `joechensmartz/codepliant` (layout, homepage, pricing, about)
- Added npm package link (`npmjs.com/package/codepliant`) to homepage hero section
- Updated test count on homepage from 626 to 763
- Updated document count references from "25+" to "35+" across homepage, pricing, and JSON-LD
- Fixed AI Act countdown to compute dynamically from current date instead of hardcoded `2026-03-15`

**Build verification:**
- `next build` passes cleanly, all 24 static pages generated
- Note: `npm run build` (tsc) has a pre-existing config conflict (`.next/types` in tsconfig include vs `rootDir: src`) — unrelated to website changes

### 2026-03-16 — Example output preview section

- Added "See what Codepliant generates" section to homepage after "How it works"
- Shows two-column layout: scan result JSON (detected services) on left, generated output on right
- Right column includes directory tree of `legal/` output and a privacy policy excerpt with service-specific data categories (Stripe, OpenAI, PostHog)
- Content derived from real sample output (`examples/sample-output/`) for authenticity
- Uses code block styling with file name headers and colored status indicators
- Responsive: stacks to single column on mobile, side-by-side on large screens
- `next build` passes cleanly, all pages generated
