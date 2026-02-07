import { createClient } from '@/lib/supabase/server';
import type { ProtocolItem } from '../types';
import type { ProtocolItemFormData } from '@/lib/validators/protocolItem';

export async function listProtocolItems(
  protocolId: string,
): Promise<ProtocolItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('protocol_items')
    .select('*')
    .eq('protocol_id', protocolId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as ProtocolItem[];
}

export async function getProtocolItem(
  id: string,
): Promise<ProtocolItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('protocol_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as ProtocolItem;
}

export async function createProtocolItem(
  form: ProtocolItemFormData,
): Promise<ProtocolItem> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('protocol_items')
    .insert({
      protocol_id: form.protocol_id,
      peptide_id: form.peptide_id,
      dose_value: form.dose_value,
      frequency_type: form.frequency_type,
      interval_days: form.interval_days ?? null,
      days_of_week: form.days_of_week ?? null,
      time_of_day: form.time_of_day,
      site_plan_enabled: form.site_plan_enabled,
    })
    .select()
    .single();

  if (error) throw error;
  return data as ProtocolItem;
}

export async function updateProtocolItem(
  id: string,
  form: ProtocolItemFormData,
): Promise<ProtocolItem> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('protocol_items')
    .update({
      peptide_id: form.peptide_id,
      dose_value: form.dose_value,
      frequency_type: form.frequency_type,
      interval_days: form.interval_days ?? null,
      days_of_week: form.days_of_week ?? null,
      time_of_day: form.time_of_day,
      site_plan_enabled: form.site_plan_enabled,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as ProtocolItem;
}

export async function deleteProtocolItem(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('protocol_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
