import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generatePrivacyRiskMatrix } from "./privacy-risk-matrix.js";
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

describe("generatePrivacyRiskMatrix", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generatePrivacyRiskMatrix(scan), null);
  });

  // ── Generation with services ───────────────────────────────────────

  it("generates matrix with a single analytics service", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result !== null);
    assert.ok(result.includes("# Privacy Risk Matrix"));
  });

  it("generates matrix with a single auth service", () => {
    const scan = makeScan({ services: [makeService("@clerk/nextjs", "auth")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("User authentication and identity management"));
  });

  it("generates matrix with a single payment service", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("Payment processing and financial data handling"));
  });

  it("generates matrix with a single AI service", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("AI/ML data processing and model inference"));
  });

  it("generates matrix with a single database service", () => {
    const scan = makeScan({ services: [makeService("prisma", "database")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("Persistent data storage and retrieval"));
  });

  it("generates matrix with a single storage service", () => {
    const scan = makeScan({ services: [makeService("s3", "storage")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("File and object storage"));
  });

  it("generates matrix with a single email service", () => {
    const scan = makeScan({ services: [makeService("resend", "email")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("Email communications and marketing"));
  });

  it("generates matrix with multiple services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
      ],
    });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("# Privacy Risk Matrix"));
    assert.ok(result.includes("Payment processing"));
    assert.ok(result.includes("User behavior tracking"));
    assert.ok(result.includes("AI/ML data processing"));
  });

  // ── Context values ─────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generatePrivacyRiskMatrix(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes next review date", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("Next Review Date"));
  });

  it("includes document version", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("Document Version"));
  });

  // ── Executive Summary section ──────────────────────────────────────

  it("includes Executive Summary section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("## Executive Summary"));
    assert.ok(result.includes("| Level | Count | Action Required |"));
  });

  it("shows Critical count for high-risk combinations", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generatePrivacyRiskMatrix(scan)!;
    // AI: likelihood 4 * impact 4 = 16 (Critical)
    assert.ok(result.includes("Critical"));
  });

  it("shows High count for auth services", () => {
    const scan = makeScan({
      services: [makeService("@clerk/nextjs", "auth")],
    });
    const result = generatePrivacyRiskMatrix(scan)!;
    // Auth: likelihood 3 * impact 5 = 15 (Critical)
    assert.ok(result.includes("Critical"));
  });

  it("shows Medium count for email services", () => {
    const scan = makeScan({
      services: [makeService("resend", "email")],
    });
    const result = generatePrivacyRiskMatrix(scan)!;
    // Email: likelihood 3 * impact 3 = 9 (Medium)
    assert.ok(result.includes("Medium"));
  });

  it("shows total risk count", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generatePrivacyRiskMatrix(scan)!;
    // 2 category risks + 1 international transfer risk (>=2 services) = 3
    assert.ok(result.includes("**Total**"));
    assert.ok(result.includes("**3**"));
  });

  // ── Visual Risk Matrix section ─────────────────────────────────────

  it("includes Visual Risk Matrix grid", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("## Visual Risk Matrix"));
    assert.ok(result.includes("Likelihood \\ Impact"));
    assert.ok(result.includes("Negligible"));
    assert.ok(result.includes("Severe"));
  });

  it("includes 5x5 grid with all likelihood labels", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("Rare"));
    assert.ok(result.includes("Unlikely"));
    assert.ok(result.includes("Possible"));
    assert.ok(result.includes("Likely"));
    assert.ok(result.includes("Almost Certain"));
  });

  it("places risk IDs in the grid", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("PR-001"));
  });

  // ── Scoring Legend section ─────────────────────────────────────────

  it("includes Scoring Legend", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("### Scoring Legend"));
    assert.ok(result.includes("| Score Range | Level | Color |"));
  });

  // ── Risk Register table ────────────────────────────────────────────

  it("includes Risk Register table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("## Risk Register"));
    assert.ok(result.includes("| ID | Processing Activity | Likelihood | Impact | Score | Level | Services |"));
  });

  it("lists service names in risk register", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("stripe"));
  });

  it("includes likelihood and impact labels in risk register", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    // Payment: likelihood 2 (Unlikely), impact 5 (Severe)
    assert.ok(result.includes("Unlikely"));
    assert.ok(result.includes("Severe"));
  });

  // ── Risk Details and Mitigations section ───────────────────────────

  it("includes Risk Details section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("## Risk Details and Mitigations"));
  });

  it("includes data types at risk for payment", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("credit card tokens"));
    assert.ok(result.includes("billing addresses"));
  });

  it("includes mitigations for payment", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("PCI DSS compliant"));
    assert.ok(result.includes("tokenization"));
  });

  it("includes data types at risk for analytics", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("IP addresses"));
    assert.ok(result.includes("device fingerprints"));
    assert.ok(result.includes("browsing history"));
  });

  it("includes mitigations for analytics", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("cookie consent management"));
    assert.ok(result.includes("Anonymize IP"));
  });

  it("includes data types at risk for AI", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("user prompts"));
    assert.ok(result.includes("generated outputs"));
  });

  it("includes mitigations for AI", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("data minimization"));
    assert.ok(result.includes("DPIA under GDPR Art. 35"));
  });

  it("includes data types at risk for auth", () => {
    const scan = makeScan({ services: [makeService("@clerk/nextjs", "auth")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("email addresses"));
    assert.ok(result.includes("passwords/hashes"));
    assert.ok(result.includes("OAuth tokens"));
  });

  it("includes mitigations for auth", () => {
    const scan = makeScan({ services: [makeService("@clerk/nextjs", "auth")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("bcrypt/argon2"));
    assert.ok(result.includes("MFA"));
  });

  it("includes mitigations for database", () => {
    const scan = makeScan({ services: [makeService("prisma", "database")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("encryption at rest"));
    assert.ok(result.includes("field-level encryption"));
  });

  it("includes mitigations for storage", () => {
    const scan = makeScan({ services: [makeService("s3", "storage")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("server-side encryption"));
    assert.ok(result.includes("access control lists"));
  });

  it("includes mitigations for email", () => {
    const scan = makeScan({ services: [makeService("resend", "email")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("double opt-in"));
    assert.ok(result.includes("one-click unsubscribe"));
  });

  // ── Conditional sections ───────────────────────────────────────────

  it("includes international transfer risk when 2+ services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("International data transfers"));
    assert.ok(result.includes("Data Processing Agreements"));
    assert.ok(result.includes("Standard Contractual Clauses"));
  });

  it("does not include international transfer risk with only 1 service", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(!result.includes("International data transfers"));
  });

  it("advertising services trigger analytics risk", () => {
    const scan = makeScan({ services: [makeService("google-ads", "advertising")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("User behavior tracking and analytics"));
    assert.ok(result.includes("google-ads"));
  });

  // ── Risk scoring and sorting ───────────────────────────────────────

  it("sorts risks by score descending", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("resend", "email"),
      ],
    });
    const result = generatePrivacyRiskMatrix(scan)!;
    const lines = result.split("\n");
    const registerLines = lines.filter((l) => /^\| PR-\d{3}/.test(l));
    // AI score (16) should come before international transfer (16) should come before payment (10) should come before email (9)
    assert.ok(registerLines.length >= 3);
    // First entry should be AI (score 16 = Critical)
    assert.ok(registerLines[0].includes("AI/ML data processing"));
  });

  it("uses correct risk color for Critical (score >= 15)", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    // AI: 4 * 4 = 16 (Critical)
    const aiDetail = result.split("\n").find((l) => l.includes("### PR-001"));
    assert.ok(aiDetail);
    assert.ok(result.includes("Critical (16/25)"));
  });

  it("uses correct risk color for High (score 10-14)", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    // Payment: 2 * 5 = 10 (High)
    assert.ok(result.includes("High (10/25)"));
  });

  it("uses correct risk color for Medium (score 5-9)", () => {
    const scan = makeScan({ services: [makeService("resend", "email")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    // Email: 3 * 3 = 9 (Medium)
    assert.ok(result.includes("Medium (9/25)"));
  });

  // ── Footer ─────────────────────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("Codepliant"));
  });

  it("includes professional review disclaimer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generatePrivacyRiskMatrix(scan)!;
    assert.ok(result.includes("qualified privacy and legal professionals"));
    assert.ok(result.includes("does not constitute legal advice"));
  });

  // ── Comprehensive test ─────────────────────────────────────────────

  it("generates comprehensive matrix with all service categories", () => {
    const scan = makeScan({
      services: [
        makeService("@clerk/nextjs", "auth"),
        makeService("prisma", "database"),
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
        makeService("resend", "email"),
        makeService("s3", "storage"),
      ],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
    };
    const result = generatePrivacyRiskMatrix(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("## Executive Summary"));
    assert.ok(result.includes("## Visual Risk Matrix"));
    assert.ok(result.includes("## Risk Register"));
    assert.ok(result.includes("## Risk Details and Mitigations"));
    // Should have 7 category risks + 1 international transfer = 8 total
    assert.ok(result.includes("**8**"));
    // All categories represented
    assert.ok(result.includes("User behavior tracking"));
    assert.ok(result.includes("User authentication"));
    assert.ok(result.includes("Payment processing"));
    assert.ok(result.includes("AI/ML data processing"));
    assert.ok(result.includes("Persistent data storage"));
    assert.ok(result.includes("File and object storage"));
    assert.ok(result.includes("Email communications"));
    assert.ok(result.includes("International data transfers"));
  });
});
