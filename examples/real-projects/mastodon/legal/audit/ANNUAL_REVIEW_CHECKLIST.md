# Annual Compliance Review Checklist

> **[Your Company Name]** — Annual Compliance Review
>
> Generated on 2026-03-16 by [Codepliant](https://github.com/joechensmartz/codepliant)
> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16

## 1. Review Metadata

| Field | Details |
|-------|---------|
| **Organization** | [Your Company Name] |
| **Review Lead** | [Data Protection Officer Name] |
| **Contact** | [your-email@example.com] |
| **Review Period** | [Start Date] to [End Date] |
| **Checklist Generated** | 2026-03-16 |
| **Review Deadline** | [Set deadline — typically within 30 days of start] |

## 2. Document Review Checklist

Review each compliance document for accuracy and completeness. Update any document that no longer reflects current practices.

| # | Document | Filename | Review Frequency | Status |
|---|----------|----------|-----------------|--------|
| 1 | Privacy Policy | `PRIVACY_POLICY.md` | Annual + on change | - [ ] Reviewed |
| 2 | Terms of Service | `TERMS_OF_SERVICE.md` | Annual + on change | - [ ] Reviewed |
| 3 | Security Policy | `SECURITY.md` | Annual + after incidents | - [ ] Reviewed |
| 4 | Record of Processing Activities | `RECORD_OF_PROCESSING_ACTIVITIES.md` | Annual + on change | - [ ] Reviewed |
| 5 | Sub-Processor List | `SUBPROCESSOR_LIST.md` | Quarterly recommended, Annual minimum | - [ ] Reviewed |

### Detailed Review Items per Document

#### Privacy Policy (`PRIVACY_POLICY.md`)

- [ ] All third-party services listed match current integrations
- [ ] Data collection descriptions are accurate
- [ ] Legal basis assignments are correct
- [ ] Contact information is current
- [ ] Data retention periods reflect actual practices

#### Terms of Service (`TERMS_OF_SERVICE.md`)

- [ ] Service description matches current offering
- [ ] Limitation of liability clauses are appropriate
- [ ] Governing law and jurisdiction are correct
- [ ] Acceptable use provisions are current

#### Security Policy (`SECURITY.md`)

- [ ] Security measures reflect current infrastructure
- [ ] Responsible disclosure process is functional
- [ ] Contact information is current
- [ ] Vulnerability response timelines are achievable

#### Record of Processing Activities (`RECORD_OF_PROCESSING_ACTIVITIES.md`)

- [ ] All processing activities are documented
- [ ] New services/integrations are reflected
- [ ] Lawful basis for each activity is reviewed
- [ ] Data transfer mechanisms are current
- [ ] Retention periods match actual practices

#### Sub-Processor List (`SUBPROCESSOR_LIST.md`)

- [ ] All sub-processors are listed
- [ ] DPA status is verified for each sub-processor
- [ ] New vendors have been assessed
- [ ] Discontinued vendors have been removed
- [ ] Data processing locations are accurate

## 3. Regulatory Calendar

Key compliance dates and deadlines for the review period:

| Month | Activity | Regulation | Owner |
|-------|----------|-----------|-------|
| January | Annual compliance review kickoff | All | DPO |
| January | Review and update ROPA | GDPR Art. 30 | DPO |
| April | Data breach drill / tabletop exercise | GDPR Art. 33-34 | Incident Response Team |
| June | Mid-year sub-processor audit | GDPR Art. 28 | DPO |
| July | Employee privacy training refresh | GDPR Art. 39 | HR / DPO |
| September | Third-party vendor risk reassessment | GDPR Art. 28 | Procurement / DPO |
| October | DSAR process review and testing | GDPR Art. 15-22 | DPO |
| November | Security policy and access control review | ISO 27001 / SOC 2 | Security Lead |
| December | Year-end compliance summary and planning | All | DPO |

## 4. Operational Compliance Checks

### Data Subject Rights

- [ ] DSAR process tested end-to-end within the past 12 months
- [ ] Average DSAR response time is within 30-day requirement
- [ ] All DSAR requests from the past year have been documented
- [ ] Right to erasure process verified (data actually deleted)
- [ ] Data portability export format tested

### Data Breach Preparedness

- [ ] Incident response plan reviewed and updated
- [ ] Breach notification templates are current
- [ ] 72-hour notification capability tested
- [ ] Breach register is maintained
- [ ] All team members know the breach reporting process

### Technical Measures

- [ ] Encryption in transit (TLS/SSL) verified
- [ ] Encryption at rest verified for all personal data stores
- [ ] Access control lists reviewed — principle of least privilege
- [ ] Multi-factor authentication enabled for admin access
- [ ] Backup and recovery procedures tested
- [ ] Penetration test conducted within the past 12 months
- [ ] Dependency vulnerability scan run and critical issues resolved

### Training and Awareness

- [ ] All staff completed data protection awareness training
- [ ] Engineering team trained on privacy by design principles
- [ ] Customer support trained on DSAR handling
- [ ] Incident response team trained on breach procedures

## 5. Third-Party Service Assessment

Review each third-party service for continued compliance:

| Service | Category | DPA in Place | Last Reviewed | Action Needed |
|---------|----------|-------------|---------------|---------------|
| ActionCable | other | - [ ] Yes | [Date] | [None / Update DPA / Replace / Remove] |
| ActionController::Cookies | other | - [ ] Yes | [Date] | [None / Update DPA / Replace / Remove] |
| ActionMailer | email | - [ ] Yes | [Date] | [None / Update DPA / Replace / Remove] |
| Active Storage | storage | - [ ] Yes | [Date] | [None / Update DPA / Replace / Remove] |
| ActiveRecord | database | - [ ] Yes | [Date] | [None / Update DPA / Replace / Remove] |
| ActiveStorage | storage | - [ ] Yes | [Date] | [None / Update DPA / Replace / Remove] |
| aws-sdk-s3 | storage | - [ ] Yes | [Date] | [None / Update DPA / Replace / Remove] |
| devise | auth | - [ ] Yes | [Date] | [None / Update DPA / Replace / Remove] |
| ioredis | database | - [ ] Yes | [Date] | [None / Update DPA / Replace / Remove] |
| omniauth | auth | - [ ] Yes | [Date] | [None / Update DPA / Replace / Remove] |
| pg | database | - [ ] Yes | [Date] | [None / Update DPA / Replace / Remove] |
| PostgreSQL | database | - [ ] Yes | [Date] | [None / Update DPA / Replace / Remove] |
| PostgreSQL (env) | database | - [ ] Yes | [Date] | [None / Update DPA / Replace / Remove] |
| pundit | auth | - [ ] Yes | [Date] | [None / Update DPA / Replace / Remove] |
| rack-attack | other | - [ ] Yes | [Date] | [None / Update DPA / Replace / Remove] |
| rails-actionmailer | email | - [ ] Yes | [Date] | [None / Update DPA / Replace / Remove] |
| rails-activerecord | database | - [ ] Yes | [Date] | [None / Update DPA / Replace / Remove] |
| rails-sessions | auth | - [ ] Yes | [Date] | [None / Update DPA / Replace / Remove] |
| redis | database | - [ ] Yes | [Date] | [None / Update DPA / Replace / Remove] |
| Redis | database | - [ ] Yes | [Date] | [None / Update DPA / Replace / Remove] |
| sidekiq | other | - [ ] Yes | [Date] | [None / Update DPA / Replace / Remove] |
| ws (WebSocket) | other | - [ ] Yes | [Date] | [None / Update DPA / Replace / Remove] |

## 6. Review Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Data Protection Officer | | | |
| Chief Information Security Officer | | | |
| Legal Counsel | | | |
| Chief Technology Officer | | | |

## Review Notes

### What a lawyer should check

- Ensure the regulatory calendar covers all applicable jurisdictions
- Verify DSAR response timelines meet local law requirements
- Confirm breach notification procedures align with all applicable regulations
- Review third-party DPA status for completeness

### Auto-generated vs. needs human input

| Section | Status | Confidence |
|---------|--------|------------|
| Document review list | Auto-generated from detected documents | High |
| Regulatory calendar | Template with common dates | Medium — customize for jurisdiction |
| Operational checks | Standard checklist | High |
| Third-party assessment | Auto-populated from scan | High — services accurate |
| Sign-off section | Template — needs completion | N/A |

## Related Documents

- Privacy Policy (`PRIVACY_POLICY.md`)
- Record of Processing Activities (`RECORD_OF_PROCESSING_ACTIVITIES.md`)
- Compliance Timeline (`COMPLIANCE_TIMELINE.md`)
- Compliance Notes (`COMPLIANCE_NOTES.md`)
- Sub-Processor List (`SUBPROCESSOR_LIST.md`)
- Incident Response Plan (`INCIDENT_RESPONSE_PLAN.md`)
- DSAR Handling Guide (`DSAR_HANDLING_GUIDE.md`)

---

*This Annual Review Checklist was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on code analysis. It should be customized to reflect your organization's specific compliance obligations and reviewed by legal counsel.*
