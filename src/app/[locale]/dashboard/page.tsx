import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import {
  listTodayDoses,
  listUpcomingDoses,
} from '@/lib/db/dal/scheduledDoses';
import { listExpiringVials, listLowStockVials } from '@/lib/db/dal/vials';
import { listPeptides } from '@/lib/db/dal/peptides';
import { detectAndMarkMissedDoses } from '@/lib/scheduler/missed';
import { DashboardView } from './dashboard-view';
import { InventoryReminders } from '@/components/inventory/reminders';
import type { DashboardDose, Vial, Peptide } from '@/lib/db/types';

type Props = {
  params: Promise<{ locale: string }>;
};

const DEFAULT_TZ = 'Asia/Kuala_Lumpur';

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('dashboard');

  let todayDoses: DashboardDose[] = [];
  let upcomingDoses: DashboardDose[] = [];
  let expiringVials: Vial[] = [];
  let lowStockVials: Vial[] = [];
  let peptides: Peptide[] = [];

  try {
    // Mark overdue doses as missed before loading
    await detectAndMarkMissedDoses();

    [todayDoses, upcomingDoses, expiringVials, lowStockVials, peptides] =
      await Promise.all([
        listTodayDoses(DEFAULT_TZ),
        listUpcomingDoses(DEFAULT_TZ),
        listExpiringVials(),
        listLowStockVials(),
        listPeptides(),
      ]);
  } catch {
    // DB not connected — show empty dashboard
  }

  return (
    <div className="space-y-8">
      <InventoryReminders
        expiringVials={expiringVials}
        lowStockVials={lowStockVials}
        peptides={peptides}
      />

      <div>
        <h1 className="text-2xl font-bold">{t('title.today')}</h1>
        {todayDoses.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{t('empty.today')}</p>
        ) : (
          <DashboardView doses={todayDoses} />
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold">{t('title.upcoming')}</h2>
        {upcomingDoses.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{t('empty.upcoming')}</p>
        ) : (
          <DashboardView doses={upcomingDoses} showActions={false} />
        )}
      </div>

      <div className="flex gap-6 pt-2">
        <Link
          href={`/${locale}/dashboard/history`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {t('nav.viewHistory')} &rarr;
        </Link>
        <Link
          href={`/${locale}/dashboard/sites`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {t('nav.sitePlanner')} &rarr;
        </Link>
      </div>
    </div>
  );
}
