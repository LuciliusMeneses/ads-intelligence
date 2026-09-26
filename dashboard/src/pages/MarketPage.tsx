/**
 * ADS INTELLIGENCE Pages - MarketPage
 */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const MarketPage: React.FC = () => {
  // Mock evidence for UI demonstration of the new architecture
  const evidenceSummary = [
    { label: 'Fatos (FACT)', count: 12, level: 'FACT', color: 'bg-green-100 text-green-800' },
    { label: 'Observações (OBSERVATION)', count: 24, level: 'OBSERVATION', color: 'bg-blue-100 text-blue-800' },
    { label: 'Suposições (ASSUMPTION)', count: 5, level: 'ASSUMPTION', color: 'bg-amber-100 text-amber-800' },
    { label: 'Desconhecido (UNKNOWN)', count: 2, level: 'UNKNOWN', color: 'bg-gray-100 text-gray-800' },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Inteligência de Mercado</h1>
        <p className="text-gray-500 mt-1">Tendências macroeconômicas e sazonalidade de leilão com arquitetura evidence-aware.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {evidenceSummary.map((item) => (
          <Card key={item.level} variant="outlined">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-sm text-gray-500 font-medium mb-1">{item.label}</span>
              <span className="text-2xl font-bold">{item.count}</span>
              <Badge className={`mt-2 ${item.color}`} size="sm">{item.level}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fluxo de Evidências Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-gray-500">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">Aumento de 15% no CPM médio do setor de Varejo</span>
                <span className="text-xs text-gray-500">Fonte: Meta Ads Insights · Há 2 dias</span>
              </div>
              <Badge className="bg-green-100 text-green-800">FACT</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">Potencial saturação de público em lookalike 1%</span>
                <span className="text-xs text-gray-500">Fonte: Inferência de Engine de Performance · Há 4 horas</span>
              </div>
              <Badge className="bg-amber-100 text-amber-800">ASSUMPTION</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
