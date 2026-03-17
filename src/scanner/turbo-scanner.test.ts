import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanTurboRepo } from "./turbo-scanner.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-turbo-"));
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

describe("turbo-scanner", () => {
  it("returns detected=false when no turbo.json exists", () => {
    const dir = createTempProject({
      "package.json": '{ "name": "my-app" }',
    });
    try {
      const result = scanTurboRepo(dir);
      assert.strictEqual(result.detected, false);
      assert.deepStrictEqual(result.pipelines, []);
      assert.deepStrictEqual(result.packages, []);
    } finally {
      cleanup(dir);
    }
  });

  it("returns detected=false for an empty directory", () => {
    const dir = createTempProject({});
    try {
      const result = scanTurboRepo(dir);
      assert.strictEqual(result.detected, false);
    } finally {
      cleanup(dir);
    }
  });

  it("detects turbo.json v2 tasks", () => {
    const dir = createTempProject({
      "turbo.json": JSON.stringify({
        $schema: "https://turbo.build/schema.json",
        tasks: {
          build: { dependsOn: ["^build"] },
          lint: {},
          test: { dependsOn: ["build"] },
          dev: { cache: false, persistent: true },
        },
      }),
    });
    try {
      const result = scanTurboRepo(dir);
      assert.strictEqual(result.detected, true);
      assert.deepStrictEqual(result.pipelines.sort(), ["build", "dev", "lint", "test"]);
    } finally {
      cleanup(dir);
    }
  });

  it("detects turbo.json v1 pipeline", () => {
    const dir = createTempProject({
      "turbo.json": JSON.stringify({
        $schema: "https://turbo.build/schema.json",
        pipeline: {
          build: { dependsOn: ["^build"], outputs: ["dist/**"] },
          lint: {},
        },
      }),
    });
    try {
      const result = scanTurboRepo(dir);
      assert.strictEqual(result.detected, true);
      assert.deepStrictEqual(result.pipelines.sort(), ["build", "lint"]);
    } finally {
      cleanup(dir);
    }
  });

  it("handles malformed turbo.json gracefully", () => {
    const dir = createTempProject({
      "turbo.json": "{ invalid json content!!!",
    });
    try {
      const result = scanTurboRepo(dir);
      assert.strictEqual(result.detected, true);
      assert.deepStrictEqual(result.pipelines, []);
    } finally {
      cleanup(dir);
    }
  });

  it("handles empty turbo.json (no tasks or pipeline keys)", () => {
    const dir = createTempProject({
      "turbo.json": JSON.stringify({ $schema: "https://turbo.build/schema.json" }),
    });
    try {
      const result = scanTurboRepo(dir);
      assert.strictEqual(result.detected, true);
      assert.deepStrictEqual(result.pipelines, []);
    } finally {
      cleanup(dir);
    }
  });

  it("discovers packages under apps/ directory", () => {
    const dir = createTempProject({
      "turbo.json": JSON.stringify({ tasks: { build: {} } }),
      "apps/web/package.json": JSON.stringify({ name: "@acme/web", version: "1.0.0" }),
      "apps/docs/package.json": JSON.stringify({ name: "@acme/docs", version: "1.0.0" }),
    });
    try {
      const result = scanTurboRepo(dir);
      assert.strictEqual(result.detected, true);
      assert.strictEqual(result.packages.length, 2);
      const names = result.packages.map((p) => p.name).sort();
      assert.deepStrictEqual(names, ["@acme/docs", "@acme/web"]);
    } finally {
      cleanup(dir);
    }
  });

  it("discovers packages under packages/ directory", () => {
    const dir = createTempProject({
      "turbo.json": JSON.stringify({ tasks: { build: {} } }),
      "packages/ui/package.json": JSON.stringify({ name: "@acme/ui", version: "0.1.0" }),
      "packages/config/package.json": JSON.stringify({ name: "@acme/config" }),
    });
    try {
      const result = scanTurboRepo(dir);
      assert.strictEqual(result.packages.length, 2);
      const names = result.packages.map((p) => p.name).sort();
      assert.deepStrictEqual(names, ["@acme/config", "@acme/ui"]);
    } finally {
      cleanup(dir);
    }
  });

  it("discovers packages under libs/ and services/ directories", () => {
    const dir = createTempProject({
      "turbo.json": JSON.stringify({ tasks: {} }),
      "libs/shared/package.json": JSON.stringify({ name: "@acme/shared" }),
      "services/api/package.json": JSON.stringify({ name: "@acme/api" }),
    });
    try {
      const result = scanTurboRepo(dir);
      assert.strictEqual(result.packages.length, 2);
      const names = result.packages.map((p) => p.name).sort();
      assert.deepStrictEqual(names, ["@acme/api", "@acme/shared"]);
    } finally {
      cleanup(dir);
    }
  });

  it("discovers packages under tooling/ directory", () => {
    const dir = createTempProject({
      "turbo.json": JSON.stringify({ tasks: {} }),
      "tooling/eslint/package.json": JSON.stringify({ name: "@acme/eslint-config" }),
    });
    try {
      const result = scanTurboRepo(dir);
      assert.strictEqual(result.packages.length, 1);
      assert.strictEqual(result.packages[0].name, "@acme/eslint-config");
    } finally {
      cleanup(dir);
    }
  });

  it("uses directory name when package.json has no name field", () => {
    const dir = createTempProject({
      "turbo.json": JSON.stringify({ tasks: {} }),
      "apps/my-app/package.json": JSON.stringify({ version: "1.0.0" }),
    });
    try {
      const result = scanTurboRepo(dir);
      assert.strictEqual(result.packages.length, 1);
      assert.strictEqual(result.packages[0].name, "my-app");
    } finally {
      cleanup(dir);
    }
  });

  it("includes relative path in package info", () => {
    const dir = createTempProject({
      "turbo.json": JSON.stringify({ tasks: {} }),
      "apps/web/package.json": JSON.stringify({ name: "@acme/web" }),
    });
    try {
      const result = scanTurboRepo(dir);
      assert.strictEqual(result.packages.length, 1);
      assert.strictEqual(result.packages[0].relativePath, path.join("apps", "web"));
    } finally {
      cleanup(dir);
    }
  });

  it("full Turborepo with apps, packages, and tasks", () => {
    const dir = createTempProject({
      "turbo.json": JSON.stringify({
        $schema: "https://turbo.build/schema.json",
        tasks: {
          build: { dependsOn: ["^build"], outputs: ["dist/**", ".next/**"] },
          lint: {},
          test: { dependsOn: ["build"] },
          dev: { cache: false, persistent: true },
          "type-check": {},
        },
      }),
      "apps/web/package.json": JSON.stringify({ name: "@acme/web", version: "1.0.0" }),
      "apps/api/package.json": JSON.stringify({ name: "@acme/api", version: "1.0.0" }),
      "packages/ui/package.json": JSON.stringify({ name: "@acme/ui", version: "0.1.0" }),
      "packages/eslint-config/package.json": JSON.stringify({ name: "@acme/eslint-config" }),
      "packages/tsconfig/package.json": JSON.stringify({ name: "@acme/tsconfig" }),
    });
    try {
      const result = scanTurboRepo(dir);
      assert.strictEqual(result.detected, true);
      assert.deepStrictEqual(result.pipelines.sort(), ["build", "dev", "lint", "test", "type-check"]);
      assert.strictEqual(result.packages.length, 5);
      const names = result.packages.map((p) => p.name).sort();
      assert.ok(names.includes("@acme/web"));
      assert.ok(names.includes("@acme/api"));
      assert.ok(names.includes("@acme/ui"));
    } finally {
      cleanup(dir);
    }
  });

  it("ignores non-directory entries in convention dirs", () => {
    const dir = createTempProject({
      "turbo.json": JSON.stringify({ tasks: {} }),
      "apps/README.md": "# Apps",
      "apps/web/package.json": JSON.stringify({ name: "@acme/web" }),
    });
    try {
      const result = scanTurboRepo(dir);
      // Only the web directory should be found, not README.md
      assert.strictEqual(result.packages.length, 1);
      assert.strictEqual(result.packages[0].name, "@acme/web");
    } finally {
      cleanup(dir);
    }
  });

  it("ignores subdirectories without package.json", () => {
    const dir = createTempProject({
      "turbo.json": JSON.stringify({ tasks: {} }),
      "apps/web/package.json": JSON.stringify({ name: "@acme/web" }),
      "apps/scripts/run.sh": "#!/bin/bash\necho hello",
    });
    try {
      const result = scanTurboRepo(dir);
      assert.strictEqual(result.packages.length, 1);
    } finally {
      cleanup(dir);
    }
  });
});
