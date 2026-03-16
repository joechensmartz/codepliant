# AI Governance Framework

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** root
**Organization:** [Your Company Name]
**AI Risk Classification:** Limited Risk

## Related Documents

- AI Disclosure (`AI_DISCLOSURE.md`)
- AI Model Card (`AI_MODEL_CARD.md`)
- Acceptable AI Use Policy (`ACCEPTABLE_AI_USE_POLICY.md`)
- Risk Register (`RISK_REGISTER.md`)

---

This AI Governance Framework establishes the policies, roles, and controls for the responsible development, deployment, and operation of AI systems within **[Your Company Name]**. It is aligned with the **EU AI Act** (Regulation (EU) 2024/1689) and the **NIST AI Risk Management Framework** (AI RMF 1.0).

## 1. Scope and Applicability

This framework applies to all AI systems developed, deployed, or procured by the organization, including:

- **openai** — user prompts, conversation history, generated content

This includes both internally developed AI models and third-party AI services accessed via APIs.

## 2. Regulatory Alignment

### 2.1 EU AI Act

The EU AI Act establishes a risk-based regulatory framework for AI systems. This project is classified as follows:

| Aspect | Classification |
|--------|---------------|
| Risk Level | Limited |
| Transparency Obligations | Full transparency required |
| Conformity Assessment | Self-assessment |
| Registration | Not required |
| Human Oversight | Recommended |

### 2.2 NIST AI RMF

The NIST AI Risk Management Framework organizes AI risk management into four functions:

1. **GOVERN** — Establish and maintain AI risk management policies and processes
2. **MAP** — Identify and contextualize AI risks in the application domain
3. **MEASURE** — Analyze, assess, and track AI risks using quantitative and qualitative methods
4. **MANAGE** — Prioritize and act on AI risks to maximize benefits and minimize harms

## 3. Roles and Responsibilities

### 3.1 AI Governance Officer

| Responsibility | Description |
|----------------|-------------|
| Policy ownership | Owns and maintains this AI Governance Framework |
| Risk oversight | Reviews and approves AI risk assessments before deployment |
| Regulatory compliance | Ensures compliance with EU AI Act and applicable regulations |
| Incident escalation | Primary escalation point for AI-related incidents |
| Vendor assessment | Evaluates AI service providers for compliance and risk |
| Reporting | Provides quarterly AI governance reports to leadership |

### 3.2 Development Team

| Responsibility | Description |
|----------------|-------------|
| Implementation | Implements AI features following this framework's controls |
| Testing | Conducts bias testing, accuracy evaluation, and safety checks |
| Documentation | Maintains technical documentation for AI components |
| Monitoring | Implements monitoring for model drift, errors, and anomalies |
| Data quality | Ensures training and input data meets quality standards |
| Security | Implements prompt injection defenses and output filtering |

### 3.3 Compliance Team

| Responsibility | Description |
|----------------|-------------|
| Data protection | Coordinates with DPO ([Data Protection Officer Name], [dpo@example.com]) on AI data processing |
| Impact assessment | Conducts AI Impact Assessments (AIIA) and DPIAs for AI systems |
| Audit support | Supports internal and external audits of AI systems |
| Record keeping | Maintains records required by EU AI Act Article 12 |
| User rights | Handles data subject requests related to AI processing |

### 3.4 Executive Leadership

| Responsibility | Description |
|----------------|-------------|
| Strategic direction | Sets organizational AI strategy and risk appetite |
| Resource allocation | Provides resources for AI governance and compliance |
| Accountability | Bears ultimate accountability for AI system outcomes |
| Culture | Promotes a culture of responsible AI development |

## 4. AI Development Lifecycle Controls

### 4.1 Planning & Design

- [ ] Define the intended purpose and scope of the AI system
- [ ] Conduct an initial risk classification (minimal / limited / high / unacceptable)
- [ ] Identify affected stakeholders and potential impacts
- [ ] Complete an AI Impact Assessment (AIIA)
- [ ] Document data requirements and lawful basis for processing
- [ ] Define success metrics, fairness criteria, and acceptable error rates
- [ ] Establish human oversight mechanisms appropriate to the risk level

### 4.2 Data Preparation

- [ ] Verify lawful basis for data collection and processing (GDPR Art. 6)
- [ ] Assess data quality, completeness, and representativeness
- [ ] Document data provenance and any preprocessing steps
- [ ] Implement data minimization — use only data necessary for the purpose
- [ ] Check for historical biases in training data
- [ ] Establish data versioning and lineage tracking

### 4.3 Development & Training

- [ ] Follow secure development practices (input validation, output filtering)
- [ ] Implement prompt injection defenses for LLM-based systems
- [ ] Document model architecture, hyperparameters, and training methodology
- [ ] Conduct initial bias and fairness testing during development
- [ ] Implement logging for all AI inputs and outputs
- [ ] Version control all model artifacts and configurations

### 4.4 Testing & Validation

- [ ] Conduct comprehensive accuracy and performance testing
- [ ] Execute bias and fairness testing across demographic groups (see Section 7)
- [ ] Perform adversarial testing (prompt injection, data poisoning, evasion)
- [ ] Validate against edge cases and boundary conditions
- [ ] Conduct human evaluation of AI outputs for quality and safety
- [ ] Test graceful degradation and fallback mechanisms
- [ ] Document all test results and maintain test evidence

### 4.5 Deployment

- [ ] Complete pre-deployment risk review and sign-off
- [ ] Implement staged rollout (canary / percentage-based deployment)
- [ ] Configure monitoring, alerting, and anomaly detection
- [ ] Establish rollback procedures and kill switches
- [ ] Notify users that AI is being used (EU AI Act transparency obligation)
- [ ] Update privacy policy and AI disclosure documents

### 4.6 Monitoring & Maintenance

- [ ] Monitor model performance metrics continuously
- [ ] Track for model drift (data drift and concept drift)
- [ ] Review AI outputs regularly for quality, safety, and bias
- [ ] Conduct periodic re-evaluation (minimum quarterly)
- [ ] Update documentation when models or configurations change
- [ ] Respond to and investigate AI-related incidents per the Incident Response Plan

## 5. Model Evaluation Criteria

All AI models (including third-party API services) must be evaluated against the following criteria before deployment and during periodic reviews:

### 5.1 Performance Metrics

| Metric | Minimum Threshold | Measurement Method |
|--------|-------------------|-------------------|
| Accuracy / Task Success Rate | [Define per use case] | Automated testing against labeled dataset |
| Latency (p95) | [Define SLA] | Application performance monitoring |
| Availability | 99.9% | Uptime monitoring |
| Error Rate | < 5% (adjust per criticality) | Error tracking and logging |
| Hallucination Rate | < 2% for factual claims | Human evaluation sampling |

### 5.2 Safety and Security

| Criterion | Requirement |
|-----------|-------------|
| Prompt injection resistance | Tested with standard attack vectors; no data leakage |
| Output filtering | Harmful, illegal, or inappropriate content blocked |
| Data leakage prevention | No PII or confidential data in model outputs unless authorized |
| Authentication | All AI API calls authenticated and authorized |
| Rate limiting | Implemented to prevent abuse and cost overruns |

### 5.3 Vendor Evaluation (Third-Party AI Services)

For each detected AI service, evaluate:

#### openai

- [ ] Data processing agreement (DPA) in place
- [ ] Data residency and transfer mechanisms confirmed
- [ ] Training data usage policy reviewed (opt-out confirmed if available)
- [ ] SOC 2 Type II or equivalent certification verified
- [ ] Incident notification SLA confirmed
- [ ] Model versioning and deprecation policy understood

## 6. AI Risk Assessment Matrix

### 6.1 Risk Categories (EU AI Act)

| Risk Level | Definition | Requirements | Examples |
|------------|------------|--------------|----------|
| **Unacceptable** | AI systems that pose clear threats to safety, livelihoods, or rights | Prohibited | Social scoring, real-time biometric surveillance |
| **High** | AI systems that significantly impact health, safety, or fundamental rights | Conformity assessment, registration, human oversight, logging | Credit scoring, hiring, healthcare diagnosis |
| **Limited** | AI systems that interact with humans or generate content | Transparency obligations (user notification) | Chatbots, content generation, emotion detection |
| **Minimal** | AI systems with minimal risk to rights or safety | No mandatory requirements (voluntary codes of conduct) | Spam filters, game AI, search ranking |

### 6.2 Project Risk Assessment

Based on the detected AI services and their usage patterns, this project is classified as **limited risk**.

> **Action Required:** Limited-risk AI systems must comply with transparency obligations. Users must be informed they are interacting with AI, and AI-generated content must be labeled as such.

## 7. Bias Testing Requirements

### 7.1 Testing Obligations

AI systems must be tested for bias before initial deployment and at regular intervals. The EU AI Act (Article 10) requires that training, validation, and testing datasets be:

- Representative of the intended user population
- Free from errors and data quality issues
- Assessed for biases that could lead to discriminatory outcomes

### 7.2 Protected Characteristics

Test for differential impact across the following protected characteristics (per EU anti-discrimination law and jurisdiction-specific requirements):

| Characteristic | Testing Approach |
|----------------|-----------------|
| Race / Ethnicity | Compare outputs across diverse demographic inputs |
| Gender / Gender Identity | Test with gender-varied inputs; check for stereotyping |
| Age | Verify no age-based discrimination in outputs |
| Disability | Test accessibility and equitable treatment |
| Religion / Belief | Check for religious bias in content generation |
| Sexual Orientation | Verify inclusive and non-discriminatory outputs |
| Nationality / National Origin | Test for geographic or nationality-based bias |
| Socioeconomic Status | Check for class-based bias in recommendations or decisions |

### 7.3 Testing Methodology

1. **Baseline evaluation** — Establish performance metrics across demographic groups
2. **Counterfactual testing** — Swap protected attributes and verify consistent outcomes
3. **Red teaming** — Dedicated adversarial testing to elicit biased responses
4. **User feedback analysis** — Monitor production feedback for bias reports
5. **Quantitative metrics** — Calculate demographic parity, equalized odds, and calibration across groups

### 7.4 Testing Schedule

| Trigger | Action Required |
|---------|----------------|
| Pre-deployment | Full bias testing suite |
| Model update / version change | Re-run bias tests on new model |
| Quarterly | Scheduled bias review using production data |
| Incident report | Ad-hoc bias investigation |
| Regulatory request | Full audit documentation |

### 7.5 Remediation

When bias is detected:

1. Document the bias finding, affected groups, and severity
2. Assess whether to disable the feature, add guardrails, or retrain
3. Implement mitigation (prompt engineering, output filtering, model fine-tuning)
4. Re-test to verify the bias has been addressed
5. Update this framework and related documentation
6. If the bias caused harm, follow the Incident Response Plan

## 8. Transparency and Documentation Requirements

### 8.1 User-Facing Transparency

- Users must be informed when they are interacting with an AI system (EU AI Act Art. 50)
- AI-generated content must be clearly labeled as such
- Users must have access to meaningful information about the logic involved
- Opt-out mechanisms should be provided where technically feasible

### 8.2 Technical Documentation (EU AI Act Annex IV)

Maintain the following documentation for each AI system:

- [ ] General description of the AI system and its intended purpose
- [ ] Description of the elements of the AI system and its development process
- [ ] Detailed information about monitoring, functioning, and control
- [ ] Description of the risk management system
- [ ] Data governance and management practices
- [ ] Performance metrics and testing results
- [ ] Description of human oversight measures

## 9. AI-Specific Incident Response

AI-related incidents must be handled according to the organization's Incident Response Plan with the following additional considerations:

| Incident Type | Severity | Immediate Action |
|---------------|----------|-----------------|
| Data leak via AI processing | Critical | Disable AI feature, assess data exposure |
| Systematic bias detected | High | Implement output filtering, conduct investigation |
| Prompt injection exploit | High | Block attack vector, review all affected outputs |
| Model producing harmful content | High | Disable feature, apply content filters |
| Performance degradation / drift | Medium | Investigate root cause, consider rollback |
| User complaint about AI accuracy | Low-Medium | Review specific case, update training data |

For incidents involving high-risk AI systems under the EU AI Act, the following additional reporting obligations apply:

- Report serious incidents to the relevant national market surveillance authority
- Notify the AI provider (for third-party AI services)
- Document corrective actions and timeline

## 10. Review and Audit Schedule

| Activity | Frequency | Responsible |
|----------|-----------|-------------|
| Framework review and update | Annually | AI Governance Officer |
| AI risk assessment review | Quarterly | AI Governance Officer + Development Team |
| Bias testing | Quarterly + pre-deployment | Development Team |
| Model performance review | Monthly | Development Team |
| Vendor compliance check | Annually | Compliance Team |
| Internal AI audit | Annually | Compliance Team |
| Regulatory landscape review | Quarterly | Compliance Team |

## 11. Contact

For questions about this AI Governance Framework, contact:

- **AI Governance Officer:** [Name] ([email])
- **Data Protection Officer:** [Data Protection Officer Name] ([dpo@example.com])
- **General inquiries:** [your-email@example.com]

---

*This AI Governance Framework was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **root** codebase. It should be reviewed and customized by your legal, compliance, and AI governance teams before adoption.*