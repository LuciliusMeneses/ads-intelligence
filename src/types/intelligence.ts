/**
 * ADS INTELLIGENCE — Intelligence & Recommendation Engine Types
 */

import { ExpertRole, MarketReference, OfferPricing, AudienceSpecification, MediaSpecification, CreativeRecommendation } from './ads-intelligence';

export type FactClassification = 'FACT' | 'CALCULATION' | 'EXTERNAL_EVIDENCE' | 'AI_INFERENCE' | 'AI_RECOMMENDATION';

export interface SpecialistContext {
  organization?: string;
  brand?: string;
  productOrService?: string;
  businessObjective?: string;
  campaignObjective?: string;
  currentPrice?: number;
  margin?: number;
  averageTicket?: number;
  targetCac?: number;
  sampleSize?: number;
  historicalCampaigns?: any[];
  performanceMetrics?: {
    ctr?: number;
    cpm?: number;
    cpc?: number;
    cpa?: number;
    roas?: number;
    spend?: number;
    revenue?: number;
    cvr?: number;
  };
  audiences?: string[];
  marketResearch?: MarketReference[];
  competitorReferences?: MarketReference[];
  landingDestination?: string;
  geography?: string[];
  budgetConstraints?: { dailyMax?: number; totalBudget?: number };
}

export interface SpecialistAnalysis {
  specialist: ExpertRole;
  observations: string[];
  evidence: string[];
  recommendations: { title: string; description: string; classification: FactClassification }[];
  confidence: number;
  createdAt: string;
}
