import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanCloudProviders } from "./cloud-scanner.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-cloud-"));
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

describe("cloud-scanner", () => {
  it("detects AWS from env vars", () => {
    const dir = createTempProject({
      ".env": `AWS_ACCESS_KEY_ID=AKIA1234567890\nAWS_SECRET_ACCESS_KEY=secret\nAWS_REGION=us-east-1\n`,
    });
    try {
      const result = scanCloudProviders(dir);
      const aws = result.providers.find((p) => p.provider === "aws");
      assert.ok(aws, "Should detect AWS");
      assert.strictEqual(aws.displayName, "Amazon Web Services (AWS)");
      assert.ok(aws.evidence.some((e) => e.type === "env_var"));
      assert.ok(aws.regions.includes("us-east-1"), "Should extract region");
    } finally {
      cleanup(dir);
    }
  });

  it("detects GCP from config file", () => {
    const dir = createTempProject({
      "app.yaml": `runtime: nodejs20\ninstance_class: F1\n`,
    });
    try {
      const result = scanCloudProviders(dir);
      const gcp = result.providers.find((p) => p.provider === "gcp");
      assert.ok(gcp, "Should detect GCP from app.yaml");
      assert.ok(gcp.evidence.some((e) => e.type === "config_file"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects Vercel from vercel.json and dependencies", () => {
    const dir = createTempProject({
      "vercel.json": JSON.stringify({ regions: ["iad1"] }),
      "package.json": JSON.stringify({
        dependencies: { "@vercel/analytics": "^1.0.0", "@vercel/og": "^0.5.0" },
      }),
    });
    try {
      const result = scanCloudProviders(dir);
      const vercel = result.providers.find((p) => p.provider === "vercel");
      assert.ok(vercel, "Should detect Vercel");
      assert.ok(vercel.evidence.length >= 2, "Should have config + dependency evidence");
      assert.ok(vercel.regions.includes("iad1"), "Should extract region from vercel.json");
    } finally {
      cleanup(dir);
    }
  });

  it("detects Fly.io from fly.toml with primary_region", () => {
    const dir = createTempProject({
      "fly.toml": `app = "my-app"\nprimary_region = "lhr"\n\n[http_service]\n  internal_port = 3000\n`,
    });
    try {
      const result = scanCloudProviders(dir);
      const flyio = result.providers.find((p) => p.provider === "fly-io");
      assert.ok(flyio, "Should detect Fly.io");
      assert.ok(flyio.regions.includes("lhr"), "Should extract primary_region");
    } finally {
      cleanup(dir);
    }
  });

  it("detects Azure from package.json dependencies", () => {
    const dir = createTempProject({
      "package.json": JSON.stringify({
        dependencies: { "@azure/storage-blob": "^12.0.0" },
      }),
    });
    try {
      const result = scanCloudProviders(dir);
      const azure = result.providers.find((p) => p.provider === "azure");
      assert.ok(azure, "Should detect Azure from dependency");
    } finally {
      cleanup(dir);
    }
  });

  it("sets crossBorderTransferLikely when multiple providers detected", () => {
    const dir = createTempProject({
      ".env": `AWS_ACCESS_KEY_ID=AKIA123\nFIREBASE_PROJECT_ID=my-project\n`,
    });
    try {
      const result = scanCloudProviders(dir);
      assert.ok(result.providers.length >= 2, "Should detect multiple providers");
      assert.strictEqual(result.crossBorderTransferLikely, true);
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty providers when no cloud indicators found", () => {
    const dir = createTempProject({
      "index.ts": `console.log('hello');\n`,
      "package.json": JSON.stringify({ dependencies: { express: "^4.0.0" } }),
    });
    try {
      const result = scanCloudProviders(dir);
      assert.strictEqual(result.providers.length, 0);
      assert.strictEqual(result.crossBorderTransferLikely, false);
      assert.ok(result.transferNotes.some((n) => n.includes("No cloud providers detected")));
    } finally {
      cleanup(dir);
    }
  });

  it("detects AWS from requirements.txt (Python)", () => {
    const dir = createTempProject({
      "requirements.txt": `boto3==1.28.0\nflask==3.0.0\n`,
    });
    try {
      const result = scanCloudProviders(dir);
      const aws = result.providers.find((p) => p.provider === "aws");
      assert.ok(aws, "Should detect AWS from boto3 in requirements.txt");
    } finally {
      cleanup(dir);
    }
  });
});
