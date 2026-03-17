import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanDjangoSettings } from "./django-settings.js";

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-django-settings-test-"));
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

describe("scanDjangoSettings", () => {
  it("returns empty when no settings.py files exist", () => {
    const dir = createTempProject({
      "manage.py": "# django project",
    });
    try {
      const result = scanDjangoSettings(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("detects INSTALLED_APPS entries", () => {
    const dir = createTempProject({
      "myproject/settings.py": `
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'rest_framework',
    'corsheaders',
    'storages',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
]
`,
    });
    try {
      const result = scanDjangoSettings(dir);
      const names = result.map((s) => s.name);

      assert.ok(names.includes("django.contrib.auth"), "Should detect django.contrib.auth");
      assert.ok(names.includes("djangorestframework"), "Should detect rest_framework as djangorestframework");
      assert.ok(names.includes("django-cors-headers"), "Should detect corsheaders");
      assert.ok(names.includes("django-storages"), "Should detect storages");
      assert.ok(names.includes("django-allauth"), "Should detect allauth");

      // Verify categories
      const authService = result.find((s) => s.name === "django.contrib.auth");
      assert.ok(authService);
      assert.strictEqual(authService.category, "auth");

      const storageService = result.find((s) => s.name === "django-storages");
      assert.ok(storageService);
      assert.strictEqual(storageService.category, "storage");
    } finally {
      cleanup(dir);
    }
  });

  it("detects MIDDLEWARE entries", () => {
    const dir = createTempProject({
      "myproject/settings.py": `
INSTALLED_APPS = []

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'axes.middleware.AxesMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
]
`,
    });
    try {
      const result = scanDjangoSettings(dir);
      const names = result.map((s) => s.name);

      assert.ok(names.includes("django-cors-headers"), "Should detect CORS middleware");
      assert.ok(names.includes("django-csrf-protection"), "Should detect CSRF middleware");
      assert.ok(names.includes("django-axes"), "Should detect axes middleware");
      assert.ok(names.includes("whitenoise"), "Should detect whitenoise middleware");
    } finally {
      cleanup(dir);
    }
  });

  it("detects database engine from DATABASES setting", () => {
    const dir = createTempProject({
      "myproject/settings.py": `
INSTALLED_APPS = []

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mydb',
        'USER': 'myuser',
        'PASSWORD': 'mypass',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
`,
    });
    try {
      const result = scanDjangoSettings(dir);
      const pgService = result.find((s) => s.name === "postgresql");
      assert.ok(pgService, "Should detect PostgreSQL database engine");
      assert.strictEqual(pgService.category, "database");
      assert.ok(pgService.evidence[0].detail.includes("django.db.backends.postgresql"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects EMAIL_BACKEND setting", () => {
    const dir = createTempProject({
      "myproject/settings.py": `
INSTALLED_APPS = []

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
`,
    });
    try {
      const result = scanDjangoSettings(dir);
      const emailService = result.find((s) => s.name === "django-smtp-email");
      assert.ok(emailService, "Should detect SMTP email backend");
      assert.strictEqual(emailService.category, "email");
    } finally {
      cleanup(dir);
    }
  });

  it("detects SendGrid email backend via anymail", () => {
    const dir = createTempProject({
      "myproject/settings.py": `
INSTALLED_APPS = []

EMAIL_BACKEND = 'anymail.backends.sendgrid.EmailBackend'
ANYMAIL = {
    'SENDGRID_API_KEY': 'SG.xxx',
}
`,
    });
    try {
      const result = scanDjangoSettings(dir);
      const emailService = result.find((s) => s.name === "sendgrid");
      assert.ok(emailService, "Should detect SendGrid via anymail backend");
      assert.strictEqual(emailService.category, "email");
    } finally {
      cleanup(dir);
    }
  });

  it("detects CACHES with Redis backend", () => {
    const dir = createTempProject({
      "myproject/settings.py": `
INSTALLED_APPS = []

CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}
`,
    });
    try {
      const result = scanDjangoSettings(dir);
      const cacheService = result.find((s) => s.name === "django-redis");
      assert.ok(cacheService, "Should detect Redis cache backend");
      assert.strictEqual(cacheService.category, "database");
    } finally {
      cleanup(dir);
    }
  });

  it("detects AUTH_USER_MODEL customization", () => {
    const dir = createTempProject({
      "myproject/settings.py": `
INSTALLED_APPS = []

AUTH_USER_MODEL = 'accounts.CustomUser'
`,
    });
    try {
      const result = scanDjangoSettings(dir);
      const authService = result.find((s) => s.name === "django-custom-user-model");
      assert.ok(authService, "Should detect custom user model");
      assert.strictEqual(authService.category, "auth");
      assert.ok(authService.evidence[0].detail.includes("accounts.CustomUser"));
    } finally {
      cleanup(dir);
    }
  });

  it("scans settings in a settings/ package directory", () => {
    const dir = createTempProject({
      "myproject/settings/__init__.py": "from .base import *",
      "myproject/settings/base.py": `
INSTALLED_APPS = [
    'django.contrib.auth',
    'rest_framework',
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
    }
}
`,
      "myproject/settings/production.py": `
from .base import *

EMAIL_BACKEND = 'anymail.backends.amazon_ses.EmailBackend'
`,
    });
    try {
      const result = scanDjangoSettings(dir);
      const names = result.map((s) => s.name);

      assert.ok(names.includes("django.contrib.auth"), "Should detect auth from base.py");
      assert.ok(names.includes("djangorestframework"), "Should detect rest_framework from base.py");
      assert.ok(names.includes("postgresql"), "Should detect PostgreSQL from base.py");
      assert.ok(names.includes("aws-ses"), "Should detect AWS SES from production.py");
    } finally {
      cleanup(dir);
    }
  });

  it("merges evidence when same service detected from multiple sources", () => {
    const dir = createTempProject({
      "myproject/settings.py": `
INSTALLED_APPS = [
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
]
`,
    });
    try {
      const result = scanDjangoSettings(dir);
      const corsService = result.find((s) => s.name === "django-cors-headers");
      assert.ok(corsService, "Should detect CORS headers");
      assert.strictEqual(corsService.evidence.length, 2, "Should have evidence from both INSTALLED_APPS and MIDDLEWARE");
    } finally {
      cleanup(dir);
    }
  });

  it("handles a comprehensive real-world settings file", () => {
    const dir = createTempProject({
      "myproject/settings.py": `
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'dev-key')

DEBUG = True

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'rest_framework',
    'corsheaders',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'storages',
    'django_celery_beat',
    'debug_toolbar',
    'channels',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'mydb'),
    }
}

CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': os.environ.get('REDIS_URL', 'redis://localhost:6379/1'),
    }
}

EMAIL_BACKEND = 'anymail.backends.sendgrid.EmailBackend'

AUTH_USER_MODEL = 'users.CustomUser'
`,
    });
    try {
      const result = scanDjangoSettings(dir);
      const names = result.map((s) => s.name);

      // Verify key detections
      assert.ok(names.includes("django.contrib.auth"), "auth");
      assert.ok(names.includes("django-allauth"), "allauth");
      assert.ok(names.includes("djangorestframework"), "rest_framework");
      assert.ok(names.includes("django-cors-headers"), "cors");
      assert.ok(names.includes("django-storages"), "storages");
      assert.ok(names.includes("django-celery-beat"), "celery-beat");
      assert.ok(names.includes("django-debug-toolbar"), "debug-toolbar");
      assert.ok(names.includes("django-channels"), "channels");
      assert.ok(names.includes("postgresql"), "postgresql");
      assert.ok(names.includes("django-redis"), "redis cache");
      assert.ok(names.includes("sendgrid"), "sendgrid email");
      assert.ok(names.includes("django-custom-user-model"), "custom user model");
      assert.ok(names.includes("whitenoise"), "whitenoise");

      // Verify total detected count is reasonable
      assert.ok(result.length >= 12, `Expected at least 12 services, got ${result.length}`);

      // Verify evidence is present
      for (const service of result) {
        assert.ok(service.evidence.length > 0, `${service.name} should have evidence`);
        assert.ok(service.dataCollected.length >= 0, `${service.name} should have dataCollected`);
      }
    } finally {
      cleanup(dir);
    }
  });

  it("detects memcached cache backend", () => {
    const dir = createTempProject({
      "myproject/settings.py": `
INSTALLED_APPS = []

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.PyMemcacheCache',
        'LOCATION': '127.0.0.1:11211',
    }
}
`,
    });
    try {
      const result = scanDjangoSettings(dir);
      const cacheService = result.find((s) => s.name === "memcached");
      assert.ok(cacheService, "Should detect memcached cache backend");
      assert.strictEqual(cacheService.category, "database");
    } finally {
      cleanup(dir);
    }
  });

  it("detects PostGIS database backend", () => {
    const dir = createTempProject({
      "myproject/settings.py": `
INSTALLED_APPS = []

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'geodjango',
    }
}
`,
    });
    try {
      const result = scanDjangoSettings(dir);
      const dbService = result.find((s) => s.name === "postgis");
      assert.ok(dbService, "Should detect PostGIS database engine");
      assert.ok(dbService.dataCollected.includes("geographic/location data"));
    } finally {
      cleanup(dir);
    }
  });
});
