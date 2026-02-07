'use client';

import { useTranslations } from 'next-intl';
import type { Vial, Peptide } from '@/lib/db/types';

type Props = {
  expiringVials: Vial[];
  lowStockVials: Vial[];
  peptides: Peptide[];
};

export function InventoryReminders({
  expiringVials,
  lowStockVials,
  peptides,
}: Props) {
  const t = useTranslations('inventory');

  if (expiringVials.length === 0 && lowStockVials.length === 0) return null;

  function getPeptideName(peptideId: string): string {
    return peptides.find((p) => p.id === peptideId)?.name ?? 'Unknown';
  }

  return (
    <div className="space-y-3">
      {lowStockVials.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <h3 className="text-sm font-medium text-amber-800">
            {t('reminders.lowStock')}
          </h3>
          <ul className="mt-2 space-y-1">
            {lowStockVials.map((v) => (
              <li key={v.id} className="text-sm text-amber-700">
                {getPeptideName(v.peptide_id)}
                {v.label ? ` (${v.label})` : ''} —{' '}
                {v.remaining_estimate}/{v.total_amount} {v.unit}
              </li>
            ))}
          </ul>
        </div>
      )}

      {expiringVials.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="text-sm font-medium text-red-800">
            {t('reminders.expiringSoon')}
          </h3>
          <ul className="mt-2 space-y-1">
            {expiringVials.map((v) => (
              <li key={v.id} className="text-sm text-red-700">
                {getPeptideName(v.peptide_id)}
                {v.label ? ` (${v.label})` : ''} —{' '}
                {t('fields.expiresOn')}: {v.expires_on}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
