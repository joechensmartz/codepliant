import * as fs from "fs";
import * as path from "path";
import type { DetectedService, Evidence } from "./types.js";

// Composer package name -> service mapping
const PHP_SIGNATURES: Record<
  string,
  {
    name: string;
    category: DetectedService["category"];
    dataCollected: string[];
  }
> = {
  // Payments
  "stripe/stripe-php": {
    name: "stripe",
    category: "payment",
    dataCollected: ["payment information", "billing address", "email", "transaction history"],
  },

  // Monitoring
  "sentry/sentry-laravel": {
    name: "sentry-laravel",
    category: "monitoring",
    dataCollected: ["error data", "stack traces", "user context", "device information"],
  },

  // Cloud / Storage
  "aws/aws-sdk-php": {
    name: "aws-sdk-php",
    category: "storage",
    dataCollected: ["uploaded files", "file metadata"],
  },
  "google/cloud-storage": {
    name: "google-cloud-storage",
    category: "storage",
    dataCollected: ["uploaded files", "file metadata"],
  },

  // Communications
  "twilio/sdk": {
    name: "twilio",
    category: "other",
    dataCollected: ["phone numbers", "SMS message content", "voice call metadata"],
  },

  // Email / Marketing
  "mailchimp/marketing": {
    name: "mailchimp",
    category: "email",
    dataCollected: ["email addresses", "names", "audience segments", "campaign engagement"],
  },

  // Auth / JWT
  "firebase/php-jwt": {
    name: "firebase-jwt",
    category: "auth",
    dataCollected: ["JWT tokens", "session data"],
  },
  "league/oauth2-client": {
    name: "oauth2-client",
    category: "auth",
    dataCollected: ["email", "name", "OAuth tokens", "profile data"],
  },
  "laravel/socialite": {
    name: "laravel-socialite",
    category: "auth",
    dataCollected: ["email", "name", "OAuth tokens", "social profile data"],
  },

  // Permissions
  "spatie/laravel-permission": {
    name: "laravel-permission",
    category: "auth",
    dataCollected: ["user roles", "permission assignments", "user identity"],
  },

  // Analytics
  "spatie/laravel-analytics": {
    name: "laravel-analytics",
    category: "analytics",
    dataCollected: ["page views", "user behavior", "device information", "IP address"],
  },
};

export function scanPhpDependencies(projectPath: string): DetectedService[] {
  const detected = new Map<string, DetectedService>();

  // Search for composer.json in project root and common subdirectories
  const searchPaths = collectComposerPaths(projectPath);

  for (const composerPath of searchPaths) {
    scanComposerJson(composerPath, path.relative(projectPath, composerPath) || "composer.json", detected);
  }

  // Scan wp-config.php for WordPress services
  scanWpConfig(projectPath, detected);

  // Scan config/*.php for Laravel/Symfony configurations
  scanPhpConfigDir(projectPath, detected);

  // Detect WordPress plugins
  scanWpPlugins(projectPath, detected);

  return Array.from(detected.values());
}

function scanWpConfig(projectPath: string, detected: Map<string, DetectedService>) {
  const wpConfigPath = path.join(projectPath, "wp-config.php");
  if (!fs.existsSync(wpConfigPath)) return;

  let content: string;
  try {
    content = fs.readFileSync(wpConfigPath, "utf-8");
  } catch {
    return;
  }

  const wpPatterns: { pattern: RegExp; name: string; category: DetectedService["category"]; dataCollected: string[] }[] = [
    { pattern: /DB_NAME|DB_USER|DB_PASSWORD|DB_HOST/i, name: "wordpress-database", category: "database", dataCollected: ["database name", "database user", "database host", "user data", "posts", "comments", "user accounts"] },
    { pattern: /WP_MAIL_SMTP|SMTP_HOST|SMTP_PORT|SMTP_USER|SMTP_PASS|WP_MAIL|SMTP|mail\s*\(/i, name: "wordpress-mail", category: "email", dataCollected: ["email addresses", "email content", "SMTP credentials"] },
    { pattern: /WP_CACHE|REDIS_HOST|REDIS_PORT|REDIS_PASSWORD|MEMCACHED|W3TC|WP_REDIS/i, name: "wordpress-cache", category: "database", dataCollected: ["cached data", "session data", "cache host configuration"] },
    { pattern: /AUTH_KEY|SECURE_AUTH_KEY|LOGGED_IN_KEY|NONCE_KEY/i, name: "wordpress-auth", category: "auth", dataCollected: ["authentication tokens", "session data"] },
  ];

  for (const wp of wpPatterns) {
    if (wp.pattern.test(content)) {
      if (!detected.has(wp.name)) {
        detected.set(wp.name, {
          name: wp.name,
          category: wp.category,
          evidence: [{ type: "code_pattern", file: "wp-config.php", detail: `Found ${wp.name} pattern in wp-config.php` }],
          dataCollected: wp.dataCollected,
        });
      }
    }
  }
}

function scanPhpConfigDir(projectPath: string, detected: Map<string, DetectedService>) {
  const configDir = path.join(projectPath, "config");
  if (!fs.existsSync(configDir)) return;

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(configDir, { withFileTypes: true });
  } catch {
    return;
  }

  const configPatterns: { pattern: RegExp; name: string; category: DetectedService["category"]; dataCollected: string[] }[] = [
    { pattern: /['"]driver['"]\s*=>\s*['"](?:mysql|pgsql|sqlite|sqlsrv)['"]/i, name: "laravel-database", category: "database", dataCollected: ["user data as defined in schema", "database records"] },
    { pattern: /['"]mailer['"]\s*=>\s*|['"]transport['"]\s*=>\s*['"]smtp['"]/i, name: "laravel-mail", category: "email", dataCollected: ["email addresses", "email content"] },
    { pattern: /['"]redis['"]\s*=>\s*|predis|phpredis/i, name: "laravel-redis", category: "database", dataCollected: ["cached data", "session data"] },
    { pattern: /['"]s3['"]\s*=>\s*|['"]driver['"]\s*=>\s*['"]s3['"]/i, name: "laravel-s3", category: "storage", dataCollected: ["uploaded files", "file metadata"] },
    { pattern: /['"]stripe['"]\s*=>\s*|STRIPE_KEY|STRIPE_SECRET/i, name: "stripe", category: "payment", dataCollected: ["payment information", "billing address", "email", "transaction history"] },
  ];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".php")) continue;

    const filePath = path.join(configDir, entry.name);
    let content: string;
    try {
      content = fs.readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    for (const cp of configPatterns) {
      if (cp.pattern.test(content) && !detected.has(cp.name)) {
        detected.set(cp.name, {
          name: cp.name,
          category: cp.category,
          evidence: [{ type: "code_pattern", file: `config/${entry.name}`, detail: `Found ${cp.name} config in config/${entry.name}` }],
          dataCollected: cp.dataCollected,
        });
      }
    }
  }
}

function scanWpPlugins(projectPath: string, detected: Map<string, DetectedService>) {
  const pluginsDir = path.join(projectPath, "wp-content", "plugins");
  if (!fs.existsSync(pluginsDir)) return;

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(pluginsDir, { withFileTypes: true });
  } catch {
    return;
  }

  const pluginMap: Record<string, { name: string; category: DetectedService["category"]; dataCollected: string[] }> = {
    "woocommerce": { name: "woocommerce", category: "payment", dataCollected: ["payment information", "billing address", "shipping address", "order history", "customer accounts"] },
    "contact-form-7": { name: "contact-form-7", category: "other", dataCollected: ["form submissions", "email addresses", "names", "message content"] },
    "wp-mail-smtp": { name: "wp-mail-smtp", category: "email", dataCollected: ["email addresses", "email content"] },
    "google-analytics-for-wordpress": { name: "monsterinsights", category: "analytics", dataCollected: ["page views", "user behavior", "device information", "IP address"] },
    "google-site-kit": { name: "google-site-kit", category: "analytics", dataCollected: ["page views", "user behavior", "search analytics"] },
    "wordpress-seo": { name: "yoast-seo", category: "other", dataCollected: ["SEO metadata"] },
    "wpforms-lite": { name: "wpforms", category: "other", dataCollected: ["form submissions", "email addresses", "names"] },
    "elementor": { name: "elementor", category: "other", dataCollected: ["page content"] },
    "akismet": { name: "akismet", category: "other", dataCollected: ["comment content", "IP addresses", "user agents", "email addresses"] },
    "w3-total-cache": { name: "w3-total-cache", category: "database", dataCollected: ["cached page data"] },
    "redis-cache": { name: "wp-redis-cache", category: "database", dataCollected: ["cached data", "session data"] },
  };

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const plugin = pluginMap[entry.name];
    if (plugin && !detected.has(plugin.name)) {
      detected.set(plugin.name, {
        name: plugin.name,
        category: plugin.category,
        evidence: [{ type: "code_pattern", file: `wp-content/plugins/${entry.name}`, detail: `WordPress plugin: ${entry.name}` }],
        dataCollected: plugin.dataCollected,
      });
    }
  }
}

function collectComposerPaths(projectPath: string): string[] {
  const paths: string[] = [];
  const rootComposer = path.join(projectPath, "composer.json");
  if (fs.existsSync(rootComposer)) {
    paths.push(rootComposer);
  }

  // Check common monorepo subdirectories
  try {
    const entries = fs.readdirSync(projectPath, { withFileTypes: true });
    for (const entry of entries) {
      if (
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        !["node_modules", "vendor", "storage", "public", "bootstrap"].includes(entry.name)
      ) {
        const subComposer = path.join(projectPath, entry.name, "composer.json");
        if (fs.existsSync(subComposer)) {
          paths.push(subComposer);
        }
      }
    }
  } catch {
    // ignore directory read errors
  }

  return paths;
}

function scanComposerJson(
  filePath: string,
  relativeFile: string,
  detected: Map<string, DetectedService>
) {
  let content: string;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch {
    return;
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(content);
  } catch {
    return;
  }

  // Scan both require and require-dev
  for (const section of ["require", "require-dev"] as const) {
    const deps = parsed[section];
    if (deps && typeof deps === "object") {
      for (const pkgName of Object.keys(deps as Record<string, string>)) {
        matchPhpPackage(
          pkgName,
          `"${pkgName}": "${(deps as Record<string, string>)[pkgName]}"`,
          relativeFile,
          detected
        );
      }
    }
  }
}

function matchPhpPackage(
  pkgName: string,
  rawLine: string,
  filename: string,
  detected: Map<string, DetectedService>
) {
  const sig = PHP_SIGNATURES[pkgName];
  if (!sig) return;

  const evidence: Evidence = {
    type: "dependency",
    file: filename,
    detail: rawLine.substring(0, 100),
  };

  if (detected.has(sig.name)) {
    detected.get(sig.name)!.evidence.push(evidence);
  } else {
    detected.set(sig.name, {
      name: sig.name,
      category: sig.category,
      evidence: [evidence],
      dataCollected: [...sig.dataCollected],
    });
  }
}
