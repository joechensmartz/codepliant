import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generatePrivacyEngineeringGuide } from "./privacy-engineering-guide.js";
import type { GeneratorContext } from "./index.js";

function makeService(
  name: string,
  category: DetectedService["category"],
  dataCollected: string[] = ["test data"],
): DetectedService {
  return {
    name,
    category,
    evidence: [{ type: "dependency", file: "package.json", detail: `${name} detected` }],
    dataCollected,
  };
}

function makeScan(overrides: Partial<ScanResult> = {}): ScanResult {
  return {
    projectName: "test-project",
    projectPath: "/tmp/test",
    scannedAt: "2026-01-01",
    services: [],
    dataCategories: [],
    complianceNeeds: [],
    ...overrides,
  };
}

function makeCtx(overrides: Partial<GeneratorContext> = {}): GeneratorContext {
  return {
    companyName: "Acme Corp",
    contactEmail: "legal@acme.com",
    ...overrides,
  };
}

describe("generatePrivacyEngineeringGuide", () => {
  // ── Null guard ──────────────────────────────────────────────────────

  it("returns null when no services detected", () => {
    const result = generatePrivacyEngineeringGuide(makeScan());
    assert.strictEqual(result, null);
  });

  // ── Basic generation ────────────────────────────────────────────────

  it("generates document when services are present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(typeof result === "string");
    assert.ok(result.includes("# Privacy Engineering Guide"));
  });

  it("includes date in ISO format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result!));
  });

  it("includes audience line", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("Software engineers, DevOps, security engineers"));
  });

  it("includes purpose line", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("Technical implementation guide for privacy by design"));
  });

  it("includes service count in introduction", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("3 service(s)"));
  });

  // ── Context values ────────────────────────────────────────────────────

  it("uses company name from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ companyName: "TestCo Inc" });
    const result = generatePrivacyEngineeringGuide(scan, ctx);
    assert.ok(result!.includes("TestCo Inc"));
  });

  it("uses default company placeholder when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("[Your Company Name]"));
  });

  // ── Section 1: Data Masking Patterns ──────────────────────────────────

  it("includes Data Masking Patterns section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("## 1. Data Masking Patterns"));
  });

  it("includes PII masking utility code", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("### 1.1 PII Masking Utility"));
    assert.ok(result!.includes("maskPII"));
    assert.ok(result!.includes("email"));
    assert.ok(result!.includes("phone"));
    assert.ok(result!.includes("card"));
  });

  it("includes log sanitization middleware code", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("### 1.2 Log Sanitization Middleware"));
    assert.ok(result!.includes("sanitizeLogEntry"));
    assert.ok(result!.includes("[REDACTED]"));
  });

  it("includes monitoring PII scrubbing when monitoring detected", () => {
    const scan = makeScan({ services: [makeService("@sentry/node", "monitoring")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("### 1.3 Monitoring & Error Reporting"));
    assert.ok(result!.includes("@sentry/node"));
    assert.ok(result!.includes("beforeSend"));
  });

  it("omits monitoring section when no monitoring detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(!result!.includes("### 1.3 Monitoring & Error Reporting"));
  });

  // ── Section 2: Encryption Patterns ────────────────────────────────────

  it("includes Encryption Patterns section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("## 2. Encryption Patterns"));
  });

  it("includes encryption at rest code example", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("### 2.1 Encryption at Rest"));
    assert.ok(result!.includes("aes-256-gcm"));
    assert.ok(result!.includes("encrypt"));
    assert.ok(result!.includes("decrypt"));
  });

  it("includes encryption in transit guidance", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("### 2.2 Encryption in Transit"));
    assert.ok(result!.includes("TLS 1.2+"));
    assert.ok(result!.includes("HSTS"));
  });

  it("includes database encryption section when database detected", () => {
    const scan = makeScan({ services: [makeService("@supabase/supabase-js", "database")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("### 2.3 Database Connection Encryption"));
    assert.ok(result!.includes("@supabase/supabase-js"));
    assert.ok(result!.includes("sslmode=require"));
  });

  it("omits database encryption section when no database detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(!result!.includes("### 2.3 Database Connection Encryption"));
  });

  // ── Section 3: Access Control Patterns ────────────────────────────────

  it("includes Access Control Patterns section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("## 3. Access Control Patterns"));
  });

  it("includes RBAC code example", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("### 3.1 Role-Based Access Control (RBAC)"));
    assert.ok(result!.includes("hasPermission"));
    assert.ok(result!.includes("ROLE_PERMISSIONS"));
  });

  it("includes least privilege table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("### 3.2 Principle of Least Privilege"));
    assert.ok(result!.includes("API keys"));
    assert.ok(result!.includes("OAuth scopes"));
  });

  it("includes auth hardening when auth detected", () => {
    const scan = makeScan({ services: [makeService("@clerk/nextjs", "auth")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("### 3.3 Authentication Service Hardening"));
    assert.ok(result!.includes("@clerk/nextjs"));
    assert.ok(result!.includes("MFA"));
    assert.ok(result!.includes("session timeout"));
  });

  it("omits auth hardening when no auth detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(!result!.includes("### 3.3 Authentication Service Hardening"));
  });

  // ── Section 4: Per-Service Privacy Implementation ─────────────────────

  it("includes per-service privacy table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("## 4. Per-Service Privacy Implementation"));
    assert.ok(result!.includes("| **stripe** | payment |"));
  });

  it("includes data minimization action for payment", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("Tokenize card data"));
  });

  it("includes data minimization action for analytics", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("Anonymize IPs"));
  });

  it("includes data minimization action for AI", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("Strip PII from prompts"));
  });

  it("includes encryption requirement for payment (PCI DSS)", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("PCI DSS Level 1"));
  });

  it("includes access control for payment", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("PCI network segmentation"));
  });

  // ── Conditional: Payment section ──────────────────────────────────────

  it("includes payment section when payment detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("### 4.1 Payment Services"));
    assert.ok(result!.includes("stripe"));
    assert.ok(result!.includes("Never store raw card numbers"));
    assert.ok(result!.includes("PCI DSS Requirement 3"));
    assert.ok(result!.includes("maskCardNumber"));
  });

  it("omits payment section when no payment detected", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(!result!.includes("### 4.1 Payment Services"));
  });

  // ── Conditional: AI section ───────────────────────────────────────────

  it("includes AI section when AI detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("### 4.2 AI/ML Services"));
    assert.ok(result!.includes("openai"));
    assert.ok(result!.includes("sanitizePrompt"));
    assert.ok(result!.includes("EMAIL_REDACTED"));
    assert.ok(result!.includes("PHONE_REDACTED"));
    assert.ok(result!.includes("SSN_REDACTED"));
  });

  it("omits AI section when no AI detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(!result!.includes("### 4.2 AI/ML Services"));
  });

  // ── Conditional: Analytics & Advertising section ──────────────────────

  it("includes analytics section when analytics detected", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("### 4.3 Analytics & Advertising"));
    assert.ok(result!.includes("posthog"));
    assert.ok(result!.includes("IP anonymization"));
    assert.ok(result!.includes("consent checks"));
    assert.ok(result!.includes("initAnalytics"));
  });

  it("includes analytics section when advertising detected", () => {
    const scan = makeScan({ services: [makeService("ad-network", "advertising")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("### 4.3 Analytics & Advertising"));
    assert.ok(result!.includes("ad-network"));
  });

  it("omits analytics section when neither analytics nor advertising detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(!result!.includes("### 4.3 Analytics & Advertising"));
  });

  // ── Conditional: Email section ────────────────────────────────────────

  it("includes email section when email detected", () => {
    const scan = makeScan({ services: [makeService("resend", "email")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("### 4.4 Email Services"));
    assert.ok(result!.includes("resend"));
    assert.ok(result!.includes("transactional email only"));
    assert.ok(result!.includes("RFC 8058"));
  });

  it("omits email section when no email detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(!result!.includes("### 4.4 Email Services"));
  });

  // ── Conditional: Storage section ──────────────────────────────────────

  it("includes storage section when storage detected", () => {
    const scan = makeScan({ services: [makeService("@aws-sdk/client-s3", "storage")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("### 4.5 Storage Services"));
    assert.ok(result!.includes("@aws-sdk/client-s3"));
    assert.ok(result!.includes("server-side encryption (SSE)"));
    assert.ok(result!.includes("pre-signed URLs"));
  });

  it("omits storage section when no storage detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(!result!.includes("### 4.5 Storage Services"));
  });

  // ── Section 5: Data Deletion Engineering ──────────────────────────────

  it("includes data deletion engineering section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("## 5. Data Deletion Engineering"));
    assert.ok(result!.includes("GDPR Article 17"));
    assert.ok(result!.includes("deleteUserData"));
  });

  it("lists all services in deletion cascade", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes('"stripe"'));
    assert.ok(result!.includes('"openai"'));
    assert.ok(result!.includes('"posthog"'));
  });

  // ── Section 6: Testing Privacy Controls ───────────────────────────────

  it("includes testing privacy controls section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("## 6. Testing Privacy Controls"));
    assert.ok(result!.includes("PII masking"));
    assert.ok(result!.includes("Encryption at rest"));
    assert.ok(result!.includes("Data deletion"));
    assert.ok(result!.includes("Consent enforcement"));
  });

  // ── Section 7: Environment Variable Hygiene ───────────────────────────

  it("includes environment variable hygiene section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("## 7. Environment Variable & Secrets Hygiene"));
    assert.ok(result!.includes("secrets manager"));
    assert.ok(result!.includes("90-day cycle"));
    assert.ok(result!.includes(".env.example"));
  });

  // ── Disclaimer ────────────────────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("Codepliant"));
    assert.ok(result!.includes("does not constitute legal advice"));
  });

  // ── Helper function coverage ──────────────────────────────────────────

  it("maps auth minimization action correctly", () => {
    const scan = makeScan({ services: [makeService("@clerk/nextjs", "auth")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("Collect only required profile fields"));
  });

  it("maps email minimization action correctly", () => {
    const scan = makeScan({ services: [makeService("resend", "email")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("Store only transactional addresses"));
  });

  it("maps monitoring minimization action correctly", () => {
    const scan = makeScan({ services: [makeService("@sentry/node", "monitoring")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("Scrub PII from error payloads"));
  });

  it("maps database minimization action correctly", () => {
    const scan = makeScan({ services: [makeService("@supabase/supabase-js", "database")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("Encrypt PII columns"));
  });

  it("maps storage minimization action correctly", () => {
    const scan = makeScan({ services: [makeService("@aws-sdk/client-s3", "storage")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("Classify and tag PII objects"));
  });

  it("maps advertising minimization action correctly", () => {
    const scan = makeScan({ services: [makeService("ad-network", "advertising")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("hashed identifiers"));
  });

  it("maps social minimization action correctly", () => {
    const scan = makeScan({ services: [makeService("social-sdk", "social")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("Minimize profile data ingestion"));
  });

  it("maps other/unknown category minimization action correctly", () => {
    const scan = makeScan({ services: [makeService("some-tool", "other")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("Review data collected"));
  });

  it("maps auth encryption requirement correctly", () => {
    const scan = makeScan({ services: [makeService("@clerk/nextjs", "auth")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("Encrypt tokens and credentials at rest"));
  });

  it("maps storage encryption requirement correctly", () => {
    const scan = makeScan({ services: [makeService("@aws-sdk/client-s3", "storage")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("SSE (AES-256)"));
  });

  it("maps auth access control correctly", () => {
    const scan = makeScan({ services: [makeService("@clerk/nextjs", "auth")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("Admin-only config; audit all auth events"));
  });

  it("maps analytics access control correctly", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("Read-only for analysts"));
  });

  // ── Combined scenario ─────────────────────────────────────────────────

  it("handles all categories together", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
        makeService("@clerk/nextjs", "auth"),
        makeService("resend", "email"),
        makeService("@aws-sdk/client-s3", "storage"),
        makeService("@sentry/node", "monitoring"),
        makeService("@supabase/supabase-js", "database"),
        makeService("ad-network", "advertising"),
      ],
    });
    const ctx = makeCtx({ companyName: "Full Stack Corp" });
    const result = generatePrivacyEngineeringGuide(scan, ctx)!;
    assert.ok(result.includes("Full Stack Corp"));
    assert.ok(result.includes("9 service(s)"));
    assert.ok(result.includes("### 1.3 Monitoring & Error Reporting"));
    assert.ok(result.includes("### 2.3 Database Connection Encryption"));
    assert.ok(result.includes("### 3.3 Authentication Service Hardening"));
    assert.ok(result.includes("### 4.1 Payment Services"));
    assert.ok(result.includes("### 4.2 AI/ML Services"));
    assert.ok(result.includes("### 4.3 Analytics & Advertising"));
    assert.ok(result.includes("### 4.4 Email Services"));
    assert.ok(result.includes("### 4.5 Storage Services"));
  });

  it("sanitizes service names for deletion function names", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generatePrivacyEngineeringGuide(scan);
    // @sentry/node → sentrynode
    assert.ok(result!.includes("deletesentrynode"));
  });

  it("includes multiple monitoring services in scrubbing section", () => {
    const scan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring"),
        makeService("dd-trace", "monitoring"),
      ],
    });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("@sentry/node"));
    assert.ok(result!.includes("dd-trace"));
  });

  it("includes multiple auth services in hardening section", () => {
    const scan = makeScan({
      services: [
        makeService("@clerk/nextjs", "auth"),
        makeService("next-auth", "auth"),
      ],
    });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("#### @clerk/nextjs"));
    assert.ok(result!.includes("#### next-auth"));
  });

  it("includes multiple database services in encryption section", () => {
    const scan = makeScan({
      services: [
        makeService("@supabase/supabase-js", "database"),
        makeService("firebase", "database"),
      ],
    });
    const result = generatePrivacyEngineeringGuide(scan);
    assert.ok(result!.includes("**@supabase/supabase-js**"));
    assert.ok(result!.includes("**firebase**"));
  });
});
