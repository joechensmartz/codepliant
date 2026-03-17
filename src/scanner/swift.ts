import * as fs from "fs";
import * as path from "path";
import type { DetectedService, Evidence } from "./types.js";

/**
 * Swift/iOS package name -> service mapping.
 * Keys are Swift Package Manager package URLs (repo name) or CocoaPods pod names.
 */
const SWIFT_SIGNATURES: Record<
  string,
  {
    name: string;
    category: DetectedService["category"];
    dataCollected: string[];
    isDataProcessor?: boolean;
  }
> = {
  // Firebase
  "firebase-ios-sdk": {
    name: "firebase-ios-sdk",
    category: "analytics",
    dataCollected: [
      "user behavior",
      "device information",
      "crash data",
      "app performance metrics",
    ],
  },
  Firebase: {
    name: "Firebase",
    category: "analytics",
    dataCollected: [
      "user behavior",
      "device information",
      "crash data",
      "app performance metrics",
    ],
  },
  FirebaseAnalytics: {
    name: "firebase-ios-sdk",
    category: "analytics",
    dataCollected: [
      "user behavior",
      "device information",
      "app events",
      "screen views",
    ],
  },
  FirebaseAuth: {
    name: "firebase-ios-sdk",
    category: "auth",
    dataCollected: [
      "email",
      "name",
      "phone number",
      "OAuth tokens",
      "session data",
    ],
  },

  // Payment
  "stripe-ios": {
    name: "stripe-ios",
    category: "payment",
    dataCollected: [
      "payment information",
      "billing address",
      "email",
      "transaction history",
    ],
  },
  Stripe: {
    name: "stripe-ios",
    category: "payment",
    dataCollected: [
      "payment information",
      "billing address",
      "email",
      "transaction history",
    ],
  },
  StripePaymentSheet: {
    name: "stripe-ios",
    category: "payment",
    dataCollected: [
      "payment information",
      "billing address",
      "email",
      "transaction history",
    ],
  },

  // Monitoring
  "sentry-cocoa": {
    name: "sentry-cocoa",
    category: "monitoring",
    dataCollected: [
      "error data",
      "stack traces",
      "user context",
      "device information",
    ],
  },
  Sentry: {
    name: "sentry-cocoa",
    category: "monitoring",
    dataCollected: [
      "error data",
      "stack traces",
      "user context",
      "device information",
    ],
  },

  // Analytics
  "amplitude-ios": {
    name: "amplitude-ios",
    category: "analytics",
    dataCollected: ["user behavior", "device information", "session data"],
  },
  Amplitude: {
    name: "amplitude-ios",
    category: "analytics",
    dataCollected: ["user behavior", "device information", "session data"],
  },
  AmplitudeSwift: {
    name: "amplitude-ios",
    category: "analytics",
    dataCollected: ["user behavior", "device information", "session data"],
  },
  "mixpanel-swift": {
    name: "mixpanel-swift",
    category: "analytics",
    dataCollected: [
      "user behavior",
      "user profiles",
      "device information",
      "location data",
    ],
  },
  Mixpanel: {
    name: "mixpanel-swift",
    category: "analytics",
    dataCollected: [
      "user behavior",
      "user profiles",
      "device information",
      "location data",
    ],
  },

  // Notifications
  "onesignal-ios-sdk": {
    name: "onesignal-ios-sdk",
    category: "other",
    dataCollected: [
      "device tokens",
      "user segments",
      "notification engagement",
      "device information",
    ],
  },
  OneSignal: {
    name: "onesignal-ios-sdk",
    category: "other",
    dataCollected: [
      "device tokens",
      "user segments",
      "notification engagement",
      "device information",
    ],
  },
  OneSignalFramework: {
    name: "onesignal-ios-sdk",
    category: "other",
    dataCollected: [
      "device tokens",
      "user segments",
      "notification engagement",
      "device information",
    ],
  },

  // Auth
  "AppAuth-iOS": {
    name: "AppAuth-iOS",
    category: "auth",
    dataCollected: ["OAuth tokens", "session data", "user identity"],
  },
  AppAuth: {
    name: "AppAuth-iOS",
    category: "auth",
    dataCollected: ["OAuth tokens", "session data", "user identity"],
  },

  // Facebook
  "facebook-ios-sdk": {
    name: "facebook-ios-sdk",
    category: "auth",
    dataCollected: [
      "email",
      "name",
      "Facebook profile data",
      "OAuth tokens",
      "social connections",
    ],
  },
  FacebookLogin: {
    name: "facebook-ios-sdk",
    category: "auth",
    dataCollected: [
      "email",
      "name",
      "Facebook profile data",
      "OAuth tokens",
      "social connections",
    ],
  },
  FacebookCore: {
    name: "facebook-ios-sdk",
    category: "auth",
    dataCollected: [
      "email",
      "name",
      "Facebook profile data",
      "OAuth tokens",
      "social connections",
    ],
  },
  FBSDKLoginKit: {
    name: "facebook-ios-sdk",
    category: "auth",
    dataCollected: [
      "email",
      "name",
      "Facebook profile data",
      "OAuth tokens",
      "social connections",
    ],
  },

  // Google Sign-In
  "google-signin-ios": {
    name: "google-signin-ios",
    category: "auth",
    dataCollected: ["email", "name", "Google profile data", "OAuth tokens"],
  },
  GoogleSignIn: {
    name: "google-signin-ios",
    category: "auth",
    dataCollected: ["email", "name", "Google profile data", "OAuth tokens"],
  },
};

/**
 * Scan a Swift/iOS project for known service dependencies.
 * Checks both Package.swift (SPM) and Podfile (CocoaPods).
 */
export function scanSwiftDependencies(projectPath: string): DetectedService[] {
  const detected = new Map<string, DetectedService>();

  const packageSwiftPath = path.join(projectPath, "Package.swift");
  if (fs.existsSync(packageSwiftPath)) {
    scanPackageSwift(packageSwiftPath, detected);
  }

  const podfilePath = path.join(projectPath, "Podfile");
  if (fs.existsSync(podfilePath)) {
    scanPodfile(podfilePath, detected);
  }

  return Array.from(detected.values());
}

/**
 * Parse Package.swift and match .package(url: "...", ...) entries
 * against known Swift service signatures.
 *
 * Handles formats:
 *   .package(url: "https://github.com/user/repo", from: "1.0.0")
 *   .package(url: "https://github.com/user/repo.git", .upToNextMajor(from: "1.0.0"))
 *   .package(url: "https://github.com/user/repo", exact: "1.0.0")
 *   .package(url: "https://github.com/user/repo", branch: "main")
 */
function scanPackageSwift(
  filePath: string,
  detected: Map<string, DetectedService>,
): void {
  let content: string;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch {
    return;
  }

  // Match .package(url: "...", ...)
  const packageRegex = /\.package\s*\(\s*url\s*:\s*"([^"]+)"/g;
  let match: RegExpExecArray | null;

  while ((match = packageRegex.exec(content)) !== null) {
    const url = match[1];
    // Extract repo name from URL (strip .git suffix if present)
    const repoName = url.replace(/\.git$/, "").split("/").pop();
    if (!repoName) continue;

    matchSwiftPackage(repoName, match[0].substring(0, 100), "Package.swift", detected);
  }
}

/**
 * Parse Podfile and match pod declarations against known Swift service signatures.
 *
 * Handles formats:
 *   pod 'Name', '~> 1.0'
 *   pod 'Name', '>= 1.0'
 *   pod 'Name'
 *   pod 'Name/Subspec', '~> 1.0'
 */
function scanPodfile(
  filePath: string,
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

    // Skip comments
    if (trimmed.startsWith("#")) continue;

    // Match pod 'Name' or pod 'Name', 'version' or pod 'Name/Subspec'
    const podMatch = trimmed.match(/^pod\s+['"]([^'"\/]+)(?:\/[^'"]*)?['"]/);
    if (podMatch) {
      const podName = podMatch[1];
      matchSwiftPackage(podName, trimmed.substring(0, 100), "Podfile", detected);
    }
  }
}

function matchSwiftPackage(
  pkgName: string,
  rawLine: string,
  filename: string,
  detected: Map<string, DetectedService>,
): void {
  const sig = SWIFT_SIGNATURES[pkgName];
  if (!sig) return;

  const evidence: Evidence = {
    type: "dependency",
    file: filename,
    detail: rawLine,
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
