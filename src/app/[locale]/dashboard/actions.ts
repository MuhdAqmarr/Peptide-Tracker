'use server';

import { revalidatePath } from 'next/cache';
import { markDoseDone, markDoseSkipped } from '@/lib/db/dal/scheduledDoses';
import { createInjectionLog } from '@/lib/db/dal/injectionLogs';
import { injectionLogSchema } from '@/lib/validators/injectionLog';

export type ActionState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function markDoneAction(doseId: string): Promise<ActionState> {
  try {
    await markDoseDone(doseId);
    revalidatePath('/[locale]/dashboard', 'page');
    return { success: true };
  } catch {
    return { success: false, message: 'Failed to mark dose as done.' };
  }
}

export async function markSkippedAction(doseId: string): Promise<ActionState> {
  try {
    await markDoseSkipped(doseId);
    revalidatePath('/[locale]/dashboard', 'page');
    return { success: true };
  } catch {
    return { success: false, message: 'Failed to skip dose.' };
  }
}

export async function logInjectionAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    scheduled_dose_id: formData.get('scheduled_dose_id') as string,
    actual_time: formData.get('actual_time') as string,
    site: (formData.get('site') as string) || null,
    pain_score: formData.get('pain_score')
      ? Number(formData.get('pain_score'))
      : null,
    notes: (formData.get('notes') as string) || null,
  };

  const result = injectionLogSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    // Also mark the dose as done if it hasn't been already
    await markDoseDone(result.data.scheduled_dose_id);
    await createInjectionLog(result.data);
    revalidatePath('/[locale]/dashboard', 'page');
    return { success: true };
  } catch {
    return { success: false, message: 'Failed to log injection details.' };
  }
}
