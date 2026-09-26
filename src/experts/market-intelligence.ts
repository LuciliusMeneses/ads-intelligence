/**
 * ADS INTELLIGENCE — Market Intelligence Specialist
 * Manages research, competitor references, and evidence validation.
 */

import { MarketReference } from '../types/ads-intelligence';
import { EvidenceCategory, EvidenceMetadata } from '../types/intelligence';

export interface MarketIntelligenceItem {
  id: string;
  category: EvidenceCategory;
  statement: string;
  source: string;
  urlOrRef: string;
  confidence: number;
  freshness: string;
  isVerified: boolean;
  isSimulated: false;
}

export class MarketIntelligenceSpecialist {
  private references: MarketReference[] = [];
  private intelligenceItems: MarketIntelligenceItem[] = [];

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

    // Also register as structured evidence-aware item
    this.intelligenceItems.push({
      id: newRef.id,
      category: newRef.confidenceLevel >= 80 ? 'FACT' : newRef.confidenceLevel >= 50 ? 'OBSERVATION' : 'ASSUMPTION',
      statement: newRef.conclusion,
      source: newRef.source,
      urlOrRef: newRef.urlOrRef,
      confidence: newRef.confidenceLevel,
      freshness: newRef.date,
      isVerified: newRef.confidenceLevel >= 70,
      isSimulated: false
    });

    return newRef;
  }

  /**
   * Adds an evidence-aware item explicitly distinguishing FACT, OBSERVATION, ASSUMPTION, RECOMMENDATION, UNKNOWN.
   */
  public addIntelligenceItem(item: Omit<MarketIntelligenceItem, 'id' | 'isSimulated'>): MarketIntelligenceItem {
    if (!item.source || !item.urlOrRef || !item.statement) {
      throw new Error('[MarketIntelligence] Informação de mercado sem proveniência (source ou urlOrRef) suficiente.');
    }

    const newItem: MarketIntelligenceItem = {
      ...item,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      isSimulated: false
    };

    this.intelligenceItems.push(newItem);
    return newItem;
  }

  /**
   * Returns all stored references.
   */
  public getReferences(): MarketReference[] {
    return [...this.references];
  }

  public getIntelligenceItems(): MarketIntelligenceItem[] {
    return [...this.intelligenceItems];
  }

  public hasMinimumReferences(): boolean {
    return this.references.length >= 5 || this.intelligenceItems.length >= 5;
  }

  /**
   * Summarizes competitor pricing and positioning.
   */
  public generateIntelligenceSummary(): {
    totalReferences: number;
    totalIntelligenceItems: number;
    hasMinimumCoverage: boolean;
    averageConfidence: number;
    conclusions: string[];
    unknownCount: number;
  } {
    const totalRef = this.references.length;
    const totalItems = this.intelligenceItems.length;
    const combined = [...this.intelligenceItems, ...this.references.map(r => ({
      category: r.confidenceLevel >= 80 ? ('FACT' as EvidenceCategory) : ('OBSERVATION' as EvidenceCategory),
      confidence: r.confidenceLevel,
      conclusion: r.conclusion,
      source: r.source
    }))];

    const total = combined.length;
    const avgConfidence = total > 0
      ? combined.reduce((acc, r) => acc + ('confidenceLevel' in r ? r.confidenceLevel : r.confidence), 0) / total
      : 0;

    const unknownCount = combined.filter(i => 'category' in i && i.category === 'UNKNOWN').length;

    return {
      totalReferences: totalRef,
      totalIntelligenceItems: totalItems,
      hasMinimumCoverage: this.hasMinimumReferences(),
      averageConfidence: Math.round(avgConfidence),
      conclusions: combined.map(r => 'conclusion' in r ? `[${r.source}] ${r.conclusion}` : `[${r.source} (${r.category})] ${r.statement}`),
      unknownCount
    };
  }
}
