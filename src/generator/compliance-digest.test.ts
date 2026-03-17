import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateComplianceDigest } from "./compliance-digest.js";
import type { GeneratorContext, GeneratedDocument } from "./index.js";

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

function makeDoc(filename: string): GeneratedDocument {
  return { name: filename.replace(".md", ""), filename, content: "test" };
}

describe("generateComplianceDigest", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateComplianceDigest(scan), null);
  });

  // ── Generation with services ───────────────────────────────────────

  it("generates digest with a single service", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result !== null);
    assert.ok(result.includes("# Compliance Digest"));
  });

  it("generates digest with multiple services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("# Compliance Digest"));
    assert.ok(result.includes("| Services Detected | 3 |"));
  });

  // ── Context values ─────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generateComplianceDigest(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "privacy@acme.com" };
    const result = generateComplianceDigest(scan, ctx)!;
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("uses placeholder contact email when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses context DPO name and email", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      dpoName: "Jane DPO",
      dpoEmail: "dpo@acme.com",
    };
    const result = generateComplianceDigest(scan, ctx)!;
    assert.ok(result.includes("Jane DPO"));
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("uses placeholder DPO values when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("[Data Protection Officer Name]"));
    assert.ok(result.includes("[dpo@example.com]"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  // ── At a Glance section ────────────────────────────────────────────

  it("shows service count in At a Glance", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment"), makeService("openai", "ai")],
    });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("| Services Detected | 2 |"));
  });

  it("shows document count from docs param", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const docs = [makeDoc("PRIVACY_POLICY.md"), makeDoc("TERMS_OF_SERVICE.md")];
    const result = generateComplianceDigest(scan, undefined, docs)!;
    assert.ok(result.includes("| Documents Generated | 2 |"));
  });

  it("shows zero documents when no docs provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("| Documents Generated | 0 |"));
  });

  it("shows category count", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment"), makeService("openai", "ai")],
    });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("| Categories | 2 |"));
  });

  // ── Critical Doc Coverage ──────────────────────────────────────────

  it("calculates critical doc coverage as 100% when all present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const docs = [
      makeDoc("PRIVACY_POLICY.md"),
      makeDoc("TERMS_OF_SERVICE.md"),
      makeDoc("SECURITY.md"),
    ];
    const result = generateComplianceDigest(scan, undefined, docs)!;
    assert.ok(result.includes("| Critical Doc Coverage | 100% |"));
  });

  it("calculates critical doc coverage as 0% when none present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("| Critical Doc Coverage | 0% |"));
  });

  it("calculates partial critical doc coverage", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const docs = [makeDoc("PRIVACY_POLICY.md")];
    const result = generateComplianceDigest(scan, undefined, docs)!;
    assert.ok(result.includes("| Critical Doc Coverage | 33% |"));
  });

  // ── Service Inventory section ──────────────────────────────────────

  it("includes Current Service Inventory section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("## Current Service Inventory"));
  });

  it("shows services grouped by category", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("paddle", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("| Payment | 2 | stripe, paddle |"));
    assert.ok(result.includes("| Ai | 1 | openai |"));
  });

  it("sorts categories alphabetically", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateComplianceDigest(scan)!;
    const aiPos = result.indexOf("| Ai |");
    const paymentPos = result.indexOf("| Payment |");
    assert.ok(aiPos < paymentPos, "AI should come before Payment alphabetically");
  });

  // ── New Risks section ──────────────────────────────────────────────

  it("includes AI risk when AI services detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("AI/ML services detected"));
    assert.ok(result.includes("EU AI Act Art. 50"));
    assert.ok(result.includes("openai"));
  });

  it("includes payment risk when payment services detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("Payment processing active"));
    assert.ok(result.includes("PCI DSS"));
    assert.ok(result.includes("stripe"));
  });

  it("includes high service count risk when more than 10 services", () => {
    const services = Array.from({ length: 11 }, (_, i) =>
      makeService(`svc${i}`, "other"),
    );
    const scan = makeScan({ services });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("High service count (11)"));
  });

  it("does not include high service count risk when 10 or fewer services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateComplianceDigest(scan)!;
    assert.ok(!result.includes("High service count"));
  });

  it("includes analytics risk when analytics services detected", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("Analytics/monitoring active"));
    assert.ok(result.includes("cookie consent"));
  });

  it("includes monitoring risk in analytics risk", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("Analytics/monitoring active"));
    assert.ok(result.includes("sentry"));
  });

  it("shows no risks message when no special categories", () => {
    const scan = makeScan({ services: [makeService("other-svc", "other")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("No new risks identified this period"));
  });

  // ── Upcoming Deadlines section ─────────────────────────────────────

  it("includes Upcoming Deadlines section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("## Upcoming Deadlines"));
  });

  it("always includes quarterly review deadline", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("Quarterly compliance review"));
  });

  it("always includes GDPR DSAR deadline", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("DSAR response SLA"));
  });

  it("always includes breach notification deadline", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("72 hours from discovery"));
  });

  it("includes EU AI Act deadline when AI detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("EU AI Act Art. 50 compliance"));
  });

  it("does not include EU AI Act deadline without AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(!result.includes("EU AI Act Art. 50 compliance"));
  });

  // ── Action Items section ───────────────────────────────────────────

  it("includes Action Items section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("## Action Items"));
  });

  it("includes AI action items when AI detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("Review AI Disclosure and AI Model Card"));
  });

  it("does not include AI action items without AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(!result.includes("Review AI Disclosure and AI Model Card"));
  });

  it("includes payment action items when payment detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("PCI DSS self-assessment questionnaire"));
  });

  it("does not include payment action items without payment services", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(!result.includes("PCI DSS self-assessment questionnaire"));
  });

  it("always includes DSAR action item", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("Check DSAR log"));
  });

  it("always includes sub-processor action item", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("Update sub-processor list"));
  });

  // ── Document Status section ────────────────────────────────────────

  it("includes Document Status section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("## Document Status"));
  });

  it("shows critical docs as Missing when not provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("| PRIVACY_POLICY.md | **Missing** |"));
    assert.ok(result.includes("| TERMS_OF_SERVICE.md | **Missing** |"));
    assert.ok(result.includes("| SECURITY.md | **Missing** |"));
  });

  it("shows critical docs as Current when provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const docs = [
      makeDoc("PRIVACY_POLICY.md"),
      makeDoc("TERMS_OF_SERVICE.md"),
      makeDoc("SECURITY.md"),
    ];
    const result = generateComplianceDigest(scan, undefined, docs)!;
    assert.ok(result.includes("| PRIVACY_POLICY.md | Current |"));
    assert.ok(result.includes("| TERMS_OF_SERVICE.md | Current |"));
    assert.ok(result.includes("| SECURITY.md | Current |"));
  });

  it("includes AI_DISCLOSURE.md status when AI detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const docs = [makeDoc("AI_DISCLOSURE.md")];
    const result = generateComplianceDigest(scan, undefined, docs)!;
    assert.ok(result.includes("| AI_DISCLOSURE.md | Current |"));
  });

  it("shows AI_DISCLOSURE.md as Missing when AI detected but doc not present", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("| AI_DISCLOSURE.md | **Missing** |"));
  });

  it("does not include AI_DISCLOSURE.md row without AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(!result.includes("AI_DISCLOSURE.md"));
  });

  it("includes COOKIE_POLICY.md status when present in docs", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const docs = [makeDoc("COOKIE_POLICY.md")];
    const result = generateComplianceDigest(scan, undefined, docs)!;
    assert.ok(result.includes("| COOKIE_POLICY.md | Current |"));
  });

  it("does not include COOKIE_POLICY.md row when not in docs", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(!result.includes("COOKIE_POLICY.md"));
  });

  // ── How to Use section ─────────────────────────────────────────────

  it("includes How to Use This Digest section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("## How to Use This Digest"));
    assert.ok(result.includes("Weekly"));
    assert.ok(result.includes("Monthly"));
    assert.ok(result.includes("Quarterly"));
  });

  // ── Quick Commands section ─────────────────────────────────────────

  it("includes Quick Commands section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("## Quick Commands"));
    assert.ok(result.includes("codepliant go"));
    assert.ok(result.includes("codepliant check"));
    assert.ok(result.includes("codepliant dashboard"));
  });

  // ── Footer ─────────────────────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("Codepliant"));
  });

  it("includes review disclaimer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceDigest(scan)!;
    assert.ok(result.includes("reviewed by qualified personnel"));
  });

  // ── Comprehensive test ─────────────────────────────────────────────

  it("generates comprehensive digest with all service types and docs", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("sentry", "monitoring"),
        makeService("other-svc", "other"),
      ],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      dpoName: "Jane DPO",
      dpoEmail: "dpo@acme.com",
    };
    const docs = [
      makeDoc("PRIVACY_POLICY.md"),
      makeDoc("TERMS_OF_SERVICE.md"),
      makeDoc("SECURITY.md"),
      makeDoc("AI_DISCLOSURE.md"),
      makeDoc("COOKIE_POLICY.md"),
    ];
    const result = generateComplianceDigest(scan, ctx, docs)!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("privacy@acme.com"));
    assert.ok(result.includes("Jane DPO"));
    assert.ok(result.includes("dpo@acme.com"));
    assert.ok(result.includes("| Services Detected | 5 |"));
    assert.ok(result.includes("| Documents Generated | 5 |"));
    assert.ok(result.includes("| Critical Doc Coverage | 100% |"));
    // Risks
    assert.ok(result.includes("AI/ML services detected"));
    assert.ok(result.includes("Payment processing active"));
    assert.ok(result.includes("Analytics/monitoring active"));
    // Action items
    assert.ok(result.includes("Review AI Disclosure and AI Model Card"));
    assert.ok(result.includes("PCI DSS self-assessment questionnaire"));
    // Document statuses
    assert.ok(result.includes("| PRIVACY_POLICY.md | Current |"));
    assert.ok(result.includes("| AI_DISCLOSURE.md | Current |"));
    assert.ok(result.includes("| COOKIE_POLICY.md | Current |"));
  });
});
