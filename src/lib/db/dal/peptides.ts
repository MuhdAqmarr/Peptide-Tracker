import { createClient } from '@/lib/supabase/server';
import type { Peptide } from '../types';
import type { PeptideFormData } from '@/lib/validators/peptide';

export async function listPeptides(): Promise<Peptide[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('peptides')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Peptide[];
}

export async function getPeptide(id: string): Promise<Peptide | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('peptides')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Peptide;
}

export async function createPeptide(form: PeptideFormData): Promise<Peptide> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('peptides')
    .insert({
      user_id: user.id,
      name: form.name,
      unit: form.unit,
      route: form.route ?? null,
      notes: form.notes ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Peptide;
}

export async function updatePeptide(
  id: string,
  form: PeptideFormData,
): Promise<Peptide> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('peptides')
    .update({
      name: form.name,
      unit: form.unit,
      route: form.route ?? null,
      notes: form.notes ?? null,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Peptide;
}

export async function deletePeptide(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('peptides').delete().eq('id', id);

  if (error) throw error;
}
