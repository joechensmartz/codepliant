import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { generateDataSubjectRequestLog } from "./data-subject-request-log.js";
import type { ScanResult } from "../scanner/types.js";
import type { GeneratorContext } from "./index.js";

function makeService(
  name: string,
  category: "ai" | "payment" | "analytics" | "auth" | "email" | "monitoring" | "database" | "other",
  dataCollected: string[] = ["test data"],
) {
  return {
    name,
    category,
    evidence: [{ type: "dependency" as const, file: "package.json", detail: `${name} detected` }],
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

describe("generateDataSubjectRequestLog", () => {
  it("returns null when no services detected", () => {
    const result = generateDataSubjectRequestLog(makeScan());
    assert.strictEqual(result, null);
  });

  it("generates markdown with title", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataSubjectRequestLog(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Data Subject Access Request (DSAR) Log"));
  });

  it("uses company name from context", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "hi@acme.com" };
    const result = generateDataSubjectRequestLog(scan, ctx);
    assert.ok(result !== null);
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder when no company name provided", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataSubjectRequestLog(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses DPO email from context", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "hi@acme.com",
      dpoEmail: "dpo@acme.com",
    };
    const result = generateDataSubjectRequestLog(scan, ctx)!;
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("uses placeholder DPO email when not provided", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataSubjectRequestLog(scan)!;
    assert.ok(result.includes("[dpo@example.com]"));
  });

  it("includes GDPR request types by default (no jurisdictions)", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataSubjectRequestLog(scan)!;
    assert.ok(result.includes("ACC"));
    assert.ok(result.includes("ERA"));
    assert.ok(result.includes("REC"));
    assert.ok(result.includes("POR"));
    assert.ok(result.includes("RES"));
    assert.ok(result.includes("OBJ"));
    assert.ok(result.includes("Access (Art. 15)"));
    assert.ok(result.includes("Erasure (Art. 17)"));
  });

  it("excludes CCPA types when no CCPA jurisdiction", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "hi@acme.com",
      jurisdictions: ["gdpr"],
    };
    const result = generateDataSubjectRequestLog(scan, ctx)!;
    // CCPA types should not appear in the request type reference
    assert.ok(!result.includes("| OPT |"));
    assert.ok(!result.includes("| KNO |"));
    assert.ok(!result.includes("| DEL |"));
  });

  it("includes CCPA types when CCPA jurisdiction set", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "hi@acme.com",
      jurisdictions: ["ccpa"],
    };
    const result = generateDataSubjectRequestLog(scan, ctx)!;
    assert.ok(result.includes("OPT"));
    assert.ok(result.includes("KNO"));
    assert.ok(result.includes("DEL"));
    assert.ok(result.includes("Opt-Out (CCPA)"));
    assert.ok(result.includes("Right to Know (CCPA)"));
    assert.ok(result.includes("Right to Delete (CCPA)"));
  });

  it("shows CCPA/CPRA in applicable regulations header when CCPA jurisdiction", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "hi@acme.com",
      jurisdictions: ["gdpr", "ccpa"],
    };
    const result = generateDataSubjectRequestLog(scan, ctx)!;
    assert.ok(result.includes("GDPR"));
    assert.ok(result.includes("CCPA/CPRA"));
  });

  it("includes status values reference", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataSubjectRequestLog(scan)!;
    assert.ok(result.includes("## Status Values"));
    assert.ok(result.includes("Received"));
    assert.ok(result.includes("Verifying"));
    assert.ok(result.includes("In Progress"));
    assert.ok(result.includes("Extended"));
    assert.ok(result.includes("Completed"));
    assert.ok(result.includes("Denied"));
    assert.ok(result.includes("Closed"));
  });

  it("includes DSAR log template with blank rows", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataSubjectRequestLog(scan)!;
    assert.ok(result.includes("## DSAR Log"));
    assert.ok(result.includes("DSAR-001"));
    assert.ok(result.includes("DSAR-005"));
    assert.ok(result.includes("| ID | Date Received | Type |"));
  });

  it("includes identity verification log", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataSubjectRequestLog(scan)!;
    assert.ok(result.includes("## Identity Verification Log"));
    assert.ok(result.includes("Verification Method"));
  });

  it("includes data locations section with detected services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment information", "email"])],
    });
    const result = generateDataSubjectRequestLog(scan)!;
    assert.ok(result.includes("## Data Locations by Service"));
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("payment information, email"));
    assert.ok(result.includes("Export / Delete / Rectify"));
  });

  it("lists multiple services in data locations", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["usage data"]),
      ],
    });
    const result = generateDataSubjectRequestLog(scan)!;
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("posthog"));
  });

  it("excludes non-data-processor services from data locations", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        { ...makeService("eslint", "other"), isDataProcessor: false },
      ],
    });
    const result = generateDataSubjectRequestLog(scan)!;
    assert.ok(result.includes("stripe"));
    assert.ok(!result.includes("eslint"));
  });

  it("includes response tracking section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataSubjectRequestLog(scan)!;
    assert.ok(result.includes("## Response Tracking"));
    assert.ok(result.includes("Response Date"));
    assert.ok(result.includes("Exemptions Applied"));
  });

  it("includes deadline extensions section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataSubjectRequestLog(scan)!;
    assert.ok(result.includes("## Deadline Extensions"));
    assert.ok(result.includes("60-day extension"));
  });

  it("includes denial log section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataSubjectRequestLog(scan)!;
    assert.ok(result.includes("## Denial Log"));
    assert.ok(result.includes("manifestly unfounded"));
  });

  it("includes monthly DSAR summary template", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataSubjectRequestLog(scan)!;
    assert.ok(result.includes("## Monthly DSAR Summary"));
    assert.ok(result.includes("Total requests received"));
    assert.ok(result.includes("Completed within deadline"));
    assert.ok(result.includes("Average response time"));
  });

  it("includes CCPA metrics in monthly summary when CCPA jurisdiction", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "hi@acme.com",
      jurisdictions: ["ccpa"],
    };
    const result = generateDataSubjectRequestLog(scan, ctx)!;
    assert.ok(result.includes("Opt-out requests (OPT)"));
    assert.ok(result.includes("Right to Know requests (KNO)"));
    assert.ok(result.includes("Right to Delete requests (DEL)"));
  });

  it("excludes CCPA metrics from monthly summary when GDPR only", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "hi@acme.com",
      jurisdictions: ["gdpr"],
    };
    const result = generateDataSubjectRequestLog(scan, ctx)!;
    assert.ok(!result.includes("Opt-out requests (OPT)"));
  });

  it("includes quarterly DSAR report template", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataSubjectRequestLog(scan)!;
    assert.ok(result.includes("## Quarterly DSAR Report"));
    assert.ok(result.includes("Month 1"));
    assert.ok(result.includes("Month 2"));
    assert.ok(result.includes("Month 3"));
  });

  it("includes response deadlines reference with GDPR", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataSubjectRequestLog(scan)!;
    assert.ok(result.includes("## Response Deadlines Reference"));
    assert.ok(result.includes("| GDPR | 30 days"));
  });

  it("includes CCPA deadline in reference when CCPA jurisdiction", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "hi@acme.com",
      jurisdictions: ["ccpa"],
    };
    const result = generateDataSubjectRequestLog(scan, ctx)!;
    assert.ok(result.includes("| CCPA/CPRA | 45 days"));
  });

  it("includes UK GDPR deadline when GDPR jurisdiction", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataSubjectRequestLog(scan)!;
    assert.ok(result.includes("UK GDPR"));
  });

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataSubjectRequestLog(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("data protection officer or legal counsel"));
  });

  it("handles services with no dataCollected gracefully", () => {
    const scan = makeScan({
      services: [{
        name: "unknown-svc",
        category: "other" as const,
        evidence: [{ type: "dependency" as const, file: "package.json", detail: "detected" }],
        dataCollected: [],
      }],
    });
    const result = generateDataSubjectRequestLog(scan)!;
    assert.ok(result.includes("Various"));
  });
});
