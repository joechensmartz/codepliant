import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { DetectedService, ScanResult } from "../scanner/types.js";
import { generateDataBreachResponseDrill } from "./data-breach-response-drill.js";
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

describe("generateDataBreachResponseDrill", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when no services detected", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateDataBreachResponseDrill(scan), null);
  });

  // ── Basic generation ───────────────────────────────────────────────

  it("generates document when at least one service present", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["payment info"])] });
    const result = generateDataBreachResponseDrill(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Data Breach Response Drill Template"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes project name", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("test-project"));
  });

  // ── Context values ─────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generateDataBreachResponseDrill(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "privacy@acme.com" };
    const result = generateDataBreachResponseDrill(scan, ctx)!;
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("uses placeholder contact email when no context", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses context DPO name", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", dpoName: "Jane Doe" };
    const result = generateDataBreachResponseDrill(scan, ctx)!;
    assert.ok(result.includes("Jane Doe"));
  });

  it("uses placeholder DPO name when no context", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("[Data Protection Officer Name]"));
  });

  it("uses context DPO email", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", dpoEmail: "dpo@acme.com" };
    const result = generateDataBreachResponseDrill(scan, ctx)!;
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("uses placeholder DPO email when no context", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("[dpo@example.com]"));
  });

  // ── Section 1: Exercise Overview ───────────────────────────────────

  it("includes exercise overview section", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("## 1. Exercise Overview"));
    assert.ok(result.includes("Tabletop exercise"));
    assert.ok(result.includes("2-3 hours"));
  });

  it("includes exercise objectives checklist", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("### 1.1 Exercise Objectives"));
    assert.ok(result.includes("Test the Incident Response Plan end-to-end"));
    assert.ok(result.includes("72-hour GDPR deadline"));
  });

  // ── Section 2: Roles and Participants ──────────────────────────────

  it("includes roles and participants section", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("## 2. Roles and Participants"));
    assert.ok(result.includes("Incident Commander"));
    assert.ok(result.includes("Technical Lead"));
    assert.ok(result.includes("Legal Counsel"));
    assert.ok(result.includes("Communications Lead"));
  });

  it("includes DPO details in roles table", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", dpoName: "Jane Doe" };
    const result = generateDataBreachResponseDrill(scan, ctx)!;
    assert.ok(result.includes("Jane Doe"));
    assert.ok(result.includes("Data Protection Officer"));
  });

  // ── Section 3: Drill Scenarios ─────────────────────────────────────

  it("always includes Credential Stuffing Attack scenario", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("Credential Stuffing Attack"));
    assert.ok(result.includes("**Severity:** High"));
    assert.ok(result.includes("2,500"));
  });

  it("includes auth-specific data at risk in credential scenario when auth detected", () => {
    const scan = makeScan({ services: [makeService("clerk", "auth")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("User credentials (email/password combinations)"));
    assert.ok(result.includes("Session tokens and authentication cookies"));
  });

  it("omits auth-specific data at risk when no auth services", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(!result.includes("User credentials (email/password combinations)"));
    assert.ok(!result.includes("Session tokens and authentication cookies"));
  });

  it("includes payment-specific data at risk in credential scenario when payment detected", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("Stored payment methods (last 4 digits, billing addresses)"));
  });

  it("includes payment inject in credential scenario when payment detected", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("unauthorized charges on their payment methods"));
  });

  it("omits payment-specific items when no payment services", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(!result.includes("Stored payment methods"));
    assert.ok(!result.includes("unauthorized charges"));
  });

  // ── Database exposure scenario ─────────────────────────────────────

  it("includes Exposed Database scenario when storage service detected", () => {
    const scan = makeScan({ services: [makeService("s3", "storage", ["files", "documents"])] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("Exposed Database / Storage Bucket"));
    assert.ok(result.includes("**Severity:** Critical"));
  });

  it("includes Exposed Database scenario when 3+ services detected", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics"),
        makeService("clerk", "auth"),
        makeService("resend", "email"),
      ],
    });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("Exposed Database / Storage Bucket"));
  });

  it("omits Exposed Database scenario with fewer than 3 non-storage services", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics"),
        makeService("clerk", "auth"),
      ],
    });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(!result.includes("Exposed Database / Storage Bucket"));
  });

  it("lists all data types in exposed database scenario", () => {
    const scan = makeScan({
      services: [
        makeService("s3", "storage", ["user files", "backups"]),
        makeService("clerk", "auth", ["credentials"]),
      ],
    });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("- user files"));
    assert.ok(result.includes("- backups"));
    assert.ok(result.includes("- credentials"));
  });

  // ── AI System Data Leak scenario ───────────────────────────────────

  it("includes AI System Data Leak scenario when AI detected", () => {
    const scan = makeScan({ services: [makeService("OpenAI", "ai", ["prompts"])] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("AI System Data Leak"));
    assert.ok(result.includes("prompt injection"));
    assert.ok(result.includes("User prompts and conversation history"));
  });

  it("omits AI scenario when no AI services", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(!result.includes("AI System Data Leak"));
  });

  // ── Supply Chain Compromise scenario ───────────────────────────────

  it("includes Supply Chain Compromise scenario when 5+ services detected", () => {
    const scan = makeScan({
      services: [
        makeService("Stripe", "payment"),
        makeService("clerk", "auth"),
        makeService("posthog", "analytics"),
        makeService("OpenAI", "ai"),
        makeService("resend", "email"),
      ],
    });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("Supply Chain Compromise"));
    assert.ok(result.includes("npm package"));
    assert.ok(result.includes("API keys and secrets"));
  });

  it("omits Supply Chain scenario with fewer than 5 services", () => {
    const scan = makeScan({
      services: [
        makeService("Stripe", "payment"),
        makeService("clerk", "auth"),
        makeService("posthog", "analytics"),
        makeService("OpenAI", "ai"),
      ],
    });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(!result.includes("Supply Chain Compromise"));
  });

  // ── Section 4: Exercise Timeline ───────────────────────────────────

  it("includes exercise timeline section", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("## 4. Exercise Timeline"));
    assert.ok(result.includes("Detection & Analysis"));
    assert.ok(result.includes("Containment"));
    assert.ok(result.includes("Eradication & Recovery"));
    assert.ok(result.includes("Notification"));
    assert.ok(result.includes("Post-Incident"));
    assert.ok(result.includes("Debrief"));
  });

  // ── Section 5: Discussion Questions ────────────────────────────────

  it("includes discussion questions by phase", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("## 5. Discussion Questions by Phase"));
    assert.ok(result.includes("### Phase 1: Detection & Analysis"));
    assert.ok(result.includes("### Phase 2: Containment"));
    assert.ok(result.includes("### Phase 3: Eradication & Recovery"));
    assert.ok(result.includes("### Phase 4: Notification"));
    assert.ok(result.includes("### Phase 5: Post-Incident"));
  });

  it("includes GDPR 72-hour reference in notification questions", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("72-hour notification threshold"));
  });

  // ── Section 6: Evaluation Criteria ─────────────────────────────────

  it("includes evaluation criteria and scoring rubric", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("## 6. Evaluation Criteria"));
    assert.ok(result.includes("### 6.1 Scoring Rubric"));
    assert.ok(result.includes("Excellent (4)"));
    assert.ok(result.includes("Detection speed"));
    assert.ok(result.includes("Containment actions"));
  });

  it("includes evaluation scorecard", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("### 6.2 Evaluation Scorecard"));
    assert.ok(result.includes("**Total**"));
    assert.ok(result.includes("[TOTAL]/32"));
  });

  it("includes rating scale", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("28-32: Excellent"));
    assert.ok(result.includes("8-13: Needs improvement"));
  });

  // ── Section 7: After-Action Review ─────────────────────────────────

  it("includes after-action review template", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("## 7. After-Action Review Template"));
    assert.ok(result.includes("### 7.1 Exercise Summary"));
    assert.ok(result.includes("### 7.2 Strengths Identified"));
    assert.ok(result.includes("### 7.3 Gaps and Improvement Areas"));
    assert.ok(result.includes("### 7.4 Process Updates Required"));
  });

  // ── Section 8: Pre-Drill Preparation ───────────────────────────────

  it("includes pre-drill preparation checklist", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("## 8. Pre-Drill Preparation Checklist"));
    assert.ok(result.includes("Select scenario"));
    assert.ok(result.includes("Assign all roles"));
    assert.ok(result.includes("Print copies of Incident Response Plan"));
  });

  // ── Section 9: Contact ─────────────────────────────────────────────

  it("includes contact section with DPO and email", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "privacy@acme.com",
      dpoName: "Jane Doe",
      dpoEmail: "dpo@acme.com",
    };
    const result = generateDataBreachResponseDrill(scan, ctx)!;
    assert.ok(result.includes("## 9. Contact"));
    assert.ok(result.includes("Jane Doe"));
    assert.ok(result.includes("dpo@acme.com"));
    assert.ok(result.includes("privacy@acme.com"));
  });

  // ── Footer ─────────────────────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("Codepliant"));
  });

  it("includes disclaimer about review", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("reviewed"));
    assert.ok(result.includes("security and legal teams"));
  });

  // ── Recommended frequency note ─────────────────────────────────────

  it("includes recommended frequency guidance", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment")] });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("Recommended frequency"));
    assert.ok(result.includes("annually"));
  });

  // ── Comprehensive test ─────────────────────────────────────────────

  it("generates comprehensive drill with all service categories", () => {
    const scan = makeScan({
      services: [
        makeService("clerk", "auth", ["credentials"]),
        makeService("Stripe", "payment", ["cards"]),
        makeService("OpenAI", "ai", ["prompts"]),
        makeService("posthog", "analytics", ["usage"]),
        makeService("s3", "storage", ["files"]),
        makeService("resend", "email", ["addresses"]),
      ],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      dpoName: "Jane Doe",
      dpoEmail: "dpo@acme.com",
    };
    const result = generateDataBreachResponseDrill(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
    // All scenarios present (6 services >= 5, has storage, has AI)
    assert.ok(result.includes("Credential Stuffing Attack"));
    assert.ok(result.includes("Exposed Database / Storage Bucket"));
    assert.ok(result.includes("AI System Data Leak"));
    assert.ok(result.includes("Supply Chain Compromise"));
    // Auth-specific items
    assert.ok(result.includes("User credentials (email/password combinations)"));
    // Payment-specific items
    assert.ok(result.includes("Stored payment methods"));
    assert.ok(result.includes("unauthorized charges"));
    // Data types in exposed db scenario
    assert.ok(result.includes("- credentials"));
    assert.ok(result.includes("- cards"));
    assert.ok(result.includes("- prompts"));
  });

  it("scenario numbering is sequential", () => {
    const scan = makeScan({
      services: [
        makeService("clerk", "auth"),
        makeService("Stripe", "payment"),
        makeService("OpenAI", "ai"),
        makeService("s3", "storage"),
        makeService("resend", "email"),
      ],
    });
    const result = generateDataBreachResponseDrill(scan)!;
    assert.ok(result.includes("### Scenario 1:"));
    assert.ok(result.includes("### Scenario 2:"));
    assert.ok(result.includes("### Scenario 3:"));
    assert.ok(result.includes("### Scenario 4:"));
  });
});
