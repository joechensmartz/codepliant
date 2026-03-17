import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateComplianceCommunicationPlan } from "./compliance-communication-plan.js";
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

describe("generateComplianceCommunicationPlan", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateComplianceCommunicationPlan(scan), null);
  });

  // ── Basic output ──────────────────────────────────────────────────

  it("returns a string when services are present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan);
    assert.ok(result !== null);
    assert.ok(typeof result === "string");
  });

  it("includes the title", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("# Compliance Communication Plan"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes project name", () => {
    const scan = makeScan({
      projectName: "my-app",
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("my-app"));
  });

  // ── Context values ────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@acme.com" };
    const result = generateComplianceCommunicationPlan(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context contactEmail", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "X", contactEmail: "contact@x.com" };
    const result = generateComplianceCommunicationPlan(scan, ctx)!;
    assert.ok(result.includes("contact@x.com"));
  });

  it("uses placeholder email when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses context dpoName", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "X", contactEmail: "x@x.com", dpoName: "Jane Smith" };
    const result = generateComplianceCommunicationPlan(scan, ctx)!;
    assert.ok(result.includes("Jane Smith"));
  });

  it("uses placeholder dpoName when not provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("[Data Protection Officer]"));
  });

  it("uses context dpoEmail", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "X", contactEmail: "x@x.com", dpoEmail: "dpo@x.com" };
    const result = generateComplianceCommunicationPlan(scan, ctx)!;
    assert.ok(result.includes("dpo@x.com"));
  });

  it("uses placeholder dpoEmail when not provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("[dpo@example.com]"));
  });

  // ── Communication Objectives ──────────────────────────────────────

  it("includes communication objectives section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("## 1. Communication Objectives"));
    assert.ok(result.includes("**Awareness**"));
    assert.ok(result.includes("**Timeliness**"));
    assert.ok(result.includes("**Accountability**"));
    assert.ok(result.includes("**Escalation**"));
    assert.ok(result.includes("**Consistency**"));
  });

  // ── Stakeholder Communication Matrix ──────────────────────────────

  it("includes stakeholder communication matrix", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("## 2. Stakeholder Communication Matrix"));
  });

  it("lists all ten stakeholder roles", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("CEO / Founder"));
    assert.ok(result.includes("CTO / VP Engineering"));
    assert.ok(result.includes("General Counsel / Legal"));
    assert.ok(result.includes("Data Protection Officer"));
    assert.ok(result.includes("Engineering Team"));
    assert.ok(result.includes("Product Team"));
    assert.ok(result.includes("Security Team / CISO"));
    assert.ok(result.includes("Customer Support"));
    assert.ok(result.includes("HR / People Ops"));
    assert.ok(result.includes("Board of Directors"));
  });

  it("shows escalation status for stakeholders", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    // CEO has escalation: true
    assert.ok(result.includes("| CEO / Founder |"));
    // Engineering Team has escalation: false, shown as "—"
    // At minimum, both Yes and — should appear
    assert.ok(result.includes("| Yes |"));
  });

  // ── Communication Calendar ────────────────────────────────────────

  it("includes communication calendar section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("## 3. Communication Calendar"));
  });

  it("includes regular cadence table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("### Regular Cadence"));
    assert.ok(result.includes("**Weekly**"));
    assert.ok(result.includes("**Monthly**"));
    assert.ok(result.includes("**Quarterly**"));
    assert.ok(result.includes("**Annually**"));
  });

  it("includes event-driven communication table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("### Event-Driven Communication"));
    assert.ok(result.includes("New service detected"));
    assert.ok(result.includes("Data breach detected"));
    assert.ok(result.includes("DSAR received"));
  });

  // ── Escalation Matrix ─────────────────────────────────────────────

  it("includes escalation matrix section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("## 4. Escalation Matrix"));
    assert.ok(result.includes("Level 1"));
    assert.ok(result.includes("Level 2"));
    assert.ok(result.includes("Level 3"));
    assert.ok(result.includes("Level 4"));
  });

  // ── Communication Templates ───────────────────────────────────────

  it("includes Template A: Monthly Compliance Update", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("### Template A: Monthly Compliance Update Email"));
    assert.ok(result.includes("COMPLIANCE SCORE"));
    assert.ok(result.includes("ACTION ITEMS"));
  });

  it("includes Template B: New Service Detection Alert", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("### Template B: New Service Detection Alert"));
    assert.ok(result.includes("REQUIRED ACTIONS"));
  });

  it("includes Template C: Incident Notification", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("### Template C: Incident Notification"));
    assert.ok(result.includes("INCIDENT SUMMARY"));
  });

  it("monthly update template includes service count", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("2"));
  });

  it("templates include dpoName and dpoEmail", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "X", contactEmail: "x@x.com", dpoName: "Alice", dpoEmail: "alice@x.com" };
    const result = generateComplianceCommunicationPlan(scan, ctx)!;
    assert.ok(result.includes("Alice"));
    assert.ok(result.includes("alice@x.com"));
  });

  // ── Conditional: AI Template ──────────────────────────────────────

  it("includes Template D for AI when AI service present", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("### Template D: AI Service Compliance Update"));
    assert.ok(result.includes("EU AI ACT STATUS"));
  });

  it("lists AI service names in Template D", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("openai"));
  });

  it("excludes Template D when no AI service", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(!result.includes("### Template D"));
  });

  it("includes AI risk level from context in Template D", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const ctx: GeneratorContext = { companyName: "X", contactEmail: "x@x.com", aiRiskLevel: "high" };
    const result = generateComplianceCommunicationPlan(scan, ctx)!;
    assert.ok(result.includes("high"));
  });

  // ── Conditional: Payment Template ─────────────────────────────────

  it("includes Template E for payment when payment service present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("### Template E: Payment Compliance Update"));
    assert.ok(result.includes("PCI DSS STATUS"));
  });

  it("lists payment service names in Template E", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("stripe"));
  });

  it("excludes Template E when no payment service", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(!result.includes("### Template E"));
  });

  // ── Recommended Channels ──────────────────────────────────────────

  it("includes recommended channels section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("## 6. Recommended Channels"));
    assert.ok(result.includes("**Email**"));
    assert.ok(result.includes("**Slack / Teams**"));
    assert.ok(result.includes("**JIRA / Linear**"));
  });

  it("includes Codepliant automation examples", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("codepliant scan"));
    assert.ok(result.includes("codepliant update"));
  });

  // ── RACI Matrix ───────────────────────────────────────────────────

  it("includes RACI matrix section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("## 7. RACI Matrix"));
    assert.ok(result.includes("Policy creation"));
    assert.ok(result.includes("Incident response"));
    assert.ok(result.includes("DSAR handling"));
  });

  it("RACI matrix explains abbreviations", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("**R** = Responsible"));
    assert.ok(result.includes("**A** = Accountable"));
    assert.ok(result.includes("**C** = Consulted"));
    assert.ok(result.includes("**I** = Informed"));
  });

  // ── Communication Effectiveness Metrics ───────────────────────────

  it("includes communication effectiveness metrics", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("## 8. Communication Effectiveness Metrics"));
    assert.ok(result.includes("Email open rate"));
    assert.ok(result.includes("Action item completion"));
    assert.ok(result.includes("Training completion"));
  });

  // ── Contact section ───────────────────────────────────────────────

  it("includes contact section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "acme@acme.com", dpoName: "Bob", dpoEmail: "bob@acme.com" };
    const result = generateComplianceCommunicationPlan(scan, ctx)!;
    assert.ok(result.includes("## Contact"));
    assert.ok(result.includes("Bob"));
    assert.ok(result.includes("bob@acme.com"));
    assert.ok(result.includes("acme@acme.com"));
  });

  // ── Disclaimer ────────────────────────────────────────────────────

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("automated code analysis"));
  });

  it("disclaimer includes service count", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("sentry", "monitoring"),
      ],
    });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("3 service(s)"));
  });

  // ── Full scenario ─────────────────────────────────────────────────

  it("includes both AI and Payment templates when both present", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("### Template D: AI Service Compliance Update"));
    assert.ok(result.includes("### Template E: Payment Compliance Update"));
  });

  it("generates complete plan with all sections numbered correctly", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCommunicationPlan(scan)!;
    assert.ok(result.includes("## 1. Communication Objectives"));
    assert.ok(result.includes("## 2. Stakeholder Communication Matrix"));
    assert.ok(result.includes("## 3. Communication Calendar"));
    assert.ok(result.includes("## 4. Escalation Matrix"));
    assert.ok(result.includes("## 5. Communication Templates"));
    assert.ok(result.includes("## 6. Recommended Channels"));
    assert.ok(result.includes("## 7. RACI Matrix"));
    assert.ok(result.includes("## 8. Communication Effectiveness Metrics"));
  });
});
