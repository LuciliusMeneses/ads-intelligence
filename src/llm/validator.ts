/**
 * ADS INTELLIGENCE — Structured Output Validator (Zod)
 * Validates specialist LLM outputs against strict schemas and verifies evidence binding provenance.
 */

import { z } from 'zod';

export const FactClassificationEnum = z.enum([
  'FACT',
  'CALCULATION',
  'EXTERNAL_EVIDENCE',
  'AI_INFERENCE',
  'AI_RECOMMENDATION'
]);

export const RecommendationOutputSchema = z.object({
  type: z.string(),
  title: z.string(),
  description: z.string(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  expectedImpact: z.string(),
  risk: z.string(),
  classification: FactClassificationEnum
});

export const SpecialistLLMOutputSchema = z.object({
  specialist: z.string(),
  summary: z.string(),
  facts: z.array(z.string()).default([]),
  calculations: z.array(z.string()).default([]),
  inferences: z.array(z.string()).default([]),
  recommendations: z.array(RecommendationOutputSchema).default([]),
  evidenceIds: z.array(z.string()).default([]),
  missingData: z.array(z.string()).default([]),
  risks: z.array(z.string()).default([]),
  confidenceRationale: z.string()
});

export type SpecialistLLMOutput = z.infer<typeof SpecialistLLMOutputSchema>;

export class StructuredOutputValidator {
  public static validate(json: any): SpecialistLLMOutput {
    try {
      return SpecialistLLMOutputSchema.parse(json);
    } catch (err: any) {
      throw new Error(`[Structured Output Validation Error] O JSON retornado pelo LLM não cumpre o schema exigido: ${err.message}`);
    }
  }

  public static verifyEvidenceBinding(output: SpecialistLLMOutput, validEvidenceIds: string[]): { valid: boolean; invalidIds: string[] } {
    const invalidIds: string[] = output.evidenceIds.filter(id => !validEvidenceIds.includes(id));
    return {
      valid: invalidIds.length === 0,
      invalidIds
    };
  }

  public static verifyProvenance(output: SpecialistLLMOutput): boolean {
    for (const rec of output.recommendations) {
      if (rec.classification === 'FACT' && output.evidenceIds.length === 0) {
        return false;
      }
    }
    return true;
  }
}
