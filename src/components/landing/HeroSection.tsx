'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { SideNav } from './SideNav';
import { HeroVisual } from './HeroVisual';

export function HeroSection() {
  const t = useTranslations('landing');

  return (
    <section id="intro" className="scroll-mt-20 px-6 pb-8 pt-12 sm:px-10 sm:pt-20">
      {/* Mobile stepper */}
      <div className="mb-8 lg:hidden">
        <SideNav />
      </div>

      <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
        {/* Left: side nav (desktop) + hero text */}
        <div className="flex flex-1 gap-8">
          <div className="hidden pt-2 lg:block">
            <SideNav />
          </div>
          <div className="flex-1">
            <span className="mb-4 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-600 uppercase">
              {t('hero.eyebrow')}
            </span>
            <h1 className="text-4xl leading-tight font-bold tracking-tight text-gray-900 sm:text-5xl xl:text-6xl">
              {t('hero.headlineOne')}
              <br />
              <span className="text-gray-400">{t('hero.headlineTwo')}</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-gray-500 lg:text-lg">
              {t('hero.description')}
            </p>
            <div className="mt-8">
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900"
              >
                {t('hero.cta')}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right: visual */}
        <div className="flex-1 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50/50">
          <HeroVisual />
        </div>
      </div>

      {/* Bottom card strip */}
      <div className="mt-12 flex flex-col gap-4 border-t border-gray-100 pt-8 sm:flex-row sm:items-start sm:gap-8">
        <span className="text-5xl font-bold text-gray-200 sm:text-7xl">{t('hero.cardIndex')}</span>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium tracking-wider text-gray-400 uppercase">
            {t('hero.cardDate')}
          </span>
          <h3 className="text-lg font-semibold text-gray-900">{t('hero.cardTitle')}</h3>
          <p className="max-w-md text-sm leading-relaxed text-gray-500">{t('hero.cardDescription')}</p>
        </div>
      </div>

      {/* Scroll for more pill */}
      <div className="mt-8 flex justify-end">
        <span className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-400">
          {t('hero.scrollMore')}
        </span>
      </div>
    </section>
  );
}
