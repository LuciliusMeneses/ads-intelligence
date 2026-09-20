/**
 * ADS INTELLIGENCE Pages - CampaignsPage
 * ADS INTELLIGENCE identity - Campaign Intelligence Workspace
 */
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { DataTable, Column, Pagination } from '../components/ui/DataTable';
import { MetricGrid } from '../components/metrics/MetricCard';
import { ConfidenceCircle } from '../components/confidence/ConfidenceIndicator';
import { ProvenanceBadge } from '../components/provenance/ProvenanceBadge';
import { colors, spacing, typography, brand } from '../styles/tokens';

interface CampaignRow {
  id: string;
  status: 'active' | 'scaling' | 'paused' | 'learning' | 'error';
  name: string;
  type: string;
  platform: string;
  objective: string;
  budget: string;
  spend: string;
  impressions: string;
  clicks: string;
  ctr: string;
  cpc: string;
  conversions: string;
  cpa: string;
  roas: string;
  lastUpdate: string;
  aiConfidence?: number;
  biddingStrategy?: string;
}

const mockCampaigns: CampaignRow[] = [
  { id: '1', status: 'scaling', name: '[Scale] Performance Max - B2B SaaS', type: 'PMAX', platform: 'Google Ads', objective: 'Conversões', budget: 'R$ 200/dia', spend: 'R$ 54.200', impressions: '1.2M', clicks: '46.080', ctr: '3.84%', cpc: 'R$ 1,18', conversions: '1.928', cpa: 'R$ 28,10', roas: '5.80x', lastUpdate: '2 min', aiConfidence: 94, biddingStrategy: 'Maximizar Conversões (tROAS 4.5x)' },
  { id: '2', status: 'active', name: '[Retargeting] VSL & Casos de Sucesso', type: 'Video', platform: 'Meta Ads', objective: 'Conversões', budget: 'R$ 150/dia', spend: 'R$ 41.350', impressions: '890K', clicks: '21.538', ctr: '2.42%', cpc: 'R$ 1,92', conversions: '1.260', cpa: 'R$ 32,80', roas: '4.65x', lastUpdate: '5 min', aiConfidence: 88, biddingStrategy: 'Maximizar Valor (tROAS 4.0x)' },
  { id: '3', status: 'learning', name: '[Topo] Vídeos Curtos - Reels Discovery', type: 'Reels', platform: 'Meta Ads', objective: 'Tráfego', budget: 'R$ 80/dia', spend: 'R$ 18.220', impressions: '2.1M', clicks: '24.150', ctr: '1.15%', cpc: 'R$ 0,75', conversions: '397', cpa: 'R$ 45,90', roas: '2.10x', lastUpdate: '1h', aiConfidence: 72, biddingStrategy: 'Maximizar Cliques' },
  { id: '4', status: 'paused', name: '[Teste] Shopping - Produtos Enterprise', type: 'Shopping', platform: 'Google Ads', objective: 'Vendas', budget: 'R$ 100/dia', spend: 'R$ 12.450', impressions: '340K', clicks: '8.160', ctr: '2.40%', cpc: 'R$ 1,53', conversions: '189', cpa: 'R$ 65,87', roas: '1.85x', lastUpdate: '3h', aiConfidence: 65, biddingStrategy: 'tROAS 3.5x' },
  { id: '5', status: 'error', name: '[Legado] Search Brand - Termos Genéricos', type: 'Search', platform: 'Google Ads', objective: 'Conversões', budget: 'R$ 50/dia', spend: 'R$ 22.700', impressions: '450K', clicks: '6.750', ctr: '1.50%', cpc: 'R$ 3,36', conversions: '156', cpa: 'R$ 145,51', roas: '0.92x', lastUpdate: '1d', aiConfidence: 45, biddingStrategy: 'Manual CPC' },
];

const metrics = [
  { label: 'Campanhas Ativas', value: '3', trend: { value: 'de 5 total', isPositive: true }, confidence: 100 },
  { label: 'Investimento Total', value: 'R$ 148.920', trend: { value: '+14.2% vs mês ant.', isPositive: true }, confidence: 95 },
  { label: 'CPA Misto', value: 'R$ 30,45', trend: { value: 'Meta: R$ 35', isPositive: true }, confidence: 88 },
  { label: 'ROAS Global', value: '4.92x', trend: { value: 'Meta: 4.0x', isPositive: true }, confidence: 92 },
];

const columns: Column<CampaignRow>[] = [
  { key: 'status', header: 'Status', width: '90px', render: (row) => <StatusBadge status={row.status} /> },
  { key: 'name', header: 'Campanha', minWidth: '280px', sticky: true, render: (row) => (
    <div>
      <span className="font-medium text-gray-900">{row.name}</span>
      <div className="flex items-center gap-2 mt-1">
        <Badge variant="outlined" size="sm">{row.type}</Badge>
        <Badge variant="outlined" size="sm">{row.objective}</Badge>
      </div>
    </div>
  )},
  { key: 'platform', header: 'Plataforma', width: '110px', render: (row) => <Badge variant="secondary" size="sm">{row.platform}</Badge> },
  { key: 'budget', header: 'Orçamento', width: '110px', align: 'right' },
  { key: 'biddingStrategy', header: 'Estratégia de Lances', width: '200px', render: (row) => <span className="text-sm text-gray-600 font-medium">{row.biddingStrategy}</span> },
  { key: 'spend', header: 'Investido', width: '110px', align: 'right', render: (row) => <span className="font-medium tabular-nums text-gray-900">{row.spend}</span> },
  { key: 'impressions', header: 'Impressões', width: '100px', align: 'right', render: (row) => <span className="tabular-nums text-gray-600">{row.impressions}</span> },
  { key: 'clicks', header: 'Cliques', width: '80px', align: 'right', render: (row) => <span className="tabular-nums text-gray-600">{row.clicks}</span> },
  { key: 'ctr', header: 'CTR', width: '70px', align: 'right', render: (row) => <span className="tabular-nums text-gray-600">{row.ctr}</span> },
  { key: 'conversions', header: 'Conversões', width: '90px', align: 'right', render: (row) => <span className="font-medium tabular-nums text-gray-900">{row.conversions}</span> },
  { key: 'cpa', header: 'CPA', width: '80px', align: 'right', render: (row) => <span className="tabular-nums text-gray-600">{row.cpa}</span> },
  { key: 'roas', header: 'ROAS', width: '70px', align: 'right', render: (row) => <span className={`font-bold tabular-nums ${parseFloat(row.roas) >= 3 ? 'text-green-700' : parseFloat(row.roas) >= 1 ? 'text-amber-700' : 'text-red-700'}`}>{row.roas}</span> },
  { key: 'aiConfidence', header: 'Conf. IA', width: '80px', align: 'center', render: (row) => row.aiConfidence ? <ConfidenceCircle score={row.aiConfidence} size={24} strokeWidth={3} showLabel={false} /> : <span className="text-gray-400">—</span> },
];

export const CampaignsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<keyof CampaignRow>('spend');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'campaigns' | 'adgroups' | 'ads' | 'recommendations'>('campaigns');

  const handleSort = (columnKey: keyof CampaignRow) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('desc');
    }
  };

  const sortedData = [...mockCampaigns].sort((a, b) => {
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    const aNum = typeof aVal === 'string' ? parseFloat(aVal.replace(/[^\d.,]/g, '').replace(',', '.')) : Number(aVal);
    const bNum = typeof bVal === 'string' ? parseFloat(bVal.replace(/[^\d.,]/g, '').replace(',', '.')) : Number(bVal);
    if (isNaN(aNum) || isNaN(bNum)) return String(aVal).localeCompare(String(bVal)) * (sortDirection === 'asc' ? 1 : -1);
    return (aNum - bNum) * (sortDirection === 'asc' ? 1 : -1);
  });

  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-8" style={{ fontFamily: typography.fontFamily.sans.join(', ') }}>
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b" style={{ borderColor: colors.border }}>
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontSize: typography.fontSize['3xl'][0] }}>Campanhas</h1>
          <p className="text-gray-500 mt-1" style={{ fontSize: typography.fontSize.base[0] }}>Workspace de inteligência de campanhas multi-plataforma.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outlined" size="md">Exportar CSV</Button>
          <Button size="md" style={{ backgroundColor: brand.primary }}>
            <span className="material-symbols-outlined text-sm mr-1">add</span>
            Nova Campanha
          </Button>
        </div>
      </div>

      {/* Demo Mode Indicator */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-gray-500" style={{ backgroundColor: colors.surfaceHover, border: `1px solid ${colors.border}` }}>
        <span className="material-symbols-outlined text-base">science</span>
        <span>Modo demonstração — dados simulados</span>
      </div>

      {/* Summary Metrics */}
      <MetricGrid metrics={metrics} columns={4} />

      {/* AI Bidding Strategy Panel */}
      <Card variant="outlined">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm" style={{ color: brand.aiAccent }}>tune</span>
              <CardTitle className="flex items-center gap-2">Estratégia de Lances Assistida por IA</CardTitle>
            </div>
            <Badge variant="outlined" size="sm" style={{ backgroundColor: brand.aiAccentContainer, color: brand.aiAccentOnContainer, borderColor: brand.aiAccent }}>
              Aguardando Aprovação
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
          <div className="p-4 rounded-lg" style={{ backgroundColor: brand.aiAccentContainer, border: `1px solid ${brand.aiAccent}30` }}>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Estratégia Recomendada</p>
            <p className="font-semibold text-gray-900">Maximizar Conversões</p>
            <p className="text-sm" style={{ color: brand.aiAccent }}>tROAS alvo: 4,5x</p>
          </div>
          <div className="p-4 rounded-lg border" style={{ borderColor: colors.border }}>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Especialista</p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: `${brand.aiSpecialist.bid}15`, color: brand.aiSpecialist.bid, border: `1px solid ${brand.aiSpecialist.bid}40` }}>
                <span className="material-symbols-outlined text-xs mr-1">psychology</span>
                Media Strategist
              </span>
            </div>
          </div>
          <div className="p-4 rounded-lg border" style={{ borderColor: colors.border }}>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Confidence</p>
            <div className="flex items-center gap-2">
              <ConfidenceCircle score={92} size={32} strokeWidth={3} showLabel={false} />
              <span className="text-sm font-medium text-gray-900">92%</span>
            </div>
          </div>
          <div className="p-4 rounded-lg border" style={{ borderColor: colors.border }}>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Auditoria</p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded text-xs font-semibold" style={{ backgroundColor: colors.warningContainer, color: colors.warningOnContainer }}>
                <span className="material-symbols-outlined text-xs mr-1">warning</span>
                REVIEW
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: colors.border }}>
        {[
          { id: 'campaigns', label: 'Campanhas', count: 5 },
          { id: 'adgroups', label: 'Grupos de Anúncios', count: 12 },
          { id: 'ads', label: 'Anúncios', count: 34 },
          { id: 'recommendations', label: 'Recomendações', count: 3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px flex items-center gap-2 ${activeTab === tab.id ? `border-[${brand.primary}] text-[${brand.primary}]` : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'}`}
            style={{ fontFamily: typography.fontFamily.sans.join(', ') }}
          >
            {tab.label}
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <Card variant="outlined" padding="sm">
        <CardContent className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Plataforma:</span>
            <select className="px-3 py-1.5 text-sm border rounded-lg bg-white focus:outline-none focus:ring-1" style={{ borderColor: colors.border, fontFamily: typography.fontFamily.sans.join(', ') }}>
              <option value="all">Todas</option>
              <option value="google">Google Ads</option>
              <option value="meta">Meta Ads</option>
              <option value="tiktok">TikTok Ads</option>
              <option value="linkedin">LinkedIn Ads</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Status:</span>
            <select className="px-3 py-1.5 text-sm border rounded-lg bg-white focus:outline-none focus:ring-1" style={{ borderColor: colors.border, fontFamily: typography.fontFamily.sans.join(', ') }}>
              <option value="all">Todos</option>
              <option value="active">Ativas</option>
              <option value="scaling">Em Escala</option>
              <option value="learning">Aprendizado</option>
              <option value="paused">Pausadas</option>
              <option value="error">Com Erro</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Período:</span>
            <select className="px-3 py-1.5 text-sm border rounded-lg bg-white focus:outline-none focus:ring-1" style={{ borderColor: colors.border, fontFamily: typography.fontFamily.sans.join(', ') }}>
              <option value="7d">Últimos 7 dias</option>
              <option value="30d" selected>Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>
          <div className="flex-1" />
          <Button variant="outlined" size="sm">Colunas</Button>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card variant="outlined">
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={paginatedData}
            keyExtractor={(c) => c.id}
            selectable
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            rowHeight="normal"
            stickyHeader
          />
        </CardContent>
        <CardFooter className="border-t" style={{ borderColor: colors.border }}>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(mockCampaigns.length / itemsPerPage)}
            totalItems={mockCampaigns.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </CardFooter>
      </Card>

      {/* Creative Quality Side Panel - shown when a campaign is selected */}
      {selectedKeys.size > 0 && (
        <Card variant="outlined">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm" style={{ color: brand.aiSpecialist.creative }}>palette</span>
                <CardTitle className="flex items-center gap-2">Qualidade dos Anúncios & Ativos</CardTitle>
              </div>
              <Badge variant="outlined" size="sm" style={{ backgroundColor: brand.aiAccentContainer, color: brand.aiAccentOnContainer }}>
                Análise IA
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            <div className="p-4 rounded-lg border" style={{ borderColor: colors.border }}>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Integridade</p>
              <p className="text-2xl font-bold text-green-700">94%</p>
              <p className="text-xs text-gray-500">Ativos completos</p>
            </div>
            <div className="p-4 rounded-lg border" style={{ borderColor: colors.border }}>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Fadiga Criativa</p>
              <p className="text-2xl font-bold text-amber-700">Média</p>
              <p className="text-xs text-gray-500">3 ativos {'>'} 6.0 freq</p>
            </div>
            <div className="p-4 rounded-lg border" style={{ borderColor: colors.border }}>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Cobertura Formatos</p>
              <p className="text-2xl font-bold text-blue-700">78%</p>
              <p className="text-xs text-gray-500">Faltando: Carrossel, Stories</p>
            </div>
            <div className="p-4 rounded-lg border" style={{ borderColor: colors.border }}>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Direção Criativa IA</p>
              <p className="text-sm font-medium text-gray-900">3 sugestões</p>
              <p className="text-xs text-gray-500">Títulos, CTAs, Narrativa</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};