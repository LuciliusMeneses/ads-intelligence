export const demoData = {
  overview: {
    metrics: [
      { label: 'Custo Total', value: 'R$ 148.920', trend: { value: '+14.2%', isPositive: true }, sparklineColor: 'success' as const, confidence: 95 },
      { label: 'Conversões', value: '4.890', trend: { value: '+5.1%', isPositive: true }, sparklineColor: 'primary' as const, confidence: 92 },
      { label: 'CPA Médio', value: 'R$ 30,45', trend: { value: '-2.3%', isPositive: true }, sparklineColor: 'warning' as const, confidence: 88 },
      { label: 'ROAS', value: '4,92x', trend: { value: '+0.8x', isPositive: true }, sparklineColor: 'success' as const, confidence: 96 },
    ],
    optimizationScore: 94.8,
  },
  campaigns: {
    metrics: [
        { label: 'Campanhas Ativas', value: '3', trend: { value: 'de 5 total', isPositive: true }, confidence: 100 },
        { label: 'Investimento Total', value: 'R$ 148.920', trend: { value: '+14.2% vs mês ant.', isPositive: true }, confidence: 95 },
        { label: 'CPA Misto', value: 'R$ 30,45', trend: { value: 'Meta: R$ 35', isPositive: true }, confidence: 88 },
        { label: 'ROAS Global', value: '4.92x', trend: { value: 'Meta: 4.0x', isPositive: true }, confidence: 92 },
    ]
  },
  crm: {
    metrics: {
        leads: '12.450',
        mql: '4.890',
        sql: '1.240',
        conversions: '450',
        revenue: 'R$ 732.686',
        cpa: 'R$ 30,45'
    }
  },
  competitors: {
      metrics: {
          shareOfVoice: '32,4%',
          competitorsMonitored: 8
      }
  }
};
