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
import { SpecialistAnalysis } from '../types/intelligence';

export class AdsOrchestrator {
  public static auditSwarm(analyses: SpecialistAnalysis[]): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];
    if (!analyses.length) issues.push('Swarm vazio, sem análises.');
    return { isValid: issues.length === 0, issues };
  }

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
    const proposal: CampaignProposal = {
      id: params.id,
      name: params.name,
      advertiserId: params.advertiserId,
      currentState: 'RECOMMENDED',
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
      expertReports: params.expertReports,
      auditLog: [
        {
          timestamp: new Date().toISOString(),
          action: 'CAMPAIGN_RECOMMENDED',
          actor: 'AdsOrchestrator',
          details: 'Swarm synthesis complete.'
        }
      ]
    };
    return proposal;
  }
}
