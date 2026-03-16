import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates a SERVICE_LEVEL_AGREEMENT.md when monitoring services are detected.
 * Covers uptime commitments, response times, incident classification, and remedies.
 */
export function generateSLA(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  const hasMonitoring = scan.services.some((s) => s.category === "monitoring");

  if (!hasMonitoring) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const securityEmail = ctx?.securityEmail || ctx?.contactEmail || "[support@example.com]";
  const date = new Date().toISOString().split("T")[0];

  const monitoringServices = scan.services.filter((s) => s.category === "monitoring");
  const monitoringNames = monitoringServices.map((s) => s.name).join(", ");

  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasAuth = scan.services.some((s) => s.category === "auth");
  const hasDatabase = scan.services.some((s) => s.category === "database");

  let sectionNum = 0;
  function nextSection(): number {
    return ++sectionNum;
  }

  let doc = `# Service Level Agreement (SLA)

**Effective Date:** ${date}
**Last Updated:** ${date}

**Project:** ${scan.projectName}

---

## ${nextSection()}. Overview

This Service Level Agreement ("SLA") describes the service level commitments that ${company} makes to customers for the Services described herein. This SLA is incorporated into and forms part of the agreement between ${company} and the customer ("Customer").

Monitoring and observability is provided through: ${monitoringNames}.

## ${nextSection()}. Definitions

- **"Downtime"** means any period during which the Services are unavailable to the Customer, as measured by our monitoring systems.
- **"Scheduled Maintenance"** means planned maintenance windows that are communicated to customers at least 48 hours in advance.
- **"Monthly Uptime Percentage"** means the total minutes in a calendar month minus the minutes of Downtime, divided by the total minutes in the month, expressed as a percentage.
- **"Service Credit"** means a credit issued to the Customer's account as a remedy for failure to meet SLA commitments.
- **"Incident"** means any unplanned interruption or degradation of the Services.

## ${nextSection()}. Service Level Objectives

### ${sectionNum}.1 Availability

${company} commits to the following uptime targets:

| Service Tier | Monthly Uptime Target | Maximum Monthly Downtime |
|-------------|----------------------|-------------------------|
| Standard | 99.5% | ~3 hours 39 minutes |
| Professional | 99.9% | ~43 minutes |
| Enterprise | 99.95% | ~22 minutes |

Scheduled Maintenance windows are excluded from uptime calculations. Maintenance windows are typically scheduled during low-traffic periods (weekends, 02:00-06:00 UTC).

### ${sectionNum}.2 Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time (p50) | < 200ms | Measured at edge |
| API Response Time (p95) | < 500ms | Measured at edge |
| API Response Time (p99) | < 1000ms | Measured at edge |
| Page Load Time | < 3 seconds | Measured from client |
| Error Rate | < 0.1% | 5xx responses / total requests |`;

  if (hasDatabase) {
    doc += `
| Database Query Time (p95) | < 100ms | Measured at application layer |
| Data Durability | 99.999999999% | Eleven nines |`;
  }

  doc += `

## ${nextSection()}. Incident Classification and Response Times

### ${sectionNum}.1 Severity Levels

| Severity | Definition | Examples |
|----------|-----------|----------|
| **P1 — Critical** | Complete service outage affecting all users | Service is down, data loss |
| **P2 — High** | Major feature unavailable or severe degradation | ${hasAuth ? "Authentication failing, " : ""}${hasPayment ? "Payment processing errors, " : ""}Core functionality broken |
| **P3 — Medium** | Minor feature unavailable or moderate degradation | Non-critical feature broken, slow performance |
| **P4 — Low** | Cosmetic issues or minor inconveniences | UI glitches, documentation errors |

### ${sectionNum}.2 Response Times

| Severity | Initial Response | Status Updates | Resolution Target |
|----------|-----------------|----------------|-------------------|
| P1 — Critical | 15 minutes | Every 30 minutes | 4 hours |
| P2 — High | 1 hour | Every 2 hours | 8 hours |
| P3 — Medium | 4 hours | Every 8 hours | 3 business days |
| P4 — Low | 1 business day | As needed | 10 business days |

Response times are measured from the time the incident is reported to our support team or detected by our monitoring systems, whichever is earlier.

## ${nextSection()}. Communication

### ${sectionNum}.1 Status Page

${company} maintains a public status page that provides real-time and historical information about service availability. Customers will be notified of incidents through:

- Status page updates
- Email notifications (for subscribed users)
- In-app notifications (when available)

### ${sectionNum}.2 Incident Communication

During an active incident, we will provide:

1. **Initial notification** acknowledging the issue and its severity
2. **Regular updates** at the frequency specified by the severity level
3. **Resolution notification** confirming the issue is resolved
4. **Post-incident report** (for P1 and P2 incidents) within 5 business days

### ${sectionNum}.3 Scheduled Maintenance

- Maintenance windows are announced at least 48 hours in advance
- Emergency maintenance may be performed with shorter notice when necessary for security or data integrity
- Maintenance notifications are sent via email and posted on the status page

## ${nextSection()}. Service Credits

### ${sectionNum}.1 Credit Schedule

If we fail to meet the Monthly Uptime Percentage, Customers are eligible for the following Service Credits:

| Monthly Uptime Percentage | Service Credit (% of monthly fee) |
|--------------------------|----------------------------------|
| 99.0% - 99.49% | 10% |
| 95.0% - 98.99% | 25% |
| 90.0% - 94.99% | 50% |
| Below 90.0% | 100% |

### ${sectionNum}.2 Credit Request Process

To receive a Service Credit:

1. Submit a request to ${email} within 30 days of the incident
2. Include the dates and times of the Downtime
3. Provide any relevant evidence (screenshots, error logs, etc.)

### ${sectionNum}.3 Credit Limitations

- Service Credits are the sole and exclusive remedy for failure to meet SLA commitments
- Credits are applied to future invoices and are not redeemable for cash
- Maximum credit in any billing period shall not exceed 100% of the fees for that period
- Credits do not carry over between billing periods

## ${nextSection()}. Exclusions

This SLA does not apply to:

- **Scheduled Maintenance** performed during announced maintenance windows
- **Force Majeure** events including natural disasters, war, government actions, or widespread internet failures
- **Customer-caused issues** including misconfiguration, unauthorized modifications, or exceeding usage limits
- **Third-party failures** beyond ${company}'s reasonable control, including upstream provider outages
- **Beta or preview features** that are explicitly marked as not covered by this SLA
- **Free tier** accounts (SLA applies to paid plans only)
- **Abuse or violations** of the Terms of Service or Acceptable Use Policy

## ${nextSection()}. Support

### ${sectionNum}.1 Support Channels

| Channel | Availability | Response Target |
|---------|-------------|-----------------|
| Email (${securityEmail}) | 24/7 | Per severity level |
| In-app Chat | Business hours | 2 hours |
| Phone (Enterprise) | 24/7 | 15 minutes (P1 only) |
| Community Forum | Best effort | Not guaranteed |

### ${sectionNum}.2 Support Hours

- **Business hours:** Monday through Friday, 09:00 - 18:00 UTC (excluding public holidays)
- **24/7 support:** Available for P1 incidents on Professional and Enterprise plans

## ${nextSection()}. Reporting and Transparency

${company} provides:

- **Monthly uptime reports** available on the status page
- **Quarterly SLA review** summarizing performance against commitments
- **Annual reliability report** detailing major incidents, root causes, and improvements

## ${nextSection()}. SLA Modifications

${company} may modify this SLA with at least 30 days' advance notice. Changes will not reduce service level commitments for the duration of an active contract period. Material changes will be communicated via email.

## ${nextSection()}. Contact

For SLA-related questions or to report a service issue:

- **Email:** ${email}

---

*This Service Level Agreement was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on code analysis of ${scan.projectName}. It should be reviewed by legal counsel before use.*`;

  return doc;
}
