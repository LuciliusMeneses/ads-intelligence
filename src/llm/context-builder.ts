/**
 * ADS INTELLIGENCE — Specialist Context Builder
 * Assembles specialized, tenant-isolated context objects per specialist role.
 */

import { SpecialistContext } from '../types/intelligence';
import { ExpertRole } from '../types/ads-intelligence';

export class SpecialistContextBuilder {
  public static buildForSpecialist(
    organizationId: string,
    specialistRole: ExpertRole,
    fullContext: SpecialistContext
  ): { specialistRole: ExpertRole; organizationId: string; filteredContext: Partial<SpecialistContext>; validEvidenceIds: string[] } {
    const validEvidenceIds: string[] = (fullContext.marketResearch || []).map(r => r.id);

    let filteredContext: Partial<SpecialistContext> = {
      brand: fullContext.brand,
      productOrService: fullContext.productOrService,
      businessObjective: fullContext.businessObjective,
      campaignObjective: fullContext.campaignObjective
    };

    switch (specialistRole) {
      case 'MARKET_INTELLIGENCE':
        filteredContext.marketResearch = fullContext.marketResearch;
        filteredContext.competitorReferences = fullContext.competitorReferences;
        break;
      case 'AUDIENCE_STRATEGIST':
        filteredContext.audiences = fullContext.audiences;
        filteredContext.geography = fullContext.geography;
        filteredContext.performanceMetrics = fullContext.performanceMetrics;
        break;
      case 'MEDIA_STRATEGIST':
        filteredContext.budgetConstraints = fullContext.budgetConstraints;
        filteredContext.geography = fullContext.geography;
        filteredContext.performanceMetrics = fullContext.performanceMetrics;
        break;
      case 'PERFORMANCE_ANALYST':
        filteredContext.performanceMetrics = fullContext.performanceMetrics;
        filteredContext.sampleSize = fullContext.sampleSize;
        filteredContext.historicalCampaigns = fullContext.historicalCampaigns;
        break;
      case 'OFFER_STRATEGIST':
        filteredContext.currentPrice = fullContext.currentPrice;
        filteredContext.margin = fullContext.margin;
        filteredContext.averageTicket = fullContext.averageTicket;
        filteredContext.targetCac = fullContext.targetCac;
        break;
      case 'CREATIVE_STRATEGIST':
        filteredContext.productOrService = fullContext.productOrService;
        filteredContext.landingDestination = fullContext.landingDestination;
        break;
      case 'ORCHESTRATOR':
        filteredContext = { ...fullContext };
        break;
    }

    return {
      specialistRole,
      organizationId,
      filteredContext,
      validEvidenceIds
    };
  }
}
