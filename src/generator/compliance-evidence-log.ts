import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates COMPLIANCE_EVIDENCE_LOG.md — a structured log for tracking
 * compliance evidence across SOC 2 and ISO 27001 audits.
 *
 * For each control: evidence type, date collected, location, reviewer.
 * Auto-populated from detected services, scan results, and config.
 *
 * Returns null when no services are detected.
 */

interface EvidenceEntry {
  controlId: string;
  controlName: string;
  framework: "SOC 2" | "ISO 27001" | "Both";
  evidenceType: "Document" | "Screenshot" | "Log" | "Configuration" | "Interview" | "Observation";
  description: string;
  location: string;
  status: "Collected" | "Pending" | "Not Applicable";
  reviewer: string;
}

function getNextReviewDate(currentDate: string): string {
  const d = new Date(currentDate);
  d.setMonth(d.getMonth() + 3);
  return d.toISOString().split("T")[0];
}

export function generateComplianceEvidenceLog(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const dpoName = ctx?.dpoName || "[Compliance Officer Name]";
  const date = new Date().toISOString().split("T")[0];
  const nextReview = getNextReviewDate(date);
  const jurisdictions = ctx?.jurisdictions || [];

  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasAnalytics = scan.services.some((s) => s.category === "analytics" || s.category === "advertising");
  const hasAuth = scan.services.some((s) => s.category === "auth");
  const hasDatabase = scan.services.some((s) => s.category === "database");
  const hasCloud = scan.services.some((s) => s.category === "storage");
  const hasMonitoring = scan.services.some((s) => s.category === "monitoring");
  const hasEmail = scan.services.some((s) => s.category === "email");

  const serviceCount = scan.services.length;

  const entries: EvidenceEntry[] = [];

  // --- SOC 2 Trust Service Criteria ---

  // CC1 - Control Environment
  entries.push({
    controlId: "CC1.1",
    controlName: "Organizational Commitment to Integrity",
    framework: "SOC 2",
    evidenceType: "Document",
    description: "Code of conduct, ethics policy, and employee acknowledgment records",
    location: "legal/COMPLIANCE_OATH.md, HR records",
    status: "Pending",
    reviewer: dpoName,
  });

  entries.push({
    controlId: "CC1.2",
    controlName: "Board Oversight",
    framework: "SOC 2",
    evidenceType: "Document",
    description: "Board meeting minutes documenting compliance oversight",
    location: "legal/COMPLIANCE_BOARD_REPORT.md",
    status: "Pending",
    reviewer: dpoName,
  });

  // CC2 - Communication and Information
  entries.push({
    controlId: "CC2.1",
    controlName: "Internal Communication",
    framework: "SOC 2",
    evidenceType: "Document",
    description: "Security awareness training records and communication plan",
    location: "legal/SECURITY_AWARENESS_PROGRAM.md, legal/COMPLIANCE_COMMUNICATION_PLAN.md",
    status: "Collected",
    reviewer: dpoName,
  });

  // CC3 - Risk Assessment
  entries.push({
    controlId: "CC3.1",
    controlName: "Risk Assessment Process",
    framework: "Both",
    evidenceType: "Document",
    description: `Risk register covering ${serviceCount} detected service(s) and third-party risk assessments`,
    location: "legal/RISK_REGISTER.md, legal/THIRD_PARTY_RISK_ASSESSMENT.md",
    status: "Collected",
    reviewer: dpoName,
  });

  // CC5 - Control Activities
  if (hasAuth) {
    entries.push({
      controlId: "CC5.1",
      controlName: "Logical Access Controls",
      framework: "Both",
      evidenceType: "Configuration",
      description: "Access control policy and authentication service configuration (detected auth services)",
      location: "legal/ACCESS_CONTROL_POLICY.md, auth service config",
      status: "Collected",
      reviewer: dpoName,
    });
  }

  if (hasDatabase) {
    entries.push({
      controlId: "CC5.2",
      controlName: "Data Protection Controls",
      framework: "Both",
      evidenceType: "Configuration",
      description: "Encryption-at-rest and in-transit configurations for detected database services",
      location: "legal/ENCRYPTION_POLICY.md, database config",
      status: "Pending",
      reviewer: dpoName,
    });
  }

  // CC6 - Logical and Physical Access
  entries.push({
    controlId: "CC6.1",
    controlName: "Access Provisioning",
    framework: "SOC 2",
    evidenceType: "Log",
    description: "User access review logs and provisioning/de-provisioning records",
    location: "IAM system logs, HR records",
    status: "Pending",
    reviewer: dpoName,
  });

  if (hasCloud) {
    entries.push({
      controlId: "CC6.2",
      controlName: "Infrastructure Access",
      framework: "Both",
      evidenceType: "Configuration",
      description: "Cloud infrastructure access controls and MFA configuration",
      location: "Cloud provider console, legal/SECURITY.md",
      status: "Pending",
      reviewer: dpoName,
    });
  }

  // CC7 - System Operations
  entries.push({
    controlId: "CC7.1",
    controlName: "Vulnerability Management",
    framework: "Both",
    evidenceType: "Log",
    description: "Vulnerability scan results and remediation tracking",
    location: "legal/PENETRATION_TEST_SCOPE.md, scanner reports",
    status: "Pending",
    reviewer: dpoName,
  });

  if (hasMonitoring) {
    entries.push({
      controlId: "CC7.2",
      controlName: "System Monitoring",
      framework: "Both",
      evidenceType: "Screenshot",
      description: "Monitoring dashboard screenshots and alerting configuration",
      location: "Monitoring service console, alert config",
      status: "Collected",
      reviewer: dpoName,
    });
  }

  // CC8 - Change Management
  entries.push({
    controlId: "CC8.1",
    controlName: "Change Management Process",
    framework: "Both",
    evidenceType: "Document",
    description: "Change management policy and recent change request records",
    location: "legal/CHANGE_MANAGEMENT_POLICY.md, Git history",
    status: "Collected",
    reviewer: dpoName,
  });

  // CC9 - Risk Mitigation
  entries.push({
    controlId: "CC9.1",
    controlName: "Incident Response",
    framework: "Both",
    evidenceType: "Document",
    description: "Incident response plan and post-incident review records",
    location: "legal/INCIDENT_RESPONSE_PLAN.md, incident logs",
    status: "Collected",
    reviewer: dpoName,
  });

  // --- ISO 27001 Annex A Controls ---

  // A.5 - Information Security Policies
  entries.push({
    controlId: "A.5.1",
    controlName: "Information Security Policy",
    framework: "ISO 27001",
    evidenceType: "Document",
    description: "Information security policy document and management approval",
    location: "legal/INFORMATION_SECURITY_POLICY.md",
    status: "Collected",
    reviewer: dpoName,
  });

  // A.6 - Organization of Information Security
  entries.push({
    controlId: "A.6.1",
    controlName: "Security Roles and Responsibilities",
    framework: "ISO 27001",
    evidenceType: "Document",
    description: "Defined security roles, RACI matrix, and contact information",
    location: "legal/SECURITY.md, legal/KEY_PERSON_RISK_ASSESSMENT.md",
    status: "Collected",
    reviewer: dpoName,
  });

  // A.8 - Asset Management
  entries.push({
    controlId: "A.8.1",
    controlName: "Asset Inventory",
    framework: "ISO 27001",
    evidenceType: "Document",
    description: `Inventory of ${serviceCount} detected service(s) including data classification`,
    location: "legal/DATA_DICTIONARY.md, legal/DATA_FLOW_MAP.md",
    status: "Collected",
    reviewer: dpoName,
  });

  // A.10 - Cryptography
  entries.push({
    controlId: "A.10.1",
    controlName: "Cryptographic Controls",
    framework: "ISO 27001",
    evidenceType: "Configuration",
    description: "Encryption policy and key management procedures",
    location: "legal/ENCRYPTION_POLICY.md",
    status: "Pending",
    reviewer: dpoName,
  });

  // A.12 - Operations Security
  entries.push({
    controlId: "A.12.4",
    controlName: "Logging and Monitoring",
    framework: "ISO 27001",
    evidenceType: "Log",
    description: "Audit log policy and sample logs demonstrating retention",
    location: "legal/AUDIT_LOG_POLICY.md, system logs",
    status: hasMonitoring ? "Collected" : "Pending",
    reviewer: dpoName,
  });

  // A.14 - System Development
  entries.push({
    controlId: "A.14.1",
    controlName: "Secure Development",
    framework: "ISO 27001",
    evidenceType: "Document",
    description: "Secure development lifecycle documentation and code review evidence",
    location: "legal/PRIVACY_BY_DESIGN_CHECKLIST.md, Git PR history",
    status: "Collected",
    reviewer: dpoName,
  });

  // A.15 - Supplier Relationships
  if (serviceCount >= 3) {
    entries.push({
      controlId: "A.15.1",
      controlName: "Supplier Security",
      framework: "ISO 27001",
      evidenceType: "Document",
      description: "Supplier risk assessments, DPAs, and vendor onboarding records",
      location: "legal/VENDOR_ONBOARDING_CHECKLIST.md, legal/THIRD_PARTY_RISK_ASSESSMENT.md",
      status: "Collected",
      reviewer: dpoName,
    });
  }

  // A.16 - Incident Management
  entries.push({
    controlId: "A.16.1",
    controlName: "Incident Management Process",
    framework: "ISO 27001",
    evidenceType: "Document",
    description: "Incident severity matrix, communication templates, and drill records",
    location: "legal/INCIDENT_SEVERITY_MATRIX.md, legal/DATA_BREACH_RESPONSE_DRILL.md",
    status: "Collected",
    reviewer: dpoName,
  });

  // A.18 - Compliance
  entries.push({
    controlId: "A.18.1",
    controlName: "Legal and Regulatory Compliance",
    framework: "ISO 27001",
    evidenceType: "Document",
    description: "Regulatory mapping and compliance gap analysis",
    location: "legal/REGULATORY_MAPPING_MATRIX.md, legal/COMPLIANCE_GAP_ANALYSIS.md",
    status: "Collected",
    reviewer: dpoName,
  });

  // --- AI-specific controls ---
  if (hasAI) {
    entries.push({
      controlId: "AI-1",
      controlName: "AI Governance",
      framework: "Both",
      evidenceType: "Document",
      description: "AI governance framework, model cards, and impact assessments",
      location: "legal/AI_GOVERNANCE_FRAMEWORK.md, legal/AI_MODEL_CARD.md, legal/AI_IMPACT_ASSESSMENT.md",
      status: "Collected",
      reviewer: dpoName,
    });
  }

  // --- Payment-specific controls ---
  if (hasPayment) {
    entries.push({
      controlId: "PCI-1",
      controlName: "Payment Data Handling",
      framework: "Both",
      evidenceType: "Configuration",
      description: "PCI DSS self-assessment questionnaire and payment service configuration",
      location: "Payment provider dashboard, legal/DATA_FLOW_MAP.md",
      status: "Pending",
      reviewer: dpoName,
    });
  }

  // --- Analytics/Advertising controls ---
  if (hasAnalytics) {
    entries.push({
      controlId: "PRIV-1",
      controlName: "Consent Management",
      framework: "Both",
      evidenceType: "Configuration",
      description: "Cookie consent configuration and consent record evidence",
      location: "legal/COOKIE_CONSENT_CONFIG.md, legal/CONSENT_MANAGEMENT_GUIDE.md",
      status: "Collected",
      reviewer: dpoName,
    });
  }

  // --- Build the document ---
  const lines: string[] = [];

  lines.push("# Compliance Evidence Log");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(`> **Organization:** ${company}  `);
  lines.push(`> **Log Owner:** ${dpoName}  `);
  lines.push(`> **Contact:** ${contactEmail}  `);
  lines.push(`> **Last Updated:** ${date}  `);
  lines.push(`> **Next Review:** ${nextReview}  `);
  lines.push(`> **Services in Scope:** ${serviceCount}`);
  lines.push("");

  lines.push("> **Disclaimer:** This evidence log is auto-generated from code analysis and should be reviewed by your compliance team. It provides a starting framework for audit evidence tracking but must be customized to your specific audit scope and requirements.");
  lines.push("");

  // --- Summary ---
  lines.push("## Summary");
  lines.push("");
  const collected = entries.filter((e) => e.status === "Collected").length;
  const pending = entries.filter((e) => e.status === "Pending").length;
  const na = entries.filter((e) => e.status === "Not Applicable").length;
  const total = entries.length;
  const completionPct = total > 0 ? Math.round((collected / total) * 100) : 0;

  lines.push(`| Metric | Value |`);
  lines.push(`| --- | --- |`);
  lines.push(`| Total Controls | ${total} |`);
  lines.push(`| Evidence Collected | ${collected} |`);
  lines.push(`| Evidence Pending | ${pending} |`);
  lines.push(`| Not Applicable | ${na} |`);
  lines.push(`| Completion Rate | ${completionPct}% |`);
  lines.push("");

  // --- SOC 2 Evidence ---
  const soc2Entries = entries.filter((e) => e.framework === "SOC 2" || e.framework === "Both");
  if (soc2Entries.length > 0) {
    lines.push("## SOC 2 Evidence");
    lines.push("");
    lines.push("| Control ID | Control | Evidence Type | Description | Location | Status | Reviewer |");
    lines.push("| --- | --- | --- | --- | --- | --- | --- |");
    for (const e of soc2Entries) {
      lines.push(`| ${e.controlId} | ${e.controlName} | ${e.evidenceType} | ${e.description} | ${e.location} | ${e.status} | ${e.reviewer} |`);
    }
    lines.push("");
  }

  // --- ISO 27001 Evidence ---
  const isoEntries = entries.filter((e) => e.framework === "ISO 27001" || e.framework === "Both");
  if (isoEntries.length > 0) {
    lines.push("## ISO 27001 Evidence");
    lines.push("");
    lines.push("| Control ID | Control | Evidence Type | Description | Location | Status | Reviewer |");
    lines.push("| --- | --- | --- | --- | --- | --- | --- |");
    for (const e of isoEntries) {
      lines.push(`| ${e.controlId} | ${e.controlName} | ${e.evidenceType} | ${e.description} | ${e.location} | ${e.status} | ${e.reviewer} |`);
    }
    lines.push("");
  }

  // --- Evidence Collection Schedule ---
  lines.push("## Evidence Collection Schedule");
  lines.push("");
  lines.push("| Frequency | Activity | Responsible | Due |");
  lines.push("| --- | --- | --- | --- |");
  lines.push(`| Weekly | Review access logs and monitoring alerts | ${dpoName} | Every Monday |`);
  lines.push(`| Monthly | Update vulnerability scan results | ${dpoName} | 1st of month |`);
  lines.push(`| Monthly | Review change management records | ${dpoName} | 1st of month |`);
  lines.push(`| Quarterly | Full evidence collection review | ${dpoName} | ${nextReview} |`);
  lines.push(`| Quarterly | Vendor/supplier compliance check | ${dpoName} | ${nextReview} |`);
  lines.push(`| Annually | Complete re-assessment of all controls | ${dpoName} | ${date} + 1yr |`);
  if (hasAI) {
    lines.push(`| Quarterly | AI model governance review | ${dpoName} | ${nextReview} |`);
  }
  if (hasPayment) {
    lines.push(`| Annually | PCI DSS self-assessment update | ${dpoName} | ${date} + 1yr |`);
  }
  lines.push("");

  // --- Evidence Quality Checklist ---
  lines.push("## Evidence Quality Checklist");
  lines.push("");
  lines.push("For each evidence item, verify:");
  lines.push("");
  lines.push("- [ ] Evidence is dated and timestamped");
  lines.push("- [ ] Evidence covers the full audit period");
  lines.push("- [ ] Evidence is from the production environment");
  lines.push("- [ ] Evidence is stored in a tamper-evident location");
  lines.push("- [ ] Evidence has been reviewed by the assigned reviewer");
  lines.push("- [ ] Evidence clearly maps to the stated control objective");
  lines.push("- [ ] Supporting screenshots include system date/time");
  lines.push("- [ ] Configuration evidence shows both policy and enforcement");
  lines.push("");

  // --- Detected Services in Scope ---
  lines.push("## Services in Scope");
  lines.push("");
  lines.push("The following services were detected during code scanning and are in scope for audit evidence:");
  lines.push("");
  lines.push("| Service | Category | Data Collected |");
  lines.push("| --- | --- | --- |");
  const seen = new Set<string>();
  for (const svc of scan.services) {
    if (seen.has(svc.name)) continue;
    seen.add(svc.name);
    const data = (svc.dataCollected || []).join(", ") || "—";
    lines.push(`| ${svc.name} | ${svc.category} | ${data} |`);
  }
  lines.push("");

  // --- Footer ---
  lines.push("---");
  lines.push("");
  lines.push(`*Generated by Codepliant on ${date}. This evidence log should be reviewed and updated regularly by your compliance team. Consult with your auditor to confirm evidence requirements specific to your audit scope.*`);
  lines.push("");

  return lines.join("\n");
}
