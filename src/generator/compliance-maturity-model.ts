import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext, GeneratedDocument } from "./index.js";

/**
 * Generates COMPLIANCE_MATURITY_MODEL.md — a 5-level maturity assessment
 * (Initial -> Repeatable -> Defined -> Managed -> Optimizing) auto-assessed
 * from scan results and document completeness, with a roadmap to next level.
 */

interface MaturityDimension {
  name: string;
  currentLevel: number;
  evidence: string[];
  gaps: string[];
}

const MATURITY_LEVELS = [
  { level: 1, name: "Initial", emoji: "🔴", description: "Ad-hoc, reactive. No formal compliance processes." },
  { level: 2, name: "Repeatable", emoji: "🟠", description: "Basic processes established. Some documentation exists." },
  { level: 3, name: "Defined", emoji: "🟡", description: "Documented processes. Compliance is systematic." },
  { level: 4, name: "Managed", emoji: "🔵", description: "Measured and controlled. Metrics-driven compliance." },
  { level: 5, name: "Optimizing", emoji: "🟢", description: "Continuous improvement. Proactive compliance culture." },
];

function assessDimensions(
  scan: ScanResult,
  docCount: number,
  ctx?: GeneratorContext,
): MaturityDimension[] {
  const dimensions: MaturityDimension[] = [];
  const services = scan.services;
  const hasAuth = services.some((s) => s.category === "auth");
  const hasAnalytics = services.some((s) => s.category === "analytics");
  const hasAI = services.some((s) => s.category === "ai");
  const hasPayment = services.some((s) => s.category === "payment");
  const hasDatabase = services.some((s) => s.category === "database");
  const hasJurisdictions = ctx?.jurisdictions && ctx.jurisdictions.length > 0;
  const hasConfig = !!(ctx?.companyName && ctx.companyName !== "[Your Company Name]");

  // 1. Data Governance
  {
    let level = 1;
    const evidence: string[] = [];
    const gaps: string[] = [];

    if (services.length > 0) {
      level = 2;
      evidence.push("Third-party services identified and inventoried");
    }
    if (scan.dataCategories.length > 0) {
      level = Math.max(level, 2);
      evidence.push(`${scan.dataCategories.length} data categories classified`);
    }
    if (hasDatabase) {
      evidence.push("Database services detected — persistent data storage present");
    }
    if (docCount >= 10) {
      level = Math.max(level, 3);
      evidence.push("Comprehensive compliance documentation generated");
    }
    if (docCount >= 30) {
      level = Math.max(level, 4);
      evidence.push("Extensive documentation suite covers multiple compliance domains");
    }
    if (level < 3) gaps.push("Generate full compliance documentation suite");
    if (level < 4) gaps.push("Implement data classification and tagging across all storage");
    if (level < 5) gaps.push("Establish automated data lineage tracking and real-time monitoring");

    dimensions.push({ name: "Data Governance", currentLevel: level, evidence, gaps });
  }

  // 2. Privacy Program
  {
    let level = 1;
    const evidence: string[] = [];
    const gaps: string[] = [];

    if (hasConfig) {
      level = 2;
      evidence.push("Organization identified in compliance configuration");
    }
    if (ctx?.dpoName || ctx?.dpoEmail) {
      level = Math.max(level, 3);
      evidence.push("Data Protection Officer designated");
    }
    if (hasJurisdictions) {
      level = Math.max(level, 3);
      evidence.push(`Jurisdictions defined: ${ctx!.jurisdictions!.join(", ")}`);
    }
    if (docCount >= 20) {
      level = Math.max(level, 3);
      evidence.push("Privacy documentation is comprehensive");
    }
    if (ctx?.dpoName && hasJurisdictions && docCount >= 30) {
      level = Math.max(level, 4);
      evidence.push("Privacy program is structured and jurisdiction-aware");
    }

    if (level < 2) gaps.push("Configure organization details in .codepliantrc.json");
    if (level < 3) gaps.push("Appoint a Data Protection Officer and define jurisdictions");
    if (level < 4) gaps.push("Implement regular privacy impact assessments");
    if (level < 5) gaps.push("Establish privacy-by-design reviews for all new features");

    dimensions.push({ name: "Privacy Program", currentLevel: level, evidence, gaps });
  }

  // 3. Security Controls
  {
    let level = 1;
    const evidence: string[] = [];
    const gaps: string[] = [];

    if (hasAuth) {
      level = 2;
      evidence.push("Authentication service detected");
    }
    if (ctx?.securityEmail) {
      level = Math.max(level, 2);
      evidence.push("Security contact email configured");
    }
    if (ctx?.bugBountyUrl) {
      level = Math.max(level, 3);
      evidence.push("Bug bounty / responsible disclosure program in place");
    }
    if (hasAuth && hasDatabase) {
      level = Math.max(level, 3);
      evidence.push("Authentication and data storage controls present");
    }
    if (docCount >= 25 && ctx?.securityEmail) {
      level = Math.max(level, 4);
      evidence.push("Security documentation and contact channels established");
    }

    if (level < 2) gaps.push("Implement authentication and access controls");
    if (level < 3) gaps.push("Establish responsible disclosure policy and security contacts");
    if (level < 4) gaps.push("Implement continuous vulnerability scanning and penetration testing");
    if (level < 5) gaps.push("Achieve SOC 2 Type II or ISO 27001 certification");

    dimensions.push({ name: "Security Controls", currentLevel: level, evidence, gaps });
  }

  // 4. Vendor Management
  {
    let level = 1;
    const evidence: string[] = [];
    const gaps: string[] = [];

    const thirdPartyCount = services.filter((s) => s.isDataProcessor !== false).length;
    if (thirdPartyCount > 0) {
      level = 2;
      evidence.push(`${thirdPartyCount} third-party services identified`);
    }
    if (thirdPartyCount >= 3 && docCount >= 10) {
      level = Math.max(level, 3);
      evidence.push("Third-party risk documentation generated");
    }
    if (thirdPartyCount >= 5 && docCount >= 20) {
      level = Math.max(level, 3);
      evidence.push("Comprehensive vendor inventory with risk assessment");
    }

    if (level < 2) gaps.push("Identify and document all third-party data processors");
    if (level < 3) gaps.push("Execute DPAs with all third-party processors");
    if (level < 4) gaps.push("Implement vendor risk scoring and periodic reassessment");
    if (level < 5) gaps.push("Automate continuous vendor compliance monitoring");

    dimensions.push({ name: "Vendor Management", currentLevel: level, evidence, gaps });
  }

  // 5. Incident Response
  {
    let level = 1;
    const evidence: string[] = [];
    const gaps: string[] = [];

    if (docCount >= 5) {
      level = 2;
      evidence.push("Basic compliance documentation in place");
    }
    if (ctx?.securityEmail) {
      level = Math.max(level, 2);
      evidence.push("Security contact for incident reporting established");
    }
    if (docCount >= 15) {
      level = Math.max(level, 3);
      evidence.push("Incident response documentation generated");
    }

    if (level < 2) gaps.push("Create incident response plan with roles and escalation paths");
    if (level < 3) gaps.push("Establish breach notification templates per jurisdiction");
    if (level < 4) gaps.push("Conduct tabletop exercises and incident response drills");
    if (level < 5) gaps.push("Implement automated incident detection and response playbooks");

    dimensions.push({ name: "Incident Response", currentLevel: level, evidence, gaps });
  }

  // 6. AI Governance (only if AI services detected)
  if (hasAI) {
    let level = 1;
    const evidence: string[] = [];
    const gaps: string[] = [];

    evidence.push("AI services detected in codebase");
    level = 2;

    if (ctx?.aiRiskLevel) {
      level = Math.max(level, 3);
      evidence.push(`AI risk level assessed: ${ctx.aiRiskLevel}`);
    }
    if (ctx?.aiUsageDescription) {
      level = Math.max(level, 3);
      evidence.push("AI usage description documented");
    }
    if (docCount >= 25) {
      level = Math.max(level, 3);
      evidence.push("AI governance documentation generated");
    }

    if (level < 3) gaps.push("Define AI risk level and document AI usage purpose");
    if (level < 4) gaps.push("Implement AI model cards and bias monitoring");
    if (level < 5) gaps.push("Establish continuous AI audit and human oversight framework");

    dimensions.push({ name: "AI Governance", currentLevel: level, evidence, gaps });
  }

  return dimensions;
}

function overallLevel(dimensions: MaturityDimension[]): number {
  if (dimensions.length === 0) return 1;
  // Overall level = floor of the average, but never higher than the minimum + 1
  const avg = dimensions.reduce((sum, d) => sum + d.currentLevel, 0) / dimensions.length;
  const min = Math.min(...dimensions.map((d) => d.currentLevel));
  return Math.min(Math.floor(avg), min + 1);
}

export function generateComplianceMaturityModel(
  scan: ScanResult,
  ctx?: GeneratorContext,
  docs?: GeneratedDocument[],
): string | null {
  if (scan.services.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];
  const nextReview = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const docCount = docs ? docs.length : 0;

  const dimensions = assessDimensions(scan, docCount, ctx);
  const overall = overallLevel(dimensions);
  const overallInfo = MATURITY_LEVELS[overall - 1];
  const nextLevel = overall < 5 ? MATURITY_LEVELS[overall] : null;

  const lines: string[] = [];

  // Header
  lines.push("# Compliance Maturity Model");
  lines.push("");
  lines.push(`> **Document Version:** 1.0`);
  lines.push(`> **Document Owner:** ${company}`);
  lines.push(`> **Generated:** ${date} by [Codepliant](https://github.com/joechensmartz/codepliant)`);
  lines.push(`> **Next Review Date:** ${nextReview}`);
  lines.push("");
  lines.push("This document assesses your organization's compliance maturity across key dimensions");
  lines.push("and provides a roadmap for improvement.");
  lines.push("");

  // Overall assessment
  lines.push("## Overall Maturity Assessment");
  lines.push("");
  lines.push(`**Current Level: ${overallInfo.emoji} Level ${overall} — ${overallInfo.name}**`);
  lines.push("");
  lines.push(`> ${overallInfo.description}`);
  lines.push("");

  // Visual progress bar
  lines.push("### Maturity Scale");
  lines.push("");
  for (const ml of MATURITY_LEVELS) {
    const indicator = ml.level === overall ? " **<-- YOU ARE HERE**" : "";
    const filled = ml.level <= overall;
    lines.push(`${filled ? ml.emoji : "⬜"} **Level ${ml.level}: ${ml.name}** — ${ml.description}${indicator}`);
  }
  lines.push("");

  // Dimension-by-dimension assessment
  lines.push("## Dimension Assessment");
  lines.push("");
  lines.push("| Dimension | Current Level | Status |");
  lines.push("|-----------|--------------|--------|");
  for (const dim of dimensions) {
    const info = MATURITY_LEVELS[dim.currentLevel - 1];
    lines.push(`| ${dim.name} | ${info.emoji} Level ${dim.currentLevel} — ${info.name} | ${dim.evidence[0] || "—"} |`);
  }
  lines.push("");

  // Detailed dimension analysis
  lines.push("## Detailed Analysis");
  lines.push("");

  for (const dim of dimensions) {
    const info = MATURITY_LEVELS[dim.currentLevel - 1];
    lines.push(`### ${dim.name} — ${info.emoji} Level ${dim.currentLevel} (${info.name})`);
    lines.push("");

    if (dim.evidence.length > 0) {
      lines.push("**Evidence:**");
      lines.push("");
      for (const ev of dim.evidence) {
        lines.push(`- ${ev}`);
      }
      lines.push("");
    }

    if (dim.gaps.length > 0) {
      lines.push("**Gaps to Address:**");
      lines.push("");
      for (const gap of dim.gaps) {
        lines.push(`- [ ] ${gap}`);
      }
      lines.push("");
    }
  }

  // Roadmap to next level
  if (nextLevel) {
    lines.push("## Roadmap to Next Level");
    lines.push("");
    lines.push(`**Target: ${nextLevel.emoji} Level ${nextLevel.level} — ${nextLevel.name}**`);
    lines.push("");
    lines.push(`> ${nextLevel.description}`);
    lines.push("");

    lines.push("### Priority Actions");
    lines.push("");

    // Collect all gaps from dimensions that are below the target level
    let actionNum = 0;
    const phases: { phase: string; actions: string[] }[] = [
      { phase: "Phase 1: Quick Wins (0–30 days)", actions: [] },
      { phase: "Phase 2: Foundation (30–90 days)", actions: [] },
      { phase: "Phase 3: Maturation (90–180 days)", actions: [] },
    ];

    for (const dim of dimensions) {
      if (dim.currentLevel < nextLevel.level && dim.gaps.length > 0) {
        // First gap goes to phase 1, second to phase 2, rest to phase 3
        dim.gaps.forEach((gap, i) => {
          const phaseIdx = Math.min(i, 2);
          phases[phaseIdx].actions.push(`[${dim.name}] ${gap}`);
        });
      }
    }

    for (const phase of phases) {
      if (phase.actions.length > 0) {
        lines.push(`#### ${phase.phase}`);
        lines.push("");
        for (const action of phase.actions) {
          actionNum++;
          lines.push(`${actionNum}. ${action}`);
        }
        lines.push("");
      }
    }

    // Success criteria
    lines.push("### Success Criteria for Level " + nextLevel.level);
    lines.push("");
    switch (nextLevel.level) {
      case 2:
        lines.push("- [ ] All third-party services identified and documented");
        lines.push("- [ ] Basic privacy and security policies generated");
        lines.push("- [ ] Organization details configured in codepliant");
        break;
      case 3:
        lines.push("- [ ] DPO appointed and jurisdictions defined");
        lines.push("- [ ] Comprehensive documentation suite (20+ documents)");
        lines.push("- [ ] DPAs executed with all third-party processors");
        lines.push("- [ ] Incident response plan tested");
        break;
      case 4:
        lines.push("- [ ] Compliance metrics tracked and reported quarterly");
        lines.push("- [ ] Vendor risk scores maintained and reviewed");
        lines.push("- [ ] Regular privacy impact assessments conducted");
        lines.push("- [ ] SOC 2 or ISO 27001 certification initiated");
        break;
      case 5:
        lines.push("- [ ] Continuous compliance monitoring automated");
        lines.push("- [ ] Privacy-by-design integrated into development workflow");
        lines.push("- [ ] Annual compliance audit with external assessor");
        lines.push("- [ ] Industry-leading compliance practices documented");
        break;
    }
    lines.push("");
  } else {
    lines.push("## Continuous Improvement");
    lines.push("");
    lines.push("Congratulations — your organization has achieved the highest maturity level!");
    lines.push("Focus on maintaining this level through:");
    lines.push("");
    lines.push("- Regular compliance audits (at least annually)");
    lines.push("- Continuous monitoring and automation improvements");
    lines.push("- Industry benchmarking and thought leadership");
    lines.push("- Proactive adaptation to new regulatory requirements");
    lines.push("");
  }

  // Disclaimer
  lines.push("---");
  lines.push("");
  lines.push(
    "*This maturity assessment is generated from automated code analysis and configuration review. It provides an indicative assessment and should be validated through formal compliance audits. This does not constitute legal advice.*",
  );
  lines.push("");

  return lines.join("\n");
}
