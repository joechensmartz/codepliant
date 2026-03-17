import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanFlutterDependencies } from "./flutter.js";

let tempDirs: string[] = [];

function createTempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-flutter-test-"));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of tempDirs) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  tempDirs = [];
});

describe("scanFlutterDependencies", () => {
  it("returns empty array when no pubspec.yaml exists", () => {
    const dir = createTempProject();
    const result = scanFlutterDependencies(dir);
    assert.deepStrictEqual(result, []);
  });

  it("returns empty array for pubspec.yaml with no known dependencies", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "pubspec.yaml"),
      `name: my_app
dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.2
`,
    );
    const result = scanFlutterDependencies(dir);
    assert.deepStrictEqual(result, []);
  });

  it("detects firebase_core dependency", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "pubspec.yaml"),
      `name: my_app
dependencies:
  flutter:
    sdk: flutter
  firebase_core: ^2.24.0
`,
    );
    const result = scanFlutterDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "firebase_core");
    assert.equal(result[0].category, "analytics");
    assert.equal(result[0].evidence[0].type, "dependency");
    assert.equal(result[0].evidence[0].file, "pubspec.yaml");
  });

  it("detects firebase_auth dependency", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "pubspec.yaml"),
      `name: my_app
dependencies:
  firebase_auth: ^4.15.0
`,
    );
    const result = scanFlutterDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "firebase_auth");
    assert.equal(result[0].category, "auth");
  });

  it("detects cloud_firestore dependency", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "pubspec.yaml"),
      `name: my_app
dependencies:
  cloud_firestore: ^4.13.0
`,
    );
    const result = scanFlutterDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "cloud_firestore");
    assert.equal(result[0].category, "database");
  });

  it("detects stripe payment packages", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "pubspec.yaml"),
      `name: my_app
dependencies:
  flutter_stripe: ^10.1.0
`,
    );
    const result = scanFlutterDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "flutter_stripe");
    assert.equal(result[0].category, "payment");
  });

  it("detects sentry_flutter dependency", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "pubspec.yaml"),
      `name: my_app
dependencies:
  sentry_flutter: ^7.14.0
`,
    );
    const result = scanFlutterDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "sentry_flutter");
    assert.equal(result[0].category, "monitoring");
  });

  it("detects supabase_flutter dependency", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "pubspec.yaml"),
      `name: my_app
dependencies:
  supabase_flutter: ^2.3.0
`,
    );
    const result = scanFlutterDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "supabase_flutter");
    assert.equal(result[0].category, "auth");
  });

  it("detects amplitude_flutter dependency", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "pubspec.yaml"),
      `name: my_app
dependencies:
  amplitude_flutter: ^3.13.0
`,
    );
    const result = scanFlutterDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "amplitude_flutter");
    assert.equal(result[0].category, "analytics");
  });

  it("detects onesignal_flutter dependency", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "pubspec.yaml"),
      `name: my_app
dependencies:
  onesignal_flutter: ^5.1.0
`,
    );
    const result = scanFlutterDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "onesignal_flutter");
    assert.equal(result[0].category, "other");
  });

  it("detects google_sign_in dependency", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "pubspec.yaml"),
      `name: my_app
dependencies:
  google_sign_in: ^6.1.0
`,
    );
    const result = scanFlutterDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "google_sign_in");
    assert.equal(result[0].category, "auth");
  });

  it("detects flutter_facebook_auth dependency", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "pubspec.yaml"),
      `name: my_app
dependencies:
  flutter_facebook_auth: ^6.0.0
`,
    );
    const result = scanFlutterDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "flutter_facebook_auth");
    assert.equal(result[0].category, "auth");
  });

  it("detects mixpanel_flutter dependency", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "pubspec.yaml"),
      `name: my_app
dependencies:
  mixpanel_flutter: ^2.2.0
`,
    );
    const result = scanFlutterDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "mixpanel_flutter");
    assert.equal(result[0].category, "analytics");
  });

  it("detects multiple dependencies at once", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "pubspec.yaml"),
      `name: my_app
dependencies:
  flutter:
    sdk: flutter
  firebase_core: ^2.24.0
  firebase_auth: ^4.15.0
  flutter_stripe: ^10.1.0
  sentry_flutter: ^7.14.0
  google_sign_in: ^6.1.0
`,
    );
    const result = scanFlutterDependencies(dir);
    assert.equal(result.length, 5);
    const names = result.map((s) => s.name).sort();
    assert.deepStrictEqual(names, [
      "firebase_auth",
      "firebase_core",
      "flutter_stripe",
      "google_sign_in",
      "sentry_flutter",
    ]);
  });

  it("handles multi-line dependency format (version on next line)", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "pubspec.yaml"),
      `name: my_app
dependencies:
  firebase_core:
    version: ^2.24.0
  sentry_flutter:
    version: ^7.14.0
`,
    );
    const result = scanFlutterDependencies(dir);
    assert.equal(result.length, 2);
    const names = result.map((s) => s.name).sort();
    assert.deepStrictEqual(names, ["firebase_core", "sentry_flutter"]);
  });

  it("detects dependencies in dev_dependencies section", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "pubspec.yaml"),
      `name: my_app
dependencies:
  flutter:
    sdk: flutter

dev_dependencies:
  sentry_flutter: ^7.14.0
`,
    );
    const result = scanFlutterDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "sentry_flutter");
  });

  it("stops parsing dependencies at next top-level key", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "pubspec.yaml"),
      `name: my_app
dependencies:
  firebase_core: ^2.24.0
flutter:
  uses-material-design: true
`,
    );
    const result = scanFlutterDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "firebase_core");
  });

  it("includes evidence detail in results", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "pubspec.yaml"),
      `name: my_app
dependencies:
  stripe_sdk: ^5.0.0
`,
    );
    const result = scanFlutterDependencies(dir);
    assert.equal(result.length, 1);
    assert.ok(result[0].evidence[0].detail.includes("stripe_sdk"));
  });

  it("includes correct dataCollected for firebase_analytics", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "pubspec.yaml"),
      `name: my_app
dependencies:
  firebase_analytics: ^10.7.0
`,
    );
    const result = scanFlutterDependencies(dir);
    assert.equal(result.length, 1);
    assert.ok(result[0].dataCollected.includes("user behavior"));
    assert.ok(result[0].dataCollected.includes("screen views"));
  });
});
