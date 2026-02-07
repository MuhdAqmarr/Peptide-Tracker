'use client';

import { useActionState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  createSymptomLogAction,
  type ActionState,
} from '@/app/[locale]/logs/actions';

type Props = {
  onSuccess?: () => void;
  onCancel: () => void;
};

const initialState: ActionState = { success: false };

const SCORE_FIELDS = [
  { name: 'nausea', labelKey: 'nausea' },
  { name: 'headache', labelKey: 'headache' },
  { name: 'sleep', labelKey: 'sleep' },
  { name: 'appetite', labelKey: 'appetite' },
] as const;

export function SymptomLogForm({ onSuccess, onCancel }: Props) {
  const t = useTranslations('logs');
  const tc = useTranslations('common');

  const [state, formAction, isPending] = useActionState(
    createSymptomLogAction,
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
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="log_time"
          className="block text-sm font-medium text-gray-700"
        >
          {t('symptoms.title')}
        </label>
        <input
          id="log_time"
          name="log_time"
          type="datetime-local"
          defaultValue={defaultTime}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-400">{t('symptoms.helper')}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {SCORE_FIELDS.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700"
            >
              {t(`symptoms.${field.labelKey}`)}
            </label>
            <input
              id={field.name}
              name={field.name}
              type="number"
              min="0"
              max="10"
              placeholder="0-10"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          {t('symptoms.notes')}
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
