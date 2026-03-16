# Privacy Engineering Guide

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Organization:** [Your Company Name]
**Last updated:** 2026-03-16
**Audience:** Software engineers, DevOps, security engineers
**Purpose:** Technical implementation guide for privacy by design

This guide provides actionable engineering patterns for implementing privacy by design across the [Your Company Name] technology stack. Each section is tailored to the 13 service(s) detected in the codebase and includes code examples, configuration recommendations, and testing strategies.

---

## 1. Data Masking Patterns

Data masking ensures sensitive data is obfuscated in logs, error reports, and non-production environments.

### 1.1 PII Masking Utility

```typescript
/**
 * Mask personally identifiable information before logging or display.
 * Use this anywhere PII might appear in logs, error messages, or analytics.
 */
function maskPII(value: string, type: "email" | "phone" | "name" | "ip" | "card"): string {
  switch (type) {
    case "email": {
      const [local, domain] = value.split("@");
      return local[0] + "***@" + domain;
    }
    case "phone":
      return value.slice(0, 3) + "****" + value.slice(-2);
    case "name":
      return value[0] + "***";
    case "ip":
      return value.split(".").slice(0, 2).join(".") + ".x.x";
    case "card":
      return "****-****-****-" + value.slice(-4);
    default:
      return "***";
  }
}
```

### 1.2 Log Sanitization Middleware

```typescript
/**
 * Middleware that strips PII from request logs.
 * Insert before your logging layer.
 */
function sanitizeLogEntry(entry: Record<string, unknown>): Record<string, unknown> {
  const sensitiveKeys = ["email", "password", "ssn", "token", "creditCard",
    "phoneNumber", "address", "dateOfBirth", "authorization"];
  const sanitized = { ...entry };
  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
      sanitized[key] = "[REDACTED]";
    }
  }
  return sanitized;
}
```

---

## 2. Encryption Patterns

### 2.1 Encryption at Rest

All personal data must be encrypted at rest. Use envelope encryption where possible.

```typescript
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const ALGORITHM = "aes-256-gcm";

function encrypt(plaintext: string, masterKey: string): string {
  const iv = randomBytes(16);
  const key = scryptSync(masterKey, "salt", 32); // Use proper salt in production
  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return iv.toString("hex") + ":" + authTag + ":" + encrypted;
}

function decrypt(ciphertext: string, masterKey: string): string {
  const [ivHex, authTagHex, encrypted] = ciphertext.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const key = scryptSync(masterKey, "salt", 32);
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
```

### 2.2 Encryption in Transit

- Enforce TLS 1.2+ on all service connections
- Enable HSTS headers with a minimum `max-age` of 31536000
- Pin certificates for internal service-to-service communication
- Use mTLS for service mesh traffic where possible

### 2.3 Database Connection Encryption

- **prisma**: Enforce SSL/TLS on all connections (`sslmode=require` or equivalent)
- Rotate database credentials on a 90-day cycle
- Use IAM-based authentication where supported (e.g., AWS RDS IAM auth)

---

## 3. Access Control Patterns

### 3.1 Role-Based Access Control (RBAC)

```typescript
type Role = "admin" | "editor" | "viewer" | "service-account";

interface Permission {
  resource: string;
  actions: ("read" | "write" | "delete" | "admin")[];
}

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [{ resource: "*", actions: ["read", "write", "delete", "admin"] }],
  editor: [{ resource: "content", actions: ["read", "write"] },
           { resource: "users", actions: ["read"] }],
  viewer: [{ resource: "*", actions: ["read"] }],
  "service-account": [{ resource: "api", actions: ["read", "write"] }],
};

function hasPermission(role: Role, resource: string, action: string): boolean {
  const perms = ROLE_PERMISSIONS[role];
  return perms.some(p =>
    (p.resource === "*" || p.resource === resource) &&
    p.actions.includes(action as any)
  );
}
```

### 3.2 Principle of Least Privilege

| Layer | Guideline |
| --- | --- |
| API keys | Scope to minimum required endpoints; rotate every 90 days |
| Database users | Create per-service accounts with table-level grants |
| Cloud IAM | Use service-specific roles, never use `*` in resource policies |
| OAuth scopes | Request minimum scopes; re-prompt for escalated access |
| File system | Application processes run as non-root with read-only mounts |

### 3.3 Authentication Service Hardening

#### @simplewebauthn/server

- Enforce MFA for all user accounts
- Set session timeout to 30 minutes for sensitive operations
- Implement account lockout after 5 failed attempts
- Log all authentication events for audit trail
- Use secure, HttpOnly, SameSite cookies for session tokens

#### next-auth

- Enforce MFA for all user accounts
- Set session timeout to 30 minutes for sensitive operations
- Implement account lockout after 5 failed attempts
- Log all authentication events for audit trail
- Use secure, HttpOnly, SameSite cookies for session tokens

#### passport-microsoft

- Enforce MFA for all user accounts
- Set session timeout to 30 minutes for sensitive operations
- Implement account lockout after 5 failed attempts
- Log all authentication events for audit trail
- Use secure, HttpOnly, SameSite cookies for session tokens


---

## 4. Per-Service Privacy Implementation

The following table maps each detected service to specific privacy engineering actions:

| Service | Category | Data Minimization Action | Encryption Requirement | Access Control |
| --- | --- | --- | --- | --- |
| **@ai-sdk/google-vertex** | ai | Strip PII from prompts; disable training on user data | TLS for API calls; encrypt cached prompts/responses | API key scoped per environment; prompt audit logging |
| **@aws-sdk/client-ses** | email | Store only transactional addresses; purge marketing lists | TLS for SMTP; encrypt stored templates with PII | Marketing team only for campaigns; devs for transactional |
| **@google-cloud/kms** | other | Review data collected; document purpose and retention | TLS in transit; encrypt PII at rest | Principle of least privilege; document access grants |
| **@simplewebauthn/server** | auth | Collect only required profile fields; limit OAuth scopes | Encrypt tokens and credentials at rest; TLS in transit | Admin-only config; audit all auth events |
| **@vercel/ai** | ai | Strip PII from prompts; disable training on user data | TLS for API calls; encrypt cached prompts/responses | API key scoped per environment; prompt audit logging |
| **googleapis** | other | Review data collected; document purpose and retention | TLS in transit; encrypt PII at rest | Principle of least privilege; document access grants |
| **next-auth** | auth | Collect only required profile fields; limit OAuth scopes | Encrypt tokens and credentials at rest; TLS in transit | Admin-only config; audit all auth events |
| **nodemailer** | email | Store only transactional addresses; purge marketing lists | TLS for SMTP; encrypt stored templates with PII | Marketing team only for campaigns; devs for transactional |
| **passport-microsoft** | auth | Collect only required profile fields; limit OAuth scopes | Encrypt tokens and credentials at rest; TLS in transit | Admin-only config; audit all auth events |
| **posthog** | analytics | Anonymize IPs; use aggregated metrics over user-level | TLS in transit; anonymize before storage | Read-only for analysts; no raw PII export |
| **prisma** | database | Encrypt PII columns; implement column-level access | TDE or volume encryption; TLS for connections | Per-service DB users; no shared credentials |
| **resend** | email | Store only transactional addresses; purge marketing lists | TLS for SMTP; encrypt stored templates with PII | Marketing team only for campaigns; devs for transactional |
| **stripe** | payment | Tokenize card data; never store CVV/raw PAN | PCI DSS Level 1; AES-256 at rest; TLS 1.2+ in transit | Restricted to payment team; PCI network segmentation |

### 4.1 Payment Services

**Detected:** stripe

- Never store raw card numbers — use tokenization (PCI DSS Requirement 3)
- Mask card numbers in all logs: show only last 4 digits
- Segregate payment processing into an isolated network segment
- Use webhook signature verification for all payment callbacks

```typescript
// Payment data masking example
function maskCardNumber(card: string): string {
  return "****-****-****-" + card.slice(-4);
}

// Never log raw payment data
function logPaymentEvent(event: { amount: number; cardLast4: string; status: string }) {
  logger.info("Payment processed", {
    amount: event.amount,
    cardLast4: event.cardLast4, // Already masked
    status: event.status,
    // NEVER include: fullCardNumber, cvv, expiryDate
  });
}
```

### 4.2 AI/ML Services

**Detected:** @ai-sdk/google-vertex, @vercel/ai

- Strip PII from prompts before sending to AI providers
- Implement prompt/response logging with PII redaction
- Disable training on user data (check provider opt-out settings)
- Monitor for PII leakage in AI-generated outputs

```typescript
// Sanitize prompts before sending to AI service
function sanitizePrompt(prompt: string): string {
  // Remove email addresses
  prompt = prompt.replace(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/g, "[EMAIL_REDACTED]");
  // Remove phone numbers
  prompt = prompt.replace(/\+?\d[\d\s()-]{7,}/g, "[PHONE_REDACTED]");
  // Remove SSN patterns
  prompt = prompt.replace(/\d{3}-\d{2}-\d{4}/g, "[SSN_REDACTED]");
  return prompt;
}
```

### 4.3 Analytics & Advertising

**Detected:** posthog

- Enable IP anonymization on all analytics services
- Implement consent checks before loading tracking scripts
- Use server-side tracking where possible to control data flow
- Set data retention to the minimum period required

```typescript
// Consent-gated analytics initialization
function initAnalytics(consentGiven: boolean) {
  if (!consentGiven) {
    console.log("Analytics blocked: no user consent");
    return;
  }
  // Initialize only after explicit consent
  loadAnalyticsScript({ anonymizeIp: true, dataRetentionMonths: 14 });
}
```

### 4.4 Email Services

**Detected:** @aws-sdk/client-ses, nodemailer, resend

- Use transactional email only — no marketing without explicit consent
- Implement unsubscribe headers (RFC 8058) on all emails
- Do not include sensitive data in email bodies (use secure links instead)
- Validate recipient addresses to prevent data leakage to wrong recipients

---

## 5. Data Deletion Engineering

GDPR Article 17 (Right to Erasure) requires reliable, verifiable data deletion.

```typescript
/**
 * Cascade deletion across all services for a given user.
 * Call this when processing a DSAR deletion request.
 */
async function deleteUserData(userId: string): Promise<DeletionReport> {
  const report: DeletionReport = { userId, deletedFrom: [], errors: [] };

  const deletionTasks = [
    { service: "@ai-sdk/google-vertex", fn: () => deleteaisdkgooglevertexData(userId) },
    { service: "@aws-sdk/client-ses", fn: () => deleteawssdkclientsesData(userId) },
    { service: "@google-cloud/kms", fn: () => deletegooglecloudkmsData(userId) },
    { service: "@simplewebauthn/server", fn: () => deletesimplewebauthnserverData(userId) },
    { service: "@vercel/ai", fn: () => deletevercelaiData(userId) },
    { service: "googleapis", fn: () => deletegoogleapisData(userId) },
    { service: "next-auth", fn: () => deletenextauthData(userId) },
    { service: "nodemailer", fn: () => deletenodemailerData(userId) },
    { service: "passport-microsoft", fn: () => deletepassportmicrosoftData(userId) },
    { service: "posthog", fn: () => deleteposthogData(userId) },
    { service: "prisma", fn: () => deleteprismaData(userId) },
    { service: "resend", fn: () => deleteresendData(userId) },
    { service: "stripe", fn: () => deletestripeData(userId) },
  ];

  for (const task of deletionTasks) {
    try {
      await task.fn();
      report.deletedFrom.push(task.service);
    } catch (err) {
      report.errors.push({ service: task.service, error: String(err) });
    }
  }

  return report;
}
```

---

## 6. Testing Privacy Controls

| Test | What to Verify | Frequency |
| --- | --- | --- |
| PII masking | No raw PII in logs after processing 1000 test records | Every release |
| Encryption at rest | All PII fields return encrypted values from DB queries | Weekly |
| Access control | Unprivileged roles cannot access PII endpoints | Every release |
| Data deletion | User data fully removed from all services within SLA | Monthly |
| Consent enforcement | Analytics blocked when consent not given | Every release |
| Retention enforcement | Records older than retention period are purged | Weekly |

---

## 7. Environment Variable & Secrets Hygiene

- Never commit secrets to version control (use `.env.example` with placeholder values)
- Use a secrets manager (AWS Secrets Manager, HashiCorp Vault, Doppler) in production
- Rotate API keys on a 90-day cycle; automate rotation where possible
- Scope service credentials to minimum required permissions
- Audit `.env` files for stale or unused credentials quarterly

---

*This Privacy Engineering Guide was auto-generated by Codepliant based on detected services. It provides implementation patterns — engineering teams should adapt these to their specific architecture. This document does not constitute legal advice.*