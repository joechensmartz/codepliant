import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanCiCd } from "./ci-cd-scanner.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-cicd-"));
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

describe("ci-cd-scanner", () => {
  it("returns empty result for a project with no CI/CD config", () => {
    const dir = createTempProject({ "index.ts": "console.log('hello');" });
    try {
      const result = scanCiCd(dir);
      assert.strictEqual(result.platforms.length, 0);
      assert.strictEqual(result.hasVersionControl, false);
      assert.strictEqual(result.vcsProvider, null);
      assert.strictEqual(result.hasAutomatedTests, false);
      assert.strictEqual(result.hasDeploymentPipeline, false);
      assert.strictEqual(result.hasSecurityScanning, false);
      assert.strictEqual(result.hasDependencyUpdates, false);
    } finally {
      cleanup(dir);
    }
  });

  it("detects GitHub Actions with workflow files", () => {
    const dir = createTempProject({
      ".github/workflows/ci.yml": `name: CI\non:\n  push:\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm test`,
    });
    try {
      const result = scanCiCd(dir);
      const gh = result.platforms.find((p) => p.name === "GitHub Actions");
      assert.ok(gh, "Should detect GitHub Actions");
      assert.strictEqual(gh.configFile, ".github/workflows");
      assert.ok(gh.features.includes("Automated workflows"));
      assert.ok(gh.detail?.some((d) => d.includes("CI")));
      assert.strictEqual(result.hasDeploymentPipeline, true);
      assert.strictEqual(result.hasAutomatedTests, true);
    } finally {
      cleanup(dir);
    }
  });

  it("extracts workflow names from GitHub Actions YAML", () => {
    const dir = createTempProject({
      ".github/workflows/deploy.yml": `name: Deploy to Production\non:\n  push:\n    branches: [main]\njobs:\n  deploy:\n    runs-on: ubuntu-latest`,
      ".github/workflows/lint.yml": `name: Lint & Format\non:\n  pull_request:\njobs:\n  lint:\n    runs-on: ubuntu-latest`,
    });
    try {
      const result = scanCiCd(dir);
      const gh = result.platforms.find((p) => p.name === "GitHub Actions");
      assert.ok(gh);
      assert.ok(gh.detail?.some((d) => d.includes("Deploy to Production")));
      assert.ok(gh.detail?.some((d) => d.includes("Lint & Format")));
    } finally {
      cleanup(dir);
    }
  });

  it("falls back to filename when workflow has no name field", () => {
    const dir = createTempProject({
      ".github/workflows/build.yml": `on:\n  push:\njobs:\n  build:\n    runs-on: ubuntu-latest`,
    });
    try {
      const result = scanCiCd(dir);
      const gh = result.platforms.find((p) => p.name === "GitHub Actions");
      assert.ok(gh);
      assert.ok(gh.detail?.some((d) => d.includes("build")));
    } finally {
      cleanup(dir);
    }
  });

  it("detects automated tests in GitHub Actions workflows", () => {
    const dir = createTempProject({
      ".github/workflows/test.yml": `name: Tests\non:\n  push:\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - run: jest --ci`,
    });
    try {
      const result = scanCiCd(dir);
      assert.strictEqual(result.hasAutomatedTests, true);
    } finally {
      cleanup(dir);
    }
  });

  it("detects security scanning in GitHub Actions workflows", () => {
    const dir = createTempProject({
      ".github/workflows/security.yml": `name: Security\non:\n  push:\njobs:\n  scan:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: github/codeql-action/analyze@v2`,
    });
    try {
      const result = scanCiCd(dir);
      assert.strictEqual(result.hasSecurityScanning, true);
    } finally {
      cleanup(dir);
    }
  });

  it("detects Dependabot config for dependency updates", () => {
    const dir = createTempProject({
      ".github/workflows/ci.yml": `name: CI\non:\n  push:\njobs:\n  test:\n    runs-on: ubuntu-latest`,
      ".github/dependabot.yml": `version: 2\nupdates:\n  - package-ecosystem: npm\n    directory: /\n    schedule:\n      interval: weekly`,
    });
    try {
      const result = scanCiCd(dir);
      assert.strictEqual(result.hasDependencyUpdates, true);
    } finally {
      cleanup(dir);
    }
  });

  it("detects GitLab CI", () => {
    const dir = createTempProject({
      ".gitlab-ci.yml": `stages:\n  - test\n  - deploy\ntest:\n  stage: test\n  script:\n    - npm test`,
    });
    try {
      const result = scanCiCd(dir);
      const gl = result.platforms.find((p) => p.name === "GitLab CI");
      assert.ok(gl, "Should detect GitLab CI");
      assert.strictEqual(gl.configFile, ".gitlab-ci.yml");
      assert.ok(gl.features.includes("Pipeline stages"));
      assert.strictEqual(result.hasDeploymentPipeline, true);
      assert.strictEqual(result.hasAutomatedTests, true);
    } finally {
      cleanup(dir);
    }
  });

  it("detects security scanning in GitLab CI config", () => {
    const dir = createTempProject({
      ".gitlab-ci.yml": `stages:\n  - test\nsast:\n  stage: test\n  script:\n    - semgrep --config auto`,
    });
    try {
      const result = scanCiCd(dir);
      assert.strictEqual(result.hasSecurityScanning, true);
    } finally {
      cleanup(dir);
    }
  });

  it("detects CircleCI", () => {
    const dir = createTempProject({
      ".circleci/config.yml": `version: 2.1\njobs:\n  build:\n    docker:\n      - image: node:18\n    steps:\n      - run: npm test`,
    });
    try {
      const result = scanCiCd(dir);
      const ci = result.platforms.find((p) => p.name === "CircleCI");
      assert.ok(ci, "Should detect CircleCI");
      assert.strictEqual(ci.configFile, ".circleci/config.yml");
      assert.strictEqual(result.hasDeploymentPipeline, true);
      assert.strictEqual(result.hasAutomatedTests, true);
    } finally {
      cleanup(dir);
    }
  });

  it("detects Jenkins", () => {
    const dir = createTempProject({
      "Jenkinsfile": `pipeline {\n  agent any\n  stages {\n    stage('Test') {\n      steps {\n        sh 'npm test'\n      }\n    }\n  }\n}`,
    });
    try {
      const result = scanCiCd(dir);
      const jk = result.platforms.find((p) => p.name === "Jenkins");
      assert.ok(jk, "Should detect Jenkins");
      assert.strictEqual(jk.configFile, "Jenkinsfile");
      assert.strictEqual(result.hasDeploymentPipeline, true);
      assert.strictEqual(result.hasAutomatedTests, true);
    } finally {
      cleanup(dir);
    }
  });

  it("detects Travis CI", () => {
    const dir = createTempProject({
      ".travis.yml": `language: node_js\nnode_js:\n  - 18\nscript:\n  - npm test`,
    });
    try {
      const result = scanCiCd(dir);
      const tr = result.platforms.find((p) => p.name === "Travis CI");
      assert.ok(tr, "Should detect Travis CI");
      assert.strictEqual(tr.configFile, ".travis.yml");
    } finally {
      cleanup(dir);
    }
  });

  it("detects Azure Pipelines", () => {
    const dir = createTempProject({
      "azure-pipelines.yml": `trigger:\n  - main\npool:\n  vmImage: ubuntu-latest\nsteps:\n  - script: npm test`,
    });
    try {
      const result = scanCiCd(dir);
      const az = result.platforms.find((p) => p.name === "Azure Pipelines");
      assert.ok(az, "Should detect Azure Pipelines");
      assert.strictEqual(az.configFile, "azure-pipelines.yml");
    } finally {
      cleanup(dir);
    }
  });

  it("detects Vercel and sets hasDeploymentPipeline", () => {
    const dir = createTempProject({
      "vercel.json": `{"buildCommand": "npm run build"}`,
    });
    try {
      const result = scanCiCd(dir);
      const v = result.platforms.find((p) => p.name === "Vercel");
      assert.ok(v, "Should detect Vercel");
      assert.strictEqual(result.hasDeploymentPipeline, true);
    } finally {
      cleanup(dir);
    }
  });

  it("detects Netlify and sets hasDeploymentPipeline", () => {
    const dir = createTempProject({
      "netlify.toml": `[build]\n  command = "npm run build"\n  publish = "dist"`,
    });
    try {
      const result = scanCiCd(dir);
      const n = result.platforms.find((p) => p.name === "Netlify");
      assert.ok(n, "Should detect Netlify");
      assert.strictEqual(result.hasDeploymentPipeline, true);
    } finally {
      cleanup(dir);
    }
  });

  it("detects Docker", () => {
    const dir = createTempProject({
      "Dockerfile": `FROM node:18\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD ["node", "dist/index.js"]`,
    });
    try {
      const result = scanCiCd(dir);
      const d = result.platforms.find((p) => p.name === "Docker");
      assert.ok(d, "Should detect Docker");
      assert.strictEqual(d.configFile, "Dockerfile");
      assert.strictEqual(result.hasDeploymentPipeline, true);
    } finally {
      cleanup(dir);
    }
  });

  it("detects docker-compose.yml as Docker", () => {
    const dir = createTempProject({
      "docker-compose.yml": `version: '3'\nservices:\n  web:\n    build: .`,
    });
    try {
      const result = scanCiCd(dir);
      const d = result.platforms.find((p) => p.name === "Docker");
      assert.ok(d, "Should detect Docker via docker-compose.yml");
    } finally {
      cleanup(dir);
    }
  });

  it("detects Kubernetes directory", () => {
    const dir = createTempProject({
      "k8s/deployment.yaml": `apiVersion: apps/v1\nkind: Deployment`,
    });
    try {
      const result = scanCiCd(dir);
      const k = result.platforms.find((p) => p.name === "Kubernetes");
      assert.ok(k, "Should detect Kubernetes");
      assert.strictEqual(result.hasDeploymentPipeline, true);
    } finally {
      cleanup(dir);
    }
  });

  it("detects Terraform", () => {
    const dir = createTempProject({
      "main.tf": `resource "aws_instance" "web" {\n  ami = "ami-123"\n  instance_type = "t3.micro"\n}`,
    });
    try {
      const result = scanCiCd(dir);
      const tf = result.platforms.find((p) => p.name === "Terraform");
      assert.ok(tf, "Should detect Terraform");
      assert.strictEqual(tf.configFile, "main.tf");
    } finally {
      cleanup(dir);
    }
  });

  it("detects Bitbucket Pipelines", () => {
    const dir = createTempProject({
      "bitbucket-pipelines.yml": `pipelines:\n  default:\n    - step:\n        script:\n          - npm test`,
    });
    try {
      const result = scanCiCd(dir);
      const bb = result.platforms.find((p) => p.name === "Bitbucket Pipelines");
      assert.ok(bb, "Should detect Bitbucket Pipelines");
    } finally {
      cleanup(dir);
    }
  });

  it("detects AWS CodePipeline via buildspec.yml", () => {
    const dir = createTempProject({
      "buildspec.yml": `version: 0.2\nphases:\n  build:\n    commands:\n      - npm run build`,
    });
    try {
      const result = scanCiCd(dir);
      const aws = result.platforms.find((p) => p.name === "AWS CodePipeline");
      assert.ok(aws, "Should detect AWS CodePipeline");
    } finally {
      cleanup(dir);
    }
  });

  it("detects multiple platforms in the same project", () => {
    const dir = createTempProject({
      ".github/workflows/ci.yml": `name: CI\non:\n  push:\njobs:\n  test:\n    runs-on: ubuntu-latest`,
      "Dockerfile": `FROM node:18`,
      "vercel.json": `{}`,
    });
    try {
      const result = scanCiCd(dir);
      const names = result.platforms.map((p) => p.name);
      assert.ok(names.includes("GitHub Actions"));
      assert.ok(names.includes("Docker"));
      assert.ok(names.includes("Vercel"));
      assert.ok(result.platforms.length >= 3);
    } finally {
      cleanup(dir);
    }
  });

  it("detects Git version control", () => {
    const dir = createTempProject({
      ".git/HEAD": `ref: refs/heads/main`,
    });
    try {
      const result = scanCiCd(dir);
      assert.strictEqual(result.hasVersionControl, true);
      assert.strictEqual(result.vcsProvider, "Git");
    } finally {
      cleanup(dir);
    }
  });

  it("detects GitHub as VCS provider when .github exists", () => {
    const dir = createTempProject({
      ".git/HEAD": `ref: refs/heads/main`,
      ".github/CODEOWNERS": `* @owner`,
    });
    try {
      const result = scanCiCd(dir);
      assert.strictEqual(result.hasVersionControl, true);
      assert.strictEqual(result.vcsProvider, "GitHub");
    } finally {
      cleanup(dir);
    }
  });

  it("detects GitLab as VCS provider when .gitlab-ci.yml exists", () => {
    const dir = createTempProject({
      ".git/HEAD": `ref: refs/heads/main`,
      ".gitlab-ci.yml": `stages:\n  - build`,
    });
    try {
      const result = scanCiCd(dir);
      assert.strictEqual(result.hasVersionControl, true);
      assert.strictEqual(result.vcsProvider, "GitLab");
    } finally {
      cleanup(dir);
    }
  });

  it("detects Renovate config for dependency updates", () => {
    const dir = createTempProject({
      "renovate.json": `{"$schema": "https://docs.renovatebot.com/renovate-schema.json"}`,
    });
    try {
      const result = scanCiCd(dir);
      assert.strictEqual(result.hasDependencyUpdates, true);
    } finally {
      cleanup(dir);
    }
  });

  it("detects .renovaterc for dependency updates", () => {
    const dir = createTempProject({
      ".renovaterc": `{"extends": ["config:base"]}`,
    });
    try {
      const result = scanCiCd(dir);
      assert.strictEqual(result.hasDependencyUpdates, true);
    } finally {
      cleanup(dir);
    }
  });

  it("skips non-YAML files in .github/workflows", () => {
    const dir = createTempProject({
      ".github/workflows/ci.yml": `name: CI\non:\n  push:\njobs:\n  test:\n    runs-on: ubuntu-latest`,
      ".github/workflows/README.md": `# Workflows documentation`,
    });
    try {
      const result = scanCiCd(dir);
      const gh = result.platforms.find((p) => p.name === "GitHub Actions");
      assert.ok(gh);
      // Only CI workflow should appear, not the README
      assert.strictEqual(gh.detail?.length, 1);
      assert.ok(gh.detail?.[0].includes("CI"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects vitest as automated test pattern", () => {
    const dir = createTempProject({
      ".github/workflows/test.yml": `name: Test\non:\n  push:\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - run: vitest run`,
    });
    try {
      const result = scanCiCd(dir);
      assert.strictEqual(result.hasAutomatedTests, true);
    } finally {
      cleanup(dir);
    }
  });

  it("detects snyk as security scanning in GitHub Actions", () => {
    const dir = createTempProject({
      ".github/workflows/security.yml": `name: Snyk\non:\n  push:\njobs:\n  scan:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: snyk/actions/node@master`,
    });
    try {
      const result = scanCiCd(dir);
      assert.strictEqual(result.hasSecurityScanning, true);
    } finally {
      cleanup(dir);
    }
  });

  it("detects Dependabot YAML variant", () => {
    const dir = createTempProject({
      ".github/workflows/ci.yml": `name: CI\non:\n  push:\njobs:\n  test:\n    runs-on: ubuntu-latest`,
      ".github/dependabot.yaml": `version: 2\nupdates:\n  - package-ecosystem: npm`,
    });
    try {
      const result = scanCiCd(dir);
      assert.strictEqual(result.hasDependencyUpdates, true);
    } finally {
      cleanup(dir);
    }
  });
});
