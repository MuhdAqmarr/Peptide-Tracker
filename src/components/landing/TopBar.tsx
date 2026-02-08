'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { Menu, X, Search, Volume2 } from 'lucide-react';

const navItems = [
  { id: 'intro', key: 'intro' },
  { id: 'features', key: 'features' },
  { id: 'technology', key: 'technology' },
  { id: 'pricing', key: 'pricing' },
  { id: 'contact', key: 'contact' },
] as const;

export function TopBar() {
  const t = useTranslations('landing');
  const tc = useTranslations('common');
  const [menuOpen, setMenuOpen] = useState(false);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Left: logo + menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 md:hidden"
            aria-label={t('topbar.menu')}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <Image src="/logo.png" alt="" width={28} height={28} className="h-7 w-7" />
            {tc('appName')}
          </Link>
        </div>

        {/* Center: desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              {t(`nav.${item.key}`)}
            </button>
          ))}
        </nav>

        {/* Right: icon buttons + language + CTA */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            className="hidden rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 sm:inline-flex"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
          <button
            className="hidden rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 sm:inline-flex"
            aria-label="Sound"
          >
            <Volume2 size={18} />
          </button>
          <LanguageSwitcher />
          <Link
            href="/dashboard"
            className="ml-1 rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:ml-2"
          >
            {t('topbar.goToApp')}
          </Link>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="rounded-lg px-4 py-2.5 text-left text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                {t(`nav.${item.key}`)}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
