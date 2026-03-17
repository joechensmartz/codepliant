import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanGitHubActions } from "./github-actions-scanner.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-gha-test-"));
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(dir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
  }
  return dir;
}

function cleanup(dir: string): void {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("scanGitHubActions", () => {
  it("returns empty for project without .github/workflows", () => {
    const dir = createTempProject({});
    try {
      const result = scanGitHubActions(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("detects upload-artifact action", () => {
    const dir = createTempProject({
      ".github/workflows/ci.yml": [
        "name: CI",
        "on: push",
        "jobs:",
        "  build:",
        "    runs-on: ubuntu-latest",
        "    steps:",
        "      - uses: actions/checkout@v4",
        "      - uses: actions/upload-artifact@v4",
        "        with:",
        "          name: dist",
        "          path: dist/",
      ].join("\n"),
    });
    try {
      const result = scanGitHubActions(dir);
      const artifacts = result.find((s) => s.name === "GitHub Artifacts");
      assert.ok(artifacts, "Should detect GitHub Artifacts from upload-artifact");
      assert.strictEqual(artifacts.category, "storage");
    } finally {
      cleanup(dir);
    }
  });

  it("detects AWS actions", () => {
    const dir = createTempProject({
      ".github/workflows/deploy.yml": [
        "name: Deploy",
        "on: push",
        "jobs:",
        "  deploy:",
        "    runs-on: ubuntu-latest",
        "    steps:",
        "      - uses: aws-actions/configure-aws-credentials@v4",
        "        with:",
        "          role-to-assume: arn:aws:iam::123456:role/deploy",
        "      - uses: aws-actions/amazon-ecr-login@v2",
      ].join("\n"),
    });
    try {
      const result = scanGitHubActions(dir);
      const aws = result.find((s) => s.name === "AWS (via GitHub Actions)");
      assert.ok(aws, "Should detect AWS from aws-actions");
      assert.ok(aws.evidence.length >= 1);
    } finally {
      cleanup(dir);
    }
  });

  it("detects GCP actions", () => {
    const dir = createTempProject({
      ".github/workflows/deploy.yml": [
        "name: Deploy to GCP",
        "on: push",
        "jobs:",
        "  deploy:",
        "    runs-on: ubuntu-latest",
        "    steps:",
        "      - uses: google-github-actions/auth@v2",
        "        with:",
        "          credentials_json: ${{ secrets.GCP_SA_KEY }}",
        "      - uses: google-github-actions/deploy-cloudrun@v2",
      ].join("\n"),
    });
    try {
      const result = scanGitHubActions(dir);
      const gcp = result.find((s) => s.name === "GCP (via GitHub Actions)");
      assert.ok(gcp, "Should detect GCP from google-github-actions");
      assert.ok(gcp.evidence.length >= 1);
    } finally {
      cleanup(dir);
    }
  });

  it("detects AWS from secret references", () => {
    const dir = createTempProject({
      ".github/workflows/ci.yml": [
        "name: CI",
        "on: push",
        "jobs:",
        "  test:",
        "    runs-on: ubuntu-latest",
        "    env:",
        "      AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}",
        "      AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}",
        "    steps:",
        "      - uses: actions/checkout@v4",
        "      - run: npm test",
      ].join("\n"),
    });
    try {
      const result = scanGitHubActions(dir);
      const aws = result.find((s) => s.name === "AWS (via GitHub Actions)");
      assert.ok(aws, "Should detect AWS from secret references");
    } finally {
      cleanup(dir);
    }
  });

  it("detects multiple services across workflow files", () => {
    const dir = createTempProject({
      ".github/workflows/ci.yml": [
        "name: CI",
        "on: push",
        "jobs:",
        "  build:",
        "    runs-on: ubuntu-latest",
        "    steps:",
        "      - uses: actions/upload-artifact@v4",
      ].join("\n"),
      ".github/workflows/deploy.yml": [
        "name: Deploy",
        "on: push",
        "jobs:",
        "  deploy:",
        "    runs-on: ubuntu-latest",
        "    steps:",
        "      - uses: aws-actions/configure-aws-credentials@v4",
        "      - uses: google-github-actions/auth@v2",
      ].join("\n"),
    });
    try {
      const result = scanGitHubActions(dir);
      const names = result.map((s) => s.name);
      assert.ok(names.includes("GitHub Artifacts"), "Should detect artifacts");
      assert.ok(names.includes("AWS (via GitHub Actions)"), "Should detect AWS");
      assert.ok(names.includes("GCP (via GitHub Actions)"), "Should detect GCP");
    } finally {
      cleanup(dir);
    }
  });
});
