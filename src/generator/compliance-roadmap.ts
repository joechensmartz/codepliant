import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generate a Compliance Roadmap — COMPLIANCE_ROADMAP.md
 * Phased implementation plan from essential documents to advanced compliance.
 * Personalized to detected services and regulatory requirements.
 */
export function generateComplianceRoadmap(
  scan: ScanResult,
  ctx?: GeneratorContext
): string {
  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];

  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasAnalytics = scan.services.some((s) => s.category === "analytics");
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasAuth = scan.services.some((s) => s.category === "auth");
  const hasMonitoring = scan.services.some((s) => s.category === "monitoring");
  const serviceCount = scan.services.length;

  // Determine applicable regulations
  const jurisdictions = ctx?.jurisdictions || [];
  const hasGDPR = jurisdictions.some((j) => j === "gdpr" || j === "uk-gdpr") || true; // GDPR applies broadly
  const hasCCPA = jurisdictions.some((j) => j === "ccpa");

  let md = `# Compliance Roadmap

> **A phased implementation plan for ${company}.**
> Go from zero to fully compliant in 8 weeks.

*Generated on ${date} | ${serviceCount} services detected*

---

## Overview

This roadmap breaks compliance implementation into four phases, prioritized by legal risk and regulatory deadlines. Each phase builds on the previous one.

| Phase | Timeline | Focus | Priority |
|-------|----------|-------|----------|
| Phase 1 | Week 1 | Essential Legal Documents | **Critical** |
| Phase 2 | Weeks 2-4 | Security & Incident Response | **High** |
| Phase 3 | Month 2 | Advanced Compliance & Audit | **Medium** |
| Phase 4 | Ongoing | Monitoring, Updates & Reviews | **Continuous** |

---

## Phase 1: Essential Documents (Week 1)

> **Goal:** Get the minimum viable legal documents published on your website.

These documents carry the highest legal risk if missing. Without them, you are exposed to regulatory fines and user complaints.

### Week 1, Days 1-2: Privacy & Terms

- [ ] **Review and publish Privacy Policy** (\`PRIVACY_POLICY.md\`)
  - Replace all placeholder values (\`[Your Company Name]\`, \`[your-email@example.com]\`)
  - Verify all ${serviceCount} detected services are correctly listed
  - Add to website footer
  - ${hasGDPR ? "GDPR Art. 13 requires this to be accessible before data collection" : "Required in most jurisdictions"}

- [ ] **Review and publish Terms of Service** (\`TERMS_OF_SERVICE.md\`)
  - Customize limitation of liability amounts
  - Review arbitration clause (modify for your jurisdiction)
  - Add to website footer alongside Privacy Policy

`;

  if (hasAnalytics) {
    md += `### Week 1, Day 3: Cookie Compliance

- [ ] **Publish Cookie Policy** (\`COOKIE_POLICY.md\`)
  - Verify all detected cookies are listed
  - Cross-reference with \`COOKIE_INVENTORY.md\`
  - ${hasGDPR ? "ePrivacy Directive requires consent before non-essential cookies" : "Include opt-out mechanisms"}

- [ ] **Deploy cookie consent banner**
  - Import \`COOKIE_CONSENT_CONFIG.json\` into your CMP
  - Test consent flow: banner appears, preferences saved, cookies blocked until consent
  - Verify banner appears on first visit in EU/UK

`;
  }

  if (hasAI) {
    md += `### Week 1, Day 4: AI Compliance

- [ ] **Publish AI Disclosure** (\`AI_DISCLOSURE.md\`)
  - EU AI Act Art. 50 — must disclose AI system usage to users
  - Deadline: **August 2, 2026** (but implement early)
  - Link from main product page, not just buried in legal docs

- [ ] **Review AI Model Card** (\`AI_MODEL_CARD.md\`)
  - Document model capabilities, limitations, and intended use
  - Required for high-risk AI systems under EU AI Act Art. 53

`;
  }

  if (hasPayment) {
    md += `### Week 1, Day 5: Payment Compliance

- [ ] **Publish Refund Policy** (\`REFUND_POLICY.md\`)
  - Required in EU (14-day cooling-off period for digital services)
  - Customize refund window and process for your business model

`;
  }

  md += `### Week 1 Checklist

| Document | Status | Published | URL |
|----------|--------|-----------|-----|
| Privacy Policy | ☐ Reviewed | ☐ Published | \`/privacy\` |
| Terms of Service | ☐ Reviewed | ☐ Published | \`/terms\` |
`;

  if (hasAnalytics) {
    md += `| Cookie Policy | ☐ Reviewed | ☐ Published | \`/cookies\` |
| Cookie Consent Banner | ☐ Configured | ☐ Deployed | — |
`;
  }

  if (hasAI) {
    md += `| AI Disclosure | ☐ Reviewed | ☐ Published | \`/ai-disclosure\` |
`;
  }

  md += `
---

## Phase 2: Security & Incident Response (Weeks 2-4)

> **Goal:** Establish security documentation and breach response procedures.

If a data breach occurs without these documents, response time increases dramatically and regulatory penalties are higher.

### Week 2: Security Foundations

- [ ] **Finalize Security Policy** (\`SECURITY.md\`)
  - Publish as \`SECURITY.md\` in your repository root
  - This is the first document security researchers look for
  - Include responsible disclosure contact

- [ ] **Establish Incident Response Plan** (\`INCIDENT_RESPONSE_PLAN.md\`)
  - Assign incident response team roles
  - Set up communication channels (on-call, Slack channel, etc.)
  - ${hasGDPR ? "GDPR requires 72-hour breach notification to supervisory authority" : "Define notification timelines"}
  - Run a tabletop exercise within 30 days

- [ ] **Review Responsible Disclosure Policy** (\`RESPONSIBLE_DISCLOSURE_POLICY.md\`)
  - Set up security@${ctx?.website || "yourcompany.com"} email
  - Consider a bug bounty program (HackerOne, Bugcrowd)

### Week 3: Access & Change Control

- [ ] **Implement Access Control Policy** (\`ACCESS_CONTROL_POLICY.md\`)
  - Enforce MFA for all team members
  - Review service account permissions
  - Document role-based access matrix

- [ ] **Formalize Change Management** (\`CHANGE_MANAGEMENT_POLICY.md\`)
  - Require code review for all changes
  - Document deployment procedures
  - Establish rollback procedures

### Week 4: Data Protection

- [ ] **Set up Data Subject Request process** (\`DSAR_HANDLING_GUIDE.md\`)
  - Create internal DSAR handling workflow
  - ${hasGDPR ? "GDPR requires response within 30 days" : "Define response timeline"}
  - Document data export and deletion procedures

- [ ] **Review Data Retention Policy** (\`DATA_RETENTION_POLICY.md\`)
  - Define retention periods for each data category
  - Implement automated deletion where possible
  - Document exceptions and legal holds

---

## Phase 3: Advanced Compliance & Audit Readiness (Month 2)

> **Goal:** Prepare for investor due diligence, SOC 2 audit, and advanced regulatory requirements.

`;

  if (serviceCount >= 5) {
    md += `### SOC 2 Preparation

- [ ] **Complete SOC 2 Readiness Checklist** (\`SOC2_READINESS_CHECKLIST.md\`)
  - Map controls to Trust Service Criteria
  - Identify gaps in current implementation
  - Begin evidence collection

- [ ] **Review ISO 27001 Checklist** (\`ISO_27001_CHECKLIST.md\`)
  - Align with Annex A controls
  - Document existing controls
  - Plan gap remediation

`;
  }

  md += `### Data Processing & Transfers

- [ ] **Finalize Data Processing Agreements** (\`DATA_PROCESSING_AGREEMENT.md\`)
  - Send DPA to all ${serviceCount} detected sub-processors
  - Collect signed copies
  - Review \`VENDOR_CONTACTS.md\` for DPA contact details

- [ ] **Complete Privacy Impact Assessment** (\`PRIVACY_IMPACT_ASSESSMENT.md\`)
  - ${hasAI ? "Required for AI-based processing under GDPR Art. 35" : "Recommended for any large-scale data processing"}
  - Document risks and mitigations
  - Review with DPO or legal counsel

- [ ] **Review Transfer Impact Assessment** (\`TRANSFER_IMPACT_ASSESSMENT.md\`)
  - Map all international data transfers
  - Ensure Standard Contractual Clauses are in place
  - Document supplementary measures (Schrems II)

### Vendor Management

- [ ] **Complete Vendor Risk Assessments** (\`THIRD_PARTY_RISK_ASSESSMENT.md\`)
  - Assess each detected sub-processor
  - Use \`VENDOR_SECURITY_QUESTIONNAIRE.md\` for evaluations
  - Score and document vendor risks

- [ ] **Establish Vendor Onboarding Process** (\`VENDOR_ONBOARDING_CHECKLIST.md\`)
  - Define approval workflow for new vendors
  - Require DPA before integration
  - Set review cadence

---

## Phase 4: Ongoing Monitoring & Maintenance

> **Goal:** Keep compliance current as your codebase evolves.

### Automated Monitoring

- [ ] **Set up CI/CD compliance checks**
  \`\`\`yaml
  # .github/workflows/compliance.yml
  - uses: joechensmartz/codepliant@v220
    with:
      fail-on-missing: true
  \`\`\`

- [ ] **Install pre-commit hook**
  \`\`\`bash
  npx codepliant hook install
  \`\`\`

- [ ] **Schedule periodic scans**
  \`\`\`bash
  npx codepliant schedule install --frequency weekly
  \`\`\`

### Review Cadence

| Frequency | Action | Owner | Command |
|-----------|--------|-------|---------|
| **Weekly** | Check compliance dashboard | Engineering lead | \`codepliant dashboard\` |
| **Monthly** | Re-scan and update documents | Engineering lead | \`codepliant update\` |
| **Quarterly** | Full compliance report | CTO/CISO | \`codepliant report\` |
| **Semi-annual** | Vendor review cycle | Security team | Manual review |
| **Annual** | Complete compliance review | DPO/Legal | \`ANNUAL_REVIEW_CHECKLIST.md\` |

### Trigger-Based Updates

Re-run \`npx codepliant go\` whenever you:

- Add a new third-party service or dependency
- Change authentication providers
- Add AI/ML capabilities
- Expand to new markets/jurisdictions
- Change data storage or processing patterns
- Update pricing or terms

---

## Progress Tracker

| Phase | Target Date | Status | Notes |
|-------|-------------|--------|-------|
| Phase 1: Essential Documents | Week 1 | ☐ Not started | |
| Phase 2: Security & IR | Weeks 2-4 | ☐ Not started | |
| Phase 3: Advanced Compliance | Month 2 | ☐ Not started | |
| Phase 4: Ongoing Monitoring | Continuous | ☐ Not started | |

---

## Regulatory Deadlines

| Regulation | Deadline | Impact | Your Status |
|------------|----------|--------|-------------|
`;

  if (hasGDPR) {
    md += `| GDPR | **In effect** | Fines up to 4% global revenue / EUR 20M | ☐ Review required |
`;
  }

  if (hasCCPA) {
    md += `| CCPA/CPRA | **In effect** | Fines up to $7,500 per intentional violation | ☐ Review required |
`;
  }

  if (hasAI) {
    md += `| EU AI Act | **August 2, 2026** | Fines up to EUR 35M / 7% global revenue | ☐ Preparation needed |
`;
  }

  md += `| ePrivacy Directive | **In effect** | Cookie consent requirements | ☐ Review required |

---

*Generated by Codepliant v410.0.0 on ${date}.*
*This roadmap is personalized to your detected stack (${serviceCount} services). Re-run \`npx codepliant go\` after changes to update.*
*This document should be reviewed by a qualified compliance professional.*
`;

  return md;
}
