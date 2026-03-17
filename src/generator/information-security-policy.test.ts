import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateInformationSecurityPolicy } from "./information-security-policy.js";

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

describe("generateInformationSecurityPolicy", () => {
  // ── Null guard ──────────────────────────────────────────────────────

  it("returns null when fewer than 3 services", () => {
    const scan = makeScan({ services: [] });
    const result = generateInformationSecurityPolicy(scan);
    assert.strictEqual(result, null);
  });

  it("returns null with 1 service", () => {
    const scan = makeScan({ services: [makeService("a", "auth")] });
    const result = generateInformationSecurityPolicy(scan);
    assert.strictEqual(result, null);
  });

  it("returns null with 2 services", () => {
    const scan = makeScan({
      services: [makeService("a", "auth"), makeService("b", "payment")],
    });
    const result = generateInformationSecurityPolicy(scan);
    assert.strictEqual(result, null);
  });

  it("returns a string with exactly 3 services", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateInformationSecurityPolicy(scan);
    assert.strictEqual(typeof result, "string");
    assert.ok(result!.length > 0);
  });

  // ── Header and metadata ─────────────────────────────────────────────

  it("includes title", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateInformationSecurityPolicy(scan)!;
    assert.ok(result.includes("# Information Security Policy"));
  });

  it("includes effective date in ISO format", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateInformationSecurityPolicy(scan)!;
    assert.match(result, /\*\*Effective Date:\*\* \d{4}-\d{2}-\d{2}/);
    assert.match(result, /\*\*Last Updated:\*\* \d{4}-\d{2}-\d{2}/);
  });

  it("includes project name from scan", () => {
    const scan = makeScan({
      projectName: "my-app",
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateInformationSecurityPolicy(scan)!;
    assert.ok(result.includes("my-app"));
  });

  // ── Context values ──────────────────────────────────────────────────

  it("uses company name from context", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateInformationSecurityPolicy(scan, {
      companyName: "Acme Corp",
      contactEmail: "legal@acme.com",
    })!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses default company placeholder when no context", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateInformationSecurityPolicy(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses contact email from context", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateInformationSecurityPolicy(scan, {
      companyName: "Acme Corp",
      contactEmail: "security@acme.com",
    })!;
    assert.ok(result.includes("security@acme.com"));
  });

  it("uses default contact email placeholder when no context", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateInformationSecurityPolicy(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  // ── Core sections ───────────────────────────────────────────────────

  it("includes Purpose section", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateInformationSecurityPolicy(scan)!;
    assert.ok(result.includes("## 1. Purpose"));
    assert.ok(result.includes("ISO 27001"));
    assert.ok(result.includes("NIST CSF"));
  });

  it("includes Scope section with service count", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
        makeService("d", "analytics"),
      ],
    });
    const result = generateInformationSecurityPolicy(scan)!;
    assert.ok(result.includes("## 2. Scope"));
    assert.ok(result.includes("4 integrated services"));
  });

  it("includes Information Security Objectives section", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateInformationSecurityPolicy(scan)!;
    assert.ok(result.includes("## 3. Information Security Objectives"));
    assert.ok(result.includes("Confidentiality"));
    assert.ok(result.includes("Integrity"));
    assert.ok(result.includes("Availability"));
  });

  it("includes Roles and Responsibilities table", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateInformationSecurityPolicy(scan)!;
    assert.ok(result.includes("## 4. Roles and Responsibilities"));
    assert.ok(result.includes("CISO"));
    assert.ok(result.includes("Development Team"));
    assert.ok(result.includes("Operations Team"));
    assert.ok(result.includes("All Staff"));
  });

  it("includes Access Control section", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateInformationSecurityPolicy(scan)!;
    assert.ok(result.includes("## 5. Access Control"));
    assert.ok(result.includes("least privilege"));
    assert.ok(result.includes("Multi-factor authentication"));
  });

  it("includes Incident Management section", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateInformationSecurityPolicy(scan)!;
    assert.ok(result.includes("## 7. Incident Management"));
    assert.ok(result.includes("reported within 1 hour"));
    assert.ok(result.includes("INCIDENT_RESPONSE_PLAN.md"));
  });

  it("includes Policy Review section", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateInformationSecurityPolicy(scan)!;
    assert.ok(result.includes("## 8. Policy Review"));
    assert.ok(result.includes("reviewed annually"));
  });

  // ── Conditional CI/CD section ───────────────────────────────────────

  it("excludes Development Security section when no cicdScan", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateInformationSecurityPolicy(scan)!;
    assert.ok(!result.includes("## 6. Development Security"));
  });

  it("excludes Development Security when cicdScan is null", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateInformationSecurityPolicy(scan, undefined, null)!;
    assert.ok(!result.includes("## 6. Development Security"));
  });

  it("includes Development Security section when cicdScan provided", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateInformationSecurityPolicy(scan, undefined, {
      provider: "GitHub Actions",
      hasTests: true,
      hasLinting: true,
      hasSecurityScanning: false,
      hasDependencyScanning: false,
    })!;
    assert.ok(result.includes("## 6. Development Security"));
    assert.ok(result.includes("GitHub Actions"));
  });

  it("shows Enabled for detected CI/CD features", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateInformationSecurityPolicy(scan, undefined, {
      hasTests: true,
      hasLinting: true,
      hasSecurityScanning: true,
      hasDependencyScanning: true,
    })!;
    assert.ok(result.includes("Automated testing: Enabled"));
    assert.ok(result.includes("Linting: Enabled"));
    assert.ok(result.includes("Security scanning: Enabled"));
    assert.ok(result.includes("Dependency scanning: Enabled"));
  });

  it("shows Not detected for missing CI/CD features", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateInformationSecurityPolicy(scan, undefined, {
      hasTests: false,
      hasLinting: false,
      hasSecurityScanning: false,
      hasDependencyScanning: false,
    })!;
    assert.ok(result.includes("Automated testing: Not detected"));
    assert.ok(result.includes("Linting: Not detected"));
    assert.ok(result.includes("Security scanning: Not detected"));
    assert.ok(result.includes("Dependency scanning: Not detected"));
  });

  it("uses hasAutomatedTests fallback when hasTests is undefined", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateInformationSecurityPolicy(scan, undefined, {
      hasAutomatedTests: true,
      hasLinting: false,
      hasSecurityScanning: false,
    })!;
    assert.ok(result.includes("Automated testing: Enabled"));
  });

  it("uses hasDependencyUpdates fallback when hasDependencyScanning is undefined", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateInformationSecurityPolicy(scan, undefined, {
      hasDependencyUpdates: true,
      hasLinting: false,
      hasSecurityScanning: false,
    })!;
    assert.ok(result.includes("Dependency scanning: Enabled"));
  });

  it("uses platforms array when provider is not set", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateInformationSecurityPolicy(scan, undefined, {
      platforms: [{ name: "CircleCI" }, { name: "Jenkins" }],
      hasLinting: false,
      hasSecurityScanning: false,
    })!;
    assert.ok(result.includes("CircleCI, Jenkins"));
  });

  it("shows Unknown when no provider or platforms", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateInformationSecurityPolicy(scan, undefined, {})!;
    assert.ok(result.includes("**Unknown**"));
  });

  // ── Footer ──────────────────────────────────────────────────────────

  it("includes Codepliant disclaimer footer", () => {
    const scan = makeScan({
      services: [
        makeService("a", "auth"),
        makeService("b", "payment"),
        makeService("c", "monitoring"),
      ],
    });
    const result = generateInformationSecurityPolicy(scan)!;
    assert.ok(result.includes("Generated by Codepliant"));
    assert.ok(result.includes("security team"));
  });

  // ── Combined scenario ───────────────────────────────────────────────

  it("generates complete document with context and CI/CD", () => {
    const scan = makeScan({
      projectName: "big-app",
      services: [
        makeService("next-auth", "auth"),
        makeService("stripe", "payment"),
        makeService("sentry", "monitoring"),
        makeService("posthog", "analytics"),
      ],
    });
    const result = generateInformationSecurityPolicy(
      scan,
      { companyName: "BigCo", contactEmail: "security@bigco.com" },
      {
        provider: "GitHub Actions",
        hasTests: true,
        hasLinting: true,
        hasSecurityScanning: true,
        hasDependencyScanning: true,
      },
    )!;
    assert.ok(result.includes("# Information Security Policy"));
    assert.ok(result.includes("BigCo"));
    assert.ok(result.includes("big-app"));
    assert.ok(result.includes("4 integrated services"));
    assert.ok(result.includes("## 6. Development Security"));
    assert.ok(result.includes("GitHub Actions"));
    assert.ok(result.includes("security@bigco.com"));
    assert.ok(result.includes("## 8. Policy Review"));
  });
});
