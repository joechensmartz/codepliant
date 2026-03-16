import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

interface Deadline {
  date: string;
  sortKey: string; // ISO date for sorting, "9999-12-31" for ongoing
  label: string;
  regulation: string;
  actionItems: string[];
}

/**
 * Generates a COMPLIANCE_TIMELINE.md with key regulatory deadlines,
 * per-project obligations based on detected services, action items,
 * and a recommended review schedule.
 */
export function generateComplianceTimeline(
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

  const showGDPR =
    jurisdictions.length === 0 || jurisdictions.includes("gdpr");
  const companyLocation = ctx?.companyLocation || "";
  const showCCPA =
    jurisdictions.includes("ccpa") ||
    companyLocation.toUpperCase() === "US" ||
    hasAnalytics;

  const sections: string[] = [];
  let sectionNum = 0;

  function nextSection(): number {
    return ++sectionNum;
  }

  // ── Title ─────────────────────────────────────────────────────────

  sections.push(`# Compliance Timeline

**Company:** ${company}
**Last updated:** ${date}
**Project:** ${scan.projectName}

---

This document outlines key compliance deadlines, ongoing obligations, and recommended action items based on the services detected in your codebase.

> **Disclaimer:** This is not legal advice. Consult qualified legal counsel to confirm applicable deadlines and obligations for your specific situation.`);

  // ── Key Upcoming Deadlines ──────────────────────────────────────

  const deadlines: Deadline[] = [];

  // EU AI Act
  if (hasAI) {
    deadlines.push({
      date: "Aug 2, 2026",
      sortKey: "2026-08-02",
      label: "EU AI Act — Full transparency obligations take effect",
      regulation: "EU AI Act (Regulation 2024/1689), Article 50",
      actionItems: [
        "Complete AI system risk classification",
        "Publish AI Disclosure document",
        "Implement machine-readable AI content marking (Art. 50(2))",
        "Establish human oversight procedures",
        "Document all AI system usage and data flows",
      ],
    });
  }

  // GDPR ongoing
  if (showGDPR) {
    deadlines.push({
      date: "Ongoing",
      sortKey: "9999-12-31",
      label: "GDPR — Continuous compliance obligations",
      regulation: "General Data Protection Regulation (EU) 2016/679",
      actionItems: [
        "Maintain up-to-date Record of Processing Activities (Art. 30)",
        "Review and update privacy notices annually",
        "Ensure data subject rights procedures are operational",
        "Conduct Data Protection Impact Assessments for new processing activities (Art. 35)",
        "Verify international transfer safeguards remain valid",
      ],
    });
  }

  // CCPA annual review
  if (showCCPA) {
    deadlines.push({
      date: "Annually (Jan 1)",
      sortKey: "9999-01-01",
      label: "CCPA/CPRA — Annual privacy policy review and update",
      regulation: "California Consumer Privacy Act / California Privacy Rights Act",
      actionItems: [
        "Update privacy policy with current data collection categories",
        "Review and update \"Do Not Sell or Share\" mechanisms",
        "Verify opt-out request handling within 15-business-day requirement",
        "Confirm Global Privacy Control (GPC) signal compliance",
        "Update data processing agreements with service providers",
      ],
    });
  }

  // US State Privacy Laws — effective dates
  const usStateLaws: { state: string; law: string; date: string; sortKey: string }[] = [
    { state: "Colorado", law: "Colorado Privacy Act (CPA)", date: "Jul 1, 2023", sortKey: "2023-07-01" },
    { state: "Connecticut", law: "Connecticut Data Privacy Act (CTDPA)", date: "Jul 1, 2023", sortKey: "2023-07-01" },
    { state: "Virginia", law: "Virginia CDPA", date: "Jan 1, 2023", sortKey: "2023-01-01" },
    { state: "Utah", law: "Utah Consumer Privacy Act (UCPA)", date: "Dec 31, 2023", sortKey: "2023-12-31" },
    { state: "Oregon", law: "Oregon Consumer Privacy Act", date: "Jul 1, 2024", sortKey: "2024-07-01" },
    { state: "Texas", law: "Texas Data Privacy and Security Act (TDPSA)", date: "Jul 1, 2024", sortKey: "2024-07-01" },
    { state: "Montana", law: "Montana Consumer Data Privacy Act", date: "Oct 1, 2024", sortKey: "2024-10-01" },
    { state: "Iowa", law: "Iowa Consumer Data Protection Act", date: "Jan 1, 2025", sortKey: "2025-01-01" },
    { state: "Delaware", law: "Delaware Personal Data Privacy Act", date: "Jan 1, 2025", sortKey: "2025-01-01" },
    { state: "New Hampshire", law: "New Hampshire Privacy Act", date: "Jan 1, 2025", sortKey: "2025-01-01" },
    { state: "New Jersey", law: "New Jersey Data Privacy Act", date: "Jan 15, 2025", sortKey: "2025-01-15" },
    { state: "Nebraska", law: "Nebraska Data Privacy Act", date: "Jan 1, 2025", sortKey: "2025-01-01" },
    { state: "Tennessee", law: "Tennessee Information Protection Act", date: "Jul 1, 2025", sortKey: "2025-07-01" },
    { state: "Minnesota", law: "Minnesota Consumer Data Privacy Act", date: "Jul 31, 2025", sortKey: "2025-07-31" },
    { state: "Maryland", law: "Maryland Online Data Privacy Act", date: "Oct 1, 2025", sortKey: "2025-10-01" },
    { state: "Indiana", law: "Indiana Consumer Data Protection Act", date: "Jan 1, 2026", sortKey: "2026-01-01" },
    { state: "Kentucky", law: "Kentucky Consumer Data Protection Act", date: "Jan 1, 2026", sortKey: "2026-01-01" },
    { state: "Rhode Island", law: "Rhode Island Data Transparency and Privacy Protection Act", date: "Jan 1, 2026", sortKey: "2026-01-01" },
  ];

  if (showCCPA || companyLocation.toUpperCase() === "US") {
    for (const sl of usStateLaws) {
      deadlines.push({
        date: sl.date,
        sortKey: sl.sortKey,
        label: `${sl.law} — Effective date`,
        regulation: `${sl.state} state privacy law`,
        actionItems: [
          `Review ${sl.state} requirements for applicability to your business`,
          "Ensure privacy policy covers state-specific disclosure requirements",
          "Implement opt-out mechanisms as required",
        ],
      });
    }
  }

  // PCI DSS
  if (hasPayment) {
    deadlines.push({
      date: "Ongoing",
      sortKey: "9999-12-31",
      label: "PCI DSS — Annual self-assessment and ongoing compliance",
      regulation: "Payment Card Industry Data Security Standard v4.0.1",
      actionItems: [
        "Complete annual Self-Assessment Questionnaire (SAQ)",
        "Conduct quarterly vulnerability scans (if applicable)",
        "Review payment processor data processing agreements",
        "Verify encryption of cardholder data in transit and at rest",
      ],
    });
  }

  // Sort: dated deadlines first (by date), then ongoing
  deadlines.sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  {
    let deadlinesSection = `\n## ${nextSection()}. Key Regulatory Deadlines\n\n`;
    deadlinesSection += `| Date | Deadline | Regulation |\n`;
    deadlinesSection += `|------|----------|------------|\n`;

    for (const d of deadlines) {
      deadlinesSection += `| ${d.date} | ${d.label} | ${d.regulation} |\n`;
    }

    sections.push(deadlinesSection);
  }

  // ── Per-Project Timeline ──────────────────────────────────────────

  {
    let projectSection = `\n## ${nextSection()}. Project-Specific Obligations\n\n`;
    projectSection += `Based on the ${scan.services.length} service(s) detected in **${scan.projectName}**, the following obligations apply:\n\n`;

    if (hasAI) {
      const aiServices = scan.services
        .filter((s) => s.category === "ai")
        .map((s) => s.name)
        .join(", ");
      projectSection += `### AI Services (${aiServices})\n\n`;
      projectSection += `- **Aug 2, 2026** — AI Disclosure must be in place per EU AI Act Article 50\n`;
      projectSection += `- **Ongoing** — Maintain human oversight documentation\n`;
      projectSection += `- **Ongoing** — Mark AI-generated content in machine-readable format\n`;
      projectSection += `- **Ongoing** — Log AI system inputs/outputs for transparency audits\n\n`;
    }

    if (hasPayment) {
      const paymentServices = scan.services
        .filter((s) => s.category === "payment")
        .map((s) => s.name)
        .join(", ");
      projectSection += `### Payment Services (${paymentServices})\n\n`;
      projectSection += `- **Ongoing** — PCI DSS annual self-assessment required\n`;
      projectSection += `- **Ongoing** — Quarterly vulnerability scans (ASV) if applicable\n`;
      projectSection += `- **Ongoing** — Ensure no raw card data is stored post-authorization\n\n`;
    }

    if (hasAnalytics) {
      const analyticsServices = scan.services
        .filter((s) => s.category === "analytics" || s.category === "advertising")
        .map((s) => s.name)
        .join(", ");
      projectSection += `### Analytics / Advertising Services (${analyticsServices})\n\n`;
      projectSection += `- **Ongoing** — Cookie consent mechanism must be maintained (ePrivacy Directive)\n`;
      projectSection += `- **Ongoing** — Honor "Do Not Sell or Share" requests (CCPA/CPRA)\n`;
      projectSection += `- **Ongoing** — Respect Global Privacy Control (GPC) signals\n`;
      projectSection += `- **Annually** — Review analytics data sharing for CCPA "sale" classification\n\n`;
    }

    if (hasAuth) {
      const authServices = scan.services
        .filter((s) => s.category === "auth")
        .map((s) => s.name)
        .join(", ");
      projectSection += `### Authentication Services (${authServices})\n\n`;
      projectSection += `- **Ongoing** — Maintain data subject access request (DSAR) procedures\n`;
      projectSection += `- **Ongoing** — Review session data retention periods\n`;
      projectSection += `- **Ongoing** — Ensure authentication data processing agreements are current\n\n`;
    }

    const emailServices = scan.services.filter((s) => s.category === "email");
    if (emailServices.length > 0) {
      projectSection += `### Email Services (${emailServices.map((s) => s.name).join(", ")})\n\n`;
      projectSection += `- **Ongoing** — Maintain CAN-SPAM / GDPR consent records for marketing emails\n`;
      projectSection += `- **Ongoing** — Provide working unsubscribe mechanisms\n`;
      projectSection += `- **Ongoing** — Review email service DPAs annually\n\n`;
    }

    const storageServices = scan.services.filter(
      (s) => s.category === "storage" || s.category === "database"
    );
    if (storageServices.length > 0) {
      projectSection += `### Storage / Database Services (${storageServices.map((s) => s.name).join(", ")})\n\n`;
      projectSection += `- **Ongoing** — Enforce data retention schedules\n`;
      projectSection += `- **Ongoing** — Ensure encryption at rest for personal data\n`;
      projectSection += `- **Ongoing** — Verify backup and disaster recovery procedures\n\n`;
    }

    sections.push(projectSection);
  }

  // ── Action Items with Due Dates ──────────────────────────────────

  {
    let actionSection = `\n## ${nextSection()}. Action Items\n\n`;

    // Collect all action items from deadlines, deduplicated
    const immediateActions: string[] = [];
    const upcomingActions: string[] = [];
    const ongoingActions: string[] = [];

    // Immediate: anything that should already be in effect
    if (showGDPR) {
      immediateActions.push("Verify GDPR privacy notice is published and accurate");
      immediateActions.push("Confirm Record of Processing Activities is up to date");
    }
    if (showCCPA) {
      immediateActions.push("Verify CCPA disclosures are included in privacy policy");
      immediateActions.push("Confirm \"Do Not Sell or Share\" link is functional");
    }
    if (hasPayment) {
      immediateActions.push("Verify PCI DSS Self-Assessment Questionnaire is current");
    }
    if (hasAnalytics) {
      immediateActions.push("Verify cookie consent mechanism is operational");
    }

    // Upcoming: future deadlines
    if (hasAI) {
      upcomingActions.push("**By Aug 2, 2026** — Finalize and publish AI Disclosure document");
      upcomingActions.push("**By Aug 2, 2026** — Complete AI system risk classification");
      upcomingActions.push("**By Aug 2, 2026** — Implement AI-generated content marking");
    }

    // Ongoing
    ongoingActions.push("Re-run Codepliant after adding or removing services");
    ongoingActions.push("Review and update all compliance documents at least annually");
    if (showGDPR) {
      ongoingActions.push("Respond to data subject requests within 30 days (GDPR Art. 12)");
    }
    if (showCCPA) {
      ongoingActions.push("Respond to consumer requests within 45 days (CCPA)");
    }
    if (hasPayment) {
      ongoingActions.push("Maintain PCI DSS compliance and complete annual assessment");
    }

    if (immediateActions.length > 0) {
      actionSection += `### Immediate (verify now)\n\n`;
      for (const action of immediateActions) {
        actionSection += `- [ ] ${action}\n`;
      }
      actionSection += `\n`;
    }

    if (upcomingActions.length > 0) {
      actionSection += `### Upcoming Deadlines\n\n`;
      for (const action of upcomingActions) {
        actionSection += `- [ ] ${action}\n`;
      }
      actionSection += `\n`;
    }

    actionSection += `### Ongoing\n\n`;
    for (const action of ongoingActions) {
      actionSection += `- [ ] ${action}\n`;
    }

    sections.push(actionSection);
  }

  // ── Review Schedule Recommendation ────────────────────────────────

  {
    let reviewSection = `\n## ${nextSection()}. Recommended Review Schedule\n\n`;
    reviewSection += `| Frequency | Activity |\n`;
    reviewSection += `|-----------|----------|\n`;
    reviewSection += `| Monthly | Review data breach and incident logs |\n`;
    reviewSection += `| Monthly | Verify consent mechanisms are operational |\n`;
    reviewSection += `| Quarterly | Re-run Codepliant to detect new services or dependencies |\n`;
    reviewSection += `| Quarterly | Review and update data processing agreements |\n`;
    reviewSection += `| Semi-annually | Conduct internal compliance audit |\n`;
    reviewSection += `| Annually | Full privacy policy review and update |\n`;
    reviewSection += `| Annually | Staff data protection training refresh |\n`;
    reviewSection += `| Annually | Review regulatory landscape for new obligations |\n`;

    if (hasPayment) {
      reviewSection += `| Annually | PCI DSS Self-Assessment Questionnaire |\n`;
    }

    if (hasAI) {
      reviewSection += `| Annually | AI system risk re-assessment |\n`;
      reviewSection += `| Annually | AI Disclosure document review and update |\n`;
    }

    reviewSection += `\n> **Tip:** Set calendar reminders for each review activity. Compliance drift is the most common cause of regulatory exposure.\n`;

    sections.push(reviewSection);
  }

  // ── Footer ────────────────────────────────────────────────────────

  sections.push(
    `\n---\n\n*This compliance timeline was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. It is for informational purposes only and does not constitute legal advice.*`
  );

  return sections.join("\n");
}
