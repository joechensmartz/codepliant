import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateTransferImpactAssessment } from "./international-transfer-impact.js";
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
    jurisdiction: "eu",
    ...overrides,
  };
}

// ── Null guards ──────────────────────────────────────────────────────

describe("generateTransferImpactAssessment — null guards", () => {
  it("returns null when no context provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    assert.strictEqual(generateTransferImpactAssessment(scan), null);
  });

  it("returns null when jurisdiction is not EU", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ jurisdiction: "usa" });
    assert.strictEqual(generateTransferImpactAssessment(scan, ctx), null);
  });

  it("returns null when no US-based services detected", () => {
    const svc = makeService("custom-eu-service", "other");
    const scan = makeScan({ services: [svc] });
    assert.strictEqual(generateTransferImpactAssessment(scan, makeCtx()), null);
  });

  it("returns null when no services at all", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateTransferImpactAssessment(scan, makeCtx()), null);
  });

  it("returns null for non-data-processor US services", () => {
    const svc = makeService("stripe", "payment");
    (svc as any).isDataProcessor = false;
    const scan = makeScan({ services: [svc] });
    assert.strictEqual(generateTransferImpactAssessment(scan, makeCtx()), null);
  });
});

// ── EU jurisdiction detection ───────────────────────────────────────

describe("generateTransferImpactAssessment — EU jurisdiction", () => {
  it("recognises 'eu' jurisdiction", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateTransferImpactAssessment(scan, makeCtx({ jurisdiction: "eu" }));
    assert.ok(result !== null);
  });

  it("recognises 'gdpr' jurisdiction", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateTransferImpactAssessment(scan, makeCtx({ jurisdiction: "gdpr" }));
    assert.ok(result !== null);
  });

  it("recognises 'germany' jurisdiction", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateTransferImpactAssessment(scan, makeCtx({ jurisdiction: "germany" }));
    assert.ok(result !== null);
  });

  it("recognises 'france' jurisdiction", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateTransferImpactAssessment(scan, makeCtx({ jurisdiction: "france" }));
    assert.ok(result !== null);
  });

  it("recognises 'european union' jurisdiction", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateTransferImpactAssessment(scan, makeCtx({ jurisdiction: "european union" }));
    assert.ok(result !== null);
  });

  it("recognises 'eea' jurisdiction", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateTransferImpactAssessment(scan, makeCtx({ jurisdiction: "eea" }));
    assert.ok(result !== null);
  });

  it("recognises EU in jurisdictions array", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ jurisdiction: undefined, jurisdictions: ["eu", "usa"] });
    const result = generateTransferImpactAssessment(scan, ctx);
    assert.ok(result !== null);
  });

  it("is case-insensitive for jurisdiction", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateTransferImpactAssessment(scan, makeCtx({ jurisdiction: "GDPR" }));
    assert.ok(result !== null);
  });
});

// ── Basic generation ────────────────────────────────────────────────

describe("generateTransferImpactAssessment — basic generation", () => {
  it("generates document with title", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("# Transfer Impact Assessment"));
  });

  it("includes Schrems II reference", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("Schrems II"));
  });

  it("includes GDPR Chapter V reference", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("GDPR Chapter V"));
  });

  it("includes date in ISO format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes United States as importing country", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("United States"));
  });
});

// ── Context values ──────────────────────────────────────────────────

describe("generateTransferImpactAssessment — context values", () => {
  it("uses company name from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateTransferImpactAssessment(scan, makeCtx({ companyName: "TestCo" }))!;
    assert.ok(result.includes("TestCo"));
  });

  it("uses contact email from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateTransferImpactAssessment(scan, makeCtx({ contactEmail: "dpo@test.com" }))!;
    assert.ok(result.includes("dpo@test.com"));
  });

  it("uses DPO name from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateTransferImpactAssessment(scan, makeCtx({ dpoName: "Jane DPO" }))!;
    assert.ok(result.includes("Jane DPO"));
  });

  it("uses placeholders when no context values", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateTransferImpactAssessment(scan, { companyName: "", contactEmail: "", jurisdiction: "eu" } as any)!;
    // Should still generate — the function uses || fallback
    assert.ok(typeof result === "string");
  });
});

// ── US-based service detection ──────────────────────────────────────

describe("generateTransferImpactAssessment — US services", () => {
  it("detects stripe as US-based", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("stripe"));
  });

  it("detects openai as US-based", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("openai"));
  });

  it("detects @sentry/node as US-based", () => {
    const scan = makeScan({ services: [makeService("@sentry/node", "monitoring")] });
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("@sentry/node"));
  });

  it("detects multiple US services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("@sentry/node", "monitoring"),
      ],
    });
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("openai"));
    assert.ok(result.includes("@sentry/node"));
  });

  it("shows correct service count", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("| **Number of US-based Services** | 2 |"));
  });
});

// ── Sections ────────────────────────────────────────────────────────

describe("generateTransferImpactAssessment — sections", () => {
  const scan = makeScan({ services: [makeService("stripe", "payment", ["payment data", "email"])] });

  it("includes assessment overview section", () => {
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("## 1. Assessment Overview"));
  });

  it("includes US-based services table", () => {
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("## 2. US-Based Services Identified"));
    assert.ok(result.includes("| Service | Category |"));
  });

  it("includes legal framework assessment", () => {
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("## 3. Legal Framework Assessment"));
    assert.ok(result.includes("### 3.1 EU-US Data Privacy Framework"));
    assert.ok(result.includes("### 3.2 Standard Contractual Clauses"));
    assert.ok(result.includes("### 3.3 Supplementary Measures"));
  });

  it("includes supplementary measures checklist", () => {
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("Encryption in transit"));
    assert.ok(result.includes("Encryption at rest"));
    assert.ok(result.includes("Pseudonymization"));
    assert.ok(result.includes("Data minimization"));
    assert.ok(result.includes("- [ ]"));
  });

  it("includes US surveillance law assessment", () => {
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("## 4. US Surveillance Law Assessment"));
    assert.ok(result.includes("FISA Section 702"));
    assert.ok(result.includes("Executive Order 14086"));
  });

  it("includes per-service assessment", () => {
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("## 5. Per-Service Transfer Assessment"));
    assert.ok(result.includes("### stripe"));
  });

  it("includes SCC checklist", () => {
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("## 6. Standard Contractual Clauses Checklist"));
  });

  it("includes recommendations", () => {
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("## 7. Recommendations"));
  });

  it("includes review schedule", () => {
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("## 8. Review Schedule"));
    assert.ok(result.includes("Full TIA Review"));
  });
});

// ── Risk assessment by category ─────────────────────────────────────

describe("generateTransferImpactAssessment — risk assessment", () => {
  it("assigns High risk to payment services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("Risk Level: **High**"));
  });

  it("assigns High risk to AI services", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("Risk Level: **High**"));
  });

  it("assigns Medium risk to analytics services", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("Risk Level: **Medium**"));
  });

  it("assigns Low risk to monitoring services", () => {
    const scan = makeScan({ services: [makeService("@sentry/node", "monitoring")] });
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("Risk Level: **Low**"));
  });

  it("assigns Medium-High risk to storage services", () => {
    const scan = makeScan({ services: [makeService("@aws-sdk/client-s3", "storage")] });
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("Risk Level: **Medium-High**"));
  });

  it("assigns High per-service risk for sensitive data", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data", "financial records"])],
    });
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("| **Risk Level** | High |"));
  });
});

// ── DPF reference ───────────────────────────────────────────────────

describe("generateTransferImpactAssessment — DPF references", () => {
  it("references DPF adequacy decision", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("C(2023) 4745"));
  });

  it("references dataprivacyframework.gov", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("dataprivacyframework.gov"));
  });

  it("references Data Protection Review Court", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("Data Protection Review Court"));
  });
});

// ── Footer and disclaimer ───────────────────────────────────────────

describe("generateTransferImpactAssessment — footer", () => {
  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("Codepliant"));
  });

  it("includes legal review disclaimer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("does not constitute legal advice"));
  });

  it("includes DPO review note", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateTransferImpactAssessment(scan, makeCtx())!;
    assert.ok(result.includes("Data Protection Officer"));
  });
});
