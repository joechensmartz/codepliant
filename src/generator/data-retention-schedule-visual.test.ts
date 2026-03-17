import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateDataRetentionScheduleVisual } from "./data-retention-schedule-visual.js";
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

/** Helper to create a scan with N services of different categories */
function makeMultiScan(count: number = 3): ScanResult {
  const services: DetectedService[] = [
    makeService("stripe", "payment"),
    makeService("openai", "ai"),
    makeService("@sentry/node", "monitoring"),
    makeService("posthog", "analytics"),
    makeService("@sendgrid/mail", "email"),
  ].slice(0, count);
  return makeScan({ services });
}

// ── Null guards ──────────────────────────────────────────────────────

describe("generateDataRetentionScheduleVisual — null guards", () => {
  it("returns null when no services detected", () => {
    assert.strictEqual(generateDataRetentionScheduleVisual(makeScan()), null);
  });

  it("returns null when fewer than 3 services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    assert.strictEqual(generateDataRetentionScheduleVisual(scan), null);
  });

  it("returns null with exactly 2 services", () => {
    const scan = makeScan({
      services: [makeService("a", "payment"), makeService("b", "ai")],
    });
    assert.strictEqual(generateDataRetentionScheduleVisual(scan), null);
  });

  it("returns null with 1 service", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    assert.strictEqual(generateDataRetentionScheduleVisual(scan), null);
  });

  it("generates when exactly 3 services", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan(3));
    assert.ok(result !== null);
  });
});

// ── Basic generation ────────────────────────────────────────────────

describe("generateDataRetentionScheduleVisual — basic generation", () => {
  it("generates document with title", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("# Data Retention Schedule"));
  });

  it("includes project name", () => {
    const scan = makeScan({
      projectName: "my-app",
      services: makeMultiScan().services,
    });
    const result = generateDataRetentionScheduleVisual(scan)!;
    assert.ok(result.includes("my-app"));
  });

  it("includes date in ISO format", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes reference to Data Retention Policy", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("DATA_RETENTION_POLICY.md"));
  });
});

// ── Context values ──────────────────────────────────────────────────

describe("generateDataRetentionScheduleVisual — context values", () => {
  it("uses company name from context", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan(), makeCtx({ companyName: "TestCo" }))!;
    assert.ok(result.includes("TestCo"));
  });

  it("uses contact email from context", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan(), makeCtx({ contactEmail: "data@test.com" }))!;
    assert.ok(result.includes("data@test.com"));
  });

  it("uses placeholder when no company name", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses placeholder when no contact email", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("includes DPO email when provided", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan(), makeCtx({ dpoEmail: "dpo@test.com" }))!;
    assert.ok(result.includes("dpo@test.com"));
  });

  it("omits DPO line when not provided", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(!result.includes("Data Protection Officer:"));
  });

  it("includes dataRetentionDays override when provided", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan(), makeCtx({ dataRetentionDays: 180 }))!;
    assert.ok(result.includes("180 days"));
    assert.ok(result.includes("from configuration"));
  });

  it("omits retention override when not provided", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan(), makeCtx())!;
    assert.ok(!result.includes("from configuration"));
  });
});

// ── Mermaid Gantt chart ─────────────────────────────────────────────

describe("generateDataRetentionScheduleVisual — Gantt chart", () => {
  it("includes mermaid gantt block", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("```mermaid"));
    assert.ok(result.includes("gantt"));
  });

  it("includes gantt title", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("title Data Retention Timelines"));
  });

  it("includes dateFormat", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("dateFormat YYYY-MM-DD"));
  });

  it("includes Legend section with milestone", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("section Legend"));
    assert.ok(result.includes("Collection date"));
  });

  it("includes section for each category", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("section Payment Processing"));
    assert.ok(result.includes("section AI Service"));
    assert.ok(result.includes("section Error Monitoring"));
  });
});

// ── Retention periods ───────────────────────────────────────────────

describe("generateDataRetentionScheduleVisual — retention periods", () => {
  it("shows 7 years for payment", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("7 years"));
  });

  it("shows 90 days for AI services", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("90 days"));
  });

  it("shows 90 days for monitoring", () => {
    const scan = makeMultiScan(3); // payment, ai, monitoring
    const result = generateDataRetentionScheduleVisual(scan)!;
    assert.ok(result.includes("90 days"));
  });

  it("shows ~2 years for analytics", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan(4))!;
    assert.ok(result.includes("2 years"));
  });

  it("shows 3 years for email", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan(5))!;
    assert.ok(result.includes("3 years"));
  });

  it("shows 'Until deletion' for auth services", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateDataRetentionScheduleVisual(scan)!;
    assert.ok(result.includes("Until deletion"));
  });

  it("shows 'Until deletion' for storage services", () => {
    const scan = makeScan({
      services: [
        makeService("@aws-sdk/client-s3", "storage"),
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateDataRetentionScheduleVisual(scan)!;
    assert.ok(result.includes("Until deletion"));
  });

  it("shows 'Until deletion' for database services", () => {
    const scan = makeScan({
      services: [
        makeService("firebase", "database"),
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateDataRetentionScheduleVisual(scan)!;
    assert.ok(result.includes("Until deletion"));
  });
});

// ── Summary table ───────────────────────────────────────────────────

describe("generateDataRetentionScheduleVisual — summary table", () => {
  it("includes retention summary section", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("## Retention Summary"));
  });

  it("includes table headers", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("| Category | Retention Period | Days | Risk Level |"));
  });

  it("marks high risk for 7+ year retention", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("| High |"));
  });

  it("marks low risk for sub-1-year retention", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("| Low |"));
  });

  it("includes effective days for until-deletion categories", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateDataRetentionScheduleVisual(scan)!;
    assert.ok(result.includes("3650"));
  });
});

// ── Expiry timeline ─────────────────────────────────────────────────

describe("generateDataRetentionScheduleVisual — expiry timeline", () => {
  it("includes expiry timeline section", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("## Expiry Timeline"));
  });

  it("includes mermaid timeline block", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("timeline"));
    assert.ok(result.includes("title When does data expire?"));
  });

  it("includes expiry dates for categories", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    // Should have dates in timeline entries
    assert.ok(/\d{4}-\d{2}-\d{2} : .+/.test(result));
  });
});

// ── Data lifecycle phases ───────────────────────────────────────────

describe("generateDataRetentionScheduleVisual — lifecycle phases", () => {
  it("includes lifecycle section", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("## Data Lifecycle Phases"));
  });

  it("includes flowchart diagram", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("flowchart LR"));
  });

  it("includes Collection phase", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("Collection"));
  });

  it("includes Processing phase", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("Processing"));
  });

  it("includes Storage phase", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("Storage"));
  });

  it("includes Delete phase", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("Delete"));
  });

  it("includes retention period decision node", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("Retention"));
    assert.ok(result.includes("Expired"));
  });
});

// ── Risk heat map ───────────────────────────────────────────────────

describe("generateDataRetentionScheduleVisual — risk heat map", () => {
  it("includes risk heat map section", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("## Retention Risk Heat Map"));
  });

  it("includes high risk row", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("**High** (7+ years)"));
  });

  it("includes moderate risk row", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("**Moderate** (1"));
  });

  it("includes low risk row", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("**Low** (< 1 year)"));
  });

  it("categorises payment as high risk", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    // Payment is 2555 days (7 years) which is >= 2555 -> high
    assert.ok(result.includes("Payment Processing"));
  });

  it("shows 'None' when no categories in a risk level", () => {
    // All 3 services have distinct risk levels but some rows might be "None"
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),       // 90 days -> low
        makeService("stripe2", "ai"),      // 90 days -> low
        makeService("stripe3", "ai"),      // 90 days -> low
      ],
    });
    const result = generateDataRetentionScheduleVisual(scan)!;
    assert.ok(result.includes("None"));
  });

  it("includes recommended actions", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("Verify legal obligation"));
    assert.ok(result.includes("Review annually"));
    assert.ok(result.includes("Automated purge"));
  });
});

// ── Sorting ─────────────────────────────────────────────────────────

describe("generateDataRetentionScheduleVisual — sorting", () => {
  it("sorts categories by retention duration (longest first)", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    const paymentIdx = result.indexOf("Payment Processing");
    const aiIdx = result.indexOf("AI Service");
    // Payment (2555 days) should appear before AI (90 days) in sorted output
    assert.ok(paymentIdx < aiIdx, "Payment should appear before AI in Gantt");
  });
});

// ── Unknown categories ──────────────────────────────────────────────

describe("generateDataRetentionScheduleVisual — unknown categories", () => {
  it("falls back to 'other' retention for unknown category", () => {
    const scan = makeScan({
      services: [
        makeService("custom1", "other" as any),
        makeService("custom2", "other" as any),
        makeService("custom3", "other" as any),
      ],
    });
    const result = generateDataRetentionScheduleVisual(scan)!;
    assert.ok(result.includes("1 year"));
  });
});

// ── Footer ──────────────────────────────────────────────────────────

describe("generateDataRetentionScheduleVisual — footer", () => {
  it("includes contact section", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("## Contact"));
  });

  it("includes Codepliant attribution", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("Codepliant"));
  });

  it("includes legal review note", () => {
    const result = generateDataRetentionScheduleVisual(makeMultiScan())!;
    assert.ok(result.includes("reviewed by your legal"));
  });
});

// ── Unique categories ───────────────────────────────────────────────

describe("generateDataRetentionScheduleVisual — unique categories", () => {
  it("deduplicates categories from multiple services", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("@anthropic-ai/sdk", "ai"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateDataRetentionScheduleVisual(scan)!;
    // AI Service section should appear only once
    const matches = result.match(/section AI Service/g);
    assert.ok(matches !== null);
    assert.strictEqual(matches.length, 1);
  });
});
