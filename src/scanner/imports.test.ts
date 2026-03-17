import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanImports } from "./imports.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-test-"));
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(dir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
  }
  return dir;
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("scanImports", () => {
  it("detects ES import statements", () => {
    const dir = createTempProject({
      "src/ai.ts": `import OpenAI from "openai";\nconst client = new OpenAI();`,
    });
    try {
      const result = scanImports(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].name, "openai");
      assert.strictEqual(result[0].category, "ai");
    } finally {
      cleanup(dir);
    }
  });

  it("detects require statements", () => {
    const dir = createTempProject({
      "src/payment.js": `const Stripe = require("stripe");\nconst stripe = new Stripe(key);`,
    });
    try {
      const result = scanImports(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].name, "stripe");
    } finally {
      cleanup(dir);
    }
  });

  it("detects imports across multiple files", () => {
    const dir = createTempProject({
      "src/ai.ts": `import OpenAI from "openai";`,
      "src/pay.ts": `import Stripe from "stripe";`,
      "src/auth.ts": `import { createClient } from "@supabase/supabase-js";`,
    });
    try {
      const result = scanImports(dir);
      assert.ok(result.length >= 3);
    } finally {
      cleanup(dir);
    }
  });

  it("ignores node_modules", () => {
    const dir = createTempProject({
      "node_modules/openai/index.js": `export default class OpenAI {}`,
      "src/app.ts": `console.log("hello");`,
    });
    try {
      const result = scanImports(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("scans .tsx files", () => {
    const dir = createTempProject({
      "src/components/Chat.tsx": `import { useChat } from "openai";\nexport function Chat() { return <div />; }`,
    });
    try {
      const result = scanImports(dir);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].name, "openai");
    } finally {
      cleanup(dir);
    }
  });

  it("collects evidence with correct file paths", () => {
    const dir = createTempProject({
      "src/deep/nested/file.ts": `import Anthropic from "@anthropic-ai/sdk";`,
    });
    try {
      const result = scanImports(dir);
      assert.strictEqual(result.length, 1);
      assert.ok(
        result[0].evidence[0].file.includes("src/deep/nested/file.ts")
      );
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty for project with no imports", () => {
    const dir = createTempProject({
      "src/app.ts": `console.log("hello world");`,
    });
    try {
      const result = scanImports(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });
});
