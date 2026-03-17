import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateAIGovernanceFramework } from "./ai-governance.js";
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

// ── Null returns ──────────────────────────────────────────────────────

describe("generateAIGovernanceFramework", () => {
  it("returns null when no services are present", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateAIGovernanceFramework(scan), null);
  });

  it("returns null when no AI services are present", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    assert.strictEqual(generateAIGovernanceFramework(scan), null);
  });

  // ── Basic generation ────────────────────────────────────────────────

  it("generates output when AI services are present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts", "generated content"])],
    });
    const result = generateAIGovernanceFramework(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("# AI Governance Framework"));
  });

  it("includes project name", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("test-project"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  // ── Context values ──────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "ai@acme.com" };
    const result = generateAIGovernanceFramework(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "ai@acme.com" };
    const result = generateAIGovernanceFramework(scan, ctx)!;
    assert.ok(result.includes("ai@acme.com"));
  });

  it("uses placeholder email when no context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("uses context DPO name and email", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      dpoName: "Jane Smith",
      dpoEmail: "dpo@acme.com",
    };
    const result = generateAIGovernanceFramework(scan, ctx)!;
    assert.ok(result.includes("Jane Smith"));
    assert.ok(result.includes("dpo@acme.com"));
  });

  it("uses placeholder DPO values when no context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("[Data Protection Officer Name]"));
    assert.ok(result.includes("[dpo@example.com]"));
  });

  // ── AI services listed in scope ─────────────────────────────────────

  it("lists each AI service in scope section", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("@anthropic-ai/sdk", "ai", ["conversation history"]),
      ],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("**openai**"));
    assert.ok(result.includes("**@anthropic-ai/sdk**"));
  });

  it("includes data collected for each service in scope", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts", "generated content"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("user prompts, generated content"));
  });

  it("only lists AI-category services in scope, not other services", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("stripe", "payment", ["payment info"]),
      ],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("**openai**"));
    assert.ok(!result.includes("**stripe**"));
  });

  // ── Risk level determination ────────────────────────────────────────

  it("determines minimal risk for internal AI data", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["internal logs"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("Minimal Risk"));
  });

  it("determines limited risk for user-facing AI", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts", "generated content"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("Limited Risk"));
  });

  it("determines high risk for biometric data", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["biometric data"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("High Risk"));
  });

  it("determines high risk for facial recognition", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["facial recognition scores"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("High Risk"));
  });

  it("determines high risk for credit scoring", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["credit scoring results"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("High Risk"));
  });

  it("determines high risk for hiring/recruitment", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["hiring decisions"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("High Risk"));
  });

  it("determines high risk for healthcare diagnosis", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["healthcare diagnosis"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("High Risk"));
  });

  it("uses context aiRiskLevel override", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["internal logs"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", aiRiskLevel: "high" };
    const result = generateAIGovernanceFramework(scan, ctx)!;
    assert.ok(result.includes("High Risk"));
  });

  // ── Regulatory alignment section ────────────────────────────────────

  it("includes EU AI Act regulatory alignment", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("EU AI Act"));
    assert.ok(result.includes("2024/1689"));
  });

  it("includes NIST AI RMF reference", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("NIST AI"));
    assert.ok(result.includes("GOVERN"));
    assert.ok(result.includes("MAP"));
    assert.ok(result.includes("MEASURE"));
    assert.ok(result.includes("MANAGE"));
  });

  // ── Conditional sections based on risk level ────────────────────────

  it("shows full transparency for limited risk", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("Full transparency required"));
  });

  it("shows basic disclosure for minimal risk", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["internal logs"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("Basic disclosure"));
  });

  it("shows conformity assessment required for high risk", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["biometric data"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("Required before deployment"));
    assert.ok(result.includes("EU database registration required"));
    assert.ok(result.includes("Mandatory human-in-the-loop"));
  });

  it("shows self-assessment for non-high risk", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("Self-assessment"));
  });

  // ── Risk assessment conditional messages ────────────────────────────

  it("includes high risk action required message", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["biometric data"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("conformity assessment"));
    assert.ok(result.includes("EU database"));
    assert.ok(result.includes("Annex IV"));
  });

  it("includes limited risk transparency message", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("transparency obligations"));
  });

  it("includes minimal risk note message", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["internal logs"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("no mandatory requirements"));
  });

  // ── Roles and responsibilities ──────────────────────────────────────

  it("includes roles and responsibilities section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("Roles and Responsibilities"));
    assert.ok(result.includes("AI Governance Officer"));
    assert.ok(result.includes("Development Team"));
    assert.ok(result.includes("Compliance Team"));
    assert.ok(result.includes("Executive Leadership"));
  });

  // ── Lifecycle controls ──────────────────────────────────────────────

  it("includes AI development lifecycle controls", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("AI Development Lifecycle Controls"));
    assert.ok(result.includes("Planning & Design"));
    assert.ok(result.includes("Data Preparation"));
    assert.ok(result.includes("Development & Training"));
    assert.ok(result.includes("Testing & Validation"));
    assert.ok(result.includes("Deployment"));
    assert.ok(result.includes("Monitoring & Maintenance"));
  });

  it("includes lifecycle checklist items", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("[ ]"));
    assert.ok(result.includes("prompt injection"));
  });

  // ── Vendor evaluation ───────────────────────────────────────────────

  it("includes vendor evaluation section for each AI service", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("@anthropic-ai/sdk", "ai", ["conversation history"]),
      ],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("#### openai"));
    assert.ok(result.includes("#### @anthropic-ai/sdk"));
    assert.ok(result.includes("Data processing agreement"));
    assert.ok(result.includes("SOC 2 Type II"));
  });

  // ── Bias testing ────────────────────────────────────────────────────

  it("includes bias testing requirements section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("Bias Testing Requirements"));
    assert.ok(result.includes("Protected Characteristics"));
    assert.ok(result.includes("Race / Ethnicity"));
    assert.ok(result.includes("Gender"));
  });

  it("includes bias testing methodology", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("Counterfactual testing"));
    assert.ok(result.includes("Red teaming"));
  });

  // ── Transparency and documentation ──────────────────────────────────

  it("includes transparency requirements referencing Art. 50", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("Transparency and Documentation"));
    assert.ok(result.includes("Art. 50"));
    assert.ok(result.includes("Annex IV"));
  });

  // ── Incident response ───────────────────────────────────────────────

  it("includes AI-specific incident response section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("AI-Specific Incident Response"));
    assert.ok(result.includes("Prompt injection exploit"));
    assert.ok(result.includes("Systematic bias detected"));
  });

  // ── Review and audit ────────────────────────────────────────────────

  it("includes review and audit schedule", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("Review and Audit Schedule"));
    assert.ok(result.includes("Quarterly"));
    assert.ok(result.includes("Annually"));
  });

  // ── Contact ─────────────────────────────────────────────────────────

  it("includes contact section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "ai@acme.com",
      dpoName: "Jane",
      dpoEmail: "dpo@acme.com",
    };
    const result = generateAIGovernanceFramework(scan, ctx)!;
    assert.ok(result.includes("## 11. Contact"));
    assert.ok(result.includes("ai@acme.com"));
    assert.ok(result.includes("Jane"));
    assert.ok(result.includes("dpo@acme.com"));
  });

  // ── Disclaimer ──────────────────────────────────────────────────────

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("reviewed"));
  });

  // ── Section numbering ───────────────────────────────────────────────

  it("numbers sections sequentially from 1 to 11", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIGovernanceFramework(scan)!;
    const lines = result.split("\n");
    const sectionNums = lines
      .filter((l) => /^##\s+\d+\./.test(l))
      .map((l) => {
        const match = l.match(/^##\s+(\d+)\./);
        return match ? parseInt(match[1], 10) : 0;
      });
    for (let i = 0; i < sectionNums.length; i++) {
      assert.strictEqual(sectionNums[i], i + 1, `Section ${i + 1} should be numbered ${i + 1}, got ${sectionNums[i]}`);
    }
    assert.strictEqual(sectionNums.length, 11);
  });

  // ── Multiple AI services ────────────────────────────────────────────

  it("handles multiple AI services correctly", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("@anthropic-ai/sdk", "ai", ["conversation history"]),
        makeService("replicate", "ai", ["images"]),
      ],
    });
    const result = generateAIGovernanceFramework(scan)!;
    assert.ok(result.includes("**openai**"));
    assert.ok(result.includes("**@anthropic-ai/sdk**"));
    assert.ok(result.includes("**replicate**"));
    // Vendor evaluation should also have entries for each
    assert.ok(result.includes("#### openai"));
    assert.ok(result.includes("#### @anthropic-ai/sdk"));
    assert.ok(result.includes("#### replicate"));
  });
});
