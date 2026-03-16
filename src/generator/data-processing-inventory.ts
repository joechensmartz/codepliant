import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates DATA_PROCESSING_INVENTORY.md — a complete inventory of all
 * data processing activities in GDPR Art. 30 Record of Processing
 * Activities format. Each activity includes purpose, legal basis,
 * data types, retention, and recipients.
 */

interface ProcessingActivityEntry {
  id: string;
  activity: string;
  purpose: string;
  legalBasis: string;
  dataTypes: string[];
  dataSubjects: string;
  recipients: string[];
  retention: string;
  transfersOutsideEEA: boolean;
  safeguards: string;
  automatedDecisions: boolean;
  riskLevel: "Low" | "Medium" | "High";
}

/** Map service categories to processing activity entries. */
function deriveActivities(scan: ScanResult, ctx?: GeneratorContext): ProcessingActivityEntry[] {
  const activities: ProcessingActivityEntry[] = [];
  const hasCategory = (cat: string) => scan.services.some((s) => s.category === cat);
  let idCounter = 1;

  function nextId(): string {
    return `PA-${String(idCounter++).padStart(3, "0")}`;
  }

  if (hasCategory("auth")) {
    const svcs = scan.services.filter((s) => s.category === "auth");
    activities.push({
      id: nextId(),
      activity: "User Authentication & Account Management",
      purpose: "Create and manage user accounts, authenticate sessions, handle password resets and SSO flows",
      legalBasis: "Contract performance (Art. 6(1)(b))",
      dataTypes: ["Email address", "Name", "Password hash", "OAuth tokens", "Session identifiers", "Login timestamps", "IP address"],
      dataSubjects: "Registered Users",
      recipients: svcs.map((s) => s.name),
      retention: "Duration of account + 30 days after deletion request",
      transfersOutsideEEA: true,
      safeguards: "Standard Contractual Clauses (SCCs)",
      automatedDecisions: false,
      riskLevel: "Medium",
    });
  }

  if (hasCategory("analytics")) {
    const svcs = scan.services.filter((s) => s.category === "analytics");
    activities.push({
      id: nextId(),
      activity: "Website & Product Analytics",
      purpose: "Measure product usage, analyze user behavior patterns, improve user experience, track feature adoption",
      legalBasis: "Consent (Art. 6(1)(a)) or Legitimate interest (Art. 6(1)(f))",
      dataTypes: ["Page views", "Click events", "Session duration", "Device type", "Browser", "IP address", "Referrer URL", "Geographic region"],
      dataSubjects: "Website Visitors, Registered Users",
      recipients: svcs.map((s) => s.name),
      retention: "26 months (analytics data), 14 months (cookie identifiers)",
      transfersOutsideEEA: true,
      safeguards: "Standard Contractual Clauses (SCCs)",
      automatedDecisions: false,
      riskLevel: "Medium",
    });
  }

  if (hasCategory("payment")) {
    const svcs = scan.services.filter((s) => s.category === "payment");
    activities.push({
      id: nextId(),
      activity: "Payment Processing & Billing",
      purpose: "Process purchases, manage subscriptions, handle refunds, generate invoices, comply with tax obligations",
      legalBasis: "Contract performance (Art. 6(1)(b)) / Legal obligation (Art. 6(1)(c))",
      dataTypes: ["Payment card tokens", "Billing address", "Email", "Transaction amounts", "Invoice history", "Tax ID"],
      dataSubjects: "Customers",
      recipients: svcs.map((s) => s.name),
      retention: "Duration of subscription + 7 years (tax/accounting requirements)",
      transfersOutsideEEA: true,
      safeguards: "PCI DSS compliance, Standard Contractual Clauses",
      automatedDecisions: false,
      riskLevel: "High",
    });
  }

  if (hasCategory("email")) {
    const svcs = scan.services.filter((s) => s.category === "email");
    activities.push({
      id: nextId(),
      activity: "Email Communications",
      purpose: "Send transactional emails (order confirmations, password resets), marketing communications, system notifications",
      legalBasis: "Contract performance (Art. 6(1)(b)) / Consent for marketing (Art. 6(1)(a))",
      dataTypes: ["Email address", "Name", "Email content", "Delivery status", "Open/click tracking", "Unsubscribe preferences"],
      dataSubjects: "Registered Users, Customers, Newsletter Subscribers",
      recipients: svcs.map((s) => s.name),
      retention: "Until unsubscribe (marketing), 90 days delivery logs (transactional)",
      transfersOutsideEEA: true,
      safeguards: "Standard Contractual Clauses (SCCs)",
      automatedDecisions: false,
      riskLevel: "Low",
    });
  }

  if (hasCategory("ai")) {
    const svcs = scan.services.filter((s) => s.category === "ai");
    activities.push({
      id: nextId(),
      activity: "AI-Powered Features & Processing",
      purpose: "Provide AI-powered features including content generation, analysis, recommendations, and automated assistance",
      legalBasis: "Consent (Art. 6(1)(a)) or Contract performance (Art. 6(1)(b))",
      dataTypes: ["User prompts", "Conversation history", "Generated content", "Feature interaction data", "Feedback signals"],
      dataSubjects: "Registered Users",
      recipients: svcs.map((s) => s.name),
      retention: "30 days for prompts/responses, configurable per service",
      transfersOutsideEEA: true,
      safeguards: "Standard Contractual Clauses, Data Processing Addendum with AI provider",
      automatedDecisions: true,
      riskLevel: "High",
    });
  }

  if (hasCategory("monitoring")) {
    const svcs = scan.services.filter((s) => s.category === "monitoring");
    activities.push({
      id: nextId(),
      activity: "Error Monitoring & Application Performance",
      purpose: "Track application errors, monitor performance, debug issues, maintain system reliability",
      legalBasis: "Legitimate interest (Art. 6(1)(f))",
      dataTypes: ["Error stack traces", "Request metadata", "User agent", "IP address", "User context (ID, email)", "Device information"],
      dataSubjects: "Registered Users, Website Visitors",
      recipients: svcs.map((s) => s.name),
      retention: "90 days (error data), 30 days (performance metrics)",
      transfersOutsideEEA: true,
      safeguards: "Standard Contractual Clauses (SCCs)",
      automatedDecisions: false,
      riskLevel: "Low",
    });
  }

  if (hasCategory("storage")) {
    const svcs = scan.services.filter((s) => s.category === "storage");
    activities.push({
      id: nextId(),
      activity: "File Storage & Media Management",
      purpose: "Store user-uploaded files, images, documents, and media assets",
      legalBasis: "Contract performance (Art. 6(1)(b))",
      dataTypes: ["Uploaded files", "File metadata", "EXIF data (images)", "File size", "Upload timestamps"],
      dataSubjects: "Registered Users",
      recipients: svcs.map((s) => s.name),
      retention: "Duration of account + 30 days after deletion",
      transfersOutsideEEA: true,
      safeguards: "Encryption at rest, Standard Contractual Clauses",
      automatedDecisions: false,
      riskLevel: "Medium",
    });
  }

  if (hasCategory("advertising")) {
    const svcs = scan.services.filter((s) => s.category === "advertising");
    activities.push({
      id: nextId(),
      activity: "Advertising & Conversion Tracking",
      purpose: "Measure advertising effectiveness, optimize ad spend, track conversions, build retargeting audiences",
      legalBasis: "Consent (Art. 6(1)(a))",
      dataTypes: ["Page views", "Conversion events", "Click identifiers", "Device fingerprint", "Cookie data", "Advertising ID"],
      dataSubjects: "Website Visitors",
      recipients: svcs.map((s) => s.name),
      retention: "90 days (conversion data), as per consent withdrawal",
      transfersOutsideEEA: true,
      safeguards: "Standard Contractual Clauses (SCCs)",
      automatedDecisions: true,
      riskLevel: "High",
    });
  }

  if (hasCategory("database")) {
    const svcs = scan.services.filter((s) => s.category === "database");
    activities.push({
      id: nextId(),
      activity: "Primary Data Storage",
      purpose: "Persistent storage of application data including user profiles, content, settings, and transactional records",
      legalBasis: "Contract performance (Art. 6(1)(b))",
      dataTypes: ["All user-submitted data as defined by database schema", "Timestamps", "Relational references"],
      dataSubjects: "Registered Users, Customers",
      recipients: svcs.map((s) => s.name + " (managed/self-hosted)"),
      retention: "As defined per data category — see Data Retention Policy",
      transfersOutsideEEA: false,
      safeguards: "Encryption at rest, access controls, regular backups",
      automatedDecisions: false,
      riskLevel: "Medium",
    });
  }

  return activities;
}

export function generateDataProcessingInventory(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const dpoName = ctx?.dpoName || "[Data Protection Officer]";
  const dpoEmail = ctx?.dpoEmail || contactEmail;
  const date = new Date().toISOString().split("T")[0];
  const nextReview = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const activities = deriveActivities(scan, ctx);
  if (activities.length === 0) return null;

  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────────
  lines.push("# Data Processing Inventory");
  lines.push("");
  lines.push(`> **${company}** — Complete Inventory of Data Processing Activities`);
  lines.push(`>`);
  lines.push(`> GDPR Article 30 — Record of Processing Activities Format`);
  lines.push(`>`);
  lines.push(`> Generated on ${date} by [Codepliant](https://github.com/codepliant/codepliant)`);
  lines.push("");

  // ── 1. Controller Information ───────────────────────────────────────────
  lines.push("## 1. Data Controller Information");
  lines.push("");
  lines.push("| Field | Value |");
  lines.push("|-------|-------|");
  lines.push(`| **Organization** | ${company} |`);
  lines.push(`| **Contact Email** | ${contactEmail} |`);
  lines.push(`| **Data Protection Officer** | ${dpoName} (${dpoEmail}) |`);
  if (ctx?.euRepresentative) {
    lines.push(`| **EU Representative (Art. 27)** | ${ctx.euRepresentative} |`);
  }
  if (ctx?.website) {
    lines.push(`| **Website** | ${ctx.website} |`);
  }
  lines.push(`| **Inventory Date** | ${date} |`);
  lines.push(`| **Next Review** | ${nextReview} |`);
  lines.push(`| **Total Processing Activities** | ${activities.length} |`);
  lines.push("");

  // ── 2. Summary Dashboard ────────────────────────────────────────────────
  lines.push("## 2. Processing Activities Summary");
  lines.push("");

  const highRisk = activities.filter((a) => a.riskLevel === "High").length;
  const mediumRisk = activities.filter((a) => a.riskLevel === "Medium").length;
  const lowRisk = activities.filter((a) => a.riskLevel === "Low").length;
  const withTransfers = activities.filter((a) => a.transfersOutsideEEA).length;
  const withAutomated = activities.filter((a) => a.automatedDecisions).length;

  lines.push("| Metric | Count |");
  lines.push("|--------|-------|");
  lines.push(`| Total processing activities | ${activities.length} |`);
  lines.push(`| High risk activities | ${highRisk} |`);
  lines.push(`| Medium risk activities | ${mediumRisk} |`);
  lines.push(`| Low risk activities | ${lowRisk} |`);
  lines.push(`| Activities with international transfers | ${withTransfers} |`);
  lines.push(`| Activities with automated decision-making | ${withAutomated} |`);
  lines.push("");

  if (highRisk > 0) {
    lines.push(`> **DPIA Required:** ${highRisk} high-risk processing activit${highRisk === 1 ? "y has" : "ies have"} been identified. Under GDPR Article 35, a Data Protection Impact Assessment is likely required for these activities.`);
    lines.push("");
  }

  // ── 3. Detailed Processing Activities ───────────────────────────────────
  lines.push("## 3. Detailed Processing Activities");
  lines.push("");

  for (const activity of activities) {
    lines.push(`### ${activity.id}: ${activity.activity}`);
    lines.push("");
    lines.push("| Field | Details |");
    lines.push("|-------|---------|");
    lines.push(`| **Activity ID** | ${activity.id} |`);
    lines.push(`| **Processing Activity** | ${activity.activity} |`);
    lines.push(`| **Purpose of Processing** | ${activity.purpose} |`);
    lines.push(`| **Lawful Basis (Art. 6)** | ${activity.legalBasis} |`);
    lines.push(`| **Categories of Data Subjects** | ${activity.dataSubjects} |`);
    lines.push(`| **Categories of Personal Data** | ${activity.dataTypes.join(", ")} |`);
    lines.push(`| **Recipients / Processors** | ${activity.recipients.join(", ")} |`);
    lines.push(`| **Retention Period** | ${activity.retention} |`);
    lines.push(`| **International Transfers** | ${activity.transfersOutsideEEA ? "Yes — outside EEA" : "No"} |`);
    lines.push(`| **Transfer Safeguards** | ${activity.safeguards} |`);
    lines.push(`| **Automated Decision-Making** | ${activity.automatedDecisions ? "Yes — see DPIA" : "No"} |`);
    lines.push(`| **Risk Level** | **${activity.riskLevel}** |`);
    lines.push("");
  }

  // ── 4. Overview Table ───────────────────────────────────────────────────
  lines.push("## 4. Processing Activities Overview Table");
  lines.push("");
  lines.push("| ID | Activity | Legal Basis | Data Types | Risk |");
  lines.push("|----|----------|-------------|------------|------|");
  for (const activity of activities) {
    const shortData = activity.dataTypes.slice(0, 3).join(", ") + (activity.dataTypes.length > 3 ? " ..." : "");
    lines.push(`| ${activity.id} | ${activity.activity} | ${activity.legalBasis.split("(")[0].trim()} | ${shortData} | ${activity.riskLevel} |`);
  }
  lines.push("");

  // ── 5. Legal Basis Summary ──────────────────────────────────────────────
  lines.push("## 5. Legal Basis Summary");
  lines.push("");
  lines.push("| Legal Basis | Activities Using It |");
  lines.push("|-------------|-------------------|");

  const basisGroups: Record<string, string[]> = {};
  for (const a of activities) {
    const basis = a.legalBasis.split("/")[0].trim();
    if (!basisGroups[basis]) basisGroups[basis] = [];
    basisGroups[basis].push(a.id);
  }
  for (const [basis, ids] of Object.entries(basisGroups)) {
    lines.push(`| ${basis} | ${ids.join(", ")} |`);
  }
  lines.push("");

  // ── 6. International Transfers ──────────────────────────────────────────
  lines.push("## 6. International Data Transfers");
  lines.push("");

  const transferActivities = activities.filter((a) => a.transfersOutsideEEA);
  if (transferActivities.length > 0) {
    lines.push("The following processing activities involve transfers of personal data outside the European Economic Area:");
    lines.push("");
    lines.push("| Activity | Recipients | Safeguard |");
    lines.push("|----------|-----------|-----------|");
    for (const a of transferActivities) {
      lines.push(`| ${a.id}: ${a.activity} | ${a.recipients.join(", ")} | ${a.safeguards} |`);
    }
    lines.push("");
    lines.push("> All international transfers are conducted in accordance with GDPR Chapter V requirements. Transfer Impact Assessments have been or will be conducted for each transfer mechanism.");
  } else {
    lines.push("No processing activities involve international data transfers outside the EEA.");
  }
  lines.push("");

  // ── 7. Review & Maintenance ─────────────────────────────────────────────
  lines.push("## 7. Review & Maintenance");
  lines.push("");
  lines.push("This inventory must be maintained as a living document:");
  lines.push("");
  lines.push("- **Annual review:** Full review of all processing activities by " + nextReview);
  lines.push("- **On new processing:** Update when new services or data processing activities are added");
  lines.push("- **On change:** Update when existing processing purposes, legal bases, or retention periods change");
  lines.push("- **On incident:** Review after any data breach or regulatory inquiry");
  lines.push("- **On request:** Make available to supervisory authorities upon request (GDPR Art. 30(4))");
  lines.push("");

  // ── Footer ──────────────────────────────────────────────────────────────
  lines.push("---");
  lines.push("");
  lines.push(
    "*This Data Processing Inventory was auto-generated by [Codepliant](https://github.com/codepliant/codepliant) based on automated code analysis. " +
    "It follows the GDPR Article 30 Record of Processing Activities format. " +
    "This document must be reviewed and completed by your Data Protection Officer and legal counsel to ensure accuracy.*"
  );
  lines.push("");

  return lines.join("\n");
}
