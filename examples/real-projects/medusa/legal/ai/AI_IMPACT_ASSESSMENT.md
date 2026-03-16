# AI Impact Assessment

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Organisation:** [Your Company Name]
**Project:** root
**Overall AI Risk Classification:** Limited
**Assessment Date:** 2026-03-16
**Next Review:** 2027-03-16

---

> This document provides a combined impact assessment under the **EU AI Act** (Regulation (EU) 2024/1689) and the **Colorado AI Act** (SB 24-205). It evaluates each AI service integrated into this application, classifies risk levels, identifies required mitigation measures, and establishes a monitoring plan.

## 1. Regulatory Overview

### 1.1 EU AI Act (Regulation (EU) 2024/1689)

The EU AI Act establishes a risk-based regulatory framework for AI systems:

| Risk Level | Requirements | Timeline |
|------------|-------------|----------|
| **Unacceptable** | Prohibited — must not be deployed in the EU | 2 February 2025 |
| **High** | Conformity assessment, registration, continuous monitoring | 2 August 2026 |
| **Limited** | Transparency obligations (disclosure to users) | 2 August 2026 |
| **Minimal** | No mandatory requirements; voluntary codes of conduct | Effective now |

### 1.2 Colorado AI Act (SB 24-205)

The Colorado AI Act, effective **1 February 2026**, requires developers and deployers of "high-risk AI systems" that make or substantially support **consequential decisions** to:

- Perform impact assessments before deployment
- Provide transparency notices to consumers
- Implement risk management programmes
- Enable human appeal mechanisms for adverse decisions
- Report discovered algorithmic discrimination to the AG within 90 days

Consequential decisions include those affecting education, employment, financial services, healthcare, housing, insurance, and legal services.

## 2. AI Services Inventory

| Service | Data Processed | EU AI Act Risk | Colorado AI Act | Monitoring |
|---------|---------------|----------------|-----------------|------------|
| openai | user prompts, conversation history, generated content | **Limited** | N/A | Semi-annual review |

## 3. Per-Service Risk Evaluation

### 3.1 openai

| Field | Detail |
|-------|--------|
| **Service** | `openai` |
| **Category** | ai |
| **Data Processed** | user prompts, conversation history, generated content |
| **EU AI Act Classification** | Limited |
| **Colorado AI Act** | Not in scope |
| **Monitoring Frequency** | Semi-annual review |

**Rationale:** This AI service interacts with end users or generates content, triggering transparency obligations under EU AI Act Article 50.

**Required Mitigations:**

- [ ] Disclose AI interaction to users before or during use
- [ ] Label AI-generated content where required (deepfakes, synthetic text)
- [ ] Maintain AI disclosure documentation
- [ ] Provide opt-out mechanism where feasible
- [ ] Log user interactions for audit purposes

## 4. Algorithmic Discrimination Assessment

Under the Colorado AI Act, deployers must evaluate AI systems for algorithmic discrimination — differential treatment that disfavours individuals based on protected characteristics.

### 4.1 Protected Characteristics (Colorado)

- Age
- Colour
- Disability
- Ethnicity
- Genetic information
- Gender identity / expression
- National origin
- Race
- Religion
- Sex
- Veteran status

### 4.2 Assessment Checklist

- [ ] Identify which AI services make or support consequential decisions
- [ ] Test each service for disparate impact across protected characteristics
- [ ] Document testing methodology, datasets, and results
- [ ] Establish ongoing bias monitoring with alerting thresholds
- [ ] Define remediation procedures for discovered discrimination
- [ ] Set up 90-day reporting process to Colorado AG for discovered discrimination

## 5. Monitoring Plan

| Activity | Frequency | Owner | Next Due |
|----------|-----------|-------|----------|
| Full impact assessment review | Annual | DPO / AI Governance | 2027-03-16 |
| Bias and fairness testing | Quarterly | Engineering | [Set date] |
| Performance metrics review | Monthly | Engineering | [Set date] |
| Incident log review | Monthly | DPO | [Set date] |
| Regulatory change review | Quarterly | Legal | [Set date] |
| Consumer complaint analysis | Monthly | Support / Legal | [Set date] |
| Model drift detection | Continuous | Engineering | Automated |

## 6. Transparency Obligations

### EU AI Act (Article 50)

- [ ] Users are informed they are interacting with an AI system
- [ ] AI-generated content is labelled (deepfakes, synthetic text/audio/video)
- [ ] Emotion recognition / biometric categorisation use is disclosed

### Colorado AI Act

- [ ] Consumers notified that AI is being used to make or support consequential decisions
- [ ] Description of the AI system provided to affected consumers
- [ ] Consumer has access to appeal process with human reviewer
- [ ] Contact information for questions about AI use is published

## 7. AI Incident Response

| Scenario | Action | Timeline | Owner |
|----------|--------|----------|-------|
| Discovered algorithmic discrimination | Report to Colorado AG | 90 days | Legal |
| Serious AI incident (EU) | Report to national authority | Without undue delay | DPO |
| Model producing harmful outputs | Suspend AI feature, investigate | Immediately | Engineering |
| Consumer complaint about AI decision | Initiate human review | 30 days | Support |
| Regulatory inquiry | Engage legal counsel, compile documentation | Within requested timeframe | Legal |

## Contact

- **Email:** [your-email@example.com]

---

*This AI Impact Assessment was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on code analysis. It covers obligations under the EU AI Act (Regulation (EU) 2024/1689) and the Colorado AI Act (SB 24-205). This document must be reviewed by qualified legal counsel and your AI governance team. It does not constitute legal advice.*
