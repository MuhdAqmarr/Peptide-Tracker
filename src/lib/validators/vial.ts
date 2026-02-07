import { z } from 'zod';

export const vialSchema = z.object({
  peptide_id: z.string().uuid(),
  label: z.string().nullable().optional(),
  batch: z.string().nullable().optional(),
  total_amount: z.coerce.number().positive('Must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
  opened_on: z.string().nullable().optional(),
  expires_on: z.string().nullable().optional(),
  remaining_estimate: z.coerce.number().min(0).nullable().optional(),
});

export type VialInput = z.infer<typeof vialSchema>;
