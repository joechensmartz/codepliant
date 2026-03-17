import * as fs from "fs";
import * as path from "path";
import type { DetectedService, Evidence } from "./types.js";

/**
 * Kotlin/Android groupId:artifactId → service mapping.
 * Keys use "group:artifact" format matching Maven/Gradle coordinates.
 */
const KOTLIN_SIGNATURES: Record<
  string,
  {
    name: string;
    category: DetectedService["category"];
    dataCollected: string[];
    isDataProcessor?: boolean;
  }
> = {
  // Firebase
  "com.google.firebase:firebase-analytics": {
    name: "firebase-analytics-android",
    category: "analytics",
    dataCollected: ["user behavior", "device information", "app events", "screen views"],
  },
  "com.google.firebase:firebase-auth": {
    name: "firebase-auth-android",
    category: "auth",
    dataCollected: ["email", "name", "phone number", "OAuth tokens", "session data"],
  },
  "com.google.firebase:firebase-crashlytics": {
    name: "firebase-crashlytics-android",
    category: "monitoring",
    dataCollected: ["crash data", "stack traces", "device information", "app state"],
  },
  "com.google.firebase:firebase-firestore": {
    name: "firebase-firestore-android",
    category: "database",
    dataCollected: ["user data as defined in schema", "document content"],
  },
  "com.google.firebase:firebase-messaging": {
    name: "firebase-messaging-android",
    category: "other",
    dataCollected: ["device tokens", "notification content", "message data"],
  },

  // Payment
  "com.stripe:stripe-android": {
    name: "stripe-android",
    category: "payment",
    dataCollected: ["payment information", "billing address", "email", "transaction history"],
  },
  "com.revenuecat.purchases:purchases": {
    name: "revenuecat-android",
    category: "payment",
    dataCollected: ["purchase history", "subscription data", "transaction receipts", "user identity"],
  },

  // Monitoring
  "io.sentry:sentry-android": {
    name: "sentry-android",
    category: "monitoring",
    dataCollected: ["error data", "stack traces", "user context", "device information"],
  },

  // Analytics
  "com.amplitude:analytics-android": {
    name: "amplitude-android",
    category: "analytics",
    dataCollected: ["user behavior", "device information", "session data"],
  },
  "com.mixpanel.android:mixpanel-android": {
    name: "mixpanel-android",
    category: "analytics",
    dataCollected: ["user behavior", "user profiles", "device information", "location data"],
  },
  "com.braze:android-sdk": {
    name: "braze-android",
    category: "analytics",
    dataCollected: ["user behavior", "user profiles", "device information", "push tokens", "location data"],
  },
  "com.braze:android-sdk-ui": {
    name: "braze-android",
    category: "analytics",
    dataCollected: ["user behavior", "user profiles", "device information", "push tokens", "location data"],
  },

  // Notifications
  "com.onesignal:OneSignal": {
    name: "onesignal-android",
    category: "other",
    dataCollected: ["device tokens", "user segments", "notification engagement", "device information"],
  },

  // Auth / Social
  "com.facebook.android:facebook-login": {
    name: "facebook-login-android",
    category: "auth",
    dataCollected: ["email", "name", "Facebook profile data", "OAuth tokens", "social connections"],
  },
  "com.facebook.android:facebook-android-sdk": {
    name: "facebook-sdk-android",
    category: "auth",
    dataCollected: ["email", "name", "Facebook profile data", "OAuth tokens", "social connections"],
  },
  "com.google.android.gms:play-services-auth": {
    name: "google-auth-android",
    category: "auth",
    dataCollected: ["email", "name", "Google profile data", "OAuth tokens"],
  },

  // Additional SDKs
  "com.google.android.gms:play-services-ads": {
    name: "google-ads-android",
    category: "advertising",
    dataCollected: ["device information", "ad interaction data", "user behavior", "location data"],
  },
  "com.google.android.gms:play-services-analytics": {
    name: "google-analytics-android",
    category: "analytics",
    dataCollected: ["user behavior", "device information", "app events", "screen views"],
  },
  "com.squareup.retrofit2:retrofit": {
    name: "retrofit",
    category: "other",
    dataCollected: ["API request data"],
    isDataProcessor: false,
  },
};

/**
 * Scan a Kotlin/Android project's Gradle build files for known service dependencies.
 * Supports:
 * - build.gradle (Groovy DSL)
 * - build.gradle.kts (Kotlin DSL)
 * - app/build.gradle and app/build.gradle.kts
 * - gradle/libs.versions.toml (Version Catalog)
 */
export function scanKotlinDependencies(projectPath: string): DetectedService[] {
  const detected = new Map<string, DetectedService>();

  // Scan root build files
  const rootGradle = path.join(projectPath, "build.gradle");
  if (fs.existsSync(rootGradle)) {
    scanGradleFile(rootGradle, "build.gradle", detected);
  }

  const rootGradleKts = path.join(projectPath, "build.gradle.kts");
  if (fs.existsSync(rootGradleKts)) {
    scanGradleFile(rootGradleKts, "build.gradle.kts", detected);
  }

  // Scan app module build files
  const appGradle = path.join(projectPath, "app", "build.gradle");
  if (fs.existsSync(appGradle)) {
    scanGradleFile(appGradle, "app/build.gradle", detected);
  }

  const appGradleKts = path.join(projectPath, "app", "build.gradle.kts");
  if (fs.existsSync(appGradleKts)) {
    scanGradleFile(appGradleKts, "app/build.gradle.kts", detected);
  }

  // Scan version catalog
  const versionCatalog = path.join(projectPath, "gradle", "libs.versions.toml");
  if (fs.existsSync(versionCatalog)) {
    scanVersionCatalog(versionCatalog, "gradle/libs.versions.toml", detected);
  }

  return Array.from(detected.values());
}

/**
 * Parse a build.gradle or build.gradle.kts file for dependencies.
 *
 * Handles both Groovy DSL:
 *   implementation 'com.google.firebase:firebase-analytics:21.0.0'
 *
 * And Kotlin DSL:
 *   implementation("com.google.firebase:firebase-analytics:21.0.0")
 */
function scanGradleFile(
  filePath: string,
  relativeFile: string,
  detected: Map<string, DetectedService>,
): void {
  let content: string;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch {
    return;
  }

  const lines = content.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip comments and empty lines
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) continue;

    // Match Groovy DSL: implementation 'group:artifact:version'
    // Match Kotlin DSL: implementation("group:artifact:version")
    // Also matches api, compileOnly, runtimeOnly, testImplementation, classpath, kapt
    const gradleMatch = trimmed.match(
      /(?:implementation|api|compileOnly|runtimeOnly|testImplementation|classpath|kapt|ksp|annotationProcessor)\s*\(?\s*["']([a-zA-Z0-9._-]+):([a-zA-Z0-9._-]+)(?::([^"']+))?["']\s*\)?/
    );
    if (gradleMatch) {
      const groupId = gradleMatch[1];
      const artifactId = gradleMatch[2];
      const key = `${groupId}:${artifactId}`;
      const detail = trimmed.substring(0, 100);

      matchKotlinDependency(key, detail, relativeFile, detected);
    }

    // Match Kotlin DSL with libs.* version catalog references in build.gradle.kts
    // e.g., implementation(libs.firebase.analytics)
    // These are handled via the version catalog scan, so skip here
  }
}

/**
 * Parse gradle/libs.versions.toml (Gradle Version Catalog) for dependencies.
 *
 * Format:
 *   [libraries]
 *   firebase-analytics = { module = "com.google.firebase:firebase-analytics", version.ref = "firebaseAnalytics" }
 *   firebase-analytics = { group = "com.google.firebase", name = "firebase-analytics", version.ref = "..." }
 *   firebase-analytics = "com.google.firebase:firebase-analytics:21.0.0"
 */
function scanVersionCatalog(
  filePath: string,
  relativeFile: string,
  detected: Map<string, DetectedService>,
): void {
  let content: string;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch {
    return;
  }

  const lines = content.split("\n");
  let inLibraries = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Track sections
    if (trimmed.startsWith("[")) {
      inLibraries = trimmed === "[libraries]";
      continue;
    }

    if (!inLibraries) continue;

    // Skip comments and empty lines
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Match: alias = { module = "group:artifact" ... }
    const moduleMatch = trimmed.match(/module\s*=\s*"([a-zA-Z0-9._-]+):([a-zA-Z0-9._-]+)"/);
    if (moduleMatch) {
      const key = `${moduleMatch[1]}:${moduleMatch[2]}`;
      matchKotlinDependency(key, trimmed.substring(0, 100), relativeFile, detected);
      continue;
    }

    // Match: alias = { group = "group", name = "artifact" ... }
    const groupNameMatch = trimmed.match(/group\s*=\s*"([a-zA-Z0-9._-]+)"\s*,\s*name\s*=\s*"([a-zA-Z0-9._-]+)"/);
    if (groupNameMatch) {
      const key = `${groupNameMatch[1]}:${groupNameMatch[2]}`;
      matchKotlinDependency(key, trimmed.substring(0, 100), relativeFile, detected);
      continue;
    }

    // Match: alias = "group:artifact:version" (shorthand string notation)
    const shorthandMatch = trimmed.match(/=\s*"([a-zA-Z0-9._-]+):([a-zA-Z0-9._-]+):([^"]+)"/);
    if (shorthandMatch) {
      const key = `${shorthandMatch[1]}:${shorthandMatch[2]}`;
      matchKotlinDependency(key, trimmed.substring(0, 100), relativeFile, detected);
    }
  }
}

function matchKotlinDependency(
  key: string,
  detail: string,
  filename: string,
  detected: Map<string, DetectedService>,
): void {
  const sig = KOTLIN_SIGNATURES[key];
  if (!sig) return;

  const evidence: Evidence = {
    type: "dependency",
    file: filename,
    detail: detail,
  };

  if (detected.has(sig.name)) {
    detected.get(sig.name)!.evidence.push(evidence);
  } else {
    detected.set(sig.name, {
      name: sig.name,
      category: sig.category,
      evidence: [evidence],
      dataCollected: [...sig.dataCollected],
      isDataProcessor: sig.isDataProcessor,
    });
  }
}
