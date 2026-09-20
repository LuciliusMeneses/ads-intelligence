/**
 * ADS INTELLIGENCE Components - MetricCard
 * Based on Precision Ads Console scorecard design
 */
import React from 'react';
import { colors, radius, spacing, typography, table } from '../../styles/tokens';
import { ConfidenceCircle } from '../confidence/ConfidenceIndicator';
import { ProvenanceBadge } from '../provenance/ProvenanceBadge';

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  sparklineData?: number[];
  sparklineColor?: 'primary' | 'success' | 'warning' | 'danger';
  provenance?: ('FACT' | 'CALCULATION' | 'EXTERNAL_EVIDENCE' | 'AI_INFERENCE' | 'AI_RECOMMENDATION')[];
  confidence?: number | null;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  trend,
  sparklineData,
  sparklineColor = 'primary',
  provenance = [],
  confidence = null,
  selected = false,
  onClick,
  className = '',
}) => {
  const sparklineColors = {
    primary: colors.primary,
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
  };

  const trendColor = trend?.isPositive ? colors.success : colors.danger;

  return (
    <div
      className={`
        relative flex flex-col rounded-xl border transition-all duration-200 cursor-pointer
        ${selected
          ? `border-2 border-[${colors.primary}] bg-[${colors.primaryContainer}]/10`
          : `border-[${colors.border}] hover:border-[${colors.borderHover}] hover:bg-[${colors.surfaceHover}]`
        }
        ${className}
      `}
      onClick={onClick}
      style={{
        minWidth: '180px',
        padding: spacing.lg,
        fontFamily: typography.fontFamily.sans.join(', ')
      }}
    >
      {/* Selected indicator */}
      {selected && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-b-full" style={{ backgroundColor: colors.primary }} />
      )}

      {/* Label */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500" style={{ letterSpacing: typography.letterSpacing.wider }}>
          {label}
        </span>
        {provenance.length > 0 && (
          <div className="flex gap-1.5">
            {provenance.slice(0, 2).map((type, idx) => (
              <ProvenanceBadge key={idx} type={type} />
            ))}
            {provenance.length > 2 && (
              <span className="text-xs text-gray-400" style={{ fontFamily: typography.fontFamily.sans.join(', ') }}>+{provenance.length - 2}</span>
            )}
          </div>
        )}
      </div>

      {/* Main value */}
      <div className="flex items-end gap-3 mb-4">
        <div className="tabular-nums font-bold text-gray-900 leading-tight" style={{
          fontSize: typography.fontSize.metric[0],
          lineHeight: typography.fontSize.metric[1].lineHeight,
          fontWeight: typography.fontSize.metric[1].fontWeight,
          fontFamily: typography.fontFamily.mono.join(', ')
        }}>
          {value}
        </div>
        {confidence !== null && (
          <ConfidenceCircle score={confidence} size={36} strokeWidth={3} showLabel={false} />
        )}
      </div>

      {/* Trend */}
      {trend && (
        <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: trendColor, fontFamily: typography.fontFamily.sans.join(', ') }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            {trend.isPositive ? 'trending_up' : 'trending_down'}
          </span>
          <span>{trend.value}</span>
          {trend.label && <span className="text-gray-500">{trend.label}</span>}
        </div>
      )}

      {/* Sparklines */}
      {sparklineData && sparklineData.length > 1 && (
        <div className="mt-3 h-14 w-full">
          <Sparkline
            data={sparklineData}
            color={sparklineColors[sparklineColor]}
            selected={selected}
          />
        </div>
      )}
    </div>
  );
};

// Simple SVG sparkline component
export const Sparkline: React.FC<{ data: number[]; color: string; selected?: boolean }> = ({ data, color, selected }) => {
  const width = '100%';
  const height = 56;
  const padding = 4;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (100 - 2 * padding);
    const y = height - padding - (value / Math.max(...data, 1)) * (height - 2 * padding);
    return `${x} ${y}`;
  }).join(' L ');

  // Start points for area
  const firstX = padding;
  const lastX = 100 - padding;
  const bottomY = height - padding;

  return (
    <svg viewBox={`0 0 100 ${height}`} width={width} height={height} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkline-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.4" />
        </linearGradient>
      </defs>
      {/* Area */}
      <path
        d={`M ${firstX} ${bottomY} L ${points} L ${lastX} ${bottomY} Z`}
        fill="url(#sparkline-gradient)"
        opacity={selected ? 1 : 0.6}
      />
      {/* Line */}
      <path
        d={`M ${points}`}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={selected ? 1 : 0.8}
      />
    </svg>
  );
};

// Grid of metric cards
interface MetricGridProps {
  metrics: MetricCardProps[];
  columns?: 1 | 2 | 3 | 4 | 5;
  className?: string;
}

export const MetricGrid: React.FC<MetricGridProps> = ({
  metrics,
  columns = 4,
  className = '',
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  };

  return (
    <div className={`grid gap-4 lg:gap-6 ${gridCols[columns]} ${className}`} style={{ gap: spacing.gutter }}>
      {metrics.map((metric, idx) => (
        <MetricCard key={idx} {...metric} />
      ))}
    </div>
  );
};