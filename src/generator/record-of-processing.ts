import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates RECORD_OF_PROCESSING_ACTIVITIES.md — GDPR Article 30 requirement.
 * Auto-populated from scan results with processing activities table.
 */
export function generateRecordOfProcessing(
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
  lines.push("# Record of Processing Activities");
  lines.push("");
  lines.push(`> **${companyName}** — GDPR Article 30 Record of Processing Activities`);
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
  if (ctx?.euRepresentative) {
    lines.push(`| **EU Representative** | ${ctx.euRepresentative} |`);
  }
  if (ctx?.website) {
    lines.push(`| **Website** | ${ctx.website} |`);
  }
  lines.push(`| **Record Last Updated** | ${date} |`);
  lines.push("");

  // ── Processing Activities Table ─────────────────────────────────────────
  lines.push("## 2. Processing Activities");
  lines.push("");
  lines.push("The following processing activities have been identified through automated code analysis:");
  lines.push("");

  lines.push("| # | Processing Activity | Purpose | Categories of Data Subjects | Categories of Personal Data | Recipients | Lawful Basis | Retention Period |");
  lines.push("|---|---------------------|---------|-----------------------------|-----------------------------|------------|-------------|-----------------|");

  let activityNum = 1;

  // Group by service category and create processing activities
  const categoryActivities = deriveActivities(scan);

  for (const activity of categoryActivities) {
    lines.push(
      `| ${activityNum} | ${activity.name} | ${activity.purpose} | ${activity.dataSubjects} | ${activity.dataCategories} | ${activity.recipients} | ${activity.lawfulBasis} | ${activity.retention} |`
    );
    activityNum++;
  }
  lines.push("");

  // ── Categories of Data Subjects ─────────────────────────────────────────
  lines.push("## 3. Categories of Data Subjects");
  lines.push("");
  const hasAuth = scan.services.some((s) => s.category === "auth");
  const hasAnalytics = scan.services.some((s) => s.category === "analytics");
  const hasPayment = scan.services.some((s) => s.category === "payment");

  lines.push("The following categories of data subjects have been identified:");
  lines.push("");
  if (hasAuth) lines.push("- **Registered Users** — Individuals who create an account on the platform");
  if (hasAnalytics) lines.push("- **Website Visitors** — Individuals who visit the website or use the application");
  if (hasPayment) lines.push("- **Customers** — Individuals who purchase products or services");
  lines.push("- **Data Subjects** — Any individual whose personal data is processed through the application");
  lines.push("");

  // ── Data Transfers ──────────────────────────────────────────────────────
  lines.push("## 4. International Data Transfers");
  lines.push("");

  const thirdPartyServices = scan.services.filter((s) => s.isDataProcessor !== false);
  if (thirdPartyServices.length > 0) {
    lines.push("The following third-party services may involve international data transfers:");
    lines.push("");
    lines.push("| Service | Category | Transfer Mechanism | Safeguards |");
    lines.push("|---------|----------|-------------------|------------|");
    for (const svc of thirdPartyServices) {
      lines.push(
        `| ${svc.name} | ${svc.category} | Standard Contractual Clauses (SCCs) | [Verify with provider] |`
      );
    }
    lines.push("");
  } else {
    lines.push("No third-party international data transfers identified at this time.");
    lines.push("");
  }

  // ── Technical and Organizational Measures ────────────────────────────────
  lines.push("## 5. Technical and Organizational Measures");
  lines.push("");
  lines.push("Under GDPR Article 32, the following measures are implemented to ensure data security:");
  lines.push("");
  lines.push("- [ ] Encryption of personal data in transit (TLS/SSL)");
  lines.push("- [ ] Encryption of personal data at rest");
  lines.push("- [ ] Access control and authentication mechanisms");
  lines.push("- [ ] Regular security assessments and penetration testing");
  lines.push("- [ ] Data backup and disaster recovery procedures");
  lines.push("- [ ] Employee training on data protection");
  lines.push("- [ ] Incident response procedures");
  lines.push("- [ ] Data minimization practices");
  lines.push("- [ ] Pseudonymization where appropriate");
  lines.push("- [ ] Regular review of processing activities");
  lines.push("");

  // ── Data Protection Impact Assessment ────────────────────────────────────
  lines.push("## 6. Data Protection Impact Assessment (DPIA) Requirements");
  lines.push("");

  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasMonitoring = scan.services.some((s) => s.category === "monitoring");

  if (hasAI || hasAnalytics) {
    lines.push("Based on the detected processing activities, a DPIA is **likely required** under GDPR Article 35:");
    lines.push("");
    if (hasAI) lines.push("- AI/automated decision-making services detected");
    if (hasAnalytics) lines.push("- Systematic monitoring/profiling through analytics services detected");
    lines.push("");
    lines.push("A separate DPIA document should be prepared for high-risk processing activities.");
  } else {
    lines.push("Based on current processing activities, a DPIA may not be strictly required.");
    lines.push("However, it is recommended to conduct one as a best practice.");
  }
  lines.push("");

  // ── Review Schedule ──────────────────────────────────────────────────────
  lines.push("## 7. Review Schedule");
  lines.push("");
  lines.push("This record must be reviewed and updated:");
  lines.push("");
  lines.push("- **Annually** — At minimum, a full review of all processing activities");
  lines.push("- **On change** — When new processing activities are introduced");
  lines.push("- **On incident** — Following any data breach or security incident");
  lines.push("- **On request** — When requested by a supervisory authority");
  lines.push("");

  // ── Footer ──────────────────────────────────────────────────────────────
  lines.push("---");
  lines.push("");
  lines.push(
    "*This Record of Processing Activities was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on code analysis. " +
      "It should be reviewed by your Data Protection Officer and legal counsel to ensure completeness and accuracy. " +
      "This document is required under GDPR Article 30 for controllers processing personal data.*"
  );
  lines.push("");

  return lines.join("\n");
}

// ── Activity derivation helpers ────────────────────────────────────────────

interface ProcessingActivity {
  name: string;
  purpose: string;
  dataSubjects: string;
  dataCategories: string;
  recipients: string;
  lawfulBasis: string;
  retention: string;
}

function deriveActivities(scan: ScanResult): ProcessingActivity[] {
  const activities: ProcessingActivity[] = [];
  const hasCategory = (cat: string) => scan.services.some((s) => s.category === cat);

  if (hasCategory("auth")) {
    const authServices = scan.services.filter((s) => s.category === "auth").map((s) => s.name);
    activities.push({
      name: "User Authentication",
      purpose: "Account creation, login, and session management",
      dataSubjects: "Registered Users",
      dataCategories: "Email, name, profile data, session tokens, OAuth tokens",
      recipients: authServices.join(", "),
      lawfulBasis: "Contract performance (Art. 6(1)(b))",
      retention: "[Define retention period]",
    });
  }

  if (hasCategory("analytics")) {
    const analyticsServices = scan.services.filter((s) => s.category === "analytics").map((s) => s.name);
    activities.push({
      name: "Usage Analytics",
      purpose: "Product improvement, user behavior analysis, performance monitoring",
      dataSubjects: "Website Visitors, Registered Users",
      dataCategories: "Page views, click events, device info, IP address, session data",
      recipients: analyticsServices.join(", "),
      lawfulBasis: "Legitimate interest (Art. 6(1)(f)) or Consent (Art. 6(1)(a))",
      retention: "[Define retention period]",
    });
  }

  if (hasCategory("payment")) {
    const paymentServices = scan.services.filter((s) => s.category === "payment").map((s) => s.name);
    activities.push({
      name: "Payment Processing",
      purpose: "Processing purchases, subscriptions, and refunds",
      dataSubjects: "Customers",
      dataCategories: "Payment card data, billing address, transaction history, email",
      recipients: paymentServices.join(", "),
      lawfulBasis: "Contract performance (Art. 6(1)(b))",
      retention: "As required by tax/accounting regulations",
    });
  }

  if (hasCategory("email")) {
    const emailServices = scan.services.filter((s) => s.category === "email").map((s) => s.name);
    activities.push({
      name: "Email Communications",
      purpose: "Transactional emails, notifications, and marketing communications",
      dataSubjects: "Registered Users, Customers",
      dataCategories: "Email addresses, email content, delivery status",
      recipients: emailServices.join(", "),
      lawfulBasis: "Contract performance (Art. 6(1)(b)) / Consent for marketing (Art. 6(1)(a))",
      retention: "[Define retention period]",
    });
  }

  if (hasCategory("ai")) {
    const aiServices = scan.services.filter((s) => s.category === "ai").map((s) => s.name);
    activities.push({
      name: "AI Processing",
      purpose: "AI-powered features, content generation, automated analysis",
      dataSubjects: "Registered Users",
      dataCategories: "User prompts, conversation history, generated content",
      recipients: aiServices.join(", "),
      lawfulBasis: "Consent (Art. 6(1)(a)) or Contract performance (Art. 6(1)(b))",
      retention: "[Define retention period]",
    });
  }

  if (hasCategory("monitoring")) {
    const monitoringServices = scan.services.filter((s) => s.category === "monitoring").map((s) => s.name);
    activities.push({
      name: "Error Monitoring",
      purpose: "Application error tracking, performance monitoring, debugging",
      dataSubjects: "Registered Users, Website Visitors",
      dataCategories: "Error data, stack traces, user context, device information, IP address",
      recipients: monitoringServices.join(", "),
      lawfulBasis: "Legitimate interest (Art. 6(1)(f))",
      retention: "[Define retention period]",
    });
  }

  if (hasCategory("storage")) {
    const storageServices = scan.services.filter((s) => s.category === "storage").map((s) => s.name);
    activities.push({
      name: "File Storage",
      purpose: "User file uploads, media storage, document management",
      dataSubjects: "Registered Users",
      dataCategories: "Uploaded files, file metadata, images, documents",
      recipients: storageServices.join(", "),
      lawfulBasis: "Contract performance (Art. 6(1)(b))",
      retention: "[Define retention period]",
    });
  }

  if (hasCategory("advertising")) {
    const adServices = scan.services.filter((s) => s.category === "advertising").map((s) => s.name);
    activities.push({
      name: "Advertising & Conversion Tracking",
      purpose: "Ad performance measurement, conversion optimization, retargeting",
      dataSubjects: "Website Visitors",
      dataCategories: "Page views, conversion events, device information, cookie data",
      recipients: adServices.join(", "),
      lawfulBasis: "Consent (Art. 6(1)(a))",
      retention: "[Define retention period]",
    });
  }

  if (hasCategory("database")) {
    const dbServices = scan.services.filter((s) => s.category === "database").map((s) => s.name);
    activities.push({
      name: "Data Storage",
      purpose: "Persistent storage of user data as defined by application schema",
      dataSubjects: "Registered Users, Customers",
      dataCategories: "User data as defined in database schema",
      recipients: dbServices.join(", ") + " (self-hosted or managed)",
      lawfulBasis: "Contract performance (Art. 6(1)(b))",
      retention: "[Define retention period]",
    });
  }

  return activities;
}
