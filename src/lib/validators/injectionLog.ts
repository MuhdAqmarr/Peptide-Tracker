import { z } from 'zod';

export const injectionLogSchema = z.object({
  scheduled_dose_id: z.string().uuid(),
  actual_time: z.string().min(1, 'Time is required'),
  site: z.string().nullable().optional(),
  pain_score: z.coerce
    .number()
    .int()
    .min(0)
    .max(10)
    .nullable()
    .optional(),
  notes: z.string().nullable().optional(),
});

export type InjectionLogInput = z.infer<typeof injectionLogSchema>;
