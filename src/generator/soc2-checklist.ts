import type { ScanResult, DetectedService } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/** Minimum number of services required to generate the SOC 2 readiness checklist. */
const MIN_SERVICES = 5;

// ── SOC 2 Control Mappings ────────────────────────────────────────────

/** Map service categories to relevant SOC 2 Trust Services Criteria sections. */
const CATEGORY_TO_CONTROLS: Record<string, string[]> = {
  auth: ["CC6"],
  monitoring: ["A1", "CC6"],
  database: ["C1", "CC6"],
  payment: ["C1", "CC6", "PI1"],
  analytics: ["PI1", "P1-P8"],
  ai: ["PI1", "C1", "P1-P8"],
  email: ["C1", "P1-P8"],
  storage: ["C1", "CC6"],
  advertising: ["P1-P8"],
  social: ["P1-P8"],
  other: [],
};

/** Human-readable labels for each SOC 2 section. */
const SECTION_LABELS: Record<string, string> = {
  CC6: "Security (CC6)",
  A1: "Availability (A1)",
  PI1: "Processing Integrity (PI1)",
  C1: "Confidentiality (C1)",
  "P1-P8": "Privacy (P1-P8)",
};

/** Format a category key as a human-readable label. */
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

/** Group services by their detected category. */
function groupByCategory(services: DetectedService[]): Map<string, DetectedService[]> {
  const map = new Map<string, DetectedService[]>();
  for (const s of services) {
    const list = map.get(s.category) || [];
    list.push(s);
    map.set(s.category, list);
  }
  return map;
}

/** Determine which SOC 2 sections are relevant based on detected categories. */
function getRelevantSections(services: DetectedService[]): Set<string> {
  const sections = new Set<string>();
  for (const s of services) {
    const controls = CATEGORY_TO_CONTROLS[s.category] || [];
    for (const c of controls) {
      sections.add(c);
    }
  }
  // Security (CC6) is always relevant for SOC 2
  sections.add("CC6");
  // Availability (A1) is always relevant for SOC 2 Type II
  sections.add("A1");
  return sections;
}

/** Build the service-to-control mapping table. */
function buildServiceMappingTable(services: DetectedService[]): string {
  const rows: string[] = [];
  rows.push("| Detected Service | Category | Mapped SOC 2 Controls |");
  rows.push("|-----------------|----------|----------------------|");

  for (const s of services) {
    const controls = CATEGORY_TO_CONTROLS[s.category] || [];
    const controlLabels = controls.length > 0
      ? controls.map((c) => SECTION_LABELS[c] || c).join(", ")
      : "General";
    rows.push(`| ${s.name} | ${formatCategory(s.category)} | ${controlLabels} |`);
  }

  return rows.join("\n");
}

// ── Checklist Sections ────────────────────────────────────────────────

function securitySection(services: DetectedService[]): string {
  const categoryMap = groupByCategory(services);
  const authServices = categoryMap.get("auth") || [];
  const storageServices = categoryMap.get("storage") || [];
  const dbServices = categoryMap.get("database") || [];

  const items: string[] = [];

  items.push(`### Security (CC6) — Common Criteria for Security

**Objective:** Information and systems are protected against unauthorized access, unauthorized disclosure of information, and damage to systems.
`);

  // Access Controls
  items.push(`#### CC6.1 — Logical and Physical Access Controls

- [ ] Implement role-based access control (RBAC) for all systems`);

  if (authServices.length > 0) {
    items.push(`- [ ] Review access control configuration for: ${authServices.map((s) => s.name).join(", ")}`);
    items.push(`- [ ] Enforce multi-factor authentication (MFA) for all user accounts`);
    items.push(`- [ ] Implement session timeout and automatic logout policies`);
    items.push(`- [ ] Document authentication flows and access provisioning/deprovisioning procedures`);
  } else {
    items.push(`- [ ] Implement an authentication service with MFA support`);
  }

  items.push(`- [ ] Maintain an access control matrix documenting who has access to what`);
  items.push(`- [ ] Review and recertify user access quarterly`);
  items.push(`- [ ] Log all access events and authentication attempts`);

  // Encryption
  items.push(`
#### CC6.6 — Encryption

- [ ] Enforce TLS 1.2+ for all data in transit`);

  if (dbServices.length > 0) {
    items.push(`- [ ] Enable encryption at rest for: ${dbServices.map((s) => s.name).join(", ")}`);
  }
  if (storageServices.length > 0) {
    items.push(`- [ ] Enable encryption at rest for file storage: ${storageServices.map((s) => s.name).join(", ")}`);
  }

  items.push(`- [ ] Document encryption standards and key management procedures`);
  items.push(`- [ ] Rotate encryption keys on a defined schedule`);

  // Vulnerability Management
  items.push(`
#### CC6.8 — Vulnerability Management

- [ ] Run automated dependency vulnerability scanning (e.g., npm audit, Snyk, Dependabot)
- [ ] Conduct periodic penetration testing (at least annually)
- [ ] Maintain a vulnerability remediation SLA (critical: 24h, high: 7d, medium: 30d, low: 90d)
- [ ] Document and track all identified vulnerabilities to resolution`);

  return items.join("\n");
}

function availabilitySection(services: DetectedService[]): string {
  const categoryMap = groupByCategory(services);
  const monitoringServices = categoryMap.get("monitoring") || [];

  const items: string[] = [];

  items.push(`### Availability (A1) — Availability for Operations

**Objective:** The system is available for operation and use as committed or agreed.
`);

  // Uptime Monitoring
  items.push(`#### A1.1 — Uptime Monitoring and SLA`);

  if (monitoringServices.length > 0) {
    items.push(`
- [ ] Configure alerting in: ${monitoringServices.map((s) => s.name).join(", ")}
- [ ] Define uptime SLA targets (e.g., 99.9% availability)
- [ ] Set up real-time health check endpoints
- [ ] Implement automated incident alerting with escalation procedures`);
  } else {
    items.push(`
- [ ] Implement application monitoring and alerting (e.g., Sentry, Datadog, PagerDuty)
- [ ] Define uptime SLA targets (e.g., 99.9% availability)
- [ ] Set up real-time health check endpoints`);
  }

  // Disaster Recovery
  items.push(`
#### A1.2 — Disaster Recovery and Business Continuity

- [ ] Document a Disaster Recovery Plan (DRP) with defined RTO and RPO
- [ ] Test disaster recovery procedures at least annually
- [ ] Maintain automated backups with documented retention schedule
- [ ] Define and test failover procedures for critical systems
- [ ] Document business continuity procedures for extended outages
- [ ] Maintain an up-to-date system architecture diagram`);

  // Capacity Planning
  items.push(`
#### A1.3 — Capacity Planning

- [ ] Monitor resource utilization (CPU, memory, storage, network)
- [ ] Set capacity threshold alerts (e.g., 80% utilization triggers review)
- [ ] Document scaling procedures (horizontal and vertical)
- [ ] Review capacity plans quarterly`);

  return items.join("\n");
}

function processingIntegritySection(services: DetectedService[]): string {
  const categoryMap = groupByCategory(services);
  const paymentServices = categoryMap.get("payment") || [];
  const aiServices = categoryMap.get("ai") || [];

  const items: string[] = [];

  items.push(`### Processing Integrity (PI1) — System Processing is Complete, Valid, Accurate, and Timely

**Objective:** System processing is complete, valid, accurate, timely, and authorized.
`);

  // Data Validation
  items.push(`#### PI1.1 — Data Validation and Error Handling

- [ ] Implement input validation on all user-facing endpoints
- [ ] Use schema validation for API request and response payloads
- [ ] Log and alert on data validation failures`);

  if (paymentServices.length > 0) {
    items.push(`- [ ] Implement idempotency controls for payment transactions via: ${paymentServices.map((s) => s.name).join(", ")}
- [ ] Validate transaction amounts and currency codes before processing
- [ ] Reconcile payment records daily`);
  }

  if (aiServices.length > 0) {
    items.push(`- [ ] Validate AI model inputs and outputs for: ${aiServices.map((s) => s.name).join(", ")}
- [ ] Implement guardrails for AI-generated content (safety filters, output validation)
- [ ] Log AI processing decisions for auditability`);
  }

  // Error Handling
  items.push(`
#### PI1.2 — Error Handling and Exception Management

- [ ] Implement structured error handling across all application layers
- [ ] Log all unhandled exceptions with sufficient context for investigation
- [ ] Define error severity levels and corresponding response procedures
- [ ] Monitor error rates and set alerting thresholds
- [ ] Implement graceful degradation for non-critical service failures`);

  // Change Management
  items.push(`
#### PI1.3 — Change Management

- [ ] Require code review for all production changes
- [ ] Maintain a change log or release notes
- [ ] Implement automated testing in CI/CD pipelines
- [ ] Document rollback procedures for production deployments
- [ ] Separate development, staging, and production environments`);

  return items.join("\n");
}

function confidentialitySection(services: DetectedService[]): string {
  const categoryMap = groupByCategory(services);
  const paymentServices = categoryMap.get("payment") || [];
  const dbServices = categoryMap.get("database") || [];
  const storageServices = categoryMap.get("storage") || [];

  const items: string[] = [];

  items.push(`### Confidentiality (C1) — Protection of Confidential Information

**Objective:** Information designated as confidential is protected as committed or agreed.
`);

  // Data Classification
  items.push(`#### C1.1 — Data Classification

- [ ] Define a data classification policy (Public, Internal, Confidential, Restricted)
- [ ] Classify all data stores and label them according to policy
- [ ] Train employees on data handling procedures for each classification level
- [ ] Review data classifications annually or when new data types are introduced`);

  // Encryption at Rest
  items.push(`
#### C1.2 — Encryption at Rest`);

  if (dbServices.length > 0) {
    items.push(`
- [ ] Enable transparent data encryption (TDE) or equivalent for: ${dbServices.map((s) => s.name).join(", ")}`);
  }
  if (storageServices.length > 0) {
    items.push(`- [ ] Enable server-side encryption for: ${storageServices.map((s) => s.name).join(", ")}`);
  }

  items.push(`- [ ] Encrypt all backups at rest
- [ ] Document which encryption algorithms and key lengths are in use
- [ ] Store encryption keys in a dedicated key management service (KMS)`);

  // Encryption in Transit
  items.push(`
#### C1.3 — Encryption in Transit

- [ ] Enforce HTTPS/TLS for all external communications
- [ ] Use TLS for internal service-to-service communication where feasible
- [ ] Disable deprecated TLS versions (TLS 1.0, 1.1)
- [ ] Monitor certificate expiration and automate renewal`);

  // PCI Compliance (if payment services detected)
  if (paymentServices.length > 0) {
    items.push(`
#### C1.4 — PCI DSS Alignment

*Payment services detected: ${paymentServices.map((s) => s.name).join(", ")}*

- [ ] Confirm PCI DSS compliance scope and complete SAQ (Self-Assessment Questionnaire)
- [ ] Never store raw credit card numbers — use tokenization via payment processor
- [ ] Restrict access to cardholder data to authorized personnel only
- [ ] Maintain PCI DSS compliance documentation and evidence
- [ ] Conduct quarterly ASV (Approved Scanning Vendor) scans`);
  }

  return items.join("\n");
}

function privacySection(services: DetectedService[]): string {
  const categoryMap = groupByCategory(services);
  const analyticsServices = categoryMap.get("analytics") || [];
  const advertisingServices = categoryMap.get("advertising") || [];
  const socialServices = categoryMap.get("social") || [];
  const aiServices = categoryMap.get("ai") || [];

  const dataCollectingServices = [
    ...analyticsServices,
    ...advertisingServices,
    ...socialServices,
    ...aiServices,
  ];

  const items: string[] = [];

  items.push(`### Privacy (P1-P8) — Personal Information Protection

**Objective:** Personal information is collected, used, retained, disclosed, and disposed of in conformity with commitments and criteria.
`);

  // P1 — Notice
  items.push(`#### P1 — Notice

- [ ] Publish a clear and accessible Privacy Policy
- [ ] Notify users of data collection purposes before or at the time of collection
- [ ] Describe the types of personal information collected and reasons for collection`);

  if (dataCollectingServices.length > 0) {
    items.push(`- [ ] Disclose third-party data sharing for: ${dataCollectingServices.map((s) => s.name).join(", ")}`);
  }

  // P2 — Choice and Consent
  items.push(`
#### P2 — Choice and Consent

- [ ] Obtain explicit consent before collecting personal information
- [ ] Provide opt-out mechanisms for non-essential data processing
- [ ] Maintain consent records with timestamps`);

  if (analyticsServices.length > 0 || advertisingServices.length > 0) {
    items.push(`- [ ] Implement cookie consent banner with granular opt-in/opt-out controls`);
  }

  // P3 — Collection
  items.push(`
#### P3 — Collection

- [ ] Collect only the minimum personal information necessary (data minimization)
- [ ] Document the legal basis for each category of personal data collected
- [ ] Maintain a Record of Processing Activities (ROPA)`);

  // P4 — Use, Retention, and Disposal
  items.push(`
#### P4 — Use, Retention, and Disposal

- [ ] Use personal information only for the purposes disclosed in the privacy notice
- [ ] Define and enforce data retention periods per data category
- [ ] Implement automated data purge processes for expired retention periods
- [ ] Document data disposal procedures (secure deletion, anonymization)`);

  // P5 — Access
  items.push(`
#### P5 — Access

- [ ] Provide individuals with the ability to access their personal information
- [ ] Implement a self-service data export feature (e.g., account data download)
- [ ] Respond to data subject access requests (DSARs) within regulatory timeframes`);

  // P6 — Disclosure
  items.push(`
#### P6 — Disclosure and Sharing

- [ ] Document all third-party sub-processors and data sharing arrangements
- [ ] Execute Data Processing Agreements (DPAs) with all sub-processors
- [ ] Notify individuals of material changes to data sharing practices`);

  // P7 — Quality
  items.push(`
#### P7 — Data Quality

- [ ] Provide mechanisms for individuals to update or correct their personal information
- [ ] Validate personal data accuracy at the point of collection
- [ ] Periodically review stored personal data for accuracy`);

  // P8 — Monitoring and Enforcement
  items.push(`
#### P8 — Monitoring and Enforcement

- [ ] Conduct periodic privacy impact assessments (PIAs)
- [ ] Monitor for unauthorized access to personal information
- [ ] Maintain a privacy incident response procedure
- [ ] Train employees on privacy obligations and data handling procedures
- [ ] Appoint a privacy owner or Data Protection Officer (DPO)`);

  return items.join("\n");
}

// ── Evidence Collection Guide ─────────────────────────────────────────

function evidenceCollectionGuide(): string {
  return `## 5. Evidence Collection Guide

For each control area, collect and maintain the following evidence artifacts for your SOC 2 Type II audit:

### Security (CC6)
| Evidence Artifact | Description | Frequency |
|------------------|-------------|-----------|
| Access control matrix | Document of who has access to each system | Quarterly review |
| MFA enrollment report | Proof that MFA is enabled for all users | Monthly snapshot |
| Penetration test report | Results from external penetration testing | Annually |
| Vulnerability scan results | Automated scan output showing remediation | Monthly |
| Encryption configuration | Screenshots/configs showing encryption settings | On change |
| Access review records | Logs of quarterly access recertification | Quarterly |

### Availability (A1)
| Evidence Artifact | Description | Frequency |
|------------------|-------------|-----------|
| Uptime reports | SLA monitoring dashboard exports | Monthly |
| Incident post-mortems | Root cause analysis for each outage | Per incident |
| DR test results | Documentation of disaster recovery tests | Annually |
| Backup verification logs | Proof that backups complete and are restorable | Monthly |
| Capacity planning reviews | Resource utilization reports and forecasts | Quarterly |

### Processing Integrity (PI1)
| Evidence Artifact | Description | Frequency |
|------------------|-------------|-----------|
| CI/CD pipeline configs | Build and deployment pipeline definitions | On change |
| Code review records | Pull request approvals and review comments | Per change |
| Test coverage reports | Automated test results and coverage metrics | Per build |
| Change management log | Record of all production changes | Continuous |
| Error rate dashboards | Application error monitoring summaries | Monthly |

### Confidentiality (C1)
| Evidence Artifact | Description | Frequency |
|------------------|-------------|-----------|
| Data classification inventory | Catalog of data stores with classifications | Annually |
| Encryption audit | Verification of encryption at rest and in transit | Quarterly |
| Key management procedures | Documentation of key rotation and storage | On change |
| DPA agreements | Signed Data Processing Agreements with vendors | On onboarding |
| PCI SAQ (if applicable) | Completed PCI Self-Assessment Questionnaire | Annually |

### Privacy (P1-P8)
| Evidence Artifact | Description | Frequency |
|------------------|-------------|-----------|
| Privacy Policy | Published privacy notice | On change |
| Consent records | Logs of user consent with timestamps | Continuous |
| ROPA | Record of Processing Activities | Annually |
| DSAR response logs | Records of data subject access requests handled | Per request |
| Privacy impact assessments | PIA reports for new features or changes | Per project |
| Employee training records | Proof of privacy training completion | Annually |`;
}

// ── Main Generator ────────────────────────────────────────────────────

/**
 * Generate a SOC2_READINESS_CHECKLIST.md document.
 * Returns null when fewer than MIN_SERVICES services are detected.
 */
export function generateSOC2Checklist(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length < MIN_SERVICES) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const date = new Date().toISOString().split("T")[0];
  const relevantSections = getRelevantSections(scan.services);

  const sections: string[] = [];

  // ── Title & Introduction ──────────────────────────────────────────

  sections.push(`# SOC 2 Type II Readiness Checklist

**Last updated:** ${date}

**Project:** ${scan.projectName}

**Organization:** ${company}

**Contact:** ${email}

---

> **Disclaimer:** This checklist is generated based on automated code analysis and is intended as a starting point for SOC 2 Type II readiness. It is not a substitute for a formal SOC 2 audit or professional guidance. Engage a qualified CPA firm for your official SOC 2 examination.

## 1. Overview

This checklist helps ${company} prepare for a SOC 2 Type II audit by mapping detected services and infrastructure to the five Trust Services Criteria (TSC). Each section contains actionable items tailored to your project's technology stack.

**Detected services:** ${scan.services.length}
**Relevant SOC 2 sections:** ${Array.from(relevantSections).map((s) => SECTION_LABELS[s] || s).join(", ")}`);

  // ── Service-to-Control Mapping ────────────────────────────────────

  sections.push(`
---

## 2. Service-to-Control Mapping

The following table maps each detected service to the applicable SOC 2 Trust Services Criteria:

${buildServiceMappingTable(scan.services)}`);

  // ── Readiness Checklist ───────────────────────────────────────────

  sections.push(`
---

## 3. Readiness Checklist`);

  // Always include Security
  sections.push(securitySection(scan.services));

  // Always include Availability
  sections.push(`
---

${availabilitySection(scan.services)}`);

  // Processing Integrity — include if relevant or always for Type II
  if (relevantSections.has("PI1")) {
    sections.push(`
---

${processingIntegritySection(scan.services)}`);
  }

  // Confidentiality — include if relevant
  if (relevantSections.has("C1")) {
    sections.push(`
---

${confidentialitySection(scan.services)}`);
  }

  // Privacy — include if relevant
  if (relevantSections.has("P1-P8")) {
    sections.push(`
---

${privacySection(scan.services)}`);
  }

  // ── Audit Timeline ────────────────────────────────────────────────

  sections.push(`
---

## 4. Recommended Audit Timeline

| Phase | Duration | Activities |
|-------|----------|-----------|
| **Gap Assessment** | 2-4 weeks | Identify gaps between current state and SOC 2 requirements |
| **Remediation** | 4-12 weeks | Implement missing controls and document procedures |
| **Evidence Collection** | Ongoing (6-12 months) | Collect evidence of controls operating effectively over the audit period |
| **Readiness Assessment** | 2-4 weeks | Internal review to verify all controls are in place and operating |
| **Type II Audit** | 4-8 weeks | External auditor examines controls over a minimum 6-month observation period |
| **Report Issuance** | 2-4 weeks | CPA firm issues the SOC 2 Type II report |`);

  // ── Evidence Collection Guide ─────────────────────────────────────

  sections.push(`
---

${evidenceCollectionGuide()}`);

  // ── Footer ────────────────────────────────────────────────────────

  sections.push(`
---

## 6. Next Steps

1. **Assign an owner** for each control area listed above.
2. **Conduct a gap assessment** comparing your current controls to this checklist.
3. **Prioritize remediation** starting with Security (CC6) and Availability (A1).
4. **Begin evidence collection** immediately — SOC 2 Type II requires evidence over a 6-12 month observation period.
5. **Engage an auditor** early to align on scope and expectations.

---

*This SOC 2 Readiness Checklist was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. It should be reviewed by a qualified professional before use in audit preparation.*`);

  return sections.join("\n");
}
