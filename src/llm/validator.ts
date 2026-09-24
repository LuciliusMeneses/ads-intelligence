/**
 * ADS INTELLIGENCE — Zod Validators
 * Fails closed on all checks.
 */

import { z } from 'zod';

export const SpecialistLLMOutputSchema = z.object({
  specialist: z.string(),
  summary: z.string(),
  facts: z.array(z.string()).default([]),
  recommendations: z.array(z.object({
    type: z.string(),
    title: z.string(),
    description: z.string(),
    priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
    classification: z.enum(['FACT', 'CALCULATION', 'EXTERNAL_EVIDENCE', 'AI_INFERENCE', 'AI_RECOMMENDATION'])
  })).default([]),
  evidenceIds: z.array(z.string()).default([])
});

export type SpecialistLLMOutput = z.infer<typeof SpecialistLLMOutputSchema>;

export class StructuredOutputValidator {
  public static validate(json: any): SpecialistLLMOutput {
    return SpecialistLLMOutputSchema.parse(json);
  }
  public static verifyEvidenceBinding(output: SpecialistLLMOutput, valid: string[]): { valid: boolean; invalidIds: string[] } {
    const invalid = output.evidenceIds.filter(id => !valid.includes(id));
    return { valid: invalid.length === 0, invalidIds: invalid };
  }
  public static verifyProvenance(output: SpecialistLLMOutput): boolean {
    return !output.recommendations.some(r => r.classification === 'FACT' && output.evidenceIds.length === 0);
  }
}
