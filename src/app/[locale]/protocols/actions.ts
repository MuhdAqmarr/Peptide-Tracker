'use server';

import { revalidatePath } from 'next/cache';
import { protocolSchema } from '@/lib/validators/protocol';
import * as dal from '@/lib/db/dal/protocols';

export type ActionState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function createProtocolAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    name: formData.get('name') as string,
    start_date: formData.get('start_date') as string,
    end_date: (formData.get('end_date') as string) || null,
    timezone: (formData.get('timezone') as string) || 'Asia/Kuala_Lumpur',
    is_active: true,
  };

  const result = protocolSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    await dal.createProtocol(result.data);
    revalidatePath('/[locale]/protocols', 'page');
    return { success: true };
  } catch {
    return { success: false, message: 'Failed to create protocol.' };
  }
}

export async function updateProtocolAction(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    name: formData.get('name') as string,
    start_date: formData.get('start_date') as string,
    end_date: (formData.get('end_date') as string) || null,
    timezone: (formData.get('timezone') as string) || 'Asia/Kuala_Lumpur',
    is_active: formData.get('is_active') === 'true',
  };

  const result = protocolSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    await dal.updateProtocol(id, result.data);
    revalidatePath('/[locale]/protocols', 'page');
    return { success: true };
  } catch {
    return { success: false, message: 'Failed to update protocol.' };
  }
}

export async function deleteProtocolAction(id: string): Promise<ActionState> {
  try {
    await dal.deleteProtocol(id);
    revalidatePath('/[locale]/protocols', 'page');
    return { success: true };
  } catch {
    return { success: false, message: 'Failed to delete protocol.' };
  }
}
