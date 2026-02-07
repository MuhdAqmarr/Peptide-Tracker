'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import type { Peptide } from '@/lib/db/types';
import { PeptideForm } from '@/components/forms/peptide-form';
import { deletePeptideAction } from './actions';

type Props = {
  peptides: Peptide[];
};

export function PeptidesList({ peptides }: Props) {
  const t = useTranslations('peptides');
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
    const result = await deletePeptideAction(id);
    if (result.success) {
      router.refresh();
    }
  }

  return (
    <div className="mt-6 space-y-4">
      {!showForm && !editingId && (
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {t('actions.new')}
        </button>
      )}

      {showForm && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <PeptideForm
            onSuccess={handleSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {peptides.length === 0 && !showForm && (
        <p className="text-sm text-gray-500">{t('helper.trackingOnly')}</p>
      )}

      <div className="space-y-3">
        {peptides.map((peptide) =>
          editingId === peptide.id ? (
            <div
              key={peptide.id}
              className="rounded-lg border border-blue-200 bg-white p-4"
            >
              <PeptideForm
                peptide={peptide}
                onSuccess={handleSuccess}
                onCancel={() => setEditingId(null)}
              />
            </div>
          ) : (
            <div
              key={peptide.id}
              className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <h3 className="font-medium text-gray-900">{peptide.name}</h3>
                <p className="text-sm text-gray-500">
                  {peptide.unit}
                  {peptide.route && ` · ${peptide.route}`}
                </p>
                {peptide.notes && (
                  <p className="mt-1 text-xs text-gray-400">{peptide.notes}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingId(peptide.id)}
                  className="rounded px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(peptide.id)}
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
