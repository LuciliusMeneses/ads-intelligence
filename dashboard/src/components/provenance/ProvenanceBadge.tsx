/**
 * ADS INTELLIGENCE Components - ProvenanceBadge
 */
import React from 'react';
import { Badge } from '../ui/Badge';

export type ProvenanceType = 'FACT' | 'CALCULATION' | 'EXTERNAL_EVIDENCE' | 'AI_INFERENCE' | 'AI_RECOMMENDATION';

interface ProvenanceBadgeProps {
  type: ProvenanceType;
  className?: string;
}

const provenanceConfig: Record<ProvenanceType, { label: string; variant: 'success' | 'primary' | 'warning' | 'info' | 'default'; icon: string }> = {
  FACT: { label: 'Fato (Real)', variant: 'success', icon: 'verified' },
  CALCULATION: { label: 'Cálculo Matemático', variant: 'primary', icon: 'calculate' },
  EXTERNAL_EVIDENCE: { label: 'Evidência Externa', variant: 'info', icon: 'public' },
  AI_INFERENCE: { label: 'Inferência IA', variant: 'warning', icon: 'psychology' },
  AI_RECOMMENDATION: { label: 'Recomendação IA', variant: 'warning', icon: 'smart_toy' },
};

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({ type, className = '' }) => {
  const config = provenanceConfig[type] || provenanceConfig.FACT;

  return (
    <Badge variant={config.variant} size="sm" className={className}>
      <span className="material-symbols-outlined" style={{ fontSize: '14px', marginRight: '2px' }}>
        {config.icon}
      </span>
      {config.label}
    </Badge>
  );
};