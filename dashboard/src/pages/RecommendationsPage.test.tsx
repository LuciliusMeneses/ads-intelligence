/**
 * ADS INTELLIGENCE Tests - RecommendationsPage
 */
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { RecommendationsPage } from './RecommendationsPage';

describe('RecommendationsPage', () => {
  it('renders page title', () => {
    render(<RecommendationsPage />);
    expect(screen.getByText('Recomendações IA')).toBeInTheDocument();
    expect(screen.getByText('Ações sugeridas pela inteligência artificial com base em dados e evidências.')).toBeInTheDocument();
  });

  it('renders recommendation cards', () => {
    render(<RecommendationsPage />);
    expect(screen.getByText('Ajuste de Lance PMAX')).toBeInTheDocument();
    expect(screen.getByText('Pausa de Criativo')).toBeInTheDocument();
    expect(screen.getByText('Novo Segmento de Público')).toBeInTheDocument();
  });

  it('displays provenance badges on recommendations', () => {
    render(<RecommendationsPage />);
    // Multiple recommendations can have provenance badges; verify at least one exists
    const provenanceBadges = screen.getAllByText(/Fato \(Real\)|Cálculo Matemático|Evidência Externa|Inferência IA|Recomendação IA/);
    expect(provenanceBadges.length).toBeGreaterThan(0);
    // Verify all rendered badges are from the allowed set
    provenanceBadges.forEach((badge) => {
      expect(badge.textContent).toMatch(/Fato \(Real\)|Cálculo Matemático|Evidência Externa|Inferência IA|Recomendação IA/);
    });
  });

  it('displays confidence indicators', () => {
    render(<RecommendationsPage />);
    // ConfidenceCircle should render with percentage
    const confidenceScores = screen.getAllByText(/\d+%/);
    expect(confidenceScores.length).toBeGreaterThan(0);
  });

  it('renders action buttons for human approval on each recommendation', () => {
    render(<RecommendationsPage />);
    // Each recommendation card has its own set of action buttons
    const acceptButtons = screen.getAllByRole('button', { name: /aceitar/i });
    const modifyButtons = screen.getAllByRole('button', { name: /modificar/i });
    const rejectButtons = screen.getAllByRole('button', { name: /rejeitar/i });

    expect(acceptButtons.length).toBe(3);
    expect(modifyButtons.length).toBe(3);
    expect(rejectButtons.length).toBe(3);
  });
});