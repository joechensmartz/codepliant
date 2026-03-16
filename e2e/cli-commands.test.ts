import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import * as path from "path";

const CLI_PATH = path.resolve(import.meta.dirname, "..", "dist", "cli.js");

function runCli(args: string[], options?: { cwd?: string }): { stdout: string; exitCode: number } {
  try {
    const stdout = execFileSync("node", [CLI_PATH, ...args], {
      encoding: "utf-8",
      timeout: 30_000,
      cwd: options?.cwd,
      env: { ...process.env, NO_COLOR: "1" },
    });
    return { stdout, exitCode: 0 };
  } catch (err: unknown) {
    const e = err as { stdout?: string; status?: number };
    return { stdout: e.stdout ?? "", exitCode: e.status ?? 1 };
  }
}

describe("CLI e2e commands", () => {
  it("codepliant help exits 0 and shows usage", () => {
    const { stdout, exitCode } = runCli(["help"]);
    assert.equal(exitCode, 0, "help should exit 0");
    assert.ok(stdout.includes("codepliant"), "help output should mention codepliant");
  });

  it("codepliant --version shows version string", () => {
    const { stdout, exitCode } = runCli(["--version"]);
    assert.equal(exitCode, 0, "--version should exit 0");
    // Version should match semver pattern like "450.0.0"
    assert.match(stdout.trim(), /\d+\.\d+\.\d+/, "should print a semver version");
  });

  it("codepliant scan --json outputs valid JSON", () => {
    // Scan the codepliant project itself
    const projectPath = path.resolve(import.meta.dirname, "..");
    const { stdout, exitCode } = runCli(["scan", projectPath, "--json"]);
    assert.equal(exitCode, 0, "scan --json should exit 0");
    let parsed: unknown;
    assert.doesNotThrow(() => {
      parsed = JSON.parse(stdout);
    }, "scan --json output should be valid JSON");
    assert.ok(parsed !== null && typeof parsed === "object", "parsed output should be an object");
  });

  it("codepliant check exits 0 or 1", () => {
    const projectPath = path.resolve(import.meta.dirname, "..");
    const { exitCode } = runCli(["check", projectPath]);
    assert.ok(exitCode === 0 || exitCode === 1, `check should exit 0 or 1, got ${exitCode}`);
  });
});
