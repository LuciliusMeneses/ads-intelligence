/**
 * ADS INTELLIGENCE Tests - Sparkline
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Sparkline } from './MetricCard';

describe('Sparkline', () => {
  it('renders valid path without percentage signs', () => {
    const data = [10, 20, 30, 40, 50];
    const { container } = render(<Sparkline data={data} color="#1A73E8" />);
    const paths = container.querySelectorAll('path');

    paths.forEach(path => {
      const d = path.getAttribute('d');
      expect(d).not.toContain('%');
      expect(d).not.toMatch(/NaN/);
      expect(d).not.toMatch(/Infinity/);
      expect(d).toMatch(/^[M L Z\d\s.-]+$/);
    });
  });
});
