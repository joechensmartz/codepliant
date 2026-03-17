import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateEULA } from "./eula.js";

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

describe("generateEULA", () => {
  it("always generates a EULA even with no services", () => {
    const scan = makeScan();
    const result = generateEULA(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# End User License Agreement (EULA)"));
  });

  it("includes effective date and project name", () => {
    const scan = makeScan({ projectName: "my-app" });
    const result = generateEULA(scan);
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(`**Effective Date:** ${today}`));
    assert.ok(result.includes(`**Last Updated:** ${today}`));
    assert.ok(result.includes("**Project:** my-app"));
  });

  it("uses default placeholders when no context provided", () => {
    const scan = makeScan();
    const result = generateEULA(scan);
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
    assert.ok(result.includes("[https://yoursite.com]"));
    assert.ok(result.includes("[Your Jurisdiction]"));
  });

  it("uses context values when provided", () => {
    const scan = makeScan();
    const result = generateEULA(scan, {
      companyName: "Acme Corp",
      contactEmail: "legal@acme.com",
      website: "https://acme.com",
      jurisdiction: "State of Delaware",
    });
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("legal@acme.com"));
    assert.ok(result.includes("https://acme.com"));
    assert.ok(result.includes("State of Delaware"));
  });

  it("includes License Grant section", () => {
    const scan = makeScan();
    const result = generateEULA(scan);
    assert.ok(result.includes("License Grant"));
    assert.ok(result.includes("non-exclusive"));
    assert.ok(result.includes("non-transferable"));
  });

  it("includes Restrictions section", () => {
    const scan = makeScan();
    const result = generateEULA(scan);
    assert.ok(result.includes("Restrictions"));
    assert.ok(result.includes("Reverse engineer"));
    assert.ok(result.includes("competing product"));
  });

  it("includes Intellectual Property Rights section", () => {
    const scan = makeScan();
    const result = generateEULA(scan);
    assert.ok(result.includes("Intellectual Property Rights"));
    assert.ok(result.includes("copyright"));
    assert.ok(result.includes("trade secrets"));
  });

  it("includes Warranty Disclaimer section", () => {
    const scan = makeScan();
    const result = generateEULA(scan);
    assert.ok(result.includes("Warranty Disclaimer"));
    assert.ok(result.includes("AS IS"));
    assert.ok(result.includes("WITHOUT WARRANTIES"));
  });

  it("includes Limitation of Liability section", () => {
    const scan = makeScan();
    const result = generateEULA(scan);
    assert.ok(result.includes("Limitation of Liability"));
    assert.ok(result.includes("indirect, incidental, special"));
    assert.ok(result.includes("MAXIMUM EXTENT PERMITTED"));
  });

  it("includes Termination section", () => {
    const scan = makeScan();
    const result = generateEULA(scan);
    assert.ok(result.includes("Termination"));
    assert.ok(result.includes("Cease all use"));
    assert.ok(result.includes("Destroy all copies"));
  });

  it("includes Export Compliance section", () => {
    const scan = makeScan();
    const result = generateEULA(scan);
    assert.ok(result.includes("Export Compliance"));
    assert.ok(result.includes("export and re-export control"));
    assert.ok(result.includes("OFAC"));
  });

  it("includes Governing Law section", () => {
    const scan = makeScan();
    const result = generateEULA(scan, {
      companyName: "TestCo",
      contactEmail: "test@testco.com",
      jurisdiction: "State of California",
    });
    assert.ok(result.includes("Governing Law"));
    assert.ok(result.includes("State of California"));
  });

  it("includes AI Disclaimer when AI services detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateEULA(scan);
    assert.ok(result.includes("Artificial Intelligence Disclaimer"));
    assert.ok(result.includes("AI-generated outputs"));
    assert.ok(result.includes("not always be accurate"));
  });

  it("excludes AI Disclaimer when no AI services detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateEULA(scan);
    assert.ok(!result.includes("Artificial Intelligence Disclaimer"));
  });

  it("includes Payment Terms when payment services detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateEULA(scan);
    assert.ok(result.includes("Payment Terms"));
    assert.ok(result.includes("non-refundable"));
    assert.ok(result.includes("Free trial periods"));
  });

  it("excludes Payment Terms when no payment services detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateEULA(scan);
    assert.ok(!result.includes("Payment Terms"));
  });

  it("includes both AI and Payment sections when both detected", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateEULA(scan);
    assert.ok(result.includes("Artificial Intelligence Disclaimer"));
    assert.ok(result.includes("Payment Terms"));
  });

  it("numbers sections sequentially without conditional sections", () => {
    const scan = makeScan();
    const result = generateEULA(scan);
    assert.ok(result.includes("## 1. Agreement to Terms"));
    assert.ok(result.includes("## 2. License Grant"));
    assert.ok(result.includes("## 3. Restrictions"));
    assert.ok(result.includes("## 4. Intellectual Property Rights"));
    assert.ok(result.includes("## 5. Warranty Disclaimer"));
    assert.ok(result.includes("## 6. Limitation of Liability"));
    assert.ok(result.includes("## 7. Termination"));
    assert.ok(result.includes("## 8. Export Compliance"));
    assert.ok(result.includes("## 9. Governing Law"));
  });

  it("numbers sections sequentially with AI and Payment sections", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateEULA(scan);
    // AI Disclaimer is section 8, Payment Terms is section 9
    assert.ok(result.includes("## 8. Artificial Intelligence Disclaimer"));
    assert.ok(result.includes("## 9. Payment Terms"));
    assert.ok(result.includes("## 10. Export Compliance"));
  });

  it("includes Codepliant disclaimer with project name", () => {
    const scan = makeScan({ projectName: "my-saas" });
    const result = generateEULA(scan);
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("my-saas"));
    assert.ok(result.includes("reviewed by legal counsel"));
  });

  it("includes contact section with email", () => {
    const scan = makeScan();
    const result = generateEULA(scan, {
      companyName: "TestCo",
      contactEmail: "support@testco.com",
    });
    assert.ok(result.includes("Contact Information"));
    assert.ok(result.includes("support@testco.com"));
  });

  it("includes modifications section", () => {
    const scan = makeScan();
    const result = generateEULA(scan);
    assert.ok(result.includes("Modifications to This Agreement"));
    assert.ok(result.includes("continued use"));
  });

  it("uses company name throughout the document", () => {
    const scan = makeScan();
    const result = generateEULA(scan, {
      companyName: "MegaSoft",
      contactEmail: "info@megasoft.com",
    });
    // Company name should appear in multiple sections
    const occurrences = result.split("MegaSoft").length - 1;
    assert.ok(occurrences >= 5, `Expected at least 5 occurrences of company name, got ${occurrences}`);
  });
});
