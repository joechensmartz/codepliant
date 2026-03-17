import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateSupplierCodeOfConduct } from "./supplier-code-of-conduct.js";

function makeService(
  name: string,
  category: DetectedService["category"],
  dataCollected: string[] = ["test data"],
  overrides: Partial<DetectedService> = {},
): DetectedService {
  return {
    name,
    category,
    evidence: [{ type: "dependency", file: "package.json", detail: `${name} detected` }],
    dataCollected,
    ...overrides,
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

describe("generateSupplierCodeOfConduct", () => {
  // ── Null returns ──────────────────────────────────────────────────────

  it("returns null when no services detected", () => {
    const result = generateSupplierCodeOfConduct(makeScan());
    assert.equal(result, null);
  });

  it("returns null when only one third-party service detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    assert.equal(generateSupplierCodeOfConduct(scan), null);
  });

  it("returns null when services are all self-hosted", () => {
    const scan = makeScan({
      services: [
        makeService("prisma", "database"),
        makeService("nodemailer", "email"),
        makeService("ioredis", "database"),
      ],
    });
    assert.equal(generateSupplierCodeOfConduct(scan), null);
  });

  it("returns null when only one third-party and rest are self-hosted", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("prisma", "database"),
        makeService("passport", "auth"),
      ],
    });
    assert.equal(generateSupplierCodeOfConduct(scan), null);
  });

  it("returns null when services have isDataProcessor set to false", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["test"], { isDataProcessor: false }),
        makeService("openai", "ai", ["test"], { isDataProcessor: false }),
      ],
    });
    assert.equal(generateSupplierCodeOfConduct(scan), null);
  });

  // ── Trigger conditions ────────────────────────────────────────────────

  it("generates when two or more third-party services detected", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Supplier Code of Conduct"));
  });

  // ── Header and basic structure ────────────────────────────────────────

  it("includes title, date, and organization", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes("# Supplier Code of Conduct"));
    assert.ok(result.includes(`**Last updated:** ${today}`));
    assert.ok(result.includes("**Organization:**"));
  });

  it("uses default placeholders when no context provided", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
    assert.ok(result.includes("[dpo@example.com]"));
  });

  it("uses context values when provided", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan, {
      companyName: "Acme Corp",
      contactEmail: "legal@acme.com",
      dpoEmail: "dpo@acme.com",
    })!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("legal@acme.com"));
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("falls back dpoEmail to contactEmail when dpoEmail not provided", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan, {
      companyName: "Acme Corp",
      contactEmail: "contact@acme.com",
    })!;
    assert.ok(result.includes("contact@acme.com"));
  });

  // ── Core sections ─────────────────────────────────────────────────────

  it("includes Scope section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(result.includes("## 1. Scope"));
    assert.ok(result.includes("process, store, transmit, or have access to data"));
  });

  it("includes Data Protection Requirements section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(result.includes("## 2. Data Protection Requirements"));
    assert.ok(result.includes("### 2.1 Lawful Processing"));
    assert.ok(result.includes("GDPR Article 6"));
    assert.ok(result.includes("GDPR Article 30"));
  });

  it("includes Data Subject Rights subsection", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(result.includes("### 2.2 Data Subject Rights"));
    assert.ok(result.includes("Data Subject Access Requests (DSARs)"));
    assert.ok(result.includes("right to rectification, erasure, and data portability"));
  });

  it("includes International Data Transfers subsection", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(result.includes("### 2.3 International Data Transfers"));
    assert.ok(result.includes("Standard Contractual Clauses (SCCs)"));
    assert.ok(result.includes("Transfer Impact Assessments"));
  });

  it("includes Security Expectations with Technical Measures", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(result.includes("## 3. Security Expectations"));
    assert.ok(result.includes("### 3.1 Technical Measures"));
    assert.ok(result.includes("AES-256"));
    assert.ok(result.includes("TLS 1.2+"));
    assert.ok(result.includes("Multi-factor authentication"));
  });

  it("includes Organizational Measures subsection", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(result.includes("### Organizational Measures"));
    assert.ok(result.includes("ISO 27001"));
    assert.ok(result.includes("cyber insurance"));
  });

  it("includes Incident Response section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(result.includes("## 4. Incident Response & Breach Notification"));
    assert.ok(result.includes("**72 hours**"));
    assert.ok(result.includes("**24 hours**"));
    assert.ok(result.includes("Root cause analysis"));
  });

  it("includes Audit Rights section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(result.includes("## 5. Audit Rights"));
    assert.ok(result.includes("SOC 2, ISO 27001"));
    assert.ok(result.includes("annual security questionnaires"));
  });

  it("includes Sub-Processor Requirements section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(result.includes("## 6. Sub-Processor Requirements"));
    assert.ok(result.includes("prior written authorization"));
    assert.ok(result.includes("30 days before adding or replacing"));
  });

  it("includes Business Continuity section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(result.includes("## 7. Business Continuity & Data Return"));
    assert.ok(result.includes("disaster recovery"));
    assert.ok(result.includes("securely delete"));
  });

  it("includes Compliance Monitoring section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(result.includes("## 8. Compliance Monitoring & Enforcement"));
    assert.ok(result.includes("Termination of the supplier agreement"));
    assert.ok(result.includes("supervisory authorities"));
  });

  it("includes Contact section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan, {
      companyName: "TestCo",
      contactEmail: "info@testco.com",
      dpoEmail: "dpo@testco.com",
    })!;
    assert.ok(result.includes("## 9. Contact"));
    assert.ok(result.includes("dpo@testco.com"));
    assert.ok(result.includes("info@testco.com"));
  });

  it("includes Codepliant disclaimer footer", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("reviewed by legal counsel"));
    assert.ok(result.includes("does not constitute legal advice"));
  });

  // ── Conditional sections ──────────────────────────────────────────────

  it("includes Payment Data Security section when payment service detected", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(result.includes("### 3.2 Payment Data Security"));
    assert.ok(result.includes("PCI DSS"));
    assert.ok(result.includes("Attestation of Compliance"));
    assert.ok(result.includes("tokenization"));
  });

  it("excludes Payment Data Security section when no payment service", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("sentry", "monitoring"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(!result.includes("Payment Data Security"));
  });

  it("includes Authentication section when auth service detected", () => {
    const scan = makeScan({
      services: [
        makeService("clerk", "auth"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(result.includes("Authentication & Identity Data"));
    assert.ok(result.includes("bcrypt, Argon2, scrypt"));
    assert.ok(result.includes("brute-force protection"));
  });

  it("numbers auth section as 3.3 when payment is also present", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("clerk", "auth"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(result.includes("### 3.3 Authentication & Identity Data"));
  });

  it("numbers auth section as 3.2 when payment is absent", () => {
    const scan = makeScan({
      services: [
        makeService("clerk", "auth"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(result.includes("### 3.2 Authentication & Identity Data"));
  });

  it("excludes Authentication section when no auth service", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(!result.includes("Authentication & Identity Data"));
  });

  it("includes AI & Machine Learning section when AI service detected", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("sentry", "monitoring"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(result.includes("### AI & Machine Learning Data"));
    assert.ok(result.includes("train models without explicit written consent"));
    assert.ok(result.includes("EU AI Act"));
    assert.ok(result.includes("bias monitoring"));
  });

  it("excludes AI section when no AI service detected", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("sentry", "monitoring"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(!result.includes("AI & Machine Learning Data"));
  });

  it("includes all conditional sections when payment, auth, and AI all detected", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("clerk", "auth"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(result.includes("Payment Data Security"));
    assert.ok(result.includes("Authentication & Identity Data"));
    assert.ok(result.includes("AI & Machine Learning Data"));
  });

  // ── Sub-processor table ───────────────────────────────────────────────

  it("lists third-party services in sub-processor table", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["card numbers", "billing info"]),
        makeService("openai", "ai", ["prompts", "user content"]),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(result.includes("### 6.1 Currently Detected Sub-Processors"));
    assert.ok(result.includes("| stripe | payment | card numbers, billing info |"));
    assert.ok(result.includes("| openai | ai | prompts, user content |"));
  });

  it("shows 'See agreement' when service has no dataCollected", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", []),
        makeService("openai", "ai", []),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(result.includes("See agreement"));
  });

  it("includes DPA requirement note for sub-processors", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(result.includes("Data Processing Agreement (DPA)"));
  });

  // ── Self-hosted filtering ─────────────────────────────────────────────

  it("excludes self-hosted services from third-party count", () => {
    const scan = makeScan({
      services: [
        makeService("prisma", "database"),
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    // prisma is self-hosted, so only stripe and openai are third-party
    assert.ok(!result.includes("| prisma |"));
    assert.ok(result.includes("| stripe |"));
    assert.ok(result.includes("| openai |"));
  });

  it("excludes all SELF_HOSTED entries from third-party services", () => {
    const scan = makeScan({
      services: [
        makeService("drizzle", "database"),
        makeService("mongoose", "database"),
        makeService("redis", "database"),
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan)!;
    assert.ok(!result.includes("| drizzle |"));
    assert.ok(!result.includes("| mongoose |"));
    assert.ok(!result.includes("| redis |"));
  });

  it("uses company name throughout the document", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan, {
      companyName: "MegaCorp",
      contactEmail: "info@megacorp.com",
    })!;
    const occurrences = result.split("MegaCorp").length - 1;
    assert.ok(occurrences >= 10, `Expected at least 10 occurrences of company name, got ${occurrences}`);
  });

  it("incident notification points to DPO email", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateSupplierCodeOfConduct(scan, {
      companyName: "Acme",
      contactEmail: "info@acme.com",
      dpoEmail: "dpo@acme.com",
    })!;
    assert.ok(result.includes("Incident notifications should be sent to: **dpo@acme.com**"));
  });
});
