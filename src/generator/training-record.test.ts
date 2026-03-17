import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { DetectedService, ScanResult } from "../scanner/types.js";
import { generateTrainingRecord } from "./training-record.js";
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

describe("generateTrainingRecord", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when no services detected", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateTrainingRecord(scan), null);
  });

  // ── Basic generation ───────────────────────────────────────────────

  it("generates document when at least one service present", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["payment info"])] });
    const result = generateTrainingRecord(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Staff Data Protection Training Record"));
  });

  // ── Context values ─────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generateTrainingRecord(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "privacy@acme.com" };
    const result = generateTrainingRecord(scan, ctx)!;
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("uses placeholder contact email when no context", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses context DPO name", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", dpoName: "Jane Doe" };
    const result = generateTrainingRecord(scan, ctx)!;
    assert.ok(result.includes("Jane Doe"));
  });

  it("uses placeholder DPO name when no context", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(result.includes("[Data Protection Officer Name]"));
  });

  it("uses context DPO email", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", dpoEmail: "dpo@acme.com" };
    const result = generateTrainingRecord(scan, ctx)!;
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("falls back to contactEmail for DPO email when dpoEmail not provided", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "contact@acme.com" };
    const result = generateTrainingRecord(scan, ctx)!;
    // DPO email falls back to contactEmail — appears in certification and non-compliance sections
    assert.ok(result.includes("contact@acme.com"));
  });

  // ── Header ─────────────────────────────────────────────────────────

  it("includes GDPR Art. 39(1)(b) reference in header", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(result.includes("GDPR Art. 39(1)(b) Training Record"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes Codepliant attribution in header", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(result.includes("Codepliant"));
  });

  // ── Section 1: Purpose ─────────────────────────────────────────────

  it("includes purpose section", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(result.includes("## 1. Purpose"));
    assert.ok(result.includes("GDPR Article 39(1)(b)"));
    assert.ok(result.includes("awareness-raising and training"));
  });

  // ── Section 2: Training Schedule ───────────────────────────────────

  it("includes training schedule with standard rows", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(result.includes("## 2. Training Schedule"));
    assert.ok(result.includes("Onboarding Training"));
    assert.ok(result.includes("Annual Refresher"));
    assert.ok(result.includes("Breach Response Drill"));
    assert.ok(result.includes("DSAR Handling"));
    assert.ok(result.includes("Role-Specific Deep Dive"));
  });

  it("includes AI training row when AI services present", () => {
    const scan = makeScan({ services: [makeService("OpenAI", "ai", ["prompts"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(result.includes("AI & Data Ethics"));
    assert.ok(result.includes("AI/ML teams"));
  });

  it("omits AI training row when no AI services", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(!result.includes("AI & Data Ethics"));
  });

  it("includes PCI DSS training row when payment services present", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(result.includes("Payment Data Handling (PCI DSS)"));
  });

  it("omits PCI DSS training row when no payment services", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(!result.includes("Payment Data Handling (PCI DSS)"));
  });

  // ── Section 3: Core Training Topics ────────────────────────────────

  it("includes data protection basics topic", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(result.includes("### 3.1 Data Protection Basics"));
    assert.ok(result.includes("What constitutes personal data"));
    assert.ok(result.includes("six GDPR principles"));
    assert.ok(result.includes("Lawful bases for processing"));
    assert.ok(result.includes("Privacy by design"));
  });

  it("includes breach procedures topic", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(result.includes("### 3.2 Breach Procedures"));
    assert.ok(result.includes("72-hour supervisory authority notification"));
    assert.ok(result.includes("report within 4 hours to DPO"));
  });

  it("includes DSAR handling topic", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(result.includes("### 3.3 DSAR Handling"));
    assert.ok(result.includes("Recognising a Data Subject Access Request"));
    assert.ok(result.includes("1 month, extendable to 3 months"));
    assert.ok(result.includes("Escalation to the DPO"));
  });

  // ── Conditional role-specific topics ───────────────────────────────

  it("includes AI & Automated Decision-Making topic when AI detected", () => {
    const scan = makeScan({ services: [makeService("OpenAI", "ai", ["prompts"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(result.includes("### 3.4 AI & Automated Decision-Making"));
    assert.ok(result.includes("Transparency obligations for AI systems"));
    assert.ok(result.includes("EU AI Act risk classification"));
    assert.ok(result.includes("Bias detection"));
  });

  it("omits AI topic when no AI services", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(!result.includes("AI & Automated Decision-Making"));
  });

  it("includes Payment Data Protection topic when payment detected", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(result.includes("### 3.5 Payment Data Protection"));
    assert.ok(result.includes("PCI DSS fundamentals"));
    assert.ok(result.includes("Tokenisation and encryption"));
  });

  it("omits Payment topic when no payment services", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(!result.includes("Payment Data Protection"));
  });

  it("includes Analytics & Tracking topic when analytics detected", () => {
    const scan = makeScan({ services: [makeService("PostHog", "analytics", ["usage"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(result.includes("### 3.6 Analytics & Tracking"));
    assert.ok(result.includes("Cookie consent requirements"));
    assert.ok(result.includes("Anonymisation vs pseudonymisation"));
  });

  it("omits Analytics topic when no analytics services", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(!result.includes("Analytics & Tracking"));
  });

  it("includes Authentication & Access Data topic when auth detected", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth", ["creds"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(result.includes("### 3.7 Authentication & Access Data"));
    assert.ok(result.includes("Secure credential storage"));
    assert.ok(result.includes("Multi-factor authentication"));
    assert.ok(result.includes("Logging and audit trail"));
  });

  it("omits Auth topic when no auth services", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(!result.includes("Authentication & Access Data"));
  });

  it("includes all role-specific topics when all categories present", () => {
    const scan = makeScan({
      services: [
        makeService("OpenAI", "ai", ["prompts"]),
        makeService("Stripe", "payment", ["cards"]),
        makeService("PostHog", "analytics", ["usage"]),
        makeService("clerk", "auth", ["creds"]),
      ],
    });
    const result = generateTrainingRecord(scan)!;
    assert.ok(result.includes("### 3.4 AI & Automated Decision-Making"));
    assert.ok(result.includes("### 3.5 Payment Data Protection"));
    assert.ok(result.includes("### 3.6 Analytics & Tracking"));
    assert.ok(result.includes("### 3.7 Authentication & Access Data"));
  });

  // ── Section 4: Training Sign-Off Sheet ─────────────────────────────

  it("includes training sign-off sheet", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(result.includes("## 4. Training Sign-Off Sheet"));
    assert.ok(result.includes("Employee Name"));
    assert.ok(result.includes("Role/Department"));
    assert.ok(result.includes("Training Module"));
    assert.ok(result.includes("Signature"));
  });

  // ── Section 5: Annual Training Completion Tracker ──────────────────

  it("includes annual training completion tracker", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(result.includes("## 5. Annual Training Completion Tracker"));
    assert.ok(result.includes("Engineering"));
    assert.ok(result.includes("Product"));
    assert.ok(result.includes("Customer Support"));
    assert.ok(result.includes("Completion Rate"));
  });

  it("includes current year in training tracker", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateTrainingRecord(scan)!;
    const year = new Date().getFullYear();
    assert.ok(result.includes(`### ${year} Training Year`));
  });

  // ── Section 6: Training Materials & Resources ──────────────────────

  it("includes training materials and resources section", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(result.includes("## 6. Training Materials & Resources"));
    assert.ok(result.includes("Data Protection Handbook"));
    assert.ok(result.includes("Breach Response Playbook"));
    assert.ok(result.includes("DSAR Process Guide"));
    assert.ok(result.includes("INCIDENT_RESPONSE_PLAN.md"));
  });

  // ── Section 7: Assessment & Certification ──────────────────────────

  it("includes assessment and certification section", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(result.includes("## 7. Assessment & Certification"));
    assert.ok(result.includes("Passing score"));
    assert.ok(result.includes("80%"));
    assert.ok(result.includes("Retake policy"));
  });

  it("includes DPO details in certification table", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", dpoName: "Jane Doe", dpoEmail: "dpo@acme.com" };
    const result = generateTrainingRecord(scan, ctx)!;
    assert.ok(result.includes("Jane Doe"));
    assert.ok(result.includes("dpo@acme.com"));
    assert.ok(result.includes("Acme"));
  });

  // ── Section 8: Non-Compliance ──────────────────────────────────────

  it("includes non-compliance section", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(result.includes("## 8. Non-Compliance"));
    assert.ok(result.includes("Temporary suspension of access"));
    assert.ok(result.includes("Formal written warning"));
    assert.ok(result.includes("Disciplinary action"));
  });

  it("includes DPO email in non-compliance section", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", dpoEmail: "dpo@acme.com" };
    const result = generateTrainingRecord(scan, ctx)!;
    assert.ok(result.includes("DPO (dpo@acme.com) will provide monthly compliance reports"));
  });

  // ── Footer ─────────────────────────────────────────────────────────

  it("includes disclaimer footer", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateTrainingRecord(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("Review with your DPO and legal counsel"));
  });
});
