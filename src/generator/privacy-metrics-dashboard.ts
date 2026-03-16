import type { ScanResult } from "../scanner/types.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generate PRIVACY_METRICS_DASHBOARD.md — KPI dashboard specifically for the
 * privacy program. Tracks DSAR response times, consent rates, data subject
 * complaints, and other privacy-specific metrics with monthly tracking
 * templates and targets.
 *
 * Returns null when no services are detected.
 */
export function generatePrivacyMetricsDashboard(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const dpo = ctx?.dpoName || "[DPO Name]";
  const dpoEmail = ctx?.dpoEmail || "[dpo@example.com]";
  const date = new Date().toISOString().split("T")[0];

  // Detect whether GDPR / CCPA jurisdictions apply
  const jurisdictions = ctx?.jurisdictions || [];
  const hasGDPR = jurisdictions.includes("GDPR") || jurisdictions.includes("UK GDPR");
  const hasCCPA = jurisdictions.includes("CCPA");

  // Count service categories for context-aware metrics
  const categories = new Set(scan.services.map((s) => s.category));
  const hasAnalytics = categories.has("analytics") || categories.has("advertising");
  const hasPayment = categories.has("payment");
  const hasAI = categories.has("ai");
  const vendorCount = scan.services.filter((s) => s.isDataProcessor !== false).length;

  // Build current year months
  const currentYear = new Date().getFullYear();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const sections: string[] = [];

  // ── Title ──────────────────────────────────────────────────────────

  sections.push(`# Privacy Metrics Dashboard

**Last updated:** ${date}

**Project:** ${scan.projectName}

**Organization:** ${company}

**Privacy contact:** ${email}

**DPO:** ${dpo} (${dpoEmail})

**Reporting period:** ${currentYear}

---

## Executive Summary

This dashboard tracks key performance indicators (KPIs) for the **${company}** privacy program. It provides monthly metrics for DSAR handling, consent management, data subject complaints, breach incidents, and vendor compliance. Use this dashboard for board reporting, regulatory evidence, and continuous improvement of the privacy program.

**Detected stack:** ${vendorCount} third-party services across ${categories.size} categories.

---`);

  // ── KPI Targets ────────────────────────────────────────────────────

  sections.push(`## KPI Targets

| KPI | Target | Regulatory Basis |
|-----|--------|-----------------|
| DSAR Response Time (avg) | < 15 business days | ${hasGDPR ? "GDPR Art. 12(3): 30 days" : ""}${hasGDPR && hasCCPA ? " / " : ""}${hasCCPA ? "CCPA: 45 days" : ""}${!hasGDPR && !hasCCPA ? "Best practice: 30 days" : ""} |
| DSAR Completion Rate | 100% | Regulatory requirement |
| Consent Opt-in Rate | > 70% | ${hasGDPR ? "GDPR Art. 7: freely given consent" : "Industry benchmark"} |
| Consent Withdrawal Processing | < 48 hours | ${hasGDPR ? "GDPR Art. 7(3): easy withdrawal" : "Best practice"} |
| Data Subject Complaints | < 5/month | Internal target |
| Breach Notification Time | < 72 hours | ${hasGDPR ? "GDPR Art. 33: 72-hour notification" : "Best practice"} |
| Vendor DPA Coverage | 100% | ${hasGDPR ? "GDPR Art. 28: processor agreements" : "Best practice"} |
| Privacy Training Completion | 100% | ${hasGDPR ? "GDPR Art. 39(1)(b)" : "Best practice"} |
| Data Deletion Backlog | 0 | Regulatory requirement |
${hasAI ? `| AI Processing Opt-out Rate | < 10% | EU AI Act / Best practice |` : ""}

---`);

  // ── DSAR Metrics ───────────────────────────────────────────────────

  sections.push(`## 1. DSAR (Data Subject Access Request) Metrics

### Monthly DSAR Tracking — ${currentYear}

| Month | Received | Completed | Pending | Avg Response (days) | Within SLA | Overdue |
|-------|----------|-----------|---------|-------------------|------------|---------|`);

  for (const month of months) {
    sections.push(`| ${month} | ___ | ___ | ___ | ___ | ___ | ___ |`);
  }

  sections.push(`| **YTD Total** | ___ | ___ | ___ | ___ | ___ | ___ |

### DSAR by Request Type

| Request Type | Count | Avg Processing Time | Target |
|-------------|-------|-------------------|--------|
| Access Request | ___ | ___ days | 15 days |
| Deletion Request | ___ | ___ days | 15 days |
| Portability Request | ___ | ___ days | 15 days |
| Rectification Request | ___ | ___ days | 10 days |
| Objection to Processing | ___ | ___ days | 10 days |
| Restrict Processing | ___ | ___ days | 10 days |
${hasCCPA ? `| Do Not Sell/Share | ___ | ___ days | 15 days |\n| Know / Disclose | ___ | ___ days | 15 days |` : ""}

---`);

  // ── Consent Metrics ────────────────────────────────────────────────

  if (hasAnalytics || hasGDPR) {
    sections.push(`## 2. Consent Management Metrics

### Monthly Consent Tracking — ${currentYear}

| Month | Total Users | Consented | Declined | Withdrawn | Opt-in Rate | Withdrawal Rate |
|-------|------------|-----------|----------|-----------|-------------|----------------|`);

    for (const month of months) {
      sections.push(`| ${month} | ___ | ___ | ___ | ___ | ___% | ___% |`);
    }

    sections.push(`| **YTD Avg** | ___ | ___ | ___ | ___ | ___% | ___% |

### Consent by Purpose

| Purpose | Opt-in Rate | Target |
|---------|-------------|--------|
| Essential / Strictly Necessary | N/A (required) | N/A |
| Analytics & Performance | ___% | > 60% |
| Marketing & Advertising | ___% | > 40% |
| Personalization | ___% | > 50% |
${hasAI ? `| AI / ML Processing | ___% | > 50% |` : ""}
| Third-party Sharing | ___% | > 30% |

---`);
  }

  // ── Data Subject Complaints ────────────────────────────────────────

  sections.push(`## ${hasAnalytics || hasGDPR ? "3" : "2"}. Data Subject Complaints

### Monthly Complaint Tracking — ${currentYear}

| Month | Received | Resolved | Escalated | Avg Resolution (days) | Satisfaction |
|-------|----------|----------|-----------|---------------------|-------------|`);

  for (const month of months) {
    sections.push(`| ${month} | ___ | ___ | ___ | ___ | ___% |`);
  }

  sections.push(`| **YTD Total** | ___ | ___ | ___ | ___ | ___% |

### Complaints by Category

| Category | Count | Resolution Rate | Avg Time |
|----------|-------|----------------|----------|
| Unwanted communications | ___ | ___% | ___ days |
| Data accuracy | ___ | ___% | ___ days |
| Delayed DSAR response | ___ | ___% | ___ days |
| Unauthorized data sharing | ___ | ___% | ___ days |
| Consent not respected | ___ | ___% | ___ days |
| Other | ___ | ___% | ___ days |

---`);

  // ── Breach Metrics ─────────────────────────────────────────────────

  const sectionNum = (hasAnalytics || hasGDPR) ? 4 : 3;

  sections.push(`## ${sectionNum}. Breach & Incident Metrics

### Monthly Incident Tracking — ${currentYear}

| Month | Incidents | Breaches (notifiable) | Avg Detection (hrs) | Avg Notification (hrs) | Records Affected |
|-------|-----------|----------------------|--------------------|-----------------------|-----------------|`);

  for (const month of months) {
    sections.push(`| ${month} | ___ | ___ | ___ | ___ | ___ |`);
  }

  sections.push(`| **YTD Total** | ___ | ___ | ___ | ___ | ___ |

### Incident Response SLA Performance

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Time to detect | < 24 hours | ___ hrs | ___ |
| Time to contain | < 48 hours | ___ hrs | ___ |
| Time to notify regulator | < 72 hours | ___ hrs | ___ |
| Time to notify data subjects | < 7 days | ___ days | ___ |
| Post-incident review completed | < 14 days | ___ days | ___ |

---`);

  // ── Vendor Compliance Metrics ──────────────────────────────────────

  sections.push(`## ${sectionNum + 1}. Vendor Compliance Metrics

### Vendor DPA Status

| Metric | Count | Percentage | Target |
|--------|-------|-----------|--------|
| Total vendors detected | ${vendorCount} | — | — |
| DPA signed and current | ___ | ___% | 100% |
| DPA pending signature | ___ | ___% | 0% |
| DPA expired / due for renewal | ___ | ___% | 0% |
| No DPA in place | ___ | ___% | 0% |

### Vendor Review Status

| Metric | Count | Status |
|--------|-------|--------|
| Reviews completed (YTD) | ___ | ___ |
| Reviews overdue | ___ | ___ |
| New vendors onboarded (YTD) | ___ | ___ |
| Vendors offboarded (YTD) | ___ | ___ |

---`);

  // ── Training Metrics ───────────────────────────────────────────────

  sections.push(`## ${sectionNum + 2}. Privacy Training Metrics

### Training Completion — ${currentYear}

| Quarter | Eligible Staff | Completed | Completion Rate | Target |
|---------|---------------|-----------|----------------|--------|
| Q1 | ___ | ___ | ___% | 100% |
| Q2 | ___ | ___ | ___% | 100% |
| Q3 | ___ | ___ | ___% | 100% |
| Q4 | ___ | ___ | ___% | 100% |

### Training by Topic

| Topic | Completions | Pass Rate |
|-------|------------|-----------|
| GDPR Fundamentals | ___ | ___% |
| Data Handling Procedures | ___ | ___% |
| Breach Response | ___ | ___% |
| Vendor Management | ___ | ___% |
${hasAI ? `| Responsible AI Use | ___ | ___% |` : ""}
| DSAR Processing | ___ | ___% |

---`);

  // ── Monthly Scorecard Template ─────────────────────────────────────

  sections.push(`## Monthly Privacy Scorecard Template

Use this template for monthly board/stakeholder reporting:

### Privacy Program Scorecard — [Month ${currentYear}]

| KPI | Target | Actual | Trend | RAG Status |
|-----|--------|--------|-------|-----------|
| DSAR Response Time | < 15 days | ___ days | ___ | ___ |
| DSAR Completion Rate | 100% | ___% | ___ | ___ |
| Consent Opt-in Rate | > 70% | ___% | ___ | ___ |
| Complaints Received | < 5 | ___ | ___ | ___ |
| Breach Incidents | 0 | ___ | ___ | ___ |
| Vendor DPA Coverage | 100% | ___% | ___ | ___ |
| Training Completion | 100% | ___% | ___ | ___ |
| Data Deletion Backlog | 0 | ___ | ___ | ___ |

**RAG Key:** GREEN = On target | AMBER = Within 10% of target | RED = Exceeds target threshold

### Monthly Narrative

**Highlights:**
- ___

**Concerns:**
- ___

**Actions for next month:**
- ___

---`);

  // ── Trend Analysis ─────────────────────────────────────────────────

  sections.push(`## Trend Analysis

### Quarterly Comparison

| KPI | Q1 | Q2 | Q3 | Q4 | YoY Change |
|-----|----|----|----|----|-----------|
| DSARs Received | ___ | ___ | ___ | ___ | ___% |
| Avg DSAR Response Time | ___ | ___ | ___ | ___ | ___ days |
| Complaints | ___ | ___ | ___ | ___ | ___% |
| Consent Rate | ___% | ___% | ___% | ___% | ___ pts |
| Breaches | ___ | ___ | ___ | ___ | ___ |
| Vendor Reviews Completed | ___ | ___ | ___ | ___ | ___ |

---

## Maintaining This Dashboard

- **Update frequency:** Monthly (first business day of each month)
- **Ownership:** Data Protection Officer / Privacy Team
- **Data sources:** DSAR log, consent management platform, incident log, vendor tracker, LMS
- **Distribution:** Privacy team, C-suite, board (quarterly summary)
- **Automation:** Re-run Codepliant to update vendor counts; manually update operational metrics

---

*This privacy metrics dashboard was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Vendor counts and categories are auto-populated from the codebase. Operational metrics (DSAR counts, consent rates, etc.) must be manually tracked. This document does not constitute legal advice.*`);

  return sections.join("\n");
}
