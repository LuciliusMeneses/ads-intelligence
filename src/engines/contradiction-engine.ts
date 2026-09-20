/**
 * ADS INTELLIGENCE — Contradiction Engine
 * Identifies and manages incompatible hypotheses and recommendations between specialists.
 */

import { SpecialistAnalysis, ContradictionRecord, ExpertRole, ContradictionResolution } from '../types/intelligence';

export class ContradictionEngine {
  /**
   * Scans an array of specialist analyses to detect incompatible stances or recommendations.
   */
  public static detectContradictions(analyses: SpecialistAnalysis[]): ContradictionRecord[] {
    const contradictions: ContradictionRecord[] = [];

    const offerAnalysis = analyses.find(a => a.specialist === 'OFFER_STRATEGIST');
    const perfAnalysis = analyses.find(a => a.specialist === 'PERFORMANCE_ANALYST');
    const mediaAnalysis = analyses.find(a => a.specialist === 'MEDIA_STRATEGIST');
    const audienceAnalysis = analyses.find(a => a.specialist === 'AUDIENCE_STRATEGIST');

    // 1. Conflict: Price reduction vs Healthy CVR/Margin
    if (offerAnalysis && perfAnalysis) {
      const offerSuggestsReduction = offerAnalysis.recommendations.some(
        r => r.type === 'PRICE' && (r.title.toLowerCase().includes('reduzir') || r.description.toLowerCase().includes('desconto'))
      );
      const perfSaysCvrHigh = perfAnalysis.observations.some(
        o => o.toLowerCase().includes('cvr alto') || o.toLowerCase().includes('conversão saudável')
      );

      if (offerSuggestsReduction && perfSaysCvrHigh) {
        contradictions.push({
          id: `contra_${Date.now()}_price_cvr`,
          specialistsInvolved: ['OFFER_STRATEGIST', 'PERFORMANCE_ANALYST'],
          positions: [
            { specialist: 'OFFER_STRATEGIST', stance: 'Reduzir preço para alavancar volume' },
            { specialist: 'PERFORMANCE_ANALYST', stance: 'Taxa de conversão (CVR) já está acima da média; o problema não é o preço' }
          ],
          evidenceOfEachSide: [
            { specialist: 'OFFER_STRATEGIST', evidence: offerAnalysis.evidence },
            { specialist: 'PERFORMANCE_ANALYST', evidence: perfAnalysis.evidence }
          ],
          impact: 'Risco de canibalização desnecessária da margem líquida.',
          resolution: 'ESCALATE_TO_HUMAN',
          resolutionDetails: 'Submeter decisão de elasticidade de preço à aprovação humana no Approval Gate.',
          confidence: 85
        });
      }
    }

    // 2. Conflict: Budget scaling vs Frequency/Audience Saturation
    if (mediaAnalysis && audienceAnalysis) {
      const mediaScalesBudget = mediaAnalysis.recommendations.some(r => r.type === 'SCALE' || r.type === 'BUDGET');
      const audienceNotesSaturation = audienceAnalysis.observations.some(
        o => o.toLowerCase().includes('saturnado') || o.toLowerCase().includes('público pequeno') || o.toLowerCase().includes('frequência alta')
      );

      if (mediaScalesBudget && audienceNotesSaturation) {
        contradictions.push({
          id: `contra_${Date.now()}_scale_saturation`,
          specialistsInvolved: ['MEDIA_STRATEGIST', 'AUDIENCE_STRATEGIST'],
          positions: [
            { specialist: 'MEDIA_STRATEGIST', stance: 'Escalar orçamento diário da campanha' },
            { specialist: 'AUDIENCE_STRATEGIST', stance: 'Público segmentado atual apresenta alta saturação' }
          ],
          evidenceOfEachSide: [
            { specialist: 'MEDIA_STRATEGIST', evidence: mediaAnalysis.evidence },
            { specialist: 'AUDIENCE_STRATEGIST', evidence: audienceAnalysis.evidence }
          ],
          impact: 'Aumento abrupto de CPM e desperdício de verba publicitária.',
          resolution: 'REQUEST_MORE_DATA',
          resolutionDetails: 'Solicitar expansão de audiência Broad antes de autorizar escala de orçamento.',
          confidence: 80
        });
      }
    }

    return contradictions;
  }
}
