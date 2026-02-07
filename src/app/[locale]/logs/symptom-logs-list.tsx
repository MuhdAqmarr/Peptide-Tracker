'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import type { SymptomLog } from '@/lib/db/types';
import { SymptomLogForm } from '@/components/forms/symptom-log-form';
import { deleteSymptomLogAction } from './actions';

type Props = {
  logs: SymptomLog[];
};

const SCORE_LABELS = ['nausea', 'headache', 'sleep', 'appetite'] as const;

export function SymptomLogsList({ logs }: Props) {
  const t = useTranslations('logs');
  const tc = useTranslations('common');
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  const handleSuccess = useCallback(() => {
    setShowForm(false);
    router.refresh();
  }, [router]);

  async function handleDelete(id: string) {
    const result = await deleteSymptomLogAction(id);
    if (result.success) router.refresh();
  }

  function formatScore(
    log: SymptomLog,
    key: (typeof SCORE_LABELS)[number],
  ): string | null {
    const value = log[key];
    if (value === null || value === undefined) return null;
    return `${t(`symptoms.${key}`)}: ${value}/10`;
  }

  return (
    <div className="mt-6 space-y-4">
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + {t('symptoms.title')}
        </button>
      )}

      {showForm && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <SymptomLogForm
            onSuccess={handleSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {logs.length === 0 && !showForm && (
        <p className="text-sm text-gray-500">{t('symptoms.empty')}</p>
      )}

      <div className="space-y-3">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-start sm:justify-between"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">
                {new Date(log.log_time).toLocaleString([], {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
              <div className="mt-1 flex flex-wrap gap-3 text-sm text-gray-500">
                {SCORE_LABELS.map((key) => {
                  const str = formatScore(log, key);
                  return str ? <span key={key}>{str}</span> : null;
                })}
              </div>
              {log.notes && (
                <p className="mt-1 text-xs text-gray-400">{log.notes}</p>
              )}
            </div>
            <button
              onClick={() => handleDelete(log.id)}
              className="self-start rounded px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              {tc('actions.delete')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
