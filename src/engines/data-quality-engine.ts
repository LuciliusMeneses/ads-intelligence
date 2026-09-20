/**
 * ADS INTELLIGENCE — Data Quality Engine
 * Assesses data quality grades (EXCELLENT, GOOD, LIMITED, POOR, INSUFFICIENT)
 * and identifies missing or conflicting data.
 */

import { SpecialistContext, DataQualityAssessment, DataQualityGrade } from '../types/intelligence';

export class DataQualityEngine {
  public static assess(context: SpecialistContext): DataQualityAssessment {
    const availableData: string[] = [];
    const missingData: string[] = [];
    const potentiallyOutdatedData: string[] = [];
    const conflictingSources: string[] = [];

    // Check available vs missing fields
    const checks = [
      { key: 'brand', val: context.brand, label: 'Marca' },
      { key: 'businessObjective', val: context.businessObjective, label: 'Objetivo de Negócio' },
      { key: 'campaignObjective', val: context.campaignObjective, label: 'Objetivo de Campanha' },
      { key: 'currentPrice', val: context.currentPrice, label: 'Preço Atual' },
      { key: 'margin', val: context.margin, label: 'Margem' },
      { key: 'averageTicket', val: context.averageTicket, label: 'Ticket Médio' },
      { key: 'targetCac', val: context.targetCac, label: 'CAC Alvo' },
      { key: 'spend', val: context.performanceMetrics?.spend, label: 'Gasto Histórico (Spend)' },
      { key: 'roas', val: context.performanceMetrics?.roas, label: 'ROAS Histórico' },
      { key: 'marketResearch', val: context.marketResearch && context.marketResearch.length > 0, label: 'Pesquisa de Mercado' }
    ];

    for (const check of checks) {
      if (check.val !== undefined && check.val !== null && check.val !== '' && check.val !== false) {
        availableData.push(check.label);
      } else {
        missingData.push(check.label);
      }
    }

    // Check market research count
    if (!context.marketResearch || context.marketResearch.length < 5) {
      missingData.push(`Referências de mercado completas (${context.marketResearch?.length || 0}/5)`);
    }

    // Determine grade
    const availableRatio = availableData.length / checks.length;
    let grade: DataQualityGrade = 'LIMITED';

    if (availableRatio >= 0.9 && (context.marketResearch?.length || 0) >= 5) {
      grade = 'EXCELLENT';
    } else if (availableRatio >= 0.75) {
      grade = 'GOOD';
    } else if (availableRatio >= 0.5) {
      grade = 'LIMITED';
    } else if (availableRatio >= 0.25) {
      grade = 'POOR';
    } else {
      grade = 'INSUFFICIENT';
    }

    return {
      grade,
      availableData,
      missingData,
      potentiallyOutdatedData,
      conflictingSources
    };
  }
}
