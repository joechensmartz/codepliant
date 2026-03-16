# Document Type Reference

Every document Codepliant generates, why it exists, and how to use it.

## Legal — documents your users will see

These go on your website. Users, regulators, and partners will read them.

| Document | Why you need it | Where to put it |
|----------|----------------|-----------------|
| **Privacy Policy** | **Legally required** if you collect any user data (GDPR Art. 13, CCPA). Without one, you can't list on app stores, run Google Ads, or pass due diligence. | `/privacy` on your website |
| **Terms of Service** | Limits your liability and defines the rules of using your product. Without it, users can sue you in any jurisdiction for any reason. | `/terms` on your website |
| **Cookie Policy** | **Required by ePrivacy Directive** if you use any analytics, tracking, or auth cookies. Google, PostHog, Supabase Auth — they all set cookies. | `/cookies` or linked from your cookie banner |
| **AI Disclosure** | **Required by EU AI Act Art. 50** (effective Aug 2, 2026). If your app uses OpenAI, Anthropic, or any AI model, you must disclose this to users. Fines up to EUR 35M. | `/ai-disclosure` on your website |
| **Refund Policy** | Required by consumer protection laws in most jurisdictions if you accept payments. Stripe/PayPal require you to have one. | `/refund` or within your Terms |
| **Acceptable Use Policy** | Defines prohibited uses of your service. Protects you from abuse and limits liability. | `/acceptable-use` on your website |
| **API Terms of Use** | If you offer an API, this governs rate limits, auth requirements, acceptable use, and liability. | `/api-terms` or in your developer docs |
| **Service Level Agreement** | Defines uptime commitments, support response times, and remedies. Enterprise customers require this. | Shared during enterprise sales |
| **Privacy Notice (Short)** | One-page simplified privacy notice for in-app display. Plain language, not legalese. | In-app settings or onboarding flow |
| **Privacy Notice (App)** | Mobile/app-specific privacy notice with links to full policy. | App store listing, in-app settings |
| **Privacy Notices (DE/FR/ES)** | Translated privacy notices for multilingual compliance. | Localized versions of your website |
| **Open Source Notice** | Attribution for open-source licenses in your project. Some licenses (MIT, Apache, GPL) require this. | `/licenses` or in your docs |
| **License Compliance** | Audit of all open-source licenses in your dependencies. Flags copyleft risks. | Internal review before release |
| **Third-Party Cookie Notice** | Per-provider cookie notice with opt-out URLs for each third-party. | Linked from cookie banner |
| **Data Processing Agreement** | **Required by GDPR Art. 28** if you process data on behalf of customers. Every B2B SaaS customer in Europe will ask for this. | Shared when enterprise prospect says "send us your DPA" |
| **Sub-Processor List** | Part of your DPA obligations — list every third-party that touches customer data. | Attached to your DPA |

## AI — EU AI Act compliance

Generated only when AI/ML services are detected in your code.

| Document | Why you need it | Regulatory basis |
|----------|----------------|-----------------|
| **AI Disclosure** | Users must be informed they're interacting with AI. | EU AI Act Art. 50 |
| **AI Model Card** | Documents each AI model — purpose, limitations, risks. | EU AI Act Art. 53 |
| **AI Act Checklist** | Step-by-step compliance checklist for the EU AI Act. | EU AI Act |
| **AI Governance Framework** | How your org manages AI risk — oversight, monitoring, human review. | EU AI Act + NIST AI RMF |
| **Acceptable AI Use Policy** | Internal policy for how employees should use AI tools. Prevents data leaks to ChatGPT/Copilot. | Internal governance |
| **AI Ethics Statement** | Public-facing statement about your AI principles. | Best practice / trust signal |
| **AI Training Data Notice** | Discloses whether user data is used for model training. | EU AI Act + GDPR |
| **AI Impact Assessment** | Evaluates the impact of AI systems on users. | EU AI Act + Colorado AI Act |
| **AI Red Team Guide** | Adversarial testing guide based on OWASP LLM Top 10. | Security best practice |
| **AI Supply Chain Risk** | Assesses dependency risk on AI providers (vendor lock-in, outages). | Enterprise risk management |

## Security — policies and procedures

| Document | Why you need it |
|----------|----------------|
| **Security Policy** (SECURITY.md) | Shows prospects your security posture. Required for SOC 2 and vendor reviews. |
| **Incident Response Plan** | Defines who does what within the **72-hour GDPR breach notification window**. |
| **Incident Severity Matrix** | P0-P4 severity levels with response times and escalation paths. |
| **Incident Communication Templates** | Pre-written templates for each phase of incident lifecycle. |
| **Data Breach Notification Templates** | Pre-filled templates per jurisdiction so you're not drafting emails during a crisis. |
| **Data Breach Response Drill** | Tabletop exercise template for practicing breach response. |
| **Access Control Policy** | Who has access to what, password requirements, MFA rules. |
| **Encryption Policy** | What's encrypted at rest vs in transit and with what algorithms. |
| **Backup Policy** | Backup schedules, retention periods, recovery testing procedures. |
| **Disaster Recovery Plan** | Recovery procedures, communication plan, testing schedule. |
| **Business Continuity Plan** | RTO/RPO targets, failover procedures, communication chain. |
| **Change Management Policy** | Code review, deployment, and rollback procedures. |
| **Responsible Disclosure Policy** | Bug bounty scope, safe harbor, response timeline for security researchers. |
| **Penetration Test Scope** | Recommended pentest scope based on your detected services and infrastructure. |
| **Vulnerability Scan** | Dependency vulnerability audit based on known CVEs. |
| **Information Security Policy** | Umbrella ISMS policy aligned to ISO 27001 / NIST CSF. |
| **Security Awareness Program** | Employee security training program outline. |
| **Audit Log Policy** | What events you log, retention period, access controls. |

## Privacy — GDPR and data protection

| Document | Why you need it |
|----------|----------------|
| **Privacy Impact Assessment** | **Required by GDPR Art. 35** for high-risk processing (AI, profiling, large-scale monitoring). |
| **Privacy Impact Register** | Registry of all PIAs/DPIAs conducted. |
| **Privacy Impact Screening** | Quick screening to determine if a full DPIA is needed. |
| **Privacy by Design Checklist** | GDPR Art. 25 requirements for building privacy into your product. |
| **Privacy Risk Matrix** | Likelihood x impact matrix for all data processing activities. |
| **Privacy Engineering Guide** | Technical privacy-by-design guide for your development team. |
| **Privacy Program Charter** | Formal establishment of your privacy program with governance structure. |
| **Privacy Roadmap** | 12-month privacy program roadmap based on maturity level. |
| **Privacy Policy Changelog** | Track changes to your privacy policy over time. |
| **Privacy Policy Comparison** | Benchmark against industry standards (Stripe, Vercel, Linear). |
| **Privacy Metrics Dashboard** | KPIs for privacy program measurement. |
| **Data Protection Policy** | Internal policy covering classification, handling, access, disposal. |
| **Data Dictionary** | Every data field cataloged with sensitivity level and retention period. |
| **Data Classification** | GDPR sensitivity classification of all detected data. |
| **Data Mapping Register** | GDPR Art. 30 complete data inventory. |
| **Data Flow Map** | Where data is collected, stored, and shared. |
| **Data Flow Diagram** | Mermaid-based visual data flow diagram. |
| **Data Lifecycle Diagram** | Collection → Processing → Storage → Sharing → Deletion. |
| **Data Retention Policy** | How long you keep each type of data and when you delete it. |
| **Data Subject Categories** | GDPR Art. 30 — categories of data subjects. |
| **Data Subject Rights Portal** | Self-service privacy portal specification. |
| **Data Deletion Procedures** | Step-by-step guide for "delete my data" requests (GDPR Art. 17). |
| **Data Portability Guide** | GDPR Art. 20 right to data portability. |
| **Data Minimization Checklist** | Per-service data necessity assessment (GDPR Art. 5(1)(c)). |
| **Data Processing Inventory** | Complete inventory of all data processing activities. |
| **DSAR Handling Guide** | How to handle data subject access requests within the 30-day deadline. |
| **DSAR Log Template** | Spreadsheet-style template for logging requests. |
| **DPO Handbook** | Guide for the Data Protection Officer (GDPR Art. 37-39). |
| **Record of Processing Activities** | **Required by GDPR Art. 30**. |
| **Lawful Basis Assessment** | Per-processing-activity GDPR Art. 6 assessment. |
| **Consent Management Guide** | How to collect, record, and withdraw consent. |
| **Consent Record Template** | GDPR Art. 7 consent evidence logging. |
| **Cross-Border Transfer Map** | Visual map of all international data transfers (Schrems II). |
| **Transfer Impact Assessment** | Schrems II compliance for EU-to-US transfers. |
| **Cookie Inventory** | Detailed inventory of all cookies per provider. |
| **Media Consent Form** | User media consent template when storage services detected. |

## Vendor — third-party management

| Document | Why you need it |
|----------|----------------|
| **Sub-Processor List** | Lists every third-party that touches customer data. Required for DPA compliance. |
| **Sub-Processor Change Notification** | Template for notifying customers of sub-processor changes. |
| **Vendor Contacts** | DPA contacts, privacy emails, deletion URLs for DSAR handling. |
| **Vendor Security Questionnaire** | SIG Lite format, pre-answered from detected controls. |
| **Vendor Onboarding Checklist** | DPA, security assessment, data classification for new vendors. |
| **Vendor Risk Tier Assessment** | Tier each vendor: Critical / High / Medium / Low. |
| **Vendor Compliance Tracker** | DPA status, review dates, risk tiers per vendor. |
| **Vendor Exit Plan** | Migration strategies for each detected third-party service. |
| **Supplier Code of Conduct** | Data protection requirements for your vendors. |
| **Third-Party Risk Assessment** | Documents what third-party services you use and the risk each one poses. |
| **Third-Party Due Diligence Template** | Vendor evaluation questionnaire. |

## Audit — compliance frameworks

| Document | Why you need it |
|----------|----------------|
| **SOC 2 Readiness Checklist** | Maps your practices to SOC 2 Trust Service Criteria. |
| **ISO 27001 Checklist** | Maps to Annex A controls. |
| **Compliance Certificate** | Self-attestation certificate with unique ID. |
| **Compliance Gap Analysis** | Current state vs target state per regulation. |
| **Compliance Maturity Model** | 5-level maturity assessment with roadmap. |
| **Compliance Maturity Assessment** | 50-question self-assessment, auto-pre-filled. |
| **Compliance Evidence Log** | SOC 2 / ISO 27001 audit evidence tracking. |
| **Compliance Scorecard** | Visual ASCII scorecard with letter grades per area. |
| **Compliance Testing Plan** | Test cases for consent, deletion, access controls, breach notification. |
| **Risk Register** | Identified risks with likelihood, impact, and mitigation. |
| **Regulatory Mapping Matrix** | Maps each service to all applicable regulations. |
| **Regulatory Readiness Scorecard** | Per-regulation readiness score with visual bars. |
| **Annual Review Checklist** | Yearly compliance review checklist. |
| **Environment Variable Audit** | Security audit of all environment variables. |

## Governance — program management

| Document | Why you need it |
|----------|----------------|
| **Executive Dashboard** | One-page C-suite compliance overview. |
| **Executive Briefing** | Board-ready briefing with compliance gauge. |
| **Compliance Board Report** | Quarterly board-level report. |
| **Compliance Summary Email** | Stakeholder-ready compliance status email. |
| **Compliance Roadmap** | Phased implementation plan. |
| **Compliance KPI Dashboard** | KPIs for compliance program measurement. |
| **Compliance Calendar** | 12-month calendar of all compliance activities. |
| **Compliance Communication Plan** | Internal communication plan for updates. |
| **Compliance Budget Template** | Estimated costs for compliance program. |
| **Compliance Investment Case** | Business case with ROI analysis. |
| **Compliance Oath** | Management commitment statement (ISO 27001). |
| **Compliance Policy Index** | Master index of all generated documents. |
| **Compliance Digest** | Weekly/monthly digest for team distribution. |
| **Compliance Timeline** | Deadlines, obligations, action items. |
| **Compliance Notes** | Regulation overview based on detected services. |
| **Compliance FAQ** | Auto-generated FAQ based on detected services. |
| **Compliance Glossary** | Glossary of compliance terms. |
| **Key Person Risk Assessment** | Single points of failure + cross-training recommendations. |
| **Regulatory Correspondence Log** | Tracking communications with regulators. |
| **Regulatory Updates** | Upcoming regulatory changes based on your jurisdictions. |
| **Transparency Report** | Annual public reporting template. |
| **Whistleblower Policy** | EU Whistleblower Directive compliance. |

## HR — employee and training

| Document | Why you need it |
|----------|----------------|
| **Employee Privacy Notice** | **Required** to tell employees what data you collect about them. |
| **Employee Handbook Privacy Section** | Monitoring policies, device usage, email monitoring. |
| **Training Record** | GDPR Art. 39(1)(b) staff training record. |
| **Compliance Onboarding Guide** | New employee compliance procedures. |

## Config — machine-readable

| File | Use case |
|------|----------|
| **Cookie Consent Config** (JSON) | Plug into CMP platforms (OneTrust, CookieYes, Cookiebot). |
| **Privacy Dashboard Config** (JSON) | Config for a user-facing "My Data" page. |

## Guides

| Document | Use case |
|----------|----------|
| **Quick Start Compliance Guide** | Personalized getting-started guide based on your detected stack. |
| **Compliance Automation Guide** | CI/CD integration, cron scanning, webhook alerts. |
| **API Privacy Documentation** | Endpoint-level data mapping for API-first companies. |
