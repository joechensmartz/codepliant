import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";

/**
 * Zero Network Calls Verification
 *
 * This test scans Codepliant's own source code to verify that no network-related
 * code exists in the scanner or generator modules. The only allowed network-adjacent
 * dependency is the MCP SDK (which uses stdio transport, not HTTP).
 */

const SRC_DIR = path.resolve(import.meta.dirname!, "..");

// Patterns that indicate network calls
const NETWORK_IMPORT_PATTERNS = [
  /import\s+.*from\s+['"]node-fetch['"]/,
  /import\s+.*from\s+['"]axios['"]/,
  /import\s+.*from\s+['"]got['"]/,
  /import\s+.*from\s+['"]superagent['"]/,
  /import\s+.*from\s+['"]undici['"]/,
  /import\s+.*from\s+['"]http['"]/,
  /import\s+.*from\s+['"]https['"]/,
  /import\s+.*from\s+['"]net['"]/,
  /import\s+.*from\s+['"]dns['"]/,
  /import\s+.*from\s+['"]node:http['"]/,
  /import\s+.*from\s+['"]node:https['"]/,
  /import\s+.*from\s+['"]node:net['"]/,
  /import\s+.*from\s+['"]node:dns['"]/,
  /require\(\s*['"]http['"]\s*\)/,
  /require\(\s*['"]https['"]\s*\)/,
  /require\(\s*['"]net['"]\s*\)/,
  /require\(\s*['"]dns['"]\s*\)/,
  /require\(\s*['"]node-fetch['"]\s*\)/,
  /require\(\s*['"]axios['"]\s*\)/,
];

// Patterns that indicate outbound network calls in code
const NETWORK_CALL_PATTERNS = [
  /\bfetch\s*\(/,
  /\bXMLHttpRequest\b/,
  /\bnew\s+WebSocket\s*\(/,
  /\bnavigator\.sendBeacon\b/,
  /\.listen\s*\(\s*\d/,  // server.listen(port)
  /http\.createServer/,
  /https\.createServer/,
  /http\.request\s*\(/,
  /https\.request\s*\(/,
  /http\.get\s*\(/,
  /https\.get\s*\(/,
];

// Patterns that indicate telemetry/analytics
const TELEMETRY_PATTERNS = [
  /telemetry/i,
  /phone[-_]?home/i,
  /\bbeacon\b/i,
  /\btracking\b/i,
];

// Files/directories to skip (MCP SDK is expected to have network-related code)
const SKIP_DIRS = new Set(["node_modules", "dist", ".git"]);

// Files in mcp/ are allowed to import MCP SDK (which itself may reference network
// internally), but our code must only use StdioServerTransport
const MCP_DIR = path.join(SRC_DIR, "mcp");

function walkSourceFiles(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkSourceFiles(fullPath));
    } else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")) {
      files.push(fullPath);
    }
  }
  return files;
}

describe("Zero Network Calls Verification", () => {
  const sourceFiles = walkSourceFiles(SRC_DIR);

  it("finds source files to audit", () => {
    assert.ok(sourceFiles.length > 10, `Expected at least 10 source files, found ${sourceFiles.length}`);
  });

  it("scanner and generator files have no network imports", () => {
    const violations: string[] = [];

    for (const file of sourceFiles) {
      const relativePath = path.relative(SRC_DIR, file);
      // Skip MCP server file (it imports MCP SDK, but uses stdio transport)
      // Skip API server (it intentionally uses http to serve the REST API)
      if (relativePath.startsWith("mcp/")) continue;
      if (relativePath.startsWith("api/")) continue;
      if (relativePath.startsWith("notifications/")) continue;

      const content = fs.readFileSync(file, "utf-8");
      const lines = content.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (const pattern of NETWORK_IMPORT_PATTERNS) {
          if (pattern.test(line)) {
            violations.push(`${relativePath}:${i + 1} - network import: ${line.trim()}`);
          }
        }
      }
    }

    assert.strictEqual(
      violations.length,
      0,
      `Found network imports in source files:\n${violations.join("\n")}`
    );
  });

  it("scanner and generator files have no fetch/http calls", () => {
    const violations: string[] = [];

    for (const file of sourceFiles) {
      const relativePath = path.relative(SRC_DIR, file);
      // Skip MCP server file, API server, AI features (intentionally use network)
      if (relativePath.startsWith("mcp/")) continue;
      if (relativePath.startsWith("api/")) continue;
      if (relativePath.startsWith("notifications/")) continue;
      if (relativePath.startsWith("ai/")) continue;

      const content = fs.readFileSync(file, "utf-8");
      const lines = content.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Skip comments and strings that are part of generated document content
        // (e.g., URLs in privacy policy templates or detection patterns)
        if (line.trim().startsWith("//")) continue;
        if (line.trim().startsWith("*")) continue;

        for (const pattern of NETWORK_CALL_PATTERNS) {
          if (pattern.test(line)) {
            violations.push(`${relativePath}:${i + 1} - network call: ${line.trim()}`);
          }
        }
      }
    }

    assert.strictEqual(
      violations.length,
      0,
      `Found network calls in source files:\n${violations.join("\n")}`
    );
  });

  it("no telemetry or analytics code in codepliant itself", () => {
    const violations: string[] = [];

    // Only check non-scanner files. Scanner files legitimately reference
    // "tracking" and "analytics" because they DETECT those in user code.
    const nonScannerFiles = sourceFiles.filter(f => {
      const rel = path.relative(SRC_DIR, f);
      return !rel.startsWith("scanner/") && !rel.startsWith("generator/") && !rel.startsWith("mcp/") && !rel.startsWith("output/") && !rel.startsWith("api/");
    });

    for (const file of nonScannerFiles) {
      const relativePath = path.relative(SRC_DIR, file);
      const content = fs.readFileSync(file, "utf-8");
      const lines = content.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim().startsWith("//")) continue;
        if (line.trim().startsWith("*")) continue;

        for (const pattern of TELEMETRY_PATTERNS) {
          if (pattern.test(line)) {
            violations.push(`${relativePath}:${i + 1} - telemetry pattern: ${line.trim()}`);
          }
        }
      }
    }

    assert.strictEqual(
      violations.length,
      0,
      `Found telemetry/analytics patterns in non-scanner files:\n${violations.join("\n")}`
    );
  });

  it("MCP server uses stdio transport, not HTTP", () => {
    const mcpServerPath = path.join(MCP_DIR, "server.ts");
    // Skip if MCP server hasn't been implemented yet
    if (!fs.existsSync(mcpServerPath)) return;

    const content = fs.readFileSync(mcpServerPath, "utf-8");

    // Must use StdioServerTransport
    assert.ok(
      content.includes("StdioServerTransport"),
      "MCP server must use StdioServerTransport"
    );

    // Must NOT use HTTP transport
    assert.ok(
      !content.includes("HttpServerTransport"),
      "MCP server must not use HttpServerTransport"
    );
    assert.ok(
      !content.includes("SSEServerTransport"),
      "MCP server must not use SSEServerTransport"
    );
  });

  it("package.json has no network-related runtime dependencies", () => {
    const pkgPath = path.join(SRC_DIR, "..", "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    const deps = Object.keys(pkg.dependencies || {});

    const networkPackages = [
      "node-fetch", "axios", "got", "superagent", "undici",
      "request", "needle", "ky", "bent",
    ];

    for (const dep of deps) {
      assert.ok(
        !networkPackages.includes(dep),
        `Runtime dependency "${dep}" is a network package. Codepliant must not make network calls.`
      );
    }
  });
});
