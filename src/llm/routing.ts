/**
 * ADS INTELLIGENCE — Model Routing Policy
 * Translates specialist capabilities into model selection and parameter configurations.
 */

export type SpecialistCapability =
  | 'FAST_ANALYSIS'
  | 'DEEP_REASONING'
  | 'MARKET_REASONING'
  | 'AUDIT_REASONING'
  | 'COPYWRITING'
  | 'AUTO';

export interface ModelCapabilityConfig {
  capability: SpecialistCapability;
  preferredModel: string;
  temperature: number;
  maxTokens: number;
  timeoutMs: number;
}

export class ModelRoutingPolicy {
  private static capabilityMap: Record<SpecialistCapability, ModelCapabilityConfig> = {
    FAST_ANALYSIS: {
      capability: 'FAST_ANALYSIS',
      preferredModel: process.env.NINEROUTER_DEFAULT_MODEL || 'gpt-4o-mini',
      temperature: 0.1,
      maxTokens: 1000,
      timeoutMs: 15000
    },
    DEEP_REASONING: {
      capability: 'DEEP_REASONING',
      preferredModel: process.env.NINEROUTER_DEFAULT_MODEL || 'gpt-4o',
      temperature: 0.2,
      maxTokens: 2500,
      timeoutMs: 30000
    },
    MARKET_REASONING: {
      capability: 'MARKET_REASONING',
      preferredModel: process.env.NINEROUTER_DEFAULT_MODEL || 'claude-3-5-sonnet',
      temperature: 0.2,
      maxTokens: 2500,
      timeoutMs: 30000
    },
    AUDIT_REASONING: {
      capability: 'AUDIT_REASONING',
      preferredModel: process.env.NINEROUTER_DEFAULT_MODEL || 'gpt-4o',
      temperature: 0.0,
      maxTokens: 2000,
      timeoutMs: 25000
    },
    COPYWRITING: {
      capability: 'COPYWRITING',
      preferredModel: process.env.NINEROUTER_DEFAULT_MODEL || 'gpt-4o',
      temperature: 0.7,
      maxTokens: 1500,
      timeoutMs: 20000
    },
    AUTO: {
      capability: 'AUTO',
      preferredModel: process.env.NINEROUTER_DEFAULT_MODEL || 'gpt-4o',
      temperature: 0.2,
      maxTokens: 2000,
      timeoutMs: 30000
    }
  };

  public static getConfig(capability: SpecialistCapability): ModelCapabilityConfig {
    return this.capabilityMap[capability] || this.capabilityMap.AUTO;
  }
}
