'use client';

import { useTranslations } from 'next-intl';
import { SectionWrapper } from './SectionWrapper';
import { Carousel } from './Carousel';

export function TestimonialsSection() {
  const t = useTranslations('landing');

  return (
    <SectionWrapper id="testimonials" className="bg-gray-50/50">
      <div className="text-center">
        <span className="mb-2 inline-block text-xs font-semibold tracking-wider text-blue-600 uppercase">
          {t('testimonials.eyebrow')}
        </span>
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{t('testimonials.title')}</h2>
      </div>
      <div className="mt-10">
        <Carousel />
      </div>
    </SectionWrapper>
  );
}
