'use server';

import { revalidatePath } from 'next/cache';
import { vialSchema } from '@/lib/validators/vial';
import * as dal from '@/lib/db/dal/vials';

export type ActionState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function createVialAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    peptide_id: formData.get('peptide_id') as string,
    label: (formData.get('label') as string) || null,
    batch: (formData.get('batch') as string) || null,
    total_amount: formData.get('total_amount') as string,
    unit: formData.get('unit') as string,
    opened_on: (formData.get('opened_on') as string) || null,
    expires_on: (formData.get('expires_on') as string) || null,
    remaining_estimate: formData.get('remaining_estimate')
      ? (formData.get('remaining_estimate') as string)
      : null,
  };

  const result = vialSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    await dal.createVial(result.data);
    revalidatePath('/[locale]/inventory', 'page');
    return { success: true };
  } catch {
    return { success: false, message: 'Failed to add vial.' };
  }
}

export async function updateVialAction(
  vialId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    peptide_id: formData.get('peptide_id') as string,
    label: (formData.get('label') as string) || null,
    batch: (formData.get('batch') as string) || null,
    total_amount: formData.get('total_amount') as string,
    unit: formData.get('unit') as string,
    opened_on: (formData.get('opened_on') as string) || null,
    expires_on: (formData.get('expires_on') as string) || null,
    remaining_estimate: formData.get('remaining_estimate')
      ? (formData.get('remaining_estimate') as string)
      : null,
  };

  const result = vialSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    await dal.updateVial(vialId, result.data);
    revalidatePath('/[locale]/inventory', 'page');
    return { success: true };
  } catch {
    return { success: false, message: 'Failed to update vial.' };
  }
}

export async function deleteVialAction(id: string): Promise<ActionState> {
  try {
    await dal.deleteVial(id);
    revalidatePath('/[locale]/inventory', 'page');
    return { success: true };
  } catch {
    return { success: false, message: 'Failed to delete vial.' };
  }
}
