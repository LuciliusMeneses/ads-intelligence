/**
 * ADS INTELLIGENCE — LLM Runtime Executor
 * Manages LLM execution, retries, structured output validation, provenance checks,
 * hallucination guards, and token/cost observability persistence.
 */

import { LLMProvider, LLMMessage, LLMResponse, NineRouterLLMProvider } from './provider';
import { ModelRoutingPolicy, SpecialistCapability } from './routing';
import { PromptRegistry } from './registry';
import { StructuredOutputValidator, SpecialistLLMOutput } from './validator';
import { ExpertRole } from '../types/ads-intelligence';
import { SpecialistContext } from '../types/intelligence';

export interface LLMExecutionRecord {
  id?: string;
  organizationId: string;
  campaignId?: string;
  specialist: ExpertRole;
  promptId: string;
  promptVersion: string;
  provider: string;
  model: string;
  requestStartedAt: string;
  requestCompletedAt: string;
  latencyMs: number;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  status: 'SUCCESS' | 'FAILED' | 'TIMEOUT' | 'INVALID_OUTPUT';
  errorCode?: string;
  outputSchemaVersion: string;
}

export class LLMRuntime {
  constructor(
    private provider: LLMProvider,
    private executionLogger?: (record: LLMExecutionRecord) => Promise<void>
  ) {}

  public static createDefault(): LLMRuntime {
    return new LLMRuntime(new NineRouterLLMProvider());
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
    const promptDef = PromptRegistry.getPrompt(params.specialist, 'v1');
    const routeConfig = ModelRoutingPolicy.getConfig(params.capability);
    const maxRetries = params.maxRetries ?? 2;

    const messages: LLMMessage[] = [
      { role: 'system', content: promptDef.systemPrompt },
      {
        role: 'user',
        content: `[CONTEXTO DE DOMÍNIO - TENANT ISOLADO: ${params.organizationId}]\n${JSON.stringify(params.context, null, 2)}\n\nCITE SOMENTE EVIDENCE_IDS EXISTENTES: [${params.validEvidenceIds.join(', ')}]`
      }
    ];

    let attempt = 0;
    while (attempt <= maxRetries) {
      const startTime = new Date().toISOString();
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

        if (!StructuredOutputValidator.verifyEvidenceBinding(data, params.validEvidenceIds).valid) throw new Error('[INVALID_EVIDENCE_REFERENCE]');
        if (!StructuredOutputValidator.verifyProvenance(data)) throw new Error('[PROVENANCE_VIOLATION]');

        return { output: data, rawResponse };
      } catch (err: any) {
        attempt++;
        if (attempt > maxRetries) throw err;
        await new Promise(res => setTimeout(res, 1000 * attempt));
      }
    }
    throw new Error('Execution failed');
  }
}
