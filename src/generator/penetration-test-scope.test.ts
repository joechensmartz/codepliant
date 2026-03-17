import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { DetectedService, ScanResult } from "../scanner/types.js";
import { generatePenetrationTestScope } from "./penetration-test-scope.js";
import type { GeneratorContext } from "./index.js";

function makeService(
  name: string,
  category: DetectedService["category"],
  dataCollected: string[] = ["test data"],
  isDataProcessor?: boolean,
): DetectedService {
  return {
    name,
    category,
    evidence: [{ type: "dependency", file: "package.json", detail: `${name} detected` }],
    dataCollected,
    ...(isDataProcessor !== undefined ? { isDataProcessor } : {}),
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

describe("generatePenetrationTestScope", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when no services detected", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generatePenetrationTestScope(scan), null);
  });

  it("returns null when services lack security categories and fewer than 3 data processors", () => {
    const scan = makeScan({
      services: [
        makeService("PostHog", "analytics", ["usage data"]),
        makeService("SendGrid", "email", ["email addresses"]),
      ],
    });
    assert.strictEqual(generatePenetrationTestScope(scan), null);
  });

  it("returns null when only non-data-processor services present and no security category", () => {
    const scan = makeScan({
      services: [
        makeService("prisma", "database", ["records"], false),
        makeService("eslint", "other" as any, ["none"], false),
        makeService("prettier", "other" as any, ["none"], false),
      ],
    });
    assert.strictEqual(generatePenetrationTestScope(scan), null);
  });

  // ── Trigger conditions ─────────────────────────────────────────────

  it("generates when auth service is present (security category)", () => {
    const scan = makeScan({
      services: [makeService("clerk", "auth", ["user credentials"])],
    });
    const result = generatePenetrationTestScope(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Penetration Test Scope"));
  });

  it("generates when payment service is present (security category)", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment", ["payment info"])],
    });
    const result = generatePenetrationTestScope(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Penetration Test Scope"));
  });

  it("generates when ai service is present (security category)", () => {
    const scan = makeScan({
      services: [makeService("OpenAI", "ai", ["prompts"])],
    });
    const result = generatePenetrationTestScope(scan);
    assert.ok(result !== null);
  });

  it("generates when monitoring service is present (security category)", () => {
    const scan = makeScan({
      services: [makeService("Sentry", "monitoring", ["error traces"])],
    });
    const result = generatePenetrationTestScope(scan);
    assert.ok(result !== null);
  });

  it("generates when 3+ data-processor services detected without security categories", () => {
    const scan = makeScan({
      services: [
        makeService("PostHog", "analytics", ["usage data"]),
        makeService("SendGrid", "email", ["email addresses"]),
        makeService("AWS S3", "storage", ["files"]),
      ],
    });
    const result = generatePenetrationTestScope(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Penetration Test Scope"));
  });

  // ── Context values ─────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generatePenetrationTestScope(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context website", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const ctx: GeneratorContext = { companyName: "A", contactEmail: "a@a.com", website: "https://acme.com" };
    const result = generatePenetrationTestScope(scan, ctx)!;
    assert.ok(result.includes("https://acme.com"));
  });

  it("uses placeholder website when no context", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("[https://yoursite.com]"));
  });

  it("uses context securityEmail", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const ctx: GeneratorContext = { companyName: "A", contactEmail: "a@a.com", securityEmail: "sec@acme.com" };
    const result = generatePenetrationTestScope(scan, ctx)!;
    assert.ok(result.includes("sec@acme.com"));
  });

  it("falls back to contactEmail when securityEmail not provided", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const ctx: GeneratorContext = { companyName: "A", contactEmail: "contact@acme.com" };
    const result = generatePenetrationTestScope(scan, ctx)!;
    assert.ok(result.includes("contact@acme.com"));
  });

  it("uses placeholder security email when no context", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("[security@example.com]"));
  });

  // ── Header content ─────────────────────────────────────────────────

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes executive summary with service count", () => {
    const scan = makeScan({
      services: [
        makeService("clerk", "auth", ["creds"]),
        makeService("Stripe", "payment", ["cards"]),
      ],
    });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("## 1. Executive Summary"));
    assert.ok(result.includes("2 detected service(s)"));
  });

  it("includes category breakdown in executive summary", () => {
    const scan = makeScan({
      services: [
        makeService("clerk", "auth", ["creds"]),
        makeService("Stripe", "payment", ["cards"]),
      ],
    });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("**auth**: 1 service(s)"));
    assert.ok(result.includes("**payment**: 1 service(s)"));
  });

  // ── Risk assessment ────────────────────────────────────────────────

  it("includes payment risk factor when payment services present", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("Payment processing (PCI DSS scope)"));
  });

  it("includes auth risk factor when auth services present", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("User authentication and session management"));
  });

  it("includes AI risk factor when AI services present", () => {
    const scan = makeScan({ services: [makeService("OpenAI", "ai", ["prompts"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("AI/ML services processing user data"));
  });

  it("includes storage risk factor when storage services present", () => {
    const scan = makeScan({
      services: [
        makeService("AWS S3", "storage", ["files"]),
        makeService("clerk", "auth", ["creds"]),
      ],
    });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("File upload and cloud storage"));
  });

  it("includes third-party count risk factor with 5+ third-party services", () => {
    const scan = makeScan({
      services: [
        makeService("clerk", "auth", ["creds"]),
        makeService("Stripe", "payment", ["cards"]),
        makeService("OpenAI", "ai", ["prompts"]),
        makeService("PostHog", "analytics", ["usage"]),
        makeService("SendGrid", "email", ["emails"]),
      ],
    });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("5 third-party integrations"));
  });

  // ── Web application testing section ────────────────────────────────

  it("always includes web application testing section", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("### 2.1 Web Application Testing"));
    assert.ok(result.includes("OWASP Top 10"));
    assert.ok(result.includes("Input validation"));
    assert.ok(result.includes("Rate limiting"));
  });

  // ── Authentication section (conditional) ───────────────────────────

  it("includes authentication section when auth services detected", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["user credentials"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("### 2.2 Authentication & Session Management"));
    assert.ok(result.includes("clerk"));
    assert.ok(result.includes("Login brute-force"));
    assert.ok(result.includes("MFA bypass"));
    assert.ok(result.includes("Privilege escalation"));
  });

  it("includes auth flow checklist when auth detected", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("Auth flows to verify"));
    assert.ok(result.includes("User registration and email verification"));
    assert.ok(result.includes("Password reset / forgot password"));
    assert.ok(result.includes("Role-based access control enforcement"));
  });

  it("includes JWT verification checklist for clerk", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("JWT token validation and signature verification"));
    assert.ok(result.includes("Third-party auth provider webhook validation"));
  });

  it("includes JWT verification checklist for supabase", () => {
    const scan = makeScan({ services: [makeService("supabase", "auth", ["creds"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("JWT token validation and signature verification"));
  });

  it("omits authentication section when no auth services", () => {
    const scan = makeScan({
      services: [
        makeService("PostHog", "analytics", ["usage"]),
        makeService("SendGrid", "email", ["emails"]),
        makeService("AWS S3", "storage", ["files"]),
      ],
    });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(!result.includes("Authentication & Session Management"));
  });

  // ── API endpoint testing section ───────────────────────────────────

  it("includes API endpoint testing section", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("API Endpoint Testing"));
    assert.ok(result.includes("Authentication bypass"));
    assert.ok(result.includes("IDOR"));
    assert.ok(result.includes("CORS configuration"));
  });

  it("numbers API section as 2.3 when auth is present", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("### 2.3 API Endpoint Testing"));
  });

  it("numbers API section as 2.2 when auth is absent", () => {
    const scan = makeScan({
      services: [
        makeService("PostHog", "analytics", ["usage"]),
        makeService("SendGrid", "email", ["emails"]),
        makeService("AWS S3", "storage", ["files"]),
      ],
    });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("### 2.2 API Endpoint Testing"));
  });

  // ── Payment testing section (conditional) ──────────────────────────

  it("includes payment security section when payment services detected", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["payment info"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("### Payment Security Testing"));
    assert.ok(result.includes("Stripe"));
    assert.ok(result.includes("Price manipulation"));
    assert.ok(result.includes("Webhook validation"));
    assert.ok(result.includes("PCI data exposure"));
  });

  it("omits payment section when no payment services", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(!result.includes("Payment Security Testing"));
  });

  // ── AI/ML testing section (conditional) ────────────────────────────

  it("includes AI/ML section when AI services detected", () => {
    const scan = makeScan({ services: [makeService("OpenAI", "ai", ["prompts"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("### AI/ML Security Testing"));
    assert.ok(result.includes("OpenAI"));
    assert.ok(result.includes("Prompt injection"));
    assert.ok(result.includes("Data exfiltration"));
    assert.ok(result.includes("PII in prompts"));
  });

  it("omits AI section when no AI services", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(!result.includes("AI/ML Security Testing"));
  });

  // ── Storage testing section (conditional) ──────────────────────────

  it("includes storage section when storage services detected", () => {
    const scan = makeScan({
      services: [
        makeService("AWS S3", "storage", ["files"]),
        makeService("clerk", "auth", ["creds"]),
      ],
    });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("### File Upload & Storage Testing"));
    assert.ok(result.includes("AWS S3"));
    assert.ok(result.includes("Malicious file upload"));
    assert.ok(result.includes("Path traversal"));
    assert.ok(result.includes("Storage bucket config"));
  });

  it("omits storage section when no storage services", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(!result.includes("File Upload & Storage Testing"));
  });

  // ── Third-party integration assessment ─────────────────────────────

  it("includes third-party integration assessment", () => {
    const scan = makeScan({
      services: [
        makeService("clerk", "auth", ["creds"]),
        makeService("Stripe", "payment", ["cards"]),
      ],
    });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("## 3. Third-Party Integration Assessment"));
    assert.ok(result.includes("API keys are not exposed"));
    assert.ok(result.includes("Webhook signatures are validated"));
  });

  it("lists third-party services with security considerations", () => {
    const scan = makeScan({
      services: [
        makeService("clerk", "auth", ["creds"]),
        makeService("Stripe", "payment", ["cards"]),
      ],
    });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("| clerk | auth |"));
    assert.ok(result.includes("| Stripe | payment |"));
  });

  it("excludes database services from third-party list", () => {
    const scan = makeScan({
      services: [
        makeService("clerk", "auth", ["creds"]),
        makeService("PostgreSQL", "database", ["records"]),
      ],
    });
    const result = generatePenetrationTestScope(scan)!;
    // database is excluded from thirdPartyServices
    assert.ok(!result.includes("| PostgreSQL | database |"));
  });

  // ── Infrastructure testing ─────────────────────────────────────────

  it("always includes infrastructure testing section", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("## 4. Infrastructure Testing"));
    assert.ok(result.includes("TLS configuration"));
    assert.ok(result.includes("DNS security"));
    assert.ok(result.includes("Cloud configuration"));
  });

  it("includes database security row when database service present", () => {
    const scan = makeScan({
      services: [
        makeService("clerk", "auth", ["creds"]),
        makeService("PostgreSQL", "database", ["records"]),
      ],
    });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("Database security"));
  });

  it("includes monitoring exposure row when monitoring service present", () => {
    const scan = makeScan({ services: [makeService("Sentry", "monitoring", ["error traces"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("Monitoring exposure"));
  });

  // ── Out of scope ───────────────────────────────────────────────────

  it("includes out of scope section", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("## 5. Out of Scope"));
    assert.ok(result.includes("Denial of Service"));
    assert.ok(result.includes("Social engineering"));
  });

  // ── Methodology ────────────────────────────────────────────────────

  it("includes recommended methodology section", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("## 6. Recommended Methodology"));
    assert.ok(result.includes("OWASP Testing Guide"));
    assert.ok(result.includes("CVSS v3.1"));
  });

  // ── Testing environment ────────────────────────────────────────────

  it("includes testing environment section with context values", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const ctx: GeneratorContext = { companyName: "A", contactEmail: "a@a.com", website: "https://acme.com", securityEmail: "sec@acme.com" };
    const result = generatePenetrationTestScope(scan, ctx)!;
    assert.ok(result.includes("## 7. Testing Environment"));
    assert.ok(result.includes("https://acme.com"));
    assert.ok(result.includes("sec@acme.com"));
    assert.ok(result.includes("Staging (recommended)"));
  });

  // ── Deliverables ───────────────────────────────────────────────────

  it("includes expected deliverables section", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("## 8. Expected Deliverables"));
    assert.ok(result.includes("Executive summary report"));
    assert.ok(result.includes("CVSS-scored vulnerability list"));
    assert.ok(result.includes("Retest report"));
  });

  // ── Disclaimer ─────────────────────────────────────────────────────

  it("includes Codepliant attribution and disclaimer", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("does not constitute a complete security assessment"));
  });

  // ── Security considerations mapping ────────────────────────────────

  it("maps auth category to correct security considerations", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("OAuth flow security, token validation, session management"));
  });

  it("maps payment category to correct security considerations", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("Webhook signature verification, PCI compliance, price integrity"));
  });

  it("maps analytics category to correct security considerations", () => {
    const scan = makeScan({
      services: [
        makeService("PostHog", "analytics", ["usage"]),
        makeService("clerk", "auth", ["creds"]),
      ],
    });
    const result = generatePenetrationTestScope(scan)!;
    assert.ok(result.includes("Data collection scope, cookie consent, script integrity"));
  });
});
