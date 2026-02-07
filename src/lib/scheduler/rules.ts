import type { FrequencyType } from '@/lib/db/types';

/**
 * Given a frequency configuration, determines whether a specific date
 * should have a scheduled dose.
 *
 * All dates are in local calendar dates (no timezone math here —
 * the generator handles timezone conversion).
 */

export function shouldScheduleOnDate(
  date: Date,
  startDate: Date,
  frequencyType: FrequencyType,
  intervalDays: number | null,
  daysOfWeek: number[] | null,
): boolean {
  switch (frequencyType) {
    case 'ED':
      // Every Day — always schedule
      return true;

    case 'EOD': {
      // Every Other Day — schedule if day offset from start is even
      const diffMs = date.getTime() - startDate.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      return diffDays % 2 === 0;
    }

    case 'WEEKLY': {
      // Weekly — schedule on specific days of week (0=Sun..6=Sat)
      if (!daysOfWeek || daysOfWeek.length === 0) return false;
      return daysOfWeek.includes(date.getDay());
    }

    case 'CUSTOM': {
      // Custom interval — schedule every N days from start
      if (!intervalDays || intervalDays <= 0) return false;
      const diffMs = date.getTime() - startDate.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      return diffDays % intervalDays === 0;
    }

    default:
      return false;
  }
}

/**
 * Returns the rolling window end date: min(start + weeks, endDate).
 * Default rolling window is 12 weeks.
 */
export function getRollingEndDate(
  startDate: Date,
  endDate: Date | null,
  rollingWeeks: number = 12,
): Date {
  const rollingEnd = new Date(startDate);
  rollingEnd.setDate(rollingEnd.getDate() + rollingWeeks * 7);

  if (endDate && endDate < rollingEnd) {
    return endDate;
  }

  return rollingEnd;
}
