import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateRegulatoryUpdates } from "./regulatory-updates.js";

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

describe("generateRegulatoryUpdates", () => {
  it("returns null when no services detected", () => {
    const scan = makeScan();
    const result = generateRegulatoryUpdates(scan);
    assert.strictEqual(result, null);
  });

  it("generates document when services are present", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRegulatoryUpdates(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Regulatory Updates"));
  });

  it("includes company name and project name", () => {
    const scan = makeScan({
      projectName: "my-app",
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRegulatoryUpdates(scan, {
      companyName: "TestCo",
      contactEmail: "info@testco.com",
    })!;
    assert.ok(result.includes("TestCo"));
    assert.ok(result.includes("my-app"));
  });

  it("uses default company placeholder when no context", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRegulatoryUpdates(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("includes disclaimer about not being legal advice", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRegulatoryUpdates(scan)!;
    assert.ok(result.includes("not legal advice"));
  });

  it("includes current date", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRegulatoryUpdates(scan)!;
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(today));
  });

  it("includes EU AI Act updates when AI services detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateRegulatoryUpdates(scan)!;
    assert.ok(result.includes("EU AI Act"));
    assert.ok(result.includes("Prohibited Practices"));
    assert.ok(result.includes("AI Literacy Obligation"));
    assert.ok(result.includes("GPAI Model Obligations"));
    assert.ok(result.includes("Transparency Obligations"));
    assert.ok(result.includes("High-Risk System Requirements"));
  });

  it("excludes EU AI Act when no AI services", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRegulatoryUpdates(scan)!;
    assert.ok(!result.includes("EU AI Act — Prohibited Practices"));
  });

  it("includes US state privacy laws by default", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRegulatoryUpdates(scan)!;
    assert.ok(result.includes("CPRA Enforcement"));
    assert.ok(result.includes("Texas Data Privacy"));
    assert.ok(result.includes("Florida Digital Bill of Rights"));
    assert.ok(result.includes("Oregon Consumer Privacy"));
    assert.ok(result.includes("New Jersey Data Privacy"));
  });

  it("includes upcoming US state laws", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRegulatoryUpdates(scan)!;
    assert.ok(result.includes("Tennessee Information Protection Act"));
    assert.ok(result.includes("Minnesota Consumer Data Privacy"));
    assert.ok(result.includes("Maryland Online Data Privacy"));
  });

  it("includes Colorado AI Act when AI + US jurisdiction", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateRegulatoryUpdates(scan)!;
    assert.ok(result.includes("Colorado AI Act"));
    assert.ok(result.includes("consequential decisions"));
  });

  it("excludes Colorado AI Act when no AI services", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRegulatoryUpdates(scan)!;
    assert.ok(!result.includes("Colorado AI Act"));
  });

  it("includes UK Data Use and Access Act", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRegulatoryUpdates(scan)!;
    assert.ok(result.includes("UK Data (Use and Access) Act"));
    assert.ok(result.includes("Senior Responsible Individual"));
  });

  it("includes UK AI regulation when AI + UK jurisdiction", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateRegulatoryUpdates(scan, {
      companyName: "TestCo",
      contactEmail: "info@testco.com",
      jurisdictions: ["uk"],
    })!;
    assert.ok(result.includes("UK AI Regulation"));
    assert.ok(result.includes("sector-led"));
  });

  it("includes ePrivacy Regulation when analytics detected", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateRegulatoryUpdates(scan)!;
    assert.ok(result.includes("ePrivacy Regulation"));
    assert.ok(result.includes("Directive 2002/58/EC"));
  });

  it("includes ePrivacy Regulation when auth detected", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRegulatoryUpdates(scan)!;
    assert.ok(result.includes("ePrivacy Regulation"));
  });

  it("includes ePrivacy Regulation when advertising detected", () => {
    const scan = makeScan({
      services: [makeService("google-ads", "advertising")],
    });
    const result = generateRegulatoryUpdates(scan)!;
    assert.ok(result.includes("ePrivacy Regulation"));
  });

  it("includes EU-US DPF when US-based services detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateRegulatoryUpdates(scan)!;
    assert.ok(result.includes("EU-US Data Privacy Framework"));
    assert.ok(result.includes("1 US-based service"));
    assert.ok(result.includes("dataprivacyframework.gov"));
  });

  it("counts multiple US-based services in DPF section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("@sentry/node", "monitoring"),
      ],
    });
    const result = generateRegulatoryUpdates(scan)!;
    assert.ok(result.includes("3 US-based service"));
  });

  it("excludes DPF when no US-based services", () => {
    const scan = makeScan({
      services: [makeService("custom-service", "other")],
    });
    // custom-service is not in the US_BASED_PROVIDER_NAMES set
    const result = generateRegulatoryUpdates(scan)!;
    assert.ok(!result.includes("EU-US Data Privacy Framework"));
  });

  it("groups updates by status: in effect, upcoming, other", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateRegulatoryUpdates(scan)!;
    assert.ok(result.includes("## Recently Enacted (Now In Effect)"));
    assert.ok(result.includes("## Upcoming Enforcement Dates"));
  });

  it("includes in development section for non-standard statuses", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRegulatoryUpdates(scan)!;
    assert.ok(result.includes("## In Development / Under Review"));
  });

  it("includes action summary table", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRegulatoryUpdates(scan)!;
    assert.ok(result.includes("## Action Summary"));
    assert.ok(result.includes("Regulation"));
    assert.ok(result.includes("Status"));
    assert.ok(result.includes("Priority"));
    assert.ok(result.includes("Review now"));
    assert.ok(result.includes("Plan ahead"));
  });

  it("includes monitor priority for non-standard status items", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRegulatoryUpdates(scan)!;
    assert.ok(result.includes("Monitor"));
  });

  it("formats individual updates with enforcement date, status, impact, action", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateRegulatoryUpdates(scan)!;
    assert.ok(result.includes("**Enforcement Date**"));
    assert.ok(result.includes("**Status**"));
    assert.ok(result.includes("**Impact:**"));
    assert.ok(result.includes("**Action Required:**"));
  });

  it("includes Codepliant disclaimer footer", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRegulatoryUpdates(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("automated code analysis"));
    assert.ok(result.includes("verify all dates"));
  });

  it("scopes to EU jurisdiction when configured", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateRegulatoryUpdates(scan, {
      companyName: "EUCo",
      contactEmail: "info@euco.com",
      jurisdictions: ["eu"],
    })!;
    assert.ok(result.includes("EU AI Act"));
    // Should not include US state laws when only EU jurisdiction
    assert.ok(!result.includes("CPRA Enforcement"));
  });

  it("scopes to US jurisdiction when configured", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRegulatoryUpdates(scan, {
      companyName: "USCo",
      contactEmail: "info@usco.com",
      jurisdictions: ["ccpa"],
    })!;
    assert.ok(result.includes("CPRA Enforcement"));
    // Should still include UK DUAA since showEU defaults include it
  });

  it("shows US laws when companyLocation is US", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateRegulatoryUpdates(scan, {
      companyName: "USCo",
      contactEmail: "info@usco.com",
      jurisdictions: ["eu"],
      companyLocation: "US",
    })!;
    assert.ok(result.includes("CPRA Enforcement"));
    assert.ok(result.includes("Colorado AI Act"));
  });

  it("includes UK-specific content with uk-gdpr jurisdiction", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRegulatoryUpdates(scan, {
      companyName: "UKCo",
      contactEmail: "info@ukco.com",
      jurisdictions: ["uk-gdpr"],
    })!;
    assert.ok(result.includes("UK Data (Use and Access) Act"));
  });

  it("handles email-only services without crashing", () => {
    const scan = makeScan({
      services: [makeService("resend", "email")],
    });
    const result = generateRegulatoryUpdates(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Regulatory Updates"));
  });

  it("includes review quarterly instruction", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateRegulatoryUpdates(scan)!;
    assert.ok(result.includes("Review quarterly"));
  });

  it("recognizes stripe as US-based provider", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateRegulatoryUpdates(scan)!;
    assert.ok(result.includes("EU-US Data Privacy Framework"));
  });

  it("recognizes @sentry/nextjs as US-based provider", () => {
    const scan = makeScan({
      services: [makeService("@sentry/nextjs", "monitoring")],
    });
    const result = generateRegulatoryUpdates(scan)!;
    assert.ok(result.includes("EU-US Data Privacy Framework"));
  });

  it("recognizes firebase as US-based provider", () => {
    const scan = makeScan({
      services: [makeService("firebase", "database")],
    });
    const result = generateRegulatoryUpdates(scan)!;
    assert.ok(result.includes("EU-US Data Privacy Framework"));
  });
});
