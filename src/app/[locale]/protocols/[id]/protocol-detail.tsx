'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import type { Protocol, ProtocolItem, Peptide } from '@/lib/db/types';
import { ProtocolItemForm } from '@/components/forms/protocol-item-form';
import { deleteProtocolItemAction } from './actions';

type Props = {
  protocol: Protocol;
  items: ProtocolItem[];
  peptides: Peptide[];
};

const FREQ_LABELS: Record<string, string> = {
  ED: 'Every day',
  EOD: 'Every other day',
  WEEKLY: 'Weekly',
  CUSTOM: 'Custom',
};

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ProtocolDetail({ protocol, items, peptides }: Props) {
  const ts = useTranslations('schedule');
  const tc = useTranslations('common');
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSuccess = useCallback(() => {
    setShowForm(false);
    setEditingId(null);
    router.refresh();
  }, [router]);

  async function handleDelete(itemId: string) {
    const result = await deleteProtocolItemAction(itemId, protocol.id);
    if (result.success) {
      router.refresh();
    }
  }

  function getPeptideName(peptideId: string): string {
    const p = peptides.find((pep) => pep.id === peptideId);
    return p ? `${p.name} (${p.unit})` : 'Unknown';
  }

  function formatFrequency(item: ProtocolItem): string {
    let label = FREQ_LABELS[item.frequency_type] || item.frequency_type;
    if (item.frequency_type === 'WEEKLY' && item.days_of_week) {
      const days = item.days_of_week.map((d) => DAY_SHORT[d]).join(', ');
      label += `: ${days}`;
    }
    if (item.frequency_type === 'CUSTOM' && item.interval_days) {
      label += `: every ${item.interval_days} days`;
    }
    return label;
  }

  return (
    <div className="mt-4 space-y-4">
      {peptides.length === 0 && !showForm && (
        <p className="text-sm text-amber-600">
          Add peptides first before creating schedule items.
        </p>
      )}

      {peptides.length > 0 && !showForm && !editingId && (
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add Schedule Item
        </button>
      )}

      {showForm && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <ProtocolItemForm
            protocolId={protocol.id}
            peptides={peptides}
            onSuccess={handleSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {items.length === 0 && !showForm && (
        <p className="text-sm text-gray-500">
          No schedule items yet. Add one to start generating doses.
        </p>
      )}

      <div className="space-y-3">
        {items.map((item) =>
          editingId === item.id ? (
            <div
              key={item.id}
              className="rounded-lg border border-blue-200 bg-white p-4"
            >
              <ProtocolItemForm
                protocolId={protocol.id}
                peptides={peptides}
                item={item}
                onSuccess={handleSuccess}
                onCancel={() => setEditingId(null)}
              />
            </div>
          ) : (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
            >
              <div>
                <h3 className="font-medium text-gray-900">
                  {getPeptideName(item.peptide_id)}
                </h3>
                <p className="text-sm text-gray-500">
                  {item.dose_value} · {formatFrequency(item)} ·{' '}
                  {ts('fields.timeOfDay')}: {item.time_of_day.slice(0, 5)}
                </p>
                {item.site_plan_enabled && (
                  <p className="text-xs text-blue-500">
                    {ts('fields.sitePlanningOptional')}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingId(item.id)}
                  className="rounded px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
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
