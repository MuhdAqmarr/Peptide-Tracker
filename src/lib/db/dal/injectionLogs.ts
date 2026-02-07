import { createClient } from '@/lib/supabase/server';
import type { InjectionLog } from '../types';

export async function listInjectionLogs(limit = 50): Promise<InjectionLog[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('injection_logs')
    .select('*')
    .order('actual_time', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as InjectionLog[];
}

export async function getInjectionLog(
  id: string,
): Promise<InjectionLog | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('injection_logs')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return (data as InjectionLog) ?? null;
}

export async function getInjectionLogByDose(
  scheduledDoseId: string,
): Promise<InjectionLog | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('injection_logs')
    .select('*')
    .eq('scheduled_dose_id', scheduledDoseId)
    .maybeSingle();

  if (error) throw error;
  return (data as InjectionLog) ?? null;
}

export async function createInjectionLog(input: {
  scheduled_dose_id: string;
  actual_time: string;
  site?: string | null;
  pain_score?: number | null;
  notes?: string | null;
}): Promise<InjectionLog> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('injection_logs')
    .insert({ ...input, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data as InjectionLog;
}

export async function updateInjectionLog(
  id: string,
  input: {
    actual_time?: string;
    site?: string | null;
    pain_score?: number | null;
    notes?: string | null;
  },
): Promise<InjectionLog> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('injection_logs')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as InjectionLog;
}

/** Fetch recent injection logs that have a site recorded, for rotation planning. */
export async function listRecentSiteUsage(
  limit = 100,
): Promise<{ site: string; actual_time: string }[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('injection_logs')
    .select('site, actual_time')
    .not('site', 'is', null)
    .neq('site', '')
    .order('actual_time', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as { site: string; actual_time: string }[];
}

export async function deleteInjectionLog(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('injection_logs')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
