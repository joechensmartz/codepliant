# Compliance Onboarding Guide

> **[Your Company Name]** — New Employee Compliance Onboarding
>
> Generated on 2026-03-16 by [Codepliant](https://github.com/joechensmartz/codepliant)
> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16

## 1. Welcome

Welcome to [Your Company Name]. This guide will help you understand your compliance responsibilities from day one. Data protection and security are everyone's responsibility — not just the legal team's.

**Why this matters:** Our application processes user data through multiple services and platforms. Every team member who touches code, data, or infrastructure must understand the rules that govern how we handle that data.

## 2. Key Contacts

| Role | Contact |
|------|---------|
| **Privacy / Compliance Lead** | [your-email@example.com] |
| **Security Team** | [your-email@example.com] |
| **Incident Reporting** | [your-email@example.com] — report immediately, do not wait |

> **Rule of thumb:** If you are unsure whether something involves personal data or a compliance obligation, ask. It is always better to ask first than to fix a breach later.

## 3. Services That Process User Data

The following third-party services have been detected in our codebase. Each one processes user data and is covered by our compliance documentation:

| Service | Category | Data Processed |
|---------|----------|---------------|
| @aws-sdk/client-s3 | File Storage | uploaded files, file metadata |
| @segment/analytics-next | Analytics | user identity, user behavior, page views, custom events, device information, IP address |
| @sendgrid/mail | Email Service | email addresses, email content |
| algoliasearch | Other | search queries, search result clicks, user search behavior |
| cookie-parser | Other | cookies, cookie data |
| express-session | Other | session cookies, session data |
| ioredis | Database | cached data, session data |
| Multer | File Storage | uploaded files, file metadata, potential PII in uploaded content |
| openai | AI Service | user prompts, conversation history, generated content |
| posthog | Analytics | user behavior, session recordings, feature flag usage, device information |
| stripe | Payment Processing | payment information, billing address, email, transaction history |

**Total services:** 11. Before integrating a new service, check with the compliance lead to ensure it is added to our sub-processor list and covered by a Data Processing Agreement.

## 4. Required Reading — Priority Order

Read these documents in order. Each phase builds on the previous one.

### Day 1 — Immediate

| Document | Why You Need It |
|----------|----------------|
| [Privacy Policy](./PRIVACY_POLICY.md) | Understand what user data the company collects and how it is processed |
| [Acceptable Use Policy](./ACCEPTABLE_USE_POLICY.md) | Know what is and is not permitted when using company systems |
| [Security Policy](./SECURITY.md) | Understand baseline security expectations (passwords, MFA, device handling) |

### Week 1 — Core Compliance

| Document | Why You Need It |
|----------|----------------|
| [Data Protection Policy](./DATA_PROTECTION_POLICY.md) | Learn how the company classifies and handles personal data |
| [Incident Response Plan](./INCIDENT_RESPONSE_PLAN.md) | Know what to do if you discover a data breach or security incident |
| [Access Control Policy](./ACCESS_CONTROL_POLICY.md) | Understand role-based access, least privilege, and how to request permissions |
| [Employee Privacy Notice](./EMPLOYEE_PRIVACY_NOTICE.md) | Understand what data the company collects about you as an employee |

### Week 2 — Operational

| Document | Why You Need It |
|----------|----------------|
| [Data Retention Policy](./DATA_RETENTION_POLICY.md) | Know how long data is kept and when it must be deleted |
| [DSAR Handling Guide](./DSAR_HANDLING_GUIDE.md) | Know how to handle data subject access requests from users |
| [Change Management Policy](./CHANGE_MANAGEMENT_POLICY.md) | Follow proper procedures for code changes and deployments |
| [Consent Management Guide](./CONSENT_MANAGEMENT_GUIDE.md) | Understand how user consent is collected and managed |

### Month 1 — Deep Dive

| Document | Why You Need It |
|----------|----------------|
| [Data Processing Agreement](./DATA_PROCESSING_AGREEMENT.md) | Understand contractual obligations with data processors |
| [Sub-Processor List](./SUBPROCESSOR_LIST.md) | Know which third-party services process user data |
| [Compliance Roadmap](./COMPLIANCE_ROADMAP.md) | Understand the company's compliance goals and timeline |
| [Risk Register](./RISK_REGISTER.md) | Review identified compliance risks and mitigation strategies |

### AI-Specific Reading (Required for AI Team Members)

Our application uses AI services. If you work on AI features or use AI tools in your workflow, these are mandatory:

| Document | Why You Need It |
|----------|----------------|
| [AI Disclosure](./AI_DISCLOSURE.md) | Understand how AI usage is disclosed to end users (EU AI Act Art. 50) |
| [Acceptable AI Use Policy](./ACCEPTABLE_AI_USE_POLICY.md) | Know the rules for using AI tools in your work |
| [AI Governance Framework](./AI_GOVERNANCE_FRAMEWORK.md) | Understand the oversight structure for AI systems |

## 5. Key Policies — Quick Reference

### Data Handling Rules

- **Never** store personal data in logs, comments, or debug output
- **Never** share production data in Slack, email, or tickets
- **Never** copy production data to development environments without anonymization
- **Always** use the minimum amount of data necessary for your task
- **Always** encrypt personal data in transit and at rest

### Access & Authentication

- Enable MFA on all accounts (corporate and third-party services)
- Use unique, strong passwords via the company password manager
- Never share credentials or API keys via email, Slack, or code commits
- Request only the access permissions you need — least privilege principle

### Incident Response

If you discover or suspect a data breach or security incident:

1. **Report immediately** — contact the security team within 1 hour
2. **Do not attempt to fix it yourself** unless you are on the incident response team
3. **Preserve evidence** — do not delete logs, emails, or files related to the incident
4. **Document everything** — note the time, what you observed, and what actions you took

> Under GDPR, we have **72 hours** to report certain breaches to supervisory authorities. The clock starts when we become aware — that means your speed in reporting matters.

### Payment Data (PCI DSS)

- Never log, screenshot, or store raw payment card numbers
- Payment data is handled exclusively through our payment processor (see Sub-Processor List)
- If you encounter raw payment data anywhere in the system, report it immediately

### AI Usage Rules

- Do not input sensitive personal data (PII, health data, financial data) into AI tools unless explicitly authorized
- All AI-generated outputs must be reviewed by a human before being used in decisions affecting users
- AI tool usage must comply with the Acceptable AI Use Policy
- Users must be informed when they are interacting with AI systems (EU AI Act Art. 50)

## 6. Onboarding Checklist

Complete these items within your first 30 days:

- [ ] Read all Day 1 documents (Privacy Policy, AUP, Security Policy)
- [ ] Enable MFA on all corporate accounts
- [ ] Set up the company password manager
- [ ] Read all Week 1 documents (Data Protection, Incident Response, Access Control)
- [ ] Complete security awareness training (if available)
- [ ] Review the services list above — understand which ones you interact with
- [ ] Read all Week 2 documents (Data Retention, DSAR, Change Management)
- [ ] Read all Month 1 documents (DPA, Sub-Processors, Roadmap, Risk Register)
- [ ] Read AI-specific documents (if applicable to your role)
- [ ] Sign the Compliance Acknowledgment (contact compliance lead)
- [ ] Know how to report an incident — save the contact info from Section 2

## 7. Frequently Asked Questions

**Q: I found personal data in a log file. What do I do?**
A: Report it to the security team immediately. Do not delete the log — they will handle remediation and assess whether it constitutes a breach.

**Q: A user asked me to delete their data. What do I do?**
A: Forward the request to the compliance lead. Do not delete data yourself — there is a formal DSAR process that must be followed (see DSAR Handling Guide).

**Q: I want to add a new third-party service to the project. Do I need approval?**
A: Yes. Any new service that processes user data must be reviewed by the compliance lead before integration. It needs a DPA review and must be added to the sub-processor list.

**Q: Can I use ChatGPT / Claude / other AI tools for work?**
A: Yes, within the boundaries of our Acceptable AI Use Policy. Do not input sensitive personal data. All outputs must be reviewed before use.

**Q: Where do I find all compliance documents?**
A: All documents are in the `legal/` directory of the project repository. Start with the Compliance Policy Index for a full listing.

---

*This Compliance Onboarding Guide was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on code analysis. It should be reviewed by your compliance and HR teams before distribution to new employees.*
