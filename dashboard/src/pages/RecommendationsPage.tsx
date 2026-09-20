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
        <p className="text-gray-500 mt-1">Ações sugeridas pela inteligência artificial com base em dados e evidências.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RecommendationCard
          title="Ajuste de Lance PMAX"
          impact="Alta"
          description="Aumentar orçamento em 15% para o conjunto de produtos de alta margem."
          provenance={['AI_RECOMMENDATION', 'AI_INFERENCE']}
          confidence={92}
        />
        <RecommendationCard
          title="Pausa de Criativo"
          impact="Média"
          description="Criativo [Vídeo-04] está com ROAS abaixo de 1.0x há 3 dias."
          provenance={['FACT', 'AI_INFERENCE']}
          confidence={85}
        />
        <RecommendationCard
          title="Novo Segmento de Público"
          impact="Alta"
          description="Segmento 'Usuários Visitantes Blog' apresenta alta intenção de compra."
          provenance={['AI_RECOMMENDATION', 'EXTERNAL_EVIDENCE']}
          confidence={78}
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
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ title, impact, description, provenance, confidence }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <ConfidenceCircle score={confidence} size={32} showLabel={false} />
    </CardHeader>
    <CardContent>
      <div className="mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Impacto Estimado:</span>
        <span className="ml-2 font-bold text-gray-900">{impact}</span>
      </div>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="flex gap-2 mb-6">
        {provenance.map((p, i) => <ProvenanceBadge key={i} type={p} />)}
      </div>
      <div className="flex gap-2">
        <Button size="sm">Aceitar</Button>
        <Button variant="outlined" size="sm">Modificar</Button>
        <Button variant="ghost" size="sm" className="text-#D93025 hover:text-#C5221F">Rejeitar</Button>
      </div>
    </CardContent>
  </Card>
);
