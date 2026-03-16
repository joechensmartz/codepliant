/**
 * Stripe Checkout Integration
 *
 * Handles upgrade flow, license activation/deactivation.
 * Currently generates checkout URLs — actual payment processing
 * happens on the hosted Stripe page.
 */

import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { exec } from "child_process";

export type PlanName = "pro" | "team";

export interface PlanDetails {
  name: string;
  price: string;
  features: string[];
  priceId: string;
}

export const PLAN_DETAILS: Record<PlanName, PlanDetails> = {
  pro: {
    name: "Pro",
    price: "$29/mo",
    features: [
      "All output formats (HTML, PDF, JSON, Notion, Confluence)",
      "Unlimited document types",
      "Watch mode — auto-regenerate on code changes",
      "API server — serve compliance data via HTTP",
      "Cookie consent banner generation",
      "Comprehensive compliance report",
      "Priority support",
    ],
    priceId: "price_pro_monthly",
  },
  team: {
    name: "Team",
    price: "$79/mo",
    features: [
      "Everything in Pro",
      "Multi-project scanning (scan-all / generate-all)",
      "Webhook notifications (Slack, Teams, email)",
      "Team config sharing",
      "Audit trail",
      "SSO login",
      "Dedicated support",
    ],
    priceId: "price_team_monthly",
  },
};

const CHECKOUT_BASE = "https://github.com/joechensmartz/codepliant";
const LICENSE_DIR = path.join(os.homedir(), ".codepliant");
const LICENSE_FILE = path.join(LICENSE_DIR, "license.json");

/**
 * Open a URL in the user's default browser.
 */
export function openBrowser(url: string): void {
  const platform = process.platform;
  const cmd =
    platform === "darwin" ? "open" :
    platform === "win32" ? "start" :
    "xdg-open";

  exec(`${cmd} "${url}"`);
}

/**
 * Generate checkout URL and open browser.
 */
export function handleUpgrade(plan: PlanName): { url: string } {
  const details = PLAN_DETAILS[plan];
  const url = `${CHECKOUT_BASE}?plan=${plan}&price=${details.priceId}`;
  openBrowser(url);
  return { url };
}

/**
 * Validate a license key format.
 */
export function validateLicenseKey(key: string): boolean {
  // Keys are prefixed with tier: pro_xxx or team_xxx
  return /^(pro|team)_[a-zA-Z0-9]{16,}$/.test(key);
}

function ensureLicenseDir(): void {
  if (!fs.existsSync(LICENSE_DIR)) {
    fs.mkdirSync(LICENSE_DIR, { recursive: true });
  }
}

/**
 * Activate a license key.
 */
export function handleActivate(
  projectPath: string,
  key: string,
): { success: boolean; message: string; tier?: string } {
  if (!validateLicenseKey(key)) {
    return {
      success: false,
      message: "Invalid license key format. Keys start with pro_ or team_ followed by 16+ alphanumeric characters.",
    };
  }

  const tier = key.startsWith("team_") ? "team" : "pro";

  // Save to global config
  ensureLicenseDir();
  fs.writeFileSync(
    LICENSE_FILE,
    JSON.stringify({ key, tier, activatedAt: new Date().toISOString() }, null, 2),
    "utf-8",
  );

  // Also save to project config
  const configPath = path.join(projectPath, ".codepliantrc.json");
  try {
    let config: Record<string, unknown> = {};
    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    }
    config.licenseKey = key;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
  } catch {
    // Project config write is optional
  }

  return {
    success: true,
    message: `License activated successfully! Tier: ${tier}`,
    tier,
  };
}

/**
 * Deactivate the current license key.
 */
export function handleDeactivate(): { success: boolean; message: string } {
  try {
    if (fs.existsSync(LICENSE_FILE)) {
      fs.unlinkSync(LICENSE_FILE);
    }
    return { success: true, message: "License deactivated." };
  } catch {
    return { success: false, message: "Failed to deactivate license." };
  }
}
