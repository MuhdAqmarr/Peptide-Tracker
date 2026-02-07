'use server';

import { revalidatePath } from 'next/cache';
import { peptideSchema } from '@/lib/validators/peptide';
import * as dal from '@/lib/db/dal/peptides';

export type ActionState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function createPeptideAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    name: formData.get('name') as string,
    unit: formData.get('unit') as string,
    route: (formData.get('route') as string) || null,
    notes: (formData.get('notes') as string) || null,
  };

  const result = peptideSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    await dal.createPeptide(result.data);
    revalidatePath('/[locale]/peptides', 'page');
    return { success: true };
  } catch {
    return { success: false, message: 'Failed to create peptide.' };
  }
}

export async function updatePeptideAction(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    name: formData.get('name') as string,
    unit: formData.get('unit') as string,
    route: (formData.get('route') as string) || null,
    notes: (formData.get('notes') as string) || null,
  };

  const result = peptideSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    await dal.updatePeptide(id, result.data);
    revalidatePath('/[locale]/peptides', 'page');
    return { success: true };
  } catch {
    return { success: false, message: 'Failed to update peptide.' };
  }
}

export async function deletePeptideAction(id: string): Promise<ActionState> {
  try {
    await dal.deletePeptide(id);
    revalidatePath('/[locale]/peptides', 'page');
    return { success: true };
  } catch {
    return { success: false, message: 'Failed to delete peptide.' };
  }
}
