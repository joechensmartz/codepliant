import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateTransparencyReport } from "./transparency-report.js";
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

describe("generateTransparencyReport", () => {
  // ── Always generates (no null return) ─────────────────────────────

  it("generates report even with no services", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(typeof result === "string");
    assert.ok(result.includes("Transparency Report"));
  });

  it("generates report with services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("Transparency Report"));
  });

  // ── Context values ────────────────────────────────────────────────

  it("uses company name from context", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx({ companyName: "TestCo Inc" });
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("TestCo Inc"));
  });

  it("uses contact email from context", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx({ contactEmail: "privacy@testco.com" });
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("privacy@testco.com"));
  });

  it("includes DPO email when provided in context", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx({ dpoEmail: "dpo@acme.com" });
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("dpo@acme.com"));
    assert.ok(result.includes("Data Protection Officer"));
  });

  it("omits DPO line when dpoEmail not provided", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(!result.includes("Data Protection Officer:"));
  });

  // ── Title and header ──────────────────────────────────────────────

  it("includes current year in title", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    const year = new Date().getFullYear();
    assert.ok(result.includes(`Transparency Report — ${year}`));
  });

  it("includes reporting period with current year", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    const year = new Date().getFullYear();
    assert.ok(result.includes(`January 1, ${year}`));
    assert.ok(result.includes(`December 31, ${year}`));
  });

  it("includes publication date placeholder", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("[Publication Date]"));
  });

  // ── Executive Summary ─────────────────────────────────────────────

  it("includes executive summary section", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("## Executive Summary"));
    assert.ok(result.includes("Total government data requests"));
    assert.ok(result.includes("Requests fully complied with"));
    assert.ok(result.includes("Requests challenged or denied"));
    assert.ok(result.includes("Content removal requests"));
    assert.ok(result.includes("User accounts affected"));
  });

  // ── Government & Authority Data Requests ──────────────────────────

  it("includes government data requests section", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("## Government & Authority Data Requests"));
    assert.ok(result.includes("### Overview"));
    assert.ok(result.includes("### Requests by Type"));
  });

  it("includes request types table", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("Subpoena"));
    assert.ok(result.includes("Court Order"));
    assert.ok(result.includes("Search Warrant"));
    assert.ok(result.includes("National Security Letter"));
    assert.ok(result.includes("Emergency Disclosure"));
    assert.ok(result.includes("International (MLAT)"));
    assert.ok(result.includes("Regulatory Inquiry"));
  });

  // ── Jurisdiction-conditional sections ─────────────────────────────

  it("includes GDPR jurisdiction when specified", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx({ jurisdictions: ["GDPR"] });
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("European Union (GDPR)"));
  });

  it("includes UK GDPR jurisdiction when specified", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx({ jurisdictions: ["UK GDPR"] });
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("United Kingdom"));
  });

  it("includes CCPA jurisdiction when specified", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx({ jurisdictions: ["CCPA"] });
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("United States (Federal)"));
    assert.ok(result.includes("United States (California/CCPA)"));
  });

  it("includes all jurisdictions when all specified", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx({ jurisdictions: ["GDPR", "UK GDPR", "CCPA"] });
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("European Union (GDPR)"));
    assert.ok(result.includes("United Kingdom"));
    assert.ok(result.includes("United States (California/CCPA)"));
  });

  it("includes Other jurisdiction row even without jurisdictions", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("| Other |"));
  });

  it("omits GDPR row when jurisdictions do not include GDPR", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx({ jurisdictions: ["CCPA"] });
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(!result.includes("European Union (GDPR)"));
  });

  // ── How We Process Requests ───────────────────────────────────────

  it("includes request processing procedure", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("Receipt & logging"));
    assert.ok(result.includes("Legal review"));
    assert.ok(result.includes("Narrowing"));
    assert.ok(result.includes("User notification"));
    assert.ok(result.includes("Documentation"));
  });

  // ── Content Removal Requests ──────────────────────────────────────

  it("includes content removal requests section", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("## Content Removal Requests"));
    assert.ok(result.includes("DMCA / Copyright"));
    assert.ok(result.includes("Community Reports"));
  });

  // ── Data Subject Requests ─────────────────────────────────────────

  it("includes DSAR section", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("## Data Subject Requests (DSAR)"));
    assert.ok(result.includes("Access (Right to Know)"));
    assert.ok(result.includes("Deletion (Right to Erasure)"));
    assert.ok(result.includes("Portability"));
    assert.ok(result.includes("Rectification"));
    assert.ok(result.includes("Opt-Out of Sale"));
  });

  // ── Compliance Metrics ────────────────────────────────────────────

  it("includes compliance metrics section", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("## Compliance Metrics"));
    assert.ok(result.includes("### Third-Party Service Oversight"));
    assert.ok(result.includes("### Security & Incidents"));
    assert.ok(result.includes("### Privacy Program"));
  });

  it("reflects service count in compliance metrics", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
        makeService("openai", "ai", ["user prompts"]),
      ],
    });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("| Third-party services in use | 3 |"));
  });

  it("reflects service categories in compliance metrics", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("payment"));
    assert.ok(result.includes("analytics"));
  });

  it("shows 'none' when no services detected for categories", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("| Service categories | none |"));
  });

  it("shows DPA agreement count based on service count", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("[N] / 2"));
  });

  it("includes security incident metrics", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("Data breaches reported"));
    assert.ok(result.includes("Mean time to detect"));
    assert.ok(result.includes("Mean time to respond"));
    assert.ok(result.includes("Breach notification compliance rate"));
  });

  it("includes privacy program metrics", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("Privacy impact assessments"));
    assert.ok(result.includes("Employee privacy training"));
    assert.ok(result.includes("Consent collection compliance"));
  });

  // ── Warrant Canary ────────────────────────────────────────────────

  it("includes warrant canary section", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("## Warrant Canary"));
    assert.ok(result.includes("National Security Letters"));
    assert.ok(result.includes("Foreign Intelligence Surveillance Act"));
    assert.ok(result.includes("backdoors"));
  });

  it("warrant canary references company name", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx({ companyName: "TestCo" });
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("TestCo has not received"));
  });

  // ── Methodology ───────────────────────────────────────────────────

  it("includes methodology section", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("## Methodology"));
    assert.ok(result.includes("calendar year"));
    assert.ok(result.includes("formal legal process"));
  });

  // ── Contact ───────────────────────────────────────────────────────

  it("includes contact section", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("## Contact"));
    assert.ok(result.includes("legal@acme.com"));
  });

  // ── Disclaimer ────────────────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("Codepliant"));
  });

  it("includes legal review disclaimer", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(result.includes("reviewed by legal counsel"));
  });

  it("includes date in disclaimer", () => {
    const scan = makeScan({ services: [] });
    const ctx = makeCtx();
    const result = generateTransparencyReport(scan, ctx);
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });
});
