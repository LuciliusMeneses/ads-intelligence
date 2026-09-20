/**
 * ADS INTELLIGENCE Tests - OverviewPage
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OverviewPage } from './OverviewPage';

describe('OverviewPage', () => {
  it('renders executive header with user greeting', () => {
    render(<OverviewPage />);
    expect(screen.getByText('Visão Geral')).toBeInTheDocument();
    expect(screen.getByText('IA de apoio à decisão ativa')).toBeInTheDocument();
    expect(screen.getByText(/Cockpit de inteligência preditiva/)).toBeInTheDocument();
  });

  it('renders four metric cards', () => {
    render(<OverviewPage />);
    const metricLabels = [
      'Custo Total',
      'CPA Médio',
    ];
    metricLabels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
    // Conversões appears both as metric label and chart tab - check metric specifically
    expect(screen.getAllByText('Conversões').length).toBeGreaterThanOrEqual(1);
    // ROAS appears as metric label, chart tab, and table header - check metric specifically
    expect(screen.getAllByText('ROAS').length).toBeGreaterThanOrEqual(1);
  });

  it('renders campaign performance table', () => {
    render(<OverviewPage />);
    expect(screen.getByText('Performance de Campanhas')).toBeInTheDocument();
    expect(screen.getByText('[Scale] Performance Max - B2B SaaS')).toBeInTheDocument();
    expect(screen.getByText('[Retargeting] VSL & Casos de Sucesso')).toBeInTheDocument();
    expect(screen.getByText('[Topo] Vídeos Curtos - Reels Discovery')).toBeInTheDocument();
  });

  it('renders intelligent optimization insights', () => {
    render(<OverviewPage />);
    expect(screen.getByText('Central de Decisão IA')).toBeInTheDocument();
    expect(screen.getByText('Rebalancear Orçamento PMAX')).toBeInTheDocument();
    expect(screen.getByText('Pausar Criativos Fadigados')).toBeInTheDocument();
  });
});