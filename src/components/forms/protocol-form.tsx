'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import type { Protocol } from '@/lib/db/types';
import {
  createProtocolAction,
  updateProtocolAction,
  type ActionState,
} from '@/app/[locale]/protocols/actions';

type Props = {
  protocol?: Protocol;
  onSuccess?: () => void;
  onCancel: () => void;
};

const initialState: ActionState = { success: false };

export function ProtocolForm({ protocol, onSuccess, onCancel }: Props) {
  const t = useTranslations('protocols');
  const tc = useTranslations('common');
  const formRef = useRef<HTMLFormElement>(null);

  const boundAction = protocol
    ? updateProtocolAction.bind(null, protocol.id)
    : createProtocolAction;

  const [state, formAction, isPending] = useActionState(
    boundAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      onSuccess?.();
    }
  }, [state.success, onSuccess]);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.name')}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={protocol?.name ?? ''}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {state.errors?.name && (
          <p className="mt-1 text-xs text-red-600">{state.errors.name[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="start_date"
            className="block text-sm font-medium text-gray-700"
          >
            {t('fields.startDate')}
          </label>
          <input
            id="start_date"
            name="start_date"
            type="date"
            defaultValue={protocol?.start_date ?? todayStr}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-400">{t('helper.startDate')}</p>
          {state.errors?.start_date && (
            <p className="mt-1 text-xs text-red-600">
              {state.errors.start_date[0]}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="end_date"
            className="block text-sm font-medium text-gray-700"
          >
            {t('fields.endDateOptional')}
          </label>
          <input
            id="end_date"
            name="end_date"
            type="date"
            defaultValue={protocol?.end_date ?? ''}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-400">{t('helper.endDate')}</p>
        </div>
      </div>

      <div>
        <label
          htmlFor="timezone"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.timezone')}
        </label>
        <select
          id="timezone"
          name="timezone"
          defaultValue={protocol?.timezone ?? 'Asia/Kuala_Lumpur'}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="Asia/Kuala_Lumpur">Asia/Kuala_Lumpur (MYT)</option>
          <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
          <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
          <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
          <option value="America/New_York">America/New_York (ET)</option>
          <option value="America/Los_Angeles">America/Los_Angeles (PT)</option>
          <option value="Europe/London">Europe/London (GMT)</option>
          <option value="UTC">UTC</option>
        </select>
        <p className="mt-1 text-xs text-gray-400">{t('helper.timezone')}</p>
      </div>

      {protocol && (
        <div className="flex items-center gap-2">
          <input
            id="is_active"
            name="is_active"
            type="hidden"
            value={protocol.is_active ? 'true' : 'false'}
          />
        </div>
      )}

      {state.message && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? '...' : tc('actions.save')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {tc('actions.cancel')}
        </button>
      </div>
    </form>
  );
}
