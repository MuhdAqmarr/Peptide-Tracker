'use client';

import type { ReactNode } from 'react';
import { usePathname } from '@/i18n/navigation';
import { Navbar } from './navbar';
import { OfflineIndicator } from './offline-indicator';

export function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  if (isLanding) {
    return (
      <>
        {children}
        <OfflineIndicator />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-4 sm:py-6">{children}</main>
      <OfflineIndicator />
    </>
  );
}
