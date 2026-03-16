import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates COMPLIANCE_ONBOARDING_GUIDE.md — a guide for new employees
 * on compliance procedures, key policies, who to contact, and what
 * documents to read first. Based on detected services and generated docs.
 */

/** Priority reading order categories. */
const READING_PRIORITY = [
  {
    phase: "Day 1 — Immediate",
    docs: [
      { filename: "PRIVACY_POLICY.md", label: "Privacy Policy", why: "Understand what user data the company collects and how it is processed" },
      { filename: "ACCEPTABLE_USE_POLICY.md", label: "Acceptable Use Policy", why: "Know what is and is not permitted when using company systems" },
      { filename: "SECURITY.md", label: "Security Policy", why: "Understand baseline security expectations (passwords, MFA, device handling)" },
    ],
  },
  {
    phase: "Week 1 — Core Compliance",
    docs: [
      { filename: "DATA_PROTECTION_POLICY.md", label: "Data Protection Policy", why: "Learn how the company classifies and handles personal data" },
      { filename: "INCIDENT_RESPONSE_PLAN.md", label: "Incident Response Plan", why: "Know what to do if you discover a data breach or security incident" },
      { filename: "ACCESS_CONTROL_POLICY.md", label: "Access Control Policy", why: "Understand role-based access, least privilege, and how to request permissions" },
      { filename: "EMPLOYEE_PRIVACY_NOTICE.md", label: "Employee Privacy Notice", why: "Understand what data the company collects about you as an employee" },
    ],
  },
  {
    phase: "Week 2 — Operational",
    docs: [
      { filename: "DATA_RETENTION_POLICY.md", label: "Data Retention Policy", why: "Know how long data is kept and when it must be deleted" },
      { filename: "DSAR_HANDLING_GUIDE.md", label: "DSAR Handling Guide", why: "Know how to handle data subject access requests from users" },
      { filename: "CHANGE_MANAGEMENT_POLICY.md", label: "Change Management Policy", why: "Follow proper procedures for code changes and deployments" },
      { filename: "CONSENT_MANAGEMENT_GUIDE.md", label: "Consent Management Guide", why: "Understand how user consent is collected and managed" },
    ],
  },
  {
    phase: "Month 1 — Deep Dive",
    docs: [
      { filename: "DATA_PROCESSING_AGREEMENT.md", label: "Data Processing Agreement", why: "Understand contractual obligations with data processors" },
      { filename: "SUBPROCESSOR_LIST.md", label: "Sub-Processor List", why: "Know which third-party services process user data" },
      { filename: "COMPLIANCE_ROADMAP.md", label: "Compliance Roadmap", why: "Understand the company's compliance goals and timeline" },
      { filename: "RISK_REGISTER.md", label: "Risk Register", why: "Review identified compliance risks and mitigation strategies" },
    ],
  },
];

/** AI-specific onboarding items. */
const AI_ONBOARDING_DOCS = [
  { filename: "AI_DISCLOSURE.md", label: "AI Disclosure", why: "Understand how AI usage is disclosed to end users (EU AI Act Art. 50)" },
  { filename: "ACCEPTABLE_AI_USE_POLICY.md", label: "Acceptable AI Use Policy", why: "Know the rules for using AI tools in your work" },
  { filename: "AI_GOVERNANCE_FRAMEWORK.md", label: "AI Governance Framework", why: "Understand the oversight structure for AI systems" },
];

export function generateComplianceOnboardingGuide(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const dpoEmail = ctx?.dpoEmail;
  const dpoName = ctx?.dpoName;
  const date = new Date().toISOString().split("T")[0];

  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasAnalytics = scan.services.some((s) => s.category === "analytics");
  const hasAuth = scan.services.some((s) => s.category === "auth");

  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────────
  lines.push("# Compliance Onboarding Guide");
  lines.push("");
  lines.push(`> **${company}** — New Employee Compliance Onboarding`);
  lines.push(`>`);
  lines.push(`> Generated on ${date} by [Codepliant](https://github.com/codepliant/codepliant)`);
  lines.push("");

  // ── 1. Welcome ──────────────────────────────────────────────────────────
  lines.push("## 1. Welcome");
  lines.push("");
  lines.push(`Welcome to ${company}. This guide will help you understand your compliance responsibilities from day one. Data protection and security are everyone's responsibility — not just the legal team's.`);
  lines.push("");
  lines.push("**Why this matters:** Our application processes user data through multiple services and platforms. Every team member who touches code, data, or infrastructure must understand the rules that govern how we handle that data.");
  lines.push("");

  // ── 2. Key Contacts ────────────────────────────────────────────────────
  lines.push("## 2. Key Contacts");
  lines.push("");
  lines.push("| Role | Contact |");
  lines.push("|------|---------|");
  lines.push(`| **Privacy / Compliance Lead** | ${contactEmail} |`);
  if (dpoName || dpoEmail) {
    lines.push(`| **Data Protection Officer (DPO)** | ${dpoName || ""}${dpoEmail ? ` (${dpoEmail})` : ""} |`);
  }
  lines.push(`| **Security Team** | ${ctx?.securityEmail || contactEmail} |`);
  lines.push(`| **Incident Reporting** | ${contactEmail} — report immediately, do not wait |`);
  lines.push("");
  lines.push("> **Rule of thumb:** If you are unsure whether something involves personal data or a compliance obligation, ask. It is always better to ask first than to fix a breach later.");
  lines.push("");

  // ── 3. Services We Use ──────────────────────────────────────────────────
  lines.push("## 3. Services That Process User Data");
  lines.push("");
  lines.push("The following third-party services have been detected in our codebase. Each one processes user data and is covered by our compliance documentation:");
  lines.push("");
  lines.push("| Service | Category | Data Processed |");
  lines.push("|---------|----------|---------------|");

  const dataProcessors = scan.services.filter((s) => s.isDataProcessor !== false);
  for (const svc of dataProcessors) {
    lines.push(`| ${svc.name} | ${formatCategory(svc.category)} | ${svc.dataCollected.join(", ")} |`);
  }
  lines.push("");
  lines.push(`**Total services:** ${dataProcessors.length}. Before integrating a new service, check with the compliance lead to ensure it is added to our sub-processor list and covered by a Data Processing Agreement.`);
  lines.push("");

  // ── 4. Reading Order ────────────────────────────────────────────────────
  lines.push("## 4. Required Reading — Priority Order");
  lines.push("");
  lines.push("Read these documents in order. Each phase builds on the previous one.");
  lines.push("");

  for (const phase of READING_PRIORITY) {
    lines.push(`### ${phase.phase}`);
    lines.push("");
    lines.push("| Document | Why You Need It |");
    lines.push("|----------|----------------|");
    for (const doc of phase.docs) {
      lines.push(`| [${doc.label}](./${doc.filename}) | ${doc.why} |`);
    }
    lines.push("");
  }

  // AI-specific reading
  if (hasAI) {
    lines.push("### AI-Specific Reading (Required for AI Team Members)");
    lines.push("");
    lines.push("Our application uses AI services. If you work on AI features or use AI tools in your workflow, these are mandatory:");
    lines.push("");
    lines.push("| Document | Why You Need It |");
    lines.push("|----------|----------------|");
    for (const doc of AI_ONBOARDING_DOCS) {
      lines.push(`| [${doc.label}](./${doc.filename}) | ${doc.why} |`);
    }
    lines.push("");
  }

  // ── 5. Key Policies Summary ─────────────────────────────────────────────
  lines.push("## 5. Key Policies — Quick Reference");
  lines.push("");

  lines.push("### Data Handling Rules");
  lines.push("");
  lines.push("- **Never** store personal data in logs, comments, or debug output");
  lines.push("- **Never** share production data in Slack, email, or tickets");
  lines.push("- **Never** copy production data to development environments without anonymization");
  lines.push("- **Always** use the minimum amount of data necessary for your task");
  lines.push("- **Always** encrypt personal data in transit and at rest");
  lines.push("");

  lines.push("### Access & Authentication");
  lines.push("");
  lines.push("- Enable MFA on all accounts (corporate and third-party services)");
  lines.push("- Use unique, strong passwords via the company password manager");
  lines.push("- Never share credentials or API keys via email, Slack, or code commits");
  lines.push("- Request only the access permissions you need — least privilege principle");
  lines.push("");

  lines.push("### Incident Response");
  lines.push("");
  lines.push("If you discover or suspect a data breach or security incident:");
  lines.push("");
  lines.push("1. **Report immediately** — contact the security team within 1 hour");
  lines.push("2. **Do not attempt to fix it yourself** unless you are on the incident response team");
  lines.push("3. **Preserve evidence** — do not delete logs, emails, or files related to the incident");
  lines.push("4. **Document everything** — note the time, what you observed, and what actions you took");
  lines.push("");
  lines.push("> Under GDPR, we have **72 hours** to report certain breaches to supervisory authorities. The clock starts when we become aware — that means your speed in reporting matters.");
  lines.push("");

  if (hasPayment) {
    lines.push("### Payment Data (PCI DSS)");
    lines.push("");
    lines.push("- Never log, screenshot, or store raw payment card numbers");
    lines.push("- Payment data is handled exclusively through our payment processor (see Sub-Processor List)");
    lines.push("- If you encounter raw payment data anywhere in the system, report it immediately");
    lines.push("");
  }

  if (hasAI) {
    lines.push("### AI Usage Rules");
    lines.push("");
    lines.push("- Do not input sensitive personal data (PII, health data, financial data) into AI tools unless explicitly authorized");
    lines.push("- All AI-generated outputs must be reviewed by a human before being used in decisions affecting users");
    lines.push("- AI tool usage must comply with the Acceptable AI Use Policy");
    lines.push("- Users must be informed when they are interacting with AI systems (EU AI Act Art. 50)");
    lines.push("");
  }

  // ── 6. Onboarding Checklist ─────────────────────────────────────────────
  lines.push("## 6. Onboarding Checklist");
  lines.push("");
  lines.push("Complete these items within your first 30 days:");
  lines.push("");
  lines.push("- [ ] Read all Day 1 documents (Privacy Policy, AUP, Security Policy)");
  lines.push("- [ ] Enable MFA on all corporate accounts");
  lines.push("- [ ] Set up the company password manager");
  lines.push("- [ ] Read all Week 1 documents (Data Protection, Incident Response, Access Control)");
  lines.push("- [ ] Complete security awareness training (if available)");
  lines.push("- [ ] Review the services list above — understand which ones you interact with");
  lines.push("- [ ] Read all Week 2 documents (Data Retention, DSAR, Change Management)");
  lines.push("- [ ] Read all Month 1 documents (DPA, Sub-Processors, Roadmap, Risk Register)");
  if (hasAI) {
    lines.push("- [ ] Read AI-specific documents (if applicable to your role)");
  }
  lines.push("- [ ] Sign the Compliance Acknowledgment (contact compliance lead)");
  lines.push("- [ ] Know how to report an incident — save the contact info from Section 2");
  lines.push("");

  // ── 7. FAQ ──────────────────────────────────────────────────────────────
  lines.push("## 7. Frequently Asked Questions");
  lines.push("");
  lines.push("**Q: I found personal data in a log file. What do I do?**");
  lines.push("A: Report it to the security team immediately. Do not delete the log — they will handle remediation and assess whether it constitutes a breach.");
  lines.push("");
  lines.push("**Q: A user asked me to delete their data. What do I do?**");
  lines.push("A: Forward the request to the compliance lead. Do not delete data yourself — there is a formal DSAR process that must be followed (see DSAR Handling Guide).");
  lines.push("");
  lines.push("**Q: I want to add a new third-party service to the project. Do I need approval?**");
  lines.push("A: Yes. Any new service that processes user data must be reviewed by the compliance lead before integration. It needs a DPA review and must be added to the sub-processor list.");
  lines.push("");
  lines.push("**Q: Can I use ChatGPT / Claude / other AI tools for work?**");
  lines.push(hasAI
    ? "A: Yes, within the boundaries of our Acceptable AI Use Policy. Do not input sensitive personal data. All outputs must be reviewed before use."
    : "A: Check with the compliance lead. If AI tools are approved, an Acceptable AI Use Policy will be published.");
  lines.push("");
  lines.push("**Q: Where do I find all compliance documents?**");
  lines.push("A: All documents are in the `legal/` directory of the project repository. Start with the Compliance Policy Index for a full listing.");
  lines.push("");

  // ── Footer ──────────────────────────────────────────────────────────────
  lines.push("---");
  lines.push("");
  lines.push(
    "*This Compliance Onboarding Guide was auto-generated by [Codepliant](https://github.com/codepliant/codepliant) based on code analysis. " +
    "It should be reviewed by your compliance and HR teams before distribution to new employees.*"
  );
  lines.push("");

  return lines.join("\n");
}

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
