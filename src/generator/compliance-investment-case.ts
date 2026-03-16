import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates a COMPLIANCE_INVESTMENT_CASE.md — business case for compliance investment.
 * Covers cost of non-compliance (fines, lawsuits, reputation damage),
 * ROI of a compliance program, based on detected regulations and service count.
 */
export function generateComplianceInvestmentCase(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  if (scan.services.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];
  const jurisdictions = ctx?.jurisdictions || [];

  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasAnalytics = scan.services.some(
    (s) => s.category === "analytics" || s.category === "advertising"
  );
  const hasAuth = scan.services.some((s) => s.category === "auth");
  const hasEmail = scan.services.some((s) => s.category === "email");
  const hasStorage = scan.services.some(
    (s) => s.category === "storage" || s.category === "database"
  );

  const showGDPR =
    jurisdictions.length === 0 || jurisdictions.includes("gdpr");
  const showCCPA =
    jurisdictions.includes("ccpa") ||
    (ctx?.companyLocation || "").toUpperCase() === "US" ||
    hasAnalytics;
  const hasCOPPA = scan.complianceNeeds.some(
    (n) => n.document === "COPPA Compliance"
  );
  const hasHIPAA = scan.complianceNeeds.some(
    (n) => n.document === "HIPAA Compliance"
  );

  const serviceCount = scan.services.length;
  const sections: string[] = [];
  let sectionNum = 0;

  function nextSection(): number {
    return ++sectionNum;
  }

  // ── Title ─────────────────────────────────────────────────────────

  sections.push(`# Compliance Investment Case

**Company:** ${company}
**Last updated:** ${date}
**Project:** ${scan.projectName}
**Services detected:** ${serviceCount}

---

This document presents the business case for investing in a compliance program. It outlines the cost of non-compliance, quantifies regulatory exposure, and demonstrates the return on investment (ROI) of proactive compliance.

> **Disclaimer:** This is not legal or financial advice. The figures below are industry estimates and public enforcement data. Consult qualified legal and financial counsel to assess your specific risk exposure.`);

  // ── Executive Summary ──────────────────────────────────────────────

  {
    const regulationCount = [
      showGDPR,
      showCCPA,
      hasAI,
      hasPayment,
      hasCOPPA,
      hasHIPAA,
    ].filter(Boolean).length;

    sections.push(`
## ${nextSection()}. Executive Summary

**${company}** operates a technology stack with **${serviceCount} detected service(s)** that fall under **${regulationCount} regulatory framework(s)**. Non-compliance carries material financial, legal, and reputational risk.

This business case demonstrates that a structured compliance program:

- **Reduces regulatory fine exposure** by 80-95%
- **Lowers breach-related costs** by an average of $1.76M (IBM 2024)
- **Accelerates enterprise sales cycles** by 40-60% through pre-built compliance documentation
- **Reduces legal review costs** by 50-70% through automated document generation

The estimated **annual cost of non-compliance is 2.71x the cost of compliance** (Ponemon Institute).`);
  }

  // ── Cost of Non-Compliance ─────────────────────────────────────────

  {
    let costSection = `
## ${nextSection()}. Cost of Non-Compliance

### Regulatory Fines

| Regulation | Maximum Fine | Typical Fine Range | Applies to ${company}? |
|------------|-------------|-------------------|----------------------|
`;

    if (showGDPR) {
      costSection += `| GDPR | Up to 4% of annual global turnover or EUR 20M | EUR 50K - EUR 1.2B | Yes |\n`;
    }
    if (showCCPA) {
      costSection += `| CCPA/CPRA | $2,500 per violation; $7,500 per intentional violation | $50K - $5M (AG actions) | Yes |\n`;
    }
    if (hasAI) {
      costSection += `| EU AI Act | Up to EUR 35M or 7% of annual global turnover | EUR 100K - EUR 35M | Yes |\n`;
    }
    if (hasPayment) {
      costSection += `| PCI DSS | $5,000 - $100,000/month until compliant | $50K - $500K per incident | Yes |\n`;
    }
    if (hasCOPPA) {
      costSection += `| COPPA | Up to $50,120 per violation | $100K - $5.7M (FTC actions) | Yes |\n`;
    }
    if (hasHIPAA) {
      costSection += `| HIPAA | $100 - $50,000 per violation; up to $1.5M/year per category | $50K - $16M | Yes |\n`;
    }

    costSection += `
### Data Breach Costs (IBM Cost of a Data Breach Report 2024)

| Cost Component | Average Cost |
|---------------|-------------|
| Average total cost of a data breach | $4.88M |
| Cost per compromised record | $169 |
| Cost with compliance failures as factor | +$257,458 |
| Average time to identify a breach | 194 days |
| Average time to contain a breach | 64 days |
| Cost reduction with incident response plan | -$473,706 |
| Cost reduction with security AI/automation | -$1.76M |

### Litigation Exposure

- **Class action settlements:** GDPR/CCPA class actions average $5M-$50M in settlements
- **Regulatory investigations:** Average legal cost of responding to a regulatory inquiry: $1.5M-$3M
- **Contract penalties:** Enterprise customers increasingly include compliance audit rights and penalty clauses in contracts`;

    if (hasAI) {
      costSection += `
- **AI liability:** The EU AI Act introduces strict liability for high-risk AI systems; non-compliance may void insurance coverage`;
    }

    costSection += `

### Reputational Damage

| Impact | Estimated Cost |
|--------|---------------|
| Stock price decline after breach (public companies) | 3-5% average decline |
| Customer churn following a breach | 3.4% average increase |
| Brand recovery timeline | 12-24 months |
| Lost business (largest component of breach cost) | $1.47M average |
| Executive turnover post-breach | 23% of CISOs leave within 12 months |`;

    sections.push(costSection);
  }

  // ── Regulatory Exposure Assessment ─────────────────────────────────

  {
    let exposureSection = `
## ${nextSection()}. Regulatory Exposure Assessment

Based on the ${serviceCount} service(s) detected in **${scan.projectName}**, the following exposure areas have been identified:

`;

    if (hasAnalytics) {
      const analyticsServices = scan.services
        .filter((s) => s.category === "analytics" || s.category === "advertising")
        .map((s) => s.name)
        .join(", ");
      exposureSection += `### Analytics & Advertising (${analyticsServices})
- Cookie consent violations: EUR 10K - EUR 150M (GDPR ePrivacy)
- Cross-border data transfer violations: EUR 50K - EUR 1.2B
- "Sale" of personal information without opt-out: $2,500 - $7,500 per consumer (CCPA)

`;
    }

    if (hasAuth) {
      const authServices = scan.services
        .filter((s) => s.category === "auth")
        .map((s) => s.name)
        .join(", ");
      exposureSection += `### Authentication & User Data (${authServices})
- Inadequate data subject access request handling: EUR 20K - EUR 500K
- Insufficient security measures for personal data: EUR 50K - EUR 10M
- Data retention beyond necessary period: EUR 10K - EUR 100K

`;
    }

    if (hasPayment) {
      const paymentServices = scan.services
        .filter((s) => s.category === "payment")
        .map((s) => s.name)
        .join(", ");
      exposureSection += `### Payment Processing (${paymentServices})
- PCI DSS non-compliance: $5,000 - $100,000/month in penalties
- Card brand fines: $50,000 - $500,000 per data compromise
- Loss of payment processing privileges

`;
    }

    if (hasAI) {
      const aiServices = scan.services
        .filter((s) => s.category === "ai")
        .map((s) => s.name)
        .join(", ");
      exposureSection += `### AI Services (${aiServices})
- EU AI Act non-compliance: up to EUR 35M or 7% annual turnover
- Missing AI transparency obligations: EUR 100K - EUR 15M
- Failure to conduct AI impact assessment: EUR 50K - EUR 10M
- Colorado AI Act violations: private right of action

`;
    }

    if (hasEmail) {
      const emailServices = scan.services
        .filter((s) => s.category === "email")
        .map((s) => s.name)
        .join(", ");
      exposureSection += `### Email Services (${emailServices})
- CAN-SPAM violations: up to $50,120 per email
- GDPR consent violations for marketing: EUR 10K - EUR 500K
- CASL (Canada) violations: up to $10M per violation

`;
    }

    if (hasStorage) {
      const storageServices = scan.services
        .filter((s) => s.category === "storage" || s.category === "database")
        .map((s) => s.name)
        .join(", ");
      exposureSection += `### Storage & Database (${storageServices})
- Inadequate encryption at rest: regulatory fines + breach liability
- Missing data processing agreements: EUR 10K - EUR 500K (GDPR)
- Data residency violations: EUR 50K - EUR 1M per jurisdiction

`;
    }

    sections.push(exposureSection);
  }

  // ── ROI of Compliance Program ──────────────────────────────────────

  {
    const tier =
      serviceCount <= 5 ? "small" : serviceCount <= 15 ? "medium" : "large";
    const investmentRange =
      tier === "small"
        ? "$5,000 - $25,000"
        : tier === "medium"
        ? "$25,000 - $100,000"
        : "$100,000 - $500,000";
    const fineReduction =
      tier === "small"
        ? "$50,000 - $500,000"
        : tier === "medium"
        ? "$500,000 - $5,000,000"
        : "$5,000,000 - $50,000,000";

    let roiSection = `
## ${nextSection()}. Return on Investment (ROI)

### Compliance Program Cost Estimate

Based on **${serviceCount} detected services** (${tier} complexity):

| Investment Area | Estimated Annual Cost |
|----------------|---------------------|
| Compliance tooling (e.g., Codepliant Pro) | $500 - $5,000 |
| Legal review of generated documents | $2,000 - $15,000 |
| Staff training (annual) | $1,000 - $10,000 |
| Incident response readiness | $1,000 - $20,000 |
| Annual compliance audit | $2,000 - $50,000 |
| **Total estimated investment** | **${investmentRange}** |

### Fine Avoidance Value

| Metric | Value |
|--------|-------|
| Estimated fine exposure without compliance | ${fineReduction} |
| Estimated fine reduction with compliance program | 80 - 95% |
| Net fine avoidance value | **${fineReduction}** |

### Additional Business Value

| Benefit | Estimated Impact |
|---------|-----------------|
| Faster enterprise sales (compliance docs ready) | 40 - 60% faster close |
| Reduced legal review time | 50 - 70% reduction |
| Lower cyber insurance premiums | 10 - 30% reduction |
| Competitive differentiation (compliance badge) | Priceless |
| Reduced breach likelihood | 50 - 60% reduction |
| Faster breach containment (incident response plan) | 54 days faster (IBM 2024) |

### ROI Calculation

\`\`\`
Conservative ROI = (Fine Avoidance Value - Program Cost) / Program Cost

`;

    if (tier === "small") {
      roiSection += `Example: ($50,000 - $15,000) / $15,000 = 233% ROI`;
    } else if (tier === "medium") {
      roiSection += `Example: ($500,000 - $60,000) / $60,000 = 733% ROI`;
    } else {
      roiSection += `Example: ($5,000,000 - $300,000) / $300,000 = 1,567% ROI`;
    }

    roiSection += `
\`\`\`

> **Note:** This calculation only includes direct fine avoidance. When factoring in breach cost reduction, insurance savings, and sales acceleration, the actual ROI is significantly higher.`;

    sections.push(roiSection);
  }

  // ── Implementation Roadmap ─────────────────────────────────────────

  {
    let roadmapSection = `
## ${nextSection()}. Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Run Codepliant scan to inventory all services and data flows
- [ ] Generate baseline compliance documents
- [ ] Identify top 3 regulatory priorities based on scan results
- [ ] Engage legal counsel to review generated documents

### Phase 2: Quick Wins (Week 3-4)
- [ ] Publish Privacy Policy and Terms of Service
- [ ] Implement cookie consent mechanism`;

    if (hasAI) {
      roadmapSection += `
- [ ] Draft and publish AI Disclosure document`;
    }
    if (hasPayment) {
      roadmapSection += `
- [ ] Complete PCI DSS Self-Assessment Questionnaire`;
    }

    roadmapSection += `
- [ ] Set up incident response plan and communication tree

### Phase 3: Operational (Month 2-3)
- [ ] Train staff on data protection procedures
- [ ] Implement data subject request (DSAR) handling workflow
- [ ] Review and sign data processing agreements with all vendors
- [ ] Set up compliance monitoring (scheduled Codepliant scans)

### Phase 4: Maturity (Month 4-6)
- [ ] Conduct internal compliance audit
- [ ] Implement continuous compliance monitoring
- [ ] Prepare for external audit or certification
- [ ] Document lessons learned and update compliance program`;

    sections.push(roadmapSection);
  }

  // ── Stakeholder Talking Points ─────────────────────────────────────

  {
    let talkingSection = `
## ${nextSection()}. Stakeholder Talking Points

### For the Board / C-Suite

1. **Risk reduction:** Non-compliance exposes us to regulatory fines that could reach ${showGDPR ? "4% of global annual turnover (GDPR)" : hasAI ? "7% of global annual turnover (EU AI Act)" : "material financial penalties"}.
2. **Competitive advantage:** ${serviceCount > 10 ? "Enterprise" : "B2B"} customers increasingly require compliance documentation before signing contracts.
3. **Insurance:** Demonstrable compliance programs reduce cyber insurance premiums by 10-30%.
4. **Market access:** Many jurisdictions (EU, California, Colorado, Virginia) require compliance as a condition of operating.

### For Engineering

1. **Automated:** Codepliant generates ${serviceCount > 10 ? "80+" : "40+"} compliance documents directly from code analysis — no manual data mapping required.
2. **CI/CD integration:** Compliance checks run alongside tests; no separate workflow.
3. **Developer-friendly:** All documents are Markdown; review them like code in PRs.
4. **Zero runtime impact:** Scans run offline, no data leaves your machine.

### For Legal

1. **Comprehensive coverage:** Documents cover ${[showGDPR ? "GDPR" : "", showCCPA ? "CCPA/CPRA" : "", hasAI ? "EU AI Act" : "", hasPayment ? "PCI DSS" : "", hasCOPPA ? "COPPA" : "", hasHIPAA ? "HIPAA" : ""].filter(Boolean).join(", ") || "applicable regulations"}.
2. **Always current:** Documents regenerate when the codebase changes, ensuring accuracy.
3. **Customizable:** Legal can override any section via config or templates.
4. **Audit trail:** Every document includes generation date and scan metadata.`;

    sections.push(talkingSection);
  }

  // ── Industry Benchmarks ────────────────────────────────────────────

  sections.push(`
## ${nextSection()}. Industry Benchmarks

| Metric | Source | Value |
|--------|--------|-------|
| Average cost of a data breach | IBM 2024 | $4.88M |
| Cost of non-compliance vs compliance | Ponemon | 2.71x more expensive |
| Average GDPR fine (2024) | GDPR Enforcement Tracker | EUR 1.8M |
| Largest GDPR fine to date | Meta (2023) | EUR 1.2B |
| CCPA enforcement actions (2023-2024) | CA AG Office | 40+ actions |
| Average time to achieve compliance | Industry average | 6-12 months |
| Companies with compliance program | Fortune 500 | 98% |
| Startups losing deals due to missing compliance | Vanta 2024 Survey | 67% |`);

  // ── Footer ────────────────────────────────────────────────────────

  sections.push(
    `\n---\n\n*This compliance investment case was generated by [Codepliant](https://github.com/codepliant/codepliant) based on automated code analysis of ${serviceCount} detected service(s). Figures are industry estimates and should be validated with qualified legal and financial counsel.*`
  );

  return sections.join("\n");
}
