'use client';

import { useTranslations } from 'next-intl';
import { useOnlineStatus } from '@/lib/offline/use-online-status';

export function OfflineIndicator() {
  const t = useTranslations('common');
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
      {t('offline')}
    </div>
  );
}
