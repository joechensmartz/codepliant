import type { ScanResult, DetectedService, DataCategory } from "../scanner/types.js";
import type { GeneratorContext } from "./index.js";

/**
 * Sensitivity classification for data fields.
 */
type FieldSensitivity = "Critical" | "High" | "Medium" | "Low";

/**
 * A single entry in the data dictionary.
 */
export interface DataDictionaryEntry {
  field: string;
  source: string;
  type: string;
  sensitivity: FieldSensitivity;
  retention: string;
  purpose: string;
}

// ── Field classification rules ───────────────────────────────────────

const FIELD_RULES: Array<{
  pattern: RegExp;
  type: string;
  sensitivity: FieldSensitivity;
  retention: string;
  purpose: string;
}> = [
  // Critical — credentials & government IDs
  { pattern: /password|passwordHash|secret|credential/i, type: "Authentication", sensitivity: "Critical", retention: "Until account deletion; hashed at rest", purpose: "User authentication" },
  { pattern: /\bssn\b|socialSecurity|national.*id|passport.*number|driver.*license/i, type: "Government ID", sensitivity: "Critical", retention: "Delete after verification; max 90 days", purpose: "Identity verification" },
  { pattern: /credit.*card|cardNumber|card.*number|pan\b/i, type: "Financial — PCI", sensitivity: "Critical", retention: "Do not store post-authorization; tokenize", purpose: "Payment processing" },
  { pattern: /bank.*account|iban|routing.*number|sort.*code/i, type: "Financial — Bank", sensitivity: "Critical", retention: "7 years (tax/legal)", purpose: "Payment / payout processing" },

  // High — PII
  { pattern: /\bemail\b/i, type: "Contact", sensitivity: "High", retention: "Until account deletion + 30 days", purpose: "Account identification, communication" },
  { pattern: /phone|mobile/i, type: "Contact", sensitivity: "High", retention: "Until account deletion + 30 days", purpose: "Account verification, communication" },
  { pattern: /\bname\b|firstName|lastName|displayName|fullName/i, type: "Personal Identity", sensitivity: "High", retention: "Until account deletion + 30 days", purpose: "User identification" },
  { pattern: /\baddress\b|street|city|state|country|zip|postal/i, type: "Location", sensitivity: "High", retention: "Until account deletion", purpose: "Billing, shipping, localization" },
  { pattern: /dateOfBirth|dob|birthDate|\bage\b/i, type: "Personal Identity", sensitivity: "High", retention: "Until account deletion", purpose: "Age verification, personalization" },
  { pattern: /avatar|profileImage|photo/i, type: "Media", sensitivity: "High", retention: "Until account deletion", purpose: "User profile display" },
  { pattern: /biometric|fingerprint|faceId/i, type: "Biometric", sensitivity: "High", retention: "Delete when no longer necessary; max 1 year", purpose: "Authentication" },
  { pattern: /health|medical|diagnosis/i, type: "Health", sensitivity: "High", retention: "Per applicable health data regulation", purpose: "Health services" },

  // Medium — behavioral & session
  { pattern: /session|token|oauth/i, type: "Session", sensitivity: "Medium", retention: "Until session expiry", purpose: "Session management" },
  { pattern: /\bip\b|ipAddress|lastLoginIp/i, type: "Technical", sensitivity: "Medium", retention: "90 days", purpose: "Security, rate limiting" },
  { pattern: /deviceId|userAgent|browser/i, type: "Technical", sensitivity: "Medium", retention: "90 days", purpose: "Compatibility, security" },
  { pattern: /location|latitude|longitude|geo/i, type: "Location", sensitivity: "Medium", retention: "90 days", purpose: "Localization, analytics" },
  { pattern: /prompt|conversation|chat/i, type: "AI Interaction", sensitivity: "Medium", retention: "30 days (logs); per vendor policy", purpose: "AI feature delivery" },

  // Low — operational
  { pattern: /locale|timezone|language|currency/i, type: "Preference", sensitivity: "Low", retention: "Until account deletion", purpose: "Localization" },
  { pattern: /role|permission|isAdmin/i, type: "Authorization", sensitivity: "Low", retention: "Until account deletion", purpose: "Access control" },
  { pattern: /createdAt|updatedAt|deletedAt|timestamp/i, type: "Metadata", sensitivity: "Low", retention: "Same as parent record", purpose: "Auditing" },
  { pattern: /username|handle|slug/i, type: "Identifier", sensitivity: "Low", retention: "Until account deletion", purpose: "User identification" },
];

/**
 * Classify a single field name into a data dictionary entry.
 */
export function classifyDictionaryField(
  field: string,
  source: string,
): DataDictionaryEntry {
  for (const rule of FIELD_RULES) {
    if (rule.pattern.test(field)) {
      return {
        field,
        source,
        type: rule.type,
        sensitivity: rule.sensitivity,
        retention: rule.retention,
        purpose: rule.purpose,
      };
    }
  }

  // Default classification for unknown fields
  return {
    field,
    source,
    type: "Application Data",
    sensitivity: "Low",
    retention: "Per data retention policy",
    purpose: "Application functionality",
  };
}

// ── Service-level field extraction ───────────────────────────────────

/** Well-known data fields produced by each service category. */
const SERVICE_DATA_FIELDS: Record<string, Array<{ field: string; type: string; sensitivity: FieldSensitivity; retention: string; purpose: string }>> = {
  payment: [
    { field: "payment_info", type: "Financial — PCI", sensitivity: "Critical", retention: "Do not store post-authorization; tokenize", purpose: "Payment processing" },
    { field: "billing_address", type: "Location", sensitivity: "High", retention: "7 years (tax/legal)", purpose: "Billing" },
    { field: "transaction_history", type: "Financial", sensitivity: "High", retention: "7 years (tax/legal)", purpose: "Order records, refunds" },
    { field: "customer_email", type: "Contact", sensitivity: "High", retention: "Until account deletion + 30 days", purpose: "Transaction receipts" },
  ],
  ai: [
    { field: "user_prompts", type: "AI Interaction", sensitivity: "Medium", retention: "30 days (logs); per vendor policy", purpose: "AI feature delivery" },
    { field: "conversation_history", type: "AI Interaction", sensitivity: "Medium", retention: "30 days (logs); per vendor policy", purpose: "Context continuity" },
    { field: "generated_content", type: "AI Output", sensitivity: "Low", retention: "Per user deletion request", purpose: "AI feature delivery" },
  ],
  analytics: [
    { field: "page_views", type: "Behavioral", sensitivity: "Medium", retention: "26 months", purpose: "Product analytics" },
    { field: "user_behavior", type: "Behavioral", sensitivity: "Medium", retention: "26 months", purpose: "UX optimization" },
    { field: "device_info", type: "Technical", sensitivity: "Low", retention: "26 months", purpose: "Compatibility analytics" },
    { field: "ip_address", type: "Technical", sensitivity: "Medium", retention: "90 days", purpose: "Geolocation, fraud prevention" },
  ],
  auth: [
    { field: "email", type: "Contact", sensitivity: "High", retention: "Until account deletion + 30 days", purpose: "Account identification" },
    { field: "password_hash", type: "Authentication", sensitivity: "Critical", retention: "Until account deletion; hashed at rest", purpose: "User authentication" },
    { field: "session_token", type: "Session", sensitivity: "Medium", retention: "Until session expiry", purpose: "Session management" },
    { field: "oauth_token", type: "Authentication", sensitivity: "Medium", retention: "Until session expiry or revocation", purpose: "Third-party authentication" },
  ],
  monitoring: [
    { field: "error_data", type: "Technical", sensitivity: "Low", retention: "30 days", purpose: "Error tracking" },
    { field: "stack_traces", type: "Technical", sensitivity: "Low", retention: "30 days", purpose: "Debugging" },
    { field: "user_context", type: "Technical", sensitivity: "Medium", retention: "30 days", purpose: "Error context" },
    { field: "ip_address", type: "Technical", sensitivity: "Medium", retention: "30 days", purpose: "Error context" },
  ],
  email: [
    { field: "email_address", type: "Contact", sensitivity: "High", retention: "Until unsubscribe or account deletion", purpose: "Email delivery" },
    { field: "email_content", type: "Communication", sensitivity: "Medium", retention: "90 days (delivery logs)", purpose: "Email delivery" },
  ],
  storage: [
    { field: "uploaded_files", type: "User Content", sensitivity: "Medium", retention: "Until user-initiated deletion", purpose: "File storage" },
    { field: "file_metadata", type: "Metadata", sensitivity: "Low", retention: "Until file deletion", purpose: "File management" },
  ],
  database: [
    { field: "user_data", type: "Application Data", sensitivity: "Medium", retention: "Per data retention policy", purpose: "Application functionality" },
  ],
  advertising: [
    { field: "conversion_events", type: "Behavioral", sensitivity: "Medium", retention: "90 days", purpose: "Ad campaign measurement" },
    { field: "device_info", type: "Technical", sensitivity: "Low", retention: "90 days", purpose: "Ad targeting" },
  ],
};

// ── Env var field extraction ─────────────────────────────────────────

/** Map env var name patterns to data dictionary entries. */
const ENV_VAR_FIELDS: Array<{
  pattern: RegExp;
  field: string;
  type: string;
  sensitivity: FieldSensitivity;
  retention: string;
  purpose: string;
}> = [
  { pattern: /DATABASE_URL|DB_URL|MONGO|POSTGRES|MYSQL/i, field: "database_connection", type: "Infrastructure", sensitivity: "Critical", retention: "Rotate regularly", purpose: "Database connectivity" },
  { pattern: /API_KEY|SECRET_KEY|AUTH_TOKEN|ACCESS_TOKEN/i, field: "api_credential", type: "Infrastructure", sensitivity: "Critical", retention: "Rotate regularly", purpose: "Service authentication" },
  { pattern: /SMTP|EMAIL_SERVER|MAIL/i, field: "email_config", type: "Infrastructure", sensitivity: "High", retention: "Until service change", purpose: "Email delivery configuration" },
  { pattern: /SENTRY_DSN/i, field: "error_tracking_config", type: "Infrastructure", sensitivity: "Medium", retention: "Until service change", purpose: "Error monitoring" },
  { pattern: /REDIS_URL|REDIS_HOST/i, field: "cache_connection", type: "Infrastructure", sensitivity: "High", retention: "Rotate regularly", purpose: "Caching / session storage" },
];

/**
 * Build the complete data dictionary from a scan result.
 */
export function buildDataDictionary(scan: ScanResult): DataDictionaryEntry[] {
  const entries: DataDictionaryEntry[] = [];
  const seen = new Set<string>();

  function addEntry(entry: DataDictionaryEntry): void {
    const key = `${entry.field}|${entry.source}`;
    if (!seen.has(key)) {
      seen.add(key);
      entries.push(entry);
    }
  }

  // 1. Service-derived fields
  for (const service of scan.services) {
    const categoryFields = SERVICE_DATA_FIELDS[service.category];
    if (categoryFields) {
      for (const cf of categoryFields) {
        addEntry({ ...cf, source: service.name });
      }
    }

    // Also classify individual dataCollected strings
    for (const dc of service.dataCollected) {
      addEntry(classifyDictionaryField(dc, service.name));
    }
  }

  // 2. Data category-derived fields (from schema scanners, API route scanners, etc.)
  for (const cat of scan.dataCategories) {
    for (const src of cat.sources) {
      addEntry(classifyDictionaryField(cat.category, src));
    }
  }

  // 3. Env var-derived fields (by checking evidence)
  for (const service of scan.services) {
    for (const ev of service.evidence) {
      if (ev.type === "env_var") {
        for (const envRule of ENV_VAR_FIELDS) {
          if (envRule.pattern.test(ev.detail)) {
            addEntry({ ...envRule, source: `env: ${ev.detail}` });
          }
        }
      }
    }
  }

  // Sort by sensitivity (Critical > High > Medium > Low), then field name
  const order: Record<FieldSensitivity, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  entries.sort((a, b) => {
    const so = order[a.sensitivity] - order[b.sensitivity];
    if (so !== 0) return so;
    return a.field.localeCompare(b.field);
  });

  return entries;
}

/**
 * Generate DATA_DICTIONARY.md cataloging every data field detected across all scanners.
 *
 * Returns null when no services or data categories are detected.
 */
export function generateDataDictionary(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0 && scan.dataCategories.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const date = new Date().toISOString().split("T")[0];

  const entries = buildDataDictionary(scan);

  const sections: string[] = [];

  // ── Title ──────────────────────────────────────────────────────────
  sections.push(`# Data Dictionary

**Last updated:** ${date}

**Project:** ${scan.projectName}

**Company:** ${company}

---

## 1. Purpose

This document catalogs every data field detected across the **${scan.projectName}** application. It serves as the authoritative reference for data mapping required by GDPR Article 30 (Records of Processing Activities), SOC 2 (CC6.1), and internal data governance policies.

## 2. Scope

This dictionary covers data fields from:
- Database schemas (Prisma, Drizzle, Mongoose, TypeORM, SQLAlchemy, Django)
- API routes and request handlers
- Third-party service integrations
- Environment variable configurations

---

## 3. Data Field Catalog

| Field | Source | Type | Sensitivity | Retention | Purpose |
|-------|--------|------|-------------|-----------|---------|`);

  for (const entry of entries) {
    sections.push(`| ${entry.field} | ${entry.source} | ${entry.type} | ${entry.sensitivity} | ${entry.retention} | ${entry.purpose} |`);
  }

  // ── Sensitivity summary ────────────────────────────────────────────
  const criticalCount = entries.filter(e => e.sensitivity === "Critical").length;
  const highCount = entries.filter(e => e.sensitivity === "High").length;
  const mediumCount = entries.filter(e => e.sensitivity === "Medium").length;
  const lowCount = entries.filter(e => e.sensitivity === "Low").length;

  sections.push(`
---

## 4. Sensitivity Summary

| Level | Count | Description |
|-------|-------|-------------|
| Critical | ${criticalCount} | Credentials, government IDs, raw payment data — requires encryption at rest and strict access control |
| High | ${highCount} | PII (names, emails, addresses) — requires encryption and consent |
| Medium | ${mediumCount} | Behavioral data, session data, IP addresses — requires privacy notice |
| Low | ${lowCount} | Preferences, metadata, operational data — standard handling |

**Total fields cataloged:** ${entries.length}`);

  // ── Cross-reference section ────────────────────────────────────────
  const serviceCategories = new Set(scan.services.map(s => s.category));
  const crossRefs: string[] = [];

  if (scan.dataCategories.some(c => c.sources.some(s => s.includes(".")))) {
    crossRefs.push("- **Database schema** — Fields detected from Prisma/ORM model definitions");
  }
  if (scan.dataCategories.some(c => c.category.toLowerCase().includes("api") || c.sources.some(s => s.includes("/api/")))) {
    crossRefs.push("- **API routes** — Data fields accepted via request handlers");
  }
  if (scan.services.some(s => s.evidence.some(e => e.type === "env_var"))) {
    crossRefs.push("- **Environment variables** — Service credentials and connection strings");
  }
  for (const cat of serviceCategories) {
    const services = scan.services.filter(s => s.category === cat).map(s => s.name);
    crossRefs.push(`- **${capitalize(cat)} services** — ${services.join(", ")}`);
  }

  if (crossRefs.length > 0) {
    sections.push(`
---

## 5. Cross-References

${crossRefs.join("\n")}`);
  }

  // ── Related documents ──────────────────────────────────────────────
  sections.push(`
---

## 6. Related Documents

- **PRIVACY_POLICY.md** — Public disclosure of data collection practices
- **DATA_RETENTION_POLICY.md** — Detailed retention schedules and deletion procedures
- **DATA_CLASSIFICATION.md** — GDPR sensitivity classification details
- **DATA_FLOW_MAP.md** — Visual representation of data flows between services
- **DSAR_HANDLING_GUIDE.md** — Data subject access request procedures

---

## 7. Maintenance

This data dictionary should be updated:

- When new database models or fields are added
- When new third-party services are integrated
- When data retention policies change
- At minimum **quarterly** as part of compliance review

For questions about this data dictionary, contact ${email}.

---

*This Data Dictionary was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Review and verify all entries for accuracy. This document does not constitute legal advice.*`);

  return sections.join("\n");
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
