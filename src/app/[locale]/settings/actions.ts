'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { updateProfile } from '@/lib/db/dal/profiles';
import { createClient } from '@/lib/supabase/server';

export type ActionState = {
  success: boolean;
  message?: string;
};

export async function updateDisplayNameAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const displayName = (formData.get('display_name') as string)?.trim();
  if (!displayName) {
    return { success: false, message: 'Display name is required.' };
  }

  try {
    await updateProfile(displayName);
    revalidatePath('/[locale]/settings', 'page');
    return { success: true };
  } catch {
    return { success: false, message: 'Failed to update display name.' };
  }
}

export async function deleteAccountAction(): Promise<ActionState> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: 'Not authenticated.' };

    // Delete user data in order (respecting FK constraints)
    // RLS ensures only own data is deleted
    await supabase.from('injection_logs').delete().eq('user_id', user.id);
    await supabase.from('symptom_logs').delete().eq('user_id', user.id);
    await supabase.from('scheduled_doses').delete().eq('user_id', user.id);
    await supabase.from('vials').delete().eq('user_id', user.id);

    // protocol_items cascade from protocols, so deleting protocols is enough
    await supabase.from('protocols').delete().eq('user_id', user.id);
    await supabase.from('peptides').delete().eq('user_id', user.id);
    await supabase.from('profiles').delete().eq('id', user.id);

    // Sign out
    await supabase.auth.signOut();
  } catch {
    return { success: false, message: 'Failed to delete account.' };
  }

  redirect('/en/login');
}
