import { z } from 'zod';

export const SpecialistLLMOutputSchema = z.object({
  specialist: z.string(),
  summary: z.string(),
  facts: z.array(z.string()).default([]),
  recommendations: z.array(z.any()).default([]),
  evidenceIds: z.array(z.string()).default([]),
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
  public static verifyProvenance(output: SpecialistLLMOutput): boolean { return true; }
}
