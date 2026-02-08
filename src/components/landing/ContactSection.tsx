'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';

export function ContactSection() {
  const t = useTranslations('landing');

  return (
    <SectionWrapper id="contact">
      {/* Giant typography */}
      <div className="text-center">
        <h2 className="text-5xl font-black tracking-tight text-gray-900 sm:text-7xl lg:text-8xl">
          {t('contact.headline1')}{' '}
          <span className="text-gray-300">{t('contact.headline2')}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-base text-gray-500">{t('contact.description')}</p>
      </div>

      {/* CTA + form */}
      <div className="mx-auto mt-12 flex max-w-2xl flex-col gap-10 sm:flex-row sm:gap-12">
        {/* CTA button */}
        <div className="flex flex-col items-center gap-4 sm:items-start">
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 rounded-full bg-gray-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            {t('contact.cta')}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Contact form (client-only, no backend) */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-1 flex-col gap-4"
        >
          <input
            type="text"
            placeholder={t('contact.form.name')}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
          />
          <input
            type="email"
            placeholder={t('contact.form.email')}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
          />
          <textarea
            placeholder={t('contact.form.message')}
            rows={3}
            className="resize-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            className="self-start rounded-full border border-gray-200 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            {t('contact.form.send')}
          </button>
        </form>
      </div>

      {/* Footer disclaimer */}
      <footer className="mt-16 border-t border-gray-100 pt-6 text-center">
        <p className="text-xs text-gray-400">{t('footer.disclaimer')}</p>
        <p className="mt-1 text-xs text-gray-300">
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </p>
      </footer>
    </SectionWrapper>
  );
}
