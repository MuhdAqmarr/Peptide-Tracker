import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { listHistoryDoses } from '@/lib/db/dal/scheduledDoses';
import { HistoryView } from './history-view';
import type { DashboardDose } from '@/lib/db/types';

type Props = {
  params: Promise<{ locale: string }>;
};

const DEFAULT_TZ = 'Asia/Kuala_Lumpur';

export default async function HistoryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('dashboard');

  let history: DashboardDose[] = [];

  try {
    history = await listHistoryDoses(DEFAULT_TZ);
  } catch {
    // DB not connected
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">{t('title.history')}</h1>
      {history.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">{t('empty.history')}</p>
      ) : (
        <HistoryView doses={history} />
      )}
    </div>
  );
}
