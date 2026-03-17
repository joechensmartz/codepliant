import { describe, it } from "node:test";
import * as assert from "node:assert/strict";
import { generateExecutiveBriefing } from "./executive-briefing.js";
import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext, GeneratedDocument } from "./index.js";

function makeScan(overrides?: Partial<ScanResult>): ScanResult {
  return {
    projectName: "test-project",
    projectPath: "/tmp/test",
    services: [
      { name: "Stripe", category: "payment", evidence: [{ type: "dependency", file: "package.json", detail: "stripe" }], dataCollected: ["payment info"] },
      { name: "OpenAI", category: "ai", evidence: [{ type: "import", file: "src/index.ts", detail: "openai" }], dataCollected: ["prompts"] },
      { name: "PostHog", category: "analytics", evidence: [{ type: "env_var", file: ".env", detail: "POSTHOG_KEY" }], dataCollected: ["usage data"] },
    ],
    dataCategories: [{ category: "personal", sources: ["email"] }],
    ...(overrides as any),
  };
}

function makeDocs(): GeneratedDocument[] {
  return [
    { name: "Privacy Policy", filename: "PRIVACY_POLICY.md", content: "..." },
    { name: "AI Disclosure", filename: "AI_DISCLOSURE.md", content: "..." },
    { name: "Cookie Policy", filename: "COOKIE_POLICY.md", content: "..." },
    { name: "DPA", filename: "DATA_PROCESSING_AGREEMENT.md", content: "..." },
    { name: "Security Policy", filename: "SECURITY.md", content: "..." },
  ];
}

describe("generateExecutiveBriefing", () => {
  it("returns null when no services detected", () => {
    const scan = makeScan({ services: [] });
    const result = generateExecutiveBriefing(scan, undefined, [], { total: 0, grade: "F" });
    assert.equal(result, null);
  });

  it("generates briefing with compliance gauge", () => {
    const scan = makeScan();
    const docs = makeDocs();
    const result = generateExecutiveBriefing(scan, undefined, docs, { total: 85, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("# Executive Briefing"));
    assert.ok(result.includes("COMPLIANCE GAUGE"));
    assert.ok(result.includes("85/100"));
    assert.ok(result.includes("Grade"));
  });

  it("includes 3 key findings sections", () => {
    const scan = makeScan();
    const docs = makeDocs();
    const result = generateExecutiveBriefing(scan, undefined, docs, { total: 75, grade: "B" });
    assert.ok(result);
    assert.ok(result.includes("### 1. Compliance Status"));
    assert.ok(result.includes("### 2. Top Risk"));
    assert.ok(result.includes("### 3. Recommended Action"));
  });

  it("shows strong status for high scores", () => {
    const scan = makeScan();
    const docs = makeDocs();
    const result = generateExecutiveBriefing(scan, undefined, docs, { total: 90, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("Strong"));
    assert.ok(result.includes("strong compliance posture"));
  });

  it("shows critical status for low scores", () => {
    const scan = makeScan();
    const docs = makeDocs();
    const result = generateExecutiveBriefing(scan, undefined, docs, { total: 30, grade: "F" });
    assert.ok(result);
    assert.ok(result.includes("Critical"));
    assert.ok(result.includes("compliance gaps requiring attention"));
  });

  it("identifies AI risk when AI services present", () => {
    const scan = makeScan();
    const docs = makeDocs();
    const result = generateExecutiveBriefing(scan, undefined, docs, { total: 70, grade: "B" });
    assert.ok(result);
    assert.ok(result.includes("AI"));
    assert.ok(result.includes("OpenAI"));
  });

  it("uses company name from context", () => {
    const scan = makeScan();
    const docs = makeDocs();
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
    };
    const result = generateExecutiveBriefing(scan, ctx, docs, { total: 80, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("Acme Corp"));
  });

  it("includes services overview grouped by category", () => {
    const scan = makeScan();
    const docs = makeDocs();
    const result = generateExecutiveBriefing(scan, undefined, docs, { total: 80, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("Services Overview"));
    assert.ok(result.includes("payment"));
    assert.ok(result.includes("Stripe"));
  });

  it("includes At a Glance table", () => {
    const scan = makeScan();
    const docs = makeDocs();
    const result = generateExecutiveBriefing(scan, undefined, docs, { total: 80, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("At a Glance"));
    assert.ok(result.includes("Privacy & Data Protection"));
    assert.ok(result.includes("Information Security"));
  });

  it("includes disclaimer footer", () => {
    const scan = makeScan();
    const docs = makeDocs();
    const result = generateExecutiveBriefing(scan, undefined, docs, { total: 80, grade: "A" });
    assert.ok(result);
    assert.ok(result.includes("does not constitute legal advice"));
  });

  it("handles missing score gracefully", () => {
    const scan = makeScan();
    const docs = makeDocs();
    const result = generateExecutiveBriefing(scan, undefined, docs);
    assert.ok(result);
    assert.ok(result.includes("0/100"));
  });
});
