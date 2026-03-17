import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateISO27001Checklist } from "./iso27001.js";
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

/** Create a scan with at least MIN_SERVICES (5) services. */
function makeScanWithServices(extras: DetectedService[] = []): ScanResult {
  const base: DetectedService[] = [
    makeService("@sentry/node", "monitoring"),
    makeService("prisma", "database"),
    makeService("next-auth", "auth"),
    makeService("stripe", "payment"),
    makeService("posthog", "analytics"),
  ];
  return makeScan({ services: [...base, ...extras] });
}

describe("generateISO27001Checklist", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when no services detected", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateISO27001Checklist(scan), null);
  });

  it("returns null when fewer than 5 services", () => {
    const scan = makeScan({
      services: [
        makeService("prisma", "database"),
        makeService("stripe", "payment"),
        makeService("next-auth", "auth"),
        makeService("posthog", "analytics"),
      ],
    });
    assert.strictEqual(generateISO27001Checklist(scan), null);
  });

  it("returns null with exactly 4 services", () => {
    const scan = makeScan({
      services: [
        makeService("a", "database"),
        makeService("b", "auth"),
        makeService("c", "payment"),
        makeService("d", "monitoring"),
      ],
    });
    assert.strictEqual(generateISO27001Checklist(scan), null);
  });

  // ── Generation with 5+ services ───────────────────────────────────

  it("generates checklist when exactly 5 services detected", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("ISO 27001 Compliance Checklist"));
  });

  it("generates checklist with more than 5 services", () => {
    const scan = makeScanWithServices([
      makeService("openai", "ai"),
      makeService("aws-s3", "storage"),
    ]);
    const result = generateISO27001Checklist(scan);
    assert.ok(result !== null);
  });

  it("includes project name", () => {
    const scan = makeScanWithServices();
    scan.projectName = "my-saas";
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("my-saas"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  // ── Context values ────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScanWithServices();
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "iso@acme.com" };
    const result = generateISO27001Checklist(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses context contact email", () => {
    const scan = makeScanWithServices();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "iso@acme.com" };
    const result = generateISO27001Checklist(scan, ctx)!;
    assert.ok(result.includes("iso@acme.com"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses placeholder email when no context", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  // ── Overview section ──────────────────────────────────────────────

  it("includes overview with service count", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("## 1. Overview"));
    assert.ok(result.includes("**Detected services:** 5"));
  });

  it("includes detected service count for 7 services", () => {
    const scan = makeScanWithServices([
      makeService("openai", "ai"),
      makeService("aws-s3", "storage"),
    ]);
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("**Detected services:** 7"));
  });

  it("includes applicable Annex A domains in overview", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("Applicable Annex A domains"));
    assert.ok(result.includes("Organizational Controls"));
    assert.ok(result.includes("People Controls"));
    assert.ok(result.includes("Physical Controls"));
    assert.ok(result.includes("Technological Controls"));
  });

  it("includes disclaimer about certification", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("Disclaimer"));
    assert.ok(result.includes("ISO 27001 certification"));
  });

  // ── Service-to-Control Mapping ─────────────────────────────────────

  it("includes service-to-control mapping table", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("## 2. Service-to-Control Mapping"));
    assert.ok(result.includes("| Detected Service | Category | Applicable Annex A Domains |"));
  });

  it("maps services to correct categories in table", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("| @sentry/node | Error Monitoring |"));
    assert.ok(result.includes("| prisma | Database |"));
    assert.ok(result.includes("| next-auth | Authentication |"));
    assert.ok(result.includes("| stripe | Payment Processing |"));
    assert.ok(result.includes("| posthog | Analytics |"));
  });

  // ── Annex A Controls Checklist ─────────────────────────────────────

  it("includes Annex A Controls Checklist header", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("## 3. Annex A Controls Checklist"));
  });

  // ── A.5 Organizational Controls ────────────────────────────────────

  it("includes A.5 Organizational Controls section", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("### A.5 — Organizational Controls"));
    assert.ok(result.includes("A.5.1 — Policies for Information Security"));
    assert.ok(result.includes("A.5.2 — Information Security Roles"));
    assert.ok(result.includes("A.5.10 — Acceptable Use"));
    assert.ok(result.includes("A.5.12 — Classification of Information"));
  });

  it("includes incident management checklist", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("A.5.24 — Information Security Incident Management"));
    assert.ok(result.includes("incident response plan"));
  });

  it("includes business continuity checklist", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("A.5.29 — Information Security During Disruption"));
    assert.ok(result.includes("RTO"));
    assert.ok(result.includes("RPO"));
  });

  it("includes legal requirements checklist", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("A.5.31 — Legal, Statutory, Regulatory"));
  });

  // ── Conditional A.5 sections ───────────────────────────────────────

  it("includes Privacy/PII section when analytics services present", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("A.5.34 — Privacy and Protection of PII"));
    assert.ok(result.includes("posthog"));
    assert.ok(result.includes("Privacy Impact Assessment"));
  });

  it("includes Privacy/PII section when AI services present", () => {
    const scan = makeScanWithServices([makeService("openai", "ai")]);
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("A.5.34 — Privacy and Protection of PII"));
    assert.ok(result.includes("openai"));
  });

  it("excludes Privacy/PII section when no analytics or AI services", () => {
    const scan = makeScan({
      services: [
        makeService("a", "database"),
        makeService("b", "auth"),
        makeService("c", "payment"),
        makeService("d", "monitoring"),
        makeService("e", "email"),
      ],
    });
    const result = generateISO27001Checklist(scan)!;
    assert.ok(!result.includes("A.5.34"));
  });

  it("includes Supplier Relationships section when payment services present", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("A.5.19 — Information Security in Supplier Relationships"));
    assert.ok(result.includes("stripe"));
  });

  it("excludes Supplier Relationships section when no payment services", () => {
    const scan = makeScan({
      services: [
        makeService("a", "database"),
        makeService("b", "auth"),
        makeService("c", "monitoring"),
        makeService("d", "analytics"),
        makeService("e", "email"),
      ],
    });
    const result = generateISO27001Checklist(scan)!;
    assert.ok(!result.includes("A.5.19"));
  });

  // ── A.6 People Controls ────────────────────────────────────────────

  it("includes A.6 People Controls section", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("### A.6 — People Controls"));
    assert.ok(result.includes("A.6.1 — Screening"));
    assert.ok(result.includes("A.6.2 — Terms and Conditions"));
    assert.ok(result.includes("A.6.3 — Information Security Awareness"));
    assert.ok(result.includes("A.6.4 — Disciplinary Process"));
    assert.ok(result.includes("A.6.5 — Responsibilities After Termination"));
  });

  // ── A.7 Physical Controls ─────────────────────────────────────────

  it("includes A.7 Physical Controls section", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("### A.7 — Physical Controls"));
    assert.ok(result.includes("A.7.1 — Physical Security Perimeters"));
    assert.ok(result.includes("A.7.2 — Physical Entry"));
    assert.ok(result.includes("A.7.10 — Storage Media"));
  });

  // ── A.8 Technological Controls ─────────────────────────────────────

  it("includes A.8 Technological Controls section", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("### A.8 — Technological Controls"));
    assert.ok(result.includes("A.8.1 — User Endpoint Devices"));
    assert.ok(result.includes("A.8.5 — Secure Authentication"));
    assert.ok(result.includes("A.8.7 — Protection Against Malware"));
    assert.ok(result.includes("A.8.8 — Management of Technical Vulnerabilities"));
    assert.ok(result.includes("A.8.9 — Configuration Management"));
    assert.ok(result.includes("A.8.25 — Secure Development Life Cycle"));
  });

  // ── Conditional A.8 sections ───────────────────────────────────────

  it("includes auth-specific Privileged Access section when auth present", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("A.8.2 — Privileged Access Rights"));
    assert.ok(result.includes("next-auth"));
    assert.ok(result.includes("multi-factor authentication"));
    assert.ok(result.includes("just-in-time"));
  });

  it("includes generic Privileged Access section when no auth service", () => {
    const scan = makeScan({
      services: [
        makeService("a", "database"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
        makeService("d", "analytics"),
        makeService("e", "email"),
      ],
    });
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("A.8.2 — Privileged Access Rights"));
    assert.ok(result.includes("Implement an authentication service with MFA support"));
  });

  it("includes storage-specific Information Deletion section when database/storage present", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("A.8.10 — Information Deletion"));
    assert.ok(result.includes("prisma"));
    assert.ok(result.includes("deletion is complete and irreversible"));
  });

  it("includes storage-specific Information Deletion with storage services", () => {
    const scan = makeScanWithServices([makeService("aws-s3", "storage")]);
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("aws-s3"));
  });

  it("includes generic Information Deletion when no database or storage", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
        makeService("d", "analytics"),
        makeService("e", "email"),
      ],
    });
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("A.8.10 — Information Deletion"));
    assert.ok(!result.includes("deletion is complete and irreversible"));
  });

  it("includes monitoring-specific logging alerts when monitoring present", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("A.8.15 — Logging"));
    assert.ok(result.includes("Configure alerting in: @sentry/node"));
  });

  it("excludes monitoring alert line when no monitoring service", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "database"),
        makeService("d", "analytics"),
        makeService("e", "email"),
      ],
    });
    const result = generateISO27001Checklist(scan)!;
    assert.ok(!result.includes("Configure alerting in:"));
  });

  it("includes database encryption at rest when database present", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("A.8.24 — Use of Cryptography"));
    assert.ok(result.includes("Enable encryption at rest for: prisma"));
  });

  it("includes storage encryption at rest when storage present", () => {
    const scan = makeScanWithServices([makeService("aws-s3", "storage")]);
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("Enable encryption at rest for file storage: aws-s3"));
  });

  it("includes AI-specific secure coding section when AI present", () => {
    const scan = makeScanWithServices([makeService("openai", "ai")]);
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("A.8.28 — Secure Coding (AI-Specific)"));
    assert.ok(result.includes("openai"));
    assert.ok(result.includes("guardrails"));
    assert.ok(result.includes("bias and fairness"));
  });

  it("excludes AI-specific secure coding section when no AI", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(!result.includes("A.8.28"));
  });

  // ── Implementation Roadmap ─────────────────────────────────────────

  it("includes Implementation Roadmap section", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("## 4. Implementation Roadmap"));
    assert.ok(result.includes("Gap Analysis"));
    assert.ok(result.includes("Risk Assessment"));
    assert.ok(result.includes("Stage 1 Audit"));
    assert.ok(result.includes("Stage 2 Audit"));
  });

  // ── Statement of Applicability ─────────────────────────────────────

  it("includes Statement of Applicability section", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("## 5. Statement of Applicability"));
    assert.ok(result.includes("Organizational Controls (A.5)"));
    assert.ok(result.includes("People Controls (A.6)"));
    assert.ok(result.includes("Physical Controls (A.7)"));
    assert.ok(result.includes("Technological Controls (A.8)"));
  });

  it("marks all domains as applicable when services span categories", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    // All 4 domains should always apply (they are always added)
    // Find the SoA table and verify "Yes" appears for applicable domains
    const soaStart = result.indexOf("Statement of Applicability");
    assert.ok(soaStart !== -1);
    const soaSection = result.slice(soaStart, soaStart + 1000);
    assert.ok(soaSection.includes("| Yes |"));
  });

  // ── Next Steps ─────────────────────────────────────────────────────

  it("includes Next Steps section", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("## 6. Next Steps"));
    assert.ok(result.includes("Appoint an ISMS owner"));
    assert.ok(result.includes("Define the ISMS scope"));
    assert.ok(result.includes("Conduct a risk assessment"));
    assert.ok(result.includes("Engage a certification body"));
  });

  // ── Disclaimer ────────────────────────────────────────────────────

  it("includes Codepliant disclaimer", () => {
    const scan = makeScanWithServices();
    const result = generateISO27001Checklist(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("reviewed by a qualified professional"));
  });

  // ── All conditional sections together ──────────────────────────────

  it("includes all conditional sections with full service set", () => {
    const scan = makeScanWithServices([
      makeService("openai", "ai", ["prompts"]),
      makeService("aws-s3", "storage", ["files"]),
    ]);
    const result = generateISO27001Checklist(scan)!;
    // A.5 conditional
    assert.ok(result.includes("A.5.34"));
    assert.ok(result.includes("A.5.19"));
    // A.8 conditional
    assert.ok(result.includes("next-auth"));
    assert.ok(result.includes("Configure alerting in:"));
    assert.ok(result.includes("Enable encryption at rest for: prisma"));
    assert.ok(result.includes("Enable encryption at rest for file storage: aws-s3"));
    assert.ok(result.includes("A.8.28 — Secure Coding (AI-Specific)"));
  });
});
