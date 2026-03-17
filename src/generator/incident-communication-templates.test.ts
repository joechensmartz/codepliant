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

function makeCtx(overrides?: Partial<GeneratorContext>): GeneratorContext {
  return {
    companyName: "Acme Corp",
    contactEmail: "help@acme.com",
    ...overrides,
  };
}

describe("generateIncidentCommunicationTemplates", () => {
  // ── Null guard ──────────────────────────────────────────────────────
  it("returns null when no services detected", () => {
    const scan = makeScan({ services: [] });
    assert.equal(generateIncidentCommunicationTemplates(scan), null);
  });

  it("returns null for empty services array with context provided", () => {
    const scan = makeScan({ services: [] });
    assert.equal(generateIncidentCommunicationTemplates(scan, makeCtx()), null);
  });

  // ── Basic generation / header ───────────────────────────────────────
  it("generates document with title", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("# Incident Communication Templates"));
  });

  it("includes organization name in header", () => {
    const result = generateIncidentCommunicationTemplates(makeScan(), makeCtx())!;
    assert.ok(result.includes("**Organization:** Acme Corp"));
  });

  it("includes last updated date", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(`**Last updated:** ${today}`));
  });

  it("includes introductory description", () => {
    const result = generateIncidentCommunicationTemplates(makeScan(), makeCtx())!;
    assert.ok(result.includes("Pre-written communication templates"));
    assert.ok(result.includes("initial notification"));
    assert.ok(result.includes("status updates"));
    assert.ok(result.includes("resolution notice"));
    assert.ok(result.includes("post-mortem report"));
  });

  it("includes instructions about replacing bracketed placeholders", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("[BRACKETED]"));
    assert.ok(result.includes("Replace all"));
  });

  // ── Context values ─────────────────────────────────────────────────
  it("uses company name from context", () => {
    const result = generateIncidentCommunicationTemplates(makeScan(), makeCtx({ companyName: "TestCo" }))!;
    assert.ok(result.includes("TestCo"));
  });

  it("uses placeholder company name when no context", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses contact email from context", () => {
    const result = generateIncidentCommunicationTemplates(makeScan(), makeCtx({ contactEmail: "support@acme.com" }))!;
    assert.ok(result.includes("support@acme.com"));
  });

  it("uses placeholder contact email when no context", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses DPO name from context", () => {
    const result = generateIncidentCommunicationTemplates(makeScan(), makeCtx({ dpoName: "Jane DPO" }))!;
    assert.ok(result.includes("Jane DPO"));
  });

  it("uses placeholder DPO name when not provided", () => {
    const result = generateIncidentCommunicationTemplates(makeScan(), makeCtx())!;
    assert.ok(result.includes("[Data Protection Officer]"));
  });

  it("uses DPO email from context", () => {
    const result = generateIncidentCommunicationTemplates(makeScan(), makeCtx({ dpoEmail: "jane@acme.com" }))!;
    assert.ok(result.includes("jane@acme.com"));
  });

  it("uses placeholder DPO email when not provided", () => {
    const result = generateIncidentCommunicationTemplates(makeScan(), makeCtx())!;
    assert.ok(result.includes("[dpo@example.com]"));
  });

  it("uses security email from context", () => {
    const result = generateIncidentCommunicationTemplates(makeScan(), makeCtx({ securityEmail: "security@acme.com" }))!;
    assert.ok(result.includes("security@acme.com"));
  });

  it("falls back to contact email when security email not provided", () => {
    const result = generateIncidentCommunicationTemplates(makeScan(), makeCtx({ contactEmail: "help@acme.com" }))!;
    // securityEmail defaults to contactEmail, appears in communication channels
    assert.ok(result.includes("help@acme.com"));
  });

  it("uses website from context in authority notification", () => {
    const result = generateIncidentCommunicationTemplates(makeScan(), makeCtx({ website: "https://acme.com" }))!;
    assert.ok(result.includes("https://acme.com"));
  });

  it("uses placeholder website when not provided", () => {
    const result = generateIncidentCommunicationTemplates(makeScan(), makeCtx())!;
    assert.ok(result.includes("[https://yoursite.com]"));
  });

  // ── Template 1: Initial Notification ────────────────────────────────
  it("includes Template 1 with title", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("## Template 1: Initial Notification"));
  });

  it("Template 1 has 2-hour timing guidance", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("within the first 2 hours"));
  });

  it("Template 1 has email version with subject line", () => {
    const result = generateIncidentCommunicationTemplates(makeScan(), makeCtx())!;
    assert.ok(result.includes("Subject: Security Notice"));
    assert.ok(result.includes("Acme Corp is investigating"));
  });

  it("Template 1 email includes WHAT WE KNOW section", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("WHAT WE KNOW:"));
    assert.ok(result.includes("Date discovered"));
    assert.ok(result.includes("Nature of incident"));
    assert.ok(result.includes("Systems affected"));
  });

  it("Template 1 email includes WHAT WE ARE DOING section", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("WHAT WE ARE DOING:"));
    assert.ok(result.includes("security team is actively investigating"));
  });

  it("Template 1 email includes WHAT YOU SHOULD DO section", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("WHAT YOU SHOULD DO:"));
    assert.ok(result.includes("Change your password"));
    assert.ok(result.includes("two-factor authentication"));
    assert.ok(result.includes("unauthorized activity"));
    assert.ok(result.includes("phishing"));
  });

  it("Template 1 has status page version", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("### Status Page / Public Notice Version"));
    assert.ok(result.includes("INVESTIGATING"));
    assert.ok(result.includes("Status: Investigating"));
  });

  // ── Template 2: Status Update ──────────────────────────────────────
  it("includes Template 2 with title", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("## Template 2: Status Update"));
  });

  it("Template 2 has timing guidance of 4-12 hours", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("every 4-12 hours"));
  });

  it("Template 2 email includes subject with update number", () => {
    const result = generateIncidentCommunicationTemplates(makeScan(), makeCtx())!;
    assert.ok(result.includes("Subject: Update [#N]"));
    assert.ok(result.includes("Acme Corp Security Incident"));
  });

  it("Template 2 includes CURRENT STATUS section", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("CURRENT STATUS:"));
    assert.ok(result.includes("Containment / Eradication / Recovery"));
  });

  it("Template 2 includes DATA IMPACT UPDATE section", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("DATA IMPACT UPDATE:"));
    assert.ok(result.includes("Types of data affected"));
    assert.ok(result.includes("Number of accounts"));
    assert.ok(result.includes("Time period of exposure"));
  });

  it("Template 2 has status page version", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("### Status Page Version"));
    assert.ok(result.includes("UPDATE — Security Incident"));
  });

  // ── Template 3: Resolution Notice ──────────────────────────────────
  it("includes Template 3 with title", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("## Template 3: Resolution Notice"));
  });

  it("Template 3 has fully resolved timing", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("fully resolved and systems are restored"));
  });

  it("Template 3 email includes INCIDENT SUMMARY", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("INCIDENT SUMMARY:"));
    assert.ok(result.includes("Date discovered"));
    assert.ok(result.includes("Date resolved"));
    assert.ok(result.includes("Total duration"));
    assert.ok(result.includes("Root cause"));
  });

  it("Template 3 includes WHAT WE DID and prevention sections", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("WHAT WE DID:"));
    assert.ok(result.includes("WHAT WE ARE DOING TO PREVENT RECURRENCE:"));
  });

  it("Template 3 includes COMPENSATION / SUPPORT section", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("COMPENSATION / SUPPORT:"));
  });

  it("Template 3 includes DPO contact info in resolution", () => {
    const ctx = makeCtx({ dpoName: "Alice DPO", dpoEmail: "alice@acme.com" });
    const result = generateIncidentCommunicationTemplates(makeScan(), ctx)!;
    assert.ok(result.includes("Alice DPO"));
    assert.ok(result.includes("alice@acme.com"));
  });

  it("Template 3 includes apology statement", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("sincerely apologize"));
    assert.ok(result.includes("trust"));
  });

  it("Template 3 has resolved status page version", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("RESOLVED — Security Incident"));
    assert.ok(result.includes("Status: Resolved"));
  });

  // ── Template 4: Post-Mortem Report ─────────────────────────────────
  it("includes Template 4 with title", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("## Template 4: Post-Mortem Report"));
  });

  it("Template 4 has 5 business days timing", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("within 5 business days"));
  });

  it("Template 4 includes post-mortem structure", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("## Executive Summary"));
    assert.ok(result.includes("## Timeline"));
    assert.ok(result.includes("## Root Cause"));
    assert.ok(result.includes("## Impact"));
    assert.ok(result.includes("## Detection"));
    assert.ok(result.includes("## Response Assessment"));
    assert.ok(result.includes("## Action Items"));
    assert.ok(result.includes("## Regulatory Compliance"));
  });

  it("Template 4 timeline has UTC time entries", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("Time (UTC)"));
    assert.ok(result.includes("[HH:MM]"));
  });

  it("Template 4 detection has checkbox options", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("Automated monitoring"));
    assert.ok(result.includes("Employee report"));
    assert.ok(result.includes("Customer report"));
    assert.ok(result.includes("Third-party notification"));
    assert.ok(result.includes("Security audit"));
  });

  it("Template 4 response assessment has what went well and improvements", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("### What went well"));
    assert.ok(result.includes("### What could be improved"));
  });

  it("Template 4 action items table has priority and status columns", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("| # | Action | Owner | Priority | Due Date | Status |"));
  });

  it("Template 4 includes GDPR Art 33 checkbox", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("Supervisory authority notified within 72 hours"));
    assert.ok(result.includes("GDPR Art. 33"));
  });

  it("Template 4 includes GDPR Art 34 notification checkbox", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("Affected individuals notified"));
    assert.ok(result.includes("GDPR Art. 34"));
  });

  // ── Conditional PCI DSS items ──────────────────────────────────────
  it("adds PCI DSS items when payment services detected", () => {
    const scan = makeScan({
      services: [
        { name: "Stripe", category: "payment", evidence: [{ type: "dependency", file: "package.json", detail: "stripe" }], dataCollected: ["payment info"] },
      ],
    });
    const result = generateIncidentCommunicationTemplates(scan)!;
    assert.ok(result.includes("Payment processor notified within 24 hours"));
    assert.ok(result.includes("PCI DSS"));
    assert.ok(result.includes("Card brands notified"));
  });

  it("omits PCI items when no payment services", () => {
    const scan = makeScan({
      services: [
        { name: "PostHog", category: "analytics", evidence: [{ type: "env_var", file: ".env", detail: "POSTHOG_KEY" }], dataCollected: ["usage data"] },
      ],
    });
    const result = generateIncidentCommunicationTemplates(scan)!;
    assert.ok(!result.includes("Payment processor notified"));
    assert.ok(!result.includes("Card brands notified"));
  });

  // ── Conditional AI items ───────────────────────────────────────────
  it("adds AI-specific items when AI services detected", () => {
    const scan = makeScan({
      services: [
        { name: "OpenAI", category: "ai", evidence: [{ type: "import", file: "src/index.ts", detail: "openai" }], dataCollected: ["prompts"] },
      ],
    });
    const result = generateIncidentCommunicationTemplates(scan)!;
    assert.ok(result.includes("AI provider notified of data exposure"));
    assert.ok(result.includes("AI model inputs/outputs reviewed for data leakage"));
  });

  it("omits AI items when no AI services", () => {
    const scan = makeScan({
      services: [
        { name: "PostHog", category: "analytics", evidence: [{ type: "env_var", file: ".env", detail: "POSTHOG_KEY" }], dataCollected: ["usage data"] },
      ],
    });
    const result = generateIncidentCommunicationTemplates(scan)!;
    assert.ok(!result.includes("AI provider notified"));
    assert.ok(!result.includes("AI model inputs/outputs"));
  });

  it("includes both PCI and AI items when both service types exist", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("Payment processor notified"));
    assert.ok(result.includes("AI provider notified"));
  });

  // ── Always-present regulatory items ────────────────────────────────
  it("always includes internal breach register item", () => {
    const scan = makeScan({
      services: [
        { name: "svc", category: "other" as any, evidence: [{ type: "dependency", file: "package.json", detail: "svc" }], dataCollected: ["data"] },
      ],
    });
    const result = generateIncidentCommunicationTemplates(scan)!;
    assert.ok(result.includes("Internal breach register updated"));
  });

  it("always includes insurance carrier notification item", () => {
    const scan = makeScan({
      services: [
        { name: "svc", category: "other" as any, evidence: [{ type: "dependency", file: "package.json", detail: "svc" }], dataCollected: ["data"] },
      ],
    });
    const result = generateIncidentCommunicationTemplates(scan)!;
    assert.ok(result.includes("Insurance carrier notified"));
  });

  // ── Template 5: Supervisory Authority Notification ─────────────────
  it("includes Template 5 with title", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("## Template 5: Supervisory Authority Notification"));
  });

  it("Template 5 references 72-hour deadline", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("72 hours"));
    assert.ok(result.includes("GDPR Art. 33"));
  });

  it("Template 5 includes PERSONAL DATA BREACH NOTIFICATION header", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("PERSONAL DATA BREACH NOTIFICATION"));
  });

  it("Template 5 includes Data Controller info", () => {
    const result = generateIncidentCommunicationTemplates(makeScan(), makeCtx())!;
    assert.ok(result.includes("Data Controller: Acme Corp"));
  });

  it("Template 5 includes DPO info", () => {
    const ctx = makeCtx({ dpoName: "Bob DPO", dpoEmail: "bob@acme.com" });
    const result = generateIncidentCommunicationTemplates(makeScan(), ctx)!;
    assert.ok(result.includes("DPO: Bob DPO"));
    assert.ok(result.includes("DPO Contact: bob@acme.com"));
  });

  it("Template 5 includes 13 required notification fields", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("1. Date and time of breach discovery"));
    assert.ok(result.includes("2. Date and time breach occurred"));
    assert.ok(result.includes("3. How the breach was discovered"));
    assert.ok(result.includes("4. Nature of the breach"));
    assert.ok(result.includes("5. Categories of data subjects"));
    assert.ok(result.includes("6. Approximate number of data subjects"));
    assert.ok(result.includes("7. Categories of personal data"));
    assert.ok(result.includes("8. Approximate number of records"));
    assert.ok(result.includes("9. Likely consequences of the breach"));
    assert.ok(result.includes("10. Measures taken to address the breach"));
    assert.ok(result.includes("11. Measures taken to mitigate adverse effects"));
    assert.ok(result.includes("12. Have data subjects been notified?"));
    assert.ok(result.includes("13. Cross-border transfer"));
  });

  it("Template 5 includes breach nature types (Confidentiality/Integrity/Availability)", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("Confidentiality"));
    assert.ok(result.includes("Integrity"));
    assert.ok(result.includes("Availability"));
  });

  // ── Usage Guide ────────────────────────────────────────────────────
  it("includes usage guide section", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("## Usage Guide"));
  });

  it("includes When to Use Each Template table", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("### When to Use Each Template"));
    assert.ok(result.includes("| Template | When | Who Sends | Who Receives |"));
  });

  it("usage guide lists all 5 templates with correct timing", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("Within 2 hours"));
    assert.ok(result.includes("Every 4-12 hours"));
    assert.ok(result.includes("fully resolved"));
    assert.ok(result.includes("5 business days"));
    assert.ok(result.includes("Within 72 hours"));
  });

  it("includes Communication Channels table", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("### Communication Channels"));
    assert.ok(result.includes("Direct email"));
    assert.ok(result.includes("Status page"));
    assert.ok(result.includes("In-app banner"));
    assert.ok(result.includes("Social media"));
    assert.ok(result.includes("Blog post"));
  });

  it("communication channels table references security email", () => {
    const ctx = makeCtx({ securityEmail: "sec@acme.com" });
    const result = generateIncidentCommunicationTemplates(makeScan(), ctx)!;
    assert.ok(result.includes("sec@acme.com"));
  });

  // ── Disclaimer footer ──────────────────────────────────────────────
  it("includes Codepliant attribution in disclaimer", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("Codepliant"));
  });

  it("includes project name in disclaimer", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("test-project"));
  });

  it("includes review guidance in disclaimer", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    assert.ok(result.includes("reviewed and customized"));
    assert.ok(result.includes("legal, security, and communications teams"));
  });

  // ── All 5 templates present ────────────────────────────────────────
  it("includes all five templates in order", () => {
    const result = generateIncidentCommunicationTemplates(makeScan())!;
    const t1 = result.indexOf("## Template 1:");
    const t2 = result.indexOf("## Template 2:");
    const t3 = result.indexOf("## Template 3:");
    const t4 = result.indexOf("## Template 4:");
    const t5 = result.indexOf("## Template 5:");
    assert.ok(t1 > 0);
    assert.ok(t2 > t1);
    assert.ok(t3 > t2);
    assert.ok(t4 > t3);
    assert.ok(t5 > t4);
  });

  // ── Edge case: analytics-only service ──────────────────────────────
  it("works with analytics-only service (no AI, no payment items)", () => {
    const scan = makeScan({
      services: [
        { name: "PostHog", category: "analytics", evidence: [{ type: "env_var", file: ".env", detail: "POSTHOG_KEY" }], dataCollected: ["usage data"] },
      ],
    });
    const result = generateIncidentCommunicationTemplates(scan)!;
    assert.ok(result.includes("# Incident Communication Templates"));
    assert.ok(!result.includes("Payment processor"));
    assert.ok(!result.includes("AI provider"));
    assert.ok(result.includes("Internal breach register"));
  });

  // ── Edge case: single service ──────────────────────────────────────
  it("works with a single service", () => {
    const scan = makeScan({
      services: [
        { name: "Sentry", category: "monitoring", evidence: [{ type: "dependency", file: "package.json", detail: "@sentry/node" }], dataCollected: ["error data"] },
      ],
    });
    const result = generateIncidentCommunicationTemplates(scan)!;
    assert.ok(result.includes("# Incident Communication Templates"));
    assert.ok(result.includes("PERSONAL DATA BREACH NOTIFICATION"));
  });

  // ── Company name appears throughout templates ──────────────────────
  it("uses company name in email subject lines", () => {
    const ctx = makeCtx({ companyName: "BigTech Inc" });
    const result = generateIncidentCommunicationTemplates(makeScan(), ctx)!;
    assert.ok(result.includes("Security Notice — BigTech Inc"));
    assert.ok(result.includes("BigTech Inc Security Incident"));
    assert.ok(result.includes("Resolved — BigTech Inc"));
  });

  it("uses company name in status page versions", () => {
    const ctx = makeCtx({ companyName: "BigTech Inc" });
    const result = generateIncidentCommunicationTemplates(makeScan(), ctx)!;
    // Status page posts include company name
    const statusPageMentions = result.split("BigTech Inc").length - 1;
    assert.ok(statusPageMentions >= 5, `Company name should appear many times, found ${statusPageMentions}`);
  });

  it("includes Security Team sign-off in email templates", () => {
    const ctx = makeCtx({ companyName: "TestOrg" });
    const result = generateIncidentCommunicationTemplates(makeScan(), ctx)!;
    assert.ok(result.includes("TestOrg Security Team"));
  });
});
