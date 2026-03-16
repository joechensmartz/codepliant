import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generate VENDOR_ONBOARDING_CHECKLIST.md — a structured checklist for
 * onboarding new third-party vendors, covering DPA requirements, security
 * assessments, and data classification.
 *
 * Returns null when fewer than 2 services are detected (not enough
 * vendor complexity to warrant a checklist).
 */

/** Risk tier based on data sensitivity. */
type RiskTier = "Critical" | "High" | "Medium" | "Low";

/** Map service categories to default risk tiers. */
const CATEGORY_RISK: Record<string, RiskTier> = {
  ai: "Critical",
  payment: "Critical",
  auth: "High",
  database: "High",
  analytics: "Medium",
  monitoring: "Medium",
  email: "Medium",
  storage: "High",
  advertising: "Medium",
  social: "Low",
  other: "Low",
};

/** Map service categories to data classification labels. */
const CATEGORY_DATA_CLASS: Record<string, string> = {
  ai: "Confidential — may process user content, prompts, PII",
  payment: "Restricted — processes payment card data, financial PII",
  auth: "Confidential — processes authentication credentials, identity data",
  database: "Confidential — stores application data, potentially all data categories",
  analytics: "Internal — collects behavioral data, device info, IP addresses",
  monitoring: "Internal — collects error logs, stack traces, device metadata",
  email: "Confidential — processes email addresses, message content",
  storage: "Confidential — stores files that may contain any data category",
  advertising: "Internal — processes device IDs, behavioral data, ad interactions",
  social: "Public — processes public profile data, social interactions",
  other: "Internal — classification depends on specific use case",
};

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

export function generateVendorOnboardingChecklist(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  const thirdParty = scan.services.filter((s) => s.isDataProcessor !== false);
  if (thirdParty.length < 2) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const dpoName = ctx?.dpoName || "[DPO Name]";
  const dpoEmail = ctx?.dpoEmail || "[dpo@example.com]";
  const date = new Date().toISOString().split("T")[0];

  const sections: string[] = [];
  let sectionNum = 0;
  function next(): number {
    return ++sectionNum;
  }

  // ── Title ──────────────────────────────────────────────────────────

  sections.push(`# Vendor Onboarding Checklist

**Organization:** ${company}
**Effective Date:** ${date}
**Last Updated:** ${date}
**Document Owner:** ${dpoName} (${dpoEmail})

> This checklist must be completed before onboarding any new third-party vendor that will process, store, or have access to ${company} data. The checklist covers legal, security, privacy, and operational requirements. Each item must be marked complete and signed off before vendor access is provisioned.

---`);

  // ── Current Vendor Inventory ───────────────────────────────────────

  {
    let inventorySection = `
## Current Vendor Inventory

The following third-party vendors were detected in the codebase and are subject to ongoing vendor management:

| # | Vendor | Category | Risk Tier | Data Classification |
|---|--------|----------|-----------|-------------------|
`;

    thirdParty.forEach((svc, i) => {
      const risk = CATEGORY_RISK[svc.category] || "Medium";
      const dataClass = CATEGORY_DATA_CLASS[svc.category] || "Internal";
      inventorySection += `| ${i + 1} | ${svc.name} | ${formatCategory(svc.category)} | ${risk} | ${dataClass} |\n`;
    });

    inventorySection += `
> **Total vendors:** ${thirdParty.length} | **Critical/High risk:** ${thirdParty.filter((s) => CATEGORY_RISK[s.category] === "Critical" || CATEGORY_RISK[s.category] === "High").length}`;

    sections.push(inventorySection);
  }

  // ── 1. Pre-Engagement Assessment ──────────────────────────────────

  sections.push(`
---

## ${next()}. Pre-Engagement Assessment

Complete before initiating any vendor relationship.

- [ ] **Business justification** — Document why this vendor is needed and what alternatives were evaluated
- [ ] **Data inventory** — Identify exactly what data the vendor will access, process, or store
- [ ] **Data classification** — Classify all data the vendor will handle (Public / Internal / Confidential / Restricted)
- [ ] **Risk tier assignment** — Assign vendor risk tier based on data sensitivity:
  - **Critical** — Processes restricted data (payment, health, credentials)
  - **High** — Processes confidential data (PII, authentication, stored files)
  - **Medium** — Processes internal data (analytics, logs, behavioral data)
  - **Low** — Processes only public data
- [ ] **Regulatory check** — Identify applicable regulations (GDPR, CCPA, PCI DSS, HIPAA, SOC 2)
- [ ] **Budget approval** — Obtain financial approval for the vendor engagement`);

  // ── 2. Security Assessment ─────────────────────────────────────────

  sections.push(`
## ${next()}. Security Assessment

Complete for all Medium, High, and Critical risk vendors.

### 2.1 Vendor Security Posture

- [ ] **Security certifications** — Request and verify (check all that apply):
  - [ ] SOC 2 Type II report (current year)
  - [ ] ISO 27001 certification
  - [ ] PCI DSS compliance (if processing payment data)
  - [ ] HIPAA BAA (if processing health data)
  - [ ] CSA STAR certification (if cloud service)
- [ ] **Penetration test report** — Request most recent pentest results (must be within 12 months)
- [ ] **Vulnerability management** — Confirm vendor has a documented vulnerability management program
- [ ] **Incident response plan** — Confirm vendor has a documented incident response plan
- [ ] **Insurance** — Verify vendor carries cyber liability insurance (minimum coverage: $[AMOUNT])

### 2.2 Technical Security Controls

- [ ] **Encryption at rest** — Confirm data is encrypted at rest (AES-256 or equivalent)
- [ ] **Encryption in transit** — Confirm TLS 1.2+ for all data transmission
- [ ] **Access controls** — Confirm role-based access control (RBAC) and principle of least privilege
- [ ] **MFA** — Confirm multi-factor authentication is available and enforced for admin access
- [ ] **Audit logging** — Confirm vendor logs access to ${company} data and provides audit logs on request
- [ ] **Data isolation** — Confirm ${company} data is logically or physically isolated from other customers
- [ ] **Backup & recovery** — Confirm vendor backup procedures and recovery time objectives (RTO/RPO)`);

  // ── 3. Data Processing Agreement ───────────────────────────────────

  sections.push(`
## ${next()}. Data Processing Agreement (DPA)

Required for all vendors that process personal data on behalf of ${company}.

- [ ] **DPA executed** — Signed Data Processing Agreement covering:
  - [ ] Subject matter and duration of processing
  - [ ] Nature and purpose of processing
  - [ ] Types of personal data processed
  - [ ] Categories of data subjects
  - [ ] Obligations and rights of the controller
  - [ ] Sub-processor notification requirements
  - [ ] Data deletion/return upon termination
- [ ] **Standard Contractual Clauses (SCCs)** — If vendor processes data outside the EEA, SCCs or equivalent transfer mechanism must be in place
- [ ] **Transfer Impact Assessment** — Completed for any EU-to-non-EU data transfers
- [ ] **Sub-processor list** — Obtained and reviewed the vendor's current sub-processor list
- [ ] **Sub-processor change notification** — Vendor agrees to notify ${company} of sub-processor changes with [30] days' advance notice

### 3.1 DPA Contact Information

| Field | Value |
|-------|-------|
| ${company} DPO | ${dpoName} (${dpoEmail}) |
| ${company} legal contact | ${email} |
| Vendor DPA contact | [VENDOR DPA CONTACT] |
| DPA execution date | [DATE] |
| DPA renewal date | [DATE] |`);

  // ── 4. Privacy & Compliance ────────────────────────────────────────

  sections.push(`
## ${next()}. Privacy & Compliance Review

- [ ] **Privacy policy review** — Reviewed vendor's public privacy policy for compatibility with ${company}'s commitments
- [ ] **Data retention** — Confirmed vendor's data retention periods align with ${company}'s Data Retention Policy
- [ ] **Data subject rights** — Confirmed vendor can support DSAR fulfillment (access, deletion, portability) within required timelines
- [ ] **Cookie/tracking compliance** — If vendor sets cookies or tracking pixels, confirmed compliance with ePrivacy Directive
- [ ] **Children's data** — If applicable, confirmed vendor is COPPA/Age Verification compliant
- [ ] **Consent management** — Confirmed vendor respects user consent preferences (opt-in/opt-out)
- [ ] **AI/ML transparency** — If vendor uses AI/ML, confirmed:
  - [ ] No training on ${company} customer data without explicit consent
  - [ ] Transparent about AI decision-making processes
  - [ ] Compliant with EU AI Act requirements (if applicable)`);

  // ── 5. Operational Requirements ────────────────────────────────────

  sections.push(`
## ${next()}. Operational Requirements

- [ ] **SLA agreement** — Service Level Agreement executed covering:
  - [ ] Uptime commitment (e.g., 99.9%)
  - [ ] Response time for support tickets
  - [ ] Planned maintenance notification windows
  - [ ] Incident notification timeline (must be ≤ 72 hours for data breaches)
- [ ] **Integration documentation** — Technical integration guide reviewed by engineering team
- [ ] **API security** — API keys, OAuth tokens, or other credentials are:
  - [ ] Stored in environment variables (never hardcoded)
  - [ ] Rotated on a defined schedule
  - [ ] Scoped to minimum required permissions
- [ ] **Exit strategy** — Documented plan for vendor termination including:
  - [ ] Data export process and format
  - [ ] Data deletion confirmation procedure
  - [ ] Timeline for complete data removal
  - [ ] Alternative vendor identified`);

  // ── 6. Approval & Sign-off ─────────────────────────────────────────

  sections.push(`
## ${next()}. Approval & Sign-off

All approvals must be obtained before vendor access is provisioned.

| Role | Name | Approved | Date | Signature |
|------|------|----------|------|-----------|
| **Engineering Lead** | ____________ | [ ] Yes / [ ] No | ______ | ____________ |
| **Security/IT** | ____________ | [ ] Yes / [ ] No | ______ | ____________ |
| **Legal/Privacy** | ____________ | [ ] Yes / [ ] No | ______ | ____________ |
| **Data Protection Officer** | ${dpoName} | [ ] Yes / [ ] No | ______ | ____________ |
| **Budget Owner** | ____________ | [ ] Yes / [ ] No | ______ | ____________ |

### Conditions / Notes

_[Document any conditions, exceptions, or notes from the approval process]_`);

  // ── 7. Ongoing Monitoring ──────────────────────────────────────────

  sections.push(`
## ${next()}. Ongoing Vendor Monitoring

After onboarding, vendors are subject to periodic review:

| Review Activity | Frequency | Responsible |
|----------------|-----------|-------------|
| Security certification renewal check | Annual | Security/IT |
| DPA review and update | Annual | Legal/Privacy |
| Sub-processor list review | Quarterly | DPO |
| Access audit (who has access to what) | Quarterly | Engineering |
| SLA performance review | Quarterly | Engineering |
| Penetration test report review | Annual | Security/IT |
| Data classification review | Annual | DPO |
| Full vendor risk reassessment | Annual | DPO + Security |

### Vendor Removal Triggers

A vendor should be flagged for removal or replacement if:

- Security certification lapses or is revoked
- Data breach occurs with inadequate response
- SLA commitments are repeatedly missed
- Vendor fails to support DSAR fulfillment
- Sub-processor changes introduce unacceptable risk
- Vendor is acquired by an entity in a jurisdiction with inadequate data protection

---

*This Vendor Onboarding Checklist was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on a scan of the project's codebase. It should be reviewed by your legal and procurement teams before use.*`);

  return sections.join("\n");
}
