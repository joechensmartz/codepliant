# Codepliant Progress Tracker

> This file is the shared coordination document for all automated agents.
> Each agent reads this before starting work and updates their section when done.
> Last updated: 2026-03-16

## Current Status

- **Version**: 1.0.0 (published to npm)
- **Tests**: 926 passing (+91 new in iteration 3)
- **Repos tested**: 1200+
- **Document types**: 120+
- **npm package size**: 831KB
- **Iteration**: 3 complete (2026-03-17)
- **Last run**: Terraform scanner, 79 generator tests, hero redesign, blog index, Playwright QA (2 bugs fixed), launch strategy research

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
