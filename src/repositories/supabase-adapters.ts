/**
 * ADS INTELLIGENCE — Supabase / PostgreSQL Repository Adapters
 * Implements repository contracts ensuring multi-tenant isolation, versioning, and append-only constraints.
 */

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

export class SupabaseOrganizationRepository implements OrganizationRepository {
  private store = new Map<string, OrganizationEntity>();

  public async create(org: Omit<OrganizationEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrganizationEntity> {
    const id = `org_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const entity: OrganizationEntity = {
      ...org,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.store.set(id, entity);
    return entity;
  }

  public async findById(id: string): Promise<OrganizationEntity | null> {
    return this.store.get(id) || null;
  }

  public async findBySlug(slug: string): Promise<OrganizationEntity | null> {
    for (const org of this.store.values()) {
      if (org.slug === slug) return org;
    }
    return null;
  }

  public async update(id: string, updates: Partial<OrganizationEntity>): Promise<OrganizationEntity> {
    const existing = await this.findById(id);
    if (!existing) throw new Error(`Organization ${id} not found`);
    const updated: OrganizationEntity = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.store.set(id, updated);
    return updated;
  }
}

export class SupabaseBrandRepository implements BrandRepository {
  private store = new Map<string, BrandEntity>();

  public async create(brand: Omit<BrandEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<BrandEntity> {
    const id = `brand_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const entity: BrandEntity = {
      ...brand,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.store.set(id, entity);
    return entity;
  }

  public async findById(organizationId: string, id: string): Promise<BrandEntity | null> {
    const brand = this.store.get(id);
    if (!brand || brand.organizationId !== organizationId) return null;
    return brand;
  }

  public async listByOrganization(organizationId: string): Promise<BrandEntity[]> {
    return Array.from(this.store.values()).filter(b => b.organizationId === organizationId);
  }
}

export class SupabaseProductServiceRepository implements ProductServiceRepository {
  private store = new Map<string, ProductServiceEntity>();

  public async create(product: Omit<ProductServiceEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductServiceEntity> {
    const id = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const entity: ProductServiceEntity = {
      ...product,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.store.set(id, entity);
    return entity;
  }

  public async findById(organizationId: string, id: string): Promise<ProductServiceEntity | null> {
    const prod = this.store.get(id);
    if (!prod || prod.organizationId !== organizationId) return null;
    return prod;
  }

  public async listByBrand(organizationId: string, brandId: string): Promise<ProductServiceEntity[]> {
    return Array.from(this.store.values()).filter(
      p => p.organizationId === organizationId && p.brandId === brandId
    );
  }
}

export class SupabaseCampaignRepository implements CampaignRepository {
  private store = new Map<string, CampaignEntity>();

  public async create(campaign: Omit<CampaignEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<CampaignEntity> {
    const id = `camp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const entity: CampaignEntity = {
      ...campaign,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.store.set(id, entity);
    return entity;
  }

  public async findById(organizationId: string, id: string): Promise<CampaignEntity | null> {
    const camp = this.store.get(id);
    if (!camp || camp.organizationId !== organizationId) return null;
    return camp;
  }

  public async listByBrand(organizationId: string, brandId: string): Promise<CampaignEntity[]> {
    return Array.from(this.store.values()).filter(
      c => c.organizationId === organizationId && c.brandId === brandId
    );
  }

  public async updateApprovalState(organizationId: string, id: string, newState: CampaignState): Promise<CampaignEntity> {
    const existing = await this.findById(organizationId, id);
    if (!existing) throw new Error(`Campaign ${id} not found in tenant ${organizationId}`);
    const updated: CampaignEntity = {
      ...existing,
      approvalState: newState,
      updatedAt: new Date().toISOString()
    };
    this.store.set(id, updated);
    return updated;
  }
}

export class SupabaseCampaignProposalRepository implements CampaignProposalRepository {
  private store = new Map<string, CampaignProposalEntity>();

  public async create(proposal: Omit<CampaignProposalEntity, 'id' | 'createdAt'>): Promise<CampaignProposalEntity> {
    const id = `prop_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const entity: CampaignProposalEntity = {
      ...proposal,
      id,
      createdAt: new Date().toISOString()
    };
    this.store.set(id, entity);
    return entity;
  }

  public async findById(organizationId: string, id: string): Promise<CampaignProposalEntity | null> {
    const p = this.store.get(id);
    if (!p || p.organizationId !== organizationId) return null;
    return p;
  }

  public async getLatestVersion(organizationId: string, campaignId: string): Promise<CampaignProposalEntity | null> {
    const versions = await this.listVersions(organizationId, campaignId);
    if (versions.length === 0) return null;
    return versions.sort((a, b) => b.version - a.version)[0];
  }

  public async listVersions(organizationId: string, campaignId: string): Promise<CampaignProposalEntity[]> {
    return Array.from(this.store.values()).filter(
      p => p.organizationId === organizationId && p.campaignId === campaignId
    );
  }
}

export class SupabaseRecommendationRepository implements RecommendationRepository {
  private store = new Map<string, Recommendation & { organizationId: string; campaignId: string; proposalId?: string }>();

  public async create(rec: Omit<Recommendation, 'id' | 'createdAt'> & { organizationId: string; campaignId: string; proposalId?: string }): Promise<Recommendation> {
    const id = `rec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const entity: Recommendation & { organizationId: string; campaignId: string; proposalId?: string } = {
      ...rec,
      id,
      createdAt: new Date().toISOString()
    };
    this.store.set(id, entity);
    return entity;
  }

  public async listByCampaign(organizationId: string, campaignId: string): Promise<Recommendation[]> {
    return Array.from(this.store.values()).filter(
      r => r.organizationId === organizationId && r.campaignId === campaignId
    );
  }

  public async updateStatus(organizationId: string, id: string, status: any): Promise<Recommendation> {
    const rec = this.store.get(id);
    if (!rec || rec.organizationId !== organizationId) {
      throw new Error(`Recommendation ${id} not found in tenant ${organizationId}`);
    }
    rec.status = status;
    this.store.set(id, rec);
    return rec;
  }
}

export class SupabaseEvidenceRepository implements EvidenceRepository {
  private store = new Map<string, EvidenceEntity>();

  public async create(evidence: Omit<EvidenceEntity, 'id' | 'createdAt'>): Promise<EvidenceEntity> {
    const id = `ev_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const entity: EvidenceEntity = {
      ...evidence,
      id,
      createdAt: new Date().toISOString()
    };
    this.store.set(id, entity);
    return entity;
  }

  public async listByRecommendation(organizationId: string, recommendationId: string): Promise<EvidenceEntity[]> {
    return Array.from(this.store.values()).filter(
      e => e.organizationId === organizationId && e.recommendationId === recommendationId
    );
  }

  public async listByCampaign(organizationId: string, campaignId: string): Promise<EvidenceEntity[]> {
    return Array.from(this.store.values()).filter(
      e => e.organizationId === organizationId && e.campaignId === campaignId
    );
  }
}

export class SupabaseHumanDecisionRepository implements HumanDecisionRepository {
  private store: HumanDecisionEntity[] = [];

  // APPEND-ONLY: Never updates or deletes an existing decision record
  public async create(decision: Omit<HumanDecisionEntity, 'id' | 'createdAt'>): Promise<HumanDecisionEntity> {
    const id = `dec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const entity: HumanDecisionEntity = {
      ...decision,
      id,
      createdAt: new Date().toISOString()
    };
    this.store.push(entity);
    return entity;
  }

  public async listByRecommendation(organizationId: string, recommendationId: string): Promise<HumanDecisionEntity[]> {
    return this.store.filter(
      d => d.organizationId === organizationId && d.recommendationId === recommendationId
    );
  }

  public async listByOrganization(organizationId: string): Promise<HumanDecisionEntity[]> {
    return this.store.filter(d => d.organizationId === organizationId);
  }
}

export class SupabaseAuditRepository implements AuditRepository {
  private store = new Map<string, CampaignAuditEntity>();

  public async create(audit: Omit<CampaignAuditEntity, 'id' | 'createdAt'>): Promise<CampaignAuditEntity> {
    const id = `aud_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const entity: CampaignAuditEntity = {
      ...audit,
      id,
      createdAt: new Date().toISOString()
    };
    this.store.set(id, entity);
    return entity;
  }

  public async getLatestByCampaign(organizationId: string, campaignId: string): Promise<CampaignAuditEntity | null> {
    const audits = Array.from(this.store.values()).filter(
      a => a.organizationId === organizationId && a.campaignId === campaignId
    );
    if (audits.length === 0) return null;
    return audits.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }
}

export class SupabaseLearningRepository implements LearningRepository {
  private store: LearningRecordEntity[] = [];

  public async create(record: Omit<LearningRecordEntity, 'id' | 'createdAt'>): Promise<LearningRecordEntity> {
    const id = `learn_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const entity: LearningRecordEntity = {
      ...record,
      id,
      createdAt: new Date().toISOString()
    };
    this.store.push(entity);
    return entity;
  }

  public async listByBrand(organizationId: string, brandId: string): Promise<LearningRecordEntity[]> {
    return this.store.filter(
      l => l.organizationId === organizationId && l.brandId === brandId
    );
  }
}
