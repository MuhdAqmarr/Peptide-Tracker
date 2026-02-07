'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import type { Vial, Peptide } from '@/lib/db/types';
import { VialForm } from '@/components/forms/vial-form';
import { deleteVialAction } from './actions';

type Props = {
  vials: Vial[];
  peptides: Peptide[];
};

export function VialsList({ vials, peptides }: Props) {
  const t = useTranslations('inventory');
  const tc = useTranslations('common');
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSuccess = useCallback(() => {
    setShowForm(false);
    setEditingId(null);
    router.refresh();
  }, [router]);

  async function handleDelete(id: string) {
    const result = await deleteVialAction(id);
    if (result.success) router.refresh();
  }

  function getPeptideName(peptideId: string): string {
    const p = peptides.find((pep) => pep.id === peptideId);
    return p?.name ?? 'Unknown';
  }

  function getRemainingPercent(vial: Vial): number | null {
    if (
      vial.remaining_estimate === null ||
      vial.total_amount === 0
    )
      return null;
    return Math.round((vial.remaining_estimate / vial.total_amount) * 100);
  }

  return (
    <div className="mt-6 space-y-4">
      {!showForm && !editingId && (
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + {t('actions.addVial')}
        </button>
      )}

      {showForm && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <VialForm
            peptides={peptides}
            onSuccess={handleSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {vials.length === 0 && !showForm && (
        <p className="text-sm text-gray-500">{t('empty')}</p>
      )}

      <div className="space-y-3">
        {vials.map((vial) =>
          editingId === vial.id ? (
            <div
              key={vial.id}
              className="rounded-lg border border-blue-200 bg-white p-4"
            >
              <VialForm
                peptides={peptides}
                vial={vial}
                onSuccess={handleSuccess}
                onCancel={() => setEditingId(null)}
              />
            </div>
          ) : (
            <div
              key={vial.id}
              className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">
                    {getPeptideName(vial.peptide_id)}
                  </h3>
                  {vial.label && (
                    <span className="text-xs text-gray-400">{vial.label}</span>
                  )}
                  {(() => {
                    const pct = getRemainingPercent(vial);
                    if (pct === null) return null;
                    const color =
                      pct <= 20
                        ? 'bg-red-100 text-red-700'
                        : pct <= 50
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700';
                    return (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${color}`}
                      >
                        {pct}%
                      </span>
                    );
                  })()}
                </div>
                <p className="text-sm text-gray-500">
                  {vial.remaining_estimate !== null
                    ? `${vial.remaining_estimate} / ${vial.total_amount} ${vial.unit}`
                    : `${vial.total_amount} ${vial.unit}`}
                  {vial.batch && ` · ${t('fields.batch')}: ${vial.batch}`}
                </p>
                <p className="text-xs text-gray-400">
                  {vial.opened_on &&
                    `${t('fields.openedOn')}: ${vial.opened_on}`}
                  {vial.opened_on && vial.expires_on && ' · '}
                  {vial.expires_on &&
                    `${t('fields.expiresOn')}: ${vial.expires_on}`}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingId(vial.id)}
                  className="rounded px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(vial.id)}
                  className="rounded px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  {tc('actions.delete')}
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
