import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generate EMPLOYEE_HANDBOOK_PRIVACY_SECTION.md — a privacy section for
 * employee handbooks covering workplace monitoring policies, device usage,
 * and email monitoring, based on detected monitoring services.
 *
 * Returns null when no services are detected.
 */

/** Known monitoring/observability services mapped to employee-facing descriptions. */
const MONITORING_TOOLS: Record<string, { label: string; description: string }> = {
  "@sentry/node": { label: "Sentry", description: "Application error tracking — captures stack traces, request metadata, and device information when errors occur." },
  "@sentry/nextjs": { label: "Sentry", description: "Application error tracking — captures stack traces, request metadata, and device information when errors occur." },
  "@sentry/react": { label: "Sentry", description: "Application error tracking — captures stack traces and browser context when errors occur." },
  "posthog": { label: "PostHog", description: "Product analytics — tracks feature usage, page views, and user interactions." },
  "mixpanel": { label: "Mixpanel", description: "Product analytics — tracks user events, feature usage patterns, and engagement metrics." },
  "@amplitude/analytics-browser": { label: "Amplitude", description: "Product analytics — tracks user behavior, feature adoption, and engagement." },
  "@vercel/analytics": { label: "Vercel Analytics", description: "Web analytics — collects page views, visitor counts, and performance metrics." },
  "hotjar": { label: "Hotjar", description: "Session recording and heatmaps — records user interactions including mouse movements, clicks, and scrolling behavior." },
  "@datadog/browser-rum": { label: "Datadog RUM", description: "Real user monitoring — captures page load times, errors, and user session data." },
  "newrelic": { label: "New Relic", description: "Application performance monitoring — tracks response times, error rates, and infrastructure health." },
  "@google-analytics/data": { label: "Google Analytics", description: "Web analytics — collects page views, user demographics, traffic sources, and behavior flow." },
  "logrocket": { label: "LogRocket", description: "Session replay and error tracking — records user sessions including DOM changes, network requests, and console logs." },
  "fullstory": { label: "FullStory", description: "Digital experience analytics — records user sessions with full page replay capabilities." },
  "heap": { label: "Heap", description: "Auto-capture analytics — automatically records all user interactions without explicit instrumentation." },
};

/** Known email/communication monitoring services. */
const EMAIL_SERVICES: Record<string, string> = {
  "@sendgrid/mail": "SendGrid (transactional email — may log email metadata and delivery status)",
  "nodemailer": "Nodemailer (email sending — may log outbound email metadata)",
  "postmark": "Postmark (transactional email — logs delivery events and open/click tracking)",
  "mailgun": "Mailgun (email service — may track opens, clicks, and delivery metrics)",
  "resend": "Resend (email API — logs delivery status and engagement metrics)",
};

export function generateEmployeeHandbookPrivacySection(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const dpoName = ctx?.dpoName;
  const dpoEmail = ctx?.dpoEmail;
  const date = new Date().toISOString().split("T")[0];

  const monitoringServices = scan.services.filter(
    (s) => s.category === "monitoring" || s.category === "analytics"
  );
  const emailServices = scan.services.filter((s) => s.category === "email");
  const aiServices = scan.services.filter((s) => s.category === "ai");
  const allThirdParty = scan.services.filter((s) => s.isDataProcessor !== false);

  const sections: string[] = [];
  let sectionNum = 0;
  function next(): number {
    return ++sectionNum;
  }

  // ── Title ──────────────────────────────────────────────────────────

  sections.push(`# Employee Handbook — Privacy & Monitoring Section

**Effective Date:** ${date}
**Last Updated:** ${date}

**Organization:** ${company}

> **Internal document.** This section is intended for inclusion in the ${company} employee handbook. It describes the company's policies on workplace monitoring, device usage, email monitoring, and employee data privacy. All employees and contractors are expected to read and acknowledge this section.

---`);

  // ── 1. Purpose & Scope ─────────────────────────────────────────────

  sections.push(`
## ${next()}. Purpose & Scope

This section of the employee handbook establishes ${company}'s policies regarding:

- **Workplace monitoring** — what tools are used and what data they collect
- **Device usage** — policies for company-issued and personal (BYOD) devices
- **Email and communication monitoring** — what is monitored and why
- **Employee data privacy** — your rights and our obligations

These policies apply to all employees, contractors, interns, and temporary workers who use ${company}'s systems, networks, or devices.`);

  // ── 2. Workplace Monitoring Policy ─────────────────────────────────

  {
    let monSection = `
## ${next()}. Workplace Monitoring Policy

### 2.1 Monitoring Principles

${company} monitors certain workplace systems for the following legitimate purposes:

- **Security** — detecting and preventing unauthorized access, data breaches, and cyber threats
- **Compliance** — meeting regulatory obligations and audit requirements
- **Performance** — ensuring system reliability, uptime, and error resolution
- **Legal** — preserving evidence where required by law or regulation

Monitoring is conducted on the principle of **proportionality** — we collect only what is necessary for the stated purposes and do not engage in excessive surveillance.`;

    if (monitoringServices.length > 0) {
      monSection += `

### 2.2 Active Monitoring Tools

The following monitoring and analytics tools are currently deployed in ${company}'s systems:

| Tool | Type | What It Collects |
|------|------|-----------------|
`;

      const seen = new Set<string>();
      for (const svc of monitoringServices) {
        const tool = MONITORING_TOOLS[svc.name];
        const label = tool?.label || svc.name;
        if (seen.has(label)) continue;
        seen.add(label);
        const desc = tool?.description || svc.dataCollected.join(", ");
        monSection += `| ${label} | ${svc.category === "monitoring" ? "Error/Performance Monitoring" : "Analytics"} | ${desc} |\n`;
      }

      monSection += `
> **Important:** These tools collect technical and behavioral data to improve our products and systems. They are **not** used for individual employee performance evaluation or disciplinary purposes unless a specific security investigation requires it.`;
    } else {
      monSection += `

### 2.2 Active Monitoring Tools

No dedicated monitoring or analytics tools are currently deployed. If monitoring tools are introduced, employees will be notified in advance and this handbook section will be updated.`;
    }

    sections.push(monSection);
  }

  // ── 3. Device Usage Policy ─────────────────────────────────────────

  sections.push(`
## ${next()}. Device Usage Policy

### 3.1 Company-Issued Devices

Company-issued devices (laptops, phones, tablets) are provided for business purposes. ${company} reserves the right to:

- Install and maintain security software (antivirus, endpoint detection, MDM)
- Monitor device compliance with security policies (encryption, OS updates, screen lock)
- Access company data stored on the device
- Remotely wipe the device if lost, stolen, or upon termination of employment

**Expectations:**
- Keep devices updated with the latest security patches
- Do not install unauthorized software that could compromise security
- Report lost or stolen devices immediately to IT
- Reasonable personal use is permitted, but company policies apply to all activity on company devices

### 3.2 Personal Devices (BYOD)

If ${company} permits use of personal devices for work:

- Only approved applications may access company data
- Mobile Device Management (MDM) software may be required
- ${company} can remotely wipe **company data only** (not personal data) from the device
- Employees must maintain minimum security standards (screen lock, OS updates, encryption)

### 3.3 Software & Cloud Services

${company} uses ${allThirdParty.length > 0 ? allThirdParty.length : "various"} third-party services that may process employee data in the course of business operations. Employees should:

- Only use approved software and cloud services for company work
- Not store company data in personal cloud storage accounts
- Report any suspected security incidents involving third-party services`);

  // ── 4. Email & Communication Monitoring ────────────────────────────

  {
    let emailSection = `
## ${next()}. Email & Communication Monitoring

### 4.1 Email Policy

Company email accounts are provided for business communications. Employees should be aware that:

- **Company email is not private.** ${company} may access, monitor, or review company email accounts for legitimate business purposes including security, compliance, legal proceedings, and business continuity.
- Email metadata (sender, recipient, timestamp, subject line) may be logged and retained.
- Email content may be scanned by automated systems for malware, phishing, and data loss prevention (DLP).
- Reasonable personal use of company email is permitted, but such messages are subject to the same monitoring policies.`;

    if (emailServices.length > 0) {
      emailSection += `

### 4.2 Email Services in Use

The following email services are currently integrated into ${company}'s systems:

| Service | Purpose |
|---------|---------|
`;

      for (const svc of emailServices) {
        const desc = EMAIL_SERVICES[svc.name] || `${svc.name} (${svc.dataCollected.join(", ")})`;
        emailSection += `| ${desc} |\n`;
      }
    }

    emailSection += `

### 4.${emailServices.length > 0 ? "3" : "2"} Messaging & Collaboration Tools

${company} may monitor usage of company-provided collaboration tools (e.g., Slack, Teams, project management tools) in the same manner as email. Employees should:

- Treat all messages on company platforms as potentially accessible to the company
- Use appropriate channels for sensitive discussions
- Not share confidential information in public channels
- Report any suspicious messages or phishing attempts`;

    sections.push(emailSection);
  }

  // ── 5. AI Tools in the Workplace ───────────────────────────────────

  if (aiServices.length > 0) {
    let aiSection = `
## ${next()}. AI Tools in the Workplace

${company} uses the following AI services in its systems:

| AI Service | Data That May Be Processed |
|------------|---------------------------|
`;

    for (const svc of aiServices) {
      aiSection += `| ${svc.name} | ${svc.dataCollected.join(", ")} |\n`;
    }

    aiSection += `
**Employee responsibilities when using AI tools:**

- Do not input sensitive employee personal data (health information, financial details, performance reviews) into AI tools unless explicitly authorized
- Review AI-generated outputs for accuracy before using them in business decisions
- Be aware that prompts and interactions may be logged by the AI service provider
- Report any concerns about AI tool behavior to your manager or IT department
- Follow any additional AI usage guidelines provided by ${company}`;

    sections.push(aiSection);
  }

  // ── 6. Employee Data Privacy Rights ────────────────────────────────

  sections.push(`
## ${next()}. Employee Data Privacy Rights

### ${sectionNum}.1 What Data We Collect About Employees

In addition to standard HR data (identity, employment, payroll), ${company} may collect technical data through the monitoring tools described above, including:

- IP addresses and device identifiers
- Login timestamps and access logs
- Application usage patterns and error logs
- Email metadata and communication logs

### ${sectionNum}.2 Your Rights

Under applicable data protection laws (including GDPR where applicable), employees have the right to:

| Right | Description |
|-------|-------------|
| **Access** | Request a copy of the personal data we hold about you |
| **Rectification** | Request correction of inaccurate data |
| **Erasure** | Request deletion of data (subject to legal retention requirements) |
| **Restriction** | Request limitation of processing |
| **Objection** | Object to processing based on legitimate interests |
| **Data Portability** | Receive your data in a machine-readable format |

### ${sectionNum}.3 How to Exercise Your Rights

To exercise any data privacy rights or raise concerns about monitoring:

- **Email:** ${email}${dpoName || dpoEmail ? `\n- **Data Protection Officer:** ${dpoName || ""}${dpoEmail ? ` (${dpoEmail})` : ""}` : ""}
- **Response time:** Within 30 days of receiving your request`);

  // ── 7. Enforcement & Consequences ──────────────────────────────────

  sections.push(`
## ${next()}. Enforcement & Consequences

Violations of the policies described in this section may result in disciplinary action, up to and including termination of employment. Specifically:

- Attempting to circumvent monitoring systems is prohibited
- Unauthorized access to monitoring data or other employees' data is prohibited
- Misuse of company devices, email, or communication tools may result in disciplinary action
- Employees who report privacy concerns or violations in good faith are protected from retaliation`);

  // ── 8. Changes & Acknowledgment ────────────────────────────────────

  sections.push(`
## ${next()}. Changes to This Policy

${company} reserves the right to update these policies as monitoring tools, business needs, or legal requirements change. Employees will be notified of material changes before they take effect.

### Employee Acknowledgment

By signing below, I acknowledge that I have read and understood the Privacy & Monitoring section of the ${company} employee handbook.

| Field | Value |
|-------|-------|
| **Employee Name** | ______________________ |
| **Employee Signature** | ______________________ |
| **Date** | ______________________ |
| **Manager Name** | ______________________ |
| **Manager Signature** | ______________________ |

---

*This Employee Handbook Privacy Section was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on a scan of the project's codebase. It should be reviewed by your legal and HR teams before distribution to employees.*`);

  return sections.join("\n");
}
