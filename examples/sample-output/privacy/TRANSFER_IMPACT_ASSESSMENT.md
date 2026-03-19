# Transfer Impact Assessment

> **Acme Inc** — International Data Transfer Impact Assessment
>
> Prepared in accordance with GDPR Chapter V and the *Schrems II* ruling (CJEU C-311/18)
>
> Assessment date: 2026-03-18
> **Document Version:** 1.0  
> **Document Owner:** Acme Inc  
> **Next Review Date:** 2027-03-18

## 1. Assessment Overview

This Transfer Impact Assessment (TIA) evaluates the risks associated with transferring personal data from the European Economic Area (EEA) to the United States through third-party services used by **Acme Inc**. This assessment is required following the Court of Justice of the European Union (CJEU) ruling in *Data Protection Commissioner v. Facebook Ireland Ltd and Maximillian Schrems* (Case C-311/18, "Schrems II").

| Field | Details |
|-------|---------|
| **Data Exporter** | Acme Inc |
| **Exporter Contact** | legal@acme.com |
| **DPO** | Jane Mueller |
| **Importing Country** | United States |
| **Transfer Mechanism** | Standard Contractual Clauses (SCCs) / EU-US Data Privacy Framework |
| **Number of US-based Services** | 6 |
| **Assessment Date** | 2026-03-18 |

## 2. US-Based Services Identified

The following US-based third-party services have been detected in the codebase:

| Service | Category | Data Transferred | Transfer Mechanism | DPF Certified |
|---------|----------|------------------|--------------------|---------------|
| @sentry/node | monitoring | error data, stack traces, user context | SCCs / DPF | [Verify] |
| @supabase/supabase-js | auth | email, password hash, session data | SCCs / DPF | [Verify] |
| openai | ai | user prompts, conversation history, generated content | SCCs / DPF | [Verify] |
| posthog | analytics | user behavior, session recordings, feature flag usage | SCCs / DPF | [Verify] |
| resend | email | email addresses, email content | SCCs / DPF | [Verify] |
| stripe | payment | payment information, billing address, email | SCCs / DPF | [Verify] |

## 3. Legal Framework Assessment

### 3.1 EU-US Data Privacy Framework (DPF)

The EU-US Data Privacy Framework was adopted by the European Commission on July 10, 2023 (Adequacy Decision C(2023) 4745). US companies certified under the DPF provide an adequate level of data protection for transfers from the EEA.

**Action Required:** Verify each service provider's DPF certification status at [dataprivacyframework.gov](https://www.dataprivacyframework.gov/list).

### 3.2 Standard Contractual Clauses (SCCs)

Where a service provider is not DPF-certified, Standard Contractual Clauses (Commission Implementing Decision (EU) 2021/914) must be in place. SCCs alone may not be sufficient without supplementary measures, per the Schrems II ruling.

### 3.3 Supplementary Measures

The following supplementary measures should be implemented where SCCs are relied upon:

- [ ] **Encryption in transit** — TLS 1.2+ for all data transfers
- [ ] **Encryption at rest** — Data encrypted at rest with keys controlled by the data exporter where possible
- [ ] **Pseudonymization** — Personal identifiers replaced with pseudonyms before transfer where feasible
- [ ] **Data minimization** — Only necessary data transferred to each service
- [ ] **Access controls** — Strict access controls limiting who can access transferred data
- [ ] **Audit rights** — Contractual right to audit the data importer's compliance
- [ ] **Breach notification** — Contractual obligation for prompt breach notification

## 4. US Surveillance Law Assessment

### 4.1 FISA Section 702

Section 702 of the Foreign Intelligence Surveillance Act allows US intelligence agencies to collect communications of non-US persons located outside the US. The DPF includes safeguards through Executive Order 14086 (October 7, 2022), which establishes:

- Necessity and proportionality requirements for US signals intelligence
- A redress mechanism through the Data Protection Review Court (DPRC)
- Limitations on bulk collection of personal data

### 4.2 Risk Assessment by Service Category

**Monitoring Services** (@sentry/node)
- Risk Level: **Low**
- Rationale: Monitoring services primarily collect technical data (error reports, stack traces). Some user context data may be included incidentally.

**Auth Services** (@supabase/supabase-js)
- Risk Level: **Medium**
- Rationale: Authentication services process identity data (email, name, profile). These services typically have strong security controls.

**Ai Services** (openai)
- Risk Level: **High**
- Rationale: AI services process user-generated content which may contain sensitive personal data. Data may be used for model training unless explicitly opted out.

**Analytics Services** (posthog)
- Risk Level: **Medium**
- Rationale: Analytics services collect behavioral data, IP addresses, and device information. Consent is typically required under GDPR/ePrivacy Directive.

**Email Services** (resend)
- Risk Level: **Medium**
- Rationale: Email services process contact information and communication content. Transactional emails are generally lower risk than marketing communications.

**Payment Services** (stripe)
- Risk Level: **High**
- Rationale: Financial data is sensitive and subject to both GDPR and PCI DSS requirements. Payment processors typically have robust security measures and DPF certification.

## 5. Per-Service Transfer Assessment

### @sentry/node

| Criterion | Assessment |
|-----------|-----------|
| **Data Categories** | error data, stack traces, user context, device information, IP address |
| **Transfer Mechanism** | SCCs / DPF — [Verify with provider] |
| **DPF Certification** | [Check dataprivacyframework.gov] |
| **Encryption in Transit** | [Verify — typically yes] |
| **Encryption at Rest** | [Verify with provider] |
| **Sub-processors** | [Review provider's sub-processor list] |
| **Data Minimization** | [Assess what data is strictly necessary] |
| **Risk Level** | Low-Medium |

### @supabase/supabase-js

| Criterion | Assessment |
|-----------|-----------|
| **Data Categories** | email, password hash, session data, user metadata |
| **Transfer Mechanism** | SCCs / DPF — [Verify with provider] |
| **DPF Certification** | [Check dataprivacyframework.gov] |
| **Encryption in Transit** | [Verify — typically yes] |
| **Encryption at Rest** | [Verify with provider] |
| **Sub-processors** | [Review provider's sub-processor list] |
| **Data Minimization** | [Assess what data is strictly necessary] |
| **Risk Level** | High |

### openai

| Criterion | Assessment |
|-----------|-----------|
| **Data Categories** | user prompts, conversation history, generated content |
| **Transfer Mechanism** | SCCs / DPF — [Verify with provider] |
| **DPF Certification** | [Check dataprivacyframework.gov] |
| **Encryption in Transit** | [Verify — typically yes] |
| **Encryption at Rest** | [Verify with provider] |
| **Sub-processors** | [Review provider's sub-processor list] |
| **Data Minimization** | [Assess what data is strictly necessary] |
| **Risk Level** | High |

### posthog

| Criterion | Assessment |
|-----------|-----------|
| **Data Categories** | user behavior, session recordings, feature flag usage, device information |
| **Transfer Mechanism** | SCCs / DPF — [Verify with provider] |
| **DPF Certification** | [Check dataprivacyframework.gov] |
| **Encryption in Transit** | [Verify — typically yes] |
| **Encryption at Rest** | [Verify with provider] |
| **Sub-processors** | [Review provider's sub-processor list] |
| **Data Minimization** | [Assess what data is strictly necessary] |
| **Risk Level** | Medium |

### resend

| Criterion | Assessment |
|-----------|-----------|
| **Data Categories** | email addresses, email content |
| **Transfer Mechanism** | SCCs / DPF — [Verify with provider] |
| **DPF Certification** | [Check dataprivacyframework.gov] |
| **Encryption in Transit** | [Verify — typically yes] |
| **Encryption at Rest** | [Verify with provider] |
| **Sub-processors** | [Review provider's sub-processor list] |
| **Data Minimization** | [Assess what data is strictly necessary] |
| **Risk Level** | Low-Medium |

### stripe

| Criterion | Assessment |
|-----------|-----------|
| **Data Categories** | payment information, billing address, email, transaction history |
| **Transfer Mechanism** | SCCs / DPF — [Verify with provider] |
| **DPF Certification** | [Check dataprivacyframework.gov] |
| **Encryption in Transit** | [Verify — typically yes] |
| **Encryption at Rest** | [Verify with provider] |
| **Sub-processors** | [Review provider's sub-processor list] |
| **Data Minimization** | [Assess what data is strictly necessary] |
| **Risk Level** | High |

## 6. Standard Contractual Clauses Checklist

For each US-based service provider, ensure the following:

- [ ] SCCs (Module 2: Controller to Processor) executed with provider
- [ ] Annex I (List of parties) completed
- [ ] Annex II (Technical and organizational measures) documented
- [ ] Annex III (Sub-processors) provided by data importer
- [ ] Provider's DPF certification status verified
- [ ] Data Processing Agreement (DPA) in place with provider
- [ ] Supplementary measures implemented where necessary
- [ ] Provider's security certifications reviewed (SOC 2, ISO 27001)

## 7. Recommendations

1. **Verify DPF certification** for all US-based service providers listed above
2. **Execute SCCs** with any provider not certified under the DPF
3. **Implement supplementary measures** as identified in Section 3.3
4. **Conduct regular reviews** — reassess this TIA at least annually or when:
   - New US-based services are added
   - EU or US data protection laws change
   - A relevant CJEU or supervisory authority decision is issued
5. **Document all DPAs** — maintain copies of signed Data Processing Agreements
6. **Monitor the DPF** — track any legal challenges to the EU-US Data Privacy Framework

## 8. Review Schedule

| Review Type | Frequency | Next Due |
|-------------|-----------|----------|
| Full TIA Review | Annual | 2027-03-18 |
| DPF Certification Check | Semi-annual | [Set date] |
| SCC Compliance Audit | Annual | [Set date] |
| Supplementary Measures Review | Annual | [Set date] |

## Related Documents

- Sub-Processor List (`SUBPROCESSOR_LIST.md`)
- Data Processing Agreement (`DATA_PROCESSING_AGREEMENT.md`)
- Record of Processing Activities (`RECORD_OF_PROCESSING_ACTIVITIES.md`)

---

*This Transfer Impact Assessment was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on code analysis. It must be reviewed by your Data Protection Officer and legal counsel. The assessment of each service provider should be verified with their current documentation. This document does not constitute legal advice.*
