import { describe, it, expect } from 'vitest';
import { suggestNextSite, buildSiteUsageMap } from './rotation';
import { INJECTION_SITES } from './constants';

describe('suggestNextSite', () => {
  it('suggests the first site when no history', () => {
    const site = suggestNextSite([]);
    expect(site.id).toBe(INJECTION_SITES[0].id);
  });

  it('suggests the first unused site', () => {
    const site = suggestNextSite([INJECTION_SITES[0].id]);
    expect(site.id).toBe(INJECTION_SITES[1].id);
  });

  it('skips over used sites to find first unused', () => {
    const used = INJECTION_SITES.slice(0, 3).map((s) => s.id);
    const site = suggestNextSite(used);
    expect(site.id).toBe(INJECTION_SITES[3].id);
  });

  it('suggests the least recently used site when all are used', () => {
    // Use all sites in order, most recent first
    const recentIds = INJECTION_SITES.map((s) => s.id);
    const site = suggestNextSite(recentIds);
    // The last element in recentIds is the least recently used (furthest index)
    expect(site.id).toBe(recentIds[recentIds.length - 1]);
  });

  it('handles repeated site usage', () => {
    // Site 0 used twice recently, site 1 used once further back
    const recentIds = [
      INJECTION_SITES[0].id,
      INJECTION_SITES[0].id,
      INJECTION_SITES[1].id,
    ];
    // Sites 2+ are unused, so first unused should be suggested
    const site = suggestNextSite(recentIds);
    expect(site.id).toBe(INJECTION_SITES[2].id);
  });
});

describe('buildSiteUsageMap', () => {
  it('returns empty map for empty logs', () => {
    const map = buildSiteUsageMap([]);
    expect(map.size).toBe(0);
  });

  it('maps site to its most recent time (first occurrence)', () => {
    const logs = [
      { site: 'abd-upper-left', actual_time: '2025-01-03T10:00:00Z' },
      { site: 'abd-upper-left', actual_time: '2025-01-01T10:00:00Z' },
    ];
    const map = buildSiteUsageMap(logs);
    expect(map.get('abd-upper-left')).toBe('2025-01-03T10:00:00Z');
  });

  it('ignores logs with null site', () => {
    const logs = [
      { site: null, actual_time: '2025-01-01T10:00:00Z' },
      { site: 'abd-upper-left', actual_time: '2025-01-02T10:00:00Z' },
    ];
    const map = buildSiteUsageMap(logs);
    expect(map.size).toBe(1);
    expect(map.has('abd-upper-left')).toBe(true);
  });

  it('handles multiple different sites', () => {
    const logs = [
      { site: 'abd-upper-left', actual_time: '2025-01-03T10:00:00Z' },
      { site: 'thigh-upper-left', actual_time: '2025-01-02T10:00:00Z' },
      { site: 'arm-left', actual_time: '2025-01-01T10:00:00Z' },
    ];
    const map = buildSiteUsageMap(logs);
    expect(map.size).toBe(3);
  });
});
