/**
 * ADS INTELLIGENCE Tests - AppShell
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppShell } from './AppShell';

const renderWithRouter = (children: React.ReactNode) => {
  return render(
    <MemoryRouter initialEntries={['/']}>
      {children}
    </MemoryRouter>
  );
};

describe('AppShell', () => {
  it('renders brand identity', () => {
    renderWithRouter(
      <AppShell>
        <div>Page Content</div>
      </AppShell>
    );
    expect(screen.getAllByText('ADS INTELLIGENCE').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Inteligência de Apoio à Decisão')).toBeInTheDocument();
  });

  it('renders main navigation items', () => {
    renderWithRouter(
      <AppShell>
        <div>Page Content</div>
      </AppShell>
    );
    const navItems = [
      'Visão Geral',
      'Campanhas',
      'Criativos',
      'Experimentos',
      'Recomendações IA',
      'Mercado',
      'Concorrentes',
      'Audiências',
      'Performance',
      'CRM & Conversões',
      'Aprendizado',
      'Configurações',
    ];
    navItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('renders top bar with search and create button', () => {
    renderWithRouter(
      <AppShell>
        <div>Page Content</div>
      </AppShell>
    );
    expect(screen.getByPlaceholderText('Pesquisar campanhas, métricas, recomendações...')).toBeInTheDocument();
    expect(screen.getByText('Nova Campanha')).toBeInTheDocument();
  });

  it('renders page content passed as children', () => {
    renderWithRouter(
      <AppShell>
        <div data-testid="page-content">Custom Page Content</div>
      </AppShell>
    );
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
  });
});