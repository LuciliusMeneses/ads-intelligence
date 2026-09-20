/**
 * ADS INTELLIGENCE Pages - ExperimentsPage
 */
import React from 'react';
import { Card, CardContent } from '../components/ui/Card';

export const ExperimentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Experimentos</h1>
        <p className="text-gray-500 mt-1">Testes A/B e validação estatística de hipóteses.</p>
      </div>
      <Card>
        <CardContent className="p-12 text-center text-gray-500">
          Framework de experimentos pronto.
        </CardContent>
      </Card>
    </div>
  );
};