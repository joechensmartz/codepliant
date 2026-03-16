import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanDotnetDependencies } from "./dotnet.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-test-"));
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(dir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
  }
  return dir;
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("scanDotnetDependencies", () => {
  it("detects ConnectionStrings in appsettings.json", () => {
    const dir = createTempProject({
      "appsettings.json": JSON.stringify({
        ConnectionStrings: {
          DefaultConnection: "Server=localhost;Database=mydb;User=sa;Password=secret;"
        }
      }),
    });
    try {
      const result = scanDotnetDependencies(dir);
      assert.ok(result.some(s => s.name === "dotnet-database"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects SendGrid and Stripe in appsettings.json", () => {
    const dir = createTempProject({
      "appsettings.json": JSON.stringify({
        SendGrid: { ApiKey: "SG.xxx" },
        Stripe: { SecretKey: "sk_test_xxx", PublishableKey: "pk_test_xxx" }
      }),
    });
    try {
      const result = scanDotnetDependencies(dir);
      assert.ok(result.some(s => s.name === "sendgrid"));
      assert.ok(result.some(s => s.name === "stripe"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects Azure AD and Application Insights in appsettings.json", () => {
    const dir = createTempProject({
      "appsettings.json": JSON.stringify({
        AzureAd: { TenantId: "xxx", ClientId: "yyy" },
        ApplicationInsights: { InstrumentationKey: "zzz" }
      }),
    });
    try {
      const result = scanDotnetDependencies(dir);
      assert.ok(result.some(s => s.name === "azure-ad"));
      assert.ok(result.some(s => s.name === "azure-app-insights"));
    } finally {
      cleanup(dir);
    }
  });

  it("parses ConnectionStrings section and detects database providers", () => {
    const dir = createTempProject({
      "appsettings.json": JSON.stringify({
        ConnectionStrings: {
          DefaultConnection: "Server=localhost;Database=mydb;User=sa;Password=secret;",
          ReadReplica: "Host=replica.example.com;Port=5432;Database=mydb;Username=reader;Password=secret;"
        }
      }),
    });
    try {
      const result = scanDotnetDependencies(dir);
      assert.ok(result.some(s => s.name === "dotnet-database"), "should detect dotnet-database from ConnectionStrings pattern");
      assert.ok(result.some(s => s.name === "dotnet-connstring-defaultconnection"), "should parse DefaultConnection");
      assert.ok(result.some(s => s.name === "dotnet-connstring-readreplica"), "should parse ReadReplica");
    } finally {
      cleanup(dir);
    }
  });

  it("detects appsettings.json in root directory (not just subdirs)", () => {
    const dir = createTempProject({
      "appsettings.json": JSON.stringify({
        ConnectionStrings: {
          MainDb: "Server=db.prod.example.com;Database=app;User=appuser;Password=secret;"
        },
        Redis: { ConnectionString: "redis.example.com:6379" }
      }),
    });
    try {
      const result = scanDotnetDependencies(dir);
      assert.ok(result.some(s => s.name === "dotnet-database"), "should detect dotnet-database from root appsettings.json");
      assert.ok(result.some(s => s.name === "dotnet-redis"), "should detect dotnet-redis from root appsettings.json");
      const mainDbService = result.find(s => s.name === "dotnet-connstring-maindb");
      assert.ok(mainDbService, "should parse MainDb connection string from root");
      assert.ok(mainDbService!.evidence[0].file === "appsettings.json", "evidence file should be root appsettings.json");
    } finally {
      cleanup(dir);
    }
  });
});
