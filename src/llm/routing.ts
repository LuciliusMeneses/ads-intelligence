/**
 * ADS INTELLIGENCE — Model Routing Policy
 * Selects validated models based on capabilities.
 */

export type SpecialistCapability = 'FAST_ANALYSIS' | 'DEEP_REASONING' | 'AUTO';

export interface ModelCapabilityConfig {
  preferredModel: string;
  temperature: number;
  maxTokens: number;
  timeoutMs: number;
}

export class ModelRoutingPolicy {
  private static map: Record<SpecialistCapability, ModelCapabilityConfig> = {
    FAST_ANALYSIS: { preferredModel: 'gpt-4o-mini', temperature: 0.1, maxTokens: 1000, timeoutMs: 15000 },
    DEEP_REASONING: { preferredModel: 'gpt-4o', temperature: 0.2, maxTokens: 2500, timeoutMs: 30000 },
    AUTO: { preferredModel: 'gpt-4o', temperature: 0.2, maxTokens: 2000, timeoutMs: 30000 }
  };

  public static getConfig(capability: SpecialistCapability): ModelCapabilityConfig {
    return this.map[capability] || this.map.AUTO;
  }
}
