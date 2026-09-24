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
    const route = ModelRoutingPolicy.getConfig(params.capability);
    const messages = [
      { role: 'system' as const, content: 'Governance enforced.' },
      { role: 'user' as const, content: JSON.stringify(params.context) }
    ];

    const { data, rawResponse } = await this.provider.generateStructured(
      messages,
      json => StructuredOutputValidator.validate(json),
      { ...route }
    );

    return { output: data, rawResponse };
  }
}
