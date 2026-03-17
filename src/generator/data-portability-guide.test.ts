import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateDataPortabilityGuide } from "./data-portability-guide.js";

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

describe("generateDataPortabilityGuide", () => {
  it("returns null when no services match the export database", () => {
    const scan = makeScan({
      services: [makeService("unknown-service", "analytics")],
    });
    const result = generateDataPortabilityGuide(scan);
    assert.strictEqual(result, null);
  });

  it("returns null when no services at all", () => {
    const scan = makeScan();
    const result = generateDataPortabilityGuide(scan);
    assert.strictEqual(result, null);
  });

  it("generates a guide when a known service is detected", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateDataPortabilityGuide(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Data Portability Guide"));
    assert.ok(result.includes("PostHog Inc"));
    assert.ok(result.includes("posthog"));
  });

  it("includes header with project name and organization", () => {
    const scan = makeScan({
      projectName: "my-app",
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataPortabilityGuide(scan, {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
    });
    assert.ok(result !== null);
    assert.ok(result.includes("**Project:** my-app"));
    assert.ok(result.includes("**Organization:** Acme Corp"));
  });

  it("includes effective date", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataPortabilityGuide(scan);
    assert.ok(result !== null);
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(`**Last updated:** ${today}`));
  });

  it("uses default placeholders when no context provided", () => {
    const scan = makeScan({
      services: [makeService("mixpanel", "analytics")],
    });
    const result = generateDataPortabilityGuide(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses context values when provided", () => {
    const scan = makeScan({
      services: [makeService("firebase", "database")],
    });
    const result = generateDataPortabilityGuide(scan, {
      companyName: "TestCo",
      contactEmail: "data@testco.com",
    });
    assert.ok(result !== null);
    assert.ok(result.includes("TestCo"));
    assert.ok(result.includes("data@testco.com"));
  });

  it("includes DPO email when provided", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataPortabilityGuide(scan, {
      companyName: "TestCo",
      contactEmail: "info@testco.com",
      dpoEmail: "dpo@testco.com",
    });
    assert.ok(result !== null);
    assert.ok(result.includes("dpo@testco.com"));
    assert.ok(result.includes("Data Protection Officer"));
  });

  it("excludes DPO email section when not provided", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataPortabilityGuide(scan, {
      companyName: "TestCo",
      contactEmail: "info@testco.com",
    });
    assert.ok(result !== null);
    assert.ok(!result.includes("Data Protection Officer"));
  });

  it("includes Legal Basis section with GDPR Article 20", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateDataPortabilityGuide(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("## Legal Basis"));
    assert.ok(result.includes("GDPR Article 20"));
    assert.ok(result.includes("right to data portability"));
  });

  it("includes How to Request section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataPortabilityGuide(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("## How to Request Your Data"));
    assert.ok(result.includes("Data Portability Request"));
    assert.ok(result.includes("30 days"));
  });

  it("includes per-service export instructions for matched services", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generateDataPortabilityGuide(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("## Per-Service Export Instructions"));
    assert.ok(result.includes("### PostHog Inc"));
    assert.ok(result.includes("**Service:** posthog"));
    assert.ok(result.includes("**Export Formats:** JSON, CSV"));
    assert.ok(result.includes("**API Endpoint:**"));
    assert.ok(result.includes("**Estimated Time:**"));
    assert.ok(result.includes("**Steps:**"));
  });

  it("generates sections for multiple services", () => {
    const scan = makeScan({
      services: [
        makeService("posthog", "analytics"),
        makeService("stripe", "payment"),
        makeService("firebase", "database"),
      ],
    });
    const result = generateDataPortabilityGuide(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("### PostHog Inc"));
    assert.ok(result.includes("### Stripe Inc"));
    assert.ok(result.includes("### Google LLC (Firebase)"));
  });

  it("deduplicates services by provider", () => {
    const scan = makeScan({
      services: [
        makeService("@stripe/stripe-js", "payment"),
        makeService("stripe", "payment"),
      ],
    });
    const result = generateDataPortabilityGuide(scan);
    assert.ok(result !== null);
    // Both map to "Stripe Inc" — should only appear once
    const matches = result.match(/### Stripe Inc/g);
    assert.strictEqual(matches?.length, 1);
  });

  it("includes Supported Export Formats table", () => {
    const scan = makeScan({
      services: [makeService("mixpanel", "analytics")],
    });
    const result = generateDataPortabilityGuide(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("## Supported Export Formats"));
    assert.ok(result.includes("JSON"));
    assert.ok(result.includes("CSV"));
    assert.ok(result.includes("XML"));
    assert.ok(result.includes("Machine-Readable"));
  });

  it("includes Implementation Checklist", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataPortabilityGuide(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("## Implementation Checklist"));
    assert.ok(result.includes("Data export API endpoint"));
    assert.ok(result.includes("30 days"));
    assert.ok(result.includes("Authentication verifies"));
  });

  it("includes Contact section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateDataPortabilityGuide(scan, {
      companyName: "TestCo",
      contactEmail: "privacy@testco.com",
    });
    assert.ok(result !== null);
    assert.ok(result.includes("## Contact"));
    assert.ok(result.includes("privacy@testco.com"));
  });

  it("includes Codepliant disclaimer with project name", () => {
    const scan = makeScan({
      projectName: "cool-app",
      services: [makeService("posthog", "analytics")],
    });
    const result = generateDataPortabilityGuide(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("cool-app"));
  });

  it("handles Google Analytics service", () => {
    const scan = makeScan({
      services: [makeService("Google Analytics", "analytics")],
    });
    const result = generateDataPortabilityGuide(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Google LLC"));
    assert.ok(result.includes("analyticsdata.googleapis.com"));
  });

  it("handles @clerk/nextjs service", () => {
    const scan = makeScan({
      services: [makeService("@clerk/nextjs", "auth")],
    });
    const result = generateDataPortabilityGuide(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Clerk Inc"));
    assert.ok(result.includes("api.clerk.com"));
  });

  it("handles next-auth service (no API endpoint)", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateDataPortabilityGuide(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("First-party (NextAuth.js)"));
    assert.ok(result.includes("query your database directly"));
  });

  it("handles @supabase/supabase-js service", () => {
    const scan = makeScan({
      services: [makeService("@supabase/supabase-js", "database")],
    });
    const result = generateDataPortabilityGuide(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Supabase Inc"));
    assert.ok(result.includes("supabase.co"));
  });

  it("handles @segment/analytics-next service", () => {
    const scan = makeScan({
      services: [makeService("@segment/analytics-next", "analytics")],
    });
    const result = generateDataPortabilityGuide(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Twilio Segment"));
    assert.ok(result.includes("Privacy Portal"));
  });
});
