import type { ScanResult, DetectedService } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/** Minimum number of services required to generate the ISO 27001 checklist. */
const MIN_SERVICES = 5;

// ── ISO 27001 Annex A Control Mappings ───────────────────────────────

/** Map service categories to relevant Annex A control domains. */
const CATEGORY_TO_CONTROLS: Record<string, string[]> = {
  auth: ["A.5", "A.8"],
  monitoring: ["A.8", "A.5"],
  database: ["A.8", "A.5"],
  payment: ["A.5", "A.8"],
  analytics: ["A.5", "A.8"],
  ai: ["A.5", "A.6", "A.8"],
  email: ["A.5", "A.8"],
  storage: ["A.8", "A.5"],
  advertising: ["A.5", "A.8"],
  social: ["A.5", "A.8"],
  other: [],
};

/** Annex A control domain labels (ISO 27001:2022 structure). */
const ANNEX_A_DOMAINS: Record<string, string> = {
  "A.5": "Organizational Controls (A.5)",
  "A.6": "People Controls (A.6)",
  "A.7": "Physical Controls (A.7)",
  "A.8": "Technological Controls (A.8)",
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

/** Determine which Annex A domains are relevant based on detected categories. */
function getRelevantDomains(services: DetectedService[]): Set<string> {
  const domains = new Set<string>();
  for (const s of services) {
    const controls = CATEGORY_TO_CONTROLS[s.category] || [];
    for (const c of controls) {
      domains.add(c);
    }
  }
  // These always apply
  domains.add("A.5");
  domains.add("A.6");
  domains.add("A.7");
  domains.add("A.8");
  return domains;
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

/** Build the service-to-control mapping table. */
function buildServiceMappingTable(services: DetectedService[]): string {
  const rows: string[] = [];
  rows.push("| Detected Service | Category | Applicable Annex A Domains |");
  rows.push("|-----------------|----------|---------------------------|");

  for (const s of services) {
    const controls = CATEGORY_TO_CONTROLS[s.category] || [];
    const controlLabels = controls.length > 0
      ? controls.map((c) => ANNEX_A_DOMAINS[c] || c).join(", ")
      : "General";
    rows.push(`| ${s.name} | ${formatCategory(s.category)} | ${controlLabels} |`);
  }

  return rows.join("\n");
}

// ── Annex A Control Sections ─────────────────────────────────────────

function organizationalControlsSection(services: DetectedService[]): string {
  const categoryMap = groupByCategory(services);
  const analyticsServices = categoryMap.get("analytics") || [];
  const aiServices = categoryMap.get("ai") || [];
  const paymentServices = categoryMap.get("payment") || [];

  const items: string[] = [];

  items.push(`### A.5 — Organizational Controls

**Objective:** Establish management direction and support for information security in accordance with business requirements and relevant laws and regulations.
`);

  items.push(`#### A.5.1 — Policies for Information Security

- [ ] Establish an Information Security Management System (ISMS) policy
- [ ] Define and communicate the scope of the ISMS
- [ ] Obtain management commitment and sign-off
- [ ] Review information security policies at planned intervals (at least annually)`);

  items.push(`
#### A.5.2 — Information Security Roles and Responsibilities

- [ ] Assign information security roles and responsibilities
- [ ] Appoint an Information Security Officer or equivalent
- [ ] Define segregation of duties for critical operations
- [ ] Document the organizational security structure`);

  items.push(`
#### A.5.10 — Acceptable Use of Information and Assets

- [ ] Define acceptable use policies for information assets
- [ ] Communicate policies to all employees and contractors
- [ ] Include provisions for remote work and BYOD`);

  items.push(`
#### A.5.12 — Classification of Information

- [ ] Define an information classification scheme (e.g., Public, Internal, Confidential, Restricted)
- [ ] Label all information assets according to the classification scheme
- [ ] Define handling procedures for each classification level`);

  if (analyticsServices.length > 0 || aiServices.length > 0) {
    items.push(`
#### A.5.34 — Privacy and Protection of PII

*Data-collecting services detected: ${[...analyticsServices, ...aiServices].map((s) => s.name).join(", ")}*

- [ ] Conduct a Privacy Impact Assessment (PIA/DPIA) for personal data processing
- [ ] Maintain a Record of Processing Activities (ROPA)
- [ ] Define lawful bases for personal data processing
- [ ] Implement data subject rights procedures (access, rectification, erasure)`);
  }

  if (paymentServices.length > 0) {
    items.push(`
#### A.5.19 — Information Security in Supplier Relationships

*Payment services detected: ${paymentServices.map((s) => s.name).join(", ")}*

- [ ] Assess information security risks for all supplier relationships
- [ ] Include security requirements in supplier agreements
- [ ] Monitor and review supplier service delivery
- [ ] Maintain a supplier risk register`);
  }

  items.push(`
#### A.5.24 — Information Security Incident Management Planning

- [ ] Define an incident response plan with clear escalation procedures
- [ ] Assign incident response roles and responsibilities
- [ ] Conduct regular incident response drills
- [ ] Maintain an incident register with lessons learned`);

  items.push(`
#### A.5.29 — Information Security During Disruption

- [ ] Develop a business continuity plan addressing information security
- [ ] Define Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO)
- [ ] Test business continuity plans at least annually`);

  items.push(`
#### A.5.31 — Legal, Statutory, Regulatory, and Contractual Requirements

- [ ] Identify all applicable legal, regulatory, and contractual requirements
- [ ] Maintain a compliance register with obligation tracking
- [ ] Review compliance status at planned intervals`);

  return items.join("\n");
}

function peopleControlsSection(): string {
  return `### A.6 — People Controls

**Objective:** Ensure that employees and contractors understand their responsibilities and are suitable for their roles.

#### A.6.1 — Screening

- [ ] Conduct background checks for all employees with access to sensitive systems
- [ ] Verify qualifications and references prior to employment
- [ ] Define screening requirements proportionate to classification of information accessed

#### A.6.2 — Terms and Conditions of Employment

- [ ] Include information security responsibilities in employment contracts
- [ ] Require non-disclosure agreements (NDAs) for employees and contractors
- [ ] Define acceptable use expectations in employment terms

#### A.6.3 — Information Security Awareness, Education, and Training

- [ ] Conduct security awareness training for all employees (at least annually)
- [ ] Provide role-specific security training for technical staff
- [ ] Track training completion and maintain records
- [ ] Include phishing awareness and social engineering exercises

#### A.6.4 — Disciplinary Process

- [ ] Define a disciplinary process for information security violations
- [ ] Communicate consequences of policy violations to all employees

#### A.6.5 — Responsibilities After Termination or Change of Employment

- [ ] Revoke access to all systems within 24 hours of termination
- [ ] Recover company assets (devices, badges, tokens) upon departure
- [ ] Remind departing employees of continuing confidentiality obligations`;
}

function physicalControlsSection(): string {
  return `### A.7 — Physical Controls

**Objective:** Prevent unauthorized physical access, damage, and interference to the organization's information and information processing facilities.

#### A.7.1 — Physical Security Perimeters

- [ ] Define physical security perimeters for sensitive areas (server rooms, offices)
- [ ] Implement access control for secured areas (badge access, biometrics)
- [ ] Maintain visitor logs for all secured areas

#### A.7.2 — Physical Entry

- [ ] Restrict physical entry to authorized personnel only
- [ ] Monitor entry points with CCTV or equivalent
- [ ] Review physical access rights periodically

#### A.7.4 — Physical Security Monitoring

- [ ] Implement environmental monitoring (temperature, humidity, fire detection)
- [ ] Monitor for unauthorized physical access attempts
- [ ] Test physical security controls regularly

#### A.7.9 — Security of Assets Off-Premises

- [ ] Define policies for protecting equipment used outside the organization
- [ ] Encrypt all portable devices (laptops, USB drives)
- [ ] Implement remote wipe capability for mobile devices

#### A.7.10 — Storage Media

- [ ] Define procedures for secure disposal of storage media
- [ ] Maintain chain-of-custody records for media transfers
- [ ] Use secure erasure or physical destruction for decommissioned media`;
}

function technologicalControlsSection(services: DetectedService[]): string {
  const categoryMap = groupByCategory(services);
  const authServices = categoryMap.get("auth") || [];
  const dbServices = categoryMap.get("database") || [];
  const storageServices = categoryMap.get("storage") || [];
  const monitoringServices = categoryMap.get("monitoring") || [];
  const aiServices = categoryMap.get("ai") || [];

  const items: string[] = [];

  items.push(`### A.8 — Technological Controls

**Objective:** Ensure that information security is implemented and operated within the technology environment.
`);

  items.push(`#### A.8.1 — User Endpoint Devices

- [ ] Define policies for user endpoint devices (laptops, phones)
- [ ] Enforce disk encryption on all endpoints
- [ ] Implement endpoint detection and response (EDR) solutions
- [ ] Manage devices via MDM (Mobile Device Management)`);

  items.push(`
#### A.8.2 — Privileged Access Rights`);

  if (authServices.length > 0) {
    items.push(`
*Authentication services detected: ${authServices.map((s) => s.name).join(", ")}*

- [ ] Restrict privileged access using the principle of least privilege
- [ ] Enforce multi-factor authentication (MFA) for all privileged accounts
- [ ] Review privileged access rights quarterly
- [ ] Log all privileged access activity
- [ ] Use just-in-time (JIT) access where possible`);
  } else {
    items.push(`
- [ ] Implement an authentication service with MFA support
- [ ] Restrict privileged access using the principle of least privilege
- [ ] Review privileged access rights quarterly
- [ ] Log all privileged access activity`);
  }

  items.push(`
#### A.8.5 — Secure Authentication

- [ ] Enforce strong password policies (minimum 12 characters, complexity requirements)
- [ ] Implement account lockout after repeated failed attempts
- [ ] Use secure credential storage (hashing with bcrypt/argon2)
- [ ] Protect authentication tokens and session IDs`);

  items.push(`
#### A.8.7 — Protection Against Malware

- [ ] Deploy anti-malware solutions on all endpoints and servers
- [ ] Implement application whitelisting where feasible
- [ ] Scan all file uploads for malware`);

  items.push(`
#### A.8.8 — Management of Technical Vulnerabilities

- [ ] Run automated dependency vulnerability scanning (e.g., npm audit, Snyk, Dependabot)
- [ ] Conduct periodic penetration testing (at least annually)
- [ ] Maintain a vulnerability remediation SLA (critical: 24h, high: 7d, medium: 30d, low: 90d)
- [ ] Subscribe to vulnerability notification feeds for all technology in use`);

  items.push(`
#### A.8.9 — Configuration Management

- [ ] Maintain hardened baseline configurations for all systems
- [ ] Automate configuration management (Infrastructure as Code)
- [ ] Monitor for configuration drift
- [ ] Review and update configurations at planned intervals`);

  items.push(`
#### A.8.10 — Information Deletion`);

  if (dbServices.length > 0 || storageServices.length > 0) {
    const allStorage = [...dbServices, ...storageServices];
    items.push(`
*Data storage services detected: ${allStorage.map((s) => s.name).join(", ")}*

- [ ] Define data retention and deletion policies per data category
- [ ] Implement automated data purge processes for expired retention periods
- [ ] Verify deletion is complete and irreversible (including backups)
- [ ] Maintain deletion logs for compliance evidence`);
  } else {
    items.push(`
- [ ] Define data retention and deletion policies per data category
- [ ] Implement automated data purge processes for expired retention periods
- [ ] Maintain deletion logs for compliance evidence`);
  }

  items.push(`
#### A.8.15 — Logging

- [ ] Enable logging on all critical systems and applications
- [ ] Protect log files from tampering and unauthorized access
- [ ] Centralize log collection (SIEM)`);

  if (monitoringServices.length > 0) {
    items.push(`- [ ] Configure alerting in: ${monitoringServices.map((s) => s.name).join(", ")}`);
  }

  items.push(`- [ ] Define log retention periods (minimum 12 months recommended)
- [ ] Review logs regularly for security events`);

  items.push(`
#### A.8.20 — Networks Security

- [ ] Segment networks to isolate sensitive systems
- [ ] Implement firewall rules following the principle of least privilege
- [ ] Monitor network traffic for anomalies
- [ ] Use encrypted channels (TLS 1.2+) for all network communications`);

  items.push(`
#### A.8.24 — Use of Cryptography

- [ ] Enforce TLS 1.2+ for all data in transit`);

  if (dbServices.length > 0) {
    items.push(`- [ ] Enable encryption at rest for: ${dbServices.map((s) => s.name).join(", ")}`);
  }
  if (storageServices.length > 0) {
    items.push(`- [ ] Enable encryption at rest for file storage: ${storageServices.map((s) => s.name).join(", ")}`);
  }

  items.push(`- [ ] Document encryption standards and key management procedures
- [ ] Store encryption keys in a dedicated key management service (KMS)
- [ ] Rotate encryption keys on a defined schedule`);

  items.push(`
#### A.8.25 — Secure Development Life Cycle

- [ ] Define a secure software development lifecycle (SSDLC) policy
- [ ] Require code review for all production changes
- [ ] Implement automated security testing in CI/CD pipelines (SAST, DAST)
- [ ] Separate development, staging, and production environments
- [ ] Conduct security architecture reviews for significant changes`);

  if (aiServices.length > 0) {
    items.push(`
#### A.8.28 — Secure Coding (AI-Specific)

*AI services detected: ${aiServices.map((s) => s.name).join(", ")}*

- [ ] Validate AI model inputs and outputs for safety and correctness
- [ ] Implement guardrails for AI-generated content (safety filters, output validation)
- [ ] Log AI processing decisions for auditability
- [ ] Document AI model provenance and training data lineage
- [ ] Conduct bias and fairness assessments for AI models`);
  }

  return items.join("\n");
}

// ── Statement of Applicability Template ──────────────────────────────

function statementOfApplicability(services: DetectedService[]): string {
  const domains = getRelevantDomains(services);

  const rows: string[] = [];
  rows.push("| Control Domain | Applicable | Justification |");
  rows.push("|---------------|------------|---------------|");

  for (const [domain, label] of Object.entries(ANNEX_A_DOMAINS)) {
    const applicable = domains.has(domain) ? "Yes" : "Review Required";
    const justification = domains.has(domain)
      ? "Relevant services and data processing detected"
      : "No directly mapped services detected — review for organizational applicability";
    rows.push(`| ${label} | ${applicable} | ${justification} |`);
  }

  return `## 5. Statement of Applicability (SoA) Template

The Statement of Applicability documents which Annex A controls are applicable to your ISMS and the justification for inclusion or exclusion.

${rows.join("\n")}

> **Note:** All Annex A domains should be evaluated regardless of detected services. This template provides a starting point — your organization must assess applicability based on the full risk assessment.`;
}

// ── Main Generator ────────────────────────────────────────────────────

/**
 * Generate an ISO_27001_CHECKLIST.md document.
 * Returns null when fewer than MIN_SERVICES services are detected.
 */
export function generateISO27001Checklist(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length < MIN_SERVICES) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const date = new Date().toISOString().split("T")[0];

  const sections: string[] = [];

  // ── Title & Introduction ──────────────────────────────────────────

  sections.push(`# ISO 27001 Compliance Checklist

**Last updated:** ${date}

**Project:** ${scan.projectName}

**Organization:** ${company}

**Contact:** ${email}

---

> **Disclaimer:** This checklist is generated based on automated code analysis and is intended as a starting point for ISO 27001 compliance. It is not a substitute for a formal ISO 27001 certification audit or professional guidance. Engage a qualified certification body for your official assessment.

## 1. Overview

This checklist helps ${company} prepare for ISO 27001 certification by mapping detected services and infrastructure to the Annex A controls defined in ISO/IEC 27001:2022. Each section contains actionable items tailored to your project's technology stack.

ISO 27001 requires an Information Security Management System (ISMS) that addresses risks through a combination of organizational, people, physical, and technological controls.

**Detected services:** ${scan.services.length}
**Applicable Annex A domains:** ${Array.from(getRelevantDomains(scan.services)).map((d) => ANNEX_A_DOMAINS[d] || d).join(", ")}`);

  // ── Service-to-Control Mapping ────────────────────────────────────

  sections.push(`
---

## 2. Service-to-Control Mapping

The following table maps each detected service to the applicable ISO 27001 Annex A control domains:

${buildServiceMappingTable(scan.services)}`);

  // ── Annex A Checklist ─────────────────────────────────────────────

  sections.push(`
---

## 3. Annex A Controls Checklist`);

  sections.push(organizationalControlsSection(scan.services));

  sections.push(`
---

${peopleControlsSection()}`);

  sections.push(`
---

${physicalControlsSection()}`);

  sections.push(`
---

${technologicalControlsSection(scan.services)}`);

  // ── Implementation Roadmap ────────────────────────────────────────

  sections.push(`
---

## 4. Implementation Roadmap

| Phase | Duration | Activities |
|-------|----------|-----------|
| **Gap Analysis** | 2-4 weeks | Assess current controls against ISO 27001 requirements |
| **Risk Assessment** | 2-4 weeks | Identify, analyze, and evaluate information security risks |
| **ISMS Design** | 4-8 weeks | Define ISMS scope, policies, and control objectives |
| **Implementation** | 8-16 weeks | Implement controls, procedures, and documentation |
| **Internal Audit** | 2-4 weeks | Conduct internal audit to verify ISMS effectiveness |
| **Management Review** | 1-2 weeks | Review ISMS performance and approve for certification |
| **Stage 1 Audit** | 1-2 weeks | Certification body reviews documentation and readiness |
| **Stage 2 Audit** | 1-2 weeks | Certification body verifies implementation and effectiveness |`);

  // ── Statement of Applicability ────────────────────────────────────

  sections.push(`
---

${statementOfApplicability(scan.services)}`);

  // ── Footer ────────────────────────────────────────────────────────

  sections.push(`
---

## 6. Next Steps

1. **Appoint an ISMS owner** responsible for driving the certification process.
2. **Define the ISMS scope** — which business units, locations, and systems are included.
3. **Conduct a risk assessment** to identify threats and vulnerabilities to your information assets.
4. **Prioritize controls** starting with A.5 (Organizational) and A.8 (Technological) — these have the broadest impact.
5. **Begin documentation** — ISO 27001 requires documented policies, procedures, and evidence of control operation.
6. **Engage a certification body** early to align on scope and expectations.

---

*This ISO 27001 Compliance Checklist was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. It should be reviewed by a qualified professional before use in certification preparation.*`);

  return sections.join("\n");
}
