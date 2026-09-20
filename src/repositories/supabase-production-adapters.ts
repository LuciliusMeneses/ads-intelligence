/**
 * ADS INTELLIGENCE — Production Supabase Repository Adapters
 * Executes real database queries against PostgreSQL via @supabase/supabase-js.
 * Zero commercial defaults (no hardcoded BR/BRL/timezone assumptions) and correct NULL vs 0 handling.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import {
  OrganizationEntity,
  BrandEntity,
  ProductServiceEntity,
  CampaignEntity,
  CampaignProposalEntity,
  EvidenceEntity,
  HumanDecisionEntity,
  CampaignAuditEntity,
  LearningRecordEntity,
  OrganizationRepository,
  BrandRepository,
  ProductServiceRepository,
  CampaignRepository,
  CampaignProposalRepository,
  RecommendationRepository,
  EvidenceRepository,
  HumanDecisionRepository,
  AuditRepository,
  LearningRepository
} from './interfaces';
import { Recommendation } from '../types/intelligence';
import { CampaignState } from '../types/ads-intelligence';

function parseNumberOrUndefined(val: any): number | undefined {
  if (val === null || val === undefined) return undefined;
  const num = Number(val);
  return isNaN(num) ? undefined : num;
}

export class ProductionSupabaseOrganizationRepository implements OrganizationRepository {
  constructor(private client: SupabaseClient) {}

  public async create(org: Omit<OrganizationEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrganizationEntity> {
    const { data, error } = await this.client
      .from('organizations')
      .insert({
        name: org.name,
        slug: org.slug,
        status: org.status || 'ACTIVE'
      })
      .select('*')
      .single();

    if (error) throw new Error(`[Supabase Error: create organization] ${error.message}`);
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  public async findById(id: string): Promise<OrganizationEntity | null> {
    const { data, error } = await this.client
      .from('organizations')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(`[Supabase Error: findById organization] ${error.message}`);
    if (!data) return null;
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  public async findBySlug(slug: string): Promise<OrganizationEntity | null> {
    const { data, error } = await this.client
      .from('organizations')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw new Error(`[Supabase Error: findBySlug organization] ${error.message}`);
    if (!data) return null;
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  public async update(id: string, updates: Partial<OrganizationEntity>): Promise<OrganizationEntity> {
    const { data, error } = await this.client
      .from('organizations')
      .update({
        ...(updates.name && { name: updates.name }),
        ...(updates.status && { status: updates.status }),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw new Error(`[Supabase Error: update organization] ${error.message}`);
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }
}

export class ProductionSupabaseBrandRepository implements BrandRepository {
  constructor(private client: SupabaseClient) {}

  public async create(brand: Omit<BrandEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<BrandEntity> {
    const { data, error } = await this.client
      .from('brands')
      .insert({
        organization_id: brand.organizationId,
        name: brand.name,
        website: brand.website,
        industry: brand.industry,
        country: brand.country,
        currency: brand.currency,
        timezone: brand.timezone
      })
      .select('*')
      .single();

    if (error) throw new Error(`[Supabase Error: create brand] ${error.message}`);
    return {
      id: data.id,
      organizationId: data.organization_id,
      name: data.name,
      website: data.website,
      industry: data.industry,
      country: data.country,
      currency: data.currency,
      timezone: data.timezone,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  public async findById(organizationId: string, id: string): Promise<BrandEntity | null> {
    const { data, error } = await this.client
      .from('brands')
      .select('*')
      .eq('id', id)
      .eq('organization_id', organizationId)
      .maybeSingle();

    if (error) throw new Error(`[Supabase Error: findById brand] ${error.message}`);
    if (!data) return null;
    return {
      id: data.id,
      organizationId: data.organization_id,
      name: data.name,
      website: data.website,
      industry: data.industry,
      country: data.country,
      currency: data.currency,
      timezone: data.timezone,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  public async listByOrganization(organizationId: string): Promise<BrandEntity[]> {
    const { data, error } = await this.client
      .from('brands')
      .select('*')
      .eq('organization_id', organizationId);

    if (error) throw new Error(`[Supabase Error: listByOrganization brand] ${error.message}`);
    return (data || []).map(d => ({
      id: d.id,
      organizationId: d.organization_id,
      name: d.name,
      website: d.website,
      industry: d.industry,
      country: d.country,
      currency: d.currency,
      timezone: d.timezone,
      createdAt: d.created_at,
      updatedAt: d.updated_at
    }));
  }
}

export class ProductionSupabaseProductServiceRepository implements ProductServiceRepository {
  constructor(private client: SupabaseClient) {}

  public async create(product: Omit<ProductServiceEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductServiceEntity> {
    const { data, error } = await this.client
      .from('product_services')
      .insert({
        organization_id: product.organizationId,
        brand_id: product.brandId,
        type: product.type,
        name: product.name,
        description: product.description,
        current_price: product.currentPrice,
        currency: product.currency,
        cost: product.cost,
        margin: product.margin,
        average_ticket: product.averageTicket,
        target_cac: product.targetCac,
        landing_url: product.landingUrl,
        status: product.status || 'ACTIVE'
      })
      .select('*')
      .single();

    if (error) throw new Error(`[Supabase Error: create product_service] ${error.message}`);
    return {
      id: data.id,
      organizationId: data.organization_id,
      brandId: data.brand_id,
      type: data.type,
      name: data.name,
      description: data.description,
      currentPrice: parseNumberOrUndefined(data.current_price),
      currency: data.currency,
      cost: parseNumberOrUndefined(data.cost),
      margin: parseNumberOrUndefined(data.margin),
      averageTicket: parseNumberOrUndefined(data.average_ticket),
      targetCac: parseNumberOrUndefined(data.target_cac),
      landingUrl: data.landing_url,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  public async findById(organizationId: string, id: string): Promise<ProductServiceEntity | null> {
    const { data, error } = await this.client
      .from('product_services')
      .select('*')
      .eq('id', id)
      .eq('organization_id', organizationId)
      .maybeSingle();

    if (error) throw new Error(`[Supabase Error: findById product_service] ${error.message}`);
    if (!data) return null;
    return {
      id: data.id,
      organizationId: data.organization_id,
      brandId: data.brand_id,
      type: data.type,
      name: data.name,
      description: data.description,
      currentPrice: parseNumberOrUndefined(data.current_price),
      currency: data.currency,
      cost: parseNumberOrUndefined(data.cost),
      margin: parseNumberOrUndefined(data.margin),
      averageTicket: parseNumberOrUndefined(data.average_ticket),
      targetCac: parseNumberOrUndefined(data.target_cac),
      landingUrl: data.landing_url,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  public async listByBrand(organizationId: string, brandId: string): Promise<ProductServiceEntity[]> {
    const { data, error } = await this.client
      .from('product_services')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('brand_id', brandId);

    if (error) throw new Error(`[Supabase Error: listByBrand product_service] ${error.message}`);
    return (data || []).map(d => ({
      id: d.id,
      organizationId: d.organization_id,
      brandId: d.brand_id,
      type: d.type,
      name: d.name,
      description: d.description,
      currentPrice: parseNumberOrUndefined(d.current_price),
      currency: d.currency,
      cost: parseNumberOrUndefined(d.cost),
      margin: parseNumberOrUndefined(d.margin),
      averageTicket: parseNumberOrUndefined(d.average_ticket),
      targetCac: parseNumberOrUndefined(d.target_cac),
      landingUrl: d.landing_url,
      status: d.status,
      createdAt: d.created_at,
      updatedAt: d.updated_at
    }));
  }
}

export class ProductionSupabaseCampaignRepository implements CampaignRepository {
  constructor(private client: SupabaseClient) {}

  public async create(campaign: Omit<CampaignEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<CampaignEntity> {
    const { data, error } = await this.client
      .from('campaigns')
      .insert({
        organization_id: campaign.organizationId,
        brand_id: campaign.brandId,
        ad_account_id: campaign.adAccountId,
        product_service_id: campaign.productServiceId,
        name: campaign.name,
        platform: campaign.platform,
        objective: campaign.objective,
        status: campaign.status || 'DRAFT',
        approval_state: campaign.approvalState || 'DRAFT'
      })
      .select('*')
      .single();

    if (error) throw new Error(`[Supabase Error: create campaign] ${error.message}`);
    return {
      id: data.id,
      organizationId: data.organization_id,
      brandId: data.brand_id,
      adAccountId: data.ad_account_id,
      productServiceId: data.product_service_id,
      name: data.name,
      platform: data.platform,
      objective: data.objective,
      status: data.status,
      approvalState: data.approval_state,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  public async findById(organizationId: string, id: string): Promise<CampaignEntity | null> {
    const { data, error } = await this.client
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .eq('organization_id', organizationId)
      .maybeSingle();

    if (error) throw new Error(`[Supabase Error: findById campaign] ${error.message}`);
    if (!data) return null;
    return {
      id: data.id,
      organizationId: data.organization_id,
      brandId: data.brand_id,
      adAccountId: data.ad_account_id,
      productServiceId: data.product_service_id,
      name: data.name,
      platform: data.platform,
      objective: data.objective,
      status: data.status,
      approvalState: data.approval_state,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  public async listByBrand(organizationId: string, brandId: string): Promise<CampaignEntity[]> {
    const { data, error } = await this.client
      .from('campaigns')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('brand_id', brandId);

    if (error) throw new Error(`[Supabase Error: listByBrand campaign] ${error.message}`);
    return (data || []).map(d => ({
      id: d.id,
      organizationId: d.organization_id,
      brandId: d.brand_id,
      adAccountId: d.ad_account_id,
      productServiceId: d.product_service_id,
      name: d.name,
      platform: d.platform,
      objective: d.objective,
      status: d.status,
      approvalState: d.approval_state,
      createdAt: d.created_at,
      updatedAt: d.updated_at
    }));
  }

  public async updateApprovalState(organizationId: string, id: string, newState: CampaignState): Promise<CampaignEntity> {
    const { data, error } = await this.client
      .from('campaigns')
      .update({
        approval_state: newState,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('organization_id', organizationId)
      .select('*')
      .single();

    if (error) throw new Error(`[Supabase Error: updateApprovalState campaign] ${error.message}`);
    return {
      id: data.id,
      organizationId: data.organization_id,
      brandId: data.brand_id,
      adAccountId: data.ad_account_id,
      productServiceId: data.product_service_id,
      name: data.name,
      platform: data.platform,
      objective: data.objective,
      status: data.status,
      approvalState: data.approval_state,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }
}

export class ProductionSupabaseCampaignProposalRepository implements CampaignProposalRepository {
  constructor(private client: SupabaseClient) {}

  public async create(proposal: Omit<CampaignProposalEntity, 'id' | 'createdAt'>): Promise<CampaignProposalEntity> {
    const { data, error } = await this.client
      .from('campaign_proposals')
      .insert({
        organization_id: proposal.organizationId,
        campaign_id: proposal.campaignId,
        version: proposal.version || 1,
        proposal_data: proposal.proposalData,
        confidence_score: proposal.confidenceScore,
        confidence_band: proposal.confidenceBand,
        audit_status: proposal.auditStatus,
        created_by: proposal.createdBy
      })
      .select('*')
      .single();

    if (error) throw new Error(`[Supabase Error: create campaign_proposal] ${error.message}`);
    return {
      id: data.id,
      organizationId: data.organization_id,
      campaignId: data.campaign_id,
      version: data.version,
      proposalData: data.proposal_data,
      confidenceScore: Number(data.confidence_score),
      confidenceBand: data.confidence_band,
      auditStatus: data.audit_status,
      createdBy: data.created_by,
      createdAt: data.created_at
    };
  }

  public async findById(organizationId: string, id: string): Promise<CampaignProposalEntity | null> {
    const { data, error } = await this.client
      .from('campaign_proposals')
      .select('*')
      .eq('id', id)
      .eq('organization_id', organizationId)
      .maybeSingle();

    if (error) throw new Error(`[Supabase Error: findById campaign_proposal] ${error.message}`);
    if (!data) return null;
    return {
      id: data.id,
      organizationId: data.organization_id,
      campaignId: data.campaign_id,
      version: data.version,
      proposalData: data.proposal_data,
      confidenceScore: Number(data.confidence_score),
      confidenceBand: data.confidence_band,
      auditStatus: data.audit_status,
      createdBy: data.created_by,
      createdAt: data.created_at
    };
  }

  public async getLatestVersion(organizationId: string, campaignId: string): Promise<CampaignProposalEntity | null> {
    const { data, error } = await this.client
      .from('campaign_proposals')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('campaign_id', campaignId)
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(`[Supabase Error: getLatestVersion campaign_proposal] ${error.message}`);
    if (!data) return null;
    return {
      id: data.id,
      organizationId: data.organization_id,
      campaignId: data.campaign_id,
      version: data.version,
      proposalData: data.proposal_data,
      confidenceScore: Number(data.confidence_score),
      confidenceBand: data.confidence_band,
      auditStatus: data.audit_status,
      createdBy: data.created_by,
      createdAt: data.created_at
    };
  }

  public async listVersions(organizationId: string, campaignId: string): Promise<CampaignProposalEntity[]> {
    const { data, error } = await this.client
      .from('campaign_proposals')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('campaign_id', campaignId)
      .order('version', { ascending: true });

    if (error) throw new Error(`[Supabase Error: listVersions campaign_proposal] ${error.message}`);
    return (data || []).map(d => ({
      id: d.id,
      organizationId: d.organization_id,
      campaignId: d.campaign_id,
      version: d.version,
      proposalData: d.proposal_data,
      confidenceScore: Number(d.confidence_score),
      confidenceBand: d.confidence_band,
      auditStatus: d.audit_status,
      createdBy: d.created_by,
      createdAt: d.created_at
    }));
  }
}

export class ProductionSupabaseHumanDecisionRepository implements HumanDecisionRepository {
  constructor(private client: SupabaseClient) {}

  public async create(decision: Omit<HumanDecisionEntity, 'id' | 'createdAt'>): Promise<HumanDecisionEntity> {
    const { data, error } = await this.client
      .from('human_decisions')
      .insert({
        organization_id: decision.organizationId,
        recommendation_id: decision.recommendationId,
        user_id: decision.userId,
        decision: decision.decision,
        original_recommendation: decision.originalRecommendation,
        modified_value: decision.modifiedValue,
        reason: decision.reason
      })
      .select('*')
      .single();

    if (error) throw new Error(`[Supabase Error: create human_decision] ${error.message}`);
    return {
      id: data.id,
      organizationId: data.organization_id,
      recommendationId: data.recommendation_id,
      userId: data.user_id,
      decision: data.decision,
      originalRecommendation: data.original_recommendation,
      modifiedValue: data.modified_value,
      reason: data.reason,
      createdAt: data.created_at
    };
  }

  public async listByRecommendation(organizationId: string, recommendationId: string): Promise<HumanDecisionEntity[]> {
    const { data, error } = await this.client
      .from('human_decisions')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('recommendation_id', recommendationId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(`[Supabase Error: listByRecommendation human_decision] ${error.message}`);
    return (data || []).map(d => ({
      id: d.id,
      organizationId: d.organization_id,
      recommendationId: d.recommendation_id,
      userId: d.user_id,
      decision: d.decision,
      originalRecommendation: d.original_recommendation,
      modifiedValue: d.modified_value,
      reason: d.reason,
      createdAt: d.created_at
    }));
  }

  public async listByOrganization(organizationId: string): Promise<HumanDecisionEntity[]> {
    const { data, error } = await this.client
      .from('human_decisions')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(`[Supabase Error: listByOrganization human_decision] ${error.message}`);
    return (data || []).map(d => ({
      id: d.id,
      organizationId: d.organization_id,
      recommendationId: d.recommendation_id,
      userId: d.user_id,
      decision: d.decision,
      originalRecommendation: d.original_recommendation,
      modifiedValue: d.modified_value,
      reason: d.reason,
      createdAt: d.created_at
    }));
  }
}
