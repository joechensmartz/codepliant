import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateIncidentResponsePlan } from "./incident-response.js";
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

describe("generateIncidentResponsePlan", () => {
  // ── Always generates (never returns null) ─────────────────────────

  it("always returns a string (never null), even with empty services", () => {
    const scan = makeScan({ services: [] });
    const result = generateIncidentResponsePlan(scan);
    assert.ok(typeof result === "string");
    assert.ok(result.length > 0);
  });

  it("generates plan with no services", () => {
    const scan = makeScan();
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("Incident Response Plan"));
  });

  it("generates plan with only database services", () => {
    const scan = makeScan({
      services: [makeService("prisma", "database", ["user records"])],
    });
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("Incident Response Plan"));
  });

  // ── Context values ────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "sec@acme.com" };
    const result = generateIncidentResponsePlan(scan, ctx);
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan();
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context contact email", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "sec@acme.com" };
    const result = generateIncidentResponsePlan(scan, ctx);
    assert.ok(result.includes("sec@acme.com"));
  });

  it("uses context security email when provided", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "info@acme.com", securityEmail: "security@acme.com" };
    const result = generateIncidentResponsePlan(scan, ctx);
    assert.ok(result.includes("security@acme.com"));
  });

  it("falls back to contact email when no security email", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "info@acme.com" };
    const result = generateIncidentResponsePlan(scan, ctx);
    assert.ok(result.includes("info@acme.com"));
  });

  it("uses context DPO name", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", dpoName: "Jane Smith" };
    const result = generateIncidentResponsePlan(scan, ctx);
    assert.ok(result.includes("Jane Smith"));
  });

  it("uses placeholder DPO name when no context", () => {
    const scan = makeScan();
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("[Data Protection Officer Name]"));
  });

  it("uses context DPO email", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", dpoEmail: "dpo@acme.com" };
    const result = generateIncidentResponsePlan(scan, ctx);
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("uses context website", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", website: "https://acme.com" };
    const result = generateIncidentResponsePlan(scan, ctx);
    assert.ok(result.includes("https://acme.com"));
  });

  it("uses placeholder website when no context", () => {
    const scan = makeScan();
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("[https://yoursite.com]"));
  });

  // ── Date ──────────────────────────────────────────────────────────

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan();
    const result = generateIncidentResponsePlan(scan);
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  // ── Section 1: Incident Classification ────────────────────────────

  it("includes incident classification table with severity levels", () => {
    const scan = makeScan();
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("Incident Classification"));
    assert.ok(result.includes("Critical (P1)"));
    assert.ok(result.includes("High (P2)"));
    assert.ok(result.includes("Medium (P3)"));
    assert.ok(result.includes("Low (P4)"));
  });

  it("includes response times in classification table", () => {
    const scan = makeScan();
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("within 1 hour") || result.includes("Immediate"));
    assert.ok(result.includes("4 hours"));
    assert.ok(result.includes("24 hours"));
    assert.ok(result.includes("72 hours"));
  });

  // ── Section 2: Detection and Reporting ────────────────────────────

  it("includes detection and reporting procedures", () => {
    const scan = makeScan();
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("Detection and Reporting"));
    assert.ok(result.includes("How to Report"));
  });

  it("includes information to include in a report", () => {
    const scan = makeScan();
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("Date and time"));
    assert.ok(result.includes("Description of what occurred"));
  });

  // ── Section 3: GDPR 72-Hour Notification ──────────────────────────

  it("includes GDPR 72-hour notification section", () => {
    const scan = makeScan();
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("GDPR 72-Hour"));
    assert.ok(result.includes("Article 33"));
    assert.ok(result.includes("72 hours"));
  });

  it("includes notification timeline milestones", () => {
    const scan = makeScan();
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("T = 0"));
    assert.ok(result.includes("T + 24 hours"));
    assert.ok(result.includes("T + 72 hours"));
  });

  // ── Section 4: Authority Notification Template ────────────────────

  it("includes authority notification template", () => {
    const scan = makeScan();
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("Authority Notification Template"));
    assert.ok(result.includes("PERSONAL DATA BREACH NOTIFICATION"));
  });

  it("includes company name in notification template", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generateIncidentResponsePlan(scan, ctx);
    // Should appear in the template block
    assert.ok(result.includes("Organization: Acme Corp"));
  });

  // ── Section 5: User Notification Template ─────────────────────────

  it("includes user notification template", () => {
    const scan = makeScan();
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("User Notification Template"));
    assert.ok(result.includes("Dear [User Name]"));
  });

  it("includes company name in user notification", () => {
    const scan = makeScan();
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generateIncidentResponsePlan(scan, ctx);
    assert.ok(result.includes("Important Security Notice from Acme Corp"));
  });

  // ── Section 6: Investigation Procedures ───────────────────────────

  it("includes investigation procedures with containment checklist", () => {
    const scan = makeScan();
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("Investigation Procedures"));
    assert.ok(result.includes("Containment"));
    assert.ok(result.includes("Isolate affected systems"));
  });

  it("includes investigation sub-section", () => {
    const scan = makeScan();
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("root cause"));
    assert.ok(result.includes("access logs") || result.includes("audit trails"));
  });

  // ── Section 7: Remediation Steps ──────────────────────────────────

  it("includes remediation steps", () => {
    const scan = makeScan();
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("Remediation Steps"));
    assert.ok(result.includes("Patch or fix"));
    assert.ok(result.includes("Rotate all potentially compromised"));
  });

  // ── Section 8: Post-Incident Review ───────────────────────────────

  it("includes post-incident review section", () => {
    const scan = makeScan();
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("Post-Incident Review"));
    assert.ok(result.includes("5 business days"));
    assert.ok(result.includes("Root cause analysis"));
  });

  // ── Section 9: Contact List ───────────────────────────────────────

  it("includes contact list table", () => {
    const scan = makeScan();
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("Contact List"));
    assert.ok(result.includes("Incident Response Lead"));
    assert.ok(result.includes("Data Protection Officer"));
    assert.ok(result.includes("Engineering Lead"));
    assert.ok(result.includes("Legal Counsel"));
  });

  // ── Conditional: AI Incident Handling ─────────────────────────────

  it("includes AI incident handling when AI services detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("AI Incident Handling"));
    assert.ok(result.includes("Prompt injection"));
    assert.ok(result.includes("Bias incident"));
    assert.ok(result.includes("Hallucination"));
  });

  it("includes AI incident response steps", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("Disable or throttle"));
    assert.ok(result.includes("Notify AI provider"));
  });

  it("does not include AI section when no AI services present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateIncidentResponsePlan(scan);
    assert.ok(!result.includes("AI Incident Handling"));
  });

  // ── Conditional: PCI Incident Procedures ──────────────────────────

  it("includes PCI section when payment services detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("PCI DSS Incident Procedures"));
    assert.ok(result.includes("cardholder data"));
    assert.ok(result.includes("24 hours"));
  });

  it("includes PCI breach checklist", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("Payment Data Breach Checklist"));
    assert.ok(result.includes("primary account numbers") || result.includes("PAN"));
  });

  it("does not include PCI section when no payment services", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateIncidentResponsePlan(scan);
    assert.ok(!result.includes("PCI DSS Incident Procedures"));
  });

  // ── Conditional: HIPAA Breach Notification ────────────────────────

  it("includes HIPAA section when health compliance need detected", () => {
    const scan = makeScan({
      complianceNeeds: [
        { document: "HIPAA Compliance", reason: "Health data processing", priority: "required" },
      ],
    });
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("HIPAA Breach Notification"));
    assert.ok(result.includes("60 days") || result.includes("Within 60 days"));
    assert.ok(result.includes("HHS Secretary") || result.includes("HHS"));
  });

  it("includes HIPAA breach assessment criteria", () => {
    const scan = makeScan({
      complianceNeeds: [
        { document: "HIPAA Compliance", reason: "Health data", priority: "required" },
      ],
    });
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("HIPAA Breach Assessment"));
    assert.ok(result.includes("re-identification"));
    assert.ok(result.includes("low probability"));
  });

  it("does not include HIPAA section when no health compliance need", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
      complianceNeeds: [
        { document: "PCI DSS", reason: "Payment processing", priority: "required" },
      ],
    });
    const result = generateIncidentResponsePlan(scan);
    assert.ok(!result.includes("HIPAA Breach Notification"));
  });

  // ── Multiple conditional sections ─────────────────────────────────

  it("includes all conditional sections when AI + payment + health present", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment info"]),
      ],
      complianceNeeds: [
        { document: "HIPAA Compliance", reason: "Health data processing", priority: "required" },
      ],
    });
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("AI Incident Handling"));
    assert.ok(result.includes("PCI DSS Incident Procedures"));
    assert.ok(result.includes("HIPAA Breach Notification"));
  });

  it("numbers AI section as 10 when present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("## 10. AI Incident Handling"));
  });

  it("numbers PCI section as 11 when AI is also present", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment info"]),
      ],
    });
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("## 11. PCI DSS Incident Procedures"));
  });

  it("numbers PCI section as 10 when AI is not present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("## 10. PCI DSS Incident Procedures"));
  });

  it("numbers HIPAA section correctly with all three conditional sections", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment info"]),
      ],
      complianceNeeds: [
        { document: "HIPAA Compliance", reason: "Health data", priority: "required" },
      ],
    });
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("## 12. HIPAA Breach Notification"));
  });

  // ── Disclaimer ────────────────────────────────────────────────────

  it("includes legal disclaimer", () => {
    const scan = makeScan();
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("reviewed") || result.includes("customized"));
  });

  it("includes project name in disclaimer", () => {
    const scan = makeScan();
    const result = generateIncidentResponsePlan(scan);
    assert.ok(result.includes("test-project"));
  });
});
