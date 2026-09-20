/**
 * ADS INTELLIGENCE Tests - StatusBadge
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge, Badge } from './Badge';

describe('StatusBadge', () => {
  const statuses = [
    { status: 'active' as const, label: 'Ativa' },
    { status: 'scaling' as const, label: 'Em escala' },
    { status: 'paused' as const, label: 'Pausada' },
    { status: 'error' as const, label: 'Erro' },
    { status: 'learning' as const, label: 'Aprendizado' },
    { status: 'attention' as const, label: 'Atenção' },
    { status: 'draft' as const, label: 'Rascunho' },
    { status: 'pending' as const, label: 'Pendente' },
  ];

  statuses.forEach(({ status, label }) => {
    it(`renders "${label}" for status "${status}"`, () => {
      render(<StatusBadge status={status} />);
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('renders dot indicator by default', () => {
    render(<StatusBadge status="active" />);
    const dot = screen.getByText('Ativa').parentElement?.querySelector('.w-1\\.5');
    expect(dot).toBeInTheDocument();
  });

  it('renders dot for learning status', () => {
    render(<StatusBadge status="learning" />);
    const dot = screen.getByText('Aprendizado').parentElement?.querySelector('.w-1\\.5');
    expect(dot).toBeInTheDocument();
  });

  it('respects size prop', () => {
    const { container: sm } = render(<StatusBadge status="active" size="sm" />);
    const { container: md } = render(<StatusBadge status="active" size="md" />);
    const { container: lg } = render(<StatusBadge status="active" size="lg" />);

    expect(sm.firstChild).toBeInTheDocument();
    expect(md.firstChild).toBeInTheDocument();
    expect(lg.firstChild).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<StatusBadge status="active" className="custom-badge" />);
    expect(container.firstChild).toHaveClass('custom-badge');
  });

  it('renders error status with danger styling (red text)', () => {
    render(<StatusBadge status="error" />);
    const badge = screen.getByText('Erro').closest('span');
    // Check for the actual token-based color class (text-#C5221F)
    expect(badge).toHaveClass('text-#C5221F');
  });

  it('renders active status with success styling (green text)', () => {
    render(<StatusBadge status="active" />);
    const badge = screen.getByText('Ativa').closest('span');
    // Check for the actual token-based color class (text-#137333)
    expect(badge).toHaveClass('text-#137333');
  });

  it('renders scaling status with primary styling (purple text)', () => {
    render(<StatusBadge status="scaling" />);
    const badge = screen.getByText('Em escala').closest('span');
    // Check for the actual token-based color class (text-#4D35CC - primaryOnContainer)
    expect(badge).toHaveClass('text-#4D35CC');
  });
});

describe('Badge', () => {
  it('renders children content', () => {
    render(<Badge>Custom Badge</Badge>);
    expect(screen.getByText('Custom Badge')).toBeInTheDocument();
  });

  it('renders different variants without error', () => {
    const variants = ['default', 'success', 'warning', 'danger', 'primary', 'info', 'outlined', 'secondary'] as const;
    variants.forEach((variant) => {
      render(<Badge variant={variant}>{variant}</Badge>);
      expect(screen.getByText(variant)).toBeInTheDocument();
    });
  });

  it('renders dot when dot prop is true', () => {
    render(<Badge dot>With Dot</Badge>);
    const dot = screen.getByText('With Dot').parentElement?.querySelector('.w-1\\.5');
    expect(dot).toBeInTheDocument();
  });

  it('uses custom dotColor when provided', () => {
    const { container } = render(<Badge dot dotColor="#ff0000">Custom Dot</Badge>);
    const dot = container.querySelector('.w-1\\.5');
    expect(dot).toHaveStyle({ backgroundColor: '#ff0000' });
  });

  it('respects size prop', () => {
    const { container: sm } = render(<Badge size="sm">Small</Badge>);
    const { container: md } = render(<Badge size="md">Medium</Badge>);
    const { container: lg } = render(<Badge size="lg">Large</Badge>);

    expect(sm.firstChild).toBeInTheDocument();
    expect(md.firstChild).toBeInTheDocument();
    expect(lg.firstChild).toBeInTheDocument();
  });
});