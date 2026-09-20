/**
 * ADS INTELLIGENCE Pages - MarketPage
 */
import React from 'react';
import { Card, CardContent } from '../components/ui/Card';

export const MarketPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Inteligência de Mercado</h1>
        <p className="text-gray-500 mt-1">Tendências macroeconômicas e sazonalidade de leilão.</p>
      </div>
      <Card>
        <CardContent className="p-12 text-center text-gray-500">
          Dados de mercado carregados.
        </CardContent>
      </Card>
    </div>
  );
};
