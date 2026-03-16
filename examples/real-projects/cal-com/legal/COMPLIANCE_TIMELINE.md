# Compliance Timeline

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Company:** [Your Company Name]
**Last updated:** 2026-03-16
**Project:** calcom-monorepo

## Related Documents

- Compliance Notes (`COMPLIANCE_NOTES.md`)
- Annual Review Checklist (`ANNUAL_REVIEW_CHECKLIST.md`)
- Regulatory Updates (`REGULATORY_UPDATES.md`)

---

This document outlines key compliance deadlines, ongoing obligations, and recommended action items based on the services detected in your codebase.

> **Disclaimer:** This is not legal advice. Consult qualified legal counsel to confirm applicable deadlines and obligations for your specific situation.

## 1. Key Regulatory Deadlines

| Date | Deadline | Regulation |
|------|----------|------------|
| Jan 1, 2023 | Virginia CDPA — Effective date | Virginia state privacy law |
| Jul 1, 2023 | Colorado Privacy Act (CPA) — Effective date | Colorado state privacy law |
| Jul 1, 2023 | Connecticut Data Privacy Act (CTDPA) — Effective date | Connecticut state privacy law |
| Dec 31, 2023 | Utah Consumer Privacy Act (UCPA) — Effective date | Utah state privacy law |
| Jul 1, 2024 | Oregon Consumer Privacy Act — Effective date | Oregon state privacy law |
| Jul 1, 2024 | Texas Data Privacy and Security Act (TDPSA) — Effective date | Texas state privacy law |
| Oct 1, 2024 | Montana Consumer Data Privacy Act — Effective date | Montana state privacy law |
| Jan 1, 2025 | Iowa Consumer Data Protection Act — Effective date | Iowa state privacy law |
| Jan 1, 2025 | Delaware Personal Data Privacy Act — Effective date | Delaware state privacy law |
| Jan 1, 2025 | New Hampshire Privacy Act — Effective date | New Hampshire state privacy law |
| Jan 1, 2025 | Nebraska Data Privacy Act — Effective date | Nebraska state privacy law |
| Jan 15, 2025 | New Jersey Data Privacy Act — Effective date | New Jersey state privacy law |
| Jul 1, 2025 | Tennessee Information Protection Act — Effective date | Tennessee state privacy law |
| Jul 31, 2025 | Minnesota Consumer Data Privacy Act — Effective date | Minnesota state privacy law |
| Oct 1, 2025 | Maryland Online Data Privacy Act — Effective date | Maryland state privacy law |
| Jan 1, 2026 | Indiana Consumer Data Protection Act — Effective date | Indiana state privacy law |
| Jan 1, 2026 | Kentucky Consumer Data Protection Act — Effective date | Kentucky state privacy law |
| Jan 1, 2026 | Rhode Island Data Transparency and Privacy Protection Act — Effective date | Rhode Island state privacy law |
| Annually (Jan 1) | CCPA/CPRA — Annual privacy policy review and update | California Consumer Privacy Act / California Privacy Rights Act |
| Ongoing | GDPR — Continuous compliance obligations | General Data Protection Regulation (EU) 2016/679 |
| Ongoing | PCI DSS — Annual self-assessment and ongoing compliance | Payment Card Industry Data Security Standard v4.0.1 |


## 2. Project-Specific Obligations

Based on the 23 service(s) detected in **calcom-monorepo**, the following obligations apply:

### Payment Services (stripe)

- **Ongoing** — PCI DSS annual self-assessment required
- **Ongoing** — Quarterly vulnerability scans (ASV) if applicable
- **Ongoing** — Ensure no raw card data is stored post-authorization

### Analytics / Advertising Services (Google Analytics, Google Tag Manager, Plausible Analytics, posthog)

- **Ongoing** — Cookie consent mechanism must be maintained (ePrivacy Directive)
- **Ongoing** — Honor "Do Not Sell or Share" requests (CCPA/CPRA)
- **Ongoing** — Respect Global Privacy Control (GPC) signals
- **Annually** — Review analytics data sharing for CCPA "sale" classification

### Authentication Services (google-auth-library, next-auth, passport)

- **Ongoing** — Maintain data subject access request (DSAR) procedures
- **Ongoing** — Review session data retention periods
- **Ongoing** — Ensure authentication data processing agreements are current

### Email Services (@sendgrid/mail, nodemailer)

- **Ongoing** — Maintain CAN-SPAM / GDPR consent records for marketing emails
- **Ongoing** — Provide working unsubscribe mechanisms
- **Ongoing** — Review email service DPAs annually

### Storage / Database Services (@upstash/redis, ioredis, PostgreSQL, PostgreSQL (env), prisma, Redis, Redis (env))

- **Ongoing** — Enforce data retention schedules
- **Ongoing** — Ensure encryption at rest for personal data
- **Ongoing** — Verify backup and disaster recovery procedures



## 3. Action Items

### Immediate (verify now)

- [ ] Verify GDPR privacy notice is published and accurate
- [ ] Confirm Record of Processing Activities is up to date
- [ ] Verify CCPA disclosures are included in privacy policy
- [ ] Confirm "Do Not Sell or Share" link is functional
- [ ] Verify PCI DSS Self-Assessment Questionnaire is current
- [ ] Verify cookie consent mechanism is operational

### Ongoing

- [ ] Re-run Codepliant after adding or removing services
- [ ] Review and update all compliance documents at least annually
- [ ] Respond to data subject requests within 30 days (GDPR Art. 12)
- [ ] Respond to consumer requests within 45 days (CCPA)
- [ ] Maintain PCI DSS compliance and complete annual assessment


## 4. Recommended Review Schedule

| Frequency | Activity |
|-----------|----------|
| Monthly | Review data breach and incident logs |
| Monthly | Verify consent mechanisms are operational |
| Quarterly | Re-run Codepliant to detect new services or dependencies |
| Quarterly | Review and update data processing agreements |
| Semi-annually | Conduct internal compliance audit |
| Annually | Full privacy policy review and update |
| Annually | Staff data protection training refresh |
| Annually | Review regulatory landscape for new obligations |
| Annually | PCI DSS Self-Assessment Questionnaire |

> **Tip:** Set calendar reminders for each review activity. Compliance drift is the most common cause of regulatory exposure.


---

*This compliance timeline was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. It is for informational purposes only and does not constitute legal advice.*