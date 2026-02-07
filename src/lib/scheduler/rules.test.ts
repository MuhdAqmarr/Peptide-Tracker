import { describe, it, expect } from 'vitest';
import { shouldScheduleOnDate, getRollingEndDate } from './rules';

describe('shouldScheduleOnDate', () => {
  const start = new Date(2025, 0, 1); // Jan 1, 2025

  describe('ED (Every Day)', () => {
    it('always returns true', () => {
      expect(shouldScheduleOnDate(new Date(2025, 0, 1), start, 'ED', null, null)).toBe(true);
      expect(shouldScheduleOnDate(new Date(2025, 0, 2), start, 'ED', null, null)).toBe(true);
      expect(shouldScheduleOnDate(new Date(2025, 5, 15), start, 'ED', null, null)).toBe(true);
    });
  });

  describe('EOD (Every Other Day)', () => {
    it('returns true on start date (day 0, even)', () => {
      expect(shouldScheduleOnDate(new Date(2025, 0, 1), start, 'EOD', null, null)).toBe(true);
    });

    it('returns false on day 1 (odd)', () => {
      expect(shouldScheduleOnDate(new Date(2025, 0, 2), start, 'EOD', null, null)).toBe(false);
    });

    it('returns true on day 2 (even)', () => {
      expect(shouldScheduleOnDate(new Date(2025, 0, 3), start, 'EOD', null, null)).toBe(true);
    });

    it('alternates correctly over a week', () => {
      const results = [];
      for (let d = 0; d < 7; d++) {
        results.push(
          shouldScheduleOnDate(new Date(2025, 0, 1 + d), start, 'EOD', null, null),
        );
      }
      expect(results).toEqual([true, false, true, false, true, false, true]);
    });
  });

  describe('WEEKLY', () => {
    it('returns true when day of week is in the list', () => {
      // Jan 6, 2025 = Monday (1)
      expect(shouldScheduleOnDate(new Date(2025, 0, 6), start, 'WEEKLY', null, [1, 3, 5])).toBe(true);
    });

    it('returns false when day of week is not in the list', () => {
      // Jan 7, 2025 = Tuesday (2)
      expect(shouldScheduleOnDate(new Date(2025, 0, 7), start, 'WEEKLY', null, [1, 3, 5])).toBe(false);
    });

    it('returns false when daysOfWeek is null', () => {
      expect(shouldScheduleOnDate(new Date(2025, 0, 6), start, 'WEEKLY', null, null)).toBe(false);
    });

    it('returns false when daysOfWeek is empty', () => {
      expect(shouldScheduleOnDate(new Date(2025, 0, 6), start, 'WEEKLY', null, [])).toBe(false);
    });

    it('handles Sunday (0) correctly', () => {
      // Jan 5, 2025 = Sunday (0)
      expect(shouldScheduleOnDate(new Date(2025, 0, 5), start, 'WEEKLY', null, [0])).toBe(true);
    });
  });

  describe('CUSTOM interval', () => {
    it('returns true on start date', () => {
      expect(shouldScheduleOnDate(new Date(2025, 0, 1), start, 'CUSTOM', 3, null)).toBe(true);
    });

    it('returns true every N days', () => {
      expect(shouldScheduleOnDate(new Date(2025, 0, 4), start, 'CUSTOM', 3, null)).toBe(true);
      expect(shouldScheduleOnDate(new Date(2025, 0, 7), start, 'CUSTOM', 3, null)).toBe(true);
    });

    it('returns false on non-interval days', () => {
      expect(shouldScheduleOnDate(new Date(2025, 0, 2), start, 'CUSTOM', 3, null)).toBe(false);
      expect(shouldScheduleOnDate(new Date(2025, 0, 3), start, 'CUSTOM', 3, null)).toBe(false);
    });

    it('returns false when intervalDays is null', () => {
      expect(shouldScheduleOnDate(new Date(2025, 0, 1), start, 'CUSTOM', null, null)).toBe(false);
    });

    it('returns false when intervalDays is 0', () => {
      expect(shouldScheduleOnDate(new Date(2025, 0, 1), start, 'CUSTOM', 0, null)).toBe(false);
    });
  });

  describe('unknown frequency type', () => {
    it('returns false', () => {
      expect(shouldScheduleOnDate(new Date(2025, 0, 1), start, 'INVALID' as never, null, null)).toBe(false);
    });
  });
});

describe('getRollingEndDate', () => {
  const start = new Date(2025, 0, 1); // Jan 1, 2025

  it('returns start + 12 weeks by default when no endDate', () => {
    const result = getRollingEndDate(start, null);
    const expected = new Date(2025, 0, 1 + 12 * 7); // 84 days later
    expect(result.getTime()).toBe(expected.getTime());
  });

  it('returns endDate when it is before rolling window', () => {
    const endDate = new Date(2025, 1, 1); // Feb 1 (31 days, < 84 days)
    const result = getRollingEndDate(start, endDate);
    expect(result.getTime()).toBe(endDate.getTime());
  });

  it('returns rolling end when endDate is after rolling window', () => {
    const endDate = new Date(2026, 0, 1); // Jan 1, 2026 (way past 84 days)
    const result = getRollingEndDate(start, endDate);
    const expected = new Date(2025, 0, 1 + 12 * 7);
    expect(result.getTime()).toBe(expected.getTime());
  });

  it('respects custom rollingWeeks parameter', () => {
    const result = getRollingEndDate(start, null, 4);
    const expected = new Date(2025, 0, 1 + 4 * 7);
    expect(result.getTime()).toBe(expected.getTime());
  });
});
