'use client';

import { useTranslations } from 'next-intl';
import { SectionWrapper } from './SectionWrapper';
import { TimelineDots } from './TimelineDots';

export function TechnologySection() {
  const t = useTranslations('landing');

  return (
    <SectionWrapper id="technology">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
        {/* Left: huge headline */}
        <div className="flex-1">
          <h2 className="text-3xl leading-tight font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            {t('technology.headline')}
          </h2>
        </div>

        {/* Right: description */}
        <div className="flex-1">
          <p className="text-base leading-relaxed text-gray-500 lg:text-lg">
            <span className="font-semibold text-gray-700">
              {t('technology.description').split('.')[0]}.
            </span>{' '}
            {t('technology.description').split('.').slice(1).join('.').trim()}
          </p>
        </div>
      </div>

      {/* Timeline dots */}
      <TimelineDots />
    </SectionWrapper>
  );
}
