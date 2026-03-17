import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanCors, deriveCorsComplianceNeeds } from "./cors-scanner.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-cors-"));
  for (const [filename, content] of Object.entries(files)) {
    const filePath = path.join(dir, filename);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
  }
  return dir;
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("cors-scanner", () => {
  it("detects cors middleware usage", () => {
    const dir = createTempProject({
      "server.ts": `
        import cors from 'cors';
        import express from 'express';
        const app = express();
        app.use(cors({ origin: 'https://example.com' }));
      `,
    });
    try {
      const result = scanCors(dir);
      assert.ok(result.detected, "Should detect CORS");
      assert.ok(result.findings.some((f) => f.type === "cors-middleware"));
      assert.strictEqual(result.hasWildcardOrigin, false);
    } finally {
      cleanup(dir);
    }
  });

  it("detects Access-Control-Allow-Origin header", () => {
    const dir = createTempProject({
      "api/handler.ts": `
        export default function handler(req: any, res: any) {
          res.setHeader('Access-Control-Allow-Origin', 'https://app.example.com');
          res.json({ ok: true });
        }
      `,
    });
    try {
      const result = scanCors(dir);
      assert.ok(result.detected, "Should detect CORS header");
      assert.ok(result.findings.some((f) => f.type === "cors-header"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects wildcard origin and flags it", () => {
    const dir = createTempProject({
      "server.ts": `
        import express from 'express';
        const app = express();
        app.use((req, res, next) => {
          res.setHeader('Access-Control-Allow-Origin', '*');
          next();
        });
      `,
    });
    try {
      const result = scanCors(dir);
      assert.ok(result.detected, "Should detect CORS");
      assert.ok(result.hasWildcardOrigin, "Should detect wildcard origin");
      assert.ok(result.findings.some((f) => f.type === "wildcard-origin"));
    } finally {
      cleanup(dir);
    }
  });

  it("deriveCorsComplianceNeeds flags wildcard origin as required", () => {
    const dir = createTempProject({
      "server.ts": `
        res.setHeader('Access-Control-Allow-Origin', '*');
      `,
    });
    try {
      const result = scanCors(dir);
      const needs = deriveCorsComplianceNeeds(result);
      assert.ok(needs.length >= 1, "Should produce compliance needs for wildcard");
      assert.ok(needs.some((n) => n.priority === "required"));
    } finally {
      cleanup(dir);
    }
  });

  it("returns no findings when no CORS patterns found", () => {
    const dir = createTempProject({
      "index.ts": `
        import express from 'express';
        const app = express();
        app.get('/', (req, res) => res.send('Hello'));
        app.listen(3000);
      `,
    });
    try {
      const result = scanCors(dir);
      assert.strictEqual(result.detected, false);
      assert.strictEqual(result.findings.length, 0);
      assert.strictEqual(result.hasWildcardOrigin, false);
    } finally {
      cleanup(dir);
    }
  });

  it("deriveCorsComplianceNeeds returns empty for safe CORS config", () => {
    const safeResult = {
      detected: true,
      findings: [{ type: "cors-middleware" as const, file: "server.ts", line: 3, detail: "app.use(cors(...))" }],
      hasWildcardOrigin: false,
    };
    const needs = deriveCorsComplianceNeeds(safeResult);
    assert.strictEqual(needs.length, 0, "No compliance needs for safe CORS config");
  });

  it("detects NestJS enableCors pattern", () => {
    const dir = createTempProject({
      "main.ts": `
        import { NestFactory } from '@nestjs/core';
        async function bootstrap() {
          const app = await NestFactory.create(AppModule);
          app.enableCors({ origin: 'https://frontend.example.com' });
          await app.listen(3000);
        }
      `,
    });
    try {
      const result = scanCors(dir);
      assert.ok(result.detected, "Should detect NestJS enableCors");
      assert.ok(result.findings.some((f) => f.type === "cors-middleware"));
    } finally {
      cleanup(dir);
    }
  });
});
