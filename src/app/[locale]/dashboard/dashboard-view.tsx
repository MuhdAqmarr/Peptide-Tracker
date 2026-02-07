'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import type { DashboardDose } from '@/lib/db/types';
import { markDoneAction, markSkippedAction } from './actions';
import { InjectionLogForm } from '@/components/forms/injection-log-form';

type Props = {
  doses: DashboardDose[];
  showActions?: boolean;
};

const STATUS_STYLES: Record<string, string> = {
  DUE: 'bg-blue-100 text-blue-700',
  DONE: 'bg-green-100 text-green-700',
  SKIPPED: 'bg-gray-100 text-gray-500',
  MISSED: 'bg-red-100 text-red-700',
};

export function DashboardView({ doses, showActions = true }: Props) {
  const t = useTranslations('dashboard');
  const tc = useTranslations('common');
  const router = useRouter();
  const [loggingDoseId, setLoggingDoseId] = useState<string | null>(null);

  async function handleMarkDone(doseId: string) {
    const result = await markDoneAction(doseId);
    if (result.success) router.refresh();
  }

  async function handleSkip(doseId: string) {
    const result = await markSkippedAction(doseId);
    if (result.success) router.refresh();
  }

  const handleLogSuccess = useCallback(() => {
    setLoggingDoseId(null);
    router.refresh();
  }, [router]);

  return (
    <div className="mt-4 space-y-3">
      {doses.map((dose) => (
        <div key={dose.id}>
          <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium text-gray-900">
                  {dose.peptide_name}
                </h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[dose.status] ?? ''}`}
                >
                  {tc(`status.${dose.status.toLowerCase()}` as 'status.due')}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {dose.dose_value} {dose.peptide_unit} &middot;{' '}
                {dose.protocol_name} &middot; {t('card.scheduled')}{' '}
                {new Date(dose.scheduled_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {showActions && dose.status === 'DUE' && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleMarkDone(dose.id)}
                  className="rounded-md bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700"
                >
                  {t('actions.markDone')}
                </button>
                <button
                  onClick={() => setLoggingDoseId(dose.id)}
                  className="rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
                >
                  {t('actions.logDetails')}
                </button>
                <button
                  onClick={() => handleSkip(dose.id)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  {t('actions.skip')}
                </button>
              </div>
            )}
          </div>

          {loggingDoseId === dose.id && (
            <div className="mt-2 rounded-lg border border-blue-200 bg-white p-4">
              <h4 className="mb-3 text-sm font-medium text-gray-700">
                {t('modal.logDetails.title')}
              </h4>
              <p className="mb-3 text-xs text-gray-400">
                {t('modal.logDetails.helper')}
              </p>
              <InjectionLogForm
                doseId={dose.id}
                onSuccess={handleLogSuccess}
                onCancel={() => setLoggingDoseId(null)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
