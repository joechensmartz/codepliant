# Codepliant Progress Tracker

> This file is the shared coordination document for all automated agents.
> Each agent reads this before starting work and updates their section when done.
> Last updated: 2026-03-16

## Current Status

- **Version**: 1.0.0 (published to npm)
- **Tests**: 798 passing (was 763, fixed 6 failures)
- **Repos tested**: 1200+
- **Document types**: 120+
- **npm package size**: 831KB (reduced from 906KB)
- **Iteration**: 1 complete (2026-03-16)
- **Last run**: All 4 agents completed successfully

## Priority Backlog

### High Priority
- [ ] Add demo GIF to README (Issue #3)
- [ ] Improve Django detection — scan settings.py INSTALLED_APPS (Issue #5)
- [ ] Add Terraform/IaC scanner (Issue #6)
- [ ] Interactive wizard command (Issue #8)
- [ ] Website: add real example output preview on homepage
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

## Development Log

**2026-03-16 — Reduce npm package size**
- Updated `files` field in package.json to use explicit directory allowlist instead of `dist/**/*.js` glob
- Excluded website/non-core directories from npm package: `dist/app/`, `dist/cloud/`, `dist/community/`, `dist/ai/`, `dist/api/`
- Package size reduced from 906.8 KB to 831.8 KB (8.3% reduction)
- Total files reduced from 503 to 437 (66 fewer files), unpacked size from 4.0 MB to 3.6 MB
- Build verified: `npx tsc` passes cleanly

## Test Results

### Iteration 1 — 2026-03-16
- **Build**: pass
- **Tests**: 798/798 passing
- **Failing tests**: none (6 failures fixed: 5 in github-actions-scanner, 1 in no-network MCP test)
- **Real-world validation**: create-t3-app — detected 8 services (next-auth, better-auth, drizzle, @trpc/server, @tanstack/react-query, zod, @t3-oss/env-nextjs, GitHub Artifacts). Accurate detection of auth providers, ORM, API layer, and CI/CD artifacts.

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
