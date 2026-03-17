import { describe, it } from "node:test";
import * as assert from "node:assert/strict";
import { generateIncidentCommunicationTemplates } from "./incident-communication-templates.js";
import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

function makeScan(overrides?: Partial<ScanResult>): ScanResult {
  return {
    projectName: "test-project",
    projectPath: "/tmp/test",
    scannedAt: new Date().toISOString(),
    services: [
      { name: "Stripe", category: "payment", evidence: [{ type: "dependency", file: "package.json", detail: "stripe" }], dataCollected: ["payment info"] },
      { name: "OpenAI", category: "ai", evidence: [{ type: "import", file: "src/index.ts", detail: "openai" }], dataCollected: ["prompts"] },
      { name: "PostHog", category: "analytics", evidence: [{ type: "env_var", file: ".env", detail: "POSTHOG_KEY" }], dataCollected: ["usage data"] },
    ],
    dataCategories: [{ category: "personal", sources: ["email"] }],
    complianceNeeds: [],
    ...(overrides as any),
  };
}

describe("generateIncidentCommunicationTemplates", () => {
  it("returns null when no services detected", () => {
    const scan = makeScan({ services: [] });
    const result = generateIncidentCommunicationTemplates(scan);
    assert.equal(result, null);
  });

  it("generates document with header", () => {
    const result = generateIncidentCommunicationTemplates(makeScan());
    assert.ok(result);
    assert.ok(result.includes("# Incident Communication Templates"));
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses company name from context", () => {
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "privacy@acme.com" };
    const result = generateIncidentCommunicationTemplates(makeScan(), ctx);
    assert.ok(result);
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses contact email from context", () => {
    const ctx: GeneratorContext = { companyName: "TestCo", contactEmail: "help@testco.com" };
    const result = generateIncidentCommunicationTemplates(makeScan(), ctx);
    assert.ok(result);
    assert.ok(result.includes("help@testco.com"));
  });

  it("includes all five templates", () => {
    const result = generateIncidentCommunicationTemplates(makeScan());
    assert.ok(result);
    assert.ok(result.includes("## Template 1: Initial Notification"));
    assert.ok(result.includes("## Template 2: Status Update"));
    assert.ok(result.includes("## Template 3: Resolution Notice"));
    assert.ok(result.includes("## Template 4: Post-Mortem Report"));
    assert.ok(result.includes("## Template 5: Supervisory Authority Notification"));
  });

  it("includes email and status page versions for initial notification", () => {
    const result = generateIncidentCommunicationTemplates(makeScan());
    assert.ok(result);
    assert.ok(result.includes("### Email Version"));
    assert.ok(result.includes("### Status Page / Public Notice Version"));
  });

  it("includes email version for status update template", () => {
    const result = generateIncidentCommunicationTemplates(makeScan());
    assert.ok(result);
    assert.ok(result.includes("### Status Page Version"));
    assert.ok(result.includes("Update #[N]"));
  });

  it("includes resolution notice with remediation sections", () => {
    const result = generateIncidentCommunicationTemplates(makeScan());
    assert.ok(result);
    assert.ok(result.includes("INCIDENT SUMMARY"));
    assert.ok(result.includes("WHAT WE DID"));
    assert.ok(result.includes("WHAT WE ARE DOING TO PREVENT RECURRENCE"));
    assert.ok(result.includes("COMPENSATION / SUPPORT"));
  });

  it("includes post-mortem with timeline and action items", () => {
    const result = generateIncidentCommunicationTemplates(makeScan());
    assert.ok(result);
    assert.ok(result.includes("## Executive Summary"));
    assert.ok(result.includes("## Timeline"));
    assert.ok(result.includes("## Root Cause"));
    assert.ok(result.includes("## Action Items"));
    assert.ok(result.includes("## Regulatory Compliance"));
  });

  it("adds PCI DSS regulatory items when payment services detected", () => {
    const scan = makeScan({
      services: [
        { name: "Stripe", category: "payment", evidence: [{ type: "dependency", file: "package.json", detail: "stripe" }], dataCollected: ["payment info"] },
      ],
    });
    const result = generateIncidentCommunicationTemplates(scan);
    assert.ok(result);
    assert.ok(result.includes("Payment processor notified within 24 hours"));
    assert.ok(result.includes("Card brands notified"));
  });

  it("adds AI-specific regulatory items when AI services detected", () => {
    const scan = makeScan({
      services: [
        { name: "OpenAI", category: "ai", evidence: [{ type: "import", file: "src/index.ts", detail: "openai" }], dataCollected: ["prompts"] },
      ],
    });
    const result = generateIncidentCommunicationTemplates(scan);
    assert.ok(result);
    assert.ok(result.includes("AI provider notified"));
    assert.ok(result.includes("AI model inputs/outputs reviewed"));
  });

  it("omits PCI items when no payment services", () => {
    const scan = makeScan({
      services: [
        { name: "PostHog", category: "analytics", evidence: [{ type: "env_var", file: ".env", detail: "POSTHOG_KEY" }], dataCollected: ["usage data"] },
      ],
    });
    const result = generateIncidentCommunicationTemplates(scan);
    assert.ok(result);
    assert.ok(!result.includes("Payment processor notified"));
  });

  it("omits AI items when no AI services", () => {
    const scan = makeScan({
      services: [
        { name: "PostHog", category: "analytics", evidence: [{ type: "env_var", file: ".env", detail: "POSTHOG_KEY" }], dataCollected: ["usage data"] },
      ],
    });
    const result = generateIncidentCommunicationTemplates(scan);
    assert.ok(result);
    assert.ok(!result.includes("AI provider notified"));
  });

  it("includes GDPR Art 33 notification template", () => {
    const result = generateIncidentCommunicationTemplates(makeScan());
    assert.ok(result);
    assert.ok(result.includes("PERSONAL DATA BREACH NOTIFICATION"));
    assert.ok(result.includes("Supervisory authority notified within 72 hours"));
    assert.ok(result.includes("GDPR Art. 33"));
  });

  it("includes usage guide with timing table", () => {
    const result = generateIncidentCommunicationTemplates(makeScan());
    assert.ok(result);
    assert.ok(result.includes("## Usage Guide"));
    assert.ok(result.includes("### When to Use Each Template"));
    assert.ok(result.includes("### Communication Channels"));
  });

  it("uses DPO info from context", () => {
    const ctx: GeneratorContext = {
      companyName: "TestCo",
      contactEmail: "help@testco.com",
      dpoName: "Jane DPO",
      dpoEmail: "jane@testco.com",
    };
    const result = generateIncidentCommunicationTemplates(makeScan(), ctx);
    assert.ok(result);
    assert.ok(result.includes("Jane DPO"));
    assert.ok(result.includes("jane@testco.com"));
  });

  it("uses security email from context for communication channels", () => {
    const ctx: GeneratorContext = {
      companyName: "TestCo",
      contactEmail: "help@testco.com",
      securityEmail: "security@testco.com",
    };
    const result = generateIncidentCommunicationTemplates(makeScan(), ctx);
    assert.ok(result);
    assert.ok(result.includes("security@testco.com"));
  });

  it("falls back to contact email when security email not provided", () => {
    const ctx: GeneratorContext = {
      companyName: "TestCo",
      contactEmail: "help@testco.com",
    };
    const result = generateIncidentCommunicationTemplates(makeScan(), ctx);
    assert.ok(result);
    // securityEmail defaults to contactEmail
    assert.ok(result.includes("help@testco.com"));
  });

  it("uses website from context in authority notification", () => {
    const ctx: GeneratorContext = {
      companyName: "TestCo",
      contactEmail: "help@testco.com",
      website: "https://testco.com",
    };
    const result = generateIncidentCommunicationTemplates(makeScan(), ctx);
    assert.ok(result);
    assert.ok(result.includes("https://testco.com"));
  });

  it("includes disclaimer footer", () => {
    const result = generateIncidentCommunicationTemplates(makeScan());
    assert.ok(result);
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("test-project"));
    assert.ok(result.includes("reviewed and customized"));
  });

  it("includes instructions about replacing bracketed placeholders", () => {
    const result = generateIncidentCommunicationTemplates(makeScan());
    assert.ok(result);
    assert.ok(result.includes("[BRACKETED]"));
    assert.ok(result.includes("Replace all"));
  });

  it("always includes internal breach register and insurance items", () => {
    const scan = makeScan({
      services: [
        { name: "svc", category: "other", evidence: [{ type: "dependency", file: "package.json", detail: "svc" }], dataCollected: ["data"] },
      ],
    });
    const result = generateIncidentCommunicationTemplates(scan);
    assert.ok(result);
    assert.ok(result.includes("Internal breach register updated"));
    assert.ok(result.includes("Insurance carrier notified"));
  });
});
