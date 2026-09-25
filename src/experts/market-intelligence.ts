/**
 * ADS INTELLIGENCE — Market Intelligence Specialist
 * Manages research, competitor references, and evidence validation.
 */

import { MarketReference } from '../types/ads-intelligence';
import { LLMRuntime } from '../llm/runtime';

export class MarketIntelligenceSpecialist {
  private references: MarketReference[] = [];
  private llmRuntime?: LLMRuntime;

  constructor(llmRuntime?: LLMRuntime) {
    this.llmRuntime = llmRuntime;
  }

  public addReference(ref: Omit<MarketReference, 'id'>): MarketReference {
    if (ref.isSimulated) {
      throw new Error('[MarketIntelligence] Pesquisa simulada não pode ser apresentada como pesquisa real.');
    }

    if (!ref.source || !ref.urlOrRef || !ref.foundInfo) {
      throw new Error('[MarketIntelligence] Campos obrigatórios ausentes.');
    }

    const newRef: MarketReference = {
      ...ref,
      id: `mref_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
    };

    this.references.push(newRef);
    return newRef;
  }

  public getReferences(): MarketReference[] {
    return [...this.references];
  }

  public hasMinimumReferences(): boolean {
    return this.references.length >= 5;
  }

  public generateIntelligenceSummary(): {
    totalReferences: number;
    hasMinimumCoverage: boolean;
    averageConfidence: number;
    conclusions: string[];
  } {
    const total = this.references.length;
    const avgConfidence = total > 0
      ? this.references.reduce((acc, r) => acc + r.confidenceLevel, 0) / total
      : 0;

    return {
      totalReferences: total,
      hasMinimumCoverage: this.hasMinimumReferences(),
      averageConfidence: Math.round(avgConfidence),
      conclusions: this.references.map(r => `[${r.source}] ${r.conclusion}`)
    };
  }
}
