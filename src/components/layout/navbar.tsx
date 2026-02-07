'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import Image from 'next/image';
import { LanguageSwitcher } from './language-switcher';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { href: '/dashboard' as const, labelKey: 'nav.dashboard' as const },
  { href: '/protocols' as const, labelKey: 'nav.protocols' as const },
  { href: '/peptides' as const, labelKey: 'nav.peptides' as const },
  { href: '/logs' as const, labelKey: 'nav.logs' as const },
  { href: '/inventory' as const, labelKey: 'nav.inventory' as const },
  { href: '/settings' as const, labelKey: 'nav.settings' as const },
];

type UserInfo = { email?: string; displayName?: string } | null;

export function Navbar() {
  const t = useTranslations('common');
  const tAuth = useTranslations('auth');
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserInfo>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser) {
        setUser({ email: authUser.email ?? undefined });
        supabase
          .from('profiles')
          .select('display_name')
          .eq('id', authUser.id)
          .single()
          .then(({ data: profile }) => {
            if (profile?.display_name) {
              setUser({ email: authUser.email ?? undefined, displayName: profile.display_name });
            }
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/login');
    router.refresh();
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Image src="/logo.png" alt="" width={28} height={28} className="h-7 w-7" />
          {t('appName')}
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {user &&
            navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}

          <div className="ml-2 flex items-center gap-2 border-l border-gray-200 pl-2">
            <LanguageSwitcher />

            {user ? (
              <div className="flex items-center gap-2">
                <span className="max-w-[120px] truncate text-xs text-gray-500">
                  {user.displayName ?? user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="rounded-md px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                >
                  {tAuth('signOut')}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-md px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
              >
                {tAuth('signIn.title')}
              </Link>
            )}
          </div>
        </div>

        {/* Mobile: lang switch + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 pb-4 pt-2 md:hidden">
          {user && (
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-3 border-t border-gray-200 pt-3">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="truncate text-sm text-gray-500">
                  {user.displayName ?? user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                >
                  {tAuth('signOut')}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="block rounded-md px-3 py-2.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
              >
                {tAuth('signIn.title')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
