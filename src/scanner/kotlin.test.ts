import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanKotlinDependencies } from "./kotlin.js";

let tempDirs: string[] = [];

function createTempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-kotlin-test-"));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of tempDirs) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  tempDirs = [];
});

describe("scanKotlinDependencies", () => {
  it("returns empty array when no Gradle files exist", () => {
    const dir = createTempProject();
    const result = scanKotlinDependencies(dir);
    assert.deepStrictEqual(result, []);
  });

  it("returns empty array for build.gradle with no known dependencies", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "build.gradle"),
      `plugins {
    id 'com.android.application'
    id 'kotlin-android'
}

dependencies {
    implementation 'org.jetbrains.kotlin:kotlin-stdlib:1.9.0'
    implementation 'androidx.core:core-ktx:1.12.0'
}
`,
    );
    const result = scanKotlinDependencies(dir);
    assert.deepStrictEqual(result, []);
  });

  // Groovy DSL tests
  it("detects firebase-analytics from build.gradle (Groovy DSL)", () => {
    const dir = createTempProject();
    fs.mkdirSync(path.join(dir, "app"));
    fs.writeFileSync(
      path.join(dir, "app", "build.gradle"),
      `dependencies {
    implementation 'com.google.firebase:firebase-analytics:21.5.0'
}
`,
    );
    const result = scanKotlinDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "firebase-analytics-android");
    assert.equal(result[0].category, "analytics");
    assert.equal(result[0].evidence[0].type, "dependency");
    assert.equal(result[0].evidence[0].file, "app/build.gradle");
  });

  it("detects firebase-auth from build.gradle", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "build.gradle"),
      `dependencies {
    implementation 'com.google.firebase:firebase-auth:22.3.0'
}
`,
    );
    const result = scanKotlinDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "firebase-auth-android");
    assert.equal(result[0].category, "auth");
  });

  it("detects firebase-crashlytics from build.gradle", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "build.gradle"),
      `dependencies {
    implementation 'com.google.firebase:firebase-crashlytics:18.6.0'
}
`,
    );
    const result = scanKotlinDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "firebase-crashlytics-android");
    assert.equal(result[0].category, "monitoring");
  });

  it("detects stripe-android from build.gradle", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "build.gradle"),
      `dependencies {
    implementation 'com.stripe:stripe-android:20.36.0'
}
`,
    );
    const result = scanKotlinDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "stripe-android");
    assert.equal(result[0].category, "payment");
  });

  it("detects sentry-android from build.gradle", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "build.gradle"),
      `dependencies {
    implementation 'io.sentry:sentry-android:7.3.0'
}
`,
    );
    const result = scanKotlinDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "sentry-android");
    assert.equal(result[0].category, "monitoring");
  });

  it("detects amplitude-android from build.gradle", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "build.gradle"),
      `dependencies {
    implementation 'com.amplitude:analytics-android:1.13.0'
}
`,
    );
    const result = scanKotlinDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "amplitude-android");
    assert.equal(result[0].category, "analytics");
  });

  it("detects mixpanel-android from build.gradle", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "build.gradle"),
      `dependencies {
    implementation 'com.mixpanel.android:mixpanel-android:7.3.0'
}
`,
    );
    const result = scanKotlinDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "mixpanel-android");
    assert.equal(result[0].category, "analytics");
  });

  it("detects OneSignal from build.gradle", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "build.gradle"),
      `dependencies {
    implementation 'com.onesignal:OneSignal:5.1.6'
}
`,
    );
    const result = scanKotlinDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "onesignal-android");
    assert.equal(result[0].category, "other");
  });

  it("detects facebook-login from build.gradle", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "build.gradle"),
      `dependencies {
    implementation 'com.facebook.android:facebook-login:16.3.0'
}
`,
    );
    const result = scanKotlinDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "facebook-login-android");
    assert.equal(result[0].category, "auth");
  });

  it("detects play-services-auth from build.gradle", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "build.gradle"),
      `dependencies {
    implementation 'com.google.android.gms:play-services-auth:20.7.0'
}
`,
    );
    const result = scanKotlinDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "google-auth-android");
    assert.equal(result[0].category, "auth");
  });

  it("detects braze-android from build.gradle", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "build.gradle"),
      `dependencies {
    implementation 'com.braze:android-sdk-ui:30.0.0'
}
`,
    );
    const result = scanKotlinDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "braze-android");
    assert.equal(result[0].category, "analytics");
  });

  it("detects revenuecat from build.gradle", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "build.gradle"),
      `dependencies {
    implementation 'com.revenuecat.purchases:purchases:7.5.0'
}
`,
    );
    const result = scanKotlinDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "revenuecat-android");
    assert.equal(result[0].category, "payment");
  });

  // Kotlin DSL tests
  it("detects firebase-analytics from build.gradle.kts (Kotlin DSL)", () => {
    const dir = createTempProject();
    fs.mkdirSync(path.join(dir, "app"));
    fs.writeFileSync(
      path.join(dir, "app", "build.gradle.kts"),
      `dependencies {
    implementation("com.google.firebase:firebase-analytics:21.5.0")
}
`,
    );
    const result = scanKotlinDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "firebase-analytics-android");
    assert.equal(result[0].evidence[0].file, "app/build.gradle.kts");
  });

  it("detects stripe-android from build.gradle.kts", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "build.gradle.kts"),
      `dependencies {
    implementation("com.stripe:stripe-android:20.36.0")
}
`,
    );
    const result = scanKotlinDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "stripe-android");
    assert.equal(result[0].category, "payment");
  });

  // Version catalog tests
  it("detects dependencies from gradle/libs.versions.toml (module format)", () => {
    const dir = createTempProject();
    fs.mkdirSync(path.join(dir, "gradle"), { recursive: true });
    fs.writeFileSync(
      path.join(dir, "gradle", "libs.versions.toml"),
      `[versions]
firebaseAnalytics = "21.5.0"

[libraries]
firebase-analytics = { module = "com.google.firebase:firebase-analytics", version.ref = "firebaseAnalytics" }
`,
    );
    const result = scanKotlinDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "firebase-analytics-android");
    assert.equal(result[0].evidence[0].file, "gradle/libs.versions.toml");
  });

  it("detects dependencies from gradle/libs.versions.toml (group+name format)", () => {
    const dir = createTempProject();
    fs.mkdirSync(path.join(dir, "gradle"), { recursive: true });
    fs.writeFileSync(
      path.join(dir, "gradle", "libs.versions.toml"),
      `[versions]
sentry = "7.3.0"

[libraries]
sentry-android = { group = "io.sentry", name = "sentry-android", version.ref = "sentry" }
`,
    );
    const result = scanKotlinDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "sentry-android");
    assert.equal(result[0].category, "monitoring");
  });

  it("detects dependencies from gradle/libs.versions.toml (shorthand format)", () => {
    const dir = createTempProject();
    fs.mkdirSync(path.join(dir, "gradle"), { recursive: true });
    fs.writeFileSync(
      path.join(dir, "gradle", "libs.versions.toml"),
      `[libraries]
stripe-android = "com.stripe:stripe-android:20.36.0"
`,
    );
    const result = scanKotlinDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "stripe-android");
    assert.equal(result[0].category, "payment");
  });

  it("ignores non-library sections in version catalog", () => {
    const dir = createTempProject();
    fs.mkdirSync(path.join(dir, "gradle"), { recursive: true });
    fs.writeFileSync(
      path.join(dir, "gradle", "libs.versions.toml"),
      `[versions]
firebase = "21.5.0"

[plugins]
firebase-analytics = { id = "com.google.firebase:firebase-analytics", version.ref = "firebase" }

[bundles]
firebase = ["firebase-analytics"]
`,
    );
    const result = scanKotlinDependencies(dir);
    assert.deepStrictEqual(result, []);
  });

  // Multiple sources
  it("detects multiple dependencies from different files", () => {
    const dir = createTempProject();
    fs.mkdirSync(path.join(dir, "app"));
    fs.mkdirSync(path.join(dir, "gradle"), { recursive: true });

    // Root build.gradle with classpath
    fs.writeFileSync(
      path.join(dir, "build.gradle"),
      `buildscript {
    dependencies {
        classpath 'com.google.firebase:firebase-crashlytics:18.6.0'
    }
}
`,
    );

    // App build.gradle.kts with dependencies
    fs.writeFileSync(
      path.join(dir, "app", "build.gradle.kts"),
      `dependencies {
    implementation("com.stripe:stripe-android:20.36.0")
    implementation("io.sentry:sentry-android:7.3.0")
    implementation("com.amplitude:analytics-android:1.13.0")
}
`,
    );

    // Version catalog
    fs.writeFileSync(
      path.join(dir, "gradle", "libs.versions.toml"),
      `[libraries]
onesignal = { module = "com.onesignal:OneSignal", version = "5.1.6" }
`,
    );

    const result = scanKotlinDependencies(dir);
    assert.equal(result.length, 5);
    const names = result.map((s) => s.name).sort();
    assert.deepStrictEqual(names, [
      "amplitude-android",
      "firebase-crashlytics-android",
      "onesignal-android",
      "sentry-android",
      "stripe-android",
    ]);
  });

  it("merges evidence when same dependency found in multiple files", () => {
    const dir = createTempProject();
    fs.mkdirSync(path.join(dir, "app"));
    fs.mkdirSync(path.join(dir, "gradle"), { recursive: true });

    fs.writeFileSync(
      path.join(dir, "app", "build.gradle"),
      `dependencies {
    implementation 'com.stripe:stripe-android:20.36.0'
}
`,
    );

    fs.writeFileSync(
      path.join(dir, "gradle", "libs.versions.toml"),
      `[libraries]
stripe = { module = "com.stripe:stripe-android", version = "20.36.0" }
`,
    );

    const result = scanKotlinDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "stripe-android");
    assert.equal(result[0].evidence.length, 2);
    const files = result[0].evidence.map((e) => e.file).sort();
    assert.deepStrictEqual(files, ["app/build.gradle", "gradle/libs.versions.toml"]);
  });

  it("skips comments in build.gradle", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "build.gradle"),
      `dependencies {
    // implementation 'com.stripe:stripe-android:20.36.0'
    /* implementation 'io.sentry:sentry-android:7.0.0' */
    * implementation 'com.amplitude:analytics-android:1.0.0'
}
`,
    );
    const result = scanKotlinDependencies(dir);
    assert.deepStrictEqual(result, []);
  });

  it("handles kapt and ksp configurations", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "build.gradle.kts"),
      `dependencies {
    kapt("com.google.firebase:firebase-auth:22.3.0")
}
`,
    );
    const result = scanKotlinDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "firebase-auth-android");
  });

  it("detects google-ads-android from build.gradle", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "build.gradle"),
      `dependencies {
    implementation 'com.google.android.gms:play-services-ads:22.6.0'
}
`,
    );
    const result = scanKotlinDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "google-ads-android");
    assert.equal(result[0].category, "advertising");
  });

  it("includes correct dataCollected for mixpanel-android", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "build.gradle"),
      `dependencies {
    implementation 'com.mixpanel.android:mixpanel-android:7.3.0'
}
`,
    );
    const result = scanKotlinDependencies(dir);
    assert.equal(result.length, 1);
    assert.ok(result[0].dataCollected.includes("user behavior"));
    assert.ok(result[0].dataCollected.includes("location data"));
  });
});
