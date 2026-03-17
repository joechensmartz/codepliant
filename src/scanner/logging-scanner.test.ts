import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanLogging, generateLoggingAssessment } from "./logging-scanner.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-logging-"));
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

describe("logging-scanner", () => {
  // ── scanLogging ───────────────────────────────────────────────────

  it("detects console.log usage", () => {
    const dir = createTempProject({
      "src/app.ts": `
        const user = getUser();
        console.log("User loaded:", user.id);
        console.warn("Deprecated function called");
        console.error("Something went wrong");
      `,
    });
    try {
      const result = scanLogging(dir);
      assert.ok(result.libraries.includes("console.log"));
      assert.strictEqual(result.totalLogCalls, 3);
      assert.ok(result.findings.length > 0);
    } finally {
      cleanup(dir);
    }
  });

  it("detects winston import and usage", () => {
    const dir = createTempProject({
      "src/logger.ts": `
        import winston from 'winston';
        const logger = winston.createLogger({ level: 'info' });
        export default logger;
      `,
      "src/service.ts": `
        import logger from './logger';
        logger.info("Service started");
        logger.error("Connection failed");
      `,
    });
    try {
      const result = scanLogging(dir);
      assert.ok(result.libraries.includes("winston"));
      assert.ok(result.totalLogCalls >= 2);
    } finally {
      cleanup(dir);
    }
  });

  it("detects pino import and usage", () => {
    const dir = createTempProject({
      "src/index.ts": `
        import pino from 'pino';
        const logger = pino();
        logger.info("Server starting on port 3000");
        logger.error("Unhandled exception");
      `,
    });
    try {
      const result = scanLogging(dir);
      assert.ok(result.libraries.includes("pino"));
      assert.ok(result.totalLogCalls >= 2);
    } finally {
      cleanup(dir);
    }
  });

  it("detects bunyan import and usage", () => {
    const dir = createTempProject({
      "src/app.ts": `
        const bunyan = require('bunyan');
        const log = bunyan.createLogger({ name: 'myapp' });
        log.info("Started");
        log.error("Failed");
      `,
    });
    try {
      const result = scanLogging(dir);
      assert.ok(result.libraries.includes("bunyan"));
      assert.ok(result.totalLogCalls >= 2);
    } finally {
      cleanup(dir);
    }
  });

  it("detects morgan HTTP logger", () => {
    const dir = createTempProject({
      "src/server.ts": `
        import morgan from 'morgan';
        import express from 'express';
        const app = express();
        app.use(morgan('combined'));
      `,
    });
    try {
      const result = scanLogging(dir);
      assert.ok(result.libraries.includes("morgan"));
      assert.ok(result.totalLogCalls >= 1);
    } finally {
      cleanup(dir);
    }
  });

  it("detects multiple logging libraries in the same project", () => {
    const dir = createTempProject({
      "src/legacy.ts": `
        console.log("Legacy code path");
      `,
      "src/server.ts": `
        import winston from 'winston';
        const logger = winston.createLogger({});
        logger.info("Server ready");
      `,
      "src/http.ts": `
        import morgan from 'morgan';
        app.use(morgan('dev'));
      `,
    });
    try {
      const result = scanLogging(dir);
      assert.ok(result.libraries.includes("console.log"));
      assert.ok(result.libraries.includes("winston"));
      assert.ok(result.libraries.includes("morgan"));
      assert.ok(result.libraries.length >= 3);
    } finally {
      cleanup(dir);
    }
  });

  it("flags PII risk when logging user.email", () => {
    const dir = createTempProject({
      "src/handler.ts": `
        console.log("User signed up:", user.email);
      `,
    });
    try {
      const result = scanLogging(dir);
      assert.ok(result.piiFindings.length > 0);
      assert.strictEqual(result.piiFindings[0].piiRisk, "email");
    } finally {
      cleanup(dir);
    }
  });

  it("flags PII risk when logging user.password", () => {
    const dir = createTempProject({
      "src/auth.ts": `
        console.log("Login attempt:", user.password);
      `,
    });
    try {
      const result = scanLogging(dir);
      assert.ok(result.piiFindings.length > 0);
      assert.strictEqual(result.piiFindings[0].piiRisk, "password");
    } finally {
      cleanup(dir);
    }
  });

  it("flags PII risk when logging req.body.ssn", () => {
    const dir = createTempProject({
      "src/api.ts": `
        console.log("Form data:", req.body.ssn);
      `,
    });
    try {
      const result = scanLogging(dir);
      assert.ok(result.piiFindings.length > 0);
      assert.strictEqual(result.piiFindings[0].piiRisk, "SSN");
    } finally {
      cleanup(dir);
    }
  });

  it("flags PII risk when logging JSON.stringify(user)", () => {
    const dir = createTempProject({
      "src/debug.ts": `
        console.log("Full user:", JSON.stringify(user));
      `,
    });
    try {
      const result = scanLogging(dir);
      assert.ok(result.piiFindings.length > 0);
      assert.strictEqual(result.piiFindings[0].piiRisk, "full user object");
    } finally {
      cleanup(dir);
    }
  });

  it("flags PII risk when logging authorization header", () => {
    const dir = createTempProject({
      "src/middleware.ts": `
        console.log("Auth:", req.headers['authorization']);
      `,
    });
    try {
      const result = scanLogging(dir);
      assert.ok(result.piiFindings.length > 0);
      assert.strictEqual(result.piiFindings[0].piiRisk, "auth token");
    } finally {
      cleanup(dir);
    }
  });

  it("does not flag PII for safe log messages", () => {
    const dir = createTempProject({
      "src/app.ts": `
        console.log("Server started on port 3000");
        console.log("Request received:", req.method, req.url);
        console.info("Processing complete");
      `,
    });
    try {
      const result = scanLogging(dir);
      assert.strictEqual(result.piiFindings.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty results for an empty project", () => {
    const dir = createTempProject({});
    try {
      const result = scanLogging(dir);
      assert.deepStrictEqual(result.libraries, []);
      assert.strictEqual(result.totalLogCalls, 0);
      assert.strictEqual(result.piiFindings.length, 0);
      assert.strictEqual(result.findings.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty results for a project with no logging", () => {
    const dir = createTempProject({
      "src/utils.ts": `
        export function add(a: number, b: number): number {
          return a + b;
        }
      `,
    });
    try {
      const result = scanLogging(dir);
      assert.deepStrictEqual(result.libraries, []);
      assert.strictEqual(result.totalLogCalls, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("limits findings to 100 entries", () => {
    // Create a file with many log calls
    const lines: string[] = [];
    for (let i = 0; i < 120; i++) {
      lines.push(`  console.log("message ${i}");`);
    }
    const dir = createTempProject({
      "src/verbose.ts": lines.join("\n"),
    });
    try {
      const result = scanLogging(dir);
      assert.strictEqual(result.findings.length, 100);
      assert.ok(result.totalLogCalls >= 120);
    } finally {
      cleanup(dir);
    }
  });

  it("includes file path and line number in findings", () => {
    const dir = createTempProject({
      "src/handler.ts": `// line 1
// line 2
console.log("hello");
`,
    });
    try {
      const result = scanLogging(dir);
      assert.ok(result.findings.length > 0);
      const f = result.findings[0];
      assert.ok(f.file.includes("handler.ts"));
      assert.strictEqual(f.line, 3);
      assert.ok(f.snippet.includes("console.log"));
    } finally {
      cleanup(dir);
    }
  });

  // ── generateLoggingAssessment ─────────────────────────────────────

  it("returns null when no libraries and no log calls", () => {
    const result = generateLoggingAssessment({
      libraries: [],
      totalLogCalls: 0,
      piiFindings: [],
      findings: [],
    });
    assert.strictEqual(result, null);
  });

  it("generates assessment with detected libraries", () => {
    const result = generateLoggingAssessment({
      libraries: ["winston", "console.log"],
      totalLogCalls: 15,
      piiFindings: [],
      findings: [],
    });
    assert.ok(result !== null);
    assert.ok(result!.includes("## Logging Practices Assessment"));
    assert.ok(result!.includes("winston"));
    assert.ok(result!.includes("console.log"));
    assert.ok(result!.includes("15"));
    assert.ok(result!.includes("No potential PII logging risks"));
  });

  it("generates assessment with PII findings table", () => {
    const result = generateLoggingAssessment({
      libraries: ["console.log"],
      totalLogCalls: 5,
      piiFindings: [
        {
          library: "console.log",
          file: "src/auth.ts",
          line: 10,
          piiRisk: "password",
          snippet: 'console.log("login:", user.password)',
        },
      ],
      findings: [],
    });
    assert.ok(result !== null);
    assert.ok(result!.includes("Potential PII Logging Risks"));
    assert.ok(result!.includes("password"));
    assert.ok(result!.includes("src/auth.ts"));
    assert.ok(result!.includes("Recommendations"));
    assert.ok(result!.includes("PII redaction"));
  });

  it("truncates PII findings table to 25 entries", () => {
    const piiFindings = Array.from({ length: 30 }, (_, i) => ({
      library: "console.log",
      file: `src/file${i}.ts`,
      line: 1,
      piiRisk: "email",
      snippet: `console.log(user.email)`,
    }));
    const result = generateLoggingAssessment({
      libraries: ["console.log"],
      totalLogCalls: 30,
      piiFindings,
      findings: [],
    });
    assert.ok(result !== null);
    assert.ok(result!.includes("and 5 more findings"));
  });
});
