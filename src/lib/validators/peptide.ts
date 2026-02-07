import { z } from 'zod';

export const peptideSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  unit: z.string().min(1, 'Unit is required').max(20),
  route: z.string().max(50).nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
});

export type PeptideFormData = z.infer<typeof peptideSchema>;
