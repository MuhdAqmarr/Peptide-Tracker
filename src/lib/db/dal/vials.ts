import { createClient } from '@/lib/supabase/server';
import type { Vial } from '../types';

export async function listVials(): Promise<Vial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('vials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Vial[];
}

export async function getVial(id: string): Promise<Vial | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('vials')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return (data as Vial) ?? null;
}

export async function createVial(input: {
  peptide_id: string;
  label?: string | null;
  batch?: string | null;
  total_amount: number;
  unit: string;
  opened_on?: string | null;
  expires_on?: string | null;
  remaining_estimate?: number | null;
}): Promise<Vial> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('vials')
    .insert({ ...input, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data as Vial;
}

export async function updateVial(
  id: string,
  input: {
    peptide_id?: string;
    label?: string | null;
    batch?: string | null;
    total_amount?: number;
    unit?: string;
    opened_on?: string | null;
    expires_on?: string | null;
    remaining_estimate?: number | null;
  },
): Promise<Vial> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('vials')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Vial;
}

export async function deleteVial(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('vials').delete().eq('id', id);
  if (error) throw error;
}

/** Vials expiring within the next N days. */
export async function listExpiringVials(withinDays = 14): Promise<Vial[]> {
  const supabase = await createClient();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + withinDays);

  const { data, error } = await supabase
    .from('vials')
    .select('*')
    .not('expires_on', 'is', null)
    .lte('expires_on', cutoff.toISOString().slice(0, 10))
    .gte('expires_on', new Date().toISOString().slice(0, 10))
    .order('expires_on', { ascending: true });

  if (error) throw error;
  return (data ?? []) as Vial[];
}

/** Vials where remaining_estimate is at or below a threshold percentage. */
export async function listLowStockVials(
  thresholdPercent = 20,
): Promise<Vial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('vials')
    .select('*')
    .not('remaining_estimate', 'is', null)
    .order('remaining_estimate', { ascending: true });

  if (error) throw error;

  return ((data ?? []) as Vial[]).filter((v) => {
    if (v.remaining_estimate === null || v.total_amount === 0) return false;
    return (v.remaining_estimate / v.total_amount) * 100 <= thresholdPercent;
  });
}
