import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generate a PRIVACY_ENGINEERING_GUIDE.md — technical guide for developers
 * on implementing privacy by design. Per-service guidance on minimizing data
 * exposure, with code patterns for data masking, encryption, and access control.
 */
export function generatePrivacyEngineeringGuide(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];

  const hasAuth = scan.services.some((s) => s.category === "auth");
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasAnalytics = scan.services.some((s) => s.category === "analytics");
  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasStorage = scan.services.some((s) => s.category === "storage");
  const hasEmail = scan.services.some((s) => s.category === "email");
  const hasMonitoring = scan.services.some((s) => s.category === "monitoring");
  const hasDatabase = scan.services.some((s) => s.category === "database");
  const hasAdvertising = scan.services.some((s) => s.category === "advertising");

  const sections: string[] = [];

  // --- Header ---
  sections.push(`# Privacy Engineering Guide`);
  sections.push("");
  sections.push(`**Organization:** ${company}`);
  sections.push(`**Last updated:** ${date}`);
  sections.push(`**Audience:** Software engineers, DevOps, security engineers`);
  sections.push(`**Purpose:** Technical implementation guide for privacy by design`);
  sections.push("");
  sections.push(
    `This guide provides actionable engineering patterns for implementing privacy by design ` +
    `across the ${company} technology stack. Each section is tailored to the ${scan.services.length} ` +
    `service(s) detected in the codebase and includes code examples, configuration recommendations, ` +
    `and testing strategies.`
  );
  sections.push("");
  sections.push("---");

  // --- 1. Data Masking Patterns ---
  sections.push("");
  sections.push("## 1. Data Masking Patterns");
  sections.push("");
  sections.push("Data masking ensures sensitive data is obfuscated in logs, error reports, and non-production environments.");
  sections.push("");
  sections.push("### 1.1 PII Masking Utility");
  sections.push("");
  sections.push("```typescript");
  sections.push(`/**`);
  sections.push(` * Mask personally identifiable information before logging or display.`);
  sections.push(` * Use this anywhere PII might appear in logs, error messages, or analytics.`);
  sections.push(` */`);
  sections.push(`function maskPII(value: string, type: "email" | "phone" | "name" | "ip" | "card"): string {`);
  sections.push(`  switch (type) {`);
  sections.push(`    case "email": {`);
  sections.push(`      const [local, domain] = value.split("@");`);
  sections.push(`      return local[0] + "***@" + domain;`);
  sections.push(`    }`);
  sections.push(`    case "phone":`);
  sections.push(`      return value.slice(0, 3) + "****" + value.slice(-2);`);
  sections.push(`    case "name":`);
  sections.push(`      return value[0] + "***";`);
  sections.push(`    case "ip":`);
  sections.push(`      return value.split(".").slice(0, 2).join(".") + ".x.x";`);
  sections.push(`    case "card":`);
  sections.push(`      return "****-****-****-" + value.slice(-4);`);
  sections.push(`    default:`);
  sections.push(`      return "***";`);
  sections.push(`  }`);
  sections.push(`}`);
  sections.push("```");
  sections.push("");
  sections.push("### 1.2 Log Sanitization Middleware");
  sections.push("");
  sections.push("```typescript");
  sections.push(`/**`);
  sections.push(` * Middleware that strips PII from request logs.`);
  sections.push(` * Insert before your logging layer.`);
  sections.push(` */`);
  sections.push(`function sanitizeLogEntry(entry: Record<string, unknown>): Record<string, unknown> {`);
  sections.push(`  const sensitiveKeys = ["email", "password", "ssn", "token", "creditCard",`);
  sections.push(`    "phoneNumber", "address", "dateOfBirth", "authorization"];`);
  sections.push(`  const sanitized = { ...entry };`);
  sections.push(`  for (const key of Object.keys(sanitized)) {`);
  sections.push(`    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {`);
  sections.push(`      sanitized[key] = "[REDACTED]";`);
  sections.push(`    }`);
  sections.push(`  }`);
  sections.push(`  return sanitized;`);
  sections.push(`}`);
  sections.push("```");

  if (hasMonitoring) {
    sections.push("");
    sections.push("### 1.3 Monitoring & Error Reporting");
    sections.push("");
    sections.push("**Detected monitoring services** should be configured to scrub PII:");
    sections.push("");
    for (const svc of scan.services.filter((s) => s.category === "monitoring")) {
      sections.push(`- **${svc.name}**: Configure \`beforeSend\` / scrubbing hooks to strip PII from error payloads`);
    }
    sections.push("");
    sections.push("```typescript");
    sections.push(`// Example: Sentry PII scrubbing`);
    sections.push(`Sentry.init({`);
    sections.push(`  beforeSend(event) {`);
    sections.push(`    if (event.user) {`);
    sections.push(`      delete event.user.email;`);
    sections.push(`      delete event.user.ip_address;`);
    sections.push(`    }`);
    sections.push(`    return event;`);
    sections.push(`  },`);
    sections.push(`});`);
    sections.push("```");
  }

  // --- 2. Encryption Patterns ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 2. Encryption Patterns");
  sections.push("");
  sections.push("### 2.1 Encryption at Rest");
  sections.push("");
  sections.push("All personal data must be encrypted at rest. Use envelope encryption where possible.");
  sections.push("");
  sections.push("```typescript");
  sections.push(`import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";`);
  sections.push(``);
  sections.push(`const ALGORITHM = "aes-256-gcm";`);
  sections.push(``);
  sections.push(`function encrypt(plaintext: string, masterKey: string): string {`);
  sections.push(`  const iv = randomBytes(16);`);
  sections.push(`  const key = scryptSync(masterKey, "salt", 32); // Use proper salt in production`);
  sections.push(`  const cipher = createCipheriv(ALGORITHM, key, iv);`);
  sections.push(`  let encrypted = cipher.update(plaintext, "utf8", "hex");`);
  sections.push(`  encrypted += cipher.final("hex");`);
  sections.push(`  const authTag = cipher.getAuthTag().toString("hex");`);
  sections.push(`  return iv.toString("hex") + ":" + authTag + ":" + encrypted;`);
  sections.push(`}`);
  sections.push(``);
  sections.push(`function decrypt(ciphertext: string, masterKey: string): string {`);
  sections.push(`  const [ivHex, authTagHex, encrypted] = ciphertext.split(":");`);
  sections.push(`  const iv = Buffer.from(ivHex, "hex");`);
  sections.push(`  const authTag = Buffer.from(authTagHex, "hex");`);
  sections.push(`  const key = scryptSync(masterKey, "salt", 32);`);
  sections.push(`  const decipher = createDecipheriv(ALGORITHM, key, iv);`);
  sections.push(`  decipher.setAuthTag(authTag);`);
  sections.push(`  let decrypted = decipher.update(encrypted, "hex", "utf8");`);
  sections.push(`  decrypted += decipher.final("utf8");`);
  sections.push(`  return decrypted;`);
  sections.push(`}`);
  sections.push("```");

  sections.push("");
  sections.push("### 2.2 Encryption in Transit");
  sections.push("");
  sections.push("- Enforce TLS 1.2+ on all service connections");
  sections.push("- Enable HSTS headers with a minimum `max-age` of 31536000");
  sections.push("- Pin certificates for internal service-to-service communication");
  sections.push("- Use mTLS for service mesh traffic where possible");

  if (hasDatabase) {
    sections.push("");
    sections.push("### 2.3 Database Connection Encryption");
    sections.push("");
    for (const svc of scan.services.filter((s) => s.category === "database")) {
      sections.push(`- **${svc.name}**: Enforce SSL/TLS on all connections (\`sslmode=require\` or equivalent)`);
    }
    sections.push("- Rotate database credentials on a 90-day cycle");
    sections.push("- Use IAM-based authentication where supported (e.g., AWS RDS IAM auth)");
  }

  // --- 3. Access Control Patterns ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 3. Access Control Patterns");
  sections.push("");
  sections.push("### 3.1 Role-Based Access Control (RBAC)");
  sections.push("");
  sections.push("```typescript");
  sections.push(`type Role = "admin" | "editor" | "viewer" | "service-account";`);
  sections.push(``);
  sections.push(`interface Permission {`);
  sections.push(`  resource: string;`);
  sections.push(`  actions: ("read" | "write" | "delete" | "admin")[];`);
  sections.push(`}`);
  sections.push(``);
  sections.push(`const ROLE_PERMISSIONS: Record<Role, Permission[]> = {`);
  sections.push(`  admin: [{ resource: "*", actions: ["read", "write", "delete", "admin"] }],`);
  sections.push(`  editor: [{ resource: "content", actions: ["read", "write"] },`);
  sections.push(`           { resource: "users", actions: ["read"] }],`);
  sections.push(`  viewer: [{ resource: "*", actions: ["read"] }],`);
  sections.push(`  "service-account": [{ resource: "api", actions: ["read", "write"] }],`);
  sections.push(`};`);
  sections.push(``);
  sections.push(`function hasPermission(role: Role, resource: string, action: string): boolean {`);
  sections.push(`  const perms = ROLE_PERMISSIONS[role];`);
  sections.push(`  return perms.some(p =>`);
  sections.push(`    (p.resource === "*" || p.resource === resource) &&`);
  sections.push(`    p.actions.includes(action as any)`);
  sections.push(`  );`);
  sections.push(`}`);
  sections.push("```");

  sections.push("");
  sections.push("### 3.2 Principle of Least Privilege");
  sections.push("");
  sections.push("| Layer | Guideline |");
  sections.push("| --- | --- |");
  sections.push("| API keys | Scope to minimum required endpoints; rotate every 90 days |");
  sections.push("| Database users | Create per-service accounts with table-level grants |");
  sections.push("| Cloud IAM | Use service-specific roles, never use `*` in resource policies |");
  sections.push("| OAuth scopes | Request minimum scopes; re-prompt for escalated access |");
  sections.push("| File system | Application processes run as non-root with read-only mounts |");

  if (hasAuth) {
    sections.push("");
    sections.push("### 3.3 Authentication Service Hardening");
    sections.push("");
    for (const svc of scan.services.filter((s) => s.category === "auth")) {
      sections.push(`#### ${svc.name}`);
      sections.push("");
      sections.push("- Enforce MFA for all user accounts");
      sections.push("- Set session timeout to 30 minutes for sensitive operations");
      sections.push("- Implement account lockout after 5 failed attempts");
      sections.push("- Log all authentication events for audit trail");
      sections.push("- Use secure, HttpOnly, SameSite cookies for session tokens");
      sections.push("");
    }
  }

  // --- 4. Per-Service Privacy Implementation ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 4. Per-Service Privacy Implementation");
  sections.push("");
  sections.push("The following table maps each detected service to specific privacy engineering actions:");
  sections.push("");
  sections.push("| Service | Category | Data Minimization Action | Encryption Requirement | Access Control |");
  sections.push("| --- | --- | --- | --- | --- |");

  for (const svc of scan.services) {
    const minimization = getMinimizationAction(svc.category, svc.name);
    const encryption = getEncryptionRequirement(svc.category);
    const access = getAccessControl(svc.category);
    sections.push(`| **${svc.name}** | ${svc.category} | ${minimization} | ${encryption} | ${access} |`);
  }

  // --- 4.1 Detailed per-category guidance ---
  if (hasPayment) {
    sections.push("");
    sections.push("### 4.1 Payment Services");
    sections.push("");
    sections.push("**Detected:** " + scan.services.filter((s) => s.category === "payment").map((s) => s.name).join(", "));
    sections.push("");
    sections.push("- Never store raw card numbers — use tokenization (PCI DSS Requirement 3)");
    sections.push("- Mask card numbers in all logs: show only last 4 digits");
    sections.push("- Segregate payment processing into an isolated network segment");
    sections.push("- Use webhook signature verification for all payment callbacks");
    sections.push("");
    sections.push("```typescript");
    sections.push(`// Payment data masking example`);
    sections.push(`function maskCardNumber(card: string): string {`);
    sections.push(`  return "****-****-****-" + card.slice(-4);`);
    sections.push(`}`);
    sections.push(``);
    sections.push(`// Never log raw payment data`);
    sections.push(`function logPaymentEvent(event: { amount: number; cardLast4: string; status: string }) {`);
    sections.push(`  logger.info("Payment processed", {`);
    sections.push(`    amount: event.amount,`);
    sections.push(`    cardLast4: event.cardLast4, // Already masked`);
    sections.push(`    status: event.status,`);
    sections.push(`    // NEVER include: fullCardNumber, cvv, expiryDate`);
    sections.push(`  });`);
    sections.push(`}`);
    sections.push("```");
  }

  if (hasAI) {
    sections.push("");
    sections.push("### 4.2 AI/ML Services");
    sections.push("");
    sections.push("**Detected:** " + scan.services.filter((s) => s.category === "ai").map((s) => s.name).join(", "));
    sections.push("");
    sections.push("- Strip PII from prompts before sending to AI providers");
    sections.push("- Implement prompt/response logging with PII redaction");
    sections.push("- Disable training on user data (check provider opt-out settings)");
    sections.push("- Monitor for PII leakage in AI-generated outputs");
    sections.push("");
    sections.push("```typescript");
    sections.push(`// Sanitize prompts before sending to AI service`);
    sections.push(`function sanitizePrompt(prompt: string): string {`);
    sections.push(`  // Remove email addresses`);
    sections.push(`  prompt = prompt.replace(/[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}/g, "[EMAIL_REDACTED]");`);
    sections.push(`  // Remove phone numbers`);
    sections.push(`  prompt = prompt.replace(/\\+?\\d[\\d\\s()-]{7,}/g, "[PHONE_REDACTED]");`);
    sections.push(`  // Remove SSN patterns`);
    sections.push(`  prompt = prompt.replace(/\\d{3}-\\d{2}-\\d{4}/g, "[SSN_REDACTED]");`);
    sections.push(`  return prompt;`);
    sections.push(`}`);
    sections.push("```");
  }

  if (hasAnalytics || hasAdvertising) {
    sections.push("");
    sections.push("### 4.3 Analytics & Advertising");
    sections.push("");
    const analyticsServices = scan.services.filter((s) => s.category === "analytics" || s.category === "advertising");
    sections.push("**Detected:** " + analyticsServices.map((s) => s.name).join(", "));
    sections.push("");
    sections.push("- Enable IP anonymization on all analytics services");
    sections.push("- Implement consent checks before loading tracking scripts");
    sections.push("- Use server-side tracking where possible to control data flow");
    sections.push("- Set data retention to the minimum period required");
    sections.push("");
    sections.push("```typescript");
    sections.push(`// Consent-gated analytics initialization`);
    sections.push(`function initAnalytics(consentGiven: boolean) {`);
    sections.push(`  if (!consentGiven) {`);
    sections.push(`    console.log("Analytics blocked: no user consent");`);
    sections.push(`    return;`);
    sections.push(`  }`);
    sections.push(`  // Initialize only after explicit consent`);
    sections.push(`  loadAnalyticsScript({ anonymizeIp: true, dataRetentionMonths: 14 });`);
    sections.push(`}`);
    sections.push("```");
  }

  if (hasEmail) {
    sections.push("");
    sections.push("### 4.4 Email Services");
    sections.push("");
    sections.push("**Detected:** " + scan.services.filter((s) => s.category === "email").map((s) => s.name).join(", "));
    sections.push("");
    sections.push("- Use transactional email only — no marketing without explicit consent");
    sections.push("- Implement unsubscribe headers (RFC 8058) on all emails");
    sections.push("- Do not include sensitive data in email bodies (use secure links instead)");
    sections.push("- Validate recipient addresses to prevent data leakage to wrong recipients");
  }

  if (hasStorage) {
    sections.push("");
    sections.push("### 4.5 Storage Services");
    sections.push("");
    sections.push("**Detected:** " + scan.services.filter((s) => s.category === "storage").map((s) => s.name).join(", "));
    sections.push("");
    sections.push("- Enable server-side encryption (SSE) on all storage buckets");
    sections.push("- Block public access by default; use pre-signed URLs for temporary access");
    sections.push("- Implement lifecycle policies to auto-delete data after retention period");
    sections.push("- Enable access logging on all storage buckets containing user data");
  }

  // --- 5. Data Deletion Engineering ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 5. Data Deletion Engineering");
  sections.push("");
  sections.push("GDPR Article 17 (Right to Erasure) requires reliable, verifiable data deletion.");
  sections.push("");
  sections.push("```typescript");
  sections.push(`/**`);
  sections.push(` * Cascade deletion across all services for a given user.`);
  sections.push(` * Call this when processing a DSAR deletion request.`);
  sections.push(` */`);
  sections.push(`async function deleteUserData(userId: string): Promise<DeletionReport> {`);
  sections.push(`  const report: DeletionReport = { userId, deletedFrom: [], errors: [] };`);
  sections.push(``);
  sections.push(`  const deletionTasks = [`);

  for (const svc of scan.services) {
    sections.push(`    { service: "${svc.name}", fn: () => delete${sanitizeName(svc.name)}Data(userId) },`);
  }

  sections.push(`  ];`);
  sections.push(``);
  sections.push(`  for (const task of deletionTasks) {`);
  sections.push(`    try {`);
  sections.push(`      await task.fn();`);
  sections.push(`      report.deletedFrom.push(task.service);`);
  sections.push(`    } catch (err) {`);
  sections.push(`      report.errors.push({ service: task.service, error: String(err) });`);
  sections.push(`    }`);
  sections.push(`  }`);
  sections.push(``);
  sections.push(`  return report;`);
  sections.push(`}`);
  sections.push("```");

  // --- 6. Testing Privacy Controls ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 6. Testing Privacy Controls");
  sections.push("");
  sections.push("| Test | What to Verify | Frequency |");
  sections.push("| --- | --- | --- |");
  sections.push("| PII masking | No raw PII in logs after processing 1000 test records | Every release |");
  sections.push("| Encryption at rest | All PII fields return encrypted values from DB queries | Weekly |");
  sections.push("| Access control | Unprivileged roles cannot access PII endpoints | Every release |");
  sections.push("| Data deletion | User data fully removed from all services within SLA | Monthly |");
  sections.push("| Consent enforcement | Analytics blocked when consent not given | Every release |");
  sections.push("| Retention enforcement | Records older than retention period are purged | Weekly |");

  // --- 7. Environment Variable Hygiene ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("## 7. Environment Variable & Secrets Hygiene");
  sections.push("");
  sections.push("- Never commit secrets to version control (use `.env.example` with placeholder values)");
  sections.push("- Use a secrets manager (AWS Secrets Manager, HashiCorp Vault, Doppler) in production");
  sections.push("- Rotate API keys on a 90-day cycle; automate rotation where possible");
  sections.push("- Scope service credentials to minimum required permissions");
  sections.push("- Audit `.env` files for stale or unused credentials quarterly");

  // --- Footer ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("*This Privacy Engineering Guide was auto-generated by Codepliant based on detected services. " +
    "It provides implementation patterns — engineering teams should adapt these to their specific architecture. " +
    "This document does not constitute legal advice.*");

  return sections.join("\n");
}

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, "");
}

function getMinimizationAction(category: string, name: string): string {
  const actions: Record<string, string> = {
    auth: "Collect only required profile fields; limit OAuth scopes",
    payment: "Tokenize card data; never store CVV/raw PAN",
    analytics: "Anonymize IPs; use aggregated metrics over user-level",
    ai: "Strip PII from prompts; disable training on user data",
    email: "Store only transactional addresses; purge marketing lists",
    database: "Encrypt PII columns; implement column-level access",
    storage: "Classify and tag PII objects; auto-expire temporary uploads",
    monitoring: "Scrub PII from error payloads and breadcrumbs",
    advertising: "Use hashed identifiers; honor opt-out signals",
    social: "Minimize profile data ingestion; verify scopes",
    other: "Review data collected; document purpose and retention",
  };
  return actions[category] || actions.other;
}

function getEncryptionRequirement(category: string): string {
  const reqs: Record<string, string> = {
    auth: "Encrypt tokens and credentials at rest; TLS in transit",
    payment: "PCI DSS Level 1; AES-256 at rest; TLS 1.2+ in transit",
    analytics: "TLS in transit; anonymize before storage",
    ai: "TLS for API calls; encrypt cached prompts/responses",
    email: "TLS for SMTP; encrypt stored templates with PII",
    database: "TDE or volume encryption; TLS for connections",
    storage: "SSE (AES-256); enforce HTTPS-only access",
    monitoring: "TLS for log shipping; encrypt log archives",
    advertising: "TLS for pixel/tag requests",
    social: "TLS for API calls; encrypt stored tokens",
    other: "TLS in transit; encrypt PII at rest",
  };
  return reqs[category] || reqs.other;
}

function getAccessControl(category: string): string {
  const controls: Record<string, string> = {
    auth: "Admin-only config; audit all auth events",
    payment: "Restricted to payment team; PCI network segmentation",
    analytics: "Read-only for analysts; no raw PII export",
    ai: "API key scoped per environment; prompt audit logging",
    email: "Marketing team only for campaigns; devs for transactional",
    database: "Per-service DB users; no shared credentials",
    storage: "Bucket policies; no public access; pre-signed URLs",
    monitoring: "Read-only dashboards; admin for config changes",
    advertising: "Marketing team only; consent-gated deployment",
    social: "OAuth tokens per-user; no shared app tokens",
    other: "Principle of least privilege; document access grants",
  };
  return controls[category] || controls.other;
}
