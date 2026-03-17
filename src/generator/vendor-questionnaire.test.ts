import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateVendorSecurityQuestionnaire } from "./vendor-questionnaire.js";
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

describe("generateVendorSecurityQuestionnaire", () => {
  // ── Null guard ──────────────────────────────────────────────────────

  it("returns null when no services detected", () => {
    const result = generateVendorSecurityQuestionnaire(makeScan());
    assert.strictEqual(result, null);
  });

  // ── Basic generation ───────────────────────────────────────────────

  it("generates document when services are present", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(typeof result === "string");
    assert.ok(result.includes("# Vendor Security Questionnaire"));
  });

  it("includes SIG Lite format reference", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("SIG Lite"));
  });

  it("includes date in document", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result!));
  });

  // ── Context values ─────────────────────────────────────────────────

  it("uses company name from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ companyName: "TestCo Inc" });
    const result = generateVendorSecurityQuestionnaire(scan, ctx);
    assert.ok(result!.includes("TestCo Inc"));
  });

  it("uses contact email from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ contactEmail: "security@testco.com" });
    const result = generateVendorSecurityQuestionnaire(scan, ctx);
    assert.ok(result!.includes("security@testco.com"));
  });

  it("uses security email from context when provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ securityEmail: "sec@testco.com" });
    const result = generateVendorSecurityQuestionnaire(scan, ctx);
    assert.ok(result!.includes("sec@testco.com"));
  });

  it("falls back to contact email when no security email", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ contactEmail: "contact@testco.com" });
    const result = generateVendorSecurityQuestionnaire(scan, ctx);
    assert.ok(result!.includes("contact@testco.com"));
  });

  it("uses DPO name and email from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ dpoName: "Jane Smith", dpoEmail: "dpo@testco.com" });
    const result = generateVendorSecurityQuestionnaire(scan, ctx);
    assert.ok(result!.includes("Jane Smith"));
    assert.ok(result!.includes("dpo@testco.com"));
  });

  it("uses website from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ website: "https://testco.com" });
    const result = generateVendorSecurityQuestionnaire(scan, ctx);
    assert.ok(result!.includes("https://testco.com"));
  });

  it("uses default placeholders when no context provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("[Your Company Name]"));
    assert.ok(result!.includes("[your-email@example.com]"));
  });

  // ── Section structure ──────────────────────────────────────────────

  it("includes Company Information section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("## 1. Company Information"));
    assert.ok(result!.includes("Company legal name"));
  });

  it("includes Security Governance section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("## 2. Security Governance"));
    assert.ok(result!.includes("incident response plan"));
  });

  it("includes Certifications & Compliance section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("## 3. Certifications & Compliance"));
    assert.ok(result!.includes("SOC 2"));
    assert.ok(result!.includes("ISO 27001"));
  });

  it("includes Access Control section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("## 4. Access Control"));
    assert.ok(result!.includes("multi-factor authentication"));
  });

  it("includes Data Protection section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("## 5. Data Protection"));
    assert.ok(result!.includes("encrypted at rest"));
    assert.ok(result!.includes("encrypted in transit"));
  });

  it("includes Application Security section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("## 6. Application Security"));
    assert.ok(result!.includes("SDLC"));
  });

  it("includes Infrastructure Security section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("## 7. Infrastructure Security"));
  });

  it("includes Third-Party Risk Management section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("## 8. Third-Party Risk Management"));
    assert.ok(result!.includes("sub-processor"));
  });

  it("includes Incident Response section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("## 9. Incident Response"));
    assert.ok(result!.includes("72 hours"));
  });

  // ── Conditional: payment detection ─────────────────────────────────

  it("shows PCI DSS compliance via third party when payment detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("PCI DSS"));
    assert.ok(result!.includes("PCI-compliant third party"));
  });

  it("shows PCI DSS N/A when no payment detected", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("No payment processing detected"));
  });

  // ── Conditional: auth detection ────────────────────────────────────

  it("shows auth service names when auth detected", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("next-auth"));
    assert.ok(result!.includes("[AUTO] Yes — authentication implemented"));
  });

  it("shows manual auth question when no auth detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("Do you require authentication for access? | [MANUAL]"));
  });

  // ── Conditional: database detection ────────────────────────────────

  it("shows database services when database detected", () => {
    const scan = makeScan({
      services: [makeService("firebase", "database")],
    });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("firebase"));
    assert.ok(result!.includes("Database services detected"));
  });

  it("shows manual storage question when no database detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("[DESCRIBE DATA STORAGE]"));
  });

  // ── Conditional: storage detection ─────────────────────────────────

  it("shows storage services when storage detected", () => {
    const scan = makeScan({
      services: [makeService("@aws-sdk/client-s3", "storage")],
    });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("@aws-sdk/client-s3"));
    assert.ok(result!.includes("cloud storage"));
  });

  // ── Conditional: encryption detection ──────────────────────────────

  it("shows KMS detected when encryption service found", () => {
    const scan = makeScan({
      services: [makeService("aws-kms", "storage")],
    });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("KMS service detected"));
  });

  it("shows manual KMS question when no encryption detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("key management service? | [MANUAL]"));
  });

  // ── Conditional: monitoring detection ──────────────────────────────

  it("shows monitoring services when monitoring detected", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("@sentry/node"));
    assert.ok(result!.includes("error monitoring"));
  });

  it("shows manual monitoring question when none detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("error monitoring / observability? | [MANUAL]"));
  });

  // ── Conditional: AI section ────────────────────────────────────────

  it("includes AI section when AI service detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts", "conversation data"])],
    });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("## 10. AI & Machine Learning"));
    assert.ok(result!.includes("openai"));
    assert.ok(result!.includes("user prompts"));
  });

  it("omits AI section when no AI service detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(!result!.includes("AI & Machine Learning"));
  });

  it("privacy section number adjusts when AI present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("## 11. Privacy & Data Subject Rights"));
  });

  it("privacy section number adjusts when AI absent", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("## 10. Privacy & Data Subject Rights"));
  });

  // ── Conditional: analytics detection ───────────────────────────────

  it("includes consent question when analytics detected", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("consent for analytics/tracking"));
  });

  it("omits consent question when no analytics detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(!result!.includes("consent for analytics/tracking"));
  });

  // ── Third-party count ──────────────────────────────────────────────

  it("reflects correct sub-processor count", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("3 sub-processor(s) detected"));
  });

  it("excludes non-data-processor services from count", () => {
    const svc = makeService("eslint", "other");
    (svc as any).isDataProcessor = false;
    const scan = makeScan({
      services: [makeService("stripe", "payment"), svc],
    });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("1 sub-processor(s) detected"));
  });

  // ── Legend ──────────────────────────────────────────────────────────

  it("includes AUTO and MANUAL legend", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("[AUTO]"));
    assert.ok(result!.includes("[MANUAL]"));
    assert.ok(result!.includes("Legend"));
  });

  // ── Disclaimer ─────────────────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("Codepliant"));
  });

  it("includes project name in disclaimer", () => {
    const scan = makeScan({
      projectName: "my-saas",
      services: [makeService("stripe", "payment")],
    });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("my-saas"));
  });

  it("includes security assessment disclaimer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateVendorSecurityQuestionnaire(scan);
    assert.ok(result!.includes("not a substitute for a formal security assessment"));
  });
});
