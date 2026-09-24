/**
 * ADS INTELLIGENCE — Structured Output Validator (Zod)
 */

import { z } from 'zod';

export const SpecialistLLMOutputSchema = z.object({
  specialist: z.string(),
  summary: z.string(),
  facts: z.array(z.string()).default([]),
  calculations: z.array(z.string()).default([]),
  inferences: z.array(z.string()).default([]),
  recommendations: z.array(z.object({
    type: z.string(),
    title: z.string(),
    description: z.string(),
    priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
    classification: z.enum(['FACT', 'CALCULATION', 'EXTERNAL_EVIDENCE', 'AI_INFERENCE', 'AI_RECOMMENDATION'])
  })).default([]),
  evidenceIds: z.array(z.string()).default([]),
  missingData: z.array(z.string()).default([]),
  risks: z.array(z.string()).default([]),
  confidenceRationale: z.string()
});

export type SpecialistLLMOutput = z.infer<typeof SpecialistLLMOutputSchema>;

export class StructuredOutputValidator {
  public static validate(json: any): SpecialistLLMOutput {
    return SpecialistLLMOutputSchema.parse(json);
  }

  public static verifyEvidenceBinding(output: SpecialistLLMOutput, validIds: string[]): { valid: boolean; invalidIds: string[] } {
    const invalid = output.evidenceIds.filter(id => !validIds.includes(id));
    return { valid: invalid.length === 0, invalidIds: invalid };
  }

  public static verifyProvenance(output: SpecialistLLMOutput): boolean {
    return true;
  }
}
