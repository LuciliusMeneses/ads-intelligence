/**
 * ADS INTELLIGENCE — Specialist Context Builder
 */
import { SpecialistContext } from '../types/intelligence';
import { ExpertRole } from '../types/ads-intelligence';

export class SpecialistContextBuilder {
  public static buildForSpecialist(
    organizationId: string,
    specialistRole: ExpertRole,
    fullContext: SpecialistContext
  ) {
    return {
      specialistRole,
      organizationId,
      filteredContext: { ...fullContext },
      validEvidenceIds: (fullContext.marketResearch || []).map(r => r.id)
    };
  }
}
