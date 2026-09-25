/**
 * ADS INTELLIGENCE — Intelligence & Recommendation Engine Types
 * Sprint 05 Specialist Intelligence Execution support.
 */

import { ExpertRole, CampaignState, MarketReference, OfferPricing, AudienceSpecification, MediaSpecification, CreativeRecommendation } from './ads-intelligence';
export { ExpertRole, CampaignState, MarketReference, OfferPricing, AudienceSpecification, MediaSpecification, CreativeRecommendation };

export type FactClassification = 'FACT' | 'CALCULATION' | 'EXTERNAL_EVIDENCE' | 'AI_INFERENCE' | 'AI_RECOMMENDATION';

export type HypothesisStatus = 'PROPOSED' | 'SUPPORTED' | 'CONTRADICTED' | 'INSUFFICIENT_DATA' | 'VALIDATED' | 'REJECTED';

export interface Hypothesis {
  id: string;
  statement: string;
  specialist: ExpertRole;
  supportingEvidence: string[];
  contradictingEvidence: string[];
  confidence: number;
  status: HypothesisStatus;
}

export type RecommendationType = 'BUDGET' | 'AUDIENCE' | 'OFFER' | 'PRICE' | 'CREATIVE_DIRECTION' | 'CAMPAIGN_STRUCTURE' | 'PLACEMENT' | 'LANDING_PAGE' | 'TEST' | 'PAUSE' | 'SCALE' | 'MONITOR';

export type RecommendationStatus = 'PROPOSED' | 'ACCEPTED' | 'REJECTED' | 'MODIFIED' | 'SUPERSEDED';

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  specialist: ExpertRole;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  evidence: string[];
  hypothesisIds: string[];
  confidence: number;
  expectedImpact: string;
  risk: string;
  status: RecommendationStatus;
  createdAt: string;
  classification: FactClassification;
}

export type ConfidenceBand = 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH' | 'INSUFFICIENT_DATA';

export type ConfidenceComponentKey = 'DATA_COMPLETENESS' | 'SOURCE_QUALITY' | 'RECENCY' | 'SAMPLE_RELIABILITY' | 'HISTORICAL_CONSISTENCY' | 'CROSS_SPECIALIST_AGREEMENT' | 'SUPPORTING_EVIDENCE' | 'CONTRADICTING_EVIDENCE';

export interface ConfidenceComponent {
  component: ConfidenceComponentKey;
  score: number;
  weight: number;
  reason: string;
  isUnknown?: boolean;
}

export interface ConfidenceResult {
  confidenceScore: number;
  confidenceBand: ConfidenceBand;
  confidenceReasons: string[];
  components: ConfidenceComponent[];
  explanation: string;
}

export type DataQualityGrade = 'EXCELLENT' | 'GOOD' | 'LIMITED' | 'POOR' | 'INSUFFICIENT';

export interface DataQualityAssessment {
  grade: DataQualityGrade;
  availableData: string[];
  missingData: string[];
  potentiallyOutdatedData: string[];
  conflictingSources: string[];
}

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
  performanceMetrics?: { ctr?: number; cpm?: number; cpc?: number; cpa?: number; roas?: number; spend?: number; revenue?: number; cvr?: number; };
  audiences?: string[];
  marketResearch?: MarketReference[];
  competitorReferences?: MarketReference[];
  previousExperiments?: any[];
  previousLearnings?: string[];
  landingDestination?: string;
  geography?: string[];
  budgetConstraints?: { dailyMax?: number; totalBudget?: number; };
}

export interface SpecialistAnalysis {
  specialist: ExpertRole;
  observations: string[];
  evidence: string[];
  hypotheses: Hypothesis[];
  recommendations: Recommendation[];
  risks: string[];
  contradictions: string[];
  confidence: ConfidenceResult;
  dataQuality: DataQualityAssessment;
  missingData: string[];
  createdAt: string;
}

export type ContradictionResolution = 'RESOLVE' | 'REQUEST_MORE_DATA' | 'ESCALATE_TO_HUMAN';

export interface ContradictionRecord {
  id: string;
  specialistsInvolved: ExpertRole[];
  positions: { specialist: ExpertRole; stance: string }[];
  evidenceOfEachSide: { specialist: ExpertRole; evidence: string[] }[];
  impact: string;
  resolution: ContradictionResolution;
  resolutionDetails: string;
  confidence: number;
}

export type HumanDecision = 'ACCEPT' | 'REJECT' | 'MODIFY';

export interface HumanOverrideRecord {
  recommendationId: string;
  originalRecommendation: Recommendation;
  humanDecision: HumanDecision;
  modifiedValue?: any;
  reason?: string;
  timestamp: string;
}

export type AuditStatus = 'PASS' | 'PASS_WITH_WARNINGS' | 'BLOCKED';

export interface CampaignAuditResult {
  status: AuditStatus;
  blockers: string[];
  warnings: string[];
  observations: string[];
}

export interface ComprehensiveCampaignProposal {
  id: string;
  name: string;
  platform?: string;
  objective?: string;
  budget?: { daily: number; total: number; currency: string };
  durationDays?: number;
  audience?: AudienceSpecification;
  geography?: string[];
  offer?: OfferPricing;
  cta?: string;
  destination?: string;
  primaryKpi?: string;
  secondaryKpis?: string[];
  targetCpaOrCpl?: number;
  breakEven?: number;
  creativeDirection?: CreativeRecommendation;
  copy?: { primaryText: string; headline: string; description: string; cta: string; humanDecision: HumanDecision; };
  testPlan?: string;
  evidence: string[];
  risks: string[];
  confidence: ConfidenceResult;
  missingData: string[];
  auditResult: CampaignAuditResult;
  createdAt: string;
  expertReports?: any[];
}
