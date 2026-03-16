import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

interface MonthlyActivity {
  review: string[];
  update: string[];
  report: string[];
}

/**
 * Generates a COMPLIANCE_CALENDAR.md with a 12-month calendar view
 * of all compliance activities, auto-populated from detected regulations
 * and services.
 */
export function generateComplianceCalendar(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  if (scan.services.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];
  const jurisdictions = ctx?.jurisdictions || [];

  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasAnalytics = scan.services.some(
    (s) => s.category === "analytics" || s.category === "advertising"
  );
  const hasAuth = scan.services.some((s) => s.category === "auth");
  const hasEmail = scan.services.some((s) => s.category === "email");
  const hasStorage = scan.services.some(
    (s) => s.category === "storage" || s.category === "database"
  );
  const hasMonitoring = scan.services.some((s) => s.category === "monitoring");

  const showGDPR =
    jurisdictions.length === 0 || jurisdictions.includes("gdpr");
  const companyLocation = ctx?.companyLocation || "";
  const showCCPA =
    jurisdictions.includes("ccpa") ||
    companyLocation.toUpperCase() === "US" ||
    hasAnalytics;

  // Build monthly activities
  const months: Record<string, MonthlyActivity> = {};
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  for (const m of monthNames) {
    months[m] = { review: [], update: [], report: [] };
  }

  // ── Recurring monthly activities ──────────────────────────────────

  for (const m of monthNames) {
    months[m].review.push("Review data breach and incident logs");
    months[m].review.push("Verify consent mechanisms are operational");
    if (hasMonitoring) {
      months[m].review.push("Review error monitoring and alerting thresholds");
    }
  }

  // ── Quarterly activities (Jan, Apr, Jul, Oct) ─────────────────────

  const quarterlyMonths = ["January", "April", "July", "October"];
  for (const m of quarterlyMonths) {
    months[m].review.push("Re-run Codepliant to detect new services or dependencies");
    months[m].review.push("Review and update data processing agreements");
    months[m].report.push("Quarterly compliance status report");

    if (showGDPR) {
      months[m].review.push("Verify DSAR response procedures are operational");
    }
    if (hasPayment) {
      months[m].review.push("PCI DSS quarterly vulnerability scan (ASV)");
    }
    if (hasAnalytics) {
      months[m].review.push("Review analytics data sharing and cookie consent configuration");
    }
  }

  // ── Semi-annual activities (Jan, Jul) ─────────────────────────────

  months["January"].review.push("Conduct internal compliance audit (H1)");
  months["July"].review.push("Conduct internal compliance audit (H2)");

  if (hasAI) {
    months["January"].review.push("AI system risk re-assessment (H1)");
    months["July"].review.push("AI system risk re-assessment (H2)");
  }

  // ── Annual activities ─────────────────────────────────────────────

  // January: annual kickoff
  months["January"].update.push("Full privacy policy review and update");
  months["January"].update.push("Review and update all compliance documents");
  months["January"].report.push("Annual compliance summary report");
  months["January"].review.push("Review regulatory landscape for new obligations");

  if (showCCPA) {
    months["January"].update.push("Update CCPA disclosures and data collection categories");
    months["January"].review.push("Review \"Do Not Sell or Share\" mechanisms");
  }

  if (hasPayment) {
    months["January"].update.push("PCI DSS annual Self-Assessment Questionnaire");
  }

  // February: training
  months["February"].update.push("Staff data protection training refresh");
  months["February"].review.push("Review employee privacy notice");

  // March: vendor review
  months["March"].review.push("Annual vendor and sub-processor review");
  months["March"].update.push("Update sub-processor list");
  if (hasStorage) {
    months["March"].review.push("Review data backup and disaster recovery procedures");
  }

  // April: Q1 wrap-up
  months["April"].report.push("Q1 compliance metrics report");

  // May: data retention
  months["May"].review.push("Review and enforce data retention schedules");
  months["May"].update.push("Purge data past retention period");
  if (hasStorage) {
    months["May"].review.push("Verify encryption at rest for all personal data stores");
  }

  // June: security
  months["June"].review.push("Review access controls and authentication policies");
  months["June"].update.push("Rotate API keys and service credentials");
  if (hasAuth) {
    months["June"].review.push("Audit authentication session lengths and token lifetimes");
  }

  // July: mid-year review
  months["July"].report.push("Mid-year compliance status report");
  months["July"].update.push("Update risk register");

  // August: AI Act
  if (hasAI) {
    months["August"].review.push("Review AI Disclosure document for EU AI Act compliance");
    months["August"].update.push("Update AI Model Card and transparency documentation");
    months["August"].review.push("Verify AI-generated content marking is operational");
  }

  // September: incident preparedness
  months["September"].review.push("Conduct data breach response drill");
  months["September"].update.push("Update incident response plan and communication templates");
  if (hasEmail) {
    months["September"].review.push("Review email marketing consent records (CAN-SPAM / GDPR)");
  }

  // October: Q3 wrap-up
  months["October"].report.push("Q3 compliance metrics report");

  if (showGDPR) {
    months["October"].review.push("Review international data transfer safeguards");
    months["October"].update.push("Update Record of Processing Activities (GDPR Art. 30)");
  }

  // November: year-end preparation
  months["November"].review.push("Pre-audit preparation and gap analysis");
  months["November"].update.push("Update compliance roadmap for next year");
  months["November"].review.push("Review third-party risk assessments");

  // December: wrap-up
  months["December"].report.push("Annual compliance review report for board/leadership");
  months["December"].update.push("Archive compliance records for the year");
  months["December"].review.push("Verify all annual compliance tasks are complete");

  // ── Build document ────────────────────────────────────────────────

  const sections: string[] = [];
  let sectionNum = 0;

  function nextSection(): number {
    return ++sectionNum;
  }

  sections.push(`# Compliance Calendar

**Company:** ${company}
**Last updated:** ${date}
**Project:** ${scan.projectName}

---

This document provides a 12-month calendar view of all compliance activities for **${scan.projectName}**, auto-populated based on ${scan.services.length} detected service(s) and applicable regulations.

> **Disclaimer:** This is not legal advice. Consult qualified legal counsel to confirm applicable obligations and deadlines for your specific situation.`);

  // ── Applicable Regulations ────────────────────────────────────────

  {
    let regulationsSection = `\n## ${nextSection()}. Applicable Regulations\n\n`;
    regulationsSection += `Based on your project configuration and detected services, the following regulations inform this calendar:\n\n`;

    if (showGDPR) {
      regulationsSection += `- **GDPR** — General Data Protection Regulation (EU) 2016/679\n`;
    }
    if (showCCPA) {
      regulationsSection += `- **CCPA/CPRA** — California Consumer Privacy Act / California Privacy Rights Act\n`;
    }
    if (hasAI) {
      regulationsSection += `- **EU AI Act** — Regulation (EU) 2024/1689\n`;
    }
    if (hasPayment) {
      regulationsSection += `- **PCI DSS** — Payment Card Industry Data Security Standard v4.0.1\n`;
    }
    if (hasAnalytics || hasEmail) {
      regulationsSection += `- **ePrivacy Directive** — Cookie consent and electronic communications\n`;
    }
    if (hasEmail) {
      regulationsSection += `- **CAN-SPAM Act** — US commercial email requirements\n`;
    }

    sections.push(regulationsSection);
  }

  // ── Monthly Calendar ──────────────────────────────────────────────

  sections.push(`\n## ${nextSection()}. Monthly Calendar\n`);

  for (const monthName of monthNames) {
    const activity = months[monthName];
    let monthSection = `\n### ${monthName}\n\n`;

    if (activity.review.length > 0) {
      monthSection += `**Review:**\n`;
      for (const item of activity.review) {
        monthSection += `- [ ] ${item}\n`;
      }
      monthSection += `\n`;
    }

    if (activity.update.length > 0) {
      monthSection += `**Update:**\n`;
      for (const item of activity.update) {
        monthSection += `- [ ] ${item}\n`;
      }
      monthSection += `\n`;
    }

    if (activity.report.length > 0) {
      monthSection += `**Report:**\n`;
      for (const item of activity.report) {
        monthSection += `- [ ] ${item}\n`;
      }
      monthSection += `\n`;
    }

    sections.push(monthSection);
  }

  // ── Annual Summary Table ──────────────────────────────────────────

  {
    let summarySection = `\n## ${nextSection()}. Annual Summary\n\n`;
    summarySection += `| Month | Review | Update | Report |\n`;
    summarySection += `|-------|--------|--------|--------|\n`;

    for (const monthName of monthNames) {
      const a = months[monthName];
      summarySection += `| ${monthName} | ${a.review.length} items | ${a.update.length} items | ${a.report.length} items |\n`;
    }

    const totalReview = monthNames.reduce((sum, m) => sum + months[m].review.length, 0);
    const totalUpdate = monthNames.reduce((sum, m) => sum + months[m].update.length, 0);
    const totalReport = monthNames.reduce((sum, m) => sum + months[m].report.length, 0);

    summarySection += `| **Total** | **${totalReview} items** | **${totalUpdate} items** | **${totalReport} items** |\n`;

    sections.push(summarySection);
  }

  // ── Service-Specific Obligations ──────────────────────────────────

  {
    let serviceSection = `\n## ${nextSection()}. Service-Specific Compliance Activities\n\n`;
    serviceSection += `The following activities are included in the calendar based on detected services:\n\n`;

    const categories = new Set(scan.services.map((s) => s.category));

    if (categories.has("ai")) {
      const names = scan.services.filter((s) => s.category === "ai").map((s) => s.name).join(", ");
      serviceSection += `### AI Services (${names})\n`;
      serviceSection += `- Semi-annual AI risk re-assessment (Jan, Jul)\n`;
      serviceSection += `- Annual AI Disclosure and Model Card review (Aug)\n`;
      serviceSection += `- Ongoing AI-generated content marking verification\n\n`;
    }

    if (categories.has("payment")) {
      const names = scan.services.filter((s) => s.category === "payment").map((s) => s.name).join(", ");
      serviceSection += `### Payment Services (${names})\n`;
      serviceSection += `- Annual PCI DSS Self-Assessment (Jan)\n`;
      serviceSection += `- Quarterly vulnerability scans (Jan, Apr, Jul, Oct)\n\n`;
    }

    if (categories.has("analytics") || categories.has("advertising")) {
      const names = scan.services
        .filter((s) => s.category === "analytics" || s.category === "advertising")
        .map((s) => s.name)
        .join(", ");
      serviceSection += `### Analytics / Advertising (${names})\n`;
      serviceSection += `- Quarterly cookie consent review (Jan, Apr, Jul, Oct)\n`;
      serviceSection += `- Annual CCPA "sale" classification review (Jan)\n\n`;
    }

    if (categories.has("auth")) {
      const names = scan.services.filter((s) => s.category === "auth").map((s) => s.name).join(", ");
      serviceSection += `### Authentication Services (${names})\n`;
      serviceSection += `- Semi-annual access control audit (Jun)\n`;
      serviceSection += `- Token and session lifetime review (Jun)\n\n`;
    }

    if (categories.has("email")) {
      const names = scan.services.filter((s) => s.category === "email").map((s) => s.name).join(", ");
      serviceSection += `### Email Services (${names})\n`;
      serviceSection += `- Annual consent record review (Sep)\n`;
      serviceSection += `- Unsubscribe mechanism verification (Sep)\n\n`;
    }

    if (categories.has("storage") || categories.has("database")) {
      const names = scan.services
        .filter((s) => s.category === "storage" || s.category === "database")
        .map((s) => s.name)
        .join(", ");
      serviceSection += `### Storage / Database Services (${names})\n`;
      serviceSection += `- Annual backup and DR review (Mar)\n`;
      serviceSection += `- Encryption verification (May)\n`;
      serviceSection += `- Data retention enforcement (May)\n\n`;
    }

    sections.push(serviceSection);
  }

  // ── Tips ──────────────────────────────────────────────────────────

  sections.push(`\n## ${nextSection()}. Tips for Using This Calendar

- **Set reminders** — Import key dates into your team calendar (Google Calendar, Outlook, etc.)
- **Assign owners** — Each activity should have a named responsible person
- **Track completion** — Use the checkboxes above to track progress throughout the year
- **Re-generate** — Run Codepliant after adding or removing services to keep this calendar current
- **Adjust cadence** — Some activities may need higher frequency depending on your risk profile`);

  // ── Footer ────────────────────────────────────────────────────────

  sections.push(
    `\n---\n\n*This compliance calendar was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. It is for informational purposes only and does not constitute legal advice.*`
  );

  return sections.join("\n");
}
