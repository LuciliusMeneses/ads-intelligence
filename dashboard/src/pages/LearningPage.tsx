/**
 * ADS INTELLIGENCE Pages - LearningPage
 */
import React from 'react';
import { Card, CardContent } from '../components/ui/Card';

export const LearningPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Aprendizado</h1>
        <p className="text-gray-500 mt-1">Base de conhecimento e histórico de decisões da IA.</p>
      </div>
      <Card>
        <CardContent className="p-12 text-center text-gray-500">
          Módulo de aprendizado ativo.
        </CardContent>
      </Card>
    </div>
  );
};