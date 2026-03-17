import { describe, it } from "node:test";
import * as assert from "node:assert/strict";
import { generateComplianceBudgetTemplate } from "./compliance-budget-template.js";
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

describe("generateComplianceBudgetTemplate", () => {
  it("generates a budget template with title and overview", () => {
    const result = generateComplianceBudgetTemplate(makeScan());
    assert.ok(result.includes("# Compliance Budget Template"));
    assert.ok(result.includes("## Overview"));
  });

  it("includes all five budget categories", () => {
    const result = generateComplianceBudgetTemplate(makeScan());
    assert.ok(result.includes("## 1. Tools & Software"));
    assert.ok(result.includes("## 2. Legal & Advisory"));
    assert.ok(result.includes("## 3. Training & Awareness"));
    assert.ok(result.includes("## 4. Audit & Certification"));
    assert.ok(result.includes("## 5. Insurance"));
  });

  it("includes budget summary with total", () => {
    const result = generateComplianceBudgetTemplate(makeScan());
    assert.ok(result.includes("## Budget Summary"));
    assert.ok(result.includes("**TOTAL**"));
    assert.ok(result.includes("Estimated annual compliance investment"));
  });

  it("uses default company name placeholder when no context provided", () => {
    const result = generateComplianceBudgetTemplate(makeScan());
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses company name from context", () => {
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "privacy@acme.com" };
    const result = generateComplianceBudgetTemplate(makeScan(), ctx);
    assert.ok(result.includes("Acme Corp"));
    assert.ok(!result.includes("[Your Company Name]"));
  });

  it("detects Startup tier for few services", () => {
    const scan = makeScan({
      services: [
        { name: "PostHog", category: "analytics", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["usage data"] },
      ],
    });
    const result = generateComplianceBudgetTemplate(scan);
    assert.ok(result.includes("Tier: **Startup**"));
  });

  it("detects Growth tier for 5+ services", () => {
    const services = Array.from({ length: 6 }, (_, i) => ({
      name: `svc-${i}`,
      category: "other" as const,
      evidence: [{ type: "dependency" as const, file: "package.json", detail: "pkg" }],
      dataCollected: ["data"],
    }));
    const scan = makeScan({ services });
    const result = generateComplianceBudgetTemplate(scan);
    assert.ok(result.includes("Tier: **Growth**"));
  });

  it("detects Enterprise tier for 15+ services", () => {
    const services = Array.from({ length: 16 }, (_, i) => ({
      name: `svc-${i}`,
      category: "other" as const,
      evidence: [{ type: "dependency" as const, file: "package.json", detail: "pkg" }],
      dataCollected: ["data"],
    }));
    const scan = makeScan({ services });
    const result = generateComplianceBudgetTemplate(scan);
    assert.ok(result.includes("Tier: **Enterprise**"));
  });

  it("detects Enterprise tier when AI + payment present", () => {
    const scan = makeScan({
      services: [
        { name: "OpenAI", category: "ai", evidence: [{ type: "import", file: "src/index.ts", detail: "openai" }], dataCollected: ["prompts"] },
        { name: "Stripe", category: "payment", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["payment info"] },
      ],
    });
    const result = generateComplianceBudgetTemplate(scan);
    assert.ok(result.includes("Tier: **Enterprise**"));
  });

  it("adds AI-specific tools and legal items when AI detected", () => {
    const scan = makeScan({
      services: [
        { name: "OpenAI", category: "ai", evidence: [{ type: "import", file: "src/index.ts", detail: "openai" }], dataCollected: ["prompts"] },
      ],
    });
    const result = generateComplianceBudgetTemplate(scan);
    assert.ok(result.includes("AI monitoring"));
    assert.ok(result.includes("AI bias testing"));
    assert.ok(result.includes("EU AI Act compliance review"));
    assert.ok(result.includes("AI ethics advisory"));
    assert.ok(result.includes("AI liability coverage"));
    assert.ok(result.includes("AI ethics and responsible AI training"));
  });

  it("adds PCI DSS items when payment detected", () => {
    const scan = makeScan({
      services: [
        { name: "Stripe", category: "payment", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["payment info"] },
      ],
    });
    const result = generateComplianceBudgetTemplate(scan);
    assert.ok(result.includes("PCI DSS scanning tools"));
    assert.ok(result.includes("PCI DSS QSA assessment"));
    assert.ok(result.includes("PCI DSS awareness training"));
    assert.ok(result.includes("PCI DSS assessment"));
  });

  it("marks analytics cookie consent as Critical", () => {
    const scan = makeScan({
      services: [
        { name: "PostHog", category: "analytics", evidence: [{ type: "env_var", file: ".env", detail: "KEY" }], dataCollected: ["usage data"] },
      ],
    });
    const result = generateComplianceBudgetTemplate(scan);
    assert.ok(result.includes("analytics cookies detected"));
    assert.ok(result.includes("**Critical**"));
  });

  it("adds CCPA legal assessment when ccpa jurisdiction present", () => {
    const ctx: GeneratorContext = {
      companyName: "Test Co",
      contactEmail: "test@test.com",
      jurisdictions: ["ccpa"],
    };
    const result = generateComplianceBudgetTemplate(makeScan(), ctx);
    assert.ok(result.includes("CCPA compliance assessment"));
    assert.ok(result.includes("CCPA/CPRA"));
  });

  it("adds HIPAA items when health compliance need detected", () => {
    const scan = makeScan({
      complianceNeeds: [{ document: "HIPAA Compliance", reason: "health data", priority: "required" }],
    });
    const result = generateComplianceBudgetTemplate(scan);
    assert.ok(result.includes("HIPAA compliance assessment"));
  });

  it("includes SOC 2 for Growth tier but not Startup", () => {
    const startupScan = makeScan({
      services: [{ name: "svc", category: "other", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["data"] }],
    });
    const startupResult = generateComplianceBudgetTemplate(startupScan);
    assert.ok(!startupResult.includes("SOC 2 Type II"));

    const growthServices = Array.from({ length: 6 }, (_, i) => ({
      name: `svc-${i}`,
      category: "other" as const,
      evidence: [{ type: "dependency" as const, file: "package.json", detail: "pkg" }],
      dataCollected: ["data"],
    }));
    const growthResult = generateComplianceBudgetTemplate(makeScan({ services: growthServices }));
    assert.ok(growthResult.includes("SOC 2 Type II"));
  });

  it("includes ISO 27001 for Enterprise tier only", () => {
    const growthServices = Array.from({ length: 6 }, (_, i) => ({
      name: `svc-${i}`,
      category: "other" as const,
      evidence: [{ type: "dependency" as const, file: "package.json", detail: "pkg" }],
      dataCollected: ["data"],
    }));
    const growthResult = generateComplianceBudgetTemplate(makeScan({ services: growthServices }));
    assert.ok(!growthResult.includes("ISO 27001"));

    const enterpriseServices = Array.from({ length: 16 }, (_, i) => ({
      name: `svc-${i}`,
      category: "other" as const,
      evidence: [{ type: "dependency" as const, file: "package.json", detail: "pkg" }],
      dataCollected: ["data"],
    }));
    const enterpriseResult = generateComplianceBudgetTemplate(makeScan({ services: enterpriseServices }));
    assert.ok(enterpriseResult.includes("ISO 27001"));
  });

  it("includes cost optimization strategies", () => {
    const result = generateComplianceBudgetTemplate(makeScan());
    assert.ok(result.includes("## Cost Optimization Strategies"));
    assert.ok(result.includes("Quick Wins"));
    assert.ok(result.includes("Phase Your Spending"));
    assert.ok(result.includes("Codepliant"));
  });

  it("lists cost drivers based on detected services", () => {
    const result = generateComplianceBudgetTemplate(makeScan());
    assert.ok(result.includes("## Cost Drivers"));
    assert.ok(result.includes("AI services detected"));
    assert.ok(result.includes("Payment processing detected"));
  });

  it("shows GDPR cost driver (always present)", () => {
    const scan = makeScan({
      services: [{ name: "svc", category: "other", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["data"] }],
    });
    const result = generateComplianceBudgetTemplate(scan);
    assert.ok(result.includes("GDPR applicability"));
  });

  it("includes per-service cost impact table", () => {
    const result = generateComplianceBudgetTemplate(makeScan());
    assert.ok(result.includes("## Per-Service Compliance Cost Impact"));
    assert.ok(result.includes("Stripe"));
    assert.ok(result.includes("OpenAI"));
    assert.ok(result.includes("DPA Review"));
  });

  it("caps per-service table at 20 entries", () => {
    const services = Array.from({ length: 25 }, (_, i) => ({
      name: `svc-${i}`,
      category: "other" as const,
      evidence: [{ type: "dependency" as const, file: "package.json", detail: "pkg" }],
      dataCollected: ["data"],
    }));
    const result = generateComplianceBudgetTemplate(makeScan({ services }));
    assert.ok(result.includes("... and 5 more"));
  });

  it("includes disclaimer footer", () => {
    const result = generateComplianceBudgetTemplate(makeScan());
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("indicative"));
    assert.ok(result.includes("test-project"));
  });

  it("shows auth cost driver when auth service detected", () => {
    const scan = makeScan({
      services: [
        { name: "@clerk/nextjs", category: "auth", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["user identity"] },
      ],
    });
    const result = generateComplianceBudgetTemplate(scan);
    assert.ok(result.includes("Authentication services detected"));
  });

  it("shows vendor count cost driver for 10+ services", () => {
    const services = Array.from({ length: 12 }, (_, i) => ({
      name: `svc-${i}`,
      category: "other" as const,
      evidence: [{ type: "dependency" as const, file: "package.json", detail: "pkg" }],
      dataCollected: ["data"],
    }));
    const result = generateComplianceBudgetTemplate(makeScan({ services }));
    assert.ok(result.includes("12 third-party services"));
  });

  it("marks high-risk services with higher cost in per-service table", () => {
    const scan = makeScan({
      services: [
        { name: "OpenAI", category: "ai", evidence: [{ type: "import", file: "src/index.ts", detail: "openai" }], dataCollected: ["prompts"] },
        { name: "svc", category: "other", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["data"] },
      ],
    });
    const result = generateComplianceBudgetTemplate(scan);
    assert.ok(result.includes("$2,000 - $7,000"));
    assert.ok(result.includes("$800 - $3,500"));
  });
});
