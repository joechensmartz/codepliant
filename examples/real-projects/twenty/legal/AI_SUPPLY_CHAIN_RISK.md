# AI Supply Chain Risk Assessment

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Organization:** [Your Company Name]
**Last updated:** 2026-03-16
**Project:** twenty
**Overall Supply Chain Risk:** High

---

This document assesses the business continuity risks arising from **[Your Company Name]'s** dependencies on third-party AI service providers. It identifies single points of failure, pricing risks, migration paths, and contingency plans aligned with **NIST AI RMF** (Govern 1.6), **EU AI Act** (Art. 16(f)), and **ISO/IEC 42001** supply chain management requirements.

## 1. Executive Summary

[Your Company Name] currently depends on **5 AI service(s)** from **2 provider(s)** for core product functionality. This creates supply chain dependencies that must be actively managed.

| Metric | Value |
|--------|-------|
| AI Services Detected | 5 |
| Unique Providers | 2 |
| Overall Risk Level | **High** |
| Single-Provider Dependency | No |
| Estimated Monthly AI Spend | $5,000–$50,000+ |
| Migration Plans Documented | See Section 4 |

## 2. Provider Risk Profiles

### Anthropic

**Detected as:** @ai-sdk/anthropic
**Data sent:** user prompts, conversation history, generated content

| Risk Factor | Assessment |
|-------------|------------|
| Provider Tier | Major |
| Headquarters | United States (San Francisco, CA) |
| Lock-In Risk | Medium |
| API Stability Risk | Low |
| Pricing Model | Per-token usage-based |
| Migration Complexity | Medium |
| Data Residency | US, EU (via AWS Bedrock) |

**Known Risk Factors:**

- Capacity constraints during high-demand periods
- API versioning changes requiring client updates

**Alternatives:**

- OpenAI (GPT)
- Google (Gemini)
- Mistral AI
- Cohere

### OpenAI

**Detected as:** @ai-sdk/openai
**Data sent:** user prompts, conversation history, generated content

| Risk Factor | Assessment |
|-------------|------------|
| Provider Tier | Major |
| Headquarters | United States (San Francisco, CA) |
| Lock-In Risk | High |
| API Stability Risk | Medium |
| Pricing Model | Per-token usage-based, tiered rate limits |
| Migration Complexity | Medium |
| Data Residency | US, EU (Azure OpenAI) |

**Known Risk Factors:**

- Model deprecation cycles (GPT-3.5 → GPT-4 migration required)
- Rate limit changes without advance notice
- Pricing increases on flagship models

**Alternatives:**

- Anthropic (Claude)
- Google (Gemini)
- Mistral AI
- Cohere
- Meta (Llama, self-hosted)

### OpenAI

**Detected as:** openai
**Data sent:** user prompts, conversation history, generated content

| Risk Factor | Assessment |
|-------------|------------|
| Provider Tier | Major |
| Headquarters | United States (San Francisco, CA) |
| Lock-In Risk | High |
| API Stability Risk | Medium |
| Pricing Model | Per-token usage-based, tiered rate limits |
| Migration Complexity | Medium |
| Data Residency | US, EU (Azure OpenAI) |

**Known Risk Factors:**

- Model deprecation cycles (GPT-3.5 → GPT-4 migration required)
- Rate limit changes without advance notice
- Pricing increases on flagship models

**Alternatives:**

- Anthropic (Claude)
- Google (Gemini)
- Mistral AI
- Cohere
- Meta (Llama, self-hosted)

### @ai-sdk/google (Unrecognized Provider)

| Risk Factor | Assessment |
|-------------|------------|
| Provider Tier | Unknown |
| Lock-In Risk | Unknown — requires manual assessment |
| API Stability Risk | Unknown — requires manual assessment |
| Data Sent | user prompts, conversation history, generated content |

> **Action Required:** This AI provider was not recognized. Conduct manual due diligence to assess supply chain risk, including financial stability, SLA guarantees, and data processing practices.

### @vercel/ai (Unrecognized Provider)

| Risk Factor | Assessment |
|-------------|------------|
| Provider Tier | Unknown |
| Lock-In Risk | Unknown — requires manual assessment |
| API Stability Risk | Unknown — requires manual assessment |
| Data Sent | user prompts, conversation history, generated content |

> **Action Required:** This AI provider was not recognized. Conduct manual due diligence to assess supply chain risk, including financial stability, SLA guarantees, and data processing practices.

## 3. Risk Scenarios

### Scenario A: Provider Outage (Hours to Days)

| Impact Area | Details |
|-------------|---------|
| Affected Features | All AI-powered functionality |
| User Impact | Partial degradation — some AI features may remain available |
| Revenue Impact | Depends on AI feature criticality to user retention |
| Estimated Recovery | Automatic when provider restores service |

**Mitigation:**
- Implement circuit breakers with graceful degradation
- Cache recent AI responses for read-heavy features
- Display user-friendly fallback states
- Monitor provider status pages and set up alerts

### Scenario B: Pricing Increase (30–90 Days Notice)

| Impact Area | Details |
|-------------|---------|
| Estimated Current Spend | $5,000–$50,000+ /month |
| Impact of 2x Price Increase | May require feature repricing or margin reduction |
| Impact of 5x Price Increase | Likely requires provider migration or feature removal |

**Mitigation:**
- Negotiate enterprise contracts with price caps
- Maintain abstraction layer to enable provider switching
- Budget 20% contingency for AI costs
- Evaluate self-hosted alternatives for high-volume use cases

### Scenario C: API Deprecation (3–12 Months Notice)

| Impact Area | Details |
|-------------|---------|
| Engineering Effort | 2–8 weeks depending on abstraction quality |
| Testing Required | Full regression + output quality validation |
| Data Migration | Prompt templates, fine-tuning data, evaluation sets |

**Mitigation:**
- Use provider-agnostic abstraction layer (e.g., LiteLLM, LangChain)
- Maintain model evaluation benchmarks for quality comparison
- Document all prompt engineering and fine-tuning assets

### Scenario D: Provider Shutdown or Acquisition

| Impact Area | Details |
|-------------|---------|
| Notice Period | May be as short as 30 days |
| Data Retrieval | Must ensure all training data and fine-tuned models are exported |
| Migration Timeline | 4–12 weeks for full migration |

**Mitigation:**
- Never store unique training data exclusively with a provider
- Maintain local copies of all fine-tuning datasets
- Pre-qualify at least one alternative provider per AI capability

## 4. Migration Playbook

For each AI provider, the following migration strategy should be maintained:

### Migrating Away from Anthropic

**Complexity:** Medium

**Steps:**

1. **Evaluate alternatives:** OpenAI (GPT), Google (Gemini), Mistral AI
2. **Abstract the integration:** Ensure all AI calls go through an abstraction layer
3. **Benchmark quality:** Run evaluation suite against alternative providers
4. **Migrate prompts:** Adapt prompt templates for new provider's strengths
5. **Parallel testing:** Run both providers in shadow mode for 1–2 weeks
6. **Gradual rollout:** Shift 10% → 50% → 100% of traffic
7. **Monitor quality:** Track output quality metrics post-migration

**Estimated Timeline:** 3–6 weeks

### Migrating Away from OpenAI

**Complexity:** Medium

**Steps:**

1. **Evaluate alternatives:** Anthropic (Claude), Google (Gemini), Mistral AI
2. **Abstract the integration:** Ensure all AI calls go through an abstraction layer
3. **Benchmark quality:** Run evaluation suite against alternative providers
4. **Migrate prompts:** Adapt prompt templates for new provider's strengths
5. **Parallel testing:** Run both providers in shadow mode for 1–2 weeks
6. **Gradual rollout:** Shift 10% → 50% → 100% of traffic
7. **Monitor quality:** Track output quality metrics post-migration

**Estimated Timeline:** 3–6 weeks

## 5. Recommendations

1. Implement a provider-agnostic AI abstraction layer to reduce switching costs
2. Establish AI cost budgets with alerts at 80% and 100% thresholds
3. Maintain a model evaluation benchmark suite for rapid provider comparison
4. Negotiate enterprise agreements with SLA guarantees and price caps
5. Store all training data, fine-tuning datasets, and prompt libraries locally
6. Add circuit breakers and graceful degradation for all AI features
7. Monitor provider changelogs and deprecation notices weekly
8. Conduct annual AI supply chain risk review

## 6. Ongoing Monitoring Checklist

| Check | Frequency | Owner |
|-------|-----------|-------|
| Review provider status page and uptime | Weekly | Engineering |
| Check for API deprecation notices | Weekly | Engineering |
| Review AI cost trends | Monthly | Finance / Engineering |
| Test failover to alternative provider | Quarterly | Engineering |
| Update migration playbooks | Quarterly | Engineering |
| Full supply chain risk reassessment | Annually | CTO / CISO |
| Benchmark output quality across providers | Semi-annually | ML / Product |

---

*Generated by [Codepliant](https://github.com/joechensmartz/codepliant) on 2026-03-16. This is an automated risk assessment based on code analysis. Provider profiles are based on publicly available information and should be verified against current provider terms and conditions. This document should be reviewed by qualified risk management and legal counsel.*