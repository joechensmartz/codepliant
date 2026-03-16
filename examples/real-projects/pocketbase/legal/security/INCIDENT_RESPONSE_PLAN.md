# Incident Response Plan

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

This document outlines the incident response procedures for **[Your Company Name]**. It covers detection, classification, notification, investigation, remediation, and post-incident review.

## 1. Incident Classification

All security incidents and data breaches are classified by severity to determine the appropriate response timeline and escalation path.

| Severity | Description | Response Time | Examples |
| -------- | ----------- | ------------- | -------- |
| **Critical (P1)** | Active data breach with confirmed data exfiltration or system compromise | Immediate (within 1 hour) | Unauthorized access to production database, ransomware, leaked credentials actively exploited |
| **High (P2)** | Confirmed security incident with potential data exposure | Within 4 hours | Vulnerability actively being exploited, unauthorized access detected, suspected data leak |
| **Medium (P3)** | Security event requiring investigation | Within 24 hours | Unusual access patterns, failed intrusion attempts, misconfiguration discovered |
| **Low (P4)** | Minor security event or policy violation | Within 72 hours | Phishing attempt blocked, minor policy violation, non-sensitive data exposure |

## 2. Detection and Reporting Procedures

### How to Report an Incident

Any employee, contractor, or third party who discovers or suspects a security incident must report it immediately:

1. **Email:** [[your-email@example.com]](mailto:[your-email@example.com])
2. **Escalation:** Contact the DPO at [[dpo@example.com]](mailto:[dpo@example.com])
3. **Do NOT** attempt to investigate or remediate the issue independently
4. **Do NOT** communicate about the incident on public channels

### Information to Include

- Date and time the incident was discovered
- Description of what occurred
- Systems, services, or data affected
- How the incident was detected
- Any actions already taken
- Contact information of the reporter

## 3. GDPR 72-Hour Notification Requirement

Under Article 33 of the GDPR, personal data breaches must be reported to the relevant supervisory authority **within 72 hours** of becoming aware of the breach, unless the breach is unlikely to result in a risk to the rights and freedoms of individuals.

### Timeline

| Milestone | Deadline |
| --------- | -------- |
| Breach discovered | T = 0 |
| Internal assessment complete | T + 24 hours |
| Decision on notification obligation | T + 36 hours |
| Supervisory authority notified | T + 72 hours (maximum) |
| Affected individuals notified (if high risk) | Without undue delay |

If notification cannot be made within 72 hours, the reasons for the delay must be documented and communicated to the authority.

## 4. Authority Notification Template

Use the following template when notifying the supervisory authority of a personal data breach:

```
PERSONAL DATA BREACH NOTIFICATION
=================================

Organization: [Your Company Name]
DPO / Contact: [Data Protection Officer Name] ([dpo@example.com])
Website: [https://yoursite.com]

Date and time breach was discovered: [DATE/TIME]
Date and time breach occurred (if known): [DATE/TIME]

Nature of the breach:
  [ ] Confidentiality breach (unauthorized disclosure)
  [ ] Integrity breach (unauthorized alteration)
  [ ] Availability breach (unauthorized loss of access)

Categories of personal data affected:
  [ ] Names               [ ] Email addresses
  [ ] Phone numbers       [ ] Physical addresses
  [ ] Financial data      [ ] Health data
  [ ] Authentication data [ ] Other: ___________

Approximate number of data subjects affected: [NUMBER]
Approximate number of records affected: [NUMBER]

Description of likely consequences:
[DESCRIBE POTENTIAL IMPACT ON DATA SUBJECTS]

Measures taken or proposed to address the breach:
[DESCRIBE CONTAINMENT AND REMEDIATION STEPS]

Measures taken to mitigate adverse effects:
[DESCRIBE MITIGATION ACTIONS]
```

## 5. User Notification Template

When a breach is likely to result in a high risk to the rights and freedoms of individuals (GDPR Article 34), affected users must be notified directly. Use the following template:

```
Subject: Important Security Notice from [Your Company Name]

Dear [User Name],

We are writing to inform you of a security incident at [Your Company Name] that may have affected your personal data.

WHAT HAPPENED:
[Brief, clear description of the incident]

WHAT DATA WAS AFFECTED:
[List the specific types of personal data involved]

WHAT WE ARE DOING:
[Describe the steps taken to contain and remediate the breach]

WHAT YOU CAN DO:
- Change your password immediately
- Enable two-factor authentication if not already active
- Monitor your accounts for suspicious activity
- [Additional specific recommendations]

CONTACT US:
If you have questions, please contact us at [your-email@example.com].

We sincerely apologize for this incident and are taking all necessary
steps to prevent a recurrence.

Sincerely,
[Your Company Name]
```

## 6. Investigation Procedures

Upon confirmation of a security incident, the incident response team must:

### 6.1 Containment

- [ ] Isolate affected systems from the network
- [ ] Revoke compromised credentials and API keys
- [ ] Block malicious IP addresses or accounts
- [ ] Preserve forensic evidence (logs, snapshots, memory dumps)
- [ ] Activate backup communication channels if primary channels are compromised

### 6.2 Investigation

- [ ] Determine the root cause of the incident
- [ ] Identify all affected systems, services, and data
- [ ] Determine the scope of data exposure
- [ ] Review access logs and audit trails
- [ ] Interview relevant personnel
- [ ] Document timeline of events
- [ ] Engage external forensic specialists if needed

## 7. Remediation Steps

- [ ] Patch or fix the vulnerability that led to the incident
- [ ] Rotate all potentially compromised secrets, keys, and tokens
- [ ] Force password resets for affected user accounts
- [ ] Update firewall rules and access controls
- [ ] Deploy additional monitoring on affected systems
- [ ] Verify that the attack vector is fully closed
- [ ] Conduct a follow-up scan to confirm no persistence mechanisms remain
- [ ] Update security documentation and runbooks

## 8. Post-Incident Review

A post-incident review (blameless post-mortem) must be conducted within **5 business days** of incident resolution.

### Review Agenda

1. **Timeline reconstruction** — What happened, and when?
2. **Root cause analysis** — Why did it happen?
3. **Detection assessment** — How was the incident detected? Could it have been detected sooner?
4. **Response evaluation** — Was the response effective? What worked well?
5. **Gap identification** — What controls, processes, or tools were missing?
6. **Action items** — Concrete tasks with owners and deadlines to prevent recurrence

### Documentation

The post-incident report must include:

- Incident summary and severity classification
- Complete timeline of events
- Root cause and contributing factors
- Data impact assessment
- Remediation actions taken
- Lessons learned
- Preventive action items with owners and due dates

## 9. Contact List

| Role | Name | Email | Responsibility |
| ---- | ---- | ----- | -------------- |
| Incident Response Lead | [Name] | [[your-email@example.com]](mailto:[your-email@example.com]) | Overall incident coordination |
| Data Protection Officer | [Data Protection Officer Name] | [[dpo@example.com]](mailto:[dpo@example.com]) | GDPR compliance, authority notification |
| Engineering Lead | [Name] | [email] | Technical investigation and remediation |
| Legal Counsel | [Name] | [email] | Legal obligations, regulatory response |
| Communications Lead | [Name] | [email] | User notification, public communications |
| Executive Sponsor | [Name] | [email] | Final decision authority |

## Review Notes

### What a lawyer should check

- Verify notification timelines meet GDPR 72-hour requirement
- Confirm escalation procedures are realistic
- Check that all required roles are assigned
- Ensure breach notification templates are jurisdiction-appropriate

### Auto-generated vs. needs human input

| Section | Status | Confidence |
|---------|--------|------------|
| Response procedures | Standard template | Medium |
| Notification timelines | Based on GDPR requirements | High |
| Team assignments | Placeholder — needs completion | N/A |
## Related Documents

- Security Policy (`SECURITY.md`)
- Data Breach Notification Templates (`DATA_BREACH_NOTIFICATION_TEMPLATE.md`)
- Business Continuity Plan (`BUSINESS_CONTINUITY_PLAN.md`)
- Disaster Recovery Plan (`DISASTER_RECOVERY_PLAN.md`)

---

*This incident response plan was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **pocketbase** codebase. It should be reviewed and customized by your legal and security teams before adoption.*
