'use client';

import { useActionState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  logInjectionAction,
  type ActionState,
} from '@/app/[locale]/dashboard/actions';
import { INJECTION_SITES } from '@/lib/sites/constants';

type Props = {
  doseId: string;
  suggestedSiteId?: string;
  onSuccess?: () => void;
  onCancel: () => void;
};

const initialState: ActionState = { success: false };

export function InjectionLogForm({
  doseId,
  suggestedSiteId,
  onSuccess,
  onCancel,
}: Props) {
  const t = useTranslations('dashboard');
  const tc = useTranslations('common');

  const [state, formAction, isPending] = useActionState(
    logInjectionAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      onSuccess?.();
    }
  }, [state.success, onSuccess]);

  const now = new Date();
  const defaultTime = now.toISOString().slice(0, 16);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="scheduled_dose_id" value={doseId} />

      <div>
        <label
          htmlFor="actual_time"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.time')}
        </label>
        <input
          id="actual_time"
          name="actual_time"
          type="datetime-local"
          defaultValue={defaultTime}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="site"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.siteOptional')}
        </label>
        <select
          id="site"
          name="site"
          defaultValue={suggestedSiteId ?? ''}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">--</option>
          {INJECTION_SITES.map((site) => (
            <option key={site.id} value={site.id}>
              {site.label}
              {site.id === suggestedSiteId ? ' *' : ''}
            </option>
          ))}
        </select>
        {suggestedSiteId && (
          <p className="mt-1 text-xs text-green-600">
            * = suggested next site
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="pain_score"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.comfortOptional')}
        </label>
        <input
          id="pain_score"
          name="pain_score"
          type="number"
          min="0"
          max="10"
          placeholder="0-10"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.notesOptional')}
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {state.message && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <div className="flex gap-3 pt-1">
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
