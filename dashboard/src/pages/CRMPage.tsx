/**
 * ADS INTELLIGENCE Pages - CRMPage
 * Precision Ads Console inspired design
 */
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { DataTable, Column, Pagination } from '../components/ui/DataTable';
import { MetricGrid } from '../components/metrics/MetricCard';
import { colors, spacing, typography } from '../styles/tokens';
import { demoData } from '../demo/demoData';

interface CRMRow {
  id: string;
  lead: string;
  source: string;
  campaign: string;
  gclid: string;
  stage: 'Lead' | 'MQL' | 'SQL' | 'Cliente';
  value: string;
  propensity: string;
  date: string;
  attribution: string;
}

const mockCRMData: CRMRow[] = [
  { id: '1', lead: 'lead_9482a', source: 'Google Ads', campaign: '[Scale] Performance Max - B2B SaaS', gclid: 'Cj0KCQjw...AI', stage: 'Cliente', value: 'R$ 15.000', propensity: '94%', date: '19/09/2026', attribution: 'Google Ads (DDA)' },
  { id: '2', lead: 'lead_3821b', source: 'Meta Ads', campaign: '[Retargeting] VSL & Casos de Sucesso', gclid: 'fb_px_88...2', stage: 'SQL', value: 'R$ 8.500', propensity: '88%', date: '19/09/2026', attribution: 'Meta Retargeting' },
  { id: '3', lead: 'lead_1029c', source: 'Google Ads', campaign: '[Scale] Performance Max - B2B SaaS', gclid: 'Cj0KCQjw...BB', stage: 'MQL', value: 'R$ 5.000', propensity: '72%', date: '18/09/2026', attribution: 'Google Search' },
  { id: '4', lead: 'lead_5541d', source: 'TikTok', campaign: '[Topo] Vídeos Curtos - Reels Discovery', gclid: 'tt_ck_11...9', stage: 'Lead', value: 'R$ 2.500', propensity: '45%', date: '18/09/2026', attribution: 'TikTok Ads' },
];

export const CRMPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const metrics = [
    { label: 'Leads Totais', value: demoData.crm.metrics.leads, trend: { value: '+12.4%', isPositive: true }, confidence: 98 },
    { label: 'MQLs', value: demoData.crm.metrics.mql, trend: { value: '+8.1%', isPositive: true }, confidence: 95 },
    { label: 'SQLs', value: demoData.crm.metrics.sql, trend: { value: '+15.3%', isPositive: true }, confidence: 91 },
    { label: 'Receita Atribuída', value: demoData.crm.metrics.revenue, trend: { value: '+22.4%', isPositive: true }, confidence: 96 },
  ];

  const columns: Column<CRMRow>[] = [
    { key: 'lead', header: 'Lead / ID', width: '120px', render: (row) => <span className="font-mono text-xs font-semibold text-gray-900">{row.lead}</span> },
    { key: 'source', header: 'Origem', width: '110px', render: (row) => <Badge variant="secondary" size="sm">{row.source}</Badge> },
    { key: 'campaign', header: 'Campanha de Atribuição', minWidth: '260px', sticky: true, render: (row) => <span className="font-medium text-gray-900">{row.campaign}</span> },
    { key: 'stage', header: 'Estágio', width: '100px', render: (row) => (
      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${row.stage === 'Cliente' ? 'bg-green-100 text-green-800' : row.stage === 'SQL' ? 'bg-blue-100 text-blue-800' : row.stage === 'MQL' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'}`}>
        {row.stage}
      </span>
    )},
    { key: 'value', header: 'Valor Potencial', width: '120px', align: 'right', render: (row) => <span className="tabular-nums font-medium text-gray-900">{row.value}</span> },
    { key: 'propensity', header: 'Propensity', width: '90px', align: 'center', render: (row) => <span className="tabular-nums text-gray-600">{row.propensity}</span> },
    { key: 'attribution', header: 'Modelo Atribuição', width: '140px', render: (row) => <span className="text-gray-500 text-xs">{row.attribution}</span> },
    { key: 'date', header: 'Data', width: '100px', align: 'center', render: (row) => <span className="text-gray-500 text-xs">{row.date}</span> },
  ];

  return (
    <div className="space-y-8" style={{ fontFamily: typography.fontFamily.sans.join(', ') }}>
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b" style={{ borderColor: colors.border }}>
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontSize: typography.fontSize['3xl'][0] }}>CRM & Conversões</h1>
          <p className="text-gray-500 mt-1" style={{ fontSize: typography.fontSize.base[0] }}>Análise do funil de conversão, atribuição de leads e correspondência offline.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outlined" size="md">Medição & Atribuição: 99,8%</Badge>
        </div>
      </div>

      {/* Demo Mode Indicator */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-gray-500" style={{ backgroundColor: colors.surfaceHover, border: `1px solid ${colors.border}` }}>
        <span className="material-symbols-outlined text-base">science</span>
        <span>Modo demonstração — dados simulados</span>
      </div>

      {/* KPI Metrics */}
      <MetricGrid metrics={metrics} columns={4} />

      {/* Attribution Journey Visual */}
      <Card variant="outlined">
        <CardHeader>
          <CardTitle>Jornada de Atribuição Baseada em Dados (Simulação)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center py-4">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
              <span className="text-xs font-semibold text-blue-600 uppercase">1. Descoberta</span>
              <p className="text-lg font-bold text-gray-900 mt-1">Google Search</p>
              <span className="text-xs text-gray-500">45% primeira interação</span>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <span className="text-xs font-semibold text-gray-600 uppercase">2. Consideração</span>
              <p className="text-lg font-bold text-gray-900 mt-1">Meta Retargeting</p>
              <span className="text-xs text-gray-500">30% interações médias</span>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <span className="text-xs font-semibold text-gray-600 uppercase">3. Conversão</span>
              <p className="text-lg font-bold text-gray-900 mt-1">Landing Page VSL</p>
              <span className="text-xs text-gray-500">Formulário preenchido</span>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <span className="text-xs font-semibold text-gray-600 uppercase">4. Qualificação</span>
              <p className="text-lg font-bold text-gray-900 mt-1">SDR / MQL</p>
              <span className="text-xs text-gray-500">Score &gt; 80</span>
            </div>
            <div className="p-4 rounded-lg bg-green-50 border border-green-100">
              <span className="text-xs font-semibold text-green-600 uppercase">5. Fechamento</span>
              <p className="text-lg font-bold text-gray-900 mt-1">Negócio Ganho</p>
              <span className="text-xs text-green-700">R$ 15.000 atribuídos</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CRM Data Table */}
      <Card variant="outlined">
        <CardHeader>
          <CardTitle>Leads e Oportunidades Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={mockCRMData}
            keyExtractor={(row) => row.id}
            rowHeight="normal"
            stickyHeader
          />
        </CardContent>
        <CardFooter className="border-t" style={{ borderColor: colors.border }}>
          <Pagination
            currentPage={currentPage}
            totalPages={1}
            totalItems={mockCRMData.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </CardFooter>
      </Card>
    </div>
  );
};
