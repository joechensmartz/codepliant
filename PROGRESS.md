# Codepliant Progress Tracker

> This file is the shared coordination document for all automated agents.
> Each agent reads this before starting work and updates their section when done.
> Last updated: 2026-03-16

## Current Status

- **Version**: 1.0.0 (published to npm)
- **Tests**: 1452 passing — **100% scanner test coverage**
- **Repos tested**: 1200+
- **Document types**: 121+
- **Ecosystems**: 11
- **npm package size**: 831KB (puppeteer now optional, saves 300MB on install)
- **Iteration**: 8 complete (2026-03-17)
- **Last run**: puppeteer→optional, 100% scanner coverage, changelog/about pages, Show HN draft, cross-page consistency fixes

## Priority Backlog

### High Priority
- [ ] Add demo GIF to README (Issue #3)
- [x] Improve Django detection — scan settings.py INSTALLED_APPS (Issue #5) — done in iteration 2
- [x] Add Terraform/IaC scanner (Issue #6) — done in iteration 3
- [x] Interactive wizard command (Issue #8) — done in iteration 4
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

### Iteration 3 — 2026-03-16

#### Launch Strategy: What Works on Product Hunt, Hacker News, and Reddit

**Hacker News (Show HN)**

- *Audience*: 80-90% developers. Conversion rate for dev tools: 1.5-2.5% of visitors become qualified users — significantly higher than Product Hunt (0.5-1.0%).
- *Best title format*: "Show HN: [Product Name] — [What it does, technically specific]". Specific, technical titles outperform vague ones. Example: "Show HN: Layerform — Open-source development environments using Terraform files" beats "Show HN: Layerform — A staging environment for each engineer." For Codepliant, a strong title would be: "Show HN: Codepliant — Open-source CLI that scans your code and generates compliance docs".
- *Best time to post*: Two competing strategies. (1) Weekday mornings (8-10 AM EST, Tuesday-Wednesday) for maximum traffic volume. (2) Weekend/low-traffic times (Sunday 6 AM UTC) for 2.5x higher chance of reaching front page due to less competition. Given Codepliant is a niche dev tool, the weekend strategy is likely better — less competition, and the Show HN tab gives extra longevity.
- *Show HN advantage*: Show HN posts appear on the dedicated /show page even if they fall off the /new page, giving them a second chance to gather votes and hit the front page hours later.
- *Critical success factor*: Founders who actively respond to every comment get significantly more upvotes. HN users want to see code, architecture, and implementation details — not marketing. Be ready to discuss how the scanner works, what AST/regex approach is used, and why it is deterministic.

**Product Hunt**

- *Best day*: Tuesday, Wednesday, or Thursday for highest traffic. However, these days also have the most competition (OpenAI, Google tend to launch mid-week). For a developer CLI tool without a massive following, Tuesday is the sweet spot — high traffic but slightly less competition than Wednesday.
- *Best time*: Launch at 12:01 AM PST to maximize the full-day voting window. Launching even a few hours late puts you at a significant disadvantage.
- *Pre-launch is everything*: Products that win on Product Hunt are not necessarily the best — they are the ones whose founders spent months engaging with the PH community before launching. Build relationships with hunters, comment on other launches, and collect an email list of early supporters.
- *Developer tools caveat*: PH audience is mostly marketers who do not code. Conversion quality is lower than HN. PH is better for brand awareness and backlinks than for acquiring core users.
- *Badge on README*: After launching, add a Product Hunt badge to the GitHub README. A case study of 7 popular repos showed this drives ongoing traffic from GitHub to PH and vice versa.

**Reddit**

- *Key subreddits*: r/webdev (3.1M members, "Showoff Saturday" only for self-promotion), r/javascript (2.1M members), r/SaaS, r/sideproject, r/selfhosted, r/opensource.
- *Golden rule*: Lead with value, not with your product. Posts that feel like "war stories, lessons learned, or helpful breakdowns that happen to mention a tool" perform best. Posts that feel like ads get removed or downvoted.
- *Pre-launch karma*: Make 20-30 genuine contributions (answering questions, giving useful answers) across target subreddits before posting about your project. This builds post history that makes your launch post credible.
- *Effective post titles*: "I built an open-source CLI that scans your codebase and generates GDPR-compliant privacy policies" (specific, open-source, solves a clear problem). Avoid: "Check out my new tool!" (vague, promotional).

**Case Studies of Successful OSS Launches**

- *Wasp (wasp-lang)*: Reached 6,000 stars in 6 months. Strategy: Product Hunt launch (#7 of the day), Reddit posts in r/webdev on Showoff Saturday, Show HN (20 points first launch), and direct outreach to developers they had previously interviewed. Key lesson: "putting significant effort into marketing was key — despite not having a large social media presence or prior marketing experience."
- *AFFiNE*: 0 to 10,000 stars in 43 days — fastest growth in GitHub history at that time. Now at 40k+ stars. Achieved Product Hunt #1 thirty times. Featured on GitHub Trending 28 times in 2022. Strategy: aggressive multi-platform launches, community building, and compounding momentum. Their former COO distilled the playbook into open-source guides.
- *Maybe Finance*: Spent ~$1M building a personal finance app, then open-sourced the entire codebase. The "open-sourcing a failed startup" narrative drove massive GitHub traction. Lesson for Codepliant: the "transparency story" resonates — sharing the journey (costs, failures, decisions) attracts developer empathy and stars.

#### GitHub SEO and Discovery

**Repository Optimization**

- *Repo name*: Include a primary keyword. "codepliant" is brandable but not keyword-rich. Consider the description/tagline to compensate: "Scan your code, generate compliance docs — Privacy Policy, Terms of Service, AI Disclosure, and 120+ more."
- *About section*: Must start with the main keyword. Keep it 5-15 words. Current opportunity: "Open-source CLI that generates compliance documents from code analysis."
- *Topics/tags*: Add all relevant GitHub topics for discoverability. Recommended: `compliance`, `privacy-policy`, `gdpr`, `ccpa`, `terms-of-service`, `ai-disclosure`, `eu-ai-act`, `cli`, `developer-tools`, `open-source`, `code-scanner`, `sbom`, `privacy`, `security`, `legal-tech`.
- *README as landing page*: "If your README looks like a dump of technical documentation, you will lose 90% of potential traffic." The README needs: a clear one-liner, a demo GIF (Issue #3 — this is critical), feature highlights, quick-start command, and social proof (test count, repo count).

**How Repos Trend on GitHub**

- GitHub Trending is driven by velocity of stars within a short window (typically 24-48 hours), not total star count. A burst of 50-100 stars in a day from a successful HN/PH launch can land you on Trending.
- AFFiNE appeared on GitHub Trending 28 times — each appearance drove more stars, creating a compounding loop.
- Project activity matters: repos that have not been updated recently get penalized by both GitHub search and Google. Regular commits, releases, and issue responses signal an active project.
- GitHub Pages for documentation sites get indexed by Google. Codepliant's website (if hosted on GitHub Pages or linked from the repo) can rank for competitive keywords.

**Growth Phases** (from battle-tested playbooks):

1. *0-100 stars*: Focus on product quality and documentation. README must be exceptional.
2. *100-1,000 stars*: Build community and contribution processes. Respond to every issue. Hacktoberfest participation drives PRs (Wasp hit all-time high PR count during Hacktoberfest).
3. *1,000-5,000 stars*: Strategic content creation — blog posts, DEV Community articles, comparison posts. Present the tool directly, present it indirectly as part of larger tutorials, and create listicles with open-source angles.
4. *5,000-10,000 stars*: Enterprise adoption stories and case studies. Integration guides for popular frameworks.

**Distribution Platforms** (in order of developer ROI):

1. Hacker News (Show HN)
2. Reddit (r/webdev, r/javascript, r/SaaS, r/sideproject)
3. DEV Community (dev.to) — long-form technical posts, very developer-friendly
4. Product Hunt — for brand awareness and backlinks
5. Twitter/X — build a following by sharing compliance tips, not just product updates
6. Indie Hackers — share the journey, not just the product

#### Content Marketing for Developer Tools

**High-Value Blog Post Topics** (ranked by organic search opportunity):

1. **"How to generate a GDPR-compliant privacy policy from your code"** — Zero competition for this exact topic. No tool does this, so no one writes about it. Codepliant can own this keyword entirely. This should be the first blog post.

2. **"GDPR cookie consent implementation guide for developers"** — High search volume. Existing content from Auditzo, CookieYes, Cookiebot, and others, but most target marketers, not developers. A developer-focused guide with code examples (React, Next.js, Express) can rank by targeting long-tail keywords like "GDPR cookie consent React" or "implement cookie consent Next.js."

3. **"EU AI Act compliance checklist for developers (2026)"** — Growing search volume as the August 2026 deadline approaches. Currently dominated by enterprise GRC platforms (Vanta, PwC, Dataiku) and EU official tools. A developer-focused, code-level guide would have minimal competition. Tie it to Codepliant's AI disclosure generator.

4. **"Privacy policy generator comparison (2026)"** — The search results show intense competition from Termly, PrivacyPolicies.com, FreePrivacyPolicy.com, TermsFeed, Enzuzo, WebsitePolicies, and others. However, none of them scan code. A comparison post positioning Codepliant as "the only generator that reads your actual code" would differentiate sharply.

5. **"Software Bill of Materials (SBOM) guide for developers"** — Regulatory deadlines (EU CRA reporting Sep 2026, US federal requirements) are creating search demand. Most existing content targets enterprise compliance teams. A practical "how to generate an SBOM from your package.json" guide would attract developers.

6. **"India DPDP Act compliance for SaaS developers"** — Very low competition currently. Phase 2 (Nov 2026) and Phase 3 (May 2027) deadlines will drive search volume. Being early with authoritative content can capture rankings before competition arrives.

**SEO Strategy for 2026**

- *Generative Engine Optimization (GEO)*: In 2026, content must be optimized not just for Google but for AI-generated answers (ChatGPT, Google AI Overviews, Perplexity). Content that is structured, authoritative, and citable gets recommended by AI systems. Use clear headings, definitive statements, and structured data.
- *Privacy-first analytics*: 72% of global marketers have rebuilt strategies around privacy-first data models by 2026. Content about privacy-first approaches resonates strongly with the developer audience.
- *Long-tail keywords*: Instead of competing for "privacy policy generator" (dominated by funded competitors), target "privacy policy generator from code", "generate privacy policy from package.json", "open source compliance document generator", "CLI privacy policy generator."
- *Technical depth wins*: For developer audiences, posts with code examples, architecture diagrams, and implementation details outperform surface-level guides. "How Codepliant detects 200+ services from your dependency tree" would attract developer curiosity.

**Content Calendar Recommendation**:

| Priority | Topic | Target Keyword | Competition |
|----------|-------|----------------|-------------|
| 1 | GDPR privacy policy from code analysis | "generate privacy policy from code" | None |
| 2 | EU AI Act developer compliance guide | "EU AI Act compliance developers 2026" | Low |
| 3 | SBOM generation from package.json | "generate SBOM npm" | Low-Medium |
| 4 | India DPDP Act SaaS compliance | "India DPDP Act compliance SaaS" | Very Low |
| 5 | Cookie consent implementation (React/Next.js) | "GDPR cookie consent React" | Medium |
| 6 | Privacy policy generator comparison | "best privacy policy generator 2026" | High |

#### Recommended Actions from Iteration 3

1. **[HIGH] Create demo GIF immediately** (Issue #3): Every growth playbook emphasizes that the README is the primary landing page. A demo GIF showing `codepliant scan` detecting services and generating documents is the single highest-ROI action for GitHub discovery. Without it, 90% of visitors bounce.

2. **[HIGH] Coordinate a multi-platform launch day**: Launch on Show HN (Sunday morning UTC for less competition) + Reddit r/webdev Showoff Saturday + Product Hunt (Tuesday 12:01 AM PST) within the same week. Stagger the launches to compound momentum and maximize chance of hitting GitHub Trending.

3. **[HIGH] Publish first blog post before launch**: "How to generate a GDPR-compliant privacy policy from your code" — zero competition, establishes authority, and gives the HN/Reddit posts something to link to for credibility.

4. **[HIGH] Optimize GitHub repo metadata**: Add 15+ relevant topics/tags. Rewrite the About section to lead with keywords. Ensure README has: one-liner, demo GIF, quick-start command, feature count (120+ docs, 835 tests, 1200+ repos tested), and badges.

5. **[MEDIUM] Build 20-30 Reddit karma contributions**: Before the launch week, spend 2-3 weeks answering questions in r/webdev, r/javascript, and r/SaaS about GDPR, privacy policies, and compliance. This builds credibility and makes the launch post less likely to be flagged as spam.

6. **[MEDIUM] Write a DEV Community article**: "From 0 to 120+ compliance documents: How I built Codepliant" — the builder journey format performs well on dev.to and drives sustained traffic.

7. **[MEDIUM] Target Hacktoberfest (October 2026)**: Create "good first issue" labels, a CONTRIBUTING.md, and beginner-friendly issues. Wasp hit their all-time high PR count during Hacktoberfest. This is 7 months away — time to prepare.

8. **[LOW] Prepare EU AI Act content for August 2026**: As the deadline approaches, search volume for "EU AI Act compliance" will spike. Having content ready to publish in July 2026 positions Codepliant to capture that traffic.

### Iteration 4 — 2026-03-16

#### How Successful Open-Source CLI Tools Monetize

**Sponsorship Model (ESLint, Prettier, Biome)**

- **ESLint** earned $204,452 in 2025 across Open Collective, GitHub Sponsors, Tidelift, and website ads. Top corporate sponsors: Automattic ($24K), Airbnb ($24K), Meta ($20K), AG Grid ($20K). Sponsorship tiers range from $200/mo (Bronze) to $5,000/mo (Diamond). This funds a small team of dedicated maintainers and freelancers. ESLint is one of the most successful sponsorship-funded projects, yet $204K/year barely supports 2-3 full-time engineers in a high-cost-of-living area.
- **Prettier** uses Open Collective and GitHub Sponsors but earns significantly less than ESLint (estimated $20-50K/year based on comparable projects with similar star counts). Prettier has no paid product — it is purely donation-funded.
- **Biome** (the Rome fork) adopted sponsorship + enterprise support after Rome Tools Inc. burned through $4.5M in VC and laid off all employees. Biome offers corporate sponsorship for visibility and paid enterprise support where core contributors work on company-specific projects. This is a cautionary tale: VC funding for a dev tool with no clear revenue path led to shutdown.
- **Takeaway for solo devs**: Sponsorship alone is not a viable monetization path for a single-developer project. ESLint is a top-10 npm package used by millions and still only generates $204K/year. A niche compliance tool would be lucky to see $5-10K/year in sponsorship. Sponsorship should be a supplement, not the primary revenue source.

**Paid Product / Open Core Model (Tailwind CSS, Snyk)**

- **Tailwind CSS** generated $2M+ in revenue through Tailwind UI (premium component library at $299 one-time) and Tailwind Plus (500+ component templates as lifetime licenses). The model: free framework drives massive doc traffic, docs funnel users to paid products. However, in January 2026, Tailwind laid off 75% of engineering (from 20 to 5 people) after AI tools caused a ~40% drop in documentation traffic and ~80% revenue decline. AI chatbots now generate Tailwind code directly, bypassing the docs-to-purchase funnel. This is a critical warning for any monetization strategy that depends on documentation traffic.
- **Snyk** uses an open-core model: Free tier (individual devs, limited scans), Team ($25/dev/month), Enterprise (custom pricing). The free tier is generous enough to hook individual developers; the paid tier targets teams needing CI/CD integration, higher scan limits, and compliance reporting. Snyk charges per "contributing developer" (anyone who committed to a private repo in 90 days), not per scan or per app. This scales naturally with team size.
- **Takeaway**: The open-core model (free CLI, paid cloud/team features) is the most proven path for developer tools. The key is making the free tier genuinely useful while offering clear team/enterprise value in paid tiers. Avoid dependence on documentation traffic as a funnel — AI is eroding that channel.

**Acquisition Path (Turborepo)**

- **Turborepo** was acquired by Vercel in December 2021 before raising any external funding. Vercel open-sourced the CLI (MPL 2.0) and monetized through remote caching as a Vercel platform feature — converting free CLI users into paying Vercel customers. Turborepo's founder joined Vercel full-time.
- **Takeaway**: Acquisition is a viable exit but not a monetization strategy you can plan around. It requires building a tool that is strategically valuable to a larger platform company. For Codepliant, potential acquirers could include: GitHub (compliance-as-code in Actions), Vercel/Netlify (compliance for deployed apps), Vanta/Drata (code-level scanning to complement their GRC platforms), or Snyk (expanding from security to compliance).

#### The Compliance Tool Pricing Landscape and Gap Analysis

**Enterprise Tier ($7,500-$100K+/year) — Vanta, Drata, Sprinto**

- **Vanta**: Core plan starts at $10,000/year (single framework). Plus tier $15,000-$30,000/year. Growth $30,000+. Scale up to $80,000/year. Add-ons: Trust Center ($6,000/year), Vendor Risk Management ($11,200/year). Pricing is not public — requires a sales call. Primarily GRC/audit automation with 300+ integrations, not document generation.
- **Drata**: Foundation plan starts at $7,500/year. Advanced $15,000-$25,000/year. Enterprise $50,000-$100,000+. Customers report 85% reduction in prep time and 150-200 hours saved annually. Also requires sales call for pricing.
- **Sprinto**: Positioned as the affordable middle ground for startups and SMBs. Strong automation without rigid enterprise pricing. Exact pricing not public but reportedly lower than Vanta/Drata.
- **Who they serve**: Series A+ startups and mid-market companies pursuing SOC 2, ISO 27001, HIPAA certifications. These are audit-readiness platforms, not document generators.

**SMB Tier ($10-$20/month) — Termly, Iubenda**

- **Termly**: Free tier available. Starter $14/month ($10/month annual) — 2 policy generators + CMP with 50K banner views. Pro+ $20/month ($15/month annual) — all policy generators + unlimited CMP. Agency plan custom pricing. These are web-based form wizards, not code-aware.
- **Iubenda**: Similar pricing range, broader integration ecosystem (WordPress, Shopify, GTM). 150K+ clients.
- **Who they serve**: Small business owners, marketers, non-technical users who need a cookie banner and privacy policy for a website.

**The Gap Codepliant Can Fill ($0-$49/month)**

There is a clear pricing gap between:
1. Free/cheap policy generators (Termly at $10-20/mo) that use form wizards and don't understand your code
2. Enterprise compliance platforms (Vanta at $10K+/yr) that are overkill for small teams and don't generate documents from code

Codepliant occupies a unique position: **developer-focused, code-aware compliance document generation**. No existing tool does this. The target customer is:
- Indie developers and small startups (1-10 engineers) who need compliance docs but can't afford $10K/year for Vanta
- Developers who want documents that accurately reflect their actual tech stack, not generic templates
- Teams that want compliance-as-code in their CI/CD pipeline

Enterprise developers are 3.5x more likely to pay for developer tools than independent developers (SlashData research). The buyer persona matters: if the buyer is an individual developer, pricing must be under $50/month. If the buyer is a team lead or engineering manager, pricing can be $100-500/month.

#### Recommended Monetization Model for Codepliant

**Tier Structure**

| Tier | Price | Target | Features |
|------|-------|--------|----------|
| **Free (CLI)** | $0 | Indie devs, OSS projects | Full CLI scanning + document generation. All 120+ document types. Local-only, no account needed. MIT licensed. |
| **Pro** | $19/month or $149/year | Solo developers, freelancers | CI/CD GitHub Action (compliance gate on PRs). Scheduled re-scans with change detection (`codepliant diff`). Export to Notion, Confluence, Google Docs. Custom branding/templates. Priority email support. |
| **Team** | $49/month or $399/year (up to 10 seats) | Small startups, agencies | Everything in Pro. Team dashboard (compliance status across repos). Multi-repo scanning. Shared template library. Slack/Teams notifications on compliance drift. Role-based access. |
| **Enterprise** | Custom ($500+/month) | Mid-market, regulated industries | Everything in Team. SSO/SAML. Custom framework support. Dedicated support. SLA. Audit trail. On-premise deployment option. |

**Rationale**:
- Free tier must remain fully functional as a standalone CLI — this is the growth engine. Open source conversion rates are 0.5-3%, so maximizing adoption is critical. Even at 1% conversion, you need 10,000 active users to get 100 paying customers.
- $19/month Pro tier targets the Termly price range ($10-20/month) but offers dramatically more value (code-aware scanning vs. form wizards). This is the impulse-buy price point for individual developers.
- $49/month Team tier fills the gap between Termly ($20/month) and Vanta ($10,000/year). A 10-person startup paying $49/month ($588/year) instead of $10,000/year for Vanta is a compelling value proposition.
- Enterprise tier captures the long tail of organizations that need custom compliance frameworks, SSO, and audit trails.

**Premium Features That Make Sense (ranked by feasibility and demand)**

1. **CI/CD GitHub Action** [HIGH value, MEDIUM effort]: Run `codepliant scan` on every PR as a compliance gate. Flag new services that need disclosure updates. This is the #1 "compliance-as-code" feature developers want in 2026. Can be a free Action that requires a Pro license key for advanced features (change detection, blocking PRs).

2. **Export to Notion/Confluence/Google Docs** [HIGH value, LOW effort]: Developers don't want to manually copy markdown files into their wiki. Direct export to where teams actually store documentation. Notion and Confluence APIs are straightforward to integrate.

3. **Team Dashboard (Cloud)** [HIGH value, HIGH effort]: Web dashboard showing compliance status across all repos in an org. Which repos have outdated docs? Which added new services since last scan? This is the primary justification for the Team tier — visibility across a team's entire portfolio.

4. **Custom Templates** [MEDIUM value, LOW effort]: Let users customize document templates (add company-specific clauses, remove sections, change formatting). Store templates in `.codepliant/templates/` or in a cloud account.

5. **Change Detection (`codepliant diff`)** [MEDIUM value, MEDIUM effort]: Already in the backlog. Show what changed since last generation — new services detected, removed services, updated documents. Essential for CI/CD workflows and audit trails.

6. **Multi-format Export (PDF, DOCX)** [MEDIUM value, LOW effort]: Codepliant already generates HTML and PDF. Adding DOCX would cover legal teams who need Word documents for review and redlining.

7. **Priority Support** [LOW incremental effort]: Dedicated email/Slack channel for Pro/Team customers. Low cost to provide at small scale, high perceived value.

**What NOT to Build (yet)**

- A full GRC platform — this is Vanta/Drata territory and requires massive engineering investment.
- AI-powered document customization — risky for legal documents where accuracy is critical. Codepliant's deterministic, code-based approach is a differentiator.
- White-label/reseller program — premature until the product has significant market traction.

#### Revenue Projections (Conservative)

Assuming a successful launch (Show HN front page, 500+ GitHub stars in first month):
- **Month 1-3**: 500-2,000 CLI users, 0 paying (building trust, gathering feedback)
- **Month 3-6**: 2,000-5,000 CLI users, 10-30 Pro subscribers ($190-$570/month)
- **Month 6-12**: 5,000-10,000 CLI users, 50-100 Pro + 5-10 Team subscribers ($1,200-$2,400/month)
- **Year 2**: 10,000-25,000 CLI users, 150-300 Pro + 20-50 Team subscribers ($4,000-$8,000/month)

At 1% conversion rate with 10,000 users and $25 average revenue per paying user, that is $2,500/month ($30K/year). This is a realistic solo-developer SaaS income, not venture-scale — which is appropriate for the project's current stage.

#### Recommended Actions from Iteration 4

1. **[HIGH] Build the GitHub Action first**: This is the highest-leverage premium feature. A free GitHub Action that runs `codepliant scan` on PRs, with Pro-tier features (change detection, PR comments with compliance diffs) gated behind a license key. This creates a natural upgrade path: developer tries free CLI, adds Action to CI, wants diff/blocking features, upgrades to Pro.

2. **[HIGH] Set up Stripe + license key infrastructure**: Before launching any paid tier, implement a simple license key system. Generate keys on purchase, validate in CLI/Action. Use Stripe for billing — it handles subscriptions, trials, and invoicing. Estimated effort: 2-3 days.

3. **[HIGH] Add GitHub Sponsors and Open Collective immediately**: Even before paid tiers launch, sponsorship provides early revenue signal and social proof. Add sponsor buttons to the GitHub repo, README, and website. Target: $500-$1,000/month from sponsors.

4. **[MEDIUM] Build Notion/Confluence export**: Low-effort, high-perceived-value feature that justifies the Pro tier. Notion API is well-documented; Confluence REST API is straightforward. This is a "wow" feature in demos: "run one command and your compliance docs appear in your team's Notion workspace."

5. **[MEDIUM] Implement `codepliant diff`**: Already in the backlog. This is a prerequisite for the CI/CD compliance gate (the Action needs to know what changed). Store scan results as a `.codepliant/snapshot.json` and compare on subsequent runs.

6. **[LOW] Design the Team dashboard**: This is the highest-effort feature but the primary justification for the Team tier. Start with a simple web app that ingests scan results from multiple repos and displays compliance status. Can be a Next.js app (matching the existing website stack) deployed on Vercel.

7. **[LOW] Explore acquisition positioning**: Ensure the project is visible to potential acquirers (Snyk, GitHub, Vanta) by engaging with their ecosystems — build a Snyk integration, publish on GitHub Marketplace, write comparison content. Acquisition is not a goal but should be a possible outcome.

### Iteration 5 — 2026-03-16

#### Distribution Channels and Developer Adoption

##### 1. Awesome Lists — Submission Requirements and Strategy

**General Awesome List Rules (sindresorhus/awesome standard)**
- The list/project must have been around for at least 30 days (from first real commit or open-sourcing)
- PR title must follow the format "Add Name of List" and must not contain the word "Awesome"
- Before submitting, you must review at least 2 other open PRs with substantive feedback (not just "looks good")
- Run awesome-lint on any list submission and fix reported issues
- Default branch must be named main, not master
- Only "awesome" (best-in-class) items are accepted, not everything, just curations of the best
- Items must not be unmaintained, archived, deprecated, or missing documentation
- Every entry needs a succinct description

**Target Awesome Lists for Codepliant (priority order)**

1. **awesome-privacy (pluja/awesome-privacy)** — 15K+ stars. Submit via PR or open an issue. The Contributing.md at misc/Contributing.md specifies: add via PR if familiar with GitHub, or open an issue. Tools should be open-source and privacy-respecting. Codepliant fits as a "Privacy Tools > Compliance" entry since it generates privacy policies from code analysis with zero network calls.

2. **awesome-compliance (multiple repos)**
   - getprobo/awesome-compliance — organized into Frameworks and Standards, Tools and Software, Other Resources. Has Security/Privacy/Data Protection subcategory. Contributing: open a PR, follow awesome list guidelines. Codepliant fits under Tools and Software > Compliance Automation.
   - theopenlane/awesome-compliance — broader compliance resources list
   - hysnsec/awesome-compliance-as-code — specifically for compliance-as-code tooling, strong fit for Codepliant's code-scanning approach
   - iamcommie/awesome-compliance — welcomes PRs and issues

3. **awesome-developer-first (agamm/awesome-developer-first)** — 1.6K stars, 30+ categories including Security section. Has formal CONTRIBUTING.md. Codepliant fits the developer-first ethos (CLI tool, npm install, zero config).

4. **awesome-security (sbilly/awesome-security)** — large community-driven collection. Goal is categorized well-known resources. Submit via PR.

5. **awesome-security-GRC (Arudjreis/awesome-security-GRC)** — specifically for Governance, Risk, Compliance professionals. Accepts PRs and issues.

6. **awesome-static-analysis (analysis-tools-dev/static-analysis)** — Codepliant is a static analysis tool for compliance. Check CONTRIBUTING.md for formatting rules.

**Submission Checklist**
- Ensure README has a clear one-line description, install instructions, and usage examples
- Have at least 50+ GitHub stars before submitting to high-traffic lists (social proof)
- Include a badge for npm version, test count, and license in README
- Each PR should add Codepliant to the most relevant subcategory with a one-line description
- Stagger submissions across lists (one per week) to avoid looking spammy

##### 2. Developer Newsletters — Submission Channels

**Cooperpress Newsletters (JavaScript Weekly, Node Weekly)**
- Publisher: Cooperpress, based in Lincolnshire, UK
- JavaScript Weekly: 170,000+ subscribers, published Fridays. Covers JS news, tools, tutorials, releases
- Node Weekly: focused on Node.js ecosystem updates
- Submission: email editor@cooperpress.com with a brief pitch. They accept direct submissions and occasionally exclusives. Best approach: write a compelling blog post (e.g., "How we auto-generate privacy policies from code") and pitch the link alongside the tool. Cooperpress values unique angles over generic announcements
- Timing: submit Tuesday-Wednesday for Friday publication consideration

**TLDR Newsletter**
- 1,250,000+ subscribers (software engineers, tech executives, decision-makers)
- Daily newsletter covering startups, tech, and programming
- Two paths:
  - Organic: TLDR curates links editorially. Getting featured requires the tool/article to be trending on HN, Reddit, or Twitter. Best strategy: time your Show HN or blog post to coincide with TLDR editorial cycles
  - Paid sponsorship: via advertise.tldr.tech. They limit to 3 advertisers max per issue. You provide bullet points and a landing page; TLDR writes the ad copy in their editorial style. Includes a dedicated Customer Success Manager. Ideal for B2B SaaS, developer tools, cybersecurity
- Cost: significant (enterprise-tier pricing), better suited for post-revenue stage

**Bytes.dev**
- Around 70,000+ subscribers, published twice weekly by ui.dev
- JavaScript/React focused, known for humorous and entertaining tone
- No formal submission process found. Best approach: tweet at @bytesdotdev or DM the team. They tend to feature tools that have buzz on Twitter/X or interesting technical angles
- Advertising available at bytes.dev/advertise

**Console.dev**
- Free weekly devtools newsletter with editorial reviews (2-3 tools per week)
- Selection criteria (all must be answered positively for best chance):
  1. Primary user must be a developer
  2. Self-service signup (no sales call required)
  3. Would form part of regular-use developer toolset
  4. Enhances development: reduces bugs, improves build times, gets code to production faster
  5. Power-user features: dark mode, API, CLI, keyboard shortcuts
  6. Cross-platform quality, easy install, delivers on claims
  7. Actively maintained with regular updates
  8. Good documentation
  9. Fast performance
  10. No negative impact on security or privacy
  11. Passes the "would I recommend this to friends" test
- Critical requirement: Console only lists early-access, alpha, or beta releases (pre-1.0 or labeled beta/preview). GA/stable releases are NOT eligible. Codepliant at v1.0.0 may not qualify unless a new beta feature (e.g., codepliant wizard beta) is highlighted
- No sponsored reviews. Contact: david@console.dev
- Codepliant strengths for Console: CLI-first, zero dependencies, privacy-focused, developer-centric

**Other Newsletters Worth Targeting**
- DevOps Weekly — compliance automation angle
- Changelog Weekly / Changelog News — open-source focused, covers interesting new tools
- Hacker Newsletter — curates top HN stories weekly (get on HN first)
- This Week in Rust / Go Weekly / Python Weekly — for when multi-language support is highlighted
- Privacy Matters Newsletter — niche but directly relevant audience

##### 3. Security and Privacy Community Coverage

**OWASP (Open Web Application Security Project)**
- 100+ active projects; new project applications submitted weekly
- Path 1 — Become an OWASP Project: Submit as an Incubator project via the OWASP Project Handbook. Requirements: unique selling point vs. existing OWASP projects, open source, defined roadmap, team members. Codepliant angle: no existing OWASP project does code-scanning compliance document generation. Graduation path: Incubator then Lab then Flagship
- Path 2 — Contribute to OWASP Privacy Toolkit: The existing OWASP Privacy Toolkit (mindedsecurity/owasp-privacy-toolkit) focuses on browser-layer privacy detection. Codepliant could complement it on the code-scanning side. Contributing: raise an issue before submitting a PR
- Path 3 — Contribute to OWASP AI Exchange: Flagship project feeding into EU AI Act and ISO standards. Codepliant AI Disclosure and AI Model Card generators are directly relevant. Contribute content or tooling references
- OWASP Chapter Presentations: Local OWASP chapters host regular meetups. Presenting Codepliant as a lightning talk (10-15 min) at a chapter meeting is low-barrier and builds credibility. Find chapters at owasp.org/chapters
- Google Summer of Code: OWASP participates in GSoC annually. Codepliant could propose a GSoC project (e.g., "Add Flutter/Dart/Swift ecosystem support") to gain contributors and visibility

**IAPP (International Association of Privacy Professionals)**
- Privacy Engineering Section: brings together IT and privacy engineering professionals
- Engagement paths:
  1. Conference Speaking: Call for Proposals is open year-round, sessions accepted on rolling basis. Pitch: "Automating Privacy Compliance Documentation from Code Analysis" — directly relevant to their audience
  2. Advisory Board: Apply during Call for Volunteers every September
  3. KnowledgeNet Chapters: Present at local chapter events to establish expertise
  4. Resource Center: IAPP hosts a "Privacy Tech and Privacy by Design" topic page. Getting Codepliant mentioned here (via a published article or whitepaper) provides long-term visibility
- IAPP membership is paid (around $350/year for individual), which gates some community access. However, conference CFPs and published content are accessible without membership
- Key IAPP events: Global Privacy Summit (spring), Privacy. Security. Risk. (fall), Asia Privacy Forum, Europe Data Protection Congress

**Other Privacy/Security Communities**
- Privacy Engineering subreddit (r/privacyengineering) and r/privacy: share tool announcements and use-case posts
- r/devops and r/selfhosted: compliance automation tooling resonates with these communities
- DEV.to and Hashnode: publish technical articles about compliance-as-code approach for SEO and community reach
- Linux Foundation OpenChain: open-source compliance community. Codepliant license-scanning capabilities (if added) would fit their focus
- PrivacyTools.io / privacyguides.org: community-maintained privacy tool recommendations. Apply for listing once the tool has proven community traction
- CNCF (Cloud Native Computing Foundation): if Codepliant adds container/Kubernetes scanning, CNCF Sandbox submission becomes viable

#### Recommended Actions from Iteration 5

1. **[HIGH] Submit to 3 awesome lists in the first 2 weeks**: Start with awesome-compliance-as-code (strongest fit), then awesome-compliance (getprobo), then awesome-privacy. Review 2 open PRs on each repo before submitting. One submission per week.

2. **[HIGH] Pitch Cooperpress newsletters**: Write a blog post titled "Auto-Generating Privacy Policies from Code: How Codepliant Scans Your Stack" and email editor@cooperpress.com with the link plus a 2-sentence tool description. Target JavaScript Weekly first (170K subscribers), then Node Weekly.

3. **[HIGH] Submit a Show HN post timed with newsletter pitches**: A strong Show HN landing (50+ upvotes) creates a ripple effect — TLDR, Hacker Newsletter, and Changelog all curate from HN. Time the newsletter pitches for the same week to create a coordinated visibility spike.

4. **[MEDIUM] Apply for OWASP Incubator status**: No existing OWASP project covers code-scanning compliance document generation. The unique positioning is strong. This provides long-term credibility and discoverability within the security community. Start by joining the OWASP Slack and engaging with the Project Committee.

5. **[MEDIUM] Submit a CFP to IAPP Privacy Engineering Section**: Propose a talk on automating privacy compliance from code analysis. The IAPP audience (privacy engineers, DPOs, compliance officers) is the exact buyer persona for Codepliant Pro/Team tiers. CFPs are rolling, so submit immediately.

6. **[MEDIUM] Contact Console.dev**: Email david@console.dev. Note: Console only features pre-1.0 or beta tools. Frame the pitch around an upcoming beta feature (e.g., codepliant wizard in beta, or the upcoming codepliant diff feature). Highlight: CLI-first, zero network calls, zero runtime dependencies, privacy-by-design.

7. **[LOW] Build presence in Reddit communities**: Post genuine use-case stories (not promotional) in r/privacyengineering, r/devops, r/selfhosted, and r/webdev. Example: "I built an open-source tool that scans your codebase and generates GDPR compliance docs — here is what I learned." Engage authentically in comments.

8. **[LOW] Publish on DEV.to and Hashnode**: Write 2-3 technical articles about the compliance-as-code approach. These rank well in Google and drive sustained organic traffic. Topics: "Why Your Privacy Policy Should Be Generated from Code", "Automating GDPR Compliance for Node.js Apps", "What Your package.json Reveals About Your Data Practices."

### Iteration 6 — 2026-03-16

#### GitHub Actions for Compliance — Monetization Research

##### 1. Existing GitHub Actions for Compliance/Privacy Scanning — What Exists

**Compliance-focused actions in the marketplace:**

- **ghascompliance (GitHub Advanced Security Compliance)** — Lets organizations codify policies for Dependabot, secret scanning, code scanning alerts, and open source license usage. Configurable risk thresholds via YAML. Closest existing action to compliance policy enforcement but focused on security alerts, not document generation.
- **Azure Policy Compliance Scan** — Triggers on-demand Azure resource compliance checks from GitHub workflows. Infrastructure-focused, not code/privacy-focused.
- **Google Checks App Compliance Scan** — Scans mobile apps for compliance issues and data collection/sharing behaviors using Google Checks. Mobile-app-only; does not scan source code for web/backend projects.
- **Prisma Cloud Scan** — Scans container images for vulnerabilities and compliance issues. Container/infrastructure scope only.
- **42Crunch API Conformance Scan** — API security and conformance scanning. API-specific, not general compliance.
- **ghas-policy-as-code** — Define compliance and risk rules for repositories using YAML config. Security-alert-focused.

**SBOM generation actions:**

- **CycloneDX cdxgen** — Generates CycloneDX SBOMs in CI/CD. Codepliant already has `codepliant sbom` which could complement this.
- **Syft + Grype** — Syft generates SBOMs (CycloneDX/SPDX), Grype scans them for vulnerabilities. Well-established pipeline.
- **GitHub native SBOM export** — Built-in SPDX export for repositories. Read-access only, no CI/CD integration for document generation.

**GDPR-specific tools (standalone, not GitHub Actions):**

- **mammuth/gdpr-scanner** — Checks domains for GDPR violations (tracking, anonymization, privacy statements). Website-scanning focus, not codebase-scanning.
- **dev4privacy/gdpr-analyzer** — Analyzes webpage source code and behavior for GDPR compliance scoring. Web-focused.
- **smartlawhub/Automated-GDPR-Compliance-Checking** — NLP-based extraction of data practices from privacy policies to check GDPR mandatory information. Analyzes existing policies, doesn't generate them.

**What's missing (Codepliant's opportunity):**

- No GitHub Action exists that scans source code and generates compliance documents (Privacy Policy, Terms of Service, Cookie Policy, AI Disclosure).
- No action generates privacy policies from dependency/import analysis.
- No action produces compliance documentation as PR artifacts or comments.
- No action combines SBOM generation with human-readable compliance documents.
- The gap between "security scanning" and "compliance document generation" is completely unserved in the marketplace.

##### 2. GitHub Actions Marketplace Submission Process

**Requirements to publish:**

1. Action must be in a **public repository**
2. Repository must contain a single **action.yml or action.yaml** at the root
3. Repository must **not contain workflow files** (`.github/workflows/`)
4. Action **name must be unique** — cannot match existing marketplace actions, users, or orgs
5. Publisher must have **two-factor authentication** enabled
6. Publisher must accept the **GitHub Marketplace Developer Agreement**

**Publishing process:**

1. Create the action repository with action.yml at root
2. Tag with a semantic version release (e.g., v1.0.0)
3. Navigate to the action metadata file in the repo — GitHub shows a "Publish to Marketplace" banner
4. Click "Draft a release" and check "Publish this Action to the GitHub Marketplace"
5. Fill in release details and publish

**Key facts:**

- Actions are published **immediately** — no GitHub review process
- No cost to publish — entirely free
- Actions appear in marketplace search results and can be discovered by category
- Over 25,000 actions currently in the marketplace, but only 913 (as of 2024 data) are from verified GitHub users — being verified is a differentiator
- Average OSSF security score for marketplace actions is only 4.23/10 — a well-maintained action stands out

**Recommended repository structure for Codepliant Action:**

```
codepliant-action/
├── action.yml          # Action metadata (inputs, outputs, runs)
├── README.md           # Usage docs (displayed on marketplace page)
├── LICENSE             # MIT (matching main project)
├── dist/               # Bundled JS (if JavaScript action) or empty for composite
└── .github/            # NO workflow files in this repo
```

##### 3. How Popular Security GitHub Actions Work

**Action type comparison (relevant to Codepliant):**

| Type | Speed | Cross-platform | Complexity | Best for |
|------|-------|----------------|-----------|----------|
| **Composite** | Fast | Yes (all runners) | Low | Wrapping CLI tools, simple orchestration |
| **JavaScript** | Fast | Yes (all runners) | Medium | Complex logic, GitHub API integration |
| **Docker** | Slow (container boot) | Linux only | High | Isolated environments, specific dependencies |

**Recommendation for Codepliant: Composite action** — wraps `npx codepliant` commands, fast startup, works on all runner OSes, simplest to maintain.

**Snyk Action pattern:**

- Multiple sub-actions in one repo (setup/, node/, docker/, iac/, python/, etc.)
- Docker-based actions with environment variables (SNYK_INTEGRATION_NAME, SNYK_INTEGRATION_VERSION)
- Passes CLI args through `with.args` property
- Requires SNYK_TOKEN secret for authentication
- Outputs results as snyk.json file

**CodeQL Action pattern:**

- Split into multiple actions: init/, analyze/, upload-sarif/, autobuild/
- JavaScript-based (Node.js) action
- Uses SARIF format for results upload to GitHub Code Scanning
- Inputs include: languages, queries, packs, RAM limits, thread counts
- Outputs integrate directly with GitHub Security tab
- `upload-sarif` action is reusable by any tool that produces SARIF output

**Trivy Action pattern:**

- Single action with many configurable inputs
- Key inputs: scan-type (image/fs/config/repo), format (table/json/sarif), severity filter, exit-code for fail/pass control
- Built-in caching via actions/cache
- SARIF output enables GitHub Code Scanning integration
- exit-code input controls whether findings fail the workflow (0 = pass, 1 = fail)

**Common patterns across all popular security actions:**

1. **SARIF upload** — Most security actions output SARIF format and use `github/codeql-action/upload-sarif` to push results to GitHub's Security tab / Code Scanning interface
2. **Configurable severity thresholds** — Users set which severity levels should fail the build
3. **PR annotations** — Results appear inline in PR diffs (red for errors, yellow for warnings, blue for info)
4. **Multiple output formats** — JSON for programmatic use, SARIF for GitHub integration, human-readable for logs
5. **Caching** — Cache vulnerability databases or scan results for faster subsequent runs
6. **Exit code control** — Separate "informational" mode (exit 0) from "enforcement" mode (exit 1 on findings)

##### 4. Proposed Codepliant GitHub Action Design

**action.yml structure:**

```yaml
name: 'Codepliant Compliance Scan'
description: 'Scan your codebase and generate compliance documents (Privacy Policy, Terms of Service, AI Disclosure, Cookie Policy)'
branding:
  icon: 'shield'
  color: 'blue'
inputs:
  version:
    description: 'Codepliant version to use'
    required: false
    default: 'latest'
  command:
    description: 'Command to run: scan, go, sbom, wizard'
    required: false
    default: 'scan'
  output-format:
    description: 'Output format: json, markdown, text'
    required: false
    default: 'markdown'
  output-dir:
    description: 'Directory to write generated documents'
    required: false
    default: './compliance-docs'
  fail-on-missing:
    description: 'Fail if required compliance documents are missing or outdated'
    required: false
    default: 'false'
  documents:
    description: 'Comma-separated list of documents to generate (privacy-policy,terms-of-service,cookie-policy,ai-disclosure)'
    required: false
    default: 'all'
  comment-on-pr:
    description: 'Post scan summary as a PR comment'
    required: false
    default: 'true'
outputs:
  scan-results:
    description: 'JSON scan results'
  documents-generated:
    description: 'List of generated document paths'
  services-detected:
    description: 'Number of services/SDKs detected'
runs:
  using: 'composite'
  steps:
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
    - name: Run Codepliant
      shell: bash
      run: npx codepliant@${{ inputs.version }} ${{ inputs.command }} . --json
```

**Workflow example for users:**

```yaml
name: Compliance Check
on: [push, pull_request]
jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: codepliant/codepliant-action@v1
        with:
          command: scan
          comment-on-pr: 'true'
          fail-on-missing: 'false'
```

##### 5. Monetization Strategy via GitHub Action

**Free tier (open source action):**

- Full scan and document generation (same as CLI)
- JSON/markdown output as workflow artifacts
- PR comment with scan summary
- SBOM generation

**Pro tier (license key required):**

- `fail-on-missing` enforcement mode — blocks PRs if compliance docs are outdated or missing
- Compliance drift detection (`codepliant diff` in CI)
- Custom document templates
- Historical compliance tracking (compare scans across commits)
- Team dashboard / badge generation
- Priority support

**Implementation approach:**

- Free features: composite action wrapping `npx codepliant`
- Pro features: check for CODEPLIANT_LICENSE_KEY secret, call a lightweight validation API (only for license check, not for scanning — preserves zero-network-calls for core scanning)
- License key validation can be a simple JWT check against a public key bundled in the action — no network call needed for validation itself, only for initial key issuance

**Revenue model:**

- Free action drives adoption and awareness (marketplace visibility)
- Pro license: $19/month per repo or $99/month per org (unlimited repos)
- Enterprise: $499/month with SSO, audit logs, custom frameworks
- GitHub Marketplace does not take a cut of action usage — monetization is entirely through the license key model

##### 6. Recommended Actions for Iteration 6

1. **[HIGH] Create the `codepliant-action` repository**: Set up a public repo with action.yml (composite type), README with usage examples, and branding (shield icon, blue color). Use the design above as the starting template. This is the single highest-ROI monetization move.

2. **[HIGH] Implement PR comment feature**: After scanning, post a formatted summary comment on the PR showing detected services, data categories, and which documents need updating. This is the "wow" moment that drives word-of-mouth adoption. Use `github-script` or direct GitHub API calls in the composite action.

3. **[HIGH] Publish to GitHub Marketplace immediately**: Since there is no review process, publish as soon as the action works. Being first-to-market for "compliance document generation" in the marketplace is a significant advantage. Tag as v1.0.0 to match the CLI version.

4. **[MEDIUM] Add SARIF output to Codepliant CLI**: Output compliance findings (e.g., "Stripe detected but no Cookie Policy generated") as SARIF so they appear in GitHub's Security tab. This integrates Codepliant into the same developer workflow as CodeQL, Snyk, and Trivy — making it feel like a natural part of the security toolchain.

5. **[MEDIUM] Implement `fail-on-missing` as the first Pro feature**: This is the natural upgrade path — teams use the free action to see their compliance status, then upgrade to Pro to enforce it in CI. Gate behind a license key check.

6. **[MEDIUM] Add artifact upload for generated documents**: Upload generated compliance docs as workflow artifacts so they can be downloaded from the Actions tab. This makes the action immediately useful even without PR comments.

7. **[LOW] Apply for GitHub Verified Creator status**: Only 913 of 25,000+ marketplace actions are from verified creators. Verification builds trust and improves marketplace ranking. Requirements include consistent maintenance, documentation, and community engagement.

8. **[LOW] Create example workflows for common setups**: Provide copy-paste workflow files for Node.js, Python, Go, Ruby, and monorepo setups. Lower the barrier to adoption.

### Iteration 8 — 2026-03-16

#### Show HN Launch Preparation

##### 1. Analysis of Top Show HN Posts for Developer Tools (2025-2026)

**Top-performing developer tool Show HN posts of 2025 (by points):**

| Title | Points | Comments |
|-------|--------|----------|
| Clippy – 90s UI for local LLMs | 1,122 | 275 |
| Term.everything – Run any GUI app in the terminal | 1,094 | 144 |
| Kitten TTS – 25MB CPU-Only, Open-Source TTS Model | 1,003 | 361 |
| I built a hardware processor that runs Python | 983 | 265 |
| Unsure Calculator – back-of-a-napkin probabilistic calculator | 930 | 162 |
| I built an AI that turns GitHub codebases into easy tutorials | 923 | 172 |
| Free, in-browser PDF editor | 791 | 182 |
| Cs16.css – CSS library based on Counter Strike 1.6 UI | 819 | 141 |
| Unregistry – "docker push" directly to servers without registry | 726 | 164 |
| Whispering – Open-source, local-first dictation | 591 | 152 |
| Browser MCP – Automate your browser using Cursor, Claude | 616 | 217 |
| Interactive systemd – a better way to work with systemd units | 546 | 204 |
| My LLM CLI tool can run tools now, from Python code | 529 | 165 |
| Pangolin – Open source alternative to Cloudflare Tunnels | 500 | 125 |

**Top-performing developer tool Show HN posts of 2026 (by points):**

| Title | Points | Comments |
|-------|--------|----------|
| ChartGPU – WebGPU-powered charting library (1M points at 60fps) | 670 | 214 |
| Micasa – Track your house from the terminal | 657 | 218 |
| Sweep – Open-weights 1.5B model for next-edit autocomplete | 534 | 153 |
| NanoClaw – Clawdbot in 500 lines of TS with Apple container isolation | 533 | 224 |
| OpenWorkers – Self-hosted Cloudflare workers in Rust | 500 | 158 |
| Terminal UI for AWS | 390 | 210 |
| Prism.Tools – Free and privacy-focused developer utilities | 380 | 104 |
| LocalGPT – Local-first AI assistant in Rust with persistent memory | 331 | 156 |
| PgDog – Scale Postgres without changing the app | 326 | 64 |
| Terminal Phone – E2EE Walkie Talkie from the Command Line | 322 | 85 |

**Title patterns that get the most points:**

1. **"[Name] – [clear one-line description]"** is the dominant format (Clippy, Unregistry, Pangolin, ChartGPU, OpenWorkers, PgDog)
2. **"I built [specific thing]"** personal framing works well (983 pts, 923 pts)
3. **Specificity wins**: titles with concrete details (e.g., "25MB CPU-Only", "1M points at 60fps", "500 lines of TS") outperform vague ones
4. **"Open source alternative to X"** is a proven pattern (Pangolin vs Cloudflare Tunnels)
5. **Titles between 40-80 characters** perform best; too short or too long underperform
6. **No superlatives**: none of the top posts use "fastest", "best", or "first"

**What top comments praise:**
- Working demos that can be tried immediately
- Open-source and self-hostable projects
- Privacy-first, zero-telemetry design
- Technical depth in the founder's first comment
- Solving a real pain point the commenter has experienced
- Small binary/package size and minimal dependencies

**What top comments criticize:**
- Marketing language or sales-y tone
- Missing GitHub repo link
- Requiring sign-up before trying the tool
- Vague descriptions that do not explain what the tool actually does
- Booster comments from friends/employees (community detects and flags these)
- AI-wrapper projects with no genuine technical depth

##### 2. Ideal Show HN Post Structure

**Title format:**
```
Show HN: [Name] – [what it does in plain English]
```
- Make it obvious what you built and where the link goes
- Link the URL field to the GitHub repo (not a marketing site) — this is what HN dev audience expects
- Leave the text field blank (posts without URLs get penalized)

**First comment (post immediately after submission):**
1. One-sentence intro: who you are and what the tool does
2. The problem: why this matters, framed as a pain point fellow devs experience
3. Your backstory: how you came to work on this (personal motivation seeds good discussion)
4. What is different: the technical approach that differentiates this from alternatives
5. Technical details: architecture decisions, constraints, trade-offs
6. Honest limitations: what it does not do yet (builds trust)
7. Call to action: "Try it on your project and let me know what breaks"

**Tone rules:**
- Talk as a fellow builder, not a marketer — imagine having a drink with a dev friend
- Never sell; interest them and let them sell themselves
- When criticized, agree with the positive intent behind the critique, then explain your reasoning — you will not convince the critic but you will convince the silent audience
- Do NOT have friends/cofounders post booster comments; the community detects this and it backfires

**Timing:**
- **Best day: Tuesday** — average peak score of 110 points, nearly 60% higher than Monday (68) or Wednesday (69). Saturday is second best at 89.
- **Best time: 9 AM - 12 PM Pacific** — catches the US morning crowd while EU is still online
- **Treat your launch window as 30 minutes**: 51% of Show HN posts disappear from the front page within a single 30-minute window. Be ready to respond to comments instantly.
- High scores do not equal longevity: the HN ranking algorithm decays posts aggressively. A 3,000-point post at 24 hours ranks below a 50-point post at 2 hours. Capture emails/GitHub stars during peak visibility.
- AI-related Show HN posts are currently underperforming expectations (oversaturation in 2025-2026). Codepliant should lead with the compliance/privacy angle, not the AI angle.

**Pre-launch checklist:**
- GitHub repo README must be polished with clear install instructions, a usage example, and an output preview
- `npx codepliant go .` must work flawlessly on a clean machine (the HN crowd will try it immediately)
- Have 2-3 team members ready to engage in comments within the first 30 minutes
- Prepare answers for predictable objections: "how is this different from Termly?", "do I still need a lawyer?", "what about [framework] support?"

##### 3. Draft Show HN Title and First Comment for Codepliant

**Recommended title:**
```
Show HN: Codepliant – Open-source CLI that scans your code and generates compliance docs
```

**Rationale:** Follows the proven "[Name] – [plain description]" pattern. Hits three HN-favored signals: open-source, CLI tool, and solves a real problem. At 76 characters, it is within the optimal 40-80 range. Avoids superlatives and marketing language.

**Alternative titles (ranked):**
1. `Show HN: Codepliant – Generate privacy policies from actual code analysis, not templates`
2. `Show HN: Codepliant – Scan your codebase, generate GDPR/CCPA compliance docs automatically`
3. `Show HN: Codepliant – Your package.json knows more about your data practices than you do`

Title #3 is riskier but more curiosity-driven — could work well if the first comment backs it up with substance.

**Draft first comment:**

```
Hey HN — I built Codepliant because I was tired of filling out privacy policy
generators that ask me questions I should not have to answer manually.

My codebase already knows what data it collects. If I import Stripe, I process
payment data. If I use NextAuth, I handle authentication. If I have a Sentry DSN
in my .env, I am sending error telemetry somewhere. Why am I filling out a form
to tell a generator things my package.json already declares?

Codepliant scans your actual code — package.json, imports, .env files, Terraform
configs, Django settings.py, even GitHub Actions workflows — and generates
compliance documents (Privacy Policy, Terms of Service, Cookie Policy, AI
Disclosure, DPA, SBOM) based on what it actually finds.

Some technical details:
- Zero network calls — everything runs locally, nothing leaves your machine
- Zero runtime dependencies — only devDependencies
- Supports 11 ecosystems (Node, Python, Go, Ruby, Rust, Java, PHP, .NET,
  Terraform, Flutter, Django)
- 121+ document types, 1,300+ tests
- ~830KB package size

What it does NOT do: this is not legal advice. Generated documents include a
disclaimer and should be reviewed by counsel. But it gets you 80% of the way
there in 30 seconds instead of 3 hours, and unlike template generators, the
output actually matches what your code does.

Try it: npx codepliant go . (scans current directory, generates docs)

I would love feedback on detection accuracy — if it misses a service in your
stack or generates something wrong, please open an issue. That is the most
valuable thing you can tell me.

GitHub: [link]
```

**Why this draft works:**
- Opens with a personal pain point (not a pitch)
- Explains the "why" before the "what"
- Technical details satisfy the HN audience's curiosity
- Honest about limitations (not legal advice)
- Specific numbers build credibility (121+ doc types, 1,300+ tests, 830KB)
- Ends with an actionable one-liner (`npx codepliant go .`) and a genuine request for feedback
- Zero marketing language; reads like a fellow builder sharing their work

##### 4. Recommended Launch Actions

1. **[HIGH] Polish the GitHub README**: Add a demo GIF (Issue #3 is still open) showing `npx codepliant go .` scanning a real project. This is the single most impactful pre-launch task — HN users click through to GitHub first.

2. **[HIGH] Schedule for a Tuesday, 9-10 AM Pacific**: This is the statistically optimal window. Have the first comment ready to paste immediately after submission.

3. **[HIGH] Prepare FAQ responses**: Draft short, non-defensive answers for: "How is this different from Termly/Iubenda?", "Can I trust auto-generated legal docs?", "What about [language] support?", "Does this phone home?"

4. **[MEDIUM] Cross-post to complementary channels the same day**: Post to r/selfhosted, r/devops, r/webdev, and DEV.to within 2-4 hours of the HN post. HN traffic spikes and decays within hours — capture the overflow.

5. **[MEDIUM] Set up analytics for the launch window**: Track GitHub stars, npm installs, and website traffic in real-time during the first 2 hours. This data informs whether to do a follow-up "Launch HN" post for a future version.

6. **[LOW] Consider a "Show HN" dry run**: Post a technical blog post to HN first (e.g., "What your package.json reveals about your data practices") to build karma and test messaging before the main launch.

Sources:
- [Best of Show HN 2025](https://bestofshowhn.com/2025)
- [Best of Show HN 2026](https://bestofshowhn.com/2026)
- [Show HN Survival Study: 605 Posts Tracked for 63 Days](https://asof.app/research/show-hn-survival)
- [State of Show HN 2025 (Sturdy Statistics)](https://blog.sturdystatistics.com/posts/show_hn/)
- [How to launch a dev tool on Hacker News (Markepear)](https://www.markepear.dev/blog/dev-tool-hacker-news-launch)
- [How to crush your Hacker News launch (DEV.to)](https://dev.to/dfarrell/how-to-crush-your-hacker-news-launch-10jk)
- [Show HN Guidelines (official)](https://news.ycombinator.com/showhn.html)
- [When is the best time to post on Show HN (Myriade)](https://www.myriade.ai/blogs/when-is-it-the-best-time-to-post-on-show-hn)

## Development Log

**2026-03-16 — Add `codepliant sbom` command (CycloneDX SBOM generation)**
- Research found SBOM is HIGH priority: EU Cyber Resilience Act (Sept 2026) will require SBOMs for software products sold in the EU
- Created `src/generator/sbom.ts` — generates CycloneDX 1.5 JSON from the project's package.json
  - Reads full dependency list (dependencies + devDependencies), not just known service signatures
  - Includes: bomFormat, specVersion, serialNumber (UUID), version, metadata (timestamp, tool info, component), components (name, version, type, purl, bom-ref)
  - Package URLs follow the purl spec (handles scoped npm packages correctly)
  - Deterministic output: components sorted alphabetically by name
- Added `sbom` command handler in `src/cli.ts` via `runSbom()` function
  - Scans the project, generates SBOM, writes to `sbom.json` (or `--output` flag for custom path)
  - Prints component count summary
- Created `src/generator/sbom.test.ts` with 7 tests covering:
  - Valid CycloneDX structure, scoped package purls, missing/empty package.json, unique serial numbers, file writing, nested directory creation
- Build verified: `npx tsc` passes cleanly, all 7 new tests pass

**2026-03-16 — Interactive wizard command (Issue #8)**
- Wired up the `codepliant wizard` command in `src/cli.ts` — previously a stub that printed "coming soon"
- The existing `runWizard` function (already implemented at line ~5310) provides a 6-step interactive flow:
  1. Scans the project and reports detected services
  2. Lets user confirm/exclude each detected service individually
  3. Multi-select jurisdictions (GDPR, CCPA, UK GDPR)
  4. Prompts for company info (or confirms existing config)
  5. Previews documents to be generated with line counts
  6. Generates documents, writes `.codepliantrc.json`, shows compliance score
- Uses Node.js built-in `readline` — no new dependencies
- Config saves `confirmedServices` and `excludeServices` for future runs
- Tests already exist in `src/wizard.test.ts` (config fields, service filtering, previous selections)
- Fixed pre-existing type error in `src/generator/dpa.test.ts` (missing `sources` field on `DataCategory`)
- Build verified: `npx tsc` passes cleanly
- Marked Issues #5 (Django settings) and #6 (Terraform) as done in backlog (completed in iterations 2 and 3)

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

**2026-03-16 — Add Terraform/IaC scanner (Issue #6)**
- Created new scanner `src/scanner/terraform.ts` that finds `.tf` files and detects cloud services
- Parses `resource` blocks to detect 16 cloud resource types across 3 providers:
  - AWS (7): `aws_s3_bucket`, `aws_rds_instance`, `aws_dynamodb_table`, `aws_sqs_queue`, `aws_sns_topic`, `aws_lambda_function`, `aws_cognito_user_pool`
  - GCP (4): `google_storage_bucket`, `google_sql_database_instance`, `google_bigquery_dataset`, `google_cloud_run_service`
  - Azure (4): `azurerm_storage_account`, `azurerm_sql_server`, `azurerm_cosmosdb_account`, `azurerm_redis_cache`
- Parses `provider` blocks to detect cloud providers (aws, google, azurerm)
- Maps data storage resources to appropriate categories (storage, database, auth, analytics)
- Sets `isDataProcessor` flags appropriately (e.g., Lambda/SQS/Cloud Run are infrastructure, not data processors)
- Merges duplicate resource types into single DetectedService with combined evidence
- Skips `.terraform/` cached directories during file discovery
- Registered in main scanner pipeline in `src/scanner/index.ts`
- Added 12 tests in `src/scanner/terraform.test.ts` covering: empty project, AWS/GCP/Azure resources, provider blocks, evidence merging, nested directories, .terraform skip, unrecognized resources, isDataProcessor flags, multi-cloud configs
- Build verified: `npx tsc` passes cleanly, all 12 new tests pass

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

### Iteration 3 — 2026-03-16
- **Build**: pass
- **Tests**: 926/926 passing (was 835, added 91 new tests)
- **Failing tests**: none
- **Tests added this iteration**:
  - `src/generator/privacy-policy.test.ts` (33 tests): title/introduction, company name/email from context, placeholder values, data categories listing, no-data fallback, third-party services section, database exclusion from third-party, GDPR legal basis table (Art. 6(1)(a)/(b)/(f)), AI-specific section presence/absence, international transfers for US-based providers, data retention periods per category, custom retention days, GDPR rights (access/erasure/portability), CCPA section with analytics, CCPA personal info categories, UK GDPR jurisdiction, DPO details, consent withdrawal, automated decision-making with/without AI, EU representative, COPPA children's privacy, data protection section, monitoring provider names, changes/contact sections, comprehensive service combination, legitimate interest details, previous version URL, effective date
  - `src/generator/terms-of-service.test.ts` (21 tests): title/project name, effective date, context values/placeholders, standard sections (agreement/description/accounts/acceptable use), IP/disclaimer/liability/indemnification, dispute resolution/governing law, jurisdiction override, AI section presence/absence, payment section presence/absence, user content section presence/absence, SLA section presence/absence, privacy/termination/changes/force majeure, general provisions/contact, class action waiver, comprehensive service combination, sequential section numbering
  - `src/generator/cookie-policy.test.ts` (25 tests): null return for no analytics/auth, null for empty services, null for database/email only, generation with analytics, generation with auth, what-are-cookies section, legal basis, consent section, CSRF token, session/auth cookies, PostHog/Google Analytics/Mixpanel cookie details, opt-out URLs, managing cookies, third-party cookies listing, GPC section, updates/contact, context company/email, placeholder email, date format, multiple analytics services, advertising services, combined analytics+auth, sequential section numbering
- **Generator modules now with tests** (8 total): access-control-policy, change-management, customization, data-dictionary, env-example, executive-briefing, generator, privacy-policy, terms-of-service, cookie-policy
- **Generator modules still missing tests**: 123 files (was 126)

### Iteration 4 — 2026-03-16
- **Build**: pass
- **Tests**: 1059/1059 passing (was 926, added 133 new tests)
- **Failing tests**: none
- **Tests added this iteration**:
  - `src/generator/ai-disclosure.test.ts` (56 tests): classifyAIRisk — minimal/limited/high classification, high-risk patterns (biometric, facial recognition, credit scoring, hiring, healthcare diagnosis), user-facing patterns (user prompts, conversation history, chatbot), high precedence over limited, context aiRiskLevel override; generateAIDisclosure — null return for no AI/empty/non-AI services, generation with AI services, project name, date format, context company name/email/DPO email/placeholder values, introduction referencing EU AI Act (2024/1689), AI systems inventory table with provider mapping (OpenAI, Anthropic), multiple AI services, aiUsageDescription, risk classification display (minimal/limited/high), risk obligations (Art. 50, conformity assessment), manual override note, transparency obligations (Art. 50, Art. 50(5) first-interaction), AI limitations, AI-generated content section (synthetic content, Art. 50(2) machine-readable marking), data processing table, data retention, cross-border transfers (SCC), human oversight, user rights (opt out, lodge complaints), provider policy links (OpenAI, Anthropic), provider deduplication, compliance checklist, high-risk checklist items presence/absence, contact section, sequential section numbering, legal disclaimer
  - `src/generator/dpa.test.ts` (36 tests): null return for no processor-category/empty/database-only services, generation with AI/analytics/email/payment/monitoring services, context company name/email/placeholder values, date format, project name, GDPR Article 28 reference, subject matter/duration section, nature/purpose section, personal data types with/without data categories, fallback text for empty categories, data subjects section, processor obligations (Art. 32), sub-processors table with service details, multiple sub-processors, sub-processor engagement rules, international data transfers (SCC), security measures (encryption, access controls), breach notification (72 hours, Art. 33/34), return/deletion, controller rights (audit), governing law, contact, legal disclaimer, non-processor service exclusion from table
  - `src/generator/incident-response.test.ts` (41 tests): always generates (never null) with empty/no/database-only services, context company name/email/security email/DPO name/DPO email/website/placeholder values, security email fallback to contact email, date format, incident classification table (P1-P4 severity, response times), detection/reporting procedures, GDPR 72-hour notification (Art. 33, timeline milestones T=0/T+24/T+72), authority notification template with company name, user notification template with company name, investigation procedures (containment, root cause, audit trails), remediation steps, post-incident review (5 business days, root cause analysis), contact list table, conditional AI incident handling (prompt injection, bias, hallucination, disable/throttle, notify AI provider), conditional PCI DSS section (cardholder data, 24 hours, PAN breach checklist), conditional HIPAA section (60 days, HHS, breach assessment, re-identification, low probability), all three conditional sections together, section numbering for conditional sections (10/11/12), legal disclaimer with project name
- **Generator modules now with tests** (11 total): access-control-policy, change-management, customization, data-dictionary, env-example, executive-briefing, generator, privacy-policy, terms-of-service, cookie-policy, ai-disclosure, dpa, incident-response
- **Generator modules still missing tests**: 120 files (was 123)

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

### 2026-03-16 — Blog index page and EU AI Act post improvements

**Blog index page (`src/app/blog/page.tsx`):**
- Created blog index page listing all 4 blog posts with title, description, date, read time, and category tag
- Added Blog JSON-LD structured data (schema.org Blog with BlogPosting entries)
- Added meta tags: title, description, canonical URL, OpenGraph, Twitter card
- Includes CTA section with `npx codepliant go` command
- Added Blog link to site navigation header (layout.tsx)
- Added `/blog` to sitemap.ts (priority 0.8, weekly changeFrequency)

**EU AI Act blog post improvements (`src/app/blog/eu-ai-act-deadline/page.tsx`):**
- Added urgency callout box at top with deadline reminder and inline CTA
- Added breadcrumb navigation (Home / Blog / EU AI Act Deadline)
- Added table of contents with anchor links to all 10 sections
- Added new section "Detecting AI services in your codebase" with:
  - Table of all AI providers Codepliant detects (OpenAI, Anthropic, Google AI, LangChain, Vercel AI SDK, Cohere, Together AI, Replicate) with package names and env vars
  - Code example: running `npx codepliant go` with realistic terminal output showing detected AI services
  - Code example: JSON output with `--json` flag and jq filtering for AI services
  - Code example: GitHub Actions workflow for CI/CD compliance gate
  - Description of generated `ai-disclosure.md` contents
- Added 2 new FAQ JSON-LD entries (total 5): "How can I check if my codebase uses AI services" and "What is Article 50"
- Added SEO keywords meta tag (10 keywords)
- Added OpenGraph publishedTime, modifiedTime, authors, tags
- Added breadcrumb JSON-LD structured data
- Improved CTA section: brand-colored background, lists detected AI providers, links to GitHub/npm/docs
- Added internal links to: GDPR blog post, AI Governance page, AI Disclosure Generator page, Colorado AI Act post
- Updated color classes from generic (text-muted, bg-surface) to theme tokens (text-ink-secondary, bg-surface-secondary)
- Updated read time from 12 min to 14 min (content expanded significantly)
- Updated dateModified to 2026-03-16

**Build verification:**
- `next build` passes cleanly, all 25 static pages generated (was 24, added /blog)

### 2026-03-16 — GDPR blog post improvements (Iteration 4)

**GDPR blog post improvements (`src/app/blog/gdpr-for-developers/page.tsx`):**
- Added table of contents with 9 anchor-linked sections
- Added new section "Detecting GDPR-relevant services with Codepliant" with:
  - Code example: `npx codepliant go` terminal output showing detected analytics, payments, auth, error tracking, email, database, and AI services
  - Code example: GDPR-relevant detection patterns (dependency names, import patterns, env vars) across 5 categories
  - Code example: `npx codepliant scan --json` output showing structured service data with categories and detection methods
- Added new section "Common GDPR mistakes developers make" with 7 detailed mistake cards:
  - Adding npm packages without checking data implications
  - Logging personal data in plain text
  - Treating anonymization as trivial
  - Forgetting about backups in deletion flows
  - Using Google Fonts/CDN scripts without consent
  - No data retention policy in code
  - Collecting data "just in case"
- Added FAQ JSON-LD structured data (2 entries: detecting GDPR services, common mistakes)
- Added breadcrumb JSON-LD structured data
- Added SEO keywords meta tag (15 keywords)
- Added OpenGraph publishedTime, modifiedTime, authors, tags
- Improved CTA: "Check your GDPR compliance now" with `npx codepliant go` command and link to docs
- Added internal links to: EU AI Act blog post, Colorado AI Act blog post, Privacy Policy Generator, Cookie Policy Generator, AI Disclosure Generator, AI Governance Hub, Data Privacy Hub, docs page
- Added CodeBlock component (matching EU AI Act post pattern) for formatted code examples
- Updated related resources to include EU AI Act and Colorado AI Act blog posts
- Updated "Blog" breadcrumb to be a clickable link
- Updated read time from 15 min to 20 min (content expanded significantly)

**Build verification:**
- `next build` passes cleanly, all 25 static pages generated

### 2026-03-16 — Privacy Policy for SaaS blog post improvements (Iteration 5)

**Privacy Policy for SaaS blog post improvements (`src/app/blog/privacy-policy-for-saas/page.tsx`):**
- Added table of contents with 10 anchor-linked sections (scroll-mt-24 for sticky nav offset)
- Added breadcrumb navigation (Home / Blog / Privacy Policy for SaaS)
- Added new section "GDPR Article 13 checklist" with 12 interactive checkbox items covering all Art. 13(1) and Art. 13(2) required disclosures
- Added new section "Detecting services and generating a privacy policy with Codepliant" with:
  - Code example: `npx codepliant go` terminal output showing 8 detected services (Stripe, PostHog, GA, NextAuth, Sentry, Resend, OpenAI, Prisma)
  - Code example: `npx codepliant scan --json | jq` showing structured service data with categories and dataCollected arrays
  - Code example: GitHub Actions workflow (`.github/workflows/compliance.yml`) for CI/CD compliance document regeneration
- Added CodeBlock component (matching GDPR/EU AI Act post pattern) for formatted code examples with filenames
- Added FAQ JSON-LD structured data (5 entries: GDPR requirements, generating from codebase, SaaS necessity, update frequency, controller vs processor)
- Added breadcrumb JSON-LD structured data
- Added SEO keywords meta tag (12 keywords)
- Added OpenGraph publishedTime, modifiedTime, authors, tags
- Improved CTA section: added links to GitHub, npm, docs, and Privacy Policy Generator page
- Added internal links to: GDPR for Developers blog, EU AI Act blog, Colorado AI Act blog, AI Governance hub, AI Disclosure Generator, Cookie Policy Generator, Privacy Policy Generator, Data Privacy hub
- Updated related resources: added EU AI Act, Colorado AI Act, and GDPR blog posts
- Updated read time from 14 min to 18 min (content expanded significantly)

**Build verification:**
- `next build` passes cleanly, all 25 static pages generated

### 2026-03-16 — Colorado AI Act blog post improvements (Iteration 6)

**Colorado AI Act blog post improvements (`src/app/blog/colorado-ai-act/page.tsx`):**
- Added table of contents with 10 anchor-linked sections (scroll-mt-24 for sticky nav offset)
- Added breadcrumb navigation (Home / Blog / Colorado AI Act)
- Added urgency callout box at top with compliance deadline reminder and inline `npx codepliant go` CTA
- Added new section "Detecting AI services in your codebase" with:
  - Table of 8 AI providers Codepliant detects (OpenAI, Anthropic, Google AI, LangChain, Vercel AI SDK, Cohere, Together AI, Replicate) with package names and env vars
  - Code example: `npx codepliant go` terminal output showing detected AI services and generated documents
  - Code example: `npx codepliant scan --json | jq` filtered for AI/ML services with structured output
  - Code example: GitHub Actions workflow (`.github/workflows/compliance.yml`) for CI/CD compliance automation
- Added NIST AI RMF detail to affirmative defense section (four core functions: Govern, Map, Measure, Manage)
- Added "Data privacy overlap" row to Colorado vs EU AI Act comparison table
- Added FAQ JSON-LD structured data (5 entries: effective date, extraterritorial scope, high-risk definition, NIST affirmative defense, detecting AI services)
- Added breadcrumb JSON-LD structured data
- Added SEO keywords meta tag (12 keywords)
- Added OpenGraph publishedTime, modifiedTime, authors, tags
- Improved CTA section: brand-colored background, lists detected AI providers, links to GitHub/npm/docs
- Added CodeBlock component (matching EU AI Act/GDPR/Privacy post pattern) for formatted code examples
- Added internal links to: EU AI Act blog, GDPR blog, Privacy Policy for SaaS blog, AI Disclosure Generator, AI Governance hub, Data Privacy hub
- Updated related resources: added GDPR blog, Privacy Policy blog posts
- Updated color classes from generic (text-muted, bg-surface, text-foreground) to theme tokens (text-ink-secondary, bg-surface-secondary, text-ink)
- Updated title to include "(SB 24-205)" for SEO
- Updated read time from 14 min to 18 min (content expanded significantly)

**Build verification:**
- `next build` passes cleanly, all 25 static pages generated

### 2026-03-16 — Compare page overhaul (Iteration 7)

**Compare page improvements (`src/app/compare/page.tsx`):**
- Added Vanta as 4th competitor column (was Codepliant vs Termly vs Iubenda, now includes Vanta)
- Updated all pricing data from PROGRESS.md research: Termly $14-20/mo (~10 doc types, 28 privacy laws), Iubenda (150K+ clients, from $29/yr), Vanta ($10,000+/yr core, up to $80K/yr, 30+ frameworks, 300+ integrations)
- Updated document count from "35+" to "120+" across all content and JSON-LD to match current PROGRESS.md status
- Added "pricing gap" visualization section showing Codepliant's position between form wizards ($14-20/mo) and enterprise GRC ($10K+/yr)
- Added quick summary boxes for all 4 competitors at top of page
- Added Vanta-specific FAQ entries ("How does Codepliant compare to Vanta?" and "Does Codepliant replace Vanta or Drata?")
- Added highlight rows in comparison table for Codepliant's key differentiators (code scanning, open source, self-hosted, AI Act, pricing)
- Added new comparison rows: Compliance Frameworks, Self-Hosted/Offline, Target User
- Added "$0 vs $10,000+/year" section explaining Vanta pricing tiers (Core $10K, Plus $15-30K, Growth $30K+, Scale $80K+, add-ons)
- Added Vanta "when to use" section with specific use cases and budget requirements
- Updated color tokens from legacy classes (text-muted, text-foreground, bg-surface, text-accent) to proper theme tokens (text-ink-secondary, text-ink, bg-surface-secondary, text-brand)
- Added breadcrumb navigation (Home / Compare) with breadcrumb JSON-LD
- Added SEO keywords meta tag (9 keywords targeting comparison search queries)
- Updated meta title, description, and OG tags to include Vanta
- Enhanced CTA section with links to docs, GitHub, and npm
- Added AI Governance Hub to related pages section
- Changed internal links from `<a>` tags to Next.js `<Link>` components for client-side navigation
- Widened max-width from 680px to 900px to accommodate 5-column comparison table

**Build verification:**
- `next build` passes cleanly, all 25 static pages generated

### 2026-03-16 — Changelog page overhaul (Iteration 8)

**Changelog page improvements (`src/app/changelog/page.tsx`):**
- Added v1.0.0 release (2026-03-16) with "Latest" tag: 120+ document types, 10+ ecosystems, 200+ service signatures, MCP server, plugin system, monorepo support
- Added v1.1.0 upcoming release with "Upcoming" tag: wizard command, SBOM generation, Terraform/IaC scanner, Django settings.py scanner, Flutter/Dart support, Impressum generator, npm size reduction, test suite expansion (763 to 1,367)
- Introduced categorized change system with four categories: New (green), Improved (blue), Tests (purple), Fix (amber) — each with colored badge
- Added `CategoryBadge` and `VersionBadge` components for visual differentiation
- Added summary text for major releases (v1.0.0 and v1.1.0) below version header
- "Upcoming" releases get purple dot with ring effect; "Latest" gets brand dot with ring; older releases get plain dot
- Added legend bar showing all four category badges below page header
- Added anchor IDs (`#v1.0.0`, `#v1.1.0`, etc.) to each release section with `scroll-mt-24`
- Added "Stay up to date" CTA card at bottom with GitHub star link and SVG icon
- Widened max-width from 680px to 720px for better badge layout
- Updated all color tokens to use `text-ink-secondary`, `bg-surface-secondary`, `border-border-subtle` theme tokens
- All existing releases (v0.1.0 through v0.8.0) preserved with categorized changes

**Build verification:**
- `next build` passes cleanly, all 25 static pages generated

## Website Design

### Iteration 3 — 2026-03-16 — Hero section and CTA improvements

**Competitive analysis** (Termly, Vanta):
- Both use benefit-focused headlines ("All-In-One Compliance Solution", "A higher state of trust")
- Both have prominent trust signals: Termly shows "1,800+ policies daily, 2M businesses"; Vanta shows "15,000+ customers" with brand logos
- Both use primary + secondary CTA pattern (Termly: "Start Building Compliance"; Vanta: "Request a demo" + "Explore")
- Both display compliance framework badges as social proof

**Changes made to homepage hero (`src/app/page.tsx`)**:
- Headline changed from problem-focused ("Your app collects user data. Where are your legal docs?") to benefit-focused ("Ship compliant software without the legal bills.")
- Subheadline rewritten to emphasize the single-command value prop and that documents are tailored to actual code
- `npx codepliant go` command given its own prominent block with dark background, larger font, dollar-sign prompt, and helper text ("Click to select, then copy. No account or API key needed.")
- Primary CTA changed from "View on GitHub" to "Get started" (more action-oriented)
- Added secondary CTA "See example output" linking to `#example-output` anchor (with downward arrow icon)
- npm package link retained as tertiary CTA
- Added `id="example-output"` and `scroll-mt` to the example output section for smooth anchor scrolling

**Trust signals added below hero**:
- New row of four trust badges with green checkmark icons: "Zero network calls", "MIT Licensed", "No runtime dependencies", "1,200+ repos tested"
- Key metrics retained below trust badges, now centered for better visual hierarchy
- Test count updated from 763 to 835 to match current PROGRESS.md status

**Build verification:**
- `next build` passes cleanly, all pages generated successfully

### Iteration 4 — 2026-03-16 — Social proof / credibility section

**New section added to homepage** (`src/app/page.tsx`) between trust signals and "Before / After", before "How it works":

1. **Key stats grid** (2x2 on mobile, 4-col on desktop): "926 tests passing", "1,200+ repos scanned", "120+ documents", "10+ ecosystems" — large display numbers with tertiary labels beneath each.

2. **Supported ecosystems row**: "Works with your stack" label + pill-style tags for TypeScript, Python, Go, Ruby, Rust, Java, PHP, Swift, Kotlin, and Terraform. Uses border + surface-secondary styling consistent with the site's design system.

3. **Callout quote** with left brand-colored border: "Every document mentions your actual services by name. Not 'third-party analytics' — it says PostHog because it found PostHog in your code." — italicized blockquote format.

**Build verification:**
- `next build` passes cleanly, all pages generated successfully

### Iteration 5 — 2026-03-16 — Footer redesign

**Changes made to footer (`src/app/layout.tsx`)**:

1. **Footer CTA** — Added a centered call-to-action block at the top of the footer with `npx codepliant go` in a dark monospace block, plus helper text ("No account needed. No API key. Works offline.").

2. **Reorganized columns** into four clear categories:
   - **Product**: Documentation, Pricing, Compare, Get Started
   - **Resources**: Blog, Changelog, GitHub, npm
   - **Legal**: Privacy Policy, Terms of Service, Data Privacy, GDPR
   - **Company**: About, Open Source

3. **Badges row** — Added two pill-style badges with green checkmark icons in the bottom bar: "MIT Licensed" and "Zero network calls".

4. **Bottom bar layout** — Changed from single-line copyright to a flex row with badges on the left and copyright on the right (stacks vertically on mobile).

5. **Nav bar** — Not modified (preserved iteration 3 QA fixes).

6. **page.tsx** — Not modified.

**Removed from old footer**: Generators column and Compliance column (links are accessible from the main pages and nav). Consolidated into the four standard SaaS footer columns.

**Build verification:**
- `next build` passes cleanly, 25/25 static pages generated successfully

### Iteration 6 — 2026-03-16 — Docs page overhaul

**Replaced stub docs page** (`src/app/docs/page.tsx`) with a comprehensive getting-started guide:

1. **Table of contents** — Nav with six anchor links (Quick Start, Configuration, CLI Commands, Output Formats, MCP Server, FAQ) using the site's `surface-secondary` card style.

2. **Quick Start section** — Three numbered steps: (1) `npx codepliant go`, (2) generated file tree preview, (3) `codepliant init` for optional config. Code blocks use `code-bg`/`code-fg` with dollar-sign prompt styling matching the homepage.

3. **Configuration section** — Full `.codepliantrc.json` example with tabbed file-header style. Reference table of all 17 config fields with field name, type, and description sourced from `CodepliantConfig` interface in `src/config.ts`.

4. **CLI Commands section** — Three sub-sections: Generation (go, sbom, update, export, report), Scanning and Analysis (scan, check, dashboard, diff, audit, lint), Setup (init, wizard, config show, hook install). Each command in a bordered card. Common flags table (--output, --format, --json, --quiet, --ci).

5. **Output Formats section** — Table of 8 formats (Markdown, HTML, PDF, JSON, Notion, Confluence, DOCX, All) with flag, description, and free/Pro indicator.

6. **MCP Server section** — Setup instructions for Claude Code (`.claude/mcp_servers.json`) and Cursor (`.cursor/mcp.json`) with JSON config blocks. Lists 4 MCP tools (codepliant_scan, codepliant_go, codepliant_get_config, codepliant_set_config). Notes stdio transport.

7. **FAQ section** — Eight questions: zero network calls, no account required, production readiness, supported ecosystems, deterministic detection, 120+ document types, keeping docs updated, customization.

8. **Bottom CTA** — Centered card with `npx codepliant go`, consistent with footer CTA.

**Design consistency**: All spacing uses `--space-*` variables, typography uses `--text-*` fluid clamp variables, colors use design system tokens, code blocks match homepage dark style, tables match homepage style, transitions use `--ease-out-quart`.

**Build verification:**
- `next build` passes cleanly, 25/25 static pages generated successfully

### Iteration 7 — 2026-03-16 — Pricing page update

**Pricing model updated** (`src/app/pricing/page.tsx`) per iteration 4 research recommendation (Free/$19 Pro/$49 Team):

**Plan changes:**
- **Free** ($0): CLI scanning, Markdown output, up to 5 document types, 10+ ecosystems, 8 ORM scanners, 4 languages, community support
- **Pro** ($19/mo, was $29): Unlimited document types, HTML/PDF/DOCX/JSON output, `codepliant diff` change detection, Notion & Confluence export, CI/CD GitHub Action, custom branding & templates, priority email support
- **Team** ($49/mo, was $79): Everything in Pro + team dashboard, multi-project scanning (`scan-all`), webhook notifications, custom compliance templates, shared template library, SSO/SAML, dedicated support with SLA

**Layout changes:**
- Switched from stacked single-column cards to a 3-column grid layout (`grid-cols-1 md:grid-cols-3`) for side-by-side plan comparison
- Pro card highlighted with "Most Popular" badge (absolute positioned pill above card), `scale-[1.02]` lift, and `bg-brand` background
- Added SVG checkmark icons (stroke-based) replacing plain Unicode checkmarks, colored `text-brand` for Free/Team and white for Pro
- Added horizontal divider between plan header and feature list for visual separation
- Features displayed as single-column list (was 2-column grid) for better readability in narrower cards
- Added annual savings note below pricing cards ("Save up to 34% with annual billing")

**FAQ section expanded:**
- Renamed heading from "Questions" to "Frequently Asked Questions"
- Expanded from 4 to 8 questions in a 2-column grid layout (`grid-cols-1 md:grid-cols-2`)
- New questions: "What does codepliant diff do?", "Do you offer annual billing?" ($149/yr Pro, $399/yr Team), "What happens if I exceed 5 document types on Free?", "Can I self-host the Team dashboard?"
- Updated existing answers to reflect new pricing and feature set

**SEO metadata updated:**
- Meta description, OpenGraph, and Twitter card text updated from $29/$79 to $19/$49

**Note:** Old $29/$79 prices still referenced on homepage (`src/app/page.tsx`) and compare page (`src/app/compare/page.tsx`) — not updated per task scope (pricing page only). Should be updated in a follow-up iteration.

**Build verification:**
- `next build` passes cleanly, 25/25 static pages generated successfully

### Iteration 8 — 2026-03-16 — About page overhaul

**Rewrote the About page** (`src/app/about/page.tsx`) to tell the Codepliant story with concrete details from the project:

1. **Mission statement** — Lead paragraph changed to the core mission: "Every developer should have access to accurate compliance documents without paying thousands for lawyers." Body copy explains the three bad options developers face today (generic templates, expensive lawyers, skipping compliance) and why Codepliant exists.

2. **How it works section** (new) — Explains the code-scanning approach: CLI reads dependencies, imports, env vars, and config files to detect actual services. Contrasts with questionnaire-based tools. Includes the "Not 'third-party analytics' — it says PostHog because it found PostHog in your code" line.

3. **Key principles section** (replaced "What we believe") — Four cards covering the project's technical commitments:
   - Zero network calls — everything local, no telemetry
   - Open source — MIT licensed, full transparency
   - Deterministic scanning — no AI/LLMs in the scanning pipeline, pattern matching only
   - Developer experience — one command, zero config, no questionnaires

4. **By the numbers section** (new) — 2x4 stats grid with current project metrics: 1,367 tests passing, 1,200+ repos tested, 121+ document types, 11 ecosystems. Stats displayed in `text-brand` for visual emphasis.

5. **Open source commitment section** (new) — Dedicated section explaining MIT license, public availability of all scanning code and generators, and invitation for contributions (scanner signatures, document types, ecosystem support, docs, bug reports).

6. **Get involved section** (replaced "Contribute") — Two CTAs side by side: "View on GitHub" (primary brand button) and "Contributing guide" (secondary outlined button linking to CONTRIBUTING.md). Includes inline `npx codepliant go` code snippet.

7. **Team section** — Retained from previous version, unchanged.

**SEO metadata updated:**
- Meta description updated to include the mission statement
- OpenGraph and Twitter descriptions updated to mention code scanning approach and key principles

**Design consistency:** All styling uses existing design tokens (`text-ink-secondary`, `bg-surface-secondary`, `text-brand`, `bg-code-bg`, `text-code-fg`, `border-border`, `--ease-out-quart`). No new CSS classes or custom styles introduced.

**Build verification:**
- `next build` passes cleanly, 25/25 static pages generated successfully

## Website QA

### Iteration 3 — 2026-03-16 — Playwright audit

**Test scope**: 19 pages audited via Playwright (headless Chromium) at `http://localhost:5001`:
`/`, `/pricing`, `/about`, `/docs`, `/compare`, `/changelog`, `/gdpr-compliance`, `/soc2-compliance`, `/hipaa-compliance`, `/ai-governance`, `/data-privacy`, `/blog/eu-ai-act-deadline`, `/blog/gdpr-for-developers`, `/blog/privacy-policy-for-saas`, `/blog/colorado-ai-act`, `/ai-disclosure-generator`, `/cookie-policy-generator`, `/privacy-policy-generator`, `/terms-of-service-generator`

**Results (all passing after fixes):**
- **Broken pages**: 0/19 — all return HTTP 200
- **Broken images**: 0 across all pages
- **Empty `<h2>` sections**: 0 across all pages
- **Mobile overflow (375px viewport)**: 0/19 after fixes (was 19/19 before)
- **Broken internal links**: 0 — all homepage links resolve correctly
- **404 pages**: 0

**Bugs found and fixed:**

1. **Mobile overflow on all 19 pages** — The nav bar (`<nav>` in `layout.tsx`) had 5 links + logo in a horizontal flex row with `gap: 24px` and `padding: 24px`. On a 375px viewport, the content width was 411px, causing horizontal scroll on every page.
   - **Fix** (`src/app/layout.tsx`): Reduced gap from `space-6` (24px) to `space-3` (12px) on mobile (`gap-[var(--space-3)] md:gap-[var(--space-6)]`), reduced padding (`px-[var(--space-4)] md:px-[var(--space-6)]`), added `overflow-x-hidden` to nav, hid "Changelog" and "About" links on small screens (`hidden sm:inline`), added `shrink-0` to logo.

2. **Comparison table overflow on `/compare`** — The 4-column comparison table (`<table>`) was 392px wide with a container using `-mx-6 px-6` that extended outside the page boundary, causing 404px scrollWidth on a 375px viewport.
   - **Fix** (`src/app/compare/page.tsx`): Removed the negative margin pattern (`-mx-6 px-6`) from the table wrapper, kept `overflow-x-auto` so the table scrolls horizontally on narrow screens. Added `min-w-[520px]` to the table to ensure it remains readable and scrollable rather than compressed.

**Minor observations (not fixed — intentional):**
- "Start free trial" and "Contact sales" CTAs on the homepage pricing section use `href="#"` — placeholder links for features not yet built
- Footer links "Privacy" and "Terms" point to the generator pages (`/privacy-policy-generator`, `/terms-of-service-generator`) rather than actual Codepliant privacy/terms pages — acceptable for now since the site is pre-launch

### Iteration 4 — 2026-03-16 — Full Playwright regression + new content audit

**Test scope**: 91 tests across 20 pages (added `/blog` index page), run via Playwright headless Chromium at `http://localhost:5001`.

**Pages audited**: `/`, `/pricing`, `/docs`, `/changelog`, `/about`, `/compare`, `/blog`, `/blog/eu-ai-act-deadline`, `/blog/gdpr-for-developers`, `/blog/privacy-policy-for-saas`, `/blog/colorado-ai-act`, `/privacy-policy-generator`, `/terms-of-service-generator`, `/cookie-policy-generator`, `/ai-disclosure-generator`, `/data-privacy`, `/gdpr-compliance`, `/soc2-compliance`, `/hipaa-compliance`, `/ai-governance`

**Results: 91/91 tests passed, 0 failures, 0 bugs found.**

**Test categories:**
1. **Full route audit (20 routes)** — All return HTTP 200, no console errors
2. **Mobile nav overflow regression** — Nav fits within 375px viewport (iteration 3 fix holds)
3. **Compare table overflow regression** — No horizontal overflow at 375px (iteration 3 fix holds)
4. **Blog index page** — 4 post links rendered, h1 present, JSON-LD structured data present, meta description correct
5. **EU AI Act blog post** — h1 correct, BlogPosting JSON-LD schema present, OG title set, 24,752 chars of content
6. **Hero section (Design Agent iteration 3)** — h1 renders ("Ship compliant software without the legal bills."), command block shows `npx codepliant go`, 3 CTA buttons present, trust signals (Zero network calls, MIT Licensed, 97.8%) all visible
7. **Internal links from homepage** — 15 unique internal links found, all resolve to HTTP 200
8. **Screenshots** — Desktop (1440px, 654KB) and mobile (375px, 509KB) full-page screenshots captured; visually verified — layout is clean, no rendering artifacts, proper responsive behavior
9. **Mobile overflow all pages** — 0/20 pages overflow at 375px viewport
10. **Title tags** — All 20 pages have proper, unique `<title>` tags

**Pre-test fix**: Server was returning HTTP 500 due to stale `.next` build cache (missing `./124.js` chunk). Fixed by clearing `.next/` directory and restarting the dev server. This is a dev-mode caching issue, not a code bug.

**Screenshots**: `/tmp/codepliant-qa-4-screenshots/homepage-desktop-1440px.png`, `/tmp/codepliant-qa-4-screenshots/homepage-mobile-375px.png`

**Script**: `/tmp/codepliant-qa-4.ts` — run with `npx tsx /tmp/codepliant-qa-4.ts`

### Iteration 5 — 2026-03-16 — Performance, accessibility & social proof QA

**Test scope**: 74 checks across 6 pages (Homepage, Pricing, Docs, About, Blog, Changelog), run via Playwright headless Chromium at `http://localhost:5001`. Focused on performance, accessibility, console errors, external links, social proof section, and data consistency.

**Results: 71/74 passing after fixes (was 62/74 before fixes).**

**Test categories:**
1. **Performance — page load times** (6 pages): All pages load under 1s (Homepage 544ms, Pricing 519ms, Docs 516ms, About 516ms, Blog 517ms, Changelog 518ms). No page exceeds the 5s threshold.
2. **Console errors** (6 pages): 0 console errors across all pages after rebuild (was 500 errors on all pages before rebuild due to stale `.next` cache — same issue as iteration 4).
3. **Heading hierarchy** (6 pages): All pages have exactly one `<h1>`, heading levels are sequential (h1 -> h2 -> h3) with no skipped levels.
4. **Image alt text** (6 pages): No `<img>` elements found — site uses SVGs with `aria-hidden="true"`, which is correct.
5. **ARIA & keyboard** (6 pages): All SVGs have `aria-hidden`, all links have `href`, all buttons have accessible names. Keyboard Tab navigation works correctly — first Tab lands on "Codepliant" link, focus moves through interactive elements.
6. **Landmarks** (6 pages): All pages have `<header>`, `<nav>`, `<main>`, `<footer>` landmarks present.
7. **Color contrast** (3 pages spot-checked): No WCAG AA contrast violations detected (checked 80 text elements per page).
8. **HTML lang attribute**: Present and set to `"en"`.
9. **External links** (2 unique): GitHub link returns HTTP 200. npm link returns HTTP 403 (npm blocks automated HEAD/GET requests with bot protection — package verified to exist via `npm view codepliant`).
10. **Social proof section**: Heading "What developers are saying" present, all 3 testimonial cards rendered (Sarah Chen, Marcus Rivera, Lena Muller), all 5 ecosystem badges visible (TypeScript, Python, Go, Ruby, Rust).
11. **Data consistency**: Test count discrepancy fixed (see bugs below).

**Bugs found and fixed:**

1. **Inconsistent test counts on homepage** — The "Trust signals" section displayed "835 tests passing" while the "Social proof" section displayed "926 tests passing". Both were outdated; PROGRESS.md reports 1,059 tests.
   - **Fix** (`src/app/page.tsx`): Updated both counts to "1,059" to match current test suite size.

2. **Stale `.next` build cache causing HTTP 500 on all routes** — Same issue as iteration 4. The dev server's cached build had a missing `./124.js` webpack chunk, causing `Cannot find module './124.js'` errors on every page load.
   - **Fix**: Cleared `.next/` directory and rebuilt with `npx next build`. Restarted server with `npx next start -p 5001`.

**Not fixed (acceptable):**
- **No skip-to-content link** — Recommended for keyboard users but not a requirement. Can be added in a future iteration.
- **npm external link returns 403** — npm.com blocks non-browser requests. The package exists (verified via `npm view codepliant`). Link works correctly in a real browser.

**Script**: `/tmp/codepliant-qa-5.ts` — run with `npx tsx /tmp/codepliant-qa-5.ts`

### Iteration 6 — 2026-03-16 — Link validation & content consistency

**Test scope**: Manual audit of all 20 pages plus source code review, focused on link validation, footer links, blog post structure consistency, social proof data accuracy, and placeholder text detection.

**Pages audited**: `/`, `/pricing`, `/docs`, `/changelog`, `/about`, `/compare`, `/blog`, `/blog/eu-ai-act-deadline`, `/blog/gdpr-for-developers`, `/blog/privacy-policy-for-saas`, `/blog/colorado-ai-act`, `/privacy-policy-generator`, `/terms-of-service-generator`, `/cookie-policy-generator`, `/ai-disclosure-generator`, `/data-privacy`, `/gdpr-compliance`, `/soc2-compliance`, `/hipaa-compliance`, `/ai-governance`

**Results: All issues fixed. Build passes cleanly, all 25 static pages generated.**

**Checks performed:**
1. **All pages return HTTP 200** — Verified all 20 routes respond correctly.
2. **Footer links** — All 14 footer links verified: Product (Documentation, Pricing, Compare, Get Started all resolve to valid internal pages), Resources (Blog, Changelog resolve internally; GitHub and npm point to correct external URLs), Legal (Privacy Policy, Terms of Service, Data Privacy, GDPR all resolve to valid internal pages), Company (About resolves internally; Open Source points to GitHub). All internal links return 200.
3. **Blog post structure consistency** — Audited all 4 blog posts for breadcrumbs, TOC, and CTA:
   - EU AI Act: Has visible breadcrumb nav, breadcrumb JSON-LD, TOC ("In this guide"), CTA section. Consistent.
   - Privacy Policy for SaaS: Has visible breadcrumb nav, breadcrumb JSON-LD, TOC ("Table of contents"), CTA section. Consistent.
   - GDPR for Developers: Had breadcrumb JSON-LD and TOC but was missing visible breadcrumb nav. Fixed.
   - Colorado AI Act: Had breadcrumbJsonLd() function defined but never rendered. Missing visible breadcrumb nav and missing TOC. Fixed.
4. **Social proof numbers** — PROGRESS.md reports 1,166 tests, 1,200+ repos, 120+ document types. Homepage was showing stale "1,059 tests passing" in two places. Updated to "1,166". Repos (1,200+) and documents (120+) were already correct.
5. **Placeholder text scan** — Searched all page source files for `[Your Company]`, `lorem ipsum`, `TODO`, `FIXME`, and `href="#"`. No placeholder content found in site copy. The only `href: "#"` instances are the "Start free trial" and "Contact sales" pricing CTAs (documented as intentional since iteration 3). "acme-saas" and "Acme Inc." appear only in example code snippets.

**Bugs found and fixed:**

1. **Stale test count on homepage** — Trust signals section and social proof section both displayed "1,059 tests passing". PROGRESS.md reports 1,166 tests after iteration 5.
   - **Fix** (`src/app/page.tsx`): Updated both occurrences from "1,059" to "1,166".

2. **Colorado AI Act blog post missing visible breadcrumb nav** — The other 3 blog posts have a visible Home / Blog / Title breadcrumb navigation, but the Colorado AI Act post only had "Blog" as static text with no nav element.
   - **Fix** (`src/app/blog/colorado-ai-act/page.tsx`): Added `<nav aria-label="Breadcrumb">` with Home / Blog / Colorado AI Act links, plus rendered the existing `breadcrumbJsonLd()` function in a `<script type="application/ld+json">` tag.

3. **Colorado AI Act blog post missing table of contents** — The other 3 blog posts all have a TOC section. The Colorado AI Act post had none.
   - **Fix** (`src/app/blog/colorado-ai-act/page.tsx`): Added a TOC nav with 9 section links. Added `id` attributes to all 9 `<h2>` elements so the TOC anchor links resolve correctly.

4. **GDPR for Developers blog post missing visible breadcrumb nav** — Had breadcrumb JSON-LD and a "Blog" link at top, but not the full Home / Blog / Title breadcrumb pattern used by the other posts.
   - **Fix** (`src/app/blog/gdpr-for-developers/page.tsx`): Added `<nav aria-label="Breadcrumb">` with Home / Blog / GDPR for Developers links.

**Not fixed (acceptable):**
- **"Start free trial" and "Contact sales" CTAs use `href: "#"`** on homepage and `/pricing` — Placeholder links for features not yet built. Documented since iteration 3.
- **Footer "Privacy Policy" and "Terms of Service" point to generator pages** — Acceptable for pre-launch site, documented since iteration 3.
- **No skip-to-content link** — Documented since iteration 5.

### Iteration 7 — 2026-03-16 — SEO & structured data validation

**Test scope**: 50 Playwright tests across all 20 pages, focused exclusively on SEO and structured data. Run via `npx playwright test tests/seo-audit.spec.ts` at `http://localhost:5001`.

**Results: 50/50 tests passed, 0 failures, 0 bugs found.**

**Test categories:**
1. **SEO meta tags (20 pages)** — Every page verified for: `<title>` tag (non-empty), `<meta name="description">` (>20 chars), `<link rel="canonical">` (https://codepliant.dev/...), `og:title`, `og:description`, `og:url`, `og:image`. All 20 pages pass all 7 checks.
2. **JSON-LD structured data — homepage (3 tests)** — SoftwareApplication schema (name, offers array), Organization schema (name, sameAs), BreadcrumbList schema. All present and valid.
3. **JSON-LD structured data — blog posts (4 tests)** — All 4 blog posts (`eu-ai-act-deadline`, `gdpr-for-developers`, `privacy-policy-for-saas`, `colorado-ai-act`) have Article JSON-LD with headline and datePublished.
4. **Sitemap completeness (1 test)** — `/sitemap.xml` contains all 20 page URLs and exactly 20 `<url>` entries. No pages missing.
5. **robots.txt (1 test)** — Contains `User-Agent: *`, `Allow: /`, and `Sitemap: https://codepliant.dev/sitemap.xml`.
6. **No duplicate title tags (1 test)** — All 20 pages have unique `<title>` values. No duplicates.
7. **Heading hierarchy (20 pages)** — Every page has exactly 1 `<h1>`. Heading levels are sequential (no jumps from h1 to h3 without h2). All 20 pages pass.

**Bugs found**: None. All SEO foundations are solid across all 20 pages.

**Notable observations:**
- Two pages (`cookie-policy-generator`, `privacy-policy-generator`) have minimal OG tags (no twitter card) but inherit from layout defaults — acceptable.
- `docs` page has no explicit OG tags beyond what the layout provides — inherits correctly from the root layout metadata.
- All blog posts have full OG article metadata including `publishedTime`, `modifiedTime`, and `authors`.

**Script**: `codepliant-site/tests/seo-audit.spec.ts` — run with `npx playwright test tests/seo-audit.spec.ts`

### Iteration 8 — 2026-03-16 — Cross-page consistency audit

**Test scope**: Source code review of all 20 page files in `codepliant-site/src/app/`, focused on color token consistency, pricing consistency, test count consistency, CTA button styling, and footer rendering.

**Results: 3 categories of inconsistency found and fixed. Build passes cleanly.**

**1. Legacy color tokens replaced across 15 pages:**

The homepage, layout, docs, blog index, compare, and eu-ai-act-deadline pages used the correct design tokens (`text-ink-secondary`, `bg-surface-secondary`, `text-ink`). However, 15 other pages still used legacy tokens that are not defined in the design system and would render incorrectly or fall back to browser defaults:

- `text-muted` -> `text-ink-secondary` (all 15 pages)
- `bg-surface` (without suffix) -> `bg-surface-secondary` (all 15 pages)
- `text-foreground` -> `text-ink` (4 pages: ai-disclosure-generator, blog/gdpr-for-developers, blog/privacy-policy-for-saas, blog/colorado-ai-act)
- `text-accent` -> `text-brand` (1 page: blog/privacy-policy-for-saas)

Files fixed: `pricing/page.tsx`, `about/page.tsx`, `changelog/page.tsx`, `terms-of-service-generator/page.tsx`, `privacy-policy-generator/page.tsx`, `cookie-policy-generator/page.tsx`, `ai-disclosure-generator/page.tsx`, `data-privacy/page.tsx`, `ai-governance/page.tsx`, `hipaa-compliance/page.tsx`, `soc2-compliance/page.tsx`, `gdpr-compliance/page.tsx`, `blog/colorado-ai-act/page.tsx`, `blog/gdpr-for-developers/page.tsx`, `blog/privacy-policy-for-saas/page.tsx`

Additionally, the pricing page used raw Tailwind colors (`text-white`, `bg-white`, `hover:bg-gray-100`) instead of design tokens. Fixed to use `text-surface-primary`, `bg-surface-primary`, `hover:bg-surface-secondary` for dark mode compatibility. Non-highlighted pricing cards changed from `bg-surface-secondary` to `bg-surface-primary` to match homepage pricing card styling.

**2. Pricing inconsistency fixed on homepage and compare page:**

The pricing page correctly showed $19/$49 (updated in iteration 7). However, the homepage and compare page still showed the old $29/$79 prices:

- `src/app/page.tsx`: JSON-LD offers ($29/$79 -> $19/$49), plans array ($29/$79 -> $19/$49), comparison text ("$29/mo for teams" -> "$19/mo for teams")
- `src/app/compare/page.tsx`: FAQ answer ($29/$79 -> $19/$49), feature table pricing row ($29/mo -> $19/mo), pricing gap section ($29/mo -> $19/mo), pricing comparison section ($29/$79 -> $19/$49)

**3. Test count updated on homepage:**

PROGRESS.md reports 1,367 tests passing. The homepage displayed "1,166" in two places (trust signals section and social proof stats grid). Updated both to "1,367".

**4. CTA button consistency — verified, no issues:**

All pages use consistent CTA patterns:
- Primary CTA: `bg-brand hover:bg-brand-hover text-surface-primary` with `rounded-lg`
- Secondary CTA: `border border-border-subtle hover:border-brand text-ink hover:text-brand` with `rounded-lg`
- Link CTA: `text-brand hover:text-brand-hover` with arrow SVG icon
- All transitions use `transition-colors duration-150` with `--ease-out-quart`

**5. Footer rendering — verified, no issues:**

Footer is defined once in `src/app/layout.tsx` and renders on all pages via the root layout. All 14 footer links point to valid internal/external URLs. Footer uses correct design tokens throughout.

**Build verification:** `next build` passes cleanly, all 25 static pages generated successfully.

### Iteration 5 — 2026-03-16 (tests)
- **Build**: pass (pre-existing cli.ts error unrelated to test files; JS emitted successfully)
- **Tests**: 1166/1166 passing (was 1059, added 107 new tests)
- **Failing tests**: none
- **Tests added this iteration**:
  - `src/generator/soc2-checklist.test.ts` (42 tests): null return for empty/fewer-than-5/exactly-4 services, generation with exactly 5 and more than 5 services, context company name/email/placeholder values, date format, project name, overview with service count, disclaimer, service-to-control mapping table (auth→CC6, payment→C1/CC6/PI1, analytics→PI1/P1-P8), Security CC6 section (CC6.1/CC6.6/CC6.8, access controls for auth, encryption for databases, vulnerability management), Availability A1 section (A1.1/A1.2/A1.3, monitoring alerting, disaster recovery RTO/RPO, capacity planning), Processing Integrity PI1 (payment idempotency, AI validation/guardrails, change management), Confidentiality C1 (data classification, PCI DSS alignment/tokenization, TDE for databases), Privacy P1-P8 (all 8 sub-sections P1-P8, cookie consent, DPO appointment), audit timeline (gap assessment/remediation/evidence collection/Type II), evidence collection guide (artifacts for all 5 control areas), next steps, Codepliant attribution
  - `src/generator/data-retention.test.ts` (35 tests): null return for empty/fewer-than-3/exactly-2 services, generation with exactly 3 and more than 3 services, context company name/email/DPO email/placeholder values, custom dataRetentionDays, date format, project name, introduction section, retention schedule table (columns, 7-year payment, analytics period, auth until-account-deletion, GDPR Art. 6(1) basis, AI 90 days, monitoring 90 days), detailed retention by category (payment transaction history/tax compliance, auth deletion procedure/30 days), data deletion request process (how to request, what happens next, exceptions/legal holds/tax records, partial deletion), backup retention policy (daily/weekly/monthly, AES-256 encryption, disaster recovery re-applied), retention review process (quarterly/annual), contact section, Codepliant attribution/legal disclaimer
  - `src/generator/subprocessor-list.test.ts` (30 tests): null return for empty/fewer-than-3/all-self-hosted/only-2-third-party services, generation with exactly 3/more-than-3/mixed third-party+self-hosted, context company name/email/placeholder values, date format, project name, overview section, sub-processor table columns, provider name mapping (Stripe/PostHog/SendGrid), purpose descriptions, data processed from service data, US location for US providers, EU location for EU providers (Lemon Squeezy), privacy policy links, deduplication (multiple Sentry packages→one row), self-hosted exclusion (Prisma/Redis), changes-to-list section (DPA reference), how-to-object section, Codepliant attribution
- **Generator modules now with tests** (14 total): access-control-policy, change-management, customization, data-dictionary, env-example, executive-briefing, generator, privacy-policy, terms-of-service, cookie-policy, ai-disclosure, dpa, incident-response, soc2-checklist, data-retention, subprocessor-list
- **Generator modules still missing tests**: 117 files (was 120)

### Iteration 6 — 2026-03-16 (tests)
- **Build**: pass
- **Tests**: 1282/1282 passing (was 1166, added 104 new tests)
- **Failing tests**: none
- **Tests added this iteration**:
  - `src/generator/risk-register.test.ts` (33 tests): null return for empty services, generation with auth/database/payment/analytics/AI/email services, vendor risk threshold (3+ services), context company name/placeholder, date format, GDPR risk by default and with jurisdictions, GDPR likelihood varies with analytics (4 vs 3), CCPA risk inclusion/exclusion by jurisdiction, Executive Summary section (risk level counts, total), Risk Scoring Matrix section (score ranges, action levels), Risk Register table (ID/Risk/Category/Likelihood/Impact/Score/Level columns), Risk Details section (category/likelihood/impact/score fields), mitigations as checklist items, related services, RISK-NNN ID format, risk sorting by score descending, risk level labels, missing compliance documents risk (required vs recommended priority), legal disclaimer, Codepliant attribution, comprehensive test with all service categories and both GDPR+CCPA jurisdictions
  - `src/generator/vendor-contacts.test.ts` (31 tests): null return for empty/all-self-hosted/self-hosted-auth-only services, generation with single/multiple/mixed third-party services, self-hosted exclusion (Prisma/Nodemailer), context company name/email/placeholder values, date format, project name, Overview section (DSAR reference), Vendor Contact Table columns (Privacy Email/DPA/Deletion/Status/Incident), Detailed Vendor Contacts section, DSAR Quick-Reference Checklist (6 steps, 14-day follow-up), response deadlines (GDPR 30 days, CCPA 45 days), Maintaining This Document section (quarterly review), known vendor contacts (Stripe privacy email/DPA URL/status page, OpenAI, PostHog, SendGrid, Sentry, Clerk), unknown vendor placeholder fallback, package-to-provider name mapping (@anthropic-ai/sdk to Anthropic), Sentry deduplication (3 packages to 1 entry), Codepliant attribution, disclaimer about verifying contacts
  - `src/generator/executive-dashboard.test.ts` (40 tests): null return for empty services, generation with single/multiple services, context company name/placeholder, date format, project name, Regulatory Status section (5 regulations table), GDPR assessment (yellow with EU jurisdiction, Action Required with 5+ services+auth), CCPA assessment (green without analytics, Action Required with analytics+Do Not Sell), EU AI Act assessment (Not Applicable without AI, Transparency Required with AI+Art. 52, High Risk with aiRiskLevel=high), PCI DSS assessment (Not Applicable without payment, Compliance Required with payment+service name), HIPAA assessment (Not Applicable without health data, Action Required with HIPAA compliance need), Quick Stats section (data processors count excluding isDataProcessor=false, data categories count, regulation counts), Top Risks section (data breach with 3+ processors, non-compliant AI, cookie/tracking consent, payment exposure, max 3 risks), Upcoming Deadlines (annual review, GDPR DPA review, EU AI Act 2026-08-02, PCI DSS SAQ, quarterly privacy review), Recommended Actions (immediate for red, short-term for yellow, ongoing), Codepliant attribution, professional review disclaimer, links to related documents, comprehensive test with all categories
- **Generator modules now with tests** (17 total): access-control-policy, change-management, customization, data-dictionary, env-example, executive-briefing, generator, privacy-policy, terms-of-service, cookie-policy, ai-disclosure, dpa, incident-response, soc2-checklist, data-retention, subprocessor-list, risk-register, vendor-contacts, executive-dashboard
- **Generator modules still missing tests**: 114 files (was 117)

### Iteration 7 — 2026-03-16 (tests)
- **Build**: pass
- **Tests**: 1367/1367 passing (was 1282, added 66 new scanner tests + 19 flutter tests from other agent)
- **Failing tests**: none
- **Tests added this iteration**:
  - `src/scanner/environment-scanner.test.ts` (31 tests): unknown with low confidence when no env vars set, production detection (NODE_ENV=production/prod, RAILS_ENV=production, ASPNETCORE_ENVIRONMENT=Production, APP_ENV=live, GIN_MODE=release), staging detection (NODE_ENV=staging/test, FLASK_ENV=qa, MIX_ENV=test), development detection (NODE_ENV=development/dev, RACK_ENV=local, FLASK_DEBUG=1/true), Django settings module heuristics (prod/staging/dev paths), NODE_ENV priority over lower-priority vars, all signals collected even when first match wins, low confidence for unrecognized values, case-insensitive matching, isStrictEnvironment (true for production/unknown, false for staging/development), getEnvironmentComplianceNote (production/staging/development/unknown messages)
  - `src/scanner/logging-scanner.test.ts` (20 tests): console.log detection (3 call sites), winston import+usage, pino import+usage, bunyan import+usage, morgan HTTP logger, multiple logging libraries in same project, PII risk flagging (user.email, user.password, req.body.ssn, JSON.stringify(user), authorization header), no PII flags for safe messages, empty project returns empty results, project with no logging returns empty, findings capped at 100, file path and line number in findings, generateLoggingAssessment null for no libraries, assessment with detected libraries, assessment with PII findings table, PII table truncated to 25 entries
  - `src/scanner/turbo-scanner.test.ts` (15 tests): detected=false when no turbo.json, detected=false for empty directory, turbo.json v2 tasks detection, turbo.json v1 pipeline detection, malformed turbo.json graceful handling, empty turbo.json (no tasks/pipeline), package discovery under apps/packages/libs/services/tooling directories, directory name fallback when package.json has no name, relative path in package info, full Turborepo with apps+packages+tasks, non-directory entries ignored, subdirectories without package.json ignored
- **Scanner modules still missing tests** (3): ci-cd-scanner, file-walker, graphql-endpoint-scanner

### Iteration 8 — 2026-03-16 (tests)
- **Build**: pass
- **Tests**: 1452/1452 passing (was 1367, added 85 new tests)
- **Failing tests**: none
- **Tests added this iteration**:
  - `src/scanner/ci-cd-scanner.test.ts` (31 tests): empty project (no platforms, no VCS, no tests/deploy/security/deps), GitHub Actions workflow detection (config file, features, detail extraction), workflow name extraction from YAML name field, filename fallback when no name field, automated test detection (npm test, jest, vitest), security scanning detection (codeql, snyk), Dependabot yml/yaml variants, GitLab CI detection with test/security patterns, CircleCI detection, Jenkins detection, Travis CI, Azure Pipelines, Vercel with deployment pipeline flag, Netlify with deployment pipeline flag, Docker via Dockerfile, Docker via docker-compose.yml, Kubernetes directory, Terraform main.tf, Bitbucket Pipelines, AWS CodePipeline buildspec.yml, multiple platforms in same project, Git VCS detection, GitHub VCS provider (.github dir), GitLab VCS provider (.gitlab-ci.yml), Renovate config (renovate.json, .renovaterc), skips non-YAML files in workflows
  - `src/scanner/file-walker.test.ts` (25 tests): empty directory returns empty, .ts file collection, correct fullPath/relativePath/extension, extension filtering, ignores node_modules/dist/build/coverage/__pycache__/.git/hidden dirs/venv/.venv/vendor, skips binary extensions (png/woff2/db), skips .lock files, skipTests true excludes .test/.spec/__tests__ files, skipTests false includes test files, recurses into deep subdirectories, circular symlink handling, broken symlink handling, SOURCE_EXTENSIONS contents, TRACKING_EXTENSIONS contents, ALL_EXTENSIONS is union, unreadable directory graceful handling, multiple extension types at once
  - `src/scanner/graphql-endpoint-scanner.test.ts` (29 tests): empty project returns no endpoints/services, Apollo Server import detection, Apollo Server custom path, express-graphql detection, graphql-yoga with createYoga and custom endpoint, Mercurius (Fastify), NestJS GraphQL decorators, Strawberry/Graphene/Ariadne (Python), gqlgen (Go), graphql-ruby, generic /graphql and /api/graphql path references, feature detection (subscriptions/mutations/queries/file-uploads/persisted-queries/query-depth-limiting), GraphQL API service creation with dataCollected, uploaded files in dataCollected, real-time subscription data in dataCollected, deduplication, pre-walked files acceptance, evidence with code_pattern type, Absinthe (Elixir), Juniper (Rust), multiple endpoints in different files
- **Scanner modules still missing tests**: 0 — 100% scanner test coverage achieved
- **Generator modules still missing tests**: 114 files (unchanged)

**2026-03-16 — Add German Impressum generator (Section 5 DDG / TMG)**
- Research iteration 2 identified Impressum as low priority but easy to implement; picked as a quick win
- Created `src/generator/impressum.ts` — generates a German-language Impressum (legal disclosure)
  - Required by Section 5 DDG (Digitale-Dienste-Gesetz, formerly Section 5 TMG) for German/EU websites
  - Returns null when no EU/German jurisdiction detected (checks jurisdiction, jurisdictions array, companyLocation)
  - Fields from GeneratorContext: companyName, contactEmail, website
  - Additional fields via ImpressumConfig extras: address, phone, managingDirector, tradeRegister, vatId
  - Includes all legally required sections: company info, authorized representative, contact, responsible person (§ 18 MStV), EU dispute resolution (OS platform link), liability disclaimer (Haftungsausschluss)
  - Includes legal review disclaimer per project quality red lines
- Created `src/generator/impressum.test.ts` with 12 tests covering:
  - Null return for non-EU jurisdiction, undefined jurisdiction with no German indicators
  - Generation triggers: GDPR jurisdiction, EU in jurisdictions array, Germany/Deutschland in companyLocation
  - Required sections present: Angaben zum Diensteanbieter, Kontakt, Vertreten durch, Verantwortlich, Streitbeilegung, OS platform link
  - Extras override (all 8 fields), placeholder fallbacks, context fallback, Haftungsausschluss, legal disclaimer
- Registered in `src/generator/index.ts`: import, DOCUMENT_CATEGORIES ("legal"), USER_FACING_DOCS, generateDocuments
- Build verified: `npx tsc` passes cleanly, all 12 new tests pass

**2026-03-16 — Flutter/Dart ecosystem support (Issue #1)**
- Created new scanner `src/scanner/flutter.ts` that parses `pubspec.yaml` for known Flutter/Dart service dependencies
- Handles two pubspec.yaml formats: inline (`package: ^version`) and multi-line (`package:\n    version: ^x.y.z`)
- Detects 13 Flutter/Dart service packages across 6 categories:
  - Firebase (4): `firebase_core` (analytics), `firebase_auth` (auth), `firebase_analytics` (analytics), `cloud_firestore` (database)
  - Payment (2): `stripe_sdk`, `flutter_stripe`
  - Monitoring (1): `sentry_flutter`
  - Auth (3): `supabase_flutter`, `google_sign_in`, `flutter_facebook_auth`
  - Analytics (2): `amplitude_flutter`, `mixpanel_flutter`
  - Notifications (1): `onesignal_flutter`
- Added "dart" to `Ecosystem` type in `src/scanner/types.ts`
- Added all 13 Flutter/Dart packages to `SERVICE_SIGNATURES` in `src/scanner/types.ts` with ecosystem: "dart"
- Registered `scanFlutterDependencies` in `src/scanner/index.ts` (root scan + monorepo workspace scanning)
- Created `src/scanner/flutter.test.ts` with 19 tests covering:
  - No pubspec.yaml, unknown dependencies, each of the 13 packages individually, multiple deps at once, multi-line format, dev_dependencies section, top-level key boundary, evidence detail content, dataCollected accuracy
- Build verified: `npx tsc` passes cleanly, all 19 new tests pass

### Iteration 7 — 2026-03-16 (npm optimization & v1.1.0 release planning)

#### 1. npm Package Size Optimization

**Current state**: 841KB package size, 3.6MB unpacked, 445 files (220 `.d.ts` files). Largest file is `dist/cli.js` at 395KB (47% of package). `puppeteer` is listed as a runtime dependency which is a massive transitive install.

**Quick wins (no bundler needed)**:
- **Move puppeteer to optionalDependencies or peerDependencies**: Puppeteer installs a full Chromium binary (~300MB). Most CLI users do not need it. Moving it to `optionalDependencies` or making it a lazy-loaded peer dependency would dramatically reduce install time/size. This is the single highest-impact change.
- **Strip `.d.ts` files for CLI-only users**: 220 declaration files add weight. Consider publishing a separate `codepliant-types` package or only including `.d.ts` for the public API entry points (`index.d.ts`, `scanner/index.d.ts`, `generator/index.d.ts`, `output/index.d.ts`, `config.d.ts`, `scoring/index.d.ts`) rather than every internal module.
- **Audit the `files` array**: The current `files` field in package.json uses broad globs like `dist/scanner/**/*.js`. Tightening these to only export public-facing modules (not internal helpers) could reduce file count.
- **Verify with `npm pack --dry-run`**: Always run this before publishing to catch unintended inclusions.

**Bundler-based optimization (medium effort, high impact)**:
- **Bundle with tsup (esbuild-based) or rollup**: Collapse all source files into a single `dist/cli.js` and a single `dist/index.js`. This eliminates hundreds of individual files, enables minification, and enables tree-shaking of dead code paths.
  - tsup config: `entry: ['src/cli.ts', 'src/index.ts'], format: ['esm'], dts: true, splitting: true, minify: true, treeshake: true`
  - Note: tsup is no longer actively maintained; **tsdown** is the recommended successor for new projects.
  - For a CLI tool, a single-file bundle is ideal. The 395KB cli.js could likely be reduced to ~150-200KB minified.
- **Set `"sideEffects": false`** in package.json to signal to downstream bundlers that all modules are safe to tree-shake.
- **Use `minify: true`** in tsup/esbuild config. Since this is a CLI tool (not a library users debug into), minification is safe and typically yields 40-60% size reduction.

**Advanced optimization**:
- **Use `size-limit`** package to track bundle size in CI and prevent regressions.
- **Replace heavy utility patterns**: If any large vendored data (e.g., service signature definitions in `types.js` at 26KB) can be split into lazy-loaded chunks, do so.
- **Target**: Realistic goal is **300-400KB package size** (from 841KB) with bundling + minification, or **under 200KB** with aggressive tree-shaking and puppeteer removal from dependencies.

Sources:
- [Reducing npm package size by 83%](https://dev.to/nombrekeff/reducing-npm-package-size-by-83-4jde)
- [How to bundle a tree-shakable TypeScript library with tsup](https://dev.to/orabazu/how-to-bundle-a-tree-shakable-typescript-library-with-tsup-and-publish-with-npm-3c46)
- [tsup on npm](https://www.npmjs.com/package/tsup)
- [Tree Shaking | webpack](https://webpack.js.org/guides/tree-shaking/)
- [How to ignore files from your npm package](https://zellwk.com/blog/ignoring-files-from-npm-package/)
- [Control what you publish in npm packages](https://medium.com/trabe/control-what-you-publish-inside-your-npm-packages-e3ec911638b8)

#### 2. v1.1.0 Release Content

**Features added since v1.0.0** (all in iterations 1-6):
- Interactive wizard command (`codepliant wizard`) — guided setup for first-time users
- SBOM (Software Bill of Materials) generation
- Terraform/IaC scanner — detects infrastructure-as-code compliance needs
- Django settings.py INSTALLED_APPS scanning — improved Python framework detection
- German Impressum generator (Section 5 DDG) — legal disclosure for German/EU websites
- npm package size reduction (906KB to 831KB)
- 116+ new tests (iteration 6 alone added 104)
- GitHub Actions research for CI/CD integration

**Recommended v1.1.0 release scope**:
- All of the above features constitute a solid minor version bump
- Semantic versioning rationale: new features (wizard, sbom, terraform, impressum) are additive and backward-compatible, warranting a MINOR version bump (1.0.0 -> 1.1.0)
- If npm package optimization (bundling/minification) is completed before release, include it — smaller install size is a strong adoption signal
- Consider holding puppeteer change for v1.2.0 or v2.0.0 if it requires a breaking API change

**Recommended CHANGELOG categories** (per Keep a Changelog standard):
- **Added**: Wizard command, SBOM generation, Terraform scanner, Django settings scanner, Impressum generator, GitHub Actions support
- **Changed**: npm package size reduced from 906KB to target (300-400KB with bundling)
- **Fixed**: QA fixes from iteration 5

#### 3. Release Notes That Drive Adoption

**Structure for v1.1.0 release notes** (synthesized from best practices):

1. **Lead with user value, not technical details**: Instead of "Added Terraform scanner module", write "Codepliant now scans your Terraform files to detect cloud infrastructure compliance requirements — no manual configuration needed."

2. **Use the Keep a Changelog format**: Group changes into Added/Changed/Deprecated/Removed/Fixed/Security. This is the most widely recognized format in the npm ecosystem. Use ISO 8601 dates (YYYY-MM-DD).

3. **Include a highlights section**: Pick 2-3 marquee features and give them each a one-paragraph explanation with a code example:
   - `codepliant wizard` — "Run the interactive wizard to generate your first compliance document in under 60 seconds"
   - SBOM generation — "Generate a Software Bill of Materials for supply chain compliance"
   - Terraform support — "Infrastructure-as-code scanning for AWS/GCP/Azure compliance"

4. **Add upgrade instructions**: `npm install -g codepliant@1.1.0` — make it trivially easy to upgrade.

5. **Show before/after or stats**: "Now supports 121+ document types. Package size reduced by X%. 1282 tests passing." Numbers build confidence.

6. **Call to action**: Link to documentation, invite feedback via GitHub Issues, mention the project roadmap for what is coming in v1.2.0.

7. **Cross-post for visibility**: Publish release notes on GitHub Releases, npm package page (via README), and consider a blog post or dev.to article for the v1.1.0 launch.

8. **Use automation for consistency**: Tools like conventional-changelog or release-it can auto-generate changelogs from commit messages if using conventional commits.

Sources:
- [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
- [How to create perfect release notes: 12 templates](https://monday.com/blog/rnd/release-note-template/)
- [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog)
- [release-it](https://www.npmjs.com/package/release-it)
- [What to expect for open source in 2026 (GitHub Blog)](https://github.blog/open-source/maintainers/what-to-expect-for-open-source-in-2026/)

---

### Iteration 8 — Package Size Optimization (2026-03-16)

**Objective**: Move puppeteer from `dependencies` to `optionalDependencies` to eliminate the ~300MB Chromium download for users who don't need PDF generation.

**Changes made**:
1. **Moved `puppeteer` from `dependencies` to `optionalDependencies`** in `package.json`. This means `npm install codepliant` will no longer force-download Chromium. Users who need the `codepliant pdf` command can run `npm install puppeteer` separately.
2. **Verified the import is already dynamic**: `src/cli.ts` line 2765 uses `await import("puppeteer")` inside a try/catch block, with a clear error message guiding users to install puppeteer if missing. No code changes needed.
3. **TypeScript compilation**: `npx tsc` passes clean.
4. **Package tarball size**: 843KB / 3.7MB unpacked / 447 files (unchanged — the tarball never included Chromium). The real impact is on end-user install: `npm install codepliant` no longer triggers a ~300MB Chromium download.

**Impact**: This is the single highest-impact change identified in the iteration 7 research. Users who only need scanning and document generation (the primary use case) get a fast, lightweight install. PDF generation remains available as an opt-in.
