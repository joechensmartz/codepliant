import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateComplianceOnboardingGuide } from "./compliance-onboarding-guide.js";
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

describe("generateComplianceOnboardingGuide", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateComplianceOnboardingGuide(scan), null);
  });

  // ── Generation with services ───────────────────────────────────────

  it("generates guide with a single service", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(result !== null);
    assert.ok(result.includes("# Compliance Onboarding Guide"));
  });

  it("generates guide with multiple services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(result.includes("# Compliance Onboarding Guide"));
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("posthog"));
    assert.ok(result.includes("openai"));
  });

  // ── Context values ─────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generateComplianceOnboardingGuide(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "privacy@acme.com" };
    const result = generateComplianceOnboardingGuide(scan, ctx)!;
    assert.ok(result.includes("privacy@acme.com"));
  });

  it("uses placeholder contact email when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  // ── Key Contacts section ───────────────────────────────────────────

  it("includes Key Contacts section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(result.includes("## 2. Key Contacts"));
    assert.ok(result.includes("Privacy / Compliance Lead"));
  });

  it("includes DPO row when dpoName provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      dpoName: "Jane DPO",
    };
    const result = generateComplianceOnboardingGuide(scan, ctx)!;
    assert.ok(result.includes("Data Protection Officer"));
    assert.ok(result.includes("Jane DPO"));
  });

  it("includes DPO row when dpoEmail provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      dpoEmail: "dpo@acme.com",
    };
    const result = generateComplianceOnboardingGuide(scan, ctx)!;
    assert.ok(result.includes("Data Protection Officer"));
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("does not include DPO row when neither dpoName nor dpoEmail provided", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(!result.includes("Data Protection Officer"));
  });

  it("uses securityEmail from context for Security Team", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      securityEmail: "security@acme.com",
    };
    const result = generateComplianceOnboardingGuide(scan, ctx)!;
    assert.ok(result.includes("security@acme.com"));
  });

  // ── Services section ───────────────────────────────────────────────

  it("includes Services That Process User Data section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(result.includes("## 3. Services That Process User Data"));
  });

  it("shows service name, category, and data collected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["billing address", "email"])],
    });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("Payment Processing"));
    assert.ok(result.includes("billing address, email"));
  });

  it("formats category labels correctly", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
        makeService("clerk", "auth"),
      ],
    });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(result.includes("AI Service"));
    assert.ok(result.includes("Analytics"));
    assert.ok(result.includes("Authentication"));
  });

  it("shows total service count", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(result.includes("**Total services:** 2"));
  });

  // ── Required Reading section ───────────────────────────────────────

  it("includes Required Reading section with all phases", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(result.includes("## 4. Required Reading"));
    assert.ok(result.includes("### Day 1"));
    assert.ok(result.includes("### Week 1"));
    assert.ok(result.includes("### Week 2"));
    assert.ok(result.includes("### Month 1"));
  });

  it("lists Day 1 documents", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(result.includes("Privacy Policy"));
    assert.ok(result.includes("Acceptable Use Policy"));
    assert.ok(result.includes("Security Policy"));
  });

  it("includes AI-specific reading when AI services detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(result.includes("AI-Specific Reading"));
    assert.ok(result.includes("AI Disclosure"));
    assert.ok(result.includes("Acceptable AI Use Policy"));
    assert.ok(result.includes("AI Governance Framework"));
  });

  it("does not include AI-specific reading without AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(!result.includes("AI-Specific Reading"));
  });

  // ── Key Policies section ───────────────────────────────────────────

  it("includes Data Handling Rules", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(result.includes("### Data Handling Rules"));
    assert.ok(result.includes("Never** store personal data in logs"));
  });

  it("includes Access & Authentication rules", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(result.includes("### Access & Authentication"));
    assert.ok(result.includes("Enable MFA"));
  });

  it("includes Incident Response rules", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(result.includes("### Incident Response"));
    assert.ok(result.includes("72 hours"));
  });

  it("includes Payment Data section when payment services detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(result.includes("### Payment Data (PCI DSS)"));
    assert.ok(result.includes("Never log, screenshot, or store raw payment card numbers"));
  });

  it("does not include Payment Data section without payment services", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(!result.includes("### Payment Data (PCI DSS)"));
  });

  it("includes AI Usage Rules when AI services detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(result.includes("### AI Usage Rules"));
    assert.ok(result.includes("EU AI Act Art. 50"));
  });

  it("does not include AI Usage Rules without AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(!result.includes("### AI Usage Rules"));
  });

  // ── Onboarding Checklist section ───────────────────────────────────

  it("includes Onboarding Checklist section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(result.includes("## 6. Onboarding Checklist"));
    assert.ok(result.includes("- [ ] Read all Day 1 documents"));
    assert.ok(result.includes("- [ ] Enable MFA"));
  });

  it("includes AI checklist item when AI services detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(result.includes("- [ ] Read AI-specific documents"));
  });

  it("does not include AI checklist item without AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(!result.includes("Read AI-specific documents"));
  });

  // ── FAQ section ────────────────────────────────────────────────────

  it("includes FAQ section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(result.includes("## 7. Frequently Asked Questions"));
  });

  it("shows AI-positive FAQ answer when AI detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(result.includes("Yes, within the boundaries of our Acceptable AI Use Policy"));
  });

  it("shows AI-negative FAQ answer when no AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(result.includes("Check with the compliance lead"));
  });

  // ── Footer ─────────────────────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(result.includes("Codepliant"));
  });

  it("includes review disclaimer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceOnboardingGuide(scan)!;
    assert.ok(result.includes("reviewed by your compliance and HR teams"));
  });

  // ── Comprehensive test ─────────────────────────────────────────────

  it("generates comprehensive guide with all service categories", () => {
    const scan = makeScan({
      services: [
        makeService("clerk", "auth", ["email", "OAuth tokens"]),
        makeService("stripe", "payment", ["billing address"]),
        makeService("openai", "ai", ["user prompts"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      dpoName: "Jane DPO",
      dpoEmail: "dpo@acme.com",
      securityEmail: "security@acme.com",
    };
    const result = generateComplianceOnboardingGuide(scan, ctx)!;
    // Context values
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("privacy@acme.com"));
    assert.ok(result.includes("Jane DPO"));
    assert.ok(result.includes("dpo@acme.com"));
    assert.ok(result.includes("security@acme.com"));
    // Service categories
    assert.ok(result.includes("Authentication"));
    assert.ok(result.includes("Payment Processing"));
    assert.ok(result.includes("AI Service"));
    assert.ok(result.includes("Analytics"));
    // Conditional sections
    assert.ok(result.includes("### Payment Data (PCI DSS)"));
    assert.ok(result.includes("### AI Usage Rules"));
    assert.ok(result.includes("AI-Specific Reading"));
    assert.ok(result.includes("- [ ] Read AI-specific documents"));
    // FAQ
    assert.ok(result.includes("Yes, within the boundaries of our Acceptable AI Use Policy"));
  });
});
