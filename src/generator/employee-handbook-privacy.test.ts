import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateEmployeeHandbookPrivacySection } from "./employee-handbook-privacy.js";
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

describe("generateEmployeeHandbookPrivacySection", () => {
  // ── Null guard ───────────────────────────────────────────────────

  it("returns null when no services detected", () => {
    const result = generateEmployeeHandbookPrivacySection(makeScan());
    assert.strictEqual(result, null);
  });

  // ── Basic generation ─────────────────────────────────────────────

  it("generates document when services are present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(typeof result === "string");
    assert.ok(result!.includes("# Employee Handbook"));
  });

  it("includes Privacy & Monitoring in title", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("Privacy & Monitoring"));
  });

  it("includes effective date", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result!));
  });

  it("includes Internal document notice", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("Internal document"));
  });

  // ── Context values ───────────────────────────────────────────────

  it("uses company name from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan, makeCtx({ companyName: "TestCo Inc" }));
    assert.ok(result!.includes("TestCo Inc"));
  });

  it("uses default company placeholder when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("[Your Company Name]"));
  });

  it("uses contact email from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan, makeCtx({ contactEmail: "privacy@testco.com" }));
    assert.ok(result!.includes("privacy@testco.com"));
  });

  it("uses default email placeholder when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("[your-email@example.com]"));
  });

  it("includes DPO name when provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan, makeCtx({ dpoName: "Jane Smith" }));
    assert.ok(result!.includes("Jane Smith"));
  });

  it("includes DPO email when provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan, makeCtx({ dpoEmail: "dpo@testco.com" }));
    assert.ok(result!.includes("dpo@testco.com"));
  });

  // ── Section 1: Purpose & Scope ───────────────────────────────────

  it("includes Purpose & Scope section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("## 1. Purpose & Scope"));
    assert.ok(result!.includes("Workplace monitoring"));
    assert.ok(result!.includes("Device usage"));
    assert.ok(result!.includes("Email and communication monitoring"));
    assert.ok(result!.includes("Employee data privacy"));
  });

  it("mentions all employee types in scope", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("employees"));
    assert.ok(result!.includes("contractors"));
    assert.ok(result!.includes("interns"));
    assert.ok(result!.includes("temporary workers"));
  });

  // ── Section 2: Workplace Monitoring Policy ───────────────────────

  it("includes Workplace Monitoring Policy section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("## 2. Workplace Monitoring Policy"));
  });

  it("includes monitoring principles", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("Security"));
    assert.ok(result!.includes("Compliance"));
    assert.ok(result!.includes("Performance"));
    assert.ok(result!.includes("proportionality"));
  });

  it("shows active monitoring tools table when monitoring services present", () => {
    const scan = makeScan({ services: [makeService("@sentry/node", "monitoring")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("### 2.2 Active Monitoring Tools"));
    assert.ok(result!.includes("Sentry"));
    assert.ok(result!.includes("Error/Performance Monitoring"));
  });

  it("shows active monitoring tools table when analytics services present", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("### 2.2 Active Monitoring Tools"));
    assert.ok(result!.includes("PostHog"));
    assert.ok(result!.includes("Analytics"));
  });

  it("shows no-monitoring message when no monitoring/analytics", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("No dedicated monitoring or analytics tools are currently deployed"));
  });

  it("includes disclaimer that monitoring is not for performance evaluation", () => {
    const scan = makeScan({ services: [makeService("@sentry/node", "monitoring")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("not") && result!.includes("individual employee performance evaluation"));
  });

  it("deduplicates monitoring tools by label", () => {
    const scan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring"),
        makeService("@sentry/nextjs", "monitoring"),
      ],
    });
    const result = generateEmployeeHandbookPrivacySection(scan);
    const sentryMatches = result!.match(/\| Sentry \|/g);
    assert.ok(sentryMatches !== null);
    assert.strictEqual(sentryMatches!.length, 1);
  });

  // ── Section 3: Device Usage Policy ───────────────────────────────

  it("includes Device Usage Policy section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("## 3. Device Usage Policy"));
  });

  it("includes company-issued devices subsection", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("### 3.1 Company-Issued Devices"));
    assert.ok(result!.includes("Remotely wipe"));
  });

  it("includes BYOD subsection", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("### 3.2 Personal Devices (BYOD)"));
    assert.ok(result!.includes("MDM"));
  });

  it("includes third-party service count in software section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("### 3.3 Software & Cloud Services"));
    assert.ok(result!.includes("2"));
  });

  // ── Section 4: Email & Communication Monitoring ──────────────────

  it("includes Email & Communication Monitoring section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("## 4. Email & Communication Monitoring"));
  });

  it("includes email policy notice", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("Company email is not private"));
  });

  it("shows email services table when email services present", () => {
    const scan = makeScan({ services: [makeService("@sendgrid/mail", "email")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("### 4.2 Email Services in Use"));
    assert.ok(result!.includes("SendGrid"));
  });

  it("shows resend email service", () => {
    const scan = makeScan({ services: [makeService("resend", "email")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("Resend"));
  });

  it("includes messaging and collaboration tools subsection", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("Messaging & Collaboration Tools"));
    assert.ok(result!.includes("Slack") || result!.includes("Teams"));
  });

  // ── Section 5 (conditional): AI Tools in the Workplace ───────────

  it("includes AI Tools section when AI services detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai", ["user prompts", "conversation data"])] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("AI Tools in the Workplace"));
    assert.ok(result!.includes("openai"));
    assert.ok(result!.includes("user prompts"));
  });

  it("includes AI employee responsibilities", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("Employee responsibilities when using AI tools"));
    assert.ok(result!.includes("sensitive employee personal data"));
    assert.ok(result!.includes("Review AI-generated outputs"));
  });

  it("omits AI section when no AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(!result!.includes("AI Tools in the Workplace"));
  });

  // ── Employee Data Privacy Rights ─────────────────────────────────

  it("includes Employee Data Privacy Rights section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("Employee Data Privacy Rights"));
  });

  it("includes data collected about employees", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("IP addresses"));
    assert.ok(result!.includes("Login timestamps"));
    assert.ok(result!.includes("Email metadata"));
  });

  it("includes employee rights table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("**Access**"));
    assert.ok(result!.includes("**Rectification**"));
    assert.ok(result!.includes("**Erasure**"));
    assert.ok(result!.includes("**Data Portability**"));
  });

  it("includes GDPR reference in rights", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("GDPR"));
  });

  it("includes exercise-your-rights instructions", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("How to Exercise Your Rights"));
    assert.ok(result!.includes("30 days"));
  });

  it("includes DPO in rights section when provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan, makeCtx({ dpoName: "Jane Smith", dpoEmail: "dpo@testco.com" }));
    assert.ok(result!.includes("Data Protection Officer"));
    assert.ok(result!.includes("Jane Smith"));
    assert.ok(result!.includes("dpo@testco.com"));
  });

  // ── Enforcement & Consequences ───────────────────────────────────

  it("includes Enforcement & Consequences section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("Enforcement & Consequences"));
    assert.ok(result!.includes("termination of employment"));
    assert.ok(result!.includes("circumvent monitoring"));
    assert.ok(result!.includes("retaliation"));
  });

  // ── Changes & Acknowledgment ─────────────────────────────────────

  it("includes Changes to This Policy section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("Changes to This Policy"));
  });

  it("includes Employee Acknowledgment form", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("### Employee Acknowledgment"));
    assert.ok(result!.includes("Employee Name"));
    assert.ok(result!.includes("Employee Signature"));
    assert.ok(result!.includes("Manager Name"));
    assert.ok(result!.includes("Manager Signature"));
  });

  // ── Disclaimer ───────────────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("Codepliant"));
  });

  it("includes legal and HR review disclaimer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("legal and HR teams"));
  });

  // ── Section numbering ────────────────────────────────────────────

  it("has correct section numbering without AI", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("## 1. Purpose & Scope"));
    assert.ok(result!.includes("## 2. Workplace Monitoring Policy"));
    assert.ok(result!.includes("## 3. Device Usage Policy"));
    assert.ok(result!.includes("## 4. Email & Communication Monitoring"));
    assert.ok(result!.includes("## 5. Employee Data Privacy Rights"));
    assert.ok(result!.includes("## 6. Enforcement & Consequences"));
    assert.ok(result!.includes("## 7. Changes to This Policy"));
  });

  it("has correct section numbering with AI (additional section)", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("## 5. AI Tools in the Workplace"));
    assert.ok(result!.includes("## 6. Employee Data Privacy Rights"));
    assert.ok(result!.includes("## 7. Enforcement & Consequences"));
    assert.ok(result!.includes("## 8. Changes to This Policy"));
  });

  // ── Known monitoring tool descriptions ───────────────────────────

  it("shows Sentry description for @sentry/node", () => {
    const scan = makeScan({ services: [makeService("@sentry/node", "monitoring")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("Sentry"));
    assert.ok(result!.includes("stack traces"));
  });

  it("shows PostHog description for posthog analytics", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("PostHog"));
    assert.ok(result!.includes("Product analytics"));
  });

  it("shows Hotjar description for hotjar", () => {
    const scan = makeScan({ services: [makeService("hotjar", "analytics")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("Hotjar"));
    assert.ok(result!.includes("Session recording"));
  });

  it("shows Datadog description for @datadog/browser-rum", () => {
    const scan = makeScan({ services: [makeService("@datadog/browser-rum", "monitoring")] });
    const result = generateEmployeeHandbookPrivacySection(scan);
    assert.ok(result!.includes("Datadog RUM"));
    assert.ok(result!.includes("Real user monitoring"));
  });

  // ── Comprehensive test ───────────────────────────────────────────

  it("handles comprehensive stack with all relevant categories", () => {
    const scan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring"),
        makeService("posthog", "analytics"),
        makeService("@sendgrid/mail", "email"),
        makeService("openai", "ai", ["user prompts", "conversation data"]),
        makeService("stripe", "payment"),
        makeService("next-auth", "auth"),
      ],
    });
    const result = generateEmployeeHandbookPrivacySection(scan, makeCtx());
    assert.ok(result!.includes("Acme Corp"));
    assert.ok(result!.includes("Sentry"));
    assert.ok(result!.includes("PostHog"));
    assert.ok(result!.includes("SendGrid"));
    assert.ok(result!.includes("AI Tools in the Workplace"));
    assert.ok(result!.includes("openai"));
    assert.ok(result!.includes("Employee Acknowledgment"));
    assert.ok(result!.includes("6")); // third-party count
  });
});
