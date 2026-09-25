/**
 * ADS INTELLIGENCE Pages - RecommendationsPage
 */
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProvenanceBadge } from '../components/provenance/ProvenanceBadge';
import { ConfidenceCircle } from '../components/confidence/ConfidenceIndicator';

export const RecommendationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Recomendações IA</h1>
        <p className="text-gray-500 mt-1">Ações validadas pelo motor de inteligência e auditadas pelo Orchestrator.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RecommendationCard
          title="Otimização de Estratégia"
          impact="Alta"
          description="Proposta consolidada pelo swarm, validada pelo motor de contradições."
          provenance={['AI_RECOMMENDATION', 'AI_INFERENCE']}
          confidence={88}
          status="PROPOSED"
        />
      </div>
    </div>
  );
};

interface RecommendationCardProps {
  title: string;
  impact: string;
  description: string;
  provenance: ('FACT' | 'CALCULATION' | 'EXTERNAL_EVIDENCE' | 'AI_INFERENCE' | 'AI_RECOMMENDATION')[];
  confidence: number;
  status: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ title, impact, description, provenance, confidence, status }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <ConfidenceCircle score={confidence} size={32} showLabel={true} />
    </CardHeader>
    <CardContent>
      <div className="mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Status:</span>
        <span className="ml-2 font-bold text-gray-900">{status}</span>
      </div>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="flex gap-2 mb-6">
        {provenance.map((p, i) => <ProvenanceBadge key={i} type={p} />)}
      </div>
      <div className="flex gap-2">
        <Button size="sm">Aceitar</Button>
        <Button variant="outlined" size="sm">Modificar</Button>
      </div>
    </CardContent>
  </Card>
);