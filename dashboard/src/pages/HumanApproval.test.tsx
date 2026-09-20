/**
 * ADS INTELLIGENCE Tests - Human Approval Flow
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecommendationsPage } from './RecommendationsPage';

describe('Human Approval Flow', () => {
  it('renders ACCEPT, MODIFY, REJECT buttons for each recommendation', () => {
    render(<RecommendationsPage />);

    // Three recommendations, each should have the three action buttons
    const acceptButtons = screen.getAllByRole('button', { name: /aceitar/i });
    const modifyButtons = screen.getAllByRole('button', { name: /modificar/i });
    const rejectButtons = screen.getAllByRole('button', { name: /rejeitar/i });

    expect(acceptButtons).toHaveLength(3);
    expect(modifyButtons).toHaveLength(3);
    expect(rejectButtons).toHaveLength(3);
  });

  it('REJECT button has danger styling', () => {
    render(<RecommendationsPage />);
    const rejectButtons = screen.getAllByRole('button', { name: /rejeitar/i });
    rejectButtons.forEach((button) => {
      // Reject button uses danger token colors
      expect(button).toHaveClass('text-#D93025');
    });
  });

  it('ACCEPT button has primary styling', () => {
    render(<RecommendationsPage />);
    const acceptButtons = screen.getAllByRole('button', { name: /aceitar/i });
    acceptButtons.forEach((button) => {
      // Accept button uses primary token: bg-#6B4EFF text-white
      expect(button).toHaveClass('bg-#6B4EFF');
      expect(button).toHaveClass('text-white');
    });
  });

  it('MODIFY button has outlined styling', () => {
    render(<RecommendationsPage />);
    const modifyButtons = screen.getAllByRole('button', { name: /modificar/i });
    modifyButtons.forEach((button) => {
      // Modify button uses outlined variant with border token
      expect(button).toHaveClass('border');
      expect(button).toHaveClass('border-#DADCE0');
    });
  });

  it('each recommendation card has provenance and confidence', () => {
    render(<RecommendationsPage />);
    // At least one provenance badge should be visible
    const provenanceBadges = screen.getAllByText(/Fato \(Real\)|Cálculo Matemático|Evidência Externa|Inferência IA|Recomendação IA/);
    expect(provenanceBadges.length).toBeGreaterThan(0);
    // Confidence should be shown
    const confidenceScores = screen.getAllByText(/\d+%/);
    expect(confidenceScores.length).toBeGreaterThan(0);
  });
});