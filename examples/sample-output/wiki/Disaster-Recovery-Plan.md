> **Document Version:** 1.0  
> **Document Owner:** Acme Inc  
> **Next Review Date:** 2027-03-18


**Last updated:** 2026-03-18

**Project:** nextjs-saas-example
**Organization:** Acme Inc

## Related Documents

- Business Continuity Plan (`BUSINESS_CONTINUITY_PLAN.md`)
- Incident Response Plan (`INCIDENT_RESPONSE_PLAN.md`)
- Backup Policy (`BACKUP_POLICY.md`)

---

This Disaster Recovery Plan (DRP) defines the procedures for recovering **Acme Inc**'s **nextjs-saas-example** application from catastrophic failures, including complete infrastructure loss, data corruption, security breaches, and natural disasters. It complements the Business Continuity Plan (BCP) and Incident Response Plan.

## 1. Disaster Scenarios and Classification

| Scenario | Severity | RTO Target | RPO Target | Trigger |
|----------|----------|------------|------------|---------|
| Complete data center / region outage | Critical | 4 hours | 5 minutes | Cloud provider outage, natural disaster |
| Database corruption or loss | Critical | 2 hours | 5 minutes | Hardware failure, human error, malicious action |
| Ransomware / security breach | Critical | 4 hours | 0 minutes (from clean backup) | Cyberattack |
| Application deployment failure | High | 1 hour | 0 minutes | Bad deployment, configuration error |
| Third-party service permanent shutdown | High | 24 hours | 1 hour | Vendor bankruptcy, API deprecation |
| DNS / CDN failure | High | 2 hours | N/A | DNS provider outage, DDoS |
| Data corruption (silent) | Medium | 24 hours | Depends on detection time | Software bug, migration error |

## 2. Recovery Procedures per Service

### 2.1 Database Services

**Affected services:** prisma

**Full Recovery Procedure:**

1. **Assess** — Determine scope of data loss or corruption
   - Check last known good backup timestamp
   - Identify affected tables/collections
   - Estimate data loss window
2. **Provision** — Stand up replacement database infrastructure
   - [ ] Create new database instance in recovery region
   - [ ] Configure networking, security groups, and access controls
   - [ ] Apply encryption settings matching production
3. **Restore** — Recover data from backups
   - [ ] Identify most recent valid backup
   - [ ] Restore full backup to new instance
   - [ ] Apply WAL/binlog/oplog for point-in-time recovery
   - [ ] Verify row counts and data integrity checksums
4. **Reconnect** — Point application to recovered database
   - [ ] Update connection strings / DNS records
   - [ ] Verify application connectivity
   - [ ] Run smoke tests against recovered data
5. **Validate** — Confirm recovery completeness
   - [ ] Compare record counts with last known backup metrics
   - [ ] Verify critical data integrity (user accounts, transactions)
   - [ ] Test all CRUD operations

### 2.2 Authentication Services

**Affected services:** @supabase/supabase-js

**Recovery Procedure:**

1. **If self-hosted auth:**
   - [ ] Restore auth database from backup
   - [ ] Rotate all signing keys and session secrets
   - [ ] Invalidate all existing sessions (force re-login)
   - [ ] Verify OAuth callback URLs are correctly configured
2. **If third-party auth provider:**
   - [ ] Verify provider status and connectivity
   - [ ] Re-configure API keys if compromised
   - [ ] Update redirect/callback URLs if domain changed
   - [ ] Test login flows (email/password, OAuth, MFA)
3. **Post-recovery:**
   - [ ] Force password reset if credential compromise is suspected
   - [ ] Review and revoke suspicious sessions
   - [ ] Notify affected users

### 2.3 Payment Services

**Affected services:** stripe, stripe-ios

**Recovery Procedure:**

1. **Assess transaction state:**
   - [ ] Identify any in-flight transactions at time of disaster
   - [ ] Check payment processor dashboard for transaction status
   - [ ] Document any transactions in uncertain state
2. **Restore payment integration:**
   - [ ] Verify payment processor API keys (rotate if compromised)
   - [ ] Verify webhook endpoints are receiving events
   - [ ] Re-process any failed webhook deliveries
3. **Reconciliation:**
   - [ ] Compare internal transaction records with payment processor
   - [ ] Resolve any discrepancies
   - [ ] Notify finance team of any gaps
   - [ ] Use idempotency keys to safely retry uncertain transactions

### 2.4 AI Services

**Affected services:** openai

**Recovery Procedure:**

1. [ ] Verify AI provider API status and connectivity
2. [ ] Re-configure API keys if compromised
3. [ ] Restore any cached AI model configurations or fine-tuning data from backup
4. [ ] Re-enable AI features gradually (canary rollout)
5. [ ] Verify AI output quality before full restoration

### 2.5 Email Services

**Affected services:** resend

**Recovery Procedure:**

1. [ ] Verify email provider status and credentials
2. [ ] Verify DNS records (SPF, DKIM, DMARC) point to correct provider
3. [ ] Re-process any queued transactional emails
4. [ ] Test email delivery to multiple providers (Gmail, Outlook, etc.)

### 2.6 Application Infrastructure

**Recovery Procedure:**

1. **Infrastructure provisioning:**
   - [ ] Provision compute resources in recovery region
   - [ ] Configure networking, load balancers, and DNS
   - [ ] Deploy application from latest known-good container image or build
2. **Configuration:**
   - [ ] Restore environment variables from secrets manager
   - [ ] Update service connection strings to recovered infrastructure
   - [ ] Configure SSL/TLS certificates
3. **Deployment:**
   - [ ] Deploy application manually or via deployment script
   - [ ] Run health checks and smoke tests
   - [ ] Verify all external integrations are connected
4. **DNS cutover:**
   - [ ] Update DNS records to point to recovery infrastructure
   - [ ] Verify DNS propagation
   - [ ] Monitor traffic routing

## 3. Communication Templates

### 3.1 Internal — Disaster Declaration

```
DISASTER RECOVERY ACTIVATION — Acme Inc
============================================

Severity: [CRITICAL / HIGH]
Declared by: [Name]
Date/Time: [UTC timestamp]

SITUATION:
[Description of the disaster — what happened, what is affected]

IMPACT:
- Services affected: [list]
- Estimated data loss: [timeframe]
- Estimated recovery time: [hours]

ACTIONS REQUIRED:
1. All DR team members report to [war room / Slack channel]
2. Begin recovery procedures per Disaster Recovery Plan Section 2
3. Status updates every [30 minutes / 1 hour]

DR TEAM LEAD: [Name]
COMMUNICATION LEAD: [Name]
```

### 3.2 External — Customer Notification (Major Outage)

```
Subject: Acme Inc Service Disruption — Recovery in Progress

Dear [Customer / Users],

We are currently experiencing a significant service disruption affecting nextjs-saas-example.
Our disaster recovery procedures have been activated and our team is working
to restore all services as quickly as possible.

CURRENT STATUS:
- Services affected: [list affected features]
- Estimated time to recovery: [timeframe]
- Data impact: [none / potential data loss of X minutes]

WHAT WE ARE DOING:
- [Brief description of recovery actions]
- We will provide updates every [timeframe] on our status page

WHAT YOU CAN DO:
- [Any actions users should take]
- Monitor our status page at [URL] for real-time updates

For urgent inquiries, contact legal@acme.com.

We apologize for the inconvenience and thank you for your patience.

Sincerely,
Acme Inc
```

### 3.3 External — Recovery Complete Notification

```
Subject: Acme Inc — Services Restored

Dear [Customer / Users],

We are pleased to confirm that all services have been restored following
the service disruption on [date].

SUMMARY:
- Disruption duration: [start time] to [end time] UTC
- Root cause: [brief description]
- Data impact: [none / details of any data loss]
- Services affected: [list]

ACTIONS TAKEN:
- [What was done to recover]
- [What is being done to prevent recurrence]

IF YOU NOTICE ISSUES:
- [Any steps users should take to verify their data]
- Contact legal@acme.com if you experience any problems

We sincerely apologize for the disruption and are committed to
preventing future incidents of this nature.

Sincerely,
Acme Inc
```

### 3.4 Regulatory Notification (If Data Breach)

If the disaster involves a personal data breach, follow the **Incident Response Plan** notification procedures (GDPR 72-hour requirement). The disaster recovery communication does NOT replace regulatory breach notification obligations.

## 4. Disaster Recovery Testing Schedule

| Test Type | Frequency | Scope | Participants | Duration |
|----------|-----------|-------|-------------|----------|
| Tabletop exercise | Quarterly | Walk through DR scenarios and decision points | DR team, engineering leads | 2 hours |
| Backup restore drill | Monthly | Restore single data store from backup | Database admin, on-call engineer | 2–4 hours |
| Partial failover test | Quarterly | Fail over one service to recovery infrastructure | Engineering team | 4 hours |
| Full DR simulation | Annually | Simulate complete infrastructure loss and recovery | All DR team members | 1 full day |
| Communication drill | Semi-annually | Test notification chains, templates, and status page | DR team, communications | 1 hour |
| Runbook validation | Quarterly | Verify all runbook steps are current and accurate | Engineering team | 2 hours |

### 4.1 Test Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Recovery Time (actual) | Within declared RTO | Time from disaster declaration to service restoration |
| Recovery Point (actual) | Within declared RPO | Difference between disaster time and recovered data timestamp |
| Data integrity | 100% | Checksum validation of recovered data |
| Service functionality | All critical flows pass | Smoke test pass rate |
| Communication delivery | All stakeholders notified | Notification receipt confirmation |

## 5. Disaster Recovery Team

| Role | Primary | Backup | Responsibility |
|------|---------|--------|---------------|
| DR Commander | [Name] | [Backup] | Declares disaster; coordinates recovery; makes go/no-go decisions |
| Technical Lead | [Name] | [Backup] | Directs technical recovery procedures |
| Database Lead | [Name] | [Backup] | Database backup restoration and validation |
| Infrastructure Lead | [Name] | [Backup] | Infrastructure provisioning and networking |
| Communications Lead | [Name] | [Backup] | Internal and external communications |
| Security Lead | [Name] | [Backup] | Security assessment; credential rotation; breach evaluation |
| Executive Sponsor | [Name] | [Backup] | Business decisions; budget approval; regulatory liaison |

## 6. Related Documents

| Document | Relationship |
|----------|-------------|
| Business Continuity Plan | Parent plan; DR is a subset of BCP |
| Incident Response Plan | Invoked when disaster involves a security incident |
| Backup Policy | Defines backup schedules and retention that DR relies on |
| Encryption Policy | Defines encryption requirements for recovered infrastructure |
| Change Management Policy | Governs the deployment of recovery changes |

## 7. Plan Maintenance

This Disaster Recovery Plan must be reviewed and updated:

- After every DR test or drill (incorporate lessons learned)
- After any actual disaster recovery event
- When infrastructure or services change significantly
- At minimum **semi-annually**

For questions about this plan, contact **legal@acme.com**.

---

*This Disaster Recovery Plan was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **nextjs-saas-example** codebase. Recovery procedures should be reviewed and customized by your engineering and operations teams based on actual infrastructure, RPO/RTO requirements, and business priorities.*