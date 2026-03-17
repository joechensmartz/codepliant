import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateDataProtectionPolicy } from "./data-protection-policy.js";
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

describe("generateDataProtectionPolicy", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when no services detected", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateDataProtectionPolicy(scan), null);
  });

  // ── Generation with services ───────────────────────────────────────

  it("generates policy when services are detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateDataProtectionPolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Data Protection Policy"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  // ── Context values ────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "legal@acme.com" };
    const result = generateDataProtectionPolicy(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "legal@acme.com" };
    const result = generateDataProtectionPolicy(scan, ctx)!;
    assert.ok(result.includes("legal@acme.com"));
  });

  it("uses context DPO name", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "legal@acme.com",
      dpoName: "Jane Smith",
    };
    const result = generateDataProtectionPolicy(scan, ctx)!;
    assert.ok(result.includes("Jane Smith"));
  });

  it("uses context DPO email", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "legal@acme.com",
      dpoEmail: "dpo@acme.com",
    };
    const result = generateDataProtectionPolicy(scan, ctx)!;
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("falls back dpoEmail to contactEmail when not provided", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "contact@acme.com" };
    const result = generateDataProtectionPolicy(scan, ctx)!;
    // DPO contact line should use contactEmail as fallback
    assert.ok(result.includes("contact@acme.com"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses placeholder email when no context", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses placeholder DPO name when no context", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("[Data Protection Officer Name]"));
  });

  // ── Key content sections ──────────────────────────────────────────

  it("includes Purpose and Scope section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("## 1. Purpose and Scope"));
  });

  it("includes Data Classification section with classification table", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("## 2. Data Classification"));
    assert.ok(result.includes("Restricted"));
    assert.ok(result.includes("Confidential"));
    assert.ok(result.includes("Internal"));
    assert.ok(result.includes("Public"));
  });

  it("includes Data Handling Procedures section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("## 3. Data Handling Procedures"));
    assert.ok(result.includes("### 3.1 Collection"));
    assert.ok(result.includes("### 3.2 Storage"));
    assert.ok(result.includes("### 3.3 Transmission"));
    assert.ok(result.includes("### 3.4 Processing"));
  });

  it("includes Access Control section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("## 4. Access Control"));
    assert.ok(result.includes("Least Privilege"));
    assert.ok(result.includes("Need-to-Know"));
  });

  it("includes Data Disposal section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("## 5. Data Disposal"));
    assert.ok(result.includes("Retention Periods"));
    assert.ok(result.includes("Disposal Methods"));
    assert.ok(result.includes("Disposal Verification"));
  });

  it("includes Data Protection Incidents section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("## 6. Data Protection Incidents"));
    assert.ok(result.includes("72 hours"));
    assert.ok(result.includes("GDPR Art. 33"));
  });

  it("includes Training and Awareness section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("## 7. Training and Awareness"));
  });

  it("includes Third-Party Data Processors section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("## 8. Third-Party Data Processors"));
    assert.ok(result.includes("Data Processing Agreement"));
  });

  it("includes Compliance and Monitoring section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("## 9. Compliance and Monitoring"));
  });

  it("includes Roles and Responsibilities section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("## 10. Roles and Responsibilities"));
    assert.ok(result.includes("Data Protection Officer"));
  });

  it("includes Contact section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("## 11. Contact"));
  });

  // ── Conditional sections: payment ─────────────────────────────────

  it("includes payment data classifications when payment service present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("Payment card details"));
    assert.ok(result.includes("Billing address"));
    assert.ok(result.includes("Transaction history"));
  });

  it("includes payment retention period when payment service present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("7 years"));
  });

  it("excludes payment data when no payment service", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["prompts"])],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(!result.includes("Payment card details"));
    assert.ok(!result.includes("Transaction history"));
  });

  // ── Conditional sections: auth ────────────────────────────────────

  it("includes auth data classifications when auth service present", () => {
    const scan = makeScan({
      services: [makeService("@clerk/nextjs", "auth", ["user identity"])],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("Authentication credentials"));
    assert.ok(result.includes("Session tokens"));
  });

  it("includes MFA requirement when auth service present", () => {
    const scan = makeScan({
      services: [makeService("@clerk/nextjs", "auth")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("Multi-factor authentication"));
  });

  it("includes account data retention when auth service present", () => {
    const scan = makeScan({
      services: [makeService("@clerk/nextjs", "auth")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("Account data"));
    assert.ok(result.includes("Duration of account + 30 days"));
  });

  it("excludes auth data when no auth service", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(!result.includes("Authentication credentials"));
    assert.ok(!result.includes("Session tokens"));
  });

  // ── Conditional sections: AI ──────────────────────────────────────

  it("includes AI data classifications when AI service present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("AI input data"));
    assert.ok(result.includes("AI-generated outputs"));
  });

  it("includes AI processing rules when AI service present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("AI models must not be trained on customer personal data"));
  });

  it("includes AI retention period when AI service present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("AI interaction data"));
    assert.ok(result.includes("90 days"));
  });

  it("excludes AI data when no AI service", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(!result.includes("AI input data"));
    assert.ok(!result.includes("AI models must not be trained"));
  });

  // ── Conditional sections: analytics ───────────────────────────────

  it("includes analytics data classifications when analytics service present", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("Usage analytics"));
    assert.ok(result.includes("IP addresses"));
  });

  it("includes analytics processing rules when analytics service present", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("Analytics data must be anonymized"));
  });

  it("includes analytics retention period when analytics present", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("26 months"));
  });

  it("excludes analytics data when no analytics service", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(!result.includes("Usage analytics"));
  });

  // ── Conditional sections: storage ─────────────────────────────────

  it("includes storage data classifications when storage service present", () => {
    const scan = makeScan({
      services: [makeService("@aws-sdk/client-s3", "storage", ["files"])],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("Uploaded files and media"));
  });

  it("includes storage handling rules when storage service present", () => {
    const scan = makeScan({
      services: [makeService("@aws-sdk/client-s3", "storage")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("scanned for malware"));
    assert.ok(result.includes("not be publicly accessible"));
  });

  it("excludes storage data when no storage service", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(!result.includes("Uploaded files and media"));
  });

  // ── Conditional sections: database ────────────────────────────────

  it("includes database data classifications when database service present", () => {
    const scan = makeScan({
      services: [makeService("@supabase/supabase-js", "database", ["user records"])],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("User profile data"));
    assert.ok(result.includes("Application data"));
  });

  it("includes database handling rules when database service present", () => {
    const scan = makeScan({
      services: [makeService("@supabase/supabase-js", "database")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("parameterized queries"));
    assert.ok(result.includes("Database backups must be encrypted"));
  });

  it("excludes database data when no database service", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(!result.includes("parameterized queries"));
  });

  // ── Conditional sections: email ───────────────────────────────────

  it("includes email data classifications when email service present", () => {
    const scan = makeScan({
      services: [makeService("@sendgrid/mail", "email", ["email address"])],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("Email addresses"));
    assert.ok(result.includes("Communication records"));
  });

  it("includes email retention when email service present", () => {
    const scan = makeScan({
      services: [makeService("@sendgrid/mail", "email")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("Email communications"));
    assert.ok(result.includes("3 years"));
  });

  // ── Conditional sections: monitoring ──────────────────────────────

  it("includes monitoring data classifications when monitoring service present", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring", ["error traces"])],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("Error reports"));
    assert.ok(result.includes("Performance metrics"));
  });

  it("includes monitoring retention when monitoring service present", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("Error logs and monitoring data"));
  });

  // ── Currently Engaged Processors table ────────────────────────────

  it("includes engaged processors table when 3+ services present", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("openai", "ai", ["prompts"]),
        makeService("@sentry/node", "monitoring", ["errors"]),
      ],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("Currently Engaged Processors"));
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("openai"));
  });

  it("excludes self-hosted database services from engaged processors table", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("prisma", "database"),
      ],
    });
    const result = generateDataProtectionPolicy(scan)!;
    // prisma is filtered out as a known self-hosted DB
    const tableSection = result.split("Currently Engaged Processors")[1]?.split("##")[0] || "";
    assert.ok(!tableSection.includes("prisma"));
  });

  it("omits engaged processors table when fewer than 3 services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(!result.includes("Currently Engaged Processors"));
  });

  // ── All conditional sections together ─────────────────────────────

  it("includes all conditional content with all service categories", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("@clerk/nextjs", "auth", ["user identity"]),
        makeService("openai", "ai", ["user prompts"]),
        makeService("posthog", "analytics", ["page views"]),
        makeService("@aws-sdk/client-s3", "storage", ["files"]),
        makeService("@supabase/supabase-js", "database", ["user records"]),
        makeService("@sendgrid/mail", "email", ["email address"]),
        makeService("@sentry/node", "monitoring", ["error traces"]),
      ],
    });
    const result = generateDataProtectionPolicy(scan)!;
    // All conditional data classification rows present
    assert.ok(result.includes("Payment card details"));
    assert.ok(result.includes("Authentication credentials"));
    assert.ok(result.includes("AI input data"));
    assert.ok(result.includes("Usage analytics"));
    assert.ok(result.includes("Uploaded files and media"));
    assert.ok(result.includes("User profile data"));
    assert.ok(result.includes("Email addresses"));
    assert.ok(result.includes("Error reports"));
    // All conditional handling rules present
    assert.ok(result.includes("parameterized queries"));
    assert.ok(result.includes("scanned for malware"));
    assert.ok(result.includes("AI models must not be trained"));
    assert.ok(result.includes("Analytics data must be anonymized"));
    assert.ok(result.includes("Multi-factor authentication"));
  });

  // ── Disclaimer ────────────────────────────────────────────────────

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataProtectionPolicy(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("auto-generated"));
  });
});
