import type { ProtocolItem, Protocol } from '@/lib/db/types';
import { shouldScheduleOnDate, getRollingEndDate } from './rules';

type GeneratedDose = {
  protocol_item_id: string;
  user_id: string;
  scheduled_at: string; // ISO 8601 UTC
  status: string;
};

/**
 * Generates scheduled dose records for a protocol item.
 *
 * Logic:
 * 1. Iterate dates from max(protocol.start_date, fromDate) to
 *    min(protocol.start_date + 12 weeks, protocol.end_date).
 * 2. For each date, check the frequency rule.
 * 3. Combine date + time_of_day in the protocol's timezone, convert to UTC.
 *
 * The generator is idempotent — caller should upsert with
 * ON CONFLICT (protocol_item_id, scheduled_at) DO NOTHING.
 */
export function generateDoses(
  protocol: Pick<Protocol, 'start_date' | 'end_date' | 'timezone' | 'user_id'>,
  item: ProtocolItem,
  fromDate?: Date,
): GeneratedDose[] {
  const doses: GeneratedDose[] = [];

  const startDate = parseLocalDate(protocol.start_date);
  const endDate = protocol.end_date
    ? parseLocalDate(protocol.end_date)
    : null;
  const rollingEnd = getRollingEndDate(startDate, endDate);

  // If fromDate is specified (e.g. for extending), start from there
  const effectiveStart =
    fromDate && fromDate > startDate ? fromDate : startDate;

  const current = new Date(effectiveStart);

  while (current <= rollingEnd) {
    const shouldSchedule = shouldScheduleOnDate(
      current,
      startDate,
      item.frequency_type,
      item.interval_days,
      item.days_of_week,
    );

    if (shouldSchedule) {
      const scheduledAt = combineDateTimeToUTC(
        current,
        item.time_of_day,
        protocol.timezone,
      );

      doses.push({
        protocol_item_id: item.id,
        user_id: protocol.user_id,
        scheduled_at: scheduledAt,
        status: 'DUE',
      });
    }

    // Advance to next day
    current.setDate(current.getDate() + 1);
  }

  return doses;
}

/**
 * Generates doses for ALL items in a protocol.
 */
export function generateDosesForProtocol(
  protocol: Pick<
    Protocol,
    'start_date' | 'end_date' | 'timezone' | 'user_id'
  >,
  items: ProtocolItem[],
  fromDate?: Date,
): GeneratedDose[] {
  return items.flatMap((item) => generateDoses(protocol, item, fromDate));
}

/**
 * Parse a 'YYYY-MM-DD' string into a Date at midnight local.
 */
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Combines a local calendar date + time-of-day string ('HH:MM' or 'HH:MM:SS')
 * in the given timezone, and returns an ISO 8601 UTC string.
 *
 * Uses Intl.DateTimeFormat to compute the UTC offset for the target timezone.
 */
function combineDateTimeToUTC(
  date: Date,
  timeOfDay: string,
  timezone: string,
): string {
  const [hours, minutes] = timeOfDay.split(':').map(Number);

  // Build a date string for the target timezone
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(hours).padStart(2, '0');
  const min = String(minutes).padStart(2, '0');

  // Create a date in the target timezone using a known approach:
  // Format: "YYYY-MM-DDTHH:MM:00" interpreted in the target timezone.
  const localStr = `${year}-${month}-${day}T${hour}:${min}:00`;

  // Use the timezone-aware formatter to get the UTC equivalent
  const utcDate = dateInTimezone(localStr, timezone);
  return utcDate.toISOString();
}

/**
 * Converts a "wall clock" datetime string to a UTC Date by computing
 * the UTC offset for the specified timezone.
 */
function dateInTimezone(localDateStr: string, timezone: string): Date {
  // Parse as if UTC first
  const asUTC = new Date(localDateStr + 'Z');

  // Get what that UTC instant looks like in the target timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(asUTC);
  const get = (type: string) =>
    parseInt(parts.find((p) => p.type === type)?.value ?? '0', 10);

  const tzYear = get('year');
  const tzMonth = get('month');
  const tzDay = get('day');
  const tzHour = get('hour') === 24 ? 0 : get('hour');
  const tzMinute = get('minute');

  // Original "wall clock" values we want
  const wantDate = new Date(localDateStr + 'Z');
  const wantYear = wantDate.getUTCFullYear();
  const wantMonth = wantDate.getUTCMonth() + 1;
  const wantDay = wantDate.getUTCDate();
  const wantHour = wantDate.getUTCHours();
  const wantMinute = wantDate.getUTCMinutes();

  // The difference between "what we want" and "what tz shows" is the offset
  const wantTotal =
    new Date(
      Date.UTC(wantYear, wantMonth - 1, wantDay, wantHour, wantMinute),
    ).getTime();
  const tzTotal =
    new Date(
      Date.UTC(tzYear, tzMonth - 1, tzDay, tzHour, tzMinute),
    ).getTime();

  const offsetMs = tzTotal - wantTotal;

  // The UTC time we want = asUTC - offset
  return new Date(asUTC.getTime() - offsetMs);
}
