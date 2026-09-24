/**
 * ADS INTELLIGENCE — LLM Runtime Executor
 * NineRouter is the default provider. Fake is strictly test-only.
 */

import { LLMProvider, LLMMessage, LLMResponse, NineRouterLLMProvider } from './provider';
import { ModelRoutingPolicy, SpecialistCapability } from './routing';
import { PromptRegistry } from './registry';
import { StructuredOutputValidator, SpecialistLLMOutput } from './validator';
import { ExpertRole } from '../types/ads-intelligence';
import { SpecialistContext } from '../types/intelligence';

export interface LLMExecutionRecord {
  organizationId: string;
  campaignId?: string;
  specialist: ExpertRole;
  promptId: string;
  provider: string;
  model: string;
  status: 'SUCCESS' | 'FAILED' | 'TIMEOUT' | 'INVALID_OUTPUT';
}

export class LLMRuntime {
  constructor(
    private provider: LLMProvider = new NineRouterLLMProvider(),
    private executionLogger?: (record: LLMExecutionRecord) => Promise<void>
  ) {}

  public async executeSpecialist(params: {
    organizationId: string;
    specialist: ExpertRole;
    capability: SpecialistCapability;
    context: Partial<SpecialistContext>;
    validEvidenceIds: string[];
  }): Promise<{ output: SpecialistLLMOutput; rawResponse: LLMResponse }> {
    const promptDef = PromptRegistry.getPrompt(params.specialist, 'v1');
    const route = ModelRoutingPolicy.getConfig(params.capability);

    const messages: LLMMessage[] = [
      { role: 'system', content: promptDef.systemPrompt },
      { role: 'user', content: `[TENANT: ${params.organizationId}]\n${JSON.stringify(params.context)}\n\nEVIDENCE: [${params.validEvidenceIds.join(', ')}]` }
    ];

    const { data, rawResponse } = await this.provider.generateStructured(
      messages,
      json => StructuredOutputValidator.validate(json),
      { model: route.preferredModel, temperature: route.temperature, maxTokens: route.maxTokens, timeoutMs: route.timeoutMs }
    );

    if (!StructuredOutputValidator.verifyEvidenceBinding(data, params.validEvidenceIds).valid) throw new Error('Invalid Evidence');
    if (!StructuredOutputValidator.verifyProvenance(data)) throw new Error('Provenance Violation');

    return { output: data, rawResponse };
  }
}
