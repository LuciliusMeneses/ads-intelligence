/**
 * ADS INTELLIGENCE — Campaign Auditor
 * Audits campaign proposals against governance rules and mandatory parameters.
 * Explicitly differentiates CREATIVE_DIRECTION (IA specification) from CREATIVE_ASSET (external graphic/video).
 */

import { ComprehensiveCampaignProposal, CampaignAuditResult } from '../types/intelligence';

export class CampaignAuditor {
  public static audit(proposal: ComprehensiveCampaignProposal): CampaignAuditResult {
    const blockers: string[] = [];
    const warnings: string[] = [];
    const observations: string[] = [];

    // 1. Objective check
    if (!proposal.objective || proposal.objective.trim() === '') {
      blockers.push('Ausência de objetivo de campanha definido.');
    } else {
      observations.push(`Objetivo verificado: ${proposal.objective}`);
    }

    // 2. Budget check
    if (!proposal.budget || proposal.budget.daily <= 0 || proposal.budget.total <= 0) {
      blockers.push('Orçamento inválido ou zerado (diário ou total).');
    } else {
      observations.push(`Orçamento diário: ${proposal.budget.currency} ${proposal.budget.daily}`);
    }

    // 3. Destination check
    if (!proposal.destination || proposal.destination.trim() === '') {
      blockers.push('Campanha sem destino (Landing Destination) configurado.');
    } else {
      observations.push(`Destino verificado: ${proposal.destination}`);
    }

    // 4. Primary KPI check
    if (!proposal.primaryKpi || proposal.primaryKpi.trim() === '') {
      blockers.push('Ausência de KPI principal definido.');
    } else {
      observations.push(`KPI Principal: ${proposal.primaryKpi}`);
    }

    // 5. Creative Direction vs Creative Asset check (Requirement 9)
    // The proposal only requires CREATIVE_DIRECTION (briefing/concept/hook), NOT external CREATIVE_ASSET (file/media)
    if (!proposal.creativeDirection || !proposal.creativeDirection.concept) {
      blockers.push('Direção criativa (CREATIVE_DIRECTION) obrigatória ausente.');
    } else {
      observations.push('Direção criativa (CREATIVE_DIRECTION) especificada. Ativos de mídia finais (CREATIVE_ASSET) serão associados externamente antes da publicação.');
    }

    // 6. Evidence-Aware Audit (Requirement: Sprint 08)
    if (proposal.structuredEvidence) {
      const unknowns = proposal.structuredEvidence.filter(e => e.level === 'UNKNOWN');
      if (unknowns.length > 0) {
        blockers.push(`Bloqueio: ${unknowns.length} itens de evidência marcados como UNKNOWN. Proveniência obrigatória não verificada.`);
      }

      const assumptions = proposal.structuredEvidence.filter(e => e.level === 'ASSUMPTION');
      if (assumptions.length > 0) {
        warnings.push(`Atenção: A proposta baseia-se em ${assumptions.length} suposições (ASSUMPTION) sem provas factuais definitivas.`);
      }

      const facts = proposal.structuredEvidence.filter(e => e.level === 'FACT');
      if (facts.length === 0) {
        warnings.push('Alerta de Fragilidade: Nenhuma evidência de nível FACT encontrada para suportar esta proposta.');
      }
    }

    // 7. Global Warnings
    if (proposal.confidence.confidenceScore < 50) {
      warnings.push('Nível de confiança global baixo (<50%). Recomenda-se adicionar mais dados ou referências de mercado.');
    }

    if (proposal.missingData && proposal.missingData.length > 3) {
      warnings.push(`Existem ${proposal.missingData.length} campos de dados ausentes no contexto.`);
    }

    // Determine final status
    let status: 'PASS' | 'PASS_WITH_WARNINGS' | 'BLOCKED' = 'PASS';
    if (blockers.length > 0) {
      status = 'BLOCKED';
    } else if (warnings.length > 0) {
      status = 'PASS_WITH_WARNINGS';
    }

    return {
      status,
      blockers,
      warnings,
      observations
    };
  }
}
