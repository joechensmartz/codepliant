import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateComplianceBoardReport } from "./compliance-board-report.js";
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

describe("generateComplianceBoardReport", () => {
  // ── Always generates (never null) ──────────────────────────────────

  it("always returns a string even with no services", () => {
    const scan = makeScan({ services: [] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(typeof result === "string");
    assert.ok(result.includes("# Compliance Board Report"));
  });

  // ── Basic generation ───────────────────────────────────────────────

  it("generates report with services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("# Compliance Board Report"));
  });

  it("includes quarter and year in title", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    const year = new Date().getFullYear();
    assert.ok(result.includes(`${year}`));
    assert.ok(/Q[1-4]/.test(result));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes Confidential classification", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("Confidential"));
    assert.ok(result.includes("Board Use Only"));
  });

  it("includes project name in disclaimer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("test-project"));
  });

  // ── Context values ─────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generateComplianceBoardReport(scan, ctx);
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("[Your Company Name]"));
  });

  // ── Executive Summary ──────────────────────────────────────────────

  it("includes Executive Summary section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("## 1. Executive Summary"));
  });

  it("shows Key Metrics at a Glance table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("### Key Metrics at a Glance"));
    assert.ok(result.includes("**Overall Risk Level**"));
    assert.ok(result.includes("**Third-Party Services**"));
  });

  it("shows correct service count", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("clerk", "auth"),
      ],
    });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("| **Third-Party Services** | 3 |"));
  });

  it("shows AI services Yes when AI detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("| **AI Services Active** | Yes |"));
  });

  it("shows AI services No when no AI", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("| **AI Services Active** | No |"));
  });

  it("shows Payment Processing Yes when payment detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("| **Payment Processing** | Yes |"));
  });

  it("shows Payment Processing No when no payment", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("| **Payment Processing** | No |"));
  });

  // ── Risk levels ────────────────────────────────────────────────────

  it("shows Low risk for few services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("Low"));
  });

  it("shows Medium risk for 5+ services", () => {
    const services = Array.from({ length: 5 }, (_, i) =>
      makeService(`svc-${i}`, "other")
    );
    const scan = makeScan({ services });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("Medium"));
  });

  it("shows High risk for 10+ services or AI", () => {
    const services = Array.from({ length: 10 }, (_, i) =>
      makeService(`svc-${i}`, "other")
    );
    const scan = makeScan({ services });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("High"));
  });

  it("shows High risk for AI services", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("High"));
  });

  it("shows Critical risk for 15+ services", () => {
    const services = Array.from({ length: 15 }, (_, i) =>
      makeService(`svc-${i}`, "other")
    );
    const scan = makeScan({ services });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("Critical"));
  });

  it("shows Critical risk for AI + payment", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("Critical"));
  });

  // ── Board Action Items ─────────────────────────────────────────────

  it("includes Board Action Items", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("### Board Action Items"));
    assert.ok(result.includes("Review and approve updated compliance budget"));
  });

  it("includes AI action items when AI detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("Approve AI governance framework"));
    assert.ok(result.includes("EU AI Act readiness"));
  });

  it("includes PCI action item when payment detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("PCI DSS compliance status"));
  });

  it("does not include AI action items without AI", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(!result.includes("Approve AI governance framework"));
  });

  // ── Risk Heatmap ───────────────────────────────────────────────────

  it("includes Risk Heatmap section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("## 2. Risk Heatmap"));
    assert.ok(result.includes("Likelihood vs Impact Matrix"));
  });

  it("shows conditional AI misuse in heatmap", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("AI misuse"));
  });

  it("shows conditional Payment fraud in heatmap", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("Payment fraud"));
  });

  it("includes Risk by Service Category table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("### Risk by Service Category"));
    assert.ok(result.includes("| Category | Services | Risk Level | Key Concern |"));
  });

  it("shows AI category risk as High", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("AI / Machine Learning"));
    assert.ok(result.includes("EU AI Act"));
  });

  it("shows Payment category risk as High", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("Payment Processing"));
    assert.ok(result.includes("PCI DSS"));
  });

  it("shows Auth category risk as Medium", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("Authentication"));
    assert.ok(result.includes("Credential breach"));
  });

  it("shows Monitoring category risk as Low", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("Monitoring"));
  });

  // ── Regulatory Updates ─────────────────────────────────────────────

  it("includes Regulatory Updates section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("## 3. Regulatory Updates"));
    assert.ok(result.includes("### Active Regulations"));
  });

  it("shows GDPR by default", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("GDPR (EU)"));
    assert.ok(result.includes("UK GDPR"));
  });

  it("shows EU AI Act when AI detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("EU AI Act"));
    assert.ok(result.includes("Phasing in"));
  });

  it("shows PCI DSS when payment detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("PCI DSS v4.0"));
  });

  it("shows CCPA when ccpa in jurisdictions", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdictions: ["ccpa"] };
    const result = generateComplianceBoardReport(scan, ctx);
    assert.ok(result.includes("CCPA/CPRA"));
  });

  it("shows NIS2 and DORA always", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("NIS2 Directive"));
    assert.ok(result.includes("DORA"));
  });

  it("includes Upcoming Changes section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("### Upcoming Changes"));
    assert.ok(result.includes("EU AI Act enforcement timeline"));
  });

  // ── Budget vs Actual ───────────────────────────────────────────────

  it("includes Budget vs Actual section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("## 4. Budget vs Actual"));
  });

  it("shows Startup tier for few services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("Startup"));
  });

  it("shows Growth tier for 5+ services", () => {
    const services = Array.from({ length: 5 }, (_, i) =>
      makeService(`svc-${i}`, "other")
    );
    const scan = makeScan({ services });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("Growth"));
  });

  it("shows Enterprise tier for 15+ services", () => {
    const services = Array.from({ length: 15 }, (_, i) =>
      makeService(`svc-${i}`, "other")
    );
    const scan = makeScan({ services });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("Enterprise"));
  });

  it("shows Enterprise tier for AI + payment", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("Enterprise"));
  });

  it("includes budget line items", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("Legal & Advisory"));
    assert.ok(result.includes("Tools & Software"));
    assert.ok(result.includes("Training & Awareness"));
    assert.ok(result.includes("Audit & Certification"));
    assert.ok(result.includes("Insurance"));
  });

  // ── Compliance Program Status ──────────────────────────────────────

  it("includes Compliance Program Status section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("## 5. Compliance Program Status"));
  });

  it("includes Document Coverage table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("### Document Coverage"));
    assert.ok(result.includes("Privacy & Data Protection"));
    assert.ok(result.includes("Security"));
    assert.ok(result.includes("Legal"));
  });

  it("shows AI Compliance row when AI detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("AI Compliance"));
    assert.ok(result.includes("AI Disclosure"));
  });

  it("does not show AI Compliance row without AI", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(!result.includes("AI Compliance"));
  });

  it("includes Key Achievements and Planned sections", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("### Key Achievements This Quarter"));
    assert.ok(result.includes("### Planned for Next Quarter"));
  });

  // ── Incident & DSAR Summary ────────────────────────────────────────

  it("includes Incident & DSAR Summary section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("## 6. Incident & DSAR Summary"));
    assert.ok(result.includes("### Security Incidents"));
    assert.ok(result.includes("### Data Subject Access Requests"));
  });

  // ── Strategic Recommendations ──────────────────────────────────────

  it("includes Strategic Recommendations section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("## 7. Strategic Recommendations"));
  });

  it("always recommends automated compliance scanning", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("Maintain automated compliance scanning"));
    assert.ok(result.includes("Codepliant"));
  });

  it("recommends AI Act readiness when AI detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("Prioritize EU AI Act readiness"));
  });

  it("recommends vendor consolidation for 10+ services", () => {
    const services = Array.from({ length: 10 }, (_, i) =>
      makeService(`svc-${i}`, "other")
    );
    const scan = makeScan({ services });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("Vendor consolidation review"));
  });

  it("always recommends legal review cycle", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("Legal review cycle"));
  });

  it("always recommends board compliance training", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("Board compliance training"));
  });

  // ── Appendix: Detected Services ────────────────────────────────────

  it("includes Appendix with detected services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment", ["transaction data", "card info"])] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("## Appendix A: Detected Services"));
    assert.ok(result.includes("| 1 | stripe | payment |"));
  });

  it("truncates data collected to 3 items", () => {
    const scan = makeScan({
      services: [makeService("custom", "other", ["data1", "data2", "data3", "data4", "data5"])],
    });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("+2 more"));
  });

  it("limits appendix to 25 services", () => {
    const services = Array.from({ length: 30 }, (_, i) =>
      makeService(`svc-${i}`, "other")
    );
    const scan = makeScan({ services });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("... and 5 more services"));
  });

  // ── Disclaimer ─────────────────────────────────────────────────────

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceBoardReport(scan);
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("should be reviewed"));
  });

  // ── Comprehensive test ─────────────────────────────────────────────

  it("generates comprehensive report with all service categories", () => {
    const scan = makeScan({
      dataCategories: ["personal", "financial" as any, "behavioral" as any],
      services: [
        makeService("clerk", "auth"),
        makeService("prisma", "database"),
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
        makeService("resend", "email"),
        makeService("sentry", "monitoring"),
        makeService("s3", "storage"),
      ],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      jurisdictions: ["gdpr", "ccpa"],
    };
    const result = generateComplianceBoardReport(scan, ctx);

    // Header
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("Board of Directors"));

    // Service count
    assert.ok(result.includes("**8 third-party services**"));

    // All sections present
    assert.ok(result.includes("## 1. Executive Summary"));
    assert.ok(result.includes("## 2. Risk Heatmap"));
    assert.ok(result.includes("## 3. Regulatory Updates"));
    assert.ok(result.includes("## 4. Budget vs Actual"));
    assert.ok(result.includes("## 5. Compliance Program Status"));
    assert.ok(result.includes("## 6. Incident & DSAR Summary"));
    assert.ok(result.includes("## 7. Strategic Recommendations"));

    // Conditional sections active
    assert.ok(result.includes("AI Compliance"));
    assert.ok(result.includes("EU AI Act"));
    assert.ok(result.includes("PCI DSS"));
    assert.ok(result.includes("CCPA/CPRA"));

    // Risk categories
    assert.ok(result.includes("AI / Machine Learning"));
    assert.ok(result.includes("Payment Processing"));
    assert.ok(result.includes("Authentication"));
    assert.ok(result.includes("Analytics"));
    assert.ok(result.includes("Monitoring"));
  });
});
