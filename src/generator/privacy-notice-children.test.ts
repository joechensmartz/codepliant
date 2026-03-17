import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generatePrivacyNoticeChildren } from "./privacy-notice-children.js";
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

function makeCOPPAScan(overrides: Partial<ScanResult> = {}): ScanResult {
  return makeScan({
    complianceNeeds: [
      { document: "COPPA Compliance", reason: "Children data detected", priority: "required" },
    ],
    services: [makeService("next-auth", "auth")],
    ...overrides,
  });
}

describe("generatePrivacyNoticeChildren", () => {
  it("returns null when no COPPA compliance need", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
      complianceNeeds: [],
    });
    const result = generatePrivacyNoticeChildren(scan);
    assert.strictEqual(result, null);
  });

  it("returns null when complianceNeeds has unrelated documents", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics")],
      complianceNeeds: [
        { document: "GDPR", reason: "EU users", priority: "required" },
      ],
    });
    const result = generatePrivacyNoticeChildren(scan);
    assert.strictEqual(result, null);
  });

  it("generates document when COPPA compliance need exists", () => {
    const scan = makeCOPPAScan();
    const result = generatePrivacyNoticeChildren(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Privacy Notice for Young Users"));
  });

  it("uses context company name, email, and website", () => {
    const scan = makeCOPPAScan();
    const ctx: GeneratorContext = {
      companyName: "KidSafe Inc",
      contactEmail: "parents@kidsafe.com",
      website: "kidsafe.com",
    };
    const result = generatePrivacyNoticeChildren(scan, ctx)!;
    assert.ok(result.includes("KidSafe Inc"));
    assert.ok(result.includes("parents@kidsafe.com"));
    assert.ok(result.includes("kidsafe.com"));
  });

  it("uses placeholder values when no context provided", () => {
    const scan = makeCOPPAScan();
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
    assert.ok(result.includes("[your-website.com]"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeCOPPAScan();
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes child-friendly intro with parent guidance", () => {
    const scan = makeCOPPAScan();
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(result.includes("parent or guardian should read this with you"));
  });

  it("includes COPPA reference for parents", () => {
    const scan = makeCOPPAScan();
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(result.includes("Children's Online Privacy Protection Act"));
    assert.ok(result.includes("COPPA"));
  });

  it("includes auth section when auth services present", () => {
    const scan = makeCOPPAScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(result.includes("Your Account Info"));
    assert.ok(result.includes("username"));
    assert.ok(result.includes("password"));
  });

  it("does not include auth section when no auth services", () => {
    const scan = makeCOPPAScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(!result.includes("Your Account Info"));
  });

  it("includes analytics section when analytics services present", () => {
    const scan = makeCOPPAScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(result.includes("How You Use Our App"));
    assert.ok(result.includes("pages you visit"));
  });

  it("includes analytics section when advertising services present", () => {
    const scan = makeCOPPAScan({
      services: [makeService("google-ads", "advertising")],
    });
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(result.includes("How You Use Our App"));
  });

  it("includes storage section when storage services present", () => {
    const scan = makeCOPPAScan({
      services: [makeService("s3", "storage")],
    });
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(result.includes("Things You Create"));
    assert.ok(result.includes("Pictures, drawings, or files"));
  });

  it("includes storage section when database services present", () => {
    const scan = makeCOPPAScan({
      services: [makeService("prisma", "database")],
    });
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(result.includes("Things You Create"));
  });

  it("includes AI section when AI services present", () => {
    const scan = makeCOPPAScan({
      services: [makeService("openai", "ai")],
    });
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(result.includes("Smart Helper"));
    assert.ok(result.includes("does not remember you"));
  });

  it("does not include AI section when no AI services", () => {
    const scan = makeCOPPAScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(!result.includes("Smart Helper"));
  });

  it("always includes device info section", () => {
    const scan = makeCOPPAScan();
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(result.includes("Your Device Info"));
  });

  it("includes why we collect section with table", () => {
    const scan = makeCOPPAScan();
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(result.includes("Why Do We Collect This"));
    assert.ok(result.includes("To make the app work"));
    assert.ok(result.includes("To keep you safe"));
  });

  it("includes sharing section with who can see info", () => {
    const scan = makeCOPPAScan();
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(result.includes("Who Can See Your Information"));
    assert.ok(result.includes("Your parents or guardians"));
    assert.ok(result.includes("Our team"));
  });

  it("includes trusted helpers when services are present", () => {
    const scan = makeCOPPAScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(result.includes("Helpers we trust"));
  });

  it("includes NEVER list in sharing section", () => {
    const scan = makeCOPPAScan();
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(result.includes("We NEVER"));
    assert.ok(result.includes("Sell your information"));
    assert.ok(result.includes("Show your information to advertisers"));
  });

  it("includes parent superpowers section", () => {
    const scan = makeCOPPAScan();
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(result.includes("Parent's Superpowers"));
    assert.ok(result.includes("See everything"));
    assert.ok(result.includes("Delete everything"));
    assert.ok(result.includes("Say no"));
    assert.ok(result.includes("Get a copy"));
    assert.ok(result.includes("30 days"));
  });

  it("includes safety section about encryption", () => {
    const scan = makeCOPPAScan();
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(result.includes("Keep Your Information Safe"));
    assert.ok(result.includes("encryption"));
    assert.ok(result.includes("digital fortress"));
  });

  it("includes cookies section when analytics present", () => {
    const scan = makeCOPPAScan({
      services: [makeService("posthog", "analytics")],
    });
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(result.includes("Cookies (The Computer Kind!)"));
    assert.ok(result.includes("Must-have cookies"));
    assert.ok(result.includes("Helper cookies"));
  });

  it("does not include cookies section when no analytics or advertising", () => {
    const scan = makeCOPPAScan({
      services: [makeService("next-auth", "auth")],
    });
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(!result.includes("Cookies (The Computer Kind!)"));
  });

  it("includes contact section", () => {
    const scan = makeCOPPAScan();
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(result.includes("How to Reach Us"));
    assert.ok(result.includes("parent or guardian help you"));
  });

  it("includes changes to notice section", () => {
    const scan = makeCOPPAScan();
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(result.includes("If We Change This Notice"));
    assert.ok(result.includes("ask your parent for permission first"));
  });

  it("includes quick summary table", () => {
    const scan = makeCOPPAScan();
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(result.includes("Quick Summary"));
    assert.ok(result.includes("Do you sell my information?"));
    assert.ok(result.includes("No, never!"));
  });

  it("includes disclaimer about auto-generation", () => {
    const scan = makeCOPPAScan();
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("legal counsel"));
  });

  it("numbers sections sequentially", () => {
    const scan = makeCOPPAScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
        makeService("s3", "storage"),
      ],
    });
    const result = generatePrivacyNoticeChildren(scan)!;
    const lines = result.split("\n");
    const sectionNums = lines
      .filter((l) => /^##\s+\d+\./.test(l))
      .map((l) => {
        const match = l.match(/^##\s+(\d+)\./);
        return match ? parseInt(match[1], 10) : 0;
      });

    for (let i = 0; i < sectionNums.length; i++) {
      assert.strictEqual(
        sectionNums[i],
        i + 1,
        `Section ${i + 1} should be numbered ${i + 1}, got ${sectionNums[i]}`,
      );
    }
  });

  it("handles all service categories together", () => {
    const scan = makeCOPPAScan({
      services: [
        makeService("next-auth", "auth"),
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
        makeService("s3", "storage"),
        makeService("sendgrid", "email"),
      ],
    });
    const result = generatePrivacyNoticeChildren(scan)!;
    assert.ok(result.includes("Your Account Info"));
    assert.ok(result.includes("How You Use Our App"));
    assert.ok(result.includes("Things You Create"));
    assert.ok(result.includes("Smart Helper"));
    assert.ok(result.includes("Cookies (The Computer Kind!)"));
  });
});
