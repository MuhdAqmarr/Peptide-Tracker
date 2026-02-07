'use client';

import { useActionState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import type { Vial, Peptide } from '@/lib/db/types';
import {
  createVialAction,
  updateVialAction,
  type ActionState,
} from '@/app/[locale]/inventory/actions';

type Props = {
  peptides: Peptide[];
  vial?: Vial;
  onSuccess?: () => void;
  onCancel: () => void;
};

const initialState: ActionState = { success: false };

export function VialForm({ peptides, vial, onSuccess, onCancel }: Props) {
  const t = useTranslations('inventory');
  const tc = useTranslations('common');

  const boundAction = vial
    ? updateVialAction.bind(null, vial.id)
    : createVialAction;

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
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="peptide_id"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.peptide')}
        </label>
        <select
          id="peptide_id"
          name="peptide_id"
          defaultValue={vial?.peptide_id ?? ''}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="" disabled>
            Select...
          </option>
          {peptides.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="total_amount"
            className="block text-sm font-medium text-gray-700"
          >
            {t('fields.totalAmount')}
          </label>
          <input
            id="total_amount"
            name="total_amount"
            type="number"
            step="any"
            min="0"
            defaultValue={vial?.total_amount ?? ''}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
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
            defaultValue={vial?.unit ?? 'mg'}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="remaining_estimate"
          className="block text-sm font-medium text-gray-700"
        >
          {t('fields.remaining')}
        </label>
        <input
          id="remaining_estimate"
          name="remaining_estimate"
          type="number"
          step="any"
          min="0"
          defaultValue={vial?.remaining_estimate ?? ''}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="label"
            className="block text-sm font-medium text-gray-700"
          >
            {t('fields.label')}
          </label>
          <input
            id="label"
            name="label"
            type="text"
            defaultValue={vial?.label ?? ''}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="batch"
            className="block text-sm font-medium text-gray-700"
          >
            {t('fields.batch')}
          </label>
          <input
            id="batch"
            name="batch"
            type="text"
            defaultValue={vial?.batch ?? ''}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="opened_on"
            className="block text-sm font-medium text-gray-700"
          >
            {t('fields.openedOn')}
          </label>
          <input
            id="opened_on"
            name="opened_on"
            type="date"
            defaultValue={vial?.opened_on ?? ''}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="expires_on"
            className="block text-sm font-medium text-gray-700"
          >
            {t('fields.expiresOn')}
          </label>
          <input
            id="expires_on"
            name="expires_on"
            type="date"
            defaultValue={vial?.expires_on ?? ''}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

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
