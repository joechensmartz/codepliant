import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates a DPO_HANDBOOK.md — a comprehensive guide for the appointed
 * Data Protection Officer based on GDPR Articles 37-39.
 *
 * Always generated when services are detected (every organization processing
 * personal data should consider DPO responsibilities).
 */
export function generateDPOHandbook(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  if (scan.services.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const dpoName = ctx?.dpoName || "[Data Protection Officer Name]";
  const dpoEmail = ctx?.dpoEmail || "[dpo@example.com]";
  const website = ctx?.website || "[https://yoursite.com]";
  const date = new Date().toISOString().split("T")[0];

  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasHealth = scan.complianceNeeds.some(
    (n) => n.document === "HIPAA Compliance"
  );
  const serviceCount = scan.services.length;
  const categories = [...new Set(scan.services.map((s) => s.category))];

  const sections: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────
  sections.push("# Data Protection Officer Handbook");
  sections.push("");
  sections.push(`**Organization:** ${company}`);
  sections.push(`**DPO:** ${dpoName} (${dpoEmail})`);
  sections.push(`**Last updated:** ${date}`);
  sections.push("");
  sections.push(
    `This handbook outlines the responsibilities, reporting structure, and operational procedures ` +
      `for the Data Protection Officer (DPO) at **${company}**, in accordance with GDPR Articles 37-39.`
  );

  // ── 1. Role and Appointment ─────────────────────────────────────────
  sections.push("");
  sections.push("## 1. Role and Appointment (GDPR Art. 37)");
  sections.push("");
  sections.push("### 1.1 When a DPO Is Required");
  sections.push("");
  sections.push("A DPO must be designated when:");
  sections.push("");
  sections.push("- The processing is carried out by a public authority or body");
  sections.push("- Core activities require regular and systematic monitoring of data subjects at scale");
  sections.push("- Core activities involve large-scale processing of special categories of data");
  sections.push("");

  const mandatoryReasons: string[] = [];
  if (serviceCount >= 5) mandatoryReasons.push(`${serviceCount} third-party data processors detected (systematic processing at scale)`);
  if (hasAI) mandatoryReasons.push("AI services detected (automated decision-making / profiling)");
  if (hasHealth) mandatoryReasons.push("Health data processing detected (special category data)");

  if (mandatoryReasons.length > 0) {
    sections.push(`**Assessment for ${company}:** A DPO is likely **mandatory** based on:`);
    sections.push("");
    for (const reason of mandatoryReasons) {
      sections.push(`- ${reason}`);
    }
  } else {
    sections.push(`**Assessment for ${company}:** While a DPO may not be strictly mandatory, appointing one is **strongly recommended** as a best practice.`);
  }

  sections.push("");
  sections.push("### 1.2 Appointment Requirements");
  sections.push("");
  sections.push("The DPO must:");
  sections.push("");
  sections.push("- Be appointed based on **professional qualities**, in particular expert knowledge of data protection law and practices");
  sections.push("- Be either a staff member or engaged under a service contract");
  sections.push("- Be provided with resources necessary to carry out their tasks");
  sections.push("- Be given access to personal data and processing operations");
  sections.push("- Not be dismissed or penalized for performing their DPO tasks");

  // ── 2. Position and Independence ────────────────────────────────────
  sections.push("");
  sections.push("## 2. Position and Independence (GDPR Art. 38)");
  sections.push("");
  sections.push("### 2.1 Reporting Structure");
  sections.push("");
  sections.push("```");
  sections.push("┌─────────────────────┐");
  sections.push("│   Board / CEO       │");
  sections.push("│   (Direct report)   │");
  sections.push("└─────────┬───────────┘");
  sections.push("          │");
  sections.push("          ▼");
  sections.push("┌─────────────────────┐");
  sections.push(`│   DPO               │`);
  sections.push(`│   ${dpoName.substring(0, 17).padEnd(17)} │`);
  sections.push("└─────────┬───────────┘");
  sections.push("          │");
  sections.push("    ┌─────┼─────┐");
  sections.push("    ▼     ▼     ▼");
  sections.push("  Legal  IT  Business");
  sections.push("  Team   Team  Units");
  sections.push("```");
  sections.push("");
  sections.push("### 2.2 Independence Requirements");
  sections.push("");
  sections.push("- The DPO **reports directly** to the highest level of management");
  sections.push("- The DPO shall **not receive instructions** regarding the exercise of their tasks");
  sections.push("- The DPO shall **not be dismissed or penalized** for performing their duties");
  sections.push("- The DPO may fulfill other tasks, provided they do not result in a **conflict of interest**");
  sections.push("");
  sections.push("### 2.3 Conflict of Interest");
  sections.push("");
  sections.push("The DPO must **not** simultaneously hold any of these roles:");
  sections.push("");
  sections.push("| Role | Why It Conflicts |");
  sections.push("| ---- | ---------------- |");
  sections.push("| CEO / Managing Director | Determines purposes of processing |");
  sections.push("| CFO | Determines financial data processing |");
  sections.push("| Head of Marketing | Decides on marketing data usage |");
  sections.push("| Head of HR | Decides on employee data processing |");
  sections.push("| Head of IT | Implements technical processing decisions |");

  // ── 3. Tasks and Responsibilities ───────────────────────────────────
  sections.push("");
  sections.push("## 3. Tasks and Responsibilities (GDPR Art. 39)");
  sections.push("");
  sections.push("### 3.1 Core Tasks");
  sections.push("");
  sections.push("| Task | Description | Frequency |");
  sections.push("| ---- | ----------- | --------- |");
  sections.push("| **Inform and advise** | Advise the organization and employees on data protection obligations | Ongoing |");
  sections.push("| **Monitor compliance** | Oversee compliance with GDPR and internal policies | Continuous |");
  sections.push("| **Training** | Organize staff awareness and training programs | Quarterly |");
  sections.push("| **DPIA oversight** | Advise on Data Protection Impact Assessments | Per project |");
  sections.push("| **Supervisory authority** | Act as contact point for the supervisory authority | As needed |");
  sections.push("| **Data subject requests** | Oversee DSAR handling process | As received |");
  sections.push("| **Breach management** | Coordinate breach notification procedures | As needed |");
  sections.push("| **Records maintenance** | Maintain records of processing activities (Art. 30) | Quarterly review |");
  sections.push("");
  sections.push("### 3.2 Operational Checklist");
  sections.push("");
  sections.push("#### Daily");
  sections.push("");
  sections.push("- [ ] Review incoming DSAR requests");
  sections.push("- [ ] Monitor security incident alerts for potential data breaches");
  sections.push("- [ ] Check DPO email inbox for data subject inquiries");
  sections.push("");
  sections.push("#### Weekly");
  sections.push("");
  sections.push("- [ ] Review new vendor/service integrations for data protection implications");
  sections.push("- [ ] Check DSAR response deadlines (30-day timer)");
  sections.push("- [ ] Review any pending consent changes or policy updates");
  sections.push("");
  sections.push("#### Monthly");
  sections.push("");
  sections.push("- [ ] Update Record of Processing Activities if changes occurred");
  sections.push("- [ ] Review sub-processor list for additions or changes");
  sections.push("- [ ] Assess any new processing activities for DPIA necessity");
  sections.push("- [ ] Report compliance status to management");
  sections.push("");
  sections.push("#### Quarterly");
  sections.push("");
  sections.push("- [ ] Conduct staff data protection awareness training");
  sections.push("- [ ] Review and update privacy policies and notices");
  sections.push("- [ ] Audit consent management mechanisms");
  sections.push("- [ ] Review data retention and deletion practices");
  sections.push("- [ ] Update risk register and mitigation measures");
  sections.push("");
  sections.push("#### Annually");
  sections.push("");
  sections.push("- [ ] Comprehensive compliance audit");
  sections.push("- [ ] Review and update DPIAs for existing high-risk processing");
  sections.push("- [ ] Update transfer impact assessments");
  sections.push("- [ ] Submit annual report to board/management");
  sections.push("- [ ] Review and renew DPA agreements with processors");

  // ── 4. Escalation Procedures ────────────────────────────────────────
  sections.push("");
  sections.push("## 4. Escalation Procedures");
  sections.push("");
  sections.push("### 4.1 Escalation Matrix");
  sections.push("");
  sections.push("| Situation | Escalation Level | Timeline | Action |");
  sections.push("| --------- | ---------------- | -------- | ------ |");
  sections.push("| Routine DSAR | DPO handles directly | 30 days max | Process and respond |");
  sections.push("| Complex DSAR (multiple systems) | DPO + IT Lead | 30 days max | Coordinate data retrieval |");
  sections.push("| Minor data incident (no breach) | DPO + IT Security | 24 hours assessment | Investigate and document |");
  sections.push("| Confirmed data breach | DPO + CEO + Legal | 72 hours to authority | Notify authority, assess user notification |");
  sections.push("| Regulatory inquiry | DPO + Legal Counsel | Immediate | Cooperate and respond |");
  sections.push("| DPO advice rejected by management | DPO documents in writing | Record immediately | Formal written objection |");
  sections.push("");
  sections.push("### 4.2 Data Breach Escalation");
  sections.push("");
  sections.push("```");
  sections.push("Incident Detected");
  sections.push("       │");
  sections.push("       ▼");
  sections.push("┌──────────────────┐    No    ┌──────────────┐");
  sections.push("│ Personal data    │────────▶│ IT Security  │");
  sections.push("│ involved?        │         │ handles      │");
  sections.push("└────────┬─────────┘         └──────────────┘");
  sections.push("    Yes  │");
  sections.push("         ▼");
  sections.push("┌──────────────────┐");
  sections.push("│ DPO notified     │");
  sections.push("│ (within 1 hour)  │");
  sections.push("└────────┬─────────┘");
  sections.push("         │");
  sections.push("         ▼");
  sections.push("┌──────────────────┐    Low   ┌──────────────┐");
  sections.push("│ Risk to rights   │────────▶│ Document     │");
  sections.push("│ and freedoms?    │         │ internally   │");
  sections.push("└────────┬─────────┘         └──────────────┘");
  sections.push("   High  │");
  sections.push("         ▼");
  sections.push("┌──────────────────┐");
  sections.push("│ Notify authority │");
  sections.push("│ within 72 hours  │");
  sections.push("└────────┬─────────┘");
  sections.push("         │");
  sections.push("         ▼");
  sections.push("┌──────────────────┐");
  sections.push("│ Notify affected  │");
  sections.push("│ individuals      │");
  sections.push("└──────────────────┘");
  sections.push("```");

  // ── 5. DSAR Handling Process ────────────────────────────────────────
  sections.push("");
  sections.push("## 5. DSAR Handling Process");
  sections.push("");
  sections.push("### 5.1 Response Timeline");
  sections.push("");
  sections.push("| Step | Deadline | Responsible |");
  sections.push("| ---- | -------- | ----------- |");
  sections.push("| Request received | Day 0 | DPO |");
  sections.push("| Identity verification | Day 1-3 | DPO |");
  sections.push("| Scope assessment | Day 3-5 | DPO |");
  sections.push("| Data collection from systems | Day 5-20 | DPO + IT |");
  sections.push("| Review and redaction | Day 20-25 | DPO + Legal |");
  sections.push("| Response to data subject | Day 25-30 (max) | DPO |");
  sections.push("");
  sections.push(`### 5.2 Systems to Query (${serviceCount} detected)`);
  sections.push("");

  for (const service of scan.services) {
    sections.push(`- **${service.name}** (${service.category}): ${service.dataCollected.slice(0, 3).join(", ")}`);
  }

  // ── 6. Conditional: AI-Specific Responsibilities ────────────────────
  if (hasAI) {
    sections.push("");
    sections.push("## 6. AI-Specific DPO Responsibilities");
    sections.push("");
    sections.push("AI services have been detected in this project. The DPO has additional responsibilities under the EU AI Act and GDPR:");
    sections.push("");
    sections.push("- **Automated decision-making (Art. 22):** Ensure data subjects are informed and can request human review");
    sections.push("- **DPIA for AI:** Conduct or advise on DPIAs for AI processing that is likely high-risk");
    sections.push("- **AI transparency:** Verify AI disclosure documents are accurate and up-to-date");
    sections.push("- **Training data governance:** Oversee data used for AI training, ensure lawful basis");
    sections.push("- **Bias monitoring:** Review AI outputs for discriminatory patterns or bias");
    sections.push("- **Vendor AI agreements:** Review AI provider DPAs for adequate safeguards");
  }

  // ── 7. Conditional: Payment Data Responsibilities ───────────────────
  if (hasPayment) {
    const sectionNum = hasAI ? "7" : "6";
    sections.push("");
    sections.push(`## ${sectionNum}. Payment Data Responsibilities`);
    sections.push("");
    sections.push("Payment services have been detected. Additional DPO responsibilities include:");
    sections.push("");
    sections.push("- **PCI DSS coordination:** Ensure payment data handling meets PCI DSS requirements");
    sections.push("- **Financial data retention:** Verify retention periods comply with tax and accounting laws (typically 7 years)");
    sections.push("- **Payment processor oversight:** Review DPAs with payment processors (Stripe, PayPal, etc.)");
    sections.push("- **Cardholder data scope:** Minimize the scope of cardholder data your systems touch");
  }

  // ── Resources and Contact ───────────────────────────────────────────
  const resourceSectionNum = hasAI && hasPayment ? "8" : hasAI || hasPayment ? "7" : "6";
  sections.push("");
  sections.push(`## ${resourceSectionNum}. Key Contacts and Resources`);
  sections.push("");
  sections.push("### Internal Contacts");
  sections.push("");
  sections.push("| Role | Name | Email |");
  sections.push("| ---- | ---- | ----- |");
  sections.push(`| Data Protection Officer | ${dpoName} | ${dpoEmail} |`);
  sections.push(`| General Contact | [Name] | ${contactEmail} |`);
  sections.push("| Legal Counsel | [Name] | [email] |");
  sections.push("| IT Security Lead | [Name] | [email] |");
  sections.push("| HR Lead | [Name] | [email] |");
  sections.push("");
  sections.push("### Supervisory Authorities");
  sections.push("");
  sections.push("| Authority | Jurisdiction | Website |");
  sections.push("| --------- | ------------ | ------- |");
  sections.push("| [Your lead authority] | [Country] | [URL] |");
  sections.push("| ICO | United Kingdom | https://ico.org.uk |");
  sections.push("| CNIL | France | https://www.cnil.fr |");
  sections.push("| BfDI | Germany | https://www.bfdi.bund.de |");
  sections.push("| DPC | Ireland | https://www.dataprotection.ie |");
  sections.push("");
  sections.push("### Key Regulations");
  sections.push("");
  sections.push("- **GDPR** — General Data Protection Regulation (EU) 2016/679");
  sections.push("- **ePrivacy Directive** — Directive 2002/58/EC (cookies, electronic communications)");

  if (hasAI) {
    sections.push("- **EU AI Act** — Regulation (EU) 2024/1689");
  }
  if (hasPayment) {
    sections.push("- **PCI DSS** — Payment Card Industry Data Security Standard");
  }
  if (hasHealth) {
    sections.push("- **HIPAA** — Health Insurance Portability and Accountability Act");
  }

  const jurisdictions = ctx?.jurisdictions || [];
  if (jurisdictions.includes("CCPA")) {
    sections.push("- **CCPA/CPRA** — California Consumer Privacy Act / California Privacy Rights Act");
  }
  if (jurisdictions.includes("UK GDPR")) {
    sections.push("- **UK GDPR** — Data Protection Act 2018 (UK)");
  }

  // ── Disclaimer ─────────────────────────────────────────────────────
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push(
    `*This DPO Handbook was generated by [Codepliant](https://github.com/joechensmartz/codepliant) ` +
      `based on an automated scan of the **${scan.projectName}** codebase. ` +
      `It should be reviewed and customized by your legal team and appointed DPO before adoption.*`
  );
  sections.push("");

  return sections.join("\n");
}
