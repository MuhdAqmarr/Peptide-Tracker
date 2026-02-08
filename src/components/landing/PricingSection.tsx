'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Check } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';

const featureCount = 6;

export function PricingSection() {
  const t = useTranslations('landing');

  return (
    <SectionWrapper id="pricing">
      <div className="text-center">
        <span className="mb-2 inline-block text-xs font-semibold tracking-wider text-blue-600 uppercase">
          {t('pricing.eyebrow')}
        </span>
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{t('pricing.title')}</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-gray-500">{t('pricing.subtitle')}</p>
      </div>

      <div className="mx-auto mt-12 max-w-md">
        <div className="relative flex flex-col rounded-2xl border border-blue-200 bg-blue-50/30 p-6 shadow-md sm:p-8">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white">
            {t('pricing.badge')}
          </span>

          <h3 className="text-lg font-bold text-gray-900">{t('pricing.name')}</h3>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl font-bold text-gray-900">{t('pricing.price')}</span>
            <span className="text-sm text-gray-400">{t('pricing.period')}</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">{t('pricing.description')}</p>

          <ul className="mt-6 flex flex-col gap-3">
            {Array.from({ length: featureCount }, (_, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <Check size={16} className="mt-0.5 shrink-0 text-green-500" />
                {t(`pricing.features.f${i + 1}`)}
              </li>
            ))}
          </ul>

          <Link
            href="/dashboard"
            className="mt-8 block rounded-full bg-blue-600 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            {t('pricing.cta')}
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}
