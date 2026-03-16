import type { ScanResult, DetectedService } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";
import type { CloudScanResult } from "../scanner/cloud-scanner.js";

/**
 * Generates BUSINESS_CONTINUITY_PLAN.md based on detected infrastructure
 * and services. Includes RTO/RPO per service, failover procedures,
 * and communication plan.
 */
export function generateBusinessContinuityPlan(
  scan: ScanResult,
  ctx?: GeneratorContext,
  cloudScan?: CloudScanResult
): string | null {
  // Only generate if the project has meaningful services
  if (scan.services.length < 3) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const securityEmail = ctx?.securityEmail || contactEmail;
  const date = new Date().toISOString().split("T")[0];

  const sections: string[] = [];

  // Categorize services for RTO/RPO
  const authServices = scan.services.filter((s) => s.category === "auth");
  const paymentServices = scan.services.filter((s) => s.category === "payment");
  const databaseServices = scan.services.filter((s) => s.category === "database");
  const monitoringServices = scan.services.filter((s) => s.category === "monitoring");
  const emailServices = scan.services.filter((s) => s.category === "email");
  const aiServices = scan.services.filter((s) => s.category === "ai");
  const analyticsServices = scan.services.filter(
    (s) => s.category === "analytics" || s.category === "advertising"
  );
  const storageServices = scan.services.filter((s) => s.category === "storage");

  // ── Header ──────────────────────────────────────────────────────────
  sections.push("# Business Continuity Plan");
  sections.push("");
  sections.push(`**Last updated:** ${date}`);
  sections.push("");
  sections.push(`**Project:** ${scan.projectName}`);
  sections.push(`**Organization:** ${company}`);
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push(`This Business Continuity Plan (BCP) defines recovery objectives, failover procedures, and communication protocols for **${company}**'s **${scan.projectName}** application. It ensures that critical services can be restored within acceptable timeframes following an outage, disaster, or other disruptive event.`);
  sections.push("");

  // ── 1. Recovery Objectives ──────────────────────────────────────────
  sections.push("## 1. Recovery Objectives by Service");
  sections.push("");
  sections.push("Recovery Time Objective (RTO) defines the maximum acceptable downtime. Recovery Point Objective (RPO) defines the maximum acceptable data loss window.");
  sections.push("");
  sections.push("### 1.1 Critical Services (RTO: 1 hour, RPO: 0–5 minutes)");
  sections.push("");
  sections.push("Services whose outage immediately prevents users from accessing core functionality.");
  sections.push("");
  sections.push("| Service | Category | RTO | RPO | Recovery Strategy |");
  sections.push("|---------|----------|-----|-----|-------------------|");

  if (authServices.length > 0) {
    for (const s of authServices) {
      sections.push(`| ${s.name} | Authentication | 1 hour | 0 minutes | ${getRecoveryStrategy(s)} |`);
    }
  }
  if (paymentServices.length > 0) {
    for (const s of paymentServices) {
      sections.push(`| ${s.name} | Payment Processing | 1 hour | 0 minutes | ${getRecoveryStrategy(s)} |`);
    }
  }
  if (databaseServices.length > 0) {
    for (const s of databaseServices) {
      sections.push(`| ${s.name} | Database | 1 hour | 5 minutes | ${getRecoveryStrategy(s)} |`);
    }
  }

  if (authServices.length === 0 && paymentServices.length === 0 && databaseServices.length === 0) {
    sections.push("| (No critical services detected) | — | — | — | — |");
  }

  sections.push("");
  sections.push("### 1.2 High Priority Services (RTO: 4 hours, RPO: 1 hour)");
  sections.push("");
  sections.push("Services that support core functionality but have workarounds available.");
  sections.push("");
  sections.push("| Service | Category | RTO | RPO | Recovery Strategy |");
  sections.push("|---------|----------|-----|-----|-------------------|");

  if (emailServices.length > 0) {
    for (const s of emailServices) {
      sections.push(`| ${s.name} | Email | 4 hours | 1 hour | ${getRecoveryStrategy(s)} |`);
    }
  }
  if (storageServices.length > 0) {
    for (const s of storageServices) {
      sections.push(`| ${s.name} | Storage | 4 hours | 1 hour | ${getRecoveryStrategy(s)} |`);
    }
  }
  if (aiServices.length > 0) {
    for (const s of aiServices) {
      sections.push(`| ${s.name} | AI Service | 4 hours | 1 hour | ${getRecoveryStrategy(s)} |`);
    }
  }

  if (emailServices.length === 0 && storageServices.length === 0 && aiServices.length === 0) {
    sections.push("| (No high priority services detected) | — | — | — | — |");
  }

  sections.push("");
  sections.push("### 1.3 Standard Services (RTO: 24 hours, RPO: 24 hours)");
  sections.push("");
  sections.push("Services whose outage is noticeable but does not prevent core operations.");
  sections.push("");
  sections.push("| Service | Category | RTO | RPO | Recovery Strategy |");
  sections.push("|---------|----------|-----|-----|-------------------|");

  if (monitoringServices.length > 0) {
    for (const s of monitoringServices) {
      sections.push(`| ${s.name} | Monitoring | 24 hours | 24 hours | ${getRecoveryStrategy(s)} |`);
    }
  }
  if (analyticsServices.length > 0) {
    for (const s of analyticsServices) {
      sections.push(`| ${s.name} | Analytics | 24 hours | 24 hours | ${getRecoveryStrategy(s)} |`);
    }
  }

  if (monitoringServices.length === 0 && analyticsServices.length === 0) {
    sections.push("| (No standard services detected) | — | — | — | — |");
  }

  sections.push("");

  // ── 2. Infrastructure Overview ──────────────────────────────────────
  sections.push("## 2. Infrastructure Overview");
  sections.push("");

  if (cloudScan && cloudScan.providers.length > 0) {
    sections.push("### 2.1 Cloud Providers");
    sections.push("");
    sections.push("| Provider | Detected Region(s) | Data Residency |");
    sections.push("|----------|--------------------|----------------|");
    for (const p of cloudScan.providers) {
      const regions = p.regions.length > 0 ? p.regions.join(", ") : "Not specified";
      sections.push(`| ${p.displayName} | ${regions} | ${p.dataResidencyNotes.split(".")[0]} |`);
    }
    sections.push("");
  } else {
    sections.push("Cloud provider details should be documented here. Run a cloud scan to auto-populate.");
    sections.push("");
  }

  sections.push("### 2.2 Architecture Diagram");
  sections.push("");
  sections.push("```");
  sections.push("[TODO: Insert or link to architecture diagram showing:]");
  sections.push("- Application servers and their locations");
  sections.push("- Database servers and replication topology");
  sections.push("- CDN and edge locations");
  sections.push("- Third-party service dependencies");
  sections.push("- Network connectivity and failover paths");
  sections.push("```");
  sections.push("");

  // ── 3. Failover Procedures ──────────────────────────────────────────
  sections.push("## 3. Failover Procedures");
  sections.push("");
  sections.push("### 3.1 Database Failover");
  sections.push("");

  if (databaseServices.length > 0) {
    sections.push(`Detected database service(s): ${databaseServices.map((s) => s.name).join(", ")}`);
    sections.push("");
  }

  sections.push("1. **Detection** — Automated monitoring detects database unavailability");
  sections.push("2. **Assessment** — Determine if the outage is transient (retry) or persistent (failover)");
  sections.push("3. **Failover Execution**");
  sections.push("   - [ ] Promote read replica to primary (if using replication)");
  sections.push("   - [ ] Update connection strings / DNS records");
  sections.push("   - [ ] Verify application connectivity to new primary");
  sections.push("   - [ ] Validate data integrity after failover");
  sections.push("4. **Communication** — Notify engineering team and update status page");
  sections.push("5. **Recovery** — Rebuild failed node and re-establish replication");
  sections.push("");

  sections.push("### 3.2 Application Failover");
  sections.push("");
  sections.push("1. **Detection** — Health check failures trigger failover");
  sections.push("2. **Traffic Routing** — Load balancer / DNS routes traffic to healthy instances");
  sections.push("3. **Scaling** — Auto-scale additional instances if capacity is reduced");
  sections.push("4. **Verification** — Confirm application functionality in failover state");
  sections.push("");

  if (authServices.length > 0) {
    sections.push("### 3.3 Authentication Service Failover");
    sections.push("");
    sections.push(`Detected auth service(s): ${authServices.map((s) => s.name).join(", ")}`);
    sections.push("");
    sections.push("- [ ] If third-party auth is unavailable, evaluate enabling cached session validation");
    sections.push("- [ ] Extend existing session tokens to prevent mass logouts");
    sections.push("- [ ] Display maintenance notice on login page");
    sections.push("- [ ] Monitor auth provider status page for restoration timeline");
    sections.push("- [ ] Once restored, force session refresh for security");
    sections.push("");
  }

  if (paymentServices.length > 0) {
    sections.push("### 3.4 Payment Service Failover");
    sections.push("");
    sections.push(`Detected payment service(s): ${paymentServices.map((s) => s.name).join(", ")}`);
    sections.push("");
    sections.push("- [ ] Queue pending transactions for retry when service is restored");
    sections.push("- [ ] Display user-facing message about temporary payment unavailability");
    sections.push("- [ ] Do NOT attempt to reprocess payments without idempotency keys");
    sections.push("- [ ] Notify finance team of any transactions in uncertain state");
    sections.push("- [ ] After restoration, reconcile all queued transactions");
    sections.push("");
  }

  if (aiServices.length > 0) {
    sections.push("### 3.5 AI Service Failover");
    sections.push("");
    sections.push(`Detected AI service(s): ${aiServices.map((s) => s.name).join(", ")}`);
    sections.push("");
    sections.push("- [ ] Activate graceful degradation (disable AI features, show fallback content)");
    sections.push("- [ ] Queue AI requests for processing when service is restored (if applicable)");
    sections.push("- [ ] Display user-facing notice that AI features are temporarily unavailable");
    sections.push("- [ ] Monitor AI provider status page for restoration timeline");
    sections.push("");
  }

  // ── 4. Backup Strategy ──────────────────────────────────────────────
  sections.push("## 4. Backup Strategy");
  sections.push("");
  sections.push("### 4.1 Backup Schedule");
  sections.push("");
  sections.push("| Data Type | Frequency | Retention | Storage Location | Encryption |");
  sections.push("|-----------|-----------|-----------|-----------------|------------|");
  sections.push("| Production database | Continuous (streaming) + daily snapshot | 30 days | [Backup region] | AES-256 at rest |");
  sections.push("| User-uploaded files | Daily incremental, weekly full | 90 days | [Backup region] | AES-256 at rest |");
  sections.push("| Application configuration | On every change (version control) | Indefinite | Git repository | In transit (TLS) |");
  sections.push("| Secrets and credentials | On rotation | Current + 1 previous | Secret manager | Envelope encryption |");
  sections.push("| Audit logs | Daily export | 1 year minimum | [Compliance storage] | AES-256 at rest |");
  sections.push("");
  sections.push("### 4.2 Backup Verification");
  sections.push("");
  sections.push("- [ ] Automated backup verification runs daily (check backup completeness and integrity)");
  sections.push("- [ ] Monthly restore drill — restore from backup to a staging environment");
  sections.push("- [ ] Quarterly full disaster recovery test (see Section 8)");
  sections.push("- [ ] Document all backup test results and any issues found");
  sections.push("");

  // ── 5. Communication Plan ───────────────────────────────────────────
  sections.push("## 5. Communication Plan");
  sections.push("");
  sections.push("### 5.1 Internal Communication");
  sections.push("");
  sections.push("| Severity | Notify | Channel | Timeline |");
  sections.push("|----------|--------|---------|----------|");
  sections.push("| Critical (P1) | All engineering + leadership | Slack/Teams war room + phone | Immediately |");
  sections.push("| High (P2) | Engineering lead + on-call | Slack/Teams channel | Within 30 minutes |");
  sections.push("| Medium (P3) | Engineering team | Slack/Teams channel | Within 2 hours |");
  sections.push("| Low (P4) | Relevant team | Ticket / async update | Within 24 hours |");
  sections.push("");
  sections.push("### 5.2 External Communication");
  sections.push("");
  sections.push("| Audience | Channel | Responsibility | Template |");
  sections.push("|----------|---------|---------------|----------|");
  sections.push("| Users / Customers | Status page + in-app banner | Communications Lead | See 5.4 |");
  sections.push("| Enterprise clients | Direct email / Slack | Account Management | See 5.4 |");
  sections.push("| Regulators (if data breach) | Formal notification | DPO / Legal | See Incident Response Plan |");
  sections.push("| Partners / Vendors | Email | Business Operations | As needed |");
  sections.push("");
  sections.push("### 5.3 Escalation Path");
  sections.push("");
  sections.push("```");
  sections.push("On-call Engineer");
  sections.push("    └─> Engineering Lead");
  sections.push("          └─> VP of Engineering");
  sections.push("                └─> CTO / CEO");
  sections.push("                      └─> Board (if material impact)");
  sections.push("```");
  sections.push("");
  sections.push("### 5.4 Status Update Templates");
  sections.push("");
  sections.push("**Initial notification:**");
  sections.push("```");
  sections.push(`[${company}] Service Disruption — [Service Name]`);
  sections.push("");
  sections.push("We are currently experiencing issues with [affected service/feature].");
  sections.push("Our engineering team is investigating and working to restore service.");
  sections.push("");
  sections.push("Impact: [Description of user impact]");
  sections.push("Started: [Time in UTC]");
  sections.push("Next update: [Time — within 1 hour for P1/P2]");
  sections.push("```");
  sections.push("");
  sections.push("**Resolution notification:**");
  sections.push("```");
  sections.push(`[${company}] Resolved — [Service Name]`);
  sections.push("");
  sections.push("The issue affecting [service/feature] has been resolved.");
  sections.push("");
  sections.push("Duration: [Total downtime]");
  sections.push("Root cause: [Brief description]");
  sections.push("Next steps: [Any follow-up actions users need to take]");
  sections.push("```");
  sections.push("");

  // ── 6. Roles and Responsibilities ───────────────────────────────────
  sections.push("## 6. Roles and Responsibilities");
  sections.push("");
  sections.push("| Role | Primary Responsibility | Backup |");
  sections.push("|------|----------------------|--------|");
  sections.push("| Incident Commander | Overall coordination of BCP activation | [Backup name] |");
  sections.push("| Technical Lead | Directs technical recovery efforts | [Backup name] |");
  sections.push("| Communications Lead | Manages internal and external communications | [Backup name] |");
  sections.push("| Operations Lead | Infrastructure and deployment management | [Backup name] |");
  sections.push("| Data Protection Officer | Assesses data impact and regulatory obligations | [Backup name] |");
  sections.push("");

  // ── 7. Dependency Map ───────────────────────────────────────────────
  sections.push("## 7. Third-Party Dependency Map");
  sections.push("");
  sections.push("The following third-party services are critical to application operation:");
  sections.push("");
  sections.push("| Service | Category | Impact if Unavailable | Alternative / Workaround |");
  sections.push("|---------|----------|----------------------|--------------------------|");

  for (const service of scan.services.filter((s) => s.isDataProcessor !== false)) {
    const impact = getImpactDescription(service);
    const workaround = getWorkaround(service);
    sections.push(`| ${service.name} | ${service.category} | ${impact} | ${workaround} |`);
  }

  sections.push("");

  // ── 8. Testing and Drills ───────────────────────────────────────────
  sections.push("## 8. Testing and Drills");
  sections.push("");
  sections.push("| Exercise | Frequency | Scope | Participants |");
  sections.push("|----------|-----------|-------|-------------|");
  sections.push("| Tabletop exercise | Quarterly | Walk through BCP scenarios verbally | All BCP role holders |");
  sections.push("| Backup restore drill | Monthly | Restore from backup to staging | Engineering team |");
  sections.push("| Failover test | Quarterly | Trigger controlled failover | Engineering + Operations |");
  sections.push("| Full DR simulation | Annually | Simulate complete outage, activate BCP | All teams |");
  sections.push("| Communication drill | Semi-annually | Test notification chains and templates | All BCP role holders |");
  sections.push("");
  sections.push("After each drill, document:");
  sections.push("");
  sections.push("- [ ] What worked well");
  sections.push("- [ ] What needs improvement");
  sections.push("- [ ] Action items with owners and deadlines");
  sections.push("- [ ] Updates to this BCP based on lessons learned");
  sections.push("");

  // ── 9. Plan Maintenance ─────────────────────────────────────────────
  sections.push("## 9. Plan Maintenance");
  sections.push("");
  sections.push("This Business Continuity Plan must be reviewed and updated:");
  sections.push("");
  sections.push("- After any significant infrastructure change");
  sections.push("- After any actual incident or outage");
  sections.push("- After each DR drill or tabletop exercise");
  sections.push("- At minimum quarterly");
  sections.push("- When adding or removing critical third-party services");
  sections.push("");
  sections.push(`For questions about this plan, contact **${securityEmail}**.`);
  sections.push("");

  // ── Disclaimer ──────────────────────────────────────────────────────
  sections.push("---");
  sections.push("");
  sections.push(
    `*This Business Continuity Plan was generated by [Codepliant](https://github.com/joechensmartz/codepliant) ` +
      `based on an automated scan of the **${scan.projectName}** codebase. ` +
      `Recovery objectives and procedures should be reviewed and customized by your engineering and operations teams based on actual infrastructure and business requirements.*`
  );

  return sections.join("\n");
}

function getRecoveryStrategy(service: DetectedService): string {
  const strategies: Record<string, string> = {
    auth: "Session cache failover; extend existing tokens",
    payment: "Transaction queue with retry; idempotency keys",
    database: "Automated replica promotion; point-in-time recovery",
    storage: "Cross-region replication; CDN fallback",
    email: "Queue with retry; alternative SMTP provider",
    ai: "Graceful degradation; disable AI features",
    monitoring: "Secondary monitoring; manual checks",
    analytics: "Data buffering; delayed processing",
    advertising: "Graceful degradation; static fallback",
    other: "Manual workaround; vendor support escalation",
    social: "Graceful degradation",
  };
  return strategies[service.category] || "Vendor support escalation";
}

function getImpactDescription(service: DetectedService): string {
  const impacts: Record<string, string> = {
    auth: "Users cannot sign in or register",
    payment: "Payment processing halted",
    database: "Data reads/writes unavailable",
    storage: "File uploads/downloads unavailable",
    email: "Transactional emails delayed or undelivered",
    ai: "AI-powered features unavailable",
    monitoring: "Blind to errors and performance issues",
    analytics: "Usage data not collected (no user impact)",
    advertising: "Ad tracking paused (no user impact)",
    other: "Feature degradation",
    social: "Social features unavailable",
  };
  return impacts[service.category] || "Feature degradation";
}

function getWorkaround(service: DetectedService): string {
  const workarounds: Record<string, string> = {
    auth: "Cached sessions; manual verification",
    payment: "Queue transactions for later processing",
    database: "Read replica; cached responses",
    storage: "CDN cache; deferred uploads",
    email: "Alternative email provider; manual send",
    ai: "Disable AI features; show static content",
    monitoring: "Manual log review; secondary tools",
    analytics: "Buffer events client-side",
    advertising: "Pause campaigns; no data loss",
    other: "Evaluate per service",
    social: "Disable social features",
  };
  return workarounds[service.category] || "Manual workaround";
}
