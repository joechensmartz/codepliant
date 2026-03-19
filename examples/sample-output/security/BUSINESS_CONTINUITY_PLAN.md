# Business Continuity Plan

> **Document Version:** 1.0  
> **Document Owner:** Acme Inc  
> **Next Review Date:** 2027-03-18


**Last updated:** 2026-03-18

**Project:** nextjs-saas-example
**Organization:** Acme Inc

## Related Documents

- Disaster Recovery Plan (`DISASTER_RECOVERY_PLAN.md`)
- Incident Response Plan (`INCIDENT_RESPONSE_PLAN.md`)
- Backup Policy (`BACKUP_POLICY.md`)

---

This Business Continuity Plan (BCP) defines recovery objectives, failover procedures, and communication protocols for **Acme Inc**'s **nextjs-saas-example** application. It ensures that critical services can be restored within acceptable timeframes following an outage, disaster, or other disruptive event.

## 1. Recovery Objectives by Service

Recovery Time Objective (RTO) defines the maximum acceptable downtime. Recovery Point Objective (RPO) defines the maximum acceptable data loss window.

### 1.1 Critical Services (RTO: 1 hour, RPO: 0–5 minutes)

Services whose outage immediately prevents users from accessing core functionality.

| Service | Category | RTO | RPO | Recovery Strategy |
|---------|----------|-----|-----|-------------------|
| @supabase/supabase-js | Authentication | 1 hour | 0 minutes | Session cache failover; extend existing tokens |
| stripe | Payment Processing | 1 hour | 0 minutes | Transaction queue with retry; idempotency keys |
| stripe-ios | Payment Processing | 1 hour | 0 minutes | Transaction queue with retry; idempotency keys |
| prisma | Database | 1 hour | 5 minutes | Automated replica promotion; point-in-time recovery |

### 1.2 High Priority Services (RTO: 4 hours, RPO: 1 hour)

Services that support core functionality but have workarounds available.

| Service | Category | RTO | RPO | Recovery Strategy |
|---------|----------|-----|-----|-------------------|
| resend | Email | 4 hours | 1 hour | Queue with retry; alternative SMTP provider |
| openai | AI Service | 4 hours | 1 hour | Graceful degradation; disable AI features |

### 1.3 Standard Services (RTO: 24 hours, RPO: 24 hours)

Services whose outage is noticeable but does not prevent core operations.

| Service | Category | RTO | RPO | Recovery Strategy |
|---------|----------|-----|-----|-------------------|
| @sentry/node | Monitoring | 24 hours | 24 hours | Secondary monitoring; manual checks |
| posthog | Analytics | 24 hours | 24 hours | Data buffering; delayed processing |

## 2. Infrastructure Overview

Cloud provider details should be documented here. Run a cloud scan to auto-populate.

### 2.2 Architecture Diagram

```
[TODO: Insert or link to architecture diagram showing:]
- Application servers and their locations
- Database servers and replication topology
- CDN and edge locations
- Third-party service dependencies
- Network connectivity and failover paths
```

## 3. Failover Procedures

### 3.1 Database Failover

Detected database service(s): prisma

1. **Detection** — Automated monitoring detects database unavailability
2. **Assessment** — Determine if the outage is transient (retry) or persistent (failover)
3. **Failover Execution**
   - [ ] Promote read replica to primary (if using replication)
   - [ ] Update connection strings / DNS records
   - [ ] Verify application connectivity to new primary
   - [ ] Validate data integrity after failover
4. **Communication** — Notify engineering team and update status page
5. **Recovery** — Rebuild failed node and re-establish replication

### 3.2 Application Failover

1. **Detection** — Health check failures trigger failover
2. **Traffic Routing** — Load balancer / DNS routes traffic to healthy instances
3. **Scaling** — Auto-scale additional instances if capacity is reduced
4. **Verification** — Confirm application functionality in failover state

### 3.3 Authentication Service Failover

Detected auth service(s): @supabase/supabase-js

- [ ] If third-party auth is unavailable, evaluate enabling cached session validation
- [ ] Extend existing session tokens to prevent mass logouts
- [ ] Display maintenance notice on login page
- [ ] Monitor auth provider status page for restoration timeline
- [ ] Once restored, force session refresh for security

### 3.4 Payment Service Failover

Detected payment service(s): stripe, stripe-ios

- [ ] Queue pending transactions for retry when service is restored
- [ ] Display user-facing message about temporary payment unavailability
- [ ] Do NOT attempt to reprocess payments without idempotency keys
- [ ] Notify finance team of any transactions in uncertain state
- [ ] After restoration, reconcile all queued transactions

### 3.5 AI Service Failover

Detected AI service(s): openai

- [ ] Activate graceful degradation (disable AI features, show fallback content)
- [ ] Queue AI requests for processing when service is restored (if applicable)
- [ ] Display user-facing notice that AI features are temporarily unavailable
- [ ] Monitor AI provider status page for restoration timeline

## 4. Backup Strategy

### 4.1 Backup Schedule

| Data Type | Frequency | Retention | Storage Location | Encryption |
|-----------|-----------|-----------|-----------------|------------|
| Production database | Continuous (streaming) + daily snapshot | 30 days | [Backup region] | AES-256 at rest |
| User-uploaded files | Daily incremental, weekly full | 90 days | [Backup region] | AES-256 at rest |
| Application configuration | On every change (version control) | Indefinite | Git repository | In transit (TLS) |
| Secrets and credentials | On rotation | Current + 1 previous | Secret manager | Envelope encryption |
| Audit logs | Daily export | 1 year minimum | [Compliance storage] | AES-256 at rest |

### 4.2 Backup Verification

- [ ] Automated backup verification runs daily (check backup completeness and integrity)
- [ ] Monthly restore drill — restore from backup to a staging environment
- [ ] Quarterly full disaster recovery test (see Section 8)
- [ ] Document all backup test results and any issues found

## 5. Communication Plan

### 5.1 Internal Communication

| Severity | Notify | Channel | Timeline |
|----------|--------|---------|----------|
| Critical (P1) | All engineering + leadership | Slack/Teams war room + phone | Immediately |
| High (P2) | Engineering lead + on-call | Slack/Teams channel | Within 30 minutes |
| Medium (P3) | Engineering team | Slack/Teams channel | Within 2 hours |
| Low (P4) | Relevant team | Ticket / async update | Within 24 hours |

### 5.2 External Communication

| Audience | Channel | Responsibility | Template |
|----------|---------|---------------|----------|
| Users / Customers | Status page + in-app banner | Communications Lead | See 5.4 |
| Enterprise clients | Direct email / Slack | Account Management | See 5.4 |
| Regulators (if data breach) | Formal notification | DPO / Legal | See Incident Response Plan |
| Partners / Vendors | Email | Business Operations | As needed |

### 5.3 Escalation Path

```
On-call Engineer
    └─> Engineering Lead
          └─> VP of Engineering
                └─> CTO / CEO
                      └─> Board (if material impact)
```

### 5.4 Status Update Templates

**Initial notification:**
```
[Acme Inc] Service Disruption — [Service Name]

We are currently experiencing issues with [affected service/feature].
Our engineering team is investigating and working to restore service.

Impact: [Description of user impact]
Started: [Time in UTC]
Next update: [Time — within 1 hour for P1/P2]
```

**Resolution notification:**
```
[Acme Inc] Resolved — [Service Name]

The issue affecting [service/feature] has been resolved.

Duration: [Total downtime]
Root cause: [Brief description]
Next steps: [Any follow-up actions users need to take]
```

## 6. Roles and Responsibilities

| Role | Primary Responsibility | Backup |
|------|----------------------|--------|
| Incident Commander | Overall coordination of BCP activation | [Backup name] |
| Technical Lead | Directs technical recovery efforts | [Backup name] |
| Communications Lead | Manages internal and external communications | [Backup name] |
| Operations Lead | Infrastructure and deployment management | [Backup name] |
| Data Protection Officer | Assesses data impact and regulatory obligations | [Backup name] |

## 7. Third-Party Dependency Map

The following third-party services are critical to application operation:

| Service | Category | Impact if Unavailable | Alternative / Workaround |
|---------|----------|----------------------|--------------------------|
| @sentry/node | monitoring | Blind to errors and performance issues | Manual log review; secondary tools |
| @supabase/supabase-js | auth | Users cannot sign in or register | Cached sessions; manual verification |
| openai | ai | AI-powered features unavailable | Disable AI features; show static content |
| posthog | analytics | Usage data not collected (no user impact) | Buffer events client-side |
| prisma | database | Data reads/writes unavailable | Read replica; cached responses |
| resend | email | Transactional emails delayed or undelivered | Alternative email provider; manual send |
| stripe | payment | Payment processing halted | Queue transactions for later processing |
| stripe-ios | payment | Payment processing halted | Queue transactions for later processing |

## 8. Testing and Drills

| Exercise | Frequency | Scope | Participants |
|----------|-----------|-------|-------------|
| Tabletop exercise | Quarterly | Walk through BCP scenarios verbally | All BCP role holders |
| Backup restore drill | Monthly | Restore from backup to staging | Engineering team |
| Failover test | Quarterly | Trigger controlled failover | Engineering + Operations |
| Full DR simulation | Annually | Simulate complete outage, activate BCP | All teams |
| Communication drill | Semi-annually | Test notification chains and templates | All BCP role holders |

After each drill, document:

- [ ] What worked well
- [ ] What needs improvement
- [ ] Action items with owners and deadlines
- [ ] Updates to this BCP based on lessons learned

## 9. Plan Maintenance

This Business Continuity Plan must be reviewed and updated:

- After any significant infrastructure change
- After any actual incident or outage
- After each DR drill or tabletop exercise
- At minimum quarterly
- When adding or removing critical third-party services

For questions about this plan, contact **legal@acme.com**.

---

*This Business Continuity Plan was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **nextjs-saas-example** codebase. Recovery objectives and procedures should be reviewed and customized by your engineering and operations teams based on actual infrastructure and business requirements.*