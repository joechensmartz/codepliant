# AI Disclosure Statement

**Last updated:** 2026-03-16

**Project:** @documenso/root

---

## 1. Introduction

This AI Disclosure Statement is provided by [Your Company Name] in compliance with the European Union Artificial Intelligence Act (Regulation (EU) 2024/1689), which establishes harmonised rules on artificial intelligence. Full transparency obligations under the EU AI Act take effect on **2 August 2026**.

This document describes the AI systems used in this application, how they are classified under the EU AI Act risk framework, what data they process, and what rights you have in relation to AI-assisted features.

## 2. AI Systems Inventory

This application integrates the following AI systems:

| AI Service | Provider | Data Processed | Purpose |
|-----------|----------|---------------|---------|
| @ai-sdk/google-vertex | @ai-sdk/google-vertex | user prompts, conversation history, generated content | AI processing |
| @vercel/ai | @vercel/ai | user prompts, conversation history, generated content | AI processing |

## 3. Risk Classification

Under the EU AI Act, AI systems are classified into risk categories that determine the applicable obligations. Based on analysis of the AI services used in this application:

**Classification: Limited Risk**

This application's use of AI is classified as **limited risk** because AI services interact directly with users (e.g., processing user prompts, generating content, or providing AI-assisted responses). Limited-risk AI systems are subject to transparency obligations under Article 50 of the EU AI Act.

### Applicable Obligations

- Users must be informed when interacting with an AI system (Art. 50(1))
- AI-generated content must be disclosed and machine-readably marked (Art. 50(2))
- Synthetic media (deepfakes) must be labelled (Art. 50(4))
- Disclosure must be accessible and provided at first interaction (Art. 50(5))
- Emotion recognition systems must inform exposed individuals (Art. 50(3))

## 4. Transparency Obligations

In accordance with Article 50 of the EU AI Act, we inform you of the following:

### 4.1 AI Interaction Disclosure

When you interact with AI-powered features of this application, you are communicating with an AI system, not a human. AI features are clearly identified within the application.

### 4.2 AI Limitations

- AI-generated outputs may not always be accurate, complete, or unbiased
- AI responses are based on the training data and capabilities of the underlying models
- AI features are designed to assist, not to replace professional judgment

### 4.3 First-Interaction Disclosure (Art. 50(5))

Under Article 50(5), users must be informed at the point of first interaction with the AI system, in a clear and distinguishable manner, meeting accessibility standards (Directive (EU) 2019/882).

**Recommended implementation for this application:**
- Display a notice before the user first interacts with AI features
- Include an AI indicator icon or badge on AI-generated content
- Link to this full disclosure from the in-app notification

## 5. AI-Generated Content

### 5.1 Synthetic Content Disclosure

This application generates synthetic content (text, and potentially other media) using AI. All content produced by AI features is artificial and should not be treated as human-authored.

### 5.2 Machine-Readable Marking (Art. 50(2))

Article 50(2) of the EU AI Act requires that AI-generated content be marked in a machine-readable format so that it can be identified as artificially generated or manipulated.

**Technical implementation:**
- AI-generated outputs should be marked using machine-readable metadata (e.g., C2PA content credentials, watermarking, or embedded flags)
- Marking should be applied at the point of generation and be interoperable with detection tools
- The EU Code of Practice on marking and labelling AI-generated content provides guidance on compliant marking methods

> **Action required:** Implement a technical mechanism to mark AI-generated outputs in accordance with Article 50(2). Consult the EU Code of Practice on AI-generated content labelling (final version expected 2026) for guidance on compliant marking methods.

## 6. Data Processing by AI

### 6.1 What Data Is Sent to AI Providers

The following data may be sent to third-party AI service providers for processing:

| Data Type | AI Providers Receiving Data |
|-----------|-----------------------------|
| user prompts | @ai-sdk/google-vertex, @vercel/ai |
| conversation history | @ai-sdk/google-vertex, @vercel/ai |
| generated content | @ai-sdk/google-vertex, @vercel/ai |

### 6.2 Data Retention

- We do not use your data to train or fine-tune AI models
- Data may be temporarily retained by AI providers for abuse prevention and service improvement
- AI interaction data is typically retained for up to 90 days, subject to each provider's data processing policies

### 6.3 Cross-Border Transfers

Data sent to AI providers may be transferred to and processed in countries outside the European Economic Area (EEA), including the United States. Where such transfers occur, appropriate safeguards are in place, including Standard Contractual Clauses (SCCs) and, where applicable, EU-US Data Privacy Framework certification.

## 7. Human Oversight

In accordance with the EU AI Act's requirements for human oversight of AI systems:

- AI features are designed to assist users, not to make autonomous decisions
- Users maintain full control over whether to accept, modify, or reject AI-generated outputs
- Critical decisions should not be based solely on AI outputs without human review
- Users can request human review of any AI-assisted decision that affects them

### How to Request Human Review

If an AI-powered feature of this application produces a decision or output that affects you, you have the right to request that a human reviews the decision. To request human review:

- Contact us at [your-email@example.com]
- Describe the AI-assisted decision or output in question
- We will have a qualified person review the matter and respond within a reasonable timeframe

## 8. User Rights Regarding AI

Under the EU AI Act and applicable data protection laws, you have the right to:

- **Know** when you are interacting with an AI system
- **Understand** how your data is used in AI processing
- **Opt out** of AI-powered features where technically feasible
- **Request information** about the logic involved in AI decisions that affect you
- **Request human review** of AI-assisted decisions that produce legal or similarly significant effects
- **Contest** AI-generated decisions and express your point of view
- **Lodge complaints** with your local data protection authority or the relevant national AI supervisory authority

To exercise any of these rights, contact us at [your-email@example.com].

## 9. AI Provider Policies

The following AI providers process data on behalf of this application. We encourage you to review their privacy and data handling policies:

| Provider | Privacy Policy |
|----------|---------------|
| @ai-sdk/google-vertex | [Privacy & Data Policy](#) |
| @vercel/ai | [Privacy & Data Policy](#) |

## 10. Compliance Checklist

The following checklist summarises key EU AI Act compliance actions for this application:

### Transparency
- [ ] Users are informed when interacting with AI features
- [ ] AI-generated content is clearly labelled
- [ ] This AI Disclosure document is accessible from the application
- [ ] Disclosure is provided at or before first AI interaction

### Content Marking
- [ ] AI-generated outputs include machine-readable marking (Art. 50(2))
- [ ] Marking method is interoperable with standard detection tools
- [ ] Synthetic media is labelled as AI-generated (Art. 50(4))

### Human Oversight
- [ ] Process exists for users to request human review of AI decisions
- [ ] Staff are trained to handle human review requests
- [ ] AI features do not make autonomous decisions with legal or significant effects

### Documentation
- [ ] AI systems inventory is complete and up to date
- [ ] Data processing records include AI providers
- [ ] AI provider agreements are reviewed and signed
- [ ] This disclosure is reviewed and updated regularly

## 11. Contact

For questions about our use of AI systems or to exercise your rights under the EU AI Act, please contact:

- **Email:** [your-email@example.com]

For complaints regarding AI systems, you may also contact your national supervisory authority responsible for the enforcement of the EU AI Act.
