import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generate an Incident Severity Matrix — INCIDENT_SEVERITY_MATRIX.md
 * Define incident severity levels (P0-P4), response times, escalation paths,
 * communication requirements, and per-service impact assessment.
 */
export function generateIncidentSeverityMatrix(
  scan: ScanResult,
  ctx?: GeneratorContext
): string {
  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const securityEmail = ctx?.securityEmail || contactEmail;
  const dpoEmail = ctx?.dpoEmail || "[dpo@example.com]";

  const serviceCount = scan.services.length;
  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasAuth = scan.services.some((s) => s.category === "auth");
  const hasAnalytics = scan.services.some((s) => s.category === "analytics");
  const hasDatabase = scan.services.some((s) => s.category === "database");
  const hasStorage = scan.services.some((s) => s.category === "storage");
  const hasMonitoring = scan.services.some((s) => s.category === "monitoring");

  const sections: string[] = [];

  // --- Header ---
  sections.push("# Incident Severity Matrix");
  sections.push("");
  sections.push(
    `> **Severity classification and response framework for ${company}.**`
  );
  sections.push(`> ${serviceCount} services | Generated on ${date}`);
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## Purpose");
  sections.push("");
  sections.push(
    "This matrix defines severity levels for security incidents and service disruptions. " +
      "It establishes response times, escalation paths, and communication requirements to ensure " +
      "consistent and rapid incident handling."
  );

  // --- 1. Severity Levels ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 1. Severity Level Definitions");
  sections.push("");
  sections.push(
    "| Level | Name | Definition | Examples |"
  );
  sections.push(
    "|-------|------|-----------|----------|"
  );
  sections.push(
    "| **P0** | **Catastrophic** | Complete system compromise, active data exfiltration, or regulatory breach affecting all users | " +
      "Production database breach, ransomware encrypting all systems, leaked master encryption keys, complete auth bypass |"
  );
  sections.push(
    "| **P1** | **Critical** | Major security incident with confirmed data exposure or significant service degradation | " +
      "Unauthorized access to PII, API key compromise with data access, partial service outage affecting >50% users |"
  );
  sections.push(
    "| **P2** | **High** | Security incident with potential data exposure or moderate service impact | " +
      "Vulnerability actively exploited, unauthorized access detected but contained, service degradation affecting <50% users |"
  );
  sections.push(
    "| **P3** | **Medium** | Security event requiring investigation with limited immediate impact | " +
      "Suspicious access patterns, failed intrusion attempts, configuration drift detected, minor data quality issues |"
  );
  sections.push(
    "| **P4** | **Low** | Minor security event or policy violation with no data impact | " +
      "Phishing attempt blocked, minor policy violation, non-sensitive log exposure, informational security alert |"
  );

  // --- 2. Response Requirements ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 2. Response Time Requirements");
  sections.push("");
  sections.push(
    "| Level | Acknowledge | Triage | Initial Response | Resolution Target | Post-Mortem |"
  );
  sections.push(
    "|-------|------------|--------|-----------------|-------------------|-------------|"
  );
  sections.push(
    "| **P0** | 5 minutes | 15 minutes | 30 minutes | 4 hours | Within 24 hours |"
  );
  sections.push(
    "| **P1** | 15 minutes | 30 minutes | 1 hour | 8 hours | Within 48 hours |"
  );
  sections.push(
    "| **P2** | 30 minutes | 1 hour | 4 hours | 24 hours | Within 5 business days |"
  );
  sections.push(
    "| **P3** | 2 hours | 4 hours | 24 hours | 72 hours | Within 10 business days |"
  );
  sections.push(
    "| **P4** | 24 hours | 48 hours | 72 hours | 1 week | Monthly review |"
  );

  // --- 3. Escalation Paths ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 3. Escalation Paths");
  sections.push("");
  sections.push("### P0 — Catastrophic");
  sections.push("");
  sections.push("```");
  sections.push("Discoverer");
  sections.push("  └─> Security On-Call (immediate)");
  sections.push("       └─> CTO / CISO (within 5 min)");
  sections.push("            └─> CEO + Legal Counsel (within 15 min)");
  sections.push("                 └─> Board notification (within 1 hour)");
  sections.push("                      └─> Regulatory authority (within 72 hours per GDPR)");
  sections.push("```");
  sections.push("");
  sections.push("### P1 — Critical");
  sections.push("");
  sections.push("```");
  sections.push("Discoverer");
  sections.push("  └─> Security On-Call (within 15 min)");
  sections.push("       └─> Engineering Lead + Security Lead (within 30 min)");
  sections.push("            └─> CTO / CISO (within 1 hour)");
  sections.push("                 └─> DPO for data breach assessment");
  sections.push("```");
  sections.push("");
  sections.push("### P2 — High");
  sections.push("");
  sections.push("```");
  sections.push("Discoverer");
  sections.push("  └─> Security On-Call (within 30 min)");
  sections.push("       └─> Engineering Lead (within 1 hour)");
  sections.push("            └─> CTO (if escalation needed)");
  sections.push("```");
  sections.push("");
  sections.push("### P3/P4 — Medium/Low");
  sections.push("");
  sections.push("```");
  sections.push("Discoverer");
  sections.push("  └─> Security channel / ticket");
  sections.push("       └─> Security team triage (next business day for P4)");
  sections.push("```");

  // --- 4. Communication Requirements ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 4. Communication Requirements");
  sections.push("");
  sections.push(
    "| Level | Internal Comms | Customer Comms | Regulatory Notification | Public Disclosure |"
  );
  sections.push(
    "|-------|---------------|----------------|------------------------|-------------------|"
  );
  sections.push(
    `| **P0** | All-hands war room, executive updates every 30 min | Status page + direct email within 1 hour | Within 72 hours (GDPR Art. 33) to [${dpoEmail}](mailto:${dpoEmail}) | If data breach confirmed, within 72 hours |`
  );
  sections.push(
    "| **P1** | Security + engineering channel, executive update hourly | Status page update, affected users notified within 24 hours | Assess within 36 hours, notify if required | Only if legally required |"
  );
  sections.push(
    "| **P2** | Security channel, engineering lead notified | Status page if user-facing impact | Assess within 72 hours | No |"
  );
  sections.push(
    "| **P3** | Security ticket, weekly summary | No | No (unless investigation escalates) | No |"
  );
  sections.push(
    "| **P4** | Security ticket | No | No | No |"
  );

  // --- 5. Communication Channels ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 5. Communication Channels");
  sections.push("");
  sections.push(
    "| Channel | Used For | Access |"
  );
  sections.push(
    "|---------|----------|--------|"
  );
  sections.push(
    `| Security email ([${securityEmail}](mailto:${securityEmail})) | External reports, regulatory correspondence | Security team |`
  );
  sections.push(
    "| #security-incidents (Slack/Teams) | Real-time incident coordination | Security + engineering |"
  );
  sections.push(
    "| War room (video call) | P0/P1 live coordination | All responders |"
  );
  sections.push(
    "| Incident management tool | Ticket tracking, timeline documentation | All staff |"
  );
  sections.push(
    "| Status page | Customer-facing incident updates | Public |"
  );

  // --- 6. Per-Service Impact Assessment ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 6. Per-Service Impact Assessment");
  sections.push("");
  sections.push(
    "Severity classification when each detected service is compromised or experiences an outage."
  );
  sections.push("");
  sections.push(
    "| Service | Category | If Compromised | If Outage | Data at Risk | Regulatory Impact |"
  );
  sections.push(
    "|---------|----------|---------------|-----------|-------------|-------------------|"
  );

  for (const svc of scan.services) {
    const compromisedSeverity = getCompromisedSeverity(svc.category);
    const outageSeverity = getOutageSeverity(svc.category);
    const dataAtRisk = svc.dataCollected.slice(0, 3).join(", ") || "Unknown";
    const regulatoryImpact = getServiceRegulatoryImpact(svc.category);

    sections.push(
      `| ${svc.name} | ${svc.category} | **${compromisedSeverity}** | **${outageSeverity}** | ${dataAtRisk} | ${regulatoryImpact} |`
    );
  }

  if (scan.services.length === 0) {
    sections.push(
      "| *No services detected* | — | — | — | — | — |"
    );
  }

  // --- 7. Category-Specific Incident Scenarios ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 7. Category-Specific Incident Scenarios");

  if (hasAI) {
    sections.push("");
    sections.push("### AI Services");
    sections.push("");
    sections.push(
      "| Scenario | Severity | Response Action |"
    );
    sections.push(
      "|----------|----------|----------------|"
    );
    sections.push(
      "| User PII leaked through AI prompts | **P0** | Disable AI feature, assess data exposure, notify affected users |"
    );
    sections.push(
      "| Prompt injection bypasses safety controls | **P1** | Throttle AI endpoint, deploy input validation fix, audit recent outputs |"
    );
    sections.push(
      "| AI model produces biased/discriminatory output | **P2** | Document instances, add guardrails, notify AI ethics team |"
    );
    sections.push(
      "| AI service provider data breach | **P1** | Assess data shared with provider, rotate API keys, review DPA obligations |"
    );
    sections.push(
      "| AI hallucination causes user harm | **P2** | Add output disclaimers, review and strengthen validation layer |"
    );
  }

  if (hasPayment) {
    sections.push("");
    sections.push("### Payment Services");
    sections.push("");
    sections.push(
      "| Scenario | Severity | Response Action |"
    );
    sections.push(
      "|----------|----------|----------------|"
    );
    sections.push(
      "| Cardholder data exposed | **P0** | Isolate systems, notify payment processor within 24h, engage PCI forensic investigator |"
    );
    sections.push(
      "| Payment processing outage | **P1** | Activate backup processor, communicate to affected customers |"
    );
    sections.push(
      "| Fraudulent transactions detected | **P2** | Flag accounts, review transaction logs, strengthen fraud detection |"
    );
    sections.push(
      "| PCI DSS compliance gap discovered | **P3** | Document gap, create remediation plan, assess risk |"
    );
  }

  if (hasAuth) {
    sections.push("");
    sections.push("### Authentication Services");
    sections.push("");
    sections.push(
      "| Scenario | Severity | Response Action |"
    );
    sections.push(
      "|----------|----------|----------------|"
    );
    sections.push(
      "| Complete auth bypass discovered | **P0** | Disable affected auth flow, force re-authentication, rotate all sessions |"
    );
    sections.push(
      "| Credential stuffing attack in progress | **P1** | Enable rate limiting, lock affected accounts, force password resets |"
    );
    sections.push(
      "| OAuth token leak | **P1** | Revoke leaked tokens, rotate secrets, audit access logs |"
    );
    sections.push(
      "| Auth provider outage | **P2** | Activate fallback auth, communicate login issues to users |"
    );
  }

  if (hasDatabase || hasStorage) {
    sections.push("");
    sections.push("### Database & Storage Services");
    sections.push("");
    sections.push(
      "| Scenario | Severity | Response Action |"
    );
    sections.push(
      "|----------|----------|----------------|"
    );
    sections.push(
      "| Database exposed to internet | **P0** | Restrict network access immediately, audit data access logs, rotate credentials |"
    );
    sections.push(
      "| Unauthorized database query detected | **P1** | Revoke access, investigate query scope, assess data exposure |"
    );
    sections.push(
      "| Storage bucket misconfiguration | **P1** | Lock down permissions, audit exposed files, notify if PII exposed |"
    );
    sections.push(
      "| Database corruption / data loss | **P2** | Activate backup restoration, assess data integrity |"
    );
  }

  if (hasAnalytics) {
    sections.push("");
    sections.push("### Analytics Services");
    sections.push("");
    sections.push(
      "| Scenario | Severity | Response Action |"
    );
    sections.push(
      "|----------|----------|----------------|"
    );
    sections.push(
      "| Analytics collecting PII without consent | **P2** | Disable data collection, audit consent records, update cookie consent config |"
    );
    sections.push(
      "| Analytics data shared with unauthorized third party | **P1** | Revoke access, assess GDPR Art. 33 notification requirement |"
    );
    sections.push(
      "| Analytics tracking across domains without disclosure | **P3** | Update privacy policy, reconfigure tracking parameters |"
    );
  }

  // --- 8. Severity Decision Tree ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 8. Severity Decision Tree");
  sections.push("");
  sections.push("Use this decision tree to classify incidents when severity is unclear:");
  sections.push("");
  sections.push("```");
  sections.push("Is there confirmed data exfiltration or complete system compromise?");
  sections.push("  ├─ YES → P0 (Catastrophic)");
  sections.push("  └─ NO");
  sections.push("       Is there confirmed unauthorized access to PII or critical systems?");
  sections.push("       ├─ YES → P1 (Critical)");
  sections.push("       └─ NO");
  sections.push("            Is there an active exploit or significant service degradation?");
  sections.push("            ├─ YES → P2 (High)");
  sections.push("            └─ NO");
  sections.push("                 Is investigation required to determine impact?");
  sections.push("                 ├─ YES → P3 (Medium)");
  sections.push("                 └─ NO → P4 (Low)");
  sections.push("```");

  // --- 9. Regulatory Response Timelines ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 9. Regulatory Response Timelines");
  sections.push("");
  sections.push(
    "Mandatory notification deadlines by regulation for data breach incidents (P0/P1)."
  );
  sections.push("");
  sections.push(
    "| Regulation | Authority Notification | Individual Notification | Key Requirement |"
  );
  sections.push(
    "|------------|----------------------|------------------------|-----------------|"
  );
  sections.push(
    "| GDPR (Art. 33/34) | **72 hours** | Without undue delay (high risk) | Must document all breaches regardless of notification |"
  );
  sections.push(
    "| UK GDPR | **72 hours** | Without undue delay (high risk) | Notify ICO via online portal |"
  );
  sections.push(
    "| CCPA/CPRA | Varies by state | Without unreasonable delay | AG notification for 500+ CA residents |"
  );

  if (hasPayment) {
    sections.push(
      "| PCI DSS | **24 hours** (to processor) | As required | Engage PCI Forensic Investigator (PFI) |"
    );
  }

  if (hasAI) {
    sections.push(
      "| EU AI Act | As required by severity | Depends on risk level | Additional obligations for high-risk AI systems |"
    );
  }

  sections.push(
    "| ePrivacy | Per member state law | Per member state law | Cookie/tracking specific requirements |"
  );

  // --- 10. Roles ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 10. Incident Response Roles");
  sections.push("");
  sections.push(
    "| Role | P0 Responsibility | P1-P2 Responsibility | P3-P4 Responsibility |"
  );
  sections.push(
    "|------|-------------------|---------------------|---------------------|"
  );
  sections.push(
    "| **Incident Commander** | Leads war room, all decisions | Coordinates response | Reviews report |"
  );
  sections.push(
    "| **Security Lead** | Active investigation, containment | Investigation lead | Triages tickets |"
  );
  sections.push(
    "| **Engineering Lead** | Emergency fixes, system isolation | Deploys fixes | Assigns fixes |"
  );
  sections.push(
    `| **DPO** ([${dpoEmail}](mailto:${dpoEmail})) | Regulatory notification decision | Breach assessment | Monthly review |`
  );
  sections.push(
    "| **Communications Lead** | Customer + public messaging | Status page updates | No action |"
  );
  sections.push(
    "| **Legal Counsel** | Regulatory response, evidence preservation | Legal assessment | No action |"
  );
  sections.push(
    "| **Executive Sponsor** | Final authority, board comms | Informed, escalation | Informed via report |"
  );

  // --- Disclaimer ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push(
    `*This incident severity matrix was generated by [Codepliant](https://github.com/joechensmartz/codepliant) ` +
      `based on an automated scan of the **${scan.projectName}** codebase (${serviceCount} services detected). ` +
      `Customize response times, escalation paths, and roles to match your organization's structure. ` +
      `This document should be reviewed by your security team and legal counsel before adoption.*`
  );
  sections.push("");

  return sections.join("\n");
}

function getCompromisedSeverity(
  category: string
): string {
  switch (category) {
    case "ai":
      return "P0";
    case "payment":
      return "P0";
    case "auth":
      return "P0";
    case "database":
      return "P0";
    case "storage":
      return "P1";
    case "analytics":
      return "P1";
    case "email":
      return "P1";
    case "monitoring":
      return "P2";
    case "hosting":
      return "P1";
    case "cdn":
      return "P2";
    default:
      return "P2";
  }
}

function getOutageSeverity(category: string): string {
  switch (category) {
    case "payment":
      return "P1";
    case "auth":
      return "P1";
    case "database":
      return "P1";
    case "ai":
      return "P2";
    case "storage":
      return "P2";
    case "hosting":
      return "P1";
    case "email":
      return "P2";
    case "analytics":
      return "P3";
    case "monitoring":
      return "P2";
    case "cdn":
      return "P2";
    default:
      return "P3";
  }
}

function getServiceRegulatoryImpact(category: string): string {
  switch (category) {
    case "ai":
      return "EU AI Act, GDPR Art. 22 (automated decisions)";
    case "payment":
      return "PCI DSS, GDPR Art. 33/34";
    case "auth":
      return "GDPR Art. 33/34, credential breach notification";
    case "database":
      return "GDPR Art. 33/34, data breach notification";
    case "storage":
      return "GDPR Art. 33/34 if PII stored";
    case "analytics":
      return "ePrivacy, GDPR Art. 6/7 (consent)";
    case "email":
      return "CAN-SPAM, GDPR Art. 33/34";
    case "monitoring":
      return "Minimal direct regulatory impact";
    default:
      return "Assess per data processed";
  }
}
