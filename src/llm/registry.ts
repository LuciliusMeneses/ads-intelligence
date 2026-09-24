/**
 * ADS INTELLIGENCE — Prompt Registry
 */
import { ExpertRole } from '../types/ads-intelligence';

export interface PromptDefinition {
  promptId: string;
  specialist: ExpertRole;
  version: string;
  systemPrompt: string;
  outputSchemaVersion: string;
  status: 'ACTIVE' | 'DEPRECATED' | 'DRAFT';
}

export class PromptRegistry {
  private static baseSystemRules = `[REGRAS DE GOVERNANÇA ABSOLUTA]`;
  private static prompts: Record<string, PromptDefinition> = {
    'market-intelligence:v1': {
      promptId: 'market-intelligence',
      specialist: 'MARKET_INTELLIGENCE',
      version: 'v1',
      systemPrompt: `Você é o especialista Market Intelligence.`,
      outputSchemaVersion: 'v1',
      status: 'ACTIVE'
    }
  };

  public static getPrompt(specialist: ExpertRole, version: string = 'v1'): PromptDefinition {
    const key = `${specialist.toLowerCase().replace('_', '-')}:${version}`;
    return this.prompts[key] || {
      promptId: 'default',
      specialist,
      version: 'v1',
      systemPrompt: this.baseSystemRules,
      outputSchemaVersion: 'v1',
      status: 'ACTIVE'
    };
  }
}
