import type { ScanResult, DetectedService } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";
import type { CloudScanResult } from "../scanner/cloud-scanner.js";
import type { CiCdScanResult } from "../scanner/ci-cd-scanner.js";

/**
 * Generates DISASTER_RECOVERY_PLAN.md — recovery procedures per service,
 * communication templates, and testing schedule.
 *
 * Returns null if the project has fewer than 3 services (too small for
 * a standalone DR plan; Business Continuity Plan covers basics).
 */
export function generateDisasterRecoveryPlan(
  scan: ScanResult,
  ctx?: GeneratorContext,
  cloudScan?: CloudScanResult,
  cicdScan?: CiCdScanResult,
): string | null {
  if (scan.services.length < 3) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const securityEmail = ctx?.securityEmail || contactEmail;
  const date = new Date().toISOString().split("T")[0];

  const authServices = scan.services.filter((s) => s.category === "auth");
  const paymentServices = scan.services.filter((s) => s.category === "payment");
  const databaseServices = scan.services.filter((s) => s.category === "database");
  const storageServices = scan.services.filter((s) => s.category === "storage");
  const emailServices = scan.services.filter((s) => s.category === "email");
  const aiServices = scan.services.filter((s) => s.category === "ai");
  const monitoringServices = scan.services.filter((s) => s.category === "monitoring");

  const sections: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────
  sections.push("# Disaster Recovery Plan");
  sections.push("");
  sections.push(`**Last updated:** ${date}`);
  sections.push("");
  sections.push(`**Project:** ${scan.projectName}`);
  sections.push(`**Organization:** ${company}`);
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push(
    `This Disaster Recovery Plan (DRP) defines the procedures for recovering **${company}**'s **${scan.projectName}** application from catastrophic failures, ` +
    `including complete infrastructure loss, data corruption, security breaches, and natural disasters. ` +
    `It complements the Business Continuity Plan (BCP) and Incident Response Plan.`
  );
  sections.push("");

  // ── 1. Disaster Scenarios ───────────────────────────────────────────
  sections.push("## 1. Disaster Scenarios and Classification");
  sections.push("");
  sections.push("| Scenario | Severity | RTO Target | RPO Target | Trigger |");
  sections.push("|----------|----------|------------|------------|---------|");
  sections.push("| Complete data center / region outage | Critical | 4 hours | 5 minutes | Cloud provider outage, natural disaster |");
  sections.push("| Database corruption or loss | Critical | 2 hours | 5 minutes | Hardware failure, human error, malicious action |");
  sections.push("| Ransomware / security breach | Critical | 4 hours | 0 minutes (from clean backup) | Cyberattack |");
  sections.push("| Application deployment failure | High | 1 hour | 0 minutes | Bad deployment, configuration error |");
  sections.push("| Third-party service permanent shutdown | High | 24 hours | 1 hour | Vendor bankruptcy, API deprecation |");
  sections.push("| DNS / CDN failure | High | 2 hours | N/A | DNS provider outage, DDoS |");
  sections.push("| Data corruption (silent) | Medium | 24 hours | Depends on detection time | Software bug, migration error |");
  sections.push("");

  // ── 2. Recovery Procedures ──────────────────────────────────────────
  sections.push("## 2. Recovery Procedures per Service");
  sections.push("");

  let procedureNum = 1;

  // Database recovery
  if (databaseServices.length > 0) {
    sections.push(`### 2.${procedureNum} Database Services`);
    sections.push("");
    sections.push(`**Affected services:** ${databaseServices.map((s) => s.name).join(", ")}`);
    sections.push("");
    sections.push("**Full Recovery Procedure:**");
    sections.push("");
    sections.push("1. **Assess** — Determine scope of data loss or corruption");
    sections.push("   - Check last known good backup timestamp");
    sections.push("   - Identify affected tables/collections");
    sections.push("   - Estimate data loss window");
    sections.push("2. **Provision** — Stand up replacement database infrastructure");
    sections.push("   - [ ] Create new database instance in recovery region");
    sections.push("   - [ ] Configure networking, security groups, and access controls");
    sections.push("   - [ ] Apply encryption settings matching production");
    sections.push("3. **Restore** — Recover data from backups");
    sections.push("   - [ ] Identify most recent valid backup");
    sections.push("   - [ ] Restore full backup to new instance");
    sections.push("   - [ ] Apply WAL/binlog/oplog for point-in-time recovery");
    sections.push("   - [ ] Verify row counts and data integrity checksums");
    sections.push("4. **Reconnect** — Point application to recovered database");
    sections.push("   - [ ] Update connection strings / DNS records");
    sections.push("   - [ ] Verify application connectivity");
    sections.push("   - [ ] Run smoke tests against recovered data");
    sections.push("5. **Validate** — Confirm recovery completeness");
    sections.push("   - [ ] Compare record counts with last known backup metrics");
    sections.push("   - [ ] Verify critical data integrity (user accounts, transactions)");
    sections.push("   - [ ] Test all CRUD operations");
    sections.push("");
    procedureNum++;
  }

  // Auth recovery
  if (authServices.length > 0) {
    sections.push(`### 2.${procedureNum} Authentication Services`);
    sections.push("");
    sections.push(`**Affected services:** ${authServices.map((s) => s.name).join(", ")}`);
    sections.push("");
    sections.push("**Recovery Procedure:**");
    sections.push("");
    sections.push("1. **If self-hosted auth:**");
    sections.push("   - [ ] Restore auth database from backup");
    sections.push("   - [ ] Rotate all signing keys and session secrets");
    sections.push("   - [ ] Invalidate all existing sessions (force re-login)");
    sections.push("   - [ ] Verify OAuth callback URLs are correctly configured");
    sections.push("2. **If third-party auth provider:**");
    sections.push("   - [ ] Verify provider status and connectivity");
    sections.push("   - [ ] Re-configure API keys if compromised");
    sections.push("   - [ ] Update redirect/callback URLs if domain changed");
    sections.push("   - [ ] Test login flows (email/password, OAuth, MFA)");
    sections.push("3. **Post-recovery:**");
    sections.push("   - [ ] Force password reset if credential compromise is suspected");
    sections.push("   - [ ] Review and revoke suspicious sessions");
    sections.push("   - [ ] Notify affected users");
    sections.push("");
    procedureNum++;
  }

  // Payment recovery
  if (paymentServices.length > 0) {
    sections.push(`### 2.${procedureNum} Payment Services`);
    sections.push("");
    sections.push(`**Affected services:** ${paymentServices.map((s) => s.name).join(", ")}`);
    sections.push("");
    sections.push("**Recovery Procedure:**");
    sections.push("");
    sections.push("1. **Assess transaction state:**");
    sections.push("   - [ ] Identify any in-flight transactions at time of disaster");
    sections.push("   - [ ] Check payment processor dashboard for transaction status");
    sections.push("   - [ ] Document any transactions in uncertain state");
    sections.push("2. **Restore payment integration:**");
    sections.push("   - [ ] Verify payment processor API keys (rotate if compromised)");
    sections.push("   - [ ] Verify webhook endpoints are receiving events");
    sections.push("   - [ ] Re-process any failed webhook deliveries");
    sections.push("3. **Reconciliation:**");
    sections.push("   - [ ] Compare internal transaction records with payment processor");
    sections.push("   - [ ] Resolve any discrepancies");
    sections.push("   - [ ] Notify finance team of any gaps");
    sections.push("   - [ ] Use idempotency keys to safely retry uncertain transactions");
    sections.push("");
    procedureNum++;
  }

  // Storage recovery
  if (storageServices.length > 0) {
    sections.push(`### 2.${procedureNum} File Storage Services`);
    sections.push("");
    sections.push(`**Affected services:** ${storageServices.map((s) => s.name).join(", ")}`);
    sections.push("");
    sections.push("**Recovery Procedure:**");
    sections.push("");
    sections.push("1. [ ] Verify cross-region replica availability");
    sections.push("2. [ ] Restore from versioned bucket or backup bucket");
    sections.push("3. [ ] Update CDN configuration to point to recovered storage");
    sections.push("4. [ ] Verify file accessibility and permissions");
    sections.push("5. [ ] Regenerate any derived files (thumbnails, transcoded media)");
    sections.push("");
    procedureNum++;
  }

  // AI service recovery
  if (aiServices.length > 0) {
    sections.push(`### 2.${procedureNum} AI Services`);
    sections.push("");
    sections.push(`**Affected services:** ${aiServices.map((s) => s.name).join(", ")}`);
    sections.push("");
    sections.push("**Recovery Procedure:**");
    sections.push("");
    sections.push("1. [ ] Verify AI provider API status and connectivity");
    sections.push("2. [ ] Re-configure API keys if compromised");
    sections.push("3. [ ] Restore any cached AI model configurations or fine-tuning data from backup");
    sections.push("4. [ ] Re-enable AI features gradually (canary rollout)");
    sections.push("5. [ ] Verify AI output quality before full restoration");
    sections.push("");
    procedureNum++;
  }

  // Email recovery
  if (emailServices.length > 0) {
    sections.push(`### 2.${procedureNum} Email Services`);
    sections.push("");
    sections.push(`**Affected services:** ${emailServices.map((s) => s.name).join(", ")}`);
    sections.push("");
    sections.push("**Recovery Procedure:**");
    sections.push("");
    sections.push("1. [ ] Verify email provider status and credentials");
    sections.push("2. [ ] Verify DNS records (SPF, DKIM, DMARC) point to correct provider");
    sections.push("3. [ ] Re-process any queued transactional emails");
    sections.push("4. [ ] Test email delivery to multiple providers (Gmail, Outlook, etc.)");
    sections.push("");
    procedureNum++;
  }

  // Application / Infrastructure recovery
  sections.push(`### 2.${procedureNum} Application Infrastructure`);
  sections.push("");
  sections.push("**Recovery Procedure:**");
  sections.push("");
  sections.push("1. **Infrastructure provisioning:**");

  if (cicdScan && cicdScan.platforms.some((p) => p.name === "Terraform")) {
    sections.push("   - [ ] Run `terraform apply` from last known good state to provision infrastructure");
  }
  if (cicdScan && cicdScan.platforms.some((p) => p.name === "Kubernetes")) {
    sections.push("   - [ ] Apply Kubernetes manifests to recovery cluster");
    sections.push("   - [ ] Verify pod health and readiness checks");
  }

  sections.push("   - [ ] Provision compute resources in recovery region");
  sections.push("   - [ ] Configure networking, load balancers, and DNS");
  sections.push("   - [ ] Deploy application from latest known-good container image or build");
  sections.push("2. **Configuration:**");
  sections.push("   - [ ] Restore environment variables from secrets manager");
  sections.push("   - [ ] Update service connection strings to recovered infrastructure");
  sections.push("   - [ ] Configure SSL/TLS certificates");
  sections.push("3. **Deployment:**");

  if (cicdScan && cicdScan.hasDeploymentPipeline) {
    sections.push("   - [ ] Trigger deployment pipeline targeting recovery infrastructure");
  } else {
    sections.push("   - [ ] Deploy application manually or via deployment script");
  }

  sections.push("   - [ ] Run health checks and smoke tests");
  sections.push("   - [ ] Verify all external integrations are connected");
  sections.push("4. **DNS cutover:**");
  sections.push("   - [ ] Update DNS records to point to recovery infrastructure");
  sections.push("   - [ ] Verify DNS propagation");
  sections.push("   - [ ] Monitor traffic routing");
  sections.push("");

  // ── 3. Communication Templates ──────────────────────────────────────
  sections.push("## 3. Communication Templates");
  sections.push("");
  sections.push("### 3.1 Internal — Disaster Declaration");
  sections.push("");
  sections.push("```");
  sections.push(`DISASTER RECOVERY ACTIVATION — ${company}`);
  sections.push("============================================");
  sections.push("");
  sections.push("Severity: [CRITICAL / HIGH]");
  sections.push("Declared by: [Name]");
  sections.push("Date/Time: [UTC timestamp]");
  sections.push("");
  sections.push("SITUATION:");
  sections.push("[Description of the disaster — what happened, what is affected]");
  sections.push("");
  sections.push("IMPACT:");
  sections.push("- Services affected: [list]");
  sections.push("- Estimated data loss: [timeframe]");
  sections.push("- Estimated recovery time: [hours]");
  sections.push("");
  sections.push("ACTIONS REQUIRED:");
  sections.push("1. All DR team members report to [war room / Slack channel]");
  sections.push("2. Begin recovery procedures per Disaster Recovery Plan Section 2");
  sections.push("3. Status updates every [30 minutes / 1 hour]");
  sections.push("");
  sections.push("DR TEAM LEAD: [Name]");
  sections.push(`COMMUNICATION LEAD: [Name]`);
  sections.push("```");
  sections.push("");

  sections.push("### 3.2 External — Customer Notification (Major Outage)");
  sections.push("");
  sections.push("```");
  sections.push(`Subject: ${company} Service Disruption — Recovery in Progress`);
  sections.push("");
  sections.push("Dear [Customer / Users],");
  sections.push("");
  sections.push(`We are currently experiencing a significant service disruption affecting ${scan.projectName}.`);
  sections.push("Our disaster recovery procedures have been activated and our team is working");
  sections.push("to restore all services as quickly as possible.");
  sections.push("");
  sections.push("CURRENT STATUS:");
  sections.push("- Services affected: [list affected features]");
  sections.push("- Estimated time to recovery: [timeframe]");
  sections.push("- Data impact: [none / potential data loss of X minutes]");
  sections.push("");
  sections.push("WHAT WE ARE DOING:");
  sections.push("- [Brief description of recovery actions]");
  sections.push("- We will provide updates every [timeframe] on our status page");
  sections.push("");
  sections.push("WHAT YOU CAN DO:");
  sections.push("- [Any actions users should take]");
  sections.push("- Monitor our status page at [URL] for real-time updates");
  sections.push("");
  sections.push(`For urgent inquiries, contact ${securityEmail}.`);
  sections.push("");
  sections.push("We apologize for the inconvenience and thank you for your patience.");
  sections.push("");
  sections.push("Sincerely,");
  sections.push(company);
  sections.push("```");
  sections.push("");

  sections.push("### 3.3 External — Recovery Complete Notification");
  sections.push("");
  sections.push("```");
  sections.push(`Subject: ${company} — Services Restored`);
  sections.push("");
  sections.push("Dear [Customer / Users],");
  sections.push("");
  sections.push("We are pleased to confirm that all services have been restored following");
  sections.push("the service disruption on [date].");
  sections.push("");
  sections.push("SUMMARY:");
  sections.push("- Disruption duration: [start time] to [end time] UTC");
  sections.push("- Root cause: [brief description]");
  sections.push("- Data impact: [none / details of any data loss]");
  sections.push("- Services affected: [list]");
  sections.push("");
  sections.push("ACTIONS TAKEN:");
  sections.push("- [What was done to recover]");
  sections.push("- [What is being done to prevent recurrence]");
  sections.push("");
  sections.push("IF YOU NOTICE ISSUES:");
  sections.push("- [Any steps users should take to verify their data]");
  sections.push(`- Contact ${contactEmail} if you experience any problems`);
  sections.push("");
  sections.push("We sincerely apologize for the disruption and are committed to");
  sections.push("preventing future incidents of this nature.");
  sections.push("");
  sections.push("Sincerely,");
  sections.push(company);
  sections.push("```");
  sections.push("");

  sections.push("### 3.4 Regulatory Notification (If Data Breach)");
  sections.push("");
  sections.push("If the disaster involves a personal data breach, follow the **Incident Response Plan** notification procedures (GDPR 72-hour requirement). The disaster recovery communication does NOT replace regulatory breach notification obligations.");
  sections.push("");

  // ── 4. DR Testing Schedule ──────────────────────────────────────────
  sections.push("## 4. Disaster Recovery Testing Schedule");
  sections.push("");
  sections.push("| Test Type | Frequency | Scope | Participants | Duration |");
  sections.push("|----------|-----------|-------|-------------|----------|");
  sections.push("| Tabletop exercise | Quarterly | Walk through DR scenarios and decision points | DR team, engineering leads | 2 hours |");
  sections.push("| Backup restore drill | Monthly | Restore single data store from backup | Database admin, on-call engineer | 2–4 hours |");
  sections.push("| Partial failover test | Quarterly | Fail over one service to recovery infrastructure | Engineering team | 4 hours |");
  sections.push("| Full DR simulation | Annually | Simulate complete infrastructure loss and recovery | All DR team members | 1 full day |");
  sections.push("| Communication drill | Semi-annually | Test notification chains, templates, and status page | DR team, communications | 1 hour |");
  sections.push("| Runbook validation | Quarterly | Verify all runbook steps are current and accurate | Engineering team | 2 hours |");
  sections.push("");

  sections.push("### 4.1 Test Success Criteria");
  sections.push("");
  sections.push("| Metric | Target | Measurement |");
  sections.push("|--------|--------|-------------|");
  sections.push("| Recovery Time (actual) | Within declared RTO | Time from disaster declaration to service restoration |");
  sections.push("| Recovery Point (actual) | Within declared RPO | Difference between disaster time and recovered data timestamp |");
  sections.push("| Data integrity | 100% | Checksum validation of recovered data |");
  sections.push("| Service functionality | All critical flows pass | Smoke test pass rate |");
  sections.push("| Communication delivery | All stakeholders notified | Notification receipt confirmation |");
  sections.push("");

  // ── 5. DR Team ──────────────────────────────────────────────────────
  sections.push("## 5. Disaster Recovery Team");
  sections.push("");
  sections.push("| Role | Primary | Backup | Responsibility |");
  sections.push("|------|---------|--------|---------------|");
  sections.push("| DR Commander | [Name] | [Backup] | Declares disaster; coordinates recovery; makes go/no-go decisions |");
  sections.push("| Technical Lead | [Name] | [Backup] | Directs technical recovery procedures |");
  sections.push("| Database Lead | [Name] | [Backup] | Database backup restoration and validation |");
  sections.push("| Infrastructure Lead | [Name] | [Backup] | Infrastructure provisioning and networking |");
  sections.push("| Communications Lead | [Name] | [Backup] | Internal and external communications |");
  sections.push("| Security Lead | [Name] | [Backup] | Security assessment; credential rotation; breach evaluation |");
  sections.push(`| Executive Sponsor | [Name] | [Backup] | Business decisions; budget approval; regulatory liaison |`);
  sections.push("");

  // ── 6. Dependencies ────────────────────────────────────────────────
  sections.push("## 6. Related Documents");
  sections.push("");
  sections.push("| Document | Relationship |");
  sections.push("|----------|-------------|");
  sections.push("| Business Continuity Plan | Parent plan; DR is a subset of BCP |");
  sections.push("| Incident Response Plan | Invoked when disaster involves a security incident |");
  sections.push("| Backup Policy | Defines backup schedules and retention that DR relies on |");
  sections.push("| Encryption Policy | Defines encryption requirements for recovered infrastructure |");
  sections.push("| Change Management Policy | Governs the deployment of recovery changes |");
  sections.push("");

  // ── Review ──────────────────────────────────────────────────────────
  sections.push("## 7. Plan Maintenance");
  sections.push("");
  sections.push("This Disaster Recovery Plan must be reviewed and updated:");
  sections.push("");
  sections.push("- After every DR test or drill (incorporate lessons learned)");
  sections.push("- After any actual disaster recovery event");
  sections.push("- When infrastructure or services change significantly");
  sections.push("- At minimum **semi-annually**");
  sections.push("");
  sections.push(`For questions about this plan, contact **${securityEmail}**.`);
  sections.push("");

  // ── Disclaimer ──────────────────────────────────────────────────────
  sections.push("---");
  sections.push("");
  sections.push(
    `*This Disaster Recovery Plan was generated by [Codepliant](https://github.com/joechensmartz/codepliant) ` +
    `based on an automated scan of the **${scan.projectName}** codebase. ` +
    `Recovery procedures should be reviewed and customized by your engineering and operations teams based on actual infrastructure, RPO/RTO requirements, and business priorities.*`
  );

  return sections.join("\n");
}
