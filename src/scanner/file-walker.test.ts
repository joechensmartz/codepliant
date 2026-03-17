import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {
  walkDirectory,
  SOURCE_EXTENSIONS,
  TRACKING_EXTENSIONS,
  ALL_EXTENSIONS,
} from "./file-walker.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-walker-"));
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

describe("file-walker", () => {
  it("returns empty array for empty directory", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-walker-empty-"));
    try {
      const files = walkDirectory(dir, { extensions: SOURCE_EXTENSIONS });
      assert.strictEqual(files.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("collects .ts files when extensions include .ts", () => {
    const dir = createTempProject({
      "src/index.ts": "export const x = 1;",
      "src/utils.ts": "export function foo() {}",
    });
    try {
      const files = walkDirectory(dir, { extensions: new Set([".ts"]) });
      assert.strictEqual(files.length, 2);
      const relativePaths = files.map((f) => f.relativePath).sort();
      assert.ok(relativePaths.includes(path.join("src", "index.ts")));
      assert.ok(relativePaths.includes(path.join("src", "utils.ts")));
    } finally {
      cleanup(dir);
    }
  });

  it("returns correct fullPath, relativePath, and extension", () => {
    const dir = createTempProject({
      "lib/helper.js": "module.exports = {};",
    });
    try {
      const files = walkDirectory(dir, { extensions: new Set([".js"]) });
      assert.strictEqual(files.length, 1);
      assert.strictEqual(files[0].extension, ".js");
      assert.strictEqual(files[0].relativePath, path.join("lib", "helper.js"));
      assert.ok(files[0].fullPath.endsWith(path.join("lib", "helper.js")));
    } finally {
      cleanup(dir);
    }
  });

  it("filters files by extension", () => {
    const dir = createTempProject({
      "index.ts": "export {};",
      "style.css": "body {}",
      "readme.md": "# Hello",
    });
    try {
      const files = walkDirectory(dir, { extensions: new Set([".ts"]) });
      assert.strictEqual(files.length, 1);
      assert.strictEqual(files[0].extension, ".ts");
    } finally {
      cleanup(dir);
    }
  });

  it("ignores node_modules directory", () => {
    const dir = createTempProject({
      "src/index.ts": "import x from 'lib';",
      "node_modules/lib/index.js": "module.exports = {};",
    });
    try {
      const files = walkDirectory(dir, { extensions: new Set([".ts", ".js"]) });
      assert.strictEqual(files.length, 1);
      assert.ok(files[0].relativePath.includes("index.ts"));
    } finally {
      cleanup(dir);
    }
  });

  it("ignores .git directory", () => {
    const dir = createTempProject({
      "src/app.ts": "console.log('app');",
      ".git/config": "[core]",
    });
    try {
      const files = walkDirectory(dir, { extensions: new Set([".ts"]) });
      assert.strictEqual(files.length, 1);
    } finally {
      cleanup(dir);
    }
  });

  it("ignores dist directory", () => {
    const dir = createTempProject({
      "src/app.ts": "export {};",
      "dist/app.js": "exports = {};",
    });
    try {
      const files = walkDirectory(dir, { extensions: new Set([".ts", ".js"]) });
      assert.strictEqual(files.length, 1);
      assert.ok(files[0].relativePath.includes("app.ts"));
    } finally {
      cleanup(dir);
    }
  });

  it("ignores build directory", () => {
    const dir = createTempProject({
      "src/index.ts": "export {};",
      "build/index.js": "exports = {};",
    });
    try {
      const files = walkDirectory(dir, { extensions: new Set([".ts", ".js"]) });
      assert.strictEqual(files.length, 1);
    } finally {
      cleanup(dir);
    }
  });

  it("ignores coverage directory", () => {
    const dir = createTempProject({
      "src/index.ts": "export {};",
      "coverage/lcov-report/index.html": "<html></html>",
    });
    try {
      const files = walkDirectory(dir, { extensions: new Set([".ts", ".html"]) });
      assert.strictEqual(files.length, 1);
    } finally {
      cleanup(dir);
    }
  });

  it("ignores __pycache__ directory", () => {
    const dir = createTempProject({
      "app.py": "print('hello')",
      "__pycache__/app.py": "cached",
    });
    try {
      const files = walkDirectory(dir, { extensions: new Set([".py"]) });
      assert.strictEqual(files.length, 1);
      assert.ok(files[0].relativePath === "app.py");
    } finally {
      cleanup(dir);
    }
  });

  it("ignores hidden directories (dot-prefixed)", () => {
    const dir = createTempProject({
      "src/index.ts": "export {};",
      ".hidden/secret.ts": "export {};",
    });
    try {
      const files = walkDirectory(dir, { extensions: new Set([".ts"]) });
      assert.strictEqual(files.length, 1);
    } finally {
      cleanup(dir);
    }
  });

  it("skips binary file extensions", () => {
    const dir = createTempProject({
      "src/index.ts": "export {};",
      "assets/logo.png": "binary",
      "fonts/font.woff2": "binary",
      "data/app.db": "binary",
    });
    try {
      const files = walkDirectory(dir, {
        extensions: new Set([".ts", ".png", ".woff2", ".db"]),
      });
      assert.strictEqual(files.length, 1);
      assert.strictEqual(files[0].extension, ".ts");
    } finally {
      cleanup(dir);
    }
  });

  it("skips .lock files", () => {
    const dir = createTempProject({
      "src/index.ts": "export {};",
      "package-lock.json": "{}",
      "yarn.lock": "# yarn lock",
    });
    try {
      const files = walkDirectory(dir, {
        extensions: new Set([".ts", ".lock"]),
      });
      assert.strictEqual(files.length, 1);
    } finally {
      cleanup(dir);
    }
  });

  it("skips test files when skipTests is true", () => {
    const dir = createTempProject({
      "src/index.ts": "export {};",
      "src/index.test.ts": "import test from 'test';",
      "src/utils.spec.ts": "describe('utils', () => {});",
      "src/__tests__/helper.ts": "export {};",
    });
    try {
      const files = walkDirectory(dir, {
        extensions: new Set([".ts"]),
        skipTests: true,
      });
      assert.strictEqual(files.length, 1);
      assert.ok(files[0].relativePath.endsWith("index.ts"));
    } finally {
      cleanup(dir);
    }
  });

  it("includes test files when skipTests is false or not set", () => {
    const dir = createTempProject({
      "src/index.ts": "export {};",
      "src/index.test.ts": "import test from 'test';",
    });
    try {
      const files = walkDirectory(dir, { extensions: new Set([".ts"]) });
      assert.strictEqual(files.length, 2);
    } finally {
      cleanup(dir);
    }
  });

  it("recurses into subdirectories", () => {
    const dir = createTempProject({
      "src/a/b/c/deep.ts": "export {};",
    });
    try {
      const files = walkDirectory(dir, { extensions: new Set([".ts"]) });
      assert.strictEqual(files.length, 1);
      assert.ok(files[0].relativePath.includes("deep.ts"));
    } finally {
      cleanup(dir);
    }
  });

  it("handles circular symlinks gracefully", () => {
    const dir = createTempProject({
      "src/index.ts": "export {};",
    });
    try {
      // Create a symlink that points back to parent
      fs.symlinkSync(dir, path.join(dir, "src", "loop"), "dir");
      const files = walkDirectory(dir, { extensions: new Set([".ts"]) });
      // Should not hang or crash — just collect files once
      assert.ok(files.length >= 1);
    } finally {
      cleanup(dir);
    }
  });

  it("handles broken symlinks gracefully", () => {
    const dir = createTempProject({
      "src/index.ts": "export {};",
    });
    try {
      fs.symlinkSync("/nonexistent/path", path.join(dir, "src", "broken"), "dir");
      const files = walkDirectory(dir, { extensions: new Set([".ts"]) });
      assert.strictEqual(files.length, 1);
    } finally {
      cleanup(dir);
    }
  });

  it("SOURCE_EXTENSIONS contains expected extensions", () => {
    assert.ok(SOURCE_EXTENSIONS.has(".ts"));
    assert.ok(SOURCE_EXTENSIONS.has(".tsx"));
    assert.ok(SOURCE_EXTENSIONS.has(".js"));
    assert.ok(SOURCE_EXTENSIONS.has(".jsx"));
    assert.ok(SOURCE_EXTENSIONS.has(".py"));
    assert.ok(SOURCE_EXTENSIONS.has(".go"));
    assert.ok(SOURCE_EXTENSIONS.has(".rb"));
    assert.ok(SOURCE_EXTENSIONS.has(".mjs"));
    assert.ok(SOURCE_EXTENSIONS.has(".cjs"));
  });

  it("TRACKING_EXTENSIONS contains expected extensions", () => {
    assert.ok(TRACKING_EXTENSIONS.has(".html"));
    assert.ok(TRACKING_EXTENSIONS.has(".tsx"));
    assert.ok(TRACKING_EXTENSIONS.has(".jsx"));
    assert.ok(TRACKING_EXTENSIONS.has(".vue"));
    assert.ok(TRACKING_EXTENSIONS.has(".svelte"));
  });

  it("ALL_EXTENSIONS is the union of SOURCE and TRACKING", () => {
    for (const ext of SOURCE_EXTENSIONS) {
      assert.ok(ALL_EXTENSIONS.has(ext), `ALL_EXTENSIONS should contain ${ext}`);
    }
    for (const ext of TRACKING_EXTENSIONS) {
      assert.ok(ALL_EXTENSIONS.has(ext), `ALL_EXTENSIONS should contain ${ext}`);
    }
  });

  it("ignores venv and .venv directories", () => {
    const dir = createTempProject({
      "app.py": "print('hello')",
      "venv/lib/site.py": "pass",
      ".venv/lib/site.py": "pass",
    });
    try {
      const files = walkDirectory(dir, { extensions: new Set([".py"]) });
      assert.strictEqual(files.length, 1);
      assert.ok(files[0].relativePath === "app.py");
    } finally {
      cleanup(dir);
    }
  });

  it("ignores vendor directory", () => {
    const dir = createTempProject({
      "main.go": "package main",
      "vendor/lib/dep.go": "package lib",
    });
    try {
      const files = walkDirectory(dir, { extensions: new Set([".go"]) });
      assert.strictEqual(files.length, 1);
    } finally {
      cleanup(dir);
    }
  });

  it("handles unreadable directories gracefully", () => {
    const dir = createTempProject({
      "src/index.ts": "export {};",
    });
    try {
      // walkDirectory on a nonexistent path should just return empty
      const files = walkDirectory(path.join(dir, "nonexistent"), { extensions: new Set([".ts"]) });
      assert.strictEqual(files.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("collects multiple extension types at once", () => {
    const dir = createTempProject({
      "app.ts": "export {};",
      "page.html": "<html></html>",
      "component.vue": "<template></template>",
    });
    try {
      const files = walkDirectory(dir, { extensions: new Set([".ts", ".html", ".vue"]) });
      assert.strictEqual(files.length, 3);
      const exts = files.map((f) => f.extension).sort();
      assert.deepStrictEqual(exts, [".html", ".ts", ".vue"]);
    } finally {
      cleanup(dir);
    }
  });
});
