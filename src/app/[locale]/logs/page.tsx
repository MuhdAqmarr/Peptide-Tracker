import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { listSymptomLogs } from '@/lib/db/dal/symptomLogs';
import { SymptomLogsList } from './symptom-logs-list';
import type { SymptomLog } from '@/lib/db/types';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LogsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('logs');

  let logs: SymptomLog[] = [];
  try {
    logs = await listSymptomLogs();
  } catch {
    // DB not connected
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">{t('symptoms.title')}</h1>
      <p className="mt-1 text-sm text-gray-500">{t('symptoms.helper')}</p>
      <SymptomLogsList logs={logs} />
    </div>
  );
}
