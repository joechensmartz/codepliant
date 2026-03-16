/**
 * Billing Status & Usage Commands
 *
 * Provides:
 *   - `codepliant billing status` — show current plan details
 *   - `codepliant billing usage` — show feature usage statistics
 *   - `codepliant billing portal` — open Stripe customer portal
 */

import * as os from "os";
import { exec } from "child_process";
import { checkLicense, loadUsage, type LicenseInfo, type LicenseTier, type LicensedFeature } from "../licensing/index.js";
import { PLAN_DETAILS, openBrowser, type PlanName } from "./stripe-checkout.js";

// ── Types ─────────────────────────────────────────────────────────

export interface BillingStatus {
  tier: LicenseTier;
  planName: string;
  price: string;
  features: string[];
  licenseKeyPrefix: string | null;
  valid: boolean;
}

export interface FeatureUsageStat {
  feature: string;
  count: number;
  requiredTier: string;
}

export interface BillingUsage {
  tier: LicenseTier;
  features: FeatureUsageStat[];
  totalAttempts: number;
}

export interface BillingPortalResult {
  opened: boolean;
  url: string;
}

// ── Constants ─────────────────────────────────────────────────────

const PORTAL_URL = "https://github.com/joechensmartz/codepliant";
const FREE_PLAN = {
  name: "Free",
  price: "$0/mo",
  features: [
    "CLI scanning",
    "Markdown output",
    "Up to 5 document types",
    "Community support",
  ],
};

const TIER_LABELS: Record<LicenseTier, string> = {
  free: "Free",
  pro: "Pro",
  team: "Team",
};

// ── Feature tier mapping ──────────────────────────────────────────

const FEATURE_TIER_MAP: Record<string, string> = {
  "notion-export": "Pro",
  "confluence-export": "Pro",
  "cookie-banner": "Pro",
  "compliance-report": "Pro",
  "api-server": "Pro",
  "watch-mode": "Pro",
  "all-output-formats": "Pro",
  "unlimited-doc-types": "Pro",
  "compliance-api": "Pro",
  "executive-summary": "Pro",
  "scheduled-scans": "Pro",
  "scan-all": "Team",
  "generate-all": "Team",
  "webhook-notifications": "Team",
};

// ── Billing Status ────────────────────────────────────────────────

/**
 * Get the current billing/plan status.
 */
export function getBillingStatus(configKey?: string): BillingStatus {
  const license = checkLicense(configKey);

  if (license.tier === "free") {
    return {
      tier: "free",
      planName: FREE_PLAN.name,
      price: FREE_PLAN.price,
      features: FREE_PLAN.features,
      licenseKeyPrefix: null,
      valid: true,
    };
  }

  const planKey: PlanName = license.tier === "team" ? "team" : "pro";
  const plan = PLAN_DETAILS[planKey];

  // Mask the license key — show only first 8 chars
  const keyPrefix = license.key ? license.key.slice(0, 8) + "..." : null;

  return {
    tier: license.tier,
    planName: plan.name,
    price: plan.price,
    features: [...plan.features],
    licenseKeyPrefix: keyPrefix,
    valid: license.valid,
  };
}

// ── Billing Usage ─────────────────────────────────────────────────

/**
 * Get feature usage statistics from ~/.codepliant/usage.json.
 */
export function getBillingUsage(configKey?: string): BillingUsage {
  const license = checkLicense(configKey);
  const usage = loadUsage();

  const features: FeatureUsageStat[] = [];
  let totalAttempts = 0;

  for (const [feature, count] of Object.entries(usage)) {
    if (typeof count === "number" && count > 0) {
      features.push({
        feature,
        count,
        requiredTier: FEATURE_TIER_MAP[feature] || "Pro",
      });
      totalAttempts += count;
    }
  }

  // Sort by count descending
  features.sort((a, b) => b.count - a.count);

  return {
    tier: license.tier,
    features,
    totalAttempts,
  };
}

// ── Billing Portal ────────────────────────────────────────────────

/**
 * Open the Stripe customer portal in the browser.
 */
export function openBillingPortal(): BillingPortalResult {
  openBrowser(PORTAL_URL);
  return {
    opened: true,
    url: PORTAL_URL,
  };
}
