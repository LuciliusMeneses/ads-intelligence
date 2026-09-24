/**
 * ADS INTELLIGENCE — LLM Runtime Executor
 * NineRouter is the default production runtime.
 */

import { LLMProvider, LLMMessage, LLMResponse, NineRouterLLMProvider } from './provider';
import { ModelRoutingPolicy, SpecialistCapability } from './routing';
import { PromptRegistry } from './registry';
import { StructuredOutputValidator, SpecialistLLMOutput } from './validator';
import { ExpertRole } from '../types/ads-intelligence';
import { SpecialistContext } from '../types/intelligence';

export class LLMRuntime {
  constructor(
    private provider: LLMProvider = new NineRouterLLMProvider(),
    private executionLogger?: any
  ) {}

  public async executeSpecialist(params: {
    organizationId: string;
    specialist: ExpertRole;
    capability: SpecialistCapability;
    context: Partial<SpecialistContext>;
    validEvidenceIds: string[];
    maxRetries?: number;
  }): Promise<{ output: SpecialistLLMOutput; rawResponse: LLMResponse }> {
    const promptDef = PromptRegistry.getPrompt(params.specialist, 'v1');
    const routeConfig = ModelRoutingPolicy.getConfig(params.capability);
    const maxRetries = params.maxRetries ?? 2;

    const messages: LLMMessage[] = [
      { role: 'system', content: promptDef.systemPrompt },
      {
        role: 'user',
        content: `[TENANT: ${params.organizationId}]\n${JSON.stringify(params.context)}\n\nEVIDÊNCIAS: [${params.validEvidenceIds.join(', ')}]`
      }
    ];

    let attempt = 0;
    while (attempt <= maxRetries) {
      try {
        const { data, rawResponse } = await this.provider.generateStructured<SpecialistLLMOutput>(
          messages,
          json => StructuredOutputValidator.validate(json),
          {
            model: routeConfig.preferredModel,
            temperature: routeConfig.temperature,
            maxTokens: routeConfig.maxTokens,
            timeoutMs: routeConfig.timeoutMs
          }
        );
        return { output: data, rawResponse };
      } catch (err: any) {
        attempt++;
        if (attempt > maxRetries) throw err;
        await new Promise(r => setTimeout(r, 500 * attempt));
      }
    }
    throw new Error('LLM Execution Failed');
  }
}
