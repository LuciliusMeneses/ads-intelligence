/**
 * ADS INTELLIGENCE Pages - AudiencesPage
 */
import React from 'react';
import { Card, CardContent } from '../components/ui/Card';

export const AudiencesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Audiências</h1>
        <p className="text-gray-500 mt-1">Gestão de públicos e segmentos personalizados.</p>
      </div>
      <Card>
        <CardContent className="p-12 text-center text-gray-500">
          Módulo de audiências pronto.
        </CardContent>
      </Card>
    </div>
  );
};
