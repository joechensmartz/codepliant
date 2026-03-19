# Vendor Security Questionnaire

> **Document Version:** 1.0  
> **Document Owner:** Acme Inc  
> **Next Review Date:** 2027-03-18


**Vendor:** Acme Inc

**Completed by:** [NAME / TITLE]

**Date:** 2026-03-18

**Contact:** legal@acme.com

This questionnaire follows the SIG Lite (Standardized Information Gathering) format and has been pre-populated based on automated analysis of the codebase. Review and update all answers before submitting to customers.

> **Legend:** Answers prefixed with `[AUTO]` were derived from code analysis. Answers prefixed with `[MANUAL]` require human input.

## 1. Company Information

| Question | Answer |
|----------|--------|
| Company legal name | Acme Inc |
| Company website | https://acme-saas.com |
| Primary security contact | legal@acme.com |
| Data Protection Officer | Jane Mueller (dpo@acme-saas.com) |
| Company headquarters location | [MANUAL] [LOCATION] |
| Number of employees | [MANUAL] |
| Year founded | [MANUAL] |
| Do you carry cyber liability insurance? | [MANUAL] Yes / No |

## 2. Security Governance

| Question | Answer |
|----------|--------|
| Do you have a dedicated security team? | [MANUAL] Yes / No |
| Do you have a written information security policy? | [MANUAL] Yes / No |
| Do you conduct regular security awareness training? | [MANUAL] Yes / No |
| Do you have an incident response plan? | [AUTO] Yes — generated as part of compliance documentation |
| Do you conduct regular risk assessments? | [MANUAL] Yes / No |
| Do you have a business continuity / disaster recovery plan? | [MANUAL] Yes / No |

## 3. Certifications & Compliance

| Question | Answer |
|----------|--------|
| SOC 2 Type I or II certification? | [MANUAL] Yes / No — Type: __ |
| ISO 27001 certified? | [MANUAL] Yes / No |
| GDPR compliant? | [AUTO] Compliance documentation generated — [MANUAL] confirm operational compliance |
| PCI DSS compliant? | [AUTO] Payment processing detected (via Stripe/PayPal) — payments are handled by PCI-compliant third party |
| HIPAA compliant? | [MANUAL] Yes / No / N/A |
| Do you undergo regular third-party penetration testing? | [MANUAL] Yes / No — Frequency: __ |
| Do you have a bug bounty or vulnerability disclosure program? | [MANUAL] Yes / No |

## 4. Access Control

| Question | Answer |
|----------|--------|
| Do you require authentication for access? | [AUTO] Yes — authentication implemented via @supabase/supabase-js |
| Do you support multi-factor authentication (MFA)? | [MANUAL] Yes / No |
| Do you enforce role-based access control (RBAC)? | [MANUAL] Yes / No |
| Do you enforce least-privilege access? | [MANUAL] Yes / No |
| How are user sessions managed? | [MANUAL] [DESCRIBE SESSION MANAGEMENT] |
| Do you support Single Sign-On (SSO)? | [MANUAL] Yes / No — Protocol: SAML / OIDC |
| Do you log all access events? | [MANUAL] Yes / No |

## 5. Data Protection

| Question | Answer |
|----------|--------|
| Is data encrypted at rest? | [MANUAL] Yes / No — Algorithm: __ |
| Is data encrypted in transit? | [AUTO] Yes — HTTPS/TLS required for all communications |
| Where is data stored? | [AUTO] Database services detected: prisma — [MANUAL] specify hosting region |
| Do you use a key management service? | [MANUAL] Yes / No |
| Do you have a data retention policy? | [AUTO] Yes — generated as part of compliance documentation |
| Do you have a data classification scheme? | [AUTO] Yes — data classification report generated |
| Can you delete customer data on request? | [MANUAL] Yes / No — Process: __ |
| Do you have a data backup strategy? | [MANUAL] Yes / No — Frequency: __ |

## 6. Application Security

| Question | Answer |
|----------|--------|
| Do you follow a secure software development lifecycle (SDLC)? | [MANUAL] Yes / No |
| Do you conduct code reviews? | [MANUAL] Yes / No |
| Do you perform static application security testing (SAST)? | [MANUAL] Yes / No |
| Do you perform dynamic application security testing (DAST)? | [MANUAL] Yes / No |
| Do you scan dependencies for known vulnerabilities? | [AUTO] Yes — dependency vulnerability scanning is part of the compliance process |
| Do you use error monitoring / observability? | [AUTO] Yes — @sentry/node |
| Do you have a WAF (Web Application Firewall)? | [MANUAL] Yes / No |
| Do you protect against OWASP Top 10 vulnerabilities? | [MANUAL] Yes / No |

## 7. Infrastructure Security

| Question | Answer |
|----------|--------|
| Where is your application hosted? | [MANUAL] [CLOUD PROVIDER / REGION] |
| Do you use a CDN? | [MANUAL] Yes / No |
| Do you use container orchestration? | [MANUAL] Yes / No |
| Do you have network segmentation? | [MANUAL] Yes / No |
| Do you use intrusion detection / prevention systems? | [MANUAL] Yes / No |
| Do you perform regular vulnerability scanning of infrastructure? | [MANUAL] Yes / No — Frequency: __ |

## 8. Third-Party Risk Management

| Question | Answer |
|----------|--------|
| How many third-party sub-processors do you use? | [AUTO] 8 sub-processor(s) detected |
| Do you maintain a sub-processor list? | [AUTO] Yes — generated as part of compliance documentation |
| Do you have DPAs with all sub-processors? | [MANUAL] Yes / No |
| Do you assess the security posture of sub-processors? | [MANUAL] Yes / No |
| Do you notify customers of sub-processor changes? | [MANUAL] Yes / No |

## 9. Incident Response

| Question | Answer |
|----------|--------|
| Do you have a documented incident response plan? | [AUTO] Yes — incident response plan generated |
| What is your breach notification timeline? | [AUTO] Within 72 hours (GDPR), within 30-60 days (US state laws) |
| Do you conduct post-incident reviews? | [MANUAL] Yes / No |
| Do you have a dedicated incident response team? | [MANUAL] Yes / No |
| Security incident reporting email | legal@acme.com |

## 10. AI & Machine Learning

| Question | Answer |
|----------|--------|
| Does the application use AI/ML services? | [AUTO] Yes — openai |
| What data is sent to AI services? | [AUTO] user prompts, conversation history, generated content |
| Is AI-generated content identified to users? | [MANUAL] Yes / No |
| Do you have safeguards against AI bias? | [MANUAL] Yes / No |
| Can customers opt out of AI processing? | [MANUAL] Yes / No |
| Do AI providers use customer data for training? | [MANUAL] Yes / No — [VERIFY WITH EACH PROVIDER] |

## 11. Privacy & Data Subject Rights

| Question | Answer |
|----------|--------|
| Do you have a published privacy policy? | [AUTO] Yes — generated as part of compliance documentation |
| Do you support data subject access requests (DSAR)? | [AUTO] DSAR handling guide generated |
| Do you support the right to erasure? | [MANUAL] Yes / No — Process: __ |
| Do you support data portability? | [MANUAL] Yes / No — Format: __ |
| Do you obtain consent for analytics/tracking? | [MANUAL] Yes / No — [AUTO] consent management guide generated |
| Do you process data of minors (under 16)? | [MANUAL] Yes / No |

## Related Documents

- Third-Party Risk Assessment (`THIRD_PARTY_RISK_ASSESSMENT.md`)
- Supplier Code of Conduct (`SUPPLIER_CODE_OF_CONDUCT.md`)

---

*This vendor security questionnaire was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **nextjs-saas-example** codebase. Answers marked [AUTO] are derived from code analysis and should be verified. Answers marked [MANUAL] require input from your security and compliance teams. This document is not a substitute for a formal security assessment.*
