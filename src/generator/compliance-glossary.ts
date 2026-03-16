import type { ScanResult, DetectedService } from "../scanner/types.js";
import type { GeneratorContext } from "./index.js";

/**
 * Compliance glossary entry: term, abbreviation, definition, and regulatory source.
 */
interface GlossaryEntry {
  term: string;
  abbreviation?: string;
  definition: string;
  source: string;
}

/**
 * Master compliance glossary — 55+ terms covering GDPR, CCPA, AI Act,
 * SOC 2, ISO 27001, PCI DSS, HIPAA, and general data protection.
 */
const GLOSSARY: GlossaryEntry[] = [
  // ── GDPR Core ───────────────────────────────────────────────────────
  { term: "Data Processing Agreement", abbreviation: "DPA", definition: "A legally binding contract between a data controller and data processor that governs the processing of personal data, including security measures, sub-processing, and data subject rights.", source: "GDPR Art. 28" },
  { term: "Data Subject Access Request", abbreviation: "DSAR", definition: "A request made by an individual to obtain confirmation of whether their personal data is being processed, access to that data, and supplementary information about the processing.", source: "GDPR Art. 15-22" },
  { term: "Data Controller", abbreviation: undefined, definition: "The entity that determines the purposes and means of processing personal data. The controller bears primary responsibility for compliance.", source: "GDPR Art. 4(7)" },
  { term: "Data Processor", abbreviation: undefined, definition: "An entity that processes personal data on behalf of the controller. Processors must act only on the controller's documented instructions.", source: "GDPR Art. 4(8)" },
  { term: "Data Protection Officer", abbreviation: "DPO", definition: "An independent expert appointed to oversee data protection strategy and compliance. Required for public authorities and organizations conducting large-scale systematic monitoring.", source: "GDPR Art. 37-39" },
  { term: "Data Protection Impact Assessment", abbreviation: "DPIA", definition: "A systematic assessment of the necessity, proportionality, and risks of data processing operations, required before processing likely to result in high risk to individuals.", source: "GDPR Art. 35" },
  { term: "Privacy Impact Assessment", abbreviation: "PIA", definition: "A broader risk assessment examining how a project or system may affect the privacy of individuals. Often used interchangeably with DPIA but may be conducted earlier in the project lifecycle.", source: "GDPR Art. 35 / ISO 29134" },
  { term: "Lawful Basis", abbreviation: undefined, definition: "One of six legal grounds under GDPR that must be established before processing personal data: consent, contract, legal obligation, vital interests, public task, or legitimate interests.", source: "GDPR Art. 6" },
  { term: "Legitimate Interest", abbreviation: "LI", definition: "A lawful basis for processing where the controller's or a third party's interests are balanced against the data subject's rights and freedoms.", source: "GDPR Art. 6(1)(f)" },
  { term: "Right to Erasure", abbreviation: "RTBF", definition: "The right of data subjects to have their personal data deleted when it is no longer necessary, consent is withdrawn, or processing is unlawful. Also known as the 'right to be forgotten.'", source: "GDPR Art. 17" },
  { term: "Right to Data Portability", abbreviation: undefined, definition: "The right of data subjects to receive their personal data in a structured, commonly used, and machine-readable format, and to transmit it to another controller.", source: "GDPR Art. 20" },
  { term: "Consent", abbreviation: undefined, definition: "A freely given, specific, informed, and unambiguous indication of the data subject's wishes by which they agree to the processing of their personal data.", source: "GDPR Art. 4(11), Art. 7" },
  { term: "Personal Data", abbreviation: "PD", definition: "Any information relating to an identified or identifiable natural person ('data subject'), including names, emails, IP addresses, location data, and online identifiers.", source: "GDPR Art. 4(1)" },
  { term: "Special Category Data", abbreviation: undefined, definition: "Sensitive personal data revealing racial/ethnic origin, political opinions, religious beliefs, trade union membership, genetic data, biometric data, health data, or sexual orientation. Processing is prohibited except under specific conditions.", source: "GDPR Art. 9" },
  { term: "Pseudonymisation", abbreviation: undefined, definition: "Processing personal data so it can no longer be attributed to a specific data subject without additional information, provided that additional information is kept separately.", source: "GDPR Art. 4(5)" },
  { term: "Data Minimisation", abbreviation: undefined, definition: "The principle that personal data collected must be adequate, relevant, and limited to what is necessary for the purposes of processing.", source: "GDPR Art. 5(1)(c)" },
  { term: "Purpose Limitation", abbreviation: undefined, definition: "The principle that personal data must be collected for specified, explicit, and legitimate purposes and not further processed in a manner incompatible with those purposes.", source: "GDPR Art. 5(1)(b)" },
  { term: "Storage Limitation", abbreviation: undefined, definition: "The principle that personal data must be kept for no longer than necessary for the purposes of processing.", source: "GDPR Art. 5(1)(e)" },
  { term: "Data Breach", abbreviation: undefined, definition: "A security incident leading to the accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to personal data.", source: "GDPR Art. 4(12)" },
  { term: "Breach Notification", abbreviation: undefined, definition: "The obligation to report personal data breaches to the supervisory authority within 72 hours of becoming aware, and to affected data subjects without undue delay when the breach poses a high risk.", source: "GDPR Art. 33-34" },
  { term: "Standard Contractual Clauses", abbreviation: "SCCs", definition: "Pre-approved contractual terms adopted by the European Commission to ensure adequate safeguards for personal data transferred outside the EU/EEA.", source: "GDPR Art. 46(2)(c)" },
  { term: "Binding Corporate Rules", abbreviation: "BCRs", definition: "Internal policies adopted by multinational companies to allow intra-group transfers of personal data outside the EU/EEA, approved by a supervisory authority.", source: "GDPR Art. 47" },
  { term: "Supervisory Authority", abbreviation: "SA / DPA", definition: "An independent public authority established by an EU member state to monitor the application of data protection law (e.g., CNIL in France, ICO in the UK).", source: "GDPR Art. 51" },
  { term: "Record of Processing Activities", abbreviation: "ROPA", definition: "A documented register of all processing activities carried out by the controller or processor, including purposes, data categories, recipients, retention periods, and security measures.", source: "GDPR Art. 30" },
  { term: "Privacy by Design", abbreviation: "PbD", definition: "The principle that data protection should be integrated into system design and business practices from the outset, rather than added retrospectively.", source: "GDPR Art. 25" },
  { term: "Privacy by Default", abbreviation: undefined, definition: "The requirement that, by default, only personal data necessary for each specific purpose is processed, including limiting collection, processing extent, storage period, and accessibility.", source: "GDPR Art. 25(2)" },

  // ── CCPA / CPRA ─────────────────────────────────────────────────────
  { term: "California Consumer Privacy Act", abbreviation: "CCPA", definition: "A California state law granting consumers the right to know what personal information is collected, to delete it, to opt out of its sale, and to non-discrimination for exercising these rights.", source: "CCPA §1798.100-199" },
  { term: "California Privacy Rights Act", abbreviation: "CPRA", definition: "An amendment to CCPA that strengthens consumer privacy rights, creates the California Privacy Protection Agency (CPPA), and introduces the concept of 'sensitive personal information.'", source: "CPRA (Proposition 24)" },
  { term: "Sale of Personal Information", abbreviation: undefined, definition: "Under CCPA/CPRA, selling, renting, releasing, disclosing, or otherwise communicating a consumer's personal information to a third party for monetary or other valuable consideration.", source: "CCPA §1798.140(ad)" },
  { term: "Do Not Sell or Share", abbreviation: "DNS", definition: "A consumer's right under CCPA/CPRA to direct a business not to sell or share their personal information with third parties.", source: "CCPA §1798.120, CPRA" },

  // ── AI Act / AI Governance ──────────────────────────────────────────
  { term: "EU Artificial Intelligence Act", abbreviation: "EU AI Act", definition: "The European Union regulation establishing a risk-based framework for AI systems, categorizing them into unacceptable, high, limited, and minimal risk tiers with corresponding obligations.", source: "EU AI Act (Regulation 2024/1689)" },
  { term: "High-Risk AI System", abbreviation: undefined, definition: "An AI system used in areas such as biometrics, critical infrastructure, employment, credit scoring, or law enforcement that must meet strict requirements for risk management, data governance, transparency, and human oversight.", source: "EU AI Act Art. 6, Annex III" },
  { term: "AI Model Card", abbreviation: undefined, definition: "A standardized document describing an AI model's intended use, performance metrics, limitations, training data, and ethical considerations.", source: "EU AI Act Art. 53 / Mitchell et al. 2019" },
  { term: "Algorithmic Transparency", abbreviation: undefined, definition: "The principle that organizations should provide clear information about how automated decision-making systems work, what data they use, and how they reach their conclusions.", source: "EU AI Act Art. 13-14" },
  { term: "Human-in-the-Loop", abbreviation: "HITL", definition: "A system design where human oversight is required before, during, or after an AI system's decision is applied, especially for high-risk AI systems.", source: "EU AI Act Art. 14" },
  { term: "AI Risk Assessment", abbreviation: undefined, definition: "A systematic evaluation of the potential risks and harms of an AI system to health, safety, and fundamental rights, including bias, discrimination, and privacy impacts.", source: "EU AI Act Art. 9" },

  // ── SOC 2 ───────────────────────────────────────────────────────────
  { term: "SOC 2 Type I", abbreviation: undefined, definition: "A report on the design and implementation of an organization's controls relevant to security, availability, processing integrity, confidentiality, or privacy at a specific point in time.", source: "AICPA TSP Section 100" },
  { term: "SOC 2 Type II", abbreviation: undefined, definition: "A report on the design, implementation, and operating effectiveness of controls over a specified period of time (typically 6-12 months).", source: "AICPA TSP Section 100" },
  { term: "Trust Services Criteria", abbreviation: "TSC", definition: "Five categories — Security, Availability, Processing Integrity, Confidentiality, and Privacy — used to evaluate an organization's controls in a SOC 2 audit.", source: "AICPA TSP Section 100" },

  // ── ISO 27001 ───────────────────────────────────────────────────────
  { term: "Information Security Management System", abbreviation: "ISMS", definition: "A systematic framework of policies, procedures, and controls to manage information security risks and protect the confidentiality, integrity, and availability of information assets.", source: "ISO/IEC 27001:2022" },
  { term: "Statement of Applicability", abbreviation: "SoA", definition: "A document that identifies which ISO 27001 Annex A controls are applicable to the organization and justifies any exclusions.", source: "ISO/IEC 27001:2022 §6.1.3" },
  { term: "Risk Treatment Plan", abbreviation: "RTP", definition: "A document defining the actions, resources, responsibilities, and timelines for addressing identified information security risks.", source: "ISO/IEC 27001:2022 §6.1.3" },

  // ── PCI DSS ─────────────────────────────────────────────────────────
  { term: "Payment Card Industry Data Security Standard", abbreviation: "PCI DSS", definition: "A set of security standards for organizations that handle credit card information, requiring secure network architecture, cardholder data protection, vulnerability management, access control, and monitoring.", source: "PCI SSC, PCI DSS v4.0" },
  { term: "Cardholder Data Environment", abbreviation: "CDE", definition: "The network segment where payment card data is stored, processed, or transmitted, plus any connected systems that could affect its security.", source: "PCI DSS v4.0" },
  { term: "Tokenisation", abbreviation: undefined, definition: "The process of substituting sensitive data (such as credit card numbers) with a non-sensitive equivalent (token) that has no exploitable value.", source: "PCI DSS / NIST" },

  // ── HIPAA ───────────────────────────────────────────────────────────
  { term: "Health Insurance Portability and Accountability Act", abbreviation: "HIPAA", definition: "A US federal law establishing standards for protecting sensitive patient health information from disclosure without patient consent or knowledge.", source: "HIPAA (45 CFR Parts 160, 164)" },
  { term: "Protected Health Information", abbreviation: "PHI", definition: "Any individually identifiable health information held or transmitted by a covered entity or business associate, in any form or medium.", source: "HIPAA §160.103" },
  { term: "Business Associate Agreement", abbreviation: "BAA", definition: "A contract between a HIPAA-covered entity and a business associate that establishes the permitted uses and disclosures of protected health information.", source: "HIPAA §164.502(e), §164.504(e)" },

  // ── General Data Protection / Security ──────────────────────────────
  { term: "Sub-Processor", abbreviation: undefined, definition: "A third-party entity engaged by a data processor to carry out specific processing activities on behalf of the data controller. The processor must obtain authorization before engaging sub-processors.", source: "GDPR Art. 28(2)" },
  { term: "Data Retention Policy", abbreviation: undefined, definition: "A policy defining how long different categories of data are stored, the criteria for retention periods, and the procedures for secure deletion or anonymisation when retention periods expire.", source: "GDPR Art. 5(1)(e), Art. 13(2)(a)" },
  { term: "Incident Response Plan", abbreviation: "IRP", definition: "A documented set of procedures for detecting, containing, analyzing, remediating, and reporting security incidents, including data breaches.", source: "NIST SP 800-61 / GDPR Art. 33" },
  { term: "Vendor Risk Assessment", abbreviation: "VRA", definition: "A systematic evaluation of the security, privacy, and compliance risks posed by third-party vendors and service providers before and during engagement.", source: "ISO 27001 Annex A.15 / NIST CSF" },
  { term: "Business Continuity Plan", abbreviation: "BCP", definition: "A documented plan that outlines how an organization will continue to operate during and after a significant disruption, including data recovery and service restoration.", source: "ISO 22301 / ISO 27001 A.17" },
  { term: "Disaster Recovery Plan", abbreviation: "DRP", definition: "A subset of business continuity planning focused specifically on restoring IT systems, data, and infrastructure after a major incident or disaster.", source: "NIST SP 800-34 / ISO 27031" },
  { term: "Encryption at Rest", abbreviation: undefined, definition: "Cryptographic protection applied to data while it is stored (on disk, in databases, backups), preventing unauthorized access even if storage media is compromised.", source: "NIST SP 800-111 / GDPR Art. 32" },
  { term: "Encryption in Transit", abbreviation: undefined, definition: "Cryptographic protection applied to data while it is being transmitted over networks (TLS/HTTPS), preventing interception or tampering.", source: "NIST SP 800-52 / GDPR Art. 32" },
  { term: "Role-Based Access Control", abbreviation: "RBAC", definition: "An access control method where permissions are assigned to roles rather than individual users, ensuring users only have access necessary for their job function.", source: "NIST SP 800-162 / ISO 27001 A.9" },
  { term: "Principle of Least Privilege", abbreviation: "PoLP", definition: "The security principle that users and systems should be granted only the minimum level of access necessary to perform their required functions.", source: "NIST SP 800-53 / ISO 27001 A.9.4" },
  { term: "Multi-Factor Authentication", abbreviation: "MFA", definition: "An authentication method requiring two or more independent verification factors: something you know (password), something you have (device), or something you are (biometric).", source: "NIST SP 800-63B" },
  { term: "Zero Trust Architecture", abbreviation: "ZTA", definition: "A security model based on the principle 'never trust, always verify' where no user, device, or network is inherently trusted, and continuous verification is required.", source: "NIST SP 800-207" },
];

/**
 * Determine which glossary terms are relevant to the scan results.
 * Returns terms used in generated docs based on detected categories and services.
 */
function selectRelevantTerms(scan: ScanResult): GlossaryEntry[] {
  const categories = new Set(scan.services.map((s) => s.category));
  const hasAI = categories.has("ai");
  const hasPayment = categories.has("payment");
  const hasAnalytics = categories.has("analytics");
  const hasAuth = categories.has("auth");
  const hasMonitoring = categories.has("monitoring");

  // Always include core GDPR + general terms
  const relevant = new Set<string>([
    "Data Processing Agreement",
    "Data Subject Access Request",
    "Data Controller",
    "Data Processor",
    "Personal Data",
    "Lawful Basis",
    "Consent",
    "Data Minimisation",
    "Purpose Limitation",
    "Storage Limitation",
    "Data Breach",
    "Breach Notification",
    "Privacy by Design",
    "Privacy by Default",
    "Record of Processing Activities",
    "Sub-Processor",
    "Data Retention Policy",
    "Incident Response Plan",
    "Vendor Risk Assessment",
    "Standard Contractual Clauses",
    "Supervisory Authority",
    "Right to Erasure",
    "Right to Data Portability",
    "Data Protection Impact Assessment",
    "Data Protection Officer",
    "Pseudonymisation",
    "Encryption at Rest",
    "Encryption in Transit",
    "Role-Based Access Control",
    "Principle of Least Privilege",
  ]);

  // CCPA terms — always relevant for US-facing apps
  relevant.add("California Consumer Privacy Act");
  relevant.add("California Privacy Rights Act");
  relevant.add("Sale of Personal Information");
  relevant.add("Do Not Sell or Share");

  // AI-specific terms
  if (hasAI) {
    relevant.add("EU Artificial Intelligence Act");
    relevant.add("High-Risk AI System");
    relevant.add("AI Model Card");
    relevant.add("Algorithmic Transparency");
    relevant.add("Human-in-the-Loop");
    relevant.add("AI Risk Assessment");
  }

  // Payment-specific terms
  if (hasPayment) {
    relevant.add("Payment Card Industry Data Security Standard");
    relevant.add("Cardholder Data Environment");
    relevant.add("Tokenisation");
  }

  // Analytics-specific terms
  if (hasAnalytics) {
    relevant.add("Special Category Data");
  }

  // Auth-specific terms
  if (hasAuth) {
    relevant.add("Multi-Factor Authentication");
    relevant.add("Zero Trust Architecture");
  }

  // Monitoring-specific terms
  if (hasMonitoring) {
    relevant.add("Business Continuity Plan");
    relevant.add("Disaster Recovery Plan");
  }

  // SOC 2 + ISO terms when enough services present
  if (scan.services.length >= 5) {
    relevant.add("SOC 2 Type I");
    relevant.add("SOC 2 Type II");
    relevant.add("Trust Services Criteria");
    relevant.add("Information Security Management System");
    relevant.add("Statement of Applicability");
    relevant.add("Risk Treatment Plan");
  }

  // HIPAA terms — include for awareness (common in health-adjacent SaaS)
  relevant.add("Health Insurance Portability and Accountability Act");
  relevant.add("Protected Health Information");
  relevant.add("Business Associate Agreement");

  // Supplementary terms
  relevant.add("Privacy Impact Assessment");
  relevant.add("Legitimate Interest");
  relevant.add("Binding Corporate Rules");

  return GLOSSARY.filter((g) => relevant.has(g.term));
}

/**
 * Generate COMPLIANCE_GLOSSARY.md — auto-generated glossary of compliance
 * terms used in generated docs, with definitions and regulatory sources.
 *
 * Returns null when no services are detected.
 */
export function generateComplianceGlossary(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];
  const terms = selectRelevantTerms(scan);

  // Sort alphabetically by term
  terms.sort((a, b) => a.term.localeCompare(b.term));

  const sections: string[] = [];

  // ── Title ────────────────────────────────────────────────────────────

  sections.push(`# Compliance Glossary

**Last updated:** ${date}

**Project:** ${scan.projectName}

**Organization:** ${company}

---

> This glossary defines compliance and data protection terms used throughout the compliance documentation generated for **${scan.projectName}**. Terms are sourced from GDPR, CCPA/CPRA, EU AI Act, SOC 2, ISO 27001, PCI DSS, HIPAA, and general data protection standards.

*${terms.length} terms defined based on ${scan.services.length} detected services.*

---`);

  // ── Quick Reference Table ────────────────────────────────────────────

  const abbreviatedTerms = terms.filter((t) => t.abbreviation);

  if (abbreviatedTerms.length > 0) {
    let table = `## Abbreviations Quick Reference

| Abbreviation | Full Term | Source |
|-------------|-----------|--------|`;

    for (const t of abbreviatedTerms) {
      table += `\n| **${t.abbreviation}** | ${t.term} | ${t.source} |`;
    }

    sections.push(table);
    sections.push("---");
  }

  // ── Full Glossary ────────────────────────────────────────────────────

  sections.push("## Full Glossary\n");

  // Group by first letter
  let currentLetter = "";
  for (const t of terms) {
    const letter = t.term[0].toUpperCase();
    if (letter !== currentLetter) {
      currentLetter = letter;
      sections.push(`### ${letter}\n`);
    }

    const abbr = t.abbreviation ? ` (${t.abbreviation})` : "";
    sections.push(`**${t.term}${abbr}**
> ${t.definition}
> *Source: ${t.source}*
`);
  }

  // ── Regulatory Framework Summary ─────────────────────────────────────

  const categories = new Set(scan.services.map((s) => s.category));
  const frameworks: string[] = [];

  frameworks.push("- **GDPR** — General Data Protection Regulation (EU/EEA) — Applies to processing of personal data of EU residents");
  frameworks.push("- **CCPA/CPRA** — California Consumer Privacy Act / California Privacy Rights Act — Applies to businesses handling California residents' data");

  if (categories.has("ai")) {
    frameworks.push("- **EU AI Act** — European Union Artificial Intelligence Act — Risk-based framework for AI systems operating in or affecting the EU market");
  }
  if (categories.has("payment")) {
    frameworks.push("- **PCI DSS** — Payment Card Industry Data Security Standard — Required for all entities that store, process, or transmit cardholder data");
  }
  if (scan.services.length >= 5) {
    frameworks.push("- **SOC 2** — Service Organization Control 2 — Trust-based audit framework for service providers storing customer data in the cloud");
    frameworks.push("- **ISO 27001** — International standard for information security management systems (ISMS)");
  }
  frameworks.push("- **HIPAA** — Health Insurance Portability and Accountability Act — Required for entities handling protected health information (PHI)");

  sections.push(`---

## Applicable Regulatory Frameworks

The following regulatory frameworks may apply to **${scan.projectName}** based on the detected services and data processing activities:

${frameworks.join("\n")}

---

## How to Use This Glossary

1. **During document review** — Reference this glossary when reviewing any generated compliance document to ensure consistent understanding of terms
2. **Onboarding** — Share with new team members joining the compliance or engineering team
3. **Stakeholder communication** — Use as a reference when explaining compliance obligations to non-technical stakeholders
4. **Audit preparation** — Provide to auditors alongside your compliance documentation to demonstrate organizational awareness

---

## Maintaining This Glossary

- **Review frequency:** Annually, or whenever new regulations come into effect
- **Ownership:** Data Protection Officer / Compliance Team
- **Update process:** Re-run Codepliant to regenerate from current codebase; new terms are added automatically when new service categories are detected

---

*This glossary was generated by [Codepliant](https://github.com/codepliant/codepliant) based on automated code analysis. Definitions are based on official regulatory texts and industry standards. Consult qualified legal counsel for authoritative interpretations.*`);

  return sections.join("\n\n");
}
