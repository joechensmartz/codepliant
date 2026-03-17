import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanSwiftDependencies } from "./swift.js";

let tempDirs: string[] = [];

function createTempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-swift-test-"));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of tempDirs) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  tempDirs = [];
});

describe("scanSwiftDependencies", () => {
  it("returns empty array when no Package.swift or Podfile exists", () => {
    const dir = createTempProject();
    const result = scanSwiftDependencies(dir);
    assert.deepStrictEqual(result, []);
  });

  // Package.swift (SPM) tests

  it("detects firebase-ios-sdk from Package.swift", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "Package.swift"),
      `// swift-tools-version:5.9
import PackageDescription
let package = Package(
  name: "MyApp",
  dependencies: [
    .package(url: "https://github.com/firebase/firebase-ios-sdk", from: "10.0.0"),
  ]
)
`,
    );
    const result = scanSwiftDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "firebase-ios-sdk");
    assert.equal(result[0].category, "analytics");
    assert.equal(result[0].evidence[0].type, "dependency");
    assert.equal(result[0].evidence[0].file, "Package.swift");
  });

  it("detects stripe-ios from Package.swift", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "Package.swift"),
      `// swift-tools-version:5.9
import PackageDescription
let package = Package(
  name: "MyApp",
  dependencies: [
    .package(url: "https://github.com/stripe/stripe-ios.git", .upToNextMajor(from: "23.0.0")),
  ]
)
`,
    );
    const result = scanSwiftDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "stripe-ios");
    assert.equal(result[0].category, "payment");
  });

  it("detects sentry-cocoa from Package.swift", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "Package.swift"),
      `// swift-tools-version:5.9
import PackageDescription
let package = Package(
  name: "MyApp",
  dependencies: [
    .package(url: "https://github.com/getsentry/sentry-cocoa", from: "8.0.0"),
  ]
)
`,
    );
    const result = scanSwiftDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "sentry-cocoa");
    assert.equal(result[0].category, "monitoring");
  });

  it("detects amplitude-ios from Package.swift", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "Package.swift"),
      `// swift-tools-version:5.9
import PackageDescription
let package = Package(
  name: "MyApp",
  dependencies: [
    .package(url: "https://github.com/amplitude/amplitude-ios", from: "1.0.0"),
  ]
)
`,
    );
    const result = scanSwiftDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "amplitude-ios");
    assert.equal(result[0].category, "analytics");
  });

  it("detects mixpanel-swift from Package.swift", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "Package.swift"),
      `// swift-tools-version:5.9
import PackageDescription
let package = Package(
  name: "MyApp",
  dependencies: [
    .package(url: "https://github.com/mixpanel/mixpanel-swift", from: "4.0.0"),
  ]
)
`,
    );
    const result = scanSwiftDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "mixpanel-swift");
    assert.equal(result[0].category, "analytics");
  });

  it("detects onesignal-ios-sdk from Package.swift", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "Package.swift"),
      `// swift-tools-version:5.9
import PackageDescription
let package = Package(
  name: "MyApp",
  dependencies: [
    .package(url: "https://github.com/OneSignal/onesignal-ios-sdk", from: "5.0.0"),
  ]
)
`,
    );
    const result = scanSwiftDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "onesignal-ios-sdk");
    assert.equal(result[0].category, "other");
  });

  it("detects AppAuth-iOS from Package.swift", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "Package.swift"),
      `// swift-tools-version:5.9
import PackageDescription
let package = Package(
  name: "MyApp",
  dependencies: [
    .package(url: "https://github.com/openid/AppAuth-iOS", from: "1.6.0"),
  ]
)
`,
    );
    const result = scanSwiftDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "AppAuth-iOS");
    assert.equal(result[0].category, "auth");
  });

  it("detects facebook-ios-sdk from Package.swift", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "Package.swift"),
      `// swift-tools-version:5.9
import PackageDescription
let package = Package(
  name: "MyApp",
  dependencies: [
    .package(url: "https://github.com/facebook/facebook-ios-sdk", from: "16.0.0"),
  ]
)
`,
    );
    const result = scanSwiftDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "facebook-ios-sdk");
    assert.equal(result[0].category, "auth");
  });

  it("detects google-signin-ios from Package.swift", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "Package.swift"),
      `// swift-tools-version:5.9
import PackageDescription
let package = Package(
  name: "MyApp",
  dependencies: [
    .package(url: "https://github.com/google/google-signin-ios", from: "7.0.0"),
  ]
)
`,
    );
    const result = scanSwiftDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "google-signin-ios");
    assert.equal(result[0].category, "auth");
  });

  it("detects multiple dependencies from Package.swift", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "Package.swift"),
      `// swift-tools-version:5.9
import PackageDescription
let package = Package(
  name: "MyApp",
  dependencies: [
    .package(url: "https://github.com/firebase/firebase-ios-sdk", from: "10.0.0"),
    .package(url: "https://github.com/stripe/stripe-ios.git", from: "23.0.0"),
    .package(url: "https://github.com/getsentry/sentry-cocoa", from: "8.0.0"),
    .package(url: "https://github.com/google/google-signin-ios", from: "7.0.0"),
  ]
)
`,
    );
    const result = scanSwiftDependencies(dir);
    assert.equal(result.length, 4);
    const names = result.map((s) => s.name).sort();
    assert.deepStrictEqual(names, [
      "firebase-ios-sdk",
      "google-signin-ios",
      "sentry-cocoa",
      "stripe-ios",
    ]);
  });

  it("strips .git suffix from Package.swift URLs", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "Package.swift"),
      `// swift-tools-version:5.9
import PackageDescription
let package = Package(
  name: "MyApp",
  dependencies: [
    .package(url: "https://github.com/getsentry/sentry-cocoa.git", from: "8.0.0"),
  ]
)
`,
    );
    const result = scanSwiftDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "sentry-cocoa");
  });

  // Podfile (CocoaPods) tests

  it("detects Firebase pod from Podfile", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "Podfile"),
      `platform :ios, '15.0'

target 'MyApp' do
  use_frameworks!
  pod 'Firebase', '~> 10.0'
end
`,
    );
    const result = scanSwiftDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "Firebase");
    assert.equal(result[0].category, "analytics");
    assert.equal(result[0].evidence[0].file, "Podfile");
  });

  it("detects Stripe pod from Podfile", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "Podfile"),
      `platform :ios, '15.0'

target 'MyApp' do
  use_frameworks!
  pod 'Stripe', '~> 23.0'
end
`,
    );
    const result = scanSwiftDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "stripe-ios");
    assert.equal(result[0].category, "payment");
  });

  it("detects Sentry pod from Podfile", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "Podfile"),
      `platform :ios, '15.0'

target 'MyApp' do
  use_frameworks!
  pod 'Sentry', '~> 8.0'
end
`,
    );
    const result = scanSwiftDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "sentry-cocoa");
    assert.equal(result[0].category, "monitoring");
  });

  it("detects pods with subspecs (e.g. Firebase/Analytics)", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "Podfile"),
      `platform :ios, '15.0'

target 'MyApp' do
  use_frameworks!
  pod 'Firebase/Analytics', '~> 10.0'
  pod 'Firebase/Auth', '~> 10.0'
end
`,
    );
    const result = scanSwiftDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "Firebase");
    // Evidence should be merged (2 pod lines, same service)
    assert.equal(result[0].evidence.length, 2);
  });

  it("skips commented-out pods in Podfile", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "Podfile"),
      `platform :ios, '15.0'

target 'MyApp' do
  use_frameworks!
  # pod 'Stripe', '~> 23.0'
  pod 'Sentry', '~> 8.0'
end
`,
    );
    const result = scanSwiftDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "sentry-cocoa");
  });

  it("detects multiple pods from Podfile", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "Podfile"),
      `platform :ios, '15.0'

target 'MyApp' do
  use_frameworks!
  pod 'Firebase', '~> 10.0'
  pod 'Stripe', '~> 23.0'
  pod 'Sentry', '~> 8.0'
  pod 'Amplitude', '~> 8.0'
  pod 'Mixpanel', '~> 4.0'
  pod 'GoogleSignIn', '~> 7.0'
end
`,
    );
    const result = scanSwiftDependencies(dir);
    assert.equal(result.length, 6);
    const names = result.map((s) => s.name).sort();
    assert.deepStrictEqual(names, [
      "Firebase",
      "amplitude-ios",
      "google-signin-ios",
      "mixpanel-swift",
      "sentry-cocoa",
      "stripe-ios",
    ]);
  });

  it("detects pod without version specifier", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "Podfile"),
      `platform :ios, '15.0'

target 'MyApp' do
  pod 'Sentry'
end
`,
    );
    const result = scanSwiftDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "sentry-cocoa");
  });

  // Combined Package.swift + Podfile

  it("merges evidence from both Package.swift and Podfile", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "Package.swift"),
      `// swift-tools-version:5.9
import PackageDescription
let package = Package(
  name: "MyApp",
  dependencies: [
    .package(url: "https://github.com/getsentry/sentry-cocoa", from: "8.0.0"),
  ]
)
`,
    );
    fs.writeFileSync(
      path.join(dir, "Podfile"),
      `platform :ios, '15.0'
target 'MyApp' do
  pod 'Sentry', '~> 8.0'
end
`,
    );
    const result = scanSwiftDependencies(dir);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "sentry-cocoa");
    assert.equal(result[0].evidence.length, 2);
    const files = result[0].evidence.map((e) => e.file);
    assert.ok(files.includes("Package.swift"));
    assert.ok(files.includes("Podfile"));
  });

  it("returns empty for Package.swift with no known dependencies", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "Package.swift"),
      `// swift-tools-version:5.9
import PackageDescription
let package = Package(
  name: "MyApp",
  dependencies: [
    .package(url: "https://github.com/apple/swift-argument-parser", from: "1.0.0"),
  ]
)
`,
    );
    const result = scanSwiftDependencies(dir);
    assert.deepStrictEqual(result, []);
  });

  it("includes correct dataCollected for payment service", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "Package.swift"),
      `// swift-tools-version:5.9
import PackageDescription
let package = Package(
  name: "MyApp",
  dependencies: [
    .package(url: "https://github.com/stripe/stripe-ios", from: "23.0.0"),
  ]
)
`,
    );
    const result = scanSwiftDependencies(dir);
    assert.equal(result.length, 1);
    assert.ok(result[0].dataCollected.includes("payment information"));
    assert.ok(result[0].dataCollected.includes("billing address"));
  });

  it("includes evidence detail in results", () => {
    const dir = createTempProject();
    fs.writeFileSync(
      path.join(dir, "Podfile"),
      `platform :ios, '15.0'
target 'MyApp' do
  pod 'Stripe', '~> 23.0'
end
`,
    );
    const result = scanSwiftDependencies(dir);
    assert.equal(result.length, 1);
    assert.ok(result[0].evidence[0].detail.includes("Stripe"));
  });
});
