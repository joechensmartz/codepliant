import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { generateComplianceSummaryEmail } from "./compliance-summary-email.js";
import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext, GeneratedDocument } from "./index.js";

function makeScan(overrides?: Partial<ScanResult>): ScanResult {
  return {
    projectName: "test-project",
    projectPath: "/tmp/test",
    scannedAt: "2026-01-01T00:00:00.000Z",
    services: [],
    dataCategories: [],
    complianceNeeds: [],
    ...overrides,
  };
}

function makeService(name: string, category: string) {
  return {
    name,
    category: category as any,
    evidence: [],
    dataCollected: [],
  };
}

function makeDoc(filename: string): GeneratedDocument {
  return { name: filename.replace(".md", ""), filename, content: "content" };
}

describe("generateComplianceSummaryEmail", () => {
  it("returns null when no services are detected", () => {
    const scan = makeScan();
    const result = generateComplianceSummaryEmail(scan);
    assert.strictEqual(result, null);
  });

  it("returns a string when services are present", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generateComplianceSummaryEmail(scan);
    assert.ok(typeof result === "string");
    assert.ok(result!.length > 0);
  });

  it("includes company name from context", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
    };
    const result = generateComplianceSummaryEmail(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses default placeholders without context", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generateComplianceSummaryEmail(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
    assert.ok(result.includes("[Data Protection Officer Name]"));
  });

  it("includes DPO name and email from context", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      dpoName: "Jane Doe",
      dpoEmail: "dpo@acme.com",
    };
    const result = generateComplianceSummaryEmail(scan, ctx)!;
    assert.ok(result.includes("Jane Doe"));
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("includes executive summary with service count", () => {
    const scan = makeScan({
      services: [
        makeService("Stripe", "payment"),
        makeService("Sentry", "monitoring"),
      ],
    });
    const result = generateComplianceSummaryEmail(scan)!;
    assert.ok(result.includes("## Executive Summary"));
    assert.ok(result.includes("**2 third-party service(s)**"));
  });

  it("includes document count in summary", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const docs = [makeDoc("PRIVACY_POLICY.md"), makeDoc("TERMS_OF_SERVICE.md")];
    const result = generateComplianceSummaryEmail(scan, undefined, docs)!;
    assert.ok(result.includes("**2 compliance document(s)**"));
  });

  it("shows Grade A when all critical docs present", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const docs = [
      makeDoc("PRIVACY_POLICY.md"),
      makeDoc("TERMS_OF_SERVICE.md"),
      makeDoc("SECURITY.md"),
    ];
    const result = generateComplianceSummaryEmail(scan, undefined, docs)!;
    assert.ok(result.includes("**A** (Green)"));
  });

  it("shows lower grade when critical docs missing", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const docs: GeneratedDocument[] = [];
    const result = generateComplianceSummaryEmail(scan, undefined, docs)!;
    assert.ok(result.includes("**D** (Red)"));
  });

  it("includes service inventory table by category", () => {
    const scan = makeScan({
      services: [
        makeService("Stripe", "payment"),
        makeService("Auth0", "auth"),
      ],
    });
    const result = generateComplianceSummaryEmail(scan)!;
    assert.ok(result.includes("## Service Inventory"));
    assert.ok(result.includes("Payment"));
    assert.ok(result.includes("Auth"));
    assert.ok(result.includes("Stripe"));
    assert.ok(result.includes("Auth0"));
  });

  it("includes AI risk when AI services detected", () => {
    const scan = makeScan({
      services: [makeService("OpenAI", "ai")],
    });
    const result = generateComplianceSummaryEmail(scan)!;
    assert.ok(result.includes("AI/ML Services Detected"));
    assert.ok(result.includes("OpenAI"));
    assert.ok(result.includes("EU AI Act"));
  });

  it("includes payment risk when payment services detected", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generateComplianceSummaryEmail(scan)!;
    assert.ok(result.includes("Payment Processing"));
    assert.ok(result.includes("PCI DSS"));
  });

  it("includes high service count risk when many services", () => {
    const services = Array.from({ length: 12 }, (_, i) =>
      makeService(`Service${i}`, "monitoring"),
    );
    const scan = makeScan({ services });
    const result = generateComplianceSummaryEmail(scan)!;
    assert.ok(result.includes("High Service Count"));
  });

  it("includes analytics risk when analytics services detected", () => {
    const scan = makeScan({
      services: [makeService("Google Analytics", "analytics")],
    });
    const result = generateComplianceSummaryEmail(scan)!;
    assert.ok(result.includes("Analytics/Monitoring"));
    assert.ok(result.includes("Cookie consent"));
  });

  it("shows no critical risks when only basic services", () => {
    const scan = makeScan({
      services: [makeService("Auth0", "auth")],
    });
    const result = generateComplianceSummaryEmail(scan)!;
    assert.ok(result.includes("No critical compliance risks"));
  });

  it("includes action items section", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generateComplianceSummaryEmail(scan)!;
    assert.ok(result.includes("## Action Items"));
    assert.ok(result.includes("Review all generated compliance documents"));
    assert.ok(result.includes("legal counsel approve Privacy Policy"));
  });

  it("includes AI-specific action when AI present", () => {
    const scan = makeScan({
      services: [makeService("OpenAI", "ai")],
    });
    const result = generateComplianceSummaryEmail(scan)!;
    assert.ok(result.includes("AI Disclosure document for EU AI Act"));
  });

  it("includes payment-specific action when payment present", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generateComplianceSummaryEmail(scan)!;
    assert.ok(result.includes("PCI DSS compliance and DPA coverage"));
  });

  it("includes regulatory coverage table", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generateComplianceSummaryEmail(scan)!;
    assert.ok(result.includes("## Regulatory Coverage"));
    assert.ok(result.includes("GDPR (EU)"));
    assert.ok(result.includes("CCPA (California)"));
  });

  it("shows Covered for GDPR when privacy policy generated", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const docs = [makeDoc("PRIVACY_POLICY.md")];
    const result = generateComplianceSummaryEmail(scan, undefined, docs)!;
    // The GDPR row should say Covered
    const lines = result.split("\n");
    const gdprLine = lines.find((l) => l.includes("GDPR (EU)"));
    assert.ok(gdprLine);
    assert.ok(gdprLine!.includes("Covered"));
  });

  it("shows AI Act N/A when no AI services", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generateComplianceSummaryEmail(scan)!;
    assert.ok(result.includes("No AI services detected"));
  });

  it("includes jurisdiction information from context", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      jurisdictions: ["GDPR", "CCPA"],
    };
    const result = generateComplianceSummaryEmail(scan, ctx)!;
    assert.ok(result.includes("GDPR, CCPA"));
  });

  it("defaults jurisdictions when none specified", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generateComplianceSummaryEmail(scan)!;
    assert.ok(result.includes("GDPR, CCPA (default)"));
  });

  it("includes document inventory", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const docs = [makeDoc("PRIVACY_POLICY.md"), makeDoc("SECURITY.md")];
    const result = generateComplianceSummaryEmail(scan, undefined, docs)!;
    assert.ok(result.includes("## Document Inventory"));
    assert.ok(result.includes("`PRIVACY_POLICY.md`"));
    assert.ok(result.includes("`SECURITY.md`"));
  });

  it("includes next steps section", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generateComplianceSummaryEmail(scan)!;
    assert.ok(result.includes("## Next Steps"));
    assert.ok(result.includes("Immediate (this week)"));
    assert.ok(result.includes("Short-term (30 days)"));
  });

  it("includes distribution list", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generateComplianceSummaryEmail(scan)!;
    assert.ok(result.includes("## Distribution List"));
    assert.ok(result.includes("CEO / Founder"));
    assert.ok(result.includes("Board of Directors"));
  });

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({
      services: [makeService("Stripe", "payment")],
    });
    const result = generateComplianceSummaryEmail(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("should be reviewed by qualified legal counsel"));
  });
});
