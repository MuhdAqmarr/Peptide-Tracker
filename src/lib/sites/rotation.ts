import { INJECTION_SITES, type InjectionSite } from './constants';

/**
 * Suggest the next injection site based on recent usage history.
 *
 * Strategy: round-robin through all sites, picking the one that was
 * used least recently (or never used). Ties are broken by the natural
 * order defined in INJECTION_SITES.
 *
 * @param recentSiteIds - Array of site IDs from recent injection logs,
 *   ordered from most recent to oldest.
 * @returns The suggested InjectionSite.
 */
export function suggestNextSite(
  recentSiteIds: string[],
): InjectionSite {
  // Sites that have never been used come first
  const usedSet = new Set(recentSiteIds);
  const unused = INJECTION_SITES.filter((s) => !usedSet.has(s.id));
  if (unused.length > 0) {
    return unused[0];
  }

  // All sites have been used at least once.
  // Pick the site whose most-recent use is oldest (furthest back in the array).
  let bestSite = INJECTION_SITES[0];
  let bestIndex = -1;

  for (const site of INJECTION_SITES) {
    const lastUsedIndex = recentSiteIds.indexOf(site.id);
    if (lastUsedIndex > bestIndex) {
      bestIndex = lastUsedIndex;
      bestSite = site;
    }
  }

  return bestSite;
}

/**
 * Build a usage map showing when each site was last used.
 *
 * @param logs - Array of { site, actual_time } from injection_logs.
 * @returns Map from site ID to last-used ISO timestamp.
 */
export function buildSiteUsageMap(
  logs: { site: string | null; actual_time: string }[],
): Map<string, string> {
  const map = new Map<string, string>();
  for (const log of logs) {
    if (log.site && !map.has(log.site)) {
      map.set(log.site, log.actual_time);
    }
  }
  return map;
}
