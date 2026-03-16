import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates LAWFUL_BASIS_ASSESSMENT.md — per-processing-activity assessment
 * of GDPR lawful basis with detailed reasoning and Legitimate Interest
 * Assessment (LIA) template when Art. 6(1)(f) is used.
 */

interface LawfulBasisEntry {
  activity: string;
  category: string;
  basis: string;
  article: string;
  reasoning: string;
  services: string[];
  dataTypes: string[];
  requiresLIA: boolean;
}

/** Map service categories to lawful basis assessments. */
const BASIS_ASSESSMENTS: Record<
  string,
  { basis: string; article: string; reasoning: string; requiresLIA: boolean }
> = {
  auth: {
    basis: "Contract performance",
    article: "Art. 6(1)(b)",
    reasoning:
      "User authentication is necessary for the performance of the contract between the data controller and the data subject. " +
      "Without processing login credentials and session data, the service cannot identify the user or provide access to their account. " +
      "This processing is directly linked to the service the user has agreed to use.",
    requiresLIA: false,
  },
  payment: {
    basis: "Contract performance / Legal obligation",
    article: "Art. 6(1)(b) / Art. 6(1)(c)",
    reasoning:
      "Payment processing is necessary to fulfill the contractual obligation of delivering paid services or goods. " +
      "Additionally, retention of transaction records is required under tax and accounting regulations (legal obligation). " +
      "Payment card data is tokenized and processed by PCI DSS-compliant processors, minimizing the controller's exposure.",
    requiresLIA: false,
  },
  analytics: {
    basis: "Consent / Legitimate interest",
    article: "Art. 6(1)(a) / Art. 6(1)(f)",
    reasoning:
      "Analytics processing may rely on consent (obtained via cookie banner) for tracking technologies that are not strictly necessary. " +
      "Alternatively, aggregated and anonymized analytics may be processed under legitimate interest for product improvement. " +
      "A Legitimate Interest Assessment should be conducted to document the balancing test if Art. 6(1)(f) is used.",
    requiresLIA: true,
  },
  email: {
    basis: "Legitimate interest / Consent",
    article: "Art. 6(1)(f) / Art. 6(1)(a)",
    reasoning:
      "Transactional emails (order confirmations, password resets, security alerts) are processed under legitimate interest — " +
      "the data subject reasonably expects these communications as part of the service. " +
      "Marketing emails require explicit consent under both GDPR and the ePrivacy Directive.",
    requiresLIA: true,
  },
  ai: {
    basis: "Consent / Contract performance",
    article: "Art. 6(1)(a) / Art. 6(1)(b)",
    reasoning:
      "AI processing depends on whether it is integral to the service. If AI features are core to the product the user signed up for, " +
      "contract performance applies. If AI features are optional or supplementary, consent should be obtained. " +
      "Special attention is required under GDPR Art. 22 regarding automated decision-making with legal or similarly significant effects.",
    requiresLIA: false,
  },
  monitoring: {
    basis: "Legitimate interest",
    article: "Art. 6(1)(f)",
    reasoning:
      "Error monitoring and performance tracking serve the legitimate interest of maintaining service reliability, " +
      "detecting and resolving technical issues, and ensuring security. Data subjects reasonably expect that a software service " +
      "will monitor for errors. Data collected is primarily technical (stack traces, device info) with minimal personal data impact.",
    requiresLIA: true,
  },
  storage: {
    basis: "Contract performance",
    article: "Art. 6(1)(b)",
    reasoning:
      "File storage processing is necessary to provide the storage service that the user has contracted for. " +
      "The user explicitly uploads files with the expectation that they will be stored and retrievable. " +
      "This is a core part of the service agreement.",
    requiresLIA: false,
  },
  database: {
    basis: "Contract performance",
    article: "Art. 6(1)(b)",
    reasoning:
      "Database storage of user data is necessary to operate the service the user has agreed to use. " +
      "Without persistent data storage, the service cannot function. Data stored is directly provided by " +
      "or generated for the user as part of normal service operation.",
    requiresLIA: false,
  },
  advertising: {
    basis: "Consent",
    article: "Art. 6(1)(a)",
    reasoning:
      "Advertising and conversion tracking requires explicit consent under both GDPR Art. 6(1)(a) and the ePrivacy Directive. " +
      "This processing involves tracking user behavior across contexts for ad targeting and measurement. " +
      "Consent must be freely given, specific, informed, and unambiguous. Pre-ticked boxes are not valid consent.",
    requiresLIA: false,
  },
  social: {
    basis: "Consent",
    article: "Art. 6(1)(a)",
    reasoning:
      "Social media integrations that share data with third-party platforms require explicit consent. " +
      "Users must be informed about the data sharing before social plugins are loaded or data is transmitted.",
    requiresLIA: false,
  },
};

export function generateLawfulBasisAssessment(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  if (scan.services.length === 0) return null;

  const companyName = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const dpoName = ctx?.dpoName || "[Data Protection Officer Name]";
  const dpoEmail = ctx?.dpoEmail || contactEmail;
  const date = new Date().toISOString().split("T")[0];

  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────────
  lines.push("# Lawful Basis Assessment");
  lines.push("");
  lines.push(`> **${companyName}** — GDPR Article 6 Lawful Basis Assessment`);
  lines.push(`>`);
  lines.push(`> Generated on ${date} by [Codepliant](https://github.com/joechensmartz/codepliant)`);
  lines.push("");

  // ── Controller Information ──────────────────────────────────────────────
  lines.push("## 1. Controller Information");
  lines.push("");
  lines.push("| Field | Details |");
  lines.push("|-------|---------|");
  lines.push(`| **Data Controller** | ${companyName} |`);
  lines.push(`| **Contact Email** | ${contactEmail} |`);
  lines.push(`| **Data Protection Officer** | ${dpoName} |`);
  lines.push(`| **DPO Email** | ${dpoEmail} |`);
  lines.push(`| **Assessment Date** | ${date} |`);
  lines.push("");

  // ── Build assessments from scan ─────────────────────────────────────────
  const entries: LawfulBasisEntry[] = [];
  const seenCategories = new Set<string>();

  for (const service of scan.services) {
    if (seenCategories.has(service.category)) continue;
    seenCategories.add(service.category);

    const assessment = BASIS_ASSESSMENTS[service.category] || {
      basis: "Legitimate interest",
      article: "Art. 6(1)(f)",
      reasoning: "Processing serves the legitimate interest of providing and improving the service.",
      requiresLIA: true,
    };

    const servicesInCategory = scan.services
      .filter((s) => s.category === service.category)
      .map((s) => s.name);

    const dataTypes = [
      ...new Set(
        scan.services
          .filter((s) => s.category === service.category)
          .flatMap((s) => s.dataCollected)
      ),
    ];

    entries.push({
      activity: formatActivity(service.category),
      category: service.category,
      basis: assessment.basis,
      article: assessment.article,
      reasoning: assessment.reasoning,
      services: servicesInCategory,
      dataTypes,
      requiresLIA: assessment.requiresLIA,
    });
  }

  // ── Summary Table ──────────────────────────────────────────────────────
  lines.push("## 2. Lawful Basis Summary");
  lines.push("");
  lines.push("| Processing Activity | Lawful Basis | GDPR Article | Requires LIA |");
  lines.push("|---------------------|-------------|-------------|-------------|");
  for (const entry of entries) {
    lines.push(
      `| ${entry.activity} | ${entry.basis} | ${entry.article} | ${entry.requiresLIA ? "Yes" : "No"} |`
    );
  }
  lines.push("");

  // ── Detailed Assessments ───────────────────────────────────────────────
  lines.push("## 3. Detailed Assessments");
  lines.push("");

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    lines.push(`### 3.${i + 1}. ${entry.activity}`);
    lines.push("");
    lines.push(`**Services:** ${entry.services.join(", ")}`);
    lines.push("");
    lines.push(`**Data processed:** ${entry.dataTypes.join(", ")}`);
    lines.push("");
    lines.push(`**Lawful basis:** ${entry.basis} (${entry.article})`);
    lines.push("");
    lines.push("**Reasoning:**");
    lines.push("");
    lines.push(entry.reasoning);
    lines.push("");
    if (entry.requiresLIA) {
      lines.push("> A Legitimate Interest Assessment (LIA) is recommended for this processing activity. See Section 4 below.");
      lines.push("");
    }
  }

  // ── Legitimate Interest Assessment Template ────────────────────────────
  const liaEntries = entries.filter((e) => e.requiresLIA);

  if (liaEntries.length > 0) {
    lines.push("## 4. Legitimate Interest Assessments (LIA)");
    lines.push("");
    lines.push(
      "Under GDPR Art. 6(1)(f), processing based on legitimate interest requires a three-part test. " +
        "The following assessments should be completed for each processing activity relying on this basis."
    );
    lines.push("");

    for (let i = 0; i < liaEntries.length; i++) {
      const entry = liaEntries[i];
      lines.push(`### 4.${i + 1}. LIA: ${entry.activity}`);
      lines.push("");

      lines.push("#### Part 1: Purpose Test — Identify the legitimate interest");
      lines.push("");
      lines.push("| Question | Answer |");
      lines.push("|----------|--------|");
      lines.push(`| What is the purpose of the processing? | ${getLIAPurpose(entry.category)} |`);
      lines.push(`| Is there a genuine need for this processing? | [Yes/No — provide justification] |`);
      lines.push(`| Who benefits from the processing? | ${getLIABeneficiary(entry.category)} |`);
      lines.push(`| Would the processing be considered unethical or unlawful in any way? | No — the processing is standard industry practice |`);
      lines.push("");

      lines.push("#### Part 2: Necessity Test — Is the processing necessary?");
      lines.push("");
      lines.push("| Question | Answer |");
      lines.push("|----------|--------|");
      lines.push(`| Is this the least intrusive way to achieve the purpose? | ${getLIANecessity(entry.category)} |`);
      lines.push("| Could the same result be achieved without processing personal data? | [Assess whether anonymization is feasible] |");
      lines.push("| Is the data collected proportionate to the purpose? | [Confirm data minimization] |");
      lines.push("");

      lines.push("#### Part 3: Balancing Test — Do data subject rights override?");
      lines.push("");
      lines.push("| Factor | Assessment |");
      lines.push("|--------|------------|");
      lines.push(`| Nature of the data | ${getLIADataNature(entry.category)} |`);
      lines.push(`| Reasonable expectations of the data subject | ${getLIAExpectations(entry.category)} |`);
      lines.push("| Likely impact on the data subject | [Assess — low/medium/high] |");
      lines.push("| Status of the data subject (e.g., children, vulnerable) | Not specifically targeting vulnerable individuals |");
      lines.push("| Safeguards in place | [List safeguards — encryption, access controls, retention limits] |");
      lines.push(`| Opt-out mechanism available | ${getLIAOptOut(entry.category)} |`);
      lines.push("");

      lines.push("#### LIA Conclusion");
      lines.push("");
      lines.push(`- [ ] The legitimate interest is valid and clearly identified`);
      lines.push(`- [ ] The processing is necessary and proportionate`);
      lines.push(`- [ ] The data subject's rights do not override the legitimate interest`);
      lines.push(`- [ ] Adequate safeguards are in place`);
      lines.push(`- [ ] An opt-out mechanism is available`);
      lines.push("");
      lines.push(`**Decision:** [Approved / Rejected / Needs further review]`);
      lines.push(`**Reviewed by:** [Name and role]`);
      lines.push(`**Review date:** [Date]`);
      lines.push("");
    }
  } else {
    lines.push("## 4. Legitimate Interest Assessments (LIA)");
    lines.push("");
    lines.push("No processing activities based on legitimate interest (Art. 6(1)(f)) were detected. No LIA is required at this time.");
    lines.push("");
  }

  // ── Consent Management ─────────────────────────────────────────────────
  const consentEntries = entries.filter(
    (e) => e.article.includes("6(1)(a)")
  );

  if (consentEntries.length > 0) {
    lines.push("## 5. Consent Management Requirements");
    lines.push("");
    lines.push("The following processing activities rely (fully or partially) on consent:");
    lines.push("");
    for (const entry of consentEntries) {
      lines.push(`### ${entry.activity}`);
      lines.push("");
      lines.push("- [ ] Consent is freely given (not bundled with other terms)");
      lines.push("- [ ] Consent is specific to this processing purpose");
      lines.push("- [ ] Consent request is clear and in plain language");
      lines.push("- [ ] Consent is obtained via affirmative action (no pre-ticked boxes)");
      lines.push("- [ ] Withdrawal mechanism is as easy as giving consent");
      lines.push("- [ ] Consent records are maintained with timestamps");
      lines.push("- [ ] Consent is refreshed periodically");
      lines.push("");
    }
  }

  // ── Review Schedule ────────────────────────────────────────────────────
  const nextSectionNum = consentEntries.length > 0 ? 6 : 5;
  lines.push(`## ${nextSectionNum}. Review Schedule`);
  lines.push("");
  lines.push("This assessment must be reviewed:");
  lines.push("");
  lines.push("- **Annually** — Full review of all lawful basis determinations");
  lines.push("- **On change** — When new processing activities are introduced");
  lines.push("- **On regulatory update** — When relevant guidance changes");
  lines.push("- **On complaint** — Following any data subject complaint about processing");
  lines.push("");

  // ── Review Notes ───────────────────────────────────────────────────────
  lines.push("## Review Notes");
  lines.push("");
  lines.push("### What a lawyer should check");
  lines.push("");
  lines.push("- Validate each lawful basis selection against the specific processing context");
  lines.push("- Complete all LIA templates with specific factual assessments");
  lines.push("- Verify consent mechanisms meet GDPR requirements");
  lines.push("- Confirm Art. 6(1)(b) claims are truly necessary for contract performance");
  lines.push("- Review whether any processing requires a DPIA under Art. 35");
  lines.push("");
  lines.push("### Auto-generated vs. needs human input");
  lines.push("");
  lines.push("| Section | Status | Confidence |");
  lines.push("|---------|--------|------------|");
  lines.push("| Processing activities list | Auto-detected from code | High |");
  lines.push("| Lawful basis selection | Auto-assigned defaults | Low — requires legal validation |");
  lines.push("| Detailed reasoning | Template reasoning | Medium — needs context-specific review |");
  lines.push("| LIA templates | Structure only — needs completion | Low |");
  lines.push("| Consent requirements | Checklist only | Medium |");
  lines.push("");

  // ── Related Documents ──────────────────────────────────────────────────
  lines.push("## Related Documents");
  lines.push("");
  lines.push("- Privacy Policy (`PRIVACY_POLICY.md`)");
  lines.push("- Data Subject Categories (`DATA_SUBJECT_CATEGORIES.md`)");
  lines.push("- Record of Processing Activities (`RECORD_OF_PROCESSING_ACTIVITIES.md`)");
  lines.push("- Privacy Impact Assessment (`PRIVACY_IMPACT_ASSESSMENT.md`)");
  lines.push("- Consent Management Guide (`CONSENT_MANAGEMENT_GUIDE.md`)");
  lines.push("");

  // ── Footer ──────────────────────────────────────────────────────────────
  lines.push("---");
  lines.push("");
  lines.push(
    "*This Lawful Basis Assessment was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on code analysis. " +
      "Lawful basis determinations are preliminary and must be reviewed by qualified legal counsel. " +
      "All LIA templates must be completed with specific factual assessments before relying on legitimate interest.*"
  );
  lines.push("");

  return lines.join("\n");
}

function formatActivity(category: string): string {
  const labels: Record<string, string> = {
    auth: "User Authentication",
    payment: "Payment Processing",
    analytics: "Usage Analytics",
    email: "Email Communications",
    ai: "AI Processing",
    monitoring: "Error Monitoring",
    storage: "File Storage",
    database: "Data Storage",
    advertising: "Advertising & Conversion Tracking",
    social: "Social Media Integration",
  };
  return labels[category] || category;
}

function getLIAPurpose(category: string): string {
  const purposes: Record<string, string> = {
    analytics:
      "Product improvement, understanding user behavior, optimizing user experience, and measuring feature adoption",
    email:
      "Sending transactional communications (order confirmations, security alerts, password resets) that users expect as part of the service",
    monitoring:
      "Detecting and resolving application errors, maintaining service reliability, and ensuring security",
  };
  return purposes[category] || "Supporting service operations and improvement";
}

function getLIABeneficiary(category: string): string {
  const beneficiaries: Record<string, string> = {
    analytics: "Both the controller (product insights) and data subjects (improved user experience)",
    email: "Both the controller (operational communication) and data subjects (receiving expected notifications)",
    monitoring: "Both the controller (service reliability) and data subjects (stable, secure service)",
  };
  return beneficiaries[category] || "Both the controller and data subjects";
}

function getLIANecessity(category: string): string {
  const necessity: Record<string, string> = {
    analytics:
      "Consider whether fully anonymized analytics could serve the same purpose. If not, ensure data minimization and pseudonymization are applied.",
    email:
      "Transactional emails are the least intrusive way to deliver service-critical information. Alternative channels (SMS, push) may be more intrusive.",
    monitoring:
      "Error monitoring is essential for service reliability. Consider minimizing personal data in error reports (e.g., redacting email addresses from stack traces).",
  };
  return necessity[category] || "[Assess whether less intrusive alternatives exist]";
}

function getLIADataNature(category: string): string {
  const nature: Record<string, string> = {
    analytics: "Pseudonymized behavioral data — not special category data",
    email: "Email addresses and communication records — standard personal data",
    monitoring: "Technical data (stack traces, device info) with incidental personal data (IP addresses)",
  };
  return nature[category] || "Standard personal data — not special category";
}

function getLIAExpectations(category: string): string {
  const expectations: Record<string, string> = {
    analytics:
      "Users generally expect websites to track usage for improvement, though expectations vary by audience. Transparency is key.",
    email:
      "Users reasonably expect to receive transactional emails related to their use of the service",
    monitoring:
      "Users reasonably expect that a software service monitors for errors and maintains security",
  };
  return expectations[category] || "[Assess data subject expectations]";
}

function getLIAOptOut(category: string): string {
  const optOut: Record<string, string> = {
    analytics: "Yes — via cookie preferences and account settings",
    email: "Yes — unsubscribe link in every email (marketing); transactional emails cannot be opted out of while using the service",
    monitoring: "Limited — error monitoring is essential for service operation; users can request data deletion",
  };
  return optOut[category] || "[Describe opt-out mechanism]";
}
