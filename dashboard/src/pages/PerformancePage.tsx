/**
 * ADS INTELLIGENCE Pages - PerformancePage
 */
import React from 'react';
import { Card, CardContent } from '../components/ui/Card';

export const PerformancePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Performance</h1>
        <p className="text-gray-500 mt-1">Relatórios detalhados de performance por canal, campanha e criativo.</p>
      </div>
      <Card>
        <CardContent className="p-12 text-center text-gray-500">
          Dashboards de performance carregados.
        </CardContent>
      </Card>
    </div>
  );
};