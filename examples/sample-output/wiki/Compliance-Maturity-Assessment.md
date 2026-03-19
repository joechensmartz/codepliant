> **Document Version:** 1.0  
> **Document Owner:** Acme Inc  
> **Next Review Date:** 2027-03-18


**Organization:** Acme Inc

**Assessment Date:** 2026-03-18

**Assessor:** [NAME / TITLE]

This self-assessment questionnaire evaluates compliance program maturity across six domains. Each question is scored on a 1–5 scale. Questions marked `[AUTO]` have been pre-filled based on automated code analysis. Review and adjust all scores before finalizing.

## Scoring Guide

| Score | Level | Description |
|-------|-------|-------------|
| 1 | Initial | Ad-hoc, no formal process |
| 2 | Developing | Basic processes exist but inconsistently applied |
| 3 | Defined | Documented processes, consistently followed |
| 4 | Managed | Measured, monitored, and continuously improved |
| 5 | Optimized | Industry-leading, fully automated and integrated |

## Maturity Summary

| Domain | Auto-Score | Questions Assessed | Maturity Level |
|--------|-----------|-------------------|----------------|
| Governance & Leadership | 2.8/5.0 [███░░] | 4/9 | Defined (Level 3) |
| Privacy & Data Protection | 3.2/5.0 [███░░] | 6/9 | Defined (Level 3) |
| Information Security | 3.0/5.0 [███░░] | 4/9 | Defined (Level 3) |
| Vendor & Third-Party Risk | 3.0/5.0 [███░░] | 3/8 | Defined (Level 3) |
| AI Governance & Ethics | 3.0/5.0 [███░░] | 3/8 | Defined (Level 3) |
| Incident Response & Business Continuity | 3.0/5.0 [███░░] | 3/7 | Defined (Level 3) |

**Overall Maturity Score:** 3.0/5.0 — **Defined (Level 3)**

**Questions Auto-Assessed:** 23/50 (46%)

**Questions Requiring Manual Assessment:** 27

**Maximum Possible Score:** 250 (50 questions × 5 points)

## Governance & Leadership

> Organizational commitment to compliance, executive sponsorship, and program management.

| # | Question | Score (1-5) | Justification |
|---|----------|------------|---------------|
| GOV-01 | Is there a formal compliance program with executive sponsorship? | [AUTO] 3 | [AUTO] Compliance documentation generated via automated scanning |
| GOV-02 | Are compliance policies documented, approved, and distributed to all staff? | [AUTO] 3 | [AUTO] Automated compliance scanning provides baseline policy framework |
| GOV-03 | Is there a dedicated compliance officer or team? | [ ] ___ | [MANUAL] | |
| GOV-04 | Is the scope of compliance obligations clearly defined? | [AUTO] 3 | [AUTO] 8 services detected — compliance scope is well-defined |
| GOV-05 | Are compliance roles and responsibilities assigned across the organization? | [ ] ___ | [MANUAL] | |
| GOV-06 | Is compliance training provided to all employees at least annually? | [ ] ___ | [MANUAL] | |
| GOV-07 | Are compliance policies reviewed and updated at least annually? | [AUTO] 2 | [AUTO] Automated compliance document generation provides baseline documentation |
| GOV-08 | Is there a compliance committee or steering group that meets regularly? | [ ] ___ | [MANUAL] | |
| GOV-09 | Are compliance metrics reported to the board or senior leadership? | [ ] ___ | [MANUAL] | |

## Privacy & Data Protection

> Data privacy program maturity, GDPR/CCPA readiness, and data subject rights handling.

| # | Question | Score (1-5) | Justification |
|---|----------|------------|---------------|
| PRI-01 | Is there a comprehensive, up-to-date privacy policy? | [AUTO] 4 | [AUTO] Privacy policy auto-generated from code analysis |
| PRI-02 | Is there a complete data inventory/flow map of all personal data processing? | [AUTO] 3 | [AUTO] Data flow map generated from detected services |
| PRI-03 | Is there a documented process for handling data subject access requests (DSARs)? | [AUTO] 3 | [AUTO] DSAR handling guide generated |
| PRI-04 | Is consent obtained and recorded for all data processing requiring it? | [AUTO] 3 | [AUTO] Consent management guide generated for detected analytics services |
| PRI-05 | Are data protection impact assessments (DPIAs) conducted for high-risk processing? | [ ] ___ | [MANUAL] | |
| PRI-06 | Is there a documented data retention policy with defined retention periods? | [AUTO] 3 | [AUTO] Data retention policy auto-generated |
| PRI-07 | Is there a lawful basis assessment for each data processing activity? | [ ] ___ | [MANUAL] | |
| PRI-08 | Is a Record of Processing Activities (ROPA) maintained and current? | [AUTO] 3 | [AUTO] Record of processing activities generated (GDPR Art. 30) |
| PRI-09 | Are cross-border data transfers assessed and safeguarded (e.g., SCCs, adequacy decisions)? | [ ] ___ | [MANUAL] | |

## Information Security

> Technical and organizational security controls, vulnerability management, and access control.

| # | Question | Score (1-5) | Justification |
|---|----------|------------|---------------|
| SEC-01 | Is authentication required for all system access, with MFA for privileged accounts? | [AUTO] 4 | [AUTO] Authentication service detected: @supabase/supabase-js |
| SEC-02 | Is there continuous security monitoring and alerting in place? | [AUTO] 3 | [AUTO] Monitoring detected: @sentry/node |
| SEC-03 | Is there a documented access control policy with role-based access? | [ ] ___ | [MANUAL] | |
| SEC-04 | Are regular vulnerability scans and penetration tests conducted? | [AUTO] 3 | [AUTO] Vulnerability scanning included in compliance toolchain |
| SEC-05 | Is there a secure software development lifecycle (SDLC) with code review? | [ ] ___ | [MANUAL] | |
| SEC-06 | Is data encrypted at rest and in transit? | [AUTO] 2 | [AUTO] Database service detected (prisma) — encryption at rest needs manual verification |
| SEC-07 | Are security patches applied within defined SLAs? | [ ] ___ | [MANUAL] | |
| SEC-08 | Is there network segmentation between production and development environments? | [ ] ___ | [MANUAL] | |
| SEC-09 | Are audit logs maintained, protected from tampering, and reviewed regularly? | [ ] ___ | [MANUAL] | |

## Vendor & Third-Party Risk

> Third-party risk management, vendor due diligence, and sub-processor oversight.

| # | Question | Score (1-5) | Justification |
|---|----------|------------|---------------|
| VEN-01 | Is there a complete inventory of all third-party services and sub-processors? | [AUTO] 3 | [AUTO] 8 third-party services detected and inventoried |
| VEN-02 | Are Data Processing Agreements (DPAs) in place with all sub-processors? | [AUTO] 3 | [AUTO] Sub-processor list auto-generated from code analysis |
| VEN-03 | Is vendor due diligence performed before onboarding new services? | [ ] ___ | [MANUAL] | |
| VEN-04 | Are third-party risk assessments conducted and documented? | [AUTO] 3 | [AUTO] Third-party risk assessment generated |
| VEN-05 | Is there a vendor exit strategy for critical third-party dependencies? | [ ] ___ | [MANUAL] | |
| VEN-06 | Are sub-processor changes communicated to affected data subjects? | [ ] ___ | [MANUAL] | |
| VEN-07 | Are vendor SLAs monitored and reviewed at least annually? | [ ] ___ | [MANUAL] | |
| VEN-08 | Is there a process for revoking vendor access upon contract termination? | [ ] ___ | [MANUAL] | |

## AI Governance & Ethics

> AI risk management, transparency, fairness, and compliance with AI regulations (EU AI Act, etc.).

| # | Question | Score (1-5) | Justification |
|---|----------|------------|---------------|
| AI-01 | Is there an inventory of all AI/ML systems with risk classifications? | [AUTO] 3 | [AUTO] AI services detected: openai |
| AI-02 | Is AI usage disclosed to end users with clear explanations? | [AUTO] 3 | [AUTO] AI disclosure document generated |
| AI-03 | Are AI outputs monitored for bias, accuracy, and safety? | [ ] ___ | [MANUAL] | |
| AI-04 | Is there a process for users to opt out of AI-driven decisions? | [ ] ___ | [MANUAL] | |
| AI-05 | Is there an AI governance framework aligned with regulations (EU AI Act, NIST AI RMF)? | [AUTO] 3 | [AUTO] AI governance framework generated |
| AI-06 | Are AI model cards or system documentation maintained? | [ ] ___ | [MANUAL] | |
| AI-07 | Is human oversight provided for high-risk AI decisions? | [ ] ___ | [MANUAL] | |
| AI-08 | Are AI training data sources documented and assessed for legality? | [ ] ___ | [MANUAL] | |

## Incident Response & Business Continuity

> Incident detection, response, communication, and recovery capabilities.

| # | Question | Score (1-5) | Justification |
|---|----------|------------|---------------|
| INC-01 | Is there a documented and tested incident response plan? | [AUTO] 3 | [AUTO] Incident response plan auto-generated |
| INC-02 | Are breach notification templates prepared per applicable jurisdiction? | [AUTO] 3 | [AUTO] Data breach notification templates generated per jurisdiction |
| INC-03 | Is there a dedicated incident response team with clear escalation paths? | [ ] ___ | [MANUAL] | |
| INC-04 | Is there an incident severity classification system? | [AUTO] 3 | [AUTO] Incident severity matrix generated (P0-P4) |
| INC-05 | Are post-incident reviews conducted with lessons learned? | [ ] ___ | [MANUAL] | |
| INC-06 | Is there a business continuity plan with defined RTO/RPO? | [ ] ___ | [MANUAL] | |
| INC-07 | Are disaster recovery procedures tested at least annually? | [ ] ___ | [MANUAL] | |

## Improvement Action Plan

Based on the assessment results, prioritize the following areas:

| Priority | Domain | Current | Target | Action Required | Owner | Deadline |
|----------|--------|---------|--------|----------------|-------|----------|
| 1 | Governance & Leadership | 2.8 | 3.8 | [DESCRIBE ACTIONS] | [OWNER] | [DATE] |
| 2 | Information Security | 3.0 | 4.0 | [DESCRIBE ACTIONS] | [OWNER] | [DATE] |
| 3 | Vendor & Third-Party Risk | 3.0 | 4.0 | [DESCRIBE ACTIONS] | [OWNER] | [DATE] |
| 4 | AI Governance & Ethics | 3.0 | 4.0 | [DESCRIBE ACTIONS] | [OWNER] | [DATE] |
| 5 | Incident Response & Business Continuity | 3.0 | 4.0 | [DESCRIBE ACTIONS] | [OWNER] | [DATE] |
| 6 | Privacy & Data Protection | 3.2 | 4.2 | [DESCRIBE ACTIONS] | [OWNER] | [DATE] |

## Assessment Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Assessor | [NAME] | _______________ | [DATE] |
| Compliance Officer | [NAME] | _______________ | [DATE] |
| Executive Sponsor | [NAME] | _______________ | [DATE] |

## Next Assessment

Recommended next assessment date: **2026-06-16** (quarterly cadence).

---

*This compliance maturity assessment was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **nextjs-saas-example** codebase. Auto-scored questions should be verified by your compliance team. This assessment does not constitute legal advice or formal certification.*
