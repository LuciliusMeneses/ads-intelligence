/**
 * ADS INTELLIGENCE Tests - App / Routing
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App / Routing', () => {
  it('renders Overview page at root path', () => {
    render(<App />);
    // Check for the page header (h1) with Visão Geral
    expect(screen.getByRole('heading', { name: 'Visão Geral' })).toBeInTheDocument();
    expect(screen.getByText('IA de apoio à decisão ativa')).toBeInTheDocument();
  });

  it('renders navigation items in sidebar', () => {
    render(<App />);
    // Sidebar navigation items are always present
    expect(screen.getAllByText('Campanhas').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Recomendações IA')).toBeInTheDocument();
    expect(screen.getByText('CRM & Conversões')).toBeInTheDocument();
    expect(screen.getByText('Concorrentes')).toBeInTheDocument();
  });
});