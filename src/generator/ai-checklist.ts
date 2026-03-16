import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";
import { classifyAIRisk } from "./ai-disclosure.js";

/**
 * Generates an EU AI Act compliance checklist based on detected AI services
 * and their risk classification. Only generated when AI services are detected.
 */
export function generateAIChecklist(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  const aiServices = scan.services.filter((s) => s.category === "ai");

  if (aiServices.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];
  const riskLevel = classifyAIRisk(scan.services, ctx);
  const riskLabel = riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);

  const sections: string[] = [];

  // ── Title ──────────────────────────────────────────────────────────

  sections.push(`# EU AI Act Compliance Checklist

**Organisation:** ${company}
**Project:** ${scan.projectName}
**Risk Classification:** ${riskLabel}
**Generated:** ${date}

---

> This checklist is based on the EU Artificial Intelligence Act (Regulation (EU) 2024/1689). Full transparency obligations take effect on **2 August 2026**. Use this checklist to track your compliance progress.

**AI Services Detected:** ${aiServices.map((s) => s.name).join(", ")}`);

  // ── Transparency ───────────────────────────────────────────────────

  sections.push(`
## Transparency

- [ ] Users are clearly informed when they are interacting with an AI system (Art. 50(1))
- [ ] AI disclosure statement is published and accessible from the application
- [ ] AI disclosure is provided at or before the user's first interaction with AI features (Art. 50(5))
- [ ] Disclosure meets accessibility standards per Directive (EU) 2019/882
- [ ] AI-generated content is clearly labelled as such to users
- [ ] Synthetic media (images, audio, video) is disclosed as AI-generated (Art. 50(4))
- [ ] AI-generated text published to inform the public is labelled as artificially generated
- [ ] Users are informed about the limitations and potential inaccuracies of AI outputs`);

  // ── Documentation ──────────────────────────────────────────────────

  sections.push(`
## Documentation

- [ ] Complete inventory of all AI systems used in the application is maintained
- [ ] Each AI system's purpose, provider, and data processed is documented
- [ ] AI provider agreements and data processing terms are reviewed and on file
- [ ] Data processing records (GDPR Art. 30) include AI service providers
- [ ] AI disclosure statement is reviewed and updated at least annually
- [ ] Changes to AI systems or providers are reflected in documentation within 30 days
- [ ] Records of AI risk classification rationale are maintained`);

  // ── Human Oversight ────────────────────────────────────────────────

  sections.push(`
## Human Oversight

- [ ] AI features do not make autonomous decisions with legal or similarly significant effects
- [ ] A process exists for users to request human review of AI-assisted decisions
- [ ] Staff responsible for human review are identified and trained
- [ ] Response time for human review requests is defined and communicated
- [ ] AI outputs that may affect user rights are subject to human verification before action
- [ ] Override mechanisms exist to correct or reverse AI-generated decisions
- [ ] Regular audits of AI decision quality are conducted`);

  // ── Incident Reporting ─────────────────────────────────────────────

  sections.push(`
## Incident Reporting

- [ ] Process exists to identify and report serious AI-related incidents
- [ ] Contact information for relevant national supervisory authority is on file
- [ ] Incident reporting timeline is defined (serious incidents must be reported promptly)
- [ ] Internal escalation procedure for AI malfunctions or harmful outputs is established
- [ ] Log of AI-related incidents and corrective actions is maintained
- [ ] Users have a clear channel to report concerns about AI behaviour`);

  // ── Content Marking ────────────────────────────────────────────────

  sections.push(`
## Content Marking (Art. 50(2))

- [ ] Technical mechanism is implemented to mark AI-generated content as machine-readable
- [ ] Marking method is interoperable with standard detection tools
- [ ] Marking is applied at the point of content generation
- [ ] C2PA content credentials, watermarking, or equivalent metadata standard is adopted
- [ ] Compliance with the EU Code of Practice on marking AI-generated content is verified
- [ ] Marking cannot be easily removed or circumvented by end users`);

  // ── High-Risk extras ───────────────────────────────────────────────

  if (riskLevel === "high") {
    sections.push(`
## High-Risk System Requirements (Title III)

- [ ] Conformity assessment completed before placing AI system on the market
- [ ] Risk management system established, documented, and maintained (Art. 9)
- [ ] Data governance and data quality requirements met (Art. 10)
- [ ] Technical documentation prepared and maintained (Art. 11)
- [ ] Automatic logging and record-keeping enabled (Art. 12)
- [ ] Transparency information and instructions for use provided to deployers (Art. 13)
- [ ] Human oversight measures designed and implemented (Art. 14)
- [ ] Accuracy, robustness, and cybersecurity requirements addressed (Art. 15)
- [ ] AI system registered in the EU database (Art. 49)
- [ ] Post-market monitoring system established (Art. 72)
- [ ] Serious incident reporting procedures in place (Art. 73)
- [ ] Quality management system implemented (Art. 17)`);
  }

  // ── Data Protection ────────────────────────────────────────────────

  sections.push(`
## Data Protection

- [ ] Data processing agreements are in place with all AI service providers
- [ ] Cross-border data transfer safeguards are documented (SCCs, EU-US DPF, adequacy decisions)
- [ ] Data minimisation principle is applied to data sent to AI providers
- [ ] Data retention policies for AI interaction data are defined
- [ ] Users can request deletion of their data from AI processing pipelines
- [ ] Privacy impact assessment (DPIA) has been conducted for AI features
- [ ] AI provider data processing policies are reviewed for GDPR compliance`);

  // ── Footer ─────────────────────────────────────────────────────────

  sections.push(`
---

*This checklist was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. It is intended as a compliance tracking aid and should be reviewed by a legal professional. The EU AI Act requirements may evolve as implementing acts and codes of practice are finalised.*`);

  return sections.join("\n");
}
