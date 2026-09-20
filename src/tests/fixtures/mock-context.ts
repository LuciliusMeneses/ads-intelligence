/**
 * ADS INTELLIGENCE — Test Fixtures & Mock Data
 * ISOLATED: Mocks are strictly for test and demo fixtures. Zero production code imports this file.
 */

import { SpecialistContext } from '../../types/intelligence';

export const TEST_FIXTURE_CONTEXT: SpecialistContext = {
  brand: 'Acme Growth Corp',
  productOrService: 'Software de Automação de Vendas B2B',
  businessObjective: 'Escalar receita recorrente com CAC sustentável',
  campaignObjective: 'CONVERSIONS',
  currentPrice: 197,
  margin: 65,
  averageTicket: 197,
  targetCac: 45,
  performanceMetrics: {
    spend: 15000,
    roas: 4.2,
    ctr: 1.8,
    cpc: 2.10,
    cpa: 42.00,
    cvr: 2.4
  },
  audiences: ['Empreendedores B2B', 'Gestores de Tráfego'],
  geography: ['Brasil (Sudeste e Sul)'],
  landingDestination: 'https://acmegrowth.com/oferta',
  budgetConstraints: {
    dailyMax: 600,
    totalBudget: 18000
  },
  marketResearch: [
    {
      id: 'ref_1',
      source: 'Meta Ads Library',
      date: '2026-09-10',
      urlOrRef: 'https://facebook.com/ads/library/?id=1',
      foundInfo: 'Concorrente A escalou 12 criativos em vídeo 9:16 com hook de dor direta.',
      relevance: 'HIGH',
      conclusion: 'Formato vertical é dominante no setor.',
      confidenceLevel: 95,
      isSimulated: false
    },
    {
      id: 'ref_2',
      source: 'Google Trends API',
      date: '2026-09-11',
      urlOrRef: 'https://trends.google.com',
      foundInfo: 'Busca pelo termo principal subiu 34% em SP e RJ.',
      relevance: 'HIGH',
      conclusion: 'Demanda aquecida no Sudeste.',
      confidenceLevel: 90,
      isSimulated: false
    },
    {
      id: 'ref_3',
      source: 'Relatório Setorial E-commerce',
      date: '2026-09-01',
      urlOrRef: 'https://setor.com/relatorio',
      foundInfo: 'Ticket médio no nicho estabilizou em R$ 220,00 com frete grátis.',
      relevance: 'MEDIUM',
      conclusion: 'Preço atual está competitivo.',
      confidenceLevel: 85,
      isSimulated: false
    },
    {
      id: 'ref_4',
      source: 'SimilarWeb Intelligence',
      date: '2026-09-08',
      urlOrRef: 'https://similarweb.com/competitor',
      foundInfo: 'Tráfego orgânico caiu 8% no principal concorrente; investimento em mídia paga cresceu.',
      relevance: 'MEDIUM',
      conclusion: 'Concorrentes migrando para tráfego pago.',
      confidenceLevel: 80,
      isSimulated: false
    },
    {
      id: 'ref_5',
      source: 'ReclameAqui Insights',
      date: '2026-09-05',
      urlOrRef: 'https://reclameaquibr.com',
      foundInfo: 'Principais fricções dos clientes giram em torno de prazo de entrega.',
      relevance: 'HIGH',
      conclusion: 'Ressaltar agilidade na entrega na copy.',
      confidenceLevel: 92,
      isSimulated: false
    }
  ]
};

export const INSUFFICIENT_TEST_CONTEXT: SpecialistContext = {
  brand: 'Incomplete Startup'
};
