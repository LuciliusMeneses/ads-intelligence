/**
 * ADS INTELLIGENCE — Campaign Auditor
 * Audits campaign proposals against governance rules and mandatory parameters.
 * Explicitly differentiates CREATIVE_DIRECTION (IA specification) from CREATIVE_ASSET (external graphic/video).
 * Enforces evidence provenance checking: blocks claims without sufficient source metadata.
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
    if (!proposal.creativeDirection || !proposal.creativeDirection.concept) {
      blockers.push('Direção criativa (CREATIVE_DIRECTION) obrigatória ausente.');
    } else {
      observations.push('Direção criativa (CREATIVE_DIRECTION) especificada. Ativos de mídia finais (CREATIVE_ASSET) serão associados externamente antes da publicação.');
    }

    // 6. Evidence Provenance check (Market & Competitor Intelligence enforcement)
    if (!proposal.evidence || proposal.evidence.length === 0 || proposal.evidence.some(e => e.includes('UNKNOWN'))) {
      warnings.push('Aviso de Governança: Proposta contém itens de evidência desconhecida (UNKNOWN) ou ausência de provenance detalhada.');
    }

    // Check for unverified assertions treated as absolute facts
    const hasUnverifiedFactClaim = proposal.evidence.some(e => e.includes('ASSUMPTION') && !e.includes('provenance'));
    if (hasUnverifiedFactClaim) {
      blockers.push('Violação de Evidência: Tentativa de promover pressuposição (ASSUMPTION) a facto sem proveniência verificada.');
    }

    // 7. Confidence Warnings
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
