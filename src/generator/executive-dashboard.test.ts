import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateExecutiveDashboard } from "./executive-dashboard.js";
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

describe("generateExecutiveDashboard", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateExecutiveDashboard(scan), null);
  });

  // ── Generation with services ──────────────────────────────────────

  it("generates dashboard with a single service", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateExecutiveDashboard(scan)!;
    assert.ok(result !== null);
    assert.ok(result.includes("Executive Compliance Dashboard"));
  });

  it("generates dashboard with multiple services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateExecutiveDashboard(scan)!;
    assert.ok(result.includes("Executive Compliance Dashboard"));
  });

  // ── Context values ────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generateExecutiveDashboard(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateExecutiveDashboard(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateExecutiveDashboard(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes project name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateExecutiveDashboard(scan)!;
    assert.ok(result.includes("test-project"));
  });

  // ── Regulatory Status section ─────────────────────────────────────

  it("includes Regulatory Status section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateExecutiveDashboard(scan)!;
    assert.ok(result.includes("## Regulatory Status"));
    assert.ok(result.includes("| Status | Regulation | Assessment | Summary |"));
  });

  it("assesses all five regulations", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateExecutiveDashboard(scan)!;
    assert.ok(result.includes("**GDPR**"));
    assert.ok(result.includes("**CCPA**"));
    assert.ok(result.includes("**EU AI Act**"));
    assert.ok(result.includes("**PCI DSS**"));
    assert.ok(result.includes("**HIPAA**"));
  });

  // ── GDPR assessment ───────────────────────────────────────────────

  it("GDPR shows yellow with EU jurisdiction", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "a@a.com", jurisdictions: ["GDPR"] };
    const result = generateExecutiveDashboard(scan, ctx)!;
    assert.ok(result.includes("**GDPR**"));
    // Should be yellow (In Progress or Action Required)
    const gdprLine = result.split("\n").find((l) => l.includes("**GDPR**"))!;
    assert.ok(gdprLine.includes("In Progress") || gdprLine.includes("Action Required"));
  });

  it("GDPR shows Action Required with many services and auth", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
        makeService("@clerk/nextjs", "auth"),
        makeService("resend", "email"),
      ],
    });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "a@a.com", jurisdictions: ["GDPR"] };
    const result = generateExecutiveDashboard(scan, ctx)!;
    const gdprLine = result.split("\n").find((l) => l.includes("**GDPR**"))!;
    assert.ok(gdprLine.includes("Action Required"));
  });

  // ── CCPA assessment ───────────────────────────────────────────────

  it("CCPA shows green when no analytics and no jurisdiction", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateExecutiveDashboard(scan)!;
    const ccpaLine = result.split("\n").find((l) => l.includes("**CCPA**"))!;
    assert.ok(ccpaLine.includes("Low Exposure"));
  });

  it("CCPA shows Action Required with analytics", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateExecutiveDashboard(scan)!;
    const ccpaLine = result.split("\n").find((l) => l.includes("**CCPA**"))!;
    assert.ok(ccpaLine.includes("Action Required"));
    assert.ok(ccpaLine.includes("Do Not Sell"));
  });

  // ── EU AI Act assessment ──────────────────────────────────────────

  it("EU AI Act shows Not Applicable without AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateExecutiveDashboard(scan)!;
    const aiActLine = result.split("\n").find((l) => l.includes("**EU AI Act**"))!;
    assert.ok(aiActLine.includes("Not Applicable"));
  });

  it("EU AI Act shows Transparency Required with AI services", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateExecutiveDashboard(scan)!;
    const aiActLine = result.split("\n").find((l) => l.includes("**EU AI Act**"))!;
    assert.ok(aiActLine.includes("Transparency Required"));
    assert.ok(aiActLine.includes("Art. 52"));
  });

  it("EU AI Act shows High Risk when aiRiskLevel is high", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "a@a.com", aiRiskLevel: "high" };
    const result = generateExecutiveDashboard(scan, ctx)!;
    const aiActLine = result.split("\n").find((l) => l.includes("**EU AI Act**"))!;
    assert.ok(aiActLine.includes("High Risk"));
  });

  // ── PCI DSS assessment ────────────────────────────────────────────

  it("PCI DSS shows Not Applicable without payment services", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateExecutiveDashboard(scan)!;
    const pciLine = result.split("\n").find((l) => l.includes("**PCI DSS**"))!;
    assert.ok(pciLine.includes("Not Applicable"));
  });

  it("PCI DSS shows Compliance Required with payment services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateExecutiveDashboard(scan)!;
    const pciLine = result.split("\n").find((l) => l.includes("**PCI DSS**"))!;
    assert.ok(pciLine.includes("Compliance Required"));
    assert.ok(pciLine.includes("stripe"));
  });

  // ── HIPAA assessment ──────────────────────────────────────────────

  it("HIPAA shows Not Applicable without health data indicators", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateExecutiveDashboard(scan)!;
    const hipaaLine = result.split("\n").find((l) => l.includes("**HIPAA**"))!;
    assert.ok(hipaaLine.includes("Not Applicable"));
  });

  it("HIPAA shows Action Required with HIPAA compliance need", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
      complianceNeeds: [
        { document: "HIPAA Compliance", reason: "Health data detected", priority: "required" },
      ],
    });
    const result = generateExecutiveDashboard(scan)!;
    const hipaaLine = result.split("\n").find((l) => l.includes("**HIPAA**"))!;
    assert.ok(hipaaLine.includes("Action Required"));
  });

  // ── Quick Stats section ───────────────────────────────────────────

  it("includes Quick Stats section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateExecutiveDashboard(scan)!;
    assert.ok(result.includes("## Quick Stats"));
    assert.ok(result.includes("Third-Party Data Processors"));
    assert.ok(result.includes("Data Categories Collected"));
    assert.ok(result.includes("Regulations: Action Required"));
    assert.ok(result.includes("Regulations: Compliant"));
  });

  it("counts data processors correctly", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("prisma", "database", ["user data"], false),
      ],
    });
    const result = generateExecutiveDashboard(scan)!;
    // stripe and posthog are data processors (isDataProcessor !== false), prisma is not
    assert.ok(result.includes("| Third-Party Data Processors | 2 |"));
  });

  it("counts data categories correctly", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
      dataCategories: [
        { category: "Personal", description: "User names", sources: ["auth"] },
        { category: "Financial", description: "Payment data", sources: ["stripe"] },
      ],
    });
    const result = generateExecutiveDashboard(scan)!;
    assert.ok(result.includes("| Data Categories Collected | 2 |"));
  });

  // ── Top Risks section ─────────────────────────────────────────────

  it("includes Top Risks section with 3+ data processors", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateExecutiveDashboard(scan)!;
    assert.ok(result.includes("## Top Risks"));
    assert.ok(result.includes("Data Breach Across Multiple Processors"));
  });

  it("includes AI risk when AI services present", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateExecutiveDashboard(scan)!;
    assert.ok(result.includes("Non-Compliant AI Deployment"));
    assert.ok(result.includes("EU AI Act"));
  });

  it("includes tracking consent risk when analytics present", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateExecutiveDashboard(scan)!;
    assert.ok(result.includes("Inadequate Cookie/Tracking Consent"));
  });

  it("includes payment risk when payment services present", () => {
    // Use only payment + 2 non-triggering services so payment risk fits within top 3
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("resend", "email"),
        makeService("@clerk/nextjs", "auth"),
      ],
    });
    const result = generateExecutiveDashboard(scan)!;
    assert.ok(result.includes("Payment Data Exposure"));
  });

  it("limits top risks to 3 maximum", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
        makeService("@clerk/nextjs", "auth"),
        makeService("resend", "email"),
      ],
    });
    const result = generateExecutiveDashboard(scan)!;
    // Count risk rows in Top Risks table (rows start with "| N |")
    const riskRows = result.split("\n").filter((l) => /^\| \d+ \|/.test(l));
    assert.ok(riskRows.length <= 3);
  });

  // ── Upcoming Deadlines section ────────────────────────────────────

  it("includes Upcoming Deadlines section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateExecutiveDashboard(scan)!;
    assert.ok(result.includes("## Upcoming Deadlines"));
    assert.ok(result.includes("Annual compliance review"));
  });

  it("includes GDPR DPA review deadline with GDPR jurisdiction", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "a@a.com", jurisdictions: ["GDPR"] };
    const result = generateExecutiveDashboard(scan, ctx)!;
    assert.ok(result.includes("Data Processing Agreements"));
  });

  it("includes EU AI Act deadline with AI services", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateExecutiveDashboard(scan)!;
    // Only if current date is before 2026-08-02
    if (new Date() < new Date("2026-08-02")) {
      assert.ok(result.includes("2026-08-02"));
      assert.ok(result.includes("EU AI Act"));
    }
  });

  it("includes PCI DSS deadline with payment services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateExecutiveDashboard(scan)!;
    assert.ok(result.includes("PCI DSS"));
    assert.ok(result.includes("Self-Assessment Questionnaire"));
  });

  it("includes quarterly privacy policy review", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateExecutiveDashboard(scan)!;
    assert.ok(result.includes("Quarterly privacy policy"));
  });

  // ── Recommended Actions section ───────────────────────────────────

  it("includes Recommended Actions section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateExecutiveDashboard(scan)!;
    assert.ok(result.includes("## Recommended Actions"));
    assert.ok(result.includes("quarterly compliance reviews"));
  });

  it("includes immediate action for red-status regulations", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
      complianceNeeds: [
        { document: "HIPAA Compliance", reason: "Health data", priority: "required" },
      ],
    });
    const result = generateExecutiveDashboard(scan)!;
    assert.ok(result.includes("**Immediate:**"));
    assert.ok(result.includes("red-status"));
  });

  it("includes short-term action for yellow-status regulations", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateExecutiveDashboard(scan)!;
    assert.ok(result.includes("**Short-term:**"));
  });

  // ── Footer ────────────────────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateExecutiveDashboard(scan)!;
    assert.ok(result.includes("Codepliant"));
  });

  it("includes professional review disclaimer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateExecutiveDashboard(scan)!;
    assert.ok(result.includes("qualified professional"));
  });

  it("includes links to related documents", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateExecutiveDashboard(scan)!;
    assert.ok(result.includes("COMPLIANCE_NOTES.md"));
    assert.ok(result.includes("RISK_REGISTER.md"));
    assert.ok(result.includes("COMPLIANCE_TIMELINE.md"));
  });

  // ── Comprehensive test ────────────────────────────────────────────

  it("generates comprehensive dashboard with all service categories", () => {
    const scan = makeScan({
      services: [
        makeService("@clerk/nextjs", "auth"),
        makeService("prisma", "database"),
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
        makeService("resend", "email"),
      ],
      dataCategories: [
        { category: "Personal", description: "User data", sources: ["auth"] },
        { category: "Financial", description: "Payment data", sources: ["stripe"] },
        { category: "Behavioral", description: "Analytics", sources: ["posthog"] },
      ],
      complianceNeeds: [
        { document: "Privacy Policy", reason: "User data", priority: "required" },
      ],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      jurisdictions: ["GDPR", "CCPA"],
    };
    const result = generateExecutiveDashboard(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("## Regulatory Status"));
    assert.ok(result.includes("## Quick Stats"));
    assert.ok(result.includes("## Top Risks"));
    assert.ok(result.includes("## Upcoming Deadlines"));
    assert.ok(result.includes("## Recommended Actions"));
  });
});
