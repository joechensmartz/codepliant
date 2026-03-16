/**
 * Codepliant License Checking System
 *
 * Tiers:
 *   FREE  — CLI scanning + markdown output + up to 5 document types
 *   PRO   — All output formats + all document types + watch mode + API server
 *   TEAM  — scan-all + generate-all + webhook notifications
 *
 * License key is read from:
 *   1. CODEPLIANT_LICENSE_KEY env var
 *   2. licenseKey field in .codepliantrc.json (passed via config)
 *
 * Current behavior: graceful degradation — nothing is blocked, upgrade hints only.
 */

export type LicenseTier = "free" | "pro" | "team";

export interface LicenseInfo {
  tier: LicenseTier;
  valid: boolean;
  key: string | null;
}

export type ProFeature =
  | "notion-export"
  | "confluence-export"
  | "cookie-banner"
  | "compliance-report"
  | "compliance-api"
  | "executive-summary"
  | "scheduled-scans"
  | "api-server"
  | "watch-mode"
  | "all-output-formats"
  | "unlimited-doc-types";

export type TeamFeature =
  | "scan-all"
  | "generate-all"
  | "webhook-notifications";

export type LicensedFeature = ProFeature | TeamFeature;

const PRO_FEATURES = new Set<LicensedFeature>([
  "notion-export",
  "confluence-export",
  "cookie-banner",
  "compliance-report",
  "compliance-api",
  "executive-summary",
  "scheduled-scans",
  "api-server",
  "watch-mode",
  "all-output-formats",
  "unlimited-doc-types",
]);

const TEAM_FEATURES = new Set<LicensedFeature>([
  "scan-all",
  "generate-all",
  "webhook-notifications",
]);

/** Maximum document types on the free tier. */
export const FREE_DOC_TYPE_LIMIT = 5;

const PRICING_URL = "https://github.com/joechensmartz/codepliant";

/**
 * Resolve the license key from environment or config.
 */
function resolveKey(configKey?: string): string | null {
  return process.env.CODEPLIANT_LICENSE_KEY || configKey || null;
}

/**
 * Determine the tier for a given key.
 *
 * For now this is a stub — any key starting with "team_" is Team,
 * any other non-empty key is Pro, and no key is Free.
 * Future: validate against a server or signed token.
 */
function tierFromKey(key: string | null): LicenseTier {
  if (!key) return "free";
  if (key.startsWith("team_")) return "team";
  return "pro";
}

/**
 * Check the current license and return full info.
 */
export function checkLicense(configKey?: string): LicenseInfo {
  const key = resolveKey(configKey);
  const tier = tierFromKey(key);
  return {
    tier,
    valid: true, // graceful degradation — always valid for now
    key,
  };
}

/**
 * Convenience alias for checkLicense.
 */
export function getLicenseInfo(configKey?: string): LicenseInfo {
  return checkLicense(configKey);
}

/**
 * Returns true if the given feature requires at least Pro.
 */
export function isProFeature(feature: LicensedFeature): boolean {
  return PRO_FEATURES.has(feature);
}

/**
 * Returns true if the given feature requires Team.
 */
export function isTeamFeature(feature: LicensedFeature): boolean {
  return TEAM_FEATURES.has(feature);
}

/**
 * Returns the minimum tier required for a feature.
 */
export function requiredTier(feature: LicensedFeature): LicenseTier {
  if (TEAM_FEATURES.has(feature)) return "team";
  if (PRO_FEATURES.has(feature)) return "pro";
  return "free";
}

/**
 * Check whether the current license covers a feature.
 * Tier hierarchy: team > pro > free.
 */
export function hasFeatureAccess(
  license: LicenseInfo,
  feature: LicensedFeature,
): boolean {
  const tierRank: Record<LicenseTier, number> = { free: 0, pro: 1, team: 2 };
  const needed = requiredTier(feature);
  return tierRank[license.tier] >= tierRank[needed];
}

const FEATURE_FRIENDLY_NAMES: Partial<Record<LicensedFeature, string>> = {
  "notion-export": "Notion export",
  "confluence-export": "Confluence export",
  "cookie-banner": "Cookie consent banner",
  "compliance-report": "Compliance report",
  "compliance-api": "Compliance API",
  "api-server": "API server",
  "watch-mode": "Watch mode",
  "all-output-formats": "HTML export",
  "unlimited-doc-types": "Unlimited document types",
  "scan-all": "Multi-project scanning",
  "generate-all": "Multi-project generation",
  "webhook-notifications": "Webhook notifications",
};

/**
 * Build a human-readable upgrade hint for a feature.
 * Returns null if the user already has access.
 * Includes usage count when the feature has been used 3+ times.
 */
export function getUpgradeHint(
  license: LicenseInfo,
  feature: LicensedFeature,
): string | null {
  if (hasFeatureAccess(license, feature)) return null;

  const needed = requiredTier(feature);
  const tierLabel = needed.charAt(0).toUpperCase() + needed.slice(1);
  const friendlyName = FEATURE_FRIENDLY_NAMES[feature] || feature;

  // Check usage to provide more compelling hints
  const usageCount = getFeatureUsageCount(feature);
  if (usageCount >= 3) {
    return `You've used ${friendlyName} ${usageCount} times. This is a ${tierLabel} feature. Get your key at ${PRICING_URL}`;
  }

  return `This is a ${tierLabel} feature. Get your key at ${PRICING_URL}`;
}

/**
 * The URL to show for the `codepliant upgrade` command.
 */
export const UPGRADE_URL = PRICING_URL;

// --- Feature Usage Tracking ---

import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const USAGE_DIR = path.join(os.homedir(), ".codepliant");
const USAGE_FILE = path.join(USAGE_DIR, "usage.json");

type UsageData = Record<string, number>;

function ensureUsageDir(): void {
  if (!fs.existsSync(USAGE_DIR)) {
    fs.mkdirSync(USAGE_DIR, { recursive: true });
  }
}

/**
 * Load usage data from disk. Returns a flat record of feature -> count.
 */
export function loadUsage(): UsageData {
  try {
    if (fs.existsSync(USAGE_FILE)) {
      return JSON.parse(fs.readFileSync(USAGE_FILE, "utf-8"));
    }
  } catch { /* ignore corrupt files */ }
  return {};
}

/**
 * Save usage data to disk.
 */
export function saveUsage(data: UsageData): void {
  ensureUsageDir();
  fs.writeFileSync(USAGE_FILE, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Reset usage data.
 */
export function resetUsage(): void {
  saveUsage({});
}

/**
 * Track usage of a feature. Returns the new count.
 */
export function trackFeatureUsage(feature: LicensedFeature): number {
  const data = loadUsage();
  data[feature] = (data[feature] || 0) + 1;
  const count = data[feature];
  saveUsage(data);
  return count;
}

/**
 * Get usage count for a specific feature.
 */
export function getFeatureUsageCount(feature: LicensedFeature): number {
  const data = loadUsage();
  return data[feature] || 0;
}

/**
 * Check if a feature is accessible and track its usage.
 * Returns null if the user has access, or a hint string if not.
 */
export function checkAndTrackFeature(
  license: LicenseInfo,
  feature: LicensedFeature,
): string | null {
  trackFeatureUsage(feature);
  if (hasFeatureAccess(license, feature)) return null;
  return getUpgradeHint(license, feature);
}
