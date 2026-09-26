/**
 * ADS INTELLIGENCE Pages - MarketPage
 * Evidence-aware market & competitor intelligence console.
 */
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DataTable, Column } from '../components/ui/DataTable';

interface MarketInsightRow {
  id: string;
  category: 'FACT' | 'OBSERVATION' | 'ASSUMPTION' | 'RECOMMENDATION' | 'UNKNOWN';
  statement: string;
  source: string;
  confidence: number;
  freshness: string;
}

const mockMarketData: MarketInsightRow[] = [
  { id: '1', category: 'FACT', statement: 'Crescimento de 14% no volume de buscas B2B no trimestre.', source: 'Google Trends / Relatório Setorial', confidence: 95, freshness: '2025-02-15' },
  { id: '2', category: 'OBSERVATION', statement: 'Sazonalidade de leilão elevada nas terças e quartas-feiras.', source: 'Meta Auction Analytics', confidence: 88, freshness: '2025-02-20' },
  { id: '3', category: 'ASSUMPTION', statement: 'Elasticidade de preço estimada em -1.2 para ticket médio.', source: 'Modelo Preditivo interno', confidence: 62, freshness: '2025-01-10' },
  { id: '4', category: 'UNKNOWN', statement: 'Impacto exato de novas regulamentações de privacidade em contas de retargeting.', source: 'Não verificado / Sem URL de suporte', confidence: 15, freshness: 'UNKNOWN' },
];

export const MarketPage: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredData = filterCategory === 'ALL' 
    ? mockMarketData 
    : mockMarketData.filter(d => d.category === filterCategory);

  const getCategoryBadge = (category: MarketInsightRow['category']) => {
    switch (category) {
      case 'FACT': return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-800">FACT</span>;
      case 'OBSERVATION': return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">OBSERVATION</span>;
      case 'ASSUMPTION': return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">ASSUMPTION</span>;
      case 'RECOMMENDATION': return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800">RECOMMENDATION</span>;
      case 'UNKNOWN': return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-200 text-gray-700">UNKNOWN</span>;
    }
  };

  const columns: Column<MarketInsightRow>[] = [
    { key: 'category', header: 'Categoria de Evidência', width: '150px', render: (row) => getCategoryBadge(row.category) },
    { key: 'statement', header: 'Declaração / Insight de Mercado', minWidth: '300px', render: (row) => <span className="font-medium text-gray-900">{row.statement}</span> },
    { key: 'source', header: 'Proveniência / Fonte', width: '220px', render: (row) => <span className="text-gray-600">{row.source}</span> },
    { key: 'confidence', header: 'Confiança', width: '110px', align: 'right', render: (row) => <span className="tabular-nums font-semibold text-gray-900">{row.confidence}%</span> },
    { key: 'freshness', header: 'Frescor', width: '120px', align: 'right', render: (row) => <span className="text-xs text-gray-500">{row.freshness}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inteligência de Mercado (Evidence-Aware)</h1>
          <p className="text-gray-500 mt-1">Classificação estrita de dados de mercado (FACT, OBSERVATION, ASSUMPTION, RECOMMENDATION, UNKNOWN).</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outlined" size="md">Human Approval: Required</Badge>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['ALL', 'FACT', 'OBSERVATION', 'ASSUMPTION', 'RECOMMENDATION', 'UNKNOWN'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filterCategory === cat ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <Card variant="outlined">
        <CardHeader>
          <CardTitle>Insights Estruturados de Mercado & Proveniência</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={filteredData}
            keyExtractor={(row) => row.id}
            rowHeight="normal"
          />
        </CardContent>
      </Card>
    </div>
  );
};
