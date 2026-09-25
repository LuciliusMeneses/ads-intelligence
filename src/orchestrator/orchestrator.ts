/**
 * ADS INTELLIGENCE — Ads Orchestrator
 * Coordinator agent responsible for multi-expert swarm synthesis, contradiction detection,
 * evidence enforcement, and final campaign proposal production.
 */

import {
  ComprehensiveCampaignProposal,
  SpecialistAnalysis,
  SpecialistContext,
  ExpertRole
} from '../types/intelligence';
import { AdsOrchestratorAgent } from '../experts/specialists';
import { CampaignProposalBuilder } from '../engines/proposal-builder';

export class AdsOrchestrator {
  /**
   * Evaluates specialist analyses for contradictions and missing evidence.
   */
  public static auditSpecialistResults(analyses: SpecialistAnalysis[]): {
    hasContradictions: boolean;
    contradictionNotes: string[];
    missingEvidence: boolean;
    evidenceNotes: string[];
  } {
    const contradictionNotes: string[] = [];
    const evidenceNotes: string[] = [];

    // Check if market intelligence has evidence
    const marketAnalysis = analyses.find(a => a.specialist === 'MARKET_INTELLIGENCE');
    if (!marketAnalysis || marketAnalysis.evidence.length === 0) {
      evidenceNotes.push('Market Intelligence carece de evidências ou referências verificáveis.');
    }

    // Check for contradictions between Offer Strategist and Performance Analyst
    const offerAnalysis = analyses.find(a => a.specialist === 'OFFER_STRATEGIST');
    const perfAnalysis = analyses.find(a => a.specialist === 'PERFORMANCE_ANALYST');

    if (offerAnalysis && perfAnalysis) {
      const offerSuggestsHigherPrice = offerAnalysis.recommendations.some(r => 
        r.title.toLowerCase().includes('preço') || r.description.toLowerCase().includes('aumentar')
      );
      const perfReportsPoorConv = perfAnalysis.observations.some(o => 
        o.toLowerCase().includes('queda') || o.toLowerCase().includes('conversão')
      );

      if (offerSuggestsHigherPrice && perfReportsPoorConv) {
        contradictionNotes.push('Conflito: Sugestão de aumento de preço enquanto a performance indica queda de conversão.');
      }
    }

    return {
      hasContradictions: contradictionNotes.length > 0,
      contradictionNotes,
      missingEvidence: evidenceNotes.length > 0,
      evidenceNotes
    };
  }

  /**
   * Consolidates all specialist analyses into a rigorous campaign proposal.
   */
  public static async synthesizeProposal(params: {
    context: SpecialistContext;
    specialistAnalyses: SpecialistAnalysis[];
  }): Promise<ComprehensiveCampaignProposal> {
    // Run orchestrator agent analysis for transversal synthesis
    const orchestratorAgent = new AdsOrchestratorAgent();
    const transversalAnalysis = orchestratorAgent.analyze(params.context, params.specialistAnalyses);

    // Aggregate all analyses
    const allAnalyses = [...params.specialistAnalyses, transversalAnalysis];

    // Audit findings
    const audit = this.auditSpecialistResults(allAnalyses);
    if (audit.hasContradictions) {
      console.warn('[AdsOrchestrator] Alerta de Contradição detectada entre especialistas:', audit.contradictionNotes);
    }

    // Build final proposal
    return CampaignProposalBuilder.build(
      params.context,
      allAnalyses,
      transversalAnalysis.confidence
    );
  }
}
