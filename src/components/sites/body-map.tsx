'use client';

import { INJECTION_SITES, type InjectionSite } from '@/lib/sites/constants';

type Props = {
  /** Map of site ID → last used ISO timestamp */
  usageMap: Record<string, string>;
  /** The currently suggested site ID */
  suggestedSiteId?: string;
  /** The currently selected site ID */
  selectedSiteId?: string | null;
  /** Called when user taps a site dot */
  onSelectSite?: (site: InjectionSite) => void;
  locale?: string;
};

function getDotColor(
  site: InjectionSite,
  usageMap: Record<string, string>,
  suggestedSiteId?: string,
  selectedSiteId?: string | null,
): string {
  if (selectedSiteId === site.id) return '#2563eb'; // blue-600 — selected
  if (suggestedSiteId === site.id) return '#16a34a'; // green-600 — suggested
  if (usageMap[site.id]) {
    // Recently used — fade based on recency
    const lastUsed = new Date(usageMap[site.id]).getTime();
    const daysSince = (Date.now() - lastUsed) / (1000 * 60 * 60 * 24);
    if (daysSince < 3) return '#ef4444'; // red — very recent
    if (daysSince < 7) return '#f59e0b'; // amber — recent
    return '#9ca3af'; // gray — old enough
  }
  return '#d1d5db'; // gray-300 — never used
}

export function BodyMap({
  usageMap,
  suggestedSiteId,
  selectedSiteId,
  onSelectSite,
  locale = 'en',
}: Props) {
  return (
    <div className="relative mx-auto w-full max-w-xs">
      {/* Simple human silhouette SVG */}
      <svg viewBox="0 0 100 100" className="w-full" aria-label="Body map">
        {/* Head */}
        <circle cx="50" cy="10" r="6" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
        {/* Neck */}
        <rect x="48" y="16" width="4" height="4" fill="#e5e7eb" />
        {/* Torso */}
        <rect x="35" y="20" width="30" height="35" rx="4" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
        {/* Left arm */}
        <rect x="20" y="22" width="15" height="6" rx="3" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" transform="rotate(-10, 27, 25)" />
        <rect x="18" y="28" width="8" height="18" rx="3" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" transform="rotate(5, 22, 37)" />
        {/* Right arm */}
        <rect x="65" y="22" width="15" height="6" rx="3" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" transform="rotate(10, 73, 25)" />
        <rect x="74" y="28" width="8" height="18" rx="3" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" transform="rotate(-5, 78, 37)" />
        {/* Left leg */}
        <rect x="36" y="55" width="12" height="30" rx="4" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
        {/* Right leg */}
        <rect x="52" y="55" width="12" height="30" rx="4" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />

        {/* Injection site dots */}
        {INJECTION_SITES.filter((s) => s.region !== 'glute').map((site) => (
          <circle
            key={site.id}
            cx={site.x}
            cy={site.y}
            r="2.5"
            fill={getDotColor(site, usageMap, suggestedSiteId, selectedSiteId)}
            stroke="#fff"
            strokeWidth="0.5"
            className="cursor-pointer transition-all hover:r-3"
            onClick={() => onSelectSite?.(site)}
          >
            <title>
              {locale === 'ms' ? site.labelMs : site.label}
            </title>
          </circle>
        ))}
      </svg>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap justify-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-600" />
          {locale === 'ms' ? 'Dicadangkan' : 'Suggested'}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
          {'< 3d'}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
          {'< 7d'}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-gray-300" />
          {locale === 'ms' ? 'Tersedia' : 'Available'}
        </span>
      </div>
    </div>
  );
}
