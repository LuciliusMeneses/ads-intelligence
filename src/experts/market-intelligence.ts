/**
 * ADS INTELLIGENCE — Market Intelligence Specialist
 * Manages research, competitor references, and evidence validation.
 */

import { MarketReference } from '../types/ads-intelligence';

export class MarketIntelligenceSpecialist {
  private references: MarketReference[] = [];

  /**
   * Adds an external market reference with strict validation.
   * Regra Crítica: Nunca apresentar pesquisa simulada como pesquisa real.
   */
  public addReference(ref: Omit<MarketReference, 'id'>): MarketReference {
    if (ref.isSimulated) {
      throw new Error('[MarketIntelligence] Pesquisa simulada não pode ser apresentada como pesquisa real.');
    }

    if (!ref.source || !ref.urlOrRef || !ref.foundInfo) {
      throw new Error('[MarketIntelligence] Campos obrigatórios ausentes na referência de mercado.');
    }

    const newRef: MarketReference = {
      ...ref,
      id: `mref_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
    };

    this.references.push(newRef);
    return newRef;
  }

  /**
   * Returns all stored references.
   * Verifica se há o suporte mínimo de 5 referências recentes para embasamento seguro.
   */
  public getReferences(): MarketReference[] {
    return [...this.references];
  }

  public hasMinimumReferences(): boolean {
    return this.references.length >= 5;
  }

  /**
   * Validates if the references are recent enough (e.g., last 180 days).
   */
  public validateRecency(maxDays: number = 180): boolean {
    const now = new Date().getTime();
    const limit = maxDays * 24 * 60 * 60 * 1000;
    
    return this.references.every(ref => {
      const refDate = new Date(ref.date).getTime();
      return (now - refDate) <= limit;
    });
  }

  /**
   * Summarizes competitor pricing and positioning.
   */
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
      conclusions: this.references.map(r => `[${r.source}] ${r.foundInfo} (${r.conclusion})`)
    };
  }
}
