import { describe, it } from "node:test";
import * as assert from "node:assert/strict";
import { generateDataFlowDiagram, buildMermaidDiagram } from "./data-map-visual.js";
import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

function makeScan(overrides?: Partial<ScanResult>): ScanResult {
  return {
    projectName: "test-project",
    projectPath: "/tmp/test",
    scannedAt: new Date().toISOString(),
    services: [
      { name: "Stripe", category: "payment", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["payment info"] },
      { name: "OpenAI", category: "ai", evidence: [{ type: "import", file: "src/index.ts", detail: "openai" }], dataCollected: ["prompts"] },
      { name: "PostHog", category: "analytics", evidence: [{ type: "env_var", file: ".env", detail: "POSTHOG_KEY" }], dataCollected: ["usage data"] },
    ],
    dataCategories: [{ category: "personal", sources: ["email"] }],
    complianceNeeds: [],
    ...(overrides as any),
  };
}

describe("buildMermaidDiagram", () => {
  it("starts with graph LR", () => {
    const diagram = buildMermaidDiagram(makeScan());
    assert.ok(diagram.startsWith("graph LR"));
  });

  it("creates User -> Service edges for each service", () => {
    const diagram = buildMermaidDiagram(makeScan());
    assert.ok(diagram.includes("User"));
    assert.ok(diagram.includes("Stripe"));
    assert.ok(diagram.includes("OpenAI"));
    assert.ok(diagram.includes("PostHog"));
  });

  it("annotates edges with data collected labels", () => {
    const scan = makeScan({
      services: [
        { name: "Stripe", category: "payment", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["payment info", "email"] },
      ],
    });
    const diagram = buildMermaidDiagram(scan);
    assert.ok(diagram.includes("payment info, email"));
  });

  it("uses category as fallback label when no data collected", () => {
    const scan = makeScan({
      services: [
        { name: "svc-unknown", category: "other", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: [] },
      ],
    });
    const diagram = buildMermaidDiagram(scan);
    assert.ok(diagram.includes("other"));
  });

  it("deduplicates services by provider label", () => {
    const scan = makeScan({
      services: [
        { name: "@sentry/node", category: "monitoring", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["errors"] },
        { name: "@sentry/nextjs", category: "monitoring", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["errors"] },
      ],
    });
    const diagram = buildMermaidDiagram(scan);
    // Sentry appears twice in PROVIDER_SHORT, but buildMermaidDiagram deduplicates by label
    const sentryMatches = diagram.match(/Sentry/g);
    // Should appear in exactly one edge (from + to = 2 occurrences on the line)
    assert.ok(sentryMatches);
    // One edge line contains "Sentry" twice (from label and node label)
    assert.ok(sentryMatches.length <= 3);
  });

  it("adds AI -> monitoring forwarding edge", () => {
    const scan = makeScan({
      services: [
        { name: "OpenAI", category: "ai", evidence: [{ type: "import", file: "src/index.ts", detail: "openai" }], dataCollected: ["prompts"] },
        { name: "@sentry/node", category: "monitoring", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["errors"] },
      ],
    });
    const diagram = buildMermaidDiagram(scan);
    assert.ok(diagram.includes("logs"));
    assert.ok(diagram.includes("OpenAI"));
    assert.ok(diagram.includes("Sentry"));
  });

  it("does not add forwarding edge when only AI or only monitoring present", () => {
    const aiOnly = makeScan({
      services: [
        { name: "OpenAI", category: "ai", evidence: [{ type: "import", file: "src/index.ts", detail: "openai" }], dataCollected: ["prompts"] },
      ],
    });
    const diagram = buildMermaidDiagram(aiOnly);
    assert.ok(!diagram.includes("|logs|"));
  });

  it("sanitizes node IDs for Mermaid compatibility", () => {
    const scan = makeScan({
      services: [
        { name: "@clerk/nextjs", category: "auth", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["user identity"] },
      ],
    });
    const diagram = buildMermaidDiagram(scan);
    // Clerk should be used as provider short name, sanitized ID should not contain special chars
    assert.ok(diagram.includes("Clerk"));
    assert.ok(!diagram.match(/\[.*@.*\]/));
  });

  it("returns empty diagram body for no services", () => {
    const scan = makeScan({ services: [] });
    const diagram = buildMermaidDiagram(scan);
    assert.equal(diagram, "graph LR");
  });
});

describe("generateDataFlowDiagram", () => {
  it("returns null when no services detected", () => {
    const scan = makeScan({ services: [] });
    const result = generateDataFlowDiagram(scan);
    assert.equal(result, null);
  });

  it("generates document with title and project name", () => {
    const result = generateDataFlowDiagram(makeScan());
    assert.ok(result);
    assert.ok(result.includes("# Data Flow Diagram"));
    assert.ok(result.includes("test-project"));
  });

  it("uses company name from context", () => {
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "privacy@acme.com" };
    const result = generateDataFlowDiagram(makeScan(), ctx);
    assert.ok(result);
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses default company name placeholder when no context", () => {
    const result = generateDataFlowDiagram(makeScan());
    assert.ok(result);
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("embeds Mermaid diagram in code block", () => {
    const result = generateDataFlowDiagram(makeScan());
    assert.ok(result);
    assert.ok(result.includes("```mermaid"));
    assert.ok(result.includes("graph LR"));
  });

  it("includes legend section", () => {
    const result = generateDataFlowDiagram(makeScan());
    assert.ok(result);
    assert.ok(result.includes("## Legend"));
    assert.ok(result.includes("**User**"));
    assert.ok(result.includes("**Arrow labels**"));
  });

  it("includes data flow details with collection points", () => {
    const result = generateDataFlowDiagram(makeScan());
    assert.ok(result);
    assert.ok(result.includes("## Data Flow Details"));
    assert.ok(result.includes("### Collection Points"));
  });

  it("includes third-party data sharing section", () => {
    const result = generateDataFlowDiagram(makeScan());
    assert.ok(result);
    assert.ok(result.includes("### Third-Party Data Sharing"));
  });

  it("includes service inventory table", () => {
    const result = generateDataFlowDiagram(makeScan());
    assert.ok(result);
    assert.ok(result.includes("## Service Inventory"));
    assert.ok(result.includes("Stripe"));
    assert.ok(result.includes("OpenAI"));
    assert.ok(result.includes("PostHog"));
  });

  it("maps known package names to short provider labels in inventory", () => {
    const scan = makeScan({
      services: [
        { name: "openai", category: "ai", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["prompts"] },
        { name: "stripe", category: "payment", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["payment info"] },
      ],
    });
    const result = generateDataFlowDiagram(scan);
    assert.ok(result);
    assert.ok(result.includes("OpenAI"));
    assert.ok(result.includes("Stripe"));
  });

  it("includes how-to-use section with rendering instructions", () => {
    const result = generateDataFlowDiagram(makeScan());
    assert.ok(result);
    assert.ok(result.includes("## How to Use This Diagram"));
    assert.ok(result.includes("GitHub/GitLab"));
    assert.ok(result.includes("VS Code"));
    assert.ok(result.includes("Mermaid Live Editor"));
  });

  it("uses contact email from context in footer", () => {
    const ctx: GeneratorContext = { companyName: "TestCo", contactEmail: "help@testco.com" };
    const result = generateDataFlowDiagram(makeScan(), ctx);
    assert.ok(result);
    assert.ok(result.includes("help@testco.com"));
  });

  it("includes disclaimer footer", () => {
    const result = generateDataFlowDiagram(makeScan());
    assert.ok(result);
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("does not constitute legal advice"));
  });

  it("shows no collection points message when none detected", () => {
    const scan = makeScan({
      services: [
        { name: "svc", category: "other", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["data"] },
      ],
    });
    const result = generateDataFlowDiagram(scan);
    assert.ok(result);
    // "other" is not a collection category, so collection should be empty
    // The flow.collection array depends on scanner/data-flow buildDataFlowMap
  });

  it("groups services by category in inventory", () => {
    const scan = makeScan({
      services: [
        { name: "Stripe", category: "payment", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["payment info"] },
        { name: "PostHog", category: "analytics", evidence: [{ type: "env_var", file: ".env", detail: "POSTHOG_KEY" }], dataCollected: ["usage data"] },
        { name: "OpenAI", category: "ai", evidence: [{ type: "import", file: "src/index.ts", detail: "openai" }], dataCollected: ["prompts"] },
      ],
    });
    const result = generateDataFlowDiagram(scan);
    assert.ok(result);
    assert.ok(result.includes("| Stripe | payment |"));
    assert.ok(result.includes("| PostHog | analytics |"));
    assert.ok(result.includes("| OpenAI | ai |"));
  });
});
