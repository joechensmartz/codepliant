# Regulatory Updates

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Company:** [Your Company Name]
**Project:** twenty
**Last checked:** 2026-03-16. Review quarterly.

## Related Documents

- Compliance Notes (`COMPLIANCE_NOTES.md`)
- Compliance Timeline (`COMPLIANCE_TIMELINE.md`)
- Annual Review Checklist (`ANNUAL_REVIEW_CHECKLIST.md`)

---

This document lists upcoming and recent regulatory changes that may affect your project based on detected services and configured jurisdictions. Each entry includes the enforcement date, expected impact, and recommended actions.

> **Disclaimer:** This is not legal advice. Regulatory timelines and requirements may change. Consult qualified legal counsel and monitor official sources for the latest developments.

## Recently Enacted (Now In Effect)

### EU AI Act — Prohibited Practices (Art. 5)

| | |
|---|---|
| **Enforcement Date** | 2 February 2025 |
| **Status** | In effect |

**Impact:** AI systems that use subliminal techniques, exploit vulnerabilities, perform social scoring, or use real-time remote biometric identification (with narrow exceptions) are banned.

**Action Required:** Audit all AI features against the prohibited practices list. Remove or redesign any AI functionality that falls within the prohibited categories.

### EU AI Act — AI Literacy Obligation (Art. 4)

| | |
|---|---|
| **Enforcement Date** | 2 February 2025 |
| **Status** | In effect |

**Impact:** Providers and deployers must ensure staff involved in AI operation and use have sufficient AI literacy, considering their technical knowledge, experience, and context of use.

**Action Required:** Implement AI literacy training for all personnel who develop, deploy, or oversee AI systems. Document training records.

### California — CPRA Enforcement (Regulations finalized)

| | |
|---|---|
| **Enforcement Date** | 29 March 2024 |
| **Status** | In effect |

**Impact:** California Privacy Protection Agency (CPPA) actively enforcing CPRA amendments including automated decision-making technology (ADMT) rules, opt-out preference signals, and dark pattern prohibitions.

**Action Required:** Honour Global Privacy Control (GPC) signals. Review consent flows for dark patterns. If using ADMT, prepare for pre-decision notice and opt-out requirements.

### Texas Data Privacy and Security Act (TDPSA)

| | |
|---|---|
| **Enforcement Date** | 1 July 2024 |
| **Status** | In effect |

**Impact:** Applies to entities conducting business in Texas or producing products/services consumed by Texas residents. No revenue or processing volume thresholds.

**Action Required:** Review applicability — the TDPSA has no minimum thresholds. Implement consumer rights mechanisms (access, correction, deletion, opt-out of sale/targeted advertising).

### Florida Digital Bill of Rights (FDBR)

| | |
|---|---|
| **Enforcement Date** | 1 July 2024 |
| **Status** | In effect |

**Impact:** Applies to companies with >$1B global revenue or meeting specific criteria (app stores, digital advertisers, large platforms). Includes children's privacy provisions.

**Action Required:** Assess applicability based on revenue thresholds. If applicable, implement consent mechanisms for children under 16 and targeted advertising opt-outs.

### Oregon Consumer Privacy Act (OCPA)

| | |
|---|---|
| **Enforcement Date** | 1 July 2024 |
| **Status** | In effect |

**Impact:** Applies to businesses processing data of 100,000+ Oregon consumers, or 25,000+ consumers if 25%+ of revenue comes from selling data. Includes sensitive data protections.

**Action Required:** Conduct data inventory for Oregon residents. Implement opt-in consent for sensitive data processing. Provide universal opt-out mechanism.

### New Jersey Data Privacy Act (NJDPA)

| | |
|---|---|
| **Enforcement Date** | 15 January 2025 |
| **Status** | In effect |

**Impact:** Applies to controllers processing data of 100,000+ NJ consumers or 25,000+ consumers with revenue from data sales. Notably broad sensitive data definition.

**Action Required:** Review sensitive data processing — NJ includes financial data, geolocation, and union membership. Implement data protection assessments for high-risk processing.


## Upcoming Enforcement Dates

### EU AI Act — GPAI Model Obligations (Art. 51-56)

| | |
|---|---|
| **Enforcement Date** | 2 August 2025 |
| **Status** | Upcoming |

**Impact:** General-purpose AI model providers must provide technical documentation, comply with EU copyright law, and publish a training content summary. Systemic risk models face additional obligations.

**Action Required:** If using or providing GPAI models, review provider compliance. Request technical documentation and copyright compliance evidence from AI providers.

### EU AI Act — Transparency Obligations (Art. 50)

| | |
|---|---|
| **Enforcement Date** | 2 August 2026 |
| **Status** | Upcoming |

**Impact:** Deployers must inform users when they interact with AI systems. AI-generated content (text, images, audio, video, deepfakes) must be labelled as such in a machine-readable format.

**Action Required:** Implement AI interaction disclosure in UI. Add machine-readable labels (C2PA or equivalent) to AI-generated content. Update privacy notices to cover AI usage.

### EU AI Act — High-Risk System Requirements (Art. 6-49)

| | |
|---|---|
| **Enforcement Date** | 2 August 2027 |
| **Status** | Upcoming |

**Impact:** High-risk AI systems must undergo conformity assessments, maintain risk management systems, meet data governance standards, implement human oversight, and register in the EU database.

**Action Required:** Classify all AI systems by risk level. For high-risk systems: begin conformity assessment preparation, establish risk management framework, implement logging and monitoring.

### Tennessee Information Protection Act (TIPA)

| | |
|---|---|
| **Enforcement Date** | 1 July 2025 |
| **Status** | Upcoming |

**Impact:** Applies to companies conducting business in Tennessee with >$25M revenue processing 175,000+ consumers, or 25,000+ consumers with 50%+ revenue from data sales. Includes affirmative defense for NIST framework adherence.

**Action Required:** Assess applicability. Consider adopting NIST Privacy Framework for affirmative defense. Implement consumer rights and opt-out mechanisms.

### Minnesota Consumer Data Privacy Act

| | |
|---|---|
| **Enforcement Date** | 31 July 2025 |
| **Status** | Upcoming |

**Impact:** Applies to entities processing data of 100,000+ Minnesota consumers. Includes unique provisions: right to question profiling results, data portability in machine-readable format.

**Action Required:** Implement profiling disclosure and challenge mechanisms. Ensure data export capabilities meet machine-readable format requirements.

### Maryland Online Data Privacy Act (MODPA)

| | |
|---|---|
| **Enforcement Date** | 1 October 2025 |
| **Status** | Upcoming |

**Impact:** One of the strictest US state laws. Prohibits selling sensitive data entirely. Requires data minimisation — may not process data beyond what is reasonably necessary.

**Action Required:** Audit all data collection for necessity. Cease any sale of sensitive data for Maryland residents. Implement strict data minimisation controls.

### Colorado AI Act (SB 24-205)

| | |
|---|---|
| **Enforcement Date** | 1 February 2026 |
| **Status** | Upcoming |

**Impact:** First comprehensive US state AI law. Applies to developers and deployers of high-risk AI systems that make consequential decisions in employment, finance, housing, insurance, education, and other areas.

**Action Required:** Classify AI systems for consequential decision-making. Implement algorithmic impact assessments. Provide AI-related disclosures to consumers. Establish human oversight for high-risk AI decisions.


## In Development / Under Review

### UK Data (Use and Access) Act (DUAA)

| | |
|---|---|
| **Enforcement Date** | Royal Assent: November 2024; enforcement phased 2025-2026 |
| **Status** | Phased enforcement |

**Impact:** Reforms UK data protection law to diverge from EU GDPR. Key changes: replaces DPO requirement with 'Senior Responsible Individual'; introduces 'recognised legitimate interests' that do not require balancing test; reforms automated decision-making rules (removes Art. 22 equivalent for some decisions); new cookie rules allowing broader analytics without consent.

**Action Required:** Review DPO arrangements — may transition to Senior Responsible Individual model under UK law while maintaining DPO for EU GDPR compliance. Reassess cookie consent for UK users (analytics cookies may no longer require prior consent). Update international transfer mechanisms to use UK IDTA or UK Addendum. Monitor ICO implementation guidance.

### UK AI Regulation — Sector-led Framework

| | |
|---|---|
| **Enforcement Date** | Ongoing — no single enforcement date |
| **Status** | In development |

**Impact:** The UK has opted for a sector-led, principles-based approach rather than a single AI law. Existing regulators (ICO, FCA, CMA, Ofcom) are developing AI guidance for their sectors. The AI Safety Institute conducts frontier model evaluations.

**Action Required:** Monitor guidance from sector regulators relevant to your industry. Implement the five cross-sector AI principles: safety, fairness, transparency, accountability, contestability. Consider voluntary compliance with the UK AI Code of Practice.

### EU ePrivacy Regulation (proposed replacement for Directive 2002/58/EC)

| | |
|---|---|
| **Enforcement Date** | No confirmed date — legislative process stalled |
| **Status** | Stalled |

**Impact:** If adopted, would replace the ePrivacy Directive with a directly applicable regulation. Expected changes: harmonised cookie rules across EU, expanded scope to cover OTT communications (WhatsApp, Messenger), stricter consent requirements for metadata processing, and potential shift toward browser-level consent settings.

**Action Required:** Continue complying with current ePrivacy Directive (transposed into national law). Monitor EU legislative progress — the proposal has been in trilogue since 2021 with no agreement. Ensure current cookie consent mechanisms meet the strictest national implementation (e.g., CNIL, BfDI guidance).

### EU-US Data Privacy Framework (DPF) — Adequacy Review

| | |
|---|---|
| **Enforcement Date** | First review expected by July 2025 |
| **Status** | Under review |

**Impact:** You use 4 US-based service(s). The DPF adequacy decision enables EU-US data transfers without SCCs, but is subject to periodic review. A CJEU challenge (similar to Schrems I/II) remains possible.

**Action Required:** Verify each US-based provider's DPF certification at dataprivacyframework.gov. Maintain fallback SCCs in DPAs in case the DPF is invalidated. Document transfer impact assessments.


## Action Summary

| # | Regulation | Date | Status | Priority |
|---|-----------|------|--------|----------|
| 1 | EU AI Act — Prohibited Practices (Art. 5) | 2 February 2025 | In effect | Review now |
| 2 | EU AI Act — AI Literacy Obligation (Art. 4) | 2 February 2025 | In effect | Review now |
| 3 | EU AI Act — GPAI Model Obligations (Art. 51-56) | 2 August 2025 | Upcoming | Plan ahead |
| 4 | EU AI Act — Transparency Obligations (Art. 50) | 2 August 2026 | Upcoming | Plan ahead |
| 5 | EU AI Act — High-Risk System Requirements (Art. 6-49) | 2 August 2027 | Upcoming | Plan ahead |
| 6 | California — CPRA Enforcement (Regulations finalized) | 29 March 2024 | In effect | Review now |
| 7 | Texas Data Privacy and Security Act (TDPSA) | 1 July 2024 | In effect | Review now |
| 8 | Florida Digital Bill of Rights (FDBR) | 1 July 2024 | In effect | Review now |
| 9 | Oregon Consumer Privacy Act (OCPA) | 1 July 2024 | In effect | Review now |
| 10 | New Jersey Data Privacy Act (NJDPA) | 15 January 2025 | In effect | Review now |
| 11 | Tennessee Information Protection Act (TIPA) | 1 July 2025 | Upcoming | Plan ahead |
| 12 | Minnesota Consumer Data Privacy Act | 31 July 2025 | Upcoming | Plan ahead |
| 13 | Maryland Online Data Privacy Act (MODPA) | 1 October 2025 | Upcoming | Plan ahead |
| 14 | Colorado AI Act (SB 24-205) | 1 February 2026 | Upcoming | Plan ahead |
| 15 | UK Data (Use and Access) Act (DUAA) | Royal Assent: November 2024; enforcement phased 2025-2026 | Phased enforcement | Monitor |
| 16 | UK AI Regulation — Sector-led Framework | Ongoing — no single enforcement date | In development | Monitor |
| 17 | EU ePrivacy Regulation (proposed replacement for Directive 2002/58/EC) | No confirmed date — legislative process stalled | Stalled | Monitor |
| 18 | EU-US Data Privacy Framework (DPF) — Adequacy Review | First review expected by July 2025 | Under review | Monitor |


---

*This regulatory updates document was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis and known regulatory timelines. Regulatory landscapes evolve — verify all dates and requirements against official sources.*