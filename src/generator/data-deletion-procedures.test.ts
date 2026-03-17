import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { DetectedService, ScanResult } from "../scanner/types.js";
import { generateDataDeletionProcedures } from "./data-deletion-procedures.js";
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

describe("generateDataDeletionProcedures", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when no services detected", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateDataDeletionProcedures(scan), null);
  });

  // ── Basic generation ───────────────────────────────────────────────

  it("generates document when at least one service present", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["payment info"])] });
    const result = generateDataDeletionProcedures(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Data Deletion Procedures"));
  });

  // ── Context values ─────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generateDataDeletionProcedures(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "privacy@acme.com" };
    const result = generateDataDeletionProcedures(scan, ctx)!;
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("uses placeholder contact email when no context", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses context DPO name", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", dpoName: "Jane Doe" };
    const result = generateDataDeletionProcedures(scan, ctx)!;
    assert.ok(result.includes("Jane Doe"));
  });

  it("uses placeholder DPO name when no context", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("[Data Protection Officer Name]"));
  });

  it("uses context DPO email", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", dpoEmail: "dpo@acme.com" };
    const result = generateDataDeletionProcedures(scan, ctx)!;
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("falls back to contactEmail for DPO email when dpoEmail not provided", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "contact@acme.com" };
    const result = generateDataDeletionProcedures(scan, ctx)!;
    // DPO email falls back to contactEmail — appears in pre-deletion checklist and escalation
    assert.ok(result.includes("contact@acme.com"));
  });

  // ── Header ─────────────────────────────────────────────────────────

  it("includes GDPR Art. 17 reference in header", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("GDPR Art. 17 Right to Erasure"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes Codepliant attribution in header", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("Codepliant"));
  });

  // ── Section 1: Purpose ─────────────────────────────────────────────

  it("includes purpose section", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("## 1. Purpose"));
    assert.ok(result.includes("step-by-step data deletion procedures"));
  });

  // ── Section 2: Legal Basis ─────────────────────────────────────────

  it("includes legal basis section with GDPR Art. 17 conditions", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("## 2. Legal Basis"));
    assert.ok(result.includes("GDPR Article 17"));
    assert.ok(result.includes("1 month from receipt"));
  });

  // ── Section 3: Pre-Deletion Checklist ──────────────────────────────

  it("includes pre-deletion checklist", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("## 3. Pre-Deletion Checklist"));
    assert.ok(result.includes("Verify the data subject's identity"));
    assert.ok(result.includes("Document the request in the DSAR register"));
    assert.ok(result.includes("Check for legal hold"));
  });

  it("includes DPO notification in pre-deletion checklist", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const ctx: GeneratorContext = { companyName: "A", contactEmail: "a@a.com", dpoEmail: "dpo@a.com" };
    const result = generateDataDeletionProcedures(scan, ctx)!;
    assert.ok(result.includes("Notify the DPO (dpo@a.com)"));
  });

  // ── Section 4: Per-Service Deletion Procedures ─────────────────────

  it("includes per-service deletion procedures section", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["payment info"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("## 4. Per-Service Deletion Procedures"));
  });

  it("groups services by category with proper labels", () => {
    const scan = makeScan({
      services: [
        makeService("Stripe", "payment", ["payment info"]),
        makeService("clerk", "auth", ["user credentials"]),
      ],
    });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("Payment Processing"));
    assert.ok(result.includes("Authentication & Identity"));
  });

  it("includes known service Stripe with API deletion info", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["payment info"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("#### Stripe"));
    assert.ok(result.includes("DELETE /v1/customers/:id"));
    assert.ok(result.includes("Admin Panel Steps"));
    assert.ok(result.includes("Retention Exceptions"));
    assert.ok(result.includes("stripe.com/docs/api/customers/delete"));
  });

  it("includes known service OpenAI with deletion info", () => {
    const scan = makeScan({ services: [makeService("OpenAI", "ai", ["prompts"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("#### OpenAI"));
    assert.ok(result.includes("DELETE /v1/files/:id"));
  });

  it("includes known service Sentry with deletion info", () => {
    const scan = makeScan({ services: [makeService("Sentry", "monitoring", ["error traces"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("#### Sentry"));
    assert.ok(result.includes("Data Scrubber"));
  });

  it("includes known service PostHog with deletion info", () => {
    const scan = makeScan({ services: [makeService("PostHog", "analytics", ["usage data"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("#### PostHog"));
    assert.ok(result.includes("DELETE /api/person/:id/"));
  });

  it("includes known service Clerk with deletion info", () => {
    const scan = makeScan({ services: [makeService("Clerk", "auth", ["user credentials"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("#### Clerk"));
    assert.ok(result.includes("DELETE /v1/users/:id"));
  });

  it("includes known service Supabase with deletion info", () => {
    const scan = makeScan({ services: [makeService("Supabase", "auth", ["user data"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("#### Supabase"));
    assert.ok(result.includes("auth.users"));
  });

  it("includes known service SendGrid with deletion info", () => {
    const scan = makeScan({ services: [makeService("SendGrid", "email", ["email addresses"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("#### SendGrid"));
    assert.ok(result.includes("DELETE /v3/marketing/contacts"));
  });

  it("provides generic deletion steps for unknown services", () => {
    const scan = makeScan({ services: [makeService("CustomService", "analytics", ["data"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("#### CustomService"));
    assert.ok(result.includes("Log in to the CustomService admin dashboard"));
    assert.ok(result.includes("Locate the user/data record"));
    assert.ok(result.includes("Check CustomService's DPA for mandatory retention periods"));
  });

  it("shows data collected for each service", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["payment info", "billing address"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("**Data collected:** payment info, billing address"));
  });

  // ── Category labels ────────────────────────────────────────────────

  it("uses AI Services label for ai category", () => {
    const scan = makeScan({ services: [makeService("OpenAI", "ai", ["prompts"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("AI Services"));
  });

  it("uses Monitoring & Error Tracking label for monitoring category", () => {
    const scan = makeScan({ services: [makeService("Sentry", "monitoring", ["errors"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("Monitoring & Error Tracking"));
  });

  it("uses Email & Communication label for email category", () => {
    const scan = makeScan({ services: [makeService("SendGrid", "email", ["emails"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("Email & Communication"));
  });

  it("capitalizes unknown category label", () => {
    const scan = makeScan({ services: [makeService("Something", "social" as any, ["data"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("Social"));
  });

  // ── Section 5: Internal Database Deletion ──────────────────────────

  it("includes internal database deletion section with SQL examples", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("## 5. Internal Database Deletion"));
    assert.ok(result.includes("DELETE FROM users WHERE email"));
    assert.ok(result.includes("DELETE FROM user_sessions"));
    assert.ok(result.includes("COMMIT"));
  });

  // ── Section 6: Verification & Documentation ───────────────────────

  it("includes verification and documentation section", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("## 6. Verification & Documentation"));
    assert.ok(result.includes("Search for data subject"));
    assert.ok(result.includes("Confirm zero results"));
    assert.ok(result.includes("Update the DSAR register"));
  });

  it("includes DPO email in verification table", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const ctx: GeneratorContext = { companyName: "A", contactEmail: "a@a.com", dpoEmail: "dpo@acme.com" };
    const result = generateDataDeletionProcedures(scan, ctx)!;
    assert.ok(result.includes("Notify the DPO (dpo@acme.com)"));
  });

  // ── Section 7: Exceptions to Erasure ───────────────────────────────

  it("includes Art. 17(3) exceptions section", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("## 7. Exceptions to Erasure (Art. 17(3))"));
    assert.ok(result.includes("Freedom of expression"));
    assert.ok(result.includes("Legal obligation compliance"));
    assert.ok(result.includes("Legal claims"));
  });

  // ── Section 8: Backup & Replication Handling ───────────────────────

  it("includes backup and replication handling section", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("## 8. Backup & Replication Handling"));
    assert.ok(result.includes("Database backups"));
    assert.ok(result.includes("CDN caches"));
    assert.ok(result.includes("Search indices"));
  });

  // ── Section 9: Escalation ──────────────────────────────────────────

  it("includes escalation section with DPO details", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const ctx: GeneratorContext = { companyName: "A", contactEmail: "a@a.com", dpoName: "Jane Doe", dpoEmail: "dpo@acme.com" };
    const result = generateDataDeletionProcedures(scan, ctx)!;
    assert.ok(result.includes("## 9. Escalation"));
    assert.ok(result.includes("Jane Doe (dpo@acme.com)"));
    assert.ok(result.includes("Within 48 hours"));
    assert.ok(result.includes("Immediately"));
  });

  // ── Footer ─────────────────────────────────────────────────────────

  it("includes disclaimer footer", () => {
    const scan = makeScan({ services: [makeService("Stripe", "payment", ["cards"])] });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("Review with your DPO and legal counsel"));
  });

  // ── Multiple services ──────────────────────────────────────────────

  it("handles multiple services across different categories", () => {
    const scan = makeScan({
      services: [
        makeService("Stripe", "payment", ["payment info"]),
        makeService("OpenAI", "ai", ["prompts"]),
        makeService("Clerk", "auth", ["user credentials"]),
        makeService("Sentry", "monitoring", ["error traces"]),
      ],
    });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("#### Stripe"));
    assert.ok(result.includes("#### OpenAI"));
    assert.ok(result.includes("#### Clerk"));
    assert.ok(result.includes("#### Sentry"));
    assert.ok(result.includes("Payment Processing"));
    assert.ok(result.includes("AI Services"));
    assert.ok(result.includes("Authentication & Identity"));
    assert.ok(result.includes("Monitoring & Error Tracking"));
  });

  it("numbers category subsections sequentially", () => {
    const scan = makeScan({
      services: [
        makeService("Stripe", "payment", ["payment info"]),
        makeService("OpenAI", "ai", ["prompts"]),
      ],
    });
    const result = generateDataDeletionProcedures(scan)!;
    assert.ok(result.includes("### 4.1."));
    assert.ok(result.includes("### 4.2."));
  });
});
