import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generatePrivacyImpactScreening } from "./privacy-impact-screening.js";
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

describe("generatePrivacyImpactScreening", () => {
  // ── Null guard ──────────────────────────────────────────────────────

  it("returns null when no services are present", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generatePrivacyImpactScreening(scan), null);
  });

  // ── Basic generation ────────────────────────────────────────────────

  it("returns a non-null string when services are present", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generatePrivacyImpactScreening(scan);
    assert.ok(result !== null);
    assert.ok(result.length > 0);
  });

  it("includes title", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(result.includes("# Privacy Impact Screening"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  // ── Context values ──────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "info@acme.com" };
    const result = generatePrivacyImpactScreening(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context DPO name", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@b.com", dpoName: "Jane Smith" };
    const result = generatePrivacyImpactScreening(scan, ctx)!;
    assert.ok(result.includes("Jane Smith"));
  });

  it("uses context DPO email", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@b.com", dpoEmail: "dpo@acme.com" };
    const result = generatePrivacyImpactScreening(scan, ctx)!;
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("falls back to contactEmail for DPO email when dpoEmail is not set", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "contact@acme.com" };
    const result = generatePrivacyImpactScreening(scan, ctx)!;
    assert.ok(result.includes("contact@acme.com"));
  });

  // ── Screening Result section ────────────────────────────────────────

  it("includes Screening Result section", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(result.includes("## Screening Result"));
  });

  it("recommends full DPIA when 2+ triggers are detected", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("posthog", "analytics", ["browsing data"]),
        makeService("sentry", "monitoring"),
      ],
    });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(result.includes("FULL DPIA RECOMMENDED"));
  });

  it("says DPIA likely when 1 trigger and unknowns exist", () => {
    // Single service with no analytics/monitoring/AI — just a payment service
    // Q9 triggers for payment but dpiaTriggered requires both payment AND auth
    // So only Q5 and Q6 are Unknown and triggers = 0 from a single payment with no other flags
    // Actually let's use a single analytics service — that triggers Q1
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyImpactScreening(scan)!;
    // Q1 triggered (analytics), Q5 Unknown, Q3 Unknown, Q6 Unknown, etc.
    // triggeredCount=1, unknownCount>=1 => dpiaLikely
    assert.ok(result.includes("DPIA LIKELY NEEDED"));
  });

  it("says DPIA not required when few triggers", () => {
    // Single email service triggers nothing
    const scan = makeScan({
      services: [makeService("sendgrid", "email")],
    });
    const result = generatePrivacyImpactScreening(scan)!;
    // No analytics, no AI, no monitoring, no behavioral data, no health data, not 5+ services,
    // no location data, no database. Q5=Unknown, Q3=Unknown but triggeredCount=0
    // dpiaRequired=false, dpiaLikely=false
    assert.ok(result.includes("FULL DPIA NOT REQUIRED AT THIS TIME"));
  });

  // ── Screening Questions table ───────────────────────────────────────

  it("includes Screening Questions table header", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(result.includes("## Screening Questions"));
    assert.ok(result.includes("| # | Question | Answer | Auto-Filled | DPIA Trigger |"));
  });

  it("includes all 10 screening questions", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generatePrivacyImpactScreening(scan)!;
    for (const qid of ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "Q10"]) {
      assert.ok(result.includes(`| ${qid} |`), `Missing question ${qid}`);
    }
  });

  // ── Q1: Systematic monitoring ───────────────────────────────────────

  it("Q1 answers Yes for analytics services", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(result.includes("| Q1 | Does the processing involve systematic monitoring"));
    assert.ok(result.includes("**Yes**"));
  });

  it("Q1 answers Yes for monitoring services", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generatePrivacyImpactScreening(scan)!;
    // Q1 should be Yes for monitoring
    assert.ok(/Q1.*\*\*Yes\*\*/.test(result));
  });

  it("Q1 answers Yes for behavioral data", () => {
    const scan = makeScan({
      services: [makeService("sendgrid", "email", ["browsing data"])],
    });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(/Q1.*\*\*Yes\*\*/.test(result));
  });

  it("Q1 answers No when no analytics or monitoring", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(/Q1.*\*\*No\*\*/.test(result));
  });

  // ── Q2: Automated decision-making ───────────────────────────────────

  it("Q2 answers Yes for AI services", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(/Q2.*\*\*Yes\*\*/.test(result));
  });

  it("Q2 answers No when no AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(/Q2.*\*\*No\*\*/.test(result));
  });

  // ── Q3: Special category data ───────────────────────────────────────

  it("Q3 answers Yes when health data is collected", () => {
    const scan = makeScan({
      services: [makeService("mydb", "database", ["health records"])],
    });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(/Q3.*\*\*Yes\*\*/.test(result));
  });

  it("Q3 answers Yes for biometric data", () => {
    const scan = makeScan({
      services: [makeService("auth0", "auth", ["biometric data"])],
    });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(/Q3.*\*\*Yes\*\*/.test(result));
  });

  it("Q3 answers Unknown when no special data detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(/Q3.*\*\*Unknown\*\*/.test(result));
  });

  // ── Q4: Large-scale processing ──────────────────────────────────────

  it("Q4 answers Yes when 5+ services detected", () => {
    const scan = makeScan({
      services: [
        makeService("svc1", "auth"),
        makeService("svc2", "analytics"),
        makeService("svc3", "payment"),
        makeService("svc4", "email"),
        makeService("svc5", "database"),
      ],
    });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(/Q4.*\*\*Yes\*\*/.test(result));
  });

  it("Q4 answers Unknown when fewer than 5 services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(/Q4.*\*\*Unknown\*\*/.test(result));
  });

  // ── Q5: Vulnerable individuals ──────────────────────────────────────

  it("Q5 always answers Unknown (requires manual review)", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(/Q5.*\*\*Unknown\*\*/.test(result));
  });

  // ── Q6: Innovative technology ───────────────────────────────────────

  it("Q6 answers Yes for AI services", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(/Q6.*\*\*Yes\*\*/.test(result));
  });

  it("Q6 answers Unknown when no AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(/Q6.*\*\*Unknown\*\*/.test(result));
  });

  // ── Q7: Cross-border transfers ──────────────────────────────────────

  it("Q7 answers Yes with GDPR jurisdiction and 3+ services", () => {
    const scan = makeScan({
      services: [
        makeService("svc1", "auth"),
        makeService("svc2", "analytics"),
        makeService("svc3", "payment"),
      ],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@b.com", jurisdictions: ["gdpr"] };
    const result = generatePrivacyImpactScreening(scan, ctx)!;
    assert.ok(/Q7.*\*\*Yes\*\*/.test(result));
  });

  it("Q7 defaults to GDPR when no jurisdictions set (and 3+ services)", () => {
    const scan = makeScan({
      services: [
        makeService("svc1", "auth"),
        makeService("svc2", "analytics"),
        makeService("svc3", "payment"),
      ],
    });
    const result = generatePrivacyImpactScreening(scan)!;
    // jurisdictions.length === 0 => hasGDPR=true, serviceCount=3 => Yes
    assert.ok(/Q7.*\*\*Yes\*\*/.test(result));
  });

  // ── Q8: Combining datasets ─────────────────────────────────────────

  it("Q8 answers Yes with 3+ services and database", () => {
    const scan = makeScan({
      services: [
        makeService("pg", "database"),
        makeService("auth0", "auth"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(/Q8.*\*\*Yes\*\*/.test(result));
  });

  it("Q8 answers No without database", () => {
    const scan = makeScan({
      services: [
        makeService("auth0", "auth"),
        makeService("stripe", "payment"),
        makeService("sendgrid", "email"),
      ],
    });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(/Q8.*\*\*No\*\*/.test(result));
  });

  // ── Q9: Preventing rights exercise ──────────────────────────────────

  it("Q9 answers Yes for payment or auth services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(/Q9.*\*\*Yes\*\*/.test(result));
  });

  it("Q9 answers No when no payment or auth", () => {
    const scan = makeScan({ services: [makeService("sendgrid", "email")] });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(/Q9.*\*\*No\*\*/.test(result));
  });

  // ── Q10: Location tracking ─────────────────────────────────────────

  it("Q10 answers Yes when location data detected", () => {
    const scan = makeScan({
      services: [makeService("mapbox", "other", ["geolocation"])],
    });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(/Q10.*\*\*Yes\*\*/.test(result));
  });

  it("Q10 answers No when no location data detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(/Q10.*\*\*No\*\*/.test(result));
  });

  // ── Detailed Rationale section ──────────────────────────────────────

  it("includes Detailed Rationale section", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(result.includes("## Detailed Rationale"));
  });

  it("includes rationale for monitoring detection", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(result.includes("monitoring services that may involve systematic monitoring"));
  });

  it("includes rationale for AI detection", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(result.includes("AI/ML services detected"));
  });

  // ── Next Steps section ──────────────────────────────────────────────

  it("includes Next Steps section", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(result.includes("## Next Steps"));
  });

  it("recommends conducting full DPIA in next steps when DPIA required", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
        makeService("sentry", "monitoring"),
      ],
    });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(result.includes("Conduct a full DPIA"));
  });

  it("recommends resolving unknowns when DPIA likely", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(result.includes("Resolve unknown answers"));
  });

  it("recommends documenting screening when DPIA not required", () => {
    const scan = makeScan({
      services: [makeService("sendgrid", "email")],
    });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(result.includes("Document this screening"));
  });

  // ── Data Types Detected section ─────────────────────────────────────

  it("includes Data Types Detected section when data types present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["credit card", "billing address"])],
    });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(result.includes("## Data Types Detected"));
    assert.ok(result.includes("credit card"));
    assert.ok(result.includes("billing address"));
  });

  it("sorts data types alphabetically", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["Zebra", "Apple"])],
    });
    const result = generatePrivacyImpactScreening(scan)!;
    const appleIdx = result.indexOf("apple");
    const zebraIdx = result.indexOf("zebra");
    assert.ok(appleIdx < zebraIdx);
  });

  // ── Services Assessed table ─────────────────────────────────────────

  it("includes Services Assessed table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment", ["payment data"])] });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(result.includes("## Services Assessed"));
    assert.ok(result.includes("| stripe | payment | payment data |"));
  });

  it("deduplicates services by name", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generatePrivacyImpactScreening(scan)!;
    const matches = result.match(/\| stripe \|/g);
    assert.strictEqual(matches?.length, 1);
  });

  // ── Footer ──────────────────────────────────────────────────────────

  it("includes Codepliant footer", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(result.includes("Generated by Codepliant"));
  });

  it("includes GDPR Article 35 reference", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(result.includes("GDPR Article 35"));
  });

  it("includes disclaimer about legal review", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(result.includes("reviewed by a qualified privacy professional"));
  });

  // ── Service count display ───────────────────────────────────────────

  it("displays service count in header", () => {
    const scan = makeScan({
      services: [
        makeService("svc1", "auth"),
        makeService("svc2", "payment"),
        makeService("svc3", "email"),
      ],
    });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(result.includes("**Services Scanned:** 3"));
  });

  // ── Financial data detection ────────────────────────────────────────

  it("detects financial data from payment-related data types", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["credit card numbers", "bank account"])],
    });
    const result = generatePrivacyImpactScreening(scan)!;
    // Financial data detected should appear in data types section
    assert.ok(result.includes("credit card numbers"));
    assert.ok(result.includes("bank account"));
  });

  // ── Advertising category triggers ───────────────────────────────────

  it("Q1 triggers for advertising category", () => {
    const scan = makeScan({
      services: [makeService("google-ads", "advertising")],
    });
    const result = generatePrivacyImpactScreening(scan)!;
    assert.ok(/Q1.*\*\*Yes\*\*/.test(result));
  });
});
