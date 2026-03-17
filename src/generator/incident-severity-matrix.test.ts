import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateIncidentSeverityMatrix } from "./incident-severity-matrix.js";
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

describe("generateIncidentSeverityMatrix", () => {
  // ── Basic output ──────────────────────────────────────────────────

  it("returns a string (never null) even with no services", () => {
    const scan = makeScan({ services: [] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(typeof result === "string");
  });

  it("includes the title header", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("# Incident Severity Matrix"));
  });

  it("includes the Purpose section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("## Purpose"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes service count in header", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("2 services"));
  });

  // ── Context values ────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@acme.com" };
    const result = generateIncidentSeverityMatrix(scan, ctx);
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context dpoEmail in communication requirements", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "X", contactEmail: "x@x.com", dpoEmail: "dpo@x.com" };
    const result = generateIncidentSeverityMatrix(scan, ctx);
    assert.ok(result.includes("dpo@x.com"));
  });

  it("uses placeholder dpoEmail when not provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("[dpo@example.com]"));
  });

  it("uses context securityEmail in communication channels", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "X", contactEmail: "x@x.com", securityEmail: "sec@x.com" };
    const result = generateIncidentSeverityMatrix(scan, ctx);
    assert.ok(result.includes("sec@x.com"));
  });

  it("falls back securityEmail to contactEmail", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "X", contactEmail: "contact@x.com" };
    const result = generateIncidentSeverityMatrix(scan, ctx);
    assert.ok(result.includes("contact@x.com"));
  });

  // ── Severity Level Definitions ────────────────────────────────────

  it("includes all five severity levels P0-P4", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("**P0**"));
    assert.ok(result.includes("**P1**"));
    assert.ok(result.includes("**P2**"));
    assert.ok(result.includes("**P3**"));
    assert.ok(result.includes("**P4**"));
  });

  it("includes severity level names", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("Catastrophic"));
    assert.ok(result.includes("Critical"));
    assert.ok(result.includes("Medium"));
    assert.ok(result.includes("Low"));
  });

  // ── Response Time Requirements ────────────────────────────────────

  it("includes response time requirements section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("## 2. Response Time Requirements"));
  });

  it("includes P0 acknowledge time of 5 minutes", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("5 minutes"));
  });

  it("includes post-mortem timelines", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("Within 24 hours"));
    assert.ok(result.includes("Within 48 hours"));
  });

  // ── Escalation Paths ──────────────────────────────────────────────

  it("includes escalation paths section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("## 3. Escalation Paths"));
  });

  it("includes P0 escalation to CEO and board", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("CEO + Legal Counsel"));
    assert.ok(result.includes("Board notification"));
  });

  it("includes P3/P4 escalation path", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("P3/P4"));
    assert.ok(result.includes("Security channel / ticket"));
  });

  // ── Communication Requirements ────────────────────────────────────

  it("includes communication requirements section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("## 4. Communication Requirements"));
  });

  it("includes GDPR Art. 33 reference for P0", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("GDPR Art. 33"));
  });

  // ── Communication Channels ────────────────────────────────────────

  it("includes communication channels section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("## 5. Communication Channels"));
    assert.ok(result.includes("War room"));
    assert.ok(result.includes("Status page"));
  });

  // ── Per-Service Impact Assessment ─────────────────────────────────

  it("includes per-service impact assessment section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("## 6. Per-Service Impact Assessment"));
  });

  it("lists each service in the impact table", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["card numbers", "email"]),
        makeService("openai", "ai", ["prompts"]),
      ],
    });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("| stripe |"));
    assert.ok(result.includes("| openai |"));
  });

  it("shows no-services placeholder when services empty", () => {
    const scan = makeScan({ services: [] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("No services detected"));
  });

  it("shows data at risk from dataCollected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["card numbers", "email", "name"])],
    });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("card numbers, email, name"));
  });

  it("shows correct compromised severity for payment (P0)", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    // Payment compromised should be P0
    assert.ok(result.includes("| stripe | payment | **P0**"));
  });

  it("shows correct compromised severity for monitoring (P2)", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("| sentry | monitoring | **P2**"));
  });

  it("shows correct outage severity for analytics (P3)", () => {
    const scan = makeScan({ services: [makeService("ga", "analytics")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("**P3**"));
  });

  it("shows regulatory impact for AI services", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("EU AI Act"));
  });

  it("shows regulatory impact for payment services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("PCI DSS"));
  });

  // ── Category-Specific Incident Scenarios ──────────────────────────

  it("includes AI scenarios when AI service present", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("### AI Services"));
    assert.ok(result.includes("Prompt injection"));
  });

  it("excludes AI scenarios when no AI service", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(!result.includes("### AI Services"));
  });

  it("includes Payment scenarios when payment service present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("### Payment Services"));
    assert.ok(result.includes("Cardholder data exposed"));
  });

  it("excludes Payment scenarios when no payment service", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(!result.includes("### Payment Services"));
  });

  it("includes Auth scenarios when auth service present", () => {
    const scan = makeScan({ services: [makeService("next-auth", "auth")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("### Authentication Services"));
    assert.ok(result.includes("Complete auth bypass"));
  });

  it("excludes Auth scenarios when no auth service", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(!result.includes("### Authentication Services"));
  });

  it("includes Database & Storage scenarios when database present", () => {
    const scan = makeScan({ services: [makeService("prisma", "database")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("### Database & Storage Services"));
    assert.ok(result.includes("Database exposed to internet"));
  });

  it("includes Database & Storage scenarios when storage present", () => {
    const scan = makeScan({ services: [makeService("s3", "storage")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("### Database & Storage Services"));
  });

  it("includes Analytics scenarios when analytics present", () => {
    const scan = makeScan({ services: [makeService("ga", "analytics")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("### Analytics Services"));
    assert.ok(result.includes("Analytics collecting PII"));
  });

  it("excludes Analytics scenarios when no analytics service", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(!result.includes("### Analytics Services"));
  });

  // ── Severity Decision Tree ────────────────────────────────────────

  it("includes severity decision tree", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("## 8. Severity Decision Tree"));
    assert.ok(result.includes("confirmed data exfiltration"));
  });

  // ── Regulatory Response Timelines ─────────────────────────────────

  it("includes regulatory response timelines", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("## 9. Regulatory Response Timelines"));
    assert.ok(result.includes("GDPR (Art. 33/34)"));
    assert.ok(result.includes("72 hours"));
  });

  it("includes PCI DSS timeline when payment service present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("PCI DSS"));
    assert.ok(result.includes("24 hours"));
  });

  it("includes EU AI Act timeline when AI service present", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("EU AI Act"));
  });

  it("excludes PCI DSS timeline when no payment service", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateIncidentSeverityMatrix(scan);
    // PCI DSS row has "24 hours (to processor)" which only appears in payment conditional
    assert.ok(!result.includes("24 hours** (to processor)"));
  });

  // ── Incident Response Roles ───────────────────────────────────────

  it("includes incident response roles section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("## 10. Incident Response Roles"));
    assert.ok(result.includes("Incident Commander"));
    assert.ok(result.includes("Security Lead"));
    assert.ok(result.includes("Engineering Lead"));
    assert.ok(result.includes("Communications Lead"));
  });

  // ── Disclaimer ────────────────────────────────────────────────────

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({
      projectName: "my-app",
      services: [makeService("stripe", "payment")],
    });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("my-app"));
  });

  it("includes service count in disclaimer", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("sentry", "monitoring"),
      ],
    });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("3 services detected"));
  });

  // ── Full scenario with all categories ─────────────────────────────

  it("includes all conditional scenario sections when all categories present", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("stripe", "payment"),
        makeService("next-auth", "auth"),
        makeService("prisma", "database"),
        makeService("s3", "storage"),
        makeService("ga", "analytics"),
        makeService("sentry", "monitoring"),
      ],
    });
    const result = generateIncidentSeverityMatrix(scan);
    assert.ok(result.includes("### AI Services"));
    assert.ok(result.includes("### Payment Services"));
    assert.ok(result.includes("### Authentication Services"));
    assert.ok(result.includes("### Database & Storage Services"));
    assert.ok(result.includes("### Analytics Services"));
  });
});
