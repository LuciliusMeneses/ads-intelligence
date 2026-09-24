/**
 * ADS INTELLIGENCE — LLM Runtime Executor
 * NineRouter is the default runtime provider.
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
  provider: string;
  model: string;
  status: 'SUCCESS' | 'FAILED' | 'TIMEOUT' | 'INVALID_OUTPUT';
  latencyMs: number;
}

export class LLMRuntime {
  constructor(
    private provider: LLMProvider = new NineRouterLLMProvider(),
    private executionLogger?: (record: LLMExecutionRecord) => Promise<void>
  ) {
    if (!provider) throw new Error('[Runtime] Provedor inválido.');
  }

  public async executeSpecialist(params: {
    organizationId: string;
    campaignId?: string;
    specialist: ExpertRole;
    capability: SpecialistCapability;
    context: Partial<SpecialistContext>;
    validEvidenceIds: string[];
    maxRetries?: number;
  }): Promise<{ output: SpecialistLLMOutput; rawResponse: LLMResponse }> {
    const promptDef = PromptRegistry.getPrompt(params.specialist);
    const routeConfig = ModelRoutingPolicy.getConfig(params.capability);
    const maxRetries = params.maxRetries ?? 2;

    const messages: LLMMessage[] = [
      { role: 'system', content: promptDef.systemPrompt },
      { role: 'user', content: JSON.stringify(params.context) }
    ];

    let attempt = 0;
    while (attempt <= maxRetries) {
      try {
        const { data, rawResponse } = await this.provider.generateStructured<SpecialistLLMOutput>(
          messages,
          StructuredOutputValidator.validate,
          {
            model: routeConfig.preferredModel,
            temperature: routeConfig.temperature,
            maxTokens: routeConfig.maxTokens,
            timeoutMs: routeConfig.timeoutMs
          }
        );

        if (!StructuredOutputValidator.verifyEvidenceBinding(data, params.validEvidenceIds).valid) {
          throw new Error('Evidence mismatch');
        }

        return { output: data, rawResponse };
      } catch (err: any) {
        attempt++;
        if (attempt > maxRetries) throw err;
        await new Promise(res => setTimeout(res, 500 * attempt));
      }
    }
    throw new Error('Execution failed');
  }
}
