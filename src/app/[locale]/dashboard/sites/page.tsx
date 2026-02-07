import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { listRecentSiteUsage } from '@/lib/db/dal/injectionLogs';
import { suggestNextSite, buildSiteUsageMap } from '@/lib/sites/rotation';
import { SitePlannerView } from './site-planner-view';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SitePlannerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('sites');

  let recentLogs: { site: string; actual_time: string }[] = [];

  try {
    recentLogs = await listRecentSiteUsage();
  } catch {
    // DB not connected
  }

  const usageMap = Object.fromEntries(
    buildSiteUsageMap(recentLogs.map((l) => ({ site: l.site, actual_time: l.actual_time }))),
  );
  const recentSiteIds = recentLogs.map((l) => l.site);
  const suggested = suggestNextSite(recentSiteIds);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="mt-1 text-sm text-gray-500">{t('helper')}</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-1 text-lg font-semibold">{t('suggested')}</h2>
        <p className="mb-4 text-sm text-green-600">
          {locale === 'ms' ? suggested.labelMs : suggested.label}
        </p>

        <SitePlannerView
          usageMap={usageMap}
          suggestedSiteId={suggested.id}
          locale={locale}
          recentLogs={recentLogs}
        />
      </div>
    </div>
  );
}
