import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateRecordOfProcessing } from "./record-of-processing.js";

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

describe("generateRecordOfProcessing", () => {
  it("returns null when no services detected", () => {
    const scan = makeScan();
    const result = generateRecordOfProcessing(scan);
    assert.strictEqual(result, null);
  });

  it("generates document when services are present", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRecordOfProcessing(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Record of Processing Activities"));
  });

  it("includes GDPR Article 30 reference in header", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("GDPR Article 30"));
  });

  it("uses default placeholders when no context provided", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
    assert.ok(result.includes("[Data Protection Officer Name]"));
  });

  it("uses context values when provided", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRecordOfProcessing(scan, {
      companyName: "DataCorp",
      contactEmail: "privacy@datacorp.com",
      dpoName: "Jane Doe",
      dpoEmail: "dpo@datacorp.com",
    })!;
    assert.ok(result.includes("DataCorp"));
    assert.ok(result.includes("privacy@datacorp.com"));
    assert.ok(result.includes("Jane Doe"));
    assert.ok(result.includes("dpo@datacorp.com"));
  });

  it("includes controller information table", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRecordOfProcessing(scan, {
      companyName: "TestCo",
      contactEmail: "info@testco.com",
    })!;
    assert.ok(result.includes("## 1. Controller Information"));
    assert.ok(result.includes("Data Controller"));
    assert.ok(result.includes("Contact Email"));
    assert.ok(result.includes("Data Protection Officer"));
    assert.ok(result.includes("Record Last Updated"));
  });

  it("includes EU representative when provided", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRecordOfProcessing(scan, {
      companyName: "USCorp",
      contactEmail: "info@uscorp.com",
      euRepresentative: "EU Rep GmbH",
    })!;
    assert.ok(result.includes("EU Representative"));
    assert.ok(result.includes("EU Rep GmbH"));
  });

  it("includes website when provided", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRecordOfProcessing(scan, {
      companyName: "TestCo",
      contactEmail: "info@testco.com",
      website: "https://testco.com",
    })!;
    assert.ok(result.includes("https://testco.com"));
  });

  it("generates auth processing activity", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("User Authentication"));
    assert.ok(result.includes("Account creation, login, and session management"));
    assert.ok(result.includes("next-auth"));
    assert.ok(result.includes("Contract performance"));
  });

  it("generates analytics processing activity", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("Usage Analytics"));
    assert.ok(result.includes("posthog"));
    assert.ok(result.includes("Legitimate interest"));
  });

  it("generates payment processing activity", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("Payment Processing"));
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("tax/accounting"));
  });

  it("generates email processing activity", () => {
    const scan = makeScan({
      services: [makeService("resend", "email")],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("Email Communications"));
    assert.ok(result.includes("resend"));
  });

  it("generates AI processing activity", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("AI Processing"));
    assert.ok(result.includes("openai"));
    assert.ok(result.includes("Consent"));
  });

  it("generates monitoring processing activity", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring")],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("Error Monitoring"));
    assert.ok(result.includes("@sentry/node"));
  });

  it("generates storage processing activity", () => {
    const scan = makeScan({
      services: [makeService("@aws-sdk/client-s3", "storage")],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("File Storage"));
    assert.ok(result.includes("@aws-sdk/client-s3"));
  });

  it("generates advertising processing activity", () => {
    const scan = makeScan({
      services: [makeService("google-ads", "advertising")],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("Advertising & Conversion Tracking"));
    assert.ok(result.includes("google-ads"));
  });

  it("generates database processing activity", () => {
    const scan = makeScan({
      services: [makeService("prisma", "database")],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("Data Storage"));
    assert.ok(result.includes("prisma"));
  });

  it("numbers activities sequentially across categories", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("| 1 |"));
    assert.ok(result.includes("| 2 |"));
    assert.ok(result.includes("| 3 |"));
  });

  it("includes data subjects section for auth services", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("## 3. Categories of Data Subjects"));
    assert.ok(result.includes("Registered Users"));
  });

  it("includes website visitors data subject for analytics", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("Website Visitors"));
  });

  it("includes customers data subject for payment", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("Customers"));
  });

  it("always includes generic data subjects line", () => {
    const scan = makeScan({
      services: [makeService("resend", "email")],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("Data Subjects"));
    assert.ok(result.includes("Any individual whose personal data is processed"));
  });

  it("includes international data transfers table for third-party services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("## 4. International Data Transfers"));
    assert.ok(result.includes("Standard Contractual Clauses"));
    assert.ok(result.includes("stripe"));
  });

  it("excludes non-data-processor services from transfers table", () => {
    const scan = makeScan({
      services: [
        { ...makeService("eslint", "other"), isDataProcessor: false },
      ],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("No third-party international data transfers identified"));
  });

  it("includes technical and organizational measures section", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("## 5. Technical and Organizational Measures"));
    assert.ok(result.includes("GDPR Article 32"));
    assert.ok(result.includes("Encryption of personal data in transit"));
    assert.ok(result.includes("Access control and authentication"));
    assert.ok(result.includes("Incident response procedures"));
    assert.ok(result.includes("Data minimization practices"));
  });

  it("flags DPIA as likely required when AI detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("## 6. Data Protection Impact Assessment"));
    assert.ok(result.includes("likely required"));
    assert.ok(result.includes("AI/automated decision-making"));
  });

  it("flags DPIA as likely required when analytics detected", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("likely required"));
    assert.ok(result.includes("Systematic monitoring/profiling"));
  });

  it("recommends DPIA as best practice when no AI or analytics", () => {
    const scan = makeScan({
      services: [makeService("resend", "email")],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("may not be strictly required"));
    assert.ok(result.includes("best practice"));
  });

  it("includes review schedule section", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("## 7. Review Schedule"));
    assert.ok(result.includes("Annually"));
    assert.ok(result.includes("On change"));
    assert.ok(result.includes("On incident"));
    assert.ok(result.includes("On request"));
    assert.ok(result.includes("supervisory authority"));
  });

  it("includes Codepliant disclaimer footer", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("reviewed by your Data Protection Officer"));
    assert.ok(result.includes("GDPR Article 30"));
  });

  it("includes current date in generated document", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRecordOfProcessing(scan)!;
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(`Generated on ${today}`));
  });

  it("handles multiple services of same category", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("@clerk/nextjs", "auth"),
      ],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("next-auth"));
    assert.ok(result.includes("@clerk/nextjs"));
    // They should appear in the same activity row
    assert.ok(result.includes("next-auth, @clerk/nextjs"));
  });

  it("generates all category activities with full service stack", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("posthog", "analytics"),
        makeService("stripe", "payment"),
        makeService("resend", "email"),
        makeService("openai", "ai"),
        makeService("@sentry/node", "monitoring"),
        makeService("@aws-sdk/client-s3", "storage"),
        makeService("google-ads", "advertising"),
        makeService("prisma", "database"),
      ],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("User Authentication"));
    assert.ok(result.includes("Usage Analytics"));
    assert.ok(result.includes("Payment Processing"));
    assert.ok(result.includes("Email Communications"));
    assert.ok(result.includes("AI Processing"));
    assert.ok(result.includes("Error Monitoring"));
    assert.ok(result.includes("File Storage"));
    assert.ok(result.includes("Advertising & Conversion Tracking"));
    assert.ok(result.includes("Data Storage"));
  });

  it("includes processing activities table header", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRecordOfProcessing(scan)!;
    assert.ok(result.includes("## 2. Processing Activities"));
    assert.ok(result.includes("Processing Activity"));
    assert.ok(result.includes("Purpose"));
    assert.ok(result.includes("Lawful Basis"));
    assert.ok(result.includes("Retention Period"));
    assert.ok(result.includes("Recipients"));
  });

  it("uses dpoEmail fallback to contactEmail", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRecordOfProcessing(scan, {
      companyName: "TestCo",
      contactEmail: "info@testco.com",
    })!;
    // DPO email should fall back to contactEmail when dpoEmail not provided
    assert.ok(result.includes("info@testco.com"));
  });
});
