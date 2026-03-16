import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanPhpDependencies } from "./php.js";

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

describe("scanPhpDependencies", () => {
  it("detects WordPress DB and auth from wp-config.php", () => {
    const dir = createTempProject({
      "wp-config.php": [
        "<?php",
        "define('DB_NAME', 'wordpress');",
        "define('DB_USER', 'root');",
        "define('DB_PASSWORD', 'secret');",
        "define('DB_HOST', 'localhost');",
        "define('AUTH_KEY', 'some-key');",
      ].join("\n"),
    });
    try {
      const result = scanPhpDependencies(dir);
      assert.ok(result.some(s => s.name === "wordpress-database"));
      assert.ok(result.some(s => s.name === "wordpress-auth"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects Laravel database and mail config in config/*.php", () => {
    const dir = createTempProject({
      "config/database.php": "<?php\nreturn [\n    'default' => 'mysql',\n    'connections' => [\n        'mysql' => [\n            'driver' => 'mysql',\n        ],\n    ],\n];",
      "config/mail.php": "<?php\nreturn [\n    'mailer' => 'smtp',\n    'transport' => 'smtp',\n];",
    });
    try {
      const result = scanPhpDependencies(dir);
      assert.ok(result.some(s => s.name === "laravel-database"));
      assert.ok(result.some(s => s.name === "laravel-mail"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects WordPress DB settings from wp-config.php (DB_NAME, DB_USER, DB_HOST)", () => {
    const dir = createTempProject({
      "wp-config.php": [
        "<?php",
        "define('DB_NAME', 'wp_production');",
        "define('DB_USER', 'wp_admin');",
        "define('DB_HOST', 'db.example.com');",
      ].join("\n"),
    });
    try {
      const result = scanPhpDependencies(dir);
      const dbService = result.find(s => s.name === "wordpress-database");
      assert.ok(dbService, "should detect wordpress-database");
      assert.ok(dbService!.dataCollected.includes("database name"));
      assert.ok(dbService!.dataCollected.includes("database user"));
      assert.ok(dbService!.dataCollected.includes("database host"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects WordPress SMTP settings (WP_MAIL_SMTP, SMTP_HOST)", () => {
    const dir = createTempProject({
      "wp-config.php": [
        "<?php",
        "define('WP_MAIL_SMTP', true);",
        "define('SMTP_HOST', 'smtp.example.com');",
        "define('SMTP_PORT', '587');",
      ].join("\n"),
    });
    try {
      const result = scanPhpDependencies(dir);
      const mailService = result.find(s => s.name === "wordpress-mail");
      assert.ok(mailService, "should detect wordpress-mail from SMTP settings");
      assert.ok(mailService!.dataCollected.includes("SMTP credentials"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects WordPress cache settings (WP_CACHE, REDIS_HOST)", () => {
    const dir = createTempProject({
      "wp-config.php": [
        "<?php",
        "define('WP_CACHE', true);",
        "define('REDIS_HOST', 'redis.example.com');",
        "define('REDIS_PORT', '6379');",
      ].join("\n"),
    });
    try {
      const result = scanPhpDependencies(dir);
      const cacheService = result.find(s => s.name === "wordpress-cache");
      assert.ok(cacheService, "should detect wordpress-cache from REDIS_HOST");
      assert.ok(cacheService!.dataCollected.includes("cache host configuration"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects WordPress plugins in wp-content/plugins", () => {
    const dir = createTempProject({
      "wp-content/plugins/woocommerce/woocommerce.php": "<?php // WooCommerce",
      "wp-content/plugins/contact-form-7/wp-contact-form-7.php": "<?php // CF7",
      "wp-content/plugins/akismet/akismet.php": "<?php // Akismet",
    });
    try {
      const result = scanPhpDependencies(dir);
      assert.ok(result.some(s => s.name === "woocommerce"));
      assert.ok(result.some(s => s.name === "contact-form-7"));
      assert.ok(result.some(s => s.name === "akismet"));
    } finally {
      cleanup(dir);
    }
  });
});
