import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateOpenSourceNotice } from "./open-source-notice.js";

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

describe("generateOpenSourceNotice", () => {
  it("returns null when no licenseScan is present", () => {
    const scan = makeScan();
    const result = generateOpenSourceNotice(scan);
    assert.strictEqual(result, null);
  });

  it("returns null when licenseScan has no dependencies and no projectLicense", () => {
    const scan = makeScan({
      licenseScan: {
        projectLicense: null,
        dependencies: [],
        copyleftDependencies: [],
        warnings: [],
      },
    });
    const result = generateOpenSourceNotice(scan);
    assert.strictEqual(result, null);
  });

  it("generates notice when dependencies are present", () => {
    const scan = makeScan({
      licenseScan: {
        projectLicense: null,
        dependencies: [
          { package: "express", version: "4.18.2", license: "MIT", isCopyleft: false },
        ],
        copyleftDependencies: [],
        warnings: [],
      },
    });
    const result = generateOpenSourceNotice(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Open Source Notice"));
    assert.ok(result.includes("express"));
    assert.ok(result.includes("MIT"));
  });

  it("generates notice when only projectLicense is present (no deps)", () => {
    const scan = makeScan({
      licenseScan: {
        projectLicense: "MIT",
        dependencies: [],
        copyleftDependencies: [],
        warnings: [],
      },
    });
    const result = generateOpenSourceNotice(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# Open Source Notice"));
    assert.ok(result.includes("**MIT**"));
  });

  it("uses default placeholders when no context provided", () => {
    const scan = makeScan({
      licenseScan: {
        projectLicense: "MIT",
        dependencies: [
          { package: "lodash", version: "4.17.21", license: "MIT", isCopyleft: false },
        ],
        copyleftDependencies: [],
        warnings: [],
      },
    });
    const result = generateOpenSourceNotice(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses context values when provided", () => {
    const scan = makeScan({
      licenseScan: {
        projectLicense: "MIT",
        dependencies: [
          { package: "lodash", version: "4.17.21", license: "MIT", isCopyleft: false },
        ],
        copyleftDependencies: [],
        warnings: [],
      },
    });
    const result = generateOpenSourceNotice(scan, {
      companyName: "Acme Corp",
      contactEmail: "oss@acme.com",
    })!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("oss@acme.com"));
    assert.ok(!result.includes("[Your Company Name]"));
  });

  it("includes project name and date", () => {
    const scan = makeScan({
      projectName: "my-app",
      licenseScan: {
        projectLicense: "Apache-2.0",
        dependencies: [],
        copyleftDependencies: [],
        warnings: [],
      },
    });
    const result = generateOpenSourceNotice(scan)!;
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(`**Last Updated:** ${today}`));
    assert.ok(result.includes("**Project:** my-app"));
  });

  it("displays project license in introduction", () => {
    const scan = makeScan({
      licenseScan: {
        projectLicense: "Apache-2.0",
        dependencies: [],
        copyleftDependencies: [],
        warnings: [],
      },
    });
    const result = generateOpenSourceNotice(scan)!;
    assert.ok(result.includes("**Apache-2.0**"));
  });

  it("shows license summary table grouped by license", () => {
    const scan = makeScan({
      licenseScan: {
        projectLicense: null,
        dependencies: [
          { package: "express", version: "4.18.2", license: "MIT", isCopyleft: false },
          { package: "lodash", version: "4.17.21", license: "MIT", isCopyleft: false },
          { package: "axios", version: "1.6.0", license: "Apache-2.0", isCopyleft: false },
        ],
        copyleftDependencies: [],
        warnings: [],
      },
    });
    const result = generateOpenSourceNotice(scan)!;
    assert.ok(result.includes("## 2. License Summary"));
    assert.ok(result.includes("| MIT | 2 | No |"));
    assert.ok(result.includes("| Apache-2.0 | 1 | No |"));
    assert.ok(result.includes("**Total open-source dependencies:** 3"));
  });

  it("includes copyleft dependencies section when copyleft deps exist", () => {
    const scan = makeScan({
      licenseScan: {
        projectLicense: null,
        dependencies: [
          { package: "express", version: "4.18.2", license: "MIT", isCopyleft: false },
          { package: "gcc-libs", version: "1.0.0", license: "GPL-3.0", isCopyleft: true },
        ],
        copyleftDependencies: [
          { package: "gcc-libs", version: "1.0.0", license: "GPL-3.0", isCopyleft: true },
        ],
        warnings: [],
      },
    });
    const result = generateOpenSourceNotice(scan)!;
    assert.ok(result.includes("Copyleft Dependencies"));
    assert.ok(result.includes("| gcc-libs | 1.0.0 | **GPL-3.0** |"));
    assert.ok(result.includes("Copyleft Compliance Requirements"));
    assert.ok(result.includes("source code of copyleft components"));
  });

  it("excludes copyleft section when no copyleft deps", () => {
    const scan = makeScan({
      licenseScan: {
        projectLicense: null,
        dependencies: [
          { package: "express", version: "4.18.2", license: "MIT", isCopyleft: false },
        ],
        copyleftDependencies: [],
        warnings: [],
      },
    });
    const result = generateOpenSourceNotice(scan)!;
    assert.ok(!result.includes("Copyleft Dependencies"));
    assert.ok(!result.includes("Copyleft Compliance Requirements"));
  });

  it("includes attribution notices grouped by license", () => {
    const scan = makeScan({
      licenseScan: {
        projectLicense: null,
        dependencies: [
          { package: "express", version: "4.18.2", license: "MIT", isCopyleft: false },
          { package: "lodash", version: "4.17.21", license: "MIT", isCopyleft: false },
          { package: "axios", version: "1.6.0", license: "Apache-2.0", isCopyleft: false },
        ],
        copyleftDependencies: [],
        warnings: [],
      },
    });
    const result = generateOpenSourceNotice(scan)!;
    assert.ok(result.includes("Attribution Notices"));
    assert.ok(result.includes("### MIT"));
    assert.ok(result.includes("### Apache-2.0"));
    // Packages sorted alphabetically within group
    const mitSection = result.substring(result.indexOf("### MIT"), result.indexOf("### Apache-2.0"));
    assert.ok(mitSection.indexOf("express") < mitSection.indexOf("lodash"));
  });

  it("includes license text summaries for known licenses", () => {
    const scan = makeScan({
      licenseScan: {
        projectLicense: null,
        dependencies: [
          { package: "express", version: "4.18.2", license: "MIT", isCopyleft: false },
        ],
        copyleftDependencies: [],
        warnings: [],
      },
    });
    const result = generateOpenSourceNotice(scan)!;
    assert.ok(result.includes("<details>"));
    assert.ok(result.includes("License text summary"));
    assert.ok(result.includes("Permission is hereby granted"));
  });

  it("includes warnings section when warnings exist", () => {
    const scan = makeScan({
      licenseScan: {
        projectLicense: null,
        dependencies: [
          { package: "foo", version: "1.0.0", license: "MIT", isCopyleft: false },
        ],
        copyleftDependencies: [],
        warnings: ["Unknown license in bar@2.0.0", "Could not parse license for baz"],
      },
    });
    const result = generateOpenSourceNotice(scan)!;
    assert.ok(result.includes("Warnings"));
    assert.ok(result.includes("- Unknown license in bar@2.0.0"));
    assert.ok(result.includes("- Could not parse license for baz"));
  });

  it("excludes warnings section when no warnings", () => {
    const scan = makeScan({
      licenseScan: {
        projectLicense: null,
        dependencies: [
          { package: "foo", version: "1.0.0", license: "MIT", isCopyleft: false },
        ],
        copyleftDependencies: [],
        warnings: [],
      },
    });
    const result = generateOpenSourceNotice(scan)!;
    assert.ok(!result.includes("## 5. Warnings") && !result.includes("license scanner produced the following warnings"));
  });

  it("includes Obtaining Source Code section", () => {
    const scan = makeScan({
      licenseScan: {
        projectLicense: null,
        dependencies: [
          { package: "foo", version: "1.0.0", license: "MIT", isCopyleft: false },
        ],
        copyleftDependencies: [],
        warnings: [],
      },
    });
    const result = generateOpenSourceNotice(scan)!;
    assert.ok(result.includes("Obtaining Source Code"));
    assert.ok(result.includes("30 days"));
  });

  it("includes Your Obligations section", () => {
    const scan = makeScan({
      licenseScan: {
        projectLicense: null,
        dependencies: [
          { package: "foo", version: "1.0.0", license: "MIT", isCopyleft: false },
        ],
        copyleftDependencies: [],
        warnings: [],
      },
    });
    const result = generateOpenSourceNotice(scan)!;
    assert.ok(result.includes("Your Obligations"));
    assert.ok(result.includes("OPEN_SOURCE_NOTICE.md"));
  });

  it("includes Contact section with email", () => {
    const scan = makeScan({
      licenseScan: {
        projectLicense: null,
        dependencies: [
          { package: "foo", version: "1.0.0", license: "MIT", isCopyleft: false },
        ],
        copyleftDependencies: [],
        warnings: [],
      },
    });
    const result = generateOpenSourceNotice(scan, {
      companyName: "TestCo",
      contactEmail: "oss@testco.com",
    })!;
    assert.ok(result.includes("Contact"));
    assert.ok(result.includes("oss@testco.com"));
  });

  it("includes Codepliant disclaimer footer", () => {
    const scan = makeScan({
      licenseScan: {
        projectLicense: null,
        dependencies: [
          { package: "foo", version: "1.0.0", license: "MIT", isCopyleft: false },
        ],
        copyleftDependencies: [],
        warnings: [],
      },
    });
    const result = generateOpenSourceNotice(scan)!;
    assert.ok(result.includes("Generated by Codepliant"));
    assert.ok(result.includes("legal counsel"));
  });

  it("numbers sections correctly without copyleft or warnings", () => {
    const scan = makeScan({
      licenseScan: {
        projectLicense: null,
        dependencies: [
          { package: "foo", version: "1.0.0", license: "MIT", isCopyleft: false },
        ],
        copyleftDependencies: [],
        warnings: [],
      },
    });
    const result = generateOpenSourceNotice(scan)!;
    // No copyleft, no warnings: Introduction(1), License Summary(2), Attribution(3), Obtaining(4), Obligations(5), Contact(6)
    assert.ok(result.includes("## 1. Introduction"));
    assert.ok(result.includes("## 2. License Summary"));
    assert.ok(result.includes("## 3. Attribution Notices"));
    assert.ok(result.includes("## 4. Obtaining Source Code"));
    assert.ok(result.includes("## 5. Your Obligations"));
    assert.ok(result.includes("## 6. Contact"));
  });

  it("numbers sections correctly with copyleft and warnings", () => {
    const scan = makeScan({
      licenseScan: {
        projectLicense: null,
        dependencies: [
          { package: "foo", version: "1.0.0", license: "GPL-3.0", isCopyleft: true },
        ],
        copyleftDependencies: [
          { package: "foo", version: "1.0.0", license: "GPL-3.0", isCopyleft: true },
        ],
        warnings: ["Some warning"],
      },
    });
    const result = generateOpenSourceNotice(scan)!;
    // With copyleft and warnings: Introduction(1), Summary(2), Copyleft(3), Attribution(4), Warnings(5), Obtaining(6), Obligations(7), Contact(8)
    assert.ok(result.includes("## 1. Introduction"));
    assert.ok(result.includes("## 2. License Summary"));
    assert.ok(result.includes("## 3. Copyleft Dependencies"));
    assert.ok(result.includes("## 4. Attribution Notices"));
    assert.ok(result.includes("## 5. Warnings"));
    assert.ok(result.includes("## 6. Obtaining Source Code"));
    assert.ok(result.includes("## 7. Your Obligations"));
    assert.ok(result.includes("## 8. Contact"));
  });

  it("marks copyleft licenses in the summary table", () => {
    const scan = makeScan({
      licenseScan: {
        projectLicense: null,
        dependencies: [
          { package: "foo", version: "1.0.0", license: "GPL-3.0", isCopyleft: true },
          { package: "bar", version: "2.0.0", license: "MIT", isCopyleft: false },
        ],
        copyleftDependencies: [
          { package: "foo", version: "1.0.0", license: "GPL-3.0", isCopyleft: true },
        ],
        warnings: [],
      },
    });
    const result = generateOpenSourceNotice(scan)!;
    assert.ok(result.includes("| GPL-3.0 | 1 | Yes |"));
    assert.ok(result.includes("| MIT | 1 | No |"));
  });
});
