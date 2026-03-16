import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates a Compliance Notes document summarizing applicable regulations
 * based on detected services and configured jurisdictions.
 */
export function generateComplianceNotes(scan: ScanResult, ctx?: GeneratorContext): string | null {
  if (scan.services.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];
  const jurisdictions = ctx?.jurisdictions || [];
  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasAuth = scan.services.some((s) => s.category === "auth");
  const hasAnalytics = scan.services.some(
    (s) => s.category === "analytics" || s.category === "advertising"
  );

  // Determine which regulations apply
  const showGDPR =
    jurisdictions.length === 0 || // default: always show GDPR
    jurisdictions.includes("gdpr");
  const companyLocation = ctx?.companyLocation || "";
  const showCCPA =
    jurisdictions.includes("ccpa") ||
    companyLocation.toUpperCase() === "US" ||
    hasAnalytics;
  const showUKGDPR = jurisdictions.includes("uk-gdpr");

  const sections: string[] = [];
  let sectionNum = 0;

  function nextSection(): number {
    return ++sectionNum;
  }

  // ── Title ─────────────────────────────────────────────────────────

  sections.push(`# Compliance Notes

**Company:** ${company}
**Last updated:** ${date}
**Project:** ${scan.projectName}

---

This document provides an overview of privacy and data protection regulations that may apply to your project based on the services detected in your codebase and your configured jurisdictions.

> **Disclaimer:** This is not legal advice. Consult qualified legal counsel to determine your specific compliance obligations.`);

  // ── Detected Services Summary ─────────────────────────────────────

  {
    let servicesSection = `\n## ${nextSection()}. Detected Services Summary\n\n`;
    servicesSection += `| Service | Category | Data Collected |\n`;
    servicesSection += `|---------|----------|----------------|\n`;

    for (const service of scan.services) {
      servicesSection += `| ${service.name} | ${formatCategory(service.category)} | ${service.dataCollected.slice(0, 3).join(", ")} |\n`;
    }

    sections.push(servicesSection);
  }

  // ── GDPR ──────────────────────────────────────────────────────────

  if (showGDPR) {
    let gdprSection = `\n## ${nextSection()}. General Data Protection Regulation (GDPR)\n\n`;
    gdprSection += `**Applies to:** Processing of personal data of individuals in the EU/EEA\n`;
    gdprSection += `**Enforcement date:** May 25, 2018\n`;
    gdprSection += `**Maximum fine:** EUR 20 million or 4% of annual global turnover\n\n`;
    gdprSection += `### Key Requirements\n\n`;
    gdprSection += `- [ ] Identify a lawful basis for each processing activity (Art. 6)\n`;
    gdprSection += `- [ ] Provide a privacy notice covering all Art. 13 requirements\n`;
    gdprSection += `- [ ] Implement data subject rights procedures (access, rectification, erasure, portability, objection, restriction)\n`;
    gdprSection += `- [ ] Maintain a Record of Processing Activities (Art. 30)\n`;
    gdprSection += `- [ ] Conduct Data Protection Impact Assessments where required (Art. 35)\n`;
    gdprSection += `- [ ] Ensure appropriate technical and organisational security measures (Art. 32)\n`;

    const usBasedServices = scan.services.filter((s) =>
      isUSBased(s.name)
    );
    if (usBasedServices.length > 0) {
      gdprSection += `- [ ] Implement transfer safeguards (SCCs/DPF) for ${usBasedServices.length} US-based service(s)\n`;
    }

    if (hasAI) {
      gdprSection += `- [ ] Address automated decision-making requirements (Art. 22)\n`;
      gdprSection += `- [ ] Comply with EU AI Act transparency obligations (Art. 50) — enforcement August 2, 2026\n`;
    }

    if (hasAnalytics) {
      gdprSection += `- [ ] Implement cookie consent mechanism (ePrivacy Directive)\n`;
    }

    gdprSection += `- [ ] Appoint a Data Protection Officer if required (Art. 37)\n`;
    gdprSection += `- [ ] Establish data breach notification procedures (72-hour requirement, Art. 33)\n`;

    sections.push(gdprSection);
  }

  // ── CCPA ──────────────────────────────────────────────────────────

  if (showCCPA) {
    let ccpaSection = `\n## ${nextSection()}. California Consumer Privacy Act (CCPA/CPRA)\n\n`;
    ccpaSection += `**Applies to:** Businesses that collect personal information of California residents\n`;
    ccpaSection += `**Enforcement date:** January 1, 2020 (CCPA); January 1, 2023 (CPRA amendments)\n`;
    ccpaSection += `**Maximum fine:** $7,500 per intentional violation\n\n`;
    ccpaSection += `### Key Requirements\n\n`;
    ccpaSection += `- [ ] Provide a "Do Not Sell or Share My Personal Information" link\n`;
    ccpaSection += `- [ ] Disclose categories of personal information collected and purposes\n`;
    ccpaSection += `- [ ] Honor opt-out requests within 15 business days\n`;
    ccpaSection += `- [ ] Respond to consumer requests within 45 days\n`;
    ccpaSection += `- [ ] Provide at least two methods for consumers to submit requests\n`;
    ccpaSection += `- [ ] Include CCPA-specific disclosures in your privacy policy\n`;
    ccpaSection += `- [ ] Honor Global Privacy Control (GPC) signals\n`;

    if (hasAnalytics) {
      ccpaSection += `- [ ] Review analytics service data sharing — may constitute "sale" or "sharing" under CCPA\n`;
    }

    if (hasPayment) {
      ccpaSection += `- [ ] Ensure payment processors have appropriate data processing agreements\n`;
    }

    sections.push(ccpaSection);
  }

  // ── UK GDPR ───────────────────────────────────────────────────────

  if (showUKGDPR) {
    let ukSection = `\n## ${nextSection()}. UK General Data Protection Regulation (UK GDPR)\n\n`;
    ukSection += `**Applies to:** Processing of personal data of individuals in the United Kingdom\n`;
    ukSection += `**Supervisory authority:** Information Commissioner's Office (ICO)\n`;
    ukSection += `**Maximum fine:** GBP 17.5 million or 4% of annual global turnover\n\n`;
    ukSection += `### Key Requirements\n\n`;
    ukSection += `UK GDPR mirrors EU GDPR with the following UK-specific considerations:\n\n`;
    ukSection += `- [ ] Register with the ICO if required (Data Protection Fee)\n`;
    ukSection += `- [ ] Use UK International Data Transfer Agreement (IDTA) or UK Addendum to EU SCCs for international transfers\n`;
    ukSection += `- [ ] Reference UK adequacy decisions (not EU) for transfer assessments\n`;
    ukSection += `- [ ] Appoint a UK representative if not established in the UK (Art. 27 equivalent)\n`;
    ukSection += `- [ ] Follow ICO guidance on cookies and similar technologies (PECR)\n`;

    if (hasAI) {
      ukSection += `- [ ] Monitor ICO AI and data protection guidance\n`;
    }

    sections.push(ukSection);
  }

  // ── ePrivacy Directive ──────────────────────────────────────────────

  if (hasAnalytics || hasAuth) {
    let eprivacySection = `\n## ${nextSection()}. ePrivacy Directive (2002/58/EC)\n\n`;
    eprivacySection += `**Applies to:** Any service that uses cookies or similar tracking technologies for users in the EU/EEA\n`;
    eprivacySection += `**Key article:** Article 5(3) — prior opt-in consent for non-essential cookies\n`;
    eprivacySection += `**Enforcement:** National data protection authorities (e.g., CNIL fined SHEIN EUR 150M in 2026)\n\n`;
    eprivacySection += `### Key Requirements\n\n`;
    eprivacySection += `- [ ] Obtain prior opt-in consent before setting non-essential cookies\n`;
    eprivacySection += `- [ ] Provide granular cookie consent controls (accept analytics but reject marketing)\n`;
    eprivacySection += `- [ ] Ensure equal access to service regardless of cookie consent decision\n`;
    eprivacySection += `- [ ] Make consent withdrawal as easy as giving consent\n`;
    eprivacySection += `- [ ] Document and store consent records\n`;
    eprivacySection += `- [ ] Implement complete consent signaling from banner through CMP to all tracking tools\n`;

    if (hasAnalytics) {
      eprivacySection += `- [ ] Classify detected analytics cookies and ensure each requires consent\n`;
    }

    eprivacySection += `\n> See the generated **Cookie Policy** document for details on detected cookies and tracking technologies.\n`;

    sections.push(eprivacySection);
  }

  // ── EU AI Act (if applicable) ──────────────────────────────────────

  if (hasAI) {
    let aiSection = `\n## ${nextSection()}. EU AI Act (Regulation 2024/1689)\n\n`;
    aiSection += `**Applies to:** Providers and deployers of AI systems in the EU\n`;
    aiSection += `**Transparency obligations enforcement:** August 2, 2026\n`;
    aiSection += `**Maximum fine:** EUR 35 million or 7% of annual global turnover\n\n`;
    aiSection += `### Key Requirements for Deployers\n\n`;
    aiSection += `- [ ] Classify AI systems by risk level (minimal, limited, high, unacceptable)\n`;
    aiSection += `- [ ] Provide transparency disclosures per Article 50\n`;
    aiSection += `- [ ] Implement human oversight measures\n`;
    aiSection += `- [ ] Mark AI-generated content in machine-readable format (Art. 50(2))\n`;
    aiSection += `- [ ] Maintain documentation of AI system usage\n\n`;
    aiSection += `> See the generated **AI Disclosure** and **AI Act Compliance Checklist** documents for detailed requirements.\n`;

    sections.push(aiSection);
  }

  // ── HIPAA ──────────────────────────────────────────────────────────

  const hasHIPAA = scan.complianceNeeds.some((n) => n.document === "HIPAA Compliance");
  if (hasHIPAA) {
    let hipaaSection = `\n## ${nextSection()}. Health Insurance Portability and Accountability Act (HIPAA)\n\n`;
    hipaaSection += `**Applies to:** Covered entities and business associates that handle Protected Health Information (PHI)\n`;
    hipaaSection += `**Enforcement:** U.S. Department of Health and Human Services (HHS) Office for Civil Rights (OCR)\n`;
    hipaaSection += `**Maximum civil penalty:** $2,067,813 per violation category per year\n\n`;
    hipaaSection += `### Key Requirements\n\n`;
    hipaaSection += `- [ ] Conduct a risk analysis to identify threats to ePHI (45 CFR § 164.308(a)(1))\n`;
    hipaaSection += `- [ ] Implement access controls — unique user IDs, emergency access, automatic logoff, encryption (§ 164.312(a))\n`;
    hipaaSection += `- [ ] Implement audit controls to record and examine access to ePHI (§ 164.312(b))\n`;
    hipaaSection += `- [ ] Ensure transmission security — encrypt ePHI in transit (§ 164.312(e))\n`;
    hipaaSection += `- [ ] Execute Business Associate Agreements (BAAs) with all vendors that access PHI (§ 164.502(e))\n`;
    hipaaSection += `- [ ] Implement breach notification procedures — notify affected individuals within 60 days (§ 164.404)\n`;
    hipaaSection += `- [ ] Maintain minimum necessary access — limit PHI use and disclosure to what is needed (§ 164.502(b))\n`;
    hipaaSection += `- [ ] Designate a Security Officer responsible for HIPAA compliance (§ 164.308(a)(2))\n`;
    hipaaSection += `- [ ] Develop and implement workforce training on PHI handling (§ 164.308(a)(5))\n`;
    hipaaSection += `- [ ] Maintain documentation of all HIPAA policies for at least 6 years (§ 164.530(j))\n`;

    sections.push(hipaaSection);
  }

  // ── COPPA ──────────────────────────────────────────────────────────

  const hasCOPPA = scan.complianceNeeds.some((n) => n.document === "COPPA Compliance");
  if (hasCOPPA) {
    let coppaSection = `\n## ${nextSection()}. Children's Online Privacy Protection Act (COPPA)\n\n`;
    coppaSection += `**Applies to:** Websites and online services directed at children under 13, or that knowingly collect personal information from children under 13\n`;
    coppaSection += `**Enforcement:** U.S. Federal Trade Commission (FTC)\n`;
    coppaSection += `**Maximum civil penalty:** $50,120 per violation (2024 adjusted amount)\n\n`;
    coppaSection += `### Key Requirements\n\n`;
    coppaSection += `- [ ] Post a clear and comprehensive privacy policy describing data practices for children's information\n`;
    coppaSection += `- [ ] Obtain verifiable parental consent before collecting personal information from children under 13 (16 CFR § 312.5)\n`;
    coppaSection += `- [ ] Provide parents with direct notice of data collection practices (§ 312.4)\n`;
    coppaSection += `- [ ] Allow parents to review personal information collected from their child (§ 312.6)\n`;
    coppaSection += `- [ ] Allow parents to revoke consent and request deletion of their child's data (§ 312.6)\n`;
    coppaSection += `- [ ] Do not condition a child's participation on collecting more data than reasonably necessary (§ 312.7)\n`;
    coppaSection += `- [ ] Implement reasonable data security measures to protect children's information (§ 312.8)\n`;
    coppaSection += `- [ ] Retain children's personal information only as long as necessary to fulfill the purpose for which it was collected (§ 312.10)\n`;
    coppaSection += `- [ ] Ensure all third-party operators and service providers maintain COPPA compliance (§ 312.2)\n`;
    coppaSection += `- [ ] Implement an age-screening mechanism before data collection\n`;

    sections.push(coppaSection);
  }

  // ── PCI DSS ────────────────────────────────────────────────────────

  const hasPCI = scan.complianceNeeds.some((n) => n.document === "PCI DSS Compliance");
  if (hasPCI) {
    const handlesRawCards = scan.complianceNeeds.some(
      (n) => n.document === "PCI DSS Compliance" && n.priority === "required"
    );

    let pciSection = `\n## ${nextSection()}. Payment Card Industry Data Security Standard (PCI DSS)\n\n`;
    pciSection += `**Applies to:** Any entity that stores, processes, or transmits cardholder data\n`;
    pciSection += `**Current version:** PCI DSS v4.0.1 (mandatory March 31, 2025)\n`;
    pciSection += `**Enforcement:** Payment card brands (Visa, Mastercard, etc.) via acquiring banks\n\n`;
    pciSection += `### Key Requirements\n\n`;

    if (handlesRawCards) {
      pciSection += `> **Warning:** Your codebase appears to handle raw card data directly. This significantly increases your PCI scope.\n\n`;
      pciSection += `- [ ] Complete the appropriate Self-Assessment Questionnaire (SAQ) — likely SAQ D\n`;
      pciSection += `- [ ] Never store full track data, CVV/CVC, or PIN data after authorization (Req. 3.3)\n`;
    } else {
      pciSection += `- [ ] Complete the appropriate Self-Assessment Questionnaire (SAQ) — likely SAQ A or SAQ A-EP\n`;
    }

    pciSection += `- [ ] Install and maintain network security controls (Req. 1)\n`;
    pciSection += `- [ ] Apply secure configurations to all system components (Req. 2)\n`;
    pciSection += `- [ ] Protect stored account data with strong cryptography (Req. 3)\n`;
    pciSection += `- [ ] Encrypt cardholder data over open, public networks (Req. 4)\n`;
    pciSection += `- [ ] Protect systems and networks from malicious software (Req. 5)\n`;
    pciSection += `- [ ] Develop and maintain secure systems and software (Req. 6)\n`;
    pciSection += `- [ ] Restrict access to cardholder data by business need-to-know (Req. 7)\n`;
    pciSection += `- [ ] Log and monitor all access to cardholder data (Req. 10)\n`;
    pciSection += `- [ ] Regularly test security systems and processes (Req. 11)\n`;
    pciSection += `- [ ] Maintain an information security policy (Req. 12)\n`;

    sections.push(pciSection);
  }

  // ── Infrastructure ──────────────────────────────────────────────────

  const hasInfraSecurityPolicy = scan.complianceNeeds.some(
    (n) => n.document === "Security Policy" && n.reason.toLowerCase().includes("infrastructure")
  );
  const hasInfraDataRetention = scan.complianceNeeds.some(
    (n) => n.document === "Data Retention Policy" && n.reason.toLowerCase().includes("persistent")
  );

  if (hasInfraSecurityPolicy || hasInfraDataRetention) {
    let infraSection = `\n## ${nextSection()}. Infrastructure Considerations\n\n`;
    infraSection += `Codepliant detected infrastructure configuration files (Dockerfiles, docker-compose, Kubernetes manifests) that have compliance implications.\n\n`;
    infraSection += `### Key Requirements\n\n`;

    if (hasInfraSecurityPolicy) {
      infraSection += `- [ ] Document all exposed network ports and implement access controls\n`;
      infraSection += `- [ ] Review container environment variables for secrets — use secret management tools instead of baking secrets into images\n`;
      infraSection += `- [ ] Ensure container images are scanned for vulnerabilities before deployment\n`;
    }

    if (hasInfraDataRetention) {
      infraSection += `- [ ] Document data stored in persistent volumes and define retention periods\n`;
      infraSection += `- [ ] Implement backup and disaster recovery procedures for persistent data\n`;
      infraSection += `- [ ] Ensure persistent data is encrypted at rest where required by regulation\n`;
    }

    infraSection += `- [ ] Maintain an inventory of all infrastructure services and their data flows\n`;

    sections.push(infraSection);
  }

  // ── Next Steps ────────────────────────────────────────────────────

  {
    let nextSteps = `\n## ${nextSection()}. Recommended Next Steps\n\n`;
    nextSteps += `1. Review all generated compliance documents with qualified legal counsel\n`;
    nextSteps += `2. Complete the checklist items marked above for each applicable regulation\n`;
    nextSteps += `3. Implement technical measures (consent management, data subject request handling)\n`;
    nextSteps += `4. Train relevant staff on data protection obligations\n`;
    nextSteps += `5. Set up regular compliance reviews (recommended: quarterly)\n`;
    nextSteps += `6. Re-run Codepliant after adding or removing services to keep documents current\n`;

    sections.push(nextSteps);
  }

  // ── Footer ────────────────────────────────────────────────────────

  sections.push(`\n---\n\n*This compliance notes document was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. It is for informational purposes only and does not constitute legal advice.*`);

  return sections.join("\n");
}

const US_BASED_PROVIDER_NAMES = new Set([
  "openai", "stripe", "@anthropic-ai/sdk", "replicate", "together-ai", "cohere",
  "@pinecone-database/pinecone", "@paypal/checkout-server-sdk", "@google-analytics/data",
  "posthog", "mixpanel", "@amplitude/analytics-browser", "@vercel/analytics", "hotjar",
  "@clerk/nextjs", "@sendgrid/mail", "resend", "@sentry/node", "@sentry/nextjs", "@sentry/react",
  "@aws-sdk/client-s3", "@uploadthing/react", "cloudinary", "twilio", "@twilio/voice-sdk",
  "intercom", "@intercom/messenger-js-sdk", "@hubspot/api-client",
  "firebase", "firebase-admin", "@google/generative-ai",
]);

function isUSBased(name: string): boolean {
  return US_BASED_PROVIDER_NAMES.has(name);
}

function formatCategory(cat: string): string {
  const labels: Record<string, string> = {
    ai: "AI Service",
    payment: "Payment Processing",
    analytics: "Analytics",
    auth: "Authentication",
    email: "Email Service",
    database: "Database",
    storage: "File Storage",
    monitoring: "Error Monitoring",
    advertising: "Advertising",
    social: "Social Integration",
    other: "Other",
  };
  return labels[cat] || cat;
}
