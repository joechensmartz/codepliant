import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateRegulatoryCorrespondenceLog } from "./regulatory-correspondence-log.js";
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

describe("generateRegulatoryCorrespondenceLog", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateRegulatoryCorrespondenceLog(scan), null);
  });

  // ── Basic generation ───────────────────────────────────────────────

  it("generates document with a single service", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result !== null);
    assert.ok(result.includes("# Regulatory Correspondence Log"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes project name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("test-project"));
  });

  // ── Context values ─────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generateRegulatoryCorrespondenceLog(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context DPO name and email", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      dpoName: "Jane Doe",
      dpoEmail: "jane@acme.com",
    };
    const result = generateRegulatoryCorrespondenceLog(scan, ctx)!;
    assert.ok(result.includes("Jane Doe"));
    assert.ok(result.includes("jane@acme.com"));
  });

  it("uses placeholder DPO name when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("[Data Protection Officer Name]"));
  });

  it("uses placeholder DPO email when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("[dpo@example.com]"));
  });

  // ── Header and intro ───────────────────────────────────────────────

  it("includes GDPR accountability reference", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("GDPR accountability requirement"));
    assert.ok(result.includes("Art. 5(2)"));
  });

  it("includes retention notice", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("minimum of 6 years"));
  });

  // ── Section 1: Correspondence Register ─────────────────────────────

  it("includes Correspondence Register section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("## 1. Correspondence Register"));
  });

  it("includes correspondence table with required columns", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("Date"));
    assert.ok(result.includes("Direction"));
    assert.ok(result.includes("Authority"));
    assert.ok(result.includes("Topic"));
    assert.ok(result.includes("Reference No."));
    assert.ok(result.includes("Follow-Up Deadline"));
    assert.ok(result.includes("Status"));
  });

  // ── Section 2: Communication Categories ────────────────────────────

  it("includes Communication Categories section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("## 2. Communication Categories"));
  });

  it("includes data breach notification category", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("Data Breach Notification"));
    assert.ok(result.includes("72 hours"));
  });

  it("includes DSAR escalation category", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("DSAR Escalation"));
  });

  it("includes proactive consultation category", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("Proactive Consultation"));
    assert.ok(result.includes("Art. 36"));
  });

  it("includes AI incident report category when AI detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("AI Incident Report"));
    assert.ok(result.includes("EU AI Act Art. 62"));
  });

  it("does not include AI incident report without AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(!result.includes("AI Incident Report"));
  });

  // ── Section 3: Relevant Authorities ────────────────────────────────

  it("includes Relevant Regulatory Authorities section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("## 3. Relevant Regulatory Authorities"));
  });

  it("shows EU authorities when EU jurisdiction specified", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      jurisdictions: ["eu"],
    };
    const result = generateRegulatoryCorrespondenceLog(scan, ctx)!;
    assert.ok(result.includes("Lead Supervisory Authority"));
    assert.ok(result.includes("EDPB"));
    assert.ok(result.includes("ICO"));
  });

  it("shows EU authorities when GDPR jurisdiction specified", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      jurisdictions: ["gdpr"],
    };
    const result = generateRegulatoryCorrespondenceLog(scan, ctx)!;
    assert.ok(result.includes("Lead Supervisory Authority"));
    assert.ok(result.includes("EDPB"));
  });

  it("shows EU authorities when UK jurisdiction specified", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      jurisdictions: ["uk"],
    };
    const result = generateRegulatoryCorrespondenceLog(scan, ctx)!;
    assert.ok(result.includes("ICO"));
  });

  it("shows US authorities when US jurisdiction specified", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      jurisdictions: ["us"],
    };
    const result = generateRegulatoryCorrespondenceLog(scan, ctx)!;
    assert.ok(result.includes("FTC"));
    assert.ok(result.includes("CA AG / CPPA"));
  });

  it("shows US authorities when CCPA jurisdiction specified", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      jurisdictions: ["ccpa"],
    };
    const result = generateRegulatoryCorrespondenceLog(scan, ctx)!;
    assert.ok(result.includes("FTC"));
  });

  it("shows both EU and US authorities when no jurisdictions specified", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("Lead Supervisory Authority"));
    assert.ok(result.includes("FTC"));
  });

  it("shows PCI SSC when payment detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("PCI SSC"));
    assert.ok(result.includes("pcisecuritystandards.org"));
  });

  it("does not show PCI SSC without payment services", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(!result.includes("PCI SSC"));
  });

  it("shows AI Office when AI detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("AI Office"));
    assert.ok(result.includes("EU AI Act"));
  });

  it("does not show AI Office without AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(!result.includes("AI Office"));
  });

  // ── Section 4: Breach Notification Tracking ────────────────────────

  it("includes Breach Notification Tracking section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("## 4. Breach Notification Tracking"));
  });

  it("includes 72 hour deadline column", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("Within 72h?"));
  });

  // ── Section 5: Audit and Inspection Log ────────────────────────────

  it("includes Audit and Inspection Log section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("## 5. Audit and Inspection Log"));
  });

  it("includes audit type column", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("On-site/Remote/Document"));
  });

  // ── Section 6: Open Follow-Up Actions ──────────────────────────────

  it("includes Open Follow-Up Actions section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("## 6. Open Follow-Up Actions"));
  });

  it("includes priority column", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("High/Medium/Low"));
  });

  // ── Section 7: Escalation Procedures ───────────────────────────────

  it("includes Escalation Procedures section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("## 7. Escalation Procedures"));
  });

  it("includes inbound communication procedure", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("### 7.1 Inbound Communication"));
    assert.ok(result.includes("forwarded to the DPO within 4 hours"));
  });

  it("includes proactive notifications procedure", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("### 7.2 Proactive Notifications"));
    assert.ok(result.includes("Legal Counsel and Executive Sponsor approve"));
  });

  // ── Section 8: Annual Summary ──────────────────────────────────────

  it("includes Annual Summary section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("## 8. Annual Summary"));
  });

  it("includes annual summary metrics", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("Total regulatory communications"));
    assert.ok(result.includes("Breach notifications filed"));
    assert.ok(result.includes("Audits/inspections completed"));
    assert.ok(result.includes("Average response time"));
  });

  // ── Section 9: Contact ─────────────────────────────────────────────

  it("includes Contact section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("## 9. Contact"));
  });

  it("includes DPO in contact table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("Data Protection Officer"));
  });

  it("includes Legal Counsel placeholder in contact table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("Legal Counsel"));
  });

  it("includes context contact email in contact table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "info@acme.com" };
    const result = generateRegulatoryCorrespondenceLog(scan, ctx)!;
    assert.ok(result.includes("info@acme.com"));
  });

  // ── Jurisdiction from context.jurisdiction ─────────────────────────

  it("uses jurisdiction field from context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      jurisdiction: "eu",
      jurisdictions: [],
    };
    const result = generateRegulatoryCorrespondenceLog(scan, ctx)!;
    assert.ok(result.includes("Lead Supervisory Authority"));
    assert.ok(result.includes("EDPB"));
  });

  it("combines jurisdiction and jurisdictions fields", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      jurisdiction: "eu",
      jurisdictions: ["us"],
    };
    const result = generateRegulatoryCorrespondenceLog(scan, ctx)!;
    assert.ok(result.includes("Lead Supervisory Authority")); // EU
    assert.ok(result.includes("FTC")); // US
  });

  // ── Footer ─────────────────────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("Codepliant"));
  });

  it("includes review disclaimer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateRegulatoryCorrespondenceLog(scan)!;
    assert.ok(result.includes("reviewed and customized by your legal and compliance teams"));
  });

  // ── Comprehensive test ─────────────────────────────────────────────

  it("generates comprehensive log with all features enabled", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("posthog", "analytics"),
      ],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      dpoName: "Jane Doe",
      dpoEmail: "jane@acme.com",
      jurisdictions: ["eu", "us"],
    };
    const result = generateRegulatoryCorrespondenceLog(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("Jane Doe"));
    assert.ok(result.includes("jane@acme.com"));
    // EU authorities
    assert.ok(result.includes("Lead Supervisory Authority"));
    assert.ok(result.includes("EDPB"));
    assert.ok(result.includes("ICO"));
    // US authorities
    assert.ok(result.includes("FTC"));
    assert.ok(result.includes("CA AG / CPPA"));
    // Payment
    assert.ok(result.includes("PCI SSC"));
    // AI
    assert.ok(result.includes("AI Office"));
    assert.ok(result.includes("AI Incident Report"));
    // All sections present
    assert.ok(result.includes("## 1. Correspondence Register"));
    assert.ok(result.includes("## 2. Communication Categories"));
    assert.ok(result.includes("## 3. Relevant Regulatory Authorities"));
    assert.ok(result.includes("## 4. Breach Notification Tracking"));
    assert.ok(result.includes("## 5. Audit and Inspection Log"));
    assert.ok(result.includes("## 6. Open Follow-Up Actions"));
    assert.ok(result.includes("## 7. Escalation Procedures"));
    assert.ok(result.includes("## 8. Annual Summary"));
    assert.ok(result.includes("## 9. Contact"));
  });
});
