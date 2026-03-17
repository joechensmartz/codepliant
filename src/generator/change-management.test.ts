import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateChangeManagementPolicy, detectCiCd } from "./change-management.js";

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

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "change-mgmt-test-"));
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(dir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, "utf-8");
  }
  return dir;
}

function cleanup(dir: string): void {
  fs.rmSync(dir, { recursive: true, force: true });
}

// ── detectCiCd ───────────────────────────────────────────────────────

describe("detectCiCd", () => {
  it("returns empty array for project with no CI/CD", () => {
    const dir = createTempProject({ "src/index.ts": "console.log('hi');" });
    try {
      const result = detectCiCd(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("detects GitHub Actions", () => {
    const dir = createTempProject({
      ".github/workflows/ci.yml": "name: CI\non: push\njobs: {}",
    });
    try {
      const result = detectCiCd(dir);
      assert.ok(result.some(d => d.platform === "GitHub Actions"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects GitLab CI", () => {
    const dir = createTempProject({
      ".gitlab-ci.yml": "stages:\n  - build\n  - test",
    });
    try {
      const result = detectCiCd(dir);
      assert.ok(result.some(d => d.platform === "GitLab CI"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects Dockerfile", () => {
    const dir = createTempProject({
      "Dockerfile": "FROM node:18\nCOPY . .",
    });
    try {
      const result = detectCiCd(dir);
      assert.ok(result.some(d => d.platform === "Docker"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects Vercel", () => {
    const dir = createTempProject({
      "vercel.json": '{ "framework": "nextjs" }',
    });
    try {
      const result = detectCiCd(dir);
      assert.ok(result.some(d => d.platform === "Vercel"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects multiple platforms", () => {
    const dir = createTempProject({
      ".github/workflows/ci.yml": "name: CI",
      "Dockerfile": "FROM node:18",
      "vercel.json": "{}",
    });
    try {
      const result = detectCiCd(dir);
      assert.ok(result.length >= 3);
    } finally {
      cleanup(dir);
    }
  });

  // ── New detectCiCd tests ────────────────────────────────────────────

  it("detects CircleCI", () => {
    const dir = createTempProject({
      ".circleci/config.yml": "version: 2.1\njobs: {}",
    });
    try {
      const result = detectCiCd(dir);
      assert.ok(result.some(d => d.platform === "CircleCI"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects Jenkins", () => {
    const dir = createTempProject({
      "Jenkinsfile": "pipeline { agent any }",
    });
    try {
      const result = detectCiCd(dir);
      assert.ok(result.some(d => d.platform === "Jenkins"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects Travis CI", () => {
    const dir = createTempProject({
      ".travis.yml": "language: node_js",
    });
    try {
      const result = detectCiCd(dir);
      assert.ok(result.some(d => d.platform === "Travis CI"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects Azure Pipelines", () => {
    const dir = createTempProject({
      "azure-pipelines.yml": "trigger:\n- main",
    });
    try {
      const result = detectCiCd(dir);
      assert.ok(result.some(d => d.platform === "Azure Pipelines"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects Netlify", () => {
    const dir = createTempProject({
      "netlify.toml": "[build]\n  command = \"npm run build\"",
    });
    try {
      const result = detectCiCd(dir);
      assert.ok(result.some(d => d.platform === "Netlify"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects docker-compose.yml", () => {
    const dir = createTempProject({
      "docker-compose.yml": "version: '3'\nservices: {}",
    });
    try {
      const result = detectCiCd(dir);
      assert.ok(result.some(d => d.platform === "Docker"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects Terraform", () => {
    const dir = createTempProject({
      "main.tf": 'provider "aws" {}',
    });
    try {
      const result = detectCiCd(dir);
      assert.ok(result.some(d => d.platform === "Terraform"));
    } finally {
      cleanup(dir);
    }
  });

  it("returns configFile for each detection", () => {
    const dir = createTempProject({
      ".gitlab-ci.yml": "stages: []",
    });
    try {
      const result = detectCiCd(dir);
      const gitlab = result.find(d => d.platform === "GitLab CI");
      assert.ok(gitlab);
      assert.strictEqual(gitlab!.configFile, ".gitlab-ci.yml");
    } finally {
      cleanup(dir);
    }
  });

  it("returns features array for each detection", () => {
    const dir = createTempProject({
      "vercel.json": "{}",
    });
    try {
      const result = detectCiCd(dir);
      const vercel = result.find(d => d.platform === "Vercel");
      assert.ok(vercel);
      assert.ok(Array.isArray(vercel!.features));
      assert.ok(vercel!.features.length > 0);
      assert.ok(vercel!.features.includes("Preview deployments"));
    } finally {
      cleanup(dir);
    }
  });

  it("does not duplicate platform when multiple files match same platform", () => {
    const dir = createTempProject({
      "Dockerfile": "FROM node:18",
      "docker-compose.yml": "version: '3'",
    });
    try {
      const result = detectCiCd(dir);
      const dockerCount = result.filter(d => d.platform === "Docker").length;
      assert.strictEqual(dockerCount, 1, "Docker should appear only once");
    } finally {
      cleanup(dir);
    }
  });
});

// ── generateChangeManagementPolicy ───────────────────────────────────

describe("generateChangeManagementPolicy", () => {
  it("always generates a policy (never returns null)", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(typeof result === "string");
    assert.ok(result.includes("# Change Management Policy"));
  });

  it("includes project name", () => {
    const result = generateChangeManagementPolicy(makeScan({ projectName: "my-saas" }));
    assert.ok(result.includes("my-saas"));
  });

  it("includes code review section", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("Code Review"));
    assert.ok(result.includes("Review Checklist"));
  });

  it("includes deployment process section", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("Deployment Approval Process"));
    assert.ok(result.includes("Pre-deployment"));
  });

  it("includes rollback procedures section", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("Rollback Procedures"));
    assert.ok(result.includes("Rollback Triggers"));
  });

  it("includes change log requirements section", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("Change Log Requirements"));
    assert.ok(result.includes("CHANGELOG.md"));
  });

  it("includes change categories", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("Standard"));
    assert.ok(result.includes("Normal"));
    assert.ok(result.includes("Emergency"));
    assert.ok(result.includes("Major"));
  });

  it("includes payment-specific review items when payment detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateChangeManagementPolicy(scan);
    assert.ok(result.includes("PCI DSS"));
  });

  it("includes AI-specific review items when AI detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateChangeManagementPolicy(scan);
    assert.ok(result.includes("AI model") || result.includes("model card"));
  });

  it("includes auth-specific review items when auth detected", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateChangeManagementPolicy(scan);
    assert.ok(result.includes("OWASP") || result.includes("Authentication changes"));
  });

  it("shows detected CI/CD platforms", () => {
    const dir = createTempProject({
      ".github/workflows/ci.yml": "name: CI",
    });
    try {
      const scan = makeScan({ projectPath: dir });
      const result = generateChangeManagementPolicy(scan);
      assert.ok(result.includes("GitHub Actions"));
    } finally {
      cleanup(dir);
    }
  });

  it("recommends CI/CD when none detected", () => {
    const dir = createTempProject({ "src/index.ts": "console.log('hi');" });
    try {
      const scan = makeScan({ projectPath: dir });
      const result = generateChangeManagementPolicy(scan);
      assert.ok(result.includes("strongly recommended") || result.includes("No CI/CD"));
    } finally {
      cleanup(dir);
    }
  });

  it("includes compliance requirements section", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("SOC 2"));
    assert.ok(result.includes("ISO 27001"));
    assert.ok(result.includes("Separation of Duties"));
  });

  it("uses context company name and email", () => {
    const result = generateChangeManagementPolicy(makeScan(), {
      companyName: "Acme Corp",
      contactEmail: "ops@acme.com",
    });
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("ops@acme.com"));
  });

  it("includes codepliant disclaimer", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("does not constitute legal advice"));
  });

  // ── New generateChangeManagementPolicy tests ────────────────────────

  it("includes date in the policy header", () => {
    const result = generateChangeManagementPolicy(makeScan());
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(today));
  });

  it("uses default placeholder for company name when no context", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses default placeholder for contact email when no context", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("includes purpose section", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("## 1. Purpose"));
  });

  it("includes scope section", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("## 2. Scope"));
    assert.ok(result.includes("Application source code"));
    assert.ok(result.includes("Infrastructure configuration"));
    assert.ok(result.includes("Database schemas and migrations"));
  });

  it("scope covers env vars and secrets", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("Environment variables and secrets"));
  });

  it("scope covers CI/CD pipeline configurations", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("CI/CD pipeline configurations"));
  });

  it("includes review standards with minimum reviewers", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("1 peer reviewer"));
    assert.ok(result.includes("2 reviewers"));
  });

  it("includes review response time requirements", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("1 business day"));
    assert.ok(result.includes("4 hours"));
  });

  it("review checklist includes no hardcoded secrets", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("No hardcoded secrets, credentials, or PII"));
  });

  it("review checklist includes backward compatibility", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("backward compatibility"));
  });

  it("review checklist includes logging check", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("Logging does not include sensitive data"));
  });

  it("includes automated checks table", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("Unit tests"));
    assert.ok(result.includes("Integration tests"));
    assert.ok(result.includes("Linting"));
    assert.ok(result.includes("Type checking"));
    assert.ok(result.includes("Security scanning"));
    assert.ok(result.includes("License compliance"));
    assert.ok(result.includes("Build verification"));
  });

  it("includes deployment approval matrix", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("Approval Matrix"));
    assert.ok(result.includes("Automated (CI passes)"));
    assert.ok(result.includes("Team lead approval"));
    assert.ok(result.includes("CTO/VP Engineering"));
  });

  it("includes staging soak times", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("1 hour (Standard)"));
    assert.ok(result.includes("24 hours (Normal)"));
    assert.ok(result.includes("48 hours (Major)"));
  });

  it("rollback triggers include error rate threshold", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("5x"));
  });

  it("rollback triggers include response time threshold", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("3x"));
  });

  it("rollback includes git revert method", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("Git revert"));
  });

  it("rollback includes feature flag method", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("Feature flag"));
  });

  it("rollback includes database rollback method", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("Database rollback"));
  });

  it("change log includes required documentation fields", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("Change ID"));
    assert.ok(result.includes("Author"));
    assert.ok(result.includes("Description"));
    assert.ok(result.includes("Rollback plan"));
    assert.ok(result.includes("Status"));
  });

  it("change log references Keep a Changelog format", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("Keep a Changelog"));
    assert.ok(result.includes("keepachangelog.com"));
  });

  it("compliance section mentions audit trail retention", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("1 year"));
  });

  it("compliance section mentions retroactive review for emergencies", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("retroactive review"));
    assert.ok(result.includes("24 hours"));
  });

  it("compliance section includes GDPR Article 32", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("GDPR Art. 32"));
  });

  it("compliance section includes PCI DSS 6.5", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("PCI DSS 6.5"));
  });

  it("policy review section lists quarterly reviews", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("Quarterly"));
  });

  it("policy review section lists post-failure reviews", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("After a failed deployment"));
  });

  it("includes CI/CD platform table when platforms detected", () => {
    const dir = createTempProject({
      ".github/workflows/ci.yml": "name: CI",
      "Dockerfile": "FROM node:18",
    });
    try {
      const scan = makeScan({ projectPath: dir });
      const result = generateChangeManagementPolicy(scan);
      assert.ok(result.includes("| Platform | Config File | Capabilities |"));
      assert.ok(result.includes("GitHub Actions"));
      assert.ok(result.includes("Docker"));
    } finally {
      cleanup(dir);
    }
  });

  it("payment review checklist includes credit card logging check", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment")],
    });
    const result = generateChangeManagementPolicy(scan);
    assert.ok(result.includes("credit card data"));
    assert.ok(result.includes("plaintext"));
  });

  it("AI review checklist includes data minimization", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai")],
    });
    const result = generateChangeManagementPolicy(scan);
    assert.ok(result.includes("data minimization"));
  });

  it("auth review checklist includes session management", () => {
    const scan = makeScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generateChangeManagementPolicy(scan);
    assert.ok(result.includes("Session management"));
  });

  it("handles all three service types together", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("stripe", "payment"),
        makeService("next-auth", "auth"),
      ],
    });
    const result = generateChangeManagementPolicy(scan);
    assert.ok(result.includes("PCI DSS"));
    assert.ok(result.includes("OWASP") || result.includes("Authentication changes"));
    assert.ok(result.includes("AI model") || result.includes("model card"));
  });

  it("includes GitHub link to Codepliant in footer", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("https://github.com/joechensmartz/codepliant"));
  });

  it("handles project name with special characters", () => {
    const result = generateChangeManagementPolicy(makeScan({ projectName: "my-app_v2.0" }));
    assert.ok(result.includes("my-app_v2.0"));
  });

  it("post-deployment section includes stakeholder notification", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("Notify stakeholders"));
  });

  it("post-deployment section includes monitoring window", () => {
    const result = generateChangeManagementPolicy(makeScan());
    assert.ok(result.includes("1 hour minimum post-deploy"));
  });
});
