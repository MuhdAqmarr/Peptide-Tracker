import createIntlMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';

const intlMiddleware = createIntlMiddleware(routing);

// Routes that do NOT require authentication
const publicPatterns = [/^\/$/, /^\/[a-z]{2}$/, /^\/[a-z]{2}\/login$/];

function isPublicRoute(pathname: string): boolean {
  return publicPatterns.some((pattern) => pattern.test(pathname));
}

export async function proxy(request: NextRequest) {
  // 1. Run next-intl middleware first (handles locale redirect/rewrite)
  const intlResponse = intlMiddleware(request);

  // 2. Run Supabase session refresh, piping cookies onto the intl response
  const { user } = await updateSession(request, intlResponse);

  // 3. Auth guard — redirect unauthenticated users to login
  const { pathname } = request.nextUrl;
  if (!user && !isPublicRoute(pathname)) {
    // Detect the locale from the path or fall back to default
    const localeMatch = pathname.match(/^\/([a-z]{2})\//);
    const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
    const loginUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return intlResponse;
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
