import { createClient } from '@/lib/supabase/server';
import type { SymptomLog } from '../types';

export async function listSymptomLogs(limit = 50): Promise<SymptomLog[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('symptom_logs')
    .select('*')
    .order('log_time', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as SymptomLog[];
}

export async function getSymptomLog(id: string): Promise<SymptomLog | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('symptom_logs')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return (data as SymptomLog) ?? null;
}

export async function createSymptomLog(input: {
  log_time: string;
  nausea?: number | null;
  headache?: number | null;
  sleep?: number | null;
  appetite?: number | null;
  notes?: string | null;
}): Promise<SymptomLog> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('symptom_logs')
    .insert({ ...input, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data as SymptomLog;
}

export async function updateSymptomLog(
  id: string,
  input: {
    log_time?: string;
    nausea?: number | null;
    headache?: number | null;
    sleep?: number | null;
    appetite?: number | null;
    notes?: string | null;
  },
): Promise<SymptomLog> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('symptom_logs')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as SymptomLog;
}

export async function deleteSymptomLog(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('symptom_logs')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
