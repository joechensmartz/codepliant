# AI Model Card

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Organisation:** [Your Company Name]
**Project:** @documenso/root
**Risk Classification:** Limited
**Generated:** 2026-03-16

## Related Documents

- AI Disclosure (`AI_DISCLOSURE.md`)
- AI Act Compliance Checklist (`AI_ACT_CHECKLIST.md`)
- AI Governance Framework (`AI_GOVERNANCE_FRAMEWORK.md`)

---

> This document provides model-level transparency information for each AI service integrated into this application, in accordance with Article 53 of the EU AI Act (Regulation (EU) 2024/1689) regarding transparency obligations for providers of general-purpose AI (GPAI) models. Full obligations take effect on **2 August 2026**.

---

## Google Vertex AI

### Overview

| Field | Detail |
|-------|--------|
| **Model / Service** | Google Vertex AI |
| **Provider** | Google Cloud |
| **Service Identifier** | `@ai-sdk/google-vertex` |
| **Use Case in This Application** | Enterprise AI model hosting, natural language processing, content generation |
| **Risk Classification** | Limited |

### Data Inputs

The following data types are sent to this AI service based on code analysis:

- user prompts
- conversation history
- generated content

### Known Limitations

- May generate factually incorrect or misleading content
- Model behaviour depends on the specific model deployed on Vertex AI
- Enterprise features may introduce additional latency
- SDK abstraction layer may limit access to provider-specific safety features

### Bias Considerations

- Bias profile depends on the underlying model deployed
- Enterprise deployments should conduct domain-specific bias testing
- Training data reflects biases present in web-scale corpora
- Performance varies across languages and domains

### Performance Metrics

> **Placeholder:** See Google Cloud Vertex AI documentation for model-specific benchmarks
>
> Operators deploying this AI system should document application-specific performance metrics including accuracy, false positive/negative rates, and fairness metrics relevant to their use case.

| Metric | Value | Notes |
|--------|-------|-------|
| Accuracy | _To be measured_ | Measure against application-specific test set |
| Latency (p50) | _To be measured_ | Median response time in production |
| Latency (p99) | _To be measured_ | 99th percentile response time |
| Error rate | _To be measured_ | Rate of failed or invalid responses |
| Fairness | _To be measured_ | Evaluate across demographic groups relevant to use case |

### Training Data Transparency

- **Provider documentation:** [Google Cloud Research & Documentation](https://cloud.google.com/vertex-ai/docs)
- **Training data disclosure:** Refer to the provider's published model card and technical reports for details on training data composition, filtering, and governance
- **Data governance:** Review the provider's data processing agreement for information on how training data is sourced, curated, and maintained

---

## Vercel AI SDK (multi-provider)

### Overview

| Field | Detail |
|-------|--------|
| **Model / Service** | Vercel AI SDK (multi-provider) |
| **Provider** | Vercel (orchestration layer) |
| **Service Identifier** | `@vercel/ai` |
| **Use Case in This Application** | AI orchestration, streaming responses, multi-provider integration |
| **Risk Classification** | Limited |

### Data Inputs

The following data types are sent to this AI service based on code analysis:

- user prompts
- conversation history
- generated content

### Known Limitations

- Limitations depend on the underlying AI provider and model selected
- Orchestration layer adds a dependency but does not process data itself
- Streaming responses may be interrupted by network conditions
- Provider-specific safety features may not be fully exposed through the SDK

### Bias Considerations

- Bias profile depends entirely on the underlying model and provider
- The SDK itself does not introduce additional bias but also does not mitigate it
- Applications should evaluate bias at the provider/model level

### Performance Metrics

> **Placeholder:** Performance depends on the underlying provider; see provider-specific documentation
>
> Operators deploying this AI system should document application-specific performance metrics including accuracy, false positive/negative rates, and fairness metrics relevant to their use case.

| Metric | Value | Notes |
|--------|-------|-------|
| Accuracy | _To be measured_ | Measure against application-specific test set |
| Latency (p50) | _To be measured_ | Median response time in production |
| Latency (p99) | _To be measured_ | 99th percentile response time |
| Error rate | _To be measured_ | Rate of failed or invalid responses |
| Fairness | _To be measured_ | Evaluate across demographic groups relevant to use case |

### Training Data Transparency

- **Provider documentation:** [Vercel (orchestration layer) Research & Documentation](https://sdk.vercel.ai/docs)
- **Training data disclosure:** Refer to the provider's published model card and technical reports for details on training data composition, filtering, and governance
- **Data governance:** Review the provider's data processing agreement for information on how training data is sourced, curated, and maintained

---

## Article 53 Compliance Summary

The EU AI Act Article 53 requires providers of general-purpose AI models to:

### 53(1) — Technical Documentation
- [ ] Maintain up-to-date technical documentation for each GPAI model used
- [ ] Documentation covers model training, testing, and evaluation results
- [ ] Information is sufficient for downstream providers to comply with their obligations

### 53(1)(a) — Model Identification
- [ ] Each AI model is clearly identified with name, version, and provider
- [ ] Model capabilities and limitations are documented
- [ ] Intended and foreseeable use cases are described

### 53(1)(b) — Training & Testing
- [ ] Training data sources and governance are documented (or referenced from provider)
- [ ] Evaluation results and benchmark performance are recorded
- [ ] Testing methodology is described or referenced

### 53(1)(c) — Integration Information
- [ ] Information for downstream integrators is provided
- [ ] API usage, data flow, and processing scope are documented
- [ ] Known risks and mitigation measures are communicated

### 53(1)(d) — Copyright Compliance
- [ ] Provider's copyright policy for training data is reviewed
- [ ] EU Copyright Directive (Directive (EU) 2019/790) compliance is verified with provider
- [ ] Text and data mining opt-out mechanisms are documented where applicable

### 53(2) — Systemic Risk (if applicable)
- [ ] Assess whether any GPAI model used has systemic risk (>10^25 FLOPs or EC designation)
- [ ] If systemic risk applies, additional obligations under Article 55 must be met
- [ ] Model evaluation and adversarial testing documentation is maintained

> **Note:** As a deployer (not provider) of GPAI models, your primary obligation is to ensure that the AI providers you use comply with Article 53. This checklist helps you verify and document that compliance.

## Data Flow Summary

| Data Type | AI Providers Receiving Data |
|-----------|-----------------------------|
| user prompts | Google Cloud, Vercel (orchestration layer) |
| conversation history | Google Cloud, Vercel (orchestration layer) |
| generated content | Google Cloud, Vercel (orchestration layer) |

## Contact

For questions about the AI models used in this application:

- **Email:** [your-email@example.com]

---

*This AI Model Card was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Model information is derived from publicly available provider documentation as of the generation date. This document should be reviewed by a qualified professional to ensure compliance with the EU AI Act (Regulation (EU) 2024/1689) Article 53 and other applicable regulations. Performance metrics marked as placeholders must be completed based on application-specific evaluation.*