import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function fetchAllUserData(userId: string) {
  const supabase = await createClient();

  const [peptides, protocols, protocolItems, scheduledDoses, injectionLogs, symptomLogs, vials] =
    await Promise.all([
      supabase.from('peptides').select('*').eq('user_id', userId),
      supabase.from('protocols').select('*').eq('user_id', userId),
      supabase.from('protocol_items').select('*'),
      supabase.from('scheduled_doses').select('*').eq('user_id', userId),
      supabase.from('injection_logs').select('*').eq('user_id', userId),
      supabase.from('symptom_logs').select('*').eq('user_id', userId),
      supabase.from('vials').select('*').eq('user_id', userId),
    ]);

  return {
    peptides: peptides.data ?? [],
    protocols: protocols.data ?? [],
    protocol_items: protocolItems.data ?? [],
    scheduled_doses: scheduledDoses.data ?? [],
    injection_logs: injectionLogs.data ?? [],
    symptom_logs: symptomLogs.data ?? [],
    vials: vials.data ?? [],
  };
}

function toCsv(data: Record<string, unknown[]>): string {
  const sections: string[] = [];

  for (const [tableName, rows] of Object.entries(data)) {
    if (rows.length === 0) continue;
    const headers = Object.keys(rows[0] as Record<string, unknown>);
    const csvRows = rows.map((row) => {
      const r = row as Record<string, unknown>;
      return headers
        .map((h) => {
          const val = r[h];
          if (val === null || val === undefined) return '';
          const str = String(val);
          return str.includes(',') || str.includes('"') || str.includes('\n')
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        })
        .join(',');
    });

    sections.push(`# ${tableName}`);
    sections.push(headers.join(','));
    sections.push(...csvRows);
    sections.push('');
  }

  return sections.join('\n');
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const format = request.nextUrl.searchParams.get('format') ?? 'json';
  const data = await fetchAllUserData(user.id);

  if (format === 'csv') {
    const csv = toCsv(data);
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="protocolpal-export.csv"',
      },
    });
  }

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="protocolpal-export.json"',
    },
  });
}
