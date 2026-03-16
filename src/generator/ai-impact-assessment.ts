import type { ScanResult, DetectedService } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";
import { classifyAIRisk } from "./ai-disclosure.js";

// ── EU AI Act Risk Categories ─────────────────────────────────────────────

interface AIServiceRiskProfile {
  service: DetectedService;
  euAIActRisk: "unacceptable" | "high" | "limited" | "minimal";
  coloradoAIActApplies: boolean;
  rationale: string;
  mitigations: string[];
  monitoringFrequency: string;
}

const HIGH_RISK_PURPOSES = [
  "biometric identification",
  "emotion recognition",
  "credit scoring",
  "hiring",
  "recruitment",
  "law enforcement",
  "healthcare diagnosis",
  "education assessment",
  "migration control",
  "social scoring",
  "critical infrastructure",
  "access to essential services",
];

const COLORADO_CONSEQUENTIAL_DECISIONS = [
  "education",
  "employment",
  "financial",
  "lending",
  "credit",
  "housing",
  "insurance",
  "healthcare",
  "legal",
  "government",
];

// ── Risk Classification ───────────────────────────────────────────────────

function classifyServiceRisk(
  service: DetectedService,
  ctx?: GeneratorContext
): AIServiceRiskProfile {
  const dataLower = service.dataCollected.map((d) => d.toLowerCase()).join(" ");
  const nameLower = service.name.toLowerCase();

  // Check for unacceptable risk (EU AI Act Article 5)
  const unacceptablePatterns = ["social scoring", "real-time biometric", "subliminal manipulation"];
  const isUnacceptable = unacceptablePatterns.some(
    (p) => dataLower.includes(p) || nameLower.includes(p)
  );

  if (isUnacceptable) {
    return {
      service,
      euAIActRisk: "unacceptable",
      coloradoAIActApplies: true,
      rationale:
        "This AI use case falls under prohibited practices in EU AI Act Article 5. Deployment in the EU is not permitted.",
      mitigations: [
        "Immediately discontinue this AI use case in EU markets",
        "Conduct legal review to confirm classification",
        "Document decision and notify DPO",
      ],
      monitoringFrequency: "Immediate action required",
    };
  }

  // Check for high risk (EU AI Act Annex III)
  const isHighRisk = HIGH_RISK_PURPOSES.some(
    (p) => dataLower.includes(p) || nameLower.includes(p)
  );

  // Check Colorado AI Act applicability
  const coloradoApplies = COLORADO_CONSEQUENTIAL_DECISIONS.some(
    (p) => dataLower.includes(p) || nameLower.includes(p)
  );

  if (isHighRisk) {
    return {
      service,
      euAIActRisk: "high",
      coloradoAIActApplies: coloradoApplies || true,
      rationale:
        "This AI service processes data or makes decisions in a high-risk domain as defined by EU AI Act Annex III. Full conformity assessment required before deployment.",
      mitigations: [
        "Implement risk management system per Article 9",
        "Establish data governance and quality controls per Article 10",
        "Maintain technical documentation per Article 11",
        "Enable automatic logging per Article 12",
        "Ensure human oversight capability per Article 14",
        "Conduct conformity assessment before market deployment",
        "Register in the EU AI database",
      ],
      monitoringFrequency: "Continuous + quarterly review",
    };
  }

  // Check for limited risk (user-facing AI)
  const userFacingPatterns = [
    "user prompts",
    "conversation history",
    "generated content",
    "chatbot",
    "model predictions",
  ];
  const isUserFacing = userFacingPatterns.some((p) => dataLower.includes(p));

  if (isUserFacing) {
    return {
      service,
      euAIActRisk: "limited",
      coloradoAIActApplies: coloradoApplies,
      rationale:
        "This AI service interacts with end users or generates content, triggering transparency obligations under EU AI Act Article 50.",
      mitigations: [
        "Disclose AI interaction to users before or during use",
        "Label AI-generated content where required (deepfakes, synthetic text)",
        "Maintain AI disclosure documentation",
        "Provide opt-out mechanism where feasible",
        "Log user interactions for audit purposes",
      ],
      monitoringFrequency: "Semi-annual review",
    };
  }

  return {
    service,
    euAIActRisk: "minimal",
    coloradoAIActApplies: coloradoApplies,
    rationale:
      "This AI service operates in a minimal-risk category. No mandatory requirements under EU AI Act, though voluntary codes of conduct are encouraged.",
    mitigations: [
      "Maintain internal documentation of AI use",
      "Consider voluntary transparency measures",
      "Monitor for regulatory classification changes",
    ],
    monitoringFrequency: "Annual review",
  };
}

// ── Generator ─────────────────────────────────────────────────────────────

/**
 * Generates AI_IMPACT_ASSESSMENT.md — a combined EU AI Act + Colorado AI Act
 * impact assessment with per-service risk evaluation, mitigation measures,
 * and monitoring plan.
 *
 * Only generates when AI services are detected.
 */
export function generateAIImpactAssessment(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  const aiServices = scan.services.filter((s) => s.category === "ai");
  if (aiServices.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const dpo = ctx?.dpoEmail || "[dpo@example.com]";
  const date = new Date().toISOString().split("T")[0];
  const overallRisk = classifyAIRisk(scan.services, ctx);
  const overallLabel = overallRisk.charAt(0).toUpperCase() + overallRisk.slice(1);

  const profiles = aiServices.map((s) => classifyServiceRisk(s, ctx));

  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────────
  lines.push("# AI Impact Assessment");
  lines.push("");
  lines.push(`**Organisation:** ${company}`);
  lines.push(`**Project:** ${scan.projectName}`);
  lines.push(`**Overall AI Risk Classification:** ${overallLabel}`);
  lines.push(`**Assessment Date:** ${date}`);
  lines.push(`**Next Review:** ${nextYear(date)}`);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(
    "> This document provides a combined impact assessment under the **EU AI Act** (Regulation (EU) 2024/1689) and the **Colorado AI Act** (SB 24-205). " +
      "It evaluates each AI service integrated into this application, classifies risk levels, identifies required mitigation measures, and establishes a monitoring plan."
  );
  lines.push("");

  // ── 1. Regulatory Overview ──────────────────────────────────────────────
  lines.push("## 1. Regulatory Overview");
  lines.push("");
  lines.push("### 1.1 EU AI Act (Regulation (EU) 2024/1689)");
  lines.push("");
  lines.push("The EU AI Act establishes a risk-based regulatory framework for AI systems:");
  lines.push("");
  lines.push("| Risk Level | Requirements | Timeline |");
  lines.push("|------------|-------------|----------|");
  lines.push("| **Unacceptable** | Prohibited — must not be deployed in the EU | 2 February 2025 |");
  lines.push("| **High** | Conformity assessment, registration, continuous monitoring | 2 August 2026 |");
  lines.push("| **Limited** | Transparency obligations (disclosure to users) | 2 August 2026 |");
  lines.push("| **Minimal** | No mandatory requirements; voluntary codes of conduct | Effective now |");
  lines.push("");

  lines.push("### 1.2 Colorado AI Act (SB 24-205)");
  lines.push("");
  lines.push(
    "The Colorado AI Act, effective **1 February 2026**, requires developers and deployers of " +
      "\"high-risk AI systems\" that make or substantially support **consequential decisions** to:"
  );
  lines.push("");
  lines.push("- Perform impact assessments before deployment");
  lines.push("- Provide transparency notices to consumers");
  lines.push("- Implement risk management programmes");
  lines.push("- Enable human appeal mechanisms for adverse decisions");
  lines.push("- Report discovered algorithmic discrimination to the AG within 90 days");
  lines.push("");
  lines.push(
    "Consequential decisions include those affecting education, employment, financial services, " +
      "healthcare, housing, insurance, and legal services."
  );
  lines.push("");

  // ── 2. AI Services Inventory ────────────────────────────────────────────
  lines.push("## 2. AI Services Inventory");
  lines.push("");
  lines.push("| Service | Data Processed | EU AI Act Risk | Colorado AI Act | Monitoring |");
  lines.push("|---------|---------------|----------------|-----------------|------------|");

  for (const p of profiles) {
    const data = p.service.dataCollected.slice(0, 3).join(", ");
    const coloradoLabel = p.coloradoAIActApplies ? "Applies" : "N/A";
    lines.push(
      `| ${p.service.name} | ${data} | **${p.euAIActRisk.charAt(0).toUpperCase() + p.euAIActRisk.slice(1)}** | ${coloradoLabel} | ${p.monitoringFrequency} |`
    );
  }
  lines.push("");

  // ── 3. Per-Service Risk Evaluation ──────────────────────────────────────
  lines.push("## 3. Per-Service Risk Evaluation");
  lines.push("");

  for (const p of profiles) {
    const riskLabel = p.euAIActRisk.charAt(0).toUpperCase() + p.euAIActRisk.slice(1);
    lines.push(`### 3.${profiles.indexOf(p) + 1} ${p.service.name}`);
    lines.push("");
    lines.push("| Field | Detail |");
    lines.push("|-------|--------|");
    lines.push(`| **Service** | \`${p.service.name}\` |`);
    lines.push(`| **Category** | ${p.service.category} |`);
    lines.push(`| **Data Processed** | ${p.service.dataCollected.join(", ")} |`);
    lines.push(`| **EU AI Act Classification** | ${riskLabel} |`);
    lines.push(`| **Colorado AI Act** | ${p.coloradoAIActApplies ? "In scope — consequential decision support" : "Not in scope"} |`);
    lines.push(`| **Monitoring Frequency** | ${p.monitoringFrequency} |`);
    lines.push("");
    lines.push(`**Rationale:** ${p.rationale}`);
    lines.push("");

    lines.push("**Required Mitigations:**");
    lines.push("");
    for (const m of p.mitigations) {
      lines.push(`- [ ] ${m}`);
    }
    lines.push("");
  }

  // ── 4. Algorithmic Discrimination Assessment ────────────────────────────
  lines.push("## 4. Algorithmic Discrimination Assessment");
  lines.push("");
  lines.push(
    "Under the Colorado AI Act, deployers must evaluate AI systems for algorithmic discrimination — " +
      "differential treatment that disfavours individuals based on protected characteristics."
  );
  lines.push("");
  lines.push("### 4.1 Protected Characteristics (Colorado)");
  lines.push("");
  lines.push("- Age");
  lines.push("- Colour");
  lines.push("- Disability");
  lines.push("- Ethnicity");
  lines.push("- Genetic information");
  lines.push("- Gender identity / expression");
  lines.push("- National origin");
  lines.push("- Race");
  lines.push("- Religion");
  lines.push("- Sex");
  lines.push("- Veteran status");
  lines.push("");

  lines.push("### 4.2 Assessment Checklist");
  lines.push("");
  lines.push("- [ ] Identify which AI services make or support consequential decisions");
  lines.push("- [ ] Test each service for disparate impact across protected characteristics");
  lines.push("- [ ] Document testing methodology, datasets, and results");
  lines.push("- [ ] Establish ongoing bias monitoring with alerting thresholds");
  lines.push("- [ ] Define remediation procedures for discovered discrimination");
  lines.push("- [ ] Set up 90-day reporting process to Colorado AG for discovered discrimination");
  lines.push("");

  // ── 5. EU AI Act Fundamental Rights Impact ──────────────────────────────
  const hasHighRisk = profiles.some((p) => p.euAIActRisk === "high");
  if (hasHighRisk) {
    lines.push("## 5. Fundamental Rights Impact Assessment (EU AI Act Article 27)");
    lines.push("");
    lines.push(
      "Deployers of high-risk AI systems must assess the impact on fundamental rights " +
        "before first use. This section addresses that requirement."
    );
    lines.push("");
    lines.push("| Right | Potential Impact | Mitigation |");
    lines.push("|-------|-----------------|------------|");
    lines.push("| **Right to privacy** (Art. 7 EU Charter) | AI processes personal data | Data minimisation, encryption, access controls |");
    lines.push("| **Protection of personal data** (Art. 8) | Data used for training/inference | GDPR compliance, DPA with providers |");
    lines.push("| **Non-discrimination** (Art. 21) | Risk of biased outputs | Bias testing, fairness metrics, human review |");
    lines.push("| **Freedom of expression** (Art. 11) | Content filtering/moderation | Transparent moderation policies, appeal mechanism |");
    lines.push("| **Right to an effective remedy** (Art. 47) | Automated decisions | Human oversight, appeal process |");
    lines.push("| **Rights of the child** (Art. 24) | Minors may interact | Age verification, enhanced protections |");
    lines.push("");
  }

  // ── 6. Monitoring Plan ──────────────────────────────────────────────────
  const monitoringSection = hasHighRisk ? "6" : "5";
  lines.push(`## ${monitoringSection}. Monitoring Plan`);
  lines.push("");
  lines.push("| Activity | Frequency | Owner | Next Due |");
  lines.push("|----------|-----------|-------|----------|");
  lines.push(`| Full impact assessment review | Annual | DPO / AI Governance | ${nextYear(date)} |`);
  lines.push(`| Bias and fairness testing | Quarterly | Engineering | [Set date] |`);
  lines.push(`| Performance metrics review | Monthly | Engineering | [Set date] |`);
  lines.push(`| Incident log review | Monthly | DPO | [Set date] |`);
  lines.push(`| Regulatory change review | Quarterly | Legal | [Set date] |`);
  lines.push(`| Consumer complaint analysis | Monthly | Support / Legal | [Set date] |`);
  lines.push(`| Model drift detection | Continuous | Engineering | Automated |`);
  lines.push("");

  // ── 7. Transparency Obligations ─────────────────────────────────────────
  const transparencySection = hasHighRisk ? "7" : "6";
  lines.push(`## ${transparencySection}. Transparency Obligations`);
  lines.push("");
  lines.push("### EU AI Act (Article 50)");
  lines.push("");
  lines.push("- [ ] Users are informed they are interacting with an AI system");
  lines.push("- [ ] AI-generated content is labelled (deepfakes, synthetic text/audio/video)");
  lines.push("- [ ] Emotion recognition / biometric categorisation use is disclosed");
  lines.push("");
  lines.push("### Colorado AI Act");
  lines.push("");
  lines.push("- [ ] Consumers notified that AI is being used to make or support consequential decisions");
  lines.push("- [ ] Description of the AI system provided to affected consumers");
  lines.push("- [ ] Consumer has access to appeal process with human reviewer");
  lines.push("- [ ] Contact information for questions about AI use is published");
  lines.push("");

  // ── 8. Incident Response ────────────────────────────────────────────────
  const incidentSection = hasHighRisk ? "8" : "7";
  lines.push(`## ${incidentSection}. AI Incident Response`);
  lines.push("");
  lines.push("| Scenario | Action | Timeline | Owner |");
  lines.push("|----------|--------|----------|-------|");
  lines.push("| Discovered algorithmic discrimination | Report to Colorado AG | 90 days | Legal |");
  lines.push("| Serious AI incident (EU) | Report to national authority | Without undue delay | DPO |");
  lines.push("| Model producing harmful outputs | Suspend AI feature, investigate | Immediately | Engineering |");
  lines.push("| Consumer complaint about AI decision | Initiate human review | 30 days | Support |");
  lines.push("| Regulatory inquiry | Engage legal counsel, compile documentation | Within requested timeframe | Legal |");
  lines.push("");

  // ── Footer ──────────────────────────────────────────────────────────────
  lines.push("## Contact");
  lines.push("");
  lines.push(`- **Email:** ${email}`);
  if (ctx?.dpoEmail) {
    lines.push(`- **Data Protection Officer:** ${ctx.dpoEmail}`);
  }
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(
    "*This AI Impact Assessment was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on code analysis. " +
      "It covers obligations under the EU AI Act (Regulation (EU) 2024/1689) and the Colorado AI Act (SB 24-205). " +
      "This document must be reviewed by qualified legal counsel and your AI governance team. " +
      "It does not constitute legal advice.*"
  );
  lines.push("");

  return lines.join("\n");
}

// ── Helpers ───────────────────────────────────────────────────────────────

function nextYear(dateStr: string): string {
  const d = new Date(dateStr);
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0];
}
