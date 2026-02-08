'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Minus, Wifi } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';

const featureKeys = ['scheduling', 'tracking', 'inventory'] as const;

export function FeatureSection() {
  const t = useTranslations('landing');
  const [expanded, setExpanded] = useState<string | null>(null);

  function toggle(key: string) {
    setExpanded(expanded === key ? null : key);
  }

  return (
    <SectionWrapper id="features">
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
        {/* Left: large media card */}
        <div className="relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 sm:p-12">
          {/* Illustration placeholder */}
          <div className="flex h-48 items-center justify-center sm:h-64">
            <svg
              viewBox="0 0 160 120"
              className="h-32 w-44 text-blue-200 sm:h-40 sm:w-56"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              aria-hidden="true"
            >
              <rect x="10" y="10" width="60" height="40" rx="8" className="fill-blue-100 stroke-blue-300" />
              <rect x="80" y="20" width="70" height="35" rx="8" className="fill-indigo-100 stroke-indigo-300" />
              <rect x="20" y="60" width="50" height="30" rx="6" className="fill-purple-100 stroke-purple-300" />
              <rect x="85" y="65" width="55" height="45" rx="8" className="fill-blue-100 stroke-blue-300" />
              <line x1="40" y1="25" x2="55" y2="25" className="stroke-blue-400" strokeWidth="2" />
              <line x1="40" y1="32" x2="50" y2="32" className="stroke-blue-300" strokeWidth="1.5" />
              <circle cx="115" cy="37" r="6" className="fill-indigo-200 stroke-indigo-400" />
            </svg>
          </div>

          {/* Highlight card overlay (top-right) */}
          <div className="absolute right-4 top-4 rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur sm:right-6 sm:top-6 sm:p-4">
            <div className="mb-1 flex items-center gap-1.5">
              <Wifi size={14} className="text-green-500" />
              <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">
                {t('features.highlight.label')}
              </span>
            </div>
            <p className="text-xs font-medium text-gray-700">{t('features.highlight.title')}</p>
            <p className="mt-0.5 text-xs text-gray-400">{t('features.highlight.description')}</p>
          </div>
        </div>

        {/* Right: heading + expandable rows */}
        <div className="flex flex-1 flex-col justify-center">
          <span className="mb-2 text-xs font-semibold tracking-wider text-blue-600 uppercase">
            {t('features.eyebrow')}
          </span>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{t('features.title')}</h2>

          <button className="mt-4 self-start rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
            {t('features.learnMore')}
          </button>

          {/* Expandable rows */}
          <div className="mt-8 divide-y divide-gray-100">
            {featureKeys.map((key) => {
              const isOpen = expanded === key;
              return (
                <div key={key} className="py-4">
                  <button
                    onClick={() => toggle(key)}
                    className="flex w-full items-center justify-between text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-gray-800">
                      {t(`features.items.${key}.title`)}
                    </span>
                    <span className="ml-4 shrink-0 rounded-full border border-gray-200 p-1 text-gray-400">
                      {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="mt-3 pr-8 text-sm leading-relaxed text-gray-500">
                      {t(`features.items.${key}.description`)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
