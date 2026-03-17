import * as fs from "fs";
import * as path from "path";
import type { DetectedService, Evidence, ServiceCategory } from "./types.js";

/**
 * Mapping from Django INSTALLED_APPS entries to detected services.
 * Keys are matched as substrings against each entry in INSTALLED_APPS.
 */
const INSTALLED_APPS_SIGNATURES: Record<
  string,
  {
    serviceName: string;
    category: ServiceCategory;
    dataCollected: string[];
    isDataProcessor?: boolean;
  }
> = {
  "django.contrib.auth": {
    serviceName: "django.contrib.auth",
    category: "auth",
    dataCollected: ["user accounts", "passwords", "session data", "permissions", "groups"],
  },
  "django.contrib.sessions": {
    serviceName: "django.contrib.sessions",
    category: "auth",
    dataCollected: ["session data", "session cookies"],
    isDataProcessor: false,
  },
  "django.contrib.admin": {
    serviceName: "django.contrib.admin",
    category: "auth",
    dataCollected: ["admin panel access logs", "admin user activity"],
    isDataProcessor: false,
  },
  allauth: {
    serviceName: "django-allauth",
    category: "auth",
    dataCollected: ["email", "name", "OAuth tokens", "session data", "social account data"],
  },
  rest_framework: {
    serviceName: "djangorestframework",
    category: "other",
    dataCollected: ["API request data", "authentication tokens", "user input"],
  },
  corsheaders: {
    serviceName: "django-cors-headers",
    category: "other",
    dataCollected: ["cross-origin request data", "allowed origins"],
    isDataProcessor: false,
  },
  storages: {
    serviceName: "django-storages",
    category: "storage",
    dataCollected: ["uploaded files", "file metadata"],
  },
  django_celery_beat: {
    serviceName: "django-celery-beat",
    category: "other",
    dataCollected: ["scheduled task data", "periodic task metadata"],
    isDataProcessor: false,
  },
  django_celery_results: {
    serviceName: "django-celery-results",
    category: "other",
    dataCollected: ["task results", "task metadata"],
    isDataProcessor: false,
  },
  debug_toolbar: {
    serviceName: "django-debug-toolbar",
    category: "monitoring",
    dataCollected: ["SQL queries", "request data", "performance profiling data"],
    isDataProcessor: false,
  },
  django_extensions: {
    serviceName: "django-extensions",
    category: "other",
    dataCollected: [],
    isDataProcessor: false,
  },
  "django.contrib.sites": {
    serviceName: "django.contrib.sites",
    category: "other",
    dataCollected: ["site domain configuration"],
    isDataProcessor: false,
  },
  import_export: {
    serviceName: "django-import-export",
    category: "other",
    dataCollected: ["imported/exported data", "user data in bulk operations"],
  },
  django_filters: {
    serviceName: "django-filter",
    category: "other",
    dataCollected: ["user filter/search queries"],
    isDataProcessor: false,
  },
  oauth2_provider: {
    serviceName: "django-oauth-toolkit",
    category: "auth",
    dataCollected: ["OAuth tokens", "client credentials", "authorization grants"],
  },
  social_django: {
    serviceName: "social-auth-app-django",
    category: "auth",
    dataCollected: ["social login data", "OAuth tokens", "social profile information"],
  },
  axes: {
    serviceName: "django-axes",
    category: "auth",
    dataCollected: ["failed login attempts", "IP addresses", "user agent strings"],
  },
  defender: {
    serviceName: "django-defender",
    category: "auth",
    dataCollected: ["failed login attempts", "IP addresses", "blocked IPs"],
  },
  health_check: {
    serviceName: "django-health-check",
    category: "monitoring",
    dataCollected: ["system health status"],
    isDataProcessor: false,
  },
  cacheops: {
    serviceName: "django-cacheops",
    category: "database",
    dataCollected: ["cached query results", "cached data"],
    isDataProcessor: false,
  },
  channels: {
    serviceName: "django-channels",
    category: "other",
    dataCollected: ["WebSocket connections", "real-time messages", "connection metadata"],
  },
  "django.contrib.postgres": {
    serviceName: "django.contrib.postgres",
    category: "database",
    dataCollected: ["user data stored in PostgreSQL"],
    isDataProcessor: false,
  },
};

/**
 * Mapping from Django MIDDLEWARE entries to detected services.
 */
const MIDDLEWARE_SIGNATURES: Record<
  string,
  {
    serviceName: string;
    category: ServiceCategory;
    dataCollected: string[];
    isDataProcessor?: boolean;
  }
> = {
  "django.middleware.csrf.CsrfViewMiddleware": {
    serviceName: "django-csrf-protection",
    category: "auth",
    dataCollected: ["CSRF tokens"],
    isDataProcessor: false,
  },
  "corsheaders.middleware.CorsMiddleware": {
    serviceName: "django-cors-headers",
    category: "other",
    dataCollected: ["cross-origin request data", "allowed origins"],
    isDataProcessor: false,
  },
  "django.contrib.sessions.middleware.SessionMiddleware": {
    serviceName: "django.contrib.sessions",
    category: "auth",
    dataCollected: ["session data", "session cookies"],
    isDataProcessor: false,
  },
  "django.contrib.auth.middleware.AuthenticationMiddleware": {
    serviceName: "django.contrib.auth",
    category: "auth",
    dataCollected: ["user accounts", "authentication state"],
    isDataProcessor: false,
  },
  "debug_toolbar.middleware.DebugToolbarMiddleware": {
    serviceName: "django-debug-toolbar",
    category: "monitoring",
    dataCollected: ["SQL queries", "request data", "performance profiling data"],
    isDataProcessor: false,
  },
  "axes.middleware.AxesMiddleware": {
    serviceName: "django-axes",
    category: "auth",
    dataCollected: ["failed login attempts", "IP addresses", "user agent strings"],
  },
  "whitenoise.middleware.WhiteNoiseMiddleware": {
    serviceName: "whitenoise",
    category: "other",
    dataCollected: ["static file access logs"],
    isDataProcessor: false,
  },
};

/**
 * Database engine patterns and what they indicate.
 */
const DATABASE_ENGINE_SIGNATURES: Record<
  string,
  {
    serviceName: string;
    category: ServiceCategory;
    dataCollected: string[];
  }
> = {
  "django.db.backends.postgresql": {
    serviceName: "postgresql",
    category: "database",
    dataCollected: ["user data as defined in schema"],
  },
  "django.db.backends.mysql": {
    serviceName: "mysql",
    category: "database",
    dataCollected: ["user data as defined in schema"],
  },
  "django.db.backends.sqlite3": {
    serviceName: "sqlite",
    category: "database",
    dataCollected: ["user data as defined in schema"],
  },
  "django.db.backends.oracle": {
    serviceName: "oracle",
    category: "database",
    dataCollected: ["user data as defined in schema"],
  },
  "django.contrib.gis.db.backends.postgis": {
    serviceName: "postgis",
    category: "database",
    dataCollected: ["user data as defined in schema", "geographic/location data"],
  },
};

/**
 * Email backend patterns.
 */
const EMAIL_BACKEND_SIGNATURES: Record<
  string,
  {
    serviceName: string;
    category: ServiceCategory;
    dataCollected: string[];
  }
> = {
  "django.core.mail.backends.smtp.EmailBackend": {
    serviceName: "django-smtp-email",
    category: "email",
    dataCollected: ["email addresses", "email content"],
  },
  "anymail.backends.sendgrid.EmailBackend": {
    serviceName: "sendgrid",
    category: "email",
    dataCollected: ["email addresses", "email content"],
  },
  "anymail.backends.mailgun.EmailBackend": {
    serviceName: "mailgun",
    category: "email",
    dataCollected: ["email addresses", "email content"],
  },
  "anymail.backends.amazon_ses.EmailBackend": {
    serviceName: "aws-ses",
    category: "email",
    dataCollected: ["email addresses", "email content"],
  },
  "anymail.backends.postmark.EmailBackend": {
    serviceName: "postmark",
    category: "email",
    dataCollected: ["email addresses", "email content"],
  },
  "anymail.backends.sparkpost.EmailBackend": {
    serviceName: "sparkpost",
    category: "email",
    dataCollected: ["email addresses", "email content"],
  },
};

/**
 * Cache backend patterns.
 */
const CACHE_BACKEND_SIGNATURES: Record<
  string,
  {
    serviceName: string;
    category: ServiceCategory;
    dataCollected: string[];
    isDataProcessor?: boolean;
  }
> = {
  "django_redis.cache.RedisCache": {
    serviceName: "django-redis",
    category: "database",
    dataCollected: ["cached data", "session data"],
    isDataProcessor: false,
  },
  "django.core.cache.backends.redis.RedisCache": {
    serviceName: "django-redis",
    category: "database",
    dataCollected: ["cached data", "session data"],
    isDataProcessor: false,
  },
  "django.core.cache.backends.memcached.PyMemcacheCache": {
    serviceName: "memcached",
    category: "database",
    dataCollected: ["cached data", "session data"],
    isDataProcessor: false,
  },
  "django.core.cache.backends.memcached.MemcachedCache": {
    serviceName: "memcached",
    category: "database",
    dataCollected: ["cached data", "session data"],
    isDataProcessor: false,
  },
  "django_redis.cache.ShardClient": {
    serviceName: "django-redis",
    category: "database",
    dataCollected: ["cached data", "session data"],
    isDataProcessor: false,
  },
};

interface SettingsDetection {
  serviceName: string;
  category: ServiceCategory;
  dataCollected: string[];
  evidence: Evidence;
  isDataProcessor?: boolean;
}

/**
 * Scans Django settings.py files for INSTALLED_APPS, MIDDLEWARE, DATABASES,
 * EMAIL_BACKEND, CACHES, and AUTH_USER_MODEL to detect services and
 * data processing patterns.
 */
export function scanDjangoSettings(projectPath: string): DetectedService[] {
  const settingsFiles = findDjangoSettingsFiles(projectPath);

  if (settingsFiles.length === 0) {
    return [];
  }

  const detections: SettingsDetection[] = [];

  for (const filePath of settingsFiles) {
    let content: string;
    try {
      content = fs.readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    const relPath = path.relative(projectPath, filePath);

    detections.push(...parseInstalledApps(content, relPath));
    detections.push(...parseMiddleware(content, relPath));
    detections.push(...parseDatabases(content, relPath));
    detections.push(...parseEmailBackend(content, relPath));
    detections.push(...parseCaches(content, relPath));
    detections.push(...parseAuthUserModel(content, relPath));
  }

  if (detections.length === 0) {
    return [];
  }

  return groupDetections(detections);
}

/**
 * Recursively finds Django settings.py files in the project.
 * Looks for settings.py and common patterns like settings/base.py, settings/production.py.
 */
function findDjangoSettingsFiles(projectPath: string): string[] {
  const found: string[] = [];
  const skipDirs = new Set([
    "node_modules",
    ".git",
    "__pycache__",
    ".venv",
    "venv",
    "env",
    ".env",
    ".tox",
    "dist",
    "build",
    ".eggs",
    "site-packages",
  ]);

  const settingsFileNames = new Set([
    "settings.py",
    "base.py",
    "production.py",
    "staging.py",
    "development.py",
    "local.py",
  ]);

  function walk(dir: string, depth: number) {
    if (depth > 10) return;

    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    // Check if this directory is a Django settings package (has __init__.py and settings-like .py files)
    const isSettingsDir = path.basename(dir) === "settings" &&
      entries.some((e) => e.name === "__init__.py");

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!entry.name.startsWith(".") || entry.name === ".") {
          if (!skipDirs.has(entry.name)) {
            walk(path.join(dir, entry.name), depth + 1);
          }
        }
      } else if (entry.name === "settings.py") {
        found.push(path.join(dir, entry.name));
      } else if (isSettingsDir && settingsFileNames.has(entry.name)) {
        found.push(path.join(dir, entry.name));
      }
    }
  }

  walk(projectPath, 0);
  return found;
}

/**
 * Parses INSTALLED_APPS from Django settings content.
 */
function parseInstalledApps(content: string, filePath: string): SettingsDetection[] {
  const detections: SettingsDetection[] = [];

  // Match INSTALLED_APPS = [...] — handles multi-line lists and concatenation
  const appsMatch = content.match(/INSTALLED_APPS\s*=\s*\[([\s\S]*?)\]/);
  if (!appsMatch) return detections;

  const appsBlock = appsMatch[1];

  // Extract all quoted strings from the block
  const entries = extractQuotedStrings(appsBlock);

  for (const entry of entries) {
    for (const [pattern, sig] of Object.entries(INSTALLED_APPS_SIGNATURES)) {
      if (entry === pattern || entry.includes(pattern)) {
        detections.push({
          serviceName: sig.serviceName,
          category: sig.category,
          dataCollected: [...sig.dataCollected],
          evidence: {
            type: "code_pattern",
            file: filePath,
            detail: `INSTALLED_APPS contains '${entry}'`,
          },
          isDataProcessor: sig.isDataProcessor,
        });
        break;
      }
    }
  }

  return detections;
}

/**
 * Parses MIDDLEWARE from Django settings content.
 */
function parseMiddleware(content: string, filePath: string): SettingsDetection[] {
  const detections: SettingsDetection[] = [];

  const middlewareMatch = content.match(/MIDDLEWARE\s*=\s*\[([\s\S]*?)\]/);
  if (!middlewareMatch) return detections;

  const middlewareBlock = middlewareMatch[1];
  const entries = extractQuotedStrings(middlewareBlock);

  for (const entry of entries) {
    for (const [pattern, sig] of Object.entries(MIDDLEWARE_SIGNATURES)) {
      if (entry === pattern || entry.includes(pattern)) {
        detections.push({
          serviceName: sig.serviceName,
          category: sig.category,
          dataCollected: [...sig.dataCollected],
          evidence: {
            type: "code_pattern",
            file: filePath,
            detail: `MIDDLEWARE contains '${entry}'`,
          },
          isDataProcessor: sig.isDataProcessor,
        });
        break;
      }
    }
  }

  return detections;
}

/**
 * Parses DATABASES setting to detect database engine.
 */
function parseDatabases(content: string, filePath: string): SettingsDetection[] {
  const detections: SettingsDetection[] = [];

  // Match ENGINE values within DATABASES
  const engineMatches = content.matchAll(/['"]ENGINE['"]\s*:\s*['"]([^'"]+)['"]/g);

  for (const match of engineMatches) {
    const engine = match[1];
    for (const [pattern, sig] of Object.entries(DATABASE_ENGINE_SIGNATURES)) {
      if (engine.includes(pattern)) {
        detections.push({
          serviceName: sig.serviceName,
          category: sig.category,
          dataCollected: [...sig.dataCollected],
          evidence: {
            type: "code_pattern",
            file: filePath,
            detail: `DATABASES ENGINE is '${engine}'`,
          },
        });
        break;
      }
    }
  }

  return detections;
}

/**
 * Parses EMAIL_BACKEND setting.
 */
function parseEmailBackend(content: string, filePath: string): SettingsDetection[] {
  const detections: SettingsDetection[] = [];

  const emailMatch = content.match(/EMAIL_BACKEND\s*=\s*['"]([^'"]+)['"]/);
  if (!emailMatch) return detections;

  const backend = emailMatch[1];
  for (const [pattern, sig] of Object.entries(EMAIL_BACKEND_SIGNATURES)) {
    if (backend.includes(pattern)) {
      detections.push({
        serviceName: sig.serviceName,
        category: sig.category,
        dataCollected: [...sig.dataCollected],
        evidence: {
          type: "code_pattern",
          file: filePath,
          detail: `EMAIL_BACKEND is '${backend}'`,
        },
      });
      break;
    }
  }

  return detections;
}

/**
 * Parses CACHES setting to detect cache backends.
 */
function parseCaches(content: string, filePath: string): SettingsDetection[] {
  const detections: SettingsDetection[] = [];

  // Match BACKEND values within CACHES
  const backendMatches = content.matchAll(/['"]BACKEND['"]\s*:\s*['"]([^'"]+)['"]/g);

  for (const match of backendMatches) {
    const backend = match[1];
    for (const [pattern, sig] of Object.entries(CACHE_BACKEND_SIGNATURES)) {
      if (backend.includes(pattern)) {
        detections.push({
          serviceName: sig.serviceName,
          category: sig.category,
          dataCollected: [...sig.dataCollected],
          evidence: {
            type: "code_pattern",
            file: filePath,
            detail: `CACHES BACKEND is '${backend}'`,
          },
          isDataProcessor: sig.isDataProcessor,
        });
        break;
      }
    }
  }

  return detections;
}

/**
 * Parses AUTH_USER_MODEL to detect custom user model usage.
 */
function parseAuthUserModel(content: string, filePath: string): SettingsDetection[] {
  const detections: SettingsDetection[] = [];

  const authMatch = content.match(/AUTH_USER_MODEL\s*=\s*['"]([^'"]+)['"]/);
  if (!authMatch) return detections;

  const model = authMatch[1];
  detections.push({
    serviceName: "django-custom-user-model",
    category: "auth",
    dataCollected: ["custom user data", "user accounts", "authentication credentials"],
    evidence: {
      type: "code_pattern",
      file: filePath,
      detail: `AUTH_USER_MODEL is '${model}'`,
    },
  });

  return detections;
}

/**
 * Extracts all single- or double-quoted strings from a block of text.
 */
function extractQuotedStrings(block: string): string[] {
  const strings: string[] = [];
  const matches = block.matchAll(/['"]([^'"]+)['"]/g);
  for (const match of matches) {
    strings.push(match[1]);
  }
  return strings;
}

/**
 * Groups detections by service name into DetectedService objects,
 * merging evidence and dataCollected.
 */
function groupDetections(detections: SettingsDetection[]): DetectedService[] {
  const serviceMap = new Map<string, DetectedService>();

  for (const detection of detections) {
    const existing = serviceMap.get(detection.serviceName);
    if (existing) {
      existing.evidence.push(detection.evidence);
      for (const d of detection.dataCollected) {
        if (!existing.dataCollected.includes(d)) {
          existing.dataCollected.push(d);
        }
      }
    } else {
      serviceMap.set(detection.serviceName, {
        name: detection.serviceName,
        category: detection.category,
        evidence: [detection.evidence],
        dataCollected: [...detection.dataCollected],
        isDataProcessor: detection.isDataProcessor,
      });
    }
  }

  return Array.from(serviceMap.values());
}
