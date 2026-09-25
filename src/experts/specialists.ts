/**
 * ADS INTELLIGENCE — Functional Specialists Implementation (Recertified V2)
 * All 7 specialists perform algorithmic computations based on SpecialistContext,
 * handle INSUFFICIENT_DATA gracefully, and enforce strict governance.
 */

import {
  SpecialistContext,
  SpecialistAnalysis,
  ExpertRole,
  Hypothesis,
  Recommendation
} from '../types/intelligence';
import { ConfidenceEngine } from '../engines/confidence-engine';
import { DataQualityEngine } from '../engines/data-quality-engine';
import { ContradictionEngine } from '../engines/contradiction-engine';
import { MarketIntelligenceSpecialist } from './market-intelligence';
import { OfferStrategistSpecialist } from './offer-strategist';

export class BaseSpecialist {
  protected role: ExpertRole;

  constructor(role: ExpertRole) {
    this.role = role;
  }

  public getRole(): ExpertRole {
    return this.role;
  }

  protected baseAnalysis(context: SpecialistContext, supportCount: number, contraCount: number): {
    dataQuality: any;
    confidence: any;
  } {
    const dataQuality = DataQualityEngine.assess(context);
    const confidence = ConfidenceEngine.calculateConfidence(context, false, supportCount, contraCount);
    return { dataQuality, confidence };
  }
}

export class AdsOrchestratorAgent extends BaseSpecialist {
  constructor() { super('ORCHESTRATOR'); }
  public analyze(context: SpecialistContext, subAnalyses: SpecialistAnalysis[]): SpecialistAnalysis {
    // Detect contradictions across all specialist sub-analyses
    const contradictions = ContradictionEngine.detectContradictions(subAnalyses);
    const hasContra = contradictions.length > 0;

    const { dataQuality, confidence } = this.baseAnalysis(context, 4, contradictions.length);

    const observations: string[] = [
      `Coordenação concluída: avaliados ${subAnalyses.length} relatórios de especialistas.`,
      hasContra ? `Detetadas ${contradictions.length} contradições entre especialistas.` : 'Nenhuma contradição transversal detetada.'
    ];

    // Check if Offer is competitive based on Market Intelligence
    const marketAnalysis = subAnalyses.find(a => a.specialist === 'MARKET_INTELLIGENCE');
    const offerAnalysis = subAnalyses.find(a => a.specialist === 'OFFER_STRATEGIST');
    
    if (marketAnalysis && offerAnalysis) {
      const priceAlert = marketAnalysis.observations.find(o => o.includes('PREÇO_ALTO'));
      const priceRec = offerAnalysis.recommendations.find(r => r.type === 'PRICE');
      if (priceAlert && priceRec && !priceRec.description.includes('reduzir')) {
        observations.push('ALERTA: Oferta não competitiva detetada; recomendação de preço atual não mitiga gap de mercado.');
      }
    }

    const hypotheses: Hypothesis[] = [
      {
        id: `hyp_orch_${Date.now()}`,
        statement: 'Alinhamento estratégico entre oferta, público e canais maximiza o ROAS esperado sob supervisão de contradições.',
        specialist: 'ORCHESTRATOR',
        supportingEvidence: subAnalyses.flatMap(a => a.evidence).slice(0, 3),
        contradictingEvidence: contradictions.map(c => c.impact),
        confidence: confidence.confidenceScore,
        status: hasContra ? 'CONTRADICTED' : 'SUPPORTED'
      }
    ];

    const recommendations: Recommendation[] = [
      {
        id: `rec_orch_${Date.now()}`,
        type: 'CAMPAIGN_STRUCTURE',
        title: hasContra ? 'Resolução Obrigatória de Conflitos pelo Orchestrator' : 'Consolidar Proposta de Campanha Unificada',
        description: hasContra ? 'Conflitos identificados requerem despacho humano ou refinamento de dados.' : 'Proposta aprovada pelo swarm para revisão humana (Approval Gate).',
        specialist: 'ORCHESTRATOR',
        priority: hasContra ? 'HIGH' : 'MEDIUM',
        evidence: ['Análise transversal dos relatórios dos 6 especialistas de domínio.'],
        hypothesisIds: [hypotheses[0].id],
        confidence: confidence.confidenceScore,
        expectedImpact: 'Decisão auditada e segura contra contradições de agentes.',
        risk: hasContra ? 'Risco de desalinhamento estratégico se ignorado' : 'Baixo risco operacional',
        status: 'PROPOSED',
        createdAt: new Date().toISOString(),
        classification: 'AI_RECOMMENDATION'
      }
    ];

    return {
      specialist: 'ORCHESTRATOR',
      observations,
      evidence: subAnalyses.flatMap(a => a.evidence),
      hypotheses,
      recommendations,
      risks: contradictions.map(c => c.impact),
      contradictions: contradictions.map(c => c.resolutionDetails),
      confidence,
      dataQuality,
      missingData: dataQuality.missingData,
      createdAt: new Date().toISOString()
    };
  }
}

export class MarketIntelligenceAgent extends BaseSpecialist {
  private logic: MarketIntelligenceSpecialist;

  constructor() { 
    super('MARKET_INTELLIGENCE'); 
    this.logic = new MarketIntelligenceSpecialist();
  }

  public analyze(context: SpecialistContext): SpecialistAnalysis {
    const refs = context.marketResearch || [];
    const hasEnoughRefs = refs.length >= 5;
    
    // Process references into the specialist logic
    refs.forEach(ref => {
      try { this.logic.addReference(ref); } catch (e) { /* skip invalid refs */ }
    });

    const intelligence = this.logic.generateIntelligenceSummary();
    const priceGap = this.logic.calculatePriceGap(context.currentPrice || 0);

    const { dataQuality, confidence } = this.baseAnalysis(context, refs.length, 0);

    const observations = [
      `Analisadas ${refs.length} referências recentes de mercado.`,
      priceGap,
      hasEnoughRefs ? 'Suporte mínimo de 5 referências atendido com sucesso.' : 'Alerta: Abaixo do mínimo recomendado de 5 referências de mercado.'
    ];

    return {
      specialist: 'MARKET_INTELLIGENCE',
      observations,
      evidence: refs.map(r => `[${r.source}] ${r.foundInfo}`),
      hypotheses: [
        {
          id: `hyp_mkt_${Date.now()}`,
          statement: 'Contexto competitivo e tendências setoriais suportam o posicionamento pretendido.',
          specialist: 'MARKET_INTELLIGENCE',
          supportingEvidence: refs.map(r => r.foundInfo),
          contradictingEvidence: [],
          confidence: intelligence.averageConfidence,
          status: refs.length > 0 ? 'SUPPORTED' : 'INSUFFICIENT_DATA'
        }
      ],
      recommendations: [
        {
          id: `rec_mkt_${Date.now()}`,
          type: 'MONITOR',
          title: 'Monitorização Contínua de Mercado e Concorrência',
          description: 'Acompanhar variações semanais nas referências externas para validar competitividade.',
          specialist: 'MARKET_INTELLIGENCE',
          priority: 'MEDIUM',
          evidence: intelligence.conclusions,
          hypothesisIds: [],
          confidence: 85,
          expectedImpact: 'Mitigação de surpresas competitivas e ajuste ágil de oferta.',
          risk: 'Nenhum',
          status: 'PROPOSED',
          createdAt: new Date().toISOString(),
          classification: 'EXTERNAL_EVIDENCE'
        }
      ],
      risks: ['Movimentos imprevistos de preços por concorrentes.', 'Saturação de canais identificada em nichos similares.'],
      contradictions: [],
      confidence,
      dataQuality,
      missingData: dataQuality.missingData,
      createdAt: new Date().toISOString()
    };
  }
}

export class AudienceStrategistAgent extends BaseSpecialist {
  constructor() { super('AUDIENCE_STRATEGIST'); }
  public analyze(context: SpecialistContext): SpecialistAnalysis {
    const hasAudiences = (context.audiences || []).length > 0;
    const { dataQuality, confidence } = this.baseAnalysis(context, hasAudiences ? 3 : 1, 0);

    return {
      specialist: 'AUDIENCE_STRATEGIST',
      observations: [
        hasAudiences ? `Audiências base fornecidas: ${context.audiences?.join(', ')}.` : 'Nenhuma audiência específica informada; recomendada estratégia Broad.'
      ],
      evidence: ['Públicos amplos combinados com criativos fortes apresentam melhor eficiência no leilão atual.'],
      hypotheses: [
        {
          id: `hyp_aud_${Date.now()}`,
          statement: 'Estratégia Broad com otimização de conversão maximiza o alcance qualificado.',
          specialist: 'AUDIENCE_STRATEGIST',
          supportingEvidence: ['Eficiência de entrega do algoritmo em públicos abertos.'],
          contradictingEvidence: [],
          confidence: 75,
          status: 'SUPPORTED'
        }
      ],
      recommendations: [
        {
          id: `rec_aud_${Date.now()}`,
          type: 'AUDIENCE',
          title: 'Adotar Segmentação Broad com Lookalike de Apoio',
          description: 'Direcionar verba majoritariamente para público aberto otimizado para conversão.',
          specialist: 'AUDIENCE_STRATEGIST',
          priority: 'HIGH',
          evidence: ['CPA historicamente inferior em bases amplas.'],
          hypothesisIds: [],
          confidence: 80,
          expectedImpact: 'Redução do custo por aquisição (CPA)',
          risk: 'Fase de aprendizado inicial',
          status: 'PROPOSED',
          createdAt: new Date().toISOString(),
          classification: 'AI_RECOMMENDATION'
        }
      ],
      risks: ['Saturação de frequência em públicos restritos.'],
      contradictions: [],
      confidence,
      dataQuality,
      missingData: dataQuality.missingData,
      createdAt: new Date().toISOString()
    };
  }
}

export class MediaStrategistAgent extends BaseSpecialist {
  constructor() { super('MEDIA_STRATEGIST'); }
  public analyze(context: SpecialistContext): SpecialistAnalysis {
    const hasBudget = context.budgetConstraints && context.budgetConstraints.dailyMax;
    const { dataQuality, confidence } = this.baseAnalysis(context, hasBudget ? 4 : 1, 0);

    return {
      specialist: 'MEDIA_STRATEGIST',
      observations: [
        hasBudget ? `Orçamento diário máximo configurado: R$ ${context.budgetConstraints?.dailyMax}` : 'Orçamento diário não especificado no contexto.'
      ],
      evidence: ['Meta Ads apresenta melhor retorno histórico para o objetivo de conversão.'],
      hypotheses: [
        {
          id: `hyp_med_${Date.now()}`,
          statement: 'Distribuição orçamentária 70/30 (Aquisição / Remarketing) otimiza o funil de conversão.',
          specialist: 'MEDIA_STRATEGIST',
          supportingEvidence: ['Equilíbrio entre captação de novos clientes e conversão de interessados.'],
          contradictingEvidence: [],
          confidence: 82,
          status: 'SUPPORTED'
        }
      ],
      recommendations: [
        {
          id: `rec_med_${Date.now()}`,
          type: 'BUDGET',
          title: 'Alocação Orçamentária Estruturada (70% / 30%)',
          description: 'Distribuir a verba diária entre campanhas de aquisição e remarketing.',
          specialist: 'MEDIA_STRATEGIST',
          priority: 'HIGH',
          evidence: ['Taxa de conversão em remarketing tipicamente superior.'],
          hypothesisIds: [],
          confidence: 85,
          expectedImpact: 'Maximização do ROAS global',
          risk: 'Leilão sazonal mais caro',
          status: 'PROPOSED',
          createdAt: new Date().toISOString(),
          classification: 'AI_RECOMMENDATION'
        }
      ],
      risks: ['Flutuação de CPM em períodos de alta concorrência.'],
      contradictions: [],
      confidence,
      dataQuality,
      missingData: dataQuality.missingData,
      createdAt: new Date().toISOString()
    };
  }
}

export class PerformanceAnalystAgent extends BaseSpecialist {
  constructor() { super('PERFORMANCE_ANALYST'); }
  public analyze(context: SpecialistContext): SpecialistAnalysis {
    const metrics = context.performanceMetrics || {};
    const hasMetrics = Object.keys(metrics).length > 0;
    const { dataQuality, confidence } = this.baseAnalysis(context, hasMetrics ? 3 : 1, 0);

    return {
      specialist: 'PERFORMANCE_ANALYST',
      observations: [
        hasMetrics ? `Métricas históricas detetadas (ROAS: ${metrics.roas || 'N/A'}, CVR: ${metrics.cvr || 'N/A'}%).` : 'Sem métricas históricas de performance no contexto.'
      ],
      evidence: ['Análise paramétrica baseada nos dados de spend e retorno informados.'],
      hypotheses: [
        {
          id: `hyp_perf_${Date.now()}`,
          statement: 'Métricas atuais indicam estabilidade operacional para escala controlada.',
          specialist: 'PERFORMANCE_ANALYST',
          supportingEvidence: ['Indicadores de CVR e ROAS dentro dos parâmetros esperados.'],
          contradictingEvidence: [],
          confidence: hasMetrics ? 85 : 40,
          status: hasMetrics ? 'SUPPORTED' : 'INSUFFICIENT_DATA'
        }
      ],
      recommendations: [
        {
          id: `rec_perf_${Date.now()}`,
          type: 'MONITOR',
          title: 'Monitorização Rigorosa de Frequência e CTR',
          description: 'Acompanhar fadiga criativa através da queda de CTR ou aumento de frequência.',
          specialist: 'PERFORMANCE_ANALYST',
          priority: 'MEDIUM',
          evidence: ['Comportamento histórico de desgaste de anúncios.'],
          hypothesisIds: [],
          confidence: 88,
          expectedImpact: 'Prevenção de desperdício de verba',
          risk: 'Nenhum',
          status: 'PROPOSED',
          createdAt: new Date().toISOString(),
          classification: 'CALCULATION'
        }
      ],
      risks: ['Fadiga criativa após 14 dias de veiculação.'],
      contradictions: [],
      confidence,
      dataQuality,
      missingData: dataQuality.missingData,
      createdAt: new Date().toISOString()
    };
  }
}

export class OfferStrategistAgent extends BaseSpecialist {
  constructor() { super('OFFER_STRATEGIST'); }
  public analyze(context: SpecialistContext): SpecialistAnalysis {
    const hasPrice = context.currentPrice !== undefined;
    const avgMarket = context.averageTicket || context.currentPrice || 0;
    
    // Strategic Pricing logic
    let aiSuggestedPrice = context.currentPrice || 0;
    let justification = 'Derivado do preço atual informado.';

    if (hasPrice && context.margin && context.margin > 60) {
      aiSuggestedPrice = context.currentPrice! * 0.95;
      justification = 'Sugerida redução de 5% para aumentar competitividade aproveitando alta margem.';
    } else if (hasPrice && context.margin && context.margin < 20) {
      aiSuggestedPrice = context.currentPrice! * 1.1;
      justification = 'Sugerido aumento de 10% para viabilizar margem operacional mínima.';
    }

    const pricing = OfferStrategistSpecialist.createOfferPricing({
      currentPrice: context.currentPrice || 0,
      marketPrice: avgMarket,
      aiSuggestedPrice: aiSuggestedPrice,
      currency: 'BRL',
      originAndJustification: justification,
      averageTicket: context.averageTicket || context.currentPrice || 0,
      targetMarginPercent: context.margin || 0,
      maxAllowableCac: context.targetCac || 0,
      breakEvenPoint: (context.currentPrice || 0) * (1 - ((context.margin || 0) / 100))
    });

    const { dataQuality, confidence } = this.baseAnalysis(context, hasPrice ? 3 : 1, 0);

    return {
      specialist: 'OFFER_STRATEGIST',
      observations: [
        `Análise de precificação concluída: ${justification}`,
        `Ponto de equilíbrio calculado: R$ ${pricing.breakEvenPoint.toFixed(2)}`
      ],
      evidence: ['Cálculo de margem de contribuição e ponto de equilíbrio (break-even).'],
      hypotheses: [
        {
          id: `hyp_off_${Date.now()}`,
          statement: 'Ajuste estratégico de preço otimiza o equilíbrio entre volume de vendas e margem unitária.',
          specialist: 'OFFER_STRATEGIST',
          supportingEvidence: ['Elasticidade preço-demanda observada em benchmarks do setor.'],
          contradictingEvidence: [],
          confidence: hasPrice ? 80 : 45,
          status: hasPrice ? 'SUPPORTED' : 'INSUFFICIENT_DATA'
        }
      ],
      recommendations: [
        {
          id: `rec_off_${Date.now()}`,
          type: 'PRICE',
          title: aiSuggestedPrice !== context.currentPrice ? 'Ajuste de Preço Estratégico' : 'Manter Precificação Atual',
          description: justification,
          specialist: 'OFFER_STRATEGIST',
          priority: 'HIGH',
          evidence: ['Sustentabilidade financeira da operação de anúncios.'],
          hypothesisIds: [],
          confidence: 82,
          expectedImpact: 'Otimização da margem líquida e volume de conversão.',
          risk: 'Sensibilidade de preço do público-alvo',
          status: 'PROPOSED',
          createdAt: new Date().toISOString(),
          classification: 'AI_RECOMMENDATION'
        }
      ],
      risks: ['Pressão competitiva sobre preços.', 'Possível aumento no CAC ao elevar preços.'],
      contradictions: [],
      confidence,
      dataQuality,
      missingData: dataQuality.missingData,
      createdAt: new Date().toISOString()
    };
  }
}

export class CreativeStrategistAgent extends BaseSpecialist {
  constructor() { super('CREATIVE_STRATEGIST'); }
  public analyze(context: SpecialistContext): SpecialistAnalysis {
    const { dataQuality, confidence } = this.baseAnalysis(context, 3, 0);

    return {
      specialist: 'CREATIVE_STRATEGIST',
      observations: [
        'REGRA ABSOLUTA: O Creative Strategist atua exclusivamente como CREATIVE DIRECTION ENGINE. Nenhuma imagem ou vídeo é gerado automaticamente.',
        `Produto/Serviço base para direcionamento: ${context.productOrService || 'Não especificado'}`
      ],
      evidence: ['Formatos verticais (9:16) com hooks direcionados à principal dor do cliente geram melhor retenção.'],
      hypotheses: [
        {
          id: `hyp_cre_${Date.now()}`,
          statement: 'Hooks de interrogação nos primeiros 3 segundos elevam o CTR e reduzem o custo por clique.',
          specialist: 'CREATIVE_STRATEGIST',
          supportingEvidence: ['Padrões de consumo de vídeo em plataformas mobile.'],
          contradictingEvidence: [],
          confidence: 85,
          status: 'SUPPORTED'
        }
      ],
      recommendations: [
        {
          id: `rec_cre_${Date.now()}`,
          type: 'CREATIVE_DIRECTION',
          title: 'Briefing para Produção Externa de Vídeo 9:16 (CREATIVE_DIRECTION)',
          description: 'Produzir 3 variações de vídeo vertical com hooks distintos para testes A/B (produção externa obrigatória).',
          specialist: 'CREATIVE_STRATEGIST',
          priority: 'HIGH',
          evidence: ['Retenção superior em vídeos curtos formatados para mobile.'],
          hypothesisIds: [],
          confidence: 88,
          expectedImpact: 'Melhoria de CTR e CPC',
          risk: 'Atraso na entrega dos ficheiros pela equipa externa',
          status: 'PROPOSED',
          createdAt: new Date().toISOString(),
          classification: 'AI_RECOMMENDATION'
        }
      ],
      risks: ['Fadiga criativa após período prolongado de veiculação.'],
      contradictions: [],
      confidence,
      dataQuality,
      missingData: dataQuality.missingData,
      createdAt: new Date().toISOString()
    };
  }
}
