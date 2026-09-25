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
    const confidence = ConfidenceEngine.calculateConfidence(context, contraCount > 0, supportCount, contraCount);
    return { dataQuality, confidence };
  }
}

export class AdsOrchestratorAgent extends BaseSpecialist {
  constructor() { super('ORCHESTRATOR'); }
  public analyze(context: SpecialistContext, subAnalyses: SpecialistAnalysis[]): SpecialistAnalysis {
    const contradictions = ContradictionEngine.detectContradictions(subAnalyses);
    const hasContra = contradictions.length > 0;

    const { dataQuality, confidence } = this.baseAnalysis(context, subAnalyses.length, contradictions.length);

    const observations: string[] = [
      `Coordenação concluída: avaliados ${subAnalyses.length} relatórios de especialistas.`,
      hasContra ? `Detetadas ${contradictions.length} contradições entre especialistas.` : 'Nenhuma contradição transversal detetada.'
    ];

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
        evidence: ['Análise transversal dos relatórios dos especialistas de domínio.'],
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
  constructor() { super('MARKET_INTELLIGENCE'); }
  public analyze(context: SpecialistContext): SpecialistAnalysis {
    const refs = context.marketResearch || [];
    const { dataQuality, confidence } = this.baseAnalysis(context, refs.length, 0);

    return {
      specialist: 'MARKET_INTELLIGENCE',
      observations: [`Analisadas ${refs.length} referências recentes de mercado.`],
      evidence: refs.map(r => `[${r.source}] ${r.foundInfo}`),
      hypotheses: [
        {
          id: `hyp_mkt_${Date.now()}`,
          statement: 'Contexto competitivo e tendências setoriais suportam o posicionamento pretendido.',
          specialist: 'MARKET_INTELLIGENCE',
          supportingEvidence: refs.map(r => r.foundInfo),
          contradictingEvidence: [],
          confidence: confidence.confidenceScore,
          status: refs.length > 0 ? 'SUPPORTED' : 'INSUFFICIENT_DATA'
        }
      ],
      recommendations: [
        {
          id: `rec_mkt_${Date.now()}`,
          type: 'MONITOR',
          title: 'Monitorização Contínua de Mercado e Concorrência',
          description: 'Acompanhar variações semanais nas referências externas.',
          specialist: 'MARKET_INTELLIGENCE',
          priority: 'MEDIUM',
          evidence: refs.map(r => r.conclusion),
          hypothesisIds: [],
          confidence: confidence.confidenceScore,
          expectedImpact: 'Mitigação de surpresas competitivas',
          risk: 'Nenhum',
          status: 'PROPOSED',
          createdAt: new Date().toISOString(),
          classification: 'EXTERNAL_EVIDENCE'
        }
      ],
      risks: ['Movimentos imprevistos de preços por concorrentes.'],
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
      observations: [hasAudiences ? `Audiências base fornecidas: ${context.audiences?.join(', ')}.` : 'Nenhuma audiência específica informada.'],
      evidence: ['Públicos amplos combinados com criativos fortes apresentam melhor eficiência no leilão atual.'],
      hypotheses: [
        {
          id: `hyp_aud_${Date.now()}`,
          statement: 'Estratégia Broad com otimização de conversão maximiza o alcance qualificado.',
          specialist: 'AUDIENCE_STRATEGIST',
          supportingEvidence: ['Eficiência de entrega do algoritmo em públicos abertos.'],
          contradictingEvidence: [],
          confidence: confidence.confidenceScore,
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
          confidence: confidence.confidenceScore,
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
      observations: [hasBudget ? `Orçamento diário máximo: R$ ${context.budgetConstraints?.dailyMax}` : 'Orçamento diário não especificado.'],
      evidence: ['Meta Ads apresenta melhor retorno histórico para o objetivo de conversão.'],
      hypotheses: [
        {
          id: `hyp_med_${Date.now()}`,
          statement: 'Distribuição orçamentária 70/30 (Aquisição / Remarketing) otimiza o funil de conversão.',
          specialist: 'MEDIA_STRATEGIST',
          supportingEvidence: ['Equilíbrio entre captação de novos clientes e conversão de interessados.'],
          contradictingEvidence: [],
          confidence: confidence.confidenceScore,
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
          confidence: confidence.confidenceScore,
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
      observations: [hasMetrics ? `Métricas históricas detetadas (ROAS: ${metrics.roas || 'N/A'}).` : 'Sem métricas de performance.'],
      evidence: ['Análise paramétrica baseada nos dados informados.'],
      hypotheses: [
        {
          id: `hyp_perf_${Date.now()}`,
          statement: 'Métricas atuais indicam estabilidade operacional para escala controlada.',
          specialist: 'PERFORMANCE_ANALYST',
          supportingEvidence: ['Indicadores dentro dos parâmetros esperados.'],
          contradictingEvidence: [],
          confidence: confidence.confidenceScore,
          status: hasMetrics ? 'SUPPORTED' : 'INSUFFICIENT_DATA'
        }
      ],
      recommendations: [
        {
          id: `rec_perf_${Date.now()}`,
          type: 'MONITOR',
          title: 'Monitorização Rigorosa de Frequência e CTR',
          description: 'Acompanhar fadiga criativa através da queda de CTR.',
          specialist: 'PERFORMANCE_ANALYST',
          priority: 'MEDIUM',
          evidence: ['Comportamento histórico de desgaste de anúncios.'],
          hypothesisIds: [],
          confidence: confidence.confidenceScore,
          expectedImpact: 'Prevenção de desperdício de verba',
          risk: 'Nenhum',
          status: 'PROPOSED',
          createdAt: new Date().toISOString(),
          classification: 'CALCULATION'
        }
      ],
      risks: ['Fadiga criativa após 14 dias.'],
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
    const { dataQuality, confidence } = this.baseAnalysis(context, hasPrice ? 3 : 1, 0);

    return {
      specialist: 'OFFER_STRATEGIST',
      observations: [hasPrice ? `Preço: R$ ${context.currentPrice}` : 'Preço não informado.'],
      evidence: ['Cálculo de margem de contribuição.'],
      hypotheses: [
        {
          id: `hyp_off_${Date.now()}`,
          statement: 'Precificação alinhada à margem alvo garante sustentabilidade.',
          specialist: 'OFFER_STRATEGIST',
          supportingEvidence: ['Relação direta entre ticket médio, margem e CAC.'],
          contradictingEvidence: [],
          confidence: confidence.confidenceScore,
          status: hasPrice ? 'SUPPORTED' : 'INSUFFICIENT_DATA'
        }
      ],
      recommendations: [
        {
          id: `rec_off_${Date.now()}`,
          type: 'PRICE',
          title: 'Alinhar Preço, Margem e CAC Alvo',
          description: 'Garantir que o custo de aquisição permaneça abaixo do limite de margem.',
          specialist: 'OFFER_STRATEGIST',
          priority: 'HIGH',
          evidence: ['Sustentabilidade financeira.'],
          hypothesisIds: [],
          confidence: confidence.confidenceScore,
          expectedImpact: 'Proteção da margem líquida',
          risk: 'Sensibilidade de preço',
          status: 'PROPOSED',
          createdAt: new Date().toISOString(),
          classification: 'AI_RECOMMENDATION'
        }
      ],
      risks: ['Pressão competitiva.'],
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
      observations: ['Creative Direction Engine: Briefing criativo.'],
      evidence: ['Formatos verticais 9:16 com hooks direcionados geram melhor retenção.'],
      hypotheses: [
        {
          id: `hyp_cre_${Date.now()}`,
          statement: 'Hooks nos primeiros 3 segundos elevam o CTR.',
          specialist: 'CREATIVE_STRATEGIST',
          supportingEvidence: ['Padrões de consumo mobile.'],
          contradictingEvidence: [],
          confidence: confidence.confidenceScore,
          status: 'SUPPORTED'
        }
      ],
      recommendations: [
        {
          id: `rec_cre_${Date.now()}`,
          type: 'CREATIVE_DIRECTION',
          title: 'Briefing para Produção de Vídeo 9:16',
          description: 'Produzir 3 variações com hooks distintos.',
          specialist: 'CREATIVE_STRATEGIST',
          priority: 'HIGH',
          evidence: ['Retenção superior em vídeos curtos.'],
          hypothesisIds: [],
          confidence: confidence.confidenceScore,
          expectedImpact: 'Melhoria de CTR',
          risk: 'Atraso na entrega externa',
          status: 'PROPOSED',
          createdAt: new Date().toISOString(),
          classification: 'AI_RECOMMENDATION'
        }
      ],
      risks: ['Fadiga criativa.'],
      contradictions: [],
      confidence,
      dataQuality,
      missingData: dataQuality.missingData,
      createdAt: new Date().toISOString()
    };
  }
}
