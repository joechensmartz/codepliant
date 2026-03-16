import type { ScanResult, DetectedService } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates AI_GOVERNANCE_FRAMEWORK.md when AI services are detected.
 *
 * Based on:
 * - EU AI Act (Regulation (EU) 2024/1689)
 * - NIST AI Risk Management Framework (AI RMF 1.0)
 *
 * Covers roles/responsibilities, lifecycle controls, model evaluation,
 * bias testing requirements, and ongoing monitoring.
 */
export function generateAIGovernanceFramework(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  const aiServices = scan.services.filter((s) => s.category === "ai");
  if (aiServices.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const dpoName = ctx?.dpoName || "[Data Protection Officer Name]";
  const dpoEmail = ctx?.dpoEmail || "[dpo@example.com]";
  const date = new Date().toISOString().split("T")[0];
  const riskLevel = ctx?.aiRiskLevel || determineRiskLevel(aiServices);

  const sections: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────
  sections.push("# AI Governance Framework");
  sections.push("");
  sections.push(`**Last updated:** ${date}`);
  sections.push("");
  sections.push(`**Project:** ${scan.projectName}`);
  sections.push(`**Organization:** ${company}`);
  sections.push(`**AI Risk Classification:** ${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk`);
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push(`This AI Governance Framework establishes the policies, roles, and controls for the responsible development, deployment, and operation of AI systems within **${company}**. It is aligned with the **EU AI Act** (Regulation (EU) 2024/1689) and the **NIST AI Risk Management Framework** (AI RMF 1.0).`);
  sections.push("");

  // ── 1. Scope ────────────────────────────────────────────────────────
  sections.push("## 1. Scope and Applicability");
  sections.push("");
  sections.push("This framework applies to all AI systems developed, deployed, or procured by the organization, including:");
  sections.push("");
  for (const service of aiServices) {
    sections.push(`- **${service.name}** — ${service.dataCollected.join(", ")}`);
  }
  sections.push("");
  sections.push("This includes both internally developed AI models and third-party AI services accessed via APIs.");
  sections.push("");

  // ── 2. Regulatory Alignment ─────────────────────────────────────────
  sections.push("## 2. Regulatory Alignment");
  sections.push("");
  sections.push("### 2.1 EU AI Act");
  sections.push("");
  sections.push("The EU AI Act establishes a risk-based regulatory framework for AI systems. This project is classified as follows:");
  sections.push("");
  sections.push(`| Aspect | Classification |`);
  sections.push(`|--------|---------------|`);
  sections.push(`| Risk Level | ${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} |`);
  sections.push(`| Transparency Obligations | ${riskLevel === "minimal" ? "Basic disclosure" : "Full transparency required"} |`);
  sections.push(`| Conformity Assessment | ${riskLevel === "high" ? "Required before deployment" : "Self-assessment"} |`);
  sections.push(`| Registration | ${riskLevel === "high" ? "EU database registration required" : "Not required"} |`);
  sections.push(`| Human Oversight | ${riskLevel === "high" ? "Mandatory human-in-the-loop" : "Recommended"} |`);
  sections.push("");
  sections.push("### 2.2 NIST AI RMF");
  sections.push("");
  sections.push("The NIST AI Risk Management Framework organizes AI risk management into four functions:");
  sections.push("");
  sections.push("1. **GOVERN** — Establish and maintain AI risk management policies and processes");
  sections.push("2. **MAP** — Identify and contextualize AI risks in the application domain");
  sections.push("3. **MEASURE** — Analyze, assess, and track AI risks using quantitative and qualitative methods");
  sections.push("4. **MANAGE** — Prioritize and act on AI risks to maximize benefits and minimize harms");
  sections.push("");

  // ── 3. Roles and Responsibilities ───────────────────────────────────
  sections.push("## 3. Roles and Responsibilities");
  sections.push("");
  sections.push("### 3.1 AI Governance Officer");
  sections.push("");
  sections.push("| Responsibility | Description |");
  sections.push("|----------------|-------------|");
  sections.push("| Policy ownership | Owns and maintains this AI Governance Framework |");
  sections.push("| Risk oversight | Reviews and approves AI risk assessments before deployment |");
  sections.push("| Regulatory compliance | Ensures compliance with EU AI Act and applicable regulations |");
  sections.push("| Incident escalation | Primary escalation point for AI-related incidents |");
  sections.push("| Vendor assessment | Evaluates AI service providers for compliance and risk |");
  sections.push("| Reporting | Provides quarterly AI governance reports to leadership |");
  sections.push("");
  sections.push("### 3.2 Development Team");
  sections.push("");
  sections.push("| Responsibility | Description |");
  sections.push("|----------------|-------------|");
  sections.push("| Implementation | Implements AI features following this framework's controls |");
  sections.push("| Testing | Conducts bias testing, accuracy evaluation, and safety checks |");
  sections.push("| Documentation | Maintains technical documentation for AI components |");
  sections.push("| Monitoring | Implements monitoring for model drift, errors, and anomalies |");
  sections.push("| Data quality | Ensures training and input data meets quality standards |");
  sections.push("| Security | Implements prompt injection defenses and output filtering |");
  sections.push("");
  sections.push("### 3.3 Compliance Team");
  sections.push("");
  sections.push("| Responsibility | Description |");
  sections.push("|----------------|-------------|");
  sections.push(`| Data protection | Coordinates with DPO (${dpoName}, ${dpoEmail}) on AI data processing |`);
  sections.push("| Impact assessment | Conducts AI Impact Assessments (AIIA) and DPIAs for AI systems |");
  sections.push("| Audit support | Supports internal and external audits of AI systems |");
  sections.push("| Record keeping | Maintains records required by EU AI Act Article 12 |");
  sections.push("| User rights | Handles data subject requests related to AI processing |");
  sections.push("");
  sections.push("### 3.4 Executive Leadership");
  sections.push("");
  sections.push("| Responsibility | Description |");
  sections.push("|----------------|-------------|");
  sections.push("| Strategic direction | Sets organizational AI strategy and risk appetite |");
  sections.push("| Resource allocation | Provides resources for AI governance and compliance |");
  sections.push("| Accountability | Bears ultimate accountability for AI system outcomes |");
  sections.push("| Culture | Promotes a culture of responsible AI development |");
  sections.push("");

  // ── 4. AI Development Lifecycle Controls ────────────────────────────
  sections.push("## 4. AI Development Lifecycle Controls");
  sections.push("");
  sections.push("### 4.1 Planning & Design");
  sections.push("");
  sections.push("- [ ] Define the intended purpose and scope of the AI system");
  sections.push("- [ ] Conduct an initial risk classification (minimal / limited / high / unacceptable)");
  sections.push("- [ ] Identify affected stakeholders and potential impacts");
  sections.push("- [ ] Complete an AI Impact Assessment (AIIA)");
  sections.push("- [ ] Document data requirements and lawful basis for processing");
  sections.push("- [ ] Define success metrics, fairness criteria, and acceptable error rates");
  sections.push("- [ ] Establish human oversight mechanisms appropriate to the risk level");
  sections.push("");
  sections.push("### 4.2 Data Preparation");
  sections.push("");
  sections.push("- [ ] Verify lawful basis for data collection and processing (GDPR Art. 6)");
  sections.push("- [ ] Assess data quality, completeness, and representativeness");
  sections.push("- [ ] Document data provenance and any preprocessing steps");
  sections.push("- [ ] Implement data minimization — use only data necessary for the purpose");
  sections.push("- [ ] Check for historical biases in training data");
  sections.push("- [ ] Establish data versioning and lineage tracking");
  sections.push("");
  sections.push("### 4.3 Development & Training");
  sections.push("");
  sections.push("- [ ] Follow secure development practices (input validation, output filtering)");
  sections.push("- [ ] Implement prompt injection defenses for LLM-based systems");
  sections.push("- [ ] Document model architecture, hyperparameters, and training methodology");
  sections.push("- [ ] Conduct initial bias and fairness testing during development");
  sections.push("- [ ] Implement logging for all AI inputs and outputs");
  sections.push("- [ ] Version control all model artifacts and configurations");
  sections.push("");
  sections.push("### 4.4 Testing & Validation");
  sections.push("");
  sections.push("- [ ] Conduct comprehensive accuracy and performance testing");
  sections.push("- [ ] Execute bias and fairness testing across demographic groups (see Section 7)");
  sections.push("- [ ] Perform adversarial testing (prompt injection, data poisoning, evasion)");
  sections.push("- [ ] Validate against edge cases and boundary conditions");
  sections.push("- [ ] Conduct human evaluation of AI outputs for quality and safety");
  sections.push("- [ ] Test graceful degradation and fallback mechanisms");
  sections.push("- [ ] Document all test results and maintain test evidence");
  sections.push("");
  sections.push("### 4.5 Deployment");
  sections.push("");
  sections.push("- [ ] Complete pre-deployment risk review and sign-off");
  sections.push("- [ ] Implement staged rollout (canary / percentage-based deployment)");
  sections.push("- [ ] Configure monitoring, alerting, and anomaly detection");
  sections.push("- [ ] Establish rollback procedures and kill switches");
  sections.push("- [ ] Notify users that AI is being used (EU AI Act transparency obligation)");
  sections.push("- [ ] Update privacy policy and AI disclosure documents");
  sections.push("");
  sections.push("### 4.6 Monitoring & Maintenance");
  sections.push("");
  sections.push("- [ ] Monitor model performance metrics continuously");
  sections.push("- [ ] Track for model drift (data drift and concept drift)");
  sections.push("- [ ] Review AI outputs regularly for quality, safety, and bias");
  sections.push("- [ ] Conduct periodic re-evaluation (minimum quarterly)");
  sections.push("- [ ] Update documentation when models or configurations change");
  sections.push("- [ ] Respond to and investigate AI-related incidents per the Incident Response Plan");
  sections.push("");

  // ── 5. Model Evaluation Criteria ────────────────────────────────────
  sections.push("## 5. Model Evaluation Criteria");
  sections.push("");
  sections.push("All AI models (including third-party API services) must be evaluated against the following criteria before deployment and during periodic reviews:");
  sections.push("");
  sections.push("### 5.1 Performance Metrics");
  sections.push("");
  sections.push("| Metric | Minimum Threshold | Measurement Method |");
  sections.push("|--------|-------------------|-------------------|");
  sections.push("| Accuracy / Task Success Rate | [Define per use case] | Automated testing against labeled dataset |");
  sections.push("| Latency (p95) | [Define SLA] | Application performance monitoring |");
  sections.push("| Availability | 99.9% | Uptime monitoring |");
  sections.push("| Error Rate | < 5% (adjust per criticality) | Error tracking and logging |");
  sections.push("| Hallucination Rate | < 2% for factual claims | Human evaluation sampling |");
  sections.push("");
  sections.push("### 5.2 Safety and Security");
  sections.push("");
  sections.push("| Criterion | Requirement |");
  sections.push("|-----------|-------------|");
  sections.push("| Prompt injection resistance | Tested with standard attack vectors; no data leakage |");
  sections.push("| Output filtering | Harmful, illegal, or inappropriate content blocked |");
  sections.push("| Data leakage prevention | No PII or confidential data in model outputs unless authorized |");
  sections.push("| Authentication | All AI API calls authenticated and authorized |");
  sections.push("| Rate limiting | Implemented to prevent abuse and cost overruns |");
  sections.push("");
  sections.push("### 5.3 Vendor Evaluation (Third-Party AI Services)");
  sections.push("");
  sections.push("For each detected AI service, evaluate:");
  sections.push("");
  for (const service of aiServices) {
    sections.push(`#### ${service.name}`);
    sections.push("");
    sections.push("- [ ] Data processing agreement (DPA) in place");
    sections.push("- [ ] Data residency and transfer mechanisms confirmed");
    sections.push("- [ ] Training data usage policy reviewed (opt-out confirmed if available)");
    sections.push("- [ ] SOC 2 Type II or equivalent certification verified");
    sections.push("- [ ] Incident notification SLA confirmed");
    sections.push("- [ ] Model versioning and deprecation policy understood");
    sections.push("");
  }

  // ── 6. Risk Assessment Matrix ───────────────────────────────────────
  sections.push("## 6. AI Risk Assessment Matrix");
  sections.push("");
  sections.push("### 6.1 Risk Categories (EU AI Act)");
  sections.push("");
  sections.push("| Risk Level | Definition | Requirements | Examples |");
  sections.push("|------------|------------|--------------|----------|");
  sections.push("| **Unacceptable** | AI systems that pose clear threats to safety, livelihoods, or rights | Prohibited | Social scoring, real-time biometric surveillance |");
  sections.push("| **High** | AI systems that significantly impact health, safety, or fundamental rights | Conformity assessment, registration, human oversight, logging | Credit scoring, hiring, healthcare diagnosis |");
  sections.push("| **Limited** | AI systems that interact with humans or generate content | Transparency obligations (user notification) | Chatbots, content generation, emotion detection |");
  sections.push("| **Minimal** | AI systems with minimal risk to rights or safety | No mandatory requirements (voluntary codes of conduct) | Spam filters, game AI, search ranking |");
  sections.push("");
  sections.push("### 6.2 Project Risk Assessment");
  sections.push("");
  sections.push(`Based on the detected AI services and their usage patterns, this project is classified as **${riskLevel} risk**.`);
  sections.push("");
  if (riskLevel === "high") {
    sections.push("> **Action Required:** High-risk AI systems must undergo conformity assessment, be registered in the EU database, implement human oversight measures, and maintain detailed technical documentation as specified in EU AI Act Annex IV.");
  } else if (riskLevel === "limited") {
    sections.push("> **Action Required:** Limited-risk AI systems must comply with transparency obligations. Users must be informed they are interacting with AI, and AI-generated content must be labeled as such.");
  } else {
    sections.push("> **Note:** Minimal-risk AI systems have no mandatory requirements under the EU AI Act, but following this governance framework is recommended as a best practice.");
  }
  sections.push("");

  // ── 7. Bias Testing Requirements ────────────────────────────────────
  sections.push("## 7. Bias Testing Requirements");
  sections.push("");
  sections.push("### 7.1 Testing Obligations");
  sections.push("");
  sections.push("AI systems must be tested for bias before initial deployment and at regular intervals. The EU AI Act (Article 10) requires that training, validation, and testing datasets be:");
  sections.push("");
  sections.push("- Representative of the intended user population");
  sections.push("- Free from errors and data quality issues");
  sections.push("- Assessed for biases that could lead to discriminatory outcomes");
  sections.push("");
  sections.push("### 7.2 Protected Characteristics");
  sections.push("");
  sections.push("Test for differential impact across the following protected characteristics (per EU anti-discrimination law and jurisdiction-specific requirements):");
  sections.push("");
  sections.push("| Characteristic | Testing Approach |");
  sections.push("|----------------|-----------------|");
  sections.push("| Race / Ethnicity | Compare outputs across diverse demographic inputs |");
  sections.push("| Gender / Gender Identity | Test with gender-varied inputs; check for stereotyping |");
  sections.push("| Age | Verify no age-based discrimination in outputs |");
  sections.push("| Disability | Test accessibility and equitable treatment |");
  sections.push("| Religion / Belief | Check for religious bias in content generation |");
  sections.push("| Sexual Orientation | Verify inclusive and non-discriminatory outputs |");
  sections.push("| Nationality / National Origin | Test for geographic or nationality-based bias |");
  sections.push("| Socioeconomic Status | Check for class-based bias in recommendations or decisions |");
  sections.push("");
  sections.push("### 7.3 Testing Methodology");
  sections.push("");
  sections.push("1. **Baseline evaluation** — Establish performance metrics across demographic groups");
  sections.push("2. **Counterfactual testing** — Swap protected attributes and verify consistent outcomes");
  sections.push("3. **Red teaming** — Dedicated adversarial testing to elicit biased responses");
  sections.push("4. **User feedback analysis** — Monitor production feedback for bias reports");
  sections.push("5. **Quantitative metrics** — Calculate demographic parity, equalized odds, and calibration across groups");
  sections.push("");
  sections.push("### 7.4 Testing Schedule");
  sections.push("");
  sections.push("| Trigger | Action Required |");
  sections.push("|---------|----------------|");
  sections.push("| Pre-deployment | Full bias testing suite |");
  sections.push("| Model update / version change | Re-run bias tests on new model |");
  sections.push("| Quarterly | Scheduled bias review using production data |");
  sections.push("| Incident report | Ad-hoc bias investigation |");
  sections.push("| Regulatory request | Full audit documentation |");
  sections.push("");
  sections.push("### 7.5 Remediation");
  sections.push("");
  sections.push("When bias is detected:");
  sections.push("");
  sections.push("1. Document the bias finding, affected groups, and severity");
  sections.push("2. Assess whether to disable the feature, add guardrails, or retrain");
  sections.push("3. Implement mitigation (prompt engineering, output filtering, model fine-tuning)");
  sections.push("4. Re-test to verify the bias has been addressed");
  sections.push("5. Update this framework and related documentation");
  sections.push("6. If the bias caused harm, follow the Incident Response Plan");
  sections.push("");

  // ── 8. Transparency & Documentation ─────────────────────────────────
  sections.push("## 8. Transparency and Documentation Requirements");
  sections.push("");
  sections.push("### 8.1 User-Facing Transparency");
  sections.push("");
  sections.push("- Users must be informed when they are interacting with an AI system (EU AI Act Art. 50)");
  sections.push("- AI-generated content must be clearly labeled as such");
  sections.push("- Users must have access to meaningful information about the logic involved");
  sections.push("- Opt-out mechanisms should be provided where technically feasible");
  sections.push("");
  sections.push("### 8.2 Technical Documentation (EU AI Act Annex IV)");
  sections.push("");
  sections.push("Maintain the following documentation for each AI system:");
  sections.push("");
  sections.push("- [ ] General description of the AI system and its intended purpose");
  sections.push("- [ ] Description of the elements of the AI system and its development process");
  sections.push("- [ ] Detailed information about monitoring, functioning, and control");
  sections.push("- [ ] Description of the risk management system");
  sections.push("- [ ] Data governance and management practices");
  sections.push("- [ ] Performance metrics and testing results");
  sections.push("- [ ] Description of human oversight measures");
  sections.push("");

  // ── 9. Incident Response ────────────────────────────────────────────
  sections.push("## 9. AI-Specific Incident Response");
  sections.push("");
  sections.push("AI-related incidents must be handled according to the organization's Incident Response Plan with the following additional considerations:");
  sections.push("");
  sections.push("| Incident Type | Severity | Immediate Action |");
  sections.push("|---------------|----------|-----------------|");
  sections.push("| Data leak via AI processing | Critical | Disable AI feature, assess data exposure |");
  sections.push("| Systematic bias detected | High | Implement output filtering, conduct investigation |");
  sections.push("| Prompt injection exploit | High | Block attack vector, review all affected outputs |");
  sections.push("| Model producing harmful content | High | Disable feature, apply content filters |");
  sections.push("| Performance degradation / drift | Medium | Investigate root cause, consider rollback |");
  sections.push("| User complaint about AI accuracy | Low-Medium | Review specific case, update training data |");
  sections.push("");
  sections.push("For incidents involving high-risk AI systems under the EU AI Act, the following additional reporting obligations apply:");
  sections.push("");
  sections.push("- Report serious incidents to the relevant national market surveillance authority");
  sections.push("- Notify the AI provider (for third-party AI services)");
  sections.push("- Document corrective actions and timeline");
  sections.push("");

  // ── 10. Review and Audit ────────────────────────────────────────────
  sections.push("## 10. Review and Audit Schedule");
  sections.push("");
  sections.push("| Activity | Frequency | Responsible |");
  sections.push("|----------|-----------|-------------|");
  sections.push("| Framework review and update | Annually | AI Governance Officer |");
  sections.push("| AI risk assessment review | Quarterly | AI Governance Officer + Development Team |");
  sections.push("| Bias testing | Quarterly + pre-deployment | Development Team |");
  sections.push("| Model performance review | Monthly | Development Team |");
  sections.push("| Vendor compliance check | Annually | Compliance Team |");
  sections.push("| Internal AI audit | Annually | Compliance Team |");
  sections.push("| Regulatory landscape review | Quarterly | Compliance Team |");
  sections.push("");

  // ── Contact ─────────────────────────────────────────────────────────
  sections.push("## 11. Contact");
  sections.push("");
  sections.push(`For questions about this AI Governance Framework, contact:`);
  sections.push("");
  sections.push(`- **AI Governance Officer:** [Name] ([email])`);
  sections.push(`- **Data Protection Officer:** ${dpoName} (${dpoEmail})`);
  sections.push(`- **General inquiries:** ${contactEmail}`);
  sections.push("");

  // ── Disclaimer ──────────────────────────────────────────────────────
  sections.push("---");
  sections.push("");
  sections.push(
    `*This AI Governance Framework was generated by [Codepliant](https://github.com/joechensmartz/codepliant) ` +
      `based on an automated scan of the **${scan.projectName}** codebase. ` +
      `It should be reviewed and customized by your legal, compliance, and AI governance teams before adoption.*`
  );

  return sections.join("\n");
}

/**
 * Determine AI risk level based on detected services and data types.
 */
function determineRiskLevel(
  aiServices: DetectedService[]
): "minimal" | "limited" | "high" {
  const HIGH_RISK_PATTERNS = [
    "biometric",
    "emotion recognition",
    "facial recognition",
    "credit scoring",
    "hiring",
    "recruitment",
    "law enforcement",
    "healthcare diagnosis",
    "education assessment",
    "social scoring",
  ];

  const USER_FACING_PATTERNS = [
    "user prompts",
    "conversation history",
    "generated content",
  ];

  for (const service of aiServices) {
    const allText = [
      service.name.toLowerCase(),
      ...service.dataCollected.map((d) => d.toLowerCase()),
    ].join(" ");

    if (HIGH_RISK_PATTERNS.some((p) => allText.includes(p))) {
      return "high";
    }
  }

  for (const service of aiServices) {
    if (
      service.dataCollected.some((d) =>
        USER_FACING_PATTERNS.some((p) => d.toLowerCase().includes(p))
      )
    ) {
      return "limited";
    }
  }

  return "minimal";
}
