/**
 * ADS INTELLIGENCE — Core Domain Types
 * Senior Software Architect & AI Performance Engineer
 */

import { CurrencyCode } from './currency';

export type CampaignState =
  | 'DRAFT'
  | 'ANALYZING'
  | 'RECOMMENDED'
  | 'WAITING_CREATIVE'
  | 'READY_FOR_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'PUBLISHED'
  | 'PAUSED'
  | 'COMPLETED';

export type ExpertRole =
  | 'ORCHESTRATOR'
  | 'MARKET_INTELLIGENCE'
  | 'AUDIENCE_STRATEGIST'
  | 'MEDIA_STRATEGIST'
  | 'PERFORMANCE_ANALYST'
  | 'OFFER_STRATEGIST'
  | 'CREATIVE_STRATEGIST';

export interface MarketReference {
  id: string;
  source: string;
  date: string;
  urlOrRef: string;
  foundInfo: string;
  relevance: 'HIGH' | 'MEDIUM' | 'LOW';
  conclusion: string;
  confidenceLevel: number; // 0 to 100
  isSimulated: false; // Never true for real data
}

export interface OfferPricing {
  currentPrice: number;
  marketPrice: number;
  aiSuggestedPrice: number;
  currency: CurrencyCode;
  originAndJustification: string;
  averageTicket: number;
  targetMarginPercent: number;
  maxAllowableCac: number;
  breakEvenPoint: number;
}

export interface AudienceSpecification {
  locations: string[];
  ageRange: { min: number; max: number };
  genders: ('ALL' | 'MALE' | 'FEMALE')[];
  interestsOrBehaviors: string[];
  isBroad: boolean;
  isRemarketing: boolean;
  isLookalike: boolean;
  exclusions: string[];
  funnelStage: 'TOP' | 'MIDDLE' | 'BOTTOM';
  hypothesisJustification: string;
}

export interface MediaSpecification {
  platform: 'META_ADS' | 'GOOGLE_ADS' | 'MULTI_CHANNEL';
  objective: 'CONVERSIONS' | 'LEADS' | 'TRAFFIC' | 'SALES' | 'AWARENESS';
  campaignStructure: string;
  budgetDistribution: {
    acquisitionPercent: number;
    remarketingPercent: number;
    testingPercent: number;
  };
  dailyBudget: number;
  currency: CurrencyCode;
  durationDays: number;
  placements: string[];
  testModel: string;
}

export interface CreativeRecommendation {
  id: string;
  format: 'VIDEO_9_16' | 'IMAGE_SQUARE_1_1' | 'CAROUSEL' | 'STORY' | 'REELS';
  durationSeconds?: number;
  aspectRatio: string;
  concept: string;
  hook: string;
  approach: string;
  coreMessage: string;
  narrativeStructure: string;
  callToAction: string;
  testVariationsCount: number;
  note: string; // Explicit reminder: NO automated generation
}

export interface PerformanceMetrics {
  ctr: number; // %
  cpm: number;
  cpc: number;
  cpa: number;
  cpl?: number;
  cvr: number; // %
  roas: number;
  frequency: number;
  spend: number;
  revenue: number;
  leads?: number;
  conversions: number;
  period: string;
  anomaliesDetected: string[];
  trendsObservation: string;
}

export interface ExpertAnalysisReport {
  expert: ExpertRole;
  timestamp: string;
  summary: string;
  recommendations: string[];
  evidenceOrRisks: string[];
  confidence: number;
}

export interface CampaignProposal {
  id: string;
  name: string;
  advertiserId: string;
  currentState: CampaignState;
  createdAt: string;
  updatedAt: string;
  marketIntelligence: {
    references: MarketReference[];
    marketSummary: string;
  };
  offer: OfferPricing;
  audience: AudienceSpecification;
  media: MediaSpecification;
  creatives: CreativeRecommendation[];
  performance?: PerformanceMetrics;
  expertReports: ExpertAnalysisReport[];
  auditLog: {
    timestamp: string;
    action: string;
    actor: string;
    details: string;
  }[];
}
