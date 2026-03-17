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
    const sentryMatches = diagram.match(/Sentry/g);
    assert.ok(sentryMatches);
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
    assert.ok(diagram.includes("Clerk"));
    assert.ok(!diagram.match(/\[.*@.*\]/));
  });

  it("returns empty diagram body for no services", () => {
    const scan = makeScan({ services: [] });
    const diagram = buildMermaidDiagram(scan);
    assert.equal(diagram, "graph LR");
  });

  // ── New tests ──────────────────────────────────────────────────────

  it("truncates data labels to first 3 items", () => {
    const scan = makeScan({
      services: [
        { name: "stripe", category: "payment", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["alpha", "bravo", "charlie", "delta", "echo"] },
      ],
    });
    const diagram = buildMermaidDiagram(scan);
    assert.ok(diagram.includes("alpha, bravo, charlie"));
    assert.ok(!diagram.includes("delta"));
    assert.ok(!diagram.includes("echo"));
  });

  it("maps lowercase openai to OpenAI provider label", () => {
    const scan = makeScan({
      services: [
        { name: "openai", category: "ai", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["prompts"] },
      ],
    });
    const diagram = buildMermaidDiagram(scan);
    assert.ok(diagram.includes("OpenAI"));
  });

  it("maps @sendgrid/mail to SendGrid provider label", () => {
    const scan = makeScan({
      services: [
        { name: "@sendgrid/mail", category: "email", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["email addresses"] },
      ],
    });
    const diagram = buildMermaidDiagram(scan);
    assert.ok(diagram.includes("SendGrid"));
  });

  it("maps resend to Resend provider label", () => {
    const scan = makeScan({
      services: [
        { name: "resend", category: "email", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["email content"] },
      ],
    });
    const diagram = buildMermaidDiagram(scan);
    assert.ok(diagram.includes("Resend"));
  });

  it("maps @aws-sdk/client-s3 to AWS S3 provider label", () => {
    const scan = makeScan({
      services: [
        { name: "@aws-sdk/client-s3", category: "storage", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["files"] },
      ],
    });
    const diagram = buildMermaidDiagram(scan);
    assert.ok(diagram.includes("AWS S3"));
  });

  it("uses raw name when no PROVIDER_SHORT mapping exists", () => {
    const scan = makeScan({
      services: [
        { name: "my-custom-lib", category: "other", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["custom data"] },
      ],
    });
    const diagram = buildMermaidDiagram(scan);
    assert.ok(diagram.includes("my-custom-lib"));
  });

  it("does not add forwarding edge when only monitoring present", () => {
    const monOnly = makeScan({
      services: [
        { name: "@sentry/node", category: "monitoring", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["errors"] },
      ],
    });
    const diagram = buildMermaidDiagram(monOnly);
    assert.ok(!diagram.includes("|logs|"));
  });

  it("sanitizes IDs replacing all non-alphanumeric chars with underscores", () => {
    const scan = makeScan({
      services: [
        { name: "my-lib.v2@beta", category: "other", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["stuff"] },
      ],
    });
    const diagram = buildMermaidDiagram(scan);
    // The sanitized ID should not contain -, ., or @
    const lines = diagram.split("\n").filter((l) => l.includes("my"));
    for (const line of lines) {
      // Before the [ should be sanitized ID
      const idMatch = line.match(/^\s+(\S+)\[/);
      if (idMatch) {
        assert.ok(!idMatch[1].includes("-"));
        assert.ok(!idMatch[1].includes("."));
        assert.ok(!idMatch[1].includes("@"));
      }
    }
  });

  it("handles single service producing single edge line", () => {
    const scan = makeScan({
      services: [
        { name: "stripe", category: "payment", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["cards"] },
      ],
    });
    const diagram = buildMermaidDiagram(scan);
    const lines = diagram.split("\n");
    // First line is "graph LR", then one edge line
    assert.equal(lines.length, 2);
  });

  it("generates multiple edge lines for multiple distinct services", () => {
    const scan = makeScan({
      services: [
        { name: "stripe", category: "payment", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["cards"] },
        { name: "openai", category: "ai", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["prompts"] },
        { name: "posthog", category: "analytics", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["events"] },
      ],
    });
    const diagram = buildMermaidDiagram(scan);
    const lines = diagram.split("\n");
    // "graph LR" + 3 service edges
    assert.equal(lines.length, 4);
  });

  it("maps @anthropic-ai/sdk to Anthropic provider label", () => {
    const scan = makeScan({
      services: [
        { name: "@anthropic-ai/sdk", category: "ai", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["messages"] },
      ],
    });
    const diagram = buildMermaidDiagram(scan);
    assert.ok(diagram.includes("Anthropic"));
  });

  it("maps cloudinary to Cloudinary provider label", () => {
    const scan = makeScan({
      services: [
        { name: "cloudinary", category: "storage", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["images"] },
      ],
    });
    const diagram = buildMermaidDiagram(scan);
    assert.ok(diagram.includes("Cloudinary"));
  });

  it("maps dd-trace to Datadog provider label", () => {
    const scan = makeScan({
      services: [
        { name: "dd-trace", category: "monitoring", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["traces"] },
      ],
    });
    const diagram = buildMermaidDiagram(scan);
    assert.ok(diagram.includes("Datadog"));
  });

  it("maps mongoose to MongoDB provider label", () => {
    const scan = makeScan({
      services: [
        { name: "mongoose", category: "database", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["documents"] },
      ],
    });
    const diagram = buildMermaidDiagram(scan);
    assert.ok(diagram.includes("MongoDB"));
  });

  it("each edge line uses arrow notation with pipe-delimited label", () => {
    const scan = makeScan({
      services: [
        { name: "stripe", category: "payment", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["cards"] },
      ],
    });
    const diagram = buildMermaidDiagram(scan);
    const edgeLine = diagram.split("\n")[1];
    assert.ok(edgeLine.includes("-->|"));
    assert.ok(edgeLine.includes("|"));
  });

  it("edge from User node has User as the source", () => {
    const scan = makeScan({
      services: [
        { name: "stripe", category: "payment", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["cards"] },
      ],
    });
    const diagram = buildMermaidDiagram(scan);
    const edgeLine = diagram.split("\n")[1].trim();
    assert.ok(edgeLine.startsWith("User[User]"));
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

  // ── New tests ──────────────────────────────────────────────────────

  it("includes date in YYYY-MM-DD format", () => {
    const result = generateDataFlowDiagram(makeScan())!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("uses default contact email placeholder when no context", () => {
    const result = generateDataFlowDiagram(makeScan())!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("includes service nodes explanation in legend", () => {
    const result = generateDataFlowDiagram(makeScan())!;
    assert.ok(result.includes("**Service nodes**"));
  });

  it("includes Visual Data Flow heading", () => {
    const result = generateDataFlowDiagram(makeScan())!;
    assert.ok(result.includes("## Visual Data Flow"));
  });

  it("includes CI/CD export instruction with mermaid-cli", () => {
    const result = generateDataFlowDiagram(makeScan())!;
    assert.ok(result.includes("@mermaid-js/mermaid-cli"));
  });

  it("includes service inventory table headers", () => {
    const result = generateDataFlowDiagram(makeScan())!;
    assert.ok(result.includes("| Service | Category | Data Processed |"));
  });

  it("shows data collected in inventory rows", () => {
    const scan = makeScan({
      services: [
        { name: "stripe", category: "payment", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["cards", "billing"] },
      ],
    });
    const result = generateDataFlowDiagram(scan)!;
    assert.ok(result.includes("cards, billing"));
  });

  it("handles project name with special characters", () => {
    const scan = makeScan({ projectName: "my-app_v2.0" });
    const result = generateDataFlowDiagram(scan)!;
    assert.ok(result.includes("my-app_v2.0"));
  });

  it("returns a string (not null) for single service", () => {
    const scan = makeScan({
      services: [
        { name: "posthog", category: "analytics", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["events"] },
      ],
    });
    const result = generateDataFlowDiagram(scan);
    assert.equal(typeof result, "string");
  });

  it("includes horizontal rule separator", () => {
    const result = generateDataFlowDiagram(makeScan())!;
    assert.ok(result.includes("---"));
  });

  it("includes Mermaid link in intro text", () => {
    const result = generateDataFlowDiagram(makeScan())!;
    assert.ok(result.includes("https://mermaid.js.org/"));
  });

  it("inventory shows multiple data items comma-separated", () => {
    const scan = makeScan({
      services: [
        { name: "openai", category: "ai", evidence: [{ type: "dependency", file: "package.json", detail: "pkg" }], dataCollected: ["prompts", "completions", "tokens"] },
      ],
    });
    const result = generateDataFlowDiagram(scan)!;
    assert.ok(result.includes("prompts, completions, tokens"));
  });

  it("includes Last updated label", () => {
    const result = generateDataFlowDiagram(makeScan())!;
    assert.ok(result.includes("**Last updated:**"));
  });

  it("includes Company label", () => {
    const result = generateDataFlowDiagram(makeScan())!;
    assert.ok(result.includes("**Company:**"));
  });

  it("includes Project label", () => {
    const result = generateDataFlowDiagram(makeScan())!;
    assert.ok(result.includes("**Project:**"));
  });
});
