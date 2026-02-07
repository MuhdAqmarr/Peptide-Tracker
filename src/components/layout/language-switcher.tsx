'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

const localeLabels: Record<Locale, string> = {
  en: 'EN',
  ms: 'BM',
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function handleSwitch(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-1">
      {(Object.entries(localeLabels) as [Locale, string][]).map(
        ([loc, label]) => (
          <button
            key={loc}
            onClick={() => handleSwitch(loc)}
            className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
              locale === loc
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
            aria-label={`Switch to ${label}`}
          >
            {label}
          </button>
        ),
      )}
    </div>
  );
}
