import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates COMPLIANCE_KPI_DASHBOARD.md — Key Performance Indicators
 * for measuring and tracking the effectiveness of a compliance program.
 *
 * Covers:
 * - DSAR response time
 * - Breach notification speed
 * - Training completion rate
 * - Vendor assessment completion
 * - Document freshness
 * - Monthly/quarterly tracking templates
 *
 * Aligned with ISO 27001 Annex A measurement, GDPR accountability
 * requirements, and SOC 2 monitoring criteria.
 */

interface KPI {
  id: string;
  name: string;
  description: string;
  metric: string;
  target: string;
  frequency: "Monthly" | "Quarterly" | "Annually";
  regulation: string;
  formula: string;
}

const CORE_KPIS: KPI[] = [
  {
    id: "KPI-01",
    name: "DSAR Response Time",
    description: "Average time to respond to Data Subject Access Requests from receipt to fulfilment",
    metric: "Days",
    target: "< 25 days (GDPR allows 30)",
    frequency: "Monthly",
    regulation: "GDPR Art. 12(3), CCPA §1798.130",
    formula: "Sum of response times / Number of DSARs completed",
  },
  {
    id: "KPI-02",
    name: "DSAR Completion Rate",
    description: "Percentage of DSARs completed within the statutory deadline",
    metric: "Percentage",
    target: "> 98%",
    frequency: "Monthly",
    regulation: "GDPR Art. 12(3)",
    formula: "(DSARs completed on time / Total DSARs received) × 100",
  },
  {
    id: "KPI-03",
    name: "Breach Notification Speed",
    description: "Time from breach detection to supervisory authority notification",
    metric: "Hours",
    target: "< 48 hours (GDPR requires 72)",
    frequency: "Quarterly",
    regulation: "GDPR Art. 33, NIS2 Art. 23",
    formula: "Time of notification - Time of detection",
  },
  {
    id: "KPI-04",
    name: "Security Training Completion",
    description: "Percentage of employees who completed mandatory security awareness training",
    metric: "Percentage",
    target: "> 95%",
    frequency: "Quarterly",
    regulation: "ISO 27001 A.6.3, SOC 2 CC1.4",
    formula: "(Employees completed training / Total employees) × 100",
  },
  {
    id: "KPI-05",
    name: "Privacy Training Completion",
    description: "Percentage of relevant staff who completed data protection training",
    metric: "Percentage",
    target: "> 95%",
    frequency: "Quarterly",
    regulation: "GDPR Art. 39(1)(b)",
    formula: "(Staff completed privacy training / Total relevant staff) × 100",
  },
  {
    id: "KPI-06",
    name: "Vendor Risk Assessment Completion",
    description: "Percentage of active vendors with completed risk assessments",
    metric: "Percentage",
    target: "> 90%",
    frequency: "Quarterly",
    regulation: "GDPR Art. 28, SOC 2 CC9.2",
    formula: "(Vendors assessed / Total active vendors) × 100",
  },
  {
    id: "KPI-07",
    name: "Policy Document Freshness",
    description: "Percentage of compliance documents reviewed within the past 12 months",
    metric: "Percentage",
    target: "> 90%",
    frequency: "Quarterly",
    regulation: "ISO 27001 7.5, SOC 2 CC1.3",
    formula: "(Documents reviewed in last 12 months / Total documents) × 100",
  },
  {
    id: "KPI-08",
    name: "Consent Collection Rate",
    description: "Percentage of data processing activities with valid consent records",
    metric: "Percentage",
    target: "> 99%",
    frequency: "Monthly",
    regulation: "GDPR Art. 7, ePrivacy Directive",
    formula: "(Processing activities with consent / Consent-required activities) × 100",
  },
  {
    id: "KPI-09",
    name: "Incident Response Time",
    description: "Average time from security incident detection to initial response",
    metric: "Minutes",
    target: "< 60 minutes",
    frequency: "Monthly",
    regulation: "ISO 27001 A.5.24, NIST CSF RS.RP-1",
    formula: "Sum of response times / Number of incidents",
  },
  {
    id: "KPI-10",
    name: "Vulnerability Remediation Time",
    description: "Average time to remediate identified security vulnerabilities",
    metric: "Days",
    target: "Critical: < 1 day, High: < 7 days, Medium: < 30 days",
    frequency: "Monthly",
    regulation: "SOC 2 CC7.1, ISO 27001 A.8.8",
    formula: "Sum of remediation times / Number of vulnerabilities",
  },
  {
    id: "KPI-11",
    name: "Data Retention Compliance",
    description: "Percentage of data stores compliant with defined retention schedules",
    metric: "Percentage",
    target: "> 95%",
    frequency: "Quarterly",
    regulation: "GDPR Art. 5(1)(e), CCPA",
    formula: "(Compliant data stores / Total data stores) × 100",
  },
  {
    id: "KPI-12",
    name: "Access Review Completion",
    description: "Percentage of user access reviews completed on schedule",
    metric: "Percentage",
    target: "> 95%",
    frequency: "Quarterly",
    regulation: "SOC 2 CC6.1, ISO 27001 A.5.18",
    formula: "(Access reviews completed / Scheduled reviews) × 100",
  },
];

const AI_KPIS: KPI[] = [
  {
    id: "KPI-AI-01",
    name: "AI Model Accuracy",
    description: "Measured accuracy of AI model outputs against ground truth",
    metric: "Percentage",
    target: "> 90% (application-specific)",
    frequency: "Monthly",
    regulation: "EU AI Act Art. 15",
    formula: "(Correct predictions / Total predictions) × 100",
  },
  {
    id: "KPI-AI-02",
    name: "AI Bias Audit Frequency",
    description: "Number of bias audits conducted on AI systems",
    metric: "Count",
    target: "> 1 per quarter",
    frequency: "Quarterly",
    regulation: "EU AI Act Art. 9, Colorado AI Act",
    formula: "Count of completed bias audits in period",
  },
  {
    id: "KPI-AI-03",
    name: "AI Incident Rate",
    description: "Number of AI-related incidents (hallucinations, bias events, safety triggers)",
    metric: "Count per 1000 interactions",
    target: "< 5 per 1000",
    frequency: "Monthly",
    regulation: "EU AI Act Art. 62",
    formula: "(AI incidents / Total AI interactions) × 1000",
  },
  {
    id: "KPI-AI-04",
    name: "Prompt Injection Block Rate",
    description: "Percentage of prompt injection attempts successfully blocked",
    metric: "Percentage",
    target: "> 95%",
    frequency: "Monthly",
    regulation: "EU AI Act Art. 15, OWASP LLM01",
    formula: "(Blocked injection attempts / Total injection attempts) × 100",
  },
];

export function generateComplianceKPIDashboard(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  if (scan.services.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const date = new Date().toISOString().split("T")[0];
  const hasAI = scan.services.some((s) => s.category === "ai");

  const sections: string[] = [];

  // ── Title ──────────────────────────────────────────────────────────

  sections.push(`# Compliance KPI Dashboard

**Organisation:** ${company}
**Project:** ${scan.projectName}
**Services Monitored:** ${scan.services.length}
**Generated:** ${date}

---

> This dashboard defines Key Performance Indicators (KPIs) for measuring the effectiveness of your compliance program. Regular measurement and reporting against these KPIs demonstrates accountability under GDPR, supports SOC 2 monitoring requirements, and aligns with ISO 27001 performance evaluation (Clause 9).`);

  // ── KPI Summary Table ──────────────────────────────────────────────

  const allKPIs = hasAI ? [...CORE_KPIS, ...AI_KPIS] : [...CORE_KPIS];

  let summaryTable = `
## KPI Overview

| ID | KPI | Target | Frequency | Regulation |
|----|-----|--------|-----------|------------|`;

  for (const kpi of allKPIs) {
    summaryTable += `\n| ${kpi.id} | ${kpi.name} | ${kpi.target} | ${kpi.frequency} | ${kpi.regulation} |`;
  }

  sections.push(summaryTable);

  // ── Detailed KPI Definitions ───────────────────────────────────────

  sections.push(`
## Core Compliance KPIs`);

  for (const kpi of CORE_KPIS) {
    sections.push(`
### ${kpi.id}: ${kpi.name}

**Description:** ${kpi.description}
**Metric:** ${kpi.metric}
**Target:** ${kpi.target}
**Measurement Frequency:** ${kpi.frequency}
**Regulatory Basis:** ${kpi.regulation}
**Formula:** \`${kpi.formula}\`

#### Tracking Template

| Period | Actual | Target | Status | Trend | Notes |
|--------|--------|--------|--------|-------|-------|
| Month 1 | ___ | ${kpi.target} | ⬜ | — | |
| Month 2 | ___ | ${kpi.target} | ⬜ | — | |
| Month 3 | ___ | ${kpi.target} | ⬜ | — | |`);
  }

  // ── AI-Specific KPIs ───────────────────────────────────────────────

  if (hasAI) {
    const aiNames = scan.services
      .filter((s) => s.category === "ai")
      .map((s) => s.name)
      .join(", ");

    sections.push(`
## AI-Specific KPIs

> The following KPIs are included because AI services were detected in your application: ${aiNames}`);

    for (const kpi of AI_KPIS) {
      sections.push(`
### ${kpi.id}: ${kpi.name}

**Description:** ${kpi.description}
**Metric:** ${kpi.metric}
**Target:** ${kpi.target}
**Measurement Frequency:** ${kpi.frequency}
**Regulatory Basis:** ${kpi.regulation}
**Formula:** \`${kpi.formula}\`

#### Tracking Template

| Period | Actual | Target | Status | Trend | Notes |
|--------|--------|--------|--------|-------|-------|
| Month 1 | ___ | ${kpi.target} | ⬜ | — | |
| Month 2 | ___ | ${kpi.target} | ⬜ | — | |
| Month 3 | ___ | ${kpi.target} | ⬜ | — | |`);
    }
  }

  // ── Monthly Tracking Template ──────────────────────────────────────

  const monthlyKPIs = allKPIs.filter((k) => k.frequency === "Monthly");
  const quarterlyKPIs = allKPIs.filter((k) => k.frequency === "Quarterly");

  sections.push(`
## Monthly Reporting Template

> Copy this template each month to track your compliance KPIs.

### Month: __________ Year: __________

| # | KPI | Target | Actual | Status | Action Required |
|---|-----|--------|--------|--------|-----------------|
${monthlyKPIs.map((kpi, i) => `| ${i + 1} | ${kpi.name} | ${kpi.target} | ___ | ⬜ | |`).join("\n")}

**Monthly Summary:**
- Total KPIs meeting target: ___ / ${monthlyKPIs.length}
- KPIs trending up: ___
- KPIs trending down: ___
- Action items for next month:
  1. ___
  2. ___
  3. ___

**Reported by:** _______________
**Date:** _______________`);

  // ── Quarterly Tracking Template ────────────────────────────────────

  sections.push(`
## Quarterly Reporting Template

> Copy this template each quarter to track quarterly KPIs and provide management reporting.

### Quarter: Q__ Year: __________

#### Quarterly KPIs

| # | KPI | Target | Actual | Status | Trend vs Last Quarter |
|---|-----|--------|--------|--------|----------------------|
${quarterlyKPIs.map((kpi, i) => `| ${i + 1} | ${kpi.name} | ${kpi.target} | ___ | ⬜ | |`).join("\n")}

#### Monthly KPI Trend (Quarter)

| KPI | Month 1 | Month 2 | Month 3 | Quarter Avg | Target |
|-----|---------|---------|---------|-------------|--------|
${monthlyKPIs.map((kpi) => `| ${kpi.name} | ___ | ___ | ___ | ___ | ${kpi.target} |`).join("\n")}

#### Quarterly Executive Summary

- **Overall compliance posture:** ⬜ Green / ⬜ Amber / ⬜ Red
- **KPIs meeting target:** ___ / ${allKPIs.length} (___%)
- **Key achievements this quarter:**
  1. ___
  2. ___
- **Key risks and concerns:**
  1. ___
  2. ___
- **Budget utilisation:** ___% of quarterly allocation
- **Recommended actions for next quarter:**
  1. ___
  2. ___

**Reviewed by:** _______________
**Date:** _______________`);

  // ── Annual Review Template ─────────────────────────────────────────

  sections.push(`
## Annual KPI Review

### Year-over-Year Comparison

| KPI | Q1 | Q2 | Q3 | Q4 | Annual Avg | Target | Status |
|-----|----|----|----|----|------------|--------|--------|
${allKPIs.map((kpi) => `| ${kpi.name} | ___ | ___ | ___ | ___ | ___ | ${kpi.target} | ⬜ |`).join("\n")}

### Annual Compliance Program Score

| Category | Weight | Score (1-5) | Weighted Score |
|----------|--------|-------------|----------------|
| Data Subject Rights | 20% | ___ | ___ |
| Incident Response | 20% | ___ | ___ |
| Vendor Management | 15% | ___ | ___ |
| Training & Awareness | 15% | ___ | ___ |
| Documentation | 15% | ___ | ___ |
| Technical Controls | 15% | ___ | ___ |
${hasAI ? "| AI Governance | 10% | ___ | ___ |\n" : ""}| **Total** | **100%** | | **___** |

> **Score Guide:** 1 = Not Implemented, 2 = Ad Hoc, 3 = Defined, 4 = Managed, 5 = Optimised`);

  // ── Dashboard Visualisation Guide ──────────────────────────────────

  sections.push(`
## Dashboard Implementation Guide

### Recommended Dashboard Tools

| Tool | Type | Cost | Integration |
|------|------|------|-------------|
| Google Sheets | Spreadsheet | Free | Manual entry |
| Notion | Wiki/Database | Free-$10/user | Manual entry |
| Grafana | Dashboard | Free (OSS) | API integration |
| Power BI | BI Platform | $10/user | API integration |
| Datadog | Monitoring | $15/host | Automated |

### Data Collection Automation

Where possible, automate KPI data collection:

\`\`\`
# Example: Run Codepliant scan as a KPI data source
codepliant scan /path/to/project --json > compliance-scan-$(date +%Y-%m-%d).json

# Extract compliance score
codepliant score /path/to/project --json | jq '.score'

# Count generated documents vs recommended
codepliant completeness /path/to/project --json
\`\`\`

### Alert Thresholds

| KPI | Warning Threshold | Critical Threshold | Action |
|-----|------------------|--------------------|--------|
| DSAR Response Time | > 20 days | > 27 days | Escalate to DPO |
| Breach Notification | > 48 hours | > 60 hours | Emergency response |
| Training Completion | < 90% | < 80% | Mandatory training push |
| Vendor Assessment | < 85% | < 75% | Vendor review sprint |
| Vulnerability Remediation | > SLA | > 2× SLA | Security escalation |`);

  // ── Footer ─────────────────────────────────────────────────────────

  sections.push(`
## Contact

For questions about compliance KPIs:

- **Email:** ${email}${ctx?.dpoEmail ? `\n- **Data Protection Officer:** ${ctx.dpoEmail}` : ""}

---

*This Compliance KPI Dashboard was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. KPI targets are based on regulatory requirements and industry best practices. Adjust targets to match your organisation's risk appetite, regulatory obligations, and operational capacity. This document should be reviewed by your compliance team.*`);

  return sections.join("\n");
}
