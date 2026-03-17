import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  detectEnvironment,
  isStrictEnvironment,
  getEnvironmentComplianceNote,
} from "./environment-scanner.js";

/**
 * Tests for environment-scanner.ts
 *
 * The environment scanner reads process.env directly, so we save/restore
 * env vars around each test to avoid cross-contamination.
 */

// All env vars the scanner checks — we clear them before each test
const ENV_VARS = [
  "NODE_ENV",
  "RAILS_ENV",
  "DJANGO_SETTINGS_MODULE",
  "FLASK_ENV",
  "FLASK_DEBUG",
  "APP_ENV",
  "GIN_MODE",
  "GO_ENV",
  "MIX_ENV",
  "RUST_ENV",
  "ASPNETCORE_ENVIRONMENT",
  "DOTNET_ENVIRONMENT",
  "RACK_ENV",
  "ENVIRONMENT",
  "ENV",
  "DEPLOY_ENV",
  "APP_ENVIRONMENT",
];

let savedEnv: Record<string, string | undefined> = {};

function saveEnv() {
  savedEnv = {};
  for (const v of ENV_VARS) {
    savedEnv[v] = process.env[v];
    delete process.env[v];
  }
}

function restoreEnv() {
  for (const v of ENV_VARS) {
    if (savedEnv[v] === undefined) {
      delete process.env[v];
    } else {
      process.env[v] = savedEnv[v];
    }
  }
}

describe("environment-scanner", () => {
  beforeEach(() => saveEnv());
  afterEach(() => restoreEnv());

  // ── detectEnvironment ─────────────────────────────────────────────

  it("returns unknown with low confidence when no env vars are set", () => {
    const result = detectEnvironment();
    assert.strictEqual(result.environment, "unknown");
    assert.strictEqual(result.confidence, "low");
    assert.strictEqual(result.signals.length, 0);
  });

  it("detects production from NODE_ENV=production", () => {
    process.env.NODE_ENV = "production";
    const result = detectEnvironment();
    assert.strictEqual(result.environment, "production");
    assert.strictEqual(result.confidence, "high");
    assert.ok(result.source.includes("NODE_ENV"));
  });

  it("detects production from NODE_ENV=prod", () => {
    process.env.NODE_ENV = "prod";
    const result = detectEnvironment();
    assert.strictEqual(result.environment, "production");
  });

  it("detects staging from NODE_ENV=staging", () => {
    process.env.NODE_ENV = "staging";
    const result = detectEnvironment();
    assert.strictEqual(result.environment, "staging");
    assert.strictEqual(result.confidence, "high");
  });

  it("detects staging from NODE_ENV=test", () => {
    process.env.NODE_ENV = "test";
    const result = detectEnvironment();
    assert.strictEqual(result.environment, "staging");
  });

  it("detects development from NODE_ENV=development", () => {
    process.env.NODE_ENV = "development";
    const result = detectEnvironment();
    assert.strictEqual(result.environment, "development");
    assert.strictEqual(result.confidence, "high");
  });

  it("detects development from NODE_ENV=dev", () => {
    process.env.NODE_ENV = "dev";
    const result = detectEnvironment();
    assert.strictEqual(result.environment, "development");
  });

  it("detects production from RAILS_ENV=production", () => {
    process.env.RAILS_ENV = "production";
    const result = detectEnvironment();
    assert.strictEqual(result.environment, "production");
    assert.ok(result.source.includes("RAILS_ENV"));
  });

  it("detects staging from FLASK_ENV=qa", () => {
    process.env.FLASK_ENV = "qa";
    const result = detectEnvironment();
    assert.strictEqual(result.environment, "staging");
  });

  it("detects development via FLASK_DEBUG=1", () => {
    process.env.FLASK_DEBUG = "1";
    const result = detectEnvironment();
    assert.strictEqual(result.environment, "development");
  });

  it("detects development via FLASK_DEBUG=true", () => {
    process.env.FLASK_DEBUG = "true";
    const result = detectEnvironment();
    assert.strictEqual(result.environment, "development");
  });

  it("detects production from ASPNETCORE_ENVIRONMENT=Production", () => {
    process.env.ASPNETCORE_ENVIRONMENT = "Production";
    const result = detectEnvironment();
    assert.strictEqual(result.environment, "production");
    assert.strictEqual(result.confidence, "high");
  });

  it("detects production from APP_ENV=live", () => {
    process.env.APP_ENV = "live";
    const result = detectEnvironment();
    assert.strictEqual(result.environment, "production");
  });

  it("detects staging from MIX_ENV=test", () => {
    process.env.MIX_ENV = "test";
    const result = detectEnvironment();
    assert.strictEqual(result.environment, "staging");
  });

  it("detects production from GIN_MODE=release", () => {
    process.env.GIN_MODE = "release";
    const result = detectEnvironment();
    assert.strictEqual(result.environment, "production");
  });

  it("detects development from RACK_ENV=local", () => {
    process.env.RACK_ENV = "local";
    const result = detectEnvironment();
    assert.strictEqual(result.environment, "development");
  });

  it("uses Django settings module heuristics for prod", () => {
    process.env.DJANGO_SETTINGS_MODULE = "myproject.settings.production_aws";
    const result = detectEnvironment();
    assert.strictEqual(result.environment, "production");
  });

  it("uses Django settings module heuristics for staging", () => {
    process.env.DJANGO_SETTINGS_MODULE = "myproject.settings.staging";
    const result = detectEnvironment();
    assert.strictEqual(result.environment, "staging");
  });

  it("uses Django settings module heuristics for dev", () => {
    process.env.DJANGO_SETTINGS_MODULE = "myproject.settings.development";
    const result = detectEnvironment();
    assert.strictEqual(result.environment, "development");
  });

  it("prioritizes NODE_ENV over lower-priority vars", () => {
    process.env.NODE_ENV = "production";
    process.env.APP_ENV = "development";
    const result = detectEnvironment();
    assert.strictEqual(result.environment, "production");
    assert.ok(result.source.includes("NODE_ENV"));
    // Both signals are present
    assert.ok(result.signals.length >= 2);
  });

  it("collects all signals even when first match wins", () => {
    process.env.NODE_ENV = "production";
    process.env.RAILS_ENV = "staging";
    process.env.RACK_ENV = "development";
    const result = detectEnvironment();
    assert.strictEqual(result.environment, "production");
    assert.strictEqual(result.signals.length, 3);
  });

  it("returns low confidence for unrecognized values", () => {
    process.env.DEPLOY_ENV = "canary-v2";
    const result = detectEnvironment();
    // "canary-v2" doesn't match any known pattern
    assert.strictEqual(result.confidence, "low");
  });

  it("is case-insensitive for environment values", () => {
    process.env.NODE_ENV = "PRODUCTION";
    const result = detectEnvironment();
    assert.strictEqual(result.environment, "production");
  });

  // ── isStrictEnvironment ───────────────────────────────────────────

  it("returns true for production", () => {
    assert.strictEqual(isStrictEnvironment("production"), true);
  });

  it("returns true for unknown (defaults to strict)", () => {
    assert.strictEqual(isStrictEnvironment("unknown"), true);
  });

  it("returns false for staging", () => {
    assert.strictEqual(isStrictEnvironment("staging"), false);
  });

  it("returns false for development", () => {
    assert.strictEqual(isStrictEnvironment("development"), false);
  });

  // ── getEnvironmentComplianceNote ──────────────────────────────────

  it("returns production compliance note", () => {
    const note = getEnvironmentComplianceNote({
      environment: "production",
      source: "NODE_ENV=production",
      confidence: "high",
      signals: [],
    });
    assert.ok(note.includes("Production environment detected"));
    assert.ok(note.includes("strictest"));
  });

  it("returns staging compliance note", () => {
    const note = getEnvironmentComplianceNote({
      environment: "staging",
      source: "NODE_ENV=staging",
      confidence: "high",
      signals: [],
    });
    assert.ok(note.includes("Staging environment detected"));
    assert.ok(note.includes("mirror production"));
  });

  it("returns development compliance note", () => {
    const note = getEnvironmentComplianceNote({
      environment: "development",
      source: "NODE_ENV=development",
      confidence: "high",
      signals: [],
    });
    assert.ok(note.includes("Development environment detected"));
    assert.ok(note.includes("informational"));
  });

  it("returns unknown compliance note defaulting to production", () => {
    const note = getEnvironmentComplianceNote({
      environment: "unknown",
      source: "No environment variables detected",
      confidence: "low",
      signals: [],
    });
    assert.ok(note.includes("Could not detect"));
    assert.ok(note.includes("production-level"));
  });
});
