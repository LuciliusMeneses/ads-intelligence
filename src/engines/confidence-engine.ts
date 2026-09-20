/**
 * ADS INTELLIGENCE — Confidence Engine V2
 * Deterministic, explainable confidence scoring considering 8 distinct components
 * with explicit weights, quality precedence over quantity, and unknown penalty handling.
 */

import { ConfidenceResult, ConfidenceComponent, ConfidenceBand, SpecialistContext, ConfidenceComponentKey } from '../types/intelligence';

export class ConfidenceEngine {
  public static calculateConfidence(
    context: SpecialistContext,
    hasContradictions: boolean,
    supportingEvidenceCount: number,
    contradictingEvidenceCount: number
  ): ConfidenceResult {
    const components: ConfidenceComponent[] = [];

    // 1. DATA_COMPLETENESS (Weight: 0.15)
    const requiredFields = [
      context.businessObjective,
      context.campaignObjective,
      context.currentPrice,
      context.margin,
      context.averageTicket,
      context.targetCac,
      context.performanceMetrics?.spend,
      context.performanceMetrics?.roas
    ];
    const filledFields = requiredFields.filter(f => f !== undefined && f !== null && f !== '');
    const completenessRatio = filledFields.length / requiredFields.length;
    const dataCompletenessScore = Math.round(completenessRatio * 100);
    components.push({
      component: 'DATA_COMPLETENESS',
      score: dataCompletenessScore,
      weight: 0.15,
      reason: `Completude de dados: ${Math.round(completenessRatio * 100)}% (${filledFields.length}/${requiredFields.length} campos essenciais preenchidos).`
    });

    // 2. SOURCE_QUALITY (Weight: 0.20) - Quality precedence over raw quantity
    const refs = context.marketResearch || [];
    let sourceQualityScore = 0;
    if (refs.length === 0) {
      sourceQualityScore = 10;
      components.push({
        component: 'SOURCE_QUALITY',
        score: sourceQualityScore,
        weight: 0.20,
        reason: 'Ausência total de referências de mercado externas (qualidade mínima).'
      });
    } else {
      // Evaluate quality and independence (confidence levels >= 90)
      const highQualityCount = refs.filter(r => r.confidenceLevel >= 90).length;
      const mediumQualityCount = refs.filter(r => r.confidenceLevel >= 80 && r.confidenceLevel < 90).length;

      // 3 high quality independent sources can yield higher score than 5 weak sources
      sourceQualityScore = Math.min(100, (highQualityCount * 30) + (mediumQualityCount * 15) + Math.min(10, refs.length * 2));
      components.push({
        component: 'SOURCE_QUALITY',
        score: sourceQualityScore,
        weight: 0.20,
        reason: `Qualidade e independência de fontes: ${highQualityCount} fontes de alta qualidade (>=90%) e ${mediumQualityCount} de qualidade média.`
      });
    }

    // 3. RECENCY (Weight: 0.10) - If dates missing or outdated, mark UNKNOWN or lower score
    let recencyScore = 75;
    let recencyUnknown = false;
    if (refs.length === 0) {
      recencyScore = 20;
      recencyUnknown = true;
    } else {
      const now = new Date().getTime();
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
      const recentRefs = refs.filter(r => {
        if (!r.date) return false;
        const refTime = new Date(r.date).getTime();
        return (now - refTime) <= thirtyDaysMs;
      });
      const recentRatio = recentRefs.length / refs.length;
      recencyScore = Math.round(recentRatio * 100);
    }
    components.push({
      component: 'RECENCY',
      score: recencyScore,
      weight: 0.10,
      reason: recencyUnknown ? 'Recência desconhecida (marcada como UNKNOWN).' : `Proporção de referências recentes (<30 dias): ${recencyScore}%.`,
      isUnknown: recencyUnknown
    });

    // 4. SAMPLE_RELIABILITY (Weight: 0.10) - Unknown sample size reduced penalty
    let sampleScore = 50;
    let sampleUnknown = false;
    if (context.sampleSize !== undefined && context.sampleSize !== null) {
      if (context.sampleSize >= 1000) sampleScore = 100;
      else if (context.sampleSize >= 100) sampleScore = 75;
      else sampleScore = 40;
    } else {
      sampleScore = 30; // penalty for unknown sample size instead of guessing
      sampleUnknown = true;
    }
    components.push({
      component: 'SAMPLE_RELIABILITY',
      score: sampleScore,
      weight: 0.10,
      reason: sampleUnknown ? 'Tamanho da amostra desconhecido (marcado como UNKNOWN, penalidade aplicada).' : `Tamanho da amostra conhecido: ${context.sampleSize}.`,
      isUnknown: sampleUnknown
    });

    // 5. HISTORICAL_CONSISTENCY (Weight: 0.10)
    let historicalScore = 70;
    if (context.performanceMetrics?.roas !== undefined) {
      historicalScore = context.performanceMetrics.roas >= 3.0 ? 90 : 60;
    }
    components.push({
      component: 'HISTORICAL_CONSISTENCY',
      score: historicalScore,
      weight: 0.10,
      reason: `Consistência histórica baseada em ROAS de ${context.performanceMetrics?.roas || 'indefinido'}.`
    });

    // 6. CROSS_SPECIALIST_AGREEMENT (Weight: 0.10)
    let agreementScore = hasContradictions ? 40 : 90;
    components.push({
      component: 'CROSS_SPECIALIST_AGREEMENT',
      score: agreementScore,
      weight: 0.10,
      reason: hasContradictions ? 'Contradicções detetadas entre especialistas reduzem o acordo transversal.' : 'Forte alinhamento transversal entre os especialistas.'
    });

    // 7. SUPPORTING_EVIDENCE (Weight: 0.15)
    let supportScore = 50;
    const totalEv = supportingEvidenceCount + contradictingEvidenceCount;
    if (totalEv > 0) {
      supportScore = Math.round((supportingEvidenceCount / totalEv) * 100);
    }
    components.push({
      component: 'SUPPORTING_EVIDENCE',
      score: supportScore,
      weight: 0.15,
      reason: `Volume de evidências de suporte: ${supportingEvidenceCount} a favor vs ${contradictingEvidenceCount} contrárias.`
    });

    // 8. CONTRADICTING_EVIDENCE (Weight: 0.10) - Inverse penalty
    let contradictingScore = 100;
    if (contradictingEvidenceCount > 0) {
      contradictingScore = Math.max(10, 100 - (contradictingEvidenceCount * 30));
    }
    components.push({
      component: 'CONTRADICTING_EVIDENCE',
      score: contradictingScore,
      weight: 0.10,
      reason: `Presença de evidências contraditórias: ${contradictingEvidenceCount} detetadas.`
    });

    // Weighted Score calculation
    let weightedSum = 0;
    let totalWeight = 0;
    for (const comp of components) {
      weightedSum += comp.score * comp.weight;
      totalWeight += comp.weight;
    }

    const confidenceScore = Math.round(weightedSum / totalWeight);

    // Determine Band
    let confidenceBand: ConfidenceBand = 'MEDIUM';
    if (completenessRatio < 0.3 && refs.length === 0) {
      confidenceBand = 'INSUFFICIENT_DATA';
    } else if (confidenceScore < 30) {
      confidenceBand = 'VERY_LOW';
    } else if (confidenceScore < 50) {
      confidenceBand = 'LOW';
    } else if (confidenceScore < 70) {
      confidenceBand = 'MEDIUM';
    } else if (confidenceScore < 90) {
      confidenceBand = 'HIGH';
    } else {
      confidenceBand = 'VERY_HIGH';
    }

    const reasons = components.map(c => `${c.component}: ${c.reason} (Score: ${c.score}, Peso: ${c.weight})`);
    const explanation = `Por que esta recomendação possui confiança ${confidenceScore}? Deriva-se da ponderação de 8 componentes: completude de dados (${dataCompletenessScore}%), qualidade de fontes (${sourceQualityScore}%), recência (${recencyScore}%), confiabilidade de amostra (${sampleScore}%), consistência histórica (${historicalScore}%), acordo entre especialistas (${agreementScore}%), evidências de suporte (${supportScore}%) e ausência de contradições.`;

    return {
      confidenceScore,
      confidenceBand,
      confidenceReasons: reasons,
      components,
      explanation
    };
  }
}
