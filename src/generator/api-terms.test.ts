import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import type { ScanResult, DetectedService, DataCategory } from "../scanner/types.js";
import { generateApiTermsOfUse } from "./api-terms.js";

function makeService(
  name: string,
  category: DetectedService["category"],
  dataCollected: string[] = ["test data"],
  evidence: DetectedService["evidence"] = [{ type: "dependency", file: "package.json", detail: `${name} detected` }],
): DetectedService {
  return { name, category, evidence, dataCollected };
}

// express, fastify etc. are "other" category in the service signatures
const API_CATEGORY: DetectedService["category"] = "other";

function makeScan(overrides: Partial<ScanResult> = {}): ScanResult {
  return {
    projectName: "test-project",
    projectPath: "/tmp/nonexistent-path-for-test",
    scannedAt: "2026-01-01",
    services: [],
    dataCategories: [],
    complianceNeeds: [],
    ...overrides,
  };
}

describe("generateApiTermsOfUse", () => {
  it("returns null when no API indicators are present", () => {
    const scan = makeScan();
    const result = generateApiTermsOfUse(scan);
    assert.strictEqual(result, null);
  });

  it("generates when API Data Collection data category is present", () => {
    const scan = makeScan({
      dataCategories: [
        { category: "API Data Collection", description: "API collects data", sources: ["api/route.ts"] },
      ],
    });
    const result = generateApiTermsOfUse(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# API Terms of Use"));
  });

  it("generates when API framework service is detected", () => {
    const scan = makeScan({
      services: [makeService("express", API_CATEGORY)],
    });
    const result = generateApiTermsOfUse(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# API Terms of Use"));
  });

  it("generates for various API frameworks", () => {
    for (const framework of ["fastify", "hono", "nestjs", "koa", "fastapi", "django-rest-framework", "rails"]) {
      const scan = makeScan({
        services: [makeService(framework, API_CATEGORY)],
      });
      const result = generateApiTermsOfUse(scan);
      assert.ok(result !== null, `Expected API terms for framework ${framework}`);
    }
  });

  it("generates when service evidence mentions api/router/endpoint", () => {
    const scan = makeScan({
      services: [
        makeService("next", API_CATEGORY, ["test data"], [
          { type: "import", file: "src/app/api/route.ts", detail: "API route detected" },
        ]),
      ],
    });
    const result = generateApiTermsOfUse(scan);
    assert.ok(result !== null);
  });

  it("generates when API directory exists", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "api-terms-test-"));
    fs.mkdirSync(path.join(tmpDir, "src", "api"), { recursive: true });

    const scan = makeScan({ projectPath: tmpDir });
    const result = generateApiTermsOfUse(scan);
    assert.ok(result !== null);

    fs.rmSync(tmpDir, { recursive: true });
  });

  it("generates when pages/api directory exists", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "api-terms-test-"));
    fs.mkdirSync(path.join(tmpDir, "pages", "api"), { recursive: true });

    const scan = makeScan({ projectPath: tmpDir });
    const result = generateApiTermsOfUse(scan);
    assert.ok(result !== null);

    fs.rmSync(tmpDir, { recursive: true });
  });

  it("uses default placeholders when no context provided", () => {
    const scan = makeScan({
      services: [makeService("express", API_CATEGORY)],
    });
    const result = generateApiTermsOfUse(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
    assert.ok(result.includes("[https://yoursite.com]"));
  });

  it("uses context values when provided", () => {
    const scan = makeScan({
      services: [makeService("express", API_CATEGORY)],
    });
    const result = generateApiTermsOfUse(scan, {
      companyName: "Acme Corp",
      contactEmail: "api@acme.com",
      website: "https://acme.com",
    })!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("api@acme.com"));
    assert.ok(result.includes("https://acme.com"));
    assert.ok(!result.includes("[Your Company Name]"));
  });

  it("includes date and project name", () => {
    const scan = makeScan({
      projectName: "my-api",
      services: [makeService("express", API_CATEGORY)],
    });
    const result = generateApiTermsOfUse(scan)!;
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(`**Effective Date:** ${today}`));
    assert.ok(result.includes(`**Last Updated:** ${today}`));
    assert.ok(result.includes("**Project:** my-api"));
  });

  it("includes acceptance of terms section", () => {
    const scan = makeScan({
      services: [makeService("express", API_CATEGORY)],
    });
    const result = generateApiTermsOfUse(scan)!;
    assert.ok(result.includes("Acceptance of Terms"));
    assert.ok(result.includes("Privacy Policy"));
    assert.ok(result.includes("Terms of Service"));
  });

  it("includes API access and authentication section", () => {
    const scan = makeScan({
      services: [makeService("express", API_CATEGORY)],
    });
    const result = generateApiTermsOfUse(scan)!;
    assert.ok(result.includes("API Access & Authentication"));
    assert.ok(result.includes("API Keys"));
    assert.ok(result.includes("API keys are confidential"));
  });

  it("includes authentication methods when auth services detected", () => {
    const scan = makeScan({
      services: [
        makeService("express", API_CATEGORY),
        makeService("next-auth", "auth"),
        makeService("clerk", "auth"),
      ],
    });
    const result = generateApiTermsOfUse(scan)!;
    assert.ok(result.includes("Authentication Methods"));
    assert.ok(result.includes("**next-auth**"));
    assert.ok(result.includes("**clerk**"));
    assert.ok(result.includes("Bearer Token"));
    assert.ok(result.includes("API Key"));
  });

  it("excludes authentication methods subsection when no auth services", () => {
    const scan = makeScan({
      services: [makeService("express", API_CATEGORY)],
    });
    const result = generateApiTermsOfUse(scan)!;
    assert.ok(!result.includes("Authentication Methods"));
  });

  it("includes rate limits section with tier table", () => {
    const scan = makeScan({
      services: [makeService("express", API_CATEGORY)],
    });
    const result = generateApiTermsOfUse(scan)!;
    assert.ok(result.includes("Rate Limits"));
    assert.ok(result.includes("| Free |"));
    assert.ok(result.includes("| Standard |"));
    assert.ok(result.includes("| Enterprise |"));
    assert.ok(result.includes("Rate Limit Headers"));
    assert.ok(result.includes("X-RateLimit-Limit"));
    assert.ok(result.includes("Exceeding Limits"));
    assert.ok(result.includes("429"));
  });

  it("includes usage restrictions section", () => {
    const scan = makeScan({
      services: [makeService("express", API_CATEGORY)],
    });
    const result = generateApiTermsOfUse(scan)!;
    assert.ok(result.includes("Usage Restrictions"));
    assert.ok(result.includes("unlawful purpose"));
    assert.ok(result.includes("Reverse-engineer"));
    assert.ok(result.includes("competing product"));
  });

  it("includes AI-specific restrictions when AI services detected", () => {
    const scan = makeScan({
      services: [
        makeService("express", API_CATEGORY),
        makeService("openai", "ai"),
      ],
    });
    const result = generateApiTermsOfUse(scan)!;
    assert.ok(result.includes("AI-Specific Restrictions"));
    assert.ok(result.includes("openai"));
    assert.ok(result.includes("misleading or deceptive content"));
    assert.ok(result.includes("human-generated"));
  });

  it("excludes AI restrictions when no AI services", () => {
    const scan = makeScan({
      services: [makeService("express", API_CATEGORY)],
    });
    const result = generateApiTermsOfUse(scan)!;
    assert.ok(!result.includes("AI-Specific Restrictions"));
  });

  it("includes payment data section when payment services detected", () => {
    const scan = makeScan({
      services: [
        makeService("express", API_CATEGORY),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateApiTermsOfUse(scan)!;
    assert.ok(result.includes("Payment Data"));
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("PCI DSS"));
  });

  it("excludes payment data section when no payment services", () => {
    const scan = makeScan({
      services: [makeService("express", API_CATEGORY)],
    });
    const result = generateApiTermsOfUse(scan)!;
    assert.ok(!result.includes("Payment Data"));
  });

  it("includes SLA section with availability and incident response", () => {
    const scan = makeScan({
      services: [makeService("express", API_CATEGORY)],
    });
    const result = generateApiTermsOfUse(scan)!;
    assert.ok(result.includes("Service Level Agreement"));
    assert.ok(result.includes("99.9%"));
    assert.ok(result.includes("Incident Response"));
    assert.ok(result.includes("P0"));
    assert.ok(result.includes("P3"));
  });

  it("includes monitoring subsection when monitoring services detected", () => {
    const scan = makeScan({
      services: [
        makeService("express", API_CATEGORY),
        makeService("sentry", "monitoring"),
      ],
    });
    const result = generateApiTermsOfUse(scan)!;
    assert.ok(result.includes("Monitoring"));
    assert.ok(result.includes("sentry"));
  });

  it("excludes monitoring subsection when no monitoring services", () => {
    const scan = makeScan({
      services: [makeService("express", API_CATEGORY)],
    });
    const result = generateApiTermsOfUse(scan)!;
    // Should not have the "Monitoring" subsection text (but may have "Monitoring and Enforcement" etc.)
    assert.ok(!result.includes("API health and performance are monitored"));
  });

  it("includes versioning and deprecation section", () => {
    const scan = makeScan({
      services: [makeService("express", API_CATEGORY)],
    });
    const result = generateApiTermsOfUse(scan)!;
    assert.ok(result.includes("API Versioning & Deprecation"));
    assert.ok(result.includes("12 months"));
    assert.ok(result.includes("Sunset"));
  });

  it("includes intellectual property section", () => {
    const scan = makeScan({
      services: [makeService("express", API_CATEGORY)],
    });
    const result = generateApiTermsOfUse(scan)!;
    assert.ok(result.includes("Intellectual Property"));
    assert.ok(result.includes("non-exclusive"));
    assert.ok(result.includes("revocable license"));
  });

  it("includes limitation of liability section", () => {
    const scan = makeScan({
      services: [makeService("express", API_CATEGORY)],
    });
    const result = generateApiTermsOfUse(scan)!;
    assert.ok(result.includes("Limitation of Liability"));
    assert.ok(result.includes("AS IS"));
    assert.ok(result.includes("twelve (12) months"));
  });

  it("includes termination section", () => {
    const scan = makeScan({
      services: [makeService("express", API_CATEGORY)],
    });
    const result = generateApiTermsOfUse(scan)!;
    assert.ok(result.includes("Termination"));
    assert.ok(result.includes("cease all API usage"));
    assert.ok(result.includes("cached API data"));
  });

  it("includes changes to terms section", () => {
    const scan = makeScan({
      services: [makeService("express", API_CATEGORY)],
    });
    const result = generateApiTermsOfUse(scan)!;
    assert.ok(result.includes("Changes to These Terms"));
    assert.ok(result.includes("30 days notice"));
  });

  it("includes contact section", () => {
    const scan = makeScan({
      services: [makeService("express", API_CATEGORY)],
    });
    const result = generateApiTermsOfUse(scan, {
      companyName: "TestCo",
      contactEmail: "api@testco.com",
      website: "https://testco.com",
    })!;
    assert.ok(result.includes("api@testco.com"));
    assert.ok(result.includes("https://testco.com"));
  });

  it("includes Codepliant disclaimer footer", () => {
    const scan = makeScan({
      services: [makeService("express", API_CATEGORY)],
    });
    const result = generateApiTermsOfUse(scan)!;
    assert.ok(result.includes("Generated by Codepliant"));
    assert.ok(result.includes("reviewed by legal counsel"));
  });

  it("numbers sections sequentially", () => {
    const scan = makeScan({
      services: [makeService("express", API_CATEGORY)],
    });
    const result = generateApiTermsOfUse(scan)!;
    assert.ok(result.includes("## 1. Acceptance of Terms"));
    assert.ok(result.includes("## 2. API Access & Authentication"));
    assert.ok(result.includes("## 3. Rate Limits"));
    assert.ok(result.includes("## 4. Usage Restrictions"));
    assert.ok(result.includes("## 5. Data Handling"));
  });

  it("includes all conditional sections when all service types present", () => {
    const scan = makeScan({
      services: [
        makeService("express", API_CATEGORY),
        makeService("next-auth", "auth"),
        makeService("openai", "ai"),
        makeService("stripe", "payment"),
        makeService("sentry", "monitoring"),
      ],
    });
    const result = generateApiTermsOfUse(scan)!;
    assert.ok(result.includes("Authentication Methods"));
    assert.ok(result.includes("AI-Specific Restrictions"));
    assert.ok(result.includes("Payment Data"));
    assert.ok(result.includes("API health and performance are monitored"));
  });

  it("uses company name in uppercase for liability section", () => {
    const scan = makeScan({
      services: [makeService("express", API_CATEGORY)],
    });
    const result = generateApiTermsOfUse(scan, {
      companyName: "Acme Corp",
      contactEmail: "legal@acme.com",
    })!;
    assert.ok(result.includes("ACME CORP"));
  });

  it("handles evidence with router keyword to detect API", () => {
    const scan = makeScan({
      services: [
        makeService("next", API_CATEGORY, ["test data"], [
          { type: "import", file: "src/routes.ts", detail: "Router setup detected" },
        ]),
      ],
    });
    const result = generateApiTermsOfUse(scan);
    assert.ok(result !== null);
  });

  it("handles evidence with endpoint keyword to detect API", () => {
    const scan = makeScan({
      services: [
        makeService("flask", API_CATEGORY, ["test data"], [
          { type: "import", file: "app.py", detail: "REST endpoint configured" },
        ]),
      ],
    });
    const result = generateApiTermsOfUse(scan);
    assert.ok(result !== null);
  });
});
