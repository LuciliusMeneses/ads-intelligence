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
import { ContradictionEngine } from '../engines/contradiction-engine';
import { SpecialistAnalysis } from '../types/intelligence';

export class AdsOrchestrator {
  /**
   * Synthesizes analyst swarm reports into a governed proposal.
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
    expertAnalyses: SpecialistAnalysis[];
  }): CampaignProposal {
    const contradictions = ContradictionEngine.detectContradictions(params.expertAnalyses);
    
    const proposal: CampaignProposal = {
      id: params.id,
      name: params.name,
      advertiserId: params.advertiserId,
      currentState: contradictions.length > 0 ? 'PENDING_RESOLUTION' : 'RECOMMENDED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      marketIntelligence: {
        references: params.references,
        marketSummary: `Analisadas ${params.references.length} referências.`
      },
      offer: params.offer,
      audience: params.audience,
      media: params.media,
      creatives: params.creatives,
      expertReports: params.expertAnalyses.map(a => ({
        expert: a.specialist,
        recommendations: a.recommendations.map(r => r.title),
        evidenceOrRisks: [...a.evidence, ...a.risks]
      })),
      auditLog: [
        {
          timestamp: new Date().toISOString(),
          action: 'CAMPAIGN_SYNTHESIZED',
          actor: 'AdsOrchestrator',
          details: `Swarm de especialistas executado: ${params.expertAnalyses.length} relatórios processados.`
        }
      ]
    };

    return proposal;
  }
}
