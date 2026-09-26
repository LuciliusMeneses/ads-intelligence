/**
 * ADS INTELLIGENCE — Market Intelligence Specialist
 * Manages research, competitor references, and evidence validation.
 */

import { MarketReference } from '../types/ads-intelligence';
import { EvidenceItem, EvidenceLevel } from '../types/intelligence';

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
   * Categorizes a reference based on confidence and metadata.
   */
  private determineEvidenceLevel(ref: MarketReference): EvidenceLevel {
    if (!ref.foundInfo || ref.foundInfo.trim() === '') return 'UNKNOWN';
    if (ref.confidenceLevel >= 90) return 'FACT';
    if (ref.confidenceLevel >= 70) return 'OBSERVATION';
    return 'ASSUMPTION';
  }

  /**
   * Calculates freshness in days since reference date.
   */
  private calculateFreshness(dateStr: string): number {
    const refDate = new Date(dateStr).getTime();
    const now = new Date().getTime();
    return Math.floor((now - refDate) / (1000 * 60 * 60 * 24));
  }

  /**
   * Returns evidence items structured for the intelligence engine.
   */
  public getStructuredEvidence(): EvidenceItem[] {
    return this.references.map(ref => ({
      id: `ev_${ref.id}`,
      level: this.determineEvidenceLevel(ref),
      statement: ref.foundInfo,
      provenance: {
        source: ref.source,
        urlOrRef: ref.urlOrRef,
        collectedAt: ref.date,
        confidence: ref.confidenceLevel,
        freshnessDays: this.calculateFreshness(ref.date)
      }
    }));
  }

  /**
   * Summarizes competitor pricing and positioning.
   */
  public generateIntelligenceSummary(): {
    totalReferences: number;
    hasMinimumCoverage: boolean;
    averageConfidence: number;
    conclusions: string[];
    evidenceLevels: Record<EvidenceLevel, number>;
  } {
    const total = this.references.length;
    const avgConfidence = total > 0
      ? this.references.reduce((acc, r) => acc + r.confidenceLevel, 0) / total
      : 0;

    const levels: Record<EvidenceLevel, number> = {
      FACT: 0,
      OBSERVATION: 0,
      ASSUMPTION: 0,
      RECOMMENDATION: 0,
      UNKNOWN: 0
    };

    this.references.forEach(r => {
      const lvl = this.determineEvidenceLevel(r);
      levels[lvl]++;
    });

    return {
      totalReferences: total,
      hasMinimumCoverage: this.hasMinimumReferences(),
      averageConfidence: Math.round(avgConfidence),
      conclusions: this.references.map(r => `[${r.source}] ${r.conclusion}`),
      evidenceLevels: levels
    };
  }
}
