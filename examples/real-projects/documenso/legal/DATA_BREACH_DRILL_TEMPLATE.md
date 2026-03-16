# Data Breach Response Drill Template

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Organization:** [Your Company Name]
**Project:** @documenso/root

---

This document provides a tabletop exercise template for testing your organization's data breach response capabilities. Regular drills ensure your incident response team can execute effectively under pressure and identify gaps in your response procedures before a real incident occurs.

> **Recommended frequency:** Conduct at least one tabletop exercise annually (GDPR best practice) and within 30 days of any significant infrastructure change.

## 1. Exercise Overview

| Field | Details |
|-------|---------|
| **Exercise type** | Tabletop exercise (discussion-based) |
| **Duration** | 2-3 hours |
| **Facilitator** | [Appointed facilitator — should NOT be the Incident Commander] |
| **Date** | [SCHEDULED DATE] |
| **Location** | [MEETING ROOM / VIDEO CALL LINK] |
| **DPO** | [Data Protection Officer Name] ([dpo@example.com]) |

### 1.1 Exercise Objectives

- [ ] Test the Incident Response Plan end-to-end
- [ ] Validate notification procedures and timelines (72-hour GDPR deadline)
- [ ] Practice cross-functional communication and decision-making
- [ ] Identify gaps in tools, processes, and documentation
- [ ] Test escalation paths and authority delegation
- [ ] Evaluate containment and evidence preservation capabilities

## 2. Roles and Participants

All roles should be assigned BEFORE the exercise begins. Each participant should have a printed copy of the Incident Response Plan.

| Role | Participant | Responsibilities During Exercise |
|------|-------------|----------------------------------|
| **Incident Commander** | [NAME] | Leads response, makes escalation decisions, coordinates all teams |
| **Technical Lead** | [NAME] | Investigates root cause, proposes containment measures, preserves evidence |
| **Data Protection Officer** | [Data Protection Officer Name] | Assesses GDPR obligations, drafts authority notifications, advises on data subject rights |
| **Legal Counsel** | [NAME] | Advises on legal obligations, notification requirements, liability exposure |
| **Communications Lead** | [NAME] | Drafts external communications, manages media/customer inquiries |
| **Executive Sponsor** | [NAME] | Authorizes resource allocation, approves external notifications |
| **IT Security** | [NAME] | Performs forensic analysis, implements technical containment |
| **Customer Support Lead** | [NAME] | Prepares customer-facing FAQ, handles individual inquiries |
| **Observer/Evaluator** | [NAME] | Documents performance, timing, and gaps (does not participate in response) |

## 3. Drill Scenarios

Choose one or more scenarios for the exercise. Scenarios are tailored to the services and data types detected in your project.

### Scenario 1: Credential Stuffing Attack

**Severity:** High

**Setup:** Your monitoring system alerts that an unusually high number of failed login attempts have occurred over the past 6 hours, with a 3% success rate. Approximately 2,500 accounts have been accessed using credentials obtained from a third-party breach.

**Data at risk:**
- User credentials (email/password combinations)
- Session tokens and authentication cookies
- User profile information (names, email addresses)
- Stored payment methods (last 4 digits, billing addresses)
- Account activity history

**Injects (reveal at timed intervals):**

| Time | Inject |
|------|--------|
| T+15min | A security researcher contacts you via responsible disclosure email about the attack |
| T+30min | Affected users start posting on social media about unauthorized access |
| T+45min | A journalist emails your press contact asking for comment |
| T+60min | You discover the attackers exported personal data from 150 accounts |
| T+75min | Three users report unauthorized charges on their payment methods |

### Scenario 2: Exposed Database / Storage Bucket

**Severity:** Critical

**Setup:** A security researcher reports via your responsible disclosure program that a database backup or storage bucket containing production data is publicly accessible. The exposure has been active for approximately 14 days. The researcher provides evidence including sample records.

**Data at risk:**
- user prompts
- conversation history
- generated content
- email addresses
- email content
- uploaded files
- file metadata
- encryption keys
- key metadata
- biometric authentication data
- device attestation
- credential IDs
- user data via Google APIs
- calendar data
- email data
- profile information
- email
- name
- profile picture
- OAuth tokens
- session data
- Microsoft profile data
- user behavior
- session recordings
- feature flag usage
- device information
- user data as defined in schema
- payment information
- billing address
- transaction history

**Injects:**

| Time | Inject |
|------|--------|
| T+15min | Shodan/Censys logs confirm the resource has been indexed by search engines |
| T+30min | Analysis reveals the data includes records from EU residents |
| T+45min | A tech blog publishes a story about the exposure (no company named yet) |
| T+60min | Your CEO asks for a status update and projected impact assessment |
| T+90min | The blog updates their article naming your company |

### Scenario 3: AI System Data Leak

**Severity:** High

**Setup:** A customer reports that your AI-powered feature is occasionally including personal data from other users in its responses. Investigation reveals a prompt injection vulnerability that allows extraction of conversation context from other sessions.

**Data at risk:**
- User prompts and conversation history
- Personal data shared in AI interactions
- Potentially sensitive business information processed by AI

**Injects:**

| Time | Inject |
|------|--------|
| T+15min | A proof-of-concept exploit is shared on a security forum |
| T+30min | You estimate ~500 users may have had data exposed through cross-session leakage |
| T+45min | A researcher demonstrates the exploit can extract data from enterprise customer accounts |
| T+60min | An enterprise customer's legal team contacts you demanding information |

### Scenario 4: Supply Chain Compromise

**Severity:** Critical

**Setup:** A widely-used npm package in your dependency tree has been compromised. The malicious version exfiltrates environment variables (including API keys and database credentials) to an external server. Your CI/CD pipeline installed the compromised version 3 days ago.

**Data at risk:**
- API keys and secrets from environment variables
- Database credentials (potential access to all stored data)
- Third-party service credentials
- Any data accessible via compromised credentials

**Injects:**

| Time | Inject |
|------|--------|
| T+15min | npm advisory confirms the compromise affecting your exact version range |
| T+30min | Logs show outbound connections to an unknown IP from production servers |
| T+45min | You cannot determine with certainty whether database data was accessed |
| T+60min | A second compromised package is discovered in the same dependency tree |

## 4. Exercise Timeline

The exercise follows the standard incident response phases. The facilitator controls the pace and introduces injects at appropriate moments.

| Phase | Duration | Activities |
|-------|----------|------------|
| **Briefing** | 15 min | Facilitator sets the scene, distributes scenario, confirms roles |
| **Phase 1: Detection & Analysis** | 30 min | Initial triage, severity assessment, evidence collection, scope determination |
| **Phase 2: Containment** | 30 min | Immediate containment actions, communication plan, authority notification assessment |
| **Phase 3: Eradication & Recovery** | 30 min | Root cause elimination, system restoration, monitoring enhancement |
| **Phase 4: Notification** | 20 min | Draft notifications (authority, individuals), legal review, communication approval |
| **Phase 5: Post-Incident** | 15 min | Lessons learned, action items, documentation review |
| **Debrief** | 20 min | Evaluator shares observations, team discussion, improvement planning |

## 5. Discussion Questions by Phase

### Phase 1: Detection & Analysis

- How was the breach detected? Could it have been detected earlier?
- What monitoring and alerting tools are available? Were they effective?
- How do you determine the scope of the breach (which data, how many records, which users)?
- What evidence needs to be preserved, and how do you ensure chain of custody?
- Who needs to be notified internally at this stage?

### Phase 2: Containment

- What immediate technical actions can contain the breach?
- How do you balance containment speed vs. preserving forensic evidence?
- Who has the authority to take systems offline if needed?
- How do you communicate with the team during an active incident?
- What is the impact of containment measures on business operations?

### Phase 3: Eradication & Recovery

- How do you confirm the root cause has been eliminated?
- What is the recovery sequence for affected systems?
- How do you verify system integrity before bringing services back online?
- What enhanced monitoring should be in place during recovery?

### Phase 4: Notification

- Does this breach meet the GDPR 72-hour notification threshold?
- Which supervisory authorities need to be notified?
- Does this breach require individual notification to affected data subjects (GDPR Art. 34)?
- What US state notification requirements apply?
- Who drafts, reviews, and approves external notifications?
- How do you handle media inquiries during this period?

### Phase 5: Post-Incident

- What went well during the response?
- What gaps or delays were identified?
- What process improvements are needed?
- What technical controls should be added or enhanced?
- How should the Incident Response Plan be updated?

## 6. Evaluation Criteria

The Observer/Evaluator should assess the team's performance against the following criteria:

### 6.1 Scoring Rubric

| Criterion | Excellent (4) | Good (3) | Adequate (2) | Needs Improvement (1) |
|-----------|---------------|----------|--------------|----------------------|
| **Detection speed** | Immediate recognition and triage | Recognized within 10 min | Recognized within 20 min | Took >20 min or missed indicators |
| **Severity assessment** | Accurate, with clear justification | Mostly accurate | Partially accurate | Inaccurate or not assessed |
| **Containment actions** | Swift, comprehensive, evidence-preserving | Timely with minor gaps | Slow but eventually effective | Ineffective or evidence-destroying |
| **Communication** | Clear, timely, all stakeholders informed | Mostly clear and timely | Some delays or confusion | Major communication failures |
| **Notification compliance** | 72-hour timeline met, all required parties identified | Timeline met with minor gaps | Timeline awareness but execution delays | Timeline missed or requirements unknown |
| **Documentation** | Comprehensive real-time logging | Good documentation with minor gaps | Partial documentation | Little or no documentation |
| **Decision-making** | Clear authority, rapid decisions | Good decisions with minor delays | Decisions made but slowly | Unclear authority, decision paralysis |
| **Role clarity** | Everyone knew their role and executed it | Most roles clear | Some role confusion | Significant role confusion |

### 6.2 Evaluation Scorecard

| Criterion | Score (1-4) | Notes |
|-----------|-------------|-------|
| Detection speed | [SCORE] | [NOTES] |
| Severity assessment | [SCORE] | [NOTES] |
| Containment actions | [SCORE] | [NOTES] |
| Communication | [SCORE] | [NOTES] |
| Notification compliance | [SCORE] | [NOTES] |
| Documentation | [SCORE] | [NOTES] |
| Decision-making | [SCORE] | [NOTES] |
| Role clarity | [SCORE] | [NOTES] |
| **Total** | **[TOTAL]/32** | |

**Rating scale:**
- 28-32: Excellent — team is well-prepared
- 21-27: Good — minor improvements needed
- 14-20: Adequate — significant improvement areas identified
- 8-13: Needs improvement — major gaps in response capability

## 7. After-Action Review Template

Complete this section within 48 hours of the drill exercise.

### 7.1 Exercise Summary

| Field | Details |
|-------|---------|
| **Exercise date** | [DATE] |
| **Scenario used** | [SCENARIO NAME] |
| **Participants** | [LIST] |
| **Overall score** | [TOTAL]/32 |
| **Facilitator** | [NAME] |
| **Evaluator** | [NAME] |

### 7.2 Strengths Identified

1. [STRENGTH 1]
2. [STRENGTH 2]
3. [STRENGTH 3]

### 7.3 Gaps and Improvement Areas

| Gap | Impact | Priority | Action Item | Owner | Deadline |
|-----|--------|----------|-------------|-------|----------|
| [GAP 1] | [IMPACT] | [HIGH/MED/LOW] | [ACTION] | [NAME] | [DATE] |
| [GAP 2] | [IMPACT] | [HIGH/MED/LOW] | [ACTION] | [NAME] | [DATE] |
| [GAP 3] | [IMPACT] | [HIGH/MED/LOW] | [ACTION] | [NAME] | [DATE] |

### 7.4 Process Updates Required

- [ ] Update Incident Response Plan with lessons learned
- [ ] Update Data Breach Notification Templates based on drill findings
- [ ] Update contact lists and escalation paths
- [ ] Schedule follow-up training for identified skill gaps
- [ ] Schedule next drill exercise: [DATE]

## 8. Pre-Drill Preparation Checklist

Complete these items before conducting the exercise:

- [ ] Select scenario and customize for current infrastructure
- [ ] Assign all roles and confirm participant availability
- [ ] Book meeting room / set up video call
- [ ] Print copies of Incident Response Plan for all participants
- [ ] Print copies of Data Breach Notification Templates
- [ ] Prepare inject cards (scenario updates at timed intervals)
- [ ] Brief the facilitator and evaluator on their roles
- [ ] Prepare evaluation scorecards
- [ ] Set up a timer visible to all participants
- [ ] Confirm all participants have access to necessary tools and documentation

## 9. Contact

For questions about this drill template or to schedule an exercise:

- **Data Protection Officer:** [Data Protection Officer Name] ([dpo@example.com])
- **General inquiries:** [your-email@example.com]

---

*This Data Breach Response Drill Template was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **@documenso/root** codebase. Scenarios are tailored to the detected services and data types but should be reviewed and customized by your security and legal teams before use.*