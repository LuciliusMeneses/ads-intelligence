/**
 * ADS INTELLIGENCE — Repository Interfaces
 * Abstraction layer separating Domain & Application engines from Infrastructure / Database.
 */

import { CampaignState } from '../types/ads-intelligence';
import { Recommendation, AuditStatus, HumanDecision } from '../types/intelligence';

export interface OrganizationEntity {
  id: string;
  name: string;
  slug: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface BrandEntity {
  id: string;
  organizationId: string;
  name: string;
  website?: string;
  industry?: string;
  country: string;
  currency: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductServiceEntity {
  id: string;
  organizationId: string;
  brandId: string;
  type: 'PRODUCT' | 'SERVICE';
  name: string;
  description?: string;
  currentPrice?: number;
  currency: string;
  cost?: number;
  margin?: number;
  averageTicket?: number;
  targetCac?: number;
  landingUrl?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface CampaignEntity {
  id: string;
  organizationId: string;
  brandId: string;
  adAccountId?: string;
  productServiceId?: string;
  name: string;
  platform: string;
  objective: string;
  status: string;
  approvalState: CampaignState;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignProposalEntity {
  id: string;
  organizationId: string;
  campaignId: string;
  version: number;
  proposalData: any;
  confidenceScore: number;
  confidenceBand: string;
  auditStatus: AuditStatus;
  createdBy?: string;
  createdAt: string;
}

export interface EvidenceEntity {
  id: string;
  organizationId: string;
  campaignId: string;
  recommendationId?: string;
  hypothesisId?: string;
  sourceType: string;
  sourceReference: string;
  observedAt?: string;
  evidence: string;
  weight: number;
  confidence: number;
  metadata?: any;
  createdAt: string;
}

export interface HumanDecisionEntity {
  id: string;
  organizationId: string;
  recommendationId: string;
  userId: string;
  decision: HumanDecision;
  originalRecommendation: any;
  modifiedValue?: any;
  reason?: string;
  createdAt: string;
}

export interface CampaignAuditEntity {
  id: string;
  organizationId: string;
  campaignId: string;
  proposalId?: string;
  status: AuditStatus;
  blockers: string[];
  warnings: string[];
  observations: string[];
  createdAt: string;
}

export interface LearningRecordEntity {
  id: string;
  organizationId: string;
  brandId: string;
  campaignId?: string;
  hypothesisId?: string;
  recommendationId?: string;
  humanDecisionId?: string;
  summary: string;
  outcome: string;
  metricsBefore?: any;
  metricsAfter?: any;
  lesson: string;
  confidence: number;
  createdAt: string;
}

export interface AuditLogEntity {
  id: string;
  organizationId: string;
  userId?: string;
  entityType: string;
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'APPROVAL' | 'REJECTION' | 'MODIFICATION' | 'STATUS_CHANGE';
  beforeData?: any;
  afterData?: any;
  createdAt: string;
}

// Repository Contracts
export interface OrganizationRepository {
  create(org: Omit<OrganizationEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrganizationEntity>;
  findById(id: string): Promise<OrganizationEntity | null>;
  findBySlug(slug: string): Promise<OrganizationEntity | null>;
  update(id: string, updates: Partial<OrganizationEntity>): Promise<OrganizationEntity>;
}

export interface BrandRepository {
  create(brand: Omit<BrandEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<BrandEntity>;
  findById(organizationId: string, id: string): Promise<BrandEntity | null>;
  listByOrganization(organizationId: string): Promise<BrandEntity[]>;
}

export interface ProductServiceRepository {
  create(product: Omit<ProductServiceEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductServiceEntity>;
  findById(organizationId: string, id: string): Promise<ProductServiceEntity | null>;
  listByBrand(organizationId: string, brandId: string): Promise<ProductServiceEntity[]>;
}

export interface CampaignRepository {
  create(campaign: Omit<CampaignEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<CampaignEntity>;
  findById(organizationId: string, id: string): Promise<CampaignEntity | null>;
  listByBrand(organizationId: string, brandId: string): Promise<CampaignEntity[]>;
  updateApprovalState(organizationId: string, id: string, newState: CampaignState): Promise<CampaignEntity>;
}

export interface CampaignProposalRepository {
  create(proposal: Omit<CampaignProposalEntity, 'id' | 'createdAt'>): Promise<CampaignProposalEntity>;
  findById(organizationId: string, id: string): Promise<CampaignProposalEntity | null>;
  getLatestVersion(organizationId: string, campaignId: string): Promise<CampaignProposalEntity | null>;
  listVersions(organizationId: string, campaignId: string): Promise<CampaignProposalEntity[]>;
}

export interface RecommendationRepository {
  create(rec: Omit<Recommendation, 'id' | 'createdAt'> & { organizationId: string; campaignId: string; proposalId?: string }): Promise<Recommendation>;
  listByCampaign(organizationId: string, campaignId: string): Promise<Recommendation[]>;
  updateStatus(organizationId: string, id: string, status: any): Promise<Recommendation>;
}

export interface EvidenceRepository {
  create(evidence: Omit<EvidenceEntity, 'id' | 'createdAt'>): Promise<EvidenceEntity>;
  listByRecommendation(organizationId: string, recommendationId: string): Promise<EvidenceEntity[]>;
  listByCampaign(organizationId: string, campaignId: string): Promise<EvidenceEntity[]>;
}

export interface HumanDecisionRepository {
  create(decision: Omit<HumanDecisionEntity, 'id' | 'createdAt'>): Promise<HumanDecisionEntity>;
  listByRecommendation(organizationId: string, recommendationId: string): Promise<HumanDecisionEntity[]>;
  listByOrganization(organizationId: string): Promise<HumanDecisionEntity[]>;
}

export interface AuditRepository {
  create(audit: Omit<CampaignAuditEntity, 'id' | 'createdAt'>): Promise<CampaignAuditEntity>;
  getLatestByCampaign(organizationId: string, campaignId: string): Promise<CampaignAuditEntity | null>;
}

export interface LearningRepository {
  create(record: Omit<LearningRecordEntity, 'id' | 'createdAt'>): Promise<LearningRecordEntity>;
  listByBrand(organizationId: string, brandId: string): Promise<LearningRecordEntity[]>;
}
