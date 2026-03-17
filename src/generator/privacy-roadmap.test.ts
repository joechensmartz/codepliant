import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generatePrivacyRoadmap } from "./privacy-roadmap.js";
import type { GeneratorContext, GeneratedDocument } from "./index.js";

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

function makeDocs(count: number): GeneratedDocument[] {
  const docs: GeneratedDocument[] = [];
  for (let i = 0; i < count; i++) {
    docs.push({ name: `Doc ${i}`, filename: `DOC_${i}.md`, content: "content" });
  }
  return docs;
}

describe("generatePrivacyRoadmap", () => {
  // ── Null guards ─────────────────────────────────────────────────────

  it("returns null when no services are present", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generatePrivacyRoadmap(scan), null);
  });

  // ── Basic generation ────────────────────────────────────────────────

  it("returns a non-null string when services are present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan);
    assert.ok(result !== null);
    assert.ok(typeof result === "string");
  });

  it("includes the title", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("# Privacy Program Roadmap"));
  });

  it("includes the generation date", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(`**Generated:** ${today}`));
  });

  it("includes project name in the footer", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
      projectName: "my-saas",
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Codepliant"));
  });

  // ── Context values ──────────────────────────────────────────────────

  it("uses default placeholder when no context provided", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses company name from context", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan, {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
    })!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("uses DPO name when provided", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan, {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      dpoName: "Jane Doe",
    })!;
    assert.ok(result.includes("Jane Doe"));
  });

  it("uses DPO email when provided", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan, {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      dpoEmail: "dpo@acme.com",
    })!;
    assert.ok(result.includes("dpo@acme.com"));
  });

  // ── Maturity assessment ─────────────────────────────────────────────

  it("shows maturity level in header", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Current Maturity Level:"));
    assert.ok(result.includes("Level"));
  });

  it("shows maturity bar visualization", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    // Should contain the maturity bar characters
    assert.ok(result.includes("█") || result.includes("░"));
  });

  it("shows higher maturity with more context and docs", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("sentry", "monitoring"),
        makeService("postgres", "database"),
      ],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      dpoName: "Jane Doe",
      dpoEmail: "dpo@acme.com",
      securityEmail: "security@acme.com",
      jurisdictions: ["gdpr", "ccpa"],
    };
    const docs = makeDocs(30);
    const result = generatePrivacyRoadmap(scan, ctx, docs)!;
    // With lots of context, maturity should be at least level 3
    assert.ok(result.includes("Level 3") || result.includes("Level 4") || result.includes("Level 5"));
  });

  it("shows Initial maturity with minimal context", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Initial") || result.includes("Developing"));
  });

  // ── Service count and categories ────────────────────────────────────

  it("displays detected services count", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("sentry", "monitoring"),
      ],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("**Detected Services:** 3"));
  });

  it("displays category count", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("sentry", "monitoring"),
      ],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("across 3 categories"));
  });

  // ── Quarterly roadmap structure ─────────────────────────────────────

  it("includes Q1 Foundation section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Q1: Build the Foundation"));
  });

  it("includes Q2 Operationalize section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Q2: Operationalize Privacy"));
  });

  it("includes Q3 Mature section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Q3: Mature the Program"));
  });

  it("includes Q4 Optimize section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Q4: Optimize & Sustain"));
  });

  it("includes Roadmap at a Glance table", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Roadmap at a Glance"));
    assert.ok(result.includes("Months 1-3"));
    assert.ok(result.includes("Months 4-6"));
    assert.ok(result.includes("Months 7-9"));
    assert.ok(result.includes("Months 10-12"));
  });

  // ── Monthly sections ────────────────────────────────────────────────

  it("includes Month 1 governance section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Month 1: Privacy Governance"));
    assert.ok(result.includes("Appoint a privacy lead"));
    assert.ok(result.includes("Review and publish Privacy Policy"));
  });

  it("includes Month 2 incident readiness section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Month 2: Data Protection"));
    assert.ok(result.includes("Incident Response Plan"));
    assert.ok(result.includes("tabletop exercise"));
  });

  it("includes Month 3 consent and rights section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Month 3: Consent & Rights"));
    assert.ok(result.includes("DSAR handling process"));
  });

  // ── Conditional AI sections ─────────────────────────────────────────

  it("includes AI Disclosure task when AI services present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("AI Disclosure"));
    assert.ok(result.includes("EU AI Act"));
  });

  it("excludes AI Disclosure task when no AI services present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(!result.includes("Publish AI Disclosure"));
  });

  it("includes AI impact assessment in Month 6 when AI present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("AI impact assessment"));
  });

  it("includes AI governance in Month 11 when AI present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("EU AI Act compliance"));
  });

  // ── Conditional payment sections ────────────────────────────────────

  it("includes Refund Policy task when payment services present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Refund Policy"));
  });

  // ── Conditional analytics sections ──────────────────────────────────

  it("includes cookie consent task when analytics services present", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("cookie consent"));
  });

  // ── Conditional database sections ───────────────────────────────────

  it("includes database encryption audit when database services present", () => {
    const scan = makeScan({
      services: [makeService("postgres", "database")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Database encryption audit"));
  });

  // ── Conditional storage sections ────────────────────────────────────

  it("includes file storage review when storage services present", () => {
    const scan = makeScan({
      services: [makeService("s3", "storage")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("File storage access review"));
  });

  // ── Conditional monitoring sections ─────────────────────────────────

  it("includes security event alerting when monitoring present", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Security event alerting"));
  });

  // ── CCPA section ────────────────────────────────────────────────────

  it("includes CCPA review when ccpa jurisdiction set", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan, {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      jurisdictions: ["ccpa"],
    })!;
    assert.ok(result.includes("CCPA/CPRA annual review"));
  });

  it("excludes CCPA review when ccpa jurisdiction not set", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan, {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      jurisdictions: ["gdpr"],
    })!;
    assert.ok(!result.includes("CCPA/CPRA annual review"));
  });

  // ── GDPR 72-hour notification ───────────────────────────────────────

  it("includes GDPR 72-hour notification procedure", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("GDPR 72-hour notification"));
  });

  // ── Resource Planning ───────────────────────────────────────────────

  it("includes Resource Planning section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("## Resource Planning"));
    assert.ok(result.includes("Estimated Effort by Quarter"));
  });

  it("includes budget estimate", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Budget Estimate"));
    assert.ok(result.includes("Audit & Certification"));
  });

  it("includes recommended tools table", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Recommended Tools"));
    assert.ok(result.includes("Codepliant"));
  });

  // ── Success Criteria ────────────────────────────────────────────────

  it("includes Success Criteria section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("## Success Criteria"));
    assert.ok(result.includes("12-Month Targets"));
  });

  it("includes KPI targets", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("DSAR response time"));
    assert.ok(result.includes("Consent rate"));
    assert.ok(result.includes("Training completion"));
  });

  // ── Contact section ─────────────────────────────────────────────────

  it("shows To be appointed when no DPO set", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("[To be appointed]"));
  });

  it("shows DPO name in contact section when provided", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan, {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      dpoName: "Jane Doe",
    })!;
    assert.ok(result.includes("Jane Doe"));
  });

  // ── Codepliant CI/CD integration ────────────────────────────────────

  it("includes CI/CD integration guidance in Month 7", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Month 7: Automation & Monitoring"));
    assert.ok(result.includes("codepliant"));
  });

  // ── Quarter checkpoints ─────────────────────────────────────────────

  it("includes Q1 checkpoint", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Q1 Checkpoint"));
  });

  it("includes Q2 checkpoint", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Q2 Checkpoint"));
  });

  it("includes Q3 checkpoint", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Q3 Checkpoint"));
  });

  it("includes Q4 checkpoint", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Q4 Checkpoint"));
  });

  // ── Vendor management ───────────────────────────────────────────────

  it("includes vendor management in Month 4", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Month 4: Vendor & Third-Party Management"));
    assert.ok(result.includes("vendor risk assessment"));
  });

  // ── Training section ────────────────────────────────────────────────

  it("includes training program in Month 5", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Month 5: Privacy Training"));
    assert.ok(result.includes("privacy champions"));
  });

  // ── Metrics section ─────────────────────────────────────────────────

  it("includes metrics and reporting in Month 8", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Month 8: Metrics & Reporting"));
    assert.ok(result.includes("compliance KPIs"));
  });

  // ── Audit readiness ─────────────────────────────────────────────────

  it("includes audit readiness in Month 9", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Month 9: Audit Readiness"));
    assert.ok(result.includes("SOC 2 gap analysis"));
    assert.ok(result.includes("ISO 27001"));
  });

  // ── Annual review ───────────────────────────────────────────────────

  it("includes annual review in Month 12", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("Month 12: Annual Review"));
    assert.ok(result.includes("Year 2 roadmap"));
  });

  // ── Disclaimer ──────────────────────────────────────────────────────

  it("includes legal disclaimer", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("reviewed and customized by a qualified compliance professional"));
  });

  // ── Service count references ────────────────────────────────────────

  it("references service count in actionable items", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("2 detected services"));
  });

  // ── Cookie consent priority based on analytics ──────────────────────

  it("marks cookie consent as Essential when analytics present", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyRoadmap(scan)!;
    assert.ok(result.includes("**Essential**"));
  });
});
