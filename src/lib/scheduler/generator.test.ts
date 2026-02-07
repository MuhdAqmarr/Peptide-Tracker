import { describe, it, expect } from 'vitest';
import { generateDoses, generateDosesForProtocol } from './generator';
import type { ProtocolItem } from '@/lib/db/types';

const makeProtocol = (overrides = {}) => ({
  start_date: '2025-01-01',
  end_date: null as string | null,
  timezone: 'UTC',
  user_id: 'user-1',
  ...overrides,
});

const makeItem = (overrides: Partial<ProtocolItem> = {}): ProtocolItem => ({
  id: 'item-1',
  protocol_id: 'proto-1',
  peptide_id: 'pep-1',
  dose_value: 250,
  frequency_type: 'ED',
  interval_days: null,
  days_of_week: null,
  time_of_day: '08:00',
  site_plan_enabled: false,
  created_at: '2025-01-01T00:00:00Z',
  ...overrides,
});

describe('generateDoses', () => {
  it('generates a dose for every day with ED frequency', () => {
    const protocol = makeProtocol({ end_date: '2025-01-07' });
    const item = makeItem();
    const doses = generateDoses(protocol, item);
    expect(doses.length).toBe(7);
    expect(doses[0].status).toBe('DUE');
    expect(doses[0].user_id).toBe('user-1');
    expect(doses[0].protocol_item_id).toBe('item-1');
  });

  it('generates doses only on even days for EOD', () => {
    const protocol = makeProtocol({ end_date: '2025-01-07' });
    const item = makeItem({ frequency_type: 'EOD' });
    const doses = generateDoses(protocol, item);
    // Days 0,2,4,6 = 4 doses out of 7 days
    expect(doses.length).toBe(4);
  });

  it('generates doses only on specified weekdays for WEEKLY', () => {
    const protocol = makeProtocol({ end_date: '2025-01-14' });
    // Jan 1, 2025 = Wednesday(3), Jan 6 = Monday(1), Jan 8 = Wednesday(3), Jan 13 = Monday(1)
    const item = makeItem({ frequency_type: 'WEEKLY', days_of_week: [1, 3] });
    const doses = generateDoses(protocol, item);
    const days = doses.map((d) => new Date(d.scheduled_at).getUTCDay());
    // All scheduled days should be Monday(1) or Wednesday(3)
    for (const day of days) {
      expect([1, 3]).toContain(day);
    }
  });

  it('generates doses at custom intervals', () => {
    const protocol = makeProtocol({ end_date: '2025-01-10' });
    const item = makeItem({ frequency_type: 'CUSTOM', interval_days: 3 });
    const doses = generateDoses(protocol, item);
    // Days 0,3,6,9 = 4 doses
    expect(doses.length).toBe(4);
  });

  it('respects fromDate parameter', () => {
    const protocol = makeProtocol({ end_date: '2025-01-10' });
    const item = makeItem();
    const fromDate = new Date(2025, 0, 5); // start from Jan 5
    const doses = generateDoses(protocol, item, fromDate);
    // Jan 5-10 = 6 days
    expect(doses.length).toBe(6);
  });

  it('uses rolling window when no end_date', () => {
    const protocol = makeProtocol({ end_date: null });
    const item = makeItem();
    const doses = generateDoses(protocol, item);
    // 12 weeks = 84 days, + start day = 85 doses
    expect(doses.length).toBe(85);
  });

  it('produces ISO UTC strings for scheduled_at', () => {
    const protocol = makeProtocol({ end_date: '2025-01-02' });
    const item = makeItem({ time_of_day: '08:00' });
    const doses = generateDoses(protocol, item);
    expect(doses.length).toBeGreaterThan(0);
    // Should be valid ISO strings
    for (const dose of doses) {
      expect(dose.scheduled_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    }
  });
});

describe('generateDosesForProtocol', () => {
  it('generates doses for multiple items', () => {
    const protocol = makeProtocol({ end_date: '2025-01-03' });
    const items = [
      makeItem({ id: 'item-1' }),
      makeItem({ id: 'item-2', time_of_day: '20:00' }),
    ];
    const doses = generateDosesForProtocol(protocol, items);
    // 3 days * 2 items = 6 doses
    expect(doses.length).toBe(6);
    const item1Doses = doses.filter((d) => d.protocol_item_id === 'item-1');
    const item2Doses = doses.filter((d) => d.protocol_item_id === 'item-2');
    expect(item1Doses.length).toBe(3);
    expect(item2Doses.length).toBe(3);
  });

  it('returns empty array for empty items', () => {
    const protocol = makeProtocol({ end_date: '2025-01-03' });
    const doses = generateDosesForProtocol(protocol, []);
    expect(doses).toEqual([]);
  });
});
