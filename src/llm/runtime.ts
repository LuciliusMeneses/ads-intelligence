/**
 * ADS INTELLIGENCE — LLM Runtime
 * NineRouter is default. Fake is strictly for explicit testing.
 */

import { LLMProvider, NineRouterLLMProvider } from './provider';
import { ModelRoutingPolicy, SpecialistCapability } from './routing';
import { StructuredOutputValidator, SpecialistLLMOutput } from './validator';
import { ExpertRole } from '../types/ads-intelligence';
import { SpecialistContext } from '../types/intelligence';

export class LLMRuntime {
  constructor(private provider: LLMProvider = new NineRouterLLMProvider()) {}

  public async executeSpecialist(params: {
    organizationId: string;
    specialist: ExpertRole;
    capability: SpecialistCapability;
    context: Partial<SpecialistContext>;
    validEvidenceIds: string[];
  }): Promise<{ output: SpecialistLLMOutput; rawResponse: any }> {
    const health = await this.provider.healthCheck();
    if (!health) throw new Error('[LLMRuntime] Provider health check failed');

    const route = ModelRoutingPolicy.getConfig(params.capability);
    const models = await this.provider.listModels();
    if (!models.includes(route.preferredModel)) throw new Error('[LLMRuntime] Selected model not in registry');

    const messages = [
      { role: 'system' as const, content: 'Governance enforced.' },
      { role: 'user' as const, content: JSON.stringify(params.context) }
    ];

    const { data, rawResponse } = await this.provider.generateStructured(
      messages,
      json => StructuredOutputValidator.validate(json),
      { ...route, model: route.preferredModel }
    );

    return { output: data, rawResponse };
  }
}