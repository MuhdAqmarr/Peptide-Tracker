import { describe, it, expect } from 'vitest';
import { INJECTION_SITES, getSiteById, getSiteLabel } from './constants';

describe('INJECTION_SITES', () => {
  it('has unique IDs', () => {
    const ids = INJECTION_SITES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all sites have valid coordinates (0-100)', () => {
    for (const site of INJECTION_SITES) {
      expect(site.x).toBeGreaterThanOrEqual(0);
      expect(site.x).toBeLessThanOrEqual(100);
      expect(site.y).toBeGreaterThanOrEqual(0);
      expect(site.y).toBeLessThanOrEqual(100);
    }
  });

  it('all sites have both English and Malay labels', () => {
    for (const site of INJECTION_SITES) {
      expect(site.label.length).toBeGreaterThan(0);
      expect(site.labelMs.length).toBeGreaterThan(0);
    }
  });
});

describe('getSiteById', () => {
  it('returns the site with matching ID', () => {
    const site = getSiteById('abd-upper-left');
    expect(site).toBeDefined();
    expect(site!.label).toBe('Upper Left Abdomen');
  });

  it('returns undefined for unknown ID', () => {
    expect(getSiteById('nonexistent')).toBeUndefined();
  });
});

describe('getSiteLabel', () => {
  it('returns English label for en locale', () => {
    expect(getSiteLabel('abd-upper-left', 'en')).toBe('Upper Left Abdomen');
  });

  it('returns Malay label for ms locale', () => {
    expect(getSiteLabel('abd-upper-left', 'ms')).toBe('Abdomen Atas Kiri');
  });

  it('returns ID when site is not found', () => {
    expect(getSiteLabel('nonexistent', 'en')).toBe('nonexistent');
  });
});
