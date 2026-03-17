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
});
