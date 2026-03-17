import { describe, it } from "node:test";
import * as assert from "node:assert/strict";
import { generateExecutiveBriefing } from "./executive-briefing.js";
import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext, GeneratedDocument } from "./index.js";

function makeScan(overrides?: Partial<ScanResult>): ScanResult {
  return {
    projectName: "test-project",
    projectPath: "/tmp/test",
    services: [
      { name: "Stripe", category: "payment", evidence: [{ type: "dependency", file: "package.json", detail: "stripe" }], dataCollected: ["payment info"] },
      { name: "OpenAI", category: "ai", evidence: [{ type: "import", file: "src/index.ts", detail: "openai" }], dataCollected: ["prompts"] },
      { name: "PostHog", category: "analytics", evidence: [{ type: "env_var", file: ".env", detail: "POSTHOG_KEY" }], dataCollected: ["usage data"] },
    ],
    dataCategories: [{ category: "personal", sources: ["email"] }],
    ...(overrides as any),
  };
}

function makeDocs(filenames?: string[]): GeneratedDocument[] {
  const defaults = [
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md", content: "..." },
    { name: "AI Disclosure", filename: "AI_DISCLOSURE.md", content: "..." },
    { name: "Cookie Policy", filename: "COOKIE_POLICY.md", content: "..." },
    { name: "DPA", filename: "DATA_PROCESSING_AGREEMENT.md", content: "..." },
    { name: "Security Policy", filename: "SECURITY.md", content: "..." },
  ];
  if (!filenames) return defaults;
  return filenames.map((f) => ({ name: f, filename: f, content: "..." }));
}

describe("generateExecutiveBriefing", () => {
  // ── Null guard ──────────────────────────────────────────────────────
  it("returns null when no services detected", () => {
    const scan = makeScan({ services: [] });
    const result = generateExecutiveBriefing(scan, undefined, [], { total: 0, grade: "F" });
    assert.equal(result, null);
  });

  // ── Basic generation ────────────────────────────────────────────────
  it("generates briefing with title and project name", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 85, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("# Executive Briefing"));
    assert.ok(result.includes("test-project"));
  });

  it("includes current date", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 85, grade: "A" });
    assert.ok(result);
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(today));
  });

  // ── Compliance Gauge ────────────────────────────────────────────────
  it("generates briefing with compliance gauge", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 85, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("COMPLIANCE GAUGE"));
    assert.ok(result.includes("85/100"));
  });

  it("shows gauge with STRONG label for score >= 80", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 80, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("STRONG"));
  });

  it("shows gauge with MODERATE label for score 60-79", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 65, grade: "C" });
    assert.ok(result);
    assert.ok(result.includes("MODERATE"));
  });

  it("shows gauge with NEEDS ATTENTION label for score 40-59", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 45, grade: "D" });
    assert.ok(result);
    assert.ok(result.includes("NEEDS ATTENTION"));
  });

  it("shows gauge with CRITICAL label for score < 40", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 20, grade: "F" });
    assert.ok(result);
    assert.ok(result.includes("CRITICAL"));
  });

  it("includes score/grade/status/documents/services in metric table", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 75, grade: "B" });
    assert.ok(result);
    assert.ok(result.includes("**Score**"));
    assert.ok(result.includes("75/100"));
    assert.ok(result.includes("**Grade**"));
    assert.ok(result.includes("B"));
    assert.ok(result.includes("**Status**"));
    assert.ok(result.includes("**Documents**"));
    assert.ok(result.includes("**Services**"));
  });

  // ── 3 Key Findings ─────────────────────────────────────────────────
  it("includes 3 key findings sections", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 75, grade: "B" });
    assert.ok(result);
    assert.ok(result.includes("### 1. Compliance Status"));
    assert.ok(result.includes("### 2. Top Risk"));
    assert.ok(result.includes("### 3. Recommended Action"));
  });

  // ── Status labels ──────────────────────────────────────────────────
  it("shows Strong status for score >= 80", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 90, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("Compliance Status: Strong"));
    assert.ok(result.includes("strong compliance posture"));
  });

  it("shows Moderate status for score 60-79", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 65, grade: "C" });
    assert.ok(result);
    assert.ok(result.includes("Compliance Status: Moderate"));
    assert.ok(result.includes("moderate compliance posture"));
  });

  it("shows Needs Attention status for score 40-59", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 50, grade: "D" });
    assert.ok(result);
    assert.ok(result.includes("Compliance Status: Needs Attention"));
    assert.ok(result.includes("compliance gaps requiring attention"));
  });

  it("shows Critical status for score < 40", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 30, grade: "F" });
    assert.ok(result);
    assert.ok(result.includes("Compliance Status: Critical"));
    assert.ok(result.includes("compliance gaps requiring attention"));
  });

  it("mentions document count and service count in strong status text", () => {
    const docs = makeDocs();
    const result = generateExecutiveBriefing(makeScan(), undefined, docs, { total: 85, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes(`${docs.length} compliance documents`));
    assert.ok(result.includes("3 third-party services"));
  });

  it("mentions gaps remaining in moderate status text", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 65, grade: "C" });
    assert.ok(result);
    assert.ok(result.includes("gaps remain"));
  });

  // ── Top Risk: AI without disclosure ────────────────────────────────
  it("identifies AI risk without disclosure as top risk", () => {
    const scan = makeScan();
    const docsNoAI = makeDocs(["PRIVACY_POLICY.md", "SECURITY.md"]);
    const result = generateExecutiveBriefing(scan, undefined, docsNoAI, { total: 70, grade: "B" });
    assert.ok(result);
    assert.ok(result.includes("AI Usage Without Disclosure"));
    assert.ok(result.includes("EU AI Act"));
    assert.ok(result.includes("Article 50"));
    assert.ok(result.includes("EUR 35 million"));
  });

  it("identifies AI regulatory compliance when disclosure exists", () => {
    const scan = makeScan();
    const docs = makeDocs();
    const result = generateExecutiveBriefing(scan, undefined, docs, { total: 70, grade: "B" });
    assert.ok(result);
    assert.ok(result.includes("AI Regulatory Compliance"));
    assert.ok(result.includes("ongoing monitoring"));
    assert.ok(result.includes("OpenAI"));
  });

  // ── Top Risk: Missing privacy policy ───────────────────────────────
  it("identifies missing privacy policy as top risk when no AI services", () => {
    const scan = makeScan({
      services: [
        { name: "Stripe", category: "payment", evidence: [{ type: "dependency", file: "package.json", detail: "stripe" }], dataCollected: ["payment info"] },
      ],
    });
    const docsNoPrivacy = makeDocs(["SECURITY.md"]);
    const result = generateExecutiveBriefing(scan, undefined, docsNoPrivacy, { total: 50, grade: "D" });
    assert.ok(result);
    assert.ok(result.includes("Missing Privacy Policy"));
    assert.ok(result.includes("GDPR"));
    assert.ok(result.includes("EUR 20 million"));
  });

  // ── Top Risk: Payment data handling ────────────────────────────────
  it("identifies payment data handling as risk when no AI and privacy policy exists", () => {
    const scan = makeScan({
      services: [
        { name: "Stripe", category: "payment", evidence: [{ type: "dependency", file: "package.json", detail: "stripe" }], dataCollected: ["payment info"] },
      ],
    });
    const docs = makeDocs(["PRIVACY_POLICY.md"]);
    const result = generateExecutiveBriefing(scan, undefined, docs, { total: 60, grade: "C" });
    assert.ok(result);
    assert.ok(result.includes("Payment Data Handling"));
    assert.ok(result.includes("PCI DSS"));
    assert.ok(result.includes("Stripe"));
  });

  // ── Top Risk: Default third-party data sharing ─────────────────────
  it("falls back to third-party data sharing risk when no AI, privacy policy exists, no payment", () => {
    const scan = makeScan({
      services: [
        { name: "PostHog", category: "analytics", evidence: [{ type: "env_var", file: ".env", detail: "POSTHOG_KEY" }], dataCollected: ["usage data"] },
      ],
    });
    const docs = makeDocs(["PRIVACY_POLICY.md"]);
    const result = generateExecutiveBriefing(scan, undefined, docs, { total: 60, grade: "C" });
    assert.ok(result);
    assert.ok(result.includes("Third-Party Data Sharing"));
    assert.ok(result.includes("Data Processing Agreements"));
    assert.ok(result.includes("GDPR Art. 28"));
  });

  // ── Recommended Action based on score ──────────────────────────────
  it("recommends remediation program for score < 40", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 30, grade: "F" });
    assert.ok(result);
    assert.ok(result.includes("Initiate Compliance Remediation Program"));
    assert.ok(result.includes("Immediate"));
  });

  it("recommends closing high-priority gaps for score 40-59", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 50, grade: "D" });
    assert.ok(result);
    assert.ok(result.includes("Close High-Priority Gaps"));
    assert.ok(result.includes("30 days"));
  });

  it("recommends strengthening posture for score 60-79", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 70, grade: "B" });
    assert.ok(result);
    assert.ok(result.includes("Strengthen Compliance Posture"));
    assert.ok(result.includes("60 days"));
  });

  it("recommends maintain and monitor for score >= 80", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 85, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("Maintain and Monitor"));
    assert.ok(result.includes("12 months"));
  });

  it("includes timeline in recommended action", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 30, grade: "F" });
    assert.ok(result);
    assert.ok(result.includes("**Timeline:**"));
  });

  // ── Context values ─────────────────────────────────────────────────
  it("uses company name from context", () => {
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "privacy@acme.com" };
    const result = generateExecutiveBriefing(makeScan(), ctx, makeDocs(), { total: 80, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when context not provided", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 80, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("[Your Company Name]"));
  });

  // ── At a Glance table ──────────────────────────────────────────────
  it("includes At a Glance table", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 80, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("At a Glance"));
    assert.ok(result.includes("Privacy & Data Protection"));
    assert.ok(result.includes("Information Security"));
    assert.ok(result.includes("Vendor Management"));
  });

  it("shows Privacy as Covered when 2+ privacy docs exist", () => {
    const docs = makeDocs(["PRIVACY_POLICY.md", "COOKIE_POLICY.md", "SECURITY.md"]);
    const result = generateExecutiveBriefing(makeScan(), undefined, docs, { total: 80, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("Privacy & Data Protection | Covered"));
  });

  it("shows Privacy as Gaps when fewer than 2 privacy docs", () => {
    const docs = makeDocs(["PRIVACY_POLICY.md", "SECURITY.md"]);
    const result = generateExecutiveBriefing(makeScan(), undefined, docs, { total: 80, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("Privacy & Data Protection | Gaps"));
  });

  it("shows Security as Covered when 2+ security docs exist", () => {
    const docs = makeDocs(["SECURITY.md", "INCIDENT_RESPONSE_PLAN.md", "ACCESS_CONTROL_POLICY.md"]);
    const result = generateExecutiveBriefing(makeScan(), undefined, docs, { total: 80, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("Information Security | Covered"));
  });

  it("shows Security as Gaps when fewer than 2 security docs", () => {
    const docs = makeDocs(["SECURITY.md"]);
    const result = generateExecutiveBriefing(makeScan(), undefined, docs, { total: 80, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("Information Security | Gaps"));
  });

  it("shows AI Governance row when AI services detected", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 80, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("AI Governance"));
  });

  it("omits AI Governance row when no AI services", () => {
    const scan = makeScan({
      services: [
        { name: "Stripe", category: "payment", evidence: [{ type: "dependency", file: "package.json", detail: "stripe" }], dataCollected: ["payment info"] },
      ],
    });
    const result = generateExecutiveBriefing(scan, undefined, makeDocs(), { total: 80, grade: "A" });
    assert.ok(result);
    assert.ok(!result.includes("AI Governance"));
  });

  it("shows Vendor Management as Covered when subprocessor list exists", () => {
    const docs = makeDocs(["SUBPROCESSOR_LIST.md"]);
    const result = generateExecutiveBriefing(makeScan(), undefined, docs, { total: 80, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("Vendor Management | Covered"));
  });

  it("shows Vendor Management as Gaps when no vendor docs", () => {
    const docs = makeDocs(["PRIVACY_POLICY.md"]);
    const result = generateExecutiveBriefing(makeScan(), undefined, docs, { total: 80, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("Vendor Management | Gaps"));
  });

  // ── Services Overview ──────────────────────────────────────────────
  it("includes services overview grouped by category", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 80, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("Services Overview"));
    assert.ok(result.includes("**payment:**"));
    assert.ok(result.includes("Stripe"));
    assert.ok(result.includes("**ai:**"));
    assert.ok(result.includes("OpenAI"));
    assert.ok(result.includes("**analytics:**"));
    assert.ok(result.includes("PostHog"));
  });

  it("shows correct service and category counts", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 80, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("**3 third-party services**"));
    assert.ok(result.includes("**3 categories**"));
  });

  it("deduplicates services by name", () => {
    const scan = makeScan({
      services: [
        { name: "Stripe", category: "payment", evidence: [{ type: "dependency", file: "package.json", detail: "stripe" }], dataCollected: ["payment info"] },
        { name: "Stripe", category: "payment", evidence: [{ type: "import", file: "src/pay.ts", detail: "stripe" }], dataCollected: ["payment info"] },
      ],
    });
    const result = generateExecutiveBriefing(scan, undefined, makeDocs(), { total: 80, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("**1 third-party services**"));
  });

  // ── Disclaimer ─────────────────────────────────────────────────────
  it("includes disclaimer footer", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 80, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("does not constitute legal advice"));
    assert.ok(result.includes("Codepliant"));
  });

  // ── Missing score graceful handling ────────────────────────────────
  it("handles missing score gracefully", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs());
    assert.ok(result);
    assert.ok(result.includes("0/100"));
    assert.ok(result.includes("N/A"));
  });

  it("shows Critical status when score defaults to 0", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs());
    assert.ok(result);
    assert.ok(result.includes("Compliance Status: Critical"));
  });

  // ── Dollar impact ──────────────────────────────────────────────────
  it("includes dollar impact in top risk section", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 70, grade: "B" });
    assert.ok(result);
    assert.ok(result.includes("**Potential exposure:**"));
  });

  it("shows EUR 35 million for AI risk exposure", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 70, grade: "B" });
    assert.ok(result);
    assert.ok(result.includes("EUR 35 million"));
  });

  // ── Score boundary tests ───────────────────────────────────────────
  it("score of exactly 80 results in Strong status", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 80, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("Compliance Status: Strong"));
  });

  it("score of exactly 60 results in Moderate status", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 60, grade: "C" });
    assert.ok(result);
    assert.ok(result.includes("Compliance Status: Moderate"));
  });

  it("score of exactly 40 results in Needs Attention status", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 40, grade: "D" });
    assert.ok(result);
    assert.ok(result.includes("Compliance Status: Needs Attention"));
  });

  it("score of 39 results in Critical status", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 39, grade: "F" });
    assert.ok(result);
    assert.ok(result.includes("Compliance Status: Critical"));
  });

  // ── HTML container ─────────────────────────────────────────────────
  it("wraps header in centered div", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, makeDocs(), { total: 80, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("<div align=\"center\">"));
    assert.ok(result.includes("</div>"));
  });

  // ── Multiple payment services ──────────────────────────────────────
  it("lists multiple payment service names in risk description", () => {
    const scan = makeScan({
      services: [
        { name: "Stripe", category: "payment", evidence: [{ type: "dependency", file: "package.json", detail: "stripe" }], dataCollected: ["payment info"] },
        { name: "Square", category: "payment", evidence: [{ type: "dependency", file: "package.json", detail: "square" }], dataCollected: ["payment info"] },
      ],
    });
    const docs = makeDocs(["PRIVACY_POLICY.md"]);
    const result = generateExecutiveBriefing(scan, undefined, docs, { total: 60, grade: "C" });
    assert.ok(result);
    assert.ok(result.includes("Stripe"));
    assert.ok(result.includes("Square"));
    assert.ok(result.includes("2 payment service(s)"));
  });

  // ── Empty docs array ───────────────────────────────────────────────
  it("handles empty docs array", () => {
    const result = generateExecutiveBriefing(makeScan(), undefined, [], { total: 50, grade: "D" });
    assert.ok(result);
    assert.ok(result.includes("0"));
  });

  // ── Single service ─────────────────────────────────────────────────
  it("works with single service", () => {
    const scan = makeScan({
      services: [
        { name: "Sentry", category: "monitoring", evidence: [{ type: "dependency", file: "package.json", detail: "@sentry/node" }], dataCollected: ["error data"] },
      ],
    });
    const result = generateExecutiveBriefing(scan, undefined, makeDocs(), { total: 70, grade: "B" });
    assert.ok(result);
    assert.ok(result.includes("1 third-party services"));
    assert.ok(result.includes("1 categories"));
  });
});
