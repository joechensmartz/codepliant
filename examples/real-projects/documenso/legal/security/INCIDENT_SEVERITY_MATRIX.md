# Incident Severity Matrix

> **Severity classification and response framework for [Your Company Name].**
> 13 services | Generated on 2026-03-16
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
| @ai-sdk/google-vertex | ai | **P0** | **P2** | user prompts, conversation history, generated content | EU AI Act, GDPR Art. 22 (automated decisions) |
| @aws-sdk/client-ses | email | **P1** | **P2** | email addresses, email content, uploaded files | CAN-SPAM, GDPR Art. 33/34 |
| @google-cloud/kms | other | **P2** | **P3** | encryption keys, key metadata | Assess per data processed |
| @simplewebauthn/server | auth | **P0** | **P1** | biometric authentication data, device attestation, credential IDs | GDPR Art. 33/34, credential breach notification |
| @vercel/ai | ai | **P0** | **P2** | user prompts, conversation history, generated content | EU AI Act, GDPR Art. 22 (automated decisions) |
| googleapis | other | **P2** | **P3** | user data via Google APIs, calendar data, email data | Assess per data processed |
| next-auth | auth | **P0** | **P1** | email, name, profile picture | GDPR Art. 33/34, credential breach notification |
| nodemailer | email | **P1** | **P2** | email addresses, email content | CAN-SPAM, GDPR Art. 33/34 |
| passport-microsoft | auth | **P0** | **P1** | email, name, Microsoft profile data | GDPR Art. 33/34, credential breach notification |
| posthog | analytics | **P1** | **P3** | user behavior, session recordings, feature flag usage | ePrivacy, GDPR Art. 6/7 (consent) |
| prisma | database | **P0** | **P1** | user data as defined in schema | GDPR Art. 33/34, data breach notification |
| resend | email | **P1** | **P2** | email addresses, email content | CAN-SPAM, GDPR Art. 33/34 |
| stripe | payment | **P0** | **P1** | payment information, billing address, email | PCI DSS, GDPR Art. 33/34 |

---

## 7. Category-Specific Incident Scenarios

### AI Services

| Scenario | Severity | Response Action |
|----------|----------|----------------|
| User PII leaked through AI prompts | **P0** | Disable AI feature, assess data exposure, notify affected users |
| Prompt injection bypasses safety controls | **P1** | Throttle AI endpoint, deploy input validation fix, audit recent outputs |
| AI model produces biased/discriminatory output | **P2** | Document instances, add guardrails, notify AI ethics team |
| AI service provider data breach | **P1** | Assess data shared with provider, rotate API keys, review DPA obligations |
| AI hallucination causes user harm | **P2** | Add output disclaimers, review and strengthen validation layer |

### Payment Services

| Scenario | Severity | Response Action |
|----------|----------|----------------|
| Cardholder data exposed | **P0** | Isolate systems, notify payment processor within 24h, engage PCI forensic investigator |
| Payment processing outage | **P1** | Activate backup processor, communicate to affected customers |
| Fraudulent transactions detected | **P2** | Flag accounts, review transaction logs, strengthen fraud detection |
| PCI DSS compliance gap discovered | **P3** | Document gap, create remediation plan, assess risk |

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

### Analytics Services

| Scenario | Severity | Response Action |
|----------|----------|----------------|
| Analytics collecting PII without consent | **P2** | Disable data collection, audit consent records, update cookie consent config |
| Analytics data shared with unauthorized third party | **P1** | Revoke access, assess GDPR Art. 33 notification requirement |
| Analytics tracking across domains without disclosure | **P3** | Update privacy policy, reconfigure tracking parameters |

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
| PCI DSS | **24 hours** (to processor) | As required | Engage PCI Forensic Investigator (PFI) |
| EU AI Act | As required by severity | Depends on risk level | Additional obligations for high-risk AI systems |
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

*This incident severity matrix was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **@documenso/root** codebase (13 services detected). Customize response times, escalation paths, and roles to match your organization's structure. This document should be reviewed by your security team and legal counsel before adoption.*
