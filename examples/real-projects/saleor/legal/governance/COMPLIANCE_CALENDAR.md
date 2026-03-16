# Compliance Calendar

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Company:** [Your Company Name]
**Last updated:** 2026-03-16
**Project:** saleor

---

This document provides a 12-month calendar view of all compliance activities for **saleor**, auto-populated based on 6 detected service(s) and applicable regulations.

> **Disclaimer:** This is not legal advice. Consult qualified legal counsel to confirm applicable obligations and deadlines for your specific situation.

## 1. Applicable Regulations

Based on your project configuration and detected services, the following regulations inform this calendar:

- **GDPR** — General Data Protection Regulation (EU) 2016/679
- **PCI DSS** — Payment Card Industry Data Security Standard v4.0.1


## 2. Monthly Calendar


### January

**Review:**
- [ ] Review data breach and incident logs
- [ ] Verify consent mechanisms are operational
- [ ] Re-run Codepliant to detect new services or dependencies
- [ ] Review and update data processing agreements
- [ ] Verify DSAR response procedures are operational
- [ ] PCI DSS quarterly vulnerability scan (ASV)
- [ ] Conduct internal compliance audit (H1)
- [ ] Review regulatory landscape for new obligations

**Update:**
- [ ] Full privacy policy review and update
- [ ] Review and update all compliance documents
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
- [ ] Conduct internal compliance audit (H2)

**Update:**
- [ ] Update risk register

**Report:**
- [ ] Quarterly compliance status report
- [ ] Mid-year compliance status report



### August

**Review:**
- [ ] Review data breach and incident logs
- [ ] Verify consent mechanisms are operational



### September

**Review:**
- [ ] Review data breach and incident logs
- [ ] Verify consent mechanisms are operational
- [ ] Conduct data breach response drill

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
| January | 8 items | 3 items | 2 items |
| February | 3 items | 1 items | 0 items |
| March | 4 items | 1 items | 0 items |
| April | 6 items | 0 items | 2 items |
| May | 4 items | 1 items | 0 items |
| June | 4 items | 1 items | 0 items |
| July | 7 items | 1 items | 2 items |
| August | 2 items | 0 items | 0 items |
| September | 3 items | 1 items | 0 items |
| October | 7 items | 1 items | 2 items |
| November | 4 items | 1 items | 0 items |
| December | 3 items | 1 items | 1 items |
| **Total** | **55 items** | **12 items** | **9 items** |


## 4. Service-Specific Compliance Activities

The following activities are included in the calendar based on detected services:

### Payment Services (stripe)
- Annual PCI DSS Self-Assessment (Jan)
- Quarterly vulnerability scans (Jan, Apr, Jul, Oct)

### Authentication Services (django-admin, django-sessions)
- Semi-annual access control audit (Jun)
- Token and session lifetime review (Jun)

### Storage / Database Services (boto3, redis)
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