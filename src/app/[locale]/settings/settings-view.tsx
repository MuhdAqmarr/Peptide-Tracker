'use client';

import { useActionState, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import {
  updateDisplayNameAction,
  deleteAccountAction,
  type ActionState,
} from './actions';

type Props = {
  displayName: string;
};

const initialState: ActionState = { success: false };

export function SettingsView({ displayName }: Props) {
  const t = useTranslations('settings');
  const tc = useTranslations('common');
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [nameState, nameAction, namePending] = useActionState(
    updateDisplayNameAction,
    initialState,
  );

  useEffect(() => {
    if (nameState.success) {
      router.refresh();
    }
  }, [nameState.success, router]);

  async function handleDeleteAccount() {
    setDeleting(true);
    await deleteAccountAction();
  }

  return (
    <div className="space-y-8">
      {/* Profile */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold">{t('profile.title')}</h2>
        <form action={nameAction} className="mt-4 space-y-3">
          <div>
            <label
              htmlFor="display_name"
              className="block text-sm font-medium text-gray-700"
            >
              {t('profile.displayName')}
            </label>
            <input
              id="display_name"
              name="display_name"
              type="text"
              defaultValue={displayName}
              required
              className="mt-1 block w-full max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          {nameState.message && (
            <p className="text-sm text-red-600">{nameState.message}</p>
          )}
          {nameState.success && (
            <p className="text-sm text-green-600">{tc('toasts.saved')}</p>
          )}
          <button
            type="submit"
            disabled={namePending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {namePending ? '...' : tc('actions.save')}
          </button>
        </form>
      </section>

      {/* Export */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold">{t('privacy.exportTitle')}</h2>
        <p className="mt-1 text-sm text-gray-500">
          {t('privacy.exportHelper')}
        </p>
        <div className="mt-4 flex gap-3">
          <a
            href="/api/export?format=json"
            download
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {tc('actions.exportJson')}
          </a>
          <a
            href="/api/export?format=csv"
            download
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {tc('actions.exportCsv')}
          </a>
        </div>
      </section>

      {/* Delete Account */}
      <section className="rounded-lg border border-red-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-red-700">
          {t('privacy.deleteTitle')}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {t('privacy.deleteWarning')}
        </p>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="mt-4 rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            {t('privacy.deleteTitle')}
          </button>
        ) : (
          <div className="mt-4 space-y-3">
            <p className="text-sm font-medium text-red-700">
              {t('privacy.confirmDelete')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? '...' : t('privacy.confirmYes')}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {tc('actions.cancel')}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
