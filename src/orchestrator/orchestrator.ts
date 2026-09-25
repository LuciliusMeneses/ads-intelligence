/**
 * ADS INTELLIGENCE — Ads Orchestrator
 * Coordinator agent responsible for multi-expert swarm synthesis, contradiction detection,
 * evidence enforcement, and final campaign proposal production.
 */

import {
  CampaignProposal,
  ExpertAnalysisReport,
  MarketReference,
  OfferPricing,
  AudienceSpecification,
  MediaSpecification,
  CreativeRecommendation
} from '../types/ads-intelligence';

export class AdsOrchestrator {
  /**
   * Evaluates expert reports for contradictions and missing evidence.
   */
  public static auditExpertReports(reports: ExpertAnalysisReport[]): {
    hasContradictions: boolean;
    contradictionNotes: string[];
    missingEvidence: boolean;
    evidenceNotes: string[];
  } {
    const contradictionNotes: string[] = [];
    const evidenceNotes: string[] = [];

    // Check if market intelligence has evidence
    const marketReport = reports.find(r => r.expert === 'MARKET_INTELLIGENCE');
    if (!marketReport || marketReport.evidenceOrRisks.length === 0) {
      evidenceNotes.push('Market Intelligence carece de evidências ou referências verificáveis.');
    }

    // Check for contradictions between Offer Strategist and Performance Analyst
    const offerReport = reports.find(r => r.expert === 'OFFER_STRATEGIST');
    const perfReport = reports.find(r => r.expert === 'PERFORMANCE_ANALYST');

    if (offerReport && perfReport) {
      if (offerReport.recommendations.some(r => r.includes('aumentar preço')) &&
          perfReport.recommendations.some(r => r.includes('queda de conversão'))) {
        contradictionNotes.push('Contradição: Offer Strategist sugere aumento de preço enquanto Performance Analyst aponta queda de conversão.');
      }
    }

    // Check for contradictions between Market Intelligence and Offer Strategist
    if (marketReport && offerReport) {
      const priceAlert = marketReport.evidenceOrRisks.some(e => e.includes('PREÇO_ALTO'));
      const priceIncrease = offerReport.recommendations.some(r => r.includes('aumento') || r.includes('elevar'));
      
      if (priceAlert && priceIncrease) {
        contradictionNotes.push('Contradição: Market Intelligence indica preço alto, mas Offer Strategist sugere novo aumento.');
      }
    }

    return {
      hasContradictions: contradictionNotes.length > 0,
      contradictionNotes,
      missingEvidence: evidenceNotes.length > 0,
      evidenceNotes
    };
  }

  /**
   * Consolidates all expert analyses into a rigorous campaign proposal.
   */
  public static createCampaignProposal(params: {
    id: string;
    name: string;
    advertiserId: string;
    references: MarketReference[];
    offer: OfferPricing;
    audience: AudienceSpecification;
    media: MediaSpecification;
    creatives: CreativeRecommendation[];
    expertReports: ExpertAnalysisReport[];
  }): CampaignProposal {
    // Run orchestrator audit
    const audit = this.auditExpertReports(params.expertReports);

    if (audit.hasContradictions) {
      console.warn('[AdsOrchestrator] Alerta de Contradição detectada entre especialistas:', audit.contradictionNotes);
    }

    const proposal: CampaignProposal = {
      id: params.id,
      name: params.name,
      advertiserId: params.advertiserId,
      currentState: 'RECOMMENDED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      marketIntelligence: {
        references: params.references,
        marketSummary: `Analisadas ${params.references.length} referências recentes de mercado.`
      },
      offer: params.offer,
      audience: params.audience,
      media: params.media,
      creatives: params.creatives,
      expertReports: params.expertReports,
      auditLog: [
        {
          timestamp: new Date().toISOString(),
          action: 'CAMPAIGN_RECOMMENDED',
          actor: 'AdsOrchestrator',
          details: `Proposta gerada com ${params.expertReports.length} relatórios de especialistas.${audit.hasContradictions ? ' Contradições detetadas.' : ''}`
        }
      ]
    };

    return proposal;
  }
}
