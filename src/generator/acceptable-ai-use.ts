import type { ScanResult, DetectedService } from "../scanner/types.js";
import type { GeneratorContext } from "./index.js";

/** Known AI service display names. */
const AI_PROVIDER_NAMES: Record<string, string> = {
  openai: "OpenAI (GPT)",
  "@anthropic-ai/sdk": "Anthropic (Claude)",
  "@google/generative-ai": "Google (Gemini)",
  replicate: "Replicate",
  "together-ai": "Together AI",
  cohere: "Cohere",
  "@pinecone-database/pinecone": "Pinecone",
  langchain: "LangChain",
  "@vercel/ai": "Vercel AI SDK",
  "@ai-sdk/openai": "Vercel AI SDK (OpenAI)",
  "@ai-sdk/anthropic": "Vercel AI SDK (Anthropic)",
  "@ai-sdk/google": "Vercel AI SDK (Google)",
  "@ai-sdk/google-vertex": "Vercel AI SDK (Google Vertex)",
  "@huggingface/inference": "Hugging Face",
  "@mistralai/mistralai": "Mistral AI",
};

/** Content review requirements by data sensitivity. */
const CONTENT_REVIEW: Record<string, string> = {
  high: "All AI-generated content must be reviewed by a qualified human before publication or use in decision-making",
  limited: "AI-generated content should be reviewed before external distribution; internal use may proceed with spot-checks",
  minimal: "AI-generated content should be clearly labeled; periodic quality reviews recommended",
};

/**
 * Generate an ACCEPTABLE_AI_USE_POLICY.md when AI services are detected.
 *
 * Returns null when no AI services are found in the scan.
 */
export function generateAcceptableAIUsePolicy(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  const aiServices = scan.services.filter((s) => s.category === "ai");

  if (aiServices.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const date = new Date().toISOString().split("T")[0];

  // Determine risk level
  const riskLevel = ctx?.aiRiskLevel || classifyRisk(aiServices);
  const reviewRequirement = CONTENT_REVIEW[riskLevel] || CONTENT_REVIEW["limited"];

  const sections: string[] = [];

  // ── Title ────────────────────────────────────────────────────────────
  sections.push(`# Acceptable AI Use Policy

**Last updated:** ${date}

**Project:** ${scan.projectName}

**Company:** ${company}

**AI Risk Classification:** ${riskLevel}

---

## 1. Purpose

This policy establishes guidelines for the acceptable use of artificial intelligence (AI) services within **${scan.projectName}**. It defines how AI should and should not be used, content review requirements, and commitments to fairness and bias mitigation. This policy supports compliance with the EU AI Act, NIST AI Risk Management Framework, and organizational ethics standards.

## 2. Scope

This policy applies to all team members, contractors, and systems that interact with AI services integrated into the application.`);

  // ── AI Services Inventory ────────────────────────────────────────────
  sections.push(`
---

## 3. AI Services in Use

The following AI services have been detected in this project:

| Service | Provider | Data Processed |
|---------|----------|---------------|`);

  for (const service of aiServices) {
    const provider = AI_PROVIDER_NAMES[service.name] || service.name;
    sections.push(`| ${service.name} | ${provider} | ${service.dataCollected.join(", ")} |`);
  }

  // ── Acceptable Uses ──────────────────────────────────────────────────
  sections.push(`
---

## 4. Acceptable Uses of AI

AI services integrated into this application may be used for the following purposes:

### 4.1 Permitted Uses

- **Content assistance:** Drafting, summarizing, or translating text with human review
- **Code assistance:** Code generation, debugging, and refactoring suggestions
- **Data analysis:** Pattern recognition and insight generation from authorized datasets
- **User experience:** Personalized recommendations and intelligent search
- **Automation:** Workflow automation for repetitive tasks with defined guardrails
- **Accessibility:** Improving accessibility through transcription, alt-text generation, and language support

### 4.2 Conditional Uses (Require Approval)

The following uses require explicit approval from the designated AI governance lead:

- Processing sensitive personal data (health, financial, biometric)
- Automated decision-making that affects user access, rights, or opportunities
- Training or fine-tuning models on user data
- Integrating new AI services not listed in this policy
- Using AI for content moderation or safety-critical decisions`);

  // ── Prohibited Uses ──────────────────────────────────────────────────
  sections.push(`
---

## 5. Prohibited Uses of AI

The following uses of AI are strictly prohibited:

1. **Deceptive practices:** Presenting AI-generated content as human-created without disclosure
2. **Discriminatory decision-making:** Using AI to make decisions that discriminate based on protected characteristics (race, gender, age, disability, religion, etc.)
3. **Surveillance:** Using AI for unauthorized monitoring or profiling of individuals
4. **Manipulation:** Using AI to manipulate user behavior through dark patterns or subliminal techniques
5. **Unauthorized data sharing:** Sending personal data to AI services without appropriate legal basis and user consent
6. **Social scoring:** Using AI to evaluate individuals based on social behavior or predicted characteristics
7. **Biometric categorization:** Using AI for real-time biometric identification without explicit legal authorization
8. **Circumventing safety measures:** Attempting to bypass AI provider safety filters or content policies
9. **Unvalidated critical decisions:** Using AI output as the sole basis for decisions with legal or significant effects on individuals`);

  // ── Content Review ───────────────────────────────────────────────────
  sections.push(`
---

## 6. Content Review Requirements

**Current review level:** ${riskLevel} risk

${reviewRequirement}.

### 6.1 Review Process

| Content Type | Review Required | Reviewer |
|-------------|----------------|----------|
| Customer-facing text | Yes — before publication | Content team or product owner |
| Internal documentation | Recommended — spot-check | Team lead |
| Code suggestions | Yes — before merge | Code reviewer (PR process) |
| Automated responses | Yes — template approval | Product and legal team |
| Data analysis outputs | Yes — before action | Domain expert |

### 6.2 Review Checklist

Before publishing or acting on AI-generated content, verify:

- [ ] **Accuracy:** Facts and claims have been independently verified
- [ ] **Completeness:** No critical information is missing or misleading
- [ ] **Bias:** Content does not exhibit unfair bias toward or against any group
- [ ] **Tone:** Language is appropriate for the audience and context
- [ ] **Attribution:** AI involvement is disclosed where required
- [ ] **Privacy:** No personal data has been inadvertently included or exposed
- [ ] **Legal compliance:** Content complies with applicable laws and regulations`);

  // ── Bias and Fairness ────────────────────────────────────────────────
  sections.push(`
---

## 7. Bias and Fairness Commitments

${company} is committed to the responsible and fair use of AI. We acknowledge that AI systems can perpetuate or amplify biases present in training data.

### 7.1 Our Commitments

1. **Awareness:** All team members working with AI must complete bias awareness training
2. **Testing:** AI features must be tested across diverse user demographics before launch
3. **Monitoring:** AI outputs are monitored for patterns of bias or unfair treatment
4. **Feedback:** Users can report concerns about AI-generated content or decisions
5. **Remediation:** Identified biases will be addressed within 30 days of discovery
6. **Transparency:** We disclose AI usage to users per our AI Disclosure document
7. **Diversity:** AI development teams should reflect diverse perspectives and backgrounds

### 7.2 Bias Assessment

For each AI service in use, the following should be documented:

| Assessment Area | Status |
|----------------|--------|
| Training data diversity reviewed | [ ] Complete / [ ] Pending |
| Output bias testing conducted | [ ] Complete / [ ] Pending |
| Demographic parity evaluated | [ ] Complete / [ ] Pending |
| Feedback mechanism in place | [ ] Complete / [ ] Pending |
| Incident response plan for bias issues | [ ] Complete / [ ] Pending |`);

  // ── Data Handling ────────────────────────────────────────────────────
  sections.push(`
---

## 8. Data Handling for AI Services

### 8.1 Data Minimization

- Only send the minimum data necessary for the AI task
- Strip personally identifiable information (PII) before sending data to AI services where possible
- Use anonymized or synthetic data for testing and development

### 8.2 Data Retention by AI Providers

| Principle | Requirement |
|-----------|------------|
| Provider data retention | Review and document each AI provider's data retention policy |
| Training opt-out | Opt out of model training on user data where the option is available |
| Data deletion | Ensure AI providers can delete data upon request |
| Cross-border transfers | Document where AI processing occurs geographically |

### 8.3 User Consent

- Users must be informed when AI processes their data (see AI_DISCLOSURE.md)
- Where AI processing is not strictly necessary, users should be able to opt out
- Consent must be specific, informed, and freely given per GDPR Article 7`);

  // ── Incident Response ────────────────────────────────────────────────
  sections.push(`
---

## 9. AI Incident Response

The following events constitute AI-related incidents requiring immediate response:

| Incident Type | Response Time | Escalation |
|--------------|---------------|------------|
| AI generates harmful or illegal content | Immediate | Security + Legal |
| Bias or discrimination discovered in AI output | 24 hours | Product + Compliance |
| Unauthorized data sent to AI service | Immediate | Security + DPO |
| AI service data breach (vendor-side) | Per vendor notification | Security + Legal |
| AI hallucination causing user harm | 24 hours | Product + Support |

For the full incident response process, see **INCIDENT_RESPONSE_PLAN.md**.`);

  // ── Governance ───────────────────────────────────────────────────────
  sections.push(`
---

## 10. Governance and Accountability

### 10.1 Roles

| Role | Responsibility |
|------|---------------|
| AI Governance Lead | Approves new AI use cases, reviews policy compliance |
| Engineering Team | Implements technical safeguards and monitoring |
| Product Team | Ensures AI features align with user expectations |
| Legal/Compliance | Reviews regulatory requirements and vendor agreements |
| All Team Members | Follow this policy; report concerns or violations |

### 10.2 Policy Violations

Violations of this policy may result in:

1. Revocation of AI service access
2. Mandatory retraining on AI ethics and this policy
3. Disciplinary action per company HR policies
4. Reporting to regulatory authorities where legally required`);

  // ── Footer ───────────────────────────────────────────────────────────
  sections.push(`
---

## 11. Policy Review

This policy should be reviewed:

- **Quarterly** as AI capabilities and regulations evolve rapidly
- **When adding** new AI services to the project
- **When AI regulations** are enacted or updated (EU AI Act, state-level AI laws)
- **After any AI-related incident**

For questions about this policy, contact ${email}.

---

*This Acceptable AI Use Policy was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Review and verify all entries for accuracy. This document does not constitute legal advice.*`);

  return sections.join("\n");
}

/** Simple risk classification when not provided via config. */
function classifyRisk(aiServices: DetectedService[]): "minimal" | "limited" | "high" {
  const allData = aiServices
    .flatMap((s) => [...s.dataCollected, s.name])
    .map((d) => d.toLowerCase());

  const highRiskPatterns = [
    "biometric", "facial", "credit scoring", "hiring",
    "healthcare", "law enforcement", "social scoring",
  ];

  if (allData.some((d) => highRiskPatterns.some((p) => d.includes(p)))) {
    return "high";
  }

  const userFacingPatterns = ["user prompts", "conversation", "generated content", "chatbot"];
  if (allData.some((d) => userFacingPatterns.some((p) => d.includes(p)))) {
    return "limited";
  }

  return "minimal";
}
