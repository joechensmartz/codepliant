import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates AI_ETHICS_STATEMENT.md when AI services are detected.
 *
 * Aligned with:
 * - UNESCO Recommendation on the Ethics of Artificial Intelligence (2021)
 * - EU AI Act (Regulation (EU) 2024/1689)
 * - OECD AI Principles
 *
 * Covers fairness, transparency, accountability, human oversight,
 * sustainability, and proportionality principles.
 *
 * Returns null when no AI services are detected.
 */
export function generateAIEthicsStatement(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  const aiServices = scan.services.filter((s) => s.category === "ai");
  if (aiServices.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const dpoName = ctx?.dpoName || "[Data Protection Officer Name]";
  const dpoEmail = ctx?.dpoEmail || "[dpo@example.com]";
  const date = new Date().toISOString().split("T")[0];

  const sections: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────
  sections.push("# AI Ethics Statement");
  sections.push("");
  sections.push(`**Last updated:** ${date}`);
  sections.push("");
  sections.push(`**Organization:** ${company}`);
  sections.push(`**Project:** ${scan.projectName}`);
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push(
    `This AI Ethics Statement outlines the principles, commitments, and oversight mechanisms ` +
    `that **${company}** follows when developing, deploying, and operating artificial intelligence ` +
    `systems. It is aligned with the **UNESCO Recommendation on the Ethics of Artificial Intelligence** ` +
    `(2021), the **OECD AI Principles**, and the **EU AI Act**.`
  );
  sections.push("");

  // ── 1. AI Systems in Use ─────────────────────────────────────────────
  sections.push("## 1. AI Systems in Use");
  sections.push("");
  sections.push("This project integrates the following AI services:");
  sections.push("");
  for (const service of aiServices) {
    sections.push(`- **${service.name}** — Processes: ${service.dataCollected.join(", ")}`);
  }
  sections.push("");
  sections.push(
    "Each AI system listed above is subject to the ethical principles and oversight commitments described in this statement."
  );
  sections.push("");

  // ── 2. Core Ethical Principles ──────────────────────────────────────
  sections.push("## 2. Core Ethical Principles");
  sections.push("");
  sections.push("Our use of AI is guided by the following principles, derived from the UNESCO Recommendation on the Ethics of AI:");
  sections.push("");

  // 2.1 Proportionality & Do No Harm
  sections.push("### 2.1 Proportionality and Do No Harm");
  sections.push("");
  sections.push("- AI systems shall not be used in ways that cause or are likely to cause harm to individuals, communities, or the environment");
  sections.push("- The use of AI must be proportionate to the legitimate aim pursued");
  sections.push("- We conduct risk assessments before deploying AI features to ensure proportionality");
  sections.push("- AI systems must include safeguards against unintended harmful outcomes");
  sections.push("");

  // 2.2 Fairness & Non-Discrimination
  sections.push("### 2.2 Fairness and Non-Discrimination");
  sections.push("");
  sections.push("- AI systems shall not discriminate against individuals or groups based on protected characteristics including race, gender, age, disability, religion, sexual orientation, or socioeconomic status");
  sections.push("- We conduct bias testing across demographic groups before deployment and at regular intervals");
  sections.push("- When bias is detected, we take immediate corrective action including disabling features, applying output filters, or retraining models");
  sections.push("- We monitor AI outputs for patterns of unfair treatment and maintain records of bias testing results");
  sections.push("");

  // 2.3 Transparency & Explainability
  sections.push("### 2.3 Transparency and Explainability");
  sections.push("");
  sections.push("- Users are informed when they are interacting with an AI system, in accordance with EU AI Act Article 50");
  sections.push("- AI-generated content is clearly labeled as such");
  sections.push("- We provide meaningful information about the logic, significance, and envisaged consequences of AI processing");
  sections.push("- Where technically feasible, we offer explanations for individual AI decisions that affect users");
  sections.push("- Our AI Disclosure and AI Model Card documents provide detailed transparency about AI system capabilities and limitations");
  sections.push("");

  // 2.4 Accountability
  sections.push("### 2.4 Accountability and Responsibility");
  sections.push("");
  sections.push("- Clear roles and responsibilities are assigned for AI governance within the organization");
  sections.push("- An AI Governance Officer is responsible for overseeing compliance with this ethics statement");
  sections.push("- We maintain audit trails of AI system decisions for accountability purposes");
  sections.push("- We accept responsibility for the outcomes of our AI systems and their impact on individuals");
  sections.push("- When AI systems cause harm, we provide effective remedy and redress mechanisms");
  sections.push("");

  // 2.5 Privacy & Data Protection
  sections.push("### 2.5 Privacy and Data Protection");
  sections.push("");
  sections.push("- AI systems process personal data only in accordance with applicable data protection laws (GDPR, CCPA/CPRA)");
  sections.push("- Data minimization is applied — AI systems use only the data necessary for their stated purpose");
  sections.push("- Users retain their data subject rights including the right to access, rectify, erase, and port their data");
  sections.push("- AI training data usage is disclosed and opt-out mechanisms are provided where available");
  sections.push(`- Our Data Protection Officer (${dpoName}, ${dpoEmail}) oversees AI data processing activities`);
  sections.push("");

  // 2.6 Human Oversight
  sections.push("### 2.6 Human Oversight and Control");
  sections.push("");
  sections.push("- All AI systems operate under meaningful human oversight appropriate to their risk level");
  sections.push("- Critical decisions that significantly affect individuals are not made solely by AI systems");
  sections.push("- Human operators can intervene in, override, or shut down AI system operations at any time");
  sections.push("- Regular human review of AI outputs is conducted to ensure quality, safety, and alignment with organizational values");
  sections.push("- Users have the right to request human review of decisions made with AI assistance");
  sections.push("");

  // 2.7 Safety & Security
  sections.push("### 2.7 Safety and Security");
  sections.push("");
  sections.push("- AI systems are tested for safety before deployment, including adversarial testing and edge case evaluation");
  sections.push("- We implement defenses against prompt injection, data poisoning, and other AI-specific attack vectors");
  sections.push("- Rollback mechanisms and kill switches are in place for all AI features");
  sections.push("- AI system performance is continuously monitored for drift, errors, and anomalies");
  sections.push("- Incidents involving AI systems are handled per our Incident Response Plan with AI-specific procedures");
  sections.push("");

  // 2.8 Sustainability
  sections.push("### 2.8 Sustainability");
  sections.push("");
  sections.push("- We consider the environmental impact of AI system training and operation");
  sections.push("- Where possible, we select AI providers and models with lower computational and energy footprints");
  sections.push("- We avoid unnecessary AI processing and implement caching and optimization to reduce resource consumption");
  sections.push("- We periodically review whether AI usage remains justified and proportionate to the benefits delivered");
  sections.push("");

  // ── 3. Human Oversight Commitments ──────────────────────────────────
  sections.push("## 3. Human Oversight Commitments");
  sections.push("");
  sections.push("We commit to the following specific oversight practices:");
  sections.push("");
  sections.push("| Commitment | Description | Frequency |");
  sections.push("|------------|-------------|-----------|");
  sections.push("| Bias audit | Test all AI systems for discriminatory outcomes across protected groups | Quarterly + pre-deployment |");
  sections.push("| Output review | Human review of a sample of AI outputs for quality and safety | Monthly |");
  sections.push("| Model evaluation | Evaluate AI model performance, accuracy, and alignment | Quarterly |");
  sections.push("| Ethics review | Review AI usage against this ethics statement | Annually |");
  sections.push("| Incident review | Investigate and document all AI-related incidents | Per incident |");
  sections.push("| Stakeholder feedback | Collect and review user feedback about AI systems | Ongoing |");
  sections.push("| Risk assessment | Reassess AI risk classification and proportionality | Annually + on change |");
  sections.push("| Vendor review | Evaluate third-party AI providers for ethical compliance | Annually |");
  sections.push("");

  // ── 4. UNESCO AI Ethics Alignment ───────────────────────────────────
  sections.push("## 4. UNESCO Recommendation Alignment");
  sections.push("");
  sections.push("This ethics statement is aligned with the UNESCO Recommendation on the Ethics of Artificial Intelligence (adopted November 2021). The following table maps UNESCO principles to our commitments:");
  sections.push("");
  sections.push("| UNESCO Principle | Our Commitment |");
  sections.push("|------------------|----------------|");
  sections.push("| Proportionality and Do No Harm | Risk assessments before deployment; safeguards against harm |");
  sections.push("| Safety and Security | Adversarial testing; monitoring; kill switches; incident response |");
  sections.push("| Fairness and Non-Discrimination | Bias testing; protected characteristic monitoring; corrective action |");
  sections.push("| Sustainability | Environmental impact consideration; optimization; justified usage |");
  sections.push("| Right to Privacy and Data Protection | GDPR/CCPA compliance; data minimization; data subject rights |");
  sections.push("| Human Oversight and Determination | Human-in-the-loop; override capability; regular review |");
  sections.push("| Transparency and Explainability | AI disclosure; content labeling; decision explanations |");
  sections.push("| Responsibility and Accountability | Governance officer; audit trails; remedy mechanisms |");
  sections.push("| Awareness and Literacy | Staff training; user education; clear documentation |");
  sections.push("| Multi-stakeholder Governance | Feedback collection; external input; interdisciplinary review |");
  sections.push("");

  // ── 5. Governance Structure ─────────────────────────────────────────
  sections.push("## 5. AI Ethics Governance Structure");
  sections.push("");
  sections.push("### 5.1 AI Governance Officer");
  sections.push("");
  sections.push("An appointed AI Governance Officer is responsible for:");
  sections.push("");
  sections.push("- Maintaining and updating this AI Ethics Statement");
  sections.push("- Overseeing bias testing and ethical compliance reviews");
  sections.push("- Receiving and investigating ethics-related complaints");
  sections.push("- Reporting to leadership on AI ethics matters");
  sections.push("- Coordinating with the Data Protection Officer on AI data processing");
  sections.push("");

  sections.push("### 5.2 Ethics Review Process");
  sections.push("");
  sections.push("Before deploying a new AI feature or significantly modifying an existing one:");
  sections.push("");
  sections.push("1. **Impact Assessment** — Evaluate potential ethical impacts on affected stakeholders");
  sections.push("2. **Proportionality Check** — Confirm AI usage is proportionate to the legitimate aim");
  sections.push("3. **Bias Testing** — Conduct fairness testing across demographic groups");
  sections.push("4. **Transparency Review** — Ensure adequate user disclosure and labeling");
  sections.push("5. **Oversight Verification** — Confirm human oversight mechanisms are in place");
  sections.push("6. **Approval** — Obtain sign-off from the AI Governance Officer");
  sections.push("");

  // ── 6. Reporting & Redress ──────────────────────────────────────────
  sections.push("## 6. Reporting Concerns and Redress");
  sections.push("");
  sections.push("If you believe our AI systems have produced unfair, discriminatory, or harmful outcomes, you have the right to:");
  sections.push("");
  sections.push("- **Report the concern** — Contact us at " + contactEmail);
  sections.push(`- **Request human review** — Ask for a human to review any AI-assisted decision`);
  sections.push("- **Lodge a complaint** — File a formal complaint with our AI Governance Officer");
  sections.push("- **Regulatory complaint** — Contact your local data protection authority or AI supervisory authority");
  sections.push("");
  sections.push("We commit to acknowledging all AI ethics complaints within 5 business days and providing a substantive response within 30 days.");
  sections.push("");

  // ── 7. Contact ──────────────────────────────────────────────────────
  sections.push("## 7. Contact");
  sections.push("");
  sections.push("For questions about this AI Ethics Statement or our AI practices:");
  sections.push("");
  sections.push(`- **AI Governance Officer:** [Name] ([email])`);
  sections.push(`- **Data Protection Officer:** ${dpoName} (${dpoEmail})`);
  sections.push(`- **General inquiries:** ${contactEmail}`);
  sections.push("");

  // ── Disclaimer ──────────────────────────────────────────────────────
  sections.push("---");
  sections.push("");
  sections.push(
    `*This AI Ethics Statement was generated by [Codepliant](https://github.com/joechensmartz/codepliant) ` +
    `based on an automated scan of the **${scan.projectName}** codebase. ` +
    `It should be reviewed and customized by your legal, ethics, and AI governance teams to reflect ` +
    `your organization's specific values and commitments.*`
  );

  return sections.join("\n");
}
