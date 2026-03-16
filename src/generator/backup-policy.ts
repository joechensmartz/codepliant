import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";
import type { DatabaseScanResult, DatabaseType } from "../scanner/database-scanner.js";

// ── Backup profiles per database type ──────────────────────────────────────

interface BackupProfile {
  backupMethod: string;
  recommendedSchedule: string;
  retentionRecommendation: string;
  recoveryMethod: string;
  pointInTimeRecovery: boolean;
}

const DATABASE_BACKUP_PROFILES: Record<DatabaseType, BackupProfile> = {
  postgresql: {
    backupMethod: "pg_dump (logical), pg_basebackup (physical), WAL archiving (continuous)",
    recommendedSchedule: "Continuous WAL archiving + daily full backup",
    retentionRecommendation: "30 days for daily backups; 7 days for WAL segments; 1 year for monthly snapshots",
    recoveryMethod: "Point-in-time recovery via WAL replay; pg_restore for logical backups",
    pointInTimeRecovery: true,
  },
  mysql: {
    backupMethod: "mysqldump (logical), mysqlbackup / Percona XtraBackup (physical), binary log replication",
    recommendedSchedule: "Daily full backup + continuous binary log archiving",
    retentionRecommendation: "30 days for daily backups; 7 days for binary logs; 1 year for monthly snapshots",
    recoveryMethod: "Point-in-time recovery via binary log replay; mysql restore for logical backups",
    pointInTimeRecovery: true,
  },
  mongodb: {
    backupMethod: "mongodump (logical), filesystem snapshots, MongoDB Atlas continuous backup",
    recommendedSchedule: "Continuous oplog-based backup (Atlas) or daily mongodump + oplog tailing",
    retentionRecommendation: "30 days for daily backups; 7 days for oplog; 1 year for monthly snapshots",
    recoveryMethod: "mongorestore for logical backups; oplog replay for point-in-time recovery",
    pointInTimeRecovery: true,
  },
  redis: {
    backupMethod: "RDB snapshots, AOF persistence, managed service snapshots",
    recommendedSchedule: "RDB snapshot every 1 hour; AOF fsync every second",
    retentionRecommendation: "7 days for hourly snapshots; 30 days for daily snapshots",
    recoveryMethod: "RDB file restore; AOF replay",
    pointInTimeRecovery: false,
  },
  sqlite: {
    backupMethod: "sqlite3 .backup command, file copy (with WAL checkpoint)",
    recommendedSchedule: "Daily file backup; before and after schema migrations",
    retentionRecommendation: "30 days for daily backups; indefinite for migration checkpoints",
    recoveryMethod: "File replacement; WAL checkpoint before restore",
    pointInTimeRecovery: false,
  },
  dynamodb: {
    backupMethod: "On-demand backups, continuous backups (PITR), AWS Backup",
    recommendedSchedule: "Enable PITR (continuous); weekly on-demand snapshots for long-term retention",
    retentionRecommendation: "PITR: 35-day rolling window; on-demand: 1 year for monthly snapshots",
    recoveryMethod: "Restore to new table from PITR or on-demand backup; re-point application",
    pointInTimeRecovery: true,
  },
  mariadb: {
    backupMethod: "mariadb-dump (logical), Mariabackup (physical), binary log archiving",
    recommendedSchedule: "Daily full backup + continuous binary log archiving",
    retentionRecommendation: "30 days for daily backups; 7 days for binary logs; 1 year for monthly snapshots",
    recoveryMethod: "Point-in-time recovery via binary log replay; mariadb restore for logical backups",
    pointInTimeRecovery: true,
  },
  cassandra: {
    backupMethod: "nodetool snapshot, incremental backups, Medusa for orchestrated backups",
    recommendedSchedule: "Daily snapshot per node; incremental backups enabled",
    retentionRecommendation: "30 days for daily snapshots; 7 days for incremental backups",
    recoveryMethod: "Restore from snapshot; rebuild node from replicas if available",
    pointInTimeRecovery: false,
  },
  elasticsearch: {
    backupMethod: "Snapshot API to S3/GCS/Azure Blob, Searchable snapshots (Elastic Cloud)",
    recommendedSchedule: "Daily snapshot; SLM policy for lifecycle management",
    retentionRecommendation: "30 days for daily snapshots; 1 year for monthly snapshots",
    recoveryMethod: "Restore from snapshot to existing or new cluster",
    pointInTimeRecovery: false,
  },
};

// ── Generator ──────────────────────────────────────────────────────────────

/**
 * Generates BACKUP_POLICY.md based on detected databases.
 * Returns null if no databases are detected.
 */
export function generateBackupPolicy(
  scan: ScanResult,
  ctx?: GeneratorContext,
  dbScan?: DatabaseScanResult,
): string | null {
  const databaseServices = scan.services.filter((s) => s.category === "database");

  if (databaseServices.length === 0 && (!dbScan || dbScan.databases.length === 0)) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const securityEmail = ctx?.securityEmail || contactEmail;
  const date = new Date().toISOString().split("T")[0];

  const hasPayment = scan.services.some((s) => s.category === "payment");
  const storageServices = scan.services.filter((s) => s.category === "storage");

  const sections: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────
  sections.push("# Backup Policy");
  sections.push("");
  sections.push(`**Last updated:** ${date}`);
  sections.push("");
  sections.push(`**Project:** ${scan.projectName}`);
  sections.push(`**Organization:** ${company}`);
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push(
    `This Backup Policy defines the backup schedules, retention periods, recovery procedures, and testing requirements for all data stores used by **${company}**'s **${scan.projectName}** application. ` +
    `It supports compliance with GDPR Article 32 (availability and resilience), SOC 2 A1.2 (backup and recovery), and ISO 27001 Annex A.12.3 (information backup).`
  );
  sections.push("");

  // ── 1. Backup Schedule ──────────────────────────────────────────────
  sections.push("## 1. Backup Schedule per Data Store");
  sections.push("");
  sections.push("| Data Store | Backup Method | Schedule | Point-in-Time Recovery |");
  sections.push("|-----------|---------------|----------|----------------------|");

  // Collect all detected database types
  const detectedTypes = new Set<DatabaseType>();

  if (dbScan) {
    for (const db of dbScan.databases) {
      detectedTypes.add(db.type);
      const profile = DATABASE_BACKUP_PROFILES[db.type];
      const displayName = db.type.charAt(0).toUpperCase() + db.type.slice(1);
      sections.push(
        `| ${displayName} | ${profile.backupMethod.split(",")[0]} | ${profile.recommendedSchedule} | ${profile.pointInTimeRecovery ? "Yes" : "No"} |`
      );
    }
  }

  for (const svc of databaseServices) {
    const key = svc.name.toLowerCase() as DatabaseType;
    if (!detectedTypes.has(key) && DATABASE_BACKUP_PROFILES[key]) {
      detectedTypes.add(key);
      const profile = DATABASE_BACKUP_PROFILES[key];
      sections.push(
        `| ${svc.name} | ${profile.backupMethod.split(",")[0]} | ${profile.recommendedSchedule} | ${profile.pointInTimeRecovery ? "Yes" : "No"} |`
      );
    }
  }

  // Storage services
  if (storageServices.length > 0) {
    for (const svc of storageServices) {
      sections.push(`| ${svc.name} (File Storage) | Cross-region replication + versioning | Daily incremental, weekly full | Via versioning |`);
    }
  }

  // Standard entries every project needs
  sections.push("| Application configuration | Version control (Git) | On every change | Full history via Git |");
  sections.push("| Secrets and credentials | Secrets manager snapshot | On every rotation | Via secrets manager versioning |");

  sections.push("");

  // ── 2. Retention Periods ────────────────────────────────────────────
  sections.push("## 2. Retention Periods");
  sections.push("");
  sections.push("| Data Store | Daily Backups | Weekly Backups | Monthly Backups | Annual Backups |");
  sections.push("|-----------|--------------|----------------|-----------------|----------------|");

  for (const dbType of detectedTypes) {
    const displayName = dbType.charAt(0).toUpperCase() + dbType.slice(1);
    const isTransient = dbType === "redis";
    if (isTransient) {
      sections.push(`| ${displayName} | 7 days | 30 days | N/A | N/A |`);
    } else {
      sections.push(`| ${displayName} | 30 days | 90 days | 1 year | 7 years (if required) |`);
    }
  }

  if (storageServices.length > 0) {
    sections.push("| File storage | 30 days | 90 days | 1 year | 7 years (if required) |");
  }
  sections.push("| Audit logs | 90 days | 1 year | 1 year | 7 years |");

  sections.push("");

  if (hasPayment) {
    sections.push("> **PCI DSS Note:** Payment-related data backups must comply with PCI DSS Requirement 3 retention limits. Do not retain cardholder data beyond business need. Encrypted backup media must be tracked and securely destroyed when retention period expires.");
    sections.push("");
  }

  sections.push("### 2.1 Retention Exceptions");
  sections.push("");
  sections.push("- **Legal hold:** Backups may be retained beyond standard periods if required by legal proceedings");
  sections.push("- **Regulatory requirement:** Industry-specific regulations may mandate longer retention (e.g., HIPAA 6 years, SOX 7 years)");
  sections.push("- **Data subject request:** GDPR deletion requests apply to backups; establish a process to track and purge from backup rotations");
  sections.push("");

  // ── 3. Recovery Procedures ──────────────────────────────────────────
  sections.push("## 3. Recovery Procedures");
  sections.push("");

  for (const dbType of detectedTypes) {
    const displayName = dbType.charAt(0).toUpperCase() + dbType.slice(1);
    const profile = DATABASE_BACKUP_PROFILES[dbType];

    sections.push(`### 3.${Array.from(detectedTypes).indexOf(dbType) + 1} ${displayName} Recovery`);
    sections.push("");
    sections.push(`**Recovery method:** ${profile.recoveryMethod}`);
    sections.push("");
    sections.push("**Recovery steps:**");
    sections.push("");
    sections.push("1. Identify the target recovery point (timestamp or backup ID)");
    sections.push("2. Notify the engineering team and stakeholders");
    sections.push(`3. Restore to a staging/temporary environment first`);
    sections.push("4. Validate data integrity and completeness");
    sections.push("5. If validated, promote restored data to production");
    sections.push("6. Verify application connectivity and functionality");
    sections.push("7. Document the recovery in the incident log");
    sections.push("");
  }

  // ── 4. Recovery Testing ─────────────────────────────────────────────
  sections.push("## 4. Recovery Testing Schedule");
  sections.push("");
  sections.push("Regular recovery testing ensures that backups are viable and the team is prepared for data recovery scenarios.");
  sections.push("");
  sections.push("| Test Type | Frequency | Scope | Success Criteria |");
  sections.push("|----------|-----------|-------|-----------------|");
  sections.push("| Backup integrity check | Daily (automated) | All data stores | Backup completes without errors; checksums valid |");
  sections.push("| Single-table restore | Monthly | Each primary database | Table restored to staging; data matches source |");
  sections.push("| Full database restore | Quarterly | Each primary database | Complete database restored to staging; application functional |");
  sections.push("| Point-in-time recovery | Quarterly | Databases with PITR | Restore to specific timestamp; data consistent to that point |");
  sections.push("| Cross-region restore | Semi-annually | All data stores | Restore from backup region; acceptable RTO achieved |");
  sections.push("| Full disaster recovery | Annually | All data stores + application | Full application operational from backups; RTO/RPO met |");
  sections.push("");

  sections.push("### 4.1 Test Documentation");
  sections.push("");
  sections.push("Each recovery test must document:");
  sections.push("");
  sections.push("- [ ] Date and time of test");
  sections.push("- [ ] Data store tested");
  sections.push("- [ ] Backup used (ID / timestamp)");
  sections.push("- [ ] Recovery time achieved (actual RTO)");
  sections.push("- [ ] Data loss window (actual RPO)");
  sections.push("- [ ] Pass/fail result");
  sections.push("- [ ] Issues encountered and remediation");
  sections.push("- [ ] Tester name and sign-off");
  sections.push("");

  // ── 5. Backup Security ──────────────────────────────────────────────
  sections.push("## 5. Backup Security");
  sections.push("");
  sections.push("| Requirement | Standard |");
  sections.push("|------------|----------|");
  sections.push("| Encryption at rest | AES-256 for all backup data |");
  sections.push("| Encryption in transit | TLS 1.2+ for backup transfers |");
  sections.push("| Access control | Backup access limited to authorized personnel; MFA required |");
  sections.push("| Backup separation | Backups stored in a separate account/region from production |");
  sections.push("| Immutability | Object lock / WORM storage for compliance-critical backups |");
  sections.push("| Monitoring | Alerting on backup failures, unexpected access, or deletion |");
  sections.push("");

  // ── 6. Roles ────────────────────────────────────────────────────────
  sections.push("## 6. Roles and Responsibilities");
  sections.push("");
  sections.push("| Role | Responsibility |");
  sections.push("|------|---------------|");
  sections.push("| Database Administrator / DevOps | Configure and monitor backup jobs; execute restores |");
  sections.push("| Engineering Lead | Approve recovery procedures; validate test results |");
  sections.push("| Security Team | Audit backup encryption and access controls |");
  sections.push("| Compliance Officer | Verify retention periods meet regulatory requirements |");
  sections.push("");

  // ── Review ──────────────────────────────────────────────────────────
  sections.push("## 7. Policy Review");
  sections.push("");
  sections.push("This backup policy must be reviewed:");
  sections.push("");
  sections.push("- At minimum **quarterly**");
  sections.push("- When new data stores are added or removed");
  sections.push("- After any data loss incident");
  sections.push("- After each recovery test to incorporate lessons learned");
  sections.push("");
  sections.push(`For questions about this policy, contact **${securityEmail}**.`);
  sections.push("");

  // ── Disclaimer ──────────────────────────────────────────────────────
  sections.push("---");
  sections.push("");
  sections.push(
    `*This Backup Policy was generated by [Codepliant](https://github.com/joechensmartz/codepliant) ` +
    `based on an automated scan of the **${scan.projectName}** codebase. ` +
    `Backup schedules and retention periods should be reviewed and customized by your engineering and compliance teams based on actual infrastructure and regulatory requirements.*`
  );

  return sections.join("\n");
}
