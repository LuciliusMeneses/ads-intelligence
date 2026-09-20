/**
 * ADS INTELLIGENCE Components - ConfidenceIndicator
 */
import React from 'react';
import { colors, radius } from '../../styles/tokens';
import { ProvenanceBadge } from '../provenance/ProvenanceBadge';

export interface ConfidenceComponent {
  name: string;
  score: number;
  maxScore: number;
}

interface ConfidenceIndicatorProps {
  score: number | null; // 0-100, null = insufficient data
  band?: 'high' | 'medium' | 'low';
  components?: ConfidenceComponent[];
  dataQuality?: number; // 0-100
  provenance?: ('FACT' | 'CALCULATION' | 'EXTERNAL_EVIDENCE' | 'AI_INFERENCE' | 'AI_RECOMMENDATION')[];
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

const bandConfig = {
  high: { color: colors.success, bg: colors.successContainer, label: 'Alta', minScore: 80 },
  medium: { color: colors.warning, bg: colors.warningContainer, label: 'Média', minScore: 50 },
  low: { color: colors.danger, bg: colors.dangerContainer, label: 'Baixa', minScore: 0 },
} as const;

const defaultComponents: ConfidenceComponent[] = [
  { name: 'Completude dos Dados', score: 0, maxScore: 100 },
  { name: 'Qualidade da Fonte', score: 0, maxScore: 100 },
  { name: 'Atualidade', score: 0, maxScore: 100 },
  { name: 'Confiabilidade da Amostra', score: 0, maxScore: 100 },
  { name: 'Consistência Histórica', score: 0, maxScore: 100 },
  { name: 'Acordo entre Especialistas', score: 0, maxScore: 100 },
  { name: 'Evidência de Suporte', score: 0, maxScore: 100 },
  { name: 'Evidência Contraditória', score: 0, maxScore: 100 },
];

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  score,
  band,
  components = defaultComponents,
  dataQuality,
  provenance = [],
  size = 'md',
  showDetails = true,
}) => {
  if (score === null || score === undefined) {
    return (
      <div className="inline-flex items-center gap-2 text-sm text-gray-500">
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>help_outline</span>
        <span>Dados insuficientes</span>
      </div>
    );
  }

  // Determine band from score if not provided
  const effectiveBand = band || (score >= 80 ? 'high' : score >= 50 ? 'medium' : 'low');
  const bandInfo = bandConfig[effectiveBand];

  const sizeStyles = {
    sm: { height: '24px', fontSize: '11px', gap: '4px', padding: '0 8px' },
    md: { height: '32px', fontSize: '13px', gap: '6px', padding: '0 10px' },
    lg: { height: '40px', fontSize: '14px', gap: '8px', padding: '0 12px' },
  };

  const styles = sizeStyles[size];

  return (
    <div className="flex flex-col gap-2">
      <div
        className="inline-flex items-center gap-2 font-medium rounded-full border"
        style={{
          ...styles,
          backgroundColor: bandInfo.bg,
          color: bandInfo.color,
          borderColor: bandInfo.color,
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: size === 'sm' ? '14px' : '18px' }}>
          {score >= 80 ? 'verified' : score >= 50 ? 'warning' : 'error'}
        </span>
        <span>{score}%</span>
        <span>({bandInfo.label})</span>
      </div>

      {showDetails && (
        <div className="flex flex-col gap-1 text-xs text-gray-600">
          {dataQuality !== undefined && (
            <div className="flex items-center gap-2">
              <span className="min-w-[160px]">Qualidade dos Dados</span>
              <div className="flex-1 max-w-xs h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${dataQuality}%` }}
                />
              </div>
              <span className="tabular-nums w-10 text-right">{dataQuality}%</span>
            </div>
          )}

          {(components || defaultComponents).map((comp, idx) => {
            const scoreValue = comp.score || 0;
            const maxScoreValue = comp.maxScore || 100;
            const percentage = maxScoreValue > 0 ? (scoreValue / maxScoreValue) * 100 : 0;
            return (
              <div key={idx} className="flex items-center gap-2">
                <span className="min-w-[160px] truncate">{comp.name}</span>
                <div className="flex-1 max-w-xs h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: percentage >= 80 ? colors.success : percentage >= 50 ? colors.warning : colors.danger,
                    }}
                  />
                </div>
                <span className="tabular-nums w-10 text-right">{Math.round(percentage)}%</span>
              </div>
            );
          })}

          {provenance.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {provenance.map((type, idx) => (
                <ProvenanceBadge key={idx} type={type} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Circular confidence indicator for cards
export const ConfidenceCircle: React.FC<{
  score: number | null;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}> = ({ score, size = 48, strokeWidth = 4, showLabel = true }) => {
  if (score === null || score === undefined) {
    return (
      <div className="flex flex-col items-center gap-1" style={{ width: size, height: size }}>
        <div className="relative" style={{ width: size, height: size }}>
          <svg viewBox="0 0 48 48" style={{ width: size, height: size, transform: 'rotate(-90deg)' }} role="img" aria-label={`Confiança ${score}%`}>
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="#E0E0E0"
              strokeWidth={strokeWidth}
            />
          </svg>
        </div>
        {showLabel && <span className="text-xs text-gray-500">Dados insuficientes</span>}
      </div>
    );
  }

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  let strokeColor: string = colors.success;
  if (score < 50) strokeColor = colors.danger;
  else if (score < 80) strokeColor = colors.warning;

  return (
    <div className="flex flex-col items-center gap-1" style={{ width: size, height: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 48 48" style={{ width: size, height: size, transform: 'rotate(-90deg)' }} role="img" aria-label={`Confiança ${score}%`}>
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="#E0E0E0"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-bold tabular-nums" style={{ fontSize: size * 0.2, color: colors.textPrimary }}>
              {score}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};