import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { generateSbom, writeSbom } from "./sbom.js";
import type { ScanResult } from "../scanner/index.js";

function makeScan(projectPath: string = "/tmp/test"): ScanResult {
  return {
    projectName: "test-project",
    projectPath,
    scannedAt: "2026-01-01T00:00:00.000Z",
    services: [],
    dataCategories: [],
    complianceNeeds: [],
  };
}

describe("generateSbom", () => {
  it("returns valid CycloneDX 1.5 structure", () => {
    // Create a temporary project with a package.json
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-test-"));
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({
        name: "my-app",
        version: "2.0.0",
        dependencies: { express: "^4.18.0" },
        devDependencies: { typescript: "^5.0.0" },
      })
    );

    const scan = makeScan(tmpDir);
    const bom = generateSbom(scan);

    assert.strictEqual(bom.bomFormat, "CycloneDX");
    assert.strictEqual(bom.specVersion, "1.5");
    assert.strictEqual(bom.version, 1);
    assert.ok(bom.serialNumber.startsWith("urn:uuid:"));
    assert.strictEqual(bom.metadata.tools[0].name, "codepliant");
    assert.strictEqual(bom.metadata.component?.name, "my-app");
    assert.strictEqual(bom.metadata.component?.version, "2.0.0");
    assert.strictEqual(bom.components.length, 2);

    // Components should be sorted alphabetically
    assert.strictEqual(bom.components[0].name, "express");
    assert.strictEqual(bom.components[0].version, "4.18.0");
    assert.strictEqual(bom.components[0].purl, "pkg:npm/express@4.18.0");
    assert.strictEqual(bom.components[0].type, "library");

    assert.strictEqual(bom.components[1].name, "typescript");
    assert.strictEqual(bom.components[1].version, "5.0.0");

    // Clean up
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("handles scoped packages in purl", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-test-"));
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({
        name: "my-app",
        version: "1.0.0",
        dependencies: { "@sentry/node": "^7.0.0" },
      })
    );

    const scan = makeScan(tmpDir);
    const bom = generateSbom(scan);

    assert.strictEqual(bom.components.length, 1);
    assert.strictEqual(bom.components[0].name, "@sentry/node");
    assert.strictEqual(bom.components[0].purl, "pkg:npm/%40sentry/node@7.0.0");

    fs.rmSync(tmpDir, { recursive: true });
  });

  it("returns empty components when no package.json exists", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-test-"));

    const scan = makeScan(tmpDir);
    const bom = generateSbom(scan);

    assert.strictEqual(bom.bomFormat, "CycloneDX");
    assert.strictEqual(bom.components.length, 0);

    fs.rmSync(tmpDir, { recursive: true });
  });

  it("returns empty components when package.json has no deps", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-test-"));
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "bare-project", version: "0.1.0" })
    );

    const scan = makeScan(tmpDir);
    const bom = generateSbom(scan);

    assert.strictEqual(bom.components.length, 0);
    assert.strictEqual(bom.metadata.component?.name, "bare-project");

    fs.rmSync(tmpDir, { recursive: true });
  });

  it("generates unique serial numbers", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-test-"));
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "app", version: "1.0.0" })
    );

    const scan = makeScan(tmpDir);
    const bom1 = generateSbom(scan);
    const bom2 = generateSbom(scan);

    assert.notStrictEqual(bom1.serialNumber, bom2.serialNumber);

    fs.rmSync(tmpDir, { recursive: true });
  });
});

describe("generateSbom edge cases", () => {
  it("strips tilde prefix from version", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-test-"));
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "app", version: "1.0.0", dependencies: { lodash: "~4.17.21" } })
    );
    const bom = generateSbom(makeScan(tmpDir));
    assert.strictEqual(bom.components[0].version, "4.17.21");
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("strips >= prefix from version", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-test-"));
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "app", version: "1.0.0", dependencies: { lodash: ">=4.0.0" } })
    );
    const bom = generateSbom(makeScan(tmpDir));
    assert.strictEqual(bom.components[0].version, "=4.0.0");
    assert.ok(bom.components[0].purl!.includes("@"));
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("merges dependencies and devDependencies", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-test-"));
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({
        name: "app", version: "1.0.0",
        dependencies: { express: "^4.18.0" },
        devDependencies: { jest: "^29.0.0" },
      })
    );
    const bom = generateSbom(makeScan(tmpDir));
    assert.strictEqual(bom.components.length, 2);
    const names = bom.components.map(c => c.name);
    assert.ok(names.includes("express"));
    assert.ok(names.includes("jest"));
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("sorts components alphabetically by name", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-test-"));
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({
        name: "app", version: "1.0.0",
        dependencies: { zod: "^3.0.0", axios: "^1.0.0", moment: "^2.0.0" },
      })
    );
    const bom = generateSbom(makeScan(tmpDir));
    assert.strictEqual(bom.components[0].name, "axios");
    assert.strictEqual(bom.components[1].name, "moment");
    assert.strictEqual(bom.components[2].name, "zod");
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("sets bom-ref for each component", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-test-"));
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "app", version: "1.0.0", dependencies: { express: "^4.18.0" } })
    );
    const bom = generateSbom(makeScan(tmpDir));
    assert.strictEqual(bom.components[0]["bom-ref"], "express@4.18.0");
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("handles malformed package.json gracefully", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-test-"));
    fs.writeFileSync(path.join(tmpDir, "package.json"), "{invalid json!!!");
    const bom = generateSbom(makeScan(tmpDir));
    assert.strictEqual(bom.bomFormat, "CycloneDX");
    assert.strictEqual(bom.components.length, 0);
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("falls back to directory name when package.json has no name", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-test-"));
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ version: "1.0.0" })
    );
    const bom = generateSbom(makeScan(tmpDir));
    assert.ok(bom.metadata.component?.name);
    assert.notStrictEqual(bom.metadata.component?.name, "");
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("falls back to 0.0.0 when package.json has no version", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-test-"));
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "my-app" })
    );
    const bom = generateSbom(makeScan(tmpDir));
    assert.strictEqual(bom.metadata.component?.version, "0.0.0");
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("sets metadata.timestamp to a valid ISO string", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-test-"));
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "app", version: "1.0.0" })
    );
    const bom = generateSbom(makeScan(tmpDir));
    assert.ok(!isNaN(Date.parse(bom.metadata.timestamp)));
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("handles multiple scoped packages", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-test-"));
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({
        name: "app", version: "1.0.0",
        dependencies: { "@types/node": "^20.0.0", "@types/express": "^4.17.0" },
      })
    );
    const bom = generateSbom(makeScan(tmpDir));
    assert.strictEqual(bom.components.length, 2);
    for (const c of bom.components) {
      assert.ok(c.purl!.includes("%40types/"));
    }
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("sets component type to library", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-test-"));
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "app", version: "1.0.0", dependencies: { express: "^4.0.0" } })
    );
    const bom = generateSbom(makeScan(tmpDir));
    assert.strictEqual(bom.components[0].type, "library");
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("sets metadata component type to application", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-test-"));
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "app", version: "1.0.0" })
    );
    const bom = generateSbom(makeScan(tmpDir));
    assert.strictEqual(bom.metadata.component?.type, "application");
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("handles package with only devDependencies", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-test-"));
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "app", version: "1.0.0", devDependencies: { typescript: "^5.0.0" } })
    );
    const bom = generateSbom(makeScan(tmpDir));
    assert.strictEqual(bom.components.length, 1);
    assert.strictEqual(bom.components[0].name, "typescript");
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("purl uses cleaned version not raw version range", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-test-"));
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "app", version: "1.0.0", dependencies: { lodash: "^4.17.21" } })
    );
    const bom = generateSbom(makeScan(tmpDir));
    assert.ok(!bom.components[0].purl!.includes("^"));
    assert.ok(bom.components[0].purl!.includes("@4.17.21"));
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("handles many dependencies efficiently", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-test-"));
    const deps: Record<string, string> = {};
    for (let i = 0; i < 50; i++) deps[`pkg-${String(i).padStart(3, "0")}`] = `^${i}.0.0`;
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "big-app", version: "2.0.0", dependencies: deps })
    );
    const bom = generateSbom(makeScan(tmpDir));
    assert.strictEqual(bom.components.length, 50);
    // Verify sorted
    for (let i = 1; i < bom.components.length; i++) {
      assert.ok(bom.components[i - 1].name.localeCompare(bom.components[i].name) <= 0);
    }
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("uses projectName from scan in metadata", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-test-"));
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "actual-name", version: "1.0.0" })
    );
    const bom = generateSbom(makeScan(tmpDir));
    // metadata.component uses package.json name, not scan projectName
    assert.strictEqual(bom.metadata.component?.name, "actual-name");
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("serial number is a valid urn:uuid format", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-test-"));
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "app", version: "1.0.0" })
    );
    const bom = generateSbom(makeScan(tmpDir));
    assert.match(bom.serialNumber, /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("tool vendor is codepliant", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-test-"));
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "app", version: "1.0.0" })
    );
    const bom = generateSbom(makeScan(tmpDir));
    assert.strictEqual(bom.metadata.tools[0].vendor, "codepliant");
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("exact version string without prefix passes through cleanly", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-test-"));
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "app", version: "1.0.0", dependencies: { lodash: "4.17.21" } })
    );
    const bom = generateSbom(makeScan(tmpDir));
    assert.strictEqual(bom.components[0].version, "4.17.21");
    fs.rmSync(tmpDir, { recursive: true });
  });
});

describe("writeSbom", () => {
  it("writes valid JSON to disk", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-write-"));
    const outPath = path.join(tmpDir, "sbom.json");

    // Create a minimal project for generateSbom
    const projDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-proj-"));
    fs.writeFileSync(
      path.join(projDir, "package.json"),
      JSON.stringify({
        name: "write-test",
        version: "1.0.0",
        dependencies: { lodash: "^4.17.0" },
      })
    );

    const scan = makeScan(projDir);
    const bom = generateSbom(scan);
    const written = writeSbom(bom, outPath);

    assert.strictEqual(written, outPath);
    assert.ok(fs.existsSync(outPath));

    const parsed = JSON.parse(fs.readFileSync(outPath, "utf-8"));
    assert.strictEqual(parsed.bomFormat, "CycloneDX");
    assert.strictEqual(parsed.components.length, 1);

    fs.rmSync(tmpDir, { recursive: true });
    fs.rmSync(projDir, { recursive: true });
  });

  it("creates parent directories if needed", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-nested-"));
    const outPath = path.join(tmpDir, "deep", "nested", "sbom.json");

    const projDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-proj-"));
    fs.writeFileSync(
      path.join(projDir, "package.json"),
      JSON.stringify({ name: "nested-test", version: "1.0.0" })
    );

    const scan = makeScan(projDir);
    const bom = generateSbom(scan);
    writeSbom(bom, outPath);

    assert.ok(fs.existsSync(outPath));

    fs.rmSync(tmpDir, { recursive: true });
    fs.rmSync(projDir, { recursive: true });
  });

  it("overwrites existing file at the same path", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-write-"));
    const outPath = path.join(tmpDir, "sbom.json");

    const projDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-proj-"));
    fs.writeFileSync(
      path.join(projDir, "package.json"),
      JSON.stringify({ name: "app", version: "1.0.0", dependencies: { a: "^1.0.0" } })
    );

    const scan = makeScan(projDir);
    const bom1 = generateSbom(scan);
    writeSbom(bom1, outPath);

    // Write again with different data
    fs.writeFileSync(
      path.join(projDir, "package.json"),
      JSON.stringify({ name: "app", version: "2.0.0", dependencies: { b: "^2.0.0" } })
    );
    const bom2 = generateSbom(scan);
    writeSbom(bom2, outPath);

    const parsed = JSON.parse(fs.readFileSync(outPath, "utf-8"));
    assert.strictEqual(parsed.metadata.component.version, "2.0.0");

    fs.rmSync(tmpDir, { recursive: true });
    fs.rmSync(projDir, { recursive: true });
  });

  it("written file ends with a newline", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-write-"));
    const outPath = path.join(tmpDir, "sbom.json");

    const projDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-proj-"));
    fs.writeFileSync(
      path.join(projDir, "package.json"),
      JSON.stringify({ name: "app", version: "1.0.0" })
    );

    const bom = generateSbom(makeScan(projDir));
    writeSbom(bom, outPath);

    const raw = fs.readFileSync(outPath, "utf-8");
    assert.ok(raw.endsWith("\n"));

    fs.rmSync(tmpDir, { recursive: true });
    fs.rmSync(projDir, { recursive: true });
  });

  it("returns an absolute path", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-write-"));
    const outPath = path.join(tmpDir, "sbom.json");

    const projDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-proj-"));
    fs.writeFileSync(
      path.join(projDir, "package.json"),
      JSON.stringify({ name: "app", version: "1.0.0" })
    );

    const bom = generateSbom(makeScan(projDir));
    const result = writeSbom(bom, outPath);

    assert.ok(path.isAbsolute(result));

    fs.rmSync(tmpDir, { recursive: true });
    fs.rmSync(projDir, { recursive: true });
  });

  it("written JSON is pretty-printed with 2-space indentation", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-write-"));
    const outPath = path.join(tmpDir, "sbom.json");

    const projDir = fs.mkdtempSync(path.join(os.tmpdir(), "sbom-proj-"));
    fs.writeFileSync(
      path.join(projDir, "package.json"),
      JSON.stringify({ name: "app", version: "1.0.0" })
    );

    const bom = generateSbom(makeScan(projDir));
    writeSbom(bom, outPath);

    const raw = fs.readFileSync(outPath, "utf-8");
    assert.ok(raw.includes('  "bomFormat"'));

    fs.rmSync(tmpDir, { recursive: true });
    fs.rmSync(projDir, { recursive: true });
  });
});
