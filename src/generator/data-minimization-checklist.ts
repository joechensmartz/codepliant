import type { ScanResult, DetectedService } from "../scanner/types.js";
import type { GeneratorContext } from "./index.js";

interface DataField {
  field: string;
  service: string;
  category: string;
  isLikelyNeeded: boolean;
  reason: string;
  recommendation: string;
}

/** Map service categories to the data they typically collect and whether it is essential. */
const CATEGORY_DATA_ASSESSMENT: Record<
  string,
  Array<{
    field: string;
    likelyNeeded: boolean;
    reason: string;
    recommendation: string;
  }>
> = {
  payment: [
    { field: "payment_info", likelyNeeded: true, reason: "Required for payment processing", recommendation: "Tokenize via payment processor; never store raw card data" },
    { field: "billing_address", likelyNeeded: true, reason: "Required for tax/invoicing", recommendation: "Collect only what is required by tax jurisdiction" },
    { field: "transaction_history", likelyNeeded: true, reason: "Legal/tax retention requirement", recommendation: "Enforce 7-year retention limit; auto-delete after" },
    { field: "customer_email", likelyNeeded: true, reason: "Transaction receipts", recommendation: "Use for transactional email only; do not repurpose for marketing without consent" },
  ],
  ai: [
    { field: "user_prompts", likelyNeeded: true, reason: "Required for AI feature delivery", recommendation: "Delete after processing; do not retain beyond 30 days for logs" },
    { field: "conversation_history", likelyNeeded: false, reason: "Used for context continuity but may not be essential", recommendation: "Allow users to opt out; implement automatic expiration (30 days max)" },
    { field: "generated_content", likelyNeeded: false, reason: "AI output retained for user convenience", recommendation: "Let users delete on demand; do not use for model training without consent" },
    { field: "model_usage_metadata", likelyNeeded: false, reason: "Used for analytics and billing", recommendation: "Aggregate and anonymize; delete individual records after 90 days" },
  ],
  analytics: [
    { field: "page_views", likelyNeeded: false, reason: "Product analytics — useful but not essential for service delivery", recommendation: "Use privacy-preserving analytics (e.g., aggregate counts); limit retention to 26 months" },
    { field: "user_behavior", likelyNeeded: false, reason: "UX optimization — not essential for core service", recommendation: "Anonymize user identifiers; consider server-side analytics" },
    { field: "device_info", likelyNeeded: false, reason: "Compatibility analytics", recommendation: "Collect browser/OS only; do not fingerprint devices" },
    { field: "ip_address", likelyNeeded: false, reason: "Geolocation and fraud prevention", recommendation: "Truncate IP addresses (last octet); delete raw IPs after 90 days" },
  ],
  auth: [
    { field: "email", likelyNeeded: true, reason: "Account identification and communication", recommendation: "Essential — ensure proper encryption at rest" },
    { field: "password_hash", likelyNeeded: true, reason: "User authentication", recommendation: "Use strong hashing (bcrypt/argon2); never store plaintext" },
    { field: "session_token", likelyNeeded: true, reason: "Session management", recommendation: "Short-lived tokens; auto-expire and rotate" },
    { field: "login_history", likelyNeeded: false, reason: "Security auditing", recommendation: "Retain for 90 days max; anonymize after" },
    { field: "oauth_token", likelyNeeded: true, reason: "Third-party authentication", recommendation: "Store securely; revoke on account deletion" },
  ],
  monitoring: [
    { field: "error_data", likelyNeeded: true, reason: "Error tracking and debugging", recommendation: "Strip PII from error reports before sending to monitoring service" },
    { field: "stack_traces", likelyNeeded: true, reason: "Debugging", recommendation: "Ensure no sensitive data (passwords, tokens) appears in stack traces" },
    { field: "user_context", likelyNeeded: false, reason: "Error context for debugging", recommendation: "Use anonymized user IDs; do not send full user profiles" },
    { field: "ip_address", likelyNeeded: false, reason: "Error context", recommendation: "Truncate or hash IP addresses in error reports" },
  ],
  email: [
    { field: "email_address", likelyNeeded: true, reason: "Email delivery", recommendation: "Remove from lists on unsubscribe; honor deletion requests" },
    { field: "email_content", likelyNeeded: false, reason: "Delivery logs", recommendation: "Do not retain email body after delivery confirmation; delete logs after 90 days" },
    { field: "open_tracking", likelyNeeded: false, reason: "Marketing metrics", recommendation: "Consider removing tracking pixels; they are not essential and raise privacy concerns" },
  ],
  storage: [
    { field: "uploaded_files", likelyNeeded: true, reason: "User content storage", recommendation: "Implement file expiration for unused content; enforce size limits" },
    { field: "file_metadata", likelyNeeded: true, reason: "File management", recommendation: "Delete metadata when files are deleted; do not retain orphaned metadata" },
  ],
  database: [
    { field: "user_data", likelyNeeded: true, reason: "Core application functionality", recommendation: "Audit each field — only store what the application actually uses" },
  ],
  advertising: [
    { field: "conversion_events", likelyNeeded: false, reason: "Ad campaign measurement — not essential for service delivery", recommendation: "Use aggregate conversion reporting; avoid individual-level tracking" },
    { field: "device_fingerprint", likelyNeeded: false, reason: "Ad targeting", recommendation: "Eliminate device fingerprinting; use contextual advertising instead" },
    { field: "cross_site_tracking", likelyNeeded: false, reason: "Behavioral advertising", recommendation: "Eliminate cross-site tracking; comply with GPC signals" },
  ],
};

/**
 * Generates a DATA_MINIMIZATION_CHECKLIST.md per GDPR Art. 5(1)(c)
 * with per-service analysis of what data is collected vs. what is needed.
 */
export function generateDataMinimizationChecklist(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  if (scan.services.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const date = new Date().toISOString().split("T")[0];

  const sections: string[] = [];
  let sectionNum = 0;

  function nextSection(): number {
    return ++sectionNum;
  }

  // ── Title ─────────────────────────────────────────────────────────

  sections.push(`# Data Minimization Checklist

**Company:** ${company}
**Last updated:** ${date}
**Project:** ${scan.projectName}

---

## ${nextSection()}. Purpose

This checklist implements the **data minimization principle** under GDPR Article 5(1)(c):

> *"Personal data shall be adequate, relevant and limited to what is necessary in relation to the purposes for which they are processed."*

For each detected service, this document identifies what data is collected, whether it is actually needed, and provides actionable recommendations for reducing unnecessary data collection.

> **Disclaimer:** This is not legal advice. Consult qualified legal counsel and your Data Protection Officer to confirm data processing activities are lawful and necessary.`);

  // ── Per-Service Analysis ──────────────────────────────────────────

  sections.push(`\n## ${nextSection()}. Per-Service Data Analysis\n`);

  const allFields: DataField[] = [];

  for (const service of scan.services) {
    const categoryFields = CATEGORY_DATA_ASSESSMENT[service.category] || [];

    let serviceSection = `\n### ${service.name} (${capitalize(service.category)})\n\n`;

    // Include declared dataCollected from scan
    if (service.dataCollected.length > 0) {
      serviceSection += `**Declared data collection:** ${service.dataCollected.join(", ")}\n\n`;
    }

    serviceSection += `| Data Field | Likely Needed? | Justification | Recommendation |\n`;
    serviceSection += `|-----------|---------------|---------------|----------------|\n`;

    for (const cf of categoryFields) {
      const needed = cf.likelyNeeded ? "Yes" : "**No**";
      serviceSection += `| ${cf.field} | ${needed} | ${cf.reason} | ${cf.recommendation} |\n`;

      allFields.push({
        field: cf.field,
        service: service.name,
        category: service.category,
        isLikelyNeeded: cf.likelyNeeded,
        reason: cf.reason,
        recommendation: cf.recommendation,
      });
    }

    // Also add any dataCollected fields not already in the category template
    const knownFields = new Set(categoryFields.map((f) => f.field.toLowerCase()));
    for (const dc of service.dataCollected) {
      if (!knownFields.has(dc.toLowerCase())) {
        serviceSection += `| ${dc} | Review needed | Detected via scan | Assess whether this data is necessary for ${service.name} functionality |\n`;
        allFields.push({
          field: dc,
          service: service.name,
          category: service.category,
          isLikelyNeeded: true,
          reason: "Detected via scan — review needed",
          recommendation: `Assess whether this data is necessary for ${service.name} functionality`,
        });
      }
    }

    serviceSection += `\n`;
    sections.push(serviceSection);
  }

  // ── Reduction Opportunities ───────────────────────────────────────

  const unnecessaryFields = allFields.filter((f) => !f.isLikelyNeeded);

  if (unnecessaryFields.length > 0) {
    let reductionSection = `\n## ${nextSection()}. Data Reduction Opportunities\n\n`;
    reductionSection += `The following ${unnecessaryFields.length} data field(s) are collected but **may not be necessary** for core service delivery:\n\n`;

    reductionSection += `| # | Data Field | Service | Recommendation |\n`;
    reductionSection += `|---|-----------|---------|----------------|\n`;

    for (let i = 0; i < unnecessaryFields.length; i++) {
      const f = unnecessaryFields[i];
      reductionSection += `| ${i + 1} | ${f.field} | ${f.service} | ${f.recommendation} |\n`;
    }

    reductionSection += `\n> **Action required:** For each item above, determine whether (a) the data can be eliminated entirely, (b) the data can be anonymized or aggregated, or (c) there is a legitimate business justification that should be documented.\n`;

    sections.push(reductionSection);
  }

  // ── Summary Statistics ────────────────────────────────────────────

  {
    const totalFields = allFields.length;
    const neededCount = allFields.filter((f) => f.isLikelyNeeded).length;
    const unnecessaryCount = unnecessaryFields.length;
    const reductionPercent = totalFields > 0 ? Math.round((unnecessaryCount / totalFields) * 100) : 0;

    let summarySection = `\n## ${nextSection()}. Summary\n\n`;
    summarySection += `| Metric | Value |\n`;
    summarySection += `|--------|-------|\n`;
    summarySection += `| Services analyzed | ${scan.services.length} |\n`;
    summarySection += `| Total data fields assessed | ${totalFields} |\n`;
    summarySection += `| Fields likely needed | ${neededCount} |\n`;
    summarySection += `| Fields potentially unnecessary | ${unnecessaryCount} |\n`;
    summarySection += `| Potential data reduction | ${reductionPercent}% |\n`;

    sections.push(summarySection);
  }

  // ── GDPR Art. 5(1)(c) Compliance Checklist ────────────────────────

  {
    let gdprSection = `\n## ${nextSection()}. GDPR Article 5(1)(c) Compliance Checklist\n\n`;
    gdprSection += `Use this checklist to verify your data minimization posture:\n\n`;
    gdprSection += `- [ ] All collected data has a documented, specific purpose\n`;
    gdprSection += `- [ ] No data is collected "just in case" or for future undefined use\n`;
    gdprSection += `- [ ] Data fields are limited to what is strictly necessary for each purpose\n`;
    gdprSection += `- [ ] Pseudonymization or anonymization is used where possible\n`;
    gdprSection += `- [ ] Data retention periods are defined and enforced for all fields\n`;
    gdprSection += `- [ ] Regular reviews are conducted to identify and remove unnecessary data\n`;
    gdprSection += `- [ ] Third-party services are configured to collect only required data\n`;
    gdprSection += `- [ ] Default settings favor minimal data collection (privacy by default)\n`;
    gdprSection += `- [ ] Data collection forms only request essential information\n`;
    gdprSection += `- [ ] Analytics and tracking are proportionate to business needs\n`;

    sections.push(gdprSection);
  }

  // ── Practical Steps ───────────────────────────────────────────────

  {
    let stepsSection = `\n## ${nextSection()}. Practical Steps for Data Reduction\n\n`;
    stepsSection += `1. **Audit each field** — For every data field in the tables above, ask: "Would the service break without this data?"\n`;
    stepsSection += `2. **Eliminate unnecessary collection** — Remove fields that are not essential for the stated purpose\n`;
    stepsSection += `3. **Anonymize where possible** — Replace identifiable data with pseudonyms or aggregates\n`;
    stepsSection += `4. **Shorten retention** — Reduce how long data is kept; implement automatic deletion\n`;
    stepsSection += `5. **Minimize third-party sharing** — Configure services to send only required fields\n`;
    stepsSection += `6. **Review regularly** — Re-run this checklist quarterly and after adding new services\n`;

    sections.push(stepsSection);
  }

  // ── Related Documents ─────────────────────────────────────────────

  sections.push(`\n## ${nextSection()}. Related Documents

- **DATA_DICTIONARY.md** — Complete catalog of all data fields
- **DATA_RETENTION_POLICY.md** — Retention schedules and deletion procedures
- **PRIVACY_POLICY.md** — Public disclosure of data collection practices
- **LAWFUL_BASIS_ASSESSMENT.md** — Legal basis for each processing activity
- **RECORD_OF_PROCESSING.md** — GDPR Art. 30 processing activities register
- **CONSENT_MANAGEMENT_GUIDE.md** — Consent collection and management procedures

For questions about this checklist, contact ${email}.`);

  // ── Footer ────────────────────────────────────────────────────────

  sections.push(
    `\n---\n\n*This data minimization checklist was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. It is for informational purposes only and does not constitute legal advice.*`
  );

  return sections.join("\n");
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
