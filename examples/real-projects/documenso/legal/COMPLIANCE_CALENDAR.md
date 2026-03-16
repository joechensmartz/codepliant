# Compliance Calendar

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Company:** [Your Company Name]
**Last updated:** 2026-03-16
**Project:** @documenso/root

---

This document provides a 12-month calendar view of all compliance activities for **@documenso/root**, auto-populated based on 13 detected service(s) and applicable regulations.

> **Disclaimer:** This is not legal advice. Consult qualified legal counsel to confirm applicable obligations and deadlines for your specific situation.

## 1. Applicable Regulations

Based on your project configuration and detected services, the following regulations inform this calendar:

- **GDPR** — General Data Protection Regulation (EU) 2016/679
- **CCPA/CPRA** — California Consumer Privacy Act / California Privacy Rights Act
- **EU AI Act** — Regulation (EU) 2024/1689
- **PCI DSS** — Payment Card Industry Data Security Standard v4.0.1
- **ePrivacy Directive** — Cookie consent and electronic communications
- **CAN-SPAM Act** — US commercial email requirements


## 2. Monthly Calendar


### January

**Review:**
- [ ] Review data breach and incident logs
- [ ] Verify consent mechanisms are operational
- [ ] Re-run Codepliant to detect new services or dependencies
- [ ] Review and update data processing agreements
- [ ] Verify DSAR response procedures are operational
- [ ] PCI DSS quarterly vulnerability scan (ASV)
- [ ] Review analytics data sharing and cookie consent configuration
- [ ] Conduct internal compliance audit (H1)
- [ ] AI system risk re-assessment (H1)
- [ ] Review regulatory landscape for new obligations
- [ ] Review "Do Not Sell or Share" mechanisms

**Update:**
- [ ] Full privacy policy review and update
- [ ] Review and update all compliance documents
- [ ] Update CCPA disclosures and data collection categories
- [ ] PCI DSS annual Self-Assessment Questionnaire

**Report:**
- [ ] Quarterly compliance status report
- [ ] Annual compliance summary report



### February

**Review:**
- [ ] Review data breach and incident logs
- [ ] Verify consent mechanisms are operational
- [ ] Review employee privacy notice

**Update:**
- [ ] Staff data protection training refresh



### March

**Review:**
- [ ] Review data breach and incident logs
- [ ] Verify consent mechanisms are operational
- [ ] Annual vendor and sub-processor review
- [ ] Review data backup and disaster recovery procedures

**Update:**
- [ ] Update sub-processor list



### April

**Review:**
- [ ] Review data breach and incident logs
- [ ] Verify consent mechanisms are operational
- [ ] Re-run Codepliant to detect new services or dependencies
- [ ] Review and update data processing agreements
- [ ] Verify DSAR response procedures are operational
- [ ] PCI DSS quarterly vulnerability scan (ASV)
- [ ] Review analytics data sharing and cookie consent configuration

**Report:**
- [ ] Quarterly compliance status report
- [ ] Q1 compliance metrics report



### May

**Review:**
- [ ] Review data breach and incident logs
- [ ] Verify consent mechanisms are operational
- [ ] Review and enforce data retention schedules
- [ ] Verify encryption at rest for all personal data stores

**Update:**
- [ ] Purge data past retention period



### June

**Review:**
- [ ] Review data breach and incident logs
- [ ] Verify consent mechanisms are operational
- [ ] Review access controls and authentication policies
- [ ] Audit authentication session lengths and token lifetimes

**Update:**
- [ ] Rotate API keys and service credentials



### July

**Review:**
- [ ] Review data breach and incident logs
- [ ] Verify consent mechanisms are operational
- [ ] Re-run Codepliant to detect new services or dependencies
- [ ] Review and update data processing agreements
- [ ] Verify DSAR response procedures are operational
- [ ] PCI DSS quarterly vulnerability scan (ASV)
- [ ] Review analytics data sharing and cookie consent configuration
- [ ] Conduct internal compliance audit (H2)
- [ ] AI system risk re-assessment (H2)

**Update:**
- [ ] Update risk register

**Report:**
- [ ] Quarterly compliance status report
- [ ] Mid-year compliance status report



### August

**Review:**
- [ ] Review data breach and incident logs
- [ ] Verify consent mechanisms are operational
- [ ] Review AI Disclosure document for EU AI Act compliance
- [ ] Verify AI-generated content marking is operational

**Update:**
- [ ] Update AI Model Card and transparency documentation



### September

**Review:**
- [ ] Review data breach and incident logs
- [ ] Verify consent mechanisms are operational
- [ ] Conduct data breach response drill
- [ ] Review email marketing consent records (CAN-SPAM / GDPR)

**Update:**
- [ ] Update incident response plan and communication templates



### October

**Review:**
- [ ] Review data breach and incident logs
- [ ] Verify consent mechanisms are operational
- [ ] Re-run Codepliant to detect new services or dependencies
- [ ] Review and update data processing agreements
- [ ] Verify DSAR response procedures are operational
- [ ] PCI DSS quarterly vulnerability scan (ASV)
- [ ] Review analytics data sharing and cookie consent configuration
- [ ] Review international data transfer safeguards

**Update:**
- [ ] Update Record of Processing Activities (GDPR Art. 30)

**Report:**
- [ ] Quarterly compliance status report
- [ ] Q3 compliance metrics report



### November

**Review:**
- [ ] Review data breach and incident logs
- [ ] Verify consent mechanisms are operational
- [ ] Pre-audit preparation and gap analysis
- [ ] Review third-party risk assessments

**Update:**
- [ ] Update compliance roadmap for next year



### December

**Review:**
- [ ] Review data breach and incident logs
- [ ] Verify consent mechanisms are operational
- [ ] Verify all annual compliance tasks are complete

**Update:**
- [ ] Archive compliance records for the year

**Report:**
- [ ] Annual compliance review report for board/leadership



## 3. Annual Summary

| Month | Review | Update | Report |
|-------|--------|--------|--------|
| January | 11 items | 4 items | 2 items |
| February | 3 items | 1 items | 0 items |
| March | 4 items | 1 items | 0 items |
| April | 7 items | 0 items | 2 items |
| May | 4 items | 1 items | 0 items |
| June | 4 items | 1 items | 0 items |
| July | 9 items | 1 items | 2 items |
| August | 4 items | 1 items | 0 items |
| September | 4 items | 1 items | 0 items |
| October | 8 items | 1 items | 2 items |
| November | 4 items | 1 items | 0 items |
| December | 3 items | 1 items | 1 items |
| **Total** | **65 items** | **14 items** | **9 items** |


## 4. Service-Specific Compliance Activities

The following activities are included in the calendar based on detected services:

### AI Services (@ai-sdk/google-vertex, @vercel/ai)
- Semi-annual AI risk re-assessment (Jan, Jul)
- Annual AI Disclosure and Model Card review (Aug)
- Ongoing AI-generated content marking verification

### Payment Services (stripe)
- Annual PCI DSS Self-Assessment (Jan)
- Quarterly vulnerability scans (Jan, Apr, Jul, Oct)

### Analytics / Advertising (posthog)
- Quarterly cookie consent review (Jan, Apr, Jul, Oct)
- Annual CCPA "sale" classification review (Jan)

### Authentication Services (@simplewebauthn/server, next-auth, passport-microsoft)
- Semi-annual access control audit (Jun)
- Token and session lifetime review (Jun)

### Email Services (@aws-sdk/client-ses, nodemailer, resend)
- Annual consent record review (Sep)
- Unsubscribe mechanism verification (Sep)

### Storage / Database Services (prisma)
- Annual backup and DR review (Mar)
- Encryption verification (May)
- Data retention enforcement (May)



## 5. Tips for Using This Calendar

- **Set reminders** — Import key dates into your team calendar (Google Calendar, Outlook, etc.)
- **Assign owners** — Each activity should have a named responsible person
- **Track completion** — Use the checkboxes above to track progress throughout the year
- **Re-generate** — Run Codepliant after adding or removing services to keep this calendar current
- **Adjust cadence** — Some activities may need higher frequency depending on your risk profile

---

*This compliance calendar was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. It is for informational purposes only and does not constitute legal advice.*