/**
 * ADS INTELLIGENCE Pages - CreativesPage
 */
import React from 'react';
import { Card, CardContent } from '../components/ui/Card';

export const CreativesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Direção Criativa</h1>
        <p className="text-gray-500 mt-1">Geração e análise de criativos por IA com mapas de calor e predição de CTR.</p>
      </div>
      <Card>
        <CardContent className="p-12 text-center text-gray-500">
          Direção criativa com IA ativa.
        </CardContent>
      </Card>
    </div>
  );
};
