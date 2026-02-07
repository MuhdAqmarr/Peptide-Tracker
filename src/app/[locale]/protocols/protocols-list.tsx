'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import type { Protocol } from '@/lib/db/types';
import { ProtocolForm } from '@/components/forms/protocol-form';
import { deleteProtocolAction } from './actions';

type Props = {
  protocols: Protocol[];
};

export function ProtocolsList({ protocols }: Props) {
  const t = useTranslations('protocols');
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
    const result = await deleteProtocolAction(id);
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
          <ProtocolForm
            onSuccess={handleSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {protocols.length === 0 && !showForm && (
        <p className="text-sm text-gray-500">{t('helper.startDate')}</p>
      )}

      <div className="space-y-3">
        {protocols.map((protocol) =>
          editingId === protocol.id ? (
            <div
              key={protocol.id}
              className="rounded-lg border border-blue-200 bg-white p-4"
            >
              <ProtocolForm
                protocol={protocol}
                onSuccess={handleSuccess}
                onCancel={() => setEditingId(null)}
              />
            </div>
          ) : (
            <div
              key={protocol.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">
                    {protocol.name}
                  </h3>
                  {protocol.is_active ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Active
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {protocol.start_date}
                  {protocol.end_date && ` → ${protocol.end_date}`}
                  {' · '}
                  {protocol.timezone}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/protocols/${protocol.id}`}
                  className="rounded px-3 py-1 text-xs font-medium text-green-600 hover:bg-green-50"
                >
                  View
                </Link>
                <button
                  onClick={() => setEditingId(protocol.id)}
                  className="rounded px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(protocol.id)}
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
