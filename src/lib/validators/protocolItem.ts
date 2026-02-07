import { z } from 'zod';

export const protocolItemSchema = z
  .object({
    protocol_id: z.string().uuid(),
    peptide_id: z.string().uuid(),
    dose_value: z.coerce.number().positive('Dose must be positive'),
    frequency_type: z.enum(['ED', 'EOD', 'WEEKLY', 'CUSTOM']),
    interval_days: z.coerce.number().int().positive().nullable().optional(),
    days_of_week: z.array(z.number().int().min(0).max(6)).nullable().optional(),
    time_of_day: z.string().min(1, 'Time is required'),
    site_plan_enabled: z.boolean().default(false),
  })
  .refine(
    (data) =>
      data.frequency_type !== 'CUSTOM' ||
      (data.interval_days != null && data.interval_days > 0),
    { message: 'Interval days required for custom frequency', path: ['interval_days'] },
  )
  .refine(
    (data) =>
      data.frequency_type !== 'WEEKLY' ||
      (data.days_of_week != null && data.days_of_week.length > 0),
    { message: 'Select at least one day for weekly frequency', path: ['days_of_week'] },
  );

export type ProtocolItemFormData = z.infer<typeof protocolItemSchema>;
