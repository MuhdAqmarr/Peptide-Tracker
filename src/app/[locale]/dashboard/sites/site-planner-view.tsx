'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { BodyMap } from '@/components/sites/body-map';
import { getSiteLabel } from '@/lib/sites/constants';
import type { InjectionSite } from '@/lib/sites/constants';

type Props = {
  usageMap: Record<string, string>;
  suggestedSiteId: string;
  locale: string;
  recentLogs: { site: string; actual_time: string }[];
};

export function SitePlannerView({
  usageMap,
  suggestedSiteId,
  locale,
  recentLogs,
}: Props) {
  const t = useTranslations('sites');
  const [selectedSite, setSelectedSite] = useState<InjectionSite | null>(null);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <BodyMap
          usageMap={usageMap}
          suggestedSiteId={suggestedSiteId}
          selectedSiteId={selectedSite?.id}
          onSelectSite={setSelectedSite}
          locale={locale}
        />
      </div>

      <div className="space-y-4">
        {selectedSite && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h3 className="text-sm font-medium text-blue-900">
              {locale === 'ms' ? selectedSite.labelMs : selectedSite.label}
            </h3>
            <p className="mt-1 text-xs text-blue-700">
              {usageMap[selectedSite.id]
                ? `${t('lastUsed')}: ${new Date(usageMap[selectedSite.id]).toLocaleDateString(locale, { dateStyle: 'medium' })}`
                : t('neverUsed')}
            </p>
          </div>
        )}

        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-700">
            {t('recentHistory')}
          </h3>
          {recentLogs.length === 0 ? (
            <p className="text-sm text-gray-400">{t('noHistory')}</p>
          ) : (
            <ul className="space-y-1">
              {recentLogs.slice(0, 10).map((log, i) => (
                <li
                  key={i}
                  className="flex justify-between text-sm text-gray-600"
                >
                  <span>{getSiteLabel(log.site, locale)}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(log.actual_time).toLocaleDateString(locale, {
                      dateStyle: 'short',
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
