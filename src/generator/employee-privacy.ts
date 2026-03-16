import type { ScanResult, DetectedService } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generate an internal-facing Employee Privacy Notice (GDPR Art. 13/14 compliant).
 *
 * This document is only generated when explicitly enabled via config
 * (`generateEmployeeNotice: true`). It covers what employee/contractor data
 * the company processes, monitoring tools detected in code, AI tools employees
 * interact with, third-party data sharing, and employee rights.
 */

/** Categories of employee data commonly processed. */
const EMPLOYEE_DATA_CATEGORIES = [
  {
    category: "Identity & Contact Data",
    examples: "Full name, email address, phone number, home address, employee ID",
    basis: "Contract (Art. 6(1)(b))",
  },
  {
    category: "Employment Data",
    examples: "Job title, department, start date, employment contract, compensation details",
    basis: "Contract (Art. 6(1)(b)) / Legal obligation (Art. 6(1)(c))",
  },
  {
    category: "IT & Access Data",
    examples: "Corporate email, login credentials, IP address, device identifiers, access logs",
    basis: "Legitimate interest (Art. 6(1)(f))",
  },
  {
    category: "Performance Data",
    examples: "Performance reviews, goals, training records",
    basis: "Legitimate interest (Art. 6(1)(f))",
  },
  {
    category: "Financial Data",
    examples: "Bank account details, tax information, payroll records",
    basis: "Legal obligation (Art. 6(1)(c))",
  },
];

/** Map service categories to employee-facing descriptions of monitoring. */
const MONITORING_DESCRIPTIONS: Record<string, string> = {
  monitoring:
    "Error tracking and application performance monitoring — collects stack traces, request metadata, and device information from internal tools and dashboards used by employees.",
  analytics:
    "Usage analytics — may track how employees interact with internal tools and dashboards to improve workflows and identify issues.",
};

/** Known monitoring/observability service names for explicit callout. */
const KNOWN_MONITORING_SERVICES: Record<string, string> = {
  "@sentry/node": "Sentry (error monitoring)",
  "@sentry/nextjs": "Sentry (error monitoring)",
  "@sentry/react": "Sentry (error monitoring)",
  "posthog": "PostHog (product analytics)",
  "mixpanel": "Mixpanel (product analytics)",
  "@amplitude/analytics-browser": "Amplitude (product analytics)",
  "@vercel/analytics": "Vercel Analytics",
  "hotjar": "Hotjar (session recording & analytics)",
  "@datadog/browser-rum": "Datadog (real user monitoring)",
  "newrelic": "New Relic (application performance monitoring)",
  "@google-analytics/data": "Google Analytics",
};

/** Known AI service names for explicit callout. */
const KNOWN_AI_SERVICES: Record<string, string> = {
  openai: "OpenAI (GPT models)",
  "@anthropic-ai/sdk": "Anthropic (Claude)",
  "@google/generative-ai": "Google (Gemini)",
  replicate: "Replicate",
  "together-ai": "Together AI",
  cohere: "Cohere",
};

export function generateEmployeePrivacyNotice(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  // This generator is conditional on services being detected — if nothing is
  // found there is little value in an empty notice.
  if (scan.services.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const dpoName = ctx?.dpoName;
  const dpoEmail = ctx?.dpoEmail;
  const date = new Date().toISOString().split("T")[0];

  const monitoringServices = scan.services.filter(
    (s) => s.category === "monitoring" || s.category === "analytics"
  );
  const aiServices = scan.services.filter((s) => s.category === "ai");
  const thirdPartyServices = scan.services.filter(
    (s) => s.category !== "database"
  );

  const sections: string[] = [];
  let sectionNum = 0;
  function next(): number {
    return ++sectionNum;
  }

  // ── Title ──────────────────────────────────────────────────────────

  sections.push(`# Employee Privacy Notice

**Effective Date:** ${date}
**Last Updated:** ${date}

**Organization:** ${company}

> **Internal document.** This notice is intended for employees, contractors, and other personnel of ${company}. It describes how we collect, use, and protect your personal data in the context of your employment or engagement with us. This notice supplements (and does not replace) any terms in your employment contract.

---`);

  // ── 1. Introduction & Scope ────────────────────────────────────────

  sections.push(`
## ${next()}. Introduction & Scope

${company} is committed to protecting the personal data of its employees and contractors. This notice is provided in accordance with Articles 13 and 14 of the General Data Protection Regulation (GDPR) and describes:

- What personal data we collect about you as an employee or contractor
- Why we process it and on what legal basis
- What monitoring and AI tools are used in the workplace
- Who we share your data with
- Your rights regarding your personal data

**Data Controller:** ${company}
**Contact Email:** ${email}${dpoName || dpoEmail ? `\n**Data Protection Officer:** ${dpoName || ""}${dpoEmail ? ` (${dpoEmail})` : ""}` : ""}`);

  // ── 2. Employee Data We Process ────────────────────────────────────

  {
    let dataSection = `
## ${next()}. Categories of Employee Data We Process

We process the following categories of personal data in connection with your employment or engagement:

| Category | Examples | Legal Basis (GDPR) |
|----------|----------|--------------------|
`;

    for (const cat of EMPLOYEE_DATA_CATEGORIES) {
      dataSection += `| ${cat.category} | ${cat.examples} | ${cat.basis} |\n`;
    }

    dataSection += `
> **Special category data:** We may process special category data (e.g., health information for sick leave, disability accommodations) only where strictly necessary and with an appropriate legal basis under Art. 9(2) GDPR.`;

    sections.push(dataSection);
  }

  // ── 3. Workplace Monitoring Tools ──────────────────────────────────

  {
    let monSection = `
## ${next()}. Workplace Monitoring Tools`;

    if (monitoringServices.length > 0) {
      monSection += `

Based on our codebase analysis, the following monitoring and analytics tools are deployed in systems that employees may interact with:

| Tool | Purpose |
|------|---------|
`;

      const seen = new Set<string>();
      for (const svc of monitoringServices) {
        const label =
          KNOWN_MONITORING_SERVICES[svc.name] || svc.name;
        if (seen.has(label)) continue;
        seen.add(label);
        const desc =
          MONITORING_DESCRIPTIONS[svc.category] ||
          `${svc.dataCollected.join(", ")}`;
        monSection += `| ${label} | ${desc} |\n`;
      }

      monSection += `
**Legal Basis:** Legitimate interest (Art. 6(1)(f) GDPR) — ensuring the security, stability, and performance of our systems.

**What this means for you:**
- These tools may collect technical data (IP addresses, device info, error logs) when you use internal systems
- Data collected is used for debugging, performance optimization, and security — not for individual performance evaluation
- You will be informed of any changes to monitoring practices`;
    } else {
      monSection += `

No dedicated monitoring or analytics tools were detected in the current codebase. If monitoring tools are introduced in the future, this notice will be updated accordingly.`;
    }

    sections.push(monSection);
  }

  // ── 4. AI Tools in the Workplace ───────────────────────────────────

  {
    let aiSection = `
## ${next()}. AI Tools in the Workplace`;

    if (aiServices.length > 0) {
      aiSection += `

The following AI services are integrated into our systems and may process data in connection with your work:

| AI Service | Data Processed |
|------------|---------------|
`;

      for (const svc of aiServices) {
        const label = KNOWN_AI_SERVICES[svc.name] || svc.name;
        aiSection += `| ${label} | ${svc.dataCollected.join(", ")} |\n`;
      }

      aiSection += `
**Legal Basis:** Consent (Art. 6(1)(a)) or Legitimate interest (Art. 6(1)(f) GDPR), depending on whether AI tool usage is voluntary or integral to your role.

**Important information about AI tools:**
- AI-generated outputs should be reviewed for accuracy before use in business decisions
- Do not input sensitive personal data (e.g., health information, financial details of colleagues) into AI tools unless explicitly authorized
- AI tools are not used for automated decision-making that produces legal or similarly significant effects on employees (Art. 22 GDPR)
- Interaction data may be processed by third-party AI providers — see Section ${sectionNum + 1} below`;
    } else {
      aiSection += `

No AI services were detected in the current codebase. If AI tools are introduced, this notice will be updated and employees will be informed before deployment.`;
    }

    sections.push(aiSection);
  }

  // ── 5. Data Sharing with Third Parties ─────────────────────────────

  {
    let sharingSection = `
## ${next()}. Data Sharing with Third Parties`;

    if (thirdPartyServices.length > 0) {
      sharingSection += `

In the course of operating our business and IT systems, employee data may be shared with the following categories of third-party service providers:

| Service | Category | Data Shared |
|---------|----------|-------------|
`;

      for (const svc of thirdPartyServices) {
        sharingSection += `| ${svc.name} | ${formatCategory(svc.category)} | ${svc.dataCollected.join(", ")} |\n`;
      }

      sharingSection += `
**Safeguards:**
- All third-party processors are bound by Data Processing Agreements (Art. 28 GDPR)
- International transfers outside the EEA are protected by Standard Contractual Clauses (SCCs) or adequacy decisions
- We conduct regular assessments of third-party data protection practices`;
    } else {
      sharingSection += `

No third-party data processors were detected in the current codebase.`;
    }

    sections.push(sharingSection);
  }

  // ── 6. Data Retention ──────────────────────────────────────────────

  {
    const retentionDays = ctx?.dataRetentionDays;

    let retSection = `
## ${next()}. Data Retention

Employee personal data is retained for the duration of your employment or engagement, plus any legally required retention period. Specific retention periods include:

| Data Category | Retention Period |
|---------------|-----------------|
| Employment records | Duration of employment + 6 years (statutory limitation period) |
| Payroll and tax records | Duration of employment + 7 years (tax regulations) |
| IT access logs | Up to 12 months |
| Performance records | Duration of employment + 3 years |
| Health and safety records | Duration of employment + 40 years (where required by law) |`;

    if (retentionDays) {
      retSection += `\n\n**Default operational data retention:** ${retentionDays} days`;
    }

    retSection += `

Upon termination of your employment or engagement, we will securely delete or anonymize your personal data once all legal retention obligations have been met.`;

    sections.push(retSection);
  }

  // ── 7. Employee Rights ─────────────────────────────────────────────

  sections.push(`
## ${next()}. Your Rights Under GDPR

As an employee or contractor, you have the following rights regarding your personal data:

| Right | Description | GDPR Article |
|-------|-------------|--------------|
| Access | Request a copy of the personal data we hold about you | Art. 15 |
| Rectification | Request correction of inaccurate or incomplete data | Art. 16 |
| Erasure | Request deletion of your data (subject to legal retention requirements) | Art. 17 |
| Restriction | Request that we limit how we use your data | Art. 18 |
| Data Portability | Receive your data in a structured, machine-readable format | Art. 20 |
| Objection | Object to processing based on legitimate interests | Art. 21 |
| Withdraw Consent | Withdraw consent at any time where processing is consent-based | Art. 7(3) |
| Automated Decisions | Not be subject to solely automated decisions with legal effects | Art. 22 |

### How to Exercise Your Rights

To exercise any of these rights, contact:

- **Email:** ${email}${dpoEmail ? `\n- **DPO:** ${dpoEmail}` : ""}

We will respond to your request within **one month** of receipt (Art. 12(3) GDPR). In complex cases, this may be extended by a further two months.

### Right to Lodge a Complaint

If you believe your data protection rights have been violated, you have the right to lodge a complaint with a supervisory authority (Art. 77 GDPR). We encourage you to contact us first so we can address your concerns directly.`);

  // ── 8. Changes to This Notice ──────────────────────────────────────

  sections.push(`
## ${next()}. Changes to This Notice

We may update this notice from time to time to reflect changes in our data processing practices, monitoring tools, or applicable laws. Material changes will be communicated to all employees and contractors before they take effect.

---

*This Employee Privacy Notice was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on a scan of the project's codebase. It should be reviewed by your legal and HR teams before distribution to employees.*`);

  return sections.join("\n");
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
