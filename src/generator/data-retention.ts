import type { ScanResult, DetectedService } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/** Minimum number of services required to generate the data retention policy. */
const MIN_SERVICES = 3;

/** Recommended data retention periods per service category (mirrors privacy-policy.ts). */
const RETENTION_RECOMMENDATIONS: Record<string, string> = {
  auth: "Account data retained until you delete your account",
  payment: "Transaction records retained for 7 years (tax and legal compliance)",
  analytics: "Analytics data retained for up to 26 months",
  ai: "AI interaction data retained for up to 90 days",
  email: "Email communication records retained for up to 3 years",
  monitoring: "Error and performance data retained for up to 90 days",
  storage: "Uploaded files retained until you delete them or your account",
  database: "User data retained until you delete your account",
  advertising: "Advertising data retained for up to 26 months",
  social: "Social integration data retained for up to 26 months",
  other: "Data retained as long as necessary for the service",
};

/** Numeric retention periods (in days) for the retention schedule table. */
const RETENTION_DAYS: Record<string, number> = {
  auth: -1,         // until account deletion
  payment: 2555,    // 7 years
  analytics: 790,   // ~26 months
  ai: 90,
  email: 1095,      // 3 years
  monitoring: 90,
  storage: -1,      // until account deletion
  database: -1,     // until account deletion
  advertising: 790, // ~26 months
  social: 790,      // ~26 months
  other: 365,       // 1 year default
};

/** Legal basis for retaining data per category. */
const RETENTION_LEGAL_BASIS: Record<string, { basis: string; detail: string }> = {
  auth: {
    basis: "Contractual necessity (Art. 6(1)(b) GDPR)",
    detail: "Required to maintain your account and provide the service you signed up for.",
  },
  payment: {
    basis: "Legal obligation (Art. 6(1)(c) GDPR)",
    detail: "Tax laws and financial regulations require retention of transaction records for a minimum of 7 years.",
  },
  analytics: {
    basis: "Consent (Art. 6(1)(a) GDPR)",
    detail: "Retained with your opt-in consent to improve our service. You may withdraw consent at any time.",
  },
  ai: {
    basis: "Consent / Contractual necessity (Art. 6(1)(a)/(b) GDPR)",
    detail: "Retained to provide AI-powered features. Interaction logs are purged after 90 days.",
  },
  email: {
    basis: "Legitimate interest (Art. 6(1)(f) GDPR)",
    detail: "Retained to maintain communication records and resolve disputes.",
  },
  monitoring: {
    basis: "Legitimate interest (Art. 6(1)(f) GDPR)",
    detail: "Retained to detect, diagnose, and resolve errors and security incidents.",
  },
  storage: {
    basis: "Contractual necessity (Art. 6(1)(b) GDPR)",
    detail: "Retained as part of the service you use. Files are deleted when you remove them or close your account.",
  },
  database: {
    basis: "Contractual necessity (Art. 6(1)(b) GDPR)",
    detail: "Core user data required to operate the service. Deleted upon account closure.",
  },
  advertising: {
    basis: "Consent (Art. 6(1)(a) GDPR)",
    detail: "Retained with your opt-in consent for ad personalization and measurement.",
  },
  social: {
    basis: "Consent (Art. 6(1)(a) GDPR)",
    detail: "Retained with your opt-in consent for social media integration features.",
  },
  other: {
    basis: "Legitimate interest (Art. 6(1)(f) GDPR)",
    detail: "Retained as necessary to support service operations.",
  },
};

/** Deletion procedure per category. */
const DELETION_PROCEDURES: Record<string, string> = {
  auth: "Account data is permanently erased from all primary systems within 30 days of account deletion. Backups are purged within 90 days.",
  payment: "Transaction records cannot be deleted before the legally mandated retention period expires. After expiry, records are automatically purged.",
  analytics: "Analytics data is anonymized or deleted upon consent withdrawal. Aggregated, non-identifiable statistics may be retained indefinitely.",
  ai: "AI interaction logs are automatically purged after the retention period. You may request early deletion by contacting us.",
  email: "Email communication records are deleted upon request or after the retention period, whichever comes first.",
  monitoring: "Error logs and performance data are automatically rotated and purged after the retention period.",
  storage: "Uploaded files are deleted immediately upon user action. Residual copies in backups are purged within 90 days.",
  database: "User records are permanently erased from primary databases within 30 days of a deletion request. Backup copies are purged within 90 days.",
  advertising: "Advertising data is deleted or anonymized upon consent withdrawal or after the retention period.",
  social: "Social integration data is deleted upon consent withdrawal or after the retention period.",
  other: "Data is deleted upon request or after the retention period, whichever comes first.",
};

/** Data types collected per category (for the schedule table). */
const DATA_TYPES: Record<string, string> = {
  auth: "Account credentials, profile information, session tokens",
  payment: "Transaction history, billing addresses, payment method metadata",
  analytics: "Page views, click events, session recordings, device information",
  ai: "Prompts, generated responses, usage metadata",
  email: "Email addresses, message metadata, delivery logs",
  monitoring: "Error reports, stack traces, performance metrics, IP addresses",
  storage: "Uploaded files, file metadata, access logs",
  database: "User-created content, preferences, application data",
  advertising: "Ad impressions, click-through data, conversion events",
  social: "Social profile data, interaction events, shared content metadata",
  other: "Service-specific operational data",
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

/** Format retention days as a human-readable period. */
function formatRetentionPeriod(days: number): string {
  if (days === -1) return "Until account deletion";
  if (days < 365) return `${days} days`;
  const years = Math.round(days / 365);
  if (years === 1) return "1 year";
  return `${years} years`;
}

/** Extract unique service categories preserving order of first occurrence. */
function getUniqueCategories(services: DetectedService[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const s of services) {
    if (!seen.has(s.category)) {
      seen.add(s.category);
      result.push(s.category);
    }
  }
  return result;
}

/**
 * Generate a DATA_RETENTION_POLICY.md document.
 * Returns null when fewer than MIN_SERVICES services are detected.
 */
export function generateDataRetentionPolicy(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length < MIN_SERVICES) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const date = new Date().toISOString().split("T")[0];
  const categories = getUniqueCategories(scan.services);

  const sections: string[] = [];

  // ── Title & Introduction ──────────────────────────────────────────

  sections.push(`# Data Retention Policy

**Last updated:** ${date}

**Project:** ${scan.projectName}

**Data Controller:** ${company}

---

## 1. Introduction

This Data Retention Policy describes how ${company} retains, manages, and deletes personal data collected through our services. It supplements our Privacy Policy and applies to all personal data we process.

We retain personal data only for as long as necessary to fulfill the purposes for which it was collected, comply with legal obligations, resolve disputes, and enforce our agreements.

**Contact:** ${email}`);

  // ── Retention Schedule Table ──────────────────────────────────────

  let scheduleSection = `

---

## 2. Retention Schedule

The following table summarizes our data retention periods by category:

| Data Category | Data Types | Retention Period | Legal Basis |
|--------------|-----------|-----------------|-------------|`;

  for (const cat of categories) {
    const dataType = DATA_TYPES[cat] || DATA_TYPES["other"];
    const days = RETENTION_DAYS[cat] ?? RETENTION_DAYS["other"];
    const period = formatRetentionPeriod(days);
    const legal = RETENTION_LEGAL_BASIS[cat] || RETENTION_LEGAL_BASIS["other"];
    scheduleSection += `\n| ${formatCategory(cat)} | ${dataType} | ${period} | ${legal.basis} |`;
  }

  if (ctx?.dataRetentionDays) {
    scheduleSection += `\n\n**Default retention period:** ${ctx.dataRetentionDays} days (applies where no category-specific period is defined).`;
  }

  sections.push(scheduleSection);

  // ── Detailed Retention by Category ────────────────────────────────

  let detailSection = `

---

## 3. Retention Details by Service Category`;

  for (const cat of categories) {
    const retention = RETENTION_RECOMMENDATIONS[cat] || RETENTION_RECOMMENDATIONS["other"];
    const legal = RETENTION_LEGAL_BASIS[cat] || RETENTION_LEGAL_BASIS["other"];
    const deletion = DELETION_PROCEDURES[cat] || DELETION_PROCEDURES["other"];
    const dataType = DATA_TYPES[cat] || DATA_TYPES["other"];

    detailSection += `

### ${formatCategory(cat)}

- **What data is retained:** ${dataType}
- **Retention period:** ${retention}
- **Legal basis:** ${legal.basis} — ${legal.detail}
- **Deletion procedure:** ${deletion}`;
  }

  sections.push(detailSection);

  // ── Data Deletion Request Process ─────────────────────────────────

  sections.push(`

---

## 4. Data Deletion Request Process

You have the right to request deletion of your personal data at any time. To submit a deletion request:

### How to Request

1. **Email:** Send a deletion request to ${email} with the subject line "Data Deletion Request."
2. **Account settings:** If available, use the self-service account deletion option in your account settings.

### What Happens Next

1. **Acknowledgment:** We will acknowledge your request within 3 business days.
2. **Verification:** We will verify your identity to prevent unauthorized deletion.
3. **Processing:** Eligible data will be deleted from primary systems within 30 days of verification.
4. **Confirmation:** You will receive a confirmation email once deletion is complete.

### Exceptions

Certain data may not be eligible for immediate deletion:

- **Legal holds:** Data subject to active litigation, regulatory investigation, or legal preservation requirements.
- **Tax and financial records:** Transaction records that must be retained for the legally mandated period (typically 7 years).
- **Aggregated/anonymized data:** Fully anonymized data that can no longer be linked to you is not considered personal data and may be retained indefinitely.
- **Security logs:** Minimal security event logs may be retained to protect against fraud and abuse.

### Partial Deletion

If you request deletion of specific categories of data rather than full account deletion, we will process the request for those categories while preserving the rest of your account.`);

  // ── Backup Retention Policy ───────────────────────────────────────

  sections.push(`

---

## 5. Backup Retention Policy

### Backup Schedule

${company} maintains regular backups to protect against data loss and ensure business continuity:

- **Daily backups:** Retained for 30 days
- **Weekly backups:** Retained for 90 days
- **Monthly backups:** Retained for 1 year

### Data Deletion in Backups

When personal data is deleted from primary systems:

1. The data will not be actively restored from backups.
2. Backup copies containing the deleted data will be purged as they naturally expire according to the backup rotation schedule above.
3. Maximum time for complete purge from all backup systems: **90 days** from deletion in primary systems.

### Backup Security

- All backups are encrypted at rest using industry-standard encryption (AES-256 or equivalent).
- Access to backup systems is restricted to authorized personnel only.
- Backup restoration is logged and audited.

### Disaster Recovery

In the event of a disaster recovery scenario where backups must be restored:

- Any previously processed deletion requests will be re-applied to the restored data.
- Affected individuals will be notified if their data is temporarily restored during recovery.`);

  // ── Data Retention Review ─────────────────────────────────────────

  sections.push(`

---

## 6. Retention Review Process

${company} conducts periodic reviews of its data retention practices:

- **Quarterly reviews:** Verify that automated purge processes are functioning correctly.
- **Annual reviews:** Assess whether retention periods remain appropriate and aligned with legal requirements.
- **Ad-hoc reviews:** Triggered by changes in applicable law, business operations, or service offerings.

All retention period changes are documented and communicated through an updated version of this policy.`);

  // ── Contact & Footer ──────────────────────────────────────────────

  sections.push(`

---

## 7. Contact

For questions about this Data Retention Policy or to exercise your data rights, contact us at:

- **Email:** ${email}${ctx?.dpoEmail ? `\n- **Data Protection Officer:** ${ctx.dpoEmail}` : ""}

---

*This Data Retention Policy was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. It should be reviewed by a qualified legal professional before use.*`);

  return sections.join("\n");
}
