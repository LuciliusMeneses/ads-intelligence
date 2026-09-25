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
import { ApprovalGate } from '../state-machine/approval-gate';
import { ContradictionEngine } from '../engines/contradiction-engine';
import { ConfidenceEngine } from '../engines/confidence-engine';
import { SpecialistContext } from '../types/intelligence';

export class AdsOrchestrator {
  /**
   * Evaluates expert reports for contradictions and missing evidence.
   */
  public static auditExpertReports(reports: ExpertAnalysisReport[]): {
    hasContradictions: boolean;
    contradictionNotes: string[];
    missingEvidence: boolean;
    evidenceNotes: string[];
  } {
    const contradictions = ContradictionEngine.detectContradictions(reports.map(r => r.analysis));
    const contradictionNotes = contradictions.map(c => c.resolutionDetails);
    const evidenceNotes: string[] = [];

    const marketReport = reports.find(r => r.expert === 'MARKET_INTELLIGENCE');
    if (!marketReport || marketReport.analysis.evidence.length === 0) {
      evidenceNotes.push('Market Intelligence carece de evidências ou referências verificáveis.');
    }

    return {
      hasContradictions: contradictions.length > 0,
      contradictionNotes,
      missingEvidence: evidenceNotes.length > 0,
      evidenceNotes
    };
  }

  /**
   * Consolidates all expert analyses into a rigorous campaign proposal.
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
    expertReports: ExpertAnalysisReport[];
    context: SpecialistContext;
  }): CampaignProposal {
    const audit = this.auditExpertReports(params.expertReports);
    const confidence = ConfidenceEngine.calculateConfidence(
      params.context,
      audit.hasContradictions,
      params.expertReports.length,
      audit.contradictionNotes.length
    );

    if (audit.hasContradictions) {
      console.warn('[AdsOrchestrator] Alerta de Contradição detectada entre especialistas:', audit.contradictionNotes);
    }

    const proposal: CampaignProposal = {
      id: params.id,
      name: params.name,
      advertiserId: params.advertiserId,
      currentState: audit.hasContradictions ? 'BLOCKED' : 'RECOMMENDED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      marketIntelligence: {
        references: params.references,
        marketSummary: `Analisadas ${params.references.length} referências recentes de mercado. Confiança Global: ${confidence.confidenceScore}%`
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
          details: `Proposta gerada com ${params.expertReports.length} relatórios. Score de Confiança: ${confidence.confidenceScore}.`
        }
      ]
    };

    return proposal;
  }
}