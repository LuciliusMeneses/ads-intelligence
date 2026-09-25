/**
 * ADS INTELLIGENCE Pages - RecommendationsPage
 */
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProvenanceBadge } from '../components/provenance/ProvenanceBadge';
import { ConfidenceCircle } from '../components/confidence/ConfidenceIndicator';
import { ComprehensiveCampaignProposal } from '../../src/types/intelligence';

export const RecommendationsPage: React.FC = () => {
  const [proposals, setProposals] = useState<ComprehensiveCampaignProposal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulação de recuperação de dados do motor de propostas
    // Em uma implementação real, chamaria o serviço de API correspondente
    const fetchProposals = async () => {
      try {
        setIsLoading(true);
        // Implementação futura: await proposalService.fetch();
      } catch (err) {
        console.error('Falha ao carregar propostas:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProposals();
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Recomendações IA</h1>
        <p className="text-gray-500 mt-1">Ações e propostas sugeridas pela inteligência artificial.</p>
      </div>

      {proposals.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Propostas de Campanha</h2>
          <div className="grid grid-cols-1 gap-4">
            {proposals.map(p => (
              <Card key={p.id}>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <p className="text-sm text-gray-600">Objetivo: {p.objective}</p>
                  <p className="text-sm text-gray-600">Confiança: {p.confidence.confidenceScore}%</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

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