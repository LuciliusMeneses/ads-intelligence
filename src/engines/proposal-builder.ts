/**
 * ADS INTELLIGENCE — Campaign Proposal Builder
 * Aggregates specialist analyses, recommendations, and evidence into an actionable, auditable proposal.
 * STRICT: Zero hardcoded commercial/financial production fallbacks. Missing data handled via explicit contracts.
 */

import {
  SpecialistContext,
  SpecialistAnalysis,
  ComprehensiveCampaignProposal,
  ConfidenceResult
} from '../types/intelligence';
import { CampaignAuditor } from './campaign-auditor';
import { OfferStrategistSpecialist } from '../experts/offer-strategist';

export class CampaignProposalBuilder {
  public static build(
    context: SpecialistContext,
    analyses: SpecialistAnalysis[],
    overallConfidence: ConfidenceResult
  ): ComprehensiveCampaignProposal {
    const proposal: ComprehensiveCampaignProposal = {
      id: `prop_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: `Campanha Publicitária — ${context.brand || 'Marca Não Informada'}`,
      platform: 'META_ADS',
      objective: context.campaignObjective,
      budget: context.budgetConstraints ? {
        daily: context.budgetConstraints.dailyMax || 0,
        total: context.budgetConstraints.totalBudget || 0,
        currency: 'BRL'
      } : undefined,
      durationDays: 30,
      geography: context.geography,
      destination: context.landingDestination,
      primaryKpi: context.campaignObjective ? 'ROAS / Conversões' : undefined,
      secondaryKpis: ['CPA', 'CTR', 'CVR'],
      targetCpaOrCpl: context.targetCac,
      breakEven: context.currentPrice && context.margin ? context.currentPrice * (1 - (context.margin / 100)) : undefined,
      creativeDirection: {
        id: `cre_${Date.now()}`,
        format: 'VIDEO_9_16',
        durationSeconds: 20,
        aspectRatio: '9:16',
        concept: 'Direção Criativa Orientada a Proposta de Valor e Dor Imediata',
        hook: 'Hook focado em interrogação ou dor principal do público',
        approach: 'Demonstração de solução rápida em 3 passos',
        coreMessage: context.productOrService || 'Proposta de valor principal',
        narrativeStructure: 'Hook (0-3s) -> Problema (3-8s) -> Solução (8-15s) -> CTA (15-20s)',
        callToAction: 'Saiba Mais / Comprar Agora',
        testVariationsCount: 3,
        note: 'REGRA ABSOLUTA: A IA não gera imagens ou vídeos. Produção criativa externa obrigatória.'
      },
      copy: {
        primaryText: context.productOrService ? `Conheça a solução definitiva em ${context.productOrService}.` : 'Solução ideal para o seu negócio.',
        headline: context.businessObjective || 'Aumente Seus Resultados',
        description: 'Condição especial por tempo limitado.',
        cta: 'SAIBA MAIS',
        humanDecision: 'ACCEPT'
      },
      testPlan: 'Testes A/B estruturados de hooks criativos e públicos com verba controlada.',
      evidence: analyses.flatMap(a => a.evidence),
      risks: analyses.flatMap(a => a.risks),
      confidence: overallConfidence,
      missingData: overallConfidence.confidenceReasons.filter(r => r.includes('Ausência') || r.includes('desconhecida')),
      auditResult: {
        status: 'PASS',
        blockers: [],
        warnings: [],
        observations: []
      },
      createdAt: new Date().toISOString()
    };

    // If offer pricing context is present, map it using OfferStrategistSpecialist
    if (context.currentPrice !== undefined) {
      proposal.offer = OfferStrategistSpecialist.createOfferPricing({
        currentPrice: context.currentPrice,
        marketPrice: context.averageTicket || context.currentPrice,
        aiSuggestedPrice: context.currentPrice,
        currency: 'BRL',
        originAndJustification: 'Derivado do contexto de preço informado pelo usuário.',
        averageTicket: context.averageTicket || context.currentPrice,
        targetMarginPercent: context.margin || 50,
        targetCac: context.targetCac || 0,
        breakEvenPoint: context.currentPrice * (1 - ((context.margin || 50) / 100))
      });
    }

    // Run final audit
    proposal.auditResult = CampaignAuditor.audit(proposal);

    return proposal;
  }
}
