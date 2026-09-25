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
   * Calculates price gap between current price and market average based on references.
   */
  public calculatePriceGap(currentPrice: number): string {
    if (this.references.length === 0) return 'Dados insuficientes para análise de gap de preço.';
    
    // Extract prices from foundInfo strings (simplistic extraction for intelligence execution)
    const prices = this.references
      .map(r => r.foundInfo.match(/R\$?\s?(\d+[.,]\d+)/))
      .filter(Boolean)
      .map(m => parseFloat(m![1].replace(',', '.')));

    if (prices.length === 0) return 'Nenhum preço concorrente numérico detetado nas referências.';

    const avgMarket = prices.reduce((a, b) => a + b, 0) / prices.length;
    const diff = ((currentPrice - avgMarket) / avgMarket) * 100;

    if (diff > 15) return `PREÇO_ALTO: O preço atual está ${diff.toFixed(1)}% acima da média de mercado (R$ ${avgMarket.toFixed(2)}).`;
    if (diff < -15) return `PREÇO_BAIXO: O preço atual está ${Math.abs(diff).toFixed(1)}% abaixo da média de mercado (R$ ${avgMarket.toFixed(2)}).`;
    
    return `PREÇO_COMPETITIVO: Alinhado com a média de mercado (R$ ${avgMarket.toFixed(2)}).`;
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
      conclusions: this.references.map(r => `[${r.source}] ${r.conclusion}`)
    };
  }
}
