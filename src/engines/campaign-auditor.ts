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

    // 6. Warnings
    if (proposal.confidence.confidenceScore < 50) {
      warnings.push('Nível de confiança global baixo (<50%). Recomenda-se adicionar mais dados ou referências de mercado.');
    }

    if (proposal.missingData && proposal.missingData.length > 3) {
      warnings.push(`Existem ${proposal.missingData.length} campos de dados ausentes no contexto.`);
    }

    // Determine final status
    let status: 'PASS' | 'PASS_WITH_WARNINGS' | 'BLOCKED' | 'PENDING_APPROVAL' = 'PASS';
    if (blockers.length > 0) {
      status = 'BLOCKED';
    } else if (warnings.length > 0) {
      status = 'PASS_WITH_WARNINGS';
    } else {
      // If passing but needing human oversight
      status = 'PENDING_APPROVAL';
    }

    return {
      status,
      blockers,
      warnings,
      observations
    };
  }
}
