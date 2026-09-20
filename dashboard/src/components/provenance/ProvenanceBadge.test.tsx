/**
 * ADS INTELLIGENCE Tests - ProvenanceBadge
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProvenanceBadge } from './ProvenanceBadge';

describe('ProvenanceBadge', () => {
  const testTypes = [
    { type: 'FACT' as const, expectedLabel: 'Fato (Real)' },
    { type: 'CALCULATION' as const, expectedLabel: 'Cálculo Matemático' },
    { type: 'EXTERNAL_EVIDENCE' as const, expectedLabel: 'Evidência Externa' },
    { type: 'AI_INFERENCE' as const, expectedLabel: 'Inferência IA' },
    { type: 'AI_RECOMMENDATION' as const, expectedLabel: 'Recomendação IA' },
  ];

  testTypes.forEach(({ type, expectedLabel }) => {
    it(`renders "${expectedLabel}" for type ${type}`, () => {
      render(<ProvenanceBadge type={type} />);
      expect(screen.getByText(expectedLabel)).toBeInTheDocument();
    });
  });

  it('renders correct icon for each type', () => {
    const iconMap = {
      FACT: 'verified',
      CALCULATION: 'calculate',
      EXTERNAL_EVIDENCE: 'public',
      AI_INFERENCE: 'psychology',
      AI_RECOMMENDATION: 'smart_toy',
    };

    Object.entries(iconMap).forEach(([type, icon]) => {
      render(<ProvenanceBadge type={type as 'FACT' | 'CALCULATION' | 'EXTERNAL_EVIDENCE' | 'AI_INFERENCE' | 'AI_RECOMMENDATION'} />);
      expect(screen.getByText(icon)).toBeInTheDocument();
    });
  });

  it('applies custom className when provided', () => {
    const { container } = render(<ProvenanceBadge type="FACT" className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});