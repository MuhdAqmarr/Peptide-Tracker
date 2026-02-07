import { z } from 'zod';

export const protocolSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().nullable().optional(),
  timezone: z.string().min(1).default('Asia/Kuala_Lumpur'),
  is_active: z.boolean().default(true),
});

export type ProtocolFormData = z.infer<typeof protocolSchema>;
