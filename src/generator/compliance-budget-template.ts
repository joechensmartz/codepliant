import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generate a Compliance Budget Template — COMPLIANCE_BUDGET_TEMPLATE.md
 * Estimated costs for compliance program based on detected services and jurisdictions.
 * Categories: tools, legal, training, audit, insurance.
 */
export function generateComplianceBudgetTemplate(
  scan: ScanResult,
  ctx?: GeneratorContext
): string {
  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];

  const serviceCount = scan.services.length;
  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasAuth = scan.services.some((s) => s.category === "auth");
  const hasAnalytics = scan.services.some((s) => s.category === "analytics");
  const hasHealth = scan.complianceNeeds.some(
    (n) => n.document === "HIPAA Compliance"
  );

  const jurisdictions = ctx?.jurisdictions || [];
  const hasGDPR =
    jurisdictions.some((j) => j === "gdpr" || j === "uk-gdpr") || true;
  const hasCCPA = jurisdictions.some((j) => j === "ccpa");

  // Estimate complexity tier based on service count and features
  let tier: "Startup" | "Growth" | "Enterprise" = "Startup";
  if (serviceCount >= 15 || (hasAI && hasPayment)) tier = "Enterprise";
  else if (serviceCount >= 5) tier = "Growth";

  const sections: string[] = [];

  sections.push("# Compliance Budget Template");
  sections.push("");
  sections.push(
    `> **Estimated annual compliance costs for ${company}.**`
  );
  sections.push(
    `> Based on ${serviceCount} detected services | Tier: **${tier}**`
  );
  sections.push("");
  sections.push(`*Generated on ${date}*`);
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## Overview");
  sections.push("");
  sections.push(
    "This budget template provides estimated costs for establishing and maintaining a compliance program. " +
      "Costs are categorized and scaled based on your detected technology stack, applicable regulations, and company tier."
  );
  sections.push("");
  sections.push(
    "> **Important:** These are estimates based on industry averages. Actual costs vary by region, company size, " +
      "and specific requirements. Obtain quotes from vendors before finalizing your budget."
  );

  // --- 1. Tools & Software ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 1. Tools & Software");
  sections.push("");
  sections.push(
    "Software and platforms needed to operationalize compliance."
  );
  sections.push("");
  sections.push(
    "| Tool / Category | Purpose | Estimated Annual Cost | Priority |"
  );
  sections.push(
    "|----------------|---------|----------------------|----------|"
  );
  sections.push(
    `| Compliance management platform | Central compliance dashboard, evidence collection | ${tier === "Startup" ? "$2,000 - $5,000" : tier === "Growth" ? "$5,000 - $15,000" : "$15,000 - $50,000"} | High |`
  );
  sections.push(
    `| Cookie consent management (CMP) | ${hasAnalytics ? "**Required** — analytics cookies detected" : "Cookie banner and preference center"} | $500 - $3,000 | ${hasAnalytics ? "**Critical**" : "Medium"} |`
  );
  sections.push(
    `| DSAR automation | Data subject request handling | ${tier === "Startup" ? "$1,000 - $3,000" : "$3,000 - $10,000"} | ${hasGDPR ? "High" : "Medium"} |`
  );
  sections.push(
    `| Vulnerability scanner | Automated security scanning | $1,000 - $5,000 | High |`
  );
  sections.push(
    `| Secrets management | API key and credential rotation | $0 - $2,000 | High |`
  );

  if (hasAI) {
    sections.push(
      `| AI monitoring / guardrails | Prompt injection detection, output monitoring | $3,000 - $15,000 | **Critical** |`
    );
    sections.push(
      `| AI bias testing platform | Fairness and bias evaluation | $2,000 - $10,000 | High |`
    );
  }

  if (hasPayment) {
    sections.push(
      `| PCI DSS scanning tools | PCI compliance scanning and reporting | $1,000 - $5,000 | **Critical** |`
    );
  }

  sections.push(
    `| Backup and disaster recovery | ${tier === "Enterprise" ? "Enterprise backup solution" : "Basic backup tooling"} | ${tier === "Startup" ? "$500 - $2,000" : "$2,000 - $10,000"} | High |`
  );

  // Tools subtotal
  let toolsLow = tier === "Startup" ? 5000 : tier === "Growth" ? 12000 : 25000;
  let toolsHigh =
    tier === "Startup" ? 20000 : tier === "Growth" ? 45000 : 100000;
  if (hasAI) {
    toolsLow += 5000;
    toolsHigh += 25000;
  }
  if (hasPayment) {
    toolsLow += 1000;
    toolsHigh += 5000;
  }

  sections.push("");
  sections.push(
    `**Tools Subtotal:** $${toolsLow.toLocaleString()} - $${toolsHigh.toLocaleString()} / year`
  );

  // --- 2. Legal & Advisory ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 2. Legal & Advisory");
  sections.push("");
  sections.push(
    "External legal counsel and advisory services for compliance."
  );
  sections.push("");
  sections.push(
    "| Service | Description | Estimated Cost | Frequency |"
  );
  sections.push(
    "|---------|-------------|---------------|-----------|"
  );
  sections.push(
    `| Privacy policy legal review | Attorney review of generated privacy policy | $1,500 - $5,000 | Annual |`
  );
  sections.push(
    `| Terms of service legal review | Attorney review of generated ToS | $1,500 - $5,000 | Annual |`
  );

  if (hasGDPR) {
    sections.push(
      `| GDPR compliance assessment | External GDPR audit and gap analysis | $5,000 - $25,000 | Annual |`
    );
    sections.push(
      `| DPA review | Data Processing Agreement review per vendor | $500 - $2,000 | Per vendor (${serviceCount} detected) |`
    );
  }

  if (hasCCPA) {
    sections.push(
      `| CCPA compliance assessment | External CCPA/CPRA audit | $3,000 - $15,000 | Annual |`
    );
  }

  if (hasAI) {
    sections.push(
      `| EU AI Act compliance review | AI risk classification and compliance assessment | $5,000 - $30,000 | Annual |`
    );
    sections.push(
      `| AI ethics advisory | Independent AI ethics review | $3,000 - $15,000 | Semi-annual |`
    );
  }

  if (hasPayment) {
    sections.push(
      `| PCI DSS QSA assessment | Qualified Security Assessor engagement | $10,000 - $50,000 | Annual |`
    );
  }

  if (hasHealth) {
    sections.push(
      `| HIPAA compliance assessment | External HIPAA audit | $10,000 - $40,000 | Annual |`
    );
  }

  sections.push(
    `| Ongoing legal retainer | Ad-hoc compliance questions and review | ${tier === "Startup" ? "$3,000 - $10,000" : "$10,000 - $50,000"} | Annual |`
  );

  let legalLow = tier === "Startup" ? 6000 : tier === "Growth" ? 15000 : 30000;
  let legalHigh =
    tier === "Startup" ? 25000 : tier === "Growth" ? 70000 : 180000;
  if (hasAI) {
    legalLow += 8000;
    legalHigh += 45000;
  }
  if (hasPayment) {
    legalLow += 10000;
    legalHigh += 50000;
  }

  sections.push("");
  sections.push(
    `**Legal Subtotal:** $${legalLow.toLocaleString()} - $${legalHigh.toLocaleString()} / year`
  );

  // --- 3. Training ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 3. Training & Awareness");
  sections.push("");
  sections.push(
    "Employee training programs required for compliance."
  );
  sections.push("");
  sections.push(
    "| Training Program | Audience | Estimated Cost | Frequency |"
  );
  sections.push(
    "|-----------------|----------|---------------|-----------|"
  );
  sections.push(
    `| Security awareness training | All employees | $500 - $5,000 | Annual |`
  );
  sections.push(
    `| Privacy & data protection training | All employees | $500 - $3,000 | Annual |`
  );
  sections.push(
    `| Incident response tabletop exercise | Security + engineering team | $1,000 - $5,000 | Semi-annual |`
  );

  if (hasAI) {
    sections.push(
      `| AI ethics and responsible AI training | Engineering + product team | $1,000 - $5,000 | Annual |`
    );
  }

  if (hasPayment) {
    sections.push(
      `| PCI DSS awareness training | Anyone handling payment data | $500 - $2,000 | Annual |`
    );
  }

  sections.push(
    `| DSAR handling training | Support + operations team | $500 - $2,000 | Annual |`
  );

  const trainingLow =
    tier === "Startup" ? 3000 : tier === "Growth" ? 5000 : 10000;
  const trainingHigh =
    tier === "Startup" ? 15000 : tier === "Growth" ? 25000 : 50000;

  sections.push("");
  sections.push(
    `**Training Subtotal:** $${trainingLow.toLocaleString()} - $${trainingHigh.toLocaleString()} / year`
  );

  // --- 4. Audit & Certification ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 4. Audit & Certification");
  sections.push("");
  sections.push(
    "External audits and certifications to demonstrate compliance posture."
  );
  sections.push("");
  sections.push(
    "| Audit / Certification | Description | Estimated Cost | Frequency |"
  );
  sections.push(
    "|----------------------|-------------|---------------|-----------|"
  );

  if (tier !== "Startup") {
    sections.push(
      `| SOC 2 Type II audit | Trust Service Criteria audit by CPA firm | $20,000 - $80,000 | Annual |`
    );
    sections.push(
      `| SOC 2 readiness assessment | Pre-audit gap analysis | $5,000 - $15,000 | One-time |`
    );
  }

  sections.push(
    `| Penetration testing | External penetration test | $5,000 - $30,000 | Annual |`
  );
  sections.push(
    `| Vulnerability assessment | Automated + manual vulnerability scan | $2,000 - $10,000 | Quarterly |`
  );

  if (tier === "Enterprise") {
    sections.push(
      `| ISO 27001 certification | Information security management certification | $15,000 - $50,000 | Annual (surveillance) |`
    );
    sections.push(
      `| ISO 27001 initial certification | First-time certification audit | $30,000 - $100,000 | One-time |`
    );
  }

  if (hasPayment) {
    sections.push(
      `| PCI DSS assessment | Level-dependent compliance assessment | $5,000 - $50,000 | Annual |`
    );
  }

  const auditLow =
    tier === "Startup" ? 7000 : tier === "Growth" ? 30000 : 80000;
  const auditHigh =
    tier === "Startup" ? 40000 : tier === "Growth" ? 130000 : 300000;

  sections.push("");
  sections.push(
    `**Audit Subtotal:** $${auditLow.toLocaleString()} - $${auditHigh.toLocaleString()} / year`
  );

  // --- 5. Insurance ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 5. Insurance");
  sections.push("");
  sections.push(
    "Insurance policies to mitigate financial risk from compliance failures."
  );
  sections.push("");
  sections.push(
    "| Policy | Coverage | Estimated Annual Premium | Recommended |"
  );
  sections.push(
    "|--------|----------|------------------------|-------------|"
  );
  sections.push(
    `| Cyber liability insurance | Data breach response, notification costs, legal defense | ${tier === "Startup" ? "$1,000 - $3,000" : tier === "Growth" ? "$3,000 - $10,000" : "$10,000 - $50,000"} | **Yes** |`
  );
  sections.push(
    `| Errors & omissions (E&O) | Professional liability, software errors | ${tier === "Startup" ? "$1,000 - $3,000" : tier === "Growth" ? "$2,000 - $8,000" : "$5,000 - $25,000"} | **Yes** |`
  );
  sections.push(
    `| Technology E&O | Technology-specific professional liability | ${tier === "Startup" ? "$500 - $2,000" : tier === "Growth" ? "$2,000 - $5,000" : "$5,000 - $15,000"} | Recommended |`
  );

  if (hasAI) {
    sections.push(
      `| AI liability coverage | AI-specific errors, bias claims, IP infringement | $2,000 - $15,000 | **Yes** |`
    );
  }

  const insuranceLow =
    tier === "Startup" ? 2500 : tier === "Growth" ? 7000 : 20000;
  const insuranceHigh =
    tier === "Startup" ? 8000 : tier === "Growth" ? 25000 : 100000;

  sections.push("");
  sections.push(
    `**Insurance Subtotal:** $${insuranceLow.toLocaleString()} - $${insuranceHigh.toLocaleString()} / year`
  );

  // --- Total Budget Summary ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## Budget Summary");
  sections.push("");

  const totalLow = toolsLow + legalLow + trainingLow + auditLow + insuranceLow;
  const totalHigh =
    toolsHigh + legalHigh + trainingHigh + auditHigh + insuranceHigh;

  sections.push(
    "| Category | Low Estimate | High Estimate | % of Total (mid) |"
  );
  sections.push(
    "|----------|-------------|--------------|-------------------|"
  );

  const mid = (totalLow + totalHigh) / 2;
  const pct = (low: number, high: number) =>
    Math.round(((low + high) / 2 / mid) * 100);

  sections.push(
    `| Tools & Software | $${toolsLow.toLocaleString()} | $${toolsHigh.toLocaleString()} | ${pct(toolsLow, toolsHigh)}% |`
  );
  sections.push(
    `| Legal & Advisory | $${legalLow.toLocaleString()} | $${legalHigh.toLocaleString()} | ${pct(legalLow, legalHigh)}% |`
  );
  sections.push(
    `| Training & Awareness | $${trainingLow.toLocaleString()} | $${trainingHigh.toLocaleString()} | ${pct(trainingLow, trainingHigh)}% |`
  );
  sections.push(
    `| Audit & Certification | $${auditLow.toLocaleString()} | $${auditHigh.toLocaleString()} | ${pct(auditLow, auditHigh)}% |`
  );
  sections.push(
    `| Insurance | $${insuranceLow.toLocaleString()} | $${insuranceHigh.toLocaleString()} | ${pct(insuranceLow, insuranceHigh)}% |`
  );
  sections.push(
    `| **TOTAL** | **$${totalLow.toLocaleString()}** | **$${totalHigh.toLocaleString()}** | **100%** |`
  );

  sections.push("");
  sections.push(
    `> **Estimated annual compliance investment:** $${totalLow.toLocaleString()} - $${totalHigh.toLocaleString()}`
  );

  // --- Cost Drivers ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## Cost Drivers");
  sections.push("");
  sections.push(
    "The following factors from your scan increase compliance costs:"
  );
  sections.push("");

  const drivers: string[] = [];
  if (hasAI)
    drivers.push(
      `- **AI services detected** — EU AI Act compliance adds $${(8000 + 5000).toLocaleString()}+ in legal and tooling costs`
    );
  if (hasPayment)
    drivers.push(
      "- **Payment processing detected** — PCI DSS compliance adds $10,000+ in audit and assessment costs"
    );
  if (hasHealth)
    drivers.push(
      "- **Health data processing detected** — HIPAA compliance adds $10,000+ in audit costs"
    );
  if (serviceCount >= 10)
    drivers.push(
      `- **${serviceCount} third-party services** — Each vendor requires DPA review ($500-$2,000 each)`
    );
  if (hasGDPR)
    drivers.push(
      "- **GDPR applicability** — Requires DPO consideration, DPIA, and cross-border transfer mechanisms"
    );
  if (hasCCPA)
    drivers.push(
      "- **CCPA/CPRA applicability** — Requires additional privacy rights infrastructure"
    );
  if (hasAuth)
    drivers.push(
      "- **Authentication services detected** — Increases security audit scope and penetration testing requirements"
    );

  if (drivers.length === 0) {
    drivers.push(
      "- **Baseline compliance** — Standard privacy and security requirements apply"
    );
  }

  sections.push(drivers.join("\n"));

  // --- Cost Optimization ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## Cost Optimization Strategies");
  sections.push("");
  sections.push("### Quick Wins");
  sections.push("");
  sections.push(
    "- **Use Codepliant for document generation** — Saves $5,000-$20,000 in initial legal drafting costs"
  );
  sections.push(
    "- **Automate DSAR handling** — Reduces per-request cost from $100+ manual to $5-10 automated"
  );
  sections.push(
    "- **Bundle audits** — Combine SOC 2 + penetration test with one firm for 10-20% discount"
  );
  sections.push(
    "- **Open-source security tools** — Use free tools (OWASP ZAP, Trivy) before investing in commercial scanners"
  );
  sections.push("");
  sections.push("### Phase Your Spending");
  sections.push("");
  sections.push("| Quarter | Focus | Budget Allocation |");
  sections.push("|---------|-------|-------------------|");
  sections.push(
    "| Q1 | Legal review of core documents, basic tooling | 35% |"
  );
  sections.push(
    "| Q2 | Training programs, insurance policies | 20% |"
  );
  sections.push(
    "| Q3 | Audit preparation, certification start | 30% |"
  );
  sections.push(
    "| Q4 | Certification completion, renewal planning | 15% |"
  );

  // --- Per-Service Cost Impact ---
  if (scan.services.length > 0) {
    sections.push("");
    sections.push("---");
    sections.push("");
    sections.push("## Per-Service Compliance Cost Impact");
    sections.push("");
    sections.push(
      "Estimated incremental compliance cost per detected service."
    );
    sections.push("");
    sections.push(
      "| Service | Category | DPA Review | Monitoring | Risk Assessment | Total Impact |"
    );
    sections.push(
      "|---------|----------|-----------|------------|----------------|-------------|"
    );

    for (const svc of scan.services.slice(0, 20)) {
      const isHighRisk =
        svc.category === "ai" || svc.category === "payment";
      const dpaReview = "$500 - $2,000";
      const monitoring = isHighRisk ? "$500 - $2,000" : "$100 - $500";
      const riskAssessment = isHighRisk ? "$1,000 - $3,000" : "$200 - $1,000";
      const totalLow = isHighRisk ? 2000 : 800;
      const totalHigh = isHighRisk ? 7000 : 3500;
      sections.push(
        `| ${svc.name} | ${svc.category} | ${dpaReview} | ${monitoring} | ${riskAssessment} | $${totalLow.toLocaleString()} - $${totalHigh.toLocaleString()} |`
      );
    }

    if (scan.services.length > 20) {
      sections.push(
        `| *... and ${scan.services.length - 20} more* | | | | | |`
      );
    }
  }

  // --- Disclaimer ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push(
    `*This compliance budget template was generated by [Codepliant](https://github.com/joechensmartz/codepliant) ` +
      `based on an automated scan of the **${scan.projectName}** codebase (${serviceCount} services detected, tier: ${tier}). ` +
      `All cost estimates are indicative and based on industry averages as of ${date}. ` +
      `Obtain specific quotes from vendors and legal counsel before finalizing your compliance budget.*`
  );
  sections.push("");

  return sections.join("\n");
}
