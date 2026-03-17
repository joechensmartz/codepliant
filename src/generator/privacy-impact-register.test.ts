import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generatePrivacyImpactRegister } from "./privacy-impact-register.js";
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

describe("generatePrivacyImpactRegister", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generatePrivacyImpactRegister(scan, undefined), null);
  });

  // ── Generation with services ──────────────────────────────────────

  it("generates document with a single service", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result !== null);
    assert.ok(result.includes("Privacy Impact Register"));
  });

  it("generates document with multiple services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
      ],
    });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("Privacy Impact Register"));
  });

  // ── Context values ────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generatePrivacyImpactRegister(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context dpoName", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "a@a.com", dpoName: "Jane Doe" };
    const result = generatePrivacyImpactRegister(scan, ctx)!;
    assert.ok(result.includes("Jane Doe"));
  });

  it("uses placeholder dpoName when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("[Data Protection Officer Name]"));
  });

  it("uses context dpoEmail", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "a@a.com", dpoEmail: "dpo@test.com" };
    const result = generatePrivacyImpactRegister(scan, ctx)!;
    assert.ok(result.includes("dpo@test.com"));
  });

  it("falls back to contactEmail for dpoEmail", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "privacy@test.com" };
    const result = generatePrivacyImpactRegister(scan, ctx)!;
    assert.ok(result.includes("privacy@test.com"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes next review date one year from now", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    // The next review date should be about a year in the future
    const now = new Date();
    const nextYear = now.getFullYear() + 1;
    assert.ok(result.includes(String(nextYear)));
  });

  // ── Header section ────────────────────────────────────────────────

  it("includes header with organization info", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com", dpoName: "Jane Doe", dpoEmail: "dpo@acme.com" };
    const result = generatePrivacyImpactRegister(scan, ctx)!;
    assert.ok(result.includes("**Organization:** Acme Corp"));
    assert.ok(result.includes("**Register Owner:** Jane Doe (dpo@acme.com)"));
    assert.ok(result.includes("**Last Updated:**"));
    assert.ok(result.includes("**Next Full Review:**"));
  });

  // ── Disclaimer ────────────────────────────────────────────────────

  it("includes disclaimer about automated generation", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("auto-generated"));
    assert.ok(result.includes("GDPR Art. 35(1)"));
  });

  // ── Purpose section ───────────────────────────────────────────────

  it("includes Purpose section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("## 1. Purpose"));
    assert.ok(result.includes("GDPR Art. 35(1)"));
    assert.ok(result.includes("GDPR Art. 5(2)"));
  });

  // ── DPIA Triggers section ─────────────────────────────────────────

  it("includes DPIA Triggers section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("## 2. When a DPIA Is Required"));
    assert.ok(result.includes("GDPR Art. 35(3)"));
    assert.ok(result.includes("profiling"));
    assert.ok(result.includes("special categories"));
    assert.ok(result.includes("Automated decision-making"));
  });

  // ── Assessment Summary (conditional by service category) ──────────

  it("includes AI assessment when AI services present", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("AI Systems Processing Assessment"));
    assert.ok(result.includes("DPIA"));
    assert.ok(result.includes("High"));
  });

  it("includes payment assessment when payment services present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("Payment Data Processing Assessment"));
    assert.ok(result.includes("High"));
  });

  it("includes analytics assessment when analytics services present", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("Analytics & Tracking Assessment"));
    assert.ok(result.includes("Medium"));
  });

  it("includes auth assessment when auth services present", () => {
    const scan = makeScan({ services: [makeService("@clerk/nextjs", "auth")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("User Authentication & Identity Assessment"));
  });

  it("includes monitoring assessment when monitoring services present", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("Application Monitoring Assessment"));
    assert.ok(result.includes("Low"));
  });

  it("always includes General Personal Data Processing Assessment", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("General Personal Data Processing Assessment"));
  });

  it("excludes AI assessment when no AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(!result.includes("AI Systems Processing Assessment"));
  });

  it("excludes analytics assessment when no analytics services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(!result.includes("Analytics & Tracking Assessment"));
  });

  // ── Cross-border assessment ───────────────────────────────────────

  it("includes cross-border assessment when multiple jurisdictions", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "a@a.com", jurisdictions: ["gdpr", "ccpa"] };
    const result = generatePrivacyImpactRegister(scan, ctx)!;
    assert.ok(result.includes("Cross-Border Data Transfer Assessment"));
  });

  it("includes cross-border assessment when 3+ services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
      ],
    });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("Cross-Border Data Transfer Assessment"));
  });

  it("excludes cross-border assessment with few services and single jurisdiction", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment"), makeService("openai", "ai")],
    });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "a@a.com", jurisdictions: ["gdpr"] };
    const result = generatePrivacyImpactRegister(scan, ctx)!;
    assert.ok(!result.includes("Cross-Border Data Transfer Assessment"));
  });

  // ── Detailed Assessment Records ───────────────────────────────────

  it("includes detailed AI assessment record", () => {
    const scan = makeScan({ services: [makeService("openai", "ai", ["prompts", "user inputs"])] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("AI Systems Processing"));
    assert.ok(result.includes("openai"));
    assert.ok(result.includes("prompts"));
    assert.ok(result.includes("Human oversight mechanism"));
  });

  it("includes detailed payment assessment record", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment", ["card data", "billing"])] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("Payment Data Processing"));
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("card data"));
    assert.ok(result.includes("PCI DSS compliance"));
  });

  it("includes detailed analytics assessment record", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics", ["ip address", "page views"])] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("Analytics & Tracking"));
    assert.ok(result.includes("posthog"));
    assert.ok(result.includes("ip address"));
    assert.ok(result.includes("Cookie consent mechanism"));
  });

  it("includes general processing assessment with data categories", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
      dataCategories: [
        { category: "Financial", description: "Payment data", sources: ["stripe"] },
        { category: "Personal", description: "User names", sources: ["auth"] },
      ],
    });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("Financial, Personal"));
  });

  // ── Risk Assessment Matrix ────────────────────────────────────────

  it("includes Risk Assessment Matrix", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("## 4. Risk Assessment Matrix"));
    assert.ok(result.includes("General data processing"));
  });

  it("includes AI risk in matrix when AI services present", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("AI-powered features"));
    assert.ok(result.includes("**Critical**"));
  });

  it("includes payment risk in matrix when payment services present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("Payment processing"));
    assert.ok(result.includes("**High**"));
  });

  it("includes analytics risk in matrix when analytics services present", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("User analytics/tracking"));
  });

  it("includes auth risk in matrix when auth services present", () => {
    const scan = makeScan({ services: [makeService("@clerk/nextjs", "auth")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("User authentication"));
  });

  it("includes monitoring risk in matrix when monitoring services present", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("Application monitoring"));
    assert.ok(result.includes("**Low**"));
  });

  // ── Services Inventory ────────────────────────────────────────────

  it("includes Third-Party Services Inventory", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["card data"]),
        makeService("openai", "ai", ["prompts"]),
      ],
    });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("## 5. Third-Party Services Inventory"));
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("openai"));
    assert.ok(result.includes("card data"));
    assert.ok(result.includes("prompts"));
  });

  it("marks AI and payment services as DPIA required", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    // stripe and openai rows should say "Yes", posthog should say "Review needed"
    // Filter to inventory table rows (lines starting with "| " that contain "| Pending |")
    const lines = result.split("\n").filter((l) => l.includes("| Pending |"));
    const stripeLine = lines.find((l) => l.includes("stripe"))!;
    assert.ok(stripeLine.includes("Yes"));
    const openaiLine = lines.find((l) => l.includes("openai"))!;
    assert.ok(openaiLine.includes("Yes"));
    const posthogLine = lines.find((l) => l.includes("posthog"))!;
    assert.ok(posthogLine.includes("Review needed"));
  });

  it("deduplicates services in inventory", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    const inventorySection = result.split("## 5. Third-Party Services Inventory")[1]!.split("## 6.")[0]!;
    const stripeLines = inventorySection.split("\n").filter((l) => l.includes("| stripe |"));
    assert.strictEqual(stripeLines.length, 1);
  });

  // ── Outcome Tracking ──────────────────────────────────────────────

  it("includes Outcome Tracking section with status definitions", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("## 6. Outcome Tracking"));
    assert.ok(result.includes("**Pending**"));
    assert.ok(result.includes("**Approved**"));
    assert.ok(result.includes("**Rejected**"));
    assert.ok(result.includes("**Approved with Conditions**"));
  });

  // ── Review History ────────────────────────────────────────────────

  it("includes Review History section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("## 7. Review History"));
    assert.ok(result.includes("Register created"));
    assert.ok(result.includes("Codepliant (automated)"));
  });

  // ── Supervisory Authority Consultation ────────────────────────────

  it("includes Supervisory Authority Consultation section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("## 8. Supervisory Authority Consultation"));
    assert.ok(result.includes("GDPR Art. 36"));
    assert.ok(result.includes("residual high risks"));
  });

  // ── Contact section ───────────────────────────────────────────────

  it("includes Contact section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "privacy@test.com", dpoName: "Jane Doe", dpoEmail: "dpo@test.com" };
    const result = generatePrivacyImpactRegister(scan, ctx)!;
    assert.ok(result.includes("## 9. Contact"));
    assert.ok(result.includes("Jane Doe (dpo@test.com)"));
    assert.ok(result.includes("privacy@test.com"));
  });

  // ── Footer ────────────────────────────────────────────────────────

  it("includes Codepliant attribution in footer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("Codepliant"));
  });

  it("includes legal counsel disclaimer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(result.includes("legal counsel"));
  });

  // ── Assessment IDs ────────────────────────────────────────────────

  it("generates assessment IDs with date stamp", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    // ID format: DPIA-YYYYMMDD-AI
    assert.ok(/DPIA-\d{8}-AI/.test(result));
  });

  it("generates PIA ID for general assessment", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactRegister(scan, undefined)!;
    assert.ok(/PIA-\d{8}-GENERAL/.test(result));
  });

  // ── Comprehensive test ────────────────────────────────────────────

  it("generates comprehensive register with all service categories", () => {
    const scan = makeScan({
      services: [
        makeService("@clerk/nextjs", "auth", ["user profiles"]),
        makeService("stripe", "payment", ["card data", "billing"]),
        makeService("posthog", "analytics", ["page views", "clicks"]),
        makeService("openai", "ai", ["prompts", "responses"]),
        makeService("sentry", "monitoring", ["error data"]),
      ],
      dataCategories: [
        { category: "Personal", description: "User data", sources: ["auth"] },
        { category: "Financial", description: "Payment data", sources: ["stripe"] },
      ],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      dpoName: "Jane Doe",
      dpoEmail: "dpo@acme.com",
      jurisdictions: ["gdpr", "ccpa"],
    };
    const result = generatePrivacyImpactRegister(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("Jane Doe"));
    assert.ok(result.includes("dpo@acme.com"));
    assert.ok(result.includes("AI Systems Processing Assessment"));
    assert.ok(result.includes("Payment Data Processing Assessment"));
    assert.ok(result.includes("Analytics & Tracking Assessment"));
    assert.ok(result.includes("User Authentication & Identity Assessment"));
    assert.ok(result.includes("Application Monitoring Assessment"));
    assert.ok(result.includes("General Personal Data Processing Assessment"));
    assert.ok(result.includes("Cross-Border Data Transfer Assessment"));
    assert.ok(result.includes("## 4. Risk Assessment Matrix"));
    assert.ok(result.includes("## 5. Third-Party Services Inventory"));
    assert.ok(result.includes("## 6. Outcome Tracking"));
    assert.ok(result.includes("## 7. Review History"));
    assert.ok(result.includes("## 8. Supervisory Authority Consultation"));
    assert.ok(result.includes("## 9. Contact"));
  });
});
