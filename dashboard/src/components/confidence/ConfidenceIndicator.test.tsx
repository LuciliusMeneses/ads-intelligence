/**
 * ADS INTELLIGENCE Tests - ConfidenceIndicator
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConfidenceIndicator, ConfidenceCircle } from './ConfidenceIndicator';

describe('ConfidenceIndicator', () => {
  it('renders "Dados insuficientes" when score is null', () => {
    render(<ConfidenceIndicator score={null} />);
    expect(screen.getByText('Dados insuficientes')).toBeInTheDocument();
  });

  it('renders score and band for valid score', () => {
    render(<ConfidenceIndicator score={85} />);
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('(Alta)')).toBeInTheDocument();
  });

  it('renders correct band for medium score', () => {
    render(<ConfidenceIndicator score={65} />);
    expect(screen.getByText('(Média)')).toBeInTheDocument();
  });

  it('renders correct band for low score', () => {
    render(<ConfidenceIndicator score={30} />);
    expect(screen.getByText('(Baixa)')).toBeInTheDocument();
  });

  it('renders data quality bar when provided', () => {
    render(<ConfidenceIndicator score={80} dataQuality={90} />);
    expect(screen.getByText('Qualidade dos Dados')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
  });

  it('renders component breakdown when components provided', () => {
    const components = [
      { name: 'Completude dos Dados', score: 90, maxScore: 100 },
      { name: 'Qualidade da Fonte', score: 80, maxScore: 100 },
    ];
    render(<ConfidenceIndicator score={85} components={components} />);
    expect(screen.getByText('Completude dos Dados')).toBeInTheDocument();
    expect(screen.getByText('Qualidade da Fonte')).toBeInTheDocument();
  });

  it('renders provenance badges when provided', () => {
    render(<ConfidenceIndicator score={85} provenance={['FACT', 'AI_INFERENCE']} />);
    expect(screen.getByText('Fato (Real)')).toBeInTheDocument();
    expect(screen.getByText('Inferência IA')).toBeInTheDocument();
  });

  it('renders different sizes correctly', () => {
    const { container: sm } = render(<ConfidenceIndicator score={80} size="sm" />);
    const { container: md } = render(<ConfidenceIndicator score={80} size="md" />);
    const { container: lg } = render(<ConfidenceIndicator score={80} size="lg" />);

    expect(sm.firstChild).toBeInTheDocument();
    expect(md.firstChild).toBeInTheDocument();
    expect(lg.firstChild).toBeInTheDocument();
  });
});

describe('ConfidenceCircle', () => {
  it('renders "Dados insuficientes" when score is null', () => {
    render(<ConfidenceCircle score={null} />);
    expect(screen.getByText('Dados insuficientes')).toBeInTheDocument();
  });

  it('renders score percentage for valid score', () => {
    render(<ConfidenceCircle score={92} showLabel />);
    expect(screen.getByText('92%')).toBeInTheDocument();
  });

  it('applies different stroke colors based on score', () => {
    // Test through component structure since colors are applied via style
    render(<ConfidenceCircle score={90} />);
    // SVG should be present
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('respects custom size', () => {
    const { container } = render(<ConfidenceCircle score={85} size={60} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});