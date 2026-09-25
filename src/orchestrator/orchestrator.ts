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
import { ApprovalGate } from '../state-machine/approval-gate';

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

    const marketReport = reports.find(r => r.expert === 'MARKET_INTELLIGENCE');
    if (!marketReport || marketReport.evidenceOrRisks.length === 0) {
      evidenceNotes.push('Market Intelligence carece de evidências ou referências verificáveis.');
    }

    const offerReport = reports.find(r => r.expert === 'OFFER_STRATEGIST');
    const perfReport = reports.find(r => r.expert === 'PERFORMANCE_ANALYST');

    if (offerReport && perfReport) {
      if (offerReport.recommendations.some(r => r.includes('aumentar preço')) &&
          perfReport.recommendations.some(r => r.includes('queda de conversão'))) {
        contradictionNotes.push('Contradiction detected: Offer Strategist sugere aumento de preço enquanto Performance Analyst aponta queda de conversão.');
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
    const audit = this.auditExpertReports(params.expertReports);

    if (audit.hasContradictions) {
      console.warn('[AdsOrchestrator] Alerta de Contradição detectada entre especialistas:', audit.contradictionNotes);
    }

    const proposal: CampaignProposal = {
      id: params.id,
      name: params.name,
      advertiserId: params.advertiserId,
      currentState: 'READY_FOR_REVIEW',
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
          details: `Proposta gerada com ${params.expertReports.length} relatórios de especialistas. Gate de aprovação humana ativado.`
        }
      ]
    };

    return proposal;
  }
}