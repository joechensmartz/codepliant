# Compliance Communication Plan

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Organisation:** [Your Company Name]
**Project:** maybe
**Plan Owner:** [Data Protection Officer] ([dpo@example.com])
**Generated:** 2026-03-16

---

> This plan defines how [Your Company Name] communicates compliance updates internally. It ensures the right people receive the right information at the right time through the right channels.

## 1. Communication Objectives

1. **Awareness** — Ensure all stakeholders understand their compliance obligations
2. **Timeliness** — Deliver updates before deadlines, not after
3. **Accountability** — Document who was informed, when, and through what channel
4. **Escalation** — Define clear paths for urgent compliance matters
5. **Consistency** — Use standard templates and cadences to avoid information gaps

## 2. Stakeholder Communication Matrix

| Stakeholder | Information Needs | Frequency | Channel | Escalation Path |
|------------|------------------|-----------|---------|----------------|
| CEO / Founder | Executive summary, compliance grade, key risks, regulatory deadlines | Monthly + ad-hoc for incidents | Email summary, board deck | Yes |
| CTO / VP Engineering | Technical compliance requirements, scanner results, remediation items | Weekly during active work, monthly steady-state | Slack/Teams, JIRA tickets, email | Yes |
| General Counsel / Legal | All generated documents for review, regulatory change alerts, incident reports | On every generation cycle + monthly review | Email, document repository, meeting | Yes |
| Data Protection Officer | Full scan results, DSAR tracking, breach notification status, training completion | Weekly | Email, compliance dashboard, meeting | Yes |
| Engineering Team | Action items from scans, new service detection alerts, code-level compliance tasks | Per sprint / bi-weekly | Slack/Teams, JIRA, PR comments | — |
| Product Team | Feature compliance impact, consent requirements, privacy-by-design checklist | Per feature launch + monthly | Slack/Teams, Confluence, meeting | — |
| Security Team / CISO | Vulnerability reports, incident response plan, security policy updates, access control changes | Weekly + immediate for incidents | Email, PagerDuty, Slack/Teams | Yes |
| Customer Support | DSAR handling procedures, privacy FAQ, data deletion process | On policy update + quarterly refresh | Internal wiki, training session, email | — |
| HR / People Ops | Employee privacy notice, training requirements, onboarding compliance checklist | On policy update + per new hire | HRIS, email, onboarding docs | — |
| Board of Directors | Compliance scorecard, key risks, regulatory landscape, incident history | Quarterly board meeting | Board deck, email | Yes |

## 3. Communication Calendar

### Regular Cadence

| Frequency | Activity | Owner | Audience | Deliverable |
|-----------|----------|-------|----------|-------------|
| **Weekly** | Compliance status update | DPO | Engineering, Security | Slack/Teams message |
| **Bi-weekly** | Sprint compliance items review | DPO + CTO | Engineering leads | Meeting + action items |
| **Monthly** | Compliance summary email | DPO | All stakeholders | Email (use template below) |
| **Monthly** | Scan + regenerate docs | DPO / DevOps | Legal, CTO | Updated legal/ directory |
| **Quarterly** | Compliance review meeting | DPO | Leadership, Legal, Board | Presentation + scorecard |
| **Quarterly** | Training completion check | HR + DPO | All staff | Training report |
| **Annually** | Full compliance audit | DPO + External | Board, Legal | Audit report |
| **Annually** | Policy review & update cycle | DPO + Legal | All stakeholders | Updated policies |

### Event-Driven Communication

| Trigger | Action | Timeline | Owner | Audience |
|---------|--------|----------|-------|----------|
| New service detected in scan | Notify engineering + legal | Within 24 hours | DPO | CTO, Legal |
| Data breach detected | Activate incident response | Immediately | CISO | All escalation contacts |
| Regulatory change announced | Impact assessment | Within 1 week | Legal + DPO | Leadership, Engineering |
| New feature launch | Privacy impact review | Before launch | Product + DPO | Legal, Engineering |
| DSAR received | Acknowledge + process | Within 3 business days | DPO | Support, Engineering |
| Compliance score drops | Root cause analysis | Within 48 hours | DPO | CTO, Engineering |
| Vendor change | Sub-processor notification | 30 days before change | DPO | Affected users, Legal |

## 4. Escalation Matrix

```
Level 1 — Routine
├── Owner: DPO / Compliance Lead
├── Response: Standard cadence
└── Example: Monthly report, training reminder

Level 2 — Elevated
├── Owner: DPO + CTO
├── Response: Within 48 hours
└── Example: Compliance score decline, new regulatory guidance

Level 3 — Urgent
├── Owner: DPO + CTO + Legal
├── Response: Within 24 hours
└── Example: DSAR deadline approaching, audit finding

Level 4 — Critical
├── Owner: CEO + DPO + Legal + CISO
├── Response: Immediately
└── Example: Data breach, regulatory investigation, enforcement action
```

## 5. Communication Templates

### Template A: Monthly Compliance Update Email

```
Subject: [Compliance Update] [Your Company Name] — Monthly Report — [Month Year]

Hi team,

Here is your monthly compliance update for maybe:

📊 COMPLIANCE SCORE: [Score] / 100 ([Grade])
📄 DOCUMENTS: [Count] compliance documents current
🔍 SERVICES MONITORED: 20
⚠️  OPEN ITEMS: [Count]

KEY UPDATES:
• [Update 1]
• [Update 2]
• [Update 3]

ACTION ITEMS:
• [Owner]: [Action] — Due: [Date]
• [Owner]: [Action] — Due: [Date]

UPCOMING DEADLINES:
• [Deadline 1]
• [Deadline 2]

Full compliance docs: [link to legal/ directory or compliance page]

Questions? Reply to this email or contact [Data Protection Officer] at [dpo@example.com].

Best,
[Data Protection Officer]
Data Protection Officer
```

### Template B: New Service Detection Alert

```
Subject: [Action Required] New Service Detected — [Service Name]

Hi [Engineering Lead],

Codepliant has detected a new third-party service in maybe:

SERVICE: [Service Name]
CATEGORY: [Category]
DATA COLLECTED: [Data types]
COMPLIANCE IMPACT: [Brief description]

REQUIRED ACTIONS:
1. □ Verify the service is intentional and approved
2. □ Review data processing implications
3. □ Update sub-processor list if applicable
4. □ Ensure DPA is in place with the provider
5. □ Regenerate compliance documents (codepliant go)

Please complete these actions within [5 business days / next sprint].

— [Data Protection Officer]
```

### Template C: Incident Notification (Internal)

```
Subject: [URGENT] Compliance Incident — [Brief Description]

INCIDENT SUMMARY
━━━━━━━━━━━━━━━
Detected:    [Date/Time]
Severity:    [Level 1-4]
Category:    [Data breach / Policy violation / System failure]
Status:      [Investigating / Contained / Resolved]

DESCRIPTION:
[Brief description of what happened]

IMMEDIATE ACTIONS TAKEN:
1. [Action 1]
2. [Action 2]

STAKEHOLDERS NOTIFIED:
• [Name, Role] — [Time notified]
• [Name, Role] — [Time notified]

NEXT STEPS:
1. [Next step] — Owner: [Name] — ETA: [Time]
2. [Next step] — Owner: [Name] — ETA: [Time]

REGULATORY NOTIFICATION REQUIRED: [Yes/No]
• If yes, deadline: [72 hours from detection under GDPR]

This incident is being tracked in [ticket system / incident ID].

— [Data Protection Officer]
```

### Template D: AI Service Compliance Update

```
Subject: [AI Compliance] [Your Company Name] — AI Service Update

Hi team,

This is an update regarding AI services in maybe:

AI SERVICES IN USE:
• ruby-openai

EU AI ACT STATUS:
• Risk classification: [Pending assessment]
• Art. 50 transparency: [Compliant / In progress / Not started]
• AI Disclosure document: [Current / Needs update]

KEY ITEMS:
• [Item 1]
• [Item 2]

DEADLINE REMINDER: EU AI Act Art. 50 transparency obligations
apply from August 2, 2026.

— [Data Protection Officer]
```

### Template E: Payment Compliance Update

```
Subject: [PCI Compliance] [Your Company Name] — Payment Processing Update

Hi team,

Payment processing compliance update for maybe:

PAYMENT PROCESSORS:
• plaid
• stripe

PCI DSS STATUS: [Compliant / In progress / Assessment needed]
DPA STATUS: [All signed / [Count] pending]

ACTION ITEMS:
• [Item 1]
• [Item 2]

— [Data Protection Officer]
```

## 6. Recommended Channels

| Channel | Use Case | Setup |
|---------|----------|-------|
| **Email** | Monthly reports, incident alerts, formal notifications | Distribution list: compliance@yourcompanyname.com |
| **Slack / Teams** | Real-time updates, quick questions, sprint items | Channel: #compliance |
| **JIRA / Linear** | Action items, remediation tracking, sprint planning | Project: Compliance |
| **Confluence / Notion** | Policy repository, procedures, training materials | Space: Compliance Docs |
| **Git Repository** | Generated compliance documents, version history | Directory: legal/ |
| **Compliance Dashboard** | Live compliance score, trends, KPIs | URL: [internal dashboard URL] |
| **Board Portal** | Quarterly reports, risk summaries | Board meeting materials |

### Automation with Codepliant

```bash
# Automated weekly compliance check (add to CI/CD or cron)
codepliant scan /path/to/project --json > compliance-report.json

# Generate + diff for change detection
codepliant update /path/to/project

# Send notification after scan
codepliant notify /path/to/project --channel slack --webhook $SLACK_WEBHOOK
```

## 7. RACI Matrix

| Activity | CEO | CTO | Legal | DPO | Engineering | Product | Security | HR |
|----------|-----|-----|-------|-----|-------------|---------|----------|-----|
| Policy creation | I | C | A | R | C | C | C | I |
| Document generation | I | I | C | R | C | I | I | I |
| Incident response | I | C | C | R | C | I | A | I |
| Regulatory monitoring | I | I | A | R | I | I | I | I |
| Training delivery | I | I | C | A | I | I | C | R |
| Vendor assessment | I | C | C | A | R | I | C | I |
| DSAR handling | I | I | C | A | R | I | I | I |
| Audit preparation | C | C | A | R | C | I | C | I |
| Board reporting | A | C | C | R | I | I | I | I |

> **R** = Responsible, **A** = Accountable, **C** = Consulted, **I** = Informed

## 8. Communication Effectiveness Metrics

Track these metrics to ensure your compliance communication plan is working:

| Metric | Target | Measurement |
|--------|--------|-------------|
| Email open rate (compliance updates) | > 80% | Email analytics |
| Action item completion rate | > 90% within deadline | JIRA/Linear tracking |
| Training completion within 30 days | > 95% | LMS / training platform |
| Time to acknowledge incident notification | < 1 hour | Incident log |
| Stakeholder satisfaction (quarterly survey) | > 4/5 | Anonymous survey |
| Policy review completion (annual cycle) | 100% | Document tracker |

## Contact

For questions about this communication plan:

- **Plan Owner:** [Data Protection Officer] ([dpo@example.com])
- **General Contact:** [your-email@example.com]

---

*This Compliance Communication Plan was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis of 20 service(s). Adapt the templates and cadences to match your organisation's size, structure, and regulatory environment. Review this plan quarterly.*