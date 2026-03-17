import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generatePIA } from "./pia.js";
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

describe("generatePIA", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when no services are detected", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generatePIA(scan), null);
  });

  it("returns null when only payment services detected (no AI or analytics)", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"])],
    });
    assert.strictEqual(generatePIA(scan), null);
  });

  it("returns null when only auth services detected", () => {
    const scan = makeScan({
      services: [makeService("@clerk/nextjs", "auth", ["user profiles"])],
    });
    assert.strictEqual(generatePIA(scan), null);
  });

  it("returns null when only email services detected", () => {
    const scan = makeScan({
      services: [makeService("@sendgrid/mail", "email", ["email addresses"])],
    });
    assert.strictEqual(generatePIA(scan), null);
  });

  it("returns null when only monitoring services detected", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring", ["error logs"])],
    });
    assert.strictEqual(generatePIA(scan), null);
  });

  it("returns null when only database services detected", () => {
    const scan = makeScan({
      services: [makeService("prisma", "database", ["user records"])],
    });
    assert.strictEqual(generatePIA(scan), null);
  });

  it("returns null when only storage services detected", () => {
    const scan = makeScan({
      services: [makeService("@aws-sdk/client-s3", "storage", ["files"])],
    });
    assert.strictEqual(generatePIA(scan), null);
  });

  // ── Basic generation ──────────────────────────────────────────────

  it("generates PIA when AI services detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Privacy Impact Assessment"));
  });

  it("generates PIA when analytics services detected", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generatePIA(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Privacy Impact Assessment"));
  });

  it("generates PIA when both AI and analytics detected", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("Privacy Impact Assessment"));
  });

  it("includes the project name", () => {
    const scan = makeScan({
      projectName: "my-cool-app",
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("my-cool-app"));
  });

  it("includes a last-updated date", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("**Last updated:**"));
  });

  // ── Context / Company Info ─────────────────────────────────────────

  it("uses default company name when no context provided", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses provided company name from context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "hi@acme.com" };
    const result = generatePIA(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses provided contact email from context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "privacy@acme.com" };
    const result = generatePIA(scan, ctx)!;
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("uses provided DPO name from context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", dpoName: "Jane Doe" };
    const result = generatePIA(scan, ctx)!;
    assert.ok(result.includes("Jane Doe"));
  });

  it("uses provided DPO email from context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", dpoEmail: "dpo@acme.com" };
    const result = generatePIA(scan, ctx)!;
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("uses default DPO placeholder when not provided", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("[DPO Name]"));
    assert.ok(result.includes("[dpo@example.com]"));
  });

  // ── Section: Description of Processing ─────────────────────────────

  it("includes Description of Processing section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("Description of Processing"));
  });

  it("lists services in processing activities table", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("| openai |"));
    assert.ok(result.includes("| posthog |"));
  });

  it("includes data categories when present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
      dataCategories: [
        { category: "Personal Data", description: "User profile info", sources: ["auth"] },
      ],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("Categories of Personal Data"));
    assert.ok(result.includes("Personal Data"));
  });

  it("includes categories of data subjects", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("Categories of Data Subjects"));
    assert.ok(result.includes("End users"));
  });

  // ── Section: Necessity and Proportionality ─────────────────────────

  it("includes Necessity and Proportionality Assessment section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("Necessity and Proportionality Assessment"));
  });

  it("includes data minimization checklist for AI services", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("AI Services:"));
    assert.ok(result.includes("strictly necessary for the AI feature"));
  });

  it("includes data minimization checklist for analytics services", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("Analytics Services:"));
    assert.ok(result.includes("IP anonymization"));
  });

  // ── Section: Risk Assessment ────────────────────────────────────────

  it("includes Risk Assessment section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("Risk Assessment"));
  });

  it("includes risk methodology description", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("likelihood x impact"));
    assert.ok(result.includes("Unlikely"));
    assert.ok(result.includes("Negligible"));
  });

  it("includes risk assessment results table", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("Risk Assessment Results"));
    assert.ok(result.includes("AI processing via openai"));
  });

  it("calculates higher likelihood for AI services", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    // AI services get likelihood 3 (Likely)
    assert.ok(result.includes("3 (Likely)"));
  });

  it("calculates higher impact for payment data", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment card data", "credit card"]),
      ],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("4 (Maximum)"));
  });

  it("includes risk summary with counts", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("Risk Summary"));
    assert.ok(result.includes("| Critical |"));
    assert.ok(result.includes("| High |"));
    assert.ok(result.includes("| Medium |"));
    assert.ok(result.includes("| Low |"));
  });

  // ── Section: High-Risk Processing Triggers ─────────────────────────

  it("includes High-Risk Processing Triggers section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("High-Risk Processing Triggers"));
  });

  it("triggers AI-Powered Decision Making for AI services", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("AI-Powered Decision Making"));
    assert.ok(result.includes("**TRIGGERED**"));
  });

  it("triggers Large-Scale Profiling for analytics with user behavior", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["user behavior", "page views"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("Large-Scale Profiling"));
    // Should be triggered
    const matches = result.match(/\*\*TRIGGERED\*\*/g);
    assert.ok(matches !== null && matches.length >= 1);
  });

  it("triggers Systematic Monitoring for analytics with session recordings", () => {
    const scan = makeScan({
      services: [makeService("hotjar", "analytics", ["session recordings", "heatmaps"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("Systematic Monitoring"));
    assert.ok(result.includes("**TRIGGERED**"));
  });

  it("triggers Sensitive Data for biometric data", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["biometric data"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("Sensitive / Special Category Data"));
    assert.ok(result.match(/\*\*TRIGGERED\*\*/g)!.length >= 1);
  });

  it("does not trigger Large-Scale Profiling when no user behavior data", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generatePIA(scan)!;
    // Large-Scale Profiling should show "Not detected" since no user behavior
    assert.ok(result.includes("Large-Scale Profiling | **Not detected**"));
  });

  // ── Section: Data Flow Diagram Reference ──────────────────────────

  it("includes Data Flow Diagram reference section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("Data Flow Diagram"));
    assert.ok(result.includes("DATA_FLOW_MAP.md"));
  });

  // ── Section: Risk Mitigation Measures ──────────────────────────────

  it("includes Risk Mitigation Measures section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("Risk Mitigation Measures"));
  });

  it("includes AI-specific mitigation measures for AI services", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("input/output filtering"));
    assert.ok(result.includes("opt-out mechanisms"));
  });

  it("includes analytics-specific mitigation measures for analytics services", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("IP anonymization"));
    assert.ok(result.includes("cookie consent management"));
  });

  // ── Section: Consultation Requirements ────────────────────────────

  it("includes Consultation Requirements section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("Consultation Requirements"));
  });

  it("recommends DPA consultation when multiple high-risk triggers present", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["biometric data"]),
        makeService("hotjar", "analytics", ["session recordings", "user behavior", "heatmaps"]),
      ],
    });
    const result = generatePIA(scan)!;
    // Multiple triggers should recommend consultation
    assert.ok(result.includes("Consultation required:**"));
  });

  it("includes internal consultation checklist", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("Internal Consultation"));
    assert.ok(result.includes("Data Protection Officer"));
    assert.ok(result.includes("Legal / Compliance"));
    assert.ok(result.includes("Engineering / Development"));
  });

  // ── Section: Review and Monitoring ─────────────────────────────────

  it("includes Review and Monitoring section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("Review and Monitoring"));
    assert.ok(result.includes("At least annually"));
  });

  it("includes version history table", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("Version History"));
    assert.ok(result.includes("Initial DPIA based on code analysis"));
  });

  // ── Section: Approval and Sign-Off ─────────────────────────────────

  it("includes Approval and Sign-Off section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("Approval and Sign-Off"));
    assert.ok(result.includes("Data Controller"));
    assert.ok(result.includes("IT / Security Lead"));
  });

  // ── Disclaimer ────────────────────────────────────────────────────

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("does not constitute legal advice"));
  });

  // ── Legal Basis Mapping ───────────────────────────────────────────

  it("assigns Consent legal basis for AI services", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("Consent / Legitimate interest"));
  });

  it("assigns Consent legal basis for analytics services", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("| Consent |"));
  });

  it("assigns Contractual necessity for payment services", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
      ],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("Contractual necessity"));
  });

  // ── Edge Cases ────────────────────────────────────────────────────

  it("handles many services of mixed categories", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment data"]),
        makeService("posthog", "analytics", ["page views"]),
        makeService("@clerk/nextjs", "auth", ["user profiles"]),
        makeService("@sendgrid/mail", "email", ["email addresses"]),
        makeService("prisma", "database", ["user records"]),
        makeService("@sentry/node", "monitoring", ["error logs"]),
      ],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("Privacy Impact Assessment"));
    assert.ok(result.includes("openai"));
    assert.ok(result.includes("stripe"));
  });

  it("returns a non-empty string for valid input", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(typeof result === "string");
    assert.ok(result.length > 500);
  });

  it("includes GDPR Article 35 reference", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("Article 35"));
  });

  it("includes activity descriptions per category", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generatePIA(scan)!;
    assert.ok(result.includes("AI processing via openai"));
    assert.ok(result.includes("Behavioral analytics via posthog"));
  });
});
