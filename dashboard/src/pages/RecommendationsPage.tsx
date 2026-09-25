/**
 * ADS INTELLIGENCE Pages - RecommendationsPage
 */
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProvenanceBadge } from '../components/provenance/ProvenanceBadge';
import { ConfidenceCircle } from '../components/confidence/ConfidenceIndicator';

export const RecommendationsPage: React.FC<{ recommendations?: any[] }> = ({ recommendations = [] }) => {
  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Recomendações Especializadas</h1>
        <p className="text-gray-500 mt-1">Insights validados pelo swarm de inteligência artificial.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.length === 0 ? (
          <div className="col-span-full py-10 text-center text-gray-500">Nenhuma recomendação disponível para o contexto atual.</div>
        ) : (
          recommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              title={rec.title}
              impact={rec.expectedImpact}
              description={rec.description}
              provenance={[rec.classification]}
              confidence={rec.confidence}
            />
          ))
        )}
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
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ title, impact, description, provenance, confidence }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
      <ConfidenceCircle score={confidence} size={32} showLabel={false} />
    </CardHeader>
    <CardContent>
      <div className="mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Impacto:</span>
        <span className="ml-2 text-sm text-gray-900">{impact}</span>
      </div>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="flex gap-2 mb-6">
        {provenance.map((p, i) => <ProvenanceBadge key={i} type={p} />)}
      </div>
      <div className="flex gap-2">
        <Button size="sm">Aceitar</Button>
        <Button variant="outlined" size="sm">Refinar</Button>
      </div>
    </CardContent>
  </Card>
);
