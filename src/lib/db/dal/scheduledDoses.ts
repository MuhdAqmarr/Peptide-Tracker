import { createClient } from '@/lib/supabase/server';
import type { ScheduledDose, DashboardDose, DoseStatus } from '../types';

export async function upsertScheduledDoses(
  doses: {
    protocol_item_id: string;
    user_id: string;
    scheduled_at: string;
    status: string;
  }[],
): Promise<void> {
  if (doses.length === 0) return;
  const supabase = await createClient();

  // Upsert in batches of 500 to avoid payload limits
  const batchSize = 500;
  for (let i = 0; i < doses.length; i += batchSize) {
    const batch = doses.slice(i, i + batchSize);
    const { error } = await supabase
      .from('scheduled_doses')
      .upsert(batch, {
        onConflict: 'protocol_item_id,scheduled_at',
        ignoreDuplicates: true,
      });

    if (error) throw error;
  }
}

export async function listScheduledDosesByItem(
  protocolItemId: string,
): Promise<ScheduledDose[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('scheduled_doses')
    .select('*')
    .eq('protocol_item_id', protocolItemId)
    .order('scheduled_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as ScheduledDose[];
}

export async function deleteScheduledDosesByItem(
  protocolItemId: string,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('scheduled_doses')
    .delete()
    .eq('protocol_item_id', protocolItemId);

  if (error) throw error;
}

export async function countScheduledDosesByItem(
  protocolItemId: string,
): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('scheduled_doses')
    .select('*', { count: 'exact', head: true })
    .eq('protocol_item_id', protocolItemId);

  if (error) throw error;
  return count ?? 0;
}

// ---------------------------------------------------------------------------
// Dashboard queries
// ---------------------------------------------------------------------------

/**
 * Fetch scheduled doses for a given UTC date range, joined with protocol_item
 * and peptide data. Returns DashboardDose[].
 */
async function fetchDosesInRange(
  from: string,
  to: string,
  statuses?: DoseStatus[],
): Promise<DashboardDose[]> {
  const supabase = await createClient();
  let query = supabase
    .from('scheduled_doses')
    .select(
      `
      *,
      protocol_items!inner (
        dose_value,
        time_of_day,
        peptides!inner ( name, unit ),
        protocols!inner ( name )
      )
    `,
    )
    .gte('scheduled_at', from)
    .lt('scheduled_at', to)
    .order('scheduled_at', { ascending: true });

  if (statuses && statuses.length > 0) {
    query = query.in('status', statuses);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((row: Record<string, unknown>) => {
    const pi = row.protocol_items as Record<string, unknown>;
    const pep = pi.peptides as Record<string, string>;
    const proto = pi.protocols as Record<string, string>;
    return {
      id: row.id as string,
      protocol_item_id: row.protocol_item_id as string,
      user_id: row.user_id as string,
      scheduled_at: row.scheduled_at as string,
      status: row.status as DoseStatus,
      done_at: row.done_at as string | null,
      created_at: row.created_at as string,
      peptide_name: pep.name,
      peptide_unit: pep.unit,
      dose_value: pi.dose_value as number,
      protocol_name: proto.name,
      time_of_day: pi.time_of_day as string,
    };
  });
}

/** Today's doses (DUE + DONE + SKIPPED for today in the user's timezone). */
export async function listTodayDoses(
  timezone: string,
): Promise<DashboardDose[]> {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const localDate = formatter.format(now); // YYYY-MM-DD

  // Convert local day boundaries to UTC
  const startLocal = `${localDate}T00:00:00`;
  const endLocal = `${localDate}T23:59:59`;

  const startUtc = zonedToUtc(startLocal, timezone);
  const endUtc = zonedToUtc(endLocal, timezone);

  return fetchDosesInRange(startUtc, endUtc);
}

/** Upcoming doses: next 7 days after today, only DUE status. */
export async function listUpcomingDoses(
  timezone: string,
): Promise<DashboardDose[]> {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const localDate = formatter.format(now);

  // Start from tomorrow
  const tomorrow = new Date(localDate + 'T00:00:00');
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  const weekLater = new Date(tomorrow);
  weekLater.setDate(weekLater.getDate() + 7);
  const weekLaterStr = weekLater.toISOString().slice(0, 10);

  const startUtc = zonedToUtc(`${tomorrowStr}T00:00:00`, timezone);
  const endUtc = zonedToUtc(`${weekLaterStr}T00:00:00`, timezone);

  return fetchDosesInRange(startUtc, endUtc, ['DUE']);
}

/** History: past doses (before today), all statuses. */
export async function listHistoryDoses(
  timezone: string,
  limit = 50,
): Promise<DashboardDose[]> {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const localDate = formatter.format(now);
  const todayStartUtc = zonedToUtc(`${localDate}T00:00:00`, timezone);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('scheduled_doses')
    .select(
      `
      *,
      protocol_items!inner (
        dose_value,
        time_of_day,
        peptides!inner ( name, unit ),
        protocols!inner ( name )
      )
    `,
    )
    .lt('scheduled_at', todayStartUtc)
    .order('scheduled_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((row: Record<string, unknown>) => {
    const pi = row.protocol_items as Record<string, unknown>;
    const pep = pi.peptides as Record<string, string>;
    const proto = pi.protocols as Record<string, string>;
    return {
      id: row.id as string,
      protocol_item_id: row.protocol_item_id as string,
      user_id: row.user_id as string,
      scheduled_at: row.scheduled_at as string,
      status: row.status as DoseStatus,
      done_at: row.done_at as string | null,
      created_at: row.created_at as string,
      peptide_name: pep.name,
      peptide_unit: pep.unit,
      dose_value: pi.dose_value as number,
      protocol_name: proto.name,
      time_of_day: pi.time_of_day as string,
    };
  });
}

/** Mark a dose as DONE. */
export async function markDoseDone(doseId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('scheduled_doses')
    .update({ status: 'DONE', done_at: new Date().toISOString() })
    .eq('id', doseId);
  if (error) throw error;
}

/** Mark a dose as SKIPPED. */
export async function markDoseSkipped(doseId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('scheduled_doses')
    .update({ status: 'SKIPPED' })
    .eq('id', doseId);
  if (error) throw error;
}

/** Mark overdue DUE doses as MISSED. */
export async function markOverdueDosesAsMissed(
  cutoffUtc: string,
): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('scheduled_doses')
    .update({ status: 'MISSED' })
    .eq('status', 'DUE')
    .lt('scheduled_at', cutoffUtc)
    .select('id');
  if (error) throw error;
  return data?.length ?? 0;
}

// ---------------------------------------------------------------------------
// Timezone helpers
// ---------------------------------------------------------------------------

/** Convert a local datetime string to a UTC ISO string. */
function zonedToUtc(localDatetime: string, timezone: string): string {
  // Build a date in the target timezone by computing the offset
  const date = new Date(localDatetime);

  // Get the UTC time that corresponds to localDatetime in the given timezone
  // We use Intl.DateTimeFormat to find the timezone offset
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(
    date.toLocaleString('en-US', { timeZone: timezone }),
  );
  const offsetMs = utcDate.getTime() - tzDate.getTime();

  return new Date(date.getTime() + offsetMs).toISOString();
}
