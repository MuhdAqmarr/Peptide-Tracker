'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
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
        <Link href="/" className="text-lg font-bold text-gray-900">
          {t('appName')}
        </Link>

        <div className="flex items-center gap-1">
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
                <span className="text-xs text-gray-500">
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
      </div>
    </nav>
  );
}
