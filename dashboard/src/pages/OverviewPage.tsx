/**
 * ADS INTELLIGENCE Pages - OverviewPage
 * ADS INTELLIGENCE identity - AI-native advertising intelligence console
 */
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { MetricGrid } from '../components/metrics/MetricCard';
import { StatusBadge } from '../components/ui/Badge';
import { DataTable, Column } from '../components/ui/DataTable';
import { ProvenanceBadge } from '../components/provenance/ProvenanceBadge';
import { ConfidenceCircle } from '../components/confidence/ConfidenceIndicator';
import { colors, spacing, typography, brand } from '../styles/tokens';
import { demoData } from '../demo/demoData';

interface CampaignRow {
  id: string;
  status: 'active' | 'scaling' | 'paused' | 'error';
  name: string;
  platform: string;
  spend: string;
  ctr: string;
  cpl: string;
  roas: string;
}

export const OverviewPage: React.FC = () => {
  const [chartMetric, setChartMetric] = useState<'spend' | 'conversions' | 'cpa' | 'roas'>('spend');

  const metrics = demoData.overview.metrics.map((m, idx) => ({
    ...m,
    sparklineData: idx === 0 ? [40, 45, 42, 50, 55, 60] : idx === 1 ? [300, 350, 380, 410, 450, 489] : idx === 2 ? [35, 34, 33, 32, 31, 30.45] : [4.1, 4.3, 4.2, 4.5, 4.7, 4.92]
  }));

  const campaigns: CampaignRow[] = [
    { id: '1', status: 'scaling', name: '[Scale] Performance Max - B2B SaaS', platform: 'Google', spend: 'R$ 54.200', ctr: '3.84%', cpl: 'R$ 28,10', roas: '5.80x' },
    { id: '2', status: 'active', name: '[Retargeting] VSL & Casos de Sucesso', platform: 'Meta Ads', spend: 'R$ 41.350', ctr: '2.42%', cpl: 'R$ 32,80', roas: '4.65x' },
    { id: '3', status: 'paused', name: '[Topo] Vídeos Curtos - Reels Discovery', platform: 'TikTok', spend: 'R$ 18.220', ctr: '1.15%', cpl: 'R$ 45,90', roas: '2.10x' },
  ];

  const columns: Column<CampaignRow>[] = [
    { key: 'status', header: 'Status', width: '100px', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'name', header: 'Campanha', minWidth: '280px', sticky: true, render: (row) => <span className="font-medium text-gray-900">{row.name}</span> },
    { key: 'platform', header: 'Plataforma', width: '120px', render: (row) => <span className="px-2 py-1 rounded text-xs font-medium bg-gray-50 border border-gray-200">{row.platform}</span> },
    { key: 'spend', header: 'Investimento', width: '140px', align: 'right', render: (row) => <span className="tabular-nums font-medium text-gray-900">{row.spend}</span> },
    { key: 'ctr', header: 'CTR', width: '80px', align: 'center', render: (row) => <span className="tabular-nums text-gray-600">{row.ctr}</span> },
    { key: 'cpl', header: 'Custo/Lead', width: '120px', align: 'right', render: (row) => <span className="tabular-nums text-gray-600">{row.cpl}</span> },
    { key: 'roas', header: 'ROAS', width: '80px', align: 'right', render: (row) => <span className="tabular-nums font-bold" style={{ color: parseFloat(row.roas) >= 3 ? colors.success : parseFloat(row.roas) >= 1 ? colors.warning : colors.danger }}>{row.roas}</span> },
  ];

  return (
    <div className="space-y-8" style={{ fontFamily: typography.fontFamily.sans.join(', ') }}>
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b" style={{ borderColor: colors.border }}>
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontSize: typography.fontSize['3xl'][0] }}>Visão Geral</h1>
          <p className="text-gray-500 mt-1" style={{ fontSize: typography.fontSize.base[0] }}>Cockpit de inteligência preditiva e orquestração de tráfego pago.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2" style={{ backgroundColor: brand.aiAccentContainer, color: brand.aiAccentOnContainer }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: brand.aiAccent }} />
            IA de apoio à decisão ativa
          </span>
          <span className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: brand.primaryContainer, color: brand.primaryOnContainer, border: `1px solid ${brand.primaryContainer}` }}>
            Pontuação de Otimização: {demoData.overview.optimizationScore}%
          </span>
        </div>
      </div>

      {/* Demo Mode Indicator */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-gray-500" style={{ backgroundColor: colors.surfaceHover, border: `1px solid ${colors.border}` }}>
        <span className="material-symbols-outlined text-base">science</span>
        <span>Modo demonstração — dados simulados</span>
      </div>

      {/* KPI Grid */}
      <MetricGrid metrics={metrics} columns={4} />

      {/* Performance Temporal Chart Area */}
      <Card variant="outlined">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <CardTitle>Performance Temporal Comparativa</CardTitle>
            <div className="flex items-center gap-1" style={{ backgroundColor: colors.surfaceHover, border: `1px solid ${colors.border}` }}>
              <button onClick={() => setChartMetric('spend')} className={`px-3 py-1 rounded-md transition-colors ${chartMetric === 'spend' ? `bg-white text-[${brand.primary}] shadow-sm` : 'text-gray-600 hover:text-gray-900'}`}>Custo</button>
              <button onClick={() => setChartMetric('conversions')} className={`px-3 py-1 rounded-md transition-colors ${chartMetric === 'conversions' ? `bg-white text-[${brand.primary}] shadow-sm` : 'text-gray-600 hover:text-gray-900'}`}>Conversões</button>
              <button onClick={() => setChartMetric('cpa')} className={`px-3 py-1 rounded-md transition-colors ${chartMetric === 'cpa' ? `bg-white text-[${brand.primary}] shadow-sm` : 'text-gray-600 hover:text-gray-900'}`}>CPA</button>
              <button onClick={() => setChartMetric('roas')} className={`px-3 py-1 rounded-md transition-colors ${chartMetric === 'roas' ? `bg-white text-[${brand.primary}] shadow-sm` : 'text-gray-600 hover:text-gray-900'}`}>ROAS</button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full flex items-end gap-6 pt-6 px-4 pb-2 bg-gray-50 rounded-lg border border-dashed border-gray-200 relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
              <div className="border-b border-gray-400 w-full"></div>
              <div className="border-b border-gray-400 w-full"></div>
              <div className="border-b border-gray-400 w-full"></div>
              <div className="border-b border-gray-400 w-full"></div>
            </div>
            {/* Bars/Points representing temporal data */}
            {[
              { label: 'Semana 1', value: 65, display: chartMetric === 'spend' ? 'R$ 32k' : chartMetric === 'conversions' ? '980' : chartMetric === 'cpa' ? 'R$ 32' : '4.2x' },
              { label: 'Semana 2', value: 75, display: chartMetric === 'spend' ? 'R$ 38k' : chartMetric === 'conversions' ? '1.1k' : chartMetric === 'cpa' ? 'R$ 31' : '4.5x' },
              { label: 'Semana 3', value: 82, display: chartMetric === 'spend' ? 'R$ 41k' : chartMetric === 'conversions' ? '1.3k' : chartMetric === 'cpa' ? 'R$ 30' : '4.8x' },
              { label: 'Semana 4', value: 95, display: chartMetric === 'spend' ? 'R$ 37k' : chartMetric === 'conversions' ? '1.5k' : chartMetric === 'cpa' ? 'R$ 30.45' : '4.92x' },
            ].map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end z-10 group">
                <div className="text-xs font-bold" style={{ color: brand.primary, opacity: 0 }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}>{item.display}</div>
                <div className="w-full" style={{ backgroundColor: brand.primaryContainer, borderRadius: '0.375rem 0.375rem 0 0', transition: 'all 0.5s', height: `${item.value}%` }}>
                  <div className="w-full" style={{ backgroundColor: brand.primary, borderRadius: '0.375rem 0.375rem 0 0', height: '70%' }}></div>
                </div>
                <span className="text-xs text-gray-500 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Grid - AI Decision Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" style={{ gap: spacing.gutter }}>
        {/* Campaigns Table */}
        <div className="lg:col-span-8">
          <Card variant="outlined">
            <CardHeader>
              <CardTitle>Performance de Campanhas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable columns={columns} data={campaigns} keyExtractor={(c) => c.id} stickyHeader={true} rowHeight="normal" />
            </CardContent>
          </Card>
        </div>

        {/* AI Decision Center - ADS INTELLIGENCE signature component */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="outlined">
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm" style={{ color: brand.aiAccent }}>psychology</span>
                <CardTitle className="flex items-center gap-2">Central de Decisão IA</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-0">
              <AIDecisionCard
                title="Rebalancear Orçamento PMAX"
                description="Mover R$ 850/dia do Meta para Google Search aumenta receita estimada em +R$ 14.200."
                specialist="Budget Optimizer"
                specialistColor={brand.aiSpecialist.budget}
                confidence={92}
                evidenceCount={3}
                impact="Alta"
                risk="Baixo"
                auditStatus="PASS"
                provenance={['FACT', 'AI_INFERENCE']}
                action="Rever recomendação"
              />
              <AIDecisionCard
                title="Pausar Criativos Fadigados"
                description="3 criativos no Reels com frequência > 6.0 e CTR em queda de 23%."
                specialist="Creative Analyst"
                specialistColor={brand.aiSpecialist.creative}
                confidence={87}
                evidenceCount={2}
                impact="Média"
                risk="Médio"
                auditStatus="WARNING"
                provenance={['FACT', 'CALCULATION']}
                action="Rever recomendação"
              />
              <AIDecisionCard
                title="Expandir Audiência Lookalike"
                description="Segmento 'Visitantes Blog 30d' apresenta alta intenção — sugerir expansão 2x."
                specialist="Audience Architect"
                specialistColor={brand.aiSpecialist.audience}
                confidence={79}
                evidenceCount={2}
                impact="Alta"
                risk="Alto"
                auditStatus="BLOCKED"
                provenance={['AI_RECOMMENDATION', 'EXTERNAL_EVIDENCE']}
                action="Rever recomendação"
              />
            </CardContent>
          </Card>

          {/* Quick Insights */}
          <Card variant="outlined">
            <CardHeader>
              <CardTitle>Resumo de Investimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-0">
              <div className="p-4 border-b" style={{ borderColor: colors.border }}>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Google Ads</span>
                  <span className="font-medium tabular-nums">R$ 89.350</span>
                </div>
                <div className="h-2 mt-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.surfaceHover }}>
                  <div className="h-full rounded-full" style={{ width: '60%', backgroundColor: brand.primary }} />
                </div>
              </div>
              <div className="p-4 border-b" style={{ borderColor: colors.border }}>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Meta Ads</span>
                  <span className="font-medium tabular-nums">R$ 41.350</span>
                </div>
                <div className="h-2 mt-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.surfaceHover }}>
                  <div className="h-full rounded-full" style={{ width: '28%', backgroundColor: brand.secondary }} />
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">TikTok Ads</span>
                  <span className="font-medium tabular-nums">R$ 18.220</span>
                </div>
                <div className="h-2 mt-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.surfaceHover }}>
                  <div className="h-full rounded-full" style={{ width: '12%', backgroundColor: colors.warning }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// AI Decision Card - ADS INTELLIGENCE signature component
interface AIDecisionCardProps {
  title: string;
  description: string;
  specialist: string;
  specialistColor: string;
  confidence: number;
  evidenceCount: number;
  impact: 'Alta' | 'Média' | 'Baixa';
  risk: 'Baixo' | 'Médio' | 'Alto';
  auditStatus: 'PASS' | 'WARNING' | 'BLOCKED';
  provenance: ('FACT' | 'CALCULATION' | 'EXTERNAL_EVIDENCE' | 'AI_INFERENCE' | 'AI_RECOMMENDATION')[];
  action: string;
}

const AIDecisionCard: React.FC<AIDecisionCardProps> = ({
  title,
  description,
  specialist,
  specialistColor,
  confidence,
  evidenceCount,
  impact,
  risk,
  auditStatus,
  provenance,
  action
}) => {
  const impactColors = {
    Alta: { bg: colors.dangerContainer, text: colors.dangerOnContainer },
    Média: { bg: colors.warningContainer, text: colors.warningOnContainer },
    Baixa: { bg: colors.successContainer, text: colors.successOnContainer },
  };

  const riskColors = {
    Baixo: { bg: colors.successContainer, text: colors.successOnContainer },
    Médio: { bg: colors.warningContainer, text: colors.warningOnContainer },
    Alto: { bg: colors.dangerContainer, text: colors.dangerOnContainer },
  };

  const auditColors = {
    PASS: { bg: colors.successContainer, text: colors.successOnContainer, icon: 'check_circle' },
    WARNING: { bg: colors.warningContainer, text: colors.warningOnContainer, icon: 'warning' },
    BLOCKED: { bg: colors.dangerContainer, text: colors.dangerOnContainer, icon: 'block' },
  };

  const colorsForImpact = impactColors[impact];
  const colorsForRisk = riskColors[risk];
  const colorsForAudit = auditColors[auditStatus];

  return (
    <div className="p-5 border-b hover:bg-gray-50 transition-colors" style={{ borderColor: colors.border }}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-base mb-1" style={{ fontFamily: typography.fontFamily.sans.join(', ') }}>{title}</h4>
          <p className="text-gray-600 text-sm" style={{ fontFamily: typography.fontFamily.sans.join(', ') }}>{description}</p>
        </div>
        <span className="px-3 py-1 rounded text-xs font-semibold flex-shrink-0" style={{ backgroundColor: colorsForImpact.bg, color: colorsForImpact.text, fontFamily: typography.fontFamily.sans.join(', ') }}>
          Impacto: {impact}
        </span>
      </div>

      {/* Specialist & Confidence Row */}
      <div className="flex items-center gap-4 mb-3 text-sm" style={{ fontFamily: typography.fontFamily.sans.join(', ') }}>
        <span className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: `${specialistColor}15`, color: specialistColor, border: `1px solid ${specialistColor}40` }}>
          <span className="material-symbols-outlined text-xs">psychology</span>
          {specialist}
        </span>
        <ConfidenceCircle score={confidence} size={28} strokeWidth={3} showLabel={false} />
        <span className="text-gray-500 flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">source</span>
          {evidenceCount} evidências
        </span>
      </div>

      {/* Risk & Audit Row */}
      <div className="flex items-center gap-3 mb-4 text-sm" style={{ fontFamily: typography.fontFamily.sans.join(', ') }}>
        <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: colorsForRisk.bg, color: colorsForRisk.text }}>
          <span className="material-symbols-outlined text-xs">shield</span>
          Risco: {risk}
        </span>
        <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: colorsForAudit.bg, color: colorsForAudit.text }}>
          <span className="material-symbols-outlined text-xs">{colorsForAudit.icon}</span>
          Auditoria: {auditStatus}
        </span>
      </div>

      {/* Provenance & Action */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5 flex-wrap">
          {provenance.slice(0, 2).map((type, idx) => (
            <ProvenanceBadge key={idx} type={type} />
          ))}
          {provenance.length > 2 && (
            <span className="px-2 py-0.5 rounded text-xs font-medium text-gray-400" style={{ backgroundColor: colors.surfaceHover, border: `1px solid ${colors.border}`, fontFamily: typography.fontFamily.sans.join(', ') }}>
              +{provenance.length - 2}
            </span>
          )}
        </div>
        <button className="px-4 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5" style={{
          backgroundColor: brand.primary,
          color: colors.textOnPrimary,
          fontFamily: typography.fontFamily.sans.join(', ')
        }}>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
          {action}
        </button>
      </div>
    </div>
  );
};
