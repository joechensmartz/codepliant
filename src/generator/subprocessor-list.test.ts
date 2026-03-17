import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateSubprocessorList } from "./subprocessor-list.js";
import type { GeneratorContext } from "./index.js";

function makeService(
  name: string,
  category: DetectedService["category"],
  dataCollected: string[] = ["test data"],
): DetectedService {
  return {
    name,
    category,
    evidence: [{ type: "dependency", file: "package.json", detail: `${name} detected` }],
    dataCollected,
  };
}

function makeScan(overrides: Partial<ScanResult> = {}): ScanResult {
  return {
    projectName: "test-project",
    projectPath: "/tmp/test",
    scannedAt: "2026-01-01",
    services: [],
    dataCategories: [],
    complianceNeeds: [],
    ...overrides,
  };
}

/** Helper: build a scan with enough third-party services (MIN_SERVICES = 3, excludes self-hosted). */
function makeFullScan(extra: DetectedService[] = []): ScanResult {
  return makeScan({
    services: [
      makeService("stripe", "payment", ["payment info", "email"]),
      makeService("posthog", "analytics", ["page views", "device info"]),
      makeService("@sendgrid/mail", "email", ["email address"]),
      ...extra,
    ],
  });
}

describe("generateSubprocessorList", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateSubprocessorList(scan), null);
  });

  it("returns null when fewer than 3 third-party services detected", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    assert.strictEqual(generateSubprocessorList(scan), null);
  });

  it("returns null when all services are self-hosted", () => {
    const scan = makeScan({
      services: [
        makeService("prisma", "database", ["user records"]),
        makeService("nodemailer", "email", ["email address"]),
        makeService("ioredis", "database", ["cache data"]),
        makeService("passport", "auth", ["user credentials"]),
      ],
    });
    assert.strictEqual(generateSubprocessorList(scan), null);
  });

  it("returns null when only 2 third-party services among self-hosted ones", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
        makeService("prisma", "database", ["user records"]),
        makeService("mongoose", "database", ["user records"]),
      ],
    });
    assert.strictEqual(generateSubprocessorList(scan), null);
  });

  // ── Generation with relevant services ──────────────────────────────

  it("generates list when exactly 3 third-party services detected", () => {
    const scan = makeFullScan();
    const result = generateSubprocessorList(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Sub-Processor List"));
  });

  it("generates list with more than 3 third-party services", () => {
    const scan = makeFullScan([
      makeService("openai", "ai", ["user prompts"]),
      makeService("@sentry/node", "monitoring", ["error traces"]),
    ]);
    const result = generateSubprocessorList(scan);
    assert.ok(result !== null);
  });

  it("generates list when mix of third-party and self-hosted services", () => {
    const scan = makeFullScan([
      makeService("prisma", "database", ["user records"]),
    ]);
    const result = generateSubprocessorList(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Sub-Processor List"));
  });

  // ── Context values ────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeFullScan();
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "legal@acme.com" };
    const result = generateSubprocessorList(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses context contact email", () => {
    const scan = makeFullScan();
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "legal@acme.com" };
    const result = generateSubprocessorList(scan, ctx)!;
    assert.ok(result.includes("legal@acme.com"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeFullScan();
    const result = generateSubprocessorList(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses placeholder email when no context", () => {
    const scan = makeFullScan();
    const result = generateSubprocessorList(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  // ── Key content: title and overview ────────────────────────────────

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeFullScan();
    const result = generateSubprocessorList(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes project name", () => {
    const scan = makeFullScan();
    const result = generateSubprocessorList(scan)!;
    assert.ok(result.includes("test-project"));
  });

  it("includes overview section", () => {
    const scan = makeFullScan();
    const result = generateSubprocessorList(scan)!;
    assert.ok(result.includes("## Overview"));
    assert.ok(result.includes("third-party sub-processors"));
  });

  // ── Sub-Processor Table ───────────────────────────────────────────

  it("includes sub-processor table with correct columns", () => {
    const scan = makeFullScan();
    const result = generateSubprocessorList(scan)!;
    assert.ok(result.includes("## Sub-Processors"));
    assert.ok(result.includes("Sub-Processor"));
    assert.ok(result.includes("Purpose"));
    assert.ok(result.includes("Data Processed"));
    assert.ok(result.includes("Location"));
    assert.ok(result.includes("Privacy Policy"));
  });

  it("lists Stripe with correct provider name", () => {
    const scan = makeFullScan();
    const result = generateSubprocessorList(scan)!;
    assert.ok(result.includes("Stripe"));
  });

  it("lists PostHog with correct provider name", () => {
    const scan = makeFullScan();
    const result = generateSubprocessorList(scan)!;
    assert.ok(result.includes("PostHog"));
  });

  it("lists SendGrid with correct provider name", () => {
    const scan = makeFullScan();
    const result = generateSubprocessorList(scan)!;
    assert.ok(result.includes("SendGrid"));
  });

  it("includes purpose descriptions", () => {
    const scan = makeFullScan();
    const result = generateSubprocessorList(scan)!;
    assert.ok(result.includes("Payment processing and billing"));
    assert.ok(result.includes("Product analytics and usage tracking"));
    assert.ok(result.includes("email delivery") || result.includes("Email"));
  });

  it("includes data processed from service data", () => {
    const scan = makeFullScan();
    const result = generateSubprocessorList(scan)!;
    assert.ok(result.includes("payment info"));
    assert.ok(result.includes("page views"));
    assert.ok(result.includes("email address"));
  });

  it("includes location information — US providers", () => {
    const scan = makeFullScan();
    const result = generateSubprocessorList(scan)!;
    assert.ok(result.includes("US"));
  });

  it("includes EU location for EU-based providers", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
        makeService("@lemonsqueezy/lemonsqueezy.js", "payment", ["billing info"]),
      ],
    });
    const result = generateSubprocessorList(scan)!;
    assert.ok(result.includes("EU"));
  });

  it("includes privacy policy links", () => {
    const scan = makeFullScan();
    const result = generateSubprocessorList(scan)!;
    assert.ok(result.includes("stripe.com/privacy"));
    assert.ok(result.includes("posthog.com/privacy"));
  });

  // ── Deduplication ─────────────────────────────────────────────────

  it("deduplicates services with the same provider name", () => {
    const scan = makeScan({
      services: [
        makeService("@sentry/node", "monitoring", ["error traces"]),
        makeService("@sentry/nextjs", "monitoring", ["error traces"]),
        makeService("@sentry/react", "monitoring", ["error traces"]),
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generateSubprocessorList(scan)!;
    // Sentry should appear only once
    const sentryMatches = result.match(/\| Sentry \|/g);
    assert.ok(sentryMatches !== null);
    assert.strictEqual(sentryMatches.length, 1);
  });

  // ── Self-hosted exclusion ─────────────────────────────────────────

  it("excludes self-hosted services from the table", () => {
    const scan = makeFullScan([
      makeService("prisma", "database", ["user records"]),
      makeService("ioredis", "database", ["cache data"]),
    ]);
    const result = generateSubprocessorList(scan)!;
    assert.ok(!result.includes("Prisma (self-hosted)"));
    assert.ok(!result.includes("Redis (self-hosted)"));
  });

  // ── Changes and objection sections ────────────────────────────────

  it("includes changes to this list section", () => {
    const scan = makeFullScan();
    const result = generateSubprocessorList(scan)!;
    assert.ok(result.includes("## Changes to This List"));
    assert.ok(result.includes("Data Processing Agreement"));
  });

  it("includes how to object section", () => {
    const scan = makeFullScan();
    const result = generateSubprocessorList(scan)!;
    assert.ok(result.includes("## How to Object"));
    assert.ok(result.includes("object to the appointment"));
  });

  // ── Footer and disclaimer ─────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeFullScan();
    const result = generateSubprocessorList(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("Review and verify"));
  });
});
