# AI Supply Chain Risk Assessment

> **Document Version:** 1.0  
> **Document Owner:** Acme Inc  
> **Next Review Date:** 2027-03-18


**Organization:** Acme Inc
**Last updated:** 2026-03-18
**Project:** nextjs-saas-example
**Overall Supply Chain Risk:** High

---

This document assesses the business continuity risks arising from **Acme Inc's** dependencies on third-party AI service providers. It identifies single points of failure, pricing risks, migration paths, and contingency plans aligned with **NIST AI RMF** (Govern 1.6), **EU AI Act** (Art. 16(f)), and **ISO/IEC 42001** supply chain management requirements.

## 1. Executive Summary

Acme Inc currently depends on **1 AI service(s)** from **1 provider(s)** for core product functionality. This creates supply chain dependencies that must be actively managed.

| Metric | Value |
|--------|-------|
| AI Services Detected | 1 |
| Unique Providers | 1 |
| Overall Risk Level | **High** |
| Single-Provider Dependency | Yes (CRITICAL) |
| Estimated Monthly AI Spend | $100–$5,000 |
| Migration Plans Documented | See Section 4 |

> **WARNING:** All AI functionality depends on a single provider (OpenAI). A provider outage, pricing change, or API deprecation would affect 100% of AI features. Diversification is strongly recommended.

## 2. Provider Risk Profiles

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

## 3. Risk Scenarios

### Scenario A: Provider Outage (Hours to Days)

| Impact Area | Details |
|-------------|---------|
| Affected Features | All AI-powered functionality |
| User Impact | Complete loss of AI functionality |
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
| Estimated Current Spend | $100–$5,000 /month |
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
2. **CRITICAL:** Diversify beyond OpenAI — evaluate at least one alternative for each AI capability
3. Establish AI cost budgets with alerts at 80% and 100% thresholds
4. Maintain a model evaluation benchmark suite for rapid provider comparison
5. Negotiate enterprise agreements with SLA guarantees and price caps
6. Store all training data, fine-tuning datasets, and prompt libraries locally
7. Add circuit breakers and graceful degradation for all AI features
8. Monitor provider changelogs and deprecation notices weekly
9. Conduct annual AI supply chain risk review

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

*Generated by [Codepliant](https://github.com/joechensmartz/codepliant) on 2026-03-18. This is an automated risk assessment based on code analysis. Provider profiles are based on publicly available information and should be verified against current provider terms and conditions. This document should be reviewed by qualified risk management and legal counsel.*