import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateAIDisclosure, classifyAIRisk } from "./ai-disclosure.js";
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

// ── classifyAIRisk ─────────────────────────────────────────────────────

describe("classifyAIRisk", () => {
  it("returns minimal when no AI services present", () => {
    const services = [makeService("stripe", "payment")];
    assert.strictEqual(classifyAIRisk(services), "minimal");
  });

  it("returns minimal when AI services have no user-facing or high-risk data", () => {
    const services = [makeService("openai", "ai", ["internal logs"])];
    assert.strictEqual(classifyAIRisk(services), "minimal");
  });

  it("returns limited when AI services process user prompts", () => {
    const services = [makeService("openai", "ai", ["user prompts", "generated content"])];
    assert.strictEqual(classifyAIRisk(services), "limited");
  });

  it("returns limited for conversation history", () => {
    const services = [makeService("@anthropic-ai/sdk", "ai", ["conversation history"])];
    assert.strictEqual(classifyAIRisk(services), "limited");
  });

  it("returns limited for chatbot service name", () => {
    const services = [makeService("chatbot", "ai", ["text"])];
    assert.strictEqual(classifyAIRisk(services), "limited");
  });

  it("returns high for biometric data", () => {
    const services = [makeService("openai", "ai", ["biometric data"])];
    assert.strictEqual(classifyAIRisk(services), "high");
  });

  it("returns high for facial recognition", () => {
    const services = [makeService("openai", "ai", ["facial recognition scores"])];
    assert.strictEqual(classifyAIRisk(services), "high");
  });

  it("returns high for credit scoring", () => {
    const services = [makeService("openai", "ai", ["credit scoring results"])];
    assert.strictEqual(classifyAIRisk(services), "high");
  });

  it("returns high for hiring/recruitment use", () => {
    const services = [makeService("openai", "ai", ["hiring decisions"])];
    assert.strictEqual(classifyAIRisk(services), "high");
  });

  it("returns high for healthcare diagnosis", () => {
    const services = [makeService("openai", "ai", ["healthcare diagnosis"])];
    assert.strictEqual(classifyAIRisk(services), "high");
  });

  it("high risk takes precedence over limited risk patterns", () => {
    const services = [makeService("openai", "ai", ["user prompts", "biometric data"])];
    assert.strictEqual(classifyAIRisk(services), "high");
  });

  it("respects context aiRiskLevel override", () => {
    const services = [makeService("openai", "ai", ["user prompts"])];
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "t@t.com", aiRiskLevel: "high" };
    assert.strictEqual(classifyAIRisk(services, ctx), "high");
  });

  it("context override works even for minimal with user-facing data", () => {
    const services = [makeService("openai", "ai", ["user prompts"])];
    const ctx: GeneratorContext = { companyName: "Test", contactEmail: "t@t.com", aiRiskLevel: "minimal" };
    assert.strictEqual(classifyAIRisk(services, ctx), "minimal");
  });
});

// ── generateAIDisclosure ───────────────────────────────────────────────

describe("generateAIDisclosure", () => {
  it("returns null when no AI services detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    assert.strictEqual(generateAIDisclosure(scan), null);
  });

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateAIDisclosure(scan), null);
  });

  it("returns null with only non-AI services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("prisma", "database"),
      ],
    });
    assert.strictEqual(generateAIDisclosure(scan), null);
  });

  it("generates disclosure when AI services are present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts", "generated content"])],
    });
    const result = generateAIDisclosure(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("AI Disclosure"));
  });

  it("includes project name in output", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("test-project"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("uses context company name", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "ai@acme.com" };
    const result = generateAIDisclosure(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses context contact email", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "ai@acme.com" };
    const result = generateAIDisclosure(scan, ctx)!;
    assert.ok(result.includes("ai@acme.com"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("uses placeholder email when no context", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("[your-email@example.com]"));
  });

  it("includes DPO email when provided", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", dpoEmail: "dpo@acme.com" };
    const result = generateAIDisclosure(scan, ctx)!;
    assert.ok(result.includes("dpo@acme.com"));
  });

  // ── Section: Introduction ─────────────────────────────────────────

  it("includes introduction referencing EU AI Act", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("EU") || result.includes("Artificial Intelligence Act"));
    assert.ok(result.includes("2024/1689") || result.includes("AI Act"));
  });

  // ── Section: AI Systems Inventory ─────────────────────────────────

  it("includes AI systems inventory table", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts", "generated content"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("AI Systems Inventory") || result.includes("Inventory"));
    assert.ok(result.includes("openai"));
    assert.ok(result.includes("OpenAI"));
    assert.ok(result.includes("user prompts"));
  });

  it("includes multiple AI services in inventory", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("@anthropic-ai/sdk", "ai", ["conversation history"]),
      ],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("openai"));
    assert.ok(result.includes("@anthropic-ai/sdk"));
    assert.ok(result.includes("OpenAI"));
    assert.ok(result.includes("Anthropic"));
  });

  it("includes ai usage description when provided", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme",
      contactEmail: "a@a.com",
      aiUsageDescription: "We use AI for customer support chatbots.",
    };
    const result = generateAIDisclosure(scan, ctx)!;
    assert.ok(result.includes("We use AI for customer support chatbots."));
  });

  // ── Section: Risk Classification ──────────────────────────────────

  it("shows minimal risk classification for internal AI", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["internal logs"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("Minimal Risk") || result.includes("minimal risk"));
  });

  it("shows limited risk classification for user-facing AI", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts", "generated content"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("Limited Risk") || result.includes("limited risk"));
  });

  it("shows high risk classification for biometric AI", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["biometric data"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("High Risk") || result.includes("high risk"));
  });

  it("includes risk obligations for minimal risk", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["internal logs"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("No specific obligations") || result.includes("codes of conduct"));
  });

  it("includes risk obligations for limited risk (Art. 50)", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("Art. 50"));
  });

  it("includes high risk obligations (conformity assessment)", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["biometric data"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("Conformity assessment"));
    assert.ok(result.includes("Risk management"));
  });

  it("notes manual override when aiRiskLevel is set", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", aiRiskLevel: "high" };
    const result = generateAIDisclosure(scan, ctx)!;
    assert.ok(result.includes("manually set"));
  });

  // ── Section: Transparency Obligations ─────────────────────────────

  it("includes transparency obligations section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("Transparency Obligations"));
    assert.ok(result.includes("Article 50"));
  });

  it("includes AI limitations disclosure", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("not always be accurate"));
  });

  it("includes first-interaction disclosure requirement (Art. 50(5))", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("Art. 50(5)") || result.includes("first interaction"));
  });

  // ── Section: AI-Generated Content ─────────────────────────────────

  it("includes AI-generated content section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("AI-Generated Content"));
    assert.ok(result.includes("synthetic") || result.includes("Synthetic"));
  });

  it("includes machine-readable marking requirement (Art. 50(2))", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("Art. 50(2)"));
    assert.ok(result.includes("machine-readable"));
  });

  // ── Section: Data Processing by AI ────────────────────────────────

  it("includes data processing table", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts", "generated content"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("Data Processing by AI") || result.includes("Data Type"));
    assert.ok(result.includes("user prompts"));
    assert.ok(result.includes("OpenAI"));
  });

  it("includes data retention information", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("Data Retention") || result.includes("retention"));
  });

  it("includes cross-border transfers section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("Cross-Border") || result.includes("transfer"));
    assert.ok(result.includes("Standard Contractual Clauses") || result.includes("SCC"));
  });

  // ── Section: Human Oversight ──────────────────────────────────────

  it("includes human oversight section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("Human Oversight"));
    assert.ok(result.includes("human review") || result.includes("human reviews"));
  });

  // ── Section: User Rights ──────────────────────────────────────────

  it("includes user rights section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("User Rights"));
    assert.ok(result.includes("Opt out") || result.includes("opt out"));
    assert.ok(result.includes("Lodge complaints") || result.includes("lodge complaints"));
  });

  // ── Section: AI Provider Policies ─────────────────────────────────

  it("includes provider policy links for known providers", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("AI Provider Policies") || result.includes("Provider"));
    assert.ok(result.includes("openai.com/policies/privacy-policy"));
  });

  it("includes provider links for Anthropic", () => {
    const scan = makeScan({
      services: [makeService("@anthropic-ai/sdk", "ai", ["conversation history"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("anthropic.com/privacy"));
  });

  it("deduplicates providers in policy section", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("openai", "ai", ["generated content"]),
      ],
    });
    const result = generateAIDisclosure(scan)!;
    const matches = result.match(/openai\.com\/policies\/privacy-policy/g);
    assert.ok(matches !== null);
    assert.strictEqual(matches.length, 1, "Provider policy URL should appear only once");
  });

  // ── Section: Compliance Checklist ─────────────────────────────────

  it("includes compliance checklist", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("Compliance Checklist"));
    assert.ok(result.includes("[ ]"));
  });

  it("includes high-risk checklist items for high-risk classification", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["biometric data"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("High-Risk System Requirements"));
    assert.ok(result.includes("Conformity assessment completed"));
    assert.ok(result.includes("EU AI database"));
  });

  it("does not include high-risk checklist items for limited risk", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(!result.includes("High-Risk System Requirements"));
  });

  // ── Section: Contact ──────────────────────────────────────────────

  it("includes contact section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("Contact"));
    assert.ok(result.includes("EU AI Act"));
  });

  // ── Section numbering ─────────────────────────────────────────────

  it("numbers sections sequentially", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIDisclosure(scan)!;
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
  });

  // ── Disclaimer ────────────────────────────────────────────────────

  it("includes legal disclaimer", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIDisclosure(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("legal professional") || result.includes("reviewed"));
  });
});
