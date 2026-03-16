# AI Training Data Notice

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** twenty
**Organization:** [Your Company Name]

---

This notice discloses whether user data processed by AI services in this application is used for AI model training, and provides instructions for opting out where applicable.

Transparency about AI training data usage is required under:

- **EU AI Act** (Regulation (EU) 2024/1689) — transparency obligations under Article 50
- **GDPR** (Regulation (EU) 2016/679) — lawful basis and purpose limitation under Articles 5 and 6
- **CCPA/CPRA** — right to know about the purposes of data collection

## Summary


| AI Provider | Uses Data for Training | Opt-Out Available |
|-------------|----------------------|-------------------|
| OpenAI | No | N/A (not used) |
| @ai-sdk/anthropic | Unknown | Review provider policy |
| @ai-sdk/google | Unknown | Review provider policy |
| @ai-sdk/openai | Unknown | Review provider policy |
| @vercel/ai | Unknown | Review provider policy |

## Our Commitment

[Your Company Name] is committed to protecting your data when it is processed by AI services. We commit to:

1. **Not sharing user data for AI training** without explicit consent
2. **Using commercial API tiers** that exclude data from model training where available
3. **Reviewing AI provider training policies** at least quarterly
4. **Notifying users** if any provider changes their training data policy
5. **Minimizing data sent** to AI providers (data minimization principle)

## Per-Provider Training Data Policies

### OpenAI

**Service:** openai
**Uses Data for Training:** No

**Details:** API data is NOT used for model training by default. OpenAI's API Data Usage Policy (effective March 1, 2023) states that data sent via the API will not be used to train or improve models unless you explicitly opt in.

**Data Retention:** API inputs/outputs retained for 30 days for abuse monitoring only (not training)

**Opt-Out Instructions:**

- API data is opted out by default. If using ChatGPT (consumer), disable 'Improve the model for everyone' in Settings > Data Controls.
- Full policy: [https://openai.com/policies/privacy-policy](https://openai.com/policies/privacy-policy)

### Other AI Services

The following AI services were detected but their training data policies could not be automatically verified. Review their documentation directly:

- **@ai-sdk/anthropic** — detected in `packages/twenty-server/src/engine/metadata-modules/ai/ai-chat/services/chat-execution.service.ts`, `packages/twenty-server/src/engine/metadata-modules/ai/ai-models/services/agent-model-config.service.ts`, `packages/twenty-server/src/engine/metadata-modules/ai/ai-models/services/ai-model-registry.service.ts`
- **@ai-sdk/google** — detected in `packages/twenty-server/src/engine/metadata-modules/ai/ai-models/services/ai-model-registry.service.ts`
- **@ai-sdk/openai** — detected in `packages/twenty-server/src/engine/metadata-modules/ai/ai-chat/services/chat-execution.service.ts`, `packages/twenty-server/src/engine/metadata-modules/ai/ai-models/services/agent-model-config.service.ts`, `packages/twenty-server/src/engine/metadata-modules/ai/ai-models/services/ai-model-registry.service.ts`
- **@vercel/ai** — detected in `packages/twenty-front/src/modules/ai/components/AIChatAssistantMessageRenderer.tsx`, `packages/twenty-front/src/modules/ai/components/ThinkingStepsDisplay.tsx`, `packages/twenty-front/src/modules/ai/components/ToolStepRenderer.tsx`, `packages/twenty-front/src/modules/ai/hooks/useAgentChat.ts`, `packages/twenty-front/src/modules/ai/types/ToolInput.ts`, `packages/twenty-front/src/modules/ai/types/agent-chat-file-ui-part.type.ts`, `packages/twenty-front/src/modules/ai/utils/extractUIToolCallParts.ts`, `packages/twenty-front/src/modules/ai/utils/getActiveReasoningContent.ts`, `packages/twenty-front/src/modules/ai/utils/getLastReasoningContent.ts`, `packages/twenty-front/src/modules/ai/utils/isThinkingStepPart.ts`, `packages/twenty-front/src/modules/ai/utils/mapDBPartToUIMessagePart.ts`, `packages/twenty-front/src/modules/ai/utils/thinkingStepPart.ts`, `packages/twenty-server/src/engine/api/mcp/services/mcp-protocol.service.ts`, `packages/twenty-server/src/engine/api/mcp/services/mcp-tool-executor.service.ts`, `packages/twenty-server/src/engine/core-modules/tool-generator/services/per-object-tool-generator.service.ts`, `packages/twenty-server/src/engine/core-modules/tool-generator/types/tool-generator.types.ts`, `packages/twenty-server/src/engine/core-modules/tool-provider/interfaces/tool-provider.interface.ts`, `packages/twenty-server/src/engine/core-modules/tool-provider/output-serialization/wrap-tools-with-output-serialization.util.ts`, `packages/twenty-server/src/engine/core-modules/tool-provider/providers/native-model-tool.provider.ts`, `packages/twenty-server/src/engine/core-modules/tool-provider/services/tool-executor.service.ts`, `packages/twenty-server/src/engine/core-modules/tool-provider/services/tool-registry.service.ts`, `packages/twenty-server/src/engine/core-modules/tool-provider/tools/execute-tool.tool.ts`, `packages/twenty-server/src/engine/core-modules/tool-provider/utils/tool-set-to-descriptors.util.ts`, `packages/twenty-server/src/engine/metadata-modules/ai/ai-agent/utils/repair-tool-call.util.ts`, `packages/twenty-server/src/engine/metadata-modules/ai/ai-agent-execution/entities/agent-message-part.entity.ts`, `packages/twenty-server/src/engine/metadata-modules/ai/ai-agent-execution/types/agent-execution-result.type.ts`, `packages/twenty-server/src/engine/metadata-modules/ai/ai-agent-execution/utils/mapUIMessagePartsToDBParts.ts`, `packages/twenty-server/src/engine/metadata-modules/ai/ai-agent-monitor/services/agent-turn-grader.service.ts`, `packages/twenty-server/src/engine/metadata-modules/ai/ai-billing/services/ai-billing.service.ts`, `packages/twenty-server/src/engine/metadata-modules/ai/ai-billing/utils/merge-language-model-usage.util.ts`, `packages/twenty-server/src/engine/metadata-modules/ai/ai-chat/services/agent-chat-streaming.service.ts`, `packages/twenty-server/src/engine/metadata-modules/ai/ai-chat/services/agent-chat.service.ts`, `packages/twenty-server/src/engine/metadata-modules/ai/ai-chat/services/agent-title-generation.service.ts`, `packages/twenty-server/src/engine/metadata-modules/ai/ai-chat/utils/extract-code-interpreter-files.util.ts`, `packages/twenty-server/src/engine/metadata-modules/ai/ai-generate-text/controllers/ai-generate-text.controller.ts`, `packages/twenty-server/src/engine/metadata-modules/ai/ai-models/services/agent-model-config.service.ts`, `packages/twenty-server/src/engine/metadata-modules/ai/ai-models/services/ai-model-registry.service.ts`, `packages/twenty-server/src/engine/metadata-modules/ai/ai-models/services/ai.service.ts`, `packages/twenty-server/src/engine/metadata-modules/field-metadata/tools/field-metadata-tools.factory.ts`, `packages/twenty-server/src/engine/metadata-modules/object-metadata/tools/object-metadata-tools.factory.ts`, `packages/twenty-server/src/engine/metadata-modules/view/tools/view-tools.factory.ts`, `packages/twenty-server/src/engine/metadata-modules/view-field/tools/view-field-tools.factory.ts`, `packages/twenty-server/src/modules/dashboard/tools/services/dashboard-tool.workspace-service.ts`, `packages/twenty-server/src/modules/workflow/workflow-tools/services/workflow-tool.workspace-service.ts`, `packages/twenty-server/test/integration/metadata/suites/field-metadata/morph-relation/successful-update-one-field-metadata-morph-relation-v2.integration-spec.ts`, `packages/twenty-shared/src/ai/types/ExtendedUIMessage.ts`, `packages/twenty-shared/src/ai/types/ExtendedUIMessagePart.ts`

> **Action required:** Review the training data policies of the services listed above and update this notice with their specific policies.

## Your Rights

You have the right to:

- **Know** whether your data is used for AI training
- **Object** to having your data used for AI training (GDPR Art. 21)
- **Withdraw consent** for AI data processing at any time (GDPR Art. 7(3))
- **Request deletion** of data that has been sent to AI providers (GDPR Art. 17)
- **Opt out** of data sharing for AI training (CCPA/CPRA right to opt out)

To exercise these rights, contact us at **[your-email@example.com]**.

## Implementation Checklist

- [ ] All AI provider training data policies have been reviewed
- [ ] Commercial API tiers are used where available to prevent training data usage
- [ ] Users are informed about AI data processing before first interaction
- [ ] Opt-out mechanisms are implemented and accessible
- [ ] Data minimization is applied to AI API calls
- [ ] This notice is linked from the application's privacy policy
- [ ] Quarterly review of AI provider training policies is scheduled

## Contact

For questions about AI training data practices, contact:

- **Email:** [your-email@example.com]

---

*This AI training data notice was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **twenty** codebase. AI provider training policies are subject to change. This document should be reviewed regularly and verified against each provider's current terms of service and privacy policy.*