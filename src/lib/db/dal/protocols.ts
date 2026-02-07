import { createClient } from '@/lib/supabase/server';
import type { Protocol } from '../types';
import type { ProtocolFormData } from '@/lib/validators/protocol';

export async function listProtocols(): Promise<Protocol[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('protocols')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Protocol[];
}

export async function getProtocol(id: string): Promise<Protocol | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('protocols')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Protocol;
}

export async function createProtocol(
  form: ProtocolFormData,
): Promise<Protocol> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('protocols')
    .insert({
      user_id: user.id,
      name: form.name,
      start_date: form.start_date,
      end_date: form.end_date ?? null,
      timezone: form.timezone,
      is_active: form.is_active,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Protocol;
}

export async function updateProtocol(
  id: string,
  form: ProtocolFormData,
): Promise<Protocol> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('protocols')
    .update({
      name: form.name,
      start_date: form.start_date,
      end_date: form.end_date ?? null,
      timezone: form.timezone,
      is_active: form.is_active,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Protocol;
}

export async function deleteProtocol(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('protocols').delete().eq('id', id);

  if (error) throw error;
}
