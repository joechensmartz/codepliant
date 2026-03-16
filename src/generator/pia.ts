import type { ScanResult, DetectedService } from "../scanner/index.js";
import type { ServiceCategory } from "../scanner/types.js";
import type { GeneratorContext } from "./index.js";

/**
 * Privacy Impact Assessment / Data Protection Impact Assessment generator.
 *
 * Produces PRIVACY_IMPACT_ASSESSMENT.md following GDPR Article 35 DPIA
 * requirements. Only generated when AI or analytics services are detected.
 */

// ── High-risk trigger definitions ──────────────────────────────────────

interface HighRiskTrigger {
  id: string;
  label: string;
  description: string;
  test: (services: DetectedService[]) => boolean;
}

const HIGH_RISK_TRIGGERS: HighRiskTrigger[] = [
  {
    id: "large-scale-profiling",
    label: "Large-Scale Profiling",
    description:
      "Systematic evaluation of personal aspects based on automated processing, including profiling (Art. 35(3)(a))",
    test: (services) =>
      services.some(
        (s) =>
          s.category === "analytics" &&
          s.dataCollected.some(
            (d) =>
              d.includes("user behavior") ||
              d.includes("user profiles") ||
              d.includes("session recordings")
          )
      ),
  },
  {
    id: "systematic-monitoring",
    label: "Systematic Monitoring",
    description:
      "Systematic monitoring of a publicly accessible area on a large scale (Art. 35(3)(c))",
    test: (services) =>
      services.some(
        (s) =>
          s.dataCollected.some(
            (d) =>
              d.includes("session recordings") ||
              d.includes("heatmaps") ||
              d.includes("page views")
          ) && s.category === "analytics"
      ),
  },
  {
    id: "sensitive-data",
    label: "Sensitive / Special Category Data",
    description:
      "Processing of special categories of data on a large scale (Art. 35(3)(b))",
    test: (services) =>
      services.some((s) =>
        s.dataCollected.some(
          (d) =>
            d.includes("biometric") ||
            d.includes("health") ||
            d.includes("genetic") ||
            d.includes("racial") ||
            d.includes("political") ||
            d.includes("religious") ||
            d.includes("sexual")
        )
      ),
  },
  {
    id: "ai-decision-making",
    label: "AI-Powered Decision Making",
    description:
      "Automated decision-making with legal or similarly significant effects, including AI inference and content generation (Art. 22 GDPR)",
    test: (services) => services.some((s) => s.category === "ai"),
  },
];

// ── Risk scoring ────────────────────────────────────────────────────────

type LikelihoodLevel = 1 | 2 | 3 | 4;
type ImpactLevel = 1 | 2 | 3 | 4;

interface RiskEntry {
  activity: string;
  service: string;
  category: ServiceCategory;
  dataItems: string[];
  likelihood: LikelihoodLevel;
  impact: ImpactLevel;
  score: number;
  rating: "Low" | "Medium" | "High" | "Critical";
}

const LIKELIHOOD_LABELS: Record<LikelihoodLevel, string> = {
  1: "Unlikely",
  2: "Possible",
  3: "Likely",
  4: "Almost Certain",
};

const IMPACT_LABELS: Record<ImpactLevel, string> = {
  1: "Negligible",
  2: "Limited",
  3: "Significant",
  4: "Maximum",
};

function riskRating(score: number): "Low" | "Medium" | "High" | "Critical" {
  if (score <= 4) return "Low";
  if (score <= 8) return "Medium";
  if (score <= 12) return "High";
  return "Critical";
}

/** Assign a baseline likelihood score per service category. */
function categoryLikelihood(category: ServiceCategory): LikelihoodLevel {
  const map: Partial<Record<ServiceCategory, LikelihoodLevel>> = {
    ai: 3,
    analytics: 3,
    advertising: 3,
    payment: 2,
    auth: 2,
    email: 2,
    monitoring: 2,
    social: 2,
    database: 2,
    storage: 1,
    other: 1,
  };
  return map[category] ?? 1;
}

/** Assign a baseline impact score based on the type of data processed. */
function dataImpact(dataItems: string[]): ImpactLevel {
  const joined = dataItems.join(" ").toLowerCase();

  // Highest impact: financial, biometric, health
  if (
    joined.includes("payment") ||
    joined.includes("bank") ||
    joined.includes("biometric") ||
    joined.includes("health") ||
    joined.includes("credit")
  ) {
    return 4;
  }

  // High impact: personal identity data
  if (
    joined.includes("password") ||
    joined.includes("session") ||
    joined.includes("oauth") ||
    joined.includes("phone") ||
    joined.includes("billing")
  ) {
    return 3;
  }

  // Medium impact: behavioral / identifiable data
  if (
    joined.includes("user behavior") ||
    joined.includes("user prompts") ||
    joined.includes("conversation") ||
    joined.includes("email") ||
    joined.includes("ip address") ||
    joined.includes("location")
  ) {
    return 2;
  }

  return 1;
}

/** Compute risk description based on service category. */
function activityDescription(service: DetectedService): string {
  const descriptions: Partial<Record<ServiceCategory, string>> = {
    ai: `AI processing via ${service.name}`,
    analytics: `Behavioral analytics via ${service.name}`,
    advertising: `Advertising tracking via ${service.name}`,
    payment: `Payment processing via ${service.name}`,
    auth: `Authentication via ${service.name}`,
    email: `Email communications via ${service.name}`,
    monitoring: `Error/performance monitoring via ${service.name}`,
    storage: `File storage via ${service.name}`,
    database: `Data persistence via ${service.name}`,
    social: `Social integration via ${service.name}`,
    other: `Data processing via ${service.name}`,
  };
  return descriptions[service.category] ?? `Processing via ${service.name}`;
}

function buildRiskEntries(services: DetectedService[]): RiskEntry[] {
  return services.map((s) => {
    const likelihood = categoryLikelihood(s.category);
    const impact = dataImpact(s.dataCollected);
    const score = likelihood * impact;
    return {
      activity: activityDescription(s),
      service: s.name,
      category: s.category,
      dataItems: s.dataCollected,
      likelihood,
      impact,
      score,
      rating: riskRating(score),
    };
  });
}

// ── Mitigation recommendations ──────────────────────────────────────────

const MITIGATION_MEASURES: Partial<Record<ServiceCategory, string[]>> = {
  ai: [
    "Implement input/output filtering to prevent transmission of unnecessary personal data",
    "Enable opt-out mechanisms for AI-powered features",
    "Conduct regular audits of AI provider data handling practices",
    "Minimize data sent to AI providers (data minimization principle)",
    "Ensure AI provider DPA is in place with SCCs for international transfers",
    "Implement human oversight for AI-assisted decisions affecting individuals",
  ],
  analytics: [
    "Enable IP anonymization / pseudonymization where available",
    "Implement cookie consent management with granular opt-in/opt-out",
    "Configure data retention limits within the analytics platform",
    "Limit collection to strictly necessary data points",
    "Disable session recordings for authenticated areas with sensitive data",
    "Conduct regular data minimization reviews",
  ],
  advertising: [
    "Implement explicit consent before activating advertising trackers",
    "Provide transparent opt-out mechanisms",
    "Avoid sharing identifiable data with advertising platforms where possible",
    "Review and limit data shared via advertising pixels and SDKs",
  ],
  payment: [
    "Use tokenization to avoid direct handling of payment card data",
    "Ensure PCI DSS compliance through the payment processor",
    "Limit stored payment data to transaction references only",
    "Implement strong authentication for payment-related actions",
  ],
  auth: [
    "Enforce strong password policies or passwordless authentication",
    "Implement multi-factor authentication (MFA)",
    "Minimize profile data collected during registration",
    "Regularly rotate and securely store OAuth tokens and secrets",
  ],
  email: [
    "Use transactional email only for necessary communications",
    "Implement unsubscribe mechanisms for marketing emails",
    "Avoid embedding tracking pixels where not strictly necessary",
    "Ensure email provider DPA is in place",
  ],
  monitoring: [
    "Configure PII scrubbing in error reports and stack traces",
    "Limit user context attached to monitoring events",
    "Set appropriate data retention periods for monitoring data",
    "Restrict access to monitoring dashboards to authorized personnel",
  ],
  storage: [
    "Encrypt files at rest and in transit",
    "Implement access controls on stored files",
    "Establish data retention and deletion policies for uploaded files",
    "Scan uploaded files for malware before storage",
  ],
  database: [
    "Encrypt sensitive fields at the application level",
    "Implement role-based access controls for database access",
    "Enable audit logging for data access and modifications",
    "Establish and enforce data retention schedules",
  ],
  social: [
    "Minimize data shared with social media platforms",
    "Implement consent before activating social media integrations",
    "Review data flows to social platforms regularly",
  ],
  other: [
    "Review data processing activities and apply data minimization",
    "Ensure appropriate DPAs are in place with the service provider",
    "Conduct periodic reviews of necessity and proportionality",
  ],
};

// ── DPA consultation thresholds ─────────────────────────────────────────

function shouldConsultDPA(
  riskEntries: RiskEntry[],
  triggers: string[]
): boolean {
  // Art. 36 GDPR: consult DPA when DPIA indicates high risk that cannot be mitigated
  const hasCritical = riskEntries.some((r) => r.rating === "Critical");
  const highCount = riskEntries.filter((r) => r.rating === "High").length;
  const multipleHighRiskTriggers = triggers.length >= 2;
  return hasCritical || highCount >= 3 || multipleHighRiskTriggers;
}

// ── Main generator ──────────────────────────────────────────────────────

export function generatePIA(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasAnalytics = scan.services.some((s) => s.category === "analytics");

  if (!hasAI && !hasAnalytics) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const dpoName = ctx?.dpoName || "[DPO Name]";
  const dpoEmail = ctx?.dpoEmail || "[dpo@example.com]";
  const date = new Date().toISOString().split("T")[0];

  const riskEntries = buildRiskEntries(scan.services);
  const activeTriggers = HIGH_RISK_TRIGGERS.filter((t) =>
    t.test(scan.services)
  );
  const consultDPA = shouldConsultDPA(riskEntries, activeTriggers.map((t) => t.id));

  const sections: string[] = [];
  let sectionNum = 0;
  function nextSection(): number {
    return ++sectionNum;
  }

  // ── Title ──────────────────────────────────────────────────────────

  sections.push(`# Privacy Impact Assessment (DPIA)

**Last updated:** ${date}

**Project:** ${scan.projectName}

**Data Controller:** ${company}

**Contact:** ${email}

**DPO:** ${dpoName} (${dpoEmail})

---

> This Data Protection Impact Assessment is prepared pursuant to **Article 35 of the General Data Protection Regulation (EU) 2016/679 (GDPR)**. A DPIA is required when data processing is likely to result in a high risk to the rights and freedoms of natural persons, particularly when using new technologies.`);

  // ── Section 1: Description of Processing ───────────────────────────

  {
    let processingSection = `
## ${nextSection()}. Description of Processing

### ${sectionNum}.1 Overview

This assessment covers the data processing activities of the **${scan.projectName}** application operated by ${company}. The following describes the nature, scope, context, and purposes of processing.

### ${sectionNum}.2 Services and Data Processing Activities

The application integrates the following services that process personal data:

| Service | Category | Data Processed | Legal Basis |
|---------|----------|---------------|-------------|`;

    for (const s of scan.services) {
      const legalBasis = defaultLegalBasis(s.category);
      processingSection += `\n| ${s.name} | ${s.category} | ${s.dataCollected.join(", ")} | ${legalBasis} |`;
    }

    if (scan.dataCategories.length > 0) {
      processingSection += `\n\n### ${sectionNum}.3 Categories of Personal Data\n`;
      for (const dc of scan.dataCategories) {
        processingSection += `\n- **${dc.category}:** ${dc.description} (sources: ${dc.sources.join(", ")})`;
      }
    }

    processingSection += `

### ${sectionNum}.${scan.dataCategories.length > 0 ? "4" : "3"} Categories of Data Subjects

- End users of the application
- Registered account holders
- Website visitors
- Customers and prospective customers

> **Action required:** Review and update the categories of data subjects to reflect your actual processing activities.`;

    sections.push(processingSection);
  }

  // ── Section 2: Necessity and Proportionality ───────────────────────

  {
    const aiServices = scan.services.filter((s) => s.category === "ai");
    const analyticsServices = scan.services.filter(
      (s) => s.category === "analytics"
    );

    let necessitySection = `
## ${nextSection()}. Necessity and Proportionality Assessment

### ${sectionNum}.1 Lawfulness of Processing

Each data processing activity must have a valid legal basis under Article 6 GDPR:

| Processing Activity | Legal Basis | Justification |
|---------------------|-------------|---------------|`;

    for (const s of scan.services) {
      const basis = defaultLegalBasis(s.category);
      const justification = defaultJustification(s.category);
      necessitySection += `\n| ${activityDescription(s)} | ${basis} | ${justification} |`;
    }

    necessitySection += `

### ${sectionNum}.2 Data Minimization

The following data minimization measures should be verified:

`;

    if (aiServices.length > 0) {
      necessitySection += `**AI Services:**
- [ ] Only data strictly necessary for the AI feature is transmitted to the provider
- [ ] User prompts are not stored beyond the session unless the user explicitly opts in
- [ ] No special category data is included in AI requests without explicit consent
`;
    }

    if (analyticsServices.length > 0) {
      necessitySection += `
**Analytics Services:**
- [ ] IP anonymization is enabled
- [ ] Only necessary tracking events are collected
- [ ] Session recording excludes sensitive form fields
- [ ] Data retention periods are configured to the minimum necessary
`;
    }

    necessitySection += `
### ${sectionNum}.3 Proportionality

- [ ] The processing is necessary to achieve the stated purpose and cannot be achieved by less intrusive means
- [ ] The volume of data collected is proportionate to the processing purpose
- [ ] Data retention periods are limited to what is strictly necessary
- [ ] Data subjects are clearly informed about the processing

> **Action required:** Document how each processing activity satisfies the necessity and proportionality requirements. Verify that less privacy-intrusive alternatives have been considered.`;

    sections.push(necessitySection);
  }

  // ── Section 3: Risk Assessment Matrix ──────────────────────────────

  {
    let riskSection = `
## ${nextSection()}. Risk Assessment

### ${sectionNum}.1 Methodology

Risk is assessed using a **likelihood x impact** matrix. Each data processing activity is scored on two dimensions:

**Likelihood** (probability of harm occurring):

| Score | Level | Description |
|-------|-------|-------------|
| 1 | ${LIKELIHOOD_LABELS[1]} | Remote chance of occurrence |
| 2 | ${LIKELIHOOD_LABELS[2]} | Could occur in some circumstances |
| 3 | ${LIKELIHOOD_LABELS[3]} | Will probably occur |
| 4 | ${LIKELIHOOD_LABELS[4]} | Expected to occur in most circumstances |

**Impact** (severity of harm to data subjects):

| Score | Level | Description |
|-------|-------|-------------|
| 1 | ${IMPACT_LABELS[1]} | Minor inconvenience, easily recoverable |
| 2 | ${IMPACT_LABELS[2]} | Some damage, recoverable with effort |
| 3 | ${IMPACT_LABELS[3]} | Serious harm, difficult to recover |
| 4 | ${IMPACT_LABELS[4]} | Irreversible or very serious harm |

**Risk Rating:** Likelihood x Impact

| Rating | Score Range | Action Required |
|--------|-------------|-----------------|
| Low | 1-4 | Accept with standard controls |
| Medium | 5-8 | Mitigate with additional controls |
| High | 9-12 | Significant mitigation required before processing |
| Critical | 13-16 | Must not proceed without DPA consultation and substantial mitigation |

### ${sectionNum}.2 Risk Assessment Results

| # | Processing Activity | Data Processed | Likelihood | Impact | Score | Rating |
|---|---------------------|---------------|------------|--------|-------|--------|`;

    riskEntries.forEach((entry, idx) => {
      riskSection += `\n| ${idx + 1} | ${entry.activity} | ${entry.dataItems.join(", ")} | ${entry.likelihood} (${LIKELIHOOD_LABELS[entry.likelihood]}) | ${entry.impact} (${IMPACT_LABELS[entry.impact]}) | **${entry.score}** | **${entry.rating}** |`;
    });

    // Summary statistics
    const criticalCount = riskEntries.filter(
      (r) => r.rating === "Critical"
    ).length;
    const highCount = riskEntries.filter((r) => r.rating === "High").length;
    const mediumCount = riskEntries.filter((r) => r.rating === "Medium").length;
    const lowCount = riskEntries.filter((r) => r.rating === "Low").length;

    riskSection += `

### ${sectionNum}.3 Risk Summary

| Rating | Count |
|--------|-------|
| Critical | ${criticalCount} |
| High | ${highCount} |
| Medium | ${mediumCount} |
| Low | ${lowCount} |
| **Total** | **${riskEntries.length}** |`;

    sections.push(riskSection);
  }

  // ── Section 4: High-Risk Processing Triggers ──────────────────────

  {
    let triggerSection = `
## ${nextSection()}. High-Risk Processing Triggers

Article 35(3) GDPR and the EDPB Guidelines on DPIAs identify specific types of processing that are likely to result in high risk. The following assessment is based on detected services:

| Trigger | Status | Description |
|---------|--------|-------------|`;

    for (const trigger of HIGH_RISK_TRIGGERS) {
      const active = activeTriggers.some((t) => t.id === trigger.id);
      const status = active ? "TRIGGERED" : "Not detected";
      triggerSection += `\n| ${trigger.label} | **${status}** | ${trigger.description} |`;
    }

    if (activeTriggers.length > 0) {
      triggerSection += `\n\n> **${activeTriggers.length} high-risk trigger(s) detected.** This DPIA is mandatory under Article 35 GDPR. ${activeTriggers.length >= 2 ? "Multiple triggers increase the overall risk profile." : ""}`;
    } else {
      triggerSection += `\n\n> No high-risk triggers were detected by automated analysis. However, you should manually verify whether your specific use of these services constitutes high-risk processing in your context.`;
    }

    sections.push(triggerSection);
  }

  // ── Section 5: Data Flow Diagram Reference ─────────────────────────

  sections.push(`
## ${nextSection()}. Data Flow Diagram

A detailed data flow map showing how personal data is collected, stored, processed, and shared across all integrated services is available in the companion document:

> **See [DATA_FLOW_MAP.md](./DATA_FLOW_MAP.md)** for the complete data flow diagram.

The data flow map covers:

- **Collection points:** How and where personal data enters the system
- **Storage locations:** Where personal data is persisted
- **Sharing / third-party transfers:** Which services receive personal data and for what purpose
- **Cross-border transfers:** Data flows outside the EEA`);

  // ── Section 6: Risk Mitigation Measures ────────────────────────────

  {
    // Group services by category for mitigation
    const categoriesPresent = new Set(scan.services.map((s) => s.category));

    let mitigationSection = `
## ${nextSection()}. Risk Mitigation Measures

The following mitigation measures are recommended for each category of data processing activity detected in the application:
`;

    for (const category of categoriesPresent) {
      const measures = MITIGATION_MEASURES[category] ?? MITIGATION_MEASURES["other"]!;
      const categoryServices = scan.services.filter(
        (s) => s.category === category
      );
      const serviceNames = categoryServices.map((s) => s.name).join(", ");
      const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);

      mitigationSection += `\n### ${sectionNum}.${Array.from(categoriesPresent).indexOf(category) + 1} ${categoryLabel} (${serviceNames})\n`;

      const relevantRisks = riskEntries.filter((r) => r.category === category);
      const maxRating =
        relevantRisks.length > 0
          ? relevantRisks.reduce((max, r) =>
              r.score > max.score ? r : max
            ).rating
          : "Low";

      mitigationSection += `\n**Current risk rating:** ${maxRating}\n`;
      mitigationSection += `\n**Recommended measures:**\n`;

      for (const measure of measures) {
        mitigationSection += `\n- [ ] ${measure}`;
      }

      mitigationSection += "\n";
    }

    sections.push(mitigationSection);
  }

  // ── Section 7: Consultation Requirements ──────────────────────────

  {
    let consultSection = `
## ${nextSection()}. Consultation Requirements

### ${sectionNum}.1 Data Protection Authority Consultation (Art. 36 GDPR)

Under Article 36 GDPR, the controller must consult the supervisory authority prior to processing where a DPIA indicates that the processing would result in a high risk in the absence of measures taken by the controller to mitigate the risk.

**Consultation required:** ${consultDPA ? "**YES** — Based on the risk assessment, consultation with your Data Protection Authority is recommended before proceeding with processing." : "**Not at this time** — Based on the current risk assessment, the identified risks can be mitigated through the measures outlined in this DPIA. However, this should be re-evaluated if processing activities change."}`;

    if (consultDPA) {
      consultSection += `

### ${sectionNum}.2 When to Consult

You should consult your supervisory authority when:

1. The DPIA indicates that processing would result in a high risk that cannot be sufficiently mitigated
2. You are uncertain whether your mitigation measures adequately address the identified risks
3. National law requires consultation for this type of processing

### ${sectionNum}.3 Consultation Process

1. Compile this DPIA and all supporting documentation
2. Document the mitigation measures you have implemented or plan to implement
3. Submit to your lead supervisory authority (the DPA in the EU Member State where your main establishment is located)
4. The DPA has up to 8 weeks (extendable by 6 weeks) to provide written advice
5. Do not proceed with the processing until you receive the DPA's response`;
    }

    consultSection += `

### ${sectionNum}.${consultDPA ? "4" : "2"} Internal Consultation

Regardless of DPA consultation requirements, the following internal stakeholders should review this DPIA:

- [ ] Data Protection Officer
- [ ] Legal / Compliance team
- [ ] Engineering / Development team
- [ ] Information Security team
- [ ] Product Management`;

    sections.push(consultSection);
  }

  // ── Section 8: Review Schedule ────────────────────────────────────

  sections.push(`
## ${nextSection()}. Review and Monitoring

### ${sectionNum}.1 Review Schedule

This DPIA must be reviewed:

- **At least annually**, or
- When there is a **significant change** in processing operations, including:
  - New services or data processors added
  - Changes in the type or volume of data processed
  - New purposes for processing
  - Changes in the technical or organizational measures
  - Security incidents involving personal data

### ${sectionNum}.2 Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | ${date} | Auto-generated | Initial DPIA based on code analysis |

> **Action required:** Maintain this version history as the DPIA is reviewed and updated.`);

  // ── Section 9: Sign-off ────────────────────────────────────────────

  sections.push(`
## ${nextSection()}. Approval and Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Data Controller | _________________ | _________________ | __________ |
| Data Protection Officer | _________________ | _________________ | __________ |
| IT / Security Lead | _________________ | _________________ | __________ |
| Legal / Compliance | _________________ | _________________ | __________ |

---

*This Privacy Impact Assessment was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. This document is a starting point and must be reviewed, completed, and approved by qualified personnel including your Data Protection Officer and legal counsel to ensure compliance with GDPR Article 35 and other applicable regulations. It does not constitute legal advice.*`);

  return sections.join("\n");
}

// ── Helpers ────────────────────────────────────────────────────────────

function defaultLegalBasis(category: ServiceCategory): string {
  const bases: Partial<Record<ServiceCategory, string>> = {
    ai: "Consent / Legitimate interest",
    analytics: "Consent",
    advertising: "Consent",
    payment: "Contractual necessity",
    auth: "Contractual necessity",
    email: "Contractual necessity / Consent",
    monitoring: "Legitimate interest",
    storage: "Contractual necessity",
    database: "Contractual necessity",
    social: "Consent",
    other: "Legitimate interest",
  };
  return bases[category] ?? "To be determined";
}

function defaultJustification(category: ServiceCategory): string {
  const justifications: Partial<Record<ServiceCategory, string>> = {
    ai: "Required for AI-powered features; user consent obtained before processing",
    analytics:
      "Used to understand usage patterns and improve the service; requires prior consent",
    advertising:
      "Used for targeted advertising; requires explicit user consent",
    payment: "Necessary to process transactions requested by the user",
    auth: "Necessary to authenticate and maintain user sessions",
    email:
      "Necessary for service communications; marketing requires separate consent",
    monitoring:
      "Legitimate interest in maintaining service reliability and security",
    storage: "Necessary to provide file storage features requested by the user",
    database: "Necessary to persist user data for service delivery",
    social: "Social features activated only with user consent",
    other: "To be documented based on specific use case",
  };
  return justifications[category] ?? "To be documented";
}
