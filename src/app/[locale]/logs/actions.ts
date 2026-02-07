'use server';

import { revalidatePath } from 'next/cache';
import { symptomLogSchema } from '@/lib/validators/symptomLog';
import * as dal from '@/lib/db/dal/symptomLogs';

export type ActionState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function createSymptomLogAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    log_time: formData.get('log_time') as string,
    nausea: formData.get('nausea') ? Number(formData.get('nausea')) : null,
    headache: formData.get('headache')
      ? Number(formData.get('headache'))
      : null,
    sleep: formData.get('sleep') ? Number(formData.get('sleep')) : null,
    appetite: formData.get('appetite')
      ? Number(formData.get('appetite'))
      : null,
    notes: (formData.get('notes') as string) || null,
  };

  const result = symptomLogSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    await dal.createSymptomLog(result.data);
    revalidatePath('/[locale]/logs', 'page');
    return { success: true };
  } catch {
    return { success: false, message: 'Failed to create symptom log.' };
  }
}

export async function deleteSymptomLogAction(
  id: string,
): Promise<ActionState> {
  try {
    await dal.deleteSymptomLog(id);
    revalidatePath('/[locale]/logs', 'page');
    return { success: true };
  } catch {
    return { success: false, message: 'Failed to delete symptom log.' };
  }
}
