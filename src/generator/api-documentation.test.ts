// @ts-nocheck
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateApiPrivacyDocumentation } from "./api-documentation.js";
import type { GeneratorContext } from "./index.js";

function makeService(
  name: string,
  category: DetectedService["category"],
  dataCollected: string[] = ["test data"],
  isDataProcessor: boolean = true,
): DetectedService {
  return {
    name,
    category,
    evidence: [{ type: "dependency", file: "package.json", detail: `${name} detected` }],
    dataCollected,
    isDataProcessor,
  };
}

function makeScan(overrides: Partial<ScanResult> = {}): ScanResult {
  return {
    projectName: "test-project",
    projectPath: "/tmp/nonexistent-test-path",
    scannedAt: "2026-01-01",
    services: [],
    dataCategories: [],
    complianceNeeds: [],
    ...overrides,
  };
}

/** Create a temp directory with API route files for testing endpoint detection. */
function createTempProject(files: Record<string, string>): string {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-api-test-"));
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(tmpDir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, "utf-8");
  }
  return tmpDir;
}

function cleanupTempDir(dir: string): void {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("generateApiPrivacyDocumentation", () => {
  // ── Null guards ─────────────────────────────────────────────────────

  it("returns null when no API category and no endpoints detected", () => {
    const scan = makeScan({ services: [], dataCategories: [] });
    assert.strictEqual(generateApiPrivacyDocumentation(scan), null);
  });

  it("returns null for non-API project with only database services", () => {
    const scan = makeScan({
      services: [makeService("prisma", "database")],
      dataCategories: [],
    });
    assert.strictEqual(generateApiPrivacyDocumentation(scan), null);
  });

  // ── Generation with API Data Collection category ──────────────────

  it("generates when API Data Collection category is present", () => {
    const scan = makeScan({
      dataCategories: [{
        category: "API Data Collection" as any,
        description: "Data collected through API endpoints",
        fields: ["email", "name"],
        sources: ["api"],
      }],
    });
    const result = generateApiPrivacyDocumentation(scan);
    assert.ok(result !== null);
    assert.ok(result!.length > 0);
  });

  it("includes title", () => {
    const scan = makeScan({
      dataCategories: [{
        category: "API Data Collection" as any,
        description: "Data collected through API endpoints",
        fields: ["email"],
        sources: ["api"],
      }],
    });
    const result = generateApiPrivacyDocumentation(scan)!;
    assert.ok(result.includes("# API Privacy Documentation"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({
      dataCategories: [{
        category: "API Data Collection" as any,
        description: "Data collected through API endpoints",
        fields: [],
        sources: [],
      }],
    });
    const result = generateApiPrivacyDocumentation(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes project name", () => {
    const scan = makeScan({
      projectName: "my-api-project",
      dataCategories: [{
        category: "API Data Collection" as any,
        description: "Test",
        fields: [],
        sources: [],
      }],
    });
    const result = generateApiPrivacyDocumentation(scan)!;
    assert.ok(result.includes("my-api-project"));
  });

  // ── Context values ──────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({
      dataCategories: [{
        category: "API Data Collection" as any,
        description: "Test",
        fields: [],
        sources: [],
      }],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "info@acme.com" };
    const result = generateApiPrivacyDocumentation(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({
      dataCategories: [{
        category: "API Data Collection" as any,
        description: "Test",
        fields: [],
        sources: [],
      }],
    });
    const result = generateApiPrivacyDocumentation(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({
      dataCategories: [{
        category: "API Data Collection" as any,
        description: "Test",
        fields: [],
        sources: [],
      }],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "api@acme.com" };
    const result = generateApiPrivacyDocumentation(scan, ctx)!;
    assert.ok(result.includes("api@acme.com"));
  });

  it("uses placeholder email when no context", () => {
    const scan = makeScan({
      dataCategories: [{
        category: "API Data Collection" as any,
        description: "Test",
        fields: [],
        sources: [],
      }],
    });
    const result = generateApiPrivacyDocumentation(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  // ── Overview section ──────────────────────────────────────────────

  it("includes overview section", () => {
    const scan = makeScan({
      dataCategories: [{
        category: "API Data Collection" as any,
        description: "Data collected through API endpoints",
        fields: [],
        sources: [],
      }],
    });
    const result = generateApiPrivacyDocumentation(scan)!;
    assert.ok(result.includes("## Overview"));
  });

  it("includes API category description in overview", () => {
    const scan = makeScan({
      dataCategories: [{
        category: "API Data Collection" as any,
        description: "Sensitive data collected via REST API",
        fields: [],
        sources: [],
      }],
    });
    const result = generateApiPrivacyDocumentation(scan)!;
    assert.ok(result.includes("Sensitive data collected via REST API"));
  });

  it("shows endpoint count metrics", () => {
    const scan = makeScan({
      dataCategories: [{
        category: "API Data Collection" as any,
        description: "Test",
        fields: [],
        sources: [],
      }],
    });
    const result = generateApiPrivacyDocumentation(scan)!;
    assert.ok(result.includes("Total API endpoints detected"));
    assert.ok(result.includes("Endpoints accepting user data"));
  });

  // ── Privacy Policy Mapping ────────────────────────────────────────

  it("includes privacy policy mapping section", () => {
    const scan = makeScan({
      dataCategories: [{
        category: "API Data Collection" as any,
        description: "Test",
        fields: [],
        sources: [],
      }],
    });
    const result = generateApiPrivacyDocumentation(scan)!;
    assert.ok(result.includes("## Privacy Policy Mapping"));
  });

  it("includes GDPR legal basis column", () => {
    const scan = makeScan({
      dataCategories: [{
        category: "API Data Collection" as any,
        description: "Test",
        fields: [],
        sources: [],
      }],
    });
    const result = generateApiPrivacyDocumentation(scan)!;
    assert.ok(result.includes("Legal Basis (GDPR)"));
  });

  // ── Third-party service data flow ─────────────────────────────────

  it("includes third-party data flow section when services present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
      dataCategories: [{
        category: "API Data Collection" as any,
        description: "Test",
        fields: [],
        sources: [],
      }],
    });
    const result = generateApiPrivacyDocumentation(scan)!;
    assert.ok(result.includes("## API Data Flow to Third-Party Services"));
  });

  it("lists data processor services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment data"], true)],
      dataCategories: [{
        category: "API Data Collection" as any,
        description: "Test",
        fields: [],
        sources: [],
      }],
    });
    const result = generateApiPrivacyDocumentation(scan)!;
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("payment data"));
  });

  it("excludes non-data-processor services", () => {
    const scan = makeScan({
      services: [makeService("internal-lib", "database", ["logs"], false)],
      dataCategories: [{
        category: "API Data Collection" as any,
        description: "Test",
        fields: [],
        sources: [],
      }],
    });
    const result = generateApiPrivacyDocumentation(scan)!;
    assert.ok(!result.includes("| internal-lib |"));
  });

  // ── Recommendations ───────────────────────────────────────────────

  it("includes recommendations section", () => {
    const scan = makeScan({
      dataCategories: [{
        category: "API Data Collection" as any,
        description: "Test",
        fields: [],
        sources: [],
      }],
    });
    const result = generateApiPrivacyDocumentation(scan)!;
    assert.ok(result.includes("## Recommendations"));
  });

  it("includes input validation recommendation", () => {
    const scan = makeScan({
      dataCategories: [{
        category: "API Data Collection" as any,
        description: "Test",
        fields: [],
        sources: [],
      }],
    });
    const result = generateApiPrivacyDocumentation(scan)!;
    assert.ok(result.includes("input validation"));
  });

  it("includes rate limiting recommendation", () => {
    const scan = makeScan({
      dataCategories: [{
        category: "API Data Collection" as any,
        description: "Test",
        fields: [],
        sources: [],
      }],
    });
    const result = generateApiPrivacyDocumentation(scan)!;
    assert.ok(result.includes("rate limiting"));
  });

  it("includes encryption recommendation", () => {
    const scan = makeScan({
      dataCategories: [{
        category: "API Data Collection" as any,
        description: "Test",
        fields: [],
        sources: [],
      }],
    });
    const result = generateApiPrivacyDocumentation(scan)!;
    assert.ok(result.includes("field-level encryption"));
  });

  // ── Disclaimer ────────────────────────────────────────────────────

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({
      dataCategories: [{
        category: "API Data Collection" as any,
        description: "Test",
        fields: [],
        sources: [],
      }],
    });
    const result = generateApiPrivacyDocumentation(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("reviewed by your engineering and legal teams"));
  });

  // ── Endpoint detection with real files ────────────────────────────

  it("detects Next.js App Router endpoints", () => {
    const tmpDir = createTempProject({
      "app/api/users/route.ts": `
export async function POST(req: Request) {
  const { email, name } = await req.json();
  return Response.json({ ok: true });
}
export async function GET() {
  return Response.json([]);
}
`,
    });
    try {
      const scan = makeScan({ projectPath: tmpDir });
      const result = generateApiPrivacyDocumentation(scan);
      assert.ok(result !== null);
      assert.ok(result!.includes("POST"));
      assert.ok(result!.includes("api/users"));
    } finally {
      cleanupTempDir(tmpDir);
    }
  });

  it("detects Express-style endpoints", () => {
    const tmpDir = createTempProject({
      "src/routes.ts": `
import express from 'express';
const app = express();
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  res.json({ token: 'abc' });
});
app.get('/api/profile', (req, res) => {
  res.json({ name: 'test' });
});
`,
    });
    try {
      const scan = makeScan({ projectPath: tmpDir });
      const result = generateApiPrivacyDocumentation(scan);
      assert.ok(result !== null);
      assert.ok(result!.includes("/api/login"));
      assert.ok(result!.includes("POST"));
      assert.ok(result!.includes("/api/profile"));
    } finally {
      cleanupTempDir(tmpDir);
    }
  });

  it("extracts data fields from request body destructuring", () => {
    const tmpDir = createTempProject({
      "src/server.ts": `
import express from 'express';
const app = express();
app.post('/api/register', (req, res) => {
  const { email, name, password } = req.body;
  res.json({ ok: true });
});
`,
    });
    try {
      const scan = makeScan({ projectPath: tmpDir });
      const result = generateApiPrivacyDocumentation(scan);
      assert.ok(result !== null);
      assert.ok(result!.includes("email"));
      assert.ok(result!.includes("name"));
      assert.ok(result!.includes("password"));
    } finally {
      cleanupTempDir(tmpDir);
    }
  });

  it("maps email field to Contact privacy category", () => {
    const tmpDir = createTempProject({
      "src/server.ts": `
import express from 'express';
const app = express();
app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;
  res.json({ ok: true });
});
`,
    });
    try {
      const scan = makeScan({ projectPath: tmpDir });
      const result = generateApiPrivacyDocumentation(scan);
      assert.ok(result !== null);
      assert.ok(result!.includes("Contact"));
    } finally {
      cleanupTempDir(tmpDir);
    }
  });

  it("maps password field to Authentication privacy category", () => {
    const tmpDir = createTempProject({
      "src/server.ts": `
import express from 'express';
const app = express();
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  res.json({ ok: true });
});
`,
    });
    try {
      const scan = makeScan({ projectPath: tmpDir });
      const result = generateApiPrivacyDocumentation(scan);
      assert.ok(result !== null);
      assert.ok(result!.includes("Authentication"));
    } finally {
      cleanupTempDir(tmpDir);
    }
  });

  it("includes detailed endpoint documentation section", () => {
    const tmpDir = createTempProject({
      "src/server.ts": `
import express from 'express';
const app = express();
app.post('/api/users', (req, res) => {
  const { email } = req.body;
  res.json({ ok: true });
});
`,
    });
    try {
      const scan = makeScan({ projectPath: tmpDir });
      const result = generateApiPrivacyDocumentation(scan);
      assert.ok(result !== null);
      assert.ok(result!.includes("## Detailed Endpoint Documentation"));
    } finally {
      cleanupTempDir(tmpDir);
    }
  });

  it("includes endpoint summary table", () => {
    const tmpDir = createTempProject({
      "src/server.ts": `
import express from 'express';
const app = express();
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});
`,
    });
    try {
      const scan = makeScan({ projectPath: tmpDir });
      const result = generateApiPrivacyDocumentation(scan);
      assert.ok(result !== null);
      assert.ok(result!.includes("## Endpoint Summary"));
    } finally {
      cleanupTempDir(tmpDir);
    }
  });

  it("handles project path that does not exist", () => {
    const scan = makeScan({
      projectPath: "/tmp/does-not-exist-codepliant-test",
      dataCategories: [{
        category: "API Data Collection" as any,
        description: "Test",
        fields: [],
        sources: [],
      }],
    });
    // Should still generate (with 0 endpoints) since API category exists
    const result = generateApiPrivacyDocumentation(scan);
    assert.ok(result !== null);
    assert.ok(result!.includes("Total API endpoints detected: **0**"));
  });
});
