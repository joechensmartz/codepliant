# Backup Policy

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** @documenso/root
**Organization:** [Your Company Name]

## Related Documents

- Disaster Recovery Plan (`DISASTER_RECOVERY_PLAN.md`)
- Business Continuity Plan (`BUSINESS_CONTINUITY_PLAN.md`)
- Encryption Policy (`ENCRYPTION_POLICY.md`)

---

This Backup Policy defines the backup schedules, retention periods, recovery procedures, and testing requirements for all data stores used by **[Your Company Name]**'s **@documenso/root** application. It supports compliance with GDPR Article 32 (availability and resilience), SOC 2 A1.2 (backup and recovery), and ISO 27001 Annex A.12.3 (information backup).

## 1. Backup Schedule per Data Store

| Data Store | Backup Method | Schedule | Point-in-Time Recovery |
|-----------|---------------|----------|----------------------|
| Postgresql | pg_dump (logical) | Continuous WAL archiving + daily full backup | Yes |
| Application configuration | Version control (Git) | On every change | Full history via Git |
| Secrets and credentials | Secrets manager snapshot | On every rotation | Via secrets manager versioning |

## 2. Retention Periods

| Data Store | Daily Backups | Weekly Backups | Monthly Backups | Annual Backups |
|-----------|--------------|----------------|-----------------|----------------|
| Postgresql | 30 days | 90 days | 1 year | 7 years (if required) |
| Audit logs | 90 days | 1 year | 1 year | 7 years |

> **PCI DSS Note:** Payment-related data backups must comply with PCI DSS Requirement 3 retention limits. Do not retain cardholder data beyond business need. Encrypted backup media must be tracked and securely destroyed when retention period expires.

### 2.1 Retention Exceptions

- **Legal hold:** Backups may be retained beyond standard periods if required by legal proceedings
- **Regulatory requirement:** Industry-specific regulations may mandate longer retention (e.g., HIPAA 6 years, SOX 7 years)
- **Data subject request:** GDPR deletion requests apply to backups; establish a process to track and purge from backup rotations

## 3. Recovery Procedures

### 3.1 Postgresql Recovery

**Recovery method:** Point-in-time recovery via WAL replay; pg_restore for logical backups

**Recovery steps:**

1. Identify the target recovery point (timestamp or backup ID)
2. Notify the engineering team and stakeholders
3. Restore to a staging/temporary environment first
4. Validate data integrity and completeness
5. If validated, promote restored data to production
6. Verify application connectivity and functionality
7. Document the recovery in the incident log

## 4. Recovery Testing Schedule

Regular recovery testing ensures that backups are viable and the team is prepared for data recovery scenarios.

| Test Type | Frequency | Scope | Success Criteria |
|----------|-----------|-------|-----------------|
| Backup integrity check | Daily (automated) | All data stores | Backup completes without errors; checksums valid |
| Single-table restore | Monthly | Each primary database | Table restored to staging; data matches source |
| Full database restore | Quarterly | Each primary database | Complete database restored to staging; application functional |
| Point-in-time recovery | Quarterly | Databases with PITR | Restore to specific timestamp; data consistent to that point |
| Cross-region restore | Semi-annually | All data stores | Restore from backup region; acceptable RTO achieved |
| Full disaster recovery | Annually | All data stores + application | Full application operational from backups; RTO/RPO met |

### 4.1 Test Documentation

Each recovery test must document:

- [ ] Date and time of test
- [ ] Data store tested
- [ ] Backup used (ID / timestamp)
- [ ] Recovery time achieved (actual RTO)
- [ ] Data loss window (actual RPO)
- [ ] Pass/fail result
- [ ] Issues encountered and remediation
- [ ] Tester name and sign-off

## 5. Backup Security

| Requirement | Standard |
|------------|----------|
| Encryption at rest | AES-256 for all backup data |
| Encryption in transit | TLS 1.2+ for backup transfers |
| Access control | Backup access limited to authorized personnel; MFA required |
| Backup separation | Backups stored in a separate account/region from production |
| Immutability | Object lock / WORM storage for compliance-critical backups |
| Monitoring | Alerting on backup failures, unexpected access, or deletion |

## 6. Roles and Responsibilities

| Role | Responsibility |
|------|---------------|
| Database Administrator / DevOps | Configure and monitor backup jobs; execute restores |
| Engineering Lead | Approve recovery procedures; validate test results |
| Security Team | Audit backup encryption and access controls |
| Compliance Officer | Verify retention periods meet regulatory requirements |

## 7. Policy Review

This backup policy must be reviewed:

- At minimum **quarterly**
- When new data stores are added or removed
- After any data loss incident
- After each recovery test to incorporate lessons learned

For questions about this policy, contact **[your-email@example.com]**.

---

*This Backup Policy was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **@documenso/root** codebase. Backup schedules and retention periods should be reviewed and customized by your engineering and compliance teams based on actual infrastructure and regulatory requirements.*