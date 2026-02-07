'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import type { Peptide } from '@/lib/db/types';
import {
  createPeptideAction,
  updatePeptideAction,
  type ActionState,
} from '@/app/[locale]/peptides/actions';

type Props = {
  peptide?: Peptide;
  onSuccess?: () => void;
  onCancel: () => void;
};

const initialState: ActionState = { success: false };

export function PeptideForm({ peptide, onSuccess, onCancel }: Props) {
  const t = useTranslations('peptides');
  const tc = useTranslations('common');
  const formRef = useRef<HTMLFormElement>(null);

  const boundAction = peptide
    ? updatePeptideAction.bind(null, peptide.id)
    : createPeptideAction;

  const [state, formAction, isPending] = useActionState(
    boundAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      onSuccess?.();
    }
  }, [state.success, onSuccess]);

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
          defaultValue={peptide?.name ?? ''}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {state.errors?.name && (
          <p className="mt-1 text-xs text-red-600">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="unit"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.unit')}
        </label>
        <input
          id="unit"
          name="unit"
          type="text"
          defaultValue={peptide?.unit ?? ''}
          placeholder="mg, mcg, IU"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {state.errors?.unit && (
          <p className="mt-1 text-xs text-red-600">{state.errors.unit[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="route"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.routeOptional')}
        </label>
        <input
          id="route"
          name="route"
          type="text"
          defaultValue={peptide?.route ?? ''}
          placeholder="SubQ, IM"
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
          defaultValue={peptide?.notes ?? ''}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <p className="text-xs text-gray-400">{t('helper.trackingOnly')}</p>

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
