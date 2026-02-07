'use client';

import { useTranslations } from 'next-intl';
import type { DashboardDose } from '@/lib/db/types';

type Props = {
  doses: DashboardDose[];
};

const STATUS_STYLES: Record<string, string> = {
  DUE: 'bg-blue-100 text-blue-700',
  DONE: 'bg-green-100 text-green-700',
  SKIPPED: 'bg-gray-100 text-gray-500',
  MISSED: 'bg-red-100 text-red-700',
};

export function HistoryView({ doses }: Props) {
  const tc = useTranslations('common');

  return (
    <div className="mt-4 space-y-3">
      {doses.map((dose) => (
        <div
          key={dose.id}
          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
        >
          <div>
            <div className="flex items-center gap-2">
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
              {dose.protocol_name} &middot;{' '}
              {new Date(dose.scheduled_at).toLocaleDateString()} {' '}
              {new Date(dose.scheduled_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            {dose.done_at && (
              <p className="text-xs text-green-600">
                {tc('status.done')}: {new Date(dose.done_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
