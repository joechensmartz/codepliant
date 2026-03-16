# Compliance Board Report — Q1 2026

> **Prepared for:** Board of Directors, [Your Company Name]
> **Report Period:** Q1 2026
> **Classification:** Confidential — Board Use Only
> **Prepared on:** 2026-03-16
> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16

---

## 1. Executive Summary

[Your Company Name] operates a technology stack comprising **23 third-party services** across 7 categories. This report provides an overview of our compliance posture, key risks, regulatory developments, and budget status for Q1 2026.

### Key Metrics at a Glance

| Metric | Status |
|--------|--------|
| **Overall Risk Level** | 🔴 Critical |
| **Third-Party Services** | 23 |
| **Data Processing Categories** | 7 |
| **Data Categories Detected** | 7 |
| **Compliance Documents Generated** | Auto-generated via Codepliant |
| **AI Services Active** | No |
| **Payment Processing** | Yes |
| **Open Incidents** | [To be filled by compliance team] |
| **DSARs This Quarter** | [To be filled by compliance team] |

### Board Action Items

- [ ] Review and approve updated compliance budget
- [ ] Acknowledge risk register updates
- [ ] Confirm PCI DSS compliance status
- [ ] Approve vendor risk acceptance for Critical/High-tier vendors
- [ ] Schedule next quarterly compliance review

---

## 2. Risk Heatmap

### Likelihood vs Impact Matrix

```
Impact →    Low         Medium      High        Critical
Likelihood
  ↓
  High     │ Analytics  │ Auth breach │             │ Payment fraud │
  Medium   │ Cookie     │ DSAR delay  │ Data breach │ Regulatory   │
  Low      │ Config     │ Vendor risk │ Compliance  │ Class action │
```

### Risk by Service Category

| Category | Services | Risk Level | Key Concern |
|----------|----------|------------|-------------|
| Payment Processing | 1 | High | PCI DSS compliance, fraud liability |
| Authentication | 3 | Medium | Credential breach, account takeover |
| Analytics | 4 | Medium | Cookie consent, cross-border transfers |
| Monitoring | 1 | Low | Data minimization, retention |
| Other | 5 | Medium | Vendor dependency, data processing |
| Email | 2 | Medium | Vendor dependency, data processing |
| Database | 7 | Medium | Vendor dependency, data processing |

---

## 3. Regulatory Updates

Key regulatory developments relevant to [Your Company Name] this quarter:

### Active Regulations

| Regulation | Status | Impact on ${company} | Action Required |
|------------|--------|---------------------|-----------------|
| GDPR (EU) | **Active** | Direct — EU data subjects | Ongoing compliance monitoring |
| UK GDPR | **Active** | Direct — UK data subjects | Separate adequacy assessment |
| PCI DSS v4.0 | **Active** | Direct — payment processing | Annual compliance assessment |
| NIS2 Directive | **Active (EU)** | Monitor — network security | Security measures review |
| DORA (EU) | **Active** | Monitor — digital operational resilience | ICT risk management |

### Upcoming Changes

- **EU AI Act enforcement timeline:** Prohibited AI practices (Feb 2025), GPAI obligations (Aug 2025), Full enforcement (Aug 2026)
- **ePrivacy Regulation:** Still in legislative process; expected to replace ePrivacy Directive
- **US Federal Privacy:** American Privacy Rights Act (APRA) — monitoring for progress
- **State-level privacy laws:** New state laws coming into effect annually; monitor for applicability

---

## 4. Budget vs Actual

> **Tier:** Enterprise | **Total Annual Budget:** $390,000

| Category | Annual Budget | YTD Actual | YTD Budget | Variance |
|----------|-------------|-----------|-----------|----------|
| Legal & Advisory | $100,000 | [Actual] | $25,000 | [Variance] |
| Tools & Software | $60,000 | [Actual] | $15,000 | [Variance] |
| Training & Awareness | $30,000 | [Actual] | $7,500 | [Variance] |
| Audit & Certification | $150,000 | [Actual] | $37,500 | [Variance] |
| Insurance | $50,000 | [Actual] | $12,500 | [Variance] |
| **Total** | **$390,000** | **[Actual]** | **$97,500** | **[Variance]** |

> **Note:** Fill in actual spend figures from your finance team. Codepliant generates the budget framework; actual tracking requires manual input.

---

## 5. Compliance Program Status

### Document Coverage

| Area | Documents Generated | Status |
|------|-------------------|--------|
| Privacy & Data Protection | Privacy Policy, DPA, DSAR Guide, Cookie Policy | Generated |
| Security | Security Policy, Incident Response, Access Control | Generated |
| Legal | Terms of Service, Acceptable Use, Refund Policy | Generated |
| Vendor Management | Vendor Contacts, Sub-Processor List, Vendor Onboarding | Generated |
| Audit & Certification | SOC 2 Checklist, ISO 27001, Risk Register | Generated |

### Key Achievements This Quarter

- [ ] [Fill in completed compliance initiatives]
- [ ] [Fill in resolved audit findings]
- [ ] [Fill in completed training programs]
- [ ] [Fill in vendor assessments completed]

### Planned for Next Quarter

- [ ] [Fill in planned compliance initiatives]
- [ ] [Fill in upcoming audits or assessments]
- [ ] [Fill in planned policy updates]
- [ ] [Fill in training schedule]

---

## 6. Incident & DSAR Summary

### Security Incidents

| # | Date | Severity | Description | Status | Resolution Time |
|---|------|----------|-------------|--------|-----------------|
| 1 | [Date] | [P0-P4] | [Description] | [Open/Closed] | [Duration] |

> Fill in actual incident data. If no incidents occurred this quarter, note "No reportable incidents in this period."

### Data Subject Access Requests (DSARs)

| Metric | Count |
|--------|-------|
| DSARs Received | [Count] |
| DSARs Completed | [Count] |
| Average Response Time | [Days] |
| DSARs Pending | [Count] |
| Requests Exceeding 30-Day SLA | [Count] |

---

## 7. Strategic Recommendations

1. **Maintain automated compliance scanning** — Continue using Codepliant for ongoing document generation to ensure compliance artifacts stay current with code changes.

2. **Vendor consolidation review** — With 23 third-party services, evaluate opportunities to reduce vendor footprint and associated compliance overhead.

3. **Legal review cycle** — Schedule annual legal review of all auto-generated compliance documents to ensure they reflect current business practices and regulatory requirements.

4. **Board compliance training** — Consider annual board-level compliance awareness briefing to maintain governance effectiveness.

---

## Appendix A: Detected Services

| # | Service | Category | Data Processor | Data Collected |
|---|---------|----------|----------------|----------------|
| 1 | @hubspot/api-client | other | Yes | contact information, email addresses, names +4 more |
| 2 | @sendgrid/mail | email | Yes | email addresses, email content |
| 3 | @sentry/nextjs | monitoring | Yes | error data, stack traces, user context +3 more |
| 4 | @upstash/redis | database | Yes | cached data, session data |
| 5 | Google Analytics | analytics | Yes | page views, user behavior, device information +2 more |
| 6 | Google Tag Manager | analytics | Yes | page views, user behavior, custom events +2 more |
| 7 | google-auth-library | auth | Yes | OAuth tokens, Google profile data, email |
| 8 | googleapis | other | Yes | user data via Google APIs, calendar data, email data +1 more |
| 9 | intercom | other | Yes | user profiles, email, name +3 more |
| 10 | ioredis | database | Yes | cached data, session data |
| 11 | next-auth | auth | Yes | email, name, profile picture +2 more |
| 12 | nodemailer | email | Yes | email addresses, email content |
| 13 | passport | auth | Yes | email, name, OAuth tokens +1 more |
| 14 | Plausible Analytics | analytics | Yes | page views, referrer data, device information |
| 15 | PostgreSQL | database | Yes | application data, user records |
| 16 | PostgreSQL (env) | database | Yes | application data, user records |
| 17 | posthog | analytics | Yes | user behavior, session recordings, feature flag usage +1 more |
| 18 | prisma | database | Yes | user data as defined in schema |
| 19 | Redis | database | Yes | session data, cache data |
| 20 | Redis (env) | database | Yes | session data, cache data |
| 21 | stripe | payment | Yes | payment information, billing address, email +1 more |
| 22 | twilio | other | Yes | phone numbers, SMS message content, voice call metadata +1 more |
| 23 | web-push | other | Yes | push subscription endpoints, device tokens, notification content |

---

*This board report was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated source code analysis of the **calcom-monorepo** codebase (23 services detected). Sections marked with [brackets] require manual input from the compliance team. This report should be reviewed and supplemented with operational data before board presentation. Generated on 2026-03-16.*
