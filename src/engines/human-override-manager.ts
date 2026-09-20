/**
 * ADS INTELLIGENCE — Human Override Manager
 * Manages human decisions (ACCEPT, REJECT, MODIFY) on recommendations without deleting originals.
 */

import { Recommendation, HumanOverrideRecord, HumanDecision } from '../types/intelligence';

export class HumanOverrideManager {
  private overrides: Map<string, HumanOverrideRecord> = new Map();

  /**
   * Applies a human decision to a recommendation while preserving the original.
   */
  public overrideRecommendation(
    recommendation: Recommendation,
    decision: HumanDecision,
    modifiedValue?: any,
    reason?: string
  ): HumanOverrideRecord {
    const record: HumanOverrideRecord = {
      recommendationId: recommendation.id,
      originalRecommendation: { ...recommendation }, // Deep copy preservation
      humanDecision: decision,
      modifiedValue,
      reason,
      timestamp: new Date().toISOString()
    };

    this.overrides.set(recommendation.id, record);
    return record;
  }

  public getOverride(recommendationId: string): HumanOverrideRecord | undefined {
    return this.overrides.get(recommendationId);
  }

  public getAllOverrides(): HumanOverrideRecord[] {
    return Array.from(this.overrides.values());
  }
}
