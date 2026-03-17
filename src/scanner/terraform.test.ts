import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanTerraform } from "./terraform.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-terraform-test-"));
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

describe("scanTerraform", () => {
  it("returns empty when no .tf files exist", () => {
    const dir = createTempProject({
      "main.ts": "console.log('hello');",
    });
    try {
      const result = scanTerraform(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("detects AWS resource types", () => {
    const dir = createTempProject({
      "main.tf": `
resource "aws_s3_bucket" "uploads" {
  bucket = "my-uploads"
}

resource "aws_rds_instance" "db" {
  engine = "postgres"
  instance_class = "db.t3.micro"
}

resource "aws_dynamodb_table" "sessions" {
  name = "sessions"
  hash_key = "id"
}

resource "aws_sqs_queue" "tasks" {
  name = "task-queue"
}

resource "aws_sns_topic" "alerts" {
  name = "alerts"
}

resource "aws_lambda_function" "handler" {
  function_name = "api-handler"
  runtime = "nodejs18.x"
}

resource "aws_cognito_user_pool" "users" {
  name = "app-users"
}
`,
    });
    try {
      const result = scanTerraform(dir);
      const names = result.map((s) => s.name);

      assert.ok(names.includes("aws-s3"), "Should detect aws_s3_bucket");
      assert.ok(names.includes("aws-rds"), "Should detect aws_rds_instance");
      assert.ok(names.includes("aws-dynamodb"), "Should detect aws_dynamodb_table");
      assert.ok(names.includes("aws-sqs"), "Should detect aws_sqs_queue");
      assert.ok(names.includes("aws-sns"), "Should detect aws_sns_topic");
      assert.ok(names.includes("aws-lambda"), "Should detect aws_lambda_function");
      assert.ok(names.includes("aws-cognito"), "Should detect aws_cognito_user_pool");

      // Verify categories
      const s3 = result.find((s) => s.name === "aws-s3");
      assert.ok(s3);
      assert.strictEqual(s3.category, "storage");

      const rds = result.find((s) => s.name === "aws-rds");
      assert.ok(rds);
      assert.strictEqual(rds.category, "database");

      const cognito = result.find((s) => s.name === "aws-cognito");
      assert.ok(cognito);
      assert.strictEqual(cognito.category, "auth");
      assert.ok(cognito.dataCollected.includes("user accounts"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects GCP resource types", () => {
    const dir = createTempProject({
      "infra/gcp.tf": `
resource "google_storage_bucket" "assets" {
  name     = "my-assets"
  location = "US"
}

resource "google_sql_database_instance" "main" {
  database_version = "POSTGRES_14"
}

resource "google_bigquery_dataset" "analytics" {
  dataset_id = "user_analytics"
}

resource "google_cloud_run_service" "api" {
  name     = "api-service"
  location = "us-central1"
}
`,
    });
    try {
      const result = scanTerraform(dir);
      const names = result.map((s) => s.name);

      assert.ok(names.includes("gcp-cloud-storage"), "Should detect google_storage_bucket");
      assert.ok(names.includes("gcp-cloud-sql"), "Should detect google_sql_database_instance");
      assert.ok(names.includes("gcp-bigquery"), "Should detect google_bigquery_dataset");
      assert.ok(names.includes("gcp-cloud-run"), "Should detect google_cloud_run_service");

      const bigquery = result.find((s) => s.name === "gcp-bigquery");
      assert.ok(bigquery);
      assert.strictEqual(bigquery.category, "analytics");
    } finally {
      cleanup(dir);
    }
  });

  it("detects Azure resource types", () => {
    const dir = createTempProject({
      "azure.tf": `
resource "azurerm_storage_account" "main" {
  name                     = "mystorageaccount"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = "eastus"
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_sql_server" "main" {
  name                         = "myserver"
  administrator_login          = "admin"
  administrator_login_password = var.sql_password
}

resource "azurerm_cosmosdb_account" "db" {
  name                = "my-cosmos"
  offer_type          = "Standard"
}

resource "azurerm_redis_cache" "cache" {
  name                = "my-redis"
  capacity            = 1
  family              = "C"
  sku_name            = "Standard"
}
`,
    });
    try {
      const result = scanTerraform(dir);
      const names = result.map((s) => s.name);

      assert.ok(names.includes("azure-storage"), "Should detect azurerm_storage_account");
      assert.ok(names.includes("azure-sql"), "Should detect azurerm_sql_server");
      assert.ok(names.includes("azure-cosmosdb"), "Should detect azurerm_cosmosdb_account");
      assert.ok(names.includes("azure-redis"), "Should detect azurerm_redis_cache");

      const cosmos = result.find((s) => s.name === "azure-cosmosdb");
      assert.ok(cosmos);
      assert.strictEqual(cosmos.category, "database");
    } finally {
      cleanup(dir);
    }
  });

  it("detects provider blocks", () => {
    const dir = createTempProject({
      "providers.tf": `
provider "aws" {
  region = "us-east-1"
}

provider "google" {
  project = "my-project"
  region  = "us-central1"
}

provider "azurerm" {
  features {}
}
`,
    });
    try {
      const result = scanTerraform(dir);
      const names = result.map((s) => s.name);

      assert.ok(names.includes("aws"), "Should detect aws provider");
      assert.ok(names.includes("gcp"), "Should detect google provider");
      assert.ok(names.includes("azure"), "Should detect azurerm provider");
    } finally {
      cleanup(dir);
    }
  });

  it("merges evidence for duplicate resource types", () => {
    const dir = createTempProject({
      "main.tf": `
resource "aws_s3_bucket" "uploads" {
  bucket = "my-uploads"
}

resource "aws_s3_bucket" "backups" {
  bucket = "my-backups"
}

resource "aws_s3_bucket" "logs" {
  bucket = "my-logs"
}
`,
    });
    try {
      const result = scanTerraform(dir);
      const s3Services = result.filter((s) => s.name === "aws-s3");

      assert.strictEqual(s3Services.length, 1, "Should merge into single service");
      assert.strictEqual(s3Services[0].evidence.length, 3, "Should have 3 evidence entries");
    } finally {
      cleanup(dir);
    }
  });

  it("provides correct evidence details", () => {
    const dir = createTempProject({
      "infra/storage.tf": `
resource "aws_s3_bucket" "data" {
  bucket = "my-data"
}
`,
    });
    try {
      const result = scanTerraform(dir);
      const s3 = result.find((s) => s.name === "aws-s3");

      assert.ok(s3);
      assert.strictEqual(s3.evidence.length, 1);
      assert.strictEqual(s3.evidence[0].type, "code_pattern");
      assert.ok(s3.evidence[0].file.includes("infra/storage.tf") || s3.evidence[0].file.endsWith("storage.tf"));
      assert.strictEqual(s3.evidence[0].detail, 'Terraform resource "aws_s3_bucket" "data"');
    } finally {
      cleanup(dir);
    }
  });

  it("handles multi-cloud configurations", () => {
    const dir = createTempProject({
      "main.tf": `
provider "aws" {
  region = "us-east-1"
}

provider "google" {
  project = "my-project"
}

resource "aws_s3_bucket" "uploads" {
  bucket = "uploads"
}

resource "google_storage_bucket" "assets" {
  name     = "assets"
  location = "US"
}

resource "aws_cognito_user_pool" "auth" {
  name = "users"
}

resource "google_bigquery_dataset" "analytics" {
  dataset_id = "events"
}
`,
    });
    try {
      const result = scanTerraform(dir);
      const names = result.map((s) => s.name);

      // Should detect services from both providers
      assert.ok(names.includes("aws-s3"));
      assert.ok(names.includes("gcp-cloud-storage"));
      assert.ok(names.includes("aws-cognito"));
      assert.ok(names.includes("gcp-bigquery"));
      assert.ok(names.includes("aws"));
      assert.ok(names.includes("gcp"));

      // Should have at least storage, database/analytics, auth categories
      const categories = new Set(result.map((s) => s.category));
      assert.ok(categories.has("storage"));
      assert.ok(categories.has("analytics"));
      assert.ok(categories.has("auth"));
    } finally {
      cleanup(dir);
    }
  });

  it("scans nested directories for .tf files", () => {
    const dir = createTempProject({
      "terraform/modules/storage/main.tf": `
resource "aws_s3_bucket" "deep" {
  bucket = "deeply-nested"
}
`,
      "terraform/modules/database/main.tf": `
resource "aws_rds_instance" "deep" {
  engine = "mysql"
}
`,
    });
    try {
      const result = scanTerraform(dir);
      const names = result.map((s) => s.name);

      assert.ok(names.includes("aws-s3"), "Should find deeply nested S3");
      assert.ok(names.includes("aws-rds"), "Should find deeply nested RDS");
    } finally {
      cleanup(dir);
    }
  });

  it("skips .terraform directory", () => {
    const dir = createTempProject({
      ".terraform/modules/something/main.tf": `
resource "aws_s3_bucket" "cached" {
  bucket = "should-not-detect"
}
`,
      "main.tf": `
resource "aws_rds_instance" "db" {
  engine = "postgres"
}
`,
    });
    try {
      const result = scanTerraform(dir);
      const names = result.map((s) => s.name);

      assert.ok(!names.includes("aws-s3"), "Should NOT detect resources from .terraform/");
      assert.ok(names.includes("aws-rds"), "Should detect resources from project root");
    } finally {
      cleanup(dir);
    }
  });

  it("ignores unrecognized resource types", () => {
    const dir = createTempProject({
      "main.tf": `
resource "aws_s3_bucket" "known" {
  bucket = "known"
}

resource "aws_vpc" "network" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_iam_role" "role" {
  name = "my-role"
}
`,
    });
    try {
      const result = scanTerraform(dir);
      const names = result.map((s) => s.name);

      assert.ok(names.includes("aws-s3"), "Should detect known resource");
      assert.ok(!names.some((n) => n.includes("vpc")), "Should NOT detect aws_vpc");
      assert.ok(!names.some((n) => n.includes("iam")), "Should NOT detect aws_iam_role");
    } finally {
      cleanup(dir);
    }
  });

  it("sets isDataProcessor correctly", () => {
    const dir = createTempProject({
      "main.tf": `
resource "aws_s3_bucket" "data" {
  bucket = "user-data"
}

resource "aws_lambda_function" "handler" {
  function_name = "my-handler"
}

resource "aws_cognito_user_pool" "users" {
  name = "my-users"
}
`,
    });
    try {
      const result = scanTerraform(dir);

      const s3 = result.find((s) => s.name === "aws-s3");
      assert.ok(s3);
      assert.strictEqual(s3.isDataProcessor, undefined, "S3 should be a data processor (default)");

      const lambda = result.find((s) => s.name === "aws-lambda");
      assert.ok(lambda);
      assert.strictEqual(lambda.isDataProcessor, false, "Lambda should not be a data processor");

      const cognito = result.find((s) => s.name === "aws-cognito");
      assert.ok(cognito);
      assert.strictEqual(cognito.isDataProcessor, undefined, "Cognito should be a data processor (default)");
    } finally {
      cleanup(dir);
    }
  });
});
