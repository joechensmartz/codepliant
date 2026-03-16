# Incident Severity Matrix

> **Severity classification and response framework for [Your Company Name].**
> 22 services | Generated on 2026-03-16
> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16

---

## Purpose

This matrix defines severity levels for security incidents and service disruptions. It establishes response times, escalation paths, and communication requirements to ensure consistent and rapid incident handling.

---

## 1. Severity Level Definitions

| Level | Name | Definition | Examples |
|-------|------|-----------|----------|
| **P0** | **Catastrophic** | Complete system compromise, active data exfiltration, or regulatory breach affecting all users | Production database breach, ransomware encrypting all systems, leaked master encryption keys, complete auth bypass |
| **P1** | **Critical** | Major security incident with confirmed data exposure or significant service degradation | Unauthorized access to PII, API key compromise with data access, partial service outage affecting >50% users |
| **P2** | **High** | Security incident with potential data exposure or moderate service impact | Vulnerability actively exploited, unauthorized access detected but contained, service degradation affecting <50% users |
| **P3** | **Medium** | Security event requiring investigation with limited immediate impact | Suspicious access patterns, failed intrusion attempts, configuration drift detected, minor data quality issues |
| **P4** | **Low** | Minor security event or policy violation with no data impact | Phishing attempt blocked, minor policy violation, non-sensitive log exposure, informational security alert |

---

## 2. Response Time Requirements

| Level | Acknowledge | Triage | Initial Response | Resolution Target | Post-Mortem |
|-------|------------|--------|-----------------|-------------------|-------------|
| **P0** | 5 minutes | 15 minutes | 30 minutes | 4 hours | Within 24 hours |
| **P1** | 15 minutes | 30 minutes | 1 hour | 8 hours | Within 48 hours |
| **P2** | 30 minutes | 1 hour | 4 hours | 24 hours | Within 5 business days |
| **P3** | 2 hours | 4 hours | 24 hours | 72 hours | Within 10 business days |
| **P4** | 24 hours | 48 hours | 72 hours | 1 week | Monthly review |

---

## 3. Escalation Paths

### P0 — Catastrophic

```
Discoverer
  └─> Security On-Call (immediate)
       └─> CTO / CISO (within 5 min)
            └─> CEO + Legal Counsel (within 15 min)
                 └─> Board notification (within 1 hour)
                      └─> Regulatory authority (within 72 hours per GDPR)
```

### P1 — Critical

```
Discoverer
  └─> Security On-Call (within 15 min)
       └─> Engineering Lead + Security Lead (within 30 min)
            └─> CTO / CISO (within 1 hour)
                 └─> DPO for data breach assessment
```

### P2 — High

```
Discoverer
  └─> Security On-Call (within 30 min)
       └─> Engineering Lead (within 1 hour)
            └─> CTO (if escalation needed)
```

### P3/P4 — Medium/Low

```
Discoverer
  └─> Security channel / ticket
       └─> Security team triage (next business day for P4)
```

---

## 4. Communication Requirements

| Level | Internal Comms | Customer Comms | Regulatory Notification | Public Disclosure |
|-------|---------------|----------------|------------------------|-------------------|
| **P0** | All-hands war room, executive updates every 30 min | Status page + direct email within 1 hour | Within 72 hours (GDPR Art. 33) to [[dpo@example.com]](mailto:[dpo@example.com]) | If data breach confirmed, within 72 hours |
| **P1** | Security + engineering channel, executive update hourly | Status page update, affected users notified within 24 hours | Assess within 36 hours, notify if required | Only if legally required |
| **P2** | Security channel, engineering lead notified | Status page if user-facing impact | Assess within 72 hours | No |
| **P3** | Security ticket, weekly summary | No | No (unless investigation escalates) | No |
| **P4** | Security ticket | No | No | No |

---

## 5. Communication Channels

| Channel | Used For | Access |
|---------|----------|--------|
| Security email ([[your-email@example.com]](mailto:[your-email@example.com])) | External reports, regulatory correspondence | Security team |
| #security-incidents (Slack/Teams) | Real-time incident coordination | Security + engineering |
| War room (video call) | P0/P1 live coordination | All responders |
| Incident management tool | Ticket tracking, timeline documentation | All staff |
| Status page | Customer-facing incident updates | Public |

---

## 6. Per-Service Impact Assessment

Severity classification when each detected service is compromised or experiences an outage.

| Service | Category | If Compromised | If Outage | Data at Risk | Regulatory Impact |
|---------|----------|---------------|-----------|-------------|-------------------|
| ActionCable | other | **P2** | **P3** | real-time user data, connection metadata, channel subscriptions | Assess per data processed |
| ActionController::Cookies | other | **P2** | **P3** | session cookies, session data, CSRF tokens | Assess per data processed |
| ActionMailer | email | **P1** | **P2** | email addresses, email content | CAN-SPAM, GDPR Art. 33/34 |
| Active Storage | storage | **P1** | **P2** | uploaded files, file metadata, storage service credentials | GDPR Art. 33/34 if PII stored |
| ActiveRecord | database | **P0** | **P1** | user data as defined in schema, timestamps, associations | GDPR Art. 33/34, data breach notification |
| ActiveStorage | storage | **P1** | **P2** | uploaded files, file metadata, storage references | GDPR Art. 33/34 if PII stored |
| aws-sdk-s3 | storage | **P1** | **P2** | uploaded files, file metadata | GDPR Art. 33/34 if PII stored |
| devise | auth | **P0** | **P1** | email, password hash, session data | GDPR Art. 33/34, credential breach notification |
| ioredis | database | **P0** | **P1** | cached data, session data | GDPR Art. 33/34, data breach notification |
| omniauth | auth | **P0** | **P1** | email, name, OAuth tokens | GDPR Art. 33/34, credential breach notification |
| pg | database | **P0** | **P1** | user data as defined in schema | GDPR Art. 33/34, data breach notification |
| PostgreSQL | database | **P0** | **P1** | application data, user records | GDPR Art. 33/34, data breach notification |
| PostgreSQL (env) | database | **P0** | **P1** | application data, user records | GDPR Art. 33/34, data breach notification |
| pundit | auth | **P0** | **P1** | user roles, authorization policies, access control data | GDPR Art. 33/34, credential breach notification |
| rack-attack | other | **P2** | **P3** | IP addresses, request metadata | Assess per data processed |
| rails-actionmailer | email | **P1** | **P2** | email addresses, email content | CAN-SPAM, GDPR Art. 33/34 |
| rails-activerecord | database | **P0** | **P1** | user data as defined in schema | GDPR Art. 33/34, data breach notification |
| rails-sessions | auth | **P0** | **P1** | session cookies, CSRF tokens | GDPR Art. 33/34, credential breach notification |
| redis | database | **P0** | **P1** | cached data, session data | GDPR Art. 33/34, data breach notification |
| Redis | database | **P0** | **P1** | session data, cache data | GDPR Art. 33/34, data breach notification |
| sidekiq | other | **P2** | **P3** | job data, user data processed in background jobs | Assess per data processed |
| ws (WebSocket) | other | **P2** | **P3** | real-time user data, connection metadata, IP address | Assess per data processed |

---

## 7. Category-Specific Incident Scenarios

### Authentication Services

| Scenario | Severity | Response Action |
|----------|----------|----------------|
| Complete auth bypass discovered | **P0** | Disable affected auth flow, force re-authentication, rotate all sessions |
| Credential stuffing attack in progress | **P1** | Enable rate limiting, lock affected accounts, force password resets |
| OAuth token leak | **P1** | Revoke leaked tokens, rotate secrets, audit access logs |
| Auth provider outage | **P2** | Activate fallback auth, communicate login issues to users |

### Database & Storage Services

| Scenario | Severity | Response Action |
|----------|----------|----------------|
| Database exposed to internet | **P0** | Restrict network access immediately, audit data access logs, rotate credentials |
| Unauthorized database query detected | **P1** | Revoke access, investigate query scope, assess data exposure |
| Storage bucket misconfiguration | **P1** | Lock down permissions, audit exposed files, notify if PII exposed |
| Database corruption / data loss | **P2** | Activate backup restoration, assess data integrity |

---

## 8. Severity Decision Tree

Use this decision tree to classify incidents when severity is unclear:

```
Is there confirmed data exfiltration or complete system compromise?
  ├─ YES → P0 (Catastrophic)
  └─ NO
       Is there confirmed unauthorized access to PII or critical systems?
       ├─ YES → P1 (Critical)
       └─ NO
            Is there an active exploit or significant service degradation?
            ├─ YES → P2 (High)
            └─ NO
                 Is investigation required to determine impact?
                 ├─ YES → P3 (Medium)
                 └─ NO → P4 (Low)
```

---

## 9. Regulatory Response Timelines

Mandatory notification deadlines by regulation for data breach incidents (P0/P1).

| Regulation | Authority Notification | Individual Notification | Key Requirement |
|------------|----------------------|------------------------|-----------------|
| GDPR (Art. 33/34) | **72 hours** | Without undue delay (high risk) | Must document all breaches regardless of notification |
| UK GDPR | **72 hours** | Without undue delay (high risk) | Notify ICO via online portal |
| CCPA/CPRA | Varies by state | Without unreasonable delay | AG notification for 500+ CA residents |
| ePrivacy | Per member state law | Per member state law | Cookie/tracking specific requirements |

---

## 10. Incident Response Roles

| Role | P0 Responsibility | P1-P2 Responsibility | P3-P4 Responsibility |
|------|-------------------|---------------------|---------------------|
| **Incident Commander** | Leads war room, all decisions | Coordinates response | Reviews report |
| **Security Lead** | Active investigation, containment | Investigation lead | Triages tickets |
| **Engineering Lead** | Emergency fixes, system isolation | Deploys fixes | Assigns fixes |
| **DPO** ([[dpo@example.com]](mailto:[dpo@example.com])) | Regulatory notification decision | Breach assessment | Monthly review |
| **Communications Lead** | Customer + public messaging | Status page updates | No action |
| **Legal Counsel** | Regulatory response, evidence preservation | Legal assessment | No action |
| **Executive Sponsor** | Final authority, board comms | Informed, escalation | Informed via report |

---

*This incident severity matrix was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **@mastodon/mastodon** codebase (22 services detected). Customize response times, escalation paths, and roles to match your organization's structure. This document should be reviewed by your security team and legal counsel before adoption.*
