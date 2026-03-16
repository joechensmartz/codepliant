import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates COMPLIANCE_SCORECARD.md — A visual ASCII scorecard with
 * letter grades per compliance area and an overall trend arrow.
 *
 * Covers:
 * - Privacy compliance grade
 * - Security posture grade
 * - AI governance grade (when AI services detected)
 * - Vendor management grade
 * - Documentation completeness grade
 * - Overall trend indicator (↑↓→)
 *
 * Grades are computed from scan results and configuration completeness.
 */

interface AreaScore {
  area: string;
  score: number; // 0-100
  grade: string; // A, B, C, D, F
  factors: string[];
}

function scoreToGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function gradeBar(grade: string): string {
  const bars: Record<string, string> = {
    A: "████████████████████",
    B: "████████████████░░░░",
    C: "████████████░░░░░░░░",
    D: "████████░░░░░░░░░░░░",
    F: "████░░░░░░░░░░░░░░░░",
  };
  return bars[grade] || bars["F"];
}

function assessPrivacy(
  scan: ScanResult,
  ctx: GeneratorContext | undefined,
): AreaScore {
  let score = 40; // base score if services detected
  const factors: string[] = [];

  if (scan.services.length === 0) {
    return { area: "Privacy", score: 0, grade: "F", factors: ["No services detected"] };
  }

  // Company name set
  if (ctx?.companyName && ctx.companyName !== "[Your Company Name]") {
    score += 10;
    factors.push("Company name configured");
  } else {
    factors.push("Company name not set (-10)");
  }

  // Contact email set
  if (ctx?.contactEmail && ctx.contactEmail !== "[your-email@example.com]") {
    score += 10;
    factors.push("Contact email configured");
  } else {
    factors.push("Contact email not set (-10)");
  }

  // DPO appointed
  if (ctx?.dpoEmail) {
    score += 15;
    factors.push("DPO email configured");
  } else {
    factors.push("DPO email not set (-15)");
  }

  // Jurisdictions defined
  if (ctx?.jurisdictions && ctx.jurisdictions.length > 0) {
    score += 10;
    factors.push(`${ctx.jurisdictions.length} jurisdiction(s) defined`);
  } else {
    factors.push("No jurisdictions defined (-10)");
  }

  // Data retention configured
  if (ctx?.dataRetentionDays && ctx.dataRetentionDays > 0) {
    score += 10;
    factors.push("Data retention period set");
  } else {
    factors.push("Data retention period not set (-10)");
  }

  // Toll-free number (CCPA)
  if (ctx?.tollFreeNumber) {
    score += 5;
    factors.push("Toll-free number configured");
  }

  score = Math.min(100, Math.max(0, score));
  return { area: "Privacy", score, grade: scoreToGrade(score), factors };
}

function assessSecurity(
  scan: ScanResult,
  ctx: GeneratorContext | undefined,
): AreaScore {
  let score = 35;
  const factors: string[] = [];

  if (scan.services.length === 0) {
    return { area: "Security", score: 0, grade: "F", factors: ["No services detected"] };
  }

  // Security email configured
  if (ctx?.securityEmail) {
    score += 15;
    factors.push("Security contact configured");
  } else {
    factors.push("Security contact not set (-15)");
  }

  // Bug bounty URL
  if (ctx?.bugBountyUrl) {
    score += 10;
    factors.push("Bug bounty URL configured");
  } else {
    factors.push("Bug bounty URL not set (-10)");
  }

  // Auth services detected (positive indicator)
  const hasAuth = scan.services.some((s) => s.category === "auth");
  if (hasAuth) {
    score += 15;
    factors.push("Authentication service detected");
  } else {
    factors.push("No authentication service detected (-15)");
  }

  // Monitoring/error tracking
  const hasMonitoring = scan.services.some(
    (s) => s.category === "other" && (s.name.includes("sentry") || s.name.includes("datadog") || s.name.includes("newrelic")),
  );
  if (hasMonitoring) {
    score += 10;
    factors.push("Monitoring/logging service detected");
  } else {
    factors.push("No monitoring service detected (-10)");
  }

  // Multiple services increases attack surface
  if (scan.services.length > 10) {
    score -= 5;
    factors.push("Large service footprint (>10 services, -5)");
  } else if (scan.services.length >= 5) {
    score += 5;
    factors.push("Moderate service footprint");
  } else {
    score += 10;
    factors.push("Small service footprint (+10)");
  }

  score = Math.min(100, Math.max(0, score));
  return { area: "Security", score, grade: scoreToGrade(score), factors };
}

function assessAI(
  scan: ScanResult,
  ctx: GeneratorContext | undefined,
): AreaScore | null {
  const aiServices = scan.services.filter((s) => s.category === "ai");
  if (aiServices.length === 0) return null;

  let score = 30;
  const factors: string[] = [];

  // AI risk level classified
  if (ctx?.aiRiskLevel) {
    score += 20;
    factors.push(`AI risk level classified: ${ctx.aiRiskLevel}`);
  } else {
    factors.push("AI risk level not classified (-20)");
  }

  // AI usage described
  if (ctx?.aiUsageDescription) {
    score += 20;
    factors.push("AI usage description provided");
  } else {
    factors.push("AI usage description not provided (-20)");
  }

  // Multiple AI providers (shows diversification)
  if (aiServices.length >= 2) {
    score += 10;
    factors.push(`${aiServices.length} AI services (diversified)`);
  } else {
    score += 15;
    factors.push("Single AI provider (simpler governance)");
  }

  // Company name for disclosures
  if (ctx?.companyName && ctx.companyName !== "[Your Company Name]") {
    score += 5;
    factors.push("Company identity configured for AI disclosures");
  }

  score = Math.min(100, Math.max(0, score));
  return { area: "AI Governance", score, grade: scoreToGrade(score), factors };
}

function assessVendor(
  scan: ScanResult,
  ctx: GeneratorContext | undefined,
): AreaScore {
  const thirdParty = scan.services.filter((s) => s.isDataProcessor !== false);
  let score = 40;
  const factors: string[] = [];

  if (thirdParty.length === 0) {
    return { area: "Vendor Management", score: 90, grade: "A", factors: ["No third-party vendors detected"] };
  }

  // Vendor count manageable
  if (thirdParty.length <= 5) {
    score += 20;
    factors.push(`${thirdParty.length} vendors (manageable)`);
  } else if (thirdParty.length <= 10) {
    score += 10;
    factors.push(`${thirdParty.length} vendors (moderate)`);
  } else {
    factors.push(`${thirdParty.length} vendors (high complexity, -0)`);
  }

  // EU representative for cross-border
  if (ctx?.euRepresentative) {
    score += 10;
    factors.push("EU representative configured");
  }

  // DPO for vendor oversight
  if (ctx?.dpoEmail) {
    score += 10;
    factors.push("DPO available for vendor oversight");
  } else {
    factors.push("No DPO for vendor oversight (-10)");
  }

  // Jurisdictions help with transfer assessments
  if (ctx?.jurisdictions && ctx.jurisdictions.length > 0) {
    score += 10;
    factors.push("Jurisdictions defined for transfer assessments");
  }

  score = Math.min(100, Math.max(0, score));
  return { area: "Vendor Management", score, grade: scoreToGrade(score), factors };
}

function assessDocumentation(
  scan: ScanResult,
  ctx: GeneratorContext | undefined,
): AreaScore {
  let score = 50; // base score: docs will be generated
  const factors: string[] = [];

  if (scan.services.length === 0) {
    return { area: "Documentation", score: 20, grade: "F", factors: ["No services detected; limited docs generated"] };
  }

  // Company name personalizes docs
  if (ctx?.companyName && ctx.companyName !== "[Your Company Name]") {
    score += 15;
    factors.push("Documents personalized with company name");
  } else {
    factors.push("Documents use placeholder company name (-15)");
  }

  // Language configured
  if (ctx?.language) {
    score += 5;
    factors.push(`Language configured: ${ctx.language}`);
  }

  // More services = more docs generated
  if (scan.services.length >= 5) {
    score += 15;
    factors.push("Rich service profile generates comprehensive docs");
  } else if (scan.services.length >= 3) {
    score += 10;
    factors.push("Moderate service profile");
  } else {
    score += 5;
    factors.push("Limited service profile");
  }

  // Website configured for doc links
  if (ctx?.website) {
    score += 5;
    factors.push("Website configured for document references");
  }

  score = Math.min(100, Math.max(0, score));
  return { area: "Documentation", score, grade: scoreToGrade(score), factors };
}

function computeTrend(areas: AreaScore[]): string {
  const avgScore = areas.reduce((sum, a) => sum + a.score, 0) / areas.length;
  // Trend based on overall health
  if (avgScore >= 80) return "\u2191"; // ↑
  if (avgScore >= 60) return "\u2192"; // →
  return "\u2193"; // ↓
}

export function generateComplianceScorecardVisual(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];

  const areas: AreaScore[] = [];
  areas.push(assessPrivacy(scan, ctx));
  areas.push(assessSecurity(scan, ctx));

  const aiScore = assessAI(scan, ctx);
  if (aiScore) areas.push(aiScore);

  areas.push(assessVendor(scan, ctx));
  areas.push(assessDocumentation(scan, ctx));

  const trend = computeTrend(areas);
  const avgScore = Math.round(areas.reduce((sum, a) => sum + a.score, 0) / areas.length);
  const overallGrade = scoreToGrade(avgScore);

  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────

  lines.push(`# Compliance Scorecard`);
  lines.push(``);
  lines.push(`**Organisation:** ${company}`);
  lines.push(`**Project:** ${scan.projectName}`);
  lines.push(`**Generated:** ${date}`);
  lines.push(`**Services Scanned:** ${scan.services.length}`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);

  // ── Overall Grade Box ───────────────────────────────────────────────

  lines.push(`## Overall Compliance Grade`);
  lines.push(``);
  lines.push("```");
  lines.push(`  ╔═══════════════════════════════╗`);
  lines.push(`  ║                               ║`);
  lines.push(`  ║        OVERALL GRADE           ║`);
  lines.push(`  ║                               ║`);
  lines.push(`  ║            [ ${overallGrade} ]             ║`);
  lines.push(`  ║          ${avgScore}% ${trend}              ║`);
  lines.push(`  ║                               ║`);
  lines.push(`  ╚═══════════════════════════════╝`);
  lines.push("```");
  lines.push(``);

  // ── Per-Area Summary ────────────────────────────────────────────────

  lines.push(`## Area Scores`);
  lines.push(``);
  lines.push("```");
  for (const area of areas) {
    const label = area.area.padEnd(20);
    lines.push(`  ${label}  ${area.grade}  ${gradeBar(area.grade)}  ${area.score}%`);
  }
  lines.push("```");
  lines.push(``);

  // ── Summary Table ───────────────────────────────────────────────────

  lines.push(`## Score Summary`);
  lines.push(``);
  lines.push(`| Area | Grade | Score | Trend |`);
  lines.push(`|------|-------|-------|-------|`);
  for (const area of areas) {
    lines.push(`| ${area.area} | **${area.grade}** | ${area.score}% | ${trend} |`);
  }
  lines.push(`| **Overall** | **${overallGrade}** | **${avgScore}%** | **${trend}** |`);
  lines.push(``);

  // ── Trend Legend ────────────────────────────────────────────────────

  lines.push(`### Trend Indicators`);
  lines.push(``);
  lines.push(`- \u2191 Improving (score >= 80%)`);
  lines.push(`- \u2192 Stable (score 60-79%)`);
  lines.push(`- \u2193 Needs Attention (score < 60%)`);
  lines.push(``);

  // ── Grade Scale ─────────────────────────────────────────────────────

  lines.push(`### Grade Scale`);
  lines.push(``);
  lines.push(`| Grade | Range | Description |`);
  lines.push(`|-------|-------|-------------|`);
  lines.push(`| A | 90-100% | Excellent — meets or exceeds all requirements |`);
  lines.push(`| B | 80-89% | Good — minor improvements needed |`);
  lines.push(`| C | 70-79% | Fair — several areas need attention |`);
  lines.push(`| D | 60-69% | Poor — significant gaps exist |`);
  lines.push(`| F | 0-59% | Critical — immediate action required |`);
  lines.push(``);

  // ── Per-Area Detail ─────────────────────────────────────────────────

  lines.push(`## Detailed Assessment`);
  lines.push(``);

  for (const area of areas) {
    lines.push(`### ${area.area}: ${area.grade} (${area.score}%)`);
    lines.push(``);
    lines.push("```");
    lines.push(`  ${area.area.padEnd(20)} ${gradeBar(area.grade)} ${area.score}%`);
    lines.push("```");
    lines.push(``);
    lines.push(`| Factor | Detail |`);
    lines.push(`|--------|--------|`);
    for (const factor of area.factors) {
      lines.push(`| ${factor.includes("(-") || factor.includes("not") ? "Action Needed" : "Met"} | ${factor} |`);
    }
    lines.push(``);
  }

  // ── Action Items ────────────────────────────────────────────────────

  const actionItems = areas
    .flatMap((a) =>
      a.factors
        .filter((f) => f.includes("not") || f.includes("(-"))
        .map((f) => ({ area: a.area, factor: f })),
    );

  if (actionItems.length > 0) {
    lines.push(`## Priority Actions to Improve Score`);
    lines.push(``);
    for (let i = 0; i < actionItems.length; i++) {
      lines.push(`${i + 1}. **[${actionItems[i].area}]** ${actionItems[i].factor.replace(/\s*\(-\d+\)/, "")}`);
    }
    lines.push(``);
  }

  // ── Historical Tracking Template ────────────────────────────────────

  lines.push(`## Historical Tracking`);
  lines.push(``);
  lines.push(`> Use this template to track your compliance score over time.`);
  lines.push(``);
  lines.push(`| Date | Privacy | Security | ${aiScore ? "AI | " : ""}Vendor | Docs | Overall | Trend |`);
  lines.push(`|------|---------|----------${aiScore ? "|----" : ""}|--------|------|---------|-------|`);
  lines.push(`| ${date} | ${areas[0].grade} | ${areas[1].grade} | ${aiScore ? `${aiScore.grade} | ` : ""}${areas.find((a) => a.area === "Vendor Management")?.grade} | ${areas.find((a) => a.area === "Documentation")?.grade} | ${overallGrade} | ${trend} |`);
  lines.push(`| __________ | ___ | ___ | ${aiScore ? "___ | " : ""}___ | ___ | ___ | ___ |`);
  lines.push(`| __________ | ___ | ___ | ${aiScore ? "___ | " : ""}___ | ___ | ___ | ___ |`);
  lines.push(``);

  // ── Footer ──────────────────────────────────────────────────────────

  lines.push(`---`);
  lines.push(``);
  lines.push(
    `*This Compliance Scorecard was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis and configuration review. Grades reflect configuration completeness and service profile, not full legal compliance. This document should be reviewed by qualified compliance professionals.*`,
  );
  lines.push(``);

  return lines.join("\n");
}
