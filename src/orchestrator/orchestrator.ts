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
import { SpecialistContext, SpecialistAnalysis, ComprehensiveCampaignProposal } from '../types/intelligence';
import { ApprovalGate } from '../state-machine/approval-gate';
import { CampaignProposalBuilder } from '../engines/proposal-builder';
import { SupabaseCampaignProposalRepository, SupabaseAuditRepository } from '../repositories/supabase-adapters';
import { ConfidenceEngine } from '../engines/confidence-engine';

export class AdsOrchestrator {
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

  public static async orchestrateProposalFlow(
    organizationId: string,
    campaignId: string,
    context: SpecialistContext,
    analyses: SpecialistAnalysis[]
  ): Promise<ComprehensiveCampaignProposal> {
    const hasContradictions = analyses.some(a => a.contradictions.length > 0);
    const supportingEvidenceCount = analyses.reduce((acc, a) => acc + a.evidence.length, 0);
    const contradictingEvidenceCount = analyses.reduce((acc, a) => acc + a.contradictions.length, 0);

    const confidence = ConfidenceEngine.calculateConfidence(
      context,
      hasContradictions,
      supportingEvidenceCount,
      contradictingEvidenceCount
    );

    const proposal = CampaignProposalBuilder.build(context, analyses, confidence);

    const auditRepo = new SupabaseAuditRepository();
    await auditRepo.create({
      organizationId,
      campaignId,
      status: proposal.auditResult.status,
      blockers: proposal.auditResult.blockers,
      warnings: proposal.auditResult.warnings,
      observations: proposal.auditResult.observations,
      createdAt: proposal.createdAt
    });

    if (proposal.auditResult.status !== 'BLOCKED') {
      const proposalRepo = new SupabaseCampaignProposalRepository();
      await proposalRepo.create({
        organizationId,
        campaignId,
        version: 1,
        content: proposal
      });
    }

    return proposal;
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
    const audit = this.auditExpertReports(params.expertReports);

    if (audit.hasContradictions) {
      console.warn('[AdsOrchestrator] Alerta de Contradição detectada entre especialistas:', audit.contradictionNotes);
    }

    const proposal: CampaignProposal = {
      id: params.id,
      name: params.name,
      advertiserId: params.advertiserId,
      currentState: 'RECOMMENDED',
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
          details: `Proposta gerada com ${params.expertReports.length} relatórios de especialistas.`
        }
      ]
    };

    return proposal;
  }
}
