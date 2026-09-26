/**
 * ADS INTELLIGENCE Pages - CompetitorsPage
 * Precision Ads Console inspired design
 */
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DataTable, Column, Pagination } from '../components/ui/DataTable';
import { MetricGrid } from '../components/metrics/MetricCard';
import { colors, spacing, typography } from '../styles/tokens';
import { demoData } from '../demo/demoData';

interface CompetitorRow {
  id: string;
  competitor: string;
  impressionShare: string;
  overlapRate: string;
  positionAboveRate: string;
  outrankingShare: string;
  topOfPageRate: string;
  trend: 'up' | 'down' | 'stable';
  evidenceLevel: 'FACT' | 'OBSERVATION' | 'ASSUMPTION';
}

const mockCompetitors: CompetitorRow[] = [
  { id: '1', competitor: 'Concorrente Demo A', impressionShare: '32,4%', overlapRate: '48.2%', positionAboveRate: '22.1%', outrankingShare: '65.4%', topOfPageRate: '88.5%', trend: 'up', evidenceLevel: 'FACT' },
  { id: '2', competitor: 'Concorrente Demo B', impressionShare: '24.1%', overlapRate: '35.0%', positionAboveRate: '18.4%', outrankingShare: '58.2%', topOfPageRate: '75.2%', trend: 'stable', evidenceLevel: 'FACT' },
  { id: '3', competitor: 'Concorrente Demo C', impressionShare: '15.8%', overlapRate: '21.5%', positionAboveRate: '12.0%', outrankingShare: '42.1%', topOfPageRate: '62.0%', trend: 'down', evidenceLevel: 'OBSERVATION' },
  { id: '4', competitor: 'Concorrente Demo D', impressionShare: '8.2%', overlapRate: '14.2%', positionAboveRate: '5.3%', outrankingShare: '28.5%', topOfPageRate: '45.0%', trend: 'stable', evidenceLevel: 'ASSUMPTION' },
];

export const CompetitorsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const metrics = [
    { label: 'Parcela de Impressões (SoV)', value: demoData.competitors.metrics.shareOfVoice, trend: { value: '+3.2%', isPositive: true }, confidence: 94 },
    { label: 'Concorrentes Monitorados', value: `${demoData.competitors.metrics.competitorsMonitored} ativos`, trend: { value: 'Varredura ativa', isPositive: true }, confidence: 99 },
    { label: 'Taxa Média de Sobreposição', value: '29.7%', trend: { value: '-1.4%', isPositive: true }, confidence: 91 },
    { label: 'Índice de Superação', value: '48.5%', trend: { value: '+5.8%', isPositive: true }, confidence: 93 },
  ];

  const columns: Column<CompetitorRow>[] = [
    { key: 'competitor', header: 'Concorrente / Leilão', minWidth: '220px', sticky: true, render: (row) => (
      <div className=\"flex flex-col\">\n        <span className=\"font-semibold text-gray-900\">{row.competitor}</span>
        <div className=\"flex gap-1 mt-1\">
           <Badge size=\"xs\" variant=\"outlined\" className={
             row.evidenceLevel === 'FACT' ? 'border-green-200 text-green-700' : 
             row.evidenceLevel === 'OBSERVATION' ? 'border-blue-200 text-blue-700' : 'border-amber-200 text-amber-700'
           }>{row.evidenceLevel}</Badge>
        </div>
      </div>
    ) },
    { key: 'impressionShare', header: 'Parcela de Impressões', width: '150px', align: 'right', render: (row) => <span className=\"tabular-nums font-medium text-gray-900\">{row.impressionShare}</span> },
    { key: 'overlapRate', header: 'Taxa Sobreposição', width: '130px', align: 'right', render: (row) => <span className=\"tabular-nums text-gray-600\">{row.overlapRate}</span> },
    { key: 'positionAboveRate', header: 'Posição Superior', width: '130px', align: 'right', render: (row) => <span className=\"tabular-nums text-gray-600\">{row.positionAboveRate}</span> },
    { key: 'outrankingShare', header: 'Parcela Superação', width: '130px', align: 'right', render: (row) => <span className=\"tabular-nums text-gray-600\">{row.outrankingShare}</span> },
    { key: 'topOfPageRate', header: 'Top of Page Rate', width: '130px', align: 'right', render: (row) => <span className=\"tabular-nums text-gray-600\">{row.topOfPageRate}</span> },
    { key: 'trend', header: 'Tendência', width: '100px', align: 'center', render: (row) => (\n      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${row.trend === 'up' ? 'bg-green-100 text-green-800' : row.trend === 'down' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>\n        <span className=\"material-symbols-outlined text-xs\">{row.trend === 'up' ? 'trending_up' : row.trend === 'down' ? 'trending_down' : 'remove'}</span>\n        {row.trend === 'up' ? 'Alta' : row.trend === 'down' ? 'Queda' : 'Estável'}\n      </span>\n    )},\n  ];

  return (
    <div className=\"space-y-8\" style={{ fontFamily: typography.fontFamily.sans.join(', ') }}>
      {/* Page Header */}
      <div className=\"flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b\" style={{ borderColor: colors.border }}>
        <div>
          <h1 className=\"text-3xl font-bold text-gray-900\" style={{ fontSize: typography.fontSize['3xl'][0] }}>Radar de Concorrentes</h1>
          <p className=\"text-gray-500 mt-1\" style={{ fontSize: typography.fontSize.base[0] }}>Monitoramento competitivo baseado em evidências (Evidence-Aware Architecture).</p>
        </div>
        <div className=\"flex items-center gap-3\">\n          <Badge variant=\"outlined\" size=\"md\">Varredura: Há 15 min</Badge>\n        </div>
      </div>

      {/* Demo Mode Indicator */}
      <div className=\"flex items-center justify-between px-4 py-3 rounded-lg text-sm bg-gray-50 border border-gray-200\">\n        <div className=\"flex items-center gap-2 text-gray-500\">\n          <span className=\"material-symbols-outlined text-base\">science</span>\n          <span>Modo demonstração — dados simulados categorizados por nível de prova</span>\n        </div>\n      </div>

      {/* KPI Metrics */}
      <MetricGrid metrics={metrics} columns={4} />

      {/* Competitive Alerts Card */}
      <Card variant=\"outlined\">
        <CardHeader>
          <CardTitle>Alertas de Movimentação Competitiva</CardTitle>
        </CardHeader>
        <CardContent className=\"space-y-3 p-4\">
          <div className=\"flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200\">
            <span className=\"material-symbols-outlined text-amber-700 mt-0.5\">warning</span>
            <div className=\"flex-1\">
              <div className=\"flex justify-between\">\n                <h4 className=\"text-sm font-semibold text-amber-900\">Concorrente Demo A aumentou presença em termos de alta intenção</h4>\n                <Badge size=\"xs\" className=\"bg-green-100 text-green-800\">FACT</Badge>\n              </div>
              <p className=\"text-xs text-amber-700 mt-0.5\">Aumento de 8.2% na taxa de sobreposição nas campanhas de Search B2B. Evidência direta de Auction Insights.</p>
            </div>
          </div>
          <div className=\"flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200\">
            <span className=\"material-symbols-outlined text-blue-700 mt-0.5\">info</span>
            <div className=\"flex-1\">
              <div className=\"flex justify-between\">\n                <h4 className=\"text-sm font-semibold text-blue-900\">Oportunidade de expansão em parcela superior</h4>\n                <Badge size=\"xs\" className=\"bg-blue-100 text-blue-800\">OBSERVATION</Badge>\n              </div>
              <p className=\"text-xs text-blue-700 mt-0.5\">Sua taxa de 'Top of Page' atingiu 88.5%. Observação baseada em tendências de lances das últimas 24h.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auction Insights Table */}
      <Card variant=\"outlined\">
        <CardHeader>
          <CardTitle>Informações do Leilão (Auction Insights)</CardTitle>
        </CardHeader>
        <CardContent className=\"p-0\">
          <DataTable
            columns={columns}
            data={mockCompetitors}
            keyExtractor={(row) => row.id}
            rowHeight=\"normal\"
            stickyHeader
          />
        </CardContent>
        <CardFooter className=\"border-t\" style={{ borderColor: colors.border }}>
          <Pagination
            currentPage={currentPage}
            totalPages={1}
            totalItems={mockCompetitors.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </CardFooter>
      </Card>
    </div>
  );\n};\n