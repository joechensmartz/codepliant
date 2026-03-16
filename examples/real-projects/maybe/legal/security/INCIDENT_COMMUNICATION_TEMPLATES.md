# Incident Communication Templates

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Organization:** [Your Company Name]
**Last updated:** 2026-03-16

Pre-written communication templates for security and data incidents at **[Your Company Name]**. These templates cover every stage of incident response communication: initial notification, status updates, resolution notice, and post-mortem report.

> **Instructions:** Replace all `[BRACKETED]` placeholders with actual values. Review and customize each template for the specific incident before sending.

## Related Documents

- Incident Response Plan (`INCIDENT_RESPONSE_PLAN.md`)
- Data Breach Notification Templates (`DATA_BREACH_NOTIFICATION_TEMPLATE.md`)
- Security Policy (`SECURITY.md`)
- Business Continuity Plan (`BUSINESS_CONTINUITY_PLAN.md`)

---

## Template 1: Initial Notification

*Use within the first 2 hours of incident detection. Send to affected users and stakeholders.*

### Email Version

```
Subject: Security Notice — [Your Company Name] is investigating an incident

Dear [Customer/User Name],

We are writing to inform you that [Your Company Name] has identified a security incident 
that may affect your account or data.

WHAT WE KNOW:
- Date discovered: [DATE AND TIME]
- Nature of incident: [BRIEF DESCRIPTION — e.g., unauthorized access,
  data exposure, service disruption]
- Systems affected: [AFFECTED SERVICES/FEATURES]

WHAT WE ARE DOING:
- Our security team is actively investigating the scope and impact
- We have taken [IMMEDIATE ACTIONS — e.g., isolated affected systems,
  revoked compromised credentials]
- We are working with [external security experts / law enforcement] as needed

WHAT YOU SHOULD DO:
- Change your password at [URL]
- Enable two-factor authentication if not already active
- Review your account for any unauthorized activity
- Be cautious of phishing emails claiming to be from us

We will provide updates as our investigation progresses. Our next update
will be within [24 hours / specific time].

If you have questions, please contact us at [your-email@example.com].

Sincerely,
[Your Company Name] Security Team
```

### Status Page / Public Notice Version

```
INVESTIGATING — Security Incident
Posted: [DATE TIME] | [Your Company Name]

We are investigating a security incident affecting [DESCRIPTION].
Our team has been mobilized and we are actively working to resolve
the issue. We will provide updates as more information becomes available.

Impact: [DESCRIPTION OF USER IMPACT]
Status: Investigating
Next update: [TIME]
```

---

## Template 2: Status Update

*Send at regular intervals (every 4-12 hours) during active incidents.*

### Email Version

```
Subject: Update [#N] — [Your Company Name] Security Incident

Dear [Customer/User Name],

This is update #[N] regarding the security incident we reported on [ORIGINAL DATE].

CURRENT STATUS:
- Investigation phase: [Containment / Eradication / Recovery]
- We have determined that [UPDATED SCOPE — more/less data than initially
  estimated, specific data types affected]

WHAT HAS CHANGED SINCE LAST UPDATE:
- [ACTION TAKEN 1 — e.g., identified root cause]
- [ACTION TAKEN 2 — e.g., patched vulnerability]
- [ACTION TAKEN 3 — e.g., completed forensic analysis]

DATA IMPACT UPDATE:
- Types of data affected: [SPECIFIC DATA TYPES]
- Number of accounts potentially affected: [NUMBER or RANGE]
- Time period of exposure: [DATE RANGE]

ADDITIONAL RECOMMENDED ACTIONS:
- [Any new steps users should take]

Our next update will be provided by [DATE/TIME].

Questions? Contact us at [your-email@example.com].

Sincerely,
[Your Company Name] Security Team
```

### Status Page Version

```
UPDATE — Security Incident
Posted: [DATE TIME] | [Your Company Name]

Update #[N]: Our investigation has [PROGRESS SUMMARY]. We have [ACTIONS TAKEN].
[CURRENT USER IMPACT]. We continue to work toward full resolution.

Impact: [UPDATED IMPACT]
Status: [Identified / Monitoring / Resolving]
Next update: [TIME]
```

---

## Template 3: Resolution Notice

*Send when the incident has been fully resolved and systems are restored.*

### Email Version

```
Subject: Resolved — [Your Company Name] Security Incident Update

Dear [Customer/User Name],

We are writing to confirm that the security incident we reported on [ORIGINAL DATE] 
has been fully resolved.

INCIDENT SUMMARY:
- Date discovered: [DATE]
- Date resolved: [DATE]
- Total duration: [DURATION]
- Root cause: [HIGH-LEVEL DESCRIPTION]

WHAT HAPPENED:
[2-3 sentence plain-language explanation of what occurred, avoiding
unnecessary technical jargon]

DATA IMPACT:
- [X] accounts were affected
- Data types involved: [LIST]
- No [financial data / passwords / etc.] were compromised

WHAT WE DID:
- [REMEDIATION ACTION 1]
- [REMEDIATION ACTION 2]
- [REMEDIATION ACTION 3]

WHAT WE ARE DOING TO PREVENT RECURRENCE:
- [PREVENTIVE MEASURE 1]
- [PREVENTIVE MEASURE 2]
- [PREVENTIVE MEASURE 3]

COMPENSATION / SUPPORT:
- [Credit monitoring service / account credit / extended features — if applicable]
- For questions or concerns, contact [your-email@example.com]
- Our DPO, [Data Protection Officer], can be reached at [dpo@example.com]

We sincerely apologize for this incident and the inconvenience it has caused.
The trust you place in us is something we take very seriously, and we are
committed to earning and maintaining that trust.

Sincerely,
[CEO/CTO Name]
[Your Company Name]
```

### Status Page Version

```
RESOLVED — Security Incident
Posted: [DATE TIME] | [Your Company Name]

The security incident reported on [DATE] has been fully resolved.
[SUMMARY OF RESOLUTION]. All systems are operating normally.
We have implemented additional safeguards to prevent recurrence.

Impact: Resolved
Status: Resolved
Duration: [START] to [END]
```

---

## Template 4: Post-Mortem Report

*Publish within 5 business days of resolution. Share internally and optionally with affected parties.*

```markdown
# Post-Mortem Report: [Incident Title]

**Organization:** [Your Company Name]
**Incident ID:** [INC-YYYY-NNN]
**Severity:** [Critical / High / Medium / Low]
**Date of incident:** [DATE]
**Date resolved:** [DATE]
**Report author:** [NAME]
**Report date:** [DATE]

## Executive Summary

[2-3 sentence summary: what happened, impact, resolution]

## Timeline

| Time (UTC) | Event |
| ---------- | ----- |
| [HH:MM] | [First indication of issue] |
| [HH:MM] | [Incident confirmed / escalated] |
| [HH:MM] | [Containment actions taken] |
| [HH:MM] | [Root cause identified] |
| [HH:MM] | [Fix deployed] |
| [HH:MM] | [Monitoring confirmed resolution] |
| [HH:MM] | [All-clear declared] |

## Root Cause

[Detailed technical explanation of the root cause]

## Impact

- **Users affected:** [NUMBER]
- **Data exposed:** [TYPES AND VOLUME]
- **Service downtime:** [DURATION]
- **Financial impact:** [ESTIMATE]
- **Regulatory notifications:** [AUTHORITIES NOTIFIED]

## Detection

How was the incident detected?
- [ ] Automated monitoring / alerting
- [ ] Employee report
- [ ] Customer report
- [ ] Third-party notification
- [ ] Security audit

Detection gap: [TIME FROM INCIDENT START TO DETECTION]

## Response Assessment

### What went well

- [POSITIVE 1]
- [POSITIVE 2]

### What could be improved

- [IMPROVEMENT 1]
- [IMPROVEMENT 2]

## Action Items

| # | Action | Owner | Priority | Due Date | Status |
| - | ------ | ----- | -------- | -------- | ------ |
| 1 | [ACTION] | [OWNER] | [P1/P2/P3] | [DATE] | [ ] Open |
| 2 | [ACTION] | [OWNER] | [P1/P2/P3] | [DATE] | [ ] Open |
| 3 | [ACTION] | [OWNER] | [P1/P2/P3] | [DATE] | [ ] Open |

## Regulatory Compliance

- [ ] Supervisory authority notified within 72 hours (GDPR Art. 33)
- [ ] Affected individuals notified (GDPR Art. 34, if high risk)
- [ ] Payment processor notified within 24 hours (PCI DSS)
- [ ] Card brands notified per their requirements
- [ ] AI provider notified of data exposure through AI services
- [ ] AI model inputs/outputs reviewed for data leakage
- [ ] Internal breach register updated
- [ ] Insurance carrier notified (if applicable)
```

---

## Template 5: Supervisory Authority Notification

*Submit within 72 hours of becoming aware of a personal data breach (GDPR Art. 33).*

```
PERSONAL DATA BREACH NOTIFICATION
═════════════════════════════════

Data Controller: [Your Company Name]
DPO: [Data Protection Officer]
DPO Contact: [dpo@example.com]
Website: [https://yoursite.com]

1. Date and time of breach discovery: [DATE TIME]
2. Date and time breach occurred (if known): [DATE TIME]
3. How the breach was discovered: [DESCRIPTION]

4. Nature of the breach:
   [X] Confidentiality (unauthorized disclosure/access)
   [ ] Integrity (unauthorized alteration)
   [ ] Availability (unauthorized loss of access)

5. Categories of data subjects: [e.g., customers, employees]
6. Approximate number of data subjects: [NUMBER]
7. Categories of personal data: [e.g., names, emails, financial]
8. Approximate number of records: [NUMBER]

9. Likely consequences of the breach:
   [DESCRIPTION OF POTENTIAL IMPACT]

10. Measures taken to address the breach:
    [CONTAINMENT AND REMEDIATION STEPS]

11. Measures taken to mitigate adverse effects:
    [MITIGATION ACTIONS FOR DATA SUBJECTS]

12. Have data subjects been notified?
    [ ] Yes — Date: [DATE], Method: [EMAIL/POST/PUBLIC NOTICE]
    [ ] No — Reason: [NOT YET REQUIRED / LOW RISK / PENDING]

13. Cross-border transfer:
    Was data transferred to third countries? [YES/NO]
    If yes, which countries? [LIST]
```

---

## Usage Guide

### When to Use Each Template

| Template | When | Who Sends | Who Receives |
| -------- | ---- | --------- | ------------ |
| Initial Notification | Within 2 hours of detection | Security Team | Affected users, internal stakeholders |
| Status Update | Every 4-12 hours during active incident | Security Team | Affected users, internal stakeholders |
| Resolution Notice | When incident is fully resolved | CEO/CTO | All affected parties |
| Post-Mortem | Within 5 business days of resolution | Incident Lead | Internal teams, optionally external |
| Authority Notification | Within 72 hours (GDPR) | DPO | Supervisory authority |

### Communication Channels

| Channel | Use For | Priority |
| ------- | ------- | -------- |
| Direct email | Individual user notification | Critical/High |
| Status page | Public incident updates | All severities |
| In-app banner | Active users during incident | Critical/High |
| Social media | Public awareness if widespread | Critical |
| Blog post | Detailed post-mortem | Post-resolution |
| [your-email@example.com] | Inbound questions | All severities |

---

*These incident communication templates were generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **maybe** codebase. They should be reviewed and customized by your legal, security, and communications teams before use.*
