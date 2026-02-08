'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const sections = [
  { id: 'intro', key: 'intro' },
  { id: 'features', key: 'features' },
  { id: 'technology', key: 'technology' },
  { id: 'pricing', key: 'pricing' },
  { id: 'contact', key: 'contact' },
] as const;

export function SideNav() {
  const t = useTranslations('landing');
  const [active, setActive] = useState('intro');

  function scrollTo(id: string) {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      {/* Desktop: vertical side nav */}
      <nav className="hidden flex-col gap-2 md:flex" aria-label="Section navigation">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className={`group flex items-center gap-3 text-left text-sm transition-colors ${
              active === section.id
                ? 'font-semibold text-gray-900'
                : 'font-medium text-gray-400 hover:text-gray-600'
            }`}
          >
            <span
              className={`inline-block h-px transition-all ${
                active === section.id ? 'w-6 bg-gray-900' : 'w-3 bg-gray-300 group-hover:w-5'
              }`}
            />
            {t(`nav.${section.key}`)}
          </button>
        ))}
      </nav>

      {/* Mobile: horizontal stepper */}
      <nav
        className="flex items-center gap-3 overflow-x-auto pb-2 md:hidden"
        aria-label="Section navigation"
      >
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              active === section.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {t(`nav.${section.key}`)}
          </button>
        ))}
      </nav>
    </>
  );
}
