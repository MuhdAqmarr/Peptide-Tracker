'use server';

import { revalidatePath } from 'next/cache';
import { protocolItemSchema } from '@/lib/validators/protocolItem';
import * as itemDal from '@/lib/db/dal/protocolItems';
import * as doseDal from '@/lib/db/dal/scheduledDoses';
import * as protocolDal from '@/lib/db/dal/protocols';
import { generateDoses } from '@/lib/scheduler/generator';

export type ActionState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function createProtocolItemAction(
  protocolId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const freqType = formData.get('frequency_type') as string;
  const daysRaw = formData.getAll('days_of_week');

  const raw = {
    protocol_id: protocolId,
    peptide_id: formData.get('peptide_id') as string,
    dose_value: formData.get('dose_value') as string,
    frequency_type: freqType,
    interval_days:
      freqType === 'CUSTOM'
        ? (formData.get('interval_days') as string)
        : null,
    days_of_week:
      freqType === 'WEEKLY' ? daysRaw.map((d) => Number(d)) : null,
    time_of_day: formData.get('time_of_day') as string,
    site_plan_enabled: formData.get('site_plan_enabled') === 'true',
  };

  const result = protocolItemSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    const item = await itemDal.createProtocolItem(result.data);

    // Generate scheduled doses for this new item
    const protocol = await protocolDal.getProtocol(protocolId);
    if (protocol) {
      const doses = generateDoses(protocol, item);
      await doseDal.upsertScheduledDoses(doses);
    }

    revalidatePath(`/[locale]/protocols/${protocolId}`, 'page');
    return { success: true };
  } catch {
    return { success: false, message: 'Failed to create schedule item.' };
  }
}

export async function updateProtocolItemAction(
  itemId: string,
  protocolId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const freqType = formData.get('frequency_type') as string;
  const daysRaw = formData.getAll('days_of_week');

  const raw = {
    protocol_id: protocolId,
    peptide_id: formData.get('peptide_id') as string,
    dose_value: formData.get('dose_value') as string,
    frequency_type: freqType,
    interval_days:
      freqType === 'CUSTOM'
        ? (formData.get('interval_days') as string)
        : null,
    days_of_week:
      freqType === 'WEEKLY' ? daysRaw.map((d) => Number(d)) : null,
    time_of_day: formData.get('time_of_day') as string,
    site_plan_enabled: formData.get('site_plan_enabled') === 'true',
  };

  const result = protocolItemSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    const item = await itemDal.updateProtocolItem(itemId, result.data);

    // Regenerate: delete old DUE doses, then regenerate
    await doseDal.deleteScheduledDosesByItem(itemId);
    const protocol = await protocolDal.getProtocol(protocolId);
    if (protocol) {
      const doses = generateDoses(protocol, item);
      await doseDal.upsertScheduledDoses(doses);
    }

    revalidatePath(`/[locale]/protocols/${protocolId}`, 'page');
    return { success: true };
  } catch {
    return { success: false, message: 'Failed to update schedule item.' };
  }
}

export async function deleteProtocolItemAction(
  itemId: string,
  protocolId: string,
): Promise<ActionState> {
  try {
    // Cascade will delete scheduled_doses via FK
    await itemDal.deleteProtocolItem(itemId);
    revalidatePath(`/[locale]/protocols/${protocolId}`, 'page');
    return { success: true };
  } catch {
    return { success: false, message: 'Failed to delete schedule item.' };
  }
}
