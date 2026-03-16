import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates COMPLIANCE_MATURITY_ASSESSMENT.md — a detailed 50-question
 * self-assessment questionnaire across governance, privacy, security,
 * vendor management, AI, and incident response domains.
 *
 * Each question is scored 1–5, with a total maturity score calculated.
 * Questions are auto-pre-filled based on scan results where possible.
 */

interface Question {
  id: string;
  text: string;
  autoScore: number | null;
  autoJustification: string | null;
}

interface Section {
  name: string;
  description: string;
  questions: Question[];
}

function computeAutoScore(
  scan: ScanResult,
  questionId: string,
): { score: number; justification: string } | null {
  const serviceCount = scan.services.length;
  const hasAuth = scan.services.some((s) => s.category === "auth");
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasMonitoring = scan.services.some((s) => s.category === "monitoring");
  const hasDatabase = scan.services.some((s) => s.category === "database");
  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasAnalytics = scan.services.some((s) => s.category === "analytics");
  const hasStorage = scan.services.some((s) => s.category === "storage");
  const categories = new Set(scan.services.map((s) => s.category));

  switch (questionId) {
    // Governance
    case "GOV-01":
      return serviceCount > 0
        ? { score: 3, justification: "Compliance documentation generated via automated scanning" }
        : null;
    case "GOV-02":
      return { score: 3, justification: "Automated compliance scanning provides baseline policy framework" };
    case "GOV-04":
      return serviceCount > 5
        ? { score: 3, justification: `${serviceCount} services detected — compliance scope is well-defined` }
        : serviceCount > 0
          ? { score: 2, justification: `${serviceCount} service(s) detected — limited compliance scope` }
          : null;
    case "GOV-07":
      return { score: 2, justification: "Automated compliance document generation provides baseline documentation" };

    // Privacy
    case "PRI-01":
      return serviceCount > 0
        ? { score: 4, justification: "Privacy policy auto-generated from code analysis" }
        : null;
    case "PRI-02":
      return serviceCount > 0
        ? { score: 3, justification: "Data flow map generated from detected services" }
        : null;
    case "PRI-03":
      return serviceCount > 0
        ? { score: 3, justification: "DSAR handling guide generated" }
        : null;
    case "PRI-04":
      return hasAnalytics
        ? { score: 3, justification: "Consent management guide generated for detected analytics services" }
        : { score: 2, justification: "No analytics/tracking detected — consent management may still be needed" };
    case "PRI-06":
      return serviceCount > 0
        ? { score: 3, justification: "Data retention policy auto-generated" }
        : null;
    case "PRI-08":
      return serviceCount > 0
        ? { score: 3, justification: "Record of processing activities generated (GDPR Art. 30)" }
        : null;

    // Security
    case "SEC-01":
      return hasAuth
        ? { score: 4, justification: `Authentication service detected: ${scan.services.filter((s) => s.category === "auth").map((s) => s.name).join(", ")}` }
        : { score: 1, justification: "No authentication service detected" };
    case "SEC-02":
      return hasMonitoring
        ? { score: 3, justification: `Monitoring detected: ${scan.services.filter((s) => s.category === "monitoring").map((s) => s.name).join(", ")}` }
        : { score: 1, justification: "No monitoring service detected" };
    case "SEC-04":
      return { score: 3, justification: "Vulnerability scanning included in compliance toolchain" };
    case "SEC-06":
      return hasDatabase
        ? { score: 2, justification: `Database service detected (${scan.services.filter((s) => s.category === "database").map((s) => s.name).join(", ")}) — encryption at rest needs manual verification` }
        : null;

    // Vendor
    case "VEN-01":
      return serviceCount > 3
        ? { score: 3, justification: `${serviceCount} third-party services detected and inventoried` }
        : serviceCount > 0
          ? { score: 2, justification: `${serviceCount} third-party service(s) detected` }
          : null;
    case "VEN-02":
      return serviceCount > 0
        ? { score: 3, justification: "Sub-processor list auto-generated from code analysis" }
        : null;
    case "VEN-04":
      return serviceCount > 3
        ? { score: 3, justification: "Third-party risk assessment generated" }
        : null;

    // AI
    case "AI-01":
      return hasAI
        ? { score: 3, justification: `AI services detected: ${scan.services.filter((s) => s.category === "ai").map((s) => s.name).join(", ")}` }
        : { score: 5, justification: "No AI services detected — N/A" };
    case "AI-02":
      return hasAI
        ? { score: 3, justification: "AI disclosure document generated" }
        : { score: 5, justification: "No AI services detected — N/A" };
    case "AI-05":
      return hasAI
        ? { score: 3, justification: "AI governance framework generated" }
        : { score: 5, justification: "No AI services detected — N/A" };

    // Incident
    case "INC-01":
      return { score: 3, justification: "Incident response plan auto-generated" };
    case "INC-02":
      return { score: 3, justification: "Data breach notification templates generated per jurisdiction" };
    case "INC-04":
      return { score: 3, justification: "Incident severity matrix generated (P0-P4)" };

    default:
      return null;
  }
}

function buildSections(scan: ScanResult): Section[] {
  return [
    {
      name: "Governance & Leadership",
      description: "Organizational commitment to compliance, executive sponsorship, and program management.",
      questions: [
        { id: "GOV-01", text: "Is there a formal compliance program with executive sponsorship?" },
        { id: "GOV-02", text: "Are compliance policies documented, approved, and distributed to all staff?" },
        { id: "GOV-03", text: "Is there a dedicated compliance officer or team?" },
        { id: "GOV-04", text: "Is the scope of compliance obligations clearly defined?" },
        { id: "GOV-05", text: "Are compliance roles and responsibilities assigned across the organization?" },
        { id: "GOV-06", text: "Is compliance training provided to all employees at least annually?" },
        { id: "GOV-07", text: "Are compliance policies reviewed and updated at least annually?" },
        { id: "GOV-08", text: "Is there a compliance committee or steering group that meets regularly?" },
        { id: "GOV-09", text: "Are compliance metrics reported to the board or senior leadership?" },
      ],
    },
    {
      name: "Privacy & Data Protection",
      description: "Data privacy program maturity, GDPR/CCPA readiness, and data subject rights handling.",
      questions: [
        { id: "PRI-01", text: "Is there a comprehensive, up-to-date privacy policy?" },
        { id: "PRI-02", text: "Is there a complete data inventory/flow map of all personal data processing?" },
        { id: "PRI-03", text: "Is there a documented process for handling data subject access requests (DSARs)?" },
        { id: "PRI-04", text: "Is consent obtained and recorded for all data processing requiring it?" },
        { id: "PRI-05", text: "Are data protection impact assessments (DPIAs) conducted for high-risk processing?" },
        { id: "PRI-06", text: "Is there a documented data retention policy with defined retention periods?" },
        { id: "PRI-07", text: "Is there a lawful basis assessment for each data processing activity?" },
        { id: "PRI-08", text: "Is a Record of Processing Activities (ROPA) maintained and current?" },
        { id: "PRI-09", text: "Are cross-border data transfers assessed and safeguarded (e.g., SCCs, adequacy decisions)?" },
      ],
    },
    {
      name: "Information Security",
      description: "Technical and organizational security controls, vulnerability management, and access control.",
      questions: [
        { id: "SEC-01", text: "Is authentication required for all system access, with MFA for privileged accounts?" },
        { id: "SEC-02", text: "Is there continuous security monitoring and alerting in place?" },
        { id: "SEC-03", text: "Is there a documented access control policy with role-based access?" },
        { id: "SEC-04", text: "Are regular vulnerability scans and penetration tests conducted?" },
        { id: "SEC-05", text: "Is there a secure software development lifecycle (SDLC) with code review?" },
        { id: "SEC-06", text: "Is data encrypted at rest and in transit?" },
        { id: "SEC-07", text: "Are security patches applied within defined SLAs?" },
        { id: "SEC-08", text: "Is there network segmentation between production and development environments?" },
        { id: "SEC-09", text: "Are audit logs maintained, protected from tampering, and reviewed regularly?" },
      ],
    },
    {
      name: "Vendor & Third-Party Risk",
      description: "Third-party risk management, vendor due diligence, and sub-processor oversight.",
      questions: [
        { id: "VEN-01", text: "Is there a complete inventory of all third-party services and sub-processors?" },
        { id: "VEN-02", text: "Are Data Processing Agreements (DPAs) in place with all sub-processors?" },
        { id: "VEN-03", text: "Is vendor due diligence performed before onboarding new services?" },
        { id: "VEN-04", text: "Are third-party risk assessments conducted and documented?" },
        { id: "VEN-05", text: "Is there a vendor exit strategy for critical third-party dependencies?" },
        { id: "VEN-06", text: "Are sub-processor changes communicated to affected data subjects?" },
        { id: "VEN-07", text: "Are vendor SLAs monitored and reviewed at least annually?" },
        { id: "VEN-08", text: "Is there a process for revoking vendor access upon contract termination?" },
      ],
    },
    {
      name: "AI Governance & Ethics",
      description: "AI risk management, transparency, fairness, and compliance with AI regulations (EU AI Act, etc.).",
      questions: [
        { id: "AI-01", text: "Is there an inventory of all AI/ML systems with risk classifications?" },
        { id: "AI-02", text: "Is AI usage disclosed to end users with clear explanations?" },
        { id: "AI-03", text: "Are AI outputs monitored for bias, accuracy, and safety?" },
        { id: "AI-04", text: "Is there a process for users to opt out of AI-driven decisions?" },
        { id: "AI-05", text: "Is there an AI governance framework aligned with regulations (EU AI Act, NIST AI RMF)?" },
        { id: "AI-06", text: "Are AI model cards or system documentation maintained?" },
        { id: "AI-07", text: "Is human oversight provided for high-risk AI decisions?" },
        { id: "AI-08", text: "Are AI training data sources documented and assessed for legality?" },
      ],
    },
    {
      name: "Incident Response & Business Continuity",
      description: "Incident detection, response, communication, and recovery capabilities.",
      questions: [
        { id: "INC-01", text: "Is there a documented and tested incident response plan?" },
        { id: "INC-02", text: "Are breach notification templates prepared per applicable jurisdiction?" },
        { id: "INC-03", text: "Is there a dedicated incident response team with clear escalation paths?" },
        { id: "INC-04", text: "Is there an incident severity classification system?" },
        { id: "INC-05", text: "Are post-incident reviews conducted with lessons learned?" },
        { id: "INC-06", text: "Is there a business continuity plan with defined RTO/RPO?" },
        { id: "INC-07", text: "Are disaster recovery procedures tested at least annually?" },
      ],
    },
  ].map((section) => ({
    ...section,
    questions: section.questions.map((q) => {
      const auto = computeAutoScore(scan, q.id);
      return {
        ...q,
        autoScore: auto?.score ?? null,
        autoJustification: auto?.justification ?? null,
      };
    }),
  }));
}

function maturityLabel(score: number): string {
  if (score >= 4.5) return "Optimized (Level 5)";
  if (score >= 3.5) return "Managed (Level 4)";
  if (score >= 2.5) return "Defined (Level 3)";
  if (score >= 1.5) return "Developing (Level 2)";
  return "Initial (Level 1)";
}

function renderScoreBar(score: number): string {
  const filled = Math.round(score);
  return "[" + "█".repeat(filled) + "░".repeat(5 - filled) + "]";
}

export function generateComplianceMaturityAssessment(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];
  const sections = buildSections(scan);

  const lines: string[] = [];

  // Header
  lines.push("# Compliance Maturity Assessment");
  lines.push("");
  lines.push(`**Organization:** ${company}`);
  lines.push("");
  lines.push(`**Assessment Date:** ${date}`);
  lines.push("");
  lines.push(`**Assessor:** [NAME / TITLE]`);
  lines.push("");
  lines.push(
    "This self-assessment questionnaire evaluates compliance program maturity across six domains. " +
    "Each question is scored on a 1–5 scale. Questions marked `[AUTO]` have been pre-filled based on " +
    "automated code analysis. Review and adjust all scores before finalizing."
  );
  lines.push("");

  // Scoring guide
  lines.push("## Scoring Guide");
  lines.push("");
  lines.push("| Score | Level | Description |");
  lines.push("|-------|-------|-------------|");
  lines.push("| 1 | Initial | Ad-hoc, no formal process |");
  lines.push("| 2 | Developing | Basic processes exist but inconsistently applied |");
  lines.push("| 3 | Defined | Documented processes, consistently followed |");
  lines.push("| 4 | Managed | Measured, monitored, and continuously improved |");
  lines.push("| 5 | Optimized | Industry-leading, fully automated and integrated |");
  lines.push("");

  // Summary dashboard
  lines.push("## Maturity Summary");
  lines.push("");

  let totalAutoScore = 0;
  let totalAutoCount = 0;
  let totalQuestions = 0;

  const sectionSummaries: { name: string; avg: number; autoCount: number; total: number }[] = [];

  for (const section of sections) {
    let sectionTotal = 0;
    let sectionCount = 0;
    for (const q of section.questions) {
      totalQuestions++;
      if (q.autoScore !== null) {
        sectionTotal += q.autoScore;
        sectionCount++;
        totalAutoScore += q.autoScore;
        totalAutoCount++;
      }
    }
    sectionSummaries.push({
      name: section.name,
      avg: sectionCount > 0 ? sectionTotal / sectionCount : 0,
      autoCount: sectionCount,
      total: section.questions.length,
    });
  }

  const overallAvg = totalAutoCount > 0 ? totalAutoScore / totalAutoCount : 0;

  lines.push("| Domain | Auto-Score | Questions Assessed | Maturity Level |");
  lines.push("|--------|-----------|-------------------|----------------|");
  for (const s of sectionSummaries) {
    const avgStr = s.autoCount > 0 ? s.avg.toFixed(1) : "—";
    const bar = s.autoCount > 0 ? ` ${renderScoreBar(s.avg)}` : "";
    const level = s.autoCount > 0 ? maturityLabel(s.avg) : "Not assessed";
    lines.push(`| ${s.name} | ${avgStr}/5.0${bar} | ${s.autoCount}/${s.total} | ${level} |`);
  }
  lines.push("");
  lines.push(`**Overall Maturity Score:** ${overallAvg.toFixed(1)}/5.0 — **${maturityLabel(overallAvg)}**`);
  lines.push("");
  lines.push(`**Questions Auto-Assessed:** ${totalAutoCount}/${totalQuestions} (${Math.round((totalAutoCount / totalQuestions) * 100)}%)`);
  lines.push("");
  lines.push(`**Questions Requiring Manual Assessment:** ${totalQuestions - totalAutoCount}`);
  lines.push("");

  // Maximum possible score
  const maxScore = totalQuestions * 5;
  const currentScore = totalAutoScore + (totalQuestions - totalAutoCount) * 0; // unassessed = 0
  lines.push(`**Maximum Possible Score:** ${maxScore} (${totalQuestions} questions × 5 points)`);
  lines.push("");

  // Sections with questions
  for (const section of sections) {
    lines.push(`## ${section.name}`);
    lines.push("");
    lines.push(`> ${section.description}`);
    lines.push("");
    lines.push("| # | Question | Score (1-5) | Justification |");
    lines.push("|---|----------|------------|---------------|");

    for (const q of section.questions) {
      const scoreStr = q.autoScore !== null ? `[AUTO] ${q.autoScore}` : "[ ] ___";
      const justStr = q.autoJustification !== null ? `[AUTO] ${q.autoJustification}` : "[MANUAL] |";
      lines.push(`| ${q.id} | ${q.text} | ${scoreStr} | ${justStr} |`);
    }
    lines.push("");
  }

  // Action plan
  lines.push("## Improvement Action Plan");
  lines.push("");
  lines.push("Based on the assessment results, prioritize the following areas:");
  lines.push("");
  lines.push("| Priority | Domain | Current | Target | Action Required | Owner | Deadline |");
  lines.push("|----------|--------|---------|--------|----------------|-------|----------|");

  const sorted = [...sectionSummaries]
    .filter((s) => s.autoCount > 0)
    .sort((a, b) => a.avg - b.avg);

  let priority = 1;
  for (const s of sorted) {
    if (s.avg < 4) {
      const target = Math.min(s.avg + 1, 5).toFixed(1);
      lines.push(
        `| ${priority} | ${s.name} | ${s.avg.toFixed(1)} | ${target} | [DESCRIBE ACTIONS] | [OWNER] | [DATE] |`
      );
      priority++;
    }
  }

  if (priority === 1) {
    lines.push("| — | All domains meet or exceed target maturity | — | — | Continue monitoring | — | — |");
  }

  lines.push("");

  // Sign-off
  lines.push("## Assessment Sign-Off");
  lines.push("");
  lines.push("| Role | Name | Signature | Date |");
  lines.push("|------|------|-----------|------|");
  lines.push("| Assessor | [NAME] | _______________ | [DATE] |");
  lines.push("| Compliance Officer | [NAME] | _______________ | [DATE] |");
  lines.push("| Executive Sponsor | [NAME] | _______________ | [DATE] |");
  lines.push("");

  // Next review
  lines.push("## Next Assessment");
  lines.push("");
  const nextDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  lines.push(`Recommended next assessment date: **${nextDate}** (quarterly cadence).`);
  lines.push("");

  // Disclaimer
  lines.push("---");
  lines.push("");
  lines.push(
    `*This compliance maturity assessment was generated by [Codepliant](https://github.com/joechensmartz/codepliant) ` +
    `based on an automated scan of the **${scan.projectName}** codebase. ` +
    `Auto-scored questions should be verified by your compliance team. ` +
    `This assessment does not constitute legal advice or formal certification.*`
  );
  lines.push("");

  return lines.join("\n");
}
