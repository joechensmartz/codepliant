import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateAIImpactAssessment } from "./ai-impact-assessment.js";
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

function makeCtx(overrides: Partial<GeneratorContext> = {}): GeneratorContext {
  return {
    companyName: "Acme Corp",
    contactEmail: "legal@acme.com",
    ...overrides,
  };
}

// ── Null guard ──────────────────────────────────────────────────────────

describe("generateAIImpactAssessment", () => {
  it("returns null when no services detected", () => {
    const result = generateAIImpactAssessment(makeScan());
    assert.strictEqual(result, null);
  });

  it("returns null when no AI services detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateAIImpactAssessment(scan);
    assert.strictEqual(result, null);
  });

  it("returns null when only non-AI services present", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("google-analytics", "analytics"),
        makeService("aws", "other" as any),
      ],
    });
    const result = generateAIImpactAssessment(scan);
    assert.strictEqual(result, null);
  });

  // ── Basic generation ───────────────────────────────────────────────

  it("generates document when AI services are present", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan);
    assert.ok(typeof result === "string");
    assert.ok(result.includes("# AI Impact Assessment"));
  });

  it("returns non-empty string for a single AI service", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.length > 500);
  });

  // ── Header & metadata ─────────────────────────────────────────────

  it("includes project name", () => {
    const scan = makeScan({
      projectName: "my-ai-project",
      services: [makeService("openai", "ai")],
    });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("my-ai-project"));
  });

  it("includes assessment date in ISO format", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan);
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result!));
  });

  it("includes next review date one year out", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan);
    // Should contain two different dates (assessment + next review)
    const dates = result!.match(/\d{4}-\d{2}-\d{2}/g) || [];
    assert.ok(dates.length >= 2, "Should have at least assessment date and next review date");
  });

  it("uses default company placeholder when no context", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("[Your Company Name]"));
  });

  it("uses company name from context", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan, makeCtx({ companyName: "TechCo" }));
    assert.ok(result!.includes("TechCo"));
    assert.ok(!result!.includes("[Your Company Name]"));
  });

  it("uses contact email from context", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan, makeCtx({ contactEmail: "ai@techco.com" }));
    assert.ok(result!.includes("ai@techco.com"));
  });

  it("uses default email placeholder when no context", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("[your-email@example.com]"));
  });

  it("includes DPO email when provided in context", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan, makeCtx({ dpoEmail: "dpo@acme.com" }));
    assert.ok(result!.includes("dpo@acme.com"));
  });

  // ── Overall risk classification ───────────────────────────────────

  it("displays overall risk classification", () => {
    const scan = makeScan({ services: [makeService("openai", "ai", ["user prompts"])] });
    const result = generateAIImpactAssessment(scan);
    assert.ok(/Overall AI Risk Classification:\*\* (Minimal|Limited|High)/.test(result!));
  });

  it("shows Limited for user-facing AI", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts", "generated content"])],
    });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("Limited"));
  });

  it("shows High for biometric AI", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["biometric data"])],
    });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("High"));
  });

  it("respects aiRiskLevel override from context", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan, makeCtx({ aiRiskLevel: "high" }));
    assert.ok(result!.includes("High"));
  });

  // ── Section 1: Regulatory Overview ────────────────────────────────

  it("includes EU AI Act regulatory overview", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("## 1. Regulatory Overview"));
    assert.ok(result!.includes("EU AI Act"));
    assert.ok(result!.includes("2024/1689"));
  });

  it("includes Colorado AI Act overview", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("Colorado AI Act"));
    assert.ok(result!.includes("SB 24-205"));
    assert.ok(result!.includes("1 February 2026"));
  });

  it("includes EU AI Act risk level table", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("Unacceptable"));
    assert.ok(result!.includes("High"));
    assert.ok(result!.includes("Limited"));
    assert.ok(result!.includes("Minimal"));
  });

  // ── Section 2: AI Services Inventory ──────────────────────────────

  it("includes AI services inventory table", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("## 2. AI Services Inventory"));
    assert.ok(result!.includes("| Service |"));
    assert.ok(result!.includes("openai"));
  });

  it("lists multiple AI services in inventory", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("replicate", "ai", ["images"]),
      ],
    });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("openai"));
    assert.ok(result!.includes("replicate"));
  });

  it("shows data processed in inventory", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts", "generated content"])],
    });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("user prompts"));
  });

  // ── Section 3: Per-Service Risk Evaluation ────────────────────────

  it("includes per-service risk evaluation", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("## 3. Per-Service Risk Evaluation"));
  });

  it("shows service details in risk evaluation", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("`openai`"));
    assert.ok(result!.includes("Rationale"));
    assert.ok(result!.includes("Required Mitigations"));
  });

  it("includes mitigations as checklist items", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan);
    const checkboxes = (result!.match(/- \[ \]/g) || []).length;
    assert.ok(checkboxes >= 3, `Expected >= 3 mitigation items, got ${checkboxes}`);
  });

  // ── Risk classification per service ───────────────────────────────

  it("classifies minimal risk for basic AI service", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["internal logs"])],
    });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("**Minimal**"));
    assert.ok(result!.includes("Annual review"));
  });

  it("classifies limited risk for user-facing AI", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts", "generated content"])],
    });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("**Limited**"));
    assert.ok(result!.includes("transparency obligations"));
  });

  it("classifies high risk for biometric data", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["biometric identification data"])],
    });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("**High**"));
    assert.ok(result!.includes("conformity assessment"));
  });

  it("classifies high risk for hiring decisions", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["hiring decisions"])],
    });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("**High**"));
  });

  it("classifies high risk for credit scoring", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["credit scoring results"])],
    });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("**High**"));
  });

  it("classifies high risk for healthcare diagnosis", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["healthcare diagnosis data"])],
    });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("**High**"));
  });

  it("classifies unacceptable risk for social scoring", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["social scoring"])],
    });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("**Unacceptable**"));
    assert.ok(result!.includes("prohibited"));
  });

  it("classifies unacceptable risk for real-time biometric", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["real-time biometric identification"])],
    });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("**Unacceptable**"));
  });

  // ── Colorado AI Act applicability ─────────────────────────────────

  it("marks Colorado AI Act as applicable for education decisions", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["education assessment"])],
    });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("Applies"));
  });

  it("marks Colorado AI Act as applicable for financial decisions", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["financial analysis"])],
    });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("Applies"));
  });

  // ── Section 4: Algorithmic Discrimination ─────────────────────────

  it("includes algorithmic discrimination assessment", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("## 4. Algorithmic Discrimination Assessment"));
  });

  it("lists protected characteristics", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("Race"));
    assert.ok(result!.includes("Disability"));
    assert.ok(result!.includes("Gender identity"));
    assert.ok(result!.includes("Veteran status"));
  });

  it("includes discrimination assessment checklist", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("disparate impact"));
    assert.ok(result!.includes("90-day reporting"));
  });

  // ── Section 5: Fundamental Rights (high-risk only) ────────────────

  it("includes fundamental rights section for high-risk services", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["biometric identification data"])],
    });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("Fundamental Rights Impact Assessment"));
    assert.ok(result!.includes("Article 27"));
  });

  it("omits fundamental rights section when no high-risk services", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIImpactAssessment(scan);
    assert.ok(!result!.includes("Fundamental Rights Impact Assessment"));
  });

  it("lists EU Charter rights in fundamental rights section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["biometric identification data"])],
    });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("Right to privacy"));
    assert.ok(result!.includes("Non-discrimination"));
    assert.ok(result!.includes("Freedom of expression"));
  });

  // ── Monitoring Plan ───────────────────────────────────────────────

  it("includes monitoring plan", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("Monitoring Plan"));
    assert.ok(result!.includes("Bias and fairness testing"));
    assert.ok(result!.includes("Model drift detection"));
  });

  it("monitoring plan includes frequency table", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("Annual"));
    assert.ok(result!.includes("Quarterly"));
    assert.ok(result!.includes("Monthly"));
    assert.ok(result!.includes("Continuous"));
  });

  // ── Transparency Obligations ──────────────────────────────────────

  it("includes transparency obligations", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("Transparency Obligations"));
    assert.ok(result!.includes("Article 50"));
  });

  it("includes Colorado transparency requirements", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("### Colorado AI Act"));
    assert.ok(result!.includes("consequential decisions"));
    assert.ok(result!.includes("appeal process"));
  });

  // ── AI Incident Response ──────────────────────────────────────────

  it("includes incident response section", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("AI Incident Response"));
    assert.ok(result!.includes("90 days"));
    assert.ok(result!.includes("Without undue delay"));
  });

  it("incident response covers algorithmic discrimination reporting", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("Colorado AG"));
  });

  // ── Contact & Footer ──────────────────────────────────────────────

  it("includes contact section", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("## Contact"));
  });

  it("includes Codepliant disclaimer", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("Codepliant"));
    assert.ok(result!.includes("does not constitute legal advice"));
  });

  it("references both EU AI Act and Colorado AI Act in footer", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("EU AI Act"));
    assert.ok(result!.includes("Colorado AI Act"));
  });

  // ── Section numbering adjusts for high-risk ───────────────────────

  it("adjusts section numbers when fundamental rights section is present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["biometric identification data"])],
    });
    const result = generateAIImpactAssessment(scan);
    // With high risk, fundamental rights is section 5, monitoring is 6, transparency is 7, incident is 8
    assert.ok(result!.includes("## 5. Fundamental Rights"));
    assert.ok(result!.includes("## 6. Monitoring Plan"));
    assert.ok(result!.includes("## 7. Transparency Obligations"));
    assert.ok(result!.includes("## 8. AI Incident Response"));
  });

  it("uses lower section numbers when no fundamental rights section", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("## 5. Monitoring Plan"));
    assert.ok(result!.includes("## 6. Transparency Obligations"));
    assert.ok(result!.includes("## 7. AI Incident Response"));
  });

  // ── Multiple services ─────────────────────────────────────────────

  it("handles multiple AI services with different risk levels", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai", ["user prompts"]),
        makeService("@anthropic-ai/sdk", "ai", ["biometric identification data"]),
        makeService("replicate", "ai", ["images"]),
      ],
    });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("openai"));
    assert.ok(result!.includes("@anthropic-ai/sdk"));
    assert.ok(result!.includes("replicate"));
    // The high-risk service should trigger fundamental rights section
    assert.ok(result!.includes("Fundamental Rights Impact Assessment"));
  });

  it("numbers per-service evaluations sequentially", () => {
    const scan = makeScan({
      services: [
        makeService("openai", "ai"),
        makeService("replicate", "ai"),
      ],
    });
    const result = generateAIImpactAssessment(scan);
    assert.ok(result!.includes("### 3.1 openai"));
    assert.ok(result!.includes("### 3.2 replicate"));
  });
});
