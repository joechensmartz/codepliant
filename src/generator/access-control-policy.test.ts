import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateAccessControlPolicy } from "./access-control-policy.js";

function makeService(
  name: string,
  category: DetectedService["category"],
  dataCollected: string[] = ["test data"],
): DetectedService {
  return {
    name,
    category,
    evidence: [{ type: "dependency", file: "package.json", detail: `${name} detected` }],
    dataCollected,
  };
}

function makeScan(overrides: Partial<ScanResult> = {}): ScanResult {
  return {
    projectName: "test-project",
    projectPath: "/tmp/test",
    scannedAt: "2026-01-01",
    services: [],
    dataCategories: [],
    complianceNeeds: [],
    ...overrides,
  };
}

describe("generateAccessControlPolicy", () => {
  it("returns null when no auth services detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateAccessControlPolicy(scan);
    assert.strictEqual(result, null);
  });

  it("generates policy when auth service detected", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email", "name", "session data"])],
    });
    const result = generateAccessControlPolicy(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Access Control Policy"));
  });

  it("includes RBAC section", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email"])],
    });
    const result = generateAccessControlPolicy(scan)!;
    assert.ok(result.includes("Role-Based Access Control"));
    assert.ok(result.includes("Super Admin"));
    assert.ok(result.includes("Least Privilege"));
  });

  it("includes password policy section", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email"])],
    });
    const result = generateAccessControlPolicy(scan)!;
    assert.ok(result.includes("Password Policy"));
    assert.ok(result.includes("12 characters"));
    assert.ok(result.includes("bcrypt"));
  });

  it("includes session management section", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email"])],
    });
    const result = generateAccessControlPolicy(scan)!;
    assert.ok(result.includes("Session Management"));
    assert.ok(result.includes("HttpOnly"));
    assert.ok(result.includes("session fixation"));
  });

  it("includes MFA section", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email"])],
    });
    const result = generateAccessControlPolicy(scan)!;
    assert.ok(result.includes("Multi-Factor Authentication"));
    assert.ok(result.includes("TOTP"));
  });

  it("includes OAuth section when OAuth provider detected", () => {
    const scan = makeScan({
      services: [makeService("passport", "auth", ["email", "OAuth tokens"])],
    });
    const result = generateAccessControlPolicy(scan)!;
    assert.ok(result.includes("OAuth"));
  });

  it("includes PCI note when payment services present", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth", ["email"]),
        makeService("stripe", "payment", ["payment information"]),
      ],
    });
    const result = generateAccessControlPolicy(scan)!;
    assert.ok(result.includes("PCI DSS"));
  });

  it("includes AI access note when AI services present", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth", ["email"]),
        makeService("openai", "ai", ["user prompts"]),
      ],
    });
    const result = generateAccessControlPolicy(scan)!;
    assert.ok(result.includes("AI configurations"));
  });

  it("recommends MFA when not detected", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email", "name"])],
    });
    const result = generateAccessControlPolicy(scan)!;
    assert.ok(result.includes("strongly recommended") || result.includes("Implementation Recommendation"));
  });

  it("includes WebAuthn section when detected", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth", ["email"]),
        makeService("@simplewebauthn/server", "auth", ["biometric authentication data"]),
      ],
    });
    const result = generateAccessControlPolicy(scan)!;
    assert.ok(result.includes("WebAuthn") || result.includes("Passkey"));
  });

  it("includes detected auth services table", () => {
    const scan = makeScan({
      services: [makeService("@clerk/nextjs", "auth", ["email", "name", "phone number"])],
    });
    const result = generateAccessControlPolicy(scan)!;
    assert.ok(result.includes("@clerk/nextjs"));
    assert.ok(result.includes("email"));
  });

  it("uses context company name and email", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email"])],
    });
    const result = generateAccessControlPolicy(scan, {
      companyName: "TestCo",
      contactEmail: "security@testco.com",
    })!;
    assert.ok(result.includes("TestCo"));
    assert.ok(result.includes("security@testco.com"));
  });

  it("includes API access section", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email"])],
    });
    const result = generateAccessControlPolicy(scan)!;
    assert.ok(result.includes("API Key Management"));
    assert.ok(result.includes("Service Account"));
  });

  it("includes monitoring section", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email"])],
    });
    const result = generateAccessControlPolicy(scan)!;
    assert.ok(result.includes("Access Monitoring"));
    assert.ok(result.includes("Failed login"));
  });

  it("includes codepliant disclaimer", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email"])],
    });
    const result = generateAccessControlPolicy(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("does not constitute legal advice"));
  });

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateAccessControlPolicy(scan), null);
  });

  it("returns null when only non-auth services exist", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("openai", "ai"),
        makeService("sentry", "monitoring"),
      ],
    });
    assert.strictEqual(generateAccessControlPolicy(scan), null);
  });

  it("includes project name in generated content", () => {
    const scan = makeScan({
      projectName: "my-special-app",
      services: [makeService("next-auth", "auth", ["email"])],
    });
    const result = generateAccessControlPolicy(scan)!;
    assert.ok(result.includes("my-special-app"));
  });

  it("includes date in generated content", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email"])],
    });
    const result = generateAccessControlPolicy(scan)!;
    // Should contain a date in YYYY-MM-DD format
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("uses default placeholders when no context provided", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email"])],
    });
    const result = generateAccessControlPolicy(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("includes access review schedule table", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email"])],
    });
    const result = generateAccessControlPolicy(scan)!;
    assert.ok(result.includes("Quarterly"));
    assert.ok(result.includes("Monthly"));
    assert.ok(result.includes("Inactive account cleanup"));
  });

  it("includes password reset section", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email"])],
    });
    const result = generateAccessControlPolicy(scan)!;
    assert.ok(result.includes("Password Reset"));
    assert.ok(result.includes("1 hour"));
    assert.ok(result.includes("128 bits"));
  });

  it("handles multiple auth services in the table", () => {
    const scan = makeScan({
      services: [
        makeService("next-auth", "auth", ["email", "name"]),
        makeService("passport", "auth", ["email", "OAuth tokens"]),
      ],
    });
    const result = generateAccessControlPolicy(scan)!;
    assert.ok(result.includes("next-auth"));
    assert.ok(result.includes("passport"));
  });

  it("includes Scope section", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email"])],
    });
    const result = generateAccessControlPolicy(scan)!;
    assert.ok(result.includes("## 2. Scope"));
    assert.ok(result.includes("administrators"));
  });

  it("includes Purpose section with compliance references", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email"])],
    });
    const result = generateAccessControlPolicy(scan)!;
    assert.ok(result.includes("## 1. Purpose"));
    assert.ok(result.includes("GDPR"));
    assert.ok(result.includes("SOC 2"));
    assert.ok(result.includes("ISO 27001"));
  });

  it("includes policy review section", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email"])],
    });
    const result = generateAccessControlPolicy(scan)!;
    assert.ok(result.includes("Policy Review"));
    assert.ok(result.includes("security incident"));
  });

  it("includes data collected in the services table", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email", "name", "profile photo"])],
    });
    const result = generateAccessControlPolicy(scan)!;
    assert.ok(result.includes("email, name, profile photo"));
  });

  it("includes concurrent session limits mention", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email"])],
    });
    const result = generateAccessControlPolicy(scan)!;
    assert.ok(result.includes("Concurrent session"));
  });

  it("uses context email in the contact section", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth", ["email"])],
    });
    const result = generateAccessControlPolicy(scan, {
      companyName: "TestCorp",
      contactEmail: "admin@corp.com",
    })!;
    assert.ok(result.includes("admin@corp.com"));
  });
});
