'use client';

import { useActionState, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ProtocolItem, Peptide, FrequencyType } from '@/lib/db/types';
import {
  createProtocolItemAction,
  updateProtocolItemAction,
  type ActionState,
} from '@/app/[locale]/protocols/[id]/actions';

type Props = {
  protocolId: string;
  peptides: Peptide[];
  item?: ProtocolItem;
  onSuccess?: () => void;
  onCancel: () => void;
};

const initialState: ActionState = { success: false };

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ProtocolItemForm({
  protocolId,
  peptides,
  item,
  onSuccess,
  onCancel,
}: Props) {
  const ts = useTranslations('schedule');
  const tc = useTranslations('common');

  const [freqType, setFreqType] = useState<FrequencyType>(
    item?.frequency_type ?? 'ED',
  );

  const boundAction = item
    ? updateProtocolItemAction.bind(null, item.id, protocolId)
    : createProtocolItemAction.bind(null, protocolId);

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
      {/* Peptide selection */}
      <div>
        <label
          htmlFor="peptide_id"
          className="block text-sm font-medium text-gray-700"
        >
          Peptide
        </label>
        <select
          id="peptide_id"
          name="peptide_id"
          defaultValue={item?.peptide_id ?? ''}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="" disabled>
            Select...
          </option>
          {peptides.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.unit})
            </option>
          ))}
        </select>
      </div>

      {/* Dose amount */}
      <div>
        <label
          htmlFor="dose_value"
          className="block text-sm font-medium text-gray-700"
        >
          {ts('fields.amount')}
        </label>
        <input
          id="dose_value"
          name="dose_value"
          type="number"
          step="any"
          min="0"
          defaultValue={item?.dose_value ?? ''}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-400">{ts('helper.amount')}</p>
        {state.errors?.dose_value && (
          <p className="mt-1 text-xs text-red-600">
            {state.errors.dose_value[0]}
          </p>
        )}
      </div>

      {/* Frequency */}
      <div>
        <label
          htmlFor="frequency_type"
          className="block text-sm font-medium text-gray-700"
        >
          {ts('fields.frequency')}
        </label>
        <select
          id="frequency_type"
          name="frequency_type"
          value={freqType}
          onChange={(e) => setFreqType(e.target.value as FrequencyType)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="ED">{ts('freq.daily')}</option>
          <option value="EOD">{ts('freq.eod')}</option>
          <option value="WEEKLY">{ts('freq.weekly')}</option>
          <option value="CUSTOM">{ts('freq.custom')}</option>
        </select>
      </div>

      {/* Weekly: day checkboxes */}
      {freqType === 'WEEKLY' && (
        <div>
          <p className="mb-2 text-sm text-gray-600">{ts('helper.weekly')}</p>
          <div className="flex flex-wrap gap-2">
            {DAY_LABELS.map((label, i) => (
              <label key={i} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  name="days_of_week"
                  value={i}
                  defaultChecked={item?.days_of_week?.includes(i) ?? false}
                  className="rounded border-gray-300"
                />
                {label}
              </label>
            ))}
          </div>
          {state.errors?.days_of_week && (
            <p className="mt-1 text-xs text-red-600">
              {state.errors.days_of_week[0]}
            </p>
          )}
        </div>
      )}

      {/* Custom: interval days */}
      {freqType === 'CUSTOM' && (
        <div>
          <label
            htmlFor="interval_days"
            className="block text-sm font-medium text-gray-700"
          >
            Interval (days)
          </label>
          <input
            id="interval_days"
            name="interval_days"
            type="number"
            min="1"
            defaultValue={item?.interval_days ?? 3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-400">{ts('helper.custom')}</p>
          {state.errors?.interval_days && (
            <p className="mt-1 text-xs text-red-600">
              {state.errors.interval_days[0]}
            </p>
          )}
        </div>
      )}

      {/* Time of day */}
      <div>
        <label
          htmlFor="time_of_day"
          className="block text-sm font-medium text-gray-700"
        >
          {ts('fields.timeOfDay')}
        </label>
        <input
          id="time_of_day"
          name="time_of_day"
          type="time"
          defaultValue={item?.time_of_day?.slice(0, 5) ?? '08:00'}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-400">{ts('helper.timeOfDay')}</p>
      </div>

      {/* Site planning */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="site_plan_enabled"
          value="true"
          defaultChecked={item?.site_plan_enabled ?? false}
          className="rounded border-gray-300"
        />
        {ts('fields.sitePlanningOptional')}
      </label>

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
