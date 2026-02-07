import { z } from 'zod';

export const symptomLogSchema = z.object({
  log_time: z.string().min(1, 'Time is required'),
  nausea: z.coerce.number().int().min(0).max(10).nullable().optional(),
  headache: z.coerce.number().int().min(0).max(10).nullable().optional(),
  sleep: z.coerce.number().int().min(0).max(10).nullable().optional(),
  appetite: z.coerce.number().int().min(0).max(10).nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type SymptomLogInput = z.infer<typeof symptomLogSchema>;
