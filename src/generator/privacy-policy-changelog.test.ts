import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generatePrivacyPolicyChangelog } from "./privacy-policy-changelog.js";

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

describe("generatePrivacyPolicyChangelog", () => {
  it("returns null when no services detected", () => {
    const scan = makeScan();
    const result = generatePrivacyPolicyChangelog(scan);
    assert.strictEqual(result, null);
  });

  it("generates changelog when services are present", () => {
    const scan = makeScan({
      services: [makeService("google-analytics", "analytics")],
    });
    const result = generatePrivacyPolicyChangelog(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Privacy Policy Changelog"));
  });

  it("uses context values for company info", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generatePrivacyPolicyChangelog(scan, {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      dpoName: "Jane Doe",
      dpoEmail: "dpo@acme.com",
      website: "https://acme.com",
    })!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("privacy@acme.com"));
    assert.ok(result.includes("Jane Doe"));
    assert.ok(result.includes("dpo@acme.com"));
    assert.ok(result.includes("https://acme.com"));
  });

  it("uses placeholder defaults when no context provided", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring")],
    });
    const result = generatePrivacyPolicyChangelog(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
    assert.ok(result.includes("[Data Protection Officer Name]"));
    assert.ok(result.includes("[dpo@example.com]"));
    assert.ok(result.includes("[https://your-website.com]"));
  });

  it("includes version history table", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyPolicyChangelog(scan)!;
    assert.ok(result.includes("## 1. Version History"));
    assert.ok(result.includes("| Version | Date | Change Type |"));
    assert.ok(result.includes("Initial release"));
  });

  it("includes change type definitions", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyPolicyChangelog(scan)!;
    assert.ok(result.includes("## 2. Change Type Definitions"));
    assert.ok(result.includes("New data collection"));
    assert.ok(result.includes("New third-party service"));
    assert.ok(result.includes("Clarification"));
  });

  it("includes notification procedures", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyPolicyChangelog(scan)!;
    assert.ok(result.includes("## 3. Notification Procedures"));
    assert.ok(result.includes("Material Changes"));
    assert.ok(result.includes("Non-Material Changes"));
    assert.ok(result.includes("30 days"));
  });

  it("lists detected services in baseline section", () => {
    const scan = makeScan({
      services: [
        makeService("google-analytics", "analytics", ["page views"]),
        makeService("stripe", "payment", ["payment information"]),
      ],
    });
    const result = generatePrivacyPolicyChangelog(scan)!;
    assert.ok(result.includes("## 4. Current Privacy Policy Baseline"));
    assert.ok(result.includes("- google-analytics"));
    assert.ok(result.includes("- stripe"));
  });

  it("lists data categories collected", () => {
    const scan = makeScan({
      services: [
        makeService("sentry", "monitoring", ["error logs", "device info"]),
        makeService("stripe", "payment", ["payment information"]),
      ],
    });
    const result = generatePrivacyPolicyChangelog(scan)!;
    assert.ok(result.includes("### 4.2 Data Categories Collected"));
    assert.ok(result.includes("- error logs"));
    assert.ok(result.includes("- device info"));
    assert.ok(result.includes("- payment information"));
  });

  it("includes AI processing feature when AI service detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePrivacyPolicyChangelog(scan)!;
    assert.ok(result.includes("- AI/ML processing"));
  });

  it("includes payment processing feature when payment service detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment information"])],
    });
    const result = generatePrivacyPolicyChangelog(scan)!;
    assert.ok(result.includes("- Payment processing"));
  });

  it("includes analytics feature when analytics service detected", () => {
    const scan = makeScan({
      services: [makeService("google-analytics", "analytics", ["page views"])],
    });
    const result = generatePrivacyPolicyChangelog(scan)!;
    assert.ok(result.includes("- Analytics and tracking"));
  });

  it("includes auth feature when auth service detected", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email"])],
    });
    const result = generatePrivacyPolicyChangelog(scan)!;
    assert.ok(result.includes("- Authentication and user accounts"));
  });

  it("includes email feature when email service detected", () => {
    const scan = makeScan({
      services: [makeService("sendgrid", "email", ["email address"])],
    });
    const result = generatePrivacyPolicyChangelog(scan)!;
    assert.ok(result.includes("- Email communications"));
  });

  it("includes storage feature when storage service detected", () => {
    const scan = makeScan({
      services: [makeService("aws-s3", "storage", ["uploaded files"])],
    });
    const result = generatePrivacyPolicyChangelog(scan)!;
    assert.ok(result.includes("- File/data storage"));
  });

  it("includes monitoring feature when monitoring service detected", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring", ["error logs"])],
    });
    const result = generatePrivacyPolicyChangelog(scan)!;
    assert.ok(result.includes("- Error monitoring and logging"));
  });

  it("does not include conditional features for unrelated categories", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyPolicyChangelog(scan)!;
    assert.ok(!result.includes("- AI/ML processing"));
    assert.ok(!result.includes("- Analytics and tracking"));
    assert.ok(!result.includes("- Authentication and user accounts"));
  });

  it("includes policy version archive section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyPolicyChangelog(scan)!;
    assert.ok(result.includes("## 5. Policy Version Archive"));
    assert.ok(result.includes("PRIVACY_POLICY.md"));
  });

  it("includes review schedule section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyPolicyChangelog(scan)!;
    assert.ok(result.includes("## 6. Review Schedule"));
    assert.ok(result.includes("Quarterly"));
    assert.ok(result.includes("codepliant diff"));
  });

  it("includes contact section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyPolicyChangelog(scan, {
      companyName: "TestCo",
      contactEmail: "info@test.com",
      dpoName: "John DPO",
      dpoEmail: "dpo@test.com",
    })!;
    assert.ok(result.includes("## 7. Contact"));
    assert.ok(result.includes("info@test.com"));
    assert.ok(result.includes("John DPO"));
    assert.ok(result.includes("dpo@test.com"));
  });

  it("includes Codepliant disclaimer with project name", () => {
    const scan = makeScan({
      projectName: "my-app",
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyPolicyChangelog(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("my-app"));
  });

  it("sorts service names alphabetically", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("google-analytics", "analytics"),
        makeService("auth0", "auth"),
      ],
    });
    const result = generatePrivacyPolicyChangelog(scan)!;
    const authIdx = result.indexOf("- auth0");
    const gaIdx = result.indexOf("- google-analytics");
    const stripeIdx = result.indexOf("- stripe");
    assert.ok(authIdx < gaIdx);
    assert.ok(gaIdx < stripeIdx);
  });

  it("includes GDPR reference in header", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generatePrivacyPolicyChangelog(scan)!;
    assert.ok(result.includes("GDPR"));
    assert.ok(result.includes("Art. 12-14"));
  });
});
