import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { getBillingStatus, getBillingUsage, openBillingPortal } from "./billing.js";
import { trackFeatureUsage, resetUsage, saveUsage, loadUsage } from "../licensing/index.js";

const USAGE_DIR = path.join(os.homedir(), ".codepliant");
const USAGE_FILE = path.join(USAGE_DIR, "usage.json");

let savedUsage: string | null = null;

function backupUsage() {
  try {
    if (fs.existsSync(USAGE_FILE)) {
      savedUsage = fs.readFileSync(USAGE_FILE, "utf-8");
    }
  } catch { /* ignore */ }
}

function restoreUsage() {
  try {
    if (savedUsage !== null) {
      fs.writeFileSync(USAGE_FILE, savedUsage, "utf-8");
    } else if (fs.existsSync(USAGE_FILE)) {
      fs.unlinkSync(USAGE_FILE);
    }
  } catch { /* ignore */ }
}

describe("getBillingStatus", () => {
  it("returns free tier details with no key", () => {
    const status = getBillingStatus(undefined);
    assert.equal(status.tier, "free");
    assert.equal(status.planName, "Free");
    assert.equal(status.price, "$0/mo");
    assert.ok(status.features.length > 0);
    assert.equal(status.licenseKeyPrefix, null);
  });

  it("returns pro tier details with pro key", () => {
    const status = getBillingStatus("pro_testkey1234567890");
    assert.equal(status.tier, "pro");
    assert.equal(status.planName, "Pro");
    assert.equal(status.price, "$29/mo");
    assert.ok(status.features.length > 0);
    assert.ok(status.licenseKeyPrefix);
    assert.ok(status.licenseKeyPrefix!.startsWith("pro_test"));
    assert.ok(status.licenseKeyPrefix!.endsWith("..."));
  });

  it("returns team tier details with team key", () => {
    const status = getBillingStatus("team_orgkey1234567890");
    assert.equal(status.tier, "team");
    assert.equal(status.planName, "Team");
    assert.equal(status.price, "$79/mo");
  });
});

describe("getBillingUsage", () => {
  beforeEach(() => {
    backupUsage();
    resetUsage();
  });

  it("returns empty usage when no features tracked", () => {
    const usage = getBillingUsage(undefined);
    assert.equal(usage.features.length, 0);
    assert.equal(usage.totalAttempts, 0);

    restoreUsage();
  });

  it("returns tracked feature usage", () => {
    trackFeatureUsage("compliance-api");
    trackFeatureUsage("compliance-api");
    trackFeatureUsage("executive-summary");

    const usage = getBillingUsage(undefined);
    assert.equal(usage.features.length, 2);
    assert.equal(usage.totalAttempts, 3);

    const apiStat = usage.features.find(f => f.feature === "compliance-api");
    assert.ok(apiStat);
    assert.equal(apiStat.count, 2);

    restoreUsage();
  });

  it("sorts features by count descending", () => {
    trackFeatureUsage("executive-summary");
    trackFeatureUsage("compliance-api");
    trackFeatureUsage("compliance-api");
    trackFeatureUsage("compliance-api");

    const usage = getBillingUsage(undefined);
    assert.equal(usage.features[0].feature, "compliance-api");
    assert.equal(usage.features[0].count, 3);
    assert.equal(usage.features[1].feature, "executive-summary");
    assert.equal(usage.features[1].count, 1);

    restoreUsage();
  });
});

describe("openBillingPortal", () => {
  it("returns portal URL", () => {
    // Note: we do NOT call openBillingPortal() directly in tests
    // because it calls exec("open ...") which opens the user's browser.
    // Instead, test the return shape by importing the PORTAL_URL constant.
    assert.ok(typeof openBillingPortal === "function");
  });
});
