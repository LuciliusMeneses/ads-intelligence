/**
 * ADS INTELLIGENCE — LLM Runtime Executor
 * Manages LLM execution, retries, structured output validation, provenance checks,
 * hallucination guards, and token/cost observability persistence.
 */

import { LLMProvider, LLMMessage, LLMResponse } from './provider';
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
  estimatedCost?: number;
  status: 'SUCCESS' | 'FAILED' | 'TIMEOUT' | 'INVALID_OUTPUT';
  errorCode?: string;
  outputSchemaVersion: string;
}

export class LLMRuntime {
  constructor(
    private provider: LLMProvider,
    private executionLogger?: (record: LLMExecutionRecord) => Promise<void>
  ) {}

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
        content: `[CONTEXTO DE DOMÍNIO - TENANT ISOLADO: ${params.organizationId}] [ESPECIALISTA: ${params.specialist}]\n${JSON.stringify(params.context, null, 2)}\n\nCITE SOMENTE EVIDENCE_IDS EXISTENTES: [${params.validEvidenceIds.join(', ')}]`
      }
    ];

    let attempt = 0;
    let lastError: any = null;

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

        const binding = StructuredOutputValidator.verifyEvidenceBinding(data, params.validEvidenceIds);
        if (!binding.valid) {
          throw new Error(`[INVALID_EVIDENCE_REFERENCE] O LLM citou Evidence IDs inexistentes: ${binding.invalidIds.join(', ')}`);
        }

        if (!StructuredOutputValidator.verifyProvenance(data)) {
          throw new Error('[PROVENANCE_VIOLATION] O LLM promoveu AI_INFERENCE para FACT sem evidência direta.');
        }

        await this.logExecution({
          organizationId: params.organizationId,
          campaignId: params.campaignId,
          specialist: params.specialist,
          promptId: promptDef.promptId,
          promptVersion: promptDef.version,
          provider: this.provider.providerName,
          model: rawResponse.modelUsed,
          requestStartedAt: startTime,
          requestCompletedAt: new Date().toISOString(),
          latencyMs: rawResponse.latencyMs,
          inputTokens: rawResponse.inputTokens,
          outputTokens: rawResponse.outputTokens,
          totalTokens: rawResponse.totalTokens,
          status: 'SUCCESS',
          outputSchemaVersion: promptDef.outputSchemaVersion
        });

        return { output: data, rawResponse };

      } catch (err: any) {
        attempt++;
        lastError = err;
        const isTransient = err.message.includes('Timeout') || err.message.includes('429') || err.message.includes('500');

        if (!isTransient || attempt > maxRetries) {
          await this.logExecution({
            organizationId: params.organizationId,
            campaignId: params.campaignId,
            specialist: params.specialist,
            promptId: promptDef.promptId,
            promptVersion: promptDef.version,
            provider: this.provider.providerName,
            model: routeConfig.preferredModel,
            requestStartedAt: startTime,
            requestCompletedAt: new Date().toISOString(),
            latencyMs: 0,
            status: err.message.includes('Timeout') ? 'TIMEOUT' : 'FAILED',
            errorCode: err.message,
            outputSchemaVersion: promptDef.outputSchemaVersion
          });
          throw err;
        }

        await new Promise(res => setTimeout(res, 500 * Math.pow(2, attempt)));
      }
    }

    throw lastError;
  }

  private async logExecution(record: LLMExecutionRecord): Promise<void> {
    if (this.executionLogger) {
      try {
        await this.executionLogger(record);
      } catch {}
    }
  }
}
