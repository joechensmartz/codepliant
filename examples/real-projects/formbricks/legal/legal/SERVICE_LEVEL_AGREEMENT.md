# Service Level Agreement (SLA)

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Effective Date:** 2026-03-16
**Last Updated:** 2026-03-16

**Project:** formbricks

## Related Documents

- Terms of Service (`TERMS_OF_SERVICE.md`)
- Business Continuity Plan (`BUSINESS_CONTINUITY_PLAN.md`)

---

## 1. Overview

This Service Level Agreement ("SLA") describes the service level commitments that [Your Company Name] makes to customers for the Services described herein. This SLA is incorporated into and forms part of the agreement between [Your Company Name] and the customer ("Customer").

Monitoring and observability is provided through: @sentry/nextjs.

## 2. Definitions

- **"Downtime"** means any period during which the Services are unavailable to the Customer, as measured by our monitoring systems.
- **"Scheduled Maintenance"** means planned maintenance windows that are communicated to customers at least 48 hours in advance.
- **"Monthly Uptime Percentage"** means the total minutes in a calendar month minus the minutes of Downtime, divided by the total minutes in the month, expressed as a percentage.
- **"Service Credit"** means a credit issued to the Customer's account as a remedy for failure to meet SLA commitments.
- **"Incident"** means any unplanned interruption or degradation of the Services.

## 3. Service Level Objectives

### 3.1 Availability

[Your Company Name] commits to the following uptime targets:

| Service Tier | Monthly Uptime Target | Maximum Monthly Downtime |
|-------------|----------------------|-------------------------|
| Standard | 99.5% | ~3 hours 39 minutes |
| Professional | 99.9% | ~43 minutes |
| Enterprise | 99.95% | ~22 minutes |

Scheduled Maintenance windows are excluded from uptime calculations. Maintenance windows are typically scheduled during low-traffic periods (weekends, 02:00-06:00 UTC).

### 3.2 Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time (p50) | < 200ms | Measured at edge |
| API Response Time (p95) | < 500ms | Measured at edge |
| API Response Time (p99) | < 1000ms | Measured at edge |
| Page Load Time | < 3 seconds | Measured from client |
| Error Rate | < 0.1% | 5xx responses / total requests |
| Database Query Time (p95) | < 100ms | Measured at application layer |
| Data Durability | 99.999999999% | Eleven nines |

## 4. Incident Classification and Response Times

### 4.1 Severity Levels

| Severity | Definition | Examples |
|----------|-----------|----------|
| **P1 — Critical** | Complete service outage affecting all users | Service is down, data loss |
| **P2 — High** | Major feature unavailable or severe degradation | Authentication failing, Payment processing errors, Core functionality broken |
| **P3 — Medium** | Minor feature unavailable or moderate degradation | Non-critical feature broken, slow performance |
| **P4 — Low** | Cosmetic issues or minor inconveniences | UI glitches, documentation errors |

### 4.2 Response Times

| Severity | Initial Response | Status Updates | Resolution Target |
|----------|-----------------|----------------|-------------------|
| P1 — Critical | 15 minutes | Every 30 minutes | 4 hours |
| P2 — High | 1 hour | Every 2 hours | 8 hours |
| P3 — Medium | 4 hours | Every 8 hours | 3 business days |
| P4 — Low | 1 business day | As needed | 10 business days |

Response times are measured from the time the incident is reported to our support team or detected by our monitoring systems, whichever is earlier.

## 5. Communication

### 5.1 Status Page

[Your Company Name] maintains a public status page that provides real-time and historical information about service availability. Customers will be notified of incidents through:

- Status page updates
- Email notifications (for subscribed users)
- In-app notifications (when available)

### 5.2 Incident Communication

During an active incident, we will provide:

1. **Initial notification** acknowledging the issue and its severity
2. **Regular updates** at the frequency specified by the severity level
3. **Resolution notification** confirming the issue is resolved
4. **Post-incident report** (for P1 and P2 incidents) within 5 business days

### 5.3 Scheduled Maintenance

- Maintenance windows are announced at least 48 hours in advance
- Emergency maintenance may be performed with shorter notice when necessary for security or data integrity
- Maintenance notifications are sent via email and posted on the status page

## 6. Service Credits

### 6.1 Credit Schedule

If we fail to meet the Monthly Uptime Percentage, Customers are eligible for the following Service Credits:

| Monthly Uptime Percentage | Service Credit (% of monthly fee) |
|--------------------------|----------------------------------|
| 99.0% - 99.49% | 10% |
| 95.0% - 98.99% | 25% |
| 90.0% - 94.99% | 50% |
| Below 90.0% | 100% |

### 6.2 Credit Request Process

To receive a Service Credit:

1. Submit a request to [your-email@example.com] within 30 days of the incident
2. Include the dates and times of the Downtime
3. Provide any relevant evidence (screenshots, error logs, etc.)

### 6.3 Credit Limitations

- Service Credits are the sole and exclusive remedy for failure to meet SLA commitments
- Credits are applied to future invoices and are not redeemable for cash
- Maximum credit in any billing period shall not exceed 100% of the fees for that period
- Credits do not carry over between billing periods

## 7. Exclusions

This SLA does not apply to:

- **Scheduled Maintenance** performed during announced maintenance windows
- **Force Majeure** events including natural disasters, war, government actions, or widespread internet failures
- **Customer-caused issues** including misconfiguration, unauthorized modifications, or exceeding usage limits
- **Third-party failures** beyond [Your Company Name]'s reasonable control, including upstream provider outages
- **Beta or preview features** that are explicitly marked as not covered by this SLA
- **Free tier** accounts (SLA applies to paid plans only)
- **Abuse or violations** of the Terms of Service or Acceptable Use Policy

## 8. Support

### 8.1 Support Channels

| Channel | Availability | Response Target |
|---------|-------------|-----------------|
| Email ([your-email@example.com]) | 24/7 | Per severity level |
| In-app Chat | Business hours | 2 hours |
| Phone (Enterprise) | 24/7 | 15 minutes (P1 only) |
| Community Forum | Best effort | Not guaranteed |

### 8.2 Support Hours

- **Business hours:** Monday through Friday, 09:00 - 18:00 UTC (excluding public holidays)
- **24/7 support:** Available for P1 incidents on Professional and Enterprise plans

## 9. Reporting and Transparency

[Your Company Name] provides:

- **Monthly uptime reports** available on the status page
- **Quarterly SLA review** summarizing performance against commitments
- **Annual reliability report** detailing major incidents, root causes, and improvements

## 10. SLA Modifications

[Your Company Name] may modify this SLA with at least 30 days' advance notice. Changes will not reduce service level commitments for the duration of an active contract period. Material changes will be communicated via email.

## 11. Contact

For SLA-related questions or to report a service issue:

- **Email:** [your-email@example.com]

---

*This Service Level Agreement was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on code analysis of formbricks. It should be reviewed by legal counsel before use.*